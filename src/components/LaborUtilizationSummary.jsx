// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// // import html2pdf from "html2pdf.js";
// // import * as XLSX from "xlsx";
// import XLSX from "xlsx-js-style";
// import { backendUrl } from "./config";

// const months = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];

// // export const LaborUtilizationSummary = () => {
// //   const [selectedYear, setSelectedYear] = useState("2026");
// //   const [expandedEmps, setExpandedEmps] = useState({});

// //   const [apiResponseData, setApiResponseData] = useState([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   // === [ADDED STATE FOR FILTERS] ===
// //   const [empIdFilter, setEmpIdFilter] = useState("");
// //   const [remHoursFilter, setRemHoursFilter] = useState("");
// //   const [remPercentFilter, setRemPercentFilter] = useState("");

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setIsLoading(true);
// //       setError(null);

// //       try {
// //         const response = await axios.post(
// //           `${backendUrl}/Forecast/GetAllEmployeeScheduleAsync/${selectedYear}`,
// //         );
// //         setApiResponseData(response.data);
// //       } catch (err) {
// //         const errorMessage =
// //           err.response?.data?.message ||
// //           err.message ||
// //           "An error occurred while fetching utilization data.";
// //         setError(errorMessage);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [selectedYear]);

// //   const toggleEmpExpand = (empId, e) => {
// //     e.stopPropagation();
// //     setExpandedEmps((prev) => ({
// //       ...prev,
// //       [empId]: !prev[empId],
// //     }));
// //   };

// //   // === [ADDED FILTERING LOGIC] ===
// //   const filteredData = apiResponseData.filter((emp) => {
// //     // 1. Employee ID Filter (Case-insensitive substring match)
// //     if (
// //       empIdFilter.trim() !== "" &&
// //       !String(emp.emplId || "")
// //         .toLowerCase()
// //         .includes(empIdFilter.trim().toLowerCase())
// //     ) {
// //       return false;
// //     }

// //     // Calculate total standard & total utilized hours for filtering
// //     let empStd = 0;
// //     let empUtil = 0;
// //     emp.schedule?.forEach((sch) => {
// //       empStd += sch.standardHours || 0;
// //       empUtil += sch.utilizedHours || 0;
// //     });
// //     const empRem = empStd - empUtil;
// //     const empRemPct = empStd > 0 ? (empRem / empStd) * 100 : 0;

// //     // 2. Remaining Hours Filter (Shows rows with Remaining Hours <= filter value)
// //     if (remHoursFilter !== "" && !isNaN(Number(remHoursFilter))) {
// //       if (empRem > Number(remHoursFilter)) {
// //         return false;
// //       }
// //     }

// //     // 3. Remaining Percent Filter (Shows rows with Remaining % <= filter value)
// //     if (remPercentFilter !== "" && !isNaN(Number(remPercentFilter))) {
// //       if (empRemPct > Number(remPercentFilter)) {
// //         return false;
// //       }
// //     }

// //     return true;
// //   });

// //   // --- PDF Export ---
// //   const exportToPDF = () => {
// //     const element = document.getElementById("utilization-report-container");
// //     if (!element) return;

// //     const options = {
// //       margin: [0.3, 0.3, 0.4, 0.3],
// //       filename: `Labor_Utilization_${selectedYear}.pdf`,
// //       image: { type: "jpeg", quality: 0.98 },
// //       html2canvas: { scale: 2, useCORS: true, logging: false },
// //       jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
// //     };

// //     html2pdf().set(options).from(element).save();
// //   };

// //   // --- Excel Export ---
// //   const exportToExcel = () => {
// //     const excelRows = [];

// //     excelRows.push([
// //       "Emp ID",
// //       "Employee Name",
// //       // "Status",
// //       "Type",
// //       "Project Code",
// //       "Project Name",
// //       ...months.flatMap((m) => [`${m} ${selectedYear}`, "", "", ""]),
// //       "Total Summary",
// //       "",
// //       "",
// //       "",
// //     ]);

// //     excelRows.push([
// //       "",
// //       "",
// //       "",
// //       "",
// //       "",
// //       "",
// //       ...months.flatMap(() => ["Std (h)", "Util (h)", "Rem (h)", "Rem %"]),
// //       "Total Std",
// //       "Total Util",
// //       "Total Rem",
// //       "Total Rem %",
// //     ]);

// //     apiResponseData.forEach((emp) => {
// //       let totalStd = 0;
// //       let totalUtil = 0;

// //       const monthMetrics = months.flatMap((_, mIdx) => {
// //         const sch = emp.schedule?.find((s) => s.month === mIdx + 1);
// //         if (sch) {
// //           totalStd += sch.standardHours || 0;
// //           totalUtil += sch.utilizedHours || 0;
// //           return [
// //             sch.standardHours,
// //             sch.utilizedHours,
// //             sch.remainingHours,
// //             `${sch.remainingPercent}%`,
// //           ];
// //         }
// //         return ["-", "-", "-", "-"];
// //       });

// //       const totalRem = totalStd - totalUtil;
// //       const totalRemPct =
// //         totalStd > 0 ? ((totalRem / totalStd) * 100).toFixed(1) : "0.0";

// //       excelRows.push([
// //         emp.emplId,
// //         emp.employeeName,
// //         // emp.status,
// //         "EMPLOYEE TOTAL",
// //         "-",
// //         "-",
// //         ...monthMetrics,
// //         totalStd,
// //         totalUtil,
// //         totalRem,
// //         `${totalRemPct}%`,
// //       ]);

// //       const projectMap = {};
// //       emp.schedule?.forEach((sch) => {
// //         sch.projects?.forEach((p) => {
// //           if (!projectMap[p.projId]) {
// //             projectMap[p.projId] = {
// //               name: p.projectName,
// //               months: Array(12).fill(0),
// //             };
// //           }
// //           projectMap[p.projId].months[sch.month - 1] += p.hours;
// //         });
// //       });

// //       Object.entries(projectMap).forEach(([projId, projData]) => {
// //         const pTotal = projData.months.reduce((a, b) => a + b, 0);
// //         const projMonthCells = projData.months.flatMap((h) => [
// //           "-",
// //           h,
// //           "-",
// //           "-",
// //         ]);
// //         excelRows.push([
// //           "",
// //           "",
// //           "",
// //           "",
// //           projId,
// //           projData.name,
// //           ...projMonthCells,
// //           "-",
// //           pTotal,
// //           "-",
// //           "-",
// //         ]);
// //       });
// //     });

// //     const worksheet = XLSX.utils.aoa_to_sheet(excelRows);
// //     const workbook = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(workbook, worksheet, "Utilization Summary");
// //     XLSX.writeFile(workbook, `Labor_Utilization_${selectedYear}.xlsx`);
// //   };

// //   let totalOrgStd = 0;
// //   let totalOrgUtil = 0;

// //   apiResponseData.forEach((emp) => {
// //     emp.schedule?.forEach((sch) => {
// //       totalOrgStd += sch.standardHours || 0;
// //       totalOrgUtil += sch.utilizedHours || 0;
// //     });
// //   });

// //   const totalOrgRem = totalOrgStd - totalOrgUtil;
// //   const totalOrgRemPct =
// //     totalOrgStd > 0 ? ((totalOrgRem / totalOrgStd) * 100).toFixed(1) : "0.0";

// //   return (
// //     <div
// //       id="utilization-report-container"
// //       className="my-4 font-sans flex flex-col gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800"
// //     >
// //       {/* Top Controls Header */}
// //       <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
// //         <div>
// //           <h2 className="text-base font-bold text-slate-800 m-0 flex items-center gap-2">
// //             <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
// //             Labor Utilization Summary
// //           </h2>
// //           <p className="text-xs text-slate-500 m-0 mt-0.5">
// //             Resource allocation matrix grouped by standard, utilized, and
// //             remaining metrics
// //           </p>
// //         </div>

// //         <div className="flex items-center gap-2">
// //           <select
// //             value={selectedYear}
// //             onChange={(e) => setSelectedYear(e.target.value)}
// //             className="bg-white border border-slate-300 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer outline-none"
// //           >
// //             <option value="2026">2026 Financials</option>
// //             <option value="2025">2025 Financials</option>
// //           </select>

// //           <button
// //             onClick={exportToExcel}
// //             disabled={isLoading || apiResponseData.length === 0}
// //             className="bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-xs"
// //           >
// //             📊 Excel
// //           </button>
// //           <button
// //             onClick={exportToPDF}
// //             disabled={isLoading || apiResponseData.length === 0}
// //             className="bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 text-indigo-700 border border-indigo-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-xs"
// //           >
// //             📄 PDF
// //           </button>
// //         </div>
// //       </div>

// //       {isLoading && (
// //         <div className="p-8 text-center text-xs font-semibold text-slate-500 bg-white rounded-lg border border-slate-200">
// //           Loading labor utilization data...
// //         </div>
// //       )}

// //       {error && (
// //         <div className="p-4 text-xs font-semibold text-red-600 bg-red-50 rounded-lg border border-red-200">
// //           {error}
// //         </div>
// //       )}

