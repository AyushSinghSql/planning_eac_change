// import React, { useState, useEffect } from "react";
// import { backendUrl } from "../config";

// const companyName = "Revolve ";
// const fiscalYearEnd = "12/31/2025";

// /* =========================================================
//    ACCOUNT DATA
// ========================================================= */

// // const scheduleD1Data = [
// //   {
// //     account: "60-01-01",
// //     description: "PTO Accrual",
// //     perGL: "65,073",
// //     adjustment: "",
// //     claimed: "65,073",
// //     notes: "",
// //     reference: "",
// //   },
// //   {
// //     account: "60-01-02",
// //     description: "Holiday",
// //     perGL: "28,165",
// //     adjustment: "",
// //     claimed: "28,165",
// //     notes: "",
// //     reference: "",
// //   },
// //   {
// //     account: "60-01-03",
// //     description: "Sick Leave",
// //     perGL: "977",
// //     adjustment: "",
// //     claimed: "977",
// //     notes: "",
// //     reference: "",
// //   },
// //   {
// //     account: "60-02-01",
// //     description: "Group Medical Dental",
// //     perGL: "19,694",
// //     adjustment: "",
// //     claimed: "19,694",
// //     notes: "",
// //     reference: "",
// //   },
// //   {
// //     account: "60-02-05",
// //     description: "Flex Benefits Admin",
// //     perGL: "150",
// //     adjustment: "",
// //     claimed: "150",
// //     notes: "",
// //     reference: "",
// //   },
// //   {
// //     account: "60-03-01",
// //     description: "Life Disability Insurance",
// //     perGL: "1,857",
// //     adjustment: "",
// //     claimed: "1,857",
// //     notes: "",
// //     reference: "",
// //   },
// //   {
// //     account: "60-03-07",
// //     description: "Workers' Comp Insurance",
// //     perGL: "286",
// //     adjustment: "",
// //     claimed: "286",
// //     notes: "",
// //     reference: "",
// //   },
// //   {
// //     account: "60-03-08",
// //     description: "HR Benefits Solutions Exp",
// //     perGL: "2,778",
// //     adjustment: "",
// //     claimed: "2,778",
// //     notes: "",
// //     reference: "",
// //   },
// //   {
// //     account: "60-05-02",
// //     description: "401 k Discretionary Contr",
// //     perGL: "16,789",
// //     adjustment: "",
// //     claimed: "16,789",
// //     notes: "",
// //     reference: "",
// //   },
// //   {
// //     account: "60-05-04",
// //     description: "401 k Plan Expense",
// //     perGL: "450",
// //     adjustment: "",
// //     claimed: "450",
// //     notes: "",
// //     reference: "",
// //   },
// //   {
// //     account: "61-01-01",
// //     description: "Social Security Taxes",
// //     perGL: "39,394",
// //     adjustment: "",
// //     claimed: "39,394",
// //     notes: "",
// //     reference: "",
// //   },
// //   {
// //     account: "61-01-02",
// //     description: "Medicare Taxes",
// //     perGL: "9,491",
// //     adjustment: "",
// //     claimed: "9,491",
// //     notes: "",
// //     reference: "",
// //   },
// //   {
// //     account: "61-01-03",
// //     description: "FUTA Taxes",
// //     perGL: "2,212",
// //     adjustment: "",
// //     claimed: "2,212",
// //     notes: "",
// //     reference: "",
// //   },
// //   {
// //     account: "61-02-03",
// //     description: "SUTA Taxes",
// //     perGL: "138",
// //     adjustment: "",
// //     claimed: "138",
// //     notes: "",
// //     reference: "",
// //   },
// // ];

// /* =========================================================
//    TOTALS
// ========================================================= */

// const totalData = {
//   perGL: "1,87,453",
//   adjustment: "-",
//   claimed: "1,87,453",
// };

// const formatCurrency = (val) => {
//   if (val === null || val === undefined || isNaN(val) || val === 0) return "";
//   const roundedVal = Math.round(val);
//   if (roundedVal < 0)
//     return `(${Math.abs(roundedVal).toLocaleString("en-US")})`;
//   return roundedVal.toLocaleString("en-US");
// };

// /* =========================================================
//    TABLE GRID
// ========================================================= */

// const tableGrid =
//   "grid grid-cols-[120px_140px_140px_80px_105px_105px_90px_90px]";

// /* =========================================================
//    REFERENCE BOX
// ========================================================= */

// function ReferenceBox({ children, onClick }) {
//   return (
//     <div className="flex items-center justify-center">
//       <div
//         onClick={onClick}
//         className="min-w-[110px] bg-blue-800 px-3 py-[3px] text-center text-xs font-bold text-white underline"
//       >
//         {children}
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    MAIN ACCOUNT TABLE
// ========================================================= */

