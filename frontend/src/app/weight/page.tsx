"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useWeightHistory } from "@/hooks/useWeightHistory";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Alert from "@/components/ui/Alert";
import Spinner from "@/components/ui/Spinner";
import SkeletonLoader, { SkeletonCard } from "@/components/ui/SkeletonLoader";
import { WeightEntry } from "@/types";
import { Plus, ArrowLeft, TrendingDown, TrendingUp, Minus, Edit, Trash2, Scale } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

export default function WeightHistoryPage() {
  const router = useRouter();
  const {
    entries,
    loading,
    error,
    addWeightEntry,
    updateWeightEntry,
    deleteWeightEntry,
    getLatestWeight,
    getWeightChange,
    getChartData,
  } = useWeightHistory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
  const [form, setForm] = useState({
    weight: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showSuccess } = useNotifications();

  const latestWeight = getLatestWeight();
  const weightChange = getWeightChange();
  const chartData = getChartData();

  const handleOpenModal = (entry?: WeightEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setForm({
        weight: entry.weight.toString(),
        date: entry.date.split("T")[0],
        notes: entry.notes || "",
      });
    } else {
      setEditingEntry(null);
      setForm({
        weight: latestWeight?.weight.toString() || "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
    setForm({
      weight: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.weight || isNaN(Number(form.weight)) || Number(form.weight) <= 0) {
      errors.weight = "Le poids doit être un nombre positif";
    }

    if (!form.date) {
      errors.date = "La date est requise";
    }

    if (form.date && new Date(form.date) > new Date()) {
      errors.date = "La date ne peut pas être dans le futur";
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
      if (editingEntry) {
        await updateWeightEntry(
          editingEntry.id,
          Number(form.weight),
          form.date,
          form.notes
        );
        showSuccess("Poids mis à jour", "Les modifications ont été enregistrées");
      } else {
        await addWeightEntry(Number(form.weight), form.date, form.notes);
        showSuccess("Poids enregistré", "Votre nouvelle mesure a été ajoutée");
      }

      handleCloseModal();
    } catch (error) {
      // L'erreur est déjà gérée par le hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    
    const idToDelete = deleteConfirmId;
    setDeleteConfirmId(null);
    setDeletingId(idToDelete);
    
    setTimeout(async () => {
      try {
        await deleteWeightEntry(idToDelete);
        setDeletingId(null);
      } catch (error) {
        setDeletingId(null);
        // L'erreur est déjà gérée par le hook
      }
    }, 300);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
            <SkeletonCard />
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
                  Historique de Poids
                </h1>
                <p className="text-lg font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Suivez l'évolution de votre poids dans le temps
                </p>
              </div>
              <Button onClick={() => handleOpenModal()} variant="primary" size="sm">
                <Plus className="w-4 h-4" />
                Ajouter un poids
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent padding="md">
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600">
                    <Scale className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                  {latestWeight ? `${latestWeight.weight} kg` : "N/A"}
                </h3>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Dernier poids
                </p>
              </CardContent>
            </Card>

            {weightChange && (
              <>
                <Card>
                  <CardContent padding="md">
                    <div className="flex items-center justify-between mb-5">
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600">
                        {weightChange.change > 0 ? (
                          <TrendingUp className="w-6 h-6 text-white" />
                        ) : weightChange.change < 0 ? (
                          <TrendingDown className="w-6 h-6 text-white" />
                        ) : (
                          <Minus className="w-6 h-6 text-white" />
                        )}
                      </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                      {weightChange.change > 0 ? "+" : ""}
                      {weightChange.change.toFixed(1)} kg
                    </h3>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Évolution totale
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent padding="md">
                    <div className="flex items-center justify-between mb-5">
                      <div className="p-3.5 rounded-2xl bg-gray-900 dark:bg-gray-100">
                        <Scale className="w-6 h-6 text-white dark:text-gray-900" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                      {entries.length}
                    </h3>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Entrées enregistrées
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Évolution du poids</CardTitle>
                <CardDescription>
                  Graphique montrant l'évolution de votre poids dans le temps
                </CardDescription>
              </CardHeader>
              <CardContent padding="md">
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                      label={{ value: "Poids (kg)", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke="#f43f5e"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorWeight)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Entries List */}
          {entries.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Historique complet</CardTitle>
                <CardDescription>
                  Toutes vos entrées de poids enregistrées
                </CardDescription>
              </CardHeader>
              <CardContent padding="md">
                <div className="space-y-3">
                  {entries.filter(e => deletingId !== e.id).map((entry) => {
                    const entryDate = new Date(entry.date);
                    const formattedDate = entryDate.toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    });

                    return (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg">
                            <Scale className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-extrabold text-gray-900 dark:text-white text-lg">
                              {entry.weight} kg
                            </p>
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                              {formattedDate}
                            </p>
                            {entry.notes && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {entry.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleOpenModal(entry)}
                            variant="secondary"
                            size="sm"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(entry.id)}
                            variant="danger"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent padding="lg" className="text-center py-12">
                <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
                  Aucun poids enregistré
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Commencez à suivre votre poids en ajoutant votre première entrée !
                </p>
                <Button onClick={() => handleOpenModal()} variant="primary">
                  <Plus className="w-4 h-4" />
                  Ajouter un poids
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal pour ajouter/modifier un poids */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEntry ? "Modifier le poids" : "Ajouter un poids"}
        size="md"
        footer={
          <>
            <Button onClick={handleCloseModal} variant="secondary">
              Annuler
            </Button>
            <Button onClick={handleSubmit} variant="primary" disabled={isSubmitting} isLoading={isSubmitting}>
              {editingEntry ? "Enregistrer" : "Ajouter"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Poids (kg)"
            type="number"
            step="0.1"
            value={form.weight}
            onChange={(e) => {
              setForm({ ...form, weight: e.target.value });
              setFormErrors({ ...formErrors, weight: "" });
            }}
            placeholder="Ex: 65.5"
            error={formErrors.weight}
            required
          />

          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => {
              setForm({ ...form, date: e.target.value });
              setFormErrors({ ...formErrors, date: "" });
            }}
            error={formErrors.date}
            max={new Date().toISOString().split("T")[0]}
            required
          />

          <div>
            <label className="block text-sm font-extrabold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Notes (optionnel)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Ajoutez des notes sur cette mesure..."
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
            Êtes-vous sûr de vouloir supprimer cette entrée de poids ?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Cette action est irréversible et l'entrée sera définitivement supprimée.
          </p>
        </div>
      </Modal>
    </>
  );
}

