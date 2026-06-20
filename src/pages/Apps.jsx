import { useState, useEffect, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StaggerContext } from "../App";
import { db } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import SEO from "../components/SEO";
import Skeleton from "../components/Skeleton";
import AutoIllustration from "../components/AutoIllustration";
import { GridFour, Sparkle, ArrowUpRight, MagnifyingGlass, FunnelSimple } from "@phosphor-icons/react";

const accentColors = [
  { bg: 'bg-retro-yellow', gradient: 'gradient-yellow-lime', border: 'border-retro-yellow' },
  { bg: 'bg-retro-pink', gradient: 'gradient-hotpink-yellow', border: 'border-retro-pink' },
  { bg: 'bg-retro-mint', gradient: 'gradient-sky-mint', border: 'border-retro-mint' },
  { bg: 'bg-retro-lavender', gradient: 'gradient-lavender-pink', border: 'border-retro-lavender' },
  { bg: 'bg-retro-sky', gradient: 'gradient-sky-mint', border: 'border-retro-sky' },
  { bg: 'bg-retro-lime', gradient: 'gradient-yellow-lime', border: 'border-retro-lime' },
];

export default function Apps() {
  const itemVariants = useContext(StaggerContext);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const handleItemClick = async (item) => {
    try {
      const { doc, updateDoc, increment } = await import('firebase/firestore');
      const itemRef = doc(db, 'apps', item.id);
      await updateDoc(itemRef, { views: increment(1) });
    } catch (err) {
      console.error("Failed to increment views:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'apps'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        const data = [];
        snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        setApps(data);
        setLoading(false);
      } catch (err) {
        console.error("Firebase fetch error:", err);
        setError("Gagal mengambil data aplikasi. Mohon periksa koneksi internet Anda.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set();
    apps.forEach(app => {
      if (app.category) cats.add(app.category);
    });
    return ["Semua", ...Array.from(cats)];
  }, [apps]);

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.category && app.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (app.desc && app.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "Semua" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="flex-1 section-layered">
      <SEO title="Koleksi Aplikasi" />

      {/* Section background */}
      <div className="section-bg">
        <div className="absolute top-20 right-10 w-48 h-48 rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #FFD56B, transparent 70%)' }}></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #C9B6FF, transparent 70%)' }}></div>
      </div>

      <div className="section-content max-w-5xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
        {/* Header */}
        <motion.div variants={itemVariants} custom={1} className="flex items-center gap-3">
          <div className="w-11 h-11 gradient-yellow-lime retro-border rounded-xl flex items-center justify-center shadow-lvl-2">
            <GridFour size={22} weight="bold" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight bg-retro-white px-3 py-1 border-[2.5px] border-retro-dark rounded-xl shadow-lvl-1 leading-none">Semua Aplikasi</h1>
            <p className="text-xs md:text-sm text-[#2D2A26]/80 font-medium bg-retro-white px-2.5 py-1 border-[1.5px] border-retro-dark rounded-lg shadow-lvl-1">Koleksi tools edukasi untuk mempermudah guru dan siswa.</p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="ml-auto sticker bg-retro-lime hidden md:flex"
          >
            <Sparkle weight="fill" size={12} /> {apps.length || '...'} Apps
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
                placeholder="Cari aplikasi..."
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
                      ? 'bg-retro-yellow shadow-lvl-1 -translate-y-0.5'
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
        ) : filteredApps.length === 0 ? (
          <motion.div variants={itemVariants} custom={2} className="text-center w-full py-10 font-bold text-retro-dark/40 font-heading">
            Tidak ada aplikasi yang sesuai pencarian.
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredApps.map((app, i) => {
                const accent = accentColors[i % accentColors.length];
                const illustrationBg = accentColors[(i + 2) % accentColors.length];

                const CardContent = (
                  <div className="flex flex-col h-full">
                    {/* Colored accent strip at top */}
                    <div className={`${accent.gradient} h-2.5 w-full rounded-t-[9px]`}></div>

                    <div className="flex flex-col flex-1 min-h-0 p-3 pt-2">
                      {/* Illustration */}
                      <div className={`flex-1 min-h-0 border-[2.5px] border-retro-dark rounded-xl overflow-hidden ${illustrationBg.bg} relative`}>
                        {app.img ? (
                          <img src={app.img} alt={app.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-3">
                            <AutoIllustration name={app.name} category={app.category} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-40 pointer-events-none"></div>

                        {/* Category badge on illustration */}
                        <div className="absolute top-2 left-2">
                          <span className={`inline-block ${accent.bg} border-[2px] border-retro-dark rounded-full px-2.5 py-0.5 text-[10px] font-bold font-heading shadow-lvl-1 text-retro-dark`}>
                            {app.category || 'Aplikasi'}
                          </span>
                        </div>

                        {app.badge && (
                          <div className="absolute top-2 right-2">
                            <span className="inline-block bg-retro-white border-[2px] border-retro-dark rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-lvl-1 text-retro-dark">
                              {app.badge}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Text content */}
                      <div className="pt-2.5 px-0.5 pb-0.5">
                        <h3 className="font-heading text-[15px] font-bold text-retro-dark leading-tight line-clamp-1 flex items-center gap-1.5">
                          {app.name}
                          {app.link && <ArrowUpRight weight="bold" size={14} className="text-retro-dark/30 flex-shrink-0" />}
                        </h3>
                        <p className="text-[11px] text-retro-dark/55 mt-1 line-clamp-2 leading-relaxed">{app.desc}</p>
                      </div>
                    </div>
                  </div>
                );

        const cardClass = `retro-card p-0 h-[290px] bg-retro-white shadow-lvl-2 hover:shadow-lvl-3 transition-all group block overflow-hidden`;

        return app.link ? (
        <motion.a onClick={() => handleItemClick(app)}
          href={app.link} target="_blank" rel="noopener noreferrer"
          variants={itemVariants} custom={i + 2} key={app.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          whileHover={{ y: -6, scale: 1.02 }}
          className={cardClass}
        >
          {CardContent}
        </motion.a>
        ) : (
        <motion.div
          variants={itemVariants} custom={i + 2} key={app.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          whileHover={{ y: -6, scale: 1.02 }}
          className={cardClass}
        >
          {CardContent}
        </motion.div>
        );
              })}
      </AnimatePresence>
    </div>
  )
}
      </div >
    </main >
  );
}
