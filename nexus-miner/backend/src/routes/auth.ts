import crypto from 'node:crypto';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';
import { serializeUser } from '../utils/serialize.js';

const router = Router();
const bodySchema = z.object({ initData: z.string().optional() });

function validateTelegramInitData(initData = '') {
  if (process.env.NODE_ENV === 'development') return true;
  if (!initData || !process.env.BOT_TOKEN) return false;
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  params.delete('hash');
  const dataCheckString = [...params.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join('\n');
  const secret = crypto.createHmac('sha256', 'WebAppData').update(process.env.BOT_TOKEN).digest();
  const signature = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');
  return signature === hash;
}

function parseTelegramUser(initData = '') {
  const params = new URLSearchParams(initData);
  const raw = params.get('user');
  if (!raw) return { id: 1961422565, first_name: 'Витя', last_name: 'И', username: 'Tot_sammiyya' };
  return JSON.parse(raw) as { id: number; first_name: string; last_name?: string; username?: string; photo_url?: string };
}

router.post('/telegram', async (req, res) => {
  const { initData } = bodySchema.parse(req.body);
  if (!validateTelegramInitData(initData)) return res.status(401).json({ message: 'Telegram InitData не прошла проверку' });
  const tgUser = parseTelegramUser(initData);

  const user = await prisma.user.upsert({
    where: { telegramId: BigInt(tgUser.id) },
    update: { username: tgUser.username, firstName: tgUser.first_name, lastName: tgUser.last_name, avatarUrl: tgUser.photo_url },
    create: { telegramId: BigInt(tgUser.id), username: tgUser.username, firstName: tgUser.first_name, lastName: tgUser.last_name, avatarUrl: tgUser.photo_url, miningSessions: { create: {} } },
  });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET ?? 'dev_secret', { expiresIn: '30d' });
  res.json({ token, user: serializeUser(user) });
});

export default router;
