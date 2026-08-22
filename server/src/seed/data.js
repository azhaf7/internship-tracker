// Realistic job-hunt data for a Kristianstad University student looking for a
// 2026 summer internship, mostly around Skane with a few Stockholm long shots.

export const companies = [
  {
    key: 'axis',
    name: 'Axis Communications',
    industry: 'Telecom',
    location: 'Lund, Sweden',
    website: 'https://www.axis.com',
    employeeCount: 4500,
    notes: 'Network camera company in Lund. Big summer internship intake, closest serious option to Kristianstad.'
  },
  {
    key: 'massive',
    name: 'Massive Entertainment',
    industry: 'Gaming',
    location: 'Malmo, Sweden',
    website: 'https://www.massive.se',
    employeeCount: 700,
    notes: 'Ubisoft studio behind The Division. Tools programming is the realistic way in, not gameplay.'
  },
  {
    key: 'sinch',
    name: 'Sinch',
    industry: 'Telecom',
    location: 'Malmo, Sweden',
    website: 'https://www.sinch.com',
    employeeCount: 4000,
    notes: 'Messaging APIs. Heavy Node and REST work, matches the stack from this course.'
  },
  {
    key: 'tetrapak',
    name: 'Tetra Pak',
    industry: 'Retail',
    location: 'Lund, Sweden',
    website: 'https://www.tetrapak.com',
    employeeCount: 25000,
    notes: 'Applied through the university portal. Slow process, structured graduate programme.'
  },
  {
    key: 'klarna',
    name: 'Klarna',
    industry: 'Fintech',
    location: 'Stockholm, Sweden',
    website: 'https://www.klarna.com',
    employeeCount: 5000,
    notes: 'Long shot. Would need to relocate, but the internship pays well.'
  },
  {
    key: 'ikeait',
    name: 'IKEA IT',
    industry: 'Retail',
    location: 'Malmo, Sweden',
    website: 'https://www.ingka.com',
    employeeCount: 2000,
    notes: 'Internal digital products. Met them at the Kristianstad career fair in February.'
  }
];

export const applications = [
  {
    company: 'axis',
    role: 'Summer Intern, Backend Engineering',
    jobType: 'internship',
    stage: 'interview',
    appliedDate: '2026-02-18',
    deadline: '2026-03-01',
    jobUrl: 'https://www.axis.com/careers/summer-internship-backend',
    salaryExpectation: 28000,
    source: 'Company site',
    priority: 5,
    notes: 'Two rounds done. They asked a lot about REST design and how I would version an API.'
  },
  {
    company: 'axis',
    role: 'Thesis Project, Video Analytics',
    jobType: 'thesis',
    stage: 'wishlist',
    appliedDate: null,
    deadline: '2026-10-15',
    jobUrl: 'https://www.axis.com/careers/thesis-projects',
    salaryExpectation: 0,
    source: 'University portal',
    priority: 3,
    notes: 'Backup plan for next spring if no summer offer lands. Needs a partner student.'
  },
  {
    company: 'massive',
    role: 'Tools Programmer Intern',
    jobType: 'internship',
    stage: 'screening',
    appliedDate: '2026-03-04',
    deadline: '2026-03-15',
    jobUrl: 'https://www.massive.se/careers/tools-programmer-intern',
    salaryExpectation: 26000,
    source: 'LinkedIn',
    priority: 4,
    notes: 'Recruiter replied in five days asking for a portfolio. Sent the Unity tilemap editor project.'
  },
  {
    company: 'sinch',
    role: 'Backend Developer Intern',
    jobType: 'internship',
    stage: 'offer',
    appliedDate: '2026-02-02',
    deadline: '2026-02-20',
    jobUrl: 'https://www.sinch.com/careers/backend-intern',
    salaryExpectation: 27500,
    source: 'Referral',
    priority: 5,
    notes: 'Offer received, need to answer by 5 September. Referred by Oskar from the student association.'
  },
  {
    company: 'sinch',
    role: 'Part-time Support Engineer',
    jobType: 'part-time',
    stage: 'rejected',
    appliedDate: '2025-11-12',
    deadline: '2025-11-30',
    jobUrl: 'https://www.sinch.com/careers/support-engineer',
    salaryExpectation: 18000,
    source: 'LinkedIn',
    priority: 2,
    notes: 'Rejected at CV stage last autumn. They wanted two years of support experience.'
  },
  {
    company: 'tetrapak',
    role: 'IT Graduate Programme',
    jobType: 'full-time',
    stage: 'applied',
    appliedDate: '2026-08-01',
    deadline: '2026-09-30',
    jobUrl: 'https://www.tetrapak.com/careers/graduate',
    salaryExpectation: 34000,
    source: 'University portal',
    priority: 3,
    notes: 'Starts autumn 2027, so this is the post-graduation option. No response yet.'
  },
  {
    company: 'klarna',
    role: 'Engineering Intern, Payments',
    jobType: 'internship',
    stage: 'rejected',
    appliedDate: '2026-01-20',
    deadline: '2026-02-01',
    jobUrl: 'https://www.klarna.com/careers/engineering-intern',
    salaryExpectation: 32000,
    source: 'Company site',
    priority: 4,
    notes: 'Failed the online assessment. Ran out of time on the second algorithm question.'
  },
  {
    company: 'klarna',
    role: 'Frontend Intern, Merchant Portal',
    jobType: 'internship',
    stage: 'wishlist',
    appliedDate: null,
    deadline: '2026-11-01',
    jobUrl: 'https://www.klarna.com/careers/frontend-intern',
    salaryExpectation: 32000,
    source: 'Company site',
    priority: 2,
    notes: 'Opens again in November. Worth retrying now that I have more React on the CV.'
  },
  {
    company: 'ikeait',
    role: 'Fullstack Developer Intern',
    jobType: 'internship',
    stage: 'interview',
    appliedDate: '2026-03-10',
    deadline: '2026-03-31',
    jobUrl: 'https://www.ingka.com/careers/fullstack-intern',
    salaryExpectation: 25000,
    source: 'Career fair',
    priority: 4,
    notes: 'Met Sara at the career fair, she pushed the application internally. Technical round booked.'
  },
  {
    company: 'ikeait',
    role: 'Summer Job, Data Quality',
    jobType: 'part-time',
    stage: 'applied',
    appliedDate: '2026-04-02',
    deadline: '2026-04-20',
    jobUrl: 'https://www.ingka.com/careers/data-quality-summer',
    salaryExpectation: 22000,
    source: 'Career fair',
    priority: 1,
    notes: 'Fallback if the fullstack role falls through. Mostly SQL and spreadsheet cleanup.'
  }
];

