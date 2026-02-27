const { User } = require('../models');

const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.count({
      where: { role: 'user' }
    });
    res.json({ totalUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTotalUsers
};
