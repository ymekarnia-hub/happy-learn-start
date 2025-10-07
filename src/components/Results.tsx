import { Card } from "./ui/card";
import studentsSuccessImage from "@/assets/students-success.jpg";
import studentOnlineImage from "@/assets/student-online.jpg";

const Results = () => {
  const stats = [
    {
      value: "98%",
      label: "Taux de réussite aux examens",
      description: "Nos élèves excellent dans leurs évaluations",
    },
    {
      value: "+2.5",
      label: "Points de moyenne gagnés",
      description: "Progression moyenne en 3 mois",
    },
    {
      value: "15 000+",
      label: "Élèves accompagnés",
      description: "Depuis notre création",
    },
    {
      value: "4.9/5",
      label: "Satisfaction des parents",
      description: "Note moyenne sur l'ensemble de nos services",
    },
  ];

  return (
    <section id="resultats" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Des résultats qui parlent
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            La preuve de notre efficacité à travers les chiffres
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-card"
            >
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-foreground mb-2">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="overflow-hidden bg-card">
            <img 
              src={studentsSuccessImage} 
              alt="Élèves célébrant leur réussite"
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Confiance retrouvée
              </h3>
              <p className="text-muted-foreground">
                Nos élèves regagnent confiance en leurs capacités et développent l'autonomie nécessaire pour réussir leur parcours scolaire.
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden bg-card">
            <img 
              src={studentOnlineImage} 
              alt="Élève suivant un cours en ligne"
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Flexibilité totale
              </h3>
              <p className="text-muted-foreground">
                Cours en présentiel ou en ligne, horaires adaptés : nous nous ajustons à votre emploi du temps pour un accompagnement optimal.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Results;
