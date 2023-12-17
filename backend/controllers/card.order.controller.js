const pool = require('../utilities/database.connection');
const errorHandler = require('../middlewares/error.handler');

const placeOrder = async (req, res, next) => {
    const { _id, username, email, phone_number, organization, color } = req.body;
    const validVariables = [];

    try {
        if (username) {
            validVariables.push("username");
        }
        if (email) {
            validVariables.push("email");
        }
        if (phone_number) {
            validVariables.push("phone_number");
        }
        if (organization) {
            validVariables.push("organization");
        }

        await pool.query(`
        INSERT
        INTO
        pending_order
        (_id, color)
        VALUES
        (?, ?)`, [_id, color]);

        for (i = 0; i < validVariables.length; i++) {
            await pool.query(`
            UPDATE
            pending_order
            SET
            ${validVariables[i]}=?
            WHERE
            _id=?`, [eval(validVariables[i]), _id]);
        }

        const [order] = await pool.query(`
        SELECT
        *
        FROM
        pending_order
        WHERE
        _id=?`, [_id]);

        if (order.length === 0) {
            return next(errorHandler(500, "Error placing order"));
        }

        res.status(200).json({ message: "Order placed successfully" });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    placeOrder
}