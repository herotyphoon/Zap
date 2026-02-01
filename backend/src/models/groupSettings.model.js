const { Schema, model } = require('mongoose');

const groupSettingsSchema = new Schema({
        groupId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Group',
            index: true,
            unique: true
        },
        editSettings: {
            type: String,
            enum: ['ADMIN', 'MEMBER'],
            default: 'MEMBER',
        },
        sendMessages: {
            type: String,
            enum: ['ADMIN', 'MEMBER'],
            default: 'MEMBER',
        },
        addMembers: {
            type: String,
            enum: ['ADMIN', 'MEMBER'],
            default: 'MEMBER',
        },

    },
    { timestamps: true }
);

module.exports = model('GroupSettings', groupSettingsSchema);