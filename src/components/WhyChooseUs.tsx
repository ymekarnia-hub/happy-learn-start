import { User, Brain, TrendingUp, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import studentsImage from "@/assets/students-studying-new.jpg";

const WhyChooseUs = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: User,
      title: "Suivi personnalisé",
      description: "Grâce à un tableau de bord détaillé, les élèves et les parents peuvent suivre l'évolution des apprentissages, accéder à des outils d'aide aux devoirs et bénéficier d'un suivi pédagogique personnalisé.",
      color: "bg-blue-500"
    },
    {
      icon: Brain,
      title: "L'intelligence artificielle au cœur de la pédagogie",
      description: "Notre plateforme intègre les avancées de l'IA pour proposer des contenus adaptés et sur-mesure, améliorer la compréhension et accompagner chaque élève dans sa progression.",
      color: "bg-orange-500"
    },
    {
      icon: TrendingUp,
      title: "Progression rapide",
      description: "Des cours et exercices conçus pour renforcer les connaissances, combler les lacunes et faire évoluer les résultats en un temps record.",
      color: "bg-blue-500"
    },
    {
      icon: GraduationCap,
      title: "Professeurs certifiés",
      description: "Enseignants qualifiés et expérimentés, passionnés par la transmission du savoir.",
      color: "bg-orange-500"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi nous choisir ?
          </h2>
          <p className="text-gray-600 text-lg">
            Une approche unique qui transforme les difficultés en réussites
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Features */}
          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right side - Image */}
          <div className="relative">
            <img
              src={studentsImage}
              alt="Étudiants travaillant ensemble"
              className="rounded-3xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
