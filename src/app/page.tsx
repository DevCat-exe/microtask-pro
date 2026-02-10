'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'motion/react';

const heroSlides = [
  {
    title: 'Turn Small Tasks into',
    highlight: 'Big Earnings',
    description: "The world's fastest-growing marketplace for micro-jobs. Start earning coins today or post your tasks to get things done quickly with our global workforce.",
  },
  {
    title: 'Join Millions of',
    highlight: 'Global Workers',
    description: 'Connect with businesses worldwide and complete tasks from the comfort of your home. Flexible hours, instant payments.',
  },
  {
    title: 'Get Your Tasks Done',
    highlight: 'Fast & Reliable',
    description: 'Post your micro-tasks and watch them get completed by our verified workforce. Quality results, transparent pricing.',
  },
];

const topWorkers = [
  { name: 'Alex Rivera', role: 'Top Rated', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop', coins: 15400, successRate: 99 },
  { name: 'Sarah Chen', role: 'Top Rated', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop', coins: 14200, successRate: 100 },
  { name: 'Marcus Volt', role: 'Top Rated', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop', coins: 12850, successRate: 97 },
  { name: 'Elena Gray', role: 'Expert Researcher', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop', coins: 11900, successRate: 98 },
  { name: 'David Park', role: 'Data Specialist', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop', coins: 10500, successRate: 95 },
  { name: 'Jasmine Low', role: 'Content Moderator', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&h=150&auto=format&fit=crop', coins: 9800, successRate: 99 },
];

const testimonials = [
  {
    name: 'James Wilson',
    role: 'Micro-Worker since 2022',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&h=100&auto=format&fit=crop',
    quote: "I started using MicroTask to earn a bit of extra pocket money, but it's quickly become my main side hustle. The payouts are instant and the platform is so intuitive.",
  },
  {
    name: 'Lisa K. Thompson',
    role: 'Enterprise Buyer',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&h=100&auto=format&fit=crop',
    quote: "As a business owner, getting data entry tasks done used to take weeks. Now, I post a task here and it's finished by verified workers in hours. Highly recommended!",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="aspect-21/9 min-h-125 rounded-[3.5rem] overflow-hidden relative group">
            {/* Background Overlay */}
            <div className="absolute inset-0 z-0 opacity-40 bg-cover bg-center transition-all duration-1000" 
                 style={{ 
                   backgroundImage: `linear-gradient(rgba(16, 34, 22, 0.8), rgba(16, 34, 22, 0.9)), url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop")`
                 }} 
            />
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-4xl flex flex-col gap-6"
              >
                <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-tight">
                  {heroSlides[currentSlide].title} <span className="text-primary">{heroSlides[currentSlide].highlight}</span>
                </h1>
                <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                  {heroSlides[currentSlide].description}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-6 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
                  <a href="/dashboard/worker" className="min-w-45 h-16 bg-primary text-[#111813] font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20">
                    Explore Missions
                  </a>
                  <a href="/dashboard/buyer" className="min-w-45 h-16 bg-white/10 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-white/20 transition-all border border-white/10 backdrop-blur-xl">
                    Post a Project
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 flex justify-center gap-2 z-10">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    index === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        </section>

        {/* Top Workers Section */}
        <section id="best-workers" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10 bg-slate-50 dark:bg-background-dark/20 py-24 rounded-4xl border border-slate-100 dark:border-[#28392e]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Top Workers of the Month</h2>
            <Link href="/leaderboard" className="text-primary font-bold text-sm flex items-center gap-1 hover:underline group">
              View All <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">trending_flat</span>
            </Link>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">Meet the most productive members of our global community.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topWorkers.map((worker, index) => (
              <motion.div 
                key={worker.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col gap-4 p-6 bg-white dark:bg-[#1a2e20] rounded-2xl border border-slate-200 dark:border-[#28392e] hover:border-primary/50 transition-all group shadow-sm hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="flex items-center gap-4">
                  <div className="size-20 bg-center bg-no-repeat bg-cover rounded-full border-2 border-primary group-hover:scale-105 transition-transform overflow-hidden relative">
                    <Image src={worker.image} alt={worker.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-slate-900 dark:text-white text-xl font-black">{worker.name}</p>
                    <div className="flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-[18px]!">verified</span>
                      <span className="text-xs font-bold uppercase tracking-wider">{worker.role}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-slate-50 dark:bg-background-dark p-3 rounded-xl border border-slate-100 dark:border-white/5">
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-tight">Earnings</p>
                    <p className="text-primary text-lg font-black">{worker.coins.toLocaleString()} <span className="text-xs">Coins</span></p>
                  </div>
                  <div className="bg-slate-50 dark:bg-background-dark p-3 rounded-xl border border-slate-100 dark:border-white/5">
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-tight">Success</p>
                    <p className="text-slate-900 dark:text-white text-lg font-black">{worker.successRate}%</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight mb-4">What Our Community Says</h2>
            <div className="h-1.5 w-20 bg-primary mx-auto rounded-full" />
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {testimonials.map((t, index) => (
              <motion.div 
                key={t.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex-1 bg-white dark:bg-[#1a2e20] p-8 rounded-3xl border border-slate-200 dark:border-[#28392e] shadow-xl relative overflow-hidden group"
              >
                <div className="absolute -top-4 -right-2 text-primary/10 transition-transform group-hover:scale-110">
                   <span className="material-symbols-outlined text-[120px]! text-primary/10 select-none animate-pulse">format_quote</span>
                </div>
                <div className="relative z-10">
                  <p className="text-slate-700 dark:text-slate-300 text-lg italic font-medium leading-relaxed mb-8">
                    &quot;{t.quote}&quot;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-full border-2 border-primary/30 p-0.5 relative overflow-hidden">
                      <Image src={t.image} alt={t.name} fill className="rounded-full object-cover" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white">{t.name}</p>
                      <p className="text-sm font-bold text-primary">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        </section>

        {/* Features/Stats Section (Extra Section 1) */}
        <section className="w-full max-w-7xl px-4 md:px-10 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Workers', value: '500K+', icon: 'groups' },
              { label: 'Tasks Completed', value: '10M+', icon: 'task_alt' },
              { label: 'Paid Out', value: '$5M+', icon: 'payments' },
              { label: 'Countries', value: '150+', icon: 'public' },
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="size-16 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-[#1a2e20] text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[32px]!">{stat.icon}</span>
                </div>
                <p className="text-4xl font-black text-slate-900 dark:text-white mb-2">{stat.value}</p>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 relative px-6">
        <div className="max-w-7xl mx-auto bg-linear-to-br from-[#111813] to-slate-900 rounded-4xl p-10 md:p-32 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 pattern-grid-lg opacity-40" />
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative z-10 text-white text-4xl md:text-6xl font-black max-w-3xl leading-tight tracking-tight mb-12 mx-auto"
            >
              Ready to join the world&apos;s most productive marketplace?
            </motion.h2>
            <div className="relative z-10 flex flex-wrap gap-6 justify-center">
              <Link href="/auth/register" className="group relative h-16 min-w-55 flex items-center justify-center bg-primary text-[#111813] font-black rounded-2xl transition-all shadow-xl shadow-primary/20 overflow-hidden hover:scale-105 active:scale-95">
                Create Free Account
              </Link>
              <Link href="/tasks" className="flex min-w-55 cursor-pointer items-center justify-center rounded-2xl h-16 px-8 border-2 border-white/20 text-white text-xl font-black hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm">
                Browse Open Tasks
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}