// import React from "react";

// const companyName = "Revolve ";
// const fiscalYearEnd = "12/31/2025";

// /* =========================================================
//    ACCOUNT DATA
// ========================================================= */

// const scheduleC2Data = [
//   {
//     account: "71-10-01",
//     description: "Col Site OH Supplies",
//     amount: "8,386",
//     total: "8,386",
//     adjustment: "",
//     claimed: "8,386",
//   },
//   {
//     account: "71-30-01",
//     description: "Col Site OH Rent",
//     amount: "1,61,515",
//     total: "1,61,515",
//     adjustment: "",
//     claimed: "1,61,515",
//   },
//   {
//     account: "71-50-03",
//     description: "Col Site Furnished Meals",
//     amount: "3,975",
//     total: "3,975",
//     adjustment: "",
//     claimed: "3,975",
//   },
//   {
//     account: "71-50-08",
//     description: "Col Site Employee Relations",
//     amount: "2,102",
//     total: "2,102",
//     adjustment: "",
//     claimed: "2,102",
//   },
//   {
//     account: "71-50-09",
//     description: "Col Site Small Equipment",
//     amount: "551",
//     total: "551",
//     adjustment: "",
//     claimed: "551",
//   },
//   {
//     account: "71-50-15",
//     description: "Col Site Equip Repair Mnt",
//     amount: "4,835",
//     total: "4,835",
//     adjustment: "",
//     claimed: "4,835",
//   },
//   {
//     account: "71-50-17",
//     description: "Col Site OH Telephones",
//     amount: "3,055",
//     total: "3,055",
//     adjustment: "",
//     claimed: "3,055",
//   },
// ];

// /* =========================================================
//    SUBTOTAL
// ========================================================= */

// const subtotal = {
//   amount: "1,84,420",
//   total: "1,84,420",
//   adjustment: "-",
//   claimed: "1,84,420",
// };

// /* =========================================================
//    CALIFORNIA INTERMEDIATE
// ========================================================= */

// const californiaIntermediate = {
//   amount: "1,53,542",
//   total: "1,53,542",
//   adjustment: "-",
//   claimed: "1,53,542",
// };

// /* =========================================================
//    FRINGE ALLOCATION
// ========================================================= */

// const fringeAllocation = {
//   total: "-",
//   adjustment: "-",
//   claimed: "-",
// };

// /* =========================================================
//    TOTAL OVERHEAD POOL
// ========================================================= */

// const totalOverheadPool = {
//   total: "3,37,961",
//   adjustment: "-",
//   claimed: "3,37,961",
// };

// /* =========================================================
//    SAME 8-COLUMN STRUCTURE AS SCHED C1
// ========================================================= */

// const tableGrid =
//   "grid grid-cols-[120px_220px_90px_110px_110px_100px_70px_90px]";

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
//    MAIN ACCOUNT TABLE
// ========================================================= */

// function ScheduleC2Table() {
//   return (
//     <div className="w-fit">
//       {/* TABLE HEADER */}
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
//           <div>TOTAL PER G/L</div>

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
//       {scheduleC2Data.map((row, index) => (
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
//    MAIN COMPONENT
// ========================================================= */

// export default function SchedC2() {
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

//           <div className="absolute left-[275px] top-0 w-[390px]">
//             <div className="bg-[#ffff00] py-[3px] text-center font-bold">
//               {companyName}
//             </div>

//             <div className="bg-[#ffff00] py-[3px] text-center font-bold">
//               California
//             </div>
//           </div>

//           {/* ---------------------------------------------
//               SCHEDULE NAME
//           --------------------------------------------- */}

//           <div className="absolute left-[675px] top-0">
//             <div className="text-base font-bold">SCHEDULE C (2)</div>

//             <div className="text-sm font-bold">ICE (version 2.0.1h)</div>
//           </div>

//           {/* ---------------------------------------------
//               REPORT TITLE

//               Notice that this is BELOW the company
//               heading and is NOT yellow.
//           --------------------------------------------- */}

//           <div className="absolute left-[275px] top-[54px] w-[390px] text-center">
//             <div className="py-[2px] font-bold italic leading-[18px]">
//               Overhead Expenses (final indirect cost pool)
//             </div>

