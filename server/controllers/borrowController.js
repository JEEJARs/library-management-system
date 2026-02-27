const { Borrow, Book, User } = require('../models');
const { Op } = require('sequelize');

const borrowBooks = async (req, res) => {
  try {
    const { student_id, book_ids } = req.body;

    const user = await User.findOne({ where: { student_id } });
    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 7);

    const borrowPromises = book_ids.map(async (book_id) => {
      const book = await Book.findByPk(book_id);
      if (!book || book.status !== 'available') {
        throw new Error(`Book ${book_id} is not available`);
      }

      await book.update({ status: 'borrowed' });

      return await Borrow.create({
        user_id: user.id,
        book_id: book_id,
        borrow_date: today.toISOString().split('T')[0],
        due_date: dueDate.toISOString().split('T')[0]
      });
    });

    await Promise.all(borrowPromises);

    res.json({ message: 'Books borrowed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const returnRequest = async (req, res) => {
  try {
    const { student_id, book_ids } = req.body;

    const user = await User.findOne({ where: { student_id } });
    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const borrows = await Borrow.findAll({
      where: {
        user_id: user.id,
        book_id: { [Op.in]: book_ids },
        return_confirmed: false
      }
    });

    if (borrows.length === 0) {
      return res.status(404).json({ message: 'No active borrow records found' });
    }

    res.json({ message: 'Return request submitted successfully', borrows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmReturn = async (req, res) => {
  try {
    const { borrow_ids } = req.body;

    const returnPromises = borrow_ids.map(async (borrow_id) => {
      const borrow = await Borrow.findByPk(borrow_id, {
        include: [Book]
      });

      if (!borrow) {
        throw new Error(`Borrow record ${borrow_id} not found`);
      }

      const today = new Date().toISOString().split('T')[0];

      await borrow.update({
        return_date: today,
        return_confirmed: true
      });

      await borrow.Book.update({ status: 'available' });

      return borrow;
    });

    await Promise.all(returnPromises);

    res.json({ message: 'Return confirmed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingReturns = async (req, res) => {
  try {
    const pendingReturns = await Borrow.findAll({
      where: { return_confirmed: false },
      include: [
        {
          model: Book,
          include: [require('../models').Category]
        },
        {
          model: User,
          attributes: ['student_id', 'full_name']
        }
      ]
    });

    res.json(pendingReturns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserHistory = async (req, res) => {
  try {
    const { student_id } = req.params;

    const user = await User.findOne({ where: { student_id } });
    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const history = await Borrow.findAll({
      where: { user_id: user.id },
      include: [
        {
          model: Book,
          include: [require('../models').Category]
        }
      ],
      order: [['borrow_date', 'DESC']]
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminHistory = async (req, res) => {
  try {
    const history = await Borrow.findAll({
      include: [
        {
          model: Book,
          include: [require('../models').Category]
        },
        {
          model: User,
          attributes: ['student_id', 'full_name']
        }
      ],
      order: [['borrow_date', 'DESC']]
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const borrowedBooks = await Borrow.count({
      where: { return_confirmed: false }
    });

    const dueWithin3Days = await Borrow.count({
      where: {
        return_confirmed: false,
        due_date: {
          [Op.lte]: threeDaysFromNow.toISOString().split('T')[0]
        }
      }
    });

    const overdueBooks = await Borrow.count({
      where: {
        return_confirmed: false,
        due_date: {
          [Op.lt]: today.toISOString().split('T')[0]
        }
      }
    });

    res.json({
      borrowedBooks,
      dueWithin3Days,
      overdueBooks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  borrowBooks,
  returnRequest,
  confirmReturn,
  getPendingReturns,
  getUserHistory,
  getAdminHistory,
  getDashboardStats
};
