import { useEffect, useState } from 'react';

export function Clock({ font, use12h, showSeconds }: { font: string; use12h: boolean; showSeconds: boolean }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  
  let formattedHours = hours;
  let ampm = '';
  if (use12h) {
    ampm = hours >= 12 ? ' PM' : ' AM';
    formattedHours = hours % 12 || 12;
  }
  const hoursStr = formattedHours.toString().padStart(2, '0');

  const fontClass = font === 'Serif' ? 'font-serif' : font === 'Inter' ? 'font-sans' : 'font-mono';

  return (
    <div className={`text-[12vw] leading-none tracking-tighter ${fontClass} font-bold opacity-90 drop-shadow-2xl`}>
      {hoursStr}:{minutes}{showSeconds && <span className="text-[6vw] font-normal opacity-60">:{seconds}</span>}
      {use12h && <span className="text-[3vw] opacity-60 font-sans tracking-normal ml-4">{ampm}</span>}
    </div>
  );
}
