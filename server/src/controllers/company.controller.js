import Company from '../models/Company.js';
import Application from '../models/Application.js';
import Contact from '../models/Contact.js';
import ApiError from '../middleware/ApiError.js';

export async function listCompanies(req, res, next) {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (err) {
    next(err);
  }
}

export async function getCompany(req, res, next) {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      throw ApiError.notFound(`No company with id ${req.params.id}`);
    }

    res.json(company);
  } catch (err) {
    next(err);
  }
}

export async function createCompany(req, res, next) {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (err) {
    next(err);
  }
}

// Applications and contacts that belong to one company.
export async function listCompanyApplications(req, res, next) {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      throw ApiError.notFound(`No company with id ${req.params.id}`);
    }

    const [applications, contacts] = await Promise.all([
      Application.find({ companyId: company._id }).sort({ priority: -1 }),
      Contact.find({ companyId: company._id }).sort({ isPrimary: -1, name: 1 })
    ]);

    res.json({
      company: {
        id: company._id,
        name: company.name,
        industry: company.industry,
        location: company.location
      },
      applicationCount: applications.length,
      applications,
      contacts
    });
  } catch (err) {
    next(err);
  }
}
