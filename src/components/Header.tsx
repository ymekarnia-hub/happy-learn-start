import { GraduationCap } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
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

        <Button variant="cta" size="default">
          Commencer
        </Button>
      </div>
    </header>
  );
};

export default Header;
