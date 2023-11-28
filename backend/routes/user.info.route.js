const router = require('express').Router();

const { getUserInfo } = require('../controllers/user.info.controller');

router.route('/:id').get(getUserInfo);

module.exports = router;