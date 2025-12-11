"use client";

import React, { useState, useRef } from 'react';
import { 
  FileLock2, UploadCloud, Download, Key, 
  RefreshCw, FileType, CheckCircle, AlertCircle, X, Shield 
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { encryptDES, decryptDES } from '@/src/util/des/Des'; 

// --- STYLE DEFINITION ---
const liquidGlassStyle = `
  backdrop-blur-xl bg-slate-900/60 border border-white/10 saturate-120 
  shadow-[inset_2px_2px_3px_-1px_#ffffff20,inset_-2px_-2px_3px_-1px_#ffffff20,0_4px_12px_-2px_#00000050] 
  text-white/90
`;

const getTimestampName = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const MM = String(now.getMonth() + 1).padStart(2, '0'); 
    const yy = String(now.getFullYear()).slice(-2); 
    return `${hh}${mm}-${dd}${MM}${yy}`;
};

const createBlobFromBinaryString = (binaryString, mimeType = 'application/octet-stream') => {
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });
    return { url: URL.createObjectURL(blob) };
};

const META_DELIMITER = "||SHTT_EXT||"; 

export default function DesView() {
  const containerRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [key, setKey] = useState('');
  const [mode, setMode] = useState('encrypt'); 
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [resultName, setResultName] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Animasi GSAP
  useGSAP(() => {
    gsap.from(".gsap-item", {
      y: 40, 
      opacity: 0, 
      duration: 0.8, 
      stagger: 0.15, 
      ease: "power3.out",
      clearProps: "opacity" 
    });
  }, { scope: containerRef });

  // --- LOGIC FILE ---
  const processFile = (selectedFile) => {
    if (selectedFile) {
      if (selectedFile.size > 20 * 1024 * 1024) { 
        alert("File terlalu besar (>20MB). Browser mungkin akan hang.");
      }
      setFile(selectedFile);
      setResultUrl(null);
      setError('');
    }
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  // --- DRAG HANDLERS ---
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setResultUrl(null);
    setError('');
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = ''; 
  };
  
  const handleProcess = () => {
    if (!file || !key) {
      setError("Mohon pilih file dan masukkan kunci.");
      return;
    }

    setProcessing(true);
    setError('');
    setResultUrl(null);

    setTimeout(() => {
        const reader = new FileReader();

        if (mode === 'encrypt') {
        reader.onload = (e) => {
            try {
            const base64Data = e.target.result; 
            const originalExt = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '';
            const payload = originalExt + META_DELIMITER + base64Data;
            const encryptedString = encryptDES(payload, key);
            const { url: resultFileUrl } = createBlobFromBinaryString(encryptedString);
            
            setResultUrl(resultFileUrl);
            setResultName(`encrypt-${getTimestampName()}.shtt`); 
            setProcessing(false);
            } catch (err) {
            console.error(err);
            setError("Gagal mengenkripsi file.");
            setProcessing(false);
            }
        };
        reader.readAsDataURL(file); 
        } else {
        if (!file.name.endsWith('.shtt')) {
            setError("File harus berekstensi .shtt");
            setProcessing(false);
            return;
        }
        
        reader.onload = (e) => {
            try {
            const encryptedContent = e.target.result; 
            const decryptedPayload = decryptDES(encryptedContent, key);
            
            if (!decryptedPayload) throw new Error("Gagal dekripsi: Key salah atau file rusak.");

            const parts = decryptedPayload.split(META_DELIMITER);
            if (parts.length < 2) throw new Error("Format file rusak atau Key salah.");

            const recoveredExt = parts[0]; 
            const actualBase64 = parts[1]; 

            fetch(actualBase64)
                .then(res => res.blob())
                .then(blob => {
                const url = URL.createObjectURL(blob);
                setResultUrl(url);
                setResultName(`decrypt-${getTimestampName()}${recoveredExt}`); 
                setProcessing(false);
                })
                .catch((err) => {
                    setError("Gagal merekonstruksi file asli.");
                    setProcessing(false);
                });
            } catch (err) {
            setError(err.message || "Kesalahan saat dekripsi.");
            setProcessing(false);
            }
        };
        reader.readAsBinaryString(file); 
        }
    }, 100);
  };

  return (
    <div ref={containerRef} className="max-w-5xl mx-auto w-full pb-12">
      
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="gsap-item">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield size={32} className="text-sky-400" /> DES File Encryption
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-lg">
            Sistem Enkripsi File Simetris (Custom XOR) dengan penamaan otomatis.
          </p>
        </div>
        
        <div className={`gsap-item ${liquidGlassStyle} p-1 rounded-xl inline-flex self-start md:self-center`}>
          <button 
            onClick={() => { setMode('encrypt'); clearFile(); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${mode === 'encrypt' ? 'bg-sky-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Encrypt
          </button>
          <button 
            onClick={() => { setMode('decrypt'); clearFile(); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${mode === 'decrypt' ? 'bg-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Decrypt
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* --- LEFT COLUMN: INPUTS --- */}
        <div className="lg:col-span-7 flex flex-col">
          
          {/* FIXED CONTAINER:
             1. mb-6: Memberikan margin bawah explisit agar tidak menabrak div Key
             2. min-h-[350px]: Memberikan tinggi minimal
             3. relative w-full: Memastikan layout flow normal
          */}
          <div className="gsap-item mb-6 relative w-full">
            <div 
                className={`${liquidGlassStyle} rounded-3xl p-1 relative overflow-hidden transition-all duration-300 w-full min-h-[350px] flex flex-col
                ${isDragging ? 'border-sky-400 ring-2 ring-sky-400/50' : ''}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {/* Drag Overlay */}
                {isDragging && (
                    <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center rounded-[1.3rem] pointer-events-none">
                        <div className="text-center animate-bounce">
                            <UploadCloud size={64} className="text-sky-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white">Lepaskan File Disini</h3>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="bg-slate-900/40 rounded-[1.3rem] p-8 border border-white/5 flex flex-col items-center justify-center text-center flex-grow w-full relative z-10">
                
                {!file ? (
                    <>
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud size={32} className={mode === 'encrypt' ? "text-sky-400" : "text-rose-400"} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                        {mode === 'encrypt' ? 'Upload File Asli' : 'Upload File (.shtt)'}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
                        Klik tombol di bawah atau seret file Anda ke kotak ini.
                        <br/>
                        <span className="font-mono text-xs text-sky-300 block mt-3 py-1 px-2 bg-white/5 rounded border border-white/5">
                        {mode === 'encrypt' ? 'Output: .shtt' : 'Output: original ext'}
                        </span>
                    </p>
                    
                    <label className="cursor-pointer relative z-20">
                        <input type="file" id="file-input" onChange={handleFileChange} className="hidden" />
                        <span className={`px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${mode === 'encrypt' ? 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/20' : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'}`}>
                        Pilih File Manual
                        </span>
                    </label>
                    </>
                ) : (
                    <div className="w-full relative z-20">
                    <div className="flex items-center justify-between bg-white/10 p-4 rounded-xl mb-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                        <FileType className="text-sky-400 shrink-0" size={24} />
                        <div className="text-left overflow-hidden">
                            <p className="text-white font-medium text-sm truncate">{file.name}</p>
                            <p className="text-gray-400 text-xs">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                        </div>
                        <button onClick={clearFile} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X size={18} />
                        </button>
                    </div>
                    <div className="text-emerald-400 text-xs font-mono flex items-center justify-center gap-2">
                        <CheckCircle size={14} /> File siap diproses
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2">Ingin ganti file? Seret file baru ke sini.</p>
                    </div>
                )}
                </div>
            </div>
          </div>

          {/* Key Input (Sekarang aman karena margin atas/bawah sudah dihandle parent) */}
          <div className={`gsap-item ${liquidGlassStyle} rounded-3xl p-6 md:p-8 relative w-full`}>
             <div className="flex items-center gap-3 mb-4">
                <Key size={20} className="text-sky-400" />
                <label className="text-xs font-bold text-sky-300 uppercase tracking-widest">
                  Encryption Key
                </label>
             </div>
             
             <input 
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Password"
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white font-mono tracking-widest focus:outline-none focus:border-sky-500/50 transition-all"
             />
          </div>
        </div>

        {/* --- RIGHT COLUMN: ACTION & RESULT --- */}
        <div className="lg:col-span-5 flex flex-col gap-6">
           
           <div className="gsap-item">
            <button 
                onClick={handleProcess}
                disabled={processing || !file || !key}
                className={`w-full py-5 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 ${
                    mode === 'encrypt' 
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-900/20' 
                    : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white shadow-rose-900/20'
                } ${(processing || !file || !key) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            >
                {processing ? <RefreshCw className="animate-spin" /> : <FileLock2 />}
                {processing ? 'Processing...' : (mode === 'encrypt' ? 'Encrypt' : 'Decrypt')}
            </button>
           </div>

           {error && (
             <div className="gsap-item bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-3 text-sm animate-pulse">
                <AlertCircle size={18} /> {error}
             </div>
           )}

           <div className={`gsap-item ${liquidGlassStyle} rounded-3xl p-6 md:p-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden min-h-[250px]`}>
              {!resultUrl ? (
                <div className="text-center text-gray-500 opacity-60">
                   <FileLock2 size={48} className="mx-auto mb-3" />
                   <p className="text-sm">Hasil akan muncul di sini.</p>
                </div>
              ) : (
                <div className="text-center w-full animate-in fade-in zoom-in duration-500">
                   <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400 border border-emerald-500/30 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]">
                      <Download size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-1">Berhasil!</h3>
                   <div className="bg-slate-900/50 p-3 rounded-lg border border-white/5 mb-6 mx-auto max-w-[280px]">
                      <p className="text-sky-300 font-mono text-xs break-all">{resultName}</p>
                   </div>
                   
                   <a 
                     href={resultUrl} 
                     download={resultName}
                     className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-gray-200 transition-colors"
                     onClick={() => setTimeout(() => URL.revokeObjectURL(resultUrl), 2000)}
                   >
                     <Download size={18} /> Download
                   </a>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}