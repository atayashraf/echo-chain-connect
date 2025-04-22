
import { Header } from "@/components/Header";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationCard } from "@/components/NotificationCard";
import { Skeleton } from "@/components/ui/skeleton";

const Notifications = () => {
  const { notifications, isLoading } = useNotifications();

  return (
    <>
      <Header />
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : notifications && notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
