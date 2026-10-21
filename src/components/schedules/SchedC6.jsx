// // import React from "react";

// // const companyName = "Revolve ";
// // const fiscalYearEnd = "12/31/2025";

// // /* =========================================================
// //    ACCOUNT DATA
// // ========================================================= */

// // const scheduleC6Data = [
// //   {
// //     account: "84-00-01",
// //     description: "S&MH Labor",
// //     amount: "4,41,192",
// //     total: "4,41,192",
// //     adjustment: "",
// //     claimed: "4,41,192",
// //   },
// //   {
// //     account: "84-10-01",
// //     description: "S&MH Admin Supplies",
// //     amount: "1,104",
// //     total: "1,104",
// //     adjustment: "",
// //     claimed: "1,104",
// //   },
// //   {
// //     account: "84-30-01",
// //     description: "S&MH Rent",
// //     amount: "20,326",
// //     total: "20,326",
// //     adjustment: "",
// //     claimed: "20,326",
// //   },
// //   {
// //     account: "84-50-03",
// //     description: "S&MH Furnished Meals",
// //     amount: "313",
// //     total: "313",
// //     adjustment: "",
// //     claimed: "313",
// //   },
// //   {
// //     account: "84-50-09",
// //     description: "S&MH Small Equipment",
// //     amount: "69",
// //     total: "69",
// //     adjustment: "",
// //     claimed: "69",
// //   },
// //   {
// //     account: "84-50-14",
// //     description: "S&MH Employee Relations",
// //     amount: "335",
// //     total: "335",
// //     adjustment: "",
// //     claimed: "335",
// //   },
// //   {
// //     account: "84-50-20",
// //     description: "S&MH Telephone/Internet",
// //     amount: "419",
// //     total: "419",
// //     adjustment: "",
// //     claimed: "419",
// //   },
// //   {
// //     account: "84-50-21",
// //     description: "S&MH Equip Maint/Repairs",
// //     amount: "604",
// //     total: "604",
// //     adjustment: "",
// //     claimed: "604",
// //   },
// // ];

// // /* =========================================================
// //    SUBTOTAL
// // ========================================================= */

// // const subtotal = {
// //   amount: "4,64,362",
// //   total: "4,64,362",
// //   adjustment: "-",
// //   claimed: "4,64,362",
// // };

// // /* =========================================================
// //    CALIFORNIA INTERMEDIATE
// // ========================================================= */

// // const californiaIntermediate = {
// //   amount: "-",
// //   total: "-",
// //   adjustment: "-",
// //   claimed: "-",
// // };

// // /* =========================================================
// //    FRINGE ALLOCATION
// // ========================================================= */

// // const fringeAllocation = {
// //   total: "1,47,048",
// //   adjustment: "-",
// //   claimed: "1,47,048",
// // };

// // /* =========================================================
// //    TOTAL OVERHEAD POOL
// // ========================================================= */

// // const totalOverheadPool = {
// //   total: "6,11,410",
// //   adjustment: "-",
// //   claimed: "6,11,410",
// // };

// // /* =========================================================
// //    TABLE GRID

// //    ACCOUNT | DESCRIPTION | AMOUNT | TOTAL |
// //    ADJUSTMENTS | CLAIMED | NOTES | REF
// // ========================================================= */

// // const tableGrid =
// //   "grid grid-cols-[120px_220px_90px_110px_110px_100px_70px_90px]";

// // /* =========================================================
// //    REFERENCE BOX
// // ========================================================= */

// // function ReferenceBox({ children }) {
// //   return (
// //     <div className="flex justify-center">
// //       <div className="bg-blue-700 px-2 py-1 text-center text-xs font-bold text-white underline whitespace-nowrap">
// //         {children}
// //       </div>
// //     </div>
// //   );
// // }

// // /* =========================================================
// //    ACCOUNT TABLE
// // ========================================================= */

// // function ScheduleC6Table() {
// //   return (
// //     <div className="w-fit">
// //       {/* =================================================
// //           TABLE HEADER
// //       ================================================= */}

