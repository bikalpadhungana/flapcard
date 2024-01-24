const pool = require('../utilities/database.connection');
const bcrypt = require('bcrypt');
const errorHandler = require('../middlewares/error.handler');

const updateUser = async (req, res, next) => {

    const { username, email, user_photo, user_cover_photo, phone_number_1, phone_number_2, organization, facebook_url, instagram_url, twitter_url, linkedin_url, youtube_url} = req.body;
    let { password } = req.body;
    const validVariables = [];
    const validUrlVariables = [];
    const validPhoneNumberVariables = [];

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
        if (user_cover_photo) {
            validVariables.push("user_cover_photo");
        }
        if (organization) {
            validVariables.push("organization");
        }

        if (facebook_url) {
            validUrlVariables.push("facebook_url");
        }
        if (instagram_url) {
            validUrlVariables.push("instagram_url");
        }
        if (twitter_url) {
            validUrlVariables.push("twitter_url");
        }
        if (linkedin_url) {
            validUrlVariables.push("linkedin_url");
        }
        if (youtube_url) {
            validUrlVariables.push("youtube_url");
        }

        if (phone_number_1) {
            validPhoneNumberVariables.push("phone_number_1");
        }
        if (phone_number_2) {
            validPhoneNumberVariables.push("phone_number_2");
        }

        for (i = 0; i < validVariables.length; i++) {
            await pool.query(`
            UPDATE
            user
            SET
            ${validVariables[i]}=?
            WHERE
            _id=?`, [eval(validVariables[i]), userId]);
        }

        for (i = 0; i < validUrlVariables.length; i++) {
            await pool.query(`
            UPDATE
            user_urls
            SET
            ${validUrlVariables[i]}=?
            WHERE
            _id=?`, [eval(validUrlVariables[i]), userId]);
        }

        for (i = 0; i < validPhoneNumberVariables.length; i++) {
            await pool.query(`
            UPDATE
            user_phone_numbers
            SET
            ${validPhoneNumberVariables[i]}=?
            WHERE
            user_id=?`, [eval(validPhoneNumberVariables[i]), userId]);
        }

        const [user] = await pool.query(`
        SELECT *
        FROM
        user
        WHERE
        _id=?`, [userId]);

        const [user_urls] = await pool.query(`
        SELECT *
        FROM
        user_urls
        WHERE
        _id=?`, [userId]);

        const [user_phone_numbers] = await pool.query(`
        SELECT
        *
        FROM
        user_phone_numbers
        WHERE
        user_id=?`, [userId]);

        const { password: userPass, userInfoUrl, ...restUserInfo } = user[0];

        const userUrlsArr = Object.entries(user_urls[0]);
        const userPhoneNumberArr = Object.entries(user_phone_numbers[0]);

        for ([key, value] of userUrlsArr) {
            if (value !== null) {
                restUserInfo[key] = value;
            }
        }

        for ([key, value] of userPhoneNumberArr) {
            if (value !== null) {
                restUserInfo[key] = value;
            }
        }

        // #token availability checked in frontend 
        const newToken = req.token;

        res.status(200).json({ restUserInfo, newToken });

    } catch (error) {
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    if (req.user._id != req.params.id) {
        return next(errorHandler(401, 'ID invalid'));
    }

    try {
        await pool.query(`
        DELETE
        FROM
        user
        WHERE
        _id=?`, [req.params.id]);

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