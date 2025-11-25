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

// UCSC Undergraduate Majors (B.A. and B.S.) from official catalog
// Source: https://catalog.ucsc.edu/en/current/general-catalog/academic-programs/fields-of-study-chart
const DEFAULT_MAJORS = [
  'Agroecology',
  'Ancient Studies',
  'Anthropology',
  'Applied Linguistics and Multilingualism',
  'Applied Mathematics',
  'Applied Physics',
  'Art',
  'Art and Design: Games and Playable Media',
  'Biochemistry and Molecular Biology',
  'Biology',
  'Biomolecular Engineering and Bioinformatics',
  'Biotechnology',
  'Business Management Economics',
  'Chemistry',
  'Classical Studies',
  'Cognitive Science',
  'Computer Engineering',
  'Computer Science',
  'Computer Science: Computer Game Design',
  'Critical Race and Ethnic Studies',
  'Earth Sciences',
  'Ecology and Evolutionary Biology',
  'Economics',
  'Education, Democracy and Justice',
  'Electrical Engineering',
  'Environmental Studies',
  'Feminist Studies',
  'Film and Digital Media',
  'Global and Community Health',
  'History',
  'History of Art and Visual Culture',
  'Human Biology',
  'Italian Studies',
  'Japanese Studies',
  'Jewish Studies',
  'Language Studies',
  'Latin American and Latino Studies',
  'Legal Studies',
  'Linguistics',
  'Literature',
  'Marine Biology',
  'Mathematics',
  'Molecular, Cell and Developmental Biology',
  'Music',
  'Neuroscience',
  'Philosophy',
  'Physics',
  'Physics (Astrophysics)',
  'Politics',
  'Psychology',
  'Robotics Engineering',
  'Science Education',
  'Sociology',
  'Spanish Studies',
  'Statistics',
  'Technology and Information Management',
  'Theater Arts',
]

const DEFAULT_YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']

const UCSC_COLLEGES = [
  'Cowell College',
  'Stevenson College',
  'Crown College',
  'Merrill College',
  'Porter College',
  'Kresge College',
  'Oakes College',
  'Rachel Carson College',
  'College Nine',
  'John R. Lewis College'
]

// Popular/predefined interests that users can select from
const POPULAR_INTERESTS = [
  'Art',
  'Baking',
  'Board Games',
  'Camping',
  'Cooking',
  'Dancing',
  'Fitness',
  'Gaming',
  'Gardening',
  'Hiking',
  'Music',
  'Photography',
  'Reading',
  'Running',
  'Sports',
  'Swimming',
  'Technology',
  'Travel',
  'Volunteering',
  'Writing',
  'Yoga',
  'Film',
  'Theater',
  'Drawing',
  'Coding',
  'Rock Climbing',
  'Surfing',
  'Cycling',
  'Meditation',
  'Crafting'
]

export default function OnboardingCard({
  onSubmit,                  // wired later to save profile + redirect
  majors = DEFAULT_MAJORS,   // can be fed from DB in the future
  years = DEFAULT_YEARS,
  colleges = UCSC_COLLEGES,
  maxInterests = 10,
}) {
  const [fullName, setFullName] = useState('')
  const [major, setMajor] = useState('')
  const [college, setCollege] = useState('')
  const [year, setYear] = useState('')
  const [interestInput, setInterestInput] = useState('')
  const [interests, setInterests] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  // simple helpers
  function normalizeInterest(s) {
    return s.trim().toLowerCase().replace(/\s+/g, ' ')
  }

  function addInterest(interestToAdd = null) {
    // If interestToAdd is provided (from clicking a predefined interest), use it
    // Otherwise, use the text input
    const interest = interestToAdd || interestInput
    const norm = normalizeInterest(interest)
    if (!norm) return
    if (interests.includes(norm)) {
      setError('This interest is already added.')
      return
    }
    if (interests.length >= maxInterests) { 
      setError(`Max ${maxInterests} interests`); 
      return 
    }
    setInterests([...interests, norm])
    setInterestInput('')
    setError('')
  }

  function removeInterest(i) {
    setInterests(interests.filter((_, idx) => idx !== i))
  }

  function togglePredefinedInterest(interest) {
    const norm = normalizeInterest(interest)
    if (interests.includes(norm)) {
      // Remove if already selected
      removeInterest(interests.indexOf(norm))
    } else {
      // Add if not selected
      addInterest(interest)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // lightweight UX checks (NOT security)
    if (!fullName.trim()) { setError('Please enter your full name.'); return }
    if (!major) { setError('Please select your major.'); return }
    if (!college) { setError('Please select your college.'); return }
    if (!year) { setError('Please select your year.'); return }

    setBusy(true)
    try {
      // '?.' means call if provided
      // onSubmit will talk to supabase
      await onSubmit?.({
        full_name: fullName.trim(),
        major,
        college,
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

        {/* College */}
        <div className="space-y-1">
          <label htmlFor="college" className="text-sm font-medium text-slate-900">College</label>
          <select
            id="college" value={college} onChange={(e)=>setCollege(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-gray-100 px-3 py-2
                       text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-black/10"
          >
            <option value="">Select your college</option>
            {colleges.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
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
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-900">Interests</label>
          
          {/* Popular Interests - Clickable chips */}
          <div>
            <p className="text-xs text-slate-600 mb-2">Popular interests (click to add):</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_INTERESTS.map((interest) => {
                const norm = normalizeInterest(interest)
                const isSelected = interests.includes(norm)
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => togglePredefinedInterest(interest)}
                    className={`px-3 py-1 rounded-full text-sm border transition
                      ${isSelected 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      }`}
                  >
                    {interest}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Custom Interest Input */}
          <div>
            <p className="text-xs text-slate-600 mb-2">Or add your own:</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a custom interest..."
                value={interestInput}
                onChange={(e)=>setInterestInput(e.target.value)}
                onKeyDown={(e)=>{ if (e.key === 'Enter') { e.preventDefault(); addInterest(); } }}
                className="flex-1 rounded-xl border border-slate-300 bg-gray-100 px-3 py-2
                           text-slate-900 placeholder:text-slate-400 outline-none
                           focus:bg-white focus:ring-2 focus:ring-black/10"
              />
              <button type="button"
                onClick={() => addInterest()}
                className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-90"
              >
                Add
              </button>
            </div>
          </div>

          {/* Selected Interests Display */}
          {interests.length > 0 && (
            <div>
              <p className="text-xs text-slate-600 mb-2">Your interests ({interests.length}/{maxInterests}):</p>
              <div className="flex flex-wrap gap-2">
                {interests.map((it, i) => (
                  <span key={it} className="inline-flex items-center gap-2 rounded-full border border-blue-300 bg-blue-50 px-3 py-1 text-sm">
                    <span className="capitalize">{it}</span>
                    <button 
                      type="button" 
                      onClick={()=>removeInterest(i)} 
                      className="text-blue-600 hover:text-blue-800 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
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
