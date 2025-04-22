
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProfileCard } from "@/components/ProfileCard";
import { PostCard } from "@/components/PostCard";
import { TrendingTopics } from "@/components/TrendingTopics";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Default profile data (only used while loading)
const defaultProfile = {
  name: "Loading...",
  address: "",
  bio: "",
  followers: 0,
  following: 0,
  posts: 0,
  reputation: 0
};

const Profile = () => {
  const { address } = useParams();
  const { toast } = useToast();
  const [profile, setProfile] = useState(defaultProfile);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Get the current authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        
        // Determine if we're viewing the current user's profile or someone else's
        const userId = address || (user ? user.id : null);
        
        if (!userId) {
          toast({
            title: "Authentication required",
            description: "Please sign in to view profiles",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        // Check if this is the current user's profile
        setIsCurrentUser(!address || (user && address === user.id));
        
        // Fetch the profile data
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select(`
            username, 
            display_name, 
            bio, 
            avatar_url, 
            wallet_address,
            reputation_score
          `)
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        
        // Fetch follow counts
        const { count: followersCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', userId);
          
        const { count: followingCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', userId);
          
        // Fetch post count
        const { count: postsCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
          
        // Update profile data
        setProfile({
          name: profileData.display_name || profileData.username,
          address: userId,
          bio: profileData.bio || "",
          followers: followersCount || 0,
          following: followingCount || 0,
          posts: postsCount || 0,
          reputation: profileData.reputation_score || 0,
          image: profileData.avatar_url
        });
        
        // Fetch user's posts
        const { data: userPosts, error: postsError } = await supabase
          .from('posts')
          .select(`
            id, 
            content, 
            created_at, 
            post_type,
            likes_count,
            comments:comments(count)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (postsError) throw postsError;
        
        // Format posts data
        setPosts(userPosts.map(post => ({
          id: post.id,
          author: {
            name: profileData.display_name || profileData.username,
            address: userId,
            image: profileData.avatar_url,
            reputation: profileData.reputation_score || 0
          },
          content: post.content,
          timestamp: new Date(post.created_at).toLocaleDateString(),
          likes: post.likes_count || 0,
          comments: post.comments?.length || 0,
          isNFT: post.post_type === "nft"
        })));
        
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [address, toast]);

  return (
    <>
      <Header />
      <div className="container py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {loading ? (
            <>
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </>
          ) : (
            <>
              <ProfileCard profile={profile} isCurrentUser={isCurrentUser} />
              <div className="space-y-4">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard key={post.id} {...post} />
                  ))
                ) : (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">No posts yet.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div>
          <TrendingTopics />
        </div>
      </div>
    </>
  );
};

export default Profile;
