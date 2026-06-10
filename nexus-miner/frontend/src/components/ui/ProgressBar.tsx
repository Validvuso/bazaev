export function ProgressBar({ value, color = 'bg-[#10b981]' }: { value: number; color?: string }) {
  const width = Math.max(0, Math.min(100, value));
  return <div className="h-3 overflow-hidden rounded-full bg-[#1e1e2e]"><div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${width}%` }} /></div>;
}
