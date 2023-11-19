const router = require('express').Router();

router.route("/signup").post();
router.route("/signin").post();
router.route("/signout").post();

module.exports = router;