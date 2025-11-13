/**
 * 
 * The onboarding page component. 
 * Will be rendered in onboarding/page.js.
 * Fields: Full name, Major (select), Year (select), 
 * Interests (free-text + Add)
 * 
 * For majors we can use dropdown to prevent invalid entries, 
 * same with year. 
 * 
 * List of majors can be hard-coded for now, and 
 * later fetched from the DB. Enforce valid majors server-side.
 * 
 * Will have to deal with potential invalid interests/interests 
 * that don't make sense. Potential backend task for later.
 * 
 * UX only, enforcement happens serverside w/ RLS or server actions
 * 
 * To implement: onSubmit to upsert user profile in supabase,
 * save the full name, major, year, and store interests.
 * On scucess, redirect to /discover
 * 
 */

'use client'

import { useState, useMemo } from 'react'

const DEFAULT_MAJORS = [
  'Computer Science', 'Computer Engineering', 'Applied Math', 'Biology',
  'Business Management Economics', 'Psychology', 'Art & Design', 'Physics'
  // ← replace with UCSC canonical list later or pass majors as a prop
]

const DEFAULT_YEARS = ['1st year', '2nd year', '3rd year', '4th year', 'Graduate', 'Other']

export default function OnboardingCard({
  onSubmit,                  // wired later to save profile + redirect
  majors = DEFAULT_MAJORS,   // can be fed from DB in the future
  years = DEFAULT_YEARS,
  maxInterests = 10,
}) {
  const [fullName, setFullName] = useState('')
  const [major, setMajor] = useState('')
  const [year, setYear] = useState('')
  const [interestInput, setInterestInput] = useState('')
  const [interests, setInterests] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // simple helpers
  function normalizeInterest(s) {
    return s.trim().toLowerCase().replace(/\s+/g, ' ')
  }

  function addInterest() {
    const norm = normalizeInterest(interestInput)
    if (!norm) return
    if (interests.includes(norm)) return
    if (interests.length >= maxInterests) { setError(`Max ${maxInterests} interests`); return }
    setInterests([...interests, norm])
    setInterestInput('')
    setError('')
  }

  function removeInterest(i) {
    setInterests(interests.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // lightweight UX checks (NOT security)
    if (!fullName.trim()) { setError('Please enter your full name.'); return }
    if (!major) { setError('Please select your major.'); return }
    if (!year) { setError('Please select your year.'); return }

    setBusy(true)
    try {
      // '?.' means call if provided
      // onSubmit will talk to supabase
      await onSubmit?.({
        full_name: fullName.trim(),
        major,
        year,
        interests,
      })
      // redirect to /discover after saving
    } catch (err) {
      setError(err?.message ?? 'Could not create profile.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h1 className="text-2xl font-semibold text-slate-900">Create Your Profile</h1>
      <p className="mt-1 text-sm text-slate-700">
        Let other students know about you and your interests
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Full Name */}
        <div className="space-y-1">
          <label htmlFor="fullName" className="text-sm font-medium text-slate-900">Name</label>
          <input
            id="fullName" type="text" placeholder="John Doe" value={fullName}
            onChange={(e)=>setFullName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-gray-100 px-3 py-2
                       text-slate-900 placeholder:text-slate-400 outline-none
                       focus:bg-white focus:ring-2 focus:ring-black/10"
          />
        </div>

        {/* Major */}
        <div className="space-y-1">
          <label htmlFor="major" className="text-sm font-medium text-slate-900">Major</label>
          <select
            id="major" value={major} onChange={(e)=>setMajor(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-gray-100 px-3 py-2
                       text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-black/10"
          >
            <option value="">Select your major</option>
            {majors.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {/* Backend note: later, validate major server-side against your canonical list */}
        </div>

        {/* Year */}
        <div className="space-y-1">
          <label htmlFor="year" className="text-sm font-medium text-slate-900">Year</label>
          <select
            id="year" value={year} onChange={(e)=>setYear(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-gray-100 px-3 py-2
                       text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-black/10"
          >
            <option value="">Select your year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-900">Interests</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g., Photography, Gaming, Hiking"
              value={interestInput}
              onChange={(e)=>setInterestInput(e.target.value)}
              onKeyDown={(e)=>{ if (e.key === 'Enter') { e.preventDefault(); addInterest(); } }}
              className="flex-1 rounded-xl border border-slate-300 bg-gray-100 px-3 py-2
                         text-slate-900 placeholder:text-slate-400 outline-none
                         focus:bg-white focus:ring-2 focus:ring-black/10"
            />
            <button type="button"
              onClick={addInterest}
              className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90"
            >
              Add
            </button>
          </div>

          {/* Chips */}
          {interests.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {interests.map((it, i) => (
                <span key={it} className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
                  {it}
                  <button type="button" onClick={()=>removeInterest(i)} className="text-slate-500 hover:text-slate-900">
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-500">Up to {maxInterests} interests. You can edit these later.</p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={busy}
          className="mt-2 w-full rounded-2xl bg-black px-4 py-3 text-white
                     transition hover:opacity-90 disabled:opacity-60"
        >
          {busy ? 'Creating…' : 'Create Profile'}
        </button>

        {/* Error/help */}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  )
}
