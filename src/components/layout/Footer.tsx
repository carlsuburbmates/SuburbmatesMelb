import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, Linkedin, ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-black pt-24 pb-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-16 mb-24">
          
          {/* Brand - Strategic Identity */}
          <div className="md:col-span-2 lg:col-span-3">
            <Link href="/" className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-black overflow-hidden">
                <Image
                  src="/icon.png"
                  alt="SM"
                  width={40}
                  height={40}
                  className="object-cover grayscale brightness-200"
                />
              </div>
              <span className="text-xl font-black text-black uppercase tracking-[0.3em]">
                Suburbmates
              </span>
            </Link>
            <p className="text-xl font-bold text-black tracking-tighter uppercase leading-none max-w-sm mb-8">
              Melbourne&rsquo;s Digital Neighbourhood Feed.
            </p>
            <p className="text-sm text-slate-500 font-medium max-w-sm leading-relaxed mb-8">
              Discovery-first directory for local creators and studios. 
              Connecting the Victorian creative network through a high-frequency digital signal.
            </p>
            
            {/* Social Signal */}
            <div className="flex gap-6">
              {[
                { icon: Instagram, label: "Studio IG" },
                { icon: Twitter, label: "Network X" },
                { icon: Linkedin, label: "Professional" },
              ].map((social, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="text-black hover:text-slate-400 transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                >
                  <social.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Directory Links */}
          <div className="lg:col-span-1">
            <h4 className="text-[10px] font-black text-black uppercase tracking-[0.3em] mb-8 border-b border-black pb-2">
              Navigation
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'Directory', href: '/directory' },
                { label: 'About Us', href: '/about' },
                { label: 'Help Centre', href: '/help' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[10px] font-black text-slate-500 hover:text-black uppercase tracking-[0.2em] flex items-center group">
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Network */}
          <div className="lg:col-span-1">
             <h4 className="text-[10px] font-black text-black uppercase tracking-[0.3em] mb-8 border-b border-black pb-2">
              Legal
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'Privacy', href: '/privacy' },
                { label: 'Terms', href: '/terms' },
                { label: 'Cookies', href: '/cookies' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[10px] font-black text-slate-500 hover:text-black uppercase tracking-[0.2em] flex items-center group">
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Support */}
          <div className="lg:col-span-1">
            <h4 className="text-[10px] font-black text-black uppercase tracking-[0.3em] mb-8 border-b border-black pb-2">
              Direct
            </h4>
            <a 
              href="mailto:hello@suburbmates.com.au" 
              className="text-[10px] font-black text-slate-500 hover:text-black uppercase tracking-[0.2em] block hover:underline decoration-2 underline-offset-8"
            >
              hello@suburbmates.com.au
            </a>
          </div>
        </div>

        {/* Bottom Bar - Absolute Minimalism */}
        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 md:mb-0">
            © 2026 Suburbmates. Local Signal Verified.
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Melbourne, Victoria
          </div>
        </div>
      </div>
    </footer>
  );
}
