import React, { useState, useEffect } from "react";
import BenchmarkChart from "./components/BenchmarkChart";
import MetricsTable from "./components/MetricsTable";
import PublicationFigure from "./components/PublicationFigure";
import TelemetryPanel from "./components/TelemetryPanel";
import FiltersBar from "./components/FiltersBar";
import Sidebar from "./components/Sidebar";

function App() {
  const [data, setData] = useState(null);
  const [telemetryData, setTelemetryData] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Filters
  const [filter, setFilter] = useState("ALL");
  const [variantType, setVariantType] = useState("SNP");
  const [benchmarking, setBenchmarking] = useState("ALL");
  const [caller, setCaller] = useState("ALL");
  const [trustSet, setTrustSet] = useState("ALL");
  const [region, setRegion] = useState("ALL");
  const [metricSelections, setMetricSelections] = useState(["F1"]);
  const [plotType, setPlotType] = useState("bar"); 
  const [pipeline, setPipeline] = useState(["ALL"]);
  const [sample, setSample] = useState(["ALL"]);  // new
  const [facetBy, setFacetBy] = useState("NONE");
  const [telemetrySelections, setTelemetrySelections] = useState([]);

  useEffect(() => {
    fetch("/summary.json")
      .then((res) => res.json())
      .then((jsonData) => setData(jsonData))
      .catch((err) => console.error("Error loading benchmark data:", err));

    fetch("/telemetry.json")
      .then((res) => res.json())
      .then((jsonData) => setTelemetryData(jsonData))
      .catch((err) => console.error("Error loading telemetry data:", err));
  }, []);

  // Telemetry is cumulative per pipeline execution, not filterable by
  // sample/caller/truthset/region/type/filter -- so as soon as the user
  // turns on any Compute & Cost metric, snap every filter back to ALL.
  const handleChangeTelemetrySelections = (newSelections) => {
    setTelemetrySelections(newSelections);
    if (newSelections.length > 0) {
      setFilter("ALL");
      setBenchmarking("ALL");
      setCaller("ALL");
      setTrustSet("ALL");
      setRegion("ALL");
      setPipeline(["ALL"]);
      setSample(["ALL"]);
    }
  };

  if (!data) {
    return <p className="p-4 text-gray-600">Loading benchmark data...</p>;
  }

  const telemetryActive = telemetrySelections.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-4">
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Germline SNV Benchmark Platform</h1>
        <p className="text-gray-700 mb-2">
          Compare precision, recall, and F1 across pipelines.
        </p>
        <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-blue-700 rounded">
          To add your own benchmarking results, please send your hap.py, rtgtools, summary 
          files to{" "}
          <a
            href="mailto:frederik.otzen.bagger@regionh.dk"
            className="underline text-blue-600"
          >
            frederik.otzen.bagger@regionh.dk
          </a>
        </div>
      </header>

      {/* Filters Bar */}
      <FiltersBar
        data={data}
        filter={filter}
        onChangeFilter={setFilter}
        variantType={variantType}
        onChangeVariantType={setVariantType}
        benchmarking={benchmarking}
        onChangeBenchmarking={setBenchmarking}
        caller={caller}
        onChangeCaller={setCaller}
        trustSet={trustSet}
        onChangeTrustSet={setTrustSet}
        region={region}
        onChangeRegion={setRegion}
        metricSelections={metricSelections}
        onChangeMetricSelections={setMetricSelections}
        plotType={plotType}
        onChangePlotType={setPlotType}
        pipeline={pipeline}
        onChangePipeline={setPipeline}
        sample={sample}
        onChangeSample={setSample}
        facetBy={facetBy}
        onChangeFacetBy={setFacetBy}
        telemetrySelections={telemetrySelections}
        onChangeTelemetrySelections={handleChangeTelemetrySelections}
      />

      {/* Benchmarking Results */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">
          {telemetryActive ? "Compute & Cost" : "Benchmarking Results"}
        </h2>
        {telemetryActive ? (
          <TelemetryPanel
            telemetryData={telemetryData}
            telemetrySelections={telemetrySelections}
          />
        ) : (
          <PublicationFigure
            data={data}
            filter={filter}
            variantType={variantType}
            benchmarking={benchmarking}
            caller={caller}
            trustSet={trustSet}
            region={region}
            metricSelections={metricSelections}
            plotType={plotType}
            pipeline={pipeline}
            sample={sample}
            facetBy={facetBy}
          />
        )}
      </div>

      {/* Layout 
      <div className="flex gap-6 flex-1 overflow-hidden">
        <Sidebar
          data={data}
          filter={filter}
          variantType={variantType}
          benchmarking={benchmarking}
          caller={caller}
          trustSet={trustSet}
          region={region}
          onSelectPipeline={setSelectedRow}
        />

        <div className="flex-1 bg-white border rounded shadow overflow-auto max-h-[90vh] p-4">
          {selectedRow ? (
            <>
              <BenchmarkChart row={selectedRow} metricSelections={metricSelections} />
              <MetricsTable row={selectedRow} />
            </>
          ) : (
            <p className="text-gray-500">Select a pipeline from the sidebar.</p>
          )}
        </div>
      </div>
      */}
    </div>
  );
}

export default App;