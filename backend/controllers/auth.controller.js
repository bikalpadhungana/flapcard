const pool = require('../utilities/database.connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const errorHandler = require('../middlewares/error.handler');
const createUserQr = require('../utilities/create.user.qr');

// create access token
const createToken = (_id) => {
    const token = jwt.sign({ _id }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });

    return token;
}

// create refresh token
const createRefreshToken = (_id) => {
    const refreshToken = jwt.sign({ _id }, process.env.REFRESH_SECRET_KEY);
    
    return refreshToken;
}

const signup = async (req, res, next) => {

    const { username, email, password } = req.body;

    // check if email is registered
    const [emailExists] = await pool.query(`SELECT * FROM user WHERE email=?`, [email]);

    if (emailExists.length !== 0) {
        return next(errorHandler(400, "Email already registered"));
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    try {
        // sign up the user
        const [result] = await pool.query(`
        INSERT INTO
        user(username, email, password)
        VALUES(?, ?, ?)`, [username, email, hashedPass]);

        // beautify username for url
        const usernameSplit = username.split(" ");
        let urlUsername = "";
        if (usernameSplit.length > 1) {
            urlUsername = usernameSplit.join("");
        } else {
            urlUsername = username;
        }

        // create user qr-code
        const userQrSvg = await createUserQr(urlUsername);

        const resultId = result.insertId;
        const [user] = await pool.query(`SELECT * FROM user WHERE _id=?`, [resultId]);

        await pool.query(`
        INSERT
        INTO
        user_qr_code
        VALUES(?, ?)`, [user[0]._id, userQrSvg]);
        
        // set user url.
        await pool.query(`
        UPDATE
        user
        SET
        urlUsername=?
        WHERE
        _id=?`, [urlUsername, user[0]._id]);

        const userInfoUrl = `https://flap.esainnovation.com/user-info/${urlUsername}`;

        await pool.query(`
        UPDATE
        user
        SET
        userInfoUrl=?
        WHERE
        _id=?`, [userInfoUrl, user[0]._id]);

        await pool.query(`
        INSERT
        INTO
        user_phone_numbers
        (user_id)
        VALUES
        (?)`, [user[0]._id]);

        // create tokens
        const token = createToken(user[0]._id);
        const refreshToken = createRefreshToken(user[0]._id);
        await pool.query(`
        INSERT
        INTO
        user_token_list
        (_id, refresh_token)
        VALUES
        (?, ?)`, [user[0]._id, refreshToken]);

        // populate the user url table.
        await pool.query(`
        INSERT
        INTO
        user_urls
        (_id, default_url)
        VALUES
        (?, ?)`, [user[0]._id, userInfoUrl]);

        const { password: userPass, userInfoUrl: infoUrl, urlUsername: userUrlName, ...restUserInfo } = user[0];

        res.status(200).json({ restUserInfo, token, refreshToken });
    } catch (error) {
        next(error);
    }

};

const signin = async (req, res, next) => {
    
    const { email, password } = req.body;

    try {
        const [user] = await pool.query(`SELECT * FROM user WHERE email=?`, [email]);

        if (user.length === 0) {
            return next(errorHandler(404, "User not found"));
        }

        const matchPassword = await bcrypt.compare(password, user[0].password);

        if (!matchPassword) {
            return next(errorHandler(401, "Invalid Password"));
        }

        const userId = user[0]._id;

        const token = createToken(userId);
        const refreshToken = createRefreshToken(userId);
        await pool.query(`
        INSERT
        INTO
        user_token_list
        (_id, refresh_token)
        VALUES
        (?, ?)`, [userId, refreshToken]);

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
            if (key === "_id") {
                continue;
            }
            if (value !== null) {
                restUserInfo[key] = value;
            }
        }

        res.status(200).json({ restUserInfo, token, refreshToken });
            
    } catch (error) {
        next(error);
    }
};

const google = async (req, res, next) => {

    const { username, email, userPhoto } = req.body;

    try {
        const [user] = await pool.query(`SELECT * FROM user WHERE email=?`, [email]);

        if (user.length !== 0) {
            const userId = user[0]._id;

            const token = createToken(userId);
            const refreshToken = createRefreshToken(userId);
            await pool.query(`
            INSERT
            INTO
            user_token_list
            (_id, refresh_token)
            VALUES
            (?, ?)`, [userId, refreshToken]);

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

            const { password, userInfoUrl, ...restUserInfo } = user[0];

            const userUrlsArr = Object.entries(user_urls[0]);
            const userPhoneNumberArr = Object.entries(user_phone_numbers[0]);

            for ([key, value] of userUrlsArr) {
                if (value !== null) {
                    restUserInfo[key] = value;
                }
            }

            for ([key, value] of userPhoneNumberArr) {
                if (key === "_id") {
                    continue;
                }
                if (value !== null) {
                    restUserInfo[key] = value;
                }
            }

            res.status(200).json({ restUserInfo, token, refreshToken });
        } else {
            const userGeneratePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(userGeneratePassword, salt);

            const [result] = await pool.query(`
            INSERT INTO
            user(username, email, password, user_photo)
            VALUES(?, ?, ?, ?)`, [username, email, hashedPass, userPhoto]);

            const usernameSplit = username.split(" ");
            let urlUsername = "";
            if (usernameSplit.length > 1) {
                urlUsername = usernameSplit.join("");
            } else {
                urlUsername = username;
            }

            // create user qr-code
            const userQrSvg = await createUserQr(urlUsername);

            const resultId = result.insertId;
            const [user] = await pool.query(`SELECT * FROM user WHERE _id=?`, [resultId]);

            await pool.query(`
            INSERT
            INTO
            user_qr_code
            VALUES(?, ?)`, [user[0]._id, userQrSvg]);

            await pool.query(`
            UPDATE
            user
            SET
            urlUsername=?
            WHERE
            _id=?`, [urlUsername, user[0]._id]);

            const userInfoUrl = `https://flap.esainnovation.com/user-info/${urlUsername}`;

            await pool.query(`
            UPDATE
            user
            SET
            userInfoUrl=?
            WHERE
            _id=?`, [userInfoUrl, user[0]._id]);

            const token = createToken(user[0]._id);
            const refreshToken = createRefreshToken(user[0]._id);
            await pool.query(`
            INSERT
            INTO
            user_token_list
            (_id, refresh_token)
            VALUES
            (?, ?)`, [user[0]._id, refreshToken]);

            // populate the user url table.
            await pool.query(`
            INSERT
            INTO
            user_urls
            (_id, default_url)
            VALUES
            (?, ?)`, [user[0]._id, userInfoUrl]);

            const { password, userInfoUrl: infoUrl, urlUsername: userUrlName, ...restUserInfo } = user[0];

            // const [user_urls] = await pool.query(`
            // SELECT *
            // FROM
            // user_urls
            // WHERE
            // _id=?`, [user[0]._id]);

            // const userUrlsArr = Object.entries(user_urls[0]);

            // for ([key, value] of userUrlsArr) {
            //     if (value !== null) {
            //         restUserInfo[key] = value;
            //     }
            // }
            
            res.status(200).json({ restUserInfo, token, refreshToken });
        }
    } catch (error) {
        next(error);
    }
};

const signout = async (req, res, next) => {

    const { _id } = req.body;

    try {
        await pool.query(`
        DELETE
        FROM
        user_token_list
        WHERE
        _id=?`, [_id]);

        res.status(200).json({ message: "User signed out" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup,
    signin,
    google,
    signout
};