// import React, { useEffect, useState, useMemo, useRef } from "react";
// import { toast } from "react-toastify";
// import { backendUrl } from "./config";
// import {
//   UsersIcon,
//   CreditCardIcon,
//   ChartBarIcon,
// } from "@heroicons/react/24/solid";
// import axios from "axios";

// const POOL_ROWS = [
//   { key: "Fringe", label: "Fringe" },
//   { key: "OH-Off Site   ", label: "OH-Off Site Lanham" },
//   { key: "OH-On Site Lanham", label: "OH-On Site Lanham" },
//   { key: "Material Handling Fee", label: "Material Handling Fee" },
//   { key: "G&A", label: "G&A" },
// ];

// const ROW_HEIGHT_DEFAULT = 24;
// const geistSansStyle = {
//   fontFamily: "'Geist', 'Geist Fallback', sans-serif",
// };

// const ProjectPoolCosts = ({
//   refreshKey,
//   planId,
//   startDate,
//   endDate,
//   fiscalYear,
//   planType,
//   hoursColumnTotals, // from Hours screen: { "1_2025_cost": 45631.08, ... }
//   otherColumnTotals, // from Non-Labor: { "1_2025": 800, ... }
//   refreshCalculation,
//   allForcastData,
//   loadingPools,
//   templateId,
// }) => {
//   const usePrevious = (value) => {
//     const ref = useRef();
//     useEffect(() => {
//       ref.current = value;
//     });
//     return ref.current;
//   };

//   const prevRefresh = usePrevious(refreshCalculation); // track previous value
//   const [durations, setDurations] = useState([]);
//   const [aggregatedData, setAggregatedData] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [poolDefinitions, setPoolDefinitions] = useState([]);

//   const leftTableRef = useRef(null);
//   const rightTableRef = useRef(null);
//   const scrollingLock = useRef(false);

//   useEffect(() => {
//     const fetchPools = async () => {
//       const tid = templateId;
//       if (!tid) return;

//       try {
//         const res = await axios.get(
//           `${backendUrl}/Orgnization/GetPoolsByTemplateId?templateId=${tid}`,
//         );

//         const rawPoolList = Array.isArray(res.data) ? res.data : [];

//         // Apply your specific filtering logic
//         const filteredPools = rawPoolList.filter(
//           (pool) =>
//             !["FRINGEONGNA", "OVERHEADONGNA", "FRINGEONOVERHEAD"].includes(
//               pool.poolId,
//             ),
//         );

//         setPoolDefinitions(filteredPools);
//       } catch (err) {
//         console.error("Error fetching pools:", err);
//         toast.error("Failed to load pool definitions");
//       }
//     };

//     fetchPools();
//   }, []);

//   const POOL_ROWS = useMemo(() => {
//     return poolDefinitions.map((p) => ({
//       key: p.groupName, // e.g., "OVERHEAD"
//       label: p.groupName, // e.g., "Overhead"
//     }));
//   }, [poolDefinitions]);

//   const normalizedFiscalYear =
//     fiscalYear === "All" || !fiscalYear ? "All" : String(fiscalYear).trim();

//   const syncScroll = (sourceRef, targetRef) => {
//     if (!sourceRef.current || !targetRef.current) return;
//     if (!scrollingLock.current) {
//       scrollingLock.current = true;
//       targetRef.current.scrollTop = sourceRef.current.scrollTop;
//       setTimeout(() => {
//         scrollingLock.current = false;
//       }, 0);
//     }
//   };

//   const [monthlyApiData, setMonthlyApiData] = useState([]);

//   const fetchAllData = async () => {
//     if (!planId || !startDate || !endDate) return;
//     setIsLoading(true);

//     try {
//       const monthlyRes = await axios.get(
//         `${backendUrl}/Forecast/GetMonthlyDataV1?planID=${planId}&planType=${planType}`,
//       );
//       const monthlyData = Array.isArray(monthlyRes.data) ? monthlyRes.data : [];
//       const durationFromMonthly = monthlyData.map((m) => ({
//         year: m.year,
//         monthNo: m.monthNo ?? m.month,
//         month: new Date(m.year, (m.monthNo ?? m.month) - 1).toLocaleString(
//           "en-US",
//           {
//             month: "short",
//             year: "numeric",
//           },
//         ),
//       }));
//       setDurations(durationFromMonthly);
//       setMonthlyApiData(monthlyData);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load pool cost data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!monthlyApiData || monthlyApiData.length === 0) {
//       setAggregatedData({});
//       return;
//     }

//     const result = {};

//     console.log(monthlyApiData);

//     monthlyApiData.forEach((item) => {
//       // IMPORTANT: JSON uses 'month', JSX often uses 'monthNo'.
//       // We normalize here to ensure the key is consistent.
//       const m = item.month || item.monthNo;
//       const key = `${m}_${item.year}`;

//       const flattenedRow = {
//         laborCost: Number(item.laborCost) || 0,
//         nonLaborCost: Number(item.nonLaborCost) || 0,
//         revenue: Number(item.revenue) || 0,
//         hours: Number(item.hours) || 0,
//       };

