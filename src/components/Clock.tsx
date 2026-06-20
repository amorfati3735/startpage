import { useEffect, useState } from 'react';

export function Clock({ 
  font, 
  use12h, 
  showSeconds,
  fontSize,
  color,
  opacity
}: { 
  font: string; 
  use12h: boolean; 
  showSeconds: boolean;
  fontSize: number;
  color: string;
  opacity: number;
}) {
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

  const containerStyle = {
    fontFamily: `"${font}", sans-serif`,
    fontSize: `${fontSize ?? 12}vw`,
    color: color ?? '#ffffff',
    opacity: (opacity ?? 90) / 100
  };

  return (
    <div style={containerStyle} className="leading-none tracking-tighter font-bold drop-shadow-2xl transition-all duration-300 relative z-10 flex items-baseline justify-center">
      <span>{hoursStr}:{minutes}</span>
      {showSeconds && <span style={{ fontSize: '0.5em' }} className="font-normal opacity-60 ml-2">:{seconds}</span>}
      {use12h && <span style={{ fontSize: '0.25em' }} className="opacity-60 font-sans tracking-normal ml-6 uppercase">{ampm}</span>}
    </div>
  );
}
