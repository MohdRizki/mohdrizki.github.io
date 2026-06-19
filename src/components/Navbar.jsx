import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { House, User, GridFour, Books, Image as ImageIcon, EnvelopeSimple, List, X } from '@phosphor-icons/react';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { path: '/beranda', label: 'Beranda', icon: <House weight="fill" size={20} /> },
    { path: '/tentang-saya', label: 'Tentang', icon: <User weight="fill" size={20} /> },
    { path: '/aplikasi', label: 'Aplikasi', icon: <GridFour weight="fill" size={20} /> },
    { path: '/materi', label: 'Materi', icon: <Books weight="fill" size={20} /> },
    { path: '/galeri', label: 'Galeri', icon: <ImageIcon weight="fill" size={20} /> },
  ];

  return (
    <>
      {/* ═══ Desktop Floating Navbar ═══ */}
      {currentPath !== '/' && (
      <nav className="sticky top-3 z-50 px-4 md:px-8 hidden md:block">
        <div className="max-w-5xl mx-auto">
          <div className="glass retro-border rounded-2xl shadow-lvl-2 px-5 h-14 flex items-center justify-between">
            
            {/* Brand */}
            <Link to="/" className="font-heading text-lg font-bold tracking-tight flex items-center gap-2.5 group">
              <motion.div 
                whileHover={{ rotate: 12, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="bg-retro-dark w-9 h-9 rounded-xl flex items-center justify-center shadow-lvl-1 p-1.5 overflow-hidden"
              >
                <img src="/logo.png" className="w-full h-full object-contain" alt="Logo" />
              </motion.div>
              <span className="group-hover:text-retro-yellow transition-colors duration-200">ReezApps.</span>
            </Link>
            
            {/* Nav Links */}
            <div className="flex items-center gap-1 relative">
              {links.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-1.5 text-xs font-bold transition-colors duration-200 ${isActive ? 'text-retro-dark' : 'text-retro-dark/60 hover:text-retro-dark'}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active-pill"
                        className="absolute inset-0 gradient-yellow-lime border-[2.5px] border-retro-dark rounded-full shadow-lvl-1"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        style={{ zIndex: -1, left: -1, top: -1, right: -1, bottom: -1 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>
            
            {/* Right Side */}
            <div className="flex items-center gap-3">
              <a 
                href="mailto:rizkimohamad38@gmail.com" 
                className="btn-retro bg-retro-yellow text-retro-dark px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 !shadow-[2px_2px_0px_#2D2A26]"
              >
                <EnvelopeSimple weight="bold" size={14} />
                Kontak
              </a>
            </div>
          </div>
        </div>
      </nav>
      )}

      {/* ═══ Mobile Bottom Navigation ═══ */}
      {currentPath !== '/' && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-1">
          <div className="glass retro-border rounded-2xl shadow-lvl-2 px-2">
            <div className="flex justify-between items-center h-16 relative">
            {links.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex flex-col items-center justify-center w-full h-full relative z-10 transition-colors duration-200 ${isActive ? 'text-retro-dark' : 'text-retro-dark/40 hover:text-retro-dark/60'}`}
                >
                  <div 
                    className={`transition-all duration-300 flex items-center justify-center w-[38px] h-[38px] rounded-xl ${isActive ? 'gradient-yellow-lime border-[1.5px] border-retro-dark shadow-lvl-1 -translate-y-1' : ''}`}
                  >
                    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                      {link.icon}
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0 mt-0.5' : 'opacity-0 translate-y-2 absolute bottom-2'}`}>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      )}
    </>
  );
}
