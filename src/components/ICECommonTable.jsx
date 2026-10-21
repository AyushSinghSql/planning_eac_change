import React from "react";

export default function ICECommonTable({ columns = [], data = [] }) {
  return (
    <div className="w-full overflow-auto bg-white border border-gray-300 rounded">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap border-r border-gray-200 last:border-r-0"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-4 py-3 text-gray-700 whitespace-nowrap border-r border-gray-100 last:border-r-0"
                >
                  {row[column.key] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
