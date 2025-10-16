import { BookOpen, FileText, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActivityCard {
  id: string;
  title: string;
  icon: typeof BookOpen;
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
      icon: FileText,
      available: true,
      locked: true,
    },
    {
      id: "exercices",
      title: "Exercices",
      icon: FileText,
      available: true,
      locked: true,
    },
    {
      id: "flashcards",
      title: "Flashcards",
      icon: Brain,
      available: true,
      locked: true,
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
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              
              <span className={cn(
                "text-xs font-medium text-center",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {card.title}
              </span>
              
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
