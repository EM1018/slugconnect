// dummy data
const profiles = [
    { id: 1, name: "Alice Johnson", major: "Computer Science" },
    { id: 2, name: "Bob Smith", major: "Mechanical Engineering" },
    { id: 3, name: "Catherine Lee", major: "Biology" },
    { id: 4, name: "David Kim", major: "Mathematics" },
];
/**
 *  app/discover/page.js
 *  This file is responsible for displaying what is on the 
 * 'discover' page, likely the main page of our project
 */

import { supabase } from '@/lib/supabaseClient'
import FilterSidebar from '@/components/FilterSideBar';
 
export default async function discoverPage() {
      return (
        // side bar can now be seen on /discover, although need to fix where it is put
        <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
              <FilterSidebar />
        </main>
      )

}
