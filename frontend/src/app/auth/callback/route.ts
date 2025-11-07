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
      redirectUrl.searchParams.set('error_description', errorDescription)
    }
    return NextResponse.redirect(redirectUrl)
  }

  if (code) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError)
        const redirectUrl = new URL('/auth', requestUrl.origin)
        redirectUrl.searchParams.set('error', 'exchange_failed')
        return NextResponse.redirect(redirectUrl)
      }
    } catch (err) {
      console.error('Exception during OAuth callback:', err)
      const redirectUrl = new URL('/auth', requestUrl.origin)
      redirectUrl.searchParams.set('error', 'callback_exception')
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Redirige vers le dashboard avec flag de succès
  const redirectUrl = new URL('/dashboard', requestUrl.origin)
  return NextResponse.redirect(redirectUrl)
}
