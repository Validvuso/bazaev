import { Button } from '../ui/Button';

export function SellButton({ onSell, disabled }: { onSell: () => void; disabled: boolean }) {
  return <Button onClick={onSell} disabled={disabled} className="w-full">Продать хэши</Button>;
}
