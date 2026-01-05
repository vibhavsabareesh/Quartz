import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, detailLevel = 'standard', modes = [] } = await req.json();

    if (!content || content.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'No content provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Adjust instructions based on user's modes
    let styleInstructions = '';
    if (modes.includes('dyslexia')) {
      styleInstructions = 'Use short sentences. Simple words. Add extra line breaks between points. Use bullet points extensively.';
    } else if (modes.includes('adhd')) {
      styleInstructions = 'Be concise and action-oriented. Use bold for key points. Include a "Quick Start" section at the top.';
    } else if (modes.includes('sensory_safe')) {
      styleInstructions = 'Use calm, neutral language. Avoid exclamation marks or urgent phrasing.';
    }

    // Adjust detail level
    let detailInstructions = '';
    switch (detailLevel) {
      case 'brief':
        detailInstructions = 'Keep the summary to 1 paragraph. Notes should have only 3-5 key points total.';
        break;
      case 'comprehensive':
        detailInstructions = 'Provide an extensive summary (3-4 paragraphs). Notes should be very detailed with 10+ points per section.';
        break;
      default:
        detailInstructions = 'Provide a balanced summary (2-3 paragraphs). Notes should have 5-7 points per section.';
    }

    const systemPrompt = `You are an expert note-taker and summarizer. ${styleInstructions}

${detailInstructions}

You must respond with valid JSON in this exact format:
{
  "summary": "A concise summary of the content",
  "notes": {
    "keyPoints": ["point 1", "point 2"],
    "mainThemes": ["theme 1", "theme 2"],
    "importantDetails": ["detail 1", "detail 2"],
    "actionItems": ["action 1", "action 2"]
  }
}

If there are no action items, return an empty array for actionItems.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please summarize and create notes from the following content:\n\n${content}` }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'API credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    let parsedResponse;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, aiResponse];
      const jsonStr = jsonMatch[1].trim();
      parsedResponse = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      // Fallback structure if parsing fails
      parsedResponse = {
        summary: aiResponse,
        notes: {
          keyPoints: ['Unable to parse structured notes'],
          mainThemes: [],
          importantDetails: [],
          actionItems: []
        }
      };
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Summarize notes error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
