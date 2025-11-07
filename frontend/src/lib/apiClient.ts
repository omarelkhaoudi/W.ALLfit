// Client API pour communiquer avec le backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  // Récupérer le token depuis Supabase (pour l'authentification)
  const token = await getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: response.statusText,
      }));
      throw new ApiError(
        errorData.error || 'Erreur serveur',
        response.status,
        errorData.code
      );
    }

    // Si la réponse est vide (204), retourner null
    if (response.status === 204) {
      return null as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Erreur réseau',
      0
    );
  }
}

// Fonction pour récupérer le token d'authentification Supabase
async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  
  try {
    // Utiliser Supabase pour obtenir le token de session
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    if (!supabaseUrl || !supabaseAnonKey) return null;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { session } } = await supabase.auth.getSession();
    
    return session?.access_token || null;
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
}

// API Methods
export const api = {
  // Workouts
  workouts: {
    getAll: () => request<any[]>('/api/workouts'),
    create: (workout: { type: string; duration: number; calories: number }) =>
      request<any>('/api/workouts', {
        method: 'POST',
        body: JSON.stringify(workout),
      }),
    update: (id: string, updates: any) =>
      request<any>(`/api/workouts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),
    delete: (id: string) =>
      request<void>(`/api/workouts/${id}`, {
        method: 'DELETE',
      }),
  },

  // Profile
  profile: {
    get: () => request<{ profile: any; stats: any }>('/api/profile'),
    update: (updates: any) =>
      request<any>('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),
    delete: () =>
      request<void>('/api/profile', {
        method: 'DELETE',
      }),
  },

  // Auth
  auth: {
    getMe: () => request<any>('/api/auth/me'),
  },
};

