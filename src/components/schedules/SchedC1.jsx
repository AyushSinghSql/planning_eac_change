// import React from "react";

// const companyName = "Revolve ";
// const fiscalYearEnd = "12/31/2025";

// /* =========================================================
//    ACCOUNT DATA
// ========================================================= */

// const scheduleC1Data = [
//   {
//     account: "70-00-01 - 1",
//     description: "Cust Site OH Labor",
//     amount: "53",
//     total: "53",
//     adjustment: "",
//     claimed: "53",
//   },
//   {
//     account: "70-00-01 - 2",
//     description: "Cust Site OH Labor",
//     amount: "348",
//     total: "348",
//     adjustment: "",
//     claimed: "348",
//   },
//   {
//     account: "70-40-00",
//     description: "Cust Site Travel Other",
//     amount: "99",
//     total: "99",
//     adjustment: "",
//     claimed: "99",
//   },
//   {
//     account: "70-40-02",
//     description: "Cust Site Travel Hotel",
//     amount: "177",
//     total: "177",
//     adjustment: "",
//     claimed: "177",
//   },
//   {
//     account: "70-40-04",
//     description: "Cust Site Per Diem Meals",
//     amount: "69",
//     total: "69",
//     adjustment: "",
//     claimed: "69",
//   },
//   {
//     account: "70-40-06",
//     description: "Cust Site Ground Transport",
//     amount: "308",
//     total: "308",
//     adjustment: "",
//     claimed: "308",
//   },
//   {
//     account: "70-50-01",
//     description: "Cust Site OH Supplies",
//     amount: "41",
//     total: "41",
//     adjustment: "",
//     claimed: "41",
//   },
//   {
//     account: "70-50-10",
//     description: "Cust Site Employ Relatns",
//     amount: "4,901",
//     total: "4,901",
//     adjustment: "",
//     claimed: "4,901",
//   },
// ];

// /* =========================================================
//    SUBTOTAL
// ========================================================= */

// const subtotal = {
//   amount: "5,996",
//   total: "5,996",
//   adjustment: "-",
//   claimed: "5,996",
// };

// /* =========================================================
//    ALLOCATION DATA
// ========================================================= */

// const californiaIntermediate = {
//   amount: "19,93,952",
//   total: "19,93,952",
//   adjustment: "-",
//   claimed: "19,93,952",
// };

// const fringeAllocation = {
//   total: "134",
//   adjustment: "-",
//   claimed: "134",
// };

// const totalOverheadPool = {
//   total: "20,00,082",
//   adjustment: "-",
//   claimed: "20,00,082",
// };

// /* =========================================================
//    TABLE COLUMN STRUCTURE

//    ACCOUNT       120px
//    DESCRIPTION   220px
//    AMOUNT         90px
//    TOTAL         110px
//    ADJUSTMENT    110px
//    CLAIMED       100px
//    NOTES          70px
//    REF            90px
// ========================================================= */

// const tableGrid =
//   "grid grid-cols-[120px_220px_90px_110px_110px_100px_70px_90px]";

// /* =========================================================
//    ACCOUNT TABLE
// ========================================================= */

// function ScheduleC1Table() {
//   return (
//     <div className="w-fit">
//       {/* HEADER */}
//       <div className={`${tableGrid} border-b border-black text-sm text-black`}>
//         {/* ACCOUNT */}
//         <div className="px-1 py-1 text-left font-bold">
//           <div className="underline">ACCOUNT</div>
//           <div className="underline">NUMBER</div>
//         </div>

//         {/* DESCRIPTION */}
//         <div className="px-2 py-1 text-left font-bold underline">
//           DESCRIPTION
//         </div>

//         {/* AMOUNT */}
//         <div className="px-1 py-1 text-center">
//           <div className="font-bold">Acct Balances</div>

//           <div className="bg-[#ffff00] font-bold underline">Amount</div>
//         </div>

//         {/* TOTAL */}
//         <div className="px-1 py-1 text-center font-bold">
//           <div>TOTAL PER G/L,</div>
//           <div>&amp; TRIAL BAL/F/S</div>
//         </div>

//         {/* ADJUSTMENTS */}
//         <div className="px-1 py-1 text-center font-bold">ADJUSTMENTS</div>

//         {/* CLAIMED */}
//         <div className="px-1 py-1 text-center font-bold">CLAIMED</div>

//         {/* NOTES */}
//         <div className="px-1 py-1 text-center font-bold">Notes</div>

//         {/* REF */}
//         <div className="px-1 py-1 text-center font-bold">Ref.</div>
//       </div>

//       {/* ACCOUNT ROWS */}
//       {scheduleC1Data.map((row, index) => (
//         <div key={index} className={`${tableGrid} text-sm text-black`}>
//           {/* ACCOUNT */}
//           <div className="px-1 py-[2px] whitespace-nowrap">{row.account}</div>

//           {/* DESCRIPTION */}
//           <div className="px-2 py-[2px] whitespace-nowrap">
//             {row.description}
//           </div>

//           {/* AMOUNT */}
//           <div className="px-2 py-[2px] text-right whitespace-nowrap">
//             {row.amount}
//           </div>

//           {/* TOTAL */}
//           <div className="bg-cyan-300 px-2 py-[2px] text-right whitespace-nowrap">
//             {row.total}
//           </div>

//           {/* ADJUSTMENT */}
//           <div className="px-2 py-[2px] text-right whitespace-nowrap">
//             {row.adjustment}
//           </div>

//           {/* CLAIMED */}
//           <div className="bg-cyan-300 px-2 py-[2px] text-right whitespace-nowrap">
//             {row.claimed}
//           </div>

//           {/* NOTES */}
//           <div></div>

//           {/* REF */}
//           <div></div>
//         </div>
//       ))}

//       {/* SUBTOTAL */}
//       <div
//         className={`${tableGrid} mt-2 border-b border-black text-sm text-black`}
//       >
//         <div></div>

