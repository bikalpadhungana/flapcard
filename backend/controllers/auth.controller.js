const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const errorHandler = require('../middlewares/error.handler');

const createToken = (_id) => {
    const token = jwt.sign({ _id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    return token;
}

const signup = async (req, res, next) => {

    const { username, email, password } = req.body;

    const emailExists = await User.findOne({ email });

    if (emailExists) {
        return next(errorHandler(400, "Email already registered"));
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = new User({
        username,
        email,
        password: hashPass,
    });

    try {
        const user = await newUser.save();

        const { password: userPass, ...restUserInfo } = user._doc;

        if (user) {
            res.status(200).json({ user: restUserInfo });
        }
    } catch (error) {
        next(error);
    }

};

const signin = async (req, res, next) => {
    
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        const matchPassword = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
            return next(errorHandler(401, "Invalid Password"));
        }

        const token = createToken(user._id);
        const { password: userPass, ...restUserInfo } = user._doc;

        res.cookie("access_token", token, { httpOnly: true }).status(200).json({ user: restUserInfo });
            
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
    signout
}