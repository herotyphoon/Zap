const { Schema, model } = require('mongoose');

const userSettingsSchema = new Schema({
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
            unique: true
        },
        privacy: {
            dmPolicy: {
                type: String,
                required: false,
                enum: ['EVERYONE', 'FRIENDS_ONLY', 'NO_ONE'],
                default: 'EVERYONE',
            },
            friendRequestPolicy: {
                type: String,
                required: false,
                enum: ['EVERYONE', 'FRIENDS_OF_FRIENDS', 'NO_ONE'],
                default: 'EVERYONE',
            },
            groupInvitePolicy: {
                type: String,
                required: false,
                enum: ['EVERYONE', 'FRIENDS_ONLY', 'NO_ONE'],
                default: 'EVERYONE',
            },
            profileVisibility: {
                type: String,
                required: false,
                enum: ['PUBLIC', 'FRIENDS_ONLY', 'PRIVATE'],
                default: 'PUBLIC',
            },
            showOnlineStatus: {
                type: Boolean,
                required: false,
                default: true,
            },
            showLastSeen: {
                type: Boolean,
                required: false,
                default: true,
            }
        },
        blockedUserIds: {
            type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            required: false,
            default: [],
        }
    },
    { timestamps: true }
);

module.exports = model('UserSettings', userSettingsSchema);