// function ScheduleD1Table({ scheduleD1Data, loading, error, onNavigate }) {
//   // Compute totals dynamically from API dataset
//   const totalPerGL = scheduleD1Data.reduce(
//     (sum, row) => sum + (row.perGLRaw || 0),
//     0,
//   );
//   const totalAdjustment = scheduleD1Data.reduce(
//     (sum, row) => sum + (row.adjustmentRaw || 0),
//     0,
//   );
//   const totalClaimed = totalPerGL + totalAdjustment;

//   if (loading) {
//     return (
//       <div className="p-4 text-center text-sm font-semibold text-gray-600">
//         Loading trial balance data...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 text-center text-sm font-semibold text-red-600">
//         Error loading data: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="w-fit">
//       {/* TABLE HEADER */}
//       <div
//         className={`${tableGrid} border-b border-black text-[12px] font-bold text-black`}
//       >
//         <div className="px-1 py-1 text-center">
//           <div>ACCOUNT</div>
//           <div>NUMBER</div>
//         </div>
//         <div className="px-1 py-1 text-left">DESCRIPTION</div>
//         <div className="px-1 py-1 text-center">
//           <div>PER G/L</div>
//           <div>& TRIAL BAL/F.S</div>
//         </div>
//         <div className="px-1 py-1 text-center">ADJUSTMENT</div>
//         <div className="px-1 py-1 text-center">CLAIMED</div>
//         <div></div>
//         <div className="px-1 py-1 text-center">NOTES</div>
//         <div className="px-1 py-1 text-center">REFERENCE</div>
//       </div>

//       {/* ACCOUNT ROWS (DYNAMICALLY MAPPED) */}
//       {scheduleD1Data.map((row, index) => (
//         <div
//           key={row.account || index}
//           className={`${tableGrid} min-h-[20px] text-[12px] text-black hover:bg-gray-200`}
//         >
//           <div className="px-1 py-[2px] whitespace-nowrap">{row.account}</div>
//           <div className="px-1 py-[2px] whitespace-nowrap">
//             {row.description}
//           </div>
//           <div className="px-2 py-[2px] text-right whitespace-nowrap">
//             {formatCurrency(row.perGLRaw)}
//           </div>
//           <div className="px-2 py-[2px] text-right whitespace-nowrap">
//             {formatCurrency(row.adjustmentRaw)}
//           </div>
//           <div className="bg-[#28c3c8] px-2 py-[2px] text-right whitespace-nowrap">
//             {formatCurrency(row.claimedRaw)}
//           </div>
//           <div></div>
//           <div className="px-1 py-[2px]">{row.notes || ""}</div>
//           <div className="px-1 py-[2px]">{row.reference || ""}</div>
//         </div>
//       ))}

//       {/* LINE BEFORE TOTAL */}
//       <div className={`${tableGrid} mt-2`}>
//         <div></div>
//         <div></div>
//         <div className="border-t border-black"></div>
//         <div className="border-t border-black"></div>
//         <div className="border-t border-black"></div>
//         <div></div>
//         <div></div>
//         <div></div>
//       </div>

//       {/* TOTAL */}
//       <div className={`${tableGrid} text-[12px] text-black`}>
//         <div></div>
//         <div className="px-1 py-1 font-bold">Total</div>
//         <div className="bg-[#28c3c8] px-2 py-1 text-right font-medium">
//           {formatCurrency(totalPerGL)}
//         </div>
//         <div className="bg-[#28c3c8] px-2 py-1 text-right font-medium">
//           {totalAdjustment === 0 ? "-" : formatCurrency(totalAdjustment)}
//         </div>
//         <div className="bg-[#28c3c8] px-2 py-1 text-right font-medium">
//           {formatCurrency(totalClaimed)}
//         </div>
//         <div></div>
//         <div></div>
//         <div></div>
//       </div>

//       {/* TOTAL WITH ALLOCATION */}
//       <div className={`${tableGrid} mt-3 text-[12px] text-black`}>
//         <div></div>
//         <div className="px-1 py-1 font-bold">Total W / Alloc.</div>
//         <div className="border-b border-black bg-[#28c3c8] px-2 py-1 text-right font-medium">
//           {formatCurrency(totalPerGL)}
//         </div>
//         <div className="border-b border-black bg-[#28c3c8] px-2 py-1 text-right font-medium">
//           {totalAdjustment === 0 ? "-" : formatCurrency(totalAdjustment)}
//         </div>
//         <div className="border-b border-black bg-[#28c3c8] px-2 py-1 text-right font-medium">
//           {formatCurrency(totalClaimed)}
//         </div>
//         <div></div>
//         <div></div>
//         <div className="flex items-center justify-start -ml-10">
//           <span className="mr-2 text-xs">TO</span>
//           <ReferenceBox onClick={() => onNavigate && onNavigate("sched_a")}>
//             Sched A
//           </ReferenceBox>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    SCHEDULE D (1) - ALLOCATION SCREEN
// ========================================================= */

