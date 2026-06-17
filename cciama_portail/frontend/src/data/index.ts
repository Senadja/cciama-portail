import type { NewsItem, Service, QuickAction, Dossier, OfficialDocument, Organism, Project, FlashInfo } from '@/types';

export const NEWS: NewsItem[] = [
  { id: "n1", cat: "communique", catLabel: "Communiqué", date: "21 mai 2026", dateShort: "21 MAI", title: "Installation de l'Administrateur Provisoire de la CCIAMA", excerpt: "Suite à la décision des autorités, Monsieur Abderrahmane Gademi a été installé comme administrateur provisoire pour conduire une démarche concertée vers l'élection du nouvel exécutif.", author: "Direction de la Communication", readTime: "4 min de lecture" },
  { id: "n2", cat: "evenement", catLabel: "Événement", date: "19 mai 2026", dateShort: "19 MAI", title: "Forum d'Investissement Tchad-International", excerpt: "La CCIAMA a participé activement au forum pour présenter les opportunités d'affaires dans les secteurs de l'agro-industrie, des mines et de l'artisanat.", author: "Direction de la Promotion", readTime: "3 min de lecture" },
  { id: "n3", cat: "decret", catLabel: "Décret", date: "17 mai 2026", dateShort: "17 MAI", title: "Nouveau cadre pour les formalités des PME/PMI", excerpt: "Le gouvernement a publié un nouveau décret simplifiant les démarches de création d'entreprise. La CCIAMA accompagne les opérateurs dans cette transition.", author: "Secrétariat Général", readTime: "6 min de lecture" },
  { id: "n4", cat: "appel", catLabel: "Appel d'offres", date: "14 mai 2026", dateShort: "14 MAI", title: "Appel à manifestation d'intérêt — Projet Tchad Connexion 2030", excerpt: "Dans le cadre de la vision Tchad Connexion 2030, la CCIAMA lance un appel pour la sélection de partenaires techniques et financiers.", author: "Direction des Projets", readTime: "5 min de lecture" },
  { id: "n5", cat: "communique", catLabel: "Communiqué", date: "12 mai 2026", dateShort: "12 MAI", title: "Lancement du programme d'appui aux femmes entrepreneures", excerpt: "La CCIAMA déploie un nouveau fonds d'accompagnement spécifique pour les femmes évoluant dans les secteurs de la transformation agricole et de l'artisanat.", author: "Direction de la Formation", readTime: "3 min de lecture" },
  { id: "n6", cat: "evenement", catLabel: "Événement", date: "10 mai 2026", dateShort: "10 MAI", title: "Rencontre B2B : Secteur Privé et Investisseurs Étrangers", excerpt: "Une délégation d'investisseurs a été reçue par le bureau exécutif de la CCIAMA pour explorer des partenariats dans le secteur de l'élevage et de la pêche.", author: "Direction de la Promotion", readTime: "2 min de lecture" },
];

export const SERVICES: Service[] = [
  { n: "01", title: "Formalités des entreprises", desc: "Création, modification, et cessation d'entreprise. Immatriculation, orientation administrative et lien avec le Guichet Unique ANIE." },
  { n: "02", title: "Accompagnement PME/PMI", desc: "Conseils juridiques, fiscaux et administratifs. Appui spécifique aux femmes et jeunes entrepreneurs dans leurs démarches." },
  { n: "03", title: "Appui sectoriel", desc: "Accompagnement des filières stratégiques : agriculture, mines, artisanat, industrie et élevage/pêche pour accroître la compétitivité." },
  { n: "04", title: "Mise en relation B2B", desc: "Recherche de partenaires, accès aux opportunités d'investissement, aide à l'exportation et participation aux foires et salons." },
  { n: "05", title: "Formation professionnelle", desc: "Accès au Centre de Formation Professionnelle et de Perfectionnement (CFPP) et à l'École pratique d'agriculture." },
  { n: "06", title: "Information économique", desc: "Diffusion du bulletin d'information économique, de statistiques sectorielles et de notes de conjoncture sur le climat des affaires." },
];

export const QUICK: QuickAction[] = [
  { ic: "doc", title: "Devenir membre", desc: "Adhésion et renouvellement" },
  { ic: "form", title: "Effectuer une formalité", desc: "Création, modification, attestations" },
  { ic: "track", title: "Suivre un dossier", desc: "Vérifier l'état d'avancement" },
  { ic: "pay", title: "Paiements en ligne", desc: "Frais d'adhésion et services" },
  { ic: "appoint", title: "Consulter les opportunités", desc: "Appels d'offres et B2B" },
];

