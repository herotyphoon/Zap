const { Schema, model } = require('mongoose');
const bcrypt = require("bcryptjs");

const passwordResetSchema = new Schema({
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        token: {
            type: String,
            required: true,
            unique: true,
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        }
    },
    { timestamps: true }
);

passwordResetSchema.methods.compareToken = async function (candidateToken) {
    if (!candidateToken) return false;

    return await bcrypt.compare(candidateToken, this.token);
};

passwordResetSchema.pre('save', async function () {
    if (!this.isModified('token')) return;
    const salt = await bcrypt.genSalt(12);
    this.token = await bcrypt.hash(this.token, salt);
});

module.exports = model('PasswordResets', passwordResetSchema);