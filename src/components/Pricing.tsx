import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const Pricing = () => {
  const plans = [
    {
      name: "Découverte",
      price: "2 990 DA",
      period: "/mois",
      description: "Parfait pour débuter",
      features: [
        "Accès à 3 matières",
        "100+ exercices interactifs",
        "Suivi de progression",
        "Support par email",
      ],
      highlighted: false,
    },
    {
      name: "Régulier",
      price: "4 990 DA",
      period: "/mois",
      description: "Le plus populaire",
      features: [
        "Accès à toutes les matières",
        "500+ exercices interactifs",
        "Vidéos de cours",
        "Suivi personnalisé",
        "Support prioritaire",
        "Examens blancs",
      ],
      highlighted: true,
    },
    {
      name: "Intensif",
      price: "7 990 DA",
      period: "/mois",
      description: "Pour une préparation complète",
      features: [
        "Tout du plan Régulier",
        "Cours en direct chaque semaine",
        "Correction personnalisée",
        "Révisions avant examens",
        "Accès illimité 24/7",
        "Garantie résultats",
      ],
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Découvrir les Formules
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choisissez la formule qui correspond le mieux à vos besoins et à votre budget
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`p-8 ${
                plan.highlighted
                  ? "border-2 border-blue-600 shadow-xl scale-105"
                  : "border border-gray-200"
              } bg-white relative`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-1 rounded-full text-sm font-bold">
                    POPULAIRE
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full font-bold ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
                    : "bg-white text-gray-900 border-2 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Choisir {plan.name}
              </Button>
            </Card>
          ))}
        </div>

        <p className="text-center text-gray-600 mt-8">
          Crédit d'impôt de 50% applicable sur tous nos services
        </p>
      </div>
    </section>
  );
};

export default Pricing;
