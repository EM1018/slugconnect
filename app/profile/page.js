/**
 *  app/auth/page.js
 *  This file is responsible for displaying what is on the 
 * 'profle' page. What users will see when they go to their
 *  profile page, for example
 */

import { supabase } from '@/lib/supabaseClient'

 
export default async function Profile() {
      return <div>This is the 'profile' page</div>

}
