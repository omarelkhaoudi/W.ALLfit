// Utilitaires pour générer des URLs d'avatar

/**
 * Génère une URL d'avatar depuis UI Avatars basée sur un nom
 */
export function generateAvatarFromName(name: string, size: number = 200): string {
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&size=${size}&background=111827&color=fff&bold=true`;
}

/**
 * Génère une URL d'avatar depuis DiceBear basée sur un seed
 */
export function generateAvatarFromSeed(seed: string, style: string = "avataaars"): string {
  const encodedSeed = encodeURIComponent(seed);
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodedSeed}`;
}

/**
 * Génère une URL d'avatar depuis Gravatar basée sur un email
 */
export function generateGravatarUrl(email: string, size: number = 200): string {
  // Note: Pour utiliser Gravatar, vous devez avoir un compte Gravatar
  // Cette fonction génère l'URL basée sur l'email, mais l'avatar ne sera disponible
  // que si l'utilisateur a créé un compte Gravatar avec cet email
  const emailHash = email.toLowerCase().trim();
  return `https://www.gravatar.com/avatar/${emailHash}?s=${size}&d=identicon`;
}

/**
 * Valide si une URL d'avatar est valide
 */
export function isValidAvatarUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Génère un avatar par défaut si aucune URL n'est fournie
 */
export function getDefaultAvatar(name?: string, email?: string): string {
  if (name) {
    return generateAvatarFromName(name);
  }
  if (email) {
    return generateGravatarUrl(email);
  }
  return "https://ui-avatars.com/api/?name=User&size=200&background=111827&color=fff";
}

