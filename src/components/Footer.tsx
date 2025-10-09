import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">AcadémiePlus</span>
            </div>
            <p className="text-gray-400 text-sm">
              La plateforme de cours en ligne qui accompagne les élèves algériens vers la réussite scolaire.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#accueil" className="text-gray-400 hover:text-white transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                  Formules
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/mentions-legales" className="text-gray-400 hover:text-white transition-colors">
                  Mentions légales
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Matières</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Mathématiques</li>
              <li>Physique</li>
              <li>Sciences Naturelles</li>
              <li>Français</li>
              <li>Arabe</li>
              <li>Anglais</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-gray-400">
                <Phone className="h-4 w-4 mt-1 flex-shrink-0" />
                <a href="tel:023210000" className="hover:text-white transition-colors">
                  023 21 00 00
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <Mail className="h-4 w-4 mt-1 flex-shrink-0" />
                <a href="mailto:contact@academieplus.dz" className="hover:text-white transition-colors">
                  contact@academieplus.dz
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>Alger, Algérie</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} AcadémiePlus. Tous droits réservés.</p>
          <p className="mt-2">
            Conforme aux programmes officiels de l'éducation nationale algérienne 🇩🇿
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
