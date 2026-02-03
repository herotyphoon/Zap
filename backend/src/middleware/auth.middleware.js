const {getUserFromToken} = require('../services/auth.service');

function checkAuthentication(req, res, next) {
    const token = req.cookies?.__sessionID;

    if (token) {
        try {
            req.user = getUserFromToken(token);
        } catch(error) {
            req.user = null;
        }
    } else {
        req.user = null;
    }

    next();
}

function checkAuthorization(req, res, next) {
    if (!req.user) return res.status(401).json({message: 'Not authorized'});
    next();
}

module.exports = { checkAuthentication, checkAuthorization };