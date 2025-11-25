/**
 *  app/page.js
 *  This file is responsible for displaying what 
 *  the user sees first (essentially the 'login' route).
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithPassword, getCurrentUser } from '@/lib/authService'
import LoginCard from '@/components/LogInCard'

export default function Home() {
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    async function checkAuth() {
      const { user } = await getCurrentUser()
      if (user) {
        router.push('/discover')
      }
    }
    checkAuth()
  }, [router])

  async function handleSignIn({ email, password }) {
    const { user, error } = await signInWithPassword(email, password)
    
    if (error) {
      throw new Error(error.message || 'Sign in failed')
    }

    if (user) {
      // Wait a moment for session to be established, then redirect
      // This ensures cookies are set before navigation
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Verify the session was set before redirecting
      const { user: verifiedUser } = await getCurrentUser()
      if (verifiedUser) {
        router.push('/discover')
        router.refresh() // Force refresh to update server-side auth state
      } else {
        throw new Error('Session not established. Please try again.')
      }
    }
  }

  return (
    <main className='min-h-screen grid place-items-center bg-gray-50 p-6'>
      <LoginCard onSignIn={handleSignIn} />
    </main>
  )
}
