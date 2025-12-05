"use client"; // kalau kamu pakai Next.js App Router

import React, { useState, useEffect, useCallback, useRef } from "react";
import gsap from "gsap";

const DecryptedText = ({ text, className, speed = 30, initialGarbageLength = 100 }) => {
  const [displayText, setDisplayText] = useState(text.padEnd(initialGarbageLength, "█"));
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [startDecryption, setStartDecryption] = useState(false);

  const garbageChars = "!@#$%^&*()_+=-[]{};'\"\\|,.<>/?`~";

  const generateGarbage = useCallback((length) => {
    let res = "";
    for (let i = 0; i < length; i++) {
      res += garbageChars.charAt(Math.floor(Math.random() * garbageChars.length));
    }
    return res;
  }, [garbageChars]);

  useEffect(() => {
    const timer = setTimeout(() => setStartDecryption(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!startDecryption || isDecrypted) return;

    let i = 0;
    const targetLength = text.length;

    const run = setInterval(() => {
      setDisplayText(() => {
        if (i < targetLength) {
          const decrypted = text.substring(0, i + 1);
          const garbage = generateGarbage(targetLength - (i + 1));
          i++;
          return decrypted + garbage;
        } else {
          clearInterval(run);
          setIsDecrypted(true);
          return text;
        }
      });
    }, speed);

    return () => clearInterval(run);
  }, [text, speed, generateGarbage, isDecrypted, startDecryption]);

  return <span className={className}>{displayText}</span>;
};

const App = () => {
  const [isHovered, setIsHovered] = useState(false);

  // refs untuk GSAP
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const textRef = useRef(null);
  const cipherRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(titleRef.current, {
      y: 150,
      opacity: 0,
      duration: 1.8,
      ease: "power4.out",
      delay: 0.2,
    })
      .from(
        subtitleRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=1.2"
      )
      .from(
        textRef.current,
        {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.6"
      )
      .from(
        cipherRef.current,
        {
          scale: 0.8,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "-=0.4"
      )
      .from(
        buttonRef.current,
        {
          scale: 0,
          opacity: 0,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
        },
        "-=0.2"
      );
  }, []);
  
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center relative overflow-hidden">

      {/* Extra CSS */}
      <style>{`
        @keyframes subtle-glow {
          0%, 100% { 
            text-shadow: 0 0 5px rgba(56, 189, 248, 0.5), 0 0 10px rgba(56, 189, 248, 0.3);
          }
          50% { 
            text-shadow: 0 0 15px rgba(56, 189, 248, 0.8), 0 0 30px rgba(56, 189, 248, 0.6);
          }
        }
        .text-glow-animated {
          animation: subtle-glow 3s infinite alternate;
        }
        .background-gradient {
          background: radial-gradient(circle at center, #F0F9FF 0%, #FFFFFF 70%);
        }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 background-gradient z-0"></div>

      {/* CONTENT */}
      <div className="z-10 w-full max-w-7xl px-4 flex flex-col items-center text-center space-y-10">

        {/* Header */}
        <header className="overflow-hidden p-4">
          <div ref={titleRef}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-sky-600 text-glow-animated">
              Shtt
            </h1>
          </div>

          <div ref={subtitleRef}>
            <p className="mt-4 text-lg md:text-xl font-light text-gray-500 uppercase tracking-[0.3em]">
              Securely Hide Text Translation
            </p>
          </div>
        </header>

        {/* Main Text */}
        <section className="space-y-6 max-w-4xl">
          <div ref={textRef}>
            <p className="text-2xl md:text-4xl font-thin text-gray-800 leading-relaxed">
              Transforming{" "}
              <span className="font-bold text-sky-600">Plain Text</span>{" "}
              into{" "}
              <span className="font-bold text-sky-600">Encrypted Ciphers.</span>
            </p>
          </div>

          {/* DecryptedText Animation */}
          <div ref={cipherRef} className="flex justify-center py-2">
            <DecryptedText
              text="DATA ENCRYPTED. SECURITY LEVEL: QUANTUM SECURE."
              className="text-sm md:text-base font-mono text-sky-800/80 tracking-widest uppercase"
              speed={60}
            />
          </div>

          {/* BUTTON */}
          <div ref={buttonRef} className="pt-4">
            <button
              className="group relative inline-flex items-center justify-center px-10 py-3 text-white bg-sky-500 font-bold rounded-full hover:bg-sky-600 transition"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="relative text-lg tracking-widest flex items-center gap-2">
                Start Encoding
                <svg
                  className={`w-5 transition-transform duration-500 ${
                    isHovered ? "translate-x-2" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="absolute bottom-6 w-full text-center">
          <p className="text-xs text-gray-400 font-mono tracking-wider opacity-60">
            Powered by Shtt Algorithm v1.0 Alpha
          </p>
        </footer>

      </div>
    </div>
  );
};

export default App;
