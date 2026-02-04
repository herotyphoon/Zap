async function validateUpdateUserPrivacySettings (req, res, next) {
    const {
        dmPolicy,
        friendRequestPolicy,
        groupInvitePolicy,
        profileVisibility,
        showOnlineStatus,
        showLastSeen
    } = req.body;

    const updates = {};

    if (['EVERYONE', 'FRIENDS_ONLY', 'NO_ONE'].includes(dmPolicy)) {
        updates.dmPolicy = dmPolicy;
    }

    if (['EVERYONE', 'FRIENDS_OF_FRIENDS', 'NO_ONE'].includes(friendRequestPolicy)) {
        updates.friendRequestPolicy = friendRequestPolicy;
    }

    if (['EVERYONE', 'FRIENDS_ONLY', 'NO_ONE'].includes(groupInvitePolicy)) {
        updates.groupInvitePolicy = groupInvitePolicy;
    }

    if (['PUBLIC', 'FRIENDS_ONLY', 'PRIVATE'].includes(profileVisibility)) {
        updates.profileVisibility = profileVisibility;
    }

    if (typeof showOnlineStatus === 'boolean') {
        updates.showOnlineStatus = showOnlineStatus;
    }

    if (typeof showLastSeen === 'boolean') {
        updates.showLastSeen = showLastSeen;
    }

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'No valid fields to update' });
    }

    const setObject = Object.fromEntries(
        Object.entries(updates).map(
            ([key, value]) => [`privacy.${key}`, value]
        )
    );

    req.updates = setObject;
    next();
}

module.exports = { validateUpdateUserPrivacySettings };