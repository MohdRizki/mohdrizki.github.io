import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import AutoIllustration from '../components/AutoIllustration';
import { 
  User, SquaresFour, FileText, Image as ImageIcon, Gear, 
  ArrowSquareOut, SignOut, FloppyDisk, PencilSimple, Trash, Plus 
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Utility: GDrive Direct Link ---
function getDriveDirectLink(url) {
  if (!url) return '';
  if (url.includes('drive.google.com/uc?export=view')) return url;
  const match = url.match(/\/d\/(.*?)\//) || url.match(/id=(.*?)(?:&|$)/);
  if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
}

export default function Dashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profil');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div className="font-body min-h-screen flex flex-col bg-retro-bg">
      <SEO title="Dashboard Admin" />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-[9999] bg-retro-dark text-retro-bg px-5 py-3 rounded-xl text-xs font-bold shadow-[3px_3px_0px_#FFD56B]"
          >
            ✅ {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar Dashboard */}
      <nav className="sticky top-0 z-50 bg-retro-bg/95 backdrop-blur-sm border-b-[2.5px] border-retro-dark px-4 md:px-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between h-14">
              <div className="font-heading text-xl font-bold tracking-tight flex items-center gap-1.5">
                  <span className="bg-retro-yellow retro-border w-7 h-7 rounded-lg flex items-center justify-center text-sm retro-shadow-sm">R</span>
                  Dashboard
              </div>
              <div className="flex items-center gap-3">
                  <Link to="/" className="border-[2.5px] border-transparent hover:bg-white hover:border-retro-dark hover:shadow-[2px_2px_0px_#2D2A26] rounded-full px-3 py-1 text-[11px] font-bold flex items-center gap-1 transition-all">
                      <ArrowSquareOut weight="bold" size={16} /> Lihat Situs
                  </Link>
                  <button onClick={logout} className="bg-retro-pink retro-border retro-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_#2D2A26] font-heading font-bold text-[11px] px-3 py-1 rounded-full flex items-center gap-1 transition-all">
                      <SignOut weight="bold" size={16} /> Keluar
                  </button>
              </div>
          </div>
      </nav>

      {/* Tabs */}
      <div className="border-b-[2.5px] border-retro-dark bg-retro-bg px-4 md:px-8">
          <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto no-scrollbar py-3">
              <TabBtn active={activeTab === 'profil'} onClick={() => setActiveTab('profil')} icon={<User weight="bold" />} label="Profil" />
              <TabBtn active={activeTab === 'aplikasi'} onClick={() => setActiveTab('aplikasi')} icon={<SquaresFour weight="bold" />} label="Aplikasi" />
              <TabBtn active={activeTab === 'materi'} onClick={() => setActiveTab('materi')} icon={<FileText weight="bold" />} label="Materi" />
              <TabBtn active={activeTab === 'galeri'} onClick={() => setActiveTab('galeri')} icon={<ImageIcon weight="bold" />} label="Galeri" />
              <TabBtn active={activeTab === 'pengaturan'} onClick={() => setActiveTab('pengaturan')} icon={<Gear weight="bold" />} label="Pengaturan" />
          </div>
      </div>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-10">
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
              >
                {activeTab === 'profil' && <TabProfil showToast={showToast} />}
                {activeTab === 'aplikasi' && <TabAplikasi showToast={showToast} />}
                {activeTab === 'materi' && <TabMateri showToast={showToast} />}
                {activeTab === 'galeri' && <TabGaleri showToast={showToast} />}
                {activeTab === 'pengaturan' && <TabPengaturan showToast={showToast} />}
              </motion.div>
            </AnimatePresence>
          </div>
      </main>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`cursor-pointer transition-all border-[2.5px] border-transparent rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap flex items-center gap-1.5
      ${active ? 'bg-retro-yellow border-retro-dark shadow-[2px_2px_0px_#2D2A26] -translate-x-[1px] -translate-y-[1px]' : 'hover:bg-white hover:border-retro-dark hover:shadow-[2px_2px_0px_#2D2A26]'}
      `}
    >
      {icon} {label}
    </button>
  );
}

// ===================== KOMPONEN TAB =====================

