// Hook pour debounce les valeurs (optimisation des recherches)

import { useState, useEffect } from "react";

/**
 * Hook pour debounce une valeur
 * @param value - La valeur à debounce
 * @param delay - Le délai en millisecondes (défaut: 300ms)
 * @returns La valeur debounced
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

