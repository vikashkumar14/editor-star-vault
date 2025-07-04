import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VoiceChatProps {
  onTranscript: (text: string) => void;
  onResponse: (text: string) => void;
}

const VoiceChat = ({ onTranscript, onResponse }: VoiceChatProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Text-to-Speech function
  const speakText = (text: string) => {
    if (!isSpeechEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN'; // Hindi language
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success('Recording started... Speak now!');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone');
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.info('Processing your voice...');
    }
  };

  // Process audio and get transcription
  const processAudio = async (audioBlob: Blob) => {
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        // Send to voice-to-text function
        const { data, error } = await supabase.functions.invoke('voice-to-text', {
          body: { audio: base64Audio }
        });

        if (error) {
          console.error('Voice processing error:', error);
          toast.error('Could not process voice. Using chat instead.');
          return;
        }

        const transcribedText = data?.text || '';
        if (transcribedText.trim()) {
          onTranscript(transcribedText);
          toast.success('Voice processed successfully!');
        } else {
          toast.error('Could not understand. Please try again.');
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('Error processing voice');
    }
  };

  // Convert text to speech
  const handleTextToSpeech = async (text: string) => {
    try {
      setIsPlaying(true);
      
      // First try browser's built-in speech synthesis
      if ('speechSynthesis' in window && isSpeechEnabled) {
        speakText(text);
        onResponse(text);
        return;
      }

      // Fallback to OpenAI TTS via edge function
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: text,
          voice: 'alloy' // Use alloy voice for better quality
        }
      });

      if (error) {
        console.error('TTS error:', error);
        // Fallback to browser speech
        speakText(text);
        onResponse(text);
        return;
      }

      if (data?.audioContent) {
        // Play the audio
        const audioData = atob(data.audioContent);
        const arrayBuffer = new ArrayBuffer(audioData.length);
        const view = new Uint8Array(arrayBuffer);
        
        for (let i = 0; i < audioData.length; i++) {
          view[i] = audioData.charCodeAt(i);
        }
        
        const audioBlob = new Blob([arrayBuffer], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.onerror = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
          // Fallback to browser speech
          speakText(text);
        };
        
        await audio.play();
        onResponse(text);
      } else {
        speakText(text);
        onResponse(text);
      }
    } catch (error) {
      console.error('TTS error:', error);
      setIsPlaying(false);
      // Fallback to browser speech
      speakText(text);
      onResponse(text);
    }
  };

  // Stop speech
  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  // Auto-speak responses
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      {/* Voice Input Button */}
      <Button
        size="sm"
        variant={isRecording ? "destructive" : "outline"}
        onClick={isRecording ? stopRecording : startRecording}
        className={`${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
            : 'border-purple-200 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30'
        } transition-all duration-200`}
        disabled={isPlaying}
      >
        {isRecording ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </Button>

      {/* Speech Toggle Button */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setIsSpeechEnabled(!isSpeechEnabled);
          if (!isSpeechEnabled) {
            stopSpeech();
          }
          toast.info(isSpeechEnabled ? 'Voice responses disabled' : 'Voice responses enabled');
        }}
        className={`${
          isSpeechEnabled 
            ? 'border-green-200 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30' 
            : 'border-gray-200 text-gray-400'
        } transition-all duration-200`}
      >
        {isSpeechEnabled ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

// Export the TTS function for use in other components
export const useVoiceResponse = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };
  
  return { speak, isPlaying };
};

export default VoiceChat;