function TabProfil({ showToast }) {
  const [profile, setProfile] = useState({});
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    getDoc(doc(db, 'site', 'profile')).then(doc => {
      if (doc.exists) setProfile(doc.data());
    });
    getDoc(doc(db, 'site', 'skills')).then(doc => {
      if (doc.exists) setSkills(doc.data().list || []);
    });
  }, []);

  const handleSaveProfile = async () => {
    await setDoc(doc(db, 'site', 'profile'), profile, { merge: true });
    showToast('Profil tersimpan!');
  };

  const addSkill = async () => {
    if (!skillInput) return;
    const newSkills = [...skills, skillInput];
    setSkills(newSkills);
    await setDoc(doc(db, 'site', 'skills'), { list: newSkills });
    setSkillInput('');
    showToast('Keahlian ditambahkan!');
  };

  const removeSkill = async (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
    await setDoc(doc(db, 'site', 'skills'), { list: newSkills });
    showToast('Keahlian dihapus.');
  };

  return (
    <>
      <div className="retro-card p-5 mb-5">
        <h2 className="font-heading text-base font-bold mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-retro-yellow retro-border rounded-lg flex items-center justify-center retro-shadow-sm"><User weight="bold" /></span>
            Informasi Dasar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputForm label="Nama Lengkap" value={profile.name} onChange={v => setProfile({...profile, name: v})} />
            <InputForm label="Gelar" value={profile.title} onChange={v => setProfile({...profile, title: v})} />
            <InputForm label="Email" value={profile.email} onChange={v => setProfile({...profile, email: v})} />
            <InputForm label="Telepon" value={profile.phone} onChange={v => setProfile({...profile, phone: v})} />
            <InputForm label="Lokasi" value={profile.location} onChange={v => setProfile({...profile, location: v})} />
            <InputForm label="Jabatan" value={profile.role} onChange={v => setProfile({...profile, role: v})} />
        </div>
        <div className="mt-3">
          <label className="font-heading text-[11px] font-bold block mb-1">Bio</label>
          <textarea 
            className="w-full bg-retro-bg border-[2.5px] border-retro-dark rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,213,107,0.5)] transition-shadow min-h-[80px]"
            value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})}
          />
        </div>
        
        {/* Media Sosial Section */}
        <div className="mt-5 border-t-[2.5px] border-retro-dark border-dashed pt-5">
          <h3 className="font-heading text-sm font-bold mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-retro-pink retro-border rounded flex items-center justify-center text-[10px]">@</span>
            Media Sosial
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             <SocialInput name="TikTok" id="tiktok" profile={profile} setProfile={setProfile} />
             <SocialInput name="YouTube" id="youtube" profile={profile} setProfile={setProfile} />
             <SocialInput name="Instagram" id="instagram" profile={profile} setProfile={setProfile} />
             <SocialInput name="LinkedIn" id="linkedin" profile={profile} setProfile={setProfile} />
          </div>
        </div>
        <button onClick={handleSaveProfile} className="bg-retro-yellow retro-border retro-shadow hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_#2D2A26] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none font-heading font-bold text-xs px-5 py-2 rounded-xl mt-4 flex items-center gap-1 transition-all">
            <FloppyDisk weight="bold" size={16} /> Simpan Profil
        </button>
      </div>

      <div className="retro-card p-5">
        <h2 className="font-heading text-base font-bold mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-retro-mint retro-border rounded-lg flex items-center justify-center retro-shadow-sm"><User weight="bold" /></span>
            Keahlian
        </h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map((s, i) => (
            <span key={i} className="bg-retro-grey retro-border rounded-full px-3 py-1 text-[11px] font-bold retro-shadow-sm flex items-center gap-1">
              {s} <button onClick={() => removeSkill(i)} className="ml-1 text-retro-dark/50 hover:text-retro-dark">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
            <input 
              value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="Tambah keahlian..." 
              className="flex-1 bg-retro-bg border-[2.5px] border-retro-dark rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,213,107,0.5)] transition-shadow" 
            />
            <button onClick={addSkill} className="bg-retro-yellow retro-border retro-shadow-sm font-heading font-bold text-[11px] px-4 py-1.5 rounded-xl hover:-translate-y-0.5 transition-transform">Tambah</button>
        </div>
      </div>
    </>
  );
}

