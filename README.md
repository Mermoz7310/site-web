# 221BelCode — Site officiel

Site vitrine premium de l'agence 221BelCode.
**Nous transformons vos idées en solutions digitales intelligentes.**

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (animations)
- **Lucide** (icônes) + icônes SVG maison
- **React Hook Form** + **Zod** (formulaire de contact)
- Polices auto-hébergées **Manrope** (titres) + **Inter** (texte) via `@fontsource`

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
npm start        # servir le build
```

## Structure

```
src/
  app/
    layout.tsx          # SEO, Open Graph, Schema.org, polices
    page.tsx            # assemblage des sections
    sitemap.ts          # sitemap.xml généré
    robots.ts           # robots.txt généré
    api/contact/route.ts# endpoint de contact (à brancher)
  components/
    sections/           # Hero, Services, Process, Projects, ...
    ui/                 # Button, Logo, SectionHeading, icônes
  data/site.ts          # TOUT le contenu éditable (services, projets, FAQ, témoignages)
  lib/motion.ts         # variantes d'animation partagées
```

## Modifier le contenu

Tout le contenu textuel est centralisé dans **`src/data/site.ts`** :
services, avantages, étapes du processus, projets, technologies,
témoignages et FAQ. Aucune modification de composant nécessaire.

### Activer un projet du portfolio

Dans `src/data/site.ts`, passez `available: true` et ajoutez `live: "https://..."`
sur le projet concerné. Le bouton « Voir le projet » s'active automatiquement.

## Brancher le formulaire de contact

1. Copiez `.env.example` en `.env.local` et renseignez UNE des options
   (Resend, Brevo ou Supabase).
2. Décommentez le bloc correspondant dans `src/app/api/contact/route.ts`.
3. Dans `src/components/sections/Contact.tsx`, remplacez le `setTimeout`
   de démonstration par un appel `fetch("/api/contact", ...)`.

## SEO

- Meta title/description, Open Graph et Twitter Card dans `layout.tsx`
- Données structurées Schema.org (Organization)
- `sitemap.xml` et `robots.txt` générés automatiquement
- Ajoutez une image `public/og-image.png` (1200×630) pour l'aperçu social

## Évolutions prévues

Le code est structuré pour accueillir facilement : mode multilingue
(FR/EN/NL via `next-intl`), espace Portfolio, Blog, espace Client,
prise de rendez-vous et chatbot IA.

## Déploiement

Optimisé pour **Vercel** : importez le dépôt, ajoutez les variables
d'environnement, déployez.
