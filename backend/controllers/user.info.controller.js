const pool = require('../utilities/database.connection');
const errorHandler = require('../middlewares/error.handler');
const vCardsJS = require('vcards-js');

const getUserInfo = async (req, res, next) => {
    // get user name from the url.
    let { id: urlUsername } = req.params;
    
    try {
        // check if the user exists
        const [user] = await pool.query(`
        SELECT
        *
        FROM
        user
        WHERE
        urlUsername=?`, [urlUsername]);

        // user does not exist
        if (user.length === 0) {
            return next(errorHandler(404, "User Not Found"));
        }

        const userId = user[0]._id;

        // get user socials urls.
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


        // destructure to get only the required information
        const { password, userInfoUrl, urlUsername: userUrlName, ...restUserInfo } = user[0];

        // convert json to array.
        const userUrlsArr = Object.entries(userUrl[0]);
        const userPhoneNumberArr = Object.entries(userPhoneNumbers[0]);

        // populate the user urls
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
    
        // fill the information for the vCard
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

const exchangeContact = async (req, res, next) => {
    const { id } = req.params;
    const { name, email, contact_number, photo } = req.body;

    try {
        await pool.query(`
            INSERT
            INTO
            exchange_contact(user_id, name, email, contact_number, photo)
            VALUES
            (?, ?, ?, ?, ?)
            `, [id, name, email, contact_number, photo]);

        res.status(200).json({ message: "Contact exchanged successfully." });
    } catch (error) {
        return next(error);
    }
};

const getExchangedContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    const [response] = await pool.query(`
        SELECT
        *
        FROM
        exchange_contact
        WHERE
        user_id=?
      `, [id]);

    if (response.length === 0) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).send(response);
  } catch (error) {
    return next(error);
  }
};

// Add to user.info.controller.js
const getUserByUniqueId = async (req, res, next) => {
    const { unique_id } = req.params;

    try {
        // Validate input format
        if (!Number.isInteger(Number(unique_id))) {
            return next(errorHandler(400, "Invalid user ID format"));
        }

        const [user] = await pool.query(`
            SELECT 
                _id,
                unique_id,
                username,
                user_photo,
                email,
                status
            FROM users
            WHERE unique_id = ?
        `, [unique_id]);

        if (user.length === 0) {
            return next(errorHandler(404, "User not found"));
        }

        res.status(200).json(user[0]);
    } catch (error) {
        console.error("Database error:", error);
        next(errorHandler(500, "Database query error"));
    }
};

module.exports = {
  getUserInfo,
  getUserVCard,
  exchangeContact,
  getExchangedContact,
  getUserByUniqueId,
}