# W.ALLfit - Application de Fitness

Une application moderne de suivi d'entraînement et de progression fitness construite avec Next.js, Supabase et Tailwind CSS.

## 🚀 Fonctionnalités

### ✅ Authentification sécurisée
- Connexion/Inscription avec Supabase Auth
- Protection des routes avec Row Level Security (RLS)

### ✅ Profil utilisateur
- Configuration initiale (poids, taille, objectif, niveau d'activité)
- Modification du profil et avatar
- Suivi de progression du poids

### ✅ Gestion des entraînements
- Ajout, modification, suppression d'entraînements
- Suivi des calories brûlées et durée
- Historique complet des séances

### ✅ Dashboard intelligent
- Statistiques en temps réel (séances totales, calories, durée moyenne)
- Graphiques de progression (poids + calories par semaine)
- Liste des derniers entraînements
- Rappels quotidiens des entraînements

### ✅ Interface moderne
- Mode clair/sombre automatique
- Design responsive (mobile, tablette, desktop)
- Notifications toast élégantes
- Navigation fluide avec navbar sticky

## 🛠️ Technologies utilisées

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (Auth, Database, Storage)
- **Graphiques**: Recharts
- **Notifications**: React Toastify
- **Icons**: Lucide React
- **Architecture**: Hooks personnalisés, Composants réutilisables, Error Boundaries

## 📋 Configuration Supabase

### Tables requises :

#### `profiles`
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  weight FLOAT,
  taille FLOAT,
  goal TEXT,
  activity_level TEXT,
  full_name TEXT,
  username TEXT,
  email TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `workouts`
```sql
CREATE TABLE workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  calories INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Politiques RLS :

```sql
-- Pour profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Pour workouts
CREATE POLICY "select_own_workouts" ON workouts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_workouts" ON workouts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_workouts" ON workouts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_workouts" ON workouts FOR DELETE TO authenticated USING (auth.uid() = user_id);
```

## 🚀 Installation

1. **Cloner le projet**
```bash
git clone https://github.com/your-username/wallfit.git
cd wallfit
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer Supabase**
- Créer un projet sur [supabase.com](https://supabase.com)
- Copier les variables d'environnement dans `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Créer les tables et politiques** (voir section Configuration Supabase)

5. **Lancer l'application**
```bash
npm run dev
```

## 📱 Pages de l'application

- `/` - Page d'accueil avec aperçu des fonctionnalités
- `/auth` - Connexion/Inscription
- `/onboarding` - Configuration du profil initial
- `/dashboard` - Tableau de bord principal
- `/profile` - Gestion du profil utilisateur
- `/workouts` - Gestion des entraînements

## 🎨 Thème et personnalisation

### Mode sombre/clair
- Bouton de toggle dans la navbar
- Sauvegarde automatique de la préférence
- Transitions douces

### Responsive design
- Mobile-first approach
- Breakpoints Tailwind : `sm:`, `md:`, `lg:`
- Navigation adaptée sur petit écran

## 🔧 Scripts disponibles

```bash
npm run dev      # Développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Vérification ESLint
```

## ✨ Améliorations récentes

### Architecture & Code Quality
- ✅ **Types TypeScript** : Interfaces complètes pour toutes les entités (Workout, Profile, User)
- ✅ **Error Boundary** : Gestion globale des erreurs avec composant de fallback
- ✅ **Hooks personnalisés** : `useAuth`, `useWorkouts`, `useProfile` pour une logique réutilisable
- ✅ **Composants UI réutilisables** : Loading, Skeleton, Button, Input, Modal avec accessibilité
- ✅ **Validation centralisée** : Système de validation pour les formulaires
- ✅ **Gestion d'erreurs** : Handler centralisé avec messages utilisateur
- ✅ **Constants** : Valeurs centralisées pour la maintenabilité
- ✅ **SEO amélioré** : Métadonnées complètes avec OpenGraph et Twitter Cards

### Accessibilité
- ✅ **ARIA labels** : Attributs d'accessibilité sur tous les composants interactifs
- ✅ **Navigation clavier** : Support complet du clavier (Tab, Escape, focus trap)
- ✅ **Focus states** : Indicateurs visuels pour la navigation au clavier
- ✅ **Semantic HTML** : Structure HTML sémantique appropriée

### Performance
- ✅ **Lazy loading** : Composants chargés à la demande
- ✅ **Memoization** : Optimisation des re-renders avec useCallback
- ✅ **Error handling** : Gestion d'erreurs robuste avec retry

## 📈 Fonctionnalités futures

- [ ] Export CSV/PDF des données
- [ ] Notifications push mobiles
- [ ] Gamification (badges, séries)
- [ ] Synchronisation avec applications fitness
- [ ] Mode hors ligne
- [ ] Tests unitaires et d'intégration
- [ ] Internationalisation (i18n)

## 🤝 Contribution

Contributions bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

---

Développé avec ❤️ par W.ALLfit Team.
