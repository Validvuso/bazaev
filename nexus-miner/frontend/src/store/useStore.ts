import { create } from 'zustand';
import { api } from '../api/client';

type User = { id: number; telegramId: string; username?: string; firstName: string; lastName?: string; avatarUrl?: string; balance: number; hashes: number; power: number; isMining: boolean; clanId?: string; reactorDeposits: number };
type Reactor = { id: number; weekStart: string; weekEnd: string; globalTotal: number; isActive: boolean };
type Tab = 'topup' | 'earn' | 'miner' | 'rating' | 'clans' | 'reactor';

type State = {
  user?: User;
  reactor?: Reactor;
  activeTab: Tab;
  loading: boolean;
  setActiveTab: (tab: Tab) => void;
  bootstrap: (initData: string) => Promise<void>;
  syncStats: () => Promise<void>;
  tickMining: () => void;
  toggleMining: () => Promise<void>;
  sellHashes: () => Promise<void>;
  loadReactor: () => Promise<void>;
  depositReactor: (amount: number) => Promise<void>;
};

export const useStore = create<State>((set, get) => ({
  activeTab: 'miner',
  loading: false,
  setActiveTab: (activeTab) => set({ activeTab }),
  bootstrap: async (initData) => {
    set({ loading: true });
    const { data } = await api.post('/auth/telegram', { initData });
    localStorage.setItem('nexus_token', data.token);
    set({ user: data.user, loading: false });
    await get().loadReactor();
  },
  syncStats: async () => {
    const { data } = await api.get('/miner/stats');
    set({ user: data.user });
  },
  tickMining: () => set((state) => {
    if (!state.user?.isMining) return state;
    return { user: { ...state.user, hashes: state.user.hashes + (state.user.power * 0.001) } };
  }),
  toggleMining: async () => {
    const { data } = await api.post('/miner/toggle');
    set({ user: data.user });
  },
  sellHashes: async () => {
    const { data } = await api.post('/miner/sell');
    set({ user: data.user });
  },
  loadReactor: async () => {
    const { data } = await api.get('/reactor/current');
    set({ reactor: data.reactor, user: data.user });
  },
  depositReactor: async (amount) => {
    const { data } = await api.post('/reactor/deposit', { amount });
    set({ reactor: data.reactor, user: data.user });
  },
}));
