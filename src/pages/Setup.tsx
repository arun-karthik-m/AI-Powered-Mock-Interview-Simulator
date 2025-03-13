
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, Briefcase, FileText, MessageSquare, Timer, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { jobRoles } from '@/utils/interviewUtils';

const Setup = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
  };

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setResumeFile(file);
  };

  const handleStartInterview = () => {
    if (!selectedRole) return;
    
    setLoading(true);
    
    // Simulate loading for demonstration purposes
    setTimeout(() => {
      setLoading(false);
      
      // Navigate to interview page with selected role ID
      navigate(`/interview/${selectedRole}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24 sm:px-6 max-w-7xl">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Setup Your Interview</h1>
            <p className="text-lg text-gray-600">
              Customize your interview experience by selecting a job role and uploading your resume.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Interview Setup</CardTitle>
                  <CardDescription>
                    Choose your job role and experience level
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="job-role">Job Role</Label>
                    <Select onValueChange={handleRoleChange} value={selectedRole}>
                      <SelectTrigger id="job-role" className="w-full">
                        <SelectValue placeholder="Select job role" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobRoles.map(role => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.title} - {role.level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="resume" className="mb-2 block">Resume (Optional)</Label>
                    <div className="glass-morphism p-8 border-dashed border-2 border-gray-300 rounded-lg text-center">
                      <Input
                        id="resume"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                      />
                      <label htmlFor="resume" className="cursor-pointer">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm font-medium text-gray-900">
                          {resumeFile ? resumeFile.name : 'Drag and drop your resume or click to browse'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Supported formats: PDF, DOC, DOCX
                        </p>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploading your resume allows the AI to tailor questions specifically to your experience.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-interview-blue hover:bg-interview-blue/90 text-white font-medium"
                    onClick={handleStartInterview}
                    disabled={!selectedRole || loading}
                  >
                    {loading ? 'Preparing Interview...' : 'Start Interview'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card className="glass-card bg-interview-blue/5">
                <CardHeader>
                  <CardTitle className="text-interview-blue">Interview Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start">
                    <Briefcase className="h-5 w-5 text-interview-blue mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Job-Specific Questions</h4>
                      <p className="text-xs text-gray-600">
                        Questions tailored to your selected role and experience level.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-interview-blue mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Resume Analysis</h4>
                      <p className="text-xs text-gray-600">
                        Upload your resume for personalized questions based on your experience.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MessageSquare className="h-5 w-5 text-interview-blue mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">AI Feedback</h4>
                      <p className="text-xs text-gray-600">
                        Get instant analysis and feedback on your answers.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Timer className="h-5 w-5 text-interview-blue mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">5-Question Interview</h4>
                      <p className="text-xs text-gray-600">
                        Complete a concise 5-question interview with detailed feedback.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-interview-blue mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Personalized Report</h4>
                      <p className="text-xs text-gray-600">
                        Receive a comprehensive report with improvement suggestions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Setup;
