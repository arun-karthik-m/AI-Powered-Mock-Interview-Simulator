# AI-Powered Interview Preparation Platform

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.11-06B6D4?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-5.4.1-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Shadcn_UI-0.8.0-000000?logo=ui-ux-design&logoColor=white" alt="Shadcn UI" />
  <img src="https://img.shields.io/badge/OpenAI_GPT-4-412991?logo=openai&logoColor=white" alt="OpenAI GPT-4" />
</div>

## 🚀 Overview

AI-Powered Interview Preparation Platform is a cutting-edge application designed to help job seekers practice and improve their interview skills using artificial intelligence. The platform provides a realistic interview experience with role-specific questions, real-time feedback, and detailed performance analytics.

![Interview Platform Dashboard](https://via.placeholder.com/1200x600/1e293b/ffffff?text=AI+Interview+Platform+Dashboard)

## ✨ Features

- **Role-Specific Interviews**: Practice with questions tailored to specific job roles and seniority levels
- **AI-Powered Feedback**: Get instant, detailed feedback on your answers
- **Resume Integration**: Upload your resume to get personalized interview questions
- **Practice Mode**: Simulate real interview conditions with timed responses
- **Comprehensive Reports**: Receive detailed performance analysis and improvement suggestions
- **Speech Recognition**: Answer questions using your voice for a more natural experience
- **PDF Export**: Download your interview reports for offline review

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn UI components
- **State Management**: React Query, React Context
- **Routing**: React Router v6
- **AI Integration**: OpenAI GPT-4, Google Gemini
- **Authentication**: Supabase Auth
- **Data Visualization**: Recharts
- **Form Handling**: React Hook Form with Zod validation
- **PDF Generation**: jsPDF
- **Speech Recognition**: Web Speech API

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or yarn 1.22+
- Supabase account (for authentication and data storage)
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-interview-platform.git
   cd ai-interview-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   The application will be available at `http://localhost:5173`

## 📂 Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/              # Page components
│   ├── Interview.tsx   # Interview interface
│   ├── Report.tsx      # Interview report
│   ├── Setup.tsx       # Interview setup
│   └── ...
├── utils/             # Utility functions
│   ├── interviewUtils.ts # Core interview logic
│   ├── openAiService.ts # OpenAI integration
│   ├── geminiService.ts # Gemini AI integration
│   └── ...
├── hooks/             # Custom React hooks
├── lib/               # Third-party library configurations
└── App.tsx            # Main application component
```

## 🤖 AI Integration

The platform leverages multiple AI models to provide a comprehensive interview experience:

- **Question Generation**: Uses GPT-4 to generate role-specific interview questions
- **Answer Analysis**: Provides real-time feedback on responses
- **Performance Evaluation**: Analyzes interview performance across multiple dimensions
- **Personalized Recommendations**: Suggests areas for improvement based on responses

## 📊 Features in Detail

### 1. Interview Setup
- Select from various job roles and seniority levels
- Upload your resume for personalized questions
- Configure interview preferences (time limits, question types)

### 2. Interview Interface
- Clean, distraction-free interface
- Timer to track response time
- Voice input support
- Real-time transcription
- Question navigation

### 3. Feedback System
- Instant scoring on multiple dimensions (clarity, relevance, confidence, grammar)
- Detailed feedback on each response
- Suggestions for improvement
- Strength and weakness analysis

### 4. Reporting
- Comprehensive performance dashboard
- Historical performance tracking
- Exportable reports (PDF)
- Actionable insights

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Import the repository on Vercel
3. Add your environment variables
4. Deploy!

### Netlify

1. Push your code to a Git repository
2. Create a new site in Netlify and import your repository
3. Set the build command: `npm run build`
4. Set the publish directory: `dist`
5. Add your environment variables
6. Deploy site

## 📚 Documentation

For detailed documentation, please visit our [Wiki](https://github.com/yourusername/ai-interview-platform/wiki).

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) to get started.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for their powerful language models
- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Vite](https://vitejs.dev/) for the amazing development experience
- [Supabase](https://supabase.com/) for authentication and database

---

<div align="center">
  Made with ❤️ by Arun Karthik | © 2025 AI Interview Platform
</div>
