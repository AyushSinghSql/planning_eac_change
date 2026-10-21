// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
// import { data } from "react-router-dom";
// import { backendUrl } from "./config";
// // import * as XLSX from "xlsx";
// import XLSX from "xlsx-js-style";
// import { saveAs } from "file-saver";

// const AnalysisByPeriodContent = ({
//   onCancel,
//   planID,
//   templateId,
//   type,
//   initialApiData,
//   isLoading,
//   error,
//   fiscalYear,
// }) => {
//   const [expandedStaffRows, setExpandedStaffRows] = useState([]);
//   const [expandedEmployeeDetails, setExpandedEmployeeDetails] = useState([]);
//   const [expandedNonLaborAcctRows, setExpandedNonLaborAcctRows] = useState([]); // State for non-labor account expansion
//   const [financialData, setFinancialData] = useState([]);
//   const [revenueSum, setRevenueSum] = useState(0);
//   const [revenueSumCtd, setRevenueSumCtd] = useState(0);

//   const [isExporting, setIsExporting] = useState(false);

//   const [allApiData, setAllApiData] = useState(null); // This will now hold the fiscalYear-filtered data
//   const [dynamicDateRanges, setDynamicDateRanges] = useState([]);

//   // Add this near line 25 under your other useState hooks
//   const [grandTotalCtdData, setGrandTotalCtdData] = useState(null);

//   const [selectedOrgId, setSelectedOrgId] = useState("");
//   const [availableOrgIds, setAvailableOrgIds] = useState([]);

//   const [selectedRevenueView, setSelectedRevenueView] = useState("t&m");

//   const [allTimeDateRanges, setAllTimeDateRanges] = useState([]);

//   useEffect(() => {
//     if (!initialApiData || Object.keys(initialApiData).length === 0) {
//       setAllTimeDateRanges([]);
//       return;
//     }
//     const rangesSet = new Set();

//     (initialApiData.employeeForecastSummary || []).forEach((summary) => {
//       summary.emplSchedule?.payrollSalary?.forEach((s) => {
//         const r = getMonthRangeKey(s.month, s.year);
//         if (r) rangesSet.add(r);
//       });
//     });
//     (initialApiData.directCOstForecastSummary || []).forEach((n) => {
//       n.directCostSchedule?.forecasts?.forEach((s) => {
//         const r = getMonthRangeKey(s.month, s.year);
//         if (r) rangesSet.add(r);
//       });
//     });
//     (initialApiData.indirectCostForecastSummary || []).forEach((n) => {
//       n.indirectCostSchedule?.forecasts?.forEach((s) => {
//         const r = getMonthRangeKey(s.month, s.year);
//         if (r) rangesSet.add(r);
//       });
//     });

//     const sorted = Array.from(rangesSet).sort((a, b) => {
//       const [ma, ya] = a.split("/");
//       const [mb, yb] = b.split("/");
//       if (ya !== yb) return Number(ya) - Number(yb);
//       return Number(ma) - Number(mb);
//     });
//     setAllTimeDateRanges(sorted);
//   }, [initialApiData]);

//   // Replace your existing getMonthRangeKey function with this one
//   function getMonthRangeKey(period, year) {
//     // Add this check to prevent crashes if period or year are missing
//     if (period === undefined || year === undefined) {
//       return null;
//     }
//     const month = String(period).padStart(2, "0");
//     const monthRange = `${month}/${year}`;
//     return monthRange;
//   }

//   function calculateTotalRevenue() {
//     let monthlyRevenueSummary = initialApiData.monthlyRevenueSummary;
//     if (!Array.isArray(monthlyRevenueSummary)) return 0;

//     if (!Array.isArray(monthlyRevenueSummary)) {
//       setRevenueSum(0);
//       setRevenueSumCtd(0);
//       return;
//     }

//     // 1. REGULAR REVENUE SUM (Current selected Year or All)
//     const monthlyTotal = monthlyRevenueSummary
//       .filter((item) => {
//         if (fiscalYear === "All") return true;
//         return item.year === Number(fiscalYear);
//       })
//       .reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
//     setRevenueSum(monthlyTotal);

//     // 2. CUMULATIVE TO DATE (CTD) REVENUE SUM (All historical up to selected Year)
//     const monthlyTotalCtd = monthlyRevenueSummary
//       .filter((item) => {
//         if (fiscalYear === "All") return true;
//         // Sum everything from the beginning of the project up to the selected fiscal year
//         return item.year <= Number(fiscalYear);
//       })
//       .reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);

//     setRevenueSumCtd(monthlyTotalCtd);
//   }

//   console.log("ctd total", revenueSumCtd);

//   useEffect(() => {
//     if (initialApiData) calculateTotalRevenue();
//   }, [fiscalYear, initialApiData]);

//  zz
//   useEffect(() => {
//     // console.log(
//     //   "useEffect [initialApiData, isLoading, error, fiscalYear]: Effect triggered."
//     // );
//     if (
//       isLoading ||
//       error ||
//       !initialApiData ||
//       Object.keys(initialApiData).length === 0
//     ) {
//       if (isLoading) {
//         // console.log("useEffect: Data is still loading.");
//         setAllApiData(null);
//         setDynamicDateRanges([]);
//         setSelectedOrgId("");
//         setAvailableOrgIds([]);
//         setFinancialData([]);
//         return;
//       }

//       if (error) {
//         // console.log("useEffect: Error received from parent:", error);
//         setAllApiData(null);
//         setDynamicDateRanges([]);
//         setSelectedOrgId("");
//         setAvailableOrgIds([]);
//         setFinancialData([]);
//         return;
//       }

//       if (!initialApiData || Object.keys(initialApiData).length === 0) {
//         // console.log("useEffect: initialApiData is null, undefined, or empty.");
//         setAllApiData(null);
//         setDynamicDateRanges([]);
//         setSelectedOrgId("");
//         setAvailableOrgIds([]);
//         setFinancialData([]);
//         return;
//       }

//       setGrandTotalCtdData(null); // Clear on error/empty
//       return;
//     }

//     try {
//       // console.log(
//       //   "useEffect: Processing initialApiData for deep fiscal year filtering..."
//       // );

//       setGrandTotalCtdData(initialApiData);

//       const processedApiData = { ...initialApiData }; // Start with a copy

//       processedApiData.employeeForecastSummary = (
//         initialApiData.employeeForecastSummary || []
//       )
//         .map((empSummary) => {
//           const filteredPayrollSalary = (
//             empSummary.emplSchedule?.payrollSalary || []
//           ).filter((salaryEntry) => {
//             return (
//               !fiscalYear ||
//               fiscalYear === "All" ||
//               String(salaryEntry.year) === fiscalYear
//             );
//           });

//           if (filteredPayrollSalary.length > 0) {
//             return {
//               ...empSummary,
//               emplSchedule: {
//                 ...empSummary.emplSchedule,
//                 payrollSalary: filteredPayrollSalary,
//               },
//             };
//           }
//           return null;
//         })
//         .filter(Boolean);

//       // console.log(
//       //   "useEffect: employeeForecastSummary after deep fiscalYear filter:",
//       //   processedApiData.employeeForecastSummary
//       // );

//       processedApiData.directCOstForecastSummary = (
//         initialApiData.directCOstForecastSummary || []
//       )
//         .map((nonLaborSummary) => {
//           const filteredForecasts = (
//             nonLaborSummary.directCostSchedule?.forecasts || []
//           ).filter((f) => {
//             return (
//               !fiscalYear ||
//               fiscalYear === "All" ||
//               String(f.year) === fiscalYear
//             );
//           });
//           if (filteredForecasts.length > 0) {
//             return {
//               ...nonLaborSummary,
//               directCostSchedule: {
//                 ...nonLaborSummary.directCostSchedule,
//                 forecasts: filteredForecasts,
//               },
//             };
//           }
//           return null;
//         })
//         .filter(Boolean);
//       // console.log(
//       //   "useEffect: directCOstForecastSummary after deep fiscalYear filter:",
//       //   processedApiData.directCOstForecastSummary
//       // );

//       processedApiData.indirectCostForecastSummary = (
//         initialApiData.indirectCostForecastSummary || []
//       )
//         .map((nonLaborSummary) => {
//           const filteredForecasts = (
//             nonLaborSummary.indirectCostSchedule?.forecasts || []
//           ).filter((f) => {
//             return (
//               !fiscalYear ||
//               fiscalYear === "All" ||
//               String(f.year) === fiscalYear
//             );
//           });
//           if (filteredForecasts.length > 0) {
//             return {
//               ...nonLaborSummary,
//               indirectCostSchedule: {
//                 ...nonLaborSummary.indirectCostSchedule,
//                 forecasts: filteredForecasts,
//               },
//             };
//           }
//           return null;
//         })
//         .filter(Boolean);
//       // console.log(
//       //   "useEffect: indirectCostSummariesFiltered after deep fiscalYear filter:",
//       //   processedApiData.indirectCostForecastSummary
//       // );

//       setAllApiData(processedApiData);

//       const uniqueOrgIds = new Set();
//       const uniqueDateRangesSet = new Set();

//       (processedApiData.employeeForecastSummary || []).forEach((summary) => {
//         uniqueOrgIds.add(summary.orgID);
//         summary.emplSchedule?.payrollSalary?.forEach((salaryEntry) => {
//           const monthRangeKey = getMonthRangeKey(
//             salaryEntry.month,
//             salaryEntry.year,
//           );
//           uniqueDateRangesSet.add(monthRangeKey);
//         });
//       });

//       (processedApiData.directCOstForecastSummary || []).forEach(
//         (nonLaborSummary) => {
//           uniqueOrgIds.add(nonLaborSummary.orgID);
//           nonLaborSummary.directCostSchedule?.forecasts?.forEach(
//             (scheduleEntry) => {
//               const monthRangeKey = getMonthRangeKey(
//                 scheduleEntry.month,
//                 scheduleEntry.year,
//               );
//               uniqueDateRangesSet.add(monthRangeKey);
//             },
//           );
//         },
//       );

//       (processedApiData.indirectCostForecastSummary || []).forEach(
//         (nonLaborSummary) => {
//           uniqueOrgIds.add(nonLaborSummary.orgID);
//           nonLaborSummary.indirectCostSchedule?.forecasts?.forEach(
//             (scheduleEntry) => {
//               const monthRangeKey = getMonthRangeKey(
//                 scheduleEntry.month,
//                 scheduleEntry.year,
//               );
//               uniqueDateRangesSet.add(monthRangeKey);
//             },
//           );
//         },
//       );

//       const sortedDateRanges = Array.from(uniqueDateRangesSet).sort((a, b) => {
//         const [monthAStr, yearAStr] = a.split("/");
//         const yearA = parseInt(yearAStr, 10);
//         const monthA = parseInt(monthAStr, 10);

//         const [monthBStr, yearBStr] = b.split("/");
//         const yearB = parseInt(yearBStr, 10);
//         const monthB = parseInt(monthBStr, 10);

//         if (yearA !== yearB) return yearA - yearB;
//         return monthA - monthB;
//       });

//       setDynamicDateRanges(sortedDateRanges);
//       // console.log("useEffect: dynamicDateRanges set to", sortedDateRanges);

//       const orgs = Array.from(uniqueOrgIds).sort();
//       setAvailableOrgIds(orgs);
//       // console.log("useEffect: availableOrgIds set to", orgs);

//       if (orgs.length > 0) {
//         setSelectedOrgId(orgs[0]);
//         // console.log("useEffect: selectedOrgId set to", orgs[0]);
//       } else {
//         setSelectedOrgId("");
//         // console.log("useEffect: selectedOrgId set to empty (no orgs found)");
//       }
//     } catch (e) {
//       // console.error("Error during initial API data processing:", e);
//       setAllApiData(null);
//       setDynamicDateRanges([]);
//       setSelectedOrgId("");
//       setAvailableOrgIds([]);
//       setFinancialData([]);
//     }
//   }, [initialApiData, isLoading, error, fiscalYear]);

//    const transformApiDataToFinancialRows = useCallback(
//     (
//       apiResponse,
//       currentOrgId,
//       dynamicDateRanges,
//       selectedRevenueView,
//       planType,
//     ) => {
//       const financialRows = [];

//       // Helper to determine the YTD target year (defaults to the year of the last dynamic range)
//       const getTargetYtdYear = () => {
//         if (!dynamicDateRanges || dynamicDateRanges.length === 0) return null;
//         const lastRange = dynamicDateRanges[dynamicDateRanges.length - 1]; // e.g., "12/2026" or "2026-12"
//         const match = lastRange.match(/\d{4}/);
//         return match ? match[0] : null;
//       };

//       const ytdYear = getTargetYtdYear();

//       // Helper to check if a range key belongs to the YTD year
//       const isYtdRange = (rangeKey) => {
//         if (!rangeKey || !ytdYear) return false;
//         return rangeKey.includes(ytdYear);
//       };

//       // Initialize totals
//       const monthlyRevenueData = dynamicDateRanges.reduce(
//         (acc, range) => ({ ...acc, [range]: 0 }),
//         {},
//       );
//       const totalExpenseData = dynamicDateRanges.reduce(
//         (acc, range) => ({ ...acc, [range]: 0 }),
//         {},
//       );
//       const profitData = dynamicDateRanges.reduce(
//         (acc, range) => ({ ...acc, [range]: 0 }),
//         {},
//       );
//       const profitOnCostData = dynamicDateRanges.reduce(
//         (acc, range) => ({ ...acc, [range]: 0 }),
//         {},
//       );
//       const profitOnRevenueData = dynamicDateRanges.reduce(
//         (acc, range) => ({ ...acc, [range]: 0 }),
//         {},
//       );
//       const totalStaffCostByMonth = dynamicDateRanges.reduce(
//         (acc, range) => ({ ...acc, [range]: 0 }),
//         {},
//       );
//       const totalNonLaborCostByMonth = dynamicDateRanges.reduce(
//         (acc, range) => ({ ...acc, [range]: 0 }),
//         {},
//       );

//       // Monthly Revenue + Staff/Non-Labor cost
//       const monthlyRevenueSummary = apiResponse.monthlyRevenueSummary || [];
//       monthlyRevenueSummary.forEach((monthData) => {
//         const monthRange = getMonthRangeKey(monthData.month, monthData.year);
//         if (monthRange && dynamicDateRanges.includes(monthRange)) {
//           monthlyRevenueData[monthRange] = monthData.revenue || 0;

//           const staffCost = monthData.cost || 0;
//           const nonLaborCost = monthData.otherDifrectCost || 0;

//           totalStaffCostByMonth[monthRange] = staffCost;
//           totalNonLaborCostByMonth[monthRange] = nonLaborCost;

//           totalExpenseData[monthRange] = staffCost + nonLaborCost;
//         }
//       });

//       const monthlyRevenueTotalCTD = Object.values(monthlyRevenueData).reduce(
//         (s, v) => s + v,
//         0,
//       );
//       const monthlyRevenueTotalYTD = Object.entries(monthlyRevenueData)
//         .filter(([range]) => isYtdRange(range))
//         .reduce((s, [_, v]) => s + v, 0);

//       const totalRevenueOverallCTD =
//         (apiResponse.revenue || 0) + monthlyRevenueTotalCTD;
//       // For YTD, we only include the API base revenue if it applies to this fiscal year
//       const totalRevenueOverallYTD = monthlyRevenueTotalYTD;

//       // --- STAFF COSTS OVERALLS ---
//       const totalStaffCostOverallCTD = Object.values(
//         totalStaffCostByMonth,
//       ).reduce((s, v) => s + v, 0);
//       const totalStaffCostOverallYTD = Object.entries(totalStaffCostByMonth)
//         .filter(([range]) => isYtdRange(range))
//         .reduce((s, [_, v]) => s + v, 0);

//       // --- NON-LABOR OVERALLS ---
//       const totalNonLaborCostOverallCTD = Object.values(
//         totalNonLaborCostByMonth,
//       ).reduce((s, v) => s + v, 0);
//       const totalNonLaborCostOverallYTD = Object.entries(
//         totalNonLaborCostByMonth,
//       )
//         .filter(([range]) => isYtdRange(range))
//         .reduce((s, [_, v]) => s + v, 0);

//       // --- EXPENSE OVERALLS ---
//       const totalExpenseOverallCTD = Object.values(totalExpenseData).reduce(
//         (s, v) => s + v,
//         0,
//       );
//       const totalExpenseOverallYTD = Object.entries(totalExpenseData)
//         .filter(([range]) => isYtdRange(range))
//         .reduce((s, [_, v]) => s + v, 0);

//       // --- PROFIT OVERALLS ---
//       const totalProfitOverallCTD =
//         totalRevenueOverallCTD - totalExpenseOverallCTD;
//       const totalProfitOverallYTD =
//         totalRevenueOverallYTD - totalExpenseOverallYTD;

//       const uniqueEmployeesMap = new Map();

//       const filteredEmployeeSummaries = (
//         apiResponse.employeeForecastSummary || []
//       ).filter((empSummary) => {
//         const isOrgMatch = currentOrgId
//           ? empSummary.orgID === currentOrgId
//           : true;
//         return isOrgMatch;
//       });

//       if (filteredEmployeeSummaries.length > 0) {
//         filteredEmployeeSummaries.forEach((empSummary) => {
//           const compositeKey = `${empSummary.emplId}-${empSummary.plcCode}-${empSummary.orgId}-${empSummary.accID}`;

//           if (!uniqueEmployeesMap.has(compositeKey)) {
//             uniqueEmployeesMap.set(compositeKey, {
//               id: compositeKey,
//               name: `${empSummary.name} (${empSummary.emplId}) (${empSummary.plcCode})`,
//               cost: 0,
//               accountId: empSummary.accID || "",
//               orgId: empSummary.orgId || "",
//               glcPlc: empSummary.plcCode || "",
//               hrlyRate: empSummary.perHourRate || 0,
//               monthlyHours: {},
//               monthlyCost: {},
//               monthlyRawCost: {},
//               monthlyFringe: {},
//               monthlyOverhead: {},
//               monthlyGna: {},
//               detailSummary: {},
//               // ✅ Dynamic Names for Labor Breakdown
//               overheadName: empSummary.overheadName || "Overhead",
//               gnaName: empSummary.gnaName || "General & Admin",
//               materialsName: empSummary.materialsName || "Material",
//               hrName: empSummary.hrName || "Human Resource",
//               fringeName: empSummary.fringeName || "Fringe Benefits",
//             });
//           }

//           const employee = uniqueEmployeesMap.get(compositeKey);
//           const payrollSalaries = empSummary.emplSchedule?.payrollSalary || [];

//           payrollSalaries.forEach((salaryEntry) => {
//             const monthRange = getMonthRangeKey(
//               salaryEntry.month,
//               salaryEntry.year,
//             );

//             if (monthRange && dynamicDateRanges.includes(monthRange)) {
//               employee.monthlyRawCost[monthRange] =
//                 (employee.monthlyRawCost[monthRange] || 0) +
//                 (salaryEntry.cost || 0);
//               employee.monthlyFringe[monthRange] =
//                 (employee.monthlyFringe[monthRange] || 0) +
//                 (salaryEntry.fringe || 0);
//               employee.monthlyOverhead[monthRange] =
//                 (employee.monthlyOverhead[monthRange] || 0) +
//                 (salaryEntry.overhead || 0);
//               employee.monthlyGna[monthRange] =
//                 (employee.monthlyGna[monthRange] || 0) + (salaryEntry.gna || 0);
//               employee.monthlyCost[monthRange] =
//                 (employee.monthlyCost[monthRange] || 0) +
//                 (salaryEntry.totalBurdenCost || 0);
//               employee.monthlyHours[monthRange] =
//                 (employee.monthlyHours[monthRange] || 0) +
//                 (salaryEntry.hours || 0);

//               // ✅ Map detailSummary using the dynamic names
//               if (!employee.detailSummary["Raw Cost"])
//                 employee.detailSummary["Raw Cost"] = {};
//               employee.detailSummary["Raw Cost"][monthRange] =
//                 (employee.detailSummary["Raw Cost"][monthRange] || 0) +
//                 (salaryEntry.cost || 0);

//               if (!employee.detailSummary[employee.fringeName])
//                 employee.detailSummary[employee.fringeName] = {};
//               employee.detailSummary[employee.fringeName][monthRange] =
//                 (employee.detailSummary[employee.fringeName][monthRange] || 0) +
//                 (salaryEntry.fringe || 0);

//               if (!employee.detailSummary[employee.overheadName])
//                 employee.detailSummary[employee.overheadName] = {};
//               employee.detailSummary[employee.overheadName][monthRange] =
//                 (employee.detailSummary[employee.overheadName][monthRange] ||
//                   0) + (salaryEntry.overhead || 0);

//               if (!employee.detailSummary[employee.gnaName])
//                 employee.detailSummary[employee.gnaName] = {};
//               employee.detailSummary[employee.gnaName][monthRange] =
//                 (employee.detailSummary[employee.gnaName][monthRange] || 0) +
//                 (salaryEntry.gna || 0);

//               if (!employee.detailSummary[employee.hrName])
//                 employee.detailSummary[employee.hrName] = {};
//               employee.detailSummary[employee.hrName][monthRange] =
//                 (employee.detailSummary[employee.hrName][monthRange] || 0) +
//                 (salaryEntry.hr || 0);

//               if (!employee.detailSummary[employee.materialsName])
//                 employee.detailSummary[employee.materialsName] = {};
//               employee.detailSummary[employee.materialsName][monthRange] =
//                 (employee.detailSummary[employee.materialsName][monthRange] ||
//                   0) + (salaryEntry.materials || 0);
//             }
//           });
//         });
//       }

//       // ---------- NON-LABOR ----------
//       const nonLaborAcctDetailsMap = new Map();
//       const allNonLaborSummariesFiltered = [
//         ...(apiResponse.directCOstForecastSummary || []),
//         ...(apiResponse.indirectCostForecastSummary || []),
//       ].filter((n) => (currentOrgId ? n.orgID === currentOrgId : true));

//       allNonLaborSummariesFiltered.forEach((nonLaborSummary) => {
//         const schedules =
//           nonLaborSummary.directCostSchedule?.forecasts ||
//           nonLaborSummary.indirectCostSchedule?.forecasts ||
//           [];
//         const accountId = nonLaborSummary.accID;
//         const orgId = nonLaborSummary.orgID;
//         const glcPlc = nonLaborSummary.plcCode || "";
//         const accName = nonLaborSummary.accName || `Account: ${accountId}`;

//         // ✅ Map Dynamic Names for Non-Labor
//         const overheadName = nonLaborSummary.overheadName || "Overhead";
//         const gnaName = nonLaborSummary.gnaName || "General & Admin";
//         const materialsName = nonLaborSummary.materialsName || "Material";
//         const hrName = nonLaborSummary.hrName || "Human Resource";
//         const fringeName = nonLaborSummary.fringeName || "Fringe";

//         if (!nonLaborAcctDetailsMap.has(accountId)) {
//           nonLaborAcctDetailsMap.set(accountId, {
//             id: accountId,
//             description: accName,
//             orgId: orgId,
//             glcPlc: glcPlc,
//             overheadName,
//             gnaName,
//             materialsName,
//             hrName,
//             fringeName,
//             total: 0,
//             monthlyData: dynamicDateRanges.reduce(
//               (acc, range) => ({ ...acc, [range]: 0 }),
//               {},
//             ),
//             employees: new Map(),
//           });
//         }
//         const acctGroup = nonLaborAcctDetailsMap.get(accountId);
//         const employeeId = nonLaborSummary.emplId || "N/A_Employee";
//         const employeeName = nonLaborSummary.name || ` ${accountId}`;

