
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Users, FileText } from "lucide-react";
import { ReputationBadge } from "./ReputationBadge";

interface ProfileCardProps {
  profile: {
    name: string;
    address: string;
    image?: string;
    bio?: string;
    followers: number;
    following: number;
    posts: number;
    reputation: number;
  };
  isCurrentUser?: boolean;
}

export function ProfileCard({ profile, isCurrentUser = false }: ProfileCardProps) {
  return (
    <Card className="mb-6 overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-primary-light to-secondary-light" />
      <CardHeader className="pt-0 flex flex-row justify-between">
        <Avatar className="w-24 h-24 border-4 border-background -mt-12">
          <AvatarImage src={profile.image} />
          <AvatarFallback className="bg-primary text-white text-xl">
            <User className="w-10 h-10" />
          </AvatarFallback>
        </Avatar>
        {isCurrentUser ? (
          <Button variant="outline">Edit Profile</Button>
        ) : (
          <Button className="bg-primary hover:bg-primary-dark">Follow</Button>
        )}
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-bold">{profile.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {profile.address.substring(0, 6)}...{profile.address.substring(profile.address.length - 4)}
        </p>
        {profile.bio && <p className="mb-4">{profile.bio}</p>}
        
        <div className="flex items-center mb-4">
          <ReputationBadge score={profile.reputation} />
        </div>
        
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{profile.followers}</span>
            <span className="text-muted-foreground">Followers</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{profile.following}</span>
            <span className="text-muted-foreground">Following</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{profile.posts}</span>
            <span className="text-muted-foreground">Posts</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
