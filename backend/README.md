# Vertex Academy Backend - Setup Instructions

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Google Gemini API key
- Gmail account with app password (for email notifications)

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update the following variables:
     ```
     GEMINI_API_KEY=your_gemini_api_key
     SMTP_USER=your_email@gmail.com
     SMTP_PASS=your_gmail_app_password
     ADMIN_EMAIL=admin@vertexacademy.edu.in
     FRONTEND_URL=http://localhost:4028 (for local development)
     ```

## Running the Server

### Development Mode
```bash
npm run dev
```
Server will start on http://localhost:5000

### Production Build
```bash
npm run build
npm start
```

## API Endpoints

### Chat API
- **POST** `/api/chat`
  - Request: `{ message: string, conversationHistory?: Message[] }`
  - Response: `{ reply: string, timestamp: Date }`
  - Integrates with Google Gemini API for AI responses

### Enrollment Inquiry
- **POST** `/api/enrollment`
  - Request body:
    ```json
    {
      "fullName": "string",
      "email": "string",
      "phone": "string",
      "studentName": "string",
      "grade": "string",
      "program": "string",
      "preferredDate": "string",
      "message": "string"
    }
    ```
  - Sends email notification to admin
  - Sends confirmation email to user

### Campus Visit
- **POST** `/api/campus-visit`
  - Request body:
    ```json
    {
      "name": "string",
      "email": "string",
      "phone": "string",
      "preferredDate": "string",
      "numberOfStudents": "string",
      "message": "string"
    }
    ```
  - Sends email notification to admin
  - Sends confirmation email to user

### Admin Login
- **POST** `/api/admin/login`
  - Request: `{ username: string, password: string }`
  - Default credentials: `stalin@vertex` / `VertexAcademy41`
  - Response: `{ success: boolean, token: string }`

### Admin Dashboard (Protected)
- **GET** `/api/admin/dashboard` (requires Bearer token)
- **GET** `/api/admin/inquiries` (requires Bearer token)
- **GET** `/api/admin/campus-visits` (requires Bearer token)

## Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Create an App Password:
   - Go to Google Account > Security
   - Select "App passwords"
   - Choose Mail and Windows Computer
   - Use the generated 16-character password as `SMTP_PASS`

## Health Check
- **GET** `/api/health`
  - Returns server status and timestamp

## Features Implemented

✅ AI Chatbot - Powered by Google Gemini
✅ Enrollment Inquiry Form Submission with Email Notification
✅ Campus Visit Request Form with Email Notification
✅ Admin Authentication System
✅ Email Service with HTML Templates
✅ CORS Configuration for Frontend
✅ Error Handling and Validation

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL) for inquiry/visit storage
- [ ] JWT authentication for admin panel
- [ ] Admin dashboard with full CRUD operations
- [ ] File upload for student documents
- [ ] Analytics and reporting
- [ ] Batch availability management
- [ ] Teacher profile management
- [ ] PDF/Excel export functionality

## Troubleshooting

### Email not sending
- Verify SMTP credentials are correct
- Check that Gmail app password is being used (not regular password)
- Ensure 2FA is enabled on Gmail account
- Run `npm run dev` and check console logs for SMTP connection errors

### Gemini API Error
- Verify API key is correct
- Check that API key has appropriate permissions
- Ensure API is enabled in Google Cloud Console

### CORS Error
- Verify `FRONTEND_URL` matches your frontend domain
- For local development, use `http://localhost:4028`
- For production, update to your deployment URL
