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
  amount_ht: number;
  tva_percentage: number;
  tva_amount: number;
  amount_ttc: number;
  status: string;
  subscription_id: string | null;
  subscriptions?: {
    subscription_plans?: {
      type: string;
      name: string;
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
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

      if (error) throw error;
      setProfile(data);
      
      // Récupérer les factures de l'utilisateur
      await fetchInvoices(userId);
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
      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          subscriptions (
            subscription_plans (
              type,
              name
            )
          )
        `)
        .eq("user_id", userId)
        .order("issue_date", { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les factures",
        variant: "destructive",
      });
    }
  };

  const generatePDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    
    const subscriptionType = invoice.subscriptions?.subscription_plans?.type || 'N/A';
    const subscriptionName = invoice.subscriptions?.subscription_plans?.name || 'Abonnement';

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
    doc.text(`${subscriptionName} (${subscriptionType})`, 20, 135);
    doc.text(`${invoice.amount_ht.toFixed(2)} DA`, 150, 135, { align: "right" });

    // Ligne de séparation
    doc.line(20, 140, 190, 140);

    // Sous-total HT
    doc.text("Montant HT:", 120, 150);
    doc.text(`${invoice.amount_ht.toFixed(2)} DA`, 150, 150, { align: "right" });

    // TVA
    doc.text(`TVA (${invoice.tva_percentage}%):`, 120, 157);
    doc.text(`${invoice.tva_amount.toFixed(2)} DA`, 150, 157, { align: "right" });

    // Ligne de séparation
    doc.line(120, 162, 190, 162);

    // Total TTC
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Total TTC:", 120, 170);
    doc.text(`${invoice.amount_ttc.toFixed(2)} DA`, 150, 170, { align: "right" });

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

          <div className="bg-card rounded-lg shadow-sm border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type d'abonnement</TableHead>
                  <TableHead className="text-right">Montant HT (DA)</TableHead>
                  <TableHead className="text-right">TVA</TableHead>
                  <TableHead className="text-right">Total TTC (DA)</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      Aucune facture disponible
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => {
                    const subscriptionType = invoice.subscriptions?.subscription_plans?.type || 'N/A';
                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                        <TableCell>{new Date(invoice.issue_date).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell className="capitalize">{subscriptionType}</TableCell>
                        <TableCell className="text-right">{invoice.amount_ht.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{invoice.tva_amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-semibold">{invoice.amount_ttc.toFixed(2)}</TableCell>
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
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Factures;
