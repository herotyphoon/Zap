const { v4 : uuid4 } = require('uuid');

function generateResetPasswordToken() {
    return uuid4();
}

module.exports = { generateResetPasswordToken };