import React, { createContext, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Footer from './components/Footer';
import useIsMobile from './hooks/useIsMobile';

export const ZipperContext = createContext();

function ZipperOverlay({ onComplete }) {
  return (
    <div className="fixed inset-0 z-[99999] flex pointer-events-none">
      <motion.div
        initial={{ x: 0 }} animate={{ x: "-100%" }} transition={{ duration: 0.9, delay: 0.55, ease: [0.7, 0, 0.2, 1] }}
        onAnimationComplete={onComplete}
        className="w-1/2 h-full bg-retro-dark relative flex items-center justify-end overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #FFF8EC 1px, transparent 1px)', backgroundSize: '14px 14px' }}></div>
        <div className="absolute right-0 top-0 bottom-0 w-[3px] z-10" style={{ background: 'repeating-linear-gradient(to bottom, #FFD56B 0px, #FFD56B 6px, transparent 6px, transparent 12px)' }}></div>
      </motion.div>
      <motion.div
        initial={{ x: 0 }} animate={{ x: "100%" }} transition={{ duration: 0.9, delay: 0.55, ease: [0.7, 0, 0.2, 1] }}
        className="w-1/2 h-full bg-retro-dark relative flex items-center justify-start overflow-hidden"
      >
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #FFF8EC 1px, transparent 1px)', backgroundSize: '14px 14px' }}></div>
        <div className="absolute left-0 top-0 bottom-0 w-[3px] z-10" style={{ background: 'repeating-linear-gradient(to bottom, #FFD56B 0px, #FFD56B 6px, transparent 6px, transparent 12px)' }}></div>
      </motion.div>
      <motion.div
        initial={{ top: "120vh" }} animate={{ top: "-70px" }} transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="absolute left-1/2 -translate-x-1/2 z-[100]"
      >
        <div className="w-[28px] h-[44px] bg-retro-yellow retro-border rounded-t-sm rounded-b-xl shadow-lvl-1 relative">
          <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[8px] h-[8px] rounded-full bg-retro-dark"></div>
          <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-[3px] h-[12px] rounded-full bg-retro-dark"></div>
        </div>
      </motion.div>
    </div>
  );
}

// Pages & Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Home from './pages/Home';
import About from './pages/About';
import Apps from './pages/Apps';
import Materials from './pages/Materials';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// ═══ Snappy Page Transition ═══
const containerVariants = {
  hidden: { 
    opacity: 0, 
    y: 15
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      ease: "easeOut",
      staggerChildren: 0.05 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { 
      duration: 0.2,
      ease: "easeIn"
    } 
  }
};

// ═══ Dynamic Stagger Variants ═══
const dynamicVariants = {
  hidden: (customVal = 1) => {
    const dir = (customVal * 7) % 4;
    const offset = 50;
    return {
      opacity: 0,
      x: dir === 1 ? offset : dir === 3 ? -offset : 0,
      y: dir === 2 ? offset : dir === 0 ? -offset : 0,
      scale: 0.95,
      rotate: 0
    };
  },
  visible: (customVal = 1) => ({
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 22,
      delay: (customVal % 15) * 0.06
    }
  }),
  exit: () => ({
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 }
  })
};

export const StaggerContext = createContext(dynamicVariants);