//         <div className="px-2 py-1 font-bold underline">Subtotal</div>

//         <div className="bg-cyan-300 px-2 py-1 text-right">
//           {subtotal.amount}
//         </div>

//         <div className="bg-cyan-300 px-2 py-1 text-right">{subtotal.total}</div>

//         <div className="bg-cyan-300 px-2 py-1 text-right">
//           {subtotal.adjustment}
//         </div>

//         <div className="bg-cyan-300 px-2 py-1 text-right">
//           {subtotal.claimed}
//         </div>

//         <div></div>
//         <div></div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    REFERENCE BOX
// ========================================================= */

// function ReferenceBox({ children }) {
//   return (
//     <div className="flex justify-center">
//       <div className="bg-blue-700 px-2 py-1 text-center text-xs font-bold text-white underline whitespace-nowrap">
//         {children}
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    MAIN COMPONENT
// ========================================================= */

// export default function SchedC1() {
//   return (
//     <div className="min-h-full w-full overflow-x-auto bg-white text-black">
//       <div className="min-w-[900px] p-4">
//         {/* =================================================
//             HEADER
//         ================================================= */}

//         <div className="relative mb-8 h-[125px]">
//           {/* ---------------------------------------------
//               LINKED SCHEDULES
//           --------------------------------------------- */}

//           <div className="absolute left-0 top-0 w-[250px] text-sm">
//             <div>Schedule C is linked to the following</div>

//             <div>schedules:</div>

//             <div>Schedule D(x)</div>

//             <div className="mt-8 text-blue-700 underline">ICE MANUAL</div>
//           </div>

//           {/* ---------------------------------------------
//               COMPANY NAME
//           --------------------------------------------- */}

//           <div className="absolute left-[255px] top-0 w-[372px]">
//             <div className="bg-yellow-300 py-[3px] text-center font-bold">
//               {companyName}
//             </div>

//             <div className="bg-yellow-300 py-[3px] text-center font-bold">
//               California
//             </div>
//           </div>

//           {/* ---------------------------------------------
//               SCHEDULE NAME
//           --------------------------------------------- */}

//           <div className="absolute left-[630px] top-0">
//             <div className="text-base font-bold">SCHEDULE C (1)</div>

//             <div className="text-sm font-bold">ICE (version 2.0.1h)</div>
//           </div>

//           {/* ---------------------------------------------
//               WHITE SPACE TITLE

//               This deliberately sits BELOW the company
//               block and ABOVE the yellow section.
//           --------------------------------------------- */}

//           <div className="absolute left-[255px] top-[54px] w-[372px] text-center">
//             <div className="py-[2px] font-bold italic leading-[18px]">
//               Overhead Expenses (final indirect cost pool)
//             </div>

//             <div className="bg-yellow-300 py-[3px] font-bold">
//               Customer Site Overhead
//             </div>

//             <div className="bg-yellow-300 py-[3px] font-bold">
//               Fiscal Year End - {fiscalYearEnd}
//             </div>
//           </div>
//         </div>

//         {/* =================================================
//             MAIN ACCOUNT TABLE
//         ================================================= */}

//         <ScheduleC1Table />

//         {/* =================================================
//             ALLOCATION SECTION

//             Same 8-column structure as the main table.

//             This is important because it keeps:

//             TOTAL
//             ADJUSTMENTS
//             CLAIMED
//             NOTES
//             REF

//             perfectly aligned.
//         ================================================= */}

//         <div className="mt-3 w-fit">
//           {/* ---------------------------------------------
//               CALIFORNIA INTERMEDIATE
//           --------------------------------------------- */}

//           <div className={tableGrid}>
//             {/* ACCOUNT */}
//             <div></div>

//             {/* DESCRIPTION */}
//             <div className="bg-yellow-300 px-1 py-1 font-semibold underline">
//               California Intermediate
//             </div>

//             {/* AMOUNT */}
//             <div className="bg-yellow-300 px-2 py-1 text-right whitespace-nowrap">
//               {californiaIntermediate.amount}
//             </div>

//             {/* TOTAL */}
//             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
//               {californiaIntermediate.total}
//             </div>

//             {/* ADJUSTMENT */}
//             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
//               {californiaIntermediate.adjustment}
//             </div>

//             {/* CLAIMED */}
//             <div className="bg-yellow-300 px-2 py-1 text-right whitespace-nowrap">
//               {californiaIntermediate.claimed}
//             </div>

//             {/* NOTES */}
//             <div></div>

//             {/* REF */}
//             <ReferenceBox>Sched D (1)</ReferenceBox>
//           </div>

//           {/* ---------------------------------------------
//               SECOND REFERENCE ROW

//               This keeps Sched D (2) directly below
//               Sched D (1), underneath Ref.
//           --------------------------------------------- */}

//           <div className={tableGrid}>
//             <div></div>

//             <div></div>

//             <div></div>

//             <div></div>

//             <div></div>

//             <div></div>

//             <div></div>

//             <ReferenceBox>Sched D (2)</ReferenceBox>
//           </div>

//           {/* ---------------------------------------------
//               FRINGE ALLOCATION
//           --------------------------------------------- */}

//           <div className={tableGrid}>
//             {/* ACCOUNT */}
//             <div className="px-1 py-1 font-bold">ADD: Fringe Allocation</div>

//             {/* DESCRIPTION */}
//             <div></div>

//             {/* AMOUNT */}
//             <div className="bg-yellow-300 px-2 py-1 text-right whitespace-nowrap">
//               {/* Empty / imported value area */}
//             </div>

//             {/* TOTAL */}
//             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
//               {fringeAllocation.total}
//             </div>

//             {/* ADJUSTMENT */}
//             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
//               {fringeAllocation.adjustment}
//             </div>

//             {/* CLAIMED */}
//             <div className="bg-yellow-300 px-2 py-1 text-right whitespace-nowrap">
//               {fringeAllocation.claimed}
//             </div>

