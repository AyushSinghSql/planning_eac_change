// import React from "react";

// const companyName = "Revolve";
// const fiscalYearEnd = "12/31/2025";

// const scheduleASections = [
//   {
//     title: "Customer Site Overhead",
//     pool: "20,00,082",
//     base: "2,85,48,651",
//     rateLabel: "OH RATE",
//     rate: "7.01%",
//     reference: "SCHED C (1)",
//     reference2: "SCHEDULE E",
//     targetTab: "sched_c1",
//     targetTab2: "sched_e",
//   },
//   {
//     title: null,
//     pool: "37,961",
//     base: "21,93,346",
//     rateLabel: "OH RATE",
//     rate: "1.73%",
//     reference: "SCHED C (2)",
//     reference2: "SCHEDULE E",
//     targetTab: "sched_c2",
//     targetTab2: "sched_e",
//   },
//   {
//     title: "Subk & Material Handling",
//     pool: "6,11,410",
//     base: "2,52,34,954",
//     rateLabel: "OH RATE",
//     rate: "2.42%",
//     reference: "SCHED C (6)",
//     reference2: "SCHEDULE E",
//     targetTab: "sched_c6",
//     targetTab2: "sched_e",
//   },
//   {
//     title: "General and Administrative (G&A) Expenses",
//     pool: "43,76,323",
//     base: "3,37,01,034",
//     rateLabel: "G&A RATE",
//     rate: "12.99%",
//     reference: "SCHED B",
//     reference2: "SCHEDULE E",
//     targetTab: "sched_b",
//     targetTab2: "sched_e",
//   },
//   {
//     title: "Fringe Pool",
//     pool: "87,48,308",
//     base: "2,62,47,710",
//     rateLabel: "FRINGE RATE",
//     rate: "33.33%",
//     reference: "FRINGE",
//     targetTab: "sched_fringe",
//   },
//   {
//     title: "AERO Fringe",
//     pool: "1,87,453",
//     base: "5,58,681",
//     rateLabel: "AERO FRINGE RATE",
//     rate: "33.67%",
//     reference: "SCHED D (1)",
//     targetTab: "sched_d1",
//   },
//   {
//     title: "California Intermediate",
//     pool: "21,47,494",
//     base: "3,07,46,925",
//     rateLabel: "RATE",
//     rate: "6.98%",
//     reference: "SCHED D (2)",
//     targetTab: "sched_d2",
//   },
// ];

// function RateSection({ section, onNavigate }) {
//   return (
//     <div className="grid grid-cols-[minmax(250px,1fr)_minmax(145px,180px)_minmax(145px,180px)] gap-0 items-stretch">
//       {/* Cost element / labels */}
//       <div className="pr-4">
//         {section.title ? (
//           <div className="inline-block bg-yellow-300 px-1 py-0.5 text-sm font-semibold text-black underline decoration-1">
//             {section.title}
//           </div>
//         ) : (
//           <div className="h-6" />
//         )}

//         <div className="text-sm leading-5 text-black">POOL</div>
//         <div className="text-sm leading-5 text-black">BASE</div>
//         <div className="text-sm leading-5 text-black">{section.rateLabel}</div>
//       </div>

//       {/* Claimed values */}
//       <div className="text-right text-sm">
//         <div className="h-6" />

//         <div className="bg-yellow-200 px-2 py-0.5 leading-5 text-black">
//           {section.pool}
//         </div>

//         <div className="bg-yellow-200 px-2 py-0.5 leading-5 text-black">
//           {section.base}
//         </div>

//         <div className="bg-cyan-300 px-2 py-0.5 leading-5 font-medium text-black">
//           {section.rate}
//         </div>
//       </div>

//       {/* Reference Badges - Made Clickable */}
//       <div className="pl-8 flex items-start">
//         <div className="pt-3 flex flex-col items-start gap-0.5">
//           {section.reference && (
//             <button
//               type="button"
//               onClick={() =>
//                 section.targetTab && onNavigate?.(section.targetTab)
//               }
//               className="inline-block bg-blue-700 hover:bg-blue-800 cursor-pointer px-3 py-1 text-xs font-semibold text-white underline whitespace-nowrap transition-colors"
//             >
//               {section.reference}
//             </button>
//           )}

