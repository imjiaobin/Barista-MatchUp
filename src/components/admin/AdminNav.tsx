'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiCalendar, FiFileText, FiInbox, FiLogOut, FiSettings } from 'react-icons/fi'
import { logout } from '../../lib/actions/auth'

const links = [
  { label: '活動', path: '/admin/events', icon: FiCalendar },
  { label: '詢問表單', path: '/admin/submissions', icon: FiInbox },
  { label: '頁面文案', path: '/admin/content', icon: FiFileText },
  { label: '設定', path: '/admin/settings', icon: FiSettings },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-stone-200 bg-white">
      <div className="p-6">
        <Link href="/admin" className="text-lg font-medium tracking-wide text-indigo">
          Pourfolio 後台
        </Link>
      </div>
      <nav className="flex md:flex-col gap-1 px-3 pb-4 overflow-x-auto">
        {links.map(({ label, path, icon: Icon }) => (
          <Link
            key={path}
            href={path}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-sm whitespace-nowrap transition-colors duration-200 ${
              pathname.startsWith(path) ? 'bg-brown/10 text-brown' : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm whitespace-nowrap text-stone-400 hover:text-brown hover:bg-stone-50 transition-colors duration-200"
          >
            <FiLogOut size={16} />
            登出
          </button>
        </form>
      </nav>
    </aside>
  )
}
