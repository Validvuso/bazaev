import { Button } from '../components/ui/Button';
import { PersonalProgress } from '../components/reactor/PersonalProgress';
import { ReactorCard } from '../components/reactor/ReactorCard';
import { StageGrid } from '../components/reactor/StageGrid';
import { useTelegram } from '../hooks/useTelegram';
import { useStore } from '../store/useStore';

export function ReactorScreen() {
  const { reactor, user, depositReactor } = useStore();
  const { haptic } = useTelegram();
  const tabs = ['Reactor', 'Сундуки', 'Инвентарь'];
  return <div className="space-y-4 pt-4">
    <ReactorCard globalTotal={reactor?.globalTotal ?? 6_402_224} weekEnd={reactor?.weekEnd}/>
    <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[#12121a] p-1">{tabs.map((tab, idx) => <button key={tab} className={`rounded-xl py-3 text-sm font-bold ${idx === 0 ? 'bg-[#3b82f6]' : 'text-[#94a3b8]'}`}>{tab}</button>)}</div>
    <StageGrid/>
    <PersonalProgress deposited={user?.reactorDeposits ?? 0}/>
    <Button className="w-full" onClick={() => { haptic(); void depositReactor(500); }}>Пополнить Reactor на 500 RUB</Button>
  </div>;
}
