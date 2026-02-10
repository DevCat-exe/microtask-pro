'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { AlertCircle, ArrowLeft } from 'lucide-react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (err: string | null) => {
    switch (err) {
      case 'Configuration':
        return 'There is a problem with the server configuration. Check if your NEXTAUTH_SECRET is set.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.';
      case 'Verification':
        return 'The verification link has expired or has already been used.';
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'EmailCreateAccount':
      case 'Callback':
      case 'OAuthAccountNotLinked':
      case 'EmailSignin':
      case 'CredentialsSignin':
        return 'An error occurred during the authentication process. Please try again.';
      case 'SessionRequired':
        return 'Please sign in to access this page.';
      default:
        return 'An unexpected authentication error occurred.';
    }
  };

  return (
    <>
      <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-10 shadow-2xl overflow-hidden relative group">
        <div className="size-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 mx-auto mb-6">
          <AlertCircle className="size-8 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">Security Alert</h1>
        <p className="text-slate-400 font-medium mb-8">
          {getErrorMessage(error)}
        </p>

        <Link
          href="/auth/login"
          className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white font-bold hover:bg-white/10 transition-all group"
        >
          <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>
      </div>

      <p className="mt-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">
        Protocol: {error || 'Undefined'} Auth Failure
      </p>
    </>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-[#0a0f0b]">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10 text-center"
      >
        <Suspense fallback={
          <div className="glass-morphism rounded-[2.5rem] border border-white/10 p-10 shadow-2xl animate-pulse">
            <div className="size-16 bg-white/5 rounded-2xl mx-auto mb-6" />
            <div className="h-8 bg-white/5 w-3/4 mx-auto mb-4 rounded" />
            <div className="h-12 bg-white/5 w-full rounded" />
          </div>
        }>
          <ErrorContent />
        </Suspense>
      </motion.div>
    </div>
  );
}