export const DOSSIERS: Record<string, Dossier> = {
  "TCD-2026-08421": {
    type: "Demande d'acte de naissance", ref: "TCD-2026-08421", deposit: "12 mai 2026", service: "Direction de l'État Civil", deadline: "26 mai 2026", status: "progress", statusLabel: "En cours de traitement",
    steps: [
      { state: "done", title: "Dépôt du dossier", desc: "Votre demande a été enregistrée auprès du guichet en ligne et un accusé de réception électronique vous a été transmis par courriel.", date: "12 mai 2026 — 09:14" },
      { state: "done", title: "Vérification des pièces", desc: "L'agent instructeur a contrôlé la conformité des pièces justificatives. Aucune pièce complémentaire n'est requise.", date: "13 mai 2026 — 14:32" },
      { state: "current", title: "Instruction par le service", desc: "Votre dossier est actuellement en cours d'examen par la Direction de l'État Civil. Vous serez notifié dès la fin de cette étape.", date: "En cours depuis le 14 mai" },
      { state: "pending", title: "Signature de l'autorité compétente", desc: "Validation et signature du document par le responsable habilité.", date: "Prévu le 22 mai 2026" },
      { state: "pending", title: "Mise à disposition", desc: "Votre document sera disponible au guichet ou par voie postale selon le mode de retrait choisi.", date: "Prévu le 26 mai 2026" },
    ],
  },
  "TCD-2026-07193": {
    type: "Permis de construire", ref: "TCD-2026-07193", deposit: "28 avril 2026", service: "Direction de l'Urbanisme", deadline: "15 juin 2026", status: "review", statusLabel: "Pièce complémentaire requise",
    steps: [
      { state: "done", title: "Dépôt du dossier", desc: "Dossier réceptionné au guichet de la mairie centrale.", date: "28 avril 2026 — 11:02" },
      { state: "done", title: "Vérification des pièces", desc: "Contrôle administratif effectué.", date: "30 avril 2026 — 09:45" },
      { state: "current", title: "Demande de complément", desc: "Un plan de situation actualisé à l'échelle 1/500 est requis. Merci de le déposer dans un délai de 15 jours.", date: "06 mai 2026 — 16:18" },
      { state: "pending", title: "Instruction technique", desc: "Examen par les services techniques compétents.", date: "À venir" },
      { state: "pending", title: "Décision finale", desc: "Notification de la décision au demandeur.", date: "Prévu le 15 juin 2026" },
    ],
  },
  "TCD-2026-09102": {
    type: "Attestation de résidence", ref: "TCD-2026-09102", deposit: "05 mai 2026", service: "Sous-Préfecture de N'Djamena Centre", deadline: "Délivré", status: "done", statusLabel: "Dossier finalisé",
    steps: [
      { state: "done", title: "Dépôt du dossier", desc: "Demande enregistrée.", date: "05 mai 2026 — 10:21" },
      { state: "done", title: "Vérification des pièces", desc: "Toutes les pièces conformes.", date: "05 mai 2026 — 15:04" },
      { state: "done", title: "Instruction", desc: "Attestation rédigée et soumise à signature.", date: "07 mai 2026 — 11:30" },
      { state: "done", title: "Signature", desc: "Document signé par l'autorité compétente.", date: "08 mai 2026 — 09:12" },
      { state: "done", title: "Mise à disposition", desc: "Document retiré par le demandeur le 09 mai 2026.", date: "09 mai 2026 — 14:48" },
    ],
  },
  "TCD-2026-06478": {
    type: "Demande d'autorisation de manifestation publique", ref: "TCD-2026-06478", deposit: "18 avril 2026", service: "Direction de la Sécurité Publique", deadline: "Rejeté le 02 mai 2026", status: "rejected", statusLabel: "Dossier rejeté",
    rejectionReason: "Dossier rejeté pour non-conformité du plan de sécurité présenté et défaut d'avis préalable de la mairie d'arrondissement, conformément au décret n°2024-0312 régissant les manifestations publiques.",
    steps: [
      { state: "done", title: "Dépôt du dossier", desc: "Demande enregistrée et accusé de réception transmis par voie électronique.", date: "18 avril 2026 — 11:34" },
      { state: "done", title: "Vérification des pièces", desc: "Pièces administratives vérifiées et déclarées recevables.", date: "20 avril 2026 — 09:18" },
      { state: "done", title: "Instruction technique", desc: "Examen par les services de sécurité publique en lien avec la préfecture.", date: "24 avril 2026 — 16:42" },
      { state: "rejected", title: "Décision : rejet motivé", desc: "La commission d'examen a émis un avis défavorable. Le demandeur dispose d'un délai de recours gracieux de 30 jours.", date: "02 mai 2026 — 14:00" },
    ],
  },
};

