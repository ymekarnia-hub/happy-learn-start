import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import studentsImage from "@/assets/students-success.jpg";

const CTA = () => {
  return (
    <section id="cta" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={studentsImage} 
          alt="Élèves réussissant leurs examens"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-900/90" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à commencer ton parcours vers la réussite ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Rejoins des milliers d'élèves qui progressent chaque jour avec nos cours en ligne
          </p>
          <Button className="bg-white text-blue-700 hover:bg-gray-100 font-bold text-lg px-8 py-6 rounded-lg">
            Commencer l'essai gratuit
            <ArrowRight className="ml-2" />
          </Button>
          <p className="text-white/80 mt-4">
            Sans engagement • 7 jours gratuits • Annulation à tout moment
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
