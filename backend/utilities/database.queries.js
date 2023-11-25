const pool = require('./database.connection');

const getSingleUser = async (id) => {
    const [user] = await pool.query(`SELECT * FROM user WHERE id=?`, [id]);

    return user;
}

module.exports = {
    getSingleUser
}