// import React from "react";

// const ReferenceBox = ({ children, className = "" }) => (
//   <div
//     className={`flex h-[20px] items-center justify-center bg-[#1717a8] px-3 text-[13px] font-bold text-white underline ${className}`}
//   >
//     {children}
//   </div>
// );

// const YellowCell = ({ children, className = "" }) => (
//   <div
//     className={`flex h-[18px] items-center justify-end bg-yellow-300 px-2 ${className}`}
//   >
//     {children}
//   </div>
// );

// const CyanCell = ({ children, className = "" }) => (
//   <div
//     className={`flex h-[18px] items-center justify-end bg-[#29bec2] px-2 ${className}`}
//   >
//     {children}
//   </div>
// );

// const DashCell = ({ children = "-", className = "" }) => (
//   <div className={`flex h-[18px] items-center justify-center ${className}`}>
//     {children}
//   </div>
// );

// export default function SummarySchedH() {
//   return (
//     <div className="min-h-screen bg-[#f1f1f1] font-serif text-[13px] text-[#111]">
//       {/* =====================================================
//           SCREEN 1
//       ===================================================== */}

//       <div className="min-h-[570px] border border-gray-300">
//         {/* TOP HEADER */}

//         <div className="relative px-[4px] pt-[4px]">
//           <div className="absolute left-[4px] top-[4px] text-[13px] leading-[18px]">
//             <div>
//               Summary Schedule H is linked from the following schedules:
//             </div>
//             <div>Schedule H, Contract Costs</div>
//             <div>Schedule E, Indirect Rate</div>
//             <div className="mt-[3px] text-[#000099] underline">ICE MANUAL</div>
//           </div>

//           <div className="mx-auto w-[610px] bg-yellow-300 py-[3px] text-center font-bold leading-[16px]">
//             <div>Columbus Technologies, Inc.</div>
//             <div>California</div>
//           </div>

//           <div className="absolute right-[610px] top-[7px] text-center font-bold">
//             {/* <div>SUMMARY SCHEDULE H</div>
//             <div>ICE (version 2.0.1h)</div> */}
//           </div>

//           <div className="mx-auto mt-[38px] w-[610px] bg-yellow-300 py-[3px] text-center font-bold leading-[16px]">
//             <div>
//               Summary Schedule H of Direct Contract/Subcontract/IR&amp;D/B&amp;P
//               Costs
//             </div>
//             <div>Fiscal Year End - 12/31/2025</div>
//           </div>
//         </div>

//         {/* DIRECT COSTS TABLE */}

//         <div className="mt-[25px] grid w-[1052px] grid-cols-[302px_100px_100px_110px_110px_100px_100px_75px_55px]">
//           {/* HEADER */}

//           <div className="flex items-end border-b border-black pb-[2px] font-bold">
//             DIRECT COST ELEMENTS
//           </div>

//           <div className="flex items-end justify-center border-b border-black pb-[2px] font-bold">
//             OH - Onsite
//           </div>

//           <div className="flex items-end justify-center border-b border-black pb-[2px] font-bold">
//             OH - Offsite
//           </div>

//           <div className="flex items-end justify-center border-b border-black pb-[2px] font-bold">
//             AERO OH Onsite
//           </div>

//           <div className="flex flex-col items-center justify-end border-b border-black pb-[2px] font-bold">
//             <span>CONTRACT</span>
//             <span>TOTAL</span>
//           </div>

//           <div className="flex flex-col items-center justify-end border-b border-black pb-[2px] font-bold">
//             <span>IR&amp;D/B&amp;P</span>
//             <span>TOTAL</span>
//           </div>

//           <div className="flex flex-col items-center justify-end border-b border-black pb-[2px] font-bold">
//             <span>GRAND</span>
//             <span>TOTAL</span>
//           </div>

//           <div className="flex items-end justify-center border-b border-black pb-[2px] font-bold">
//             Ref.
//           </div>

//           <div className="flex items-end justify-center border-b border-black pb-[2px]">
//             Notes
//           </div>

//           {/* DIRECT CONTRACT LABOR */}

//           <div className="flex items-center pl-[5px] font-bold">
//             Direct Contract Labor
//           </div>

//           <YellowCell>2,08,53,994</YellowCell>
//           <YellowCell>16,48,803</YellowCell>
//           <YellowCell>5,56,628</YellowCell>

//           <CyanCell>2,30,59,425</CyanCell>
//           <YellowCell>-</YellowCell>
//           <CyanCell>2,30,59,425</CyanCell>

//           <div className="flex items-center">
//             <ReferenceBox className="w-[77px]" targetTab="sched_h" onNavigate={onNavigate}>Sched H</ReferenceBox>
//           </div>

//           <div />

//           {/* DIRECT MATERIAL */}

//           <div className="flex items-center pl-[5px]">Direct Material</div>

//           <div className="border-b border-dashed border-gray-600" />
//           <div className="border-b border-dashed border-gray-600" />
//           <div className="border-b border-dashed border-gray-600" />

