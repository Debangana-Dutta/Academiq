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
*Provides a high-level summary of your current academic standing, showing active subjects, cumulative attendance health, and quick links to recent notes.*

### 📊 Performance Analytics
Visualize your SGPA trends with interactive charts and use the future-looking CGPA Simulator to project your final grades.
![CGPA Trend](./frontend/public/screenshots/cgpa3.png)
*A data-visualization tool that tracks semester-wise growth and uses predictive modeling to show how future grades will impact your final degree percentage.*

### 🔮 CGPA Simulator (Predictive Tool)
Test "what-if" scenarios for your future results to see exactly what grades you need to reach your target CGPA.
![CGPA Simulator](./frontend/public/screenshots/cgpa4.png)
*An interactive module where you can input prospective subjects (like ADA), credits, and expected grades. It provides a real-time "Simulation Result" showing your future Semester SGPA, Projected CGPA, and the exact point improvement expected.*

---

## 🖼️ Module Gallery

| Attendance Intelligence | Attendance Logs | Note Gallery |
| :---: | :---: | :---: |
| ![Skip Calculator](./frontend/public/screenshots/attendance-2.png) | ![Table](./frontend/public/screenshots/attendance-1.png) | ![Gallery](./frontend/public/screenshots/notes-1.png) |
| **Skip Calculator**: The smart engine calculating "Safe-to-Skip" counts and "Must-Attend" recovery streaks to maintain the 75% threshold. | **Attendance Logs**: A detailed subject-wise history of every class attended, absent, or marked as medical leave. | **Notes Vault**: A visual grid of study materials with instant search, pinning capabilities, and color-coded categorization. |

| Note Editor | CGPA Semester Entry | SGPA Breakdown | Subject Details |
| :---: | :---: | :---: | :---: |
| ![Editor](./frontend/public/screenshots/notes-2.png) | ![Sem Entry](./frontend/public/screenshots/cgpa1.png) | ![Breakdown](./frontend/public/screenshots/cgpa2.png) | ![Subject View](./frontend/public/screenshots/atttendance-3.png) |
| **Rich Editor**: A distraction-free environment for drafting notes with 6 professional palettes and tag management. | **Grade Entry**: A streamlined form to input semester-specific results and credit weights for accurate calculation. | **SGPA Analysis**: A breakdown of performance metrics across different semesters to identify academic strengths. | **Deep-Dive Logs**: An expanded view of individual subject attendance records and percentage trends. |

---

## ✨ Features

### 📋 Attendance Tracker
- **Smart Skip Calculator**: Uses a custom algorithm to calculate exactly how many classes you can safely skip while staying above 75%.
- **Must-Attend Counter**: Real-time recovery logic showing consecutive classes needed to return to "Safe" status.
- **Visual Progress**: Color-coded enforcement (Safe / At Risk / Critical) with high-fidelity progress bars.

### 📊 CGPA Planner
- **Grade Management**: Detailed subject-wise entry for completed semesters.
- **Trend Analysis**: Bar charts visualizing your academic growth (SGPA) across your degree.
- **CGPA Simulator**: Pro-active tool to enter "what-if" grades and see their immediate impact on your cumulative average.

### 📝 Notes Repository
- **Rich Organization**: Theme-based color coding with professional palettes.
- **Instant Search**: Full-text search engine optimized for titles, content, and tags.
- **Pinned Workspace**: Keep your most critical subjects or exam notes at the top.

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

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone [https://github.com/Debangana-Dutta/Academiq.git](https://github.com/Debangana-Dutta/Academiq.git)
cd academiq

# Install all dependencies using the root script
npm run install:all
