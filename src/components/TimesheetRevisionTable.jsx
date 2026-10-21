import React, { useEffect, useState } from "react";
import { backendUrl } from "./config";

const TimesheetRevisionTable = ({ timesheetDate,lines, onClose }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!timesheetDate) return;
    const fetchRevision = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${backendUrl}/api/SubkTimesheet/GetAuditLogsV1`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lines),
          }
        );
        if (!res.ok) throw new Error("Failed to load revision audit");
        const data = await res.json();
        setRows(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRevision();
  }, [timesheetDate, lines]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-300 font-inter">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-300 bg-[#e5f3fb]">
            <h2 className="text-sm font-bold text-gray-800">
              Revision Audit – {timesheetDate}
            </h2>
            <button
              onClick={onClose}
              className="btn1 btn-blue !py-1 !px-3 text-xs cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="p-3">
            <div className="overflow-x-auto rounded border border-gray-300">
              <table className="min-w-full text-xs border-collapse">
                <thead className="bg-[#e5f3fb] border-b border-gray-300">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-black border-r border-gray-300 last:border-r-0">
                      Field
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-black border-r border-gray-300 last:border-r-0">
                      Old Value
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-black border-r border-gray-300 last:border-r-0">
                      New Value
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-black border-r border-gray-300 last:border-r-0">
                      Changed By
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-black border-r border-gray-300 last:border-r-0">
                      Changed Comment
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-black">
                      Changed At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-6 text-center text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-6 text-center text-gray-500"
                      >
                        No revision data available
                      </td>
                    </tr>
                  ) : (
                    rows.map((r, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-sky-50/50 transition-colors"
                      >
                        <td className="px-3 py-2 border-r border-b border-gray-200 font-medium text-black">
                          {r.columnName}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-gray-200 text-black">
                          {r.oldValue}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-gray-200 text-black">
                          {r.newValue}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-gray-200 text-black">
                          {r.changedBy}
                        </td>
                        <td className="px-3 py-2 border-r border-b border-gray-200 text-black">
                          {r.changeComment}
                        </td>
                        <td className="px-3 py-2 border-b border-gray-200 text-black">
                          {r.changedAt}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimesheetRevisionTable;
