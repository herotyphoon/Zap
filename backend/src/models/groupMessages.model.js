const { Schema, model } = require('mongoose');

const groupMessageSchema = new Schema({
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        groupId: {
            type: Schema.Types.ObjectId,
            ref: 'Group',
            required: true,
        },
        text: {
            type: String,
            trim: true,
            minlength: 1,
            maxlength: 2000,
        },
        imageURL: {
            type: String,
        },
        seenBy: {
            type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            default: [],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

groupMessageSchema.index({ senderId: 1, groupId: 1, createdAt: 1 });
groupMessageSchema.index({ groupId: 1, senderId: 1, createdAt: 1 });

groupMessageSchema.pre('validate', function (next) {
    if (!this.text && !this.imageURL) {
        return next(new Error('Message must contain text or image'));
    }
    next();
});

module.exports = model('GroupMessages', groupMessageSchema);