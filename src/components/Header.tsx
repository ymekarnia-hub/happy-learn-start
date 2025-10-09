import { GraduationCap, LogOut, Globe, Menu, X, Phone } from "lucide-react";
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

  const changeLanguage = (lang: "fr" | "ar") => {
    setCurrentLang(lang);
    
    // Trigger translation by manipulating URL hash
    const currentPath = window.location.pathname + window.location.search;
    if (lang === "ar") {
      window.location.href = `https://translate.google.com/translate?sl=fr&tl=ar&u=${encodeURIComponent(window.location.href)}`;
    } else {
      // Reload to French (original)
      if (window.location.hostname.includes('translate.google')) {
        window.location.href = window.location.href.split('&u=')[1] || '/';
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl text-gray-900 font-bold">AcadémiePlus</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              onClick={() => scrollToSection("pricing")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
            >
              Découvrir les formules
            </Button>

            <a
              href="tel:023210000"
              className="flex items-center gap-2 text-gray-900 font-medium hover:text-blue-600 transition-colors px-4"
            >
              <Phone className="h-5 w-5 text-pink-500" />
              023 21 00 00
            </a>

            {session ? (
              <Button variant="outline" onClick={handleLogout} className="font-medium">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                variant="ghost"
                className="text-gray-900 font-medium hover:text-blue-600"
              >
                Se connecter
              </Button>
            )}

            {!session && (
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6">
                Essai gratuit
              </Button>
            )}

            {/* Language Selector */}
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => changeLanguage("fr")}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  currentLang === "fr" ? "bg-blue-50" : "hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">🇫🇷</span>
                <span className="text-sm font-medium">FR</span>
              </button>
              <button
                onClick={() => changeLanguage("ar")}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  currentLang === "ar" ? "bg-blue-50" : "hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">🇩🇿</span>
                <span className="text-sm font-medium">AR</span>
              </button>
            </div>
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
                onClick={() => changeLanguage("fr")}
                className={`flex-1 py-2 rounded-lg border ${
                  currentLang === "fr" ? "bg-blue-50 border-blue-600" : "border-gray-200"
                }`}
              >
                🇫🇷 Français
              </button>
              <button
                onClick={() => changeLanguage("ar")}
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
