import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const staticResponse = `
# Credit Score Explanation

Your current credit score is 620, which falls into the Fair category.

## Score Breakdown

• Payment History (35%): Two late payments impacting score.
• Credit Utilization (30%): 78% utilization is high.
• Length of History (15%): Short credit age.
• Credit Mix (10%): Limited account diversity.

## Actionable Steps

1. Pay off late payments immediately.
2. Reduce utilization below 30%.
3. Make all future payments on time.
4. Avoid unnecessary credit inquiries.

## Estimated Impact

You may improve your score by 80–170 points within 3–6 months.
`;

const AICreditAdvisor = () => {
  // // API Layer to fetch AI response
  // const [response, setResponse] = useState("");

  // useEffect(() => {
  //   fetch("http://127.0.0.1:8000/ai-advisor", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ question: "Analyze my score" }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setResponse(data.answer);
  //     });
  // }, []);

  const [displayedText, setDisplayedText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let index = 0;
    const speed = 15;

    const typeEffect = setInterval(() => {
      setDisplayedText(staticResponse.slice(0, index));
      index++;
      if (index > staticResponse.length) {
        clearInterval(typeEffect);
        setLoading(false);
      }
    }, speed);

    return () => clearInterval(typeEffect);
  }, []);

  const formatText = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("# ")) {
        return (
          <h1
            key={i}
            className="text-3xl font-bold mt-6 mb-3 text-indigo-400 drop-shadow-lg"
          >
            {line.replace("# ", "")}
          </h1>
        );
      }

      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="text-xl font-semibold mt-5 mb-2 text-gray-300">
            {line.replace("## ", "")}
          </h2>
        );
      }

      if (line.startsWith("• ")) {
        return (
          <li key={i} className="ml-6 list-disc text-gray-400 mb-1">
            {line.replace("• ", "")}
          </li>
        );
      }

      if (/^\d+\./.test(line)) {
        return (
          <li key={i} className="ml-6 list-decimal text-gray-400 mb-1">
            {line}
          </li>
        );
      }

      return (
        <p key={i} className="text-gray-400 leading-relaxed mb-2">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-black flex justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full bg-gray-900 shadow-2xl rounded-2xl p-8 border border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
            AI
          </div>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            AI Credit Advisor
          </h1>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-300"></div>
            <span className="text-gray-400 ml-2 italic">
              Analyzing your profile...
            </span>
          </div>
        )}

        {/* AI Response */}
        <div className="prose prose-invert max-w-none">
          {formatText(displayedText)}
        </div>
      </motion.div>
    </div>
  );
};

export default AICreditAdvisor;
