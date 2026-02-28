import React, { useState } from "react";
import type { LoanRequest, RawCustomer } from "../../types/index.ts";
import LoanApplication from "../../components/dashboard/LoanApplication";
import RequestForm from "../../components/dashboard/RequestForm";

interface Props {
  currentUser: string;
}

// Dummy data for preview
const dummyRequests: LoanRequest[] = [
  {
    id: "1",
    fromUser: "Alice",
    toUser: "BankAI",
    customer: {
      person_age: 28,
      person_income: 50000,
      person_home_ownership: "RENT",
      person_emp_length: 3,
      loan_intent: "EDUCATION",
      loan_grade: "B",
      loan_amnt: 10000,
      loan_int_rate: 8,
      loan_percent_income: 0.2,
      cb_person_default_on_file: "N",
      cb_person_cred_hist_length: 4,
    } as RawCustomer,
    status: "pending",
  },
  {
    id: "2",
    fromUser: "Bob",
    toUser: "BankAI",
    customer: {
      person_age: 35,
      person_income: 75000,
      person_home_ownership: "OWN",
      person_emp_length: 10,
      loan_intent: "MEDICAL",
      loan_grade: "C",
      loan_amnt: 20000,
      loan_int_rate: 12,
      loan_percent_income: 0.25,
      cb_person_default_on_file: "Y",
      cb_person_cred_hist_length: 8,
    } as RawCustomer,
    status: "pending",
  },
];

const BankingOp: React.FC<Props> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<"loan" | "requests">("loan");
  const [requests, setRequests] = useState<LoanRequest[]>(dummyRequests);

  const handleNewRequest = (request: LoanRequest) => {
    setRequests([...requests, request]);
  };

  const handleAIApproval = (id: string, approved: boolean) => {
    setRequests(
      requests.map(r =>
        r.id === id ? { ...r, status: approved ? "approved" : "rejected" } : r
      )
    );
  };

  const userRequests = requests.filter(r => r.toUser === currentUser);

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      {/* Tabs */}
      <div className="flex items-center gap-2 bg-black/40 border border-white/20 rounded-xl p-1 w-fit mb-6">
        <button
          onClick={() => setActiveTab("loan")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "loan" ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
        >
          Loan Application
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "requests" ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
        >
          Requests
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "loan" && <LoanApplication onSubmit={handleNewRequest} currentUser={currentUser} />}

      {activeTab === "requests" && (
        <div className="space-y-4">
          {userRequests.length === 0 ? (
            <p className="text-white/50 text-center mt-10">No requests yet.</p>
          ) : (
            userRequests.map(req => <RequestForm key={req.id} request={req} onCheckAI={handleAIApproval} />)
          )}
        </div>
      )}
    </div>
  );
};

export default BankingOp;