import React, { useState } from "react";
import LoanApplication from "../../components/dashboard/LoanApplication";
import RequestForm from "../../components/dashboard/RequestForm";

interface Props {
  currentUser: string;
}

const BankingOp: React.FC<Props> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<"loan" | "requests">("loan");

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      {/* Tabs */}
      <div className="flex items-center gap-2 bg-black/40 border border-white/20 rounded-xl p-1 w-fit mb-6">
        <button
          onClick={() => setActiveTab("loan")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "loan"
              ? "bg-white/10 text-white"
              : "text-white/60 hover:bg-white/5 hover:text-white"
          }`}
        >
          Loan Application
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "requests"
              ? "bg-white/10 text-white"
              : "text-white/60 hover:bg-white/5 hover:text-white"
          }`}
        >
          Requests
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "loan" && (
        <LoanApplication currentUser={currentUser} />
      )}

      {activeTab === "requests" && <RequestForm />}
    </div>
  );
};

export default BankingOp;