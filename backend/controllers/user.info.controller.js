const pool = require('../utilities/database.connection');
const errorHandler = require('../middlewares/error.handler');

const getUserInfo = async (req, res, next) => {
    const { id } = req.params;
    
    try {
        const [user] = await pool.query(`
        SELECT
        *
        FROM
        user
        WHERE
        _id=?`, [id]);

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const { password, ...restUserInfo } = user[0];

        res.status(200).json(restUserInfo);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserInfo
}