//             <div className="bg-[#ffff00] py-[3px] font-bold">
//               Columbus Site Overhead
//             </div>

//             <div className="bg-[#ffff00] py-[3px] font-bold">
//               Fiscal Year End - {fiscalYearEnd}
//             </div>
//           </div>
//         </div>

//         {/* =================================================
//             ACCOUNT TABLE
//         ================================================= */}

//         <ScheduleC2Table />

//         {/* =================================================
//             ALLOCATION SECTION

//             Uses the SAME 8 columns as the main table.
//         ================================================= */}

//         <div className="mt-3 w-fit">
//           {/* ---------------------------------------------
//               CALIFORNIA INTERMEDIATE
//           --------------------------------------------- */}

//           <div className={tableGrid}>
//             {/* ACCOUNT */}
//             <div></div>

//             {/* DESCRIPTION */}
//             <div className="bg-[#ffff00] px-1 py-1 font-semibold underline">
//               California Intermediate
//             </div>

//             {/* AMOUNT */}
//             <div className="bg-[#ffff00] px-2 py-1 text-right whitespace-nowrap">
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
//             <div className="bg-[#ffff00] px-2 py-1 text-right whitespace-nowrap">
//               {californiaIntermediate.claimed}
//             </div>

//             {/* NOTES */}
//             <div></div>

//             {/* REF */}
//             <ReferenceBox>Sched D (1)</ReferenceBox>
//           </div>

//           {/* ---------------------------------------------
//               SCHED D (2)
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
//             {/* LABEL */}
//             <div className="col-span-2 px-1 py-1 font-bold">
//               ADD: Fringe Allocation
//             </div>

//             {/* AMOUNT / HATCHED AREA */}
//             <div
//               className="px-2 py-1"
//               style={{
//                 background:
//                   "repeating-linear-gradient(135deg, #ffffff 0px, #ffffff 3px, #777777 3px, #777777 4px)",
//               }}
//             ></div>

//             {/* TOTAL */}
//             <div className="bg-cyan-300 px-2 py-1 text-right">
//               {fringeAllocation.total}
//             </div>

//             {/* ADJUSTMENT */}
//             <div className="bg-cyan-300 px-2 py-1 text-right">
//               {fringeAllocation.adjustment}
//             </div>

//             {/* CLAIMED */}
//             <div className="bg-[#ffff00] px-2 py-1 text-right">
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

/* =========================================================
   UTILITIES & FORMATTING
========================================================= */
const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val) || val === 0) return "-";
  const roundedVal = Math.round(val);
  if (roundedVal < 0)
    return `(${Math.abs(roundedVal).toLocaleString("en-US")})`;
  return roundedVal.toLocaleString("en-US");
};

/* =========================================================
   SAME 8-COLUMN STRUCTURE AS SCHED C1
========================================================= */
const tableGrid =
  "grid grid-cols-[120px_220px_90px_110px_110px_100px_70px_90px]";

