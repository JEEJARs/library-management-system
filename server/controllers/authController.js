const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { JWT_SECRET } = require('../middleware/auth');
const { Op } = require('sequelize');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '24h' });
};

const register = async (req, res) => {
  try {
    const { student_id, full_name, email, password } = req.body;

    console.log('Registration request:', { student_id, full_name, email });

    // Validate student_id format
    const studentIdRegex = /^(63|64|65|66)\d{6}$/;
    if (!studentIdRegex.test(student_id)) {
      return res.status(400).json({ 
        message: 'Student ID must be exactly 8 digits starting with 63, 64, 65, or 66' 
      });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { student_id }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      student_id,
      full_name,
      email,
      password,
      role: 'user'
    });

    const token = generateToken(user.id, user.role);

    console.log('User created successfully:', { id: user.id, email: user.email });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        student_id: user.student_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    const token = generateToken(user.id, user.role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        student_id: user.student_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login
};
