import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CourseContent } from "@/components/course/CourseContent";
import { ChapterGrid } from "@/components/course/ChapterGrid";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, GraduationCap, LogOut, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Cours = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [subject, setSubject] = useState<any>(null);
  const [schoolLevel, setSchoolLevel] = useState<string>("");
  const [chapters, setChapters] = useState<any[]>([]);
  const [activeChapter, setActiveChapter] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "content">("grid");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (subjectId) {
      fetchCourse();
    }
  }, [subjectId]);

  useEffect(() => {
    if (activeChapter) {
      fetchMaterials(activeChapter.id);
    }
  }, [activeChapter]);

  const fetchCourse = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);
      setSchoolLevel(profileData?.school_level || "");

      // Fetch subject details
      const { data: subjectData } = await supabase
        .from("subjects")
        .select("*")
        .eq("id", subjectId)
        .single();

      setSubject(subjectData);

      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("subject_id", subjectId)
        .eq("school_level", profileData?.school_level)
        .order("order_index")
        .limit(1)
        .maybeSingle();

      if (courseError) throw courseError;
      setCourse(courseData);

      const { data: chaptersData, error: chaptersError } = await supabase
        .from("course_chapters")
        .select("*")
        .eq("course_id", courseData.id)
        .order("order_index");

      if (chaptersError) throw chaptersError;
      setChapters(chaptersData);

      if (chaptersData.length > 0) {
        setActiveChapter(chaptersData[0]);
      }

      const { data: progressData } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id);

      setProgress(progressData || []);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le cours",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async (chapterId: string) => {
    const { data, error } = await supabase
      .from("course_materials")
      .select("*")
      .eq("chapter_id", chapterId);

    if (!error && data) {
      setMaterials(data);
    }
  };

  const handleMarkComplete = async () => {
    if (!activeChapter) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isCompleted = progress.some(p => p.chapter_id === activeChapter.id);

    if (isCompleted) {
      await supabase
        .from("user_progress")
        .delete()
        .eq("user_id", user.id)
        .eq("chapter_id", activeChapter.id);
    } else {
      await supabase
        .from("user_progress")
        .upsert({
          user_id: user.id,
          chapter_id: activeChapter.id,
          completed: true,
          completed_at: new Date().toISOString(),
        });
    }

    fetchCourse();
    toast({
      title: isCompleted ? "Marqué comme non complété" : "Chapitre complété !",
      description: isCompleted ? "" : "Continuez comme ça ! 🎉",
    });
  };

  const handleChapterChange = (direction: "prev" | "next") => {
    const currentIndex = chapters.findIndex(c => c.id === activeChapter?.id);
    if (direction === "prev" && currentIndex > 0) {
      setActiveChapter(chapters[currentIndex - 1]);
    } else if (direction === "next" && currentIndex < chapters.length - 1) {
      setActiveChapter(chapters[currentIndex + 1]);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getSchoolLevelName = (level: string) => {
    const labels: Record<string, string> = {
      sixieme: "6ème",
      cinquieme: "5ème",
      quatrieme: "4ème",
      troisieme: "3ème",
      seconde: "Seconde",
      premiere: "Première",
      terminale: "Terminale",
    };
    return labels[level] || level;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Cours non trouvé</h2>
      </div>
    );
  }

  const currentIndex = chapters.findIndex(c => c.id === activeChapter?.id);
  const completedChapters = progress.filter(p =>
    chapters.some(c => c.id === p.chapter_id)
  ).length;
  const progressPercentage = (completedChapters / chapters.length) * 100;

  const schoolLevelLabels: Record<string, string> = {
    "sixieme": "6ème",
    "cinquieme": "5ème",
    "quatrieme": "4ème",
    "troisieme": "3ème",
    "seconde": "Seconde",
    "premiere": "Première",
    "terminale": "Terminale"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={() => navigate("/dashboard")}
            >
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">AcadémiePlus</span>
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-accent/10 rounded-lg p-2 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback>
                        {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <p className="text-sm font-medium">{profile?.full_name || 'Utilisateur'}</p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.school_level && getSchoolLevelName(profile.school_level)}
                      </p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/account")}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Gérer mon compte</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <span>Tableau de bord</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 mt-20">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="transition-colors hover:text-foreground">
                Accueil
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/liste-cours" className="transition-colors hover:text-foreground">
                {schoolLevelLabels[schoolLevel] || "Mes matières"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {viewMode === "content" ? (
                <BreadcrumbLink 
                  onClick={() => setViewMode("grid")}
                  className="cursor-pointer transition-colors hover:text-foreground"
                >
                  {subject?.name || subjectId?.charAt(0).toUpperCase() + subjectId?.slice(1)}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{subject?.name || subjectId?.charAt(0).toUpperCase() + subjectId?.slice(1)}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {viewMode === "content" && activeChapter && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Chapitre {currentIndex + 1}: {activeChapter.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {viewMode === "content" && activeChapter 
                ? activeChapter.title 
                : subject?.name || subjectId?.charAt(0).toUpperCase() + subjectId?.slice(1)}
            </h1>
          </div>

          {viewMode === "grid" ? (
            <ChapterGrid
              chapters={chapters.map(c => ({
                ...c,
                completed: progress.some(p => p.chapter_id === c.id)
              }))}
              onChapterSelect={(id) => {
                const chapter = chapters.find(c => c.id === id);
                if (chapter) {
                  setActiveChapter(chapter);
                  setViewMode("content");
                }
              }}
            />
          ) : (
            <div className="space-y-4">
              {activeChapter && (
                <CourseContent
                  content={activeChapter.content}
                  materials={materials}
                  completed={progress.some(p => p.chapter_id === activeChapter.id)}
                  onMarkComplete={handleMarkComplete}
                  onPrevious={() => handleChapterChange("prev")}
                  onNext={() => handleChapterChange("next")}
                  hasPrevious={chapters.findIndex(c => c.id === activeChapter?.id) > 0}
                  hasNext={chapters.findIndex(c => c.id === activeChapter?.id) < chapters.length - 1}
                  onDownloadPDF={() => window.print()}
                />
              )}
            </div>
          )}
         </div>
      </main>
    </div>
  );
};

export default Cours;