/* =========================================================
   REFERENCE BOX
========================================================= */
function ReferenceBox({ children, onClick }) {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={onClick}
        className="bg-blue-700 px-2 py-1 text-center text-xs font-bold text-white underline whitespace-nowrap hover:bg-blue-800 transition-colors cursor-pointer"
      >
        {children}
      </button>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT: SCHED C2
========================================================= */
const SchedC2 = forwardRef(function SchedC2(
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
  const [scheduleC2Data, setScheduleC2Data] = useState([]);
  const [amountsData, setAmountsData] = useState([]);
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
      scheduleC2Data.forEach((row) => {
        if (row.isNew) {
          payload.push({
            year: Number(year),
            acctId: row.account,
            scheduleCode: "sched_c2",
            isAdd: true,
          });
        }
      });

      // DELETED EXISTING ROWS
      deletedAccounts.forEach((acctId) => {
        payload.push({
          year: Number(year),
          acctId,
          scheduleCode: "sched_c2",
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
          `${backendUrl}/api/TrialBalance/scheduleC2_cost?fycd=${year}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP Error status: ${response.status}`);
        }

        const data = await response.json();

        // Map GL Accounts from API
        const accountsList = data.accounts || [];

        const mappedAccounts = accountsList.map((item) => {
          const endingBalance = item.endingBalance || 0;
          const adjustment = 0; // Default or extend if backend sends adjustments
          const claimed = endingBalance + adjustment;

          return {
            account: item.acctId,
            description: item.acctName ? item.acctName.trim() : "",
            amountRaw: endingBalance,
            adjustmentRaw: adjustment,
            claimedRaw: claimed,
            isNew: false,
          };
        });

        setScheduleC2Data(mappedAccounts);
        setAmountsData(data.amounts || []);
        setOriginalAccounts(new Set(mappedAccounts.map((row) => row.account)));
      } catch (err) {
        console.error("Failed to fetch Schedule C2 data:", err);
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

    const exists = scheduleC2Data.some(
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

    setScheduleC2Data((prev) => [...prev, newRow]);
    setSelectedAccountObj(null);
    setSearchQuery("");
  };

  const handleRemoveRow = (acctId) => {
    const isOriginalAccount = originalAccounts.has(acctId);

    setScheduleC2Data((prev) => prev.filter((r) => r.account !== acctId));

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
  const subtotalAmount = scheduleC2Data.reduce(
    (sum, r) => sum + r.amountRaw,
    0,
  );
  const subtotalAdjustment = scheduleC2Data.reduce(
    (sum, r) => sum + r.adjustmentRaw,
    0,
  );
  const subtotalClaimed = scheduleC2Data.reduce(
    (sum, r) => sum + r.claimedRaw,
    0,
  );

  // Find California Intermediate Amount from API amounts array
  const calIntermediateObj = amountsData.find((a) =>
    a.name?.toLowerCase().includes("california intermediate"),
  );
  const calIntermediateVal = calIntermediateObj ? calIntermediateObj.amount : 0;

  // Static or calculated Fringe Allocation Amount (0 if not applicable)
  const fringeAllocationVal = 0;

  // Overhead Pool Totals
  const totalOverheadPoolAmount =
    subtotalAmount + calIntermediateVal + fringeAllocationVal;
  const totalOverheadPoolClaimed =
    subtotalClaimed + calIntermediateVal + fringeAllocationVal;

  const handleAdjustmentChange = (acctId, value) => {
    const numericVal = value === "" ? 0 : parseFloat(value) || 0;

    setScheduleC2Data((prev) =>
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
        {/* HEADER SECTION */}
        <div className="relative mb-8 h-[125px]">
          <div className="absolute left-0 top-0 w-[250px] text-sm">
            <div>Schedule C is linked to the following</div>
            <div>schedules:</div>
            {/* <div>Schedule D(x)</div> */}
            <div>
              {" "}
              <button
                type="button"
                // onClick={() => onNavigate && onNavigate("sched_d1")}
                // className="mt-8 text-blue-700 underline cursor-pointer"
              >
                Schedule D(x)
              </button>
            </div>
            <button
              type="button"
              // onClick={() => onNavigate && onNavigate("sched_d1")}
              className="mt-8 text-blue-700 underline cursor-pointer"
            >
              ICE MANUAL
            </button>
          </div>

          <div className="absolute left-[275px] top-0 w-[390px]">
            <div className="bg-[#ffff00] py-[3px] text-center font-bold">
              {companyName}
            </div>
            <div className="bg-[#ffff00] py-[3px] text-center font-bold">
              {companyAddress}
            </div>
          </div>

          <div className="absolute left-[675px] top-0">
            <div className="text-base font-bold">SCHEDULE C (2)</div>
            <div className="text-sm font-bold">ICE (version 2.0.1h)</div>
          </div>

          <div className="absolute left-[275px] top-[54px] w-[390px] text-center">
            <div className="py-[2px] font-bold italic leading-[18px]">
              Overhead Expenses (final indirect cost pool)
            </div>
            <div className="bg-[#ffff00] py-[3px] font-bold">
              Off Site Overhead
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

        {/* MAIN ACCOUNT TABLE */}
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
              <div>TOTAL PER G/L</div>
              <div>&amp; TRIAL BAL/F/S</div>
            </div>

            <div className="px-1 py-1 text-center font-bold">ADJUSTMENTS</div>
            <div className="px-1 py-1 text-center font-bold">CLAIMED</div>
            <div className="px-1 py-1 text-center font-bold">Notes</div>
            <div className="px-1 py-1 text-center font-bold">Action</div>
            <div className="px-1 py-1 text-center font-bold">Ref.</div>
          </div>

          {/* DYNAMIC ACCOUNT ROWS */}
          {loading ? (
            <div className="py-4 text-center font-semibold text-gray-600">
              Loading Schedule C2 data...
            </div>
          ) : error ? (
            <div className="py-4 text-center font-semibold text-red-600">
              Error loading data: {error}
            </div>
          ) : (
            scheduleC2Data.map((row) => (
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
                  {formatCurrency(row.amountRaw)}
                </div>
                {/* <div className="px-2 py-[2px] text-right whitespace-nowrap">
                  {row.adjustmentRaw === 0
                    ? ""
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
                  {formatCurrency(row.claimedRaw)}
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
              </div>
            ))
          )}

          {/* SUBTOTAL ROW */}
          <div
            className={`${tableGrid} mt-2 border-b border-black text-sm text-black`}
          >
            <div />
            <div className="px-2 py-1 font-bold underline">Subtotal</div>
            <div className="bg-cyan-300 px-2 py-1 text-right font-medium">
              {formatCurrency(subtotalAmount)}
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right font-medium">
              {formatCurrency(subtotalAmount)}
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right font-medium">
              {subtotalAdjustment === 0
                ? "-"
                : formatCurrency(subtotalAdjustment)}
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right font-medium">
              {formatCurrency(subtotalClaimed)}
            </div>
            <div />
            <div />
            <div />
          </div>
        </div>

        {/* ALLOCATION SECTION */}
        <div className="mt-3 w-fit">
          {/* CALIFORNIA INTERMEDIATE ROW */}
          <div className={tableGrid}>
            <div />
            <div className="bg-[#ffff00] px-1 py-1 font-semibold underline">
              California Intermediate
            </div>
            <div className="bg-[#ffff00] px-2 py-1 text-right whitespace-nowrap">
              {formatCurrency(calIntermediateVal)}
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
              {formatCurrency(calIntermediateVal)}
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
              -
            </div>
            <div className="bg-[#ffff00] px-2 py-1 text-right whitespace-nowrap">
              {formatCurrency(calIntermediateVal)}
            </div>
            <div />
            <ReferenceBox onClick={() => onNavigate && onNavigate("sched_d1")}>
              Sched D (1)
            </ReferenceBox>
          </div>

          {/* SCHED D (2) LINK ROW */}
          <div className={tableGrid}>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <ReferenceBox onClick={() => onNavigate && onNavigate("sched_d2")}>
              Sched D (2)
            </ReferenceBox>
          </div>

          {/* FRINGE ALLOCATION ROW */}
          <div className={tableGrid}>
            <div className="col-span-2 px-1 py-1 font-bold">
              ADD: Fringe Allocation
            </div>
            <div
              className="px-2 py-1"
              style={{
                background:
                  "repeating-linear-gradient(135deg, #ffffff 0px, #ffffff 3px, #777777 3px, #777777 4px)",
              }}
            />
            <div className="bg-[#ffff00] px-2 py-1 text-right">
              {fringeAllocationVal === 0
                ? "-"
                : formatCurrency(fringeAllocationVal)}
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right">-</div>
            <div className="bg-[#ffff00] px-2 py-1 text-right">
              {fringeAllocationVal === 0
                ? "-"
                : formatCurrency(fringeAllocationVal)}
            </div>
            <div />
            <ReferenceBox
              onClick={() => onNavigate && onNavigate("sched_fringe")}
            >
              Fringe
            </ReferenceBox>
          </div>

          {/* TOTAL OVERHEAD POOL ROW */}
          <div className={`${tableGrid} border-b border-black`}>
            <div />
            <div className="px-1 py-1 font-bold">Total Overhead Pool</div>
            <div />
            <div className="bg-cyan-300 px-2 py-1 text-right font-medium whitespace-nowrap">
              {formatCurrency(totalOverheadPoolAmount)}
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right whitespace-nowrap">
              -
            </div>
            <div className="bg-cyan-300 px-2 py-1 text-right font-medium whitespace-nowrap">
              {formatCurrency(totalOverheadPoolClaimed)}
            </div>
            <div />
            <div />
          </div>
        </div>

        {/* LEGEND SECTION */}
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

export default SchedC2;
