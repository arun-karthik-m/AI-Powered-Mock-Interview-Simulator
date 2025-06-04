import { faker } from '@faker-js/faker';
import { generateInterviewQuestion } from './geminiService';

// Mock job roles
export const jobRoles = [
  { id: 1, title: 'Software Engineer', level: 'Entry Level' },
  { id: 2, title: 'Data Scientist', level: 'Mid Level' },
  { id: 3, title: 'Product Manager', level: 'Senior Level' },
  { id: 4, title: 'Frontend Developer', level: 'Entry Level' },
  { id: 5, title: 'Backend Developer', level: 'Mid Level' },
  { id: 6, title: 'Data Analyst', level: 'Senior Level' },
  { id: 7, title: 'UX Designer', level: 'Entry Level' },
  { id: 8, title: 'Project Manager', level: 'Mid Level' },
  { id: 9, title: 'DevOps Engineer', level: 'Senior Level' },
  { id: 10, title: 'QA Engineer', level: 'Entry Level' },
];

// Cache for storing generated questions
const questionCache = new Map<string, { questions: string[], timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour cache duration

// Utility to extract only the actual question text from a raw LLM response
export function extractQuestionText(raw: string): string {
  // Remove leading explanations, e.g., 'A good interview question for ... would be:'
  let cleaned = raw.replace(/^.*?\*\*([^"]+)\*\*/s, '$1');
  // Try to extract text after '**Question:**' or 'Question:'
  const questionRegex = /\*\*Question:\*\*|Question:/i;
  const match = cleaned.match(questionRegex);
  if (match) {
    // Get everything after the match
    const after = cleaned.slice(match.index! + match[0].length).trim();
    // Stop at next double newline, '**', or '**Why', etc.
    const endIdx = after.search(/(\n\n|\*\*|\*\*Why|\*\*What|\*\*Follow|\*\*Answer)/i);
    return (endIdx !== -1 ? after.slice(0, endIdx) : after).trim().replace(/^\*+|\*+$/g, '');
  }
  // Otherwise, fallback: remove any explanations and extract quoted question
  const quoted = cleaned.match(/"([^"]+)"/);
  if (quoted) return quoted[1].trim();
  // Fallback: remove any '**Why', '**What', '**Follow', '**Answer'
  const fallback = cleaned.split(/\*\*Why|\*\*What|\*\*Follow|\*\*Answer/i)[0];
  // Remove leading/trailing quotes and asterisks
  return fallback.trim().replace(/^\*+|\*+$/g, '').replace(/^"|"$/g, '');
}

// Generate questions using Gemini LLM with caching and optimized concurrent requests
export async function getQuestions(roleId: number, resumeText: string = ''): Promise<string[]> {
  const cacheKey = `${roleId}-${resumeText.slice(0, 50)}`; // Use first 50 chars of resume for cache key
  const now = Date.now();
  const cached = questionCache.get(cacheKey);

  // Return cached questions if they exist and are not expired
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.questions;
  }

  const prompt = `Generate a list of 7 unique, non-repetitive interview questions for the role of ${jobRoles.find(r => r.id === roleId)?.title || 'the role'}. Each question should be distinct and not overlap in topic or wording. Only return the questions as a numbered list, no explanations or extra text.`;
  const timeout = 20000;

  try {
    const result = await Promise.race([
      generateInterviewQuestion(prompt),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout))
    ]);
    // Extract questions from numbered list
    const questions = String(result)
      .split(/\n|\r/)
      .map(line => line.replace(/^\d+\.|^-|•/,'').trim())
      .filter(q => q.length > 0);
    // Remove duplicates and only take the first 5
    const uniqueQuestions = Array.from(new Set(questions)).slice(0, 5);
    // If we have fewer than 5, fill with fallback questions
    if (uniqueQuestions.length < 5) {
      const fallbackQuestions = [
        'Tell me about your background and experience.',
        'What are your strengths and weaknesses?',
        'Why are you interested in this role?',
        'Describe a challenging project you worked on.',
        'Where do you see yourself in 5 years?'
      ];
      uniqueQuestions.push(...fallbackQuestions.filter(q => !uniqueQuestions.includes(q)));
    }
    questionCache.set(cacheKey, { questions: uniqueQuestions, timestamp: now });
    return uniqueQuestions;
  } catch (error) {
    // On error, return fallback questions
    return [
      'Tell me about your background and experience.',
      'What are your strengths and weaknesses?',
      'Why are you interested in this role?',
      'Describe a challenging project you worked on.',
      'Where do you see yourself in 5 years?'
    ];
  }
}

