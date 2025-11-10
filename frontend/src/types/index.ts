// Types pour l'application W.ALLfit

export interface User {
  id: string;
  email?: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  username?: string | null;
  avatar_url?: string | null;
  weight?: number | null;
  taille?: number | null;
  goal?: string | null;
  activity_level?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Workout {
  id: string;
  user_id: string;
  type: string;
  duration: number;
  calories: number;
  created_at: string;
  updated_at?: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalCalories: number;
  totalDuration: number;
  avgCalories: number;
}

export interface Program {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  duration: string;
  sessions: string;
  difficulty: string;
  calories: string;
  exercises: string[];
}

export interface FormErrors {
  [key: string]: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Système d'objectifs (Goals)
export type GoalType = "calories" | "workouts" | "weight" | "duration" | "streak";
export type GoalStatus = "active" | "completed" | "failed" | "paused";

export interface Goal {
  id: string;
  user_id: string;
  type: GoalType;
  target_value: number;
  current_value: number;
  deadline?: string | null;
  status: GoalStatus;
  title?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

// Historique de poids
export interface WeightEntry {
  id: string;
  user_id: string;
  weight: number;
  date: string;
  notes?: string | null;
  created_at: string;
}

