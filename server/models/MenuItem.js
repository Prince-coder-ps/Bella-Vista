import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 120 },
    description: { type: String, required: [true, 'Description is required'], trim: true, maxlength: 500 },
    price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price cannot be negative'] },
    category: {
      type: String,
      required: true,
      enum: ['Appetizers', 'Main Course', 'Desserts', 'Beverages'],
    },
    image: { type: String, default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80' },
    isAvailable: { type: Boolean, default: true },
    isChefSpecial: { type: Boolean, default: false },
  },
  { timestamps: true }
);

menuItemSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('MenuItem', menuItemSchema);
