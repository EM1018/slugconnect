/**
 *  app/profile/page.js
 *  This file is responsible for displaying what is on the 
 * 'profle' page. What users will see when they go to their
 *  profile 
 */

import { supabase } from '@/lib/supabaseClient'
import ProfileGrid  from '@/components/ProfileGrid'
 
export default async function profilePage() {
      //return <div>This is the 'profile' page</div>
      /* test to show profile grid at /profile */
      return(
            <main>
                  <ProfileGrid/>
            </main>
      )
}
