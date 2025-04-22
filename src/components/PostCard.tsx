
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { User, MessageSquare, Heart, Award, Share } from "lucide-react";
import { NFTBadge } from "./NFTBadge";

interface PostCardProps {
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
}

export function PostCard({ author, content, timestamp, likes, comments, isNFT = false }: PostCardProps) {
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
      <CardFooter className="border-t border-border/40 pt-2 flex justify-between">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground hover:text-primary hover:bg-primary-light/50">
            <Heart className="w-4 h-4" />
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground hover:text-primary hover:bg-primary-light/50">
            <MessageSquare className="w-4 h-4" />
            <span>{comments}</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary-light/50">
          <Share className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
