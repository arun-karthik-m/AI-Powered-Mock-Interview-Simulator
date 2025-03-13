
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  TrendingUp, 
  Download, 
  BarChart3, 
  ArrowUpRight, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

interface ReportData {
  strengths: string[];
  improvements: string[];
  overallScore: number;
  interviewDate: string;
}

interface LocationState {
  report: ReportData;
  jobRole: string;
  questions: string[];
  answers: string[];
}

const Report = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  
  if (!state || !state.report) {
    // Redirect if there's no report data
    navigate('/setup');
    return null;
  }
  
  const { report, jobRole, questions, answers } = state;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-interview-success';
    if (score >= 75) return 'text-interview-warning';
    return 'text-interview-error';
  };
  
  const handleDownloadReport = () => {
    // In a real app, this would generate a PDF report
    alert('Download report functionality would be implemented here');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24 sm:px-6 max-w-7xl">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card bg-white p-8 rounded-xl shadow-card mb-8 animate-scale-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <Award className="h-8 w-8 text-interview-blue" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete!</h1>
              <p className="text-gray-600">
                Here's your performance report for the {jobRole} position
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {formatDate(report.interviewDate)}
              </p>
            </div>
            
            <div className="flex justify-center mb-10">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2 leading-none">
                  <span className={getScoreColor(report.overallScore)}>{report.overallScore}</span>
                  <span className="text-gray-400">/100</span>
                </div>
                <p className="text-sm text-gray-600">Overall Score</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="glass-morphism p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <Check className="h-5 w-5 text-interview-success mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {report.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                        <Check className="h-3 w-3 text-interview-success" />
                      </div>
                      <p className="text-sm text-gray-600">{strength}</p>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="glass-morphism p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-5 w-5 text-interview-warning mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Areas for Improvement</h3>
                </div>
                <ul className="space-y-3">
                  {report.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-yellow-100 flex items-center justify-center mr-3 mt-0.5">
                        <AlertTriangle className="h-3 w-3 text-interview-warning" />
                      </div>
                      <p className="text-sm text-gray-600">{improvement}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="glass-morphism p-6 rounded-xl mb-8">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-5 w-5 text-interview-blue mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Question Summary</h3>
              </div>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <p className="text-sm font-medium text-gray-900 mb-1">Q{index + 1}: {question}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{answers[index]}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-interview-blue hover:bg-interview-blue/90 text-white font-medium px-6 py-3 rounded-lg shadow-button"
                onClick={handleDownloadReport}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-3 rounded-lg"
                onClick={() => navigate('/setup')}
              >
                <ArrowUpRight className="mr-2 h-4 w-4 text-interview-blue" />
                Start New Interview
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Want to improve your score? Practice with a different job role or retry this interview.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Report;
