import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { WarningCircle, ArrowLeft, FloppyDisk } from '@phosphor-icons/react';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[calc(100vh-80px)] relative">
      <SEO title="404 Tersesat" />
      
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-48 h-48 rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #FFBCB0, transparent 70%)' }}></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #C9B6FF, transparent 70%)' }}></div>
      </div>

      {/* Floating stickers */}
      <motion.div 
        animate={{ y: [0, -8, 0], rotate: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] right-[20%] hidden md:block"
      >
        <div className="sticker bg-retro-yellow rotate-6">
          <FloppyDisk weight="fill" size={14} />
          <span className="text-[10px]">Error!</span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="retro-card-feature p-10 max-w-sm text-center bg-retro-white flex flex-col items-center relative overflow-hidden shadow-lvl-3"
      >
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 gradient-lavender-pink"></div>
        <div className="absolute inset-0 bg-noise"></div>

        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
            animate={{ rotate: [10, 15, 10] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-18 h-18 gradient-lavender-pink retro-border rounded-2xl flex items-center justify-center shadow-lvl-2 mb-6 rotate-12"
          >
            <WarningCircle size={36} weight="bold" />
          </motion.div>
          
          <h1 className="font-heading text-7xl font-bold mb-2 tracking-tight" style={{ background: 'linear-gradient(135deg, #FF8FA3, #C9B6FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</h1>
          <h2 className="font-heading text-xl font-bold mb-4">Halaman Tersesat</h2>
          <p className="text-sm text-retro-dark/60 mb-8 leading-relaxed">
            Waduh, sepertinya halaman yang Anda cari sudah dihapus atau URL-nya salah ketik.
          </p>
          <Link 
            to="/"
            className="btn-retro gradient-yellow-lime text-sm px-6 py-3 rounded-xl w-full flex items-center justify-center gap-2 shadow-lvl-2"
          >
            <ArrowLeft weight="bold" size={16} />
            Kembali ke Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
