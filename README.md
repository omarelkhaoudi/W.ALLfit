# W.ALLfit - Application de Fitness

Application moderne de suivi d'entraînements avec séparation frontend/backend.

## 📁 Structure du Projet

```
wallfit/
├── frontend/          # Application Next.js (Frontend)
├── backend/           # API Express (Backend)
└── package.json       # Scripts pour gérer les deux projets
```

## 🚀 Démarrage Rapide

### Option 1 : Utiliser les scripts du monorepo

```bash
# Installer toutes les dépendances
npm run install:all

# Lancer les deux serveurs en même temps
npm run dev
```

### Option 2 : Lancer séparément

#### Backend (port 5000)
```bash
cd backend
npm install
npm run dev
```

#### Frontend (port 3000)
```bash
cd frontend
npm install
npm run dev
```

## 📋 Migration depuis l'ancienne structure

Si vous avez déjà le code dans `src/`, utilisez le script de migration :

```powershell
# PowerShell
.\migrate.ps1
```

Ou manuellement :
```powershell
Copy-Item -Path "src\*" -Destination "frontend\src\" -Recurse -Force
Copy-Item -Path "public\*" -Destination "frontend\public\" -Recurse -Force
```

## ⚙️ Configuration

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 📚 Documentation

- [Guide de Migration](MIGRATION_GUIDE.md) - Guide détaillé pour migrer
- [Structure Séparée](README_SEPARATION.md) - Documentation de l'architecture
- [Configuration Google OAuth](GOOGLE_AUTH_SETUP.md) - Setup Google Sign-In

## 🛠️ Technologies

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth (client-side)

### Backend
- Express.js
- TypeScript
- Supabase (server-side)
- CORS
- Rate Limiting

## 📦 Déploiement

### Backend
Déployez le dossier `backend/` sur :
- Vercel
- Railway
- Render
- Heroku

### Frontend
Déployez le dossier `frontend/` sur :
- Vercel (recommandé)
- Netlify

N'oubliez pas de configurer les variables d'environnement sur chaque plateforme !

## 🔐 Sécurité

- Le backend utilise `SUPABASE_SERVICE_ROLE_KEY` pour les opérations admin
- Le frontend utilise uniquement `NEXT_PUBLIC_SUPABASE_ANON_KEY` pour l'authentification
- Toutes les requêtes API sont authentifiées via Bearer token
- Rate limiting activé sur le backend

## 📝 Scripts Disponibles

- `npm run dev` - Lance frontend et backend en parallèle
- `npm run dev:backend` - Lance uniquement le backend
- `npm run dev:frontend` - Lance uniquement le frontend
- `npm run build` - Build les deux projets
- `npm run install:all` - Installe les dépendances des deux projets

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence ISC.
