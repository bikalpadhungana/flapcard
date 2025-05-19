const router = require('express').Router();

const { getUserInfo, getUserVCard, exchangeContact, getExchangedContact, getUserByUniqueId } = require('../controllers/user.info.controller');

router.route('/:id').get(getUserInfo);
router.route('/vcard/:id').post(getUserVCard);
router.route('/exchangeContact/:id').post(exchangeContact);
router.route('/get/exchangeContact/:id').get(getExchangedContact);
router.get('/unique/:unique_id', getUserByUniqueId); // New unique_id endpoint
module.exports = router;