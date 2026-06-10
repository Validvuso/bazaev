import { useEffect } from 'react';
import { BottomNav } from './components/layout/BottomNav';
import { useTelegram } from './hooks/useTelegram';
import { MinerScreen } from './screens/MinerScreen';
import { PlaceholderScreen } from './screens/PlaceholderScreen';
import { ReactorScreen } from './screens/ReactorScreen';
import { useStore } from './store/useStore';

export default function App() {
  const { initData, webApp } = useTelegram();
  const { activeTab, bootstrap } = useStore();

  useEffect(() => { void bootstrap(initData); }, [bootstrap, initData]);
  useEffect(() => { webApp?.MainButton?.hide(); }, [webApp]);

  const placeholderTitles: Partial<Record<typeof activeTab, string>> = { topup: 'Пополнить', earn: 'Заработок', rating: 'Рейтинг', clans: 'Кланы' };
  const screen = activeTab === 'miner' ? <MinerScreen/> : activeTab === 'reactor' ? <ReactorScreen/> : <PlaceholderScreen title={placeholderTitles[activeTab] ?? 'Раздел'}/>;

  return <main className="min-h-screen bg-[#0a0a0f]"><div className="mx-auto min-h-screen max-w-[430px] px-4 pb-28">{screen}</div><BottomNav/></main>;
}
