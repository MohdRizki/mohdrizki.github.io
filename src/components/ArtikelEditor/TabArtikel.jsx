// src/components/ArtikelEditor/TabArtikel.jsx
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import {
  collection, query, orderBy, getDocs,
  doc, addDoc, updateDoc, deleteDoc, serverTimestamp, getDoc
} from 'firebase/firestore';
import {
  Plus, PencilSimple, Trash, FloppyDisk, X,
  Eye, ArrowLeft, Newspaper, Clock, CalendarBlank,
  WarningCircle, MagnifyingGlass, Image as ImageIcon
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function estimateReadTime(text) {
  if (!text) return 1;
  const words = text.replace(/<[^>]+>/g, '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(ts) {
  if (!ts) return '-';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Format newline into paragraphs jika user input teks biasa
function textToHtml(text) {
  if (!text) return '';
  if (text.includes('<p>') || text.includes('<div>') || text.includes('<h')) {
    return text;
  }
  return text
    .split(/\n\s*\n/)
    .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');
}

const EMPTY = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImg: '',
  tags: '',
  category: '',
  author: 'Mohd Rizki',
  status: 'draft'
};

function ArtikelListItem({ item, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white border-[2.5px] border-retro-dark rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-[2px_2px_0_#2D2A26]"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-[2px] ${
              item.status === 'published'
                ? 'bg-green-100 border-green-600 text-green-700'
                : 'bg-retro-yellow/60 border-retro-dark text-retro-dark'
            }`}
          >
            {item.status === 'published' ? '✅ Published' : '📝 Draft'}
          </span>
          {(Array.isArray(item.tags) ? item.tags : (item.tags || '').split(','))
            .filter(Boolean)
            .slice(0, 2)
            .map(t => (
              <span
                key={t}
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-retro-yellow/30 border border-retro-dark/30"
              >
                {t.trim()}
              </span>
            ))}
        </div>
        <h3 className="font-heading font-bold text-sm truncate">{item.title || '(Tanpa Judul)'}</h3>
        <div className="flex items-center gap-3 mt-1 text-[10px] text-retro-dark/50">
          <span className="flex items-center gap-1">
            <CalendarBlank size={11} />
            {formatDate(item.updatedAt || item.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {estimateReadTime(item.content || '')} mnt
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {item.status === 'published' && (
          <a
            href={`/artikel/${item.slug}`}
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 flex items-center justify-center border-[2px] border-retro-dark rounded-xl hover:bg-retro-yellow/20"
            title="Lihat"
          >
            <Eye size={15} weight="bold" />
          </a>
        )}
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="w-8 h-8 flex items-center justify-center border-[2px] border-retro-dark rounded-xl hover:bg-retro-yellow"
          title="Edit"
        >
          <PencilSimple size={15} weight="bold" />
        </button>
        {confirming ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                onDelete(item.id);
                setConfirming(false);
              }}
              className="h-8 px-2 bg-red-500 text-white border-[2px] border-retro-dark rounded-xl text-[11px] font-bold"
            >
              Hapus?
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="w-8 h-8 flex items-center justify-center border-[2px] border-retro-dark rounded-xl hover:bg-retro-yellow/20"
            >
              <X size={14} weight="bold" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="w-8 h-8 flex items-center justify-center border-[2px] border-retro-dark rounded-xl hover:bg-red-100"
            title="Hapus"
          >
            <Trash size={15} weight="bold" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function EditorPanel({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [autoSlug, setAutoSlug] = useState(!initial?.slug);

  function set(key, val) {
    setForm(f => {
      const u = { ...f, [key]: val };
      if (key === 'title' && autoSlug) u.slug = slugify(val);
      return u;
    });
  }

  function handleSlug(val) {
    setAutoSlug(false);
    setForm(f => ({ ...f, slug: slugify(val) }));
  }

  function submit(status) {
    const formattedContent = textToHtml(form.content);
    onSave({
      ...form,
      content: formattedContent,
      status,
      readTime: estimateReadTime(form.content)
    });
  }

  const readTime = estimateReadTime(form.content);
  const invalid = !form.title || !form.slug || !form.content.trim();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-bold border-[2px] border-retro-dark rounded-xl px-3 py-1.5 hover:bg-retro-yellow/20"
        >
          <ArrowLeft size={14} weight="bold" /> Kembali
        </button>
        <h2 className="font-heading font-bold text-base">{initial ? 'Edit Artikel' : 'Artikel Baru'}</h2>
        {form.content && (
          <span className="ml-auto text-[10px] text-retro-dark/50">
            {readTime} mnt baca · {form.content.trim().split(/\s+/).filter(Boolean).length} kata
          </span>
        )}
      </div>

      <div>
        <label className="font-heading text-[11px] font-bold block mb-1">Judul Artikel *</label>
        <input
          type="text"
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder="Judul artikel..."
          className="w-full bg-white border-[2.5px] border-retro-dark rounded-xl px-3 py-2 text-sm font-heading font-bold focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,213,107,0.5)]"
        />
      </div>

      <div>
        <label className="font-heading text-[11px] font-bold block mb-1">Slug (URL) *</label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-retro-dark/50 font-mono">/artikel/</span>
          <input
            type="text"
            value={form.slug}
            onChange={e => handleSlug(e.target.value)}
            className="flex-1 bg-white border-[2px] border-retro-dark rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,213,107,0.5)]"
          />
        </div>
      </div>

      <div>
        <label className="font-heading text-[11px] font-bold block mb-1">URL Gambar Sampul (Opsional)</label>
        <input
          type="text"
          value={form.coverImg || ''}
          onChange={e => set('coverImg', e.target.value)}
          placeholder="https://example.com/gambar.jpg"
          className="w-full bg-white border-[2px] border-retro-dark rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,213,107,0.5)]"
        />
      </div>

      <div>
        <label className="font-heading text-[11px] font-bold block mb-1">Ringkasan (Excerpt)</label>
        <textarea
          value={form.excerpt}
          onChange={e => set('excerpt', e.target.value)}
          rows={2}
          placeholder="Deskripsi singkat untuk kartu artikel..."
          className="w-full bg-white border-[2px] border-retro-dark rounded-xl px-3 py-2 text-xs resize-none focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,213,107,0.5)]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          ['tags', 'Tags (pisah koma)', 'React, Tips, Belajar'],
          ['category', 'Kategori', 'Teknologi'],
          ['author', 'Penulis', 'Mohd Rizki']
        ].map(([key, label, ph]) => (
          <div key={key}>
            <label className="font-heading text-[11px] font-bold block mb-1">{label}</label>
            <input
              type="text"
              value={form[key]}
              onChange={e => set(key, e.target.value)}
              placeholder={ph}
              className="w-full bg-white border-[2px] border-retro-dark rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,213,107,0.5)]"
            />
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="font-heading text-[11px] font-bold">Isi Konten Artikel *</label>
          <span className="text-[10px] text-retro-dark/50">Mendukung format paragraf biasa & HTML</span>
        </div>
        <textarea
          value={form.content}
          onChange={e => set('content', e.target.value)}
          rows={14}
          placeholder="Tulis artikel di sini... Tekan Enter 2x untuk paragraf baru."
          className="w-full bg-white border-[2.5px] border-retro-dark rounded-xl p-3 text-sm font-body leading-relaxed focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,213,107,0.5)]"
        />
      </div>

      {invalid && (
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 border-[2px] border-amber-300 rounded-xl px-3 py-2">
          <WarningCircle size={15} weight="bold" /> Judul, slug, dan isi konten wajib diisi.
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          disabled={saving}
          onClick={() => submit('draft')}
          className="flex items-center gap-1.5 border-[2.5px] border-retro-dark bg-white rounded-xl px-4 py-2 text-xs font-bold shadow-[2px_2px_0_#2D2A26] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_#2D2A26] transition-all disabled:opacity-50"
        >
          <FloppyDisk size={14} weight="bold" /> Simpan Draft
        </button>
        <button
          type="button"
          disabled={saving || invalid}
          onClick={() => submit('published')}
          className="flex items-center gap-1.5 bg-retro-yellow border-[2.5px] border-retro-dark rounded-xl px-4 py-2 text-xs font-bold shadow-[2px_2px_0_#2D2A26] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_#2D2A26] transition-all disabled:opacity-50"
        >
          {saving ? '⏳ Menyimpan...' : '🚀 Publish'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 border-[2px] border-retro-dark/30 rounded-xl px-4 py-2 text-xs font-bold text-retro-dark/60 hover:bg-retro-dark/5"
        >
          <X size={14} weight="bold" /> Batal
        </button>
      </div>
    </div>
  );
}

export default function TabArtikel({ showToast }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  async function load() {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'artikel'), orderBy('updatedAt', 'desc')));
      setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(data) {
    if (!data.title || !data.slug || !data.content?.trim()) {
      showToast('Judul, slug, dan konten wajib diisi!');
      return;
    }
    setSaving(true);
    try {
      const tags = typeof data.tags === 'string'
        ? data.tags.split(',').map(t => t.trim()).filter(Boolean)
        : data.tags;
      const payload = { ...data, tags, updatedAt: serverTimestamp() };
      if (editing?.id) {
        await updateDoc(doc(db, 'artikel', editing.id), payload);
        showToast('Artikel diperbarui!');
      } else {
        await addDoc(collection(db, 'artikel'), { ...payload, createdAt: serverTimestamp() });
        showToast('Artikel baru disimpan!');
      }
      setView('list');
      setEditing(null);
      load();
    } catch (e) {
      showToast('Gagal: ' + e.message);
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    try {
      await deleteDoc(doc(db, 'artikel', id));
      showToast('Artikel dihapus.');
      setArticles(a => a.filter(x => x.id !== id));
    } catch (e) {
      showToast('Gagal hapus: ' + e.message);
    }
  }

  const filtered = articles.filter(a =>
    !search || (a.title || '').toLowerCase().includes(search.toLowerCase())
  );

  if (view === 'editor') {
    return (
      <EditorPanel
        initial={editing}
        onSave={handleSave}
        onCancel={() => {
          setView('list');
          setEditing(null);
        }}
        saving={saving}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Newspaper size={22} weight="fill" />
          <h2 className="font-heading font-bold text-lg">Manajemen Artikel</h2>
          <span className="text-xs font-bold px-2 py-0.5 bg-retro-yellow retro-border rounded-full">
            {articles.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setView('editor');
          }}
          className="sm:ml-auto flex items-center gap-1.5 bg-retro-yellow border-[2.5px] border-retro-dark rounded-xl px-4 py-2 text-xs font-bold shadow-[2px_2px_0_#2D2A26] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_#2D2A26] transition-all"
        >
          <Plus size={14} weight="bold" /> Artikel Baru
        </button>
      </div>

      <div className="relative">
        <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-retro-dark/40" />
        <input
          type="text"
          placeholder="Cari artikel..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-8 pr-4 py-2 bg-white border-[2px] border-retro-dark rounded-xl text-sm focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,213,107,0.5)]"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-retro-dark/40 animate-pulse">
          <Newspaper size={40} className="mx-auto mb-2 opacity-20" />
          <p className="font-bold text-sm">Memuat...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-retro-dark/40">
          <Newspaper size={40} className="mx-auto mb-2 opacity-20" />
          <p className="font-bold text-sm">Belum ada artikel{search ? ' yang cocok' : ''}.</p>
          {!search && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setView('editor');
              }}
              className="mt-3 text-xs font-bold underline"
            >
              + Buat sekarang
            </button>
          )}
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {filtered.map(item => (
              <ArtikelListItem
                key={item.id}
                item={item}
                onEdit={a => {
                  setEditing({
                    ...a,
                    tags: Array.isArray(a.tags) ? a.tags.join(', ') : a.tags || ''
                  });
                  setView('editor');
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </AnimatePresence>
      )}
      <p className="text-[10px] text-retro-dark/30 text-center pt-2">
        Disimpan di Firebase Firestore · Tampil otomatis di /artikel
      </p>
    </div>
  );
}
