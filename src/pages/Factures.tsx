import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
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

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
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
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => navigate("/account")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour vers mon compte
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-6xl mx-auto">
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
