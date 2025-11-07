"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Dumbbell, Heart, Flame, Target, Zap, TrendingUp, Clock, Calendar, Search, ArrowLeft, Info, Activity } from "lucide-react";
import { toast } from "react-toastify";
import { supabase } from "@/app/lib/supabaseClient";
import { Program } from "@/types";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Alert from "@/components/ui/Alert";
import { handleError } from "@/utils/errorHandler";
import { estimateCalories } from "@/utils/validation";

// Programmes d'entraînements prédéfinis
const PROGRAMS: Program[] = [
  {
    id: 1,
    title: "Programme Perte de Poids",
    description: "Programme complet pour perdre du poids de manière saine et efficace",
    icon: Target,
    color: "bg-gray-900 dark:bg-gray-100",
    duration: "8 semaines",
    sessions: "5 séances/semaine",
    difficulty: "Intermédiaire",
    calories: "2500-3000 cal/semaine",
    exercises: [
      "Cardio HIIT (30 min)",
      "Musculation légère (45 min)",
      "Yoga/Récupération (30 min)",
      "Cardio modéré (45 min)",
      "Full body (40 min)"
    ]
  },
  {
    id: 2,
    title: "Programme Musculation",
    description: "Développez votre masse musculaire avec ce programme structuré",
    icon: Dumbbell,
    color: "bg-gray-900 dark:bg-gray-100",
    duration: "12 semaines",
    sessions: "4 séances/semaine",
    difficulty: "Avancé",
    calories: "3000-4000 cal/semaine",
    exercises: [
      "Pectoraux & Triceps (60 min)",
      "Dos & Biceps (60 min)",
      "Jambes & Fessiers (60 min)",
      "Épaules & Abdominaux (50 min)"
    ]
  },
  {
    id: 3,
    title: "Programme Cardio Intensif",
    description: "Améliorez votre endurance cardiovasculaire",
    icon: Heart,
    color: "bg-gray-900 dark:bg-gray-100",
    duration: "6 semaines",
    sessions: "6 séances/semaine",
    difficulty: "Avancé",
    calories: "3500-4500 cal/semaine",
    exercises: [
      "Course à pied (45 min)",
      "Vélo (60 min)",
      "Natation (45 min)",
      "HIIT Cardio (30 min)",
      "Rameur (40 min)",
      "Marche rapide (50 min)"
    ]
  },
  {
    id: 4,
    title: "Programme Débutant",
    description: "Commencez votre parcours fitness en douceur",
    icon: Zap,
    color: "bg-gray-900 dark:bg-gray-100",
    duration: "4 semaines",
    sessions: "3 séances/semaine",
    difficulty: "Débutant",
    calories: "1500-2000 cal/semaine",
    exercises: [
      "Échauffement & Cardio léger (30 min)",
      "Musculation complète (40 min)",
      "Étirements & Récupération (25 min)"
    ]
  },
  {
    id: 5,
    title: "Programme Full Body",
    description: "Entraînement complet du corps à chaque séance",
    icon: TrendingUp,
    color: "bg-gray-900 dark:bg-gray-100",
    duration: "10 semaines",
    sessions: "4 séances/semaine",
    difficulty: "Intermédiaire",
    calories: "2800-3500 cal/semaine",
    exercises: [
      "Full Body Circuit (50 min)",
      "Full Body HIIT (40 min)",
      "Full Body Force (55 min)",
      "Full Body Endurance (45 min)"
    ]
  },
  {
    id: 6,
    title: "Programme Récupération Active",
    description: "Maintien de la forme avec récupération optimale",
    icon: Heart,
    color: "bg-gray-900 dark:bg-gray-100",
    duration: "6 semaines",
    sessions: "3 séances/semaine",
    difficulty: "Tous niveaux",
    calories: "1200-1800 cal/semaine",
    exercises: [
      "Yoga doux (45 min)",
      "Pilates (40 min)",
      "Marche & Étirements (50 min)"
    ]
  }
];

type DifficultyFilter = "all" | "Débutant" | "Intermédiaire" | "Avancé" | "Tous niveaux";
type SortOption = "title" | "difficulty" | "duration" | "exercises";