//           <YellowCell>15,30,143</YellowCell>
//           <YellowCell>-</YellowCell>
//           <CyanCell>15,30,143</CyanCell>

//           <div />
//           <div />

//           {/* TRAVEL */}

//           <div className="flex items-center pl-[5px]">Travel</div>

//           <div className="border-b border-dashed border-gray-600" />
//           <div className="border-b border-dashed border-gray-600" />
//           <div className="border-b border-dashed border-gray-600" />

//           <YellowCell>1,38,942</YellowCell>
//           <YellowCell>-</YellowCell>
//           <CyanCell>1,38,942</CyanCell>

//           <div />
//           <div />

//           {/* OTHER DIRECT COSTS */}

//           <div className="flex items-center pl-[5px]">
//             Other Direct Costs (ODC)
//           </div>

//           <div className="border-b border-dashed border-gray-600" />
//           <div className="border-b border-dashed border-gray-600" />
//           <div className="border-b border-dashed border-gray-600" />

//           <YellowCell>4,77,053</YellowCell>
//           <YellowCell>-</YellowCell>
//           <CyanCell>4,77,053</CyanCell>

//           <div />
//           <div />

//           {/* SUBCONTRACTS */}

//           <div className="flex items-center pl-[5px]">Subcontracts</div>

//           <div className="border-b border-dashed border-gray-600" />
//           <div className="border-b border-dashed border-gray-600" />
//           <div className="border-b border-dashed border-gray-600" />

//           <YellowCell>2,37,04,811</YellowCell>
//           <YellowCell>-</YellowCell>
//           <CyanCell>2,37,04,811</CyanCell>

//           <div />
//           <div />

//           {/* UNBURDEN TEAMMATE COST */}

//           <div className="flex items-center pl-[5px]">
//             Unburden Teammate Cost
//           </div>

//           <div className="border-b border-dashed border-gray-600" />
//           <div className="border-b border-dashed border-gray-600" />
//           <div className="border-b border-dashed border-gray-600" />

//           <YellowCell>3,24,751</YellowCell>
//           <YellowCell>-</YellowCell>
//           <CyanCell>3,24,751</CyanCell>

//           <div />
//           <div />

//           {/* TOTAL DIRECT CONTRACT COSTS */}

//           <div className="flex items-center pl-[5px] font-bold">
//             TOT. DIR. CONTRACT COSTS
//           </div>

//           <div className="border-b border-dashed border-gray-600" />
//           <div className="border-b border-dashed border-gray-600" />
//           <div className="border-b border-dashed border-gray-600" />

//           <CyanCell className="border-b border-black">4,92,35,125</CyanCell>

//           <CyanCell className="border-b border-black">-</CyanCell>

//           <CyanCell className="border-b border-black">4,92,35,125</CyanCell>

//           <div />
//           <div />
//         </div>

//         {/* IR&D AND B&P COSTS */}

//         <div className="mt-[35px]">
//           <div className="w-[305px] border-b border-black pb-[2px] pl-[5px] font-bold">
//             IR&amp;D AND B&amp;P COSTS
//           </div>

//           {/*
//             Shared 9-column layout:
//             1 Label | 2 OH Onsite | 3 OH Offsite | 4 AERO OH | 5 Contract |
//             6 IR&D/B&P | 7 Grand Total | 8 Ref. | 9 Notes
//           */}
//           <div className="mt-[17px] grid w-[1052px] grid-cols-[302px_100px_100px_110px_110px_100px_100px_75px_55px]">
//             {/* IR&D LABOR */}
//             <div className="flex items-center pl-[5px]">IR&amp;D Labor</div>
//             <div />
//             <div />
//             <div />
//             <div />
//             <div />
//             <YellowCell>-</YellowCell>
//             <div className="flex items-center">
//               <ReferenceBox className="w-[77px]" targetTab="sched_h" onNavigate={onNavigate}>Sched H</ReferenceBox>
//             </div>
//             <div />

//             {/* B&P LABOR */}
//             <div className="flex items-center pl-[5px]">B&amp;P Labor</div>
//             <div />
//             <div />
//             <div />
//             <div />
//             <div />
//             <YellowCell>-</YellowCell>
//             <div />
//             <div />

//             {/* SUBTOTAL */}
//             <div className="mt-[10px] flex items-center pl-[5px]">
//               Subtotal IR&amp;D/B&amp;P Labor
//             </div>
//             <div />
//             <div />
//             <div />
//             <div />
//             <div />
//             <CyanCell className="mt-[10px]">-</CyanCell>
//             <div />
//             <div />

//             {/* IR&D LABOR FRINGE */}
//             <div className="flex items-center pl-[5px]">
//               IR&amp;D Labor Fringe (NOTE 1)
//             </div>
//             <div />
//             <div />
//             <div />
//             <div />
//             <div />
//             <CyanCell>-</CyanCell>
//             <div className="flex items-center">
//               <ReferenceBox className="w-[77px]" targetTab="sched_e" onNavigate={onNavigate}>Sched E</ReferenceBox>
//             </div>
//             <div className="flex items-center">RATES</div>

