import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ActivityLogData {
  action: string;
  details?: Record<string, any>;
  entity_type?: string;
  entity_id?: string;
}

export const useActivityLog = () => {
  const logActivity = async (data: ActivityLogData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: data.action,
        details: data.details || {},
        entity_type: data.entity_type,
        entity_id: data.entity_id,
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  // Log page views automatically
  useEffect(() => {
    const logPageView = () => {
      logActivity({
        action: 'PAGE_VIEW',
        details: {
          path: window.location.pathname,
          timestamp: new Date().toISOString(),
        },
      });
    };

    logPageView();
  }, []);

  return { logActivity };
};
