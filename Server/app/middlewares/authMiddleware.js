// authMiddleware.js

const jwt = require('jsonwebtoken');
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('private-key.pem');

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user_id = decoded.user_id;
        next();
    });
};

module.exports = authenticateJWT;