// //       {!isLoading && !error && (
// //         <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
// //           <div className="overflow-x-auto">
// //             <table className="w-full border-collapse text-xs text-left">
// //               <thead>
// //                 {/* Level 1 Header - Soft Indigo/Slate Palette */}
// //                 <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold text-center">
// //                   <th
// //                     rowSpan={2}
// //                     className="p-2 w-6 text-center border-r border-slate-200 bg-slate-100/80"
// //                   ></th>
// //                   <th
// //                     rowSpan={2}
// //                     className="p-2 min-w-[140px] text-left border-r border-slate-200 bg-slate-100/80 text-slate-700"
// //                   >
// //                     Name
// //                   </th>
// //                   {/* <th
// //                     rowSpan={2}
// //                     className="p-2 min-w-[60px] text-center border-r border-slate-200 bg-slate-100/80 text-slate-700"
// //                   >
// //                     Status
// //                   </th> */}

// //                   {months.map((m, mIdx) => {
// //                     const monthStdHours = apiResponseData[0]?.schedule?.find(
// //                       (s) => s.month === mIdx + 1,
// //                     )?.standardHours;

// //                     return (
// //                       <th
// //                         key={m}
// //                         colSpan={3}
// //                         className="p-2 border-r border-slate-200 border-b bg-indigo-50/50 text-slate-700"
// //                       >
// //                         <div className="font-semibold">
// //                           {m} {selectedYear}
// //                         </div>
// //                         {monthStdHours && (
// //                           <div className="text-[10px] font-normal text-slate-500 font-mono">
// //                             {monthStdHours}h
// //                           </div>
// //                         )}
// //                       </th>
// //                     );
// //                   })}

// //                   <th
// //                     colSpan={4}
// //                     className="p-2 bg-slate-200/60 border-l border-slate-300 text-slate-800 font-bold"
// //                   >
// //                     Total Summary
// //                   </th>
// //                 </tr>

// //                 {/* Level 2 Sub-Headers - Distinct & Purposeful Colors */}
// //                 <tr className="border-b border-slate-200 text-[11px] font-semibold text-center">
// //                   {months.map((m) => (
// //                     <React.Fragment key={`${m}-subheaders`}>
// //                       {/* Util Column Header */}
// //                       <th className="p-1.5 w-14 border-r border-slate-200 bg-slate-100/80 text-slate-600 font-mono">
// //                         Util
// //                       </th>
// //                       {/* Rem Column Header */}
// //                       <th className="p-1.5 w-14 border-r border-slate-200 bg-slate-100/80 text-slate-600 font-mono">
// //                         Rem
// //                       </th>
// //                       {/* Rem % Column Header */}
// //                       <th className="p-1.5 w-14 border-r border-slate-200 bg-slate-100/80 text-slate-600 font-mono">
// //                         Rem %
// //                       </th>
// //                     </React.Fragment>
// //                   ))}

// //                   {/* <th className="p-1.5 w-14 border-l border-slate-300 bg-slate-100 text-slate-700 font-mono">
// //                     Std
// //                   </th> */}
// //                   <th className="p-1.5 w-16 bg-slate-100 text-slate-700 font-mono">
// //                     Util
// //                   </th>
// //                   <th className="p-1.5 w-16 bg-slate-100 text-slate-700 font-mono">
// //                     Rem
// //                   </th>
// //                   <th className="p-1.5 w-16 bg-slate-100 text-slate-700 font-mono">
// //                     Rem %
// //                   </th>
// //                 </tr>
// //               </thead>

// //               <tbody className="divide-y divide-slate-200">
// //                 {apiResponseData.map((emp) => {
// //                   const isExpanded = !!expandedEmps[emp.emplId];
// //                   const empProjectsMap = {};
// //                   let empStdTotal = 0;
// //                   let empUtilTotal = 0;

// //                   emp.schedule?.forEach((sch) => {
// //                     empStdTotal += sch.standardHours || 0;
// //                     empUtilTotal += sch.utilizedHours || 0;

// //                     sch.projects?.forEach((proj) => {
// //                       if (!empProjectsMap[proj.projId]) {
// //                         empProjectsMap[proj.projId] = {
// //                           code: proj.projId,
// //                           name: proj.projectName,
// //                           hours: Array(12).fill(0),
// //                         };
// //                       }
// //                       empProjectsMap[proj.projId].hours[sch.month - 1] +=
// //                         proj.hours;
// //                     });
// //                   });

// //                   const projectRows = Object.values(empProjectsMap);
// //                   const empRemTotal = empStdTotal - empUtilTotal;
// //                   const empRemPct =
// //                     empStdTotal > 0
// //                       ? ((empRemTotal / empStdTotal) * 100).toFixed(1)
// //                       : "0.0";

// //                   return (
// //                     <React.Fragment key={employeeRowKey}>
// //                       {/* Main Employee Row */}
// //                       <tr
// //                         onClick={(e) => toggleEmpExpand(employeeRowKey, e)}
// //                         className="hover:bg-slate-50 cursor-pointer transition-colors font-medium bg-white"
// //                       >
// //                         <td className="p-2 text-center text-slate-400 font-bold border-r border-slate-200">
// //                           {isExpanded ? "−" : "+"}
// //                         </td>
// //                         <td className="p-2 border-r border-slate-200">
// //                           <div className="font-semibold text-slate-800">
// //                             {emp.employeeName}
// //                           </div>
// //                           <div className="text-[10px] text-slate-800 font-mono">
// //                             {emp.emplId}
// //                           </div>
// //                         </td>
// //                         {/* <td className="p-2 text-center border-r border-slate-200">
// //                           <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
// //                             {emp.status}
// //                           </span>
// //                         </td> */}

// //                         {months.map((_, mIdx) => {
// //                           const sch = emp.schedule?.find(
// //                             (s) => s.month === mIdx + 1,
// //                           );
// //                           if (!sch) {
// //                             return (
// //                               <React.Fragment key={mIdx}>
// //                                 <td className="p-2 text-center text-slate-300 border-r border-slate-100">
// //                                   -
// //                                 </td>
// //                                 <td className="p-2 text-center text-slate-300 border-r border-slate-100">
// //                                   -
// //                                 </td>
// //                                 <td className="p-2 text-center text-slate-300 border-r border-slate-200">
// //                                   -
// //                                 </td>
// //                               </React.Fragment>
// //                             );
// //                           }

// //                           return (
// //                             <React.Fragment key={mIdx}>
// //                               {/* Util Value */}
// //                               <td className="p-2 text-center font-mono text-slate-600 bg-slate-50 border-r border-slate-200 text-[11px]">
// //                                 {sch.utilizedHours}
// //                               </td>
// //                               {/* Rem Value */}
// //                               <td
// //                                 className={`p-2 text-center font-mono border-r border-slate-200 text-[11px] ${
// //                                   sch.remainingHours > 0
// //                                     ? "text-emerald-700 bg-emerald-50/30 font-semibold"
// //                                     : sch.remainingHours < 0
// //                                       ? "text-rose-700 bg-rose-50/40 font-semibold"
// //                                       : "text-slate-600 bg-slate-50"
// //                                 }`}
// //                               >
// //                                 {sch.remainingHours}
// //                               </td>

// //                               {/* Rem % Value */}
// //                               <td
// //                                 className={`p-2 text-center font-mono border-r border-slate-200 text-[11px] ${
// //                                   sch.remainingPercent > 0
// //                                     ? "text-emerald-700 bg-emerald-50/30 font-semibold"
// //                                     : sch.remainingPercent < 0
// //                                       ? "text-rose-700 bg-rose-50/40 font-semibold"
// //                                       : "text-slate-600 bg-slate-50"
// //                                 }`}
// //                               >
// //                                 {sch.remainingPercent}%
// //                               </td>
// //                             </React.Fragment>
// //                           );
// //                         })}

// //                         {/* Summary Columns */}
// //                         {/* <td className="p-2 text-center font-mono font-bold text-slate-700 border-l border-slate-300 bg-slate-100/50">
// //                           {empStdTotal}
// //                         </td> */}
// //                         <td className="p-2 text-center font-mono font-bold text-slate-700 bg-slate-100/60">
// //                           {empUtilTotal}
// //                         </td>
// //                         <td className="p-2 text-center font-mono font-bold text-slate-700 bg-slate-100/60">
// //                           {empRemTotal}
// //                         </td>
// //                         <td className="p-2 text-center font-mono font-bold text-slate-700 bg-slate-100/60">
// //                           {empRemPct}%
// //                         </td>
// //                       </tr>

// //                       {/* Nested Project Rows - Clean Violet Indentation */}
// //                       {isExpanded &&
// //                         projectRows.map((proj) => {
// //                           const projTotal = proj.hours.reduce(
// //                             (a, b) => a + b,
// //                             0,
// //                           );
// //                           return (
// //                             <tr
// //                               key={proj.code}
// //                               className="bg-slate-50/80 text-[11px] text-slate-600 border-l-4 border-l-grey-400 hover:bg-indigo-50/20 transition-colors"
// //                             >
// //                               <td className="p-2 border-r border-slate-200"></td>
// //                               <td
// //                                 className="p-2 font-mono text-slate-700 border-r border-slate-200"
// //                                 colSpan={1}
// //                               >
// //                                 {/* <span className="text-grey-500 font-bold mr-1">
// //                                   ↳
// //                                 </span> */}
// //                                 <span className="font-semibold text-slate-400">
// //                                   {proj.code}
// //                                 </span>{" "}
// //                                 <span className="text-slate-500">
// //                                   - {proj.name}
// //                                 </span>
// //                               </td>

