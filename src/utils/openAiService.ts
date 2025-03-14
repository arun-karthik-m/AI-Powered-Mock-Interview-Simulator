
import OpenAI from 'openai';

// Initialize the OpenAI client with a mock API key
// In production, this should be replaced with a real API key from environment variables
const openai = new OpenAI({
  apiKey: 'mock-api-key-for-development',
  dangerouslyAllowBrowser: true // Only for development purposes
});

// Generate questions based on resume text
export const generateQuestionsFromResume = async (
  resumeText: string,
  jobRole: string,
  experienceLevel: string
): Promise<string[]> => {
  try {
    // For demo purposes, we'll use mock data instead of actual API calls
    console.log('Generating questions based on resume for:', jobRole, experienceLevel);
    
    // In a real implementation, this would call the OpenAI API
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [
    //     {
    //       role: "system",
    //       content: `You are an expert hiring manager for ${jobRole} positions. Generate 5 interview questions for a ${experienceLevel} candidate based on their resume.`
    //     },
    //     {
    //       role: "user",
    //       content: resumeText
    //     }
    //   ]
    // });
    
    // Mock response for demo
    const mockQuestions = [
      `I see you have experience with ${resumeText.includes('React') ? 'React' : 'web development'}. Can you describe a challenging project you worked on?`,
      `How would you approach ${jobRole.toLowerCase().includes('developer') ? 'debugging a complex issue' : 'solving a business problem'}?`,
      `What methodologies or frameworks are you most comfortable with for ${jobRole} tasks?`,
      `Can you tell me about a time when you had to learn a new technology or skill quickly?`,
      `How do you stay updated with the latest trends in ${jobRole.toLowerCase().includes('developer') ? 'technology' : 'your field'}?`
    ];
    
    return mockQuestions;
  } catch (error) {
    console.error('Error generating questions from resume:', error);
    return [];
  }
};

// Analyze interview response
export const analyzeResponse = async (
  question: string,
  answer: string,
  jobRole: string
): Promise<{
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  clarity: number;
  relevance: number;
  confidence: number;
  grammar: number;
  overallScore: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}> => {
  try {
    console.log('Analyzing response for question:', question);
    
    // In a real implementation, this would call the OpenAI API
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [
    //     {
    //       role: "system",
    //       content: `You are an expert interviewer for ${jobRole} positions. Analyze the candidate's answer to this question: "${question}"`
    //     },
    //     {
    //       role: "user",
    //       content: answer
    //     }
    //   ]
    // });
    
    // Calculate mock scores based on answer length and complexity
    const wordCount = answer.split(/\s+/).length;
    const sentenceCount = answer.split(/[.!?]+/).length;
    const avgWordLength = answer.length / wordCount;
    
    // Generate mock analysis
    let clarity = Math.min(10, Math.max(5, 7 + (sentenceCount > 3 ? 1 : -1)));
    let relevance = Math.min(10, Math.max(5, 7 + (answer.toLowerCase().includes(question.toLowerCase().substring(0, 10)) ? 2 : 0)));
    let confidence = Math.min(10, Math.max(5, 7 + (answer.includes('!') ? 1 : 0)));
    let grammar = Math.min(10, Math.max(6, 8 + (avgWordLength > 5 ? 1 : -1)));
    
    // Calculate overall score (0-100)
    const overallScore = Math.min(95, Math.max(60, Math.floor((clarity + relevance + confidence + grammar) / 4 * 10)));
    
    // Determine sentiment
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (wordCount > 50 && avgWordLength > 5) {
      sentiment = 'positive';
    } else if (wordCount < 20) {
      sentiment = 'negative';
    }
    
    // Generate feedback
    const strengths = [
      wordCount > 30 ? 'Provided a comprehensive answer' : 'Answered concisely',
      avgWordLength > 5 ? 'Used professional vocabulary' : 'Used accessible language',
      sentenceCount > 3 ? 'Structured response with multiple points' : 'Focused on a key point'
    ];
    
    const improvements = [
      wordCount < 40 ? 'Could provide more detail in your response' : 'Could be more concise in some areas',
      !answer.toLowerCase().includes(question.toLowerCase().substring(0, 10)) ? 'Ensure your answer directly addresses the question' : 'Further clarify how your experience relates to the question'
    ];
    
    const suggestions = [
      'Consider using the STAR method (Situation, Task, Action, Result) for behavioral questions',
      'Quantify your achievements with specific metrics when possible',
      'Include a brief example to illustrate your point'
    ];
    
    return {
      strengths,
      improvements,
      suggestions,
      clarity,
      relevance,
      confidence,
      grammar,
      overallScore,
      sentiment
    };
  } catch (error) {
    console.error('Error analyzing response:', error);
    
    // Return fallback analysis
    return {
      strengths: ['Provided an answer to the question'],
      improvements: ['Could add more specific details'],
      suggestions: ['Use concrete examples from your experience'],
      clarity: 7,
      relevance: 7,
      confidence: 7,
      grammar: 7,
      overallScore: 70,
      sentiment: 'neutral'
    };
  }
};
