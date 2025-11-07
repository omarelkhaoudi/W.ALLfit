import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();

// GET /api/auth/me - Récupérer l'utilisateur actuel
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    res.json({
      id: user.id,
      email: user.email,
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

export default router;

