// file: api/chat.js
export default async function handler(req, res) {
    // 1. Mengizinkan CORS (Penting agar tidak diblokir browser)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { pesan } = req.body;
        
        // Panggil apiKey dari Environment Variable Vercel
        const apiKey = process.env.GEMINI_API_KEY; 
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const googleRes = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: pesan }] }]
            })
        });

        const data = await googleRes.json();
        
        // Kembalikan balasan ke HTML
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: 'Server Error', details: error.message });
    }
}
