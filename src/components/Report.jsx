// import React, { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import { useNavigate } from "react-router-dom";
// import { Receipt, Filter, Download, X, Eye, FileDown } from "lucide-react";
// import { FileText } from "lucide-react";
// import { backendUrl } from "./config";
// import { toast } from "react-toastify";

// const Report = () => {
//   const navigate = useNavigate();

//   const [currentUser, setCurrentUser] = useState(null);
//   const [userLoaded, setUserLoaded] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [expandedIndex, setExpandedIndex] = useState(null);
//   const [selectedEmployees, setSelectedEmployees] = useState(new Set());
//   const [selectAll, setSelectAll] = useState(false);
//   const [status, setStatus] = useState("");

//   // filters that map to EmployeeHoursReportRequest
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [vendorId, setVendorId] = useState("");
//   const [resourceId, setResourceId] = useState("");
//   const [poNumber, setPoNumber] = useState("");

//   const [rows, setRows] = useState([]);
//   const [columns, setColumns] = useState([]);

//   // load user
//   useEffect(() => {
//     const userInfo = localStorage.getItem("currentUser");
//     if (userInfo) {
//       try {
//         const parsedUser = JSON.parse(userInfo);
//         setCurrentUser(parsedUser);
//         setUserLoaded(true);
//       } catch (error) {
//         console.error("Error parsing user info:", error);
//         navigate("/");
//       }
//     } else {
//       navigate("/");
//     }
//   }, [navigate]);

//   const getStatusStyle = (status) => {
//     const baseStyle =
//       "px-2.5 py-1 text-xs font-semibold rounded-full text-center inline-block";

//     if (!status) return `${baseStyle} bg-gray-100 text-gray-800`;

//     const s = status.toString().toUpperCase().trim();

//     switch (s) {
//       case "OPEN":
//         return `${baseStyle} bg-blue-100 text-blue-800`;
//       case "APPROVED":
//         return `${baseStyle} bg-green-100 text-green-800`;
//       case "REJECTED":
//         return `${baseStyle} bg-pink-100 text-pink-700`;
//       case "PENDING":
//         return `${baseStyle} bg-yellow-100 text-yellow-800`;
//       case "SUBMITTED":
//         return `${baseStyle} bg-indigo-100 text-indigo-800`;
//       case "PROCESSED":
//         return `${baseStyle} bg-violet-100 text-violet-800`;
//       case "NOTIFIED":
//         return `${baseStyle} bg-blue-100 text-blue-800`;
//       case "UN-NOTIFIED":
//       case "UNNOTIFIED":
//         return `${baseStyle} bg-green-100 text-green-800`;
//       case "CORRECTION":
//         return `${baseStyle} bg-orange-100 text-orange-800`;
//       case "INVOICED":
//         return `${baseStyle} bg-amber-100 text-amber-800`;
//       case "EXPORTED":
//         return `${baseStyle} bg-sky-100 text-sky-800`;
//       default:
//         return `${baseStyle} bg-gray-100 text-gray-800`;
//     }
//   };

//   // optional config load hook you already had
//   useEffect(() => {
//     if (userLoaded && currentUser) {
//       if (typeof loadConfigValues === "function") {
//         loadConfigValues();
//       }
//     }
//   }, [userLoaded, currentUser]);

//   const buildRequestBody = () => {
//     // backend expects DateOnly? so send yyyy-MM-dd or null
//     const toDateOrNull = (val) => (val ? val : null);

//     return {
//       startDate: toDateOrNull(startDate),
//       endDate: toDateOrNull(endDate),
//       vendorId: vendorId || null,
//       resourceId: resourceId || null,
//       poNumber: poNumber || null,
//       status: status || null,
//     };
//   };

//   const handleFetchReport = async () => {
//     try {
//       setLoading(true);

//       const body = buildRequestBody();

//       const res = await fetch(
//         `${backendUrl}/api/Reports/employee-hours-report`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(body),
//         },
//       );

//       if (!res.ok) {
//         throw new Error(`Failed to load report: ${res.status}`);
//       }

//       const data = await res.json();

//       const safeData = Array.isArray(data) ? data : [];
//       setRows(safeData);

//       if (safeData.length > 0) {
//         setColumns(Object.keys(safeData[0]));
//       } else {
//         setColumns([]);
//       }

//       if (safeData.length === 0) {
//         toast.info("No data available for selected filters");
//       }
//     } catch (e) {
//       console.error(e);
//       toast.error(e.message || "Failed to load report");
//       setRows([]);
//       setColumns([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getRowKey = (row) =>
//     `${row.employeeId || ""}|${row.vendorId || ""}|${row.projectId || ""}|${row.plc || ""}|${row.poNumber || ""}`;

//   const handleToggleEmployee = (row) => {
//     const key = getRowKey(row);
//     setSelectedEmployees((prev) => {
//       const next = new Set(prev);
//       if (next.has(key)) {
//         next.delete(key);
//       } else {
//         next.add(key);
//       }
//       // update header checkbox
//       const allSelected =
//         rows.length > 0 && rows.every((r) => next.has(getRowKey(r)));
//       setSelectAll(allSelected);
//       return next;
//     });
//   };

//   const handleToggleAll = () => {
//     setSelectAll((prev) => {
//       const nextValue = !prev;
//       setSelectedEmployees(() => {
//         if (!nextValue) return new Set();
//         const all = new Set();
//         rows.forEach((r) => all.add(getRowKey(r)));
//         return all;
//       });
//       return nextValue;
//     });
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("currentUser");
//     setCurrentUser(null);
//     setUserLoaded(false);
//     navigate("/");
//   };

//   const downloadExcel = (allRows) => {
//     if (selectedEmployees.size === 0) {
//       toast.info("No employees selected to download");
//       return;
//     }

//     if (!allRows || allRows.length === 0) return;

//     const filteredRows = allRows.filter((r) =>
//       selectedEmployees.has(getRowKey(r)),
//     );

//     if (filteredRows.length === 0) {
//       toast.info("No employees selected to download");
//       return;
//     }

