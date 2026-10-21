// import React from "react";

// const rows = [
//   {
//     type: "Cost-Type",
//     onsiteAmount: "1,61,17,483",
//     onsitePct: "75.3%",
//     offsiteAmount: "16,48,803",
//     offsitePct: "100.0%",
//     smhAmount: "2,52,34,954",
//     smhPct: "100.0%",
//     gaAmount: "2,61,41,764",
//     gaPct: "77.6%",
//     ref: "SCHED H",
//   },
//   {
//     type: "Flexibly Priced",
//     onsiteAmount: "-",
//     onsitePct: "0.0%",
//     offsiteAmount: "-",
//     offsitePct: "0.0%",
//     smhAmount: "-",
//     smhPct: "0.0%",
//     gaAmount: "-",
//     gaPct: "0.0%",
//     ref: '"',
//   },
//   {
//     type: "T&M",
//     onsiteAmount: "52,93,139",
//     onsitePct: "24.7%",
//     offsiteAmount: "-",
//     offsitePct: "0.0%",
//     smhAmount: "-",
//     smhPct: "0.0%",
//     gaAmount: "75,60,401",
//     gaPct: "22.4%",
//     ref: '"',
//   },
//   {
//     type: "Fixed Price",
//     onsiteAmount: "-",
//     onsitePct: "0.0%",
//     offsiteAmount: "-",
//     offsitePct: "0.0%",
//     smhAmount: "-",
//     smhPct: "0.0%",
//     gaAmount: "-",
//     gaPct: "0.0%",
//     ref: '"',
//   },
//   {
//     type: "Commercial",
//     onsiteAmount: "-",
//     onsitePct: "0.0%",
//     offsiteAmount: "-",
//     offsitePct: "0.0%",
//     smhAmount: "-",
//     smhPct: "0.0%",
//     gaAmount: "-",
//     gaPct: "0.0%",
//     ref: '"',
//   },
//   {
//     type: "IR&D&BP",
//     onsiteAmount: "-",
//     onsitePct: "0.0%",
//     offsiteAmount: "-",
//     offsitePct: "0.0%",
//     smhAmount: "-",
//     smhPct: "0.0%",
//     gaAmount: "-",
//     gaPct: "0.0%",
//     ref: '"',
//   },
//   {
//     type: "Total",
//     onsiteAmount: "2,14,10,622",
//     onsitePct: "100.0%",
//     offsiteAmount: "16,48,803",
//     offsitePct: "100.0%",
//     smhAmount: "2,52,34,954",
//     smhPct: "100.0%",
//     gaAmount: "3,37,02,165",
//     gaPct: "100.0%",
//     ref: "",
//     total: true,
//   },
// ];

// function AmountCell({ children, total }) {
//   return (
//     <div
//       className={[
//         "flex h-[26px] items-center justify-end border-b border-[#222] px-[10px] font-serif text-[16px]",
//         total ? "bg-[#2bbec3]" : "bg-[#fff200]",
//       ].join(" ")}
//     >
//       {children}
//     </div>
//   );
// }

// function PercentCell({ children, total }) {
//   return (
//     <div
//       className={[
//         "flex h-[26px] items-center justify-end border-b border-[#222] px-[8px] font-serif text-[16px]",
//         total ? "bg-[#2bbec3]" : "bg-[#28c0c5]",
//       ].join(" ")}
//     >
//       {children}
//     </div>
//   );
// }

// function SchedHCont({ onNavigate }) {
//   return (
//     <div className="w-full overflow-x-auto bg-[#f3f3f5] font-serif text-black">
//       <div className="relative min-h-[617px] min-w-[1180px] border border-[#b8b8b8] bg-[#f3f3f5]">
//         {/* Top links */}
//         <div className="absolute left-[5px] top-[3px] text-[16px] leading-[20px]">
//           <div>Schedule H-1 is linked to the following schedules:</div>
//           <div className="text-[#00158f] underline">
//             Schedule H, Contract Costs
//           </div>
//           <div className="mt-[4px] text-[13px] text-[#00158f] underline">
//             ICE MANUAL
//           </div>
//         </div>

//         {/* Right heading */}
//         <div className="absolute left-[975px] top-[5px] w-[220px] text-center text-[16px] font-bold leading-[20px]">
//           <div>Schedule H-1</div>
//           <div>ICE (version 2.0.1h)</div>
//         </div>

