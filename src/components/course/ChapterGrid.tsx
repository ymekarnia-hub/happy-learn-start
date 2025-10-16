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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl">
            {themeChapters.map((chapter, index) => (
              <Card
                key={chapter.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden border-2"
                onClick={() => onChapterSelect(chapter.id)}
              >
                <CardContent className="p-0">
                  <div className="relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 p-6 min-h-[180px] flex items-center justify-center">
                    {/* Fond décoratif avec formules mathématiques */}
                    <div className="absolute inset-0 opacity-10 overflow-hidden">
                      <div className="absolute top-2 left-2 text-4xl font-serif">∫</div>
                      <div className="absolute top-12 right-4 text-3xl">π</div>
                      <div className="absolute bottom-4 left-8 text-2xl">∑</div>
                      <div className="absolute top-1/2 right-8 text-3xl">√</div>
                      <div className="absolute bottom-8 right-12 text-xl">θ</div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-center relative z-10 px-2">
                      {chapter.title}
                    </h3>
                  </div>

                  <div className="bg-card p-4 space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Chapitre {chapter.order_index + 1}
                    </p>
                    <Progress 
                      value={chapter.completed ? 100 : 0} 
                      className="h-1.5"
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