//     const wb = XLSX.utils.book_new();

//     // ========== SHEET 1: SUMMARY ==========
//     const wsSummary = XLSX.utils.aoa_to_sheet([]);
//     let rowIdx = 0;

//     const summaryHeaders = [
//       "Status",
//       "Employee ID",
//       "Employee Name",
//       "Vendor",
//       "Project",
//       "Project Name",
//       "PLC",
//       "PLC Description",
//       "PO Number",
//       "Total Hours",
//     ];

//     // Status color mapping (add more statuses as needed)
//     const statusColors = {
//       Correction: "FFE699", // Yellow
//       Submitted: "C6E0B4", // Green
//       Approved: "92D050", // Dark Green
//       Rejected: "FF6B6B", // Red
//       Pending: "D9D9D9", // Gray
//     };

//     // Add summary header (row 0)
//     summaryHeaders.forEach((h, i) => {
//       const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
//       wsSummary[cellRef] = {
//         t: "s",
//         v: h,
//         s: {
//           font: { bold: true, color: { rgb: "FFFFFF" } },
//           fill: { fgColor: { rgb: "366092" } }, // Dark blue header
//           alignment: { horizontal: "center", vertical: "center" },
//         },
//       };
//     });

//     // Add all employee summary rows (row 1+)
//     rowIdx = 1;
//     filteredRows.forEach((emp) => {
//       const status = emp.status ?? "";
//       const statusBgColor = statusColors[status] || "FFFFFF";

//       const summaryValues = [
//         status,
//         emp.employeeId ?? "",
//         emp.employeeName ?? "",
//         emp.vendorName ?? "",
//         emp.projectId ?? "",
//         emp.plc ?? "",
//         emp.poNumber ?? "",
//         emp.totalHours ?? "", // Total Hours column
//       ];

//       summaryValues.forEach((val, i) => {
//         const cellRef = XLSX.utils.encode_cell({ r: rowIdx, c: i });

//         // Apply status styling only to Status column (column 0)
//         const cellStyle =
//           i === 0
//             ? {
//                 fill: { fgColor: { rgb: statusBgColor } },
//                 font: { bold: true, color: { rgb: "000000" } },
//                 alignment: { horizontal: "center", vertical: "center" },
//               }
//             : {};

//         wsSummary[cellRef] = {
//           t: typeof val === "number" ? "n" : "s",
//           v: val,
//           s: cellStyle,
//         };
//       });

//       rowIdx++;
//     });

//     wsSummary["!cols"] = [
//       { wch: 12 }, // Status
//       { wch: 12 }, // Employee ID
//       { wch: 20 }, // Employee Name
//       { wch: 25 }, // Vendor
//       { wch: 25 }, // Project
//       { wch: 10 }, // PLC
//       { wch: 15 }, // PO Number
//       { wch: 12 }, // Total Hours
//     ];

//     wsSummary["!ref"] = XLSX.utils.encode_range({
//       s: { r: 0, c: 0 },
//       e: { r: rowIdx - 1, c: 7 }, // 8 columns (0-7)
//     });

//     // ========== SHEET 2: DETAILS ==========
//     const wsDetails = XLSX.utils.aoa_to_sheet([]);
//     rowIdx = 0;

//     const detailHeaders = [
//       "Employee ID",
//       "Employee Name",
//       "Timesheet Date",
//       "Description",
//       "Work Order",
//       "Pay Type",
//       "Hours",
//     ];

//     // Add detail header (row 0)
//     detailHeaders.forEach((h, i) => {
//       const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
//       wsDetails[cellRef] = {
//         t: "s",
//         v: h,
//         s: {
//           font: { bold: true, color: { rgb: "FFFFFF" } },
//           fill: { fgColor: { rgb: "366092" } },
//           alignment: { horizontal: "center", vertical: "center" },
//         },
//       };
//     });

//     // Add all detail rows (row 1+)
//     rowIdx = 1;
//     filteredRows.forEach((emp) => {
//       if (Array.isArray(emp.details) && emp.details.length > 0) {
//         emp.details.forEach((d) => {
//           const detailValues = [
//             emp.employeeId ?? "",
//             emp.employeeName ?? "",
//             d.timesheetDate ?? "",
//             d.description ?? "",
//             d.workOrder ?? "",
//             d.payType ?? "",
//             d.hours ?? "",
//           ];

//           detailValues.forEach((val, i) => {
//             const cellRef = XLSX.utils.encode_cell({ r: rowIdx, c: i });
//             wsDetails[cellRef] = {
//               t: typeof val === "number" ? "n" : "s",
//               v: val,
//             };
//           });

//           rowIdx++;
//         });
//       }
//     });

//     wsDetails["!cols"] = [
//       { wch: 12 }, // Employee ID
//       { wch: 20 }, // Employee Name
//       { wch: 15 }, // Timesheet Date
//       { wch: 30 }, // Description
//       { wch: 15 }, // Work Order
//       { wch: 10 }, // Pay Type
//       { wch: 8 }, // Hours
//     ];

//     wsDetails["!ref"] = XLSX.utils.encode_range({
//       s: { r: 0, c: 0 },
//       e: { r: rowIdx - 1, c: 6 },
//     });

//     // ========== ADD SHEETS TO WORKBOOK ==========
//     XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
//     XLSX.utils.book_append_sheet(wb, wsDetails, "Details");

//     // Download file
//     XLSX.writeFile(wb, "employee-hours-report.xlsx");

//     toast.success(
//       `Downloaded ${filteredRows.length} employee(s) successfully!`,
//     );
//   };

//   if (!userLoaded || !currentUser) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <span className="text-sm text-gray-600">Loading user session...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-2 text-sm sm:text-base text-gray-800">
//       <div>
//         <div className="flex flex-col gap-2">
//           <div className="flex items-center gap-2 bg-white rounded-sm p-4">
//             <FileText size={20} className="text-blue-600" />
//             <h2 className="text-lg font-bold text-gray-800">Reports</h2>
//           </div>
//         </div>

