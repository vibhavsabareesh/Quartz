import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Check, Loader2, Unlink } from 'lucide-react';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';

interface GoogleCalendarConnectProps {
  showCard?: boolean;
}

export function GoogleCalendarConnect({ showCard = true }: GoogleCalendarConnectProps) {
  const { isConnected, isLoading, connect, disconnect } = useGoogleCalendar();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Checking connection...</span>
      </div>
    );
  }

  const content = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isConnected ? 'bg-success/20' : 'bg-muted'
        }`}>
          <Calendar className={`w-5 h-5 ${isConnected ? 'text-success' : 'text-muted-foreground'}`} />
        </div>
        <div>
          <p className="font-medium text-foreground">Google Calendar</p>
          <p className="text-sm text-muted-foreground">
            {isConnected ? 'Connected and syncing' : 'Not connected'}
          </p>
        </div>
      </div>
      
      {isConnected ? (
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center"
          >
            <Check className="w-4 h-4 text-success" />
          </motion.div>
          <Button variant="ghost" size="sm" onClick={disconnect}>
            <Unlink className="w-4 h-4 mr-1" />
            Disconnect
          </Button>
        </div>
      ) : (
        <Button onClick={connect} variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Connect
        </Button>
      )}
    </div>
  );

  if (!showCard) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Calendar Integration</CardTitle>
        <CardDescription>
          Sync your study sessions with Google Calendar
        </CardDescription>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}
