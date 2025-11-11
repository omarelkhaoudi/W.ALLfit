"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Activity, TrendingUp, Target, Plus, User, Edit, LogOut, Flame, Clock, Award, Zap } from "lucide-react";
import { supabase } from "@/app/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Progress from "@/components/ui/Progress";
import Alert from "@/components/ui/Alert";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useProfile } from "@/hooks/useProfile";
import { Workout } from "@/types";
import { useNotifications } from "@/contexts/NotificationContext";


export default function Dashboard() {
  const router = useRouter();
  const { workouts, loading: workoutsLoading, addWorkout, fetchWorkouts } = useWorkouts();
  const { profile, stats, loading: profileLoading } = useProfile();
  const { showSuccess } = useNotifications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workoutForm, setWorkoutForm] = useState({ type: "", duration: "", calories: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Vérifier l'authentification
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, [router]);
  
  // Handler pour ouvrir le modal
  const handleAddWorkout = () => {
    setIsModalOpen(true);
  };
  
  // Handler pour fermer le modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setWorkoutForm({ type: "", duration: "", calories: "" });
  };
  
  // Charger les données hebdomadaires
  useEffect(() => {
    if (workouts.length > 0) {
      const weekData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayWorkouts = workouts.filter((w: Workout) => {
          const workoutDate = new Date(w.created_at);
          return workoutDate.toDateString() === date.toDateString();
        });
        return dayWorkouts.length;
      });
      setWeeklyData(weekData);
    }
  }, [workouts]);

  // Handler pour soumettre le formulaire d'entraînement
  const handleSubmitWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addWorkout({
        type: workoutForm.type,
        duration: parseInt(workoutForm.duration),
        calories: parseInt(workoutForm.calories),
      } as Omit<Workout, "id" | "created_at" | "updated_at">);
      
      showSuccess("Entraînement ajouté", "Votre entraînement a été enregistré avec succès");
      setWorkoutForm({ type: "", duration: "", calories: "" });
      setIsModalOpen(false);
      await fetchWorkouts();
    } catch (error) {
      // L'erreur est déjà gérée par le hook
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handler pour voir le profil
  const handleViewProfile = () => {
    router.push("/profile");
  };
  
  // Handler pour mettre à jour le profil
  const handleUpdateProfile = () => {
    router.push("/profile?edit=true");
  };
  
  // Handler pour déconnexion
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };
  
  // Calculer les statistiques réelles
  const dashboardStats = [
    { 
      label: "Entraînements", 
      value: stats.totalWorkouts.toString(), 
      icon: Activity, 
      change: "+12%",
      color: "default"
    },
    { 
      label: "Calories brûlées", 
      value: stats.totalCalories > 1000 ? `${(stats.totalCalories / 1000).toFixed(1)}k` : stats.totalCalories.toString(), 
      icon: Flame, 
      change: "+8%",
      color: "danger"
    },
    { 
      label: "Durée totale", 
      value: `${stats.totalDuration} min`, 
      icon: Clock, 
      change: "+5%",
      color: "info"
    },
    { 
      label: "Moyenne calories", 
      value: stats.avgCalories.toString(), 
      icon: TrendingUp, 
      change: "+20%",
      color: "success"
    },
  ];

  // Récupérer les entraînements récents
  const recentWorkouts = workouts.slice(0, 5).map((w: Workout) => {
    const date = new Date(w.created_at);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let dateLabel = "";
    if (diffDays === 0) dateLabel = "Aujourd'hui";
    else if (diffDays === 1) dateLabel = "Hier";
    else dateLabel = `Il y a ${diffDays} jours`;
    
    return {
      id: w.id,
      type: w.type,
      date: dateLabel,
      duration: `${w.duration} min`,
      calories: w.calories,
      createdAt: w.created_at,
    };
  });

  // Calculer les objectifs (exemple : 3000 calories par semaine)
  const weeklyCalories = workouts
    .filter((w: Workout) => {
      const workoutDate = new Date(w.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return workoutDate >= weekAgo;
    })
    .reduce((sum: number, w: Workout) => sum + w.calories, 0);
  
  const weeklyGoal = 3000;
  const weeklyProgress = Math.min((weeklyCalories / weeklyGoal) * 100, 100);

  // Calculer les jours actifs cette semaine
  const activeDays = new Set(
    workouts
      .filter((w: Workout) => {
        const workoutDate = new Date(w.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return workoutDate >= weekAgo;
      })
      .map((w: Workout) => new Date(w.created_at).toDateString())
  ).size;

  // Afficher le loader pendant la vérification d'authentification
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-semibold">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (workoutsLoading || profileLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-semibold">Chargement...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
              Bienvenue{profile?.username ? `, ${profile.username}` : ""} !
            </h1>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Tableau de bord de votre progression
            </p>
          </div>

          {/* Stats Grid avec Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {dashboardStats.map((stat, idx) => (
              <Card key={idx} hover>
                <CardContent padding="md">
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant={stat.color as any} size="sm">
                      {stat.change}
                    </Badge>
                  </div>
                  <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-8">
              {/* Objectif Hebdomadaire */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Objectif Hebdomadaire</CardTitle>
                      <CardDescription>Calories brûlées cette semaine</CardDescription>
                    </div>
                    <Badge variant={weeklyProgress >= 100 ? "success" : "default"}>
                      {weeklyProgress >= 100 ? "Atteint !" : `${Math.round(weeklyProgress)}%`}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={weeklyProgress} 
                    max={100}
                    label={`${weeklyCalories} / ${weeklyGoal} calories`}
                    showValue
                    variant={weeklyProgress >= 100 ? "success" : "default"}
                    size="lg"
                  />
                </CardContent>
              </Card>

              {/* Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Activité Hebdomadaire</CardTitle>
                  <CardDescription>Nombre d'entraînements par jour</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-52 flex items-end justify-between gap-3">
                    {weeklyData.length > 0 ? (
                      weeklyData.map((count, idx) => {
                        const maxCount = Math.max(...weeklyData, 1);
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-3">
                            <div
                              className="w-full bg-gradient-to-t from-rose-600 to-rose-500 rounded-t-2xl transition-all hover:from-rose-700 hover:to-rose-600 cursor-pointer hover:scale-105 shadow-lg"
                              style={{ height: `${(count / maxCount) * 100}%` }}
                              title={`${count} entraînement(s)`}
                            ></div>
                            <span className="text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {["L", "M", "M", "J", "V", "S", "D"][idx]}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      Array.from({ length: 7 }).map((_, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-3">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t-2xl" style={{ height: "20%" }}></div>
                          <span className="text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {["L", "M", "M", "J", "V", "S", "D"][idx]}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Réalisations</CardTitle>
                  <CardDescription>Vos accomplissements récents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                      <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-extrabold text-gray-900 dark:text-white">Débutant</p>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                          {stats.totalWorkouts >= 1 ? "✅ Débloqué" : "🔒 Verrouillé"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                      <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-extrabold text-gray-900 dark:text-white">Actif</p>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                          {activeDays >= 3 ? "✅ Débloqué" : `${activeDays}/3 jours`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                      <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl">
                        <Flame className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-extrabold text-gray-900 dark:text-white">Calories</p>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                          {stats.totalCalories >= 10000 ? "✅ Débloqué" : `${stats.totalCalories}/10000`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                      <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-extrabold text-gray-900 dark:text-white">Objectif</p>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                          {weeklyProgress >= 100 ? "✅ Débloqué" : `${Math.round(weeklyProgress)}%`}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Recent Workouts */}
              <Card>
                <CardHeader>
                  <CardTitle>Entraînements Récents</CardTitle>
                  <CardDescription>Vos dernières séances</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentWorkouts.length === 0 ? (
                    <Alert variant="info">
                      Aucun entraînement enregistré. Commencez votre parcours fitness !
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      {recentWorkouts.map((workout) => (
                        <Card key={workout.id} hover className="cursor-pointer" onClick={() => router.push("/workouts")}>
                          <CardContent padding="sm">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-extrabold text-gray-900 dark:text-white uppercase tracking-wide">
                                {workout.type}
                              </h3>
                              <Badge variant="default" size="sm">
                                {workout.date}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-5 text-sm font-semibold text-gray-600 dark:text-gray-300">
                              <span className="flex items-center gap-1 uppercase tracking-wide">
                                <Clock className="w-4 h-4" />
                                {workout.duration}
                              </span>
                              <span className="flex items-center gap-1 uppercase tracking-wide">
                                <Flame className="w-4 h-4" />
                                {workout.calories} cal
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                  <CardDescription>Accès rapide aux fonctionnalités</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button
                      onClick={handleAddWorkout}
                      variant="primary"
                      fullWidth
                      size="lg"
                    >
                      <Plus className="w-5 h-5" />
                      Ajouter entraînement
                    </Button>
                    <Button
                      onClick={handleViewProfile}
                      variant="secondary"
                      fullWidth
                    >
                      <User className="w-5 h-5" />
                      Voir mon profil
                    </Button>
                    <Button
                      onClick={handleUpdateProfile}
                      variant="secondary"
                      fullWidth
                    >
                      <Edit className="w-5 h-5" />
                      Mettre à jour profil
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      fullWidth
                    >
                      <LogOut className="w-5 h-5" />
                      Déconnexion
                    </Button>
                  </div>
                </CardContent>
              </Card>
          </div>
        </div>
      </div>
      
          {/* Modal pour ajouter un entraînement */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Ajouter un entraînement"
            footer={
              <>
                <Button
                  type="button"
                  onClick={handleCloseModal}
                  variant="secondary"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  form="workout-form"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  Ajouter
                </Button>
              </>
            }
          >
            <form id="workout-form" onSubmit={handleSubmitWorkout} className="space-y-6">
              <Input
                label="Type d'entraînement"
                type="text"
                value={workoutForm.type}
                onChange={(e) => setWorkoutForm({ ...workoutForm, type: e.target.value })}
                placeholder="Ex: Cardio, Musculation, Yoga..."
                required
              />
              <Input
                label="Durée (minutes)"
                type="number"
                value={workoutForm.duration}
                onChange={(e) => setWorkoutForm({ ...workoutForm, duration: e.target.value })}
                placeholder="Ex: 45"
                min="1"
                required
              />
              <Input
                label="Calories brûlées"
                type="number"
                value={workoutForm.calories}
                onChange={(e) => setWorkoutForm({ ...workoutForm, calories: e.target.value })}
                placeholder="Ex: 320"
                min="1"
                required
              />
            </form>
          </Modal>
      </div>
    </>
  );
}