
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import QuestionCard from '@/components/QuestionCard';
import FeedbackPanel from '@/components/FeedbackPanel';
import ProgressIndicator from '@/components/ProgressIndicator';
import { getQuestions, generateFeedback, generateReport } from '@/utils/interviewUtils';
import { jobRoles } from '@/utils/interviewUtils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface LocationState {
  resumeText?: string;
}

const Interview = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [jobRole, setJobRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLimit, setTimeLimit] = useState(120); // 2 minutes default
  const [isInitializing, setIsInitializing] = useState(true);

  // Load interview data
  useEffect(() => {
    const initializeInterview = async () => {
      if (!roleId) {
        navigate('/setup');
        return;
      }

      try {
        setIsInitializing(true);
        
        // Get role info
        const role = jobRoles.find(r => r.id === parseInt(roleId));
        if (role) {
          setJobRole(`${role.title} - ${role.level}`);
          
          // Set time limit based on role level
          if (role.level === 'Entry Level') {
            setTimeLimit(150); // 2.5 minutes
          } else if (role.level === 'Mid Level') {
            setTimeLimit(120); // 2 minutes
          } else {
            setTimeLimit(90); // 1.5 minutes
          }
        }

        // Get questions for the selected role, using resume if available
        const resumeText = state?.resumeText || '';
        const roleQuestions = await getQuestions(parseInt(roleId), resumeText);
        setQuestions(roleQuestions);
        
        // Initialize answers array
        setAnswers(new Array(roleQuestions.length).fill(''));
        
        // Show welcome toast
        const userName = localStorage.getItem('interview_user_name') || 'Candidate';
        toast({
          title: `Welcome, ${userName}!`,
          description: "Your AI interview is ready to begin. Good luck!",
          duration: 5000,
        });
      } catch (error) {
        console.error('Error initializing interview:', error);
        toast({
          title: "Error",
          description: "Failed to load interview questions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsInitializing(false);
      }
    };

    initializeInterview();
  }, [roleId, navigate, state, toast]);

  const handleSubmitAnswer = async (answer: string) => {
    // Show loading state
    setIsLoading(true);
    
    // Save the answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
    
    try {
      // Generate feedback using AI
      const feedback = await generateFeedback(
        questions[currentQuestionIndex],
        answer,
        parseInt(roleId || '1')
      );
      
      setCurrentFeedback(feedback);
      setShowFeedback(true);
    } catch (error) {
      console.error('Error generating feedback:', error);
      toast({
        title: "Error",
        description: "Failed to analyze your answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
    } else {
      // Interview complete, generate report
      setIsLoading(true);
      
      try {
        // Generate final report
        const report = await generateReport(
          questions,
          answers,
          parseInt(roleId || '1')
        );
        
        // Navigate to report page
        navigate('/report', { 
          state: { 
            report, 
            jobRole, 
            answers, 
            questions 
          } 
        });
      } catch (error) {
        console.error('Error generating report:', error);
        toast({
          title: "Error",
          description: "Failed to generate your report. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    }
  };

  // If still initializing, show loading state
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-24 sm:px-6 max-w-7xl flex items-center justify-center">
          <div className="text-center">
            <div className="loading-wave mb-4">
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
              <div className="loading-bar"></div>
            </div>
            <h2 className="text-xl font-medium text-gray-700">
              Preparing your interview...
            </h2>
            <p className="text-gray-500 mt-2">
              Setting up questions tailored to your role
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24 sm:px-6 max-w-7xl">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900">
              {localStorage.getItem('interview_user_name') ? 
                `${localStorage.getItem('interview_user_name')}'s ${jobRole} Interview` : 
                `${jobRole} Interview`}
            </h1>
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
              timeLimit={timeLimit}
            />
          )}
          
          {showFeedback && currentFeedback && (
            <div className="space-y-6">
              <FeedbackPanel 
                feedback={currentFeedback.feedback} 
                scores={currentFeedback.scores} 
              />
              
              <div className="flex justify-center mt-6 space-x-4">
                {currentQuestionIndex > 0 && (
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-3 rounded-lg transition-all duration-200 hover:translate-y-[-2px]"
                    onClick={() => {
                      setCurrentQuestionIndex(currentQuestionIndex - 1);
                      setShowFeedback(false);
                    }}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous Question
                  </Button>
                )}
                
                <Button
                  className="bg-interview-blue hover:bg-interview-blue/90 text-white font-medium px-6 py-3 rounded-lg shadow-button transition-all duration-200 hover:translate-y-[-2px]"
                  onClick={handleNextQuestion}
                  disabled={isLoading}
                >
                  {currentQuestionIndex === questions.length - 1 ? 'View Final Report' : 'Next Question'}
                  {currentQuestionIndex !== questions.length - 1 && (
                    <ArrowRight className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Interview;
