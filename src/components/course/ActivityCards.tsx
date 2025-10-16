import { ClipboardCheck, PenTool, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActivityCard {
  id: string;
  title: string;
  icon: typeof ClipboardCheck;
  color: string;
  available: boolean;
  locked?: boolean;
}

interface ActivityCardsProps {
  onCardClick?: (id: string) => void;
}

export const ActivityCards = ({ onCardClick }: ActivityCardsProps) => {
  const cards: ActivityCard[] = [
    {
      id: "quiz",
      title: "Quiz",
      icon: ClipboardCheck,
      available: true,
      locked: true,
      color: "hsl(262 83% 58%)", // Violet
    },
    {
      id: "exercices",
      title: "Exercices",
      icon: PenTool,
      available: true,
      locked: true,
      color: "hsl(24 95% 53%)", // Orange
    },
    {
      id: "flashcards",
      title: "Flashcards",
      icon: Zap,
      available: true,
      locked: true,
      color: "hsl(142 71% 45%)", // Vert
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = false;
        
        return (
          <Card
            key={card.id}
            className={cn(
              "relative overflow-hidden transition-all duration-200 cursor-pointer group",
              "hover:shadow-md border-2",
              isActive 
                ? "bg-card border-primary/20 shadow-sm" 
                : "bg-card/50 border-border/50 hover:border-primary/30"
            )}
            onClick={() => !card.locked && onCardClick?.(card.id)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center space-y-2 relative">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: card.color }}
              >
                <Icon className="h-5 w-5" />
              </div>
              
              <span className="text-xs font-medium text-center text-foreground">
                {card.title}
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