//         <div className="bg-white py-2 rounded mt-2">
//           {/* Filters block */}
//           <div className="px-4 pb-2">
//             <fieldset className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
//               <legend className="text-xs font-semibold text-gray-600 px-2">
//                 Filters
//               </legend>
//               <div className="flex flex-wrap gap-2 items-end">
//                 <div className="flex flex-col">
//                   <input
//                     type="text"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     onFocus={(e) => (e.target.type = "date")}
//                     onBlur={(e) => {
//                       if (!e.target.value) e.target.type = "text";
//                     }}
//                     className="input-style !w-32"
//                     placeholder="Start date"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <input
//                     type="text"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                     onFocus={(e) => (e.target.type = "date")}
//                     onBlur={(e) => {
//                       if (!e.target.value) e.target.type = "text";
//                     }}
//                     className="input-style !w-32"
//                     placeholder="End date"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <input
//                     type="text"
//                     value={vendorId}
//                     onChange={(e) => setVendorId(e.target.value)}
//                     className="input-style !w-32"
//                     placeholder="Vendor Id"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <input
//                     type="text"
//                     value={resourceId}
//                     onChange={(e) => setResourceId(e.target.value)}
//                     className="input-style !w-32"
//                     placeholder="Employee Id"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <input
//                     type="text"
//                     value={poNumber}
//                     onChange={(e) => setPoNumber(e.target.value)}
//                     className="input-style !w-32"
//                     placeholder="PO Number"
//                   />
//                 </div>
//                 <div className="flex flex-col">
//                   <select
//                     value={status}
//                     onChange={(e) => setStatus(e.target.value)}
//                     className="input-style !w-32"
//                   >
//                     <option value="">All</option>
//                     <option value="Open">Open</option>
//                     <option value="Submitted">Submitted</option>
//                     <option value="Approved">Approved</option>
//                     <option value="Rejected">Rejected</option>
//                     <option value="Correction">Correction</option>
//                   </select>
//                 </div>
//                 <button
//                   onClick={handleFetchReport}
//                   disabled={loading}
//                   className="btn1 btn-blue disabled:opacity-50"
//                 >
//                   {loading ? "Loading..." : "Generate"}
//                 </button>

//                 <button
//                   onClick={() => downloadExcel(rows)}
//                   disabled={!rows || rows.length === 0}
//                   className="btn1 btn-blue disabled:opacity-50"
//                   title="Download Excel"
//                 >
//                   <Download className="h-4 w-4" />
//                 </button>
//               </div>
//             </fieldset>
//           </div>

//           {/* Master / Detail Table */}
//           <div className="flex-1 overflow-hidden px-4 pb-4">
//             <div className="border border-gray-200 rounded bg-white shadow-sm overflow-y-auto h-[calc(100vh-300px)]">
//               <table className="w-full text-left border-collapse table-auto">
//                 <thead className="thead">
//                   <tr className="text-[10px] capitalize text-gray-500 border-b">
//                     <th className="th-thead w-8 text-center">
//                       <input
//                         type="checkbox"
//                         checked={selectAll && rows && rows.length > 0}
//                         onChange={handleToggleAll}
//                         className="accent-blue-600 cursor-pointer"
//                       />
//                     </th>
//                     <th className="th-thead">Status</th>
//                     <th className="th-thead">Employee ID</th>
//                     <th className="th-thead">Employee Name</th>
//                     {/* <th className="th-thead">Vendor</th> */}
//                     <th className="th-thead">Project</th>
//                     <th className="th-thead">Project Name</th>
//                     <th className="th-thead">PLC</th>
//                     <th className="th-thead">PLC Description</th>
//                     {/* <th className="th-thead">PO Number</th> */}
//                     <th className="th-thead text-right">Total Hours</th>
//                   </tr>
//                 </thead>
//                 <tbody className="tbody">
//                   {loading ? (
//                     <tr>
//                       <td colSpan={9} className="py-10">
//                         <div className="flex flex-col items-center justify-center">
//                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
//                           <span className="ml-2 mt-4 text-sm text-gray-500 font-medium">
//                             Loading...
//                           </span>
//                         </div>
//                       </td>
//                     </tr>
//                   ) : !rows || rows.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={9}
//                         className="py-10 text-center text-sm text-gray-500"
//                       >
//                         No data available
//                       </td>
//                     </tr>
//                   ) : (
//                     rows.map((row, idx) => {
//                       const isOpen = expandedIndex === idx;
//                       return (
//                         <React.Fragment key={idx}>
//                           {/* Master Row */}
//                           <tr
//                             className={`border-b border-gray-200 transition-colors text-xs text-gray-800 cursor-pointer ${
//                               isOpen ? "bg-blue-50" : "hover:bg-gray-50"
//                             }`}
//                             onClick={() =>
//                               setExpandedIndex(isOpen ? null : idx)
//                             }
//                           >
//                             <td
//                               className="p-2 border-r border-gray-200 text-center"
//                               onClick={(e) => e.stopPropagation()}
//                             >
//                               <input
//                                 type="checkbox"
//                                 checked={selectedEmployees.has(getRowKey(row))}
//                                 onChange={() => handleToggleEmployee(row)}
//                                 className="accent-blue-600 cursor-pointer"
//                               />
//                             </td>
//                             <td className="p-2 border-r border-gray-200">
//                               <span className={getStatusStyle(row.status)}>
//                                 {row.status}
//                               </span>
//                             </td>
//                             <td className="p-2 border-r border-gray-200">
//                               {row.employeeId}
//                             </td>
//                             <td className="p-2 border-r border-gray-200">
//                               {row.employeeName || "-"}
//                             </td>
//                             {/* <td className="p-2 border-r border-gray-200">
//                               {row.vendorId}{" "}
//                               {row.vendorName ? `- ${row.vendorName}` : ""}
//                             </td> */}
//                             <td className="p-2 border-r border-gray-200">
//                               {row.projectId}
//                             </td>
//                             <td className="p-2 border-r border-gray-200">
//                               {row.projectId}
//                             </td>
//                             <td className="p-2 border-r border-gray-200">
//                               {row.plc}
//                             </td>
//                             <td className="p-2 border-r border-gray-200">
//                               {row.plc}
//                             </td>
//                             {/* <td className="p-2 border-r border-gray-200">
//                               {row.poNumber}
//                             </td> */}
//                             <td className="p-2 border-r border-gray-200 text-right">
//                               {row.totalHours?.toFixed
//                                 ? row.totalHours.toFixed(2)
//                                 : row.totalHours}
//                             </td>
//                           </tr>

