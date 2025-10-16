import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Chapter {
  id: string;
  title: string;
  order_index: number;
  completed?: boolean;
  theme?: string;
}

interface ChapterGridProps {
  chapters: Chapter[];
  onChapterSelect: (id: string) => void;
}

export const ChapterGrid = ({ chapters, onChapterSelect }: ChapterGridProps) => {
  // Grouper les chapitres par thème
  const themes = chapters.reduce((acc, chapter) => {
    const theme = chapter.theme || "Thème général";
    if (!acc[theme]) {
      acc[theme] = [];
    }
    acc[theme].push(chapter);
    return acc;
  }, {} as Record<string, Chapter[]>);

  // Descriptions des thèmes
  const themeDescriptions: Record<string, string> = {
    "Thème 1": "La poésie du Moyen Âge au XVIIIe siècle",
    "Thème 2": "Les outils d'analyse d'un texte littéraire",
    "Thème 3": "Étude de la langue"
  };

  return (
    <div className="space-y-12">
      {Object.entries(themes).map(([themeName, themeChapters]) => (
        <div key={themeName} className="space-y-6">
          <div>
            <p className="text-lg font-semibold text-muted-foreground mb-2">
              {themeName}
            </p>
            <h2 className="text-2xl font-bold">
              {themeDescriptions[themeName] || themeName}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {themeChapters.map((chapter, index) => (
              <Card
                key={chapter.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
                onClick={() => onChapterSelect(chapter.id)}
              >
                <CardContent className="p-0">
                  <div className="relative bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/30 p-3 min-h-[80px] flex items-center justify-center">
                    {/* Fond décoratif avec formules mathématiques */}
                    <div className="absolute inset-0 opacity-10 overflow-hidden">
                      <div className="absolute top-1 left-2 text-sm font-serif">∫</div>
                      <div className="absolute top-4 right-2 text-xs">π</div>
                      <div className="absolute bottom-1 left-4 text-xs">∑</div>
                    </div>
                    
                    <h3 className="text-sm font-bold text-center relative z-10 px-2 leading-tight">
                      {chapter.title}
                    </h3>
                  </div>

                  <div className="bg-card p-2 space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                      Chapitre {chapter.order_index + 1}
                    </p>
                    <Progress 
                      value={chapter.completed ? 100 : 0} 
                      className="h-1"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
