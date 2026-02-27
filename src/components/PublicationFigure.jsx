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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const METRIC_COLORS = {
  F1: "rgba(255,159,64,0.6)",
  Recall: "rgba(153,102,255,0.6)",
  Precision: "rgba(75,192,192,0.6)",
};

function PublicationFigure({
  data,
  filter,
  variantType,
  caller = ["ALL"],
  trustSet = ["ALL"],
  region = ["ALL"],
  pipeline = ["ALL"],
  metricSelections = ["F1"],
  plotType = "bar",
  sample = ["ALL"],
  facetBy = "NONE"
}) {
  if (!data) return null;

  // Ensure arrays
  caller = Array.isArray(caller) ? caller : [caller];
  trustSet = Array.isArray(trustSet) ? trustSet : [trustSet];
  region = Array.isArray(region) ? region : [region];
  pipeline = Array.isArray(pipeline) ? pipeline : [pipeline];
  sample = Array.isArray(sample) ? sample : [sample];

const filtered = data.filter((row) =>
  (filter === "ALL" || row.Filter === filter) &&
  (variantType === "ALL" || row.Type === variantType) &&
  (caller.includes("ALL") || caller.includes(row.Caller)) &&
  (trustSet.includes("ALL") || trustSet.includes(row.Truthset)) &&
  (region.includes("ALL") || region.includes(row.Regions)) &&
  (pipeline.includes("ALL") || pipeline.includes(row.Pipeline)) &&
  (sample.includes("ALL") || sample.includes(row.Sample))  // <-- new
);

 let grouped = {};

if (facetBy === "NONE") {
  grouped["All Results"] = filtered;
} else {
  filtered.forEach((row) => {
    const key = row[facetBy];
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(row);
  });
}

  return (
    <div className="grid grid-cols-1 gap-6">
      {Object.entries(grouped).map(([callerName, rows]) => {
        const labels = rows.map((r) => [
  r.Pipeline,
  r.Caller,
  r.Regions,
  r.Sample
]);

        const datasets = metricSelections.map((metric) => {
          if (plotType === "bar") {
            return {
              label: metric,
              data: rows.map((r) => r[metric]),
              backgroundColor: METRIC_COLORS[metric],
            };
          } else {
            return {
              label: metric,
              data: rows.map((r, idx) => ({ x: idx, y: r[metric] })),
              backgroundColor: METRIC_COLORS[metric],
              type: "scatter",
              pointRadius: 6,
            };
          }
        });

        return (
          <div key={callerName} className="bg-white border rounded shadow p-4">
            <h3 className="font-semibold mb-2">{callerName}</h3>

            {plotType === "bar" ? (
              <Bar
                data={{ labels, datasets }}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "top" } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            ) : (
              <Scatter
                data={{ datasets }}
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