export const interviews = [
  {
    company: 'axis',
    role: 'Summer Intern, Backend Engineering',
    round: 1,
    type: 'phone',
    scheduledAt: '2026-03-05T09:00:00Z',
    interviewer: 'Henrik Lindqvist',
    durationMinutes: 30,
    outcome: 'passed',
    notes: 'Mostly motivation and course background. Asked why I chose Kristianstad.'
  },
  {
    company: 'axis',
    role: 'Summer Intern, Backend Engineering',
    round: 2,
    type: 'technical',
    scheduledAt: '2026-03-19T13:00:00Z',
    interviewer: 'Petra Sandberg',
    durationMinutes: 90,
    outcome: 'passed',
    notes: 'Designed a REST API for camera firmware updates on the whiteboard. Stumbled on pagination.'
  },
  {
    company: 'axis',
    role: 'Summer Intern, Backend Engineering',
    round: 3,
    type: 'onsite',
    scheduledAt: '2026-09-02T10:00:00Z',
    interviewer: 'Henrik Lindqvist',
    durationMinutes: 180,
    outcome: 'scheduled',
    notes: 'Final round in Lund. Team lunch plus a system design session.'
  },
  {
    company: 'massive',
    role: 'Tools Programmer Intern',
    round: 1,
    type: 'phone',
    scheduledAt: '2026-03-24T15:30:00Z',
    interviewer: 'Daniel Ohlsson',
    durationMinutes: 45,
    outcome: 'passed',
    notes: 'Walked through the tilemap editor project. They liked the undo stack implementation.'
  },
  {
    company: 'sinch',
    role: 'Backend Developer Intern',
    round: 1,
    type: 'technical',
    scheduledAt: '2026-02-16T10:00:00Z',
    interviewer: 'Milad Haghighi',
    durationMinutes: 60,
    outcome: 'passed',
    notes: 'Live coding: parse a webhook payload and handle retries idempotently.'
  },
  {
    company: 'sinch',
    role: 'Backend Developer Intern',
    round: 2,
    type: 'behavioural',
    scheduledAt: '2026-02-26T14:00:00Z',
    interviewer: 'Anna Ekstrom',
    durationMinutes: 45,
    outcome: 'passed',
    notes: 'Team fit conversation. Talked about the group project conflict from DA204A.'
  },
  {
    company: 'klarna',
    role: 'Engineering Intern, Payments',
    round: 1,
    type: 'technical',
    scheduledAt: '2026-01-28T08:00:00Z',
    interviewer: 'Automated assessment',
    durationMinutes: 75,
    outcome: 'failed',
    notes: 'HackerRank style test. Passed question one, timed out on the graph problem.'
  },
  {
    company: 'ikeait',
    role: 'Fullstack Developer Intern',
    round: 1,
    type: 'case',
    scheduledAt: '2026-09-08T09:30:00Z',
    interviewer: 'Sara Bergqvist',
    durationMinutes: 120,
    outcome: 'scheduled',
    notes: 'Take-home case presented live: model a product availability service.'
  }
];

export const contacts = [
  {
    company: 'axis',
    name: 'Henrik Lindqvist',
    role: 'Engineering Manager, Firmware',
    email: 'henrik.lindqvist@axis.com',
    phone: '+46 46 272 18 00',
    isPrimary: true
  },
  {
    company: 'axis',
    name: 'Petra Sandberg',
    role: 'Senior Backend Engineer',
    email: 'petra.sandberg@axis.com',
    phone: '',
    isPrimary: false
  },
  {
    company: 'massive',
    name: 'Daniel Ohlsson',
    role: 'Technical Recruiter',
    email: 'daniel.ohlsson@massive.se',
    phone: '+46 40 600 20 10',
    isPrimary: true
  },
  {
    company: 'sinch',
    name: 'Milad Haghighi',
    role: 'Backend Team Lead',
    email: 'milad.haghighi@sinch.com',
    phone: '+46 40 685 50 00',
    isPrimary: true
  },
  {
    company: 'sinch',
    name: 'Anna Ekstrom',
    role: 'People Partner',
    email: 'anna.ekstrom@sinch.com',
    phone: '',
    isPrimary: false
  },
  {
    company: 'tetrapak',
    name: 'Johan Persson',
    role: 'Graduate Programme Coordinator',
    email: 'johan.persson@tetrapak.com',
    phone: '+46 46 36 10 00',
    isPrimary: true
  },
  {
    company: 'ikeait',
    name: 'Sara Bergqvist',
    role: 'Engineering Manager, Digital',
    email: 'sara.bergqvist@ingka.com',
    phone: '+46 40 30 40 00',
    isPrimary: true
  }
];
