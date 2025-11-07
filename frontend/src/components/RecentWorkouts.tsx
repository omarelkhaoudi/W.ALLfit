"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

export default function RecentWorkouts() {
  const [workouts, setWorkouts] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecentWorkouts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) console.error(error);
      else setWorkouts(data || []);
    };

    fetchRecentWorkouts();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 dark:text-white">Derniers entraînements</h2>

      {workouts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">Aucun entraînement enregistré.</p>
      ) : (
        <div className="space-y-3">
          {workouts.map((w) => (
            <div key={w.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium dark:text-white">{w.type}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {w.duration} min • {w.calories} kcal
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(w.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="text-2xl">🏋️</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
