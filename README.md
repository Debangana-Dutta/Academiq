# 🎓 AcademiQ — Student Productivity Suite

A **production-grade MERN stack** web application built as a professional portfolio piece. AcademiQ helps students track attendance, plan CGPA, and manage notes, all in a sleek SaaS-style interface.

![AcademiQ Banner](https://via.placeholder.com/1200x400/6366f1/ffffff?text=AcademiQ+%E2%80%94+Student+Productivity+Suite)

---

## ✨ Features

### 📋 Attendance Tracker
- Log daily attendance per subject (Present / Absent / Medical / Cancelled)
- **Smart Skip Calculator**: calculates exactly how many classes you can safely skip while staying above 75%
- **Must-Attend Counter**: shows how many consecutive classes you must attend to recover your attendance
- Visual progress bars with color-coded status (Safe / At Risk / Critical)
- Doughnut chart overview of all subjects

### 📊 CGPA Planner
- Add completed semester grades (subject-wise)
- Auto-calculated SGPA per semester using weighted grade points
- Cumulative CGPA computed across all semesters
- **CGPA Simulator**: enter future grades to project your CGPA before results are out
- Bar chart showing SGPA trend across semesters

### 📝 Notes Repository
- Rich note creation with colour coding (6 themes)
- Full-text search across title, content, and tags
- Filter by subject, colour, or pinned status
- Tag system (up to 10 tags per note)
- Pin important notes to the top

### 🔐 Security
- JWT authentication stored in **HTTP-only cookies** (XSS-proof)
- `SameSite: Strict` cookies (CSRF-proof)
- Rate limiting on all API routes (15-min window + strict auth limiter)
- Helmet.js security headers
- Input validation via express-validator
- Password hashing with bcrypt (12 salt rounds)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer-friendly CSS animations |
| **State** | React Context API (AuthContext + AcademicContext) |
| **Charts** | Chart.js + react-chartjs-2 |
| **Icons** | Heroicons v2 |
| **HTTP Client** | Axios with interceptors |
| **Backend** | Node.js, Express 4 |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT + HTTP-only cookies |
| **Security** | Helmet, express-rate-limit, express-validator, bcryptjs |
| **Dev Tools** | Nodemon, Concurrently |

---

## 📁 Project Structure

```
academiq/
├── backend/
│   ├── config/db.js               # MongoDB connection
│   ├── controllers/               # Business logic
│   │   ├── authController.js
│   │   ├── subjectController.js
│   │   ├── attendanceController.js
│   │   ├── cgpaController.js
│   │   └── notesController.js
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect middleware
│   │   └── errorMiddleware.js     # Global error handler
│   ├── models/                    # Mongoose schemas
│   │   ├── User.js
│   │   ├── Subject.js
│   │   ├── Attendance.js          # Includes virtual: percentage, safeToSkip, mustAttend
│   │   ├── CGPAEntry.js           # Auto-calculates SGPA on save
│   │   └── Note.js                # Full-text indexed
│   ├── routes/                    # Express routers
│   ├── utils/generateToken.js
│   └── server.js                  # App entry point
│
└── frontend/
    └── src/
        ├── api/axios.js           # Axios instance with interceptors
        ├── context/
        │   ├── AuthContext.jsx    # Auth state + login/logout/register
        │   └── AcademicContext.jsx # Subjects, Attendance, CGPA, Notes
        ├── components/
        │   ├── layout/            # Sidebar, TopBar, Layout
        │   ├── ui/index.jsx       # StatCard, Modal, Badge, Loader, etc.
        │   ├── attendance/        # AttendanceTable, Chart, SkipCalculator
        │   ├── cgpa/              # CGPASimulator, GradeCard
        │   └── notes/             # NoteCard, NoteEditor
        ├── pages/                 # LoginPage, Register, Dashboard, Attendance, CGPA, Notes
        ├── utils/academicCalc.js  # Pure calculation functions
        └── App.jsx                # Router with protected routes
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18.0
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & Install

```bash
git clone https://github.com/yourname/academiq.git
cd academiq

# Install all dependencies
npm run install:all
# or manually:
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and JWT secret

# Frontend
cp frontend/.env.example frontend/.env
```

**`backend/.env`:**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/academiq
JWT_SECRET=your_super_secret_key_at_least_32_characters
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:5173
```

### 3. Run Development Servers

```bash
# Run both simultaneously (from root)
npm install        # installs concurrently
npm run dev

# Or separately:
npm run dev:backend   # → http://localhost:5000
npm run dev:frontend  # → http://localhost:5173
```

### 4. Open the App

Navigate to **http://localhost:5173** and create your account!

---

## 📐 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Subjects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subjects` | Get all subjects |
| POST | `/api/subjects` | Create subject |
| PUT | `/api/subjects/:id` | Update subject |
| DELETE | `/api/subjects/:id` | Delete subject |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/attendance` | Get all with stats |
| GET | `/api/attendance/summary` | Summary stats |
| POST | `/api/attendance/log` | Log a class |
| PUT | `/api/attendance/:subjectId/manual` | Manual update |

### CGPA
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cgpa` | Get all semesters + CGPA |
| POST | `/api/cgpa/semester` | Add/update semester |
| POST | `/api/cgpa/simulate` | Simulate projected CGPA |
| DELETE | `/api/cgpa/semester/:num` | Delete semester |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes?search=&subject=&tag=&color=` | Get notes |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

---

## 🧮 Attendance Algorithm

The skip calculator uses this formula:

```
Safe to Skip = floor((attended - 0.75 × total) / 0.75)

Must Attend  = ceil((0.75 × total - attended) / 0.25)
             = ceil(3 × total - 4 × attended)   [when attendance < 75%]
```

---

## 🎨 Design System

- **Primary**: Indigo (`#6366f1` family)
- **Success**: Emerald (`#10b981` family)
- **Warning**: Amber (`#f59e0b`)
- **Danger**: Red (`#ef4444`)
- **Typography**: Plus Jakarta Sans (UI) + JetBrains Mono (code/numbers)
- **Glassmorphism**: `bg-white/70 backdrop-blur-md` cards
- **Animations**: CSS keyframe animations (`animate-fade-in`, `animate-slide-up`, `animate-stagger`)

---

## 📄 License

MIT License — free for personal and commercial use.

---

Built with ❤️ as a full-stack portfolio project.
