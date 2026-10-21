// import React from "react";

// const YellowCell = ({ children, className = "" }) => (
//   <div
//     className={`flex h-[22px] items-center justify-end bg-[#fff500] px-2 text-[14px] ${className}`}
//   >
//     {children}
//   </div>
// );

// const FormulaCell = ({ children, className = "" }) => (
//   <div
//     className={`flex h-[22px] items-center justify-end bg-[#29c4c8] px-2 text-[14px] ${className}`}
//   >
//     {children}
//   </div>
// );

// const ReferenceCell = ({ children }) => (
//   <div className="flex h-[21px] w-[80px] items-center justify-center bg-[#1719a8] px-2 text-[14px] font-bold text-white underline">
//     {children}
//   </div>
// );

// export default function SchedG1() {
//   return (
//     <div className="min-h-screen w-full overflow-hidden bg-[#e9e9e9] font-serif text-[#111]">
//       {/* Top information */}
//       <div className="relative h-[180px]">
//         {/* Left side */}
//         <div className="absolute left-[4px] top-[5px] text-[14px]">
//           <div>Schedule G-1 is linked to the following schedule:</div>
//           <div className="mt-[4px]">Schedule G, Reconciled to GL</div>
//           <div className="mt-[7px] text-[#0000cc] underline">ICE MANUAL</div>
//         </div>

//         {/* Company name */}
//         <div className="absolute left-[290px] top-[39px] w-[348px] bg-[#fff500] py-[2px] text-center text-[15px] font-bold leading-[17px]">
//           <div>Columbus Technologies, Inc.</div>
//           <div>California</div>
//         </div>

//         {/* Schedule title */}
//         <div className="absolute left-[702px] top-[5px] text-center">
//           <div className="text-[14px] font-bold">SCHEDULE G-1</div>
//           <div className="text-[14px] font-bold">(OPTIONAL)</div>
//           <div className="text-[14px] font-bold">ICE (version 2.0.1h)</div>
//         </div>

//         {/* Main heading */}
//         <div className="absolute left-[290px] top-[97px] w-[348px] text-center">
//           <div className="text-[15px] font-bold leading-[18px]">
//             RECONCILIATION OF CLAIMED DIRECT
//           </div>
//           <div className="text-[15px] font-bold leading-[18px]">
//             COSTS TO JOB COST LEDGER
//           </div>

//           <div className="mt-[8px] bg-[#fff500] text-[14px] font-bold">
//             Fiscal Year End - 12/31/2025
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="ml-[40px] mt-[0px] w-[745px]">
//         {/* Headers */}
//         <div
//           className="grid items-end"
//           style={{
//             gridTemplateColumns: "250px 120px 130px 105px 65px 100px",
//           }}
//         >
//           <div className="border-b border-black pb-[1px] pl-[4px] text-[14px] font-bold underline">
//             Cost Element
//           </div>

//           <div className="border-b border-black pb-[1px] text-center text-[14px] font-bold leading-[17px]">
//             <div>Per General</div>
//             <div>Ledger</div>
//           </div>

//           <div className="border-b border-black pb-[1px] text-center text-[14px] font-bold leading-[17px]">
//             <div>Per Job</div>
//             <div>Cost Ledger</div>
//           </div>

//           <div className="border-b border-black pb-[1px] text-center text-[14px] font-bold underline">
//             Difference
//           </div>

//           <div className="border-b border-black pb-[1px] text-center text-[14px] underline">
//             Notes
//           </div>

//           <div className="border-b border-black pb-[1px] text-center text-[14px] font-bold underline">
//             Reference
//           </div>
//         </div>

//         {/* Direct Labor */}
//         <div
//           className="grid"
//           style={{
//             gridTemplateColumns: "250px 120px 130px 105px 65px 100px",
//           }}
//         >
//           <div className="h-[20px] pl-[4px] text-[14px]">Direct Labor</div>
//           <YellowCell>2,30,59,425</YellowCell>
//           <div className="flex h-[22px] items-center justify-end px-2 text-[14px]">
//             2,30,59,425
//           </div>
//           <FormulaCell>(0)</FormulaCell>
//           <div />
//           <div className="flex items-center justify-center">
//             <ReferenceCell>Sched G</ReferenceCell>
//           </div>
//         </div>

//         {/* Travel */}
//         <div
//           className="grid"
//           style={{
//             gridTemplateColumns: "250px 120px 130px 105px 65px 100px",
//           }}
//         >
//           <div className="h-[20px] pl-[4px] text-[14px]">Travel</div>
//           <YellowCell>1,38,942</YellowCell>
//           <div className="flex h-[22px] items-center justify-end px-2 text-[14px]">
//             -
//           </div>
//           <FormulaCell>-</FormulaCell>
//           <div />
//           <div />
//         </div>

//         {/* Material */}
//         <div
//           className="grid"
//           style={{
//             gridTemplateColumns: "250px 120px 130px 105px 65px 100px",
//           }}
//         >
//           <div className="h-[20px] pl-[4px] text-[14px]">Material</div>
//           <YellowCell>15,30,143</YellowCell>
//           <div className="flex h-[22px] items-center justify-end px-2 text-[14px]">
//             15,30,143
//           </div>
//           <FormulaCell>-</FormulaCell>
//           <div />
//           <div />
//         </div>

