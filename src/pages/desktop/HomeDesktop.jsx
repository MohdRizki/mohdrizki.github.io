import { useContext, useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { StaggerContext } from "../../App";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import SEO from "../../components/SEO";
import AutoIllustration from "../../components/AutoIllustration";
import { ArrowRight, Sparkle, Rocket, BookOpenText, Lightning, Star, Trophy, FloppyDisk, ArrowUpRight, DownloadSimple } from "@phosphor-icons/react";
import animasiWebp from "../../assets/animasi.webp";

/* ─── Animated Counter Hook ──────────────────────────── */
function useAnimatedCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || target === 0) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return { count, targetRef: ref };
}

/* ─── Scroll Reveal Wrapper ──────────────────────────── */
function RevealSection({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section Header ─────────────────────────────────── */
function SectionHeader({ title, subtitle, link, linkText = "Lihat Semua", icon, accentColor = "bg-retro-yellow" }) {
  return (
    <div className="flex justify-between items-end mb-6">
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`w-10 h-10 ${accentColor} retro-border rounded-xl flex items-center justify-center shadow-lvl-1`}>
            {icon}
          </div>
        )}
        <div className="flex flex-col items-start gap-1">
          <h2 className="font-heading text-xl md:text-2xl font-bold tracking-tight bg-retro-white px-3 py-1 border-[2.5px] border-retro-dark rounded-xl shadow-lvl-1 leading-none">{title}</h2>
          <p className="text-xs md:text-sm text-[#2D2A26]/80 font-medium bg-retro-white px-2.5 py-1 border-[1.5px] border-retro-dark rounded-lg shadow-lvl-1">{subtitle}</p>
        </div>
      </div>
      {link && (
        <Link to={link} className="font-heading font-bold text-xs retro-border bg-retro-white px-3 py-1.5 rounded-full shadow-lvl-1 hover:bg-retro-yellow transition-colors inline-flex items-center gap-1.5 flex-shrink-0">
          {linkText} <ArrowRight weight="bold" size={12} />
        </Link>
      )}
    </div>
  );
}

/* ─── Accent color sets ──────────────────────────────── */
const appAccents = [
  { bg: 'bg-retro-yellow', gradient: 'gradient-yellow-lime', illBg: 'bg-retro-mint', emoji: '🚀' },
  { bg: 'bg-retro-pink', gradient: 'gradient-hotpink-yellow', illBg: 'bg-retro-lavender', emoji: '⚡' },
  { bg: 'bg-retro-sky', gradient: 'gradient-sky-mint', illBg: 'bg-retro-yellow', emoji: '🎯' },
  { bg: 'bg-retro-lavender', gradient: 'gradient-lavender-pink', illBg: 'bg-retro-pink', emoji: '✨' },
];

const materialAccents = [
  { bg: 'bg-retro-mint', gradient: 'gradient-sky-mint', illBg: 'bg-retro-yellow', emoji: '📖' },
  { bg: 'bg-retro-pink', gradient: 'gradient-hotpink-yellow', illBg: 'bg-retro-sky', emoji: '📝' },
  { bg: 'bg-retro-lavender', gradient: 'gradient-lavender-pink', illBg: 'bg-retro-mint', emoji: '🎨' },
];

