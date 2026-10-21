// import React, { useState, useEffect } from "react";
// import { backendUrl } from "../config";

// const formatCurrency = (val) => {
//   if (val === null || val === undefined || isNaN(val) || val === 0) return "-";
//   const roundedVal = Math.round(val);
//   if (roundedVal < 0)
//     return `(${Math.abs(roundedVal).toLocaleString("en-US")})`;
//   return roundedVal.toLocaleString("en-US");
// };

// export default function SchedB({
//   onNavigate,
//   companyName,
//   companyAddress,
//   childSaveRef,
//   explanatoryNote,
//   setExplanatoryNote,
//   year,
//   fiscalYearEnd,
// }) {
//   const [scheduleBData, setScheduleBData] = useState([]);
//   const [fringeAllocation, setFringeAllocation] = useState({
//     acctName: "Fringe Allocation",
//     endingBalance: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // const fiscalYearEnd = `12/31/${year}`;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `${backendUrl}/api/TrialBalance/scheduleB_cost?fycd=${year}`,
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP Error status: ${response.status}`);
//         }

//         const data = await response.json();

//         // Extract accounts array and fringeAllocation object from payload
//         const accountsList = Array.isArray(data) ? data : data.accounts || [];
//         const fringeData = data.fringeAllocation || {
//           acctName: "Fringe Allocation",
//           endingBalance: 0,
//         };

//         setFringeAllocation(fringeData);

//         // Aggregate records by account ID (acctId)
//         const aggregated = accountsList.reduce((acc, item) => {
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

//         // Transform aggregated map to display rows array
//         const rows = Object.values(aggregated).map((row) => {
//           let adjustment = row.adjustmentRaw;
//           if (row.account === "90-03-01") {
//             adjustment = -row.amountRaw;
//           }

//           const total = row.amountRaw;
//           const claimed = total + adjustment;

//           return {
//             ...row,
//             totalRaw: total,
//             adjustmentRaw: adjustment,
//             claimedRaw: claimed,
//           };
//         });

//         setScheduleBData(rows);
//       } catch (err) {
//         console.error("Failed to fetch Schedule B data:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Subtotals calculation
//   const subtotalAmount = scheduleBData.reduce((sum, r) => sum + r.amountRaw, 0);
//   const subtotalTotal = scheduleBData.reduce((sum, r) => sum + r.totalRaw, 0);
//   const subtotalAdjustment = scheduleBData.reduce(
//     (sum, r) => sum + r.adjustmentRaw,
//     0,
//   );
//   const subtotalClaimed = scheduleBData.reduce(
//     (sum, r) => sum + r.claimedRaw,
//     0,
//   );

//   // Fringe Allocation values
//   const fringeBal = fringeAllocation.endingBalance || 0;

//   // Intermediate Subtotal
//   const intermediateSubtotalTotal = subtotalTotal + fringeBal;
//   const intermediateSubtotalClaimed = subtotalClaimed + fringeBal;

//   // Final Pool Total Calculations
//   const finalTotalTotal = intermediateSubtotalTotal;
//   const finalTotalAdjustment = subtotalAdjustment;
//   const finalTotalClaimed = intermediateSubtotalClaimed;

//   return (
//     <div className="min-h-full w-full overflow-x-auto bg-white text-black font-sans">
//       <div className="min-w-[1100px] p-5">
//         {/* TOP HEADER */}
//         <div className="relative min-h-[205px]">
//           {/* Linked schedules */}
//           <div className="absolute left-0 top-0 w-[270px] text-sm">
//             <div>Schedule B is linked to the following</div>
//             <div>schedules:</div>
//             <button
//               onClick={() => onNavigate?.("sched_d1")}
//               className="block hover:underline text-blue-700 text-left cursor-pointer"
//             >
//               Schedule D (x), Intermediate Allocations
//             </button>
//             <button
//               onClick={() => onNavigate?.("sched_e")}
//               className="block hover:underline text-blue-700 text-left cursor-pointer"
//             >
//               Schedule E, Bases
//             </button>
//             <button
//               onClick={() => onNavigate?.("sched_h")}
//               className="block hover:underline text-blue-700 text-left cursor-pointer"
//             >
//               Schedule H, Contract Costs
//             </button>
//             <button
//               onClick={() => onNavigate?.("sched_summaryh")}
//               className="block hover:underline text-blue-700 text-left cursor-pointer"
//             >
//               Summary Sch H
//             </button>
//             <div className="text-gray-700">Sched P, IR&amp;D&amp;B&amp;P</div>
//             <div className="mt-3 text-blue-700 underline cursor-pointer">
//               ICE MANUAL
//             </div>
//           </div>

//           {/* COMPANY */}
//           <div className="absolute left-[270px] top-0 w-[530px]">
//             <div className="bg-[#ffff00] py-1 text-center font-bold">
//               {companyName}
//             </div>
//             <div className="bg-[#ffff00] py-1 text-center font-bold">
//               {companyAddress}
//             </div>
//           </div>

//           {/* SCHEDULE TITLE */}
//           <div className="absolute right-0 top-0 text-right">
//             <div className="text-base font-bold">SCHEDULE B</div>
//             <div className="text-sm font-bold">ICE (version 2.0.1h)</div>
//           </div>

//           {/* MAIN TITLE */}
//           <div className="absolute left-[270px] top-[58px] w-[530px] text-center">
//             <div className="text-base font-bold">
//               General and Administrative (G&amp;A) Expenses (Final Indirect Cost
//               Pool)
//             </div>
//             <div className="mt-1 bg-[#ffff00] py-1 font-bold">
//               General and Administrative (G&amp;A) Expenses
//             </div>
//             <div className="bg-[#ffff00] py-1 font-bold">
//               Fiscal Year End - {fiscalYearEnd}
//             </div>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse text-sm text-black">
//             <thead>
//               <tr className="border-b border-gray-400">
//                 <th className="px-1 py-2 text-left align-bottom w-[140px]">
//                   <div className="font-bold underline">ACCOUNT NUMBER</div>
//                 </th>
//                 <th className="px-2 py-2 text-left align-bottom min-w-[280px]">
//                   <div className="font-bold underline">DESCRIPTION</div>
//                 </th>
//                 <th className="px-2 py-2 text-center align-bottom w-[130px]">
//                   <div className="font-bold">Acct Balances</div>
//                   <div className="bg-[#ffff00] font-bold underline">Amount</div>
//                 </th>
//                 <th className="px-2 py-2 text-center align-bottom w-[130px]">
//                   <div className="font-bold">TOTAL PER</div>
//                   <div className="font-bold">G/L, F/S</div>
//                   <div className="font-bold">&amp; TRIAL BAL.</div>
//                 </th>
//                 <th className="px-2 py-2 text-center align-bottom font-bold w-[120px]">
//                   ADJUSTMENT
//                 </th>
//                 <th className="px-2 py-2 text-center align-bottom font-bold w-[130px]">
//                   CLAIMED
//                 </th>
//                 <th className="px-2 py-2 text-center align-bottom font-bold w-[80px]">
//                   NOTES
//                 </th>
//                 <th className="px-2 py-2 text-center align-bottom font-bold w-[160px]">
//                   Reference
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td
//                     colSpan="8"
//                     className="py-6 text-center font-semibold text-gray-600"
//                   >
//                     Loading Schedule B data...
//                   </td>
//                 </tr>
//               ) : error ? (
//                 <tr>
//                   <td
//                     colSpan="8"
//                     className="py-6 text-center font-semibold text-red-600"
//                   >
//                     Error loading data: {error}
//                   </td>
//                 </tr>
//               ) : (
//                 scheduleBData.map((row) => (
//                   <tr key={row.account} className="hover:bg-gray-50">
//                     <td className="px-1 py-1 whitespace-nowrap font-medium">
//                       {row.account}
//                     </td>
//                     <td className="px-2 py-1 whitespace-nowrap">
//                       {row.description}
//                     </td>
//                     <td className="px-2 py-1 text-right whitespace-nowrap">
//                       {formatCurrency(row.amountRaw)}
//                     </td>
//                     <td className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
//                       {formatCurrency(row.totalRaw)}
//                     </td>
//                     <td className="px-2 py-1 text-right whitespace-nowrap">
//                       {formatCurrency(row.adjustmentRaw)}
//                     </td>
//                     <td className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
//                       {formatCurrency(row.claimedRaw)}
//                     </td>
//                     <td className="px-2 py-1"></td>
//                     <td className="px-2 py-1"></td>
//                   </tr>
//                 ))
//               )}

//               {/* SUBTOTAL ROW */}
//               <tr className="border-t border-black font-bold">
//                 <td></td>
//                 <td className="px-2 py-1 underline">SUBTOTAL</td>
//                 <td className="bg-cyan-300 px-2 py-1 text-right">
//                   {formatCurrency(subtotalAmount)}
//                 </td>
//                 <td className="bg-cyan-300 px-2 py-1 text-right">
//                   {formatCurrency(subtotalTotal)}
//                 </td>
//                 <td className="bg-cyan-300 px-2 py-1 text-right">
//                   {formatCurrency(subtotalAdjustment)}
//                 </td>
//                 <td className="bg-cyan-300 px-2 py-1 text-right">
//                   {formatCurrency(subtotalClaimed)}
//                 </td>
//                 <td></td>
//                 <td></td>
//               </tr>

//               {/* INTERMEDIATE ALLOCATIONS HEADER */}
//               <tr>
//                 <td colSpan="8" className="pt-2 font-bold underline">
//                   Intermediate Allocations:
//                 </td>
//               </tr>

//               {/* CALIFORNIA INTERMEDIATE */}
//               <tr>
//                 <td></td>
//                 <td className="px-2 py-1 bg-[#ffff00]">
//                   California Intermediate
//                 </td>
//                 <td className="bg-[#ffff00] px-2 py-1 text-right">-</td>
//                 <td className="bg-cyan-300 px-2 py-1 text-right">-</td>
//                 <td className="bg-cyan-300 px-2 py-1 text-right">-</td>
//                 <td className="bg-[#ffff00] px-2 py-1 text-right">-</td>
//                 <td></td>
//                 <td className="px-2 py-1">
//                   <div className="flex flex-col gap-0.5">
//                     <button
//                       type="button"
//                       onClick={() => onNavigate?.("sched_d1")}
//                       className="bg-blue-700 hover:bg-blue-800 text-white text-xs px-2 py-0.5 rounded-none font-medium text-center"
//                     >
//                       Sched D (1)
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => onNavigate?.("sched_d2")}
//                       className="bg-blue-700 hover:bg-blue-800 text-white text-xs px-2 py-0.5 rounded-none font-medium text-center"
//                     >
//                       Sched D (2)
//                     </button>
//                   </div>
//                 </td>
//               </tr>

//               {/* ADD: FRINGE ALLOCATION */}
//               <tr>
//                 <td className="font-bold py-1">ADD: Fringe Allocation</td>
//                 <td className="bg-[repeating-linear-gradient(45deg,#ccc,#ccc_2px,#fff_2px,#fff_8px)] h-6"></td>
//                 <td className="bg-[#ffff00] px-2 py-1 text-right">
//                   {formatCurrency(fringeBal)}
//                 </td>
//                 <td className="bg-cyan-300 px-2 py-1 text-right">
//                   {formatCurrency(fringeBal)}
//                 </td>
//                 <td className="bg-cyan-300 px-2 py-1 text-right">-</td>
//                 <td className="bg-[#ffff00] px-2 py-1 text-right">
//                   {formatCurrency(fringeBal)}
//                 </td>
//                 <td></td>
//                 <td className="px-2 py-1">
//                   <button
//                     type="button"
//                     onClick={() => onNavigate?.("sched_fringe")}
//                     className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs px-2 py-0.5 rounded-none font-medium text-center"
//                   >
//                     Fringe
//                   </button>
//                 </td>
//               </tr>

//               {/* INTERMEDIATE SUBTOTAL */}
//               <tr className="font-bold border-t border-black">
//                 <td></td>
//                 <td className="px-2 py-1 underline">SUBTOTAL</td>
//                 <td className="bg-cyan-300 px-2 py-1 text-right">
//                   {formatCurrency(subtotalAmount)}
//                 </td>
//                 <td className="bg-cyan-300 px-2 py-1 text-right">
//                   {formatCurrency(intermediateSubtotalTotal)}
//                 </td>
//                 <td className="bg-cyan-300 px-2 py-1 text-right">
//                   {formatCurrency(subtotalAdjustment)}
//                 </td>
//                 <td className="bg-cyan-300 px-2 py-1 text-right">
//                   {formatCurrency(intermediateSubtotalClaimed)}
//                 </td>
//                 <td></td>
//                 <td></td>
//               </tr>

//               {/* IR & D / B & P BREAKDOWN */}
//               <tr>
//                 <td></td>
//                 <td className="px-2 py-0.5">
//                   IR &amp; D Mat'l, Trvl, ODC (Sum SCH H)
//                 </td>
//                 <td></td>
//                 <td className="bg-[#ffff00] px-2 py-0.5 text-right">-</td>
//                 <td className="bg-cyan-300 px-2 py-0.5 text-right">-</td>
//                 <td className="bg-[#ffff00] px-2 py-0.5 text-right">-</td>
//                 <td></td>
//                 <td className="px-2 py-0.5">
//                   <button
//                     type="button"
//                     onClick={() => onNavigate?.("sched_summaryh")}
//                     className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs py-0.5 font-medium"
//                   >
//                     SUM SCHED H
//                   </button>
//                 </td>
//               </tr>
//               <tr>
//                 <td></td>
//                 <td className="px-2 py-0.5">IR &amp; D Labor (Sum SCH H)</td>
//                 <td></td>
//                 <td className="bg-[#ffff00] px-2 py-0.5 text-right">-</td>
//                 <td className="bg-cyan-300 px-2 py-0.5 text-right">-</td>
//                 <td className="bg-[#ffff00] px-2 py-0.5 text-right">-</td>
//                 <td></td>
//                 <td className="px-2 py-0.5">
//                   <button
//                     type="button"
//                     onClick={() => onNavigate?.("sched_summaryh")}
//                     className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs py-0.5 font-medium"
//                   >
//                     SUM SCHED H
//                   </button>
//                 </td>
//               </tr>
//               <tr>
//                 <td></td>
//                 <td className="px-2 py-0.5">IR&amp;D Fringe</td>
//                 <td></td>
//                 <td className="bg-gray-300 px-2 py-0.5 text-right">-</td>
//                 <td className="bg-cyan-300 px-2 py-0.5 text-right">-</td>
//                 <td className="bg-gray-300 px-2 py-0.5 text-right">-</td>
//                 <td></td>
//                 <td></td>
//               </tr>
//               <tr>
//                 <td></td>
//                 <td className="px-2 py-0.5">
//                   IR &amp; D Overhead (Sum SCH H &amp; SCH E)
//                 </td>
//                 <td></td>
//                 <td className="bg-gray-300 px-2 py-0.5 text-right">-</td>
//                 <td className="bg-cyan-300 px-2 py-0.5 text-right">-</td>
//                 <td className="bg-gray-300 px-2 py-0.5 text-right">-</td>
//                 <td></td>
//                 <td className="px-2 py-0.5 flex gap-1">
//                   <button
//                     type="button"
//                     onClick={() => onNavigate?.("sched_summaryh")}
//                     className="w-1/2 bg-blue-700 hover:bg-blue-800 text-white text-xs py-0.5 font-medium"
//                   >
//                     SUM SCHED H
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => onNavigate?.("sched_e")}
//                     className="w-1/2 bg-blue-700 hover:bg-blue-800 text-white text-xs py-0.5 font-medium"
//                   >
//                     SCHED E
//                   </button>
//                 </td>
//               </tr>
//               <tr>
//                 <td></td>
//                 <td className="px-2 py-0.5">
//                   B &amp; P Mat'l, Trvl, ODC (Sum SCH H)
//                 </td>
//                 <td></td>
//                 <td className="bg-[#ffff00] px-2 py-0.5 text-right">-</td>
//                 <td className="bg-cyan-300 px-2 py-0.5 text-right">-</td>
//                 <td className="bg-[#ffff00] px-2 py-0.5 text-right">-</td>
//                 <td></td>
//                 <td className="px-2 py-0.5">
//                   <button
//                     type="button"
//                     onClick={() => onNavigate?.("sched_summaryh")}
//                     className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs py-0.5 font-medium"
//                   >
//                     SUM SCHED H
//                   </button>
//                 </td>
//               </tr>
//               <tr>
//                 <td></td>
//                 <td className="px-2 py-0.5">B &amp; P Labor (Sum SCH H)</td>
//                 <td></td>
//                 <td className="bg-[#ffff00] px-2 py-0.5 text-right">-</td>
//                 <td className="bg-cyan-300 px-2 py-0.5 text-right">-</td>
//                 <td className="bg-[#ffff00] px-2 py-0.5 text-right">-</td>
//                 <td></td>
//                 <td className="px-2 py-0.5">
//                   <button
//                     type="button"
//                     onClick={() => onNavigate?.("sched_summaryh")}
//                     className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs py-0.5 font-medium"
//                   >
//                     SUM SCHED H
//                   </button>
//                 </td>
//               </tr>
//               <tr>
//                 <td></td>
//                 <td className="px-2 py-0.5">B&amp;P Fringe</td>
//                 <td></td>
//                 <td className="bg-gray-300 px-2 py-0.5 text-right">-</td>
//                 <td className="bg-cyan-300 px-2 py-0.5 text-right">-</td>
//                 <td className="bg-[#ffff00] px-2 py-0.5 text-right">-</td>
//                 <td></td>
//                 <td></td>
//               </tr>
//               <tr>
//                 <td></td>
//                 <td className="px-2 py-0.5">
//                   B &amp; P Overhead (Sum SCH H &amp; SCH E)
//                 </td>
//                 <td></td>
//                 <td className="bg-gray-300 px-2 py-0.5 text-right">-</td>
//                 <td className="bg-cyan-300 px-2 py-0.5 text-right">-</td>
//                 <td className="bg-[#ffff00] px-2 py-0.5 text-right">-</td>
//                 <td></td>
//                 <td className="px-2 py-0.5 flex gap-1">
//                   <button
//                     type="button"
//                     onClick={() => onNavigate?.("sched_summaryh")}
//                     className="w-1/2 bg-blue-700 hover:bg-blue-800 text-white text-xs py-0.5 font-medium"
//                   >
//                     SUM SCHED H
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => onNavigate?.("sched_e")}
//                     className="w-1/2 bg-blue-700 hover:bg-blue-800 text-white text-xs py-0.5 font-medium"
//                   >
//                     SCHED E
//                   </button>
//                 </td>
//               </tr>

//               {/* FINAL POOL TOTAL */}
//               <tr className="font-bold border-t-2 border-b-2 border-black">
//                 <td colSpan="3" className="px-2 py-1 font-bold">
//                   TOTAL G &amp; A EXPENSE POOL
//                 </td>
//                 <td className="bg-cyan-300 px-2 py-1 text-right">
//                   {formatCurrency(finalTotalTotal)}
//                 </td>
//                 <td className="bg-cyan-300 px-2 py-1 text-right">
//                   {formatCurrency(finalTotalAdjustment)}
//                 </td>
//                 <td className="bg-cyan-300 px-2 py-1 text-right">
//                   {formatCurrency(finalTotalClaimed)}
//                 </td>
//                 <td></td>
//                 <td></td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* EXPLANATORY NOTES */}
//         {/* <div className="mt-8">
//           <div className="font-bold underline mb-3">Explanatory Notes:</div>
//           <div className="text-xs mb-2">
//             1. Unallowable State Tax Expense for Pass-Thru Entity Tax -
//             Mississippi FAR 31.205-41(b)(1)
//           </div>
//           <div className="text-xs">
//             2. Income recorded in 9XX GLs has not been added to POOL cost. In
//             accordance with the principle of consistency and FAR 31.205-20,
//             since income not arises out of regular business so excluded to
//             ensure the government only receives credits related to allowable
//             costs.
//           </div>
//         </div> */}
//         {/* SINGLE EXPLANATORY NOTE TEXTAREA */}
//         <div className="mt-8 border p-4 bg-gray-50 rounded">
//           <label className="block font-bold underline mb-2 text-sm">
//             Explanatory Notes:
//           </label>
//           <textarea
//             value={explanatoryNote}
//             onChange={(e) => setExplanatoryNote(e.target.value)}
//             rows={4}
//             className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
//             placeholder="Type explanatory notes here..."
//           />
//         </div>

//         {/* LEGEND */}
//         <div className="mt-8 space-y-2 text-xs">
//           <div className="flex items-center gap-2">
//             <span className="bg-[#ffff00] px-2 py-1 border border-gray-300 font-semibold">
//               Imported from Other Worksheet
//             </span>
//             <span>As Referenced</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="bg-cyan-300 px-2 py-1 border border-gray-300 font-semibold">
//               Cell Contains a Formula
//             </span>
//             <span>Totals, Claimed and Differences</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="bg-gray-300 px-2 py-1 border border-gray-300 font-semibold">
//               Cell Contains a Formula With Links
//             </span>
//             <span>Complex formulas, linked between Sched B and E</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { backendUrl } from "../config";

const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val) || val === 0) return "-";
  const roundedVal = Math.round(val);
  if (roundedVal < 0)
    return `(${Math.abs(roundedVal).toLocaleString("en-US")})`;
  return roundedVal.toLocaleString("en-US");
};

const SchedB = forwardRef(function SchedB(
  {
    onNavigate,
    companyName,
    companyAddress,
    explanatoryNote,
    setExplanatoryNote,
    year = 2025,
    fiscalYearEnd,
  },
  ref,
) {
  const [scheduleBData, setScheduleBData] = useState([]);
  const [adjustments, setAdjustments] = useState({});
  const [fringeAllocation, setFringeAllocation] = useState({
    acctName: "Fringe Allocation",
    endingBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and dropdown state
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAccountObj, setSelectedAccountObj] = useState(null);
  const [originalAccounts, setOriginalAccounts] = useState(new Set());
  const [deletedAccounts, setDeletedAccounts] = useState(new Set());

  // console.log(adjustments)

  // Expose payload / save function to parent component via ref
  useImperativeHandle(ref, () => ({
    getPayload: () => {
      const payload = [];

      // NEW ROWS
      scheduleBData.forEach((row) => {
        if (row.isNew) {
          payload.push({
            year: Number(year),
            acctId: row.account,
            scheduleCode: "sched_b",
            isAdd: true,
          });
        }
      });

      // DELETED EXISTING ROWS
      deletedAccounts.forEach((acctId) => {
        payload.push({
          year: Number(year),
          acctId,
          scheduleCode: "sched_b",
          isAdd: false,
        });
      });

      return payload;
    },
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch available trial balance accounts
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

        // Fetch Schedule B cost data
        const response = await fetch(
          `${backendUrl}/api/TrialBalance/scheduleB_cost?fycd=${year}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP Error status: ${response.status}`);
        }

        const data = await response.json();
        const accountsList = Array.isArray(data) ? data : data.accounts || [];
        const fringeData = data.fringeAllocation || {
          acctName: "Fringe Allocation",
          endingBalance: 0,
        };

        setFringeAllocation(fringeData);

        const aggregated = accountsList.reduce((acc, item) => {
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

        const rows = Object.values(aggregated).map((row) => {
          let adjustmentRow = adjustments[row.account] || 0;

          if (row.account === "90-03-01") {
            adjustmentRow = -row.amountRaw;
          }

          const total = row.amountRaw;
          const claimed = total + adjustmentRow;

          return {
            ...row,
            totalRaw: total,
            adjustmentRowRaw: adjustmentRow,
            claimedRaw: claimed,
            isNew: false,
          };
        });

        setScheduleBData(rows);

        // Store accounts that already existed
        setOriginalAccounts(new Set(rows.map((row) => row.account)));
      } catch (err) {
        console.error("Failed to fetch Schedule B data:", err);
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

    const exists = scheduleBData.some(
      (r) => r.account === selectedAccountObj.acctId,
    );

    if (exists) {
      alert("This account is already present in the table.");
      return;
    }

    const amountRaw = selectedAccountObj.endingBalance || 0;

    const adjustmentRaw =
      selectedAccountObj.acctId === "90-03-01" ? -amountRaw : 0;

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

    setScheduleBData((prev) => [...prev, newRow]);

    setSelectedAccountObj(null);
    setSearchQuery("");
  };

  const handleRemoveRow = (acctId) => {
    const isOriginalAccount = originalAccounts.has(acctId);

    setScheduleBData((prev) => prev.filter((r) => r.account !== acctId));

    // Only track deletion if it was an existing database mapping
    if (isOriginalAccount) {
      setDeletedAccounts((prev) => {
        const next = new Set(prev);
        next.add(acctId);
        return next;
      });
    }
  };

  const subtotalAmount = scheduleBData.reduce((sum, r) => sum + r.amountRaw, 0);
  const subtotalTotal = scheduleBData.reduce((sum, r) => sum + r.totalRaw, 0);
  const subtotalAdjustment = scheduleBData.reduce(
    (sum, r) => sum + r.adjustmentRaw,
    0,
  );
  const subtotalClaimed = scheduleBData.reduce(
    (sum, r) => sum + r.claimedRaw,
    0,
  );

  const fringeBal = fringeAllocation.endingBalance || 0;
  const intermediateSubtotalTotal = subtotalTotal + fringeBal;
  const intermediateSubtotalClaimed = subtotalClaimed + fringeBal;

  const finalTotalTotal = intermediateSubtotalTotal;
  const finalTotalAdjustment = subtotalAdjustment;
  const finalTotalClaimed = intermediateSubtotalClaimed;

  return (
    <div className="min-h-full w-full overflow-x-auto bg-white text-black font-sans">
      <div className="min-w-[1100px] p-5">
        {/* TOP HEADER */}
        <div className="relative min-h-[205px]">
          <div className="absolute left-0 top-0 w-[270px] text-sm">
            <div>Schedule B is linked to the following schedules:</div>
            <button
              onClick={() => onNavigate?.("sched_d1")}
              className="block hover:underline text-blue-700 text-left cursor-pointer"
            >
              Schedule D (x), Intermediate Allocations
            </button>
            <button
              onClick={() => onNavigate?.("sched_e")}
              className="block hover:underline text-blue-700 text-left cursor-pointer"
            >
              Schedule E, Bases
            </button>
            <button
              onClick={() => onNavigate?.("sched_h")}
              className="block hover:underline text-blue-700 text-left cursor-pointer"
            >
              Schedule H, Contract Costs
            </button>
            <button
              onClick={() => onNavigate?.("sched_summaryh")}
              className="block hover:underline text-blue-700 text-left cursor-pointer"
            >
              Summary Sch H
            </button>
            <div className="text-gray-700">Sched P, IR&amp;D&amp;B&amp;P</div>
            <div className="mt-3 text-blue-700 underline cursor-pointer">
              ICE MANUAL
            </div>
          </div>

          <div className="absolute left-[270px] top-0 w-[530px]">
            <div className="bg-[#ffff00] py-1 text-center font-bold">
              {companyName}
            </div>
            <div className="bg-[#ffff00] py-1 text-center font-bold">
              {companyAddress}
            </div>
          </div>

          <div className="absolute right-0 top-0 text-right">
            <div className="text-base font-bold">SCHEDULE B</div>
            <div className="text-sm font-bold">ICE (version 2.0.1h)</div>
          </div>

          <div className="absolute left-[270px] top-[58px] w-[530px] text-center">
            <div className="text-base font-bold">
              General and Administrative (G&amp;A) Expenses (Final Indirect Cost
              Pool)
            </div>
            <div className="mt-1 bg-[#ffff00] py-1 font-bold">
              General and Administrative (G&amp;A) Expenses
            </div>
            <div className="bg-[#ffff00] py-1 font-bold">
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

        {/* SCHEDULE B TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm text-black">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="px-1 py-2 text-left align-bottom w-[140px]">
                  <div className="font-bold underline">ACCOUNT NUMBER</div>
                </th>
                <th className="px-2 py-2 text-left align-bottom min-w-[280px]">
                  <div className="font-bold underline">DESCRIPTION</div>
                </th>
                <th className="px-2 py-2 text-center align-bottom w-[130px]">
                  <div className="font-bold">Acct Balances</div>
                  <div className="bg-[#ffff00] font-bold underline">Amount</div>
                </th>
                <th className="px-2 py-2 text-center align-bottom w-[130px]">
                  <div className="font-bold">TOTAL PER</div>
                  <div className="font-bold">G/L, F/S</div>
                  <div className="font-bold">&amp; TRIAL BAL.</div>
                </th>
                <th className="px-2 py-2 text-center align-bottom font-bold w-[120px]">
                  ADJUSTMENT
                </th>
                <th className="px-2 py-2 text-center align-bottom font-bold w-[130px]">
                  CLAIMED
                </th>
                <th className="px-2 py-2 text-center align-bottom font-bold w-[80px]">
                  ACTION
                </th>
                <th className="px-2 py-2 text-center align-bottom font-bold w-[160px]">
                  Reference
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="py-6 text-center font-semibold text-gray-600"
                  >
                    Loading Schedule B data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="8"
                    className="py-6 text-center font-semibold text-red-600"
                  >
                    Error loading data: {error}
                  </td>
                </tr>
              ) : (
                scheduleBData.map((row) => (
                  <tr key={row.account} className="hover:bg-gray-50">
                    <td className="px-1 py-1 whitespace-nowrap font-medium">
                      {row.account}
                    </td>
                    <td className="px-2 py-1 whitespace-nowrap">
                      {row.description}
                    </td>
                    {/* Non-editable text cells */}
                    <td className="px-2 py-1 text-right whitespace-nowrap">
                      {formatCurrency(row.amountRaw)}
                    </td>
                    <td className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
                      {formatCurrency(row.totalRaw)}
                    </td>
                    <td className="px-2 py-1 text-right whitespace-nowrap">
                      {/* {formatCurrency(row.adjustmentRaw)} */}

                      <input
                        type="text"
                        value={
                          adjustments[row.account] ?? row.adjustmentRowRaw ?? ""
                        }
                        onChange={(e) => {
                          const value = e.target.value;

                          if (/^-?\d*\.?\d*$/.test(value)) {
                            setAdjustments((prev) => ({
                              ...prev,
                              [row.account]: value,
                            }));

                            setScheduleBData((prevRows) =>
                              prevRows.map((item) => {
                                if (item.account !== row.account) {
                                  return item;
                                }

                                const adjustmentValue = Number(value) || 0;
                                const claimed = item.totalRaw + adjustmentValue;

                                return {
                                  ...item,
                                  adjustmentRowRaw: adjustmentValue,
                                  claimedRaw: claimed,
                                };
                              }),
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
                      {formatCurrency(row.claimedRaw)}
                    </td>
                    <td className="px-2 py-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(row.account)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-0.5 rounded font-medium transition-colors"
                        title="Delete Row"
                      >
                        Delete
                      </button>
                    </td>
                    <td className="px-2 py-1"></td>
                  </tr>
                ))
              )}

              {/* SUBTOTAL ROW */}
              <tr className="border-t border-black font-bold">
                <td></td>
                <td className="px-2 py-1 underline">SUBTOTAL</td>
                <td className="bg-cyan-300 px-2 py-1 text-right">
                  {formatCurrency(subtotalAmount)}
                </td>
                <td className="bg-cyan-300 px-2 py-1 text-right">
                  {formatCurrency(subtotalTotal)}
                </td>
                <td className="bg-cyan-300 px-2 py-1 text-right">
                  {formatCurrency(subtotalAdjustment)}
                </td>
                <td className="bg-cyan-300 px-2 py-1 text-right">
                  {formatCurrency(subtotalClaimed)}
                </td>
                <td></td>
                <td></td>
              </tr>

              {/* INTERMEDIATE ALLOCATIONS */}
              <tr>
                <td colSpan="8" className="pt-2 font-bold underline">
                  Intermediate Allocations:
                </td>
              </tr>
              <tr>
                <td></td>
                <td className="px-2 py-1 bg-[#ffff00]">
                  California Intermediate
                </td>
                <td className="bg-[#ffff00] px-2 py-1 text-right">-</td>
                <td className="bg-cyan-300 px-2 py-1 text-right">-</td>
                <td className="bg-cyan-300 px-2 py-1 text-right">-</td>
                <td className="bg-[#ffff00] px-2 py-1 text-right">-</td>
                <td></td>
                <td className="px-2 py-1">
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => onNavigate?.("sched_d1")}
                      className="bg-blue-700 hover:bg-blue-800 text-white text-xs px-2 py-0.5 font-medium text-center"
                    >
                      Sched D (1)
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate?.("sched_d2")}
                      className="bg-blue-700 hover:bg-blue-800 text-white text-xs px-2 py-0.5 font-medium text-center"
                    >
                      Sched D (2)
                    </button>
                  </div>
                </td>
              </tr>

              {/* ADD: FRINGE ALLOCATION */}
              <tr>
                <td className="font-bold py-1">ADD: Fringe Allocation</td>
                <td className="bg-[repeating-linear-gradient(45deg,#ccc,#ccc_2px,#fff_2px,#fff_8px)] h-6"></td>
                <td className="bg-[#ffff00] px-2 py-1 text-right">
                  {formatCurrency(fringeBal)}
                </td>
                <td className="bg-cyan-300 px-2 py-1 text-right">
                  {formatCurrency(fringeBal)}
                </td>
                <td className="bg-cyan-300 px-2 py-1 text-right">-</td>
                <td className="bg-[#ffff00] px-2 py-1 text-right">
                  {formatCurrency(fringeBal)}
                </td>
                <td></td>
                <td className="px-2 py-1">
                  <button
                    type="button"
                    onClick={() => onNavigate?.("sched_fringe")}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs px-2 py-0.5 font-medium text-center"
                  >
                    Fringe
                  </button>
                </td>
              </tr>

              {/* FINAL POOL TOTAL */}
              <tr className="font-bold border-t-2 border-b-2 border-black">
                <td colSpan="3" className="px-2 py-1 font-bold">
                  TOTAL G &amp; A EXPENSE POOL
                </td>
                <td className="bg-cyan-300 px-2 py-1 text-right">
                  {formatCurrency(finalTotalTotal)}
                </td>
                <td className="bg-cyan-300 px-2 py-1 text-right">
                  {formatCurrency(finalTotalAdjustment)}
                </td>
                <td className="bg-cyan-300 px-2 py-1 text-right">
                  {formatCurrency(finalTotalClaimed)}
                </td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* EXPLANATORY NOTES */}
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
});

export default SchedB;
