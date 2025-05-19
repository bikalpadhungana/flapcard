const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');

router.use(fileUpload());

let messages = [];
let signals = [];

router.get('/', (req, res) => {
  const { outgoing_id, incoming_id } = req.query;
  const userMessages = messages.filter(
    (msg) =>
      (msg.outgoing_msg_id === outgoing_id && msg.incoming_msg_id === incoming_id) ||
      (msg.outgoing_msg_id === incoming_id && msg.incoming_msg_id === outgoing_id)
  );
  res.json({ messages: userMessages });
});

router.post('/', (req, res) => {
  const { outgoing_msg_id, incoming_msg_id, msg, type } = req.body;
  const message = {
    outgoing_msg_id,
    incoming_msg_id,
    msg,
    type,
    created_at: new Date().toISOString(),
    status: 'sent',
  };
  messages.push(message);
  res.status(200).json({ success: true });
});

router.post('/media', (req, res) => {
  const { outgoing_msg_id, incoming_msg_id, type } = req.body;
  const file = req.files.file;
  const url = `/uploads/${file.name}`;
  file.mv(`./public${url}`, (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    const message = {
      outgoing_msg_id,
      incoming_msg_id,
      msg: url,
      type,
      created_at: new Date().toISOString(),
      status: 'sent',
    };
    messages.push(message);
    res.json({ url });
  });
});

router.post('/signal', (req, res) => {
  const { outgoing_msg_id, incoming_msg_id, signal } = req.body;
  signals.push({ outgoing_msg_id, incoming_msg_id, signal, created_at: new Date().toISOString() });
  res.status(200).json({ success: true });
});

router.get('/signals', (req, res) => {
  const { outgoing_id, incoming_id } = req.query;
  const userSignals = signals.filter(
    (sig) => sig.outgoing_msg_id === outgoing_id && sig.incoming_msg_id === incoming_id
  );
  res.json(userSignals);
});

router.get('/message', (req, res) => {
  const { page = 1 } = req.query;
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  const uniqueUsers = [...new Set(messages.map(m => m.incoming_msg_id === 'user1-id' ? m.outgoing_msg_id : m.incoming_msg_id))];
  const users = uniqueUsers.slice(start, end).map(id => ({
    unique_id: id,
    username: `User_${id}`,
    user_photo: '/default-avatar.jpg',
    status: 'offline'
  }));
  
  res.json({
    users: users || [], // Ensure users is always an array
    pagination: { hasMore: uniqueUsers.length > end }
  });
});

module.exports = router;