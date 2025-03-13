
import React from 'react';
import { Sparkles, Star, TrendingUp, AlertCircle } from 'lucide-react';

interface FeedbackItem {
  type: 'strength' | 'improvement' | 'suggestion';
  content: string;
}

interface FeedbackScores {
  clarity: number;
  relevance: number;
  confidence: number;
  overall: number;
}

interface FeedbackPanelProps {
  feedback: FeedbackItem[];
  scores: FeedbackScores;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ feedback, scores }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-interview-success';
    if (score >= 6) return 'text-interview-warning';
    return 'text-interview-error';
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
      
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Performance Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-morphism p-3 rounded-lg text-center">
            <p className="text-xs text-gray-600 mb-1">Clarity</p>
            <p className={`text-xl font-bold ${getScoreColor(scores.clarity)}`}>{scores.clarity}/10</p>
          </div>
          <div className="glass-morphism p-3 rounded-lg text-center">
            <p className="text-xs text-gray-600 mb-1">Relevance</p>
            <p className={`text-xl font-bold ${getScoreColor(scores.relevance)}`}>{scores.relevance}/10</p>
          </div>
          <div className="glass-morphism p-3 rounded-lg text-center">
            <p className="text-xs text-gray-600 mb-1">Confidence</p>
            <p className={`text-xl font-bold ${getScoreColor(scores.confidence)}`}>{scores.confidence}/10</p>
          </div>
          <div className="glass-morphism p-3 rounded-lg text-center bg-interview-blue/5">
            <p className="text-xs text-gray-600 mb-1">Overall</p>
            <p className={`text-xl font-bold ${getScoreColor(scores.overall)}`}>{scores.overall}/10</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700">Detailed Feedback</h4>
        
        {feedback.map((item, index) => (
          <div key={index} className="glass-morphism p-4 rounded-lg">
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
    </div>
  );
};

export default FeedbackPanel;