export const DOCUMENTS: OfficialDocument[] = [
  { id: "d1", type: "decret", typeLabel: "Décret", ref: "N°2026-0184/PR/PM", date: "17 mai 2026", title: "Décret portant organisation des services déconcentrés de l'État", summary: "Précise les missions et l'organisation des services déconcentrés aux niveaux provincial, départemental et communal.", pages: 24, size: "1.2 Mo" },
  { id: "d2", type: "loi", typeLabel: "Loi", ref: "N°012/PR/2026", date: "08 mai 2026", title: "Loi de finances rectificative pour l'exercice 2026", summary: "Modification du budget de l'État pour tenir compte des priorités de développement et des engagements internationaux.", pages: 86, size: "3.4 Mo" },
  { id: "d3", type: "arrete", typeLabel: "Arrêté", ref: "N°245/MAT/SG/2026", date: "02 mai 2026", title: "Arrêté fixant les modalités de délivrance de l'acte de naissance numérique", summary: "Procédure, pièces justificatives et délais applicables à la délivrance dématérialisée des actes d'état civil.", pages: 12, size: "640 ko" },
  { id: "d4", type: "rapport", typeLabel: "Rapport", ref: "RAP-2025-ANNUEL", date: "28 avril 2026", title: "Rapport annuel d'activités de l'administration — Exercice 2025", summary: "Bilan complet des actions menées, indicateurs de performance et perspectives pour l'année 2026.", pages: 142, size: "8.7 Mo" },
  { id: "d5", type: "circulaire", typeLabel: "Circulaire", ref: "N°018/PM/CAB/2026", date: "20 avril 2026", title: "Circulaire relative à la dématérialisation des marchés publics", summary: "Instructions adressées aux ordonnateurs et aux personnes responsables des marchés.", pages: 8, size: "420 ko" },
  { id: "d6", type: "decret", typeLabel: "Décret", ref: "N°2026-0142/PR/PM", date: "12 avril 2026", title: "Décret portant statut particulier du corps des inspecteurs du Trésor", summary: "Définition du statut, des grades, des rémunérations et des conditions d'avancement applicables au corps.", pages: 36, size: "1.8 Mo" },
  { id: "d7", type: "loi", typeLabel: "Loi", ref: "N°008/PR/2026", date: "04 avril 2026", title: "Loi d'orientation sur la transition énergétique nationale", summary: "Cadre stratégique et objectifs à l'horizon 2035 pour le mix énergétique de la République du Tchad.", pages: 58, size: "2.6 Mo" },
  { id: "d8", type: "rapport", typeLabel: "Rapport", ref: "RAP-2026-T1", date: "30 mars 2026", title: "Rapport trimestriel sur l'exécution budgétaire — T1 2026", summary: "État d'exécution des recettes et des dépenses au terme du premier trimestre.", pages: 64, size: "4.1 Mo" },
  { id: "d9", type: "arrete", typeLabel: "Arrêté", ref: "N°189/MEF/SG/2026", date: "22 mars 2026", title: "Arrêté portant nomenclature des pièces justificatives des dépenses publiques", summary: "Liste actualisée des pièces requises pour la liquidation et le paiement des dépenses de l'État.", pages: 28, size: "1.4 Mo" },
];

export const ORGANISMS: Organism[] = [
  { name: "Agence Nationale des Investissements et des Exportations", short: "ANIE", url: "#", color: "#C8961E", mark: "growth" },
  { name: "Centre de Formation Professionnelle", short: "CFPP", url: "#", color: "#0E2A5E", mark: "book" },
  { name: "École Pratique d'Agriculture", short: "EPA", url: "#", color: "#1F5C1F", mark: "grain" },
  { name: "Ministère du Commerce", short: "TUTELLE", url: "#", color: "#B81E2C", mark: "tower" },
];

