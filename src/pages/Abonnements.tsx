import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pricing from "@/components/Pricing";

const Abonnements = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => navigate("/account")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour vers gestion de compte
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        <Pricing />
      </main>
    </div>
  );
};

export default Abonnements;
