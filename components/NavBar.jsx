/**
 * 
 * NavBar componenet that appears in three routes: /discover, /connections, and /profile
 * and allows us to navigate between those routes.
 */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/authService'

const links = [
  { href: '/discover', label: 'Discover' },
  { href: '/connections', label: 'Connections' },
  { href: '/profile', label: 'My Profile' },
]

export default function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-8 px-4">
        {/* Logo */}
        <Link href="/discover" className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-yellow-400 font-semibold">SC</span>
          <span className="text-lg font-semibold">SlugConnect</span>
        </Link>

        {/* Nav links */}
        <nav className="ml-auto flex items-center gap-6">
          {links.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={
                  'text-sm transition-colors hover:text-blue-600 ' +
                  (active ? 'text-blue-600 font-medium' : 'text-slate-600')
                }
              >
                {label}
              </Link>
            )
          })}
          
          {/* Sign Out button */}
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="text-sm text-slate-600 transition-colors hover:text-red-600 disabled:opacity-50"
          >
            {signingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </nav>
      </div>
    </header>
  )
}
