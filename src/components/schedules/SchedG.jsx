// import React from "react";

// const FormulaCell = ({ children, className = "" }) => (
//   <div
//     className={`flex min-h-[18px] items-center justify-end border-b border-transparent bg-[#29c4c8] px-2 font-serif text-[14px] ${className}`}
//   >
//     {children}
//   </div>
// );

// const YellowCell = ({ children, className = "" }) => (
//   <div
//     className={`flex min-h-[18px] items-center justify-end bg-[#fff500] px-2 font-serif text-[14px] ${className}`}
//   >
//     {children}
//   </div>
// );

// const ReferenceCell = ({ children }) => (
//   <div className="flex h-[21px] w-[138px] items-center justify-center bg-[#1719a8] font-serif text-[14px] font-bold text-white underline">
//     {children}
//   </div>
// );

// export default function SchedG() {
//   return (
//     <div className="min-h-screen w-full bg-[#e9e9e9] font-serif text-[#111]">
//       {/* Top section */}
//       <div className="relative min-h-[150px]">
//         {/* Left information */}
//         <div className="absolute left-[4px] top-[5px] text-[13px]">
//           <div>Schedule G is linked to the following schedule:</div>
//           <div className="mt-[4px]">Summary Schedule H</div>
//           <div className="mt-[8px] text-[#0000cc] underline">ICE MANUAL</div>
//         </div>

//         {/* Company */}
//         <div className="absolute left-[318px] top-[21px] w-[391px] bg-[#fff500] py-[3px] text-center text-[14px] font-bold leading-[17px]">
//           <div>Columbus Technologies, Inc.</div>
//           <div>California</div>
//         </div>

//         {/* Title */}
//         <div className="absolute left-[318px] top-[80px] w-[391px] text-center">
//           <div className="text-[14px] font-bold">
//             Reconciliation of Books of Account and Claimed Direct Costs
//           </div>
//           <div className="text-[14px] font-bold">by major cost element</div>

//           <div className="mt-[1px] bg-[#fff500] text-[13px] font-bold">
//             Fiscal Year End - 12/31/2025
//           </div>
//         </div>

//         {/* Schedule title */}
//         <div className="absolute left-[824px] top-[5px] text-center">
//           <div className="text-[14px] font-bold">SCHEDULE G</div>
//           <div className="text-[13px] font-bold">ICF (version 2.0.1h)</div>
//         </div>
//       </div>

//       {/* Main table */}
//       <div className="mt-[18px] w-[1000px]">
//         {/* Headers */}
//         <div
//           className="grid items-end border-b border-black"
//           style={{
//             gridTemplateColumns: "45px 272px 138px 110px 145px 75px 160px",
//           }}
//         >
//           <div className="px-1 pb-[1px] text-[14px] font-bold underline">
//             ACCT
//           </div>

//           <div className="pb-[1px] text-center text-[14px] font-bold underline">
//             DESCRIPTION*
//           </div>

//           <div className="text-center text-[14px] font-bold leading-[16px]">
//             <div>AMOUNT</div>
//             <div>PER GENERAL</div>
//             <div>LEDGER</div>
//           </div>

//           <div className="pb-[1px] text-center text-[14px] font-bold underline">
//             ADJUSTMENTS
//           </div>

//           <div className="text-center text-[14px] font-bold leading-[16px]">
//             <div>AMOUNT</div>
//             <div>CLAIMED</div>
//           </div>

//           <div className="pb-[1px] text-center text-[14px] underline">
//             Notes
//           </div>

//           <div className="pb-[1px] text-center text-[14px] underline">Ref.</div>
//         </div>

//         {/* Direct Labor */}
//         <div
//           className="grid min-h-[19px]"
//           style={{
//             gridTemplateColumns: "45px 272px 138px 110px 145px 75px 160px",
//           }}
//         >
//           <div />
//           <div className="pl-[7px] text-[14px]">Direct Labor</div>
//           <YellowCell>2,30,59,425</YellowCell>
//           <div className="flex items-center justify-end px-2 text-[14px]">
//             (212)
//           </div>
//           <FormulaCell>2,30,59,213</FormulaCell>
//           <div className="flex items-center justify-center text-[14px]">1</div>
//           <div className="flex items-center justify-center">
//             <ReferenceCell>Summary Sched H</ReferenceCell>
//           </div>
//         </div>

