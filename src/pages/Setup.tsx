
import React, { useState, useEffect } from 'react';
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
import { 
  Upload, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Timer, 
  User,
  Trash2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { jobRoles } from '@/utils/interviewUtils';
import { extractResumeText } from '@/utils/interviewUtils';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

const Setup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if user has started an interview before
    const savedName = localStorage.getItem('interview_user_name');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, DOCX, or TXT file",
        variant: "destructive",
      });
      return;
    }

    setResumeFile(file);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    try {
      // Extract text from resume
      const text = await extractResumeText(file);
      setResumeText(text);

      toast({
        title: "Resume uploaded",
        description: "We'll use this to personalize your interview questions.",
      });
    } catch (error) {
      console.error('Error processing resume:', error);
      toast({
        title: "Error processing resume",
        description: "We couldn't process your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearInterval(interval);
      setUploadProgress(100);
    }
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    setResumeText('');
    setUploadProgress(0);
  };

  const handleStartInterview = () => {
    if (!selectedRole) {
      toast({
        title: "Select a job role",
        description: "Please select a job role before starting the interview.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Save user name to local storage
    if (userName.trim()) {
      localStorage.setItem('interview_user_name', userName.trim());
    }
    
    // Simulate loading for demonstration purposes
    setTimeout(() => {
      setLoading(false);
      
      // Navigate to interview page with selected role ID and resume text
      navigate(`/interview/${selectedRole}`, { 
        state: { 
          resumeText 
        } 
      });
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
              <Card className="glass-card hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle>Interview Setup</CardTitle>
                  <CardDescription>
                    Choose your job role and experience level
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* User name input */}
                  <div className="space-y-2">
                    <Label htmlFor="userName">Your Name (Optional)</Label>
                    <Input
                      id="userName"
                      placeholder="Enter your name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-interview-blue focus:border-interview-blue"
                    />
                    <p className="text-xs text-gray-500">
                      This will personalize your interview experience
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="job-role">Job Role</Label>
                    <Select onValueChange={handleRoleChange} value={selectedRole}>
                      <SelectTrigger id="job-role" className="w-full transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-interview-blue focus:border-interview-blue">
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
                    <div className={`glass-morphism p-8 border-dashed border-2 ${resumeFile ? 'border-interview-blue bg-interview-blue/5' : 'border-gray-300'} rounded-lg text-center transition-colors duration-200`}>
                      <Input
                        id="resume"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleResumeUpload}
                      />
                      
                      {!resumeFile ? (
                        <label htmlFor="resume" className="cursor-pointer">
                          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm font-medium text-gray-900">
                            Drag and drop your resume or click to browse
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Supported formats: PDF, DOC, DOCX, TXT (max 5MB)
                          </p>
                        </label>
                      ) : (
                        <div className="space-y-4">
                          <FileText className="h-10 w-10 text-interview-blue mx-auto" />
                          <p className="text-sm font-medium text-gray-900">
                            {resumeFile.name}
                          </p>
                          <div className="flex justify-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-red-500 border-red-200 hover:bg-red-50"
                              onClick={handleRemoveResume}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove File
                            </Button>
                          </div>
                          
                          {uploadProgress < 100 && (
                            <div className="w-full mt-2">
                              <Progress value={uploadProgress} className="h-1" />
                              <p className="text-xs text-gray-500 mt-1">
                                Processing resume... {uploadProgress}%
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploading your resume allows the AI to tailor questions specifically to your experience.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-interview-blue hover:bg-interview-blue/90 text-white font-medium transition-all duration-200 hover:shadow-button hover:translate-y-[-2px]"
                    onClick={handleStartInterview}
                    disabled={!selectedRole || loading}
                  >
                    {loading ? (
                      <>
                        <div className="loading-wave mr-2">
                          <div className="loading-bar"></div>
                          <div className="loading-bar"></div>
                          <div className="loading-bar"></div>
                        </div>
                        Preparing Interview...
                      </>
                    ) : 'Start Interview'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card className="glass-card bg-interview-blue/5 hover:shadow-lg transition-shadow duration-200">
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
                      <h4 className="text-sm font-semibold text-gray-900">Timed Responses</h4>
                      <p className="text-xs text-gray-600">
                        Practice answering within a realistic time frame to improve your conciseness.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-interview-blue mr-3 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Downloadable Report</h4>
                      <p className="text-xs text-gray-600">
                        Receive a comprehensive PDF report with improvement suggestions.
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