export const PARTNERS: Organism[] = [
  { name: "Chambre Islamique de Commerce", short: "CICD", url: "#", color: "#1F5C1F", mark: "globe" },
  { name: "Fédération Mondiale des Chambres", short: "WCF", url: "#", color: "#1F5C8C", mark: "circle" },
  { name: "Chambres Consulaires Francophones", short: "CPCCAF", url: "#", color: "#0E2A5E", mark: "stars" },
  { name: "Fédération des Chambres d'Afrique Centrale", short: "FCCAC", url: "#", color: "#3A3A3A", mark: "scale" },
  { name: "Organisation Panafricaine", short: "PACCI", url: "#", color: "#7A5A0E", mark: "hands" },
];

export const PROJECTS: Project[] = [
  { id: "p1", status: "ongoing", statusLabel: "En cours", title: "Tchad Connexion 2030", period: "2024 — 2030", budget: "30 Mds USD", partner: "Partenaires Multiples", progress: 15, desc: "Vision stratégique : 268 projets et réformes pour la connexion physique, numérique, économique et internationale du pays." },
  { id: "p2", status: "ongoing", statusLabel: "En cours", title: "Dispositif d'appui aux femmes entrepreneures", period: "2025 — 2028", budget: "2,5 Mds FCFA", partner: "Banque Mondiale", progress: 42, desc: "Renforcement des capacités et accès au financement pour les PME dirigées par des femmes." },
  { id: "p3", status: "planned", statusLabel: "Programmé", title: "Modernisation des centres de formation", period: "2026 — 2029", budget: "4,2 Mds FCFA", partner: "CPCCAF", progress: 0, desc: "Réhabilitation et équipement du CFPP et de l'École pratique d'agriculture." },
  { id: "p4", status: "ongoing", statusLabel: "En cours", title: "Projet Régional de Facilité des Échanges", period: "2024 — 2027", budget: "8 Mds FCFA", partner: "CEMAC / UE", progress: 55, desc: "Amélioration des corridors commerciaux et simplification des procédures douanières pour le secteur privé." },
];

export const FLASH_INFOS: FlashInfo[] = [
  { severity: "danger", label: "Alerte", text: "Suspension temporaire des dépôts physiques au guichet central — Lundi 25 mai 2026 pour maintenance." },
  { severity: "warning", label: "Information importante", text: "Date limite de dépôt des candidatures à l'appel à manifestation d'intérêt : 30 juin 2026 à 16h00." },
  { severity: "success", label: "Bonne nouvelle", text: "Plus de 1,8 million de Tchadiens ont désormais activé leur identifiant numérique national." },
  { severity: "info", label: "Communiqué", text: "Le portail évolue : nouvelle version disponible avec assistance par intelligence artificielle." },
  { severity: "warning", label: "Rappel", text: "Pensez à mettre à jour vos coordonnées dans votre espace personnel avant le 1er juin 2026." },
];

export const NAV_ITEMS = [
  { id: 'home', label: 'Accueil', path: '/' },
  { id: 'institution', label: "La CCIAMA", children: [
    { id: 'institution-mot', label: "Mot de l'Administrateur Provisoire", path: '/institution/mot-du-ministre' },
    { id: 'institution-missions', label: "Missions et Attributions", path: '/institution/missions' },
    { id: 'institution-structure', label: "Structure Organisationnelle", path: '/institution/structure' },
    { id: 'institution-organismes', label: "Organismes et Structures sous tutelle", path: '/institution/organismes' },
    { id: 'institution-projets', label: "Projets et Programmes", path: '/institution/projets' },
  ]},
  { id: 'services', label: 'Services aux entreprises', path: '/services' },
  { id: 'actualites', label: 'Actualités & Événements', path: '/actualites' },
  { id: 'documentation', label: 'Documentation', path: '/documentation' },
  { id: 'contact', label: 'Contact', path: '/contact' },
];

export const LANGS = [
  { code: 'FR' as const, label: 'Français', flag: '🇫🇷' },
  { code: 'AR' as const, label: 'العربية', flag: '🇸🇦' },
  { code: 'EN' as const, label: 'English', flag: '🇬🇧' },
];
