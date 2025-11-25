/**
 * lib/supabaseClient.js 
 * This file starts the supabase instance. 
 * Essentialy the bridge between the front end 
 * and the supabase backend, so other files 
 * will communicate with this file.
 * 
 * Uses localStorage for client-side, but syncs to cookies for server-side access
 */

import { createClient } from '@supabase/supabase-js'

const supabaseURL = 'https://tokhxfjhspcmlhebafxi.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseURL, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Sync session to cookies for server-side access
// This runs whenever the auth state changes
if (typeof window !== 'undefined') {
  const projectRef = supabaseURL.split('//')[1]?.split('.')[0] || 'tokhxfjhspcmlhebafxi'
  const authCookieName = `sb-${projectRef}-auth-token`

  // Listen for auth state changes and sync to cookies
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      // Store session in cookie for server-side access
      const expires = new Date()
      expires.setFullYear(expires.getFullYear() + 1)
      document.cookie = `${authCookieName}=${encodeURIComponent(JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
      }))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`
    } else {
      // Remove cookie on sign out
      document.cookie = `${authCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
  })

  // Also sync current session if it exists
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      const expires = new Date()
      expires.setFullYear(expires.getFullYear() + 1)
      document.cookie = `${authCookieName}=${encodeURIComponent(JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
      }))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`
    }
  })
}