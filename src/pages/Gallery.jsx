import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StaggerContext } from "../App";
import { db } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Image, Camera, X, Sparkle } from "@phosphor-icons/react";
import SEO from "../components/SEO";
import Skeleton from "../components/Skeleton";

export default function Gallery() {
  const itemVariants = useContext(StaggerContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('timestamp', 'desc'));
        const snap = await getDocs(q);
        const data = [];
        snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        setItems(data);
        setLoading(false);
      } catch (err) {
        console.error("Firebase fetch error:", err);
        setError("Gagal mengambil foto galeri. Mohon periksa koneksi internet Anda.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const gradients = ['gradient-lavender-pink', 'gradient-blue-mint', 'gradient-yellow-lime', 'gradient-sky-mint', 'gradient-pink-yellow'];
  const bgTints = ['bg-retro-pink/10', 'bg-retro-blue/10', 'bg-retro-yellow/10', 'bg-retro-mint/10', 'bg-retro-lavender/10'];

  return (
    <>
    <main className="flex-1 relative z-10 section-layered">
      <SEO title="Galeri Kegiatan" />
      
      <div className="section-bg">
        <div className="absolute top-20 right-20 w-44 h-44 rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #FFBCB0, transparent 70%)' }}></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #C9B6FF, transparent 70%)' }}></div>
      </div>

      <div className="section-content max-w-5xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
        {/* Header */}
        <motion.div variants={itemVariants} custom={1} className="flex items-center gap-3">
          <div className="w-11 h-11 gradient-lavender-pink retro-border rounded-xl flex items-center justify-center shadow-lvl-2">
            <Image size={22} weight="bold" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight bg-retro-white px-3 py-1 border-[2.5px] border-retro-dark rounded-xl shadow-lvl-1 leading-none">Galeri Kegiatan</h1>
            <p className="text-xs md:text-sm text-[#2D2A26]/80 font-medium bg-retro-white px-2.5 py-1 border-[1.5px] border-retro-dark rounded-lg shadow-lvl-1">Dokumentasi kegiatan pembelajaran dan kolaborasi di sekolah.</p>
          </div>
          <motion.div 
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="ml-auto sticker bg-retro-pink hidden md:flex"
          >
            <Sparkle weight="fill" size={12} /> Memories
          </motion.div>
        </motion.div>
            
        {loading ? (
          <motion.div variants={itemVariants} custom={2}>
            <Skeleton count={6} type="gallery" />
          </motion.div>
        ) : error ? (
          <motion.div variants={itemVariants} custom={2} className="gradient-lavender-pink p-5 rounded-xl retro-border shadow-lvl-1 text-center font-bold text-sm">
            {error}
          </motion.div>
        ) : items.length === 0 ? (
          <motion.div variants={itemVariants} custom={2} className="text-center w-full py-10 font-bold text-retro-dark/40 font-heading">Belum ada foto.</motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {items.map((item, i) => {
              // Alternate between different sizes for visual interest
              const isLarge = i % 5 === 0;
              return (
                <motion.div 
                  variants={itemVariants} custom={i + 3} key={item.id} 
                  onClick={() => setSelectedImg(item.img)} 
                  whileHover={{ y: -4, rotate: i % 2 === 0 ? -0.5 : 0.5 }}
                  className={`retro-card group relative cursor-pointer ${isLarge ? 'md:col-span-2 md:row-span-1' : ''}`}
                >
                  {/* Gradient accent strip */}
                  <div className={`h-1.5 ${gradients[i % gradients.length]}`}></div>
                  <div className={`${bgTints[i % bgTints.length]} p-3.5 relative`}>
                    <div className="absolute inset-0 bg-noise rounded-b-[inherit]"></div>
                    <div className="relative z-10">
                      <div className="w-full aspect-square bg-retro-white retro-border rounded-xl mb-3 flex items-center justify-center overflow-hidden shadow-lvl-1 group-hover:shadow-lvl-2 transition-all duration-300">
                        {item.img ? (
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <Camera size={32} className="text-retro-dark/20" />
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-retro-dark/0 group-hover:bg-retro-dark/10 transition-colors duration-300 rounded-xl flex items-center justify-center">
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <div className="w-10 h-10 bg-retro-yellow retro-border rounded-full flex items-center justify-center shadow-lvl-1">
                              <Image size={18} weight="bold" />
                            </div>
                          </motion.div>
                        </div>
                      </div>
                      <h3 className="font-heading text-sm font-bold leading-tight mb-1 group-hover:text-retro-blue transition-colors">{item.title}</h3>
                      <p className="text-[11px] text-retro-dark/50 line-clamp-2">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>

    {/* ═══ Premium Lightbox ═══ */}
    <AnimatePresence>
      {selectedImg && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setSelectedImg(null)}
          className="fixed inset-0 z-[9999] glass-dark flex items-center justify-center p-4 cursor-zoom-out"
        >
          {/* Close button */}
          <motion.button 
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="absolute top-6 right-6 w-10 h-10 gradient-yellow-lime retro-border rounded-full shadow-lvl-2 flex items-center justify-center text-retro-dark hover:scale-110 transition-transform z-10"
          >
            <X size={20} weight="bold" />
          </motion.button>

          {/* Retro window lightbox */}
          <motion.div 
            initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[80vh] retro-window shadow-lvl-4"
          >
            <div className="retro-window-titlebar">
              <div className="retro-window-dot" style={{ backgroundColor: '#FFBCB0' }}></div>
              <div className="retro-window-dot" style={{ backgroundColor: '#FFD56B' }}></div>
              <div className="retro-window-dot" style={{ backgroundColor: '#B5D8B0' }}></div>
              <span className="text-[10px] font-bold text-retro-white/50 ml-2 font-heading">galeri_foto.png</span>
            </div>
            <div className="retro-window-body p-2">
              <img src={selectedImg} alt="Foto Galeri" className="max-w-full max-h-[70vh] object-contain rounded-lg retro-border" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
