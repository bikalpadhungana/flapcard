const pool = require('../utilities/database.connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const errorHandler = require('../middlewares/error.handler');

const createToken = (_id) => {
    const token = jwt.sign({ _id }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });

    return token;
}

const createRefreshToken = (_id) => {
    const refreshToken = jwt.sign({ _id }, process.env.REFRESH_SECRET_KEY);
    
    return refreshToken;
}

const signup = async (req, res, next) => {

    const { username, email, password } = req.body;

    const [emailExists] = await pool.query(`SELECT * FROM user WHERE email=?`, [email]);

    if (emailExists.length !== 0) {
        return next(errorHandler(400, "Email already registered"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    try {
        const [result] = await pool.query(`
        INSERT INTO
        user(username, email, password)
        VALUES(?, ?, ?)`, [username, email, hashedPass]);

        const resultId = result.insertId;
        const [user] = await pool.query(`SELECT * FROM user WHERE _id=?`, [resultId]);

        const tokenId = jwt.sign({ _id: user[0]._id }, process.env.JWT_SECRET_KEY);
        const userInfoUrl = `https://flap.esainnovation.com/user-info/${tokenId}`;

        await pool.query(`
        UPDATE
        user
        SET
        userInfoUrl=?
        WHERE
        _id=?`, [userInfoUrl, user[0]._id]);

        const { password: userPass, userInfoUrl: infoUrl, ...restUserInfo } = user[0];

        if (user[0]) {
            res.status(200).json(restUserInfo);
        }
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

        const token = createToken(user[0]._id);
        const refreshToken = createRefreshToken(user[0]._id);
        await pool.query(`
        INSERT
        INTO
        user_token_list
        (_id, refresh_token)
        VALUES
        (?, ?)`, [user[0]._id, refreshToken]);

        const { password: userPass, userInfoUrl, ...restUserInfo } = user[0];

        res.status(200).json({ restUserInfo, token, refreshToken });
            
    } catch (error) {
        next(error);
    }
}

const google = async (req, res, next) => {

    const { username, email, userPhoto } = req.body;

    try {
        const [user] = await pool.query(`SELECT * FROM user WHERE email=?`, [email]);

        if (user.length !== 0) {
            const token = createToken(user[0]._id);
            const refreshToken = createRefreshToken(user[0]._id);
            await pool.query(`
            INSERT
            INTO
            user_token_list
            (_id, refresh_token)
            VALUES
            (?, ?)`, [user[0]._id, refreshToken]);

            const { password, userInfoUrl, ...restUserInfo } = user[0];

            res.status(200).json({ restUserInfo, token, refreshToken });
        } else {
            const userGeneratePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(userGeneratePassword, salt);

            const [result] = await pool.query(`
            INSERT INTO
            user(username, email, password, user_photo)
            VALUES(?, ?, ?, ?)`, [username, email, hashedPass, userPhoto]);

            const resultId = result.insertId;
            const [user] = await pool.query(`SELECT * FROM user WHERE _id=?`, [resultId]);

            const tokenId = jwt.sign({ _id: user[0]._id }, process.env.JWT_SECRET_KEY);
            const userInfoUrl = `https://flap.esainnovation.com/user-info/${tokenId}`;

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

            const { password, userInfoUrl: infoUrl, ...restUserInfo } = user[0];
            
            res.status(200).json({ restUserInfo, token, refreshToken });
        }
    } catch (error) {
        next(error);
    }
}

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
}

module.exports = {
    signup,
    signin,
    google,
    signout
}