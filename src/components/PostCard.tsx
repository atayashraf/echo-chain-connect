import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { User, MessageSquare, Heart, Award, Share } from "lucide-react";
import { NFTBadge } from "./NFTBadge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
    username: string;
    avatar_url: string;
  };
}

interface PostCardProps {
  id: string;
  author: {
    name: string;
    address: string;
    image?: string;
    reputation: number;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isNFT?: boolean;
  liked?: boolean;
  onPostUpdated?: () => void;
}

export function PostCard({ 
  id, 
  author, 
  content, 
  timestamp, 
  likes: initialLikes, 
  comments: initialComments, 
  isNFT = false, 
  liked: initialLiked = false,
  onPostUpdated
}: PostCardProps) {
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [commentsCount, setCommentsCount] = useState(initialComments);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  const handleLike = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to like posts",
        });
        return;
      }

      if (isLiked) {
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', session.session.user.id);

        if (error) throw error;
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
        
        if (onPostUpdated) {
          onPostUpdated();
        }
      } else {
        const { error } = await supabase
          .from('likes')
          .insert({
            post_id: id,
            user_id: session.session.user.id
          });

        if (error) throw error;
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
        
        if (onPostUpdated) {
          onPostUpdated();
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to process your like",
        variant: "destructive",
      });
    }
  };

  const loadComments = async () => {
    if (commentsLoaded) return;
    
    setIsLoadingComments(true);
    try {
      const { data: commentsData, error } = await supabase.functions.invoke('get-post-comments', {
        body: { postId: id }
      });

      if (error) throw error;

      if (commentsData) {
        setCommentsList(commentsData);
      }
      setCommentsLoaded(true);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to comment on posts",
        });
        return;
      }

      const { data: newComment, error } = await supabase.functions.invoke('add-post-comment', {
        body: {
          postId: id,
          content: commentText.trim()
        }
      });

      if (error) throw error;

      if (newComment) {
        setCommentsList(prev => [newComment, ...prev]);
        setCommentText("");
        setCommentsCount(prev => prev + 1);
        
        if (!commentsLoaded) {
          setCommentsLoaded(true);
        }

        toast({
          title: "Comment added",
          description: "Your comment has been posted",
        });
        
        if (onPostUpdated) {
          onPostUpdated();
        }
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add your comment",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-4 border border-border/40 hover:border-primary/20 transition-all">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="w-10 h-10">
          <AvatarImage src={author.image} />
          <AvatarFallback className="bg-primary-light text-primary">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link to={`/profile/${author.address}`} className="font-medium hover:text-primary transition-colors">
            {author.name}
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{author.address.substring(0, 6)}...{author.address.substring(author.address.length - 4)}</span>
            <span>•</span>
            <span>{timestamp}</span>
            {author.reputation > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1 text-primary">
                  <Award className="w-3 h-3" />
                  <span>{author.reputation}</span>
                </div>
              </>
            )}
          </div>
        </div>
        {isNFT && (
          <div className="ml-auto">
            <NFTBadge />
          </div>
        )}
      </CardHeader>
      <CardContent className="pb-2">
        <p className="whitespace-pre-wrap">{content}</p>
      </CardContent>
      <CardFooter className="border-t border-border/40 pt-2 flex flex-col">
        <div className="w-full flex justify-between mb-2">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex items-center gap-1 ${isLiked ? 'text-primary' : 'text-muted-foreground'} hover:text-primary hover:bg-primary-light/50`}
              onClick={handleLike}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likesCount}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-muted-foreground hover:text-primary hover:bg-primary-light/50"
              onClick={() => {
                setIsCommenting(!isCommenting);
                if (!commentsLoaded && initialComments > 0) {
                  loadComments();
                }
              }}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{commentsCount}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary-light/50">
            <Share className="w-4 h-4" />
          </Button>
        </div>

        <Collapsible 
          open={isCommenting} 
          onOpenChange={setIsCommenting}
          className="w-full"
        >
          <CollapsibleContent className="w-full space-y-4 pt-2">
            <div className="flex gap-2">
              <Textarea 
                placeholder="Write a comment..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="resize-none"
              />
              <Button onClick={handleAddComment} disabled={!commentText.trim()}>
                Post
              </Button>
            </div>
            
            <div className="space-y-3 mt-2">
              {isLoadingComments ? (
                <div className="text-center py-2">
                  <p className="text-sm text-muted-foreground">Loading comments...</p>
                </div>
              ) : commentsList.length > 0 ? (
                commentsList.map(comment => (
                  <div key={comment.id} className="flex gap-2 p-2 border-t border-border/30">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={comment.user.avatar_url} />
                      <AvatarFallback className="bg-primary-light text-primary text-xs">
                        {comment.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardFooter>
    </Card>
  );
}
