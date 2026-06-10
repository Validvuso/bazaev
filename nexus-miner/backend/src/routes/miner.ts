import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { accrueMining, sellHashes, toggleMining } from '../services/miningService.js';
import { serializeUser } from '../utils/serialize.js';

const router = Router();
router.use(auth);

router.get('/stats', async (req, res) => {
  const user = await accrueMining(req.user!.userId);
  res.json({ user: serializeUser(user), ratePerSecond: user.power * 0.001 });
});

router.post('/toggle', async (req, res) => {
  const user = await toggleMining(req.user!.userId);
  res.json({ user: serializeUser(user) });
});

router.post('/sell', async (req, res) => {
  const user = await sellHashes(req.user!.userId);
  res.json({ user: serializeUser(user) });
});

export default router;
