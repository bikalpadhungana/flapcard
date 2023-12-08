const pool = require('../utilities/database.connection');
const jwt = require('jsonwebtoken');
const errorHandler = require('../middlewares/error.handler');
const vCardsJS = require('vcards-js');

const getUserInfo = async (req, res, next) => {
    let { id } = req.params;
    
    jwt.verify(id, process.env.JWT_SECRET_KEY, (err, userId) => {
        if (err) {
            return next(errorHandler(400, "Id is not valid"));
        }

        id = userId._id;
    })
    
    try {
        const [user] = await pool.query(`
        SELECT
        *
        FROM
        user
        WHERE
        _id=?`, [id]);

        if (user.length === 0) {
            return next(errorHandler(404, 'User not found'));
        }

        const { password, userInfoUrl, ...restUserInfo } = user[0];

        res.status(200).json(restUserInfo);
    } catch (error) {
        next(error);
    }
};

const getUserVCard = async (req, res, next) => {

    const { username, email, phone_number, organization, user_photo } = req.body;

    try {
        let vCard = vCardsJS();
    
        vCard.firstName = username.split(" ")[0];
        vCard.lastName = username.split(" ")[1];
        vCard.email = email;
        vCard.cellPhone = phone_number;
        vCard.organization = organization;
        vCard.photo.attachFromUrl(user_photo, 'JPEG');
        
        const vCardInfoString = vCard.getFormattedString();

        res.status(200).json(vCardInfoString);
    } catch (error) {
        next(error);
    }
    
}

module.exports = {
    getUserInfo,
    getUserVCard
}