// Extract text from resume (keep as is for now, but remove mock comment)
export async function extractResumeText(file: File): Promise<string> {
  // TODO: Implement actual resume text extraction
  return '';
}

// Cache for storing feedback
const feedbackCache = new Map<string, { feedback: any, timestamp: number }>();

// Generate feedback using Gemini with caching and optimized prompts
export async function generateFeedback(question: string, answer: string, roleId: number): Promise<any> {
  const cacheKey = `${question}-${answer}-${roleId}`;
  const now = Date.now();
  const cached = feedbackCache.get(cacheKey);

  // Return cached feedback if it exists and is not expired
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.feedback;
  }

  // Compose a detailed prompt for a single answer
  const role = jobRoles.find(r => r.id === roleId)?.title || 'the role';
  const prompt = `You are an expert interviewer. Analyze the following answer for the ${role} position. Use a friendly, direct tone and address the candidate as 'you'. Grade the answer on clarity, relevance, confidence, and grammar out of 10 (not percent). Then give an overall score out of 10 for just this answer. Summarize your key strengths, areas for improvement, and an actionable suggestion (all written to the candidate as 'you').\n\nQuestion: ${question}\nAnswer: ${answer}\n\nFormat:\nClarity: x/10\nRelevance: x/10\nConfidence: x/10\nGrammar: x/10\nOverall Score: x/10\n\nStrengths:\n- ...\n\nAreas for Improvement:\n- ...\n\nSuggestion (addressed to you):\n...`;

  try {
    const feedbackText = await Promise.race([
      generateInterviewQuestion(prompt),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Feedback timeout')), 20000))
    ]);
    // Clean up AI's perspective to "you"
    const cleanedFeedbackText = String(feedbackText)
      .replace(/the candidate/gi, 'you')
      .replace(/The candidate/gi, 'You');
    // Extract scores and feedback
    const scores = extractScoresFromText(cleanedFeedbackText);
    const structuredFeedback = extractStructuredFeedback(cleanedFeedbackText);
    const feedback = {
      feedback: cleanedFeedbackText,
      scores,
      structuredFeedback
    };
    feedbackCache.set(cacheKey, { feedback, timestamp: now });
    return feedback;
  } catch (error) {
    console.error('Error generating feedback:', error);
    // Add toast or logging for fallback
    if (typeof window !== 'undefined') {
      window.alert('Gemini API fallback used: ' + error);
    }
    return {
      feedback: 'Thank you for your response. The feedback system is currently experiencing high load. Please try again shortly.',
      scores: { clarity: 7, relevance: 7, confidence: 7, grammar: 7, overall: 7, sentiment: 'neutral' },
      structuredFeedback: {
        strengths: ['You participated in the interview process'],
        weaknesses: ['Continue practicing your interview responses'],
        suggestion: 'Prepare more examples of your past experiences.'
      }
    };
  }
}

