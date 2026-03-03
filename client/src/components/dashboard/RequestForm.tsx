import React, { useEffect, useState } from "react";
import axios from "axios";

// Backend LoanRequest interface
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
  status: "pending" | "approved" | "rejected";
}

const RequestForm: React.FC = () => {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/loan/requests"
        );

        console.log("DB DATA:", res.data);
        setRequests(res.data);
      } catch (error) {
        console.error("Error fetching requests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAIApproval = (id: string) => {
    const approved = Math.random() > 0.3; // Fake AI check
    setRequests((prev) =>
      prev.map((req) =>
        req._id === id
          ? { ...req, status: approved ? "approved" : "rejected" }
          : req
      )
    );
  };

  if (loading)
    return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-black p-10">

      {requests.length === 0 ? (
        <p className="text-white text-center">No loan requests</p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {requests.map((request) => {
            const statusColor =
              request.status === "approved"
                ? "text-green-500"
                : request.status === "rejected"
                ? "text-red-500"
                : "text-yellow-400";

            return (
              <div
                key={request._id}
                className="p-6 bg-black/90 border border-white/20 rounded-[36px] shadow-lg flex justify-between items-center transition"
              >
                <div>
                  <h2 className="text-xl font-bold mb-2 text-white">
                    {request.borrowerEmail}
                  </h2>

                  <p className={`font-semibold ${statusColor}`}>
                    Status: {request.status.toUpperCase()}
                  </p>

                  <p className="text-white/80">
                    <strong>Loan Amount:</strong> ${request.loan_amnt}
                  </p>

                  <p className="text-white/80">
                    <strong>Intent:</strong> {request.loan_intent}
                  </p>
                </div>

                {request.status === "pending" && (
                  <button
                    onClick={() => handleAIApproval(request._id)}
                    className="px-4 py-2 bg-black border border-white/30 hover:bg-green-600 text-white font-semibold rounded-[24px] shadow-md transition transform hover:scale-105"
                  >
                    Check AI Eligibility
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RequestForm;