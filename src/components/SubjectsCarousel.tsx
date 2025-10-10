import { Check, BookOpen, Calculator, Globe, Beaker, Brain, Languages, MapPin, Lightbulb, Laptop, GraduationCap, Book } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";

const SubjectsCarousel = () => {
  const { t } = useTranslation();
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);

  const subjects = [
    { name: "Mathématiques", icon: Calculator, color: "bg-blue-500" },
    { name: "Physique", icon: Beaker, color: "bg-purple-500" },
    { name: "Français", icon: Languages, color: "bg-pink-500" },
    { name: "Arabe", icon: BookOpen, color: "bg-green-500" },
    { name: "Histoire", icon: Book, color: "bg-orange-500" },
    { name: "Chimie", icon: Brain, color: "bg-cyan-500" },
    { name: "Anglais", icon: Globe, color: "bg-red-500" },
    { name: "Sciences Naturelles", icon: Lightbulb, color: "bg-emerald-500" },
    { name: "Géographie", icon: MapPin, color: "bg-teal-500" },
    { name: "Philosophie", icon: GraduationCap, color: "bg-indigo-500" },
    { name: "Éducation Islamique", icon: Book, color: "bg-amber-600" },
    { name: "Informatique", icon: Laptop, color: "bg-violet-500" },
  ];

  const features = [
    "Cours téléchargeables en PDF",
    "Préparation au Brevet et au Bac",
    "Cours, exercices & quiz corrigés, fiches, flashcards ...",
  ];

  useEffect(() => {
    const scroll1 = scrollRef1.current;
    const scroll2 = scrollRef2.current;
    
    if (!scroll1 || !scroll2) return;

    let animationId: number;
    let position1 = 0;
    let position2 = -(scroll2.scrollWidth / 2);

    const animate = () => {
      position1 -= 0.5;
      position2 += 0.5;

      if (Math.abs(position1) >= scroll1.scrollWidth / 2) {
        position1 = 0;
      }
      if (position2 >= 0) {
        position2 = -(scroll2.scrollWidth / 2);
      }

      scroll1.style.transform = `translateX(${position1}px)`;
      scroll2.style.transform = `translateX(${position2}px)`;

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  const row1Subjects = subjects.slice(0, 6);
  const row2Subjects = subjects.slice(6);

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Toutes les matières de la 6ème à la Terminale
          </h2>
          
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* First Row - Scrolling Left */}
        <div className="relative mb-6 overflow-hidden">
          <div ref={scrollRef1} className="flex gap-4 will-change-transform">
            {[...row1Subjects, ...row1Subjects, ...row1Subjects, ...row1Subjects].map((subject, index) => {
              const Icon = subject.icon;
              return (
                <div
                  key={`${subject.name}-${index}`}
                  className="flex-shrink-0 w-auto bg-white rounded-xl shadow-md px-4 py-3 flex items-center gap-3 hover:shadow-lg transition-shadow"
                >
                  <div className={`w-10 h-10 ${subject.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-800 text-sm whitespace-nowrap">{subject.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Second Row - Scrolling Right */}
        <div className="relative overflow-hidden">
          <div ref={scrollRef2} className="flex gap-4 will-change-transform">
            {[...row2Subjects, ...row2Subjects, ...row2Subjects, ...row2Subjects].map((subject, index) => {
              const Icon = subject.icon;
              return (
                <div
                  key={`${subject.name}-${index}`}
                  className="flex-shrink-0 w-auto bg-white rounded-xl shadow-md px-4 py-3 flex items-center gap-3 hover:shadow-lg transition-shadow"
                >
                  <div className={`w-10 h-10 ${subject.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-800 text-sm whitespace-nowrap">{subject.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubjectsCarousel;
