/**
 * app/actions/profile.js
 * Server actions for profile operations
 * These run on the server and have access to auth cookies
 */

'use server'

import { createClient } from '@/lib/supabaseServer'

/**
 * Create or update a user profile
 * @param {Object} profileData - Profile data (full_name, major, year, interests)
 * @returns {Promise<{success: boolean, error: string | null}>}
 */
export async function createProfile(profileData) {
  try {
    const supabase = await createClient()
    
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('Auth error in createProfile:', authError)
      return { success: false, error: 'Not authenticated. Please sign in.' }
    }

    console.log('Creating profile for user:', user.id, user.email)

    // Prepare profile data with user ID
    // Note: college is optional and can be added later via profile edit
    // Note: dummy_data table doesn't have email column, so we exclude it
    const profile = {
      id: user.id,
      name: profileData.full_name,
      major: profileData.major,
      year: profileData.year,
      interests: profileData.interests || [],
      college: profileData.college || null, // Optional field
      updated_at: new Date().toISOString(),
    }

    console.log('Profile data to save:', profile)

    // Upsert into dummy_data table (as mentioned, this is the current table name)
    const { data, error: dbError } = await supabase
      .from('dummy_data')
      .upsert(profile, { onConflict: 'id' })
      .select()

    if (dbError) {
      console.error('Database error:', dbError)
      return { success: false, error: dbError.message || 'Failed to save profile' }
    }

    console.log('Profile saved successfully:', data)
    return { success: true, error: null, data }
  } catch (error) {
    console.error('Create profile error:', error)
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
}

/**
 * Get the current user's profile
 * @returns {Promise<{profile: Object | null, error: string | null}>}
 */
export async function getCurrentUserProfile() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('Auth error in getCurrentUserProfile:', authError)
      return { profile: null, error: 'Not authenticated' }
    }

    console.log('Fetching profile for user:', user.id, user.email)

    const { data, error } = await supabase
      .from('dummy_data')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - this is expected if profile doesn't exist
        console.log('No profile found for user:', user.id)
        return { profile: null, error: null }
      }
      console.error('Database error fetching profile:', error)
      return { profile: null, error: error.message }
    }

    console.log('Profile found:', data)
    return { profile: data || null, error: null }
  } catch (error) {
    console.error('Get profile error:', error)
    return { profile: null, error: error.message || 'An unexpected error occurred' }
  }
}

