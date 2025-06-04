import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { downloadPdf } from '@/utils/pdfGenerator';
import { saveInterviewData } from '@/utils/supabase';
import { getCurrentUser } from '@/utils/supabase';
import { useToast } from '@/components/ui/use-toast';

interface Scores {
  clarity: number;
  relevance: number;
  confidence: number;
  grammar: number;
}

interface ReportData {
  strengths: string[];
  improvements: string[];
  overallScore: number;
  interviewDate: string;
  scores: Scores;
  structuredFeedback?: {
    strengths: string[];
    weaknesses: string[];
    suggestion: string;
  };
}

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const reportData = location.state?.report as ReportData;
  const jobRole = location.state?.jobRole as string;
  const questions = location.state?.questions as string[];
  const answers = location.state?.answers as string[];

  useEffect(() => {
    // Check if report data exists, if not redirect to setup
    if (!reportData) {
      navigate('/setup');
      return;
    }

    // Scroll to top when viewing the report
    window.scrollTo({ top: 0, behavior: 'auto' });

    // Get current user
    const getUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };

    getUser();
  }, [reportData, navigate]);

  const handleSaveResults = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save your interview results",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const interviewData = {
        user_id: user.id,
        role_title: jobRole,
        questions: questions,
        answers: answers,
        feedback: JSON.stringify(reportData.strengths.concat(reportData.improvements)),
        scores: reportData.scores,
        overall_score: reportData.overallScore
      };
      
      const result = await saveInterviewData(interviewData);
      
      if (result) {
        setSaved(true);
        toast({
          title: "Success!",
          description: "Your interview results have been saved",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save your results. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving results:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper to get strengths, improvements, and suggestion from structuredFeedback if present
  const getStrengths = () => {
    if (reportData?.structuredFeedback?.strengths?.length) return reportData.structuredFeedback.strengths;
    return reportData?.strengths || [];
  };
  const getImprovements = () => {
    if (reportData?.structuredFeedback?.weaknesses?.length) return reportData.structuredFeedback.weaknesses;
    return reportData?.improvements || [];
  };
  const getSuggestion = () => {
    if (reportData?.structuredFeedback?.suggestion) return reportData.structuredFeedback.suggestion;
    return '';
  };

  // --- Average per-answer scores for overall performance ---
  // If available, use the individual answer scores for averaging
  const perAnswerScores = location.state?.answerScores as number[] | undefined;
  let averagedOverallScore = reportData?.overallScore || 0;
  if (perAnswerScores && perAnswerScores.length > 0) {
    const sum = perAnswerScores.reduce((acc, val) => acc + val, 0);
    averagedOverallScore = Math.round((sum / perAnswerScores.length) * 10) / 10;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="h-8" /> {/* Spacer to push report below navbar */}
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-6xl">
        <div className="space-y-10">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Your Interview Report
            </h1>
            <p className="text-xl text-gray-500">
              {jobRole} • {formatDate(reportData?.interviewDate)}
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Button 
                onClick={() => navigate('/setup')}
                variant="outline"
                className="font-medium"
              >
                New Interview
              </Button>
              <Button 
                onClick={() => downloadPdf(reportData, jobRole, questions, answers)}
                className="font-medium"
              >
                Download PDF
              </Button>
              {user && !saved ? (
                <Button 
                  onClick={handleSaveResults}
                  className="bg-interview-blue hover:bg-interview-blue/90 font-medium"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Results'}
                </Button>
              ) : saved ? (
                <Button disabled className="bg-green-600 font-medium cursor-default">
                  Saved ✓
                </Button>
              ) : null}
            </div>
          </div>
          
          {/* Overall Score */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2 mb-6">
                <h2 className="text-xl font-semibold">Overall Performance</h2>
                <p className="text-gray-500">Your interview score based on all responses</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-8 border-gray-100">
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-0 rounded-full bg-blue-500 opacity-10"
                      style={{ 
                        clipPath: `inset(${100 - ((averagedOverallScore || 0) * 10)}% 0 0 0)` 
                      }}
                    ></div>
                  </div>
                  <span className="text-5xl font-bold text-blue-600 z-10">
                    {averagedOverallScore || 0}
                  </span>
                  <span className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-gray-400 font-medium">
                    out of 10
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Feedback */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-6">Detailed Feedback</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-green-600 mb-3">Strengths</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {getStrengths().map((strength, index) => (
                      <li key={index} className="text-gray-700">{strength}</li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium text-amber-600 mb-3">Areas for Improvement</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {getImprovements().map((improvement, index) => (
                      <li key={index} className="text-gray-700">{improvement}</li>
                    ))}
                  </ul>
                </div>
                {getSuggestion() && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-medium text-blue-600 mb-3">Suggestion</h3>
                      <p className="text-gray-700 pl-2">{getSuggestion()}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Report;
