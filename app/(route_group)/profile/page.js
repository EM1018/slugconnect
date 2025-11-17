/**
 * app/profile/page.js
 * Clean, compiling version with profile photo on the left and profile fields.
 */

import { supabase } from '@/lib/supabaseClient'
import ProfileGrid from '@/components/ProfileGrid'

export default async function ProfilePage() {
  return (
    <main className="flex min-h-screen items-start justify-center bg-gradient-to-br from-gray-100 to-blue-50 p-8">
      <section className="w-full max-w-3xl">
        <div className="bg-white shadow-md rounded-2xl p-8">
          {/* Profile Header: photo on the left, title + edit button on the right */}
          <div className="flex items-start gap-6 mb-6">
            <img
              src="/default-profile.png"
              alt="Profile Photo"
              className="w-28 h-28 rounded-full object-cover border"
            />

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">My Profile</h1>
                <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">Edit Profile</button>
              </div>
              <p className="text-sm text-gray-500 mt-1">@new_kid</p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 gap-4 text-gray-700">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-medium">New Kid</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium">new_email@ucsc.edu</p>
            </div>

            <div className="flex flex-col md:flex-row md:gap-20">
              <div>
                <p className="text-sm text-gray-500">Major</p>
                <p className="text-lg font-medium">Computer Science</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="text-lg font-medium">Second Year</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">College</p>
              <p className="text-lg font-medium">College Ten</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Interests</p>
              <div className="flex gap-3 mt-2">
                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full">gaming</span>
                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full">learning</span>
                <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full">reading</span>
              </div>
            </div>

      {/*
             <div className="mt-4">
              <ProfileGrid />
            </div> 
      */ } 
          </div>
        </div>
      </section>
    </main>
  )
}
