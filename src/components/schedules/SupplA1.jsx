import React, { useEffect, useState } from "react";
import { backendUrl } from "../config";

const SupplA1Table = ({
  onNavigate,
  companyName,
  companyAddress,
  explanatoryNote,
  setExplanatoryNote,
  year,
  fiscalYearEnd,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const fiscalYearEnd = `12/31/${year}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/TrialBalance/supply_A1_cost?fyCd=${year}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to convert schedule codes or fallback labels to matching TABS_CONFIG tab IDs
  const getTabIdFromSchedCode = (schedCode, fallbackIndex) => {
    const rawCode = (
      schedCode || `SCHED C (${fallbackIndex + 1})`
    ).toLowerCase();

    if (rawCode.includes("c (1)") || rawCode.includes("c1")) return "sched_c1";
    if (rawCode.includes("c (2)") || rawCode.includes("c2")) return "sched_c2";
    if (rawCode.includes("c (6)") || rawCode.includes("c6")) return "sched_c6";
    if (rawCode.includes("c (3)") || rawCode.includes("c3")) return "sched_c3";
    if (rawCode.includes("c (4)") || rawCode.includes("c4")) return "sched_c4";
    if (rawCode.includes("c (5)") || rawCode.includes("c5")) return "sched_c5";

    return "sched_c1"; // Default fallback
  };

  const handleScheduleClick = (schedule, sIdx) => {
    if (onNavigate) {
      const targetTabId = getTabIdFromSchedCode(schedule.schedCode, sIdx);
      onNavigate(targetTabId);
    }
  };

  const formatNumber = (val, isCurrency = true) => {
    if (val === null || val === undefined) return "-";
    if (val === 0) return "0";
    const formatted = Math.abs(val).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return val < 0 ? `(${formatted})` : formatted;
  };

  const formatPercent = (val) => {
    if (val === null || val === undefined) return "0.0%";
    return `${Number(val).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="p-4 font-sans text-sm">Loading Schedule Data...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 font-sans text-sm text-red-600">Error: {error}</div>
    );
  }

  return (
    <div className="bg-white p-4 font-sans text-[11px] text-black min-w-[1000px]">
      {/* Top Header Section */}
      <div className="grid grid-cols-12 gap-2 mb-4">
        <div className="col-span-3 text-[10px] space-y-1">
          <div>This Schedule can be linked to Schedule C(x)</div>
          <div>With VLOOKUP or copied from Schedule C(x).</div>
          <div className="pt-2">Schedule C (x), Overheads</div>
          <div className="text-blue-700 font-semibold underline cursor-pointer">
            ICE MANUAL
          </div>
        </div>

        <div className="col-span-6 text-center">
          <div className="font-bold text-xs bg-[#FFFF00] inline-block px-2 py-0.5 mb-1 border border-black">
            {companyName}
          </div>
          <div className="text-[10px] font-bold">{companyAddress}</div>
          <div className="font-bold text-xs mt-1">
            COMPARATIVE ANALYSIS OF INDIRECT EXPENSE POOLS DETAILED BY ACCOUNT
            TO
          </div>
          <div className="font-bold text-xs">
            PRIOR FISCAL YEAR AND BUDGETARY DATA - OVERHEAD EXPENSES
          </div>
          <div className="font-bold text-xs bg-[#FFFF00] inline-block px-2 py-0.5 mt-1 border border-black">
            Fiscal Year End - {fiscalYearEnd}
          </div>
        </div>

        <div className="col-span-3 text-right text-[10px] space-y-1">
          <div className="font-bold">SUPPLEMENTAL A-1</div>
          <div className="font-bold">OPTIONAL SCH.</div>
          <div className="font-bold">ICE (version 2.0.1h)</div>
        </div>
      </div>

      {/* Schedules Section */}
      {data?.schedules?.map((schedule, sIdx) => (
        <div key={sIdx} className="mb-6">
          <div className="flex border border-black border-b-0">
            {/* Table Area */}
            <div className="flex-1">
              {/* Section Header */}
              <div className="bg-[#A0B0E0] font-bold italic px-2 py-1 text-blue-900 border-b border-black text-xs">
                {schedule.name}
              </div>

              {/* Table Headers */}
              <table className="w-full border-collapse text-[10px]">
                <thead>
                  <tr className="border-b border-black font-bold text-center bg-white">
                    <th className="border-r border-black p-1 text-left w-[12%]">
                      ACC'T NO.
                    </th>
                    <th className="border-r border-black p-1 text-left w-[38%]">
                      DESCRIPTION
                    </th>
                    <th className="border-r border-black p-1 w-[12%]">
                      CLAIMED
                      <br />
                      PRIOR YR
                    </th>
                    <th className="border-r border-black p-1 w-[12%]">
                      CLAIMED
                      <br />
                      CURRENT YR
                    </th>
                    <th className="border-r border-black p-1 w-[12%]">
                      $ CHANGE
                    </th>
                    <th className="border-r border-black p-1 w-[7%]">
                      % CHANGE
                    </th>
                    <th className="p-1 w-[7%]">
                      PERCENT
                      <br />
                      TO TOTAL
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.rows?.map((row, rIdx) => {
                    const isSubtotal = row.totalName === "Subtotal";
                    const isTotalOverhead =
                      row.totalName?.includes("Total Overhead");
                    const isIntermediate =
                      row.totalName === "Total Intermediate Allocations";
                    const isHighlightName =
                      row.acctName?.includes("California Intermediate") ||
                      row.totalName?.includes("California Intermediate");

                    return (
                      <tr key={rIdx} className="border-b border-slate-300">
                        {/* Account No */}
                        <td className="border-r border-black px-1.5 py-0.5 font-mono">
                          {row.acctId || ""}
                        </td>

                        {/* Description */}
                        <td
                          className={`border-r border-black px-1.5 py-0.5 ${
                            isSubtotal || isTotalOverhead || isIntermediate
                              ? "font-bold"
                              : ""
                          }`}
                        >
                          {isHighlightName ? (
                            <span className="bg-[#FFFF00] px-1 font-bold inline-block border border-black">
                              {row.acctName || row.totalName}
                            </span>
                          ) : (
                            row.acctName || row.totalName
                          )}
                        </td>

                        {/* Claimed Prior Yr */}
                        <td
                          className={`border-r border-black px-1.5 py-0.5 text-right font-mono ${
                            isSubtotal || isTotalOverhead ? "bg-[#00FFFF]" : ""
                          }`}
                        >
                          {formatNumber(row.claimedPriorYr)}
                        </td>

                        {/* Claimed Current Yr */}
                        <td
                          className={`border-r border-black px-1.5 py-0.5 text-right font-mono ${
                            isSubtotal || isTotalOverhead
                              ? "bg-[#00FFFF] font-bold"
                              : "bg-[#FFFF00]"
                          }`}
                        >
                          {formatNumber(row.claimedCurrentYr)}
                        </td>

                        {/* $ Change */}
                        <td
                          className={`border-r border-black px-1.5 py-0.5 text-right font-mono bg-[#00FFFF] ${
                            isSubtotal || isTotalOverhead ? "font-bold" : ""
                          }`}
                        >
                          {formatNumber(row.changeDollar)}
                        </td>

                        {/* % Change */}
                        <td className="border-r border-black px-1.5 py-0.5 text-right font-mono bg-[#00FFFF]">
                          {formatPercent(row.changePercent)}
                        </td>

                        {/* Percent to Total */}
                        <td className="px-1.5 py-0.5 text-right font-mono bg-[#00FFFF]">
                          {formatPercent(row.total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Side Blue Navigation Button */}
            <div
              onClick={() => handleScheduleClick(schedule, sIdx)}
              className="w-[120px] bg-[#0000FF] hover:bg-[#0000CC] border-l border-black text-white font-bold flex items-start justify-center pt-2 text-xs border-b border-black cursor-pointer select-none transition-colors"
            >
              {schedule.schedCode || `SCHED C (${sIdx + 1})`}
            </div>
          </div>
        </div>
      ))}

      {/* Footer Legend Section */}
      <div className="mt-8 space-y-1 text-[10px]">
        <div className="flex items-center gap-2">
          <span className="bg-[#FFFF00] px-2 py-0.5 border border-black inline-block font-semibold">
            Linked to Other Worksheet
          </span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <span className="bg-[#00FFFF] px-2 py-0.5 border border-black inline-block font-semibold">
            Cell Contains a Formula
          </span>
        </div>
        {/* <div className="mt-4 pt-2 border-t border-gray-400">
          <span className="font-bold">Note:</span>
          <p className="text-gray-700">
            Initial Filing Status: FY 2025 represents the Company's initial
            Incurred Cost Submission. As such, there are no 'Prior Year Claimed'
            indirect costs reported in Supplement A-1. All balances reflect only
            the current fiscal year performance.
          </p>
        </div> */}
        <div className="mt-8 border p-4 bg-gray-50 rounded">
          <label className="block font-bold underline mb-2 text-sm">
            Explanatory Notes:
          </label>
          <textarea
            value={explanatoryNote}
            onChange={(e) => setExplanatoryNote(e.target.value)}
            rows={4}
            className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            placeholder="Type explanatory notes here..."
          />
        </div>
      </div>
    </div>
  );
};

export default SupplA1Table;
