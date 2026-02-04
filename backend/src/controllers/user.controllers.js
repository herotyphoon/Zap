const User = require('../models/user.model.js');
const UserSettings = require('../models/userSettings.model.js');

async function handleFetchProfileData (req, res) {
    try {
        const user = req.user;
        const { username, fullName, avatarURL, bio } = await User.findOne({ _id: user._id});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({
            username,
            fullName,
            avatarURL,
            bio
        });
    } catch (error) {
        console.error('Error fetching profile data: ', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

}

async function handleUpdateProfile(req, res) {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: req.updates },
            {
                new: true,
                runValidators: true,
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updatings profile data: ', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function handleFetchUserPrivacySettings (req, res) {
    try {
        const user = req.user;
        const settings = await UserSettings.findOne({ userId: user._id});
        if (!settings) {
            return res.status(404).json({ message: 'Privacy settings not found' });
        }
        return res.status(200).json(settings.privacy);
    } catch (error) {
        console.error('Error fetching privacy settings: ', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

}

async function handleUpdateUserPrivacySettings(req, res) {
    try {
        const user = req.user;
        const updates = req.updates;

        const updatedSettings = await UserSettings.findOneAndUpdate(
            { userId: user._id },
            { $set: updates },
            {
                new: true,
                runValidators: true,
                upsert: true
            }
        );

        if (!updatedSettings) {
            return res.status(404).json({ message: 'Privacy settings not found' });
        }

        return res.status(200).json(updatedSettings);
    } catch (error) {
        console.error('Error updating privacy settings:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { handleFetchProfileData, handleUpdateProfile, handleFetchUserPrivacySettings, handleUpdateUserPrivacySettings };