import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

function safeBool(value: string | undefined | null) {
  return !!value && value.length > 0;
}

function redact(value: string | undefined | null) {
  if (!value) return null;
  const suffix = value.slice(-6);
  return `***${suffix} (len=${value.length})`;
}


serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    console.log('[google-calendar-auth] request', {
      method: req.method,
      path: url.pathname,
      action,
      hasGoogleClientId: safeBool(GOOGLE_CLIENT_ID),
      hasGoogleClientSecret: safeBool(GOOGLE_CLIENT_SECRET),
      hasBackendUrl: safeBool(SUPABASE_URL),
      hasServiceRoleKey: safeBool(SUPABASE_SERVICE_ROLE_KEY),
    });

    // Handle OAuth callback
    if (action === 'callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');

      console.log('[google-calendar-auth] callback received', {
        hasCode: !!code,
        codeLen: code?.length ?? 0,
        hasState: !!state,
        stateLen: state?.length ?? 0,
      });

      if (!code || !state) {
        console.error('[google-calendar-auth] callback missing params', {
          hasCode: !!code,
          hasState: !!state,
        });
        return new Response('Missing code or state', { status: 400 });
      }

      // Parse state to get user info and redirect URL
      let stateData;
      try {
        stateData = JSON.parse(atob(state));
      } catch (err) {
        console.error('[google-calendar-auth] invalid state', {
          error: err instanceof Error ? err.message : String(err),
          statePreview: state.slice(0, 24),
        });
        return new Response('Invalid state', { status: 400 });
      }

      const { userId, redirectUrl } = stateData;
      console.log('[google-calendar-auth] parsed state', {
        userId,
        redirectUrl,
      });

      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID!,
          client_secret: GOOGLE_CLIENT_SECRET!,
          redirect_uri: `${SUPABASE_URL}/functions/v1/google-calendar-auth?action=callback`,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenResponse.json();
      console.log('[google-calendar-auth] token exchange result', {
        status: tokenResponse.status,
        ok: tokenResponse.ok,
        hasAccessToken: safeBool(tokenData?.access_token),
        accessToken: redact(tokenData?.access_token),
        hasRefreshToken: safeBool(tokenData?.refresh_token),
        expiresIn: tokenData?.expires_in,
        scope: tokenData?.scope,
        error: tokenData?.error,
        errorDescription: tokenData?.error_description,
      });

      if (!tokenResponse.ok) {
        console.error('[google-calendar-auth] token exchange failed', {
          status: tokenResponse.status,
          error: tokenData?.error,
          errorDescription: tokenData?.error_description,
        });
        return new Response(`Token exchange failed: ${JSON.stringify({
          status: tokenResponse.status,
          error: tokenData?.error,
          error_description: tokenData?.error_description,
        })}`, { status: 400 });
      }

      // Store tokens in database
      const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

      const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));

      const { error: upsertError } = await supabase
        .from('user_google_tokens')
        .upsert({
          user_id: userId,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: expiresAt.toISOString(),
          scope: tokenData.scope,
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) {
        console.error('[google-calendar-auth] failed to store tokens', {
          userId,
          error: upsertError.message,
        });
        return new Response(`Failed to store tokens: ${upsertError.message}`, { status: 500 });
      }

      console.log('[google-calendar-auth] tokens stored', {
        userId,
        expiresAt: expiresAt.toISOString(),
        scope: tokenData?.scope,
        hasRefreshToken: safeBool(tokenData?.refresh_token),
      });

      // Redirect back to app
      const successUrl = `${redirectUrl}?google_calendar=connected`;
      console.log('[google-calendar-auth] redirecting back to app', { successUrl });
      return new Response(null, {
        status: 302,
        headers: {
          Location: successUrl,
        },
      });
    }

    // Handle regular API requests
    const { action: bodyAction, userId, redirectUrl } = await req.json();

    if (bodyAction === 'get-auth-url') {
      if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const state = btoa(JSON.stringify({ userId, redirectUrl: redirectUrl || '/' }));
      
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID!);
      authUrl.searchParams.set('redirect_uri', `${SUPABASE_URL}/functions/v1/google-calendar-auth?action=callback`);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/calendar');
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');
      authUrl.searchParams.set('state', state);

      return new Response(JSON.stringify({ authUrl: authUrl.toString() }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (bodyAction === 'disconnect') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Authorization required' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
      
      // Get user from token
      const { data: { user }, error: userError } = await createClient(
        SUPABASE_URL!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } }
      ).auth.getUser();

      if (userError || !user) {
        return new Response(JSON.stringify({ error: 'Invalid user' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get current tokens to revoke
      const { data: tokenData } = await supabase
        .from('user_google_tokens')
        .select('access_token')
        .eq('user_id', user.id)
        .single();

      if (tokenData?.access_token) {
        // Revoke Google token
        await fetch(`https://oauth2.googleapis.com/revoke?token=${tokenData.access_token}`, {
          method: 'POST',
        });
      }

      // Delete tokens from database
      await supabase
        .from('user_google_tokens')
        .delete()
        .eq('user_id', user.id);

      // Delete synced events
      await supabase
        .from('synced_calendar_events')
        .delete()
        .eq('user_id', user.id);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (bodyAction === 'check-connection') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(JSON.stringify({ connected: false }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const supabase = createClient(
        SUPABASE_URL!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } }
      );

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return new Response(JSON.stringify({ connected: false }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: tokenData } = await supabase
        .from('user_google_tokens')
        .select('expires_at')
        .eq('user_id', user.id)
        .single();

      return new Response(JSON.stringify({ 
        connected: !!tokenData,
        expiresAt: tokenData?.expires_at 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in google-calendar-auth:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
