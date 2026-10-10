"""
Model Training Script for Diabetes Risk Prediction
Uses CDC BRFSS 2015 Health Indicators dataset to train a Random Forest Classifier and StandardScaler.
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, roc_auc_score, confusion_matrix

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "Dataset")
MODEL_DIR = os.path.join(BASE_DIR, "model")

os.makedirs(MODEL_DIR, exist_ok=True)

def find_dataset():
    """Find CSV dataset in Dataset directory."""
    csv_candidates = [
        os.path.join(DATASET_DIR, "diabetes_binary_5050split_health_indicators_BRFSS2015.csv"),
        os.path.join(DATASET_DIR, "diabetes_binary_5050split_health_indicators_BRFSS2015 2.csv"),
    ]
    for p in csv_candidates:
        if os.path.exists(p):
            return p
    
    # Check any csv in Dataset folder
    if os.path.exists(DATASET_DIR):
        for fname in os.listdir(DATASET_DIR):
            if fname.endswith(".csv"):
                return os.path.join(DATASET_DIR, fname)
    return None

def train():
    data_path = find_dataset()
    if not data_path:
        raise FileNotFoundError(f"No CSV dataset found in {DATASET_DIR}")

    print(f"[INFO] Loading dataset from {data_path}...")
    df = pd.read_csv(data_path)
    print(f"[INFO] Dataset shape: {df.shape}")

    target_col = "Diabetes_binary"
    if target_col not in df.columns:
        # Fallback to first column if name varies
        target_col = df.columns[0]

    X = df.drop(columns=[target_col])
    y = df[target_col]

    feature_names = list(X.columns)
    print(f"[INFO] Features ({len(feature_names)}): {feature_names}")
    print(f"[INFO] Class balance:\n{y.value_counts(normalize=True)}")

    # Train / Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Feature Scaling
    print("[INFO] Fitting StandardScaler...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train Random Forest
    print("[INFO] Training RandomForestClassifier (n_estimators=100)...")
    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=15,
        min_samples_split=10,
        min_samples_leaf=4,
        random_state=42,
        n_jobs=-1
    )
    clf.fit(X_train_scaled, y_train)

    # Evaluation
    y_pred = clf.predict(X_test_scaled)
    y_prob = clf.predict_proba(X_test_scaled)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_prob)

    print("\n========== MODEL EVALUATION ==========")
    print(f"Accuracy: {acc * 100:.2f}%")
    print(f"ROC-AUC:  {auc:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    print("=======================================\n")

    # Save artifacts
    model_save_path = os.path.join(MODEL_DIR, "random_forest_model.joblib")
    scaler_save_path = os.path.join(MODEL_DIR, "scaler.joblib")

    print(f"[INFO] Saving model to {model_save_path}...")
    joblib.dump(clf, model_save_path)

    print(f"[INFO] Saving scaler to {scaler_save_path}...")
    joblib.dump(scaler, scaler_save_path)

    print("[SUCCESS] Training pipeline completed and artifacts saved successfully!")

if __name__ == "__main__":
    train()
