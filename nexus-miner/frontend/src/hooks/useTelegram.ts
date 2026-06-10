import { useEffect, useMemo } from 'react';

type TelegramUser = { id: number; first_name: string; last_name?: string; username?: string; photo_url?: string };
type WebApp = {
  initData: string;
  initDataUnsafe?: { user?: TelegramUser };
  expand: () => void;
  HapticFeedback?: { impactOccurred: (style: 'light' | 'medium' | 'heavy') => void };
  MainButton?: { setText: (text: string) => void; show: () => void; hide: () => void; onClick: (fn: () => void) => void; offClick: (fn: () => void) => void };
};

declare global { interface Window { Telegram?: { WebApp: WebApp } } }

export function useTelegram() {
  const webApp = window.Telegram?.WebApp;

  useEffect(() => { webApp?.expand(); }, [webApp]);

  return useMemo(() => ({
    webApp,
    initData: webApp?.initData ?? '',
    user: webApp?.initDataUnsafe?.user,
    haptic: () => webApp?.HapticFeedback?.impactOccurred('light'),
  }), [webApp]);
}
