"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "@/components/Navbar";
import { 
  Plus, Edit, Trash2, Save, X, ArrowLeft, Dumbbell, Clock, Flame, Calendar, 
  Search, Filter, SortAsc, SortDesc, Grid, List, Download, TrendingUp, Activity
} from "lucide-react";
import { useWorkouts } from "@/hooks/useWorkouts";
import { supabase } from "@/app/lib/supabaseClient";
import { Workout } from "@/types";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Alert from "@/components/ui/Alert";
import Loading from "@/components/ui/Loading";
import { handleError } from "@/utils/errorHandler";

type SortOption = "date-desc" | "date-asc" | "calories-desc" | "calories-asc" | "duration-desc" | "duration-asc";
type ViewMode = "list" | "grid";

export default function WorkoutsPage() {
  const router = useRouter();
  const { workouts, loading, updateWorkout, deleteWorkout, fetchWorkouts } = useWorkouts();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ type: "", duration: "", calories: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");

  // Calculer les statistiques
  const stats = useMemo(() => {
    const total = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const avgCalories = total > 0 ? Math.round(totalCalories / total) : 0;
    const avgDuration = total > 0 ? Math.round(totalDuration / total) : 0;
    
    // Types uniques
    const types = Array.from(new Set(workouts.map(w => w.type)));
    
    return { total, totalCalories, totalDuration, avgCalories, avgDuration, types };
  }, [workouts]);

  // Filtrer et trier les entraînements
  const filteredAndSortedWorkouts = useMemo(() => {
    let filtered = [...workouts];

    // Recherche
    if (searchQuery) {
      filtered = filtered.filter(w => 
        w.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par type
    if (filterType !== "all") {
      filtered = filtered.filter(w => w.type === filterType);
    }

    // Filtre par date
    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter(w => {
        const workoutDate = new Date(w.created_at);
        switch (dateFilter) {
          case "today":
            return workoutDate.toDateString() === now.toDateString();
          case "week":
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return workoutDate >= weekAgo;
          case "month":
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return workoutDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "calories-desc":
          return b.calories - a.calories;
        case "calories-asc":
          return a.calories - b.calories;
        case "duration-desc":
          return b.duration - a.duration;
        case "duration-asc":
          return a.duration - b.duration;
        default:
          return 0;
      }
    });

    return filtered;
  }, [workouts, searchQuery, filterType, sortBy, dateFilter]);

  // Ajouter ou modifier un entraînement
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
    if (editingId) {
        await updateWorkout(editingId, {
          type: form.type,
          duration: parseInt(form.duration),
          calories: parseInt(form.calories),
        });
        toast.success("✅ Entraînement mis à jour !");
      setEditingId(null);
    } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Utilisateur non authentifié");
        
      const { error } = await supabase.from("workouts").insert([
        {
          user_id: user.id,
          type: form.type,
          duration: parseInt(form.duration),
          calories: parseInt(form.calories),
        },
      ]);
        
        if (error) throw error;
        toast.success("✅ Entraînement ajouté !");
    }

    setForm({ type: "", duration: "", calories: "" });
      setIsModalOpen(false);
      await fetchWorkouts();
    } catch (error) {
      handleError(error, "Erreur lors de l'opération");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Supprimer un entraînement
  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet entraînement ? Cette action est irréversible.")) return;
    
    try {
      await deleteWorkout(id);
      toast.info("🗑️ Entraînement supprimé");
    } catch (error) {
      // Erreur déjà gérée par le hook
    }
  };

  // Commencer à éditer
  const startEdit = (w: Workout) => {
    setEditingId(w.id);
    setForm({
      type: w.type,
      duration: w.duration.toString(),
      calories: w.calories.toString(),
    });
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour ajouter
  const handleAddClick = () => {
    setEditingId(null);
    setForm({ type: "", duration: "", calories: "" });
    setIsModalOpen(true);
  };

  // Exporter en CSV
  const handleExportCSV = () => {
    const headers = ["Date", "Type", "Durée (min)", "Calories"];
    const rows = filteredAndSortedWorkouts.map(w => [
      new Date(w.created_at).toLocaleDateString("fr-FR"),
      w.type,
      w.duration.toString(),
      w.calories.toString(),
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `entrainements_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("📥 Fichier CSV téléchargé");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading />
      </>
    );
  }

  return (
    <>
      <Navbar />
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
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-3 uppercase tracking-wide">
                  <Dumbbell className="w-10 h-10" />
                  Mes entraînements
                </h1>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Gérez vos séances d'entraînement
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleExportCSV}
                  variant="secondary"
                  disabled={filteredAndSortedWorkouts.length === 0}
                >
                  <Download className="w-4 h-4" />
                  Exporter CSV
                </Button>
                <Button
                  onClick={handleAddClick}
                  variant="primary"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </Button>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card hover>
              <CardContent padding="sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-900 dark:bg-gray-100 rounded-xl">
                    <Activity className="w-5 h-5 text-white dark:text-gray-900" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Total
                    </p>
                    <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                      {stats.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card hover>
              <CardContent padding="sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-900 dark:bg-gray-100 rounded-xl">
                    <Flame className="w-5 h-5 text-white dark:text-gray-900" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Calories
                    </p>
                    <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                      {stats.totalCalories > 1000 ? `${(stats.totalCalories / 1000).toFixed(1)}k` : stats.totalCalories}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card hover>
              <CardContent padding="sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-900 dark:bg-gray-100 rounded-xl">
                    <Clock className="w-5 h-5 text-white dark:text-gray-900" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Durée
                    </p>
                    <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                      {stats.totalDuration}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card hover>
              <CardContent padding="sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-900 dark:bg-gray-100 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-white dark:text-gray-900" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Moyenne
                    </p>
                    <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                      {stats.avgCalories}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres et Recherche */}
          <Card className="mb-8">
            <CardContent padding="md">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Recherche */}
                <div className="md:col-span-2">
                  <Input
                    icon={<Search className="w-4 h-4" />}
                    placeholder="Rechercher par type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Filtre par type */}
                <div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 font-semibold"
                  >
                    <option value="all">Tous les types</option>
                    {stats.types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Filtre par date */}
                <div>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as any)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 font-semibold"
                  >
                    <option value="all">Toutes les dates</option>
                    <option value="today">Aujourd'hui</option>
                    <option value="week">7 derniers jours</option>
                    <option value="month">30 derniers jours</option>
                  </select>
                </div>
              </div>

              {/* Tri et Vue */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Trier par:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 font-semibold text-sm"
                  >
                    <option value="date-desc">Date (récent)</option>
                    <option value="date-asc">Date (ancien)</option>
                    <option value="calories-desc">Calories (↓)</option>
                    <option value="calories-asc">Calories (↑)</option>
                    <option value="duration-desc">Durée (↓)</option>
                    <option value="duration-asc">Durée (↑)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "list" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des entraînements */}
          {filteredAndSortedWorkouts.length === 0 ? (
            <Alert variant="info">
              {workouts.length === 0 
                ? "Aucun entraînement enregistré. Commencez par ajouter votre premier entraînement !"
                : "Aucun entraînement ne correspond à vos filtres."
              }
            </Alert>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
              {filteredAndSortedWorkouts.map((w) => (
                <Card key={w.id} hover className="cursor-pointer group">
                  <CardContent padding="md">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-900 dark:bg-gray-100 rounded-xl">
                          <Dumbbell className="w-5 h-5 text-white dark:text-gray-900" />
                        </div>
                        <div>
                          <h3 className="text-lg font-extrabold text-gray-900 dark:text-white uppercase tracking-wide">
                            {w.type}
                          </h3>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            {new Date(w.created_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(w);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(w.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="default" size="sm" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {w.duration} min
                      </Badge>
                      <Badge variant="danger" size="sm" className="flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {w.calories} cal
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Résultats */}
          {filteredAndSortedWorkouts.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Affichage de {filteredAndSortedWorkouts.length} sur {workouts.length} entraînement(s)
              </p>
            </div>
        )}
      </div>

        {/* Modal pour ajouter/modifier */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingId(null);
            setForm({ type: "", duration: "", calories: "" });
          }}
          title={editingId ? "Modifier l'entraînement" : "Ajouter un entraînement"}
          footer={
            <>
              <Button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingId(null);
                  setForm({ type: "", duration: "", calories: "" });
                }}
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
                {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingId ? "Enregistrer" : "Ajouter"}
              </Button>
            </>
          }
        >
          <form id="workout-form" onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Type d'entraînement"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              placeholder="Ex: Cardio, Musculation, Yoga..."
              required
            />
            <Input
              label="Durée (minutes)"
              type="number"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="45"
              min="1"
              required
            />
            <Input
              label="Calories brûlées"
              type="number"
              value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })}
              placeholder="320"
              min="1"
              required
            />
          </form>
        </Modal>

      {/* Floating Action Button for mobile */}
        <Button
          onClick={handleAddClick}
          className="fixed bottom-6 right-6 md:hidden z-50 rounded-full w-14 h-14 shadow-2xl"
          variant="primary"
          size="lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
    </div>
    </>
  );
}