//         {/* Company/title area */}
//         <div className="absolute left-[132px] top-[69px] w-[825px] text-center">
//           <div className="h-[44px] bg-[#fff200] pt-[5px] text-[17px] font-bold leading-[20px]">
//             <div>Columbus Technologies, Inc.</div>
//             <div>California</div>
//           </div>

//           <div className="pt-[2px] text-[17px] font-bold leading-[23px]">
//             <div>Subsidiary Schedule of</div>
//             <div>Government Participation Percentages</div>
//           </div>

//           <div className="mt-[1px] h-[25px] bg-[#fff200] text-[17px] font-bold leading-[25px]">
//             Fiscal Year End - 12/31/2025
//           </div>
//         </div>

//         {/* Main table */}
//         <div className="absolute left-[4px] top-[222px]">
//           <div className="grid grid-cols-[118px_225px_225px_225px_220px_110px] gap-x-[12px]">
//             {/* Contract type */}
//             <div className="pt-[46px]">
//               <div className="relative -top-[7px] h-[22px] whitespace-nowrap border-b border-black pl-[2px] text-[17px] font-bold leading-[22px]">
//                 Contract Type
//               </div>

//               {rows.map((row, index) => (
//                 <div
//                   key={row.type}
//                   className={[
//                     "flex items-center whitespace-nowrap pl-[2px] text-[17px]",
//                     row.total ? "h-[26px] font-bold" : "",
//                     index === 0 ? "h-[26px]" : "", // Cost-Type
//                     index === 1 ? "h-[26px]" : "", // Flexibly Priced
//                     index === 2 ? "h-[26px]" : "", // T&M - extra space below
//                     index === 3 ? "h-[26px]" : "", // Fixed Price
//                     index === 4 ? "h-[26px]" : "", // Commercial
//                     index === 5 ? "h-[26px]" : "", // IR&D/B&P
//                   ].join(" ")}
//                 >
//                   {row.type}
//                 </div>
//               ))}
//             </div>

