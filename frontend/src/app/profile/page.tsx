"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import { 
  Edit, Save, X, Trash2, ArrowLeft, Calendar, Flame, Clock, Activity, 
  TrendingUp, Download, User, Mail, MapPin, Award, Target, AlertCircle,
  CheckCircle, ExternalLink
} from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useNotifications } from "@/contexts/NotificationContext";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Alert from "@/components/ui/Alert";
import Avatar from "@/components/ui/Avatar";
import Progress from "@/components/ui/Progress";
import Spinner from "@/components/ui/Spinner";
import Divider from "@/components/ui/Divider";
import { validateProfile, isValidUrl } from "@/utils/validation";
import { handleError } from "@/utils/errorHandler";
import { Workout } from "@/types";

function ProfileEditHandler({ onEditChange }: { onEditChange: (editing: boolean) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const editParam = searchParams.get("edit");
    if (editParam === "true") {
      onEditChange(true);
    }
  }, [searchParams, onEditChange]);

  return null;
}

export default function ProfilePage() {
  const router = useRouter();
  const { profile, stats, loading, error, updateProfile, deleteProfile, fetchProfile } = useProfile();
  const { workouts } = useWorkouts();
  const { showSuccess, showError } = useNotifications();
  
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: "", avatar_url: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    if (profile) {
      setForm({ 
        username: profile.username || "", 
        avatar_url: profile.avatar_url || "" 
      });
    }
  }, [profile]);

  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    getUserEmail();
  }, []);

  // Statistiques avancées
  const advancedStats = useMemo(() => {
    if (!workouts.length) return null;

    const thisWeek = workouts.filter(w => {
      const date = new Date(w.created_at);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return date >= weekAgo;
    });

    const thisMonth = workouts.filter(w => {
      const date = new Date(w.created_at);
      const now = new Date();
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return date >= monthAgo;
    });

    const types = workouts.reduce((acc, w) => {
      acc[w.type] = (acc[w.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonType = Object.entries(types).sort((a, b) => b[1] - a[1])[0]?.[0] || "Aucun";

    const avgDuration = stats.totalWorkouts > 0 
      ? Math.round(stats.totalDuration / stats.totalWorkouts) 
      : 0;

    return {
      thisWeek: {
        workouts: thisWeek.length,
        calories: thisWeek.reduce((sum, w) => sum + w.calories, 0),
        duration: thisWeek.reduce((sum, w) => sum + w.duration, 0),
      },
      thisMonth: {
        workouts: thisMonth.length,
        calories: thisMonth.reduce((sum, w) => sum + w.calories, 0),
        duration: thisMonth.reduce((sum, w) => sum + w.duration, 0),
      },
      mostCommonType,
      avgDuration,
      streak: calculateStreak(workouts),
    };
  }, [workouts, stats]);

  // Calculer la série d'entraînements consécutifs
  function calculateStreak(workouts: Workout[]): number {
    if (!workouts.length) return 0;
    
    const sorted = [...workouts].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const workout of sorted) {
      const workoutDate = new Date(workout.created_at);
      workoutDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
        currentDate = new Date(workoutDate);
      } else if (diffDays > streak) {
        break;
      }
    }
    
    return streak;
  }

  // Entraînements récents
  const recentWorkouts = useMemo(() => {
    return workouts.slice(0, 5).map(w => {
      const date = new Date(w.created_at);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let dateLabel = "";
      if (diffDays === 0) dateLabel = "Aujourd'hui";
      else if (diffDays === 1) dateLabel = "Hier";
      else dateLabel = `Il y a ${diffDays} jours`;
      
      return { ...w, dateLabel };
    });
  }, [workouts]);

  // Formater la date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Non disponible";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Calculer les objectifs (exemple)
  const weeklyGoal = 3000; // calories par semaine
  const weeklyProgress = advancedStats 
    ? Math.min((advancedStats.thisWeek.calories / weeklyGoal) * 100, 100)
    : 0;

  const handleSave = async () => {
    // Validation
    const errors = validateProfile(form);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile(form);
      showSuccess("Profil mis à jour", "Vos informations ont été modifiées avec succès");
      setEditing(false);
      setFormErrors({});
    } catch (err) {
      handleError(err, "Erreur lors de la mise à jour");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== "SUPPRIMER") {
      showError("Confirmation requise", "Veuillez taper 'SUPPRIMER' pour confirmer");
      return;
    }

    try {
      await deleteProfile();
      router.push("/auth");
    } catch (err) {
      handleError(err, "Erreur lors de la suppression");
    }
  };

  const handleExportData = () => {
    const data = {
      profile,
      stats,
      workouts: workouts.map(w => ({
        type: w.type,
        duration: w.duration,
        calories: w.calories,
        date: w.created_at,
      })),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wallfit-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccess("Données exportées", "Vos données ont été téléchargées avec succès");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center">
            <Spinner size="lg" text="Chargement du profil..." />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
          <div className="max-w-md w-full">
            <Alert variant="danger" title="Erreur">
              <p className="mb-4">{error}</p>
              <Button
                onClick={() => {
                  fetchProfile();
                }}
                variant="primary"
                size="sm"
              >
                Réessayer
              </Button>
            </Alert>
          </div>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center">
            <Spinner size="lg" text="Création du profil..." />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <ProfileEditHandler onEditChange={setEditing} />
      </Suspense>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="ghost"
              size="sm"
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au tableau de bord
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
                  Mon Profil
                </h1>
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Gérez vos informations et consultez vos statistiques
                </p>
              </div>
              {!editing && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleExportData}
                    variant="secondary"
                    size="sm"
                  >
                    <Download className="w-4 h-4" />
                    Exporter
                  </Button>
                  <Button
                    onClick={() => setEditing(true)}
                    variant="primary"
                    size="sm"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Header Card */}
          <Card className="mb-8">
            <div className="bg-gray-900 dark:bg-gray-100 p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <Avatar
                    src={form.avatar_url || profile.avatar_url}
                    alt={profile.username || "Utilisateur"}
                    name={profile.username || "Utilisateur"}
                    size="xl"
                    className="border-4 border-white dark:border-gray-800 shadow-2xl"
                  />
                  {editing && (
                    <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-900 rounded-full p-2 border-4 border-white dark:border-gray-100 shadow-lg">
                      <Edit className="w-4 h-4 text-gray-900 dark:text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-extrabold text-white dark:text-gray-900 mb-2 uppercase tracking-wide">
                    {profile.username || form.username || "Utilisateur"}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/80 dark:text-gray-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm font-semibold">{userEmail}</span>
                    </div>
                    {profile.created_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          Membre depuis {formatDate(profile.created_at)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Avatar URL Input */}
            {editing && (
              <CardContent padding="md">
                <div className="space-y-2">
                  <Input
                    label="URL de l'avatar"
                    type="text"
                    value={form.avatar_url}
                    onChange={(e) => {
                      setForm({ ...form, avatar_url: e.target.value });
                      setFormErrors({ ...formErrors, avatar_url: "" });
                    }}
                    placeholder="https://ui-avatars.com/api/?name=Nom"
                    error={formErrors.avatar_url}
                    icon={<User className="w-4 h-4" />}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Utilisez un service comme{" "}
                    <a
                      href="https://ui-avatars.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-gray-900 dark:hover:text-gray-100 inline-flex items-center gap-1"
                    >
                      UI Avatars
                      <ExternalLink className="w-3 h-3" />
                    </a>{" "}
                    ou{" "}
                    <a
                      href="https://dicebear.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-gray-900 dark:hover:text-gray-100 inline-flex items-center gap-1"
                    >
                      DiceBear
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card hover>
              <CardContent padding="md">
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3.5 rounded-2xl bg-gray-900 dark:bg-gray-100">
                    <Activity className="w-6 h-6 text-white dark:text-gray-900" />
                  </div>
                  <Badge variant="default" size="sm">
                    {stats.totalWorkouts}
                  </Badge>
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                  {stats.totalWorkouts}
                </h3>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Séances totales
                </p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent padding="md">
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3.5 rounded-2xl bg-gray-900 dark:bg-gray-100">
                    <Flame className="w-6 h-6 text-white dark:text-gray-900" />
                  </div>
                  <Badge variant="danger" size="sm">
                    {stats.totalCalories > 1000 ? `${(stats.totalCalories / 1000).toFixed(1)}k` : stats.totalCalories}
                  </Badge>
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                  {stats.totalCalories > 1000 ? `${(stats.totalCalories / 1000).toFixed(1)}k` : stats.totalCalories}
                </h3>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Calories totales
                </p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent padding="md">
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3.5 rounded-2xl bg-gray-900 dark:bg-gray-100">
                    <Clock className="w-6 h-6 text-white dark:text-gray-900" />
                  </div>
                  <Badge variant="info" size="sm">
                    {Math.round(stats.totalDuration / 60)}h
                  </Badge>
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                  {stats.totalDuration}
                </h3>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Minutes totales
                </p>
              </CardContent>
            </Card>

            <Card hover>
              <CardContent padding="md">
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3.5 rounded-2xl bg-gray-900 dark:bg-gray-100">
                    <TrendingUp className="w-6 h-6 text-white dark:text-gray-900" />
                  </div>
                  <Badge variant="success" size="sm">
                    {stats.avgCalories}
                  </Badge>
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                  {stats.avgCalories}
                </h3>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Calories moyennes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Stats */}
          {advancedStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Cette semaine
                  </CardTitle>
                </CardHeader>
                <CardContent padding="md">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Entraînements</span>
                      <span className="text-lg font-extrabold text-gray-900 dark:text-white">{advancedStats.thisWeek.workouts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Calories</span>
                      <span className="text-lg font-extrabold text-gray-900 dark:text-white">{advancedStats.thisWeek.calories}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Durée</span>
                      <span className="text-lg font-extrabold text-gray-900 dark:text-white">{advancedStats.thisWeek.duration} min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Ce mois
                  </CardTitle>
                </CardHeader>
                <CardContent padding="md">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Entraînements</span>
                      <span className="text-lg font-extrabold text-gray-900 dark:text-white">{advancedStats.thisMonth.workouts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Calories</span>
                      <span className="text-lg font-extrabold text-gray-900 dark:text-white">{advancedStats.thisMonth.calories}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Durée</span>
                      <span className="text-lg font-extrabold text-gray-900 dark:text-white">{advancedStats.thisMonth.duration} min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Statistiques
                  </CardTitle>
                </CardHeader>
                <CardContent padding="md">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Série</span>
                      <Badge variant="success">{advancedStats.streak} jours</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Type favori</span>
                      <span className="text-sm font-extrabold text-gray-900 dark:text-white">{advancedStats.mostCommonType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Durée moyenne</span>
                      <span className="text-sm font-extrabold text-gray-900 dark:text-white">{advancedStats.avgDuration} min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Weekly Goal Progress */}
          {advancedStats && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Objectif hebdomadaire
                </CardTitle>
                <CardDescription>
                  {advancedStats.thisWeek.calories} / {weeklyGoal} calories cette semaine
                </CardDescription>
              </CardHeader>
              <CardContent padding="md">
                <Progress
                  value={advancedStats.thisWeek.calories}
                  max={weeklyGoal}
                  variant={weeklyProgress >= 100 ? "success" : weeklyProgress >= 50 ? "warning" : "default"}
                  showValue
                  label="Progression"
                />
              </CardContent>
            </Card>
          )}

          {/* Edit Form */}
          {editing && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Modifier le profil</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent padding="md">
                <div className="space-y-6">
                  <Input
                    label="Nom d'utilisateur"
                    type="text"
                    value={form.username}
                    onChange={(e) => {
                      setForm({ ...form, username: e.target.value });
                      setFormErrors({ ...formErrors, username: "" });
                    }}
                    placeholder="Entrez votre nom d'utilisateur"
                    error={formErrors.username}
                    icon={<User className="w-4 h-4" />}
                  />
                  
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      variant="primary"
                      disabled={isSubmitting}
                      isLoading={isSubmitting}
                      className="flex-1"
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </Button>
                    <Button
                      onClick={() => {
                        setEditing(false);
                        setForm({ username: profile.username || "", avatar_url: profile.avatar_url || "" });
                        setFormErrors({});
                      }}
                      variant="secondary"
                      className="flex-1"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Workouts */}
          {recentWorkouts.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Entraînements récents
                </CardTitle>
                <CardDescription>
                  Vos 5 derniers entraînements
                </CardDescription>
              </CardHeader>
              <CardContent padding="md">
                <div className="space-y-3">
                  {recentWorkouts.map((workout) => (
                    <Card key={workout.id} hover={false}>
                      <CardContent padding="sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-gray-900 dark:bg-gray-100 rounded-lg">
                              <Activity className="w-5 h-5 text-white dark:text-gray-900" />
                            </div>
                            <div>
                              <p className="font-extrabold text-gray-900 dark:text-white">{workout.type}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <Badge variant="default" size="sm" className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {workout.duration} min
                                </Badge>
                                <Badge variant="danger" size="sm" className="flex items-center gap-1">
                                  <Flame className="w-3 h-3" />
                                  {workout.calories} kcal
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{workout.dateLabel}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {new Date(workout.created_at).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={() => router.push("/workouts")}
                    variant="ghost"
                    size="sm"
                    fullWidth
                  >
                    Voir tous les entraînements
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Danger Zone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5" />
                Zone de danger
              </CardTitle>
              <CardDescription>
                Actions irréversibles sur votre compte
              </CardDescription>
            </CardHeader>
            <CardContent padding="md">
              <Alert variant="danger" title="Attention">
                La suppression de votre compte est permanente et supprimera toutes vos données, y compris vos entraînements.
              </Alert>
              <div className="mt-4">
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  variant="danger"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer le compte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirmText("");
        }}
        title="Supprimer le compte"
        size="md"
        footer={
          <>
            <Button
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmText("");
              }}
              variant="secondary"
            >
              Annuler
            </Button>
            <Button
              onClick={handleDelete}
              variant="danger"
              disabled={deleteConfirmText !== "SUPPRIMER"}
            >
              <Trash2 className="w-4 h-4" />
              Supprimer définitivement
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Alert variant="danger" title="Action irréversible">
            Cette action supprimera définitivement votre compte et toutes vos données. Cette action ne peut pas être annulée.
          </Alert>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Pour confirmer, tapez <span className="font-extrabold text-red-600 dark:text-red-400">SUPPRIMER</span> :
            </label>
            <Input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="SUPPRIMER"
              className="font-mono"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

