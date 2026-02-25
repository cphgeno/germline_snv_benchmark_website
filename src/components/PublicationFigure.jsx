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

function PublicationFigure({ data, filter, variantType }) {
  if (!data) return null;

  // Filter data
  const filtered = data.filter(
    (row) =>
      row.Filter === filter &&
      row.Type === variantType
  );

  // Group by Caller
  const grouped = {};
  filtered.forEach((row) => {
    if (!grouped[row.Caller]) grouped[row.Caller] = [];
    grouped[row.Caller].push(row);
  });

  return (
    <div className="grid grid-cols-2 gap-6">
      {Object.entries(grouped).map(([caller, rows]) => {
        const labels = rows.map((r) => r.Pipeline);

        const chartData = {
          labels,
          datasets: [
            {
              label: "F1",
              data: rows.map((r) => r.F1),
              backgroundColor: "rgba(75,192,192,0.6)",
            },
            {
              label: "Recall",
              data: rows.map((r) => r.Recall),
              backgroundColor: "rgba(153,102,255,0.6)",
            },
            {
              label: "Precision",
              data: rows.map((r) => r.Precision),
              backgroundColor: "rgba(255,159,64,0.6)",
            },
          ],
        };

        return (
          <div
            key={caller}
            className="bg-white border rounded shadow p-4"
          >
            <h3 className="font-semibold mb-2">{caller}</h3>
            <Bar data={chartData} />
          </div>
        );
      })}
    </div>
  );
}

export default PublicationFigure;