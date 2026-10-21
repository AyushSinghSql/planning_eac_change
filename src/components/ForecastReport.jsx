// import React, { useState, useMemo, useRef } from "react";
// import {
//   FaCaretRight,
//   FaPlay,
//   FaFileDownload,
//   FaPlusSquare,
//   FaMinusSquare,
// } from "react-icons/fa";
// import { backendUrl } from "./config";
// import * as XLSX from "xlsx-js-style";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Constants and Mappings
// const unifiedReportApiPath = "/api/ForecastReport/GetForecastReport";
// const forecastApiPath = "/api/ForecastReport/GetForecastView";
// const projectsMasterApi = "/Project/GetAllProjects";
// const revenueWorkPeriodApi = "/ProjRevWrkPd/filter";
// const chartOfAccountsApi = "/api/ChartOfAccounts";
// const labHsApiPath = "/api/ForecastReport/GetLabHSData";
// const configApi = "/api/Configuration/GetAllConfigValuesByProject";
// const glPostDetailApi = "/api/ForecastReport/GetGlPostDetail";
// const summaryApi = "/Forecast/GetSummaryV2";

// const generalCosts = "generalCosts";

// const sectionLabels = {
//   revenueSection: "Revenue",
//   revenueAdjustment: "Revenue Adjustment",
//   labor: "Direct Labor",
//   travel: "Direct Travel",
//   otherDirectCost: "Other Direct Costs",
//   subcon: "Direct Subcontractors",
//   unallowable: "Unallowable Expense",
//   indirectSection: "Indirect",
//   fringe: "Fringe Expenses",
//   facilities: "Facility Expense",
//   overhead: "Overhead Expenses",
//   materialHandling: "Material Handling",
//   gna: "General & Administrative",
//   bp: "B&P Costs",
//   ird: "IR&D Costs",
//   nonOperating: "Non Operating Expense",
//   totalFee: "Total Fee",
// };

// const displayedSectionKeys = ["labor", "travel", "otherDirectCost", "subcon"];

// const indirectKeys = ["fringe", "overhead", "gna", "materialHandling"];

// const ACCOUNT_MAP = {
//   // Revenue
//   "40-10-01": { section: "revenueSection" },
//   "40-10-02": { section: "revenueSection" },
//   "40-20-01": { section: "revenueSection" },
//   "40-20-02": { section: "revenueSection" },
//   "40-02": { section: "revenueAdjustment" },

//   // Direct Labor
//   "50-00-01": { section: "labor" },
//   "50-00-02": { section: "labor" },
//   "50-00-97": { section: "labor" },
//   "50-00-98": { section: "labor" },
//   "50-00-99": { section: "labor" },

//   // Direct Travel
//   "50-40-01": { section: "travel" },
//   "50-40-02": { section: "travel" },
//   "50-40-04": { section: "travel" },
//   "50-40-05": { section: "travel" },
//   "50-40-06": { section: "travel" },
//   "50-40-07": { section: "travel" },
//   "59-40-02": { section: "travel" },

//   // Direct Materials (Grouped into otherDirectCost)
//   "50-21-04": { section: "otherDirectCost" },
//   "50-30-01": { section: "otherDirectCost" },
//   "50-31-01": { section: "otherDirectCost" },
//   "50-31-02": { section: "otherDirectCost" },

//   // Subcontracts
//   "50-21-01": { section: "subcon" },
//   "50-21-02": { section: "subcon" },
//   "50-21-03": { section: "subcon" },
//   "50-22-01": { section: "subcon" },
//   "50-22-02": { section: "subcon" },
//   "50-22-03": { section: "subcon" },
//   "50-22-05": { section: "subcon" },

//   // Other Direct Costs
//   "50-50-01": { section: "otherDirectCost" },
//   "50-50-02": { section: "otherDirectCost" },
//   "50-50-03": { section: "otherDirectCost" },
//   "50-51-01": { section: "otherDirectCost" },

//   // Fringe Benefits
//   "60-01-01": { section: "indirectSection", type: "fringe" },
//   "60-01-02": { section: "indirectSection", type: "fringe" },
//   "60-01-07": { section: "indirectSection", type: "fringe" },
//   "60-01-13": { section: "indirectSection", type: "fringe" },
//   "60-01-14": { section: "indirectSection", type: "fringe" },
//   "60-02-01": { section: "indirectSection", type: "fringe" },
//   "60-02-05": { section: "indirectSection", type: "fringe" },
//   "60-03-01": { section: "indirectSection", type: "fringe" },
//   "60-03-07": { section: "indirectSection", type: "fringe" },
//   "60-03-08": { section: "indirectSection", type: "fringe" },
//   "60-05-02": { section: "indirectSection", type: "fringe" },
//   "60-05-03": { section: "indirectSection", type: "fringe" },
//   "60-05-04": { section: "indirectSection", type: "fringe" },
//   "60-06-01": { section: "indirectSection", type: "fringe" },
//   "60-06-03": { section: "indirectSection", type: "fringe" },
//   "60-06-04": { section: "indirectSection", type: "fringe" },
//   "60-06-05": { section: "indirectSection", type: "fringe" },
//   "61-01-01": { section: "indirectSection", type: "fringe" },
//   "61-01-02": { section: "indirectSection", type: "fringe" },
//   "61-01-03": { section: "indirectSection", type: "fringe" },
//   "61-02-03": { section: "indirectSection", type: "fringe" },

//   // Overhead
//   "70-00-01": { section: "indirectSection", type: "overhead" },
//   "70-10-01": { section: "indirectSection", type: "overhead" },
//   "70-40-00": { section: "indirectSection", type: "overhead" },
//   "70-40-02": { section: "indirectSection", type: "overhead" },
//   "70-40-04": { section: "indirectSection", type: "overhead" },
//   "70-40-06": { section: "indirectSection", type: "overhead" },
//   "70-50-03": { section: "indirectSection", type: "overhead" },
//   "70-50-10": { section: "indirectSection", type: "overhead" },
//   "71-10-01": { section: "indirectSection", type: "overhead" },
//   "71-30-01": { section: "indirectSection", type: "overhead" },
//   "71-40-02": { section: "indirectSection", type: "overhead" },
//   "71-50-03": { section: "indirectSection", type: "overhead" },
//   "71-50-05": { section: "indirectSection", type: "overhead" },
//   "71-50-08": { section: "indirectSection", type: "overhead" },
//   "71-50-17": { section: "indirectSection", type: "overhead" },
//   "72-00-01": { section: "indirectSection", type: "overhead" },
//   "72-10-01": { section: "indirectSection", type: "overhead" },
//   "72-30-01": { section: "indirectSection", type: "overhead" },
//   "72-40-00": { section: "indirectSection", type: "overhead" },
//   "72-40-01": { section: "indirectSection", type: "overhead" },
//   "72-40-04": { section: "indirectSection", type: "overhead" },
//   "72-40-06": { section: "indirectSection", type: "overhead" },
//   "72-50-04": { section: "indirectSection", type: "overhead" },
//   "72-50-07": { section: "indirectSection", type: "overhead" },
//   "72-50-12": { section: "indirectSection", type: "overhead" },
//   "72-50-13": { section: "indirectSection", type: "overhead" },
//   "72-50-14": { section: "indirectSection", type: "overhead" },
//   "72-50-16": { section: "indirectSection", type: "overhead" },
//   "72-50-18": { section: "indirectSection", type: "overhead" },

//   // General & Administrative
//   "80-00-01": { section: "indirectSection", type: "gna" },
//   "80-10-01": { section: "indirectSection", type: "gna" },
//   "80-10-02": { section: "indirectSection", type: "gna" },
//   "80-10-04": { section: "indirectSection", type: "gna" },
//   "80-10-06": { section: "indirectSection", type: "gna" },
//   "80-20-02": { section: "indirectSection", type: "gna" },
//   "80-30-01": { section: "indirectSection", type: "gna" },
//   "80-40-00": { section: "indirectSection", type: "gna" },
//   "80-40-01": { section: "indirectSection", type: "gna" },
//   "80-40-02": { section: "indirectSection", type: "gna" },
//   "80-40-04": { section: "indirectSection", type: "gna" },
//   "80-40-05": { section: "indirectSection", type: "gna" },
//   "80-40-06": { section: "indirectSection", type: "gna" },
//   "80-50-03": { section: "indirectSection", type: "gna" },
//   "80-50-05": { section: "indirectSection", type: "gna" },
//   "80-50-06": { section: "indirectSection", type: "gna" },
//   "80-50-07": { section: "indirectSection", type: "gna" },
//   "80-50-09": { section: "indirectSection", type: "gna" },
//   "80-50-10": { section: "indirectSection", type: "gna" },
//   "80-50-11": { section: "indirectSection", type: "gna" },
//   "80-50-12": { section: "indirectSection", type: "gna" },
//   "80-50-14": { section: "indirectSection", type: "gna" },
//   "80-50-16": { section: "indirectSection", type: "gna" },
//   "80-50-17": { section: "indirectSection", type: "gna" },
//   "80-50-18": { section: "indirectSection", type: "gna" },
//   "80-50-19": { section: "indirectSection", type: "gna" },
//   "80-50-20": { section: "indirectSection", type: "gna" },
//   "80-50-21": { section: "indirectSection", type: "gna" },
//   "80-70-01": { section: "indirectSection", type: "gna" },

//   // Subcontract & Matl Handling (Now mapped to its own pool)
//   "84-00-01": { section: "indirectSection", type: "materialHandling" },
//   "84-10-01": { section: "indirectSection", type: "materialHandling" },
//   "84-10-06": { section: "indirectSection", type: "materialHandling" },
//   "84-30-01": { section: "indirectSection", type: "materialHandling" },
//   "84-50-03": { section: "indirectSection", type: "materialHandling" },
//   "84-50-14": { section: "indirectSection", type: "materialHandling" },
//   "84-50-20": { section: "indirectSection", type: "materialHandling" },

//   // Non-Operating & Interest & Income Taxes
//   "90-01-04": { section: "nonOperating" },
//   "90-02-00": { section: "nonOperating" },
//   "90-02-01": { section: "nonOperating" },
//   "90-02-02": { section: "nonOperating" },
//   "90-02-05": { section: "nonOperating" },
//   "89-41-10": { section: "nonOperating" }, // Interest Expense
//   "90-03-01": { section: "nonOperating" }, // Income Taxes

//   // Unallowables
//   "89-10-10": { section: "unallowable" },
//   "89-40-01": { section: "unallowable" },
//   "89-40-02": { section: "unallowable" },
//   "89-40-05": { section: "unallowable" },
//   "89-40-06": { section: "unallowable" },
//   "89-40-07": { section: "unallowable" },
//   "89-41-02": { section: "unallowable" },
//   "89-41-03": { section: "unallowable" },
//   "89-41-04": { section: "unallowable" },
//   "89-41-05": { section: "unallowable" },
//   "89-41-07": { section: "unallowable" },
//   "89-41-08": { section: "unallowable" },
//   "89-41-11": { section: "unallowable" },
//   "89-41-17": { section: "unallowable" },
//   "89-41-20": { section: "unallowable" }
// };

// const formatCurrency = (amount) => {
//   if (typeof amount !== "number" || isNaN(amount) || amount === 0) return "—";
//   const formatted = new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(Math.abs(amount));
//   return amount < 0 ? `(${formatted})` : formatted;
// };

// const formatDate = (dateString) => {
//   if (!dateString) return "—";
//   const date = new Date(dateString.split("T")[0] || dateString);
//   return isNaN(date)
//     ? dateString
//     : date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "2-digit",
//         day: "2-digit",
//       });
// };

// const getRollupId = (projId) => {
//   if (!projId) return "N/A";
//   const match = String(projId).match(/^(\d+)/);
//   if (match && match[1]) return match[1];
//   return String(projId).split(".")[0] || String(projId);
// };

// const getPeriodKey = (month, year) => {
//   const monthPrefixes = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];
//   return `${monthPrefixes[month - 1]}-${String(year).slice(-2)}`;
// };

// const isYellowZone = (periodStr, closingPeriod) => {
//   if (periodStr === "Total" || !closingPeriod) {
//     return false;
//   }
//   const [monthStr, yearStr] = periodStr.split("-");
//   const year = 2000 + parseInt(yearStr);
//   const monthIndex =
//     [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ].indexOf(monthStr) + 1;

//   return (
//     year > closingPeriod.year ||
//     (year === closingPeriod.year && monthIndex > closingPeriod.month)
//   );
// };

// const startsWithAny = (value, prefixes = []) =>
//   prefixes.some((prefix) => value.startsWith(prefix));

// const classifyCostSection = (acctId, currentSection) => {
//   if (!acctId) return currentSection;
//   const id = String(acctId).trim().replace(/\./g, "-");

//   if (id.startsWith("AL-") || id.startsWith("RC-")) return "excluded";

//   const mapping = ACCOUNT_MAP[id];
//   if (mapping && mapping.section) {
//     return mapping.section;
//   }
//   return currentSection;
// };

// const transformData = (
//   unifiedReportData,
//   forecastData,
//   projectsMaster,
//   dynamicMap,
//   dynamicMonthly,
//   flatWorkPeriodData,
//   accountNameMap,
//   labHsData,
//   glPostData,
//   summaryData,
//   closingPeriod,
// ) => {
//   const getAccountName = (acctId, fallback = "") => {
//     return accountNameMap[acctId] || fallback || acctId || "";
//   };

//   const aggregatedDataMap = {};
//   const projectMetadata = {};

//   projectsMaster.forEach((p) => {
//     if (p.projectId)
//       projectMetadata[p.projectId] = {
//         name: p.name || "",
//         org: p.orgId || "",
//         popStart: p.startDate || "",
//         popEnd: p.endDate || "",
//       };
//   });

//   // ==========================================
//   // Process Summary / Indirect Actuals
//   // ==========================================
//   if (summaryData && Array.isArray(summaryData)) {
//     const indirectTotals = {};
//     indirectKeys.forEach((k) => {
//       indirectTotals[k] = {};
//     });

//     summaryData.forEach((item) => {
//       const id = String(item.id || "").trim().replace(/\./g, "-");
//       const mapping = ACCOUNT_MAP[id];

//       if (!mapping || mapping.section !== "indirectSection" || !mapping.type) return;

