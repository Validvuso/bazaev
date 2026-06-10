import { prisma } from '../utils/prisma.js';

const HASH_RATE_FACTOR = 0.001;

export async function accrueMining(userId: number) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (!user.isMining) return user;

  const lastSession = await prisma.miningSession.findFirst({ where: { userId, endTime: null }, orderBy: { startTime: 'desc' } });
  const from = lastSession?.startTime ?? user.updatedAt;
  const seconds = Math.max(0, Math.floor((Date.now() - from.getTime()) / 1000));
  const mined = seconds * user.power * HASH_RATE_FACTOR;

  if (mined <= 0) return user;
  if (lastSession) await prisma.miningSession.update({ where: { id: lastSession.id }, data: { startTime: new Date(), hashesMined: { increment: mined } } });
  return prisma.user.update({ where: { id: userId }, data: { hashes: { increment: mined } } });
}

export async function toggleMining(userId: number) {
  const user = await accrueMining(userId);
  if (user.isMining) {
    await prisma.miningSession.updateMany({ where: { userId, endTime: null }, data: { endTime: new Date() } });
    return prisma.user.update({ where: { id: userId }, data: { isMining: false } });
  }
  await prisma.miningSession.create({ data: { userId } });
  return prisma.user.update({ where: { id: userId }, data: { isMining: true } });
}

export async function sellHashes(userId: number) {
  const user = await accrueMining(userId);
  const lots = Math.floor(user.hashes / 100);
  const earned = lots * 3;
  const remaining = user.hashes % 100;
  return prisma.user.update({ where: { id: userId }, data: { hashes: remaining, balance: { increment: earned } } });
}
