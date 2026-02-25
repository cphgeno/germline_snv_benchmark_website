import React, { useState } from "react";

function Sidebar({ data, filter, variantType, caller, trustSet, region, onSelectPipeline }) {
  const [openSamples, setOpenSamples] = useState({});

  const matchesFilter = (row) => {
    const rowFilter = row.Filter?.toUpperCase() || "";
    const rowType = row.Type?.toUpperCase() || "";
    const rowCaller = row.Caller || "";
    const rowTruthSet = row.Truthset || "";
    const rowRegion = row.Regions || "";

    return (
      (filter === "ALL" || rowFilter === filter.toUpperCase()) &&
      (variantType === "ALL" || rowType === variantType.toUpperCase()) &&
      (caller === "ALL" || rowCaller === caller) &&
      (trustSet === "ALL" || rowTruthSet === trustSet) &&
      (region === "ALL" || rowRegion === region)
    );
  };

  const grouped = {};
  data.forEach(row => {
    if (!matchesFilter(row)) return;
    grouped[row.Sample] = grouped[row.Sample] || {};
    grouped[row.Sample][row.Pipeline] = grouped[row.Sample][row.Pipeline] || [];
    grouped[row.Sample][row.Pipeline].push(row);
  });

  const sortedSamples = Object.keys(grouped).sort();

  return (
    <div className="w-80 bg-white p-4 border rounded shadow overflow-auto">
      <h2 className="font-semibold mb-2">Samples & Pipelines</h2>
      {sortedSamples.length === 0 && <p className="text-gray-500 text-sm">No pipelines match current filters.</p>}
      {sortedSamples.map(sample => (
        <div key={sample} className="mb-2">
          <div className="cursor-pointer font-medium"
               onClick={() => setOpenSamples({ ...openSamples, [sample]: !openSamples[sample] })}>
            {sample} {openSamples[sample] ? "▼" : "▶"}
          </div>
          {openSamples[sample] &&
            Object.keys(grouped[sample]).sort().map(pipeline => (
              <div key={pipeline} className="ml-4 mt-1">
                <div className="cursor-pointer text-sm hover:text-blue-600"
                     onClick={() => onSelectPipeline(grouped[sample][pipeline][0])}>
                  {pipeline}
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;