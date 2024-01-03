const jwt = require('jsonwebtoken');
const pool = require('./database.connection');

let userId;

const checkTokenAvailability = async (refreshToken) => {
    const [tokenChecked] = await pool.query(`
    SELECT
    *
    FROM
    user_token_list
    WHERE
    refresh_token=?`, [refreshToken]);

    if (tokenChecked.length === 0) {
        return false;
    }

    return true;
}

const generateNewToken = async () => {

    const token = await jwt.sign({ _id: userId }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });

    return token;
}

module.exports = {
    checkTokenAvailability,
    generateNewToken
};