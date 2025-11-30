const express = require('express');
const { getUsers, getUserStats, updateUserStatus } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.get('/stats', getUserStats);
router.put('/:id/status', updateUserStatus);

module.exports = router;