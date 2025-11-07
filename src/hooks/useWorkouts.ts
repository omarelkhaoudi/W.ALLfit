// Hook personnalisé pour les entraînements

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { Workout } from "@/types";
import { handleError } from "@/utils/errorHandler";

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Utilisateur non authentifié");
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setWorkouts((data as Workout[]) || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du chargement des entraînements";
      setError(errorMessage);
      handleError(err, "Erreur lors du chargement des entraînements");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const addWorkout = async (workout: Omit<Workout, "id" | "created_at" | "updated_at">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non authentifié");

      const { data, error: insertError } = await supabase
        .from("workouts")
        .insert([{ ...workout, user_id: user.id }])
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchWorkouts();
      return data as Workout;
    } catch (err) {
      handleError(err, "Erreur lors de l'ajout de l'entraînement");
      throw err;
    }
  };

  const updateWorkout = async (id: string, updates: Partial<Workout>) => {
    try {
      const { error: updateError } = await supabase
        .from("workouts")
        .update(updates)
        .eq("id", id);

      if (updateError) throw updateError;

      await fetchWorkouts();
    } catch (err) {
      handleError(err, "Erreur lors de la mise à jour de l'entraînement");
      throw err;
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("workouts")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await fetchWorkouts();
    } catch (err) {
      handleError(err, "Erreur lors de la suppression de l'entraînement");
      throw err;
    }
  };

  return {
    workouts,
    loading,
    error,
    fetchWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
  };
}

