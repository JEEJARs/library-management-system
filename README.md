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
- Confirm return requests
- View transaction history
- Manage books and categories
- Create admin accounts



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


## Database Schema

### Users
- id, student_id, full_name, email, password, role

### Categories
- id, name

### Books
- id, book_id, title, status, category_id

### Borrows
- id, user_id, book_id, borrow_date, due_date, return_date, return_confirmed


## Student ID Validation

Student IDs must be exactly 8 digits starting with:
- 63, 64, 65, or 66


