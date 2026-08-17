import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TELEMETRY_COLORS = {
  CPU_hours: "rgba(217,119,6,0.6)",
  GPU_hours: "rgba(220,38,38,0.6)",
  Wall_time_hours: "rgba(5,150,105,0.6)",
};

const TELEMETRY_LABELS = {
  CPU_hours: "CPU hours",
  GPU_hours: "GPU hours",
  Wall_time_hours: "Wall time (hours)",
};

// Values plotted on a log axis can't be 0 or null (log(0) is undefined,
// so Chart.js just drops those bars). Clamp them to a tiny epsilon for
// PLOTTING ONLY -- the tooltip and the table below still show the real
// value (0 or NA).
const LOG_EPSILON = 0.01;

// This is cumulative, per-pipeline-execution data (one row per execution,
// e.g. one for all 7 samples combined) -- not per-sample or per-caller, so
// it is intentionally NOT filtered by the accuracy-metric filters (Sample,
// Caller, Truthset, Region, Type, Filter). It is its own dataset.
function TelemetryPanel({ telemetryData, telemetrySelections }) {
  const [scaleType, setScaleType] = useState("linear");

  if (!telemetryData) {
    return <p className="p-4 text-gray-600">Loading telemetry data...</p>;
  }

  const labels = telemetryData.map((r) => `${r.Execution} (${r.Nodes})`);
  const isLog = scaleType === "log";

  const datasets = telemetrySelections.map((metric) => ({
    label: TELEMETRY_LABELS[metric] || metric,
    // Real values, used for the tooltip callback below.
    rawData: telemetryData.map((r) => r[metric]),
    // Plotted values: on a log axis, null/0 are clamped to a visible sliver.
    data: telemetryData.map((r) => {
      const v = r[metric];
      if (isLog && (v == null || v === 0)) return LOG_EPSILON;
      return v;
    }),
    backgroundColor: TELEMETRY_COLORS[metric] || "rgba(107,114,128,0.6)",
  }));

  const hasAnyData = telemetryData.some((r) =>
    telemetrySelections.some((m) => r[m] != null)
  );

  // Ranges differ by orders of magnitude ACROSS metrics (CPU hours can be
  // ~10,000x wall-time hours), so warn when a linear axis would flatten
  // the smaller series to invisible slivers. Pool all selected metrics'
  // values together and compare overall max to overall min -- comparing
  // each metric's own internal range would miss this entirely.
  const pooledValues = telemetrySelections.flatMap((metric) =>
    telemetryData.map((r) => r[metric]).filter((v) => v != null && v > 0)
  );
  const maxRatio = pooledValues.length
    ? Math.max(...pooledValues) / Math.min(...pooledValues)
    : 1;
  const suggestLog = telemetrySelections.length > 1 && maxRatio > 50;

  return (
    <div className="bg-white border rounded shadow p-4">
      <div className="flex items-start justify-between flex-wrap gap-2 mb-1">
        <h3 className="font-semibold">Compute by pipeline execution</h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Scale:</span>
          <button
            onClick={() => setScaleType("linear")}
            className={`px-2 py-0.5 rounded border ${
              scaleType === "linear"
                ? "bg-gray-700 text-white border-gray-700"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Linear
          </button>
          <button
            onClick={() => setScaleType("log")}
            className={`px-2 py-0.5 rounded border ${
              scaleType === "log"
                ? "bg-gray-700 text-white border-gray-700"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Log
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-1">
        Cumulative totals per pipeline run across all samples (not filtered
        by the options above).
      </p>
      {suggestLog && scaleType === "linear" && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mb-3 inline-block">
          Selected metrics span a {Math.round(maxRatio).toLocaleString()}x range, 
          try Log scale to see the smaller values.
        </p>
      )}

      {hasAnyData ? (
        <Bar
          data={{ labels, datasets }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const raw = ctx.dataset.rawData[ctx.dataIndex];
                    const display = raw == null ? "NA" : raw;
                    return `${ctx.dataset.label}: ${display}`;
                  },
                },
              },
            },
            scales: {
              y: isLog
                ? { type: "logarithmic", min: LOG_EPSILON }
                : { type: "linear", beginAtZero: true },
            },
          }}
        />
      ) : (
        <p className="text-sm text-gray-400">No telemetry data available yet.</p>
      )}
    </div>
  );
}

export default TelemetryPanel;

