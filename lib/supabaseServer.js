/**
 * lib/supabaseServer.js
 * Server-side Supabase client for RLS-safe operations
 * 
 * This client reads the auth session from cookies and sets it on the client
 * so that RLS policies can identify the authenticated user.
 * 
 * Note: Supabase stores auth tokens in cookies with the pattern:
 * sb-<project-ref>-auth-token
 * Where project-ref is extracted from the Supabase URL
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tokhxfjhspcmlhebafxi.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/**
 * Create a Supabase client for server-side operations
 * Extracts the session from cookies and sets it on the client
 */
export async function createClient() {
  const cookieStore = await cookies()
  
  // Extract project ref from URL for cookie name
  // URL format: https://<project-ref>.supabase.co
  const projectRef = supabaseURL.split('//')[1]?.split('.')[0] || 'tokhxfjhspcmlhebafxi'
  const authCookieName = `sb-${projectRef}-auth-token`
  
  // Create client
  const client = createSupabaseClient(supabaseURL, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  // Try to get session from cookie
  try {
    const authCookie = cookieStore.get(authCookieName)
    if (authCookie?.value) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(authCookie.value))
        if (sessionData?.access_token) {
          // Set the session on the client
          await client.auth.setSession({
            access_token: sessionData.access_token,
            refresh_token: sessionData.refresh_token,
          })
        }
      } catch (parseError) {
        // Cookie might be in a different format, try to find any auth cookie
        const allCookies = cookieStore.getAll()
        for (const cookie of allCookies) {
          if (cookie.name.includes('sb-') && cookie.name.includes('auth')) {
            try {
              const sessionData = JSON.parse(decodeURIComponent(cookie.value))
              if (sessionData?.access_token) {
                await client.auth.setSession({
                  access_token: sessionData.access_token,
                  refresh_token: sessionData.refresh_token,
                })
                break
              }
            } catch (e) {
              // Continue to next cookie
            }
          }
        }
      }
    }
  } catch (e) {
    // No valid session found - user is not authenticated
  }

  return client
}

