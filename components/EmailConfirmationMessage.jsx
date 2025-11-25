/**
 * EmailConfirmationMessage component
 * Shows message when email confirmation is required
 */

'use client'

import { useState } from 'react'
import { resendConfirmationEmail } from '@/lib/authService'

export default function EmailConfirmationMessage({ email, onBack }) {
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState('')

  async function handleResend() {
    setResending(true)
    setResendError('')
    setResendSuccess(false)

    const { error } = await resendConfirmationEmail(email)
    
    if (error) {
      setResendError(error.message || 'Failed to resend email')
    } else {
      setResendSuccess(true)
    }
    
    setResending(false)
  }

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">Check Your Email</h1>
        <p className="text-slate-700 mb-4">
          We've sent a confirmation email to <strong>{email}</strong>
        </p>
        <p className="text-sm text-slate-600 mb-6">
          Please click the confirmation link in the email to activate your account. 
          Once confirmed, you can sign in and complete your profile.
        </p>

        {/* Resend email button */}
        <div className="mb-4 space-y-2">
          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm 
                     text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {resending ? 'Sending...' : 'Resend Confirmation Email'}
          </button>
          {resendSuccess && (
            <p className="text-sm text-green-600">Confirmation email sent!</p>
          )}
          {resendError && (
            <p className="text-sm text-red-600">{resendError}</p>
          )}
        </div>

        {/* Testing instructions */}
        <div className="mb-6 p-4 bg-slate-50 rounded-xl">
          <p className="text-xs font-semibold text-slate-700 mb-2">For Testing:</p>
          <p className="text-xs text-slate-600 mb-2">
            <strong>Option 1 (Easiest):</strong> Disable email confirmation in Supabase Dashboard:
          </p>
          <ol className="text-xs text-slate-600 list-decimal list-inside space-y-1 mb-3">
            <li>Go to Supabase Dashboard → Authentication → Settings</li>
            <li>Scroll to "Auth" section</li>
            <li>Toggle OFF "Enable email confirmations"</li>
            <li>Sign up again - you'll be signed in immediately</li>
          </ol>
          <p className="text-xs text-slate-600">
            <strong>Option 2:</strong> Check your email inbox (and spam folder) for the confirmation link.
          </p>
        </div>

        <button
          onClick={onBack}
          className="w-full rounded-2xl bg-black px-4 py-3 text-white transition hover:opacity-90"
        >
          Go to Sign In
        </button>
      </div>
    </main>
  )
}

