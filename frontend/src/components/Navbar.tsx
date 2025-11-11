"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { LayoutDashboard, Dumbbell, BookOpen, User, LogOut, Target, Scale } from "lucide-react";
import Image from "next/image";
import imgTs from "@/assets/WAllFit.png";


export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // Ne pas afficher la Navbar sur la landing page SAUF si l'utilisateur est authentifié
  if (pathname === "/" && !isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Entraînements", href: "/workouts", icon: Dumbbell },
    { name: "Programmes", href: "/programs", icon: BookOpen },
    { name: "Objectifs", href: "/goals", icon: Target },
    { name: "Poids", href: "/weight", icon: Scale },
    { name: "Profil", href: "/profile", icon: User },
  ];

  // Logo pointe vers /dashboard si authentifié, sinon vers /
  // const logoHref = isAuthenticated ? "/dashboard" : "/";

  return (
    <nav className="bg-white backdrop-blur-md shadow-md border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href={"/"} className="flex items-center gap-2 group">
          <div className="rounded-lg group-hover:scale-105 transition-transform flex items-center justify-center">
            <Image 
              src={imgTs} 
              alt="W.ALLfit Logo" 
              width={60} 
              height={60}
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Navigation Links - Centré */}
        <div className="hidden md:flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all group ${
                  isActive
                    ? "bg-rose-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                }`}
                title={link.name}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-600 group-hover:text-rose-600"}`} />
                <span className="font-semibold text-sm tracking-wide">{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-rose-500 text-white px-4 py-2.5 rounded-lg hover:bg-rose-600 transition-all font-semibold text-sm shadow-lg hover:shadow-xl"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden xl:inline">Logout</span>
          </button>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
              <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
