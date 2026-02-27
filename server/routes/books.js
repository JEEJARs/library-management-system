const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  getTopBorrowedBooks
} = require('../controllers/bookController');

const router = express.Router();

router.get('/', getAllBooks);
router.get('/top-borrowed', authMiddleware, adminMiddleware, getTopBorrowedBooks);
router.post('/', authMiddleware, adminMiddleware, createBook);
router.put('/:id', authMiddleware, adminMiddleware, updateBook);
router.delete('/:id', authMiddleware, adminMiddleware, deleteBook);

module.exports = router;
