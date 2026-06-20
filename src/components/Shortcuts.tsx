import { useState, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Shortcut } from '../types';
import { Plus, X, Edit2, Check, Upload, Image as ImageIcon, Globe, Mail, Calendar, Youtube, Github, Twitter, Linkedin, PenTool, Terminal, Code, Camera, Map, ShoppingCart, MessageCircle, FileText } from 'lucide-react';
import { Reorder } from 'motion/react';

const ICONS = {
  Globe, Mail, Calendar, Youtube, Github, Twitter, Linkedin, PenTool, Terminal, Code, Camera, Map, ShoppingCart, MessageCircle, FileText
};

export function Shortcuts() {
  const [shortcuts, setShortcuts] = useLocalStorage<Shortcut[]>('dashboard_shortcuts', []);
  const [isEditing, setIsEditing] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [iconType, setIconType] = useState<'favicon' | 'lucide' | 'custom'>('favicon');
  const [iconValue, setIconValue] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconValue(reader.result as string);
        setIconType('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const addShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    let normalizedUrl = newUrl.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    let domain = '';
    try {
      domain = new URL(normalizedUrl).hostname;
    } catch {
      domain = normalizedUrl;
    }

    setShortcuts([...shortcuts, {
      id: crypto.randomUUID(),
      url: normalizedUrl,
      label: newLabel.trim() || domain.replace('www.', ''),
      iconType,
      iconValue
    }]);
    setNewUrl('');
    setNewLabel('');
    setIconType('favicon');
    setIconValue('');
  };

  const removeShortcut = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShortcuts(shortcuts.filter(s => s.id !== id));
  };

  const renderIcon = (shortcut: Shortcut, sizeClass: string = "w-8 h-8 sm:w-10 sm:h-10 mb-2 opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-md rounded") => {
    if (shortcut.iconType === 'custom' && shortcut.iconValue) {
      return <img src={shortcut.iconValue} alt="" className={`${sizeClass} object-cover`} />;
    }
    if (shortcut.iconType === 'lucide' && shortcut.iconValue && ICONS[shortcut.iconValue as keyof typeof ICONS]) {
      const Icon = ICONS[shortcut.iconValue as keyof typeof ICONS];
      return <Icon className={`${sizeClass} text-white`} strokeWidth={1.5} />;
    }
    return <img src={`https://www.google.com/s2/favicons?sz=64&domain=${shortcut.url}`} alt="" className={sizeClass} onError={(e) => { e.currentTarget.style.display = 'none'; }} />;
  };

  return (
    <div className="mt-12 w-full px-4 flex flex-col items-center mx-auto">
      {!isEditing && shortcuts.length > 0 && (
         <Reorder.Group axis="x" values={shortcuts} onReorder={setShortcuts} className="flex flex-wrap justify-center gap-4">
           {shortcuts.map(shortcut => (
             <Reorder.Item key={shortcut.id} value={shortcut} className="relative group cursor-pointer z-10 w-20 h-20 sm:w-24 sm:h-24">
               <a href={shortcut.url} className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl glass-panel group-hover:bg-white/10 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_16px_40px_0_rgba(0,0,0,0.5)]">
                 {renderIcon(shortcut)}
                 <span className="text-[9px] sm:text-[10px] w-full text-center truncate px-2 font-sans opacity-70 group-hover:opacity-100 capitalize tracking-wide">{shortcut.label}</span>
               </a>
             </Reorder.Item>
           ))}
         </Reorder.Group>
      )}

      {isEditing && (
        <Reorder.Group axis="x" values={shortcuts} onReorder={setShortcuts} className="flex flex-wrap justify-center gap-4 mb-8">
           {shortcuts.map(shortcut => (
             <Reorder.Item key={shortcut.id} value={shortcut} className="relative cursor-grab active:cursor-grabbing w-20 h-20 sm:w-24 sm:h-24 z-10">
               <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl glass-panel border border-dashed border-white/20 hover:border-white/40 transition-colors">
                 {renderIcon(shortcut, "w-8 h-8 sm:w-10 sm:h-10 mb-2 opacity-40 rounded")}
                 <span className="text-[9px] sm:text-[10px] w-full text-center truncate px-2 font-sans opacity-40">{shortcut.label}</span>
               </div>
               <button onClick={(e) => removeShortcut(shortcut.id, e)} className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full hover:scale-110 transition-transform shadow-lg z-20">
                 <X size={14} />
               </button>
             </Reorder.Item>
           ))}
        </Reorder.Group>
      )}
      
      {isEditing && (
        <form onSubmit={addShortcut} className="glass-panel p-6 rounded-3xl flex flex-col gap-4 mt-4 w-full max-w-xl mx-auto relative z-10 shadow-2xl border border-white/10">
          <div className="flex flex-col sm:flex-row items-center gap-3">
             <div className="w-12 h-12 shrink-0 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
               {iconType === 'custom' && iconValue ? (
                 <img src={iconValue} alt="Custom" className="w-full h-full object-cover" />
               ) : iconType === 'lucide' && iconValue && ICONS[iconValue as keyof typeof ICONS] ? (
                 (() => { const Icon = ICONS[iconValue as keyof typeof ICONS]; return <Icon size={24} className="text-white/80" />; })()
               ) : (
                 <Globe size={24} className="text-white/40" />
               )}
             </div>
             <div className="flex-1 flex gap-2 w-full">
               <input type="text" placeholder="https://..." value={newUrl} onChange={e => setNewUrl(e.target.value)} className="w-full bg-black/40 border border-white/10 focus:border-accent hover:border-white/30 rounded-xl px-4 py-3 text-sm transition-colors outline-none placeholder-white/30" required />
               <input type="text" placeholder="Title" value={newLabel} onChange={e => setNewLabel(e.target.value)} className="w-full bg-black/40 border border-white/10 focus:border-accent hover:border-white/30 rounded-xl px-4 py-3 text-sm transition-colors outline-none placeholder-white/30" />
             </div>
          </div>
          
          <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
            <div className="flex gap-2 items-center">
              <button type="button" onClick={() => { setIconType('favicon'); setIconValue(''); }} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors ${iconType === 'favicon' ? 'bg-white/20 text-white' : 'bg-transparent hover:bg-white/5 text-white/50'}`}>Favicon</button>
              
              <div className="relative group/ico">
                <button type="button" className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${iconType === 'lucide' ? 'bg-white/20 text-white' : 'bg-transparent hover:bg-white/5 text-white/50'}`}>
                   Icon <ImageIcon size={12} />
                </button>
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover/ico:grid grid-cols-5 gap-2 bg-neutral-900 border border-white/10 p-4 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] w-[240px] z-50">
                  {Object.keys(ICONS).map(name => {
                    const Icon = ICONS[name as keyof typeof ICONS];
                    return (
                      <button key={name} type="button" onClick={() => { setIconType('lucide'); setIconValue(name); }} className="p-2.5 hover:bg-white/10 rounded-xl flex justify-center text-white/60 hover:text-white transition-colors" title={name}>
                        <Icon size={18} />
                      </button>
                    )
                  })}
                </div>
              </div>

              <button type="button" onClick={() => fileInputRef.current?.click()} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${iconType === 'custom' ? 'bg-white/20 text-white' : 'bg-transparent hover:bg-white/5 text-white/50'}`}>
                Upload <Upload size={12} />
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
            </div>

            <button type="submit" className="bg-accent hover:bg-accent/80 text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors flex gap-2 items-center">
              Add <Plus size={14} />
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 flex justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 focus-within:opacity-100 group z-10 pb-8">
        <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 hover:text-white glass-panel px-6 py-3 rounded-full shadow-lg">
           {isEditing ? <><Check size={14}/> Done Editing</> : <><Edit2 size={14}/> Edit Shortcuts</>}
        </button>
      </div>

    </div>
  );
}
