import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  MoreVertical,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import { SectionEditor } from "@/components/editorial/SectionEditor";
import { MetadataPanel } from "@/components/editorial/MetadataPanel";

interface Section {
  id?: number;
  titre: string;
  type: string;
  ordre: number;
  contenu_texte: string;
  formules?: any[];
  medias?: any[];
}

interface CourseData {
  id?: number;
  titre: string;
  slug: string;
  matiere_id: number | null;
  niveau_id: number | null;
  description: string;
  duree_lecture: number;
  difficulte: number;
  statut: string;
  meta_title: string;
  meta_description: string;
  programme_id?: number | null;
  sections: Section[];
}

export default function EditeurCours() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseData>({
    titre: "",
    slug: "",
    matiere_id: null,
    niveau_id: null,
    description: "",
    duree_lecture: 10,
    difficulte: 3,
    statut: "brouillon",
    meta_title: "",
    meta_description: "",
    sections: [],
  });
  const [matieres, setMatieres] = useState<any[]>([]);
  const [niveaux, setNiveaux] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    loadInitialData();
  }, [id]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (course.id) {
      saveTimerRef.current = setInterval(() => {
        saveCourse(false);
      }, 30000);

      return () => {
        if (saveTimerRef.current) {
          clearInterval(saveTimerRef.current);
        }
      };
    }
  }, [course]);

  // Generate slug from title
  useEffect(() => {
    if (course.titre && !id) {
      const slug = course.titre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setCourse((prev) => ({ ...prev, slug }));
    }
  }, [course.titre]);

  const loadInitialData = async () => {
    try {
      // Load matieres and niveaux
      const [matieresRes, niveauxRes] = await Promise.all([
        supabase.from("matieres").select("*").eq("active", true).order("ordre"),
        supabase.from("niveaux").select("*").order("ordre"),
      ]);

      if (matieresRes.data) setMatieres(matieresRes.data);
      if (niveauxRes.data) setNiveaux(niveauxRes.data);

      // Load course if editing
      if (id && id !== "nouveau") {
        const { data: courseData, error } = await supabase
          .from("cours")
          .select(`
            *,
            sections (
              id,
              titre,
              type,
              ordre,
              contenu_texte,
              formules (*),
              medias (*)
            )
          `)
          .eq("id", parseInt(id))
          .single();

        if (error) throw error;

        if (courseData) {
          setCourse({
            ...courseData,
            sections: courseData.sections || [],
          });
        }
      }
    } catch (error: any) {
      toast.error("Erreur lors du chargement");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveCourse = async (showToast = true) => {
    setSaving(true);
    try {
      const courseData = {
        titre: course.titre,
        slug: course.slug,
        matiere_id: course.matiere_id,
        niveau_id: course.niveau_id,
        description: course.description,
        duree_lecture: course.duree_lecture,
        difficulte: course.difficulte,
        statut: course.statut,
        meta_title: course.meta_title,
        meta_description: course.meta_description,
        programme_id: course.programme_id,
        date_modification: new Date().toISOString(),
      };

      let courseId = course.id;

      if (courseId) {
        // Update existing course
        const { error } = await supabase
          .from("cours")
          .update(courseData)
          .eq("id", courseId);

        if (error) throw error;
      } else {
        // Create new course
        const { data, error } = await supabase
          .from("cours")
          .insert([courseData])
          .select()
          .single();

        if (error) throw error;
        courseId = data.id;
        setCourse((prev) => ({ ...prev, id: courseId }));
        navigate(`/editorial/cours/${courseId}`, { replace: true });
      }

      // Save sections
      if (courseId) {
        // Delete removed sections
        const sectionIds = course.sections
          .filter((s) => s.id)
          .map((s) => s.id);
        
        if (sectionIds.length > 0) {
          await supabase
            .from("sections")
            .delete()
            .eq("cours_id", courseId)
            .not("id", "in", `(${sectionIds.join(",")})`);
        }

        // Upsert sections
        for (const section of course.sections) {
          const sectionData = {
            cours_id: courseId,
            titre: section.titre,
            type: section.type,
            ordre: section.ordre,
            contenu_texte: section.contenu_texte,
          };

          if (section.id) {
            await supabase
              .from("sections")
              .update(sectionData)
              .eq("id", section.id);
          } else {
            const { data, error } = await supabase
              .from("sections")
              .insert([sectionData])
              .select()
              .single();

            if (error) throw error;
            section.id = data.id;
          }
        }
      }

      if (showToast) {
        toast.success("Cours sauvegardé");
      }
    } catch (error: any) {
      toast.error("Erreur lors de la sauvegarde");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const publishCourse = async () => {
    if (!course.titre) {
      toast.error("Le titre est obligatoire");
      return;
    }

    if (course.sections.length === 0) {
      toast.error("Ajoutez au moins une section");
      return;
    }

    setCourse((prev) => ({ ...prev, statut: "publié" }));
    await saveCourse();
    toast.success("Cours publié avec succès");
  };

  const addSection = () => {
    const newSection: Section = {
      titre: "Nouvelle section",
      type: "definition",
      ordre: course.sections.length,
      contenu_texte: "",
      formules: [],
      medias: [],
    };

    setCourse((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const updateSection = (index: number, updatedSection: Section) => {
    const newSections = [...course.sections];
    newSections[index] = updatedSection;
    setCourse((prev) => ({ ...prev, sections: newSections }));
  };

  const deleteSection = (index: number) => {
    if (!confirm("Supprimer cette section ?")) return;

    const newSections = course.sections.filter((_, i) => i !== index);
    setCourse((prev) => ({ ...prev, sections: newSections }));
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
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/editorial">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <Input
                value={course.titre}
                onChange={(e) =>
                  setCourse((prev) => ({ ...prev, titre: e.target.value }))
                }
                placeholder="Titre du cours"
                className="text-2xl font-bold border-0 focus-visible:ring-0 h-auto p-0"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {saving ? "Enregistrement..." : "Enregistré"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <Select
              value={course.matiere_id?.toString() || ""}
              onValueChange={(value) =>
                setCourse((prev) => ({ ...prev, matiere_id: parseInt(value) }))
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Matière" />
              </SelectTrigger>
              <SelectContent>
                {matieres.map((m) => (
                  <SelectItem key={m.id} value={m.id.toString()}>
                    {m.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={course.niveau_id?.toString() || ""}
              onValueChange={(value) =>
                setCourse((prev) => ({ ...prev, niveau_id: parseInt(value) }))
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                {niveaux.map((n) => (
                  <SelectItem key={n.id} value={n.id.toString()}>
                    {n.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Label>Difficulté:</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() =>
                      setCourse((prev) => ({ ...prev, difficulte: level }))
                    }
                    className={`text-xl ${
                      level <= course.difficulte
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Label>Durée:</Label>
              <Input
                type="number"
                value={course.duree_lecture}
                onChange={(e) =>
                  setCourse((prev) => ({
                    ...prev,
                    duree_lecture: parseInt(e.target.value) || 0,
                  }))
                }
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">min</span>
            </div>

            <Select
              value={course.statut}
              onValueChange={(value) =>
                setCourse((prev) => ({ ...prev, statut: value }))
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brouillon">Brouillon</SelectItem>
                <SelectItem value="en_revision">En révision</SelectItem>
                <SelectItem value="publié">Publié</SelectItem>
                <SelectItem value="archivé">Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Metadata */}
            <MetadataPanel course={course} onChange={setCourse} />

            {/* Sections */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Contenu du cours</h2>
                <Button onClick={addSection} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une section
                </Button>
              </div>

              <div className="space-y-4">
                {course.sections.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune section. Cliquez sur "Ajouter une section" pour commencer.
                  </div>
                ) : (
                  course.sections.map((section, index) => (
                    <SectionEditor
                      key={index}
                      section={section}
                      onChange={(updated) => updateSection(index, updated)}
                      onDelete={() => deleteSection(index)}
                    />
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar - Preview */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Aperçu</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Titre</p>
                  <p className="font-medium">{course.titre || "Sans titre"}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground">Sections</p>
                  <p className="font-medium">{course.sections.length}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground">Statut</p>
                  <p className="font-medium capitalize">{course.statut}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Fixed bottom toolbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {course.id
              ? `Dernière modification: ${new Date().toLocaleDateString("fr-FR")}`
              : "Nouveau cours"}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => saveCourse()}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Prévisualiser
            </Button>
            <Button onClick={publishCourse}>
              <Send className="h-4 w-4 mr-2" />
              Publier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