// //                               {proj.hours.map((pHours, pIdx) => (
// //                                 <React.Fragment key={pIdx}>
// //                                   {/* Project Allocation Hours */}
// //                                   <td className="p-2 text-center font-mono font-medium text-slate-700 bg-indigo-50/10 border-r border-slate-100">
// //                                     {pHours > 0 ? pHours : "-"}
// //                                   </td>
// //                                   <td className="p-2 text-center text-slate-300 border-r border-slate-100">
// //                                     -
// //                                   </td>
// //                                   <td className="p-2 text-center text-slate-300 border-r border-slate-200">
// //                                     -
// //                                   </td>
// //                                 </React.Fragment>
// //                               ))}

// //                               <td className="p-2 text-center text-slate-300 border-l border-slate-300 bg-slate-100/50">
// //                                 -
// //                               </td>
// //                               <td className="p-2 text-center font-mono font-bold text-indigo-600 bg-indigo-50/30">
// //                                 {projTotal}
// //                               </td>
// //                               <td className="p-2 text-center text-slate-300 bg-emerald-50/10">
// //                                 -
// //                               </td>
// //                               <td className="p-2 text-center text-slate-300 bg-slate-100/20">
// //                                 -
// //                               </td>
// //                             </tr>
// //                           );
// //                         })}
// //                     </React.Fragment>
// //                   );
// //                 })}
// //               </tbody>

// //               {/* Footer Totals */}
// //               <tfoot>
// //                 <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-800 text-xs">
// //                   <td
// //                     colSpan={3}
// //                     className="p-2.5 text-right border-r border-slate-300 uppercase tracking-wider text-slate-600"
// //                   >
// //                     Total Labor Hours
// //                   </td>
// //                   {months.map((_, mIdx) => {
// //                     let mStd = 0;
// //                     let mUtil = 0;
// //                     apiResponseData.forEach((emp) => {
// //                       const sch = emp.schedule?.find(
// //                         (s) => s.month === mIdx + 1,
// //                       );
// //                       if (sch) {
// //                         mStd += sch.standardHours || 0;
// //                         mUtil += sch.utilizedHours || 0;
// //                       }
// //                     });
// //                     const mRem = mStd - mUtil;
// //                     const mRemPct =
// //                       mStd > 0 ? ((mRem / mStd) * 100).toFixed(1) : "0.0";

// //                     return (
// //                       <React.Fragment key={mIdx}>
// //                         <td className="p-2 text-center font-mono text-indigo-700 border-r border-slate-200 bg-indigo-50/40">
// //                           {mUtil || "-"}
// //                         </td>
// //                         <td className="p-2 text-center font-mono text-emerald-700 border-r border-slate-200 bg-emerald-50/40">
// //                           {mRem || "-"}
// //                         </td>
// //                         <td className="p-2 text-center font-mono text-slate-700 border-r border-slate-300 bg-slate-100">
// //                           {mStd > 0 ? `${mRemPct}%` : "-"}
// //                         </td>
// //                       </React.Fragment>
// //                     );
// //                   })}

// //                   <td className="p-2 text-center font-mono border-l border-slate-300 bg-slate-200/50">
// //                     {totalOrgStd}
// //                   </td>
// //                   <td className="p-2 text-center font-mono text-indigo-700 bg-indigo-100/50">
// //                     {totalOrgUtil}
// //                   </td>
// //                   <td className="p-2 text-center font-mono text-emerald-700 bg-emerald-100/50">
// //                     {totalOrgRem}
// //                   </td>
// //                   <td className="p-2 text-center font-mono text-slate-800 bg-slate-200/50">
// //                     {totalOrgRemPct}%
// //                   </td>
// //                 </tr>
// //               </tfoot>
// //             </table>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// export const LaborUtilizationSummary = () => {
//   const [selectedYear, setSelectedYear] = useState("2026");
//   const [expandedEmps, setExpandedEmps] = useState({});

//   const [apiResponseData, setApiResponseData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // === FILTER STATE ===
//   const [empIdFilter, setEmpIdFilter] = useState("");
//   const [searchedEmployees, setSearchedEmployees] = useState(null);
//   const [remHoursFilter, setRemHoursFilter] = useState("");
//   const [remPercentFilter, setRemPercentFilter] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const response = await axios.post(
//           `${backendUrl}/Forecast/GetAllEmployeeScheduleAsync/${selectedYear}`,
//         );

//         const sortedData = [...(response.data || [])].sort((a, b) => {
//           const nameA = String(a?.firstName || "").trim();
//           const nameB = String(b?.firstName || "").trim();

//           if (!nameA && !nameB) return 0;
//           if (!nameA) return 1;
//           if (!nameB) return -1;

//           return nameA.localeCompare(nameB, undefined, {
//             sensitivity: "base",
//           });
//         });

//         setApiResponseData(sortedData);
//       } catch (err) {
//         const errorMessage =
//           err.response?.data?.message ||
//           err.message ||
//           "An error occurred while fetching utilization data.";
//         setError(errorMessage);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [selectedYear]);

//   const toggleEmpExpand = (empId, e) => {
//     e.stopPropagation();
//     setExpandedEmps((prev) => ({
//       ...prev,
//       [empId]: !prev[empId],
//     }));
//   };

//   // ===============================
//   // EMPLOYEE SEARCH
//   // ===============================

//   const normalizeSearchValue = (value) =>
//     String(value ?? "")
//       .trim()
//       .replace(/\s+/g, " ")
//       .toLowerCase();

//   const getEmployeeId = (emp) => normalizeSearchValue(emp?.emplId);

//   const getEmployeeName = (emp) => {
//     const fullName = normalizeSearchValue(emp?.employeeName);
//     const firstName = normalizeSearchValue(emp?.firstName);
//     const lastName = normalizeSearchValue(emp?.lastName);
//     const combinedName = normalizeSearchValue(
//       [emp?.firstName, emp?.lastName]
//         .filter((value) => String(value ?? "").trim() !== "")
//         .join(" "),
//     );

//     return { fullName, firstName, lastName, combinedName };
//   };

//   // Search is ALWAYS performed against apiResponseData, never against
//   // the previous search result. This is what makes repeated searches
//   // completely independent from one another.
//   const handleEmployeeSearch = () => {
//     const query = normalizeSearchValue(empIdFilter);

//     if (!query) {
//       setSearchedEmployees(null);
//       setExpandedEmps({});
//       return;
//     }

//     const exactMatches = apiResponseData.filter((emp) => {
//       const employeeId = getEmployeeId(emp);
//       const { fullName, firstName, lastName, combinedName } =
//         getEmployeeName(emp);

//       return (
//         query === employeeId ||
//         query === fullName ||
//         query === combinedName ||
//         query === firstName ||
//         query === lastName
//       );
//     });

//     // If there is no exact match, allow a contains match for names/IDs,
//     // while still starting from the complete API dataset.
//     const matches = exactMatches.length
//       ? exactMatches
//       : apiResponseData.filter((emp) => {
//           const employeeId = getEmployeeId(emp);
//           const { fullName, combinedName } = getEmployeeName(emp);

//           return (
//             employeeId.includes(query) ||
//             fullName.includes(query) ||
//             combinedName.includes(query)
//           );
//         });

//     setSearchedEmployees(matches);
//     setExpandedEmps({});
//   };

//   const handleEmployeeSearchInputChange = (e) => {
//     const value = e.target.value;
//     setEmpIdFilter(value);

//     // Clearing the input immediately restores every employee.
//     if (!normalizeSearchValue(value)) {
//       setSearchedEmployees(null);
//       setExpandedEmps({});
//     }
//   };

//   const employeeDataToDisplay =
//     searchedEmployees === null ? apiResponseData : searchedEmployees;

//   // Apply Remaining Hours / Remaining % filters AFTER the employee search.
//   const filteredData = employeeDataToDisplay.filter((emp) => {
//     let empStd = 0;
//     let empUtil = 0;

//     if (Array.isArray(emp.schedule)) {
//       emp.schedule.forEach((sch) => {
//         empStd += Number(sch.standardHours) || 0;
//         empUtil += Number(sch.utilizedHours) || 0;
//       });
//     }

//     const empRem = empStd - empUtil;
//     const empRemPct = empStd > 0 ? (empRem / empStd) * 100 : 0;

//     if (remHoursFilter !== "" && !isNaN(Number(remHoursFilter))) {
//       if (empRem < Number(remHoursFilter)) return false;
//     }

//     if (remPercentFilter !== "" && !isNaN(Number(remPercentFilter))) {
//       if (empRemPct < Number(remPercentFilter)) return false;
//     }

//     return true;
//   });

//   // === STYLED EXCEL EXPORT ===
//   const exportToExcel = () => {
//     const wb = XLSX.utils.book_new();
//     const wsData = [];

//     // Table Header Construction
//     const headerRow1 = [
//       "",
//       "",
//       "",
//       "",
//       "",
//       ...months.flatMap((m) => [`${m} ${selectedYear}`, "", ""]),
//       "Total Summary",
//       "",
//       "",
//     ];

//     const headerRow2 = [
//       "Emp ID",
//       "Employee Name",
//       "Type",
//       "Project Code",
//       "Project Name",
//       ...months.flatMap(() => ["Util (h)", "Rem (h)", "Rem %"]),
//       "Total Util",
//       "Total Rem",
//       "Total Rem %",
//     ];

