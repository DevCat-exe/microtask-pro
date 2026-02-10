'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Coins, 
  User, 
  LogOut,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0a0f0b]/80 backdrop-blur-2xl border-b border-white/5 h-16 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-8 whitespace-nowrap">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="size-8 text-primary transition-transform group-hover:scale-110">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V44Z" fillRule="evenodd"></path>
            </svg>
          </div>
          <h2 className="text-white text-xl font-black leading-tight tracking-tight">MicroTask</h2>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex flex-1 justify-end gap-8">
          <nav className="hidden md:flex items-center gap-9">
            {!session ? (
              <>
                <Link href="/#how-it-works" className="text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                  Process
                </Link>
                <Link href="/dashboard/worker/tasks" className="text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                  Missions
                </Link>
                <Link href="/leaderboard" className="text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                  Echelon
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard/notifications" className="relative size-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center group overflow-hidden border border-slate-100 dark:border-white/5">
                   <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[20px]!">notifications</span>
                   <div className="absolute top-2.5 right-2.5 size-2 rounded-full bg-red-500 border-2 border-white dark:border-background-dark animate-pulse" />
                </Link>
                <Link href="/dashboard" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-primary transition-colors text-sm font-medium">
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  <Coins className="h-4 w-4" />
                  {session.user.coins} Coins
                </div>
              </>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex gap-2">
            {!session ? (
              <>
                <Link 
                  href="/auth/register" 
                  className="h-10 px-6 bg-primary text-[#0a0f0b] text-[11px] font-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center justify-center uppercase tracking-widest"
                >
                  Join Nexus
                </Link>
                <Link 
                  href="/auth/login" 
                  className="h-10 px-6 bg-white/5 border border-white/10 text-white text-[11px] font-black rounded-xl hover:bg-white/10 transition-all flex items-center justify-center uppercase tracking-widest"
                >
                  Authorize
                </Link>
                <Link 
                  href="https://github.com/Admin/Worker" 
                  target="_blank"
                  className="flex items-center justify-center overflow-hidden rounded-lg h-10 bg-[#28392e] text-white gap-2 text-sm font-bold px-3 hover:bg-[#344b3c] transition-colors group"
                  title="Join as Developer"
                >
                  <span className="material-symbols-outlined text-[20px]! group-hover:rotate-12 transition-transform">toll</span>
                  <span className="hidden sm:inline">Join as Developer</span>
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-[#28392e] p-1 pr-3 hover:bg-slate-100 dark:hover:bg-[#1a2e20] transition-colors"
                >
                  <div className="relative h-8 w-8 rounded-full overflow-hidden border border-primary/50">
                    <Image 
                      src={session.user.image || '/default-avatar.png'} 
                      alt={session.user.name || ''} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold leading-tight">{session.user.name}</p>
                    <p className="text-[10px] text-slate-500">{session.user.email}</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-[#28392e] bg-white dark:bg-[#1a2e20] shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link 
                      href="/dashboard/profile" 
                      className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-slate-50 dark:hover:bg-background-dark transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setIsProfileOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center justify-center rounded-lg h-10 w-10 border border-slate-200 dark:border-[#28392e] hover:bg-slate-100 dark:hover:bg-[#1a2e20]"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass border-b border-slate-200 dark:border-[#28392e] py-6 px-4 animate-in slide-in-from-top-2 duration-300">
          <nav className="flex flex-col gap-4">
            {!session ? (
              <>
                <Link href="/#how-it-works" className="text-slate-700 dark:text-slate-300 font-bold" onClick={() => setIsMenuOpen(false)}>How it works</Link>
                <Link href="/tasks" className="text-slate-700 dark:text-slate-300 font-bold" onClick={() => setIsMenuOpen(false)}>Tasks</Link>
                <Link href="/leaderboard" className="text-slate-700 dark:text-slate-300 font-bold" onClick={() => setIsMenuOpen(false)}>Leaderboard</Link>
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-[#28392e]">
                  <Link href="/auth/register" className="min-w-21 h-10 flex items-center justify-center rounded-xl bg-primary text-[#111813] text-[13px] font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest">
              Join
            </Link>
                  <Link href="/auth/login" className="min-w-21 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-[13px] font-black hover:bg-slate-100 transition-all border border-slate-100 dark:border-white/5 uppercase tracking-widest">
              Signin
            </Link>
                </div>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold" onClick={() => setIsMenuOpen(false)}>
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Coins className="h-5 w-5" />
                  {session.user.coins} Coins
                </div>
                <Link href="/dashboard/profile" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold" onClick={() => setIsMenuOpen(false)}>
                  <User className="h-5 w-5" />
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-red-500 font-bold"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </nav>
  );
}