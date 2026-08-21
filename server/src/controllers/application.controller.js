import Application from '../models/Application.js';
import Company from '../models/Company.js';
import Interview from '../models/Interview.js';
import ApiError from '../middleware/ApiError.js';

export async function listApplications(req, res, next) {
  try {
    const applications = await Application.find()
      .populate('companyId', 'name industry location')
      .sort({ priority: -1, updatedAt: -1 });

    res.json(applications);
  } catch (err) {
    next(err);
  }
}

export async function getApplication(req, res, next) {
  try {
    const application = await Application.findById(req.params.id).populate(
      'companyId',
      'name industry location website'
    );

    if (!application) {
      throw ApiError.notFound(`No application with id ${req.params.id}`);
    }

    res.json(application);
  } catch (err) {
    next(err);
  }
}

export async function createApplication(req, res, next) {
  try {
    const companyExists = await Company.exists({ _id: req.body.companyId });
    if (!companyExists) {
      throw ApiError.notFound(`No company with id ${req.body.companyId}`);
    }

    const duplicate = await Application.findOne({
      companyId: req.body.companyId,
      role: req.body.role
    });

    if (duplicate) {
      throw ApiError.conflict('You have already tracked this role at this company', {
        existingId: duplicate._id
      });
    }

    const application = await Application.create(req.body);
    const populated = await application.populate('companyId', 'name industry location');

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
}

export async function updateApplication(req, res, next) {
  try {
    const application = await Application.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('companyId', 'name industry location');

    if (!application) {
      throw ApiError.notFound(`No application with id ${req.params.id}`);
    }

    res.json(application);
  } catch (err) {
    next(err);
  }
}

export async function deleteApplication(req, res, next) {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      throw ApiError.notFound(`No application with id ${req.params.id}`);
    }

    // Interviews are meaningless without their application.
    await Interview.deleteMany({ applicationId: application._id });

    res.json({ message: 'Application deleted', id: application._id });
  } catch (err) {
    next(err);
  }
}

// Relational endpoint: joins interviews onto a single application.
export async function listApplicationInterviews(req, res, next) {
  try {
    const application = await Application.findById(req.params.id).populate('companyId', 'name');

    if (!application) {
      throw ApiError.notFound(`No application with id ${req.params.id}`);
    }

    const interviews = await Interview.find({ applicationId: application._id }).sort({ round: 1 });

    res.json({
      application: {
        id: application._id,
        role: application.role,
        company: application.companyId?.name ?? null,
        stage: application.stage
      },
      interviewCount: interviews.length,
      interviews
    });
  } catch (err) {
    next(err);
  }
}
