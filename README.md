# University Library Borrow-Return Management System

A full-stack web application for managing library book borrowing and returning operations with role-based access control.

## Features

### Authentication
- Single login page for both users and admins
- User registration with student ID validation
- JWT-based authentication
- Role-based redirects

### User Features
- View available books with search and filtering
- Borrow multiple books
- Submit return requests
- View borrowing history

### Admin Features
- Dashboard with statistics
- Confirm return requests
- View transaction history
- Manage books and categories
- Create admin accounts

## Technology Stack

### Backend
- Node.js
- Express.js
- Sequelize ORM
- SQLite database
- JWT authentication
- MVC Architecture

### Frontend
- Vue 3 (Options API)
- Vue Router
- Vuex for state management
- Axios for API calls
- Component-based structure

## Installation

### Backend Setup
1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Seed the database with initial data:
```bash
node seed.js
```

4. Start the server:
```bash
npm start
```
or for development:
```bash
npm run dev
```

### Frontend Setup
1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Default Accounts

### User Account
- Email: test@example.com
- Password: 1234
- Student ID: 64000001

### Admin Account
- Email: admin@ex.com
- Password: 4321
- Student ID: 63000001

## API Endpoints

### Authentication
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/create-admin (admin only)

### Books
- GET /api/books
- POST /api/books (admin only)
- PUT /api/books/:id (admin only)
- DELETE /api/books/:id (admin only)
- GET /api/books/top-borrowed (admin only)

### Categories
- GET /api/categories
- POST /api/categories (admin only)
- PUT /api/categories/:id (admin only)
- DELETE /api/categories/:id (admin only)

### Borrow Operations
- POST /api/borrow/borrow
- POST /api/borrow/return-request
- POST /api/borrow/confirm-return (admin only)
- GET /api/borrow/pending-returns (admin only)
- GET /api/borrow/history/:student_id
- GET /api/borrow/admin-history (admin only)
- GET /api/borrow/dashboard-stats (admin only)

### Users
- GET /api/users/total (admin only)

## Database Schema

### Users
- id, student_id, full_name, email, password, role

### Categories
- id, name

### Books
- id, book_id, title, status, category_id

### Borrows
- id, user_id, book_id, borrow_date, due_date, return_date, return_confirmed

## Project Structure

```
library-management-system/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   ├── package.json
│   └── seed.js
└── client/
    ├── src/
    │   ├── components/
    │   ├── views/
    │   ├── router/
    │   ├── services/
    │   ├── store/
    │   ├── App.vue
    │   └── main.js
    ├── package.json
    ├── vite.config.js
    └── index.html
```

## Usage

1. Start both backend and frontend servers
2. Open browser to `http://localhost:5173` (frontend dev server)
3. Login with default accounts or register a new user
4. Navigate through the application based on your role

## Student ID Validation

Student IDs must be exactly 8 digits starting with:
- 63, 64, 65, or 66

## License

MIT
