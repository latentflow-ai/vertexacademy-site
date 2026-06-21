# Vertex Academy - Complete Implementation Guide

## Project Overview

A comprehensive educational academy website with:
- ✅ **Frontend**: Fully responsive Next.js 15 with React 18 & TypeScript
- ✅ **AI Chatbot**: powered by Google Gemini
- ✅ **Backend**: Node.js Express server with APIs
- ✅ **Email Service**: Automated notifications for inquiries and campus visits
- ✅ **Admin Panel**: Secure dashboard with authentication

---

## FRONTEND SETUP

### Installation

```bash
cd frontend
npm install
```

### Running Development Server

```bash
npm run dev
```

Access at: `http://localhost:4028`

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx              (Root layout with VBudChat)
│   │   ├── homepage/               (Landing page with hero, stats, testimonials)
│   │   ├── about-us/               (About page with mission, vision, timeline)
│   │   ├── programs/               (Programs listing & comparison)
│   │   ├── teachers/               (Faculty directory)
│   │   ├── gallery/                (Photo gallery with filters)
│   │   ├── contact/                (Contact form & location)
│   │   ├── campus-visit/           (Campus visit request form)
│   │   └── admin/                  (Admin login & dashboard)
│   ├── components/
│   │   ├── chat/
│   │   │   └── VBudChat.tsx        (AI chatbot widget)
│   │   ├── common/
│   │   │   └── Header.tsx          (Navigation with mobile menu)
│   │   └── ui/
│   │       ├── AppIcon.tsx         (Icon component)
│   │       ├── AppImage.tsx        (Image component)
│   │       └── index.ts
│   └── styles/
│       ├── index.css
│       └── tailwind.css
├── public/assets/images/
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.mjs

```

### Key Features Implemented

#### 1. **Fully Responsive Design**
   - Mobile-first approach
   - Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
   - Hamburger menu with smooth slide-down animation

#### 2. **AI Chatbot**
   - Location: Bottom-right corner (always visible)
   - Features:
     - Message history with timestamps
     - Typing indicators
     - Auto-scroll to latest message
     - Keyboard support (Enter to send)
     - Professional gradient UI
   - API: Calls `/api/chat` endpoint

#### 3. **Admin Panel**
   - Login page: `/admin`
   - Dashboard: `/admin/dashboard`
   - Default credentials:
     - Username: `stalin@vertex`
     - Password: `VertexAcademy41`
   - Features:
     - Token-based authentication (localStorage)
     - Stats dashboard with metrics
     - Tabs for inquiries, visits, settings

#### 4. **Forms with Backend Integration**
   - Enrollment inquiry form (Contact page)
   - Campus visit request form
   - Both send to backend and trigger email notifications

---

## BACKEND SETUP

### Installation

```bash
cd backend
npm install
```

### Environment Setup

Create `.env` file (copy from `.env.example`):

```env
# Server
PORT=5000
NODE_ENV=development

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
ADMIN_EMAIL=admin@vertexacademy.edu.in

# Admin Credentials
ADMIN_USERNAME=stalin@vertex
ADMIN_PASSWORD=VertexAcademy41

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:4028
```

### Getting Required Keys

#### Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new project
3. Generate API key
4. Add to `.env` as `GEMINI_API_KEY`

#### Gmail App Password
1. Enable 2-Factor Authentication on Gmail
2. Go to [Google Account Security](https://myaccount.google.com/security)
3. Click "App passwords"
4. Select Mail and Windows Computer
5. Copy the 16-character password
6. Add to `.env` as `SMTP_PASS`

### Running Development Server

```bash
npm run dev
```

Server runs on: `http://localhost:5000`

### Build for Production

```bash
npm run build
npm start
```

### Project Structure

```
backend/
├── src/
│   ├── index.ts                    (Express server entry)
│   ├── routes/
│   │   ├── chat.route.ts          (AI chatbot endpoint)
│   │   ├── enrollment.route.ts    (Enrollment form endpoint)
│   │   ├── campus-visit.route.ts  (Campus visit form endpoint)
│   │   └── admin.route.ts         (Admin endpoints)
│   └── services/
│       ├── gemini.service.ts      (Gemini API integration)
│       └── email.service.ts       (Email notifications)
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## API ENDPOINTS

### 1. Health Check
```
GET /api/health
```
Returns server status.

### 2. Chat (AI Chatbot)
```
POST /api/chat
```

**Request:**
```json
{
  "message": "What programs do you offer?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi there!"
    }
  ]
}
```

**Response:**
```json
{
  "reply": "We offer various programs including...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 3. Enrollment Inquiry
```
POST /api/enrollment
```

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "studentName": "Jane Doe",
  "grade": "9",
  "program": "Board Preparation (Classes 11-12)",
  "preferredDate": "2024-02-15",
  "message": "Interested in program"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Enrollment inquiry submitted successfully. We will contact you soon!"
}
```

**Actions:**
- Sends email to admin with inquiry details
- Sends confirmation email to user
- Validates all required fields

### 4. Campus Visit Request
```
POST /api/campus-visit
```

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "preferredDate": "2024-02-20",
  "numberOfStudents": "2",
  "message": "Want to see the campus"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Campus visit request submitted successfully. We will confirm your visit shortly!"
}
```

**Actions:**
- Sends email to admin with visit request
- Sends confirmation email to user
- Validates all required fields

### 5. Admin Login
```
POST /api/admin/login
```

**Request:**
```json
{
  "username": "stalin@vertex",
  "password": "VertexAcademy41"
}
```

