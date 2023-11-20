const router = require('express').Router();

// controllers
const { signup, signin, google, signout } = require('../controllers/auth.controller');

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/google").post(google);
router.route("/signout").get(signout);

module.exports = router;