import { prisma } from '../utils/prisma.js';

function getWeekBounds() {
  const now = new Date();
  const day = now.getUTCDay() || 7;
  const weekStart = new Date(now);
  weekStart.setUTCDate(now.getUTCDate() - day + 1);
  weekStart.setUTCHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 5);
  weekEnd.setUTCHours(23, 59, 59, 999);
  return { weekStart, weekEnd };
}

export async function getCurrentReactor() {
  const { weekStart, weekEnd } = getWeekBounds();
  const existing = await prisma.reactorEvent.findFirst({ where: { weekStart, isActive: true } });
  if (existing) return existing;
  await prisma.reactorEvent.updateMany({ where: { isActive: true }, data: { isActive: false } });
  return prisma.reactorEvent.create({ data: { weekStart, weekEnd, isActive: true } });
}

export async function refreshGlobalTotal() {
  const reactor = await getCurrentReactor();
  const total = await prisma.user.aggregate({ _sum: { reactorDeposits: true } });
  return prisma.reactorEvent.update({ where: { id: reactor.id }, data: { globalTotal: total._sum.reactorDeposits ?? 0 } });
}

export async function depositToReactor(userId: number, amount: number) {
  await prisma.user.update({ where: { id: userId }, data: { reactorDeposits: { increment: amount }, balance: { decrement: amount } } });
  return refreshGlobalTotal();
}
