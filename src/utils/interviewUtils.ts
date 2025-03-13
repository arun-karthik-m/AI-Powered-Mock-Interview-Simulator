
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

// Sample questions
export const getQuestions = (roleId: number): string[] => {
  const questions = {
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

  // Return questions for the selected role or default questions
  return questions[roleId as keyof typeof questions] || questions.default;
};

// Generate sample feedback
export const generateFeedback = (answer: string) => {
  // In a real app, this would use AI to analyze the answer
  
  // Sample feedback items
  const feedbackItems = [
    {
      type: 'strength' as const,
      content: 'You provided specific examples which strengthened your answer.'
    },
    {
      type: 'strength' as const,
      content: 'Your answer was well-structured and easy to follow.'
    },
    {
      type: 'improvement' as const,
      content: 'Consider quantifying your achievements with metrics or results.'
    },
    {
      type: 'suggestion' as const,
      content: 'Try using the STAR method (Situation, Task, Action, Result) to structure your responses.'
    }
  ];
  
  // Generate random scores for demonstration
  const scores = {
    clarity: Math.floor(Math.random() * 3) + 7, // 7-10
    relevance: Math.floor(Math.random() * 3) + 7, // 7-10
    confidence: Math.floor(Math.random() * 4) + 6, // 6-10
    overall: 0 // Will be calculated
  };
  
  // Calculate overall score
  scores.overall = Math.round((scores.clarity + scores.relevance + scores.confidence) / 3);
  
  return {
    feedback: feedbackItems,
    scores
  };
};

// Generate final report
export const generateReport = (answers: string[]) => {
  // In a real app, this would use AI to generate a comprehensive report
  
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
  
  const overallScore = Math.floor(Math.random() * 20) + 75; // 75-95
  
  return {
    strengths,
    improvements,
    overallScore,
    interviewDate: new Date().toISOString()
  };
};
