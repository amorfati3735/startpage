import { useState, useRef } from 'react';
import { Settings as SettingsType } from '../types';
import { X, Upload, Trash, Download, Settings as Cog, FileJson } from 'lucide-react';
import { motion } from 'motion/react';

const FONTS = [
  'Inter', 'Space Grotesk', 'DM Sans', 'Outfit', 'Syne', 'Raleway',
  'Playfair Display', 'Cormorant Garamond', 'Lora', 'Merriweather', 'EB Garamond',
  'JetBrains Mono', 'Fira Code', 'IBM Plex Mono', 'Space Mono', 'Courier Prime', 'Inconsolata',
  'Bebas Neue', 'Anton', 'Oswald', 'Barlow Condensed', 'Archivo Black', 'Righteous', 'Orbitron', 'Exo 2', 'Rajdhani', 'Oxanium'
];

function Toggle({ checked, onChange, label }: { checked: boolean, onChange: (v: boolean) => void, label: string }) {
  return (
    <label className="flex items-center justify-between cursor-pointer py-3 group">
      <span className="text-[11px] uppercase text-white/60 tracking-widest group-hover:text-white transition-colors flex-1 pr-4 leading-relaxed font-medium">{label}</span>
      <div className="relative shrink-0 flex items-center">
        <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className={`block w-11 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-accent' : 'bg-white/20'}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${checked ? 'translate-x-[20px]' : ''}`}></div>
      </div>
    </label>
  );
}

function Slider({ label, value, min, max, unit, onChange }: { label: string, value: number, min: number, max: number, unit?: string, onChange: (v: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="py-3 w-full select-none">
      <div className="flex justify-between mb-4 text-[10px] md:text-[11px] uppercase tracking-widest">
        <label className="text-white/60 font-medium">{label}</label>
        <span className="text-accent font-bold tabular-nums">{value}{unit}</span>
      </div>
      <div className="relative flex items-center w-full min-h-[40px]">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ background: `linear-gradient(to right, #7432FF ${pct}%, rgba(255,255,255,0.12) ${pct}%)` }}
          className="
            w-full h-1.5 rounded-full appearance-none cursor-pointer outline-none
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.5)]
            [&::-webkit-slider-thumb]:border
            [&::-webkit-slider-thumb]:border-white/20
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-150
            hover:[&::-webkit-slider-thumb]:shadow-[0_0_0_5px_rgba(116,50,255,0.2),0_2px_8px_rgba(0,0,0,0.5)]
            [&::-webkit-slider-thumb]:active:scale-95
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border
            [&::-moz-range-thumb]:border-white/20
            [&::-moz-range-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.5)]
            [&::-moz-range-track]:h-1.5
            [&::-moz-range-track]:rounded-full
            [&::-moz-range-track]:bg-transparent
            transition-all duration-150
          "
        />
      </div>
    </div>
  );
}

