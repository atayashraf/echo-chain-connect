
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

interface ReputationBadgeProps {
  score: number;
  className?: string;
}

export function ReputationBadge({ score, className }: ReputationBadgeProps) {
  // Determine the badge style based on the reputation score
  let badgeStyle = "bg-gray-100 text-gray-500"; // Default
  
  if (score >= 100) {
    badgeStyle = "bg-primary-light/70 text-primary";
  } else if (score >= 50) {
    badgeStyle = "bg-primary-light/50 text-primary";
  } else if (score >= 10) {
    badgeStyle = "bg-primary-light/30 text-primary";
  }
  
  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 font-medium border-none ${badgeStyle} ${className}`}
    >
      <Award className="w-3 h-3" />
      <span>{score} Rep</span>
    </Badge>
  );
}
