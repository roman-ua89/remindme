import { Router } from 'express';

import {
    dailyActivityQuerySchema,
    recordPlayerTimeBodySchema,
    type DailyActivityQuery,
    type RecordPlayerTimeBody,
} from '@remindme/contracts/activity';

import { TIMEZONE_HEADER } from '../../lib/daily-activity.js';
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

router.get('/today', async (req, res, next) => {
    try {
        const activity = await activityService.getTodayActivity(req.user!, req.get(TIMEZONE_HEADER));
        res.json(activity);
    } catch (error) {
        next(error);
    }
});

router.post('/player-time', validate({ body: recordPlayerTimeBodySchema }), async (req, res, next) => {
    try {
        const { seconds } = req.body as RecordPlayerTimeBody;
        const activity = await activityService.recordPlayerTime(req.user!, seconds, req.get(TIMEZONE_HEADER));
        res.json(activity);
    } catch (error) {
        next(error);
    }
});

export const activityRoutes = router;
