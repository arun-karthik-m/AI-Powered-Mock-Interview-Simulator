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
  const [isInitializing, setIsInitializing] = useState(false);
  const [timeLimit, setTimeLimit] = useState(120);
  const [isLoading, setIsLoading] = useState(false);
  const [answerScores, setAnswerScores] = useState<number[]>([]);

  const initializeInterview = async () => {
    if (!roleId) {
      navigate('/setup');
      return;
    }
    try {
      setIsInitializing(true);
      const role = jobRoles.find(r => r.id === parseInt(roleId));
      if (role) {
        setJobRole(`${role.title} - ${role.level}`);
        if (role.level === 'Entry Level') setTimeLimit(150);
        else if (role.level === 'Mid Level') setTimeLimit(120);
        else setTimeLimit(90);
      }
      // Use resumeText from navigation state if present
      const resumeText = state?.resumeText || '';
      const roleQuestions = await getQuestions(parseInt(roleId), resumeText);
      setQuestions(roleQuestions);
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

  useEffect(() => {
    initializeInterview();
    // eslint-disable-next-line
  }, []);

  const handleSubmitAnswer = async (answer: string) => {
    setIsLoading(true);

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
      // Save per-answer overall score
      setAnswerScores(prev => {
        const updated = [...prev];
        updated[currentQuestionIndex] = feedback?.scores?.overall ?? 0;
        return updated;
      });
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
      setIsLoading(true);
      try {
        const report = await generateReport(
          questions,
          answers,
          parseInt(roleId || '1')
        );
        // Pass answerScores to report page
        navigate('/report', {
          state: {
            report,
            jobRole,
            answers,
            questions,
            answerScores // Pass per-answer overall scores
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
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex justify-center w-full">
              <div className="loading-wave mb-4 flex justify-center">
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
                <div className="loading-bar"></div>
              </div>
            </div>
            <h2 className="text-xl font-medium text-gray-700 text-center">
              Preparing your interview...
            </h2>
            <p className="text-gray-500 mt-2 text-center">
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

          {/* Subtle loading animation when generating the report */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center my-12 animate-fade-in">
              <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <div className="text-blue-600 font-medium text-lg">Generating your report...</div>
            </div>
          )}

          {!isLoading && (
            <>
              <ProgressIndicator 
                currentStep={currentQuestionIndex} 
                totalSteps={questions.length} 
              />
              {questions.length > 0 && !showFeedback && questions[currentQuestionIndex] ? (
                <QuestionCard 
                  question={questions[currentQuestionIndex]} 
                  onSubmitAnswer={handleSubmitAnswer}
                  isLastQuestion={currentQuestionIndex === questions.length - 1}
                  isLoading={isLoading}
                  timeLimit={timeLimit}
                />
              ) : null}
              {questions.length > 0 && !showFeedback && !questions[currentQuestionIndex] && (
                <div className="text-center text-red-500 font-semibold mt-8">
                  Unable to load this question. Please try refreshing the page or restarting the interview.
                </div>
              )}
              {showFeedback && currentFeedback && (
                <div className="space-y-6">
                  <FeedbackPanel 
                    feedback={Array.isArray(currentFeedback.feedback)
                      ? currentFeedback.feedback
                      : [{
                          type: 'suggestion',
                          content: String(currentFeedback.feedback)
                        }]}
                    scores={currentFeedback.scores}
                    structuredFeedback={currentFeedback.structuredFeedback}
                  />
                  {/* Show raw feedback for debugging if needed */}
                  {/* <pre className="bg-gray-100 text-xs p-2 rounded">{JSON.stringify(currentFeedback, null, 2)}</pre> */}
                </div>
              )}
              {showFeedback && currentFeedback && (
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
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Interview;
