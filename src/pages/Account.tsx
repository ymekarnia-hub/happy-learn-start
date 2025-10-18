import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, CreditCard, FileText, Gift, Users, BarChart3, ArrowLeft, GraduationCap, LogOut, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const getSchoolLevelName = (level: string) => {
    const levels = {
      cp: 'CP', ce1: 'CE1', ce2: 'CE2', cm1: 'CM1', cm2: 'CM2',
      sixieme: '6ème', cinquieme: '5ème', quatrieme: '4ème', troisieme: '3ème',
      seconde: 'Seconde', premiere: 'Première', terminale: 'Terminale'
    };
    return levels[level as keyof typeof levels] || 'Votre classe';
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
    navigate("/");
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
      onClick: () => navigate("/abonnements"),
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
      {/* Navigation Header - Same as ListeCours */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={() => navigate("/dashboard")}
            >
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">AcadémiePlus</span>
            </div>

            {/* Right Side: User Menu */}
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
            <p className="text-muted-foreground text-sm">{profile?.email}</p>
          </div>

          {/* Account Management Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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

          {/* Back Link at Bottom */}
          <div className="flex justify-center pb-8">
            <Button variant="ghost" onClick={() => navigate("/liste-cours")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour vers liste des matières
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