//         if (!acctGroup.employees.has(employeeId)) {
//           acctGroup.employees.set(employeeId, {
//             id: employeeId,
//             name: `${employeeName} (${employeeId})`,
//             total: 0,
//             gna: nonLaborSummary.gna || 0,
//             materials: nonLaborSummary.materials || 0,
//             hr: nonLaborSummary.hr || 0,
//             fringe: nonLaborSummary.fringe || 0,
//             overhead: nonLaborSummary.overhead || 0,
//             overheadName,
//             gnaName,
//             materialsName,
//             hrName,
//             fringeName,
//             monthlyData: dynamicDateRanges.reduce(
//               (acc, range) => ({ ...acc, [range]: 0 }),
//               {},
//             ),
//             entries: [],
//           });
//         }
//         const employeeGroup = acctGroup.employees.get(employeeId);

//         schedules.forEach((scheduleEntry) => {
//           const monthRange = getMonthRangeKey(
//             scheduleEntry.month,
//             scheduleEntry.year,
//           );
//           if (monthRange && dynamicDateRanges.includes(monthRange)) {
//             let entryCost = 0;
//             let burden = scheduleEntry.burden;
//             if (planType === "EAC") {
//               entryCost = scheduleEntry.actualamt || 0;
//             } else if (planType === "BUD") {
//               entryCost = scheduleEntry.forecastedamt || 0;
//             } else {
//               entryCost =
//                 (scheduleEntry.cost || 0) +
//                 (scheduleEntry.fringe || 0) +
//                 (scheduleEntry.overhead || 0) +
//                 (scheduleEntry.gna || 0) +
//                 (scheduleEntry.materials || 0);
//             }

//             // ✅ Determine names from scheduleEntry or fallback
//             const entryOverheadName =
//               scheduleEntry.overheadName || employeeGroup.overheadName;
//             const entryGnaName = scheduleEntry.gnaName || employeeGroup.gnaName;
//             const entryMaterialsName =
//               scheduleEntry.materialsName || employeeGroup.materialsName;
//             const entryHrName = scheduleEntry.hrName || employeeGroup.hrName;
//             const entryFringeName =
//               scheduleEntry.fringeName || employeeGroup.fringeName;

//             employeeGroup.entries.push({
//               id: `${scheduleEntry.dctId || scheduleEntry.forecastid}-${monthRange}`,
//               dctId: scheduleEntry.dctId,
//               forecastid: scheduleEntry.forecastid,
//               monthLabel: `${String(scheduleEntry.month).padStart(2, "0")}/${scheduleEntry.year}`,
//               total: entryCost,
//               monthlyValues: { [monthRange]: entryCost },
//               gna: scheduleEntry.gna,
//               overheadName: entryOverheadName,
//               gnaName: entryGnaName,
//               materialsName: entryMaterialsName,
//               hrName: entryHrName,
//               fringeName: entryFringeName,
//               overhead: scheduleEntry.overhead,
//               hr: scheduleEntry.hr,
//               materials: scheduleEntry.materials,
//               fringe: scheduleEntry.fringe,
//             });

//             employeeGroup.overheadName = entryOverheadName;
//             employeeGroup.gnaName = entryGnaName;
//             employeeGroup.materialsName = entryMaterialsName;
//             employeeGroup.hrName = entryHrName;
//             employeeGroup.fringeName = entryFringeName;

//             employeeGroup.monthlyData[monthRange] += entryCost;
//             employeeGroup.total += entryCost;
//             acctGroup.monthlyData[monthRange] =
//               acctGroup.monthlyData[monthRange] + burden + entryCost;
//             acctGroup.total += entryCost;
//           }
//         });
//       });

//       // ---------- FINALIZE ----------
//       Array.from(uniqueEmployeesMap.values()).forEach((employee) => {
//         employee.rawCost = Object.values(employee.monthlyRawCost).reduce(
//           (s, v) => s + v,
//           0,
//         );
//         employee.fringe = Object.values(employee.monthlyFringe).reduce(
//           (s, v) => s + v,
//           0,
//         );
//         employee.overhead = Object.values(employee.monthlyOverhead).reduce(
//           (s, v) => s + v,
//           0,
//         );
//         employee.gna = Object.values(employee.monthlyGna).reduce(
//           (s, v) => s + v,
//           0,
//         );
//         employee.cost = Object.values(employee.monthlyCost).reduce(
//           (s, v) => s + v,
//           0,
//         );
//       });

//       Array.from(nonLaborAcctDetailsMap.values()).forEach((acctGroup) => {
//         acctGroup.total = Object.values(acctGroup.monthlyData).reduce(
//           (s, v) => s + v,
//           0,
//         );
//         acctGroup.employees = Array.from(acctGroup.employees.values());
//       });

//       // ---------- PROFIT ----------
//       const selectedRevenueData = monthlyRevenueData;
//       dynamicDateRanges.forEach((range) => {
//         const revenue = selectedRevenueData[range] || 0;
//         const expenses = totalExpenseData[range] || 0;
//         profitData[range] = revenue === 0 ? 0 : revenue - expenses;
//       });

//       const overallProfitOnCostCTD =
//         totalExpenseOverallCTD !== 0
//           ? totalProfitOverallCTD / totalExpenseOverallCTD
//           : 0;
//       const overallProfitOnCostYTD =
//         totalExpenseOverallYTD !== 0
//           ? totalProfitOverallYTD / totalExpenseOverallYTD
//           : 0;

//       const overallProfitOnRevenueCTD =
//         totalRevenueOverallCTD !== 0
//           ? totalProfitOverallCTD / totalRevenueOverallCTD
//           : 0;
//       const overallProfitOnRevenueYTD =
//         totalRevenueOverallYTD !== 0
//           ? totalProfitOverallYTD / totalRevenueOverallYTD
//           : 0;

//       // ---------- BUILD ROWS ----------
//       financialRows.push(
//         {
//           id: `revenue-${currentOrgId}`,
//           description: "Revenue",
//           total: totalRevenueOverallCTD,
//           ytdTotal: totalRevenueOverallYTD,
//           data: selectedRevenueData,
//           tnmRevenueData: monthlyRevenueData,
//           cpffRevenueData: monthlyRevenueData,
//           type: "summary",
//           orgId: currentOrgId,
//         },
//         {
//           id: `total-staff-cost-${currentOrgId}`,
//           description: "Total Burdened Labor Cost",
//           total: totalStaffCostOverallCTD,
//           ytdTotal: totalStaffCostOverallYTD,
//           data: totalStaffCostByMonth,
//           type: "expandable",
//           employees: Array.from(uniqueEmployeesMap.values()),
//           orgId: currentOrgId,
//         },
//         {
//           id: `non-labor-staff-cost-${currentOrgId}`,
//           description: "Total Burdened Non-Labor Cost",
//           total: totalNonLaborCostOverallCTD,
//           ytdTotal: totalNonLaborCostOverallYTD,
//           data: totalNonLaborCostByMonth,
//           type: "expandable",
//           nonLaborAccts: Array.from(nonLaborAcctDetailsMap.values()),
//           orgId: currentOrgId,
//         },
//         {
//           id: `total-expense-${currentOrgId}`,
//           description: "Total Expense",
//           total: totalExpenseOverallCTD,
//           ytdTotal: totalExpenseOverallYTD,
//           data: totalExpenseData,
//           type: "summary",
//           orgId: currentOrgId,
//         },
//         {
//           id: `profit-${currentOrgId}`,
//           description: "Profit",
//           total: totalProfitOverallCTD,
//           ytdTotal: totalProfitOverallYTD,
//           data: profitData,
//           type: "summary",
//           orgId: currentOrgId,
//         },
//       );

//       dynamicDateRanges.forEach((range) => {
//         const profit = profitData[range] || 0;
//         const expense = totalExpenseData[range] || 0;
//         profitOnCostData[range] = expense !== 0 ? profit / expense : 0;
//       });

//       financialRows.push({
//         id: `profit-cost-${currentOrgId}`,
//         description: "Profit % on Cost",
//         total: overallProfitOnCostCTD,
//         ytdTotal: overallProfitOnCostYTD,
//         data: profitOnCostData,
//         type: "summary",
//         orgId: currentOrgId,
//       });

//       dynamicDateRanges.forEach((range) => {
//         const profit = profitData[range] || 0;
//         let revenueForPercentage = selectedRevenueData[range] || 0;
//         profitOnRevenueData[range] =
//           revenueForPercentage !== 0 ? profit / revenueForPercentage : 0;
//       });

//       financialRows.push({
//         id: `profit-revenue-${currentOrgId}`,
//         description: "Profit % on Revenue",
//         total: overallProfitOnRevenueCTD,
//         ytdTotal: overallProfitOnRevenueYTD,
//         data: profitOnRevenueData,
//         type: "summary",
//         orgId: currentOrgId,
//       });

//       return financialRows;
//     },
//     [selectedRevenueView],
//   );

//   useEffect(() => {
//     // console.log(
//     //   "useEffect [allApiData, selectedOrgId, dynamicDateRanges, ...]: Transform trigger effect."
//     // );
//     if (allApiData && selectedOrgId && dynamicDateRanges.length > 0) {
//       // console.log(
//       //   "useEffect (transform trigger): allApiData, selectedOrgId, dynamicDateRanges are ready. Transforming data..."
//       // );
//       const transformedData = transformApiDataToFinancialRows(
//         allApiData,
//         selectedOrgId,
//         dynamicDateRanges,
//         selectedRevenueView,
//         type,
//         initialApiData.revenue,
//       );
//       // console.log(
//       //   "Transformed Data (after filter & transform):",
//       //   transformedData
//       // );
//       setFinancialData(transformedData);
//     } else {
//       // console.log(
//       //   "useEffect (transform trigger): Waiting for allApiData, selectedOrgId, or dynamicDateRanges to be ready."
//       // );
//       setFinancialData([]);
//     }
//     setExpandedStaffRows([]);
//     setExpandedEmployeeDetails([]);
//     setExpandedNonLaborAcctRows([]);
//   }, [
//     allApiData,
//     selectedOrgId,
//     dynamicDateRanges,
//     selectedRevenueView,
//     transformApiDataToFinancialRows,
//     type,
//   ]);

//   useEffect(() => {
//     if (allApiData && selectedOrgId && dynamicDateRanges.length > 0) {
//       const transformedData = transformApiDataToFinancialRows(
//         allApiData,
//         selectedOrgId,
//         dynamicDateRanges,
//         selectedRevenueView,
//         type,
//       );

//       let absoluteCtdRows = transformedData;
//       if (grandTotalCtdData && allTimeDateRanges.length > 0) {
//         // 1. Determine which months belong in our custom CTD calculation
//         let allowedCtdMonths = [...allTimeDateRanges];

//         // If a specific year is selected (not "All"), restrict CTD up to that year's end
//         if (fiscalYear && fiscalYear !== "All") {
//           const selectedYearNum = Number(fiscalYear);
//           allowedCtdMonths = allTimeDateRanges.filter((range) => {
//             const [_, yearStr] = range.split("/");
//             return Number(yearStr) <= selectedYearNum; // Sum everything from start up to selected year
//           });
//         }

//         // 2. Generate the full baseline rows across all time
//         const fullCtdRows = transformApiDataToFinancialRows(
//           grandTotalCtdData,
//           selectedOrgId,
//           allTimeDateRanges,
//           selectedRevenueView,
//           type,
//         );

//         // 3. Instead of absolute total of ALL years, calculate dynamic totals using allowedCtdMonths
//         absoluteCtdRows = fullCtdRows.map((row) => {
//           // Recalculate CTD row total based only on allowed months
//           const calculatedCtdTotal = allowedCtdMonths.reduce(
//             (sum, month) => sum + (row.data?.[month] || 0),
//             0,
//           );

//           return {
//             ...row,
//             total: calculatedCtdTotal, // This overrides total for summary rows (Revenue, Expense, Profit, etc.)
//             employees: row.employees?.map((emp) => {
//               const calculatedEmpCtdCost = allowedCtdMonths.reduce(
//                 (sum, month) => sum + (emp.monthlyCost?.[month] || 0),
//                 0,
//               );
//               const calculatedEmpCtdHours = allowedCtdMonths.reduce(
//                 (sum, month) => sum + (emp.monthlyHours?.[month] || 0),
//                 0,
//               );

//               const dynamicCtdDetailSummary = {};
//               Object.keys(emp.detailSummary || {}).forEach((label) => {
//                 dynamicCtdDetailSummary[label] = allowedCtdMonths.reduce(
//                   (sum, month) =>
//                     sum + (emp.detailSummary?.[label]?.[month] || 0),
//                   0,
//                 );
//               });

//               return {
//                 ...emp,
//                 cost: calculatedEmpCtdCost,
//                 hours: calculatedEmpCtdHours,
//                 detailSummary: dynamicCtdDetailSummary,
//               };
//             }),
//             nonLaborAccts: row.nonLaborAccts?.map((acct) => {
//               const calculatedAcctCtdTotal = allowedCtdMonths.reduce(
//                 (sum, month) => sum + (acct.monthlyData?.[month] || 0),
//                 0,
//               );

//               return {
//                 ...acct,
//                 total: calculatedAcctCtdTotal,
//                 employees: acct.employees?.map((empG) => {
//                   const calculatedEmpGCtdTotal = allowedCtdMonths.reduce(
//                     (sum, month) => sum + (empG.monthlyData?.[month] || 0),
//                     0,
//                   );
//                   return {
//                     ...empG,
//                     total: calculatedEmpGCtdTotal,
//                   };
//                 }),
//               };
//             }),
//           };
//         });
//       }

//       const absoluteRowById = new Map(absoluteCtdRows.map((r) => [r.id, r]));

//       const mergedData = transformedData.map((row) => {
//         const absRow = absoluteRowById.get(row.id);
//         const absEmployeeById = new Map(
//           (absRow?.employees || []).map((e) => [e.id, e]),
//         );
//         const absAcctById = new Map(
//           (absRow?.nonLaborAccts || []).map((a) => [a.id, a]),
//         );

//         return {
//           ...row,
//           // Make sure the UI binds to absoluteTotal for rendering CTD values
//           absoluteTotal: absRow?.total ?? row.total,
//           employees: row.employees?.map((emp) => {
//             const absEmp = absEmployeeById.get(emp.id);

//             return {
//               ...emp,
//               absoluteCost: absEmp?.cost ?? emp.cost,
//               absoluteHours:
//                 absEmp?.hours ??
//                 Object.values(emp.monthlyHours || {}).reduce(
//                   (s, v) => s + v,
//                   0,
//                 ),
//               absoluteDetailSummary: absEmp?.detailSummary ?? {},
//             };
//           }),
//           nonLaborAccts: row.nonLaborAccts?.map((acct) => {
//             const absAcct = absAcctById.get(acct.id);
//             const absEmployeeGroupById = new Map(
//               (absAcct?.employees || []).map((e) => [e.id, e]),
//             );

//             return {
//               ...acct,
//               absoluteTotal: absAcct?.total ?? acct.total,
//               employees: acct.employees?.map((empG) => {
//                 const matchedEmp = absEmployeeGroupById.get(empG.id);
//                 return {
//                   ...empG,
//                   absoluteTotal: matchedEmp?.total ?? empG.total,
//                 };
//               }),
//             };
//           }),
//         };
//       });

//       setFinancialData(mergedData);
//     } else {
//       setFinancialData([]);
//     }
//     setExpandedStaffRows([]);
//     setExpandedEmployeeDetails([]);
//     setExpandedNonLaborAcctRows([]);
//   }, [
//     allApiData,
//     grandTotalCtdData,
//     allTimeDateRanges,
//     selectedOrgId,
//     dynamicDateRanges,
//     selectedRevenueView,
//     transformApiDataToFinancialRows,
//     type,
//     fiscalYear, // Added fiscalYear as a dependency to recalculate when the selection changes!
//   ]);

//   const toggleStaffRow = (id) => {
//     setExpandedStaffRows((prev) =>
//       prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
//     );
//   };

//   const toggleEmployeeDetail = (id) => {
//     setExpandedEmployeeDetails((prev) =>
//       prev.includes(id)
//         ? prev.filter((detailId) => detailId !== id)
//         : [...prev, id],
//     );
//   };

//   const toggleNonLaborAcctRow = (id) => {
//     setExpandedNonLaborAcctRows((prev) =>
//       prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
//     );
//   };

//   const formatValue = (value, isHours = false, isPercentage = false) => {
//     if (typeof value === "number") {
//       if (value === 0) value = 0;
//       let formatted;
//       if (isPercentage) {
//         formatted = (value * 100).toLocaleString("en-US", {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         });
//         return `${formatted}%`;
//       }
//       formatted = value.toLocaleString("en-US", {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       });
//       return isHours ? `${formatted} hrs` : formatted;
//     }
//     return isHours ? "0.00 hrs" : isPercentage ? "0.00%" : "0.00";
//   };

//   const getGlassmorphismClasses = () => `
//     bg-white bg-opacity-5 backdrop-filter backdrop-blur-lg rounded-sm
//     border border-opacity-10 border-white
//   `;

//   if (isLoading) {
//     return (
//       // <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-indigo-50 text-gray-800 text-2xl">
//       //   Loading data...
//       // </div>
//       <div className="p-4 font-inter flex justify-center items-center">
//         <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
//         <span className="ml-2 text-xs text-gray-600">Loading data...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-indigo-50 text-red-600 text-2xl">
//         Error: {error}
//       </div>
//     );
//   }

//   const toggleRow = (id) => {
//     setExpandedRows((prev) =>
//       prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
//     );
//   };

//   const expandAll = () => {
//     // ✅ Expand all staff rows (parents)
//     const staffRowsToExpand = financialData
//       .filter(
//         (row) =>
//           row.type === "expandable" && row.id.startsWith("total-staff-cost"),
//       )
//       .map((row) => row.id);
//     setExpandedStaffRows(staffRowsToExpand);

//     // ✅ Expand all employee details (children under staff)
//     const employeeDetailsToExpand = [];
//     financialData.forEach((row) => {
//       if (
//         row.type === "expandable" &&
//         row.id.startsWith("total-staff-cost") &&
//         row.employees
//       ) {
//         row.employees.forEach((employee) =>
//           employeeDetailsToExpand.push(`${row.id}-${employee.id}`),
//         );
//       }
//     });
//     setExpandedEmployeeDetails(employeeDetailsToExpand);

//     // ✅ Expand all non-labor parent rows (FIXED typo + separate state)
//     const nonLaborParentRowsToExpand = financialData
//       .filter(
//         (row) =>
//           row.type === "expandable" &&
//           row.id.startsWith("non-labor-staff-cost"), // 🔥 FIXED typo
//       )
//       .map((row) => row.id);

//     setExpandedNonLaborAcctRows(nonLaborParentRowsToExpand); // 🔥 now expands parents

//     // ✅ Expand all non-labor child account rows
//     const nonLaborAcctRowsToExpand = [];
//     financialData.forEach((row) => {
//       if (
//         row.type === "expandable" &&
//         row.id.startsWith("non-labor-staff-cost") &&
//         row.nonLaborAccts
//       ) {
//         row.nonLaborAccts.forEach((acct) =>
//           nonLaborAcctRowsToExpand.push(`${row.id}-${acct.id}`),
//         );
//       }
//     });
//     setExpandedNonLaborAcctRows((prev) => [
//       ...new Set([
//         ...prev,
//         ...nonLaborParentRowsToExpand,
//         ...nonLaborAcctRowsToExpand,
//       ]),
//     ]); //  merge parent + children
//   };

//   const collapseAll = () => {
//     setExpandedStaffRows([]);
//     setExpandedEmployeeDetails([]);
//     setExpandedNonLaborAcctRows([]); // clears both parent + child IDs
//   };

//   // const buildExcelRows = () => {
//   //   const rows = [];

//   //   const isPercentageRow = (row) => row.description?.includes("Profit %");

//   //   const formatPercent = (value) => Number(value) * 100;

//   //   const getTargetYtdYear = () => {
//   //     if (!dynamicDateRanges || dynamicDateRanges.length === 0) return null;
//   //     const lastRange = dynamicDateRanges[dynamicDateRanges.length - 1];
//   //     const match = lastRange.match(/\d{4}/);
//   //     return match ? match[0] : null;
//   //   };

//   //   const ytdYear = getTargetYtdYear();

//   //   financialData.forEach((row) => {
//   //     // 🔹 CTD Total
//   //     // const rawCtd = row.id.startsWith("revenue-")
//   //     //   ? revenueSum
//   //     //   : Number(row.total) || 0;

//   //     // 🔹 CTD Total
//   //     const rawCtd = row.id.startsWith("revenue-")
//   //       ? revenueSumCtd
//   //       : Number(row.total) || 0;

//   //     // 🔹 YTD Total
//   //     const rawYtd = row.id.startsWith("revenue-")
//   //       ? revenueSum // Or filter revenueSum if base revenue has year-based breakdowns
//   //       : Number(row.ytdTotal) || 0;

//   //     const baseRow = {
//   //       Description: row.description,
//   //       "Account ID": row.accountId || "",
//   //       "Org ID": row.orgId || "",
//   //       "GLC/PLC": row.glcPlc || "",
//   //       "Hrly Rate": row.hrlyRate || "",
//   //       "YTD Total": isPercentageRow(row) ? formatPercent(rawYtd) : rawYtd,
//   //       "CTD Total": isPercentageRow(row) ? formatPercent(rawCtd) : rawCtd,
//   //     };

//   //     // 🔹 Month-wise values
//   //     dynamicDateRanges.forEach((month) => {
//   //       const rawValue = Number(row.data?.[month]) || 0;

//   //       baseRow[month] = isPercentageRow(row)
//   //         ? formatPercent(rawValue)
//   //         : rawValue;
//   //     });

//   //     rows.push(baseRow);

//   //     // 🔹 LABOR / STAFF SECTION
//   //     if (row.employees && !row.id.includes("non-labor")) {
//   //       row.employees.forEach((emp) => {
//   //         const empRow = {
//   //           Description: `    ${emp.name}`,
//   //           "Account ID": emp.accountId || "",
//   //           "Org ID": emp.orgId || "",
//   //           "GLC/PLC": emp.glcPlc || "",
//   //           "Hrly Rate": emp.hrlyRate || "",
//   //           "YTD Total": Number(emp.ytdCost) || 0,
//   //           "CTD Total": Number(emp.cost) || 0,
//   //         };

//   //         dynamicDateRanges.forEach((month) => {
//   //           empRow[month] = Number(emp.monthlyCost?.[month]) || 0;
//   //         });

//   //         rows.push(empRow);

//   //         // Employee Hours
//   //         const empCtdHours =
//   //           Number(
//   //             Object.values(emp.monthlyHours || {}).reduce(
//   //               (sum, v) => sum + v,
//   //               0,
//   //             ),
//   //           ) || 0;

//   //         const empYtdHours =
//   //           Number(
//   //             Object.entries(emp.monthlyHours || {})
//   //               .filter(([m]) => m.includes(ytdYear))
//   //               .reduce((sum, [_, v]) => sum + v, 0),
//   //           ) || 0;

//   //         // Employee Hours
//   //         rows.push({
//   //           Description: `       Employee Hours`,
//   //           "Account ID": "",
//   //           "Org ID": "",
//   //           "GLC/PLC": "",
//   //           "Hrly Rate": "",
//   //           "YTD Total": empYtdHours,
//   //           "CTD Total": empCtdHours,
//   //           ...dynamicDateRanges.reduce((acc, month) => {
//   //             acc[month] = Number(emp.monthlyHours?.[month]) || 0;
//   //             return acc;
//   //           }, {}),
//   //         });

