
# 🩺 Diabetes Risk Prediction Microservice & Full-Stack System

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![scikit-learn](https://img.shields.io/badge/scikit_learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)

An end-to-end, full-stack healthcare application and machine learning microservice that predicts diabetes risk levels based on **21 BRFSS CDC health indicators**. 

The system utilizes a **Random Forest Classifier** served via **FastAPI**, backed by a **Node.js/Express** REST API for user authentication and clinical record history, and an interactive **React + Vite** frontend.

✨ Key Features
---
1.Machine Learning Engine: Trained Random Forest model utilizing standard scaling (StandardScaler) to analyze physiological, lifestyle, and demographic data.

2.Interactive Questionnaire: Multi-step CDC health survey featuring live BMI calculations, tooltips for medical parameters, and real-time validation.

3.Risk Assessment Breakdown: Immediate diagnostic feedback categorizing risk into Low, Moderate, or High, complete with probability scores.

4.Clinical History Audit: Patient screening history persisted in MongoDB with JWT-based authentication.

5.Robust API Validation: Strict schema enforcement using Pydantic in FastAPI and Mongoose in Express.


---

## 🏗️ System Architecture

```
diabetes-prediction-system/
├── ml-service/              # FastAPI ML Microservice
│   ├── app.py               # REST API endpoints & Pydantic validation
│   ├── train.py             # Reproducible model training script
│   ├── requirements.txt     # Python dependencies
│   └── model/               # Serialized model & scaler (.joblib)
├── backend/                 # Node.js + Express REST API
│   ├── server.js            # Express server entry point
│   ├── config/              # MongoDB connection setup
│   ├── controllers/         # Auth & Screening controllers
│   ├── models/              # User & DiabetesRecord Mongoose schemas
│   └── routes/              # Express API routes
└── frontend/                # React + Vite Frontend Client
    ├── src/
    │   ├── components/      # UI components & form wizards
    │   ├── pages/           # AssessRisk, Dashboard, Auth pages
    │   └── services/        # Axios API client setup
    └── package.json
```
---

## Tech Stack
Frontend Development: React.js, Vite, Form validation, Responsive UI/UX, Dynamic Data Visualization.

Backend Development: Node.js, Express.js, REST APIs, MongoDB, Mongoose, JWT Authentication, CORS middleware.

Machine Learning / Python: Scikit-Learn (Random Forest), Pandas, NumPy, StandardScaler, Joblib, FastAPI, Pydantic, Uvicorn.

## Run Locally

Clone the project

```bash
  git clone https://github.com/FarhanJMI2dev/DiaPredict.git
```

Install dependencies and Run

```bash
  cd ../Frontend 
  npm install 
  npm run dev
```



```bash
  cd ../Backend
  npm install
  npm run dev
```



```bash
  cd ML-Service
  # Create and activate virtual environment
   python -m venv .venv
   source .venv/bin/activate
```

