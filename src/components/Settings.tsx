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
      <span className="text-[11px] uppercase text-white/60 tracking-widest group-hover:text-white transition-colors flex-1 pr-4 leading-relaxed">{label}</span>
      <div className="relative shrink-0">
        <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className={`block w-12 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-accent' : 'bg-white/10 group-hover:bg-white/20'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${checked ? 'translate-x-6' : ''}`}></div>
      </div>
    </label>
  );
}

function Slider({ label, value, min, max, unit, onChange }: { label: string, value: number, min: number, max: number, unit?: string, onChange: (v: number) => void }) {
  return (
    <div className="py-2">
      <div className="flex justify-between mb-3 text-[11px] uppercase tracking-widest">
        <label className="text-white/60">{label}</label>
        <span className="text-accent font-bold">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} className="w-full accent-accent h-2.5 bg-white/10 appearance-none rounded-full cursor-pointer hover:bg-white/20 transition-colors" />
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
      className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] glass-panel p-6 md:p-10 flex flex-col z-50 overflow-y-auto custom-scrollbar"
    >
      <div className="flex justify-between items-center mb-8 sticky top-0 bg-black/60 backdrop-blur-xl p-4 -mt-6 -mx-6 md:-mt-10 md:-mx-10 border-b border-white/5 z-20">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-3"><Cog size={16} className="text-accent"/> Config</h2>
        <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"><X size={20} /></button>
      </div>

      <div className="flex space-x-2 mb-10 overflow-x-auto pb-4 scrollbar-hide hide-scroll gap-2 sticky top-14 z-10 bg-black/40 backdrop-blur-md p-2 -mx-2 rounded-2xl">
        {['Appearance', 'Personal', 'Timer', 'Layout', 'Backup'].map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t as any)}
            className={`whitespace-nowrap px-5 py-3 rounded-full text-[10px] sm:text-xs uppercase tracking-widest transition-all font-bold ${tab === t ? 'bg-white text-black shadow-lg shadow-white/20' : 'bg-white/5 text-white/50 hover:bg-white/15 hover:text-white'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1">
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
                 <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
                   <input type="color" value={settings.bgSolidColor} onChange={e => setSettings({ ...settings, bgSolidColor: e.target.value })} className="w-12 h-12 rounded-xl cursor-pointer shrink-0 bg-transparent border-none p-0" />
                   <span className="text-sm uppercase tracking-widest text-white/60 font-bold">{settings.bgSolidColor}</span>
                 </div>
              )}

              {settings.bgType === 'gradient' && (
                 <div className="space-y-5 bg-white/5 p-5 rounded-2xl border border-white/5">
                   <div className="flex items-center gap-6">
                     <div className="flex flex-col gap-2">
                       <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Color 1</label>
                       <input type="color" value={settings.bgGradientStart} onChange={e => setSettings({ ...settings, bgGradientStart: e.target.value })} className="w-12 h-12 rounded-xl cursor-pointer shrink-0 bg-transparent border-none p-0" />
                     </div>
                     <div className="flex flex-col gap-2">
                       <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Color 2</label>
                       <input type="color" value={settings.bgGradientEnd} onChange={e => setSettings({ ...settings, bgGradientEnd: e.target.value })} className="w-12 h-12 rounded-xl cursor-pointer shrink-0 bg-transparent border-none p-0" />
                     </div>
                     <div className="flex flex-col gap-2 w-full pl-6 border-l border-white/10">
                       <label className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-1">Direction</label>
                       <select value={settings.bgGradientDir} onChange={e => setSettings({ ...settings, bgGradientDir: e.target.value })} className="bg-black/50 border border-white/10 text-xs py-3 px-4 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                         <option value="to right">Left to Right</option>
                         <option value="to bottom">Top to Bottom</option>
                         <option value="135deg">Diagonal</option>
                       </select>
                     </div>
                   </div>
                 </div>
              )}

              {settings.bgType !== 'dark' && (
                <div className="space-y-4 pt-4">
                  <Slider label="Background Blur" value={settings.bgBlur} min={0} max={60} unit="px" onChange={v => setSettings({ ...settings, bgBlur: v })} />
                  <Slider label="Dim Overlay" value={settings.bgOverlay} min={0} max={100} unit="%" onChange={v => setSettings({ ...settings, bgOverlay: v })} />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/10 pb-2">Clock Appearance</h3>
              
              <Slider label="Clock Size" value={settings.clockFontSize} min={4} max={30} unit="vw" onChange={v => setSettings({ ...settings, clockFontSize: v })} />
              
              <div className="flex items-center gap-6 bg-white/5 p-5 rounded-2xl border border-white/5">
                <input type="color" value={settings.clockColor} onChange={e => setSettings({ ...settings, clockColor: e.target.value })} className="w-12 h-12 rounded-xl cursor-pointer shrink-0 bg-transparent border-none p-0" />
                <div className="flex-1 pr-2">
                  <Slider label="Fill Opacity" value={settings.clockOpacity} min={10} max={100} unit="%" onChange={v => setSettings({ ...settings, clockOpacity: v })} />
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
              <h3 className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/10 pb-2">Identity</h3>
              <div>
                <label className="block text-[11px] uppercase text-white/60 tracking-widest font-bold mb-3">Your Designation</label>
                <input type="text" value={settings.name} onChange={e => setSettings({ ...settings, name: e.target.value })} className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-lg uppercase tracking-wider focus:bg-white/10 focus:border-accent/50 transition-all" placeholder="Enter name" />
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <Toggle label="Show Greeting Line" checked={settings.showGreeting} onChange={v => setSettings({ ...settings, showGreeting: v })} />
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/10 pb-2">Inspiration</h3>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <Toggle label="Show Daily Quote" checked={settings.showQuote} onChange={v => setSettings({ ...settings, showQuote: v })} />
              </div>
              
              <div className={`transition-opacity duration-300 ${!settings.showQuote ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                <label className="block text-[11px] uppercase text-white/60 tracking-widest font-bold mb-3 mt-6">Built-in Rotation</label>
                <select value={settings.quoteCategory} onChange={e => setSettings({ ...settings, quoteCategory: e.target.value as any })} className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm uppercase tracking-wider focus:bg-white/10 focus:border-accent/50 cursor-pointer transition-all">
                  <option value="All" className="bg-black text-white">All Spheres</option>
                  <option value="Motivational" className="bg-black text-white">Motivation / Drive</option>
                  <option value="Self Care" className="bg-black text-white">Self Care / Zen</option>
                </select>

                <div className="mt-10 space-y-4">
                  <label className="block text-[11px] uppercase text-white/60 tracking-widest font-bold">My Arsenal (Custom)</label>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider leading-relaxed">Enter one quote per line. These inject into the general rotation.</p>
                  <textarea 
                    value={settings.customQuotes} 
                    onChange={e => setSettings({ ...settings, customQuotes: e.target.value })} 
                    className="w-full h-40 bg-white/5 border border-white/5 p-5 rounded-2xl text-sm leading-relaxed focus:bg-white/10 focus:border-accent/50 resize-none transition-all placeholder-white/20"
                    placeholder={"First custom quote\nSecond custom quote"}
                  />
                  <div className="mt-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <Toggle label="Only Use Custom Quotes" checked={settings.useOnlyCustomQuotes} onChange={v => setSettings({ ...settings, useOnlyCustomQuotes: v })} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'Timer' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/10 pb-2">Session Tuning</h3>
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <Slider label="Focus Pipeline Length" value={settings.focusDuration} min={1} max={120} unit="m" onChange={v => setSettings({ ...settings, focusDuration: v })} />
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <Slider label="Recovery Cycle Length" value={settings.breakDuration} min={1} max={60} unit="m" onChange={v => setSettings({ ...settings, breakDuration: v })} />
              </div>
            </div>
          </div>
        )}

        {tab === 'Layout' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
             <h3 className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/10 pb-2">Modules</h3>
             <div className="bg-white/5 px-5 py-2 rounded-2xl border border-white/5">
               <Toggle label="Enable Shortcuts Grid" checked={settings.showShortcuts} onChange={v => setSettings({ ...settings, showShortcuts: v })} />
             </div>
             
             <div className="space-y-4 mt-8">
               <h3 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4">Bottom Dock Nodes</h3>
               <div className="bg-white/5 px-5 py-2 rounded-2xl border border-white/5">
                 <Toggle label="Tasks Ledger" checked={settings.showTasksBtn} onChange={v => setSettings({ ...settings, showTasksBtn: v })} />
                 <div className="w-full h-px bg-white/5" />
                 <Toggle label="Scratchpad" checked={settings.showNotepadBtn} onChange={v => setSettings({ ...settings, showNotepadBtn: v })} />
                 <div className="w-full h-px bg-white/5" />
                 <Toggle label="Focus Timer" checked={settings.showTimerBtn} onChange={v => setSettings({ ...settings, showTimerBtn: v })} />
               </div>
             </div>

             <div className="mt-10">
               <label className="block text-[11px] uppercase text-white/60 tracking-widest font-bold mb-4">Ambient Idle Timeout</label>
               <select value={settings.ambientIdleTimeout} onChange={e => setSettings({ ...settings, ambientIdleTimeout: Number(e.target.value) })} className="w-full bg-white/5 border border-white/5 p-5 rounded-2xl text-sm uppercase tracking-wider focus:bg-white/10 focus:border-accent/50 cursor-pointer transition-all">
                 <option value={30} className="bg-black text-white">30 Seconds</option>
                 <option value={60} className="bg-black text-white">1 Minute</option>
                 <option value={120} className="bg-black text-white">2 Minutes</option>
                 <option value={300} className="bg-black text-white">5 Minutes</option>
               </select>
             </div>
          </div>
        )}

        {tab === 'Backup' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
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
    </motion.div>
  );
}
