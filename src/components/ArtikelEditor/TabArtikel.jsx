// src/components/ArtikelEditor/TabArtikel.jsx
// Tab manajemen artikel untuk Dashboard — CRUD + Rich Text Editor

import { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase';
import {
  collection, query, orderBy, getDocs,
  doc, addDoc, updateDoc, deleteDoc, serverTimestamp, getDoc
} from 'firebase/firestore';
import TiptapEditor from './TiptapEditor';
import {
  Plus, PencilSimple, Trash, FloppyDisk, X,
  Eye, ArrowLeft, Newspaper, Tag, Clock, CalendarBlank,
  WarningCircle, MagnifyingGlass,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Helpers ───────────────────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function estimateReadTime(html) {
  const text = html.replace(/<[^>]+>/g, '');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(ts) {
  if (!ts) return '-';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  tags: '',
  category: '',
  author: 'Mohd Rizki',
  status: 'draft', // 'draft' | 'published'
};

// ─── Article List Item ─────────────────────────────────────────────────────────
function ArtikelListItem({ item, onEdit, onDelete, onPreview }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white border-[2.5px] border-retro-dark rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-[2px_2px_0_#2D2A26] hover:shadow-[3px_3px_0_#2D2A26] transition-all"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-[2px] ${item.status === 'published' ? 'bg-green-100 border-green-600 text-green-700' : 'bg-retro-yellow/60 border-retro-dark text-retro-dark'}`}>
            {item.status === 'published' ? '✅ Published' : '📝 Draft'}
          </span>
          {(item.tags || '').split(',').filter(Boolean).slice(0,2).map(t => (
            <span key={t} className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-retro-yellow/30 border border-retro-dark/30 text-retro-dark/70">{t.trim()}</span>
          ))}
        </div>
        <h3 className="font-heading font-bold text-sm leading-snug truncate">{item.title || '(Tanpa Judul)'}</h3>
        <div className="flex items-center gap-3 mt-1 text-[10px] text-retro-dark/50">
          <span className="flex items-center gap-1"><CalendarBlank size={11} />{formatDate(item.updatedAt || item.createdAt)}</span>
          <span className="flex items-center gap-1"><Clock size={11} />{estimateReadTime(item.content || '')} mnt</span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {item.status === 'published' && (
          <a href={`/artikel/${item.slug}`} target="_blank" rel="noreferrer"
            className="w-8 h-8 flex items-center justify-center border-[2px] border-retro-dark rounded-xl hover:bg-retro-yellow/20 transition-colors" title="Lihat">
            <Eye size={15} weight="bold" />
          </a>
        )}
        <button type="button" onClick={() => onEdit(item)}
          className="w-8 h-8 flex items-center justify-center border-[2px] border-retro-dark rounded-xl hover:bg-retro-yellow transition-colors" title="Edit">
          <PencilSimple size={15} weight="bold" />
        </button>
        {confirming ? (
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => { onDelete(item.id); setConfirming(false); }}
              className="h-8 px-2 bg-red-500 text-white border-[2px] border-retro-dark rounded-xl text-[11px] font-bold">Hapus?</button>
            <button type="button" onClick={() => setConfirming(false)}
              className="w-8 h-8 flex items-center justify-center border-[2px] border-retro-dark rounded-xl hover:bg-retro-yellow/20"><X size={14} weight="bold" /></button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirming(true)}
            className="w-8 h-8 flex items-center justify-center border-[2px] border-retro-dark rounded-xl hover:bg-red-100 transition-colors" title="Hapus">
            <Trash size={15} weight="bold" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Article Editor Panel ──────────────────────────────────────────────────────
function ArtikelEditorPanel({ initial, imgbbKey, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [autoSlug, setAutoSlug] = useState(!initial?.slug);

  function set(key, val) {
    setForm(f => {
      const updated = { ...f, [key]: val };
      if (key === 'title' && autoSlug) updated.slug = slugify(val);
      return updated;
    });
  }

  function handleSlugChange(val) {
    setAutoSlug(false);
    setForm(f => ({ ...f, slug: slugify(val) }));
  }

  function handleSubmit(status) {
    const data = { ...form, status, readTime: estimateReadTime(form.content) };
    onSave(data);
  }

  const readTime = estimateReadTime(form.content);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={onCancel} className="flex items-center gap-1.5 text-xs font-bold border-[2px] border-retro-dark rounded-xl px-3 py-1.5 hover:bg-retro-yellow/20 transition-colors">
          <ArrowLeft size={14} weight="bold" /> Kembali
        </button>
        <h2 className="font-heading font-bold text-base">{initial ? 'Edit Artikel' : 'Artikel Baru'}</h2>
        {form.content && <span className="ml-auto text-[10px] text-retro-dark/50">{readTime} mnt baca · {form.content.replace(/<[^>]+>/g,'').split(/\s+/).filter(Boolean).length} kata</span>}
      </div>

      {/* Title */}
      <div>
        <label className="font-heading text-[11px] font-bold block mb-1">Judul Artikel *</label>
        <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
          placeholder="Judul yang menarik..."
          className="w-full bg-white border-[2.5px] border-retro-dark rounded-xl px-3 py-2 text-sm font-heading font-bold focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,213,107,0.5)] transition-shadow" />
      </div>

      {/* Slug */}
      <div>
        <label className="font-heading text-[11px] font-bold block mb-1">Slug (URL) *</label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-retro-dark/50">/artikel/</span>
          <input type="text" value={form.slug} onChange={e => handleSlugChange(e.target.value)}
            className="flex-1 bg-white border-[2px] border-retro-dark rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,213,107,0.5)] transition-shadow" />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="font-heading text-[11px] font-bold block mb-1">Ringkasan (Excerpt)</label>
        <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
          placeholder="Deskripsi singkat artikel (tampil di kartu daftar)..."
          rows={3}
          className="w-full bg-white border-[2px] border-retro-dark rounded-xl px-3 py-2 text-xs font-body resize-none focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,213,107,0.5)] transition-shadow" />
      </div>

      {/* Row: Tags + Category + Author */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="font-heading text-[11px] font-bold block mb-1">Tags (pisah koma)</label>
          <input type="text" value={form.tags} onChange={e => set('tags', e.target.value)}
            placeholder="React, JavaScript, Tutorial"
            className="w-full bg-white border-[2px] border-retro-dark rounded-xl px-3 py-1.5 text-xs font-body focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,213,107,0.5)] transition-shadow" />
        </div>
        <div>
          <label className="font-heading text-[11px] font-bold block mb-1">Kategori</label>
          <input type="text" value={form.category} onChange={e => set('category', e.target.value)}
            placeholder="Teknologi"
            className="w-full bg-white border-[2px] border-retro-dark rounded-xl px-3 py-1.5 text-xs font-body focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,213,107,0.5)] transition-shadow" />
        </div>
        <div>
          <label className="font-heading text-[11px] font-bold block mb-1">Penulis</label>
          <input type="text" value={form.author} onChange={e => set('author', e.target.value)}
            className="w-full bg-white border-[2px] border-retro-dark rounded-xl px-3 py-1.5 text-xs font-body focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,213,107,0.5)] transition-shadow" />
        </div>
      </div>

      {/* Rich Text Editor */}
      <div>
        <label className="font-heading text-[11px] font-bold block mb-2">Konten Artikel *</label>
        <TiptapEditor
          value={form.content}
          onChange={val => set('content', val)}
          imgbbKey={imgbbKey}
        />
      </div>

      {/* Validation warning */}
      {(!form.title || !form.slug || !form.content || form.content === '<p></p>') && (
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 border-[2px] border-amber-300 rounded-xl px-3 py-2">
          <WarningCircle size={15} weight="bold" />
          Judul, slug, dan konten wajib diisi.
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-2">
        <button type="button" disabled={saving}
          onClick={() => handleSubmit('draft')}
          className="flex items-center gap-1.5 border-[2.5px] border-retro-dark bg-white text-retro-dark rounded-xl px-4 py-2 text-xs font-bold shadow-[2px_2px_0_#2D2A26] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_#2D2A26] transition-all disabled:opacity-50">
          <FloppyDisk size={14} weight="bold" /> Simpan Draft
        </button>
        <button type="button" disabled={saving || !form.title || !form.slug || !form.content || form.content === '<p></p>'}
          onClick={() => handleSubmit('published')}
          className="flex items-center gap-1.5 bg-retro-yellow border-[2.5px] border-retro-dark rounded-xl px-4 py-2 text-xs font-bold shadow-[2px_2px_0_#2D2A26] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_#2D2A26] transition-all disabled:opacity-50">
          {saving ? '⏳ Menyimpan...' : '🚀 Publish'}
        </button>
        <button type="button" onClick={onCancel}
          className="flex items-center gap-1.5 border-[2px] border-retro-dark/30 rounded-xl px-4 py-2 text-xs font-bold text-retro-dark/60 hover:bg-retro-dark/5 transition-all">
          <X size={14} weight="bold" /> Batal
        </button>
      </div>
    </div>
  );
}

// ─── Main Tab Component ─────────────────────────────────────────────────────────
export default function TabArtikel({ showToast }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'editor'
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [imgbbKey, setImgbbKey] = useState('');

  // Load articles from Firestore
  async function loadArticles() {
    setLoading(true);
    try {
      const q = query(collection(db, 'artikel'), orderBy('updatedAt', 'desc'));
      const snap = await getDocs(q);
      setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
      showToast('Gagal memuat artikel');
    }
    setLoading(false);
  }

  // Load ImgBB key from settings
  async function loadImgbbKey() {
    try {
      const docSnap = await getDoc(doc(db, 'site', 'admin'));
      setImgbbKey(docSnap.data()?.imgbb || '');
    } catch {}
  }

  useEffect(() => {
    loadArticles();
    loadImgbbKey();
  }, []);

  async function handleSave(data) {
    if (!data.title || !data.slug || !data.content || data.content === '<p></p>') {
      showToast('Judul, slug, dan konten wajib diisi!');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...data,
        tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
        readTime: data.readTime || 1,
        updatedAt: serverTimestamp(),
      };
      if (editing?.id) {
        await updateDoc(doc(db, 'artikel', editing.id), payload);
        showToast('Artikel berhasil diperbarui!');
      } else {
        await addDoc(collection(db, 'artikel'), { ...payload, createdAt: serverTimestamp() });
        showToast('Artikel baru berhasil disimpan!');
      }
      setView('list');
      setEditing(null);
      loadArticles();
    } catch (e) {
      console.error(e);
      showToast('Gagal menyimpan: ' + e.message);
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    try {
      await deleteDoc(doc(db, 'artikel', id));
      showToast('Artikel dihapus.');
      setArticles(a => a.filter(x => x.id !== id));
    } catch (e) {
      showToast('Gagal menghapus: ' + e.message);
    }
  }

  function openNew() {
    setEditing(null);
    setView('editor');
  }

  function openEdit(item) {
    setEditing({
      ...item,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
    });
    setView('editor');
  }

  const filtered = articles.filter(a =>
    !search || (a.title || '').toLowerCase().includes(search.toLowerCase())
  );

  // ── Editor view ────────────────────────────────────────────────────────────
  if (view === 'editor') {
    return (
      <ArtikelEditorPanel
        initial={editing}
        imgbbKey={imgbbKey}
        onSave={handleSave}
        onCancel={() => { setView('list'); setEditing(null); }}
        saving={saving}
      />
    );
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Newspaper size={22} weight="fill" />
          <h2 className="font-heading font-bold text-lg">Manajemen Artikel</h2>
          <span className="text-xs font-bold px-2 py-0.5 bg-retro-yellow retro-border rounded-full">{articles.length}</span>
        </div>
        <button type="button" onClick={openNew}
          className="sm:ml-auto flex items-center gap-1.5 bg-retro-yellow border-[2.5px] border-retro-dark rounded-xl px-4 py-2 text-xs font-bold shadow-[2px_2px_0_#2D2A26] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_#2D2A26] transition-all">
          <Plus size={14} weight="bold" /> Artikel Baru
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-retro-dark/40" />
        <input type="text" placeholder="Cari artikel..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-8 pr-4 py-2 bg-white border-[2px] border-retro-dark rounded-xl text-sm font-body focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,213,107,0.5)] transition-shadow" />
      </div>

      {/* Article List */}
      {loading ? (
        <div className="text-center py-16 text-retro-dark/40 animate-pulse">
          <Newspaper size={40} className="mx-auto mb-2 opacity-20" />
          <p className="font-bold text-sm">Memuat artikel...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-retro-dark/40">
          <Newspaper size={40} className="mx-auto mb-2 opacity-20" />
          <p className="font-bold text-sm">Belum ada artikel{search ? ' yang cocok' : ''}.</p>
          {!search && <button type="button" onClick={openNew} className="mt-3 text-xs font-bold underline">+ Buat artikel pertama</button>}
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {filtered.map(item => (
              <ArtikelListItem key={item.id} item={item} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Firebase info */}
      <p className="text-[10px] text-retro-dark/30 text-center pt-2">
        Artikel disimpan di Firebase Firestore · Dibaca otomatis di halaman /artikel
      </p>
    </div>
  );
}
