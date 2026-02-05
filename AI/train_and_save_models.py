import os
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.impute import SimpleImputer
from xgboost import XGBClassifier

# --------------------------------------------------
# 1. Load dataset
# --------------------------------------------------
df = pd.read_csv("credit_risk_dataset.csv")

# --------------------------------------------------
# 2. Separate target and features
# --------------------------------------------------
y = df["loan_status"]
X = df.drop("loan_status", axis=1)

# --------------------------------------------------
# 3. Handle Missing Values (FEATURE ENGINEERING)
# --------------------------------------------------
num_cols = X.select_dtypes(include=["int64", "float64"]).columns
cat_cols = X.select_dtypes(include=["object"]).columns

num_imputer = SimpleImputer(strategy="median")
cat_imputer = SimpleImputer(strategy="most_frequent")

X[num_cols] = num_imputer.fit_transform(X[num_cols])
X[cat_cols] = cat_imputer.fit_transform(X[cat_cols])

# --------------------------------------------------
# 4. One-Hot Encoding
# --------------------------------------------------
X = pd.get_dummies(X, drop_first=True)

feature_names = X.columns.tolist()

# --------------------------------------------------
# 5. Train-test split
# --------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# --------------------------------------------------
# 6. Scaling (Logistic Regression only)
# --------------------------------------------------
scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# --------------------------------------------------
# 7. Train Logistic Regression
# --------------------------------------------------
log_model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced"
)

log_model.fit(X_train_scaled, y_train)

print("\nLogistic Regression Report:")
print(classification_report(y_test, log_model.predict(X_test_scaled)))

# --------------------------------------------------
# 8. Train XGBoost
# --------------------------------------------------
xgb_model = XGBClassifier(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    eval_metric="logloss"
)

xgb_model.fit(X_train, y_train)

print("\nXGBoost Report:")
print(classification_report(y_test, xgb_model.predict(X_test)))

# --------------------------------------------------
# 9. Save models & preprocessors
# --------------------------------------------------
os.makedirs("model", exist_ok=True)

joblib.dump(log_model, "model/log_model.pkl")
joblib.dump(xgb_model, "model/xgb_model.pkl")
joblib.dump(scaler, "model/scaler.pkl")
joblib.dump(feature_names, "model/feature_names.pkl")
joblib.dump(num_imputer, "model/num_imputer.pkl")
joblib.dump(cat_imputer, "model/cat_imputer.pkl")

print("\n✅ All models and preprocessors saved successfully!")
