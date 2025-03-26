
import { useState, useEffect, useCallback } from 'react';

export function useVoice() {
  const [speaking, setSpeaking] = useState<boolean>(() => {
    const saved = localStorage.getItem('memoryMate-voice');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  
  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== 'undefined') {
      setSpeechSynthesis(window.speechSynthesis);
    }
    
    // Save speaking preference to localStorage
    localStorage.setItem('memoryMate-voice', JSON.stringify(speaking));
  }, [speaking]);
  
  const toggleSpeaking = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel(); // Cancel any ongoing speech
    }
    setSpeaking(prev => !prev);
  }, [speechSynthesis]);
  
  const speak = useCallback((text: string) => {
    if (!speaking || !speechSynthesis) return;
    
    speechSynthesis.cancel(); // Cancel any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower than default
    utterance.pitch = 1; // Normal pitch
    
    // Find a good voice if available
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') && voice.name.includes('US English')
    ) || voices.find(voice => 
      voice.lang.includes('en-US')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    speechSynthesis.speak(utterance);
  }, [speaking, speechSynthesis]);
  
  const cancelSpeech = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
  }, [speechSynthesis]);
  
  return { 
    speaking, 
    toggleSpeaking, 
    speak, 
    cancelSpeech 
  };
}
