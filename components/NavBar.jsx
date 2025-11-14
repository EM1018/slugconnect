/**
 * 
 * NavBar componenet that appears in three routes: /discover, /connections, and /profile
 * and allows us to navigate between those routes.
 */
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/discover', label: 'Discover' },
  { href: '/connections', label: 'Connections' },
  { href: '/profile', label: 'My Profile' },
]

export default function NavBar() {
  const pathname = usePathname()

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
        </nav>
      </div>
    </header>
  )
}
