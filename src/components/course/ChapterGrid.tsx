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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {themeChapters.map((chapter, index) => (
              <Card
                key={chapter.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden border-2 hover:border-primary/50"
                onClick={() => onChapterSelect(chapter.id)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 w-16 h-16 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      {/* Fond décoratif avec formules mathématiques */}
                      <div className="absolute inset-0 opacity-20 overflow-hidden rounded-full">
                        <div className="absolute top-1 left-1 text-xs font-serif">∫</div>
                        <div className="absolute bottom-1 right-1 text-xs">π</div>
                      </div>
                      
                      <span className="text-2xl font-bold relative z-10">
                        {chapter.order_index + 1}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-lg leading-tight">
                      {chapter.title}
                    </h3>
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
