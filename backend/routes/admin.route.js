const router = require('express').Router();

const { signin, getUser } = require('../controllers/admin.controller');

router.route("/signin").post(signin);
router.route("/get-user").get(getUser);

module.exports = router;