export default function Home() {
  const itemVariants = useContext(StaggerContext);
  const [apps, setApps] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [targetVisitors, setTargetVisitors] = useState(0); // 0 ensures it waits for fetch

  useEffect(() => {
    const initVisitors = async () => {
      try {
        // We use dynamic import for firestore methods to avoid cluttering top imports
        const { doc, getDoc, setDoc, updateDoc, increment } = await import('firebase/firestore');
        const statsRef = doc(db, 'stats', 'visitors');
        const docSnap = await getDoc(statsRef);
        if (docSnap.exists()) {
          const currentCount = docSnap.data().count || 12400;
          setTargetVisitors(currentCount + 1);
          await updateDoc(statsRef, { count: increment(1) });
        } else {
          await setDoc(statsRef, { count: 12401 });
          setTargetVisitors(12401);
        }
      } catch (err) {
        console.error("Stats error:", err);
        setTargetVisitors(12400); // fallback
      }
    };
    initVisitors();
  }, []);

  // Animated stats
  const { count: visitorsCount, targetRef: visitorsRef } = useAnimatedCounter(targetVisitors);
  const { count: projectsCount, targetRef: projectsRef } = useAnimatedCounter(10);
  const { count: studentsCount, targetRef: studentsRef } = useAnimatedCounter(30);

  // Try fetching from Firebase, fall back to static data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const qApps = query(collection(db, 'apps'), orderBy('order', 'asc'), limit(2));
        const snapApps = await getDocs(qApps);
        if (!snapApps.empty) {
          const data = [];
          snapApps.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
          setApps(data);
        }
      } catch (e) { console.error("Failed to fetch apps"); }

      try {
        const qMaterials = query(collection(db, 'materials'), orderBy('order', 'asc'), limit(3));
        const snapMaterials = await getDocs(qMaterials);
        if (!snapMaterials.empty) {
          const data = [];
          snapMaterials.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
          setMaterials(data);
        }
      } catch (e) { console.error("Failed to fetch materials"); }
    };
    fetchData();
  }, []);

  return (
    <main className="flex-1">
      <SEO title="Beranda" />
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-12">

        {/* ═══ HERO BENTO ═══ */}
        <RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Main Hero Card */}
            <motion.div 
              variants={itemVariants} custom={1}
              className="md:col-span-2 retro-card-feature p-8 md:p-10 flex flex-col justify-center relative overflow-hidden bg-noise"
              style={{ background: 'linear-gradient(135deg, rgba(184,204,226,0.25) 0%, rgba(255,255,255,1) 40%, rgba(181,216,176,0.15) 100%)' }}
            >
              {/* Decorative elements */}
              <div className="absolute right-8 top-8 w-32 h-32 rounded-full opacity-20 blur-2xl" style={{ background: 'linear-gradient(135deg, #FFD56B, #F1FF5E)' }}></div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full opacity-15 blur-3xl" style={{ background: 'linear-gradient(135deg, #FFBCB0, #FF8FA3)' }}></div>
              
              {/* Floating sticker */}
              <motion.div 
                animate={{ y: [0, -5, 0], rotate: [-3, 1, -3] }} 
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-6 right-6 sticker bg-retro-lime -rotate-6 hidden md:flex"
              >
                <Star weight="fill" size={12} /> SD Kelas 1-6
              </motion.div>

              <motion.span 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-retro-dark/50 mb-4"
              >
                <Sparkle weight="fill" className="text-retro-yellow" size={14} />
                Selamat Datang
              </motion.span>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-[1.08] tracking-tight">
                Edukasi Anak
                <br />
                <span className="inline-block bg-retro-dark text-retro-yellow px-3 py-1 retro-border shadow-lvl-2 rotate-[-1deg] mt-1.5">Sekolah Dasar</span>
              </h1>
              <p className="text-sm md:text-base text-retro-dark/60 max-w-lg leading-relaxed mb-6">
                Menghadirkan pembelajaran interaktif yang ramah anak, kreatif, dan menyenangkan untuk siswa siswi dasar.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/aplikasi" className="btn-retro gradient-yellow-lime text-sm px-6 py-2.5 rounded-full inline-flex items-center gap-2 group shadow-lvl-2">
                  Jelajahi Aplikasi
                  <ArrowRight weight="bold" className="group-hover:translate-x-1.5 transition-transform duration-200" />
                </Link>
                <Link to="/tentang-saya" className="btn-secondary text-sm px-6 py-2.5 rounded-full">
                  Tentang Saya
                </Link>
              </div>
            </motion.div>

            {/* Hero Stats Card */}
            <motion.div 
              variants={itemVariants} custom={2}
              className="retro-card group gradient-sky-mint p-0 flex flex-col relative overflow-hidden shadow-lvl-3 border-[2.5px] border-retro-dark h-[340px]"
            >
              {/* Pattern and Noise */}
              <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#2D2A26 2px, transparent 2px)', backgroundSize: '16px 16px' }}></div>
              <div className="absolute inset-0 bg-noise opacity-40 mix-blend-overlay"></div>
              
              {/* Animation Container */}
              <div className="flex-1 w-full relative z-10 overflow-hidden flex items-end justify-center">
                <div className="relative flex justify-center items-end w-full h-full">
                  {/* Bubble Text */}
                  <div className="absolute top-[15%] left-[5%] bg-retro-white border-[2.5px] border-retro-dark px-3 py-1.5 rounded-2xl rounded-br-none shadow-lvl-1 z-20 animate-[bounce_3s_infinite] rotate-[-5deg]">
                    <span className="font-heading font-bold text-retro-dark text-sm">Halo! 👋</span>
                  </div>

                  <img src={animasiWebp} alt="Animasi Pengunjung" className="w-[180%] max-w-none object-contain drop-shadow-md group-hover:scale-[1.03] origin-bottom transition-transform duration-500 translate-y-[40%]" />
                </div>
              </div>
              
              {/* Stats Bar */}
              <div className="relative z-20 w-full bg-retro-white border-t-[2.5px] border-retro-dark px-5 py-4 flex flex-col items-center text-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <span className="text-[11px] font-bold text-retro-dark/60 block mb-0.5 uppercase tracking-wider">Total Pengunjung</span>
                <span ref={visitorsRef} className="font-heading text-4xl font-bold text-retro-dark leading-none">
                  {visitorsCount.toLocaleString('id-ID')}
                </span>
              </div>
            </motion.div>
          </div>
        </RevealSection>

        {/* ═══ STATS ROW ═══ */}
        <RevealSection>
          <div className="grid grid-cols-3 gap-4 md:gap-5">
            {[
              { ref: projectsRef, icon: <Rocket weight="fill" size={20} />, bgIcon: <Rocket weight="fill" size={120} />, value: `${projectsCount}+`, label: "Media Belajar SD", gradient: "gradient-yellow-lime", iconBg: "bg-retro-yellow" },
              { ref: studentsRef, icon: <BookOpenText weight="fill" size={20} />, bgIcon: <BookOpenText weight="fill" size={120} />, value: `${studentsCount}+`, label: "Siswa Dasar", gradient: "gradient-blue-mint", iconBg: "bg-retro-blue" },
              { ref: null, icon: <Lightning weight="fill" size={20} />, bgIcon: <Lightning weight="fill" size={120} />, value: "40%", label: "Efisiensi Waktu", gradient: "gradient-lavender-pink", iconBg: "bg-retro-lavender" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                variants={itemVariants} custom={i + 3}
                whileHover={{ y: -4, rotate: i === 1 ? 0 : (i === 0 ? -1 : 1) }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`retro-card group p-5 text-center ${stat.gradient} relative overflow-hidden ${i === 0 ? 'retro-border-thick shadow-lvl-3' : 'shadow-lvl-1 hover:shadow-lvl-2'}`}
              >
                <div className="absolute inset-0 bg-noise"></div>
                
                {/* Bright Background Accent/Illustration */}
                <div className="absolute -right-6 -bottom-6 text-retro-dark opacity-[0.06] rotate-[-15deg] group-hover:rotate-0 group-hover:scale-110 group-hover:opacity-[0.08] transition-all duration-500">
                  {stat.bgIcon}
                </div>
                <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="relative z-10">
                  <div className={`w-10 h-10 ${stat.iconBg} retro-border rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lvl-1`}>
                    {stat.icon}
                  </div>
                  <span ref={stat.ref} className="font-heading text-2xl md:text-3xl font-bold block">{stat.value}</span>
                  <span className="text-[11px] font-bold text-retro-dark/50 mt-1 block">{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </RevealSection>

        {/* ═══ APLIKASI POPULER — NEW CARD DESIGN ═══ */}
        {apps.length > 0 && (
        <RevealSection className="section-layered">
          <div className="section-bg">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #FFD56B, transparent 70%)' }}></div>
          </div>
          <div className="section-content">
            <SectionHeader 
              title="Aplikasi Populer" 
              subtitle="Media ajar interaktif untuk siswa SD" 
              link="/aplikasi"
              icon={<Rocket weight="fill" size={18} />}
              accentColor="bg-retro-yellow"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {apps.map((app, i) => {
                const accent = appAccents[i % appAccents.length];
                
                const CardContent = (
                  <>
                    <div className="flex flex-col h-full">
                      {/* Top colored band */}
                      <div className={`${accent.gradient} h-3 w-full rounded-t-[9px]`}></div>
                    
                    <div className="flex flex-col flex-1 p-4 pt-3">
                      {/* Illustration */}
                      <div className={`flex-1 min-h-0 border-[2.5px] border-retro-dark rounded-xl overflow-hidden ${accent.illBg} relative`}>
                        {app.img ? (
                          <img src={app.img} alt={app.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-3">
                            <AutoIllustration name={app.name} category={app.category} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-40 pointer-events-none"></div>
                        
                        {app.badge && (
                          <div className="absolute top-2 right-2">
                            <span className={`inline-block ${accent.bg} border-[2px] border-retro-dark rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-lvl-1`}>
                              {app.badge}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Text */}
                      <div className="pt-3 flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading text-base font-bold text-retro-dark leading-tight line-clamp-1">{app.name}</h3>
                          <p className="text-[11px] text-retro-dark/55 mt-1 line-clamp-2 leading-relaxed">{app.desc}</p>
                          <div className="mt-2">
                            <span className={`inline-block ${accent.bg} border-[1.5px] border-retro-dark rounded-full px-2.5 py-0.5 text-[10px] font-bold font-heading shadow-lvl-1`}>
                              {app.category || 'Aplikasi'}
                            </span>
                          </div>
                        </div>
                        <div className={`flex-shrink-0 w-9 h-9 rounded-full ${accent.bg} retro-border flex items-center justify-center shadow-lvl-1 group-hover:shadow-lvl-2 group-hover:scale-110 transition-all mt-1`}>
                          <ArrowUpRight weight="bold" size={16} />
                        </div>
                      </div>
                    </div>
                    </div>
                    
                    {/* Floating Emoji Badge */}
                    <div className="absolute -top-4 right-4 w-9 h-9 rounded-full bg-retro-white retro-border flex items-center justify-center text-base pb-[2px] shadow-lvl-1 z-20">
                      {accent.emoji}
                    </div>
                  </>
                );

                const cardClass = "retro-card p-0 h-[300px] bg-retro-white shadow-lvl-2 hover:shadow-lvl-3 transition-all group block overflow-visible";
                
                return app.link ? (
                  <motion.a 
                    href={app.link} target="_blank" rel="noopener noreferrer" 
                    key={app.id} variants={itemVariants} custom={i + 6} 
                    whileHover={{ y: -5 }}
                    className={cardClass}
                  >
                    {CardContent}
                  </motion.a>
                ) : (
                  <motion.div key={app.id} variants={itemVariants} custom={i + 6} whileHover={{ y: -5 }}>
                    <Link to="/aplikasi" className={cardClass}>
                      {CardContent}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </RevealSection>
        )}

        {/* ═══ MATERI EDUKASI — NEW CARD DESIGN ═══ */}
        {materials.length > 0 && (
        <RevealSection className="section-layered">
          <div className="section-bg">
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #B8CCE2, transparent 70%)' }}></div>
          </div>
          <div className="section-content">
            <SectionHeader 
              title="Materi Edukasi" 
              subtitle="Bahan ajar ramah anak berbasis Kurikulum Merdeka" 
              link="/materi"
              icon={<BookOpenText weight="fill" size={18} />}
              accentColor="bg-retro-mint"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {materials.map((item, i) => {
                const accent = materialAccents[i % materialAccents.length];
                
                const CardContent = (
                  <>
                    <div className="flex flex-col h-full">
                      {/* Top colored band */}
                      <div className={`${accent.gradient} h-2.5 w-full rounded-t-[9px]`}></div>
                    
                    <div className="flex flex-col flex-1 p-3 pt-2">
                      {/* Illustration */}
                      <div className={`flex-1 min-h-0 border-[2.5px] border-retro-dark rounded-xl overflow-hidden ${accent.illBg} relative`}>
                        {item.img ? (
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-3">
                            <AutoIllustration name={item.title} category={item.category || 'edukasi'} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-40 pointer-events-none"></div>
                      </div>
                      
                      {/* Text */}
                      <div className="pt-2 px-0.5">
                        <h3 className="font-heading font-bold text-[13px] leading-tight text-retro-dark line-clamp-2">{item.title}</h3>
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className={`w-4 h-4 rounded-full ${accent.gradient} border-[1.5px] border-retro-dark flex-shrink-0`}></div>
                          <span className="text-[10px] font-bold text-retro-dark/45 line-clamp-1">{item.author || 'Mohamad Rizki'}</span>
                        </div>
                      </div>
                    </div>
                    </div>
                    
                    {/* Floating Emoji Badge */}
                    <div className="absolute -top-4 right-4 w-9 h-9 rounded-full bg-retro-white retro-border flex items-center justify-center text-base pb-[2px] shadow-lvl-1 z-20">
                      {accent.emoji}
                    </div>
                  </>
                );

                return item.link ? (
                  <motion.a href={item.link} target="_blank" rel="noopener noreferrer" key={item.id} variants={itemVariants} custom={i + 8} whileHover={{ y: -4 }} className="retro-card p-0 h-[240px] bg-retro-white relative group block shadow-lvl-1 hover:shadow-lvl-2 transition-all overflow-visible">
                    {CardContent}
                  </motion.a>
                ) : (
                  <motion.div key={item.id} variants={itemVariants} custom={i + 8} whileHover={{ y: -4 }}>
                    <Link to="/materi" className="retro-card p-0 h-[240px] bg-retro-white relative group block shadow-lvl-1 hover:shadow-lvl-2 transition-all overflow-visible">
                      {CardContent}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </RevealSection>
        )}

      </div>
    </main>
  );
}
