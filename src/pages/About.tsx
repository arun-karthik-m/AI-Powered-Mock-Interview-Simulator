
import React from 'react';
import Navbar from '@/components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24 sm:px-6 max-w-7xl">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">About InterviewAI</h1>
            
            <div className="space-y-6 text-gray-600">
              <p>
                InterviewAI is an advanced AI-powered platform designed to help job seekers prepare 
                for technical interviews through realistic interview simulations. Our platform leverages 
                cutting-edge natural language processing to create personalized interview experiences.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-8">Our Mission</h2>
              <p>
                Our mission is to democratize interview preparation and help candidates build confidence 
                through practice. We believe that everyone deserves access to high-quality interview 
                preparation tools, regardless of their background or network.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-8">How It Works</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Select a job role that matches your target position</li>
                <li>Upload your resume (optional) for more tailored questions</li>
                <li>Complete a simulated interview with AI-generated questions</li>
                <li>Receive instant feedback on your responses</li>
                <li>Get a comprehensive report with actionable insights</li>
              </ol>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-8">Our Technology</h2>
              <p>
                InterviewAI uses advanced large language models to analyze your responses and provide 
                feedback that's comparable to what you'd receive from a human interviewer. Our system 
                evaluates various aspects of your answers, including:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Technical accuracy and depth</li>
                <li>Communication clarity</li>
                <li>Problem-solving approach</li>
                <li>Relevance to the question</li>
                <li>Overall impression</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-gray-800 mt-8">Contact Us</h2>
              <p>
                We're constantly improving our platform and would love to hear your feedback. 
                If you have any questions, suggestions, or concerns, please reach out to us at:
                <br />
                <a href="mailto:support@interviewai.example.com" className="text-interview-blue hover:underline">
                  support@interviewai.example.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
