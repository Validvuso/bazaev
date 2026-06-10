import { HelpCircle } from 'lucide-react';

export function Header({ balance }: { balance: number }) {
  return <header className="flex items-center justify-between px-1 py-4"><div><p className="text-xs text-[#94a3b8]">Баланс</p><p className="text-2xl font-black">₽ {balance.toFixed(2)} RUB</p></div><button className="flex items-center gap-2 rounded-full border border-[#1e1e2e] bg-[#12121a] px-3 py-2 text-xs text-[#94a3b8]"><span>🇷🇺</span><HelpCircle size={14}/>Как это работает?</button></header>;
}
