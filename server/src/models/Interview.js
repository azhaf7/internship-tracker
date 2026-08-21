import mongoose from 'mongoose';

export const INTERVIEW_TYPES = ['phone', 'technical', 'behavioural', 'onsite', 'case'];
export const INTERVIEW_OUTCOMES = ['scheduled', 'passed', 'failed', 'cancelled'];

const interviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'An interview must belong to an application']
    },
    round: {
      type: Number,
      required: [true, 'Round number is required'],
      min: [1, 'Round must be at least 1'],
      max: [8, 'Round must be at most 8']
    },
    type: {
      type: String,
      required: [true, 'Interview type is required'],
      enum: {
        values: INTERVIEW_TYPES,
        message: '{VALUE} is not a valid interview type'
      }
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Interview date is required']
    },
    interviewer: {
      type: String,
      trim: true,
      maxlength: [80, 'Interviewer name must be at most 80 characters']
    },
    durationMinutes: {
      type: Number,
      min: [15, 'An interview is at least 15 minutes'],
      max: [480, 'An interview is at most 8 hours']
    },
    outcome: {
      type: String,
      enum: {
        values: INTERVIEW_OUTCOMES,
        message: '{VALUE} is not a valid outcome'
      },
      default: 'scheduled'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes must be at most 1000 characters']
    }
  },
  { timestamps: true }
);

export default mongoose.model('Interview', interviewSchema);
