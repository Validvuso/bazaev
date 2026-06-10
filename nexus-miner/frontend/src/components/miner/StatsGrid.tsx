const fmt = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 5 });

export function StatsGrid({ hashes, power, balance }: { hashes: number; power: number; balance: number }) {
  const items = [['ХЭШИ', fmt.format(hashes)], ['МОЩНОСТЬ', power.toString()], ['БАЛАНС', `${balance.toFixed(2)} ₽`]];
  return <div className="grid grid-cols-3 gap-3">{items.map(([label, value]) => <div key={label} className="rounded-2xl bg-[#0a0a0f] p-3 text-center"><p className="text-[10px] font-bold text-[#94a3b8]">{label}</p><p className="mt-2 text-sm font-black text-[#60a5fa]">{value}</p></div>)}</div>;
}
