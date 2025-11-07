# Structure Frontend/Backend Séparée

## 📁 Structure du Projet

```
wallfit/
├── frontend/              # Application Next.js (Frontend)
│   ├── src/
│   │   ├── app/          # Pages et routes Next.js
│   │   ├── components/   # Composants React
│   │   ├── hooks/        # Hooks personnalisés
│   │   ├── lib/          # Client API
│   │   ├── contexts/     # Contextes React
│   │   ├── types/        # Types TypeScript
│   │   └── utils/        # Utilitaires
│   ├── public/           # Assets statiques
│   └── package.json
│
├── backend/              # API Express (Backend)
│   ├── src/
│   │   ├── routes/      # Routes API
│   │   ├── middleware/  # Middleware (auth, etc.)
│   │   ├── config/      # Configuration
│   │   └── index.ts     # Point d'entrée
│   └── package.json
│
└── README.md
```

## 🚀 Démarrage Rapide

### 1. Installation

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configuration

Créez les fichiers `.env` dans chaque dossier (voir `.env.example`)

### 3. Lancement

```bash
# Terminal 1 - Backend (port 5000)
cd backend
npm run dev

# Terminal 2 - Frontend (port 3000)
cd frontend
npm run dev
```

## 🔧 API Backend

### Endpoints disponibles

- `GET /api/workouts` - Liste des entraînements
- `POST /api/workouts` - Créer un entraînement
- `PUT /api/workouts/:id` - Mettre à jour un entraînement
- `DELETE /api/workouts/:id` - Supprimer un entraînement

- `GET /api/profile` - Récupérer le profil et stats
- `PUT /api/profile` - Mettre à jour le profil
- `DELETE /api/profile` - Supprimer le profil

- `GET /api/auth/me` - Récupérer l'utilisateur actuel

### Authentification

Toutes les routes (sauf `/health`) nécessitent un token Bearer dans le header :
```
Authorization: Bearer <token>
```

Le token est récupéré automatiquement depuis Supabase par le client API.

## 📦 Déploiement

### Backend
- Port : 5000 (développement)
- Variables d'environnement requises : `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### Frontend
- Port : 3000 (développement)
- Variables d'environnement requises : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`

## 🔐 Sécurité

- Le backend utilise `SUPABASE_SERVICE_ROLE_KEY` pour les opérations admin
- Le frontend utilise uniquement `NEXT_PUBLIC_SUPABASE_ANON_KEY` pour l'authentification
- Toutes les requêtes API sont authentifiées via Bearer token
- Rate limiting activé sur le backend (100 requêtes / 15 min)

