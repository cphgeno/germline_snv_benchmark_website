import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BenchmarkChart({ row }) {
  const chartData = {
    labels: ["Precision", "Recall", "F1"],
    datasets: [
      {
        label: `${row.Pipeline} (${row.Sample})`,
        data: [row.Precision, row.Recall, row.F1],
        backgroundColor: [
          "rgba(75,192,192,0.6)",
          "rgba(153,102,255,0.6)",
          "rgba(255,159,64,0.6)",
        ],
      },
    ],
  };

  return (
    <div className="mb-6">
      <Bar data={chartData} />
    </div>
  );
}

export default BenchmarkChart;
