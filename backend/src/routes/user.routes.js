const express = require('express');

const { handleFetchProfileData, handleUpdateProfile, handleFetchUserPrivacySettings, handleUpdateUserPrivacySettings } = require('../controllers/user.controllers');
const { validateUpdateProfile } = require('../middleware/user/validateUpdateProfileRequest.middleware');
const { validateUpdateUserPrivacySettings } = require('../middleware/user/validateUpdateUserPrivacySettings.middleware.js');

const router = express.Router();

router.get('/me', handleFetchProfileData);

router.patch('/me', validateUpdateProfile, handleUpdateProfile);

router.get('/me/privacy', handleFetchUserPrivacySettings);

router.patch('/me/privacy', validateUpdateUserPrivacySettings, handleUpdateUserPrivacySettings);

module.exports = router;