import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    date: { type: String, required: true }, // stored as YYYY-MM-DD for simple querying
    time: { type: String, required: true },
    guests: { type: String, required: true },
    message: { type: String, trim: true, maxlength: 500 },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

reservationSchema.index({ date: 1, time: 1 });
reservationSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Reservation', reservationSchema);