//       const indirectKey = mapping.type;
//       Object.entries(item.monthlyTotals || {}).forEach(([period, amount]) => {
//         if (!amount) return;
//         const [year, month] = period.split("-");
//         const periodKey = getPeriodKey(parseInt(month), parseInt(year));
//         if (!dynamicMonthly.includes(periodKey)) return;

//         if (!indirectTotals[indirectKey]) indirectTotals[indirectKey] = {};
//         indirectTotals[indirectKey][periodKey] =
//           (indirectTotals[indirectKey][periodKey] || 0) + Number(amount);
//       });
//     });

//     indirectKeys.forEach((ik) => {
//       const rowKey = `indirect-${ik}`;
//       aggregatedDataMap[rowKey] = {
//         id: rowKey,
//         project: "indirect",
//         acctId: ik,
//         org: "",
//         accountName: sectionLabels[ik],
//         projectName: sectionLabels[ik],
//         section: "indirectSection",
//         Total: 0,
//         rateType: "forecast",
//         dataSource: "summary",
//       };
//       Object.entries(indirectTotals[ik]).forEach(([periodKey, amount]) => {
//         aggregatedDataMap[rowKey][`${periodKey}_${ik}`] = amount;
//       });
//     });
//   }

//   // ==========================================
//   // Process /api/ForecastReport/GetForecastReport (Actuals)
//   // ==========================================
//   if (unifiedReportData && Array.isArray(unifiedReportData)) {
//     unifiedReportData.forEach((item) => {
//       const periodKey = dynamicMap[`${item.fyCd}_PD${item.pdNo}`];
//       if (!periodKey) return;

//       if (closingPeriod) {
//         const isAfterClosing =
//           parseInt(item.fyCd) > closingPeriod.year ||
//           (parseInt(item.fyCd) === closingPeriod.year &&
//             parseInt(item.pdNo) > closingPeriod.month);
//         if (isAfterClosing) return;
//       }

//       const monthlyAmount = Number(item.amount || 0);
//       if (monthlyAmount === 0) return;

//       const projId = item.projId || "unknownProject";
//       const acctIdStr = String(item.acctId || "").trim();
//       const id = acctIdStr.replace(/\./g, "-");
//       const mapped = ACCOUNT_MAP[id];

//       // Exclude allocations entirely
//       if (id.startsWith("AL-") || id.startsWith("RC-")) return;

//       let section = "generalCosts";
//       let suffix = "";

//       if (item.sourceTable === "PSR_FINAL_DATA") {
//         if (id.startsWith("40-02")) {
//           section = "revenueAdjustment";
//           suffix = "_revenue";
//         } else if (mapped?.section === "revenueSection") {
//           section = "revenueSection";
//           suffix = "_revenue";
//         }
//       } else if (item.sourceTable === "LAB_HOURS") {
//         if (mapped?.section === "labor" || mapped?.section === "otherDirectCost" || mapped?.section === "subcon") {
//             section = mapped.section;
//         }
//       } else if (item.sourceTable === "GL_POST_DETAILS") {
//         if (mapped?.section === "labor") return;
//         if (mapped?.section === "travel") {
//           section = "travel"; // <--- ADD THIS LINE
//         }
//         if (mapped?.section === "nonOperating") {
//           section = "nonOperating";
//         } else {
//           section = mapped ? mapped.section : "generalCosts";
//           if (section === "subcon") return;
//         }
//       } else {
//         if (mapped?.section) {
//           section = mapped.section;
//         }
//       }

//       const detailRowKey = `${projId}-${section}-${acctIdStr || "NA"}`;

//       if (!aggregatedDataMap[detailRowKey]) {
//         const meta = projectMetadata[projId] || {};
//         aggregatedDataMap[detailRowKey] = {
//           id: detailRowKey,
//           project: projId,
//           acctId: acctIdStr,
//           org: item.orgId || meta.org || "",
//           accountName: getAccountName(acctIdStr),
//           projectName: meta.name || projId,
//           popStartDate: meta.popStart || "",
//           popEndDate: meta.popEnd || "",
//           section: section,
//           Total: 0,
//           rateType: item.rateType || "A",
//           dataSource: "viewData",
//         };
//       }

//       const row = aggregatedDataMap[detailRowKey];

//       // Flip the sign for Revenue accounts so they display and calculate as positive
//       // Flip the sign for Revenue accounts so they display and calculate as positive
//       const adjustedAmount = (section === "revenueSection" || section === "revenueAdjustment")
//         ? -monthlyAmount
//         : monthlyAmount;

//       if (suffix) {
//         row[`${periodKey}${suffix}`] =
//           (row[`${periodKey}${suffix}`] || 0) + adjustedAmount;
//       } else {
//         row[periodKey] = (row[periodKey] || 0) + adjustedAmount;
//       }
//     }); // <-- YOU ARE LIKELY MISSING THIS LINE
//   }     // <-- AND POSSIBLY THIS LINE

//   // ==========================================
//   // Process Labor Hours Data
//   // ==========================================
//   // ==========================================
//   // Process Labor Hours Data
//   // ==========================================
//   // if (labHsData && Array.isArray(labHsData)) {
//   //   labHsData.forEach((item) => {
//   //     return; // <--- ADD THIS LINE to stop Labor from double-counting

//   //     if (!item.acctId || !item.actAmt) return;

//   //     const acctStr = String(item.acctId).trim().replace(/\./g, "-");
//   //     if (acctStr.startsWith("AL-") || acctStr.startsWith("RC-")) return;

//   //     const periodKey = dynamicMap[`${item.fyCd}_PD${item.pdNo}`];
//   //     if (!periodKey) return;

//   //     if (closingPeriod) {
//   //       const isBeforeOrEqualClosing =
//   //         parseInt(item.fyCd) < closingPeriod.year ||
//   //         (parseInt(item.fyCd) === closingPeriod.year &&
//   //           parseInt(item.pdNo) <= closingPeriod.month);
//   //       if (isBeforeOrEqualClosing) return;
//   //     }

//   //     let section = classifyCostSection(
//   //       String(item.acctId || "").trim(),
//   //       "labor",
//   //     );

//   //     if (section === "excluded") return;

//   //     const detailRowKey = `${item.projId}-${section}-${item.acctId}-${item.emplId || "NA"}-labHs`;

//   //     if (!aggregatedDataMap[detailRowKey]) {
//   //       const meta = projectMetadata[item.projId] || {};
//   //       aggregatedDataMap[detailRowKey] = {
//   //         id: detailRowKey,
//   //         project: item.projId,
//   //         acctId: item.acctId,
//   //         org: item.orgId || meta.org || "",
//   //         accountName: `${accountNameMap[item.acctId] || item.acctId}${item.emplId ? ` (${item.emplId})` : ""}`,
//   //         projectName: meta.name || item.projId,
//   //         popStartDate: meta.popStart || "",
//   //         popEndDate: meta.popEnd || "",
//   //         section,
//   //         Total: 0,
//   //         rateType: "A",
//   //         dataSource: "viewData",
//   //       };
//   //     }
//   //     const row = aggregatedDataMap[detailRowKey];
//   //     row[periodKey] = (row[periodKey] || 0) + item.actAmt;
//   //   });
//   // }

//   // ==========================================
//   // Process GL Post Data
//   // ==========================================
//   if (glPostData && Array.isArray(glPostData)) {
//     glPostData.forEach((item) => {
//       if (!item.acctId) return;
//       const acctStr = String(item.acctId).trim().replace(/\./g, "-");
//       if (acctStr.startsWith("AL-") || acctStr.startsWith("RC-")) return;

//       const periodKey = dynamicMap[`${item.fyCd}_PD${item.pdNo}`];
//       if (!periodKey) return;

//       if (closingPeriod) {
//         const isBeforeOrEqualClosing =
//           parseInt(item.fyCd) < closingPeriod.year ||
//           (parseInt(item.fyCd) === closingPeriod.year &&
//             parseInt(item.pdNo) <= closingPeriod.month);
//         if (isBeforeOrEqualClosing) return;
//       }

//       const section = classifyCostSection(
//         String(item.acctId || "").trim(),
//         generalCosts,
//       );

//       if (section !== "travel") return;

//       const detailRowKey =
//         section === "travel"
//           ? `${item.projId}-${item.acctId}-${item.fyCd}-${item.pdNo}-${item.refId || item.voucherNo || item.jeId || "NA"}-travel`
//           : `${item.projId}-${section}-${item.acctId}-glPost`;

//       if (!aggregatedDataMap[detailRowKey]) {
//         const meta = projectMetadata[item.projId] || {};
//         aggregatedDataMap[detailRowKey] = {
//           id: detailRowKey,
//           project: item.projId,
//           acctId: item.acctId,
//           org: item.orgId || meta.org || "",
//           accountName: accountNameMap[item.acctId] || item.acctId,
//           projectName: meta.name || item.projId,
//           popStartDate: meta.popStart || "",
//           popEndDate: meta.popEnd || "",
//           section,
//           Total: 0,
//           rateType: "A",
//           dataSource: "glPost",
//         };
//       }
//       const row = aggregatedDataMap[detailRowKey];
//       row[periodKey] = (row[periodKey] || 0) + Number(item.amt1 || 0);
//     });
//   }

//   // ==========================================
//   // Process Flat Work Period Data
//   // ==========================================
//   if (flatWorkPeriodData && Array.isArray(flatWorkPeriodData)) {
//     flatWorkPeriodData.forEach((item) => {
//       const periodKey = getPeriodKey(item.period, item.fy_Cd);
//       if (!periodKey || !dynamicMonthly.includes(periodKey)) return;
//       if (!item.revAdj || Number(item.revAdj) === 0) return;

//       const detailRowKey = `${item.projId}-revenueAdjustment-40.02.03`;
//       if (!aggregatedDataMap[detailRowKey]) {
//         // Reserved for future
//       }
//     });
//   }

//   // ==========================================
//   // Process Forecast Data (Post Closing)
//   // ==========================================
//   forecastData.forEach((item) => {
//     const isBeforeOrEqualCutoff =
//       closingPeriod &&
//       (item.year < closingPeriod.year ||
//         (item.year === closingPeriod.year &&
//           item.month <= closingPeriod.month));

//     if (isBeforeOrEqualCutoff) return;
//     if (!item.acctId) return;

//     const periodKey = getPeriodKey(item.month, item.year);

//     // Unify Forecast Indirect Structure Mapping
//     const indirectForecastMappings = [
//       { key: "fringe", amount: Number(item.fringe || 0) },
//       { key: "overhead", amount: Number(item.overhead || 0) },
//       { key: "gna", amount: Number(item.gna || 0) },
//       { key: "materialHandling", amount: Number(item.mnh || item.materialHandling || 0) },
//     ];

//     indirectForecastMappings.forEach(({ key, amount }) => {
//       if (!amount) return;
//       const rowKey = `indirect-${key}`;

//       if (!aggregatedDataMap[rowKey]) {
//         aggregatedDataMap[rowKey] = {
//           id: rowKey,
//           project: "indirect",
//           acctId: key,
//           org: "",
//           accountName: sectionLabels[key],
//           projectName: sectionLabels[key],
//           section: "indirectSection",
//           Total: 0,
//           rateType: "forecast",
//           dataSource: "forecast",
//         };
//       }
//       aggregatedDataMap[rowKey][`${periodKey}_${key}`] =
//         (aggregatedDataMap[rowKey][`${periodKey}_${key}`] || 0) + amount;
//     });

//     if (!periodKey || !dynamicMonthly.includes(periodKey)) return;

//     const acctIdStr = String(item.acctId || "").trim();
//     const id = acctIdStr.replace(/\./g, "-");
//     const mapped = ACCOUNT_MAP[id];

//     if (id.startsWith("AL-") || id.startsWith("RC-")) return;

//     let section = "generalCosts";
//     if (mapped?.section === "revenueSection") section = "revenueSection";
//     else if (id.startsWith("40-02")) section = "revenueAdjustment";
//     else if (mapped?.section) section = mapped.section;

//     // UNIFIED COMBINED KEY
//     const detailRowKey = `${item.projId}-${section}-${acctIdStr}`;

//     if (!aggregatedDataMap[detailRowKey]) {
//       const meta = projectMetadata[item.projId] || {};
//       aggregatedDataMap[detailRowKey] = {
//         id: detailRowKey,
//         project: item.projId,
//         acctId: acctIdStr,
//         org: item.orgId || meta.org || "",
//         accountName: accountNameMap[acctIdStr] || acctIdStr,
//         projectName: item.projName || meta.name || item.projId || "-",
//         popStartDate: meta.popStart || "",
//         popEndDate: meta.popEnd || "",
//         section,
//         Total: 0,
//         rateType: "forecast",
//         dataSource: "forecast",
//       };
//     }

//     const row = aggregatedDataMap[detailRowKey];

//     // Inject Forecast Revenue
//     if (
//       item.revenue &&
//       (section === "revenueSection" || section === "revenueAdjustment")
//     ) {
//       row[`${periodKey}_revenue`] =
//         (row[`${periodKey}_revenue`] || 0) + Number(item.revenue || 0);
//     }

//     // Inject Cost Forecast allocations cleanly
//     if (displayedSectionKeys.includes(section) || section === "nonOperating") {
//       const costAmount = item.cost || 0;
//       if (costAmount !== 0) row[periodKey] = (row[periodKey] || 0) + costAmount;
//     }
//   });

//   const finalArray = Object.values(aggregatedDataMap);
//   finalArray.forEach((row) => {
//     let rowTotal = 0;
//     dynamicMonthly.forEach((period) => {
//       if (
//         row.section === "revenueSection" ||
//         row.section === "revenueAdjustment"
//       )
//         rowTotal += row[`${period}_revenue`] || 0;
//       else if (row.section === "indirectSection") {
//         const ik = row.acctId;
//         rowTotal += row[`${period}_${ik}`] || 0;
//       } else rowTotal += row[period] || 0;
//     });
//     row["Total"] = rowTotal;
//   });

//   return finalArray.sort((a, b) => (a.dataSource === "viewData" ? -1 : 1));
// };

// const ForecastReport = () => {
//   const [closingPeriod, setClosingPeriod] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isReportRun, setIsReportRun] = useState(false);
//   const [apiData, setApiData] = useState([]);
//   const [timePeriods, setTimePeriods] = useState([]);
//   const [monthlyPeriods, setMonthlyPeriods] = useState([]);
//   const [rateType, setRateType] = useState("");

