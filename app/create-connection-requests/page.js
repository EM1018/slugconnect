/**
 * Utility page to create sample connection requests
 * This page will create connection requests from all users to Sam Jo
 * 
 * Usage: Navigate to /create-connection-requests while logged in as Sam Jo
 */

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function CreateConnectionRequestsPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [results, setResults] = useState(null)
  const [resetMode, setResetMode] = useState(false)

  console.log('CreateConnectionRequestsPage rendered')

  async function createConnectionRequests() {
    setLoading(true)
    setMessage('')
    setResults(null)

    try {
      // Get current user (should be Sam Jo)
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        setMessage('Error: Please sign in first')
        setLoading(false)
        return
      }

      // Get Sam Jo's profile from dummy_data to confirm
      const { data: samJoProfile, error: profileError } = await supabase
        .from('dummy_data')
        .select('id, name')
        .eq('id', user.id)
        .single()

      if (profileError || !samJoProfile) {
        setMessage('Error: Could not find your profile. Please complete onboarding first.')
        setLoading(false)
        return
      }

      const samJoId = user.id
      console.log('Sam Jo ID:', samJoId, 'Name:', samJoProfile.name)

      // Get all other users from dummy_data (excluding Sam Jo)
      const { data: allUsers, error: usersError } = await supabase
        .from('dummy_data')
        .select('id, name')
        .neq('id', samJoId)

      if (usersError) {
        setMessage('Error fetching users: ' + usersError.message)
        setLoading(false)
        return
      }

      if (!allUsers || allUsers.length === 0) {
        setMessage('No other users found in the database')
        setLoading(false)
        return
      }

      console.log(`Found ${allUsers.length} other users`)

      // If reset mode, delete all existing requests (both pending and accepted) first
      if (resetMode) {
        // Delete all requests where user is receiver (both pending and accepted)
        const { error: deleteReceiverError } = await supabase
          .from('sample_connection_requests')
          .delete()
          .eq('receiver_id', samJoId)

        // Also delete all requests where user is sender (both pending and accepted)
        const { error: deleteSenderError } = await supabase
          .from('sample_connection_requests')
          .delete()
          .eq('sender_id', samJoId)

        if (deleteReceiverError || deleteSenderError) {
          console.error('Error deleting existing requests:', deleteReceiverError || deleteSenderError)
          // Continue anyway - might be no existing requests
        } else {
          console.log('Deleted all existing connection requests (pending and accepted)')
        }
      }

      // Check if requests already exist to avoid duplicates (only if not resetting)
      let existingSenderIds = new Set()
      if (!resetMode) {
        const { data: existingRequests } = await supabase
          .from('sample_connection_requests')
          .select('sender_id, receiver_id')
          .eq('receiver_id', samJoId)

        existingSenderIds = new Set(
          (existingRequests || []).map(r => r.sender_id)
        )
      }

      // Create connection requests from each user to Sam Jo (skip if already exists and not resetting)
      const requests = allUsers
        .filter(sender => !existingSenderIds.has(sender.id))
        .map((sender, index) => ({
          sender_id: sender.id,
          receiver_id: samJoId,
          status: 'pending',
          created_at: new Date(Date.now() - (allUsers.length - index) * 60000).toISOString() // Stagger timestamps
        }))

      if (requests.length === 0 && !resetMode) {
        setMessage('All connection requests already exist! Enable "Reset existing requests" to recreate them.')
        setLoading(false)
        return
      }

      console.log(`Creating ${requests.length} new connection requests...`)

      // Insert all requests
      const { data: inserted, error: insertError } = await supabase
        .from('sample_connection_requests')
        .insert(requests)
        .select()

      if (insertError) {
        setMessage('Error creating requests: ' + insertError.message)
        console.error('Insert error:', insertError)
        setLoading(false)
        return
      }

      const createdUsers = requests.map(r => {
        const user = allUsers.find(u => u.id === r.sender_id)
        return user?.name || 'Unknown'
      })

      setResults({
        created: inserted?.length || 0,
        totalUsers: allUsers.length,
        skipped: allUsers.length - requests.length,
        users: createdUsers
      })
      setMessage(`Successfully created ${inserted?.length || 0} connection requests!${requests.length < allUsers.length ? ` (${allUsers.length - requests.length} already existed)` : ''}`)
      
    } catch (error) {
      console.error('Error:', error)
      setMessage('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', padding: '24px' }}>
      <div style={{ maxWidth: '672px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
          Create Sample Connection Requests
        </h1>
        <p style={{ fontSize: '14px', color: '#475569', marginBottom: '16px' }}>
          This will create connection requests from all users in the database to your account (Sam Jo).
          Make sure you're logged in as Sam Jo before running this.
        </p>

        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={resetMode}
              onChange={(e) => setResetMode(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px', color: '#475569' }}>
              Reset all connections (delete ALL pending requests AND accepted connections, then recreate pending requests)
            </span>
          </label>
          {resetMode && (
            <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '8px', marginLeft: '24px' }}>
              ⚠️ Warning: This will delete all your connections (both pending and accepted)!
            </p>
          )}
        </div>

        <button
          onClick={createConnectionRequests}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: loading ? '#666' : '#000',
            color: '#fff',
            borderRadius: '12px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            marginBottom: '16px',
            display: 'block'
          }}
        >
          {loading ? 'Creating requests...' : 'Create Connection Requests'}
        </button>

        {message && (
          <div style={{
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px',
            backgroundColor: message.includes('Error') ? '#fef2f2' : '#f0fdf4',
            color: message.includes('Error') ? '#991b1b' : '#166534'
          }}>
            <p>{message}</p>
          </div>
        )}

        {results && (
          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
            <p style={{ fontWeight: '600', marginBottom: '8px' }}>Results:</p>
            <p>Created {results.created} connection requests from {results.totalUsers} users</p>
            {results.skipped > 0 && (
              <p style={{ fontSize: '14px', color: '#2563eb', marginTop: '4px' }}>
                ({results.skipped} requests already existed and were skipped)
              </p>
            )}
            <div style={{ marginTop: '12px' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Users who sent requests:</p>
              <ul style={{ fontSize: '14px', listStyle: 'disc', paddingLeft: '20px', maxHeight: '160px', overflowY: 'auto' }}>
                {results.users.map((name, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{name}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            After creating requests, go to <a href="/connections" style={{ color: '#2563eb', textDecoration: 'underline' }}>/connections</a> to see them.
          </p>
        </div>
      </div>
    </div>
  )
}

