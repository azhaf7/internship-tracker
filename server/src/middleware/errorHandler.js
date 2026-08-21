import mongoose from 'mongoose';
import ApiError from './ApiError.js';

export function notFoundHandler(req, res) {
  res.status(404).json({ error: `No route matches ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {})
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: Object.values(err.errors).map((e) => e.message)
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: `'${err.value}' is not a valid ${err.path}` });
  }

  // Raised by the unique indexes on companies.name and applications.companyId+role.
  if (err.code === 11000) {
    return res.status(409).json({
      error: 'That record already exists',
      details: err.keyValue
    });
  }

  console.error(err);
  return res.status(500).json({ error: 'Unexpected server error' });
}
