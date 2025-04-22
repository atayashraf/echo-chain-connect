
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Post {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  post_type: "regular" | "nft";
  user: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
    reputation_score: number;
  };
  comments_count: number;
  user_has_liked: boolean;
}

const TagPage = () => {
  const { tagName } = useParams<{ tagName: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!tagName) return;
      setIsLoading(true);

      try {
        const { data, error } = await supabase.rpc('get_posts_by_tag', {
          tag_name: tagName
        }) as unknown as { data: Post[], error: any };

        if (error) {
          console.error("Error fetching posts by tag:", error);
          toast({
            title: "Error",
            description: "Failed to load posts for this tag",
            variant: "destructive",
          });
        } else {
          setPosts(data || []);
        }
      } catch (err) {
        console.error("Error fetching posts by tag:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [tagName, toast]);

  return (
    <>
      <Header />
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-primary">#{tagName}</span>
        </h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                author={{
                  name: post.user.display_name || post.user.username,
                  address: post.user.id,
                  reputation: post.user.reputation_score,
                  image: post.user.avatar_url
                }}
                content={post.content}
                timestamp={new Date(post.created_at).toLocaleDateString()}
                likes={post.likes_count}
                comments={post.comments_count}
                isNFT={post.post_type === "nft"}
                liked={post.user_has_liked}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found for #{tagName}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default TagPage;
