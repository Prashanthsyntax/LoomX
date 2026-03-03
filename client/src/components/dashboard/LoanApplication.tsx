import React, { useState } from "react";
import axios from "axios";
import type { RawCustomer } from "../../types/index.ts";

interface Props {
  currentUser: string;
}

const LoanApplication: React.FC<Props> = ({}) => {
  const [form, setForm] = useState<RawCustomer>({
    person_age: 0,
    person_income: 0,
    person_home_ownership: "",
    person_emp_length: 0,
    loan_intent: "",
    loan_grade: "",
    loan_amnt: 0,
    loan_int_rate: 0,
    loan_percent_income: 0,
    cb_person_default_on_file: "",
    cb_person_cred_hist_length: 0,
  });

  const [toUserEmail, setToUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: isNaN(Number(value)) ? value : Number(value) });
  };

  const handleSubmit = async () => {
    if (!toUserEmail) return alert("Please enter lender email");

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:4000/api/loan/apply",
        {
          toUserEmail,
          customerData: form,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      alert("🚀 Loan Request Sent Successfully!");
      setToUserEmail("");
    } catch (error: any) {
      alert(error.response?.data?.message || "Error sending request");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "bg-black border border-white/20 text-white rounded-2xl px-4 py-3 w-full focus:ring-2 focus:ring-white focus:border-white placeholder-white/50 transition";
  const labelClass = "text-white text-sm font-semibold mb-1";

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="p-10 bg-black rounded-[36px] shadow-2xl max-w-4xl w-full text-white border border-white/10">
        <h2 className="text-4xl font-extrabold mb-10 text-white text-center">
          💼 Loan Application
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Age */}
          <div>
            <label className={labelClass}>Age</label>
            <input
              name="person_age"
              type="number"
              value={form.person_age || ""}
              placeholder="Enter age"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Income */}
          <div>
            <label className={labelClass}>Income</label>
            <input
              name="person_income"
              type="number"
              value={form.person_income || ""}
              placeholder="Enter income"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Home Ownership */}
          <div>
            <label className={labelClass}>Home Ownership</label>
            <select
              name="person_home_ownership"
              value={form.person_home_ownership || ""}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select</option>
              <option value="RENT">Rent</option>
              <option value="OWN">Own</option>
              <option value="MORTGAGE">Mortgage</option>
            </select>
          </div>

          {/* Employment */}
          <div>
            <label className={labelClass}>Employment Years</label>
            <input
              name="person_emp_length"
              type="number"
              value={form.person_emp_length || ""}
              placeholder="Years of employment"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Loan Intent */}
          <div>
            <label className={labelClass}>Loan Intent</label>
            <input
              name="loan_intent"
              type="text"
              value={form.loan_intent || ""}
              placeholder="e.g. Education, Medical"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Loan Grade */}
          <div>
            <label className={labelClass}>Loan Grade</label>
            <input
              name="loan_grade"
              type="text"
              value={form.loan_grade || ""}
              placeholder="e.g. A, B, C"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Amount */}
          <div>
            <label className={labelClass}>Amount</label>
            <input
              name="loan_amnt"
              type="number"
              value={form.loan_amnt || ""}
              placeholder="Enter amount"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Interest Rate */}
          <div>
            <label className={labelClass}>Interest Rate (%)</label>
            <input
              name="loan_int_rate"
              type="number"
              value={form.loan_int_rate || ""}
              placeholder="Enter interest rate"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Loan Percent Income */}
          <div>
            <label className={labelClass}>Loan Percent of Income</label>
            <input
              name="loan_percent_income"
              type="number"
              value={form.loan_percent_income || ""}
              placeholder="e.g. 0.2 for 20%"
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Default On File */}
          <div>
            <label className={labelClass}>Default On File</label>
            <select
              name="cb_person_default_on_file"
              value={form.cb_person_default_on_file || ""}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>

          {/* Credit History */}
          <div>
            <label className={labelClass}>Credit History Length</label>
            <input
              name="cb_person_cred_hist_length"
              type="number"
              value={form.cb_person_cred_hist_length || ""}
              placeholder="Years of credit history"
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* Send To User (EMAIL) */}
        <div className="mt-8">
          <label className={labelClass}>Send To Lender Email</label>
          <input
            type="email"
            value={toUserEmail}
            onChange={(e) => setToUserEmail(e.target.value)}
            placeholder="loomx@example.com"
            className={inputClass}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-10 w-full bg-black hover:bg-gray-900 border border-white/20 text-white font-bold py-4 rounded-[36px] shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Submit Request"}
        </button>
      </div>
    </div>
  );
};

export default LoanApplication;
