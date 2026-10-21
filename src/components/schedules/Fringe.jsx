// // import React from "react";

// // const DETAIL_GRID = "grid grid-cols-[250px_180px_150px_120px_140px_80px_160px]";

// // const ALLOCATION_GRID = "grid grid-cols-[250px_145px_110px_90px_145px_140px]";

// // const AllocationReference = ({ children, className = "" }) => (
// //   <div
// //     className={`flex h-[20px] items-center justify-center bg-[#211fae] px-3 text-[13px] font-bold text-white underline ${className}`}
// //   >
// //     {children}
// //   </div>
// // );

// // const FormulaCell = ({ children, className = "" }) => (
// //   <div
// //     className={`min-h-[19px] border-b border-[#08767b] bg-[#27c4c7] px-2 text-right text-[12px] ${className}`}
// //   >
// //     {children}
// //   </div>
// // );

// // const InputCell = ({ children, className = "" }) => (
// //   <div
// //     className={`min-h-[19px] bg-[#fff200] px-2 text-right text-[12px] ${className}`}
// //   >
// //     {children}
// //   </div>
// // );

// // const HatchedCell = ({ className = "" }) => (
// //   <div
// //     className={`min-h-[18px] bg-[repeating-linear-gradient(-45deg,#1f1f1f_0px,#1f1f1f_1px,#666_1px,#666_2px)] ${className}`}
// //   />
// // );

// // const fringeRows = [
// //   ["60-01-01", "PTO Accrual", "2,39,327"],
// //   ["60-01-02", "Holiday", "1,19,852"],
// //   ["60-01-05", "Jury Duty", "9,132"],
// //   ["60-01-07", "Admin Leave", "28,448"],
// //   ["60-01-08", "Sick Leave", "45,730"],
// //   ["60-01-14", "NHP PTO Accrual", "2,18,103"],
// //   ["60-02-01", "Group Medical Dental", "16,63,430"],
// //   ["60-02-02", "Flex Benefits Admin", "3,254"],
// //   ["60-03-01", "Life Disability Insurance", "8,078"],
// //   ["60-03-07", "Workers Comp Insurance", "15,435"],
// //   ["60-03-08", "HR Benefits Solutions Exp", "52,780"],
// //   ["60-03-13", "Severance", "5,069"],
// //   ["60-05-02", "401 k Discretionary Contr", "5,17,580"],
// //   ["60-05-03", "401 k Prevailing Wage", "91,902"],
// //   ["60-05-04", "401 k Plan Expense", "23,231"],
// //   ["60-06-01", "Professional Dev Tuition", "1,320"],
// //   ["60-06-03", "Cash in Lieu of Benefits", "28,658"],
// //   ["60-06-04", "Health & Welfare", "5,740"],
// //   ["60-06-05", "Incentive Compensation", "1,66,050"],
// //   ["60-06-07", "Severance", "1,500"],
// //   ["61-01-01", "Social Security Taxes", "16,85,717"],
// //   ["61-01-02", "Medicare Taxes", "4,22,180"],
// //   ["61-02-03", "SUTA Taxes", "86,075"],
// // ];

// // export default function Fringe() {
// //   return (
// //     <div className="w-full bg-[#e7e7e7] font-serif text-[12px] text-black">
// //       {/* ========================================================= */}
// //       {/* SCREEN 1 - FRINGE POOL DETAIL */}
// //       {/* ========================================================= */}

// //       <div className="relative min-h-screen border border-gray-400 pb-8">
// //         {/* Top Header */}

// //         <div className="grid grid-cols-[250px_590px_1fr]">
// //           <div className="px-1 pt-1 leading-[18px]">
// //             <div>Schedule Fringe is linked to the following</div>
// //             <div>schedule(s):</div>
// //             <div>Schedule D (x)</div>
// //             <div className="text-[#0000aa] underline">ICE MANUAL</div>
// //           </div>

// //           <div className="pt-4">
// //             <div className="bg-[#fff200] py-[2px] text-center font-bold">
// //               Columbus Technologies, Inc.
// //             </div>

