import { Router, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();

// Tous les routes nécessitent une authentification
router.use(authenticateToken);

// GET /api/profile - Récupérer le profil de l'utilisateur
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    // Récupérer les statistiques des entraînements
    const { data: workouts, error: statsError } = await supabaseAdmin
      .from('workouts')
      .select('duration, calories')
      .eq('user_id', userId);

    let stats = {
      totalWorkouts: 0,
      totalCalories: 0,
      totalDuration: 0,
      avgCalories: 0,
    };

    if (!statsError && workouts) {
      const totalWorkouts = workouts.length;
      const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);
      const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
      const avgCalories = totalWorkouts ? Math.round(totalCalories / totalWorkouts) : 0;

      stats = {
        totalWorkouts,
        totalCalories,
        totalDuration,
        avgCalories,
      };
    }

    res.json({
      profile: profile || null,
      stats,
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

// PUT /api/profile - Mettre à jour le profil
router.put('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const updates = req.body;

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      // Si le profil n'existe pas, le créer
      if (error.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabaseAdmin
          .from('profiles')
          .insert([{ id: userId, ...updates }])
          .select()
          .single();

        if (createError) throw createError;
        return res.json(newProfile);
      }
      throw error;
    }

    res.json(data);
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

// DELETE /api/profile - Supprimer le profil et tous les entraînements
router.delete('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Supprimer tous les entraînements
    await supabaseAdmin.from('workouts').delete().eq('user_id', userId);

    // Supprimer le profil
    const { error } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.status(204).send();
  } catch (error: any) {
    console.error('Erreur lors de la suppression du profil:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

export default router;

