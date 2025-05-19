const pool = require('../utilities/database.connection');
const bcrypt = require('bcrypt');
const errorHandler = require('../middlewares/error.handler');

const updateUser = async (req, res, next) => {

    let { unique_id, username, email, user_photo, user_cover_photo, organization_logo, phone_number_1, phone_number_2, phone_number_3, organization, user_colour, jobtitle, urlUsername, description, user_field, room1, facebook_url, instagram_url, twitter_url, linkedin_url, youtube_url, googlereview_url, tripadvisor_url, website_url, selected_url, tiktok_url, customreview_url, snapchat_url, threads_url, wechat_url, whatsapp, discord_url, dob, gender, address, flap_card, status, line_url, telegram_url, link_url, address_url, github_url, pinterest_url, reddit_url, theme, data,} = req.body;
    let { password } = req.body;
    const validVariables = [];
    const validUrlVariables = [];
    const validPhoneNumberVariables = [];

    // validate user id.
    if (req.user._id != req.params.id) {
        return next(errorHandler(401, "ID invalid!!!"));
    }
    const userId = req.params.id;

    try {
        // check which values the user provided from the client side.
        if (username) {
            validVariables.push("username");
        }
        if (email) {
            validVariables.push("email");
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(req.body.password, salt);

            validVariables.push("password");
        }
        
        if (unique_id || unique_id === "") {
            if (unique_id === "") {
                unique_id = null;
            }
            validVariables.push("unique_id");
        }
        if (status || status === "") {
            if (status === "") {
                status = null;
            }
            validVariables.push("status");
        }
        if (user_photo || user_photo === "") {
            if (user_photo === "") {
                user_photo = null;
            }
            validVariables.push("user_photo");
        }
        if (user_cover_photo || user_cover_photo === "") {
            if (user_cover_photo === "") {
                user_cover_photo = null;
            }
            validVariables.push("user_cover_photo");
        }
        
        if (organization_logo || organization_logo === "") {
            if (organization_logo === "") {
                organization_logo = null;
            }
            validVariables.push("organization_logo");
        }
        if (organization || organization === "") {
            if (organization === "") {
                organization = null;
            }
            validVariables.push("organization");
        }
        if (jobtitle || jobtitle === "") {
            if (jobtitle === "") {
                jobtitle = null;
            }
            validVariables.push("jobtitle");
        }
        if (urlUsername || urlUsername === "") {
            if (urlUsername === "") {
                urlUsername = null;
            }
            validVariables.push("urlUsername");
        }
        if (theme || theme === "") {
            if (theme === "") {
                theme = null;
            }
            validVariables.push("theme");
        }
           if (description || description === "") {
            if (description === "") {
                description = null;
            }
            validVariables.push("description");
        }
        if (user_field || user_field === "") {
            if (user_field === "") {
                user_field = null;
            }
            validVariables.push("user_field");
        }
        if (room1 || room1 === "") {
            if (room1 === "") {
                room1 = null;
            }
            validVariables.push("room1");
        }
        if (dob || dob === "") {
            if (dob === "") {
                dob = null;
            }
            validVariables.push("dob");
        }
        if (gender || gender === "") {
            if (gender === "") {
                gender = null;
            }
            validVariables.push("gender");
        
        
        }
        if (address || address === "") {
            if (address === "") {
                address = null;
            }
            validVariables.push("address");
        }
        
        if (user_colour || user_colour === "") {
            if (user_colour === "") {
                user_colour = null;
            }
            validUrlVariables.push("user_colour");
        }
        if (facebook_url || facebook_url === "") {
            if (facebook_url === "") {
                facebook_url = null;
            }
            validUrlVariables.push("facebook_url");
        }
        if (instagram_url || instagram_url === "") {
            if (instagram_url === "") {
                instagram_url = null;
            }
            validUrlVariables.push("instagram_url");
        }
        if (twitter_url || twitter_url === "") {
            if (twitter_url === "") {
                twitter_url = null;
            }
            validUrlVariables.push("twitter_url");
        }
        if (linkedin_url || linkedin_url === "") {
            if (linkedin_url === "") {
                linkedin_url = null;
            }
            validUrlVariables.push("linkedin_url");
        }
        if (youtube_url || youtube_url === "") {
            if (youtube_url === "") {
                youtube_url = null;
            }
            validUrlVariables.push("youtube_url");
        }
        if (googlereview_url || googlereview_url === "") {
            if (googlereview_url === "") {
                googlereview_url = null;
            }
            validUrlVariables.push("googlereview_url");
        }
        if (tripadvisor_url || tripadvisor_url === "") {
            if (tripadvisor_url === "") {
                tripadvisor_url = null;
            }
            validUrlVariables.push("tripadvisor_url");
        }
        if (website_url || website_url === "") {
            if (website_url === "") {
                website_url = null;
            }
            validUrlVariables.push("website_url");
        }
        if (selected_url || selected_url === "") {
            if (selected_url === "") {
                selected_url = null;
            }
            validUrlVariables.push("selected_url");
        }
        if (tiktok_url || tiktok_url === "") {
            if (tiktok_url === "") {
                tiktok_url = null;
            }
            validUrlVariables.push("tiktok_url");
        }
        if (customreview_url || customreview_url === "") {
            if (customreview_url === "") {
                customreview_url = null;
            }
            validUrlVariables.push("customreview_url");
        }
        if (snapchat_url || snapchat_url === "") {
            if (snapchat_url === "") {
                snapchat_url = null;
            }
            validUrlVariables.push("snapchat_url");
        }
        if (threads_url || threads_url === "") {
            if (threads_url === "") {
                threads_url = null;
            }
            validUrlVariables.push("threads_url");
        }
        if (wechat_url || wechat_url === "") {
            if (wechat_url === "") {
                wechat_url = null;
            }
            validUrlVariables.push("wechat_url");
        }
        if (whatsapp || whatsapp === "") {
            if (whatsapp === "") {
                whatsapp = null;
            }
            validUrlVariables.push("whatsapp");
        }
        if (discord_url || discord_url === "") {
            if (discord_url === "") {
                discord_url = null;
            }
            validUrlVariables.push("discord_url");
        }
        if (line_url || line_url === "") {
            if (line_url === "") {
                line_url = null;
            }
            validUrlVariables.push("line_url");
        }
        
        if (flap_card || flap_card === "") {
            if (flap_card === "") {
                flap_card = null;
            }
            validUrlVariables.push("flap_card");
        }
        if (telegram_url || telegram_url === "") {
            if (telegram_url === "") {
                telegram_url = null;
            }
            validUrlVariables.push("telegram_url");
        }
        if (address_url || address_url === "") {
            if (address_url === "") {
                address_url = null;
            }
            validUrlVariables.push("address_url");
        }
        if (link_url || link_url === "") {
            if (link_url === "") {
                link_url = null;
            }
            validUrlVariables.push("link_url");
        }
        if (github_url || github_url === "") {
            if (github_url === "") {
                github_url = null;
            }
            validUrlVariables.push("github_url");
        }
        if (reddit_url || reddit_url === "") {
            if (reddit_url === "") {
                reddit_url = null;
            }
            validUrlVariables.push("reddit_url");
        }
        if (pinterest_url || pinterest_url === "") {
            if (pinterest_url === "") {
                pinterest_url = null;
            }
            validUrlVariables.push("pinterest_url");
        }
        if (data || data === "") {
            if (data === "") {
                data = null;
            }
            validUrlVariables.push("data");
        }


        if (phone_number_1 || phone_number_1 === "") {
            if (phone_number_1 === "") {
                phone_number_1 = null;
            }
            validPhoneNumberVariables.push("phone_number_1");
        }
        if (phone_number_2 || phone_number_2 === "") {
            if (phone_number_2 === "") {
                phone_number_2 = null;
            }
            validPhoneNumberVariables.push("phone_number_2");
        }
        if (phone_number_3 || phone_number_3 === "") {
            if (phone_number_3 === "") {
                phone_number_3 = null;
            }
            validPhoneNumberVariables.push("phone_number_3");
        }

        // update the user table with the records the user provided.
        for (i = 0; i < validVariables.length; i++) {
            await pool.query(`
            UPDATE
            user
            SET
            ${validVariables[i]}=?
            WHERE
            _id=?`, [eval(validVariables[i]), userId]);
        }

        // update user urls if the user had provided the urls.
        for (i = 0; i < validUrlVariables.length; i++) {
            await pool.query(`
            UPDATE
            user_urls
            SET
            ${validUrlVariables[i]}=?
            WHERE
            _id=?`, [eval(validUrlVariables[i]), userId]);
        }

        for (i = 0; i < validPhoneNumberVariables.length; i++) {
            await pool.query(`
            UPDATE
            user_phone_numbers
            SET
            ${validPhoneNumberVariables[i]}=?
            WHERE
            user_id=?`, [eval(validPhoneNumberVariables[i]), userId]);
        }

        // retrieve the updated information
        const [user] = await pool.query(`
        SELECT *
        FROM
        user
        WHERE
        _id=?`, [userId]);

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

        // convert json to array.
        const userUrlsArr = Object.entries(user_urls[0]);
        const userPhoneNumberArr = Object.entries(user_phone_numbers[0]);

        // populate the user socials urls.
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

        // #token availability checked in frontend 
        const newToken = req.token;

        res.status(200).json({ restUserInfo, newToken });

    } catch (error) {
        next(error);
    }
}

const deleteUser = async (req, res, next) => {
    if (req.user._id != req.params.id) {
        return next(errorHandler(401, 'ID invalid'));
    }

    try {
        await pool.query(`
        DELETE
        FROM
        user
        WHERE
        _id=?`, [req.params.id]);

        res.clearCookie('access_token');
        res.status(200).json({message: "User deleted"});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateUser,
    deleteUser
}
