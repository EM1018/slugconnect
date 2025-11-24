'use client'
import React, { useEffect, useState } from 'react'
import ProfileCard from '@/components/ProfileCard'
import AcceptRejectButtons from '@/components/AcceptRejectButtons'
import { supabase } from '@/lib/supabaseClient'

export default function ConnectionsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('sample_connection_requests')
      .select(`
        id,
        status,
        sender:sender_id (
          id,
          name,
          major
        )
      `)
      .eq('status', 'pending') // Only show pending

    if (error) console.error('Supabase error:', error)
    else setRequests(data)

    setLoading(false)
  }

  const handleResponse = async (requestId, action) => {
    setActionLoading(requestId)

    const { error } = await supabase
      .from('sample_connection_requests')
      .update({ status: action }) // 'accepted' or 'rejected'
      .eq('id', requestId)

    if (error) alert('Failed to update request')
    else fetchRequests() // Refresh list

    setActionLoading(null)
  }

  if (loading) return <p>Loading connection requests...</p>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Connection Requests</h1>

      {requests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {requests.map(req => (
            <div key={req.id} className="flex flex-col gap-2">
              <ProfileCard
                name={req.sender.name}
                major={req.sender.major}
                status={req.status}
              />

              <AcceptRejectButtons
                onAccept={() => handleResponse(req.id, 'accepted')}
                onReject={() => handleResponse(req.id, 'rejected')}
                disabled={actionLoading === req.id}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No pending connection requests.</p>
      )}
    </div>
  )
}
