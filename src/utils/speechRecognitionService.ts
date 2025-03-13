
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export const startListening = () => {
  SpeechRecognition.startListening({ continuous: true });
};

export const stopListening = () => {
  SpeechRecognition.stopListening();
};

export const resetTranscript = () => {
  SpeechRecognition.abortListening();
};

export { useSpeechRecognition };