//                           {/* Nested Detail Row */}
//                           {isOpen && (
//                             <tr>
//                               <td
//                                 colSpan={9}
//                                 className="p-3 border-b border-gray-200 bg-gray-50/50 pl-10"
//                               >
//                                 {row.details && row.details.length > 0 ? (
//                                   <div className="border border-gray-200 rounded bg-white overflow-hidden shadow-xs">
//                                     <table className="w-full text-left border-collapse">
//                                       <thead className="thead">
//                                         <tr className="text-[10px] capitalize text-gray-500 border-b">
//                                           <th className="th-thead">
//                                             Timesheet Date
//                                           </th>
//                                           {/* <th className="th-thead">
//                                             Description
//                                           </th>
//                                           <th className="th-thead">
//                                             Work Order
//                                           </th> */}
//                                           <th className="th-thead">Pay Type</th>
//                                           <th className="th-thead text-right">
//                                             Hours
//                                           </th>
//                                         </tr>
//                                       </thead>
//                                       <tbody className="tbody">
//                                         {row.details.map((d, dIdx) => (
//                                           <tr
//                                             key={dIdx}
//                                             className="border-b border-gray-100 text-[11px] text-gray-700 hover:bg-gray-50"
//                                           >
//                                             <td className="p-2 border-r border-gray-100">
//                                               {d.timesheetDate}
//                                             </td>
//                                             {/* <td className="p-2 border-r border-gray-100">
//                                               {d.description}
//                                             </td>
//                                             <td className="p-2 border-r border-gray-100">
//                                               {d.workOrder}
//                                             </td> */}
//                                             <td className="p-2 border-r border-gray-100">
//                                               {d.payType}
//                                             </td>
//                                             <td className="p-2 border-r border-gray-100 text-right">
//                                               {d.hours?.toFixed
//                                                 ? d.hours.toFixed(2)
//                                                 : d.hours}
//                                             </td>
//                                           </tr>
//                                         ))}
//                                       </tbody>
//                                     </table>
//                                   </div>
//                                 ) : (
//                                   <div className="text-[11px] text-gray-500 py-1">
//                                     No detail rows available
//                                   </div>
//                                 )}
//                               </td>
//                             </tr>
//                           )}
//                         </React.Fragment>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // return (
//   //   <div className="min-h-screen bg-[#f9fafd] flex flex-col overflow-auto">
//   //     {/* Header */}
//   //     <div className="flex items-center justify-between px-8 py-4 pt-8 ">
//   //       <div className="flex items-center gap-3">
//   //         <FileText className="h-7 w-7 text-green-600" />
//   //         <h1 className="text-xl font-semibold text-gray-900">Reports</h1>
//   //       </div>

//   //       <div className="flex items-center gap-3">
//   //         <button
//   //           onClick={handleLogout}
//   //           className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1.5 rounded text-sm shadow-sm"
//   //         >
//   //           Logout
//   //         </button>
//   //       </div>
//   //     </div>

//   //     {/* Filters block – keep what you already have here */}
//   //     <div className="px-8 pt-1 pb-2">
//   //       <fieldset className="border border-gray-300 rounded-md p-4 bg-white shadow-sm">
//   //         <legend className="text-sm font-semibold text-gray-600 px-2">
//   //           Filters
//   //         </legend>
//   //         <div className="flex flex-wrap gap-2 items-end">
//   //           <div className="flex flex-col">
//   //             {/* <label className="text-xs font-semibold text-gray-600">
//   //               Start Date
//   //             </label> */}

//   //             <input
//   //               type="text"
//   //               value={startDate}
//   //               onChange={(e) => setStartDate(e.target.value)}
//   //               onFocus={(e) => (e.target.type = "date")}
//   //               onBlur={(e) => {
//   //                 if (!e.target.value) e.target.type = "text";
//   //               }}
//   //               className=" w-32 h-7 border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//   //               placeholder="Start date"
//   //             />
//   //           </div>
//   //           <div className="flex flex-col">
//   //             {/* <label className="text-xs font-semibold text-gray-600">
//   //               End Date
//   //             </label> */}

//   //             <input
//   //               type="text"
//   //               value={endDate}
//   //               onChange={(e) => setEndDate(e.target.value)}
//   //               onFocus={(e) => (e.target.type = "date")}
//   //               onBlur={(e) => {
//   //                 if (!e.target.value) e.target.type = "text";
//   //               }}
//   //               className=" w-32 h-7 border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//   //               placeholder="End date"
//   //             />
//   //           </div>
//   //           <div className="flex flex-col">
//   //             {/* <label className="text-xs font-semibold text-gray-600">
//   //               Vendor Id
//   //             </label> */}
//   //             <input
//   //               type="text"
//   //               value={vendorId}
//   //               onChange={(e) => setVendorId(e.target.value)}
//   //               className=" w-32  h-7 border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//   //               placeholder="Vendor Id"
//   //             />
//   //           </div>
//   //           <div className="flex flex-col">
//   //             {/* <label className="text-xs font-semibold text-gray-600">
//   //               Resource Id
//   //             </label> */}
//   //             <input
//   //               type="text"
//   //               value={resourceId}
//   //               onChange={(e) => setResourceId(e.target.value)}
//   //               className=" w-32 h-7 border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//   //               placeholder="Resource Id"
//   //             />
//   //           </div>
//   //           <div className="flex flex-col">
//   //             {/* <label className="text-xs font-semibold text-gray-600">
//   //               PO Number
//   //             </label> */}
//   //             <input
//   //               type="text"
//   //               value={poNumber}
//   //               onChange={(e) => setPoNumber(e.target.value)}
//   //               className=" w-32 h-7 border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//   //               placeholder="PO Number"
//   //             />
//   //           </div>
//   //           <div className="flex flex-col">
//   //             {/* <label className="text-xs font-semibold text-gray-600">
//   //   Status
//   // </label> */}
//   //             <select
//   //               value={status}
//   //               onChange={(e) => setStatus(e.target.value)}
//   //               className="w-32 h-7 border border-gray-300 rounded px-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//   //               placeholder="Status"
//   //             >
//   //               <option value="">All</option>
//   //               <option value="Open">Open</option>
//   //               <option value="Submitted">Submitted</option>
//   //               <option value="Approved">Approved</option>
//   //               <option value="Rejected">Rejected</option>
//   //               <option value="Correction">Correction</option>
//   //             </select>
//   //           </div>
//   //           <button
//   //             onClick={handleFetchReport}
//   //             disabled={loading}
//   //             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs font-semibold shadow-sm disabled:opacity-50"
//   //           >
//   //             {loading ? "Loading..." : "Generate"}
//   //           </button>

