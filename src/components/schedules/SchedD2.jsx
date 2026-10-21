// import React from "react";

// const companyName = "Revolve ";
// const fiscalYearEnd = "12/31/2025";

// function HatchedCell({ className = "" }) {
//   return (
//     <div
//       className={className}
//       style={{
//         backgroundImage:
//           "repeating-linear-gradient(135deg, #202020 0px, #202020 1px, #666 1px, #666 2px)",
//       }}
//     />
//   );
// }

// function ReferenceBox({ children, width = "110px" }) {
//   return (
//     <div
//       className="bg-[#1717b7] px-3 py-[3px] text-center text-[12px] font-bold text-white underline"
//       style={{ minWidth: width }}
//     >
//       {children}
//     </div>
//   );
// }

// const scheduleD2Data = [
//   ["72-00-01", "CA Overhead Labor", "13,12,719"],
//   ["72-00-02", "CA Overhead Supplies", "10,141"],
//   ["72-00-03", "CA Overhead Consultants", "36,230"],
//   ["72-00-01", "CA Overhead Rent", "2,48,672"],
//   ["74-00-01", "CA OVH Affare", "8,308"],
//   ["74-00-02", "CA OVH Hotel", "1,563"],
//   ["74-00-04", "CA OVH Per Diem Meals", "4,958"],
//   ["74-00-06", "CA OVH Ground Transport", "357"],
//   ["72-50-04", "CA OH Parking", "5,961"],
//   ["72-50-07", "CA OH Employee Relations", "1,235"],
//   ["72-50-08", "CA OH Small Equipment", "34"],
//   ["72-50-12", "CA OH Business Insur", "2,690"],
//   ["72-50-13", "CA OH Meals", "555"],
//   ["72-50-14", "CA OH Recruiting", "47,012"],
//   ["72-50-16", "CA OH Auto Expense", "20,417"],
//   ["72-50-17", "CA OH Business Conf", "477"],
//   ["72-50-18", "CA OH Telephon/Internet", "8,336"],
//   ["72-50-19", "CA OH Equip Repair/Maint", "302"],
// ];

// const detailGrid =
//   "grid grid-cols-[120px_190px_170px_110px_120px_90px_110px_110px]";

// function ScheduleD2Table() {
//   return (
//     <div className="w-full min-w-[1000px] text-black">
//       <div className="relative mb-8 h-[135px]">
//         <div className="absolute left-0 top-0 text-[12px] leading-[18px]">
//           <div>Schedule D(2) is linked to the following</div>
//           <div>Schedule D(x)</div>
//           <div className="text-blue-800 underline">ICE MANUAL</div>
//         </div>
//         <div className="absolute left-[214px] top-[16px] w-[592px]">
//           <div className="bg-[#ffff00] py-[2px] text-center text-[13px] font-bold">
//             {companyName}
//           </div>
//           {/* <div className="bg-[#ffff00] py-[2px] text-center text-[13px] font-bold">
//             {companyName}
//           </div> */}
//         </div>
//         <div className="absolute left-[850px] top-0 text-[12px] font-bold">
//           <div>SCHEDULE D (2)</div>
//           <div>ICE (version 2.0.1h)</div>
//         </div>
//         <div className="absolute left-[214px] top-[66px] w-[592px] text-center">
//           <div className="py-[2px] text-[13px] font-bold italic">
//             Intermediate Indirect Cost Pool
//           </div>
//           <div className="bg-[#ffff00] py-[2px] text-[13px] font-bold">
//             California Intermediate Ind. Pool
//           </div>
//           <div className="bg-[#ffff00] py-[2px] text-[13px] font-bold">
//             Fiscal Year End - {fiscalYearEnd}
//           </div>
//         </div>
//       </div>

