/**
 *  app/onboarding/page.js
 *  This file is responsible for displaying what is on the 
 * 'onboarding' page. Collects info from the user for their account
 */

'use client'

import { useRouter } from 'next/navigation'
import { createProfile } from '@/app/actions/profile'
import OnboardingCard from '@/components/OnboardingCard'

export default function OnboardingPage() {
  const router = useRouter()

  async function handleSubmit(profileData) {
    const { success, error } = await createProfile(profileData)
    
    if (!success) {
      throw new Error(error || 'Failed to create profile')
    }

    // Redirect to discover page on success
    router.push('/discover')
  }

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <OnboardingCard onSubmit={handleSubmit} />
    </main>
  )
}
