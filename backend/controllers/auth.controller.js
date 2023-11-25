const pool = require('../utilities/database.connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const errorHandler = require('../middlewares/error.handler');

const createToken = (_id) => {
    const token = jwt.sign({ _id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    return token;
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

        const { password: userPass, ...restUserInfo } = user[0];

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
        const { password: userPass, ...restUserInfo } = user[0];

        res.status(200).json({ restUserInfo, token });
            
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
            const { password, ...restUserInfo } = user[0];

            res.status(200).json({ restUserInfo, token });
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

            const token = createToken(user[0]._id);
            const { password, ...restUserInfo } = user[0];
            
            res.status(200).json({ restUserInfo, token });
        }
    } catch (error) {
        next(error);
    }
}

const signout = (req, res, next) => {
    try {
        res.clearCookie('access_token');
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