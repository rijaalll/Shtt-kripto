"use client";

import React, { useState, useRef } from 'react';
// Tambahkan import 'Check'
import { ArrowRightLeft, Copy, RefreshCw, Calculator, ShieldCheck, AlertCircle, Check } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// --- STYLE DEFINITION ---
const liquidGlassStyle = `
  backdrop-blur-xl bg-white/5 border border-white/10 saturate-120 
  shadow-[inset_2px_2px_3px_-1px_#ffffff20,inset_-2px_-2px_3px_-1px_#ffffff20,0_4px_12px_-2px_#00000050] 
  text-white/90
`;

export default function HillView() {
  const containerRef = useRef(null);

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encrypt'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Tambah state copied
  const [copied, setCopied] = useState(false);
  
  const [keyMatrix, setKeyMatrix] = useState({
    key_1: '', key_2: '', 
    key_3: '', key_4: ''
  });

  // --- GSAP ANIMATION (SIMPLE VERSION) ---
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

  const handleProcess = async () => {
    setLoading(true);
    setError('');
    setOutput('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      let endpoint = '';
      let body = {};

      if (mode === 'encrypt') {
        endpoint = `${apiUrl}/encrypt/hill`;
        body = { text: input };
      } else {
        endpoint = `${apiUrl}/decrypt/hill`;
        if (keyMatrix.key_1 === '' || keyMatrix.key_4 === '') {
          throw new Error("Mohon lengkapi Key Matriks (Angka) untuk dekripsi.");
        }
        body = {
          encrypted: input,
          key: {
            key_1: parseInt(keyMatrix.key_1),
            key_2: parseInt(keyMatrix.key_2),
            key_3: parseInt(keyMatrix.key_3),
            key_4: parseInt(keyMatrix.key_4),
          }
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan.');

      if (mode === 'encrypt') {
        setOutput(data.encrypted);
        if (data.key) {
          setKeyMatrix({
            key_1: data.key.key_1, key_2: data.key.key_2,
            key_3: data.key.key_3, key_4: data.key.key_4,
          });
        }
      } else {
        setOutput(data.decrypted);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal memproses data.");
    } finally {
      setLoading(false);
    }
  };

  // Update fungsi copy
  const copyToClipboard = () => { 
    if (output) {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyChange = (k, val) => { setKeyMatrix(prev => ({ ...prev, [k]: val })); };

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto w-full pb-12 overflow-x-hidden min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Judul & Deskripsi */}
        <div className="gsap-item">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-start gap-3">
            <Calculator className="text-sky-400" size={36} /> Hill Cipher
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-lg text-left">
            Enkripsi Matriks 2x2 Classic.
          </p>
        </div>
        
        {/* Toggle Mode */}
        <div className={`gsap-item ${liquidGlassStyle} p-1 rounded-xl inline-flex self-start md:self-center`}>
          <button 
            onClick={() => { setMode('encrypt'); setError(''); setOutput(''); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${mode === 'encrypt' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'text-gray-400 hover:text-white'}`}
          >
            Encrypt
          </button>
          <button 
            onClick={() => { setMode('decrypt'); setError(''); setOutput(''); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${mode === 'decrypt' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'text-gray-400 hover:text-white'}`}
          >
            Decrypt
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* --- LEFT COLUMN: INPUTS --- */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Text Input */}
          <div className={`gsap-item ${liquidGlassStyle} rounded-3xl p-6 md:p-8 flex flex-col gap-4 min-h-[200px]`}>
            <label className="text-xs font-bold text-sky-300 uppercase tracking-widest mb-1 flex justify-between">
              <span>{mode === 'encrypt' ? 'Plaintext' : 'Encrypted Text'}</span>
              <span className="text-[10px] text-gray-500 bg-white/10 px-2 rounded">TEXT INPUT</span>
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encrypt' ? "Contoh: hallo world" : "Contoh: RBXAIKIHXQ"}
              className="w-full flex-1 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all resize-none placeholder-gray-600 font-mono"
            />
          </div>

          {/* Matrix Key Inputs */}
          <div className={`gsap-item ${liquidGlassStyle} rounded-3xl p-6 md:p-8 relative overflow-hidden`}>
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-sky-400" />
                    <label className="text-xs font-bold text-sky-300 uppercase tracking-widest">
                    Matrix Key (2x2)
                    </label>
                </div>
                {mode === 'encrypt' && (
                    <span className="text-[10px] text-sky-200 bg-sky-500/20 px-2 py-1 rounded border border-sky-500/20">
                        Auto-Generated
                    </span>
                )}
             </div>

             <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto md:mx-0">
                <input type="number" placeholder="K1" value={keyMatrix.key_1} onChange={(e) => handleKeyChange('key_1', e.target.value)} readOnly={mode === 'encrypt'} className={`bg-slate-900/50 border border-white/10 rounded-xl p-4 text-center font-mono text-lg focus:outline-none focus:border-sky-500/50 ${mode === 'encrypt' ? 'text-sky-400 cursor-not-allowed opacity-80' : 'text-white'}`} />
                <input type="number" placeholder="K2" value={keyMatrix.key_2} onChange={(e) => handleKeyChange('key_2', e.target.value)} readOnly={mode === 'encrypt'} className={`bg-slate-900/50 border border-white/10 rounded-xl p-4 text-center font-mono text-lg focus:outline-none focus:border-sky-500/50 ${mode === 'encrypt' ? 'text-sky-400 cursor-not-allowed opacity-80' : 'text-white'}`} />
                <input type="number" placeholder="K3" value={keyMatrix.key_3} onChange={(e) => handleKeyChange('key_3', e.target.value)} readOnly={mode === 'encrypt'} className={`bg-slate-900/50 border border-white/10 rounded-xl p-4 text-center font-mono text-lg focus:outline-none focus:border-sky-500/50 ${mode === 'encrypt' ? 'text-sky-400 cursor-not-allowed opacity-80' : 'text-white'}`} />
                <input type="number" placeholder="K4" value={keyMatrix.key_4} onChange={(e) => handleKeyChange('key_4', e.target.value)} readOnly={mode === 'encrypt'} className={`bg-slate-900/50 border border-white/10 rounded-xl p-4 text-center font-mono text-lg focus:outline-none focus:border-sky-500/50 ${mode === 'encrypt' ? 'text-sky-400 cursor-not-allowed opacity-80' : 'text-white'}`} />
             </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="lg:col-span-5 flex flex-col gap-6">
           <div className="gsap-item">
            <button 
                onClick={handleProcess}
                disabled={loading || !input}
                className={`w-full py-5 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 ${
                    mode === 'encrypt' 
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-900/20' 
                    : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white shadow-rose-900/20'
                } ${(loading || !input) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            >
                {loading ? <RefreshCw className="animate-spin" /> : <ArrowRightLeft />}
                {loading ? 'Processing...' : (mode === 'encrypt' ? 'Encrypt Message' : 'Decrypt Message')}
            </button>
           </div>

           {error && (
             <div className="gsap-item bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-3 text-sm animate-pulse">
                <AlertCircle size={18} /> {error}
             </div>
           )}

           <div className={`gsap-item ${liquidGlassStyle} rounded-3xl p-6 md:p-8 flex-1 flex flex-col relative overflow-hidden group min-h-[250px]`}>
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                 <div className="w-32 h-32 bg-white rounded-full blur-3xl"></div>
              </div>
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">
                Hasil ({mode === 'encrypt' ? 'Enkripsi' : 'Dekripsi'})
              </label>
              <div className="flex-1 bg-black/20 rounded-2xl border border-white/5 p-6 break-all font-mono text-gray-300 text-lg leading-relaxed overflow-y-auto max-h-[300px] selection:bg-emerald-500/30">
                 {output ? output : <span className="text-gray-600 italic text-sm">Hasil proses akan muncul di sini...</span>}
              </div>
              
              {/* BUTTON COPY DIUPDATE */}
              <div className="mt-4 flex justify-end">
                <button 
                    onClick={copyToClipboard} 
                    disabled={!output} 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors text-gray-300 hover:text-white disabled:opacity-50"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />} 
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}