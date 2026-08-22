import mongoose from 'mongoose';
import ApiError from './ApiError.js';
import { APPLICATION_STAGES, JOB_TYPES, APPLICATION_SOURCES } from '../models/Application.js';

export function validateObjectId(paramName = 'id') {
  return (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params[paramName])) {
      return next(ApiError.badRequest(`'${req.params[paramName]}' is not a valid id`));
    }
    next();
  };
}

// The client is never trusted: this runs before the controller so a malformed
// body is rejected with 400 before it ever reaches the database.
export function validateApplicationBody({ partial = false } = {}) {
  return (req, res, next) => {
    const errors = [];
    const body = req.body ?? {};
    const has = (field) => body[field] !== undefined && body[field] !== null && body[field] !== '';
    // On a partial update an absent field means "leave it alone", so it is only
    // checked when the client actually sent it.
    const shouldCheck = (field) => !partial || has(field);

    if (shouldCheck('companyId')) {
      if (!has('companyId')) errors.push('companyId is required');
      else if (!mongoose.isValidObjectId(body.companyId)) errors.push('companyId must be a valid id');
    }

    if (shouldCheck('role')) {
      if (!has('role')) errors.push('role is required');
      else if (typeof body.role !== 'string' || body.role.trim().length < 3) {
        errors.push('role must be a string of at least 3 characters');
      }
    }

    if (has('stage') && !APPLICATION_STAGES.includes(body.stage)) {
      errors.push(`stage must be one of: ${APPLICATION_STAGES.join(', ')}`);
    }

    if (has('jobType') && !JOB_TYPES.includes(body.jobType)) {
      errors.push(`jobType must be one of: ${JOB_TYPES.join(', ')}`);
    }

    if (has('source') && !APPLICATION_SOURCES.includes(body.source)) {
      errors.push(`source must be one of: ${APPLICATION_SOURCES.join(', ')}`);
    }

    if (has('priority')) {
      const priority = Number(body.priority);
      if (!Number.isInteger(priority) || priority < 1 || priority > 5) {
        errors.push('priority must be an integer between 1 and 5');
      }
    }

    if (has('salaryExpectation')) {
      const salary = Number(body.salaryExpectation);
      if (Number.isNaN(salary) || salary < 0) {
        errors.push('salaryExpectation must be a non-negative number');
      }
    }

    for (const dateField of ['appliedDate', 'deadline']) {
      if (has(dateField) && Number.isNaN(Date.parse(body[dateField]))) {
        errors.push(`${dateField} must be a valid date`);
      }
    }

    if (errors.length > 0) {
      return next(ApiError.badRequest('Validation failed', errors));
    }

    next();
  };
}
