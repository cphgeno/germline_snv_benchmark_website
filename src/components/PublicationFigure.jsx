import React from "react";
import { Bar, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement, // needed for scatter/dot plots
  Title,
  Tooltip,
  Legend
);

// Metric colors
const METRIC_COLORS = {
  F1: "rgba(255,159,64,0.6)",
  Recall: "rgba(153,102,255,0.6)",
  Precision: "rgba(75,192,192,0.6)",
};

function PublicationFigure({
  data,
  filter,
  variantType,
  caller,
  trustSet,
  region,
  metricSelections = ["F1"],
  plotType = "bar", // "bar" or "dot"
}) {
  if (!data) return null;

  // Filter data based on all user selections
  const filtered = data.filter(
    (row) =>
      (filter === "ALL" || row.Filter === filter) &&
      (variantType === "ALL" || row.Type === variantType) &&
      (caller === "ALL" || row.Caller === caller) &&
      (trustSet === "ALL" || row.Truthset === trustSet) &&
      (region === "ALL" || row.Regions === region)
  );

  // Group by Caller
  const grouped = {};
  filtered.forEach((row) => {
    if (!grouped[row.Caller]) grouped[row.Caller] = [];
    grouped[row.Caller].push(row);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(grouped).map(([callerName, rows]) => {
        const labels = rows.map((r) => r.Pipeline);

        // Build datasets for each selected metric
        const datasets = metricSelections.map((metric) => {
          if (plotType === "bar") {
            return {
              label: metric,
              data: rows.map((r) => r[metric]),
              backgroundColor: METRIC_COLORS[metric],
            };
          } else if (plotType === "dot") {
            return {
              label: metric,
              data: rows.map((r, idx) => ({ x: idx, y: r[metric] })),
              backgroundColor: METRIC_COLORS[metric],
              type: "scatter",
              pointRadius: 6,
            };
          }
          return null;
        });

        return (
          <div
            key={callerName}
            className="bg-white border rounded shadow p-4"
          >
            <h3 className="font-semibold mb-2">{callerName}</h3>

            {plotType === "bar" ? (
              <Bar
                data={{
                  labels,
                  datasets,
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            ) : (
              <Scatter
                data={{
                  datasets,
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                  scales: {
                    x: {
                      ticks: { callback: (val) => labels[val] || "" },
                      title: { display: true, text: "Pipeline" },
                    },
                    y: { beginAtZero: true },
                  },
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default PublicationFigure;