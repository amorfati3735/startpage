import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Task } from '../types';
import { Check, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Tasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('dashboard_tasks', []);
  const [newTask, setNewTask] = useState('');

  const addTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: crypto.randomUUID(), text: newTask.trim(), completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="w-[300px] h-[340px] flex flex-col">
      <h2 className="uppercase text-accent font-bold mb-6 tracking-widest text-xs">Tasks / Active</h2>
      
      <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2">
        <AnimatePresence>
          {tasks.map(task => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-start group transition-all"
            >
              <button 
                onClick={() => toggleTask(task.id)}
                className={`mt-0.5 flex-shrink-0 w-4 h-4 mr-3 flex items-center justify-center border ${task.completed ? 'border-accent bg-accent/20' : 'border-white/50 text-transparent hover:border-accent hover:bg-white/5'}`}
              >
                {task.completed && <Check size={12} className="text-accent" />}
              </button>
              <span className={`flex-1 text-sm leading-snug break-words ${task.completed ? 'line-through opacity-40' : 'opacity-90'}`}>
                {task.text}
              </span>
              <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-red-400 transition-opacity ml-2">
                <X size={14} />
              </button>
            </motion.div>
          ))}
          {tasks.length === 0 && (
            <div className="text-sm opacity-40 italic mt-8 text-center text-white/40">No tasks. Enjoy the quiet.</div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={addTask} className="relative mt-auto border-b border-white/20 focus-within:border-accent transition-colors pb-2">
        <input 
          type="text" 
          placeholder="ADD A TASK..." 
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          className="w-full bg-transparent text-sm uppercase tracking-wider placeholder-white/30" 
        />
        <button type="submit" className="absolute right-0 top-0 text-white/50 hover:text-accent">
          <Plus size={16} />
        </button>
      </form>
    </div>
  );
}
