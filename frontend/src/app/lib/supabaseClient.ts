import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Valeurs par défaut (utilisées si les variables d'environnement ne sont pas chargées lors du build)
const DEFAULT_SUPABASE_URL = 'https://jmachbgaabzuuxqxkumv.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptYWNoYmdhYWJ6dXV4cXhrdW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMDQyMDksImV4cCI6MjA3Nzc4MDIwOX0.teC77vBVv63GdHgHWDKhVOPmKGCLFTJMFmaKiqS26Jc';

// Récupérer les variables d'environnement avec fallback sur les valeurs par défaut
// Cela garantit que le client peut toujours être créé, même lors du build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Créer et exporter le client Supabase
// Les valeurs par défaut seront utilisées si les variables d'environnement ne sont pas chargées
// En production, les variables d'environnement seront toujours définies
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
