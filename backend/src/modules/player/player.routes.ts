import { Router } from 'express';

import { playerBatchRequestSchema, type PlayerBatchRequest } from '@remindme/contracts/player';

import { auth } from '../../middleware/auth.js';
import { requirePermission } from '../../middleware/require-permission.js';
import { validate } from '../../middleware/validate.js';
import * as playerService from './player.service.js';

const router = Router();

router.use(auth, requirePermission('content:manage_own'));

router.post('/batch', validate({ body: playerBatchRequestSchema }), async (req, res, next) => {
    try {
        const batch = await playerService.getPlayerBatch(req.user!, req.body as PlayerBatchRequest);
        res.json(batch);
    } catch (error) {
        next(error);
    }
});

export const playerRoutes = router;
