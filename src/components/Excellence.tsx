import { GraduationCap, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import teachersImage from "@/assets/teachers-team.jpg";

const Excellence = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Expertise Certifiée",
      description: "Une équipe d'enseignants diplômés de l'Éducation Nationale",
      color: "bg-blue-500"
    },
    {
      icon: Calendar,
      title: "Plus de 20 ans d'expérience",
      description: "Des pédagogues chevronnés qui connaissent les défis de chaque niveau",
      color: "bg-blue-500"
    },
    {
      icon: Shield,
      title: "Contenu Validé",
      description: "Des supports pédagogiques rigoureusement élaborés et testés",
      color: "bg-blue-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Une Pédagogie d'Excellence, Validée par l'Expérience
          </h2>
          <p className="text-gray-600 text-lg">
            La garantie d'un contenu fiable et efficace
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto mb-16">
          {/* Left side - Text */}
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Chez <span className="font-bold text-blue-600">AcadémiePlus</span>, la qualité de l'enseignement est notre priorité absolue. C'est pourquoi tous nos cours, fiches de révision et exercices sont élaborés par une équipe d'enseignants certifiés et passionnés, dotés d'une expérience pédagogique de plus de 20 ans dans l'Éducation Nationale.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Leur expertise garantit un contenu non seulement conforme aux programmes officiels, mais aussi adapté aux besoins réels des élèves, avec des méthodes qui ont fait leurs preuves sur le terrain. Nous mettons leur savoir-faire au service de la réussite de votre enfant.
            </p>
          </div>

          {/* Right side - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src={teachersImage}
                alt="Équipe d'enseignants expérimentés"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Features Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Consulter nos programmes par matière
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Excellence;
