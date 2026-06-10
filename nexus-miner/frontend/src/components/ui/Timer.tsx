import { useCountdown } from '../../hooks/useCountdown';

export function Timer({ targetDate }: { targetDate?: string }) {
  const time = useCountdown(targetDate);
  const pad = (n: number) => String(n).padStart(2, '0');
  return <div className="rounded-2xl bg-[#0a0a0f] p-4 text-center"><p className="text-xs text-[#94a3b8]">До субботнего финала</p><p className="mt-1 text-2xl font-black text-white">{time.days}д {pad(time.hours)}:{pad(time.minutes)}:{pad(time.seconds)}</p></div>;
}
