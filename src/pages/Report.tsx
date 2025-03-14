
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
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

    // Get current user
    const getUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };

    getUser();
  }, [reportData, navigate]);

  // Format chart data
  const chartData = [
    {
      name: 'Clarity',
      score: reportData?.scores?.clarity || 0
    },
    {
      name: 'Relevance',
      score: reportData?.scores?.relevance || 0
    },
    {
      name: 'Confidence',
      score: reportData?.scores?.confidence || 0
    },
    {
      name: 'Grammar',
      score: reportData?.scores?.grammar || 0
    }
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
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
                        clipPath: `inset(${100 - (reportData?.overallScore || 0)}% 0 0 0)` 
                      }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <span className="block text-5xl font-bold text-gray-900">{reportData?.overallScore || 0}</span>
                    <span className="block text-sm text-gray-500 mt-1">out of 100</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Performance Metrics */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-6">Performance Metrics</h2>
                
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Clarity</span>
                      <span>{reportData?.scores?.clarity || 0}%</span>
                    </div>
                    <Progress value={reportData?.scores?.clarity || 0} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Relevance</span>
                      <span>{reportData?.scores?.relevance || 0}%</span>
                    </div>
                    <Progress value={reportData?.scores?.relevance || 0} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Confidence</span>
                      <span>{reportData?.scores?.confidence || 0}%</span>
                    </div>
                    <Progress value={reportData?.scores?.confidence || 0} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Grammar</span>
                      <span>{reportData?.scores?.grammar || 0}%</span>
                    </div>
                    <Progress value={reportData?.scores?.grammar || 0} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-6">Score Breakdown</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Feedback */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-6">Detailed Feedback</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-green-600 mb-3">Strengths</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {reportData?.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-700">{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium text-amber-600 mb-3">Areas for Improvement</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {reportData?.improvements.map((improvement, index) => (
                      <li key={index} className="text-gray-700">{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Report;
