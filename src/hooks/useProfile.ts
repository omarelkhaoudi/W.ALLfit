// Hook personnalisé pour le profil

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { Profile, WorkoutStats } from "@/types";
import { handleError } from "@/utils/errorHandler";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<WorkoutStats>({
    totalWorkouts: 0,
    totalCalories: 0,
    totalDuration: 0,
    avgCalories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Utilisateur non authentifié");
        setLoading(false);
        return;
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      setProfile((profileData as Profile) || null);

      // Fetch workout stats
      const { data: workouts, error: statsError } = await supabase
        .from("workouts")
        .select("duration, calories")
        .eq("user_id", user.id);

      if (!statsError && workouts) {
        const totalWorkouts = workouts.length;
        const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);
        const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
        const avgCalories = totalWorkouts ? Math.round(totalCalories / totalWorkouts) : 0;

        setStats({
          totalWorkouts,
          totalCalories,
          totalDuration,
          avgCalories,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du chargement du profil";
      setError(errorMessage);
      handleError(err, "Erreur lors du chargement du profil");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non authentifié");

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (updateError) throw updateError;

      await fetchProfile();
    } catch (err) {
      handleError(err, "Erreur lors de la mise à jour du profil");
      throw err;
    }
  };

  const deleteProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non authentifié");

      // Delete workouts
      await supabase.from("workouts").delete().eq("user_id", user.id);

      // Delete profile
      const { error: deleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (deleteError) throw deleteError;

      await supabase.auth.signOut();
    } catch (err) {
      handleError(err, "Erreur lors de la suppression du profil");
      throw err;
    }
  };

  return {
    profile,
    stats,
    loading,
    error,
    fetchProfile,
    updateProfile,
    deleteProfile,
  };
}

