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