// //             <div className="bg-[#fff200] py-[2px] text-center font-bold">
// //               California
// //             </div>

// //             <div className="mt-4 bg-[#fff200] py-[2px] text-center font-bold">
// //               Fringe Pool
// //             </div>

// //             <div className="bg-[#fff200] py-[2px] text-center font-bold">
// //               Fiscal Year End - 12/31/2025
// //             </div>
// //           </div>

// //           <div className="pl-6 pt-1">
// //             <div className="font-bold">SCHEDULE Fringe</div>
// //             <div className="font-bold">ICE (version 2.0.1h)</div>
// //           </div>
// //         </div>

// //         {/* Detail Table Header */}

// //         <div className="mt-10 w-[965px]">
// //           <div className={DETAIL_GRID}>
// //             <div className="text-center font-bold leading-[14px]">
// //               ACCOUNT
// //               <br />
// //               NUMBER
// //             </div>

// //             <div className="text-center font-bold">DESCRIPTION</div>

// //             <div className="text-center font-bold leading-[14px]">
// //               PER G/L
// //               <br />& TRIAL BAL/FS
// //             </div>

// //             <div className="text-center font-bold">ADJUSTMENT</div>

// //             <div className="text-center font-bold">CLAIMED</div>

// //             <div className="text-center font-bold">NOTES</div>

// //             <div className="text-center font-bold">REFERENCE</div>
// //           </div>

// //           <div className="w-[1080px] border-t border-black" />

// //           {/* Detail Rows */}

// //           {fringeRows.map(([account, description, amount]) => (
// //             <div
// //               key={`${account}-${description}`}
// //               className={`${DETAIL_GRID} min-h-[19px]`}
// //             >
// //               <div className="px-1">{account}</div>

// //               <div className="px-1">{description}</div>

// //               <div className="px-2 text-right">{amount}</div>

// //               <div />

// //               <FormulaCell>{amount}</FormulaCell>

// //               <div />
// //             </div>
// //           ))}

// //           {/* Total */}

// //           {/* Total */}

// //           <div className={`${DETAIL_GRID} mt-1 items-center`}>
// //             <div />

// //             <div className="font-bold">Total</div>

// //             <FormulaCell>87,48,308</FormulaCell>

// //             <FormulaCell>-</FormulaCell>

// //             <FormulaCell>87,48,308</FormulaCell>

// //             {/* Notes column */}
// //             <div />

// //             {/* Reference column */}
// //             <div className="ml-[25px] flex items-center gap-2">
// //               <span className="text-[12px]">TO</span>

// //               <AllocationReference className="w-[110px]">
// //                 Sched A
// //               </AllocationReference>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* ========================================================= */}
// //       {/* SCREEN 2 - ALLOCATION OF EXPENSES */}
// //       {/* ========================================================= */}

// //       <div className="min-h-screen border-t-2 border-gray-500 pb-10">
// //         <div className="pt-3">
// //           <div className="px-1 text-[12px] leading-[18px]">
// //             Allocation of Expenses Based on
// //             <br />
// //             Straight-Time Labor Dollars
// //           </div>
// //         </div>

// //         <div className="mt-5 flex">
// //           {/* LEFT TABLE */}

// //           <div>
// //             {/* Column Headings */}

// //             <div className={`${ALLOCATION_GRID} items-end`}>
// //               <div />

// //               <div className="text-center font-bold leading-[14px]">
// //                 Base
// //                 <br />
// //                 Labor Dollars
// //               </div>

// //               <div className="text-center font-bold leading-[14px]">
// //                 % of
// //                 <br />
// //                 Total
// //               </div>

// //               <div className="text-center font-bold">Adjustments</div>

// //               <div className="text-center font-bold leading-[14px]">
// //                 Claimed
// //                 <br />
// //                 Expense
// //                 <br />
// //                 Allocation
// //               </div>

// //               <div className="text-center font-bold leading-[14px]">
// //                 Allocation
// //                 <br />
// //                 based on
// //                 <br />
// //                 Per G/L Amts
// //               </div>
// //             </div>

// //             <div className="border-t border-black" />

// //             {/* G&A */}