//     wsData.push(headerRow1);
//     wsData.push(headerRow2);

//     // Style Definitions matching UI Palette
//     const styleHeaderMain = {
//       font: { bold: true, color: { rgb: "334155" }, sz: 10 },
//       fill: { fgColor: { rgb: "E0E7FF" } }, // Indigo 100
//       alignment: { horizontal: "center", vertical: "center" },
//       border: { bottom: { style: "thin", color: { rgb: "CBD5E1" } } },
//     };

//     const styleSubHeader = {
//       font: { bold: true, color: { rgb: "475569" }, sz: 9 },
//       fill: { fgColor: { rgb: "F1F5F9" } }, // Slate 100
//       alignment: { horizontal: "center", vertical: "center" },
//     };

//     const styleEmpRow = {
//       font: { bold: true, color: { rgb: "1E293B" }, sz: 9 },
//       fill: { fgColor: { rgb: "FFFFFF" } },
//     };

//     const stylePositiveRem = {
//       font: { color: { rgb: "047857" }, bold: true }, // Emerald 700
//       fill: { fgColor: { rgb: "ECFDF5" } }, // Emerald 50
//       alignment: { horizontal: "center" },
//     };

//     const styleNegativeRem = {
//       font: { color: { rgb: "BE123C" }, bold: true }, // Rose 700
//       fill: { fgColor: { rgb: "FFF1F2" } }, // Rose 50
//       alignment: { horizontal: "center" },
//     };

//     const styleProjectRow = {
//       font: { color: { rgb: "64748B" }, sz: 9 },
//       fill: { fgColor: { rgb: "F8FAFC" } }, // Slate 50
//     };

//     // Data Rows Generation
//     filteredData.forEach((emp) => {
//       let totalStd = 0;
//       let totalUtil = 0;

//       const monthMetrics = months.flatMap((_, mIdx) => {
//         const sch = emp.schedule?.find((s) => s.month === mIdx + 1);
//         if (sch) {
//           totalStd += sch.standardHours || 0;
//           totalUtil += sch.utilizedHours || 0;
//           return [
//             sch.utilizedHours ?? 0,
//             sch.remainingHours ?? 0,
//             `${sch.remainingPercent ?? 0}%`,
//           ];
//         }
//         return ["-", "-", "-"];
//       });

//       const totalRem = totalStd - totalUtil;
//       const totalRemPct =
//         totalStd > 0 ? ((totalRem / totalStd) * 100).toFixed(1) : "0.0";

//       wsData.push([
//         emp.emplId,
//         emp.firstName,
//         "EMPLOYEE TOTAL",
//         "-",
//         "-",
//         ...monthMetrics,
//         totalUtil,
//         totalRem,
//         `${totalRemPct}%`,
//       ]);

//       // Nested Projects
//       const projectMap = {};
//       emp.schedule?.forEach((sch) => {
//         sch.projects?.forEach((p) => {
//           if (!projectMap[p.projId]) {
//             projectMap[p.projId] = {
//               name: p.projectName,
//               months: Array(12).fill(0),
//             };
//           }
//           projectMap[p.projId].months[sch.month - 1] += p.hours;
//         });
//       });

//       Object.entries(projectMap).forEach(([projId, projData]) => {
//         const pTotal = projData.months.reduce((a, b) => a + b, 0);
//         const projMonthCells = projData.months.flatMap((h) => [
//           h > 0 ? h : "-",
//           "-",
//           "-",
//         ]);

//         wsData.push([
//           "",
//           "",
//           "PROJECT ALLOCATION",
//           projId,
//           projData.name,
//           ...projMonthCells,
//           pTotal,
//           "-",
//           "-",
//         ]);
//       });
//     });

//     const worksheet = XLSX.utils.aoa_to_sheet(wsData);

//     // Apply Styles to Sheet Cells
//     const range = XLSX.utils.decode_range(worksheet["!ref"]);
//     for (let R = range.s.r; R <= range.e.r; ++R) {
//       for (let C = range.s.c; C <= range.e.c; ++C) {
//         const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
//         if (!worksheet[cellAddress]) continue;

//         if (R === 0) {
//           worksheet[cellAddress].s = styleHeaderMain;
//         } else if (R === 1) {
//           worksheet[cellAddress].s = styleSubHeader;
//         } else {
//           const cellValue = String(worksheet[cellAddress].v);
//           if (cellValue.includes("%") || !isNaN(Number(cellValue))) {
//             const numVal = parseFloat(cellValue);
//             if (numVal > 0) worksheet[cellAddress].s = stylePositiveRem;
//             else if (numVal < 0) worksheet[cellAddress].s = styleNegativeRem;
//           }
//         }
//       }
//     }

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Utilization Summary");
//     XLSX.writeFile(workbook, `Labor_Utilization_${selectedYear}.xlsx`);
//   };

//   let totalOrgStd = 0;
//   let totalOrgUtil = 0;

//   // === [CHANGED TO USE filteredData FOR FOOTER CALCULATIONS] ===
//   filteredData.forEach((emp) => {
//     emp.schedule?.forEach((sch) => {
//       totalOrgStd += sch.standardHours || 0;
//       totalOrgUtil += sch.utilizedHours || 0;
//     });
//   });

//   const totalOrgRem = totalOrgStd - totalOrgUtil;
//   const totalOrgRemPct =
//     totalOrgStd > 0 ? ((totalOrgRem / totalOrgStd) * 100).toFixed(1) : "0.0";

//   return (
//     <div
//       id="utilization-report-container"
//       className="my-4 font-sans flex flex-col gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800"
//     >
//       {/* Top Controls Header */}
//       <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
//         <div>
//           <h2 className="text-base font-bold text-slate-800 m-0 flex items-center gap-2">
//             {/* <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> */}
//             Labor Utilization Summary
//           </h2>
//           {/* <p className="text-xs text-slate-500 m-0 mt-0.5">
//             Resource allocation matrix grouped by standard, utilized, and
//             remaining metrics
//           </p> */}
//         </div>

//         {/* === [ADDED FILTER CONTROLS BAR] === */}
//         <div className="flex flex-wrap items-center gap-2">
//           <div className="relative w-60">
//             <input
//               type="text"
//               placeholder="Employee ID or Name..."
//               value={empIdFilter}
//               onChange={handleEmployeeSearchInputChange}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   handleEmployeeSearch();
//                 }
//               }}
//               className="bg-white border border-slate-300 text-slate-700 text-xs pl-2.5 pr-9 py-1.5 rounded-lg outline-none focus:border-indigo-500 w-full"
//             />

//             <button
//               type="button"
//               onClick={handleEmployeeSearch}
//               aria-label="Search employee"
//               title="Search"
//               className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:text-[#164E5B] hover:bg-slate-100 transition-colors"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="w-4 h-4"
//                 aria-hidden="true"
//               >
//                 <circle cx="11" cy="11" r="7" />
//                 <path d="m20 20-3.5-3.5" />
//               </svg>
//             </button>
//           </div>

//           {/* <input
//             type="number"
//             placeholder="Max Rem Hours..."
//             value={remHoursFilter}
//             onChange={(e) => setRemHoursFilter(e.target.value)}
//             className="bg-white border border-slate-300 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg outline-none focus:border-indigo-500 w-32"
//           />

//           <input
//             type="number"
//             placeholder="Max Rem %..."
//             value={remPercentFilter}
//             onChange={(e) => setRemPercentFilter(e.target.value)}
//             className="bg-white border border-slate-300 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg outline-none focus:border-indigo-500 w-28"
//           /> */}

//           <select
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(e.target.value)}
//             className="bg-white border border-slate-300 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer outline-none"
//           >
//             <option value="2025">2025 Financials</option>
//             <option value="2026">2026 Financials</option>
//             <option value="2027">2027 Financials</option>
//             <option value="2028">2028 Financials</option>
//           </select>

//           <button
//             onClick={exportToExcel}
//             disabled={isLoading || filteredData.length === 0}
//             className="bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-xs"
//           >
//             📊 Excel
//           </button>
//         </div>
//       </div>

//       {isLoading && (
//         <div className="p-8 text-center text-xs font-semibold text-slate-500 bg-white rounded-lg border border-slate-200">
//           Loading labor utilization data...
//         </div>
//       )}

//       {error && (
//         <div className="p-4 text-xs font-semibold text-red-600 bg-red-50 rounded-lg border border-red-200">
//           {error}
//         </div>
//       )}

//       {!isLoading && !error && (
//         <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
//           <div className="overflow-auto h-[calc(100vh-180px)] relative">
//             <table className="w-full border-collapse text-xs text-left">
//               <thead className="sticky top-0 z-20 shadow-xs">
//                 {/* Level 1 Header */}
//                 <tr className="bg-slate-100 text-slate-700 font-bold text-center">
//                   {/* Top-Left Corner Sticky Box 1 */}
//                   <th
//                     rowSpan={2}
//                     className="p-2 w-6 text-center border-r border-slate-200 bg-slate-100 sticky left-0 z-30"
//                   ></th>
//                   {/* Top-Left Corner Sticky Box 2 (Offset by Col 1 width) */}
//                   <th
//                     rowSpan={2}
//                     className="p-2 min-w-[140px] text-left border-r border-slate-200 bg-slate-100 text-slate-700 sticky left-6 z-30"
//                   >
//                     Name
//                   </th>

