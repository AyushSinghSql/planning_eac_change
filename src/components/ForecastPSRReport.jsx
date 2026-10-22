// import React, { useState, useMemo, useCallback, useEffect } from "react";
// import axios from "axios";
// import { backendUrl } from "./config";
// import { exportReportToExcel, exportReportToPdf } from "./ReportExport";
// import { FaFileExcel, FaFilePdf } from "react-icons/fa";
// import {
//   FaChartLine,
//   FaLayerGroup,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaSitemap,
//   FaCheckSquare,
//   FaSquare,
//   FaSync,
//   FaPlus,
//   FaMinus,
//   FaCalendarCheck,
// } from "react-icons/fa";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import { getCacheAge } from "../utils/cachedDataTime";

// // ─── Constants ───────────────────────────────────────────────────────────────

// // const SUMMARY_API_PATH = "/Forecast/GetSummaryTrend";
// const SUMMARY_API_PATH = "/Forecast/GetSummaryV4";
// const CONFIG_API_PATH = "/api/Configuration/GetAllConfigValuesByProject";

// // NEW: the "all projects, latest version per BUD/EAC" endpoint we built.
// // TODO: confirm the actual controller route — this assumes it lives under
// // the same "Forecast" controller as SUMMARY_API_PATH. Adjust if not.
// const PROJECT_MONTHLY_API_PATH = "/Forecast/GetMonthlyDataAllProjectsV1";

// // const INDIRECT_PREFIXES = ["60", "62", "70", "78", "80", "82", "83", "84"];
// const INDIRECT_PREFIXES = [
//   "60",
//   "62",
//   "70",
//   "78",
//   "80",
//   "82",
//   "83",
//   "84",
//   "89",
//   "90",
//   "AL",
// ];
// const INDIRECT_PREFIXES_NAME = [
//   "Fringe Benefits",
//   "Overhead",
//   "General & Administrative",
//   "Subcontract & Matl Handling",
//   "Misc Income/(Expenses)",
//   "Interest Expense",
//   "Other Unallowable Expense",
//   "Income Taxes",
//   "Allocations",
// ];

// const MONTHS = [
//   { id: 1, name: "Jan", key: "01" },
//   { id: 2, name: "Feb", key: "02" },
//   { id: 3, name: "Mar", key: "03" },
//   { id: 4, name: "Apr", key: "04" },
//   { id: 5, name: "May", key: "05" },
//   { id: 6, name: "Jun", key: "06" },
//   { id: 7, name: "Jul", key: "07" },
//   { id: 8, name: "Aug", key: "08" },
//   { id: 9, name: "Sep", key: "09" },
//   { id: 10, name: "Oct", key: "10" },
//   { id: 11, name: "Nov", key: "11" },
//   { id: 12, name: "Dec", key: "12" },
// ];

// // ─── Helpers ─────────────────────────────────────────────────────────────────

// /**
//  * Safely get monthly amount for a given year/monthKey from a totals object.
//  * e.g. getAmt(node.monthlyTotals, "2026", "03") => number
//  */
// const getAmt = (totals, year, monthKey) =>
//   Number((totals || {})[`${year}-${monthKey}`] || 0);

// /**
//  * Flatten all children from a node (array or dict).
//  */
// const getChildren = (node) => {
//   if (!node) return [];
//   const ch = node.children;
//   if (!ch) return [];
//   if (Array.isArray(ch)) return ch;
//   if (typeof ch === "object") return Object.values(ch);
//   return [];
// };

// /**
//  * Recursively collect all project-level nodes under a given root node.
//  * Used to collect projects for a selected top-level project filter.
//  */
// const collectProjects = (node, acc = []) => {
//   if (!node) return acc;
//   if (node.type === "project") acc.push(node);
//   getChildren(node).forEach((c) => collectProjects(c, acc));
//   return acc;
// };

// /**
//  * Returns true if accountId starts with any indirect prefix.
//  */
// const isIndirect = (id) =>
//   INDIRECT_PREFIXES.some((p) => (id || "").startsWith(p));

// const isIndirectname = (id) => INDIRECT_PREFIXES_NAME.some((p) => id === p);

// /**
//  * Returns true if a node is ODC (account 50.24.x).
//  */
// const isODC = (id) => (id || "").startsWith("50.24");

// // ─── Core calculation ─────────────────────────────────────────────────────────

// /**
//  * Walk the full API tree and sum up the five line items per month.
//  *
//  * Logic per group node:
//  *   Revenue   → group id == "40.01"  → use revenueTotals
//  *   Labor     → group id == "50.01"  → monthlyTotals
//  *   ODC       → group id == "50.2", account starting with 50.24 → monthlyTotals
//  *   Indirect  → group id starts with one of INDIRECT_PREFIXES → monthlyTotals
//  *
//  * When selectedProjectIds is non-null (filtered mode) we only count amounts
//  * that belong to the selected projects (project-type children match).
//  *
//  * When selectedProjectIds is null (All mode) we take the group-level totals
//  * directly (fastest — no recursion needed for amounts).
//  */
// const computeTotals = (trendData, year, selectedProjectIds) => {
//   const blank = () => Object.fromEntries(MONTHS.map((m) => [m.name, 0]));

//   const out = {
//     rev: blank(),
//     labor: blank(),
//     nonLabor: blank(),
//     odc: blank(),
//     unallowable: blank(),
//     nonOpps: blank(),
//     indirect: blank(),
//   };

//   if (!trendData || trendData.length === 0) return out;

//   const allMode = selectedProjectIds === null; // show everything

//   trendData.forEach((group) => {
//     const gid = (group.id || "").toString();
//     const gidName = (group.name || "").toString();
//     // ── REVENUE ──────────────────────────────────────────────────────
//     // if (gid === "40-10-01") {
//     if (gidName === "Contracts Revenue") {
//       console.log(group);
//       if (allMode) {
//         MONTHS.forEach((m) => {
//           out.rev[m.name] += getAmt(group.monthlyTotals, year, m.key) * -1;
//         });
//       } else {
//         // Sum only selected project children
//         getChildren(group).forEach((projNode) => {
//           if (selectedProjectIds.has(projNode.id)) {
//             MONTHS.forEach((m) => {
//               out.rev[m.name] +=
//                 getAmt(projNode.monthlyTotals, year, m.key) * -1;
//             });
//           }
//         });
//       }
//       return;
//     }

//     // ── DIRECT LABOR ─────────────────────────────────────────────────
//     // if (gid === "50-00-02") {
//     if (gidName === "Direct Labor") {
//       if (allMode) {
//         MONTHS.forEach((m) => {
//           out.labor[m.name] += getAmt(group.monthlyTotals, year, m.key);
//         });
//       } else {
//         // account → project → employee; sum matching projects
//         getChildren(group).forEach((acct) => {
//           getChildren(acct).forEach((proj) => {
//             if (selectedProjectIds.has(proj.id)) {
//               MONTHS.forEach((m) => {
//                 out.labor[m.name] += getAmt(proj.monthlyTotals, year, m.key);
//               });
//             }
//           });
//         });
//       }
//       return;
//     }

//     // ── DIRECT LABOR ─────────────────────────────────────────────────
//     // if (gid === "50.2") {
//     //   if (allMode) {
//     //     MONTHS.forEach((m) => {
//     //       out.nonLabor[m.name] += getAmt(group.monthlyTotals, year, m.key);
//     //     });
//     //   } else {
//     //     // account → project → employee; sum matching projects
//     //     getChildren(group).forEach((acct) => {
//     //       getChildren(acct).forEach((proj) => {
//     //         if (selectedProjectIds.has(proj.id)) {
//     //           MONTHS.forEach((m) => {
//     //             out.nonLabor[m.name] += getAmt(proj.monthlyTotals, year, m.key);
//     //           });
//     //         }
//     //       });
//     //     });
//     //   }

//     //   getChildren(group).forEach((acct) => {
//     //     if (!isODC(acct.id)) return; // only 50.24.x accounts
//     //     if (allMode) {
//     //       MONTHS.forEach((m) => {
//     //         out.odc[m.name] += getAmt(acct.monthlyTotals, year, m.key);
//     //       });
//     //     } else {
//     //       getChildren(acct).forEach((proj) => {
//     //         if (selectedProjectIds.has(proj.id)) {
//     //           MONTHS.forEach((m) => {
//     //             out.odc[m.name] += getAmt(proj.monthlyTotals, year, m.key);
//     //           });
//     //         }
//     //       });
//     //     }
//     //   });

//     //   return;
//     // }
//     // ── DIRECT LABOR ─────────────────────────────────────────────────
//     if (gidName === "Other Direct Costs") {
//       getChildren(group).forEach((acct) => {
//         // if (!isODC(acct.id)) return;
//         if (allMode) {
//           MONTHS.forEach((m) => {
//             out.odc[m.name] += getAmt(acct.monthlyTotals, year, m.key);
//           });
//         } else {
//           getChildren(acct).forEach((proj) => {
//             if (selectedProjectIds.has(proj.id)) {
//               MONTHS.forEach((m) => {
//                 out.odc[m.name] += getAmt(proj.monthlyTotals, year, m.key);
//               });
//             }
//           });
//         }
//       });