//       // Map indirect costs directly to keys that match POOL_ROWS
//       if (item.indirectCost && Array.isArray(item.indirectCost)) {
//         item.indirectCost.forEach((ic) => {
//           // ic.name is "Fringe", "G&A", etc.
//           flattenedRow[ic.name] = Number(ic.value) || 0;
//         });
//       }

//       result[key] = flattenedRow;
//     });

//     console.log("Verified Aggregated Data:", result);
//     setAggregatedData(result);
//   }, [monthlyApiData]);

//   useEffect(() => {
//     if (refreshKey || refreshCalculation) {
//       fetchAllData();
//     }
//   }, [planId, planType, startDate, endDate, refreshKey, refreshCalculation]);

//   useEffect(() => {
//     if (allForcastData) {
//       const monthlyData = allForcastData;
//       const durationFromMonthly = monthlyData.map((m) => ({
//         year: m.year,
//         monthNo: m.monthNo ?? m.month,
//         month: new Date(m.year, (m.monthNo ?? m.month) - 1).toLocaleString(
//           "en-US",
//           {
//             month: "short",
//             year: "numeric",
//           },
//         ),
//       }));
//       console.log(monthlyData);
//       setDurations(durationFromMonthly);
//       setMonthlyApiData(monthlyData);
//     }
//   }, [allForcastData]);

//   // const getApiValue = (year, month, key) => {
//   //   const record = monthlyApiData.find(d => d.year === year && d.month === month);
//   //   if (!record) return 0;
//   //   // Map API keys to your component keys
//   //   const mapping = {
//   //     fringe: record.fringe,
//   //     gna: record.gna,
//   //     overhead: record.overhead,
//   //     materials: record.mnh, // mnh maps to Materials row
//   //     revenue: record.revenue,
//   //     laborCost: record.laborCost,
//   //     nonLaborCost: record.nonLaborCost
//   //   };
//   //   return mapping[key] || 0;
//   // };

//   const getApiValue = (year, month, key) => {
//     // 1. Find the specific record matching the year and month
//     // We check both month and monthNo to be safe based on your previous data transformations
//     const record = monthlyApiData.find(
//       (d) => d.year === year && (d.monthNo === month || d.month === month),
//     );

//     // If no record is found for that period, return 0
//     if (!record) return 0;

//     // 2. Check if the key matches a name inside the nested indirectCost array
//     // This handles Fringe, OH-Off Site Lanham, G&A, etc.
//     if (record.indirectCost && Array.isArray(record.indirectCost)) {
//       const indirectEntry = record.indirectCost.find((ic) => ic.name === key);

//       // If found in the array, return the numeric value
//       if (indirectEntry) {
//         return Number(indirectEntry.value) || 0;
//       }
//     }

//     // 3. Fallback: Check top-level properties
//     // This handles laborCost, nonLaborCost, revenue, or hours
//     return Number(record[key]) || 0;
//   };

//   const handleLeftScroll = () => syncScroll(leftTableRef, rightTableRef);
//   const handleRightScroll = () => syncScroll(rightTableRef, leftTableRef);

//   const visibleDurations = useMemo(() => {
//     return durations
//       .filter(
//         (d) =>
//           normalizedFiscalYear === "All" ||
//           d.year === parseInt(normalizedFiscalYear, 10),
//       )
//       .sort((a, b) =>
//         a.year !== b.year ? a.year - b.year : a.monthNo - b.monthNo,
//       );
//   }, [durations, normalizedFiscalYear]);

//   // if (isLoading) return <div className="p-4 text-xs">Loading...</div>;
//   if (isLoading || loadingPools)
//     return (
//       <div className="p-4 font-inter flex justify-center items-center">
//         <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
//         <span className="ml-2 text-xs text-gray-600">Loading.....</span>
//       </div>
//     );

//   return (
//     <div
//       // style={geistSansStyle}
//       className="relative p-2 font-inter w-full synchronized-tables-outer"
//     >
//       <div className="w-full flex justify-between mb-1 gap-2">
//         {/* <div className="px-1.5 w-auto bg-black  text-white rounded-t-sm flex items-center justify-between">
//           <span className="font-semibold text-md sm:text-sm">
//             Indirect Cost
//           </span>
//         </div> */}
//         {/* <div className="flex items-center gap-3">
//     <div className="bg-[#1e293b] p-1 rounded-lg shadow-md flex items-center justify-center">

//       <UsersIcon className="w-2 h-2 text-white" />
//     </div>
//     <div>
//       <h2 className="text-sm text-[#1e293b]  tracking-widest leading-none">
//         Indirect Cost
//       </h2>
//     </div>
//   </div> */}

//         <div className="flex justify-center w-full">
//           <div className="inline-flex items-center bg-[#17414D] px-2 py-1 rounded-md shadow-md">
//             <h2 className="text-sm font-semibold text-white leading-none flex items-center gap-2">
//               <ChartBarIcon className="w-4 h-4 text-white" />
//               <span>Indirect Cost</span>
//             </h2>
//           </div>
//         </div>
//         {/* <div className="pt-2">
//   <span className="bg-[#1e293b] text-white px-3 py-1 rounded-t-md text-xs font-bold uppercase tracking-wider shadow-sm">
//     Indirect Cost
//   </span>
// </div> */}
//       </div>

