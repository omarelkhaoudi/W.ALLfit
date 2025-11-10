// Hook personnalisé pour les objectifs (Goals)

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { Goal, GoalType, GoalStatus } from "@/types";
import { handleError } from "@/utils/errorHandler";

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
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
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setGoals((data as Goal[]) || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du chargement des objectifs";
      setError(errorMessage);
      handleError(err, "Erreur lors du chargement des objectifs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = async (goal: Omit<Goal, "id" | "user_id" | "created_at" | "updated_at" | "current_value">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non authentifié");

      const { data, error: insertError } = await supabase
        .from("goals")
        .insert([{
          ...goal,
          user_id: user.id,
          current_value: 0,
          status: "active" as GoalStatus,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      await fetchGoals();
      return data as Goal;
    } catch (err) {
      handleError(err, "Erreur lors de l'ajout de l'objectif");
      throw err;
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      const { error: updateError } = await supabase
        .from("goals")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (updateError) throw updateError;

      await fetchGoals();
    } catch (err) {
      handleError(err, "Erreur lors de la mise à jour de l'objectif");
      throw err;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("goals")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await fetchGoals();
    } catch (err) {
      handleError(err, "Erreur lors de la suppression de l'objectif");
      throw err;
    }
  };

  const getActiveGoals = useCallback(() => {
    return goals.filter(g => g.status === "active");
  }, [goals]);

  const getCompletedGoals = useCallback(() => {
    return goals.filter(g => g.status === "completed");
  }, [goals]);

  const getGoalProgress = useCallback((goal: Goal) => {
    if (goal.target_value === 0) return 0;
    return Math.min((goal.current_value / goal.target_value) * 100, 100);
  }, []);

  return {
    goals,
    loading,
    error,
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    getActiveGoals,
    getCompletedGoals,
    getGoalProgress,
  };
}

