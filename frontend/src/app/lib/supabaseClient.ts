import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Récupérer les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fonction pour créer le client Supabase
function getSupabaseClient(): SupabaseClient {
  // Si les variables ne sont pas définies, on utilise des valeurs par défaut pour le build
  // Ces valeurs ne seront jamais utilisées en runtime car les variables seront définies
  const url = supabaseUrl || 'https://jmachbgaabzuuxqxkumv.supabase.co';
  const key = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptYWNoYmdhYWJ6dXV4cXhrdW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDQyMDksImV4cCI6MjA3Nzc4MDIwOX0.teC77vBVv63GdHgHWDKhVOPmKGCLFTJMFmaKiqS26Jc';
  
  return createClient(url, key);
}

// Créer et exporter l'instance
export const supabase = getSupabaseClient();
