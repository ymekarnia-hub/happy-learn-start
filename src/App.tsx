import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/config";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import MentionsLegales from "./pages/MentionsLegales";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

import Dashboard from "./pages/Dashboard";
import ListeCours from "./pages/ListeCours";
import Cours from "./pages/Cours";
import Revision from "./pages/Revision";
import Simulation from "./pages/Simulation";
import Account from "./pages/Account";
import Factures from "./pages/Factures";
import MesInformations from "./pages/MesInformations";
import UpdateSuccess from "./pages/UpdateSuccess";
import Abonnements from "./pages/Abonnements";
import Paiement from "./pages/Paiement";
import Parrainage from "./pages/Parrainage";
import DashboardEditorial from "./pages/editorial/DashboardEditorial";
import EditeurCours from "./pages/editorial/EditeurCours";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/editorial" element={<DashboardEditorial />} />
            <Route path="/editorial/cours/:id" element={<EditeurCours />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account" element={<Account />} />
            <Route path="/factures" element={<Factures />} />
            <Route path="/mes-informations" element={<MesInformations />} />
            <Route path="/update-success" element={<UpdateSuccess />} />
            <Route path="/abonnements" element={<Abonnements />} />
            <Route path="/paiement" element={<Paiement />} />
            <Route path="/parrainage" element={<Parrainage />} />
            <Route path="/liste-cours" element={<ListeCours />} />
            <Route path="/cours/:subjectId" element={<Cours />} />
            <Route path="/revision/:subjectId" element={<Revision />} />
            <Route path="/simulation/:subjectId" element={<Simulation />} />
            <Route path="/contact" element={<Contact />} />
            
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nextProvider>
  </QueryClientProvider>
);

export default App;