function TabAplikasi({ showToast }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', desc: '', category: '', badge: '', img: '', link: '' });
  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    const snap = await getDocs(query(collection(db, 'apps'), orderBy('order', 'asc')));
    const data = [];
    snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
    setItems(data);
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    if (!form.name) return;
    const finalData = { ...form, img: getDriveDirectLink(form.img) };

    if (editId) {
      await updateDoc(doc(db, 'apps', editId), finalData);
      showToast('Aplikasi diperbarui!');
    } else {
      finalData.order = items.length;
      await addDoc(collection(db, 'apps'), finalData);
      showToast('Aplikasi ditambahkan!');
    }
    setForm({ name: '', desc: '', category: '', badge: '', img: '', link: '' });
    setEditId(null);
    loadData();
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin hapus?')) {
      await deleteDoc(doc(db, 'apps', id));
      loadData();
      showToast('Dihapus!');
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ name: item.name||'', desc: item.desc||'', category: item.category||'', badge: item.badge||'', img: item.img||'', link: item.link||'' });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <>
      <div className="retro-card p-5 mb-5">
        <h2 className="font-heading text-base font-bold mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-retro-yellow retro-border rounded-lg flex items-center justify-center retro-shadow-sm"><SquaresFour weight="bold" /></span>
            Daftar Aplikasi
        </h2>
        {items.map(d => (
          <div key={d.id} className="flex items-center gap-2 padding-2 border-b-[1.5px] border-retro-bg py-2 hover:bg-retro-grey transition-colors px-2 rounded">
              <div className="w-10 h-10 bg-retro-grey retro-border rounded-lg mr-2 overflow-hidden flex items-center justify-center shrink-0">
                  {d.img ? <img src={d.img} className="w-full h-full object-cover" /> : <AutoIllustration name={d.name} category={d.category} size="sm" />}
              </div>
              <div className="flex-1"><span className="font-heading text-xs font-bold">{d.name}</span> <br/><span className="text-[10px] text-retro-dark/60">{d.category || ''}</span></div>
              <button onClick={() => handleEdit(d)} className="text-retro-dark/40 hover:text-retro-dark mr-1"><PencilSimple size={16} weight="bold" /></button>
              <button onClick={() => handleDelete(d.id)} className="text-retro-dark/40 hover:text-retro-dark"><Trash size={16} weight="bold" /></button>
          </div>
        ))}
      </div>

      <div className="retro-card p-5">
        <p className="font-heading text-sm font-bold mb-3">{editId ? '✏️ Edit Aplikasi' : '+ Tambah Aplikasi Baru'}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputForm label="Nama Aplikasi" value={form.name} onChange={v => setForm({...form, name: v})} />
            <InputForm label="Kategori" value={form.category} onChange={v => setForm({...form, category: v})} />
            <InputForm label="Deskripsi" value={form.desc} onChange={v => setForm({...form, desc: v})} />
            <InputForm label="Badge" value={form.badge} onChange={v => setForm({...form, badge: v})} />
            <div className="md:col-span-2">
              <InputForm label="Link / URL Aplikasi" value={form.link} onChange={v => setForm({...form, link: v})} />
            </div>
            <div className="md:col-span-2">
              <ImageUploader label="Gambar / Ikon (Otomatis jika dikosongkan)" value={form.img} onChange={v => setForm({...form, img: v})} path="apps" />
              {form.img ? <img src={getDriveDirectLink(form.img)} className="mt-2 h-24 object-cover retro-border rounded-lg" /> : form.name && (
                <div className="mt-2">
                  <p className="text-[10px] font-bold text-retro-dark/50 mb-1">Preview ilustrasi otomatis:</p>
                  <div className="h-24 w-32 retro-border rounded-lg overflow-hidden">
                    <AutoIllustration name={form.name} category={form.category} />
                  </div>
                </div>
              )}
            </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
            <button onClick={handleSave} className="bg-retro-yellow retro-border retro-shadow font-heading font-bold text-xs px-5 py-2 rounded-xl flex items-center gap-1 hover:-translate-y-0.5 transition-transform">
                <FloppyDisk weight="bold" size={16} /> {editId ? 'Update' : 'Tambah'}
            </button>
            {editId && <button onClick={() => {setEditId(null); setForm({ name: '', desc: '', category: '', badge: '', img: '', link: '' })}} className="text-xs font-bold hover:text-retro-dark/50">Batal</button>}
        </div>
      </div>
    </>
  );
}