//   //           <button
//   //             onClick={() => downloadExcel(rows)}
//   //             disabled={!rows || rows.length === 0}
//   //             className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-xs font-semibold shadow-sm disabled:opacity-50"
//   //             title="Download Excel"
//   //           >
//   //             {/* Download */}
//   //             <Download className="h-4 w-4" />
//   //           </button>
//   //         </div>
//   //       </fieldset>
//   //     </div>

//   //     {/* Master / detail table */}
//   //     <div className="flex-1 px-8 pb-8 pt-4">
//   //       <div
//   //         className="border border-gray-300 rounded bg-white shadow-sm"
//   //         style={{ maxHeight: "550px", overflow: "auto" }} // vertical + horizontal scroll
//   //       >
//   //         {loading ? (
//   //           <div className="p-4 text-sm text-gray-600">Loading...</div>
//   //         ) : !rows || rows.length === 0 ? (
//   //           <div className="p-4 text-sm text-gray-600">No data available</div>
//   //         ) : (
//   //           <table className="min-w-full text-xs table-auto overflow-auto">
//   //             <thead className="bg-gray-100">
//   //               <tr>
//   //                 <th className="px-2 py-2 text-center font-semibold text-gray-700 border-b w-8">
//   //                   <input
//   //                     type="checkbox"
//   //                     checked={selectAll && rows.length > 0}
//   //                     onChange={handleToggleAll}
//   //                     className="cursor-pointer"
//   //                   />
//   //                 </th>
//   //                 <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b">
//   //                   Status
//   //                 </th>
//   //                 <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b">
//   //                   Employee ID
//   //                 </th>
//   //                 <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b">
//   //                   Employee Name
//   //                 </th>
//   //                 <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b">
//   //                   Vendor
//   //                 </th>
//   //                 <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b">
//   //                   Project
//   //                 </th>
//   //                 <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b">
//   //                   PLC
//   //                 </th>
//   //                 <th className="px-3 py-2 text-left font-semibold text-gray-700 border-b">
//   //                   PO Number
//   //                 </th>
//   //                 <th className="px-3 py-2 text-right font-semibold text-gray-700 border-b">
//   //                   Total Hours
//   //                 </th>
//   //               </tr>
//   //             </thead>
//   //             <tbody>
//   //               {rows.map((row, idx) => {
//   //                 const isOpen = expandedIndex === idx;
//   //                 return (
//   //                   <React.Fragment key={idx}>
//   //                     {/* Header row is clickable */}
//   //                     <tr
//   //                       className={`cursor-pointer ${isOpen ? "bg-blue-50" : "bg-gray-50"}`}
//   //                       onClick={() => setExpandedIndex(isOpen ? null : idx)}
//   //                     >
//   //                       <td className="px-2 py-1.5 border-b text-center">
//   //                         <input
//   //                           type="checkbox"
//   //                           checked={selectedEmployees.has(getRowKey(row))}
//   //                           onChange={() => handleToggleEmployee(row)}
//   //                           className="cursor-pointer"
//   //                         />
//   //                       </td>
//   //                       <td className="px-3 py-1.5 border-b text-gray-800">
//   //                         <span className={getStatusStyle(row.status)}>
//   //                           {row.status}
//   //                         </span>
//   //                       </td>
//   //                       <td className="px-3 py-1.5 border-b text-gray-800">
//   //                         {row.employeeId}
//   //                       </td>
//   //                       <td className="px-3 py-1.5 border-b text-gray-800">
//   //                         {row.employeeName || "-"}
//   //                       </td>
//   //                       <td className="px-3 py-1.5 border-b text-gray-800">
//   //                         {row.vendorId}{" "}
//   //                         {row.vendorName ? `- ${row.vendorName}` : ""}
//   //                       </td>
//   //                       <td className="px-3 py-1.5 border-b text-gray-800">
//   //                         {row.projectId}
//   //                       </td>
//   //                       <td className="px-3 py-1.5 border-b text-gray-800">
//   //                         {row.plc}
//   //                       </td>
//   //                       <td className="px-3 py-1.5 border-b text-gray-800">
//   //                         {row.poNumber}
//   //                       </td>
//   //                       <td className="px-3 py-1.5 border-b text-right text-gray-800">
//   //                         {row.totalHours?.toFixed
//   //                           ? row.totalHours.toFixed(2)
//   //                           : row.totalHours}
//   //                       </td>
//   //                     </tr>

