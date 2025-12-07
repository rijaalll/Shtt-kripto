"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Save, Trash2, Edit, Plus, X, 
  Github, Instagram, RefreshCw, Loader2 
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// --- STYLE DEFINITION ---
const liquidGlassStyle = `
  backdrop-blur-xl bg-white/5 border border-white/10 saturate-120 
  shadow-[inset_2px_2px_3px_-1px_#ffffff20,inset_-2px_-2px_3px_-1px_#ffffff20,0_4px_12px_-2px_#00000050] 
  text-white/90
`;

const inputStyle = `
  w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 
  text-white focus:outline-none focus:border-sky-500/50 
  focus:ring-1 focus:ring-sky-500/50 transition-all 
  placeholder-gray-600 font-mono text-sm
`;

// Default Avatar URL untuk fallback
const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=new';

export default function AdminView() {
  const containerRef = useRef(null);
  
  // State Data
  const [members, setMembers] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Initial Form dengan static seed
  const initialForm = {
    name: '',
    role: '', 
    nim: '',
    img: DEFAULT_AVATAR, 
    github: '#',
    instagram: '#'
  };

  const [formData, setFormData] = useState(initialForm);
  const [editId, setEditId] = useState(null);

  // --- FETCH DATA ---
  const fetchMembers = async () => {
    setFetching(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/member`);
      const data = await res.json();
      setMembers(data || {});
    } catch (error) {
      console.error("Gagal ambil data:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // --- ANIMASI GSAP ---
  useGSAP(() => {
    gsap.from(".gsap-header", { y: -30, opacity: 0, duration: 1, ease: "power3.out" });
    gsap.from(".gsap-form", { x: -50, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out" });
    gsap.from(".gsap-list", { x: 50, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
  }, { scope: containerRef });

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      role: formData.role,
      nim: formData.nim,
      // Jika user mengosongkan img, gunakan default saat save
      img: formData.img || DEFAULT_AVATAR,
      social: {
        github: formData.github,
        instagram: formData.instagram
      }
    };

    try {
      let url = '/api/member';
      let method = 'POST';

      if (editId) {
        url = `/api/member?id=${editId}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");

      // Reset Form dengan seed baru random (client side only)
      setFormData({
        ...initialForm,
        img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Math.random().toString(36).substring(7)
      });
      setEditId(null);
      fetchMembers();

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (key, data) => {
    setEditId(key);
    setFormData({
      name: data.name || '',
      role: data.role || '',
      nim: data.nim || '',
      img: data.img || '',
      github: data.social?.github || '#',
      instagram: data.social?.instagram || '#'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (key) => {
    if (!confirm("Yakin ingin menghapus member ini?")) return;
    
    try {
      const res = await fetch(`/api/member?id=${key}`, { method: 'DELETE' });
      if (res.ok) {
        const newMembers = { ...members };
        delete newMembers[key];
        setMembers(newMembers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData(initialForm);
  };

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto w-full pb-12">
      
      {/* HEADER */}
      <div className="gsap-header mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
              <Users className="text-sky-400" /> Member Admin
            </h1>
            <p className="text-gray-400 text-sm">Kelola data anggota tim secara real-time.</p>
        </div>
        <button 
          onClick={fetchMembers}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-sky-400 transition-all"
          title="Refresh Data"
        >
           <RefreshCw size={20} className={fetching ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: FORM --- */}
        <div className="lg:col-span-4 gsap-form">
          <div className={`${liquidGlassStyle} p-6 rounded-3xl sticky top-6`}>
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
               <h2 className="text-lg font-bold text-white flex items-center gap-2">
                 {editId ? <Edit size={18} className="text-yellow-400"/> : <Plus size={18} className="text-emerald-400"/>}
                 {editId ? 'Edit Member' : 'Add New Member'}
               </h2>
               {editId && (
                 <button onClick={cancelEdit} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                   <X size={14}/> Cancel
                 </button>
               )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Preview */}
              <div className="flex justify-center mb-4">
                 <div className="w-20 h-20 rounded-full bg-slate-900 overflow-hidden border-2 border-white/10">
                    {/* PERBAIKAN DI SINI: Gunakan '||' untuk fallback jika string kosong */}
                    <img 
                        src={formData.img || DEFAULT_AVATAR} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                    />
                 </div>
              </div>

              <div>
                <label className="text-xs text-sky-300 font-bold uppercase mb-1 block">Nama Lengkap</label>
                <input required name="name" value={formData.name} onChange={handleInputChange} placeholder="Ex: Ahmad Rizal" className={inputStyle} />
              </div>

              <div>
                <label className="text-xs text-sky-300 font-bold uppercase mb-1 block">Role / Jabatan</label>
                <input required name="role" value={formData.role} onChange={handleInputChange} placeholder="Ex: Frontend Dev" className={inputStyle} />
              </div>

              <div>
                <label className="text-xs text-sky-300 font-bold uppercase mb-1 block">NIM</label>
                <input required name="nim" value={formData.nim} onChange={handleInputChange} placeholder="Ex: F11.2024.00143" className={inputStyle} />
              </div>

              <div>
                <label className="text-xs text-sky-300 font-bold uppercase mb-1 block">Avatar URL</label>
                <input name="img" value={formData.img} onChange={handleInputChange} placeholder="https://..." className={inputStyle} />
                <p className="text-[10px] text-gray-500 mt-1">Gunakan Dicebear atau link gambar langsung.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="text-xs text-sky-300 font-bold uppercase mb-1 block">Github Link</label>
                    <input name="github" value={formData.github} onChange={handleInputChange} placeholder="#" className={inputStyle} />
                 </div>
                 <div>
                    <label className="text-xs text-sky-300 font-bold uppercase mb-1 block">IG Link</label>
                    <input name="instagram" value={formData.instagram} onChange={handleInputChange} placeholder="#" className={inputStyle} />
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-3 mt-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    editId 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 shadow-orange-900/20' 
                    : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-sky-900/20'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                {editId ? 'Update Member' : 'Save Member'}
              </button>
            </form>
          </div>
        </div>

        {/* --- RIGHT COLUMN: LIST --- */}
        <div className="lg:col-span-8 gsap-list">
           {fetching ? (
             <div className="flex flex-col items-center justify-center h-64 text-gray-400">
               <Loader2 size={40} className="animate-spin mb-4 text-sky-500" />
               <p>Memuat data dari Firebase...</p>
             </div>
           ) : Object.keys(members).length === 0 ? (
             <div className={`${liquidGlassStyle} p-8 rounded-3xl text-center text-gray-400`}>
                <p>Belum ada data anggota.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(members)
                  .sort(([, a], [, b]) => a.nim.localeCompare(b.nim)) // Sorting A-Z berdasarkan NIM
                  .map(([key, member]) => (
                  
                  <div key={key} className={`${liquidGlassStyle} p-4 rounded-2xl flex items-center gap-4 group hover:bg-white/10 transition-all`}>
                     
                     <div className="w-16 h-16 rounded-full bg-slate-900 p-1 border border-white/10 shrink-0">
                        <img 
                            src={member.img || DEFAULT_AVATAR} 
                            alt={member.name} 
                            className="w-full h-full rounded-full object-cover" 
                        />
                     </div>

                     <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white truncate">{member.name}</h3>
                        <p className="text-sky-400 text-xs truncate">{member.role || 'Member'}</p>
                        <p className="text-gray-500 text-xs font-mono mt-0.5">{member.nim}</p>
                        
                        <div className="flex gap-2 mt-2">
                           {member.social?.github && <Github size={14} className="text-gray-400"/>}
                           {member.social?.instagram && <Instagram size={14} className="text-gray-400"/>}
                        </div>
                     </div>

                     <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => handleEdit(key, member)}
                          className="p-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 transition-colors"
                        >
                           <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(key)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>

      </div>
    </div>
  );
}