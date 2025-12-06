"use client";

import React, { useState } from 'react';
import { ArrowRightLeft, Copy, RefreshCw, Calculator, ShieldCheck, AlertCircle } from 'lucide-react';

// --- STYLE DEFINITION (Sama dengan sebelumnya) ---
const liquidGlassStyle = `
  backdrop-blur-xl bg-white/5 border border-white/10 saturate-120 
  shadow-[inset_2px_2px_3px_-1px_#ffffff20,inset_-2px_-2px_3px_-1px_#ffffff20,0_4px_12px_-2px_#00000050] 
  text-white/90
`;

export default function HillView() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encrypt'); // 'encrypt' | 'decrypt'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State untuk Key (Matriks 2x2 sesuai API)
  const [keyMatrix, setKeyMatrix] = useState({
    key_1: '', key_2: '', 
    key_3: '', key_4: ''
  });

  const handleProcess = async () => {
    setLoading(true);
    setError('');
    setOutput('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL; // http://localhost:4321/api
      
      let endpoint = '';
      let body = {};

      if (mode === 'encrypt') {
        // --- LOGIKA ENKRIPSI ---
        endpoint = `${apiUrl}/encrypt/hill`;
        // Body request: { "text": "hallo world" }
        body = { text: input };
      } else {
        // --- LOGIKA DEKRIPSI ---
        endpoint = `${apiUrl}/decrypt/hill`;
        
        // Validasi Key harus ada isinya
        if (keyMatrix.key_1 === '' || keyMatrix.key_4 === '') {
          throw new Error("Mohon lengkapi Key Matriks (Angka) untuk dekripsi.");
        }

        // Body request: { "encrypted": "...", "key": { "key_1": ... } }
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

      if (!res.ok) {
        throw new Error(data.message || 'Terjadi kesalahan pada server.');
      }

      if (mode === 'encrypt') {
        // Response Encrypt: { "encrypted": "...", "key": { ... } }
        setOutput(data.encrypted);
        // Otomatis update tampilan Key dengan key yang digenerate server
        if (data.key) {
          setKeyMatrix({
            key_1: data.key.key_1,
            key_2: data.key.key_2,
            key_3: data.key.key_3,
            key_4: data.key.key_4,
          });
        }
      } else {
        // Response Decrypt: { "decrypted": "..." }
        setOutput(data.decrypted);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (output) navigator.clipboard.writeText(output);
  };

  // Helper untuk update state matriks
  const handleKeyChange = (k, val) => {
    setKeyMatrix(prev => ({ ...prev, [k]: val }));
  };

  return (
    <div className="max-w-5xl mx-auto w-full animate-fade-in-up pb-12">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Calculator className="text-sky-400" /> Hill Cipher API
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-lg">
            Enkripsi Matriks 2x2. {mode === 'encrypt' ? 'Key akan digenerate otomatis oleh server.' : 'Masukkan Key angka untuk mendekripsi.'}
          </p>
        </div>
        
        {/* Toggle Mode */}
        <div className={`${liquidGlassStyle} p-1 rounded-xl inline-flex self-start md:self-center`}>
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
          <div className={`${liquidGlassStyle} rounded-3xl p-6 md:p-8 flex flex-col gap-4 min-h-[200px]`}>
            <label className="text-xs font-bold text-sky-300 uppercase tracking-widest mb-1 flex justify-between">
              <span>{mode === 'encrypt' ? 'Plaintext' : 'Encrypted Text'}</span>
              <span className="text-[10px] text-gray-500 bg-white/10 px-2 rounded">API INPUT</span>
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encrypt' ? "Contoh: hallo world" : "Contoh: RBXAIKIHXQ"}
              className="w-full flex-1 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all resize-none placeholder-gray-600 font-mono"
            />
          </div>

          {/* Matrix Key Inputs (2x2) */}
          <div className={`${liquidGlassStyle} rounded-3xl p-6 md:p-8 relative overflow-hidden`}>
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-sky-400" />
                    <label className="text-xs font-bold text-sky-300 uppercase tracking-widest">
                    Matrix Key (2x2)
                    </label>
                </div>
                {mode === 'encrypt' && (
                    <span className="text-[10px] text-sky-200 bg-sky-500/20 px-2 py-1 rounded border border-sky-500/20">
                        Auto-Generated by Server
                    </span>
                )}
             </div>

             <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto md:mx-0">
                {/* Row 1 */}
                <input 
                    type="number" placeholder="K1"
                    value={keyMatrix.key_1}
                    onChange={(e) => handleKeyChange('key_1', e.target.value)}
                    readOnly={mode === 'encrypt'}
                    className={`bg-slate-900/50 border border-white/10 rounded-xl p-4 text-center font-mono text-lg focus:outline-none focus:border-sky-500/50 ${mode === 'encrypt' ? 'text-sky-400 cursor-not-allowed opacity-80' : 'text-white'}`}
                />
                <input 
                    type="number" placeholder="K2"
                    value={keyMatrix.key_2}
                    onChange={(e) => handleKeyChange('key_2', e.target.value)}
                    readOnly={mode === 'encrypt'}
                    className={`bg-slate-900/50 border border-white/10 rounded-xl p-4 text-center font-mono text-lg focus:outline-none focus:border-sky-500/50 ${mode === 'encrypt' ? 'text-sky-400 cursor-not-allowed opacity-80' : 'text-white'}`}
                />
                
                {/* Row 2 */}
                <input 
                    type="number" placeholder="K3"
                    value={keyMatrix.key_3}
                    onChange={(e) => handleKeyChange('key_3', e.target.value)}
                    readOnly={mode === 'encrypt'}
                    className={`bg-slate-900/50 border border-white/10 rounded-xl p-4 text-center font-mono text-lg focus:outline-none focus:border-sky-500/50 ${mode === 'encrypt' ? 'text-sky-400 cursor-not-allowed opacity-80' : 'text-white'}`}
                />
                <input 
                    type="number" placeholder="K4"
                    value={keyMatrix.key_4}
                    onChange={(e) => handleKeyChange('key_4', e.target.value)}
                    readOnly={mode === 'encrypt'}
                    className={`bg-slate-900/50 border border-white/10 rounded-xl p-4 text-center font-mono text-lg focus:outline-none focus:border-sky-500/50 ${mode === 'encrypt' ? 'text-sky-400 cursor-not-allowed opacity-80' : 'text-white'}`}
                />
             </div>

             <p className="text-xs text-gray-500 mt-4">
               {mode === 'encrypt' 
                 ? "Key akan muncul otomatis setelah proses enkripsi selesai." 
                 : "Masukkan angka key matriks untuk membuka pesan."}
             </p>
          </div>
        </div>

        {/* --- RIGHT COLUMN: ACTION & OUTPUT --- */}
        <div className="lg:col-span-5 flex flex-col gap-6">
           
           {/* Process Button */}
           <button 
              onClick={handleProcess}
              disabled={loading || !input}
              className={`w-full py-5 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 ${
                 mode === 'encrypt' 
                 ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-900/20' 
                 : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white shadow-rose-900/20'
              } ${(loading || !input) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
           >
              {loading ? (
                <RefreshCw className="animate-spin" />
              ) : (
                <ArrowRightLeft />
              )}
              {loading ? 'Processing...' : (mode === 'encrypt' ? 'Encrypt via API' : 'Decrypt via API')}
           </button>

           {/* Error Message */}
           {error && (
             <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-3 text-sm animate-pulse">
                <AlertCircle size={18} /> {error}
             </div>
           )}

           {/* Output Display */}
           <div className={`${liquidGlassStyle} rounded-3xl p-6 md:p-8 flex-1 flex flex-col relative overflow-hidden group min-h-[250px]`}>
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                 {/* Ganti dengan Logo Anda jika ada */}
                 <div className="w-32 h-32 bg-white rounded-full blur-3xl"></div>
              </div>
              
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">
                API Response ({mode === 'encrypt' ? 'Encrypted' : 'Decrypted'})
              </label>

              <div className="flex-1 bg-black/20 rounded-2xl border border-white/5 p-6 break-all font-mono text-gray-300 text-lg leading-relaxed overflow-y-auto max-h-[300px] selection:bg-emerald-500/30">
                 {output 
                   ? output 
                   : <span className="text-gray-600 italic text-sm">Hasil response API akan muncul di sini...</span>
                 }
              </div>

              <div className="mt-4 flex justify-end">
                <button 
                  onClick={copyToClipboard}
                  disabled={!output}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors text-gray-300 hover:text-white disabled:opacity-50"
                >
                  <Copy size={16} /> Copy
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}