//         {/* Travel */}
//         <div
//           className="grid min-h-[19px]"
//           style={{
//             gridTemplateColumns: "45px 272px 138px 110px 145px 75px 160px",
//           }}
//         >
//           <div />
//           <div className="pl-[7px] text-[14px]">Travel</div>
//           <YellowCell>1,38,942</YellowCell>
//           <div className="flex items-center justify-end px-2 text-[14px]">
//             (1,605)
//           </div>
//           <FormulaCell>1,38,942</FormulaCell>
//           <div className="flex items-center justify-center text-[14px]">2</div>
//           <div className="flex items-center justify-center text-[15px]">"</div>
//         </div>

//         {/* Material */}
//         <div
//           className="grid min-h-[19px]"
//           style={{
//             gridTemplateColumns: "45px 272px 138px 110px 145px 75px 160px",
//           }}
//         >
//           <div />
//           <div className="pl-[7px] text-[14px]">Material</div>
//           <YellowCell>15,30,143</YellowCell>
//           <div />
//           <FormulaCell>15,30,143</FormulaCell>
//           <div />
//           <div className="flex items-center justify-center text-[15px]">"</div>
//         </div>

//         {/* Other Direct Cost */}
//         <div
//           className="grid min-h-[19px]"
//           style={{
//             gridTemplateColumns: "45px 272px 138px 110px 145px 75px 160px",
//           }}
//         >
//           <div />
//           <div className="pl-[7px] text-[14px]">Other Direct Cost</div>
//           <YellowCell>4,77,053</YellowCell>
//           <div className="flex items-center justify-end px-2 text-[14px]">
//             (2,954)
//           </div>
//           <FormulaCell>4,74,099</FormulaCell>
//           <div className="flex items-center justify-center text-[14px]">3</div>
//           <div className="flex items-center justify-center text-[15px]">"</div>
//         </div>

//         {/* Subcontracts */}
//         <div
//           className="grid min-h-[19px]"
//           style={{
//             gridTemplateColumns: "45px 272px 138px 110px 145px 75px 160px",
//           }}
//         >
//           <div />
//           <div className="pl-[7px] text-[14px]">Subcontracts</div>
//           <YellowCell>3,27,04,811</YellowCell>
//           <div />
//           <FormulaCell>3,27,04,811</FormulaCell>
//           <div />
//           <div className="flex items-center justify-center text-[15px]">"</div>
//         </div>

//         {/* Unburden Teammate Cost */}
//         <div
//           className="grid min-h-[19px]"
//           style={{
//             gridTemplateColumns: "45px 272px 138px 110px 145px 75px 160px",
//           }}
//         >
//           <div />
//           <div className="pl-[7px] text-[14px]">Unburden Teammate Cost</div>
//           <YellowCell>3,24,751</YellowCell>
//           <div className="flex items-center justify-end px-2 text-[14px]">
//             (2,76,702)
//           </div>
//           <FormulaCell>48,049</FormulaCell>
//           <div className="flex items-center justify-center text-[14px]">4</div>
//           <div />
//         </div>

//         {/* Total */}
//         <div
//           className="grid mt-[2px] min-h-[20px] border-t border-black"
//           style={{
//             gridTemplateColumns: "45px 272px 138px 110px 145px 75px 160px",
//           }}
//         >
//           <div />
//           <div className="pl-[7px] text-[14px] font-bold">
//             TOTAL DIRECT COSTS
//           </div>

//           <FormulaCell className="border-t border-black font-bold">
//             1,92,35,125
//           </FormulaCell>

//           <FormulaCell className="border-t border-black font-bold">
//             (2,81,473)
//           </FormulaCell>

//           <FormulaCell className="border-t border-black font-bold">
//             1,89,53,651
//           </FormulaCell>

//           <div />
//           <div />
//         </div>
//       </div>

//       {/* Explanatory Notes */}
//       <div className="mt-[74px] ml-[4px] text-[12px]">
//         <div className="mb-[5px] font-bold underline">Explanatory Notes:</div>

//         <div>
//           1. Non reimbursable Labor cost to the project 80N1001D0004 for $212
//           has been adjusted from claimed Labor cost.
//         </div>

//         <div className="mt-[4px]">
//           2. Non reimbursable Travel cost to the project 80GFSC25C004 for
//           $(1,165) and 47QFCA21F0001 (440.02) has been updated as adjustment
//           from the claimed Travel costs.
//         </div>

//         <div className="mt-[4px]">
//           3. Non reimbursable ODC cost to the project 4400574846 for $2,953.50
//           has been updated as adjustment from the claimed ODC costs.
//         </div>

//         <div className="mt-[4px]">
//           4. An adjustment of $(276,702) for project 80GFSC25C004 is made for
//           Teammate Fee Costs, as these are not claimed.
//         </div>
//       </div>

//       {/* Bottom legend */}
//       <div className="mt-[18px]">
//         <div className="flex items-center">
//           <div className="ml-[4px] flex h-[20px] w-[315px] items-center bg-[#fff500] px-1 text-[14px]">
//             Linked to Other Worksheet
//           </div>