//   const leftPaneRef = useRef(null);
//   const rightPaneRef = useRef(null);

//   const [expandedSections, setExpandedSections] = useState({});
//   const [expandedProjects, setExpandedProjects] = useState({});

//   const toggleSection = (key) =>
//     setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
//   const toggleProject = (projectId) =>
//     setExpandedProjects((prev) => ({ ...prev, [projectId]: !prev[projectId] }));

//   const expandAll = () => {
//     const allSections = [
//       "revenueSection",
//       "revenueAdjustment",
//       ...displayedSectionKeys,
//       "nonOperating",
//       "indirectSection",
//     ];
//     const sectionExp = {};
//     allSections.forEach((s) => (sectionExp[s] = true));
//     setExpandedSections(sectionExp);
//     const projectExp = {};
//     apiData.forEach((row) => {
//       projectExp[row.project] = true;
//     });
//     setExpandedProjects(projectExp);
//   };

//   const collapseAll = () => {
//     setExpandedSections({});
//     setExpandedProjects({});
//   };

//   const fetchJsonSafely = async (url, fallback = []) => {
//     try {
//       const response = await fetch(url);
//       if (!response.ok) {
//         console.error(
//           `HTTP Drop Error on endpoint: ${url}. Status: ${response.status}`,
//         );
//         return fallback;
//       }
//       const contentType = response.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//         console.error(`Non-JSON Payload drop on endpoint: ${url}`);
//         return fallback;
//       }
//       return await response.json();
//     } catch (e) {
//       console.error(`Network Exception handled for endpoint: ${url}`, e);
//       return fallback;
//     }
//   };

//   const handleRunReport = async () => {
//     if (!rateType) {
//       toast.info("Please select a Rate Type", {
//         position: "top-right",
//         theme: "light",
//         hideProgressBar: true,
//       });
//       return;
//     }
//     setLoading(true);
//     setIsReportRun(true);
//     try {
//       const [
//         detailData,
//         rawForecast,
//         projectsMaster,
//         chartOfAccounts,
//         glPostData,
//         summaryData,
//       ] = await Promise.all([
//         fetchJsonSafely(`${backendUrl}${unifiedReportApiPath}`),
//         fetchJsonSafely(`${backendUrl}${forecastApiPath}`),
//         fetchJsonSafely(`${backendUrl}${projectsMasterApi}`),
//         fetchJsonSafely(`${backendUrl}${chartOfAccountsApi}`),
//         fetchJsonSafely(`${backendUrl}${glPostDetailApi}`),
//         fetchJsonSafely(`${backendUrl}${summaryApi}`),
//       ]);

//       let closingPeriodData = null;
//       try {
//         const configRes = await fetch(`${backendUrl}${configApi}/xxxxx`);
//         if (configRes.ok) {
//           const configData = await configRes.json();
//           const closingConfig = configData.find(
//             (c) => c.name === "closing_period",
//           );
//           if (closingConfig?.value) {
//             const dt = new Date(closingConfig.value);
//             closingPeriodData = {
//               year: dt.getFullYear(),
//               month: dt.getMonth() + 1,
//             };
//             setClosingPeriod(closingPeriodData);
//           }
//         }
//       } catch (err) {
//         console.error("Closing period configuration exception handled", err);
//       }

//       let labHsData = [];
//       try {
//         const labHsRes = await fetch(`${backendUrl}${labHsApiPath}`);
//         if (labHsRes.ok) {
//           const labHsText = await labHsRes.text();
//           if (labHsText && labHsText.trim() !== "") {
//             try {
//               labHsData = JSON.parse(labHsText);
//             } catch (e) {
//               labHsData = [];
//             }
//           }
//         }
//       } catch (err) {
//         labHsData = [];
//       }

//       const accountNameMap = {};
//       chartOfAccounts.forEach((acct) => {
//         if (acct.accountId && acct.accountName)
//           accountNameMap[acct.accountId] = acct.accountName;
//       });
//       const forecastData = rawForecast.filter(
//         (item) => item.plType === "EAC" || item.plType === "NBBUD",
//       );

//       const uniqueConfigs = [];
//       const seen = new Set();
//       forecastData.forEach((item) => {
//         const key = `${item.projId}-${item.version}-${item.plId}`;
//         if (!seen.has(key)) {
//           uniqueConfigs.push({
//             projId: item.projId,
//             version: item.version,
//             plId: item.plId,
//           });
//           seen.add(key);
//         }
//       });

//       const workPeriodPromises = uniqueConfigs.map((config) =>
//         fetch(
//           `${backendUrl}${revenueWorkPeriodApi}?projId=${config.projId}&versionNo=${config.version}&bgtType=NBBUD&pl_id=${config.plId}`,
//         )
//           .then((r) => (r.ok ? r.json() : []))
//           .catch(() => []),
//       );
//       const workPeriodResults = await Promise.all(workPeriodPromises);
//       const flatWorkPeriodData = workPeriodResults.flat();

//       let minYear = Number.MAX_SAFE_INTEGER;
//       let minMonth = Number.MAX_SAFE_INTEGER;
//       let maxYear = 0;
//       let maxMonth = 0;

//       const updateMinMax = (year, month) => {
//         if (!year || !month) return;
//         if (year < minYear || (year === minYear && month < minMonth)) {
//           minYear = year;
//           minMonth = month;
//         }
//         if (year > maxYear || (year === maxYear && month > maxMonth)) {
//           maxYear = year;
//           maxMonth = month;
//         }
//       };

//       if (Array.isArray(detailData)) {
//         detailData.forEach((d) => {
//           if (d.amount !== 0) updateMinMax(parseInt(d.fyCd), parseInt(d.pdNo));
//         });
//       }
//       forecastData.forEach((d) => {
//         if (
//           d.cost !== 0 ||
//           d.revenue !== 0 ||
//           d.fringe ||
//           d.overhead ||
//           d.gna ||
//           d.mnh
//         ) {
//           updateMinMax(parseInt(d.year), parseInt(d.month));
//         }
//       });

//       if (minYear < 2026) {
//         minYear = 2026;
//         minMonth = 1;
//       }

//       const dynamicMonthly = [];
//       const dynamicMap = {};
//       const totalMonths = (maxYear - minYear) * 12 + (maxMonth - minMonth + 1);
//       const monthsToGenerate = Math.max(totalMonths, 12);

//       let currentYear = minYear;
//       let currentMonth = minMonth;

//       for (let i = 0; i < monthsToGenerate; i++) {
//         const key = getPeriodKey(currentMonth, currentYear);
//         dynamicMonthly.push(key);
//         dynamicMap[`${currentYear}_PD${currentMonth}`] = key;
//         dynamicMap[`${currentYear}_${currentMonth}`] = key;
//         currentMonth++;
//         if (currentMonth > 12) {
//           currentMonth = 1;
//           currentYear++;
//         }
//       }

//       setMonthlyPeriods(dynamicMonthly);
//       setTimePeriods([...dynamicMonthly, "Total"]);
//       setApiData(
//         transformData(
//           detailData,
//           forecastData,
//           projectsMaster,
//           dynamicMap,
//           dynamicMonthly,
//           flatWorkPeriodData,
//           accountNameMap,
//           labHsData,
//           glPostData,
//           summaryData,
//           closingPeriodData,
//         ),
//       );
//     } catch (e) {
//       console.error("Global core matrix exception tracking managed", e);
//       toast.error("Data processing layout sequence execution failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredByRateType = useMemo(() => {
//     return apiData.filter((row) => {
//       if (row.rateType === "forecast") return true;
//       if (row.section === "revenueSection") return true;
//       if (
//         row.section === "revenueAdjustment" ||
//         row.section === "indirectSection"
//       ) {
//         return row.rateType === rateType;
//       }
//       return true;
//     });
//   }, [apiData, rateType]);

//   const { paginatedRollups } = useMemo(() => {
//     const rollupGroup = {};
//     filteredByRateType.forEach((item) => {
//       const isTravel = item.section === "travel";
//       const rollupId = isTravel ? item.project : getRollupId(item.project);
//       let groupKey = `${rollupId}__${item.section}`;

//       if (!rollupGroup[groupKey]) {
//         rollupGroup[groupKey] = {
//           id: groupKey,
//           project: rollupId,
//           org: item.org || "",
//           projectName: item.projectName,
//           isRollupParent: true,
//           Total: 0,
//           section: item.section,
//           children: [],
//         };
//       }
//       const parent = rollupGroup[groupKey];

//       if (item.section === "travel") {
//         const uniqueTravelKey = item.id;
//         if (!parent._travelTracker) parent._travelTracker = new Set();
//         if (parent._travelTracker.has(uniqueTravelKey)) return;
//         parent._travelTracker.add(uniqueTravelKey);
//       }

//       parent.children.push(item);
//       monthlyPeriods.forEach((period) => {
//         if (
//           item.section === "revenueSection" ||
//           item.section === "revenueAdjustment"
//         ) {
//           // ADD '|| item[period]' at the end of this addition string
//           parent[`${period}_revenue`] =
//             (parent[`${period}_revenue`] || 0) +
//             (item[`${period}_revenue`] || item[period] || 0);
//         } else if (item.section === "indirectSection") {
//           const ik = item.acctId;
//           parent[`${period}_${ik}`] =
//             (parent[`${period}_${ik}`] || 0) + (item[`${period}_${ik}`] || 0);
//         } else {
//           parent[period] = (parent[period] || 0) + (item[period] || 0);
//         }
//       });
//     });

//     Object.values(rollupGroup).forEach((parent) => {
//       let parentTotal = 0;
//       monthlyPeriods.forEach((period) => {
//         if (
//           parent.section === "revenueSection" ||
//           parent.section === "revenueAdjustment"
//         ) {
//           parentTotal += parent[`${period}_revenue`] || 0;
//         } else if (parent.section === "indirectSection") {
//           indirectKeys.forEach((ik) => {
//             parentTotal += parent[`${period}_${ik}`] || 0;
//           });
//         } else parentTotal += parent[period] || 0;
//       });
//       parent["Total"] = parentTotal;
//     });
//     return { paginatedRollups: Object.values(rollupGroup) };
//   }, [filteredByRateType, monthlyPeriods]);

//   const {
//     sectionTotals,
//     grandRevenueAdjustmentTotal,
//     grandRevenueTotal,
//     grandIndirectTotal,
//     grandTotalFee,
//     grandIndirectComponents,
//     finalIndirectKeys,
//   } = useMemo(() => {
//     const sT = {};
//     const gRT = {};
//     const gRAT = {};
//     const gIT = {};
//     const gTF = {};
//     const gIC = {};
//     const periods = timePeriods;

//     displayedSectionKeys.forEach((k) => {
//       sT["nonOperating"] = {};
//       periods.forEach(
//         (p) =>
//           (sT["nonOperating"][p] = filteredByRateType
//             .filter((r) => r.section === "nonOperating")
//             .reduce((acc, r) => acc + (r[p] || 0), 0)),
//       );
//       sT[k] = {};
//       periods.forEach(
//         (p) =>
//           (sT[k][p] = filteredByRateType
//             .filter((r) => r.section === k)
//             .reduce((acc, r) => acc + (r[p] || 0), 0)),
//       );
//     });

//     periods.forEach((p) => {
//       gRT[p] = filteredByRateType
//         .filter((r) => r.section === "revenueSection")
//         .reduce((acc, r) => acc + (r[`${p}_revenue`] || r[p] || 0), 0);

//       indirectKeys.forEach((ik) => {
//         if (!gIC[ik]) gIC[ik] = {};
//         gIC[ik][p] = filteredByRateType
//           .filter((r) => r.section === "indirectSection")
//           .reduce((acc, r) => acc + (r[`${p}_${ik}`] || 0), 0);
//       });

//       gRAT[p] = filteredByRateType
//         .filter((r) => r.section === "revenueAdjustment")
//         .reduce((acc, r) => acc + (r[`${p}_revenue`] || r[p] || 0), 0);

//       gIT[p] = indirectKeys.reduce((acc, ik) => acc + (gIC[ik][p] || 0), 0);

//       gTF[p] =
//         gRT[p] +
//         (gRAT[p] || 0) -
//         (displayedSectionKeys.reduce((acc, k) => acc + (sT[k][p] || 0), 0) +
//           gIT[p] +
//           (sT["nonOperating"]?.[p] || 0));
//     });

//     return {
//       sectionTotals: sT,
//       grandRevenueAdjustmentTotal: gRAT,
//       grandRevenueTotal: gRT,
//       grandIndirectTotal: gIT,
//       grandTotalFee: gTF,
//       grandIndirectComponents: gIC,
//       finalIndirectKeys: indirectKeys.filter((ik) =>
//         periods.some((p) => gIC[ik][p] !== 0),
//       ),
//     };
//   }, [filteredByRateType, timePeriods]);

//   const exportToExcel = () => {
//     const wb = XLSX.utils.book_new();
//     const borderStyle = {
//       top: { style: "thin" },
//       bottom: { style: "thin" },
//       left: { style: "thin" },
//       right: { style: "thin" },
//     };
//     const headerStyleBase = {
//       font: { bold: true, color: { rgb: "FFFFFF" } },
//       border: borderStyle,
//       alignment: { horizontal: "center" },
//     };
//     const amountFormat = "$#,##0.00";
//     const applyStyles = (ws, rowCount, colCount) => {
//       for (let R = 0; R < rowCount; R++) {
//         for (let C = 0; C < colCount; C++) {
//           const ref = XLSX.utils.encode_cell({ r: R, c: C });
//           if (!ws[ref]) continue;
//           ws[ref].s = { border: borderStyle };
//           if (R === 0) {
//             const cellVal = String(ws[ref].v);
//             const isYellow = isYellowZone(cellVal, closingPeriod);
//             ws[ref].s = {
//               ...headerStyleBase,
//               fill: { fgColor: { rgb: isYellow ? "FCD34D" : "059669" } },
//               font: {
//                 ...headerStyleBase.font,
//                 color: { rgb: isYellow ? "1E293B" : "FFFFFF" },
//               },
//             };
//           }
//           if (C === 0) ws[ref].s.font = { bold: true };
//           if (C > colCount - timePeriods.length - 1) ws[ref].z = amountFormat;
//         }
//       }
//     };

