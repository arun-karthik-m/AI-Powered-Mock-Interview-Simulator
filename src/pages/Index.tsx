
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);
  
  const handleStartInterview = () => {
    navigate('/setup');
  };

  const handleWatchDemo = () => {
    setDemoOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-16"> {/* Add padding-top to account for the fixed navbar */}
        <HeroSection 
          onStartInterview={handleStartInterview}
          onWatchDemo={handleWatchDemo}
        />
      </main>
      
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>Interview AI Demo</DialogTitle>
            <DialogDescription>
              Watch how our AI-powered interview platform works
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video w-full bg-gray-100 rounded-md flex items-center justify-center">
            <div className="text-center p-6">
              <p className="text-lg font-medium text-gray-800 mb-2">Demo Video</p>
              <p className="text-sm text-gray-600">
                This is a placeholder for the demo video. In a real application, an embedded video would be displayed here.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
