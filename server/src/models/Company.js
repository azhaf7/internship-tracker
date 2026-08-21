import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      unique: true,
      minlength: [2, 'Company name must be at least 2 characters'],
      maxlength: [80, 'Company name must be at most 80 characters']
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      enum: {
        values: ['Software', 'Gaming', 'Fintech', 'Consulting', 'Automotive', 'Healthtech', 'Telecom', 'Retail'],
        message: '{VALUE} is not a supported industry'
      }
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    website: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Website must start with http:// or https://']
    },
    employeeCount: {
      type: Number,
      min: [1, 'A company must have at least 1 employee'],
      max: [500000, 'Employee count looks unrealistic']
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes must be at most 500 characters']
    }
  },
  { timestamps: true }
);

export default mongoose.model('Company', companySchema);