//     const totalRows = [
//       ["Category", ...timePeriods],
//       ["Total Revenue", ...timePeriods.map((p) => grandRevenueTotal[p])],

//       [
//         "Revenue Adjustment",
//         ...timePeriods.map((p) => grandRevenueAdjustmentTotal[p] || 0),
//       ],
//     ];
//     displayedSectionKeys.forEach((k) =>
//       totalRows.push([
//         `Total ${sectionLabels[k]}`,
//         ...timePeriods.map((p) => sectionTotals[k][p]),
//       ]),
//     );
//     totalRows.push([
//       `Total ${sectionLabels["nonOperating"]}`,
//       ...timePeriods.map((p) => sectionTotals["nonOperating"]?.[p] || 0),
//     ]);
//     totalRows.push(
//       ["Total Indirects", ...timePeriods.map((p) => grandIndirectTotal[p])],
//       ["Grand Total Fee", ...timePeriods.map((p) => grandTotalFee[p])],
//     );
//     const wsTotal = XLSX.utils.aoa_to_sheet(totalRows);
//     applyStyles(wsTotal, totalRows.length, timePeriods.length + 1);
//     XLSX.utils.book_append_sheet(wb, wsTotal, "Total Summary");

//     const subRows = [["Section", "Project ID", ...timePeriods]];
//     [
//       "revenueSection",
//       "revenueAdjustment",
//       ...displayedSectionKeys,
//       "indirectSection",
//       "nonOperating",
//     ].forEach((sec) => {
//       const secLabel =
//         sec === "indirectSection"
//           ? "Total Indirects"
//           : sec === "revenueSection"
//             ? "Total Revenue"
//             : sec === "revenueAdjustment"
//               ? "Revenue Adjustment"
//               : `Total ${sectionLabels[sec]}`;
//       const secSource =
//         sec === "indirectSection"
//           ? grandIndirectTotal
//           : sec === "revenueSection"
//             ? grandRevenueTotal
//             : sec === "revenueAdjustment"
//               ? grandRevenueAdjustmentTotal
//               : sectionTotals[sec];

//       subRows.push([
//         secLabel,
//         "Section Total",
//         ...timePeriods.map((p) => secSource[p] || 0),
//       ]);

//       if (sec === "indirectSection") {
//         indirectKeys.forEach((ik) => {
//           subRows.push([
//             sectionLabels[ik],
//             "",
//             ...timePeriods.map((p) => grandIndirectComponents[ik][p] || 0),
//           ]);
//         });
//       } else {
//         paginatedRollups
//           .filter((r) => r.section === sec)
//           .forEach((r) => {
//             subRows.push([
//               sectionLabels[r.section] || r.section,
//               r.project,
//               ...timePeriods.map((p) =>
//                 p === "Total"
//                   ? r["Total"] || 0
//                   : r.section === "revenueSection" ||
//                       r.section === "revenueAdjustment"
//                     ? r[`${p}_revenue`] || 0
//                     : r[p] || 0,
//               ),
//             ]);
//           });
//       }
//       subRows.push([]);
//     });
//     const wsSub = XLSX.utils.aoa_to_sheet(subRows);
//     applyStyles(wsSub, subRows.length, timePeriods.length + 2);
//     XLSX.utils.book_append_sheet(wb, wsSub, "Subtotal Sheet");

//     const detailRows = [
//       [
//         "Project",
//         "Project Name",
//         "Org",
//         "Account ID",
//         "Account Name",
//         ...timePeriods,
//       ],
//     ];
//     filteredByRateType.forEach((r) =>
//       detailRows.push([
//         r.project,
//         r.projectName,
//         r.org,
//         r.acctId,
//         r.accountName,
//         ...timePeriods.map((p) =>
//           r.section === "revenueSection" || r.section === "revenueAdjustment"
//             ? r[`${p}_revenue`] || 0
//             : r[p] || 0,
//         ),
//       ]),
//     );
//     const wsDet = XLSX.utils.aoa_to_sheet(detailRows);
//     applyStyles(wsDet, detailRows.length, timePeriods.length + 5);
//     XLSX.utils.book_append_sheet(wb, wsDet, "Detail Report");

//     const now = new Date();

//     const timestamp =
//       `${now.getFullYear()}` +
//       `${String(now.getMonth() + 1).padStart(2, "0")}` +
//       `${String(now.getDate()).padStart(2, "0")}_` +
//       `${String(now.getHours()).padStart(2, "0")}` +
//       `${String(now.getMinutes()).padStart(2, "0")}` +
//       `${String(now.getSeconds()).padStart(2, "0")}`;

//     XLSX.writeFile(wb, `Forecast_Report_${rateType}_${timestamp}.xlsx`);
//   };

//   const handleScrollSync = (e) => {
//     if (e.target === leftPaneRef.current) {
//       rightPaneRef.current.scrollTop = e.target.scrollTop;
//     } else if (e.target === rightPaneRef.current) {
//       leftPaneRef.current.scrollTop = e.target.scrollTop;
//     }
//   };

//   const renderDimensionCells = (
//     item,
//     isRevenue,
//     breakdownKey,
//     isRollup = false,
//     isHeader = false,
//     label = "",
//   ) => {
//     if (isHeader) {
//       const bgClass =
//         "bg-emerald-50/60 text-emerald-900 border-b border-r border-slate-200";
//       const isExpanded = expandedSections[breakdownKey];

//       return (
//         <td
//           colSpan={dimensionHeaders.length}
//           className={`px-4 py-2.5 text-xs font-bold align-middle tracking-wider transition-colors duration-150 ${bgClass}`}
//         >
//           <div className="flex items-center select-none">
//             {breakdownKey !== "totalFee" && (
//               <FaCaretRight
//                 className={`w-3.5 h-3.5 mr-2 transform transition-transform duration-200 text-emerald-700 ${isExpanded ? "rotate-90" : ""}`}
//               />
//             )}
//             {label}
//           </div>
//         </td>
//       );
//     }

//     let meta = item;
//     if (!item && label && breakdownKey) {
//       meta = { project: label, accountName: "", projectName: "" };
//     }

//     return dimensionHeaders.map((h) => {
//       let content = meta ? meta[h.key] : "";
//       let bgClass = isRollup
//         ? "bg-emerald-50/40 font-semibold text-emerald-800"
//         : "bg-white text-slate-600";

//       if (h.key === "project" && meta?.isRollupParent) {
//         return (
//           <td
//             key={h.key}
//             className={`px-4 py-2.5 text-xs border-b border-r border-slate-200 align-middle transition-colors ${bgClass}`}
//             onClick={() => toggleProject(meta.project)}
//           >
//             <div className="flex items-center space-x-1.5 cursor-pointer select-none text-emerald-700 hover:text-emerald-900">
//               <FaCaretRight
//                 className={`w-3 h-3 transform transition-transform duration-150 ${expandedProjects[meta.project] ? "rotate-90" : ""}`}
//               />
//               <span className="font-bold underline decoration-emerald-200 decoration-2 underline-offset-2">
//                 {content}
//               </span>
//             </div>
//           </td>
//         );
//       }
//       if (h.key === "popStartDate" || h.key === "popEndDate")
//         content = formatDate(content);
//       return (
//         <td
//           key={h.key}
//           className={`px-4 py-2.5 text-xs border-b border-r border-slate-200 whitespace-nowrap align-middle ${bgClass} ${h.key === "project" && !isRollup ? "text-emerald-700 font-semibold" : ""}`}
//         >
//           {content}
//         </td>
//       );
//     });
//   };

//   const renderMonthlyCells = (
//     data,
//     key,
//     isRev = false,
//     isInd = false,
//     isSummary = false,
//   ) => {
//     const suffix = isRev ? "_revenue" : isInd ? `_${key}` : "";

//     return timePeriods.map((p) => {
//       const val = data[`${p}${suffix}`] || data[p] || 0;
//       let cellBg = "bg-white";
//       let textClass = "text-slate-700 font-medium";

//       if (isSummary) {
//         cellBg = "bg-emerald-50/60 text-emerald-950 font-bold";
//         textClass = "text-emerald-950";
//       } else if (isYellowZone(p, closingPeriod)) {
//         cellBg = "bg-amber-50 border-amber-100/60";
//         textClass = "text-amber-900 font-semibold";
//       } else {
//         const isRollupRow = Object.keys(data).includes("isRollupParent");
//         if (isRollupRow) cellBg = "bg-emerald-50/40";
//       }

//       return (
//         <td
//           key={p}
//           className={`px-5 py-2.5 text-xs text-right min-w-[140px] border-b border-r border-slate-200 align-middle transition-colors ${cellBg} ${textClass}`}
//         >
//           {formatCurrency(val)}
//         </td>
//       );
//     });
//   };

//   const dimensionHeaders = [
//     { key: "project", label: "Project", width: "150px" },
//     { key: "projectName", label: "Project Name", width: "240px" },
//     { key: "org", label: "Org", width: "100px" },
//     { key: "acctId", label: "Account ID", width: "120px" },
//     { key: "accountName", label: "Account Name", width: "220px" },
//     { key: "popStartDate", label: "Pop Start Date", width: "120px" },
//     { key: "popEndDate", label: "Pop End Date", width: "120px" },
//   ];

//   return (
//     <div className="flex flex-col min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
//       {/* Header Panel */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-200 p-5 rounded-xl shadow-sm mb-5 gap-4">
//         <div>
//           <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
//             Forecast Report
//           </h1>
//           <div className="flex flex-wrap items-center gap-4 mt-2.5">
//             <div className="flex items-center text-xs font-medium text-slate-500">
//               <span className="w-3 h-3 bg-emerald-600 rounded-md mr-1.5 shadow-sm shadow-emerald-100"></span>
//               Actuals
//             </div>
//             <div className="flex items-center text-xs font-medium text-slate-500">
//               <span className="w-3 h-3 bg-amber-400 rounded-md mr-1.5 shadow-sm shadow-amber-100"></span>
//               Forecast
//             </div>
//             {isReportRun && (
//               <div className="flex items-center gap-3 border-l border-slate-200 pl-4 ml-1">
//                 <button
//                   onClick={expandAll}
//                   className="flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
//                 >
//                   <FaPlusSquare className="mr-1.5" /> Expand All
//                 </button>
//                 <button
//                   onClick={collapseAll}
//                   className="flex items-center text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
//                 >
//                   <FaMinusSquare className="mr-1.5" /> Collapse All
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Filters and Toolbar Container */}
//         <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
//           <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 min-w-[210px] shadow-inner">
//             <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
//               Rate Filter:
//             </span>
//             <select
//               value={rateType}
//               onChange={(e) => setRateType(e.target.value)}
//               className="w-full bg-transparent text-xs font-bold text-slate-800 cursor-pointer outline-none"
//             >
//               <option value="">Select Option</option>
//               <option value="A">Actual Rate (A)</option>
//               <option value="T">Target Rate (T)</option>
//             </select>
//           </div>

//           {isReportRun && (
//             <button
//               onClick={exportToExcel}
//               className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 hover:border-emerald-200 shadow-sm transition-all active:scale-[0.98]"
//             >
//               <FaFileDownload className="text-slate-400" /> Export Sheet
//             </button>
//           )}

//           <button
//             onClick={handleRunReport}
//             disabled={loading}
//             className={`inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-[0.98] ${
//               !rateType
//                 ? "bg-slate-200 cursor-not-allowed text-slate-400 shadow-none"
//                 : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100"
//             }`}
//           >
//             <FaPlay
//               className={`w-2.5 h-2.5 ${loading ? "animate-pulse" : ""}`}
//             />
//             {loading ? "Calculating..." : "Execute View"}
//           </button>
//         </div>
//       </div>

//       {/* Main Report View Matrix */}
//       {isReportRun && (
//         <div className="flex w-full border border-slate-200 rounded-xl bg-white max-h-[72vh] overflow-hidden shadow-md">
//           {/* Frozen Dimensions Section */}
//           <div
//             className="w-[45%] overflow-auto border-r-4 border-slate-300 custom-scrollbar select-none"
//             ref={leftPaneRef}
//             onScroll={handleScrollSync}
//           >
//             <table className="w-max border-collapse table-fixed">
//               <thead className="sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
//                 <tr className="bg-emerald-700 text-white border-b border-emerald-800">
//                   {dimensionHeaders.map((h) => (
//                     <th
//                       key={h.key}
//                       className="px-4 py-3 text-left text-[10px] font-bold tracking-wider align-middle"
//                       style={{ width: h.width }}
//                     >
//                       {h.label}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {/* Revenue Structural Module */}
//                 <tr
//                   className="cursor-pointer border-b border-slate-200"
//                   onClick={() => toggleSection("revenueSection")}
//                 >
//                   {renderDimensionCells(
//                     null,
//                     false,
//                     "revenueSection",
//                     false,
//                     true,
//                     sectionLabels.revenueSection,
//                   )}
//                 </tr>
//                 {expandedSections.revenueSection &&
//                   paginatedRollups
//                     .filter((p) => p.section === "revenueSection")
//                     .map((rollupItem) => (
//                       <React.Fragment key={rollupItem.id}>
//                         <tr className="hover:bg-slate-50/50">
//                           {renderDimensionCells(rollupItem, true, null, true)}
//                         </tr>
//                         {expandedProjects[rollupItem.project] &&
//                           rollupItem.children.map((child) => (
//                             <tr key={child.id} className="hover:bg-slate-50/30">
//                               {renderDimensionCells(child, true, null, false)}
//                             </tr>
//                           ))}
//                       </React.Fragment>
//                     ))}

//                 {/* Revenue Adjustment */}
//                 <tr onClick={() => toggleSection("revenueAdjustment")}>
//                   {renderDimensionCells(
//                     null,
//                     false,
//                     "revenueAdjustment",
//                     false,
//                     true,
//                     sectionLabels.revenueAdjustment,
//                   )}
//                 </tr>

//                 {expandedSections.revenueAdjustment &&
//                   paginatedRollups
//                     .filter((p) => p.section === "revenueAdjustment")
//                     .map((rollupItem) => (
//                       <React.Fragment key={rollupItem.id}>
//                         <tr>{renderDimensionCells(rollupItem)}</tr>
//                         {expandedProjects[rollupItem.project] &&
//                           rollupItem.children.map((child) => (
//                             <tr key={child.id}>
//                               {renderDimensionCells(child)}
//                             </tr>
//                           ))}
//                       </React.Fragment>
//                     ))}

