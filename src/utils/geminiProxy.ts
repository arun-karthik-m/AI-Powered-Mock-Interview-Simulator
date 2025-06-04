// This file is now unused in production. The real backend proxy is server.cjs.
// See server.cjs at the project root for the production Gemini proxy logic.

// Optionally, you can remove this file from the codebase if you are only using server.cjs.

// Minimal Node.js/Express-style handler for Vite dev server (can be adapted for production)
// If you're using Vercel/Netlify, rename this file to api/geminiProxy.ts and deploy as a serverless function

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { prompt } = req.body;
  if (!prompt) {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }
  try {
    const apiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.VITE_GEMINI_API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
    if (!apiRes.ok) {
      const err = await apiRes.text();
      res.status(apiRes.status).json({ error: err });
      return;
    }
    const data = await apiRes.json();
    // Gemini's response structure
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.status(200).json({ result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
