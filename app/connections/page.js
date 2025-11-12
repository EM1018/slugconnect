/**
 *  app/connections/page.js
 *  This file is responsible for displaying what is on the 
 * 'connections' page
 */

/*
import { supabase } from '@/lib/supabaseClient'

 
export default async function connectionsPage() {
      return <div>This is the 'conections' page</div>

}

*/



import ProfileCard from '@/components/ProfileCard'
import { supabase } from '@/lib/supabaseClient'

export default async function ConnectionsPage() {
  // Fetch profiles from Supabase (replace 'profiles' with your table name)
  const { data: profiles, error } = await supabase.from('dummy data').select('*')

  if (error) console.error('Supabase error:', error)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Connections</h1>
      <div className="grid grid-cols-3 gap-4">
        {profiles?.map(profile => (
          <ProfileCard
            key={profile.id}
            name={profile.name}
            major={profile.major}
            status={profile.connection_status} // optional field
          />
        )) || <p>Loading profiles...</p>}
      </div>
    </div>
  )
}


