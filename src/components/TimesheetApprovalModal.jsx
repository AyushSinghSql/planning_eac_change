// import React, { useState, useEffect } from "react";
// import { backendUrl } from "./config";

// // --- SVG Icons ---
// const EyeIcon = ({ className = "h-4 w-4" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className={className}
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//     />
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//     />
//   </svg>
// );
// const XIcon = ({ className = "h-4 w-4" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className={className}
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M6 18L18 6M6 6l12 12"
//     />
//   </svg>
// );
// // --- ADDED: MinusCircleIcon for column hide action ---
// const MinusCircleIcon = ({ className = "h-4 w-4" }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className={className}
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
//     />
//   </svg>
// );

// // --- Helper Functions ---
// const formatDate = (dateInput) => {
//   if (!dateInput) return "";
//   let date;
//   if (dateInput instanceof Date) {
//     date = dateInput;
//   } else {
//     const dateOnlyString = String(dateInput).split("T")[0];
//     const parts = dateOnlyString.split("-");
//     if (parts.length !== 3) return dateInput;
//     const year = parseInt(parts[0], 10);
//     const month = parseInt(parts[1], 10) - 1;
//     const day = parseInt(parts[2], 10);
//     date = new Date(Date.UTC(year, month, day));
//   }
//   if (isNaN(date.getTime())) return "";
//   return new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(date);
// };

// // --- Toast Notification ---
// const showToast = (message, type = "info") => {
//   const toast = document.createElement("div");
//   const typeClasses = {
//     success: "bg-green-500",
//     error: "bg-red-500",
//     warning: "bg-yellow-500 text-black",
//     info: "bg-blue-500",
//   };
//   toast.className = `fixed top-5 right-5 p-4 rounded-md text-white shadow-lg z-[10000] ${
//     typeClasses[type] || typeClasses["info"]
//   }`;
//   toast.textContent = message;
//   document.body.appendChild(toast);
//   setTimeout(() => {
//     document.body.removeChild(toast);
//   }, 3000);
// };

// // Hideable columns
// const hideableColumns = [
//   "Work Order",
//   "Description",
//   "Project",
//   "PLC",
//   "Pay Type",
//   "Po Id",
//   "Release",
//   "PO LN No",
// ];

// export default function TimesheetApprovalView({
//   resourceId,
//   timesheetDate,
//   onClose,
//   resourceType,
// }) {
//   const [lines, setLines] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [headerDates, setHeaderDates] = useState([]);

//   // const [hiddenColumns, setHiddenColumns] = useState({
//   //   "Work Order": false,
//   //   Description: false,
//   //   Project: false,
//   //   PLC: false,
//   //   "Pay Type": false,
//   //   "Po Id": false,
//   //   Release: false,
//   //   "PO LN No": false,
//   // });

//   console.log("Resource Type", resourceType);

//   const hideableColumns =
//     resourceType === "user"
//       ? ["Project", "PLC", "Pay Type"]
//       : [
//           "Work Order",
//           "Description",
//           "Project",
//           "PLC",
//           "Pay Type",
//           "PO Number",
//           "RLSE Number",
//           "PO Line Number",
//           "PO Remaining Hours",
//         ];

//   const [hiddenColumns, setHiddenColumns] = useState(() => {
//     const initial = {};
//     hideableColumns.forEach((col) => {
//       initial[col] = false;
//     });
//     return initial;
//   });

//   const [timesheetDetails, setTimesheetDetails] = useState(null);

//   const dayKeyMapping = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
//   const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

//   useEffect(() => {
//     console.log("Resource ID received in approval view:", resourceId);
//     if (resourceId) {
//       fetchTimesheetData();
//     }
//   }, [resourceId, timesheetDate]);

//   const fetchTimesheetData = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         `${backendUrl}/api/SubkTimesheet/ByResource/${resourceId}`,
//       );
//       if (!response.ok) throw new Error("Failed to fetch timesheet data");
//       const data = await response.json();

//       console.log("Timesheet data received from API:", data);

//       const dataArray = Array.isArray(data) ? data : [];

//       // Filter to show ONLY timesheets matching the exact date
//       // This ensures we show the same data that's in the approval list
//       const filteredData = dataArray.filter((item) => {
//         if (!timesheetDate) return true;

//         const itemDate = new Date(item.timesheet_Date);
//         const selectedDate = new Date(timesheetDate);

//         // Exact date match - year, month, and day
//         return (
//           itemDate.getFullYear() === selectedDate.getFullYear() &&
//           itemDate.getMonth() === selectedDate.getMonth() &&
//           itemDate.getDate() === selectedDate.getDate()
//         );
//       });

//       console.log("Filtered data count:", filteredData.length);
//       console.log("Filtered data:", filteredData);

//       if (filteredData.length > 0) {
//         setTimesheetDetails(filteredData[0]);
//         const firstDate = filteredData[0].timesheet_Date;
//         const startDate = new Date(firstDate);
//         const startDay = startDate.getUTCDay();
//         const monday = new Date(startDate);
//         monday.setUTCDate(
//           startDate.getUTCDate() - startDay + (startDay === 0 ? -6 : 1),
//         );

