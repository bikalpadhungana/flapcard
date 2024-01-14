const pool = require('../utilities/database.connection');
const errorHandler = require('../middlewares/error.handler');

const getRefreshToken = async (req, res, next) => {
    const { token: refreshToken } = req.params;

    try {
        const [isTokenAvailable] = await pool.query(`
        SELECT
        *
        FROM
        user_token_list
        WHERE
        refresh_token=?`, [refreshToken]);
    
        if (isTokenAvailable.length === 0) {
            return next(errorHandler(404, "Token unavailable"));
        }
    
        res.status(200).json({ message: "Token available" });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getRefreshToken
}