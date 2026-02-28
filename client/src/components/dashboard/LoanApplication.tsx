import React, { useState } from "react";
import type { RawCustomer, LoanRequest } from "../../types/index.ts";

interface Props {
  onSubmit: (request: LoanRequest) => void;
  currentUser: string;
}

const LoanApplication: React.FC<Props> = ({ onSubmit, currentUser }) => {
  const [form, setForm] = useState<RawCustomer>({
    person_age: 30,
    person_income: 60000,
    person_home_ownership: "RENT",
    person_emp_length: 5,
    loan_intent: "MEDICAL",
    loan_grade: "C",
    loan_amnt: 15000,
    loan_int_rate: 10,
    loan_percent_income: 0.25,
    cb_person_default_on_file: "N",
    cb_person_cred_hist_length: 6,
  });
  const [toUser, setToUser] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: isNaN(Number(value)) ? value : Number(value) });
  };

  const handleSubmit = () => {
    if (!toUser) return alert("Please select the user to send request");
    const request: LoanRequest = {
      id: Date.now().toString(),
      fromUser: currentUser,
      toUser,
      customer: form,
      status: "pending",
    };
    onSubmit(request);
    alert("🚀 Loan Request Sent!");
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
              value={form.person_age}
              onChange={handleChange}
              placeholder="Enter Age"
              className={inputClass}
            />
          </div>

          {/* Income */}
          <div>
            <label className={labelClass}>Income</label>
            <input
              name="person_income"
              type="number"
              value={form.person_income}
              onChange={handleChange}
              placeholder="Annual Income"
              className={inputClass}
            />
          </div>

          {/* Home Ownership */}
          <div>
            <label className={labelClass}>Home Ownership</label>
            <select
              name="person_home_ownership"
              value={form.person_home_ownership}
              onChange={handleChange}
              className={inputClass + " appearance-none"}
            >
              <option value="RENT">Rent</option>
              <option value="OWN">Own</option>
              <option value="MORTGAGE">Mortgage</option>
            </select>
          </div>

          {/* Employment Years */}
          <div>
            <label className={labelClass}>Employment Years</label>
            <input
              name="person_emp_length"
              type="number"
              value={form.person_emp_length}
              onChange={handleChange}
              placeholder="Years of Employment"
              className={inputClass}
            />
          </div>

          {/* Loan Intent */}
          <div>
            <label className={labelClass}>Loan Intent</label>
            <input
              name="loan_intent"
              type="text"
              value={form.loan_intent}
              onChange={handleChange}
              placeholder="Purpose of Loan"
              className={inputClass}
            />
          </div>

          {/* Loan Grade */}
          <div>
            <label className={labelClass}>Loan Grade</label>
            <input
              name="loan_grade"
              type="text"
              value={form.loan_grade}
              onChange={handleChange}
              placeholder="Loan Grade (A-F)"
              className={inputClass}
            />
          </div>

          {/* Loan Amount */}
          <div>
            <label className={labelClass}>Amount</label>
            <input
              name="loan_amnt"
              type="number"
              value={form.loan_amnt}
              onChange={handleChange}
              placeholder="Loan Amount"
              className={inputClass}
            />
          </div>

          {/* Interest Rate */}
          <div>
            <label className={labelClass}>Interest Rate (%)</label>
            <input
              name="loan_int_rate"
              type="number"
              value={form.loan_int_rate}
              onChange={handleChange}
              placeholder="Interest Rate"
              className={inputClass}
            />
          </div>
        </div>

        {/* Send To User */}
        <div className="mt-8">
          <label className={labelClass}>Send To User</label>
          <input
            type="text"
            value={toUser}
            onChange={(e) => setToUser(e.target.value)}
            placeholder="Recipient Username"
            className={inputClass}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-10 w-full bg-black hover:bg-gray-900 border border-white/20 text-white font-bold py-4 rounded-[36px] shadow-lg transition-all transform hover:scale-105"
        >
          Submit Request
        </button>
      </div>
    </div>
  );
};

export default LoanApplication;
