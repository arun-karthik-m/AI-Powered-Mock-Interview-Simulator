
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import QuestionCard from '@/components/QuestionCard';
import FeedbackPanel from '@/components/FeedbackPanel';
import ProgressIndicator from '@/components/ProgressIndicator';
import { getQuestions, generateFeedback, generateReport } from '@/utils/interviewUtils';
import { jobRoles } from '@/utils/interviewUtils';

const Interview = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [jobRole, setJobRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!roleId) {
      navigate('/setup');
      return;
    }

    // Get role info
    const role = jobRoles.find(r => r.id === parseInt(roleId));
    if (role) {
      setJobRole(`${role.title} - ${role.level}`);
    }

    // Get questions for the selected role
    const roleQuestions = getQuestions(parseInt(roleId));
    setQuestions(roleQuestions);
  }, [roleId, navigate]);

  const handleSubmitAnswer = (answer: string) => {
    // Show loading state
    setIsLoading(true);
    
    // Save the answer
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    // Simulate AI processing time
    setTimeout(() => {
      // Generate feedback
      const feedback = generateFeedback(answer);
      setCurrentFeedback(feedback);
      setShowFeedback(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
    } else {
      // Interview complete, navigate to report
      const report = generateReport(answers);
      navigate('/report', { state: { report, jobRole, answers, questions } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24 sm:px-6 max-w-7xl">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900">{jobRole} Interview</h1>
            <p className="text-gray-600 mt-2">Answer the questions as you would in a real interview</p>
          </div>
          
          <ProgressIndicator 
            currentStep={currentQuestionIndex} 
            totalSteps={questions.length} 
          />
          
          {questions.length > 0 && !showFeedback && (
            <QuestionCard 
              question={questions[currentQuestionIndex]} 
              onSubmitAnswer={handleSubmitAnswer}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
              isLoading={isLoading}
            />
          )}
          
          {showFeedback && currentFeedback && (
            <div className="space-y-6">
              <FeedbackPanel 
                feedback={currentFeedback.feedback} 
                scores={currentFeedback.scores} 
              />
              
              <div className="flex justify-center">
                <Button
                  className="mt-6 bg-interview-blue hover:bg-interview-blue/90 text-white font-medium px-6 py-3 rounded-lg shadow-button"
                  onClick={handleNextQuestion}
                >
                  {currentQuestionIndex === questions.length - 1 ? 'View Final Report' : 'Next Question'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Add Button component to avoid import error
const Button: React.FC<{
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ className, onClick, children }) => {
  return (
    <button
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Interview;
