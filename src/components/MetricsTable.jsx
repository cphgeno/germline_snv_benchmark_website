import React from "react";

function MetricsTable({ row }) {
  return (
    <div className="overflow-auto">
      <table className="min-w-full border border-gray-300 text-sm">
        <tbody>
          {Object.entries(row).map(([key, value]) => (
            <tr key={key}>
              <td className="border px-2 py-1 font-medium">{key}</td>
              <td className="border px-2 py-1">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MetricsTable;