// Enhanced score extraction: handles more formats
function extractScoresFromText(text: string): {
  clarity: number;
  relevance: number;
  confidence: number;
  grammar: number;
  overall: number;
  sentiment: 'positive' | 'neutral' | 'negative';
} {
  let scores = {
    clarity: 0,
    relevance: 0,
    confidence: 0,
    grammar: 0,
    overall: 0,
    sentiment: 'neutral' as 'positive' | 'neutral' | 'negative',
  };
  try {
    // Try to match scores in multiple formats
    // Support e.g. "Clarity: 8/10", "Relevance: 7/10", "Confidence: 9/10", "Grammar: 8/10"
    const tenScale = (label: string) => {
      const match = text.match(new RegExp(label + ":\\s*(\\d+(?:\\.\\d+)?)\\s*/\\s*10", 'i'));
      return match ? Math.round(parseFloat(match[1])) : undefined;
    };
    // Try 10 scale first
    scores.clarity = tenScale('Clarity') ?? scores.clarity;
    scores.relevance = tenScale('Relevance') ?? scores.relevance;
    scores.confidence = tenScale('Confidence') ?? scores.confidence;
    scores.grammar = tenScale('Grammar') ?? scores.grammar;
    scores.overall = tenScale('Overall Score') ?? scores.overall;
    // Try 5 scale fallback
    const getScore = (label: string) => {
      const match = text.match(new RegExp(label + ":\\s*(\\d+(?:\\.\\d+)?)\\s*/\\s*5", 'i'));
      return match ? Math.round((parseFloat(match[1]) / 5) * 10) : undefined;
    };
    scores.clarity = getScore('Knowledge/?Skills') ?? scores.clarity;
    scores.relevance = getScore('Problem/?Solving') ?? scores.relevance;
    scores.confidence = getScore('Communication') ?? scores.confidence;
    scores.overall = getScore('Overall') ?? scores.overall;
    // Try to extract overall score from phrases like "Overall Score: 9/10" or "Scoring: Overall Score: 9/10"
    const overallMatch = text.match(/Overall Score:\s*(\d+(?:\.\d+)?)\s*\/\s*10/i);
    if (overallMatch) {
      scores.overall = Math.round(parseFloat(overallMatch[1]));
    }
    // If only overall is present, use it for all
    if (scores.overall && !scores.clarity && !scores.relevance && !scores.confidence) {
      scores.clarity = scores.relevance = scores.confidence = scores.overall;
    }
    // If all scores are still 0 but strengths/weaknesses exist, default to 8
    if (scores.clarity === 0 && /Strengths:/i.test(text)) scores.clarity = 8;
    if (scores.relevance === 0 && /Strengths:/i.test(text)) scores.relevance = 8;
    if (scores.confidence === 0 && /Strengths:/i.test(text)) scores.confidence = 8;
    if (scores.grammar === 0 && /Strengths:/i.test(text)) scores.grammar = 8;
    if (scores.overall === 0 && /Strengths:/i.test(text)) scores.overall = 8;
    // Grammar: penalize if answer contains "I don't know" or similar
    if (/don't know|do not know|no idea|not sure/i.test(text)) {
      scores.grammar = 2;
    }
    // Sentiment
    if (/very poor|unacceptable|requires significant improvement|lack of preparedness|no knowledge/i.test(text)) {
      scores.sentiment = 'negative';
    } else if (/good|excellent|well done|strong|positive/i.test(text)) {
      scores.sentiment = 'positive';
    } else {
      scores.sentiment = 'neutral';
    }
  } catch (error) {
    console.error('Error parsing scores:', error);
  }
  return scores;
}

// Structured feedback extraction with suggestion as a paragraph
export function extractStructuredFeedback(text: string): {
  strengths: string[];
  weaknesses: string[];
  suggestion: string;
} {
  // Remove markdown
  let cleaned = text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1');
  // Extract sections
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  let suggestion = '';

  // Strengths
  const strengthsMatch = cleaned.match(/Strengths:(.*?)(Weaknesses:|Areas for Improvement:|Actionable Advice:|Recommendations:|$)/is);
  if (strengthsMatch) {
    // Only split on newlines or numbered/bulleted list, not on every period or dash
    strengths.push(...strengthsMatch[1].split(/\n|\r|\d+\.|\u2022|\*/).map(s => s.trim()).filter(Boolean));
  }
  // Weaknesses
  const weaknessesMatch = cleaned.match(/Weaknesses:(.*?)(Actionable Advice:|Recommendations:|$)/is) || cleaned.match(/Areas for Improvement:(.*?)(Actionable Advice:|Recommendations:|$)/is);
  if (weaknessesMatch) {
    weaknesses.push(...weaknessesMatch[1].split(/\n|\r|\d+\.|\u2022|\*/).map(s => s.trim()).filter(Boolean));
  }
  // Suggestion (Actionable Advice or Recommendations as a paragraph)
  const suggestionMatch = cleaned.match(/Actionable Advice:(.*?)(Strengths:|Weaknesses:|Areas for Improvement:|$)/is) || cleaned.match(/Recommendations?:(.*?)(Strengths:|Weaknesses:|Areas for Improvement:|$)/is);
  if (suggestionMatch) {
    suggestion = suggestionMatch[1].replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  }
  return { strengths, weaknesses, suggestion };
}

