"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import { useSession } from "@/app/lib/useSession";

export default function Onboarding() {
  const router = useRouter();
  const session = useSession();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState("maintain");
  const [activity, setActivity] = useState("sedentary");

  useEffect(() => {
    if (session === null) return;
    if (!session?.user) {
      router.push("/auth");
    } else {
      setLoading(false);
    }
  }, [router, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    setError("");

    const userId = session.user.id as string;
    const w = Number(weight);
    const h = Number(height);

    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          weight: isNaN(w) ? null : w,
          taille: isNaN(h) ? null : h,
          goal,
          activity_level: activity,
        },
        { onConflict: "id" }
      );

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
  };

  if (loading) return <div className="p-4">Chargement...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Bienvenue !</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Poids (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Taille (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Objectif</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="lose">Perte de poids</option>
            <option value="maintain">Maintien</option>
            <option value="gain">Gain musculaire</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Niveau d'activité</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="sedentary">Sédentaire</option>
            <option value="moderate">Modéré</option>
            <option value="active">Actif</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
          Enregistrer
        </button>
      </form>
    </div>
  );
}
