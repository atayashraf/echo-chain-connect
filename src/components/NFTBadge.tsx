
import { Badge } from "@/components/ui/badge";

interface NFTBadgeProps {
  className?: string;
}

export function NFTBadge({ className }: NFTBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={`bg-primary-light text-primary border-primary-light font-medium ${className}`}
    >
      NFT
    </Badge>
  );
}
