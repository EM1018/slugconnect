/**
 * 
 * /app/(route_group)/layout.js responsible for having the navbar
 * persist across different pages and protecting routes from unauthenticated users.
 * 
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'
import NavBar from '@/components/NavBar'

export default async function NavLayout({ children }) {
  // Check authentication
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  // If not authenticated, redirect to login page
  if (!user || error) {
    // Log for debugging (remove in production)
    if (error) {
      console.error('Auth error in layout:', error.message)
    }
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  )
}

