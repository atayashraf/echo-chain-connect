
import { Header } from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { User, Heart, MessageSquare, Award, UserPlus, Share, Bell } from "lucide-react";
import { Link } from "react-router-dom";

interface NotificationProps {
  id: string;
  type: 'like' | 'comment' | 'reputation' | 'follow' | 'mention' | 'share';
  user: {
    name: string;
    address: string;
    image?: string;
  };
  content?: string;
  postId?: string;
  timestamp: string;
  read: boolean;
}

const notificationsList: NotificationProps[] = [
  {
    id: "n1",
    type: "like",
    user: {
      name: "Crypto Enthusiast",
      address: "0xf3D58e5B2984a5E8802B869e5bC425Af7dd5a2B"
    },
    postId: "p1",
    timestamp: "5m ago",
    read: false
  },
  {
    id: "n2",
    type: "comment",
    user: {
      name: "Blockchain Developer",
      address: "0x8a7F7902356bf32589E585c0F31BcE4A0D5d599C"
    },
    content: "Great insights! Have you considered the implications for layer-2 solutions?",
    postId: "p2",
    timestamp: "1h ago",
    read: false
  },
  {
    id: "n3",
    type: "reputation",
    user: {
      name: "DeFi Explorer",
      address: "0x9d76E12A82F864aB782AE8918eB7C1D1A247d9E1"
    },
    content: "You earned 5 reputation points",
    timestamp: "3h ago",
    read: true
  },
  {
    id: "n4",
    type: "follow",
    user: {
      name: "NFT Creator",
      address: "0x3e4D98C1F7d2B5cE7F8E29E2C7D9D8e2d3F7d4A2"
    },
    timestamp: "1d ago",
    read: true
  },
  {
    id: "n5",
    type: "share",
    user: {
      name: "Crypto Researcher",
      address: "0x8B7F790235612dE585c0F31BcE4A0D5d599C"
    },
    postId: "p1",
    timestamp: "2d ago",
    read: true
  }
];

const NotificationIcon = ({ type }: { type: NotificationProps['type'] }) => {
  switch (type) {
    case 'like':
      return <Heart className="text-red-500 w-5 h-5" />;
    case 'comment':
      return <MessageSquare className="text-blue-500 w-5 h-5" />;
    case 'reputation':
      return <Award className="text-primary w-5 h-5" />;
    case 'follow':
      return <UserPlus className="text-green-500 w-5 h-5" />;
    case 'mention':
      return <User className="text-purple-500 w-5 h-5" />;
    case 'share':
      return <Share className="text-orange-500 w-5 h-5" />;
    default:
      return <Bell className="text-primary w-5 h-5" />;
  }
};

const NotificationContent = ({ notification }: { notification: NotificationProps }) => {
  const { type, user, content, postId } = notification;
  
  switch (type) {
    case 'like':
      return (
        <span>
          <Link to={`/profile/${user.address}`} className="font-medium hover:text-primary">
            {user.name}
          </Link>{' '}
          liked your <Link to={`/post/${postId}`} className="text-primary hover:underline">post</Link>
        </span>
      );
    case 'comment':
      return (
        <div>
          <div>
            <Link to={`/profile/${user.address}`} className="font-medium hover:text-primary">
              {user.name}
            </Link>{' '}
            commented on your <Link to={`/post/${postId}`} className="text-primary hover:underline">post</Link>
          </div>
          {content && <div className="text-sm text-muted-foreground mt-1">"{content}"</div>}
        </div>
      );
    case 'reputation':
      return (
        <span>
          <Link to={`/profile/${user.address}`} className="font-medium hover:text-primary">
            {user.name}
          </Link>{' '}
          {content}
        </span>
      );
    case 'follow':
      return (
        <span>
          <Link to={`/profile/${user.address}`} className="font-medium hover:text-primary">
            {user.name}
          </Link>{' '}
          started following you
        </span>
      );
    case 'share':
      return (
        <span>
          <Link to={`/profile/${user.address}`} className="font-medium hover:text-primary">
            {user.name}
          </Link>{' '}
          shared your <Link to={`/post/${postId}`} className="text-primary hover:underline">post</Link>
        </span>
      );
    default:
      return <span>New notification</span>;
  }
};

const Notifications = () => {
  return (
    <>
      <Header />
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        
        <div className="space-y-4">
          {notificationsList.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 flex items-start gap-4 ${!notification.read ? 'border-primary/30 bg-primary-light/10' : ''}`}
            >
              <div className="mt-1">
                <NotificationIcon type={notification.type} />
              </div>
              
              <div className="flex-1 min-w-0">
                <NotificationContent notification={notification} />
                <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
              </div>
              
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src={notification.user.image} />
                <AvatarFallback className="bg-primary-light text-primary">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Notifications;
