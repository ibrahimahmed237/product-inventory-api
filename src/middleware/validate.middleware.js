const { validationResult, body, query } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg
    }));
    return next(new ApiError('Validation Error', 400, errorMessages));
  }
  next();
};

const productValidationRules = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Product name is required')
      .isLength({ max: 100 })
      .withMessage('Product name must be less than 100 characters'),
    
    body('category')
      .optional()
      .trim()
      .isString()
      .withMessage('Category must be a string')
      .isLength({ max: 50 })
      .withMessage('Category must be less than 50 characters'),
    
    body('price')
      .notEmpty()
      .withMessage('Price is required')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number')
      .custom((value) => {
        if (value > 1000000) {
          throw new Error('Price must be less than 1,000,000');
        }
        return true;
      }),
    
    body('quantity')
      .notEmpty()
      .withMessage('Quantity is required')
      .isInt({ min: 0 })
      .withMessage('Quantity must be a non-negative integer')
  ],
  
  update: [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Product name cannot be empty')
      .isLength({ max: 100 })
      .withMessage('Product name must be less than 100 characters'),
    
    body('category')
      .optional()
      .trim()
      .isString()
      .withMessage('Category must be a string')
      .isLength({ max: 50 })
      .withMessage('Category must be less than 50 characters'),
    
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number')
      .custom((value) => {
        if (value > 1000000) {
          throw new Error('Price must be less than 1,000,000');
        }
        return true;
      }),
    
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Quantity must be a non-negative integer')
  ],

  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ]
};

const authValidationRules = {
  login: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ]
};

module.exports = {
  validate,
  productValidationRules,
  authValidationRules
};