//       return;
//     }

//     if (gid === "90") {
//       if (allMode) {
//         MONTHS.forEach((m) => {
//           out.unallowable[m.name] += getAmt(group.monthlyTotals, year, m.key);
//         });
//       } else {
//         // account → project → employee; sum matching projects
//         getChildren(group).forEach((acct) => {
//           getChildren(acct).forEach((proj) => {
//             if (selectedProjectIds.has(proj.id)) {
//               MONTHS.forEach((m) => {
//                 out.unallowable[m.name] += getAmt(
//                   proj.monthlyTotals,
//                   year,
//                   m.key,
//                 );
//               });
//             }
//           });
//         });
//       }
//       return;
//     }

//     if (gid === "95") {
//       if (allMode) {
//         MONTHS.forEach((m) => {
//           out.nonOpps[m.name] += getAmt(group.monthlyTotals, year, m.key);
//         });
//       } else {
//         // account → project → employee; sum matching projects
//         getChildren(group).forEach((acct) => {
//           getChildren(acct).forEach((proj) => {
//             if (selectedProjectIds.has(proj.id)) {
//               MONTHS.forEach((m) => {
//                 out.nonOpps[m.name] += getAmt(proj.monthlyTotals, year, m.key);
//               });
//             }
//           });
//         });
//       }
//       return;
//     }

//     // ── DIRECT NON-LABOR (ODC only: 50.24.x) ─────────────────────────
//     // if (gid === "50.2") {
//     //   getChildren(group).forEach((acct) => {
//     //     if (!isODC(acct.id)) return; // only 50.24.x accounts
//     //     if (allMode) {
//     //       MONTHS.forEach((m) => {
//     //         out.odc[m.name] += getAmt(acct.monthlyTotals, year, m.key);
//     //       });
//     //     } else {
//     //       getChildren(acct).forEach((proj) => {
//     //         if (selectedProjectIds.has(proj.id)) {
//     //           MONTHS.forEach((m) => {
//     //             out.odc[m.name] += getAmt(proj.monthlyTotals, year, m.key);
//     //           });
//     //         }
//     //       });
//     //     }
//     //   });
//     //   return;
//     // }

//     // ── INDIRECT ─────────────────────────────────────────────────────
//     // if (isIndirect(gid)) {
//     if (isIndirectname(gidName)) {
//       if (allMode) {
//         MONTHS.forEach((m) => {
//           out.indirect[m.name] += getAmt(group.monthlyTotals, year, m.key);
//         });
//       } else {
//         // account → project; sum matching projects
//         getChildren(group).forEach((acct) => {
//           getChildren(acct).forEach((proj) => {
//             if (selectedProjectIds.has(proj.id)) {
//               MONTHS.forEach((m) => {
//                 out.indirect[m.name] += getAmt(proj.monthlyTotals, year, m.key);
//               });
//             }
//           });
//         });
//       }
//     }
//   });

//   return out;
// };

// // ─── Row component ────────────────────────────────────────────────────────────

// const Row = ({ label, values, isBold, bg, color }) => {
//   const total = values.reduce((a, b) => a + (Number(b) || 0), 0);
//   return (
//     <tr
//       className={`${bg || ""} hover:bg-slate-50 transition-colors ${
//         isBold
//           ? `font-semibold ${color || "text-slate-900"}`
//           : "text-slate-500 font-medium"
//       }`}
//     >
//       <td
//         className={`sticky-col text-[12px] pr-1 border-r border-slate-100 ${bg || "bg-white"}`}
//       >
//         {label}
//       </td>
//       {values.map((v, i) => (
//         <td key={i} className="month-cell tabular-nums text-[12px]">
//           {v === 0
//             ? "—"
//             : v.toLocaleString(undefined, {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2,
//               })}
//         </td>
//       ))}
//       <td
//         className={`total-cell tabular-nums text-[12px] ${
//           isBold ? color || "text-slate-900" : "text-slate-700"
//         }`}
//       >
//         {total.toLocaleString(undefined, {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         })}
//       </td>
//     </tr>
//   );
// };

// // ─── Main component ───────────────────────────────────────────────────────────

// const ForecastPSRReport = () => {
//   // ── State ──────────────────────────────────────────────────────────────────
//   const [trendData, setTrendData] = useState([]);
//   const [closingPeriodDate, setClosingPeriodDate] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // NEW: raw response from the all-projects (BUD/EAC, latest version) API.
//   // Each item looks like:
//   // { projId, plId, planType, monthlyData: [{ year, month, laborCost, nonLaborCost, hours, indirectCost: [{name, value}] }] }
//   const [projectIndirectData, setProjectIndirectData] = useState([]);

//   // Filters
//   const [fiscalYear, setFiscalYear] = useState("2026");
//   const [planType, setPlanType] = useState(""); // "" = All(Actual), "EAC", "BUD"
//   const [depthLevel, setDepthLevel] = useState(1); // numeric depth of project ID

//   // Project filter (only relevant when planType is not "")
//   const [topLevelFilter, setTopLevelFilter] = useState(""); // prefix filter
//   const [searchTerm, setSearchTerm] = useState("All Projects");
//   const [showDropdown, setShowDropdown] = useState(false);

//   // Peer selection (only when planType != "")
//   const [selectedPeers, setSelectedPeers] = useState([]);
//   const [innerSearch, setInnerSearch] = useState("");
//   const [showAllPeers, setShowAllPeers] = useState(false);

//   const [isExporting, setIsExporting] = useState(false);

//   const [cachedAge, setCachedAge] = useState("");

//   const [filterProject, setFilterProject] = useState([])

//   // ── Data fetching ──────────────────────────────────────────────────────────

