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
}) {
  const uniqueValues = (key) =>
    [...new Set(data.map((row) => row[key]))].sort();

  const allMetrics = ["F1", "Recall", "Precision"];

  const toggleMetric = (metric) => {
    if (metricSelections.includes(metric)) {
      // remove metric
      onChangeMetricSelections(metricSelections.filter((m) => m !== metric));
    } else {
      // add metric
      onChangeMetricSelections([...metricSelections, metric]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Filters & Options
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Filter</label>
          <select
            value={filter}
            onChange={(e) => onChangeFilter(e.target.value)}
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
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="ALL">ALL</option>
            {uniqueValues("Type").map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Benchmarking */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Benchmarking</label>
          <select
            value={benchmarking}
            onChange={(e) => onChangeBenchmarking(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="ALL">ALL</option>
            {uniqueValues("Benchmarking").map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Caller */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Caller</label>
          <select
            value={caller}
            onChange={(e) => onChangeCaller(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="ALL">ALL</option>
            {uniqueValues("Caller").map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Truthset */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Truthset</label>
          <select
            value={trustSet}
            onChange={(e) => onChangeTrustSet(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="ALL">ALL</option>
            {uniqueValues("Truthset").map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Regions */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Regions</label>
          <select
            value={region}
            onChange={(e) => onChangeRegion(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="ALL">ALL</option>
            {uniqueValues("Regions").map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Metrics - toggle buttons */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">Metrics</label>
          <div className="flex gap-2 flex-wrap">
            {allMetrics.map((m) => (
              <button
                key={m}
                onClick={() => toggleMetric(m)}
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
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="bar">Bar</option>
            <option value="dot">Dot</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default FiltersBar;