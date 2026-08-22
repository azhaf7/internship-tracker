import 'dotenv/config';
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import Company from '../models/Company.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Contact from '../models/Contact.js';
import { companies, applications, interviews, contacts } from './data.js';

async function seed() {
  await connectDatabase();
  console.log('Connected. Clearing existing collections...');

  await Promise.all([
    Company.deleteMany({}),
    Application.deleteMany({}),
    Interview.deleteMany({}),
    Contact.deleteMany({})
  ]);

  const createdCompanies = await Company.insertMany(
    companies.map(({ key, ...company }) => company)
  );

  // data.js uses keys like 'axis'; swap them for the real ObjectIds.
  const companyIdByKey = new Map(
    companies.map((company, index) => [company.key, createdCompanies[index]._id])
  );

  const createdApplications = await Application.insertMany(
    applications.map(({ company, ...application }) => ({
      ...application,
      companyId: companyIdByKey.get(company)
    }))
  );

  const applicationIdByKey = new Map(
    applications.map((application, index) => [
      `${application.company}::${application.role}`,
      createdApplications[index]._id
    ])
  );

  await Interview.insertMany(
    interviews.map(({ company, role, ...interview }) => ({
      ...interview,
      applicationId: applicationIdByKey.get(`${company}::${role}`)
    }))
  );

  await Contact.insertMany(
    contacts.map(({ company, ...contact }) => ({
      ...contact,
      companyId: companyIdByKey.get(company)
    }))
  );

  const counts = {
    companies: await Company.countDocuments(),
    applications: await Application.countDocuments(),
    interviews: await Interview.countDocuments(),
    contacts: await Contact.countDocuments()
  };

  console.log('Seed complete:', counts);
  await disconnectDatabase();
}

seed().catch(async (err) => {
  console.error('Seed failed:', err.message);
  await disconnectDatabase().catch(() => {});
  process.exit(1);
});
