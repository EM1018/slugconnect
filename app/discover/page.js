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

 
export default async function discoverPage() {
      return <div>This is the 'discover' page</div>

}
