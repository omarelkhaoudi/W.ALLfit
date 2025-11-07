"use client";
import Link from "next/link";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Dumbbell, 
  BookOpen, 
  User, 
  Mail, 
  Github, 
  Twitter, 
  Linkedin,
  Instagram,
  Heart,
  ArrowUp
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigationLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Mes entraînements", href: "/workouts", icon: Dumbbell },
    { name: "Programmes", href: "/programs", icon: BookOpen },
    { name: "Profil", href: "/profile", icon: User },
  ];

  const usefulLinks = [
    { name: "À propos", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Mentions légales", href: "/legal" },
    { name: "Politique de confidentialité", href: "/privacy" },
    { name: "Conditions d'utilisation", href: "/terms" },
  ];

  const socialLinks = [
    { name: "GitHub", href: "https://github.com", icon: Github },
    { name: "Twitter", href: "https://twitter.com", icon: Twitter },
    { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
    { name: "Instagram", href: "https://instagram.com", icon: Instagram },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="p-1 rounded-2xl group-hover:scale-110 transition-transform">
                <Image 
                  src="/assets/WAllFit.png" 
                  alt="W.ALLfit Logo" 
                  width={60} 
                  height={60}
                  className="object-contain"
                />
              </div>
              <span className="font-extrabold text-2xl text-gray-900 dark:text-white tracking-tight">
                W.ALLfit
              </span>
            </Link>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 leading-relaxed">
              Suivez vos entraînements et votre progression fitness. 
              Application moderne pour gérer vos séances de sport et atteindre vos objectifs.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
              <Mail className="w-4 h-4" />
              <a 
                href="mailto:contact@wallfit.com" 
                className="hover:text-gray-900 dark:hover:text-gray-300 transition"
              >
                contact@wallfit.com
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-extrabold text-gray-900 dark:text-white mb-4 uppercase tracking-wide text-sm">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition group"
                    >
                      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="font-extrabold text-gray-900 dark:text-white mb-4 uppercase tracking-wide text-sm">
              Liens utiles
            </h3>
            <ul className="space-y-3">
              {usefulLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-extrabold text-gray-900 dark:text-white mb-4 uppercase tracking-wide text-sm">
              Suivez-nous
            </h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-900 dark:hover:bg-gray-100 border border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-100 transition-all group"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-white dark:group-hover:text-gray-900 transition" />
                  </a>
                );
              })}
            </div>
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 text-center">
                Fait avec <Heart className="w-3 h-3 inline text-red-500" /> pour votre santé
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 text-center md:text-left">
              <p>
                © {new Date().getFullYear()} <span className="font-extrabold text-gray-900 dark:text-white">W.ALLfit</span>. 
                Tous droits réservés.
              </p>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-500">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>Made with Next.js & Supabase</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-2xl shadow-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all hover:scale-110 z-50 border-2 border-gray-200 dark:border-gray-700"
          aria-label="Retour en haut"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
}

