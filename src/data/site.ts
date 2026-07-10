import {
  Boxes,
  Globe,
  Building2,
  ClipboardList,
  GraduationCap,
  Sparkles,
  Workflow,
  BarChart3,
  Wrench,
  RefreshCw,
  Gauge,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const services: Service[] = [
  {
    icon: Boxes,
    title: "Développement SaaS",
    description:
      "Des plateformes multi-tenant robustes, sécurisées et prêtes à monter en charge, de l'architecture au déploiement.",
  },
  {
    icon: Globe,
    title: "Création de sites web",
    description:
      "Sites vitrines et e-commerce rapides, optimisés pour le référencement et pensés pour convertir.",
  },
  {
    icon: Building2,
    title: "Applications métiers",
    description:
      "Des outils sur mesure qui digitalisent vos processus internes et éliminent les tâches répétitives.",
  },
  {
    icon: ClipboardList,
    title: "Applications de gestion",
    description:
      "Facturation, inventaire, RH, comptabilité : centralisez votre activité dans une interface unique.",
  },
  {
    icon: GraduationCap,
    title: "Plateformes éducatives",
    description:
      "Espaces élèves, enseignants et administration avec notes, présences, bulletins et paiements.",
  },
  {
    icon: Sparkles,
    title: "Solutions IA",
    description:
      "Assistants, agents et automatisations intelligentes intégrés à vos données et vos flux de travail.",
  },
  {
    icon: Workflow,
    title: "Automatisation N8N",
    description:
      "Connectez vos outils et orchestrez des workflows fiables, du webhook à la notification.",
  },
  {
    icon: BarChart3,
    title: "Dashboards Power BI",
    description:
      "Transformez vos données brutes en tableaux de bord clairs pour décider plus vite.",
  },
  {
    icon: Wrench,
    title: "Maintenance",
    description:
      "Mises à jour, correctifs et supervision continue pour garder vos plateformes en pleine forme.",
  },
  {
    icon: RefreshCw,
    title: "Refonte de sites",
    description:
      "Modernisez un site vieillissant : nouvelle identité, meilleures performances, meilleure conversion.",
  },
  {
    icon: Gauge,
    title: "Optimisation des performances",
    description:
      "Temps de chargement, Core Web Vitals et scores Lighthouse : nous accélérons ce qui compte.",
  },
  {
    icon: Lightbulb,
    title: "Consulting",
    description:
      "Cadrage technique, choix d'architecture et accompagnement stratégique de votre projet digital.",
  },
];

export type Advantage = {
  title: string;
  description: string;
};

export const advantages: Advantage[] = [
  { title: "Architecture moderne", description: "Des fondations propres et évolutives, prêtes pour demain." },
  { title: "Sécurité", description: "RLS, chiffrement et bonnes pratiques appliqués par défaut." },
  { title: "Performance", description: "Des interfaces rapides, mesurées et optimisées en continu." },
  { title: "Design UX/UI", description: "Une expérience soignée qui inspire confiance dès le premier écran." },
  { title: "Accompagnement", description: "Un interlocuteur dédié, à chaque étape du projet." },
  { title: "Code maintenable", description: "Un code documenté et testé que vos équipes peuvent reprendre." },
  { title: "Déploiement Cloud", description: "Mise en production automatisée sur une infrastructure fiable." },
  { title: "Support", description: "Une équipe réactive après la livraison, pas seulement avant." },
];

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  { number: "01", title: "Analyse", description: "Nous cernons vos objectifs, vos utilisateurs et vos contraintes." },
  { number: "02", title: "Cahier des charges", description: "Nous formalisons le périmètre, les priorités et le planning." },
  { number: "03", title: "Design UX/UI", description: "Nous concevons des maquettes claires et validées ensemble." },
  { number: "04", title: "Développement", description: "Nous construisons par itérations, avec des livrables réguliers." },
  { number: "05", title: "Tests", description: "Nous validons la qualité, la sécurité et la performance." },
  { number: "06", title: "Déploiement", description: "Nous mettons en production et vous formons à l'outil." },
  { number: "07", title: "Maintenance", description: "Nous assurons le suivi, les évolutions et le support." },
];

export type Project = {
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  accent: string;
  live?: string;
  available: boolean;
  /** Optionnel : capture dans public/projects/{slug}.png. Sinon, dégradé. */
  image?: string;
};