// //       <div className={`${tableGrid} border-b border-black text-sm text-black`}>
// //         {/* ACCOUNT */}
// //         <div className="px-1 py-1 text-left font-bold">
// //           <div className="underline">ACCOUNT</div>

// //           <div className="underline">NUMBER</div>
// //         </div>

// //         {/* DESCRIPTION */}
// //         <div className="px-2 py-1 text-left font-bold underline">
// //           DESCRIPTION
// //         </div>

// //         {/* ACCOUNT BALANCES */}
// //         <div className="px-1 py-1 text-center">
// //           <div className="font-bold">Acct Balances</div>

// //           <div className="bg-[#ffff00] font-bold underline">Amount</div>
// //         </div>

// //         {/* TOTAL */}
// //         <div className="px-1 py-1 text-center font-bold">
// //           <div>TOTAL PER G/L</div>

// //           <div>&amp; TRIAL BAL/F/S</div>
// //         </div>

// //         {/* ADJUSTMENTS */}
// //         <div className="px-1 py-1 text-center font-bold">ADJUSTMENTS</div>

// //         {/* CLAIMED */}
// //         <div className="px-1 py-1 text-center font-bold">CLAIMED</div>

// //         {/* NOTES */}
// //         <div className="px-1 py-1 text-center font-bold">Notes</div>

// //         {/* REF */}
// //         <div className="px-1 py-1 text-center font-bold">Ref.</div>
// //       </div>

// //       {/* =================================================
// //           ACCOUNT ROWS
// //       ================================================= */}

// //       {scheduleC6Data.map((row, index) => (
// //         <div key={index} className={`${tableGrid} text-sm text-black`}>
// //           {/* ACCOUNT */}
// //           <div className="px-1 py-[2px] whitespace-nowrap">{row.account}</div>

// //           {/* DESCRIPTION */}
// //           <div className="px-2 py-[2px] whitespace-nowrap">
// //             {row.description}
// //           </div>

// //           {/* AMOUNT */}
// //           <div className="px-2 py-[2px] text-right whitespace-nowrap">
// //             {row.amount}
// //           </div>

// //           {/* TOTAL */}
// //           <div className="bg-cyan-300 px-2 py-[2px] text-right whitespace-nowrap">
// //             {row.total}
// //           </div>

// //           {/* ADJUSTMENT */}
// //           <div className="px-2 py-[2px] text-right whitespace-nowrap">
// //             {row.adjustment}
// //           </div>

// //           {/* CLAIMED */}
// //           <div className="bg-cyan-300 px-2 py-[2px] text-right whitespace-nowrap">
// //             {row.claimed}
// //           </div>

// //           {/* NOTES */}
// //           <div></div>

// //           {/* REF */}
// //           <div></div>
// //         </div>
// //       ))}

// //       {/* =================================================
// //           SUBTOTAL
// //       ================================================= */}

// //       <div
// //         className={`${tableGrid} mt-2 border-b border-black text-sm text-black`}
// //       >
// //         <div></div>

// //         <div className="px-2 py-1 font-bold underline">Subtotal</div>

// //         <div className="bg-cyan-300 px-2 py-1 text-right">
// //           {subtotal.amount}
// //         </div>

// //         <div className="bg-cyan-300 px-2 py-1 text-right">{subtotal.total}</div>

// //         <div className="bg-cyan-300 px-2 py-1 text-right">
// //           {subtotal.adjustment}
// //         </div>

// //         <div className="bg-cyan-300 px-2 py-1 text-right">
// //           {subtotal.claimed}
// //         </div>

// //         <div></div>

// //         <div></div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* =========================================================
// //    MAIN COMPONENT
// // ========================================================= */

// // export default function SchedC6() {
// //   return (
// //     <div className="min-h-full w-full overflow-x-auto bg-white text-black">
// //       <div className="min-w-[900px] p-4">
// //         {/* =================================================
// //             HEADER
// //         ================================================= */}

// //         <div className="relative mb-8 h-[125px]">
// //           {/* ---------------------------------------------
// //               LINKED SCHEDULES
// //           --------------------------------------------- */}