// const allocationRows = [
//   { label: "G & A", type: "hatched", labelClass: "" },
//   {
//     label: "Amount",
//     percent: "0.00%",
//     claimed: "-",
//     allocation: "-",
//     labelClass: "bg-[#ffff00]",
//   },
//   {
//     label: "O/H - OH - Onsite",
//     type: "hatched",
//     labelClass: "bg-[#ffff00] font-bold",
//   },
//   {
//     label: "Indirect Labor",
//     base: "53",
//     percent: "0.01%",
//     claimed: "18",
//     allocation: "18",
//     labelClass: "bg-[#ffff00]",
//   },
//   {
//     label: "Direct Labor Amount",
//     base: "5,56,416",
//     percent: "99.95%",
//     claimed: "1,87,364",
//     allocation: "1,87,364",
//     labelClass: "bg-[#ffff00]",
//   },
//   {
//     label: "Direct NonReim Labor",
//     base: "212",
//     percent: "0.04%",
//     claimed: "71",
//     allocation: "71",
//     labelClass: "bg-[#ffff00]",
//   },
//   {
//     label: "O/H - OH - Offsite",
//     type: "hatched",
//     labelClass: "bg-[#ffff00] font-bold",
//   },
//   {
//     label: "Amount",
//     percent: "0.00%",
//     claimed: "-",
//     allocation: "-",
//     labelClass: "bg-[#ffff00]",
//   },
//   {
//     label: "O/H - SM&H",
//     type: "hatched",
//     labelClass: "bg-[#ffff00] font-bold",
//   },
//   {
//     label: "Amount",
//     percent: "0.00%",
//     claimed: "-",
//     allocation: "-",
//     labelClass: "bg-[#ffff00]",
//   },
//   {
//     label: "Alloc to Other",
//     type: "hatched",
//     labelClass: "bg-[#ffff00] font-bold",
//   },
//   {
//     label: "Intermed. Pools:",
//     type: "hatched",
//     labelClass: "bg-[#ffff00] font-bold",
//   },
//   {
//     label: "California - Interm",
//     percent: "0.00%",
//     claimed: "-",
//     allocation: "-",
//     labelClass: "bg-[#ffff00]",
//   },
// ];

// const allocationGrid = "grid grid-cols-[120px_140px_95px_100px_95px_95px]";

// function HatchedCell({ className = "" }) {
//   return (
//     <div
//       className={`min-h-[17px] ${className}`}
//       style={{
//         backgroundColor: "#1f1f1f",
//         backgroundImage: "radial-gradient(#666 0.65px, transparent 0.65px)",
//         backgroundSize: "3px 3px",
//       }}
//     />
//   );
// }

// function AllocationReference({ children, onClick }) {
//   return (
//     <div
//       onClick={onClick}
//       className="w-[110px] bg-[#1717b9] px-1 py-[3px] text-center text-xs font-bold text-white underline leading-none"
//     >
//       {children}
//     </div>
//   );
// }

// function ScheduleD1Allocation({ onNavigate }) {
//   return (
//     <div className="mt-10 min-w-[900px] text-black">
//       <div className="mb-1 text-[12px] leading-[18px]">
//         <div>Allocation of Expenses Based on</div>
//         <div>Straight-Time Labor Dollars</div>
//       </div>

//       <div className="flex items-start">
//         <div className="w-fit">
//           <div
//             className={`${allocationGrid} h-[60px] border-b border-black text-[12px] font-bold`}
//           >
//             <div />
//             <div className="flex flex-col items-center justify-end pb-[10px]">
//               <div>Base</div>
//               <div className="relative leading-none">
//                 $
//                 <span className="absolute -right-1 -bottom-[7px] text-[8px] text-red-500">
//                   ▼
//                 </span>
//               </div>
//             </div>
//             <div className="flex flex-col items-center justify-end pb-[10px] leading-[17px]">
//               <div>% of</div>
//               <div>Total</div>
//             </div>
//             <div className="flex items-end justify-center pb-[10px]">
//               Adjustments
//             </div>
//             <div className="flex flex-col items-center justify-end pb-[10px] leading-[17px]">
//               <div>Claimed</div>
//               <div>Expense</div>
//               <div>Allocation</div>
//             </div>
//             <div className="flex flex-col items-center justify-end pb-[10px] leading-[17px]">
//               <div>Allocation</div>
//               <div>of Amts per</div>
//               <div>G/L</div>
//             </div>
//           </div>

//           {allocationRows.map((row, index) => {
//             const isHatched = row.type === "hatched";
//             return (
//               <div
//                 key={index}
//                 className={`${allocationGrid} min-h-[17px] text-[12px] leading-[17px]`}
//               >
//                 <div
//                   className={`px-1 whitespace-nowrap ${row.labelClass || ""}`}
//                 >
//                   {row.label}
//                 </div>

