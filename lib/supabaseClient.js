/**
 * lib/supabaseClient.js 
 * This file starts the supabase instance. 
 * Essentialy the bridge between the front end 
 * and the supabase backend, so other files 
 * will communicate with this file.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseURL = 'https://tokhxfjhspcmlhebafxi.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseURL, supabaseAnonKey)