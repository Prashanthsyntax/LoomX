import React from "react";
import type { LoanRequest } from "../../types/index.ts";

interface Props {
  request: LoanRequest;
  onCheckAI: (id: string, approved: boolean) => void;
}

const RequestForm: React.FC<Props> = ({ request, onCheckAI }) => {
  const handleAIApproval = () => {
    const approved = Math.random() > 0.3; // Fake AI check
    onCheckAI(request.id, approved);
  };

  return (
    <div className="p-6 bg-black/90 border border-white/20 rounded-[36px] shadow-lg flex justify-between items-center transition">
      <div>
        <h2 className="text-xl font-bold mb-2 text-white">{request.fromUser}</h2>
        <p className="text-white/80"><strong>Status:</strong> {request.status}</p>
        <p className="text-white/80"><strong>Loan Amount:</strong> ${request.customer.loan_amnt}</p>
        <p className="text-white/80"><strong>Intent:</strong> {request.customer.loan_intent}</p>
      </div>

      {request.status === "pending" && (
        <button
          onClick={handleAIApproval}
          className="px-4 py-2 bg-black border border-white/30 hover:bg-green-600 text-white font-semibold rounded-[24px] shadow-md transition transform hover:scale-105"
        >
          Check AI Eligibility
        </button>
      )}
    </div>
  );
};

export default RequestForm;