
import React from 'react';
import Navbar from '@/components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-3xl font-bold mb-6 text-interview-blue">About InterviewAI</h1>
            
            <p className="mb-4">
              InterviewAI is an innovative platform designed to help job seekers prepare for interviews using artificial intelligence. Our mission is to make interview preparation accessible, effective, and personalized for everyone.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Our Story</h2>
            <p className="mb-4">
              InterviewAI was created by a team of professionals who recognized the challenges that candidates face during the job application process. Drawing from years of experience in recruitment, technology, and career development, we built a platform that simulates real interview experiences and provides actionable feedback.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">How It Works</h2>
            <p className="mb-4">
              Using advanced AI technology, InterviewAI creates realistic interview scenarios based on specific job roles and industries. Users can practice answering questions in real-time, receive instant feedback on their responses, and track their progress over time. This interactive approach helps users identify their strengths and weaknesses, allowing them to refine their interview skills before facing actual recruiters.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Our Technology</h2>
            <p className="mb-4">
              InterviewAI employs state-of-the-art natural language processing and machine learning algorithms to analyze user responses across multiple dimensions, including relevance, clarity, confidence, and specific industry knowledge. Our system continuously learns from new data, ensuring that feedback becomes increasingly accurate and valuable over time.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Contact Us</h2>
            <p className="mb-4">
              We're always looking to improve our platform and would love to hear your feedback. If you have any questions, suggestions, or concerns, please don't hesitate to reach out to our team at <a href="mailto:support@interviewai.com" className="text-interview-blue hover:underline">support@interviewai.com</a>.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} InterviewAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
