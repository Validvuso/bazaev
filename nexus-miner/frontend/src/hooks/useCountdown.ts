import { useEffect, useMemo, useState } from 'react';

function nextSaturdayMidnight() {
  const now = new Date();
  const target = new Date(now);
  const day = now.getDay();
  const daysUntilSaturday = (6 - day + 7) % 7 || 7;
  target.setDate(now.getDate() + daysUntilSaturday);
  target.setHours(0, 0, 0, 0);
  return target;
}

export function useCountdown(targetDate?: string) {
  const target = useMemo(() => targetDate ? new Date(targetDate) : nextSaturdayMidnight(), [targetDate]);
  const [left, setLeft] = useState(Math.max(0, target.getTime() - Date.now()));

  useEffect(() => {
    const id = window.setInterval(() => setLeft(Math.max(0, target.getTime() - Date.now())), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const totalSeconds = Math.floor(left / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    ms: left,
  };
}
