# ⚡ Quick Start Guide

## 5-Minute Setup

### Step 1: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
✅ Access at `http://localhost:4028`

### Step 2: Backend Setup
```bash
cd backend
cp .env.example .env
npm install
```

### Step 3: Get API Keys

**Google Gemini API:**
1. Go to https://aistudio.google.com/app/apikey
2. Create new project
3. Generate API key
4. Add to `.env`: `GEMINI_API_KEY=your_key`

**Gmail App Password:**
1. Enable 2FA on Gmail
2. Go to https://myaccount.google.com/apppasswords
3. Select Mail and Windows Computer
4. Copy password
5. Add to `.env`: `SMTP_PASS=your_password`

### Step 4: Configure .env

Edit `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_key_here
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
ADMIN_EMAIL=admin@vertexacademy.edu.in
```

### Step 5: Start Backend
```bash
npm run dev
```
✅ Server runs at `http://localhost:5000`

---

## Testing

### Test AI Chatbot
- Visit frontend (`http://localhost:4028`)
- Click chat icon (bottom-right)
- Type a message
- See AI response from Gemini

### Test Forms
- Go to `/contact` and submit enrollment form
- Check admin email for notification
- Go to `/campus-visit` and submit visit request
- Check admin email again

### Test Admin Panel
- Go to `/admin`
- Login with:
  - Username: `stalin@vertex`
  - Password: `VertexAcademy41`
- View dashboard metrics

---

## Key Files

| File | Purpose |
|------|---------|
| `frontend/.env.local` | Frontend API URL |
| `backend/.env` | Backend configuration |
| `frontend/src/components/chat/VBudChat.tsx` | Chatbot component |
| `backend/src/index.ts` | Express server |
| `backend/src/services/gemini.service.ts` | AI integration |
| `backend/src/services/email.service.ts` | Email notifications |

---

## Common Issues & Fixes

### Backend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Chat not working
- Check if both frontend and backend are running
- Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Check browser console for errors

### Emails not sending
- Verify Gmail app password (not regular password)
- Check 2FA is enabled
- Test SMTP connection

### Admin login fails
- Default credentials: `stalin@vertex` / `VertexAcademy41`
- Check backend `.env` for credentials

---

## Deployment Checklist

- [ ] Get Gemini API key
- [ ] Get Gmail app password
- [ ] Set all `.env` variables
- [ ] Test locally (chat, forms, admin)
- [ ] Deploy backend (Heroku/Railway/Render)
- [ ] Deploy frontend (Vercel)
- [ ] Update `NEXT_PUBLIC_API_URL` to production backend
- [ ] Test all features on production

---

## File Structure Overview

```
vertexacademy-site/
├── frontend/          # Next.js app (port 4028)
├── backend/           # Express server (port 5000)
├── IMPLEMENTATION_GUIDE.md
├── PROJECT_COMPLETION_SUMMARY.md
└── QUICK_START.md     # This file
```

---

## Port References

- **Frontend**: `http://localhost:4028`
- **Backend**: `http://localhost:5000`
- **Admin Panel**: `http://localhost:4028/admin`

---

## Environment Variables

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Backend** (`backend/.env`):
```
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_key
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_password
ADMIN_EMAIL=admin@vertexacademy.edu.in
ADMIN_USERNAME=stalin@vertex
ADMIN_PASSWORD=VertexAcademy41
FRONTEND_URL=http://localhost:4028
```

---

## Quick Commands

```bash
# Frontend development
cd frontend && npm run dev

# Frontend build
cd frontend && npm run build

# Backend development
cd backend && npm run dev

# Backend build
cd backend && npm run build

# Type checking
npm run type-check
```

---

## Features at a Glance

✅ **Fully Responsive** - Works on all devices
✅ **AI Chatbot** - powered by Gemini
✅ **Email Notifications** - Automated emails
✅ **Admin Panel** - Secure dashboard
✅ **Form Validation** - Frontend & backend
✅ **Beautiful UI** - Modern design with Tailwind

---

## Support

For detailed setup instructions, see:
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Complete documentation
- [PROJECT_COMPLETION_SUMMARY.md](./PROJECT_COMPLETION_SUMMARY.md) - What's been done

---

**Ready to go! 🚀**
