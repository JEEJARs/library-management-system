const express = require('express');
const { register, login } = require('../controllers/authController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { User } = require('../models');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/create-admin', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { student_id, full_name, email, password } = req.body;

    const existingUser = await User.findOne({
      where: {
        $or: [{ email }, { student_id }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const admin = await User.create({
      student_id,
      full_name,
      email,
      password,
      role: 'admin'
    });

    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: admin.id,
        student_id: admin.student_id,
        full_name: admin.full_name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