// //           <div className="absolute left-0 top-0 w-[250px] text-sm">
// //             <div>Schedule C is linked to the following</div>

// //             <div>schedules:</div>

// //             <div>Schedule D(x)</div>

// //             <div className="mt-8 text-blue-700 underline">ICE MANUAL</div>
// //           </div>

// //           {/* ---------------------------------------------
// //               COMPANY NAME
// //           --------------------------------------------- */}

// //           <div className="absolute left-[275px] top-0 w-[400px]">
// //             <div className="bg-[#ffff00] py-[3px] text-center font-bold">
// //               {companyName}
// //             </div>

// //             <div className="bg-[#ffff00] py-[3px] text-center font-bold">
// //               California
// //             </div>
// //           </div>

// //           {/* ---------------------------------------------
// //               SCHEDULE NAME
// //           --------------------------------------------- */}

// //           <div className="absolute left-[700px] top-0">
// //             <div className="text-base font-bold">SCHEDULE C (6)</div>

// //             <div className="text-sm font-bold">ICE (version 2.0.1h)</div>
// //           </div>

// //           {/* ---------------------------------------------
// //               REPORT TITLE
// //           --------------------------------------------- */}

// //           <div className="absolute left-[275px] top-[54px] w-[400px] text-center">
// //             <div className="py-[2px] font-bold italic leading-[18px]">
// //               Overhead Expenses (final indirect cost pool)
// //             </div>

// //             <div className="bg-[#ffff00] py-[3px] font-bold">
// //               Subk &amp; Material Handling
// //             </div>

// //             <div className="bg-[#ffff00] py-[3px] font-bold">
// //               Fiscal Year End - {fiscalYearEnd}
// //             </div>
// //           </div>
// //         </div>

// //         {/* =================================================
// //             MAIN ACCOUNT TABLE
// //         ================================================= */}

// //         <ScheduleC6Table />

// //         {/* =================================================
// //             ALLOCATION SECTION
// //         ================================================= */}

// //         <div className="mt-3 w-fit">
// //           {/* ---------------------------------------------
// //               CALIFORNIA INTERMEDIATE
// //           --------------------------------------------- */}

// //           <div className={tableGrid}>
// //             {/* ACCOUNT */}
// //             <div></div>

// //             {/* DESCRIPTION */}
// //             <div className="bg-[#ffff00] px-1 py-1 font-semibold underline">
// //               California Intermediate
// //             </div>

// //             {/* AMOUNT */}
// //             <div className="bg-[#ffff00] px-2 py-1 text-right whitespace-nowrap">
// //               {californiaIntermediate.amount}
// //             </div>

// //             {/* TOTAL */}
// //             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
// //               {californiaIntermediate.total}
// //             </div>

// //             {/* ADJUSTMENT */}
// //             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
// //               {californiaIntermediate.adjustment}
// //             </div>

// //             {/* CLAIMED */}
// //             <div className="bg-[#ffff00] px-2 py-1 text-right whitespace-nowrap">
// //               {californiaIntermediate.claimed}
// //             </div>

// //             {/* NOTES */}
// //             <div></div>

// //             {/* REF */}
// //             <ReferenceBox>Sched D (1)</ReferenceBox>
// //           </div>

// //           {/* ---------------------------------------------
// //               SCHED D (2)
// //           --------------------------------------------- */}

// //           <div className={tableGrid}>
// //             <div></div>
// //             <div></div>
// //             <div></div>
// //             <div></div>
// //             <div></div>
// //             <div></div>
// //             <div></div>

// //             <ReferenceBox>Sched D (2)</ReferenceBox>
// //           </div>

// //           {/* ---------------------------------------------
// //               FRINGE ALLOCATION
// //           --------------------------------------------- */}

// //           <div className={tableGrid}>
// //             {/* LABEL */}
// //             <div className="col-span-2 px-1 py-1 font-bold">
// //               ADD: Fringe Allocation
// //             </div>

