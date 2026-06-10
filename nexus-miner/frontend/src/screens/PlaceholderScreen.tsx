import { Construction } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function PlaceholderScreen({ title }: { title: string }) {
  return <div className="pt-20"><Card className="text-center"><Construction className="mx-auto text-[#60a5fa]" size={42}/><h1 className="mt-4 text-2xl font-black">{title}</h1><p className="mt-2 text-[#94a3b8]">В разработке. Скоро здесь появится новый раздел Nexus Miner.</p></Card></div>;
}