//   //         // Detail Breakdown
//   //         Object.entries(emp.detailSummary || {}).forEach(
//   //           ([label, monthData]) => {
//   //             const ctdDetailSum =
//   //               Number(Object.values(monthData).reduce((s, v) => s + v, 0)) ||
//   //               0;
//   //             const ytdDetailSum =
//   //               Number(
//   //                 Object.entries(monthData)
//   //                   .filter(([m]) => m.includes(ytdYear))
//   //                   .reduce((s, [_, v]) => s + v, 0),
//   //               ) || 0;

//   //             const detailRow = {
//   //               Description: `      --- ${label}`,
//   //               "Account ID": "",
//   //               "Org ID": "",
//   //               "GLC/PLC": "",
//   //               "Hrly Rate": "",
//   //               "YTD Total": ytdDetailSum,
//   //               "CTD Total": ctdDetailSum,
//   //             };

//   //             dynamicDateRanges.forEach((month) => {
//   //               detailRow[month] = Number(monthData?.[month]) || 0;
//   //             });

//   //             rows.push(detailRow);
//   //           },
//   //         );
//   //       });
//   //     }

//   //     // 🔹 NON-LABOR SECTION
//   //     if (row.nonLaborAccts) {
//   //       row.nonLaborAccts.forEach((acct) => {
//   //         const acctRow = {
//   //           Description: `   ${acct.description}`,
//   //           "Account ID": acct.id || "",
//   //           "Org ID": acct.orgId || "",
//   //           "GLC/PLC": acct.glcPlc || "",
//   //           "Hrly Rate": "",
//   //           "YTD Total": Number(acct.ytdTotal) || 0,
//   //           "CTD Total": Number(acct.total) || 0,
//   //         };

//   //         dynamicDateRanges.forEach((month) => {
//   //           acctRow[month] = Number(acct.monthlyData?.[month]) || 0;
//   //         });

//   //         rows.push(acctRow);

//   //         acct.employees.forEach((empGroup) => {
//   //           const empNameRow = {
//   //             Description: `      ${empGroup.name}`,
//   //             "Account ID": "",
//   //             "Org ID": "",
//   //             "GLC/PLC": "",
//   //             "Hrly Rate": "",
//   //             "YTD Total": Number(empGroup.ytdTotal) || 0,
//   //             "CTD Total": Number(empGroup.total) || 0,
//   //           };

//   //           dynamicDateRanges.forEach((month) => {
//   //             empNameRow[month] = Number(empGroup.monthlyData?.[month]) || 0;
//   //           });

//   //           rows.push(empNameRow);

//   //           const breakdownLabels = [
//   //             { key: "gna", label: "General & Admin" },
//   //             { key: "overhead", label: "Overhead" },
//   //             { key: "hr", label: "Human Resource" },
//   //             { key: "materials", label: "Material" },
//   //             { key: "fringe", label: "Fringe Benefits" },
//   //           ];

//   //           breakdownLabels.forEach(({ key, label }) => {
//   //             const ytdSubCategoryTotal = empGroup.entries
//   //               .filter((entry) => entry.monthLabel.includes(ytdYear))
//   //               .reduce((sum, entry) => sum + (Number(entry[key]) || 0), 0);
//   //             const detailRow = {
//   //               Description: `         --- ${label}`,
//   //               "Account ID": "",
//   //               "Org ID": "",
//   //               "GLC/PLC": "",
//   //               "Hrly Rate": "",
//   //               "YTD Total": ytdSubCategoryTotal,
//   //               "CTD Total": Number(empGroup[key]) || 0,
//   //             };

//   //             dynamicDateRanges.forEach((month) => {
//   //               const monthEntry = empGroup.entries.find(
//   //                 (e) => e.monthLabel === month,
//   //               );

//   //               detailRow[month] =
//   //                 Number(monthEntry ? (monthEntry[key] ?? 0) : 0) || 0;
//   //             });

//   //             rows.push(detailRow);
//   //           });
//   //         });
//   //       });
//   //     }
//   //   });

//   //   return rows;
//   // };

//   // const exportToExcel = () => {
//   //   try {
//   //     setIsExporting(true);

//   //     const excelRows = buildExcelRows();

//   //     const worksheet = XLSX.utils.json_to_sheet(excelRows);
//   //     const workbook = XLSX.utils.book_new();

//   //     // Set up base grid properties matching your design template
//   //     worksheet["!views"] = [{ showGridLines: true }];

//   //     // Check if worksheet has cells
//   //     if (worksheet["!ref"]) {
//   //       const range = XLSX.utils.decode_range(worksheet["!ref"]);

//   //       for (let R = range.s.r; R <= range.e.r; ++R) {
//   //         // Identify row type by checking the Description column (Always Column 0)
//   //         const descCellRef = XLSX.utils.encode_cell({ c: 0, r: R });
//   //         const rowDescription = worksheet[descCellRef]?.v || "";
//   //         const isHoursRow = rowDescription.includes("Hours");
//   //         const isPercentRow = rowDescription.includes("Profit %");

//   //         // Visual context detection for financial summary indicators
//   //         const isSummaryBlock =
//   //           rowDescription.includes("Total") ||
//   //           rowDescription.includes("Summary") ||
//   //           rowDescription.includes("Net P&L");

//   //         for (let C = range.s.c; C <= range.e.c; ++C) {
//   //           const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
//   //           const cell = worksheet[cellAddress];

//   //           if (!cell) continue;

//   //           // 1. Style the Header Row (Row 0) -> Bold text and Slate-800 Background color
//   //           if (R === 0) {
//   //             cell.s = {
//   //               font: {
//   //                 name: "Arial",
//   //                 size: 11,
//   //                 bold: true,
//   //                 color: { rgb: "FFFFFF" }, // White text color
//   //               },
//   //               fill: {
//   //                 patternType: "solid", // Corrected flat structure for xlsx-js-style
//   //                 fgColor: { rgb: "1E293B" }, // Slate-800 Theme matching Web UI
//   //               },
//   //               alignment: {
//   //                 vertical: "center",
//   //                 // Right align numeric values headers ("CTD Total" starts at Index 5, and all months after)
//   //                 horizontal: C >= 5 ? "right" : "left",
//   //                 wrapText: true,
//   //               },
//   //             };
//   //           }
//   //           // 2. Format and Style Data Rows
//   //           else {
//   //             const isBoldRow =
//   //               isSummaryBlock || rowDescription.trim().startsWith("---");

//   //             let cellStyle = {
//   //               font: {
//   //                 name: "Arial",
//   //                 size: 10,
//   //                 bold: isBoldRow,
//   //               },
//   //               alignment: {
//   //                 vertical: "center",
//   //                 horizontal: typeof cell.v === "number" ? "right" : "left",
//   //               },
//   //             };

//   //             // Clean currency accounting formats and right align allocations
//   //             if (typeof cell.v === "number") {
//   //               if (isHoursRow) {
//   //                 cell.z = "#,##0"; // Standard configuration for tracked units
//   //               } else if (isPercentRow) {
//   //                 cell.z = '0.00"%"'; // Layout percentage notation
//   //               } else {
//   //                 // Clean standard accounting format layout with fallbacks
//   //                 cell.z = '"$"#,##0.00;(" \x22$\x22#,##0.00")";"-"';
//   //               }
//   //             }

//   //             // Contextual row highlights and block definitions
//   //             if (isSummaryBlock) {
//   //               cellStyle.fill = {
//   //                 patternType: "solid",
//   //                 fgColor: { rgb: "F0FDF4" }, // Light green highlight summary tint
//   //               };
//   //               cellStyle.border = {
//   //                 top: { style: "thin", color: { rgb: "94A3B8" } },
//   //                 bottom: { style: "double", color: { rgb: "334155" } }, // Double line accounting underline
//   //               };
//   //             } else if (isBoldRow) {
//   //               cellStyle.fill = {
//   //                 patternType: "solid",
//   //                 fgColor: { rgb: "F8FAFC" }, // Default layout separator fill
//   //               };
//   //             }

//   //             cell.s = cellStyle;
//   //           }
//   //         }
//   //       }

//   //       // Apply proper structural column configurations to completely prevent clipping
//   //       const maxCols = range.e.c - range.s.c + 1;
//   //       worksheet["!cols"] = Array(maxCols).fill({ wch: 14 }); // Sized dynamic monthly blocks
//   //       worksheet["!cols"][0] = { wch: 45 }; // Wide Description column to capture nesting text tree indentation
//   //       worksheet["!cols"][1] = { wch: 16 }; // Account ID
//   //       worksheet["!cols"][2] = { wch: 12 }; // Org ID
//   //       worksheet["!cols"][3] = { wch: 14 }; // GLC/PLC
//   //       worksheet["!cols"][4] = { wch: 12 }; // Hrly Rate
//   //       worksheet["!cols"][5] = { wch: 16 }; // CTD Total
//   //     }

//   //     XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Plan");

//   //     const excelBuffer = XLSX.write(workbook, {
//   //       bookType: "xlsx",
//   //       type: "array",
//   //     });

//   //     const file = new Blob([excelBuffer], {
//   //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   //     });

//   //     saveAs(
//   //       file,
//   //       `Financial_Plan_${selectedOrgId}_${new Date()
//   //         .toISOString()
//   //         .slice(0, 10)}.xlsx`,
//   //     );
//   //   } catch (err) {
//   //     console.error("Excel export failed", err);
//   //   } finally {
//   //     setIsExporting(false);
//   //   }
//   // };

//   const exportToExcel = () => {
//     try {
//       setIsExporting(true);

//       const excelRows = buildExcelRows();

//       const worksheet = XLSX.utils.json_to_sheet(excelRows);
//       const workbook = XLSX.utils.book_new();

//       // Set up base grid properties matching your design template
//       worksheet["!views"] = [{ showGridLines: true }];

//       // Check if worksheet has cells
//       if (worksheet["!ref"]) {
//         const range = XLSX.utils.decode_range(worksheet["!ref"]);

//         for (let R = range.s.r; R <= range.e.r; ++R) {
//           // Identify row type by checking the Description column (Always Column 0)
//           const descCellRef = XLSX.utils.encode_cell({ c: 0, r: R });
//           const rowDescription = worksheet[descCellRef]?.v || "";
//           const isHoursRow = rowDescription.includes("Hours");
//           const isPercentRow = rowDescription.includes("Profit %");

//           // Visual context detection for financial summary indicators
//           const isSummaryBlock =
//             rowDescription.includes("Total") ||
//             rowDescription.includes("Summary") ||
//             rowDescription.includes("Net P&L") ||
//             rowDescription === "Revenue" ||
//             rowDescription === "Profit";

//           for (let C = range.s.c; C <= range.e.c; ++C) {
//             const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
//             const cell = worksheet[cellAddress];

//             if (!cell) continue;

//             // 1. Style the Header Row (Row 0) -> Bold text and Slate-800 Background color
//             if (R === 0) {
//               cell.s = {
//                 font: {
//                   name: "Arial",
//                   size: 11,
//                   bold: true,
//                   color: { rgb: "FFFFFF" }, // White text color
//                 },
//                 fill: {
//                   patternType: "solid",
//                   fgColor: { rgb: "1E293B" }, // Slate-800 Theme matching Web UI
//                 },
//                 alignment: {
//                   vertical: "center",
//                   // Right align numeric value headers starting from column index 5 (CTD Total) onwards
//                   horizontal: C >= 5 ? "right" : "left",
//                   wrapText: true,
//                 },
//               };
//             }
//             // 2. Format and Style Data Rows
//             else {
//               const isBoldRow =
//                 isSummaryBlock || rowDescription.trim().startsWith("---");

//               let cellStyle = {
//                 font: {
//                   name: "Arial",
//                   size: 10,
//                   bold: isBoldRow,
//                 },
//                 alignment: {
//                   vertical: "center",
//                   horizontal: typeof cell.v === "number" ? "right" : "left",
//                 },
//               };

//               // Clean currency accounting formats and right align allocations
//               if (typeof cell.v === "number") {
//                 if (isHoursRow) {
//                   cell.z = "#,##0"; // Tracked unit integer format
//                 } else if (isPercentRow) {
//                   cell.z = '0.00"%"'; // Format percentage layout
//                 } else {
//                   // Accounting format matching standard reporting layout
//                   cell.z = '"$"#,##0.00;(" \x22$\x22#,##0.00")";"-"';
//                 }
//               }

//               // Contextual row highlights and block definitions
//               if (isSummaryBlock) {
//                 cellStyle.fill = {
//                   patternType: "solid",
//                   fgColor: { rgb: "F0FDF4" }, // Light green highlight summary tint
//                 };
//                 cellStyle.border = {
//                   top: { style: "thin", color: { rgb: "94A3B8" } },
//                   bottom: { style: "double", color: { rgb: "334155" } }, // Double line accounting underline
//                 };
//               } else if (isBoldRow) {
//                 cellStyle.fill = {
//                   patternType: "solid",
//                   fgColor: { rgb: "F8FAFC" }, // Default layout separator fill
//                 };
//               }

//               cell.s = cellStyle;
//             }
//           }
//         }

//         // Apply structural column configurations to completely prevent clipping
//         const maxCols = range.e.c - range.s.c + 1;
//         worksheet["!cols"] = Array(maxCols).fill({ wch: 14 }); // Sized dynamic monthly blocks
//         worksheet["!cols"][0] = { wch: 45 }; // Wide Description column to capture nesting text tree indentation
//         worksheet["!cols"][1] = { wch: 16 }; // Account ID
//         worksheet["!cols"][2] = { wch: 12 }; // Org ID
//         worksheet["!cols"][3] = { wch: 14 }; // GLC/PLC
//         worksheet["!cols"][4] = { wch: 12 }; // Hrly Rate
//         worksheet["!cols"][5] = { wch: 16 }; // CTD Total
//         worksheet["!cols"][6] = { wch: 16 }; // YTD Total
//       }

//       XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Plan");

//       const excelBuffer = XLSX.write(workbook, {
//         bookType: "xlsx",
//         type: "array",
//       });

//       const file = new Blob([excelBuffer], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       });

//       saveAs(
//         file,
//         `Financial_Plan_${selectedOrgId}_${new Date().toISOString().slice(0, 10)}.xlsx`,
//       );
//     } catch (err) {
//       console.error("Excel export failed", err);
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   // const buildExcelRows = () => {
//   //   const rows = [];
//   //   const isPercentageRow = (row) => row.description?.includes("Profit %");
//   //   const formatPercent = (value) => Number(value) * 100;

//   //   financialData.forEach((row) => {
//   //     // 1. Parent Summary Row Alignment Setup
//   //     const parentCtd =
//   //       row.description === "Revenue"
//   //         ? revenueSumCtd
//   //         : Number(row.absoluteTotal) || 0;
//   //     const parentYtd =
//   //       fiscalYear === "All"
//   //         ? parentCtd
//   //         : row.description === "Revenue"
//   //           ? revenueSum
//   //           : Number(row.total) || 0;

//   //     const baseRow = {
//   //       Description: row.description,
//   //       "Account ID": row.accountId || "",
//   //       "Org ID": row.orgId || "",
//   //       "GLC/PLC": row.glcPlc || "",
//   //       "Hrly Rate": row.hrlyRate || "",
//   //       "CTD Total": isPercentageRow(row)
//   //         ? formatPercent(parentCtd)
//   //         : parentCtd,
//   //       "YTD Total": isPercentageRow(row)
//   //         ? formatPercent(parentYtd)
//   //         : parentYtd,
//   //     };

//   //     // Month-wise values calculation matching selected view filter variations (T&M / CPFF)
//   //     dynamicDateRanges.forEach((range) => {
//   //       let dataForRange =
//   //         row.description === "Revenue"
//   //           ? selectedRevenueView === "t&m"
//   //             ? row.tnmRevenueData?.[range]
//   //             : selectedRevenueView === "cpff"
//   //               ? row.cpffRevenueData?.[range]
//   //               : row.data?.[range]
//   //           : row.data?.[range];

//   //       const rawValue = Number(dataForRange) || 0;
//   //       baseRow[range] = isPercentageRow(row)
//   //         ? formatPercent(rawValue)
//   //         : rawValue;
//   //     });

//   //     rows.push(baseRow);

//   //     // 2. INTERNAL STAFF / LABORS BLOCK
//   //     if (
//   //       row.employees &&
//   //       row.id.startsWith("total-staff-cost") &&
//   //       expandedStaffRows.includes(row.id)
//   //     ) {
//   //       row.employees.forEach((employee) => {
//   //         const empCtd = Number(employee.absoluteCost) || 0;
//   //         const empYtd =
//   //           fiscalYear === "All" ? empCtd : Number(employee.cost) || 0;

//   //         const empRow = {
//   //           Description: `    ${employee.name}`,
//   //           "Account ID": employee.accountId || "",
//   //           "Org ID": employee.orgId || "",
//   //           "GLC/PLC": employee.glcPlc || "",
//   //           "Hrly Rate": employee.hrlyRate || "",
//   //           "CTD Total": empCtd,
//   //           "YTD Total": empYtd,
//   //         };

//   //         dynamicDateRanges.forEach((currentRange) => {
//   //           empRow[currentRange] =
//   //             Number(employee.monthlyCost?.[currentRange]) || 0;
//   //         });
//   //         rows.push(empRow);

//   //         // Sub-hours details calculation block
//   //         if (expandedEmployeeDetails.includes(`${row.id}-${employee.id}`)) {
//   //           const empAbsoluteHours = Number(employee.absoluteHours) || 0;
//   //           const empYtdHours =
//   //             fiscalYear === "All"
//   //               ? empAbsoluteHours
//   //               : Object.values(employee.monthlyHours || {}).reduce(
//   //                   (sum, val) => sum + val,
//   //                   0,
//   //                 );

//   //           const hoursRow = {
//   //             Description: `        --- Employee Hours`,
//   //             "Account ID": "",
//   //             "Org ID": "",
//   //             "GLC/PLC": "",
//   //             "Hrly Rate": "",
//   //             "CTD Total": empAbsoluteHours,
//   //             "YTD Total": empYtdHours,
//   //           };

//   //           dynamicDateRanges.forEach((currentRange) => {
//   //             hoursRow[currentRange] =
//   //               Number(employee.monthlyHours?.[currentRange]) || 0;
//   //           });
//   //           rows.push(hoursRow);

//   //           // Labor breakdown details row map loop
//   //           Object.entries(employee.detailSummary || {}).forEach(
//   //             ([detailDescription, monthData]) => {
//   //               const detailYearTotal = Object.values(monthData || {}).reduce(
//   //                 (sum, val) => sum + val,
//   //                 0,
//   //               );
//   //               const detailAbsoluteTotal =
//   //                 employee.absoluteDetailSummary?.[detailDescription] ??
//   //                 detailYearTotal;
//   //               const detailYtd =
//   //                 fiscalYear === "All" ? detailAbsoluteTotal : detailYearTotal;

//   //               const detailRow = {
//   //                 Description: `        --- ${detailDescription}`,
//   //                 "Account ID": employee.accountId || "",
//   //                 "Org ID": "",
//   //                 "GLC/PLC": "",
//   //                 "Hrly Rate": "",
//   //                 "CTD Total": detailAbsoluteTotal,
//   //                 "YTD Total": detailYtd,
//   //               };

//   //               dynamicDateRanges.forEach((currentRange) => {
//   //                 detailRow[currentRange] =
//   //                   Number(monthData?.[currentRange]) || 0;
//   //               });
//   //               rows.push(detailRow);
//   //             },
//   //           );
//   //         }
//   //       });
//   //     }

//   //     // 3. NON-LABOR ACCOUNTS BLOCK
//   //     if (
//   //       row.nonLaborAccts &&
//   //       row.id.startsWith("non-labor-staff-cost") &&
//   //       expandedNonLaborAcctRows.includes(row.id)
//   //     ) {
//   //       row.nonLaborAccts.forEach((acctGroup) => {
//   //         const acctYearTotal = Number(acctGroup.total) || 0;
//   //         const acctAbsoluteTotal =
//   //           Number(acctGroup.absoluteTotal) || acctYearTotal;
//   //         const acctYtd =
//   //           fiscalYear === "All" ? acctAbsoluteTotal : acctYearTotal;

//   //         const acctRow = {
//   //           Description: `    ${acctGroup.description}`,
//   //           "Account ID": acctGroup.id || "",
//   //           "Org ID": acctGroup.orgId || "",
//   //           "GLC/PLC": acctGroup.glcPlc || "",
//   //           "Hrly Rate": "",
//   //           "CTD Total": acctAbsoluteTotal,
//   //           "YTD Total": acctYtd,
//   //         };

//   //         dynamicDateRanges.forEach((currentRange) => {
//   //           acctRow[currentRange] =
//   //             Number(acctGroup.monthlyData?.[currentRange]) || 0;
//   //         });
//   //         rows.push(acctRow);

//   //         if (expandedNonLaborAcctRows.includes(`${row.id}-${acctGroup.id}`)) {
//   //           acctGroup.employees?.map((employeeGroup) => {
//   //             const entryMap = Object.fromEntries(
//   //               employeeGroup.entries.map((e) => [e.monthLabel, e]),
//   //             );
//   //             const empGroupYearTotal = Number(employeeGroup.total) || 0;
//   //             const empGroupAbsoluteTotal =
//   //               Number(employeeGroup.absoluteTotal) || empGroupYearTotal;
//   //             const empGroupYtd =
//   //               fiscalYear === "All"
//   //                 ? empGroupAbsoluteTotal
//   //                 : empGroupYearTotal;

//   //             const empGroupRow = {
//   //               Description: `        ${employeeGroup.name}`,
//   //               "Account ID": "",
//   //               "Org ID": "",
//   //               "GLC/PLC": "",
//   //               "Hrly Rate": "",
//   //               "CTD Total": empGroupAbsoluteTotal,
//   //               "YTD Total": empGroupYtd,
//   //             };

//   //             dynamicDateRanges.forEach((month) => {
//   //               empGroupRow[month] = Number(
//   //                 employeeGroup.monthlyData?.[month] ?? 0,
//   //               );
//   //             });
//   //             rows.push(empGroupRow);

//   //             const absoluteKeyMap = {
//   //               gna: "absoluteGna",
//   //               overhead: "absoluteOverhead",
//   //               hr: "absoluteHr",
//   //               materials: "absoluteMaterials",
//   //               fringe: "absoluteFringe",
//   //             };

//   //             const breakdownCategories = [
//   //               { key: "gna", name: employeeGroup.gnaName },
//   //               { key: "overhead", name: employeeGroup.overheadName },
//   //               { key: "hr", name: employeeGroup.hrName },
//   //               { key: "materials", name: employeeGroup.materialsName },
//   //               { key: "fringe", name: employeeGroup.fringeName },
//   //             ];

//   //             breakdownCategories.forEach((cat) => {
//   //               const subCatYearTotal = Number(employeeGroup[cat.key]) || 0;
//   //               const subCatAbsoluteTotal =
//   //                 Number(employeeGroup[absoluteKeyMap[cat.key]]) ||
//   //                 subCatYearTotal;
//   //               const subCatYtd =
//   //                 fiscalYear === "All" ? subCatAbsoluteTotal : subCatYearTotal;

//   //               const catRow = {
//   //                 Description: `            --- ${cat.name}`,
//   //                 "Account ID": "",
//   //                 "Org ID": "",
//   //                 "GLC/PLC": "",
//   //                 "Hrly Rate": "",
//   //                 "CTD Total": subCatAbsoluteTotal,
//   //                 "YTD Total": subCatYtd,
//   //               };

//   //               dynamicDateRanges.forEach((month) => {
//   //                 const entry = entryMap[month];
//   //                 catRow[month] = Number(entry?.[cat.key] ?? 0);
//   //               });
//   //               rows.push(catRow);
//   //             });
//   //           });
//   //         }
//   //       });
//   //     }
//   //   });