// Helper function to clean up feedback text and make it direct
function cleanFeedbackText(text: string): string {
  let cleaned = text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic markdown
    .replace(/The candidate/gi, 'You')
    .replace(/the candidate/gi, 'you')
    .replace(/\n+/g, '\n') // Collapse multiple newlines
    .replace(/\s{2,}/g, ' '); // Collapse extra spaces
  return cleaned.trim();
}

// Cache for storing reports
const reportCache = new Map<string, { report: any, timestamp: number }>();

// Generate report using Gemini with caching and optimized prompts
export async function generateReport(questions: string[], answers: string[], roleId: number) {
  const cacheKey = `${questions.join('-')}-${answers.join('-')}-${roleId}`;
  const now = Date.now();
  const cached = reportCache.get(cacheKey);

  // Return cached report if it exists and is not expired
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.report;
  }

  const role = jobRoles.find(r => r.id === roleId)?.title || 'the role';
  // Compose a detailed prompt with all Q&As for accurate grading
  const prompt = `You are an expert interviewer. Analyze the following interview for the ${role} position. Use a friendly, direct tone and address the candidate as 'you'. For each answer, grade clarity, relevance, confidence, and grammar out of 10 (not percent), then give an overall score out of 10 for the full interview. Summarize your key strengths, areas for improvement, and actionable suggestions (all written to the candidate as 'you').\n\nInterview Q&A:\n${questions.map((q, i) => `Q${i+1}: ${q}\nA${i+1}: ${answers[i]}`).join('\n')}\n\nFormat:\nPerformance Metrics:\nClarity: x/10\nRelevance: x/10\nConfidence: x/10\nGrammar: x/10\nOverall Score: x/10\n\nStrengths:\n- ...\n\nAreas for Improvement:\n- ...\n\nSuggestions (addressed to you):\n...`;

  try {
    const reportText = await Promise.race([
      generateInterviewQuestion(prompt),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Report timeout')), 20000))
    ]);

    // Clean up AI's perspective to "you"
    const cleanedReportText = reportText
      .replace(/the candidate/gi, 'you')
      .replace(/The candidate/gi, 'You');

    // Parse the report text to extract structured data
    const report = {
      strengths: extractListFromText(cleanedReportText, 'strengths'),
      improvements: extractListFromText(cleanedReportText, 'improvements'),
      overallScore: extractOverallScore(cleanedReportText),
      interviewDate: new Date().toISOString(),
      scores: extractScoresFromText(cleanedReportText),
      structuredFeedback: extractStructuredFeedback(cleanedReportText)
    };

    // Cache the report
    reportCache.set(cacheKey, { report, timestamp: now });
    return report;
  } catch (error) {
    console.error('Error generating report:', error);
    return {
      strengths: ['You participated in the interview process'],
      improvements: ['Continue practicing your interview responses'],
      overallScore: 70,
      interviewDate: new Date().toISOString(),
      scores: { clarity: 7, relevance: 7, confidence: 7, grammar: 7, overall: 7, sentiment: 'neutral' },
      structuredFeedback: {
        strengths: ['You participated in the interview process'],
        weaknesses: ['Continue practicing your interview responses'],
        suggestion: 'Prepare more examples of your past experiences.'
      }
    };
  }
}

// Helper function to extract lists from report text
function extractListFromText(text: string, type: 'strengths' | 'improvements'): string[] {
  try {
    const regex = new RegExp(`${type}[:\\s]*((?:[^\n]*\n?)*?)(?=\n\n|$)`, 'i');
    const match = text.match(regex);
    if (match && match[1]) {
      return match[1]
        .split(/\n|\d+\.|-/)
        .map(item => item.trim())
        .filter(item => item.length > 0)
        .slice(0, 3);
    }
  } catch (error) {
    console.error(`Error extracting ${type}:`, error);
  }
  return [type === 'strengths' ? 'Shows potential' : 'Continue practicing'];
}

// Helper function to extract overall score from report text
function extractOverallScore(text: string): number {
  try {
    const match = text.match(/overall[^0-9]*([0-9]+)/i);
    const score = match ? parseInt(match[1]) : 70;
    return score >= 0 && score <= 100 ? score : 70;
  } catch (error) {
    console.error('Error extracting overall score:', error);
    return 70;
  }
}
