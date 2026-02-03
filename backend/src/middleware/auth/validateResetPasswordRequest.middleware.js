const User = require('../../models/user.model.js');

async function validateResetPasswordRequest(req, res, next) {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Both old and new password are required' });
        }

        const user = await User.findById(req.user._id).select("+password");
        if (await user.comparePassword(oldPassword)) {
            const isSamePassword = await user.comparePassword(newPassword);

            if (isSamePassword) {
                return res.status(409).json({ message: 'New Password Should Not Be Same As Old Password!' });
            }

            if (newPassword.length < 8) return res.status(400).json({message: 'Password must be at least 8 characters'});

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
            if (!passwordRegex.test(newPassword)) {
                return res.status(400).json({
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                });
            }
            req.userToUpdate = user;
            return next();
        }
        return res.status(401).json({ message: 'Invalid old password!' });
    } catch (error) {
        console.error("Error Resetting Password: ", error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

}

module.exports = { validateResetPasswordRequest };