const jwt = require('jsonwebtoken');
const errorHandler = require('./error.handler');

const requireAuth = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return next(errorHandler(401, "Unauthorized"));
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return next(errorHandler(403, "Forbidden"));
        }

        req.user = user;
        next();
    });
}

module.exports = requireAuth;