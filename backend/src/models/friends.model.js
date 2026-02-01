const { Schema, model } = require('mongoose');

const friendSchema = new Schema({
        user1: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        user2: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    { timestamps: true }
);

friendSchema.index(
    { user1: 1, user2: 1 },
    { unique: true }
);

friendSchema.index(
    {user2: 1, user1: 1},
    { unique: true },
);

friendSchema.pre('save', function() {
    if (this.user1.toString() > this.user2.toString()) {
        [this.user1, this.user2] = [this.user2, this.user1];
    }
});

friendSchema.statics.createFriendship = async function (userA, userB) {
    if (userA.toString() === userB.toString()) {
        throw new Error('Users cannot be friends with themselves');
    }

    const [user1, user2] = [userA, userB].sort((a, b) =>
        a.toString().localeCompare(b.toString())
    );

    try {
        return await this.create({ user1, user2 });
    } catch (err) {
        if (err?.code === 11000) {
            return this.findOne({ user1, user2 });
        }
        throw err;
    }
};

friendSchema.statics.getFriendsForUser = async function (userId) {
    const friendships = await this.find({
        $or: [{ user1: userId }, { user2: userId }]
    })
        .populate('user1', 'fullName username avatarURL')
        .populate('user2', 'fullName username avatarURL');

    return friendships
        .map(f => {
            const user1 = f.user1;
            const user2 = f.user2;
            if (!user1 || !user2) return null;
            return user1._id.toString() === userId.toString() ? user2 : user1;
        })
        .filter(Boolean)
        .sort((a, b) => {
            const aName = a.fullName || a.username || '';
            const bName = b.fullName || b.username || '';
            return aName.localeCompare(bName, undefined, {sensitivity: 'base'});
        });
};

friendSchema.pre('validate', function () {
    if (!this.user1 || !this.user2) {
        throw new Error('Friendship must contain exactly 2 users');
    }
    if (this.user1.toString() === this.user2.toString()) {
        throw new Error('Users cannot be friends with themselves');
    }
    if (this.user1.toString() > this.user2.toString()) {
        [this.user1, this.user2] = [this.user2, this.user1];
    }
});

module.exports = model('Friends', friendSchema);
