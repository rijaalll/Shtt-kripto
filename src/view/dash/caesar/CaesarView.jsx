"use client";

import React, { useState } from 'react';
import { Lock, Unlock, Sliders, ArrowDown } from 'lucide-react';

// Style Glass yang sama
const liquidGlassStyle = `
  backdrop-blur-xl bg-white/5 border border-white/10 saturate-120 
  shadow-[inset_2px_2px_3px_-1px_#ffffff20,inset_-2px_-2px_3px_-1px_#ffffff20,0_4px_12px_-2px_#00000050] 
  text-white/90
`;

const CaesarView = () => {
  const [shift, setShift] = useState(3);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('encrypt');

  // Logic Caesar Sederhana (Real-time)
  const processCaesar = (text, shiftAmount, currentMode) => {
    return text.replace(/[a-zA-Z]/g, (char) => {
      const base = char <= 'Z' ? 65 : 97;
      const s = currentMode === 'encrypt' ? shiftAmount : -shiftAmount;
      return String.fromCharCode(((char.charCodeAt(0) - base + s + 26) % 26 + 26) % 26 + base);
    });
  };

  const output = processCaesar(input, shift, mode);

  return (
    <div className="max-w-3xl mx-auto w-full animate-fade-in-up pb-10">
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">Caesar Cipher</h1>
        <p className="text-gray-400">Teknik substitusi klasik dengan menggeser alfabet.</p>
      </div>

      {/* Main Glass Card */}
      <div className={`${liquidGlassStyle} rounded-[2.5rem] p-2`}>
        <div className="bg-slate-900/40 backdrop-blur-md rounded-[2rem] p-6 md:p-10 border border-white/5">
          
          {/* Controls Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-black/20 p-4 rounded-2xl border border-white/5">
             
             {/* Mode Toggle */}
             <div className="flex bg-slate-900 p-1.5 rounded-xl border border-white/10">
                <button
                  onClick={() => setMode('encrypt')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'encrypt' ? 'bg-sky-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  <Lock size={16} /> Encrypt
                </button>
                <button
                  onClick={() => setMode('decrypt')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'decrypt' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  <Unlock size={16} /> Decrypt
                </button>
             </div>

             {/* Shift Slider */}
             <div className="flex-1 w-full md:w-auto px-4">
                <div className="flex justify-between text-xs font-bold text-sky-300 uppercase tracking-widest mb-2">
                  <span>Shift Key</span>
                  <span className="bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-500/30">{shift}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="25" 
                  value={shift}
                  onChange={(e) => setShift(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500 hover:accent-sky-400 transition-all"
                />
                <div className="flex justify-between text-[10px] text-gray-600 mt-1 font-mono">
                  <span>0</span><span>25</span>
                </div>
             </div>
          </div>

          {/* Input Area */}
          <div className="relative group mb-2">
            <div className="absolute -top-3 left-6 bg-slate-800 px-3 py-0.5 rounded-full text-[10px] font-bold text-sky-400 border border-sky-500/30 shadow-lg z-10">
              PLAIN TEXT
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pesan Anda di sini..."
              className="w-full h-32 bg-transparent border-2 border-dashed border-white/10 group-hover:border-sky-500/30 rounded-2xl p-5 text-white focus:outline-none focus:border-sky-500 focus:bg-slate-900/50 transition-all resize-none"
            />
          </div>

          {/* Arrow Indicator */}
          <div className="flex justify-center -my-3 relative z-10">
            <div className="bg-slate-800 border border-white/10 p-2 rounded-full shadow-xl text-sky-400 animate-bounce">
              <ArrowDown size={20} />
            </div>
          </div>

          {/* Output Area */}
          <div className="relative group mt-2">
             <div className="absolute -top-3 left-6 bg-slate-800 px-3 py-0.5 rounded-full text-[10px] font-bold text-emerald-400 border border-emerald-500/30 shadow-lg z-10">
              CIPHER RESULT
            </div>
            <div className="w-full h-32 bg-black/20 border border-white/5 rounded-2xl p-5 text-lg text-white font-mono overflow-y-auto selection:bg-emerald-500/30">
               {output || <span className="text-gray-600">Hasil real-time...</span>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CaesarView;