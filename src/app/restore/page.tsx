"use client";
import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { toast } from "react-toastify";

export default function RestoreAccount() {
  const [isRestoring, setIsRestoring] = useState(false);

  const restoreAccount = async () => {
    setIsRestoring(true);
    try {
      // Créer un profil d'exemple
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Veuillez vous connecter d'abord");
        return;
      }

      // Créer le profil
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          username: "Utilisateur W.ALLfit",
          weight: 70,
          taille: 175,
          goal: "gain",
          activity_level: "moderate",
          full_name: user.email?.split('@')[0] || "Utilisateur"
        });

      if (profileError) {
        toast.error("Erreur lors de la création du profil");
        console.error(profileError);
        return;
      }

      // Créer des workouts d'exemple
      const sampleWorkouts = [
        { type: "Cardio", duration: 30, calories: 300 },
        { type: "Musculation", duration: 45, calories: 250 },
        { type: "Yoga", duration: 60, calories: 200 },
        { type: "Course", duration: 25, calories: 350 },
        { type: "Natation", duration: 40, calories: 280 }
      ];

      for (const workout of sampleWorkouts) {
        const { error: workoutError } = await supabase
          .from("workouts")
          .insert({
            user_id: user.id,
            type: workout.type,
            duration: workout.duration,
            calories: workout.calories
          });

        if (workoutError) {
          console.error("Erreur workout:", workoutError);
        }
      }

      toast.success("✅ Compte restauré avec succès !");
      toast.info("🔄 Redirection vers le dashboard...");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);

    } catch (error) {
      toast.error("Erreur lors de la restauration");
      console.error(error);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-400 to-pink-500 text-white px-4">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">🔄 Restaurer le compte</h1>
        <p className="mb-6 opacity-90">
          Votre compte a été supprimé. Voulez-vous le recréer avec des données d'exemple ?
        </p>

        <button
          onClick={restoreAccount}
          disabled={isRestoring}
          className="bg-white text-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50"
        >
          {isRestoring ? "⏳ Restauration..." : "✅ Restaurer mon compte"}
        </button>

        <div className="mt-6 text-sm opacity-75">
          <p>Données qui seront recréées :</p>
          <ul className="mt-2 space-y-1">
            <li>• Profil utilisateur</li>
            <li>• 5 entraînements d'exemple</li>
            <li>• Statistiques de base</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
