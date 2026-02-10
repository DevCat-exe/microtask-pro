'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { motion } from 'motion/react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Access Granted');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      toast.error('Authentication Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-[#0a0f0b]">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
             <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-2xl!">toll</span>
             </div>
             <span className="text-2xl font-black text-white tracking-tight">MicroTask</span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 font-medium">
            Continue your journey or{' '}
            <Link href="/auth/register" className="text-primary hover:underline font-bold">
              join our workforce
            </Link>
          </p>
        </div>

        <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-10 shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-primary text-[#0a0f0b] font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group/btn"
            >
              {isLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <span className="material-symbols-outlined text-xl! group-hover/btn:translate-x-1 transition-transform">login</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 relative z-10">
            <div className="relative flex items-center gap-4 text-xs font-black text-slate-600 uppercase tracking-[0.2em] mb-8">
              <div className="flex-1 h-px bg-white/10" />
              Secure Protocol
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white font-bold hover:bg-white/10 transition-all group"
            >
               <svg className="size-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              GOOGLE BRO
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
          End-to-End Encrypted Tunnel • Built for Scale
        </p>
      </motion.div>
    </div>
  );
}