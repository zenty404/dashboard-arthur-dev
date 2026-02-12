# Dashboard Arthur Dev

Dashboard tout-en-un pour freelances et petites entreprises. Centralisez vos outils de gestion quotidiens dans une seule interface moderne et rapide.

## Fonctionnalités

- **Link Tracker** — Raccourcisseur d'URL avec suivi des clics et statistiques
- **QR Generator** — Création de QR codes avec compteur de scans
- **Factures** — Génération de factures PDF professionnelles
- **Devis** — Génération de devis PDF avec conversion en facture en un clic
- **Gestion Clients** — Carnet de contacts avec pré-remplissage automatique des factures et devis
- **Moniteur de Sites** — Surveillance de la disponibilité de vos sites web avec historique

## Stack technique

- **Framework** : Next.js 16 (App Router) + React 19
- **Base de données** : Turso (libSQL) via Prisma 7
- **UI** : Tailwind CSS 4 + Shadcn UI
- **PDF** : @react-pdf/renderer (génération côté client)
- **Déploiement** : Vercel

## Démarrage rapide

```bash
# Installation
npm install

# Configuration
cp .env.example .env
# Renseigner les variables d'environnement (voir ci-dessous)

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) — la page `/setup` permet de créer le premier compte administrateur.

## Variables d'environnement

| Variable | Description |
|---|---|
| `DATABASE_URL` | Chemin SQLite local (ex: `file:./dev.db`) |
| `TURSO_DATABASE_URL` | URL de la base Turso |
| `TURSO_AUTH_TOKEN` | Token d'authentification Turso |
| `JWT_SECRET` | Secret pour la signature des JWT |
| `CRON_SECRET` | Token protégeant l'endpoint cron (production) |

## Scripts

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run lint     # Linting ESLint
```

## Licence

Propriétaire — Tous droits réservés.
