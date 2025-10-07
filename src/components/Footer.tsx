import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Contact</h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a href="tel:0123456789" className="hover:text-primary transition-colors">
                  01 23 45 67 89
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:contact@edusuccess.fr" className="hover:text-primary transition-colors">
                  contact@edusuccess.fr
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Paris, France</span>
              </div>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Liens rapides</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Formulaire de contact
                </Link>
              </li>
              <li>
                <a href="#benefits" className="hover:text-primary transition-colors">
                  Nos services
                </a>
              </li>
              <li>
                <a href="#results" className="hover:text-primary transition-colors">
                  Résultats
                </a>
              </li>
            </ul>
          </div>

          {/* Télécharger l'app */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Télécharger l'app</h3>
            <div className="space-y-3">
              <a 
                href="#" 
                className="flex items-center gap-3 p-3 bg-card border rounded-lg hover:shadow-md transition-all group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">iOS</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Télécharger sur</p>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">App Store</p>
                </div>
              </a>
              <a 
                href="#" 
                className="flex items-center gap-3 p-3 bg-card border rounded-lg hover:shadow-md transition-all group"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AND</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Disponible sur</p>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Google Play</p>
                </div>
              </a>
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Suivez-nous</h3>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-card border rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-card border rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-card border rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:scale-110"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 EduSuccess. Tous droits réservés.</p>
            <div className="flex gap-6">
              <Link to="/mentions-legales" className="hover:text-primary transition-colors">
                Mentions légales
              </Link>
              <a href="#" className="hover:text-primary transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                CGU
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
