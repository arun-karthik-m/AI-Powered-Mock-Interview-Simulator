
import React, { useState } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface QuestionCardProps {
  question: string;
  onSubmitAnswer: (answer: string) => void;
  isLastQuestion: boolean;
  isLoading: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  onSubmitAnswer, 
  isLastQuestion,
  isLoading
}) => {
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, this would start/stop speech recognition
  };

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmitAnswer(answer);
      setAnswer('');
    }
  };

  return (
    <div className="glass-morphism p-6 rounded-xl shadow-card max-w-3xl w-full mx-auto animate-scale-in">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-interview-blue flex items-center justify-center">
            <span className="text-sm font-bold text-white">AI</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-600">AI Interviewer</p>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{question}</h3>
        {isLoading && (
          <div className="loading-wave mt-4">
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
            <div className="loading-bar"></div>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <Textarea
          placeholder="Type your answer here..."
          className="min-h-32 resize-none border border-gray-200 focus:border-interview-blue focus:ring-1 focus:ring-interview-blue"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            className={`border-gray-200 ${isRecording ? 'bg-red-50 text-red-500 border-red-200' : 'text-gray-600'}`}
            onClick={toggleRecording}
          >
            {isRecording ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
          
          <Button
            type="button"
            className="bg-interview-blue hover:bg-interview-blue/90 text-white"
            onClick={handleSubmit}
            disabled={!answer.trim()}
          >
            {isLastQuestion ? 'Finish Interview' : 'Submit Answer'}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
