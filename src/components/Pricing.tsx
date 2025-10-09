import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useTranslation } from "react-i18next";

const Pricing = () => {
  const { t } = useTranslation();
  
  const plans = [
    {
      name: t("pricing.discovery.name"),
      price: t("pricing.discovery.price"),
      period: t("pricing.discovery.period"),
      description: t("pricing.discovery.description"),
      features: [
        t("pricing.discovery.features.subjects"),
        t("pricing.discovery.features.exercises"),
        t("pricing.discovery.features.tracking"),
        t("pricing.discovery.features.support"),
      ],
      highlighted: false,
    },
    {
      name: t("pricing.regular.name"),
      price: t("pricing.regular.price"),
      period: t("pricing.regular.period"),
      description: t("pricing.regular.description"),
      features: [
        t("pricing.regular.features.allSubjects"),
        t("pricing.regular.features.exercises"),
        t("pricing.regular.features.videos"),
        t("pricing.regular.features.tracking"),
        t("pricing.regular.features.priority"),
        t("pricing.regular.features.exams"),
      ],
      highlighted: true,
    },
    {
      name: t("pricing.intensive.name"),
      price: t("pricing.intensive.price"),
      period: t("pricing.intensive.period"),
      description: t("pricing.intensive.description"),
      features: [
        t("pricing.intensive.features.everything"),
        t("pricing.intensive.features.liveCourses"),
        t("pricing.intensive.features.correction"),
        t("pricing.intensive.features.revision"),
        t("pricing.intensive.features.unlimited"),
        t("pricing.intensive.features.guarantee"),
      ],
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("pricing.title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("pricing.subtitle")}
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
                    {t("pricing.popular")}
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
                {t("pricing.choose")} {plan.name}
              </Button>
            </Card>
          ))}
        </div>

        <p className="text-center text-gray-600 mt-8">
          {t("pricing.taxCredit")}
        </p>
      </div>
    </section>
  );
};

export default Pricing;
