import { Router, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();

// Tous les routes nécessitent une authentification
router.use(authenticateToken);

// GET /api/workouts - Récupérer tous les entraînements de l'utilisateur
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const { data, error } = await supabaseAdmin
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (error: any) {
    console.error('Erreur lors de la récupération des entraînements:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

// POST /api/workouts - Créer un nouvel entraînement
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { type, duration, calories } = req.body;

    if (!type || !duration || !calories) {
      return res.status(400).json({ error: 'Données manquantes' });
    }

    const { data, error } = await supabaseAdmin
      .from('workouts')
      .insert([{ user_id: userId, type, duration, calories }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    console.error('Erreur lors de la création de l\'entraînement:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

// PUT /api/workouts/:id - Mettre à jour un entraînement
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const updates = req.body;

    // Vérifier que l'entraînement appartient à l'utilisateur
    const { data: workout, error: fetchError } = await supabaseAdmin
      .from('workouts')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !workout) {
      return res.status(404).json({ error: 'Entraînement non trouvé' });
    }

    if (workout.user_id !== userId) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const { data, error } = await supabaseAdmin
      .from('workouts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de l\'entraînement:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

// DELETE /api/workouts/:id - Supprimer un entraînement
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // Vérifier que l'entraînement appartient à l'utilisateur
    const { data: workout, error: fetchError } = await supabaseAdmin
      .from('workouts')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !workout) {
      return res.status(404).json({ error: 'Entraînement non trouvé' });
    }

    if (workout.user_id !== userId) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const { error } = await supabaseAdmin
      .from('workouts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(204).send();
  } catch (error: any) {
    console.error('Erreur lors de la suppression de l\'entraînement:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

export default router;

