"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, TrendingUp, Target, LogIn, UserPlus, RotateCcw, LogOut, Lock } from "lucide-react";
import Image from "next/image";
import logoImage from "@/assets/WAllFit.png";
import { supabase } from "@/app/lib/supabaseClient";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Program } from "@/types";
import Navbar from "@/components/Navbar";

// Programmes d'entraînements prédéfinis (copiés depuis programs/page.tsx)
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
    icon: BarChart3,
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
    icon: TrendingUp,
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
    icon: Target,
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
    icon: Target,
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

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const handleProgramClick = (programId: number) => {
    if (isAuthenticated) {
      router.push(`/programs`);
    } else {
      router.push("/auth");
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
      {isAuthenticated && <Navbar />}
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 max-w-4xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl shadow-2xl flex items-center justify-center">
            <Image 
              src={logoImage} 
              alt="W.ALLfit Logo" 
              width={140} 
              height={140}
              className="object-contain"
              priority
            />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 text-center tracking-tight text-rose-600 dark:text-rose-400 drop-shadow-2xl">
          W.ALLfit - Empowering Women Through Personalized Wellness
        </h1>
        <p className="text-sm sm:text-base lg:text-lg font-normal mb-10 text-center max-w-4xl mx-auto leading-relaxed text-gray-700 dark:text-gray-300">
          W.ALLfit is a digital wellness platform designed to empower women through personalized, science-based fitness and nutrition programs. By addressing the physiological and lifestyle differences often overlooked by traditional fitness apps, W.ALLfit helps women train smarter, nourish better, and stay consistent. The platform offers a holistic experience that blends data-driven insights, community support, and expert guidance, creating a safe and inspiring space where women can thrive physically and mentally.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          {!isAuthenticated && (
            <>
              <Link
                href="/auth"
                className="flex items-center justify-center gap-3 bg-rose-500 dark:bg-rose-600 text-white px-8 py-4 rounded-2xl font-extrabold hover:bg-rose-600 dark:hover:bg-rose-700 transition-all shadow-2xl hover:shadow-3xl text-center uppercase tracking-wide hover:scale-105 min-w-[200px]"
              >
                <LogIn className="w-6 h-6" />
                Se connecter
              </Link>
              <Link
                href="/auth"
                className="flex items-center justify-center gap-3 bg-transparent border-2 border-rose-500 dark:border-rose-400 text-rose-600 dark:text-rose-400 px-8 py-4 rounded-2xl font-extrabold hover:bg-rose-500 dark:hover:bg-rose-600 hover:text-white transition-all shadow-xl hover:shadow-2xl text-center uppercase tracking-wide hover:scale-105 min-w-[200px]"
              >
                <UserPlus className="w-6 h-6" />
                S'inscrire
              </Link>
              <Link
                href="/restore"
                className="flex items-center justify-center gap-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-extrabold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-xl hover:shadow-2xl text-center uppercase tracking-wide hover:scale-105 min-w-[200px]"
              >
                <RotateCcw className="w-6 h-6" />
                Restaurer compte
              </Link>
            </>
          )} 
        </div>
      </div>

      {/* Features preview */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center border-2 border-rose-100 dark:border-rose-900/30 shadow-2xl hover:shadow-3xl transition-all hover:scale-105">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-rose-500 dark:bg-rose-600 rounded-2xl">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold mb-3 uppercase tracking-wide text-gray-900 dark:text-white">Suivi des statistiques</h3>
          <p className="text-base font-semibold text-gray-600 dark:text-gray-400 leading-relaxed">Calories brûlées, durée d'entraînement, progression du poids</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center border-2 border-rose-100 dark:border-rose-900/30 shadow-2xl hover:shadow-3xl transition-all hover:scale-105">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-rose-500 dark:bg-rose-600 rounded-2xl">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold mb-3 uppercase tracking-wide text-gray-900 dark:text-white">Graphiques intelligents</h3>
          <p className="text-base font-semibold text-gray-600 dark:text-gray-400 leading-relaxed">Visualisez votre évolution semaine par semaine</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center border-2 border-rose-100 dark:border-rose-900/30 shadow-2xl hover:shadow-3xl transition-all hover:scale-105">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-rose-500 dark:bg-rose-600 rounded-2xl">
              <Target className="w-10 h-10 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold mb-3 uppercase tracking-wide text-gray-900 dark:text-white">Objectifs personnalisés</h3>
          <p className="text-base font-semibold text-gray-600 dark:text-gray-400 leading-relaxed">Perte de poids, gain musculaire ou maintien</p>
        </div>
      </div>

      {/* Programmes d'entraînements */}
      <div className="mt-20 w-full max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold mb-4 text-gray-900 dark:text-white uppercase tracking-wide">
            Nos Programmes
          </h2>
          <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {isAuthenticated ? "Choisissez votre programme d'entraînement" : "Connectez-vous pour accéder aux programmes"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROGRAMS.map((program) => {
            const IconComponent = program.icon;
            return (
              <Card
                key={program.id}
                hover
                className={`cursor-pointer transition-all ${!isAuthenticated ? 'opacity-75' : ''}`}
                onClick={() => handleProgramClick(program.id)}
              >
                <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-5 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className="w-8 h-8" />
                    <h3 className="text-lg font-extrabold uppercase tracking-wide flex-1 line-clamp-1">
                      {program.title}
                    </h3>
                  </div>
                  <p className="text-xs font-semibold opacity-90 line-clamp-2">
                    {program.description}
                  </p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={getDifficultyBadgeVariant(program.difficulty)} size="sm">
                      {program.difficulty}
                    </Badge>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {program.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-400">
                    <span>{program.sessions}</span>
                    <span>{program.exercises.length} exercices</span>
                  </div>
                  {!isAuthenticated && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <Lock className="w-4 h-4" />
                      <span>Connectez-vous pour accéder</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
}
