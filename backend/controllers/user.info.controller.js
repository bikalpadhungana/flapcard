const pool = require('../utilities/database.connection');
const errorHandler = require('../middlewares/error.handler');
const vCardsJS = require('vcards-js');

const getUserInfo = async (req, res, next) => {
    let { id: urlUsername } = req.params;
    
    try {
        const [user] = await pool.query(`
        SELECT
        *
        FROM
        user
        WHERE
        urlUsername=?`, [urlUsername]);

        if (user.length === 0) {
            return next(errorHandler(404, "User Not Found"));
        }

        const userId = user[0]._id;

        const [userUrl] = await pool.query(`
        SELECT
        *
        FROM
        user_urls
        WHERE
        _id=(?)`, [userId]);

        const [userPhoneNumbers] = await pool.query(`
        SELECT
        *
        FROM
        user_phone_numbers
        WHERE
        user_id=(?)`, [userId]);

        const { password, userInfoUrl, urlUsername: userUrlName, ...restUserInfo } = user[0];

        const userUrlsArr = Object.entries(userUrl[0]);
        const userPhoneNumberArr = Object.entries(userPhoneNumbers[0]);

        for ([key, value] of userUrlsArr) {
            if (key === "_id") {
                continue;
            }
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

        res.status(200).json({ user: restUserInfo });
    } catch (error) {
        next(error);
    }
};

const getUserVCard = async (req, res, next) => {

    const { username, email, phone_number_1, phone_number_2, organization, user_photo } = req.body;

    try {
        let vCard = vCardsJS();
    
        vCard.firstName = username.split(" ")[0];
        vCard.lastName = username.split(" ")[1];
        vCard.email = email;
        vCard.cellPhone = phone_number_1;
        vCard.pagerPhone = phone_number_2;
        vCard.organization = organization;
        vCard.photo.attachFromUrl(user_photo, 'png');

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