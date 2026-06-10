import { PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }} className={`rounded-3xl border border-[#1e1e2e] bg-[#12121a] p-5 shadow-glow ${className}`}>{children}</motion.div>;
}
