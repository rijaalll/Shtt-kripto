"use client";

import React, { useEffect, useState, useRef } from 'react';
import { 
  Server, Activity, Clock, Cpu, Zap, 
  Users, Github, Instagram, Linkedin, Code, Loader2 
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { getSystemInfoAction } from '@/src/action/InfoAction';

const liquidGlassStyle = `
  backdrop-blur-xl bg-white/5 border border-white/10 saturate-120 
  shadow-[inset_2px_2px_3px_-1px_#ffffff20,inset_-2px_-2px_3px_-1px_#ffffff20,0_4px_12px_-2px_#00000050] 
  text-white/90
`;

// Default avatar jika data kosong
const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=new';

export default function InfoView() {
  const containerRef = useRef(null);
  
  const [sysInfo, setSysInfo] = useState(null);
  const [members, setMembers] = useState([]); // State untuk menampung data API
  const [loading, setLoading] = useState(true);
  
  // State khusus untuk jam yang berjalan (Live Clock)
  const [liveTime, setLiveTime] = useState(null);

  // 1. Fetch Data (System & Members)
  useEffect(() => {
    async function fetchData() {
      try {
        // --- A. Fetch System Info (Server Action) ---
        const sysData = await getSystemInfoAction();
        if (sysData) {
          setSysInfo(sysData);
          if (sysData.server_time) {
            setLiveTime(new Date(sysData.server_time));
          }
        }

        // --- B. Fetch Members (API Route) ---
        const res = await fetch('/api/member');
        const memberData = await res.json();
        
        // Transform Object Firebase ke Array & Sort by NIM
        if (memberData) {
          const sortedMembers = Object.values(memberData)
            .sort((a, b) => {
               // Pastikan NIM ada sebelum compare, default ke string kosong agar aman
               const nimA = a.nim || "";
               const nimB = b.nim || "";
               return nimA.localeCompare(nimB);
            });
          setMembers(sortedMembers);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // 2. Logic "Ticking" (Detak Jam)
  useEffect(() => {
    if (!liveTime) return;

    const timer = setInterval(() => {
      setLiveTime((prevTime) => {
        const newTime = new Date(prevTime);
        newTime.setSeconds(newTime.getSeconds() + 1);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [liveTime]);

  const formatTime = (dateObj) => {
    if (!dateObj) return "--:--:--";
    return dateObj.toLocaleTimeString('en-US', { 
      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
  };

  const formatDate = (dateObj) => {
    if (!dateObj) return "--/--/----";
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric', month: 'numeric', day: 'numeric'
    });
  };

  // Animasi GSAP
  useGSAP(() => {
    gsap.from(".gsap-header", {
       y: -30, opacity: 0, duration: 1, ease: "power3.out"
    });
    // Kita gunakan delay sedikit lebih lama agar data API sempat ter-render sebelum animasi
    gsap.from(".gsap-card", {
       y: 50, opacity: 0, duration: 0.8, stagger: 0.1, delay: 0.5, ease: "back.out(1.2)"
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto w-full pb-12">
      
      {/* HEADER */}
      <div className="gsap-header mb-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
            <Activity className="text-sky-400" /> System & Team
            </h1>
            <p className="text-gray-400">Informasi status server dan identitas pengembang.</p>
        </div>
        <div className="px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono animate-pulse">
            System Operational
        </div>
      </div>

      {/* --- SECTION 1: SYSTEM INFO --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        
        {/* Card 1: Server Time */}
        <div className={`gsap-card ${liquidGlassStyle} p-6 rounded-3xl relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Clock size={60} />
            </div>
            <div className="flex flex-col h-full justify-between">
                <div className="text-sky-300 font-bold uppercase text-xs tracking-widest mb-2 flex justify-between">
                    <span>Server Time</span>
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                </div>
                <div className="text-xl font-mono text-white font-bold break-words">
                    {loading ? "Syncing..." : formatTime(liveTime)}
                </div>
                <div className="text-xs text-gray-500 mt-1 font-mono">
                    {loading ? "..." : formatDate(liveTime)}
                </div>
            </div>
        </div>

        {/* Card 2: Uptime */}
        <div className={`gsap-card ${liquidGlassStyle} p-6 rounded-3xl relative overflow-hidden group`}>
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity size={60} className="text-emerald-400" />
            </div>
            <div className="flex flex-col h-full justify-between">
                <div className="text-emerald-400 font-bold uppercase text-xs tracking-widest mb-2">App Uptime</div>
                <div className="text-2xl font-mono text-white font-bold">
                    {loading ? "..." : 
                        `${sysInfo?.uptime_app?.hours || 0}h ${sysInfo?.uptime_app?.minutes || 0}m`
                    }
                </div>
                <div className="text-xs text-gray-500 mt-1">
                     {loading ? "..." : `${sysInfo?.uptime_app?.seconds || 0}s session start`}
                </div>
            </div>
        </div>

        {/* Card 3: OS Info */}
        <div className={`gsap-card ${liquidGlassStyle} p-6 rounded-3xl relative overflow-hidden group`}>
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Server size={60} className="text-indigo-400" />
            </div>
            <div className="flex flex-col h-full justify-between">
                <div className="text-indigo-400 font-bold uppercase text-xs tracking-widest mb-2">OS Platform</div>
                <div className="text-lg font-mono text-white font-bold capitalize">
                    {loading ? "..." : sysInfo?.os?.platform || "Unknown"}
                </div>
                <div className="text-[10px] text-gray-500 mt-1 break-all font-mono leading-tight">
                    {loading ? "..." : `${sysInfo?.os?.release} (${sysInfo?.os?.arch})`}
                </div>
            </div>
        </div>

        {/* Card 4: Framework */}
        <div className={`gsap-card ${liquidGlassStyle} p-6 rounded-3xl relative overflow-hidden group`}>
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={60} className="text-yellow-400" />
            </div>
            <div className="flex flex-col h-full justify-between">
                <div className="text-yellow-400 font-bold uppercase text-xs tracking-widest mb-2">Framework</div>
                <div className="text-2xl font-mono text-white font-bold">
                    Next.js
                </div>
                <div className="text-xs text-gray-500 mt-1 font-mono">
                    v{loading ? "..." : sysInfo?.next?.next_version}
                </div>
            </div>
        </div>
      </div>

      {/* --- SECTION 2: TEAM IDENTITIES --- */}
      <div className="gsap-header mb-6 mt-12 flex items-center gap-3">
         <Users className="text-sky-400" />
         <h2 className="text-2xl font-bold text-white">Development Team</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
           <Loader2 className="animate-spin text-sky-400" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.length > 0 ? (
                members.map((member, index) => (
                    <div key={index} className={`gsap-card ${liquidGlassStyle} rounded-[2rem] p-6 flex flex-col items-center text-center group hover:bg-white/10 transition-colors duration-300`}>
                        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-sky-400 to-indigo-500 mb-4 group-hover:scale-105 transition-transform duration-300">
                            <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
                                <img 
                                    src={member.img || DEFAULT_AVATAR} 
                                    alt={member.name} 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1 truncate w-full">{member.name}</h3>
                        <p className="text-sky-400 text-sm font-medium mb-1 truncate w-full">{member.role || "Member"}</p>
                        <div className="bg-white/10 px-3 py-1 rounded-lg text-xs font-mono text-gray-400 mb-6 border border-white/5 w-full">
                            {member.nim}
                        </div>

                        <div className="flex gap-4 mt-auto">
                            {member.social?.github && (
                                <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/20 hover:text-white text-gray-400 transition-all">
                                    <Github size={18} />
                                </a>
                            )}
                            {member.social?.instagram && (
                                <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-pink-500/20 hover:text-pink-400 text-gray-400 transition-all">
                                    <Instagram size={18} />
                                </a>
                            )}
                            <div className="p-2 rounded-full bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 text-gray-400 transition-all cursor-pointer">
                                <Linkedin size={18} />
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full text-center text-gray-500 py-10">
                    Tidak ada data anggota tim.
                </div>
            )}
        </div>
      )}

      <div className="gsap-card mt-12 text-center border-t border-white/10 pt-8">
        <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
            <Code size={14} /> Built with Next.js 15, Tailwind, & GSAP
        </p>
      </div>

    </div>
  );
}