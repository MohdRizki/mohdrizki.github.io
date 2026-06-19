import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import { Star } from '@phosphor-icons/react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const { loginWithPin, isAdminAuth } = useAuth();
  const navigate = useNavigate();

  // Redirect jika sudah login
  useEffect(() => {
    if (isAdminAuth) {
      navigate('/dashboard');
    }
  }, [isAdminAuth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginWithPin(username, pin);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Username atau PIN salah.');
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setLoading(false);
    }
  };

  return (
    <div className="font-body min-h-screen flex items-center justify-center relative overflow-hidden bg-retro-bg">
      <SEO title="Login Dashboard" />
      
      {/* Decorative */}
      <svg className="absolute z-0 pointer-events-none opacity-35 w-44 h-44 -top-8 -left-8 text-retro-yellow" viewBox="0 0 100 100" fill="currentColor"><path d="M10,50 Q20,10 50,20 T90,50 T50,80 T10,50 Z"/></svg>
      <svg className="absolute z-0 pointer-events-none opacity-35 w-32 h-32 bottom-4 right-4 text-retro-pink" viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="50" r="40"/></svg>
      <svg className="absolute z-0 pointer-events-none opacity-35 w-20 h-20 top-20 right-24 text-retro-mint" viewBox="0 0 100 100" fill="currentColor"><rect x="20" y="20" width="60" height="60" rx="8" transform="rotate(15 50 50)"/></svg>

      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-xs px-4"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="bg-retro-yellow retro-border w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold retro-shadow">R</span>
          </div>
          <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
          <p className="text-xs text-retro-dark/60 mt-1">Masukkan username & PIN untuk masuk</p>
        </div>

        <div className="bg-retro-white retro-border rounded-2xl retro-shadow p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-heading text-xs font-bold mb-1 block">Username</label>
              <input 
                type="text" 
                placeholder="admin" 
                autoComplete="off" 
                className="w-full px-3 py-2.5 text-sm rounded-xl retro-border bg-retro-bg font-bold placeholder-gray-400 transition-shadow focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,213,107,0.5)]" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="font-heading text-xs font-bold mb-1.5 block">PIN</label>
              <div className="flex justify-center gap-3 mb-3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div 
                    key={index} 
                    className={`w-3 h-3 rounded-full border-[2.5px] border-retro-dark transition-colors duration-150 ${pin.length > index ? 'bg-retro-yellow' : 'bg-retro-bg'}`}
                  ></div>
                ))}
              </div>
              <input 
                type="password" 
                inputMode="numeric" 
                maxLength="6" 
                placeholder="••••••" 
                autoComplete="off" 
                className="w-full px-3 py-2.5 text-sm rounded-xl retro-border bg-retro-bg font-bold placeholder-gray-400 transition-shadow text-center tracking-[0.5em] focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,213,107,0.5)]" 
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </div>

            {error && (
              <motion.div 
                initial={{ x: 0 }}
                animate={shake ? { x: [-6, 6, -6, 6, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="bg-retro-pink/30 retro-border rounded-xl p-2 text-[11px] font-bold text-center"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="bg-retro-yellow retro-border retro-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#2D2A26] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed font-heading font-bold text-sm px-6 py-2.5 rounded-xl w-full flex items-center justify-center gap-2 transition-all"
            >
              <Star weight="bold" size={18} className={loading ? "animate-spin" : ""} />
              {loading ? "Memeriksa..." : "Masuk"}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-retro-dark/40 mt-4">
          <Link to="/" className="hover:text-retro-dark transition-colors">← Kembali ke Portofolio</Link>
        </p>
      </motion.div>
    </div>
  );
}
