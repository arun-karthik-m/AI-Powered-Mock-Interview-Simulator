
import { supabase } from './supabase';
import { analyzeResponse, generateQuestionsFromResume } from './openAiService';

// Sample data for the interview simulator
// In a real app, this would be fetched from an API

// Job role data
export const jobRoles = [
  { id: 1, title: 'Software Developer', level: 'Entry Level' },
  { id: 2, title: 'Software Developer', level: 'Mid Level' },
  { id: 3, title: 'Software Developer', level: 'Senior Level' },
  { id: 4, title: 'Product Manager', level: 'Entry Level' },
  { id: 5, title: 'Product Manager', level: 'Mid Level' },
  { id: 6, title: 'Product Manager', level: 'Senior Level' },
  { id: 7, title: 'UX Designer', level: 'Entry Level' },
  { id: 8, title: 'UX Designer', level: 'Mid Level' },
  { id: 9, title: 'UX Designer', level: 'Senior Level' },
  { id: 10, title: 'Data Scientist', level: 'Entry Level' },
  { id: 11, title: 'Data Scientist', level: 'Mid Level' },
  { id: 12, title: 'Data Scientist', level: 'Senior Level' },
];

// Sample questions bank
const questionsBank = {
  // Software Developer Questions
  1: [
    'Tell me about your programming experience and the languages you are most comfortable with.',
    'Explain a project you worked on and the technologies you used.',
    'How do you approach debugging a complex problem?',
    'What development methodologies are you familiar with?',
    'How do you stay updated with the latest technologies and programming practices?'
  ],
  2: [
    'Describe a challenging technical problem you solved recently.',
    'How do you ensure code quality in your projects?',
    'Explain your experience with version control systems.',
    'Tell me about your experience with code reviews and collaboration.',
    'How do you handle technical disagreements with team members?'
  ],
  3: [
    'Describe your experience leading development teams or mentoring junior developers.',
    'How do you approach system architecture decisions?',
    'Tell me about a time when you improved a significant aspect of a codebase.',
    'How do you balance technical debt with new feature development?',
    'Explain how you evaluate new technologies for potential adoption.'
  ],
  // Product Manager Questions
  4: [
    'What interests you about product management?',
    'How do you understand user needs?',
    'Describe your experience working with development teams.',
    'How do you prioritize features?',
    'Tell me about a product you admire and why.'
  ],
  // Add more questions for other roles...
  // Default questions if role not found
  default: [
    'Tell me about yourself and your background.',
    'Why are you interested in this role?',
    'What are your greatest professional strengths?',
    'What do you consider to be your weaknesses?',
    'Where do you see yourself in 5 years?'
  ]
};

// Get questions from questions bank or generate them if resume is provided
export const getQuestions = async (roleId: number, resumeText?: string): Promise<string[]> => {
  // If resume is provided, generate custom questions
  if (resumeText) {
    try {
      const role = jobRoles.find(r => r.id === roleId);
      if (!role) throw new Error('Role not found');
      
      const generatedQuestions = await generateQuestionsFromResume(
        resumeText,
        role.title,
        role.level
      );
      
      if (generatedQuestions.length >= 5) {
        return generatedQuestions.slice(0, 5);
      }
      
      // If not enough generated questions, merge with default questions
      const defaultQuestions = questionsBank[roleId as keyof typeof questionsBank] || questionsBank.default;
      return [...generatedQuestions, ...defaultQuestions].slice(0, 5);
    } catch (error) {
      console.error('Error generating questions from resume:', error);
    }
  }
  
  // Return pre-defined questions if no resume or error
  return questionsBank[roleId as keyof typeof questionsBank] || questionsBank.default;
};

