
import OpenAI from 'openai';

// Initialize the OpenAI client with API key
// In production, this should come from environment variables
const openai = new OpenAI({
  apiKey: 'mock-api-key-for-development', // Replace with actual key in production
  dangerouslyAllowBrowser: true // Only for development purposes
});

// Generate questions based on resume text
export const generateQuestionsFromResume = async (
  resumeText: string,
  jobRole: string,
  experienceLevel: string
): Promise<string[]> => {
  try {
    console.log('Generating questions based on resume for:', jobRole, experienceLevel);
    
    // For demo purposes, we'll use mock data instead of actual API calls
    // In a real implementation with an API key, uncomment this code:
    /*
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert hiring manager for ${jobRole} positions. Generate 5 interview questions for a ${experienceLevel} candidate based on their resume.`
        },
        {
          role: "user",
          content: resumeText || "The candidate has experience in web development."
        }
      ]
    });
    
    // Extract questions from the response
    const content = response.choices[0]?.message?.content;
    if (content) {
      // Parse questions - assuming they're numbered or in a list
      const questions = content.split(/\d+\.|\n-/).filter(q => q.trim().length > 0).map(q => q.trim());
      return questions.slice(0, 5); // Limit to 5 questions
    }
    */
    
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
  feedback: string;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  scores: {
    clarity: number;
    relevance: number;
    confidence: number;
    grammar: number;
  };
  overallScore: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}> => {
  try {
    console.log('Analyzing response for question:', question);
    
    // In a real implementation with an API key, uncomment this code:
    /*
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert interviewer for ${jobRole} positions. Analyze the candidate's answer to this question: "${question}". 
                    Provide detailed feedback on the strengths and areas for improvement. Score the answer on clarity, relevance, confidence, 
                    and grammar on a scale of 1-10. Calculate an overall score out of 100. Determine the sentiment of the answer.`
        },
        {
          role: "user",
          content: answer
        }
      ]
    });
    
    // Extract analysis from the response
    const content = response.choices[0]?.message?.content;
    if (content) {
      // Parse the content to extract feedback, scores, etc.
      // This would require parsing the structured text from GPT
      // For now, we'll use mock data
    }
    */
    
    // Calculate mock scores based on answer length and complexity
    const wordCount = answer.split(/\s+/).length;
    const sentenceCount = answer.split(/[.!?]+/).length;
    const avgWordLength = answer.length / wordCount;
    
    // Generate mock analysis
    const clarity = Math.min(10, Math.max(5, 7 + (sentenceCount > 3 ? 1 : -1)));
    const relevance = Math.min(10, Math.max(5, 7 + (answer.toLowerCase().includes(question.toLowerCase().substring(0, 10)) ? 2 : 0)));
    const confidence = Math.min(10, Math.max(5, 7 + (answer.includes('!') ? 1 : 0)));
    const grammar = Math.min(10, Math.max(6, 8 + (avgWordLength > 5 ? 1 : -1)));
    
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
    
    // Generate overall feedback
    const feedback = `Your answer was ${overallScore >= 80 ? 'well-structured' : 'adequate'} and ${
      sentiment === 'positive' ? 'conveyed confidence' : sentiment === 'negative' ? 'could use more enthusiasm' : 'was delivered in a professional tone'
    }. ${strengths[0]}. You could improve by ${improvements[0].toLowerCase()}.`;
    
    return {
      feedback,
      strengths,
      improvements,
      suggestions,
      scores: {
        clarity,
        relevance,
        confidence,
        grammar
      },
      overallScore,
      sentiment
    };
  } catch (error) {
    console.error('Error analyzing response:', error);
    
    // Return fallback analysis
    return {
      feedback: "Your answer addressed the question, but could benefit from more specific examples.",
      strengths: ['Provided an answer to the question'],
      improvements: ['Could add more specific details'],
      suggestions: ['Use concrete examples from your experience'],
      scores: {
        clarity: 7,
        relevance: 7,
        confidence: 7,
        grammar: 7
      },
      overallScore: 70,
      sentiment: 'neutral'
    };
  }
};
