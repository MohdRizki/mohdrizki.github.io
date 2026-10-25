// src/data/artikelData.js
// Data artikel statis — tambahkan artikel baru di sini

export const artikelData = [
  {
    id: 1,
    slug: "belajar-react-untuk-pemula",
    title: "Belajar React untuk Pemula: Panduan Lengkap 2024",
    excerpt:
      "React adalah library JavaScript yang paling populer untuk membangun antarmuka pengguna. Artikel ini akan membimbingmu dari nol hingga bisa membuat aplikasi React pertamamu.",
    content: `
<h2>Apa itu React?</h2>
<p>React adalah library JavaScript open-source yang dikembangkan oleh Meta (Facebook) untuk membangun antarmuka pengguna (UI) yang interaktif dan dinamis. React menggunakan pendekatan berbasis komponen, di mana setiap bagian UI dipecah menjadi komponen-komponen kecil yang dapat digunakan ulang.</p>

<h2>Mengapa Belajar React?</h2>
<p>Ada beberapa alasan kuat mengapa React menjadi pilihan utama para developer:</p>
<ul>
  <li><strong>Ekosistem yang Luas</strong> — Ribuan library pendukung tersedia, seperti React Router, Redux, dan banyak lagi.</li>
  <li><strong>Virtual DOM</strong> — React menggunakan Virtual DOM untuk memperbarui UI secara efisien tanpa me-render ulang seluruh halaman.</li>
  <li><strong>Komunitas Besar</strong> — Jutaan developer di seluruh dunia menggunakan React, sehingga mudah menemukan tutorial dan solusi atas masalah.</li>
  <li><strong>Peluang Kerja</strong> — React adalah salah satu skill yang paling dicari oleh perusahaan teknologi.</li>
</ul>

<h2>Konsep Dasar React</h2>

<h3>1. Komponen</h3>
<p>Komponen adalah blok bangunan utama dalam React. Komponen bisa berupa function atau class yang mengembalikan elemen JSX.</p>
<pre><code>function Greeting({ name }) {
  return &lt;h1&gt;Halo, {name}!&lt;/h1&gt;;
}

export default Greeting;</code></pre>

<h3>2. JSX</h3>
<p>JSX (JavaScript XML) adalah sintaks ekstensi untuk JavaScript yang memungkinkan kita menulis HTML di dalam JavaScript. JSX dikompilasi oleh Babel menjadi panggilan React.createElement().</p>

<h3>3. Props</h3>
<p>Props (properties) adalah cara untuk mengirimkan data dari komponen induk ke komponen anak. Props bersifat read-only dan tidak bisa diubah oleh komponen yang menerimanya.</p>

<h3>4. State</h3>
<p>State adalah data yang dimiliki oleh komponen dan dapat berubah dari waktu ke waktu. Ketika state berubah, React secara otomatis me-render ulang komponen tersebut.</p>
<pre><code>import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    &lt;div&gt;
      &lt;p&gt;Count: {count}&lt;/p&gt;
      &lt;button onClick={() => setCount(count + 1)}&gt;Tambah&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>

<h2>Memulai Project React</h2>
<p>Cara paling mudah untuk membuat project React baru adalah dengan menggunakan Vite:</p>
<pre><code>npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev</code></pre>

<h2>Hooks yang Wajib Kamu Ketahui</h2>
<ul>
  <li><strong>useState</strong> — Untuk mengelola state lokal komponen.</li>
  <li><strong>useEffect</strong> — Untuk menjalankan side effects seperti fetch data atau manipulasi DOM.</li>
  <li><strong>useContext</strong> — Untuk mengakses nilai dari React Context tanpa prop drilling.</li>
  <li><strong>useRef</strong> — Untuk menyimpan referensi ke elemen DOM atau nilai yang tidak memicu re-render.</li>
  <li><strong>useMemo &amp; useCallback</strong> — Untuk optimasi performa dengan memoization.</li>
</ul>

<h2>Kesimpulan</h2>
<p>React adalah investasi terbaik untuk karir sebagai frontend developer. Dengan memahami konsep dasar seperti komponen, props, state, dan hooks, kamu sudah siap untuk membangun aplikasi web yang kompleks dan modern. Teruslah berlatih dan jangan takut untuk mengeksplorasi!</p>
    `,
    date: "2024-11-10",
    readTime: 8,
    tags: ["React", "JavaScript", "Frontend", "Web Dev"],
    category: "Teknologi",
    author: "Mohd Rizki",
    thumbnail: null,
  },
  {
    id: 2,
    slug: "tips-produktivitas-belajar-coding",
    title: "10 Tips Produktivitas untuk Belajar Coding Lebih Efektif",
    excerpt:
      "Belajar coding bisa terasa overwhelming jika tidak dilakukan dengan strategi yang tepat. Berikut 10 tips yang akan membantumu belajar lebih efisien dan konsisten.",
    content: `
<h2>Pendahuluan</h2>
<p>Belajar coding adalah perjalanan panjang yang membutuhkan konsistensi, kesabaran, dan strategi yang tepat. Banyak pemula yang menyerah di tengah jalan karena merasa overwhelmed atau tidak tahu harus mulai dari mana. Artikel ini akan membagikan 10 tips yang telah terbukti membantu banyak developer dalam perjalanan belajar mereka.</p>

<h2>1. Tentukan Tujuan yang Jelas</h2>
<p>Sebelum mulai belajar, tentukan dulu tujuanmu. Apakah kamu ingin menjadi web developer, data scientist, atau mobile developer? Tujuan yang jelas akan membantumu memilih materi yang relevan dan tetap fokus.</p>

<h2>2. Buat Jadwal Belajar yang Konsisten</h2>
<p>Konsistensi lebih penting daripada intensitas. Lebih baik belajar 1 jam setiap hari daripada 7 jam hanya di akhir pekan. Buat jadwal yang realistis dan patuhi jadwal tersebut.</p>

<h2>3. Gunakan Teknik Pomodoro</h2>
<p>Teknik Pomodoro adalah metode manajemen waktu yang membagi sesi belajar menjadi interval 25 menit, diikuti istirahat 5 menit. Setiap 4 pomodoro, ambil istirahat lebih panjang (15-30 menit). Metode ini terbukti meningkatkan fokus dan mencegah kelelahan mental.</p>

<h2>4. Belajar dengan Membuat Project</h2>
<p>Jangan hanya membaca atau menonton tutorial — langsung praktek dengan membuat project nyata. Project-based learning adalah cara paling efektif untuk mengingat konsep dan membangun portofolio.</p>

<h2>5. Jangan Takut Googling</h2>
<p>Googling adalah skill yang sangat penting bagi developer. Bahkan developer berpengalaman pun sering googling. Yang penting adalah kamu tahu apa yang harus dicari dan bagaimana mengevaluasi hasilnya.</p>

<h2>6. Bergabung dengan Komunitas</h2>
<p>Bergabunglah dengan komunitas developer seperti forum online, grup Discord, atau komunitas lokal. Kamu bisa mendapatkan bantuan ketika stuck, belajar dari pengalaman orang lain, dan membangun network.</p>

<h2>7. Dokumentasikan Perjalanan Belajarmu</h2>
<p>Tulis apa yang kamu pelajari dalam bentuk catatan atau blog. Menulis membantu memperkuat pemahaman dan catatan tersebut bisa berguna di masa depan ketika kamu lupa.</p>

<h2>8. Review Kode Orang Lain</h2>
<p>Baca dan analisis kode dari developer berpengalaman di GitHub atau open-source projects. Ini adalah cara yang bagus untuk belajar best practices dan pola desain yang baik.</p>

<h2>9. Istirahat yang Cukup</h2>
<p>Otak membutuhkan waktu untuk memproses informasi baru selama tidur. Jangan begadang untuk belajar — pastikan kamu tidur cukup setiap malam. Istirahat yang cukup justru meningkatkan produktivitas dan kemampuan belajar.</p>

<h2>10. Rayakan Pencapaian Kecil</h2>
<p>Jangan hanya fokus pada tujuan akhir. Rayakan setiap pencapaian kecil, seperti berhasil membuat fitur baru atau memahami konsep yang sebelumnya sulit. Ini akan menjaga motivasimu tetap tinggi.</p>

<h2>Kesimpulan</h2>
<p>Belajar coding adalah maraton, bukan sprint. Dengan menerapkan 10 tips di atas, kamu akan bisa belajar lebih efektif, konsisten, dan menikmati prosesnya. Ingat, setiap expert pernah menjadi pemula. Yang membedakan mereka adalah konsistensi dan kemauan untuk terus belajar.</p>
    `,
    date: "2024-12-05",
    readTime: 6,
    tags: ["Produktivitas", "Tips", "Belajar", "Coding"],
    category: "Pendidikan",
    author: "Mohd Rizki",
    thumbnail: null,
  },
  {
    id: 3,
    slug: "tailwind-css-panduan-cepat",
    title: "Tailwind CSS: Panduan Cepat untuk Memulai",
    excerpt:
      "Tailwind CSS adalah utility-first CSS framework yang memungkinkan kamu membangun desain custom tanpa meninggalkan HTML. Pelajari cara menggunakannya dalam panduan cepat ini.",
    content: `
<h2>Apa itu Tailwind CSS?</h2>
<p>Tailwind CSS adalah utility-first CSS framework yang menyediakan class-class kecil (utility classes) yang bisa dikombinasikan langsung di HTML untuk membangun desain apapun tanpa perlu menulis CSS custom. Berbeda dengan framework seperti Bootstrap yang menyediakan komponen siap pakai, Tailwind memberikan kebebasan penuh untuk membuat desain unik.</p>

<h2>Mengapa Memilih Tailwind CSS?</h2>
<ul>
  <li><strong>Tidak Perlu Berpindah File</strong> — Style langsung ditulis di HTML/JSX, tidak perlu bolak-balik ke file CSS.</li>
  <li><strong>Ukuran Bundle Kecil</strong> — Tailwind hanya menyertakan class yang benar-benar digunakan (PurgeCSS bawaan).</li>
  <li><strong>Konsistensi Desain</strong> — Design system bawaan yang konsisten untuk spacing, warna, tipografi, dll.</li>
  <li><strong>Responsive Design Mudah</strong> — Prefix seperti sm:, md:, lg: memudahkan responsive design.</li>
  <li><strong>Dark Mode</strong> — Dukungan dark mode bawaan dengan prefix dark:.</li>
</ul>

<h2>Instalasi Tailwind CSS di Project Vite</h2>
<pre><code># Install dependencies
npm install -D tailwindcss postcss autoprefixer

# Inisialisasi konfigurasi
npx tailwindcss init -p</code></pre>

<p>Kemudian konfigurasi file <code>tailwind.config.js</code>:</p>
<pre><code>/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}</code></pre>

<p>Tambahkan directive Tailwind di file CSS utama:</p>
<pre><code>@tailwind base;
@tailwind components;
@tailwind utilities;</code></pre>

<h2>Utility Classes yang Paling Sering Digunakan</h2>

<h3>Layout &amp; Flexbox</h3>
<pre><code>&lt;div class="flex items-center justify-between gap-4"&gt;
  &lt;div class="flex-1"&gt;Kolom 1&lt;/div&gt;
  &lt;div class="flex-1"&gt;Kolom 2&lt;/div&gt;
&lt;/div&gt;</code></pre>

<h3>Grid</h3>
<pre><code>&lt;div class="grid grid-cols-3 gap-6"&gt;
  &lt;div&gt;Item 1&lt;/div&gt;
  &lt;div&gt;Item 2&lt;/div&gt;
  &lt;div&gt;Item 3&lt;/div&gt;
&lt;/div&gt;</code></pre>

<h3>Spacing</h3>
<pre><code>&lt;!-- Padding dan Margin --&gt;
&lt;div class="p-4 m-2"&gt;Semua sisi&lt;/div&gt;
&lt;div class="px-6 py-3"&gt;Horizontal &amp; Vertikal&lt;/div&gt;
&lt;div class="pt-4 pb-2 pl-6 pr-8"&gt;Individual&lt;/div&gt;</code></pre>

<h3>Tipografi</h3>
<pre><code>&lt;h1 class="text-4xl font-bold text-gray-900"&gt;Judul Besar&lt;/h1&gt;
&lt;p class="text-base font-normal text-gray-600 leading-relaxed"&gt;
  Paragraf biasa
&lt;/p&gt;</code></pre>

<h3>Responsive Design</h3>
<pre><code>&lt;!-- Mobile-first approach --&gt;
&lt;div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"&gt;
  &lt;!-- Kolom berubah sesuai ukuran layar --&gt;
&lt;/div&gt;</code></pre>

<h2>Custom Design System dengan Tailwind</h2>
<p>Tailwind memudahkan pembuatan design system kustom melalui konfigurasi <code>tailwind.config.js</code>:</p>
<pre><code>export default {
  theme: {
    extend: {
      colors: {
        'brand-yellow': '#FFD700',
        'brand-dark': '#1a1a1a',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'retro': '4px 4px 0px #000000',
      }
    },
  },
}</code></pre>

<h2>Tips dan Best Practices</h2>
<ul>
  <li>Gunakan <code>@apply</code> di CSS untuk mengekstrak class yang sering diulang menjadi komponen CSS.</li>
  <li>Manfaatkan Tailwind IntelliSense extension di VS Code untuk autocomplete.</li>
  <li>Baca dokumentasi official Tailwind — sangat lengkap dan mudah dipahami.</li>
  <li>Gunakan Tailwind UI atau Headless UI untuk komponen yang lebih kompleks.</li>
</ul>

<h2>Kesimpulan</h2>
<p>Tailwind CSS adalah alat yang powerful untuk membangun UI yang cantik dan konsisten dengan cepat. Meskipun pada awalnya terasa asing dengan banyaknya class, setelah terbiasa kamu akan merasakan betapa produktifnya bekerja dengan Tailwind. Coba mulai dengan project kecil dan rasakan sendiri perbedaannya!</p>
    `,
    date: "2025-01-15",
    readTime: 7,
    tags: ["Tailwind CSS", "CSS", "Frontend", "Design"],
    category: "Teknologi",
    author: "Mohd Rizki",
    thumbnail: null,
  },
];

export const getAllTags = () => {
  const tagSet = new Set();
  artikelData.forEach((artikel) => {
    artikel.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet);
};

export const getArtikelBySlug = (slug) => {
  return artikelData.find((a) => a.slug === slug) || null;
};

export const getRelatedArtikels = (currentId, tags, limit = 2) => {
  return artikelData
    .filter(
      (a) => a.id !== currentId && a.tags.some((t) => tags.includes(t))
    )
    .slice(0, limit);
};
