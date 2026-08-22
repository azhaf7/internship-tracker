import { Router } from 'express';
import {
  listCompanies,
  getCompany,
  createCompany,
  listCompanyApplications
} from '../controllers/company.controller.js';
import { validateObjectId } from '../middleware/validate.js';

const router = Router();

router.get('/', listCompanies);
router.post('/', createCompany);

router.get('/:id', validateObjectId(), getCompany);
router.get('/:id/applications', validateObjectId(), listCompanyApplications);

export default router;