//             {/* NOTES */}
//             <div></div>

//             {/* REF */}
//             <ReferenceBox>Fringe</ReferenceBox>
//           </div>

//           {/* ---------------------------------------------
//               TOTAL OVERHEAD POOL
//           --------------------------------------------- */}

//           <div className={`${tableGrid} border-b border-black`}>
//             {/* ACCOUNT */}
//             <div></div>

//             {/* DESCRIPTION */}
//             <div className="px-1 py-1 font-bold">Total Overhead Pool</div>

//             {/* AMOUNT */}
//             <div></div>

//             {/* TOTAL */}
//             <div className="bg-cyan-300 px-2 py-1 text-right font-medium whitespace-nowrap">
//               {totalOverheadPool.total}
//             </div>

//             {/* ADJUSTMENT */}
//             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
//               {totalOverheadPool.adjustment}
//             </div>

//             {/* CLAIMED */}
//             <div className="bg-cyan-300 px-2 py-1 text-right font-medium whitespace-nowrap">
//               {totalOverheadPool.claimed}
//             </div>

//             {/* NOTES */}
//             <div></div>

//             {/* REF */}
//             <div></div>
//           </div>
//         </div>

//         {/* =================================================
//             EXPLANATORY NOTES
//         ================================================= */}

//         <div className="mt-5 max-w-[1100px]">
//           <div className="font-bold underline">Explanatory Notes:</div>

//           <div className="mt-3 text-xs leading-5">
//             Explanation reflects the allocation of two separate Fringe benefit
//             pools (D-1). AERO Fringe Pool 2 (D-1) has been linked directly to
//             the Fringe Allocation section to ensure consistent treatment with
//             Fringe Pool 1. These costs are allocated to the benefiting Overhead
//             and G&amp;A pools based on the specific labor categories assigned to
//             each fringe group.
//           </div>
//         </div>

//         {/* =================================================
//             LEGEND
//         ================================================= */}

//         <div className="mt-7 space-y-2 text-xs">
//           {/* Yellow */}
//           <div className="flex items-center gap-2">
//             <span className="bg-yellow-300 px-2 py-1">
//               Imported from Other Worksheet
//             </span>

//             <span>As Referenced</span>
//           </div>

//           {/* Cyan */}
//           <div className="flex items-center gap-2">
//             <span className="bg-cyan-300 px-2 py-1">
//               Cell Contains a Formula
//             </span>

//             <span>Totals Claimed and Reconciling Differences</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { backendUrl } from "../config";

// const companyName = "Revolve ";
// const fiscalYearEnd = "12/31/2025";

// const formatCurrency = (val) => {
//   if (val === null || val === undefined || isNaN(val) || val === 0) return "";
//   const roundedVal = Math.round(val);
//   if (roundedVal < 0)
//     return `(${Math.abs(roundedVal).toLocaleString("en-US")})`;
//   return roundedVal.toLocaleString("en-US");
// };

// /* =========================================================
//    TABLE COLUMN STRUCTURE
// ========================================================= */

// const tableGrid =
//   "grid grid-cols-[120px_220px_90px_110px_110px_100px_70px_90px]";

// /* =========================================================
//    REFERENCE BOX COMPONENT
// ========================================================= */

// function ReferenceBox({ children, onClick }) {
//   return (
//     <div className="flex justify-center">
//       <button
//         type="button"
//         onClick={onClick}
//         className="bg-blue-700 px-2 py-1 text-center text-xs font-bold text-white underline whitespace-nowrap cursor-pointer hover:bg-blue-800 transition-colors"
//       >
//         {children}
//       </button>
//     </div>
//   );
// }

// /* =========================================================
//    MAIN SCHEDULE C1 COMPONENT
// ========================================================= */

