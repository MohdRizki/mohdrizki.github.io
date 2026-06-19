import { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StaggerContext } from "../App";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import SEO from "../components/SEO";
import {
  MapPin, EnvelopeSimple, Phone, GraduationCap, Star, Code, Sparkle, Heart,
  TiktokLogo, YoutubeLogo, InstagramLogo, LinkedinLogo
} from "@phosphor-icons/react";

function RevealSection({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  const itemVariants = useContext(StaggerContext);

  const defaults = {
    name: 'Mohamad Rizki',
    title: 'S.Pd., Gr.',
    role: 'Guru SD Negeri Pasirmae 1 🍎',
    email: 'rizkimohamad38@gmail.com',
    phone: '0831-6296-5754',
    location: 'Pandeglang, Banten',
    bio: 'Sebagai Pendidik Sekolah Dasar, saya percaya bahwa pendidikan awal membentuk fondasi karakter dan nalar anak. Saya memadukan pendekatan pedagogik ramah anak dengan media interaktif untuk menciptakan ruang belajar yang seru, bermakna, dan dekat dengan dunia anak-anak.'
  };

  const [profile, setProfile] = useState(defaults);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    getDoc(doc(db, 'site', 'profile')).then(docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(prev => ({
          ...prev,
          name: data.name || prev.name,
          title: data.title || prev.title,
          role: data.role || prev.role,
          email: data.email || prev.email,
          phone: data.phone || prev.phone,
          location: data.location || prev.location,
          bio: data.bio || prev.bio,
          showTiktok: data.showTiktok, tiktokUrl: data.tiktokUrl,
          showYoutube: data.showYoutube, youtubeUrl: data.youtubeUrl,
          showInstagram: data.showInstagram, instagramUrl: data.instagramUrl,
          showLinkedin: data.showLinkedin, linkedinUrl: data.linkedinUrl,
        }));
      }
    }).catch(() => { });

    getDoc(doc(db, 'site', 'skills')).then(docSnap => {
      if (docSnap.exists() && docSnap.data().list) {
        setSkills(docSnap.data().list);
      }
    }).catch(() => { });
  }, []);

  const PILL_GRADIENTS = ['gradient-yellow-lime', 'gradient-sky-mint', 'gradient-blue-mint', 'gradient-lavender-pink', 'gradient-pink-yellow'];

  return (
    <main className="flex-1 relative z-10 p-4 md:p-8">
      <SEO title="Tentang Saya" />
      <div className="max-w-4xl mx-auto flex flex-col gap-10 pb-10">

        {/* ═══ Hero Profile ═══ */}
        <motion.div variants={itemVariants} custom={1} className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Photo */}
          <div className="relative flex-shrink-0">
            {/* Gradient layered offsets */}
            <div className="absolute inset-0 gradient-lavender-pink retro-border rounded-2xl translate-x-3 translate-y-3 shadow-lvl-3"></div>
            <div className="absolute inset-0 gradient-blue-mint retro-border rounded-2xl translate-x-1.5 translate-y-1.5"></div>
            <div className="relative w-40 h-48 retro-border rounded-2xl overflow-hidden bg-retro-white shadow-lvl-2">
              <img src="/profile.png" alt={profile.name} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/160x200/FFF8EC/2D2A26?text=Foto'} />
            </div>
            {/* Floating sticker */}
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [-5, 0, -5] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute -bottom-3 -right-3 sticker bg-retro-lime -rotate-3"
            >
              <Heart weight="fill" size={12} />
              <span className="text-[10px]">Kreator</span>
            </motion.div>
          </div>
          {/* Info */}
          <div className="text-center md:text-left flex-1">
            <div className="inline-block px-4 py-2 bg-retro-dark text-retro-yellow retro-border-thick rounded-full text-xs font-bold shadow-lvl-2 mb-4 -rotate-1">{profile.role}</div>
            <h1 className="font-heading text-3xl md:text-5xl font-bold mb-2 leading-tight tracking-tight">{profile.name}</h1>
            <p className="font-heading text-sm font-bold text-retro-dark/50 mb-4">{profile.title}</p>
            <p className="text-sm text-retro-dark/80 max-w-md leading-relaxed mb-5 mx-auto md:mx-0">
              {profile.bio}
            </p>
            <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
              <span className="retro-pill bg-retro-white px-3.5 py-1.5 flex items-center gap-1.5 text-xs font-bold shadow-lvl-1">
                <MapPin weight="bold" size={14} /> {profile.location}
              </span>
              <span className="retro-pill bg-retro-white px-3.5 py-1.5 flex items-center gap-1.5 text-xs font-bold shadow-lvl-1">
                <EnvelopeSimple weight="bold" size={14} /> {profile.email}
              </span>
              <span className="retro-pill bg-retro-white px-3.5 py-1.5 flex items-center gap-1.5 text-xs font-bold shadow-lvl-1">
                <Phone weight="bold" size={14} /> {profile.phone}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ═══ Pendidikan & Pengalaman Grid ═══ */}
        <RevealSection className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Pendidikan */}
          <motion.div variants={itemVariants} custom={2} className="retro-card-feature p-6 bg-noise">
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 gradient-yellow-lime retro-border rounded-xl flex items-center justify-center shadow-lvl-1">
                  <GraduationCap size={16} weight="bold" />
                </div>
                <h2 className="font-heading text-base font-bold">Pendidikan</h2>
              </div>
              <div className="relative pl-6 flex flex-col gap-7">
                {/* Gradient connecting line */}
                <div className="absolute left-0 top-2 bottom-0 w-[2.5px]" style={{ background: 'linear-gradient(to bottom, #FFD56B, #B8CCE2, #B5D8B0)' }}></div>

                {[
                  { year: '2025', school: 'Pendidikan Profesi Guru', place: 'Universitas Muhammadiyah Prof. Dr. Hamka', color: 'bg-retro-yellow' },
                  { year: '2017 – 2021', school: 'Sarjana Pendidikan Guru Sekolah Dasar (PGSD)', place: 'Universitas Sultan Ageng Tirtayasa', color: 'bg-retro-blue' },
                  { year: '2014 – 2017', school: 'Jurusan Rekayasa Perangkat Lunak (RPL)', place: 'SMK Negeri 4 Pandeglang', color: 'bg-retro-mint' },
                ].map((edu, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute left-[-27px] top-[6px] w-[12px] h-[12px] rounded-full border-[2.5px] border-retro-dark ${edu.color} z-10 shadow-lvl-1`}></div>
                    <span className="text-[10px] font-bold text-retro-dark/40 block mb-1 font-heading">{edu.year}</span>
                    <h3 className="font-heading text-sm font-bold leading-tight">{edu.school}</h3>
                    <p className="text-[11px] text-retro-dark/50">{edu.place}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Pengalaman */}
          <motion.div variants={itemVariants} custom={3} className="retro-card-feature p-6 bg-noise">
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 gradient-sky-mint retro-border rounded-xl flex items-center justify-center shadow-lvl-1">
                  <Star size={16} weight="bold" />
                </div>
                <h2 className="font-heading text-base font-bold">Pengalaman</h2>
              </div>
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="gradient-lavender-pink retro-border rounded-full px-3 py-0.5 text-[9px] font-bold shadow-lvl-1">2022 – Sekarang</span>
                </div>
                <h3 className="font-heading text-sm font-bold">Guru Kelas / Wali Kelas</h3>
                <p className="text-[11px] text-retro-dark/50 mb-4">SD Negeri Pasirmae 1</p>
              </div>
              <ul className="flex flex-col gap-3.5">
                {[
                  { emoji: '📈', bg: 'gradient-yellow-lime', text: <><strong>+18%</strong> peningkatan kemampuan <strong>Calistung</strong> (Baca Tulis Hitung) melalui metode pembelajaran menyenangkan.</> },
                  { emoji: '💻', bg: 'gradient-blue-mint', text: <>Digitalisasi ADM Kelas & Pembuatan <strong>Modul Tematik</strong> yang memperkaya literasi dasar anak.</> },
                  { emoji: '🎮', bg: 'gradient-lavender-pink', text: <><strong>10+</strong> media ajar interaktif & simulasi gamifikasi — partisipasi aktif anak SD naik <strong>hingga 90%</strong>.</> },
                  { emoji: '📋', bg: 'gradient-hotpink-yellow', text: <>Mengelola asesmen dan pendekatan karakter untuk <strong>30+ siswa kelas dasar</strong> per tahun ajaran.</> },
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className={`mt-0.5 w-7 h-7 ${item.bg} retro-border rounded-lg flex-shrink-0 flex items-center justify-center text-[11px] font-bold shadow-lvl-1`}>{item.emoji}</span>
                    <p className="text-[11px] leading-relaxed text-retro-dark/70">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </RevealSection>

        {/* ═══ Skills ═══ */}
        <RevealSection>
          <div className="retro-card-feature p-6 bg-noise">
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 gradient-lavender-pink retro-border rounded-xl flex items-center justify-center shadow-lvl-1">
                  <Code size={16} weight="bold" />
                </div>
                <h2 className="font-heading text-lg font-bold">Keahlian</h2>
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="ml-auto sticker bg-retro-lime text-[10px] hidden md:flex"
                >
                  <Sparkle weight="fill" size={12} /> Fast Learner
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-6">
                {[
                  { emoji: '📚', title: 'Modul Tematik SD', desc: 'Terampil menyusun LKPD, modul calistung, dan media ajar interaktif untuk anak usia dasar.', gradient: 'gradient-yellow-lime' },
                  { emoji: '🎮', title: 'LMS & Gamifikasi Anak', desc: 'Memanfaatkan kuis interaktif (Quizizz, Kahoot) dengan pendekatan visual yang ramah anak.', gradient: 'gradient-sky-mint' },
                  { emoji: '💼', title: 'Administrasi Kelas', desc: 'Manajemen data kelas, rapor Kurikulum Merdeka, dan pengelolaan asesmen formatif.', gradient: 'gradient-blue-mint' },
                  { emoji: '🎨', title: 'Desain Edukatif', desc: 'Menciptakan ilustrasi dan visual pembelajaran ceria menggunakan Canva dan Adobe Illustrator.', gradient: 'gradient-lavender-pink' },
                ].map((skill, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -3, x: i % 2 === 0 ? -1 : 1 }}
                    className={`${skill.gradient} p-4 rounded-xl retro-border shadow-lvl-1 hover:shadow-lvl-2 transition-all duration-200`}
                  >
                    <h4 className="font-heading text-xs font-bold mb-1.5">{skill.emoji} {skill.title}</h4>
                    <p className="text-[10px] text-retro-dark/60 leading-relaxed">{skill.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? skills.map((skill, i) => (
                  <motion.span
                    key={i}
                    whileHover={{ y: -2, scale: 1.05 }}
                    className={`retro-pill ${PILL_GRADIENTS[i % PILL_GRADIENTS.length]} px-3.5 py-1.5 text-[11px] font-bold`}
                  >{skill}</motion.span>
                )) : (
                  <>
                    {['🇮🇩 Bahasa Indonesia', '🌍 Bahasa Sunda', '🇬🇧 Inggris Dasar', 'Google Classroom', 'Canva', 'Quizizz', 'Kahoot!', 'MS Office'].map((skill, i) => (
                      <motion.span
                        key={i}
                        whileHover={{ y: -2, scale: 1.05 }}
                        className={`retro-pill ${PILL_GRADIENTS[i % PILL_GRADIENTS.length]} px-3.5 py-1.5 text-[11px] font-bold`}
                      >{skill}</motion.span>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ═══ Media Sosial ═══ */}
        <RevealSection>
          <div className="retro-card-feature p-6 bg-noise">
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 gradient-pink-yellow retro-border rounded-xl flex items-center justify-center shadow-lvl-1">
                  <Heart size={16} weight="bold" />
                </div>
                <h2 className="font-heading text-lg font-bold">Media Sosial</h2>
              </div>
              <div className="flex flex-wrap gap-4">
                {profile.showTiktok && profile.tiktokUrl && (
                  <a href={profile.tiktokUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 retro-pill bg-retro-white px-4 py-2 hover:-translate-y-1 hover:bg-retro-yellow transition-all">
                    <TiktokLogo weight="bold" size={20} /> <span className="text-xs font-bold font-heading">TikTok</span>
                  </a>
                )}
                {profile.showYoutube && profile.youtubeUrl && (
                  <a href={profile.youtubeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 retro-pill bg-retro-white px-4 py-2 hover:-translate-y-1 hover:bg-retro-yellow transition-all">
                    <YoutubeLogo weight="bold" size={20} /> <span className="text-xs font-bold font-heading">YouTube</span>
                  </a>
                )}
                {profile.showInstagram && profile.instagramUrl && (
                  <a href={profile.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 retro-pill bg-retro-white px-4 py-2 hover:-translate-y-1 hover:bg-retro-yellow transition-all">
                    <InstagramLogo weight="bold" size={20} /> <span className="text-xs font-bold font-heading">Instagram</span>
                  </a>
                )}
                {profile.showLinkedin && profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 retro-pill bg-retro-white px-4 py-2 hover:-translate-y-1 hover:bg-retro-yellow transition-all">
                    <LinkedinLogo weight="bold" size={20} /> <span className="text-xs font-bold font-heading">LinkedIn</span>
                  </a>
                )}
                {(!profile.showTiktok && !profile.showYoutube && !profile.showInstagram && !profile.showLinkedin) && (
                  <p className="text-xs text-retro-dark/50 font-bold">Belum ada tautan media sosial yang ditambahkan.</p>
                )}
              </div>
            </div>
          </div>
        </RevealSection>

      </div>
    </main>
  );
}
