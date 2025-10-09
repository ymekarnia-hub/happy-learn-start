import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Comment fonctionne la plateforme de cours en ligne ?",
      answer:
        "Notre plateforme vous donne accès 24h/24 et 7j/7 à des cours vidéo de qualité, des exercices interactifs avec correction automatique, et un suivi personnalisé de votre progression. Vous pouvez apprendre à votre rythme depuis n'importe quel appareil.",
    },
    {
      question: "Quelles matières sont disponibles ?",
      answer:
        "Nous couvrons toutes les matières principales : Mathématiques, Physique, Sciences Naturelles, Français, Arabe, Anglais, Histoire-Géographie, et plus encore. Les contenus suivent strictement les programmes officiels de l'éducation nationale algérienne.",
    },
    {
      question: "Puis-je essayer gratuitement avant de m'abonner ?",
      answer:
        "Oui ! Nous offrons un essai gratuit de 7 jours pour que vous puissiez explorer la plateforme, accéder aux cours et exercices, et voir si notre méthode vous convient avant de vous engager.",
    },
    {
      question: "Comment puis-je suivre ma progression ?",
      answer:
        "Chaque élève dispose d'un tableau de bord personnel qui affiche sa progression dans chaque matière, ses scores aux exercices, le temps passé sur la plateforme, et des recommandations personnalisées pour améliorer ses points faibles.",
    },
    {
      question: "Y a-t-il un support en cas de questions ?",
      answer:
        "Absolument ! Notre équipe pédagogique est disponible par email et chat pour répondre à toutes vos questions. Les abonnés Premium et Intensif bénéficient également d'un support prioritaire et de sessions de tutorat en direct.",
    },
    {
      question: "Les cours sont-ils conformes au programme algérien ?",
      answer:
        "Oui, tous nos contenus sont créés en stricte conformité avec les programmes officiels du ministère de l'Éducation nationale algérien. Nos cours sont élaborés par des enseignants certifiés et expérimentés.",
    },
    {
      question: "Puis-je changer de formule à tout moment ?",
      answer:
        "Oui, vous pouvez passer à une formule supérieure ou inférieure à tout moment. Le changement prendra effet immédiatement et sera pris en compte sur votre prochaine facturation.",
    },
    {
      question: "Comment fonctionne le crédit d'impôt ?",
      answer:
        "En tant que service de soutien scolaire, nos cours ouvrent droit à un crédit d'impôt de 50% du montant payé. Nous vous fournissons automatiquement une attestation fiscale à la fin de l'année pour bénéficier de cet avantage.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur nos cours en ligne
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-200 rounded-lg px-6 bg-gray-50"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
