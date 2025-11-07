"use client";
import Link from "next/link";
import { BarChart3, TrendingUp, Target, LogIn, UserPlus, RotateCcw } from "lucide-react";
import Image from "next/image";

export default function Home() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 max-w-4xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl shadow-2xl flex items-center justify-center">
            <Image 
              src="/assets/WAllFit.png" 
              alt="W.ALLfit Logo" 
              width={140} 
              height={140}
              className="object-contain"
              priority
            />
          </div>
        </div>
        <h1 className="text-7xl font-extrabold mb-6 text-center tracking-tight text-gray-900 dark:text-white drop-shadow-2xl">
          W.ALLfit
        </h1>
        <p className="text-2xl font-semibold mb-4 text-center max-w-2xl mx-auto tracking-wide text-gray-700 dark:text-gray-300">
          Suivez vos entraînements, vos calories et votre progression en un seul endroit !
        </p>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-10 uppercase tracking-wide">
          Votre partenaire fitness au quotidien
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link
            href="/auth"
            className="flex items-center justify-center gap-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-extrabold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-2xl hover:shadow-3xl text-center uppercase tracking-wide hover:scale-105 min-w-[200px]"
          >
            <LogIn className="w-6 h-6" />
            Se connecter
          </Link>
          <Link
            href="/auth"
            className="flex items-center justify-center gap-3 bg-transparent border-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-extrabold hover:bg-gray-900 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900 transition-all shadow-xl hover:shadow-2xl text-center uppercase tracking-wide hover:scale-105 min-w-[200px]"
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
        </div>
      </div>

      {/* Features preview */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center border-2 border-gray-200 dark:border-gray-700 shadow-2xl hover:shadow-3xl transition-all hover:scale-105">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-900 dark:bg-gray-100 rounded-2xl">
              <BarChart3 className="w-10 h-10 text-white dark:text-gray-900" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold mb-3 uppercase tracking-wide text-gray-900 dark:text-white">Suivi des statistiques</h3>
          <p className="text-base font-semibold text-gray-600 dark:text-gray-400 leading-relaxed">Calories brûlées, durée d'entraînement, progression du poids</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center border-2 border-gray-200 dark:border-gray-700 shadow-2xl hover:shadow-3xl transition-all hover:scale-105">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-900 dark:bg-gray-100 rounded-2xl">
              <TrendingUp className="w-10 h-10 text-white dark:text-gray-900" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold mb-3 uppercase tracking-wide text-gray-900 dark:text-white">Graphiques intelligents</h3>
          <p className="text-base font-semibold text-gray-600 dark:text-gray-400 leading-relaxed">Visualisez votre évolution semaine par semaine</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center border-2 border-gray-200 dark:border-gray-700 shadow-2xl hover:shadow-3xl transition-all hover:scale-105">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gray-900 dark:bg-gray-100 rounded-2xl">
              <Target className="w-10 h-10 text-white dark:text-gray-900" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold mb-3 uppercase tracking-wide text-gray-900 dark:text-white">Objectifs personnalisés</h3>
          <p className="text-base font-semibold text-gray-600 dark:text-gray-400 leading-relaxed">Perte de poids, gain musculaire ou maintien</p>
        </div>
      </div>
    </div>
  );
}
