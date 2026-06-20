import { useState, useEffect, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StaggerContext } from "../App";
import { db } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Books, DownloadSimple, Sparkle, MagnifyingGlass, FunnelSimple } from "@phosphor-icons/react";
import SEO from "../components/SEO";
import Skeleton from "../components/Skeleton";
import AutoIllustration from "../components/AutoIllustration";

const accentColors = [
  { bg: 'bg-retro-yellow', gradient: 'gradient-yellow-lime' },
  { bg: 'bg-retro-pink', gradient: 'gradient-hotpink-yellow' },
  { bg: 'bg-retro-mint', gradient: 'gradient-sky-mint' },
  { bg: 'bg-retro-lavender', gradient: 'gradient-lavender-pink' },
  { bg: 'bg-retro-sky', gradient: 'gradient-sky-mint' },
];

export default function Materials() {
  const itemVariants = useContext(StaggerContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const handleItemClick = async (item) => {
    try {
      const { doc, updateDoc, increment } = await import('firebase/firestore');
      const itemRef = doc(db, 'materials', item.id);
      await updateDoc(itemRef, { views: increment(1) });
    } catch (err) {
      console.error("Failed to increment views:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'materials'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        const data = [];
        snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        setItems(data);
        setLoading(false);
      } catch (err) {
        console.error("Firebase fetch error:", err);
        setError("Gagal mengambil data materi. Mohon periksa koneksi internet Anda.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Extract unique categories from tags
  const categories = useMemo(() => {
    const cats = new Set();
    items.forEach(item => {
      if (item.category) cats.add(item.category);
      if (item.tags) item.tags.forEach(t => cats.add(t));
    });
    return ["Semua", ...Array.from(cats)];
  }, [items]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "Semua" || 
      item.category === selectedCategory || 
      (item.tags && item.tags.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="flex-1 relative z-10 section-layered">
      <SEO title="Materi Edukasi" />
      
      <div className="section-bg">
        <div className="absolute top-10 left-20 w-40 h-40 rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #B5D8B0, transparent 70%)' }}></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #B8CCE2, transparent 70%)' }}></div>
      </div>

      <div className="section-content max-w-5xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
        {/* Header */}
        <motion.div variants={itemVariants} custom={1} className="flex items-center gap-3">
          <div className="w-11 h-11 gradient-sky-mint retro-border rounded-xl flex items-center justify-center shadow-lvl-2">
            <Books size={22} weight="bold" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight bg-retro-white px-3 py-1 border-[2.5px] border-retro-dark rounded-xl shadow-lvl-1 leading-none">Materi Edukasi</h1>
            <p className="text-xs md:text-sm text-[#2D2A26]/80 font-medium bg-retro-white px-2.5 py-1 border-[1.5px] border-retro-dark rounded-lg shadow-lvl-1">Modul, presentasi, dan referensi belajar interaktif.</p>
          </div>
          <motion.div 
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="ml-auto sticker bg-retro-mint hidden md:flex"
          >
            <Sparkle weight="fill" size={12} /> Gratis
          </motion.div>
        </motion.div>

        {/* Search + Category Filter */}
        <motion.div variants={itemVariants} custom={1.5} className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Search */}
            <div className="relative max-w-sm w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlass size={18} className="text-retro-dark/50" weight="bold" />
              </div>
              <input
                type="text"
                placeholder="Cari materi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-retro-white retro-border rounded-xl shadow-lvl-1 focus:shadow-lvl-2 focus:outline-none transition-all font-heading text-sm"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-hide flex-1">
              <FunnelSimple size={16} weight="bold" className="text-retro-dark/40 flex-shrink-0" />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 font-heading font-bold text-[11px] px-3.5 py-1.5 rounded-full border-[2px] border-retro-dark transition-all duration-200
                    ${selectedCategory === cat 
                      ? 'bg-retro-mint shadow-lvl-1 -translate-y-0.5' 
                      : 'bg-retro-white hover:bg-retro-grey hover:-translate-y-0.5 hover:shadow-lvl-1'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
            
        {loading ? (
          <motion.div variants={itemVariants} custom={2}>
            <Skeleton count={4} type="card" />
          </motion.div>
        ) : error ? (
          <motion.div variants={itemVariants} custom={2} className="gradient-lavender-pink p-5 rounded-xl retro-border shadow-lvl-1 text-center font-bold text-sm">
            {error}
          </motion.div>
        ) : filteredItems.length === 0 ? (
          <motion.div variants={itemVariants} custom={2} className="text-center w-full py-10 font-bold text-retro-dark/40 font-heading">Tidak ada materi yang sesuai pencarian.</motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, i) => {
                const accent = accentColors[i % accentColors.length];
                const illustrationBg = accentColors[(i + 3) % accentColors.length];
                
                return (
                  <motion.div 
                    variants={itemVariants} custom={i + 3} key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="retro-card p-0 h-[290px] bg-retro-white shadow-lvl-2 hover:shadow-lvl-3 transition-all group block overflow-hidden"
                  >
                    <div className="flex flex-col h-full">
                      {/* Colored accent strip at top */}
                      <div className={`${accent.gradient} h-2.5 w-full rounded-t-[9px]`}></div>
                      
                      <div className="flex flex-col flex-1 min-h-0 p-3 pt-2">
                        {/* Illustration */}
                        <div className={`flex-1 min-h-0 border-[2.5px] border-retro-dark rounded-xl overflow-hidden ${illustrationBg.bg} relative`}>
                          {item.img ? (
                            <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center p-3">
                              <AutoIllustration name={item.title} category={item.category || 'edukasi'} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-40 pointer-events-none"></div>
                          
                          {/* Tags on illustration */}
                          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                            {item.tags && item.tags.slice(0, 2).map((t, j) => (
                              <span key={j} className={`inline-block ${j === 0 ? accent.bg : 'bg-retro-white'} border-[2px] border-retro-dark rounded-full px-2 py-0.5 text-[9px] font-bold font-heading shadow-lvl-1 text-retro-dark`}>{t}</span>
                            ))}
                          </div>
                        </div>

                        {/* Text content */}
                        <div className="pt-2.5 px-0.5 pb-0.5 flex flex-col">
                          <h3 className="font-heading font-bold text-sm leading-tight text-retro-dark line-clamp-1">{item.title}</h3>
                          <p className="text-[11px] text-retro-dark/55 mt-1 line-clamp-2 leading-relaxed">{item.desc}</p>
                          
                          <div className="mt-auto pt-2 flex items-center justify-end">
                            <motion.a onClick={() => handleItemClick(item)} 
                              href={item.link || "#"} target="_blank" rel="noreferrer" 
                              whileHover={{ y: -2, scale: 1.1 }}
                              className={`h-7 rounded-full ${accent.bg} border-[2px] border-retro-dark flex items-center justify-center shadow-lvl-1 hover:shadow-lvl-2 transition-all text-retro-dark px-3 gap-1.5 text-[10px] font-bold font-heading`}
                            >
                              <DownloadSimple weight="bold" size={13} />
                              Unduh
                            </motion.a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
