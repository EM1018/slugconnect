/**
 * The sign up component (components/SignUpCard)
 * The user types and the state is updated for email, pass, and confirm
 * Quick checks: 
 *      - if domain not @ucsc, error 
 *      - if pass too short, error 
 *      - if mismatch, error 
 *  if these checks pass, set busy = true 
 *  then call onSignUp (sign up logic)
 *  catch error and display
 *  set busy = false at the end
 * 
 * when we later wire to supabase: 
 *      - pass onSignUp (calls supabase.auth.signUp?)
 *      - on success, change route to /onboarding
 *      - handle errors (weak pass, email taken, confrim email flow)
 *      - check actual domain enforcement (@ucsc)
 * 
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SignUpCard({
  onSignUp,                    // callback wired later
  allowedDomain = 'ucsc.edu',  // UI hint; real enforcement should be server-side
  minLength = 6,               // password length hint
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // basic UX checks (not security)
    if (allowedDomain && !email.endsWith(`@${allowedDomain}`)) {
      setError(`Please use your ${allowedDomain} email.`)
      return
    }
    if (password.length < minLength) {
      setError(`Password must be at least ${minLength} characters.`)
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setBusy(true)
    try {
      await onSignUp?.({ email, password })   // wire Supabase + redirect to /onboarding
    } catch (err) {
      setError(err?.message ?? 'Sign up failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-black/5">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-slate-900">Create an Account</h1>
      <p className="mt-1 text-sm text-slate-700">
        Join SlugConnect to meet students with similar interests
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-slate-900">
            UCSC Email
          </label>
          <input
            id="email"
            type="email"
            placeholder={`you@${allowedDomain}`}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-gray-100 px-3 py-2
                       text-slate-900 placeholder:text-slate-400 outline-none
                       focus:bg-white focus:ring-2 focus:ring-black/10"
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-slate-900">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder={`At least ${minLength} characters`}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-gray-100 px-3 py-2
                       text-slate-900 placeholder:text-slate-400 outline-none
                       focus:bg-white focus:ring-2 focus:ring-black/10"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label htmlFor="confirm" className="text-sm font-medium text-slate-900">
            Confirm Password
          </label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-gray-100 px-3 py-2
                       text-slate-900 placeholder:text-slate-400 outline-none
                       focus:bg-white focus:ring-2 focus:ring-black/10"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={busy}
          className="mt-2 w-full rounded-2xl bg-black px-4 py-3 text-white
                     transition hover:opacity-90 disabled:opacity-60"
        >
          {busy ? 'Signing up…' : 'Sign Up'}
        </button>

        {/* Error/help text */}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Link to Sign in */}
        <p className="pt-1 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/" className="font-medium text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}


