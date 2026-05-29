export default async function handler(req, res) {
    // 1. Mengizinkan CORS agar HTML bisa berkomunikasi dengan Vercel
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: { message: 'Method tidak diizinkan' } });
    }

    try {
        const { pesan } = req.body;
        
        // Memanggil API Key dari Vercel Environment Variables
        const apiKey = process.env.GEMINI_API_KEY; 
        
        if (!apiKey) {
            return res.status(500).json({ error: { message: "GEMINI_API_KEY belum diatur di Vercel Settings!" } });
        }

        // Menggunakan alias -latest agar pasti ditemukan oleh sistem Google
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        const googleRes = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: pesan }] }]
            })
        });

        const data = await googleRes.json();
        
        // Jika dari Google sudah error, langsung lempar ke depan
        if (!googleRes.ok) {
            return res.status(googleRes.status).json(data);
        }
        
        // Sukses, kembalikan balasan AI ke HTML
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: { message: 'Vercel Server Error: ' + error.message } });
    }
}
