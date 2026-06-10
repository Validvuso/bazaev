import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' | 'ghost' }>;

export function Button({ children, className = '', variant = 'primary', ...props }: Props) {
  const colors = { primary: 'bg-[#3b82f6] hover:bg-[#60a5fa]', danger: 'bg-red-500 hover:bg-red-400', ghost: 'bg-[#1e1e2e] hover:bg-[#26263a]' };
  return <motion.button whileTap={{ scale: 0.97 }} className={`${colors[variant]} rounded-xl py-4 px-5 text-sm font-extrabold uppercase tracking-wide text-white transition disabled:opacity-50 ${className}`} {...props}>{children}</motion.button>;
}
