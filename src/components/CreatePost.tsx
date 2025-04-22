
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { User, Image, Link2, Tag } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function CreatePost() {
  const [content, setContent] = useState("");
  const [isNFT, setIsNFT] = useState(false);
  
  const handlePost = async () => {
    // In a real implementation, this would use Web3.js or ethers.js to create a transaction
    // For now, we'll just clear the form
    console.log("Posting content to blockchain:", content);
    console.log("As NFT:", isNFT);
    setContent("");
    setIsNFT(false);
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
              placeholder="What's happening in the decentralized world?"
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
            disabled={!content.trim()}
            className="bg-primary hover:bg-primary-dark transition-colors"
          >
            Post to Chain
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
