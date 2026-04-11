'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Plus, BarChart2, LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import Cookies from 'js-cookie';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/resume/new', label: 'Yangi Rezume', icon: Plus },
  { href: '/dashboard/stats', label: 'Statistika', icon: BarChart2 },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    const refresh = Cookies.get('refresh_token');
    await logout(refresh);
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-ink-50 flex">

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className="w-60 bg-ink-950 border-r border-ink-800 flex flex-col fixed inset-y-0 left-0 z-40">

        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-ink-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <svg width="28" height="33" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="0" width="44" height="56" rx="6" fill="#f59e0b"/>
              <polygon points="34,0 48,0 48,14" fill="#b45309"/>
              <polygon points="34,0 34,14 48,14" fill="#d97706"/>
              <text x="9" y="43" fontFamily="Georgia,serif" fontSize="34" fontWeight="700" fill="#1e1a17">R</text>
              <circle cx="54" cy="50" r="10" fill="#e5e0d8"/>
              <text x="54" y="55" fontFamily="Georgia,serif" fontSize="12" fontWeight="700" fill="#1e1a17" textAnchor="middle">AI</text>
            </svg>
            <span className="font-display text-xl font-bold text-amber-400">
              Resume<span className="text-ink-300">AI</span>
            </span>
          </Link>
        </div>

        {/* Author badge */}
        <div className="px-3 pt-3 pb-1">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 text-center">
            <p className="text-[10px] text-amber-600/70 font-medium uppercase tracking-wider mb-0.5">Muallif</p>
            <p className="text-amber-400 text-xs font-bold leading-tight">MurodovShohruh</p>
            <p className="text-amber-600/60 text-[10px] mt-0.5">༺ 𒆜ASC𒆜 ༻</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname === href
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800'
              )}>
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-ink-800">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1">
            <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={15} className="text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-ink-200 text-sm font-medium truncate">{user?.full_name}</p>
              <p className="text-ink-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              text-ink-400 hover:text-red-400 hover:bg-red-400/10 transition-colors">
            <LogOut size={16} />
            Chiqish
          </button>
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main className="ml-60 flex-1 min-h-screen">
        {children}
      </main>
    </div>
  );
}
