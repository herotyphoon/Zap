const Friends = require('../models/friends.model.js')

async function tryCompleteMutualRequest(FriendRequest, senderId, receiverId) {
    const session = await FriendRequest.startSession();
    try {
        let result = null;
        await session.withTransaction(async () => {
            const reverseRequest = await FriendRequest.findOneAndDelete({
                senderId: receiverId,
                receiverId: senderId,
                status: 'pending'
            }).session(session);

            if (reverseRequest) {
                const friendship = await Friends.createFriendship(senderId, receiverId, { session });
                result = { accepted: true, friendship };
            }
        });
        return result;
    } finally {
        await session.endSession();
    }
}

module.exports = {tryCompleteMutualRequest};