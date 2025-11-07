# 🚀 Guide Complet : Configuration Google Cloud Console pour OAuth

## Étape 1 : Créer ou Sélectionner un Projet

### Option A : Créer un Nouveau Projet

1. **Dans Google Cloud Console**
   - Cliquez sur le bouton **"Créer un projet"** (ou "Create a project" en anglais)
   - Ou utilisez le sélecteur de projet en haut à gauche (à côté de "Google Cloud")

2. **Remplir les Informations**
   - **Nom du projet** : `W.ALLfit` ou `wallfit-oauth`
   - **Organisation** : Laissez par défaut (si vous avez une organisation)
   - Cliquez sur **"Créer"**

3. **Attendre la Création**
   - Le projet sera créé en quelques secondes
   - Vous serez automatiquement redirigé vers le nouveau projet

### Option B : Sélectionner un Projet Existant

1. **Dans Google Cloud Console**
   - Cliquez sur le sélecteur de projet en haut de la page (à côté de "Google Cloud")
   - Choisissez un projet existant dans la liste
   - Si vous n'avez pas de projet, créez-en un nouveau

## Étape 2 : Activer les APIs Nécessaires

1. **Aller dans la Bibliothèque d'APIs**
   - Menu de gauche : **"API et services"** > **"Bibliothèque"**
   - Ou directement : [APIs Library](https://console.cloud.google.com/apis/library)

2. **Activer Google+ API**
   - Recherchez **"Google+ API"** dans la barre de recherche
   - Cliquez sur le résultat
   - Cliquez sur **"ACTIVER"** ou **"ENABLE"**
   - ⚠️ **Important** : Même si Google+ est déprécié, cette API est nécessaire pour OAuth

3. **Vérifier l'Activation**
   - Retournez à **"API et services"** > **"API et services activés"**
   - Vous devriez voir "Google+ API" dans la liste

## Étape 3 : Configurer l'Écran de Consentement OAuth

1. **Aller dans l'Écran de Consentement**
   - Menu de gauche : **"API et services"** > **"Écran de consentement OAuth"**
   - Ou directement : [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)

2. **Choisir le Type d'Application**
   - Sélectionnez **"Externe"** (External) pour les tests
   - Cliquez sur **"CRÉER"**

3. **Remplir les Informations**
   - **Nom de l'application** : `W.ALLfit`
   - **E-mail de support utilisateur** : Votre email
   - **E-mail de contact du développeur** : Votre email
   - Cliquez sur **"ENREGISTRER ET CONTINUER"**

4. **Configurer les Scopes**
   - Cliquez sur **"ENREGISTRER ET CONTINUER"** (les scopes par défaut suffisent)
   - Ou ajoutez manuellement :
     - `userinfo.email`
     - `userinfo.profile`
     - `openid`

5. **Ajouter des Utilisateurs de Test (Important pour les Tests)**
   - Cliquez sur **"+ AJOUTER DES UTILISATEURS"**
   - Ajoutez votre email Google
   - Cliquez sur **"ENREGISTRER ET CONTINUER"**

6. **Résumé**
   - Vérifiez les informations
   - Cliquez sur **"RETOUR AU TABLEAU DE BORD"**

## Étape 4 : Créer les Identifiants OAuth

1. **Aller dans les Identifiants**
   - Menu de gauche : **"API et services"** > **"Identifiants"**
   - Ou directement : [Credentials](https://console.cloud.google.com/apis/credentials)

2. **Créer un OAuth Client ID**
   - Cliquez sur **"+ CRÉER DES IDENTIFIANTS"** (ou "CREATE CREDENTIALS")
   - Sélectionnez **"ID client OAuth"** (OAuth client ID)

3. **Configurer le Client OAuth**
   - **Type d'application** : `Application Web` (Web application)
   - **Nom** : `W.ALLfit Web Client`

4. **Configurer les Origines JavaScript Autorisées**
   - Dans **"Origines JavaScript autorisées"**, ajoutez :
     ```
     http://localhost:3000
     ```
   - Pour la production, ajoutez aussi :
     ```
     https://votre-domaine.com
     ```

5. **Configurer les URIs de Redirection Autorisées** ⚠️ **CRITIQUE**
   
   **IMPORTANT** : Vous devez d'abord obtenir votre Project Reference Supabase :
   
   a. **Trouver votre Project Reference**
      - Allez sur votre projet Supabase
      - Menu : **Settings** > **API**
      - Copiez votre **Project URL** : `https://abcdefghijklmnop.supabase.co`
      - Votre Project Reference est la partie avant `.supabase.co` : `abcdefghijklmnop`
   
   b. **Dans Google Cloud Console**
      - Dans **"URI de redirection autorisées"**, ajoutez :
        ```
        https://VOTRE_PROJECT_REF.supabase.co/auth/v1/callback
        ```
      - Remplacez `VOTRE_PROJECT_REF` par votre référence Supabase
      - **Exemple** : Si votre Project Reference est `xyzabc123`, ajoutez :
        ```
        https://xyzabc123.supabase.co/auth/v1/callback
        ```

6. **Créer le Client**
   - Cliquez sur **"CRÉER"** (CREATE)
   - Une popup s'affiche avec vos identifiants

7. **Copier les Identifiants**
   - **Copiez le Client ID** (une longue chaîne de caractères)
   - **Copiez le Client Secret** (cliquez sur "Afficher" si nécessaire)
   - ⚠️ **Important** : Gardez le Client Secret secret ! Ne le partagez jamais publiquement.

## Étape 5 : Configurer dans Supabase

1. **Aller dans Supabase**
   - Allez sur votre projet Supabase Dashboard
   - Menu : **Authentication** > **Providers**

2. **Activer Google Provider**
   - Trouvez **"Google"** dans la liste des providers
   - Cliquez pour l'activer
   - **Collez le Client ID** de Google Cloud Console
   - **Collez le Client Secret** de Google Cloud Console
   - Cliquez sur **"Save"**

3. **Configurer les URLs**
   - Menu : **Authentication** > **URL Configuration**
   - **Site URL** : `http://localhost:3000`
   - **Redirect URLs** : Ajoutez :
     ```
     http://localhost:3000/auth/callback
     ```
   - Pour la production, ajoutez aussi :
     ```
     https://votre-domaine.com/auth/callback
     ```

## Étape 6 : Tester

1. **Redémarrer votre Application**
   ```bash
   npm run dev
   ```

2. **Aller sur la Page d'Authentification**
   ```
   http://localhost:3000/auth
   ```

3. **Tester la Connexion Google**
   - Cliquez sur **"Continue with Google"**
   - Sélectionnez votre compte Google
   - Autorisez l'application
   - Vous devriez être redirigé vers le dashboard

## ✅ Checklist de Vérification

- [ ] Projet créé/sélectionné dans Google Cloud Console
- [ ] Google+ API activée
- [ ] Écran de consentement OAuth configuré
- [ ] Utilisateurs de test ajoutés (pour les tests)
- [ ] OAuth Client ID créé
- [ ] Origines JavaScript autorisées : `http://localhost:3000`
- [ ] URI de redirection : `https://VOTRE_PROJECT_REF.supabase.co/auth/v1/callback`
- [ ] Client ID et Secret copiés
- [ ] Provider Google activé dans Supabase
- [ ] Client ID et Secret collés dans Supabase
- [ ] Site URL configurée dans Supabase : `http://localhost:3000`
- [ ] Redirect URLs configurées dans Supabase

## ❓ Problèmes Courants

### "Pour afficher cette page, sélectionnez un projet"
- **Solution** : Créez ou sélectionnez un projet (voir Étape 1)

### "redirect_uri_mismatch"
- **Solution** : Vérifiez que l'URI de redirection dans Google Cloud Console correspond **exactement** à :
  ```
  https://VOTRE_PROJECT_REF.supabase.co/auth/v1/callback
  ```
  - Pas d'espaces
  - Pas de trailing slash
  - Exactement la même URL

### "access_denied"
- **Solution** : Vérifiez que votre email est dans la liste des utilisateurs de test (pour les tests)

### Le bouton Google n'apparaît pas
- **Solution** : Vérifiez que le provider Google est activé dans Supabase

---

**Note** : Pour la production, vous devrez :
1. Publier votre écran de consentement OAuth (dans Google Cloud Console)
2. Ajouter votre domaine de production dans les origines JavaScript autorisées
3. Ajouter votre URL de production dans les Redirect URLs de Supabase