//   //   return rows;
//   // };

//   const buildExcelRows = () => {
//     const rows = [];
//     const isPercentageRow = (row) => row.description?.includes("Profit %");
//     const formatPercent = (value) => Number(value) * 100;

//     financialData.forEach((row) => {
//       // 1. Parent Summary Row Alignment Setup
//       const parentCtd =
//         row.description === "Revenue"
//           ? revenueSumCtd
//           : Number(row.absoluteTotal) || 0; // Cumulative up to selected year

//       const parentYtd =
//         fiscalYear === "All"
//           ? parentCtd
//           : row.description === "Revenue"
//             ? revenueSum
//             : Number(row.total) || 0; // Filtered year total

//       const baseRow = {
//         Description: row.description,
//         "Account ID": row.accountId || "",
//         "Org ID": row.orgId || "",
//         "GLC/PLC": row.glcPlc || "",
//         "Hrly Rate": row.hrlyRate || "",
//         "CTD Total": isPercentageRow(row)
//           ? formatPercent(parentCtd)
//           : parentCtd,
//         "YTD Total": isPercentageRow(row)
//           ? formatPercent(parentYtd)
//           : parentYtd,
//       };

//       dynamicDateRanges.forEach((range) => {
//         let dataForRange =
//           row.description === "Revenue"
//             ? selectedRevenueView === "t&m"
//               ? row.tnmRevenueData?.[range]
//               : row.cpffRevenueData?.[range]
//             : row.data?.[range];

//         const rawValue = Number(dataForRange) || 0;
//         baseRow[range] = isPercentageRow(row)
//           ? formatPercent(rawValue)
//           : rawValue;
//       });

//       rows.push(baseRow);

//       // 2. LABOR / STAFF SECTION (Only if parent row is expanded in UI)
//       if (
//         row.employees &&
//         !row.id.includes("non-labor") &&
//         expandedStaffRows.includes(row.id)
//       ) {
//         row.employees.forEach((employee) => {
//           const empCtd = Number(employee.absoluteCost) || 0; // Cumulative up to selected year
//           const empYtd =
//             fiscalYear === "All" ? empCtd : Number(employee.cost) || 0; // Selected year cost

//           const empRow = {
//             Description: `  ${employee.name}`,
//             "Account ID": employee.accountId || "",
//             "Org ID": employee.orgId || "",
//             "GLC/PLC": employee.glcPlc || "",
//             "Hrly Rate": employee.hrlyRate || "",
//             "CTD Total": empCtd,
//             "YTD Total": empYtd,
//           };

//           dynamicDateRanges.forEach((range) => {
//             empRow[range] = Number(employee.monthlyCost?.[range]) || 0;
//           });
//           rows.push(empRow);

//           // Employee Hours
//           if (expandedEmployeeDetails.includes(`${row.id}-${employee.id}`)) {
//             const hoursCtd = Number(employee.absoluteHours) || 0; // Cumulative hours up to selected year
//             const hoursYtd =
//               fiscalYear === "All"
//                 ? hoursCtd
//                 : Object.values(employee.monthlyHours || {}).reduce(
//                     (sum, val) => sum + val,
//                     0,
//                   );

//             const hoursRow = {
//               Description: "    --- Employee Hours",
//               "Account ID": "",
//               "Org ID": "",
//               "GLC/PLC": "",
//               "Hrly Rate": "",
//               "CTD Total": hoursCtd,
//               "YTD Total": hoursYtd,
//             };
//             dynamicDateRanges.forEach((range) => {
//               hoursRow[range] = Number(employee.monthlyHours?.[range]) || 0;
//             });
//             rows.push(hoursRow);

//             // Employee Labor breakdown details (fringe, overhead, etc.)
//             Object.entries(employee.monthlyRawCost || {}).length > 0 &&
//               Object.entries(employee.detailSummary || {}).forEach(
//                 ([detailDescription, monthData]) => {
//                   const detailCtd =
//                     Number(
//                       employee.absoluteDetailSummary?.[detailDescription],
//                     ) || 0; // Cumulative breakdown detail
//                   const detailYtd =
//                     fiscalYear === "All"
//                       ? detailCtd
//                       : Object.values(monthData || {}).reduce(
//                           (sum, val) => sum + val,
//                           0,
//                         );

//                   const detailRow = {
//                     Description: `    --- ${detailDescription}`,
//                     "Account ID": employee.accountId || "",
//                     "Org ID": "",
//                     "GLC/PLC": "",
//                     "Hrly Rate": "",
//                     "CTD Total": detailCtd,
//                     "YTD Total": detailYtd,
//                   };
//                   dynamicDateRanges.forEach((currentRange) => {
//                     detailRow[currentRange] =
//                       Number(monthData?.[currentRange]) || 0;
//                   });
//                   rows.push(detailRow);
//                 },
//               );
//           }
//         });
//       }

//       // 3. NON-LABOR ACCOUNTS SECTION
//       if (
//         row.nonLaborAccts &&
//         row.id.startsWith("non-labor-staff-cost") &&
//         expandedNonLaborAcctRows.includes(row.id)
//       ) {
//         row.nonLaborAccts.forEach((acctGroup) => {
//           const acctCtd = Number(acctGroup.absoluteTotal) || 0; // Cumulative non-labor up to selected year
//           const acctYtd =
//             fiscalYear === "All" ? acctCtd : Number(acctGroup.total) || 0;

//           const acctRow = {
//             Description: `  ${acctGroup.description}`,
//             "Account ID": acctGroup.id || "",
//             "Org ID": acctGroup.orgId || "",
//             "GLC/PLC": acctGroup.glcPlc || "",
//             "Hrly Rate": "",
//             "CTD Total": acctCtd,
//             "YTD Total": acctYtd,
//           };

//           dynamicDateRanges.forEach((range) => {
//             acctRow[range] = Number(acctGroup.monthlyData?.[range]) || 0;
//           });
//           rows.push(acctRow);

//           // Non-labor child employees
//           acctGroup.employees.forEach((empGroup) => {
//             const empGroupCtd = Number(empGroup.absoluteTotal) || 0; // Cumulative employee non-labor up to selected year
//             const empGroupYtd =
//               fiscalYear === "All" ? empGroupCtd : Number(empGroup.total) || 0;

//             const empNameRow = {
//               Description: `    ${empGroup.name}`,
//               "Account ID": "",
//               "Org ID": "",
//               "GLC/PLC": "",
//               "Hrly Rate": "",
//               "CTD Total": empGroupCtd,
//               "YTD Total": empGroupYtd,
//             };
//             dynamicDateRanges.forEach((range) => {
//               empNameRow[range] = Number(empGroup.monthlyData?.[range]) || 0;
//             });
//             rows.push(empNameRow);
//           });
//         });
//       }
//     });

//     return rows;
//   };
//   const getTargetYtdYear = () => {
//     if (!dynamicDateRanges || dynamicDateRanges.length === 0) return null;
//     const lastRange = dynamicDateRanges[dynamicDateRanges.length - 1];
//     const match = lastRange.match(/\d{4}/);
//     return match ? match[0] : null;
//   };

//   const currentYtdYear = getTargetYtdYear();

//   return (
//     <div className="min-h-full  text-gray-800">
//       <div className="mb-2 flex item-center gap-x-1">
//         <button
//           onClick={expandAll}
//           className="btn1 btn-blue cursor-pointer flex items-center"
//         >
//           Expand All
//         </button>
//         <button
//           onClick={collapseAll}
//           className="btn1 btn-blue cursor-pointer flex items-center"
//         >
//           Collapse All
//         </button>
//         <div className="flex items-center ">
//           <button
//             onClick={exportToExcel}
//             className={`btn1 btn-blue cursor-pointer flex items-center ${isExporting ? "bg-[#11353f]bg-gray-100 text-white" : "bg-[#17414d]  text-white"}`}
//             disabled={isExporting}
//           >
//             {isExporting ? "Exporting" : "Export"}
//           </button>
//         </div>
//       </div>

//       <div className={` ${getGlassmorphismClasses()}`}>
//         <div className="mb-8 flex-wrap justify-center items-center gap-4 hidden"></div>

//         <div className="overflow-x-auto max-h-120 rounded-sm overflow-y-auto">
//           <table className="min-w-full rounded-sm divide-y divide-gray-300 divide-opacity-30">
//             <thead className="sticky top-0 z-30">
//               <tr className="bg-gray-200 bg-opacity-50">
//                 <th className="relative px-3 pl-20 text-left text-xs whitespace-nowrap sticky top-0 left-0 z-40 py-1 font-semibold bg-[#e5f3fb] text-black capitalize border-b border-gray-300 before:absolute before:top-0 before:right-0 before:h-full before:w-[2px] before:bg-gray-300 before:content-['']">
//                   Description
//                 </th>
//                 <th className="px-3 py-1 text-left text-xs font-semibold bg-[#e5f3fb] text-black capitalize border-b border-gray-300 whitespace-nowrap">
//                   Account ID
//                 </th>
//                 <th className="px-3 py-1 text-left text-xs font-semibold bg-[#e5f3fb] text-black capitalize border-b border-gray-300 whitespace-nowrap">
//                   Org ID
//                 </th>
//                 <th className="px-3 py-1 text-left text-xs font-semibold bg-[#e5f3fb] text-black capitalize border-b border-gray-300 whitespace-nowrap">
//                   GLC/PLC
//                 </th>
//                 <th className="px-3 py-1 text-right text-xs font-semibold bg-[#e5f3fb] text-black capitalize border-b border-gray-300 whitespace-nowrap">
//                   Hrly Rate
//                 </th>
//                 <th className="px-3 py-1 text-right text-xs font-semibold bg-[#e5f3fb] text-black capitalize border-b border-gray-300 whitespace-nowrap">
//                   CTD Total
//                 </th>
//                 <th className="px-3 py-1 text-right text-xs font-semibold bg-[#e5f3fb] text-black capitalize border-b border-gray-300 whitespace-nowrap">
//                   YTD Total
//                 </th>
//                 {dynamicDateRanges.map((range) => (
//                   <th
//                     key={range}
//                     className="px-3 py-1 text-right text-xs font-semibold bg-[#e5f3fb] text-black capitalize border-b border-gray-200 whitespace-nowrap"
//                   >
//                     {range}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             {/* <tbody className="divide-y text-[14px] divide-gray-300 bg-white divide-opacity-10">
//               {financialData.length === 0 ? (
//                 <tr>
//                   <td colSpan={dynamicDateRanges.length + 7} className="text-center text-gray-600 text-lg py-4">
//                     No data available for the selected criteria.
//                   </td>
//                 </tr>
//               ) : (
//                 financialData.map((row) => (
//                   <React.Fragment key={row.id}>
//                     <tr
//                       className={`group hover:bg-gray-100 hover:bg-opacity-50 transition-colors duration-200 ${row.type === "summary" ? "bg-gray-100 bg-opacity-20" : ""} ${row.type === "expandable" ? "cursor-pointer bg-blue-100 bg-opacity-30" : ""}`}
//                       onClick={() => {
//                         if (row.type !== "expandable") return;
//                         if (row.id.startsWith("total-staff-cost")) toggleStaffRow(row.id);
//                         if (row.id.startsWith("non-labor-staff-cost")) toggleNonLaborAcctRow(row.id);
//                       }}
//                     >
//                       <td className="py-1 px-2 whitespace-nowrap sticky left-0 z-10 bg-inherit text-black text-xs after:absolute after:right-0 after:top-0 after:h-full after:w-[2px] after:bg-gray-300">
//                         <div className="flex items-center w-full h-full">
//                           {row.type === "expandable" && (
//                             <span className="mr-2">
//                               {(row.id.startsWith("total-staff-cost") && expandedStaffRows.includes(row.id)) ||
//                               (row.id.startsWith("non-labor-staff-cost") && expandedNonLaborAcctRows.includes(row.id)) ? (
//                                 <ChevronUpIcon className="h-4 w-4 text-gray-600 group-hover:text-gray-900" />
//                               ) : (
//                                 <ChevronDownIcon className="h-4 w-4 text-gray-600 group-hover:text-gray-900" />
//                               )}
//                             </span>
//                           )}
//                           <span className="truncate">{row.description}</span>
//                         </div>
//                       </td>
//                       <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">{row.accountId || ""}</td>
//                       <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">{row.orgId || ""}</td>
//                       <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">{row.glcPlc || ""}</td>
//                       <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">{formatValue(row.hrlyRate)}</td>
//                       <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                         {row.description.includes("Profit %") ? formatValue(row.ytdTotal, false, true) : row.description === "Revenue" ? formatValue(revenueSum) : formatValue(row.ytdTotal)}
//                       </td>
//                       <td className={`py-1 px-2 text-right whitespace-nowrap text-black text-xs ${typeof row.total === "number" && row.total < 0 ? "text-red-600" : typeof row.total === "number" && row.total > 0 && row.description === "Profit" ? "text-green-600" : ""}`}>
//                         {row.description.includes("Profit %") ? formatValue(row.total, false, true) : row.description === "Revenue" ? formatValue(revenueSum) : formatValue(row.total)}
//                       </td>
//                       {dynamicDateRanges.map((range) => {
//                         let dataForRange = row.description === "Revenue"
//                           ? (selectedRevenueView === "t&m" ? row.tnmRevenueData?.[range] : selectedRevenueView === "cpff" ? row.cpffRevenueData?.[range] : row.data?.[range])
//                           : row.data?.[range];
//                         const isProfitRow = row.id.startsWith("profit-");
//                         const textColorClass = isProfitRow && dataForRange < 0 ? "text-red-600" : isProfitRow && dataForRange > 0 ? "text-green-600" : "";
//                         return (
//                           <td key={range} className={`py-1 px-2 text-right whitespace-nowrap text-black text-xs ${textColorClass}`}>
//                             {row.description.includes("Profit %") ? formatValue(dataForRange, false, true) : formatValue(dataForRange)}
//                           </td>
//                         );
//                       })}
//                     </tr>

//                     {row.type === "expandable" && row.id.startsWith("total-staff-cost") && expandedStaffRows.includes(row.id) && row.employees?.map((employee) => (
//                       <React.Fragment key={`${row.id}-${employee.id}`}>
//                         <tr className="bg-gray-100 bg-opacity-20 hover:bg-gray-100 hover:bg-opacity-50 text-sm cursor-pointer group" onClick={() => toggleEmployeeDetail(`${row.id}-${employee.id}`)}>
//                           <td className="py-1 pl-8 whitespace-nowrap sticky left-0 z-10 bg-inherit text-black text-xs after:absolute after:right-0 after:top-0 after:h-full after:w-[2px] after:bg-gray-300">
//                             <div className="flex items-center h-full w-full min-w-0">
//                               <span className="mr-2 flex-shrink-0">
//                                 {expandedEmployeeDetails.includes(`${row.id}-${employee.id}`) ? <ChevronUpIcon className="h-3 w-3 text-black" /> : <ChevronDownIcon className="h-3 w-3 text-black" />}
//                               </span>
//                               <span className="truncate">{employee.name}</span>
//                             </div>
//                           </td>
//                           <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">{employee.accountId || ""}</td>
//                           <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">{employee.orgId || ""}</td>
//                           <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">{employee.glcPlc || ""}</td>
//                           <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">{formatValue(employee.hrlyRate)}</td>
//                           <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">{formatValue(employee.ytdCost)}</td>
//                           <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">{formatValue(employee.cost)}</td>
//                           {dynamicDateRanges.map((currentRange) => (
//                             <td key={`${employee.id}-${currentRange}-cost`} className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                               {formatValue(employee.monthlyCost[currentRange] || 0)}
//                             </td>
//                           ))}
//                         </tr>

//                         {expandedEmployeeDetails.includes(`${row.id}-${employee.id}`) && (
//                           <tr className="bg-gray-100 bg-opacity-30 hover:bg-gray-100 hover:bg-opacity-60 text-xs">
//                             <td className="py-1 pl-16 relative whitespace-nowrap sticky left-0 z-20 bg-inherit before:absolute before:top-0 before:right-0 before:h-full before:w-[2px] before:bg-gray-300 before:content-['']">
//                               --- Employee Hours
//                             </td>
//                             <td colSpan={4}></td>
//                             <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                               {formatValue(Object.entries(employee.monthlyHours).filter(([m]) => m.includes(currentYtdYear)).reduce((sum, [_, v]) => sum + v, 0))}
//                             </td>
//                             <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                               {formatValue(Object.values(employee.monthlyHours).reduce((sum, val) => sum + val, 0))}
//                             </td>
//                             {dynamicDateRanges.map((currentRange) => (
//                               <td key={`${employee.id}-hours-${currentRange}-amount`} className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                                 {formatValue(employee.monthlyHours[currentRange] || 0, true)}
//                               </td>
//                             ))}
//                           </tr>
//                         )}

//                         {expandedEmployeeDetails.includes(`${row.id}-${employee.id}`) && Object.entries(employee.detailSummary || {}).map(([detailDescription, monthData]) => (
//                           <tr key={`${employee.id}-${detailDescription}-detail-row`} className="bg-gray-100 bg-opacity-30 hover:bg-gray-100 hover:bg-opacity-60 text-xs">
//                             <td className="py-1 pl-16 pr-4 relative whitespace-nowrap sticky left-0 z-20 bg-inherit before:absolute before:top-0 before:right-0 before:h-full before:w-[2px] before:bg-gray-300 before:content-['']">
//                               --- {detailDescription}
//                             </td>
//                             <td className="py-1 px-2 text-left whitespace-nowrap text-black">{employee.accountId || ""}</td>
//                             <td colSpan={3}></td>
//                             <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                               {formatValue(Object.entries(monthData).filter(([m]) => m.includes(currentYtdYear)).reduce((sum, [_, v]) => sum + v, 0))}
//                             </td>
//                             <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                               {formatValue(Object.values(monthData).reduce((sum, val) => sum + val, 0))}
//                             </td>
//                             {dynamicDateRanges.map((currentRange) => (
//                               <td key={`${employee.id}-${detailDescription}-${currentRange}-amount`} className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                                 {formatValue(monthData[currentRange] || 0)}
//                               </td>
//                             ))}
//                           </tr>
//                         ))}
//                       </React.Fragment>
//                     ))}

//                     {row.type === "expandable" && row.id.startsWith("non-labor-staff-cost") && expandedNonLaborAcctRows.includes(row.id) && row.nonLaborAccts?.map((acctGroup) => (
//                       <React.Fragment key={`${row.id}-${acctGroup.id}`}>
//                         <tr className="bg-gray-100 bg-opacity-20 hover:bg-gray-100 hover:bg-opacity-50 text-sm cursor-pointer group" onClick={() => toggleNonLaborAcctRow(`${row.id}-${acctGroup.id}`)}>
//                           <td className="py-1 pl-8 pr-4 border-r-2 border-gray-300 whitespace-nowrap sticky left-0 z-10 bg-inherit flex items-center text-black text-xs">
//                             <span className="mr-2">
//                               {expandedNonLaborAcctRows.includes(`${row.id}-${acctGroup.id}`) ? <ChevronUpIcon className="h-3 w-3 text-black" /> : <ChevronDownIcon className="h-3 w-3 text-black" />}
//                             </span>
//                             {acctGroup.description}
//                           </td>
//                           <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">{acctGroup.id || ""}</td>
//                           <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">{acctGroup.orgId || ""}</td>
//                           <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">{acctGroup.glcPlc || ""}</td>
//                           <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs"></td>
//                           <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">{formatValue(acctGroup.ytdTotal)}</td>
//                           <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">{formatValue(acctGroup.total)}</td>
//                           {dynamicDateRanges.map((currentRange) => (
//                             <td key={`${acctGroup.id}-${currentRange}-cost`} className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                               {formatValue(acctGroup.monthlyData[currentRange] || 0)}
//                             </td>
//                           ))}
//                         </tr>

//                         {expandedNonLaborAcctRows.includes(`${row.id}-${acctGroup.id}`) && acctGroup.employees?.map((employeeGroup) => {
//                           const entryMap = Object.fromEntries(employeeGroup.entries.map((e) => [e.monthLabel, e]));
//                           const breakdownCategories = [
//                             { key: "gna", name: employeeGroup.gnaName },
//                             { key: "overhead", name: employeeGroup.overheadName },
//                             { key: "hr", name: employeeGroup.hrName },
//                             { key: "materials", name: employeeGroup.materialsName },
//                             { key: "fringe", name: employeeGroup.fringeName },
//                           ];

//                           return (
//                             <React.Fragment key={`${acctGroup.id}-${employeeGroup.id}-employee-block`}>
//                               <tr className="bg-gray-100 bg-opacity-30 hover:bg-gray-100 hover:bg-opacity-60 text-xs">
//                                 <td className="py-1 pl-16 pr-4 relative whitespace-nowrap sticky left-0 z-20 bg-inherit before:absolute before:top-0 before:right-0 before:h-full before:w-[2px] before:bg-gray-300 before:content-['']">
//                                   {employeeGroup.name}
//                                 </td>
//                                 <td colSpan={4}></td>
//                                 <td className="py-1 px-2 text-right font-semibold">{formatValue(employeeGroup.ytdTotal)}</td>
//                                 <td className="py-1 px-2 text-right font-semibold">{formatValue(employeeGroup.total)}</td>
//                                 {dynamicDateRanges.map((month) => (
//                                   <td key={`${employeeGroup.id}-${month}-total`} className="py-1 px-2 text-right">
//                                     {formatValue(employeeGroup.monthlyData?.[month] ?? 0)}
//                                   </td>
//                                 ))}
//                               </tr>

//                               {breakdownCategories.map((cat) => {
//                                 const ytdSubCatSum = employeeGroup.entries
//                                   .filter((e) => e.monthLabel.includes(currentYtdYear))
//                                   .reduce((s, e) => s + (Number(e[cat.key]) || 0), 0);

//                                 return (
//                                   <tr key={`${cat.key}-${employeeGroup.id}`} className="bg-gray-100 bg-opacity-30 text-xs">
//                                     <td className="py-1 relative pl-20 whitespace-nowrap sticky left-0 z-20 bg-inherit before:absolute before:top-0 before:right-0 before:h-full before:w-[2px] before:bg-gray-300 before:content-['']">
//                                       --- {cat.name}
//                                     </td>
//                                     <td colSpan={4}></td>
//                                     <td className="py-1 px-2 text-right text-xs font-semibold">
//                                       {formatValue(ytdSubCatSum)}
//                                     </td>
//                                     <td className="py-1 px-2 text-right text-xs font-semibold">
//                                       {formatValue(employeeGroup[cat.key])}
//                                     </td>
//                                     {dynamicDateRanges.map((month) => {
//                                       const entry = entryMap[month];
//                                       return (
//                                         <td key={`${cat.key}-${month}`} className="py-1 px-2 text-right text-xs">
//                                           {formatValue(entry?.[cat.key] ?? 0)}
//                                         </td>
//                                       );
//                                     })}
//                                   </tr>
//                                 );
//                               })}
//                             </React.Fragment>
//                           );
//                         })}
//                       </React.Fragment>
//                     ))}
//                   </React.Fragment>
//                 ))
//               )}
//             </tbody> */}

//             <tbody className="divide-y text-[14px] divide-gray-300 bg-white divide-opacity-10">
//               {financialData.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={dynamicDateRanges.length + 7}
//                     className="text-center text-gray-600 text-lg py-4"
//                   >
//                     {isLoading
//                       ? "Loading data..."
//                       : "No data available for the selected criteria."}
//                   </td>
//                 </tr>
//               ) : (
//                 financialData.map((row) => {
//                   // 1. Parent summary row: CTD is always the absolute (all-time) total.
//                   // YTD reflects the selected fiscal year, and equals CTD when "All" is selected.
//                   const parentCtd =
//                     row.description === "Revenue"
//                       ? revenueSumCtd
//                       : Number(row.absoluteTotal) || 0;

