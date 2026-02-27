const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './library.db',
  logging: false
});

module.exports = sequelize;