//         {/* Other Direct Cost */}
//         <div
//           className="grid"
//           style={{
//             gridTemplateColumns: "250px 120px 130px 105px 65px 100px",
//           }}
//         >
//           <div className="h-[20px] pl-[4px] text-[14px]">Other Direct Cost</div>
//           <YellowCell>4,77,053</YellowCell>
//           <div className="flex h-[22px] items-center justify-end px-2 text-[14px]">
//             4,77,053
//           </div>
//           <FormulaCell>-</FormulaCell>
//           <div />
//           <div />
//         </div>

//         {/* Subcontracts */}
//         <div
//           className="grid"
//           style={{
//             gridTemplateColumns: "250px 120px 130px 105px 65px 100px",
//           }}
//         >
//           <div className="h-[20px] pl-[4px] text-[14px]">Subcontracts</div>
//           <YellowCell>2,37,04,811</YellowCell>
//           <div className="flex h-[22px] items-center justify-end px-2 text-[14px]">
//             2,37,04,811
//           </div>
//           <FormulaCell>(0)</FormulaCell>
//           <div />
//           <div />
//         </div>

//         {/* Unburden Teammate Cost */}
//         <div
//           className="grid"
//           style={{
//             gridTemplateColumns: "250px 120px 130px 105px 65px 100px",
//           }}
//         >
//           <div className="h-[20px] pl-[4px] text-[14px]">
//             Unburden Teammate Cost
//           </div>
//           <YellowCell>3,24,751</YellowCell>
//           <div className="flex h-[22px] items-center justify-end px-2 text-[14px]">
//             3,24,751
//           </div>
//           <FormulaCell>-</FormulaCell>
//           <div />
//           <div />
//         </div>

//         {/* Total Direct */}
//         <div
//           className="grid border-t border-black"
//           style={{
//             gridTemplateColumns: "250px 120px 130px 105px 65px 100px",
//           }}
//         >
//           <div className="h-[22px] pl-[4px] text-[14px] font-bold">
//             Total Direct
//           </div>

//           <FormulaCell className="border-t border-black">
//             4,92,35,125
//           </FormulaCell>

//           <FormulaCell className="border-t border-black">
//             4,92,35,125
//           </FormulaCell>

//           <FormulaCell className="border-t border-black">(0)</FormulaCell>

//           <div />
//           <div />
//         </div>
//       </div>

//       {/* Bottom legends */}
//       <div className="mt-[100px]">
//         <div className="flex h-[20px] w-[292px] items-center bg-[#fff500] px-1 text-[14px]">
//           Imported from Other Worksheet
//         </div>

//         <div className="mt-[1px] flex h-[20px] w-[292px] items-center bg-[#29c4c8] px-1 text-[14px]">
//           Cell Contains a Formula
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { backendUrl } from "../config";

const YellowCell = ({ children, className = "" }) => (
  <div
    className={`flex h-[22px] items-center justify-end bg-[#fff500] px-2 text-[14px] ${className}`}
  >
    {children}
  </div>
);