//             {/* OH Onsite */}
//             <div>
//               <div className="h-[23px] bg-[#fff200] text-center text-[18px] font-bold leading-[23px]">
//                 OH - Onsite
//               </div>
//               <div className="grid grid-cols-[112px_100px] gap-x-[12px]">
//                 <div>
//                   <div className="h-[44px] text-center text-[17px] font-bold leading-[22px]">
//                     <div>Overhead</div>
//                     <div>Base Amount</div>
//                   </div>
//                   {rows.map((row) => (
//                     <AmountCell key={row.type} total={row.total}>
//                       {row.onsiteAmount}
//                     </AmountCell>
//                   ))}
//                 </div>
//                 <div>
//                   <div className="h-[44px] text-center text-[17px] font-bold leading-[44px]">
//                     %
//                   </div>
//                   {rows.map((row) => (
//                     <PercentCell key={row.type} total={row.total}>
//                       {row.onsitePct}
//                     </PercentCell>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* OH Offsite */}
//             <div>
//               <div className="h-[23px] bg-[#fff200] text-center text-[18px] font-bold leading-[23px]">
//                 OH - Offsite
//               </div>
//               <div className="grid grid-cols-[112px_100px] gap-x-[12px]">
//                 <div>
//                   <div className="h-[44px] text-center text-[17px] font-bold leading-[22px]">
//                     <div>Overhead</div>
//                     <div>Base Amount</div>
//                   </div>
//                   {rows.map((row) => (
//                     <AmountCell key={row.type} total={row.total}>
//                       {row.offsiteAmount}
//                     </AmountCell>
//                   ))}
//                 </div>
//                 <div>
//                   <div className="h-[44px] text-center text-[17px] font-bold leading-[44px]">
//                     %
//                   </div>
//                   {rows.map((row) => (
//                     <PercentCell key={row.type} total={row.total}>
//                       {row.offsitePct}
//                     </PercentCell>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* SM&H */}
//             <div>
//               <div className="h-[23px] bg-[#fff200] text-center text-[18px] font-bold leading-[23px]">
//                 SM&amp;H
//               </div>
//               <div className="grid grid-cols-[112px_100px] gap-x-[12px]">
//                 <div>
//                   <div className="h-[44px] text-center text-[17px] font-bold leading-[22px]">
//                     <div>Overhead</div>
//                     <div>Base Amount</div>
//                   </div>
//                   {rows.map((row) => (
//                     <AmountCell key={row.type} total={row.total}>
//                       {row.smhAmount}
//                     </AmountCell>
//                   ))}
//                 </div>
//                 <div>
//                   <div className="h-[44px] text-center text-[17px] font-bold leading-[44px]">
//                     %
//                   </div>
//                   {rows.map((row) => (
//                     <PercentCell key={row.type} total={row.total}>
//                       {row.smhPct}
//                     </PercentCell>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* G&A */}
//             <div className="pt-[23px]">
//               <div className="grid grid-cols-[112px_100px] gap-x-[12px]">
//                 <div>
//                   <div className="h-[44px] text-center text-[17px] font-bold leading-[22px]">
//                     <div>G&amp;A</div>
//                     <div>Base Amount</div>
//                   </div>
//                   {rows.map((row) => (
//                     <AmountCell key={row.type} total={row.total}>
//                       {row.gaAmount}
//                     </AmountCell>
//                   ))}
//                 </div>
//                 <div>
//                   <div className="h-[44px] text-center text-[17px] font-bold leading-[44px]">
//                     %
//                   </div>
//                   {rows.map((row) => (
//                     <PercentCell key={row.type} total={row.total}>
//                       {row.gaPct}
//                     </PercentCell>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* References */}
//             <div className="pt-[23px]">
//               <div className="h-[44px] text-center text-[17px] font-bold leading-[44px]">
//                 Ref.
//               </div>
//               {rows.map((row) => (
//                 <div
//                   key={row.type}
//                   className="flex h-[26px] items-center justify-center text-[17px]"
//                 >
//                   {row.ref === "SCHED H" ? (
//                     <div className="h-[23px] w-[110px] bg-[#29258f] text-center font-bold leading-[23px] text-white underline">
//                       SCHED H
//                     </div>
//                   ) : (
//                     row.ref
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Legend */}
//         <div className="absolute left-[4px] top-[513px] w-[241px]">
//           <div className="h-[23px] bg-[#fff200] pl-[3px] text-[16px] leading-[23px]">
//             Linked to Other Worksheet
//           </div>
//           <div className="mt-[20px] h-[26px] bg-[#2bbec3] pl-[3px] text-[16px] leading-[26px]">
//             Cel Contains a Formula
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SchedHCont;

import React, { useState, useEffect } from "react";
import { backendUrl } from "../config";
import SchedH from "./SchedH"; // wherever your actual Schedule H lives
import SchedE from "./SchedE";
import SummarySchedH from "./SummarySchedH";

const TABS = {
  summary_sched_h: SummarySchedH,
  sched_h: SchedH,
  sched_h_cont: SchedHCont,
  sched_e: SchedE,
};

