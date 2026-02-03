import React from "react";
import ReactSpeedometer from "react-d3-speedometer";


/* ✅ Props Interface */
interface CreditScoreProps {
  score?: number;
  maxScore?: number;
  apy?: string;
  risk?: string;
}

const CreditScore: React.FC<CreditScoreProps> = ({
  score = 720,
  maxScore = 900,
  apy = "2.5%",
  risk = "Low Risk",
}) => {
  return (
    <div className="rounded-2xl bg-zinc-900 p-4 border border-white/5 flex items-center justify-between gap-10">
      {/* LEFT INFO */}
      <div className="flex flex-col">
        <h3 className="text-sm text-white/60 tracking-wide">
          AI Credit Score
        </h3>

        <p className="text-4xl font-semibold mt-2">
          <span className="text-white-400">{score}</span>
          <span className="text-lg text-white/40"> / {maxScore}</span>
        </p>

        <p className="text-md mt-2 text-emerald-400">
          {risk} · {apy} APY
        </p>

        <button className="text-sm mt-2 text-amber-300 hover:text-amber-200 transition w-fit">
          Learn more →
        </button>
      </div>

      {/* RIGHT GAUGE */}
      <div className="relative">
        <div className="rounded-xl p-2">
          <ReactSpeedometer
            maxValue={maxScore}
            value={score}
            needleColor="#ffffff"
            needleHeightRatio={0.7}
            // needleTransition="easeElastic"
            needleTransitionDuration={1400}
            ringWidth={22}
            segments={5}
            segmentColors={[
              "#ef4444", // red
              "#f97316", // orange
              "#facc15", // yellow
              "#22c55e", // green
              "#16a34a", // dark green
            ]}
            currentValueText=""
            valueTextFontSize="0px"
            textColor="#ffffff"
            width={180}
            height={120}
          />
        </div>

        {/* Risk Labels */}
        <div className="flex justify-between text-xs text-white/40 px-2 -mt-1">
          <span>Low</span>
          <span>Good</span>
        </div>
      </div>
    </div>
  );
};

export default CreditScore;
