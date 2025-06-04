// Gemini 2.5 Pro API integration utility
// Uses the OpenAI API with OpenRouter endpoint for LLM-based interview question generation

// Frontend utility to call the backend proxy for Gemini/OpenRouter

export async function generateInterviewQuestion(prompt: string): Promise<string> {
  const res = await fetch('/api/geminiProxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Unknown error");
  return data.result;
}
