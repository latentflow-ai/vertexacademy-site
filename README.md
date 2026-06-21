# Vertex Academy - Complete Website Solution

<div align="center">

![Vertex Academy](https://img.shields.io/badge/Vertex-Academy-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Complete-green?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)

**A fully responsive educational academy website with AI chatbot, email notifications, and admin dashboard**

[Quick Start](#-quick-start) • [Features](#-features) • [Documentation](#-documentation) • [Deployment](#-deployment)

</div>

---

## 🎯 Overview

Vertex Academy is a complete, production-ready website solution for an educational academy in Thiruvanmiyur, Chennai, India. Built with modern technologies, it features:

- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **AI Chatbot**: an intelligent assistant powered by Google Gemini
- **Contact Management**: Enrollment inquiries and campus visit requests with email notifications
- **Admin Dashboard**: Secure interface for managing inquiries and site content
- **Professional UI**: Beautiful, modern design with smooth animations

---

## ✨ Features

### Frontend
✅ **Fully Responsive Design**
- Mobile-first approach with Tailwind CSS
- Perfect on 320px phones to 4K monitors
- Smooth hamburger menu with animations

✅ **AI Chatbot**
- Real-time chat interface
- Powered by Google Generative AI (Gemini)
- Message history and typing indicators
- Mobile optimized with beautiful gradient UI

✅ **Interactive Pages**
- Homepage with hero, statistics, testimonials
- About us with timeline and leadership team
- Programs with comparison matrix
- Faculty directory with detailed profiles
- Photo gallery with filters
- Contact page with location map
- Campus visit scheduling form

✅ **Forms with Validation**
- Enrollment inquiry form
- Campus visit request form
- Client-side and server-side validation
- Beautiful error messages

### Backend
✅ **RESTful API**
- 8 comprehensive API endpoints
- Proper error handling and validation
- CORS configured for frontend

✅ **AI Integration**
- Google Generative AI (Gemini) API
- Conversation history support
- System prompts for academy context

✅ **Email Service**
- Nodemailer integration with Gmail SMTP
- HTML formatted email templates
- Admin notifications for inquiries
- Confirmation emails to users

✅ **Admin Panel**
- Secure login with authentication
- Dashboard with key metrics
- Protected routes with token validation
- Organized interface with tabs

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Google Gemini API key
- Gmail account with app password

### Installation (5 minutes)

**1. Clone and navigate**
```bash
cd frontend && npm install
cd ../backend && npm install
```

**2. Configure environment variables**

Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Backend (`backend/.env`):
```env
PORT=5000
GEMINI_API_KEY=your_key_here
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
ADMIN_EMAIL=admin@vertexacademy.edu.in
ADMIN_USERNAME=stalin@vertex
ADMIN_PASSWORD=VertexAcademy41
FRONTEND_URL=http://localhost:4028
```

**3. Start both servers**
```bash
# Terminal 1 - Frontend
cd frontend && npm run dev

# Terminal 2 - Backend
cd backend && npm run dev
```

**4. Access the app**
- Frontend: `http://localhost:4028`
- Backend: `http://localhost:5000`
- Admin: `http://localhost:4028/admin`

---

## 📚 Documentation

Comprehensive documentation is available:

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](./QUICK_START.md) | 5-minute setup guide |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | Complete technical documentation |
| [PROJECT_COMPLETION_SUMMARY.md](./PROJECT_COMPLETION_SUMMARY.md) | Feature overview |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design and diagrams |
| [STATUS_REPORT.md](./STATUS_REPORT.md) | Implementation checklist |
| [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) | Complete documentation index |

---

## 🏗️ Project Structure

```
vertexacademy-site/
├── frontend/                    # Next.js 15 application
│   ├── src/
│   │   ├── app/               # Pages
│   │   │   ├── admin/         # Admin panel
│   │   │   ├── contact/       # Contact & enrollment
│   │   │   ├── campus-visit/  # Visit requests
│   │   │   └── [other pages]
│   │   ├── components/
│   │   │   ├── chat/          # AI Chatbot
│   │   │   └── common/        # Header, footer
│   │   └── styles/            # Tailwind CSS
│   ├── .env.local             # Configuration
│   └── package.json
│
├── backend/                     # Node.js/Express API
│   ├── src/
│   │   ├── index.ts           # Server setup
│   │   ├── routes/            # API endpoints
│   │   │   ├── chat.route.ts
│   │   │   ├── enrollment.route.ts
│   │   │   ├── campus-visit.route.ts
│   │   │   └── admin.route.ts
│   │   └── services/          # Business logic
│   │       ├── gemini.service.ts
│   │       └── email.service.ts
│   ├── .env                   # Configuration
│   └── package.json
│
└── Documentation files
    ├── QUICK_START.md
    ├── IMPLEMENTATION_GUIDE.md
    ├── ARCHITECTURE.md
    └── [other guides]
```

---

## 🔌 API Endpoints

### Public Endpoints
- `POST /api/chat` - AI chatbot conversation
- `POST /api/enrollment` - Enrollment inquiry form
- `POST /api/campus-visit` - Campus visit request
- `GET /api/health` - Health check

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/dashboard` - Dashboard metrics
- `GET /api/admin/inquiries` - Inquiry list
- `GET /api/admin/campus-visits` - Visit list

---

## 👤 Admin Access

Default credentials:
- **URL**: `/admin`
- **Username**: `stalin@vertex`
- **Password**: `VertexAcademy41`

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **Icons**: HeadlessUI/Heroicons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **AI**: Google Generative AI (Gemini)
- **Email**: Nodemailer
- **Upload**: Multer

---

## 📝 Features in Detail

### Responsive Design
- Mobile-first approach
- Tested on all devices
- Smooth animations and transitions
- Accessible to all users

### AI Chatbot
- Always available in bottom-right corner
- Real-time responses from Google Gemini
- Maintains conversation history
- Professional UI with gradients
- Keyboard support (Enter to send)

### Enrollment Management
- Beautiful contact form
- Real-time validation
- Email notifications to admin
- Confirmation emails to users
- Form data saved for future reference

### Campus Visit Scheduling
- Easy-to-use visit request form
- Date and time selection
- Email confirmations
- Admin notifications

### Admin Dashboard
- Secure login system
- Overview of key metrics
- Inquiry and visit management
- Dashboard with statistics
- Responsive design

---

## 🌍 Location Information

**Vertex Academy**
- Address: New No.22, Old No.66, Anna Street, Thiruvanmiyur
- City: Chennai, Tamil Nadu 600041
- Country: India
- Coordinates: 12.9866858, 80.2626738
- [Google Maps Link](https://www.google.com/maps?q=12.9866858,80.2626738)

---

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy automatically

### Backend (Heroku/Railway/Render)
1. Create account on platform
2. Connect repository
3. Set environment variables
4. Deploy

See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md#deployment) for detailed instructions.

---

## ⚙️ Configuration

### Getting Required Keys

**Google Gemini API Key**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create new project
3. Generate API key

**Gmail App Password**
1. Enable 2FA on Gmail
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate app password
4. Use in `SMTP_PASS`

---

## 🧪 Testing

### Test Features Locally
```bash
# Test Frontend
npm run dev  # from frontend folder
# Visit http://localhost:4028

# Test Backend
npm run dev  # from backend folder
# Server runs on http://localhost:5000

# Test Chat
1. Open chatbot (bottom-right corner)
2. Type a message
3. See AI response

# Test Forms
1. Go to /contact
2. Fill enrollment form
3. Check admin email for notification

# Test Admin
1. Go to /admin
2. Login with credentials
3. View dashboard
```

---

## 🐛 Troubleshooting

### Common Issues

**Frontend won't start**
```bash
rm -rf node_modules
npm install
npm run dev
```

**Backend won't start**
- Check if port 5000 is available
- Verify `.env` file exists
- Check Node.js version (18+)

**Chat not working**
- Verify `GEMINI_API_KEY` in backend `.env`
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Ensure both servers are running

**Emails not sending**
- Use Gmail app password, not regular password
- Enable 2FA on Gmail
- Check SMTP credentials

See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md#troubleshooting) for more solutions.

---

## 📊 Project Status

### Completed ✅
- [x] Fully responsive frontend
- [x] AI chatbot integration
- [x] Backend API setup
- [x] Email service
- [x] Admin panel
- [x] Form validation
- [x] Documentation

### In Development 🔄
- [ ] Database integration
- [ ] Advanced admin features
- [ ] Analytics dashboard

### Planned 📋
- [ ] Multi-language support
- [ ] Payment integration
- [ ] Advanced search
- [ ] Mobile app

---

## 📖 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Express Guide](https://expressjs.com/)
- [Google AI Studio](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Nodemailer](https://nodemailer.com/)

---

## 📄 License

This project is proprietary to Vertex Academy.

---

## 👥 Support

For issues or questions:
1. Check the [Documentation Index](./DOCUMENTATION_INDEX.md)
2. Review [Troubleshooting Guide](./IMPLEMENTATION_GUIDE.md#troubleshooting)
3. Check code comments
4. Review error logs

---

## 🎓 Learning Resources

If you're new to any technology:
- **Next.js**: [Official Tutorial](https://nextjs.org/learn)
- **React**: [React Docs](https://react.dev)
- **Express**: [Express Guide](https://expressjs.com/)
- **TypeScript**: [TS Handbook](https://www.typescriptlang.org/docs/)
- **Tailwind**: [Tailwind Docs](https://tailwindcss.com/docs)

---

## 📞 Contact

**Vertex Academy**
- Location: Thiruvanmiyur, Chennai
- Phone: +91 9876543210
- Email: admissions@vertexacademy.edu.in
- Website: vertexacademy.edu.in

---

<div align="center">

**Made with ❤️ for Vertex Academy**

[⬆ Back to Top](#vertex-academy---complete-website-solution)

</div>
