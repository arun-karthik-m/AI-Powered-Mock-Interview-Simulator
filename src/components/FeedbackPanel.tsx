import React from 'react';
import { Sparkles, Star, TrendingUp, AlertCircle, BarChart2, MessageCircle, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FeedbackItem {
  type: 'strength' | 'improvement' | 'suggestion';
  content: string;
}

interface FeedbackScores {
  clarity: number;
  relevance: number;
  confidence: number;
  grammar: number;
  overall: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface FeedbackPanelProps {
  feedback: FeedbackItem[];
  scores: FeedbackScores;
  structuredFeedback?: {
    strengths: string[];
    weaknesses: string[];
    suggestion: string;
  };
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ feedback, scores, structuredFeedback }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-interview-success';
    if (score >= 6) return 'text-interview-warning';
    return 'text-interview-error';
  };

  const getSentimentIcon = () => {
    switch (scores.sentiment) {
      case 'positive':
        return <CheckCircle2 className="h-5 w-5 text-interview-success" />;
      case 'neutral':
        return <AlertTriangle className="h-5 w-5 text-interview-warning" />;
      case 'negative':
        return <XCircle className="h-5 w-5 text-interview-error" />;
      default:
        return <MessageCircle className="h-5 w-5 text-interview-blue" />;
    }
  };

  const getSentimentText = () => {
    switch (scores.sentiment) {
      case 'positive':
        return 'Confident and positive tone';
      case 'neutral':
        return 'Neutral tone';
      case 'negative':
        return 'Signs of hesitation or uncertainty';
      default:
        return 'Unable to analyze sentiment';
    }
  };

  return (
    <div className="glass-morphism p-6 rounded-xl shadow-card max-w-3xl w-full mx-auto animate-slide-in">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-interview-blue flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-600">AI Feedback</p>
            <h3 className="text-lg font-semibold text-gray-900">Response Analysis</h3>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Performance Metrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Clarity</span>
                <span className={`text-sm font-semibold ${getScoreColor(scores.clarity)}`}>{scores.clarity}/10</span>
              </div>
              <Progress value={scores.clarity * 10} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Relevance</span>
                <span className={`text-sm font-semibold ${getScoreColor(scores.relevance)}`}>{scores.relevance}/10</span>
              </div>
              <Progress value={scores.relevance * 10} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Confidence</span>
                <span className={`text-sm font-semibold ${getScoreColor(scores.confidence)}`}>{scores.confidence}/10</span>
              </div>
              <Progress value={scores.confidence * 10} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Grammar</span>
                <span className={`text-sm font-semibold ${getScoreColor(scores.grammar)}`}>{scores.grammar}/10</span>
              </div>
              <Progress value={scores.grammar * 10} className="h-2" />
            </div>
          </div>
          
          <div className="glass-morphism p-6 rounded-xl bg-interview-blue/5 flex flex-col justify-center">
            <div className="mb-4 flex items-center">
              <BarChart2 className="h-5 w-5 text-interview-blue mr-2" />
              <h4 className="text-sm font-semibold text-gray-700">Overall Score</h4>
            </div>
            <div className="text-center">
              <div className="relative inline-flex">
                <svg className="w-32 h-32">
                  <circle
                    className="text-gray-200"
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                  {/* Removed colored progress arc for overall score */}
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-gray-800">
                  {scores.overall}
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center">
              {getSentimentIcon()}
              <span className="ml-2 text-sm text-gray-600">{getSentimentText()}</span>
            </div>
          </div>
        </div>
      </div>
      
      {structuredFeedback && (
        <div className="mt-8 space-y-4">
          {structuredFeedback.strengths.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-green-700 mb-1">Strengths</h4>
              <ul className="list-disc ml-6 text-sm text-gray-800">
                {structuredFeedback.strengths.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          )}
          {structuredFeedback.weaknesses.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-yellow-700 mb-1">Areas for Improvement</h4>
              <ul className="list-disc ml-6 text-sm text-gray-800">
                {structuredFeedback.weaknesses.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          )}
          {structuredFeedback.suggestion && (
            <div>
              <h4 className="text-sm font-semibold text-blue-700 mb-1">Suggestion</h4>
              <p className="text-sm text-gray-800 ml-2">{structuredFeedback.suggestion}</p>
            </div>
          )}
        </div>
      )}

      {(!structuredFeedback || (
        structuredFeedback.strengths.length === 0 &&
        structuredFeedback.weaknesses.length === 0 &&
        !structuredFeedback.suggestion
      )) && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700">Detailed Feedback</h4>
          {feedback.map((item, index) => (
            <div key={index} className="glass-morphism p-4 rounded-lg hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  {item.type === 'strength' && <Star className="h-5 w-5 text-interview-success" />}
                  {item.type === 'improvement' && <TrendingUp className="h-5 w-5 text-interview-warning" />}
                  {item.type === 'suggestion' && <AlertCircle className="h-5 w-5 text-interview-error" />}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    {item.type === 'strength' && 'Strength'}
                    {item.type === 'improvement' && 'Area for Improvement'}
                    {item.type === 'suggestion' && 'Suggestion'}
                  </p>
                  <p className="text-sm text-gray-600">{item.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackPanel;
