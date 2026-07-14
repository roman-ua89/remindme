import { Router } from 'express';

import {
    categoryIdParamsSchema,
    createCategorySchema,
    updateCategorySchema,
    type CategoryIdParams,
} from '@remindme/contracts/categories';

import { auth } from '../../middleware/auth.js';
import { requirePermission } from '../../middleware/require-permission.js';
import { validate } from '../../middleware/validate.js';
import * as categoriesService from './categories.service.js';

const router = Router();

router.use(auth, requirePermission('content:manage_own'));

router.get('/', async (req, res, next) => {
    try {
        const categories = await categoriesService.listCategories(req.user!);
        res.json(categories);
    } catch (error) {
        next(error);
    }
});

router.post('/', validate({ body: createCategorySchema }), async (req, res, next) => {
    try {
        const category = await categoriesService.createCategory(req.user!, req.body);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
});

router.patch(
    '/:categoryId',
    validate({ params: categoryIdParamsSchema, body: updateCategorySchema }),
    async (req, res, next) => {
        try {
            const { categoryId } = req.params as CategoryIdParams;
            const category = await categoriesService.updateCategory(req.user!, categoryId, req.body);
            res.json(category);
        } catch (error) {
            next(error);
        }
    },
);

router.delete('/:categoryId', validate({ params: categoryIdParamsSchema }), async (req, res, next) => {
    try {
        const { categoryId } = req.params as CategoryIdParams;
        await categoriesService.deleteCategory(req.user!, categoryId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export const categoriesRoutes = router;
