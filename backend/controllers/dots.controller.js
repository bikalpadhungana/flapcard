// backend/controllers/dots.controller.js
const dots = []; // In-memory store; replace with a database (e.g., MongoDB) for persistence

exports.addDot = async (req, res) => {
  try {
    const { x, y } = req.body;
    if (typeof x !== 'number' || typeof y !== 'number' || x < 0 || x > 100 || y < 0 || y > 100) {
      return res.status(400).json({ success: false, message: 'Invalid coordinates' });
    }
    dots.push({ x, y, timestamp: new Date() });
    res.json({ success: true, message: 'Dot added' });
  } catch (error) {
    console.error('Error adding dot:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getDots = async (req, res) => {
  try {
    res.json({ success: true, dots });
  } catch (error) {
    console.error('Error fetching dots:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};