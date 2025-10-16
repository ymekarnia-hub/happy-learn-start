import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { DocumentList } from "./DocumentList";
import { VideoPlayer } from "./VideoPlayer";

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
  const videos = materials.filter(m => m.type === "video");
  const documents = materials.filter(m => m.type !== "video") as Array<{
    id: string;
    title: string;
    type: "pdf" | "image" | "link";
    url: string;
  }>;

  return (
    <div className="space-y-6">
      {/* Video Section */}
      {videos.length > 0 && (
        <div className="space-y-4">
          {videos.map(video => (
            <VideoPlayer key={video.id} url={video.url} title={video.title} />
          ))}
        </div>
      )}

      {/* Content Section */}
      <div className="bg-card rounded-lg p-6 border-2">
        <div 
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
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