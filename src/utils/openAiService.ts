
import OpenAI from 'openai';

// This would ideally be stored in a secure environment variable
// For a production app, this should be managed through Supabase Edge Functions
const openai = new OpenAI({
  apiKey: 'sk-placeholder-key', // Replace with your actual OpenAI API key
  dangerouslyAllowBrowser: true, // Only for demo purposes
});

export interface AnalysisResult {
  confidence: number;
  clarity: number;
  relevance: number;
  grammar: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  overallScore: number;
}

export const analyzeResponse = async (
  question: string,
  answer: string,
  jobRole: string
): Promise<AnalysisResult> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an AI job interview coach. Analyze the candidate's response to the interview question for a ${jobRole} position. 
          Provide scores (1-10) for confidence, clarity, relevance, and grammar. 
          Detect sentiment (positive, neutral, negative). 
          List 2-3 strengths, 2-3 areas for improvement, and 1-2 specific suggestions. 
          Calculate an overall score (0-100).
          Format your response as JSON.`
        },
        {
          role: 'user',
          content: `Question: ${question}\nCandidate's Answer: ${answer}`
        }
      ],
      response_format: { type: 'json_object' },
    });

    // If using in production, validate the response structure
    const resultContent = response.choices[0].message.content;
    if (!resultContent) {
      throw new Error('Failed to get analysis result');
    }

    return JSON.parse(resultContent) as AnalysisResult;
  } catch (error) {
    console.error('Error analyzing response:', error);
    // Return fallback values in case of error
    return {
      confidence: 7,
      clarity: 7,
      relevance: 7,
      grammar: 7,
      sentiment: 'neutral',
      strengths: ['Good attempt at answering the question'],
      improvements: ['Consider providing more specific examples'],
      suggestions: ['Practice structuring your answers using the STAR method'],
      overallScore: 70
    };
  }
};

export const generateQuestionsFromResume = async (
  resume: string,
  jobRole: string,
  level: string
): Promise<string[]> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an AI job interview coach. Generate 5 tailored interview questions for a ${jobRole} ${level} position based on the candidate's resume. The questions should be specific, challenging, and relevant to the position and the candidate's experience.`
        },
        {
          role: 'user',
          content: `Resume content: ${resume}`
        }
      ],
      response_format: { type: 'json_object' },
    });

    const resultContent = response.choices[0].message.content;
    if (!resultContent) {
      throw new Error('Failed to generate questions');
    }

    const parsedContent = JSON.parse(resultContent);
    return parsedContent.questions || [];
  } catch (error) {
    console.error('Error generating questions:', error);
    // Return fallback questions in case of error
    return [
      'Tell me about your background and experience.',
      'What are your strengths and weaknesses?',
      'Why are you interested in this position?',
      'Describe a challenging situation you faced at work and how you handled it.',
      'Where do you see yourself in 5 years?'
    ];
  }
};
