import { ArrowRight } from "lucide-react";
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
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-accent/70" />
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Réussite scolaire garantie
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-8 leading-relaxed">
            Accompagnement personnalisé pour chaque élève. Des professeurs qualifiés, des méthodes innovantes et des résultats prouvés.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="xl">
              Essai gratuit
              <ArrowRight className="ml-2" />
            </Button>
            <Button variant="outline" size="xl" className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm">
              En savoir plus
            </Button>
          </div>
          
          <div className="mt-12 flex flex-wrap gap-8 text-white">
            <div>
              <div className="text-4xl font-bold">98%</div>
              <div className="text-white/90">de réussite</div>
            </div>
            <div>
              <div className="text-4xl font-bold">+2.5</div>
              <div className="text-white/90">points de moyenne</div>
            </div>
            <div>
              <div className="text-4xl font-bold">15k+</div>
              <div className="text-white/90">élèves accompagnés</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
