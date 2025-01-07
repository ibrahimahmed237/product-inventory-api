const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const { productValidationRules, validate } = require('../middleware/validate.middleware');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// POST /products - Add new product (admin only)
router.post(
  '/',
  authorize('admin'),
  productValidationRules.create,
  validate,
  createProduct
);

// GET /products - List all products with pagination
router.get('/', productValidationRules.pagination, validate, getProducts);

// GET /products/:id - Get single product
router.get('/:id', getProduct);

// PUT /products/:id - Update product (admin only)
router.put(
  '/:id',
  authorize('admin'),
  productValidationRules.update,
  validate,
  updateProduct
);

// DELETE /products/:id - Delete product (admin only)
router.delete('/:id', authorize('admin'), deleteProduct);

module.exports = router;