//   const handleExportExcel = async () => {
//     setIsExporting(true);
//     try {
//       await exportReportToExcel({
//         trendData,
//         projectIndirectData,
//         year: fiscalYear,
//       });
//     } catch (err) {
//       console.error("Excel export failed:", err);
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   const handleExportPdf = () => {
//     setIsExporting(true);
//     try {
//       exportReportToPdf({ trendData, projectIndirectData, year: fiscalYear });
//     } catch (err) {
//       console.error("PDF export failed:", err);
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   const fetchAll = useCallback(async (byPassCache = false) => {
//     setLoading(true);
//     try {
//       const [summaryRes, configRes, projectIndirectRes] = await Promise.all([
//         axios.get(`${backendUrl}${SUMMARY_API_PATH}?byPassCache=${byPassCache}`),
//         axios.get(`${backendUrl}${CONFIG_API_PATH}/xxxxx`),
//         axios.get(`${backendUrl}${PROJECT_MONTHLY_API_PATH}?byPassCache=${byPassCache}`),
//       ]);

//       const summaryDataAge = getCacheAge(summaryRes.data.createdAt);

//       setCachedAge(summaryDataAge);

//       if (Array.isArray(summaryRes.data.data))
//         setTrendData(summaryRes.data.data);

//       if (Array.isArray(configRes.data)) {
//         const item = configRes.data.find((c) => c.name === "closing_period");
//         if (item?.value) {
//           const [y, mo, d] = item.value.split("-").map(Number);
//           setClosingPeriodDate(new Date(y, mo - 1, d));
//         }
//       }

//       if (Array.isArray(projectIndirectRes.data)) {
//         setProjectIndirectData(projectIndirectRes.data);
//       }
//     } catch (err) {
//       console.error("ForecastPSRReport fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAll();
//   }, [fetchAll]);

//   const potentialPeers = useMemo(() => {
//     if (planType === "") return []; // All mode — no peer selection needed
//     const revenueGroup = trendData.find((n) => n.id === "40-10-01");
//     if (!revenueGroup) return [];

//     const ids = new Set();
//     const extractIds = (node, depth = 0) => {
//       if (!node) return;
//       const nodeId = (node.id || "").toString().trim();
//       const segments = nodeId.split(".").length;

//       // Only collect at the target depth level
//       if (segments === depthLevel) {
//         const matchesTop = !topLevelFilter || nodeId.startsWith(topLevelFilter);
//         if (matchesTop) ids.add(nodeId);
//         return; // don't go deeper once we hit target depth
//       }
//       getChildren(node).forEach((c) => extractIds(c, depth + 1));
//     };

//     // Revenue children are project nodes
//     getChildren(revenueGroup).forEach((projNode) => extractIds(projNode));
//     return Array.from(ids).sort();
//   }, [trendData, planType, depthLevel, topLevelFilter]);

//   // Sync selection when available peers change
//   useEffect(() => {
//     setSelectedPeers([...potentialPeers]);
//   }, [potentialPeers]);

//   // ── Derived: set of selected project IDs passed to computeTotals ─────────
//   //
//   // null  → All mode  (computeTotals uses group-level totals directly)
//   // Set   → Filtered mode (computeTotals filters to matching project nodes)

//   const selectedProjectIds = useMemo(() => {
//     if (planType === "") return null; // All — no filter
//     if (selectedPeers.length === 0) return new Set();
//     return new Set(selectedPeers);
//   }, [planType, selectedPeers]);

//   // ── Core numbers ──────────────────────────────────────────────────────────

//   const totals = useMemo(
//     () => computeTotals(trendData, fiscalYear, selectedProjectIds),
//     [trendData, fiscalYear, selectedProjectIds],
//   );

//   // useEffect(() => {
//   //   const filteredProject = projectIndirectData?.filter((proj) => proj.planType.toUpperCase() === planType.toUpperCase() )
//   //   setFilterProject(filteredProject)
//   // }, [planType])

//   // console.log(filterProject)

//   // NEW: Labor / Non-Labor / Indirect sourced from the all-projects API for
//   // BUD/EAC mode.
//   //
//   // - Only runs when a plan type (BUD/EAC) is selected — Actual mode keeps
//   //   using totals.labor / totals.nonLabor / totals.indirect from the
//   //   existing tree, untouched.
//   // - The all-projects API only returns data at the WHOLE-PROJECT level
//   //   (projId like "1001_GSA_NIA_ADSP"). But the peer panel can select nodes
//   //   at deeper levels (e.g. "1001_GSA_NIA_ADSP.1.1.2" at Level 3/4). So we
//   //   reduce every selected id down to its root project id (everything
//   //   before the first ".") and dedupe, so selecting multiple sub-nodes of
//   //   the same project doesn't double-count that project's numbers.
//   // - laborCost / nonLaborCost come straight off each monthlyData entry.
//   //   indirect is the sum of Overhead + Fringe + G&A (all indirectCost
//   //   entries) per month, across every matching project.
//   const projectApiTotals = useMemo(() => {
//     const blank = () => Object.fromEntries(MONTHS.map((m) => [m.name, 0]));
//     const empty = { labor: blank(), nonLabor: blank(), indirect: blank() };

//     if (planType === "") return empty; // Actual mode untouched
//     if (!projectIndirectData || projectIndirectData.length === 0) return empty;
//     if (!selectedProjectIds || selectedProjectIds.size === 0) return empty;

//     // Reduce selected node ids down to their root project id and dedupe.
//     const selectedRootProjectIds = new Set(
//       [...selectedProjectIds].map((id) => id.split(".")[0]),
//     );

//     const out = { labor: blank(), nonLabor: blank(), indirect: blank() };

//     projectIndirectData
//       .filter(
//         (proj) =>
//           (proj.planType || "").toUpperCase() === planType.toUpperCase(),
//       )
//       .filter((proj) => selectedRootProjectIds.has(proj.projId))
//       .forEach((proj) => {
//         (proj.monthlyData || []).forEach((md) => {
//           if (Number(md.year) !== Number(fiscalYear)) return;
//           const monthDef = MONTHS.find((m) => m.id === md.month);
//           if (!monthDef) return;

//           out.labor[monthDef.name] += Number(md.laborCost) || 0;
//           out.nonLabor[monthDef.name] += Number(md.nonLaborCost) || 0;

//           const monthIndirectSum = (md.indirectCost || []).reduce(
//             (sum, ic) => sum + (Number(ic.value) || 0),
//             0,
//           );
//           out.indirect[monthDef.name] += monthIndirectSum;
//         });
//       });

//     return out;
//   }, [projectIndirectData, planType, selectedProjectIds, fiscalYear]);

//   const monthNames = MONTHS.map((m) => m.name);

//   const revenueValues = monthNames.map((m) => totals.rev[m]);
//   // Labor / Non-Labor / Indirect: Actual mode uses the existing tree totals
//   // (untouched). BUD/EAC mode uses the new all-projects API, summed for
//   // selected projects.
//   const laborValues = monthNames.map((m) =>
//     planType === "" ? totals.labor[m] : projectApiTotals.labor[m],
//   );
//   const nonLaborValues = monthNames.map((m) =>
//     planType === "" ? totals.nonLabor[m] : projectApiTotals.nonLabor[m],
//   );
//   const odcValues = monthNames.map((m) => totals.odc[m]);
//   const directValues = monthNames.map(
//     (m, i) => laborValues[i] + nonLaborValues[i],
//   );
//   const indirectValues = monthNames.map((m) =>
//     planType === "" ? totals.indirect[m] : projectApiTotals.indirect[m],
//   );
//   const grossValues = revenueValues.map((v, i) => v - directValues[i]);
//   const unallowable = monthNames.map((m) => totals.unallowable[m]);
//   const nonOpps = monthNames.map((m) => totals.nonOpps[m]);
//   const netValues = revenueValues.map(
//     (v, i) =>
//       v -
//       (laborValues[i] +
//         unallowable[i] +
//         indirectValues[i] +
//         nonOpps[i] +
//         nonLaborValues[i]),
//   );

//   // ── Status per month (ACTUAL vs FORECAST) ─────────────────────────────────
//   const getStatus = (monthIdx) => {
//     if (!closingPeriodDate) return "FORECAST";
//     const d = new Date(parseInt(fiscalYear), monthIdx, 1);
//     return d <= closingPeriodDate ? "ACTUAL" : "FORECAST";
//   };

//   // ── Peer selection helpers ─────────────────────────────────────────────────
//   const filteredPeers = potentialPeers.filter((id) =>
//     id.toLowerCase().includes(innerSearch.toLowerCase()),
//   );
//   const visiblePeers = showAllPeers ? filteredPeers : filteredPeers.slice(0, 6);
//   const isAllSelected =
//     potentialPeers.length > 0 && selectedPeers.length === potentialPeers.length;

//   const handleToggleSelectAll = () => {
//     if (isAllSelected) setSelectedPeers([]);
//     else setSelectedPeers([...potentialPeers]);
//   };

//   // ── Top-level dropdown items (from Revenue group) ─────────────────────────
//   const topLevelItems = useMemo(() => {
//     const revGroup = trendData.find((n) => n.id === "40.10.01");
//     if (!revGroup) return [];
//     return getChildren(revGroup).map((p) => ({
//       id: p.id,
//       name: p.name || p.id,
//     }));
//   }, [trendData]);

//   // ── Determine if peer panel should be shown ───────────────────────────────
//   const showPeerPanel = planType !== "";

//   // ── Determine table readiness ─────────────────────────────────────────────
//   const tableReady = !loading && (planType === "" || selectedPeers.length > 0);

//   return (
//     <div className="w-full overflow-hidden p-2 space-y-6 min-h-screen text-slate-800">
//       <style>{`
//   .table-container { width: 100%; overflow-x: auto; background: white; border: 1px solid #e2e8f0; border-radius: 8px; }
//   .psr-table { table-layout: fixed; width: 100%; border-spacing: 0; min-width: 1500px; /* Increased min-width to fit wider columns */ }

//   /* Increase Line Items width here (e.g., from 240px to 300px) */
//   .sticky-col { position: sticky; left: 0; z-index: 20; width: 300px; background: white; border-right: 1px solid #e2e8f0; padding: 0.75rem 1rem; color: #1e293b; text-align: left; }

//   /* Add an explicit width to month cells so they don't auto-squeeze */
//   .month-cell { width: 95px; text-align: right; padding: 0.75rem 1rem; border-right: 1px solid #f8fafc; color: #475569; }

//   /* Increase Annual Total width here (e.g., from 160px to 180px) */
//   .total-cell { width: 180px; text-align: right; padding: 0.75rem 1rem; background: #eff6ff; font-weight: 500; color: #1e40af; }

//   .header-cell { background: #f8fafc; color: #0f172a; font-size: 11px; border-bottom: 2px solid #e2e8f0; text-align: center; padding: 0.75rem; }
//   .header-cell-main { background: #f8fafc; color: #0f172a; font-size: 13px; border-bottom: 2px solid #e2e8f0; text-align: center; padding: 0.75rem 1rem; }
//   .status-pill { display: block; font-size: 9px; padding: 2px 0; border-radius: 6px; width: 60px; margin: 4px auto 0; text-align: center; }
//   .status-actual   { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; font-weight: bold; }
//   .status-forecast { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; font-weight: bold; }
//   .btn-action { display: flex; align-items: center; gap: 8px; padding: 0.6rem 1rem; border-radius: 0.75rem; font-weight: 500; font-size: 0.75rem; transition: all 0.2s; cursor: pointer; border: none; }
// `}</style>

//       {/* ── Header ────────────────────────────────────────────────────────── */}
//       <div className="flex justify-between items-center border bg-white p-4 rounded-lg">
//         <div className="flex items-center gap-4">
//           <div className="p-2 bg-blue-600 rounded-2xl text-white shadow-sm">
//             <FaChartLine size={22} />
//           </div>
//           <div>
//             <h1 className="text-lg font-black tracking-tight">
//               Trend Forecast
//             </h1>
//             <p className="flex items-center gap-2 text-xs text-slate-400 font-bold mt-1">
//               <FaCalendarCheck className="text-blue-500" /> Closed period:
//               <span className="text-slate-700">
//                 {closingPeriodDate
//                   ? closingPeriodDate.toLocaleDateString("en-US", {
//                       month: "long",
//                       year: "numeric",
//                     })
//                   : "Loading…"}
//               </span>
//             </p>
//             {cachedAge && (
//               <span className="text-[11px] text-slate-400 font-medium self-center">
//                 Last Refreshed: {cachedAge}
//               </span>
//             )}
//           </div>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={handleExportExcel}
//             disabled={isExporting || loading}
//             className="btn-action bg-blue-600 text-white  disabled:bg-gray-400"
//           >
//             <FaFileExcel /> Export Excel
//           </button>
//           <button
//             onClick={handleExportPdf}
//             disabled={isExporting || loading}
//             className="btn-action bg-blue-600 text-white  disabled:bg-gray-400"
//           >
//             <FaFilePdf /> Export PDF
//           </button>
//           <button
//             onClick={() => fetchAll(true)}
//             className="btn-action bg-blue-600 text-white hover:bg-blue-700"
//             disabled={loading}
//           >
//             <FaSync className={loading ? "animate-spin" : ""} /> Refresh
//           </button>
//         </div>
//       </div>

//       {/* ── Filter Panel ──────────────────────────────────────────────────── */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-white rounded-lg border border-gray-200">
//         {/* Top-level project dropdown (only useful in EAC/BUD mode) */}
//         <div className="md:col-span-2 relative">
//           <label className="block text-[13px] mb-1 font-semibold">
//             Top Level Project
//           </label>
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setShowDropdown(true);
//             }}
//             onFocus={() => setShowDropdown(true)}
//             className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-lg font-semibold outline-none text-sm"
//             placeholder="All Projects"
//             disabled={planType === ""}
//           />
//           {showDropdown && planType !== "" && (
//             <div
//               className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 shadow-2xl rounded-xl p-1"
//               onMouseDown={(e) => e.preventDefault()}
//             >
//               <div
//                 onClick={() => {
//                   setTopLevelFilter("");
//                   setSearchTerm("All Projects");
//                   setShowDropdown(false);
//                 }}
//                 className="p-2 cursor-pointer text-[11px] rounded-lg font-semibold hover:bg-blue-50"
//               >
//                 All Projects
//               </div>
//               {topLevelItems.map((p) => (
//                 <div
//                   key={p.id}
//                   onClick={() => {
//                     setTopLevelFilter(p.id);
//                     setSearchTerm(p.id);
//                     setShowDropdown(false);
//                   }}
//                   className="p-2 cursor-pointer rounded-lg text-[11px] font-semibold hover:bg-blue-50"
//                 >
//                   {p.id}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Plan Type */}
//         <div>
//           <label className="block text-[13px] mb-1 font-semibold">
//             Plan Type
//           </label>
//           <select
//             value={planType}
//             onChange={(e) => {
//               setPlanType(e.target.value);
//               setSearchTerm("All Projects");
//               setTopLevelFilter("");
//             }}
//             className="w-full p-3 bg-slate-100 rounded-lg text-[13px] font-semibold cursor-pointer border border-gray-200"
//           >
//             <option value="">All (Actual)</option>
//             <option value="EAC">EAC</option>
//             {/* FIXED: value must be "BUD" to match the new API's PlanType field.
//                 It was previously "NBBUD", which the new endpoint (which excludes
//                 NBBUD entirely) would never match. */}
//             <option value="BUD">BUD</option>
//           </select>
//         </div>

//         {/* Level — only relevant in EAC/BUD mode */}
//         <div>
//           <label className="block text-[13px] mb-1 font-semibold">
//             Level
//             {planType === "" && (
//               <span className="ml-1 text-slate-400 font-normal">(n/a)</span>
//             )}
//           </label>
//           <select
//             value={depthLevel}
//             onChange={(e) => setDepthLevel(Number(e.target.value))}
//             disabled={planType === ""}
//             className="w-full p-3 bg-slate-100 rounded-lg text-[13px] font-semibold cursor-pointer border border-gray-200 disabled:opacity-40"
//           >
//             {[1, 2, 3, 4].map((lvl) => (
//               <option key={lvl} value={lvl}>
//                 Level {lvl}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Fiscal Year */}
//         <div>
//           <label className="block text-[13px] mb-1 font-semibold">Year</label>
//           <select
//             value={fiscalYear}
//             onChange={(e) => setFiscalYear(e.target.value)}
//             className="w-full p-3 bg-slate-100 rounded-lg text-[13px] font-semibold cursor-pointer border border-gray-200"
//           >
//             {["2025", "2026", "2027"].map((y) => (
//               <option key={y} value={y}>
//                 {y}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* ── Peer / Component Selection (EAC / BUD only) ─────────────────── */}
//       {showPeerPanel && (
//         <div className="bg-white border rounded-lg p-4">
//           <div className="flex justify-between items-center mb-4">
//             <span className="text-[13px] font-semibold">
//               <FaSitemap className="inline mr-2 text-blue-500" />
//               Project Components ({selectedPeers.length} /{" "}
//               {potentialPeers.length})
//             </span>
//             <div className="flex gap-3 items-center">
//               <input
//                 type="text"
//                 placeholder="Filter…"
//                 value={innerSearch}
//                 onChange={(e) => setInnerSearch(e.target.value)}
//                 className="px-3 py-2 text-[12px] border border-slate-200 rounded-lg w-28 outline-none"
//               />
//               <button
//                 onClick={handleToggleSelectAll}
//                 className="flex items-center gap-2 text-[12px] text-blue-600 font-semibold"
//               >
//                 {isAllSelected ? (
//                   <>
//                     <FaSquare className="text-slate-300" /> Deselect All
//                   </>
//                 ) : (
//                   <>
//                     <FaCheckSquare /> Select All
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>

//           <div
//             className={`transition-all duration-300 overflow-y-auto pr-1 ${
//               showAllPeers ? "max-h-[220px]" : "max-h-none"
//             }`}
//           >
//             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
//               {visiblePeers.map((id) => (
//                 <div
//                   key={id}
//                   onClick={() =>
//                     setSelectedPeers((prev) =>
//                       prev.includes(id)
//                         ? prev.filter((p) => p !== id)
//                         : [...prev, id],
//                     )
//                   }
//                   className={`flex items-center justify-between p-3 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
//                     selectedPeers.includes(id)
//                       ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
//                       : "bg-slate-50 border-slate-100 text-slate-400"
//                   }`}
//                 >
//                   <span className="truncate mr-1">{id}</span>
//                   {selectedPeers.includes(id) ? (
//                     <FaCheckCircle className="text-blue-500 shrink-0" />
//                   ) : (
//                     <FaTimesCircle className="text-slate-200 shrink-0" />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {filteredPeers.length > 6 && (
//             <button
//               onClick={() => setShowAllPeers((v) => !v)}
//               className="mt-3 w-full py-2 bg-slate-50 text-[10px] font-black text-slate-500 rounded-xl hover:bg-slate-100 transition-all"
//             >
//               {showAllPeers ? (
//                 <>
//                   <FaMinus className="inline mr-1" /> Show Less
//                 </>
//               ) : (
//                 <>
//                   <FaPlus className="inline mr-1" /> Show All (
//                   {filteredPeers.length})
//                 </>
//               )}
//             </button>
//           )}
//         </div>
//       )}

//       {/* ── Table ─────────────────────────────────────────────────────────── */}
//       <div className="table-container shadow-sm">
//         {loading ? (
//           <div className="p-44 text-center flex justify-center gap-4 items-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
//             <p className="text-slate-400 font-black text-sm">Loading Report…</p>
//           </div>
//         ) : !tableReady ? (
//           <div className="p-44 text-center flex flex-col items-center">
//             <FaLayerGroup
//               size={64}
//               className="text-slate-100 mb-8 opacity-50"
//             />
//             <p className="text-slate-300 font-black text-sm">
//               Select project components to view the report
//             </p>
//           </div>
//         ) : (
//           <table className="psr-table border-collapse rounded-lg">
//             <thead className="border-b border-[#929292]">
//               <tr>
//                 <th className="sticky-col header-cell-main text-left">
//                   Line Items
//                 </th>
//                 {MONTHS.map((m) => {
//                   const status = getStatus(m.id - 1);
//                   return (
//                     <th key={m.id} className="month-cell header-cell font-bold">
//                       <span className="block mb-1 text-slate-800 text-sm font-semibold">
//                         {m.name}
//                       </span>
//                       <span
//                         className={`status-pill ${
//                           status === "ACTUAL"
//                             ? "status-actual"
//                             : "status-forecast"
//                         }`}
//                       >
//                         {status}
//                       </span>
//                     </th>
//                   );
//                 })}
//                 <th className="total-cell header-cell-main">Annual Total</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               <Row label="Contract Revenue" values={revenueValues} />
//               <Row label="Direct Labor" values={laborValues} />
//               {/* <Row label="Non Labour" values={nonLaborValues} /> */}
//               <Row label="Direct Cost (ODC)" values={odcValues} />
//               <Row
//                 label="Total Direct Costs"
//                 values={directValues}
//                 isBold
//                 bg="bg-slate-50/40"
//               />
//               <Row label="Gross Profit" values={grossValues} isBold />
//               {/* <Row label="Unallowable Expenses"   values={unallowable} /> */}
//               {/* <Row label="Non operating Expenses"   values={nonOpps} /> */}
//               <Row label="Indirect Burdens" values={indirectValues} />
//               <Row
//                 label="Net Profit / Fee"
//                 values={netValues}
//                 isBold
//                 bg="bg-blue-50/40"
//                 color="text-blue-700"
//               />
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ForecastPSRReport;

import React, { useState, useMemo, useCallback, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "./config";
import { exportReportToExcel, exportReportToPdf } from "./ReportExport";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import {
  FaChartLine,
  FaLayerGroup,
  FaCheckCircle,
  FaTimesCircle,
  FaSitemap,
  FaCheckSquare,
  FaSquare,
  FaSync,
  FaPlus,
  FaMinus,
  FaCalendarCheck,
} from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getCacheAge } from "../utils/cachedDataTime";

// ─── Constants ───────────────────────────────────────────────────────────────

// const SUMMARY_API_PATH = "/Forecast/GetSummaryTrend";
const SUMMARY_API_PATH = "/Forecast/GetSummaryV4";
const CONFIG_API_PATH = "/api/Configuration/GetAllConfigValuesByProject";

// NEW: the "all projects, latest version per BUD/EAC" endpoint we built.
// TODO: confirm the actual controller route — this assumes it lives under
// the same "Forecast" controller as SUMMARY_API_PATH. Adjust if not.
const PROJECT_MONTHLY_API_PATH = "/Forecast/GetMonthlyDataAllProjectsV1";

// const INDIRECT_PREFIXES = ["60", "62", "70", "78", "80", "82", "83", "84"];
const INDIRECT_PREFIXES = [
  "60",
  "62",
  "70",
  "78",
  "80",
  "82",
  "83",
  "84",
  "89",
  "90",
  "AL",
];
const INDIRECT_PREFIXES_NAME = [
  "Fringe Benefits",
  "Overhead",
  "General & Administrative",
  "Subcontract & Matl Handling",
  "Misc Income/(Expenses)",
  "Interest Expense",
  "Other Unallowable Expense",
  "Income Taxes",
  "Allocations",
];

const MONTHS = [
  { id: 1, name: "Jan", key: "01" },
  { id: 2, name: "Feb", key: "02" },
  { id: 3, name: "Mar", key: "03" },
  { id: 4, name: "Apr", key: "04" },
  { id: 5, name: "May", key: "05" },
  { id: 6, name: "Jun", key: "06" },
  { id: 7, name: "Jul", key: "07" },
  { id: 8, name: "Aug", key: "08" },
  { id: 9, name: "Sep", key: "09" },
  { id: 10, name: "Oct", key: "10" },
  { id: 11, name: "Nov", key: "11" },
  { id: 12, name: "Dec", key: "12" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Safely get monthly amount for a given year/monthKey from a totals object.
 * e.g. getAmt(node.monthlyTotals, "2026", "03") => number
 */
const getAmt = (totals, year, monthKey) =>
  Number((totals || {})[`${year}-${monthKey}`] || 0);

/**
 * Flatten all children from a node (array or dict).
 */
const getChildren = (node) => {
  if (!node) return [];
  const ch = node.children;
  if (!ch) return [];
  if (Array.isArray(ch)) return ch;
  if (typeof ch === "object") return Object.values(ch);
  return [];
};

/**
 * Recursively collect all project-level nodes under a given root node.
 * Used to collect projects for a selected top-level project filter.
 */
const collectProjects = (node, acc = []) => {
  if (!node) return acc;
  if (node.type === "project") acc.push(node);
  getChildren(node).forEach((c) => collectProjects(c, acc));
  return acc;
};

/**
 * Returns true if accountId starts with any indirect prefix.
 */
const isIndirect = (id) =>
  INDIRECT_PREFIXES.some((p) => (id || "").startsWith(p));

const isIndirectname = (id) => INDIRECT_PREFIXES_NAME.some((p) => id === p);

/**
 * Returns true if a node is ODC (account 50.24.x).
 */
const isODC = (id) => (id || "").startsWith("50.24");

/**
 * Finds the Revenue group node in the Actual-mode tree by NAME rather than
 * by a hardcoded id string. The tree's own id format is inconsistent in
 * different places ("40-10-01" vs "40.10.01"), so matching on the stable
 * display name ("Contracts Revenue") — the same thing computeTotals()
 * already keys off of — avoids that mismatch entirely.
 */
const findRevenueGroup = (trendData) =>
  (trendData || []).find(
    (n) => (n.name || "").toString().trim() === "Contracts Revenue",
  );

// ─── Core calculation ─────────────────────────────────────────────────────────

/**
 * Walk the full API tree and sum up the five line items per month.
 *
 * Logic per group node:
 *   Revenue   → group id == "40.01"  → use revenueTotals
 *   Labor     → group id == "50.01"  → monthlyTotals
 *   ODC       → group id == "50.2", account starting with 50.24 → monthlyTotals
 *   Indirect  → group id starts with one of INDIRECT_PREFIXES → monthlyTotals
 *
 * When selectedProjectIds is non-null (filtered mode) we only count amounts
 * that belong to the selected projects (project-type children match).
 *
 * When selectedProjectIds is null (All mode) we take the group-level totals
 * directly (fastest — no recursion needed for amounts).
 */
const computeTotals = (
  trendData,
  year,
  selectedProjectIds,
  closingPeriodDate,
) => {
  const blank = () => Object.fromEntries(MONTHS.map((m) => [m.name, 0]));

  const out = {
    rev: blank(),
    labor: blank(),
    cost: blank(),
    nonLabor: blank(),
    sub: blank(),
    odc: blank(),
    unallowable: blank(),
    nonOpps: blank(),
    indirect: blank(),
  };

  if (!trendData || trendData.length === 0) return out;

  const allMode = selectedProjectIds === null; // show everything

  trendData.forEach((group) => {
    const gid = (group.id || "").toString();
    const gidName = (group.name || "").toString();
    // ── REVENUE ──────────────────────────────────────────────────────
    // if (gid === "40-10-01") {
    // if (gidName === "Contracts Revenue") {
    //   if (allMode) {
    //     MONTHS.forEach((m) => {
    //       // if(m.id)
    //       out.rev[m.name] += getAmt(group.monthlyTotals, year, m.key) * -1;
    //     });
    //   } else {
    //     // Contracts Revenue
    //     //   -> Account
    //     //      -> Project
    //     getChildren(group).forEach((acct) => {
    //       getChildren(acct).forEach((proj) => {
    //         // console.log("Revenue Project:", proj);
    //         // console.log("Selected Projects:", selectedProjectIds);

    //         if (selectedProjectIds.has(proj.id)) {
    //           console.log("MATCHED REVENUE:", proj);

    //           MONTHS.forEach((m) => {
    //             out.rev[m.name] += getAmt(proj.monthlyTotals, year, m.key) * -1;
    //           });
    //         }
    //       });
    //     });
    //   }

    //   return;
    // }

    if (gidName === "Contracts Revenue") {
      const closingMonth = closingPeriodDate
        ? closingPeriodDate.getMonth() + 1
        : 0;

      if (allMode) {
        MONTHS.forEach((m) => {
          const amount = getAmt(group.monthlyTotals, year, m.key);

          if (m.id <= closingMonth) {
            out.rev[m.name] += amount * -1;
          } else {
            out.rev[m.name] += amount;
          }
        });
      } else {
        // Contracts Revenue → Account → Project
        getChildren(group).forEach((acct) => {
          getChildren(acct).forEach((proj) => {
            if (selectedProjectIds.has(proj.id)) {
              MONTHS.forEach((m) => {
                const amount = getAmt(proj.monthlyTotals, year, m.key);

                if (m.id <= closingMonth) {
                  out.rev[m.name] += amount * -1;
                } else {
                  out.rev[m.name] += amount;
                }
              });
            }
          });
        });
      }

      return;
    }

    // ── DIRECT LABOR ─────────────────────────────────────────────────
    // if (gid === "50-00-02") {
    if (gid === "50" || gid.includes("50")) {
      if (allMode) {
        MONTHS.forEach((m) => {
          out.cost[m.name] += getAmt(group.monthlyTotals, year, m.key);
        });
      } else {
        // account → project → employee; sum matching projects
        getChildren(group).forEach((acct) => {
          getChildren(acct).forEach((proj) => {
            if (selectedProjectIds.has(proj.id)) {
              MONTHS.forEach((m) => {
                out.cost[m.name] += getAmt(proj.monthlyTotals, year, m.key);
              });
            }
          });
        });
      }
      // return;
    }

    if (gidName === "Direct Labor") {
      if (allMode) {
        MONTHS.forEach((m) => {
          out.labor[m.name] += getAmt(group.monthlyTotals, year, m.key);
        });
      } else {
        // account → project → employee; sum matching projects
        getChildren(group).forEach((acct) => {
          getChildren(acct).forEach((proj) => {
            if (selectedProjectIds.has(proj.id)) {
              MONTHS.forEach((m) => {
                out.labor[m.name] += getAmt(proj.monthlyTotals, year, m.key);
              });
            }
          });
        });
      }
      return;
    }
    if (gidName === "Subcontracts") {
      if (allMode) {
        MONTHS.forEach((m) => {
          out.sub[m.name] += getAmt(group.monthlyTotals, year, m.key);
        });
      } else {
        // account → project → employee; sum matching projects
        getChildren(group).forEach((acct) => {
          getChildren(acct).forEach((proj) => {
            if (selectedProjectIds.has(proj.id)) {
              MONTHS.forEach((m) => {
                out.sub[m.name] += getAmt(proj.monthlyTotals, year, m.key);
              });
            }
          });
        });
      }
      return;
    }

    // ── DIRECT NON-LABOR / ODC ────────────────────────────────────────
    if (
      gidName === "Other Direct Costs" ||
      gidName === "Direct Travel" ||
      gidName === "Direct Materials"
    ) {
      getChildren(group).forEach((acct) => {
        // if (!isODC(acct.id)) return;
        if (allMode) {
          MONTHS.forEach((m) => {
            out.odc[m.name] += getAmt(acct.monthlyTotals, year, m.key);
          });
        } else {
          getChildren(acct).forEach((proj) => {
            if (selectedProjectIds.has(proj.id)) {
              MONTHS.forEach((m) => {
                out.odc[m.name] += getAmt(proj.monthlyTotals, year, m.key);
              });
            }
          });
        }
      });

      return;
    }

    if (gid === "90") {
      if (allMode) {
        MONTHS.forEach((m) => {
          out.unallowable[m.name] += getAmt(group.monthlyTotals, year, m.key);
        });
      } else {
        getChildren(group).forEach((acct) => {
          getChildren(acct).forEach((proj) => {
            if (selectedProjectIds.has(proj.id)) {
              MONTHS.forEach((m) => {
                out.unallowable[m.name] += getAmt(
                  proj.monthlyTotals,
                  year,
                  m.key,
                );
              });
            }
          });
        });
      }
      return;
    }

    if (gid === "95") {
      if (allMode) {
        MONTHS.forEach((m) => {
          out.nonOpps[m.name] += getAmt(group.monthlyTotals, year, m.key);
        });
      } else {
        getChildren(group).forEach((acct) => {
          getChildren(acct).forEach((proj) => {
            if (selectedProjectIds.has(proj.id)) {
              MONTHS.forEach((m) => {
                out.nonOpps[m.name] += getAmt(proj.monthlyTotals, year, m.key);
              });
            }
          });
        });
      }
      return;
    }

    // ── INDIRECT ─────────────────────────────────────────────────────
    // if (isIndirect(gid)) {
    if (isIndirectname(gidName)) {
      if (allMode) {
        MONTHS.forEach((m) => {
          out.indirect[m.name] += getAmt(group.monthlyTotals, year, m.key);
        });
      } else {
        getChildren(group).forEach((acct) => {
          getChildren(acct).forEach((proj) => {
            if (selectedProjectIds.has(proj.id)) {
              MONTHS.forEach((m) => {
                out.indirect[m.name] += getAmt(proj.monthlyTotals, year, m.key);
              });
            }
          });
        });
      }
    }
  });

  return out;
};

// ─── Row component ────────────────────────────────────────────────────────────

const Row = ({ label, values, isBold, bg, color }) => {
  const total = values.reduce((a, b) => a + (Number(b) || 0), 0);
  return (
    <tr
      className={`${bg || ""} hover:bg-slate-50 transition-colors ${
        isBold
          ? `font-semibold ${color || "text-slate-900"}`
          : "text-slate-500 font-medium"
      }`}
    >
      <td
        className={`sticky-col text-[12px] pr-1 border-r border-slate-100 ${bg || "bg-white"}`}
      >
        {label}
      </td>
      {values.map((v, i) => (
        <td
          key={i}
          className="month-cell min-w-[130px] whitespace-nowrap tabular-nums text-[12px]"
        >
          {v === 0
            ? "—"
            : v.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
        </td>
      ))}
      <td
        className={`total-cell tabular-nums text-[12px] ${
          isBold ? color || "text-slate-900" : "text-slate-700"
        }`}
      >
        {total.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>
    </tr>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const ForecastPSRReport = ({ closingPeriod }) => {
  // ── State ──────────────────────────────────────────────────────────────────
  const [trendData, setTrendData] = useState([]);
  const [closingPeriodDate, setClosingPeriodDate] = useState(null);
  const [loading, setLoading] = useState(true);

  // NEW: raw response from the all-projects (BUD/EAC, latest version) API.
  // Each item looks like:
  // { projId, plId, planType, monthlyData: [{ year, month, laborCost, nonLaborCost, hours, indirectCost: [{name, value}] }] }
  const [projectIndirectData, setProjectIndirectData] = useState([]);

  // Filters
  const [fiscalYear, setFiscalYear] = useState("2026");
  const [planType, setPlanType] = useState(""); // "" = All(Actual), "EAC", "BUD"
  const [depthLevel, setDepthLevel] = useState(1); // numeric depth of project ID

  // Project filter (only relevant when planType is not "")
  const [topLevelFilter, setTopLevelFilter] = useState(""); // prefix filter
  const [searchTerm, setSearchTerm] = useState("All Projects");
  const [showDropdown, setShowDropdown] = useState(false);

  // Peer selection (only when planType != "")
  const [selectedPeers, setSelectedPeers] = useState([]);
  const [innerSearch, setInnerSearch] = useState("");
  const [showAllPeers, setShowAllPeers] = useState(false);

  const [isExporting, setIsExporting] = useState(false);

  const [cachedAge, setCachedAge] = useState("");

  const [filterProject, setFilterProject] = useState([]);

  const isClosingPeriodReady =
    closingPeriod != null &&
    closingPeriod.month != null &&
    Number.isFinite(Number(closingPeriod.month));

  // ── Data fetching ──────────────────────────────────────────────────────────

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      await exportReportToExcel({
        trendData,
        projectIndirectData,
        year: fiscalYear,
      });
    } catch (err) {
      console.error("Excel export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = () => {
    setIsExporting(true);
    try {
      exportReportToPdf({ trendData, projectIndirectData, year: fiscalYear });
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const fetchAll = useCallback(
    async (byPassCache = false) => {
      if (
        closingPeriod == null ||
        closingPeriod.month == null ||
        !Number.isFinite(Number(closingPeriod.month))
      ) {
        console.log("Waiting for closing period...");
        return;
      }

      setLoading(true);
      try {
        const [summaryRes, configRes, projectIndirectRes] = await Promise.all([
          axios.get(
            `${backendUrl}${SUMMARY_API_PATH}?byPassCache=${byPassCache}`,
          ),
          axios.get(`${backendUrl}${CONFIG_API_PATH}/xxxxx`),
          axios.get(
            `${backendUrl}${PROJECT_MONTHLY_API_PATH}?byPassCache=${byPassCache}`,
          ),
        ]);

        const summaryDataAge = getCacheAge(summaryRes.data.createdAt);

        setCachedAge(summaryDataAge);

        if (Array.isArray(summaryRes.data.data))
          setTrendData(summaryRes.data.data);

        if (Array.isArray(configRes.data)) {
          const item = configRes.data.find((c) => c.name === "closing_period");
          if (item?.value) {
            const [y, mo, d] = item.value.split("-").map(Number);
            setClosingPeriodDate(new Date(y, mo - 1, d));
          }
        }

        if (Array.isArray(projectIndirectRes.data)) {
          setProjectIndirectData(projectIndirectRes.data);
        }
      } catch (err) {
        console.error("ForecastPSRReport fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [closingPeriod],
  );

  useEffect(() => {
    if (!isClosingPeriodReady) return;

    fetchAll();
  }, [isClosingPeriodReady, fetchAll]);

  // ── Projects available for the currently selected Plan Type ──────────────
  //
  // IMPORTANT: this is the fix for "peers / search box don't reflect the
  // selected plan type". Previously this list (and the Top Level Project
  // dropdown) was built from `trendData` — the Actual-data tree — even in
  // BUD/EAC mode. But `trendData` node ids and `projectIndirectData[].projId`
  // are two *different* id schemes (e.g. tree id "1001_GSA_NIA_ADSP.1.1.2"
  // vs projId "C1800.C"), so a peer picked from the tree could never match a
  // row in `projectIndirectData`, and `projectApiTotals` below would always
  // come back empty for BUD/EAC. Now, whenever a plan type is selected, both
  // the peer list and the top-level dropdown are built directly from
  // `projectIndirectData`, filtered to that plan type, so what's selectable
  // is guaranteed to match what `projectApiTotals` can find.
  const planTypeRows = useMemo(() => {
    if (planType === "") return [];
    return (projectIndirectData || []).filter(
      (p) =>
        (p.planType || "").toString().toUpperCase() === planType.toUpperCase(),
    );
  }, [projectIndirectData, planType]);

  const potentialPeers = useMemo(() => {
    if (planType === "") return []; // All mode — no peer selection needed

    if (planTypeRows.length === 0) return [];

    const ids = new Set();
    planTypeRows.forEach((p) => {
      const projId = (p.projId || "").toString().trim();
      if (!projId) return;

      // Project ids use "." as the level separator (e.g. "C1800.C",
      // "1001_GSA_NIA_ADSP.1.1.2"). Truncate to the selected depth so the
      // Level dropdown groups sub-projects the same way the Actual-mode
      // tree does.
      const segments = projId.split(".");
      if (segments.length < depthLevel) return; // not deep enough to exist at this level
      const idAtDepth = segments.slice(0, depthLevel).join(".");

      const matchesTop =
        !topLevelFilter || idAtDepth.startsWith(topLevelFilter);
      if (matchesTop) ids.add(idAtDepth);
    });

    return Array.from(ids).sort();
  }, [planTypeRows, planType, depthLevel, topLevelFilter]);

  // Sync selection when available peers change
  useEffect(() => {
    setSelectedPeers([...potentialPeers]);
  }, [potentialPeers]);

  // ── Derived: set of selected project IDs passed to computeTotals ─────────
  //
  // null  → All mode  (computeTotals uses group-level totals directly)
  // Set   → Filtered mode (computeTotals filters to matching project nodes)

  const selectedProjectIds = useMemo(() => {
    if (planType === "") return null; // All — no filter
    if (selectedPeers.length === 0) return new Set();
    return new Set(selectedPeers);
  }, [planType, selectedPeers]);

  // ── Core numbers ──────────────────────────────────────────────────────────

  const totals = useMemo(
    () =>
      computeTotals(
        trendData,
        fiscalYear,
        selectedProjectIds,
        closingPeriodDate,
      ),
    [trendData, fiscalYear, selectedProjectIds],
  );

  // NEW: Labor / Non-Labor / Indirect sourced from the all-projects API for
  // BUD/EAC mode.
  //
  // - Only runs when a plan type (BUD/EAC) is selected — Actual mode keeps
  //   using totals.labor / totals.nonLabor / totals.indirect from the
  //   existing tree, untouched.
  // - The all-projects API only returns data at the WHOLE-PROJECT level
  //   (projId like "C1800.C"). The peer panel can now select ids at deeper
  //   levels (Level 2/3/4) that are themselves just longer prefixes of that
  //   same projId, so we reduce every selected id down to its root project
  //   id (everything before the first ".") and dedupe, so selecting
  //   multiple sub-nodes of the same project doesn't double-count it.
  const projectApiTotals = useMemo(() => {
    const blank = () => Object.fromEntries(MONTHS.map((m) => [m.name, 0]));
    const empty = { labor: blank(), nonLabor: blank(), indirect: blank() };

    if (planType === "") return empty; // Actual mode untouched
    if (!projectIndirectData || projectIndirectData.length === 0) return empty;
    if (!selectedProjectIds || selectedProjectIds.size === 0) return empty;

    // Reduce selected node ids down to their root project id and dedupe.
    const selectedRootProjectIds = new Set(
      [...selectedProjectIds].map((id) => id.split(".")[0]),
    );

    const out = { labor: blank(), nonLabor: blank(), indirect: blank() };

    projectIndirectData
      .filter(
        (proj) =>
          (proj.planType || "").toUpperCase() === planType.toUpperCase(),
      )
      .filter((proj) =>
        selectedRootProjectIds.has((proj.projId || "").split(".")[0]),
      )
      .forEach((proj) => {
        (proj.monthlyData || []).forEach((md) => {
          if (Number(md.year) !== Number(fiscalYear)) return;
          const monthDef = MONTHS.find((m) => m.id === md.month);
          if (!monthDef) return;

          out.labor[monthDef.name] += Number(md.laborCost) || 0;
          out.nonLabor[monthDef.name] += Number(md.nonLaborCost) || 0;

          const monthIndirectSum = (md.indirectCost || []).reduce(
            (sum, ic) => sum + (Number(ic.value) || 0),
            0,
          );
          out.indirect[monthDef.name] += monthIndirectSum;
        });
      });

    return out;
  }, [projectIndirectData, planType, selectedProjectIds, fiscalYear]);

  const monthNames = MONTHS.map((m) => m.name);

  const revenueValues = monthNames.map((m) => totals?.rev?.[m] ?? 0);

  const laborValues = monthNames.map((m) =>
    planType === ""
      ? (totals?.labor?.[m] ?? 0)
      : (projectApiTotals?.labor?.[m] ?? 0),
  );

  const nonLaborValues = monthNames.map((m) =>
    planType === ""
      ? (totals?.nonLabor?.[m] ?? 0)
      : (projectApiTotals?.nonLabor?.[m] ?? 0),
  );

  const directCost = monthNames.map((m) =>
    planType === ""
      ? (totals?.cost?.[m] ?? 0)
      : (projectApiTotals?.cost?.[m] ?? 0),
  );

  const odcValues = monthNames.map((m) => totals?.odc?.[m] ?? 0);

  const directValues = monthNames.map((m, i) => laborValues[i] + odcValues[i]);

  const indirectValues = monthNames.map((m) =>
    planType === ""
      ? (totals?.indirect?.[m] ?? 0)
      : (projectApiTotals?.indirect?.[m] ?? 0),
  );
  const subcontractor = monthNames.map((m) => totals?.sub?.[m] ?? 0);
  const grossValues = revenueValues.map(
    (v, i) => v - (laborValues[i] + odcValues[i] + subcontractor[i]),
  );

  const unallowable = monthNames.map((m) => totals?.unallowable?.[m] ?? 0);

  const nonOpps = monthNames.map((m) => totals?.nonOpps?.[m] ?? 0);

  const netValues = indirectValues.map((v, i) => grossValues[i] - v);

  // ── Status per month (ACTUAL vs FORECAST) ─────────────────────────────────
  const getStatus = (monthIdx) => {
    if (!closingPeriodDate) return "FORECAST";
    const d = new Date(parseInt(fiscalYear), monthIdx, 1);
    return d <= closingPeriodDate ? "ACTUAL" : "FORECAST";
  };

  // ── Peer selection helpers ─────────────────────────────────────────────────
  const filteredPeers = potentialPeers.filter((id) =>
    id.toLowerCase().includes(innerSearch.toLowerCase()),
  );
  const visiblePeers = showAllPeers ? filteredPeers : filteredPeers.slice(0, 6);
  const isAllSelected =
    potentialPeers.length > 0 && selectedPeers.length === potentialPeers.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) setSelectedPeers([]);
    else setSelectedPeers([...potentialPeers]);
  };

  // ── Top-level dropdown items ───────────────────────────────────────────────
  //
  // Actual mode: sourced from the Revenue group's children in the trend tree
  // (matched by NAME — "Contracts Revenue" — not by a hardcoded id, since
  // the tree's id format for that node has been inconsistent).
  //
  // BUD/EAC mode: sourced from projectIndirectData for the selected plan
  // type, so the dropdown only ever offers projects that actually have
  // BUD/EAC data — this is the "lookup of available projects for the
  // selected plan type" that wasn't showing before.
  const topLevelItems = useMemo(() => {
    if (planType === "") {
      const revGroup = findRevenueGroup(trendData);
      if (!revGroup) return [];
      return getChildren(revGroup).map((p) => ({
        id: p.id,
        name: p.name || p.id,
      }));
    }

    const rootIds = new Set(
      planTypeRows
        .map((p) => (p.projId || "").toString().split(".")[0])
        .filter(Boolean),
    );
    return Array.from(rootIds)
      .sort()
      .map((id) => ({ id, name: id }));
  }, [trendData, planType, planTypeRows]);

  // ── Determine if peer panel should be shown ───────────────────────────────
  const showPeerPanel = planType !== "";

  // ── Determine table readiness ─────────────────────────────────────────────
  const tableReady = !loading && (planType === "" || selectedPeers.length > 0);
  console.log(selectedProjectIds);
  return (
    <div className="w-full overflow-hidden p-2 space-y-6 min-h-screen text-slate-800">
      <style>{`
        
.table-container {
  width: 100%;
  overflow-x: auto;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.psr-table {
  table-layout: fixed;
  width: 100%;
  min-width: 1600px;
  border-spacing: 0;
}

.psr-table th,
.psr-table td {
  box-sizing: border-box;
  white-space: nowrap;
}

.sticky-col {
  position: sticky;
  left: 0;
  z-index: 20;
  width: 200px;
  min-width: 200px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 0.75rem;
  text-align: left;
}

.month-cell {
  width: 100px;
  min-width: 100px;
  text-align: right;
  padding: 0.75rem 0.5rem;
  border-right: 1px solid #f8fafc;
}

.total-cell {
  width: 150px;
  min-width: 150px;
  white-space: nowrap;
  text-align: right;
  padding: 0.75rem 0.5rem;
  background: #eff6ff;
}

        .header-cell { background: #f8fafc; color: #0f172a; font-size: 11px; border-bottom: 2px solid #e2e8f0; text-align: center; padding: 0.75rem; }
        .header-cell-main { background: #f8fafc; color: #0f172a; font-size: 13px; border-bottom: 2px solid #e2e8f0; text-align: center; padding: 0.75rem 1rem; }
        .status-pill { display: block; font-size: 9px; padding: 2px 0; border-radius: 6px; width: 60px; margin: 4px auto 0; text-align: center; }
        .status-actual   { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; font-weight: bold; }
        .status-forecast { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; font-weight: bold; }
        .btn-action { display: flex; align-items: center; gap: 8px; padding: 0.6rem 1rem; border-radius: 0.75rem; font-weight: 500; font-size: 0.75rem; transition: all 0.2s; cursor: pointer; border: none; }
      `}</style>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center border bg-white p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-600 rounded-2xl text-white shadow-sm">
            <FaChartLine size={22} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight">
              Trend Forecast
            </h1>
            <p className="flex items-center gap-2 text-xs text-slate-400 font-bold mt-1">
              <FaCalendarCheck className="text-blue-500" /> Closed period:
              <span className="text-slate-700">
                {closingPeriodDate
                  ? closingPeriodDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "Loading…"}
              </span>
            </p>
            {cachedAge && (
              <span className="text-[11px] text-slate-400 font-medium self-center">
                Last Refreshed: {cachedAge}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportExcel}
            disabled={isExporting || loading}
            className="btn-action bg-blue-600 text-white  disabled:bg-gray-400"
          >
            <FaFileExcel /> Export Excel
          </button>
          <button
            onClick={handleExportPdf}
            disabled={isExporting || loading}
            className="btn-action bg-blue-600 text-white  disabled:bg-gray-400"
          >
            <FaFilePdf /> Export PDF
          </button>
          <button
            onClick={() => fetchAll(true)}
            disabled={loading || !isClosingPeriodReady}
            className="btn-action bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            <FaSync className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Filter Panel ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-white rounded-lg border border-gray-200">
        {/* Top-level project dropdown (only useful in EAC/BUD mode) */}
        <div className="md:col-span-2 relative">
          <label className="block text-[13px] mb-1 font-semibold">
            Top Level Project
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-lg font-semibold outline-none text-sm"
            placeholder="All Projects"
            disabled={planType === ""}
          />
          {showDropdown && planType !== "" && (
            <div
              className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 shadow-2xl rounded-xl p-1"
              onMouseDown={(e) => e.preventDefault()}
            >
              <div
                onClick={() => {
                  setTopLevelFilter("");
                  setSearchTerm("All Projects");
                  setShowDropdown(false);
                }}
                className="p-2 cursor-pointer text-[11px] rounded-lg font-semibold hover:bg-blue-50"
              >
                All Projects
              </div>
              {topLevelItems
                .filter((p) =>
                  searchTerm === "All Projects"
                    ? true
                    : p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (p.name || "")
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                )
                .map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setTopLevelFilter(p.id);
                      setSearchTerm(p.id);
                      setShowDropdown(false);
                    }}
                    className="p-2 cursor-pointer rounded-lg text-[11px] font-semibold hover:bg-blue-50"
                  >
                    {p.id}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Plan Type */}
        <div>
          <label className="block text-[13px] mb-1 font-semibold">
            Plan Type
          </label>
          <select
            value={planType}
            onChange={(e) => {
              setPlanType(e.target.value);
              setSearchTerm("All Projects");
              setTopLevelFilter("");
            }}
            className="w-full p-3 bg-slate-100 rounded-lg text-[13px] font-semibold cursor-pointer border border-gray-200"
          >
            <option value="">All (Actual)</option>
            <option value="EAC">EAC</option>
            {/* FIXED: value must be "BUD" to match the new API's PlanType field.
                It was previously "NBBUD", which the new endpoint (which excludes
                NBBUD entirely) would never match. */}
            <option value="BUD">BUD</option>
          </select>
        </div>

        {/* Level — only relevant in EAC/BUD mode */}
        <div>
          <label className="block text-[13px] mb-1 font-semibold">
            Level
            {planType === "" && (
              <span className="ml-1 text-slate-400 font-normal">(n/a)</span>
            )}
          </label>
          <select
            value={depthLevel}
            onChange={(e) => setDepthLevel(Number(e.target.value))}
            disabled={planType === ""}
            className="w-full p-3 bg-slate-100 rounded-lg text-[13px] font-semibold cursor-pointer border border-gray-200 disabled:opacity-40"
          >
            {[1, 2, 3, 4].map((lvl) => (
              <option key={lvl} value={lvl}>
                Level {lvl}
              </option>
            ))}
          </select>
        </div>

        {/* Fiscal Year */}
        <div>
          <label className="block text-[13px] mb-1 font-semibold">Year</label>
          <select
            value={fiscalYear}
            onChange={(e) => setFiscalYear(e.target.value)}
            className="w-full p-3 bg-slate-100 rounded-lg text-[13px] font-semibold cursor-pointer border border-gray-200"
          >
            {["2025", "2026", "2027"].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Peer / Component Selection (EAC / BUD only) ─────────────────── */}
      {showPeerPanel && (
        <div className="bg-white border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[13px] font-semibold">
              <FaSitemap className="inline mr-2 text-blue-500" />
              Project Components ({selectedPeers.length} /{" "}
              {potentialPeers.length})
            </span>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Filter…"
                value={innerSearch}
                onChange={(e) => setInnerSearch(e.target.value)}
                className="px-3 py-2 text-[12px] border border-slate-200 rounded-lg w-28 outline-none"
              />
              <button
                onClick={handleToggleSelectAll}
                className="flex items-center gap-2 text-[12px] text-blue-600 font-semibold"
              >
                {isAllSelected ? (
                  <>
                    <FaSquare className="text-slate-300" /> Deselect All
                  </>
                ) : (
                  <>
                    <FaCheckSquare /> Select All
                  </>
                )}
              </button>
            </div>
          </div>

          <div
            className={`transition-all duration-300 overflow-y-auto pr-1 ${
              showAllPeers ? "max-h-[220px]" : "max-h-none"
            }`}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {visiblePeers.map((id) => (
                <div
                  key={id}
                  onClick={() =>
                    setSelectedPeers((prev) =>
                      prev.includes(id)
                        ? prev.filter((p) => p !== id)
                        : [...prev, id],
                    )
                  }
                  className={`flex items-center justify-between p-3 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                    selectedPeers.includes(id)
                      ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                      : "bg-slate-50 border-slate-100 text-slate-400"
                  }`}
                >
                  <span className="truncate mr-1">{id}</span>
                  {selectedPeers.includes(id) ? (
                    <FaCheckCircle className="text-blue-500 shrink-0" />
                  ) : (
                    <FaTimesCircle className="text-slate-200 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {filteredPeers.length > 6 && (
            <button
              onClick={() => setShowAllPeers((v) => !v)}
              className="mt-3 w-full py-2 bg-slate-50 text-[10px] font-black text-slate-500 rounded-xl hover:bg-slate-100 transition-all"
            >
              {showAllPeers ? (
                <>
                  <FaMinus className="inline mr-1" /> Show Less
                </>
              ) : (
                <>
                  <FaPlus className="inline mr-1" /> Show All (
                  {filteredPeers.length})
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="table-container shadow-sm">
        {loading ? (
          <div className="p-44 text-center flex justify-center gap-4 items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <p className="text-slate-400 font-black text-sm">Loading Report…</p>
          </div>
        ) : !tableReady ? (
          <div className="p-44 text-center flex flex-col items-center">
            <FaLayerGroup
              size={64}
              className="text-slate-100 mb-8 opacity-50"
            />
            <p className="text-slate-300 font-black text-sm">
              Select project components to view the report
            </p>
          </div>
        ) : (
          <table className="psr-table border-collapse rounded-lg">
            <thead className="border-b border-[#929292]">
              <tr>
                <th className="sticky-col header-cell-main text-left">
                  Description / Resource
                </th>
                {MONTHS.map((m) => {
                  const status = getStatus(m.id - 1);
                  return (
                    <th key={m.id} className="month-cell header-cell font-bold">
                      <span className="block mb-1 text-slate-800 text-sm font-semibold">
                        {m.name}
                      </span>
                      <span
                        className={`status-pill ${
                          status === "ACTUAL"
                            ? "status-actual"
                            : "status-forecast"
                        }`}
                      >
                        {status}
                      </span>
                    </th>
                  );
                })}
                <th className="total-cell header-cell-main">Annual Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <Row label="Contract Revenue" values={revenueValues} />
              <Row label="Direct Labor" values={laborValues} />
              {/* <Row label="Non Labour" values={nonLaborValues} /> */}
              <Row
                label="Direct Cost (ODC, Travel, Materials)"
                values={odcValues}
              />
              <Row label="Subcontractor" values={subcontractor} />
              <Row
                label="Total Direct Costs"
                values={directValues}
                isBold
                bg="bg-slate-50/40"
              />
              <Row label="Gross Profit" values={grossValues} isBold />
              {/* <Row label="Unallowable Expenses"   values={unallowable} /> */}
              {/* <Row label="Non operating Expenses"   values={nonOpps} /> */}
              <Row label="Indirect Burdens" values={indirectValues} />
              <Row
                label="Net Profit / Fee"
                values={netValues}
                isBold
                bg="bg-blue-50/40"
                color="text-blue-700"
              />
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ForecastPSRReport;
