const ms = require('ms');

const User = require('../models/user.model.js');
const PasswordResets = require('../models/passwordResets.model.js');
const { generateToken } = require('../services/auth.service.js');
const { generateResetPasswordToken } = require('../utils/generateForgotPasswordToken.util.js')

async function handleSignUp(req, res) {
    try {
        if (!process.env.JWT_EXPIRE) {
            throw new Error('JWT_EXPIRE environment variable is required');
        }

        const {username, fullName, password} = req.body;

        const jwtExpire = ms(process.env.JWT_EXPIRE);

        if (jwtExpire === undefined) {
            throw new Error('JWT_EXPIRE has invalid format');
        }

        const newUser = await User.create({
            username,
            fullName,
            password,
            avatarURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=4299e1&color=fff`
        });

        await PasswordResets.create({
            userId: newUser._id,
            token: generateResetPasswordToken(),
        });

        const token = generateToken(newUser);

        return res.status(201).cookie('__sessionID', token, {
            httpOnly: true,
            maxAge: jwtExpire,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        }).json({
            message: 'User successfully created!'
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: 'Username already exists' });
        }
        console.error( "Error Signing Up: ", error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function handleLogin(req, res) {
    try {
        if (!process.env.JWT_EXPIRE) {
            throw new Error('JWT_EXPIRE environment variable is required');
        }

        const jwtExpire = ms(process.env.JWT_EXPIRE);

        if (jwtExpire === undefined) {
            throw new Error('JWT_EXPIRE has invalid format');
        }

        const { username, password } = req.body;

        const user = await User.findOne({ username }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const token = generateToken(user);

        return res.status(200).cookie('__sessionID', token, {
            httpOnly: true,
            maxAge: jwtExpire,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        }).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            avatarURL: user.avatarURL,
            message: 'Login successful!'
        });

    } catch (error) {
        console.error("Error Logging In: ", error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

function handleLogout(req, res) {
    res.clearCookie('__sessionID', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    });
    return res.status(204).end();
}

async function handleForgotPassword(req, res) {
    try {
        const user = req.userToUpdate;
        const newPassword = req.body.password;
        user.password = newPassword;
        await user.save();
        return res.status(200).json({ message: 'Password successfully updated!' });
    } catch (error) {
        console.error("Error Resetting Password: ", error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function handleResetPassword(req, res) {
    try {
        const user = req.userToUpdate;
        const newPassword = req.body.newPassword;
        user.password = newPassword;
        await user.save();
        return res.status(200).json({ message: 'Password successfully updated!' });
    } catch (error) {
        console.error("Error Resetting Password: ", error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { handleSignUp, handleLogin, handleLogout, handleForgotPassword, handleResetPassword };