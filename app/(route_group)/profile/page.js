"use client"

/**
 * app/profile/page.js
 * Client-side interactive profile page: allows inline editing of Name, Email, Major, College, Year.
 * Saves changes to Supabase 'dummy_data' table on Save.
 */

import React, { useState, useEffect } from "react"
import ProfileGrid from '@/components/ProfileGrid'
import { supabase } from '@/lib/supabaseClient'
import { getCurrentUserProfile } from '@/app/actions/profile'

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

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    major: "",
    college: "",
    year: "",
    interests: [],
  })
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(profile)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [interestInput, setInterestInput] = useState('')

  // Fetch profile data on mount
  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      setError(null)
      
      try {
        const { profile: profileData, error: profileError } = await getCurrentUserProfile()
        
        if (profileError) {
          setError(profileError)
          return
        }

        if (profileData) {
          // Get email from auth user since dummy_data doesn't store it
          const { data: { user } } = await supabase.auth.getUser()
          
          // Map the data from dummy_data table to our state
          setProfile({
            name: profileData.name || "",
            email: user?.email || "",
            major: profileData.major || "",
            college: profileData.college || "",
            year: profileData.year || "",
            interests: profileData.interests || [],
          })
          setDraft({
            name: profileData.name || "",
            email: user?.email || "",
            major: profileData.major || "",
            college: profileData.college || "",
            year: profileData.year || "",
            interests: profileData.interests || [],
          })
        } else {
          // No profile found - user hasn't completed onboarding
          setError("No profile found. Please complete onboarding first.")
          
          // Add a button to go to onboarding
          // This will be shown in the UI
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
        setError(err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  function startEditing() {
    setDraft(profile)
    setInterestInput('')
    setError(null)
    setIsEditing(true)
  }

  function cancelEditing() {
    setDraft(profile)
    setError(null)
    setIsEditing(false)
  }

  async function saveEditing() {
    setSaving(true)
    setError(null)

    try {
      // get current user (assumes user is authenticated)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) throw userError
      if (!user) throw new Error('No authenticated user found')

      // prepare updates for dummy_data table
      // Note: dummy_data table doesn't have email column
      const updates = {
        id: user.id,
        name: draft.name,
        major: draft.major,
        college: draft.college,
        year: draft.year,
        interests: draft.interests || [],
        updated_at: new Date().toISOString(),
      }

      // Upsert to dummy_data table
      const { data, error: upsertError } = await supabase
        .from('dummy_data')
        .upsert(updates, { onConflict: 'id' })
        .select()

      if (upsertError) throw upsertError

      // success — update local state with the saved data
      setProfile({
        name: draft.name,
        email: user.email, // Keep email from auth, not from database
        major: draft.major,
        college: draft.college,
        year: draft.year,
        interests: draft.interests || [],
      })
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to save profile:', err)
      setError(err.message || String(err))
    } finally {
      setSaving(false)
    }
  }

  function onChangeField(field, value) {
    setDraft(prev => ({ ...prev, [field]: value }))
  }

  function normalizeInterest(s) {
    return s.trim().toLowerCase().replace(/\s+/g, ' ')
  }

  function addInterest(interestToAdd = null) {
    const interest = interestToAdd || interestInput
    const norm = normalizeInterest(interest)
    if (!norm) return
    const currentInterests = draft.interests || []
    if (currentInterests.includes(norm)) {
      setError('This interest is already added.')
      return
    }
    if (currentInterests.length >= 10) {
      setError('Max 10 interests')
      return
    }
    onChangeField('interests', [...currentInterests, norm])
    setInterestInput('')
    setError(null)
  }

  function removeInterest(index) {
    const currentInterests = draft.interests || []
    onChangeField('interests', currentInterests.filter((_, i) => i !== index))
  }

  function togglePredefinedInterest(interest) {
    const norm = normalizeInterest(interest)
    const currentInterests = draft.interests || []
    if (currentInterests.includes(norm)) {
      removeInterest(currentInterests.indexOf(norm))
    } else {
      addInterest(interest)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-start justify-center bg-gradient-to-br from-gray-100 to-blue-50 p-8">
        <div className="bg-white shadow-md rounded-2xl p-8">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-gradient-to-br from-gray-100 to-blue-50 p-8">
      <section className="w-full max-w-3xl">
        <div className="bg-white shadow-md rounded-2xl p-8">
          {/* Profile Header: photo on the left, title + edit controls on the right */}
          <div className="flex items-start gap-6 mb-6">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
              {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">My Profile</h1>

                {/* Edit / Save / Cancel buttons */}
                {!isEditing ? (
                  <button
                    onClick={startEditing}
                    className="border px-4 py-2 rounded-lg hover:bg-gray-100"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={saveEditing}
                      disabled={saving}
                      className={`px-4 py-2 rounded-lg ${saving ? 'opacity-60 cursor-not-allowed' : 'bg-blue-600 text-white hover:opacity-90'}`}
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEditing}
                      disabled={saving}
                      className="border px-4 py-2 rounded-lg hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{profile.email || 'No email'}</p>
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>
          </div>

          {/* Profile Content: show inputs when editing, otherwise show plain text */}
          <div className="grid grid-cols-1 gap-4 text-gray-700">
            {/* Name */}
            <div>
              <p className="text-sm text-gray-500">Name</p>
              {!isEditing ? (
                <p className="text-lg font-medium">{profile.name}</p>
              ) : (
                <input
                  value={draft.name}
                  onChange={e => onChangeField('name', e.target.value)}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
              )}
            </div>

            {/* Email - Read only, comes from auth */}
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium text-gray-600">{profile.email || 'Not available'}</p>
              <p className="text-xs text-gray-400 mt-1">Email is managed through your account settings</p>
            </div>

            {/* Major & Year side-by-side on wider screens */}
            <div className="flex flex-col md:flex-row md:gap-20">
              <div className="flex-1">
                <p className="text-sm text-gray-500">Major</p>
                {!isEditing ? (
                  <p className="text-lg font-medium">{profile.major}</p>
                ) : (
                  <select
                    value={draft.major}
                    onChange={e => onChangeField('major', e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2 bg-white"
                  >
                    <option value="">Select your major</option>
                    {DEFAULT_MAJORS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-500">Year</p>
                {!isEditing ? (
                  <p className="text-lg font-medium">{profile.year}</p>
                ) : (
                  <select
                    value={draft.year}
                    onChange={e => onChangeField('year', e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2 bg-white"
                  >
                    <option value="">Select your year</option>
                    {DEFAULT_YEARS.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* College */}
            <div>
              <p className="text-sm text-gray-500">College</p>
              {!isEditing ? (
                <p className="text-lg font-medium">{profile.college}</p>
              ) : (
                <select
                  value={draft.college}
                  onChange={e => onChangeField('college', e.target.value)}
                  className="mt-1 w-full border rounded-md px-3 py-2 bg-white"
                >
                  <option value="">Select your college</option>
                  {UCSC_COLLEGES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Interests */}
            <div>
              <p className="text-sm text-gray-500">Interests</p>
              {!isEditing ? (
                <div className="flex flex-wrap gap-3 mt-2">
                  {profile.interests && profile.interests.length > 0 ? (
                    profile.interests.map((interest, index) => (
                      <span key={index} className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full capitalize">
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">No interests added yet</p>
                  )}
                </div>
              ) : (
                <div className="mt-2 space-y-3">
                  {/* Popular Interests - Clickable chips */}
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Popular interests (click to add):</p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_INTERESTS.map((interest) => {
                        const norm = normalizeInterest(interest)
                        const isSelected = (draft.interests || []).includes(norm)
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
                    <p className="text-xs text-gray-600 mb-2">Or add your own:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a custom interest..."
                        value={interestInput}
                        onChange={(e) => setInterestInput(e.target.value)}
                        onKeyDown={(e)=>{ if (e.key === 'Enter') { e.preventDefault(); addInterest(); } }}
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                      <button 
                        type="button"
                        onClick={() => addInterest()}
                        className="rounded-md bg-gray-600 text-white px-4 py-2 text-sm hover:bg-gray-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Selected Interests Display */}
                  {(draft.interests || []).length > 0 && (
                    <div>
                      <p className="text-xs text-gray-600 mb-2">Your interests ({(draft.interests || []).length}/10):</p>
                      <div className="flex flex-wrap gap-2">
                        {(draft.interests || []).map((it, i) => (
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
                </div>
              )}
            </div>

            {/* Optional ProfileGrid below */}
            <div className="mt-4">
              <ProfileGrid />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
