
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { format, formatDistance } from 'date-fns';

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'reputation' | 'share';
  user_id: string;
  actor_id: string;
  post_id?: string;
  content?: string;
  read: boolean;
  created_at: string;
  actor: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

export function useNotifications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Using raw query to work around the fact that the notifications table
      // might not be in the types yet
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          actor:profiles!actor_id(
            username,
            display_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: async (notificationId: string) => {
      // Using raw query to work around the fact that the notifications table
      // might not be in the types yet
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    },
  });

  return {
    notifications,
    isLoading,
    markAsRead,
  };
}
