// src/components/ArtikelEditor/TiptapEditor.jsx
// Rich text editor berbasis Tiptap dengan toolbar lengkap

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Placeholder } from '@tiptap/extension-placeholder';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import { Youtube } from '@tiptap/extension-youtube';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { useCallback, useState } from 'react';
import {
  TextB, TextItalic, TextUnderline, TextStrikethrough,
  TextH, Code, Link as LinkIcon, Image as ImageIcon,
  ListBullets, ListNumbers, Quotes, Minus,
  AlignLeft, AlignCenter, AlignRight,
  ArrowCounterClockwise, ArrowClockwise,
  YoutubeLogoIcon, Table as TableIcon,
  DownloadSimple, X, Check,
  TextAlignLeft, TextAlignCenter, TextAlignRight,
  FilePdf,
} from '@phosphor-icons/react';

const lowlight = createLowlight();

// ─── Toolbar Button ────────────────────────────────────────────────────────────
function TBtn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={`w-7 h-7 flex items-center justify-center rounded text-sm transition-all
        ${active
          ? 'bg-retro-yellow border-[2px] border-retro-dark shadow-[1px_1px_0_#2D2A26]'
          : 'hover:bg-retro-yellow/30 border-[2px] border-transparent'
        }
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {children}
    </button>
  );
}

function TDivider() {
  return <div className="w-px h-5 bg-retro-dark/20 mx-0.5" />;
}

// ─── Link Dialog ───────────────────────────────────────────────────────────────
function LinkDialog({ editor, onClose }) {
  const prev = editor.getAttributes('link').href || '';
  const [url, setUrl] = useState(prev);
  const [newTab, setNewTab] = useState(true);

  function apply() {
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: newTab ? '_blank' : '_self' }).run();
    }
    onClose();
  }

  return (
    <div className="flex items-center gap-2 bg-retro-bg border-[2px] border-retro-dark rounded-xl px-3 py-2 shadow-[3px_3px_0_#2D2A26] min-w-[280px]">
      <input
        autoFocus
        type="url"
        placeholder="https://..."
        value={url}
        onChange={e => setUrl(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') apply(); if (e.key === 'Escape') onClose(); }}
        className="flex-1 bg-transparent text-xs font-body focus:outline-none"
      />
      <label className="flex items-center gap-1 text-[10px] font-bold whitespace-nowrap">
        <input type="checkbox" checked={newTab} onChange={e => setNewTab(e.target.checked)} className="accent-retro-yellow" />
        Tab baru
      </label>
      <button type="button" onClick={apply} className="w-6 h-6 flex items-center justify-center bg-retro-yellow retro-border rounded-lg"><Check size={13} weight="bold" /></button>
      <button type="button" onClick={onClose} className="w-6 h-6 flex items-center justify-center hover:bg-red-100 retro-border rounded-lg"><X size={13} weight="bold" /></button>
    </div>
  );
}

// ─── Image Dialog ──────────────────────────────────────────────────────────────
function ImageDialog({ editor, onClose, imgbbKey }) {
  const [tab, setTab] = useState('url');
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  function insertFromUrl() {
    if (!url) return;
    editor.chain().focus().setImage({ src: url, alt }).run();
    onClose();
  }

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!imgbbKey) { setError('Atur API Key ImgBB di tab Pengaturan dulu.'); return; }
    setUploading(true); setError('');
    try {
      const ext = file.name.split('.').pop();
      const safeName = `img_${Date.now()}.${ext}`;
      const fd = new FormData();
      fd.append('image', file, safeName);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey.trim()}`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        editor.chain().focus().setImage({ src: data.data.url, alt }).run();
        onClose();
      } else throw new Error(data.error?.message || 'Upload gagal');
    } catch (err) { setError(err.message); }
    finally { setUploading(false); }
  }

  return (
    <div className="bg-retro-bg border-[2px] border-retro-dark rounded-2xl p-4 shadow-[4px_4px_0_#2D2A26] w-80">
      <div className="flex gap-2 mb-3">
        {['url','upload'].map(t => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={`text-[11px] font-bold px-3 py-1 rounded-full border-[2px] border-retro-dark transition-all ${tab===t ? 'bg-retro-yellow shadow-[1px_1px_0_#2D2A26]' : 'hover:bg-retro-yellow/20'}`}
          >{t === 'url' ? '🔗 URL' : '📤 Upload'}</button>
        ))}
        <button type="button" onClick={onClose} className="ml-auto"><X size={14} weight="bold" /></button>
      </div>
      <input type="text" placeholder="Teks alternatif (alt)..." value={alt} onChange={e => setAlt(e.target.value)}
        className="w-full bg-retro-bg border-[1.5px] border-retro-dark rounded-lg px-2 py-1 text-xs font-body mb-2 focus:outline-none" />
      {tab === 'url' ? (
        <>
          <input autoFocus type="url" placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') insertFromUrl(); }}
            className="w-full bg-retro-bg border-[1.5px] border-retro-dark rounded-lg px-2 py-1 text-xs font-body mb-2 focus:outline-none" />
          <button type="button" onClick={insertFromUrl}
            className="w-full bg-retro-yellow retro-border text-xs font-bold py-1.5 rounded-xl hover:brightness-105">Sisipkan Gambar</button>
        </>
      ) : (
        <>
          <input type="file" accept="image/*" onChange={handleFile}
            className="w-full text-xs file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-[2px] file:border-retro-dark file:text-xs file:font-bold file:bg-retro-yellow cursor-pointer mb-2" />
          {uploading && <p className="text-xs text-retro-dark/60 animate-pulse">Mengunggah...</p>}
          {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
        </>
      )}
    </div>
  );
}

