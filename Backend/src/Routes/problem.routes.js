// routes/problem.routes.js
import express from 'express';
import {
    createProblem,
    getProblems,
    getProblemById,
    updateProblem, deleteProblem
} from '../controllers/problem.controller.js';
import { protect } from '../Middlewares/auth.middleware.js';
import { requireAdmin } from '../Middlewares/admin.middleware.js';
import {
    problemValidationRules,
    problemUpdateValidationRules,
    idParamValidationRules,
    listQueryValidationRules,
    validateRequest
} from '../Middlewares/validation.middleware.js';

const router = express.Router();

// Public routes
router.get('/', listQueryValidationRules(), validateRequest, getProblems);
router.get('/:id', idParamValidationRules(), validateRequest, getProblemById);

// Admin-only routes
router.post(
    '/',
    protect,
    requireAdmin,
    problemValidationRules(),
    validateRequest,
    createProblem
);

router.put(
    '/:id',
    protect,
    requireAdmin,
    idParamValidationRules(),
    problemUpdateValidationRules(),
    validateRequest,
    updateProblem
);

router.delete(
    '/:id',
    protect,
    requireAdmin,
    idParamValidationRules(),
    validateRequest,
    deleteProblem
);

export default router;