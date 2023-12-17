const router = require('express').Router();

const { placeOrder } = require('../controllers/card.order.controller');

router.route("/placeOrder").post(placeOrder);

module.exports = router;