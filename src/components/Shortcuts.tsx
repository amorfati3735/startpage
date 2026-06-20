import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Shortcut } from '../types';
import { Plus, X, Edit2, Check } from 'lucide-react';
import { Reorder } from 'motion/react';

export function Shortcuts() {
  const [shortcuts, setShortcuts] = useLocalStorage<Shortcut[]>('dashboard_shortcuts', []);
  const [isEditing, setIsEditing] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newLabel, setNewLabel] = useState('');

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
      label: newLabel.trim() || domain.replace('www.', '')
    }]);
    setNewUrl('');
    setNewLabel('');
  };

  const removeShortcut = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShortcuts(shortcuts.filter(s => s.id !== id));
  };

  return (
    <div className="mt-12 w-full max-w-4xl px-4 flex flex-col items-center mx-auto">
      
      {!isEditing && shortcuts.length > 0 && (
         <Reorder.Group axis="x" values={shortcuts} onReorder={setShortcuts} className="flex flex-wrap justify-center gap-4">
           {shortcuts.map(shortcut => (
             <Reorder.Item key={shortcut.id} value={shortcut} className="relative group cursor-pointer z-10 w-20 h-20 sm:w-24 sm:h-24">
               <a href={shortcut.url} className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl glass-panel group-hover:bg-white/10 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_16px_40px_0_rgba(0,0,0,0.5)]">
                 <img src={`https://www.google.com/s2/favicons?sz=64&domain=${shortcut.url}`} alt="" className="w-8 h-8 sm:w-10 sm:h-10 mb-2 opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-md rounded" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
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
                 <img src={`https://www.google.com/s2/favicons?sz=64&domain=${shortcut.url}`} alt="" className="w-8 h-8 sm:w-10 sm:h-10 mb-2 opacity-40 rounded" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
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
        <form onSubmit={addShortcut} className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3 mt-4 w-full max-w-lg relative z-10 shadow-2xl">
          <input type="text" placeholder="https://example.com" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="w-full sm:flex-1 bg-black/40 border border-white/10 focus:border-accent hover:border-white/30 rounded-xl px-4 py-3 text-sm transition-colors" required />
          <input type="text" placeholder="Title (optional)" value={newLabel} onChange={e => setNewLabel(e.target.value)} className="w-full sm:w-1/3 bg-black/40 border border-white/10 focus:border-accent hover:border-white/30 rounded-xl px-4 py-3 text-sm transition-colors" />
          <button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/80 text-white p-3 rounded-xl transition-colors"><Plus size={20} /></button>
        </form>
      )}

      <div className="mt-6 flex justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 focus-within:opacity-100 group z-10">
        <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 hover:text-white glass-panel px-6 py-2.5 rounded-full">
           {isEditing ? <><Check size={14}/> Done Editing</> : <><Edit2 size={14}/> Edit Shortcuts</>}
        </button>
      </div>

    </div>
  );
}
