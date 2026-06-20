import { useState, useRef } from 'react';
import { Settings as SettingsType } from '../types';
import { X, Upload, Trash } from 'lucide-react';
import { motion } from 'motion/react';

export function SettingsDrawer({ 
  settings, 
  setSettings, 
  onClose 
}: { 
  settings: SettingsType, 
  setSettings: (s: SettingsType) => void, 
  onClose: () => void 
}) {
  const [tab, setTab] = useState<'Appearance' | 'Personal' | 'Timer'>('Appearance');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, bgImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div 
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-black/90 backdrop-blur-2xl border-l border-white/10 p-10 flex flex-col z-50 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-lg font-bold uppercase tracking-widest text-accent">Config</h2>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors"><X size={24} /></button>
      </div>

      <div className="flex space-x-6 mb-10 border-b border-white/10 pb-4 text-[10px] uppercase tracking-[0.2em]">
        {['Appearance', 'Personal', 'Timer'].map(t => (
          <button 
            key={t} 
            onClick={() => setTab(t as any)}
            className={`transition-colors ${tab === t ? 'text-white font-bold' : 'text-white/40 hover:text-white/80'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-10">
        {tab === 'Appearance' && (
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] uppercase text-white/50 tracking-widest mb-3">Background Image</label>
              <div className="flex items-center space-x-4">
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center space-x-2 text-xs bg-white/5 hover:bg-white/10 px-4 py-2 border border-white/10 hover:border-white/30 uppercase tracking-widest transition-all">
                  <Upload size={14} /> <span>Upload</span>
                </button>
                {settings.bgImage && (
                  <button onClick={() => setSettings({ ...settings, bgImage: null })} className="flex items-center space-x-2 text-xs text-red-400/80 hover:text-red-400 border border-transparent hover:border-red-400/30 px-3 py-2 uppercase tracking-widest transition-all" title="Clear Image">
                    <Trash size={16} />
                  </button>
                )}
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-3 text-[10px] uppercase tracking-widest">
                <label className="text-white/50">Background Blur</label>
                <span className="text-accent">{settings.bgBlur}px</span>
              </div>
              <input type="range" min="0" max="40" value={settings.bgBlur} onChange={e => setSettings({ ...settings, bgBlur: parseInt(e.target.value) })} className="w-full accent-accent h-1 bg-white/10 appearance-none rounded-full" />
            </div>

            <div>
              <div className="flex justify-between mb-3 text-[10px] uppercase tracking-widest">
                <label className="text-white/50">Dim Overlay</label>
                <span className="text-accent">{settings.bgOverlay}%</span>
              </div>
              <input type="range" min="0" max="100" value={settings.bgOverlay} onChange={e => setSettings({ ...settings, bgOverlay: parseInt(e.target.value) })} className="w-full accent-accent h-1 bg-white/10 appearance-none rounded-full" />
            </div>

            <div>
               <label className="block text-[10px] uppercase text-white/50 tracking-widest mb-3">Clock Font</label>
               <select value={settings.clockFont} onChange={e => setSettings({ ...settings, clockFont: e.target.value as any })} className="w-full bg-transparent border-b border-white/20 pb-2 text-sm uppercase tracking-wider focus:border-accent">
                 <option value="Monospace" className="bg-black text-white">JetBrains Mono</option>
                 <option value="Inter" className="bg-black text-white">Inter Sans</option>
                 <option value="Serif" className="bg-black text-white">Playfair Serif</option>
               </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="text-[10px] uppercase text-white/50 tracking-widest cursor-pointer" htmlFor="toggle12h">Toggle 24H Format</label>
              <input type="checkbox" id="toggle12h" checked={!settings.clock12h} onChange={e => setSettings({ ...settings, clock12h: !e.target.checked })} className="accent-accent w-4 h-4 cursor-pointer focus:ring-accent" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="text-[10px] uppercase text-white/50 tracking-widest cursor-pointer" htmlFor="toggleSecs">Display Seconds</label>
              <input type="checkbox" id="toggleSecs" checked={settings.clockSeconds} onChange={e => setSettings({ ...settings, clockSeconds: e.target.checked })} className="accent-accent w-4 h-4 cursor-pointer focus:ring-accent" />
            </div>
          </div>
        )}

        {tab === 'Personal' && (
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] uppercase text-white/50 tracking-widest mb-3">Your Designation</label>
              <input type="text" value={settings.name} onChange={e => setSettings({ ...settings, name: e.target.value })} className="w-full text-sm uppercase tracking-wider border-b border-white/20 pb-2 focus:border-accent" />
            </div>
            
            <div>
               <label className="block text-[10px] uppercase text-white/50 tracking-widest mb-3">Quote Curation</label>
               <select value={settings.quoteCategory} onChange={e => setSettings({ ...settings, quoteCategory: e.target.value as any })} className="w-full bg-transparent border-b border-white/20 pb-2 text-sm uppercase tracking-wider focus:border-accent">
                 <option value="All" className="bg-black text-white">All Spheres</option>
                 <option value="Motivational" className="bg-black text-white">Motivation / Drive</option>
                 <option value="Self Care" className="bg-black text-white">Self Care / Zen</option>
               </select>
            </div>
          </div>
        )}

        {tab === 'Timer' && (
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] uppercase text-white/50 tracking-widest mb-3">Focus Session Length (m)</label>
              <input type="number" min="1" max="120" value={settings.focusDuration} onChange={e => setSettings({ ...settings, focusDuration: Math.max(1, parseInt(e.target.value) || 25) })} className="w-full text-lg uppercase tracking-wider border-b border-white/20 pb-2 focus:border-accent" />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-white/50 tracking-widest mb-3">Recovery Break Length (m)</label>
              <input type="number" min="1" max="30" value={settings.breakDuration} onChange={e => setSettings({ ...settings, breakDuration: Math.max(1, parseInt(e.target.value) || 5) })} className="w-full text-lg uppercase tracking-wider border-b border-white/20 pb-2 focus:border-accent" />
            </div>
          </div>
        )}
      </div>

    </motion.div>
  );
}
