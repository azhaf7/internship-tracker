import { Router } from 'express';
import { getPipelineStats, getCompanyBreakdown } from '../controllers/stats.controller.js';

const router = Router();

router.get('/pipeline', getPipelineStats);
router.get('/by-company', getCompanyBreakdown);

export default router;
