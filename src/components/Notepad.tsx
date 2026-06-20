import { useLocalStorage } from '../hooks/useLocalStorage';

export function Notepad() {
  const [text, setText] = useLocalStorage('dashboard_notepad', '');

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;

  return (
    <div className="w-[300px] h-[340px] flex flex-col">
      <div className="flex justify-between items-end mb-6 border-b border-white/20 pb-3">
        <h2 className="uppercase text-accent font-bold tracking-widest text-xs">Notepad / Scratch</h2>
        <span className="text-[10px] opacity-40 uppercase tracking-wider">{words} W // {chars} C</span>
      </div>
      <textarea 
        value={text}
        onChange={e => setText(e.target.value)}
        className="flex-1 w-full bg-transparent border-none resize-none leading-relaxed opacity-90 placeholder-white/20 text-sm"
        placeholder="Type something. It persists implicitly."
        spellCheck={false}
      />
    </div>
  );
}
