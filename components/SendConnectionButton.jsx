/**
 * SendConnectionButton component
 * Button to send connection requests to other users
 * Shows different states: Send Request, Pending, Connected
 */

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SendConnectionButton({ receiverId, receiverName }) {
  const [status, setStatus] = useState('idle') // 'idle', 'pending', 'accepted', 'rejected', 'loading'
  const [loading, setLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    async function checkConnectionStatus() {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        return
      }

      setCurrentUserId(user.id)

      // Check if connection request already exists in either direction
      // Query for requests where current user is sender and receiverId is receiver
      const { data: sentRequest, error: sentError } = await supabase
        .from('sample_connection_requests')
        .select('status, sender_id, receiver_id')
        .eq('sender_id', user.id)
        .eq('receiver_id', receiverId)
        .maybeSingle()

      if (sentError) {
        console.error('Error checking sent request:', sentError)
      }

      // Query for requests where receiverId is sender and current user is receiver
      const { data: receivedRequest, error: receivedError } = await supabase
        .from('sample_connection_requests')
        .select('status, sender_id, receiver_id')
        .eq('sender_id', receiverId)
        .eq('receiver_id', user.id)
        .maybeSingle()

      if (receivedError) {
        console.error('Error checking received request:', receivedError)
      }

      // Determine status based on which request exists
      const existingRequest = sentRequest || receivedRequest

      if (existingRequest) {
        // Determine status from the request
        if (existingRequest.status === 'accepted') {
          setStatus('accepted')
        } else if (existingRequest.status === 'rejected') {
          setStatus('rejected')
        } else if (sentRequest) {
          setStatus('pending') // User sent the request
        } else if (receivedRequest) {
          setStatus('received') // User received a request from this person
        }
      } else {
        setStatus('idle')
      }
    }

    checkConnectionStatus()
  }, [receiverId])

  async function handleSendRequest() {
    if (!currentUserId) {
      alert('Please wait while we verify your account...')
      return
    }

    // Double-check that no request already exists before sending
    if (status !== 'idle' && status !== 'rejected') {
      console.warn('Attempted to send request when status is:', status)
      return
    }

    setLoading(true)
    try {
      // Check for existing request one more time to prevent duplicates
      const { data: existing } = await supabase
        .from('sample_connection_requests')
        .select('id')
        .eq('sender_id', currentUserId)
        .eq('receiver_id', receiverId)
        .maybeSingle()

      if (existing) {
        setStatus('pending')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('sample_connection_requests')
        .insert({
          sender_id: currentUserId,
          receiver_id: receiverId,
          status: 'pending',
        })
        .select()
        .single()

      if (error) {
        console.error('Error sending connection request:', error)
        // Handle duplicate key error gracefully
        if (error.code === '23505' || error.message.includes('duplicate')) {
          setStatus('pending')
        } else {
          alert('Failed to send connection request: ' + error.message)
        }
      } else {
        setStatus('pending')
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Failed to send connection request')
    } finally {
      setLoading(false)
    }
  }

  // Don't show button if user is viewing their own profile
  if (!currentUserId || currentUserId === receiverId) {
    return null
  }

  // Render based on status
  if (status === 'accepted') {
    return (
      <button
        disabled
        className="w-full mt-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium cursor-not-allowed"
      >
        ✓ Connected
      </button>
    )
  }

  if (status === 'pending') {
    return (
      <button
        disabled
        className="w-full mt-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium cursor-not-allowed"
      >
        Request Pending
      </button>
    )
  }

  if (status === 'received') {
    return (
      <button
        disabled
        className="w-full mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium cursor-not-allowed"
      >
        Request Received
      </button>
    )
  }

  if (status === 'rejected') {
    return (
      <button
        onClick={handleSendRequest}
        disabled={loading}
        className="w-full mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Request Again'}
      </button>
    )
  }

  // Default: idle state - show send request button
  return (
    <button
      onClick={handleSendRequest}
      disabled={loading}
      className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
    >
      {loading ? 'Sending...' : 'Send Connection Request'}
    </button>
  )
}

