import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSpeechRecognition, startListening, stopListening } from '@/utils/speechRecognitionService';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();

  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Update answer when transcript changes
  useEffect(() => {
    if (transcript) {
      setAnswer(transcript);
    }
  }, [transcript]);

  const toggleRecording = () => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please try a different browser.",
        variant: "destructive",
      });
      return;
    }

    if (!isRecording) {
      resetTranscript();
      startListening();
      setIsRecording(true);
    } else {
      stopListening();
      setIsRecording(false);
    }
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
        <h3 className="text-xl font-semibold text-gray-900 mb-2 whitespace-pre-line">{question}</h3>
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
          placeholder="Type your answer here or click the microphone to speak..."
          className="min-h-32 resize-none border border-gray-200 focus:border-interview-blue focus:ring-1 focus:ring-interview-blue"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        {isRecording && (
          <div className="flex justify-center">
            <div className="audio-visualizer flex items-end space-x-1 h-8">
              {Array.from({ length: 10 }).map((_, index) => (
                <div 
                  key={index}
                  className="w-1.5 bg-interview-blue rounded-t-full animate-wave"
                  style={{ 
                    height: `${Math.random() * 100}%`,
                    animationDelay: `${index * 0.1}s`
                  }}
                ></div>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            className={`border-gray-200 ${isRecording ? 'bg-red-50 text-red-500 border-red-200 animate-pulse' : 'text-gray-600'}`}
            onClick={toggleRecording}
          >
            {isRecording ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
          <Button
            type="button"
            className="bg-interview-blue hover:bg-interview-blue/90 text-white"
            onClick={handleSubmit}
            disabled={!answer.trim() || isLoading}
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