//         const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//         const newHeaderDates = daysOfWeek.map((day, index) => {
//           const currentDate = new Date(monday);
//           currentDate.setUTCDate(monday.getUTCDate() + index);
//           const month = String(currentDate.getUTCMonth() + 1).padStart(2, "0");
//           const dt = String(currentDate.getUTCDate()).padStart(2, "0");
//           return `${day} ${month}/${dt}`;
//         });
//         setHeaderDates(newHeaderDates);
//       }

//       // Map filteredData - each entry from API becomes one line in the modal
//       const mappedLines = filteredData.map((item, index) => {
//         const hoursData = {
//           mon: 0,
//           tue: 0,
//           wed: 0,
//           thu: 0,
//           fri: 0,
//           sat: 0,
//           sun: 0,
//         };
//         const hourIdsData = {};

//         if (item.timesheetHours && Array.isArray(item.timesheetHours)) {
//           item.timesheetHours.forEach((hourEntry) => {
//             const date = new Date(`${hourEntry.ts_Date}T00:00:00Z`);
//             if (!isNaN(date.getTime())) {
//               const dayKey = dayKeyMapping[date.getUTCDay()];
//               if (dayKey) {
//                 hoursData[dayKey] = hourEntry.hours;
//                 hourIdsData[dayKey] = hourEntry.id;
//               }
//             }
//           });
//         }

//         // Calculate total from hoursData - this should match the approval list
//         const calculatedTotal = Object.values(hoursData).reduce(
//           (sum, hours) => sum + (parseFloat(hours) || 0),
//           0,
//         );

//         console.log(`Line ${index + 1} hours breakdown:`, hoursData);
//         console.log(`Line ${index + 1} total:`, calculatedTotal);

//         return {
//           id: item.lineNo || index + 1,
//           lineNumber: index + 1,
//           workOrder:
//             item.workOrder || item.work_order || item.workOrderNumber || "",
//           description: item.description || "",
//           project: item.projId || "",
//           plc: item.plc || "",
//           payType: item.payType || "SR",
//           poNumber: item.poNumber || "",
//           rlseNumber: item.rlseNumber || "",
//           poLineNumber: item.poLineNumber || "",
//           hours: hoursData,
//           hourIds: hourIdsData,
//           totalHours: calculatedTotal,
//           resourceId: item.resource_Id,
//         };
//       });

//       const grandTotal = mappedLines.reduce(
//         (sum, line) => sum + line.totalHours,
//         0,
//       );
//       console.log("Mapped lines:", mappedLines);
//       console.log(
//         "Grand total (should match approval list):",
//         grandTotal.toFixed(2),
//       );

//       setLines(mappedLines);
//     } catch (error) {
//       showToast(error.message, "error");
//       console.error("Error fetching timesheet data:", error);
//       setLines([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const dailyTotals = React.useMemo(() => {
//     const totals = { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 };
//     lines.forEach((line) => {
//       days.forEach((day) => {
//         totals[day] += parseFloat(line.hours[day] || 0);
//       });
//     });
//     return totals;
//   }, [lines, days]);

//   const toggleColumnVisibility = (columnName) => {
//     setHiddenColumns((prev) => ({
//       ...prev,
//       [columnName]: !prev[columnName],
//     }));
//   };

//   const showAllHiddenColumns = () => {
//     const allVisible = {};
//     Object.keys(hiddenColumns).forEach((col) => {
//       allVisible[col] = false;
//     });
//     setHiddenColumns(allVisible);
//   };

//   if (isLoading) {
//     return (
//       <div className="w-full mt-4 p-6 bg-blue-50 border border-blue-200 rounded-lg">
//         <div className="text-center text-blue-700">
//           Loading timesheet data...
//         </div>
//       </div>
//     );
//   }

//   // const tableHeaders = [
//   //   "Line No",
//   //   "Work Order",
//   //   "Description",
//   //   "Project",
//   //   "PLC",
//   //   "Pay Type",
//   //   "Po Id",
//   //   "Release",
//   //   "PO LN No",
//   //   ...headerDates,
//   //   "Total Hours",
//   // ];

//   const baseHeaders = [
//     "Line No",
//     "Work Order",
//     "Description",
//     "Project",
//     "PLC",
//     "Pay Type",
//     "Po Id",
//     "Release",
//     "PO LN No",
//   ];

//   const tableHeaders = [...baseHeaders, ...headerDates, "Total Hours"];

//   const hiddenCount = Object.values(hiddenColumns).filter((val) => val).length;
//   const hiddenColumnsList = Object.entries(hiddenColumns)
//     .filter(([col, isHidden]) => isHidden)
//     .map(([col]) => col);

