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
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Réussis ton année scolaire avec des cours en ligne interactifs
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
            Accède à des cours de qualité, exercices corrigés et suivi personnalisé 24h/24 et 7j/7
          </p>
          
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-lg px-8 py-6 rounded-lg">
            Commencer l'essai gratuit
          </Button>

          <div className="mt-6 flex items-center justify-center gap-2 text-white">
            <span className="text-2xl">🇩🇿</span>
            <span className="text-sm md:text-base">Programmes officiels de l'éducation national</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
