from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# --------------------------------------------------
# Load models & preprocessors
# --------------------------------------------------
print("Loading AI models...")

log_model = joblib.load("model/log_model.pkl")
xgb_model = joblib.load("model/xgb_model.pkl")
scaler = joblib.load("model/scaler.pkl")
feature_names = joblib.load("model/feature_names.pkl")
num_imputer = joblib.load("model/num_imputer.pkl")
cat_imputer = joblib.load("model/cat_imputer.pkl")

print("Models loaded successfully!")

# --------------------------------------------------
# Health Check Route
# --------------------------------------------------
@app.route("/")
def home():
    return jsonify({
        "message": "LoomX AI Loan Risk API Running"
    })


# --------------------------------------------------
# Prediction Endpoint
# --------------------------------------------------
@app.route("/api/ai/predict", methods=["POST"])
def predict():

    try:
        data = request.json

        if not data:
            return jsonify({"error": "No JSON data received"}), 400

        # --------------------------------------------------
        # 1. Raw customer profile
        # --------------------------------------------------
        raw_customer = {
            "person_age": data.get("person_age", 30),
            "person_income": data.get("person_income", 60000),
            "person_home_ownership": data.get("person_home_ownership", "RENT"),
            "person_emp_length": data.get("person_emp_length", 5),
            "loan_intent": data.get("loan_intent", "MEDICAL"),
            "loan_grade": data.get("loan_grade", "C"),
            "loan_amnt": data.get("loan_amnt", 15000),
            "loan_int_rate": data.get("loan_int_rate", float(data.get("interest", 10))),
            "loan_percent_income": data.get("loan_percent_income", 0.25),
            "cb_person_default_on_file": data.get("cb_person_default_on_file", "N"),
            "cb_person_cred_hist_length": data.get("cb_person_cred_hist_length", 6),
        }

        df_raw = pd.DataFrame([raw_customer])

        # --------------------------------------------------
        # 2. Apply imputers
        # --------------------------------------------------
        num_cols = df_raw.select_dtypes(include=["int64", "float64"]).columns
        cat_cols = df_raw.select_dtypes(include=["object", "string"]).columns

        df_raw[num_cols] = num_imputer.transform(df_raw[num_cols])
        df_raw[cat_cols] = cat_imputer.transform(df_raw[cat_cols])

        # --------------------------------------------------
        # 3. One-hot encoding
        # --------------------------------------------------
        df_encoded = pd.get_dummies(df_raw, drop_first=True)

        # --------------------------------------------------
        # 4. Align with training features
        # --------------------------------------------------
        df_final = pd.DataFrame(0, index=[0], columns=feature_names)

        for col in df_encoded.columns:
            if col in df_final.columns:
                df_final[col] = df_encoded[col]

        # --------------------------------------------------
        # 5. Predictions
        # --------------------------------------------------
        log_pred = log_model.predict(scaler.transform(df_final))[0]
        xgb_pred = xgb_model.predict(df_final)[0]

        print("Logistic Prediction:", log_pred)
        print("XGBoost Prediction:", xgb_pred)

        # --------------------------------------------------
        # 6. Decision Logic
        # --------------------------------------------------
        eligible = (log_pred == 0 and xgb_pred == 0)

        score = 850 if eligible else 520
        decision = "approved" if eligible else "rejected"

        response = {
            "decision": decision,
            "risk_score": score,
            "risk": "SAFE" if eligible else "RISKY",
            "reason": None if eligible else "High default probability detected by AI"
        }

        return jsonify(response)

    except Exception as e:
        print("Prediction Error:", str(e))
        return jsonify({"error": str(e)}), 500


# --------------------------------------------------
# Run Server
# --------------------------------------------------
if __name__ == "__main__":
    print("Starting LoomX AI Server...")
    app.run(host="0.0.0.0", port=5000, debug=True)