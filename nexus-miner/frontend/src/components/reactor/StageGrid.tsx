const stages = [['50K', 'Первый контакт'], ['200K', 'Глобальный резонанс'], ['600K', 'Цепная реакция'], ['1.5M', 'Nexus взрыв']];

export function StageGrid() {
  return <div className="grid grid-cols-4 gap-2">{stages.map(([amount, name]) => <div key={amount} className="rounded-2xl border border-[#1e1e2e] bg-[#12121a] p-3 text-center"><p className="text-sm font-black text-[#10b981]">{amount}</p><p className="mt-2 text-[10px] leading-tight text-[#94a3b8]">{name}</p></div>)}</div>;
}
