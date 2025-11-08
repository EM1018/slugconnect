/**
 *  app/auth/page.js
 *  This file is responsible for displaying what is on the 
 * 'auth' page. What users will see when they are 
 *  prompted to authenticate their emails, for example
 */

import { supabase } from '@/lib/supabaseClient'

 
export default async function Auth() {
      return <div>This is the 'authentication' page</div>

}
