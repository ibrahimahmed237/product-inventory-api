const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    integer: true,
  },
}, {
  timestamps: true,
});

// Create indexes for optimized queries
productSchema.index({ price: 1 });
productSchema.index({ category: 1 });
productSchema.index({ category: 1, price: -1 });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;