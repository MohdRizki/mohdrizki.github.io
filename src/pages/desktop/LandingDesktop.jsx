import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkle, Rocket, BookOpenText, Star } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { ZipperContext } from "../../App";
import SEO from "../../components/SEO";

export default function Landing() {
  const navigate = useNavigate();
  const { setIsZipping } = useContext(ZipperContext);

  const handleStart = () => {
    setIsZipping(true);
    navigate('/beranda');
  };

  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="flex-1 flex items-center justify-center relative w-full min-h-[calc(100vh-80px)] overflow-hidden"
    >

      {/* ═══ BACKGROUND LAYERS ═══ */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid opacity-40"></div>
      </div>

      {/* ═══ DECORATIVE STICKERS ═══ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sparkle Stars */}
        <motion.div
          animate={{ rotate: [0, 15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[8%] right-[15%] hidden md:block"
        >
          <div className="sticker bg-retro-lime -rotate-6">
            <Star weight="fill" size={14} /> Ramah Anak
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-4, 2, -4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[15%] left-[8%] hidden md:block"
        >
          <div className="sticker bg-retro-sky rotate-3">
            <Rocket weight="fill" size={14} /> Ceria & Aktif
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -6, 0], rotate: [3, -2, 3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[25%] left-[5%] hidden lg:block"
        >
          <div className="sticker bg-retro-lavender -rotate-3">
            <BookOpenText weight="fill" size={14} /> Belajar Seru
          </div>
        </motion.div>

        {/* Decorative shapes */}
        <svg className="absolute w-28 h-28 top-[5%] left-[25%] text-retro-yellow opacity-20 hidden md:block" viewBox="0 0 100 100" fill="currentColor"><path d="M10,50 Q20,10 50,20 T90,50 T50,80 T10,50 Z" /></svg>
        <svg className="absolute w-20 h-20 bottom-[8%] right-[20%] text-retro-pink opacity-20 hidden md:block" viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="40" /></svg>
        <svg className="absolute w-14 h-14 top-[30%] right-[8%] text-retro-mint opacity-25 hidden md:block" viewBox="0 0 100 100" fill="currentColor"><rect x="20" y="20" width="60" height="60" rx="8" transform="rotate(15 50 50)" /></svg>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <AnimatePresence>
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-5xl px-5 py-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10"
        >
          {/* ── Text Content ── */}
          <div className="flex-1 text-center md:text-left order-2 md:order-1 max-w-lg">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="inline-block px-4 py-1.5 gradient-yellow-lime retro-border rounded-full font-heading font-bold text-xs mb-3 shadow-lvl-1 -rotate-2"
            >
              <span className="flex items-center gap-1.5">
                <Sparkle weight="fill" size={14} />
                Guru SD & Edukator Interaktif
              </span>
            </motion.div>

            {/* Hero Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading text-4xl sm:text-4xl md:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.08] mb-3 tracking-tight"
            >
              Pendidik Kenal Digital<br />
              <span className="inline-block bg-retro-dark text-retro-yellow px-3 py-1 retro-border shadow-lvl-2 rotate-[-1deg] mt-1">Belajar Menyenangkan </span>{" "}
              <span className="inline-block bg-retro-yellow px-2.5 py-0.5 retro-border shadow-lvl-1 rotate-[1deg]">Hasil Maksimal</span>
              <span className="text-retro-dark/30">.</span>
            </motion.h1>

            {/* Description in Retro Window */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="retro-window mb-5 max-w-md mx-auto md:mx-0"
            >
              <div className="retro-window-titlebar">
                <div className="retro-window-dot" style={{ backgroundColor: '#FFBCB0' }}></div>
                <div className="retro-window-dot" style={{ backgroundColor: '#FFD56B' }}></div>
                <div className="retro-window-dot" style={{ backgroundColor: '#B5D8B0' }}></div>
                <span className="text-[10px] font-bold text-retro-white/50 ml-2 font-heading">tentang_saya.md</span>
              </div>
              <div className="retro-window-body">
                <p className="text-sm text-retro-dark/85 font-medium leading-relaxed">
                  Sampurasun, Saya Rizki - Pendidik yang menggabungkan pendekatan <span className="font-bold text-retro-dark">pedagogik kreatif</span> dan <span className="font-bold text-retro-dark">media interaktif</span> untuk menghadirkan pengalaman belajar bermakna bagi anak usia dasar.
                </p>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
            >
              <button
                onClick={handleStart}
                className="btn-retro gradient-yellow-lime text-sm px-7 py-3 rounded-full inline-flex items-center justify-center gap-2 group shadow-lvl-2"
              >
                Mulai Jelajah
                <ArrowRight weight="bold" className="group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>
              <button
                onClick={() => navigate('/tentang-saya')}
                className="btn-secondary text-sm px-7 py-3 rounded-full inline-flex items-center justify-center gap-2"
              >
                Tentang Saya
              </button>
            </motion.div>
          </div>

          {/* ── Profile Photo Section ── */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 150 }}
            className="relative w-full max-w-[250px] order-1 md:order-2"
          >
            {/* Layered offset backgrounds */}
            <div className="absolute inset-0 gradient-lavender-pink retro-border rounded-2xl translate-x-4 translate-y-4 shadow-lvl-3"></div>
            <div className="absolute inset-0 gradient-blue-mint retro-border rounded-2xl translate-x-2 translate-y-2"></div>

            {/* Main photo card */}
            <div className="relative bg-retro-white retro-border p-2 rounded-2xl shadow-lvl-2">
              <div className="rounded-xl overflow-hidden aspect-[4/5] retro-border bg-retro-grey">
                <img src="/profile.png" alt="Mohamad Rizki" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/400x500/FFF8EC/2D2A26?text=Profile'} />
              </div>
            </div>

            {/* Floating stat stickers */}
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [-4, -2, -4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 sticker bg-retro-yellow"
            >
              <span className="text-[11px]">Mohamad Rizki, S.Pd., Gr.</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, -5, 0], rotate: [3, 5, 3] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -top-3 -right-3 sticker bg-retro-mint rotate-3"
            >
              <span className="text-[11px]">Reezapps' Developer</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, -4, 0], rotate: [-2, 1, -2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 -right-6 sticker bg-retro-sky -rotate-2 hidden md:flex"
            >
              <span className="text-[11px]">Pandeglang, ID </span>
            </motion.div>
          </motion.div>
        </motion.main>
      </AnimatePresence>
    </motion.div>
  );
}
