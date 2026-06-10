import { Atom, Pickaxe, Trophy, Users, Zap, DollarSign } from 'lucide-react';
import { useStore } from '../../store/useStore';

const items = [
  ['topup', 'Пополнить', Zap], ['earn', 'Заработок', DollarSign], ['miner', 'Майнер', Pickaxe], ['rating', 'Рейтинг', Trophy], ['clans', 'Кланы', Users], ['reactor', 'Reactor', Atom],
] as const;

export function BottomNav() {
  const { activeTab, setActiveTab } = useStore();
  return <nav className="safe-bottom fixed inset-x-0 bottom-0 z-20 mx-auto max-w-[430px] border-t border-[#1e1e2e] bg-[#0a0a0f]/95 px-2 pt-2 backdrop-blur"><div className="grid grid-cols-6 gap-1">{items.map(([key, label, Icon]) => <button key={key} onClick={() => setActiveTab(key)} className={`flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] ${activeTab === key ? 'bg-[#1e1e2e] text-[#60a5fa]' : 'text-[#94a3b8]'}`}><Icon size={18}/><span>{label}</span></button>)}</div></nav>;
}
