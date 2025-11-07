# 🔐 Configuration Google OAuth avec Supabase

Ce guide vous explique comment configurer la connexion avec Google dans W.ALLfit.

## 📋 Étapes de Configuration

### 1. Configuration dans Google Cloud Console

1. **Accédez à Google Cloud Console**
   - Allez sur [Google Cloud Console](https://console.cloud.google.com/)
   - Créez un nouveau projet ou sélectionnez un projet existant

2. **Activer Google+ API**
   - Dans le menu, allez dans "APIs & Services" > "Library"
   - Recherchez "Google+ API" et activez-la
   - (Note: Google+ API est toujours nécessaire pour OAuth, même si Google+ est déprécié)

3. **Créer des identifiants OAuth**
   - Allez dans "APIs & Services" > "Credentials"
   - Cliquez sur "Create Credentials" > "OAuth client ID"
   - Si c'est la première fois, configurez l'écran de consentement OAuth :
     - Type d'application : "External" (pour les tests)
     - Remplissez les informations requises
     - Ajoutez votre email comme test user

4. **Configurer l'écran de consentement**
   - Nom de l'application : "W.ALLfit"
   - Support email : Votre email
   - Scopes : Email, Profile, OpenID
   - Enregistrez et continuez

5. **Créer l'OAuth Client ID**
   - Type d'application : "Web application"
   - Nom : "W.ALLfit Web Client"
   - **Authorized JavaScript origins** : Ajoutez :
     ```
     http://localhost:3000
     https://votre-domaine.com
     ```
   - **Authorized redirect URIs** : Ajoutez :
     ```
     https://VOTRE_PROJECT_REF.supabase.co/auth/v1/callback
     ```
     (Remplacez `VOTRE_PROJECT_REF` par votre référence de projet Supabase)

6. **Copier les identifiants**
   - Copiez le **Client ID** et le **Client Secret**
   - Vous en aurez besoin pour la prochaine étape

### 2. Configuration dans Supabase

1. **Accédez à votre projet Supabase**
   - Allez sur [supabase.com](https://supabase.com)
   - Ouvrez votre projet

2. **Configurer Google Provider**
   - Allez dans "Authentication" > "Providers"
   - Trouvez "Google" dans la liste
   - Activez le provider Google
   - Collez le **Client ID** de Google
   - Collez le **Client Secret** de Google
   - Cliquez sur "Save"

3. **Configurer l'URL de redirection**
   - Dans "Authentication" > "URL Configuration"
   - Ajoutez votre URL de site dans "Site URL" :
     ```
     http://localhost:3000
     ```
   - Ajoutez dans "Redirect URLs" :
     ```
     http://localhost:3000/auth/callback
     https://votre-domaine.com/auth/callback
     ```

### 3. Vérification dans le Code

Le code de l'application est déjà configuré pour utiliser Google OAuth :

✅ Provider Google activé dans `src/app/auth/page.tsx`
✅ Route de callback configurée dans `src/app/auth/callback/route.ts`
✅ Redirection automatique vers le dashboard après connexion

## 🔧 Variables d'Environnement

Assurez-vous d'avoir ces variables dans votre `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
```

## 🧪 Test de la Connexion

1. **Démarrez votre application**
   ```bash
   npm run dev
   ```

2. **Allez sur la page d'authentification**
   ```
   http://localhost:3000/auth
   ```

3. **Vérifiez que le bouton Google apparaît**
   - Vous devriez voir un bouton "Continue with Google"
   - Si le bouton n'apparaît pas, vérifiez la configuration Supabase

4. **Testez la connexion**
   - Cliquez sur "Continue with Google"
   - Sélectionnez votre compte Google
   - Autorisez l'application
   - Vous devriez être redirigé vers `/dashboard`

## ❓ Problèmes Courants

### Le bouton Google n'apparaît pas

**Solution :**
- Vérifiez que `providers={["google"]}` est présent dans `src/app/auth/page.tsx`
- Vérifiez que le provider Google est activé dans Supabase Dashboard
- Videz le cache du navigateur et rechargez

### Erreur "redirect_uri_mismatch"

**Solution :**
- Vérifiez que l'URL de redirection dans Google Cloud Console correspond exactement à :
  ```
  https://VOTRE_PROJECT_REF.supabase.co/auth/v1/callback
  ```
- Assurez-vous qu'il n'y a pas d'espaces ou de caractères supplémentaires

### Erreur "invalid_client"

**Solution :**
- Vérifiez que le Client ID et Client Secret sont corrects dans Supabase
- Vérifiez que les identifiants correspondent au bon projet Google Cloud

### L'utilisateur n'est pas créé après la connexion

**Solution :**
- Vérifiez que le profil est créé automatiquement
- Créez un trigger dans Supabase pour créer automatiquement un profil :

```sql
-- Fonction pour créer un profil automatiquement
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utilisateur')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer le profil à la création de l'utilisateur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## 🔒 Sécurité

- ✅ Ne partagez jamais votre Client Secret
- ✅ Utilisez HTTPS en production
- ✅ Limitez les URLs de redirection autorisées
- ✅ Activez les restrictions d'API dans Google Cloud Console si nécessaire

## 📚 Ressources

- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Documentation Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Providers](https://supabase.com/docs/guides/auth/social-login)

---

**Note :** Pour la production, assurez-vous de remplacer `localhost:3000` par votre domaine réel.