//       <div className="w-fit">
//         <div
//           className={`${detailGrid} border-b border-black text-[12px] font-bold`}
//         >
//           <div className="text-center leading-[14px]">
//             <div>ACCOUNT</div>
//             <div>NUMBER</div>
//           </div>
//           <div className="pt-[13px] text-center">DESCRIPTION</div>
//           <div className="text-center leading-[14px]">
//             <div>PER G/L</div>
//             <div>TRIAL BAL/F.S</div>
//           </div>
//           <div className="pt-[13px] text-center">ADJUSTMENT</div>
//           <div className="pt-[13px] text-center">CLAIMED</div>
//           <div />
//           <div className="pt-[13px] text-center">NOTES</div>
//           <div className="pt-[13px] text-center">REFERENCE</div>
//         </div>

//         {scheduleD2Data.map(([account, description, amount], index) => (
//           <div key={index} className={`${detailGrid} min-h-[18px] text-[12px]`}>
//             <div className="py-[1px]">{account}</div>
//             <div className="py-[1px]">{description}</div>
//             <div className="px-2 py-[1px] text-right">{amount}</div>
//             <div />
//             <div className="bg-[#29c5ca] px-2 py-[1px] text-right">
//               {amount}
//             </div>
//             <div className="bg-[#29c5ca]" />
//             <div />
//             <div />
//           </div>
//         ))}

//         <div className={`${detailGrid} mt-2 text-[12px]`}>
//           <div />
//           <div className="py-[2px] font-bold">Total</div>
//           <div className="border-t border-black bg-[#29c5ca] px-2 py-[2px] text-right">
//             17,09,967
//           </div>
//           <div className="border-t border-black bg-[#29c5ca] px-2 py-[2px] text-right">
//             -
//           </div>
//           <div className="border-t border-black bg-[#29c5ca] px-2 py-[2px] text-right">
//             17,09,967
//           </div>
//           <div className="border-t border-black bg-[#29c5ca]" />
//           <div />
//           <div />
//         </div>

//         <div className={`${detailGrid} min-h-[18px] text-[12px]`}>
//           <div />
//           <div className="py-[2px] font-bold">
//             ADD: Intermediate Pool Allocations
//           </div>
//           <div />
//           <HatchedCell />
//           <HatchedCell />
//           <HatchedCell />
//           <div />
//           <div />
//         </div>

//         <div className={`${detailGrid} mt-3 min-h-[18px] text-[12px]`}>
//           <div />
//           <div className="py-[2px] font-bold">ADD: Fringe Allocation</div>
//           <div className="bg-[#ffff00] px-2 py-[2px] text-right">4,37,526</div>
//           <div className="bg-[#29c5ca] px-2 py-[2px] text-right">-</div>
//           <div className="bg-[#ffff00] px-2 py-[2px] text-right">4,37,526</div>
//           <div className="bg-[#29c5ca]" />
//           <div />
//           <div />
//         </div>

//         <div className={`${detailGrid} mt-[2px] text-[12px]`}>
//           <div />
//           <div className="py-[2px] font-bold">Total W / Alloc.</div>
//           <div className="border-b border-black bg-[#29c5ca] px-2 py-[2px] text-right">
//             21,47,494
//           </div>
//           <div className="border-b border-black bg-[#29c5ca] px-2 py-[2px] text-right">
//             -
//           </div>
//           <div className="border-b border-black bg-[#29c5ca] px-2 py-[2px] text-right">
//             21,47,494
//           </div>
//           <div className="border-b border-black bg-[#29c5ca]" />
//           <div />
//           <div className="ml-[30px] flex flex-col">
//             <div className="ml-[25px]">
//               <ReferenceBox width="110px">Fringe</ReferenceBox>
//             </div>

//             <div className="mt-[8px] flex items-center gap-2">
//               <span className="text-[12px]">TO</span>
//               <ReferenceBox width="110px">Sched A</ReferenceBox>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const allocationRows = [
//   { label: "G & A", type: "header" },
//   { label: "Amount", type: "hatched" },
//   { label: "O/H - OH - Onsite", type: "header" },
//   {
//     label: "Direct Labor & Fringe Allocation Amount",
//     base: "2,85,48,579",
//     percent: "92.85%",
//     claimed: "19,33,952",
//     allocation: "19,33,952",
//   },
//   { label: "O/H - OH - Offsite", type: "header" },
//   {
//     label: "Direct Labor & Fringe Allocation Amount",
//     base: "21,98,346",
//     percent: "7.15%",
//     claimed: "1,53,542",
//     allocation: "1,53,542",
//   },
//   { label: "O/H - SM&H", type: "header" },
//   { label: "Amount", percent: "0.00%", claimed: "-", allocation: "-" },
// ];