//   //                     {/* Detail row shown only when expanded */}
//   //                     {isOpen && (
//   //                       <tr>
//   //                         <td
//   //                           colSpan={7}
//   //                           className="px-3 pb-2 pt-1 pl-10 border-b bg-white"
//   //                         >
//   //                           {row.details && row.details.length > 0 ? (
//   //                             <table className="w-full text-[11px] border border-gray-200">
//   //                               <thead className="bg-gray-100">
//   //                                 <tr>
//   //                                   <th className="px-2 py-1 text-left font-semibold text-gray-700 border-b">
//   //                                     Timesheet Date
//   //                                   </th>
//   //                                   <th className="px-2 py-1 text-left font-semibold text-gray-700 border-b">
//   //                                     Description
//   //                                   </th>
//   //                                   <th className="px-2 py-1 text-left font-semibold text-gray-700 border-b">
//   //                                     Work Order
//   //                                   </th>
//   //                                   <th className="px-2 py-1 text-left font-semibold text-gray-700 border-b">
//   //                                     Pay Type
//   //                                   </th>
//   //                                   <th className="px-2 py-1 text-right font-semibold text-gray-700 border-b">
//   //                                     Hours
//   //                                   </th>
//   //                                 </tr>
//   //                               </thead>
//   //                               <tbody>
//   //                                 {row.details.map((d, dIdx) => (
//   //                                   <tr key={dIdx} className="hover:bg-gray-50">
//   //                                     <td className="px-2 py-0.5 border-b text-gray-800">
//   //                                       {d.timesheetDate}
//   //                                     </td>
//   //                                     <td className="px-2 py-0.5 border-b text-gray-800">
//   //                                       {d.description}
//   //                                     </td>
//   //                                     <td className="px-2 py-0.5 border-b text-gray-800">
//   //                                       {d.workOrder}
//   //                                     </td>
//   //                                     <td className="px-2 py-0.5 border-b text-gray-800">
//   //                                       {d.payType}
//   //                                     </td>
//   //                                     <td className="px-2 py-0.5 border-b text-right text-gray-800">
//   //                                       {d.hours?.toFixed
//   //                                         ? d.hours.toFixed(2)
//   //                                         : d.hours}
//   //                                     </td>
//   //                                   </tr>
//   //                                 ))}
//   //                               </tbody>
//   //                             </table>
//   //                           ) : (
//   //                             <div className="text-[11px] text-gray-500">
//   //                               No detail rows
//   //                             </div>
//   //                           )}
//   //                         </td>
//   //                       </tr>
//   //                     )}
//   //                   </React.Fragment>
//   //                 );
//   //               })}
//   //             </tbody>
//   //           </table>
//   //         )}
//   //       </div>
//   //     </div>
//   //   </div>
//   // );
// };

// export default Report;

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import {
  Receipt,
  Filter,
  Download,
  X,
  Eye,
  FileDown,
  FileText,
} from "lucide-react";
import { backendUrl } from "./config";
import { toast } from "react-toastify";

