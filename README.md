# AcademiQ 🎓 
### The Ultimate Student Command Center
*By Students, For Students*

![AcademiQ Banner](./frontend/public/screenshots/banner.png)

AcademiQ is a production-grade MERN stack application designed to help students navigate university life with data-driven precision. From attendance skip-logic to interactive CGPA simulation, it serves as the ultimate workspace for academic excellence.

---

## 📸 Visual Tour

### ⚡ Intelligent Dashboard
Get a bird's-eye view of your semester. This command center automatically flags subjects at risk so you can take action before it's too late.
![Dashboard Overview](./frontend/public/screenshots/Dashboard.png)

### 📊 Performance Analytics
Visualize your SGPA trends with interactive charts and use the future-looking CGPA Simulator to project your final grades.
![CGPA Trend](./frontend/public/screenshots/cgpa3.png)

### 🧠 Attendance Intelligence
Advanced skip-probability logic helps you manage your schedule while maintaining the strict 75% university threshold.
![Skip Calculator](./frontend/public/screenshots/attendance-2.png)

---

## ✨ Features

### 📋 Attendance Tracker
- **Smart Skip Calculator**: Uses a custom algorithm to calculate exactly how many classes you can safely skip while staying above 75%.
- **Must-Attend Counter**: Real-time recovery logic showing consecutive classes needed to return to "Safe" status.
- **Visual Progress**: Color-coded enforcement (Safe / At Risk / Critical) with high-fidelity progress bars.
- **Doughnut Analytics**: Subject-wise distribution overview for quick health checks.

### 📊 CGPA Planner
- **Grade Management**: Detailed subject-wise entry for completed semesters.
- **Trend Analysis**: Bar charts visualizing your academic growth (SGPA) across your degree.
- **CGPA Simulator**: Pro-active tool to enter "what-if" grades and see their immediate impact on your cumulative average.

### 📝 Notes Repository
- **Rich Organization**: Theme-based color coding with 6 professional palettes.
- **Instant Search**: Full-text search engine optimized for titles, content, and tags.
- **Pinned Workspace**: Keep your most critical subjects or exam notes at the top.

### 🔐 Security & Engineering
- **XSS/CSRF Protection**: JWT authentication via **HTTP-only cookies** and `SameSite: Strict` enforcement.
- **Rate Limiting**: Security middleware to prevent brute-force attacks on auth and API routes.
- **Data Integrity**: Input validation via `express-validator` and password hashing with `bcrypt` (12 salt rounds).

---

## 🖼️ Module Gallery

| Attendance Logs | CGPA Simulator | Note Editor |
| :---: | :---: | :---: |
| ![Table](./frontend/public/screenshots/attendance-1.png) | ![Sim](./frontend/public/screenshots/cgpa4.png) | ![Editor](./frontend/public/screenshots/notes-2.png) |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer-friendly animations |
| **State** | React Context API (AuthContext + AcademicContext) |
| **Charts** | Chart.js + react-chartjs-2 |
| **Icons** | Heroicons v2 |
| **Backend** | Node.js, Express 4 |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | JWT + HTTP-only cookies |
| **Security** | Helmet, express-rate-limit, bcryptjs |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18.0
- MongoDB Atlas account (for cloud database)

### 1. Clone & Install
```bash
git clone [https://github.com/Debangana-Dutta/Academiq.git](https://github.com/Debangana-Dutta/Academiq.git)
cd academiq

# Install all dependencies using the root script
npm run install:all


