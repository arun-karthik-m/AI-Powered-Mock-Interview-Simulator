
interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

// Speech recognition event callback
type SpeechRecognitionCallback = (result: SpeechRecognitionResult) => void;

// Interface for our speech recognition service
interface SpeechRecognitionService {
  startListening: (callback: SpeechRecognitionCallback) => void;
  stopListening: () => void;
  isListening: () => boolean;
  isSupported: () => boolean;
}

// Create a mock or real speech recognition service based on browser support
const createSpeechRecognitionService = (): SpeechRecognitionService => {
  // Check if the browser supports the Web Speech API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  // If speech recognition is not supported, return a mock service
  if (!SpeechRecognition) {
    console.warn('Speech recognition is not supported in this browser.');
    return {
      startListening: () => console.warn('Speech recognition not supported'),
      stopListening: () => console.warn('Speech recognition not supported'),
      isListening: () => false,
      isSupported: () => false
    };
  }
  
  // Create a real speech recognition service
  let recognition: any = null;
  let isCurrentlyListening = false;
  
  return {
    startListening: (callback: SpeechRecognitionCallback) => {
      if (isCurrentlyListening) {
        return;
      }
      
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            callback({ transcript: finalTranscript, isFinal: true });
          } else {
            interimTranscript += transcript;
            callback({ transcript: interimTranscript, isFinal: false });
          }
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
      
      recognition.onend = () => {
        isCurrentlyListening = false;
      };
      
      recognition.start();
      isCurrentlyListening = true;
    },
    
    stopListening: () => {
      if (recognition && isCurrentlyListening) {
        recognition.stop();
        isCurrentlyListening = false;
      }
    },
    
    isListening: () => isCurrentlyListening,
    
    isSupported: () => true
  };
};

export const speechRecognitionService = createSpeechRecognitionService();
