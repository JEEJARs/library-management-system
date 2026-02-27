const { Book, Category, Borrow } = require('../models');
const { Op } = require('sequelize');

const getAllBooks = async (req, res) => {
  try {
    const { category_id, search } = req.query;
    const whereClause = {};

    if (category_id) {
      whereClause.category_id = category_id;
    }

    if (search) {
      whereClause[Op.or] = [
        { book_id: { [Op.like]: `%${search}%` } },
        { title: { [Op.like]: `%${search}%` } }
      ];
    }

    const books = await Book.findAll({
      where: whereClause,
      include: [{
        model: Category,
        attributes: ['id', 'name']
      }, {
        model: Borrow,
        where: { return_confirmed: false },
        required: false,
        include: [{
          model: require('../models').User,
          attributes: ['student_id', 'full_name']
        }]
      }]
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { book_id, title, category_id } = req.body;
    const book = await Book.create({ book_id, title, category_id });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { book_id, title, category_id, status } = req.body;
    
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.update({ book_id, title, category_id, status });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.destroy();
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTopBorrowedBooks = async (req, res) => {
  try {
    const topBooks = await Borrow.findAll({
      attributes: [
        'book_id',
        [require('sequelize').fn('COUNT', require('sequelize').col('book_id')), 'borrow_count']
      ],
      include: [{
        model: Book,
        include: [Category]
      }],
      group: ['book_id', 'Book.id', 'Book.category_id', 'Category.id'],
      order: [[require('sequelize').literal('borrow_count'), 'DESC']],
      limit: 10
    });

    res.json(topBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
  getTopBorrowedBooks
};