**Response:**
```json
{
  "success": true,
  "token": "c3RhbGluQHZlcnRleDoxNzA1MzEyNjAwMDAw",
  "message": "Admin login successful"
}
```

### 6. Admin Dashboard (Protected)
```
GET /api/admin/dashboard
Headers: {
  "Authorization": "Bearer <token>"
}
```

**Response:**
```json
{
  "message": "Admin Dashboard",
  "data": {
    "totalEnquiries": 42,
    "totalCampusVisits": 15,
    "enrolledStudents": 156,
    "recentActivityCount": 8
  }
}
```

### 7. Get Inquiries (Protected)
```
GET /api/admin/inquiries
Headers: {
  "Authorization": "Bearer <token>"
}
```

### 8. Get Campus Visits (Protected)
```
GET /api/admin/campus-visits
Headers: {
  "Authorization": "Bearer <token>"
}
```

---

## FRONTEND-BACKEND INTEGRATION

### Setting API URL

In `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Example: Calling Chat API from Frontend

```typescript
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: userMessage,
    conversationHistory: messages
  })
});

const data = await response.json();
console.log(data.reply);
```

---

## DEPLOYMENT

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url/api
   ```
4. Deploy automatically on push

### Backend Deployment (Heroku/Railway/Render)

1. Create account on hosting platform
2. Set environment variables:
   - `GEMINI_API_KEY`
   - `SMTP_USER`, `SMTP_PASS`
   - `ADMIN_EMAIL`
   - `FRONTEND_URL` (your Vercel URL)
3. Deploy application
4. Update `NEXT_PUBLIC_API_URL` in frontend to deployed backend URL

### Example Backend Deployment Commands

**Heroku:**
```bash
heroku login
heroku create your-app-name
git push heroku main
heroku config:set GEMINI_API_KEY=your_key
heroku config:set SMTP_USER=your_email
heroku config:set SMTP_PASS=your_password
```

---

## TROUBLESHOOTING

### Frontend Issues

**Chatbot not working:**
- Check if backend server is running
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors
- Ensure backend CORS allows frontend URL

**Mobile menu not opening:**
- Check if z-index is causing overlap issues
- Verify animation keyframes in component
- Clear cache and hard refresh (Ctrl+Shift+Delete)

**Forms not submitting:**
- Verify backend is running
- Check network tab in DevTools
- Ensure all required fields are filled
- Check for CORS errors in console

### Backend Issues

**Email not sending:**
- Verify Gmail app password (not regular password)
- Check 2FA is enabled on Gmail
- Verify `SMTP_USER` and `SMTP_PASS` in `.env`
- Check spam folder for emails
- Run `node -e "require('./dist/services/email.service').verifyConnection()"`

**Gemini API errors:**
- Verify API key is correct
- Check API is enabled in Google Cloud Console
- Ensure API key has Generative AI API enabled
- Check rate limits and quota usage

**CORS errors:**
- Update `FRONTEND_URL` in backend `.env`
- For local development: `http://localhost:4028`
- For production: your Vercel deployment URL

---

## ADMIN PANEL FEATURES

### Current Features
- Login with credentials
- Dashboard with key metrics
- Tab navigation (Overview, Inquiries, Visits, Settings)
- Logout functionality

### Future Features (To be implemented)
- [ ] Display list of enrollment inquiries
- [ ] Display list of campus visit requests
- [ ] Search and filter inquiries/visits
- [ ] Export inquiries/visits as PDF/Excel
- [ ] Manage programs (CRUD operations)
- [ ] Manage teachers/faculty
- [ ] Update batch availability
- [ ] Upload gallery images
- [ ] Analytics and reporting

---

## TECHNOLOGY STACK

### Frontend
- **Framework**: Next.js 15.1.0
- **Runtime**: React 18
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Icons**: HeadlessUI/Heroicons

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4
- **AI**: Google Generative AI (Gemini)
- **Email**: Nodemailer 6
- **Upload**: Multer 1
- **Language**: TypeScript 5

### Authentication
- Simple token-based (localStorage)
- Future: JWT tokens for production

---

## SECURITY NOTES

⚠️ **Important for Production:**

1. **Use JWT Tokens**: Replace simple token authentication with proper JWT
2. **HTTPS Only**: Always use HTTPS in production
3. **Environment Variables**: Never commit `.env` files
4. **Password Hashing**: Hash admin password in production
5. **Rate Limiting**: Add rate limiting to APIs
6. **Input Validation**: Already implemented, enhance as needed
7. **CORS**: Restrict to specific domains
8. **Email Security**: Use OAuth2 instead of app passwords

---

## QUICK START CHECKLIST

- [ ] Clone repository
- [ ] Install dependencies (frontend & backend)
- [ ] Get Google Gemini API key
- [ ] Get Gmail app password
- [ ] Create `.env` files for both frontend and backend
- [ ] Run backend: `npm run dev` (from backend folder)
- [ ] Run frontend: `npm run dev` (from frontend folder)
- [ ] Test chatbot at bottom-right corner
- [ ] Test forms submission
- [ ] Login to admin panel: `/admin`
- [ ] Check emails are being sent

---

## SUPPORT & DOCUMENTATION

### Additional Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Google Generative AI](https://ai.google.dev/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## VERSION HISTORY

### v1.0.0 (Current)
- ✅ Fully responsive frontend
- ✅ AI Chatbot integration
- ✅ Enrollment inquiry form
- ✅ Campus visit request form
- ✅ Email notifications
- ✅ Admin authentication
- ✅ Admin dashboard
- 🔄 Future: Advanced admin features

---

**Last Updated**: January 2025
**Maintained by**: Vertex Academy Team
