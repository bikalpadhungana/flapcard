const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const errorHandler = require('../middlewares/error.handler');

const updateUser = async (req, res, next) => {

    const { username, email, password, user_photo } = req.body;

    if (req.user._id !== req.params.id) {
        return next(errorHandler(401, "ID invalid!!!"));
    }

    try {
        if (password) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username,
                email,
                password,
                user_photo
            }
        }, { new: true });

        const { password: userPass, ...restUserInfo } = updatedUser._doc;

        res.status(200).json({ user: restUserInfo });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    updateUser
}