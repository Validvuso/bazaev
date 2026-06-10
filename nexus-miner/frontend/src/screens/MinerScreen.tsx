import { Diamond, Zap } from 'lucide-react';
import { useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { MiningToggle } from '../components/miner/MiningToggle';
import { SellButton } from '../components/miner/SellButton';
import { StatsGrid } from '../components/miner/StatsGrid';
import { Card } from '../components/ui/Card';
import { useTelegram } from '../hooks/useTelegram';
import { useStore } from '../store/useStore';

export function MinerScreen() {
  const { user, tickMining, syncStats, sellHashes, toggleMining } = useStore();
  const { haptic, webApp } = useTelegram();

  useEffect(() => {
    const tick = window.setInterval(tickMining, 1000);
    const sync = window.setInterval(syncStats, 10000);
    return () => { window.clearInterval(tick); window.clearInterval(sync); };
  }, [syncStats, tickMining]);

  useEffect(() => {
    const mainButton = webApp?.MainButton;
    if (!mainButton || !user) return;
    const handler = () => { haptic(); void sellHashes(); };
    mainButton.setText('ПРОДАТЬ ХЭШИ');
    mainButton.onClick(handler);
    if (user.hashes >= 100) mainButton.show(); else mainButton.hide();
    return () => { mainButton.offClick(handler); mainButton.hide(); };
  }, [haptic, sellHashes, user, webApp]);

  if (!user) return <div className="p-6 text-center text-[#94a3b8]">Загрузка майнера...</div>;
  const initials = `${user.firstName[0] ?? 'N'}${user.lastName?.[0] ?? ''}`.toUpperCase();

  return <>
    <Header balance={user.balance}/>
    <Card>
      <div className="flex items-center gap-3"><div className="rounded-2xl bg-[#1e1e2e] p-3 text-[#60a5fa]"><Diamond/></div><div><h1 className="text-2xl font-black">Майнер</h1><p className="text-sm text-[#94a3b8]">Твоя майнинг-ферма</p></div></div>
      <div className="mt-5 flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-xl font-black">{initials}</div><div className="min-w-0 flex-1"><h2 className="font-black">{user.firstName}</h2><p className="text-sm text-[#94a3b8]">Увеличь свою мощность 😉</p><p className="truncate text-xs text-[#60a5fa]">@{user.username ?? 'nexus_user'} · ID {user.telegramId}</p></div><button className="rounded-xl bg-[#1e1e2e] px-3 py-2 text-xs font-bold">МОЙ КЛАН</button></div>
      <div className="mt-5"><StatsGrid hashes={user.hashes} power={user.power} balance={user.balance}/></div>
      <div className="mt-5 space-y-3"><SellButton disabled={user.hashes < 100} onSell={() => { haptic(); void sellHashes(); }}/><MiningToggle isMining={user.isMining} onToggle={() => { haptic(); void toggleMining(); }}/></div>
      <p className="mt-3 text-center text-xs text-[#94a3b8]">100 хэшей = 3 RUB</p>
    </Card>
    <Card className="mt-4"><div className="flex items-center gap-3"><Zap className="text-[#10b981]"/><div><p className="font-black">Активный майнинг</p><p className="text-sm text-[#94a3b8]">+{(user.power * 0.001).toFixed(2)} хэшей каждую секунду</p></div></div></Card>
  </>;
}
