const Product = require('../models/product.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { cacheMiddleware } = require('../utils/queryOptimization');
const mongoose = require('mongoose');

// POST /products
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    quantity: req.body.quantity
  });

  res.status(201).json({
    status: 'success',
    data: { product }
  });
});

// GET /products
const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const total = await Product.countDocuments();

  // Execute query with pagination
  const products = await Product.find()
    .select('name category price quantity')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  res.status(200).json({
    status: 'success',
    data: {
      products,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
});

// GET /products/:id
const getProduct = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ApiError('Invalid product ID', 400));
  }

  const product = await Product.findById(req.params.id)
    .select('name category price quantity')
    .lean();
  
  if (!product) {
    return next(new ApiError('Product not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { product }
  });
});

// PUT /products/:id
const updateProduct = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ApiError('Invalid product ID', 400));
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity
    },
    {
      new: true,
      runValidators: true
    }
  ).lean();

  if (!product) {
    return next(new ApiError('Product not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { product }
  });
});

// DELETE /products/:id
const deleteProduct = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ApiError('Invalid product ID', 400));
  }

  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new ApiError('Product not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
};