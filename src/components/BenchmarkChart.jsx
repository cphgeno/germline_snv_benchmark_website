import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const METRIC_COLORS = { F1: "rgba(255,159,64,0.6)", Recall: "rgba(153,102,255,0.6)", Precision: "rgba(75,192,192,0.6)" };

function BenchmarkChart({ row, metricSelections }) {
  const labels = metricSelections;
  const dataValues = metricSelections.map(m => row[m]);
  return (
    <div className="mb-6">
      <Bar
        data={{
          labels,
          datasets: [{ label: `${row.Pipeline} (${row.Sample})`, data: dataValues, backgroundColor: metricSelections.map(m => METRIC_COLORS[m] || "rgba(0,0,0,0.5)") }],
        }}
      />
    </div>
  );
}

export default BenchmarkChart;
