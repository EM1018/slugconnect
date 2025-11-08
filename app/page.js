/**
 *  app/page.js
 *  This file is responsible for displaying what 
 *  the user sees first (essentially the 'login' route).
 */

import { supabase } from '@/lib/supabaseClient'


/**
 * This function gets all the data from our table 'dummay data' in supabase and console logs it.
 * You should see it in the terminal when you run 'npm run dev' 
 * You'll also see (on the actual page) 'Supabse Connected' 
 */
export default async function Home() {
    const { data, error } = await 
      supabase.from('dummy data').select('*')
      console.log('dummy data', data, error)
      return <div>Supabase Connected!</div>

}
