"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Lock, FileText, Settings, ChevronRight, X } from 'lucide-react'; // Tambah icon X
import { Squash as Hamburger } from 'hamburger-react';
import gsap from 'gsap';

// Style Glass
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
  const navLinksRef = useRef([]); 
  const closeButtonRef = useRef(null); // Ref untuk animasi tombol X
  const pathname = usePathname(); 
  const [particles, setParticles] = useState([]);

  // Setup Particles
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
    const links = navLinksRef.current;
    const closeBtn = closeButtonRef.current;

    // Reset posisi awal
    if(!isOpen) {
        gsap.set(links, { x: 50, opacity: 0 });
        gsap.set(closeBtn, { opacity: 0, rotate: -90 });
    }

    if (isOpen) {
      // --- OPEN ANIMATION ---
      document.body.style.overflow = 'hidden'; 

      // 1. Slide menu masuk
      gsap.to(menu, { x: 0, duration: 0.6, ease: 'expo.out' });
      
      // 2. Fade in overlay
      gsap.to(overlay, { autoAlpha: 1, duration: 0.4 });

      // 3. Munculkan tombol Close (X)
      gsap.to(closeBtn, { opacity: 1, rotate: 0, duration: 0.5, delay: 0.3, ease: 'back.out(1.5)' });

      // 4. Stagger Link
      gsap.to(links, { 
        x: 0, 
        opacity: 1, 
        duration: 0.4, 
        stagger: 0.1, 
        delay: 0.2, 
        ease: 'back.out(1.2)' 
      });

    } else {
      // --- CLOSE ANIMATION ---
      document.body.style.overflow = ''; 

      gsap.to(menu, { x: '100%', duration: 0.5, ease: 'power3.inOut' });
      gsap.to(overlay, { autoAlpha: 0, duration: 0.3 });
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
           <img src="/logo.png" alt="Shtt Logo" width={40} height={40} className="rounded-xl shadow-lg border border-white/10" />
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-sky-200 bg-clip-text text-transparent hover:opacity-80 transition">
            Shtt<span className="text-xs font-mono text-white/40 ml-1">v1.0</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
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
                <div className={`${isActive ? 'translate-x-0.5' : 'translate-x-0' } transition-transform duration-300 flex items-center gap-3`}>
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
        <header className="md:hidden top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10 shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between px-6 py-4">
            
            {/* Logo & Brand Name (Grouped) */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative overflow-hidden rounded-xl border border-white/10 shadow-sm group-hover:shadow-sky-500/20 transition-all">
                <img 
                  src="/logo.png" 
                  alt="Shtt Logo" 
                  width={36} 
                  height={36} 
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:from-sky-400 group-hover:to-blue-400 transition-all">
                Shtt
              </span>
            </Link>

            {/* Hamburger Menu */}
            <div className="relative z-50">
              <Hamburger 
                toggled={isOpen} 
                toggle={setIsOpen} 
                color={isOpen ? "#ef4444" : "#ffffff"}
                size={24} 
                rounded 
                label="Show menu"
              />
            </div>

          </div>
        </header>

        {/* Overlay Background */}
        <div 
            ref={overlayRef} 
            className="fixed inset-0 bg-black/60 z-[40] md:hidden invisible opacity-0 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)} 
        />

        {/* --- MOBILE SLIDE MENU --- */}
        <div 
            ref={mobileMenuRef} 
            className="fixed top-0 right-0 h-full w-80 bg-slate-900/30 backdrop-blur-3xl border-l border-white/20 shadow-2xl z-[50] md:hidden translate-x-full px-6 flex flex-col"
        >
            {/* HEADER MENU (Tombol X) */}
            <div className="flex justify-end pt-6 pb-8 border-b border-white/10 mb-4">
                <button 
                    ref={closeButtonRef}
                    onClick={() => setIsOpen(false)}
                    className={`${liquidGlassStyle} p-2 rounded-full hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 group`}
                >
                    <X size={24} className="text-gray-300 group-hover:text-white" />
                </button>
            </div>

            {/* MENU ITEMS */}
            <div className="flex flex-col gap-2 overflow-y-auto flex-1 pb-10">
                {navItems.map((item, index) => (
                    <div key={item.href} ref={el => navLinksRef.current[index] = el} className="opacity-0">
                        <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-4 py-4 px-4 rounded-2xl font-medium text-lg transition-all ${
                                pathname === item.href 
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/20' 
                                : 'text-gray-300 hover:text-white border-b border-white/5 hover:pl-6'
                            }`}
                        >
                            <item.icon size={20} className={pathname === item.href ? "text-sky-400" : "text-gray-500"} />
                            {item.label}
                        </Link>
                    </div>
                ))}
            </div>
            
            {/* Footer Kecil di Menu */}
            <div className="py-6 text-center text-xs text-gray-500 opacity-60">
                Shtt Encryption Tools v1.0
            </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full">
           {children}
        </main>
      </div>
    </div>
  );
}