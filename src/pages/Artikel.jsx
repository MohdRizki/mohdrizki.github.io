import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MagnifyingGlass,
  Tag,
  Clock,
  CalendarBlank,
  ArrowRight,
  Newspaper,
} from '@phosphor-icons/react';
import { artikelData, getAllTags } from '../data/artikelData';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function ArtikelCard({ artikel }) {
  return (
    <motion.div variants={itemVariants}>
      <Link to={`/artikel/${artikel.slug}`} className="block group">
        <div className="glass retro-border rounded-xl p-5 h-full flex flex-col gap-3 transition-all duration-300 group-hover:shadow-lvl-2 group-hover:-translate-y-1">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {artikel.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold px-2 py-0.5 rounded-full bg-retro-yellow/20 text-retro-yellow retro-border"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2 className="font-heading text-lg font-bold text-white group-hover:text-retro-yellow transition-colors leading-snug">
            {artikel.title}
          </h2>

          {/* Excerpt */}
          <p className="text-sm text-white/60 leading-relaxed flex-1">
            {artikel.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-white/40 mt-auto pt-3 border-t border-white/10">
            <span className="flex items-center gap-1">
              <CalendarBlank size={13} />
              {formatDate(artikel.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {artikel.readTime} menit baca
            </span>
          </div>

          {/* Read more */}
          <div className="flex items-center gap-1 text-sm font-semibold text-retro-yellow group-hover:gap-2 transition-all">
            Baca selengkapnya <ArrowRight size={15} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Artikel() {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('Semua');
  const allTags = useMemo(() => ['Semua', ...getAllTags()], []);

  const filtered = useMemo(() => {
    return artikelData.filter((a) => {
      const matchTag =
        activeTag === 'Semua' || a.tags.includes(activeTag);
      const matchSearch =
        search === '' ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(search.toLowerCase());
      return matchTag && matchSearch;
    });
  }, [search, activeTag]);

  return (
    <section className="min-h-screen px-4 py-10 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <Newspaper size={32} weight="fill" className="text-retro-yellow" />
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Artikel
          </h1>
        </div>
        <p className="text-white/60 text-sm max-w-xl">
          Kumpulan tulisan seputar teknologi, pendidikan, dan pengalaman belajar.
          Semoga bermanfaat!
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mb-5"
      >
        <MagnifyingGlass
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
        />
        <input
          type="text"
          placeholder="Cari artikel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg glass retro-border text-sm text-white placeholder-white/30 bg-transparent focus:outline-none focus:border-retro-yellow transition-colors"
        />
      </motion.div>

      {/* Tag filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-2 mb-8"
      >
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full retro-border transition-all ${
              activeTag === tag
                ? 'bg-retro-yellow text-retro-dark shadow-lvl-1'
                : 'glass text-white/70 hover:text-white'
            }`}
          >
            <Tag size={12} />
            {tag}
          </button>
        ))}
      </motion.div>

      {/* Grid artikel */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-white/40"
        >
          <Newspaper size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-heading text-lg">Artikel tidak ditemukan.</p>
          <p className="text-sm mt-1">Coba kata kunci atau filter lain.</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-5 sm:grid-cols-2"
        >
          {filtered.map((artikel) => (
            <ArtikelCard key={artikel.id} artikel={artikel} />
          ))}
        </motion.div>
      )}
    </section>
  );
}