function TabMateri({ showToast }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', desc: '', category: '', img: '', link: '' });
  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    const snap = await getDocs(query(collection(db, 'materials'), orderBy('order', 'asc')));
    const data = [];
    snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
    setItems(data);
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    if (!form.title) return;
    const finalData = { ...form, img: getDriveDirectLink(form.img) };

    if (editId) {
      await updateDoc(doc(db, 'materials', editId), finalData);
      showToast('Materi diperbarui!');
    } else {
      finalData.order = items.length;
      await addDoc(collection(db, 'materials'), finalData);
      showToast('Materi ditambahkan!');
    }
    setForm({ title: '', desc: '', category: '', img: '', link: '' });
    setEditId(null);
    loadData();
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin hapus?')) {
      await deleteDoc(doc(db, 'materials', id));
      loadData();
      showToast('Dihapus!');
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ title: item.title||'', desc: item.desc||'', category: item.category||'', img: item.img||'', link: item.link||'' });
  };

  return (
    <>
      <div className="retro-card p-5 mb-5">
        <h2 className="font-heading text-base font-bold mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-retro-blue retro-border rounded-lg flex items-center justify-center retro-shadow-sm"><FileText weight="bold" /></span>
            Daftar Materi
        </h2>
        {items.map(d => (
          <div key={d.id} className="flex items-center gap-2 padding-2 border-b-[1.5px] border-retro-bg py-2 hover:bg-retro-grey transition-colors px-2 rounded">
              <div className="w-10 h-10 bg-retro-grey retro-border rounded-lg mr-2 overflow-hidden flex items-center justify-center shrink-0">
                  {d.img ? <img src={d.img} className="w-full h-full object-cover" /> : <AutoIllustration name={d.title} category={d.category} size="sm" />}
              </div>
              <div className="flex-1"><span className="font-heading text-xs font-bold">{d.title}</span> <br/><span className="text-[10px] text-retro-dark/60">{d.category || ''}</span></div>
              <button onClick={() => handleEdit(d)} className="text-retro-dark/40 hover:text-retro-dark mr-1"><PencilSimple size={16} weight="bold" /></button>
              <button onClick={() => handleDelete(d.id)} className="text-retro-dark/40 hover:text-retro-dark"><Trash size={16} weight="bold" /></button>
          </div>
        ))}
      </div>

      <div className="retro-card p-5">
        <p className="font-heading text-sm font-bold mb-3">{editId ? '✏️ Edit Materi' : '+ Tambah Materi Baru'}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputForm label="Judul Materi" value={form.title} onChange={v => setForm({...form, title: v})} />
            <InputForm label="Kategori" value={form.category} onChange={v => setForm({...form, category: v})} />
            <div className="md:col-span-2">
              <InputForm label="Deskripsi" value={form.desc} onChange={v => setForm({...form, desc: v})} />
            </div>
            <div className="md:col-span-2">
              <InputForm label="Link Materi (URL GDrive / Dokumen)" value={form.link} onChange={v => setForm({...form, link: v})} />
            </div>
            <div className="md:col-span-2">
              <ImageUploader label="Gambar / Ikon (Otomatis jika dikosongkan)" value={form.img} onChange={v => setForm({...form, img: v})} path="materials" />
              {form.img ? <img src={getDriveDirectLink(form.img)} className="mt-2 h-24 object-cover retro-border rounded-lg" /> : form.title && (
                <div className="mt-2">
                  <p className="text-[10px] font-bold text-retro-dark/50 mb-1">Preview ilustrasi otomatis:</p>
                  <div className="h-24 w-32 retro-border rounded-lg overflow-hidden">
                    <AutoIllustration name={form.title} category={form.category} />
                  </div>
                </div>
              )}
            </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
            <button onClick={handleSave} className="bg-retro-blue retro-border retro-shadow font-heading font-bold text-xs px-5 py-2 rounded-xl flex items-center gap-1 hover:-translate-y-0.5 transition-transform">
                <FloppyDisk weight="bold" size={16} /> {editId ? 'Update' : 'Tambah'}
            </button>
            {editId && <button onClick={() => {setEditId(null); setForm({ title: '', desc: '', category: '', img: '', link: '' })}} className="text-xs font-bold hover:text-retro-dark/50">Batal</button>}
        </div>
      </div>
    </>
  );
}