// export default function SchedC1({ onNavigate }) {
//   const [scheduleC1Data, setScheduleC1Data] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `${backendUrl}/api/TrialBalance/scheduleC1_cost?fycd=2025`,
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP Error status: ${response.status}`);
//         }

//         const data = await response.json();

//         // Aggregate records by acctId
//         const aggregated = data.reduce((acc, item) => {
//           const acctId = item.acctId;
//           const endingBal = item.endingBalance || 0;

//           if (!acc[acctId]) {
//             acc[acctId] = {
//               account: acctId,
//               description: item.acctName ? item.acctName.trim() : "",
//               amountRaw: endingBal,
//               adjustmentRaw: 0,
//             };
//           } else {
//             acc[acctId].amountRaw += endingBal;
//           }
//           return acc;
//         }, {});

//         // Compute row totals and claimed values
//         const rows = Object.values(aggregated).map((row) => {
//           const total = row.amountRaw;
//           const adjustment = row.adjustmentRaw;
//           const claimed = total + adjustment;

//           return {
//             ...row,
//             totalRaw: total,
//             adjustmentRaw: adjustment,
//             claimedRaw: claimed,
//           };
//         });

//         setScheduleC1Data(rows);
//       } catch (err) {
//         console.error("Failed to fetch Schedule C1 data:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Compute Subtotals
//   const subtotalAmount = scheduleC1Data.reduce(
//     (sum, r) => sum + r.amountRaw,
//     0,
//   );
//   const subtotalTotal = scheduleC1Data.reduce((sum, r) => sum + r.totalRaw, 0);
//   const subtotalAdjustment = scheduleC1Data.reduce(
//     (sum, r) => sum + r.adjustmentRaw,
//     0,
//   );
//   const subtotalClaimed = scheduleC1Data.reduce(
//     (sum, r) => sum + r.claimedRaw,
//     0,
//   );

//   // Dynamic Allocation Mock / Values (can be dynamically bound to API or props as needed)
//   const californiaIntermediate = {
//     amount: 1993952,
//     total: 1993952,
//     adjustment: 0,
//     claimed: 1993952,
//   };

//   const fringeAllocation = {
//     total: 134,
//     adjustment: 0,
//     claimed: 134,
//   };

//   const totalOverheadPool = {
//     total:
//       subtotalTotal + californiaIntermediate.total + fringeAllocation.total,
//     adjustment:
//       subtotalAdjustment +
//       californiaIntermediate.adjustment +
//       fringeAllocation.adjustment,
//     claimed:
//       subtotalClaimed +
//       californiaIntermediate.claimed +
//       fringeAllocation.claimed,
//   };

//   return (
//     <div className="min-h-full w-full overflow-x-auto bg-white text-black font-sans">
//       <div className="min-w-[900px] p-4">
//         {/* =================================================
//             HEADER
//         ================================================= */}
//         <div className="relative mb-8 h-[125px]">
//           {/* LINKED SCHEDULES */}
//           <div className="absolute left-0 top-0 w-[250px] text-sm">
//             <div>Schedule C is linked to the following</div>
//             <div>schedules:</div>
//             <div>
//               <button
//                 type="button"
//                 onClick={() => onNavigate && onNavigate("sched_d1")}
//                 className="text-blue-700 underline hover:text-blue-900 cursor-pointer"
//               >
//                 Schedule D(x)
//               </button>
//             </div>
//             <div className="mt-8 text-blue-700 underline cursor-pointer">
//               ICE MANUAL
//             </div>
//           </div>

//           {/* COMPANY NAME */}
//           <div className="absolute left-[255px] top-0 w-[372px]">
//             <div className="bg-yellow-300 py-[3px] text-center font-bold">
//               {companyName}
//             </div>
//             <div className="bg-yellow-300 py-[3px] text-center font-bold">
//               California
//             </div>
//           </div>

//           {/* SCHEDULE NAME */}
//           <div className="absolute left-[630px] top-0">
//             <div className="text-base font-bold">SCHEDULE C (1)</div>
//             <div className="text-sm font-bold">ICE (version 2.0.1h)</div>
//           </div>

//           {/* SUB-HEADER */}
//           <div className="absolute left-[255px] top-[54px] w-[372px] text-center">
//             <div className="py-[2px] font-bold italic leading-[18px]">
//               Overhead Expenses (final indirect cost pool)
//             </div>
//             <div className="bg-yellow-300 py-[3px] font-bold">
//               Customer Site Overhead
//             </div>
//             <div className="bg-yellow-300 py-[3px] font-bold">
//               Fiscal Year End - {fiscalYearEnd}
//             </div>
//           </div>
//         </div>

//         {/* =================================================
//             MAIN ACCOUNT TABLE
//         ================================================= */}
//         <div className="w-fit">
//           {/* TABLE HEADER */}
//           <div
//             className={`${tableGrid} border-b border-black text-sm text-black`}
//           >
//             <div className="px-1 py-1 text-left font-bold">
//               <div className="underline">ACCOUNT</div>
//               <div className="underline">NUMBER</div>
//             </div>
//             <div className="px-2 py-1 text-left font-bold underline">
//               DESCRIPTION
//             </div>
//             <div className="px-1 py-1 text-center">
//               <div className="font-bold">Acct Balances</div>
//               <div className="bg-yellow-300 font-bold underline">Amount</div>
//             </div>
//             <div className="px-1 py-1 text-center font-bold">
//               <div>TOTAL PER G/L,</div>
//               <div>&amp; TRIAL BAL/F/S</div>
//             </div>
//             <div className="px-1 py-1 text-center font-bold">ADJUSTMENTS</div>
//             <div className="px-1 py-1 text-center font-bold">CLAIMED</div>
//             <div className="px-1 py-1 text-center font-bold">Notes</div>
//             <div className="px-1 py-1 text-center font-bold">Ref.</div>
//           </div>

//           {/* ACCOUNT ROWS */}
//           {loading ? (
//             <div className="py-4 text-center font-semibold text-gray-600">
//               Loading Schedule C1 data...
//             </div>
//           ) : error ? (
//             <div className="py-4 text-center font-semibold text-red-600">
//               Error loading data: {error}
//             </div>
//           ) : (
//             scheduleC1Data.map((row) => (
//               <div
//                 key={row.account}
//                 className={`${tableGrid} text-sm text-black hover:bg-gray-100`}
//               >
//                 <div className="px-1 py-[2px] whitespace-nowrap">
//                   {row.account}
//                 </div>
//                 <div className="px-2 py-[2px] whitespace-nowrap">
//                   {row.description}
//                 </div>
//                 <div className="px-2 py-[2px] text-right whitespace-nowrap">
//                   {formatCurrency(row.amountRaw)}
//                 </div>
//                 <div className="bg-cyan-300 px-2 py-[2px] text-right whitespace-nowrap">
//                   {formatCurrency(row.totalRaw)}
//                 </div>
//                 <div className="px-2 py-[2px] text-right whitespace-nowrap">
//                   {row.adjustmentRaw === 0
//                     ? "-"
//                     : formatCurrency(row.adjustmentRaw)}
//                 </div>
//                 <div className="bg-cyan-300 px-2 py-[2px] text-right whitespace-nowrap">
//                   {row.claimedRaw === 0 ? "-" : formatCurrency(row.claimedRaw)}
//                 </div>
//                 <div></div>
//                 <div></div>
//               </div>
//             ))
//           )}

//           {/* SUBTOTAL */}
//           <div
//             className={`${tableGrid} mt-2 border-b border-black text-sm text-black font-bold`}
//           >
//             <div></div>
//             <div className="px-2 py-1 underline">Subtotal</div>
//             <div className="bg-cyan-300 px-2 py-1 text-right">
//               {formatCurrency(subtotalAmount)}
//             </div>
//             <div className="bg-cyan-300 px-2 py-1 text-right">
//               {formatCurrency(subtotalTotal)}
//             </div>
//             <div className="bg-cyan-300 px-2 py-1 text-right">
//               {subtotalAdjustment === 0
//                 ? "-"
//                 : formatCurrency(subtotalAdjustment)}
//             </div>
//             <div className="bg-cyan-300 px-2 py-1 text-right">
//               {formatCurrency(subtotalClaimed)}
//             </div>
//             <div></div>
//             <div></div>
//           </div>
//         </div>

//         {/* =================================================
//             ALLOCATION SECTION
//         ================================================= */}
//         <div className="mt-3 w-fit">
//           {/* CALIFORNIA INTERMEDIATE */}
//           <div className={tableGrid}>
//             <div></div>
//             <div className="bg-yellow-300 px-1 py-1 font-semibold underline">
//               California Intermediate
//             </div>
//             <div className="bg-yellow-300 px-2 py-1 text-right whitespace-nowrap">
//               {formatCurrency(californiaIntermediate.amount)}
//             </div>
//             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
//               {formatCurrency(californiaIntermediate.total)}
//             </div>
//             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
//               {californiaIntermediate.adjustment === 0
//                 ? "-"
//                 : formatCurrency(californiaIntermediate.adjustment)}
//             </div>
//             <div className="bg-yellow-300 px-2 py-1 text-right whitespace-nowrap">
//               {formatCurrency(californiaIntermediate.claimed)}
//             </div>
//             <div></div>
//             <ReferenceBox onClick={() => onNavigate && onNavigate("sched_d1")}>
//               Sched D (1)
//             </ReferenceBox>
//           </div>

//           {/* SECOND REFERENCE ROW */}
//           <div className={tableGrid}>
//             <div></div>
//             <div></div>
//             <div></div>
//             <div></div>
//             <div></div>
//             <div></div>
//             <div></div>
//             <ReferenceBox onClick={() => onNavigate && onNavigate("sched_d2")}>
//               Sched D (2)
//             </ReferenceBox>
//           </div>

//           {/* FRINGE ALLOCATION */}
//           <div className={tableGrid}>
//             <div className="px-1 py-1 font-bold">ADD: Fringe Allocation</div>
//             <div></div>
//             <div className="bg-yellow-300 px-2 py-1 text-right whitespace-nowrap"></div>
//             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
//               {formatCurrency(fringeAllocation.total)}
//             </div>
//             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
//               {fringeAllocation.adjustment === 0
//                 ? "-"
//                 : formatCurrency(fringeAllocation.adjustment)}
//             </div>
//             <div className="bg-yellow-300 px-2 py-1 text-right whitespace-nowrap">
//               {formatCurrency(fringeAllocation.claimed)}
//             </div>
//             <div></div>
//             <ReferenceBox
//               onClick={() => onNavigate && onNavigate("sched_fringe")}
//             >
//               Fringe
//             </ReferenceBox>
//           </div>

//           {/* TOTAL OVERHEAD POOL */}
//           <div className={`${tableGrid} border-b border-black font-bold`}>
//             <div></div>
//             <div className="px-1 py-1">Total Overhead Pool</div>
//             <div></div>
//             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
//               {formatCurrency(totalOverheadPool.total)}
//             </div>
//             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
//               {totalOverheadPool.adjustment === 0
//                 ? "-"
//                 : formatCurrency(totalOverheadPool.adjustment)}
//             </div>
//             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
//               {formatCurrency(totalOverheadPool.claimed)}
//             </div>
//             <div></div>
//             <div></div>
//           </div>
//         </div>

//         {/* =================================================
//             EXPLANATORY NOTES
//         ================================================= */}
//         <div className="mt-5 max-w-[1100px]">
//           <div className="font-bold underline">Explanatory Notes:</div>
//           <div className="mt-3 text-xs leading-5">
//             Explanation reflects the allocation of two separate Fringe benefit
//             pools (D-1). AERO Fringe Pool 2 (D-1) has been linked directly to
//             the Fringe Allocation section to ensure consistent treatment with
//             Fringe Pool 1. These costs are allocated to the benefiting Overhead
//             and G&amp;A pools based on the specific labor categories assigned to
//             each fringe group.
//           </div>
//         </div>

//         {/* =================================================
//             LEGEND
//         ================================================= */}
//         <div className="mt-7 space-y-2 text-xs">
//           <div className="flex items-center gap-2">
//             <span className="bg-yellow-300 px-2 py-1">
//               Imported from Other Worksheet
//             </span>
//             <span>As Referenced</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="bg-cyan-300 px-2 py-1">
//               Cell Contains a Formula
//             </span>
//             <span>Totals Claimed and Reconciling Differences</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { backendUrl } from "../config";

// const companyName = "Revolve ";

const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val) || val === 0) return "";
  const roundedVal = Math.round(val);
  if (roundedVal < 0)
    return `(${Math.abs(roundedVal).toLocaleString("en-US")})`;
  return roundedVal.toLocaleString("en-US");
};

/* =========================================================
   TABLE COLUMN STRUCTURE
========================================================= */
const tableGrid =
  "grid grid-cols-[120px_220px_90px_110px_110px_100px_70px_90px]";

/* =========================================================
   REFERENCE BOX COMPONENT
========================================================= */
function ReferenceBox({ children, onClick }) {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={onClick}
        className="bg-blue-700 px-2 py-1 text-center text-xs font-bold text-white underline whitespace-nowrap cursor-pointer hover:bg-blue-800 transition-colors"
      >
        {children}
      </button>
    </div>
  );
}

/* =========================================================
   MAIN SCHEDULE C1 COMPONENT
========================================================= */
// export default function SchedC1({
//   onNavigate,
//   companyName,
//   companyAddress,
//   explanatoryNote,
//   setExplanatoryNote,
//   year,
//   fiscalYearEnd,
// }) {
const SchedC1 = forwardRef(function SchedC1(
  {
    onNavigate,
    companyName,
    companyAddress,
    explanatoryNote,
    setExplanatoryNote,
    year,
    fiscalYearEnd,
  },
  ref,
) {
  const [scheduleC1Data, setScheduleC1Data] = useState([]);
  const [californiaIntermediateVal, setCaliforniaIntermediateVal] = useState(0);
  const [fringeAllocationVal, setFringeAllocationVal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAccountObj, setSelectedAccountObj] = useState(null);
  const [originalAccounts, setOriginalAccounts] = useState(new Set());
  const [deletedAccounts, setDeletedAccounts] = useState(new Set());

  useImperativeHandle(ref, () => ({
    getPayload: () => {
      const payload = [];

      // NEW ROWS
      scheduleC1Data.forEach((row) => {
        if (row.isNew) {
          payload.push({
            year: Number(year),
            acctId: row.account,
            scheduleCode: "sched_c1",
            isAdd: true,
          });
        }
      });

      // DELETED EXISTING ROWS
      deletedAccounts.forEach((acctId) => {
        payload.push({
          year: Number(year),
          acctId,
          scheduleCode: "sched_c1",
          isAdd: false,
        });
      });

      return payload;
    },
  }));

  // const fiscalYearEnd = `12/31/${year}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const accountsResponse = await fetch(
          `${backendUrl}/api/TrialBalance?fyCd=${year}`,
        );
        if (accountsResponse.ok) {
          const accountsData = await accountsResponse.json();
          const uniqueAccountsMap = {};
          (Array.isArray(accountsData) ? accountsData : []).forEach((item) => {
            if (item.acctId && !uniqueAccountsMap[item.acctId]) {
              uniqueAccountsMap[item.acctId] = {
                acctId: item.acctId,
                acctName: item.acctName ? item.acctName.trim() : "",
                endingBalance: item.endingBalance || 0,
              };
            }
          });
          setAvailableAccounts(Object.values(uniqueAccountsMap));
        }

        const response = await fetch(
          `${backendUrl}/api/TrialBalance/scheduleC1_cost?fycd=${year}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP Error status: ${response.status}`);
        }

        const data = await response.json();

        // Extract accounts array safely
        const rawAccounts = data.accounts || [];

        // Aggregate records by acctId if duplicates exist
        const aggregated = rawAccounts.reduce((acc, item) => {
          const acctId = item.acctId;
          const endingBal = item.endingBalance || 0;

          if (!acc[acctId]) {
            acc[acctId] = {
              account: acctId,
              description: item.acctName ? item.acctName.trim() : "",
              amountRaw: endingBal,
              adjustmentRaw: 0,
            };
          } else {
            acc[acctId].amountRaw += endingBal;
          }
          return acc;
        }, {});

        // Compute row totals and claimed values
        const rows = Object.values(aggregated).map((row) => {
          const total = row.amountRaw;
          const adjustment = row.adjustmentRaw;
          const claimed = total + adjustment;

          return {
            ...row,
            totalRaw: total,
            adjustmentRaw: adjustment,
            claimedRaw: claimed,
            isNew: false,
          };
        });

        // Extract California Intermediate & Fringe Allocation dynamically from amounts array
        const rawAmounts = data.amounts || [];

        const calInterObj = rawAmounts.find((a) =>
          a.name?.toLowerCase().includes("california intermediate"),
        );
        const calInterAmt = calInterObj ? calInterObj.amount : 0;

        const fringeObj = rawAmounts.find((a) =>
          a.name?.toLowerCase().includes("fringe"),
        );
        const fringeAmt = fringeObj ? fringeObj.amount : 0;

        setScheduleC1Data(rows);
        setCaliforniaIntermediateVal(calInterAmt);
        setFringeAllocationVal(fringeAmt);
        setOriginalAccounts(new Set(rows.map((row) => row.account)));
      } catch (err) {
        console.error("Failed to fetch Schedule C1 data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  const filteredAccounts = availableAccounts.filter((acc) => {
    const q = searchQuery.toLowerCase();
    return (
      acc.acctId.toLowerCase().includes(q) ||
      acc.acctName.toLowerCase().includes(q)
    );
  });

  const handleSelectAccount = (account) => {
    setSelectedAccountObj(account);
    setSearchQuery(`${account.acctId} - ${account.acctName}`);
    setIsDropdownOpen(false);
  };

  const handleAddRow = () => {
    if (!selectedAccountObj) {
      alert("Please select an Account ID first.");
      return;
    }

    const exists = scheduleC1Data.some(
      (r) => r.account === selectedAccountObj.acctId,
    );
    if (exists) {
      alert("This account is already present in the table.");
      return;
    }

    const amountRaw = selectedAccountObj.endingBalance || 0;
    const adjustmentRaw = 0;
    const totalRaw = amountRaw;
    const claimedRaw = totalRaw + adjustmentRaw;

    const newRow = {
      account: selectedAccountObj.acctId,
      description: selectedAccountObj.acctName,
      amountRaw,
      totalRaw,
      adjustmentRaw,
      claimedRaw,
      isNew: true,
    };

    setScheduleC1Data((prev) => [...prev, newRow]);
    setSelectedAccountObj(null);
    setSearchQuery("");
  };

  const handleRemoveRow = (acctId) => {
    const isOriginalAccount = originalAccounts.has(acctId);

    setScheduleC1Data((prev) => prev.filter((r) => r.account !== acctId));

    // Only track deletion if it was an existing database mapping
    if (isOriginalAccount) {
      setDeletedAccounts((prev) => {
        const next = new Set(prev);
        next.add(acctId);
        return next;
      });
    }
  };

  // Compute Subtotals
  const subtotalAmount = scheduleC1Data.reduce(
    (sum, r) => sum + r.amountRaw,
    0,
  );
  const subtotalTotal = scheduleC1Data.reduce((sum, r) => sum + r.totalRaw, 0);
  const subtotalAdjustment = scheduleC1Data.reduce(
    (sum, r) => sum + r.adjustmentRaw,
    0,
  );
  const subtotalClaimed = scheduleC1Data.reduce(
    (sum, r) => sum + r.claimedRaw,
    0,
  );

  // Dynamic Allocation Values
  const californiaIntermediate = {
    amount: californiaIntermediateVal,
    total: californiaIntermediateVal,
    adjustment: 0,
    claimed: californiaIntermediateVal,
  };

  const fringeAllocation = {
    total: fringeAllocationVal,
    adjustment: 0,
    claimed: fringeAllocationVal,
  };

  const totalOverheadPool = {
    total:
      subtotalTotal + californiaIntermediate.total + fringeAllocation.total,
    adjustment:
      subtotalAdjustment +
      californiaIntermediate.adjustment +
      fringeAllocation.adjustment,
    claimed:
      subtotalClaimed +
      californiaIntermediate.claimed +
      fringeAllocation.claimed,
  };

  const handleAdjustmentChange = (acctId, value) => {
    const numericVal = value === "" ? 0 : parseFloat(value) || 0;

    setScheduleC1Data((prev) =>
      prev.map((row) => {
        if (row.account === acctId) {
          const updatedAdjustment = numericVal;
          const updatedClaimed = row.totalRaw + updatedAdjustment;
          return {
            ...row,
            adjustmentRaw: updatedAdjustment,
            claimedRaw: updatedClaimed,
          };
        }
        return row;
      }),
    );
  };

  return (
    <div className="min-h-full w-full overflow-x-auto bg-white text-black font-sans">
      <div className="min-w-[900px] p-4">
        {/* =================================================
            HEADER
        ================================================= */}
        <div className="relative mb-8 h-[125px]">
          {/* LINKED SCHEDULES */}
          <div className="absolute left-0 top-0 w-[250px] text-sm">
            <div>Schedule C is linked to the following</div>
            <div>schedules:</div>
            <div>
              <button
                type="button"
                // onClick={() => onNavigate && onNavigate("sched_d1")}
                // className="text-blue-700 underline hover:text-blue-900 cursor-pointer"
              >
                Schedule D(x)
              </button>
            </div>
            <div className="mt-8 text-blue-700 underline cursor-pointer">
              ICE MANUAL
            </div>
          </div>

          {/* COMPANY NAME */}
          <div className="absolute left-[255px] top-0 w-[372px]">
            <div className="bg-[#ffff00] py-[3px] text-center font-bold">
              {companyName}
            </div>
            <div className="bg-[#ffff00] py-[3px] text-center font-bold">
              {companyAddress}
            </div>
          </div>

          {/* SCHEDULE NAME */}
          <div className="absolute left-[630px] top-0">
            <div className="text-base font-bold">SCHEDULE C (1)</div>
            <div className="text-sm font-bold">ICE (version 2.0.1h)</div>
          </div>

          {/* SUB-HEADER */}
          <div className="absolute left-[255px] top-[54px] w-[372px] text-center">
            <div className="py-[2px] font-bold italic leading-[18px]">
              Overhead Expenses (final indirect cost pool)
            </div>
            <div className="bg-[#ffff00] py-[3px] font-bold">
              Customer Site Overhead
            </div>
            <div className="bg-[#ffff00] py-[3px] font-bold">
              Fiscal Year End - {fiscalYearEnd}
            </div>
          </div>
        </div>

        {/* SEARCH & SELECT ACCOUNT CONTROLS */}
        <div className="mb-4 p-3 bg-gray-100 border rounded flex items-center gap-3">
          <label className="text-xs font-bold text-gray-700">
            Search &amp; Select Account:
          </label>
          <div className="relative min-w-[320px]">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedAccountObj(null);
                setIsDropdownOpen(true);
              }}
              placeholder="Type Account ID or Name..."
              className="w-full border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 max-h-56 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg z-50">
                {filteredAccounts.length > 0 ? (
                  filteredAccounts.map((acc) => (
                    <div
                      key={acc.acctId}
                      onClick={() => handleSelectAccount(acc)}
                      className="px-3 py-1.5 text-xs hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 flex justify-between gap-2"
                    >
                      <span className="font-semibold text-gray-800">
                        {acc.acctId}
                      </span>
                      <span className="text-gray-600 truncate">
                        {acc.acctName}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-xs text-gray-500 italic">
                    No accounts found matching search.
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddRow}
            className="ml-auto bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
          >
            + Add Row
          </button>
        </div>

        {/* =================================================
            MAIN ACCOUNT TABLE
        ================================================= */}
        <div className="w-fit">
          {/* TABLE HEADER */}
          <div
            className={`${tableGrid} border-b border-black text-sm text-black`}
          >
            <div className="px-1 py-1 text-left font-bold">
              <div className="underline">ACCOUNT</div>
              <div className="underline">NUMBER</div>
            </div>
            <div className="px-2 py-1 text-left font-bold underline">
              DESCRIPTION
            </div>
            <div className="px-1 py-1 text-center">
              <div className="font-bold">Acct Balances</div>
              <div className="bg-[#ffff00] font-bold underline">Amount</div>
            </div>
            <div className="px-1 py-1 text-center font-bold">
              <div>TOTAL PER G/L,</div>
              <div>&amp; TRIAL BAL/F/S</div>
            </div>
            <div className="px-1 py-1 text-center font-bold">ADJUSTMENTS</div>
            <div className="px-1 py-1 text-center font-bold">CLAIMED</div>
            <div className="px-1 py-1 text-center font-bold">Notes</div>
            <div className="px-1 py-1 text-center font-bold">Action</div>
            <div className="px-1 py-1 text-center font-bold">Ref.</div>
          </div>

          {/* ACCOUNT ROWS */}
          {loading ? (
            <div className="py-4 text-center font-semibold text-gray-600">
              Loading Schedule C1 data...
            </div>
          ) : error ? (
            <div className="py-4 text-center font-semibold text-red-600">
              Error loading data: {error}
            </div>
          ) : (
            scheduleC1Data.map((row) => (
              <div
                key={row.account}
                className={`${tableGrid} text-sm text-black hover:bg-gray-100`}
              >
                <div className="px-1 py-[2px] whitespace-nowrap">
                  {row.account}
                </div>
                <div className="px-2 py-[2px] whitespace-nowrap">
                  {row.description}
                </div>
                <div className="px-2 py-[2px] text-right whitespace-nowrap">
                  {formatCurrency(row.amountRaw)}
                </div>
                <div className="bg-cyan-300 px-2 py-[2px] text-right whitespace-nowrap">
                  {formatCurrency(row.totalRaw)}
                </div>
                {/* <div className="px-2 py-[2px] text-right whitespace-nowrap">
                  {row.adjustmentRaw === 0
                    ? "-"
                    : formatCurrency(row.adjustmentRaw)}
                </div> */}
                <div className="px-1 py-[2px] text-right whitespace-nowrap">
                  <input
                    type="number"
                    value={row.adjustmentRaw === 0 ? "" : row.adjustmentRaw}
                    onChange={(e) =>
                      handleAdjustmentChange(row.account, e.target.value)
                    }
                    placeholder="0"
                    className="w-full text-right px-1 py-0.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-xs font-mono"
                  />
                </div>
                <div className="bg-cyan-300 px-2 py-[2px] text-right whitespace-nowrap">
                  {row.claimedRaw === 0 ? "-" : formatCurrency(row.claimedRaw)}
                </div>
                <div />
                <div className="px-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(row.account)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-0.5 rounded font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
                <div />
                {/* <div></div>
                <div></div> */}
              </div>
            ))
          )}

          {/* SUBTOTAL */}
          <div
            className={`${tableGrid} mt-2 border-b border-black text-sm text-black font-bold`}
          >
            <div></div>
            <div className="px-2 py-1 underline">Subtotal</div>
            <div className="bg-cyan-300 px-2 py-1 text-right">
              {formatCurrency(subtotalAmount)}
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right">
              {formatCurrency(subtotalTotal)}
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right">
              {subtotalAdjustment === 0
                ? "-"
                : formatCurrency(subtotalAdjustment)}
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right">
              {formatCurrency(subtotalClaimed)}
            </div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        {/* =================================================
            ALLOCATION SECTION
        ================================================= */}
        <div className="mt-3 w-fit">
          {/* CALIFORNIA INTERMEDIATE */}
          <div className={tableGrid}>
            <div></div>
            <div className="bg-[#ffff00] px-1 py-1 font-semibold underline">
              California Intermediate
            </div>
            <div className="bg-[#ffff00] px-2 py-1 text-right whitespace-nowrap">
              {formatCurrency(californiaIntermediate.amount)}
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
              {formatCurrency(californiaIntermediate.total)}
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
              {californiaIntermediate.adjustment === 0
                ? "-"
                : formatCurrency(californiaIntermediate.adjustment)}
            </div>
            <div className="bg-[#ffff00] px-2 py-1 text-right whitespace-nowrap">
              {formatCurrency(californiaIntermediate.claimed)}
            </div>
            <div></div>
            <ReferenceBox onClick={() => onNavigate && onNavigate("sched_d1")}>
              Sched D (1)
            </ReferenceBox>
          </div>

          {/* SECOND REFERENCE ROW */}
          <div className={tableGrid}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <ReferenceBox onClick={() => onNavigate && onNavigate("sched_d2")}>
              Sched D (2)
            </ReferenceBox>
          </div>

          {/* FRINGE ALLOCATION */}
          <div className={tableGrid}>
            <div className="px-1 py-1 font-bold">ADD: Fringe Allocation</div>
            <div></div>
            <div className="bg-[#ffff00] px-2 py-1 text-right whitespace-nowrap"></div>
            <div className="bg-[#ffff00] px-2 py-1 text-right whitespace-nowrap">
              {formatCurrency(fringeAllocation.total)}
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
              {fringeAllocation.adjustment === 0
                ? "-"
                : formatCurrency(fringeAllocation.adjustment)}
            </div>
            <div className="bg-[#ffff00] px-2 py-1 text-right whitespace-nowrap">
              {formatCurrency(fringeAllocation.claimed)}
            </div>
            <div></div>
            <ReferenceBox
              onClick={() => onNavigate && onNavigate("sched_fringe")}
            >
              Fringe
            </ReferenceBox>
          </div>

          {/* TOTAL OVERHEAD POOL */}
          <div className={`${tableGrid} border-b border-black font-bold`}>
            <div></div>
            <div className="px-1 py-1">Total Overhead Pool</div>
            <div></div>
            <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
              {formatCurrency(totalOverheadPool.total)}
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
              {totalOverheadPool.adjustment === 0
                ? "-"
                : formatCurrency(totalOverheadPool.adjustment)}
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
              {formatCurrency(totalOverheadPool.claimed)}
            </div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        {/* =================================================
            EXPLANATORY NOTES
        ================================================= */}
        {/* <div className="mt-5 max-w-[1100px]"> */}
        {/* <div className="font-bold underline">Explanatory Notes:</div>
          <div className="mt-3 text-xs leading-5">
            Explanation reflects the allocation of two separate Fringe benefit
            pools (D-1). AERO Fringe Pool 2 (D-1) has been linked directly to
            the Fringe Allocation section to ensure consistent treatment with
            Fringe Pool 1. These costs are allocated to the benefiting Overhead
            and G&amp;A pools based on the specific labor categories assigned to
            each fringe group.
          </div> */}
        <div className="mt-5 border p-4 bg-gray-50 rounded">
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
        {/* </div> */}

        {/* =================================================
            LEGEND
        ================================================= */}
        <div className="mt-7 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-[#ffff00] px-2 py-1">
              Imported from Other Worksheet
            </span>
            <span>As Referenced</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-cyan-300 px-2 py-1">
              Cell Contains a Formula
            </span>
            <span>Totals Claimed and Reconciling Differences</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SchedC1;
