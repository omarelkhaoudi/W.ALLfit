"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WorkoutsChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: workouts, error } = await supabase
        .from("workouts")
        .select("created_at, calories")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) return console.error(error);

      // Grouper par semaine (année-semaine)
      const grouped: Record<string, number> = {};
      workouts?.forEach((w: any) => {
        const d = new Date(w.created_at);
        const year = d.getFullYear();
        const week = Math.ceil(
          ((d.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7
        );
        const key = `S${week} - ${year}`;
        grouped[key] = (grouped[key] || 0) + w.calories;
      });

      const chartData = Object.entries(grouped).map(([week, calories]) => ({
        week,
        calories,
      }));

      setData(chartData);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2 text-center dark:text-white">
        🔥 Calories brûlées par semaine
      </h2>
      {data.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">Aucun entraînement enregistré.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="calories" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
