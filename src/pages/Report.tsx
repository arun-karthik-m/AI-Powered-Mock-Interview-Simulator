
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
  AlertTriangle,
  Share2
} from 'lucide-react';
import { generatePdfReport } from '@/utils/pdfGenerator';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();
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
  
  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  };
  
  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 80) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (score >= 60) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };
  
  const handleDownloadReport = () => {
    // Generate and download PDF report
    generatePdfReport({
      jobRole,
      interviewDate: report.interviewDate,
      overallScore: report.overallScore,
      strengths: report.strengths,
      improvements: report.improvements,
      questions,
      answers
    });
    
    // Show toast notification
    toast({
      title: "Report Downloaded",
      description: "Your interview report has been successfully downloaded.",
      duration: 3000,
    });
  };
  
  const handleShareReport = () => {
    // Create sharable link or copy report summary to clipboard
    // For demo, we'll just copy a summary to clipboard
    const summary = `Interview Report for ${jobRole}:\n` +
      `Overall Score: ${report.overallScore}/100\n` +
      `Key Strengths: ${report.strengths.join(', ')}\n` +
      `Areas for Improvement: ${report.improvements.join(', ')}`;
      
    navigator.clipboard.writeText(summary);
    
    toast({
      title: "Report Summary Copied",
      description: "A summary of your report has been copied to clipboard.",
      duration: 3000,
    });
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
                <div className="mb-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreBadgeColor(report.overallScore)}`}>
                    {getScoreBadge(report.overallScore)}
                  </span>
                </div>
                <div className="text-5xl font-bold mb-2 leading-none">
                  <span className={getScoreColor(report.overallScore)}>{report.overallScore}</span>
                  <span className="text-gray-400">/100</span>
                </div>
                <p className="text-sm text-gray-600">Overall Score</p>
                
                {/* Visual score meter */}
                <div className="mt-4 w-full max-w-xs mx-auto">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        report.overallScore >= 90 ? 'bg-interview-success' : 
                        report.overallScore >= 75 ? 'bg-interview-warning' : 
                        'bg-interview-error'
                      }`}
                      style={{ width: `${report.overallScore}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="glass-morphism p-6 rounded-xl hover:shadow-md transition-shadow duration-200">
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
              
              <div className="glass-morphism p-6 rounded-xl hover:shadow-md transition-shadow duration-200">
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
            
            <div className="glass-morphism p-6 rounded-xl mb-8 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-5 w-5 text-interview-blue mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Question Summary</h3>
              </div>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <p className="text-sm font-medium text-gray-900 mb-1">Q{index + 1}: {question}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{answers[index]}</p>
                    <button 
                      className="text-xs text-interview-blue mt-1 hover:underline focus:outline-none"
                      onClick={() => {
                        const element = document.getElementById(`answer-${index}`);
                        if (element) {
                          if (element.classList.contains('line-clamp-2')) {
                            element.classList.remove('line-clamp-2');
                          } else {
                            element.classList.add('line-clamp-2');
                          }
                        }
                      }}
                    >
                      Show {document.getElementById(`answer-${index}`)?.classList.contains('line-clamp-2') ? 'more' : 'less'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-interview-blue hover:bg-interview-blue/90 text-white font-medium px-6 py-3 rounded-lg shadow-button transition-all duration-200 hover:translate-y-[-2px]"
                onClick={handleDownloadReport}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-3 rounded-lg transition-all duration-200 hover:translate-y-[-2px]"
                onClick={handleShareReport}
              >
                <Share2 className="mr-2 h-4 w-4 text-interview-blue" />
                Share Report
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-3 rounded-lg transition-all duration-200 hover:translate-y-[-2px]"
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
