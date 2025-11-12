/**
 *  app/signup/page.js
 *  This file is responsible for displaying what is on the 
 * 'sign up' page
 */

import { supabase } from '@/lib/supabaseClient'
import SignUpCard from '@/components/SignUpCard'
 
export default async function signUpPage() {
      //return <div>This is the 'sign up page' page</div>
      return (
            <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
                  <SignUpCard />
            </main>
      )
}
