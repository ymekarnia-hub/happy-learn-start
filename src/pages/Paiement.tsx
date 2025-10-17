import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CreditCard, Ticket, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface PaymentInfo {
  planId: string;
  planName: string;
  price: number;
  isFamily: boolean;
  billingPeriod: string;
}

const Paiement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const paymentInfo = location.state as PaymentInfo;
  const [paymentMethod, setPaymentMethod] = useState("card");

  if (!paymentInfo) {
    navigate("/abonnements");
    return null;
  }

  const calculateEndDate = () => {
    const today = new Date();
    const endDate = new Date(today);
    
    if (paymentInfo.billingPeriod === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 10);
    }
    
    return endDate.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const totalAmount = paymentInfo.billingPeriod === 'monthly' 
    ? paymentInfo.price 
    : paymentInfo.price * 10;

  const generateVirementReference = () => {
    return `REF-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => navigate("/abonnements")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour aux formules
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Premier bloc - Informations et méthodes de paiement */}
            <Card className="p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Formule sélectionnée
                </h1>
                <p className="text-2xl font-semibold text-blue-600">
                  {paymentInfo.planName}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Mode de paiement
                </h2>

                <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="card">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Carte
                    </TabsTrigger>
                    <TabsTrigger value="code">
                      <Ticket className="h-4 w-4 mr-2" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger value="virement">
                      <Building2 className="h-4 w-4 mr-2" />
                      Virement
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Numéro de carte</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Date d'expiration</Label>
                        <Input id="expiry" placeholder="MM/AA" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Nom sur la carte</Label>
                      <Input id="cardName" placeholder="Nom complet" />
                    </div>
                    <Button className="w-full mt-4">
                      Payer {totalAmount.toLocaleString('fr-DZ')} DA
                    </Button>
                  </TabsContent>

                  <TabsContent value="code" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="prepaidCode">Code prépayé</Label>
                      <Input id="prepaidCode" placeholder="Entrez votre code prépayé" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Entrez le code prépayé que vous avez acheté pour activer votre abonnement.
                    </p>
                    <Button className="w-full mt-4">
                      Valider le code
                    </Button>
                  </TabsContent>

                  <TabsContent value="virement" className="space-y-4 mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Référence de virement</p>
                        <p className="text-lg font-bold text-blue-600">{generateVirementReference()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Coordonnées bancaires</p>
                        <div className="mt-2 space-y-1 text-sm text-gray-800">
                          <p><span className="font-medium">Banque:</span> Banque Nationale d'Algérie</p>
                          <p><span className="font-medium">Titulaire:</span> ACADEMIE EXCELLENCE</p>
                          <p><span className="font-medium">RIB:</span> 0000 0000 0000 0000 0000 00</p>
                          <p><span className="font-medium">Montant:</span> {totalAmount.toLocaleString('fr-DZ')} DA</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-3">
                        Veuillez inclure la référence de virement dans le libellé de votre virement.
                        Votre abonnement sera activé après réception du paiement.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>

            {/* Deuxième bloc - Récapitulatif du tarif */}
            <Card className="p-8 h-fit sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Tarif</h2>
                <p className="text-3xl font-bold text-gray-900">
                  {totalAmount.toLocaleString('fr-DZ')} DA
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Paiement :
                  </h3>
                  <p className="text-gray-700">
                    Paiement immédiat de{" "}
                    <span className="font-semibold">
                      {totalAmount.toLocaleString('fr-DZ')} DA
                    </span>
                    {paymentInfo.billingPeriod === 'monthly' ? (
                      <span> pour 1 mois d'abonnement</span>
                    ) : (
                      <span> pour 10 mois d'abonnement (année scolaire complète)</span>
                    )}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span>{" "}
                    {paymentInfo.isFamily ? "Formule Famille" : "Formule 1 enfant"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Durée:</span>{" "}
                    {paymentInfo.billingPeriod === 'monthly' ? "1 mois" : "10 mois (année scolaire)"}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Date de fin d'activation du compte :
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {calculateEndDate()}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Ce qui est inclus :</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ Accès à tous les cours et matières</li>
                  <li>✓ Exercices illimités</li>
                  <li>✓ Vidéos pédagogiques</li>
                  <li>✓ Suivi de progression</li>
                  {paymentInfo.planName.includes("Intensive") && (
                    <>
                      <li>✓ Cours en direct</li>
                      <li>✓ Correction personnalisée</li>
                      <li>✓ Support prioritaire</li>
                    </>
                  )}
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Paiement;
