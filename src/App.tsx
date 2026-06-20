import { useState, useEffect } from 'react';
import { SettingsDrawer } from './components/Settings';
import { Clock } from './components/Clock';
import { Tasks } from './components/Tasks';
import { Notepad } from './components/Notepad';
import { Timer } from './components/Timer';
import { Shortcuts } from './components/Shortcuts';
import { useLocalStorage } from './hooks/useLocalStorage';
import { defaultSettings, Mode, Settings } from './types';
import { ListTodo, PenTool, Timer as TimerIcon, Settings as SettingsIcon, Monitor, Focus, Ghost, Maximize } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [settings, setSettings] = useLocalStorage<Settings>('dashboard_settings', defaultSettings);
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
      clearTimeout(timer);
    };
    
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('touchstart', resetIdle);
    resetIdle();
    
    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('touchstart', resetIdle);
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

  let allQuotes: string[] = (settings.customQuotes || '').split('\n').map(l => l.trim()).filter(Boolean);

  const hash = new Date().toDateString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let todaysQuote = "";
  if (allQuotes.length > 0) {
     todaysQuote = allQuotes[hash % allQuotes.length];
  }

  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  const isAmbientUIHidden = mode === 'ambient' && idle;
  const isFocusMode = mode === 'focus';

  const getBgStyle = () => {
    if (settings.bgType === 'solid') return { backgroundColor: settings.bgSolidColor ?? '#0a0a0a' };
    if (settings.bgType === 'gradient') return { background: `linear-gradient(${settings.bgGradientDir ?? 'to right'}, ${settings.bgGradientStart ?? '#7432FF'}, ${settings.bgGradientEnd ?? '#000000'})` };
    if (settings.bgType === 'dark') return { backgroundColor: '#0a0a0a' };
    return {};
  };

  return (
    <div className="relative w-screen h-dvh overflow-hidden text-white font-mono bg-black selection:bg-accent selection:text-white">
      
      {/* Background layer */}
      <div className="absolute inset-0 z-0 bg-neutral-950 transition-all duration-1000 ease-in-out" style={settings.bgType !== 'image' ? getBgStyle() : {}}>
         {settings.bgType === 'image' && settings.bgImage && (
           <img 
             src={settings.bgImage} 
             alt="" 
             className="w-full h-full object-cover transition-all duration-1000 ease-in-out" 
             style={{ filter: `blur(${settings.bgBlur || 0}px)` }} 
           />
         )}
      </div>

      {/* Dim Overlay */}
      {settings.bgType !== 'dark' && (
        <div 
          className="absolute inset-0 z-10 transition-all duration-1000 ease-in-out pointer-events-none" 
          style={{ backgroundColor: `rgba(0,0,0, ${(settings.bgOverlay ?? 50) / 100})` }} 
        />
      )}

      {/* Focus Mode heavy dim */}
      <div className={`absolute inset-0 z-20 bg-black/80 backdrop-blur-sm transition-all duration-1000 pointer-events-none ${isFocusMode ? 'opacity-100' : 'opacity-0'}`} />

      {/* Main UI Layer */}
      <div className={`absolute inset-0 z-30 transition-opacity duration-[1500ms] ease-out ${isAmbientUIHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Top Left Greeting */}
        {settings.showGreeting && (
          <div className={`absolute top-6 left-6 md:top-12 md:left-12 transition-opacity duration-700 ${mode === 'ambient' ? 'opacity-0' : (isFocusMode ? 'opacity-20' : 'opacity-100')}`}>
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] text-white/80 glass-panel px-5 py-3 rounded-2xl w-fit">
              Hey, <span className="text-accent">{settings.name}</span>
            </div>
          </div>
        )}

        {/* Top Right Quote */}
        {settings.showQuote && todaysQuote && (
          <div className={`absolute top-6 right-6 md:top-12 md:right-12 max-w-[240px] md:max-w-[340px] text-right transition-opacity duration-700 z-40 ${mode === 'ambient' ? 'opacity-0' : (isFocusMode ? 'opacity-20' : 'opacity-100')}`}>
            <div className="text-xs md:text-sm opacity-90 italic font-serif tracking-wide leading-relaxed glass-panel px-6 py-5 rounded-3xl">
              "{todaysQuote}"
            </div>
          </div>
        )}

        {/* Center Clock & Hero */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-out ${isFocusMode ? 'scale-[0.6] opacity-30 translate-y-[-5%]' : ''}`}>
           {settings.showGreeting && (
             <motion.h1 
               layoutId="main-greeting"
               className={`text-xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2 md:mb-6 transition-opacity duration-700 drop-shadow-2xl ${mode === 'ambient' ? 'opacity-0' : 'opacity-90'} ${settings.clockFont === 'Serif' ? 'font-serif' : settings.clockFont === 'Inter' ? 'font-sans' : 'font-mono'}`}
             >
               {greeting}, {settings.name}.
             </motion.h1>
           )}
           <Clock 
             font={settings.clockFont} 
             use12h={settings.clock12h} 
             showSeconds={settings.clockSeconds} 
             fontSize={settings.clockFontSize}
             color={settings.clockColor}
             opacity={settings.clockOpacity}
           />
           
           {/* Shortcuts Grid (Only in Home Mode) */}
           {settings.showShortcuts && mode === 'home' && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full mt-4">
               <Shortcuts />
             </motion.div>
           )}
        </div>

        {/* Bottom Left Tools */}
        <div className={`absolute bottom-6 left-6 md:bottom-12 md:left-12 flex space-x-3 md:space-x-4 transition-opacity duration-700 ${mode === 'ambient' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {mode !== 'focus' && (
            <>
              {settings.showTasksBtn && (
                <div className="relative">
                  <button onClick={() => togglePanel('tasks')} className={`p-4 transition-all rounded-3xl glass-panel shadow-2xl group ${activePanel === 'tasks' ? 'bg-white/20 text-accent border-accent/40 shadow-[0_0_20px_rgba(116,50,255,0.3)]' : 'hover:bg-white/10 text-white/70 hover:text-white'}`} title="Tasks Ledger">
                    <ListTodo size={24} className={activePanel === 'tasks' ? 'scale-110 transition-transform' : 'group-hover:scale-110 transition-transform'} />
                  </button>
                  <AnimatePresence>
                    {activePanel === 'tasks' && (
                      <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-[120%] left-0 glass-panel p-8 rounded-[2rem] z-50">
                        <Tasks />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {settings.showNotepadBtn && (
                <div className="relative">
                  <button onClick={() => togglePanel('notepad')} className={`p-4 transition-all rounded-3xl glass-panel shadow-2xl group ${activePanel === 'notepad' ? 'bg-white/20 text-accent border-accent/40 shadow-[0_0_20px_rgba(116,50,255,0.3)]' : 'hover:bg-white/10 text-white/70 hover:text-white'}`} title="Scratchpad">
                    <PenTool size={24} className={activePanel === 'notepad' ? 'scale-110 transition-transform' : 'group-hover:scale-110 transition-transform'} />
                  </button>
                  <AnimatePresence>
                    {activePanel === 'notepad' && (
                      <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-[120%] left-0 glass-panel p-8 rounded-[2rem] z-50">
                        <Notepad />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}

          {settings.showTimerBtn && (
            <div className="relative z-[120]">
              <button 
                onClick={() => togglePanel('timer')} 
                className={`p-4 transition-all rounded-3xl glass-panel shadow-2xl group ${activePanel === 'timer' && !isFocusMode ? 'bg-white/20 text-accent border-accent/40 shadow-[0_0_20px_rgba(116,50,255,0.3)]' : 'hover:bg-white/10 text-white/70 hover:text-white pointer-events-auto'}`} 
                title="Focus Session"
              >
                <TimerIcon size={24} className={activePanel === 'timer' ? 'scale-110 transition-transform' : 'group-hover:scale-110 transition-transform'} />
              </button>
              <AnimatePresence>
                {activePanel === 'timer' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} 
                    className={isFocusMode ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] bg-transparent pointer-events-auto scale-125 drop-shadow-2xl" : "absolute bottom-[120%] left-0 glass-panel p-8 rounded-[2rem] z-50 shadow-2xl"}
                  >
                    <Timer defaultFocus={settings.focusDuration} defaultBreak={settings.breakDuration} isFocusMode={isFocusMode} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Bottom Center Mode Toggles */}
        <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-12 flex space-x-2 md:space-x-4 transition-opacity duration-700 glass-panel px-6 py-4 rounded-full shadow-2xl z-[150] ${mode === 'ambient' ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
          <button onClick={() => setMode('home')} className={`p-2 transition-all hover:scale-110 rounded-full ${mode === 'home' ? 'text-accent bg-accent/20' : 'text-white/40 hover:text-white hover:bg-white/10'}`} title="Desktop View">
            <Monitor size={20} />
          </button>
          <button onClick={() => { setMode('focus'); setActivePanel('timer'); }} className={`p-2 transition-all hover:scale-110 rounded-full ${mode === 'focus' ? 'text-accent bg-accent/20' : 'text-white/40 hover:text-white hover:bg-white/10'}`} title="Deep Focus">
            <Focus size={20} />
          </button>
          <button onClick={() => setMode('ambient')} className={`p-2 transition-all hover:scale-110 rounded-full ${mode === 'ambient' ? 'text-accent bg-accent/20' : 'text-white/40 hover:text-white hover:bg-white/10'}`} title="Ambient">
            <Ghost size={20} />
          </button>
        </div>

        {/* Bottom Right Actions */}
        <div className={`absolute bottom-6 right-6 md:bottom-12 md:right-12 flex space-x-3 transition-opacity duration-700 ${mode !== 'home' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button onClick={() => document.documentElement.requestFullscreen()} className="p-4 text-white/50 hover:text-white glass-panel rounded-3xl transition-all hover:scale-105 group shadow-2xl" title="Fullscreen">
            <Maximize size={22} className="group-hover:scale-110 transition-transform duration-300" />
          </button>
          <button onClick={() => setShowSettings(true)} className="p-4 text-white/50 hover:text-white glass-panel rounded-3xl transition-all hover:scale-105 group shadow-2xl" title="Configuration">
            <SettingsIcon size={22} className="group-hover:rotate-90 transition-transform duration-500" />
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
