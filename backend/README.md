# Campus Echo - Backend API

Backend API for Campus Echo, an AI-powered college assistant application.

## Features

- 🔐 JWT-based authentication with access & refresh tokens
- 👥 Dual user roles: Students and Faculty
- 📧 Email verification system
- 🔒 Password reset functionality
- 🛡️ Rate limiting for security
- 🗄️ PostgreSQL database with Prisma ORM
- ✅ Input validation with Joi

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Authentication**: JWT + bcryptjs
- **Email**: Nodemailer
- **Validation**: Joi

## Prerequisites

- Node.js 20 or higher
- PostgreSQL 15 or higher
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE campus_echo;
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/campus_echo?schema=public"
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 4. Run Database Migrations

```bash
npm run prisma:generate
npm run prisma:push
```

### 5. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register/student` - Register new student
- `POST /register/faculty` - Register new faculty
- `POST /login` - Login user
- `POST /logout` - Logout user
- `POST /refresh` - Refresh access token
- `GET /verify-email?token=xxx` - Verify email
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password
- `GET /me` - Get current user profile

### Student Routes (`/api/student`)

All routes require student authentication:
- `GET /dashboard` - Student dashboard
- `GET /notices` - Get campus notices
- `GET /events` - Get campus events
- `GET /resources` - Get academic resources

### Faculty Routes (`/api/faculty`)

All routes require faculty authentication:
- `GET /dashboard` - Faculty dashboard
- `POST /notices` - Create notice
- `PUT /notices/:id` - Update notice
- `DELETE /notices/:id` - Delete notice
- `GET /students` - Get students list
- `POST /attendance` - Mark attendance

### Other Routes

- `GET /api/health` - Health check
- `GET /` - API information

## Database Schema

### Users
- Stores authentication data for both students and faculty
- Linked to Student or Faculty profile tables

### Students
- Student-specific information (roll number, year, department)

### Faculty
- Faculty-specific information (employee ID, designation)

### Tokens
- RefreshToken - Session management
- EmailVerificationToken - Email verification
- PasswordResetToken - Password reset

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT access tokens (15 min expiry)
- JWT refresh tokens (7 days expiry)
- Rate limiting on auth endpoints (5 requests per 15 min)
- Email verification required
- CORS protection
- httpOnly cookies for refresh tokens

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio GUI
- `npm run prisma:push` - Push schema to database

## Email Configuration (Gmail)

1. Enable 2-factor authentication on your Google account
2. Generate an "App Password" from Google Account settings
3. Use the app password in `EMAIL_PASSWORD` environment variable

## Development

The server uses nodemon for hot-reloading in development mode. Any changes to `.js` files will automatically restart the server.

## Error Handling

All API responses follow this format:

Success:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

## License

ISC