// Generate feedback using AI analysis
export const generateFeedback = async (question: string, answer: string, roleId: number) => {
  try {
    const role = jobRoles.find(r => r.id === roleId);
    if (!role) throw new Error('Role not found');
    
    const jobRoleTitle = `${role.title} - ${role.level}`;
    
    // Get AI-generated analysis
    const analysis = await analyzeResponse(question, answer, jobRoleTitle);
    
    // Format feedback items
    const feedbackItems = [
      ...analysis.strengths.map(content => ({ 
        type: 'strength' as const, 
        content 
      })),
      ...analysis.improvements.map(content => ({ 
        type: 'improvement' as const, 
        content 
      })),
      ...analysis.suggestions.map(content => ({ 
        type: 'suggestion' as const, 
        content 
      }))
    ];
    
    // Create scores object
    const scores = {
      clarity: analysis.clarity,
      relevance: analysis.relevance,
      confidence: analysis.confidence,
      grammar: analysis.grammar,
      overall: analysis.overallScore,
      sentiment: analysis.sentiment
    };
    
    // Save interview feedback to Supabase if needed
    // await supabase.from('interview_feedback').insert({ question, answer, feedback: feedbackItems, scores });
    
    return {
      feedback: feedbackItems,
      scores
    };
  } catch (error) {
    console.error('Error generating feedback:', error);
    
    // Return fallback feedback if AI analysis fails
    return {
      feedback: [
        {
          type: 'strength',
          content: 'You provided a response to the question.'
        },
        {
          type: 'improvement',
          content: 'Consider adding more specific examples to strengthen your answer.'
        },
        {
          type: 'suggestion',
          content: 'Structure your response using the STAR method (Situation, Task, Action, Result).'
        }
      ],
      scores: {
        clarity: 7,
        relevance: 7,
        confidence: 7,
        grammar: 8,
        overall: 75,
        sentiment: 'neutral'
      }
    };
  }
};

// Generate final report after interview
export const generateReport = async (questions: string[], answers: string[], roleId: number) => {
  // For a real implementation, this would use AI to analyze all answers collectively
  
  const strengths = [
    'Provided clear, concise answers to most questions',
    'Demonstrated strong technical knowledge',
    'Used specific examples to illustrate points'
  ];
  
  const improvements = [
    'Could provide more quantifiable achievements',
    'Consider shorter responses for some questions',
    'Add more details about teamwork and collaboration'
  ];
  
  // Calculate overall score based on answer patterns
  let totalScore = 0;
  const minScore = 60;
  const maxScore = 95;
  
  // Check for answer completeness and length
  answers.forEach(answer => {
    // Add points for answer length (not too short, not too long)
    const wordCount = answer.split(/\s+/).length;
    if (wordCount > 30 && wordCount < 200) {
      totalScore += 5;
    } else if (wordCount >= 200) {
      totalScore += 3;
    } else {
      totalScore += 1;
    }
    
    // Add points for specific keywords (simplified)
    if (answer.match(/experience|skill|project|team|collaborate|solve|develop/gi)) {
      totalScore += 3;
    }
  });
  
  // Scale to appropriate range
  const scaledScore = Math.min(maxScore, Math.max(minScore, 60 + totalScore));
  
  // Save report to Supabase if needed
  // await supabase.from('interview_reports').insert({
  //   role_id: roleId,
  //   questions,
  //   answers,
  //   strengths,
  //   improvements,
  //   overall_score: scaledScore,
  // });
  
  return {
    strengths,
    improvements,
    overallScore: scaledScore,
    interviewDate: new Date().toISOString()
  };
};

// Process and extract text from uploaded resume
export const extractResumeText = async (file: File): Promise<string> => {
  if (!file) return '';
  
  try {
    // For PDF files, we would use a PDF extraction library in a real app
    // Here we'll simulate by reading the file as text
    
    // Read file as text
    const text = await file.text();
    
    // Simple extraction of plain text (in a real app, we'd use more sophisticated extraction)
    return text;
  } catch (error) {
    console.error('Error extracting resume text:', error);
    return '';
  }
};
