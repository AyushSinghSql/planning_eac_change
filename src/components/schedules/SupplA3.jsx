import React, { useEffect, useState } from "react";
import { backendUrl } from "../config";

const SupplA3Table = ({
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
          `${backendUrl}/api/TrialBalance/supply_A3_cost?fyCd=${year}`,
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
      onNavigate("sched_d_2");
    }
  };

  const formatNumber = (val) => {
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
    <div className="bg-white p-4 font-sans text-[11px] text-black min-w-[1050px]">
      {/* Top Header Section */}
      <div className="grid grid-cols-12 gap-2 mb-4">
        {/* Left Sub-header */}
        <div className="col-span-3 text-[10px] space-y-1">
          <div>This Schedule cab be linked to Schedule D(x)</div>
          <div>With VLOOKUP or copied from Schedule D(x).</div>
          <div className="pt-2 text-blue-700 font-semibold underline cursor-pointer">
            Schedule C (x), Overheads
          </div>
          <div className="text-blue-700 font-semibold underline cursor-pointer">
            ICE MANUAL
          </div>
        </div>

        {/* Center Main Header */}
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
            PRIOR FISCAL YEAR AND BUDGETARY DATA - INTERMEDIATE POOL COSTS
          </div>
          <div className="font-bold text-xs bg-[#FFFF00] inline-block px-2 py-0.5 mt-1 border border-black">
            Fiscal Year End - {fiscalYearEnd}
          </div>
        </div>

        {/* Right Info Box & Build Schedule Button */}
        <div className="col-span-3 text-right text-[10px] space-y-1">
          <div className="font-bold">SUPPLEMENTAL A-3</div>
          <div className="font-bold">OPTIONAL SCH.</div>
          <div className="font-bold">ICE (version 2.0.1h)</div>

          {/* Red Action Box */}
          {/* <div className="bg-[#800000] text-white text-[9px] p-2 mt-2 text-left rounded-sm border border-black shadow">
            <p className="mb-2 leading-tight">
              A routine has been developed to copy data from the Sched Ds to the
              appropriate areas of Suppl A-3. If you have completed Sched Ds
              (i.e. copied or input account level data) click this button to
              expand this schedule and copy in the appropriate Sched D(x) data.
            </p>
            <p className="mb-2 leading-tight italic">
              Note, this process cannot be un-done so it is best to save your
              file now, then, if after clicking the button the data on this
              schedule does not look proper simply close the file without
              saving.
            </p>
            <div className="text-right">
              <button className="bg-white text-black font-bold px-3 py-1 text-[10px] border border-black shadow-sm hover:bg-gray-200 transition-colors">
                Build Schedule
              </button>
            </div>
          </div> */}
        </div>
      </div>

      {/* Schedules Section */}
      {data?.schedules?.map((schedule, sIdx) => (
        <div key={sIdx} className="mb-6">
          {/* Section Header Banner */}
          <div className="bg-[#C0C0C0] border border-black px-2 py-1 font-bold italic text-blue-900 underline text-xs">
            {schedule.name}
          </div>

          <div className="flex border border-black border-t-0 border-b-0">
            {/* Table Area */}
            <div className="flex-1">
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
                    const isTotalPool =
                      row.totalName === "Intermediate Pool Total";
                    const isIntermediate =
                      row.totalName === "Intermediate Allocations:";

                    return (
                      <tr key={rIdx} className="border-b border-slate-300">
                        {/* Account No */}
                        <td className="border-r border-black px-1.5 py-0.5 font-mono">
                          {row.acctId || ""}
                        </td>

                        {/* Description */}
                        <td
                          className={`border-r border-black px-1.5 py-0.5 ${
                            isSubtotal || isTotalPool || isIntermediate
                              ? "font-bold"
                              : ""
                          }`}
                        >
                          {row.acctName || row.totalName}
                        </td>

                        {/* Claimed Prior Yr */}
                        <td
                          className={`border-r border-black px-1.5 py-0.5 text-right font-mono ${
                            isSubtotal || isTotalPool ? "bg-[#00FFFF]" : ""
                          }`}
                        >
                          {formatNumber(row.claimedPriorYr)}
                        </td>

                        {/* Claimed Current Yr */}
                        <td
                          className={`border-r border-black px-1.5 py-0.5 text-right font-mono ${
                            isSubtotal || isTotalPool
                              ? "bg-[#00FFFF] font-bold"
                              : "bg-[#FFFF00]"
                          }`}
                        >
                          {formatNumber(row.claimedCurrentYr)}
                        </td>

                        {/* $ Change */}
                        <td
                          className={`border-r border-black px-1.5 py-0.5 text-right font-mono bg-[#00FFFF] ${
                            isSubtotal || isTotalPool ? "font-bold" : ""
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
              onClick={handleScheduleClick}
              className="w-[120px] bg-[#0000FF] hover:bg-[#0000CC] border-l border-black border-b border-black text-white font-bold flex items-start justify-center pt-2 text-xs cursor-pointer select-none transition-colors"
            >
              Sched D (2)
            </div>
          </div>
        </div>
      ))}

      {/* Footer Legend Section */}
      <div className="mt-8 space-y-1 text-[10px]">
        {/* <div className="mt-4 pt-2 border-t border-gray-400">
          <span className="font-bold">Note:</span>
          <p className="text-gray-700">
            Initial Filing Status: FY 2025 represents the Company's initial
            Incurred Cost Submission. As such, there are no 'Prior Year Claimed'
            indirect costs reported in Supplement A-3. All balances reflect only
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
        <div className="flex items-center gap-2 pt-2">
          <span className="bg-[#FFFF00] px-2 py-0.5 border border-black inline-block font-semibold">
            Linked to Other Worksheet
          </span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <span className="bg-[#00FFFF] px-2 py-0.5 border border-black inline-block font-semibold">
            Cell Contains a Formula
          </span>
        </div>
      </div>
    </div>
  );
};

export default SupplA3Table;