export function SettingsDrawer({ 
  settings, 
  setSettings, 
  onClose 
}: { 
  settings: SettingsType, 
  setSettings: (s: SettingsType) => void, 
  onClose: () => void 
}) {
  const [tab, setTab] = useState<'Appearance' | 'Personal' | 'Timer' | 'Layout' | 'Backup'>('Appearance');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, bgImage: reader.result as string, bgType: 'image' });
      };
      reader.readAsDataURL(file);
    }
  };

  const exportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({
        settings: JSON.parse(localStorage.getItem('dashboard_settings') || '{}'),
        shortcuts: JSON.parse(localStorage.getItem('dashboard_shortcuts') || '[]'),
        tasks: JSON.parse(localStorage.getItem('dashboard_tasks') || '[]'),
        notepad: JSON.parse(localStorage.getItem('dashboard_notepad') || '""')
      })
    );
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "startpage_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.settings) localStorage.setItem('dashboard_settings', JSON.stringify(parsed.settings));
          if (parsed.shortcuts) localStorage.setItem('dashboard_shortcuts', JSON.stringify(parsed.shortcuts));
          if (parsed.tasks) localStorage.setItem('dashboard_tasks', JSON.stringify(parsed.tasks));
          if (parsed.notepad) localStorage.setItem('dashboard_notepad', JSON.stringify(parsed.notepad));
          window.location.reload();
        } catch (e) {
          alert('Invalid backup file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <motion.div 
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-black/60 backdrop-blur-xl border-l border-white/[0.06] flex flex-col z-50 shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
      {/* Header */}
      <div className="flex-shrink-0 flex justify-between items-center p-6 border-b border-white/10">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-3">
          <Cog size={16} className="text-accent"/> Config
        </h2>
        <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex-shrink-0 border-b border-white/5">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide p-4">
          {['Appearance', 'Personal', 'Timer', 'Layout', 'Backup'].map(t => (
            <button 
              key={t} 
              onClick={() => setTab(t as any)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[10px] md:text-xs uppercase tracking-widest font-bold transition-all ${
                tab === t ? 'bg-white text-black drop-shadow-md' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 pb-4 custom-scrollbar">
        {tab === 'Appearance' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
            
            <div className="space-y-6">
              <h3 className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/10 pb-2">Canvas</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'image', label: 'Image' },
                  { id: 'solid', label: 'Solid Color' },
                  { id: 'gradient', label: 'Gradient' },
                  { id: 'dark', label: 'Pure Dark' }
                ].map(bg => (
                  <button key={bg.id} onClick={() => setSettings({ ...settings, bgType: bg.id as any })} className={`py-4 px-4 rounded-2xl text-xs uppercase tracking-widest transition-all border ${settings.bgType === bg.id ? 'bg-accent/20 border-accent text-white shadow-[0_0_15px_rgba(116,50,255,0.3)]' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}>
                    {bg.label}
                  </button>
                ))}
              </div>

              {settings.bgType === 'image' && (
                <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
                  {settings.bgImage && <img src={settings.bgImage} className="w-16 h-16 object-cover rounded-xl shadow-lg" alt="" />}
                  <div className="flex-1 flex gap-3">
                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex justify-center items-center gap-2 text-xs bg-white/10 hover:bg-white/20 py-3 rounded-xl uppercase tracking-widest transition-all font-bold">
                      <Upload size={16} /> Upload
                    </button>
                    {settings.bgImage && (
                      <button onClick={() => setSettings({ ...settings, bgImage: null })} className="px-4 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-xl transition-colors">
                        <Trash size={16} />
                      </button>
                    )}
                  </div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                </div>
              )}

              {settings.bgType === 'solid' && (
                 <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5 mt-4">
                   <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-inner">
                     <input type="color" value={settings.bgSolidColor ?? '#0a0a0a'} onChange={e => setSettings({ ...settings, bgSolidColor: e.target.value })} className="absolute -inset-4 w-20 h-20 cursor-pointer p-0 border-none" />
                   </div>
                   <span className="text-sm uppercase tracking-widest text-white/80 font-mono font-bold">{settings.bgSolidColor ?? '#0a0a0a'}</span>
                 </div>
              )}

              {settings.bgType === 'gradient' && (
                 <div className="bg-white/5 p-5 rounded-2xl border border-white/5 mt-4">
                   <div className="flex items-center flex-wrap gap-6">
                     <div className="flex flex-col gap-3">
                       <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Start Color</label>
                       <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-inner">
                         <input type="color" value={settings.bgGradientStart ?? '#7432FF'} onChange={e => setSettings({ ...settings, bgGradientStart: e.target.value })} className="absolute -inset-4 w-20 h-20 cursor-pointer p-0 border-none" />
                       </div>
                     </div>
                     <div className="flex flex-col gap-3">
                       <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">End Color</label>
                       <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-inner">
                         <input type="color" value={settings.bgGradientEnd ?? '#000000'} onChange={e => setSettings({ ...settings, bgGradientEnd: e.target.value })} className="absolute -inset-4 w-20 h-20 cursor-pointer p-0 border-none" />
                       </div>
                     </div>
                     <div className="flex flex-col gap-3 w-full sm:w-auto sm:flex-1 sm:pl-6 sm:border-l border-white/10 mt-2 sm:mt-0">
                       <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Direction</label>
                       <select value={settings.bgGradientDir ?? 'to right'} onChange={e => setSettings({ ...settings, bgGradientDir: e.target.value })} className="bg-white/5 border border-white/10 text-xs py-3 px-4 rounded-xl cursor-pointer hover:bg-white/10 transition-colors focus:outline-none focus:border-accent">
                         <option value="to right" className="bg-black text-white">Left to Right</option>
                         <option value="to bottom" className="bg-black text-white">Top to Bottom</option>
                         <option value="135deg" className="bg-black text-white">Diagonal</option>
                       </select>
                     </div>
                   </div>
                 </div>
              )}

              {settings.bgType !== 'dark' && (
                <div className="space-y-4 pt-4">
                  <Slider label="Background Blur" value={settings.bgBlur ?? 0} min={0} max={60} unit="px" onChange={v => setSettings({ ...settings, bgBlur: v })} />
                  <Slider label="Dim Overlay" value={settings.bgOverlay ?? 50} min={0} max={100} unit="%" onChange={v => setSettings({ ...settings, bgOverlay: v })} />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/10 pb-2">Clock Appearance</h3>
              
              <Slider label="Clock Size" value={settings.clockFontSize ?? 12} min={4} max={30} unit="vw" onChange={v => setSettings({ ...settings, clockFontSize: v })} />
              
              <div className="flex items-center gap-6 bg-white/5 p-5 rounded-2xl border border-white/5 mt-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-inner">
                  <input type="color" value={settings.clockColor ?? '#ffffff'} onChange={e => setSettings({ ...settings, clockColor: e.target.value })} className="absolute -inset-4 w-20 h-20 cursor-pointer p-0 border-none" />
                </div>
                <div className="flex-1 pr-2">
                  <Slider label="Fill Opacity" value={settings.clockOpacity ?? 90} min={10} max={100} unit="%" onChange={v => setSettings({ ...settings, clockOpacity: v })} />
                </div>
              </div>

              <div className="bg-white/5 p-2 rounded-2xl border border-white/5 pt-0 px-4 mt-4">
                <Toggle label="Toggle 24H Format" checked={!settings.clock12h} onChange={v => setSettings({ ...settings, clock12h: !v })} />
                <div className="w-full h-px bg-white/5" />
                <Toggle label="Display Seconds" checked={settings.clockSeconds} onChange={v => setSettings({ ...settings, clockSeconds: v })} />
              </div>
              
              <div className="pt-4">
                <label className="block text-[11px] uppercase text-white/60 tracking-widest font-bold mb-4">Typography Foundry</label>
                <div className="grid grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-3 custom-scrollbar">
                  {FONTS.map(font => (
                    <button 
                      key={font} 
                      onClick={() => setSettings({ ...settings, clockFont: font })}
                      className={`text-left p-4 rounded-xl transition-all cursor-pointer truncate text-[15px] hover:scale-[1.02] active:scale-[0.98] ${settings.clockFont === font ? 'bg-white text-black font-bold shadow-lg shadow-white/20' : 'bg-white/5 border border-white/5 text-white/80 hover:bg-white/10'}`}
                      style={{ fontFamily: `"${font}", sans-serif` }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {tab === 'Personal' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-6">
              <h3 className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/10 pb-2">Personal</h3>
              <div>
                <label className="block text-[11px] uppercase text-white/60 tracking-widest font-bold mb-3">Name</label>
                <input type="text" value={settings.name} onChange={e => setSettings({ ...settings, name: e.target.value })} className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-lg uppercase tracking-wider focus:bg-white/10 focus:outline-none focus:border-accent/50 transition-all placeholder-white/20" placeholder="Enter name" />
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <Toggle label="Show Greeting Line" checked={settings.showGreeting} onChange={v => setSettings({ ...settings, showGreeting: v })} />
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/10 pb-2">Quotes</h3>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <Toggle label="Show Daily Quote" checked={settings.showQuote} onChange={v => setSettings({ ...settings, showQuote: v })} />
              </div>
              
              <div className={`transition-opacity duration-300 ${!settings.showQuote ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                <div className="mt-6 space-y-4">
                  <label className="block text-[11px] uppercase text-white/60 tracking-widest font-bold">My Quotes</label>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider leading-relaxed">Enter one quote per line. A random quote will be picked from this list every day.</p>
                  <textarea 
                    value={settings.customQuotes || ''} 
                    onChange={e => setSettings({ ...settings, customQuotes: e.target.value })} 
                    className="w-full h-56 bg-white/5 border border-white/5 p-5 rounded-2xl text-sm leading-relaxed focus:bg-white/10 focus:outline-none focus:border-accent/50 resize-none transition-all placeholder-white/20 custom-scrollbar"
                    placeholder={"First quote\nSecond quote"}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'Timer' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/10 pb-2">Session Settings</h3>
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <Slider label="Focus Duration" value={settings.focusDuration ?? 25} min={1} max={120} unit="m" onChange={v => setSettings({ ...settings, focusDuration: v })} />
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <Slider label="Break Duration" value={settings.breakDuration ?? 5} min={1} max={60} unit="m" onChange={v => setSettings({ ...settings, breakDuration: v })} />
              </div>
            </div>
          </div>
        )}

        {tab === 'Layout' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
             <h3 className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/10 pb-2">Features</h3>
             <div className="bg-white/5 px-5 py-2 rounded-2xl border border-white/5">
               <Toggle label="Enable Shortcuts Grid" checked={settings.showShortcuts} onChange={v => setSettings({ ...settings, showShortcuts: v })} />
             </div>
             
             <div className="space-y-4 mt-8">
               <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4">Bottom Dock Icons</h3>
               <div className="bg-white/5 px-5 py-2 rounded-2xl border border-white/5">
                 <Toggle label="Tasks" checked={settings.showTasksBtn} onChange={v => setSettings({ ...settings, showTasksBtn: v })} />
                 <div className="w-full h-px bg-white/5" />
                 <Toggle label="Notepad" checked={settings.showNotepadBtn} onChange={v => setSettings({ ...settings, showNotepadBtn: v })} />
                 <div className="w-full h-px bg-white/5" />
                 <Toggle label="Focus Timer" checked={settings.showTimerBtn} onChange={v => setSettings({ ...settings, showTimerBtn: v })} />
               </div>
             </div>


          </div>
        )}

        {tab === 'Backup' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 pb-20">
             <h3 className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/10 pb-2">Persistance Checkpoint</h3>
             <p className="text-xs text-white/60 leading-relaxed font-sans bg-white/5 p-6 rounded-2xl border border-white/5">
               All your configuration, tasks, notes, and shortcuts are stored securely in local browser storage. You can pull an extraction backup to a file, or inject a prior state.
             </p>
             
             <div className="space-y-4 pt-4">
               <button onClick={exportBackup} className="w-full py-5 rounded-2xl bg-accent text-white font-bold uppercase tracking-[0.1em] flex items-center justify-center gap-3 hover:bg-accent/80 transition-colors shadow-lg hover:shadow-accent/40 active:scale-[0.98]">
                 <Download size={20} /> Pull Backup State
               </button>
               
               <button onClick={() => importRef.current?.click()} className="w-full py-5 rounded-2xl bg-white/10 text-white font-bold uppercase tracking-[0.1em] flex items-center justify-center gap-3 hover:bg-white/20 transition-colors shadow-lg active:scale-[0.98]">
                 <FileJson size={20} /> Inject Backup State
               </button>
               <input type="file" accept=".json" onChange={importBackup} ref={importRef} className="hidden" />
             </div>

             <div className="pt-16 mt-16 flex justify-center">
               <button 
                 onClick={() => {
                   if (confirm('CRITICAL ACTION. This will wipe all tasks, notes, shortcuts, and settings from this browser. Proceed?')) {
                     localStorage.clear();
                     window.location.reload();
                   }
                 }} 
                 className="text-[10px] bg-red-500/10 hover:bg-red-500/20 px-6 py-3 rounded-full uppercase tracking-widest text-red-500/80 hover:text-red-400 font-bold transition-colors"
               >
                 Nuke DB & Format
               </button>
             </div>
          </div>
        )}
      </div>

      <button onClick={onClose} className="flex-shrink-0 w-full py-5 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold text-white/40 hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border-t border-white/[0.06] transition-all active:scale-[0.98]" title="Close">
        <X size={18} /> Close
      </button>
    </motion.div>
  );
}
