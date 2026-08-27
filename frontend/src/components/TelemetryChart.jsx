import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip
} from "chart.js";
import "./TelemetryChart.css";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

const METRIC_COLORS = {
  Battery: "#4ade80",
  Signal: "#38bdf8"
};

function TelemetryChart({ data, label }) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const color = METRIC_COLORS[label] || "#38bdf8";

  const options = {
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.92)",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        titleColor: "#94a3b8",
        bodyColor: "#e2e8f0",
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (ctx) => `${label}: ${ctx.parsed.y.toFixed(1)}%`
        }
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        grid: { color: "rgba(255,255,255,0.05)" },
        border: { display: false },
        ticks: { color: "#64748b", font: { size: 10 }, maxTicksLimit: 4 }
      }
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 5,
        hoverBackgroundColor: color,
        hoverBorderColor: "#0f172a",
        hoverBorderWidth: 2
      },
      line: { borderWidth: 2, tension: 0.35 }
    }
  };

  const chartData = {
    labels: data.map((_, i) => i),
    datasets: [
      {
        label,
        data,
        borderColor: color,
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "transparent";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, `${color}55`);
          gradient.addColorStop(1, `${color}00`);
          return gradient;
        },
        fill: true,
        tension: 0.35
      }
    ]
  };

  return (
    <div className="telemetry-chart-wrapper" style={{ "--chart-glow": `${color}66` }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default TelemetryChart;