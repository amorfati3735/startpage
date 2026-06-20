import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function Timer({ defaultFocus, defaultBreak, isFocusMode }: { defaultFocus: number, defaultBreak: number, isFocusMode?: boolean }) {
  const [phase, setPhase] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(defaultFocus * 60);
  const [isRunning, setIsRunning] = useState(false);
  
  const [sessions, setSessions] = useLocalStorage<{date: string, count: number}>('dashboard_timer_sessions', { date: new Date().toDateString(), count: 0 });

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft((phase === 'focus' ? defaultFocus : defaultBreak) * 60);
    }
  }, [defaultFocus, defaultBreak, phase]);

  useEffect(() => {
    if (sessions.date !== new Date().toDateString()) {
      setSessions({ date: new Date().toDateString(), count: 0 });
    }
  }, []);

  useEffect(() => {
    let interval: number;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
         setTimeLeft(t => t - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      playBeep();
      setIsRunning(false);
      if (phase === 'focus') {
        setSessions(s => ({ ...s, count: s.count + 1 }));
        setPhase('break');
        setTimeLeft(defaultBreak * 60);
      } else {
        setPhase('focus');
        setTimeLeft(defaultFocus * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, phase]);

  const toggle = () => setIsRunning(!isRunning);
  const reset = () => {
    setIsRunning(false);
    setTimeLeft((phase === 'focus' ? defaultFocus : defaultBreak) * 60);
  };
  const switchPhase = (p: 'focus' | 'break') => {
    setPhase(p);
    setIsRunning(false);
    setTimeLeft((p === 'focus' ? defaultFocus : defaultBreak) * 60);
  }

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');
  const total = (phase === 'focus' ? defaultFocus : defaultBreak) * 60;
  const progress = ((total - timeLeft) / total) * 100;

  return (
    <div className={`w-[260px] flex flex-col items-center ${isFocusMode ? '' : ''}`}>
      <div className="flex space-x-6 mb-8 w-full justify-center">
        <button onClick={() => switchPhase('focus')} className={`${phase === 'focus' ? 'text-accent border-b-2 border-accent' : 'text-white/40 border-b-2 border-transparent hover:text-white'} pb-1 transition-all text-xs tracking-widest uppercase`}>Focus</button>
        <button onClick={() => switchPhase('break')} className={`${phase === 'break' ? 'text-accent border-b-2 border-accent' : 'text-white/40 border-b-2 border-transparent hover:text-white'} pb-1 transition-all text-xs tracking-widest uppercase`}>Break</button>
      </div>

      <div className="relative w-48 h-48 flex items-center justify-center mb-8 drop-shadow-2xl">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
           <circle cx="96" cy="96" r="90" className="stroke-white/10 fill-none" strokeWidth="4" />
           <circle cx="96" cy="96" r="90" className="stroke-accent fill-none transition-all duration-1000 ease-linear" strokeWidth="4" strokeDasharray="565" strokeDashoffset={isNaN(progress) ? 0 : 565 - (progress / 100) * 565} strokeLinecap="round" />
        </svg>
        <div className="text-5xl font-bold tracking-tighter opacity-90">{mins}:{secs}</div>
      </div>

      <div className="flex space-x-8 mb-8">
        <button onClick={toggle} className="w-14 h-14 rounded-full border border-accent flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all drop-shadow-lg">
          {isRunning ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
        </button>
        <button onClick={reset} className="w-14 h-14 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="flex justify-center space-x-2 mt-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i < sessions.count ? 'bg-accent' : 'bg-white/10'}`} />
        ))}
      </div>
    </div>
  );
}

function playBeep() {
  try {
    const ctx = new window.AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.error(e);
  }
}
