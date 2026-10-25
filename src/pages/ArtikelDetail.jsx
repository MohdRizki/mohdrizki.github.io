import { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  CalendarBlank,
  User,
  Tag,
  Link as LinkIcon,
  Newspaper,
  ArrowRight,
} from '@phosphor-icons/react';
import { getArtikelBySlug, getRelatedArtikels } from '../data/artikelData';

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}

export default function ArtikelDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const artikel = getArtikelBySlug(slug);
  const copiedRef = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!artikel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white/60 gap-4 px-4">
        <Newspaper size={64} className="opacity-20" />
        <h2 className="font-heading text-2xl font-bold">Artikel tidak ditemukan</h2>
        <Link
          to="/artikel"
          className="btn-retro flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} />
          Kembali ke Artikel
        </Link>
      </div>
    );
  }

  const related = getRelatedArtikels(artikel.id, artikel.tags, 2);

  function handleCopyLink() {
    copyToClipboard(window.location.href);
    if (!copiedRef.current) {
      copiedRef.current = true;
      const btn = document.getElementById('copy-link-btn');
      if (btn) {
        btn.textContent = 'Tersalin!';
        setTimeout(() => {
          btn.textContent = 'Salin Link';
          copiedRef.current = false;
        }, 2000);
      }
    }
  }

  return (
    <section className="min-h-screen px-4 py-10 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-xs text-white/40 mb-6"
      >
        <Link to="/beranda" className="hover:text-white transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <Link to="/artikel" className="hover:text-white transition-colors">
          Artikel
        </Link>
        <span>/</span>
        <span className="text-white/70 truncate max-w-[180px]">
          {artikel.title}
        </span>
      </motion.nav>

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <button
          onClick={() => navigate('/artikel')}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-retro-yellow transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Artikel
        </button>
      </motion.div>

      {/* Article Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {artikel.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-retro-yellow/20 text-retro-yellow retro-border"
            >
              <Tag size={11} />
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-4">
          {artikel.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-white/50 mb-4">
          <span className="flex items-center gap-1.5">
            <User size={15} />
            {artikel.author}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarBlank size={15} />
            {formatDate(artikel.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={15} />
            {artikel.readTime} menit baca
          </span>
        </div>

        {/* Share */}
        <button
          id="copy-link-btn"
          onClick={handleCopyLink}
          className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 glass retro-border rounded-lg text-white/60 hover:text-retro-yellow transition-colors"
        >
          <LinkIcon size={13} />
          Salin Link
        </button>
      </motion.div>

      {/* Divider */}
      <div className="border-t border-white/10 mb-8" />

      {/* Article Content */}
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="prose prose-invert prose-sm sm:prose-base max-w-none
          prose-headings:font-heading prose-headings:font-bold prose-headings:text-white
          prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
          prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-white/70 prose-p:leading-relaxed
          prose-a:text-retro-yellow prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white
          prose-ul:text-white/70 prose-ol:text-white/70
          prose-li:marker:text-retro-yellow
          prose-code:text-retro-yellow prose-code:bg-white/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
          prose-pre:bg-white/5 prose-pre:retro-border prose-pre:rounded-lg prose-pre:text-xs"
        dangerouslySetInnerHTML={{ __html: artikel.content }}
      />

      {/* Divider */}
      <div className="border-t border-white/10 mt-10 mb-8" />

      {/* Related Articles */}
      {related.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Newspaper size={20} weight="fill" className="text-retro-yellow" />
            Artikel Terkait
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((rel) => (
              <Link
                key={rel.id}
                to={`/artikel/${rel.slug}`}
                className="block group"
              >
                <div className="glass retro-border rounded-xl p-4 flex flex-col gap-2 transition-all duration-300 group-hover:shadow-lvl-1 group-hover:-translate-y-0.5">
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    {rel.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-xs px-1.5 py-0.5 rounded-full bg-retro-yellow/10 text-retro-yellow"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h4 className="font-heading text-sm font-bold text-white group-hover:text-retro-yellow transition-colors leading-snug">
                    {rel.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-retro-yellow mt-1">
                    Baca <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}