// ═══ ANIMATED SCENERY ═══
function AnimatedScenery() {
  const [isNight, setIsNight] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      const night = hour >= 18 || hour < 6;
      setIsNight(night);
      if (night) {
        document.body.classList.add('night-mode');
      } else {
        document.body.classList.remove('night-mode');
      }
    };
    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const bgColor = isNight ? 'bg-[#1E293B]' : 'bg-[#A2D5F2]';
  const celestialColor = isNight ? 'bg-[#FDFDFD]' : 'bg-[#FFD56B]';
  const shadowColor = isNight ? 'shadow-[0_0_50px_rgba(253,253,253,0.6)]' : 'shadow-[0_0_50px_rgba(255,213,107,0.8)]';

  return (
    <div className={`fixed inset-0 pointer-events-none z-[-1] overflow-hidden transition-colors duration-1000 ${bgColor}`}>
      
      {/* Background Image (City) */}
      <div 
        className="absolute inset-0 bg-no-repeat bg-cover bg-bottom transition-all duration-1000"
        style={{ 
          backgroundImage: 'url(/city-bg-v2.png)', 
          filter: isNight ? 'brightness(0.65)' : 'brightness(1)',
          opacity: 1 
        }}
      ></div>

      {/* Stars (Only at night) */}
      <AnimatePresence>
        {isNight && !isMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0"
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 3 + 1 + 'px',
                  height: Math.random() * 3 + 1 + 'px',
                  top: Math.random() * 60 + '%',
                  left: Math.random() * 100 + '%',
                }}
                animate={{ opacity: [0.1, 1, 0.1] }}
                transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Sun/Moon */}
      <motion.div 
        className={`absolute top-[8%] left-[15%] w-20 h-20 md:w-24 md:h-24 rounded-full transition-colors duration-1000 ${celestialColor} ${shadowColor}`}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className={`absolute inset-0 rounded-full transition-colors duration-1000 ${celestialColor} opacity-50 blur-md`}></div>
      </motion.div>

      {/* Dynamic Clouds (Desktop Only) */}
      {!isMobile && (
        <>
          <motion.div 
            className={`absolute top-[12%] w-32 h-10 bg-white rounded-full shadow-sm transition-opacity duration-1000 ${isNight ? 'opacity-40' : 'opacity-90'}`}
            initial={{ x: '-20vw' }}
            animate={{ x: '120vw' }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
             <div className="absolute top-[-50%] left-[20%] w-16 h-16 bg-white rounded-full"></div>
             <div className="absolute top-[-30%] left-[50%] w-12 h-12 bg-white rounded-full"></div>
          </motion.div>

          <motion.div 
            className={`absolute top-[20%] w-40 h-12 bg-white rounded-full shadow-sm transition-opacity duration-1000 ${isNight ? 'opacity-30' : 'opacity-80'}`}
            initial={{ x: '-30vw' }}
            animate={{ x: '120vw' }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear", delay: 15 }}
          >
             <div className="absolute top-[-50%] left-[20%] w-20 h-20 bg-white rounded-full"></div>
             <div className="absolute top-[-30%] left-[50%] w-16 h-16 bg-white rounded-full"></div>
          </motion.div>

          <motion.div 
            className={`absolute top-[8%] w-24 h-8 bg-white rounded-full shadow-sm transition-opacity duration-1000 ${isNight ? 'opacity-20' : 'opacity-70'}`}
            initial={{ x: '-10vw' }}
            animate={{ x: '120vw' }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear", delay: 5 }}
          >
             <div className="absolute top-[-50%] left-[20%] w-12 h-12 bg-white rounded-full"></div>
             <div className="absolute top-[-30%] left-[50%] w-10 h-10 bg-white rounded-full"></div>
          </motion.div>
        </>
      )}
    </div>
  );
}

// ═══ ANIMATED ROUTES ═══
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/beranda" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/tentang-saya" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/aplikasi" element={<PageWrapper><Apps /></PageWrapper>} />
        <Route path="/materi" element={<PageWrapper><Materials /></PageWrapper>} />
        <Route path="/galeri" element={<PageWrapper><Gallery /></PageWrapper>} />
        
        {/* Auth & CMS */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex-1 w-full flex flex-col relative z-10"
    >
      <StaggerContext.Provider value={dynamicVariants}>
        {children}
      </StaggerContext.Provider>
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();
  const isDashboardOrLogin = location.pathname.startsWith('/dashboard') || location.pathname === '/login';
  const isLanding = location.pathname === '/';
  const [isZipping, setIsZipping] = useState(false);
  const isMobile = useIsMobile();

  return (
    <ZipperContext.Provider value={{ isZipping, setIsZipping }}>
      {isZipping && <ZipperOverlay onComplete={() => setIsZipping(false)} />}
      {!isDashboardOrLogin && !(isLanding && isMobile) && <AnimatedScenery />}
      {!isDashboardOrLogin && <Navbar />}
      <AnimatedRoutes />
      {!isDashboardOrLogin && !isLanding && <Footer />}
    </ZipperContext.Provider>
  );
}



function App() {
  return <AppContent />;
}

export default App;
