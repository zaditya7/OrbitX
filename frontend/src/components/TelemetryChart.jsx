import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale);

function TelemetryChart({ data, label }) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const options = {
    animation: false
  };

  const chartData = {
    labels: data.map((_, i) => i),
    datasets: [
      {
        label: label,
        data: data,
        borderColor: "#4ade80",
        borderWidth: 2,
        tension: 0.3
      }
    ]
  };

  return (
    <div style={{ height: "180px", marginTop: "12px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default TelemetryChart;