import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, CalendarBlank, User, Tag,
  Link as LinkIcon, Newspaper, ArrowRight,
} from '@phosphor-icons/react';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getArtikelBySlug, artikelData } from '../data/artikelData';

function formatDate(val) {
  if (!val) return '';
  const d = val?.toDate ? val.toDate() : new Date(val);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function normalizeArticle(a) {
  return {
    ...a,
    tags: Array.isArray(a.tags)
      ? a.tags
      : (a.tags || '').split(',').map(t => t.trim()).filter(Boolean),
  };
}

export default function ArtikelDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [artikel, setArtikel] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const copiedRef = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    async function load() {
      setLoading(true);
      try {
        // Try Firestore first
        const q = query(collection(db, 'artikel'), where('slug', '==', slug), where('status', '==', 'published'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const art = normalizeArticle({ id: snap.docs[0].id, ...snap.docs[0].data() });
          setArtikel(art);

          // Related from Firestore
          try {
            const rq = query(collection(db, 'artikel'), where('status', '==', 'published'), orderBy('updatedAt', 'desc'));
            const rsnap = await getDocs(rq);
            const all = rsnap.docs.map(d => normalizeArticle({ id: d.id, ...d.data() }));
            setRelated(all.filter(a => a.slug !== slug && a.tags.some(t => art.tags.includes(t))).slice(0, 2));
          } catch {}
        } else {
          // Fallback to static
          const staticArt = getArtikelBySlug(slug);
          if (staticArt) {
            setArtikel(normalizeArticle(staticArt));
            setRelated(
              artikelData.filter(a => a.slug !== slug && a.tags.some(t => staticArt.tags.includes(t))).slice(0, 2).map(normalizeArticle)
            );
          } else {
            setArtikel(null);
          }
        }
      } catch (e) {
        // Pure static fallback
        const staticArt = getArtikelBySlug(slug);
        if (staticArt) {
          setArtikel(normalizeArticle(staticArt));
          setRelated(
            artikelData.filter(a => a.slug !== slug && a.tags.some(t => staticArt.tags.includes(t))).slice(0, 2).map(normalizeArticle)
          );
        }
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  function handleCopyLink() {
    if (navigator.clipboard) navigator.clipboard.writeText(window.location.href);
    if (!copiedRef.current) {
      copiedRef.current = true;
      const btn = document.getElementById('copy-link-btn');
      if (btn) { btn.textContent = 'Tersalin!'; setTimeout(() => { btn.textContent = 'Salin Link'; copiedRef.current = false; }, 2000); }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-retro-dark/40 font-heading font-bold">Memuat artikel...</div>
      </div>
    );
  }

  if (!artikel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-retro-dark/60 gap-4 px-4">
        <Newspaper size={64} className="opacity-20" />
        <h2 className="font-heading text-2xl font-bold">Artikel tidak ditemukan</h2>
        <Link to="/artikel" className="btn-retro flex items-center gap-2 text-sm">
          <ArrowLeft size={16} /> Kembali ke Artikel
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen px-4 py-10 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-xs font-semibold text-retro-dark/50 mb-6">
        <Link to="/beranda" className="hover:text-retro-dark transition-colors">Beranda</Link>
        <span>/</span>
        <Link to="/artikel" className="hover:text-retro-dark transition-colors">Artikel</Link>
        <span>/</span>
        <span className="text-retro-dark/80 truncate max-w-[180px]">{artikel.title}</span>
      </motion.nav>

      {/* Back */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6">
        <button onClick={() => navigate('/artikel')}
          className="flex items-center gap-2 text-sm font-semibold text-retro-dark/60 hover:text-retro-dark transition-colors">
          <ArrowLeft size={16} /> Kembali ke Artikel
        </button>
      </motion.div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {artikel.tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border-2 border-retro-dark bg-retro-yellow text-retro-dark">
              <Tag size={11} />{tag}
            </span>
          ))}
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-retro-dark leading-tight mb-4">{artikel.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-retro-dark/60 mb-4">
          <span className="flex items-center gap-1.5"><User size={15} />{artikel.author || 'Mohd Rizki'}</span>
          <span className="flex items-center gap-1.5"><CalendarBlank size={15} />{formatDate(artikel.date || artikel.updatedAt || artikel.createdAt)}</span>
          <span className="flex items-center gap-1.5"><Clock size={15} />{artikel.readTime || 1} menit baca</span>
        </div>
        <button id="copy-link-btn" onClick={handleCopyLink}
          className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 retro-border rounded-lg text-retro-dark/70 hover:text-retro-dark hover:bg-retro-yellow/30 transition-colors"
          style={{ backgroundColor: 'rgba(255,248,236,0.85)' }}>
          <LinkIcon size={13} /> Salin Link
        </button>
      </motion.div>

      <div className="border-t-2 border-retro-dark/15 mb-8" />

      {/* Content */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        className="rounded-2xl retro-border p-6 sm:p-8 mb-2"
        style={{ backgroundColor: 'rgba(255,248,236,0.95)', backdropFilter: 'blur(16px)' }}>
        <article
          className="prose prose-sm sm:prose-base max-w-none
            prose-headings:font-heading prose-headings:font-extrabold prose-headings:text-retro-dark
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:border-retro-dark/10 prose-h2:pb-2
            prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
            prose-p:text-retro-dark/80 prose-p:leading-relaxed
            prose-a:text-yellow-700 prose-a:font-semibold hover:prose-a:underline
            prose-strong:text-retro-dark prose-strong:font-bold
            prose-ul:text-retro-dark/80 prose-ol:text-retro-dark/80
            prose-li:marker:text-yellow-600
            prose-code:text-yellow-800 prose-code:bg-yellow-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:font-semibold
            prose-pre:bg-retro-dark prose-pre:text-retro-yellow prose-pre:rounded-xl prose-pre:text-xs prose-pre:border-2 prose-pre:border-retro-dark
            prose-img:rounded-xl prose-img:max-w-full prose-img:mx-auto
            prose-blockquote:border-l-4 prose-blockquote:border-retro-yellow prose-blockquote:bg-retro-yellow/10 prose-blockquote:py-1 prose-blockquote:not-italic
            prose-table:border-collapse prose-th:border prose-th:border-retro-dark/30 prose-th:bg-retro-yellow/30 prose-th:px-3 prose-th:py-1.5 prose-th:text-xs prose-th:font-bold
            prose-td:border prose-td:border-retro-dark/20 prose-td:px-3 prose-td:py-1.5 prose-td:text-xs
            [&_.download-link]:inline-flex [&_.download-link]:items-center [&_.download-link]:gap-1.5 [&_.download-link]:bg-retro-yellow [&_.download-link]:border-2 [&_.download-link]:border-retro-dark [&_.download-link]:rounded-xl [&_.download-link]:px-3 [&_.download-link]:py-1.5 [&_.download-link]:text-xs [&_.download-link]:font-bold [&_.download-link]:no-underline [&_.download-link]:text-retro-dark [&_.download-link]:shadow-[2px_2px_0_#2D2A26]"
          dangerouslySetInnerHTML={{ __html: artikel.content }}
        />
      </motion.div>

      <div className="border-t-2 border-retro-dark/15 mt-10 mb-8" />

      {/* Related */}
      {related.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="font-heading text-lg font-extrabold text-retro-dark mb-4 flex items-center gap-2">
            <Newspaper size={20} weight="fill" /> Artikel Terkait
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map(rel => (
              <Link key={rel.id || rel.slug} to={`/artikel/${rel.slug}`} className="block group">
                <div className="retro-border rounded-xl p-4 flex flex-col gap-2 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lvl-1"
                  style={{ backgroundColor: 'rgba(255,248,236,0.92)' }}>
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    {rel.tags.slice(0,2).map(t => (
                      <span key={t} className="text-xs px-1.5 py-0.5 rounded-full bg-retro-yellow border border-retro-dark text-retro-dark font-bold">{t}</span>
                    ))}
                  </div>
                  <h4 className="font-heading text-sm font-bold text-retro-dark group-hover:text-yellow-700 transition-colors leading-snug">{rel.title}</h4>
                  <div className="flex items-center gap-1 text-xs font-bold text-yellow-700 mt-1">Baca <ArrowRight size={12} /></div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}
