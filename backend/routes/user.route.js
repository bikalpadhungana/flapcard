const router = require('express').Router();
const requireAuth = require('../middlewares/require.auth');

// controllers
const { updateUser } = require('../controllers/user.controller');

// middleware for authentication
router.use(requireAuth);

router.route('/update/:id').patch(updateUser);
router.route('/delete/:id').delete();

module.exports = router;