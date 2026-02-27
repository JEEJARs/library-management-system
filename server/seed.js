const { sequelize, User, Category, Book } = require('./models');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });

    const adminUser = await User.create({
      student_id: '63000001',
      full_name: 'Admin User',
      email: 'admin@ex.com',
      password: '4321',
      role: 'admin'
    });

    const testUser = await User.create({
      student_id: '64000001',
      full_name: 'Test Student',
      email: 'test@example.com',
      password: '1234',
      role: 'user'
    });

    const categories = await Category.bulkCreate([
      { name: 'Computer Science' },
      { name: 'Mathematics' },
      { name: 'Physics' },
      { name: 'Literature' },
      { name: 'History' }
    ]);

    const books = await Book.bulkCreate([
      { book_id: 'CS001', title: 'Introduction to Algorithms', category_id: categories[0].id },
      { book_id: 'CS002', title: 'Data Structures and Algorithms', category_id: categories[0].id },
      { book_id: 'CS003', title: 'Database Systems', category_id: categories[0].id },
      { book_id: 'MATH001', title: 'Calculus', category_id: categories[1].id },
      { book_id: 'MATH002', title: 'Linear Algebra', category_id: categories[1].id },
      { book_id: 'PHY001', title: 'Physics Fundamentals', category_id: categories[2].id },
      { book_id: 'LIT001', title: 'Classic Literature', category_id: categories[3].id },
      { book_id: 'HIST001', title: 'World History', category_id: categories[4].id }
    ]);

    console.log('Database seeded successfully!');
    console.log('Admin login: admin@ex.com / 4321');
    console.log('User login: test@example.com / 1234');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
