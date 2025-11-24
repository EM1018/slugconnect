'use client'
import React from 'react'

export default function AcceptRejectButtons({
  onAccept,
  onReject,
  disabled = false,
  className = ''
}) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={onAccept}
        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
        disabled={disabled}
      >
        Accept
      </button>

      <button
        onClick={onReject}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
        disabled={disabled}
      >
        Reject
      </button>
    </div>
  )
}
