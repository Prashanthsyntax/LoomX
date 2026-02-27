def calculate_utilization(total_limit, used_credit):
    return round((used_credit / total_limit) * 100, 2)

def risk_level(score):
    if score < 600:
        return "High Risk"
    elif score < 700:
        return "Medium Risk"
    else:
        return "Low Risk"

def analyze_user(user_data):
    utilization = calculate_utilization(
        user_data["total_limit"],
        user_data["used_credit"]
    )

    return {
        "credit_score": user_data["credit_score"],
        "utilization": utilization,
        "risk_level": risk_level(user_data["credit_score"]),
        "late_payments": user_data["late_payments"],
        "credit_age": user_data["credit_age"]
    }