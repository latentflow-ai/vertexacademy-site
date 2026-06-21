# 🏗️ Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER (Browser)                     │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
            ┌───────▼────────┐     │    ┌────────▼─────────┐
            │   HTML/CSS     │     │    │  JavaScript      │
            │   Components   │     │    │  (React Hooks)   │
            └────────────────┘     │    └──────────────────┘
                                   │
┌─────────────────────────────────▼────────────────────────────────────┐
│                      FRONTEND LAYER (Next.js 15)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Pages:                        Components:                           │
│  • Homepage                   • VBudChat (AI Widget)                │
│  • About-us                   • Header (Mobile Menu)                │
│  • Programs                   • ContactForm                         │
│  • Teachers                   • CampusVisitForm                     │
│  • Gallery                    • LocationMap                         │
│  • Contact                                                           │
│  • Campus-visit               UI Framework: Tailwind CSS            │
│  • Admin Login               Language: TypeScript                   │
│  • Admin Dashboard           Runtime: Node.js                       │
│                                                                       │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
        ┌───────────▼────┐    ┌───▼─────┐   ┌──▼──────────┐
        │   API Calls    │    │ Storage │   │ Icons/Fonts│
        │   (Fetch API)  │    │ Mgmt    │   └─────────────┘
        │                │    │         │
        │ /api/chat      │    └─────────┘
        │ /api/enrollment│
        │ /api/campus-v. │
        │ /api/admin/*   │
        └───────────┬────┘
                    │ HTTP/HTTPS
                    │
┌───────────────────▼──────────────────────────────────────────────────┐
│                     API GATEWAY / CORS LAYER                         │
├───────────────────────────────────────────────────────────────────────┤
│  • CORS Configuration                                                 │
│  • Request/Response Middleware                                        │
│  • Error Handling                                                     │
│  • Logging (Morgan)                                                   │
└───────────────────┬──────────────────────────────────────────────────┘
                    │
┌───────────────────▼──────────────────────────────────────────────────┐
│                    BACKEND LAYER (Node.js + Express)                 │
├───────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ROUTES:                         SERVICES:                           │
│  ├─ POST /api/chat          ├─ GeminiService                        │
│  │   └─ Request validation       ├─ AI conversation                  │
│  │   └─ Error handling           ├─ History management               │
│  │                               ├─ System prompts                   │
│  ├─ POST /api/enrollment     │                                      │
│  │   └─ Form validation      └─ EmailService                        │
│  │   └─ Error handling           ├─ Enrollment emails               │
│  │                               ├─ Campus visit emails             │
│  ├─ POST /api/campus-visit       ├─ Confirmation emails             │
│  │   └─ Form validation          └─ HTML templates                  │
│  │   └─ Error handling                                              │
│  │                          MIDDLEWARE:                             │
│  ├─ POST /api/admin/login   ├─ Authentication                       │
│  ├─ GET /api/admin/*        ├─ Error Handler                        │
│  │   └─ Protected routes     ├─ Logger                              │
│  │                           └─ CORS                                │
│  └─ GET /api/health                                                 │
│                             Framework: Express.js                   │
│                             Language: TypeScript                    │
│                             Port: 5000                              │
│                                                                      │
└──────────────┬──────────────────┬──────────────────┬────────────────┘
               │                  │                  │
      ┌────────▼─────┐   ┌────────▼────┐   ┌─────────▼──────┐
      │ Gemini API   │   │ SMTP Server  │   │ Admin Auth     │
      │ (Google AI)  │   │ (Gmail)      │   │ (Credentials)  │
      │              │   │              │   │                │
      │ • Chat       │   │ • Send emails │   │ • Login check  │
      │ • Responses  │   │ • Templates  │   │ • Token gen    │
      │ • History    │   │ • Formatting │   │ • User auth    │
      └──────────────┘   └──────────────┘   └────────────────┘
```

---

## Data Flow Diagrams

### 1. Chat Message Flow

```
User Types Message
        ↓
[Frontend: VBudChat Component]
        ↓
POST /api/chat
├─ message: string
├─ conversationHistory: []
        ↓
[Backend: chat.route.ts]
├─ Validate message
├─ Call Gemini Service
        ↓
[Gemini Service]
├─ Add system prompt
├─ Build chat history
├─ Call Google Gemini API
        ↓
[Google Generative AI]
├─ Process request
├─ Generate response
        ↓
[Backend Response]
├─ reply: string
├─ timestamp: date
        ↓
[Frontend]
├─ Update messages state
├─ Display bot response
└─ Scroll to bottom
```

### 2. Enrollment Form Submission Flow

```
User Fills Form
        ↓
[Frontend: ContactForm]
├─ Validate locally
├─ Set loading state
        ↓
POST /api/enrollment
├─ fullName
├─ email
├─ phone
├─ studentName
├─ grade
├─ program
├─ preferredDate
├─ message
        ↓
[Backend: enrollment.route.ts]
├─ Validate input
├─ Call Email Service
        ↓
[Email Service]
├─ Prepare HTML template
├─ Send to admin email
├─ Send confirmation to user
        ↓
[Gmail SMTP Server]
├─ Queue emails
├─ Send notifications
        ↓
[Backend Response]
├─ success: true
├─ message: "Submitted"
        ↓
[Frontend]
├─ Show success message
├─ Clear form
└─ Auto-dismiss after 5s
```

### 3. Admin Authentication Flow

```
User Types Credentials
        ↓
[Frontend: Admin Login Page]
├─ username: string
├─ password: string
        ↓
POST /api/admin/login
        ↓
[Backend: admin.route.ts]
├─ Validate credentials
├─ Check vs env variables
        ├─ ADMIN_USERNAME
        ├─ ADMIN_PASSWORD
        ↓
[If Credentials Match]
├─ Generate token
├─ Return in response
        ↓
[Frontend]
├─ Store token in localStorage
├─ Redirect to /admin/dashboard
        ↓
[Protected Page]
├─ Check token exists
├─ Send with requests
├─ Access granted
```

---

## Component Hierarchy

```
App (Next.js)
│
├─ RootLayout
│  ├─ Header
│  │  ├─ Logo
│  │  ├─ Navigation Links
│  │  └─ Mobile Menu (Hidden by default)
│  │     ├─ Menu Items
│  │     └─ Backdrop
│  │
│  ├─ Page Content
│  │  ├─ HomePage
│  │  ├─ AboutPage
│  │  ├─ ProgramsPage
│  │  ├─ TeachersPage
│  │  ├─ GalleryPage
│  │  ├─ ContactPage
│  │  │  ├─ ContactForm
│  │  │  ├─ ContactInfo
│  │  │  ├─ LocationMap
│  │  │  └─ FAQSection
│  │  │
│  │  ├─ CampusVisitPage
│  │  │  └─ CampusVisitForm
│  │  │
│  │  └─ AdminPages
│  │     ├─ LoginPage
│  │     └─ DashboardPage
│  │        ├─ StatCards
│  │        ├─ TabNavigation
│  │        └─ TabContent
│  │
│  └─ VBudChat (Floating Widget)
│     ├─ Chat Toggle Button
│     ├─ Chat Window
│     │  ├─ Header
│     │  ├─ Messages Container
│     │  │  ├─ UserMessage
│     │  │  ├─ BotMessage
│     │  │  └─ TypingIndicator
│     │  ├─ Input Area
│     │  └─ Send Button
│     └─ Animations
```

---

## Database Schema (Future)

```
Inquiries Table
├─ id (primary key)
├─ fullName
├─ email
├─ phone
├─ studentName
├─ grade
├─ program
├─ preferredDate
├─ message
├─ status (new/contacted/enrolled)
├─ createdAt
└─ updatedAt

CampusVisits Table
├─ id (primary key)
├─ name
├─ email
├─ phone
├─ preferredDate
├─ numberOfStudents
├─ message
├─ status (pending/confirmed/completed)
├─ createdAt
└─ updatedAt

ChatHistory Table
├─ id (primary key)
├─ sessionId
├─ userMessage
├─ botResponse
├─ timestamp
└─ userId (optional)
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION ENVIRONMENT                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────┐          ┌──────────────────────┐  │
│  │   Frontend (CDN)   │          │  Backend (Cloud)     │  │
│  │                    │          │                      │  │
│  │  • Vercel          │          │  • Heroku/Railway    │  │
│  │  • Next.js Build   │          │  • Node.js Server    │  │
│  │  • Static Files    │          │  • Express Routes    │  │
│  │  • Images          │          │  • Services          │  │
│  │                    │          │                      │  │
│  └────────────────────┘          └──────────────────────┘  │
│           │                              │                   │
│           └──────────────┬───────────────┘                   │
│                          │                                    │
│                    Environment Vars:                         │
│                    • API_URL                                 │
│                    • GEMINI_API_KEY                          │
│                    • SMTP_CREDENTIALS                        │
│                    • ADMIN_CREDENTIALS                       │
│                                                               │
│  ┌────────────────────┐          ┌──────────────────────┐  │
│  │  External Services │          │  Monitoring & Logs   │  │
│  │                    │          │                      │  │
│  │  • Google Gemini   │          │  • Sentry/Rollbar    │  │
│  │  • Gmail SMTP      │          │  • CloudWatch        │  │
│  │                    │          │  • Error Logging     │  │
│  └────────────────────┘          └──────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## File Upload Architecture (Future)

```
User Uploads File
        ↓
[Frontend File Input]
├─ Validate file type
├─ Check file size
        ↓
FormData with File
        ↓
POST /api/upload (with multipart/form-data)
        ↓
[Backend: Multer Middleware]
├─ Parse form data
├─ Save to /uploads
├─ Return file path
        ↓
Store file path in database
```

---

## Security Architecture

```
┌─────────────────────────────────────────────┐
│              SECURITY LAYERS                 │
├─────────────────────────────────────────────┤
│                                              │
│  1. FRONTEND                                 │
│     • Input validation                       │
│     • XSS prevention                         │
│     • CSRF tokens (future)                   │
│                                              │
│  2. NETWORK                                  │
│     • HTTPS/TLS encryption                   │
│     • CORS configuration                     │
│     • Rate limiting (future)                 │
│                                              │
│  3. BACKEND                                  │
│     • Input validation                       │
│     • Error handling                         │
│     • SQL injection prevention (future DB)   │
│     • Authentication middleware              │
│     • Authorization checks                   │
│                                              │
│  4. AUTHENTICATION                           │
│     • Token-based auth                       │
│     • JWT (future)                           │
│     • Password hashing (future)              │
│                                              │
│  5. DATA                                     │
│     • Environment variables                  │
│     • No hardcoded secrets                   │
│     • API key protection                     │
│     • Email encryption (future)              │
│                                              │
└─────────────────────────────────────────────┘
```

---

## Performance Optimization Strategy

```
Frontend Optimization:
├─ Code Splitting (Next.js)
├─ Image Optimization
├─ CSS Minification
├─ JavaScript Bundling
├─ Lazy Loading
└─ Caching Strategy

Backend Optimization:
├─ Async Operations
├─ Connection Pooling
├─ Middleware Ordering
├─ Error Handling
├─ Response Compression
└─ Logging Efficiency
```

---

## Scalability Roadmap

```
Phase 1: Current (Single Server)
├─ Monolithic backend
├─ Single database
└─ File system storage

Phase 2: Expansion (Microservices)
├─ Separate chat service
├─ Separate email service
├─ Dedicated auth service
└─ Separate file service

Phase 3: Enterprise (Enterprise Scale)
├─ Kubernetes orchestration
├─ Load balancing
├─ Database replication
├─ Cache layer (Redis)
└─ Message queue (RabbitMQ)
```

---

This architecture is designed to be:
- ✅ **Scalable**: Can grow with demand
- ✅ **Maintainable**: Clear separation of concerns
- ✅ **Secure**: Multiple layers of protection
- ✅ **Performant**: Optimized for speed
- ✅ **Reliable**: Error handling at all levels