// //             <div className={ALLOCATION_GRID}>
// //               <div className="font-bold">G & A</div>
// //               <HatchedCell />
// //               <HatchedCell />
// //               <HatchedCell />
// //               <HatchedCell />
// //               <HatchedCell />
// //             </div>

// //             <div className={ALLOCATION_GRID}>
// //               <div />
// //               <div className="px-1 text-right">19,90,655</div>
// //               <FormulaCell>7.58%</FormulaCell>
// //               <div />
// //               <FormulaCell>66,341</FormulaCell>
// //               <FormulaCell>66,341</FormulaCell>
// //             </div>

// //             {/* OH ON-SITE */}

// //             <div className={ALLOCATION_GRID}>
// //               <div className="font-bold">O/H - OH - Onsite</div>
// //               <HatchedCell />
// //               <HatchedCell />
// //               <HatchedCell />
// //               <HatchedCell />
// //               <HatchedCell />
// //             </div>

// //             <div className={ALLOCATION_GRID}>
// //               <div>Indirect Labor</div>
// //               <div className="px-1 text-right">384</div>
// //               <FormulaCell>0.00%</FormulaCell>
// //               <div />
// //               <FormulaCell>116</FormulaCell>
// //               <FormulaCell>116</FormulaCell>
// //             </div>

// //             <div className={ALLOCATION_GRID}>
// //               <div>Direct Labor</div>
// //               <div className="px-1 text-right">2,08,53,994</div>
// //               <FormulaCell>79.45%</FormulaCell>
// //               <div />
// //               <FormulaCell>69,50,593</FormulaCell>
// //               <FormulaCell>69,50,593</FormulaCell>
// //             </div>

// //             {/* OH OFFSITE */}

// //             <div className={ALLOCATION_GRID}>
// //               <div className="font-bold">O/H - OH - Offsite</div>
// //               <HatchedCell />
// //               <HatchedCell />
// //               <HatchedCell />
// //               <HatchedCell />
// //               <HatchedCell />
// //             </div>

// //             <div className={ALLOCATION_GRID}>
// //               <div>Indirect Labor</div>
// //               <div className="px-1 text-right">16,488</div>
// //               <FormulaCell>0.06%</FormulaCell>
// //               <div />
// //               <FormulaCell>5,453</FormulaCell>
// //               <FormulaCell>5,453</FormulaCell>
// //             </div>

// //             <div className={ALLOCATION_GRID}>
// //               <div>Direct Labor</div>
// //               <div className="px-1 text-right">4,41,192</div>
// //               <FormulaCell>1.68%</FormulaCell>
// //               <div />
// //               <FormulaCell>1,47,048</FormulaCell>
// //               <FormulaCell>1,47,048</FormulaCell>
// //             </div>

// //             {/* AERO FRINGE */}

// //             <div className={ALLOCATION_GRID}>
// //               <div className="font-bold">AERO Fringe</div>
// //               <HatchedCell />
// //               <HatchedCell />
// //               <HatchedCell />
// //               <HatchedCell />
// //               <HatchedCell />
// //             </div>

// //             <div className={ALLOCATION_GRID}>
// //               <div>Labor</div>
// //               <div />
// //               <FormulaCell>0.00%</FormulaCell>
// //               <div />
// //               <FormulaCell>-</FormulaCell>
// //               <FormulaCell>-</FormulaCell>
// //             </div>

// //             {/* CALIFORNIA */}

// //             <div className={ALLOCATION_GRID}>
// //               <div className="font-bold">California - Interm</div>
// //               <HatchedCell />
// //               <HatchedCell />
// //               <HatchedCell />
// //               <HatchedCell />
// //               <HatchedCell />
// //             </div>

// //             <div className={ALLOCATION_GRID}>
// //               <div>Labor</div>
// //               <div className="px-1 text-right">13,12,386</div>
// //               <FormulaCell>5.00%</FormulaCell>
// //               <div />
// //               <FormulaCell>43,756</FormulaCell>
// //               <FormulaCell>43,756</FormulaCell>
// //             </div>

// //             {/* TOTAL */}

