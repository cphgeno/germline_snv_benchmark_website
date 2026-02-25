import React from "react";

const METRIC_COLORS = { F1: "orange", Recall: "purple", Precision: "teal" };

function FiltersBar({
  data,
  filter, onChangeFilter,
  variantType, onChangeVariantType,
  caller, onChangeCaller,
  trustSet, onChangeTrustSet,
  region, onChangeRegion,
  metricSelections, onChangeMetricSelections,
  plotType, onChangePlotType // <--- add here
}) {
  const uniqueValues = (field) =>
    ["ALL", ...Array.from(new Set(data.map(d => (d[field] || "").trim()))).sort()];

  const callers = uniqueValues("Caller");
  const truthSets = uniqueValues("Truthset");
  const regions = uniqueValues("Regions");
  const metrics = ["F1", "Recall", "Precision"];

  const sectionClass = "flex flex-col mb-2";
  const labelClass = "text-sm font-medium mb-1";

  return (
    <div className="flex flex-wrap gap-6 p-4 bg-white border rounded shadow">
      {/* Filter */}
      <div className={sectionClass}>
        <span className={labelClass}>Filter</span>
        <select
          value={filter}
          onChange={e => onChangeFilter(e.target.value)}
          className="p-2 border rounded hover:border-gray-400"
        >
          <option value="ALL">ALL</option>
          <option value="PASS">PASS</option>
        </select>
      </div>

      {/* Variant Type */}
      <div className={sectionClass}>
        <span className={labelClass}>Variant Type</span>
        <select
          value={variantType}
          onChange={e => onChangeVariantType(e.target.value)}
          className="p-2 border rounded hover:border-gray-400"
        >
          <option value="ALL">ALL</option>
          <option value="SNP">SNP</option>
          <option value="INDEL">INDEL</option>
        </select>
      </div>

      {/* Caller */}
      <div className={sectionClass}>
        <span className={labelClass}>Caller</span>
        <select
          value={caller}
          onChange={e => onChangeCaller(e.target.value)}
          className="p-2 border rounded hover:border-gray-400"
        >
          {callers.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Truthset */}
      <div className={sectionClass}>
        <span className={labelClass}>Truthset</span>
        <select
          value={trustSet}
          onChange={e => onChangeTrustSet(e.target.value)}
          className="p-2 border rounded hover:border-gray-400"
        >
          {truthSets.map(ts => <option key={ts} value={ts}>{ts}</option>)}
        </select>
      </div>

      {/* Regions */}
      <div className={sectionClass}>
        <span className={labelClass}>Region</span>
        <select
          value={region}
          onChange={e => onChangeRegion(e.target.value)}
          className="p-2 border rounded hover:border-gray-400"
        >
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Metrics */}
      <div className={sectionClass}>
        <span className={labelClass}>Metrics</span>
        <div className="flex gap-3">
          {metrics.map(m => (
            <label key={m} className="flex items-center gap-1 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={metricSelections.includes(m)}
                onChange={e => {
                  if (e.target.checked) onChangeMetricSelections([...metricSelections, m]);
                  else onChangeMetricSelections(metricSelections.filter(x => x !== m));
                }}
                className="w-4 h-4"
                style={{ accentColor: METRIC_COLORS[m] }}
              />
              <span className="ml-1">{m}</span>
            </label>
          ))}
        </div>
      </div>

          {/* Plot Type */}
        <div className="flex flex-col mb-2">
        <span className="text-sm font-medium mb-1">Plot Type</span>
        <select
            value={plotType}
            onChange={(e) => onChangePlotType(e.target.value)}
            className="p-2 border rounded hover:border-gray-400"
        >
            <option value="bar">Bar Plot</option>
            <option value="dot">Dot Plot</option>
        </select>
        </div>

    </div>
  );
}

export default FiltersBar;