const FormulaCell = ({ children, className = "" }) => (
  <div
    className={`flex h-[22px] items-center justify-end bg-[#29c4c8] px-2 text-[14px] ${className}`}
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

export default function SchedG1({
  onNavigate,
  companyName,
  companyAddress,
  year,
  fiscalYearEnd,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const fiscalYearEnd = `12/31/${year}`;

  // Fetch API Data
  useEffect(() => {
    const fetchScheduleG1Data = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${backendUrl}/api/TrialBalance/scheduleDG1_cost?fyCd=${year}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data && data.schedules && data.schedules[0]?.rows) {
          setRows(data.schedules[0].rows);
        } else {
          setRows([]);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch Schedule G-1 data");
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleG1Data();
  }, []);

  // Currency formatting (US Standard)
  const formatCurrency = (val) => {
    if (val === null || val === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val);
  };

  // Difference formatting: accounting parentheses for non-zero, dash for zero
  const formatDifference = (diff) => {
    if (Math.abs(diff) < 0.01) return "-";
    if (diff < 0) {
      return `(${formatCurrency(Math.abs(diff))})`;
    }
    return formatCurrency(diff);
  };

  // Filter out the API summary row for row-by-row mapping
  const lineItems = rows.filter(
    (row) => !row.subname?.toLowerCase().includes("total"),
  );

  // Dynamic calculations across all line items
  const totalGl = lineItems.reduce((acc, r) => acc + (r.trialBal || 0), 0);
  const totalJobCost = lineItems.reduce((acc, r) => acc + (r.claimed || 0), 0);
  const totalDiff = totalGl - totalJobCost;

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#e9e9e9] font-serif text-[#111] p-4">
      {/* Top Header Information */}
      <div className="relative h-[180px]">
        {/* Left Info */}
        <div className="absolute left-[4px] top-[5px] text-[14px]">
          <div>Schedule G-1 is linked to the following schedule:</div>
          <div className="mt-[4px]">Schedule G, Reconciled to GL</div>
          <div className="mt-[7px] text-[#0000cc] underline cursor-pointer">
            ICE MANUAL
          </div>
        </div>

        {/* Company Name */}
        <div className="absolute left-[290px] top-[39px] w-[348px] bg-[#fff500] py-[2px] text-center text-[15px] font-bold leading-[17px]">
          <div>{companyName}</div>
          <div>{companyAddress}</div>
        </div>

        {/* Schedule Version Header */}
        <div className="absolute left-[702px] top-[5px] text-center">
          <div className="text-[14px] font-bold">SCHEDULE G-1</div>
          <div className="text-[14px] font-bold">(OPTIONAL)</div>
          <div className="text-[14px] font-bold">ICE (version 2.0.1h)</div>
        </div>

        {/* Main Heading */}
        <div className="absolute left-[290px] top-[97px] w-[348px] text-center">
          <div className="text-[15px] font-bold leading-[18px]">
            RECONCILIATION OF CLAIMED DIRECT
          </div>
          <div className="text-[15px] font-bold leading-[18px]">
            COSTS TO JOB COST LEDGER
          </div>

          <div className="mt-[8px] bg-[#fff500] text-[14px] font-bold">
            Fiscal Year End - {fiscalYearEnd}
          </div>
        </div>
      </div>

      {/* Main Table Structure */}
      <div className="ml-[40px] mt-[0px] w-[800px]">
        {/* Table Column Headers */}
        <div
          className="grid items-end"
          style={{
            gridTemplateColumns: "220px 140px 140px 120px 65px 115px",
          }}
        >
          <div className="border-b border-black pb-[1px] pl-[4px] text-[14px] font-bold underline">
            Cost Element
          </div>

          <div className="border-b border-black pb-[1px] text-center text-[14px] font-bold leading-[17px]">
            <div>Per General</div>
            <div>Ledger</div>
          </div>

          <div className="border-b border-black pb-[1px] text-center text-[14px] font-bold leading-[17px]">
            <div>Per Job</div>
            <div>Cost Ledger</div>
          </div>

          <div className="border-b border-black pb-[1px] text-center text-[14px] font-bold underline">
            Difference
          </div>

          <div className="border-b border-black pb-[1px] text-center text-[14px] underline">
            Notes
          </div>

          <div className="border-b border-black pb-[1px] text-center text-[14px] font-bold underline">
            Reference
          </div>
        </div>

        {/* Content Loading & Dynamic Mapping */}
        {loading ? (
          <div className="py-8 text-center text-[14px] font-bold">
            Loading Schedule G-1 data...
          </div>
        ) : error ? (
          <div className="py-4 text-center text-rose-600 text-[14px]">
            {error}
          </div>
        ) : (
          <>
            {lineItems.map((item, idx) => {
              const glAmount = item.trialBal || 0;
              const jclAmount = item.claimed || 0;
              const diff = glAmount - jclAmount;

              return (
                <div
                  key={item.subname || idx}
                  className="grid my-[1px] items-center"
                  style={{
                    gridTemplateColumns: "220px 140px 140px 120px 65px 115px",
                  }}
                >
                  <div className="h-[20px] pl-[4px] text-[14px]">
                    {item.subname}
                  </div>
                  <YellowCell>{formatCurrency(glAmount)}</YellowCell>
                  <div className="flex h-[22px] items-center justify-end px-2 text-[14px]">
                    {formatCurrency(jclAmount)}
                  </div>
                  <FormulaCell>{formatDifference(diff)}</FormulaCell>
                  <div />
                  <div className="flex items-center justify-center">
                    {idx === 0 && (
                      <ReferenceCell
                        onClick={() => onNavigate && onNavigate("sched_g")}
                      >
                        Sched G
                      </ReferenceCell>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Total Row */}
            <div
              className="grid border-t border-black mt-[4px] pt-[2px]"
              style={{
                gridTemplateColumns: "220px 140px 140px 120px 65px 115px",
              }}
            >
              <div className="h-[22px] pl-[4px] text-[14px] font-bold">
                Total Direct
              </div>

              <FormulaCell className="border-t border-black font-bold">
                {formatCurrency(totalGl)}
              </FormulaCell>

              <FormulaCell className="border-t border-black font-bold">
                {formatCurrency(totalJobCost)}
              </FormulaCell>

              <FormulaCell className="border-t border-black font-bold">
                {formatDifference(totalDiff)}
              </FormulaCell>

              <div />
              <div />
            </div>
          </>
        )}
      </div>

      {/* Bottom Legend */}
      <div className="mt-[80px] ml-[40px]">
        <div className="flex h-[20px] w-[292px] items-center bg-[#fff500] px-1 text-[14px]">
          Imported from Other Worksheet
        </div>

        <div className="mt-[2px] flex h-[20px] w-[292px] items-center bg-[#29c4c8] px-1 text-[14px]">
          Cell Contains a Formula
        </div>
      </div>
    </div>
  );
}
