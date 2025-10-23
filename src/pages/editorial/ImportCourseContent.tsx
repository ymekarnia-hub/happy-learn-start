import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";

export default function ImportCourseContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string[]>([]);

  const histGeoContent = [
    {
      chapter_number: 1,
      chapter_title: "La Méditerranée antique : les empreintes grecques et romaines",
      content: `Ce chapitre explore les fondements de la civilisation méditerranéenne antique.

**Les cités grecques (VIIIe - IVe siècle av. J.-C.)**
- Naissance de la démocratie à Athènes (Ve siècle av. J.-C.)
- L'Ecclésia : assemblée des citoyens
- Le rôle des stratèges et de Périclès
- Les limites : citoyenneté réservée (femmes, esclaves, métèques exclus)

**L'empire romain**
- Extension territoriale autour de la Méditerranée (Mare Nostrum)
- Organisation administrative: provinces, légions, routes
- La romanisation: diffusion de la langue latine, du droit romain
- Les aqueducs, thermes, amphithéâtres comme symboles de civilisation

**Héritage culturel**
- Philosophie grecque (Socrate, Platon, Aristote)
- Architecture: colonnes doriques, ioniques, corinthiennes
- Droit romain: base des systèmes juridiques européens
- Mythologie et religion polythéiste

**Concepts clés**: citoyenneté, démocratie, république, empire, romanisation`
    },
    {
      chapter_number: 2,
      chapter_title: "La Méditerranée médiévale : espace d'échanges et de conflits",
      content: `La Méditerranée médiévale est un espace de rencontre entre trois civilisations.

**Trois civilisations en contact**
- Chrétienté occidentale (Europe catholique)
- Chrétienté orientale (Empire byzantin, orthodoxe)
- Monde musulman (expansion arabe VIIe-VIIIe siècle)

**Les échanges commerciaux**
- Routes maritimes reliant l'Orient et l'Occident
- Venise et Gênes: grandes puissances maritimes
- Commerce des épices, soieries, métaux précieux
- Fondouks: comptoirs commerciaux

**Les conflits**
- Croisades (1095-1291): expéditions militaires chrétiennes
- Reconquista en Espagne (722-1492)
- Chute de Constantinople (1453)

**Transferts culturels**
- Traduction d'œuvres grecques par les Arabes
- Sciences arabes: astronomie, mathématiques (algèbre), médecine
- Architecture: mosquées, églises romanes et gothiques
- Tolérance andalouse: coexistence des trois religions

**Concepts clés**: croisades, reconquista, échanges, méditerranée médiévale`
    },
    {
      chapter_number: 3,
      chapter_title: "L'ouverture atlantique : les conséquences de la découverte du Nouveau Monde",
      content: `Les Grandes Découvertes transforment le monde au XVe-XVIe siècle.

**Les motivations des explorations**
- Recherche de nouvelles routes vers les Indes
- Soif d'or et d'épices
- Volonté d'évangélisation
- Progrès techniques: caravelle, boussole, astrolabe

**Les grandes expéditions**
- 1492: Christophe Colomb atteint les Amériques
- 1498: Vasco de Gama atteint l'Inde par le Cap
- 1519-1522: Tour du monde de Magellan
- Conquête du Mexique (Cortés) et du Pérou (Pizarro)

**Conséquences pour l'Europe**
- Déplacement du centre économique: Méditerranée → Atlantique
- Afflux de métaux précieux (or, argent)
- Enrichissement de l'Espagne et du Portugal
- Naissance du commerce triangulaire

**Impact sur les Amériques**
- Effondrement démographique des populations autochtones
- Maladies européennes (variole, grippe)
- Destruction des civilisations précolombiennes (Aztèques, Incas)
- Mise en place de l'esclavage et de l'économie de plantation

**Échanges colombiens**
- D'Amérique vers Europe: maïs, pomme de terre, tomate, cacao
- D'Europe vers Amérique: blé, cheval, bœuf

**Concepts clés**: grandes découvertes, conquêtes, échanges colombiens, commerce triangulaire`
    },
    {
      chapter_number: 4,
      chapter_title: "Renaissance, Humanisme et réformes religieuses",
      content: `La Renaissance marque un renouveau culturel et intellectuel en Europe (XVe-XVIe siècle).

**L'Humanisme**
- Mouvement intellectuel plaçant l'Homme au centre
- Retour aux textes antiques (grec, latin)
- Érasme: "Prince des humanistes"
- Valorisation de l'éducation et de la raison

**Les arts de la Renaissance**
- Italie: berceau de la Renaissance (Florence, Rome, Venise)
- Mécénat des Médicis
- Léonard de Vinci: génie universel (peinture, anatomie, ingénierie)
- Michel-Ange: chapelle Sixtine
- Perspective et réalisme dans la peinture

**Diffusion des savoirs**
- Invention de l'imprimerie par Gutenberg (1450)
- Bible de Gutenberg (1455)
- Multiplication des livres et diffusion des idées
- Développement de l'alphabétisation

**Sciences et découvertes**
- Copernic: théorie héliocentrique (Terre tourne autour du Soleil)
- Anatomie: Vésale
- Astronomie: Galilée

**Concepts clés**: Renaissance, humanisme, mécénat, imprimerie, héliocentrisme`
    },
    {
      chapter_number: 5,
      chapter_title: "Réformes et conflits religieux",
      content: `Les Réformes religieuses bouleversent la chrétienté au XVIe siècle.

**La Réforme protestante**
- 1517: Luther affiche ses 95 thèses à Wittenberg
- Critiques: vente des indulgences, richesse de l'Église
- Principes: salut par la foi seule, autorité de la Bible
- Excommunication de Luther (1521)

**Diffusion du protestantisme**
- Calvin à Genève: doctrine de la prédestination
- Anglicanisme en Angleterre (Henri VIII)
- Division de l'Europe entre catholiques et protestants

**La Contre-Réforme catholique**
- Concile de Trente (1545-1563)
- Réaffirmation des dogmes catholiques
- Création de la Compagnie de Jésus (Jésuites) par Ignace de Loyola
- Renforcement de l'Inquisition

**Les guerres de religion en France**
- Massacre de la Saint-Barthélemy (1572)
- Guerre entre catholiques et protestants (huguenots)
- Édit de Nantes (1598): tolérance religieuse par Henri IV

**Conséquences**
- Fragmentation religieuse de l'Europe
- Renforcement du pouvoir des princes
- Guerres dévastatrices (Guerre de Trente Ans 1618-1648)

**Concepts clés**: Réforme, protestantisme, Luther, Calvin, Contre-Réforme, guerres de religion`
    },
    {
      chapter_number: 6,
      chapter_title: "Affirmation de l'État dans le royaume de France",
      content: `Le XVIIe siècle voit l'affirmation de la monarchie absolue en France.

**Le règne de Louis XIV (1643-1715)**
- "L'État, c'est moi": incarnation du pouvoir absolu
- Installation à Versailles (1682)
- Versailles: symbole de la puissance royale
- Révocation de l'Édit de Nantes (1685): fin de la tolérance religieuse

**Les fondements de l'absolutisme**
- Théorie du droit divin: roi tient son pouvoir de Dieu
- Concentration des pouvoirs: législatif, exécutif, judiciaire
- Affaiblissement de la noblesse et des parlements
- Administration centralisée: intendants dans les provinces

**Économie et société**
- Colbertisme: politique économique de Colbert
- Développement des manufactures royales
- Mercantilisme: accumulation de métaux précieux
- Grands travaux: canal du Midi, fortifications de Vauban

**Culture et rayonnement**
- Classicisme: art au service du roi
- Molière, Racine, Corneille: théâtre classique
- Académie française, Académie des sciences
- Versailles: modèle pour les cours européennes

**Les limites de l'absolutisme**
- Guerres coûteuses et défaites
- Misère du peuple et famines
- Contestations (Fronde 1648-1653)
- Dette de l'État

**Concepts clés**: monarchie absolue, Versailles, droit divin, mercantilisme, classicisme`
    },
    {
      chapter_number: 7,
      chapter_title: "Lumières et révolutions",
      content: `Le XVIIIe siècle est le siècle des Lumières et des révolutions.

**Les Lumières**
- Mouvement intellectuel remettant en cause l'ordre établi
- Philosophes: Voltaire, Rousseau, Montesquieu, Diderot
- Critique de l'absolutisme et de l'Église
- Défense de la liberté, de l'égalité, de la tolérance

**L'Encyclopédie (1751-1772)**
- Diderot et d'Alembert
- Rassembler et diffuser les connaissances
- Censure et interdiction par l'Église

**Les idées politiques**
- Montesquieu: séparation des pouvoirs (L'Esprit des lois, 1748)
- Rousseau: souveraineté du peuple (Du contrat social, 1762)
- Voltaire: liberté d'expression, tolérance religieuse

**Diffusion des idées**
- Salons littéraires tenus par des femmes cultivées
- Cafés: lieux de débats
- Correspondances entre philosophes
- Voyages et échanges internationaux

**Influence sur les révolutions**
- Révolution américaine (1776): Déclaration d'Indépendance
- Révolution française (1789): fin de la monarchie absolue
- Déclaration des droits de l'homme et du citoyen (1789)

**Concepts clés**: Lumières, philosophes, Encyclopédie, séparation des pouvoirs, souveraineté populaire`
    },
    {
      chapter_number: 8,
      chapter_title: "Sociétés et environnements : des équilibres fragiles",
      content: `Les sociétés humaines entretiennent des relations complexes avec leur environnement.

**Risques naturels**
- Séismes, volcans, tsunamis, cyclones
- Zones à risques: ceinture de feu du Pacifique, Caraïbes
- Vulnérabilité différente selon le niveau de développement
- Prévention et gestion des risques

**Ressources naturelles**
- Eau douce: ressource vitale inégalement répartie
- Stress hydrique: pénurie d'eau dans certaines régions
- Énergies fossiles: pétrole, gaz, charbon
- Énergies renouvelables: solaire, éolien, hydraulique

**Changement climatique**
- Réchauffement global dû aux émissions de CO2
- Conséquences: fonte des glaciers, montée des eaux
- Événements extrêmes plus fréquents
- Accord de Paris (2015): limiter le réchauffement

**Défis environnementaux**
- Déforestation: Amazonie, Afrique centrale
- Pollution: air, eau, sols
- Perte de biodiversité
- Développement durable: concilier économie, social, environnement

**Concepts clés**: risques naturels, ressources, développement durable, changement climatique`
    },
    {
      chapter_number: 9,
      chapter_title: "Territoires, populations et développement",
      content: `La population mondiale et sa répartition évoluent rapidement.

**Croissance démographique**
- 8 milliards d'habitants en 2022
- Transition démographique: passage de forts taux à faibles taux
- Pays du Sud: forte croissance
- Pays du Nord: vieillissement, faible natalité

**Inégalités de développement**
- IDH (Indice de développement humain): santé, éducation, niveau de vie
- Pays développés (Nord): IDH élevé
- Pays en développement (Sud): IDH plus faible
- Inégalités au sein des pays (urbain/rural, régions)

**Urbanisation**
- Plus de 50% de la population mondiale vit en ville
- Mégapoles: villes de plus de 10 millions d'habitants
- Bidonvilles dans les pays du Sud
- Étalement urbain et problèmes environnementaux

**Défis démographiques**
- Vieillissement au Nord: poids des retraites, santé
- Jeunesse au Sud: éducation, emploi
- Migrations: fuite des cerveaux, réfugiés climatiques

**Concepts clés**: croissance démographique, IDH, urbanisation, transition démographique`
    },
    {
      chapter_number: 10,
      chapter_title: "Des mobilités généralisées",
      content: `Les mobilités humaines se multiplient et se diversifient.

**Types de mobilités**
- Migrations définitives: changement de pays de résidence
- Mobilités temporaires: tourisme, études, travail
- Mobilités forcées: réfugiés, déplacés

**Migrations internationales**
- 280 millions de migrants internationaux
- Principaux flux: Sud → Nord, Sud → Sud
- Causes: économiques, politiques, environnementales
- Remises migratoires: argent envoyé au pays d'origine

**Tourisme**
- 1,4 milliard de touristes internationaux (2018)
- Tourisme de masse: Méditerranée, Asie du Sud-Est
- Impacts: économiques (revenus), environnementaux (pollution), culturels
- Tourisme durable: limiter les impacts négatifs

**Mobilités étudiantes**
- Programmes d'échanges: Erasmus en Europe
- Attraction des universités anglophones
- Fuite des cerveaux: départ des diplômés vers pays développés

**Frontières et contrôles**
- Renforcement des contrôles migratoires
- Murs et barrières: États-Unis/Mexique, Europe/Afrique
- Accueil des réfugiés: débats et tensions

**Concepts clés**: migrations, tourisme, mobilités, remises migratoires, frontières`
    },
    {
      chapter_number: 11,
      chapter_title: "L'Afrique australe : un espace en profonde mutation",
      content: `L'Afrique australe connaît des transformations majeures depuis la fin de l'apartheid.

**L'Afrique du Sud**
- Fin de l'apartheid (1991-1994)
- Nelson Mandela: premier président noir (1994)
- Transition démocratique
- Puissance économique régionale

**Économie**
- Première économie d'Afrique
- Ressources minières: or, diamants, platine
- Industrie et services développés
- Membre des BRICS (avec Brésil, Russie, Inde, Chine)

**Inégalités persistantes**
- Héritage de l'apartheid
- Townships: quartiers pauvres
- Chômage élevé, criminalité
- Inégalités raciales encore présentes

**Défis sanitaires**
- VIH/SIDA: épidémie majeure
- Espérance de vie affectée
- Accès aux soins inégal

**Intégration régionale**
- SADC: Communauté de développement d'Afrique australe
- Coopération économique entre pays
- Rivalités avec d'autres puissances africaines (Nigeria, Égypte)

**Concepts clés**: Afrique australe, apartheid, BRICS, inégalités, développement`
    },
    {
      chapter_number: 12,
      chapter_title: "Dynamiques territoriales, coopérations et tensions dans la mondialisation",
      content: `La mondialisation transforme les territoires et les relations internationales.

**Mondialisation économique**
- Flux de marchandises, capitaux, informations
- Firmes transnationales (FTN): production mondialisée
- Délocalisation vers pays à bas coûts
- Centres financiers: New York, Londres, Tokyo

**Acteurs de la mondialisation**
- États: régulation et politique économique
- FTN: production et commerce
- OMC: régule le commerce mondial
- FMI, Banque mondiale: financement et développement
- ONG: défense de causes (environnement, droits humains)

**Hiérarchie urbaine mondiale**
- Villes mondiales: concentration du pouvoir économique
- Métropoles: pôles de commandement
- Mégapoles: très grandes villes
- Réseau de villes connectées

**Tensions et conflits**
- Protectionnisme vs libre-échange
- Guerre commerciale (États-Unis/Chine)
- Paradis fiscaux et évasion fiscale
- Altermondialisme: critique de la mondialisation libérale

**Coopérations régionales**
- Union européenne
- ALENA/USMCA en Amérique du Nord
- ASEAN en Asie du Sud-Est
- Mercosur en Amérique du Sud

**Concepts clés**: mondialisation, FTN, métropoles, libre-échange, coopération régionale`
    },
    {
      chapter_number: 13,
      chapter_title: "Les espaces ruraux : multifonctionnalité ou fragmentation ?",
      content: `Les espaces ruraux se transforment et se diversifient.

**Évolution des fonctions**
- Agriculture traditionnelle en déclin dans les pays développés
- Nouvelles fonctions: résidentielle, récréative, environnementale
- Périurbanisation: extension des villes vers espaces ruraux
- Rurbanisation: espaces entre ville et campagne

**Agriculture dans les pays développés**
- Agriculture productiviste: mécanisation, chimie, rendements élevés
- Remembrement: regroupement des parcelles
- Agriculture biologique: sans pesticides ni engrais chimiques
- Circuits courts: vente directe producteur/consommateur

**Agriculture dans les pays en développement**
- Agriculture vivrière: pour nourrir la famille
- Révolution verte: introduction de nouvelles variétés, engrais
- Accaparement des terres par multinationales
- Insécurité alimentaire persistante

**Enjeux environnementaux**
- Érosion des sols
- Pollution par pesticides et engrais
- Déforestation pour l'agriculture
- Protection de la biodiversité: parcs naturels

**Attractivité des espaces ruraux**
- Recherche de qualité de vie
- Télétravail: possibilité de vivre à la campagne
- Tourisme rural: gîtes, fermes auberges
- Désertification de certaines zones rurales

**Concepts clés**: espaces ruraux, multifonctionnalité, périurbanisation, agriculture productiviste, circuits courts`
    }
  ];

  const importContent = async () => {
    setIsImporting(true);
    setImportStatus([]);

    try {
      // Vérifier si du contenu existe déjà
      const { data: existing } = await supabase
        .from('course_content_chunks')
        .select('id')
        .eq('subject', 'histoire-geographie')
        .limit(1);

      if (existing && existing.length > 0) {
        // Supprimer l'ancien contenu
        setImportStatus(prev => [...prev, "Suppression de l'ancien contenu..."]);
        const { error: deleteError } = await supabase
          .from('course_content_chunks')
          .delete()
          .eq('subject', 'histoire-geographie');

        if (deleteError) throw deleteError;
        setImportStatus(prev => [...prev, "✓ Ancien contenu supprimé"]);
      }

      // Insérer le nouveau contenu
      setImportStatus(prev => [...prev, "Importation du nouveau contenu..."]);
      
      for (const chapter of histGeoContent) {
        const { error } = await supabase
          .from('course_content_chunks')
          .insert({
            subject: 'histoire-geographie',
            chapter_number: chapter.chapter_number,
            chapter_title: chapter.chapter_title,
            content: chapter.content
          });

        if (error) {
          console.error(`Erreur chapitre ${chapter.chapter_number}:`, error);
          throw error;
        }

        setImportStatus(prev => [...prev, `✓ Chapitre ${chapter.chapter_number}: ${chapter.chapter_title}`]);
      }

      setImportStatus(prev => [...prev, "\n✅ Import terminé avec succès !"]);
      
      toast({
        title: "Import réussi",
        description: `${histGeoContent.length} chapitres importés avec succès`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'import",
        variant: "destructive",
      });
      setImportStatus(prev => [...prev, "\n❌ Erreur lors de l'import"]);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard-editorial')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-6 w-6" />
              Import du contenu Histoire-Géographie
            </CardTitle>
            <CardDescription>
              Importer le contenu détaillé des 13 chapitres du programme de Seconde
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Contenu à importer :
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• 7 chapitres d'Histoire</li>
                <li>• 6 chapitres de Géographie</li>
                <li>• Contenu détaillé avec concepts clés</li>
              </ul>
            </div>

            <Button
              onClick={importContent}
              disabled={isImporting}
              className="w-full"
              size="lg"
            >
              {isImporting ? (
                "Import en cours..."
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Importer le contenu
                </>
              )}
            </Button>

            {importStatus.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Statut de l'import
                </h3>
                {importStatus.map((status, index) => (
                  <div key={index} className="text-sm font-mono">
                    {status}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}