# 🔧 Dépannage : Erreur 404 Google OAuth

## ❌ Problème : Erreur 404 lors de la connexion Google

L'erreur 404 de Google signifie que l'URL de redirection n'est pas correctement configurée.

## ✅ Solution Étape par Étape

### 1. Trouver votre URL de callback Supabase

1. Allez sur votre projet Supabase Dashboard
2. Menu : **Settings** > **API**
3. Trouvez **"Project URL"** - Notez-la, elle ressemble à :
   ```
   https://abcdefghijklmnop.supabase.co
   ```
4. Votre URL de callback complète sera :
   ```
   https://abcdefghijklmnop.supabase.co/auth/v1/callback
   ```

### 2. Vérifier dans Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet
3. Menu : **APIs & Services** > **Credentials**
4. Cliquez sur votre **OAuth 2.0 Client ID**
5. Vérifiez la section **"Authorized redirect URIs"**

### 3. Corriger l'URL de redirection

**IMPORTANT** : L'URL doit être EXACTEMENT :
```
https://VOTRE_PROJECT_REF.supabase.co/auth/v1/callback
```

❌ **Ne PAS utiliser** :
- `http://localhost:3000/auth/callback`
- `https://votre-domaine.com/auth/callback`
- Toute autre URL

✅ **DOIT être** :
- L'URL Supabase uniquement : `https://VOTRE_PROJECT_REF.supabase.co/auth/v1/callback`

### 4. Étapes de Correction

1. **Dans Google Cloud Console** :
   - Ouvrez votre OAuth Client ID
   - Dans "Authorized redirect URIs", ajoutez/modifiez :
     ```
     https://VOTRE_PROJECT_REF.supabase.co/auth/v1/callback
     ```
   - Cliquez sur **"Save"**
   - Attendez quelques secondes pour la propagation

2. **Vérifiez dans Supabase** :
   - Menu : **Authentication** > **URL Configuration**
   - **Site URL** doit être :
     ```
     http://localhost:3000
     ```
     (ou votre domaine de production)
   - **Redirect URLs** doit inclure :
     ```
     http://localhost:3000/auth/callback
     https://votre-domaine.com/auth/callback
     ```
     (Note : Ce sont pour les redirections après OAuth, pas l'URL OAuth elle-même)

### 5. Vérifier la Configuration Complète

**Google Cloud Console** :
- ✅ OAuth Client ID créé
- ✅ Authorized redirect URI : `https://VOTRE_PROJECT_REF.supabase.co/auth/v1/callback`
- ✅ Authorized JavaScript origins : `http://localhost:3000` (pour dev)

**Supabase Dashboard** :
- ✅ Provider Google activé
- ✅ Client ID Google collé
- ✅ Client Secret Google collé
- ✅ Site URL : `http://localhost:3000`
- ✅ Redirect URLs : `http://localhost:3000/auth/callback`

### 6. Tester à Nouveau

1. Attendez 1-2 minutes après avoir modifié les URLs (propagation)
2. Videz le cache de votre navigateur
3. Allez sur `http://localhost:3000/auth`
4. Cliquez sur "Continue with Google"
5. Si l'erreur persiste, vérifiez la console du navigateur (F12) pour plus de détails

## 🔍 Comment Trouver Votre Project Reference

Votre Project Reference se trouve :
1. Dans l'URL de votre dashboard Supabase : `https://app.supabase.com/project/VOTRE_PROJECT_REF`
2. Dans Settings > API > Project URL : `https://VOTRE_PROJECT_REF.supabase.co`

## 📝 Exemple Complet

Si votre Project Reference est `abcdefghijklmnop`, alors :

**Dans Google Cloud Console** :
```
Authorized redirect URIs:
https://abcdefghijklmnop.supabase.co/auth/v1/callback
```

**Dans Supabase** :
- Site URL : `http://localhost:3000`
- Redirect URLs : `http://localhost:3000/auth/callback`

## ⚠️ Erreurs Communes

### Erreur : "redirect_uri_mismatch"
- **Cause** : L'URL dans Google Cloud Console ne correspond pas exactement
- **Solution** : Vérifiez qu'il n'y a pas d'espaces, de trailing slash, ou de différences

### Erreur : "access_denied"
- **Cause** : L'utilisateur a refusé l'autorisation
- **Solution** : Réessayez et acceptez les permissions

### Erreur : "invalid_client"
- **Cause** : Client ID ou Secret incorrect dans Supabase
- **Solution** : Vérifiez que les identifiants sont correctement collés dans Supabase

## 🆘 Si le Problème Persiste

1. Vérifiez les logs Supabase :
   - Dashboard > Logs > Auth Logs
   
2. Vérifiez la console du navigateur :
   - F12 > Console
   - Recherchez les erreurs

3. Vérifiez que Google+ API est activée :
   - Google Cloud Console > APIs & Services > Library
   - Recherchez "Google+ API" et activez-la

4. Testez avec un autre navigateur ou mode incognito

---

**Note** : L'URL de redirection OAuth doit TOUJOURS pointer vers Supabase, pas vers votre application Next.js. Supabase gère l'OAuth et redirige ensuite vers votre application.

