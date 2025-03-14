const jwt = require('jsonwebtoken');
const { request, response } = require('express');

const validateJWT = (req = request, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            result: false,
            message: 'No token in the request'
        });
    }
    try {
        const { uid, name, signature } = jwt.verify(token, process.env.SECRET_JWT_SEED);
        req.uid = uid;
        req.name = name;
    } catch (err) {
        return res.status(401).json({
            result: false,
            message: 'Invalid token'
        });
    }
    next();
}

module.exports = {
    validateJWT
}