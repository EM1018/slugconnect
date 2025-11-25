'use client'
import React, { useEffect, useState } from 'react'
import ProfileCard from '@/components/ProfileCard'
import AcceptRejectButtons from '@/components/AcceptRejectButtons'
import { supabase } from '@/lib/supabaseClient'

export default function ConnectionsPage() {
  const [pendingRequests, setPendingRequests] = useState([])
  const [acceptedConnections, setAcceptedConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    fetchUserAndConnections()
  }, [])

  const fetchUserAndConnections = async () => {
    setLoading(true)

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Error getting user:', userError)
      setLoading(false)
      return
    }

    setCurrentUserId(user.id)

    // Fetch pending requests (where current user is the receiver)
    const { data: pendingData, error: pendingError } = await supabase
      .from('sample_connection_requests')
      .select(`
        id,
        status,
        sender_id,
        receiver_id,
        sender:sender_id (
          id,
          name,
          major,
          year,
          interests
        )
      `)
      .eq('receiver_id', user.id)
      .eq('status', 'pending')

    if (pendingError) {
      console.error('Error fetching pending requests:', pendingError)
    } else {
      setPendingRequests(pendingData || [])
    }

    // Fetch accepted connections (where current user is involved)
    const { data: acceptedData, error: acceptedError } = await supabase
      .from('sample_connection_requests')
      .select(`
        id,
        status,
        sender_id,
        receiver_id,
        sender:sender_id (
          id,
          name,
          major,
          year,
          interests
        ),
        receiver:receiver_id (
          id,
          name,
          major,
          year,
          interests
        )
      `)
      .eq('status', 'accepted')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)

    if (acceptedError) {
      console.error('Error fetching accepted connections:', acceptedError)
    } else {
      // Map to show the other user (not the current user)
      const connections = (acceptedData || []).map(conn => ({
        ...conn,
        otherUser: conn.sender_id === user.id ? conn.receiver : conn.sender
      }))
      setAcceptedConnections(connections)
    }

    setLoading(false)
  }

  const handleResponse = async (requestId, action) => {
    setActionLoading(requestId)

    const { error } = await supabase
      .from('sample_connection_requests')
      .update({ status: action }) // 'accepted' or 'rejected'
      .eq('id', requestId)

    if (error) {
      alert('Failed to update request: ' + error.message)
    } else {
      fetchUserAndConnections() // Refresh list
    }

    setActionLoading(null)
  }

  if (loading) return <div className="p-8"><p>Loading connections...</p></div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Connections</h1>

      {/* Pending Requests Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
        {pendingRequests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pendingRequests.map(req => (
              <div key={req.id} className="flex flex-col gap-2">
                <ProfileCard
                  name={req.sender?.name || 'Unknown'}
                  major={req.sender?.major || 'Unknown'}
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
      </section>

      {/* Accepted Connections Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Connections</h2>
        {acceptedConnections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {acceptedConnections.map(conn => (
              <div key={conn.id} className="flex flex-col gap-2">
                <ProfileCard
                  name={conn.otherUser?.name || 'Unknown'}
                  major={conn.otherUser?.major || 'Unknown'}
                  year={conn.otherUser?.year}
                  interests={conn.otherUser?.interests}
                  status="connected"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No connections yet. Start connecting with other students!</p>
        )}
      </section>
    </div>
  )
}