// //             {/* HATCHED IMPORTED CELL */}
// //             <div
// //               className="px-2 py-1"
// //               style={{
// //                 background:
// //                   "repeating-linear-gradient(135deg, #ffffff 0px, #ffffff 3px, #777777 3px, #777777 4px)",
// //               }}
// //             ></div>

// //             {/* TOTAL */}
// //             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
// //               {fringeAllocation.total}
// //             </div>

// //             {/* ADJUSTMENT */}
// //             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
// //               {fringeAllocation.adjustment}
// //             </div>

// //             {/* CLAIMED */}
// //             <div className="bg-[#ffff00] px-2 py-1 text-right whitespace-nowrap">
// //               {fringeAllocation.claimed}
// //             </div>

// //             {/* NOTES */}
// //             <div></div>

// //             {/* REF */}
// //             <ReferenceBox>Fringe</ReferenceBox>
// //           </div>

// //           {/* ---------------------------------------------
// //               TOTAL OVERHEAD POOL
// //           --------------------------------------------- */}

// //           <div className={`${tableGrid} border-b border-black`}>
// //             {/* ACCOUNT */}
// //             <div></div>

// //             {/* DESCRIPTION */}
// //             <div className="px-1 py-1 font-bold">Total Overhead Pool</div>

// //             {/* AMOUNT */}
// //             <div></div>

// //             {/* TOTAL */}
// //             <div className="bg-cyan-300 px-2 py-1 text-right font-medium whitespace-nowrap">
// //               {totalOverheadPool.total}
// //             </div>

// //             {/* ADJUSTMENT */}
// //             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
// //               {totalOverheadPool.adjustment}
// //             </div>

// //             {/* CLAIMED */}
// //             <div className="bg-cyan-300 px-2 py-1 text-right font-medium whitespace-nowrap">
// //               {totalOverheadPool.claimed}
// //             </div>

// //             {/* NOTES */}
// //             <div></div>

// //             {/* REF */}
// //             <div></div>
// //           </div>
// //         </div>

// //         {/* =================================================
// //             LEGEND
// //         ================================================= */}

// //         <div className="mt-7 space-y-2 text-xs">
// //           {/* YELLOW */}
// //           <div className="flex items-center gap-2">
// //             <span className="bg-[#ffff00] px-2 py-1">
// //               Imported from Other Worksheet
// //             </span>

// //             <span>As Referenced</span>
// //           </div>

// //           {/* CYAN */}
// //           <div className="flex items-center gap-2">
// //             <span className="bg-cyan-300 px-2 py-1">
// //               Cell Contains a Formula
// //             </span>

// //             <span>Totals Claimed and Reconciling Differences</span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

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
//    TABLE GRID LAYOUT
// ========================================================= */
// const tableGrid =
//   "grid grid-cols-[120px_220px_90px_110px_110px_100px_70px_90px]";