// //             <div className={`${ALLOCATION_GRID} mt-1`}>
// //               <div />

// //               <FormulaCell>2,62,47,710</FormulaCell>

// //               <FormulaCell>100.00%</FormulaCell>

// //               <div />

// //               <FormulaCell>87,48,308</FormulaCell>

// //               <FormulaCell>87,48,308</FormulaCell>
// //             </div>
// //           </div>

// //           {/* REFERENCES */}

// //           {/*
// //             Each reference is positioned independently so its vertical position
// //             can match the corresponding row in the allocation table.
// //           */}
// //           <div className="relative ml-[65px] h-[320px] w-[140px]">
// //             {/* Sched B — G & A row */}
// //             <div className="absolute left-0 top-[56px] flex h-[20px] items-center gap-2">
// //               <span className="text-[12px]">TO</span>
// //               <AllocationReference className="w-[110px]">
// //                 Sched B
// //               </AllocationReference>
// //             </div>

// //             {/* Sched C (1) — Indirect Labor row */}
// //             <div className="absolute left-0 top-[91px] flex h-[20px] items-center gap-2">
// //               <span className="text-[12px]">TO</span>
// //               <AllocationReference className="w-[110px]">
// //                 Sched C (1)
// //               </AllocationReference>
// //             </div>

// //             {/* Sched C (2) — O/H - OH - Offsite row */}
// //             <div className="absolute left-0 top-[141px] flex h-[20px] items-center gap-2">
// //               <span className="text-[12px]">TO</span>
// //               <AllocationReference className="w-[110px]">
// //                 Sched C (2)
// //               </AllocationReference>
// //             </div>

// //             {/* Sched C (6) — Direct Labor row */}
// //             <div className="absolute left-0 top-[191px] flex h-[20px] items-center gap-2">
// //               <span className="text-[12px]">TO</span>
// //               <AllocationReference className="w-[110px]">
// //                 Sched C (6)
// //               </AllocationReference>
// //             </div>

// //             {/* Sched C (6) — AERO Fringe row */}
// //             <div className="absolute left-0 top-[225px] flex h-[20px] items-center gap-2">
// //               <span className="text-[12px]">TO</span>
// //               <AllocationReference className="w-[110px]">
// //                 Sched C (6)
// //               </AllocationReference>
// //             </div>

// //             {/* Sched D (2) — California - Interm row */}
// //             <div className="absolute left-0 top-[259px] flex h-[20px] items-center gap-2">
// //               <span className="text-[12px]">TO</span>
// //               <AllocationReference className="w-[110px]">
// //                 Sched D (2)
// //               </AllocationReference>
// //             </div>
// //           </div>
// //         </div>

// //         {/* EXPLANATORY NOTES */}

// //         <div className="mt-4 px-1">
// //           <div className="font-bold underline">Explanatory Notes:</div>
// //         </div>

// //         {/* LEGEND */}

// //         <div className="mt-10">
// //           <div className="h-[18px] w-[323px] bg-[#fff200] px-1 text-[12px]">
// //             Linked to Other Worksheet
// //           </div>

// //           <div className="mt-2 h-[18px] w-[323px] bg-[#27c4c7] px-1 text-[12px]">
// //             Cell Contains a Formula
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

import React, { useState, useEffect } from "react";
import { backendUrl } from "../config";

const DETAIL_GRID = "grid grid-cols-[250px_180px_150px_120px_140px_80px_160px]";
const ALLOCATION_GRID = "grid grid-cols-[220px_140px_100px_110px_140px_140px]";

const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val) || val === 0) return "-";
  const roundedVal = Math.round(val);
  if (roundedVal < 0)
    return `(${Math.abs(roundedVal).toLocaleString("en-US")})`;
  return roundedVal.toLocaleString("en-US");
};

const formatPercent = (val) => {
  if (val === null || val === undefined || isNaN(val)) return "0.00%";
  return `${Number(val).toFixed(2)}%`;
};