//                 {/* Direct Costs Modules */}
//                 {displayedSectionKeys.map((sectionKey) => (
//                   <React.Fragment key={sectionKey}>
//                     <tr
//                       className="cursor-pointer border-b border-slate-200"
//                       onClick={() => toggleSection(sectionKey)}
//                     >
//                       {renderDimensionCells(
//                         null,
//                         false,
//                         sectionKey,
//                         false,
//                         true,
//                         sectionLabels[sectionKey],
//                       )}
//                     </tr>
//                     {expandedSections[sectionKey] &&
//                       paginatedRollups
//                         .filter((r) => r.section === sectionKey)
//                         .map((rollupItem) => (
//                           <React.Fragment key={rollupItem.id}>
//                             <tr className="hover:bg-slate-50/50">
//                               {renderDimensionCells(
//                                 rollupItem,
//                                 false,
//                                 null,
//                                 true,
//                               )}
//                             </tr>
//                             {expandedProjects[rollupItem.project] &&
//                               rollupItem.children.map((child) => (
//                                 <tr
//                                   key={child.id}
//                                   className="hover:bg-slate-50/30"
//                                 >
//                                   {renderDimensionCells(
//                                     child,
//                                     false,
//                                     null,
//                                     false,
//                                   )}
//                                 </tr>
//                               ))}
//                           </React.Fragment>
//                         ))}
//                   </React.Fragment>
//                 ))}

//                 {/* Indirect Cost Structure Pool */}
//                 <tr
//                   className="cursor-pointer border-b border-slate-200"
//                   onClick={() => toggleSection("indirectSection")}
//                 >
//                   {renderDimensionCells(
//                     null,
//                     false,
//                     "indirectSection",
//                     false,
//                     true,
//                     sectionLabels.indirectSection,
//                   )}
//                 </tr>
//                 {expandedSections.indirectSection &&
//                   finalIndirectKeys.map((key) => (
//                     <tr key={key} className="hover:bg-slate-50/40">
//                       {renderDimensionCells(
//                         null,
//                         false,
//                         key,
//                         false,
//                         false,
//                         sectionLabels[key],
//                       )}
//                     </tr>
//                   ))}

//                 {/* Non Operating Section */}
//                 <tr
//                   className="cursor-pointer border-b border-slate-200"
//                   onClick={() => toggleSection("nonOperating")}
//                 >
//                   {renderDimensionCells(
//                     null,
//                     false,
//                     "nonOperating",
//                     false,
//                     true,
//                     sectionLabels.nonOperating,
//                   )}
//                 </tr>
//                 {expandedSections.nonOperating &&
//                   paginatedRollups
//                     .filter((r) => r.section === "nonOperating")
//                     .map((rollupItem) => (
//                       <React.Fragment key={rollupItem.id}>
//                         <tr className="hover:bg-slate-50/50">
//                           {renderDimensionCells(rollupItem, false, null, true)}
//                         </tr>
//                         {expandedProjects[rollupItem.project] &&
//                           rollupItem.children.map((child) => (
//                             <tr key={child.id} className="hover:bg-slate-50/30">
//                               {renderDimensionCells(child, false, null, false)}
//                             </tr>
//                           ))}
//                       </React.Fragment>
//                     ))}

//                 {/* Performance Footprint Terminal Cell */}
//                 <tr className="font-bold border-t border-slate-300">
//                   {renderDimensionCells(
//                     null,
//                     false,
//                     "totalFee",
//                     false,
//                     true,
//                     sectionLabels.totalFee,
//                   )}
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           {/* Time Series Matrix Scrollable Pane */}
//           <div
//             className="w-[55%] overflow-auto custom-scrollbar"
//             ref={rightPaneRef}
//             onScroll={handleScrollSync}
//           >
//             <table className="w-max border-collapse table-fixed">
//               <thead className="sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
//                 <tr className="bg-slate-50 border-b border-slate-200">
//                   {timePeriods.map((p) => {
//                     const isYw = isYellowZone(p, closingPeriod);
//                     return (
//                       <th
//                         key={p}
//                         className={`px-5 py-3 text-right text-[10px] font-bold tracking-wider align-middle border-r border-slate-200/60 ${
//                           isYw
//                             ? "bg-amber-400 text-slate-900"
//                             : "bg-emerald-700 text-white"
//                         }`}
//                         style={{ minWidth: "140px" }}
//                       >
//                         {p}
//                       </th>
//                     );
//                   })}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {/* Revenue Vector Rows */}
//                 <tr className="border-b border-slate-200">
//                   {renderMonthlyCells(
//                     grandRevenueTotal,
//                     "revenueSection",
//                     true,
//                     false,
//                     true,
//                   )}
//                 </tr>
//                 {expandedSections.revenueSection &&
//                   paginatedRollups
//                     .filter((p) => p.section === "revenueSection")
//                     .map((rollupItem) => (
//                       <React.Fragment key={rollupItem.id}>
//                         <tr className="bg-slate-50/10">
//                           {renderMonthlyCells(
//                             rollupItem,
//                             "revenueSection",
//                             true,
//                           )}
//                         </tr>
//                         {expandedProjects[rollupItem.project] &&
//                           rollupItem.children.map((child) => (
//                             <tr key={child.id}>
//                               {renderMonthlyCells(
//                                 child,
//                                 "revenueSection",
//                                 true,
//                               )}
//                             </tr>
//                           ))}
//                       </React.Fragment>
//                     ))}
//                 {/* Revenue Adjustment totals */}
//                 <tr>
//                   {renderMonthlyCells(
//                     grandRevenueAdjustmentTotal,
//                     "revenueAdjustment",
//                     true,
//                     false,
//                     true,
//                   )}
//                 </tr>

//                 {expandedSections.revenueAdjustment &&
//                   paginatedRollups
//                     .filter((r) => r.section === "revenueAdjustment")
//                     .map((rollupItem) => (
//                       <React.Fragment key={rollupItem.id}>
//                         <tr>
//                           {renderMonthlyCells(
//                             rollupItem,
//                             "revenueAdjustment",
//                             true,
//                           )}
//                         </tr>
//                         {expandedProjects[rollupItem.project] &&
//                           rollupItem.children.map((child) => (
//                             <tr key={child.id}>
//                               {renderMonthlyCells(
//                                 child,
//                                 "revenueAdjustment",
//                                 true,
//                               )}
//                             </tr>
//                           ))}
//                       </React.Fragment>
//                     ))}

//                 {/* Cost Vector Rows */}
//                 {displayedSectionKeys.map((sectionKey) => (
//                   <React.Fragment key={sectionKey}>
//                     <tr className="border-b border-slate-200">
//                       {renderMonthlyCells(
//                         sectionTotals[sectionKey],
//                         sectionKey,
//                         false,
//                         false,
//                         true,
//                       )}
//                     </tr>
//                     {expandedSections[sectionKey] &&
//                       paginatedRollups
//                         .filter((r) => r.section === sectionKey)
//                         .map((rollupItem) => (
//                           <React.Fragment key={rollupItem.id}>
//                             <tr className="bg-slate-50/10">
//                               {renderMonthlyCells(rollupItem, sectionKey)}
//                             </tr>
//                             {expandedProjects[rollupItem.project] &&
//                               rollupItem.children.map((child) => (
//                                 <tr key={child.id}>
//                                   {renderMonthlyCells(child, sectionKey)}
//                                 </tr>
//                               ))}
//                           </React.Fragment>
//                         ))}
//                   </React.Fragment>
//                 ))}

//                 {/* Indirect Aggregations Rows */}
//                 <tr className="border-b border-slate-200">
//                   {renderMonthlyCells(
//                     grandIndirectTotal,
//                     "indirectSection",
//                     false,
//                     false,
//                     true,
//                   )}
//                 </tr>
//                 {expandedSections.indirectSection &&
//                   finalIndirectKeys.map((key) => (
//                     <tr key={key}>
//                       {renderMonthlyCells(
//                         grandIndirectComponents[key],
//                         key,
//                         false,
//                         true,
//                       )}
//                     </tr>
//                   ))}

//                 {/* Non Operating Component Rows */}
//                 <tr className="border-b border-slate-200">
//                   {renderMonthlyCells(
//                     sectionTotals["nonOperating"],
//                     "nonOperating",
//                     false,
//                     false,
//                     true,
//                   )}
//                 </tr>
//                 {expandedSections.nonOperating &&
//                   paginatedRollups
//                     .filter((r) => r.section === "nonOperating")
//                     .map((rollupItem) => (
//                       <React.Fragment key={rollupItem.id}>
//                         <tr className="bg-slate-50/10">
//                           {renderMonthlyCells(rollupItem, "nonOperating")}
//                         </tr>
//                         {expandedProjects[rollupItem.project] &&
//                           rollupItem.children.map((child) => (
//                             <tr key={child.id}>
//                               {renderMonthlyCells(child, "nonOperating")}
//                             </tr>
//                           ))}
//                       </React.Fragment>
//                     ))}

//                 {/* Performance Footprint Vector Rows */}
//                 <tr className="font-bold border-t border-slate-300">
//                   {renderMonthlyCells(
//                     grandTotalFee,
//                     "totalFee",
//                     false,
//                     false,
//                     true,
//                   )}
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//       <ToastContainer />
//     </div>
//   );
// };

// export default ForecastReport;

// Deployed Version Above

import React, { useState, useMemo, useRef } from "react";
import {
  FaCaretRight,
  FaPlay,
  FaFileDownload,
  FaPlusSquare,
  FaMinusSquare,
} from "react-icons/fa";
import { backendUrl } from "./config";
import * as XLSX from "xlsx-js-style";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCacheAge } from "../utils/cachedDataTime";
import { RefreshCcw } from "lucide-react";

// Constants and Mappings
const unifiedReportApiPath = "/Forecast/GetSummaryV4"; // V3 Summary API
const forecastApiPath = "/api/ForecastReport/GetForecastView";
const projectsMasterApi = "/Project/GetAllProjects";
const revenueWorkPeriodApi = "/ProjRevWrkPd/filter";
const configApi = "/api/Configuration/GetAllConfigValuesByProject";

const sectionLabels = {
  revenueSection: "Revenue",
  revenueAdjustment: "Revenue Adjustment",
  labor: "Direct Labor",
  travel: "Direct Travel",
  otherDirectCost: "Other Direct Costs",
  subcon: "Direct Subcontractors",
  unallowable: "Unallowable Expense",
  indirectSection: "Indirect",
  fringe: "Fringe Expenses",
  facilities: "Facility Expense",
  overhead: "Overhead Expenses",
  materialHandling: "Material Handling",
  gna: "General & Administrative",
  bp: "B&P Costs",
  ird: "IR&D Costs",
  nonOperating: "Non Operating Expense",
  totalFee: "Total Fee",
};

const displayedSectionKeys = ["labor", "travel", "otherDirectCost", "subcon"];
const indirectKeys = ["fringe", "overhead", "gna", "materialHandling"];

const formatCurrency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount) || amount === 0) return "—";
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  return amount < 0 ? `(${formatted})` : formatted;
};

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString.split("T")[0] || dateString);
  return isNaN(date)
    ? dateString
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
};

const getRollupId = (projId) => {
  if (!projId) return "N/A";
  const match = String(projId).match(/^(\d+)/);
  if (match && match[1]) return match[1];
  return String(projId).split(".")[0] || String(projId);
};

