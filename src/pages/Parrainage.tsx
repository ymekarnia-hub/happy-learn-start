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
import { Copy, Check, User as UserIcon, LogOut, GraduationCap, Users, Gift, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    full_name: string;
    email: string;
  };
}

const Parrainage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [copied, setCopied] = useState(false);

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
          .select("id, full_name, email")
          .in("id", refereeIds);

        const referralsWithProfiles = referralsData.map((referral) => ({
          ...referral,
          profiles: profilesData?.find((p) => p.id === referral.referee_id),
        }));

        setReferrals(referralsWithProfiles as any);
      } else {
        setReferrals([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (referralStats?.code) {
      const referralLink = `${window.location.origin}/auth?ref=${referralStats.code}`;
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: "Lien copié !",
        description: "Le lien de parrainage a été copié dans le presse-papier.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
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

  const referralUrl = referralStats?.code 
    ? `${window.location.origin}/auth?ref=${referralStats.code}`
    : "";

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

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filleuls Actifs</h3>
            </div>
            <p className="text-4xl font-bold text-blue-600">
              {referralStats?.active_referrals || 0}
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Réduction Actuelle</h3>
            </div>
            <p className="text-4xl font-bold text-green-600">
              {referralStats?.current_discount_percentage || 0}%
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="h-8 w-8 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Réduction Maximum</h3>
            </div>
            <p className="text-4xl font-bold text-purple-600">50%</p>
          </Card>
        </div>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Votre Lien de Parrainage</h2>
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
          </div>

          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">Comment ça marche ?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>5% de réduction</strong> par filleul pour vous et votre filleul</li>
              <li>• <strong>Réduction maximale : 50%</strong> (10 filleuls actifs)</li>
              <li>• Applicable <strong>uniquement aux abonnements annuels</strong></li>
              <li>• Application automatique au prochain renouvellement</li>
              <li>• Réductions cumulables avec plusieurs filleuls</li>
            </ul>
          </div>
        </Card>

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
                        {referral.profiles?.full_name || "Utilisateur"}
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
