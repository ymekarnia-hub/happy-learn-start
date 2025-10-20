import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface CourseInReview {
  id: number;
  titre: string;
  description: string;
  date_modification: string;
  auteur_id: number;
  matieres?: { nom: string };
  niveaux?: { nom: string };
  sections?: any[];
}

export default function PageRevision() {
  const [coursesInReview, setCoursesInReview] = useState<CourseInReview[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseInReview | null>(null);
  const [reviewComments, setReviewComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCoursesInReview();
  }, []);

  const loadCoursesInReview = async () => {
    try {
      const { data, error } = await supabase
        .from("cours")
        .select(`
          id,
          titre,
          description,
          date_modification,
          auteur_id,
          matieres (nom),
          niveaux (nom),
          sections (
            id,
            titre,
            type,
            ordre,
            contenu_texte
          )
        `)
        .eq("statut", "en_revision")
        .order("date_modification", { ascending: false });

      if (error) throw error;

      setCoursesInReview(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveCourse = async () => {
    if (!selectedCourse) return;

    setSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const { error } = await supabase
        .from("cours")
        .update({
          statut: "publié",
          revieur_id: userId ? parseInt(userId) : null,
          date_publication: new Date().toISOString(),
          commentaire_revue: reviewComments,
        })
        .eq("id", selectedCourse.id);

      if (error) throw error;

      toast.success("Cours approuvé et publié !");
      setSelectedCourse(null);
      setReviewComments("");
      loadCoursesInReview();
    } catch (error: any) {
      toast.error("Erreur lors de l'approbation");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const requestChanges = async () => {
    if (!selectedCourse) return;
    if (!reviewComments.trim()) {
      toast.error("Veuillez ajouter des commentaires");
      return;
    }

    setSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const { error } = await supabase
        .from("cours")
        .update({
          statut: "brouillon",
          revieur_id: userId ? parseInt(userId) : null,
          commentaire_revue: reviewComments,
        })
        .eq("id", selectedCourse.id);

      if (error) throw error;

      toast.success("Cours renvoyé à l'auteur avec vos commentaires");
      setSelectedCourse(null);
      setReviewComments("");
      loadCoursesInReview();
    } catch (error: any) {
      toast.error("Erreur lors de la demande de modifications");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Révision de cours</h1>
        <p className="text-muted-foreground mt-1">
          Validez ou demandez des modifications pour les cours en attente
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des cours en révision */}
        <Card className="p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Cours à réviser ({coursesInReview.length})
            </h2>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {coursesInReview.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>Aucun cours en attente de révision</p>
                </div>
              ) : (
                coursesInReview.map((course) => (
                  <Card
                    key={course.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedCourse?.id === course.id
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedCourse(course)}
                  >
                    <h3 className="font-semibold mb-2">{course.titre}</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        {course.matieres?.nom} / {course.niveaux?.nom}
                      </p>
                      <p>
                        Modifié le{" "}
                        {new Date(course.date_modification).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Aperçu et révision */}
        <Card className="p-6 lg:col-span-2">
          {selectedCourse ? (
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCourse.titre}</h2>
                    <p className="text-muted-foreground mt-1">
                      {selectedCourse.matieres?.nom} • {selectedCourse.niveaux?.nom}
                    </p>
                  </div>
                  <Badge>En révision</Badge>
                </div>

                {selectedCourse.description && (
                  <p className="text-muted-foreground mb-4">
                    {selectedCourse.description}
                  </p>
                )}
              </div>

              <Separator />

              {/* Aperçu du contenu */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Aperçu du cours
                </h3>

                <ScrollArea className="h-[300px] border rounded-lg p-4">
                  {selectedCourse.sections && selectedCourse.sections.length > 0 ? (
                    <div className="space-y-4">
                      {selectedCourse.sections
                        .sort((a, b) => a.ordre - b.ordre)
                        .map((section) => (
                          <div
                            key={section.id}
                            className={`p-4 rounded-lg ${
                              section.type === "definition"
                                ? "border-l-4 border-blue-500 bg-blue-50/50"
                                : section.type === "propriete"
                                ? "border-l-4 border-green-500 bg-green-50/50"
                                : section.type === "exemple"
                                ? "border-l-4 border-yellow-500 bg-yellow-50/50"
                                : section.type === "methode"
                                ? "border-l-4 border-purple-500 bg-purple-50/50"
                                : "border-l-4 border-gray-400 bg-gray-50/50"
                            }`}
                          >
                            <h4 className="font-semibold mb-2">{section.titre}</h4>
                            <Badge variant="outline" className="mb-2 capitalize">
                              {section.type}
                            </Badge>
                            <div className="prose prose-sm max-w-none">
                              <ReactMarkdown>{section.contenu_texte}</ReactMarkdown>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun contenu
                    </p>
                  )}
                </ScrollArea>
              </div>

              <Separator />

              {/* Commentaires de révision */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Commentaires de révision</h3>
                <Textarea
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  placeholder="Écrivez vos commentaires et remarques pour l'auteur..."
                  rows={6}
                  className="resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={approveCourse}
                  disabled={submitting}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approuver et publier
                </Button>
                <Button
                  onClick={requestChanges}
                  disabled={submitting}
                  variant="outline"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Demander modifications
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <Eye className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Sélectionnez un cours pour le réviser</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