//                 {isHatched ? (
//                   <>
//                     <HatchedCell />
//                     <HatchedCell />
//                     <HatchedCell />
//                     <HatchedCell />
//                     <HatchedCell />
//                   </>
//                 ) : (
//                   <>
//                     <div className="px-2 text-right whitespace-nowrap">
//                       {row.base || ""}
//                     </div>
//                     <div className="bg-[#2bc3c8] px-2 text-right whitespace-nowrap">
//                       {row.percent || ""}
//                     </div>
//                     <div className="px-2 text-right" />
//                     <div className="bg-[#2bc3c8] px-2 text-right whitespace-nowrap">
//                       {row.claimed || ""}
//                     </div>
//                     <div className="bg-[#2bc3c8] px-2 text-right whitespace-nowrap">
//                       {row.allocation || ""}
//                     </div>
//                   </>
//                 )}
//               </div>
//             );
//           })}

//           <div
//             className={`${allocationGrid} mt-2 border-b border-black text-[12px] leading-[17px]`}
//           >
//             <div />
//             <div className="bg-[#2bc3c8] px-2 text-right">5,56,681</div>
//             <div className="bg-[#2bc3c8] px-2 text-right">100.00%</div>
//             <div />
//             <div className="bg-[#2bc3c8] px-2 text-right">1,87,453</div>
//             <div className="bg-[#2bc3c8] px-2 text-right">1,87,453</div>
//           </div>
//         </div>

//         <div className="ml-[95px] mt-[60px] w-[150px]">
//           <div className="mt-[0px] flex h-[20px] items-center gap-2">
//             <span className="text-[12px]">TO</span>
//             <AllocationReference
//               onClick={() => onNavigate && onNavigate("sched_b")}
//             >
//               Sched B
//             </AllocationReference>
//           </div>

//           <div className="mt-[14px] flex h-[20px] items-center gap-2">
//             <span className="text-[12px]">TO</span>
//             <AllocationReference
//               onClick={() => onNavigate && onNavigate("sched_c1")}
//             >
//               Sched C (1)
//             </AllocationReference>
//           </div>

//           <div className="mt-[48px] flex h-[20px] items-center gap-2">
//             <span className="text-[12px]">TO</span>
//             <AllocationReference
//               onClick={() => onNavigate && onNavigate("sched_c2")}
//             >
//               Sched C (2)
//             </AllocationReference>
//           </div>

//           <div className="mt-[14px] flex h-[20px] items-center gap-2">
//             <span className="text-[12px]">TO</span>
//             <AllocationReference
//               onClick={() => onNavigate && onNavigate("sched_c6")}
//             >
//               Sched C (6)
//             </AllocationReference>
//           </div>

//           <div className="mt-[48px] flex h-[20px] items-center gap-2">
//             <span className="text-[12px]">TO</span>
//             <AllocationReference
//               onClick={() => onNavigate && onNavigate("sched_d2")}
//             >
//               Sched D (2)
//             </AllocationReference>
//           </div>

//           <div className="mt-[0px] flex h-[20px] items-center gap-2">
//             <span className="text-[12px]">TO</span>
//             <AllocationReference
//               onClick={() => onNavigate && onNavigate("sched_a")}
//             >
//               Sched A
//             </AllocationReference>
//           </div>
//         </div>
//       </div>

//       <div className="mt-8 text-[12px]">
//         <div className="mb-1 font-bold underline">Explanatory Notes:</div>
//         <div>
//           AERO Fringe and associated labors captured separately to burden the
//           projects consistently.
//         </div>
//       </div>

//       <div className="mt-12 space-y-4 text-[12px]">
//         <div className="w-[265px] bg-[#ffff00] px-1 py-[2px]">
//           Linked to Other Worksheet
//         </div>
//         <div className="w-[265px] bg-[#2bc3c8] px-1 py-[2px]">
//           Cell Contains a Formula
//         </div>
//       </div>
//     </div>
//   );
// }

// /* =========================================================
//    MAIN COMPONENT
// ========================================================= */

