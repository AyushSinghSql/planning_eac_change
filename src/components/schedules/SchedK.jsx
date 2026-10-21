import React, { useState, useEffect, useMemo } from "react";
import { backendUrl } from "../config";
import * as XLSX from "xlsx";

const SchedK = ({
  year = 2025,
  onNavigation,
  companyName,
  companyAddress,
  explanatoryNote,
  setExplanatoryNote,
  fiscalYearEnd,
}) => {
  const [selectedYear, setSelectedYear] = useState(year);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [laborData, setLaborData] = useState([]);

  const fileInputRef = React.useRef(null);

  // Fetch Schedule K data from API
  const fetchScheduleKData = async (year) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${backendUrl}/api/TrialBalance/ScheduleK?year=${year}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLaborData(data);
    } catch (err) {
      console.error("Failed to fetch Schedule K data:", err);
      setError(err.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleKData(selectedYear);
  }, [selectedYear]);

  // Year Navigation Handlers
  const handlePrevYear = () => setSelectedYear((prev) => prev - 1);
  const handleNextYear = () => setSelectedYear((prev) => prev + 1);

  // Group raw flat API rows by unique Contracts & Tasks
  const { contracts, categoryRows } = useMemo(() => {
    if (!laborData || laborData.length === 0) {
      return { contracts: [], categoryRows: [] };
    }

    const contractMap = new Map();
    laborData.forEach((item) => {
      const key = `${item.invcProjId || ""}_${item.taskId || ""}`;
      if (!contractMap.has(key)) {
        contractMap.set(key, {
          key,
          contractNo: item.invcProjId || "N/A",
          taskId: item.taskId || "N/A",
          materialCost: Number(item.materialCost || 0),
          subcontractor: Number(item.subcontractor || 0),
          materialOverhead: Number(item.materialOverhead || 0),
          travelCost: Number(item.travelCost || 0),
          odcCost: Number(item.odcCost || 0),
          taskCeiling: Number(item.taskCeiling || 0),
        });
      }
    });
    const contractList = Array.from(contractMap.values());

    const categoryMap = new Map();
    laborData.forEach((item) => {
      const cat = item.plcDesc || "Uncategorized";
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, {});
      }
      const catEntry = categoryMap.get(cat);
      const contractKey = `${item.invcProjId || ""}_${item.taskId || ""}`;

      if (!catEntry[contractKey]) {
        catEntry[contractKey] = [];
      }

      catEntry[contractKey].push({
        rate: Number(item.rate || 0),
        hours: Number(item.hours || 0),
        amount: Number(item.amount || 0),
      });
    });

    const rows = Array.from(categoryMap.entries()).map(
      ([category, contractValues]) => ({
        category,
        contractValues,
      }),
    );

    return { contracts: contractList, categoryRows: rows };
  }, [laborData]);

  // Compute Labor Totals per Contract Column
  const contractLaborTotals = useMemo(() => {
    const totals = {};
    contracts.forEach((c) => {
      totals[c.key] = { hours: 0, amount: 0 };
    });

    laborData.forEach((item) => {
      const key = `${item.invcProjId || ""}_${item.taskId || ""}`;
      if (totals[key]) {
        totals[key].hours += Number(item.hours || 0);
        totals[key].amount += Number(item.amount || 0);
      }
    });

    return totals;
  }, [contracts, laborData]);

  const handleExportExcel = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${backendUrl}/api/TrialBalance/ScheduleK/export`,
        {
          method: "GET",
          headers: {
            // Expect an Excel binary file back from the API
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Export failed with status: ${response.status}`);
      }

      // Convert the API response into a Blob
      const blob = await response.blob();

      // Create a temporary object URL to trigger the file download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Schedule_K_${selectedYear}.xlsx`);

      document.body.appendChild(link);
      link.click();

      // Clean up DOM and URL object
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export Excel file:", err);
      alert(`Export failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle raw file upload via FormData directly to the endpoint
  const handleImportFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await fetch(
        `${backendUrl}/api/TrialBalance/ScheduleK/import`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Import failed with status: ${response.status}`);
      }

      alert("Import successful!");
      // Refresh table data after upload
      fetchScheduleKData(selectedYear);
    } catch (err) {
      console.error("Failed to import file:", err);
      alert(`Import failed: ${err.message}`);
    } finally {
      setLoading(false);
      // Clear input value so the same file can be selected again
      event.target.value = "";
    }
  };

  return (
    <div className="p-4 bg-white min-h-screen text-black font-sans text-xs">
      {/* Action Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between border-b pb-3 gap-2">
        <div className="flex items-center space-x-3">
          {/* <button
            onClick={handlePrevYear}
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded font-semibold text-xs"
          >
            &larr; Prev Year
          </button>
          <span className="font-bold text-sm">FY {selectedYear}</span>
          <button
            onClick={handleNextYear}
            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded font-semibold text-xs"
          >
            Next Year &rarr;
          </button> */}
        </div>

        <div className="flex items-center space-x-2">
          {/* <button
            onClick={handleExportExcel}
            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded text-xs transition"
          >
            Export Excel
          </button> */}
          {/* <button
            onClick={handleImportClick}
            className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded text-xs transition"
          >
            Import File
          </button> */}

          {/* <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleImportFile}
            className="hidden"
          /> */}
          <button
            onClick={fetchScheduleKData}
            className="px-3 py-1 bg-white border border-slate-300 text-slate-700 font-medium rounded text-xs hover:bg-slate-50 shadow-sm transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Sheet Metadata Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="space-y-1">
          <div className="border border-emerald-800 px-2 py-0.5 inline-block bg-white text-[11px] font-semibold text-emerald-900">
            This Schedule is linked to schedule A for the G&amp;A rate.
          </div>
          <div className="font-bold text-black text-[11px]">
            Any changes in data will affect Schedule I.
          </div>
          <div className="font-bold text-black text-[11px]">
            Other than G&amp;A rate, only manual or externally imported entries
          </div>
          <div>
            <a
              href="#schedule-a"
              className="text-blue-700 underline font-medium"
            >
              Schedule A - Applied Overhead, G&amp;A, &amp; COM Rates
            </a>
          </div>
          <div>
            <a
              href="#ice-manual"
              className="text-blue-700 underline font-medium"
            >
              ICE MANUAL
            </a>
          </div>
        </div>

        <div className="text-right">
          <div className="font-bold text-sm tracking-wide">SCHEDULE K</div>
          <div className="font-bold text-sm">ICE (version 2.0.1h)</div>
        </div>
      </div>

      {/* Yellow Title Header */}
      <div className="my-4 bg-yellow-300 border border-yellow-400 py-2 text-center shadow-sm">
        <div className="font-bold text-sm">{companyName}</div>
        <div className="font-bold text-xs">{companyAddress}</div>
        <div className="font-bold text-xs">
          Summary of Hours and Amounts on Time and Material/Labor Hour Contracts
        </div>
        <div className="font-bold text-xs">
          Fiscal Year End - {fiscalYearEnd}
        </div>
      </div>

      {/* Loading / Error States */}
      {loading && (
        <div className="text-center py-6 text-blue-600 font-semibold">
          Loading Schedule K data for FY {selectedYear}...
        </div>
      )}

      {error && (
        <div className="p-3 my-2 text-xs text-red-700 bg-red-100 border border-red-300 rounded">
          <strong>Error loading data:</strong> {error}
        </div>
      )}

      {/* Main Schedule K Matrix Table */}
      {!loading && (
        <div className="overflow-x-auto border border-gray-400 relative">
          <table className="w-full border-collapse text-left text-[11px]">
            <thead>
              {/* Row 1: Contract Numbers */}
              <tr className="bg-white">
                <th
                  rowSpan={2}
                  className="p-1 border-b border-r border-gray-400 align-bottom font-bold sticky left-0 bg-white z-20 min-w-[260px] whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                >
                  <div className="flex justify-between items-end pr-2">
                    <span>Contract Labor</span>
                    <span>Contract No.</span>
                  </div>
                </th>

                {contracts.length === 0 ? (
                  <th className="p-1 border-b border-gray-400 text-center font-normal">
                    No Contracts Found
                  </th>
                ) : (
                  contracts.map((c) => (
                    <th
                      key={c.key}
                      colSpan={3}
                      className="p-1 border-b border-r border-gray-400 text-right font-bold whitespace-nowrap"
                    >
                      {c.contractNo}
                    </th>
                  ))
                )}
              </tr>

              {/* Row 2: Tasks */}
              <tr className="bg-white">
                {contracts.map((c) => (
                  <th
                    key={c.key}
                    colSpan={3}
                    className="p-1 border-b border-r border-gray-400 text-right font-bold whitespace-nowrap"
                  >
                    Task: {c.taskId}
                  </th>
                ))}
              </tr>

              {/* Row 3: Column Header Labels */}
              <tr className="bg-white border-b-2 border-black font-bold">
                <th className="p-1 border-r border-gray-400 sticky left-0 bg-white z-20 whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  Category (1)
                </th>
                {contracts.map((c) => (
                  <React.Fragment key={c.key}>
                    <th className="p-1 text-right border-r border-gray-300 w-20 whitespace-nowrap">
                      Rate (2)
                    </th>
                    <th className="p-1 text-right border-r border-gray-300 w-16 whitespace-nowrap">
                      Hrs
                    </th>
                    <th className="p-1 text-right border-r border-gray-400 bg-cyan-300 w-28 whitespace-nowrap">
                      Amount
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>

            <tbody>
              {categoryRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={1 + contracts.length * 3}
                    className="p-4 text-center text-gray-500"
                  >
                    No contract labor details available for FY {selectedYear}.
                  </td>
                </tr>
              ) : (
                categoryRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-gray-50">
                    {/* Category Description: Sticky + No Wrap */}
                    <td className="p-1 border-r border-gray-300 font-normal sticky left-0 bg-white z-10 whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] pr-4">
                      {row.category}
                    </td>

                    {/* Contract Dynamic Cells */}
                    {contracts.map((c) => {
                      const entries = row.contractValues[c.key] || [];

                      return (
                        <React.Fragment key={c.key}>
                          {/* Rate Cell */}
                          <td className="p-1 text-right border-r border-gray-200 font-mono whitespace-nowrap">
                            {entries.length > 0 &&
                              entries.map((e, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between space-x-1"
                                >
                                  <span className="text-gray-400">$</span>
                                  <span>
                                    {e.rate ? e.rate.toFixed(2) : "—"}
                                  </span>
                                </div>
                              ))}
                          </td>

                          {/* Hours Cell */}
                          <td className="p-1 text-right border-r border-gray-200 font-mono whitespace-nowrap">
                            {entries.length > 0 &&
                              entries.map((e, idx) => (
                                <div key={idx}>
                                  {e.hours ? e.hours.toLocaleString() : "—"}
                                </div>
                              ))}
                          </td>

                          {/* Amount Cell (Cyan) */}
                          <td className="p-1 text-right border-r border-gray-400 bg-cyan-300 font-mono whitespace-nowrap">
                            {entries.length > 0 ? (
                              entries.map((e, idx) => (
                                <div key={idx}>
                                  {e.amount !== undefined && e.amount !== 0
                                    ? e.amount.toLocaleString(undefined, {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 2,
                                      })
                                    : "-"}
                                </div>
                              ))
                            ) : (
                              <div>-</div>
                            )}
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))
              )}

              {/* LABOR TOTAL ROW */}
              {contracts.length > 0 && (
                <tr className="border-t-2 border-black font-bold bg-white">
                  <td className="p-1 border-r border-gray-400 sticky left-0 bg-white z-10 whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    TOTAL
                  </td>
                  {contracts.map((c) => {
                    const totalObj = contractLaborTotals[c.key] || {
                      hours: 0,
                      amount: 0,
                    };
                    return (
                      <React.Fragment key={c.key}>
                        <td className="p-1 border-r border-gray-200"></td>
                        <td className="p-1 text-right border-r border-gray-200 font-mono">
                          {totalObj.hours.toLocaleString()}
                        </td>
                        <td className="p-1 text-right border-r border-gray-400 bg-cyan-300 font-mono border-b-2 border-double border-black">
                          {totalObj.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              )}

              {/* OTHER COSTS HEADER ROW */}
              <tr className="font-bold bg-white border-t-2 border-black">
                <td
                  colSpan={1 + contracts.length * 3}
                  className="p-1 border-b border-gray-400 sticky left-0 bg-white"
                >
                  OTHER COSTS
                </td>
              </tr>

              {/* Material Costs (3) */}
              <tr className="hover:bg-gray-50">
                <td className="p-1 border-r border-gray-300 sticky left-0 bg-white z-10 whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] font-medium">
                  Material Costs (3)
                </td>
                {contracts.map((c) => (
                  <React.Fragment key={c.key}>
                    <td className="p-1 border-r border-gray-200"></td>
                    <td className="p-1 border-r border-gray-200"></td>
                    <td className="p-1 text-right border-r border-gray-400 font-mono">
                      {c.materialCost ? c.materialCost.toLocaleString() : "-"}
                    </td>
                  </React.Fragment>
                ))}
              </tr>

              {/* Subcontractor */}
              <tr className="hover:bg-gray-50">
                <td className="p-1 border-r border-gray-300 sticky left-0 bg-white z-10 whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] font-medium">
                  Subcontractor
                </td>
                {contracts.map((c) => (
                  <React.Fragment key={c.key}>
                    <td className="p-1 border-r border-gray-200"></td>
                    <td className="p-1 border-r border-gray-200"></td>
                    <td className="p-1 text-right border-r border-gray-400 font-mono">
                      {c.subcontractor ? c.subcontractor.toLocaleString() : "-"}
                    </td>
                  </React.Fragment>
                ))}
              </tr>

              {/* Material Overhead Row */}
              <tr className="hover:bg-gray-50">
                <td className="p-1 border-r border-gray-300 sticky left-0 bg-white z-10 whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] font-medium">
                  <div className="flex justify-between items-center pr-2">
                    <span>Material Overhead</span>
                    <span className="bg-blue-600 text-white text-[9px] px-1 font-bold">
                      Sched A
                    </span>
                  </div>
                </td>
                {contracts.map((c) => (
                  <React.Fragment key={c.key}>
                    <td className="p-1 text-right border-r border-gray-200 bg-yellow-200 font-bold">
                      2.42%
                    </td>
                    <td className="p-1 border-r border-gray-200"></td>
                    <td className="p-1 text-right border-r border-gray-400 font-mono">
                      {c.materialOverhead
                        ? c.materialOverhead.toLocaleString()
                        : "-"}
                    </td>
                  </React.Fragment>
                ))}
              </tr>

              {/* Travel Costs (3) */}
              <tr className="hover:bg-gray-50">
                <td className="p-1 border-r border-gray-300 sticky left-0 bg-white z-10 whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] font-medium">
                  Travel Costs (3)
                </td>
                {contracts.map((c) => (
                  <React.Fragment key={c.key}>
                    <td className="p-1 border-r border-gray-200"></td>
                    <td className="p-1 border-r border-gray-200"></td>
                    <td className="p-1 text-right border-r border-gray-400 font-mono">
                      {c.travelCost ? c.travelCost.toLocaleString() : "-"}
                    </td>
                  </React.Fragment>
                ))}
              </tr>

              {/* ODC */}
              <tr className="hover:bg-gray-50">
                <td className="p-1 border-r border-gray-300 sticky left-0 bg-white z-10 whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] font-medium">
                  ODC
                </td>
                {contracts.map((c) => (
                  <React.Fragment key={c.key}>
                    <td className="p-1 border-r border-gray-200"></td>
                    <td className="p-1 border-r border-gray-200"></td>
                    <td className="p-1 text-right border-r border-gray-400 font-mono">
                      {c.odcCost ? c.odcCost.toLocaleString() : "-"}
                    </td>
                  </React.Fragment>
                ))}
              </tr>

              {/* G&A Rate Row */}
              <tr className="hover:bg-gray-50">
                <td className="p-1 border-r border-gray-300 sticky left-0 bg-white z-10 whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] font-medium">
                  <div className="flex justify-between items-center pr-2">
                    <div className="flex items-center space-x-1">
                      <span className="font-bold">G&amp;A @:</span>
                      <span className="bg-blue-600 text-white text-[9px] px-1 font-bold">
                        Sched A
                      </span>
                    </div>
                    <span className="font-bold">(4)</span>
                  </div>
                </td>
                {contracts.map((c) => (
                  <React.Fragment key={c.key}>
                    <td className="p-1 text-right border-r border-gray-200 bg-yellow-200 font-bold">
                      12.99%
                    </td>
                    <td className="p-1 border-r border-gray-200"></td>
                    <td className="p-1 text-right border-r border-gray-400 bg-cyan-300 font-mono">
                      -
                    </td>
                  </React.Fragment>
                ))}
              </tr>

              {/* Subtotal Row */}
              <tr className="hover:bg-gray-50">
                <td className="p-1 border-r border-gray-300 sticky left-0 bg-white z-10 whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] font-bold">
                  Subtotal
                </td>
                {contracts.map((c) => (
                  <React.Fragment key={c.key}>
                    <td className="p-1 border-r border-gray-200"></td>
                    <td className="p-1 border-r border-gray-200"></td>
                    <td className="p-1 text-right border-r border-gray-400 bg-cyan-300 font-mono border-b border-black">
                      -
                    </td>
                  </React.Fragment>
                ))}
              </tr>

              {/* FINAL TOTAL ROW */}
              <tr className="font-bold bg-white">
                <td className="p-1 border-r border-gray-300 sticky left-0 bg-white z-10 whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  TOTAL
                </td>
                {contracts.map((c) => {
                  const totalObj = contractLaborTotals[c.key] || { amount: 0 };
                  return (
                    <React.Fragment key={c.key}>
                      <td className="p-1 border-r border-gray-200"></td>
                      <td className="p-1 border-r border-gray-200"></td>
                      <td className="p-1 text-right border-r border-gray-400 bg-cyan-300 font-mono border-b-2 border-double border-black">
                        {totalObj.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>

              {/* TASK CEILINGS ROW */}
              <tr className="font-bold bg-white">
                <td className="p-1 border-r border-gray-300 sticky left-0 bg-white z-10 whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  Task Ceilings
                </td>
                {contracts.map((c) => (
                  <React.Fragment key={c.key}>
                    <td className="p-1 border-r border-gray-200"></td>
                    <td className="p-1 border-r border-gray-200"></td>
                    <td className="p-1 text-right border-r border-gray-400 font-mono border-b-2 border-double border-black">
                      {c.taskCeiling ? c.taskCeiling.toLocaleString() : "-"}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Explanatory Notes & Color Legend Section */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-start gap-4">
        {/* Notes Box */}
        <div className="border border-black p-3 max-w-xl w-full text-[11px] leading-tight bg-white">
          <div className="font-bold mb-1">Explanatory Notes:</div>
          <ol className="list-none space-y-1 pl-0">
            <li>
              (1) Represents effort performed by the company. Any subcontract
              effort should be identified separately.
            </li>
            <li>
              (2) Represents rates specified in the contract which may be higher
              or lower than actual rates incurred.
            </li>
            <li>(3) Represents actual costs recorded in the cost records.</li>
            <li>
              (4) G&amp;A applied at the claimed rate excluding the Material and
              Travel Costs.
            </li>
          </ol>
        </div>

        {/* Legend Box */}
        <div className="text-[11px] space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-44 px-1 py-0.5 bg-cyan-300 border border-gray-400 font-bold text-center inline-block">
              Cell Contains a Formula
            </span>
            <span>Indicates Summary Amounts</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-44 px-1 py-0.5 bg-yellow-300 border border-gray-400 font-bold text-center inline-block">
              Linked to Other Worksheet
            </span>
            <span>Linked to Schedule A Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedK;