//           {section.reference2 && (
//             <button
//               type="button"
//               onClick={() =>
//                 section.targetTab2 && onNavigate?.(section.targetTab2)
//               }
//               className="inline-block bg-blue-700 hover:bg-blue-800 cursor-pointer px-3 py-1 text-xs font-semibold text-white underline whitespace-nowrap transition-colors"
//             >
//               {section.reference2}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function SchedA({ onNavigate }) {
//   return (
//     <div className="w-full min-h-full bg-white text-black">
//       {/* Sheet heading */}
//       <div className="bg-yellow-300 py-1 text-center text-sm font-bold">
//         {companyName}
//       </div>

//       <div className="bg-yellow-300 py-1 text-center text-sm font-bold">
//         California
//       </div>
//       <div className="relative mb-5 min-h-[105px]">
//         <div className="absolute right-0 top-0">
//           <div className="text-base font-bold leading-5">SCHEDULE A</div>
//           <div className="text-sm font-semibold">ICE (version 2.0.1h)</div>
//         </div>

//         <div className="pt-1">
//           <div className="text-sm leading-5">
//             Schedule A is linked to the following
//           </div>
//           <div className="mt-1 text-xs leading-4">schedules:</div>

//           <div className="text-xs leading-4">Schedule C, Overhead</div>
//           <button
//             onClick={() => onNavigate("sched_c1")}
//             className="block text-xs leading-4 hover:underline cursor-pointer text-left"
//           >
//             Schedule C, Overhead
//           </button>
//           <div className="text-xs leading-4">Schedule B, G&amp;A</div>
//           <div className="text-xs leading-4">Schedule D, Occupancy</div>
//           <div className="text-xs leading-4">Schedule E, Cost of Money</div>
//           <div className="text-xs leading-4">Schedule E, Bases</div>

//           <div className="mt-3 text-xs text-blue-700 underline cursor-default">
//             ICE MANUAL
//           </div>
//         </div>

//         <div className="absolute left-1/2 top-[70px] -translate-x-1/2 text-center">
//           <div className="text-sm font-bold whitespace-nowrap">
//             Summary of all Claimed Indirect Rates
//           </div>
//           <div className="mt-0.5 w-[325px] bg-yellow-300 px-2 py-1 text-sm font-bold">
//             Fiscal Year End - {fiscalYearEnd}
//           </div>
//         </div>
//       </div>

//       {/* Column headings */}
//       <div className="grid grid-cols-[minmax(250px,1fr)_minmax(145px,180px)_minmax(145px,180px)] border-b border-black mb-3">
//         <div className="text-sm font-bold underline">COST ELEMENT</div>
//         <div className="text-sm font-bold underline text-center">CLAIMED</div>
//         <div className="text-sm font-bold underline text-left pl-8">
//           REFERENCE
//         </div>
//       </div>

//       {/* Schedule data */}
//       <div className="space-y-5">
//         {scheduleASections.map((section, index) => (
//           <RateSection
//             key={`${section.title || "section"}-${index}`}
//             section={section}
//             onNavigate={onNavigate}
//           />
//         ))}
//       </div>

//       {/* Excel legend */}
//       <div className="mt-10 space-y-2">
//         <div className="w-fit bg-yellow-300 px-1 text-xs">
//           Imported from Other Worksheet
//         </div>

//         <div className="w-fit bg-cyan-300 px-1 text-xs">
//           Cell Contains a Formula
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { backendUrl } from "../config";