const getPeriodKey = (month, year) => {
  const monthPrefixes = [
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
  return `${monthPrefixes[month - 1]}-${String(year).slice(-2)}`;
};

const isYellowZone = (periodStr, closingPeriod) => {
  if (periodStr === "Total" || !closingPeriod) {
    return false;
  }
  const [monthStr, yearStr] = periodStr.split("-");
  const year = 2000 + parseInt(yearStr);
  const monthIndex =
    [
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
    ].indexOf(monthStr) + 1;

  return (
    year > closingPeriod.year ||
    (year === closingPeriod.year && monthIndex > closingPeriod.month)
  );
};

// --- DYNAMIC SECTION MAPPER ---
const getSectionFromGroupName = (groupName) => {
  if (!groupName) return { section: "excluded" };
  const name = String(groupName).toLowerCase();

  // Revenue
  if (
    name.includes("revenue adjustment") ||
    name.includes("40-02") ||
    name.includes("40.02")
  )
    return { section: "revenueAdjustment" };
  if (
    name.includes("revenue") ||
    name.includes("40-10") ||
    name.includes("40-20")
  )
    return { section: "revenueSection" };

  // Catch Material Handling FIRST so it doesn't get swept into Direct Subcontracts
  if (name.includes("handling") || name.includes("matl handling"))
    return { section: "indirectSection", type: "materialHandling" };

  // Direct Costs
  if (name.includes("subcontract") || name.includes("sub vendor"))
    return { section: "subcon" };
  if (name.includes("labor") && !name.includes("non labor"))
    return { section: "labor" };
  if (name.includes("travel")) return { section: "travel" };
  if (
    name.includes("non labor") ||
    name.includes("other direct") ||
    name.includes("material") ||
    name.includes("materials")
  ) {
    return { section: "otherDirectCost" };
  }

  // Indirect Costs
  if (name.includes("fringe"))
    return { section: "indirectSection", type: "fringe" };
  if (name.includes("overhead"))
    return { section: "indirectSection", type: "overhead" };
  if (name.includes("facility") || name.includes("facilities"))
    return { section: "indirectSection", type: "facilities" };
  if (name.includes("general") || name.includes("g&a") || name.includes("gna"))
    return { section: "indirectSection", type: "gna" };
  if (name.includes("b&p")) return { section: "indirectSection", type: "bp" };
  if (name.includes("ir&d")) return { section: "indirectSection", type: "ird" };

  // Others
  if (
    name.includes("other unallowable") ||
    name.includes("non operating") ||
    name.includes("non-operating") ||
    name.includes("interest") ||
    name.includes("tax") ||
    name.includes("misc income")
  )
    return { section: "nonOperating" };

  if (name.includes("unallowable")) return { section: "unallowable" };
  return { section: "excluded" };
};

const transformData = (
  unifiedReportData,
  forecastData,
  projectsMaster,
  dynamicMonthly,
  flatWorkPeriodData,
  closingPeriod,
) => {
  const aggregatedDataMap = {};
  const projectMetadata = {};

  projectsMaster.forEach((p) => {
    if (p.projectId)
      projectMetadata[p.projectId] = {
        name: p.name || "",
        org: p.orgId || "",
        popStart: p.startDate || "",
        popEnd: p.endDate || "",
      };
  });

  // ==========================================
  // CORE ACTUALS PARSER (Processes ForecastSummaryV3)
  // Extracts data based on top-level Group Name mapping
  // ==========================================
  if (unifiedReportData && Array.isArray(unifiedReportData)) {
    unifiedReportData.forEach((groupNode) => {
      const sectionInfo = getSectionFromGroupName(
        groupNode.name || groupNode.id,
      );

      if (sectionInfo.section === "excluded") return;

      const section = sectionInfo.section;
      const indirectType = sectionInfo.type;

      const isRevenueType =
        section === "revenueSection" || section === "revenueAdjustment";

      if (section === "indirectSection" && indirectType) {
        const rowKey = `indirect-${indirectType}`;
        if (!aggregatedDataMap[rowKey]) {
          aggregatedDataMap[rowKey] = {
            id: rowKey,
            project: "indirect",
            acctId: indirectType,
            org: "",
            accountName: sectionLabels[indirectType] || indirectType,
            projectName: sectionLabels[indirectType] || indirectType,
            section: "indirectSection",
            Total: 0,
            rateType: "A",
            dataSource: "viewData",
          };
        }

        const totals = groupNode.monthlyTotals || {};
        Object.entries(totals).forEach(([periodStr, amount]) => {
          const monthlyAmount = Number(amount || 0);
          if (monthlyAmount === 0) return;

          const [yearStr, monthStr] = periodStr.split("-");
          if (!yearStr || !monthStr) return;

          const year = parseInt(yearStr, 10);
          const month = parseInt(monthStr, 10);
          const periodKey = getPeriodKey(month, year);

          if (!dynamicMonthly.includes(periodKey)) return;
          if (
            closingPeriod &&
            (year > closingPeriod.year ||
              (year === closingPeriod.year && month > closingPeriod.month))
          )
            return;

          aggregatedDataMap[rowKey][`${periodKey}_${indirectType}`] =
            (aggregatedDataMap[rowKey][`${periodKey}_${indirectType}`] || 0) +
            monthlyAmount;
        });

        return;
      }

      if (groupNode.children && Array.isArray(groupNode.children)) {
        groupNode.children.forEach((accountNode) => {
          if (accountNode.type !== "account") return;

          const acctIdStr = String(accountNode.id).trim();
          const acctNameStr = accountNode.name;

          if (accountNode.children && Array.isArray(accountNode.children)) {
            accountNode.children.forEach((projectNode) => {
              if (projectNode.type !== "project") return;

              const projId = projectNode.id || "unknownProject";
              const detailRowKey = `${projId}-${section}-${acctIdStr}`;

              if (!aggregatedDataMap[detailRowKey]) {
                const meta = projectMetadata[projId] || {};
                aggregatedDataMap[detailRowKey] = {
                  id: detailRowKey,
                  project: projId,
                  acctId: acctIdStr,
                  org: meta.org || "",
                  accountName: acctNameStr,
                  projectName: meta.name || projId,
                  popStartDate: meta.popStart || "",
                  popEndDate: meta.popEnd || "",
                  section: section,
                  Total: 0,
                  rateType: "A",
                  dataSource: "viewData",
                };
              }

              const row = aggregatedDataMap[detailRowKey];
              const suffix = isRevenueType ? "_revenue" : "";

              const hasRevenueData =
                projectNode.revenueTotals &&
                Object.values(projectNode.revenueTotals).some(
                  (val) => val !== 0,
                );
              const totals =
                isRevenueType && hasRevenueData
                  ? projectNode.revenueTotals
                  : projectNode.monthlyTotals || {};

              Object.entries(totals).forEach(([periodStr, amount]) => {
                const monthlyAmount = Number(amount || 0);
                if (monthlyAmount === 0) return;

                const [yearStr, monthStr] = periodStr.split("-");
                if (!yearStr || !monthStr) return;

                const year = parseInt(yearStr, 10);
                const month = parseInt(monthStr, 10);
                const periodKey = getPeriodKey(month, year);

                if (!dynamicMonthly.includes(periodKey)) return;
                if (
                  closingPeriod &&
                  (year > closingPeriod.year ||
                    (year === closingPeriod.year &&
                      month > closingPeriod.month))
                )
                  return;

                const adjustedAmount = isRevenueType
                  ? -monthlyAmount
                  : monthlyAmount;

                if (suffix) {
                  row[`${periodKey}${suffix}`] =
                    (row[`${periodKey}${suffix}`] || 0) + adjustedAmount;
                } else {
                  row[periodKey] = (row[periodKey] || 0) + adjustedAmount;
                }
              });
            });
          }
        });
      }
    });
  }

  // ==========================================
  // Process Forecast Data (Future Periods ONLY)
  // Dynamically Mapped via Name
  // ==========================================
  forecastData.forEach((item) => {
    const isBeforeOrEqualCutoff =
      closingPeriod &&
      (item.year < closingPeriod.year ||
        (item.year === closingPeriod.year &&
          item.month <= closingPeriod.month));

    if (isBeforeOrEqualCutoff) return;
    if (!item.acctId) return;

    const periodKey = getPeriodKey(item.month, item.year);

    const indirectForecastMappings = [
      { key: "fringe", amount: Number(item.fringe || 0) },
      { key: "overhead", amount: Number(item.overhead || 0) },
      { key: "gna", amount: Number(item.gna || 0) },
      {
        key: "materialHandling",
        amount: Number(item.mnh || item.materialHandling || 0),
      },
    ];

    indirectForecastMappings.forEach(({ key, amount }) => {
      if (!amount) return;
      const rowKey = `indirect-${key}`;

      if (!aggregatedDataMap[rowKey]) {
        aggregatedDataMap[rowKey] = {
          id: rowKey,
          project: "indirect",
          acctId: key,
          org: "",
          accountName: sectionLabels[key],
          projectName: sectionLabels[key],
          section: "indirectSection",
          Total: 0,
          rateType: "forecast",
          dataSource: "forecast",
        };
      }
      aggregatedDataMap[rowKey][`${periodKey}_${key}`] =
        (aggregatedDataMap[rowKey][`${periodKey}_${key}`] || 0) + amount;
    });

    if (!periodKey || !dynamicMonthly.includes(periodKey)) return;

    const acctIdStr = String(item.acctId || "").trim();
    const id = acctIdStr.replace(/\./g, "-");

    if (id.startsWith("AL-") || id.startsWith("RC-")) return;

    const acctName = item.accountName || item.acctId;
    const sectionInfo = getSectionFromGroupName(acctName);

    let section = sectionInfo.section;
    if (section === "excluded" || section === "generalCosts") {
      if (id.startsWith("40")) section = "revenueSection";
      if (id.startsWith("50-00")) section = "labor";
      if (id.startsWith("50-21") || id.startsWith("50-22")) section = "subcon";
      if (id.startsWith("50-40")) section = "travel";
    }

    const detailRowKey = `${item.projId}-${section}-${acctIdStr}`;

    if (!aggregatedDataMap[detailRowKey]) {
      const meta = projectMetadata[item.projId] || {};
      aggregatedDataMap[detailRowKey] = {
        id: detailRowKey,
        project: item.projId,
        acctId: acctIdStr,
        org: item.orgId || meta.org || "",
        accountName: acctName,
        projectName: item.projName || meta.name || item.projId || "-",
        popStartDate: meta.popStart || "",
        popEndDate: meta.popEnd || "",
        section,
        Total: 0,
        rateType: "forecast",
        dataSource: "forecast",
      };
    }

    const row = aggregatedDataMap[detailRowKey];

    if (
      item.revenue &&
      (section === "revenueSection" || section === "revenueAdjustment")
    ) {
      row[`${periodKey}_revenue`] =
        (row[`${periodKey}_revenue`] || 0) + Number(item.revenue || 0);
    }

    if (displayedSectionKeys.includes(section) || section === "nonOperating") {
      const costAmount = item.cost || 0;
      if (costAmount !== 0) row[periodKey] = (row[periodKey] || 0) + costAmount;
    }
  });

  const finalArray = Object.values(aggregatedDataMap);
  finalArray.forEach((row) => {
    let rowTotal = 0;
    dynamicMonthly.forEach((period) => {
      if (
        row.section === "revenueSection" ||
        row.section === "revenueAdjustment"
      ) {
        rowTotal += row[`${period}_revenue`] || 0;
      } else if (row.section === "indirectSection") {
        const ik = row.acctId;
        rowTotal += row[`${period}_${ik}`] || 0;
      } else {
        rowTotal += row[period] || 0;
      }
    });
    row["Total"] = rowTotal;
  });

  return finalArray.sort((a, b) => (a.dataSource === "viewData" ? -1 : 1));
};

const ForecastReport = () => {
  const [closingPeriod, setClosingPeriod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isReportRun, setIsReportRun] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [timePeriods, setTimePeriods] = useState([]);
  const [monthlyPeriods, setMonthlyPeriods] = useState([]);
  const [rateType, setRateType] = useState("");
  const [cachedAge, setCachedAge] = useState("");

  const leftPaneRef = useRef(null);
  const rightPaneRef = useRef(null);

  const [expandedSections, setExpandedSections] = useState({});
  const [expandedProjects, setExpandedProjects] = useState({});

  const toggleSection = (key) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleProject = (projectId) =>
    setExpandedProjects((prev) => ({ ...prev, [projectId]: !prev[projectId] }));

  const expandAll = () => {
    const allSections = [
      "revenueSection",
      "revenueAdjustment",
      ...displayedSectionKeys,
      "nonOperating",
      "indirectSection",
    ];
    const sectionExp = {};
    allSections.forEach((s) => (sectionExp[s] = true));
    setExpandedSections(sectionExp);
    const projectExp = {};
    apiData.forEach((row) => {
      projectExp[row.project] = true;
    });
    setExpandedProjects(projectExp);
  };

  const collapseAll = () => {
    setExpandedSections({});
    setExpandedProjects({});
  };

  const fetchJsonSafely = async (url, fallback = []) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(
          `HTTP Drop Error on endpoint: ${url}. Status: ${response.status}`,
        );
        return fallback;
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error(`Non-JSON Payload drop on endpoint: ${url}`);
        return fallback;
      }
      return await response.json();
    } catch (e) {
      console.error(`Network Exception handled for endpoint: ${url}`, e);
      return fallback;
    }
  };

  const handleRunReport = async (byPassCache = false) => {
    setLoading(true);
    setIsReportRun(true);
    try {
      const [unifiedReportData, rawForecast, projectsMaster] =
        await Promise.all([
          fetchJsonSafely(
            `${backendUrl}${unifiedReportApiPath}?byPassCache=${byPassCache}`,
          ),
          fetchJsonSafely(`${backendUrl}${forecastApiPath}`),
          fetchJsonSafely(`${backendUrl}${projectsMasterApi}`),
        ]);

      let closingPeriodData = null;
      try {
        const configRes = await fetch(`${backendUrl}${configApi}/xxxxx`);
        if (configRes.ok) {
          const configData = await configRes.json();
          const closingConfig = configData.find(
            (c) => c.name === "closing_period",
          );
          if (closingConfig?.value) {
            const dt = new Date(closingConfig.value);
            closingPeriodData = {
              year: dt.getFullYear(),
              month: dt.getMonth() + 1,
            };
            setClosingPeriod(closingPeriodData);
          }
        }
      } catch (err) {
        console.error("Closing period configuration exception handled", err);
      }

      const forecastData = rawForecast.filter(
        (item) => item.plType === "EAC" || item.plType === "NBBUD",
      );

      const uniqueConfigs = [];
      const seen = new Set();
      forecastData.forEach((item) => {
        const key = `${item.projId}-${item.version}-${item.plId}`;
        if (!seen.has(key)) {
          uniqueConfigs.push({
            projId: item.projId,
            version: item.version,
            plId: item.plId,
          });
          seen.add(key);
        }
      });

      const workPeriodPromises = uniqueConfigs.map((config) =>
        fetch(
          `${backendUrl}${revenueWorkPeriodApi}?projId=${config.projId}&versionNo=${config.version}&bgtType=NBBUD&pl_id=${config.plId}`,
        )
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => []),
      );
      const workPeriodResults = await Promise.all(workPeriodPromises);
      const flatWorkPeriodData = workPeriodResults.flat();

      let minYear = Number.MAX_SAFE_INTEGER;
      let minMonth = Number.MAX_SAFE_INTEGER;
      let maxYear = 0;
      let maxMonth = 0;

      const updateMinMax = (year, month) => {
        if (!year || !month) return;
        if (year < minYear || (year === minYear && month < minMonth)) {
          minYear = year;
          minMonth = month;
        }
        if (year > maxYear || (year === maxYear && month > maxMonth)) {
          maxYear = year;
          maxMonth = month;
        }
      };

      const scanActualsDates = (nodes) => {
        if (!nodes || !Array.isArray(nodes)) return;
        nodes.forEach((node) => {
          if (node.monthlyTotals) {
            Object.keys(node.monthlyTotals).forEach((dateStr) => {
              const [y, m] = dateStr.split("-");
              updateMinMax(parseInt(y, 10), parseInt(m, 10));
            });
          }
          if (node.revenueTotals) {
            Object.keys(node.revenueTotals).forEach((dateStr) => {
              const [y, m] = dateStr.split("-");
              updateMinMax(parseInt(y, 10), parseInt(m, 10));
            });
          }
          if (node.children) scanActualsDates(node.children);
        });
      };

      const summaryDataAge = getCacheAge(unifiedReportData.createdAt);

      setCachedAge(summaryDataAge);

      scanActualsDates(unifiedReportData.data);

      forecastData.forEach((d) => {
        if (
          d.cost !== 0 ||
          d.revenue !== 0 ||
          d.fringe ||
          d.overhead ||
          d.gna ||
          d.mnh
        ) {
          updateMinMax(parseInt(d.year), parseInt(d.month));
        }
      });

      if (minYear < 2026) {
        minYear = 2026;
        minMonth = 1;
      }

      const dynamicMonthly = [];
      const totalMonths = (maxYear - minYear) * 12 + (maxMonth - minMonth + 1);
      const monthsToGenerate = Math.max(totalMonths, 12);

      let currentYear = minYear;
      let currentMonth = minMonth;

      for (let i = 0; i < monthsToGenerate; i++) {
        const key = getPeriodKey(currentMonth, currentYear);
        dynamicMonthly.push(key);
        currentMonth++;
        if (currentMonth > 12) {
          currentMonth = 1;
          currentYear++;
        }
      }

      setMonthlyPeriods(dynamicMonthly);
      setTimePeriods([...dynamicMonthly, "Total"]);

      setApiData(
        transformData(
          unifiedReportData.data,
          forecastData,
          projectsMaster,
          dynamicMonthly,
          flatWorkPeriodData,
          closingPeriodData,
        ),
      );
    } catch (e) {
      console.error("Global core matrix exception tracking managed", e);
      toast.error("Data processing layout sequence execution failed.");
    } finally {
      setLoading(false);
    }
  };

  const filteredByRateType = useMemo(() => {
    return apiData.filter((row) => {
      if (row.rateType === "forecast") return true;
      if (row.section === "revenueSection") return true;
      if (
        row.section === "revenueAdjustment" ||
        row.section === "indirectSection"
      ) {
        return !rateType || row.rateType === rateType;
      }
      return true;
    });
  }, [apiData, rateType]);

  const { paginatedRollups } = useMemo(() => {
    const rollupGroup = {};
    filteredByRateType.forEach((item) => {
      const isTravel = item.section === "travel";
      const rollupId = isTravel ? item.project : getRollupId(item.project);
      let groupKey = `${rollupId}__${item.section}`;

      if (!rollupGroup[groupKey]) {
        rollupGroup[groupKey] = {
          id: groupKey,
          project: rollupId,
          org: item.org || "",
          projectName: item.projectName,
          isRollupParent: true,
          Total: 0,
          section: item.section,
          children: [],
        };
      }
      const parent = rollupGroup[groupKey];

      if (item.section === "travel") {
        const uniqueTravelKey = item.id;
        if (!parent._travelTracker) parent._travelTracker = new Set();
        if (parent._travelTracker.has(uniqueTravelKey)) return;
        parent._travelTracker.add(uniqueTravelKey);
      }

      parent.children.push(item);
      monthlyPeriods.forEach((period) => {
        if (
          item.section === "revenueSection" ||
          item.section === "revenueAdjustment"
        ) {
          parent[`${period}_revenue`] =
            (parent[`${period}_revenue`] || 0) +
            (item[`${period}_revenue`] || item[period] || 0);
        } else if (item.section === "indirectSection") {
          const ik = item.acctId;
          parent[`${period}_${ik}`] =
            (parent[`${period}_${ik}`] || 0) + (item[`${period}_${ik}`] || 0);
        } else {
          parent[period] = (parent[period] || 0) + (item[period] || 0);
        }
      });
    });

    Object.values(rollupGroup).forEach((parent) => {
      let parentTotal = 0;
      monthlyPeriods.forEach((period) => {
        if (
          parent.section === "revenueSection" ||
          parent.section === "revenueAdjustment"
        ) {
          parentTotal += parent[`${period}_revenue`] || 0;
        } else if (parent.section === "indirectSection") {
          indirectKeys.forEach((ik) => {
            parentTotal += parent[`${period}_${ik}`] || 0;
          });
        } else parentTotal += parent[period] || 0;
      });
      parent["Total"] = parentTotal;
    });
    return { paginatedRollups: Object.values(rollupGroup) };
  }, [filteredByRateType, monthlyPeriods]);

  const {
    sectionTotals,
    grandRevenueAdjustmentTotal,
    grandRevenueTotal,
    grandIndirectTotal,
    grandTotalFee,
    grandIndirectComponents,
    finalIndirectKeys,
  } = useMemo(() => {
    const sT = {};
    const gRT = {};
    const gRAT = {};
    const gIT = {};
    const gTF = {};
    const gIC = {};
    const periods = timePeriods;

    displayedSectionKeys.forEach((k) => {
      sT["nonOperating"] = {};
      periods.forEach(
        (p) =>
          (sT["nonOperating"][p] = filteredByRateType
            .filter((r) => r.section === "nonOperating")
            .reduce((acc, r) => acc + (r[p] || 0), 0)),
      );
      sT[k] = {};
      periods.forEach(
        (p) =>
          (sT[k][p] = filteredByRateType
            .filter((r) => r.section === k)
            .reduce((acc, r) => acc + (r[p] || 0), 0)),
      );
    });

    periods.forEach((p) => {
      gRT[p] = filteredByRateType
        .filter((r) => r.section === "revenueSection")
        .reduce((acc, r) => acc + (r[`${p}_revenue`] || r[p] || 0), 0);

      indirectKeys.forEach((ik) => {
        if (!gIC[ik]) gIC[ik] = {};
        gIC[ik][p] = filteredByRateType
          .filter((r) => r.section === "indirectSection")
          .reduce((acc, r) => acc + (r[`${p}_${ik}`] || 0), 0);
      });

      gRAT[p] = filteredByRateType
        .filter((r) => r.section === "revenueAdjustment")
        .reduce((acc, r) => acc + (r[`${p}_revenue`] || r[p] || 0), 0);

      gIT[p] = indirectKeys.reduce((acc, ik) => acc + (gIC[ik][p] || 0), 0);

      gTF[p] =
        gRT[p] +
        (gRAT[p] || 0) -
        (displayedSectionKeys.reduce((acc, k) => acc + (sT[k][p] || 0), 0) +
          gIT[p] +
          (sT["nonOperating"]?.[p] || 0));
    });

    return {
      sectionTotals: sT,
      grandRevenueAdjustmentTotal: gRAT,
      grandRevenueTotal: gRT,
      grandIndirectTotal: gIT,
      grandTotalFee: gTF,
      grandIndirectComponents: gIC,
      finalIndirectKeys: indirectKeys.filter((ik) =>
        periods.some((p) => gIC[ik][p] !== 0),
      ),
    };
  }, [filteredByRateType, timePeriods]);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const borderStyle = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
    const headerStyleBase = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      border: borderStyle,
      alignment: { horizontal: "center" },
    };
    const amountFormat = "$#,##0.00";
    const applyStyles = (ws, rowCount, colCount) => {
      for (let R = 0; R < rowCount; R++) {
        for (let C = 0; C < colCount; C++) {
          const ref = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[ref]) continue;
          ws[ref].s = { border: borderStyle };
          if (R === 0) {
            const cellVal = String(ws[ref].v);
            const isYellow = isYellowZone(cellVal, closingPeriod);
            ws[ref].s = {
              ...headerStyleBase,
              fill: { fgColor: { rgb: isYellow ? "FCD34D" : "059669" } },
              font: {
                ...headerStyleBase.font,
                color: { rgb: isYellow ? "1E293B" : "FFFFFF" },
              },
            };
          }
          if (C === 0) ws[ref].s.font = { bold: true };
          if (C > colCount - timePeriods.length - 1) ws[ref].z = amountFormat;
        }
      }
    };

    const totalRows = [
      ["Category", ...timePeriods],
      ["Total Revenue", ...timePeriods.map((p) => grandRevenueTotal[p])],
      [
        "Revenue Adjustment",
        ...timePeriods.map((p) => grandRevenueAdjustmentTotal[p] || 0),
      ],
    ];
    displayedSectionKeys.forEach((k) =>
      totalRows.push([
        `Total ${sectionLabels[k]}`,
        ...timePeriods.map((p) => sectionTotals[k][p]),
      ]),
    );
    totalRows.push([
      `Total ${sectionLabels["nonOperating"]}`,
      ...timePeriods.map((p) => sectionTotals["nonOperating"]?.[p] || 0),
    ]);
    totalRows.push(
      ["Total Indirects", ...timePeriods.map((p) => grandIndirectTotal[p])],
      ["Grand Total Fee", ...timePeriods.map((p) => grandTotalFee[p])],
    );
    const wsTotal = XLSX.utils.aoa_to_sheet(totalRows);
    applyStyles(wsTotal, totalRows.length, timePeriods.length + 1);
    XLSX.utils.book_append_sheet(wb, wsTotal, "Total Summary");

    const subRows = [["Section", "Project ID", ...timePeriods]];
    [
      "revenueSection",
      "revenueAdjustment",
      ...displayedSectionKeys,
      "indirectSection",
      "nonOperating",
    ].forEach((sec) => {
      const secLabel =
        sec === "indirectSection"
          ? "Total Indirects"
          : sec === "revenueSection"
            ? "Total Revenue"
            : sec === "revenueAdjustment"
              ? "Revenue Adjustment"
              : `Total ${sectionLabels[sec]}`;
      const secSource =
        sec === "indirectSection"
          ? grandIndirectTotal
          : sec === "revenueSection"
            ? grandRevenueTotal
            : sec === "revenueAdjustment"
              ? grandRevenueAdjustmentTotal
              : sectionTotals[sec];

      subRows.push([
        secLabel,
        "Section Total",
        ...timePeriods.map((p) => secSource[p] || 0),
      ]);

      if (sec === "indirectSection") {
        indirectKeys.forEach((ik) => {
          subRows.push([
            sectionLabels[ik],
            "",
            ...timePeriods.map((p) => grandIndirectComponents[ik][p] || 0),
          ]);
        });
      } else {
        paginatedRollups
          .filter((r) => r.section === sec)
          .forEach((r) => {
            subRows.push([
              sectionLabels[r.section] || r.section,
              r.project,
              ...timePeriods.map((p) =>
                p === "Total"
                  ? r["Total"] || 0
                  : r.section === "revenueSection" ||
                      r.section === "revenueAdjustment"
                    ? r[`${p}_revenue`] || 0
                    : r[p] || 0,
              ),
            ]);
          });
      }
      subRows.push([]);
    });
    const wsSub = XLSX.utils.aoa_to_sheet(subRows);
    applyStyles(wsSub, subRows.length, timePeriods.length + 2);
    XLSX.utils.book_append_sheet(wb, wsSub, "Subtotal Sheet");

    const detailRows = [
      [
        "Project",
        "Project Name",
        "Org",
        "Account ID",
        "Account Name",
        ...timePeriods,
      ],
    ];
    filteredByRateType.forEach((r) =>
      detailRows.push([
        r.project,
        r.projectName,
        r.org,
        r.acctId,
        r.accountName,
        ...timePeriods.map((p) =>
          r.section === "revenueSection" || r.section === "revenueAdjustment"
            ? r[`${p}_revenue`] || 0
            : r[p] || 0,
        ),
      ]),
    );
    const wsDet = XLSX.utils.aoa_to_sheet(detailRows);
    applyStyles(wsDet, detailRows.length, timePeriods.length + 5);
    XLSX.utils.book_append_sheet(wb, wsDet, "Detail Report");

    const now = new Date();

    const timestamp =
      `${now.getFullYear()}` +
      `${String(now.getMonth() + 1).padStart(2, "0")}` +
      `${String(now.getDate()).padStart(2, "0")}_` +
      `${String(now.getHours()).padStart(2, "0")}` +
      `${String(now.getMinutes()).padStart(2, "0")}` +
      `${String(now.getSeconds()).padStart(2, "0")}`;

    XLSX.writeFile(wb, `Forecast_Report_${rateType}_${timestamp}.xlsx`);
  };

  const handleScrollSync = (e) => {
    if (e.target === leftPaneRef.current) {
      rightPaneRef.current.scrollTop = e.target.scrollTop;
    } else if (e.target === rightPaneRef.current) {
      leftPaneRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const renderDimensionCells = (
    item,
    isRevenue,
    breakdownKey,
    isRollup = false,
    isHeader = false,
    label = "",
  ) => {
    if (isHeader) {
      const bgClass =
        "bg-emerald-50/60 text-emerald-900 border-b border-r border-slate-200";
      const isExpanded = expandedSections[breakdownKey];

      return (
        <td
          colSpan={dimensionHeaders.length}
          className={`px-4 py-2.5 text-xs font-bold align-middle tracking-wider transition-colors duration-150 ${bgClass}`}
        >
          <div className="flex items-center select-none">
            {breakdownKey !== "totalFee" && (
              <FaCaretRight
                className={`w-3.5 h-3.5 mr-2 transform transition-transform duration-200 text-emerald-700 ${isExpanded ? "rotate-90" : ""}`}
              />
            )}
            {label}
          </div>
        </td>
      );
    }

    let meta = item;
    if (!item && label && breakdownKey) {
      meta = { project: label, accountName: "", projectName: "" };
    }

    return dimensionHeaders.map((h) => {
      let content = meta ? meta[h.key] : "";
      let bgClass = isRollup
        ? "bg-emerald-50/40 font-semibold text-emerald-800"
        : "bg-white text-slate-600";

      if (h.key === "project" && meta?.isRollupParent) {
        return (
          <td
            key={h.key}
            className={`px-4 py-2.5 text-xs border-b border-r border-slate-200 align-middle transition-colors ${bgClass}`}
            onClick={() => toggleProject(meta.project)}
          >
            <div className="flex items-center space-x-1.5 cursor-pointer select-none text-emerald-700 hover:text-emerald-900">
              <FaCaretRight
                className={`w-3 h-3 transform transition-transform duration-150 ${expandedProjects[meta.project] ? "rotate-90" : ""}`}
              />
              <span className="font-bold underline decoration-emerald-200 decoration-2 underline-offset-2">
                {content}
              </span>
            </div>
          </td>
        );
      }
      if (h.key === "popStartDate" || h.key === "popEndDate")
        content = formatDate(content);
      return (
        <td
          key={h.key}
          className={`px-4 py-2.5 text-xs border-b border-r border-slate-200 whitespace-nowrap align-middle ${bgClass} ${h.key === "project" && !isRollup ? "text-emerald-700 font-semibold" : ""}`}
        >
          {content}
        </td>
      );
    });
  };

  const renderMonthlyCells = (
    data,
    key,
    isRev = false,
    isInd = false,
    isSummary = false,
  ) => {
    const suffix = isRev ? "_revenue" : isInd ? `_${key}` : "";

    return timePeriods.map((p) => {
      const val = data[`${p}${suffix}`] || data[p] || 0;
      let cellBg = "bg-white";
      let textClass = "text-slate-700 font-medium";

      if (isSummary) {
        cellBg = "bg-emerald-50/60 text-emerald-950 font-bold";
        textClass = "text-emerald-950";
      } else if (isYellowZone(p, closingPeriod)) {
        cellBg = "bg-amber-50 border-amber-100/60";
        textClass = "text-amber-900 font-semibold";
      } else {
        const isRollupRow = Object.keys(data).includes("isRollupParent");
        if (isRollupRow) cellBg = "bg-emerald-50/40";
      }

      return (
        <td
          key={p}
          className={`px-5 py-2.5 text-xs text-right min-w-[140px] border-b border-r border-slate-200 align-middle transition-colors ${cellBg} ${textClass}`}
        >
          {formatCurrency(val)}
        </td>
      );
    });
  };

  // Re-allocated the 240px width from Start/End dates (120px each)
  // to the Project Name and Account Name headers so the table width matches
  // the 45% flex container, removing white space gap entirely.
  const dimensionHeaders = [
    { key: "project", label: "Project", width: "150px" },
    { key: "projectName", label: "Project Name", width: "320px" },
    { key: "org", label: "Org", width: "100px" },
    { key: "acctId", label: "Account ID", width: "120px" },
    { key: "accountName", label: "Account Name", width: "380px" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-200 p-5 rounded-xl shadow-sm mb-5 gap-4">
        <div>
          <div className="flex gap-3 items-end">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Forecast Report
            </h1>

            <div className="flex items-center gap-2 pt-1">
              {cachedAge && (
                <span className="text-xs text-slate-400 font-medium">
                  Last Refreshed: {cachedAge}
                </span>
              )}
              {isReportRun && (
                <button
                  onClick={() => handleRunReport(true)}
                  disabled={loading}
                  title="Refresh Data"
                  className="text-slate-400 hover:text-emerald-600 transition-colors disabled:opacity-50"
                >
                  <RefreshCcw
                    className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`}
                  />
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-2.5">
            <div className="flex items-center text-xs font-medium text-slate-500">
              <span className="w-3 h-3 bg-emerald-600 rounded-md mr-1.5 shadow-sm shadow-emerald-100"></span>
              Actuals
            </div>
            <div className="flex items-center text-xs font-medium text-slate-500">
              <span className="w-3 h-3 bg-amber-400 rounded-md mr-1.5 shadow-sm shadow-amber-100"></span>
              Forecast
            </div>
            {isReportRun && (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4 ml-1">
                <button
                  onClick={expandAll}
                  className="flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  <FaPlusSquare className="mr-1.5" /> Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="flex items-center text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <FaMinusSquare className="mr-1.5" /> Collapse All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filters and Toolbar Container */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 min-w-[210px] shadow-inner">
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
              Rate Filter:
            </span>
            <select
              value={rateType}
              onChange={(e) => setRateType(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-800 cursor-pointer outline-none"
            >
              <option value="">Select Option</option>
              <option value="A">Actual Rate (A)</option>
              {/* <option value="T">Target Rate (T)</option> */}
            </select>
          </div>

          {isReportRun && (
            <button
              onClick={exportToExcel}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 hover:border-emerald-200 shadow-sm transition-all active:scale-[0.98]"
            >
              <FaFileDownload className="text-slate-400" /> Export Sheet
            </button>
          )}

          <button
            onClick={() => handleRunReport(false)}
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-[0.98] ${
              loading
                ? "bg-slate-200 cursor-not-allowed text-slate-400 shadow-none"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100"
            }`}
          >
            <FaPlay
              className={`w-3.5 h-3.5 ${loading ? "animate-pulse" : ""}`}
            />
            {loading ? "Calculating..." : "Execute View"}
          </button>
        </div>
      </div>

      {/* Main Report View Matrix */}
      {isReportRun && (
        <div className="flex w-full border border-slate-200 rounded-xl bg-white max-h-[72vh] overflow-hidden shadow-md">
          {/* Frozen Dimensions Section */}
          <div
            className="w-[45%] overflow-auto border-r-4 border-slate-300 custom-scrollbar select-none"
            ref={leftPaneRef}
            onScroll={handleScrollSync}
          >
            <table className="w-max border-collapse table-fixed">
              <thead className="sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <tr className="bg-emerald-700 text-white border-b border-emerald-800">
                  {dimensionHeaders.map((h) => (
                    <th
                      key={h.key}
                      className="px-4 py-3 text-left text-[10px] font-bold tracking-wider align-middle"
                      style={{ width: h.width }}
                    >
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Revenue Structural Module */}
                <tr
                  className="cursor-pointer border-b border-slate-200"
                  onClick={() => toggleSection("revenueSection")}
                >
                  {renderDimensionCells(
                    null,
                    false,
                    "revenueSection",
                    false,
                    true,
                    sectionLabels.revenueSection,
                  )}
                </tr>
                {expandedSections.revenueSection &&
                  paginatedRollups
                    .filter((p) => p.section === "revenueSection")
                    .map((rollupItem) => (
                      <React.Fragment key={rollupItem.id}>
                        <tr className="hover:bg-slate-50/50">
                          {renderDimensionCells(rollupItem, true, null, true)}
                        </tr>
                        {expandedProjects[rollupItem.project] &&
                          rollupItem.children.map((child) => (
                            <tr key={child.id} className="hover:bg-slate-50/30">
                              {renderDimensionCells(child, true, null, false)}
                            </tr>
                          ))}
                      </React.Fragment>
                    ))}

                {/* Revenue Adjustment */}
                <tr onClick={() => toggleSection("revenueAdjustment")}>
                  {renderDimensionCells(
                    null,
                    false,
                    "revenueAdjustment",
                    false,
                    true,
                    sectionLabels.revenueAdjustment,
                  )}
                </tr>

                {expandedSections.revenueAdjustment &&
                  paginatedRollups
                    .filter((p) => p.section === "revenueAdjustment")
                    .map((rollupItem) => (
                      <React.Fragment key={rollupItem.id}>
                        <tr>{renderDimensionCells(rollupItem)}</tr>
                        {expandedProjects[rollupItem.project] &&
                          rollupItem.children.map((child) => (
                            <tr key={child.id}>
                              {renderDimensionCells(child)}
                            </tr>
                          ))}
                      </React.Fragment>
                    ))}

                {/* Direct Costs Modules */}
                {displayedSectionKeys.map((sectionKey) => (
                  <React.Fragment key={sectionKey}>
                    <tr
                      className="cursor-pointer border-b border-slate-200"
                      onClick={() => toggleSection(sectionKey)}
                    >
                      {renderDimensionCells(
                        null,
                        false,
                        sectionKey,
                        false,
                        true,
                        sectionLabels[sectionKey],
                      )}
                    </tr>
                    {expandedSections[sectionKey] &&
                      paginatedRollups
                        .filter((r) => r.section === sectionKey)
                        .map((rollupItem) => (
                          <React.Fragment key={rollupItem.id}>
                            <tr className="hover:bg-slate-50/50">
                              {renderDimensionCells(
                                rollupItem,
                                false,
                                null,
                                true,
                              )}
                            </tr>
                            {expandedProjects[rollupItem.project] &&
                              rollupItem.children.map((child) => (
                                <tr
                                  key={child.id}
                                  className="hover:bg-slate-50/30"
                                >
                                  {renderDimensionCells(
                                    child,
                                    false,
                                    null,
                                    false,
                                  )}
                                </tr>
                              ))}
                          </React.Fragment>
                        ))}
                  </React.Fragment>
                ))}

                {/* Indirect Cost Structure Pool */}
                <tr
                  className="cursor-pointer border-b border-slate-200"
                  onClick={() => toggleSection("indirectSection")}
                >
                  {renderDimensionCells(
                    null,
                    false,
                    "indirectSection",
                    false,
                    true,
                    sectionLabels.indirectSection,
                  )}
                </tr>
                {expandedSections.indirectSection &&
                  finalIndirectKeys.map((key) => (
                    <tr key={key} className="hover:bg-slate-50/40">
                      {renderDimensionCells(
                        null,
                        false,
                        key,
                        false,
                        false,
                        sectionLabels[key],
                      )}
                    </tr>
                  ))}

                {/* Non Operating Section */}
                <tr
                  className="cursor-pointer border-b border-slate-200"
                  onClick={() => toggleSection("nonOperating")}
                >
                  {renderDimensionCells(
                    null,
                    false,
                    "nonOperating",
                    false,
                    true,
                    sectionLabels.nonOperating,
                  )}
                </tr>
                {expandedSections.nonOperating &&
                  paginatedRollups
                    .filter((r) => r.section === "nonOperating")
                    .map((rollupItem) => (
                      <React.Fragment key={rollupItem.id}>
                        <tr className="hover:bg-slate-50/50">
                          {renderDimensionCells(rollupItem, false, null, true)}
                        </tr>
                        {expandedProjects[rollupItem.project] &&
                          rollupItem.children.map((child) => (
                            <tr key={child.id} className="hover:bg-slate-50/30">
                              {renderDimensionCells(child, false, null, false)}
                            </tr>
                          ))}
                      </React.Fragment>
                    ))}

                {/* Performance Footprint Terminal Cell */}
                <tr className="font-bold border-t border-slate-300">
                  {renderDimensionCells(
                    null,
                    false,
                    "totalFee",
                    false,
                    true,
                    sectionLabels.totalFee,
                  )}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Time Series Matrix Scrollable Pane */}
          <div
            className="w-[55%] overflow-auto custom-scrollbar"
            ref={rightPaneRef}
            onScroll={handleScrollSync}
          >
            <table className="w-max border-collapse table-fixed">
              <thead className="sticky top-0 z-20 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <tr className="bg-slate-50 border-b border-slate-200">
                  {timePeriods.map((p) => {
                    const isYw = isYellowZone(p, closingPeriod);
                    return (
                      <th
                        key={p}
                        className={`px-5 py-3 text-right text-[10px] font-bold tracking-wider align-middle border-r border-slate-200/60 ${
                          isYw
                            ? "bg-amber-400 text-slate-900"
                            : "bg-emerald-700 text-white"
                        }`}
                        style={{ minWidth: "140px" }}
                      >
                        {p}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Revenue Vector Rows */}
                <tr className="border-b border-slate-200">
                  {renderMonthlyCells(
                    grandRevenueTotal,
                    "revenueSection",
                    true,
                    false,
                    true,
                  )}
                </tr>
                {expandedSections.revenueSection &&
                  paginatedRollups
                    .filter((p) => p.section === "revenueSection")
                    .map((rollupItem) => (
                      <React.Fragment key={rollupItem.id}>
                        <tr className="bg-slate-50/10">
                          {renderMonthlyCells(
                            rollupItem,
                            "revenueSection",
                            true,
                          )}
                        </tr>
                        {expandedProjects[rollupItem.project] &&
                          rollupItem.children.map((child) => (
                            <tr key={child.id}>
                              {renderMonthlyCells(
                                child,
                                "revenueSection",
                                true,
                              )}
                            </tr>
                          ))}
                      </React.Fragment>
                    ))}
                {/* Revenue Adjustment totals */}
                <tr>
                  {renderMonthlyCells(
                    grandRevenueAdjustmentTotal,
                    "revenueAdjustment",
                    true,
                    false,
                    true,
                  )}
                </tr>

                {expandedSections.revenueAdjustment &&
                  paginatedRollups
                    .filter((r) => r.section === "revenueAdjustment")
                    .map((rollupItem) => (
                      <React.Fragment key={rollupItem.id}>
                        <tr>
                          {renderMonthlyCells(
                            rollupItem,
                            "revenueAdjustment",
                            true,
                          )}
                        </tr>
                        {expandedProjects[rollupItem.project] &&
                          rollupItem.children.map((child) => (
                            <tr key={child.id}>
                              {renderMonthlyCells(
                                child,
                                "revenueAdjustment",
                                true,
                              )}
                            </tr>
                          ))}
                      </React.Fragment>
                    ))}

                {/* Cost Vector Rows */}
                {displayedSectionKeys.map((sectionKey) => (
                  <React.Fragment key={sectionKey}>
                    <tr className="border-b border-slate-200">
                      {renderMonthlyCells(
                        sectionTotals[sectionKey],
                        sectionKey,
                        false,
                        false,
                        true,
                      )}
                    </tr>
                    {expandedSections[sectionKey] &&
                      paginatedRollups
                        .filter((r) => r.section === sectionKey)
                        .map((rollupItem) => (
                          <React.Fragment key={rollupItem.id}>
                            <tr className="bg-slate-50/10">
                              {renderMonthlyCells(rollupItem, sectionKey)}
                            </tr>
                            {expandedProjects[rollupItem.project] &&
                              rollupItem.children.map((child) => (
                                <tr key={child.id}>
                                  {renderMonthlyCells(child, sectionKey)}
                                </tr>
                              ))}
                          </React.Fragment>
                        ))}
                  </React.Fragment>
                ))}

                {/* Indirect Aggregations Rows */}
                <tr className="border-b border-slate-200">
                  {renderMonthlyCells(
                    grandIndirectTotal,
                    "indirectSection",
                    false,
                    false,
                    true,
                  )}
                </tr>
                {expandedSections.indirectSection &&
                  finalIndirectKeys.map((key) => (
                    <tr key={key}>
                      {renderMonthlyCells(
                        grandIndirectComponents[key],
                        key,
                        false,
                        true,
                      )}
                    </tr>
                  ))}

                {/* Non Operating Component Rows */}
                <tr className="border-b border-slate-200">
                  {renderMonthlyCells(
                    sectionTotals["nonOperating"],
                    "nonOperating",
                    false,
                    false,
                    true,
                  )}
                </tr>
                {expandedSections.nonOperating &&
                  paginatedRollups
                    .filter((r) => r.section === "nonOperating")
                    .map((rollupItem) => (
                      <React.Fragment key={rollupItem.id}>
                        <tr className="bg-slate-50/10">
                          {renderMonthlyCells(rollupItem, "nonOperating")}
                        </tr>
                        {expandedProjects[rollupItem.project] &&
                          rollupItem.children.map((child) => (
                            <tr key={child.id}>
                              {renderMonthlyCells(child, "nonOperating")}
                            </tr>
                          ))}
                      </React.Fragment>
                    ))}

                {/* Performance Footprint Vector Rows */}
                <tr className="font-bold border-t border-slate-300">
                  {renderMonthlyCells(
                    grandTotalFee,
                    "totalFee",
                    false,
                    false,
                    true,
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ForecastReport;
