import { GraduationCap, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

const Header = () => {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erreur lors de la déconnexion");
    } else {
      toast.success("Déconnexion réussie");
      navigate("/");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">EduSuccess</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#accueil" className="text-foreground hover:text-primary transition-colors">
            Accueil
          </a>
          <a href="#avantages" className="text-foreground hover:text-primary transition-colors">
            Nos Avantages
          </a>
          <a href="#resultats" className="text-foreground hover:text-primary transition-colors">
            Résultats
          </a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors">
            Contact
          </a>
        </nav>

        {session ? (
          <Button variant="outline" size="default" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        ) : (
          <Button variant="cta" size="default" onClick={() => navigate("/auth")}>
            Connexion
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
