const router = require('express').Router();

const { getRefreshToken } = require('../controllers/refreshToken.controller');

router.route("/:token").get(getRefreshToken);

module.exports = router;