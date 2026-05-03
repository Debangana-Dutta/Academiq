# AcademiQ 🎓 
### The Ultimate Student Command Center
*By Students, For Students*

![AcademiQ Banner](./frontend/public/screenshots/banner.png)

AcademiQ is a production-grade MERN stack application designed to help students navigate university life with data-driven precision. From attendance skip-logic to interactive CGPA simulation, it serves as the ultimate workspace for academic excellence.

---

## 📸 Visual Tour

### ⚡ The Command Center (Dashboard)
**Your academic life, at a glance.**
![Dashboard Overview](./frontend/public/screenshots/Dashboard.png)
Stop juggling multiple apps. The AcademiQ Dashboard provides a high-fidelity summary of your semester. It automatically flags subjects at risk, tracks your recent notes, and calculates your cumulative attendance health in real-time so you stay ahead of the curve.

### 🧠 Attendance Intelligence
**Master your schedule with mathematical precision.**
![Skip Calculator Overview](./frontend/public/screenshots/attendance-2.png)
Never stress about the 75% rule again. Our advanced "Skip-Logic" engine tells you exactly how many classes you can safely miss or how many consecutive classes you must attend to stay in the "Safe Zone." Data-driven freedom for the modern student.

### 🔮 Predictive Attendance Result
**See the future of your attendance before you skip.**
![Predictive Attendance Result](./frontend/public/screenshots/attendance-2.png)
Plan your breaks with confidence. Use the interactive skip-simulator to see exactly how your percentage will drop after missing a specific number of classes. It provides a real-time "After Skipping" calculation, ensuring you maintain your 75% threshold with no surprises.

### 📊 CGPA Planner & Simulator
**Predict your future, track your growth.**
![CGPA Trend](./frontend/public/screenshots/cgpa3.png)
Visualize your academic journey with interactive SGPA trend charts. Use our predictive simulator to input "what-if" grades for upcoming exams and see their immediate impact on your final degree percentage before you even sit for the test.

### 📝 The Academic Vault (Notes)
**Knowledge organized, effortlessly searchable.**
![Notes Gallery](./frontend/public/screenshots/notes-1.png)
A sleek, categorized repository for your study materials. With 6 professional color palettes, subject-wise tagging, and a "Pinned" workspace for high-priority exam notes, your intellectual property has never looked this organized.

---

## 🖼️ Module Gallery
*A technical deep-dive into the sub-components.*

| Attendance Logs | Note Editor | CGPA Semester Entry |
| :---: | :---: | :---: |
| ![Table](./frontend/public/screenshots/attendance-1.png) | ![Editor](./frontend/public/screenshots/notes-2.png) | ![Sem Entry](./frontend/public/screenshots/cgpa1.png) |
| **History Tracking**: Detailed date-stamped logs of every class attended or missed. | **Rich Editor**: Distraction-free writing environment with subject-specific tagging. | **Grade Entry**: Streamlined interface for managing multi-semester results. |

| SGPA Breakdown | Subject Details | Predictive CGPA |
| :---: | :---: | :---: |
| ![Breakdown](./frontend/public/screenshots/cgpa2.png) | ![Subject View](./frontend/public/screenshots/atttendance-3.png) | ![Sim](./frontend/public/screenshots/cgpa4.png) |
| **Data Breakdown**: Granular view of performance metrics across your degree. | **Deep-Dive Logs**: Specific subject attendance trends and percentage health. | **Simulation Output**: Real-time projected CGPA and point-improvement metrics. |

---

## ✨ Core Features
*   **Smart Skip Calculator**: Custom algorithms for attendance safety thresholds.
*   **Predictive Simulation**: Real-time impact analysis for both attendance and CGPA.
*   **Must-Attend Counter**: Real-time recovery logic for "At Risk" subjects.
*   **Rich Organization**: Searchable, color-coded notes vault with pinning.
*   **Security First**: JWT authentication via HTTP-only cookies and XSS protection.

---

## 🛠 Tech Stack
| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **State** | React Context API |
| **Charts** | Chart.js + react-chartjs-2 |
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
