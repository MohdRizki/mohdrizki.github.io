import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EnvelopeSimple, TiktokLogo, YoutubeLogo, InstagramLogo, LinkedinLogo, ArrowUp, Sparkle, Heart } from '@phosphor-icons/react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Footer() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getDoc(doc(db, 'site', 'profile')).then(docSnap => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-retro-dark text-retro-white relative z-10 mt-auto overflow-hidden pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' fill='white'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat', backgroundSize: '256px 256px'
      }}></div>

      {/* Gradient accent line at top */}
      <div className="h-1.5 gradient-yellow-lime"></div>

      {/* ═══ CTA Section ═══ */}
      <div className="border-b border-retro-white/10 relative">
        {/* Decorative gradient blobs */}
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #FFD56B, transparent 70%)' }}></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #C9B6FF, transparent 70%)' }}></div>

        <div className="max-w-5xl mx-auto px-4 md:px-8 py-14 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.span 
              animate={{ rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-block gradient-yellow-lime text-retro-dark px-4 py-1.5 rounded-full text-[11px] font-bold mb-5 retro-border shadow-lvl-1 font-heading"
            >
              💬 Mari Berkolaborasi
            </motion.span>
            <h2 className="font-heading text-2xl md:text-4xl font-bold mb-4 leading-tight">
              Ada Pertanyaan tentang Pembelajaran?<br />
              <span style={{ background: 'linear-gradient(135deg, #FFD56B, #F1FF5E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Mari Diskusikan Bersama.</span>
            </h2>
            <p className="text-sm text-retro-white/50 max-w-md mx-auto mb-8 leading-relaxed">
              Saya terbuka untuk berdiskusi seputar metode mengajar, media belajar, atau kolaborasi untuk meningkatkan kualitas pendidikan dasar.
            </p>
            <a 
              href="mailto:rizkimohamad38@gmail.com" 
              className="inline-flex items-center gap-2.5 gradient-yellow-lime text-retro-dark font-heading font-bold text-sm px-8 py-3.5 rounded-full retro-border shadow-lvl-2 hover:shadow-lvl-3 hover:translate-y-[-3px] transition-all duration-300"
            >
              <EnvelopeSimple weight="bold" size={18} />
              Kirim Email
            </a>
          </motion.div>
        </div>
      </div>

      {/* ═══ Footer Bottom ═══ */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="font-heading font-bold text-base flex items-center gap-2 hover:text-retro-yellow transition-colors duration-200 group">
              <motion.div 
                whileHover={{ rotate: 12 }}
                className="w-9 h-9 flex items-center justify-center p-0.5"
              >
                <img src="/logo.png" className="w-full h-full object-contain drop-shadow-sm" alt="Logo" />
              </motion.div>
              <span>ReezApps.</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex gap-5 text-xs font-bold text-retro-white/50">
            {[
              { to: '/beranda', label: 'Beranda' },
              { to: '/tentang-saya', label: 'Tentang' },
              { to: '/aplikasi', label: 'Aplikasi' },
              { to: '/materi', label: 'Materi' },
              { to: '/galeri', label: 'Galeri' },
            ].map(link => (
              <Link key={link.to} to={link.to} className="hover:text-retro-yellow transition-colors duration-200 relative group">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-retro-yellow transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Social + Scroll Top */}
          <div className="flex items-center gap-3">
            {(() => {
              const socials = [];
              if (profile?.email) {
                socials.push({ href: `mailto:${profile.email}`, icon: <EnvelopeSimple weight="bold" size={16} />, label: 'Email' });
              } else {
                socials.push({ href: 'mailto:rizkimohamad38@gmail.com', icon: <EnvelopeSimple weight="bold" size={16} />, label: 'Email' });
              }
              if (profile?.showTiktok && profile?.tiktokUrl) {
                socials.push({ href: profile.tiktokUrl, icon: <TiktokLogo weight="bold" size={16} />, label: 'TikTok' });
              }
              if (profile?.showYoutube && profile?.youtubeUrl) {
                socials.push({ href: profile.youtubeUrl, icon: <YoutubeLogo weight="bold" size={16} />, label: 'YouTube' });
              }
              if (profile?.showInstagram && profile?.instagramUrl) {
                socials.push({ href: profile.instagramUrl, icon: <InstagramLogo weight="bold" size={16} />, label: 'Instagram' });
              }
              if (profile?.showLinkedin && profile?.linkedinUrl) {
                socials.push({ href: profile.linkedinUrl, icon: <LinkedinLogo weight="bold" size={16} />, label: 'LinkedIn' });
              }
              return socials.map((social, i) => (
                <motion.a 
                  key={i}
                  href={social.href} 
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer" 
                  whileHover={{ y: -2, scale: 1.1 }}
                  className="w-9 h-9 rounded-full border-[1.5px] border-retro-white/15 flex items-center justify-center text-retro-white/50 hover:text-retro-yellow hover:border-retro-yellow/40 hover:bg-retro-yellow/10 transition-all duration-200" 
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ));
            })()}
            <div className="w-px h-5 bg-retro-white/10 mx-1"></div>
            <motion.button 
              onClick={scrollToTop}
              whileHover={{ y: -3, scale: 1.1 }}
              className="w-9 h-9 rounded-full border-[1.5px] border-retro-white/15 flex items-center justify-center text-retro-white/50 hover:text-retro-yellow hover:border-retro-yellow/40 hover:bg-retro-yellow/10 transition-all duration-200"
              aria-label="Scroll to top"
            >
              <ArrowUp weight="bold" size={14} />
            </motion.button>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-retro-white/10 mt-6 pt-6 text-center">
          <span className="text-[11px] font-medium text-retro-white/30 flex items-center justify-center gap-1.5">
            © 2025 Mohamad Rizki · Dibuat dengan <Heart weight="fill" size={12} className="text-retro-pink" /> untuk pendidikan Indonesia
          </span>
        </div>
      </div>
    </footer>
  );
}
