const { Schema, model } = require('mongoose');

const chatSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: ['USER', 'GROUP'],
            required: true,
        },

        peerUserId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

        groupId: {
            type: Schema.Types.ObjectId,
            ref: 'Group'
        },

        title: {
            type: String,
            required: true,
        },

        avatarURL: {
            type: String,
            required: true,
        },

        lastMessage: {
            text: {
                type: String,
            },
            senderId: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            createdAt: {
                type: Date,
            },
        },

        unreadCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        isPinned: {
            type: Boolean,
            default: false,
        },

        isMuted: {
            type: Boolean,
            default: false,
        },

        lastReadAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

chatSchema.index(
    { userId: 1, updatedAt: -1 }
);

chatSchema.index(
    { userId: 1, isPinned: -1, updatedAt: -1 }
);

chatSchema.index(
    { userId: 1, peerUserId: 1 },
    { unique: true, sparse: true }
);

chatSchema.index(
    { userId: 1, groupId: 1 },
    { unique: true, sparse: true }
);

chatSchema.pre('validate', function () {
    const hasPeer = !!this.peerUserId;
    const hasGroup = !!this.groupId;

    if (this.type === 'USER') {
        if (!hasPeer) {
            return new Error('peerUserId is required for USER conversations');
        }
        if (hasGroup) {
            return new Error('groupId must be empty for USER conversations');
        }
    } else if (this.type === 'GROUP') {
        if (!hasGroup) {
            return new Error('groupId is required for GROUP conversations');
        }
        if (hasPeer) {
            return new Error('peerUserId must be empty for GROUP conversations');
        }
    }
});

module.exports = model('Conversation', chatSchema);