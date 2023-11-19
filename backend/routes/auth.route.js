const router = require('express').Router();

// controllers
const { signup, signin, signout } = require('../controllers/auth.controller');

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/signout").get(signout);

module.exports = router;