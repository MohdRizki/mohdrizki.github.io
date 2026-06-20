import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import SEO from "../../components/SEO";
import AutoIllustration from "../../components/AutoIllustration";
import { ArrowRight, Sparkle, Rocket, BookOpenText, Lightning, Star, FloppyDisk, ArrowUpRight } from "@phosphor-icons/react";
import animasiWebp from "../../assets/animasi.webp";

/* ─── Animated Counter Hook (Simplified for mobile) ─── */
function useAnimatedCounter(target, duration = 1000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (target === 0) return;
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
  }, [target, duration]);

  return { count, targetRef: ref };
}

/* ─── Section Header ─────────────────────────────────── */
function SectionHeader({ title, subtitle, link, linkText = "Lihat Semua", icon, accentColor = "bg-retro-yellow" }) {
  return (
    <div className="flex justify-between items-end mb-4">
      <div className="flex items-center gap-2">
        {icon && (
          <div className={`w-8 h-8 ${accentColor} retro-border rounded-lg flex items-center justify-center shadow-lvl-1`}>
            {icon}
          </div>
        )}
        <div className="flex flex-col items-start gap-0.5">
          <h2 className="font-heading text-lg font-bold tracking-tight bg-retro-white px-2 py-0.5 border-[2px] border-retro-dark rounded-lg shadow-sm leading-none">{title}</h2>
          <p className="text-[10px] text-[#2D2A26]/80 font-medium bg-retro-white px-2 py-0.5 border-[1.5px] border-retro-dark rounded-md">{subtitle}</p>
        </div>
      </div>
      {link && (
        <Link to={link} className="font-heading font-bold text-[10px] retro-border bg-retro-white px-2.5 py-1 rounded-full shadow-sm hover:bg-retro-yellow transition-colors inline-flex items-center gap-1 flex-shrink-0">
          {linkText} <ArrowRight weight="bold" size={10} />
        </Link>
      )}
    </div>
  );
}

/* ─── Accent color sets ──────────────────────────────── */
const appAccents = [
  { bg: 'bg-retro-yellow', gradient: 'gradient-yellow-lime', illBg: 'bg-retro-mint', emoji: '🚀' },
  { bg: 'bg-retro-pink', gradient: 'gradient-hotpink-yellow', illBg: 'bg-retro-lavender', emoji: '⚡' },
];

const materialAccents = [
  { bg: 'bg-retro-mint', gradient: 'gradient-sky-mint', illBg: 'bg-retro-yellow', emoji: '📖' },
  { bg: 'bg-retro-pink', gradient: 'gradient-hotpink-yellow', illBg: 'bg-retro-sky', emoji: '📝' },
];

