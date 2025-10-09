import { User, Brain, TrendingUp, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";
import studentsImage from "@/assets/student-tutoring-teen.jpg";

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
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pourquoi nous choisir ?
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Une approche unique qui transforme les difficultés en réussites
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
          {/* Left side - Features */}
          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right side - Image */}
          <div className="relative h-full">
            <div className="relative rounded-2xl overflow-hidden shadow-xl h-full">
              <img
                src={studentsImage}
                alt="Étudiants travaillant ensemble"
                className="w-full h-full object-cover min-h-[500px]"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
