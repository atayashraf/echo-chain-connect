import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/components/PostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, Award, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

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
}

// Mock posts for trending content
const trendingPosts = [
  {
    id: "t1",
    author: {
      name: "NFT Creator",
      address: "0x3e4D98C1F7d2B5cE7F8E29E2C7D9D8e2d3F7d4A2",
      reputation: 56
    },
    content: "Just launched my new NFT collection exploring digital identity in the Web3 era. Limited minting available now!",
    timestamp: "6h ago",
    likes: 89,
    comments: 24,
    isNFT: true
  },
  {
    id: "t2",
    author: {
      name: "DeFi Expert",
      address: "0x7a1F7902356bf3229dE585c0F31BcE4A0D5d599C",
      reputation: 142
    },
    content: "Analysis: How the new protocol update affects liquidity mining strategies across the ecosystem. Thread below 👇",
    timestamp: "1d ago",
    likes: 156,
    comments: 42
  }
];

// Mock posts for top reputation content
const reputationPosts = [
  {
    id: "r1",
    author: {
      name: "Blockchain Veteran",
      address: "0x2c6E02356bf32589B995c0F31BcE4A0D5d599C",
      reputation: 578
    },
    content: "Tutorial: Building your first zero-knowledge proof application. Let me know if you have any questions!",
    timestamp: "2d ago",
    likes: 321,
    comments: 87
  },
  {
    id: "r2",
    author: {
      name: "Crypto Researcher",
      address: "0x8B7F790235612dE585c0F31BcE4A0D5d599C",
      reputation: 423
    },
    content: "Published my research on scaling solutions for next-gen blockchains. Full paper in the comments.",
    timestamp: "4d ago",
    likes: 275,
    comments: 94
  }
];

// Mock top tags
const topTags = [
  { tag: "Web3", posts: 15762 },
  { tag: "NFTCollection", posts: 9834 },
  { tag: "DeFi", posts: 8721 },
  { tag: "DAOs", posts: 7532 },
  { tag: "Ethereum", posts: 6843 },
  { tag: "MetaverseArt", posts: 5429 },
  { tag: "BlockchainDev", posts: 4972 },
  { tag: "CryptoNews", posts: 4215 }
];

const Explore = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const { data: searchResults, error } = await supabase.functions.invoke('search-posts', {
        body: { query: searchQuery.trim() }
      });
      
      if (error) throw error;
      
      setSearchResults(searchResults || []);
    } catch (error) {
      console.error("Error searching posts:", error);
      toast({
        title: "Search failed",
        description: "We couldn't complete your search. Please try again.",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <Header />
      <div className="container py-6">
        <div className="mb-6">
          <div className="relative flex">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search posts, tags, or users..." 
              className="pl-10 bg-muted/50 border-muted focus-visible:ring-primary flex-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button 
              className="ml-2" 
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
        
        {hasSearched ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Search Results for "{searchQuery}"</h2>
            
            {isSearching ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((post) => (
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
                    likes={post.likes_count || 0}
                    comments={0} // Comments count is not included in search results
                    isNFT={post.post_type === "nft"}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No results found. Try different keywords or check for typos.</p>
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setHasSearched(false)}
            >
              Back to Explore
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="trending" className="mb-6">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Trending</span>
              </TabsTrigger>
              <TabsTrigger value="reputation" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Top Reputation</span>
              </TabsTrigger>
              <TabsTrigger value="tags" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>Popular Tags</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="trending" className="space-y-4">
              <h2 className="text-lg font-semibold">Trending on EchoChain</h2>
              {trendingPosts.map(post => (
                <PostCard key={post.id} id={post.id} {...post} />
              ))}
            </TabsContent>
            
            <TabsContent value="reputation" className="space-y-4">
              <h2 className="text-lg font-semibold">Top Reputation Contributors</h2>
              {reputationPosts.map(post => (
                <PostCard key={post.id} id={post.id} {...post} />
              ))}
            </TabsContent>
            
            <TabsContent value="tags" className="space-y-4">
              <h2 className="text-lg font-semibold">Popular Tags</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {topTags.map(tag => (
                  <Link to={`/tags/${tag.tag}`} key={tag.tag}>
                    <Card className="cursor-pointer hover:border-primary/30 transition-colors">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base font-medium">#{tag.tag}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground">{tag.posts.toLocaleString()} posts</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default Explore;
