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

        const selectedUrl = userUrl[0].selected_url;

        const loadUrlQuery = `SELECT ${selectedUrl} FROM user_urls WHERE _id=${userId}`;

        const [loadUrl] = await pool.query(loadUrlQuery);
        const urlToBeLoaded = loadUrl[0][selectedUrl];

        const { password, userInfoUrl, urlUsername: userUrlName, ...restUserInfo } = user[0];

        res.status(200).json({ user: restUserInfo, url: urlToBeLoaded, selectedUrl });
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