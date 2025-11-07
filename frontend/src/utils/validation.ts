// Utilitaires de validation

import { VALIDATION } from "./constants";
import { FormErrors } from "@/types";

export const validateWorkout = (data: {
  type: string;
  duration: string;
  calories: string;
}): FormErrors => {
  const errors: FormErrors = {};

  if (!data.type || data.type.trim().length === 0) {
    errors.type = "Le type d'entraînement est requis";
  }

  const duration = parseInt(data.duration);
  if (!data.duration || isNaN(duration)) {
    errors.duration = "La durée est requise";
  } else if (duration < VALIDATION.MIN_DURATION) {
    errors.duration = `La durée doit être d'au moins ${VALIDATION.MIN_DURATION} minute`;
  } else if (duration > VALIDATION.MAX_DURATION) {
    errors.duration = `La durée ne peut pas dépasser ${VALIDATION.MAX_DURATION} minutes`;
  }

  const calories = parseInt(data.calories);
  if (!data.calories || isNaN(calories)) {
    errors.calories = "Les calories sont requises";
  } else if (calories < VALIDATION.MIN_CALORIES) {
    errors.calories = `Les calories doivent être d'au moins ${VALIDATION.MIN_CALORIES}`;
  } else if (calories > VALIDATION.MAX_CALORIES) {
    errors.calories = `Les calories ne peuvent pas dépasser ${VALIDATION.MAX_CALORIES}`;
  }

  return errors;
};

export const validateProfile = (data: {
  username: string;
  avatar_url?: string;
}): FormErrors => {
  const errors: FormErrors = {};

  if (data.username) {
    if (data.username.length < VALIDATION.MIN_USERNAME_LENGTH) {
      errors.username = `Le nom d'utilisateur doit contenir au moins ${VALIDATION.MIN_USERNAME_LENGTH} caractères`;
    } else if (data.username.length > VALIDATION.MAX_USERNAME_LENGTH) {
      errors.username = `Le nom d'utilisateur ne peut pas dépasser ${VALIDATION.MAX_USERNAME_LENGTH} caractères`;
    }
  }

  if (data.avatar_url && !isValidUrl(data.avatar_url)) {
    errors.avatar_url = "L'URL de l'avatar n'est pas valide";
  }

  return errors;
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const estimateCalories = (duration: number): number => {
  return Math.round(duration * VALIDATION.CALORIES_PER_MINUTE);
};

