import { Router } from 'express';

import { entityByIdParamsSchema, type EntityByIdParams } from '@remindme/contracts/entities';

import { auth } from '../../middleware/auth.js';
import { requirePermission } from '../../middleware/require-permission.js';
import { validate } from '../../middleware/validate.js';
import * as entitiesService from './entities.service.js';

const router = Router();

router.use(auth, requirePermission('content:manage_own'));

router.get('/:entityId', validate({ params: entityByIdParamsSchema }), async (req, res, next) => {
    try {
        const { entityId } = req.params as EntityByIdParams;
        const entity = await entitiesService.getEntityById(req.user!, entityId);
        res.json(entity);
    } catch (error) {
        next(error);
    }
});

export const entitiesFlatRoutes = router;
