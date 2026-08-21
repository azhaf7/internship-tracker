import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'A contact must belong to a company']
    },
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
      minlength: [2, 'Contact name must be at least 2 characters'],
      maxlength: [80, 'Contact name must be at most 80 characters']
    },
    role: {
      type: String,
      required: [true, 'Contact role is required'],
      trim: true,
      maxlength: [80, 'Contact role must be at most 80 characters']
    },
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be a valid address']
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [24, 'Phone number must be at most 24 characters']
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);
