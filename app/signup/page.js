/**
 *  app/signup/page.js
 *  This file is responsible for displaying what is on the 
 * 'sign up' page
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/authService'
import SignUpCard from '@/components/SignUpCard'
import EmailConfirmationMessage from '@/components/EmailConfirmationMessage'
 
export default function SignUpPage() {
  const router = useRouter()
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  async function handleSignUp({ email, password }) {
    const { user, needsConfirmation, error } = await signUp(email, password)
    
    if (error) {
      throw new Error(error.message || 'Sign up failed')
    }

    // If email confirmation is required, show message
    if (needsConfirmation) {
      setUserEmail(email)
      setShowConfirmationMessage(true)
      // Don't redirect - let user see the confirmation message
      return
    }

    // If confirmation is off or user is already confirmed, redirect to onboarding
    if (user) {
      router.push('/onboarding')
    }
  }

  if (showConfirmationMessage) {
    return (
      <EmailConfirmationMessage 
        email={userEmail} 
        onBack={() => router.push('/')}
      />
    )
  }

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <SignUpCard onSignUp={handleSignUp} />
    </main>
  )
}
