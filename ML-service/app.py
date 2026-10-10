"""
FastAPI Diabetes Prediction Microservice
Trained on CDC BRFSS Health Indicators Dataset using Random Forest Classifier & StandardScaler.
"""

import os
import warnings
warnings.filterwarnings("ignore", category=UserWarning)

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import joblib
import numpy as np
import pandas as pd
from datetime import datetime

# Initialize FastAPI App
app = FastAPI(
    title="Diabetes Prediction Microservice",
    description="High-performance machine learning API powered by Random Forest & Scikit-Learn to assess diabetes risk based on 21 CDC BRFSS health indicators.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend and backend consumers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local and cross-origin development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base Paths for Artifacts
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "model")

# File search priority
PRIMARY_MODEL_PATH = os.path.join(MODEL_DIR, "random_forest_model.joblib")
FALLBACK_MODEL_PATH = os.path.join(MODEL_DIR, "random_forest_model (1).joblib")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.joblib")

# Global containers for loaded artifacts
model = None
scaler = None
feature_names = [
    "HighBP", "HighChol", "CholCheck", "BMI", "Smoker", "Stroke",
    "HeartDiseaseorAttack", "PhysActivity", "Fruits", "Veggies",
    "HvyAlcoholConsump", "AnyHealthcare", "NoDocbcCost", "GenHlth",
    "MentHlth", "PhysHlth", "DiffWalk", "Sex", "Age", "Education", "Income"
]

@app.on_event("startup")
def load_ml_artifacts():
    """Load the trained machine learning model and scaler on startup."""
    global model, scaler, feature_names
    
    # 1. Load Model
    model_path = PRIMARY_MODEL_PATH if os.path.exists(PRIMARY_MODEL_PATH) else FALLBACK_MODEL_PATH
    if not os.path.exists(model_path):
        print(f"[WARNING] Model file not found at {model_path}")
    else:
        try:
            model = joblib.load(model_path)
            print(f"[INFO] Successfully loaded Random Forest model from {model_path}")
            if hasattr(model, "feature_names_in_"):
                feature_names = list(model.feature_names_in_)
        except Exception as e:
            print(f"[ERROR] Failed to load model: {str(e)}")

    # 2. Load Scaler
    if os.path.exists(SCALER_PATH):
        try:
            scaler = joblib.load(SCALER_PATH)
            print(f"[INFO] Successfully loaded StandardScaler from {SCALER_PATH}")
        except Exception as e:
            print(f"[ERROR] Failed to load scaler: {str(e)}")
    else:
        print(f"[WARNING] Scaler file not found at {SCALER_PATH}. Predictions will run unscaled.")


# ==========================================
# Pydantic Schemas for Input / Output Validation
# ==========================================

class DiabetesInputFeatures(BaseModel):
    HighBP: float = Field(..., ge=0.0, le=1.0, description="0 = No high BP, 1 = High BP", json_schema_extra={"example": 1.0})
    HighChol: float = Field(..., ge=0.0, le=1.0, description="0 = No high cholesterol, 1 = High cholesterol", json_schema_extra={"example": 1.0})
    CholCheck: float = Field(..., ge=0.0, le=1.0, description="0 = No cholesterol check in 5 yrs, 1 = Yes", json_schema_extra={"example": 1.0})
    BMI: float = Field(..., ge=10.0, le=99.0, description="Body Mass Index (e.g. 28.5)", json_schema_extra={"example": 28.0})
    Smoker: float = Field(..., ge=0.0, le=1.0, description="Have smoked >= 100 cigarettes in lifetime: 0 = No, 1 = Yes", json_schema_extra={"example": 0.0})
    Stroke: float = Field(..., ge=0.0, le=1.0, description="Ever told you had a stroke: 0 = No, 1 = Yes", json_schema_extra={"example": 0.0})
    HeartDiseaseorAttack: float = Field(..., ge=0.0, le=1.0, description="Coronary heart disease or MI: 0 = No, 1 = Yes", json_schema_extra={"example": 0.0})
    PhysActivity: float = Field(..., ge=0.0, le=1.0, description="Physical activity in past 30 days: 0 = No, 1 = Yes", json_schema_extra={"example": 1.0})
    Fruits: float = Field(..., ge=0.0, le=1.0, description="Consume fruit >= 1/day: 0 = No, 1 = Yes", json_schema_extra={"example": 1.0})
    Veggies: float = Field(..., ge=0.0, le=1.0, description="Consume veggies >= 1/day: 0 = No, 1 = Yes", json_schema_extra={"example": 1.0})
    HvyAlcoholConsump: float = Field(..., ge=0.0, le=1.0, description="Heavy alcohol consumption: 0 = No, 1 = Yes", json_schema_extra={"example": 0.0})
    AnyHealthcare: float = Field(..., ge=0.0, le=1.0, description="Have health care coverage: 0 = No, 1 = Yes", json_schema_extra={"example": 1.0})
    NoDocbcCost: float = Field(..., ge=0.0, le=1.0, description="Could not see doctor due to cost: 0 = No, 1 = Yes", json_schema_extra={"example": 0.0})
    GenHlth: float = Field(..., ge=1.0, le=5.0, description="General health (1=Excellent, 2=Very Good, 3=Good, 4=Fair, 5=Poor)", json_schema_extra={"example": 3.0})
    MentHlth: float = Field(..., ge=0.0, le=30.0, description="Days of poor mental health (0-30)", json_schema_extra={"example": 2.0})
    PhysHlth: float = Field(..., ge=0.0, le=30.0, description="Days of physical illness/injury (0-30)", json_schema_extra={"example": 3.0})
    DiffWalk: float = Field(..., ge=0.0, le=1.0, description="Serious difficulty walking/climbing stairs: 0 = No, 1 = Yes", json_schema_extra={"example": 0.0})
    Sex: float = Field(..., ge=0.0, le=1.0, description="0 = Female, 1 = Male", json_schema_extra={"example": 1.0})
    Age: float = Field(..., ge=1.0, le=13.0, description="Age group: 1=18-24, ..., 9=60-64, 13=80+", json_schema_extra={"example": 8.0})
    Education: float = Field(..., ge=1.0, le=6.0, description="Education level (1-6 scale)", json_schema_extra={"example": 5.0})
    Income: float = Field(..., ge=1.0, le=8.0, description="Income level (1-8 scale, 8 >= $75k)", json_schema_extra={"example": 6.0})


