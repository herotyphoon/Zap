const User = require('../../models/user.model.js');
const PasswordResets = require("../../models/passwordResets.model");
const {generateResetPasswordToken} = require("../../utils/generateForgotPasswordToken.util");

async function validateForgotPasswordRequest(req, res, next) {
    try {
        const { username, token, password } = req.body;

        if (!username || !token || !password) {
            return res.status(400).json({ message: 'Username, password and token are required' });
        }

        const user = await User.findOne({ username }).select('+password');

        if (user) {
            const reset = await PasswordResets.findOne({ userId: user._id });
            if (!reset) {
                return res.status(400).json({ message: 'No reset request found for this user' });
            }

            if (await reset.compareToken(token)) {
                const isSamePassword = await user.comparePassword(password);

                if (isSamePassword) {
                    return res.status(409).json({ message: 'New Password Should Not Be Same As Old Password!' });
                }
                if (reset.expiresAt < Date.now()) {
                    reset.token = generateResetPasswordToken();
                    await reset.save();
                }
                if (password.length < 8) return res.status(400).json({message: 'Password must be at least 8 characters'});

                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
                if (!passwordRegex.test(password)) {
                    return res.status(400).json({
                        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                    });
                }
                req.userToUpdate = user;
                return next();
            }
            return res.status(403).json({ message: 'Invalid Reset Token' });
        }
        return res.status(400).json({ message: 'No Such User Exists!' });
    } catch (error) {
        console.error("Error Resetting Password: ", error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { validateForgotPasswordRequest };