export const projects: Project[] = [
  {
    slug: "educonnect",
    image: "/projects/educonnect.png",
    title: "EduConnect",
    description:
      "Plateforme de gestion scolaire complète : espaces élèves, enseignants et administration unifiée.",
    technologies: ["Flutter", "Django", "PostgreSQL"],
    accent: "from-blue-500/20 to-cyan-500/10",
    available: false,
  },
  {
    slug: "samaschool",
    image: "/projects/samaschool.png",
    title: "SamaSchool",
    description:
      "SaaS multi-établissements avec bulletins PDF, QR anti-fraude et rôles finement gérés.",
    technologies: ["Next.js", "Supabase", "React PDF"],
    accent: "from-cyan-500/20 to-blue-500/10",
    available: false,
  },
  {
    slug: "facturepilote",
    image: "/projects/facturepilote.png",
    title: "FacturePilote",
    description:
      "Facturation en ligne avec numérotation automatique, paiements intégrés et suivi des règlements.",
    technologies: ["Next.js", "Supabase", "Stripe"],
    accent: "from-violet-500/20 to-blue-500/10",
    available: false,
  },
  {
    slug: "carehome-pro",
    image: "/projects/carehome-pro.png",
    title: "CareHome Pro",
    description:
      "Solution pour maisons de repos en Belgique et aux Pays-Bas, bilingue et centrée sur la conformité.",
    technologies: ["Next.js", "Supabase", "next-intl"],
    accent: "from-blue-500/20 to-violet-500/10",
    available: false,
  },
  {
    slug: "immoteranga",
    image: "/projects/immoteranga.png",
    title: "ImmoTeranga",
    description:
      "SaaS immobilier pour le marché sénégalais avec agences vitrines et activation à la demande.",
    technologies: ["Next.js", "Supabase", "Cloudflare"],
    accent: "from-cyan-500/20 to-violet-500/10",
    available: false,
  },
  {
    slug: "qr-inventaire",
    image: "/projects/qr-inventaire.png",
    title: "Plateforme QR Inventaire",
    description:
      "Gestion d'actifs avec étiquettes QR, campagnes d'inventaire par caméra et rapports PDF.",
    technologies: ["Next.js", "Supabase", "html5-qrcode"],
    accent: "from-blue-500/20 to-cyan-500/10",
    available: false,
  },
];

export type Tech = { name: string };

export const technologies: Tech[] = [
  { name: "Next.js" }, { name: "React" }, { name: "Flutter" }, { name: "Supabase" },
  { name: "PostgreSQL" }, { name: "TypeScript" }, { name: "Tailwind" }, { name: "Node.js" },
  { name: "N8N" }, { name: "Docker" }, { name: "Power BI" }, { name: "GitHub" },
  { name: "Vercel" }, { name: "Cloudflare" }, { name: "OpenAI" }, { name: "Claude" },
  { name: "Stripe" },
];

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Ils ont compris notre métier avant même d'écrire une ligne de code. La plateforme livrée dépasse ce qu'on imaginait.",
    author: "Awa Diallo",
    role: "Directrice",
    company: "Groupe Scolaire Teranga",
  },
  {
    quote:
      "Un accompagnement clair, des livraisons régulières et un vrai souci du détail. Exactement ce qu'on cherchait.",
    author: "Marc Lefèvre",
    role: "Fondateur",
    company: "Atlas Immobilier",
  },
  {
    quote:
      "L'automatisation mise en place nous fait gagner plusieurs heures par jour. Un investissement rentabilisé en un mois.",
    author: "Fatou Sarr",
    role: "Responsable opérations",
    company: "Lumière Retail",
  },
  {
    quote:
      "Le tableau de bord Power BI a transformé nos réunions. On décide enfin sur des chiffres, pas des impressions.",
    author: "Thomas Willems",
    role: "CFO",
    company: "Verviers Logistics",
  },
];

export type Faq = { question: string; answer: string };

export const faqs: Faq[] = [
  {
    question: "Combien coûte un projet ?",
    answer:
      "Chaque projet est unique. Le budget dépend du périmètre, des fonctionnalités et du niveau d'intégration. Après un premier échange, nous vous remettons un devis détaillé et transparent, sans engagement.",
  },
  {
    question: "Combien de temps faut-il ?",
    answer:
      "Un site vitrine peut être livré en quelques semaines, une plateforme SaaS complète en quelques mois. Nous travaillons par itérations pour vous livrer de la valeur rapidement et régulièrement.",
  },
  {
    question: "Comment fonctionne la maintenance ?",
    answer:
      "Nous proposons des forfaits de maintenance couvrant les mises à jour, les correctifs, la supervision et le support. Vous gardez une plateforme fiable et sécurisée dans la durée.",
  },
  {
    question: "Puis-je demander des évolutions ?",
    answer:
      "Absolument. Nos solutions sont conçues pour évoluer. De nouvelles fonctionnalités peuvent être ajoutées à tout moment, en fonction de vos priorités.",
  },
  {
    question: "Travaillez-vous à distance ?",
    answer:
      "Oui. Nous collaborons avec des clients en Belgique, au Sénégal, aux Pays-Bas et ailleurs, avec des points d'avancement réguliers et une communication fluide.",
  },
];

export const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Pourquoi nous", href: "#pourquoi" },
  { label: "Processus", href: "#processus" },
  { label: "Réalisations", href: "#realisations" },
  { label: "FAQ", href: "#faq" },
];