function TabGaleri({ showToast }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', desc: '', img: '' });
  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    const snap = await getDocs(query(collection(db, 'gallery'), orderBy('order', 'asc')));
    const data = [];
    snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
    setItems(data);
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    if (!form.title) return;
    const finalData = { ...form, img: getDriveDirectLink(form.img) };

    if (editId) {
      await updateDoc(doc(db, 'gallery', editId), finalData);
      showToast('Foto diperbarui!');
    } else {
      finalData.order = items.length;
      finalData.timestamp = Date.now();
      await addDoc(collection(db, 'gallery'), finalData);
      showToast('Foto ditambahkan!');
    }
    setForm({ title: '', desc: '', img: '' });
    setEditId(null);
    loadData();
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin hapus?')) {
      await deleteDoc(doc(db, 'gallery', id));
      loadData();
      showToast('Dihapus!');
    }
  };

  return (
    <>
      <div className="retro-card p-5 mb-5">
        <h2 className="font-heading text-base font-bold mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-retro-pink retro-border rounded-lg flex items-center justify-center retro-shadow-sm"><ImageIcon weight="bold" /></span>
            Galeri Kegiatan
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map(d => (
            <div key={d.id} className="retro-card relative group">
                <div className="aspect-square bg-retro-grey overflow-hidden">
                  <img src={d.img || 'https://placehold.co/300x200/F5F0E8/2D2A26?text=Foto'} className="w-full h-full object-cover" />
                </div>
                <div className="p-2"><p className="font-heading text-[10px] font-bold truncate">{d.title}</p></div>
                <button onClick={() => handleDelete(d.id)} className="absolute top-1 right-1 bg-retro-white retro-border rounded-full w-6 h-6 flex items-center justify-center text-retro-dark/60 hover:text-retro-dark opacity-0 group-hover:opacity-100 transition-opacity retro-shadow-sm"><Trash size={14} weight="bold" /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="retro-card p-5">
        <p className="font-heading text-sm font-bold mb-3">{editId ? '✏️ Edit Foto' : '+ Tambah Foto Baru'}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputForm label="Judul" value={form.title} onChange={v => setForm({...form, title: v})} />
            <div className="row-span-2">
              <ImageUploader label="Foto Kegiatan" value={form.img} onChange={v => setForm({...form, img: v})} path="gallery" />
              {form.img && <img src={getDriveDirectLink(form.img)} className="mt-2 h-32 w-full object-cover retro-border rounded-lg" />}
            </div>
            <div className="md:col-span-1">
              <InputForm label="Deskripsi" value={form.desc} onChange={v => setForm({...form, desc: v})} />
            </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
            <button onClick={handleSave} className="bg-retro-pink retro-border retro-shadow font-heading font-bold text-xs px-5 py-2 rounded-xl flex items-center gap-1 hover:-translate-y-0.5 transition-transform">
                <Plus weight="bold" size={16} /> {editId ? 'Update' : 'Tambah'}
            </button>
            {editId && <button onClick={() => {setEditId(null); setForm({ title: '', desc: '', img: '' })}} className="text-xs font-bold hover:text-retro-dark/50">Batal</button>}
        </div>
      </div>
    </>
  );
}

function TabPengaturan({ showToast }) {
  const [admin, setAdmin] = useState({ username: '', pin: '', imgbb: '' });
  
  useEffect(() => {
    getDoc(doc(db, 'site', 'admin')).then(doc => {
      if (doc.exists) {
        const data = doc.data();
        setAdmin({ username: data.username || '', pin: data.pin || '', imgbb: data.imgbb || '' });
      }
    });
  }, []);

  const handleSave = async () => {
    if (admin.username && admin.pin) {
      await setDoc(doc(db, 'site', 'admin'), admin, { merge: true });
      showToast('Pengaturan keamanan tersimpan!');
    }
  };

  return (
    <div className="retro-card p-5">
      <h2 className="font-heading text-base font-bold mb-4 flex items-center gap-2">
          <span className="w-7 h-7 bg-retro-grey retro-border rounded-lg flex items-center justify-center retro-shadow-sm"><Gear weight="bold" /></span>
          Pengaturan Keamanan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <InputForm label="Username Login" value={admin.username} onChange={v => setAdmin({...admin, username: v})} />
          <InputForm label="PIN Login (Angka)" type="password" value={admin.pin} onChange={v => setAdmin({...admin, pin: v})} maxLength={6} />
          <div className="md:col-span-2">
            <InputForm label="ImgBB API Key (Untuk Upload Foto Gratis)" value={admin.imgbb} onChange={v => setAdmin({...admin, imgbb: v})} />
            <p className="text-[10px] text-retro-dark/50 mt-1">
                Dapatkan API Key gratis di <a href="https://api.imgbb.com/" target="_blank" className="text-retro-blue hover:underline">api.imgbb.com</a>
            </p>
          </div>
      </div>
      <button onClick={handleSave} className="bg-retro-dark text-retro-bg retro-border retro-shadow font-heading font-bold text-xs px-5 py-2 rounded-xl mt-4 flex items-center gap-1 hover:-translate-y-0.5 transition-transform">
          <FloppyDisk weight="bold" size={16} /> Simpan Pengaturan
      </button>
    </div>
  );
}

function InputForm({ label, value, onChange, type="text", maxLength }) {
  return (
    <div>
      <label className="font-heading text-[11px] font-bold block mb-1">{label}</label>
      <input 
        type={type} maxLength={maxLength}
        className="w-full bg-retro-bg border-[2.5px] border-retro-dark rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,213,107,0.5)] transition-shadow"
        value={value || ''} onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

function ImageUploader({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg('');
    setProgress(20);

    try {
      // Fetch ImgBB API Key dari Firebase (Settings)
      const adminDoc = await getDoc(doc(db, 'site', 'admin'));
      const imgbbKey = adminDoc.data()?.imgbb;

      if (!imgbbKey) {
        throw new Error('API Key ImgBB belum diatur di tab Pengaturan.');
      }

      const formData = new FormData();
      
      // Ambil ekstensi file (misal: jpg, png)
      const ext = file.name.split('.').pop();
      // Buat nama file yang 100% aman (tanpa spasi dan tanpa titik ganda)
      const safeName = `img_${Date.now()}.${ext}`;
      
      formData.append('image', file, safeName);

      setProgress(60);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey.trim()}`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setProgress(100);

      if (data.success) {
        onChange(data.data.url);
      } else {
        throw new Error(data.error?.message || 'Gagal mengunggah foto ke ImgBB.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Gagal memulai unggahan.');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="mb-3">
      <label className="font-heading text-[11px] font-bold block mb-1">{label}</label>
      <div className="flex flex-col gap-2">
        <input 
          type="file" 
          accept="image/*"
          onChange={handleFileChange}
          className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-[2.5px] file:border-retro-dark file:text-xs file:font-bold file:bg-retro-mint file:text-retro-dark hover:file:bg-retro-yellow transition-colors cursor-pointer w-full"
        />
        {uploading && (
            <div className="w-full bg-retro-grey h-2 rounded-full overflow-hidden retro-border">
                <div className="bg-retro-blue h-full" style={{ width: `${progress}%` }}></div>
            </div>
        )}
        {errorMsg && (
            <div className="text-[10px] font-bold text-retro-pink/80 mt-1">
                ⚠️ {errorMsg}
            </div>
        )}
        <div className="flex items-center gap-2 mt-1">
           <span className="text-[10px] text-retro-dark/50 whitespace-nowrap">Atau paste URL:</span>
           <input 
              type="text" 
              value={value || ''} 
              onChange={e => onChange(e.target.value)} 
              className="flex-1 bg-retro-bg border-[1.5px] border-retro-dark rounded-lg px-2 py-1 text-xs focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,213,107,0.5)] transition-shadow"
              placeholder="https://..."
           />
        </div>
      </div>
    </div>
  );
}

function SocialInput({ name, id, profile, setProfile }) {
  const urlId = `${id}Url`;
  const showId = `show${id.charAt(0).toUpperCase() + id.slice(1)}`;
  
  return (
    <div className="bg-retro-bg/50 border-[1.5px] border-retro-dark p-2.5 rounded-xl">
      <div className="flex justify-between items-center mb-2">
        <label className="font-heading text-[11px] font-bold">{name}</label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <span className="text-[9px] font-bold text-retro-dark/70">Tampilkan</span>
          <input 
            type="checkbox" 
            className="w-3.5 h-3.5 accent-retro-yellow cursor-pointer"
            checked={profile[showId] || false}
            onChange={e => setProfile({...profile, [showId]: e.target.checked})}
          />
        </label>
      </div>
      <input 
        type="text" 
        placeholder={`URL profil ${name}...`}
        className="w-full bg-retro-white border-[1.5px] border-retro-dark rounded-lg px-2 py-1.5 text-xs font-body focus:outline-none focus:shadow-[0_0_0_2px_rgba(255,213,107,0.5)] transition-shadow"
        value={profile[urlId] || ''} 
        onChange={e => setProfile({...profile, [urlId]: e.target.value})}
      />
    </div>
  );
}
