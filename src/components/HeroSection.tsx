
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onStartInterview?: () => void;
  onWatchDemo?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartInterview, onWatchDemo }) => {
  return (
    <section className="py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Ace Your Next Interview with AI
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Practice with our intelligent interview simulator. Get real-time feedback and improve your skills with every session.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button 
                onClick={onStartInterview} 
                className="bg-interview-blue hover:bg-interview-blue/90"
              >
                Start Practice Interview
              </Button>
              <Button 
                onClick={onWatchDemo} 
                variant="outline"
              >
                Watch Demo
              </Button>
            </div>
          </div>
          <img
            alt="Interview simulation"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
            height="550"
            src="/placeholder.svg"
            width="550"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
