// Hook personnalisé pour l'historique de poids

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { WeightEntry } from "@/types";
import { handleError } from "@/utils/errorHandler";

export function useWeightHistory() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeightHistory = useCallback(async () => {
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
        .from("weight_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (fetchError) throw fetchError;

      setEntries((data as WeightEntry[]) || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du chargement de l'historique";
      setError(errorMessage);
      handleError(err, "Erreur lors du chargement de l'historique de poids");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeightHistory();
  }, [fetchWeightHistory]);

  const addWeightEntry = async (weight: number, date: string, notes?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non authentifié");

      const { data, error: insertError } = await supabase
        .from("weight_entries")
        .insert([{
          user_id: user.id,
          weight,
          date,
          notes: notes || null,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Mettre à jour le profil avec le dernier poids
      await supabase
        .from("profiles")
        .update({ weight, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      await fetchWeightHistory();
      return data as WeightEntry;
    } catch (err) {
      handleError(err, "Erreur lors de l'ajout du poids");
      throw err;
    }
  };

  const updateWeightEntry = async (id: string, weight: number, date: string, notes?: string) => {
    try {
      const { error: updateError } = await supabase
        .from("weight_entries")
        .update({
          weight,
          date,
          notes: notes || null,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      // Si c'est la dernière entrée, mettre à jour le profil
      const sortedEntries = [...entries].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      if (sortedEntries[0]?.id === id) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from("profiles")
            .update({ weight, updated_at: new Date().toISOString() })
            .eq("id", user.id);
        }
      }

      await fetchWeightHistory();
    } catch (err) {
      handleError(err, "Erreur lors de la mise à jour du poids");
      throw err;
    }
  };

  const deleteWeightEntry = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("weight_entries")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      await fetchWeightHistory();
    } catch (err) {
      handleError(err, "Erreur lors de la suppression de l'entrée");
      throw err;
    }
  };

  const getLatestWeight = useCallback(() => {
    if (entries.length === 0) return null;
    const sorted = [...entries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted[0];
  }, [entries]);

  const getWeightChange = useCallback(() => {
    if (entries.length < 2) return null;
    const sorted = [...entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    return {
      change: last.weight - first.weight,
      percentage: ((last.weight - first.weight) / first.weight) * 100,
      firstWeight: first.weight,
      lastWeight: last.weight,
    };
  }, [entries]);

  const getChartData = useCallback(() => {
    return entries
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(entry => ({
        date: new Date(entry.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
        weight: entry.weight,
        fullDate: entry.date,
      }));
  }, [entries]);

  return {
    entries,
    loading,
    error,
    fetchWeightHistory,
    addWeightEntry,
    updateWeightEntry,
    deleteWeightEntry,
    getLatestWeight,
    getWeightChange,
    getChartData,
  };
}

