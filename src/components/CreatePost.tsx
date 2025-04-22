
import { useState, useCallback } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { User, Image, Link2, Tag } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface CreatePostProps {
  onPostCreated?: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [isNFT, setIsNFT] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Function to extract hashtags from content
  const extractHashtags = useCallback((text: string): string[] => {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  }, []);

  const handlePost = async () => {
    if (!content.trim()) return;
    
    setIsLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create posts",
        });
        setIsLoading(false);
        return;
      }
      
      const userId = session.session.user.id;
      const hashtags = extractHashtags(content);
      
      // Create post
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({
          content: content,
          user_id: userId,
          post_type: isNFT ? 'nft' : 'regular',
          nft_metadata: isNFT ? { created_at: new Date().toISOString() } : null
        })
        .select();
      
      if (postError) {
        throw postError;
      }
      
      const postId = postData[0].id;
      
      // Handle hashtags if there are any
      if (hashtags.length > 0) {
        // Process each hashtag
        for (const tag of hashtags) {
          // Check if hashtag exists
          const { data: existingTag } = await supabase
            .from('hashtags')
            .select('id, posts_count')
            .eq('name', tag)
            .single();
          
          let hashtagId;
          
          if (existingTag) {
            hashtagId = existingTag.id;
            // Increment posts_count
            await supabase
              .from('hashtags')
              .update({ posts_count: (existingTag.posts_count || 0) + 1 })
              .eq('id', hashtagId);
          } else {
            // Create new hashtag
            const { data: newTag, error: tagError } = await supabase
              .from('hashtags')
              .insert({ name: tag, posts_count: 1 })
              .select();
              
            if (tagError) {
              console.error("Error creating hashtag:", tagError);
              continue; // Skip this hashtag but continue with others
            }
            
            hashtagId = newTag[0].id;
          }
          
          // Create link between post and hashtag
          await supabase
            .from('posts_hashtags')
            .insert({
              post_id: postId,
              hashtag_id: hashtagId
            });
        }
      }

      // Success message
      toast({
        title: isNFT ? "NFT Post Created" : "Post Created",
        description: isNFT ? "Your NFT post has been published to the chain" : "Your post has been published",
      });
      
      // Reset form
      setContent("");
      setIsNFT(false);
      
      // Call the callback if provided
      if (onPostCreated) {
        onPostCreated();
      }
      
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create your post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="mb-6 border border-border/40">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary-light text-primary">
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's happening in the decentralized world? Use #hashtags to categorize your post!"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-border/40 pt-4 flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="flex gap-4 text-muted-foreground">
          <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent hover:text-primary">
            <Image className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent hover:text-primary">
            <Link2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent hover:text-primary">
            <Tag className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch
              id="nft-mode"
              checked={isNFT}
              onCheckedChange={setIsNFT}
              className="data-[state=checked]:bg-primary"
            />
            <Label htmlFor="nft-mode" className="text-sm font-medium">Mint as NFT</Label>
          </div>
          <Button 
            onClick={handlePost} 
            disabled={!content.trim() || isLoading}
            className="bg-primary hover:bg-primary-dark transition-colors"
          >
            {isLoading ? "Posting..." : "Post to Chain"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