export default function ProgramsPage() {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isAddingProgram, setIsAddingProgram] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("title");

  // Filtrer et trier les programmes
  const filteredAndSortedPrograms = useMemo(() => {
    let filtered = [...PROGRAMS];

    // Recherche
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par difficulté
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(p => p.difficulty === difficultyFilter);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "difficulty":
          const difficultyOrder: Record<string, number> = {
            "Débutant": 1,
            "Tous niveaux": 2,
            "Intermédiaire": 3,
            "Avancé": 4,
          };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case "duration":
          const aWeeks = parseInt(a.duration.match(/\d+/)?.[0] || "0");
          const bWeeks = parseInt(b.duration.match(/\d+/)?.[0] || "0");
          return aWeeks - bWeeks;
        case "exercises":
          return b.exercises.length - a.exercises.length;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, difficultyFilter, sortBy]);

  // Statistiques
  const stats = useMemo(() => {
    const total = PROGRAMS.length;
    const difficulties = Array.from(new Set(PROGRAMS.map(p => p.difficulty)));
    const totalExercises = PROGRAMS.reduce((sum, p) => sum + p.exercises.length, 0);
    const avgExercises = Math.round(totalExercises / total);
    
    return { total, difficulties, totalExercises, avgExercises };
  }, []);

  // Fonction pour ajouter un programme au planning
  const handleStartProgram = async (program: Program) => {
    setIsAddingProgram(program.id);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour commencer un programme");
        setIsAddingProgram(null);
        return;
      }

      // Analyser les exercices et les convertir en entraînements
      const workoutsToAdd = program.exercises.map((exercise) => {
        const match = exercise.match(/^(.+?)\s*\((\d+)\s*min\)$/);
        if (match) {
          const type = match[1].trim();
          const duration = parseInt(match[2]);
          const calories = estimateCalories(duration);
          
          return {
            user_id: user.id,
            type: type,
            duration: duration,
            calories: calories,
          };
        }
        return null;
      }).filter(Boolean);

      if (workoutsToAdd.length === 0) {
        toast.error("Erreur lors de l'analyse des exercices");
        setIsAddingProgram(null);
        return;
      }

      const { error } = await supabase
        .from("workouts")
        .insert(workoutsToAdd);

      if (error) {
        handleError(error, "Erreur lors de l'ajout du programme");
      } else {
        toast.success(`✅ Programme "${program.title}" ajouté avec ${workoutsToAdd.length} entraînements !`);
        toast.info("Consultez la page 'Mes entraînements' pour voir vos nouveaux entraînements");
        setTimeout(() => {
          router.push("/workouts");
        }, 2000);
      }
    } catch (error) {
      handleError(error, "Une erreur est survenue");
    } finally {
      setIsAddingProgram(null);
    }
  };

  const getDifficultyBadgeVariant = (difficulty: string): "default" | "success" | "warning" | "danger" => {
    switch (difficulty) {
      case "Débutant":
      case "Tous niveaux":
        return "success";
      case "Intermédiaire":
        return "warning";
      case "Avancé":
        return "danger";
      default:
        return "default";
    }
  };

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
            <div className="text-center mb-8">
              <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
                Programmes d'Entraînements
              </h1>
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Choisissez le programme qui correspond à vos objectifs
              </p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card hover>
              <CardContent padding="sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-900 dark:bg-gray-100 rounded-xl">
                    <Target className="w-5 h-5 text-white dark:text-gray-900" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Programmes
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
                    <Dumbbell className="w-5 h-5 text-white dark:text-gray-900" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Exercices
                    </p>
                    <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                      {stats.totalExercises}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card hover>
              <CardContent padding="sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-900 dark:bg-gray-100 rounded-xl">
                    <Activity className="w-5 h-5 text-white dark:text-gray-900" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Moyenne
                    </p>
                    <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                      {stats.avgExercises}
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
                      Niveaux
                    </p>
                    <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                      {stats.difficulties.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres et Recherche */}
          <Card className="mb-8">
            <CardContent padding="md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Recherche */}
                <div className="md:col-span-2">
                  <Input
                    icon={<Search className="w-4 h-4" />}
                    placeholder="Rechercher un programme..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Filtre par difficulté */}
                <div>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value as DifficultyFilter)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 font-semibold"
                  >
                    <option value="all">Tous les niveaux</option>
                    {stats.difficulties.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tri */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Trier par:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 font-semibold text-sm"
                >
                  <option value="title">Titre (A-Z)</option>
                  <option value="difficulty">Difficulté</option>
                  <option value="duration">Durée</option>
                  <option value="exercises">Nombre d'exercices</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Grid des programmes */}
          {filteredAndSortedPrograms.length === 0 ? (
            <Alert variant="info">
              Aucun programme ne correspond à vos critères de recherche.
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {filteredAndSortedPrograms.map((program) => {
                const IconComponent = program.icon;
                const isAdding = isAddingProgram === program.id;

                return (
                  <Card
                    key={program.id}
                    hover
                    className="cursor-pointer overflow-hidden"
                    onClick={() => setSelectedProgram(program)}
                  >
                    {/* Header */}
                    <div className={`${program.color} p-7 text-white dark:text-gray-900`}>
                      <div className="flex items-center gap-4 mb-3">
                        <IconComponent className="w-10 h-10" />
                        <h2 className="text-xl font-extrabold uppercase tracking-wide flex-1">
                          {program.title}
                        </h2>
                      </div>
                      <p className="text-sm font-semibold opacity-90">{program.description}</p>
                    </div>

                    {/* Informations du programme */}
                    <CardContent padding="md">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                          <Clock className="w-5 h-5" />
                          <span className="text-sm font-semibold">{program.duration}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                          <Calendar className="w-5 h-5" />
                          <span className="text-sm font-semibold">{program.sessions}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <Badge variant={getDifficultyBadgeVariant(program.difficulty)} size="sm">
                          {program.difficulty}
                        </Badge>
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                          <Flame className="w-4 h-4" />
                          {program.calories}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-4">
                        <span>{program.exercises.length} exercices</span>
                        <span className="flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          Cliquez pour voir les détails
                        </span>
                      </div>

                      <Button
                        variant="primary"
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartProgram(program);
                        }}
                        disabled={isAdding}
                        isLoading={isAdding}
                      >
                        {isAdding ? "Ajout en cours..." : "Commencer ce programme"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Résultats */}
          {filteredAndSortedPrograms.length > 0 && (
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Affichage de {filteredAndSortedPrograms.length} sur {PROGRAMS.length} programme(s)
              </p>
            </div>
          )}

          {/* Info box */}
          <Card>
            <CardContent padding="md">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-900 dark:bg-gray-100 rounded-xl">
                  <Info className="w-6 h-6 text-white dark:text-gray-900" />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 dark:text-white mb-2 uppercase tracking-wide text-lg">
                    💡 Conseil
                  </h3>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-relaxed">
                    Cliquez sur un programme pour voir les détails. Choisissez un programme adapté à votre niveau et à vos objectifs. 
                    N'oubliez pas de consulter un professionnel de santé avant de commencer un nouveau programme d'entraînement.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal pour les détails du programme */}
        {selectedProgram && (
          <Modal
            isOpen={!!selectedProgram}
            onClose={() => setSelectedProgram(null)}
            title={selectedProgram.title}
            size="lg"
            footer={
              <Button
                onClick={() => {
                  handleStartProgram(selectedProgram);
                  setSelectedProgram(null);
                }}
                disabled={isAddingProgram === selectedProgram.id}
                isLoading={isAddingProgram === selectedProgram.id}
                variant="primary"
                fullWidth
              >
                Commencer ce programme
              </Button>
            }
          >
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">
                  {selectedProgram.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Durée
                    </p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">
                      {selectedProgram.duration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Séances
                    </p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">
                      {selectedProgram.sessions}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <Badge variant={getDifficultyBadgeVariant(selectedProgram.difficulty)}>
                    {selectedProgram.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <Flame className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Calories
                    </p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">
                      {selectedProgram.calories}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
                  Plan d'entraînement :
                </h3>
                <div className="space-y-3">
                  {selectedProgram.exercises.map((exercise, idx) => (
                    <Card key={idx} hover={false}>
                      <CardContent padding="sm">
                        <div className="flex items-start gap-3">
                          <Badge variant="default" size="sm">
                            {idx + 1}
                          </Badge>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex-1">
                            {exercise}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}
