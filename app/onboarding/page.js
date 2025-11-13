/**
 *  app/onboarding/page.js
 *  This file is responsible for displaying what is on the 
 * 'onboarding' page. Collects info from the user for their account
 */


import OnboardingCard from '@/components/OnboardingCard'

export default function OnboardingPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <OnboardingCard />
    </main>
  )
}
