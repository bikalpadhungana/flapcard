const pool = require('../utilities/database.connection');
const bcrypt = require('bcrypt');
const errorHandler = require('../middlewares/error.handler');

const signin = async (req, res, next) => {

    const { username, password } = req.body;

    try {
        const [user] = await pool.query(`
        SELECT
        *
        FROM
        admin
        WHERE
        username=?`, [username]);

        const matchPassword = await bcrypt.compare(password, user[0].password);

        if (!matchPassword) {
            return next(errorHandler(401, "Invalid Password"));
        }

        res.status(200).json(user[0]);
    } catch (error) { 
        next(error);
    }
}

const getUser = async (req, res, next) => {

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const [user] = await pool.query(`
    SELECT
    *
    FROM
    pending_order`);

    const resultUsers = user.slice(startIndex, endIndex);

    res.json(resultUsers);


}

module.exports = {
    signin,
    getUser
}