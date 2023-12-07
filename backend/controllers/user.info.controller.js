const pool = require('../utilities/database.connection');
const jwt = require('jsonwebtoken');
const errorHandler = require('../middlewares/error.handler');
const vCardsJS = require('vcards-js');
const fs = require('fs');

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
        vCard.phone_number = phone_number;
        vCard.organization = organization;
        
        const imageBase64 = Buffer.from(user_photo).toString('base64');
    
        vCard.photo.embedFromString(imageBase64, 'image/jpeg');
    
        // read the vcf card format details and send to client
        vCard.saveToFile('./test.txt');
        const vCardReadContent = fs.readFileSync("./test.txt", "utf-8");
        console.log(vCardReadContent);

        res.status(200).json(vCardReadContent);
    } catch (error) {
        next(error);
    }
    
}

module.exports = {
    getUserInfo,
    getUserVCard
}