import { Router } from 'express';

import { auth } from '../../middleware/auth.js';
import { requirePermission } from '../../middleware/require-permission.js';
import * as statsService from './stats.service.js';

const router = Router();

router.use(auth, requirePermission('content:manage_own'));

router.get('/library', async (req, res, next) => {
    try {
        const stats = await statsService.getLibraryStats(req.user!);
        res.json(stats);
    } catch (error) {
        next(error);
    }
});

export const statsRoutes = router;
