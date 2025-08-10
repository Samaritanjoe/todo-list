# Todo List Application

A full-stack todo list application built with:
- **Frontend**: React with Next.js
- **Backend**: Node.js with Express
- **Database**: MongoDB

## Installation Instructions

### Prerequisites
1. **Node.js** (v16 or higher)
2. **MongoDB** (v5.0 or higher)
3. **npm** or **yarn**

### Step 1: Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install
```

### Step 2: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
mongod

# Or start MongoDB service from Services
```

### Step 3: Environment Setup
Create a `.env` file in the root directory with:
```
MONGODB_URI=mongodb://localhost:27017/todo-list
PORT=5000
```

### Step 4: Run the Application
```bash
# Run both backend and frontend
npm run dev

# Or run separately:
# Backend only
npm run server

# Frontend only
npm run client
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/todos | Get all todos |
| GET | /api/todos/:id | Get single todo |
| POST | /api/todos | Create new todo |
| PUT | /api/todos/:id | Update todo |
| DELETE | /api/todos/:id | Delete todo |

## Features
- ✅ Create, read, update, delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Set priority levels (low, medium, high)
- ✅ Due date support
- ✅ Search functionality
- ✅ Responsive design