//   const getColumnKey = (header) => {
//     if (header === "Line No") return "Line No";
//     if (header === "Work Order") return "Work Order";
//     if (header === "Description") return "Description";
//     if (header === "Project") return "Project";
//     if (header === "PLC") return "PLC";
//     if (header === "Pay Type") return "Pay Type";
//     if (header === "Po Id") return "Po Id";
//     if (header === "Release") return "Release";
//     if (header === "PO LN No") return "PO LN No";
//     return null;
//   };

//   const isColumnHidden = (header) => {
//     const columnKey = getColumnKey(header);
//     return columnKey && hiddenColumns[columnKey];
//   };

//   return (
//     <div className="w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-sm font-inter overflow-hidden">
//       {/* Header Section */}
//       <div className="flex justify-between items-center px-4 py-3 border-b border-gray-300 bg-[#e5f3fb] flex-wrap gap-3">
//         <div>
//           {timesheetDetails && (
//             <div className="flex gap-4 text-xs text-black flex-wrap font-medium">
//               <div>
//                 <span className="font-semibold text-gray-700">Status:</span>{" "}
//                 <span className="font-bold text-[#17414d]">
//                   {timesheetDetails.status
//                     ? timesheetDetails.status.charAt(0).toUpperCase() +
//                       timesheetDetails.status.slice(1).toLowerCase()
//                     : "N/A"}
//                 </span>
//               </div>
//               <div>
//                 <span className="font-semibold text-gray-700">
//                   Timesheet Date:
//                 </span>{" "}
//                 {timesheetDetails.timesheet_Date
//                   ? formatDate(timesheetDetails.timesheet_Date)
//                   : "N/A"}
//               </div>
//               {timesheetDetails.status?.toLowerCase() !== "submitted" && (
//                 <>
//                   <div>
//                     <span className="font-semibold text-gray-700">
//                       Approved By:
//                     </span>{" "}
//                     {timesheetDetails.approvedBy ||
//                       timesheetDetails.pm_User_Id ||
//                       "N/A"}
//                   </div>
//                   <div>
//                     <span className="font-semibold text-gray-700">
//                       Approved Date:
//                     </span>{" "}
//                     {timesheetDetails.approvedDate
//                       ? formatDate(timesheetDetails.approvedDate)
//                       : "N/A"}
//                   </div>
//                 </>
//               )}
//             </div>
//           )}
//         </div>
//         <button
//           onClick={onClose}
//           className="btn1 btn-blue !py-1 !px-3 text-xs cursor-pointer inline-flex items-center gap-1"
//         >
//           ✕ Close
//         </button>
//       </div>

//       {/* Hidden Columns Indicator */}
//       {hiddenCount > 0 && (
//         <div className="bg-[#e9f6fb] border-b border-blue-200 px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
//           <div className="flex items-center gap-2">
//             <EyeIcon className="h-4 w-4 text-blue-600" />
//             <span className="text-xs font-medium text-gray-700">
//               {hiddenCount} column{hiddenCount > 1 ? "s" : ""} hidden:
//             </span>
//           </div>
//           <div className="flex gap-2 flex-wrap">
//             {hiddenColumnsList.map((col) => (
//               <button
//                 key={col}
//                 onClick={() => toggleColumnVisibility(col)}
//                 className="inline-flex items-center px-2.5 py-1 bg-white hover:bg-blue-100 border border-blue-300 rounded-full text-xs font-medium text-blue-700 transition-colors shadow-sm cursor-pointer"
//               >
//                 {col}
//               </button>
//             ))}
//             <button
//               onClick={showAllHiddenColumns}
//               className="btn1 btn-blue !py-0.5 !px-2.5 text-xs font-medium cursor-pointer"
//             >
//               Show All
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Content Section */}
//       <div className="p-3">
//         {lines.length === 0 ? (
//           <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
//             <div className="text-base font-semibold mb-1">No Data Found</div>
//             <div className="text-xs">No timesheet data found</div>
//           </div>
//         ) : (
//           <div className="overflow-x-auto rounded-lg border border-gray-300 scrollbar-thin">
//             <table className="w-full text-xs min-w-[1600px] border-collapse">
//               <thead className="sticky top-0 z-10">
//                 <tr>
//                   {tableHeaders.map((header, index) => {
//                     if (
//                       isColumnHidden(header) &&
//                       hideableColumns.includes(header)
//                     ) {
//                       return null;
//                     }
//                     const columnKey = getColumnKey(header);
//                     const isHideable =
//                       columnKey && hideableColumns.includes(columnKey);

//                     return (
//                       <th
//                         key={`header-${index}-${header}`}
//                         className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center last:border-r-0"
//                       >
//                         <div className="flex items-center justify-between gap-2 group px-1">
//                           <span className="flex-1 text-center">{header}</span>
//                           {isHideable && (
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 toggleColumnVisibility(columnKey);
//                               }}
//                               className="p-1 hover:bg-blue-100 rounded-full transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
//                               title="Hide column"
//                               type="button"
//                             >
//                               <MinusCircleIcon className="h-3.5 w-3.5 text-gray-500 hover:text-gray-800" />
//                             </button>
//                           )}
//                         </div>
//                       </th>
//                     );
//                   })}
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-200 bg-white">
//                 {lines.map((line, index) => {
//                   const rowTotal = Object.values(line.hours)
//                     .reduce((s, h) => s + (parseFloat(h) || 0), 0)
//                     .toFixed(2);

