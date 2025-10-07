import { ArrowRight, Mail, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const CTA = () => {
  return (
    <section id="contact" className="py-24 bg-gradient-to-r from-primary via-primary to-accent relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à booster la réussite de votre enfant ?
          </h2>
          <p className="text-xl text-white/95 mb-8">
            Profitez d'un premier cours d'essai gratuit pour découvrir notre méthode
          </p>
          <Button variant="hero" size="xl" className="bg-white text-primary hover:bg-white/90 hover:scale-105">
            Réserver mon cours gratuit
            <ArrowRight className="ml-2" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Card className="p-6 bg-white/95 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Appelez-nous</h3>
                <p className="text-muted-foreground">Du lundi au samedi, 9h-19h</p>
                <p className="text-primary font-semibold mt-1">01 23 45 67 89</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/95 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Écrivez-nous</h3>
                <p className="text-muted-foreground">Réponse sous 24h</p>
                <p className="text-primary font-semibold mt-1">contact@edusuccess.fr</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CTA;
