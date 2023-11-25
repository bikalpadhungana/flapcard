const jwt = require('jsonwebtoken');
const errorHandler = require('./error.handler');

const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return next(errorHandler(401, "Unauthorized"));
    }

    const token = authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return next(errorHandler(403, "Forbidden"));
        }

        req.user = user;
        next();
    });
}

module.exports = requireAuth;