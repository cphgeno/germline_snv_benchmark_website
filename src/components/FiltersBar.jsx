import React from "react";

function FiltersBar({
  data,
  filter,
  onChangeFilter,
  variantType,
  onChangeVariantType,
  benchmarking,
  onChangeBenchmarking,
  caller,
  onChangeCaller,
  trustSet,
  onChangeTrustSet,
  region,
  onChangeRegion,
  metricSelections,
  onChangeMetricSelections,
  plotType,
  onChangePlotType,
  pipeline,
  onChangePipeline,
  sample,
  onChangeSample,
  facetBy,
  onChangeFacetBy,
  telemetrySelections,
  onChangeTelemetrySelections,
}) {
  const telemetryActive = telemetrySelections.length > 0;

  const uniqueValues = (key) => [...new Set(data.map((row) => row[key]))].sort();

  const availableCallers = uniqueValues("Caller");
  const availablePipelines = uniqueValues("Pipeline");
  const availableTrustSets = uniqueValues("Truthset");
  const availableRegions = uniqueValues("Regions");
  const availableBenchmarkings = uniqueValues("Benchmarking");
  const availableSamples = uniqueValues("Sample");

  const allMetrics = ["F1", "Recall", "Precision"];
  const allTelemetry = ["CPU_hours", "GPU_hours", "Wall_time_hours"];
  const TELEMETRY_LABELS = {
    CPU_hours: "CPU hrs",
    GPU_hours: "GPU hrs",
    Wall_time_hours: "Wall time",
  };

  // Toggle metric selection
  const toggleMetric = (metric) => {
    if (metricSelections.includes(metric)) {
      onChangeMetricSelections(metricSelections.filter((m) => m !== metric));
    } else {
      onChangeMetricSelections([...metricSelections, metric]);
    }
  };

  // Toggle telemetry selection
  const toggleTelemetry = (metric) => {
    if (telemetrySelections.includes(metric)) {
      onChangeTelemetrySelections(telemetrySelections.filter((m) => m !== metric));
    } else {
      onChangeTelemetrySelections([...telemetrySelections, metric]);
    }
  };

  // Generic handler for multi-select buttons
  const handleMultiSelect = (value, selected, setter) => {
    if (!Array.isArray(selected)) selected = ["ALL"];

    if (value === "ALL") {
      setter(["ALL"]);
    } else {
      if (selected.includes("ALL")) setter([value]);
      else if (selected.includes(value)) {
        const updated = selected.filter((x) => x !== value);
        setter(updated.length === 0 ? ["ALL"] : updated);
      } else {
        setter([...selected, value]);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Filters & Options</h2>

      {telemetryActive && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
          Compute & Cost shows cumulative totals per pipeline execution, so the filters below don't apply while it's active, they're locked to ALL. Turn off all Compute & Cost metrics to filter results again.
        </p>
      )}

      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 ${telemetryActive ? "opacity-50 pointer-events-none" : ""}`}>
        {/* Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Filter</label>
          <select
            value={filter}
            onChange={(e) => onChangeFilter(e.target.value)}
            disabled={telemetryActive}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="ALL">ALL</option>
            <option value="PASS">PASS</option>
          </select>
        </div>

        {/* Variant Type */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Variant Type</label>
          <select
            value={variantType}
            onChange={(e) => onChangeVariantType(e.target.value)}
            disabled={telemetryActive}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="ALL">ALL</option>
            {uniqueValues("Type").map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Benchmarking */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Benchmarking</label>
          <select
            value={benchmarking}
            onChange={(e) => onChangeBenchmarking(e.target.value)}
            disabled={telemetryActive}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="ALL">ALL</option>
            {availableBenchmarkings.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Metrics */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">Metrics</label>
          <div className="flex gap-2 flex-wrap">
            {allMetrics.map((m) => (
              <button
                key={m}
                onClick={() => toggleMetric(m)}
                disabled={telemetryActive}
                className={`px-3 py-1 rounded-lg border focus:outline-none focus:ring-2 ${
                  metricSelections.includes(m)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Plot Type */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Plot Type</label>
          <select
            value={plotType}
            onChange={(e) => onChangePlotType(e.target.value)}
            disabled={telemetryActive}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="bar">Bar</option>
            <option value="dot">Dot</option>
          </select>
        </div>
        {/* Facet By */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Facet By</label>
          <select
            value={facetBy}
            onChange={(e) => onChangeFacetBy(e.target.value)}
            disabled={telemetryActive}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="NONE">None</option>
            <option value="Caller">Caller</option>
            <option value="Regions">Region</option>
            <option value="Sample">Sample</option>
            <option value="Pipeline">Pipeline</option>
          </select>
        </div>

        {/* Callers multi-select */}
        <MultiSelectButtons
          label="Callers"
          options={availableCallers}
          selected={caller}
          onChange={onChangeCaller}
          color="blue"
        />

        {/* Pipelines multi-select */}
        <MultiSelectButtons
          label="Pipelines"
          options={availablePipelines}
          selected={pipeline}
          onChange={onChangePipeline}
          color="indigo"
        />

        {/* TrustSets multi-select */}
        <MultiSelectButtons
          label="TruthSet"
          options={availableTrustSets}
          selected={trustSet}
          onChange={onChangeTrustSet}
          color="purple"
        />

        {/* Regions multi-select */}
        <MultiSelectButtons
          label="Regions"
          options={availableRegions}
          selected={region}
          onChange={onChangeRegion}
          color="green"
        />
        <MultiSelectButtons
          label="Sample"
          options={availableSamples}
          selected={sample}
          onChange={onChangeSample}
          color="pink"
        />
      </div>

      {/* Telemetry -- always enabled, independent of the filters above */}
      <div className="flex flex-col mt-4 pt-4 border-t">
        <label className="text-sm font-medium mb-2">Compute & Cost</label>
        <div className="flex gap-2 flex-wrap">
          {allTelemetry.map((m) => (
            <button
              key={m}
              onClick={() => toggleTelemetry(m)}
              className={`px-3 py-1 rounded-lg border focus:outline-none focus:ring-2 ${
                telemetrySelections.includes(m)
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {TELEMETRY_LABELS[m]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Color map for Tailwind
const COLOR_CLASSES = {
  blue: "bg-blue-600 border-blue-600",
  indigo: "bg-indigo-600 border-indigo-600",
  purple: "bg-purple-600 border-purple-600",
  green: "bg-green-600 border-green-600",
  pink: "bg-pink-600 border-pink-600",
};

function MultiSelectButtons({ label, options, selected, onChange, color }) {
  const selectedClass = COLOR_CLASSES[color] || "bg-gray-600 border-gray-600";

  return (
    <div className="flex flex-col col-span-2">
      <label className="text-sm font-medium mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
        <button
          onClick={() => onChange(["ALL"])}
          className={`px-3 py-1 rounded-full border text-sm transition ${
            selected.includes("ALL")
              ? `${selectedClass} text-white`
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          ALL
        </button>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleMultiSelect(opt, selected, onChange)}
            className={`px-3 py-1 rounded-full border text-sm transition ${
              selected.includes(opt) && !selected.includes("ALL")
                ? `${selectedClass} text-white`
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// Generic handler reused by multi-select buttons
function handleMultiSelect(value, selected, setter) {
  if (!Array.isArray(selected)) selected = ["ALL"];

  if (value === "ALL") {
    setter(["ALL"]);
  } else {
    if (selected.includes("ALL")) setter([value]);
    else if (selected.includes(value)) {
      const updated = selected.filter((x) => x !== value);
      setter(updated.length === 0 ? ["ALL"] : updated);
    } else {
      setter([...selected, value]);
    }
  }
}

export default FiltersBar;