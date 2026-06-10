import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

export function PersonalProgress({ deposited }: { deposited: number }) {
  const next = 500;
  return <Card><div className="mb-2 flex justify-between text-sm"><span className="font-bold">Личный прогресс</span><span className="text-[#8b5cf6]">{deposited.toLocaleString('ru-RU')} RUB</span></div><ProgressBar value={(deposited / next) * 100} color="bg-[#8b5cf6]"/><p className="mt-3 text-sm text-[#94a3b8]">до следующего: {Math.max(0, next - deposited).toLocaleString('ru-RU')} RUB</p></Card>;
}
