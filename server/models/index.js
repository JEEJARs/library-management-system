const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Book = require('./Book');
const Borrow = require('./Borrow');

Category.hasMany(Book, { foreignKey: 'category_id' });
Book.belongsTo(Category, { foreignKey: 'category_id' });

User.hasMany(Borrow, { foreignKey: 'user_id' });
Borrow.belongsTo(User, { foreignKey: 'user_id' });

Book.hasMany(Borrow, { foreignKey: 'book_id' });
Borrow.belongsTo(Book, { foreignKey: 'book_id' });

module.exports = {
  sequelize,
  User,
  Category,
  Book,
  Borrow
};
