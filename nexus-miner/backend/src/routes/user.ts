import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { prisma } from '../utils/prisma.js';
import { serializeUser } from '../utils/serialize.js';

const router = Router();
router.use(auth);

router.get('/me', async (req, res) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.userId } });
  res.json({ user: serializeUser(user) });
});

export default router;
