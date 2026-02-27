const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const {
  borrowBooks,
  returnRequest,
  confirmReturn,
  getPendingReturns,
  getUserHistory,
  getAdminHistory,
  getDashboardStats
} = require('../controllers/borrowController');

const router = express.Router();

router.post('/borrow', authMiddleware, borrowBooks);
router.post('/return-request', authMiddleware, returnRequest);
router.get('/history/:student_id', authMiddleware, getUserHistory);

router.get('/pending-returns', authMiddleware, adminMiddleware, getPendingReturns);
router.post('/confirm-return', authMiddleware, adminMiddleware, confirmReturn);
router.get('/admin-history', authMiddleware, adminMiddleware, getAdminHistory);
router.get('/dashboard-stats', authMiddleware, adminMiddleware, getDashboardStats);

module.exports = router;