//           <div className="ml-[2px] text-[14px]">As Referenced</div>
//         </div>

//         <div className="mt-[8px] flex items-center">
//           <div className="ml-[4px] flex h-[20px] w-[315px] items-center bg-[#29c4c8] px-1 text-[14px]">
//             Cell Contains a Formula
//           </div>

//           <div className="ml-[2px] text-[14px]">Totals and Differences</div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { backendUrl } from "../config";

const FormulaCell = ({ children, className = "" }) => (
  <div
    className={`flex min-h-[18px] items-center justify-end border-b border-transparent bg-[#29c4c8] px-2 font-serif text-[14px] ${className}`}
  >
    {children}
  </div>
);

const YellowCell = ({ children, className = "" }) => (
  <div
    className={`flex min-h-[18px] items-center justify-end bg-[#fff500] px-2 font-serif text-[14px] ${className}`}
  >
    {children}
  </div>
);

const ReferenceCell = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-[21px] w-[138px] items-center justify-center bg-[#1719a8] font-serif text-[14px] font-bold text-white underline cursor-pointer hover:bg-blue-900"
  >
    {children}
  </button>
);

export default function SchedG({
  onNavigate,
  companyName,
  companyAddress,
  explanatoryNote,
  setExplanatoryNote,
  year,
  fiscalYearEnd,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const fiscalYearEnd = `12/31/${year}`;

  // Fetch API Data
  useEffect(() => {
    const fetchScheduleData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${backendUrl}/api/TrialBalance/scheduleDG_cost?fyCd=${year}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Extract rows from response schedule structure
        if (data && data.schedules && data.schedules[0]?.rows) {
          setRows(data.schedules[0].rows);
        } else {
          setRows([]);
        }
      } catch (err) {
        setError(err.message || "Failed to load Schedule G data");
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, []);

  // Standard USD currency formatting
  const formatCurrency = (val) => {
    if (val === null || val === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val);
  };

  // Format negative numbers in accounting parens e.g. (1,605.35) or standard text
  const formatAdjustment = (val) => {
    if (val === null || val === undefined || val === 0) return "-";
    if (val < 0) {
      return `(${formatCurrency(Math.abs(val))})`;
    }
    return formatCurrency(val);
  };

  // Filter out subtotal row from API to map line items dynamically
  const lineItems = rows.filter(
    (row) => !row.subname?.toLowerCase().includes("subtotal"),
  );

  // Calculate overall totals dynamically from rows
  const totalTrialBal = lineItems.reduce(
    (acc, r) => acc + (r.trialBal || 0),
    0,
  );
  const totalAdjustment = lineItems.reduce(
    (acc, r) => acc + (r.adjustment || 0),
    0,
  );
  const totalClaimed = lineItems.reduce((acc, r) => acc + (r.claimed || 0), 0);

  return (
    <div className="min-h-screen w-full bg-[#e9e9e9] font-serif text-[#111] p-4">
      {/* Top section */}
      <div className="relative min-h-[150px]">
        {/* Left information */}
        <div className="absolute left-[4px] top-[5px] text-[13px]">
          <div>Schedule G is linked to the following schedule:</div>
          <div className="mt-[4px]">Summary Schedule H</div>
          <div className="mt-[8px] text-[#0000cc] underline cursor-pointer">
            ICE MANUAL
          </div>
        </div>

        {/* Company */}
        <div className="absolute left-[318px] top-[21px] w-[391px] bg-[#fff500] py-[3px] text-center text-[14px] font-bold leading-[17px]">
          <div>{companyName}</div>
          <div>{companyAddress}</div>
        </div>

        {/* Title */}
        <div className="absolute left-[318px] top-[80px] w-[391px] text-center">
          <div className="text-[14px] font-bold">
            Reconciliation of Books of Account and Claimed Direct Costs
          </div>
          <div className="text-[14px] font-bold">by major cost element</div>

          <div className="mt-[1px] bg-[#fff500] text-[13px] font-bold">
            Fiscal Year End - {fiscalYearEnd}
          </div>
        </div>

        {/* Schedule title */}
        <div className="absolute left-[824px] top-[5px] text-center">
          <div className="text-[14px] font-bold">SCHEDULE G</div>
          <div className="text-[13px] font-bold">ICF (version 2.0.1h)</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="mt-[18px] w-[1000px]">
        {/* Table Headers */}
        <div
          className="grid items-end border-b border-black pb-1"
          style={{
            gridTemplateColumns: "45px 250px 150px 140px 150px 60px 185px",
          }}
        >
          <div className="px-1 text-[14px] font-bold underline">ACCT</div>
          <div className="text-center text-[14px] font-bold underline">
            DESCRIPTION*
          </div>
          <div className="text-center text-[14px] font-bold leading-[16px]">
            <div>AMOUNT</div>
            <div>PER GENERAL</div>
            <div>LEDGER</div>
          </div>
          <div className="text-center text-[14px] font-bold underline">
            ADJUSTMENTS
          </div>
          <div className="text-center text-[14px] font-bold leading-[16px]">
            <div>AMOUNT</div>
            <div>CLAIMED</div>
          </div>
          <div className="text-center text-[14px] underline">Notes</div>
          <div className="text-center text-[14px] underline">Ref.</div>
        </div>

        {/* Table Content & Dynamic API Mapping */}
        {loading ? (
          <div className="py-8 text-center text-[14px] font-bold">
            Loading Schedule G data...
          </div>
        ) : error ? (
          <div className="py-4 text-center text-rose-600 text-[14px]">
            {error}
          </div>
        ) : (
          <>
            {lineItems.map((item, index) => (
              <div
                key={item.subname || index}
                className="grid min-h-[22px] items-center my-[1px]"
                style={{
                  gridTemplateColumns:
                    "45px 250px 150px 140px 150px 60px 185px",
                }}
              >
                <div />
                <div className="pl-[7px] text-[14px]">{item.subname}</div>
                <YellowCell>{formatCurrency(item.trialBal)}</YellowCell>
                <div className="flex items-center justify-end px-2 text-[14px]">
                  {formatAdjustment(item.adjustment)}
                </div>
                <FormulaCell>{formatCurrency(item.claimed)}</FormulaCell>
                <div className="flex items-center justify-center text-[14px]">
                  {item.adjustment !== 0 ? index + 1 : ""}
                </div>
                <div className="flex items-center justify-center">
                  {index === 0 ? (
                    <ReferenceCell
                      onClick={() => onNavigate && onNavigate("sched_summaryh")}
                    >
                      Summary Sched H
                    </ReferenceCell>
                  ) : (
                    <span className="text-[15px]">"</span>
                  )}
                </div>
              </div>
            ))}

            {/* Total Row */}
            <div
              className="grid mt-[4px] min-h-[22px] border-t border-black pt-[2px]"
              style={{
                gridTemplateColumns: "45px 250px 150px 140px 150px 60px 185px",
              }}
            >
              <div />
              <div className="pl-[7px] text-[14px] font-bold">
                TOTAL DIRECT COSTS
              </div>

              <FormulaCell className="border-t border-black font-bold">
                {formatCurrency(totalTrialBal)}
              </FormulaCell>

              <FormulaCell className="border-t border-black font-bold">
                {formatAdjustment(totalAdjustment)}
              </FormulaCell>

              <FormulaCell className="border-t border-black font-bold">
                {formatCurrency(totalClaimed)}
              </FormulaCell>

              <div />
              <div />
            </div>
          </>
        )}
      </div>

      {/* Explanatory Notes */}
      {/* <div className="mt-[50px] ml-[4px] text-[12px]">
        <div className="mb-[5px] font-bold underline">Explanatory Notes:</div>
        <div>
          1. Non reimbursable Labor cost to the project 80N1001D0004 for $212
          has been adjusted from claimed Labor cost.
        </div>
        <div className="mt-[4px]">
          2. Non reimbursable Travel cost to the project 80GFSC25C004 for
          $(1,165) and 47QFCA21F0001 (440.02) has been updated as adjustment
          from the claimed Travel costs.
        </div>
        <div className="mt-[4px]">
          3. Non reimbursable ODC cost to the project 4400574846 for $2,953.50
          has been updated as adjustment from the claimed ODC costs.
        </div>
        <div className="mt-[4px]">
          4. An adjustment of $(276,702) for project 80GFSC25C004 is made for
          Teammate Fee Costs, as these are not claimed.
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

      {/* Bottom Legend */}
      <div className="mt-[18px]">
        <div className="flex items-center">
          <div className="ml-[4px] flex h-[20px] w-[315px] items-center bg-[#fff500] px-1 text-[14px]">
            Linked to Other Worksheet
          </div>
          <div className="ml-[2px] text-[14px]">As Referenced</div>
        </div>

        <div className="mt-[8px] flex items-center">
          <div className="ml-[4px] flex h-[20px] w-[315px] items-center bg-[#29c4c8] px-1 text-[14px]">
            Cell Contains a Formula
          </div>
          <div className="ml-[2px] text-[14px]">Totals and Differences</div>
        </div>
      </div>
    </div>
  );
}
