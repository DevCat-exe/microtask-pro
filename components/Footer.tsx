import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0a0f0b] pt-32 pb-16 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-3 mb-8 group">
            <div className="size-8 text-primary transition-transform group-hover:scale-110">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V44Z" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-white text-xl font-black tracking-tight">MicroTask</h2>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs font-medium">
            Next-generation decentralized labor protocol. Empowering the global workforce through secure, micro-task excellence.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">System</h4>
          <ul className="flex flex-col gap-5 text-[13px] text-slate-500 font-bold uppercase tracking-widest">
            <li><Link href="/about" className="hover:text-white transition-colors">Core</Link></li>
            <li><Link href="/careers" className="hover:text-white transition-colors">Nodes</Link></li>
            <li><Link href="/press" className="hover:text-white transition-colors">Media</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Support</Link></li>
          </ul>
        </div>

        {/* Resources Links */}
        <div>
          <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Resources</h4>
          <ul className="flex flex-col gap-5 text-[13px] text-slate-500 font-bold uppercase tracking-widest">
            <li><Link href="/worker-guide" className="hover:text-white transition-colors">Manuals</Link></li>
            <li><Link href="/buyer-policy" className="hover:text-white transition-colors">Protocols</Link></li>
            <li><Link href="/api-docs" className="hover:text-white transition-colors">Interface</Link></li>
            <li><Link href="/success-stories" className="hover:text-white transition-colors">Archive</Link></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-8">Security</h4>
          <ul className="flex flex-col gap-5 text-[13px] text-slate-500 font-bold uppercase tracking-widest">
            <li><Link href="/terms" className="hover:text-white transition-colors">Nexus Terms</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Shield</Link></li>
            <li><Link href="/verification" className="hover:text-white transition-colors">Compliance</Link></li>
            <li><Link href="/conflict" className="hover:text-white transition-colors">Resolution</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 mt-16">
          <div className="flex items-center gap-8">
            <a href="#" className="text-slate-600 hover:text-primary transition-all hover:scale-110">
              <span className="material-symbols-outlined text-xl!">language</span>
            </a>
            <a href="https://github.com/Admin/Worker" target="_blank" className="text-slate-600 hover:text-primary transition-all hover:scale-110">
              <span className="material-symbols-outlined text-xl!">terminal</span>
            </a>
          </div>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
            © 2024 MicroTask Nexus. Terminal v2.0.4
          </p>
        </div>
      </div>
    </footer>
  );
}