import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Copy, Check, User as UserIcon, LogOut, GraduationCap, Users, Gift, TrendingUp, Mail, MessageCircle, Facebook, Twitter, Wallet, Clock, TrendingDown, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { ReferralShareDialog } from "@/components/ReferralShareDialog";

interface ReferralStats {
  code: string;
  active_referrals: number;
  current_discount_percentage: number;
}

interface Referral {
  id: string;
  referee_id: string;
  created_at: string;
  status: string;
  profiles?: {
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
  };
}

interface CreditDashboard {
  balance_euros: number;
  balance_percentage: number;
  last_updated: string;
  active_referrals_count: number;
  available_promo_codes: number;
  recent_transactions: any;
}

interface PromoCode {
  id: string;
  code: string;
  discount_euros: number;
  discount_percentage: number;
  used: boolean;
  created_at: string;
}

const Parrainage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [copied, setCopied] = useState(false);
  const [creditDashboard, setCreditDashboard] = useState<CreditDashboard | null>(null);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Récupérer le profil
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setProfile(profileData);

      // Récupérer les statistiques de parrainage
      const { data: statsData } = await supabase
        .from("referral_stats")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      setReferralStats(statsData);

      // Récupérer la liste des filleuls avec les informations des profils
      const { data: referralsData } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", session.user.id)
        .order("created_at", { ascending: false });

      // Récupérer les profils séparément
      if (referralsData && referralsData.length > 0) {
        const refereeIds = referralsData.map((r) => r.referee_id);
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, full_name, email")
          .in("id", refereeIds);

        const referralsWithProfiles = referralsData.map((referral) => ({
          ...referral,
          profiles: profilesData?.find((p) => p.id === referral.referee_id),
        }));

        setReferrals(referralsWithProfiles as any);
      } else {
        setReferrals([]);
      }

      // Récupérer le tableau de bord des crédits
      const { data: creditData } = await supabase
        .from("user_credit_dashboard")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      setCreditDashboard(creditData || {
        balance_euros: 0,
        balance_percentage: 0,
        last_updated: new Date().toISOString(),
        active_referrals_count: 0,
        available_promo_codes: 0,
        recent_transactions: []
      });

      // Récupérer les codes promo disponibles
      const { data: promoData } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("used", false)
        .order("created_at", { ascending: false });

      setPromoCodes(promoData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const referralUrl = referralStats?.code 
    ? `${window.location.origin}/auth?ref=${referralStats.code}`
    : "";

  const shareMessage = `Rejoins-moi sur AcadémiePlus de soutien scolaire ! Utilise mon code de parrainage : ${referralStats?.code} et nous recevrons tous les deux 5% de réduction ! ${referralUrl}`;

  const handleCopyCode = () => {
    if (referralStats?.code) {
      navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      toast({
        title: "Lien copié !",
        description: "Le lien de parrainage a été copié dans le presse-papier.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateNewLink = async () => {
    setGeneratingLink(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour générer un lien.",
          variant: "destructive",
        });
        return;
      }

      // Vérifier si le profil existe, sinon le créer
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!existingProfile) {
        // Créer le profil si nécessaire
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || session.user.email,
            first_name: session.user.user_metadata?.first_name,
            last_name: session.user.user_metadata?.last_name,
            role: session.user.user_metadata?.role || 'student',
            school_level: session.user.user_metadata?.school_level,
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
          throw new Error("Impossible de créer le profil utilisateur");
        }
      }

      // Générer un nouveau code de parrainage
      const { data: newCode, error } = await supabase.rpc('generate_referral_code');

      if (error) throw error;

      // Créer le nouveau code dans la table referral_codes
      const { error: insertError } = await supabase
        .from('referral_codes')
        .insert({
          user_id: session.user.id,
          code: newCode,
          is_active: true,
        });

      if (insertError) throw insertError;

      // Rafraîchir les données
      await fetchData();

      toast({
        title: "Nouveau lien créé !",
        description: "Votre nouveau lien de parrainage a été généré avec succès.",
      });

      // Ouvrir la popup de partage
      setShareDialogOpen(true);
    } catch (error: any) {
      console.error("Error generating link:", error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la génération du lien.",
        variant: "destructive",
      });
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleCopyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code promo copié !",
      description: "Le code promo a été copié dans le presse-papier.",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getSchoolLevelName = (level: string) => {
    const levels: { [key: string]: string } = {
      "1am": "1ère Année Moyenne",
      "2am": "2ème Année Moyenne",
      "3am": "3ème Année Moyenne",
      "4am": "4ème Année Moyenne",
      "1as": "1ère Année Secondaire",
      "2as": "2ème Année Secondaire",
      "3as": "3ème Année Secondaire",
    };
    return levels[level] || level;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/liste-cours")}>
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Savoir</span>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback>
                      <UserIcon className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{profile?.full_name || profile?.email}</p>
                    {profile?.school_level && (
                      <p className="text-xs text-gray-500">{getSchoolLevelName(profile.school_level)}</p>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/account")}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Gestion du compte
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Tableau de bord
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate("/account")} className="cursor-pointer">
                Retour à mon compte
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Programme de Parrainage</h1>
          <p className="text-lg text-gray-600">
            Parrainez vos amis et bénéficiez de réductions sur votre abonnement annuel !
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">Filleuls Actifs</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {referralStats?.active_referrals || 0}
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="h-8 w-8 text-green-600" />
              <h3 className="text-sm font-semibold text-gray-900">Solde Crédit</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {creditDashboard?.balance_euros.toFixed(2) || 0} DA
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="h-8 w-8 text-orange-600" />
              <h3 className="text-sm font-semibold text-gray-900">Codes Promo</h3>
            </div>
            <p className="text-3xl font-bold text-orange-600">
              {creditDashboard?.available_promo_codes || 0}
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <h3 className="text-sm font-semibold text-gray-900">Max Réduction</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">50%</p>
          </Card>
        </div>

        <Card className="p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Votre Lien de Parrainage</h2>
            <Button 
              onClick={handleGenerateNewLink}
              disabled={generatingLink}
              className="flex items-center gap-2"
            >
              <LinkIcon className="h-4 w-4" />
              {generatingLink ? "Génération..." : "Créer un nouveau lien"}
            </Button>
          </div>
          <p className="text-gray-600 mb-6">
            Partagez ce lien avec vos amis. Chaque fois qu'un ami s'inscrit avec votre lien,
            vous recevez tous les deux 5% de réduction sur votre prochain abonnement annuel (jusqu'à 50% maximum).
          </p>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="referral-link" className="sr-only">Lien de parrainage</Label>
              <Input
                id="referral-link"
                value={referralUrl}
                readOnly
                className="font-mono text-sm"
              />
            </div>
            <Button onClick={handleCopyCode} className="flex items-center gap-2">
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copier
                </>
              )}
            </Button>
            <Button 
              onClick={() => setShareDialogOpen(true)}
              variant="default"
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Partager
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">Comment ça marche ?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>5% de crédit</strong> par filleul basé sur son abonnement annuel</li>
              <li>• <strong>Maximum 10 filleuls</strong> par parrain</li>
              <li>• <strong>Code promo généré automatiquement</strong> après chaque paiement</li>
              <li>• Crédits <strong>sans limite de durée</strong></li>
              <li>• Utilisable comme <strong>moyen de paiement</strong> sur vos abonnements</li>
            </ul>
          </div>
        </Card>

        <ReferralShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          referralUrl={referralUrl}
          referralCode={referralStats?.code || ""}
        />

        {/* Codes Promo Section */}
        {promoCodes.length > 0 && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes Codes Promo Disponibles</h2>
            <div className="space-y-3">
              {promoCodes.map((promo) => (
                <div
                  key={promo.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                >
                  <div>
                    <p className="font-mono text-lg font-bold text-green-700">{promo.code}</p>
                    <p className="text-sm text-gray-600">
                      Valeur: {promo.discount_euros.toFixed(2)} DA ({promo.discount_percentage}%)
                    </p>
                  </div>
                  <Button
                    onClick={() => handleCopyPromoCode(promo.code)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copier
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              💡 Utilisez ces codes lors de votre prochain paiement pour bénéficier de votre réduction !
            </p>
          </Card>
        )}

        {/* Historique des Transactions */}
        {creditDashboard?.recent_transactions && creditDashboard.recent_transactions.length > 0 && (
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Historique des Crédits</h2>
            <div className="space-y-3">
              {creditDashboard.recent_transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    {transaction.transaction_type === "earned" ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : transaction.transaction_type === "used" ? (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        transaction.transaction_type === "earned" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.transaction_type === "earned" ? "+" : "-"}
                      {transaction.amount_euros.toFixed(2)} DA
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes Filleuls ({referrals.length})</h2>
          
          {referrals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Vous n'avez pas encore de filleuls.</p>
              <p className="text-sm mt-2">Partagez votre lien de parrainage pour commencer !</p>
            </div>
          ) : (
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        <UserIcon className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {referral.profiles?.first_name && referral.profiles?.last_name
                          ? `${referral.profiles.first_name} ${referral.profiles.last_name}`
                          : referral.profiles?.full_name || "Utilisateur"}
                      </p>
                      <p className="text-sm text-gray-500">{referral.profiles?.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        referral.status === "active"
                          ? "bg-green-100 text-green-800"
                          : referral.status === "cancelled"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {referral.status === "active" ? "Actif" : referral.status === "cancelled" ? "Annulé" : "Fraude"}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Depuis le {new Date(referral.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Parrainage;
