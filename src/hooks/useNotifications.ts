
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { formatDistance } from 'date-fns';

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

      const { data, error } = await supabase.rpc('get_user_notifications') as {
        data: Notification[];
        error: any;
      };

      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
      
      return data;
    },
  });

  const { mutate: markAsRead } = useMutation<void, Error, string>({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase.rpc('mark_notification_as_read', {
        notification_id: notificationId
      } as any);

      if (error) {
        console.error("Error marking notification as read:", error);
        throw error;
      }
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
