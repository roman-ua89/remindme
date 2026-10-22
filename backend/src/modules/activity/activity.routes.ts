import { Router } from 'express';

import { dailyActivityQuerySchema, type DailyActivityQuery } from '@remindme/contracts/activity';

import { auth } from '../../middleware/auth.js';
import { requirePermission } from '../../middleware/require-permission.js';
import { validate } from '../../middleware/validate.js';
import * as activityService from './activity.service.js';

const router = Router();

router.use(auth, requirePermission('content:manage_own'));

router.get('/daily', validate({ query: dailyActivityQuerySchema }), async (req, res, next) => {
    try {
        const { month } = req.query as DailyActivityQuery;
        const activity = await activityService.getDailyActivity(req.user!, month);
        res.json(activity);
    } catch (error) {
        next(error);
    }
});

export const activityRoutes = router;
