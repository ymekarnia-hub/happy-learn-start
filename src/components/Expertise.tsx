import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { GraduationCap, Calendar, ShieldCheck } from "lucide-react";
import teachersTeamImage from "@/assets/teachers-team.jpg";

const Expertise = () => {
  const guarantees = [
    {
      icon: GraduationCap,
      title: "Expertise Certifiée",
      description: "Une équipe d'enseignants diplômés de l'Éducation Nationale",
    },
    {
      icon: Calendar,
      title: "Plus de 20 ans d'expérience",
      description: "Des pédagogues chevronnés qui connaissent les défis de chaque niveau",
    },
    {
      icon: ShieldCheck,
      title: "Contenu Validé",
      description: "Des supports pédagogiques rigoureusement élaborés et testés",
    },
  ];

  return (
    <section id="expertise" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Une Pédagogie d'Excellence, Validée par l'Expérience
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            La garantie d'un contenu fiable et efficace
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          <div className="order-2 lg:order-1">
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-6">
                Chez <strong className="text-foreground">Excellence Scolaire</strong>, la qualité de l'enseignement est notre priorité absolue. C'est pourquoi tous nos cours, fiches de révision et exercices sont élaborés par une équipe d'enseignants certifiés et passionnés, dotés d'une expérience pédagogique de plus de 20 ans dans l'Éducation Nationale.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Leur expertise garantit un contenu non seulement conforme aux programmes officiels, mais aussi adapté aux besoins réels des élèves, avec des méthodes qui ont fait leurs preuves sur le terrain. Nous mettons leur savoir-faire au service de la réussite de votre enfant.
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <img 
              src={teachersTeamImage} 
              alt="Équipe pédagogique professionnelle préparant des cours"
              className="w-full h-auto rounded-lg shadow-elegant"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {guarantees.map((guarantee, index) => {
            const Icon = guarantee.icon;
            return (
              <Card 
                key={index} 
                className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-card border-border"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {guarantee.title}
                </h3>
                <p className="text-muted-foreground">
                  {guarantee.description}
                </p>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg" className="text-lg">
            Consulter nos programmes par matière
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Expertise;
