import { useState, useEffect } from 'react';
import { SettingsDrawer } from './components/Settings';
import { Clock } from './components/Clock';
import { Tasks } from './components/Tasks';
import { Notepad } from './components/Notepad';
import { Timer } from './components/Timer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { defaultSettings, Mode } from './types';
import { ListTodo, PenTool, Timer as TimerIcon, Settings as SettingsIcon, Monitor, Focus, Ghost } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const QUOTES = {
  Motivational: [
    "The only way to do great work is to love what you do.",
    "Do what you can, with what you have, where you are.",
    "It always seems impossible until it's done.",
    "Your time is limited, don't waste it living someone else's life.",
    "Don't let yesterday take up too much of today.",
    "Everything you've ever wanted is on the other side of fear."
  ],
  'Self Care': [
    "Almost everything will work again if you unplug it for a few minutes.",
    "Talk to yourself like you would to someone you love.",
    "Rest is not idleness.",
    "You can't pour from an empty cup.",
    "Self-care is how you take your power back.",
    "Breathe. Let go. And remind yourself that this very moment is the only one you know you have for sure."
  ]
};

export default function App() {
  const [settings, setSettings] = useLocalStorage('dashboard_settings', defaultSettings);
  const [mode, setMode] = useLocalStorage<Mode>('dashboard_mode', 'home');
  const [activePanel, setActivePanel] = useState<'tasks' | 'notepad' | 'timer' | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (mode !== 'ambient') {
      setIdle(false);
      return;
    }
    
    let timer: number;
    const resetIdle = () => {
      setIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIdle(true), 5000) as unknown as number;
    };
    
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    resetIdle();
    
    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      clearTimeout(timer);
    };
  }, [mode]);

  const togglePanel = (panel: typeof activePanel) => {
    if (activePanel === panel) setActivePanel(null);
    else setActivePanel(panel);
  };

  useEffect(() => {
    if (mode === 'focus') {
      if (activePanel === 'tasks' || activePanel === 'notepad') setActivePanel(null);
    }
    if (mode === 'ambient') {
      setActivePanel(null);
      setShowSettings(false);
    }
  }, [mode]);

  const allQuotes = settings.quoteCategory === 'All' 
    ? [...QUOTES.Motivational, ...QUOTES['Self Care']] 
    : (QUOTES[settings.quoteCategory as keyof typeof QUOTES] || QUOTES.Motivational);
  const hash = new Date().toDateString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const todaysQuote = allQuotes[hash % allQuotes.length];

  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  const isAmbientUIHidden = mode === 'ambient' && idle;

  return (
    <div className="relative w-screen h-screen overflow-hidden text-white font-mono bg-black">
      
      <div className="absolute inset-0 z-0">
         {settings.bgImage ? (
           <img 
             src={settings.bgImage} 
             alt="" 
             className="w-full h-full object-cover transition-all duration-1000 ease-in-out" 
             style={{ filter: `blur(${settings.bgBlur}px)` }} 
           />
         ) : (
           <div className="w-full h-full bg-neutral-950" />
         )}
      </div>
      <div 
        className="absolute inset-0 z-10 transition-all duration-1000 ease-in-out pointer-events-none" 
        style={{ backgroundColor: `rgba(0,0,0, ${settings.bgOverlay / 100})` }} 
      />

      <div className={`absolute inset-0 z-20 bg-black/60 transition-opacity duration-1000 pointer-events-none ${mode === 'focus' ? 'opacity-100' : 'opacity-0'}`} />

      <div className={`absolute inset-0 z-30 transition-opacity duration-1000 ${isAmbientUIHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        <div className={`absolute top-8 left-8 xl:top-12 xl:left-12 transition-opacity duration-700 ${mode === 'ambient' ? 'opacity-0' : (mode === 'focus' ? 'opacity-20' : 'opacity-100')}`}>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 bg-black/40 px-3 py-1 rounded-sm backdrop-blur-sm border border-white/5">
            Hey, {settings.name}
          </div>
        </div>

        <div className={`absolute top-8 right-8 xl:top-12 xl:right-12 max-w-[280px] text-right transition-opacity duration-700 ${mode === 'ambient' ? 'opacity-0' : (mode === 'focus' ? 'opacity-20' : 'opacity-100')}`}>
          <div className="text-sm opacity-60 italic font-serif tracking-wide leading-relaxed drop-shadow-md">
            "{todaysQuote}"
          </div>
        </div>

        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${mode === 'focus' ? '-translate-y-20' : ''}`}>
           <h1 className={`text-2xl md:text-3xl font-bold tracking-tight mb-6 transition-opacity duration-700 drop-shadow-lg ${mode === 'ambient' ? 'opacity-0' : 'opacity-90'} ${settings.clockFont === 'Serif' ? 'font-serif' : settings.clockFont === 'Inter' ? 'font-sans' : 'font-mono'}`}>
             {greeting}, {settings.name}.
           </h1>
           <Clock font={settings.clockFont} use12h={settings.clock12h} showSeconds={settings.clockSeconds} />
        </div>

        <div className={`absolute bottom-8 left-8 xl:bottom-12 xl:left-12 flex space-x-6 transition-opacity duration-700 ${mode === 'ambient' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {mode !== 'focus' && (
            <>
              <div className="relative">
                <button onClick={() => togglePanel('tasks')} className={`p-3 transition-colors rounded-sm hover:bg-white/10 ${activePanel === 'tasks' ? 'text-accent bg-accent/10' : 'text-white/60'}`} title="Tasks">
                  <ListTodo size={20} />
                </button>
                <AnimatePresence>
                  {activePanel === 'tasks' && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.98 }} className="absolute bottom-[120%] left-0 bg-black/70 backdrop-blur-2xl p-6 border border-white/10 drop-shadow-2xl z-40">
                      <Tasks />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button onClick={() => togglePanel('notepad')} className={`p-3 transition-colors rounded-sm hover:bg-white/10 ${activePanel === 'notepad' ? 'text-accent bg-accent/10' : 'text-white/60'}`} title="Notepad">
                  <PenTool size={20} />
                </button>
                <AnimatePresence>
                  {activePanel === 'notepad' && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.98 }} className="absolute bottom-[120%] left-0 bg-black/70 backdrop-blur-2xl p-6 border border-white/10 drop-shadow-2xl z-40">
                      <Notepad />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          <div className="relative">
            <button onClick={() => togglePanel('timer')} className={`p-3 transition-colors rounded-sm hover:bg-white/10 ${activePanel === 'timer' && mode !== 'focus' ? 'text-accent bg-accent/10' : 'text-white/60'}`} title="Focus Timer">
              <TimerIcon size={20} />
            </button>
            <AnimatePresence>
              {activePanel === 'timer' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} 
                  className={mode === 'focus' ? "fixed top-1/2 left-1/2 -translate-x-1/2 mt-10 z-50 bg-transparent pointer-events-auto scale-110" : "absolute bottom-[120%] left-0 bg-black/70 backdrop-blur-2xl p-6 border border-white/10 drop-shadow-2xl z-40"}
                >
                  <Timer defaultFocus={settings.focusDuration} defaultBreak={settings.breakDuration} isFocusMode={mode === 'focus'} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 xl:bottom-12 flex space-x-6 transition-opacity duration-700 bg-black/40 backdrop-blur-md px-6 py-3 rounded border border-white/10 ${mode === 'ambient' ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
          <button onClick={() => setMode('home')} className={`transition-colors hover:text-white ${mode === 'home' ? 'text-accent' : 'text-white/40'}`} title="Home Mode">
            <Monitor size={18} />
          </button>
          <button onClick={() => { setMode('focus'); setActivePanel('timer'); }} className={`transition-colors hover:text-white ${mode === 'focus' ? 'text-accent' : 'text-white/40'}`} title="Focus Mode">
            <Focus size={18} />
          </button>
          <button onClick={() => setMode('ambient')} className={`transition-colors hover:text-white ${mode === 'ambient' ? 'text-accent' : 'text-white/40'}`} title="Ambient Mode">
            <Ghost size={18} />
          </button>
        </div>

        <div className={`absolute bottom-8 right-8 xl:bottom-12 xl:right-12 transition-opacity duration-700 ${mode !== 'home' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button onClick={() => setShowSettings(true)} className="p-3 text-white/60 hover:text-accent hover:bg-white/10 rounded-sm transition-colors" title="Settings">
            <SettingsIcon size={20} />
          </button>
        </div>

      </div>

      <AnimatePresence>
        {showSettings && (
          <SettingsDrawer settings={settings} setSettings={setSettings} onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

