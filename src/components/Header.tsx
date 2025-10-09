import { GraduationCap, LogOut, Globe, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

const Header = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"fr" | "ar">("fr");
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl text-gray-900 font-bold">AcadémiePlus</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              onClick={() => scrollToSection("pricing")}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold"
            >
              Découvrir les formules
            </Button>

            <a
              href="tel:023210000"
              className="text-xl text-gray-900 font-bold hover:text-blue-600 transition-colors"
            >
              📞 023 21 00 00
            </a>

            {session ? (
              <Button variant="outline" onClick={handleLogout} className="font-bold">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="text-xl text-gray-900 font-bold bg-transparent hover:bg-gray-100"
              >
                Se connecter
              </Button>
            )}

            {!session && (
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold">
                Essai gratuit
              </Button>
            )}
          </div>

          {/* Language Selector - Desktop */}
          <div className="hidden lg:block relative ml-4">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Globe className="h-5 w-5 text-gray-700" />
              <span className="text-lg">{currentLang === "fr" ? "🇫🇷" : "🇩🇿"}</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[150px]">
                <button
                  onClick={() => {
                    setCurrentLang("fr");
                    setIsLangOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                >
                  🇫🇷 Français
                </button>
                <button
                  onClick={() => {
                    setCurrentLang("ar");
                    setIsLangOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                >
                  🇩🇿 العربية
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-3">
            <Button
              onClick={() => scrollToSection("pricing")}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold"
            >
              Découvrir les formules
            </Button>

            <a
              href="tel:023210000"
              className="block text-center text-xl text-gray-900 font-bold hover:text-blue-600 py-2"
            >
              📞 023 21 00 00
            </a>

            {session ? (
              <Button variant="outline" onClick={handleLogout} className="w-full font-bold">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="w-full text-xl text-gray-900 font-bold bg-transparent hover:bg-gray-100"
              >
                Se connecter
              </Button>
            )}

            {!session && (
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold">
                Essai gratuit
              </Button>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCurrentLang("fr")}
                className={`flex-1 py-2 rounded-lg border ${
                  currentLang === "fr" ? "bg-blue-50 border-blue-600" : "border-gray-200"
                }`}
              >
                🇫🇷 Français
              </button>
              <button
                onClick={() => setCurrentLang("ar")}
                className={`flex-1 py-2 rounded-lg border ${
                  currentLang === "ar" ? "bg-blue-50 border-blue-600" : "border-gray-200"
                }`}
              >
                🇩🇿 العربية
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
