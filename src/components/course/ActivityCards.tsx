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
    <div className="flex gap-3 mb-6 max-w-md">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = false;
        
        return (
          <Card
            key={card.id}
            className={cn(
              "flex-1 overflow-hidden transition-all duration-200 cursor-pointer group",
              "hover:shadow-md border",
              "bg-card/50 border-border/50 hover:border-primary/30"
            )}
            onClick={() => !card.locked && onCardClick?.(card.id)}
          >
            <CardContent className="p-3 flex flex-col items-center justify-center space-y-1.5 relative">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: card.color }}
              >
                <Icon className="h-4 w-4" />
              </div>
              
              <span className="text-[10px] font-medium text-center text-foreground leading-tight">
                {card.title}
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
