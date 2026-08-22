import { Router } from 'express';
import {
  listApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  listApplicationInterviews
} from '../controllers/application.controller.js';
import { validateObjectId, validateApplicationBody } from '../middleware/validate.js';

const router = Router();

router.get('/', listApplications);
router.post('/', validateApplicationBody(), createApplication);

router.get('/:id', validateObjectId(), getApplication);
router.put('/:id', validateObjectId(), validateApplicationBody({ partial: true }), updateApplication);
router.delete('/:id', validateObjectId(), deleteApplication);

router.get('/:id/interviews', validateObjectId(), listApplicationInterviews);

export default router;