// /* =========================================================
//    REFERENCE BUTTON COMPONENT
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
//    MAIN SCHEDULE C6 COMPONENT
// ========================================================= */
// export default function SchedC6({ onNavigate }) {
//   const [scheduleC6Data, setScheduleC6Data] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `${backendUrl}/api/TrialBalance/scheduleC6_cost?fycd=2025`,
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP Error status: ${response.status}`);
//         }

//         const data = await response.json();

//         // Aggregate by account ID (acctId)
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

//         // Dynamic line item calculations
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

//         setScheduleC6Data(rows);
//       } catch (err) {
//         console.error("Failed to fetch Schedule C6 data:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Compute Subtotals
//   const subtotalAmount = scheduleC6Data.reduce(
//     (sum, r) => sum + r.amountRaw,
//     0,
//   );
//   const subtotalTotal = scheduleC6Data.reduce((sum, r) => sum + r.totalRaw, 0);
//   const subtotalAdjustment = scheduleC6Data.reduce(
//     (sum, r) => sum + r.adjustmentRaw,
//     0,
//   );
//   const subtotalClaimed = scheduleC6Data.reduce(
//     (sum, r) => sum + r.claimedRaw,
//     0,
//   );

//   // Dynamic Intermediate & Fringe Calculations
//   const californiaIntermediate = {
//     amount: 0,
//     total: 0,
//     adjustment: 0,
//     claimed: 0,
//   };

//   const fringeAllocation = {
//     total: 147048,
//     adjustment: 0,
//     claimed: 147048,
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
//                 // onClick={() => onNavigate && onNavigate("sched_d1")}
//                 className=""
//               >
//                 Schedule D(x)
//               </button>
//             </div>
//             <div className="mt-8 text-blue-700 underline cursor-pointer">
//               ICE MANUAL
//             </div>
//           </div>

//           {/* COMPANY NAME */}
//           <div className="absolute left-[275px] top-0 w-[400px]">
//             <div className="bg-[#ffff00] py-[3px] text-center font-bold">
//               {companyName}
//             </div>
//             <div className="bg-[#ffff00] py-[3px] text-center font-bold">
//               California
//             </div>
//           </div>

//           {/* SCHEDULE TITLE */}
//           <div className="absolute left-[700px] top-0">
//             <div className="text-base font-bold">SCHEDULE C (6)</div>
//             <div className="text-sm font-bold">ICE (version 2.0.1h)</div>
//           </div>

//           {/* REPORT TITLE */}
//           <div className="absolute left-[275px] top-[54px] w-[400px] text-center">
//             <div className="py-[2px] font-bold italic leading-[18px]">
//               Overhead Expenses (final indirect cost pool)
//             </div>
//             <div className="bg-[#ffff00] py-[3px] font-bold">
//               Subk &amp; Material Handling
//             </div>
//             <div className="bg-[#ffff00] py-[3px] font-bold">
//               Fiscal Year End - {fiscalYearEnd}
//             </div>
//           </div>
//         </div>

//         {/* =================================================
//             MAIN ACCOUNT TABLE
//         ================================================= */}
//         <div className="w-fit">
//           {/* HEADER ROW */}
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
//               <div className="bg-[#ffff00] font-bold underline">Amount</div>
//             </div>
//             <div className="px-1 py-1 text-center font-bold">
//               <div>TOTAL PER G/L</div>
//               <div>&amp; TRIAL BAL/F/S</div>
//             </div>
//             <div className="px-1 py-1 text-center font-bold">ADJUSTMENTS</div>
//             <div className="px-1 py-1 text-center font-bold">CLAIMED</div>
//             <div className="px-1 py-1 text-center font-bold">Notes</div>
//             <div className="px-1 py-1 text-center font-bold">Ref.</div>
//           </div>

//           {/* DATA ROWS */}
//           {loading ? (
//             <div className="py-4 text-center font-semibold text-gray-600">
//               Loading Schedule C6 data...
//             </div>
//           ) : error ? (
//             <div className="py-4 text-center font-semibold text-red-600">
//               Error loading data: {error}
//             </div>
//           ) : (
//             scheduleC6Data.map((row) => (
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
//             <div className="bg-[#ffff00] px-1 py-1 font-semibold underline">
//               California Intermediate
//             </div>
//             <div className="bg-[#ffff00] px-2 py-1 text-right whitespace-nowrap">
//               {californiaIntermediate.amount === 0
//                 ? "-"
//                 : formatCurrency(californiaIntermediate.amount)}
//             </div>
//             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
//               {californiaIntermediate.total === 0
//                 ? "-"
//                 : formatCurrency(californiaIntermediate.total)}
//             </div>
//             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
//               {californiaIntermediate.adjustment === 0
//                 ? "-"
//                 : formatCurrency(californiaIntermediate.adjustment)}
//             </div>
//             <div className="bg-[#ffff00] px-2 py-1 text-right whitespace-nowrap">
//               {californiaIntermediate.claimed === 0
//                 ? "-"
//                 : formatCurrency(californiaIntermediate.claimed)}
//             </div>
//             <div></div>
//             <ReferenceBox onClick={() => onNavigate && onNavigate("sched_d1")}>
//               Sched D (1)
//             </ReferenceBox>
//           </div>

//           {/* SCHED D (2) */}
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
//             <div className="col-span-2 px-1 py-1 font-bold">
//               ADD: Fringe Allocation
//             </div>
//             <div
//               className="px-2 py-1"
//               style={{
//                 background:
//                   "repeating-linear-gradient(135deg, #ffffff 0px, #ffffff 3px, #777777 3px, #777777 4px)",
//               }}
//             ></div>
//             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
//               {formatCurrency(fringeAllocation.total)}
//             </div>
//             <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
//               {fringeAllocation.adjustment === 0
//                 ? "-"
//                 : formatCurrency(fringeAllocation.adjustment)}
//             </div>
//             <div className="bg-[#ffff00] px-2 py-1 text-right whitespace-nowrap">
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
//             LEGEND
//         ================================================= */}
//         <div className="mt-7 space-y-2 text-xs">
//           <div className="flex items-center gap-2">
//             <span className="bg-[#ffff00] px-2 py-1">
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
  useImperativeHandle,
  forwardRef,
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
   TABLE GRID LAYOUT
========================================================= */
const tableGrid =
  "grid grid-cols-[120px_220px_90px_110px_110px_100px_70px_90px]";

/* =========================================================
   REFERENCE BUTTON COMPONENT
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
   MAIN SCHEDULE C6 COMPONENT
========================================================= */
const SchedC6 = forwardRef(function SchedC2(
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
  const [scheduleC6Data, setScheduleC6Data] = useState([]);
  const [fringeAllocation, setFringeAllocation] = useState({
    acctName: "Fringe Allocation",
    endingBalance: 0,
  });
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
      scheduleC6Data.forEach((row) => {
        if (row.isNew) {
          payload.push({
            year: Number(year),
            acctId: row.account,
            scheduleCode: "sched_c6",
            isAdd: true,
          });
        }
      });

      // DELETED EXISTING ROWS
      deletedAccounts.forEach((acctId) => {
        payload.push({
          year: Number(year),
          acctId,
          scheduleCode: "sched_c6",
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
          `${backendUrl}/api/TrialBalance/scheduleC6_cost?fycd=${year}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP Error status: ${response.status}`);
        }

        const data = await response.json();

        // Parse accounts array and fringeAllocation object from payload
        const accountsList = Array.isArray(data) ? data : data.accounts || [];
        const fringeData = data.fringeAllocation || {
          acctName: "Fringe Allocation",
          endingBalance: 0,
        };

        setFringeAllocation(fringeData);

        // Aggregate by account ID (acctId)
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

        // Dynamic line item calculations
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

        setScheduleC6Data(rows);
        setOriginalAccounts(new Set(rows.map((row) => row.account)));
      } catch (err) {
        console.error("Failed to fetch Schedule C6 data:", err);
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

    const exists = scheduleC6Data.some(
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

    setScheduleC6Data((prev) => [...prev, newRow]);
    setSelectedAccountObj(null);
    setSearchQuery("");
  };

  const handleRemoveRow = (acctId) => {
    const isOriginalAccount = originalAccounts.has(acctId);

    setScheduleC6Data((prev) => prev.filter((r) => r.account !== acctId));

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
  const subtotalAmount = scheduleC6Data.reduce(
    (sum, r) => sum + r.amountRaw,
    0,
  );
  const subtotalTotal = scheduleC6Data.reduce((sum, r) => sum + r.totalRaw, 0);
  const subtotalAdjustment = scheduleC6Data.reduce(
    (sum, r) => sum + r.adjustmentRaw,
    0,
  );
  const subtotalClaimed = scheduleC6Data.reduce(
    (sum, r) => sum + r.claimedRaw,
    0,
  );

  // Dynamic Intermediate & Fringe Calculations
  const californiaIntermediate = {
    amount: 0,
    total: 0,
    adjustment: 0,
    claimed: 0,
  };

  const fringeBal = fringeAllocation.endingBalance || 0;

  const totalOverheadPool = {
    total: subtotalTotal + californiaIntermediate.total + fringeBal,
    adjustment: subtotalAdjustment + californiaIntermediate.adjustment,
    claimed: subtotalClaimed + californiaIntermediate.claimed + fringeBal,
  };

  const handleAdjustmentChange = (acctId, value) => {
    const numericVal = value === "" ? 0 : parseFloat(value) || 0;

    setScheduleC6Data((prev) =>
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
              <button type="button" className="">
                Schedule D(x)
              </button>
            </div>
            <div className="mt-8 text-blue-700 underline cursor-pointer">
              ICE MANUAL
            </div>
          </div>

          {/* COMPANY NAME */}
          <div className="absolute left-[275px] top-0 w-[400px]">
            <div className="bg-[#ffff00] py-[3px] text-center font-bold">
              {companyName}
            </div>
            <div className="bg-[#ffff00] py-[3px] text-center font-bold">
              {companyAddress}
            </div>
          </div>

          {/* SCHEDULE TITLE */}
          <div className="absolute left-[700px] top-0">
            <div className="text-base font-bold">SCHEDULE C (6)</div>
            <div className="text-sm font-bold">ICE (version 2.0.1h)</div>
          </div>

          {/* REPORT TITLE */}
          <div className="absolute left-[275px] top-[54px] w-[400px] text-center">
            <div className="py-[2px] font-bold italic leading-[18px]">
              Overhead Expenses (final indirect cost pool)
            </div>
            <div className="bg-[#ffff00] py-[3px] font-bold">
              Subk &amp; Material Handling
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
          {/* HEADER ROW */}
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
              <div>TOTAL PER G/L</div>
              <div>&amp; TRIAL BAL/F/S</div>
            </div>
            <div className="px-1 py-1 text-center font-bold">ADJUSTMENTS</div>
            <div className="px-1 py-1 text-center font-bold">CLAIMED</div>
            <div className="px-1 py-1 text-center font-bold">Notes</div>
            <div className="px-1 py-1 text-center font-bold">Action</div>
            <div className="px-1 py-1 text-center font-bold">Ref.</div>
          </div>

          {/* DATA ROWS */}
          {loading ? (
            <div className="py-4 text-center font-semibold text-gray-600">
              Loading Schedule C6 data...
            </div>
          ) : error ? (
            <div className="py-4 text-center font-semibold text-red-600">
              Error loading data: {error}
            </div>
          ) : (
            scheduleC6Data.map((row) => (
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
                <div></div>
                <div className="px-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(row.account)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-0.5 rounded font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
                <div></div>
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
            <div />
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
              {californiaIntermediate.amount === 0
                ? "-"
                : formatCurrency(californiaIntermediate.amount)}
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
              {californiaIntermediate.total === 0
                ? "-"
                : formatCurrency(californiaIntermediate.total)}
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
              {californiaIntermediate.adjustment === 0
                ? "-"
                : formatCurrency(californiaIntermediate.adjustment)}
            </div>
            <div className="bg-[#ffff00] px-2 py-1 text-right whitespace-nowrap">
              {californiaIntermediate.claimed === 0
                ? "-"
                : formatCurrency(californiaIntermediate.claimed)}
            </div>
            <div></div>
            <ReferenceBox onClick={() => onNavigate && onNavigate("sched_d1")}>
              Sched D (1)
            </ReferenceBox>
          </div>

          {/* SCHED D (2) */}
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
            <div className="col-span-2 px-1 py-1 font-bold">
              ADD: {fringeAllocation.acctName || "Fringe Allocation"}
            </div>
            <div
              className="px-2 py-1"
              style={{
                background:
                  "repeating-linear-gradient(135deg, #ffffff 0px, #ffffff 3px, #777777 3px, #777777 4px)",
              }}
            ></div>
            <div className="bg-[#ffff00] px-2 py-1 text-right whitespace-nowrap">
              {formatCurrency(fringeBal)}
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
              -
            </div>
            <div className="bg-[#ffff00] px-2 py-1 text-right whitespace-nowrap">
              {formatCurrency(fringeBal)}
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
          </div>
        </div>

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

export default SchedC6;
