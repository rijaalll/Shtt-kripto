"use client";

import React, { useState, useMemo, useRef } from 'react';
import { Lock, Unlock, Copy, Check, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { processCaesar } from '@/src/util/caesar/Caesar';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// --- STYLE DEFINITION ---
const liquidGlassStyle = `
  backdrop-blur-xl bg-white/5 border border-white/10 saturate-120 
  shadow-[inset_2px_2px_3px_-1px_#ffffff20,inset_-2px_-2px_3px_-1px_#ffffff20,0_4px_12px_-2px_#00000050] 
  text-white/90
`;

export default function CaesarView() {
  const containerRef = useRef(null);
  
  const [shift, setShift] = useState(3);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [copied, setCopied] = useState(false);

  // Kalkulasi Real-time
  const output = useMemo(() => {
    return processCaesar(input, shift, mode);
  }, [input, shift, mode]);

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Setup Animasi agar sama dengan Hill/Vigenere
  useGSAP(() => {
    gsap.from(".gsap-item", {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      clearProps: "all"
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto w-full pb-12">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="gsap-item">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Lock className="text-sky-400" /> Caesar Cipher
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-lg">
            Teknik substitusi klasik dengan menggeser alfabet (Shift).
          </p>
        </div>
        
        {/* Toggle Mode */}
        <div className={`gsap-item ${liquidGlassStyle} p-1 rounded-xl inline-flex self-start md:self-center`}>
          <button 
            onClick={() => setMode('encrypt')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${mode === 'encrypt' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'text-gray-400 hover:text-white'}`}
          >
            Encrypt
          </button>
          <button 
            onClick={() => setMode('decrypt')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${mode === 'decrypt' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-400 hover:text-white'}`}
          >
            Decrypt
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* --- LEFT COLUMN: INPUTS & SETTINGS --- */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Text Input */}
          <div className={`gsap-item ${liquidGlassStyle} rounded-3xl p-6 md:p-8 flex flex-col gap-4 min-h-[200px]`}>
            <label className="text-xs font-bold text-sky-300 uppercase tracking-widest mb-1 flex justify-between">
              <span>{mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'} Input</span>
              <span className="text-[10px] text-gray-500 bg-white/10 px-2 rounded">MESSAGE CONTENT</span>
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encrypt' ? "Ketik pesan untuk dienkripsi..." : "Ketik pesan untuk didekripsi..."}
              className="w-full flex-1 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all resize-none placeholder-gray-600 font-mono"
            />
          </div>

          {/* Shift Slider (Pengganti Key Input) */}
          <div className={`gsap-item ${liquidGlassStyle} rounded-3xl p-6 md:p-8 relative`}>
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <SlidersHorizontal size={20} className="text-sky-400" />
                    <label className="text-xs font-bold text-sky-300 uppercase tracking-widest">
                    Shift Key (Geser)
                    </label>
                </div>
                <div className="text-2xl font-bold font-mono text-white bg-white/10 px-4 py-1 rounded-lg border border-white/10">
                    {shift}
                </div>
             </div>
             
             <div className="relative px-2">
                <input 
                  type="range" 
                  min="0" 
                  max="25" 
                  value={shift}
                  onChange={(e) => setShift(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-sky-500 hover:accent-sky-400 transition-all border border-white/10"
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-mono uppercase">
                  <span>No Shift (0)</span>
                  <span>Max Shift (25)</span>
                </div>
             </div>
             
             <p className="text-xs text-gray-500 mt-4">
               Geser slider untuk menentukan jumlah lompatan alfabet.
             </p>
          </div>
        </div>

        {/* --- RIGHT COLUMN: OUTPUT --- */}
        <div className="lg:col-span-5 flex flex-col gap-6">
           
           {/* Visual Indicator (Optional, replacing the Process Button space) */}
           <div className="gsap-item hidden lg:flex items-center justify-center p-4 opacity-50">
                <div className="flex items-center gap-2 text-sky-200/50 text-sm font-mono uppercase tracking-widest animate-pulse">
                    Real-time Calculation <ArrowRight size={16} />
                </div>
           </div>

           {/* Output Display */}
           <div className={`gsap-item ${liquidGlassStyle} rounded-3xl p-6 md:p-8 flex-1 flex flex-col relative overflow-hidden group min-h-[300px]`}>
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                 <div className="w-32 h-32 bg-indigo-500 rounded-full blur-3xl"></div>
              </div>
              
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">
                {mode === 'encrypt' ? 'Hasil Enkripsi' : 'Hasil Dekripsi'}
              </label>

              <div className="flex-1 bg-black/20 rounded-2xl border border-white/5 p-6 break-all font-mono text-gray-300 text-lg leading-relaxed overflow-y-auto max-h-[400px] selection:bg-emerald-500/30">
                 {output 
                   ? output 
                   : <span className="text-gray-600 italic text-sm">Hasil akan muncul otomatis saat Anda mengetik...</span>
                 }
              </div>

              <div className="mt-4 flex justify-end">
                <button 
                  onClick={handleCopy}
                  disabled={!output}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors text-gray-300 hover:text-white disabled:opacity-50"
                >
                  {copied ? <Check size={16} className="text-emerald-400"/> : <Copy size={16} />} 
                  {copied ? "Copied!" : "Copy Result"}
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}