// const allocationGrid = "grid grid-cols-[220px_195px_80px_85px_100px_100px]";

// function ScheduleD2Allocation() {
//   return (
//     <div className="mt-12 min-w-[1000px]">
//       <div className="mb-4 text-[12px] leading-[18px]">
//         <div>Allocation of Expenses Based on</div>
//         <div>Payroll</div>
//       </div>
//       <div className="flex items-start">
//         <div className="w-fit">
//           <div
//             className={`${allocationGrid} mb-[8px] border-b border-black text-[12px] font-bold leading-[15px]`}
//           >
//             <div />
//             <div className="text-center">
//               Base
//               <span className="relative ml-1 inline-block">
//                 <span className="absolute left-0 top-[10px] text-[8px] text-red-500">
//                   ▼
//                 </span>
//               </span>
//             </div>
//             <div className="text-center">
//               <div>% of</div>
//               <div>Total</div>
//             </div>
//             <div className="pt-[10px] text-center">Adjustments</div>
//             <div className="text-center">
//               <div>Claimed</div>
//               <div>Expense</div>
//               <div>Allocation</div>
//             </div>
//             <div className="text-center">
//               <div>Allocation</div>
//               <div>of Amts per</div>
//               <div>G/L</div>
//             </div>
//           </div>

//           {allocationRows.map((row, index) => {
//             const hatched = row.type === "header" || row.type === "hatched";
//             return (
//               <div
//                 key={index}
//                 className={`${allocationGrid} min-h-[19px] text-[12px]`}
//               >
//                 <div
//                   className={`px-1 py-[1px] ${row.type === "header" ? "bg-[#ffff00] font-medium" : ""}`}
//                 >
//                   {row.label}
//                 </div>
//                 {hatched ? (
//                   <HatchedCell />
//                 ) : (
//                   <div className="px-2 py-[1px] text-right">
//                     {row.base || ""}
//                   </div>
//                 )}
//                 {hatched ? (
//                   <HatchedCell />
//                 ) : (
//                   <div
//                     className={`px-2 py-[1px] text-right ${row.percent ? "bg-[#29c5ca]" : ""}`}
//                   >
//                     {row.percent || ""}
//                   </div>
//                 )}
//                 {hatched ? <HatchedCell /> : <div />}
//                 {hatched ? (
//                   <HatchedCell />
//                 ) : (
//                   <div className="bg-[#29c5ca] px-2 py-[1px] text-right">
//                     {row.claimed || ""}
//                   </div>
//                 )}
//                 {hatched ? (
//                   <HatchedCell />
//                 ) : (
//                   <div className="bg-[#29c5ca] px-2 py-[1px] text-right">
//                     {row.allocation || ""}
//                   </div>
//                 )}
//               </div>
//             );
//           })}

//           <div
//             className={`${allocationGrid} mt-2 border-b border-black text-[12px]`}
//           >
//             <div />
//             <div className="bg-[#29c5ca] px-2 py-[2px] text-right">
//               3,07,49,525
//             </div>
//             <div className="bg-[#29c5ca] px-2 py-[2px] text-right">100.00%</div>
//             <div />
//             <div className="bg-[#29c5ca] px-2 py-[2px] text-right">
//               21,47,494
//             </div>
//             <div className="bg-[#29c5ca] px-2 py-[2px] text-right">
//               21,47,494
//             </div>
//           </div>
//         </div>

