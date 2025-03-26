
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain, Play } from 'lucide-react';

interface HeroSectionProps {
  onStartInterview?: () => void;
  onWatchDemo?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartInterview, onWatchDemo }) => {
  return (
    <section className="py-16 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
          <div className="flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm">
              <span className="bg-interview-blue text-white text-xs py-0.5 px-2 rounded-full mr-2">New</span>
              AI-powered interview practice
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900">
                Master Your Interviews with <span className="text-interview-blue">AI</span>
              </h1>
              <p className="max-w-[600px] text-gray-600 md:text-xl">
                Practice with our intelligent interview simulator. Get real-time feedback and improve your skills with every session.
              </p>
            </div>
            
            <div className="space-y-4 md:space-y-0 md:flex md:gap-4">
              <Button 
                onClick={onStartInterview} 
                className="w-full md:w-auto bg-interview-blue hover:bg-interview-blue/90 text-white px-8 py-6 h-auto"
                size="lg"
              >
                Start Practice Interview
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={onWatchDemo} 
                variant="outline"
                className="w-full md:w-auto border-gray-300 text-gray-700 px-8 py-6 h-auto"
                size="lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-100 p-1">
                  <Brain className="h-4 w-4 text-interview-blue" />
                </div>
                <span className="text-sm text-gray-600">AI-Generated Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-100 p-1">
                  <svg className="h-4 w-4 text-interview-blue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Instant Feedback</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-purple-100 p-1">
                  <svg className="h-4 w-4 text-interview-blue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Practice 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-yellow-100 p-1">
                  <svg className="h-4 w-4 text-interview-blue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Detailed Reports</span>
              </div>
            </div>
          </div>
          
          <div className="glass-morphism rounded-xl shadow-xl overflow-hidden border border-gray-100">
            <div className="relative">
              <img
                alt="Interview simulation"
                className="w-full object-cover object-center"
                height="650"
                width="650"
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-interview-blue/20 to-transparent"></div>
            </div>
            <div className="bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">Try our AI Interview Simulator</h3>
              <p className="text-sm text-gray-600 mt-1">Get personalized feedback on your interview responses</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
