
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { User, Heart, MessageSquare, Award, UserPlus, Share } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import { useEffect } from "react";

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'like':
      return <Heart className="text-red-500 w-5 h-5" />;
    case 'comment':
      return <MessageSquare className="text-blue-500 w-5 h-5" />;
    case 'reputation':
      return <Award className="text-primary w-5 h-5" />;
    case 'follow':
      return <UserPlus className="text-green-500 w-5 h-5" />;
    case 'share':
      return <Share className="text-orange-500 w-5 h-5" />;
    default:
      return <User className="text-primary w-5 h-5" />;
  }
};

export function NotificationCard({ notification }: { notification: any }) {
  const { markAsRead } = useNotifications();

  useEffect(() => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  }, [notification.id, notification.read, markAsRead]);

  return (
    <Card
      className={`p-4 flex items-start gap-4 ${!notification.read ? 'border-primary/30 bg-primary-light/10' : ''}`}
    >
      <div className="mt-1">
        <NotificationIcon type={notification.type} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link 
              to={`/profile/${notification.actor.username}`} 
              className="font-medium hover:text-primary"
            >
              {notification.actor.display_name || notification.actor.username}
            </Link>
            {notification.content}
            {notification.post_id && (
              <Link to={`/post/${notification.post_id}`} className="text-primary hover:underline ml-1">
                post
              </Link>
            )}
          </div>
          
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={notification.actor.avatar_url} />
            <AvatarFallback className="bg-primary-light text-primary">
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </div>
        
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(notification.created_at).toRelativeTime()}
        </p>
      </div>
    </Card>
  );
}
