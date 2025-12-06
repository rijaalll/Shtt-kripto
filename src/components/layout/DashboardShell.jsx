"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook Next.js untuk cek URL aktif
import { Shield, Lock, FileText, Settings, ChevronRight } from 'lucide-react';
import { Squash as Hamburger } from 'hamburger-react';
import gsap from 'gsap';

// Style Glass yang sama dengan Home
const liquidGlassStyle = `
  backdrop-blur-xl bg-white/5 border border-white/10 saturate-120 
  shadow-[inset_2px_2px_3px_-1px_#ffffff20,inset_-2px_-2px_3px_-1px_#ffffff20,0_4px_12px_-2px_#00000050] 
  text-white/90
`;

const navItems = [
  { href: '/dash/hill', label: 'Hill Cipher', icon: Shield },
  { href: '/dash/caesar', label: 'Caesar Cipher', icon: Lock },
  { href: '/dash/vigenere', label: 'Vigenere Cipher', icon: FileText },
  { href: '/dash/settings', label: 'Settings', icon: Settings },
];

export default function DashboardShell({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const overlayRef = useRef(null);
  const pathname = usePathname(); // Mendapatkan URL saat ini
  const [particles, setParticles] = useState([]);

  // Setup Particles (Sama seperti sebelumnya)
  useEffect(() => {
    const p = [...Array(15)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 5 + Math.random() * 5,
      delay: Math.random() * 3,
      bit: Math.random() > 0.5 ? "1" : "0",
    }));
    setParticles(p);
  }, []);

  // GSAP Animation Mobile Menu
  useEffect(() => {
    const menu = mobileMenuRef.current;
    const overlay = overlayRef.current;
    if (isOpen) {
      gsap.to(menu, { x: 0, duration: 0.6, ease: 'expo.out' });
      gsap.to(overlay, { opacity: 1, display: 'block', duration: 0.4 });
    } else {
      gsap.to(menu, { x: '100%', duration: 0.5, ease: 'power3.inOut' });
      gsap.to(overlay, { opacity: 0, duration: 0.3, onComplete: () => gsap.set(overlay, { display: 'none' }) });
    }
  }, [isOpen]);

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-sky-500/30 flex overflow-hidden relative">
      
      {/* Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p, i) => (
          <div key={i} className="absolute text-sky-500/10 font-mono text-xs"
            style={{ left: p.left, top: p.top, animation: `float ${p.duration}s ease-in-out infinite`, animationDelay: `${p.delay}s` }}>
            {p.bit}
          </div>
        ))}
      </div>

      {/* --- DESKTOP SIDEBAR --- */}
      <aside className={`hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 z-30 ${liquidGlassStyle} border-r border-white/10`}>
        <div className="p-8 flex items-center gap-3">
           {/* Ganti src logo sesuai file Anda */}
           <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30"></div> 
           <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-sky-200 bg-clip-text text-transparent hover:opacity-80 transition">
            Shtt<span className="text-xs font-mono text-white/40 ml-1">v1.0</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Cek apakah URL aktif mengandung href item
            const isActive = pathname === item.href; 
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-sky-500/20 border border-sky-500/30 text-sky-300 shadow-[0_0_15px_-3px_rgba(56,189,248,0.3)]' 
                    : 'hover:bg-white/5 text-gray-400 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? "text-sky-400" : "text-gray-500 group-hover:text-white transition-colors"} />
                  <span className="font-medium tracking-wide">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={16} className="text-sky-400 animate-pulse" />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* --- MOBILE CONTENT WRAPPER --- */}
      <div className="flex-1 md:ml-72 flex flex-col relative z-10 w-full min-w-0">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-6 border-b border-white/10 backdrop-blur-md sticky top-0 z-40 bg-slate-900/50">
           <Link href="/" className="text-xl font-bold text-sky-400">Shtt</Link>
           <div className="z-50">
             <Hamburger toggled={isOpen} toggle={setIsOpen} color="#ffffff" size={24} rounded />
           </div>
        </header>

        {/* Mobile Slide Menu (Transparan Blur) */}
        <div ref={overlayRef} className="fixed inset-0 bg-black/60 z-40 md:hidden hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        <div ref={mobileMenuRef} className="fixed top-0 right-0 h-full w-72 bg-slate-900/30 backdrop-blur-3xl border-l border-white/20 shadow-2xl z-40 md:hidden translate-x-full pt-24 px-6">
            <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-left py-4 px-4 rounded-xl font-medium text-lg transition-all ${
                            pathname === item.href 
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/20' 
                            : 'text-gray-300 hover:text-white border-b border-white/5'
                        }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>

        {/* MAIN CONTENT (Children dari page.js masing-masing) */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full">
           {children}
        </main>
      </div>

      <style jsx global>{`
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(180deg); } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; transform: translateY(20px); }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}