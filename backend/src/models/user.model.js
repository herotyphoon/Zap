const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 50,
    },
    fullName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        select: false,
    },
    avatarURL: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 200,
    },
    birthdate: {
        type: Date,
        required: false,
    },
    lastSeenAt: {
        type: Date,
        required: false,
    },
    isOnline: {
        type: Boolean,
        default: false,
    }
},
    { timestamps: true }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!candidatePassword) return false;

    if (!this.password) {
        throw new Error(
            'Password not loaded. Use .select("+password") before comparePassword().'
        );
    }

    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = model('User', userSchema);