//         <div className="ml-[65px] mt-[0px] w-[150px]">
//           <div className="flex h-[20px] items-center gap-2 mt-[60px]">
//             <span className="text-[12px]">TO</span>
//             <ReferenceBox width="95px">Sched B</ReferenceBox>
//           </div>
//           <div className="mt-[25px] flex h-[20px] items-center gap-2">
//             <span className="text-[12px]">TO</span>
//             <ReferenceBox width="95px">Sched C (1)</ReferenceBox>
//           </div>
//           <div className="mt-[25px] flex h-[20px] items-center gap-2">
//             <span className="text-[12px]">TO</span>
//             <ReferenceBox width="95px">Sched C (2)</ReferenceBox>
//           </div>
//           <div className="mt-[25px] flex h-[20px] items-center gap-2">
//             <span className="text-[12px]">TO</span>
//             <ReferenceBox width="95px">Sched C (6)</ReferenceBox>
//           </div>
//           <div className="mt-[25px] flex h-[20px] items-center gap-2">
//             <span className="text-[12px]">TO</span>
//             <ReferenceBox width="95px">Sched A</ReferenceBox>
//           </div>
//         </div>
//       </div>

//       <div className="mt-7 text-[12px]">
//         <div className="mb-1 font-bold underline">Explanatory Notes:</div>
//         <div>
//           To Split the California OH cost based on Direct Labor-Fringe on Direct
//           Labor for Onsite and Offsite
//         </div>
//       </div>
//       <div className="mt-10 space-y-3 text-[12px]">
//         <div className="w-[420px] bg-[#ffff00] px-1 py-[2px]">
//           Linked to Other Worksheet
//         </div>
//         <div className="w-[420px] bg-[#29c5ca] px-1 py-[2px]">
//           Cell Contains a Formula
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function SchedD2() {
//   return (
//     <div className="min-h-full w-full overflow-x-auto bg-[#f3f3f3] text-black">
//       <div className="min-w-[1120px] p-[2px]">
//         <ScheduleD2Table />
//         <ScheduleD2Allocation />
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { backendUrl } from "../config";

// const companyName = "Revolve ";

/* =========================================================
   FORMATTING & UTILITY FUNCTIONS
========================================================= */
const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val) || val === 0) return "-";
  const roundedVal = Math.round(val);
  if (roundedVal < 0)
    return `(${Math.abs(roundedVal).toLocaleString("en-US")})`;
  return roundedVal.toLocaleString("en-US");
};

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

