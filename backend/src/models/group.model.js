const { Schema, model } = require('mongoose');

const groupSchema = new Schema({
        name: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50,
        },
        avatarURL: {
            type: String,
            required: true,
        },
        participants: {
            type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            required: true,
            index: true,
        },
        admins: {
            type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            required: true,
        },
        bio: {
            type: String,
            required: false,
            minlength: 2,
            maxlength: 200,
        },
        participantsLeft: {
            type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        }
    },
    { timestamps: true }
);

groupSchema.pre('save', function() {
    const participantSet = new Set(this.participants.map(id => id.toString()));
    const invalidAdmins = this.admins.filter(id => !participantSet.has(id.toString()));
    if (invalidAdmins.length > 0) {
        return new Error('All admins must be participants');
    }
});

module.exports = model('Group', groupSchema);