//                   return (
//                     <tr
//                       key={line.id}
//                       className="hover:bg-sky-50/50 transition-colors"
//                     >
//                       {/* Line No column */}
//                       {!isColumnHidden("Line No") && (
//                         <td className="px-2 py-1 min-w-[60px] border-r border-b border-gray-300 text-center font-medium text-black">
//                           {line.lineNumber}
//                         </td>
//                       )}
//                       {/* Work Order column */}
//                       {!isColumnHidden("Work Order") && (
//                         <td className="px-2 py-1 border-r border-b border-gray-300 text-center text-black">
//                           {line.workOrder || "-"}
//                         </td>
//                       )}
//                       {/* Description column */}
//                       {!isColumnHidden("Description") && (
//                         <td className="px-2 py-1 border-r border-b border-gray-300 text-black">
//                           <div
//                             className="truncate text-xs"
//                             title={line.description}
//                           >
//                             {line.description || "-"}
//                           </div>
//                         </td>
//                       )}
//                       {/* Project column */}
//                       {!isColumnHidden("Project") && (
//                         <td className="px-2 py-1 text-center border-r border-b border-gray-300 text-black">
//                           {line.project || "-"}
//                         </td>
//                       )}
//                       {/* PLC column */}
//                       {!isColumnHidden("PLC") && (
//                         <td className="px-2 py-1 text-center border-r border-b border-gray-300 text-black">
//                           {line.plc || "-"}
//                         </td>
//                       )}
//                       {/* Pay Type column */}
//                       {!isColumnHidden("Pay Type") && (
//                         <td className="px-2 py-1 text-center border-r border-b border-gray-300">
//                           <span className="px-2 py-0.5 bg-gray-100 text-black rounded text-xs font-medium border border-gray-200">
//                             {line.payType}
//                           </span>
//                         </td>
//                       )}
//                       {/* PO Number column */}
//                       {!isColumnHidden("Po Id") && (
//                         <td className="px-2 py-1 text-center border-r border-b border-gray-300 text-black">
//                           {line.poNumber || "-"}
//                         </td>
//                       )}
//                       {/* RLSE Number column */}
//                       {!isColumnHidden("Release") && (
//                         <td className="px-2 py-1 text-center border-r border-b border-gray-300 text-black">
//                           {line.rlseNumber || "-"}
//                         </td>
//                       )}
//                       {/* PO Line Number column */}
//                       {!isColumnHidden("PO LN No") && (
//                         <td className="px-2 py-1 text-center border-r border-b border-gray-300 text-black">
//                           {line.poLineNumber || "-"}
//                         </td>
//                       )}
//                       {/* Daily hours columns */}
//                       {days.map((day) => (
//                         <td
//                           key={`${line.id}-${day}`}
//                           className="px-2 py-1 border-r border-b border-gray-300 text-center"
//                         >
//                           <div
//                             className={`w-14 mx-auto text-center py-1 rounded text-xs font-semibold ${
//                               line.hours[day] > 0
//                                 ? "bg-green-50 text-green-800 border border-green-200"
//                                 : "text-gray-400"
//                             } ${
//                               day === "sat" || day === "sun"
//                                 ? "bg-gray-100"
//                                 : ""
//                             }`}
//                           >
//                             {line.hours[day]
//                               ? parseFloat(line.hours[day]).toFixed(1)
//                               : "0.0"}
//                           </div>
//                         </td>
//                       ))}
//                       {/* Total Hours column */}
//                       <td className="px-2 py-1 text-center font-bold text-black border-b border-gray-300 bg-[#e5f3fb]/60">
//                         {line.totalHours
//                           ? parseFloat(line.totalHours).toFixed(1)
//                           : rowTotal}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>

//               <tfoot className="border-t-2 border-gray-300 bg-[#e5f3fb] font-semibold text-black text-xs sticky bottom-0">
//                 <tr>
//                   <td
//                     colSpan={
//                       9 - Object.values(hiddenColumns).filter((v) => v).length
//                     }
//                     className="px-3 py-2 text-right font-bold text-black border-r border-gray-300"
//                   >
//                     Total Hours
//                   </td>
//                   {days.map((day) => (
//                     <td
//                       key={day}
//                       className="px-2 py-2 text-center border-r border-gray-300"
//                     >
//                       <div className="w-14 mx-auto font-semibold text-black">
//                         {dailyTotals[day].toFixed(2)}
//                       </div>
//                     </td>
//                   ))}
//                   <td className="px-3 py-2 text-center font-bold text-black">
//                     {lines
//                       .reduce(
//                         (acc, line) => acc + (parseFloat(line.totalHours) || 0),
//                         0,
//                       )
//                       .toFixed(2)}
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { backendUrl } from "./config";

