/**
 * 
 * The component file for the login page (app/page.js)
 * which includes buttons, text fields, and links to another page.
 * Will be rendered in app/page.js by <LoginCard /> 
 */
'use client'

// allows for re-rendering of component to reflect updated state
import { useState } from 'react'
// link component that allows us to navigate to other pages
import Link from 'next/link'

/**
 *  
 * onSignIn is a callback (call w/ email, password)
 * allowedDomain is a UI hint (placeholder that the user sees)
 * actual enforcement on email done later
 */
export default function LoginCard({ onSignIn, allowedDomain = 'ucsc.edu' }) {
  /**
   * Local states (email, password, busy, error): 
   *    These track field values and the state of the UI
   *    'busy' - disables submit button and shows 'Signing in...' label
   *             during async work. 
   *    'error' - string shown under the button for validation/auth errors
   */
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // lightweight domain hint (purely UI; backend should still validate)
    if (allowedDomain && !email.endsWith(`@${allowedDomain}`)) {
      setError(`Please use your ${allowedDomain} email.`)
      return
    }

    // call onSignIn (callback function) to do something on action
    // should redirect on success
    // page implements onSignIn (client-side) by calling supabase
    setBusy(true)
    try {
      await onSignIn?.({ email, password }) // auth logic 
    } catch (err) {
      setError(err?.message ?? 'Sign in failed')
    } finally {
      setBusy(false)
    }
    // won't crash if no onSignIn is provided due to '?.'
    // just for design
  }

  return (
    <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-black/5">
      {/* Header */}
      <h1 className="text-2xl font-semibold">Welcome to SlugConnect</h1>
      <p className="mt-1 text-sm text-gray-600">
        Sign in to connect with fellow students
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            UCSC Email
          </label>
          <input
            id="email"
            type="email"
            placeholder={`you@${allowedDomain}`}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border bg-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border bg-gray-100 px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={busy}
          className="mt-2 w-full rounded-2xl bg-black px-4 py-3 text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {busy ? 'Signing in…' : 'Sign In'}
        </button>

        {/* Error/help text */}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Sign up link */}
        <p className="pt-1 text-center text-sm">
          Don&apos;t have an account?{' '}
          {/* href="/signup will get us to the /signup route */}
          <Link href="/signup" className="font-medium text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
