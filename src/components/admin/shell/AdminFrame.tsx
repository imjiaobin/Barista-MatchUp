'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { IconType } from 'react-icons'
import { FiBarChart2, FiCalendar, FiFileText, FiGrid, FiInbox, FiLogOut, FiMenu, FiMoon, FiSettings, FiSidebar, FiSmile, FiSun, FiX } from 'react-icons/fi'
import { logout } from '../../../lib/actions/auth'
import { cn } from '../ui/cn'

type NavItem = { label: string; href: string; icon: IconType; exact?: boolean }

// 新增後台頁面時只改這裡
const NAV: NavItem[] = [
  { label: '總覽', href: '/admin', icon: FiGrid, exact: true },
  { label: '活動', href: '/admin/events', icon: FiCalendar },
  { label: '詢問表單', href: '/admin/submissions', icon: FiInbox },
  { label: '滿意度', href: '/admin/satisfaction', icon: FiSmile },
  { label: '統計分析', href: '/admin/stats', icon: FiBarChart2 },
  { label: '頁面文案', href: '/admin/content', icon: FiFileText },
  { label: '設定', href: '/admin/settings', icon: FiSettings },
]

const setCookie = (k: string, v: string) => { document.cookie = `${k}=${v}; path=/admin; max-age=31536000; samesite=lax` }

export default function AdminFrame({ children, defaultCollapsed, defaultTheme }: { children: React.ReactNode; defaultCollapsed: boolean; defaultTheme: 'light' | 'dark' }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [theme, setTheme] = useState(defaultTheme)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleCollapsed = () => { setCollapsed(!collapsed); setCookie('admin-sidebar', !collapsed ? 'collapsed' : 'expanded') }
  const toggleTheme = () => { const next = theme === 'dark' ? 'light' : 'dark'; setTheme(next); setCookie('admin-theme', next) }
  const isActive = (item: NavItem) => (item.exact ? pathname === item.href : pathname.startsWith(item.href))

  const nav = (compact: boolean) => (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map((item) => {
        const Icon = item.icon
        const active = isActive(item)
        return (
          <Link
            key={item.href} href={item.href} title={compact ? item.label : undefined} onClick={() => setMobileOpen(false)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex h-9 items-center gap-3 whitespace-nowrap rounded-full px-3 text-sm transition-colors',
              compact && 'justify-center px-0',
              active ? 'bg-sidebar-active font-medium text-sidebar-active-foreground' : 'text-sidebar-foreground/80 hover:bg-sidebar-active/50 hover:text-sidebar-foreground',
            )}
          >
            <Icon size={16} aria-hidden className="shrink-0" />
            {!compact && item.label}
          </Link>
        )
      })}
    </nav>
  )

  const brand = (compact: boolean) => (
    <Link href="/admin" className={cn('flex h-9 items-center gap-2 px-2 text-base font-medium tracking-wide text-sidebar-foreground', compact && 'justify-center px-0')}>
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm text-primary-foreground">P</span>
      {!compact && 'Pourfolio 後台'}
    </Link>
  )

  const logoutButton = (compact: boolean) => (
    <form action={logout}>
      <button type="submit" title={compact ? '登出' : undefined} className={cn('flex h-9 w-full items-center gap-3 whitespace-nowrap rounded-full px-3 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-active/50 hover:text-sidebar-foreground', compact && 'justify-center px-0')}>
        <FiLogOut size={16} aria-hidden className="shrink-0" />
        {!compact && '登出'}
      </button>
    </form>
  )

  return (
    <div data-admin-root className={cn('min-h-screen bg-background font-admin font-normal text-foreground', theme === 'dark' && 'dark')}>
      <div className="flex min-h-screen">
        <aside className={cn('sticky top-0 hidden h-screen shrink-0 flex-col gap-6 bg-sidebar px-3 py-4 transition-[width] duration-200 lg:flex', collapsed ? 'w-(--sidebar-width-collapsed)' : 'w-(--sidebar-width)')}>
          {brand(collapsed)}
          {nav(collapsed)}
          {logoutButton(collapsed)}
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <aside className="absolute inset-y-0 left-0 flex w-(--sidebar-width) flex-col gap-6 bg-sidebar px-3 py-4 shadow-modal">
              <div className="flex items-center justify-between">{brand(false)}
                <button type="button" aria-label="關閉選單" onClick={() => setMobileOpen(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-sidebar-active/50"><FiX size={16} /></button>
              </div>
              {nav(false)}
              {logoutButton(false)}
            </aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-(--header-height) items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur lg:px-6">
            <button type="button" aria-label="開啟選單" onClick={() => setMobileOpen(true)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted lg:hidden"><FiMenu size={16} /></button>
            <button type="button" aria-label={collapsed ? '展開側欄' : '收合側欄'} onClick={toggleCollapsed} className="hidden h-9 w-9 place-items-center rounded-full hover:bg-muted lg:grid"><FiSidebar size={16} /></button>
            <div className="ml-auto flex items-center gap-1">
              <button type="button" aria-label={theme === 'dark' ? '切換淺色模式' : '切換深色模式'} onClick={toggleTheme} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted">
                {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
              </button>
            </div>
          </header>
          <main className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