//                   {months.map((m, mIdx) => {
//                     const monthStdHours = filteredData[0]?.schedule?.find(
//                       (s) => s.month === mIdx + 1,
//                     )?.standardHours;

//                     return (
//                       <th
//                         key={m}
//                         colSpan={3}
//                         className="p-2 border-r border-slate-200 border-b bg-indigo-50 text-slate-700"
//                       >
//                         <div className="font-semibold">
//                           {m} {selectedYear}
//                         </div>
//                         {monthStdHours && (
//                           <div className="text-[10px] font-normal text-slate-500 font-mono">
//                             {monthStdHours}h
//                           </div>
//                         )}
//                       </th>
//                     );
//                   })}

//                   <th
//                     colSpan={4}
//                     className="p-2 bg-slate-200 border-l border-slate-300 text-slate-800 font-bold"
//                   >
//                     Total Summary
//                   </th>
//                 </tr>

//                 {/* Level 2 Sub-Headers */}
//                 <tr className="border-b border-slate-200 text-[11px] font-semibold text-center bg-slate-100">
//                   {months.map((m) => (
//                     <React.Fragment key={`${m}-subheaders`}>
//                       <th className="p-1.5 w-14 border-r border-slate-200 bg-slate-100 text-slate-600 font-mono">
//                         Util
//                       </th>
//                       <th className="p-1.5 w-14 border-r border-slate-200 bg-slate-100 text-slate-600 font-mono">
//                         Rem
//                       </th>
//                       <th className="p-1.5 w-14 border-r border-slate-200 bg-slate-100 text-slate-600 font-mono">
//                         Rem %
//                       </th>
//                     </React.Fragment>
//                   ))}

//                   <th className="p-1.5 w-16 bg-slate-100 text-slate-700 font-mono">
//                     Util
//                   </th>
//                   <th className="p-1.5 w-16 bg-slate-100 text-slate-700 font-mono">
//                     Rem
//                   </th>
//                   <th className="p-1.5 w-16 bg-slate-100 text-slate-700 font-mono">
//                     Rem %
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-slate-200">
//                 {filteredData.map((emp, empIndex) => {
//                   // The API can contain duplicate employee IDs. React keys must
//                   // identify each rendered row uniquely, so do not use emp.emplId
//                   // by itself as the row key or expansion key.
//                   const employeeRowKey = `${String(emp?.emplId ?? "employee")}__${empIndex}`;
//                   const isExpanded = !!expandedEmps[employeeRowKey];
//                   const empProjectsMap = {};
//                   let empStdTotal = 0;
//                   let empUtilTotal = 0;

//                   emp.schedule?.forEach((sch) => {
//                     empStdTotal += sch.standardHours || 0;
//                     empUtilTotal += sch.utilizedHours || 0;

//                     sch.projects?.forEach((proj) => {
//                       if (!empProjectsMap[proj.projId]) {
//                         empProjectsMap[proj.projId] = {
//                           code: proj.projId,
//                           name: proj.projectName,
//                           hours: Array(12).fill(0),
//                         };
//                       }
//                       empProjectsMap[proj.projId].hours[sch.month - 1] +=
//                         proj.hours;
//                     });
//                   });

//                   const projectRows = Object.values(empProjectsMap);
//                   const empRemTotal = empStdTotal - empUtilTotal;
//                   const empRemPct =
//                     empStdTotal > 0
//                       ? ((empRemTotal / empStdTotal) * 100).toFixed(1)
//                       : "0.0";

//                   return (
//                     <React.Fragment key={employeeRowKey}>
//                       {/* Main Employee Row */}
//                       <tr
//                         onClick={(e) => toggleEmpExpand(employeeRowKey, e)}
//                         className="hover:bg-slate-50 cursor-pointer transition-colors font-medium bg-white"
//                       >
//                         {/* Sticky Col 1: Toggle Icon */}
//                         <td className="p-2 text-center text-slate-400 font-bold border-r border-slate-200 sticky left-0 z-10 bg-white group-hover:bg-slate-50">
//                           {isExpanded ? "−" : "+"}
//                         </td>
//                         {/* Sticky Col 2: Employee Name & ID */}
//                         <td className="p-2 border-r border-slate-200 sticky left-6 z-10 bg-white group-hover:bg-slate-50 whitespace-nowrap">
//                           <div className="font-semibold text-slate-800">
//                             {/* {emp.firstName} - ({emp.emplId}) */}
//                             {emp.firstName || emp.employeeName || "N/A"} - (
//                             {emp.emplId})
//                           </div>
//                         </td>

//                         {months.map((_, mIdx) => {
//                           const sch = emp.schedule?.find(
//                             (s) => s.month === mIdx + 1,
//                           );
//                           if (!sch) {
//                             return (
//                               <React.Fragment key={mIdx}>
//                                 <td className="p-2 text-center text-slate-300 border-r border-slate-100">
//                                   -
//                                 </td>
//                                 <td className="p-2 text-center text-slate-300 border-r border-slate-100">
//                                   -
//                                 </td>
//                                 <td className="p-2 text-center text-slate-300 border-r border-slate-200">
//                                   -
//                                 </td>
//                               </React.Fragment>
//                             );
//                           }

//                           return (
//                             <React.Fragment key={mIdx}>
//                               <td className="p-2 text-center font-mono text-slate-600 bg-slate-50 border-r border-slate-200 text-[11px]">
//                                 {/* {sch.utilizedHours} */}
//                                 {sch.utilizedHours != null &&
//                                 !isNaN(Number(sch.utilizedHours))
//                                   ? Number(sch.utilizedHours).toFixed(2)
//                                   : "0.00"}
//                               </td>
//                               <td
//                                 className={`p-2 text-center font-mono border-r border-slate-200 text-[11px] ${
//                                   sch.remainingHours > 0
//                                     ? "text-emerald-700 bg-emerald-50/30 font-semibold"
//                                     : sch.remainingHours < 0
//                                       ? "text-rose-700 bg-rose-50/40 font-semibold"
//                                       : "text-slate-600 bg-slate-50"
//                                 }`}
//                               >
//                                 {sch.remainingHours != null &&
//                                 !isNaN(Number(sch.remainingHours))
//                                   ? Number(sch.remainingHours).toFixed(2)
//                                   : "0.00"}
//                               </td>
//                               <td
//                                 className={`p-2 text-center font-mono border-r border-slate-200 text-[11px] ${
//                                   sch.remainingPercent > 0
//                                     ? "text-emerald-700 bg-emerald-50/30 font-semibold"
//                                     : sch.remainingPercent < 0
//                                       ? "text-rose-700 bg-rose-50/40 font-semibold"
//                                       : "text-slate-600 bg-slate-50"
//                                 }`}
//                               >
//                                 {sch.remainingPercent}%
//                               </td>
//                             </React.Fragment>
//                           );
//                         })}

//                         {/* Summary Columns */}
//                         <td className="p-2 text-center font-mono font-bold text-slate-700 bg-slate-100/60">
//                           {/* {empUtilTotal} */}
//                           {empUtilTotal != null && !isNaN(Number(empUtilTotal))
//                             ? Number(empUtilTotal).toFixed(2)
//                             : "0.00"}
//                         </td>
//                         <td className="p-2 text-center font-mono font-bold text-slate-700 bg-slate-100/60">
//                           {/* {empRemTotal} */}
//                           {empRemTotal != null && !isNaN(Number(empRemTotal))
//                             ? Number(empRemTotal).toFixed(2)
//                             : "0.00"}
//                         </td>
//                         <td className="p-2 text-center font-mono font-bold text-slate-700 bg-slate-100/60">
//                           {empRemPct}%
//                         </td>
//                       </tr>

//                       {/* Nested Project Rows */}
//                       {isExpanded &&
//                         projectRows.map((proj) => {
//                           const projTotal = proj.hours.reduce(
//                             (a, b) => a + b,
//                             0,
//                           );
//                           return (
//                             <tr
//                               key={proj.code}
//                               className="bg-slate-50/80 text-[11px] text-slate-600 border-l-4 border-l-grey-400 hover:bg-indigo-50/20 transition-colors"
//                             >
//                               {/* Sticky Col 1 for Nested Row */}
//                               <td className="p-2 border-r border-slate-200 sticky left-0 z-10 bg-slate-50"></td>
//                               {/* Sticky Col 2 for Nested Row */}
//                               <td
//                                 className="p-2 font-mono text-slate-700 border-r border-slate-200 sticky left-6 z-10 bg-slate-50"
//                                 colSpan={1}
//                               >
//                                 <span className="font-semibold text-slate-400">
//                                   {proj.code}
//                                 </span>{" "}
//                                 <span className="text-slate-500">
//                                   - {proj.name}
//                                 </span>
//                               </td>

//                               {proj.hours.map((pHours, pIdx) => (
//                                 <React.Fragment key={pIdx}>
//                                   <td className="p-2 text-center font-mono font-medium text-slate-700 bg-indigo-50/10 border-r border-slate-100">
//                                     {pHours > 0 ? pHours : "-"}
//                                   </td>
//                                   <td className="p-2 text-center text-slate-300 border-r border-slate-100">
//                                     -
//                                   </td>
//                                   <td className="p-2 text-center text-slate-300 border-r border-slate-200">
//                                     -
//                                   </td>
//                                 </React.Fragment>
//                               ))}

