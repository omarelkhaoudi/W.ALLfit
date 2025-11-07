"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/app/lib/supabaseClient";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { AlertCircle, X } from "lucide-react";
import { toast } from "react-toastify";
import logoImage from "@/assets/WAllFit.png";

function AuthErrorHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier les erreurs OAuth dans l'URL
    const errorParam = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (errorParam) {
      let errorMessage = "Une erreur est survenue lors de la connexion.";
      
      switch (errorParam) {
        case "exchange_failed":
          errorMessage = "Erreur lors de l'échange du code d'authentification. Veuillez réessayer.";
          break;
        case "callback_exception":
          errorMessage = "Erreur lors du callback. Veuillez réessayer.";
          break;
        case "access_denied":
          errorMessage = "Accès refusé. Vous devez autoriser l'application.";
          break;
        default:
          errorMessage = errorDescription || errorMessage;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Nettoyer l'URL
      router.replace("/auth");
    }
  }, [searchParams, router]);

  if (!error) return null;

  return (
    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-red-800 dark:text-red-300">
          {error}
        </p>
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
          Vérifiez votre configuration Google OAuth ou réessayez plus tard.
        </p>
      </div>
      <button
        onClick={() => setError(null)}
        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition"
        aria-label="Fermer l'erreur"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function AuthPage() {
  const redirectTo =
    typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted && session?.user) {
        router.replace("/dashboard");
      }
    });
    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        try { sessionStorage.setItem("loginSuccess", "1"); } catch {}
        router.replace("/dashboard");
      }
    });
    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-2 rounded-2xl shadow-xl mb-4 flex items-center justify-center">
            <Image 
              src={logoImage} 
              alt="W.ALLfit Logo" 
              width={90} 
              height={90}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-extrabold text-center mb-2 text-gray-900 dark:text-white tracking-tight">
            W.ALLfit
          </h1>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Votre partenaire fitness
          </p>
        </div>

        {/* Error Message */}
        <Suspense fallback={null}>
          <AuthErrorHandler />
        </Suspense>

        {/* Auth Form */}
        <div className="[&_.supabase-auth-ui_*]:!rounded-2xl [&_.supabase-auth-ui_*]:!font-semibold [&_.supabase-auth-ui_*]:!tracking-wide [&_input]:!px-5 [&_input]:!py-4 [&_input]:!border-2 [&_input]:!rounded-2xl [&_input]:!text-sm [&_button]:!px-6 [&_button]:!py-4 [&_button]:!rounded-2xl [&_button]:!font-extrabold [&_button]:!uppercase [&_button]:!tracking-wide [&_button]:!shadow-xl [&_button:hover]:!shadow-2xl [&_button:hover]:!scale-105 [&_button]:!transition-all">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#111827',
                    brandAccent: '#374151',
                  },
                  radii: {
                    borderRadiusButton: '1rem',
                    buttonBorderRadius: '1rem',
                    inputBorderRadius: '1rem',
                  },
                  fontSizes: {
                    baseBodySize: '14px',
                    baseInputSize: '14px',
                  },
                },
              },
            }}
            providers={["google"]}
            redirectTo={redirectTo}
            magicLink={false}
            localization={{
              variables: {
                sign_in: { 
                  email_label: "Email", 
                  password_label: "Mot de passe",
                  button_label: "Se connecter",
                },
                sign_up: {
                  button_label: "S'inscrire",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
