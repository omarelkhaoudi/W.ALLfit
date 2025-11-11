import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Gérer les erreurs OAuth
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    const redirectUrl = new URL('/auth', requestUrl.origin)
    redirectUrl.searchParams.set('error', error)
    if (errorDescription) {
      redirectUrl.searchParams.set('error_description', encodeURIComponent(errorDescription))
    }
    return NextResponse.redirect(redirectUrl)
  }

  if (!code) {
    // Pas de code, rediriger vers auth avec erreur
    const redirectUrl = new URL('/auth', requestUrl.origin)
    redirectUrl.searchParams.set('error', 'no_code')
    redirectUrl.searchParams.set('error_description', 'Aucun code d\'autorisation reçu')
    return NextResponse.redirect(redirectUrl)
  }

  try {
    // Créer le client Supabase avec les variables d'environnement
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables')
      const redirectUrl = new URL('/auth', requestUrl.origin)
      redirectUrl.searchParams.set('error', 'configuration_error')
      redirectUrl.searchParams.set('error_description', 'Configuration Supabase manquante')
      return NextResponse.redirect(redirectUrl)
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
    
    // Échanger le code contre une session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      const redirectUrl = new URL('/auth', requestUrl.origin)
      redirectUrl.searchParams.set('error', 'exchange_failed')
      redirectUrl.searchParams.set('error_description', encodeURIComponent(exchangeError.message || 'Erreur lors de l\'échange du code'))
      return NextResponse.redirect(redirectUrl)
    }

    if (!data.session) {
      console.error('No session after code exchange')
      const redirectUrl = new URL('/auth', requestUrl.origin)
      redirectUrl.searchParams.set('error', 'no_session')
      redirectUrl.searchParams.set('error_description', 'Aucune session créée après l\'authentification')
      return NextResponse.redirect(redirectUrl)
    }

    // Succès - rediriger vers le dashboard
    const redirectUrl = new URL('/dashboard', requestUrl.origin)
    return NextResponse.redirect(redirectUrl)
  } catch (err) {
    console.error('Exception during OAuth callback:', err)
    const redirectUrl = new URL('/auth', requestUrl.origin)
    redirectUrl.searchParams.set('error', 'callback_exception')
    redirectUrl.searchParams.set('error_description', encodeURIComponent(err instanceof Error ? err.message : 'Erreur inconnue'))
    return NextResponse.redirect(redirectUrl)
  }
}
