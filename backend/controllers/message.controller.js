// controllers/message.controller.js
const pool = require('../utilities/database.connection');
const errorHandler = require('../middlewares/error.handler');

const getMessages = async (req, res, next) => {
    try {
        const { outgoing_id, incoming_id } = req.query;
        
        const [messages] = await pool.query(`
            SELECT messages.*, users.user_photo AS img 
            FROM messages 
            LEFT JOIN users ON users.unique_id = messages.outgoing_msg_id
            WHERE (outgoing_msg_id = ? AND incoming_msg_id = ?)
            OR (outgoing_msg_id = ? AND incoming_msg_id = ?)
            ORDER BY msg_id ASC
        `, [outgoing_id, incoming_id, incoming_id, outgoing_id]);

        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};

const sendMessage = async (req, res, next) => {
    try {
        const { outgoing_msg_id, incoming_msg_id, msg } = req.body;
        
        if (!outgoing_msg_id || !incoming_msg_id || !msg) {
            return next(errorHandler(400, "All fields are required"));
        }

        const [result] = await pool.query(`
            INSERT INTO messages 
            (outgoing_msg_id, incoming_msg_id, msg)
            VALUES (?, ?, ?)
        `, [outgoing_msg_id, incoming_msg_id, msg]);

        res.status(201).json({
            msg_id: result.insertId,
            outgoing_msg_id,
            incoming_msg_id,
            msg,
            created_at: new Date()
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMessages,
    sendMessage
};