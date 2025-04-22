
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type RealtimeEvent = "INSERT" | "UPDATE" | "DELETE" | "*";

interface RealtimeSubscriptionOptions {
  schema?: string;
  table: string;
  event?: RealtimeEvent;
  callback: () => void;
}

/**
 * A hook to subscribe to Supabase real-time changes
 */
export function useRealtimeSubscription({
  schema = "public",
  table,
  event = "*",
  callback
}: RealtimeSubscriptionOptions) {
  useEffect(() => {
    // Create a channel to listen for changes
    const channel = supabase
      .channel(`${schema}:${table}:changes`)
      .on(
        'postgres_changes', 
        {
          event,
          schema,
          table
        },
        (payload) => {
          console.log('Realtime change detected:', payload);
          callback();
        }
      )
      .subscribe();
      
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [schema, table, event, callback]);
}
