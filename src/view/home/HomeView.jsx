"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Shield, Eye, Zap, ArrowRight, Github, Twitter } from 'lucide-react';
import { Squash as Hamburger } from 'hamburger-react';
import Link from 'next/link';
import gsap from 'gsap';

const HomeView = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const overlayRef = useRef(null);
  const menuItemsRef = useRef([]);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [particles, setParticles] = useState([]);
  const [titleText, setTitleText] = useState('');
  const [subtitleText, setSubtitleText] = useState('');

  const liquidGlassStyle = `
    backdrop-blur bg-white/10 border border-white/10 saturate-120 
    shadow-[inset_2px_2px_3px_-1px_#ffffff70,inset_-2px_-2px_3px_-1px_#ffffff70,inset_0_0_16px_#ffffff50,0_4px_12px_-2px_#ffffff40] 
    text-white/80
  `;

  useEffect(() => {
    // Particles setup
    const p = [...Array(20)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 5 + Math.random() * 5,
      delay: Math.random() * 3,
      bit: Math.random() > 0.5 ? "1" : "0",
    }));
    setParticles(p);
  }, []);

  useEffect(() => {
    setIsLoaded(true);

    const encrypted = "!@#$%^&*()_+-={}[]|:;<>?,./~`";
    const final1 = "Encrypt Your Text";
    const final2 = "Keep It Secret";

    let i1 = 0;
    let i2 = 0;

    const interval1 = setInterval(() => {
      setTitleText(
        final1.split("").map((char, i) =>
          i < i1 ? final1[i] : encrypted[Math.floor(Math.random() * encrypted.length)]
        ).join("")
      );

      if (i1 >= final1.length) {
        clearInterval(interval1);
        const interval2 = setInterval(() => {
          setSubtitleText(
            final2.split("").map((char, i) =>
              i < i2 ? final2[i] : encrypted[Math.floor(Math.random() * encrypted.length)]
            ).join("")
          );
          if (i2 >= final2.length) clearInterval(interval2);
          i2 += 1 / 3;
        }, 30);
      }
      i1 += 1 / 3;
    }, 30);

    const hero = heroRef.current;
    const ft = featuresRef.current;

    if (hero) gsap.fromTo(hero, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, delay: 0.2 });
    if (ft) gsap.fromTo(ft, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, delay: 0.5 });
  }, []);

  useEffect(() => {
    const menu = mobileMenuRef.current;
    const overlay = overlayRef.current;
    const links = menuItemsRef.current.filter(el => el !== null);

    if (!menu || !overlay) return;

    if (isOpen) {
      gsap.to(menu, { x: 0, duration: 0.8, ease: 'expo.out' });
      gsap.to(overlay, { opacity: 1, duration: 0.5, display: 'block', ease: 'power2.out' });
      gsap.fromTo(links, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.2, ease: 'back.out(1.2)' });
    } else {
      gsap.to(menu, { x: '100%', duration: 0.6, ease: 'power3.inOut' });
      gsap.to(overlay, { opacity: 0, duration: 0.4, onComplete: () => { gsap.set(overlay, { display: 'none' }) } });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const BitParticle = ({ delay }) => {
    const [bit, setBit] = useState(null);
    useEffect(() => { setBit(Math.random() > 0.5 ? "1" : "0"); }, []);
    if (bit === null) return <span className="inline-block text-sky-400 animate-pulse opacity-0">0</span>;
    return (
      <span className="inline-block text-sky-300 animate-pulse" style={{ animationDelay: `${delay}ms`, animationDuration: "2s" }}>
        {bit}
      </span>
    );
  };

  const FeatureCard = ({ icon: Icon, title, description, delay }) => {
    const cardRef = useRef(null);
    useEffect(() => {
      if (!isLoaded) return;
      gsap.fromTo(cardRef.current, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, delay: delay / 1000, ease: 'power3.out'
      });
    }, [isLoaded, delay]);

    return (
      <div 
        ref={cardRef}
        className={`${liquidGlassStyle} rounded-[2rem] p-8 hover:scale-105 transition-all duration-500 cursor-pointer group flex flex-col items-start h-full`}
      >
        <div className="bg-white/10 w-14 h-14 rounded-full flex items-center justify-center mb-6 border border-white/20 shadow-inner group-hover:bg-white/20 transition-all duration-300">
          <Icon className="text-white/90 group-hover:text-white transition-colors duration-300" size={24} />
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-200 transition-colors duration-300 drop-shadow-md">
            {title}
        </h3>
        <p className="leading-relaxed text-sm font-light">
            {description}
        </p>
      </div>
    );
  };

  const menuItems = [
    { label: 'Features', href: '#features' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden text-white selection:bg-sky-500/30">

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute text-sky-500/20 font-mono text-sm"
            style={{
              left: p.left,
              top: p.top,
              animation: `float ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.bit}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="group-hover:rotate-12 transition-transform duration-300">
            <img src="/logo.png" alt="Shtt Logo" width={40} height={40} className="rounded-xl shadow-lg border border-white/10" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-sky-200 bg-clip-text text-transparent">
            Shtt
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {menuItems.map((item, i) => (
            <a key={i} href={item.href} className="text-gray-300 hover:text-white transition-colors duration-300 font-medium tracking-wide">
              {item.label}
            </a>
          ))}
          
          {/* BUTTON STYLE: Liquid Glass + Rounded Full */}
          <button className={`${liquidGlassStyle} rounded-full px-8 py-2 hover:scale-105 transition-all duration-300 font-medium`}>
            <Link href="/dash/hill">Get Started</Link>
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden z-50 relative">
          <Hamburger toggled={isOpen} toggle={setIsOpen} color="#ffffff" size={24} duration={0.4} rounded />
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 backdrop-blur-xl bg-black/40 z-40 md:hidden opacity-0 hidden"
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Slide */}
      <div
        ref={mobileMenuRef}
        className="fixed top-0 right-0 h-full w-80 bg-slate-900/30 backdrop-blur-3xl border-l border-white/20 shadow-2xl z-40 md:hidden translate-x-full"
      >
        <div className="p-8 pt-24">
          <div className="flex flex-col gap-6">
            {menuItems.map((item, i) => (
              <a
                key={i}
                href={item.href}
                ref={el => menuItemsRef.current[i] = el} 
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-sky-400 transition-colors duration-300 font-medium text-lg py-3 border-b border-white/5 opacity-0"
              >
                {item.label}
              </a>
            ))}
            
            <div ref={el => menuItemsRef.current[menuItems.length] = el} className="opacity-0">
                <button onClick={() => setIsOpen(false)} className={`${liquidGlassStyle} w-full rounded-full py-4 mt-6 hover:scale-105 transition-all duration-300 font-bold`}>
                  <Link href="/dash/hill">Get Started</Link>
                </button>
            </div>
          </div>

          <div 
             ref={el => menuItemsRef.current[menuItems.length + 1] = el}
             className="flex items-center gap-6 mt-12 justify-center opacity-0"
          >
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300"><Github size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300"><Twitter size={24} /></a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-block mb-8 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-sky-300 font-medium text-sm hover:scale-105 transition-transform duration-300 cursor-pointer backdrop-blur-md">
          <BitParticle delay={0} /> <BitParticle delay={200} /> {' '}Securely Hide Text Translation{' '} <BitParticle delay={600} /> <BitParticle delay={800} />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight min-h-[180px] drop-shadow-2xl">
          {titleText} <br />
          <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-sky-200 bg-clip-text text-transparent filter drop-shadow-lg">
            {subtitleText}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed px-4">
          Transformasikan teks Anda menjadi kode yang aman dengan enkripsi tingkat militer. 
          Lindungi privasi Anda dengan teknologi modern.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 px-4">
          {/* PRIMARY BUTTON STYLE: Liquid Glass */}
          <button className={`${liquidGlassStyle} rounded-full px-10 py-4 font-bold text-lg flex items-center gap-3 hover:scale-105 active:scale-95 transition-all duration-300 group`}>
            <Link href="/dash/hill">Start Encrypting</Link>
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
          </button>

          {/* SECONDARY BUTTON */}
          <button className="px-10 py-4 rounded-full font-semibold text-lg text-gray-300 hover:text-white border border-white/20 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm">
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="relative z-10 max-w-7xl mx-auto px-6 pb-32" id="features">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
          Why Choose <span className="text-sky-400">Shtt</span>?
        </h2>
        <p className="text-center text-gray-400 mb-16 text-base md:text-lg px-4">
          Keamanan tingkat enterprise dengan kesederhanaan yang elegan
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* FEATURE CARDS: MENGGUNAKAN STYLE LIQUID GLASS */}
          <FeatureCard
            icon={Shield}
            title="Military-Grade Security"
            description="Enkripsi AES-256 yang tidak dapat dipecahkan untuk melindungi data Anda dari ancaman cyber."
            delay={400}
          />
          <FeatureCard
            icon={Zap}
            title="Lightning Fast"
            description="Proses enkripsi dan dekripsi instan tanpa mengorbankan keamanan data Anda."
            delay={600}
          />
          <FeatureCard
            icon={Eye}
            title="Zero Knowledge"
            description="Kami tidak menyimpan atau melihat data Anda. Privasi 100% terjamin."
            delay={800}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div><img src="/logo.png" alt="Shtt Logo" width={32} height={32} className="rounded-lg shadow-sm border border-white/10" /></div>
              <span className="text-xl font-bold text-gray-200">Shtt</span>
            </div>
            <p className="text-gray-500 text-sm text-center">© 2024 Shtt. All rights reserved. Securely Hide Text Translation.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-500 hover:text-sky-400 transition-colors duration-300 hover:scale-110 transform"><Github size={20} /></a>
              <a href="#" className="text-gray-500 hover:text-sky-400 transition-colors duration-300 hover:scale-110 transform"><Twitter size={20} /></a>
            </div>
          </div>
        </div>
      </footer>
      <style jsx>{`
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(180deg); } }
      `}</style>
    </div>
  );
};

export default HomeView;