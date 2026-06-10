import { Atom, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Timer } from '../ui/Timer';

export function ReactorCard({ globalTotal, weekEnd }: { globalTotal: number; weekEnd?: string }) {
  const max = 1_500_000;
  return <Card><div className="flex items-center gap-3"><div className="rounded-2xl bg-[#1e1e2e] p-3 text-[#8b5cf6]"><Atom /></div><div><h1 className="text-2xl font-black">Nexus Reactor</h1><p className="text-sm text-[#94a3b8]">Еженедельное событие пополнений</p></div></div><div className="mt-5"><Timer/></div><div className="mt-5"><div className="mb-2 flex justify-between text-sm"><span className="font-bold">Глобальный прогресс</span><span className="text-[#10b981]">{globalTotal.toLocaleString('ru-RU')} RUB</span></div><ProgressBar value={(globalTotal / max) * 100}/><p className="mt-3 flex items-center gap-2 text-sm text-[#10b981]"><CheckCircle size={16}/>Все этапы открыты</p></div></Card>;
}
