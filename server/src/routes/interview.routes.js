import { Router } from 'express';
import {
  listInterviews,
  createInterview,
  deleteInterview
} from '../controllers/interview.controller.js';
import { validateObjectId } from '../middleware/validate.js';

const router = Router();

router.get('/', listInterviews);
router.post('/', createInterview);
router.delete('/:id', validateObjectId(), deleteInterview);

export default router;
