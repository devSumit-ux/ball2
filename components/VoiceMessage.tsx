import React, { useState, useEffect, useRef } from 'react';
import { getStoredAudio, storeAudio } from '../services/audioService';
import { Play, Pause, Volume2, Sparkles } from 'lucide-react';

// Helper to wrap raw 16-bit PCM data in a WAV file format
function createWavBlob(pcmData: Uint8Array, sampleRate: number = 24000): Blob {
  const buffer = new ArrayBuffer(44 + pcmData.length);
  const view = new DataView(buffer);

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcmData.length, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // 1 channel
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(view, 36, 'data');
  view.setUint32(40, pcmData.length, true);

  // Copy PCM data
  new Uint8Array(buffer, 44).set(pcmData);

  return new Blob([buffer], { type: 'audio/wav' });
}

const VoiceMessage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Note: Gemini TTS removed to ensure 100% local operation.
    // Future: Integrate with local Ollama TTS or browser Speech API.
    console.log("Cloud AI TTS disabled. Using local playback only.");
  }, []);

  const togglePlay = () => {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance("Hey guys! Welcome to Pharmelo. Yaar, aaj kal medicine order karna aur un handwritten prescriptions ko samajhna kitna stressful hai na? Isiliye humne banaya hai Pharmelo. Yeh dekho hamara dual-phone ecosystem kaise kaam karta hai. Step one, aap bas WhatsApp par apne prescription ki photo bhejo. Step two, hamara smart AI usko read karke medicines aur doctor details nikal lega. Step three, aapka order turant Consumer App mein sync ho jayega. Step four, local pharmacy partner ko unke app par order mil jayega. Step five, wo order accept karke prepare karna shuru kar denge. Aur finally, step six, aapko WhatsApp par confirmation mil jayegi. Hai na super chill? No new apps needed, just simple, smart healthcare!");
      msg.onstart = () => setIsPlaying(true);
      msg.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(msg);
    } else {
      alert("Local Text-to-Speech not supported in this browser.");
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={togglePlay}
        disabled={isLoading}
        className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl transition-all border border-slate-200/50 backdrop-blur-md ${
          isPlaying 
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30' 
            : 'bg-white/90 text-slate-800 hover:bg-white shadow-slate-200/50'
        } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
      >
        {isPlaying ? (
          <div className="relative flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
            <Pause className="w-4 h-4 fill-current" />
            <span className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" />
          </div>
        ) : (
          <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-full text-blue-600">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
        )}
        
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold flex items-center gap-1">
            {isPlaying ? 'Playing (Local)' : 'Play Local Sync'}
            {isPlaying && <Sparkles className="w-3 h-3 text-yellow-300" />}
          </span>
          <span className={`text-[10px] font-medium ${isPlaying ? 'text-blue-100' : 'text-slate-500'}`}>
            Local Voice • Offline
          </span>
        </div>
        
        {!isPlaying && (
          <Volume2 className="w-4 h-4 ml-2 text-slate-400" />
        )}
      </button>
    </div>
  );
};

export default VoiceMessage;
