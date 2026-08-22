import mongoose from 'mongoose';

export const APPLICATION_STAGES = [
  'wishlist',
  'applied',
  'screening',
  'interview',
  'offer',
  'rejected'
];

export const JOB_TYPES = ['internship', 'part-time', 'full-time', 'thesis'];

export const APPLICATION_SOURCES = [
  'LinkedIn',
  'Company site',
  'Referral',
  'Career fair',
  'University portal',
  'Recruiter'
];

const applicationSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'An application must belong to a company']
    },
    role: {
      type: String,
      required: [true, 'Role title is required'],
      trim: true,
      minlength: [3, 'Role title must be at least 3 characters'],
      maxlength: [100, 'Role title must be at most 100 characters']
    },
    jobType: {
      type: String,
      required: [true, 'Job type is required'],
      enum: {
        values: JOB_TYPES,
        message: '{VALUE} is not a valid job type'
      },
      default: 'internship'
    },
    // Wishlist → applied → interview → offer (or rejected).
    stage: {
      type: String,
      required: [true, 'Stage is required'],
      enum: {
        values: APPLICATION_STAGES,
        message: '{VALUE} is not a valid pipeline stage'
      },
      default: 'wishlist'
    },
    appliedDate: {
      type: Date,
      default: null
    },
    deadline: {
      type: Date,
      default: null
    },
    jobUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Job URL must start with http:// or https://']
    },
    salaryExpectation: {
      type: Number,
      min: [0, 'Salary expectation cannot be negative'],
      max: [120000, 'Salary expectation must be a monthly SEK figure below 120000']
    },
    source: {
      type: String,
      enum: {
        values: APPLICATION_SOURCES,
        message: '{VALUE} is not a tracked application source'
      },
      default: 'LinkedIn'
    },
    priority: {
      type: Number,
      min: [1, 'Priority must be between 1 and 5'],
      max: [5, 'Priority must be between 1 and 5'],
      default: 3
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes must be at most 1000 characters']
    }
  },
  { timestamps: true }
);

// Same role at the same company should only exist once.
applicationSchema.index({ companyId: 1, role: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