//             {/* B&P LABOR FRINGE */}
//             <div className="flex items-center pl-[5px]">
//               B&amp;P Labor Fringe (NOTE 1)
//             </div>
//             <div />
//             <div />
//             <div />
//             <div />
//             <div />
//             <CyanCell>-</CyanCell>
//             <div className="flex items-center">
//               <ReferenceBox className="w-[77px]" targetTab="sched_h" onNavigate={onNavigate}>Sched H</ReferenceBox>
//             </div>
//             <div className="flex items-center">RATES</div>

//             {/* IR&D MATERIAL */}
//             <div className="flex items-center pl-[5px]">IR&amp;D Material</div>
//             <div />
//             <div />
//             <div />
//             <div />
//             <div />
//             <YellowCell>-</YellowCell>
//             <div />
//             <div />

//             {/* B&P MATERIAL */}
//             <div className="flex items-center pl-[5px]">B&amp;P Material</div>
//             <div />
//             <div />
//             <div />
//             <div />
//             <div />
//             <YellowCell>-</YellowCell>
//             <div />
//             <div />

//             {/* IR&D SUBCONTRACT */}
//             <div className="flex items-center pl-[5px]">
//               IR&amp;D Subcontract
//             </div>
//             <div />
//             <div />
//             <div />
//             <div />
//             <div />
//             <div className="flex h-[18px] items-center justify-end bg-[#a8a8a8] px-2">
//               -
//             </div>
//             <div />
//             <div />

//             {/* B&P SUBCONTRACT */}
//             <div className="flex items-center pl-[5px]">
//               B&amp;P Subcontract
//             </div>
//             <div />
//             <div />
//             <div />
//             <div />
//             <div />
//             <YellowCell>-</YellowCell>
//             <div className="flex items-center">
//               <ReferenceBox className="w-[77px]" targetTab="sched_h" onNavigate={onNavigate}>Sched H</ReferenceBox>
//             </div>
//             <div />

//             {/* OTHER COSTS */}
//             <div className="flex items-center pl-[5px]">
//               IR&amp;D Other Costs
//             </div>
//             <div />
//             <div />
//             <div />
//             <div />
//             <div />
//             <YellowCell>-</YellowCell>
//             <div className="flex items-center">
//               <ReferenceBox className="w-[77px]" />
//             </div>
//             <div />

//             <div className="flex items-center pl-[5px]">
//               B&amp;P Other Costs
//             </div>
//             <div />
//             <div />
//             <div />
//             <div />
//             <div />
//             <YellowCell>-</YellowCell>
//             <div className="flex items-center">
//               <ReferenceBox className="w-[77px]" />
//             </div>
//             <div />

//             {/* TOTAL */}
//             <div className="mt-[14px] flex items-center pl-[5px] font-bold">
//               TOTAL IR&amp;D/B&amp;P
//             </div>
//             <div />
//             <div />
//             <div />
//             <div />
//             <div />
//             <CyanCell className="mt-[14px]">-</CyanCell>
//             <div />
//             <div />
//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           SCREEN 2
//       ===================================================== */}

//       <div className="min-h-[450px] border-x border-b border-gray-300 pt-[5px]">
//         {/* CONTINUED COST ROWS - same shared column layout */}

//         <div className="grid w-[1052px] grid-cols-[302px_100px_100px_110px_110px_100px_100px_75px_55px]">
//           {/* B&P MATERIAL */}
//           <div className="pl-[5px]">B&amp;P Material</div>
//           <div />
//           <div />
//           <div />
//           <div />
//           <div />
//           <YellowCell>-</YellowCell>
//           <div />
//           <div />

//           {/* IR&D MATERIAL OVERHEAD */}
//           <div className="pl-[5px]">IR&amp;D Material Overhead (NOTE 1)</div>
//           <div />
//           <div />
//           <div />
//           <div />
//           <div />
//           <div className="flex h-[18px] items-center justify-end bg-[#a8a8a8] px-2">
//             -
//           </div>
//           <div />
//           <div />

//           {/* B&P MATERIAL OVERHEAD */}
//           <div className="pl-[5px]">B&amp;P Material Overhead (NOTE 1)</div>
//           <div />
//           <div />
//           <div />
//           <div />
//           <div />
//           <div className="flex h-[18px] items-center justify-end bg-[#a8a8a8] px-2">
//             -
//           </div>
//           <div />
//           <div />

//           {/* IR&D OTHER COSTS */}
//           <div className="pl-[5px]">IR&amp;D Other Costs</div>
//           <div />
//           <div />
//           <div />
//           <div />
//           <div />
//           <YellowCell>-</YellowCell>
//           <div className="flex items-center">
//             <ReferenceBox className="w-[77px]" targetTab="sched_h" onNavigate={onNavigate}>Sched H</ReferenceBox>
//           </div>
//           <div />