class PredictionResult(BaseModel):
    prediction: int = Field(..., description="0 = Negative / Low Risk, 1 = Positive / High Risk")
    outcome: str = Field(..., description="Human readable diagnosis outcome")
    risk_score_percentage: float = Field(..., description="Estimated probability percentage of diabetes risk (0.0% to 100.0%)")
    risk_level: str = Field(..., description="Risk tier: Low, Moderate, High, or Critical")
    key_risk_factors: List[str] = Field(default_factory=list, description="Identified risk factors contributing to score")
    recommendations: List[str] = Field(default_factory=list, description="Clinically oriented preventive suggestions")
    timestamp: str


class BatchPredictionRequest(BaseModel):
    records: List[DiabetesInputFeatures]


class BatchPredictionResponse(BaseModel):
    total_processed: int
    results: List[PredictionResult]


def extract_risk_factors(data: DiabetesInputFeatures) -> List[str]:
    """Identify key lifestyle and clinical indicators that elevate risk."""
    factors = []
    if data.HighBP == 1.0:
        factors.append("Hypertension (High Blood Pressure)")
    if data.HighChol == 1.0:
        factors.append("High Blood Cholesterol")
    if data.BMI >= 30.0:
        factors.append(f"High Body Mass Index ({data.BMI} - Obese Category)")
    elif data.BMI >= 25.0:
        factors.append(f"Elevated Body Mass Index ({data.BMI} - Overweight Category)")
    if data.Smoker == 1.0:
        factors.append("History of Smoking (>= 100 cigarettes)")
    if data.PhysActivity == 0.0:
        factors.append("Sedentary Lifestyle (No regular physical activity)")
    if data.HeartDiseaseorAttack == 1.0:
        factors.append("Pre-existing Coronary Heart Disease or Myocardial Infarction")
    if data.Stroke == 1.0:
        factors.append("History of Stroke")
    if data.GenHlth >= 4.0:
        factors.append("Fair/Poor self-reported general health")
    if data.Age >= 8.0:
        factors.append("Age >= 55 years")
    if data.DiffWalk == 1.0:
        factors.append("Mobility limitations (Difficulty walking/stairs)")
    return factors


def generate_recommendations(risk_level: str, factors: List[str]) -> List[str]:
    """Generate personalized medical and lifestyle advice."""
    advice = []
    if risk_level in ["High", "Critical"]:
        advice.append("Schedule a comprehensive screening (HbA1c & Fasting Blood Glucose) with your primary physician.")
        advice.append("Consult with a certified diabetes educator or registered dietitian for tailored medical nutrition therapy.")
    elif risk_level == "Moderate":
        advice.append("Consider annual blood glucose checkups to monitor pre-diabetes status.")
        advice.append("Adopt moderate daily aerobic exercise (at least 150 minutes per week).")
    else:
        advice.append("Maintain your healthy routine, balanced diet, and active lifestyle.")

    if any("Hypertension" in f for f in factors):
        advice.append("Monitor blood pressure regularly and limit dietary sodium intake.")
    if any("Cholesterol" in f for f in factors):
        advice.append("Follow a heart-healthy lipid management plan with fiber-rich nutrition.")
    if any("Body Mass Index" in f for f in factors):
        advice.append("Aim for a 5-10% gradual body weight reduction through caloric deficit and resistance training.")
    if any("Sedentary" in f for f in factors):
        advice.append("Incorporate 30 minutes of daily brisk walking or recreational sports.")
    
    return advice


