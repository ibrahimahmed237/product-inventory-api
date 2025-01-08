const express = require('express');
const { login, signup } = require('../controllers/auth.controller');
const { authValidationRules, validate } = require('../middleware/validate.middleware');

const router = express.Router();

router.post('/signup', authValidationRules.signup, validate, signup);
router.post('/login', authValidationRules.login, validate, login);

module.exports = router;