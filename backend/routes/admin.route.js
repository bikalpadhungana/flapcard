const router = require('express').Router();

const { signin, signup, getUser } = require('../controllers/admin.controller');

router.route("/signin").post(signin);
router.route("/signup").post(signup);
router.route("/get-user").get(getUser);

module.exports = router;