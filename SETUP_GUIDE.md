# Campus Echo - Complete Setup Guide

This guide will help you set up and run the Campus Echo application from scratch.

## Overview

Campus Echo is an AI-powered college assistant with:
- **Frontend**: React + Vite
- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Authentication**: JWT-based with email verification
- **User Roles**: Students and Faculty

## Prerequisites

Before starting, ensure you have installed:
- ✅ **Node.js** 20 or higher ([Download](https://nodejs.org/))
- ✅ **PostgreSQL** 15 or higher ([Download](https://www.postgresql.org/download/))
- ✅ **Git** ([Download](https://git-scm.com/))
- ✅ **npm** (comes with Node.js)

## Step-by-Step Setup

### 1. Database Setup

First, create a PostgreSQL database for the application.

#### Option A: Using psql Command Line
```bash
psql -U postgres
CREATE DATABASE campus_echo;
\q
```

#### Option B: Using pgAdmin
1. Open pgAdmin
2. Right-click on "Databases"
3. Select "Create > Database"
4. Enter name: `campus_echo`
5. Click "Save"

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```powershell
cd backend
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/campus_echo?schema=public"

# JWT Secrets - Generate strong random strings for production
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this

# Email Configuration (Gmail Example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5

# Optional: OpenAI key for audio transcription fallback (used by /api/voice/transcribe)
# Do NOT commit real keys. If you ever accidentally share a key, rotate/revoke it immediately.
OPENAI_API_KEY=your-openai-api-key
OPENAI_STT_MODEL=whisper-1
```

#### Setting up Gmail for Email Service

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security > 2-Step Verification > App Passwords
4. Generate a new app password
5. Copy the password and use it in `EMAIL_PASSWORD`

### 4. Initialize Database with Prisma

Generate Prisma client and push schema to database:

```powershell
npm run prisma:generate
npm run prisma:push
```

You should see output indicating tables were created successfully.

### 5. Start the Backend Server

```powershell
npm run dev
```

You should see:
```
🚀 Campus Echo API running on port 5000
📝 Environment: development
🌐 Frontend URL: http://localhost:5173
```

Keep this terminal open. The backend is now running!

### 6. Frontend Setup

Open a **new terminal** and navigate to the frontend directory:

```powershell
cd ..\frontend
npm install
```

### 7. Start the Frontend Server

```powershell
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 8. Open the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Testing the Application

### Test Registration Flow

1. Click "Get Started" or navigate to `/register`
2. Select "Student" or "Faculty"
3. Fill in the registration form:
   - **Student**: Full Name, Email, Roll Number, Department, Year, Phone, Password
   - **Faculty**: Full Name, Email, Employee ID, Department, Designation, Phone, Password
4. Click "Create Account"
5. Check your email for verification link (if email is configured)

### Test Login Flow

1. Navigate to `/login`
2. Select user type (Student/Faculty)
3. Enter email and password
4. Click "Sign In"
5. You should be redirected to dashboard (frontend integration pending)

## API Testing with Postman/Thunder Client

### 1. Register a Student

```http
POST http://localhost:5000/api/auth/register/student
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john.doe@college.edu",
  "rollNumber": "2024CS001",
  "department": "Computer Science",
  "year": "1st Year",
  "phone": "+919876543210",
  "password": "Test@1234",
  "confirmPassword": "Test@1234"
}
```

### 2. Login

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john.doe@college.edu",
  "password": "Test@1234"
}
```

Note: Email verification is required. For testing, you can manually verify:
```sql
UPDATE users SET is_verified = true WHERE email = 'john.doe@college.edu';
```

### 3. Get Current User (Protected)

```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 4. Student Dashboard (Protected)

```http
GET http://localhost:5000/api/student/dashboard
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Database Management

### View Database with Prisma Studio

```powershell
cd backend
npm run prisma:studio
```

This opens a GUI at `http://localhost:5555` where you can view and edit database records.

### Reset Database

If you need to reset the database:

```powershell
cd backend
npm run prisma:push -- --force-reset
```

## Troubleshooting

### Backend won't start

1. **Database connection error**:
   - Check PostgreSQL is running: `Get-Service -Name postgresql*`
   - Verify DATABASE_URL in `.env`
   - Test connection: `psql -U postgres -d campus_echo`

2. **Port already in use**:
   - Change PORT in `.env` to a different number (e.g., 5001)

### Frontend won't start

1. **Dependencies issue**:
   ```powershell
   Remove-Item node_modules -Recurse -Force
   Remove-Item package-lock.json
   npm install
   ```

2. **Port already in use**:
   - Vite will automatically try the next available port

### Email not sending

1. Check Gmail App Password is correct
2. Verify EMAIL_HOST and EMAIL_PORT
3. Check Gmail account has 2FA enabled
4. For testing, you can skip email verification by manually updating the database

## Project Structure

```
campus-echo/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js         # Prisma client
│   │   ├── controllers/
│   │   │   └── authController.js   # Auth controllers
│   │   ├── middleware/
│   │   │   └── auth.js             # Auth middleware
│   │   ├── routes/
│   │   │   ├── authRoutes.js       # Auth routes
│   │   │   ├── studentRoutes.js    # Student routes
│   │   │   └── facultyRoutes.js    # Faculty routes
│   │   ├── services/
│   │   │   ├── authService.js      # Auth business logic
│   │   │   └── emailService.js     # Email service
│   │   ├── utils/
│   │   │   ├── jwt.js              # JWT utilities
│   │   │   └── validation.js       # Input validation
│   │   └── server.js               # Express server
│   ├── .env                        # Environment variables
│   ├── .env.example                # Environment template
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main app component
│   │   ├── CampusEchoHomePage.jsx  # Homepage
│   │   ├── CampusEchoLogin.jsx     # Login page
│   │   ├── CampusEchoRegistration.jsx  # Registration page
│   │   └── main.jsx                # Entry point
│   ├── package.json
│   └── README.md
└── SETUP_GUIDE.md                  # This file
```

## Next Steps

Now that your backend is complete, you can:

1. ✅ Test all API endpoints
2. ✅ Connect frontend forms to backend APIs
3. ✅ Add authentication state management (Context API/Redux)
4. ✅ Create dashboard pages for students and faculty
5. ✅ Implement protected routes in frontend
6. ✅ Add loading states and error handling
7. ✅ Build additional features (notices, events, etc.)

## Additional Commands

### Backend
```powershell
# Development server
npm run dev

# Production server
npm start

# Generate Prisma client
npm run prisma:generate

# Push schema changes
npm run prisma:push

# Create migration
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

### Frontend
```powershell
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Support

If you encounter any issues:

1. Check the logs in the terminal where the servers are running
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL is running
4. Check that all dependencies are installed

## Security Notes for Production

Before deploying to production:

1. ✅ Generate strong JWT secrets (use `openssl rand -base64 32`)
2. ✅ Use HTTPS
3. ✅ Set NODE_ENV=production
4. ✅ Use environment-specific email service (SendGrid, AWS SES)
5. ✅ Enable database SSL
6. ✅ Set secure CORS origins
7. ✅ Review and adjust rate limits
8. ✅ Set up proper logging and monitoring

Happy coding! 🚀
