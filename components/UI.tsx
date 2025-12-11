import React from 'react';
import { useStore } from '../store/useStore';

export const UI: React.FC = () => {
  const { phase, gesture, cameraEnabled, toggleCamera } = useStore();

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 text-white z-10">
      
      {/* Header / Status */}
      <div className="absolute top-8 left-8 z-30">
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg animate-fade-in-down">
          <h2 className="text-xs uppercase tracking-widest text-gray-300 mb-1">Status</h2>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${cameraEnabled ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span className="font-semibold text-sm">
                {cameraEnabled ? `Gesture: ${gesture.replace('_', ' ')}` : 'Camera Off'}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2 max-w-[150px]">
            {phase === 'tree' ? 'Show "Open Palm" to start magic.' : 
             phase === 'nebula' ? 'Use Hand to Rotate. "Fist" to Reset.' : 
             'Animating...'}
          </p>
        </div>
      </div>

      {/* Main Title (Absolute Top) */}
      <div className="absolute top-0 left-0 w-full flex justify-center items-start z-20 pointer-events-none pt-10 px-4 overflow-visible">
        <h1 className="font-['Great_Vibes'] text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-100 drop-shadow-[0_0_25px_rgba(255,215,0,0.6)] animate-pulse text-center leading-[1.6] py-2">
          Merry Christmas
        </h1>
      </div>

      {/* Spacer for flex layout to push footer down */}
      <div className="flex-grow"></div>

      {/* Footer Controls */}
      <div className="flex justify-between items-end w-full">
        <button 
            onClick={toggleCamera}
            className="pointer-events-auto bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 transition-all duration-300 text-sm tracking-wider font-semibold hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
            {cameraEnabled ? 'DISABLE CAMERA' : 'ENABLE CAMERA'}
        </button>

        {/* Music Player Mockup */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 w-64 pointer-events-auto">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center animate-spin-slow">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163z" />
                </svg>
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-bold truncate">Merry Christmas Mr. Lawrence</h3>
                <div className="w-full bg-white/20 h-1 mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 w-2/3 animate-pulse"></div>
                </div>
            </div>
        </div>
      </div>
      
      {/* Audio Element */}
      <audio id="bgm" loop>
          <source src="https://upload.wikimedia.org/wikipedia/commons/6/61/Ryukyu_Music_-_Merry_Christmas_Mr_Lawrence.ogg" type="audio/ogg" />
      </audio> 
      <script dangerouslySetInnerHTML={{__html: `
        document.addEventListener('click', () => {
            const audio = document.getElementById('bgm');
            if(audio && audio.paused) {
                audio.volume = 0.3;
                audio.play().catch(e => console.log('Audio play failed', e));
            }
        }, { once: true });
      `}} />

    </div>
  );
};