function ReferenceBox({ children, width = "110px", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-[#1717b7] px-3 py-[3px] text-center text-[12px] font-bold text-white underline hover:bg-[#12128a] cursor-pointer transition-colors"
      style={{ minWidth: width }}
    >
      {children}
    </button>
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

const detailGrid =
  "grid grid-cols-[120px_190px_170px_110px_120px_90px_110px_110px]";

// Added 2 additional columns at the end (40px for "TO", 110px for the Button)
const allocationGrid =
  "grid grid-cols-[280px_120px_95px_100px_110px_110px_40px_110px]";

/* =========================================================
   MAIN COMPONENT: SCHED D2
========================================================= */
export default function SchedD2({
  onNavigate,
  companyName,
  companyAddress,
  explanatoryNote,
  setExplanatoryNote,
  year,
  fiscalYearEnd,
}) {
  const [scheduleD2Data, setScheduleD2Data] = useState([]);
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
          `${backendUrl}/api/TrialBalance/scheduleD2_cost?fycd=${year}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP Error status: ${response.status}`);
        }

        const data = await response.json();

        // Process accounts array
        const accountsList = data.accounts || [];
        const mappedAccounts = accountsList.map((item) => {
          const perGL = item.endingBalance || 0;
          const adjustment = 0;
          const claimed = perGL + adjustment;

          return {
            account: item.acctId,
            description: item.acctName ? item.acctName.trim() : "",
            amountRaw: perGL,
            adjustmentRaw: adjustment,
            claimedRaw: claimed,
          };
        });

        // Process allocation section from API payload
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

        setScheduleD2Data(mappedAccounts);
        setAllocationData(mappedAllocation);
      } catch (err) {
        console.error("Failed to fetch Schedule D2 data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute Account Subtotals
  const totalAmount = scheduleD2Data.reduce((sum, r) => sum + r.amountRaw, 0);
  const totalAdjustment = scheduleD2Data.reduce(
    (sum, r) => sum + r.adjustmentRaw,
    0,
  );
  const totalClaimed = scheduleD2Data.reduce((sum, r) => sum + r.claimedRaw, 0);

  // Fringe Allocation Total Calculations
  const fringeAllocationAmount = 437526;
  const totalWithAllocAmount = totalAmount + fringeAllocationAmount;
  const totalWithAllocClaimed = totalClaimed + fringeAllocationAmount;

  // Configuration for dynamic rendering of sections & navigation targets
  const sections = [
    {
      title: "G & A",
      navKey: "sched_b",
      navLabel: "Sched B",
      items: [{ label: "Amount", nameMatch: "G&A" }],
    },
    {
      title: "O/H - OH - Onsite",
      navKey: "sched_c1",
      navLabel: "Sched C (1)",
      items: [
        {
          label: "Direct Labor & Fringe Allocation Amount",
          nameMatch: "O/H - OH - Onsite",
        },
      ],
    },
    {
      title: "O/H - OH - Offsite",
      navKey: "sched_c2",
      navLabel: "Sched C (2)",
      items: [
        {
          label: "Direct Labor & Fringe Allocation Amount",
          nameMatch: "O/H - OH - Offsite",
        },
      ],
    },
    {
      title: "O/H - SM&H",
      navKey: "sched_c6",
      navLabel: "Sched C (6)",
      items: [{ label: "Amount", nameMatch: "O/H - SM&H" }],
    },
  ];

  const findRowData = (item) => {
    return (
      allocationData.rows.find(
        (r) =>
          r.name?.toLowerCase().includes(item.nameMatch.toLowerCase()) ||
          r.subname?.toLowerCase().includes(item.nameMatch.toLowerCase()),
      ) || {}
    );
  };

  return (
    <div className="min-h-full w-full overflow-x-auto bg-[#f3f3f3] text-black font-sans">
      <div className="min-w-[1120px] p-4">
        {/* HEADER SECTION */}
        <div className="relative mb-8 h-[135px]">
          <div className="absolute left-0 top-0 text-[12px] leading-[18px]">
            <div>Schedule D(2) is linked to the following</div>
            <div>Schedule D(x)</div>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate("sched_d1")}
              className="text-blue-800 underline cursor-pointer"
            >
              ICE MANUAL
            </button>
          </div>

          <div className="absolute left-[275px] top-0 w-[400px]">
            <div className="bg-[#ffff00] py-[3px] text-center font-bold">
              {companyName}
            </div>
            <div className="bg-[#ffff00] py-[3px] text-center font-bold">
              {companyAddress}
            </div>
          </div>

          <div className="absolute left-[850px] top-0 text-[12px] font-bold">
            <div>SCHEDULE D (2)</div>
            <div>ICE (version 2.0.1h)</div>
          </div>

          <div className="absolute left-[214px] top-[66px] w-[592px] text-center">
            <div className="py-[2px] text-[13px] font-bold italic">
              Intermediate Indirect Cost Pool
            </div>
            <div className="bg-[#ffff00] py-[2px] text-[13px] font-bold">
              California Intermediate Ind. Pool
            </div>
            <div className="bg-[#ffff00] py-[2px] text-[13px] font-bold">
              Fiscal Year End - {fiscalYearEnd}
            </div>
          </div>
        </div>

        {/* SCHEDULE D2 MAIN ACCOUNTS TABLE */}
        <div className="w-fit">
          <div
            className={`${detailGrid} border-b border-black text-[12px] font-bold`}
          >
            <div className="text-center leading-[14px]">
              <div>ACCOUNT</div>
              <div>NUMBER</div>
            </div>
            <div className="pt-[13px] text-center">DESCRIPTION</div>
            <div className="text-center leading-[14px]">
              <div>PER G/L</div>
              <div>TRIAL BAL/F.S</div>
            </div>
            <div className="pt-[13px] text-center">ADJUSTMENT</div>
            <div className="pt-[13px] text-center">CLAIMED</div>
            <div />
            <div className="pt-[13px] text-center">NOTES</div>
            <div className="pt-[13px] text-center">REFERENCE</div>
          </div>

          {loading ? (
            <div className="py-4 text-center font-semibold text-gray-600">
              Loading Schedule D2 data...
            </div>
          ) : error ? (
            <div className="py-4 text-center font-semibold text-red-600">
              Error loading data: {error}
            </div>
          ) : (
            scheduleD2Data.map((row) => (
              <div
                key={row.account}
                className={`${detailGrid} min-h-[18px] text-[12px] hover:bg-gray-200`}
              >
                <div className="py-[1px]">{row.account}</div>
                <div className="py-[1px]">{row.description}</div>
                <div className="px-2 py-[1px] text-right">
                  {formatCurrency(row.amountRaw)}
                </div>
                <div className="px-2 py-[1px] text-right">
                  {row.adjustmentRaw === 0
                    ? ""
                    : formatCurrency(row.adjustmentRaw)}
                </div>
                <div className="bg-[#29c5ca] px-2 py-[1px] text-right">
                  {formatCurrency(row.claimedRaw)}
                </div>
                <div className="bg-[#29c5ca]" />
                <div />
                <div />
              </div>
            ))
          )}

          {/* TOTAL ROW */}
          <div className={`${detailGrid} mt-2 text-[12px]`}>
            <div />
            <div className="py-[2px] font-bold">Total</div>
            <div className="border-t border-black bg-[#29c5ca] px-2 py-[2px] text-right">
              {formatCurrency(totalAmount)}
            </div>
            <div className="border-t border-black bg-[#29c5ca] px-2 py-[2px] text-right">
              {formatCurrency(totalAdjustment)}
            </div>
            <div className="border-t border-black bg-[#29c5ca] px-2 py-[2px] text-right">
              {formatCurrency(totalClaimed)}
            </div>
            <div className="border-t border-black bg-[#29c5ca]" />
            <div />
            <div />
          </div>

          {/* ADD: INTERMEDIATE POOL ALLOCATIONS */}
          <div className={`${detailGrid} min-h-[18px] text-[12px]`}>
            <div />
            <div className="py-[2px] font-bold">
              ADD: Intermediate Pool Allocations
            </div>
            <div />
            <HatchedCell />
            <HatchedCell />
            <HatchedCell />
            <div />
            <div />
          </div>

          {/* ADD: FRINGE ALLOCATION */}
          <div className={`${detailGrid} mt-3 min-h-[18px] text-[12px]`}>
            <div />
            <div className="py-[2px] font-bold">ADD: Fringe Allocation</div>
            <div className="bg-[#ffff00] px-2 py-[2px] text-right">
              {formatCurrency(fringeAllocationAmount)}
            </div>
            <div className="bg-[#29c5ca] px-2 py-[2px] text-right">-</div>
            <div className="bg-[#ffff00] px-2 py-[2px] text-right">
              {formatCurrency(fringeAllocationAmount)}
            </div>
            <div className="bg-[#29c5ca]" />
            <div />
            <div />
          </div>

          {/* TOTAL WITH ALLOCATION */}
          <div className={`${detailGrid} mt-[2px] text-[12px]`}>
            <div />
            <div className="py-[2px] font-bold">Total W / Alloc.</div>
            <div className="border-b border-black bg-[#29c5ca] px-2 py-[2px] text-right">
              {formatCurrency(totalWithAllocAmount)}
            </div>
            <div className="border-b border-black bg-[#29c5ca] px-2 py-[2px] text-right">
              -
            </div>
            <div className="border-b border-black bg-[#29c5ca] px-2 py-[2px] text-right">
              {formatCurrency(totalWithAllocClaimed)}
            </div>
            <div className="border-b border-black bg-[#29c5ca]" />
            <div />
            <div className="ml-[30px] flex flex-col">
              <div className="ml-[25px]">
                <ReferenceBox
                  width="110px"
                  onClick={() => onNavigate && onNavigate("sched_fringe")}
                >
                  Fringe
                </ReferenceBox>
              </div>

              <div className="mt-[8px] flex items-center gap-2">
                <span className="text-[12px]">TO</span>
                <ReferenceBox
                  width="110px"
                  onClick={() => onNavigate && onNavigate("sched_a")}
                >
                  Sched A
                </ReferenceBox>
              </div>
            </div>
          </div>
        </div>

        {/* ALLOCATION SECTION */}
        <div className="mt-12 min-w-[1000px]">
          <div className="mb-4 text-[12px] leading-[18px]">
            <div>Allocation of Expenses Based on</div>
            <div>Payroll</div>
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
              {/* Spacer cells for TO and Sched Button headers */}
              <div />
              <div />
            </div>

            {/* DYNAMIC SECTION ROWS */}
            {sections.map((sec, secIdx) => (
              <React.Fragment key={secIdx}>
                {/* HATCHED HEADER ROW */}
                <div
                  className={`${allocationGrid} min-h-[19px] w-full text-[12px] items-center`}
                >
                  <div className="bg-[#ffff00] px-1 font-bold whitespace-nowrap truncate z-10">
                    {sec.title}
                  </div>
                  <HatchedCell className="col-span-5" />
                  <div className="text-[12px] font-bold text-center">
                    {sec.navKey && "TO"}
                  </div>
                  <div>
                    {sec.navKey && (
                      <AllocationReference
                        onClick={() => onNavigate && onNavigate(sec.navKey)}
                      >
                        {sec.navLabel}
                      </AllocationReference>
                    )}
                  </div>
                </div>

                {/* DATA SUB-ROWS */}
                {sec.items.map((item, itemIdx) => {
                  const data = findRowData(item);
                  return (
                    <div
                      key={itemIdx}
                      className={`${allocationGrid} min-h-[19px] text-[12px] leading-[19px] hover:bg-gray-200`}
                    >
                      <div className="bg-[#ffff00] px-1 font-medium leading-tight py-[2px] flex items-center">
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
                        {data.adjustments
                          ? formatCurrency(data.adjustments)
                          : ""}
                      </div>
                      <div className="bg-[#2bc3c8] px-2 text-right whitespace-nowrap">
                        {formatCurrency(data.claimedExpenseAllocation)}
                      </div>
                      <div className="bg-[#2bc3c8] px-2 text-right whitespace-nowrap">
                        {formatCurrency(data.allocationBasedOnGlAmounts)}
                      </div>
                      <div />
                      <div />
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

            {/* ALLOCATION TOTALS ROW */}
            <div
              className={`${allocationGrid} mt-1 border-t border-b border-black text-[12px] leading-[19px] font-bold items-center`}
            >
              <div />
              <div className="bg-[#2bc3c8] px-2 text-right">
                {formatCurrency(allocationData.totals.totalBaseLaborDollars)}
              </div>
              <div className="bg-[#2bc3c8] px-2 text-right">
                {allocationData.totals.totalPercentage
                  ? `${allocationData.totals.totalPercentage.toFixed(2)}%`
                  : "100.00%"}
              </div>
              <div />
              <div className="bg-[#2bc3c8] px-2 text-right">
                {formatCurrency(
                  allocationData.totals.totalClaimedExpenseAllocation,
                )}
              </div>
              <div className="bg-[#2bc3c8] px-2 text-right">
                {formatCurrency(
                  allocationData.totals.totalAllocationBasedOnGlAmounts,
                )}
              </div>
              <div className="text-[12px] font-bold text-center">TO</div>
              <div>
                <AllocationReference
                  onClick={() => onNavigate && onNavigate("sched_a")}
                >
                  Sched A
                </AllocationReference>
              </div>
            </div>
          </div>

          {/* <div className="mt-7 text-[12px]">
            <div className="mb-1 font-bold underline">Explanatory Notes:</div>
            <div>
              To Split the California OH cost based on Direct Labor-Fringe on
              Direct Labor for Onsite and Offsite
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

          <div className="mt-10 space-y-3 text-[12px]">
            <div className="w-[420px] bg-[#ffff00] px-1 py-[2px]">
              Linked to Other Worksheet
            </div>
            <div className="w-[420px] bg-[#29c5ca] px-1 py-[2px]">
              Cell Contains a Formula
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