//       {durations.length === 0 ? (
//         <div className="bg-yellow-100  border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-xs">
//           No data available.
//         </div>
//       ) : (
//         <div className="border-line">
//           <div className="synchronized-tables-container flex w-full overflow-hidden rounded-lg">
//             {/* Left Table: Fixed Labels */}
//             <div
//               ref={leftTableRef}
//               onScroll={handleLeftScroll}
//               className="hide-scrollbar"
//               style={{
//                 width: "180px",
//                 maxHeight: "400px",
//                 overflowY: "auto",
//                 flexShrink: 0,
//               }}
//             >
//               <table className="table-fixed table min-w-full border-r border-gray-300">
//                 <thead className="thead">
//                   <tr style={{ height: `${ROW_HEIGHT_DEFAULT}px` }}>
//                     <th className="th-thead-blue px-4 text-center">
//                       Cost Pool
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="tbody ">
//                   {POOL_ROWS.map((row) => (
//                     <tr
//                       key={row.key}
//                       style={{ height: `${ROW_HEIGHT_DEFAULT}px` }}
//                       className="border-b border-gray-100"
//                     >
//                       <td className="tbody-td-l px-4 text-center font-medium text-gray-700">
//                         {row.label}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot>
//                   {/* {" "}
//                       <div style={{ height: "1px" }}></div>{" "} */}
//                   <tr
//                     className="font-bold border border-gray-300"
//                     style={{
//                       height: `${ROW_HEIGHT_DEFAULT}px`,
//                       position: "sticky",
//                       bottom: ROW_HEIGHT_DEFAULT,
//                       zIndex: 20,
//                       backgroundColor: "#d7ebf3", // light blue like screenshot
//                       color: "#000000",
//                       // borderTop: "2px solid #A9A9A9",
//                     }}
//                   >
//                     <td className="tbody-td px-4 text-center ">
//                       Subtotal Indirect Cost
//                     </td>
//                   </tr>
//                   <tr
//                   // className="bg-blue-50 border border-gray-300 font-bold"
//                   // style={{
//                   //   height: `${ROW_HEIGHT_DEFAULT}px`,
//                   //   position: "sticky",
//                   //   bottom: 0,
//                   //   zIndex: 20,
//                   //   backgroundColor: "#d7ebf3", // light blue like screenshot
//                   //   color: "#000000",
//                   // }}
//                   >
//                     <td className="tbody-td px-4 text-center text-blue-900 ">
//                       {" "}
//                     </td>
//                   </tr>
//                   <tr
//                     className="bg-blue-50 border border-gray-300 font-bold"
//                     style={{
//                       height: `${ROW_HEIGHT_DEFAULT + 10}px`,
//                       position: "sticky",
//                       bottom: 0,
//                       zIndex: 20,
//                       backgroundColor: "#d7ebf3", // light blue like screenshot
//                       color: "#000000",
//                       fontSize: "14px",
//                     }}
//                   >
//                     <td className="tbody-td px-4 text-center text-blue-900 ">
//                       Total Expenses
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>

//             {/* Right Table: Data (tbody logic unchanged) */}
//             <div
//               ref={rightTableRef}
//               onScroll={handleRightScroll}
//               className="flex-1"
//               style={{
//                 maxHeight: "400px",
//                 overflowY: "auto",
//                 overflowX: "auto",
//               }}
//             >
//               <table className="min-w-full table border-l border-gray-300">
//                 <thead className="thead">
//                   <tr style={{ height: `${ROW_HEIGHT_DEFAULT}px` }}>
//                     {visibleDurations.map((d) => (
//                       <th
//                         key={`${d.monthNo}_${d.year}`}
//                         className="th-thead-blue min-w-[110px] text-center px-2"
//                       >
//                         <div className="flex flex-col items-center justify-center h-full">
//                           <span className="whitespace-nowrap">{d.month}</span>
//                         </div>
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="tbody">
//                   {POOL_ROWS.map((row) => (
//                     <tr
//                       key={row.key}
//                       style={{ height: `${ROW_HEIGHT_DEFAULT}px` }}
//                       className="hover:bg-blue-50 transition border-b border-gray-100"
//                     >
//                       {visibleDurations.map((d) => {
//                         // Create the lookup key (ensure this matches your useEffect format)
//                         const key = `${d.monthNo}_${d.year}`;
//                         // Pull value directly from flattened aggregatedData
//                         const cellValue = aggregatedData[key]?.[row.key] || 0;

