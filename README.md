# Employee Management System

A comprehensive employee management platform built with React, FastAPI, and AI-powered features.

## Features

- 👥 Employee Directory - Manage your entire workforce in one place
- 🏢 Department Management - Organize teams and departments
- 🤖 AI Onboarding Agent - Auto-generate 30-60-90 day plans for new hires
- 📚 Employee Handbook Chat - AI-powered chatbot for company policies
- 📊 Analytics & Insights - Real-time workforce reports and dashboards
- 📋 Leave Management - Track and approve employee leave requests
- 💰 Payroll System - Manage employee compensation
- ✅ Task Management - Assign and track employee tasks
- 📤 Bulk Upload - Import multiple employees via CSV
- 🔧 Platform Tools - MCP (Model Context Protocol) integration

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Recharts (Analytics)
- Lucide React (Icons)
- Tailwind CSS

### Backend
- FastAPI
- SQLAlchemy (Async)
- SQLite / PostgreSQL
- LangChain
- Sentence Transformers
- FAISS (Vector Search)
- Google Gemini AI
- MCP Server

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Installation & Running

#### Backend (Terminal 1):

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend will run at: http://localhost:8000

#### Frontend (Terminal 2):

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: http://localhost:5173

### Login Credentials

- **Email:** `admin@company.com`
- **Password:** `admin123`

## Project Structure

```
Employee-Management-System/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── auth.py              # Authentication logic
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── crud.py              # Database operations
│   ├── database.py          # Database configuration
│   ├── mcp_handler.py       # MCP server integration
│   ├── handbook.md          # Company handbook content
│   ├── routes/              # API routes
│   │   ├── employees.py
│   │   ├── departments.py
│   │   ├── chat.py
│   │   ├── onboarding.py
│   │   └── auth.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   │   ├── Dashboard.jsx
    │   │   ├── EmployeeList.jsx
    │   │   ├── DepartmentManager.jsx
    │   │   ├── ChatBot.jsx
    │   │   ├── OnboardingAgent.jsx
    │   │   ├── AnalyticsDashboard.jsx
    │   │   ├── LeaveManagement.jsx
    │   │   ├── PayrollSystem.jsx
    │   │   ├── TaskManagement.jsx
    │   │   └── ...
    │   ├── App.jsx          # Main application
    │   ├── api.js           # API client
    │   └── main.jsx         # Entry point
    ├── package.json
    └── vite.config.js
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Key Features Explained

### AI Onboarding Agent
Generates personalized 30-60-90 day onboarding plans based on role and required skills using Google Gemini AI.

### Employee Handbook Chat
RAG-based chatbot that answers questions about company policies, culture, and procedures using vector search and LangChain.

### MCP Integration
Model Context Protocol server that exposes employee management operations as tools for AI agents.

### Analytics Dashboard
Real-time insights including:
- Total employees and departments
- Department distribution
- Growth trends
- Role distribution

## Development

### Backend Development
```bash
cd backend
# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing
```bash
# Frontend tests
cd frontend
npm run test

# E2E tests with Playwright
npm run test:e2e
```

## Environment Variables

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### Backend (.env)
```
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your-secret-key
GOOGLE_API_KEY=your-gemini-api-key
```

## License

MIT

## Author

Pallavi K