/* ─── Fallback static data ──── */
export default function HomeMobile() {
  const [loadingApps, setLoadingApps] = useState(true);
  const [newestApps, setNewestApps] = useState([]);
  const [popularApps, setPopularApps] = useState([]);
  
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [newestMaterials, setNewestMaterials] = useState([]);
  const [popularMaterials, setPopularMaterials] = useState([]);

  const [targetVisitors, setTargetVisitors] = useState(0); // 0 ensures it waits for fetch

  useEffect(() => {
    const initVisitors = async () => {
      try {
        const { doc, getDoc, setDoc, updateDoc, increment } = await import('firebase/firestore');
        const statsRef = doc(db, 'stats', 'visitors');
        const docSnap = await getDoc(statsRef);
        const today = new Date().toDateString();
        const lastVisit = localStorage.getItem('lastVisitDate');

        if (docSnap.exists()) {
          const currentCount = docSnap.data().count ?? 12400;
          if (lastVisit !== today) {
            setTargetVisitors(currentCount + 1);
            await updateDoc(statsRef, { count: increment(1) });
            localStorage.setItem('lastVisitDate', today);
          } else {
            setTargetVisitors(currentCount);
          }
        } else {
          await setDoc(statsRef, { count: 1 });
          setTargetVisitors(1);
          localStorage.setItem('lastVisitDate', today);
        }
      } catch (err) {
        console.error("Stats error:", err);
        setTargetVisitors(12400); // fallback
      }
    };
    initVisitors();
  }, []);

  const handleItemClick = async (item, collectionName) => {
    try {
      const { doc, updateDoc, increment } = await import('firebase/firestore');
      const itemRef = doc(db, collectionName, item.id);
      await updateDoc(itemRef, { views: increment(1) });
    } catch (err) {
      console.error("Failed to increment views:", err);
    }
  };

  const { count: visitorsCount } = useAnimatedCounter(targetVisitors);
  const { count: projectsCount } = useAnimatedCounter(10);
  const { count: studentsCount } = useAnimatedCounter(30);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapApps = await getDocs(query(collection(db, 'apps')));
        if (!snapApps.empty) {
          const data = [];
          snapApps.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
          
          const newest = [...data].sort((a,b) => b.order - a.order).slice(0, 2);
          const popular = [...data].sort((a,b) => (b.views || 0) - (a.views || 0)).slice(0, 2);
          
          setNewestApps(newest);
          setPopularApps(popular);
        }
      } catch (e) { console.error("Failed to fetch apps"); }
      finally { setLoadingApps(false); }

      try {
        const snapMaterials = await getDocs(query(collection(db, 'materials')));
        if (!snapMaterials.empty) {
          const data = [];
          snapMaterials.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
          
          const newest = [...data].sort((a,b) => b.order - a.order).slice(0, 2);
          const popular = [...data].sort((a,b) => (b.views || 0) - (a.views || 0)).slice(0, 2);
          
          setNewestMaterials(newest);
          setPopularMaterials(popular);
        }
      } catch (e) { console.error("Failed to fetch materials"); }
      finally { setLoadingMaterials(false); }
    };
    fetchData();
  }, []);

  return (
    <main className="flex-1 w-full overflow-x-hidden">
      <SEO title="Beranda" />
      <div className="w-full px-4 py-6 flex flex-col gap-8">

        {/* ═══ HERO BENTO (MOBILE OPTIMIZED) ═══ */}
        <div className="flex flex-col gap-4">
          <div className="retro-card-feature p-6 bg-retro-white border-[2.5px] border-retro-dark rounded-2xl shadow-lvl-1 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(184,204,226,0.2) 0%, rgba(255,255,255,1) 100%)' }}>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-retro-dark/60 mb-3">
              <Sparkle weight="fill" className="text-retro-yellow" size={12} />
              Selamat Datang
            </span>
            <h1 className="font-heading text-3xl font-bold mb-3 leading-[1.1] tracking-tight">
              Edukasi Anak<br />
              <span className="inline-block bg-retro-dark text-retro-yellow px-2 py-0.5 retro-border shadow-sm rotate-[-1deg] mt-1.5 text-2xl">Sekolah Dasar</span>
            </h1>
            <p className="text-sm text-retro-dark/70 leading-relaxed mb-5">
              Belajar interaktif yang ramah anak, kreatif, & menyenangkan.
            </p>
            <div className="flex gap-2">
              <Link to="/aplikasi" className="btn-retro gradient-yellow-lime text-xs px-4 py-2 rounded-full inline-flex items-center gap-1 shadow-sm flex-1 justify-center">
                Jelajahi <ArrowRight weight="bold" />
              </Link>
              <Link to="/tentang-saya" className="btn-secondary text-xs px-4 py-2 rounded-full flex-1 text-center">
                Profil
              </Link>
            </div>
          </div>

          <div className="retro-card gradient-sky-mint p-0 h-[130px] rounded-2xl relative overflow-hidden shadow-lvl-1 border-[2.5px] border-retro-dark flex flex-row">
            {/* Pattern and Noise */}
            <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(#2D2A26 2px, transparent 2px)', backgroundSize: '14px 14px' }}></div>
            <div className="absolute inset-0 bg-noise opacity-40 mix-blend-overlay"></div>
            
            <div className="flex-1 relative z-10 overflow-hidden flex items-end justify-center">
               <div className="relative flex justify-center items-end w-full h-full">
                 {/* Bubble Text */}
                 <div className="absolute top-[15%] left-[0%] bg-retro-white border-[2px] border-retro-dark px-2 py-0.5 rounded-xl rounded-br-none shadow-sm z-20 animate-[bounce_3s_infinite] rotate-[-5deg]">
                   <span className="font-heading font-bold text-retro-dark text-[10px]">Halo! 👋</span>
                 </div>
                 
                 <img src={animasiWebp} alt="Animasi Pengunjung" className="w-[220%] max-w-none object-contain drop-shadow-sm origin-bottom translate-y-[45%]" />
               </div>
            </div>
            
            <div className="w-[140px] bg-retro-white border-l-[2.5px] border-retro-dark p-4 flex flex-col justify-center relative z-20 shadow-[-4px_0_10px_rgba(0,0,0,0.05)] text-center">
              <span className="text-[9px] font-bold text-retro-dark/60 block mb-1 uppercase tracking-wider">Total Pengunjung</span>
              <span className="font-heading text-3xl font-bold text-retro-dark">
                {visitorsCount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* ═══ STATS ROW (MOBILE OPTIMIZED) ═══ */}
        <div className="grid grid-cols-2 gap-3">
          <div className="retro-card p-4 text-center gradient-yellow-lime shadow-lvl-1 rounded-2xl border-[2px] border-retro-dark relative overflow-hidden">
             <div className="w-8 h-8 bg-retro-yellow border-[1.5px] border-retro-dark rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm">
                <Rocket weight="fill" size={16} />
             </div>
              <span className="font-heading text-xl font-bold block">{projectsCount}+</span>
              <span className="text-[9px] font-bold text-retro-dark/50 mt-0.5 block">Media SD</span>
          </div>
          <div className="retro-card p-4 text-center gradient-blue-mint shadow-lvl-1 rounded-2xl border-[2px] border-retro-dark relative overflow-hidden">
             <div className="w-8 h-8 bg-retro-blue border-[1.5px] border-retro-dark rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm">
                <BookOpenText weight="fill" size={16} />
             </div>
              <span className="font-heading text-xl font-bold block">{studentsCount}+</span>
              <span className="text-[9px] font-bold text-retro-dark/50 mt-0.5 block">Siswa</span>
          </div>
        </div>

        {/* ═══ APLIKASI ═══ */}
        {(loadingApps || newestApps.length > 0) && (
        <div className="flex flex-col gap-6">
          {[
            { title: "Aplikasi Terbaru", subtitle: "Media ajar interaktif SD", data: newestApps, isPopular: false, link: "/aplikasi" },
            { title: "Aplikasi Terpopuler", subtitle: "Paling sering dikunjungi", data: popularApps, isPopular: true, link: undefined }
          ].map((section, idx) => (
            <div key={idx}>
              <SectionHeader title={section.title} subtitle={section.subtitle} link={section.link} icon={<Rocket weight="fill" size={14} />} accentColor={section.isPopular ? "bg-retro-pink" : "bg-retro-yellow"} />
              <div className="flex flex-col gap-4">
                {loadingApps ? (
                  <>
                    <div className="retro-card h-[100px] bg-retro-grey animate-pulse rounded-2xl"></div>
                    <div className="retro-card h-[100px] bg-retro-grey animate-pulse rounded-2xl"></div>
                  </>
                ) : section.data.map((app, i) => {
                  const accent = appAccents[i % appAccents.length];
                  const CardContent = (
                    <>
                      <div className={`w-[100px] h-full ${accent.illBg} border-r-[2px] border-retro-dark relative flex-shrink-0 p-1`}>
                        {app.img ? (
                           <img src={app.img} alt={app.name} className="w-full h-full object-cover rounded-lg border-[1.5px] border-retro-dark" />
                        ) : (
                           <AutoIllustration name={app.name} category={app.category} />
                        )}
                      </div>
                      <div className="p-3 flex-1 flex flex-col justify-center min-w-0">
                        <h3 className="font-heading text-sm font-bold text-retro-dark leading-tight line-clamp-1">{app.name}</h3>
                        <p className="text-[10px] text-retro-dark/60 mt-1 line-clamp-2 leading-tight">{app.desc}</p>
                        <div className="mt-auto pt-1">
                          <span className={`inline-block ${accent.bg} border-[1px] border-retro-dark rounded-full px-2 py-0.5 text-[8px] font-bold`}>
                            {app.category || 'Aplikasi'}
                          </span>
                        </div>
                      </div>
                    </>
                  );

                  return app.link ? (
                    <a href={app.link} target="_blank" rel="noopener noreferrer" key={app.id} onClick={() => handleItemClick(app, 'apps')} className="retro-card p-0 bg-retro-white rounded-2xl border-[2px] border-retro-dark shadow-lvl-1 overflow-hidden flex h-[100px] active:scale-[0.98] transition-transform">
                      {CardContent}
                    </a>
                  ) : (
                    <Link to="/aplikasi" key={app.id} onClick={() => handleItemClick(app, 'apps')} className="retro-card p-0 bg-retro-white rounded-2xl border-[2px] border-retro-dark shadow-lvl-1 overflow-hidden flex h-[100px] active:scale-[0.98] transition-transform">
                      {CardContent}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        )}

        {/* ═══ MATERI EDUKASI ═══ */}
        {(loadingMaterials || newestMaterials.length > 0) && (
        <div className="flex flex-col gap-6">
          {[
            { title: "Materi Terbaru", subtitle: "Bahan ajar Kurikulum Merdeka", data: newestMaterials, isPopular: false, link: "/materi" },
            { title: "Materi Terpopuler", subtitle: "Paling banyak dibaca", data: popularMaterials, isPopular: true, link: undefined }
          ].map((section, idx) => (
            <div key={idx}>
              <SectionHeader title={section.title} subtitle={section.subtitle} link={section.link} icon={<BookOpenText weight="fill" size={14} />} accentColor={section.isPopular ? "bg-retro-lavender" : "bg-retro-mint"} />
              <div className="grid grid-cols-1 gap-4">
                {loadingMaterials ? (
                  <>
                    <div className="retro-card h-[80px] bg-retro-grey animate-pulse rounded-2xl"></div>
                    <div className="retro-card h-[80px] bg-retro-grey animate-pulse rounded-2xl"></div>
                  </>
                ) : section.data.map((item, i) => {
                  const accent = materialAccents[i % materialAccents.length];
                  const CardContent = (
                    <>
                       <div className={`${accent.gradient} h-2 w-full border-b-[2px] border-retro-dark`}></div>
                       <div className="p-3 flex gap-3 items-center">
                         <div className={`w-14 h-14 rounded-lg border-[2px] border-retro-dark ${accent.illBg} overflow-hidden flex-shrink-0 p-0.5`}>
                            {item.img ? <img src={item.img} className="w-full h-full object-cover rounded-md" /> : <AutoIllustration name={item.title} category="edukasi" />}
                         </div>
                         <div className="flex-1">
                            <h3 className="font-heading font-bold text-sm leading-tight text-retro-dark line-clamp-2">{item.title}</h3>
                            <span className="text-[10px] font-bold text-retro-dark/50 block mt-1">{item.author || 'M. Rizki'}</span>
                         </div>
                       </div>
                    </>
                  );

                  return item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" key={item.id} onClick={() => handleItemClick(item, 'materials')} className="retro-card p-0 bg-retro-white rounded-2xl border-[2px] border-retro-dark shadow-lvl-1 overflow-hidden relative active:scale-[0.98] transition-transform">
                      {CardContent}
                    </a>
                  ) : (
                    <Link to="/materi" key={item.id} onClick={() => handleItemClick(item, 'materials')} className="retro-card p-0 bg-retro-white rounded-2xl border-[2px] border-retro-dark shadow-lvl-1 overflow-hidden relative active:scale-[0.98] transition-transform">
                      {CardContent}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        )}

      </div>
    </main>
  );
}