// Static mapping structure for references and target tabs
const SECTION_METADATA = [
  {
    apiKey: "Customer Site Overhead",
    title: "Customer Site Overhead",
    rateLabel: "OH RATE",
    reference: "SCHED C (1)",
    reference2: "SCHEDULE E",
    targetTab: "sched_c1",
    targetTab2: "sched_e",
  },
  {
    apiKey: "Off - Site Overhead",
    title: "Off - Site Overhead",
    rateLabel: "OH RATE",
    reference: "SCHED C (2)",
    reference2: "SCHEDULE E",
    targetTab: "sched_c2",
    targetTab2: "sched_e",
  },
  {
    apiKey: "Subk & Material Handling",
    title: "Subk & Material Handling",
    rateLabel: "OH RATE",
    reference: "SCHED C (6)",
    reference2: "SCHEDULE E",
    targetTab: "sched_c6",
    targetTab2: "sched_e",
  },
  {
    apiKey: "General and Administrative (G&A) Expenses",
    title: "General and Administrative (G&A) Expenses",
    rateLabel: "G&A RATE",
    reference: "SCHED B",
    reference2: "SCHEDULE E",
    targetTab: "sched_b",
    targetTab2: "sched_e",
  },
  {
    apiKey: "Fringe Pool",
    title: "Fringe Pool",
    rateLabel: "FRINGE RATE",
    reference: "FRINGE",
    targetTab: "sched_fringe",
  },
  {
    apiKey: "AERO Fringe",
    title: "AERO Fringe",
    rateLabel: "AERO FRINGE RATE",
    reference: "SCHED D (1)",
    targetTab: "sched_d1",
  },
  {
    apiKey: "California Intermediate",
    title: "California Intermediate",
    rateLabel: "RATE",
    reference: "SCHED D (2)",
    targetTab: "sched_d2",
  },
];

const formatCurrency = (val) => {
  if (val === null || val === undefined || isNaN(val)) return "0";
  return val.toLocaleString("en-US");
};

const formatPercent = (val) => {
  if (val === null || val === undefined || isNaN(val)) return "0.00%";
  return `${Number(val).toFixed(2)}%`;
};