// ─── YouTube Dialog ────────────────────────────────────────────────────────────
function YoutubeDialog({ editor, onClose }) {
  const [url, setUrl] = useState('');
  function insert() {
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url, width: '100%', height: 320 });
    onClose();
  }
  return (
    <div className="flex items-center gap-2 bg-retro-bg border-[2px] border-retro-dark rounded-xl px-3 py-2 shadow-[3px_3px_0_#2D2A26] min-w-[280px]">
      <input autoFocus type="url" placeholder="URL YouTube..." value={url} onChange={e => setUrl(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') insert(); if (e.key === 'Escape') onClose(); }}
        className="flex-1 bg-transparent text-xs font-body focus:outline-none" />
      <button type="button" onClick={insert} className="w-6 h-6 flex items-center justify-center bg-red-500 text-white retro-border rounded-lg"><Check size={13} weight="bold" /></button>
      <button type="button" onClick={onClose}><X size={13} weight="bold" /></button>
    </div>
  );
}

// ─── Download Link Dialog ──────────────────────────────────────────────────────
function DownloadDialog({ editor, onClose }) {
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('Unduh File');
  function insert() {
    if (!url) return;
    const html = `<a href="${url}" download class="download-link">📎 ${label}</a>`;
    editor.chain().focus().insertContent(html).run();
    onClose();
  }
  return (
    <div className="bg-retro-bg border-[2px] border-retro-dark rounded-2xl p-4 shadow-[4px_4px_0_#2D2A26] w-72">
      <div className="flex justify-between items-center mb-3">
        <span className="font-heading font-bold text-sm">📎 Link Unduhan</span>
        <button type="button" onClick={onClose}><X size={14} weight="bold" /></button>
      </div>
      <input type="text" placeholder="Teks tombol..." value={label} onChange={e => setLabel(e.target.value)}
        className="w-full bg-retro-bg border-[1.5px] border-retro-dark rounded-lg px-2 py-1 text-xs font-body mb-2 focus:outline-none" />
      <input type="url" placeholder="URL file (Google Drive, dll)..." value={url} onChange={e => setUrl(e.target.value)}
        className="w-full bg-retro-bg border-[1.5px] border-retro-dark rounded-lg px-2 py-1 text-xs font-body mb-3 focus:outline-none" />
      <button type="button" onClick={insert}
        className="w-full bg-retro-yellow retro-border text-xs font-bold py-1.5 rounded-xl hover:brightness-105">Sisipkan Unduhan</button>
    </div>
  );
}

// ─── Main Toolbar ──────────────────────────────────────────────────────────────
function Toolbar({ editor, imgbbKey }) {
  const [dialog, setDialog] = useState(null); // 'link' | 'image' | 'youtube' | 'download'

  if (!editor) return null;

  const closeDialog = useCallback(() => setDialog(null), []);

  return (
    <div className="border-b-[2px] border-retro-dark relative">
      {/* Toolbar row */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 bg-retro-bg/80">
        {/* Undo / Redo */}
        <TBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <ArrowCounterClockwise size={14} weight="bold" />
        </TBtn>
        <TBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <ArrowClockwise size={14} weight="bold" />
        </TBtn>
        <TDivider />

        {/* Headings */}
        {[1,2,3].map(l => (
          <TBtn key={l} onClick={() => editor.chain().focus().toggleHeading({ level: l }).run()}
            active={editor.isActive('heading', { level: l })} title={`Heading ${l}`}>
            <span className="text-[10px] font-extrabold">H{l}</span>
          </TBtn>
        ))}
        <TBtn onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')} title="Paragraf">
          <span className="text-[10px] font-bold">¶</span>
        </TBtn>
        <TDivider />

        {/* Text style */}
        <TBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <TextB size={14} weight="bold" />
        </TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <TextItalic size={14} weight="bold" />
        </TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <TextUnderline size={14} weight="bold" />
        </TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <TextStrikethrough size={14} weight="bold" />
        </TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">
          <Code size={14} weight="bold" />
        </TBtn>
        <TDivider />

        {/* Align */}
        <TBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Rata Kiri">
          <AlignLeft size={14} weight="bold" />
        </TBtn>
        <TBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Tengah">
          <AlignCenter size={14} weight="bold" />
        </TBtn>
        <TBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Rata Kanan">
          <AlignRight size={14} weight="bold" />
        </TBtn>
        <TDivider />

        {/* Lists */}
        <TBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
          <ListBullets size={14} weight="bold" />
        </TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">
          <ListNumbers size={14} weight="bold" />
        </TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote">
          <Quotes size={14} weight="bold" />
        </TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">
          <span className="text-[10px] font-mono font-bold">{'</>'}</span>
        </TBtn>
        <TBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Garis Pemisah">
          <Minus size={14} weight="bold" />
        </TBtn>
        <TDivider />

        {/* Media & Links */}
        <TBtn onClick={() => setDialog(dialog === 'link' ? null : 'link')} active={editor.isActive('link') || dialog === 'link'} title="Sisipkan Link">
          <LinkIcon size={14} weight="bold" />
        </TBtn>
        <TBtn onClick={() => setDialog(dialog === 'image' ? null : 'image')} active={dialog === 'image'} title="Sisipkan Gambar">
          <ImageIcon size={14} weight="bold" />
        </TBtn>
        <TBtn onClick={() => setDialog(dialog === 'youtube' ? null : 'youtube')} active={dialog === 'youtube'} title="Embed YouTube">
          <span className="text-[10px] font-bold text-red-600">▶</span>
        </TBtn>
        <TBtn onClick={() => setDialog(dialog === 'download' ? null : 'download')} active={dialog === 'download'} title="Link Unduhan">
          <DownloadSimple size={14} weight="bold" />
        </TBtn>
        <TBtn onClick={() => {
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        }} title="Sisipkan Tabel">
          <span className="text-[10px] font-bold">⊞</span>
        </TBtn>
      </div>

      {/* Floating Dialogs */}
      {dialog && (
        <div className="absolute top-full left-2 z-50 mt-1">
          {dialog === 'link' && <LinkDialog editor={editor} onClose={closeDialog} />}
          {dialog === 'image' && <ImageDialog editor={editor} onClose={closeDialog} imgbbKey={imgbbKey} />}
          {dialog === 'youtube' && <YoutubeDialog editor={editor} onClose={closeDialog} />}
          {dialog === 'download' && <DownloadDialog editor={editor} onClose={closeDialog} />}
        </div>
      )}
    </div>
  );
}

// ─── Main TiptapEditor Component ───────────────────────────────────────────────
export default function TiptapEditor({ value, onChange, imgbbKey, placeholder = 'Tulis konten artikel di sini...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Image.configure({ HTMLAttributes: { class: 'rounded-xl max-w-full my-2' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
      CodeBlockLowlight.configure({ lowlight }),
      Youtube.configure({ controls: true, nocookie: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[400px] p-4 focus:outline-none font-body text-sm leading-relaxed prose prose-sm max-w-none prose-headings:font-heading prose-headings:font-bold prose-code:bg-retro-yellow/20 prose-code:px-1 prose-pre:bg-retro-dark prose-pre:text-retro-yellow prose-a:text-blue-700 prose-a:underline prose-img:rounded-xl prose-blockquote:border-l-4 prose-blockquote:border-retro-yellow prose-blockquote:bg-retro-yellow/10 prose-blockquote:py-1',
      },
    },
  });

  return (
    <div className="border-[2.5px] border-retro-dark rounded-2xl overflow-hidden bg-white shadow-[3px_3px_0_#2D2A26]">
      <Toolbar editor={editor} imgbbKey={imgbbKey} />
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex items-center gap-0.5 bg-retro-dark rounded-xl p-1 shadow-lg">
            <button type="button" onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
              className={`px-2 py-1 text-xs font-bold rounded-lg text-white ${editor.isActive('bold') ? 'bg-retro-yellow text-retro-dark' : 'hover:bg-white/20'}`}>B</button>
            <button type="button" onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
              className={`px-2 py-1 text-xs italic rounded-lg text-white ${editor.isActive('italic') ? 'bg-retro-yellow text-retro-dark' : 'hover:bg-white/20'}`}>I</button>
            <button type="button" onMouseDown={e => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
              className={`px-2 py-1 text-xs underline rounded-lg text-white ${editor.isActive('underline') ? 'bg-retro-yellow text-retro-dark' : 'hover:bg-white/20'}`}>U</button>
          </div>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
