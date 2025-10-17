import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, CreditCard, FileText, Gift, Users, Wallet, BarChart3, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "student" | "parent" | "teacher" | "admin";
  school_level: string | null;
  email: string | null;
}

const Account = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchProfile(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

      if (error) throw error;
      setProfile(data);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const accountCards = [
    {
      title: "Mes Informations",
      description: "Gérer mes informations personnelles",
      icon: UserCircle,
      color: "text-blue-600",
      onClick: () => navigate("/mes-informations"),
    },
    {
      title: "Les abonnements",
      description: "Gérer mes abonnements et plans",
      icon: CreditCard,
      color: "text-purple-600",
      onClick: () => toast({ title: "Les abonnements", description: "Section en cours de développement" }),
    },
    {
      title: "Factures",
      description: "Consulter mes factures",
      icon: FileText,
      color: "text-green-600",
      onClick: () => navigate("/factures"),
    },
    {
      title: "Activer un code prépayé",
      description: "Activer un code promo ou cadeau",
      icon: Gift,
      color: "text-pink-600",
      onClick: () => toast({ title: "Activer un code", description: "Section en cours de développement" }),
    },
    {
      title: "Parrainage",
      description: "Inviter des amis et gagner des récompenses",
      icon: Users,
      color: "text-orange-600",
      onClick: () => toast({ title: "Parrainage", description: "Section en cours de développement" }),
    },

    {
      title: "Mes statistiques",
      description: "Voir mes statistiques d'apprentissage",
      icon: BarChart3,
      color: "text-indigo-600",
      onClick: () => toast({ title: "Mes statistiques", description: "Section en cours de développement" }),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => navigate("/liste-cours")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour vers liste des matières
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Profile Photo and Title */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Avatar className="h-32 w-32 border-4 border-primary">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-4xl">
                  {profile?.full_name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <h1 className="text-4xl font-bold mb-2">Gérer mon compte</h1>
            <p className="text-muted-foreground text-lg">{profile?.full_name || "Utilisateur"}</p>
          </div>

          {/* Account Management Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accountCards.map((card, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                onClick={card.onClick}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                    <span>{card.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
