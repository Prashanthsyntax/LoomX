def build_prompt(analysis, question):

    return f"""
You are a professional AI Credit Advisor for LoomX lending platform.

User Financial Profile:
- Credit Score: {analysis['credit_score']}
- Credit Utilization: {analysis['utilization']}%
- Risk Level: {analysis['risk_level']}
- Late Payments: {analysis['late_payments']}
- Credit Age: {analysis['credit_age']} years

User Question:
{question}

Provide:
1. Clear explanation of score
2. Actionable improvement steps
3. Estimated impact suggestions
4. Add disclaimer that no score increase is guaranteed

Keep it structured and professional.
"""