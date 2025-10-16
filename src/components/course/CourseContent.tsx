import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, BookmarkIcon } from "lucide-react";
import { DocumentList } from "./DocumentList";
import { VideoPlayer } from "./VideoPlayer";
import { Badge } from "@/components/ui/badge";

interface Material {
  id: string;
  title: string;
  type: "pdf" | "video" | "image" | "link";
  url: string;
}

interface CourseContentProps {
  content: string;
  materials: Material[];
  completed: boolean;
  onMarkComplete: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

interface Section {
  id: string;
  number: number;
  title: string;
  content: string;
}

export const CourseContent = ({
  content,
  materials,
  completed,
  onMarkComplete,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext
}: CourseContentProps) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    // Parse content to extract sections (looking for h2 or numbered sections)
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h2, h3');
    
    const parsedSections: Section[] = [];
    headings.forEach((heading, index) => {
      const sectionId = `section-${index}`;
      parsedSections.push({
        id: sectionId,
        number: index + 1,
        title: heading.textContent || '',
        content: ''
      });
    });

    setSections(parsedSections);
    if (parsedSections.length > 0) {
      setActiveSection(parsedSections[0].id);
    }
  }, [content]);

  const videos = materials.filter(m => m.type === "video");
  const documents = materials.filter(m => m.type !== "video") as Array<{
    id: string;
    title: string;
    type: "pdf" | "image" | "link";
    url: string;
  }>;

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download functionality
    console.log("Download PDF");
  };

  return (
    <div className="space-y-6">
      {/* Header with download button */}
      <div className="flex items-center justify-end">
        <Button variant="outline" onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Télécharger en PDF
        </Button>
      </div>

      {/* Video Section */}
      {videos.length > 0 && (
        <div className="space-y-4">
          {videos.map(video => (
            <VideoPlayer key={video.id} url={video.url} title={video.title} />
          ))}
        </div>
      )}

      {/* Main content with sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Content Section - Scrollable */}
        <div className="flex-1 w-full lg:w-auto space-y-6">
          <div className="bg-card rounded-lg p-6 border-2">
            <div 
              className="prose prose-slate dark:prose-invert max-w-none
                [&_h2]:flex [&_h2]:items-center [&_h2]:gap-3 [&_h2]:mb-4
                [&_h2]:text-xl [&_h2]:font-bold
                [&_h2::before]:content-[attr(data-number)] 
                [&_h2::before]:flex [&_h2::before]:items-center [&_h2::before]:justify-center
                [&_h2::before]:w-8 [&_h2::before]:h-8 [&_h2::before]:rounded-full
                [&_h2::before]:bg-primary [&_h2::before]:text-primary-foreground
                [&_h2::before]:text-sm [&_h2::before]:font-semibold
                [&_h3]:flex [&_h3]:items-baseline [&_h3]:gap-3
                [&_h3]:bg-primary [&_h3]:text-primary-foreground
                [&_h3]:px-4 [&_h3]:py-2 [&_h3]:rounded-lg
                [&_h3]:inline-block [&_h3]:font-semibold
                [&_blockquote]:bg-muted [&_blockquote]:border-l-4 
                [&_blockquote]:border-primary [&_blockquote]:p-4 
                [&_blockquote]:my-4 [&_blockquote]:rounded
                [&_blockquote]:italic [&_blockquote]:not-italic
                [&_blockquote_p]:m-0
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
                [&_p]:mb-4 [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>

        {/* Sidebar - Table of Contents - Fixed Position */}
        {sections.length > 0 && (
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="fixed top-24 right-8 w-80 bg-card rounded-lg p-4 border-2 max-h-[calc(100vh-8rem)] overflow-y-auto shadow-lg">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BookmarkIcon className="h-5 w-5" />
                Sommaire
              </h3>
              <nav className="space-y-3">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`flex items-start gap-3 text-sm transition-colors hover:text-primary ${
                      activeSection === section.id ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection(section.id);
                    }}
                  >
                    <Badge variant="secondary" className="flex-shrink-0">
                      {romanNumerals[section.number - 1] || section.number}
                    </Badge>
                    <span className="leading-tight">{section.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>

      {/* Documents Section */}
      {documents.length > 0 && (
        <DocumentList documents={documents} />
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!hasPrevious}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Précédent
        </Button>

        <Button
          onClick={onNext}
          disabled={!hasNext}
        >
          Suivant
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};