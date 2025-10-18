import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, GraduationCap, LogOut, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import jsPDF from "jspdf";
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
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  school_level: string | null;
  avatar_url: string | null;
}

interface Invoice {
  id: string;
  invoice_number: string;
  issue_date: string;
  subscription_id: string | null;
  amount_ht: number;
  tva_percentage: number;
  tva_amount: number;
  amount_ttc: number;
  status: "paid" | "pending" | "overdue" | "cancelled";
  subscription?: {
    plan: {
      name: string;
      billing_period: string;
    };
  };
}

const Factures = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchProfile(session.user.id);
      fetchInvoices(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchProfile(session.user.id);
      fetchInvoices(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("id, full_name, email, school_level, avatar_url").eq("id", userId).single();

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

  const fetchInvoices = async (userId: string) => {
    try {
      console.log("Fetching invoices for user:", userId);
      
      const { data, error } = await supabase
        .from("invoices")
        .select(
          `
          *,
          subscription:subscriptions(
            plan:subscription_plans(name, billing_period)
          )
        `
        )
        .eq("user_id", userId)
        .order("issue_date", { ascending: false });

      console.log("Invoices query result:", { data, error });

      if (error) {
        console.error("Error fetching invoices:", error);
        throw error;
      }
      
      console.log("Setting invoices:", data);
      setInvoices((data || []) as Invoice[]);
    } catch (error: any) {
      console.error("Catch error:", error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const generatePDF = (invoice: Invoice) => {
    const doc = new jsPDF();

    // Utiliser les valeurs déjà calculées de la base de données
    const tva = invoice.tva_amount;
    const total_ttc = invoice.amount_ttc;

    // En-tête de la facture
    doc.setFontSize(20);
    doc.text("FACTURE", 105, 20, { align: "center" });

    // Informations de l'entreprise
    doc.setFontSize(10);
    doc.text("Votre Société", 20, 40);
    doc.text("9 chemin doudou mokhtar ben aknoun", 20, 45);
    doc.text("Alger, Algérie", 20, 50);

    // Numéro de facture et date
    doc.setFontSize(12);
    doc.text(`Facture N°: ${invoice.invoice_number}`, 20, 65);
    doc.text(`Date: ${new Date(invoice.issue_date).toLocaleDateString("fr-FR")}`, 20, 72);

    // Informations du bénéficiaire
    doc.setFontSize(10);
    doc.text("Bénéficiaire:", 20, 85);
    doc.text(profile?.full_name || "Nom non disponible", 20, 90);
    doc.text(profile?.email || "", 20, 95);

    // Tableau des détails
    doc.setFontSize(12);
    doc.text("Détails de la facturation", 20, 110);

    // Ligne de séparation
    doc.line(20, 115, 190, 115);

    // En-têtes du tableau
    doc.setFontSize(10);
    doc.text("Description", 20, 125);
    doc.text("Montant", 150, 125, { align: "right" });

    // Détails
    const subscriptionType = invoice.subscription?.plan?.name || "Standard";
    doc.text(`Abonnement ${subscriptionType}`, 20, 135);
    doc.text(`${invoice.amount_ht.toFixed(2)} DA`, 150, 135, { align: "right" });

    // Ligne de séparation
    doc.line(20, 140, 190, 140);

    // Sous-total HT
    doc.text("Montant HT:", 120, 150);
    doc.text(`${invoice.amount_ht.toFixed(2)} DA`, 150, 150, { align: "right" });

    // TVA
    doc.text(`TVA (${invoice.tva_percentage}%):`, 120, 157);
    doc.text(`${tva.toFixed(2)} DA`, 150, 157, { align: "right" });

    // Ligne de séparation
    doc.line(120, 162, 190, 162);

    // Total TTC
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Total TTC:", 120, 170);
    doc.text(`${total_ttc.toFixed(2)} DA`, 150, 170, { align: "right" });

    // Pied de page
    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.text("Merci pour votre confiance", 105, 280, { align: "center" });

    // Téléchargement du PDF
    doc.save(`Facture-${invoice.invoice_number}.pdf`);

    toast({
      title: "Facture téléchargée",
      description: `La facture ${invoice.invoice_number} a été téléchargée avec succès.`,
    });
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

      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate("/account")} className="cursor-pointer flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Retour vers Gérer mon compte
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-4xl font-bold mb-8">Mes Factures</h1>

          {invoices.length === 0 ? (
            <div className="bg-card rounded-lg shadow-sm border p-8 text-center">
              <p className="text-muted-foreground">Aucune facture pour le moment.</p>
            </div>
          ) : (
            <div className="bg-card rounded-lg shadow-sm border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type d'abonnement</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => {
                    const subscriptionType = invoice.subscription?.plan?.name || "Standard";
                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                        <TableCell>{new Date(invoice.issue_date).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell className="capitalize">{subscriptionType}</TableCell>
                        <TableCell className="text-right font-semibold">{Number(invoice.amount_ttc).toFixed(2)} DA</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => generatePDF(invoice)}
                            title="Télécharger la facture"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Factures;
