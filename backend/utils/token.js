const jwt = require("jsonwebtoken");


const SECRET_KEY = 'khjfsdgbjhfg'

const createNewToken = (payload) => {
    return jwt.sign({ userId: payload }, SECRET_KEY, { expiresIn: '10d' });
}

module.exports = { createNewToken }