const Report = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [status, setStatus] = useState("");

  // Pay Types state loaded dynamically from API
  const [payTypes, setPayTypes] = useState([]);

  // filters that map to EmployeeHoursReportRequest
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [poNumber, setPoNumber] = useState("");

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  // load user session
  useEffect(() => {
    const userInfo = localStorage.getItem("currentUser");
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setCurrentUser(parsedUser);
        setUserLoaded(true);
      } catch (error) {
        console.error("Error parsing user info:", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Fetch Pay Types from API on mount
  useEffect(() => {
    const fetchPayTypes = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/PayType`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch Pay Types");

        const data = await response.json();
        setPayTypes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching Pay Types:", error);
      }
    };

    fetchPayTypes();
  }, []);

  const getStatusStyle = (status) => {
    const baseStyle =
      "px-2.5 py-1 text-xs font-semibold rounded-full text-center inline-block";

    if (!status) return `${baseStyle} bg-gray-100 text-gray-800`;

    const s = status.toString().toUpperCase().trim();

    switch (s) {
      case "OPEN":
        return `${baseStyle} bg-blue-100 text-blue-800`;
      case "APPROVED":
        return `${baseStyle} bg-green-100 text-green-800`;
      case "REJECTED":
        return `${baseStyle} bg-pink-100 text-pink-700`;
      case "PENDING":
        return `${baseStyle} bg-yellow-100 text-yellow-800`;
      case "SUBMITTED":
        return `${baseStyle} bg-indigo-100 text-indigo-800`;
      case "PROCESSED":
        return `${baseStyle} bg-violet-100 text-violet-800`;
      case "NOTIFIED":
        return `${baseStyle} bg-blue-100 text-blue-800`;
      case "UN-NOTIFIED":
      case "UNNOTIFIED":
        return `${baseStyle} bg-green-100 text-green-800`;
      case "CORRECTION":
        return `${baseStyle} bg-orange-100 text-orange-800`;
      case "INVOICED":
        return `${baseStyle} bg-amber-100 text-amber-800`;
      case "EXPORTED":
        return `${baseStyle} bg-sky-100 text-sky-800`;
      default:
        return `${baseStyle} bg-gray-100 text-gray-800`;
    }
  };

  const buildRequestBody = () => {
    const toDateOrNull = (val) => (val ? val : null);

    return {
      startDate: toDateOrNull(startDate),
      endDate: toDateOrNull(endDate),
      vendorId: vendorId || null,
      resourceId: resourceId || null,
      poNumber: poNumber || null,
      status: status || null,
    };
  };

  const handleFetchReport = async () => {
    try {
      setLoading(true);

      const body = buildRequestBody();

      const res = await fetch(
        `${backendUrl}/api/Reports/employee-hours-report`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to load report: ${res.status}`);
      }

      const data = await res.json();

      const safeData = Array.isArray(data) ? data : [];
      setRows(safeData);

      if (safeData.length > 0) {
        setColumns(Object.keys(safeData[0]));
      } else {
        setColumns([]);
      }

      if (safeData.length === 0) {
        toast.info("No data available for selected filters");
      }
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to load report");
      setRows([]);
      setColumns([]);
    } finally {
      setLoading(false);
    }
  };

  const getRowKey = (row) =>
    `${row.employeeId || ""}|${row.vendorId || ""}|${row.projectId || ""}|${row.plc || ""}|${row.poNumber || ""}`;

  const handleToggleEmployee = (row) => {
    const key = getRowKey(row);
    setSelectedEmployees((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      const allSelected =
        rows.length > 0 && rows.every((r) => next.has(getRowKey(r)));
      setSelectAll(allSelected);
      return next;
    });
  };

  const handleToggleAll = () => {
    setSelectAll((prev) => {
      const nextValue = !prev;
      setSelectedEmployees(() => {
        if (!nextValue) return new Set();
        const all = new Set();
        rows.forEach((r) => all.add(getRowKey(r)));
        return all;
      });
      return nextValue;
    });
  };

  const downloadExcel = (allRows) => {
    if (selectedEmployees.size === 0) {
      toast.info("No employees selected to download");
      return;
    }

    if (!allRows || allRows.length === 0) return;

    const filteredRows = allRows.filter((r) =>
      selectedEmployees.has(getRowKey(r)),
    );

    if (filteredRows.length === 0) {
      toast.info("No employees selected to download");
      return;
    }

    const wb = XLSX.utils.book_new();

    // ========== SHEET 1: SUMMARY ==========
    const wsSummary = XLSX.utils.aoa_to_sheet([]);
    let rowIdx = 0;

    // Matches the exact columns shown in your UI table
    const summaryHeaders = [
      "Status",
      "Employee ID",
      "Employee Name",
      "Project",
      "Project Name",
      "PLC",
      "PLC Description",
      "Total Hours",
    ];

    const statusColors = {
      Correction: "FFE699",
      Submitted: "C6E0B4",
      Approved: "92D050",
      Rejected: "FF6B6B",
      Pending: "D9D9D9",
    };

    // Add summary header (row 0)
    summaryHeaders.forEach((h, i) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
      wsSummary[cellRef] = {
        t: "s",
        v: h,
        s: {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "366092" } },
          alignment: { horizontal: "center", vertical: "center" },
        },
      };
    });

    // Add employee summary rows (row 1+)
    rowIdx = 1;
    filteredRows.forEach((emp) => {
      const status = emp.status ?? "";
      const statusBgColor = statusColors[status] || "FFFFFF";

      const summaryValues = [
        status,
        emp.employeeId ?? "",
        emp.employeeName ?? "",
        emp.projectId ?? "",
        emp.projectName ?? emp.projectId ?? "",
        emp.plc ?? "",
        emp.plcDescription ?? emp.plc ?? "",
        emp.totalHours ?? 0,
      ];

      summaryValues.forEach((val, i) => {
        const cellRef = XLSX.utils.encode_cell({ r: rowIdx, c: i });

        const cellStyle =
          i === 0
            ? {
                fill: { fgColor: { rgb: statusBgColor } },
                font: { bold: true, color: { rgb: "000000" } },
                alignment: { horizontal: "center", vertical: "center" },
              }
            : {};

        wsSummary[cellRef] = {
          t: typeof val === "number" ? "n" : "s",
          v: val,
          s: cellStyle,
        };
      });

      rowIdx++;
    });

    wsSummary["!cols"] = [
      { wch: 14 }, // Status
      { wch: 15 }, // Employee ID
      { wch: 22 }, // Employee Name
      { wch: 20 }, // Project
      { wch: 25 }, // Project Name
      { wch: 15 }, // PLC
      { wch: 25 }, // PLC Description
      { wch: 14 }, // Total Hours
    ];

    wsSummary["!ref"] = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: rowIdx - 1, c: 7 }, // 8 columns total (0 to 7)
    });

    // ========== SHEET 2: DETAILS ==========
    const wsDetails = XLSX.utils.aoa_to_sheet([]);
    rowIdx = 0;

    const detailHeaders = [
      "Employee ID",
      "Employee Name",
      "Timesheet Date",
      "Pay Type",
      "Hours",
    ];

    detailHeaders.forEach((h, i) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
      wsDetails[cellRef] = {
        t: "s",
        v: h,
        s: {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "366092" } },
          alignment: { horizontal: "center", vertical: "center" },
        },
      };
    });

    rowIdx = 1;
    filteredRows.forEach((emp) => {
      if (Array.isArray(emp.details) && emp.details.length > 0) {
        emp.details.forEach((d) => {
          const matchedPayType = payTypes.find(
            (pt) => pt.name === d.payType || pt.id === d.payType,
          );
          const payTypeDisplay = matchedPayType
            ? matchedPayType.description
            : d.payType;

          const detailValues = [
            emp.employeeId ?? "",
            emp.employeeName ?? "",
            d.timesheetDate ?? "",
            payTypeDisplay ?? "",
            d.hours ?? 0,
          ];

          detailValues.forEach((val, i) => {
            const cellRef = XLSX.utils.encode_cell({ r: rowIdx, c: i });
            wsDetails[cellRef] = {
              t: typeof val === "number" ? "n" : "s",
              v: val,
            };
          });

          rowIdx++;
        });
      }
    });

    wsDetails["!cols"] = [
      { wch: 15 }, // Employee ID
      { wch: 22 }, // Employee Name
      { wch: 16 }, // Timesheet Date
      { wch: 18 }, // Pay Type
      { wch: 12 }, // Hours
    ];

    wsDetails["!ref"] = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: rowIdx - 1, c: 4 }, // 5 columns total (0 to 4)
    });

    // ========== ADD SHEETS TO WORKBOOK ==========
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
    XLSX.utils.book_append_sheet(wb, wsDetails, "Details");

    XLSX.writeFile(wb, "employee-hours-report.xlsx");

    toast.success(
      `Downloaded ${filteredRows.length} employee(s) successfully!`,
    );
  };

  if (!userLoaded || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-sm text-gray-600">Loading user session...</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm sm:text-base text-gray-800">
      <div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-white rounded-sm p-4">
            <FileText size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">Reports</h2>
          </div>
        </div>

        <div className="bg-white py-2 rounded mt-2">
          {/* Filters block */}
          <div className="px-4 pb-2">
            <fieldset className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
              <legend className="text-xs font-semibold text-gray-600 px-2">
                Filters
              </legend>
              <div className="flex flex-wrap gap-2 items-end">
                <div className="flex flex-col">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-style !w-32"
                    placeholder="Start date"
                  />
                </div>
                <div className="flex flex-col">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input-style !w-32"
                    placeholder="End date"
                  />
                </div>
                {/* <div className="flex flex-col">
                  <input
                    type="text"
                    value={vendorId}
                    onChange={(e) => setVendorId(e.target.value)}
                    className="input-style !w-32"
                    placeholder="Vendor ID"
                  />
                </div> */}
                <div className="flex flex-col">
                  <input
                    type="text"
                    value={resourceId}
                    onChange={(e) => setResourceId(e.target.value)}
                    className="input-style !w-32"
                    placeholder="Employee ID"
                  />
                </div>
                {/* <div className="flex flex-col">
                  <input
                    type="text"
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    className="input-style !w-32"
                    placeholder="PO Number"
                  />
                </div> */}
                <div className="flex flex-col">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="input-style !w-32"
                  >
                    <option value="">All</option>
                    <option value="Open">Open</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Correction">Correction</option>
                  </select>
                </div>
                <button
                  onClick={handleFetchReport}
                  disabled={loading}
                  className="btn1 btn-blue disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Generate"}
                </button>

                <button
                  onClick={() => downloadExcel(rows)}
                  disabled={!rows || rows.length === 0}
                  className="btn1 btn-blue disabled:opacity-50"
                  title="Download Excel"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </fieldset>
          </div>

          {/* Master / Detail Table */}
          <div className="flex-1 overflow-hidden px-4 pb-4">
            <div className="border border-gray-200 rounded bg-white shadow-sm overflow-y-auto h-[calc(100vh-300px)]">
              <table className="w-full text-left border-collapse table-auto">
                <thead className="thead">
                  <tr className="text-[10px] capitalize text-gray-500 border-b">
                    <th className="th-thead w-8 text-center">
                      <input
                        type="checkbox"
                        checked={selectAll && rows && rows.length > 0}
                        onChange={handleToggleAll}
                        className="accent-blue-600 cursor-pointer"
                      />
                    </th>
                    <th className="th-thead">Status</th>
                    <th className="th-thead">Employee ID</th>
                    <th className="th-thead">Employee Name</th>
                    <th className="th-thead">Project</th>
                    <th className="th-thead">Project Name</th>
                    <th className="th-thead">PLC</th>
                    <th className="th-thead">PLC Description</th>
                    <th className="th-thead text-right">Total Hours</th>
                  </tr>
                </thead>
                <tbody className="tbody">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="py-10">
                        <div className="flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                          <span className="ml-2 mt-4 text-sm text-gray-500 font-medium">
                            Loading...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : !rows || rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-10 text-center text-sm text-gray-500"
                      >
                        No data available
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, idx) => {
                      const isOpen = expandedIndex === idx;
                      return (
                        <React.Fragment key={idx}>
                          {/* Master Row */}
                          <tr
                            className={`border-b border-gray-200 transition-colors text-xs text-gray-800 cursor-pointer ${
                              isOpen ? "bg-blue-50" : "hover:bg-gray-50"
                            }`}
                            onClick={() =>
                              setExpandedIndex(isOpen ? null : idx)
                            }
                          >
                            <td
                              className="p-2 border-r border-gray-200 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={selectedEmployees.has(getRowKey(row))}
                                onChange={() => handleToggleEmployee(row)}
                                className="accent-blue-600 cursor-pointer"
                              />
                            </td>
                            <td className="p-2 border-r border-gray-200">
                              <span className={getStatusStyle(row.status)}>
                                {row.status}
                              </span>
                            </td>
                            <td className="p-2 border-r border-gray-200">
                              {row.employeeId}
                            </td>
                            <td className="p-2 border-r border-gray-200">
                              {row.employeeName || "-"}
                            </td>
                            <td className="p-2 border-r border-gray-200">
                              {row.projectId}
                            </td>
                            <td className="p-2 border-r border-gray-200">
                              {row.projectId}
                            </td>
                            <td className="p-2 border-r border-gray-200">
                              {row.plc}
                            </td>
                            <td className="p-2 border-r border-gray-200">
                              {row.plc}
                            </td>
                            <td className="p-2 border-r border-gray-200 text-right">
                              {row.totalHours?.toFixed
                                ? row.totalHours.toFixed(2)
                                : row.totalHours}
                            </td>
                          </tr>

                          {/* Nested Detail Row */}
                          {isOpen && (
                            <tr>
                              <td
                                colSpan={9}
                                className="p-3 border-b border-gray-200 bg-gray-50/50 pl-10"
                              >
                                {row.details && row.details.length > 0 ? (
                                  <div className="border border-gray-200 rounded bg-white overflow-hidden shadow-xs">
                                    <table className="w-full text-left border-collapse">
                                      <thead className="thead">
                                        <tr className="text-[10px] capitalize text-gray-500 border-b">
                                          <th className="th-thead">
                                            Timesheet Date
                                          </th>
                                          <th className="th-thead">Pay Type</th>
                                          <th className="th-thead text-right">
                                            Hours
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody className="tbody">
                                        {row.details.map((d, dIdx) => {
                                          // Find the matching payType description from fetched payTypes
                                          const matchedPayType = payTypes.find(
                                            (pt) =>
                                              pt.name === d.payType ||
                                              pt.id === d.payType,
                                          );
                                          const payTypeDisplay = matchedPayType
                                            ? matchedPayType.description
                                            : d.payType;

                                          return (
                                            <tr
                                              key={dIdx}
                                              className="border-b border-gray-100 text-[11px] text-gray-700 hover:bg-gray-50"
                                            >
                                              <td className="p-2 border-r border-gray-100">
                                                {d.timesheetDate}
                                              </td>
                                              <td className="p-2 border-r border-gray-100">
                                                {payTypeDisplay}
                                              </td>
                                              <td className="p-2 border-r border-gray-100 text-right">
                                                {d.hours?.toFixed
                                                  ? d.hours.toFixed(2)
                                                  : d.hours}
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <div className="text-[11px] text-gray-500 py-1">
                                    No detail rows available
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