//                   console.log(parentCtd);

//                   const parentYtd =
//                     // fiscalYear === "All"
//                     //   ? parentCtd
//                     //   :
//                     row.description === "Revenue"
//                       ? revenueSum
//                       : Number(row.total) || 0;

//                   return (
//                     <React.Fragment key={row.id}>
//                       {/* PARENT SUMMARY ROW */}
//                       <tr
//                         className={`group hover:bg-gray-100 hover:bg-opacity-50 transition-colors duration-200 ${
//                           row.type === "summary"
//                             ? "bg-gray-100 bg-opacity-20"
//                             : ""
//                         } ${
//                           row.type === "expandable"
//                             ? "cursor-pointer bg-blue-100 bg-opacity-30"
//                             : ""
//                         }`}
//                         onClick={() => {
//                           if (row.type !== "expandable") return;
//                           if (row.id.startsWith("total-staff-cost"))
//                             toggleStaffRow(row.id);
//                           if (row.id.startsWith("non-labor-staff-cost"))
//                             toggleNonLaborAcctRow(row.id);
//                         }}
//                       >
//                         <td className="py-1 px-2 whitespace-nowrap sticky left-0 z-10 bg-inherit text-black text-xs after:absolute after:right-0 after:top-0 after:h-full after:w-[2px] after:bg-gray-300">
//                           <div className="flex items-center w-full h-full">
//                             {row.type === "expandable" && (
//                               <span className="mr-2">
//                                 {(row.id.startsWith("total-staff-cost") &&
//                                   expandedStaffRows.includes(row.id)) ||
//                                 (row.id.startsWith("non-labor-staff-cost") &&
//                                   expandedNonLaborAcctRows.includes(row.id)) ? (
//                                   <ChevronUpIcon className="h-4 w-4 text-gray-600 group-hover:text-gray-900" />
//                                 ) : (
//                                   <ChevronDownIcon className="h-4 w-4 text-gray-600 group-hover:text-gray-900" />
//                                 )}
//                               </span>
//                             )}
//                             <span className="truncate">{row.description}</span>
//                           </div>
//                         </td>
//                         <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">
//                           {row.accountId || ""}
//                         </td>
//                         <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">
//                           {row.orgId || ""}
//                         </td>
//                         <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">
//                           {row.glcPlc || ""}
//                         </td>
//                         <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                           {formatValue(row.hrlyRate)}
//                         </td>

//                         {/* CTD Total Column Cell (always absolute total) */}
//                         <td
//                           className={`py-1 px-2 text-right whitespace-nowrap text-black text-xs ${typeof parentCtd === "number" && parentCtd < 0 ? "text-red-600" : typeof parentCtd === "number" && parentCtd > 0 && row.description === "Profit" ? "text-green-600" : ""}`}
//                         >
//                           {row.description.includes("Profit %")
//                             ? formatValue(parentCtd, false, true)
//                             : formatValue(parentCtd)}
//                         </td>
//                         {/* YTD Total Column Cell */}
//                         <td
//                           className={`py-1 px-2 text-right whitespace-nowrap text-black text-xs ${typeof parentYtd === "number" && parentYtd < 0 ? "text-red-600" : typeof parentYtd === "number" && parentYtd > 0 && row.description === "Profit" ? "text-green-600" : ""}`}
//                         >
//                           {row.description.includes("Profit %")
//                             ? formatValue(parentYtd, false, true)
//                             : formatValue(parentYtd)}
//                         </td>

//                         {dynamicDateRanges.map((range) => {
//                           let dataForRange =
//                             row.description === "Revenue"
//                               ? selectedRevenueView === "t&m"
//                                 ? row.tnmRevenueData?.[range]
//                                 : selectedRevenueView === "cpff"
//                                   ? row.cpffRevenueData?.[range]
//                                   : row.data?.[range]
//                               : row.data?.[range];
//                           const isProfitRow = row.id.startsWith("profit-");
//                           const textColorClass =
//                             isProfitRow && dataForRange < 0
//                               ? "text-red-600"
//                               : isProfitRow && dataForRange > 0
//                                 ? "text-green-600"
//                                 : "";
//                           return (
//                             <td
//                               key={range}
//                               className={`py-1 px-2 text-right whitespace-nowrap text-black text-xs ${textColorClass}`}
//                             >
//                               {row.description.includes("Profit %")
//                                 ? formatValue(dataForRange, false, true)
//                                 : formatValue(dataForRange)}
//                             </td>
//                           );
//                         })}
//                       </tr>

//                       {/* INTERNAL STAFF / LABORS BLOCK */}
//                       {row.type === "expandable" &&
//                         row.id.startsWith("total-staff-cost") &&
//                         expandedStaffRows.includes(row.id) &&
//                         row.employees?.map((employee) => {
//                           // CTD is always the absolute (all-time) cost.
//                           // YTD reflects the selected fiscal year, equals CTD when "All" is selected.
//                           const empCtd = Number(employee.absoluteCost) || 0;
//                           const empYtd =
//                             fiscalYear === "All"
//                               ? empCtd
//                               : Number(employee.cost) || 0;

//                           return (
//                             <React.Fragment key={`${row.id}-${employee.id}`}>
//                               <tr
//                                 className="bg-gray-100 bg-opacity-20 hover:bg-gray-100 hover:bg-opacity-50 text-sm cursor-pointer group"
//                                 onClick={() =>
//                                   toggleEmployeeDetail(
//                                     `${row.id}-${employee.id}`,
//                                   )
//                                 }
//                               >
//                                 <td className="py-1 pl-8 whitespace-nowrap sticky left-0 z-10 bg-inherit text-black text-xs after:absolute after:right-0 after:top-0 after:h-full after:w-[2px] after:bg-gray-300">
//                                   <div className="flex items-center h-full w-full min-w-0">
//                                     <span className="mr-2 flex-shrink-0">
//                                       {expandedEmployeeDetails.includes(
//                                         `${row.id}-${employee.id}`,
//                                       ) ? (
//                                         <ChevronUpIcon className="h-3 w-3 text-black" />
//                                       ) : (
//                                         <ChevronDownIcon className="h-3 w-3 text-black" />
//                                       )}
//                                     </span>
//                                     <span className="truncate">
//                                       {employee.name}
//                                     </span>
//                                   </div>
//                                 </td>
//                                 <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">
//                                   {employee.accountId || ""}
//                                 </td>
//                                 <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">
//                                   {employee.orgId || ""}
//                                 </td>
//                                 <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">
//                                   {employee.glcPlc || ""}
//                                 </td>
//                                 <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                                   {formatValue(employee.hrlyRate)}
//                                 </td>
//                                 <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                                   {formatValue(empCtd)}
//                                 </td>
//                                 <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                                   {formatValue(empYtd)}
//                                 </td>
//                                 {dynamicDateRanges.map((currentRange) => (
//                                   <td
//                                     key={`${employee.id}-${currentRange}-cost`}
//                                     className="py-1 px-2 text-right whitespace-nowrap text-black text-xs"
//                                   >
//                                     {formatValue(
//                                       employee.monthlyCost[currentRange] || 0,
//                                     )}
//                                   </td>
//                                 ))}
//                               </tr>

//                               {/* Sub-hours detail line */}
//                               {expandedEmployeeDetails.includes(
//                                 `${row.id}-${employee.id}`,
//                               ) && (
//                                 <tr className="bg-gray-100 bg-opacity-30 hover:bg-gray-100 hover:bg-opacity-60 text-xs">
//                                   <td className="py-1 pl-16 relative whitespace-nowrap sticky left-0 z-20 bg-inherit before:absolute before:top-0 before:right-0 before:h-full before:w-[2px] before:bg-gray-300 before:content-['']">
//                                     --- Employee Hours
//                                   </td>
//                                   <td colSpan={4}></td>
//                                   <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                                     {formatValue(employee.absoluteHours)}
//                                   </td>
//                                   <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                                     {formatValue(
//                                       fiscalYear === "All"
//                                         ? employee.absoluteHours
//                                         : Object.values(
//                                             employee.monthlyHours || {},
//                                           ).reduce((sum, val) => sum + val, 0),
//                                     )}
//                                   </td>
//                                   {dynamicDateRanges.map((currentRange) => (
//                                     <td
//                                       key={`${employee.id}-hours-${currentRange}-amount`}
//                                       className="py-1 px-2 text-right whitespace-nowrap text-black text-xs"
//                                     >
//                                       {formatValue(
//                                         employee.monthlyHours[currentRange] ||
//                                           0,
//                                         true,
//                                       )}
//                                     </td>
//                                   ))}
//                                 </tr>
//                               )}

//                               {/* Labor breakdown sub-rows */}
//                               {expandedEmployeeDetails.includes(
//                                 `${row.id}-${employee.id}`,
//                               ) &&
//                                 Object.entries(
//                                   employee.detailSummary || {},
//                                 ).map(([detailDescription, monthData]) => {
//                                   const detailYearTotal = Object.values(
//                                     monthData || {},
//                                   ).reduce((sum, val) => sum + val, 0);
//                                   const detailAbsoluteTotal =
//                                     employee.absoluteDetailSummary?.[
//                                       detailDescription
//                                     ] ?? detailYearTotal;
//                                   const detailYtd =
//                                     fiscalYear === "All"
//                                       ? detailAbsoluteTotal
//                                       : detailYearTotal;

//                                   return (
//                                     <tr
//                                       key={`${employee.id}-${detailDescription}-detail-row`}
//                                       className="bg-gray-100 bg-opacity-30 hover:bg-gray-100 hover:bg-opacity-60 text-xs"
//                                     >
//                                       <td className="py-1 pl-16 pr-4 relative whitespace-nowrap sticky left-0 z-20 bg-inherit before:absolute before:top-0 before:right-0 before:h-full before:w-[2px] before:bg-gray-300 before:content-['']">
//                                         --- {detailDescription}
//                                       </td>
//                                       <td className="py-1 px-2 text-left whitespace-nowrap text-black">
//                                         {employee.accountId || ""}
//                                       </td>
//                                       <td colSpan={3}></td>
//                                       <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                                         {formatValue(detailAbsoluteTotal)}
//                                       </td>
//                                       <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                                         {formatValue(detailYtd)}
//                                       </td>
//                                       {dynamicDateRanges.map((currentRange) => (
//                                         <td
//                                           key={`${employee.id}-${detailDescription}-${currentRange}-amount`}
//                                           className="py-1 px-2 text-right whitespace-nowrap text-black text-xs"
//                                         >
//                                           {formatValue(
//                                             monthData[currentRange] || 0,
//                                           )}
//                                         </td>
//                                       ))}
//                                     </tr>
//                                   );
//                                 })}
//                             </React.Fragment>
//                           );
//                         })}

//                       {/* NON-LABOR ACCOUNTS BLOCK */}
//                       {row.type === "expandable" &&
//                         row.id.startsWith("non-labor-staff-cost") &&
//                         expandedNonLaborAcctRows.includes(row.id) &&
//                         row.nonLaborAccts?.map((acctGroup) => {
//                           // CTD is always the absolute (all-time) total.
//                           const acctYearTotal = Number(acctGroup.total) || 0;
//                           const acctAbsoluteTotal =
//                             Number(acctGroup.absoluteTotal) || acctYearTotal;
//                           const acctYtd =
//                             fiscalYear === "All"
//                               ? acctAbsoluteTotal
//                               : acctYearTotal;

//                           return (
//                             <React.Fragment key={`${row.id}-${acctGroup.id}`}>
//                               <tr
//                                 className="bg-gray-100 bg-opacity-20 hover:bg-gray-100 hover:bg-opacity-50 text-sm cursor-pointer group"
//                                 onClick={() =>
//                                   toggleNonLaborAcctRow(
//                                     `${row.id}-${acctGroup.id}`,
//                                   )
//                                 }
//                               >
//                                 <td className="py-1 pl-8 pr-4 border-r-2 border-gray-300 whitespace-nowrap sticky left-0 z-10 bg-inherit flex items-center text-black text-xs">
//                                   <span className="mr-2">
//                                     {expandedNonLaborAcctRows.includes(
//                                       `${row.id}-${acctGroup.id}`,
//                                     ) ? (
//                                       <ChevronUpIcon className="h-3 w-3 text-black" />
//                                     ) : (
//                                       <ChevronDownIcon className="h-3 w-3 text-black" />
//                                     )}
//                                   </span>
//                                   {acctGroup.description}
//                                 </td>
//                                 <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">
//                                   {acctGroup.id || ""}
//                                 </td>
//                                 <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">
//                                   {acctGroup.orgId || ""}
//                                 </td>
//                                 <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">
//                                   {acctGroup.glcPlc || ""}
//                                 </td>
//                                 <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs"></td>
//                                 <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                                   {formatValue(acctAbsoluteTotal)}
//                                 </td>
//                                 <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
//                                   {formatValue(acctYtd)}
//                                 </td>
//                                 {dynamicDateRanges.map((currentRange) => (
//                                   <td
//                                     key={`${acctGroup.id}-${currentRange}-cost`}
//                                     className="py-1 px-2 text-right whitespace-nowrap text-black text-xs"
//                                   >
//                                     {formatValue(
//                                       acctGroup.monthlyData[currentRange] || 0,
//                                     )}
//                                   </td>
//                                 ))}
//                               </tr>

//                               {expandedNonLaborAcctRows.includes(
//                                 `${row.id}-${acctGroup.id}`,
//                               ) &&
//                                 acctGroup.employees?.map((employeeGroup) => {
//                                   const entryMap = Object.fromEntries(
//                                     employeeGroup.entries.map((e) => [
//                                       e.monthLabel,
//                                       e,
//                                     ]),
//                                   );

//                                   // CTD is always the absolute (all-time) total.
//                                   const empGroupYearTotal =
//                                     Number(employeeGroup.total) || 0;
//                                   const empGroupAbsoluteTotal =
//                                     Number(employeeGroup.absoluteTotal) ||
//                                     empGroupYearTotal;
//                                   const empGroupYtd =
//                                     fiscalYear === "All"
//                                       ? empGroupAbsoluteTotal
//                                       : empGroupYearTotal;

//                                   const absoluteKeyMap = {
//                                     gna: "absoluteGna",
//                                     overhead: "absoluteOverhead",
//                                     hr: "absoluteHr",
//                                     materials: "absoluteMaterials",
//                                     fringe: "absoluteFringe",
//                                   };

//                                   const breakdownCategories = [
//                                     { key: "gna", name: employeeGroup.gnaName },
//                                     {
//                                       key: "overhead",
//                                       name: employeeGroup.overheadName,
//                                     },
//                                     { key: "hr", name: employeeGroup.hrName },
//                                     {
//                                       key: "materials",
//                                       name: employeeGroup.materialsName,
//                                     },
//                                     {
//                                       key: "fringe",
//                                       name: employeeGroup.fringeName,
//                                     },
//                                   ];

//                                   return (
//                                     <React.Fragment
//                                       key={`${acctGroup.id}-${employeeGroup.id}-employee-block`}
//                                     >
//                                       <tr className="bg-gray-100 bg-opacity-30 hover:bg-gray-100 hover:bg-opacity-60 text-xs">
//                                         <td className="py-1 pl-16 pr-4 relative whitespace-nowrap sticky left-0 z-20 bg-inherit before:absolute before:top-0 before:right-0 before:h-full before:w-[2px] before:bg-gray-300 before:content-['']">
//                                           {employeeGroup.name}
//                                         </td>
//                                         <td colSpan={4}></td>
//                                         {/* <td className="py-1 px-2 text-right font-semibold"> */}
//                                         <td className="py-1 px-2 text-right">
//                                           {formatValue(empGroupAbsoluteTotal)}
//                                         </td>
//                                         {/* <td className="py-1 px-2 text-right font-semibold"> */}
//                                         <td className="py-1 px-2 text-right">
//                                           {formatValue(empGroupYtd)}
//                                         </td>
//                                         {dynamicDateRanges.map((month) => (
//                                           <td
//                                             key={`${employeeGroup.id}-${month}-total`}
//                                             className="py-1 px-2 text-right"
//                                           >
//                                             {formatValue(
//                                               employeeGroup.monthlyData?.[
//                                                 month
//                                               ] ?? 0,
//                                             )}
//                                           </td>
//                                         ))}
//                                       </tr>

//                                       {breakdownCategories.map((cat) => {
//                                         const subCatYearTotal =
//                                           Number(employeeGroup[cat.key]) || 0;
//                                         const subCatAbsoluteTotal =
//                                           Number(
//                                             employeeGroup[
//                                               absoluteKeyMap[cat.key]
//                                             ],
//                                           ) || subCatYearTotal;
//                                         const subCatYtd =
//                                           fiscalYear === "All"
//                                             ? subCatAbsoluteTotal
//                                             : subCatYearTotal;

//                                         return (
//                                           <tr
//                                             key={`${cat.key}-${employeeGroup.id}`}
//                                             className="bg-gray-100 bg-opacity-30 text-xs"
//                                           >
//                                             <td className="py-1 relative pl-20 whitespace-nowrap sticky left-0 z-20 bg-inherit before:absolute before:top-0 before:right-0 before:h-full before:w-[2px] before:bg-gray-300 before:content-['']">
//                                               --- {cat.name}
//                                             </td>
//                                             <td colSpan={4}></td>
//                                             {/* <td className="py-1 px-2 text-right text-xs font-semibold"> */}
//                                             <td className="py-1 px-2 text-right text-xs">
//                                               {formatValue(subCatAbsoluteTotal)}
//                                             </td>
//                                             {/* <td className="py-1 px-2 text-right text-xs font-semibold"> */}
//                                             <td className="py-1 px-2 text-right text-xs ">
//                                               {formatValue(subCatYtd)}
//                                             </td>
//                                             {dynamicDateRanges.map((month) => {
//                                               const entry = entryMap[month];
//                                               return (
//                                                 <td
//                                                   key={`${cat.key}-${month}`}
//                                                   className="py-1 px-2 text-right text-xs"
//                                                 >
//                                                   {formatValue(
//                                                     entry?.[cat.key] ?? 0,
//                                                   )}
//                                                 </td>
//                                               );
//                                             })}
//                                           </tr>
//                                         );
//                                       })}
//                                     </React.Fragment>
//                                   );
//                                 })}
//                             </React.Fragment>
//                           );
//                         })}
//                     </React.Fragment>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnalysisByPeriodContent;

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { data, useOutletContext } from "react-router-dom";
import { backendUrl } from "./config";
// import * as XLSX from "xlsx";
import XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