# ==========================================
# REST API Endpoints
# ==========================================

@app.get("/", tags=["General"])
def root():
    """Root metadata endpoint."""
    return {
        "service": "Diabetes Risk Assessment Microservice",
        "framework": "FastAPI",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
        "endpoints": {
            "health": "/health",
            "model_info": "/model-info",
            "predict": "/predict",
            "predict_batch": "/predict-batch",
            "docs": "/docs"
        },
        "docs": "/docs",
        "status": "online"
    }


@app.get("/health", tags=["Health"])
def health():
    """Health check endpoint for Docker, Kubernetes, or Backend proxy."""
    if model is None:
        return {
            "status": "degraded",
            "message": "Model artifacts are not loaded into memory.",
            "model_ready": False
        }
    return {
        "status": "healthy",
        "model_ready": True,
        "scaler_ready": scaler is not None,
        "features_count": len(feature_names),
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/model-info", tags=["Metadata"])
def get_model_info():
    """Returns technical metadata about the trained model and expected features."""
    if model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model is not currently loaded."
        )
    
    return {
        "model_type": str(type(model).__name__),
        "expected_features_count": len(feature_names),
        "feature_names": feature_names,
        "scaler_applied": scaler is not None,
        "scaler_type": str(type(scaler).__name__) if scaler else None,
        "classes": getattr(model, "classes_", [0, 1]).tolist() if hasattr(model, "classes_") else [0, 1],
        "n_estimators": getattr(model, "n_estimators", "N/A"),
        "max_depth": getattr(model, "max_depth", "N/A")
    }


@app.post("/predict", response_model=PredictionResult, tags=["Inference"])
def predict(data: DiabetesInputFeatures):
    """
    Perform a single patient diabetes risk prediction.
    Accepts 21 CDC BRFSS clinical and lifestyle indicators.
    """
    if model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Machine learning model is not available. Ensure model artifacts exist in the 'model/' directory."
        )
    
    # 1. Format features in the exact feature ordering expected by the model
    input_dict = data.model_dump()
    features_ordered = [input_dict[name] for name in feature_names]
    input_df = pd.DataFrame([features_ordered], columns=feature_names)

    # 2. Scale features if scaler is present
    if scaler is not None:
        try:
            scaled_array = scaler.transform(input_df)
            processed_df = pd.DataFrame(scaled_array, columns=feature_names)
        except Exception:
            processed_df = input_df
    else:
        processed_df = input_df

    # 3. Predict class and probability
    try:
        raw_pred = model.predict(processed_df)[0]
        prediction_class = int(raw_pred)
        
        # Calculate risk probability
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(processed_df)[0]
            # Class 1 is diabetes positive
            prob_diabetes = float(probabilities[1]) if len(probabilities) > 1 else float(probabilities[0])
        else:
            prob_diabetes = 1.0 if prediction_class == 1 else 0.0
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference execution failed: {str(e)}"
        )

    # 4. Determine Risk Category
    risk_percentage = round(prob_diabetes * 100, 2)
    if risk_percentage < 25.0:
        risk_level = "Low"
        outcome = "Low Risk of Diabetes"
    elif risk_percentage < 55.0:
        risk_level = "Moderate"
        outcome = "Moderate Risk / Pre-Diabetes Indicators"
    elif risk_percentage < 80.0:
        risk_level = "High"
        outcome = "High Risk of Diabetes"
    else:
        risk_level = "Critical"
        outcome = "Critical Risk of Diabetes"

    risk_factors = extract_risk_factors(data)
    recommendations = generate_recommendations(risk_level, risk_factors)

    return PredictionResult(
        prediction=prediction_class,
        outcome=outcome,
        risk_score_percentage=risk_percentage,
        risk_level=risk_level,
        key_risk_factors=risk_factors,
        recommendations=recommendations,
        timestamp=datetime.utcnow().isoformat()
    )


@app.post("/predict-batch", response_model=BatchPredictionResponse, tags=["Inference"])
def predict_batch(batch_data: BatchPredictionRequest):
    """
    Perform batch diabetes risk predictions for multiple patient records.
    """
    if model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Machine learning model is not available."
        )
    
    results = [predict(item) for item in batch_data.records]
    return BatchPredictionResponse(
        total_processed=len(results),
        results=results
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
