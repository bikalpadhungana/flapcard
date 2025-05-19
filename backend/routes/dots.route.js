// backend/routes/dots.route.js
const express = require('express');
const router = express.Router();
const dotsController = require('../controllers/dots.controller');

router.post('/dots', dotsController.addDot);
router.get('/dots', dotsController.getDots);

module.exports = router;