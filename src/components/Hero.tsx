import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import heroImage from "@/assets/hero-students.jpg";

const Hero = () => {
  return (
    <section id="accueil" className="relative min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Élèves souriants travaillant ensemble"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/60" />
      </div>
      
      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full mb-8">
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">Plateforme d'apprentissage en ligne</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            La plateforme qui booste vos résultats scolaires de la 6ème à la terminale
          </h1>
          
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg px-8 py-6 rounded-lg mb-6">
            Commencer l'essai gratuit
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2 text-white">
            <span className="text-xl">🇩🇿</span>
            <span className="text-base">Programmes officiels de l'éducation nationale algérienne</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
