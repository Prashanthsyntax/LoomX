import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const AnalyticsChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Collateral Trend",
        data: [12, 19, 14, 20, 18, 25, 22],
        borderColor: "rgba(128, 90, 213, 1)",
        backgroundColor: function (context: { chart: any }) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;

          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, "rgba(128, 90, 213, 0)");
          gradient.addColorStop(0.5, "rgba(128, 90, 213, 0.2)");
          gradient.addColorStop(1, "rgba(128, 90, 213, 0.5)");
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 10,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "rgba(255,255,255,0.6)", font: { size: 13 } },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.1)", borderDash: [5, 5] },
        ticks: { color: "rgba(255,255,255,0.6)", font: { size: 13 } },
      },
    },
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-purple-900/50 to-indigo-900/40 p-8 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col">
      {/* Title */}
      <h3 className="text-sm text-white/60 font-semibold mb-6">Collateral Trend</h3>

      {/* Chart */}
      <div className="flex-1 rounded-2xl overflow-hidden shadow-inner h-[360px]">
        <Line data={data} options={options} />
      </div>

      {/* Footer */}
      <p className="text-xs text-white/40 mt-6 cursor-pointer hover:text-white transition-all">
        View Analytics →
      </p>
    </div>
  );
};

export default AnalyticsChart;
