import { Router } from 'express';
import { z } from 'zod';
import { auth } from '../middleware/auth.js';
import { depositToReactor, refreshGlobalTotal } from '../services/reactorService.js';
import { prisma } from '../utils/prisma.js';
import { serializeUser } from '../utils/serialize.js';

const router = Router();
const depositSchema = z.object({ amount: z.number().positive().max(1_000_000) });
router.use(auth);

router.get('/current', async (req, res) => {
  const [reactor, user] = await Promise.all([refreshGlobalTotal(), prisma.user.findUniqueOrThrow({ where: { id: req.user!.userId } })]);
  res.json({ reactor, user: serializeUser(user) });
});

router.post('/deposit', async (req, res) => {
  const { amount } = depositSchema.parse(req.body);
  const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.userId } });
  if (user.balance < amount) return res.status(400).json({ message: 'Недостаточно баланса для пополнения Reactor' });
  const reactor = await depositToReactor(req.user!.userId, amount);
  const updatedUser = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.userId } });
  res.json({ reactor, user: serializeUser(updatedUser) });
});

export default router;
