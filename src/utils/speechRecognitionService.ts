// Add type declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

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
const createSpeechRecognitionService = (): SpeechRecognitionService & { setExternalCallback?: (cb: SpeechRecognitionCallback | null) => void } => {
  // Check if the browser supports the Web Speech API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  // If speech recognition is not supported, return a mock service
  if (!SpeechRecognition) {
    console.warn('Speech recognition is not supported in this browser.');
    return {
      startListening: () => console.warn('Speech recognition not supported'),
      stopListening: () => console.warn('Speech recognition not supported'),
      isListening: () => false,
      isSupported: () => false,
      setExternalCallback: () => {},
    };
  }
  
  // Create a real speech recognition service
  let recognition: any = null;
  let isCurrentlyListening = false;
  let externalCallback: SpeechRecognitionCallback | null = null;
  
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
            if (externalCallback) externalCallback({ transcript: finalTranscript, isFinal: true });
          } else {
            interimTranscript += transcript;
            callback({ transcript: interimTranscript, isFinal: false });
            if (externalCallback) externalCallback({ transcript: interimTranscript, isFinal: false });
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
    
    isSupported: () => true,
    
    setExternalCallback: (cb: SpeechRecognitionCallback | null) => { externalCallback = cb; },
  };
};

// Export the speech recognition service instance
export const speechRecognitionService = createSpeechRecognitionService();

// Add a React hook for using speech recognition
import { useState, useRef, useEffect } from 'react';

interface UseSpeechRecognitionReturn {
  transcript: string;
  listening: boolean;
  resetTranscript: () => void;
  browserSupportsSpeechRecognition: boolean;
}

export const useSpeechRecognition = (): UseSpeechRecognitionReturn => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const callbackRef = useRef<SpeechRecognitionCallback | null>(null);
  
  useEffect(() => {
    // Register callback to update transcript
    callbackRef.current = (result: SpeechRecognitionResult) => {
      setTranscript(result.transcript);
      setListening(speechRecognitionService.isListening());
    };
    speechRecognitionService.setExternalCallback?.(callbackRef.current);
    return () => {
      speechRecognitionService.setExternalCallback?.(null);
    };
  }, []);
  
  const resetTranscript = () => {
    setTranscript('');
  };

  return {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition: speechRecognitionService.isSupported()
  };
};

export const startListening = () => {
  speechRecognitionService.startListening((result) => {
    // No-op: actual state update handled by hook callback
  });
};

export const stopListening = () => {
  speechRecognitionService.stopListening();
};
