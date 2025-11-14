/**
 * 
 * /app/(route_group)/layout.js responsible for having the navbar
 * persist across different pages.
 * 
 */

import NavBar from '@/components/NavBar'

export default function NavLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  )
}

