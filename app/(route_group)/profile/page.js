"use client"

/**
 * app/profile/page.js
 * Client-side interactive profile page: allows inline editing of Name, Email, Major, College, Year.
 * Saves changes to Supabase 'profiles' table on Save.
 *
 * Note: This file uses the local Supabase client (`/mnt/data/page.js` is the uploaded file path referenced in tool calls).
 */

import React, { useState } from "react"
import ProfileGrid from '@/components/ProfileGrid'
import { supabase } from '@/lib/supabaseClient'

export default function ProfilePage() {
  // initial (placeholder) profile data — you should replace this with a fetch from Supabase on mount
  const [profile, setProfile] = useState({
    name: "New Kid",
    email: "new_email@ucsc.edu",
    major: "Computer Science",
    college: "College Ten",
    year: "Second Year",
    handle: "@new_kid",
  })

  // editing state and a draft copy for cancel support
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(profile)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function startEditing() {
    setDraft(profile)
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

      // prepare updates — assumes you have a 'profiles' table keyed by the user's id
      const updates = {
        id: user.id,
        name: draft.name,
        email: draft.email,
        major: draft.major,
        college: draft.college,
        year: draft.year,
        updated_at: new Date().toISOString(),
      }

      const { data, error: upsertError } = await supabase.from('profiles').upsert(updates).select()

      if (upsertError) throw upsertError

      // success — update local state with the saved data
      setProfile(prev => ({ ...prev, ...draft }))
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

  return (
    <main className="flex min-h-screen items-start justify-center bg-gradient-to-br from-gray-100 to-blue-50 p-8">
      <section className="w-full max-w-3xl">
        <div className="bg-white shadow-md rounded-2xl p-8">
          {/* Profile Header: photo on the left, title + edit controls on the right */}
          <div className="flex items-start gap-6 mb-6">
            <img
              src="/default-profile.png"
              alt="Profile Photo"
              className="w-28 h-28 rounded-full object-cover border"
            />

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
              <p className="text-sm text-gray-500 mt-1">{profile.handle}</p>
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

            {/* Email */}
            <div>
              <p className="text-sm text-gray-500">Email</p>
              {!isEditing ? (
                <p className="text-lg font-medium">{profile.email}</p>
              ) : (
                <input
                  value={draft.email}
                  onChange={e => onChangeField('email', e.target.value)}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
              )}
            </div>

            {/* Major & Year side-by-side on wider screens */}
            <div className="flex flex-col md:flex-row md:gap-20">
              <div className="flex-1">
                <p className="text-sm text-gray-500">Major</p>
                {!isEditing ? (
                  <p className="text-lg font-medium">{profile.major}</p>
                ) : (
                  <input
                    value={draft.major}
                    onChange={e => onChangeField('major', e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                  />
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-500">Year</p>
                {!isEditing ? (
                  <p className="text-lg font-medium">{profile.year}</p>
                ) : (
                  <input
                    value={draft.year}
                    onChange={e => onChangeField('year', e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                  />
                )}
              </div>
            </div>

            {/* College */}
            <div>
              <p className="text-sm text-gray-500">College</p>
              {!isEditing ? (
                <p className="text-lg font-medium">{profile.college}</p>
              ) : (
                <input
                  value={draft.college}
                  onChange={e => onChangeField('college', e.target.value)}
                  className="mt-1 w-full border rounded-md px-3 py-2"
                />
              )}
            </div>

            {/* Interests (read-only for now) */}
            <div>
              <p className="text-sm text-gray-500">Interests</p>
              <div className="flex gap-3 mt-2">
                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full">gaming</span>
                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full">learning</span>
                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full">reading</span>
              </div>
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
