import { Button } from '../ui/Button';

export function MiningToggle({ isMining, onToggle }: { isMining: boolean; onToggle: () => void }) {
  return <Button onClick={onToggle} variant={isMining ? 'danger' : 'primary'} className="w-full">{isMining ? 'Остановить майнинг' : 'Запустить майнинг'}</Button>;
}
