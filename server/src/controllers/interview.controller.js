import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import ApiError from '../middleware/ApiError.js';

export async function listInterviews(req, res, next) {
  try {
    const interviews = await Interview.find()
      .populate({
        path: 'applicationId',
        select: 'role stage companyId',
        populate: { path: 'companyId', select: 'name' }
      })
      .sort({ scheduledAt: 1 });

    res.json(interviews);
  } catch (err) {
    next(err);
  }
}

export async function createInterview(req, res, next) {
  try {
    const application = await Application.findById(req.body.applicationId);

    if (!application) {
      throw ApiError.notFound(`No application with id ${req.body.applicationId}`);
    }

    const interview = await Interview.create(req.body);
    res.status(201).json(interview);
  } catch (err) {
    next(err);
  }
}

export async function deleteInterview(req, res, next) {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);

    if (!interview) {
      throw ApiError.notFound(`No interview with id ${req.params.id}`);
    }

    res.json({ message: 'Interview deleted', id: interview._id });
  } catch (err) {
    next(err);
  }
}
