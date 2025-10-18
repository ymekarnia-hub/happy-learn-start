import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CreditCard, Ticket, Building2, GraduationCap, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  school_level: string | null;
  avatar_url: string | null;
}

interface PaymentInfo {
  planId: string;
  planName: string;
  price: number;
  isFamily: boolean;
  billingPeriod: string;
  monthsCount: number;
}

const Paiement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const paymentInfo = location.state as PaymentInfo;
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [monthsCount, setMonthsCount] = useState(paymentInfo?.monthsCount || 1);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      fetchProfile(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      fetchProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, school_level, avatar_url")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSchoolLevelName = (level: string) => {
    const levels = {
      cp: 'CP', ce1: 'CE1', ce2: 'CE2', cm1: 'CM1', cm2: 'CM2',
      sixieme: '6ème', cinquieme: '5ème', quatrieme: '4ème', troisieme: '3ème',
      seconde: 'Seconde', premiere: 'Première', terminale: 'Terminale'
    };
    return levels[level as keyof typeof levels] || 'Votre classe';
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!paymentInfo) {
    navigate("/abonnements");
    return null;
  }

  const calculateEndDate = () => {
    const today = new Date();
    const endDate = new Date(today);
    
    endDate.setMonth(endDate.getMonth() + monthsCount);
    
    return endDate.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const totalAmount = paymentInfo.price * monthsCount;
  const finalAmount = totalAmount - discount;

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "promo") {
      const discountAmount = totalAmount * 0.1; // 10% de réduction
      setDiscount(discountAmount);
      setPromoApplied(true);
      toast({
        title: "Code promo appliqué !",
        description: `Vous bénéficiez de 10% de réduction (${discountAmount.toLocaleString('fr-DZ')} DA)`,
      });
    } else {
      toast({
        title: "Code promo invalide",
        description: "Le code promo n'est pas valide.",
        variant: "destructive",
      });
    }
  };

  const generateVirementReference = () => {
    return `REF-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header - Same as ListeCours */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={() => navigate("/liste-cours")}
            >
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">AcadémiePlus</span>
            </div>

            {/* Right Side: User Menu */}
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer hover:bg-accent/10 rounded-lg p-2 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback>
                        {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <p className="text-sm font-medium">{profile?.full_name || 'Utilisateur'}</p>
                      <p className="text-xs text-muted-foreground">
                        {profile?.school_level && getSchoolLevelName(profile.school_level)}
                      </p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/account")}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Gérer mon compte</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <span>Tableau de bord</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate("/abonnements")} className="cursor-pointer flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Retour aux formules
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

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

              {/* Sélecteur de mois pour formule mensuelle */}
              {paymentInfo.billingPeriod === 'monthly' && (
                <div className="mb-6 bg-blue-50 p-4 rounded-lg">
                  <Label htmlFor="months-select" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Nombre de mois
                  </Label>
                  <Select value={monthsCount.toString()} onValueChange={(value) => setMonthsCount(parseInt(value))}>
                    <SelectTrigger id="months-select" className="w-full bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {month} {month === 1 ? 'mois' : 'mois'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600 mt-2">
                    Prix mensuel: {paymentInfo.price.toLocaleString('fr-DZ')} DA × {monthsCount} = {totalAmount.toLocaleString('fr-DZ')} DA
                  </p>
                </div>
              )}

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
                    {/* Code Promo */}
                    <div className="space-y-2 bg-blue-50 p-4 rounded-lg">
                      <Label htmlFor="promo-code" className="text-sm font-semibold">Code promo</Label>
                      <div className="flex gap-2">
                        <Input
                          id="promo-code"
                          placeholder="Entrez votre code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          disabled={promoApplied}
                        />
                        <Button
                          onClick={applyPromoCode}
                          disabled={promoApplied || !promoCode}
                          variant="outline"
                          type="button"
                        >
                          {promoApplied ? "Appliqué" : "Appliquer"}
                        </Button>
                      </div>
                      {promoApplied && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ Code promo appliqué: -10% ({discount.toLocaleString('fr-DZ')} DA)
                        </p>
                      )}
                    </div>

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
                    <Button 
                      className="w-full mt-4"
                      onClick={() => {
                        toast({
                          title: "Paiement réussi !",
                          description: "Votre abonnement a été activé avec succès.",
                        });
                        setTimeout(() => navigate("/liste-cours"), 1500);
                      }}
                    >
                      Payer {finalAmount.toLocaleString('fr-DZ')} DA
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
                    <Button 
                      className="w-full mt-4"
                      onClick={() => {
                        toast({
                          title: "Code validé !",
                          description: "Votre abonnement a été activé avec succès.",
                        });
                        setTimeout(() => navigate("/liste-cours"), 1500);
                      }}
                    >
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
                <div className="text-right">
                  {promoApplied && (
                    <p className="text-lg text-gray-500 line-through">
                      {totalAmount.toLocaleString('fr-DZ')} DA
                    </p>
                  )}
                  <p className="text-3xl font-bold text-gray-900">
                    {finalAmount.toLocaleString('fr-DZ')} DA
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Paiement :
                  </h3>
                  <p className="text-gray-700">
                    Paiement immédiat de{" "}
                    <span className="font-semibold">
                      {finalAmount.toLocaleString('fr-DZ')} DA
                    </span>
                    <span> pour {monthsCount} mois d'abonnement</span>
                  </p>
                  {promoApplied && (
                    <p className="text-sm text-green-600 mt-2">
                      Réduction de {discount.toLocaleString('fr-DZ')} DA appliquée
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Type:</span>{" "}
                    {paymentInfo.isFamily ? "Formule Famille" : "Formule 1 enfant"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Durée:</span>{" "}
                    {monthsCount} mois
                  </p>
                  {paymentInfo.billingPeriod === 'monthly' && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Prix mensuel:</span>{" "}
                      {paymentInfo.price.toLocaleString('fr-DZ')} DA
                    </p>
                  )}
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
