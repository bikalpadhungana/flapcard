const User = require('../models/user.model');
const pool = require('../utilities/database.connection');
const bcrypt = require('bcrypt');
const errorHandler = require('../middlewares/error.handler');

const updateUser = async (req, res, next) => {

    const { username, email, user_photo } = req.body;
    let { password } = req.body;
    const validVariables = [];

    if (req.user._id != req.params.id) {
        return next(errorHandler(401, "ID invalid!!!"));
    }
    const userId = req.params.id;

    try {
        if (username) {
            validVariables.push("username");
        }
        if (email) {
            validVariables.push("email");
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(req.body.password, salt);

            validVariables.push("password");
        }
        if (user_photo) {
            validVariables.push("user_photo");
        }

        for (i = 0; i < validVariables.length; i++) {
            await pool.query(`
            UPDATE
            user
            SET
            ${validVariables[i]}=?
            WHERE
            id=?`, [eval(validVariables[i]), userId]);
        }

        const [user] = await pool.query(`
        SELECT *
        FROM
        user
        WHERE
        id=?`, [userId]);

        const { password: userPass, ...restUserInfo } = user[0];

        res.status(200).json( restUserInfo );

    } catch (error) {
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    if (req.user._id != req.params.id) {
        return next(errorHandler(401, 'ID invalid'));
    }

    try {
        // await User.findByIdAndDelete(req.params.id);
        await pool.query(`
        DELETE
        FROM
        user
        WHERE
        id=?`, [req.params.id]);

        res.clearCookie('access_token');
        res.status(200).json({message: "User deleted"});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateUser,
    deleteUser
}