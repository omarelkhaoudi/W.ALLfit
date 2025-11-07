# Guide de Migration - Séparation Frontend/Backend

Ce guide explique comment migrer votre projet vers une architecture séparée frontend/backend.

## Structure du Projet

```
wallfit/
├── frontend/          # Application Next.js
│   ├── src/
│   │   ├── app/       # Pages Next.js
│   │   ├── components/ # Composants React
│   │   ├── hooks/     # Hooks personnalisés (utilisent l'API)
│   │   └── lib/       # Client API
│   └── package.json
│
├── backend/           # API Express
│   ├── src/
│   │   ├── routes/    # Routes API
│   │   ├── middleware/ # Middleware (auth, etc.)
│   │   └── config/    # Configuration Supabase
│   └── package.json
│
└── package.json       # Package.json root (optionnel)
```

## Étapes de Migration

### 1. Copier les fichiers frontend

Copiez tous les fichiers de `src/` vers `frontend/src/` :

```powershell
# PowerShell
Copy-Item -Path "src\*" -Destination "frontend\src\" -Recurse -Force
Copy-Item -Path "public\*" -Destination "frontend\public\" -Recurse -Force
```

### 2. Installer les dépendances

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configuration des variables d'environnement

#### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:3000
```

#### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Démarrer les serveurs

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

## Changements Principaux

### Hooks mis à jour

Les hooks `useWorkouts` et `useProfile` utilisent maintenant le client API au lieu d'appeler Supabase directement.

### Authentification

L'authentification reste gérée par Supabase côté frontend, mais les données sont récupérées via l'API backend.

### Client API

Le client API (`frontend/src/lib/apiClient.ts`) gère automatiquement :
- L'ajout du token d'authentification
- La gestion des erreurs
- Les requêtes HTTP vers le backend

## Déploiement

### Backend
- **Vercel** : Déployez le dossier `backend/`
- **Railway/Render** : Configurez le dossier `backend/` comme racine
- **Heroku** : Utilisez `backend/` comme racine du projet

### Frontend
- **Vercel** : Déployez le dossier `frontend/`
- **Netlify** : Configurez `frontend/` comme répertoire de build

### Variables d'environnement

N'oubliez pas de configurer les variables d'environnement sur vos plateformes de déploiement !

## Notes

- Le backend utilise `SUPABASE_SERVICE_ROLE_KEY` pour les opérations admin
- Le frontend utilise `NEXT_PUBLIC_SUPABASE_ANON_KEY` uniquement pour l'authentification
- Toutes les données passent maintenant par l'API backend