//           {/* B&P OTHER COSTS */}
//           <div className="pl-[5px]">B&amp;P Other Costs</div>
//           <div />
//           <div />
//           <div />
//           <div />
//           <div />
//           <YellowCell>-</YellowCell>
//           <div className="flex items-center">
//             <ReferenceBox className="w-[77px]" />
//           </div>
//           <div />

//           {/* TOTAL */}
//           <div className="mt-[18px] pl-[5px] font-bold">
//             TOTAL IR&amp;D/B&amp;P
//           </div>
//           <div />
//           <div />
//           <div />
//           <div />
//           <div />
//           <CyanCell className="mt-[18px]">-</CyanCell>
//           <div />
//           <div />
//         </div>

//         {/* TOTAL DIRECT LABOR */}

//         <div className="mt-[23px] w-[300px] border-b border-black pb-[2px] pl-[2px] font-bold">
//           TOTAL DIRECT LABOR
//         </div>

//         <div className="mt-[3px] grid w-[1052px] grid-cols-[302px_100px_100px_110px_110px_100px_100px_75px_55px]">
//           <div className="pl-[5px]">Total Contract Labor</div>
//           <div />
//           <div />
//           <div />
//           <div />
//           <CyanCell className="translate-x-[100px]">2,30,59,425</CyanCell>
//           <div />

//           <div className=" whitespace-nowrap pl-[2px]">- see total above</div>

//           <div />

//           <div className="pl-[5px]">Total IR&amp;D/B&amp;P Labor</div>
//           <div />
//           <div />
//           <div />
//           <div />

//           <CyanCell className="translate-x-[100px] border-b border-black">
//             2,30,59,425
//           </CyanCell>
//           <div />
//           <div className="whitespace-nowrap pl-[2px]">to Schedule G and L</div>
//         </div>

//         <div className="mt-[2px] pl-[2px] font-bold">
//           TOTAL CONTRACT/IR&amp;D/B&amp;P LABOR
//         </div>

//         {/* EXPLANATORY NOTES */}

//         <div className="mt-[24px] px-[4px]">
//           <div className="font-bold underline">Explanatory Notes:</div>

//           <div className="mt-[15px] text-[12px]">
//             1. Total direct costs include teammate nonreimbursable fee, however
//             burden not applied and did not claim it during the billing.
//           </div>

//           <div className="mt-[5px] text-[12px]">
//             2. Summary Schedule H represents total incurred costs per the
//             General Ledger to ensure a complete tie-out to the FY 2025 Financial
//             Statements. All contract-specific exclusions, unallowable costs, and
//             limitations are itemized and adjusted on Schedule I and Supplement
//             A-4 to reach the final claimed allowable totals.
//           </div>
//         </div>

//         {/* LEGEND */}

//         <div className="mt-[15px] grid grid-cols-[300px_1fr]">
//           <div>
//             <div className="h-[18px] bg-yellow-300 px-[4px]">
//               Linked to Other Worksheet
//             </div>

//             <div className="h-[18px] bg-[#29bec2] px-[4px]">
//               Cell Contains a Formula
//             </div>

//             <div className="h-[18px] bg-[#a8a8a8] px-[4px]">
//               Cell Contains a Formula With Links
//             </div>
//           </div>

//           <div className="pl-[90px] leading-[20px]">
//             <div>As Referenced</div>
//             <div>Totals, Claimed and Differences</div>
//             <div>Complex formulas, linked between Sched E and H</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { backendUrl } from "../config";

// Added a 'link' prop and changed <div> to <a>
const ReferenceBox = ({ children, targetTab, onNavigate, className = "" }) => (
  <button
    type="button"
    onClick={() => targetTab && onNavigate?.(targetTab)}
    className={`flex h-[20px] items-center justify-center bg-[#1717a8] px-3 text-[13px] font-bold text-white underline hover:bg-blue-800 cursor-pointer ${className}`}
  >
    {children}
  </button>
);

const YellowCell = ({ children, className = "" }) => (
  <div
    className={`flex h-[18px] items-center justify-end bg-yellow-300 px-2 ${className}`}
  >
    {children}
  </div>
);

const CyanCell = ({ children, className = "" }) => (
  <div
    className={`flex h-[18px] items-center justify-end bg-[#29bec2] px-2 ${className}`}
  >
    {children}
  </div>
);

const DashCell = ({ children = "-", className = "" }) => (
  <div className={`flex h-[18px] items-center justify-center ${className}`}>
    {children}
  </div>
);

