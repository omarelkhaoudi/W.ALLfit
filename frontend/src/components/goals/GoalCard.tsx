"use client";

import { Goal } from "@/types";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Progress from "@/components/ui/Progress";
import Badge from "@/components/ui/Badge";
import { Target, Calendar, TrendingUp, CheckCircle2, XCircle, Pause } from "lucide-react";
// Fonction pour formater la date en français
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  showActions?: boolean;
}

const goalTypeLabels: Record<string, string> = {
  calories: "Calories",
  workouts: "Entraînements",
  weight: "Poids",
  duration: "Durée (min)",
  streak: "Série (jours)",
};

const statusConfig = {
  active: { icon: TrendingUp, variant: "default" as const, label: "Actif" },
  completed: { icon: CheckCircle2, variant: "success" as const, label: "Complété" },
  failed: { icon: XCircle, variant: "danger" as const, label: "Échoué" },
  paused: { icon: Pause, variant: "warning" as const, label: "En pause" },
};

export default function GoalCard({ goal, onEdit, onDelete, showActions = true }: GoalCardProps) {
  const progress = goal.target_value > 0 
    ? Math.min((goal.current_value / goal.target_value) * 100, 100)
    : 0;

  const StatusIcon = statusConfig[goal.status].icon;
  const statusVariant = statusConfig[goal.status].variant;
  const statusLabel = statusConfig[goal.status].label;

  const isCompleted = goal.status === "completed";
  const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && !isCompleted;

  return (
    <Card hover={!isCompleted} className={isCompleted ? "opacity-75" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-gray-900 dark:bg-gray-100 rounded-lg">
              <Target className="w-5 h-5 text-white dark:text-gray-900" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-extrabold">
                {goal.title || `Objectif ${goalTypeLabels[goal.type] || goal.type}`}
              </CardTitle>
              {goal.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {goal.description}
                </p>
              )}
            </div>
          </div>
          <Badge variant={statusVariant} size="sm">
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent padding="md">
        <div className="space-y-4">
          {/* Progression */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Progression
              </span>
              <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress
              value={goal.current_value}
              max={goal.target_value}
              variant={
                isCompleted
                  ? "success"
                  : isOverdue
                  ? "danger"
                  : progress >= 75
                  ? "success"
                  : progress >= 50
                  ? "warning"
                  : "default"
              }
              showValue={false}
            />
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>
                {goal.current_value.toLocaleString()} / {goal.target_value.toLocaleString()}{" "}
                {goalTypeLabels[goal.type] || goal.type}
              </span>
              <span>
                {goal.target_value - goal.current_value > 0
                  ? `${(goal.target_value - goal.current_value).toLocaleString()} restants`
                  : "Objectif atteint ! 🎉"}
              </span>
            </div>
          </div>

          {/* Deadline */}
          {goal.deadline && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className={`font-semibold ${isOverdue ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`}>
                {isOverdue ? "Échéance dépassée" : `Échéance: ${formatDate(goal.deadline)}`}
              </span>
            </div>
          )}

          {/* Actions */}
          {showActions && !isCompleted && (
            <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              {onEdit && (
                <button
                  onClick={() => onEdit(goal)}
                  className="flex-1 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Modifier
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(goal.id)}
                  className="flex-1 px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  Supprimer
                </button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

