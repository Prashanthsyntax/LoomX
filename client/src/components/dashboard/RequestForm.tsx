import React, { useEffect, useState } from "react";
import axios from "axios";

interface LoanRequest {
  _id: string;
  borrowerEmail: string;
  lenderEmail: string;
  person_age: number;
  person_income: number;
  person_home_ownership: string;
  person_emp_length: number;
  loan_intent: string;
  loan_grade: string;
  loan_amnt: number;
  loan_int_rate: number;
  loan_percent_income: number;
  cb_person_default_on_file: string;
  cb_person_cred_hist_length: number;
  status: "pending" | "approved" | "rejected" | "ai_review";
  aiDecision?: "approved" | "rejected";
  aiRiskScore?: number;
  confirmTransfer?: boolean; // <-- new
}

const RequestForm: React.FC = () => {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/loan/requests");
        setRequests(res.data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAIEligibility = async (loanId: string) => {
    try {
      setProcessingId(loanId);
      const res = await axios.post(
        `http://localhost:4000/api/loan/${loanId}/check-ai`
      );
      const updatedLoan: LoanRequest = res.data;

      setRequests((prev) =>
        prev.map((r) => (r._id === loanId ? updatedLoan : r))
      );
    } catch (error) {
      console.error("AI check failed:", error);
      alert("AI check failed. Try again.");
    } finally {
      setProcessingId(null);
    }
  };

  // Step 2: user confirms transfer
  const handleConfirmTransfer = (loanId: string) => {
    setRequests((prev) =>
      prev.map((loan) =>
        loan._id === loanId ? { ...loan, confirmTransfer: true } : loan
      )
    );
  };

  // Final blockchain transfer
  const handleTransfer = async (loan: LoanRequest) => {
    if (!loan.aiRiskScore) {
      alert("AI Score not available. Cannot transfer.");
      return;
    }

    try {
      setProcessingId(loan._id);
      const res = await axios.post("http://localhost:4000/api/loan/approve-loan", {
        borrower: loan.borrowerEmail,
        interest: loan.loan_int_rate,
        aiScore: loan.aiRiskScore,
      });

      if (res.data.success) {
        alert(`Transfer successful! TxHash: ${res.data.txHash}`);
        setRequests((prev) =>
          prev.map((r) =>
            r._id === loan._id ? { ...r, status: "approved", confirmTransfer: false } : r
          )
        );
      }
    } catch (err: any) {
      console.error("Transfer failed:", err);
      alert(err.response?.data?.error || "Transfer failed");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-black p-10">
      {requests.length === 0 ? (
        <p className="text-white text-center">No loan requests</p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {requests.map((loan) => {
            let statusColor = "text-white";
            if (loan.status === "approved") statusColor = "text-green-500";
            else if (loan.status === "rejected") statusColor = "text-red-500";
            else if (loan.status === "ai_review") statusColor = "text-yellow-400";

            return (
              <div
                key={loan._id}
                className="p-6 bg-black/90 border border-white/20 rounded-[36px] shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center transition"
              >
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-bold mb-2 text-white">
                    {loan.borrowerEmail}
                  </h2>
                  <p className={`font-semibold ${statusColor}`}>
                    Status: {loan.status.toUpperCase()}
                  </p>

                  {loan.aiDecision && (
                    <p className="text-white/80 mt-2">
                      AI Decision:{" "}
                      <span
                        className={
                          loan.aiDecision === "approved"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {loan.aiDecision.toUpperCase()}
                      </span>{" "}
                      {loan.aiRiskScore && `(Score: ${loan.aiRiskScore})`}
                    </p>
                  )}

                  <p className="text-white/80">
                    <strong>Loan Amount:</strong> ${loan.loan_amnt}
                  </p>

                  <p className="text-white/80">
                    <strong>Intent:</strong> {loan.loan_intent}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Step 1: Check AI */}
                  {loan.status === "pending" && (
                    <button
                      onClick={() => handleAIEligibility(loan._id)}
                      disabled={processingId === loan._id}
                      className={`px-4 py-2 font-semibold rounded-[24px] shadow-md transition transform hover:scale-105 ${
                        processingId === loan._id
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-black border border-white/30 hover:bg-green-600 text-white"
                      }`}
                    >
                      {processingId === loan._id ? "Checking AI..." : "Check AI Eligibility"}
                    </button>
                  )}

                  {/* Step 2: Confirm transfer */}
                  {loan.aiDecision === "approved" &&
                    loan.status !== "approved" &&
                    !loan.confirmTransfer && (
                      <button
                        onClick={() => handleConfirmTransfer(loan._id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-[24px] shadow-md transition transform hover:scale-105"
                      >
                        Confirm Transfer
                      </button>
                    )}

                  {/* Step 3: Final transfer */}
                  {loan.aiDecision === "approved" && loan.confirmTransfer && (
                    <button
                      onClick={() => handleTransfer(loan)}
                      disabled={processingId === loan._id}
                      className={`px-4 py-2 font-semibold rounded-[24px] shadow-md transition transform hover:scale-105 ${
                        processingId === loan._id
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {processingId === loan._id ? "Processing..." : "Transfer Amount"}
                    </button>
                  )}

                  {loan.aiDecision === "rejected" && (
                    <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-[24px] shadow-md cursor-not-allowed">
                      Risky - Cannot Transfer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RequestForm;