export default function SummarySchedH({
  companyName,
  companyAddress,
  onNavigate,
  explanatoryNote,
  setExplanatoryNote,
  year,
  fiscalYearEnd,
}) {
  const [totals, setTotals] = useState({
    laborOnsite: 0,
    laborOffsite: 0,
    laborAero: 0,
    material: 0,
    travel: 0,
    odc: 0,
    subcontracts: 0,
    unburden: 0,
  });

  // const fiscalYearEnd = `12/31/${year}`;

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/JobCostLedger`);
        const data = await response.json();

        let acc = {
          laborOnsite: 0,
          laborOffsite: 0,
          laborAero: 0,
          material: 0,
          travel: 0,
          odc: 0,
          subcontracts: 0,
          unburden: 0,
        };

        data.forEach((row) => {
          // if (Number(row.year) !== 2025) return;

          const amount = parseFloat(row.amount) || 0;

          // Updated mappings to match SchedH and SchedHCont
          if (
            row.acctId === "50-00-01" ||
            row.acctId === "50-00-98" ||
            row.acctId === "59-00-01"
          ) {
            if (row.orgId === "1.1.01") {
              acc.laborAero += amount;
            } else {
              acc.laborOnsite += amount;
            }
          } else if (row.acctId === "50-00-02") {
            acc.laborOffsite += amount;
          } else if (
            row.acctId &&
            (row.acctId.startsWith("50-40") || row.acctId.startsWith("59-40"))
          ) {
            acc.travel += amount;
          } else if (
            ["50-30-01", "50-31-01", "50-31-02"].includes(row.acctId)
          ) {
            acc.material += amount;
          } else if (
            ["50-50-01", "50-50-02", "50-50-03", "59-50-01"].includes(
              row.acctId,
            )
          ) {
            acc.odc += amount;
          } else if (
            [
              "50-21-01",
              "50-21-02",
              "50-21-03",
              "50-21-04",
              "50-22-01",
            ].includes(row.acctId)
          ) {
            acc.subcontracts += amount;
          } else if (
            ["50-22-02", "50-22-03", "50-22-05"].includes(row.acctId)
          ) {
            acc.unburden += amount;
          }
        });

        // Round all accumulated buckets to whole dollars to prevent cent-drift
        const roundedAcc = {
          laborOnsite: Math.round(acc.laborOnsite),
          laborOffsite: Math.round(acc.laborOffsite),
          laborAero: Math.round(acc.laborAero),
          material: Math.round(acc.material),
          travel: Math.round(acc.travel),
          odc: Math.round(acc.odc),
          subcontracts: Math.round(acc.subcontracts),
          unburden: Math.round(acc.unburden),
        };

        setTotals(roundedAcc);
      } catch (error) {
        console.error(
          "Failed to fetch job cost ledger for Summary Sched H:",
          error,
        );
      }
    };

    fetchSummaryData();
  }, []);

  const formatVal = (val) =>
    val === 0 ? "-" : Math.round(val).toLocaleString();

  const totalLabor =
    totals.laborOnsite + totals.laborOffsite + totals.laborAero;
  const totalDirectCosts =
    totalLabor +
    totals.material +
    totals.travel +
    totals.odc +
    totals.subcontracts +
    totals.unburden;

  return (
    <div className="min-h-screen bg-[#f1f1f1] font-serif text-[13px] text-[#111]">
      {/* =====================================================
          SCREEN 1
      ===================================================== */}

      <div className="min-h-[570px] border border-gray-300">
        {/* TOP HEADER */}

        <div className="relative px-[4px] pt-[4px]">
          <div className="absolute left-[4px] top-[4px] text-[13px] leading-[18px]">
            <div>
              Summary Schedule H is linked from the following schedules:
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.("sched_h")}
              className="block text-left hover:underline text-blue-800 cursor-pointer"
            >
              Schedule H, Contract Costs
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.("sched_e")}
              className="block text-left hover:underline text-blue-800 cursor-pointer"
            >
              Schedule E, Indirect Rate
            </button>
            <div className="mt-[3px] text-[#000099] underline">ICE MANUAL</div>
          </div>

          <div className="mx-auto w-[610px] bg-yellow-300 py-[3px] text-center font-bold leading-[16px]">
            <div>{companyName}</div>
            <div>{companyAddress}</div>
          </div>

          <div className="absolute right-[610px] top-[7px] text-center font-bold">
            {/* <div>SUMMARY SCHEDULE H</div>
            <div>ICE (version 2.0.1h)</div> */}
          </div>

          <div className="mx-auto mt-[38px] w-[610px] bg-yellow-300 py-[3px] text-center font-bold leading-[16px]">
            <div>
              Summary Schedule H of Direct Contract/Subcontract/IR&amp;D/B&amp;P
              Costs
            </div>
            <div>Fiscal Year End - {fiscalYearEnd}</div>
          </div>
        </div>

        {/* DIRECT COSTS TABLE */}

        <div className="mt-[25px] grid w-[1052px] grid-cols-[302px_100px_100px_110px_110px_100px_100px_75px_55px]">
          {/* HEADER */}

          <div className="flex items-end border-b border-black pb-[2px] font-bold">
            DIRECT COST ELEMENTS
          </div>

          <div className="flex items-end justify-center border-b border-black pb-[2px] font-bold">
            OH - Onsite
          </div>

          <div className="flex items-end justify-center border-b border-black pb-[2px] font-bold">
            OH - Offsite
          </div>

          <div className="flex items-end justify-center border-b border-black pb-[2px] font-bold">
            AERO OH Onsite
          </div>

          <div className="flex flex-col items-center justify-end border-b border-black pb-[2px] font-bold">
            <span>CONTRACT</span>
            <span>TOTAL</span>
          </div>

          <div className="flex flex-col items-center justify-end border-b border-black pb-[2px] font-bold">
            <span>IR&amp;D/B&amp;P</span>
            <span>TOTAL</span>
          </div>

          <div className="flex flex-col items-center justify-end border-b border-black pb-[2px] font-bold">
            <span>GRAND</span>
            <span>TOTAL</span>
          </div>

          <div className="flex items-end justify-center border-b border-black pb-[2px] font-bold">
            Ref.
          </div>

          <div className="flex items-end justify-center border-b border-black pb-[2px]">
            Notes
          </div>

          {/* DIRECT CONTRACT LABOR */}

          <div className="flex items-center pl-[5px] font-bold">
            Direct Contract Labor
          </div>

          <YellowCell>{formatVal(totals.laborOnsite)}</YellowCell>
          <YellowCell>{formatVal(totals.laborOffsite)}</YellowCell>
          <YellowCell>{formatVal(totals.laborAero)}</YellowCell>

          <CyanCell>{formatVal(totalLabor)}</CyanCell>
          <YellowCell>-</YellowCell>
          <CyanCell>{formatVal(totalLabor)}</CyanCell>

          <div className="flex items-center">
            <ReferenceBox
              className="w-[77px]"
              targetTab="sched_h"
              onNavigate={onNavigate}
            >
              Sched H
            </ReferenceBox>
          </div>

          <div />

          {/* DIRECT MATERIAL */}

          <div className="flex items-center pl-[5px]">Direct Material</div>

          <div className="border-b border-dashed border-gray-600" />
          <div className="border-b border-dashed border-gray-600" />
          <div className="border-b border-dashed border-gray-600" />

          <YellowCell>{formatVal(totals.material)}</YellowCell>
          <YellowCell>-</YellowCell>
          <CyanCell>{formatVal(totals.material)}</CyanCell>

          <div />
          <div />

          {/* TRAVEL */}

          <div className="flex items-center pl-[5px]">Travel</div>

          <div className="border-b border-dashed border-gray-600" />
          <div className="border-b border-dashed border-gray-600" />
          <div className="border-b border-dashed border-gray-600" />

          <YellowCell>{formatVal(totals.travel)}</YellowCell>
          <YellowCell>-</YellowCell>
          <CyanCell>{formatVal(totals.travel)}</CyanCell>

          <div />
          <div />

          {/* OTHER DIRECT COSTS */}

          <div className="flex items-center pl-[5px]">
            Other Direct Costs (ODC)
          </div>

          <div className="border-b border-dashed border-gray-600" />
          <div className="border-b border-dashed border-gray-600" />
          <div className="border-b border-dashed border-gray-600" />

          <YellowCell>{formatVal(totals.odc)}</YellowCell>
          <YellowCell>-</YellowCell>
          <CyanCell>{formatVal(totals.odc)}</CyanCell>

          <div />
          <div />

          {/* SUBCONTRACTS */}

          <div className="flex items-center pl-[5px]">Subcontracts</div>

          <div className="border-b border-dashed border-gray-600" />
          <div className="border-b border-dashed border-gray-600" />
          <div className="border-b border-dashed border-gray-600" />

          <YellowCell>{formatVal(totals.subcontracts)}</YellowCell>
          <YellowCell>-</YellowCell>
          <CyanCell>{formatVal(totals.subcontracts)}</CyanCell>

          <div />
          <div />

          {/* UNBURDEN TEAMMATE COST */}

          <div className="flex items-center pl-[5px]">
            Unburden Teammate Cost
          </div>

          <div className="border-b border-dashed border-gray-600" />
          <div className="border-b border-dashed border-gray-600" />
          <div className="border-b border-dashed border-gray-600" />

          <YellowCell>{formatVal(totals.unburden)}</YellowCell>
          <YellowCell>-</YellowCell>
          <CyanCell>{formatVal(totals.unburden)}</CyanCell>

          <div />
          <div />

          {/* TOTAL DIRECT CONTRACT COSTS */}

          <div className="flex items-center pl-[5px] font-bold">
            TOT. DIR. CONTRACT COSTS
          </div>

          <div className="border-b border-dashed border-gray-600" />
          <div className="border-b border-dashed border-gray-600" />
          <div className="border-b border-dashed border-gray-600" />

          <CyanCell className="border-b border-black">
            {formatVal(totalDirectCosts)}
          </CyanCell>

          <CyanCell className="border-b border-black">-</CyanCell>

          <CyanCell className="border-b border-black">
            {formatVal(totalDirectCosts)}
          </CyanCell>

          <div />
          <div />
        </div>

        {/* IR&D AND B&P COSTS */}

        <div className="mt-[35px]">
          <div className="w-[305px] border-b border-black pb-[2px] pl-[5px] font-bold">
            IR&amp;D AND B&amp;P COSTS
          </div>

          {/*
            Shared 9-column layout:
            1 Label | 2 OH Onsite | 3 OH Offsite | 4 AERO OH | 5 Contract |
            6 IR&D/B&P | 7 Grand Total | 8 Ref. | 9 Notes
          */}
          <div className="mt-[17px] grid w-[1052px] grid-cols-[302px_100px_100px_110px_110px_100px_100px_75px_55px]">
            {/* IR&D LABOR */}
            <div className="flex items-center pl-[5px]">IR&amp;D Labor</div>
            <div />
            <div />
            <div />
            <div />
            <div />
            <YellowCell>-</YellowCell>
            <div className="flex items-center">
              <ReferenceBox
                className="w-[77px]"
                targetTab="sched_h"
                onNavigate={onNavigate}
              >
                Sched H
              </ReferenceBox>
            </div>
            <div />

            {/* B&P LABOR */}
            <div className="flex items-center pl-[5px]">B&amp;P Labor</div>
            <div />
            <div />
            <div />
            <div />
            <div />
            <YellowCell>-</YellowCell>
            <div />
            <div />

            {/* SUBTOTAL */}
            <div className="mt-[10px] flex items-center pl-[5px]">
              Subtotal IR&amp;D/B&amp;P Labor
            </div>
            <div />
            <div />
            <div />
            <div />
            <div />
            <CyanCell className="mt-[10px]">-</CyanCell>
            <div />
            <div />

            {/* IR&D LABOR FRINGE */}
            <div className="flex items-center pl-[5px]">
              IR&amp;D Labor Fringe (NOTE 1)
            </div>
            <div />
            <div />
            <div />
            <div />
            <div />
            <CyanCell>-</CyanCell>
            <div className="flex items-center">
              <ReferenceBox
                className="w-[77px]"
                targetTab="sched_e"
                onNavigate={onNavigate}
              >
                Sched E
              </ReferenceBox>
            </div>
            <div className="flex items-center">RATES</div>

            {/* B&P LABOR FRINGE */}
            <div className="flex items-center pl-[5px]">
              B&amp;P Labor Fringe (NOTE 1)
            </div>
            <div />
            <div />
            <div />
            <div />
            <div />
            <CyanCell>-</CyanCell>
            <div className="flex items-center">
              <ReferenceBox
                className="w-[77px]"
                targetTab="sched_h"
                onNavigate={onNavigate}
              >
                Sched H
              </ReferenceBox>
            </div>
            <div className="flex items-center">RATES</div>

            {/* IR&D MATERIAL */}
            <div className="flex items-center pl-[5px]">IR&amp;D Material</div>
            <div />
            <div />
            <div />
            <div />
            <div />
            <YellowCell>-</YellowCell>
            <div />
            <div />

            {/* B&P MATERIAL */}
            <div className="flex items-center pl-[5px]">B&amp;P Material</div>
            <div />
            <div />
            <div />
            <div />
            <div />
            <YellowCell>-</YellowCell>
            <div />
            <div />

            {/* IR&D SUBCONTRACT */}
            <div className="flex items-center pl-[5px]">
              IR&amp;D Subcontract
            </div>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div className="flex h-[18px] items-center justify-end bg-[#a8a8a8] px-2">
              -
            </div>
            <div />
            <div />

            {/* B&P SUBCONTRACT */}
            <div className="flex items-center pl-[5px]">
              B&amp;P Subcontract
            </div>
            <div />
            <div />
            <div />
            <div />
            <div />
            <YellowCell>-</YellowCell>
            <div className="flex items-center">
              <ReferenceBox
                className="w-[77px]"
                targetTab="sched_h"
                onNavigate={onNavigate}
              >
                Sched H
              </ReferenceBox>
            </div>
            <div />

            {/* OTHER COSTS */}
            <div className="flex items-center pl-[5px]">
              IR&amp;D Other Costs
            </div>
            <div />
            <div />
            <div />
            <div />
            <div />
            <YellowCell>-</YellowCell>
            <div className="flex items-center">
              <ReferenceBox className="w-[77px]" />
            </div>
            <div />

            <div className="flex items-center pl-[5px]">
              B&amp;P Other Costs
            </div>
            <div />
            <div />
            <div />
            <div />
            <div />
            <YellowCell>-</YellowCell>
            <div className="flex items-center">
              <ReferenceBox className="w-[77px]" />
            </div>
            <div />

            {/* TOTAL */}
            <div className="mt-[14px] flex items-center pl-[5px] font-bold">
              TOTAL IR&amp;D/B&amp;P
            </div>
            <div />
            <div />
            <div />
            <div />
            <div />
            <CyanCell className="mt-[14px]">-</CyanCell>
            <div />
            <div />
          </div>
        </div>
      </div>

      {/* =====================================================
          SCREEN 2
      ===================================================== */}

      <div className="min-h-[450px] border-x border-b border-gray-300 pt-[5px]">
        {/* CONTINUED COST ROWS - same shared column layout */}

        <div className="grid w-[1052px] grid-cols-[302px_100px_100px_110px_110px_100px_100px_75px_55px]">
          {/* B&P MATERIAL */}
          <div className="pl-[5px]">B&amp;P Material</div>
          <div />
          <div />
          <div />
          <div />
          <div />
          <YellowCell>-</YellowCell>
          <div />
          <div />

          {/* IR&D MATERIAL OVERHEAD */}
          <div className="pl-[5px]">IR&amp;D Material Overhead (NOTE 1)</div>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div className="flex h-[18px] items-center justify-end bg-[#a8a8a8] px-2">
            -
          </div>
          <div />
          <div />

          {/* B&P MATERIAL OVERHEAD */}
          <div className="pl-[5px]">B&amp;P Material Overhead (NOTE 1)</div>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div className="flex h-[18px] items-center justify-end bg-[#a8a8a8] px-2">
            -
          </div>
          <div />
          <div />

          {/* IR&D OTHER COSTS */}
          <div className="pl-[5px]">IR&amp;D Other Costs</div>
          <div />
          <div />
          <div />
          <div />
          <div />
          <YellowCell>-</YellowCell>
          <div className="flex items-center">
            <ReferenceBox
              className="w-[77px]"
              targetTab="sched_h"
              onNavigate={onNavigate}
            >
              Sched H
            </ReferenceBox>
          </div>
          <div />

          {/* B&P OTHER COSTS */}
          <div className="pl-[5px]">B&amp;P Other Costs</div>
          <div />
          <div />
          <div />
          <div />
          <div />
          <YellowCell>-</YellowCell>
          <div className="flex items-center">
            <ReferenceBox className="w-[77px]" />
          </div>
          <div />

          {/* TOTAL */}
          <div className="mt-[18px] pl-[5px] font-bold">
            TOTAL IR&amp;D/B&amp;P
          </div>
          <div />
          <div />
          <div />
          <div />
          <div />
          <CyanCell className="mt-[18px]">-</CyanCell>
          <div />
          <div />
        </div>

        {/* TOTAL DIRECT LABOR */}

        <div className="mt-[23px] w-[300px] border-b border-black pb-[2px] pl-[2px] font-bold">
          TOTAL DIRECT LABOR
        </div>

        <div className="mt-[3px] grid w-[1052px] grid-cols-[302px_100px_100px_110px_110px_100px_100px_75px_55px]">
          <div className="pl-[5px]">Total Contract Labor</div>
          <div />
          <div />
          <div />
          <div />
          <CyanCell className="translate-x-[100px]">
            {formatVal(totalLabor)}
          </CyanCell>
          <div />

          <div className=" whitespace-nowrap pl-[2px]">- see total above</div>

          <div />

          <div className="pl-[5px]">Total IR&amp;D/B&amp;P Labor</div>
          <div />
          <div />
          <div />
          <div />

          <CyanCell className="translate-x-[100px] border-b border-black">
            {formatVal(totalLabor)}
          </CyanCell>
          <div />
          <div className="whitespace-nowrap pl-[2px]">to Schedule G and L</div>
        </div>

        <div className="mt-[2px] pl-[2px] font-bold">
          TOTAL CONTRACT/IR&amp;D/B&amp;P LABOR
        </div>

        {/* EXPLANATORY NOTES */}

        {/* <div className="mt-[24px] px-[4px]">
          <div className="font-bold underline">Explanatory Notes:</div>

          <div className="mt-[15px] text-[12px]">
            1. Total direct costs include teammate nonreimbursable fee, however
            burden not applied and did not claim it during the billing.
          </div>

          <div className="mt-[5px] text-[12px]">
            2. Summary Schedule H represents total incurred costs per the
            General Ledger to ensure a complete tie-out to the FY 2025 Financial
            Statements. All contract-specific exclusions, unallowable costs, and
            limitations are itemized and adjusted on Schedule I and Supplement
            A-4 to reach the final claimed allowable totals.
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

        {/* LEGEND */}

        <div className="mt-[15px] grid grid-cols-[300px_1fr]">
          <div>
            <div className="h-[18px] bg-yellow-300 px-[4px]">
              Linked to Other Worksheet
            </div>

            <div className="h-[18px] bg-[#29bec2] px-[4px]">
              Cell Contains a Formula
            </div>

            <div className="h-[18px] bg-[#a8a8a8] px-[4px]">
              Cell Contains a Formula With Links
            </div>
          </div>

          <div className="pl-[90px] leading-[20px]">
            <div>As Referenced</div>
            <div>Totals, Claimed and Differences</div>
            <div>Complex formulas, linked between Sched E and H</div>
          </div>
        </div>
      </div>
    </div>
  );
}
