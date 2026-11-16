import { Router } from 'express';

import { updateUserSchema, userIdParamsSchema, type UserIdParams } from '@remindme/contracts/users';

import { auth } from '../../middleware/auth.js';
import { requirePermission } from '../../middleware/require-permission.js';
import { validate } from '../../middleware/validate.js';
import * as usersService from './users.service.js';

const router = Router();

router.use(auth, requirePermission('users:manage'));

router.get('/', async (_req, res, next) => {
    try {
        const users = await usersService.listUsers();
        res.json(users);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', validate({ params: userIdParamsSchema }), async (req, res, next) => {
    try {
        const { id } = req.params as UserIdParams;
        const user = await usersService.getUser(id);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

router.patch('/:id', validate({ params: userIdParamsSchema, body: updateUserSchema }), async (req, res, next) => {
    try {
        const { id } = req.params as UserIdParams;
        const user = await usersService.updateUser(id, req.body);
        res.json(user);
    } catch (error) {
        next(error);
    }
});

export const usersRoutes = router;
