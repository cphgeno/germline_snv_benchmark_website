import React, { useState } from "react";

function Sidebar({ data, filter, variantType, onSelectPipeline }) {
  const [openSamples, setOpenSamples] = useState({});

  // Group by Sample → Pipeline
  const grouped = {};
  data.forEach((row) => {
    if (row.Filter !== filter || row.Type !== variantType) return;

    const sample = row.Sample;
    const pipeline = row.Pipeline;

    if (!grouped[sample]) grouped[sample] = {};
    if (!grouped[sample][pipeline]) grouped[sample][pipeline] = [];

    grouped[sample][pipeline].push(row);
  });

  return (
    <div className="w-80 bg-white p-4 border rounded shadow overflow-auto">
      <h2 className="font-semibold mb-2">Samples & Pipelines</h2>

      {Object.entries(grouped).map(([sample, pipelines]) => (
        <div key={sample} className="mb-2">
          <div
            className="cursor-pointer font-medium"
            onClick={() =>
              setOpenSamples({
                ...openSamples,
                [sample]: !openSamples[sample],
              })
            }
          >
            {sample} {openSamples[sample] ? "▼" : "▶"}
          </div>

          {openSamples[sample] &&
            Object.entries(pipelines).map(([pipeline, rows]) => (
              <div key={pipeline} className="ml-4 mt-1">
                <div
                  className="cursor-pointer text-sm hover:text-blue-600"
                  onClick={() => onSelectPipeline(rows[0])}
                >
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