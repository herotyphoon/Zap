function validateUpdateProfile (req, res, next) {
    try {
        const updates = {};
        const { fullName, bio } = req.body;

        if (typeof fullName === 'string') {
            const trimmedFullName = fullName.trim();
            if (trimmedFullName.length < 2 || trimmedFullName.length > 100) {
                return res.status(400).json({ message: 'Full name must be between 2 and 100 characters' });
            }
            updates.fullName = trimmedFullName;
        }

        if (typeof bio === 'string') {
            const trimmedBio = bio.trim();
            if (trimmedBio.length < 1 || trimmedBio.length > 500) {
                return res.status(400).json({ message: 'Bio must be between 1 and 500 characters' });
            }
            updates.bio = trimmedBio;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        req.updates = updates;

        next();
    } catch (error) {
        console.error('Error validating update profile request: ', error.message);
        return res.status(500).json({message: 'Internal Server Error'});
    }
}

module.exports = { validateUpdateProfile };