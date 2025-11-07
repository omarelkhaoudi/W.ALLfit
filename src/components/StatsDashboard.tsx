"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

export default function StatsDashboard() {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    totalDuration: 0,
    avgCalories: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: workouts, error } = await supabase
        .from("workouts")
        .select("duration, calories")
        .eq("user_id", user.id);

      if (error) return console.error(error);

      const totalWorkouts = workouts?.length || 0;
      const totalCalories = workouts?.reduce((sum, w) => sum + w.calories, 0) || 0;
      const totalDuration = workouts?.reduce((sum, w) => sum + w.duration, 0) || 0;
      const avgCalories = totalWorkouts ? totalCalories / totalWorkouts : 0;

      setStats({
        totalWorkouts,
        totalCalories,
        totalDuration,
        avgCalories: Math.round(avgCalories),
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl shadow">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Séances totales</p>
        <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.totalWorkouts}</p>
      </div>
      <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl shadow">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Calories totales</p>
        <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.totalCalories} kcal</p>
      </div>
      <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-xl shadow">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Durée totale (min)</p>
        <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{stats.totalDuration} min</p>
      </div>
      <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl shadow">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Calories moyennes</p>
        <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{stats.avgCalories} kcal</p>
      </div>
    </div>
  );
}
