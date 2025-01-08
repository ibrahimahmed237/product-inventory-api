const User = require('../models/user.model');
const { generateToken } = require('../config/jwt');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new ApiError('Invalid email or password', 401));
  }

  const token = generateToken(user._id);

  res.status(200).json({
    status: 'success',
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    }
  });
});

const signup = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError('Email already in use', 400));
  }

  const user = await User.create({ email, password, role });
  const token = generateToken(user._id);

  res.status(201).json({
    status: 'success',
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role 
      }
    }
  });
});

module.exports = { login, signup };