const express = require('express');

const { handleSignUp, handleLogin, handleLogout, handleForgotPassword, handleResetPassword } = require('../controllers/auth.controllers.js');
const { validateSignupRequest } = require('../middleware/auth/validateSignupRequest.middleware.js');
const { validateLogin } = require('../middleware/auth/validateLoginRequest.middleware.js');
const { validateForgotPasswordRequest } = require('../middleware/auth/validateForgotPasswordRequest.middleware.js');
const { validateResetPasswordRequest } = require('../middleware/auth/validateResetPasswordRequest.middleware.js');
const { checkAuthorization } = require('../middleware/auth.middleware.js');

const router = express.Router();

router.post('/signup', validateSignupRequest, handleSignUp);

router.post('/login', validateLogin, handleLogin);

router.post('/logout', checkAuthorization, handleLogout);

router.patch('/password/forgot', validateForgotPasswordRequest, handleForgotPassword);

router.patch('/password/reset', checkAuthorization, validateResetPasswordRequest, handleResetPassword);

module.exports = router;