const AllocationReference = ({ children, className = "", onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-[20px] items-center justify-center bg-[#211fae] px-3 text-[13px] font-bold text-white underline hover:bg-blue-800 cursor-pointer ${className}`}
  >
    {children}
  </button>
);

const FormulaCell = ({ children, className = "" }) => (
  <div
    className={`min-h-[19px] border-b border-[#08767b] bg-[#27c4c7] px-2 text-right text-[12px] ${className}`}
  >
    {children}
  </div>
);

const HatchedCell = ({ className = "" }) => (
  <div
    className={`min-h-[18px] bg-[repeating-linear-gradient(-45deg,#1f1f1f_0px,#1f1f1f_1px,#666_1px,#666_2px)] ${className}`}
  />
);

export default function Fringe({
  onNavigate,
  companyName,
  companyAddress,
  explanatoryNote,
  setExplanatoryNote,
  year,
  fiscalYearEnd,
}) {
  // Detailed GL Trial Balance Data
  const [fringeCostData, setFringeCostData] = useState([]);

  // Allocation Breakdown Data
  const [allocationRows, setAllocationRows] = useState([]);
  const [allocationTotals, setAllocationTotals] = useState({
    totalBaseLaborDollars: 0,
    totalPercentage: 0,
    totalClaimedExpenseAllocation: 0,
    totalAllocationBasedOnGlAmounts: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${backendUrl}/api/TrialBalance/firing-allocation?fyCd=${year}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP Error status: ${response.status}`);
        }

        const data = await response.json();

        // 1. Aggregate fringeCost array by account ID (acctId)
        const rawFringeCost = data.fringeCost || [];
        const aggregatedGL = rawFringeCost.reduce((acc, item) => {
          const acctId = item.acctId;
          const endingBal = item.endingBalance || 0;

          if (!acc[acctId]) {
            acc[acctId] = {
              account: acctId,
              description: item.acctName ? item.acctName.trim() : "",
              perGLRaw: endingBal,
              adjustmentRaw: 0,
            };
          } else {
            acc[acctId].perGLRaw += endingBal;
          }
          return acc;
        }, {});

        const mappedFringeCost = Object.values(aggregatedGL).map((row) => ({
          ...row,
          claimedRaw: row.perGLRaw + row.adjustmentRaw,
        }));

        setFringeCostData(mappedFringeCost);

        // 2. Process allocation rows & totals
        setAllocationRows(data.rows || []);
        setAllocationTotals({
          totalBaseLaborDollars: data.totalBaseLaborDollars || 0,
          totalPercentage: data.totalPercentage || 0,
          totalClaimedExpenseAllocation:
            data.totalClaimedExpenseAllocation || 0,
          totalAllocationBasedOnGlAmounts:
            data.totalAllocationBasedOnGlAmounts || 0,
        });
      } catch (err) {
        console.error("Failed to fetch Fringe allocation data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPerGL = fringeCostData.reduce(
    (sum, row) => sum + (row.perGLRaw || 0),
    0,
  );
  const totalAdjustment = fringeCostData.reduce(
    (sum, row) => sum + (row.adjustmentRaw || 0),
    0,
  );
  const totalClaimed = totalPerGL + totalAdjustment;

  return (
    <div className="w-full bg-[#e7e7e7] font-serif text-[12px] text-black">
      {/* ========================================================= */}
      {/* SCREEN 1 - FRINGE POOL DETAIL */}
      {/* ========================================================= */}

      <div className="relative min-h-screen border border-gray-400 pb-8">
        {/* Top Header */}
        <div className="grid grid-cols-[250px_590px_1fr]">
          <div className="px-1 pt-1 leading-[18px]">
            <div>Schedule Fringe is linked to the following</div>
            <div>schedule(s):</div>
            <div>Schedule D (x)</div>
            <div className="text-[#0000aa] underline cursor-pointer">
              ICE MANUAL
            </div>
          </div>

          <div className="pt-4">
            <div className="bg-[#fff200] py-[2px] text-center font-bold">
              {companyName}
            </div>

            <div className="bg-[#fff200] py-[2px] text-center font-bold">
              {companyAddress}
            </div>

            <div className="mt-4 bg-[#fff200] py-[2px] text-center font-bold">
              Fringe Pool
            </div>

            <div className="bg-[#fff200] py-[2px] text-center font-bold">
              Fiscal Year End - {fiscalYearEnd}
            </div>
          </div>

          <div className="pl-6 pt-1">
            <div className="font-bold">SCHEDULE Fringe</div>
            <div className="font-bold">ICE (version 2.0.1h)</div>
          </div>
        </div>

        {/* Detail Table Header */}
        <div className="mt-10 w-[965px]">
          <div className={DETAIL_GRID}>
            <div className="text-center font-bold leading-[14px]">
              ACCOUNT
              <br />
              NUMBER
            </div>

            <div className="text-center font-bold">DESCRIPTION</div>

            <div className="text-center font-bold leading-[14px]">
              PER G/L
              <br />& TRIAL BAL/FS
            </div>

            <div className="text-center font-bold">ADJUSTMENT</div>

            <div className="text-center font-bold">CLAIMED</div>

            <div className="text-center font-bold">NOTES</div>

            <div className="text-center font-bold">REFERENCE</div>
          </div>

          <div className="w-[1080px] border-t border-black" />

          {/* Detail Rows */}
          {loading ? (
            <div className="p-4 text-center text-sm font-semibold text-gray-600">
              Loading Fringe trial balance data...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-sm font-semibold text-red-600">
              Error loading data: {error}
            </div>
          ) : (
            fringeCostData.map((row) => (
              <div
                key={row.account}
                className={`${DETAIL_GRID} min-h-[19px] hover:bg-gray-200`}
              >
                <div className="px-1">{row.account}</div>

                <div className="px-1">{row.description}</div>

                <div className="px-2 text-right">
                  {formatCurrency(row.perGLRaw)}
                </div>

                <div />

                <FormulaCell>{formatCurrency(row.claimedRaw)}</FormulaCell>

                <div />
              </div>
            ))
          )}

          {/* Total */}
          <div className={`${DETAIL_GRID} mt-1 items-center`}>
            <div />

            <div className="font-bold">Total</div>

            <FormulaCell>{formatCurrency(totalPerGL)}</FormulaCell>

            <FormulaCell>
              {totalAdjustment === 0 ? "-" : formatCurrency(totalAdjustment)}
            </FormulaCell>

            <FormulaCell>{formatCurrency(totalClaimed)}</FormulaCell>

            {/* Notes column */}
            <div />

            {/* Reference column */}
            <div className="ml-[25px] flex items-center gap-2">
              <span className="text-[12px]">TO</span>

              <AllocationReference
                className="w-[110px]"
                onClick={() => onNavigate && onNavigate("sched_a")}
              >
                Sched A
              </AllocationReference>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SCREEN 2 - ALLOCATION OF EXPENSES (FIRST IMAGE MATCH) */}
      {/* ========================================================= */}

      {/* ========================================================= */}
      {/* SCREEN 2 - ALLOCATION OF EXPENSES */}
      {/* ========================================================= */}

      <div className="min-h-screen border-t-2 border-gray-500 pb-10">
        <div className="pt-3">
          <div className="px-1 text-[12px] leading-[18px]">
            Allocation of Expenses Based on
            <br />
            Straight-Time Labor Dollars
          </div>
        </div>

        <div className="mt-5">
          {/* Column Headings */}
          <div className="flex">
            <div className={`${ALLOCATION_GRID} items-end`}>
              <div />

              <div className="text-center font-bold leading-[14px]">
                Base
                <br />
                Labor Dollars
              </div>

              <div className="text-center font-bold leading-[14px]">
                % of
                <br />
                Total
              </div>

              <div className="text-center font-bold">Adjustments</div>

              <div className="text-center font-bold leading-[14px]">
                Claimed
                <br />
                Expense
                <br />
                Allocation
              </div>

              <div className="text-center font-bold leading-[14px]">
                Allocation
                <br />
                based on
                <br />
                Per G/L Amts
              </div>
            </div>
          </div>

          <div className="w-[850px] border-t border-black" />

          {/* DYNAMIC ALLOCATION TABLE BODY */}
          <div className="w-[1020px]">
            {allocationRows.map((row, index) => {
              // Map row names to schedule routes dynamically
              const routeMap = {
                "G&A Labor": "sched_b",
                "O/H - OH - Onsite": "sched_c1",
                "O/H - OH - Offsite": "sched_c2",
                "O/H - SM&L": "sched_c3",
                "AERO Fringe": "sched_d1",
                California: "sched_c6",
              };

              const scheduleLabelMap = {
                "G&A Labor": "Sched B",
                "O/H - OH - Onsite": "Sched C (1)",
                "O/H - OH - Offsite": "Sched C (2)",
                "O/H - SM&L": "Sched C (3)",
                "AERO Fringe": "Sched D (1)",
                California: "Sched C (6)",
              };

              // Render header row only if name changed from previous row
              const showHeader =
                index === 0 || allocationRows[index - 1].name !== row.name;

              return (
                <React.Fragment key={`${row.name}-${row.subname}-${index}`}>
                  {/* Main Category Header Row */}
                  {showHeader && (
                    <div className={ALLOCATION_GRID}>
                      <div className="font-bold">{row.name}</div>
                      <HatchedCell className="col-span-5" />
                    </div>
                  )}

                  {/* Allocation Sub-Row */}
                  <div className="flex items-center">
                    <div className={ALLOCATION_GRID}>
                      <div className="pl-1">{row.subname}</div>
                      <div className="px-1 text-right">
                        {formatCurrency(row.baseLaborDollars)}
                      </div>
                      <FormulaCell>
                        {formatPercent(row.percentageOfTotal)}
                      </FormulaCell>
                      <div className="px-1 text-right">
                        {row.adjustments ? formatCurrency(row.adjustments) : ""}
                      </div>
                      <FormulaCell>
                        {formatCurrency(row.claimedExpenseAllocation)}
                      </FormulaCell>
                      <FormulaCell>
                        {formatCurrency(row.allocationBasedOnGlAmounts)}
                      </FormulaCell>
                    </div>

                    {/* Action Button Navigation - Shows when matching schedule route exists */}
                    {routeMap[row.name] && (
                      <div className="ml-6 flex items-center gap-2">
                        <span className="text-[12px]">TO</span>
                        <AllocationReference
                          className="w-[110px]"
                          onClick={() =>
                            onNavigate && onNavigate(routeMap[row.name])
                          }
                        >
                          {scheduleLabelMap[row.name]}
                        </AllocationReference>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}

            {/* DYNAMIC TOTAL ROW */}
            <div className="mt-1 flex items-center">
              <div className={ALLOCATION_GRID}>
                <div className="font-bold">Total</div>
                <FormulaCell>
                  {formatCurrency(allocationTotals.totalBaseLaborDollars)}
                </FormulaCell>
                <FormulaCell>
                  {formatPercent(allocationTotals.totalPercentage)}
                </FormulaCell>
                <div />
                <FormulaCell>
                  {formatCurrency(
                    allocationTotals.totalClaimedExpenseAllocation,
                  )}
                </FormulaCell>
                <FormulaCell>
                  {formatCurrency(
                    allocationTotals.totalAllocationBasedOnGlAmounts,
                  )}
                </FormulaCell>
              </div>

              <div className="ml-6 flex items-center gap-2">
                <span className="text-[12px]">TO</span>
                <AllocationReference
                  className="w-[110px]"
                  onClick={() => onNavigate && onNavigate("sched_d2")}
                >
                  Sched D (2)
                </AllocationReference>
              </div>
            </div>
          </div>
        </div>

        {/* EXPLANATORY NOTES */}
        {/* <div className="mt-4 px-1">
          <div className="font-bold underline">Explanatory Notes:</div>
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

        {/* LEGEND */}
        <div className="mt-10">
          <div className="h-[18px] w-[323px] bg-[#fff200] px-1 text-[12px]">
            Linked to Other Worksheet
          </div>

          <div className="mt-2 h-[18px] w-[323px] bg-[#27c4c7] px-1 text-[12px]">
            Cell Contains a Formula
          </div>
        </div>
      </div>
    </div>
  );
}
