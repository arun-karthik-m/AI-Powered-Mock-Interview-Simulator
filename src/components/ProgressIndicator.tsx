
import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center items-center mb-8">
      <div className="flex items-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div 
                className={`w-12 h-0.5 ${
                  index <= currentStep ? 'bg-interview-blue' : 'bg-gray-200'
                }`}
              />
            )}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center">
                {index < currentStep ? (
                  <CheckCircle2 className="h-6 w-6 text-interview-blue" />
                ) : index === currentStep ? (
                  <div className="h-6 w-6 rounded-full bg-interview-blue text-white flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                ) : (
                  <Circle className="h-6 w-6 text-gray-300" />
                )}
              </div>
              <span 
                className={`text-xs mt-1 ${
                  index <= currentStep ? 'text-interview-blue font-medium' : 'text-gray-400'
                }`}
              >
                Q{index + 1}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
