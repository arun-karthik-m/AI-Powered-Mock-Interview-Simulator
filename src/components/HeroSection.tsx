
import React from 'react';
import { ChevronRight, Play, Award, BarChart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="absolute inset-0 bg-gradient-hero -z-10"></div>
      <div className="container px-4 sm:px-6 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full mb-6">
              <span className="text-xs font-semibold text-interview-blue">AI-Powered Interview Practice</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              <span className="block">Ace Your Next</span>
              <span className="block text-interview-blue">Job Interview</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
              Practice interviews with our AI technology and receive instant feedback to improve your performance and confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/setup">
                <Button className="bg-interview-blue hover:bg-interview-blue/90 text-white font-medium px-6 py-3 rounded-lg shadow-button transition-all duration-300 hover:translate-y-[-2px]">
                  Start Interview
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-3 rounded-lg flex items-center">
                <Play className="mr-2 h-4 w-4 text-interview-blue" />
                Watch Demo
              </Button>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Award className="h-5 w-5 text-interview-blue" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">100+ Jobs</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <BarChart className="h-5 w-5 text-interview-blue" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Real-time Analysis</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-interview-blue" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">24/7 Access</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="glass-morphism p-6 rounded-xl shadow-card overflow-hidden">
              <div className="aspect-video rounded-lg overflow-hidden bg-blue-50 flex items-center justify-center">
                <div className="glass-morphism p-6 m-4 text-center">
                  <h3 className="font-semibold text-interview-blue mb-2">AI Interview Session</h3>
                  <p className="text-sm text-gray-600">Interactive practice with real-time feedback</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-interview-blue flex items-center justify-center">
                    <span className="text-xs font-bold text-white">AI</span>
                  </div>
                  <div className="ml-3 glass-morphism px-4 py-2 rounded-lg text-sm">
                    Tell me about a challenging project you've worked on.
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <div className="mr-3 glass-morphism px-4 py-2 rounded-lg text-sm bg-white/60">
                    In my previous role, I led a team to deliver...
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">You</span>
                  </div>
                </div>
                <div className="glass-morphism p-3 rounded-lg bg-white/30">
                  <p className="text-xs font-semibold text-interview-blue mb-1">AI Feedback</p>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Clear +8
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Confidence +6
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -z-10 top-1/4 right-1/4 w-72 h-72 bg-blue-200/30 rounded-full filter blur-3xl"></div>
            <div className="absolute -z-10 bottom-1/4 left-1/4 w-60 h-60 bg-purple-200/20 rounded-full filter blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
