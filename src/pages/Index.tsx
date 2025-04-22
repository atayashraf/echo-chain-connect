
import { useState, useEffect } from "react";
import { CreatePost } from "@/components/CreatePost";
import { PostCard } from "@/components/PostCard";
import { TrendingTopics } from "@/components/TrendingTopics";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Post {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  post_type: "regular" | "nft";
  user_id: string;
  user: {
    username: string;
    display_name: string;
    avatar_url: string;
    reputation_score: number;
  };
  comments_count: number;
  user_has_liked: boolean;
}

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        const userId = session.session?.user.id;
        
        const { data, error } = await supabase
          .from('posts')
          .select(`
            id, 
            content, 
            created_at, 
            likes_count, 
            post_type,
            user_id,
            profiles:user_id (username, display_name, avatar_url, reputation_score),
            comments:comments(count),
            likes:likes!inner(user_id)
          `)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) {
          throw error;
        }
        
        // Format the posts data
        const formattedPosts = data.map(post => ({
          id: post.id,
          content: post.content,
          created_at: post.created_at,
          likes_count: post.likes_count || 0,
          post_type: post.post_type,
          user_id: post.user_id,
          user: {
            username: post.profiles?.username || "anonymous",
            display_name: post.profiles?.display_name || post.profiles?.username || "Anonymous User",
            avatar_url: post.profiles?.avatar_url || "",
            reputation_score: post.profiles?.reputation_score || 0
          },
          comments_count: post.comments?.length || 0,
          user_has_liked: userId ? post.likes?.some((like: any) => like.user_id === userId) : false
        }));
        
        setPosts(formattedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast({
          title: "Error",
          description: "Failed to load posts. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  return (
    <>
      <Header />
      <div className="container py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <CreatePost />
          <div className="space-y-4">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  author={{
                    name: post.user.display_name || post.user.username,
                    address: post.user_id,
                    image: post.user.avatar_url,
                    reputation: post.user.reputation_score
                  }}
                  content={post.content}
                  timestamp={new Date(post.created_at).toLocaleDateString()}
                  likes={post.likes_count}
                  comments={post.comments_count}
                  isNFT={post.post_type === "nft"}
                  liked={post.user_has_liked}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No posts yet. Be the first to post something!</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <TrendingTopics />
        </div>
      </div>
    </>
  );
};

export default Index;