//                               <td className="p-2 text-center text-slate-300 border-l border-slate-300 bg-slate-100/50">
//                                 -
//                               </td>
//                               <td className="p-2 text-center font-mono font-bold text-indigo-600 bg-indigo-50/30">
//                                 {/* {projTotal} */}
//                                 {projTotal != null && !isNaN(Number(projTotal))
//                                   ? Number(projTotal).toFixed(2)
//                                   : "0.00"}
//                               </td>
//                               <td className="p-2 text-center text-slate-300 bg-emerald-50/10">
//                                 -
//                               </td>
//                               <td className="p-2 text-center text-slate-300 bg-slate-100/20">
//                                 -
//                               </td>
//                             </tr>
//                           );
//                         })}
//                     </React.Fragment>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { backendUrl } from "./config";

export const LaborUtilizationSummary = () => {
  const [activeTab, setActiveTab] = useState("summary"); // "summary" | "detail"
  const [selectedYear, setSelectedYear] = useState("2026");
  const [expandedEmps, setExpandedEmps] = useState({});

  const [apiResponseData, setApiResponseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // === FILTER STATE ===
  const [empIdFilter, setEmpIdFilter] = useState("");
  const [searchedEmployees, setSearchedEmployees] = useState(null);
  const [remHoursFilter, setRemHoursFilter] = useState("");
  const [remPercentFilter, setRemPercentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // "ALL" | "OVER" | "PLANNED" | "UNDER"

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          `${backendUrl}/Forecast/GetAllEmployeeScheduleAsync/${selectedYear}`,
        );

        const sortedData = [...(response.data || [])].sort((a, b) => {
          const nameA = String(a?.firstName || "").trim();
          const nameB = String(b?.firstName || "").trim();

          if (!nameA && !nameB) return 0;
          if (!nameA) return 1;
          if (!nameB) return -1;

          return nameA.localeCompare(nameB, undefined, {
            sensitivity: "base",
          });
        });

        setApiResponseData(sortedData);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An error occurred while fetching utilization data.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  const toggleEmpExpand = (empId, e) => {
    e.stopPropagation();
    setExpandedEmps((prev) => ({
      ...prev,
      [empId]: !prev[empId],
    }));
  };

  // ===============================
  // EMPLOYEE SEARCH
  // ===============================

  const normalizeSearchValue = (value) =>
    String(value ?? "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();

  const getEmployeeId = (emp) => normalizeSearchValue(emp?.emplId);

  const getEmployeeName = (emp) => {
    const fullName = normalizeSearchValue(emp?.employeeName);
    const firstName = normalizeSearchValue(emp?.firstName);
    const lastName = normalizeSearchValue(emp?.lastName);
    const combinedName = normalizeSearchValue(
      [emp?.firstName, emp?.lastName]
        .filter((value) => String(value ?? "").trim() !== "")
        .join(" "),
    );

    return { fullName, firstName, lastName, combinedName };
  };

  const handleEmployeeSearch = () => {
    const query = normalizeSearchValue(empIdFilter);

    if (!query) {
      setSearchedEmployees(null);
      setExpandedEmps({});
      return;
    }

    const exactMatches = apiResponseData.filter((emp) => {
      const employeeId = getEmployeeId(emp);
      const { fullName, firstName, lastName, combinedName } =
        getEmployeeName(emp);

      return (
        query === employeeId ||
        query === fullName ||
        query === combinedName ||
        query === firstName ||
        query === lastName
      );
    });

    const matches = exactMatches.length
      ? exactMatches
      : apiResponseData.filter((emp) => {
          const employeeId = getEmployeeId(emp);
          const { fullName, combinedName } = getEmployeeName(emp);

          return (
            employeeId.includes(query) ||
            fullName.includes(query) ||
            combinedName.includes(query)
          );
        });

    setSearchedEmployees(matches);
    setExpandedEmps({});
  };

  const handleEmployeeSearchInputChange = (e) => {
    const value = e.target.value;
    setEmpIdFilter(value);

    if (!normalizeSearchValue(value)) {
      setSearchedEmployees(null);
      setExpandedEmps({});
    }
  };

  const employeeDataToDisplay =
    searchedEmployees === null ? apiResponseData : searchedEmployees;

  // Apply Filters (including Status Filter for Summary)
  const filteredData = employeeDataToDisplay.filter((emp) => {
    let empStd = 0;
    let empUtil = 0;

    if (Array.isArray(emp.schedule)) {
      emp.schedule.forEach((sch) => {
        empStd += Number(sch.standardHours) || 0;
        empUtil += Number(sch.utilizedHours) || 0;
      });
    }

    const empRem = empStd - empUtil;
    const empRemPct = empStd > 0 ? (empRem / empStd) * 100 : 0;

    if (remHoursFilter !== "" && !isNaN(Number(remHoursFilter))) {
      if (empRem < Number(remHoursFilter)) return false;
    }

    if (remPercentFilter !== "" && !isNaN(Number(remPercentFilter))) {
      if (empRemPct < Number(remPercentFilter)) return false;
    }

    // Status Filter (applies when summary mode is active or globally)
    if (statusFilter !== "ALL") {
      if (statusFilter === "OVER" && empRemPct >= 0) return false;
      if (statusFilter === "PLANNED" && empRemPct !== 0) return false;
      if (statusFilter === "UNDER" && empRemPct <= 0) return false;
    }

    return true;
  });

  // Helper function to derive status badge
  const getStatusBadge = (remPctNum) => {
    if (remPctNum < 0) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700 border border-rose-200">
          Over Utilized
        </span>
      );
    } else if (remPctNum > 0) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
          Under Utilized
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700 border border-blue-200">
        Utilized as Planned
      </span>
    );
  };

  // === STYLED EXCEL EXPORT ===
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [];

    const headerRow1 = [
      "",
      "",
      "",
      "",
      "",
      ...months.flatMap((m) => [`${m} ${selectedYear}`, "", ""]),
      "Total Summary",
      "",
      "",
    ];

    const headerRow2 = [
      "Emp ID",
      "Employee Name",
      "Type",
      "Project Code",
      "Project Name",
      ...months.flatMap(() => ["Util (h)", "Rem (h)", "Rem %"]),
      "Total Util",
      "Total Rem",
      "Total Rem %",
    ];

    wsData.push(headerRow1);
    wsData.push(headerRow2);

    const styleHeaderMain = {
      font: { bold: true, color: { rgb: "334155" }, sz: 10 },
      fill: { fgColor: { rgb: "E0E7FF" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: { bottom: { style: "thin", color: { rgb: "CBD5E1" } } },
    };

    const styleSubHeader = {
      font: { bold: true, color: { rgb: "475569" }, sz: 9 },
      fill: { fgColor: { rgb: "F1F5F9" } },
      alignment: { horizontal: "center", vertical: "center" },
    };

    const stylePositiveRem = {
      font: { color: { rgb: "047857" }, bold: true },
      fill: { fgColor: { rgb: "ECFDF5" } },
      alignment: { horizontal: "center" },
    };

    const styleNegativeRem = {
      font: { color: { rgb: "BE123C" }, bold: true },
      fill: { fgColor: { rgb: "FFF1F2" } },
      alignment: { horizontal: "center" },
    };

    filteredData.forEach((emp) => {
      let totalStd = 0;
      let totalUtil = 0;

      const monthMetrics = months.flatMap((_, mIdx) => {
        const sch = emp.schedule?.find((s) => s.month === mIdx + 1);
        if (sch) {
          totalStd += sch.standardHours || 0;
          totalUtil += sch.utilizedHours || 0;
          return [
            sch.utilizedHours ?? 0,
            sch.remainingHours ?? 0,
            `${sch.remainingPercent ?? 0}%`,
          ];
        }
        return ["-", "-", "-"];
      });

      const totalRem = totalStd - totalUtil;
      const totalRemPct =
        totalStd > 0 ? ((totalRem / totalStd) * 100).toFixed(1) : "0.0";

      wsData.push([
        emp.emplId,
        emp.firstName,
        "EMPLOYEE TOTAL",
        "-",
        "-",
        ...monthMetrics,
        totalUtil,
        totalRem,
        `${totalRemPct}%`,
      ]);

      const projectMap = {};
      emp.schedule?.forEach((sch) => {
        sch.projects?.forEach((p) => {
          if (!projectMap[p.projId]) {
            projectMap[p.projId] = {
              name: p.projectName,
              months: Array(12).fill(0),
            };
          }
          projectMap[p.projId].months[sch.month - 1] += p.hours;
        });
      });

      Object.entries(projectMap).forEach(([projId, projData]) => {
        const pTotal = projData.months.reduce((a, b) => a + b, 0);
        const projMonthCells = projData.months.flatMap((h) => [
          h > 0 ? h : "-",
          "-",
          "-",
        ]);

        wsData.push([
          "",
          "",
          "PROJECT ALLOCATION",
          projId,
          projData.name,
          ...projMonthCells,
          pTotal,
          "-",
          "-",
        ]);
      });
    });

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);

    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellAddress]) continue;

        if (R === 0) {
          worksheet[cellAddress].s = styleHeaderMain;
        } else if (R === 1) {
          worksheet[cellAddress].s = styleSubHeader;
        } else {
          const cellValue = String(worksheet[cellAddress].v);
          if (cellValue.includes("%") || !isNaN(Number(cellValue))) {
            const numVal = parseFloat(cellValue);
            if (numVal > 0) worksheet[cellAddress].s = stylePositiveRem;
            else if (numVal < 0) worksheet[cellAddress].s = styleNegativeRem;
          }
        }
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Utilization Summary");
    XLSX.writeFile(workbook, `Labor_Utilization_${selectedYear}.xlsx`);
  };

  return (
    <div
      id="utilization-report-container"
      className="my-4 font-sans flex flex-col gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800"
    >
      {/* Top Controls & Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-6">
          <h2 className="text-base font-bold text-slate-800 m-0 flex items-center gap-2">
            Labor Utilization
          </h2>

          {/* TAB SWITCHER */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab("summary");
                setExpandedEmps({});
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "summary"
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Summary
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("detail");
                setExpandedEmps({});
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === "detail"
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Detail
            </button>
          </div>
        </div>

        {/* FILTER CONTROLS BAR */}
        <div className="flex flex-wrap items-center gap-2">
          {/* STATUS FILTER DROPDOWN */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer outline-none focus:border-indigo-500"
          >
            <option value="ALL">All</option>
            <option value="UNDER">Under Utilized</option>
            <option value="OVER">Over Utilized</option>
            <option value="PLANNED">Utilized</option>
          </select>

          <div className="relative w-60">
            <input
              type="text"
              placeholder="Employee ID or Name..."
              value={empIdFilter}
              onChange={handleEmployeeSearchInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEmployeeSearch();
                }
              }}
              className="bg-white border border-slate-300 text-slate-700 text-xs pl-2.5 pr-9 py-1.5 rounded-lg outline-none focus:border-indigo-500 w-full"
            />

            <button
              type="button"
              onClick={handleEmployeeSearch}
              aria-label="Search employee"
              title="Search"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:text-[#164E5B] hover:bg-slate-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
          </div>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white border border-slate-300 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg cursor-pointer outline-none"
          >
            <option value="2025">2025 Financials</option>
            <option value="2026">2026 Financials</option>
            <option value="2027">2027 Financials</option>
            <option value="2028">2028 Financials</option>
          </select>

          <button
            onClick={exportToExcel}
            disabled={isLoading || filteredData.length === 0}
            className="bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-xs"
          >
            📊 Excel
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="p-8 text-center text-xs font-semibold text-slate-500 bg-white rounded-lg border border-slate-200">
          Loading labor utilization data...
        </div>
      )}

      {error && (
        <div className="p-4 text-xs font-semibold text-red-600 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-auto h-[calc(100vh-180px)] relative">
            <table className="w-full border-collapse text-xs text-left">
              {/* ========================================================= */}
              {/* SUMMARY TAB VIEW (YEARLY AGGREGATES)                      */}
              {/* ========================================================= */}
              {activeTab === "summary" && (
                <>
                  <thead className="sticky top-0 z-20 shadow-xs bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      {/* <th className="p-2.5 w-8 text-center border-r border-slate-200 bg-slate-100 sticky left-0 z-30"></th> */}
                      <th className="p-2.5 min-w-[220px] text-left border-r border-slate-200 bg-slate-100 text-slate-700 sticky left-8 z-30">
                        Employee Name / Project
                      </th>
                      <th className="p-2.5 text-center border-r border-slate-200 font-mono">
                        Std Hours ({selectedYear})
                      </th>
                      <th className="p-2.5 text-center border-r border-slate-200 font-mono">
                        Util Hours ({selectedYear})
                      </th>
                      <th className="p-2.5 text-center border-r border-slate-200 font-mono">
                        Util % ({selectedYear})
                      </th>
                      <th className="p-2.5 text-center border-r border-slate-200 font-mono">
                        Rem Hours ({selectedYear})
                      </th>
                      <th className="p-2.5 text-center border-r border-slate-200 font-mono">
                        Rem % ({selectedYear})
                      </th>
                      <th className="p-2.5 text-center font-mono">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {filteredData.map((emp, empIndex) => {
                      const employeeRowKey = `${String(
                        emp?.emplId ?? "employee",
                      )}__${empIndex}`;
                      const isExpanded = !!expandedEmps[employeeRowKey];

                      let empStdTotal = 0;
                      let empUtilTotal = 0;
                      const empProjectsMap = {};

                      emp.schedule?.forEach((sch) => {
                        empStdTotal += sch.standardHours || 0;
                        empUtilTotal += sch.utilizedHours || 0;

                        sch.projects?.forEach((proj) => {
                          if (!empProjectsMap[proj.projId]) {
                            empProjectsMap[proj.projId] = {
                              code: proj.projId,
                              name: proj.projName,
                              totalHours: 0,
                            };
                          }
                          empProjectsMap[proj.projId].totalHours += proj.hours;
                        });
                      });

                      const empRemTotal = empStdTotal - empUtilTotal;
                      const empRemPctNum =
                        empStdTotal > 0 ? (empRemTotal / empStdTotal) * 100 : 0;
                      const empRemPct = empRemPctNum.toFixed(1);

                      let utilPercent = 100 - empRemPct;
                      utilPercent = utilPercent.toFixed(1);
                      const projectRows = Object.values(empProjectsMap);

                      return (
                        <React.Fragment key={employeeRowKey}>
                          <tr
                            onClick={(e) => toggleEmpExpand(employeeRowKey, e)}
                            className="hover:bg-slate-50 cursor-pointer transition-colors font-medium bg-white"
                          >
                            {/* <td className="p-2.5 text-center text-slate-400 font-bold border-r border-slate-200 sticky left-0 z-10 bg-white">
                              {isExpanded ? "−" : "+"}
                            </td> */}
                            <td className="p-2.5 border-r border-slate-200 sticky left-8 z-10 bg-white whitespace-nowrap">
                              <div className="font-semibold text-slate-800">
                                {emp.firstName || emp.employeeName || "N/A"} - (
                                {emp.emplId})
                              </div>
                            </td>
                            <td className="p-2.5 text-center font-mono text-slate-700 bg-slate-50 border-r border-slate-200 font-semibold">
                              {empStdTotal.toFixed(2)}
                            </td>
                            <td className="p-2.5 text-center font-mono text-slate-700 bg-indigo-50/20 border-r border-slate-200 font-semibold">
                              {empUtilTotal.toFixed(2)}
                            </td>
                            <td
                              className={`p-2.5 text-center font-mono border-r border-slate-200 font-bold ${
                                Number(utilPercent) > 0
                                  ? "text-emerald-700 bg-emerald-50/30"
                                  : Number(utilPercent) < 0
                                    ? "text-rose-700 bg-rose-50/40"
                                    : "text-slate-600 bg-slate-50"
                              }`}
                            >
                              {utilPercent}%
                            </td>
                            <td
                              className={`p-2.5 text-center font-mono border-r border-slate-200 font-bold ${
                                empRemTotal > 0
                                  ? "text-emerald-700 bg-emerald-50/30"
                                  : empRemTotal < 0
                                    ? "text-rose-700 bg-rose-50/40"
                                    : "text-slate-600 bg-slate-50"
                              }`}
                            >
                              {empRemTotal.toFixed(2)}
                            </td>
                            <td
                              className={`p-2.5 text-center font-mono border-r border-slate-200 font-bold ${
                                Number(empRemPct) > 0
                                  ? "text-emerald-700 bg-emerald-50/30"
                                  : Number(empRemPct) < 0
                                    ? "text-rose-700 bg-rose-50/40"
                                    : "text-slate-600 bg-slate-50"
                              }`}
                            >
                              {empRemPct}%
                            </td>
                            <td className="p-2.5 text-center">
                              {getStatusBadge(empRemPctNum)}
                            </td>
                          </tr>

                          {/* Expanded Projects Summary Rows */}
                          {/* {isExpanded &&
                            projectRows.map((proj) => (
                              <tr
                                key={proj.code}
                                className="bg-slate-50/80 text-[11px] text-slate-600 border-l-4 border-l-slate-400 hover:bg-indigo-50/20 transition-colors"
                              >
                                <td className="p-2 border-r border-slate-200 sticky left-0 z-10 bg-slate-50"></td>
                                <td className="p-2 font-mono text-slate-700 border-r border-slate-200 sticky left-8 z-10 bg-slate-50">
                                  <span className="font-semibold text-slate-400">
                                    {proj.code}
                                  </span>{" "}
                                  <span className="text-slate-500">
                                    - {proj.name}
                                  </span>
                                </td>
                                <td className="p-2 text-center text-slate-300 border-r border-slate-100">
                                  -
                                </td>
                                <td className="p-2 text-center font-mono font-bold text-indigo-600 bg-indigo-50/30 border-r border-slate-200">
                                  {proj.totalHours.toFixed(2)}
                                </td>
                                <td className="p-2 text-center text-slate-300 border-r border-slate-200">
                                  -
                                </td>
                                <td className="p-2 text-center text-slate-300 border-r border-slate-200">
                                  -
                                </td>
                                <td className="p-2 text-center text-slate-300">
                                  -
                                </td>
                              </tr>
                            ))} */}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </>
              )}

              {/* ========================================================= */}
              {/* DETAIL TAB VIEW (MONTHLY BREAKDOWN)                      */}
              {/* ========================================================= */}
              {activeTab === "detail" && (
                <>
                  <thead className="sticky top-0 z-20 shadow-xs">
                    {/* Level 1 Header */}
                    <tr className="bg-slate-100 text-slate-700 font-bold text-center">
                      <th
                        rowSpan={2}
                        className="p-2 w-6 text-center border-r border-slate-200 bg-slate-100 sticky left-0 z-30"
                      ></th>
                      <th
                        rowSpan={2}
                        className="p-2 min-w-[140px] text-left border-r border-slate-200 bg-slate-100 text-slate-700 sticky left-6 z-30"
                      >
                        Name
                      </th>

                      {months.map((m, mIdx) => {
                        const monthStdHours = filteredData[0]?.schedule?.find(
                          (s) => s.month === mIdx + 1,
                        )?.standardHours;

                        return (
                          <th
                            key={m}
                            colSpan={3}
                            className="p-2 border-r border-slate-200 border-b bg-indigo-50 text-slate-700"
                          >
                            <div className="font-semibold">
                              {m} {selectedYear}
                            </div>
                            {monthStdHours && (
                              <div className="text-[10px] font-normal text-slate-500 font-mono">
                                {monthStdHours}h
                              </div>
                            )}
                          </th>
                        );
                      })}

                      <th
                        colSpan={4}
                        className="p-2 bg-slate-200 border-l border-slate-300 text-slate-800 font-bold"
                      >
                        Total Summary
                      </th>
                    </tr>

                    {/* Level 2 Sub-Headers */}
                    <tr className="border-b border-slate-200 text-[11px] font-semibold text-center bg-slate-100">
                      {months.map((m) => (
                        <React.Fragment key={`${m}-subheaders`}>
                          <th className="p-1.5 w-14 border-r border-slate-200 bg-slate-100 text-slate-600 font-mono">
                            Util
                          </th>
                          <th className="p-1.5 w-14 border-r border-slate-200 bg-slate-100 text-slate-600 font-mono">
                            Rem
                          </th>
                          <th className="p-1.5 w-14 border-r border-slate-200 bg-slate-100 text-slate-600 font-mono">
                            Rem %
                          </th>
                        </React.Fragment>
                      ))}

                      <th className="p-1.5 w-16 bg-slate-100 text-slate-700 font-mono">
                        Util
                      </th>
                      <th className="p-1.5 w-16 bg-slate-100 text-slate-700 font-mono">
                        Rem
                      </th>
                      <th className="p-1.5 w-16 bg-slate-100 text-slate-700 font-mono">
                        Rem %
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {filteredData.map((emp, empIndex) => {
                      const employeeRowKey = `${String(
                        emp?.emplId ?? "employee",
                      )}__${empIndex}`;
                      const isExpanded = !!expandedEmps[employeeRowKey];
                      const empProjectsMap = {};
                      let empStdTotal = 0;
                      let empUtilTotal = 0;

                      emp.schedule?.forEach((sch) => {
                        empStdTotal += sch.standardHours || 0;
                        empUtilTotal += sch.utilizedHours || 0;

                        sch.projects?.forEach((proj) => {
                          if (!empProjectsMap[proj.projId]) {
                            empProjectsMap[proj.projId] = {
                              code: proj.projId,
                              name: proj.projName,
                              hours: Array(12).fill(0),
                            };
                          }
                          empProjectsMap[proj.projId].hours[sch.month - 1] +=
                            proj.hours;
                        });
                      });

                      const projectRows = Object.values(empProjectsMap);
                      const empRemTotal = empStdTotal - empUtilTotal;
                      const empRemPct =
                        empStdTotal > 0
                          ? ((empRemTotal / empStdTotal) * 100).toFixed(1)
                          : "0.0";

                      return (
                        <React.Fragment key={employeeRowKey}>
                          {/* Main Employee Row */}
                          <tr
                            onClick={(e) => toggleEmpExpand(employeeRowKey, e)}
                            className="hover:bg-slate-50 cursor-pointer transition-colors font-medium bg-white"
                          >
                            <td className="p-2 text-center text-slate-400 font-bold border-r border-slate-200 sticky left-0 z-10 bg-white group-hover:bg-slate-50">
                              {isExpanded ? "−" : "+"}
                            </td>
                            <td className="p-2 border-r border-slate-200 sticky left-6 z-10 bg-white group-hover:bg-slate-50 whitespace-nowrap">
                              <div className="font-semibold text-slate-800">
                                {emp.firstName || emp.employeeName || "N/A"} - (
                                {emp.emplId})
                              </div>
                            </td>

                            {months.map((_, mIdx) => {
                              const sch = emp.schedule?.find(
                                (s) => s.month === mIdx + 1,
                              );
                              if (!sch) {
                                return (
                                  <React.Fragment key={mIdx}>
                                    <td className="p-2 text-center text-slate-300 border-r border-slate-100">
                                      -
                                    </td>
                                    <td className="p-2 text-center text-slate-300 border-r border-slate-100">
                                      -
                                    </td>
                                    <td className="p-2 text-center text-slate-300 border-r border-slate-200">
                                      -
                                    </td>
                                  </React.Fragment>
                                );
                              }

                              return (
                                <React.Fragment key={mIdx}>
                                  <td className="p-2 text-center font-mono text-slate-600 bg-slate-50 border-r border-slate-200 text-[11px]">
                                    {sch.utilizedHours != null &&
                                    !isNaN(Number(sch.utilizedHours))
                                      ? Number(sch.utilizedHours).toFixed(2)
                                      : "0.00"}
                                  </td>
                                  <td
                                    className={`p-2 text-center font-mono border-r border-slate-200 text-[11px] ${
                                      sch.remainingHours > 0
                                        ? "text-emerald-700 bg-emerald-50/30 font-semibold"
                                        : sch.remainingHours < 0
                                          ? "text-rose-700 bg-rose-50/40 font-semibold"
                                          : "text-slate-600 bg-slate-50"
                                    }`}
                                  >
                                    {sch.remainingHours != null &&
                                    !isNaN(Number(sch.remainingHours))
                                      ? Number(sch.remainingHours).toFixed(2)
                                      : "0.00"}
                                  </td>
                                  <td
                                    className={`p-2 text-center font-mono border-r border-slate-200 text-[11px] ${
                                      sch.remainingPercent > 0
                                        ? "text-emerald-700 bg-emerald-50/30 font-semibold"
                                        : sch.remainingPercent < 0
                                          ? "text-rose-700 bg-rose-50/40 font-semibold"
                                          : "text-slate-600 bg-slate-50"
                                    }`}
                                  >
                                    {sch.remainingPercent}%
                                  </td>
                                </React.Fragment>
                              );
                            })}

                            <td className="p-2 text-center font-mono font-bold text-slate-700 bg-slate-100/60">
                              {empUtilTotal != null &&
                              !isNaN(Number(empUtilTotal))
                                ? Number(empUtilTotal).toFixed(2)
                                : "0.00"}
                            </td>
                            <td className="p-2 text-center font-mono font-bold text-slate-700 bg-slate-100/60">
                              {empRemTotal != null &&
                              !isNaN(Number(empRemTotal))
                                ? Number(empRemTotal).toFixed(2)
                                : "0.00"}
                            </td>
                            <td className="p-2 text-center font-mono font-bold text-slate-700 bg-slate-100/60">
                              {empRemPct}%
                            </td>
                          </tr>

                          {/* Nested Project Rows */}
                          {isExpanded &&
                            projectRows.map((proj) => {
                              const projTotal = proj.hours.reduce(
                                (a, b) => a + b,
                                0,
                              );
                              return (
                                <tr
                                  key={proj.code}
                                  className="bg-slate-50/80 text-[11px] text-slate-600 border-l-4 border-l-grey-400 hover:bg-indigo-50/20 transition-colors"
                                >
                                  <td className="p-2 border-r border-slate-200 sticky left-0 z-10 bg-slate-50"></td>
                                  <td
                                    className="p-2 font-mono text-slate-700 border-r border-slate-200 sticky left-6 z-10 bg-slate-50"
                                    colSpan={1}
                                  >
                                    <span className="font-semibold text-slate-400">
                                      {proj.code}
                                    </span>{" "}
                                    <span className="text-slate-500">
                                      - {proj.name}
                                    </span>
                                  </td>

                                  {proj.hours.map((pHours, pIdx) => (
                                    <React.Fragment key={pIdx}>
                                      <td className="p-2 text-center font-mono font-medium text-slate-700 bg-indigo-50/10 border-r border-slate-100">
                                        {pHours > 0 ? pHours : "-"}
                                      </td>
                                      <td className="p-2 text-center text-slate-300 border-r border-slate-100">
                                        -
                                      </td>
                                      <td className="p-2 text-center text-slate-300 border-r border-slate-200">
                                        -
                                      </td>
                                    </React.Fragment>
                                  ))}

                                  <td className="p-2 text-center text-slate-300 border-l border-slate-300 bg-slate-100/50">
                                    -
                                  </td>
                                  <td className="p-2 text-center font-mono font-bold text-indigo-600 bg-indigo-50/30">
                                    {projTotal != null &&
                                    !isNaN(Number(projTotal))
                                      ? Number(projTotal).toFixed(2)
                                      : "0.00"}
                                  </td>
                                  <td className="p-2 text-center text-slate-300 bg-emerald-50/10">
                                    -
                                  </td>
                                  <td className="p-2 text-center text-slate-300 bg-slate-100/20">
                                    -
                                  </td>
                                </tr>
                              );
                            })}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </>
              )}
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
