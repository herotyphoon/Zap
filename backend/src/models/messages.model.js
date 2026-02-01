const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
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
        isSeen: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

messageSchema.index({ senderId: 1, receiverId: 1, createdAt: 1 });
messageSchema.index({ receiverId: 1, senderId: 1, createdAt: 1 });

messageSchema.pre('validate', function () {
    if (!this.text && !this.imageURL) {
        return next(new Error('Message must contain text or image'));
    }
});

module.exports = model('Messages', messageSchema);