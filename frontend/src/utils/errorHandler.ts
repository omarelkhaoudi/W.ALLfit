// Gestion centralisée des erreurs

import { ApiError } from "@/types";
import { toast } from "react-toastify";

export const handleError = (error: unknown, defaultMessage?: string): void => {
  console.error("Error:", error);

  let message = defaultMessage || "Une erreur est survenue";

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "object" && error !== null && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  }

  toast.error(message);
};

export const handleApiError = (error: ApiError | unknown, defaultMessage?: string): void => {
  if (typeof error === "object" && error !== null && "message" in error) {
    const apiError = error as ApiError;
    toast.error(apiError.message || defaultMessage || "Une erreur est survenue");
  } else {
    handleError(error, defaultMessage);
  }
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    return String(error.message);
  }
  if (typeof error === "string") {
    return error;
  }
  return "Une erreur inconnue est survenue";
};

/**
 * Fonction pour retry une opération avec backoff exponentiel
 * @param fn - La fonction à exécuter
 * @param retries - Nombre de tentatives (défaut: 3)
 * @param delay - Délai initial en ms (défaut: 1000)
 * @returns Le résultat de la fonction
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    
    // Attendre avant de réessayer (backoff exponentiel)
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Réessayer avec un délai plus long
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}

/**
 * Vérifie si une erreur est une erreur réseau
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes("network") ||
      error.message.includes("fetch") ||
      error.message.includes("timeout") ||
      error.message.includes("ECONNREFUSED") ||
      error.name === "NetworkError"
    );
  }
  return false;
}

/**
 * Gère une erreur avec retry automatique si c'est une erreur réseau
 */
export async function handleErrorWithRetry<T>(
  fn: () => Promise<T>,
  errorMessage: string = "Une erreur est survenue"
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isNetworkError(error)) {
      try {
        // Retry automatique pour les erreurs réseau
        return await retryWithBackoff(fn, 2, 1000);
      } catch (retryError) {
        handleError(retryError, errorMessage);
        throw retryError;
      }
    } else {
      handleError(error, errorMessage);
      throw error;
    }
  }
}

