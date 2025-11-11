"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useGoals } from "@/hooks/useGoals";
import GoalCard from "@/components/goals/GoalCard";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import SkeletonLoader, { SkeletonCard } from "@/components/ui/SkeletonLoader";
import { Goal, GoalType, GoalStatus } from "@/types";
import { Plus, Target, ArrowLeft, Trash2 } from "lucide-react";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { useNotifications } from "@/contexts/NotificationContext";

export default function GoalsPage() {
  const router = useRouter();
  const { goals, loading, error, addGoal, updateGoal, deleteGoal, getActiveGoals, getCompletedGoals } = useGoals();
  const { showSuccess } = useNotifications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [form, setForm] = useState({
    type: "calories" as GoalType,
    target_value: "",
    deadline: "",
    title: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const activeGoals = getActiveGoals();
  const completedGoals = getCompletedGoals();

  const handleOpenModal = (goal?: Goal) => {
    if (goal) {
      setEditingGoal(goal);
      setForm({
        type: goal.type,
        target_value: goal.target_value.toString(),
        deadline: goal.deadline ? new Date(goal.deadline).toISOString().split("T")[0] : "",
        title: goal.title || "",
        description: goal.description || "",
      });
    } else {
      setEditingGoal(null);
      setForm({
        type: "calories",
        target_value: "",
        deadline: "",
        title: "",
        description: "",
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
    setForm({
      type: "calories",
      target_value: "",
      deadline: "",
      title: "",
      description: "",
    });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.target_value || isNaN(Number(form.target_value)) || Number(form.target_value) <= 0) {
      errors.target_value = "La valeur cible doit être un nombre positif";
    }

    if (form.deadline && new Date(form.deadline) < new Date()) {
      errors.deadline = "La date d'échéance ne peut pas être dans le passé";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const goalData = {
        type: form.type,
        target_value: Number(form.target_value),
        deadline: form.deadline || null,
        title: form.title || null,
        description: form.description || null,
        status: "active" as GoalStatus,
      };

      if (editingGoal) {
        await updateGoal(editingGoal.id, goalData);
        showSuccess("Objectif mis à jour", "Les modifications ont été enregistrées");
      } else {
        await addGoal(goalData);
        showSuccess("Objectif créé", "Votre nouvel objectif a été défini avec succès");
      }

      handleCloseModal();
    } catch (error) {
      // L'erreur est déjà gérée par le hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (goalId: string) => {
    setDeleteConfirmId(goalId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    
    const idToDelete = deleteConfirmId;
    setDeleteConfirmId(null);
    setDeletingId(idToDelete);
    
    setTimeout(async () => {
      try {
        await deleteGoal(idToDelete);
        setDeletingId(null);
      } catch (error) {
        setDeletingId(null);
        // L'erreur est déjà gérée par le hook
      }
    }, 300);
  };

  const goalTypeOptions = [
    { value: "calories", label: "Calories" },
    { value: "workouts", label: "Entraînements" },
    { value: "duration", label: "Durée (minutes)" },
    { value: "streak", label: "Série (jours)" },
    { value: "weight", label: "Poids (kg)" },
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
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
          <Alert variant="danger" title="Erreur">
            {error}
          </Alert>
        </div>
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
                  Mes Objectifs
                </h1>
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Définissez et suivez vos objectifs fitness
                </p>
              </div>
              <Button onClick={() => handleOpenModal()} variant="primary" size="sm">
                <Plus className="w-4 h-4" />
                Nouvel objectif
              </Button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Objectifs actifs
                </CardTitle>
                <CardDescription>{activeGoals.length} objectif(s) en cours</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Objectifs complétés</CardTitle>
                <CardDescription>{completedGoals.length} objectif(s) atteint(s)</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total</CardTitle>
                <CardDescription>{goals.length} objectif(s) au total</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
                Objectifs actifs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeGoals.filter(g => deletingId !== g.id).map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={handleOpenModal}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
                Objectifs complétés
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedGoals.filter(g => deletingId !== g.id).map((goal) => (
                  <GoalCard key={goal.id} goal={goal} showActions={false} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {goals.length === 0 && (
            <Card>
              <CardContent padding="lg" className="text-center py-12">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
                  Aucun objectif défini
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Créez votre premier objectif pour commencer à suivre votre progression !
                </p>
                <Button onClick={() => handleOpenModal()} variant="primary">
                  <Plus className="w-4 h-4" />
                  Créer un objectif
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal pour créer/modifier un objectif */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingGoal ? "Modifier l'objectif" : "Nouvel objectif"}
        size="md"
        footer={
          <>
            <Button onClick={handleCloseModal} variant="secondary">
              Annuler
            </Button>
            <Button onClick={handleSubmit} variant="primary" disabled={isSubmitting} isLoading={isSubmitting}>
              {editingGoal ? "Enregistrer" : "Créer"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Titre (optionnel)"
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: Perdre 5kg en 2 mois"
          />

          <div>
            <Select
              label="Type d'objectif"
              value={form.type}
              onChange={(value) => setForm({ ...form, type: value as GoalType })}
              options={goalTypeOptions}
            />
          </div>

          <Input
            label="Valeur cible"
            type="number"
            value={form.target_value}
            onChange={(e) => {
              setForm({ ...form, target_value: e.target.value });
              setFormErrors({ ...formErrors, target_value: "" });
            }}
            placeholder="Ex: 3000"
            error={formErrors.target_value}
            required
          />

          <Input
            label="Date d'échéance (optionnel)"
            type="date"
            value={form.deadline}
            onChange={(e) => {
              setForm({ ...form, deadline: e.target.value });
              setFormErrors({ ...formErrors, deadline: "" });
            }}
            error={formErrors.deadline}
            min={new Date().toISOString().split("T")[0]}
          />

          <div>
            <label className="block text-sm font-extrabold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Description (optionnel)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Décrivez votre objectif..."
              rows={4}
              className="w-full px-5 py-4 border-2 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-gray-900 dark:focus:border-gray-100 transition border-gray-300 dark:border-gray-600"
            />
          </div>
        </form>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirmer la suppression"
        size="sm"
        footer={
          <>
            <Button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              variant="secondary"
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              variant="danger"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
            Êtes-vous sûr de vouloir supprimer cet objectif ?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Cette action est irréversible et l'objectif sera définitivement supprimé.
          </p>
        </div>
      </Modal>
    </>
  );
}

