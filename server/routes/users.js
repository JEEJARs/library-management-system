const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { getTotalUsers } = require('../controllers/userController');

const router = express.Router();

router.get('/total', authMiddleware, adminMiddleware, getTotalUsers);

module.exports = router;
