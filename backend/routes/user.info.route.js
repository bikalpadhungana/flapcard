const router = require('express').Router();

const { getUserInfo, getUserVCard } = require('../controllers/user.info.controller');

router.route('/:id').get(getUserInfo);
router.route('/vcard/:id').post(getUserVCard);

module.exports = router;