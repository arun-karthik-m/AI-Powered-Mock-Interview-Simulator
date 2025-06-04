const express = require("express");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require("dotenv").config();

const app = express();
app.use(express.json());

app.post("/api/geminiProxy", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });
  
  // Add basic input validation
  const isGibberish = !prompt.split(' ').some(word => 
    word.length > 2 && /^[a-zA-Z]+$/.test(word)
  );
  
  if (isGibberish) {
    return res.json({
      result: JSON.stringify({
        scores: {
          clarity: 0,
          relevance: 0,
          confidence: 0,
          grammar: 0,
          overall: 0
        },
        feedback: {
          tone: "Invalid",
          strengths: [],
          improvements: ["Response contains no valid words or sentences"],
          suggestion: "Please provide a real answer using proper English words and sentences"
        }
      })
    });
  }

  try {
    const apiKey = process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Gemini API key not set in environment." });
    const apiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: prompt
            }] 
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
          },
        }),
      }
    );
    const data = await apiRes.json();
    if (!apiRes.ok) return res.status(apiRes.status).json({ error: data.error || data });
    // Gemini's response structure
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend proxy listening on http://localhost:${PORT}`);
});
