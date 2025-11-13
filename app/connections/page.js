'use client'
import React, { useEffect, useState } from 'react'
import ProfileCard from '@/components/ProfileCard'
import { supabase } from '@/lib/supabaseClient'

export default function ConnectionsPage() {
  const [requests, setRequests] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from('sample_connection_requests')
        .select(`
          status,
          sender:sender_id (
            id,
            name,
            major
          )
        `)

      if (error) {
        console.error('Supabase error:', error)
      } else {
        setRequests(data)
      }

      setLoading(false)
    }

    fetchRequests()
  }, [])

  if (loading) return <p>Loading connection requests...</p>

  const validRequests = requests?.filter(req => req.sender) || []

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Connections</h1>

      {validRequests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {validRequests.map(req => (
            <ProfileCard
              key={req.sender.id}
              name={req.sender.name}
              major={req.sender.major}
              status={req.status}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No connection requests found.</p>
      )}
    </div>
  )
}