// export default function SchedD1({ onNavigate }) {
//   const [scheduleD1Data, setScheduleD1Data] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `${backendUrl}/api/TrialBalance/trial_balance_by_pool_org?poolNo=10&fyCd=2025&orgId=1.1.01&ignoreAccountPattern=AL%25`,
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP Error status: ${response.status}`);
//         }

//         const data = await response.json();

//         // Data Mapping: Map API fields -> Schedule D1 model schema
//         const mappedData = data.map((item) => {
//           const perGL = item.endingBalance || 0;
//           const adjustment = 0; // Default or calculate if adjustment fields exist in API
//           const claimed = perGL + adjustment;

//           return {
//             account: item.acctId,
//             description: item.acctName ? item.acctName.trim() : "",
//             perGLRaw: perGL,
//             adjustmentRaw: adjustment,
//             claimedRaw: claimed,
//             notes: "",
//             reference: "",
//           };
//         });

//         setScheduleD1Data(mappedData);
//       } catch (err) {
//         console.error("Failed to fetch trial balance:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="min-h-full w-full overflow-x-auto bg-[#f3f3f3] text-black">
//       <div className="min-w-[1000px] p-[2px]">
//         {/* HEADER */}
//         <div className="relative mb-8 h-[150px]">
//           <div className="absolute left-0 top-0 w-[260px] text-xs">
//             <div>This Schedule does not contain any links to</div>
//             <div>other schedules.</div>
//             <div className="mt-4 text-blue-800 underline cursor-pointer">
//               ICE MANUAL
//             </div>
//           </div>

//           <div className="absolute left-[120px] top-[15px] w-[605px]">
//             <div className="bg-[#ffff00] py-[2px] text-center text-sm font-bold">
//               {companyName}
//             </div>
//           </div>

//           <div className="absolute left-[755px] top-0 text-xs font-bold">
//             <div>SCHEDULE D (1)</div>
//             <div className="mt-1">ICE (version 2.0.1h)</div>
//           </div>

//           <div className="absolute left-[120px] top-[66px] w-[605px] text-center">
//             <div className="py-[2px] text-sm font-bold italic">
//               AERO Fringe (final indirect cost pool)
//             </div>
//             <div className="bg-[#ffff00] py-[2px] text-sm font-bold">
//               AERO Fringe
//             </div>
//             <div className="bg-[#ffff00] py-[2px] text-sm font-bold">
//               Fiscal Year End - {fiscalYearEnd}
//             </div>
//           </div>
//         </div>

//         {/* ACCOUNT DETAILS TABLE */}
//         <ScheduleD1Table
//           scheduleD1Data={scheduleD1Data}
//           loading={loading}
//           error={error}
//           onNavigate={onNavigate}
//         />

//         {/* ALLOCATION SECTION */}
//         <ScheduleD1Allocation onNavigate={onNavigate} />
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { backendUrl } from "../config";

// const companyName = "Revolve ";

const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val) || val === 0) return "-";
  const roundedVal = Math.round(val);
  if (roundedVal < 0)
    return `(${Math.abs(roundedVal).toLocaleString("en-US")})`;
  return roundedVal.toLocaleString("en-US");
};

/* =========================================================
   TABLE GRIDS & STYLES
========================================================= */
const tableGrid =
  "grid grid-cols-[120px_180px_120px_90px_105px_90px_90px_90px]";

const allocationGrid = "grid grid-cols-[160px_120px_95px_100px_110px_110px]";

function HatchedCell({ className = "" }) {
  return (
    <div
      className={`min-h-[19px] ${className}`}
      style={{
        backgroundColor: "#1f1f1f",
        backgroundImage: "radial-gradient(#666 0.65px, transparent 0.65px)",
        backgroundSize: "3px 3px",
      }}
    />
  );
}

/* =========================================================
   REFERENCE BUTTON COMPONENT
========================================================= */
function ReferenceBox({ children, onClick }) {
  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        onClick={onClick}
        className="min-w-[110px] bg-blue-800 px-3 py-[3px] text-center text-xs font-bold text-white underline cursor-pointer hover:bg-blue-900 transition-colors"
      >
        {children}
      </button>
    </div>
  );
}

function AllocationReference({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-[110px] bg-[#1717b9] px-1 py-[3px] text-center text-xs font-bold text-white underline leading-none cursor-pointer hover:bg-blue-900 transition-colors"
    >
      {children}
    </button>
  );
}

/* =========================================================
   MAIN ACCOUNT TABLE
========================================================= */
function ScheduleD1Table({ scheduleD1Data, loading, error, onNavigate }) {
  const totalPerGL = scheduleD1Data.reduce(
    (sum, row) => sum + (row.perGLRaw || 0),
    0,
  );
  const totalAdjustment = scheduleD1Data.reduce(
    (sum, row) => sum + (row.adjustmentRaw || 0),
    0,
  );
  const totalClaimed = totalPerGL + totalAdjustment;

  if (loading) {
    return (
      <div className="p-4 text-center text-sm font-semibold text-gray-600">
        Loading trial balance data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm font-semibold text-red-600">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <div className="w-fit">
      {/* TABLE HEADER */}
      <div
        className={`${tableGrid} border-b border-black text-[12px] font-bold text-black`}
      >
        <div className="px-1 py-1 text-center">
          <div>ACCOUNT</div>
          <div>NUMBER</div>
        </div>
        <div className="px-1 py-1 text-left">DESCRIPTION</div>
        <div className="px-1 py-1 text-center">
          <div>PER G/L</div>
          <div>&amp; TRIAL BAL/F.S</div>
        </div>
        <div className="px-1 py-1 text-center">ADJUSTMENT</div>
        <div className="px-1 py-1 text-center">CLAIMED</div>
        <div></div>
        <div className="px-1 py-1 text-center">NOTES</div>
        <div className="px-1 py-1 text-center">REFERENCE</div>
      </div>

      {/* ACCOUNT ROWS */}
      {scheduleD1Data.map((row, index) => (
        <div
          key={row.account || index}
          className={`${tableGrid} min-h-[20px] text-[12px] text-black hover:bg-gray-200`}
        >
          <div className="px-1 py-[2px] whitespace-nowrap">{row.account}</div>
          <div className="px-1 py-[2px] whitespace-nowrap">
            {row.description}
          </div>
          <div className="px-2 py-[2px] text-right whitespace-nowrap">
            {formatCurrency(row.perGLRaw)}
          </div>
          <div className="px-2 py-[2px] text-right whitespace-nowrap">
            {row.adjustmentRaw === 0 ? "" : formatCurrency(row.adjustmentRaw)}
          </div>
          <div className="bg-[#28c3c8] px-2 py-[2px] text-right whitespace-nowrap">
            {formatCurrency(row.claimedRaw)}
          </div>
          <div></div>
          <div className="px-1 py-[2px]">{row.notes || ""}</div>
          <div className="px-1 py-[2px]">{row.reference || ""}</div>
        </div>
      ))}

      {/* SEPARATOR LINE */}
      <div className={`${tableGrid} mt-2`}>
        <div></div>
        <div></div>
        <div className="border-t border-black"></div>
        <div className="border-t border-black"></div>
        <div className="border-t border-black"></div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* TOTAL */}
      <div className={`${tableGrid} text-[12px] text-black`}>
        <div></div>
        <div className="px-1 py-1 font-bold">Total</div>
        <div className="bg-[#28c3c8] px-2 py-1 text-right font-medium">
          {formatCurrency(totalPerGL)}
        </div>
        <div className="bg-[#28c3c8] px-2 py-1 text-right font-medium">
          {totalAdjustment === 0 ? "-" : formatCurrency(totalAdjustment)}
        </div>
        <div className="bg-[#28c3c8] px-2 py-1 text-right font-medium">
          {formatCurrency(totalClaimed)}
        </div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* TOTAL WITH ALLOCATION */}
      <div className={`${tableGrid} mt-3 text-[12px] text-black`}>
        <div></div>
        <div className="px-1 py-1 font-bold">Total W / Alloc.</div>
        <div className="border-b border-black bg-[#28c3c8] px-2 py-1 text-right font-medium">
          {formatCurrency(totalPerGL)}
        </div>
        <div className="border-b border-black bg-[#28c3c8] px-2 py-1 text-right font-medium">
          {totalAdjustment === 0 ? "-" : formatCurrency(totalAdjustment)}
        </div>
        <div className="border-b border-black bg-[#28c3c8] px-2 py-1 text-right font-medium">
          {formatCurrency(totalClaimed)}
        </div>
        <div></div>
        <div></div>
        <div className="flex items-center justify-start -ml-10">
          <span className="mr-2 text-xs">TO</span>
          <ReferenceBox onClick={() => onNavigate && onNavigate("sched_a")}>
            Sched A
          </ReferenceBox>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SCHEDULE D (1) - ALLOCATION SECTION
========================================================= */
function ScheduleD1Allocation({
  allocationData,
  onNavigate,
  explanatoryNote,
  setExplanatoryNote,
}) {
  const { rows = [], totals = {} } = allocationData;

  const sections = [
    {
      title: "G & A",
      navKey: "sched_b",
      navLabel: "Sched B",
      items: [{ label: "Amount", nameMatch: "G & A" }],
    },
    {
      title: "O/H - OH - Onsite",
      navKey: "sched_c1",
      navLabel: "Sched C (1)",
      items: [
        { label: "Indirect Labor", nameMatch: "Indirect labor" },
        { label: "Direct Labor Amount", nameMatch: "Direct Labor Amount" },
        { label: "Direct NonReim Labor", nameMatch: "Direct NonReim Labor" },
      ],
    },
    {
      title: "O/H - OH - Offsite",
      navKey: "sched_c2",
      navLabel: "Sched C (2)",
      items: [{ label: "Amount", nameMatch: "O/H - OH - Offsite" }],
    },
    {
      title: "O/H - SM&H",
      navKey: "sched_c6",
      navLabel: "Sched C (6)",
      items: [{ label: "Amount", nameMatch: "O/H - SM&H" }],
    },
    {
      title: "Alloc to Other Intermed. Pools:",
      navKey: "sched_d2",
      navLabel: "Sched D (2)",
      items: [{ label: "California - Interm", nameMatch: "California" }],
    },
  ];

  const findRowData = (item) => {
    return (
      rows.find(
        (r) =>
          r.subname?.toLowerCase().includes(item.nameMatch.toLowerCase()) ||
          r.name?.toLowerCase().includes(item.nameMatch.toLowerCase()),
      ) || {}
    );
  };

  return (
    <div className="mt-10 min-w-[900px] text-black">
      <div className="mb-1 text-[12px] leading-[18px]">
        <div>Allocation of Expenses Based on</div>
        <div>Straight-Time Labor Dollars</div>
      </div>
      <div className="w-fit">
        {/* ALLOCATION HEADER */}
        <div
          className={`${allocationGrid} h-[60px] border-b border-black text-[12px] font-bold`}
        >
          <div />
          <div className="flex flex-col items-center justify-end pb-[10px]">
            <div>Base</div>
            <div className="relative leading-none">
              $
              <span className="absolute -right-1 -bottom-[7px] text-[8px] text-red-500">
                ▼
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-end pb-[10px] leading-[17px]">
            <div>% of</div>
            <div>Total</div>
          </div>
          <div className="flex items-end justify-center pb-[10px]">
            Adjustments
          </div>
          <div className="flex flex-col items-center justify-end pb-[10px] leading-[17px]">
            <div>Claimed</div>
            <div>Expense</div>
            <div>Allocation</div>
          </div>
          <div className="flex flex-col items-center justify-end pb-[10px] leading-[17px]">
            <div>Allocation</div>
            <div>of Amts per</div>
            <div>G/L</div>
          </div>
        </div>

        {/* DYNAMIC SECTIONS */}
        {sections.map((sec, secIdx) => (
          <React.Fragment key={secIdx}>
            {/* HATCHED HEADER ROW WITH TO BUTTON */}
            <div className="relative flex items-center">
              <div
                className={`${allocationGrid} min-h-[19px] w-full text-[12px]`}
              >
                <div className="bg-[#ffff00] px-1 font-bold whitespace-nowrap truncate z-10">
                  {sec.title}
                </div>
                <HatchedCell className="col-span-5" />
              </div>

              {sec.navKey && (
                <div className="absolute left-[725px] flex items-center gap-2 whitespace-nowrap">
                  <span className="text-[12px] font-bold">TO</span>
                  <AllocationReference
                    onClick={() => onNavigate && onNavigate(sec.navKey)}
                  >
                    {sec.navLabel}
                  </AllocationReference>
                </div>
              )}
            </div>

            {/* DATA SUB-ROWS */}
            {sec.items.map((item, itemIdx) => {
              const data = findRowData(item);
              return (
                <div
                  key={itemIdx}
                  className={`${allocationGrid} min-h-[19px] text-[12px] leading-[19px] hover:bg-gray-200`}
                >
                  <div className="bg-[#ffff00] px-1 whitespace-nowrap truncate font-medium">
                    {item.label}
                  </div>
                  <div className="px-2 text-right whitespace-nowrap">
                    {formatCurrency(data.baseLaborDollars)}
                  </div>
                  <div className="bg-[#2bc3c8] px-2 text-right whitespace-nowrap">
                    {data.percentageOfTotal !== undefined &&
                    data.percentageOfTotal !== null
                      ? `${data.percentageOfTotal.toFixed(2)}%`
                      : "0.00%"}
                  </div>
                  <div className="px-2 text-right whitespace-nowrap">
                    {data.adjustments ? formatCurrency(data.adjustments) : ""}
                  </div>
                  <div className="bg-[#2bc3c8] px-2 text-right whitespace-nowrap">
                    {formatCurrency(data.claimedExpenseAllocation)}
                  </div>
                  <div className="bg-[#2bc3c8] px-2 text-right whitespace-nowrap">
                    {formatCurrency(data.allocationBasedOnGlAmounts)}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}

        {/* ALLOCATION TOTALS ROW */}
        <div className="relative flex items-center mt-1">
          <div
            className={`${allocationGrid} border-t border-b border-black text-[12px] leading-[19px] font-bold`}
          >
            <div />
            <div className="bg-[#2bc3c8] px-2 text-right">
              {formatCurrency(totals.totalBaseLaborDollars)}
            </div>
            <div className="bg-[#2bc3c8] px-2 text-right">
              {totals.totalPercentage
                ? `${totals.totalPercentage.toFixed(2)}%`
                : "100.00%"}
            </div>
            <div />
            <div className="bg-[#2bc3c8] px-2 text-right">
              {formatCurrency(totals.totalClaimedExpenseAllocation)}
            </div>
            <div className="bg-[#2bc3c8] px-2 text-right">
              {formatCurrency(totals.totalAllocationBasedOnGlAmounts)}
            </div>
          </div>

          <div className="absolute left-[725px] flex items-center gap-2 whitespace-nowrap">
            <span className="text-[12px] font-bold">TO</span>
            <AllocationReference
              onClick={() => onNavigate && onNavigate("sched_a")}
            >
              Sched A
            </AllocationReference>
          </div>
        </div>
      </div>
      {/* <div className="mt-8 text-[12px]"> */}
      {/* <div className="mb-1 font-bold underline">Explanatory Notes:</div>
        <div>
          AERO Fringe and associated labors captured separately to burden the
          projects consistently.
        </div> */}{" "}
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
      {/* </div> */}
      <div className="mt-12 space-y-4 text-[12px]">
        <div className="w-[265px] bg-[#ffff00] px-1 py-[2px]">
          Linked to Other Worksheet
        </div>
        <div className="w-[265px] bg-[#2bc3c8] px-1 py-[2px]">
          Cell Contains a Formula
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN SCHEDULE D1 COMPONENT
========================================================= */
export default function SchedD1({
  onNavigate,
  companyName,
  companyAddress,
  setExplanatoryNote,
  explanatoryNote,
  year,
  fiscalYearEnd,
}) {
  const [scheduleD1Data, setScheduleD1Data] = useState([]);
  const [allocationData, setAllocationData] = useState({
    rows: [],
    totals: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const fiscalYearEnd = `12/31/${year}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${backendUrl}/api/TrialBalance/scheduleD1_cost?fycd=${year}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP Error status: ${response.status}`);
        }

        const data = await response.json();

        // Map Accounts Data
        const accountsList = data.accounts || [];
        const mappedAccounts = accountsList.map((item) => {
          const perGL = item.endingBalance || 0;
          const adjustment = 0;
          const claimed = perGL + adjustment;

          return {
            account: item.acctId,
            description: item.acctName ? item.acctName.trim() : "",
            perGLRaw: perGL,
            adjustmentRaw: adjustment,
            claimedRaw: claimed,
            notes: "",
            reference: "",
          };
        });

        // Map Allocation Data
        const allocationPayload = data.allocation || {};
        const mappedAllocation = {
          rows: allocationPayload.rows || [],
          totals: {
            totalBaseLaborDollars: allocationPayload.totalBaseLaborDollars || 0,
            totalPercentage: allocationPayload.totalPercentage || 100,
            totalClaimedExpenseAllocation:
              allocationPayload.totalClaimedExpenseAllocation || 0,
            totalAllocationBasedOnGlAmounts:
              allocationPayload.totalAllocationBasedOnGlAmounts || 0,
          },
        };

        setScheduleD1Data(mappedAccounts);
        setAllocationData(mappedAllocation);
      } catch (err) {
        console.error("Failed to fetch Schedule D1 data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-full w-full overflow-x-auto bg-[#f3f3f3] text-black">
      <div className="min-w-[1000px] p-[2px]">
        {/* HEADER */}
        <div className="relative mb-8 h-[150px]">
          <div className="absolute left-0 top-0 w-[260px] text-xs">
            <div>This Schedule does not contain any links to</div>
            <div>other schedules.</div>
            <div className="mt-4 text-blue-800 underline cursor-pointer">
              ICE MANUAL
            </div>
          </div>

          <div className="absolute left-[275px] top-0 w-[400px]">
            <div className="bg-[#ffff00] py-[3px] text-center font-bold">
              {companyName}
            </div>
            <div className="bg-[#ffff00] py-[3px] text-center font-bold">
              {companyAddress}
            </div>
          </div>

          <div className="absolute left-[755px] top-0 text-xs font-bold">
            <div>SCHEDULE D (1)</div>
            <div className="mt-1">ICE (version 2.0.1h)</div>
          </div>

          <div className="absolute left-[120px] top-[66px] w-[605px] text-center">
            <div className="py-[2px] text-sm font-bold italic">
              AERO Fringe (final indirect cost pool)
            </div>
            <div className="bg-[#ffff00] py-[2px] text-sm font-bold">
              AERO Fringe
            </div>
            <div className="bg-[#ffff00] py-[2px] text-sm font-bold">
              Fiscal Year End - {fiscalYearEnd}
            </div>
          </div>
        </div>

        {/* ACCOUNTS TABLE */}
        <ScheduleD1Table
          scheduleD1Data={scheduleD1Data}
          loading={loading}
          error={error}
          onNavigate={onNavigate}
        />

        {/* ALLOCATION SECTION */}
        <ScheduleD1Allocation
          allocationData={allocationData}
          onNavigate={onNavigate}
          setExplanatoryNote={setExplanatoryNote}
          explanatoryNote={explanatoryNote}
        />
      </div>
    </div>
  );
}
