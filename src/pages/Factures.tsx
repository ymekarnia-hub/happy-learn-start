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
  date: string;
  subscription_type: "Mensuel" | "Annuel";
  amount_ht: number;
  invoice_number: string;
}

const Factures = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Données mockées pour les factures - À remplacer par des vraies données de Supabase
  const [invoices] = useState<Invoice[]>([
    {
      id: "1",
      date: "2024-01-15",
      subscription_type: "Mensuel",
      amount_ht: 4166.67,
      invoice_number: "FAC-2024-001",
    },
    {
      id: "2",
      date: "2023-12-15",
      subscription_type: "Mensuel",
      amount_ht: 4166.67,
      invoice_number: "FAC-2023-012",
    },
    {
      id: "3",
      date: "2023-11-15",
      subscription_type: "Annuel",
      amount_ht: 41666.67,
      invoice_number: "FAC-2023-011",
    },
  ]);

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

  const generatePDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    const tva = invoice.amount_ht * 0.2;
    const total_ttc = invoice.amount_ht + tva;

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
    doc.text(`Date: ${new Date(invoice.date).toLocaleDateString("fr-FR")}`, 20, 72);

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
    doc.text(`Abonnement ${invoice.subscription_type}`, 20, 135);
    doc.text(`${invoice.amount_ht.toFixed(2)} DA`, 150, 135, { align: "right" });

    // Ligne de séparation
    doc.line(20, 140, 190, 140);

    // Sous-total HT
    doc.text("Montant HT:", 120, 150);
    doc.text(`${invoice.amount_ht.toFixed(2)} DA`, 150, 150, { align: "right" });

    // TVA
    doc.text("TVA (20%):", 120, 157);
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

          <div className="bg-card rounded-lg shadow-sm border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type d'abonnement</TableHead>
                  <TableHead className="text-right">Montant HT (DA)</TableHead>
                  <TableHead className="text-right">TVA (20%)</TableHead>
                  <TableHead className="text-right">Total TTC (DA)</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => {
                  const tva = invoice.amount_ht * 0.2;
                  const total_ttc = invoice.amount_ht + tva;
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      <TableCell>{new Date(invoice.date).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>{invoice.subscription_type}</TableCell>
                      <TableCell className="text-right">{invoice.amount_ht.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{tva.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-semibold">{total_ttc.toFixed(2)}</TableCell>
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
        </div>
      </main>
    </div>
  );
};

export default Factures;