// --- SVG Icons ---
const EyeIcon = ({ className = "h-4 w-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);
const XIcon = ({ className = "h-4 w-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const MinusCircleIcon = ({ className = "h-4 w-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// --- Helper Functions ---
const formatDate = (dateInput) => {
  if (!dateInput) return "";
  let date;
  if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    const dateOnlyString = String(dateInput).split("T")[0];
    const parts = dateOnlyString.split("-");
    if (parts.length !== 3) return dateInput;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    date = new Date(Date.UTC(year, month, day));
  }
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(date);
};

const showToast = (message, type = "info") => {
  const toast = document.createElement("div");
  const typeClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500 text-black",
    info: "bg-blue-500",
  };
  toast.className = `fixed top-5 right-5 p-4 rounded-md text-white shadow-lg z-[10000] ${
    typeClasses[type] || typeClasses["info"]
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
};

export default function TimesheetApprovalView({
  resourceId,
  timesheetDate,
  onClose,
  resourceType,
  userId,
  currentUser,
}) {
  const [lines, setLines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [headerDates, setHeaderDates] = useState([]);
  const [timesheetPeriod, setTimesheetPeriod] = useState("Bi-weekly");

  const hideableColumns =
    resourceType === "USER"
      ? [
          "Line No",
          "Project",
          "Project Name",
          "PLC",
          "PLC Description",
          "Pay Type",
        ]
      : [
          "Line No",
          // "Work Order",
          // "Description",
          "Project",
          "Project Name",
          "PLC",
          "PLC Description",
          "Pay Type",
          "Po Id",
          "Release",
          "PO LN No",
        ];

  const [hiddenColumns, setHiddenColumns] = useState(() => {
    const initial = {};
    hideableColumns.forEach((col) => {
      initial[col] = false;
    });
    return initial;
  });

  const [timesheetDetails, setTimesheetDetails] = useState(null);

  const dayKeyMapping = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  // const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  const periodDates = React.useMemo(() => {
    if (!timesheetDate) return [];

    const selectedDate = new Date(
      `${String(timesheetDate).split("T")[0]}T00:00:00Z`,
    );

    if (Number.isNaN(selectedDate.getTime())) return [];

    const period = timesheetPeriod.toLowerCase().trim();
    let startDate = new Date(selectedDate);
    let count = 7;

    switch (period) {
      case "weekly":
      case "weekly - 7 days":
        count = 7;
        break;

      case "bi-weekly":
      case "bi-weekly - 14 days":
        count = 14;
        break;

      case "semi-monthly":
      case "semi-monthly - 15 days":
        count = 15;
        break;

      case "monthly":
        startDate.setUTCDate(1);
        count = new Date(
          startDate.getUTCFullYear(),
          startDate.getUTCMonth() + 1,
          0,
        ).getDate();
        break;

      default:
        count = 7;
    }

    if (period !== "monthly") {
      switch (period) {
        case "weekly":
        case "weekly - 7 days":
          startDate.setUTCDate(startDate.getUTCDate() - 6);
          break;

        case "bi-weekly":
        case "bi-weekly - 14 days":
          startDate.setUTCDate(startDate.getUTCDate() - 13);
          break;

        case "semi-monthly":
        case "semi-monthly - 15 days":
          startDate.setUTCDate(startDate.getUTCDate() - 14);
          break;
      }
    }

    return Array.from({ length: count }, (_, index) => {
      const date = new Date(startDate);
      date.setUTCDate(startDate.getUTCDate() + index);

      return {
        key: `day${index + 1}`,
        dateKey: date.toISOString().slice(0, 10),
        label: `${String(date.getUTCMonth() + 1).padStart(2, "0")}/${String(
          date.getUTCDate(),
        ).padStart(2, "0")}`,
        weekday: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][
          date.getUTCDay()
        ],
      };
    });
  }, [timesheetDate, timesheetPeriod]);

  const days = React.useMemo(
    () => periodDates.map((item) => item.key),
    [periodDates],
  );

  useEffect(() => {
    const fetchTimesheetPeriod = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/ConfigValues`);

        if (!response.ok) {
          throw new Error("Failed to fetch configuration");
        }

        const configData = await response.json();

        const periodConfig = configData.find(
          (item) => item.name?.toLowerCase() === "timesheet_period",
        );

        if (periodConfig?.value) {
          setTimesheetPeriod(periodConfig.value.trim());
        }
      } catch (error) {
        console.error("Failed to fetch timesheet period:", error);
      }
    };

    fetchTimesheetPeriod();
  }, []);

  useEffect(() => {
    if (resourceId) {
      fetchTimesheetData();
    }
  }, [resourceId, timesheetDate, resourceType, periodDates]);

  useEffect(() => {
    const fetchTimesheetPeriod = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/ConfigValues`);

        if (!response.ok) {
          throw new Error("Failed to fetch configuration");
        }

        const configData = await response.json();

        const periodConfig = configData.find(
          (item) => item.name?.toLowerCase() === "timesheet_period",
        );

        if (periodConfig?.value) {
          setTimesheetPeriod(periodConfig.value.trim());
        }
      } catch (error) {
        console.error("Failed to fetch timesheet period:", error);
      }
    };

    fetchTimesheetPeriod();
  }, []);

  console.log(resourceType);
  const fetchTimesheetData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${backendUrl}/api/SubkTimesheet/ByResource/${resourceId}`,
      );
      if (!response.ok) throw new Error("Failed to fetch timesheet data");
      const data = await response.json();

      const dataArray = Array.isArray(data) ? data : [];

      // const filteredData = dataArray.filter((item) => {
      //   if (!timesheetDate) return true;

      //   const itemDate = new Date(item.timesheet_Date);
      //   const selectedDate = new Date(timesheetDate);

      //   return (
      //     itemDate.getFullYear() === selectedDate.getFullYear() &&
      //     itemDate.getMonth() === selectedDate.getMonth() &&
      //     itemDate.getDate() === selectedDate.getDate()
      //   );
      // });

      const filteredData = dataArray.filter((item) => {
        if (!timesheetDate) return true;

        const itemDate = new Date(item.timesheet_Date);
        const selectedDate = new Date(timesheetDate);

        const matchesDate =
          itemDate.getFullYear() === selectedDate.getFullYear() &&
          itemDate.getMonth() === selectedDate.getMonth() &&
          itemDate.getDate() === selectedDate.getDate();

        const isProjectManager =
          currentUser?.role?.toUpperCase() === "PROJECT MANAGER" ||
          currentUser?.role === "PM";

        // Filter by userId if userId is passed/available
        const matchesUser =
          isProjectManager && userId
            ? String(item.pm_User_Id || item.pm_User_Id || "") ===
              String(userId)
            : true;

        return matchesDate && matchesUser;
      });

      if (filteredData.length > 0) {
        setTimesheetDetails(filteredData[0]);
        const firstDate = filteredData[0].timesheet_Date;
        const startDate = new Date(firstDate);
        const startDay = startDate.getUTCDay();
        const monday = new Date(startDate);
        monday.setUTCDate(
          startDate.getUTCDate() - startDay + (startDay === 0 ? -6 : 1),
        );

        const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const newHeaderDates = daysOfWeek.map((day, index) => {
          const currentDate = new Date(monday);
          currentDate.setUTCDate(monday.getUTCDate() + index);
          const month = String(currentDate.getUTCMonth() + 1).padStart(2, "0");
          const dt = String(currentDate.getUTCDate()).padStart(2, "0");
          return `${day} ${month}/${dt}`;
        });
        setHeaderDates(newHeaderDates);
      }

      const mappedLines = filteredData.map((item, index) => {
        const hoursData = Object.fromEntries(
          periodDates.map((day) => [day.key, 0]),
        );

        const hourIdsData = {};

        if (Array.isArray(item.timesheetHours)) {
          item.timesheetHours.forEach((hourEntry) => {
            const dateKey = String(hourEntry.ts_Date).split("T")[0];

            const matchingDay = periodDates.find(
              (day) => day.dateKey === dateKey,
            );

            if (matchingDay) {
              hoursData[matchingDay.key] =
                (Number(hoursData[matchingDay.key]) || 0) +
                (Number(hourEntry.hours) || 0);

              hourIdsData[matchingDay.key] = hourEntry.id;
            }
          });
        }

        const calculatedTotal = Object.values(hoursData).reduce(
          (sum, hours) => sum + (Number(hours) || 0),
          0,
        );

        return {
          id: item.lineNo || index + 1,
          lineNumber: index + 1,
          workOrder:
            item.workOrder || item.work_order || item.workOrderNumber || "",
          description: item.description || "",
          project: item.projId || "",
          projectName: item.projectName || "",
          plc: item.plc || "",
          plcDesc: item.plcDesc || "",
          payType: item.payType || "SR",
          poNumber: item.poNumber || "",
          rlseNumber: item.rlseNumber || "",
          poLineNumber: item.poLineNumber || "",
          hours: hoursData,
          hourIds: hourIdsData,
          totalHours: calculatedTotal,
          resourceId: item.resource_Id,
        };
      });

      setLines(mappedLines);

      setLines(mappedLines);
    } catch (error) {
      showToast(error.message, "error");
      setLines([]);
    } finally {
      setIsLoading(false);
    }
  };

  const dailyTotals = React.useMemo(() => {
    const totals = Object.fromEntries(days.map((day) => [day, 0]));

    lines.forEach((line) => {
      days.forEach((day) => {
        totals[day] += Number(line.hours?.[day]) || 0;
      });
    });

    return totals;
  }, [lines, days]);

  const toggleColumnVisibility = (columnName) => {
    setHiddenColumns((prev) => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };

  const showAllHiddenColumns = () => {
    const allVisible = {};
    Object.keys(hiddenColumns).forEach((col) => {
      allVisible[col] = false;
    });
    setHiddenColumns(allVisible);
  };

  if (isLoading) {
    return (
      <div className="w-full mt-4 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-center text-blue-700">
          Loading timesheet data...
        </div>
      </div>
    );
  }

  const baseHeaders =
    resourceType === "USER"
      ? [
          "Line No",
          "Project",
          "Project Name",
          "PLC",
          "PLC Description",
          "Pay Type",
        ]
      : [
          "Line No",
          "Work Order",
          "Description",
          "Project",
          "Project Name",
          "PLC",
          "PLC Description",
          "Pay Type",
          "Po Id",
          "Release",
          "PO LN No",
        ];

  const tableHeaders = [
    ...baseHeaders,
    ...periodDates.map((day) => day.label),
    "Total Hours",
  ];

  const hiddenCount = Object.values(hiddenColumns).filter((val) => val).length;
  const hiddenColumnsList = Object.entries(hiddenColumns)
    .filter(([col, isHidden]) => isHidden)
    .map(([col]) => col);

  const getColumnKey = (header) => {
    if (baseHeaders.includes(header)) return header;
    return null;
  };

  const isColumnHidden = (header) => {
    const columnKey = getColumnKey(header);
    return columnKey && hiddenColumns[columnKey];
  };

  return (
    <div className="w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-sm font-inter overflow-hidden">
      {/* Header Section */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-300 bg-[#e5f3fb] flex-wrap gap-3">
        <div>
          {timesheetDetails && (
            <div className="flex gap-4 text-xs text-black flex-wrap font-medium">
              <div>
                <span className="font-semibold text-gray-700">Status:</span>{" "}
                <span className="font-bold text-[#17414d]">
                  {timesheetDetails.status
                    ? timesheetDetails.status.charAt(0).toUpperCase() +
                      timesheetDetails.status.slice(1).toLowerCase()
                    : "N/A"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Timesheet Date:
                </span>{" "}
                {timesheetDetails.timesheet_Date
                  ? formatDate(timesheetDetails.timesheet_Date)
                  : "N/A"}
              </div>
              {timesheetDetails.status?.toLowerCase() !== "submitted" && (
                <>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Approved By:
                    </span>{" "}
                    {timesheetDetails.approvedBy ||
                      timesheetDetails.pm_User_Id ||
                      "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Approved Date:
                    </span>{" "}
                    {timesheetDetails.approvedDate
                      ? formatDate(timesheetDetails.approvedDate)
                      : "N/A"}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="btn1 btn-blue !py-1 !px-3 text-xs cursor-pointer inline-flex items-center gap-1"
        >
          ✕ Close
        </button>
      </div>

      {/* Hidden Columns Indicator */}
      {hiddenCount > 0 && (
        <div className="bg-[#e9f6fb] border-b border-blue-200 px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <EyeIcon className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-gray-700">
              {hiddenCount} column{hiddenCount > 1 ? "s" : ""} hidden:
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {hiddenColumnsList.map((col) => (
              <button
                key={col}
                onClick={() => toggleColumnVisibility(col)}
                className="inline-flex items-center px-2.5 py-1 bg-white hover:bg-blue-100 border border-blue-300 rounded-full text-xs font-medium text-blue-700 transition-colors shadow-sm cursor-pointer"
              >
                {col}
              </button>
            ))}
            <button
              onClick={showAllHiddenColumns}
              className="btn1 btn-blue !py-0.5 !px-2.5 text-xs font-medium cursor-pointer"
            >
              Show All
            </button>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-3">
        {lines.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <div className="text-base font-semibold mb-1">No Data Found</div>
            <div className="text-xs">No timesheet data found</div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-300 scrollbar-thin">
            <table className="w-full text-xs min-w-[1600px] border-collapse">
              <thead className="sticky top-0 z-10">
                <tr>
                  {tableHeaders.map((header, index) => {
                    if (
                      isColumnHidden(header) &&
                      hideableColumns.includes(header)
                    ) {
                      return null;
                    }
                    const columnKey = getColumnKey(header);
                    const isHideable =
                      columnKey && hideableColumns.includes(columnKey);

                    return (
                      <th
                        key={`header-${index}-${header}`}
                        className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center last:border-r-0"
                      >
                        <div className="flex items-center justify-between gap-2 group px-1">
                          <span className="flex-1 text-center">{header}</span>
                          {isHideable && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleColumnVisibility(columnKey);
                              }}
                              className="p-1 hover:bg-blue-100 rounded-full transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                              title="Hide column"
                              type="button"
                            >
                              <MinusCircleIcon className="h-3.5 w-3.5 text-gray-500 hover:text-gray-800" />
                            </button>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {lines.map((line) => {
                  const rowTotal = Object.values(line.hours)
                    .reduce((s, h) => s + (parseFloat(h) || 0), 0)
                    .toFixed(2);

                  return (
                    <tr
                      key={line.id}
                      className="hover:bg-sky-50/50 transition-colors"
                    >
                      {/* Line No column */}
                      {!isColumnHidden("Line No") && (
                        <td className="px-2 py-1 min-w-[60px] border-r border-b border-gray-300 text-center font-medium text-black">
                          {line.lineNumber}
                        </td>
                      )}

                      {/* Work Order column (Only for non-users) */}
                      {resourceType !== "USER" &&
                        !isColumnHidden("Work Order") && (
                          <td className="px-2 py-1 border-r border-b border-gray-300 text-center text-black">
                            {line.workOrder || "-"}
                          </td>
                        )}

                      {/* Description column (Only for non-users) */}
                      {resourceType !== "USER" &&
                        !isColumnHidden("Description") && (
                          <td className="px-2 py-1 border-r border-b border-gray-300 text-black">
                            <div
                              className="truncate text-xs"
                              title={line.description}
                            >
                              {line.description || "-"}
                            </div>
                          </td>
                        )}

                      {/* Project column */}
                      {!isColumnHidden("Project") && (
                        <td className="px-2 py-1 text-center border-r border-b border-gray-300 text-black">
                          {line.project || "-"}
                        </td>
                      )}
                      {!isColumnHidden("Project Name") && (
                        <td className="px-2 py-1 text-center border-r border-b border-gray-300 text-black">
                          {line.projectName || "-"}
                        </td>
                      )}

                      {/* PLC column */}
                      {!isColumnHidden("PLC") && (
                        <td className="px-2 py-1 text-center border-r border-b border-gray-300 text-black">
                          {line.plc || "-"}
                        </td>
                      )}
                      {!isColumnHidden("PLC Description") && (
                        <td className="px-2 py-1 text-center border-r border-b border-gray-300 text-black">
                          {line.plcDesc || "-"}
                        </td>
                      )}

                      {/* Pay Type column */}
                      {!isColumnHidden("Pay Type") && (
                        <td className="px-2 py-1 text-center border-r border-b border-gray-300">
                          <span className="px-2 py-0.5 bg-gray-100 text-black rounded text-xs font-medium border border-gray-200">
                            {line.payType}
                          </span>
                        </td>
                      )}

                      {/* PO Number column (Only for non-users) */}
                      {resourceType !== "USER" && !isColumnHidden("Po Id") && (
                        <td className="px-2 py-1 text-center border-r border-b border-gray-300 text-black">
                          {line.poNumber || "-"}
                        </td>
                      )}

                      {/* RLSE Number column (Only for non-users) */}
                      {resourceType !== "USER" &&
                        !isColumnHidden("Release") && (
                          <td className="px-2 py-1 text-center border-r border-b border-gray-300 text-black">
                            {line.rlseNumber || "-"}
                          </td>
                        )}

                      {/* PO Line Number column (Only for non-users) */}
                      {resourceType !== "USER" &&
                        !isColumnHidden("PO LN No") && (
                          <td className="px-2 py-1 text-center border-r border-b border-gray-300 text-black">
                            {line.poLineNumber || "-"}
                          </td>
                        )}

                      {/* Daily hours columns */}

                      {periodDates.map((day) => (
                        <td
                          key={`${line.id}-${day.key}`}
                          className="px-2 py-1 border-r border-b border-gray-300 text-center"
                        >
                          <div
                            className={`w-14 mx-auto text-center py-1 rounded text-xs font-semibold ${
                              Number(line.hours?.[day.key]) > 0
                                ? "bg-green-50 text-green-800 border border-green-200"
                                : "text-gray-400"
                            } ${
                              day.weekday === "sat" || day.weekday === "sun"
                                ? "bg-gray-100"
                                : ""
                            }`}
                          >
                            {(Number(line.hours?.[day.key]) || 0).toFixed(1)}
                          </div>
                        </td>
                      ))}

                      {/* Total Hours column */}
                      <td className="px-2 py-1 text-center font-bold text-black border-b border-gray-300 bg-[#e5f3fb]/60">
                        {line.totalHours
                          ? parseFloat(line.totalHours).toFixed(1)
                          : rowTotal}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot className="border-t-2 border-gray-300 bg-[#e5f3fb] font-semibold text-black text-xs sticky bottom-0">
                <tr>
                  <td
                    colSpan={
                      baseHeaders.length -
                      baseHeaders.filter(
                        (h) => isColumnHidden(h) && hideableColumns.includes(h),
                      ).length
                    }
                    className="px-3 py-2 text-right font-bold text-black border-r border-gray-300"
                  >
                    Total Hours
                  </td>
                  {periodDates.map((day) => (
                    <td
                      key={day.key}
                      className="px-2 py-2 text-center border-r border-gray-300"
                    >
                      {dailyTotals[day.key].toFixed(2)}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-center font-bold text-black">
                    {lines
                      .reduce(
                        (acc, line) => acc + (parseFloat(line.totalHours) || 0),
                        0,
                      )
                      .toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