// 1. Defined the ReferenceBox exactly like in your Summary schedule
const ReferenceBox = ({ children, onClick, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-[20px] items-center justify-center bg-[#1717a8] px-3 text-[13px] font-bold text-white underline hover:bg-blue-800 cursor-pointer ${className}`}
  >
    {children}
  </button>
);

const initialRows = [
  {
    type: "Cost-Type",
    onsiteAmount: "-",
    onsitePct: "0.0%",
    offsiteAmount: "-",
    offsitePct: "0.0%",
    smhAmount: "-",
    smhPct: "0.0%",
    gaAmount: "-",
    gaPct: "0.0%",
    ref: "SCHED H",
  },
  {
    type: "Flexibly Priced",
    onsiteAmount: "-",
    onsitePct: "0.0%",
    offsiteAmount: "-",
    offsitePct: "0.0%",
    smhAmount: "-",
    smhPct: "0.0%",
    gaAmount: "-",
    gaPct: "0.0%",
    ref: '"',
  },
  {
    type: "T&M",
    onsiteAmount: "-",
    onsitePct: "0.0%",
    offsiteAmount: "-",
    offsitePct: "0.0%",
    smhAmount: "-",
    smhPct: "0.0%",
    gaAmount: "-",
    gaPct: "0.0%",
    ref: '"',
  },
  {
    type: "Fixed Price",
    onsiteAmount: "-",
    onsitePct: "0.0%",
    offsiteAmount: "-",
    offsitePct: "0.0%",
    smhAmount: "-",
    smhPct: "0.0%",
    gaAmount: "-",
    gaPct: "0.0%",
    ref: '"',
  },
  {
    type: "Commercial",
    onsiteAmount: "-",
    onsitePct: "0.0%",
    offsiteAmount: "-",
    offsitePct: "0.0%",
    smhAmount: "-",
    smhPct: "0.0%",
    gaAmount: "-",
    gaPct: "0.0%",
    ref: '"',
  },
  {
    type: "IR&D&BP",
    onsiteAmount: "-",
    onsitePct: "0.0%",
    offsiteAmount: "-",
    offsitePct: "0.0%",
    smhAmount: "-",
    smhPct: "0.0%",
    gaAmount: "-",
    gaPct: "0.0%",
    ref: '"',
  },
  {
    type: "Total",
    onsiteAmount: "-",
    onsitePct: "100.0%",
    offsiteAmount: "-",
    offsitePct: "100.0%",
    smhAmount: "-",
    smhPct: "100.0%",
    gaAmount: "-",
    gaPct: "100.0%",
    ref: "",
    total: true,
  },
];

function AmountCell({ children, total }) {
  return (
    <div
      className={[
        "flex h-[26px] items-center justify-end border-b border-[#222] px-[10px] font-serif text-[16px]",
        total ? "bg-[#2bbec3]" : "bg-[#fff200]",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function PercentCell({ children, total }) {
  return (
    <div
      className={[
        "flex h-[26px] items-center justify-end border-b border-[#222] px-[8px] font-serif text-[16px]",
        total ? "bg-[#2bbec3]" : "bg-[#28c0c5]",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default function SchedHCont({
  companyName,
  companyAddress,
  onNavigate,
  year,
  fiscalYearEnd,
}) {
  const [rows, setRows] = useState(initialRows);

  // const fiscalYearEnd = `12/31/${year}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ledgerRes, ratesRes] = await Promise.all([
          fetch(`${backendUrl}/api/JobCostLedger`),
          fetch(`${backendUrl}/api/TrialBalance/scheduleDA_cost?fyCd=${year}`),
        ]);

        const ledgerData = await ledgerRes.json();
        const ratesData = await ratesRes.json();

        // EXACT SAME RATE EXTRACTION AS SCHED H
        let rates = {
          fringe: 0,
          aeroFringe: 0,
          custOH: 0,
          colOH: 0,
          smh: 0,
          ga: 0,
        };

        if (ratesData && ratesData.schedules) {
          ratesData.schedules.forEach((schedule) => {
            let rawRate = parseFloat(schedule.rate) || 0;
            let percentForm = rawRate > 1 ? rawRate : rawRate * 100;
            percentForm = Math.round(percentForm * 100) / 100;
            const r = percentForm / 100; // Ready for math (e.g., 0.3333)

            if (
              schedule.name.includes("Fringe Pool") ||
              schedule.name === "Fringe"
            )
              rates.fringe = r;
            else if (schedule.name.includes("AERO Fringe"))
              rates.aeroFringe = r;
            else if (schedule.name.includes("Customer Site Overhead"))
              rates.custOH = r;
            else if (schedule.name.includes("Off - Site Overhead"))
              rates.colOH = r;
            else if (schedule.name.includes("Subk & Material Handling"))
              rates.smh = r;
            else if (schedule.name.includes("General and Administrative"))
              rates.ga = r;
          });
        }

        const categories = {
          "Cost-Type": {
            laborOnsite: 0,
            laborOffsite: 0,
            laborAero: 0,
            material: 0,
            odc: 0,
            subcontracts: 0,
            unburden: 0,
            travel: 0,
          },
          "Flexibly Priced": {
            laborOnsite: 0,
            laborOffsite: 0,
            laborAero: 0,
            material: 0,
            odc: 0,
            subcontracts: 0,
            unburden: 0,
            travel: 0,
          },
          "T&M": {
            laborOnsite: 0,
            laborOffsite: 0,
            laborAero: 0,
            material: 0,
            odc: 0,
            subcontracts: 0,
            unburden: 0,
            travel: 0,
          },
          "Fixed Price": {
            laborOnsite: 0,
            laborOffsite: 0,
            laborAero: 0,
            material: 0,
            odc: 0,
            subcontracts: 0,
            unburden: 0,
            travel: 0,
          },
          Commercial: {
            laborOnsite: 0,
            laborOffsite: 0,
            laborAero: 0,
            material: 0,
            odc: 0,
            subcontracts: 0,
            unburden: 0,
            travel: 0,
          },
          "IR&D&BP": {
            laborOnsite: 0,
            laborOffsite: 0,
            laborAero: 0,
            material: 0,
            odc: 0,
            subcontracts: 0,
            unburden: 0,
            travel: 0,
          },
        };

        // LEDGER ACCUMULATION
        // FIX (Bug 2): added the "COST" check so classification matches SchedH.js's
        // Section A test (pt.includes("CPFF") || pt.includes("COST") || pt.includes("CPAF")).
        // Previously "COST"-only project types fell through to "Flexibly Priced" here
        // while landing in Section A ("Cost-Type") in SchedH.js.
        ledgerData
          .filter((row) => Number(row.year) === year)
          .forEach((row) => {
            const pt = (row.projType || "").toUpperCase();
            let cat = "Flexibly Priced";

            if (
              pt.includes("CPFF") ||
              pt.includes("COST") ||
              pt.includes("CPAF")
            )
              cat = "Cost-Type";
            else if (pt === "T&M" || pt.includes("T&M")) cat = "T&M";
            else if (pt.includes("FIXED") || pt === "FFP") cat = "Fixed Price";
            else if (pt.includes("COMMERCIAL")) cat = "Commercial";
            else if (pt.includes("IR&D") || pt.includes("B&P")) cat = "IR&D&BP";

            const amount = parseFloat(row.amount) || 0;

            if (
              row.acctId === "50-00-01" ||
              row.acctId === "50-00-98" ||
              row.acctId === "59-00-01"
            ) {
              if (row.orgId === "1.1.01" || row.acctId === "59-00-01") {
                categories[cat].laborAero += amount;
              } else {
                categories[cat].laborOnsite += amount;
              }
            } else if (row.acctId === "50-00-02") {
              categories[cat].laborOffsite += amount;
            } else if (
              row.acctId &&
              (row.acctId.startsWith("50-40") || row.acctId.startsWith("59-40"))
            ) {
              categories[cat].travel += amount;
            } else if (
              ["50-30-01", "50-31-01", "50-31-02"].includes(row.acctId)
            ) {
              categories[cat].material += amount;
            } else if (
              ["50-50-01", "50-50-02", "50-50-03", "59-50-01"].includes(
                row.acctId,
              )
            ) {
              categories[cat].odc += amount;
            } else if (
              [
                "50-21-01",
                "50-21-02",
                "50-21-03",
                "50-21-04",
                "50-22-01",
              ].includes(row.acctId)
            ) {
              categories[cat].subcontracts += amount;
            } else if (
              ["50-22-02", "50-22-03", "50-22-05"].includes(row.acctId)
            ) {
              categories[cat].unburden += amount;
            }
          });

        const catBases = {};
        const baseTotals = { onsite: 0, offsite: 0, smh: 0, ga: 0 };

        // MATH LOGIC — aligned with SchedH.js
        for (const [cat, rawItem] of Object.entries(categories)) {
          // Round direct inputs to eliminate cent drift
          const item = {
            laborOnsite: Math.round(rawItem.laborOnsite),
            laborOffsite: Math.round(rawItem.laborOffsite),
            laborAero: Math.round(rawItem.laborAero),
            travel: Math.round(rawItem.travel),
            material: Math.round(rawItem.material),
            odc: Math.round(rawItem.odc),
            subcontracts: Math.round(rawItem.subcontracts),
            unburden: Math.round(rawItem.unburden),
          };

          const totalLabor =
            item.laborOnsite + item.laborOffsite + item.laborAero;

          // Calculate rounded Fringes
          const fringeOnsite = Math.round(item.laborOnsite * rates.fringe);
          const fringeOffsite = Math.round(item.laborOffsite * rates.fringe);
          const fringeAero = Math.round(item.laborAero * rates.aeroFringe);

          // FIX (Bug 1): removed the Cost-Type/T&M special case that excluded fringe
          // from the OH-onsite base. SchedH.js always includes fringe in this base:
          //   ohOnsite = (laborOnsite + fringeOnsite + laborAero + fringeAero) * custOH
          // The old code here dropped fringeOnsite/fringeAero for Cost-Type & T&M,
          // which silently shrank ohOnsite (and therefore gaBase) for those categories
          // relative to Schedule H. If that carve-out is actually required by your
          // rate agreement, it needs to be added to SchedH.js too — not just here.
          // const ohOnsiteBase = item.laborOnsite + fringeOnsite + item.laborAero + fringeAero;
          //         const ohOnsiteBase = (cat === "Cost-Type" || cat === "T&M")
          // ? item.laborOnsite + item.laborAero
          // : item.laborOnsite + fringeOnsite + item.laborAero + fringeAero;

          //         const ohOffsiteBase = item.laborOffsite;
          //         const smhBase = item.material + item.subcontracts;

          //         // Calculate rounded Overheads
          //         const ohOnsite = Math.round(ohOnsiteBase * rates.custOH);
          //         const ohOffsite = Math.round(ohOffsiteBase * rates.colOH);
          //         const ohSMH = Math.round(smhBase * rates.smh);

          //         const totalDirectCosts = totalLabor + item.travel + item.material + item.odc + item.subcontracts + item.unburden;
          //         const totalIndirectCosts = fringeOnsite + fringeOffsite + fringeAero + ohOnsite + ohOffsite + ohSMH;
          //         const directPlusOH = totalDirectCosts + totalIndirectCosts;

          //         // G&A BASE VALUE ADDED — matches SchedH.js
          //         const gaBase = directPlusOH - (item.material + item.subcontracts + item.unburden + ohSMH);

          //         catBases[cat] = { ohOnsiteBase, ohOffsiteBase, smhBase, gaBase };

          // Base shown in the OH-Onsite column (Cost-Type/T&M exclude fringe)
          const ohOnsiteBaseDisplay =
            cat === "Cost-Type" || cat === "T&M"
              ? item.laborOnsite + item.laborAero
              : item.laborOnsite + fringeOnsite + item.laborAero + fringeAero;

          // Base fed into the G&A chain — always full, matches SchedH.js
          const ohOnsiteBaseForGA =
            item.laborOnsite + fringeOnsite + item.laborAero + fringeAero;

          const ohOffsiteBase = item.laborOffsite;
          const smhBase = item.material + item.subcontracts;

          // Rounded Overheads
          const ohOnsiteDisplay = Math.round(
            ohOnsiteBaseDisplay * rates.custOH,
          );
          const ohOnsiteForGA = Math.round(ohOnsiteBaseForGA * rates.custOH);
          const ohOffsite = Math.round(
            (ohOffsiteBase + fringeOffsite) * rates.colOH,
          );
          const ohSMH = Math.round(smhBase * rates.smh);

          const totalDirectCosts =
            totalLabor +
            item.travel +
            item.material +
            item.odc +
            item.subcontracts +
            item.unburden;
          const totalIndirectCosts =
            fringeOnsite +
            fringeOffsite +
            fringeAero +
            ohOnsiteForGA +
            ohOffsite +
            ohSMH;
          const directPlusOH = totalDirectCosts + totalIndirectCosts;

          const gaBase =
            directPlusOH -
            (item.material + item.subcontracts + item.unburden + ohSMH);

          catBases[cat] = {
            ohOnsiteBase: ohOnsiteBaseDisplay,
            ohOffsiteBase,
            smhBase,
            gaBase,
          };

          baseTotals.onsite += ohOnsiteBaseDisplay;
          baseTotals.offsite += ohOffsiteBase;
          baseTotals.smh += smhBase;
          baseTotals.ga += gaBase;
        }

        const formatAmt = (val) =>
          val === 0 ? "-" : Math.round(val).toLocaleString();
        const formatPct = (val, total) =>
          total === 0 ? "0.0%" : ((val / total) * 100).toFixed(1) + "%";

        const newRows = initialRows.slice(0, -1).map((r) => {
          const cb = catBases[r.type] || {
            ohOnsiteBase: 0,
            ohOffsiteBase: 0,
            smhBase: 0,
            gaBase: 0,
          };
          return {
            ...r,
            onsiteAmount: formatAmt(cb.ohOnsiteBase),
            onsitePct: formatPct(cb.ohOnsiteBase, baseTotals.onsite),
            offsiteAmount: formatAmt(cb.ohOffsiteBase),
            offsitePct: formatPct(cb.ohOffsiteBase, baseTotals.offsite),
            smhAmount: formatAmt(cb.smhBase),
            smhPct: formatPct(cb.smhBase, baseTotals.smh),
            gaAmount: formatAmt(cb.gaBase),
            gaPct: formatPct(cb.gaBase, baseTotals.ga),
          };
        });

        newRows.push({
          type: "Total",
          onsiteAmount: formatAmt(baseTotals.onsite),
          onsitePct: baseTotals.onsite === 0 ? "0.0%" : "100.0%",
          offsiteAmount: formatAmt(baseTotals.offsite),
          offsitePct: baseTotals.offsite === 0 ? "0.0%" : "100.0%",
          smhAmount: formatAmt(baseTotals.smh),
          smhPct: baseTotals.smh === 0 ? "0.0%" : "100.0%",
          gaAmount: formatAmt(baseTotals.ga),
          gaPct: baseTotals.ga === 0 ? "0.0%" : "100.0%",
          ref: "",
          total: true,
        });

        setRows(newRows);
      } catch (error) {
        console.error("Failed to load Schedule H-1 Data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full overflow-x-auto bg-[#f3f3f5] font-serif text-black">
      <div className="relative min-h-[617px] min-w-[1180px] border border-[#b8b8b8] bg-[#f3f3f5]">
        {/* Top links */}
        <div className="absolute left-[5px] top-[3px] text-[16px] leading-[20px]">
          <div>Schedule H-1 is linked to the following schedules:</div>
          <button
            type="button"
            onClick={() => onNavigate?.("sched_h")}
            className="block text-left text-[#00158f] underline hover:opacity-80 cursor-pointer"
          >
            Schedule H, Contract Costs
          </button>
          <div className="mt-[4px] text-[13px] text-[#00158f] underline">
            ICE MANUAL
          </div>
        </div>

        {/* Right heading */}
        <div className="absolute left-[975px] top-[5px] w-[220px] text-center text-[16px] font-bold leading-[20px]">
          <div>Schedule H-1</div>
          <div>ICE (version 2.0.1h)</div>
        </div>

        {/* Company/title area */}
        <div className="absolute left-[132px] top-[69px] w-[825px] text-center">
          <div className="h-[44px] bg-[#fff200] pt-[5px] text-[17px] font-bold leading-[20px]">
            <div>{companyName}</div>
            <div>{companyAddress}</div>
          </div>

          <div className="pt-[2px] text-[17px] font-bold leading-[23px]">
            <div>Subsidiary Schedule of</div>
            <div>Government Participation Percentages</div>
          </div>

          <div className="mt-[1px] h-[25px] bg-[#fff200] text-[17px] font-bold leading-[25px]">
            Fiscal Year End - {fiscalYearEnd}
          </div>
        </div>

        {/* Main table */}
        <div className="absolute left-[4px] top-[222px]">
          <div className="grid grid-cols-[118px_225px_225px_225px_220px_110px] gap-x-[12px]">
            {/* Contract type */}
            <div className="pt-[46px]">
              <div className="relative -top-[7px] h-[22px] whitespace-nowrap border-b border-black pl-[2px] text-[17px] font-bold leading-[22px]">
                Contract Type
              </div>

              {rows.map((row, index) => (
                <div
                  key={row.type}
                  className={[
                    "flex items-center whitespace-nowrap pl-[2px] text-[17px]",
                    row.total ? "h-[26px] font-bold" : "",
                    index === 0 ? "h-[26px]" : "",
                    index === 1 ? "h-[26px]" : "",
                    index === 2 ? "h-[26px]" : "",
                    index === 3 ? "h-[26px]" : "",
                    index === 4 ? "h-[26px]" : "",
                    index === 5 ? "h-[26px]" : "",
                  ].join(" ")}
                >
                  {row.type}
                </div>
              ))}
            </div>

            {/* OH Onsite */}
            <div>
              <div className="h-[23px] bg-[#fff200] text-center text-[18px] font-bold leading-[23px]">
                OH - Onsite
              </div>
              <div className="grid grid-cols-[112px_100px] gap-x-[12px]">
                <div>
                  <div className="h-[44px] text-center text-[17px] font-bold leading-[22px]">
                    <div>Overhead</div>
                    <div>Base Amount</div>
                  </div>
                  {rows.map((row) => (
                    <AmountCell key={row.type} total={row.total}>
                      {row.onsiteAmount}
                    </AmountCell>
                  ))}
                </div>
                <div>
                  <div className="h-[44px] text-center text-[17px] font-bold leading-[44px]">
                    %
                  </div>
                  {rows.map((row) => (
                    <PercentCell key={row.type} total={row.total}>
                      {row.onsitePct}
                    </PercentCell>
                  ))}
                </div>
              </div>
            </div>

            {/* OH Offsite */}
            <div>
              <div className="h-[23px] bg-[#fff200] text-center text-[18px] font-bold leading-[23px]">
                OH - Offsite
              </div>
              <div className="grid grid-cols-[112px_100px] gap-x-[12px]">
                <div>
                  <div className="h-[44px] text-center text-[17px] font-bold leading-[22px]">
                    <div>Overhead</div>
                    <div>Base Amount</div>
                  </div>
                  {rows.map((row) => (
                    <AmountCell key={row.type} total={row.total}>
                      {row.offsiteAmount}
                    </AmountCell>
                  ))}
                </div>
                <div>
                  <div className="h-[44px] text-center text-[17px] font-bold leading-[44px]">
                    %
                  </div>
                  {rows.map((row) => (
                    <PercentCell key={row.type} total={row.total}>
                      {row.offsitePct}
                    </PercentCell>
                  ))}
                </div>
              </div>
            </div>

            {/* SM&H */}
            <div>
              <div className="h-[23px] bg-[#fff200] text-center text-[18px] font-bold leading-[23px]">
                SM&amp;H
              </div>
              <div className="grid grid-cols-[112px_100px] gap-x-[12px]">
                <div>
                  <div className="h-[44px] text-center text-[17px] font-bold leading-[22px]">
                    <div>Overhead</div>
                    <div>Base Amount</div>
                  </div>
                  {rows.map((row) => (
                    <AmountCell key={row.type} total={row.total}>
                      {row.smhAmount}
                    </AmountCell>
                  ))}
                </div>
                <div>
                  <div className="h-[44px] text-center text-[17px] font-bold leading-[44px]">
                    %
                  </div>
                  {rows.map((row) => (
                    <PercentCell key={row.type} total={row.total}>
                      {row.smhPct}
                    </PercentCell>
                  ))}
                </div>
              </div>
            </div>

            {/* G&A */}
            <div className="pt-[23px]">
              <div className="grid grid-cols-[112px_100px] gap-x-[12px]">
                <div>
                  <div className="h-[44px] text-center text-[17px] font-bold leading-[22px]">
                    <div>G&amp;A</div>
                    <div>Base Amount</div>
                  </div>
                  {rows.map((row) => (
                    <AmountCell key={row.type} total={row.total}>
                      {row.gaAmount}
                    </AmountCell>
                  ))}
                </div>
                <div>
                  <div className="h-[44px] text-center text-[17px] font-bold leading-[44px]">
                    %
                  </div>
                  {rows.map((row) => (
                    <PercentCell key={row.type} total={row.total}>
                      {row.gaPct}
                    </PercentCell>
                  ))}
                </div>
              </div>
            </div>

            {/* References */}
            <div className="pt-[23px]">
              <div className="h-[44px] text-center text-[17px] font-bold leading-[44px]">
                Ref.
              </div>
              {rows.map((row) => (
                <div
                  key={row.type}
                  className="flex h-[26px] items-center justify-center text-[17px]"
                >
                  {row.ref === "SCHED H" ? (
                    <ReferenceBox
                      targetTab="sched_h"
                      onClick={() => onNavigate && onNavigate("sched_h")}
                      className="!h-[23px] !w-[110px] !bg-[#29258f] !text-[17px] leading-[23px]"
                    >
                      SCHED H
                    </ReferenceBox>
                  ) : (
                    row.ref
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute left-[4px] top-[513px] w-[241px]">
          <div className="h-[23px] bg-[#fff200] pl-[3px] text-[16px] leading-[23px]">
            Linked to Other Worksheet
          </div>
          <div className="mt-[20px] h-[26px] bg-[#2bbec3] pl-[3px] text-[16px] leading-[26px]">
            Cell Contains a Formula
          </div>
        </div>
      </div>
    </div>
  );
}
