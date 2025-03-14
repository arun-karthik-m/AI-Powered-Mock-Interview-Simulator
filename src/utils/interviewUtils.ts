import { faker } from '@faker-js/faker';

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

// Mock function to generate questions based on role and resume
export async function getQuestions(roleId: number, resumeText: string = ''): Promise<string[]> {
  console.log("Generating questions for role:", roleId, "with resume:", resumeText ? 'Yes' : 'No');
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const numQuestions = 5;
  const questions = Array.from({ length: numQuestions }, () =>
    faker.lorem.sentence() + ' ' + faker.lorem.sentence()
  );
  
  return questions;
}

// Mock generate feedback
export async function generateFeedback(question: string, answer: string, roleId: number): Promise<any> {
  console.log("Generating feedback for role:", roleId, "question:", question, "answer:", answer);
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock feedback
  const feedback = faker.lorem.paragraph();

  // Adjust the structure of scoreData to match what the component expects
  const scoreData = {
    feedback: feedback,
    scores: {
      clarity: Math.round(Math.random() * 40) + 60,
      relevance: Math.round(Math.random() * 40) + 60,
      confidence: Math.round(Math.random() * 40) + 60,
      grammar: Math.round(Math.random() * 40) + 60
    },
  };

  return scoreData;
}

// Mock generate report from all answers
export async function generateReport(questions: string[], answers: string[], roleId: number) {
  console.log("Generating report for role:", roleId);
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock strengths and improvements
  const strengths = Array.from({ length: 2 }, () => faker.lorem.sentence());
  const improvements = Array.from({ length: 2 }, () => faker.lorem.sentence());
  
  // Mock feedback
  const feedback = {
    scores: {
      clarity: Math.round(Math.random() * 40) + 60,
      relevance: Math.round(Math.random() * 40) + 60,
      confidence: Math.round(Math.random() * 40) + 60,
      grammar: Math.round(Math.random() * 40) + 60
    }
  };

  // Make sure we're returning data with the structure expected by Report.tsx
  const reportData = {
    strengths: strengths,
    improvements: improvements,
    overallScore: Math.round(
      (
        feedback.scores.clarity +
        feedback.scores.relevance +
        feedback.scores.confidence +
        feedback.scores.grammar
      ) / 4
    ),
    interviewDate: new Date().toISOString(),
    scores: feedback.scores
  };

  return reportData;
}
