"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "./ui/Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              Oups ! Une erreur est survenue
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-semibold">
              {this.state.error?.message || "Une erreur inattendue s'est produite"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={this.handleReset}
                variant="primary"
                fullWidth
              >
                Réessayer
              </Button>
              <Button
                onClick={() => window.location.href = "/dashboard"}
                variant="secondary"
                fullWidth
              >
                Retour au dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

