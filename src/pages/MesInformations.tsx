import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().trim().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  phone: z.string().trim().max(20, "Le téléphone ne peut pas dépasser 20 caractères").optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
});

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  school_level: string | null;
  role: string | null;
}

const MesInformations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    date_of_birth: "",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      fetchProfile(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      fetchProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone, date_of_birth, school_level, role")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
      setFormData({
        full_name: data.full_name || "",
        phone: data.phone || "",
        date_of_birth: data.date_of_birth || "",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);

      // Validation
      const validatedData = profileSchema.parse({
        full_name: formData.full_name,
        phone: formData.phone || null,
        date_of_birth: formData.date_of_birth || null,
      });

      if (!profile?.id) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: validatedData.full_name,
          phone: validatedData.phone,
          date_of_birth: validatedData.date_of_birth,
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Vos informations ont été mises à jour",
      });

      // Refresh profile
      fetchProfile(profile.id);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erreur de validation",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setUpdating(false);
    }
  };

  const getSchoolLevelName = (level: string | null) => {
    if (!level) return "Non défini";
    const levels: { [key: string]: string } = {
      primary: "Primaire",
      middle: "Collège",
      high: "Lycée",
    };
    return levels[level] || level;
  };

  const getRoleName = (role: string | null) => {
    if (!role) return "Non défini";
    const roles: { [key: string]: string } = {
      student: "Étudiant",
      parent: "Parent",
      teacher: "Enseignant",
      admin: "Administrateur",
    };
    return roles[role] || role;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => navigate("/account")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour au compte
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Mes Informations</CardTitle>
              <CardDescription>Vos informations personnelles d'inscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nom complet</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Numéro de téléphone"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date de naissance</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school_level">Niveau scolaire</Label>
                  <Input
                    id="school_level"
                    value={getSchoolLevelName(profile?.school_level)}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Input id="role" value={getRoleName(profile?.role)} disabled className="bg-muted" />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleUpdate} disabled={updating}>
                  {updating ? "Mise à jour..." : "Mettre à jour"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MesInformations;
