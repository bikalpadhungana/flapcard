const router = require('express').Router();
const requireAuth = require('../middlewares/require.auth');

// controllers
const { updateUser, deleteUser, test, test2 } = require('../controllers/user.controller');

// middleware for authentication
router.use(requireAuth);

router.route('/update/:id').patch(updateUser);
router.route('/delete/:id').delete(deleteUser);
router.route('/test').get(test);
router.route('/test2').post(test2);

module.exports = router;