//                         return (
//                           <td
//                             key={`${key}-${row.key}`}
//                             className="tbody-td text-center text-gray-600 px-2"
//                           >
//                             {cellValue.toLocaleString(undefined, {
//                               minimumFractionDigits: 2,
//                               maximumFractionDigits: 2,
//                             })}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot>
//                   {/* <div style={{ height: "1px" }}></div> */}
//                   <tr
//                     className="bg-gray-100 font-bold text-center border border-gray-300"
//                     style={{
//                       height: `${ROW_HEIGHT_DEFAULT}px`,
//                       position: "sticky",
//                       bottom: ROW_HEIGHT_DEFAULT,
//                       zIndex: 20,
//                       backgroundColor: "#d7ebf3", // light blue like screenshot
//                       color: "#000000",
//                       // borderTop: "2px solid #A9A9A9",
//                     }}
//                   >
//                     {visibleDurations.map((d) => {
//                       // Sum of Fringe + Overhead + M&H + G&A
//                       // const totalIndirect = POOL_ROWS.reduce(
//                       //   (acc, key) => acc + getApiValue(d.year, d.monthNo, key),
//                       //   0,
//                       // );

//                       const totalIndirect = POOL_ROWS.reduce((acc, row) => {
//                         const val = getApiValue(d.year, d.monthNo, row.key);

//                         // Log the details for debugging
//                         console.log(
//                           `Month: ${d.month}, Pool Name: ${row.label} (${row.key}), Value: ${val}`,
//                         );

//                         return acc + val;
//                       }, 0);

//                       // Optional: Log the final subtotal for the month
//                       console.log(
//                         `>>> Subtotal for ${d.month}: ${totalIndirect}`,
//                       );
//                       return (
//                         <td
//                           key={`sub-indirect-${d.monthNo}_${d.year}`}
//                           className="tbody-td text-blue-900 px-2"
//                         >
//                           {totalIndirect.toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                   <tr
//                   // className="bg-blue-50 border border-gray-300 font-bold text-center"
//                   // style={{
//                   //   height: `${ROW_HEIGHT_DEFAULT}px`,
//                   //   position: "sticky",
//                   //   bottom: 0,
//                   //   zIndex: 20,
//                   //   backgroundColor: "#d7ebf3", // light blue like screenshot
//                   //   color: "#000000",
//                   // }}
//                   >
//                     {/* {visibleDurations.map((d) => {
//                       const key = `${d.monthNo}_${d.year}`;
//                       return (
//                         <td
//                           key={`footer-proj-${key}`}
//                           className="tbody-td text-blue-900 px-2 "
//                         >
//                           {(columnTotals[key]?.project || 0).toLocaleString(
//                             undefined,
//                             {
//                               minimumFractionDigits: 2,
//                               maximumFractionDigits: 2,
//                             },
//                           )}
//                         </td>
//                       );
//                     })} */}
//                     {visibleDurations.map((d) => {
//                       return <td className="tbody-td text-blue-900 px-2"> </td>;
//                     })}
//                   </tr>
//                   <tr
//                     className="bg-blue-50 border border-gray-300 font-bold text-center"
//                     style={{
//                       height: `${ROW_HEIGHT_DEFAULT + 10}px`,
//                       position: "sticky",
//                       bottom: 0,
//                       zIndex: 20,
//                       backgroundColor: "#d7ebf3", // light blue like screenshot
//                       color: "#000000",
//                       fontSize: "14px",
//                     }}
//                   >
//                     {/* {visibleDurations.map((d) => {
//                       const key = `${d.monthNo}_${d.year}`;
//                       return (
//                         <td
//                           key={`footer-proj-${key}`}
//                           className="tbody-td text-blue-900 px-2 "
//                         >
//                           {(columnTotals[key]?.project || 0).toLocaleString(
//                             undefined,
//                             {
//                               minimumFractionDigits: 2,
//                               maximumFractionDigits: 2,
//                             },
//                           )}
//                         </td>
//                       );
//                     })} */}
//                     {visibleDurations.map((d) => {
//                       const labor = getApiValue(d.year, d.monthNo, "laborCost");
//                       const nonLabor = getApiValue(
//                         d.year,
//                         d.monthNo,
//                         "nonLaborCost",
//                       );

//                       // 2. Calculate Total Indirect by summing the exact keys from POOL_ROWS
//                       // const totalIndirect = POOL_ROWS.reduce(
//                       //   (acc, key) => acc + getApiValue(d.year, d.monthNo, key),
//                       //   0,
//                       // );
//                       const totalIndirect = POOL_ROWS.reduce((acc, row) => {
//                         const val = getApiValue(d.year, d.monthNo, row.key);

//                         // Log the details for debugging
//                         console.log(
//                           `Month: ${d.month}, Pool Name: ${row.label} (${row.key}), Value: ${val}`,
//                         );

//                         return acc + val;
//                       }, 0);

//                       // Optional: Log the final subtotal for the month
//                       console.log(
//                         `>>> Subtotal for ${d.month}: ${totalIndirect}`,
//                       );

//                       // 3. Final Sum
//                       const grandTotal = labor + nonLabor + totalIndirect;
//                       return (
//                         <td
//                           key={`grand-total-${d.monthNo}_${d.year}`}
//                           className="tbody-td text-blue-900 px-2"
//                         >
//                           {grandTotal.toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectPoolCosts;

