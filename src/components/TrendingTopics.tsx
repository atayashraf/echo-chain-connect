
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

interface TrendingTopic {
  tag: string;
  posts: number;
}

const TRENDING_TOPICS: TrendingTopic[] = [
  { tag: "Web3", posts: 1458 },
  { tag: "Ethereum", posts: 892 },
  { tag: "NFTArt", posts: 654 },
  { tag: "DecentralizedFinance", posts: 521 },
  { tag: "BlockchainGaming", posts: 433 }
];

export function TrendingTopics() {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <ul className="space-y-3">
          {TRENDING_TOPICS.map((topic) => (
            <li key={topic.tag}>
              <Link to={`/tags/${topic.tag}`} className="flex items-center justify-between group">
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  #{topic.tag}
                </span>
                <span className="text-xs text-muted-foreground">
                  {topic.posts} posts
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
