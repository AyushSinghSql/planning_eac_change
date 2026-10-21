import React, { useEffect, useState } from "react";
import { backendUrl } from "../config";

const SupplA4Table = ({
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
          `${backendUrl}/api/TrialBalance/supply_A4_cost?fyCd=${year}`,
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

  const handleScheduleClick = () => {
    if (onNavigate) {
      onNavigate("summary_sch_h");
    }
  };

  const formatNumber = (val) => {
    if (val === null || val === undefined) return "-";
    if (val === 0) return "-";
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

  // Map note numbers based on account name
  const getNoteIndex = (acctName) => {
    switch (acctName) {
      case "Direct Labor - OH - Onsite":
        return "1";
      case "Travel":
        return "2";
      case "Other Direct Costs":
        return "3";
      case "Subcontracts":
        return "4";
      default:
        return "";
    }
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

  const rows = data?.rows || [];

  return (
    <div className="bg-white p-4 font-sans text-[11px] text-black min-w-[1050px]">
      {/* Top Header Section */}
      <div className="grid grid-cols-12 gap-2 mb-6">
        {/* Left Sub-header */}
        <div className="col-span-3 text-[10px] space-y-1">
          <div className="font-semibold">
            This Schedule is linked to Summary Sch H
          </div>
          <div className="pt-1 text-blue-700 font-semibold underline cursor-pointer">
            ICE MANUAL
          </div>
        </div>

        {/* Center Main Header */}
        <div className="col-span-6 text-center">
          <div className="font-bold text-xs bg-[#FFFF00] inline-block px-4 py-0.5 mb-1 border border-black">
            {companyName}
          </div>
          <div className="text-[10px] font-bold">{companyAddress}</div>
          <div className="font-bold text-xs mt-1">
            COMPARATIVE ANALYSIS OF INDIRECT EXPENSE POOLS DETAILED BY
          </div>
          <div className="font-bold text-xs">
            ACCOUNT TO PRIOR FISCAL YEAR AND BUDGETARY DATA - DIRECT
          </div>
          <div className="font-bold text-xs bg-[#FFFF00] inline-block px-4 py-0.5 mt-1 border border-black">
            Fiscal Year End - {fiscalYearEnd}
          </div>
        </div>

        {/* Right Info Box */}
        <div className="col-span-3 text-right text-[10px] space-y-1">
          <div className="font-bold">SUPPLEMENTAL A-4</div>
          <div className="font-bold">OPTIONAL SCH.</div>
          <div className="font-bold">ICE (version 2.0.1h)</div>
        </div>
      </div>

      {/* Main Table Structure */}
      <div className="relative max-w-[950px] mx-auto border border-black">
        {/* Navigation Button Overlay aligned with Current Yr Column Header */}
        <div className="absolute -top-6 left-[48%] -translate-x-1/2">
          <button
            onClick={handleScheduleClick}
            className="bg-[#0000FF] hover:bg-[#0000CC] text-white font-bold text-[10px] px-6 py-0.5 border border-black shadow-sm transition-colors"
          >
            Summary Sch H
          </button>
        </div>

        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr className="border-b border-black font-bold text-center bg-white">
              <th className="border-r border-black p-1 text-left w-[35%]">
                DESCRIPTION
              </th>
              <th className="border-r border-black p-1 w-[11%]">
                CLAIMED
                <br />
                PRIOR YR
              </th>
              <th className="border-r border-black p-1 w-[11%]">Adjustment</th>
              <th className="border-r border-black p-1 w-[13%]">
                CLAIMED
                <br />
                CURRENT YR
              </th>
              <th className="border-r border-black p-1 w-[12%]">$ CHANGE</th>
              <th className="border-r border-black p-1 w-[8%]">% CHANGE</th>
              <th className="border-r border-black p-1 w-[8%]">
                PERCENT
                <br />
                TO TOTAL
              </th>
              <th className="p-1 w-[4%]">Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => {
              const isTotalDirectLabor = row.totalName === "Total Direct Labor";
              const isTotalDirectCosts = row.totalName === "Total Direct Costs";
              const isHighlightedRow =
                row.acctName === "Direct Labor - OH - Onsite" ||
                row.acctName === "Direct Labor - OH - Offsite";
              const noteIndex = getNoteIndex(row.acctName);

              return (
                <tr
                  key={rIdx}
                  className={`border-b ${
                    isTotalDirectLabor || isTotalDirectCosts
                      ? "border-black font-bold"
                      : "border-slate-200"
                  }`}
                >
                  {/* Description */}
                  <td
                    className={`border-r border-black px-2 py-1 ${
                      isHighlightedRow ? "bg-[#FFFF00] font-bold" : ""
                    }`}
                  >
                    {row.acctName || row.totalName}
                  </td>

                  {/* Claimed Prior Yr */}
                  <td className="border-r border-black px-2 py-1 text-center font-mono">
                    {formatNumber(row.claimedPriorYr)}
                  </td>

                  {/* Adjustment */}
                  <td className="border-r border-black px-2 py-1 text-right font-mono">
                    {formatNumber(row.adjustment)}
                  </td>

                  {/* Claimed Current Yr */}
                  <td
                    className={`border-r border-black px-2 py-1 text-right font-mono ${
                      isTotalDirectCosts ? "bg-[#00FFFF]" : "bg-[#FFFF00]"
                    }`}
                  >
                    {formatNumber(row.claimedCurrentYr)}
                  </td>

                  {/* $ Change */}
                  <td className="border-r border-black px-2 py-1 text-right font-mono bg-[#00FFFF]">
                    {formatNumber(row.changeDollar)}
                  </td>

                  {/* % Change */}
                  <td className="border-r border-black px-2 py-1 text-center font-mono bg-[#00FFFF]">
                    N/A
                  </td>

                  {/* Percent to Total */}
                  <td className="border-r border-black px-2 py-1 text-right font-mono bg-[#00FFFF]">
                    {formatPercent(row.total)}
                  </td>

                  {/* Note Index */}
                  <td className="px-1 py-1 text-center font-bold">
                    {noteIndex}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Explanatory Notes Section */}
      {/* <div className="mt-6 max-w-[950px] mx-auto text-[10px] space-y-1">
        <div className="font-bold underline mb-1">Explanatory Notes:</div>
        <div>
          1. Non reimbursable Labor cost to the project 80NM0018D0004 for $212
          has been adjusted from claimed labor cost.
        </div>
        <div>
          2. Non reimbursable travel cost to the project 80GFSC25CA034
          ($1,165.15) and 47QFCA21F0001 (440.02) has been updated as adjustment
          from the claimed Travel costs.
        </div>
        <div>
          3. Non reimbursable ODC cost to the project 4400574846 for $2,953.60
          has been updated as adjustment from the claimed ODC costs.
        </div>
        <div>
          4. A contract limitation of $276K for project 80GFSC25CA034 has been
          applied to Teammate Fee Costs, as these are not claimed.
        </div>
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

      {/* Footer Legend Section */}
      <div className="mt-8 max-w-[950px] mx-auto space-y-2 text-[10px]">
        <div className="flex items-center gap-2">
          <span className="bg-[#FFFF00] px-2 py-0.5 border border-black inline-block font-semibold">
            Linked to Other Worksheet
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-[#00FFFF] px-2 py-0.5 border border-black inline-block font-semibold">
            Cell Contains a Formula
          </span>
        </div>

        <div className="pt-2 border-t border-gray-300 text-gray-700">
          <span className="font-bold">Note:</span>
          <p>
            This is the contractor's initial Incurred Cost Submission;
            therefore, prior year claimed amounts are not applicable and are
            reflected as zero.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupplA4Table;
