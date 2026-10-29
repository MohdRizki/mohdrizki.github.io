import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, CalendarBlank, User, Tag,
  Link as LinkIcon, Newspaper, ArrowRight,
} from '@phosphor-icons/react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
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
        // Query slug without compound index requirement
        const q = query(collection(db, 'artikel'), where('slug', '==', slug));
        const snap = await getDocs(q);
        const match = snap.docs.map(d => normalizeArticle({ id: d.id, ...d.data() })).find(a => a.status === 'published');

        if (match) {
          setArtikel(match);

          // Related articles from Firestore
          try {
            const allSnap = await getDocs(collection(db, 'artikel'));
            const all = allSnap.docs
              .map(d => normalizeArticle({ id: d.id, ...d.data() }))
              .filter(a => a.status === 'published');
            setRelated(all.filter(a => a.slug !== slug && a.tags.some(t => match.tags.includes(t))).slice(0, 2));
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
        console.warn('Detail load fallback to static:', e);
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
      setLoading(false);
    }
    load();
  }, [slug]);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    const btn = document.getElementById('copy-link-btn');
    if (btn && !copiedRef.current) {
      copiedRef.current = true;
      const orig = btn.innerText;
      btn.innerText = '✅ Disalin!';
      setTimeout(() => {
        btn.innerText = orig;
        copiedRef.current = false;
      }, 2000);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-retro-dark/50 animate-pulse">
          <Newspaper size={48} className="mx-auto mb-2 opacity-30" />
          <p className="font-heading font-bold">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (!artikel) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <Newspaper size={56} className="mx-auto mb-3 text-retro-dark/30" />
          <h2 className="font-heading text-2xl font-extrabold text-retro-dark mb-2">Artikel Tidak Ditemukan</h2>
          <p className="text-sm text-retro-dark/60 mb-6">Artikel yang kamu cari mungkin sudah dihapus atau URL-nya salah.</p>
          <Link to="/artikel" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-retro-yellow text-retro-dark font-bold text-sm retro-border shadow-lvl-1 hover:translate-y-[-1px] transition-all">
            <ArrowLeft size={16} /> Lihat Semua Artikel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10 max-w-3xl mx-auto">
      {/* Back */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6">
        <button onClick={() => navigate('/artikel')}
          className="flex items-center gap-2 text-sm font-semibold text-retro-dark/80 hover:text-retro-dark transition-colors">
          <ArrowLeft size={16} /> Kembali ke Artikel
        </button>
      </motion.div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {artikel.tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border-2 border-[#2D2A26] bg-[#FFD56B] text-[#2D2A26]">
              <Tag size={11} />{tag}
            </span>
          ))}
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-retro-dark leading-tight mb-4">{artikel.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-retro-dark/70 mb-4">
          <span className="flex items-center gap-1.5"><User size={15} />{artikel.author || 'Mohd Rizki'}</span>
          <span className="flex items-center gap-1.5"><CalendarBlank size={15} />{formatDate(artikel.date || artikel.updatedAt || artikel.createdAt)}</span>
          <span className="flex items-center gap-1.5"><Clock size={15} />{artikel.readTime || 1} menit baca</span>
        </div>
        <button id="copy-link-btn" onClick={handleCopyLink}
          className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 retro-border rounded-lg text-[#2D2A26] hover:bg-[#FFD56B]/50 transition-colors bg-[#FFF8EC]">
          <LinkIcon size={13} /> Salin Link
        </button>
      </motion.div>

      <div className="border-t-2 border-retro-dark/15 mb-8" />

      {/* Content Box with solid contrast */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        className="rounded-2xl retro-border p-6 sm:p-8 mb-2 bg-[#FFF8EC] text-[#2D2A26] shadow-lvl-2">
        <article
          className="prose prose-sm sm:prose-base max-w-none text-[#2D2A26]
            prose-headings:font-heading prose-headings:font-extrabold prose-headings:text-[#2D2A26]
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:border-[#2D2A26]/10 prose-h2:pb-2
            prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
            prose-p:text-[#2D2A26]/90 prose-p:leading-relaxed
            prose-a:text-amber-800 prose-a:font-semibold hover:prose-a:underline
            prose-strong:text-[#2D2A26] prose-strong:font-bold
            prose-ul:text-[#2D2A26]/90 prose-ol:text-[#2D2A26]/90
            prose-li:marker:text-amber-700
            prose-code:text-amber-900 prose-code:bg-amber-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:font-semibold
            prose-pre:bg-[#2D2A26] prose-pre:text-[#FFD56B] prose-pre:rounded-xl prose-pre:text-xs prose-pre:border-2 prose-pre:border-[#2D2A26]
            prose-img:rounded-xl prose-img:max-w-full prose-img:mx-auto
            prose-blockquote:border-l-4 prose-blockquote:border-[#FFD56B] prose-blockquote:bg-[#FFD56B]/15 prose-blockquote:py-1 prose-blockquote:not-italic"
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
                <div className="retro-border rounded-xl p-4 flex flex-col gap-2 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lvl-1 bg-[#FFF8EC] text-[#2D2A26]">
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    {rel.tags.slice(0,2).map(t => (
                      <span key={t} className="text-xs px-1.5 py-0.5 rounded-full bg-[#FFD56B] border border-[#2D2A26] text-[#2D2A26] font-bold">{t}</span>
                    ))}
                  </div>
                  <h4 className="font-heading text-sm font-bold text-[#2D2A26] group-hover:text-amber-800 transition-colors leading-snug">{rel.title}</h4>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-800 mt-1">Baca <ArrowRight size={12} /></div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </main>
  );
}