function RateSection({ section, onNavigate }) {
  return (
    <div className="grid grid-cols-[minmax(250px,1fr)_minmax(145px,180px)_minmax(145px,180px)] gap-0 items-stretch">
      {/* Cost element / labels */}
      <div className="pr-4">
        {section.title ? (
          <div className="inline-block bg-[#ffff00] px-1 py-0.5 text-sm font-semibold text-black underline decoration-1">
            {section.title}
          </div>
        ) : (
          <div className="h-6" />
        )}

        <div className="text-sm leading-5 text-black">POOL</div>
        <div className="text-sm leading-5 text-black">BASE</div>
        <div className="text-sm leading-5 text-black">{section.rateLabel}</div>
      </div>

      {/* Claimed values */}
      <div className="text-right text-sm">
        <div className="h-6" />

        <div className="bg-[#ffff00] px-2 py-0.5 leading-5 text-black">
          {formatCurrency(section.pool)}
        </div>

        <div className="bg-[#ffff00] px-2 py-0.5 leading-5 text-black">
          {formatCurrency(section.base)}
        </div>

        <div className="bg-cyan-300 px-2 py-0.5 leading-5 font-medium text-black">
          {formatPercent(section.rate)}
        </div>
      </div>

      {/* Reference Badges - Clickable Navigation */}
      <div className="pl-8 flex items-start">
        <div className="pt-3 flex flex-col items-start gap-0.5">
          {section.reference && (
            <button
              type="button"
              onClick={() =>
                section.targetTab && onNavigate?.(section.targetTab)
              }
              className="inline-block bg-blue-700 hover:bg-blue-800 cursor-pointer px-3 py-1 text-xs font-semibold text-white underline whitespace-nowrap transition-colors"
            >
              {section.reference}
            </button>
          )}

          {section.reference2 && (
            <button
              type="button"
              onClick={() =>
                section.targetTab2 && onNavigate?.(section.targetTab2)
              }
              className="inline-block bg-blue-700 hover:bg-blue-800 cursor-pointer px-3 py-1 text-xs font-semibold text-white underline whitespace-nowrap transition-colors"
            >
              {section.reference2}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SchedA({
  onNavigate,
  companyName,
  companyAddress,
  year,
  fiscalYearEnd,
}) {
  // const fiscalYearEnd = fiscalYearEnd;
  const [scheduleASections, setScheduleASections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${backendUrl}/api/TrialBalance/scheduleDA_cost?fyCd=${year}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP Error status: ${response.status}`);
        }

        const data = await response.json();
        const apiSchedules = data.schedules || [];

        // Map API response with static metadata
        const mappedSections = SECTION_METADATA.map((meta) => {
          const matchedItem = apiSchedules.find(
            (item) => item.name?.toLowerCase() === meta.apiKey.toLowerCase(),
          );

          return {
            ...meta,
            pool: matchedItem ? matchedItem.pool : 0,
            base: matchedItem ? matchedItem.base : 0,
            rate: matchedItem ? matchedItem.rate : 0,
          };
        });

        setScheduleASections(mappedSections);
      } catch (err) {
        console.error("Failed to fetch Schedule DA data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full min-h-full bg-white text-black p-4">
      {/* Sheet heading */}
      <div className="bg-[#ffff00] py-1 text-center text-sm font-bold">
        {companyName}
      </div>

      <div className="bg-[#ffff00] py-1 text-center text-sm font-bold">
        {companyAddress}
      </div>

      <div className="relative mb-5 min-h-[105px]">
        <div className="absolute right-0 top-0">
          <div className="text-base font-bold leading-5">SCHEDULE A</div>
          <div className="text-sm font-semibold">ICE (version 2.0.1h)</div>
        </div>

        <div className="pt-1">
          <div className="text-sm leading-5">
            Schedule A is linked to the following
          </div>
          <div className="mt-1 text-xs leading-4">schedules:</div>

          <button
            type="button"
            onClick={() => onNavigate?.("sched_c1")}
            className="block text-xs leading-4 hover:underline cursor-pointer text-left text-blue-700 font-medium"
          >
            Schedule C, Overhead
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.("sched_b")}
            className="block text-xs leading-4 hover:underline cursor-pointer text-left text-blue-700 font-medium"
          >
            Schedule B, G&amp;A
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.("sched_d1")}
            className="block text-xs leading-4 hover:underline cursor-pointer text-left text-blue-700 font-medium"
          >
            Schedule D, Occupancy
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.("sched_e")}
            className="block text-xs leading-4 hover:underline cursor-pointer text-left text-blue-700 font-medium"
          >
            Schedule E, Cost of Money
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.("sched_e")}
            className="block text-xs leading-4 hover:underline cursor-pointer text-left text-blue-700 font-medium"
          >
            Schedule E, Bases
          </button>

          <div className="mt-3 text-xs text-blue-700 underline cursor-default">
            ICE MANUAL
          </div>
        </div>

        <div className="absolute left-1/2 top-[70px] -translate-x-1/2 text-center">
          <div className="text-sm font-bold whitespace-nowrap">
            Summary of all Claimed Indirect Rates
          </div>
          <div className="mt-0.5 w-[325px] bg-[#ffff00] px-2 py-1 text-sm font-bold">
            Fiscal Year End - {fiscalYearEnd}
          </div>
        </div>
      </div>

      {/* Column headings */}
      <div className="grid grid-cols-[minmax(250px,1fr)_minmax(145px,180px)_minmax(145px,180px)] border-b border-black mb-3">
        <div className="text-sm font-bold underline">COST ELEMENT</div>
        <div className="text-sm font-bold underline text-center">CLAIMED</div>
        <div className="text-sm font-bold underline text-left pl-8">
          REFERENCE
        </div>
      </div>

      {/* Schedule data */}
      {loading ? (
        <div className="py-6 text-center font-semibold text-gray-600">
          Loading Schedule A data...
        </div>
      ) : error ? (
        <div className="py-6 text-center font-semibold text-red-600">
          Error loading data: {error}
        </div>
      ) : (
        <div className="space-y-5">
          {scheduleASections.map((section, index) => (
            <RateSection
              key={`${section.apiKey}-${index}`}
              section={section}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}

      {/* Excel legend */}
      <div className="mt-10 space-y-2">
        <div className="w-fit bg-[#ffff00] px-1 text-xs">
          Imported from Other Worksheet
        </div>

        <div className="w-fit bg-cyan-300 px-1 text-xs">
          Cell Contains a Formula
        </div>
      </div>
    </div>
  );
}
