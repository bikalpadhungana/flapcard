const jwt = require('jsonwebtoken');
const { generateNewToken, checkTokenAvailability } = require('../utilities/refresh.token');
const errorHandler = require('./error.handler');

const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return next(errorHandler(401, "Unauthorized"));
    }

    const token = authorization.split(" ")[1].split("&")[0];
    const refreshToken = authorization.split(" ")[1].split("&")[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                if (!await checkTokenAvailability(refreshToken)) {
                    return next(errorHandler(403, "Forbidden"));
                }

                const newToken = await generateNewToken();

                jwt.verify(newToken, process.env.JWT_SECRET_KEY, (err, user) => {
                    if (err) {
                        return next(errorHandler(403, err));
                    }

                    req.token = newToken;
                    req.user = user;
                });
            } else {
                return next(errorHandler(403, err));
            }
        }

        if (!req.user) {
            req.user = user;
        }
        next();
    });
}

module.exports = requireAuth;