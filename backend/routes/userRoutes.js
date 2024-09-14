const express = require('express');
const { registerUser, loginUser, getUsers, updateUsersStatus } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', authenticateToken, getUsers);
router.post('/users/update', authenticateToken, updateUsersStatus);

module.exports = router;
