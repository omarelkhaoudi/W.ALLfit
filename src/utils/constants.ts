// Constantes de l'application

export const APP_NAME = "W.ALLfit";
export const APP_DESCRIPTION = "Application de fitness pour suivre vos entraînements et votre progression";

// Routes
export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  WORKOUTS: "/workouts",
  PROGRAMS: "/programs",
  ONBOARDING: "/onboarding",
  RESTORE: "/restore",
} as const;

// Messages Toast
export const TOAST_MESSAGES = {
  WORKOUT_ADDED: "✅ Entraînement ajouté avec succès !",
  WORKOUT_UPDATED: "✅ Entraînement mis à jour !",
  WORKOUT_DELETED: "🗑️ Entraînement supprimé",
  PROFILE_UPDATED: "Profil mis à jour ✅",
  ACCOUNT_DELETED: "Compte supprimé 😢",
  LOGIN_REQUIRED: "Vous devez être connecté",
  ERROR_OCCURRED: "Une erreur est survenue",
  INVALID_FORM: "Veuillez remplir tous les champs",
} as const;

// Validation
export const VALIDATION = {
  MIN_DURATION: 1,
  MAX_DURATION: 1440, // 24 heures
  MIN_CALORIES: 1,
  MAX_CALORIES: 10000,
  MIN_USERNAME_LENGTH: 2,
  MAX_USERNAME_LENGTH: 50,
  CALORIES_PER_MINUTE: 7, // Estimation moyenne
} as const;

// Formats
export const DATE_FORMATS = {
  SHORT: "fr-FR",
  LONG: { day: "numeric", month: "short", year: "numeric" } as const,
} as const;

