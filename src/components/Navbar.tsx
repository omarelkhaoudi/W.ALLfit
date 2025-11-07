"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { ThemeContext } from "@/contexts/ThemeContext";
import { LayoutDashboard, Dumbbell, BookOpen, User, Sun, Moon, LogOut } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Ne pas afficher la Navbar sur la landing page
  if (pathname === "/") {
    return null;
  }

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
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

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Mes entraînements", href: "/workouts", icon: Dumbbell },
    { name: "Programmes", href: "/programs", icon: BookOpen },
    { name: "Profil", href: "/profile", icon: User },
  ];

  // Logo pointe vers /dashboard si authentifié, sinon vers /
  const logoHref = isAuthenticated ? "/dashboard" : "/";

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6 sm:gap-10">
          {/* Logo */}
          <Link href={logoHref} className="flex items-center gap-3 group">
            <div className="p-1 rounded-2xl group-hover:scale-110 transition-transform flex items-center justify-center">
              <Image 
                src="/assets/WAllFit.png" 
                alt="W.ALLfit Logo" 
                width={80} 
                height={80}
                className="object-contain"
                priority
              />
            </div>
            <span className="font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight">
              W.ALLfit
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-3">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all group ${
                    isActive
                      ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white dark:text-gray-900" : "text-gray-600 dark:text-gray-400"}`} />
                  <span className="font-semibold text-sm tracking-wide uppercase">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-105"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl font-semibold tracking-wide hover:scale-105"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline text-sm uppercase">Déconnexion</span>
          </button>

          {/* Mobile Menu Button (optional for future) */}
          <div className="md:hidden">
            <button className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