const AnalysisByPeriodContent = ({
  onCancel,
  planID,
  templateId,
  type,
  initialApiData,
  isLoading,
  error,
  fiscalYear,
}) => {
  const [expandedStaffRows, setExpandedStaffRows] = useState([]);
  const [expandedEmployeeDetails, setExpandedEmployeeDetails] = useState([]);
  const [expandedNonLaborAcctRows, setExpandedNonLaborAcctRows] = useState([]); // State for non-labor account expansion
  const [financialData, setFinancialData] = useState([]);
  const [revenueSum, setRevenueSum] = useState(0);
  const [revenueSumCtd, setRevenueSumCtd] = useState(0);

  const [isExporting, setIsExporting] = useState(false);

  const [allApiData, setAllApiData] = useState(null); // This will now hold the fiscalYear-filtered data
  const [dynamicDateRanges, setDynamicDateRanges] = useState([]);

  // Add this near line 25 under your other useState hooks
  const [grandTotalCtdData, setGrandTotalCtdData] = useState(null);

  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [availableOrgIds, setAvailableOrgIds] = useState([]);

  const [selectedRevenueView, setSelectedRevenueView] = useState("t&m");

  const [allTimeDateRanges, setAllTimeDateRanges] = useState([]);

  const { visibility, canView, canEdit } = useOutletContext();

  // Helper: round any numeric value to exactly 2 decimal places.
  // Used everywhere in the Excel export so we never dump long floating
  // point tails (e.g. 258.35999999999996) into the spreadsheet.
  const roundTo2 = (value) => {
    const num = Number(value) || 0;
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };

  useEffect(() => {
    if (!initialApiData || Object.keys(initialApiData).length === 0) {
      setAllTimeDateRanges([]);
      return;
    }
    const rangesSet = new Set();

    (initialApiData.employeeForecastSummary || []).forEach((summary) => {
      summary.emplSchedule?.payrollSalary?.forEach((s) => {
        const r = getMonthRangeKey(s.month, s.year);
        if (r) rangesSet.add(r);
      });
    });
    (initialApiData.directCOstForecastSummary || []).forEach((n) => {
      n.directCostSchedule?.forecasts?.forEach((s) => {
        const r = getMonthRangeKey(s.month, s.year);
        if (r) rangesSet.add(r);
      });
    });
    (initialApiData.indirectCostForecastSummary || []).forEach((n) => {
      n.indirectCostSchedule?.forecasts?.forEach((s) => {
        const r = getMonthRangeKey(s.month, s.year);
        if (r) rangesSet.add(r);
      });
    });

    const sorted = Array.from(rangesSet).sort((a, b) => {
      const [ma, ya] = a.split("/");
      const [mb, yb] = b.split("/");
      if (ya !== yb) return Number(ya) - Number(yb);
      return Number(ma) - Number(mb);
    });
    setAllTimeDateRanges(sorted);
  }, [initialApiData]);

  // Replace your existing getMonthRangeKey function with this one
  function getMonthRangeKey(period, year) {
    // Add this check to prevent crashes if period or year are missing
    if (period === undefined || year === undefined) {
      return null;
    }
    const month = String(period).padStart(2, "0");
    const monthRange = `${month}/${year}`;
    return monthRange;
  }

  function calculateTotalRevenue() {
    let monthlyRevenueSummary = initialApiData.monthlyRevenueSummary;
    if (!Array.isArray(monthlyRevenueSummary)) return 0;

    if (!Array.isArray(monthlyRevenueSummary)) {
      setRevenueSum(0);
      setRevenueSumCtd(0);
      return;
    }

    // 1. REGULAR REVENUE SUM (Current selected Year or All)
    const monthlyTotal = monthlyRevenueSummary
      .filter((item) => {
        if (fiscalYear === "All") return true;
        return item.year === Number(fiscalYear);
      })
      .reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);
    setRevenueSum(monthlyTotal);

    // 2. CUMULATIVE TO DATE (CTD) REVENUE SUM (All historical up to selected Year)
    const monthlyTotalCtd = monthlyRevenueSummary
      .filter((item) => {
        if (fiscalYear === "All") return true;
        // Sum everything from the beginning of the project up to the selected fiscal year
        return item.year <= Number(fiscalYear);
      })
      .reduce((sum, item) => sum + (Number(item.revenue) || 0), 0);

    setRevenueSumCtd(monthlyTotalCtd);
  }

  // console.log("ctd total", revenueSumCtd);

  useEffect(() => {
    if (initialApiData) calculateTotalRevenue();
  }, [fiscalYear, initialApiData]);

  useEffect(() => {
    // console.log(
    //   "useEffect [initialApiData, isLoading, error, fiscalYear]: Effect triggered."
    // );
    if (
      isLoading ||
      error ||
      !initialApiData ||
      Object.keys(initialApiData).length === 0
    ) {
      if (isLoading) {
        // console.log("useEffect: Data is still loading.");
        setAllApiData(null);
        setDynamicDateRanges([]);
        setSelectedOrgId("");
        setAvailableOrgIds([]);
        setFinancialData([]);
        return;
      }

      if (error) {
        // console.log("useEffect: Error received from parent:", error);
        setAllApiData(null);
        setDynamicDateRanges([]);
        setSelectedOrgId("");
        setAvailableOrgIds([]);
        setFinancialData([]);
        return;
      }

      if (!initialApiData || Object.keys(initialApiData).length === 0) {
        // console.log("useEffect: initialApiData is null, undefined, or empty.");
        setAllApiData(null);
        setDynamicDateRanges([]);
        setSelectedOrgId("");
        setAvailableOrgIds([]);
        setFinancialData([]);
        return;
      }

      setGrandTotalCtdData(null); // Clear on error/empty
      return;
    }

    try {
      // console.log(
      //   "useEffect: Processing initialApiData for deep fiscal year filtering..."
      // );

      setGrandTotalCtdData(initialApiData);

      const processedApiData = { ...initialApiData }; // Start with a copy

      processedApiData.employeeForecastSummary = (
        initialApiData.employeeForecastSummary || []
      )
        .map((empSummary) => {
          const filteredPayrollSalary = (
            empSummary.emplSchedule?.payrollSalary || []
          ).filter((salaryEntry) => {
            return (
              !fiscalYear ||
              fiscalYear === "All" ||
              String(salaryEntry.year) === fiscalYear
            );
          });

          if (filteredPayrollSalary.length > 0) {
            return {
              ...empSummary,
              emplSchedule: {
                ...empSummary.emplSchedule,
                payrollSalary: filteredPayrollSalary,
              },
            };
          }
          return null;
        })
        .filter(Boolean);

      // console.log(
      //   "useEffect: employeeForecastSummary after deep fiscalYear filter:",
      //   processedApiData.employeeForecastSummary
      // );

      processedApiData.directCOstForecastSummary = (
        initialApiData.directCOstForecastSummary || []
      )
        .map((nonLaborSummary) => {
          const filteredForecasts = (
            nonLaborSummary.directCostSchedule?.forecasts || []
          ).filter((f) => {
            return (
              !fiscalYear ||
              fiscalYear === "All" ||
              String(f.year) === fiscalYear
            );
          });
          if (filteredForecasts.length > 0) {
            return {
              ...nonLaborSummary,
              directCostSchedule: {
                ...nonLaborSummary.directCostSchedule,
                forecasts: filteredForecasts,
              },
            };
          }
          return null;
        })
        .filter(Boolean);
      // console.log(
      //   "useEffect: directCOstForecastSummary after deep fiscalYear filter:",
      //   processedApiData.directCOstForecastSummary
      // );

      processedApiData.indirectCostForecastSummary = (
        initialApiData.indirectCostForecastSummary || []
      )
        .map((nonLaborSummary) => {
          const filteredForecasts = (
            nonLaborSummary.indirectCostSchedule?.forecasts || []
          ).filter((f) => {
            return (
              !fiscalYear ||
              fiscalYear === "All" ||
              String(f.year) === fiscalYear
            );
          });
          if (filteredForecasts.length > 0) {
            return {
              ...nonLaborSummary,
              indirectCostSchedule: {
                ...nonLaborSummary.indirectCostSchedule,
                forecasts: filteredForecasts,
              },
            };
          }
          return null;
        })
        .filter(Boolean);
      // console.log(
      //   "useEffect: indirectCostSummariesFiltered after deep fiscalYear filter:",
      //   processedApiData.indirectCostForecastSummary
      // );

      setAllApiData(processedApiData);

      const uniqueOrgIds = new Set();
      const uniqueDateRangesSet = new Set();

      (processedApiData.employeeForecastSummary || []).forEach((summary) => {
        uniqueOrgIds.add(summary.orgID);
        summary.emplSchedule?.payrollSalary?.forEach((salaryEntry) => {
          const monthRangeKey = getMonthRangeKey(
            salaryEntry.month,
            salaryEntry.year,
          );
          uniqueDateRangesSet.add(monthRangeKey);
        });
      });

      (processedApiData.directCOstForecastSummary || []).forEach(
        (nonLaborSummary) => {
          uniqueOrgIds.add(nonLaborSummary.orgID);
          nonLaborSummary.directCostSchedule?.forecasts?.forEach(
            (scheduleEntry) => {
              const monthRangeKey = getMonthRangeKey(
                scheduleEntry.month,
                scheduleEntry.year,
              );
              uniqueDateRangesSet.add(monthRangeKey);
            },
          );
        },
      );

      (processedApiData.indirectCostForecastSummary || []).forEach(
        (nonLaborSummary) => {
          uniqueOrgIds.add(nonLaborSummary.orgID);
          nonLaborSummary.indirectCostSchedule?.forecasts?.forEach(
            (scheduleEntry) => {
              const monthRangeKey = getMonthRangeKey(
                scheduleEntry.month,
                scheduleEntry.year,
              );
              uniqueDateRangesSet.add(monthRangeKey);
            },
          );
        },
      );

      const sortedDateRanges = Array.from(uniqueDateRangesSet).sort((a, b) => {
        const [monthAStr, yearAStr] = a.split("/");
        const yearA = parseInt(yearAStr, 10);
        const monthA = parseInt(monthAStr, 10);

        const [monthBStr, yearBStr] = b.split("/");
        const yearB = parseInt(yearBStr, 10);
        const monthB = parseInt(monthBStr, 10);

        if (yearA !== yearB) return yearA - yearB;
        return monthA - monthB;
      });

      setDynamicDateRanges(sortedDateRanges);
      // console.log("useEffect: dynamicDateRanges set to", sortedDateRanges);

      const orgs = Array.from(uniqueOrgIds).sort();
      setAvailableOrgIds(orgs);
      // console.log("useEffect: availableOrgIds set to", orgs);

      if (orgs.length > 0) {
        setSelectedOrgId(orgs[0]);
        // console.log("useEffect: selectedOrgId set to", orgs[0]);
      } else {
        setSelectedOrgId("");
        // console.log("useEffect: selectedOrgId set to empty (no orgs found)");
      }
    } catch (e) {
      // console.error("Error during initial API data processing:", e);
      setAllApiData(null);
      setDynamicDateRanges([]);
      setSelectedOrgId("");
      setAvailableOrgIds([]);
      setFinancialData([]);
    }
  }, [initialApiData, isLoading, error, fiscalYear]);

  const transformApiDataToFinancialRows = useCallback(
    (
      apiResponse,
      currentOrgId,
      dynamicDateRanges,
      selectedRevenueView,
      planType,
    ) => {
      const financialRows = [];

      // Helper to determine the YTD target year (defaults to the year of the last dynamic range)
      const getTargetYtdYear = () => {
        if (!dynamicDateRanges || dynamicDateRanges.length === 0) return null;
        const lastRange = dynamicDateRanges[dynamicDateRanges.length - 1]; // e.g., "12/2026" or "2026-12"
        const match = lastRange.match(/\d{4}/);
        return match ? match[0] : null;
      };

      const ytdYear = getTargetYtdYear();

      // Helper to check if a range key belongs to the YTD year
      const isYtdRange = (rangeKey) => {
        if (!rangeKey || !ytdYear) return false;
        return rangeKey.includes(ytdYear);
      };

      // Initialize totals
      const monthlyRevenueData = dynamicDateRanges.reduce(
        (acc, range) => ({ ...acc, [range]: 0 }),
        {},
      );
      const totalExpenseData = dynamicDateRanges.reduce(
        (acc, range) => ({ ...acc, [range]: 0 }),
        {},
      );
      const profitData = dynamicDateRanges.reduce(
        (acc, range) => ({ ...acc, [range]: 0 }),
        {},
      );
      const profitOnCostData = dynamicDateRanges.reduce(
        (acc, range) => ({ ...acc, [range]: 0 }),
        {},
      );
      const profitOnRevenueData = dynamicDateRanges.reduce(
        (acc, range) => ({ ...acc, [range]: 0 }),
        {},
      );
      const totalStaffCostByMonth = dynamicDateRanges.reduce(
        (acc, range) => ({ ...acc, [range]: 0 }),
        {},
      );
      const totalNonLaborCostByMonth = dynamicDateRanges.reduce(
        (acc, range) => ({ ...acc, [range]: 0 }),
        {},
      );

      // Monthly Revenue + Staff/Non-Labor cost
      const monthlyRevenueSummary = apiResponse.monthlyRevenueSummary || [];
      monthlyRevenueSummary.forEach((monthData) => {
        const monthRange = getMonthRangeKey(monthData.month, monthData.year);
        if (monthRange && dynamicDateRanges.includes(monthRange)) {
          monthlyRevenueData[monthRange] = monthData.revenue || 0;

          const staffCost = monthData.cost || 0;
          const nonLaborCost = monthData.otherDifrectCost || 0;

          totalStaffCostByMonth[monthRange] = staffCost;
          totalNonLaborCostByMonth[monthRange] = nonLaborCost;

          totalExpenseData[monthRange] = staffCost + nonLaborCost;
        }
      });

      const monthlyRevenueTotalCTD = Object.values(monthlyRevenueData).reduce(
        (s, v) => s + v,
        0,
      );
      const monthlyRevenueTotalYTD = Object.entries(monthlyRevenueData)
        .filter(([range]) => isYtdRange(range))
        .reduce((s, [_, v]) => s + v, 0);

      const totalRevenueOverallCTD =
        (apiResponse.revenue || 0) + monthlyRevenueTotalCTD;
      const totalRevenueOverallYTD = monthlyRevenueTotalYTD;

      // --- STAFF COSTS OVERALLS ---
      const totalStaffCostOverallCTD = Object.values(
        totalStaffCostByMonth,
      ).reduce((s, v) => s + v, 0);
      const totalStaffCostOverallYTD = Object.entries(totalStaffCostByMonth)
        .filter(([range]) => isYtdRange(range))
        .reduce((s, [_, v]) => s + v, 0);

      // --- NON-LABOR OVERALLS ---
      const totalNonLaborCostOverallCTD = Object.values(
        totalNonLaborCostByMonth,
      ).reduce((s, v) => s + v, 0);
      const totalNonLaborCostOverallYTD = Object.entries(
        totalNonLaborCostByMonth,
      )
        .filter(([range]) => isYtdRange(range))
        .reduce((s, [_, v]) => s + v, 0);

      // --- EXPENSE OVERALLS ---
      const totalExpenseOverallCTD = Object.values(totalExpenseData).reduce(
        (s, v) => s + v,
        0,
      );
      const totalExpenseOverallYTD = Object.entries(totalExpenseData)
        .filter(([range]) => isYtdRange(range))
        .reduce((s, [_, v]) => s + v, 0);

      // --- PROFIT OVERALLS ---
      const totalProfitOverallCTD =
        totalRevenueOverallCTD - totalExpenseOverallCTD;
      const totalProfitOverallYTD =
        totalRevenueOverallYTD - totalExpenseOverallYTD;

      const uniqueEmployeesMap = new Map();

      const filteredEmployeeSummaries = (
        apiResponse.employeeForecastSummary || []
      ).filter((empSummary) => {
        const isOrgMatch = currentOrgId
          ? empSummary.orgID === currentOrgId
          : true;
        return isOrgMatch;
      });

      if (filteredEmployeeSummaries.length > 0) {
        filteredEmployeeSummaries.forEach((empSummary) => {
          const compositeKey = `${empSummary.emplId}-${empSummary.plcCode}-${empSummary.orgId}-${empSummary.accID}`;

          if (!uniqueEmployeesMap.has(compositeKey)) {
            uniqueEmployeesMap.set(compositeKey, {
              id: compositeKey,
              name: `${empSummary.name} (${empSummary.emplId}) (${empSummary.plcCode})`,
              cost: 0,
              accountId: empSummary.accID || "",
              orgId: empSummary.orgId || "",
              glcPlc: empSummary.plcCode || "",
              hrlyRate: empSummary.perHourRate || 0,
              monthlyHours: {},
              monthlyCost: {},
              monthlyRawCost: {},
              monthlyFringe: {},
              monthlyOverhead: {},
              monthlyGna: {},
              detailSummary: {},
              overheadName: empSummary.overheadName || "Overhead",
              gnaName: empSummary.gnaName || "General & Admin",
              materialsName: empSummary.materialsName || "Material",
              hrName: empSummary.hrName || "Human Resource",
              fringeName: empSummary.fringeName || "Fringe Benefits",
            });
          }

          const employee = uniqueEmployeesMap.get(compositeKey);
          const payrollSalaries = empSummary.emplSchedule?.payrollSalary || [];

          payrollSalaries.forEach((salaryEntry) => {
            const monthRange = getMonthRangeKey(
              salaryEntry.month,
              salaryEntry.year,
            );

            if (monthRange && dynamicDateRanges.includes(monthRange)) {
              employee.monthlyRawCost[monthRange] =
                (employee.monthlyRawCost[monthRange] || 0) +
                (salaryEntry.cost || 0);
              employee.monthlyFringe[monthRange] =
                (employee.monthlyFringe[monthRange] || 0) +
                (salaryEntry.fringe || 0);
              employee.monthlyOverhead[monthRange] =
                (employee.monthlyOverhead[monthRange] || 0) +
                (salaryEntry.overhead || 0);
              employee.monthlyGna[monthRange] =
                (employee.monthlyGna[monthRange] || 0) + (salaryEntry.gna || 0);
              employee.monthlyCost[monthRange] =
                (employee.monthlyCost[monthRange] || 0) +
                (salaryEntry.totalBurdenCost || 0);
              employee.monthlyHours[monthRange] =
                (employee.monthlyHours[monthRange] || 0) +
                (salaryEntry.hours || 0);

              if (!employee.detailSummary["Raw Cost"])
                employee.detailSummary["Raw Cost"] = {};
              employee.detailSummary["Raw Cost"][monthRange] =
                (employee.detailSummary["Raw Cost"][monthRange] || 0) +
                (salaryEntry.cost || 0);

              if (!employee.detailSummary[employee.fringeName])
                employee.detailSummary[employee.fringeName] = {};
              employee.detailSummary[employee.fringeName][monthRange] =
                (employee.detailSummary[employee.fringeName][monthRange] || 0) +
                (salaryEntry.fringe || 0);

              if (!employee.detailSummary[employee.overheadName])
                employee.detailSummary[employee.overheadName] = {};
              employee.detailSummary[employee.overheadName][monthRange] =
                (employee.detailSummary[employee.overheadName][monthRange] ||
                  0) + (salaryEntry.overhead || 0);

              if (!employee.detailSummary[employee.gnaName])
                employee.detailSummary[employee.gnaName] = {};
              employee.detailSummary[employee.gnaName][monthRange] =
                (employee.detailSummary[employee.gnaName][monthRange] || 0) +
                (salaryEntry.gna || 0);

              if (!employee.detailSummary[employee.hrName])
                employee.detailSummary[employee.hrName] = {};
              employee.detailSummary[employee.hrName][monthRange] =
                (employee.detailSummary[employee.hrName][monthRange] || 0) +
                (salaryEntry.hr || 0);

              if (!employee.detailSummary[employee.materialsName])
                employee.detailSummary[employee.materialsName] = {};
              employee.detailSummary[employee.materialsName][monthRange] =
                (employee.detailSummary[employee.materialsName][monthRange] ||
                  0) + (salaryEntry.materials || 0);
            }
          });
        });
      }

      // ---------- NON-LABOR ----------
      const nonLaborAcctDetailsMap = new Map();
      const allNonLaborSummariesFiltered = [
        ...(apiResponse.directCOstForecastSummary || []),
        ...(apiResponse.indirectCostForecastSummary || []),
      ].filter((n) => (currentOrgId ? n.orgID === currentOrgId : true));

      allNonLaborSummariesFiltered.forEach((nonLaborSummary) => {
        const schedules =
          nonLaborSummary.directCostSchedule?.forecasts ||
          nonLaborSummary.indirectCostSchedule?.forecasts ||
          [];
        const accountId = nonLaborSummary.accID;
        const orgId = nonLaborSummary.orgID;
        const glcPlc = nonLaborSummary.plcCode || "";
        const accName = nonLaborSummary.accName || `Account: ${accountId}`;

        const overheadName = nonLaborSummary.overheadName || "Overhead";
        const gnaName = nonLaborSummary.gnaName || "General & Admin";
        const materialsName = nonLaborSummary.materialsName || "Material";
        const hrName = nonLaborSummary.hrName || "Human Resource";
        const fringeName = nonLaborSummary.fringeName || "Fringe";

        if (!nonLaborAcctDetailsMap.has(accountId)) {
          nonLaborAcctDetailsMap.set(accountId, {
            id: accountId,
            description: accName,
            orgId: orgId,
            glcPlc: glcPlc,
            overheadName,
            gnaName,
            materialsName,
            hrName,
            fringeName,
            total: 0,
            monthlyData: dynamicDateRanges.reduce(
              (acc, range) => ({ ...acc, [range]: 0 }),
              {},
            ),
            employees: new Map(),
          });
        }
        const acctGroup = nonLaborAcctDetailsMap.get(accountId);
        const employeeId = nonLaborSummary.emplId || "N/A_Employee";
        const employeeName = nonLaborSummary.name || ` ${accountId}`;

        if (!acctGroup.employees.has(employeeId)) {
          acctGroup.employees.set(employeeId, {
            id: employeeId,
            name: `${employeeName} (${employeeId})`,
            total: 0,
            cost: 0, // ✅ Initialized Raw Cost accumulator for non-labor employee group
            gna: 0,
            materials: 0,
            hr: 0,
            fringe: 0,
            overhead: 0,
            overheadName,
            gnaName,
            materialsName,
            hrName,
            fringeName,
            monthlyData: dynamicDateRanges.reduce(
              (acc, range) => ({ ...acc, [range]: 0 }),
              {},
            ),
            entries: [],
          });
        }
        const employeeGroup = acctGroup.employees.get(employeeId);

        schedules.forEach((scheduleEntry) => {
          const monthRange = getMonthRangeKey(
            scheduleEntry.month,
            scheduleEntry.year,
          );
          if (monthRange && dynamicDateRanges.includes(monthRange)) {
            let entryCost = 0;
            let burden = scheduleEntry.burden || 0;

            // Extract raw cost safely from schedule entry
            const rawEntryCost = scheduleEntry.cost || 0;

            if (planType === "EAC") {
              entryCost = scheduleEntry.actualamt || 0;
            } else if (planType === "BUD") {
              entryCost = scheduleEntry.forecastedamt || 0;
            } else {
              entryCost =
                rawEntryCost +
                (scheduleEntry.fringe || 0) +
                (scheduleEntry.overhead || 0) +
                (scheduleEntry.gna || 0) +
                (scheduleEntry.materials || 0);
            }

            const entryOverheadName =
              scheduleEntry.overheadName || employeeGroup.overheadName;
            const entryGnaName = scheduleEntry.gnaName || employeeGroup.gnaName;
            const entryMaterialsName =
              scheduleEntry.materialsName || employeeGroup.materialsName;
            const entryHrName = scheduleEntry.hrName || employeeGroup.hrName;
            const entryFringeName =
              scheduleEntry.fringeName || employeeGroup.fringeName;

            employeeGroup.entries.push({
              id: `${scheduleEntry.dctId || scheduleEntry.forecastid}-${monthRange}`,
              dctId: scheduleEntry.dctId,
              forecastid: scheduleEntry.forecastid,
              monthLabel: `${String(scheduleEntry.month).padStart(2, "0")}/${scheduleEntry.year}`,
              total: entryCost,
              monthlyValues: { [monthRange]: entryCost },
              cost: rawEntryCost, // ✅ Mapped raw cost entry
              gna: scheduleEntry.gna || 0,
              overhead: scheduleEntry.overhead || 0,
              hr: scheduleEntry.hr || 0,
              materials: scheduleEntry.materials || 0,
              fringe: scheduleEntry.fringe || 0,
              overheadName: entryOverheadName,
              gnaName: entryGnaName,
              materialsName: entryMaterialsName,
              hrName: entryHrName,
              fringeName: entryFringeName,
            });

            employeeGroup.overheadName = entryOverheadName;
            employeeGroup.gnaName = entryGnaName;
            employeeGroup.materialsName = entryMaterialsName;
            employeeGroup.hrName = entryHrName;
            employeeGroup.fringeName = entryFringeName;

            // Aggregate non-labor category breakdowns per employee group
            employeeGroup.cost += rawEntryCost;
            employeeGroup.gna += scheduleEntry.gna || 0;
            employeeGroup.overhead += scheduleEntry.overhead || 0;
            employeeGroup.hr += scheduleEntry.hr || 0;
            employeeGroup.materials += scheduleEntry.materials || 0;
            employeeGroup.fringe += scheduleEntry.fringe || 0;

            employeeGroup.monthlyData[monthRange] += entryCost + burden;
            employeeGroup.total += entryCost + burden;
            acctGroup.monthlyData[monthRange] =
              acctGroup.monthlyData[monthRange] + burden + entryCost;
            acctGroup.total += entryCost;
          }
        });
      });

      // ---------- FINALIZE ----------
      Array.from(uniqueEmployeesMap.values()).forEach((employee) => {
        employee.rawCost = Object.values(employee.monthlyRawCost).reduce(
          (s, v) => s + v,
          0,
        );
        employee.fringe = Object.values(employee.monthlyFringe).reduce(
          (s, v) => s + v,
          0,
        );
        employee.overhead = Object.values(employee.monthlyOverhead).reduce(
          (s, v) => s + v,
          0,
        );
        employee.gna = Object.values(employee.monthlyGna).reduce(
          (s, v) => s + v,
          0,
        );
        employee.cost = Object.values(employee.monthlyCost).reduce(
          (s, v) => s + v,
          0,
        );
      });

      Array.from(nonLaborAcctDetailsMap.values()).forEach((acctGroup) => {
        acctGroup.total = Object.values(acctGroup.monthlyData).reduce(
          (s, v) => s + v,
          0,
        );
        acctGroup.employees = Array.from(acctGroup.employees.values());
      });

      // ---------- PROFIT ----------
      const selectedRevenueData = monthlyRevenueData;
      dynamicDateRanges.forEach((range) => {
        const revenue = selectedRevenueData[range] || 0;
        const expenses = totalExpenseData[range] || 0;
        profitData[range] = revenue === 0 ? 0 : revenue - expenses;
      });

      // console.log(totalProfitOverallCTD);
      // console.log(totalExpenseOverallCTD);

      const overallProfitOnCostCTD =
        totalExpenseOverallCTD !== 0
          ? totalProfitOverallCTD / totalExpenseOverallCTD
          : 0;
      const overallProfitOnCostYTD =
        totalExpenseOverallYTD !== 0
          ? totalProfitOverallYTD / totalExpenseOverallYTD
          : 0;

      const overallProfitOnRevenueCTD =
        totalRevenueOverallCTD !== 0
          ? totalProfitOverallCTD / totalRevenueOverallCTD
          : 0;
      const overallProfitOnRevenueYTD =
        totalRevenueOverallYTD !== 0
          ? totalProfitOverallYTD / totalRevenueOverallYTD
          : 0;

      // console.log(overallProfitOnRevenueCTD, overallProfitOnCostCTD);
      // console.log(overallProfitOnRevenueYTD, overallProfitOnCostYTD);

      // ---------- BUILD ROWS ----------
      financialRows.push(
        {
          id: `revenue-${currentOrgId}`,
          description: "Revenue",
          total: totalRevenueOverallCTD,
          ytdTotal: totalRevenueOverallYTD,
          data: selectedRevenueData,
          tnmRevenueData: monthlyRevenueData,
          cpffRevenueData: monthlyRevenueData,
          type: "summary",
          orgId: currentOrgId,
        },
        {
          id: `total-staff-cost-${currentOrgId}`,
          description: "Total Burdened Labor Cost",
          total: totalStaffCostOverallCTD,
          ytdTotal: totalStaffCostOverallYTD,
          data: totalStaffCostByMonth,
          type: "expandable",
          employees: Array.from(uniqueEmployeesMap.values()),
          orgId: currentOrgId,
        },
        {
          id: `non-labor-staff-cost-${currentOrgId}`,
          description: "Total Burdened Non-Labor Cost",
          total: totalNonLaborCostOverallCTD,
          ytdTotal: totalNonLaborCostOverallYTD,
          data: totalNonLaborCostByMonth,
          type: "expandable",
          nonLaborAccts: Array.from(nonLaborAcctDetailsMap.values()),
          orgId: currentOrgId,
        },
        {
          id: `total-expense-${currentOrgId}`,
          description: "Total Expense",
          total: totalExpenseOverallCTD,
          ytdTotal: totalExpenseOverallYTD,
          data: totalExpenseData,
          type: "summary",
          orgId: currentOrgId,
        },
        {
          id: `profit-${currentOrgId}`,
          description: "Profit",
          total: totalProfitOverallCTD,
          ytdTotal: totalProfitOverallYTD,
          data: profitData,
          type: "summary",
          orgId: currentOrgId,
        },
      );

      dynamicDateRanges.forEach((range) => {
        const profit = profitData[range] || 0;
        const expense = totalExpenseData[range] || 0;
        profitOnCostData[range] = expense !== 0 ? profit / expense : 0;
      });

      financialRows.push({
        id: `profit-cost-${currentOrgId}`,
        description: "Profit % on Cost",
        total: overallProfitOnCostCTD,
        ytdTotal: overallProfitOnCostYTD,
        data: profitOnCostData,
        type: "summary",
        orgId: currentOrgId,
      });

      dynamicDateRanges.forEach((range) => {
        const profit = profitData[range] || 0;
        let revenueForPercentage = selectedRevenueData[range] || 0;
        profitOnRevenueData[range] =
          revenueForPercentage !== 0 ? profit / revenueForPercentage : 0;
      });

      financialRows.push({
        id: `profit-revenue-${currentOrgId}`,
        description: "Profit % on Revenue",
        total: overallProfitOnRevenueCTD,
        ytdTotal: overallProfitOnRevenueYTD,
        data: profitOnRevenueData,
        type: "summary",
        orgId: currentOrgId,
      });

      return financialRows;
    },
    [selectedRevenueView],
  );

  useEffect(() => {
    // console.log(
    //   "useEffect [allApiData, selectedOrgId, dynamicDateRanges, ...]: Transform trigger effect."
    // );
    if (allApiData && selectedOrgId && dynamicDateRanges.length > 0) {
      // console.log(
      //   "useEffect (transform trigger): allApiData, selectedOrgId, dynamicDateRanges are ready. Transforming data..."
      // );
      const transformedData = transformApiDataToFinancialRows(
        allApiData,
        selectedOrgId,
        dynamicDateRanges,
        selectedRevenueView,
        type,
        initialApiData.revenue,
      );
      // console.log(
      //   "Transformed Data (after filter & transform):",
      //   transformedData
      // );
      setFinancialData(transformedData);
    } else {
      // console.log(
      //   "useEffect (transform trigger): Waiting for allApiData, selectedOrgId, or dynamicDateRanges to be ready."
      // );
      setFinancialData([]);
    }
    setExpandedStaffRows([]);
    setExpandedEmployeeDetails([]);
    setExpandedNonLaborAcctRows([]);
  }, [
    allApiData,
    selectedOrgId,
    dynamicDateRanges,
    selectedRevenueView,
    transformApiDataToFinancialRows,
    type,
  ]);

  // console.log(financialData);

  useEffect(() => {
    if (allApiData && selectedOrgId && dynamicDateRanges.length > 0) {
      const transformedData = transformApiDataToFinancialRows(
        allApiData,
        selectedOrgId,
        dynamicDateRanges,
        selectedRevenueView,
        type,
      );

      let absoluteCtdRows = transformedData;
      if (grandTotalCtdData && allTimeDateRanges.length > 0) {
        // 1. Determine which months belong in our custom CTD calculation
        let allowedCtdMonths = [...allTimeDateRanges];

        // If a specific year is selected (not "All"), restrict CTD up to that year's end
        if (fiscalYear && fiscalYear !== "All") {
          const selectedYearNum = Number(fiscalYear);
          allowedCtdMonths = allTimeDateRanges.filter((range) => {
            const [_, yearStr] = range.split("/");
            return Number(yearStr) <= selectedYearNum; // Sum everything from start up to selected year
          });
        }

        // 2. Generate the full baseline rows across all time
        const fullCtdRows = transformApiDataToFinancialRows(
          grandTotalCtdData,
          selectedOrgId,
          allTimeDateRanges,
          selectedRevenueView,
          type,
        );

        // 3. Instead of absolute total of ALL years, calculate dynamic totals using allowedCtdMonths
        absoluteCtdRows = fullCtdRows.map((row) => {
          // Recalculate CTD row total based only on allowed months
          const calculatedCtdTotal = allowedCtdMonths.reduce(
            (sum, month) => sum + (row.data?.[month] || 0),
            0,
          );

          return {
            ...row,
            total: calculatedCtdTotal, // This overrides total for summary rows (Revenue, Expense, Profit, etc.)
            employees: row.employees?.map((emp) => {
              const calculatedEmpCtdCost = allowedCtdMonths.reduce(
                (sum, month) => sum + (emp.monthlyCost?.[month] || 0),
                0,
              );
              const calculatedEmpCtdHours = allowedCtdMonths.reduce(
                (sum, month) => sum + (emp.monthlyHours?.[month] || 0),
                0,
              );

              const dynamicCtdDetailSummary = {};
              Object.keys(emp.detailSummary || {}).forEach((label) => {
                dynamicCtdDetailSummary[label] = allowedCtdMonths.reduce(
                  (sum, month) =>
                    sum + (emp.detailSummary?.[label]?.[month] || 0),
                  0,
                );
              });

              return {
                ...emp,
                cost: calculatedEmpCtdCost,
                hours: calculatedEmpCtdHours,
                detailSummary: dynamicCtdDetailSummary,
              };
            }),
            nonLaborAccts: row.nonLaborAccts?.map((acct) => {
              const calculatedAcctCtdTotal = allowedCtdMonths.reduce(
                (sum, month) => sum + (acct.monthlyData?.[month] || 0),
                0,
              );

              return {
                ...acct,
                total: calculatedAcctCtdTotal,
                employees: acct.employees?.map((empG) => {
                  const calculatedEmpGCtdTotal = allowedCtdMonths.reduce(
                    (sum, month) => sum + (empG.monthlyData?.[month] || 0),
                    0,
                  );
                  return {
                    ...empG,
                    total: calculatedEmpGCtdTotal,
                  };
                }),
              };
            }),
          };
        });
      }

      const absoluteRowById = new Map(absoluteCtdRows.map((r) => [r.id, r]));

      const mergedData = transformedData.map((row) => {
        const absRow = absoluteRowById.get(row.id);
        const absEmployeeById = new Map(
          (absRow?.employees || []).map((e) => [e.id, e]),
        );
        const absAcctById = new Map(
          (absRow?.nonLaborAccts || []).map((a) => [a.id, a]),
        );

        return {
          ...row,
          // Make sure the UI binds to absoluteTotal for rendering CTD values
          absoluteTotal: absRow?.total ?? row.total,
          employees: row.employees?.map((emp) => {
            const absEmp = absEmployeeById.get(emp.id);

            return {
              ...emp,
              absoluteCost: absEmp?.cost ?? emp.cost,
              absoluteHours:
                absEmp?.hours ??
                Object.values(emp.monthlyHours || {}).reduce(
                  (s, v) => s + v,
                  0,
                ),
              absoluteDetailSummary: absEmp?.detailSummary ?? {},
            };
          }),
          nonLaborAccts: row.nonLaborAccts?.map((acct) => {
            const absAcct = absAcctById.get(acct.id);
            const absEmployeeGroupById = new Map(
              (absAcct?.employees || []).map((e) => [e.id, e]),
            );

            return {
              ...acct,
              absoluteTotal: absAcct?.total ?? acct.total,
              employees: acct.employees?.map((empG) => {
                const matchedEmp = absEmployeeGroupById.get(empG.id);
                return {
                  ...empG,
                  absoluteTotal: matchedEmp?.total ?? empG.total,
                };
              }),
            };
          }),
        };
      });

      setFinancialData(mergedData);
    } else {
      setFinancialData([]);
    }
    setExpandedStaffRows([]);
    setExpandedEmployeeDetails([]);
    setExpandedNonLaborAcctRows([]);
  }, [
    allApiData,
    grandTotalCtdData,
    allTimeDateRanges,
    selectedOrgId,
    dynamicDateRanges,
    selectedRevenueView,
    transformApiDataToFinancialRows,
    type,
    fiscalYear, // Added fiscalYear as a dependency to recalculate when the selection changes!
  ]);

  const toggleStaffRow = (id) => {
    setExpandedStaffRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const toggleEmployeeDetail = (id) => {
    setExpandedEmployeeDetails((prev) =>
      prev.includes(id)
        ? prev.filter((detailId) => detailId !== id)
        : [...prev, id],
    );
  };

  const toggleNonLaborAcctRow = (id) => {
    setExpandedNonLaborAcctRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const formatValue = (value, isHours = false, isPercentage = false) => {
    if (typeof value === "number") {
      if (value === 0) value = 0;
      let formatted;
      if (isPercentage) {
        formatted = (value * 100).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return `${formatted}%`;
      }
      formatted = value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return isHours ? `${formatted} hrs` : formatted;
    }
    return isHours ? "0.00 hrs" : isPercentage ? "0.00%" : "0.00";
  };

  const getGlassmorphismClasses = () => `
    bg-white bg-opacity-5 backdrop-filter backdrop-blur-lg rounded-sm
    border border-opacity-10 border-white 
  `;

  if (isLoading) {
    return (
      // <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-indigo-50 text-gray-800 text-2xl">
      //   Loading data...
      // </div>
      <div className="p-4 font-inter flex justify-center items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-xs text-gray-600">Loading data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-indigo-50 text-red-600 text-2xl">
        Error: {error}
      </div>
    );
  }

  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const expandAll = () => {
    // ✅ Expand all staff rows (parents)
    const staffRowsToExpand = financialData
      .filter(
        (row) =>
          row.type === "expandable" && row.id.startsWith("total-staff-cost"),
      )
      .map((row) => row.id);
    setExpandedStaffRows(staffRowsToExpand);

    // ✅ Expand all employee details (children under staff)
    const employeeDetailsToExpand = [];
    financialData.forEach((row) => {
      if (
        row.type === "expandable" &&
        row.id.startsWith("total-staff-cost") &&
        row.employees
      ) {
        row.employees.forEach((employee) =>
          employeeDetailsToExpand.push(`${row.id}-${employee.id}`),
        );
      }
    });
    setExpandedEmployeeDetails(employeeDetailsToExpand);

    // ✅ Expand all non-labor parent rows (FIXED typo + separate state)
    const nonLaborParentRowsToExpand = financialData
      .filter(
        (row) =>
          row.type === "expandable" &&
          row.id.startsWith("non-labor-staff-cost"), // 🔥 FIXED typo
      )
      .map((row) => row.id);

    setExpandedNonLaborAcctRows(nonLaborParentRowsToExpand); // 🔥 now expands parents

    // ✅ Expand all non-labor child account rows
    const nonLaborAcctRowsToExpand = [];
    financialData.forEach((row) => {
      if (
        row.type === "expandable" &&
        row.id.startsWith("non-labor-staff-cost") &&
        row.nonLaborAccts
      ) {
        row.nonLaborAccts.forEach((acct) =>
          nonLaborAcctRowsToExpand.push(`${row.id}-${acct.id}`),
        );
      }
    });
    setExpandedNonLaborAcctRows((prev) => [
      ...new Set([
        ...prev,
        ...nonLaborParentRowsToExpand,
        ...nonLaborAcctRowsToExpand,
      ]),
    ]); //  merge parent + children
  };

  const collapseAll = () => {
    setExpandedStaffRows([]);
    setExpandedEmployeeDetails([]);
    setExpandedNonLaborAcctRows([]); // clears both parent + child IDs
  };

  const exportToExcel = () => {
    try {
      setIsExporting(true);

      const excelRows = buildExcelRows();

      const worksheet = XLSX.utils.json_to_sheet(excelRows);
      const workbook = XLSX.utils.book_new();

      // Set up base grid properties matching your design template
      worksheet["!views"] = [{ showGridLines: true }];

      // Check if worksheet has cells
      if (worksheet["!ref"]) {
        const range = XLSX.utils.decode_range(worksheet["!ref"]);

        for (let R = range.s.r; R <= range.e.r; ++R) {
          // Identify row type by checking the Description column (Always Column 0)
          const descCellRef = XLSX.utils.encode_cell({ c: 0, r: R });
          const rowDescription = worksheet[descCellRef]?.v || "";
          const isHoursRow = rowDescription.includes("Hours");
          const isPercentRow = rowDescription.includes("Profit %");

          // Visual context detection for financial summary indicators
          const isSummaryBlock =
            rowDescription.includes("Total") ||
            rowDescription.includes("Summary") ||
            rowDescription.includes("Net P&L") ||
            rowDescription === "Revenue" ||
            rowDescription === "Profit";

          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
            const cell = worksheet[cellAddress];

            if (!cell) continue;

            // 1. Style the Header Row (Row 0) -> Bold text and Slate-800 Background color
            if (R === 0) {
              cell.s = {
                font: {
                  name: "Arial",
                  size: 11,
                  bold: true,
                  color: { rgb: "FFFFFF" }, // White text color
                },
                fill: {
                  patternType: "solid",
                  fgColor: { rgb: "1E293B" }, // Slate-800 Theme matching Web UI
                },
                alignment: {
                  vertical: "center",
                  // Right align numeric value headers starting from column index 5 (CTD Total) onwards
                  horizontal: C >= 5 ? "right" : "left",
                  wrapText: true,
                },
              };
            }
            // 2. Format and Style Data Rows
            else {
              const isBoldRow =
                isSummaryBlock || rowDescription.trim().startsWith("---");

              let cellStyle = {
                font: {
                  name: "Arial",
                  size: 10,
                  bold: isBoldRow,
                },
                alignment: {
                  vertical: "center",
                  horizontal: typeof cell.v === "number" ? "right" : "left",
                },
              };

              // Clean currency accounting formats and right align allocations
              if (typeof cell.v === "number") {
                // Make sure whatever numeric value lands in the cell is
                // hard-rounded to 2 decimal places (defense in depth on
                // top of the rounding already done in buildExcelRows).
                cell.v = roundTo2(cell.v);

                if (isHoursRow) {
                  cell.z = "#,##0.00"; // Tracked unit format, 2 decimals
                } else if (isPercentRow) {
                  cell.z = '0.00"%"'; // Format percentage layout
                } else {
                  // Clean accounting format - always exactly 2 decimals,
                  // negatives shown in parentheses/red, zero shown as "-"
                  cell.z = '"$"#,##0.00;[Red]("$"#,##0.00);"-"';
                }
              }

              // Contextual row highlights and block definitions
              if (isSummaryBlock) {
                cellStyle.fill = {
                  patternType: "solid",
                  fgColor: { rgb: "F0FDF4" }, // Light green highlight summary tint
                };
                cellStyle.border = {
                  top: { style: "thin", color: { rgb: "94A3B8" } },
                  bottom: { style: "double", color: { rgb: "334155" } }, // Double line accounting underline
                };
              } else if (isBoldRow) {
                cellStyle.fill = {
                  patternType: "solid",
                  fgColor: { rgb: "F8FAFC" }, // Default layout separator fill
                };
              }

              cell.s = cellStyle;
            }
          }
        }

        // Apply structural column configurations to completely prevent clipping
        const maxCols = range.e.c - range.s.c + 1;
        worksheet["!cols"] = Array(maxCols).fill({ wch: 14 }); // Sized dynamic monthly blocks
        worksheet["!cols"][0] = { wch: 45 }; // Wide Description column to capture nesting text tree indentation
        worksheet["!cols"][1] = { wch: 16 }; // Account ID
        worksheet["!cols"][2] = { wch: 12 }; // Org ID
        worksheet["!cols"][3] = { wch: 14 }; // GLC/PLC
        worksheet["!cols"][4] = { wch: 12 }; // Hrly Rate
        worksheet["!cols"][5] = { wch: 16 }; // CTD Total
        worksheet["!cols"][6] = { wch: 16 }; // YTD Total
      }

      XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Plan");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const file = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(
        file,
        `Financial_Plan_${selectedOrgId}_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
    } catch (err) {
      console.error("Excel export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  const buildExcelRows = () => {
    const rows = [];
    const isPercentageRow = (row) => row.description?.includes("Profit %");
    const formatPercent = (value) => roundTo2(Number(value) * 100);

    financialData.forEach((row) => {
      // 1. Parent Summary Row Alignment Setup
      if (row.description === "Revenue" && !canView("cost")) {
        return;
      }

      const parentCtd =
        row.description === "Revenue"
          ? revenueSumCtd
          : isPercentageRow(row)
            ? Number(row.total) || 0
            : Number(row.absoluteTotal) || 0;

      const parentYtd =
        fiscalYear === "All"
          ? parentCtd
          : row.description === "Revenue"
            ? revenueSum
            : Number(row.total) || 0; // Filtered year total

      const baseRow = {
        Description: row.description,
        "Account ID": row.accountId || "",
        "Org ID": row.orgId || "",
        "GLC/PLC": row.glcPlc || "",
        "Hrly Rate": row.hrlyRate || "",
        "CTD Total": isPercentageRow(row)
          ? formatPercent(parentCtd)
          : roundTo2(parentCtd),
        "YTD Total": isPercentageRow(row)
          ? formatPercent(parentYtd)
          : roundTo2(parentYtd),
      };

      dynamicDateRanges.forEach((range) => {
        let dataForRange =
          row.description === "Revenue"
            ? selectedRevenueView === "t&m"
              ? row.tnmRevenueData?.[range]
              : row.cpffRevenueData?.[range]
            : row.data?.[range];

        const rawValue = Number(dataForRange) || 0;
        baseRow[range] = isPercentageRow(row)
          ? formatPercent(rawValue)
          : roundTo2(rawValue);
      });

      rows.push(baseRow);

      // 2. LABOR / STAFF SECTION (Only if parent row is expanded in UI)
      if (
        row.employees &&
        !row.id.includes("non-labor") &&
        expandedStaffRows.includes(row.id)
      ) {
        row.employees.forEach((employee) => {
          const empCtd = Number(employee.absoluteCost) || 0; // Cumulative up to selected year
          const empYtd =
            fiscalYear === "All" ? empCtd : Number(employee.cost) || 0; // Selected year cost

          const empRow = {
            Description: `  ${employee.name}`,
            "Account ID": employee.accountId || "",
            "Org ID": employee.orgId || "",
            "GLC/PLC": employee.glcPlc || "",
            "Hrly Rate": employee.hrlyRate || "",
            "CTD Total": roundTo2(empCtd),
            "YTD Total": roundTo2(empYtd),
          };

          dynamicDateRanges.forEach((range) => {
            empRow[range] = roundTo2(employee.monthlyCost?.[range]);
          });
          rows.push(empRow);

          // Employee Hours
          if (expandedEmployeeDetails.includes(`${row.id}-${employee.id}`)) {
            const hoursCtd = Number(employee.absoluteHours) || 0; // Cumulative hours up to selected year
            const hoursYtd =
              fiscalYear === "All"
                ? hoursCtd
                : Object.values(employee.monthlyHours || {}).reduce(
                    (sum, val) => sum + val,
                    0,
                  );

            const hoursRow = {
              Description: "    --- Employee Hours",
              "Account ID": "",
              "Org ID": "",
              "GLC/PLC": "",
              "Hrly Rate": "",
              "CTD Total": roundTo2(hoursCtd),
              "YTD Total": roundTo2(hoursYtd),
            };
            dynamicDateRanges.forEach((range) => {
              hoursRow[range] = roundTo2(employee.monthlyHours?.[range]);
            });
            rows.push(hoursRow);

            // Employee Labor breakdown details (Raw Cost, fringe, overhead, etc.)
            Object.entries(employee.monthlyRawCost || {}).length > 0 &&
              Object.entries(employee.detailSummary || {}).forEach(
                ([detailDescription, monthData]) => {
                  const detailCtd =
                    Number(
                      employee.absoluteDetailSummary?.[detailDescription],
                    ) || 0; // Cumulative breakdown detail
                  const detailYtd =
                    fiscalYear === "All"
                      ? detailCtd
                      : Object.values(monthData || {}).reduce(
                          (sum, val) => sum + val,
                          0,
                        );

                  const detailRow = {
                    Description: `    --- ${detailDescription}`,
                    "Account ID": employee.accountId || "",
                    "Org ID": "",
                    "GLC/PLC": "",
                    "Hrly Rate": "",
                    "CTD Total": roundTo2(detailCtd),
                    "YTD Total": roundTo2(detailYtd),
                  };
                  dynamicDateRanges.forEach((currentRange) => {
                    detailRow[currentRange] = roundTo2(
                      monthData?.[currentRange],
                    );
                  });
                  rows.push(detailRow);
                },
              );
          }
        });
      }

      // 3. NON-LABOR ACCOUNTS SECTION
      if (
        row.nonLaborAccts &&
        row.id.startsWith("non-labor-staff-cost") &&
        expandedNonLaborAcctRows.includes(row.id)
      ) {
        row.nonLaborAccts.forEach((acctGroup) => {
          const acctCtd = Number(acctGroup.absoluteTotal) || 0; // Cumulative non-labor up to selected year
          const acctYtd =
            fiscalYear === "All" ? acctCtd : Number(acctGroup.total) || 0;

          const acctRow = {
            Description: `  ${acctGroup.description}`,
            "Account ID": acctGroup.id || "",
            "Org ID": acctGroup.orgId || "",
            "GLC/PLC": acctGroup.glcPlc || "",
            "Hrly Rate": "",
            "CTD Total": roundTo2(acctCtd),
            "YTD Total": roundTo2(acctYtd),
          };

          dynamicDateRanges.forEach((range) => {
            acctRow[range] = roundTo2(acctGroup.monthlyData?.[range]);
          });
          rows.push(acctRow);

          // Non-labor child employees
          acctGroup.employees.forEach((empGroup) => {
            const empGroupCtd = Number(empGroup.absoluteTotal) || 0; // Cumulative employee non-labor up to selected year
            const empGroupYtd =
              fiscalYear === "All" ? empGroupCtd : Number(empGroup.total) || 0;

            const empNameRow = {
              Description: `    ${empGroup.name}`,
              "Account ID": "",
              "Org ID": "",
              "GLC/PLC": "",
              "Hrly Rate": "",
              "CTD Total": roundTo2(empGroupCtd),
              "YTD Total": roundTo2(empGroupYtd),
            };
            dynamicDateRanges.forEach((range) => {
              empNameRow[range] = roundTo2(empGroup.monthlyData?.[range]);
            });
            rows.push(empNameRow);

            // NEW: Non-labor breakdown detail rows (Raw Cost + existing
            // categories), exported only when this employee/vendor group
            // is expanded in the UI — mirrors the labor detailSummary export.
            if (
              expandedNonLaborAcctRows.includes(`${row.id}-${acctGroup.id}`)
            ) {
              const entryMap = Object.fromEntries(
                (empGroup.entries || []).map((e) => [e.monthLabel, e]),
              );

              const absoluteKeyMap = {
                cost: "absoluteCost",
                gna: "absoluteGna",
                overhead: "absoluteOverhead",
                hr: "absoluteHr",
                materials: "absoluteMaterials",
                fringe: "absoluteFringe",
              };

              const breakdownCategories = [
                { key: "cost", name: "Raw Cost" },
                { key: "gna", name: empGroup.gnaName },
                { key: "overhead", name: empGroup.overheadName },
                { key: "hr", name: empGroup.hrName },
                { key: "materials", name: empGroup.materialsName },
                { key: "fringe", name: empGroup.fringeName },
              ];

              breakdownCategories.forEach((cat) => {
                const subCatYearTotal = Number(empGroup[cat.key]) || 0;
                const subCatAbsoluteTotal =
                  Number(empGroup[absoluteKeyMap[cat.key]]) || subCatYearTotal;
                const subCatYtd =
                  fiscalYear === "All" ? subCatAbsoluteTotal : subCatYearTotal;

                const detailRow = {
                  Description: `      --- ${cat.name}`,
                  "Account ID": "",
                  "Org ID": "",
                  "GLC/PLC": "",
                  "Hrly Rate": "",
                  "CTD Total": roundTo2(subCatAbsoluteTotal),
                  "YTD Total": roundTo2(subCatYtd),
                };
                dynamicDateRanges.forEach((currentRange) => {
                  detailRow[currentRange] = roundTo2(
                    entryMap[currentRange]?.[cat.key],
                  );
                });
                rows.push(detailRow);
              });
            }
          });
        });
      }
    });

    return rows;
  };
  const getTargetYtdYear = () => {
    if (!dynamicDateRanges || dynamicDateRanges.length === 0) return null;
    const lastRange = dynamicDateRanges[dynamicDateRanges.length - 1];
    const match = lastRange.match(/\d{4}/);
    return match ? match[0] : null;
  };

  const currentYtdYear = getTargetYtdYear();

  return (
    <div className="min-h-full  text-gray-800">
      <div className="mb-2 flex item-center gap-x-1">
        <button
          onClick={expandAll}
          className="btn1 btn-blue cursor-pointer flex items-center"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="btn1 btn-blue cursor-pointer flex items-center"
        >
          Collapse All
        </button>
        <div className="flex items-center ">
          <button
            onClick={exportToExcel}
            className={`btn1 btn-blue cursor-pointer flex items-center ${isExporting ? "bg-[#11353f]bg-gray-100 text-white" : "bg-[#17414d]  text-white"}`}
            disabled={isExporting}
          >
            {isExporting ? "Exporting" : "Export"}
          </button>
        </div>
      </div>

      <div className={` ${getGlassmorphismClasses()}`}>
        <div className="mb-8 flex-wrap justify-center items-center gap-4 hidden"></div>

        <div className="overflow-x-auto max-h-120 rounded-sm overflow-y-auto">
          <table className="min-w-full rounded-sm divide-y divide-gray-300 divide-opacity-30">
            <thead className="sticky top-0 z-30">
              <tr className="bg-gray-200 bg-opacity-50">
                <th className="relative px-3 pl-20 text-left text-xs whitespace-nowrap sticky top-0 left-0 z-40 py-1 font-semibold bg-[#e5f3fb] text-black capitalize border-b border-gray-300 before:absolute before:top-0 before:right-0 before:h-full before:w-[2px] before:bg-gray-300 before:content-['']">
                  Description
                </th>
                <th className="px-3 py-1 text-left text-xs font-semibold bg-[#e5f3fb] text-black capitalize border-b border-gray-300 whitespace-nowrap">
                  Account ID
                </th>
                <th className="px-3 py-1 text-left text-xs font-semibold bg-[#e5f3fb] text-black capitalize border-b border-gray-300 whitespace-nowrap">
                  Org ID
                </th>
                <th className="px-3 py-1 text-left text-xs font-semibold bg-[#e5f3fb] text-black capitalize border-b border-gray-300 whitespace-nowrap">
                  GLC/PLC
                </th>
                <th className="px-3 py-1 text-right text-xs font-semibold bg-[#e5f3fb] text-black capitalize border-b border-gray-300 whitespace-nowrap">
                  Hrly Rate
                </th>
                <th className="px-3 py-1 text-right text-xs font-semibold bg-[#e5f3fb] text-black capitalize border-b border-gray-300 whitespace-nowrap">
                  CTD Total
                </th>
                <th className="px-3 py-1 text-right text-xs font-semibold bg-[#e5f3fb] text-black capitalize border-b border-gray-300 whitespace-nowrap">
                  YTD Total
                </th>
                {dynamicDateRanges.map((range) => (
                  <th
                    key={range}
                    className="px-3 py-1 text-right text-xs font-semibold bg-[#e5f3fb] text-black capitalize border-b border-gray-200 whitespace-nowrap"
                  >
                    {range}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y text-[14px] divide-gray-300 bg-white divide-opacity-10">
              {financialData.length === 0 ? (
                <tr>
                  <td
                    colSpan={dynamicDateRanges.length + 7}
                    className="text-center text-gray-600 text-lg py-4"
                  >
                    {isLoading
                      ? "Loading data..."
                      : "No data available for the selected criteria."}
                  </td>
                </tr>
              ) : (
                // financialData.map((row) => {
                financialData
                  .filter((row) => {
                    // Show Revenue only when the user has cost view permission
                    if (row.description === "Revenue") {
                      return canView("cost");
                    }

                    // Show all other rows
                    return true;
                  })
                  .map((row) => {
                    // 1. Parent summary row: CTD is always the absolute (all-time) total.
                    // YTD reflects the selected fiscal year, and equals CTD when "All" is selected.
                    // const parentCtd =
                    //   row.description === "Revenue"
                    //     ? revenueSumCtd
                    //     : Number(row.absoluteTotal) || 0;

                    const parentCtd =
                      row.description === "Revenue"
                        ? revenueSumCtd
                        : row.description.includes("Profit %")
                          ? Number(row.total) || 0
                          : Number(row.absoluteTotal) || 0;

                    // console.log(parentCtd);

                    const parentYtd =
                      // fiscalYear === "All"
                      //   ? parentCtd
                      //   :
                      row.description === "Revenue"
                        ? revenueSum
                        : Number(row.total) || 0;

                    return (
                      <React.Fragment key={row.id}>
                        {/* PARENT SUMMARY ROW */}
                        <tr
                          className={`group hover:bg-gray-100 hover:bg-opacity-50 transition-colors duration-200 ${
                            row.type === "summary"
                              ? "bg-gray-100 bg-opacity-20"
                              : ""
                          } ${
                            row.type === "expandable"
                              ? "cursor-pointer bg-blue-100 bg-opacity-30"
                              : ""
                          }`}
                          onClick={() => {
                            if (row.type !== "expandable") return;
                            if (row.id.startsWith("total-staff-cost"))
                              toggleStaffRow(row.id);
                            if (row.id.startsWith("non-labor-staff-cost"))
                              toggleNonLaborAcctRow(row.id);
                          }}
                        >
                          <td className="py-1 px-2 whitespace-nowrap sticky left-0 z-10 bg-inherit text-black text-xs after:absolute after:right-0 after:top-0 after:h-full after:w-[2px] after:bg-gray-300">
                            <div className="flex items-center w-full h-full">
                              {row.type === "expandable" && (
                                <span className="mr-2">
                                  {(row.id.startsWith("total-staff-cost") &&
                                    expandedStaffRows.includes(row.id)) ||
                                  (row.id.startsWith("non-labor-staff-cost") &&
                                    expandedNonLaborAcctRows.includes(
                                      row.id,
                                    )) ? (
                                    <ChevronUpIcon className="h-4 w-4 text-gray-600 group-hover:text-gray-900" />
                                  ) : (
                                    <ChevronDownIcon className="h-4 w-4 text-gray-600 group-hover:text-gray-900" />
                                  )}
                                </span>
                              )}
                              <span className="truncate">
                                {row.description}
                              </span>
                            </div>
                          </td>
                          <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">
                            {row.accountId || ""}
                          </td>
                          <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">
                            {row.orgId || ""}
                          </td>
                          <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">
                            {row.glcPlc || ""}
                          </td>
                          <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
                            {formatValue(row.hrlyRate)}
                          </td>

                          {/* CTD Total Column Cell (always absolute total) */}
                          <td
                            className={`py-1 px-2 text-right whitespace-nowrap text-black text-xs ${typeof parentCtd === "number" && parentCtd < 0 ? "text-red-600" : typeof parentCtd === "number" && parentCtd > 0 && row.description === "Profit" ? "text-green-600" : ""}`}
                          >
                            {row.description.includes("Profit %")
                              ? formatValue(parentCtd, false, true)
                              : formatValue(parentCtd)}
                          </td>
                          {/* YTD Total Column Cell */}
                          <td
                            className={`py-1 px-2 text-right whitespace-nowrap text-black text-xs ${typeof parentYtd === "number" && parentYtd < 0 ? "text-red-600" : typeof parentYtd === "number" && parentYtd > 0 && row.description === "Profit" ? "text-green-600" : ""}`}
                          >
                            {row.description.includes("Profit %")
                              ? formatValue(parentYtd, false, true)
                              : formatValue(parentYtd)}
                          </td>

                          {dynamicDateRanges.map((range) => {
                            let dataForRange =
                              row.description === "Revenue"
                                ? selectedRevenueView === "t&m"
                                  ? row.tnmRevenueData?.[range]
                                  : selectedRevenueView === "cpff"
                                    ? row.cpffRevenueData?.[range]
                                    : row.data?.[range]
                                : row.data?.[range];
                            const isProfitRow = row.id.startsWith("profit-");
                            const textColorClass =
                              isProfitRow && dataForRange < 0
                                ? "text-red-600"
                                : isProfitRow && dataForRange > 0
                                  ? "text-green-600"
                                  : "";
                            return (
                              <td
                                key={range}
                                className={`py-1 px-2 text-right whitespace-nowrap text-black text-xs ${textColorClass}`}
                              >
                                {row.description.includes("Profit %")
                                  ? formatValue(dataForRange, false, true)
                                  : formatValue(dataForRange)}
                              </td>
                            );
                          })}
                        </tr>

                        {/* INTERNAL STAFF / LABORS BLOCK */}
                        {row.type === "expandable" &&
                          row.id.startsWith("total-staff-cost") &&
                          expandedStaffRows.includes(row.id) &&
                          row.employees?.map((employee) => {
                            // CTD is always the absolute (all-time) cost.
                            // YTD reflects the selected fiscal year, equals CTD when "All" is selected.
                            const empCtd = Number(employee.absoluteCost) || 0;
                            const empYtd =
                              fiscalYear === "All"
                                ? empCtd
                                : Number(employee.cost) || 0;

                            return (
                              <React.Fragment key={`${row.id}-${employee.id}`}>
                                <tr
                                  className="bg-gray-100 bg-opacity-20 hover:bg-gray-100 hover:bg-opacity-50 text-sm cursor-pointer group"
                                  onClick={() =>
                                    toggleEmployeeDetail(
                                      `${row.id}-${employee.id}`,
                                    )
                                  }
                                >
                                  <td className="py-1 pl-8 whitespace-nowrap sticky left-0 z-10 bg-inherit text-black text-xs after:absolute after:right-0 after:top-0 after:h-full after:w-[2px] after:bg-gray-300">
                                    <div className="flex items-center h-full w-full min-w-0">
                                      <span className="mr-2 flex-shrink-0">
                                        {expandedEmployeeDetails.includes(
                                          `${row.id}-${employee.id}`,
                                        ) ? (
                                          <ChevronUpIcon className="h-3 w-3 text-black" />
                                        ) : (
                                          <ChevronDownIcon className="h-3 w-3 text-black" />
                                        )}
                                      </span>
                                      <span className="truncate">
                                        {employee.name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">
                                    {employee.accountId || ""}
                                  </td>
                                  <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">
                                    {employee.orgId || ""}
                                  </td>
                                  <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">
                                    {employee.glcPlc || ""}
                                  </td>
                                  <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
                                    {formatValue(employee.hrlyRate)}
                                  </td>
                                  <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
                                    {formatValue(empCtd)}
                                  </td>
                                  <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
                                    {formatValue(empYtd)}
                                  </td>
                                  {dynamicDateRanges.map((currentRange) => (
                                    <td
                                      key={`${employee.id}-${currentRange}-cost`}
                                      className="py-1 px-2 text-right whitespace-nowrap text-black text-xs"
                                    >
                                      {formatValue(
                                        employee.monthlyCost[currentRange] || 0,
                                      )}
                                    </td>
                                  ))}
                                </tr>

                                {/* Sub-hours detail line */}
                                {expandedEmployeeDetails.includes(
                                  `${row.id}-${employee.id}`,
                                ) && (
                                  <tr className="bg-gray-100 bg-opacity-30 hover:bg-gray-100 hover:bg-opacity-60 text-xs">
                                    <td className="py-1 pl-16 relative whitespace-nowrap sticky left-0 z-20 bg-inherit before:absolute before:top-0 before:right-0 before:h-full before:w-[2px] before:bg-gray-300 before:content-['']">
                                      --- Employee Hours
                                    </td>
                                    <td colSpan={4}></td>
                                    <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
                                      {formatValue(employee.absoluteHours)}
                                    </td>
                                    <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
                                      {formatValue(
                                        fiscalYear === "All"
                                          ? employee.absoluteHours
                                          : Object.values(
                                              employee.monthlyHours || {},
                                            ).reduce(
                                              (sum, val) => sum + val,
                                              0,
                                            ),
                                      )}
                                    </td>
                                    {dynamicDateRanges.map((currentRange) => (
                                      <td
                                        key={`${employee.id}-hours-${currentRange}-amount`}
                                        className="py-1 px-2 text-right whitespace-nowrap text-black text-xs"
                                      >
                                        {formatValue(
                                          employee.monthlyHours[currentRange] ||
                                            0,
                                          true,
                                        )}
                                      </td>
                                    ))}
                                  </tr>
                                )}

                                {/* Labor breakdown sub-rows */}
                                {expandedEmployeeDetails.includes(
                                  `${row.id}-${employee.id}`,
                                ) &&
                                  Object.entries(
                                    employee.detailSummary || {},
                                  ).map(([detailDescription, monthData]) => {
                                    const detailYearTotal = Object.values(
                                      monthData || {},
                                    ).reduce((sum, val) => sum + val, 0);
                                    const detailAbsoluteTotal =
                                      employee.absoluteDetailSummary?.[
                                        detailDescription
                                      ] ?? detailYearTotal;
                                    const detailYtd =
                                      fiscalYear === "All"
                                        ? detailAbsoluteTotal
                                        : detailYearTotal;

                                    return (
                                      <tr
                                        key={`${employee.id}-${detailDescription}-detail-row`}
                                        className="bg-gray-100 bg-opacity-30 hover:bg-gray-100 hover:bg-opacity-60 text-xs"
                                      >
                                        <td className="py-1 pl-16 pr-4 relative whitespace-nowrap sticky left-0 z-20 bg-inherit before:absolute before:top-0 before:right-0 before:h-full before:w-[2px] before:bg-gray-300 before:content-['']">
                                          --- {detailDescription}
                                        </td>
                                        <td className="py-1 px-2 text-left whitespace-nowrap text-black">
                                          {employee.accountId || ""}
                                        </td>
                                        <td colSpan={3}></td>
                                        <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
                                          {formatValue(detailAbsoluteTotal)}
                                        </td>
                                        <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
                                          {formatValue(detailYtd)}
                                        </td>
                                        {dynamicDateRanges.map(
                                          (currentRange) => (
                                            <td
                                              key={`${employee.id}-${detailDescription}-${currentRange}-amount`}
                                              className="py-1 px-2 text-right whitespace-nowrap text-black text-xs"
                                            >
                                              {formatValue(
                                                monthData[currentRange] || 0,
                                              )}
                                            </td>
                                          ),
                                        )}
                                      </tr>
                                    );
                                  })}
                              </React.Fragment>
                            );
                          })}

                        {/* NON-LABOR ACCOUNTS BLOCK */}
                        {row.type === "expandable" &&
                          row.id.startsWith("non-labor-staff-cost") &&
                          expandedNonLaborAcctRows.includes(row.id) &&
                          row.nonLaborAccts?.map((acctGroup) => {
                            // CTD is always the absolute (all-time) total.
                            const acctYearTotal = Number(acctGroup.total) || 0;
                            const acctAbsoluteTotal =
                              Number(acctGroup.absoluteTotal) || acctYearTotal;
                            const acctYtd =
                              fiscalYear === "All"
                                ? acctAbsoluteTotal
                                : acctYearTotal;

                            return (
                              <React.Fragment key={`${row.id}-${acctGroup.id}`}>
                                <tr
                                  className="bg-gray-100 bg-opacity-20 hover:bg-gray-100 hover:bg-opacity-50 text-sm cursor-pointer group"
                                  onClick={() =>
                                    toggleNonLaborAcctRow(
                                      `${row.id}-${acctGroup.id}`,
                                    )
                                  }
                                >
                                  <td className="py-1 pl-8 pr-4 border-r-2 border-gray-300 whitespace-nowrap sticky left-0 z-10 bg-inherit flex items-center text-black text-xs">
                                    <span className="mr-2">
                                      {expandedNonLaborAcctRows.includes(
                                        `${row.id}-${acctGroup.id}`,
                                      ) ? (
                                        <ChevronUpIcon className="h-3 w-3 text-black" />
                                      ) : (
                                        <ChevronDownIcon className="h-3 w-3 text-black" />
                                      )}
                                    </span>
                                    {acctGroup.description}
                                  </td>
                                  <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">
                                    {acctGroup.id || ""}
                                  </td>
                                  <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">
                                    {acctGroup.orgId || ""}
                                  </td>
                                  <td className="py-1 px-2 text-left whitespace-nowrap text-black text-xs">
                                    {acctGroup.glcPlc || ""}
                                  </td>
                                  <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs"></td>
                                  <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
                                    {formatValue(acctAbsoluteTotal)}
                                  </td>
                                  <td className="py-1 px-2 text-right whitespace-nowrap text-black text-xs">
                                    {formatValue(acctYtd)}
                                  </td>
                                  {dynamicDateRanges.map((currentRange) => (
                                    <td
                                      key={`${acctGroup.id}-${currentRange}-cost`}
                                      className="py-1 px-2 text-right whitespace-nowrap text-black text-xs"
                                    >
                                      {formatValue(
                                        acctGroup.monthlyData[currentRange] ||
                                          0,
                                      )}
                                    </td>
                                  ))}
                                </tr>

                                {expandedNonLaborAcctRows.includes(
                                  `${row.id}-${acctGroup.id}`,
                                ) &&
                                  acctGroup.employees?.map((employeeGroup) => {
                                    const entryMap = Object.fromEntries(
                                      employeeGroup.entries.map((e) => [
                                        e.monthLabel,
                                        e,
                                      ]),
                                    );

                                    // CTD is always the absolute (all-time) total.
                                    const empGroupYearTotal =
                                      Number(employeeGroup.total) || 0;
                                    const empGroupAbsoluteTotal =
                                      Number(employeeGroup.absoluteTotal) ||
                                      empGroupYearTotal;
                                    const empGroupYtd =
                                      fiscalYear === "All"
                                        ? empGroupAbsoluteTotal
                                        : empGroupYearTotal;

                                    const absoluteKeyMap = {
                                      cost: "absoluteCost", // NEW — Raw Cost
                                      gna: "absoluteGna",
                                      overhead: "absoluteOverhead",
                                      hr: "absoluteHr",
                                      materials: "absoluteMaterials",
                                      fringe: "absoluteFringe",
                                    };

                                    const breakdownCategories = [
                                      { key: "cost", name: "Raw Cost" }, // NEW — same concept as labor's raw cost line
                                      {
                                        key: "gna",
                                        name: employeeGroup.gnaName,
                                      },
                                      {
                                        key: "overhead",
                                        name: employeeGroup.overheadName,
                                      },
                                      { key: "hr", name: employeeGroup.hrName },
                                      {
                                        key: "materials",
                                        name: employeeGroup.materialsName,
                                      },
                                      {
                                        key: "fringe",
                                        name: employeeGroup.fringeName,
                                      },
                                    ];

                                    return (
                                      <React.Fragment
                                        key={`${acctGroup.id}-${employeeGroup.id}-employee-block`}
                                      >
                                        <tr className="bg-gray-100 bg-opacity-30 hover:bg-gray-100 hover:bg-opacity-60 text-xs">
                                          <td className="py-1 pl-16 pr-4 relative whitespace-nowrap sticky left-0 z-20 bg-inherit before:absolute before:top-0 before:right-0 before:h-full before:w-[2px] before:bg-gray-300 before:content-['']">
                                            {employeeGroup.name}
                                          </td>
                                          <td colSpan={4}></td>
                                          {/* <td className="py-1 px-2 text-right font-semibold"> */}
                                          <td className="py-1 px-2 text-right">
                                            {formatValue(empGroupAbsoluteTotal)}
                                          </td>
                                          {/* <td className="py-1 px-2 text-right font-semibold"> */}
                                          <td className="py-1 px-2 text-right">
                                            {formatValue(empGroupYtd)}
                                          </td>
                                          {dynamicDateRanges.map((month) => (
                                            <td
                                              key={`${employeeGroup.id}-${month}-total`}
                                              className="py-1 px-2 text-right"
                                            >
                                              {formatValue(
                                                employeeGroup.monthlyData?.[
                                                  month
                                                ] ?? 0,
                                              )}
                                            </td>
                                          ))}
                                        </tr>

                                        {breakdownCategories.map((cat) => {
                                          const subCatYearTotal =
                                            Number(employeeGroup[cat.key]) || 0;
                                          const subCatAbsoluteTotal =
                                            Number(
                                              employeeGroup[
                                                absoluteKeyMap[cat.key]
                                              ],
                                            ) || subCatYearTotal;
                                          const subCatYtd =
                                            fiscalYear === "All"
                                              ? subCatAbsoluteTotal
                                              : subCatYearTotal;

                                          return (
                                            <tr
                                              key={`${cat.key}-${employeeGroup.id}`}
                                              className="bg-gray-100 bg-opacity-30 text-xs"
                                            >
                                              <td className="py-1 relative pl-20 whitespace-nowrap sticky left-0 z-20 bg-inherit before:absolute before:top-0 before:right-0 before:h-full before:w-[2px] before:bg-gray-300 before:content-['']">
                                                --- {cat.name}
                                              </td>
                                              <td colSpan={4}></td>
                                              {/* <td className="py-1 px-2 text-right text-xs font-semibold"> */}
                                              <td className="py-1 px-2 text-right text-xs">
                                                {formatValue(
                                                  subCatAbsoluteTotal,
                                                )}
                                              </td>
                                              {/* <td className="py-1 px-2 text-right text-xs font-semibold"> */}
                                              <td className="py-1 px-2 text-right text-xs ">
                                                {formatValue(subCatYtd)}
                                              </td>
                                              {dynamicDateRanges.map(
                                                (month) => {
                                                  const entry = entryMap[month];
                                                  return (
                                                    <td
                                                      key={`${cat.key}-${month}`}
                                                      className="py-1 px-2 text-right text-xs"
                                                    >
                                                      {formatValue(
                                                        entry?.[cat.key] ?? 0,
                                                      )}
                                                    </td>
                                                  );
                                                },
                                              )}
                                            </tr>
                                          );
                                        })}
                                      </React.Fragment>
                                    );
                                  })}
                              </React.Fragment>
                            );
                          })}
                      </React.Fragment>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalysisByPeriodContent;