import React, { useEffect, useState, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "./config";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const ROW_HEIGHT_DEFAULT = 28;

const ProjectPoolCosts = ({
  refreshKey,
  planId,
  startDate,
  endDate,
  fiscalYear,
  planType,
  hoursColumnTotals,
  otherColumnTotals,
  refreshCalculation,
  allForcastData,
  loadingPools,
  templateId,
}) => {
  const [durations, setDurations] = useState([]);
  const [aggregatedData, setAggregatedData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [poolDefinitions, setPoolDefinitions] = useState([]);

  // States to manage pool rates mapping dictionary
  const [poolRates, setPoolRates] = useState({});
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  const leftTableRef = useRef(null);
  const rightTableRef = useRef(null);
  const scrollingLock = useRef(false);

  const normalizedFiscalYear =
    fiscalYear === "All" || !fiscalYear ? "All" : String(fiscalYear).trim();

  // 1. Fetch Pool Definitions based on Template ID and retrieve rates dynamically
  useEffect(() => {
    // const fetchPoolsAndRates = async () => {
    //   const tid = templateId;
    //   if (!tid) return;

    //   setIsLoadingRates(true);
    //   try {
    //     const poolsResponse = await axios.get(
    //       `${backendUrl}/Orgnization/GetPoolsByTemplateId?templateId=${tid}`,
    //     );

    //     const rawPoolList = poolsResponse.data || [];

    //     // Filter out specific poolIds that shouldn't show on UI
    //     const filteredPools = rawPoolList.filter(
    //       (pool) =>
    //         !["FRINGEONGNA", "OVERHEADONGNA", "FRINGEONOVERHEAD"].includes(
    //           pool.poolId,
    //         ),
    //     );

    //     setPoolDefinitions(filteredPools);

    //     if (filteredPools.length === 0) {
    //       setPoolRates({});
    //       return;
    //     }

    //     // Determine which unique fiscal years require rate records
    //     let yearsToFetch = [];
    //     if (normalizedFiscalYear !== "All") {
    //       yearsToFetch = [parseInt(normalizedFiscalYear, 10)];
    //     } else if (durations.length > 0) {
    //       yearsToFetch = [...new Set(durations.map((d) => d.year))];
    //     } else {
    //       // If durations are not initialized yet, use current year as backup
    //       yearsToFetch = [new Date().getFullYear()];
    //     }

    //     const ratesPromises = [];
    //     const requestMetadata = [];

    //     // Generate matching dynamic parallel promise configurations
    //     yearsToFetch.forEach((year) => {
    //       filteredPools.forEach((pool) => {
    //         requestMetadata.push({
    //           poolId: pool.poolId,
    //           groupName: pool.groupName,
    //           year,
    //         });
    //         ratesPromises.push(
    //           axios
    //             .get(
    //               // `${backendUrl}/Orgnization/GetRatesByPoolsTemplateId?templateId=${tid}&poolId=${encodeURIComponent(pool.poolId)}&year=${year}`,
    //               `${backendUrl}/api/PlBudTemplatePoolRates/GetRatesByPoolsTemplateId?templateId=${tid}&poolId=${encodeURIComponent(pool.poolId)}&year=${year}&plid=${planId}`,
    //             )
    //             .catch((err) => {
    //               console.error(
    //                 `Failed to fetch rates for pool ${pool.poolId} and year ${year}:`,
    //                 err,
    //               );
    //               return { data: [] };
    //             }),
    //         );
    //       });
    //     });

    //     const ratesResponses = await Promise.all(ratesPromises);
    //     const ratesLookup = {};

    //     // Parse rate array data into accurate mapping combinations
    //     ratesResponses.forEach((response, idx) => {
    //       const meta = requestMetadata[idx];
    //       const fetchedRates = response.data || [];

    //       fetchedRates.forEach((rateItem) => {
    //         // Build dual-index matching lookup key strings using pool identifier values
    //         // We map using both poolId and groupName to avoid mapping key breaks
    //         const keyByPoolId = `${meta.poolId}_${rateItem.month}_${meta.year}`;
    //         const keyByGroupName = `${meta.groupName}_${rateItem.month}_${meta.year}`;

    //         const payload = {
    //           actualRate: Number(rateItem.actualRate) || 0,
    //           targetRate: Number(rateItem.targetRate) || 0,
    //         };

    //         ratesLookup[keyByPoolId] = payload;
    //         ratesLookup[keyByGroupName] = payload;
    //       });
    //     });

    //     setPoolRates(ratesLookup);
    //   } catch (err) {
    //     console.error("Error fetching pools and rates:", err);
    //     toast.error("Failed to load pool metrics & rates.");
    //   } finally {
    //     setIsLoadingRates(false);
    //   }
    // };

    const fetchPoolsAndRates = async () => {
      const tid = templateId;
      if (!tid) return;

      setIsLoadingRates(true);
      try {
        // 1. Fetch pool definitions
        const poolsResponse = await axios.get(
          `${backendUrl}/Orgnization/GetPoolsByTemplateId?templateId=${tid}`,
        );

        const rawPoolList = poolsResponse.data || [];

        // Filter out excluded poolIds
        const filteredPools = rawPoolList.filter(
          (pool) =>
            !["FRINGEONGNA", "OVERHEADONGNA", "FRINGEONOVERHEAD"].includes(
              pool.poolId,
            ),
        );

        setPoolDefinitions(filteredPools);

        if (filteredPools.length === 0) {
          setPoolRates({});
          return;
        }

        // 2. Determine target year parameter (pass 0 if "All")
        let targetYear = 0;

        if (normalizedFiscalYear === "All") {
          // Explicitly set 0 when fiscal year is "All"
          targetYear = 0;
        } else if (normalizedFiscalYear) {
          // Use selected fiscal year when specified
          targetYear = parseInt(normalizedFiscalYear, 10);
        } else if (durations.length > 0) {
          // Fallback to first year if fiscal year is unselected/empty
          targetYear = durations[0].year;
        } else {
          // Fallback to current year if no durations available
          targetYear = new Date().getFullYear();
        }

        // Create a map to lookup groupName by poolId
        const poolGroupMap = {};
        filteredPools.forEach((p) => {
          poolGroupMap[p.poolId] = p.groupName;
        });

        // 3. Single API call to fetch all rates
        const ratesResponse = await axios.get(
          `${backendUrl}/api/PlBudTemplatePoolRates/GetAllPoolRatesByTemplateId?templateId=${tid}&year=${targetYear}&plid=${planId}`,
        );

        const fetchedRates = ratesResponse.data || [];
        const ratesLookup = {};

        // 4. Map the response directly into the lookup dictionary
        fetchedRates.forEach((rateItem) => {
          const poolId = rateItem.poolId;
          const groupName = poolGroupMap[poolId];
          const month = rateItem.month;
          const year = rateItem.year;

          const payload = {
            actualRate: Number(rateItem.actualRate) || 0,
            targetRate: Number(rateItem.targetRate) || 0,
          };

          // Store lookup keys by both poolId and groupName
          ratesLookup[`${poolId}_${month}_${year}`] = payload;
          if (groupName) {
            ratesLookup[`${groupName}_${month}_${year}`] = payload;
          }
        });

        setPoolRates(ratesLookup);
      } catch (err) {
        console.error("Error fetching pools and rates:", err);
        toast.error("Failed to load pool metrics & rates.");
      } finally {
        setIsLoadingRates(false);
      }
    };

    fetchPoolsAndRates();
  }, [templateId, normalizedFiscalYear, durations.length]);

  const POOL_ROWS = useMemo(() => {
    return poolDefinitions.map((p) => ({
      key: p.groupName, // Matches keys from forecast API item payload fields (e.g. "G&A")
      poolId: p.poolId, // Matches rates dataset structures (e.g. "GNA")
      label: p.groupName,
    }));
  }, [poolDefinitions]);

  // Helper method to resolve localized rates by parsing configuration matching contexts
  const getRateValue = (poolId, groupName, monthNo, year) => {
    // Try matching via poolId first, then fallback to groupName
    const lookupKey = `${poolId}_${monthNo}_${year}`;
    const fallbackKey = `${groupName}_${monthNo}_${year}`;

    const rateData = poolRates[lookupKey] || poolRates[fallbackKey];
    if (!rateData) return 0;

    const isActual = String(planType).toLowerCase().includes("actual");
    return isActual ? rateData.actualRate : rateData.targetRate;
  };

  const syncScroll = (sourceRef, targetRef) => {
    if (!sourceRef.current || !targetRef.current) return;
    if (!scrollingLock.current) {
      scrollingLock.current = true;
      targetRef.current.scrollTop = sourceRef.current.scrollTop;
      setTimeout(() => {
        scrollingLock.current = false;
      }, 0);
    }
  };

  const [monthlyApiData, setMonthlyApiData] = useState([]);

  const fetchAllData = async () => {
    if (!planId || !startDate || !endDate) return;
    setIsLoading(true);

    try {
      const monthlyRes = await axios.get(
        `${backendUrl}/Forecast/GetMonthlyDataV1?planID=${planId}&planType=${planType}`,
      );
      const monthlyData = Array.isArray(monthlyRes.data) ? monthlyRes.data : [];
      const durationFromMonthly = monthlyData.map((m) => ({
        year: m.year,
        monthNo: m.monthNo ?? m.month,
        month: new Date(m.year, (m.monthNo ?? m.month) - 1).toLocaleString(
          "en-US",
          {
            month: "short",
            year: "numeric",
          },
        ),
      }));
      setDurations(durationFromMonthly);
      setMonthlyApiData(monthlyData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pool cost data");
    } finally {
      setIsLoading(false);
    }
  };

  // Aggregate cost data parameters
  useEffect(() => {
    if (!monthlyApiData || monthlyApiData.length === 0) {
      setAggregatedData({});
      return;
    }

    const result = {};
    monthlyApiData.forEach((item) => {
      const m = item.month || item.monthNo;
      const key = `${m}_${item.year}`;

      const flattenedRow = {
        laborCost: Number(item.laborCost) || 0,
        nonLaborCost: Number(item.nonLaborCost) || 0,
        revenue: Number(item.revenue) || 0,
        hours: Number(item.hours) || 0,
      };

      if (item.indirectCost && Array.isArray(item.indirectCost)) {
        item.indirectCost.forEach((ic) => {
          flattenedRow[ic.name] = Number(ic.value) || 0;
        });
      }

      result[key] = flattenedRow;
    });

    setAggregatedData(result);
  }, [monthlyApiData]);

  useEffect(() => {
    if (refreshKey || refreshCalculation) {
      fetchAllData();
    }
  }, [planId, planType, startDate, endDate, refreshKey, refreshCalculation]);

  useEffect(() => {
    if (allForcastData) {
      const monthlyData = allForcastData;
      const durationFromMonthly = monthlyData.map((m) => ({
        year: m.year,
        monthNo: m.monthNo ?? m.month,
        month: new Date(m.year, (m.monthNo ?? m.month) - 1).toLocaleString(
          "en-US",
          {
            month: "short",
            year: "numeric",
          },
        ),
      }));
      setDurations(durationFromMonthly);
      setMonthlyApiData(monthlyData);
    }
  }, [allForcastData]);

  const getApiValue = (year, month, key) => {
    const record = monthlyApiData.find(
      (d) => d.year === year && (d.monthNo === month || d.month === month),
    );

    if (!record) return 0;

    if (record.indirectCost && Array.isArray(record.indirectCost)) {
      const indirectEntry = record.indirectCost.find((ic) => ic.name === key);
      if (indirectEntry) {
        return Number(indirectEntry.value) || 0;
      }
    }

    return Number(record[key]) || 0;
  };

  const handleLeftScroll = () => syncScroll(leftTableRef, rightTableRef);
  const handleRightScroll = () => syncScroll(rightTableRef, leftTableRef);

  const visibleDurations = useMemo(() => {
    return durations
      .filter(
        (d) =>
          normalizedFiscalYear === "All" ||
          d.year === parseInt(normalizedFiscalYear, 10),
      )
      .sort((a, b) =>
        a.year !== b.year ? a.year - b.year : a.monthNo - b.monthNo,
      );
  }, [durations, normalizedFiscalYear]);

  if (isLoading || loadingPools || isLoadingRates)
    return (
      <div className="p-4 font-inter flex justify-center items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-xs text-gray-600">
          Loading data & rates...
        </span>
      </div>
    );

  return (
    <div className="relative p-2 font-inter w-full synchronized-tables-outer">
      <div className="w-full flex justify-between mb-1 gap-2">
        <div className="flex justify-center w-full">
          <div className="inline-flex items-center bg-[#17414D] px-2 py-1 rounded-md shadow-md">
            <h2 className="text-sm font-semibold text-white leading-none flex items-center gap-2">
              <ChartBarIcon className="w-4 h-4 text-white" />
              <span>Indirect Cost</span>
            </h2>
          </div>
        </div>
      </div>

      {durations.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-xs">
          No data available.
        </div>
      ) : (
        <div className="border-line">
          <div className="synchronized-tables-container flex w-full overflow-hidden rounded-lg">
            {/* Left Table: Cost Pool Row Titles */}
            <div
              ref={leftTableRef}
              onScroll={handleLeftScroll}
              className="hide-scrollbar"
              style={{
                width: "180px",
                maxHeight: "440px",
                overflowY: "auto",
                flexShrink: 0,
              }}
            >
              <table className="table-fixed table min-w-full border-r border-gray-300">
                <thead className="thead">
                  <tr style={{ height: `${ROW_HEIGHT_DEFAULT}px` }}>
                    <th className="th-thead-blue px-4 text-center">
                      Cost Pool
                    </th>
                  </tr>
                  <tr style={{ height: `${ROW_HEIGHT_DEFAULT}px` }}>
                    <th className="th-thead-blue bg-slate-100 border-t border-gray-200 px-4 text-center text-[11px] text-gray-500">
                      -
                    </th>
                  </tr>
                </thead>
                <tbody className="tbody">
                  {POOL_ROWS.map((row) => (
                    <tr
                      key={row.key}
                      style={{ height: `${ROW_HEIGHT_DEFAULT}px` }}
                      className="border-b border-gray-100"
                    >
                      <td className="tbody-td-l px-4 text-center font-medium text-gray-700 text-[12px]">
                        {row.label}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr
                    className="font-bold border border-gray-300"
                    style={{
                      height: `${ROW_HEIGHT_DEFAULT}px`,
                      position: "sticky",
                      bottom: ROW_HEIGHT_DEFAULT,
                      zIndex: 20,
                      backgroundColor: "#d7ebf3",
                      color: "#000000",
                    }}
                  >
                    <td className="tbody-td px-4 text-center text-[12px]">
                      Subtotal Indirect Cost
                    </td>
                  </tr>
                  <tr>
                    <td className="tbody-td px-4 text-center text-blue-900">
                      {" "}
                    </td>
                  </tr>
                  <tr
                    className="bg-blue-50 border border-gray-300 font-bold"
                    style={{
                      height: `${ROW_HEIGHT_DEFAULT + 10}px`,
                      position: "sticky",
                      bottom: 0,
                      zIndex: 20,
                      backgroundColor: "#d7ebf3",
                      color: "#000000",
                      fontSize: "13px",
                    }}
                  >
                    <td className="tbody-td px-4 text-center text-blue-900">
                      Total Expenses
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Right Table: Split Month Layout with subheaders for Cost and Rate */}
            <div
              ref={rightTableRef}
              onScroll={handleRightScroll}
              className="flex-1"
              style={{
                maxHeight: "440px",
                overflowY: "auto",
                overflowX: "auto",
              }}
            >
              <table className="min-w-full table border-l border-gray-300">
                <thead className="thead">
                  {/* Row 1: Split Month colSpan Titles */}
                  <tr style={{ height: `${ROW_HEIGHT_DEFAULT}px` }}>
                    {visibleDurations.map((d) => (
                      <th
                        key={`month-${d.monthNo}_${d.year}`}
                        colSpan={2}
                        className="th-thead-blue border-b border-gray-200 min-w-[160px] text-center px-2 font-semibold"
                      >
                        {d.month}
                      </th>
                    ))}
                  </tr>
                  {/* Row 2: Sub-columns split */}
                  <tr style={{ height: `${ROW_HEIGHT_DEFAULT}px` }}>
                    {visibleDurations.map((d) => (
                      <React.Fragment key={`subheaders-${d.monthNo}_${d.year}`}>
                        <th className="th-thead text-[11px] font-medium text-gray-600 border-r border-gray-200 w-[90px] text-center">
                          Cost
                        </th>
                        <th className="th-thead text-[11px] font-medium text-gray-600 w-[70px] text-center">
                          Rate
                        </th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody className="tbody">
                  {POOL_ROWS.map((row) => (
                    <tr
                      key={row.key}
                      style={{ height: `${ROW_HEIGHT_DEFAULT}px` }}
                      className="hover:bg-blue-50 transition border-b border-gray-100"
                    >
                      {visibleDurations.map((d) => {
                        const key = `${d.monthNo}_${d.year}`;
                        const cellValue = aggregatedData[key]?.[row.key] || 0;

                        // Extract accurate rate parameters matching pool ID fields
                        const rateValue = getRateValue(
                          row.poolId,
                          row.key,
                          d.monthNo,
                          d.year,
                        );

                        return (
                          <React.Fragment key={`${key}-${row.key}`}>
                            {/* Cost Column */}
                            <td className="tbody-td text-right text-gray-800 px-2 text-[11px] border-r border-gray-150">
                              {cellValue.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            {/* Rate Column */}
                            <td className="tbody-td text-center text-blue-600 font-medium px-2 text-[11px]">
                              {rateValue !== 0 ? `${rateValue}%` : "0.00%"}
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  {/* Indirect Costs Summary */}
                  <tr
                    className="bg-gray-100 font-bold text-center border border-gray-300"
                    style={{
                      height: `${ROW_HEIGHT_DEFAULT}px`,
                      position: "sticky",
                      bottom: ROW_HEIGHT_DEFAULT,
                      zIndex: 20,
                      backgroundColor: "#d7ebf3",
                      color: "#000000",
                    }}
                  >
                    {visibleDurations.map((d) => {
                      const totalIndirect = POOL_ROWS.reduce((acc, row) => {
                        return acc + getApiValue(d.year, d.monthNo, row.key);
                      }, 0);

                      return (
                        <React.Fragment
                          key={`sub-indirect-${d.monthNo}_${d.year}`}
                        >
                          <td className="tbody-td text-right text-blue-900 px-2 text-[11px] border-r border-blue-200">
                            {totalIndirect.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="tbody-td bg-[#d7ebf3] px-2"></td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                  {/* Grid balancing layout space spacing block */}
                  <tr>
                    {visibleDurations.map((d) => (
                      <React.Fragment key={`space-${d.monthNo}_${d.year}`}>
                        <td className="tbody-td px-2 border-r border-gray-100">
                          {" "}
                        </td>
                        <td className="tbody-td px-2"> </td>
                      </React.Fragment>
                    ))}
                  </tr>
                  {/* Total Grand Cumulative Layout Summary */}
                  <tr
                    className="bg-blue-50 border border-gray-300 font-bold text-center"
                    style={{
                      height: `${ROW_HEIGHT_DEFAULT + 10}px`,
                      position: "sticky",
                      bottom: 0,
                      zIndex: 20,
                      backgroundColor: "#d7ebf3",
                      color: "#000000",
                      fontSize: "14px",
                    }}
                  >
                    {visibleDurations.map((d) => {
                      const labor = getApiValue(d.year, d.monthNo, "laborCost");
                      const nonLabor = getApiValue(
                        d.year,
                        d.monthNo,
                        "nonLaborCost",
                      );
                      const totalIndirect = POOL_ROWS.reduce((acc, row) => {
                        return acc + getApiValue(d.year, d.monthNo, row.key);
                      }, 0);

                      const grandTotal = labor + nonLabor + totalIndirect;
                      return (
                        <React.Fragment
                          key={`grand-total-${d.monthNo}_${d.year}`}
                        >
                          <td className="tbody-td text-right text-blue-900 px-2 text-[12px] font-bold border-r border-blue-200">
                            {grandTotal.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="tbody-td bg-[#d7ebf3] px-2"></td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPoolCosts;
