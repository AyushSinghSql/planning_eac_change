// "use client";
// import React, { useEffect, useMemo, useState } from "react";
// import { backendUrl } from "./config";

// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   ComposedChart,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";

// import {
//   FaSyncAlt,
//   FaChevronDown,
//   FaArrowUp,
//   FaArrowDown,
//   FaMinus,
//   FaChartLine,
//   FaDollarSign,
//   FaPercentage,
//   FaCalendarAlt,
//   FaFilter,
// } from "react-icons/fa";

// /* ============================================================
//    CONFIG
//    ============================================================ */

// const SUMMARY_API_PATH = "/Forecast/GetSummaryV4";

// const MONTHS = [
//   { number: 1, key: "01", short: "Jan", name: "January" },
//   { number: 2, key: "02", short: "Feb", name: "February" },
//   { number: 3, key: "03", short: "Mar", name: "March" },
//   { number: 4, key: "04", short: "Apr", name: "April" },
//   { number: 5, key: "05", short: "May", name: "May" },
//   { number: 6, key: "06", short: "Jun", name: "June" },
//   { number: 7, key: "07", short: "Jul", name: "July" },
//   { number: 8, key: "08", short: "Aug", name: "August" },
//   { number: 9, key: "09", short: "Sep", name: "September" },
//   { number: 10, key: "10", short: "Oct", name: "October" },
//   { number: 11, key: "11", short: "Nov", name: "November" },
//   { number: 12, key: "12", short: "Dec", name: "December" },
// ];

// const DIRECT_NAMES = [
//   "Direct Labor",
//   "Direct Travel",
//   "Direct Materials",
//   "Subcontracts",
//   "Other Direct Costs",
// ];

// const INDIRECT_NAMES = [
//   "Fringe Benefits",
//   "Overhead",
//   "Cost of Goods Sold",
//   "General & Administrative",
//   "Subcontract & Matl Handling",
//   "Misc Income/(Expenses)",
//   "Interest Expense",
//   "B&P",
//   "Business Development",
//   "Other Unallowable Expense",
//   "Allocations",
//   "Income Taxes",
// ];

// /*
//  * Indirect lines treated as "below the line".
//  * Operating Income excludes these; Net Income includes them.
//  * Set to [] to make Operating Income equal Net Income.
//  */
// const BELOW_THE_LINE_NAMES = [
//   "Interest Expense",
//   "Income Taxes",
//   "Misc Income/(Expenses)",
// ];

// const COLORS = {
//   navy: "#304F6D",
//   blue: "#486987",
//   gold: "#f59e0b",
//   green: "#628361",
//   red: "#B34B32",
//   orange: "#C58D4E",
//   slate: "#64748B",
//   muted: "#94A3B8",
//   text: "#263238",
//   border: "#E6E8EB",
//   background: "#F7F8FA",
//   white: "#FFFFFF",
// };

// const PIE_COLORS = [
//   COLORS.blue,
//   COLORS.gold,
//   COLORS.green,
//   COLORS.orange,
//   COLORS.red,
//   COLORS.slate,
// ];

// /* ============================================================
//    HELPERS
//    ============================================================ */

// const safeNumber = (value) => {
//   if (value === undefined || value === null || value === "" || value === "-") {
//     return 0;
//   }
//   const parsed = Number(value);
//   return Number.isFinite(parsed) ? parsed : 0;
// };

// const round2 = (value) =>
//   Math.round((safeNumber(value) + Number.EPSILON) * 100) / 100;

// const normalizeName = (value) =>
//   String(value || "")
//     .trim()
//     .toLowerCase();

// const toArray = (value) =>
//   Array.isArray(value)
//     ? value
//     : value && typeof value === "object"
//       ? Object.values(value)
//       : [];

// const monthKey = (year, month) => `${year}-${String(month).padStart(2, "0")}`;

// const nameMatchesAny = (node, list) => {
//   const name = normalizeName(node?.name);
//   return list.some((item) => name.includes(normalizeName(item)));
// };

// /* Same node classification as ReportingScreen (top-level nodes only) */
// const isRevenueRoot = (node) =>
//   normalizeName(node?.name) === "contracts revenue";
// const isAdjustmentNode = (node) =>
//   normalizeName(node?.name).includes("adjustment");
// const isDirectNode = (node) => nameMatchesAny(node, DIRECT_NAMES);
// const isIndirectNode = (node) => nameMatchesAny(node, INDIRECT_NAMES);
// const isBelowTheLineNode = (node) => nameMatchesAny(node, BELOW_THE_LINE_NAMES);
// const isDirectNonLaborNode = (node) => {
//   const name = normalizeName(node?.name);
//   return name.includes("direct non labor") || name.includes("direct non-labor");
// };
// /* Adjust if your project nodes use a different `type` value */
// const isProjectNode = (node) => normalizeName(node?.type).includes("project");

// /* ============================================================
//    BUILD STATEMENT TREE (mirrors ReportingScreen.fetchForecast)
//    ============================================================ */

// const mergeTotals = (target, source) => {
//   Object.entries(source || {}).forEach(([key, value]) => {
//     target[key] = (target[key] || 0) + safeNumber(value);
//   });
// };

// /* Merge top-level entries that share a name.
//    Unlike the report, budget totals are merged as well. */
// const mergeEntriesByName = (items) => {
//   const map = new Map();

//   items.forEach((item) => {
//     if (!item) return;

//     if (map.has(item.name)) {
//       const existing = map.get(item.name);
//       existing.children.push(...toArray(item.children));
//       mergeTotals(existing.monthlyTotals, item.monthlyTotals);
//       mergeTotals(existing.revenueTotals, item.revenueTotals);
//       mergeTotals(existing.budgetMonthlyTotals, item.budgetMonthlyTotals);
//       mergeTotals(existing.budgetRevenueTotals, item.budgetRevenueTotals);
//     } else {
//       map.set(item.name, {
//         ...item,
//         children: [...toArray(item.children)],
//         monthlyTotals: { ...(item.monthlyTotals || {}) },
//         revenueTotals: { ...(item.revenueTotals || {}) },
//         budgetMonthlyTotals: { ...(item.budgetMonthlyTotals || {}) },
//         budgetRevenueTotals: { ...(item.budgetRevenueTotals || {}) },
//       });
//     }
//   });

//   return Array.from(map.values());
// };

// const mapNode = (item, parentIsRevenue = false) => {
//   const name = String(item.name || item.description || "").trim();
//   const lower = name.toLowerCase();

//   const isRevenue =
//     parentIsRevenue ||
//     lower === "revenue" ||
//     lower.includes("revenue adjustment");

//   const revenueTotals = item.revenueTotals || {};

//   return {
//     id: String(item.id || item.code || "").trim(),
//     name,
//     type: item.type,
//     isRevenue,
//     monthlyTotals:
//       isRevenue && Object.keys(revenueTotals).length > 0
//         ? revenueTotals
//         : item.monthlyTotals || {},
//     revenueTotals,
//     budgetMonthlyTotals: item.budgetMonthlyTotals || {},
//     budgetRevenueTotals: item.budgetRevenueTotals || {},
//     children: toArray(item.children)
//       .filter(
//         (child) =>
//           child &&
//           !String(child.id || child.code || "")
//             .trim()
//             .includes("-BUDGET"),
//       )
//       .map((child) => mapNode(child, isRevenue)),
//   };
// };

// const buildStatementTree = (rawData) => {
//   const top = mergeEntriesByName(toArray(rawData)).map((item) => mapNode(item));

//   /* Move 50.32.02 under 90 (Unallowable), same as the report */
//   const unallowable = top.find((n) => n.id === "90");
//   const moveIndex = top.findIndex((n) => n.id === "50.32.02");

//   if (unallowable && moveIndex !== -1) {
//     const [moved] = top.splice(moveIndex, 1);
//     if (moved.children.length > 0) {
//       unallowable.children.push(...moved.children);
//     } else {
//       unallowable.children.push(moved);
//     }
//   }

//   /* Node 90 totals are rebuilt from its children */
//   if (unallowable) {
//     const actual = {};
//     const budget = {};
//     unallowable.children.forEach((child) => {
//       mergeTotals(actual, child.monthlyTotals);
//       mergeTotals(budget, child.budgetMonthlyTotals);
//     });
//     unallowable.monthlyTotals = actual;
//     unallowable.budgetMonthlyTotals = budget;
//   }

//   return top;
// };

// /* ============================================================
//    VALUE GETTERS (same rules as getVal / getBudVal in the report)
//    ============================================================ */

// const getActualValue = (node, key) => safeNumber(node?.monthlyTotals?.[key]);

// const getBudgetValue = (node, key) => {
//   if (!node) return 0;
//   if (isAdjustmentNode(node)) return 0;

//   const isRev = normalizeName(node.name) === "revenue" || isRevenueRoot(node);

//   return safeNumber(
//     isRev
//       ? node.budgetRevenueTotals?.[key] || node.budgetMonthlyTotals?.[key] || 0
//       : node.budgetMonthlyTotals?.[key] || 0,
//   );
// };

// const classifyNodes = (nodes) => {
//   const indirectNodes = nodes.filter(isIndirectNode);

//   return {
//     revenueNode: nodes.find(isRevenueRoot),
//     directNodes: nodes.filter(isDirectNode),
//     directNonLaborNode: nodes.find(isDirectNonLaborNode),
//     indirectNodes,
//     belowTheLineNodes: indirectNodes.filter(isBelowTheLineNode),
//   };
// };

// /* ============================================================
//    PROJECT FILTER
//    For each top-level line, sum the matching project nodes
//    found anywhere below it (no double counting).
//    ============================================================ */

// const collectProjectMatches = (node, projectId, matches = []) => {
//   toArray(node.children).forEach((child) => {
//     if (isProjectNode(child) && child.id === projectId) {
//       matches.push(child);
//     } else {
//       collectProjectMatches(child, projectId, matches);
//     }
//   });
//   return matches;
// };

// const effectiveBudgetTotals = (node, inRevenueTree) => {
//   const monthly = node.budgetMonthlyTotals || {};
//   if (!inRevenueTree) return monthly;

//   const rev = node.budgetRevenueTotals || {};
//   const result = {};
//   new Set([...Object.keys(monthly), ...Object.keys(rev)]).forEach((key) => {
//     result[key] = safeNumber(rev[key]) || safeNumber(monthly[key]);
//   });
//   return result;
// };

// const applyProjectFilter = (tree, projectId) =>
//   tree.map((top) => {
//     const matches = collectProjectMatches(top, projectId);
//     const inRevenueTree = isRevenueRoot(top);

//     const monthlyTotals = {};
//     const budgetMonthlyTotals = {};

//     matches.forEach((match) => {
//       mergeTotals(monthlyTotals, match.monthlyTotals);
//       mergeTotals(
//         budgetMonthlyTotals,
//         effectiveBudgetTotals(match, inRevenueTree),
//       );
//     });

//     return {
//       ...top,
//       children: [],
//       monthlyTotals,
//       budgetMonthlyTotals,
//       budgetRevenueTotals: budgetMonthlyTotals,
//     };
//   });

// const collectProjectOptions = (nodes, map = new Map()) => {
//   nodes.forEach((node) => {
//     if (isProjectNode(node) && node.id) {
//       map.set(node.id, {
//         id: node.id,
//         name:
//           node.name && node.name !== node.id
//             ? `${node.id} – ${node.name}`
//             : node.id,
//       });
//     }
//     collectProjectOptions(toArray(node.children), map);
//   });
//   return map;
// };

// /* ============================================================
//    METRICS
//    ============================================================ */

// const pct = (numerator, denominator) =>
//   denominator !== 0 ? round2((numerator / denominator) * 100) : 0;

// const buildMetricResult = (base) => ({
//   ...base,
//   grossMargin: pct(base.grossProfit, base.revenue),
//   operatingMargin: pct(base.operatingIncome, base.revenue),
//   netMargin: pct(base.netIncome, base.revenue),
// });

// const calculateMetricsForMonth = (groups, year, month, budget = false) => {
//   const key = monthKey(year, month);
//   const val = (node) =>
//     budget ? getBudgetValue(node, key) : getActualValue(node, key);
//   const sum = (list) => list.reduce((total, node) => total + val(node), 0);

//   const REVENUE_SIGN = -1; // API returns revenue as credit (negative)

//   // in calculateMetricsForMonth
//   const revenue = round2(REVENUE_SIGN * val(groups.revenueNode));

//   const directCost = round2(
//     sum(groups.directNodes) + val(groups.directNonLaborNode),
//   );

//   const grossProfit = round2(revenue - directCost);

//   const totalIndirect = round2(sum(groups.indirectNodes));
//   const belowTheLine = round2(sum(groups.belowTheLineNodes));

//   const operatingExpenses = round2(totalIndirect - belowTheLine);
//   const operatingIncome = round2(grossProfit - operatingExpenses);

//   /* Same as "Net Profit / (Loss)" in the report */
//   const netIncome = round2(grossProfit - totalIndirect);

//   return buildMetricResult({
//     revenue,
//     directCost,
//     grossProfit,
//     operatingExpenses,
//     operatingIncome,
//     netIncome,
//   });
// };

// /* ============================================================
//    PERIOD
//    ============================================================ */

// const getPeriodMonths = (year, period, closing) => {
//   const all = MONTHS.map((m) => m.number);

//   switch (period) {
//     case "Q1":
//       return [1, 2, 3];
//     case "Q2":
//       return [4, 5, 6];
//     case "Q3":
//       return [7, 8, 9];
//     case "Q4":
//       return [10, 11, 12];

//     case "YTD": {
//       /* Months up to the closing period are actuals */
//       if (!closing) return all;
//       if (year < closing.year) return all;
//       if (year > closing.year) return [];
//       return all.filter((m) => m <= closing.month);
//     }

//     case "FULL_YEAR":
//     default:
//       return all;
//   }
// };

// const calculatePeriodMetrics = (groups, year, months, budget = false) => {
//   const monthly = months.map((month) =>
//     calculateMetricsForMonth(groups, year, month, budget),
//   );

//   const total = (field) =>
//     round2(monthly.reduce((sum, item) => sum + item[field], 0));

//   return buildMetricResult({
//     revenue: total("revenue"),
//     directCost: total("directCost"),
//     grossProfit: total("grossProfit"),
//     operatingExpenses: total("operatingExpenses"),
//     operatingIncome: total("operatingIncome"),
//     netIncome: total("netIncome"),
//   });
// };

// /* ============================================================
//    FORMATTERS
//    ============================================================ */

// const formatMoney = (value, compact = false) => {
//   const number = safeNumber(value);
//   const sign = number < 0 ? "-" : "";
//   const absolute = Math.abs(number);

//   if (compact) {
//     if (absolute >= 1_000_000_000) {
//       return `${sign}$${(absolute / 1_000_000_000).toFixed(2)}B`;
//     }
//     if (absolute >= 1_000_000) {
//       return `${sign}$${(absolute / 1_000_000).toFixed(2)}M`;
//     }
//     if (absolute >= 1_000) {
//       return `${sign}$${(absolute / 1_000).toFixed(1)}K`;
//     }
//   }

//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   }).format(number);
// };

// const formatPercent = (value) => `${safeNumber(value).toFixed(1)}%`;

// const formatAxisValue = (value) => {
//   const number = safeNumber(value);
//   const absolute = Math.abs(number);

//   if (absolute >= 1_000_000_000)
//     return `$${(number / 1_000_000_000).toFixed(1)}B`;
//   if (absolute >= 1_000_000) return `$${(number / 1_000_000).toFixed(1)}M`;
//   if (absolute >= 1_000) return `$${(number / 1_000).toFixed(0)}K`;
//   return `$${number.toFixed(0)}`;
// };

// /* ============================================================
//    CUSTOM TOOLTIP
//    ============================================================ */

// const FinancialTooltip = ({ active, payload, label, percentage = false }) => {
//   if (!active || !payload || payload.length === 0) return null;

//   return (
//     <div className="fp-tooltip">
//       <div className="fp-tooltip-title">{label}</div>

//       {payload.map((entry, index) => (
//         <div className="fp-tooltip-row" key={`${entry.dataKey}-${index}`}>
//           <span>
//             <span
//               className="fp-tooltip-dot"
//               style={{ background: entry.color }}
//             />
//             {entry.name}
//           </span>

//           <strong>
//             {percentage ? formatPercent(entry.value) : formatMoney(entry.value)}
//           </strong>
//         </div>
//       ))}
//     </div>
//   );
// };

// /* ============================================================
//    KPI CARD
//    ============================================================ */

// const KpiCard = ({
//   label,
//   value,
//   variance,
//   variancePercent,
//   isPercent = false,
//   icon,
//   positiveWhenHigher = true,
//   delay = 0,
//   showVariance = true,
//   caption = "",
// }) => {
//   const numericVariance = safeNumber(variance);
//   const isNeutral = Math.abs(numericVariance) < 0.005;
//   const isNegativeValue = safeNumber(value) < 0;

//   const favorable = positiveWhenHigher
//     ? numericVariance > 0
//     : numericVariance < 0;

//   const varianceClass = isNeutral
//     ? "neutral"
//     : favorable
//       ? "positive"
//       : "negative";

//   const Icon =
//     numericVariance > 0
//       ? FaArrowUp
//       : numericVariance < 0
//         ? FaArrowDown
//         : FaMinus;

//   return (
//     <div
//       className="fp-kpi-card fp-reveal"
//       style={{ animationDelay: `${delay}ms` }}
//     >
//       <div className="fp-kpi-top">
//         <div className="fp-kpi-label">{label}</div>
//         <div className="fp-kpi-icon">{icon}</div>
//       </div>

//       <div className={`fp-kpi-value ${isNegativeValue ? "negative" : ""}`}>
//         {isPercent ? formatPercent(value) : formatMoney(value, true)}
//       </div>

//       {showVariance ? (
//         <div className={`fp-kpi-variance ${varianceClass}`}>
//           <span className="fp-kpi-arrow">
//             <Icon />
//           </span>
//           <span>
//             {isPercent
//               ? `${Math.abs(numericVariance).toFixed(1)} pts`
//               : formatMoney(Math.abs(numericVariance), true)}
//           </span>
//           {variancePercent !== undefined && (
//             <span className="fp-kpi-vs">
//               ({formatPercent(Math.abs(variancePercent))})
//             </span>
//           )}
//           <span className="fp-kpi-vs">vs budget</span>
//         </div>
//       ) : (
//         <div className="fp-kpi-caption">{caption}</div>
//       )}
//     </div>
//   );
// };

// /* ============================================================
//    MAIN COMPONENT
//    ============================================================ */

// const METRIC_KEYS = [
//   "revenue",
//   "directCost",
//   "grossProfit",
//   "grossMargin",
//   "operatingExpenses",
//   "operatingIncome",
//   "netIncome",
// ];

// const FinancialPerformanceDashboard = () => {
//   const currentYear = new Date().getFullYear();

//   const [rawData, setRawData] = useState([]);
//   const [selectedYear, setSelectedYear] = useState(String(currentYear));
//   const [performanceView, setPerformanceView] = useState("ACTUAL_VS_BUDGET");
//   const [period, setPeriod] = useState("YTD");
//   const [selectedProject, setSelectedProject] = useState("ALL");
//   const [displayMode, setDisplayMode] = useState("AMOUNT");
//   const [showMoreFilters, setShowMoreFilters] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState("");
//   const [createdAt, setCreatedAt] = useState(null);
//   const [firstLoaded, setFirstLoaded] = useState(false);
//   const [closingPeriod, setClosingPeriod] = useState(null);

//   const isCompare = performanceView === "ACTUAL_VS_BUDGET";
//   const showActual = performanceView !== "BUDGET";
//   const showBudget = performanceView !== "ACTUAL";

//   /* ==========================================================
//      FETCH
//      ========================================================== */

//   const fetchSummary = async (bypassCache = false) => {
//     try {
//       if (bypassCache) setRefreshing(true);
//       else setLoading(true);

//       setError("");

//       const response = await fetch(
//         `${backendUrl}${SUMMARY_API_PATH}?byPassCache=${bypassCache}`,
//       );

//       if (!response.ok) {
//         throw new Error(
//           `Failed to load financial summary (${response.status})`,
//         );
//       }

//       const parsed = await response.json();
//       const responseData = Array.isArray(parsed) ? parsed : parsed?.data || [];

//       setRawData(responseData);
//       setCreatedAt(parsed?.createdAt || null);
//       setFirstLoaded(true);
//     } catch (err) {
//       console.error("Financial dashboard error:", err);
//       setError(err?.message || "Unable to load financial dashboard.");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   /* Same config call as ReportingScreen (use the same project id there) */
//   const fetchClosingPeriod = async () => {
//     try {
//       const res = await fetch(
//         `${backendUrl}/api/Configuration/GetAllConfigValuesByProject/xxxxx`,
//       );
//       if (!res.ok) return;

//       const configs = await res.json();
//       const item = Array.isArray(configs)
//         ? configs.find((c) => c.name === "closing_period")
//         : null;

//       if (item?.value) {
//         const [y, m] = String(item.value).split("-").map(Number);
//         if (y && m) setClosingPeriod({ year: y, month: m });
//       }
//     } catch (err) {
//       console.error("Closing period error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchSummary(false);
//     fetchClosingPeriod();
//   }, []);

//   /* ==========================================================
//      DATA MODEL
//      ========================================================== */

//   const statementTree = useMemo(() => buildStatementTree(rawData), [rawData]);

//   const scopedNodes = useMemo(
//     () =>
//       selectedProject === "ALL" || !selectedProject
//         ? statementTree
//         : applyProjectFilter(statementTree, selectedProject),
//     [statementTree, selectedProject],
//   );

//   const groups = useMemo(() => classifyNodes(scopedNodes), [scopedNodes]);

//   const closing = useMemo(
//     () =>
//       closingPeriod || {
//         year: currentYear,
//         month: new Date().getMonth() + 1,
//       },
//     [closingPeriod, currentYear],
//   );

//   const yearNumber = Number(selectedYear);

//   const periodMonths = useMemo(
//     () => getPeriodMonths(yearNumber, period, closing),
//     [yearNumber, period, closing],
//   );

//   /* ==========================================================
//      AVAILABLE YEARS
//      ========================================================== */

//   const availableYears = useMemo(() => {
//     const years = new Set();

//     statementTree.forEach((node) => {
//       [
//         node.monthlyTotals,
//         node.revenueTotals,
//         node.budgetMonthlyTotals,
//         node.budgetRevenueTotals,
//       ].forEach((collection) => {
//         Object.keys(collection || {}).forEach((key) => {
//           const year = key.split("-")[0];
//           if (/^\d{4}$/.test(year)) years.add(year);
//         });
//       });
//     });

//     years.add(String(selectedYear));

//     return Array.from(years).sort((a, b) => Number(b) - Number(a));
//   }, [statementTree, selectedYear]);

//   /* ==========================================================
//      PROJECT OPTIONS
//      ========================================================== */

//   const projectOptions = useMemo(
//     () =>
//       Array.from(collectProjectOptions(statementTree).values()).sort((a, b) =>
//         a.name.localeCompare(b.name),
//       ),
//     [statementTree],
//   );

//   /* ==========================================================
//      ACTUAL / BUDGET METRICS
//      ========================================================== */

//   const financialMetrics = useMemo(() => {
//     const actual = calculatePeriodMetrics(
//       groups,
//       yearNumber,
//       periodMonths,
//       false,
//     );
//     const budget = calculatePeriodMetrics(
//       groups,
//       yearNumber,
//       periodMonths,
//       true,
//     );

//     const variance = {};
//     const variancePercent = {};

//     METRIC_KEYS.forEach((key) => {
//       variance[key] = round2(actual[key] - budget[key]);
//       variancePercent[key] =
//         budget[key] !== 0
//           ? round2((variance[key] / Math.abs(budget[key])) * 100)
//           : 0;
//     });

//     return { actual, budget, variance, variancePercent };
//   }, [groups, yearNumber, periodMonths]);

//   /* ==========================================================
//      KPIs
//      ========================================================== */

//   const kpis = useMemo(() => {
//     const { actual, budget, variance, variancePercent } = financialMetrics;
//     const primary = performanceView === "BUDGET" ? budget : actual;

//     const defs = [
//       {
//         key: "revenue",
//         label: "Gross Revenue",
//         isPercent: false,
//         icon: <FaDollarSign />,
//       },
//       {
//         key: "grossProfit",
//         label: "Gross Profit",
//         isPercent: false,
//         icon: <FaChartLine />,
//       },
//       {
//         key: "grossMargin",
//         label: "Gross Margin",
//         isPercent: true,
//         icon: <FaPercentage />,
//       },
//       {
//         key: "operatingIncome",
//         label: "Operating Income",
//         isPercent: false,
//         icon: <FaChartLine />,
//       },
//       {
//         key: "netIncome",
//         label: "Net Income",
//         isPercent: false,
//         icon: <FaDollarSign />,
//       },
//     ];

//     return defs.map((d) => ({
//       ...d,
//       value: primary[d.key],
//       variance: variance[d.key],
//       variancePercent: d.isPercent ? undefined : variancePercent[d.key],
//     }));
//   }, [financialMetrics, performanceView]);

//   /* ==========================================================
//      CHART DATA
//      ========================================================== */

//   const performanceChartData = useMemo(() => {
//     const { actual, budget } = financialMetrics;
//     return [
//       { metric: "Revenue", actual: actual.revenue, budget: budget.revenue },
//       {
//         metric: "Gross Profit",
//         actual: actual.grossProfit,
//         budget: budget.grossProfit,
//       },
//       {
//         metric: "Operating Income",
//         actual: actual.operatingIncome,
//         budget: budget.operatingIncome,
//       },
//       {
//         metric: "Net Income",
//         actual: actual.netIncome,
//         budget: budget.netIncome,
//       },
//     ];
//   }, [financialMetrics]);

//   const monthlySeries = useMemo(
//     () =>
//       periodMonths.map((month) => ({
//         month: MONTHS.find((m) => m.number === month)?.short || month,
//         actual: calculateMetricsForMonth(groups, yearNumber, month, false),
//         budget: calculateMetricsForMonth(groups, yearNumber, month, true),
//       })),
//     [groups, yearNumber, periodMonths],
//   );

//   const monthlyTrendData = useMemo(
//     () =>
//       monthlySeries.map(({ month, actual, budget }) => ({
//         month,
//         revenue: actual.revenue,
//         budgetRevenue: budget.revenue,
//         grossProfit: actual.grossProfit,
//         budgetGrossProfit: budget.grossProfit,
//         operatingIncome: actual.operatingIncome,
//         budgetOperatingIncome: budget.operatingIncome,
//       })),
//     [monthlySeries],
//   );

//   const marginTrendData = useMemo(
//     () =>
//       monthlySeries.map(({ month, actual, budget }) => ({
//         month,
//         actualGrossMargin: actual.grossMargin,
//         budgetGrossMargin: budget.grossMargin,
//         actualOperatingMargin: actual.operatingMargin,
//         budgetOperatingMargin: budget.operatingMargin,
//       })),
//     [monthlySeries],
//   );

//   /* Direct cost mix for the selected period (top-level direct nodes) */
//   const revenueComposition = useMemo(() => {
//     const nodes = [
//       ...groups.directNodes,
//       ...(groups.directNonLaborNode ? [groups.directNonLaborNode] : []),
//     ];
//     const read = performanceView === "BUDGET" ? getBudgetValue : getActualValue;

//     return nodes
//       .map((node) => ({
//         name: node.name,
//         value: Math.abs(
//           round2(
//             periodMonths.reduce(
//               (sum, month) => sum + read(node, monthKey(yearNumber, month)),
//               0,
//             ),
//           ),
//         ),
//       }))
//       .filter((item) => item.value > 0);
//   }, [groups, yearNumber, periodMonths, performanceView]);

//   /* ==========================================================
//      VARIANCE DRIVERS
//      ========================================================== */

//   const varianceDrivers = useMemo(() => {
//     const { actual, budget, variance } = financialMetrics;
//     const compare = performanceView === "ACTUAL_VS_BUDGET";
//     const source = performanceView === "BUDGET" ? budget : actual;

//     const defs = [
//       { label: "Revenue", key: "revenue", positiveIsGood: true },
//       { label: "Direct Costs", key: "directCost", positiveIsGood: false },
//       { label: "Gross Profit", key: "grossProfit", positiveIsGood: true },
//       {
//         label: "Operating Expenses",
//         key: "operatingExpenses",
//         positiveIsGood: false,
//       },
//       {
//         label: "Operating Income",
//         key: "operatingIncome",
//         positiveIsGood: true,
//       },
//       { label: "Net Income", key: "netIncome", positiveIsGood: true },
//     ];

//     return defs
//       .map((d) => {
//         const amount = compare ? variance[d.key] : source[d.key];
//         const favorable = d.positiveIsGood ? amount > 0 : amount < 0;
//         const tone = compare
//           ? favorable
//             ? "positive"
//             : "negative"
//           : amount < 0
//             ? "negative"
//             : "neutral";

//         return {
//           label: d.label,
//           variance: amount,
//           favorable,
//           tone,
//           magnitude: Math.abs(amount),
//         };
//       })
//       .filter((item) => item.magnitude > 0.01)
//       .sort((a, b) => b.magnitude - a.magnitude)
//       .slice(0, compare ? 5 : 6);
//   }, [financialMetrics, performanceView]);

//   const maxDriverMagnitude = useMemo(
//     () => Math.max(...varianceDrivers.map((d) => d.magnitude), 1),
//     [varianceDrivers],
//   );

//   /* ==========================================================
//      HEADER LABELS
//      ========================================================== */

//   const periodLabel = useMemo(() => {
//     const base =
//       { Q1: "Q1", Q2: "Q2", Q3: "Q3", Q4: "Q4", FULL_YEAR: "Full Year" }[
//         period
//       ] || "YTD";

//     /* Months after the closing period are forecast, so the figure is EAC */
//     const hasForecast = periodMonths.some(
//       (m) =>
//         yearNumber > closing.year ||
//         (yearNumber === closing.year && m > closing.month),
//     );

//     return hasForecast ? `${base} · EAC` : base;
//   }, [period, periodMonths, yearNumber, closing]);

//   const performanceLabel = useMemo(() => {
//     switch (performanceView) {
//       case "ACTUAL":
//         return "Actual";
//       case "BUDGET":
//         return "Budget";
//       default:
//         return "Actual vs Budget";
//     }
//   }, [performanceView]);

//   const viewMetrics =
//     performanceView === "BUDGET"
//       ? financialMetrics.budget
//       : financialMetrics.actual;

//   /* ==========================================================
//      LOADING SCREEN
//      ========================================================== */

//   if (loading && !firstLoaded) {
//     return (
//       <>
//         <style>{styles}</style>

//         <div className="fp-page fp-loading-page">
//           <div className="fp-loading-content">
//             <div className="fp-logo-pulse">
//               <FaChartLine />
//             </div>
//             <div className="fp-loading-title">
//               Preparing Financial Performance
//             </div>
//             <div className="fp-loading-subtitle">
//               Loading financial data and calculating performance...
//             </div>
//             <div className="fp-loading-bar">
//               <div className="fp-loading-bar-inner" />
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   /* ==========================================================
//      ERROR
//      ========================================================== */

//   if (error && !firstLoaded) {
//     return (
//       <>
//         <style>{styles}</style>

//         <div className="fp-page">
//           <div className="fp-error-card">
//             <div className="fp-error-icon">!</div>
//             <h2>Unable to load dashboard</h2>
//             <p>{error}</p>
//             <button
//               className="fp-primary-button"
//               onClick={() => fetchSummary(true)}
//             >
//               <FaSyncAlt />
//               Retry
//             </button>
//           </div>
//         </div>
//       </>
//     );
//   }

//   /* ==========================================================
//      RENDER
//      ========================================================== */

//   return (
//     <>
//       <style>{styles}</style>

//       <div className="fp-page">
//         <div className={`fp-dashboard ${refreshing ? "fp-is-refreshing" : ""}`}>
//           {/* HEADER */}
//           <header className="fp-header fp-reveal">
//             <div className="fp-header-left">
//               <div className="fp-eyebrow">FINANCIAL PERFORMANCE</div>
//               <h1>Financial Performance</h1>
//               <p>
//                 FY{selectedYear} · {periodLabel} · {performanceLabel}
//               </p>
//             </div>

//             <div className="fp-header-right">
//               <div className="fp-live-status">
//                 <span className="fp-live-dot" />
//                 Financial Summary
//               </div>

//               {createdAt && (
//                 <div className="fp-updated">
//                   Updated {new Date(createdAt).toLocaleString()}
//                 </div>
//               )}
//             </div>
//           </header>

//           {/* FILTER BAR */}
//           <section className="fp-filter-shell fp-reveal">
//             <div className="fp-filter-main">
//               <div className="fp-filter">
//                 <div className="fp-filter-label">
//                   <FaCalendarAlt />
//                   Fiscal Year
//                 </div>
//                 <div className="fp-select-wrap">
//                   <select
//                     value={selectedYear}
//                     onChange={(e) => setSelectedYear(e.target.value)}
//                   >
//                     {availableYears.map((year) => (
//                       <option key={year} value={year}>
//                         FY{year}
//                       </option>
//                     ))}
//                   </select>
//                   <FaChevronDown />
//                 </div>
//               </div>

//               <div className="fp-filter">
//                 <div className="fp-filter-label">
//                   <FaChartLine />
//                   Performance
//                 </div>
//                 <div className="fp-select-wrap">
//                   <select
//                     value={performanceView}
//                     onChange={(e) => setPerformanceView(e.target.value)}
//                   >
//                     <option value="ACTUAL_VS_BUDGET">Actual vs Budget</option>
//                     <option value="ACTUAL">Actual</option>
//                     <option value="BUDGET">Budget</option>
//                   </select>
//                   <FaChevronDown />
//                 </div>
//               </div>

//               <div className="fp-filter">
//                 <div className="fp-filter-label">
//                   <FaCalendarAlt />
//                   Period
//                 </div>
//                 <div className="fp-select-wrap">
//                   <select
//                     value={period}
//                     onChange={(e) => setPeriod(e.target.value)}
//                   >
//                     <option value="YTD">YTD</option>
//                     <option value="Q1">Q1</option>
//                     <option value="Q2">Q2</option>
//                     <option value="Q3">Q3</option>
//                     <option value="Q4">Q4</option>
//                     <option value="FULL_YEAR">Full Year</option>
//                   </select>
//                   <FaChevronDown />
//                 </div>
//               </div>

//               {projectOptions.length > 0 && (
//                 <div className="fp-filter fp-project-filter">
//                   <div className="fp-filter-label">Project</div>
//                   <div className="fp-select-wrap">
//                     <select
//                       value={selectedProject}
//                       onChange={(e) => setSelectedProject(e.target.value)}
//                     >
//                       <option value="ALL">All Projects</option>
//                       {projectOptions.map((project) => (
//                         <option key={project.id} value={project.id}>
//                           {project.name}
//                         </option>
//                       ))}
//                     </select>
//                     <FaChevronDown />
//                   </div>
//                 </div>
//               )}

//               {/* <button
//                 className={`fp-filter-button ${showMoreFilters ? "active" : ""}`}
//                 onClick={() => setShowMoreFilters((value) => !value)}
//               >
//                 <FaFilter />
//                 Filters
//               </button> */}

//               <button
//                 className="fp-refresh-button"
//                 onClick={() => fetchSummary(true)}
//                 disabled={refreshing}
//                 title="Refresh financial data"
//               >
//                 <FaSyncAlt className={refreshing ? "fp-spin" : ""} />
//                 <span>{refreshing ? "Refreshing" : "Refresh"}</span>
//               </button>
//             </div>

//             {showMoreFilters && (
//               <div className="fp-more-filters">
//                 <div>
//                   <div className="fp-more-label">Display</div>
//                   <div className="fp-segmented">
//                     <button
//                       className={displayMode === "AMOUNT" ? "active" : ""}
//                       onClick={() => setDisplayMode("AMOUNT")}
//                     >
//                       <FaDollarSign />
//                       Amount
//                     </button>
//                     <button
//                       className={displayMode === "PERCENT" ? "active" : ""}
//                       onClick={() => setDisplayMode("PERCENT")}
//                     >
//                       <FaPercentage />
//                       Percentage
//                     </button>
//                   </div>
//                 </div>

//                 <div className="fp-filter-note">
//                   <strong>Dashboard view</strong>
//                   <span>
//                     Numbers are calculated from the same summary structure used
//                     by the Income Statement report.
//                   </span>
//                 </div>
//               </div>
//             )}
//           </section>

//           {/* KPI ROW */}
//           <section className="fp-kpi-grid">
//             {kpis.map((kpi, index) => (
//               <KpiCard
//                 key={`${kpi.key}-${performanceView}`}
//                 label={kpi.label}
//                 value={kpi.value}
//                 variance={kpi.variance}
//                 variancePercent={kpi.variancePercent}
//                 isPercent={kpi.isPercent}
//                 icon={kpi.icon}
//                 positiveWhenHigher={true}
//                 delay={100 + index * 70}
//                 showVariance={isCompare}
//                 caption={`${performanceView === "BUDGET" ? "Budget" : "Actual"} · ${periodLabel}`}
//               />
//             ))}
//           </section>

//           {/* PRIMARY CHARTS */}
//           <section className="fp-main-grid">
//             <div className="fp-card fp-large-card fp-reveal">
//               <div className="fp-card-header">
//                 <div>
//                   <div className="fp-card-kicker">PERFORMANCE</div>
//                   <h2>
//                     {isCompare
//                       ? "Budget vs Actual"
//                       : showBudget
//                         ? "Budget"
//                         : "Actual"}{" "}
//                     Performance
//                   </h2>
//                   <p>Financial performance across the selected period</p>
//                 </div>
//                 <div className="fp-card-chip">FY{selectedYear}</div>
//               </div>

//               <div className="fp-chart-area fp-bar-chart">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     key={performanceView}
//                     data={performanceChartData}
//                     margin={{ top: 15, right: 10, left: 0, bottom: 10 }}
//                     barGap={8}
//                   >
//                     <CartesianGrid
//                       strokeDasharray="3 3"
//                       vertical={false}
//                       stroke="#E8EBEF"
//                     />
//                     <XAxis
//                       dataKey="metric"
//                       axisLine={false}
//                       tickLine={false}
//                       tick={{ fill: "#667085", fontSize: 11 }}
//                     />
//                     <YAxis
//                       axisLine={false}
//                       tickLine={false}
//                       tick={{ fill: "#667085", fontSize: 11 }}
//                       tickFormatter={formatAxisValue}
//                     />
//                     <Tooltip
//                       content={<FinancialTooltip />}
//                       cursor={{ fill: "rgba(48,79,109,0.04)" }}
//                     />
//                     <Legend
//                       verticalAlign="top"
//                       align="right"
//                       height={35}
//                       iconType="circle"
//                       wrapperStyle={{ fontSize: 11, color: "#667085" }}
//                     />
//                     {showBudget && (
//                       <Bar
//                         name="Budget"
//                         dataKey="budget"
//                         fill={COLORS.blue}
//                         radius={[5, 5, 0, 0]}
//                         animationBegin={150}
//                         animationDuration={1100}
//                       />
//                     )}
//                     {showActual && (
//                       <Bar
//                         name="Actual"
//                         dataKey="actual"
//                         fill={COLORS.gold}
//                         radius={[5, 5, 0, 0]}
//                         animationBegin={250}
//                         animationDuration={1200}
//                       />
//                     )}
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div className="fp-card fp-variance-card fp-reveal">
//               <div className="fp-card-header">
//                 <div>
//                   <div className="fp-card-kicker">
//                     {isCompare ? "VARIANCE" : "BREAKDOWN"}
//                   </div>
//                   <h2>{isCompare ? "Performance Drivers" : "Key Figures"}</h2>
//                   <p>
//                     {isCompare
//                       ? "Largest movements vs budget"
//                       : `${showBudget ? "Budget" : "Actual"} figures for the selected period`}
//                   </p>
//                 </div>
//               </div>

//               <div className="fp-driver-list">
//                 {varianceDrivers.length === 0 ? (
//                   <div className="fp-empty">No material variance detected.</div>
//                 ) : (
//                   varianceDrivers.map((driver, index) => (
//                     <div
//                       className="fp-driver"
//                       key={driver.label}
//                       style={{ animationDelay: `${250 + index * 80}ms` }}
//                     >
//                       <div className="fp-driver-index">
//                         {String(index + 1).padStart(2, "0")}
//                       </div>

//                       <div className="fp-driver-content">
//                         <div className="fp-driver-top">
//                           <span>{driver.label}</span>
//                           {/* <strong
//                             className={
//                               driver.favorable ? "positive" : "negative"
//                             }
//                           >
//                             {driver.variance > 0 ? "+" : "-"}
//                             {formatMoney(Math.abs(driver.variance), true)}
//                           </strong> */}
//                           <strong className={driver.tone}>
//                             {isCompare
//                               ? `${driver.variance > 0 ? "+" : "-"}${formatMoney(Math.abs(driver.variance), true)}`
//                               : formatMoney(driver.variance, true)}
//                           </strong>
//                         </div>

//                         <div className="fp-driver-bar">
//                           <div
//                             className={
//                               driver.tone === "positive"
//                                 ? "favorable"
//                                 : driver.tone === "negative"
//                                   ? "unfavorable"
//                                   : "neutral"
//                             }
//                             style={{
//                               width: `${Math.min(100, Math.max(8, (driver.magnitude / maxDriverMagnitude) * 100))}%`,
//                             }}
//                           />
//                         </div>

//                         <div className="fp-driver-bottom">
//                           <span>
//                             {isCompare
//                               ? driver.favorable
//                                 ? "Favorable"
//                                 : "Unfavorable"
//                               : showBudget
//                                 ? "Budget"
//                                 : "Actual"}
//                           </span>
//                           <span>{isCompare ? "vs budget" : periodLabel}</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </section>

//           {/* MONTHLY TREND */}
//           <section className="fp-card fp-reveal">
//             <div className="fp-card-header">
//               <div>
//                 <div className="fp-card-kicker">TREND</div>
//                 <h2>Revenue & Profitability Trend</h2>
//                 <p>
//                   {isCompare
//                     ? "Monthly actual performance compared with budget"
//                     : `Monthly ${showBudget ? "budget" : "actual"} performance`}
//                 </p>
//               </div>

//               <div className="fp-legend-inline">
//                 {showActual && (
//                   <span>
//                     <i style={{ background: COLORS.gold }} />
//                     Actual
//                   </span>
//                 )}
//                 {showBudget && (
//                   <span>
//                     <i style={{ background: COLORS.blue }} />
//                     Budget
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div className="fp-chart-area fp-trend-chart">
//               <ResponsiveContainer width="100%" height="100%">
//                 <ComposedChart
//                   data={monthlyTrendData}
//                   margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
//                 >
//                   <defs>
//                     <linearGradient
//                       id="revenueGradient"
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >
//                       <stop
//                         offset="5%"
//                         stopColor={COLORS.gold}
//                         stopOpacity={0.22}
//                       />
//                       <stop
//                         offset="95%"
//                         stopColor={COLORS.gold}
//                         stopOpacity={0}
//                       />
//                     </linearGradient>
//                   </defs>

//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     vertical={false}
//                     stroke="#E8EBEF"
//                   />
//                   <XAxis
//                     dataKey="month"
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fill: "#667085", fontSize: 11 }}
//                   />
//                   <YAxis
//                     axisLine={false}
//                     tickLine={false}
//                     tick={{ fill: "#667085", fontSize: 11 }}
//                     tickFormatter={formatAxisValue}
//                   />
//                   <Tooltip content={<FinancialTooltip />} />
//                   <Legend
//                     verticalAlign="top"
//                     align="right"
//                     height={35}
//                     iconType="circle"
//                     wrapperStyle={{ fontSize: 11 }}
//                   />

//                   {showActual && (
//                     <Area
//                       type="monotone"
//                       name="Actual Revenue"
//                       dataKey="revenue"
//                       stroke={COLORS.gold}
//                       strokeWidth={3}
//                       fill="url(#revenueGradient)"
//                       dot={{ r: 3, strokeWidth: 2 }}
//                       activeDot={{ r: 5 }}
//                       animationBegin={200}
//                       animationDuration={1300}
//                     />
//                   )}
//                   {showBudget && (
//                     <Line
//                       type="monotone"
//                       name="Budget Revenue"
//                       dataKey="budgetRevenue"
//                       stroke={COLORS.blue}
//                       strokeWidth={showActual ? 2 : 3}
//                       strokeDasharray={showActual ? "6 5" : undefined}
//                       dot={showActual ? false : { r: 3 }}
//                       animationBegin={350}
//                       animationDuration={1400}
//                     />
//                   )}
//                 </ComposedChart>
//               </ResponsiveContainer>
//             </div>
//           </section>

//           {/* BOTTOM GRID */}
//           <section className="fp-bottom-grid">
//             <div className="fp-card fp-reveal">
//               <div className="fp-card-header">
//                 <div>
//                   <div className="fp-card-kicker">PROFITABILITY</div>
//                   <h2>Margin Trend</h2>
//                   <p>Actual vs budget margin</p>
//                 </div>
//               </div>

//               <div className="fp-chart-area fp-small-chart">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart
//                     data={marginTrendData}
//                     margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
//                   >
//                     <CartesianGrid
//                       strokeDasharray="3 3"
//                       vertical={false}
//                       stroke="#E8EBEF"
//                     />
//                     <XAxis
//                       dataKey="month"
//                       axisLine={false}
//                       tickLine={false}
//                       tick={{ fill: "#667085", fontSize: 10 }}
//                     />
//                     <YAxis
//                       axisLine={false}
//                       tickLine={false}
//                       tick={{ fill: "#667085", fontSize: 10 }}
//                       tickFormatter={(v) => `${v}%`}
//                     />
//                     <Tooltip content={<FinancialTooltip percentage />} />
//                     <Legend
//                       verticalAlign="top"
//                       align="right"
//                       height={30}
//                       iconType="circle"
//                       wrapperStyle={{ fontSize: 10 }}
//                     />
//                     {showActual && (
//                       <Line
//                         type="monotone"
//                         name="Gross Margin"
//                         dataKey="actualGrossMargin"
//                         stroke={COLORS.green}
//                         strokeWidth={3}
//                         dot={{ r: 2 }}
//                         animationBegin={200}
//                         animationDuration={1100}
//                       />
//                     )}
//                     {showBudget && (
//                       <Line
//                         type="monotone"
//                         name="Budget Margin"
//                         dataKey="budgetGrossMargin"
//                         stroke={COLORS.blue}
//                         strokeWidth={showActual ? 2 : 3}
//                         strokeDasharray={showActual ? "5 4" : undefined}
//                         dot={showActual ? false : { r: 2 }}
//                         animationBegin={300}
//                         animationDuration={1200}
//                       />
//                     )}
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             <div className="fp-card fp-reveal">
//               <div className="fp-card-header">
//                 <div>
//                   <div className="fp-card-kicker">MIX</div>
//                   <h2>Direct Cost Composition</h2>
//                   <p>Selected period direct cost mix</p>
//                 </div>
//               </div>

//               <div className="fp-mix-content">
//                 <div className="fp-donut">
//                   {revenueComposition.length > 0 ? (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={revenueComposition}
//                           dataKey="value"
//                           nameKey="name"
//                           cx="50%"
//                           cy="50%"
//                           innerRadius="58%"
//                           outerRadius="78%"
//                           paddingAngle={2}
//                           animationBegin={250}
//                           animationDuration={1200}
//                         >
//                           {revenueComposition.map((entry, index) => (
//                             <Cell
//                               key={entry.name}
//                               fill={PIE_COLORS[index % PIE_COLORS.length]}
//                             />
//                           ))}
//                         </Pie>
//                         <Tooltip
//                           formatter={(value) => formatMoney(value, true)}
//                         />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   ) : (
//                     <div className="fp-empty">No composition data</div>
//                   )}
//                 </div>

//                 <div className="fp-mix-legend">
//                   {revenueComposition.map((item, index) => (
//                     <div className="fp-mix-row" key={item.name}>
//                       <span className="fp-mix-name">
//                         <i
//                           style={{
//                             background: PIE_COLORS[index % PIE_COLORS.length],
//                           }}
//                         />
//                         {item.name}
//                       </span>
//                       <strong>{formatMoney(item.value, true)}</strong>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* SUMMARY STRIP */}
//           <section className="fp-summary-strip fp-reveal">
//             {[
//               {
//                 label: "Gross Margin",
//                 value: viewMetrics.grossMargin,
//                 pct: true,
//               },
//               {
//                 label: "Operating Margin",
//                 value: viewMetrics.operatingMargin,
//                 pct: true,
//               },
//               { label: "Direct Costs", value: viewMetrics.directCost },
//               {
//                 label: "Operating Expenses",
//                 value: viewMetrics.operatingExpenses,
//               },
//               { label: "Net Margin", value: viewMetrics.netMargin, pct: true },
//             ].map((item) => (
//               <div key={item.label}>
//                 <span>{item.label}</span>
//                 <strong className={item.value < 0 ? "neg" : ""}>
//                   {item.pct
//                     ? formatPercent(item.value)
//                     : formatMoney(item.value, true)}
//                 </strong>
//               </div>
//             ))}
//           </section>

//           {error && (
//             <div className="fp-refresh-warning">
//               <span>Latest refresh failed: {error}</span>
//               <button onClick={() => fetchSummary(true)}>Retry</button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// /* ============================================================
//    STYLES
//    ============================================================ */

// const styles = `
//   * { box-sizing: border-box; }

//   .fp-page {
//     width: 100%;
//     min-height: 100vh;
//     background:
//       radial-gradient(circle at top right, rgba(176,122,50,0.07), transparent 28%),
//       #f7f8fa;
//     padding: 28px;
//     color: #263238;
//     font-family: Inter, ui-sans-serif, system-ui, -apple-system,
//       BlinkMacSystemFont, "Segoe UI", sans-serif;
//   }

//   .fp-dashboard { width: 100%; max-width: 1680px; margin: 0 auto; }

//   /* REVEAL */
//   .fp-reveal { animation: fpFadeUp 700ms cubic-bezier(.22,1,.36,1) both; }

//   @keyframes fpFadeUp {
//     from { opacity: 0; transform: translateY(18px) scale(.985); }
//     to { opacity: 1; transform: translateY(0) scale(1); }
//   }
//   @keyframes fpFadeIn { from { opacity: 0; } to { opacity: 1; } }

//   /* HEADER */
//   .fp-header {
//     display: flex;
//     align-items: flex-end;
//     justify-content: space-between;
//     gap: 30px;
//     margin-bottom: 22px;
//   }
//   .fp-eyebrow {
//     color: #8b5a24;
//     font-size: 11px;
//     font-weight: 700;
//     letter-spacing: .16em;
//     margin-bottom: 7px;
//   }
//   .fp-header h1 {
//     margin: 0;
//     font-size: clamp(27px, 3vw, 39px);
//     line-height: 1.08;
//     letter-spacing: -.035em;
//     font-weight: 720;
//     color: #27313a;
//   }
//   .fp-header p {
//     margin: 8px 0 0;
//     color: #7a8590;
//     font-size: 13px;
//     font-weight: 500;
//   }
//   .fp-header-right { text-align: right; }
//   .fp-live-status {
//     display: inline-flex;
//     align-items: center;
//     gap: 7px;
//     padding: 7px 11px;
//     border-radius: 999px;
//     background: rgba(98,131,97,.09);
//     color: #557457;
//     font-size: 11px;
//     font-weight: 700;
//   }
//   .fp-live-dot {
//     width: 7px;
//     height: 7px;
//     border-radius: 50%;
//     background: #628361;
//     box-shadow: 0 0 0 4px rgba(98,131,97,.10);
//   }
//   .fp-updated { margin-top: 8px; color: #98a1aa; font-size: 10px; }

//   /* FILTERS */
//   .fp-filter-shell {
//     background: rgba(255,255,255,.92);
//     border: 1px solid #e7e9ec;
//     border-radius: 15px;
//     box-shadow: 0 5px 18px rgba(30,41,59,.045);
//     margin-bottom: 20px;
//     overflow: hidden;
//   }
//   .fp-filter-main {
//     min-height: 74px;
//     display: flex;
//     align-items: center;
//     gap: 11px;
//     padding: 12px 14px;
//     flex-wrap: wrap;
//   }
//   .fp-filter { min-width: 155px; flex: 1; }
//   .fp-project-filter { min-width: 180px; }
//   .fp-filter-label {
//     display: flex;
//     align-items: center;
//     gap: 6px;
//     color: #89929c;
//     font-size: 9px;
//     font-weight: 750;
//     letter-spacing: .08em;
//     text-transform: ;
//     margin: 0 0 5px 2px;
//   }
//   .fp-filter-label svg { font-size: 9px; }
//   .fp-select-wrap { position: relative; }
//   .fp-select-wrap select {
//     appearance: none;
//     width: 100%;
//     height: 38px;
//     border: 1px solid #e0e4e8;
//     background: #fafbfc;
//     color: #34404a;
//     border-radius: 9px;
//     padding: 0 31px 0 11px;
//     font-size: 12px;
//     font-weight: 600;
//     outline: none;
//     cursor: pointer;
//     transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
//   }
//   .fp-select-wrap select:hover { background: #fff; border-color: #c9d0d7; }
//   .fp-select-wrap select:focus {
//     background: #fff;
//     border-color: #8da2b6;
//     box-shadow: 0 0 0 3px rgba(72,105,135,.08);
//   }
//   .fp-select-wrap > svg {
//     pointer-events: none;
//     position: absolute;
//     right: 11px;
//     top: 50%;
//     transform: translateY(-50%);
//     color: #87919b;
//     font-size: 9px;
//   }
//   .fp-filter-button,
//   .fp-refresh-button {
//     height: 38px;
//     margin-top: 16px;
//     border-radius: 9px;
//     border: 1px solid #dfe3e7;
//     padding: 0 13px;
//     display: inline-flex;
//     align-items: center;
//     justify-content: center;
//     gap: 7px;
//     font-size: 11px;
//     font-weight: 700;
//     cursor: pointer;
//     transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
//   }
//   .fp-filter-button { background: #fff; color: #53606b; }
//   .fp-filter-button:hover,
//   .fp-filter-button.active { background: #f2f5f7; border-color: #cbd3da; }
//   .fp-refresh-button {
//     background: #304f6d;
//     border-color: #304f6d;
//     color: #fff;
//     min-width: 90px;
//   }
//   .fp-refresh-button:hover:not(:disabled) {
//     transform: translateY(-1px);
//     background: #27445f;
//   }
//   .fp-refresh-button:disabled { opacity: .65; cursor: not-allowed; }

//   .fp-more-filters {
//     display: flex;
//     align-items: center;
//     gap: 30px;
//     border-top: 1px solid #edf0f2;
//     padding: 14px 16px;
//     background: #fbfcfd;
//     animation: fpMoreFilters 240ms cubic-bezier(.22,1,.36,1);
//   }
//   @keyframes fpMoreFilters {
//     from { opacity: 0; transform: translateY(-5px); }
//     to { opacity: 1; transform: translateY(0); }
//   }
//   .fp-more-label {
//     color: #89929c;
//     font-size: 9px;
//     font-weight: 750;
//     text-transform: ;
//     letter-spacing: .08em;
//     margin-bottom: 7px;
//   }
//   .fp-segmented {
//     display: flex;
//     padding: 3px;
//     border: 1px solid #e0e4e8;
//     background: #fff;
//     border-radius: 9px;
//   }
//   .fp-segmented button {
//     border: 0;
//     background: transparent;
//     padding: 7px 11px;
//     border-radius: 6px;
//     color: #7b858f;
//     font-size: 10px;
//     font-weight: 700;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     gap: 5px;
//   }
//   .fp-segmented button.active { background: #304f6d; color: white; }
//   .fp-filter-note {
//     display: flex;
//     flex-direction: column;
//     gap: 3px;
//     padding-left: 20px;
//     border-left: 1px solid #e3e7eb;
//   }
//   .fp-filter-note strong { color: #47525c; font-size: 11px; }
//   .fp-filter-note span { color: #8a949d; font-size: 10px; }

//   /* KPI */
//   .fp-kpi-grid {
//     display: grid;
//     grid-template-columns: repeat(5, minmax(0, 1fr));
//     gap: 13px;
//     margin-bottom: 17px;
//   }
//   .fp-kpi-card {
//     position: relative;
//     background: #fff;
//     border: 1px solid #e7e9ec;
//     border-radius: 14px;
//     padding: 17px 17px 15px;
//     min-height: 135px;
//     box-shadow: 0 5px 16px rgba(30,41,59,.045);
//     overflow: hidden;
//   }
//   .fp-kpi-card::before {
//     content: "";
//     position: absolute;
//     left: 0;
//     top: 0;
//     width: 100%;
//     height: 3px;
//     background: linear-gradient(90deg, #304f6d, #f59e0b);
//     opacity: .9;
//   }
//   .fp-kpi-top { display: flex; align-items: center; justify-content: space-between; }
//   .fp-kpi-label {
//     color: #8a939c;
//     font-size: 10px;
//     font-weight: 750;
//     letter-spacing: .06em;
//     text-transform: ;
//   }
//   .fp-kpi-icon {
//     width: 27px;
//     height: 27px;
//     border-radius: 8px;
//     background: #f4f6f8;
//     color: #64788a;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 11px;
//   }
//   .fp-kpi-value {
//     margin-top: 14px;
//     color: #303840;
//     font-size: clamp(21px, 2vw, 29px);
//     font-weight: 720;
//     letter-spacing: -.035em;
//     line-height: 1;
//   }
//   .fp-kpi-variance {
//     display: flex;
//     align-items: center;
//     flex-wrap: wrap;
//     gap: 4px;
//     margin-top: 12px;
//     font-size: 10px;
//     font-weight: 700;
//   }
//   .fp-kpi-variance.positive { color: #628361; }
//   .fp-kpi-variance.negative { color: #b34b32; }
//   .fp-kpi-variance.neutral { color: #89929c; }
//   .fp-kpi-arrow { display: flex; font-size: 8px; }
//   .fp-kpi-vs { opacity: .72; font-weight: 550; }

//   /* CARDS */
//   .fp-main-grid {
//     display: grid;
//     grid-template-columns: minmax(0, 1.65fr) minmax(320px, .85fr);
//     gap: 17px;
//     margin-bottom: 17px;
//   }
//   .fp-bottom-grid {
//     display: grid;
//     grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr);
//     gap: 17px;
//     margin-top: 17px;
//   }
//   .fp-card {
//     background: #fff;
//     border: 1px solid #e7e9ec;
//     border-radius: 15px;
//     padding: 18px;
//     box-shadow: 0 5px 18px rgba(30,41,59,.045);
//     min-width: 0;
//   }
//   .fp-large-card { min-height: 440px; }
//   .fp-variance-card { min-height: 440px; }
//   .fp-card-header {
//     display: flex;
//     align-items: flex-start;
//     justify-content: space-between;
//     gap: 15px;
//     margin-bottom: 7px;
//   }
//   .fp-card-kicker {
//     color: #a06b2e;
//     font-size: 9px;
//     font-weight: 800;
//     letter-spacing: .12em;
//     margin-bottom: 4px;
//   }
//   .fp-card h2 {
//     margin: 0;
//     color: #303840;
//     font-size: 17px;
//     letter-spacing: -.025em;
//     font-weight: 720;
//   }
//   .fp-card p { margin: 4px 0 0; color: #9099a2; font-size: 10px; }
//   .fp-card-chip {
//     border: 1px solid #e3e7eb;
//     background: #f8fafb;
//     color: #687580;
//     border-radius: 999px;
//     padding: 5px 9px;
//     font-size: 9px;
//     font-weight: 700;
//   }
//   .fp-chart-area { width: 100%; margin-top: 12px; }
//   .fp-bar-chart { height: 335px; }
//   .fp-trend-chart { height: 335px; }
//   .fp-small-chart { height: 280px; }

//   /* TOOLTIP */
//   .fp-tooltip {
//     background: #fff;
//     border: 1px solid #e3e7eb;
//     border-radius: 10px;
//     padding: 10px 12px;
//     box-shadow: 0 8px 24px rgba(30,41,59,.12);
//     min-width: 170px;
//   }
//   .fp-tooltip-title {
//     color: #303840;
//     font-size: 11px;
//     font-weight: 750;
//     margin-bottom: 7px;
//   }
//   .fp-tooltip-row {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     gap: 14px;
//     color: #68737c;
//     font-size: 11px;
//     padding: 2px 0;
//   }
//   .fp-tooltip-row strong { color: #303840; }
//   .fp-tooltip-dot {
//     display: inline-block;
//     width: 7px;
//     height: 7px;
//     border-radius: 50%;
//     margin-right: 6px;
//   }

//   /* VARIANCE DRIVERS */
//   .fp-driver-list { margin-top: 22px; }
//   .fp-driver {
//     display: flex;
//     gap: 12px;
//     padding: 13px 0;
//     border-bottom: 1px solid #eef0f2;
//     animation: fpFadeUp 600ms cubic-bezier(.22,1,.36,1) both;
//   }
//   .fp-driver:last-child { border-bottom: 0; }
//   .fp-driver-index {
//     width: 26px;
//     height: 26px;
//     flex: 0 0 26px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     border-radius: 7px;
//     background: #f3f5f7;
//     color: #89939c;
//     font-size: 9px;
//     font-weight: 800;
//   }
//   .fp-driver-content { flex: 1; min-width: 0; }
//   .fp-driver-top {
//     display: flex;
//     justify-content: space-between;
//     gap: 10px;
//     font-size: 11px;
//     font-weight: 650;
//     color: #4a555e;
//   }
//   .fp-driver-top strong { font-size: 11px; }
//   .fp-driver-top strong.positive { color: #628361; }
//   .fp-driver-top strong.negative { color: #b34b32; }
//   .fp-driver-bar {
//     width: 100%;
//     height: 5px;
//     margin-top: 9px;
//     border-radius: 99px;
//     background: #f0f2f4;
//     overflow: hidden;
//   }
//   .fp-driver-bar > div {
//     height: 100%;
//     border-radius: inherit;
//     animation: fpBarGrow 1000ms cubic-bezier(.22,1,.36,1) both;
//   }
//   .fp-driver-bar .favorable { background: #628361; }
//   .fp-driver-bar .unfavorable { background: #b34b32; }
//   @keyframes fpBarGrow { from { width: 0 !important; } }
//   .fp-driver-bottom {
//     display: flex;
//     justify-content: space-between;
//     margin-top: 5px;
//     color: #a0a8af;
//     font-size: 9px;
//   }

//   /* LEGEND */
//   .fp-legend-inline {
//     display: flex;
//     align-items: center;
//     gap: 13px;
//     color: #7c8790;
//     font-size: 9px;
//     font-weight: 650;
//   }
//   .fp-legend-inline span { display: flex; align-items: center; gap: 5px; }
//   .fp-legend-inline i { width: 7px; height: 7px; border-radius: 50%; }

//   /* MIX */
//   .fp-mix-content {
//     display: grid;
//     grid-template-columns: minmax(180px, .9fr) minmax(180px, 1.1fr);
//     gap: 12px;
//     align-items: center;
//     min-height: 270px;
//   }
//   .fp-donut { height: 250px; min-width: 0; }
//   .fp-mix-legend { display: flex; flex-direction: column; gap: 11px; }
//   .fp-mix-row {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     gap: 12px;
//     color: #68737c;
//     font-size: 10px;
//   }
//   .fp-mix-row strong { color: #3c464e; font-size: 10px; }
//   .fp-mix-name { display: flex; align-items: center; gap: 7px; }
//   .fp-mix-name i { width: 7px; height: 7px; border-radius: 2px; }

//   /* SUMMARY STRIP */
//   .fp-summary-strip {
//     display: grid;
//     grid-template-columns: repeat(5, minmax(0, 1fr));
//     background: #304f6d;
//     border-radius: 14px;
//     overflow: hidden;
//     margin-top: 17px;
//     margin-bottom: 10px;
//     box-shadow: 0 8px 25px rgba(48,79,109,.14);
//   }
//   .fp-summary-strip > div {
//     padding: 16px 18px;
//     border-right: 1px solid rgba(255,255,255,.12);
//   }
//   .fp-summary-strip > div:last-child { border-right: 0; }
//   .fp-summary-strip span {
//     display: block;
//     color: rgba(255,255,255,.62);
//     font-size: 9px;
//     font-weight: 650;
//     text-transform: ;
//     letter-spacing: .06em;
//     margin-bottom: 5px;
//   }
//   .fp-summary-strip strong { color: white; font-size: 17px; font-weight: 700; }

//   /* EMPTY */
//   .fp-empty {
//     height: 100%;
//     min-height: 120px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: #a0a8af;
//     font-size: 11px;
//   }

//   /* LOADING */
//   .fp-loading-page {
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     min-height: 100vh;
//   }
//   .fp-loading-content {
//     width: min(390px, 90vw);
//     text-align: center;
//     animation: fpFadeIn 500ms ease both;
//   }
//   .fp-logo-pulse {
//     width: 58px;
//     height: 58px;
//     margin: 0 auto 18px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     border-radius: 17px;
//     background: #304f6d;
//     color: white;
//     font-size: 22px;
//     box-shadow: 0 12px 28px rgba(48,79,109,.22);
//     animation: fpPulse 1.8s ease-in-out infinite;
//   }
//   @keyframes fpPulse {
//     0%, 100% { transform: scale(1); }
//     50% { transform: scale(1.06); }
//   }
//   .fp-loading-title { color: #303840; font-size: 18px; font-weight: 720; }
//   .fp-loading-subtitle { margin-top: 6px; color: #8a949d; font-size: 11px; }
//   .fp-loading-bar {
//     height: 4px;
//     margin-top: 20px;
//     border-radius: 99px;
//     background: #e7eaed;
//     overflow: hidden;
//   }
//   .fp-loading-bar-inner {
//     height: 100%;
//     width: 35%;
//     border-radius: inherit;
//     background: linear-gradient(90deg, #304f6d, #f59e0b);
//     animation: fpLoading 1.3s ease-in-out infinite;
//   }
//   @keyframes fpLoading {
//     0% { transform: translateX(-110%); }
//     100% { transform: translateX(320%); }
//   }

//   /* ERROR */
//   .fp-error-card {
//     width: min(450px, 100%);
//     margin: 120px auto;
//     padding: 30px;
//     text-align: center;
//     background: white;
//     border: 1px solid #e7e9ec;
//     border-radius: 16px;
//     box-shadow: 0 10px 35px rgba(30,41,59,.07);
//   }
//   .fp-error-icon {
//     width: 42px;
//     height: 42px;
//     margin: 0 auto 12px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     border-radius: 50%;
//     background: #fcefeb;
//     color: #b34b32;
//     font-size: 18px;
//     font-weight: 800;
//   }
//   .fp-error-card h2 { margin: 0; font-size: 18px; }
//   .fp-error-card p { color: #7e8992; font-size: 11px; margin: 8px 0 18px; }
//   .fp-primary-button {
//     height: 38px;
//     border: 0;
//     border-radius: 8px;
//     background: #304f6d;
//     color: white;
//     padding: 0 16px;
//     font-size: 11px;
//     font-weight: 700;
//     display: inline-flex;
//     align-items: center;
//     gap: 7px;
//     cursor: pointer;
//   }

//   /* REFRESH */
//   .fp-spin { animation: fpSpin .9s linear infinite; }
//   @keyframes fpSpin { to { transform: rotate(360deg); } }
//   .fp-refresh-warning {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin-top: 10px;
//     padding: 9px 12px;
//     background: #fff8f5;
//     border: 1px solid #f2ddd5;
//     border-radius: 8px;
//     color: #a4543f;
//     font-size: 10px;
//   }
//   .fp-refresh-warning button {
//     border: 0;
//     background: transparent;
//     color: #9c4a36;
//     font-weight: 750;
//     cursor: pointer;
//   }
//   .fp-is-refreshing { opacity: .78; transition: opacity 250ms ease; }

//   .fp-kpi-value.negative { color: #b34b32; }
// .fp-kpi-caption {
//   margin-top: 12px;
//   font-size: 10px;
//   font-weight: 650;
//   color: #89929c;
// }
// .fp-driver-top strong.neutral { color: #303840; }
// .fp-driver-bar .neutral { background: #486987; }
// .fp-summary-strip strong.neg { color: #ff9b85; }

//   /* RESPONSIVE */
//   @media (max-width: 1250px) {
//     .fp-kpi-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
//     .fp-main-grid { grid-template-columns: 1fr; }
//     .fp-bottom-grid { grid-template-columns: 1fr; }
//   }

//   @media (max-width: 850px) {
//     .fp-page { padding: 16px; }
//     .fp-header { align-items: flex-start; flex-direction: column; gap: 10px; }
//     .fp-header-right { text-align: left; }
//     .fp-kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
//     .fp-filter { min-width: 140px; }
//     .fp-summary-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
//     .fp-summary-strip > div:nth-child(2) { border-right: 0; }
//     .fp-summary-strip > div { border-bottom: 1px solid rgba(255,255,255,.12); }
//     .fp-mix-content { grid-template-columns: 1fr; }
//     .fp-donut { height: 220px; }
//   }

//   @media (max-width: 560px) {
//     .fp-kpi-grid { grid-template-columns: 1fr; }
//     .fp-filter-main { align-items: stretch; flex-direction: column; }
//     .fp-filter, .fp-project-filter { width: 100%; }
//     .fp-filter-button, .fp-refresh-button { width: 100%; margin-top: 0; }
//     .fp-more-filters { flex-direction: column; align-items: flex-start; }
//     .fp-filter-note {
//       border-left: 0;
//       border-top: 1px solid #e3e7eb;
//       padding-left: 0;
//       padding-top: 12px;
//     }
//     .fp-summary-strip { grid-template-columns: 1fr; }
//     .fp-summary-strip > div { border-right: 0; }
//     .fp-bar-chart, .fp-trend-chart { height: 290px; }
//     .fp-small-chart { height: 250px; }
//   }
// `;

// export default FinancialPerformanceDashboard;
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { backendUrl } from "./config";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import {
  FaSyncAlt,
  FaChevronDown,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaChartLine,
  FaDollarSign,
  FaPercentage,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";

/* ============================================================
   CONFIG
   ============================================================ */

const SUMMARY_API_PATH = "/Forecast/GetSummaryV4";

const MONTHS = [
  { number: 1, key: "01", short: "Jan", name: "January" },
  { number: 2, key: "02", short: "Feb", name: "February" },
  { number: 3, key: "03", short: "Mar", name: "March" },
  { number: 4, key: "04", short: "Apr", name: "April" },
  { number: 5, key: "05", short: "May", name: "May" },
  { number: 6, key: "06", short: "Jun", name: "June" },
  { number: 7, key: "07", short: "Jul", name: "July" },
  { number: 8, key: "08", short: "Aug", name: "August" },
  { number: 9, key: "09", short: "Sep", name: "September" },
  { number: 10, key: "10", short: "Oct", name: "October" },
  { number: 11, key: "11", short: "Nov", name: "November" },
  { number: 12, key: "12", short: "Dec", name: "December" },
];

const DIRECT_NAMES = [
  "Direct Labor",
  "Direct Travel",
  "Direct Materials",
  "Subcontracts",
  "Other Direct Costs",
  "Consultation",
  "Materials",
  "Material Handling",
  "Subcontractors",
  "Travel",
  "Other Direct Cost",
  "Equipment",
  "Unallowable Direct - ODCs",
];

const INDIRECT_NAMES = [
  "Fringe Benefits",
  "Overhead",
  "General & Administrative",
  "Subcontract & Matl Handling"
];
const INDIRECT_NAMES_WITH_UNALLOWABLE = [
  "Fringe Benefits",
  "Overhead",
  "Cost of Goods Sold",
  "General & Administrative",
  "Subcontract & Matl Handling",
  "Misc Income/(Expenses)",
  "Interest Expense",
  "B&P",
  "Business Development",
  "Other Unallowable Expense",
  "Allocations",
  "Income Taxes",
    "General & Administration Exp",
  "HR/Payroll Allocation",
  "IT/Facilities",
  "Project Specific Overhead",
  "Subcont, Material & Equipment",
  "Unallowables"
];

/*
 * Indirect lines treated as "below the line".
 * Operating Income excludes these; Net Income includes them.
 * Set to [] to make Operating Income equal Net Income.
 */

const BELOW_THE_LINE_NAMES = [];

// const BELOW_THE_LINE_NAMES = [
// "Fringe Benefits",
// "Overhead",
// "General & Administrative",
// "Subcontract & Matl Handling",
// "Income Taxes",
// "Misc Income/(Expenses)",
// ];

const COLORS = {
  navy: "#304F6D",
  blue: "#486987",
  gold: "#f59e0b",
  green: "#628361",
  red: "#B34B32",
  orange: "#C58D4E",
  slate: "#64748B",
  muted: "#94A3B8",
  text: "#263238",
  border: "#E6E8EB",
  background: "#F7F8FA",
  white: "#FFFFFF",
};

const PIE_COLORS = [
  COLORS.blue,
  COLORS.gold,
  COLORS.green,
  COLORS.orange,
  COLORS.red,
  COLORS.slate,
];

/* ============================================================
   HELPERS
   ============================================================ */

const safeNumber = (value) => {
  if (value === undefined || value === null || value === "" || value === "-") {
    return 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const round2 = (value) =>
  Math.round((safeNumber(value) + Number.EPSILON) * 100) / 100;

const normalizeName = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const toArray = (value) =>
  Array.isArray(value)
    ? value
    : value && typeof value === "object"
      ? Object.values(value)
      : [];

const monthKey = (year, month) => `${year}-${String(month).padStart(2, "0")}`;

const nameMatchesAny = (node, list) => {
  const name = normalizeName(node?.name);
  return list.some((item) => name.includes(normalizeName(item)));
};

/* Same node classification as ReportingScreen (top-level nodes only) */
const isRevenueRoot = (node) => normalizeName(node?.name) === "revenue";
const isAdjustmentNode = (node) =>
  normalizeName(node?.name).includes("adjustment");
const isDirectNode = (node) => nameMatchesAny(node, DIRECT_NAMES);
const isIndirectNode = (node) => nameMatchesAny(node, INDIRECT_NAMES);
const isIndirectNodeWithUnallowable = (node) =>
  nameMatchesAny(node, INDIRECT_NAMES_WITH_UNALLOWABLE);
const isBelowTheLineNode = (node) => nameMatchesAny(node, BELOW_THE_LINE_NAMES);
const isDirectNonLaborNode = (node) => {
  const name = normalizeName(node?.name);
  return name.includes("direct non labor") || name.includes("direct non-labor");
};

/* Adjust if your project nodes use a different `type` value */
const isProjectNode = (node) => normalizeName(node?.type).includes("project");

/* ============================================================
   BUILD STATEMENT TREE (mirrors ReportingScreen.fetchForecast)
   ============================================================ */

const mergeTotals = (target, source) => {
  Object.entries(source || {}).forEach(([key, value]) => {
    target[key] = (target[key] || 0) + safeNumber(value);
  });
};

/* Merge top-level entries that share a name.
   Unlike the report, budget totals are merged as well. */
const mergeEntriesByName = (items) => {
  const map = new Map();

  items.forEach((item) => {
    if (!item) return;

    if (map.has(item.name)) {
      const existing = map.get(item.name);
      existing.children.push(...toArray(item.children));
      mergeTotals(existing.monthlyTotals, item.monthlyTotals);
      mergeTotals(existing.revenueTotals, item.revenueTotals);
      mergeTotals(existing.budgetMonthlyTotals, item.budgetMonthlyTotals);
      mergeTotals(existing.budgetRevenueTotals, item.budgetRevenueTotals);
    } else {
      map.set(item.name, {
        ...item,
        children: [...toArray(item.children)],
        monthlyTotals: { ...(item.monthlyTotals || {}) },
        revenueTotals: { ...(item.revenueTotals || {}) },
        budgetMonthlyTotals: { ...(item.budgetMonthlyTotals || {}) },
        budgetRevenueTotals: { ...(item.budgetRevenueTotals || {}) },
      });
    }
  });

  return Array.from(map.values());
};

const mapNode = (item, parentIsRevenue = false) => {
  const name = String(item.name || item.description || "").trim();
  const lower = name.toLowerCase();

  const isRevenue =
    parentIsRevenue ||
    lower === "revenue" ||
    lower.includes("revenue adjustment");

  const revenueTotals = item.revenueTotals || {};

  return {
    id: String(item.id || item.code || "").trim(),
    name,
    type: item.type,
    isRevenue,
    monthlyTotals:
      isRevenue && Object.keys(revenueTotals).length > 0
        ? revenueTotals
        : item.monthlyTotals || {},
    revenueTotals,
    budgetMonthlyTotals: item.budgetMonthlyTotals || {},
    budgetRevenueTotals: item.budgetRevenueTotals || {},
    children: toArray(item.children)
      .filter(
        (child) =>
          child &&
          !String(child.id || child.code || "")
            .trim()
            .includes("-BUDGET"),
      )
      .map((child) => mapNode(child, isRevenue)),
  };
};

const buildStatementTree = (rawData) => {
  const top = mergeEntriesByName(toArray(rawData)).map((item) => mapNode(item));

  /* Move 50.32.02 under 90 (Unallowable), same as the report */
  const unallowable = top.find((n) => n.id === "90" || n.id === "900" || n.id === "998");
  const moveIndex = top.findIndex((n) => n.id === "50.32.02");

  if (unallowable && moveIndex !== -1) {
    const [moved] = top.splice(moveIndex, 1);
    if (moved.children.length > 0) {
      unallowable.children.push(...moved.children);
    } else {
      unallowable.children.push(moved);
    }
  }

  /* Node 90 totals are rebuilt from its children */
  if (unallowable) {
    const actual = {};
    const budget = {};
    unallowable.children.forEach((child) => {
      mergeTotals(actual, child.monthlyTotals);
      mergeTotals(budget, child.budgetMonthlyTotals);
    });
    unallowable.monthlyTotals = actual;
    unallowable.budgetMonthlyTotals = budget;
  }

  return top;
};

/* ============================================================
   VALUE GETTERS (same rules as getVal / getBudVal in the report)
   ============================================================ */

const getActualValue = (node, key) => safeNumber(node?.monthlyTotals?.[key]);

const getBudgetValue = (node, key) => {
  if (!node) return 0;
  if (isAdjustmentNode(node)) return 0;

  const isRev = normalizeName(node.name) === "revenue" || isRevenueRoot(node);

  // if(isRev){
  //   console.log(node)
  // }

  return safeNumber(
    isRev
      ? node.budgetRevenueTotals?.[key] || node.budgetMonthlyTotals?.[key] || 0
      : node.budgetMonthlyTotals?.[key] || 0,
  );
};

const classifyNodes = (nodes) => {
  const indirectNodes = nodes.filter(isIndirectNode);
  const indirectNodesWithunallowable = nodes.filter(
    isIndirectNodeWithUnallowable,
  );

  return {
    revenueNode: nodes.find(isRevenueRoot),
    directNodes: nodes.filter(isDirectNode),
    directNonLaborNode: nodes.find(isDirectNonLaborNode),
    indirectNodes,
    indirectNodesWithunallowable,
    belowTheLineNodes: indirectNodes.filter(isBelowTheLineNode),
  };
};

/* ============================================================
   PROJECT FILTER
   For each top-level line, sum the matching project nodes
   found anywhere below it (no double counting).
   ============================================================ */

const collectProjectMatches = (node, projectId, matches = []) => {
  toArray(node.children).forEach((child) => {
    if (isProjectNode(child) && child.id === projectId) {
      matches.push(child);
    } else {
      collectProjectMatches(child, projectId, matches);
    }
  });
  return matches;
};

const effectiveBudgetTotals = (node, inRevenueTree) => {
  const monthly = node.budgetMonthlyTotals || {};
  if (!inRevenueTree) return monthly;

  const rev = node.budgetRevenueTotals || {};
  const result = {};
  new Set([...Object.keys(monthly), ...Object.keys(rev)]).forEach((key) => {
    result[key] = safeNumber(rev[key]) || safeNumber(monthly[key]);
  });
  return result;
};

const applyProjectFilter = (tree, projectId) =>
  tree.map((top) => {
    const matches = collectProjectMatches(top, projectId);
    const inRevenueTree = isRevenueRoot(top);

    const monthlyTotals = {};
    const budgetMonthlyTotals = {};

    matches.forEach((match) => {
      mergeTotals(monthlyTotals, match.monthlyTotals);
      mergeTotals(
        budgetMonthlyTotals,
        effectiveBudgetTotals(match, inRevenueTree),
      );
    });

    return {
      ...top,
      children: [],
      monthlyTotals,
      budgetMonthlyTotals,
      budgetRevenueTotals: budgetMonthlyTotals,
    };
  });

const collectProjectOptions = (nodes, map = new Map()) => {
  nodes.forEach((node) => {
    if (isProjectNode(node) && node.id) {
      map.set(node.id, {
        id: node.id,
        name:
          node.name && node.name !== node.id
            ? `${node.id} – ${node.name}`
            : node.id,
      });
    }
    collectProjectOptions(toArray(node.children), map);
  });
  return map;
};

/* ============================================================
   METRICS
   ============================================================ */

const pct = (numerator, denominator) =>
  denominator !== 0 ? round2((numerator / denominator) * 100) : 0;

const buildMetricResult = (base) => ({
  ...base,
  grossMargin: pct(base.grossProfit, base.revenue),
  operatingMargin: pct(base.operatingIncome, base.revenue),
  netMargin: pct(base.netIncome, base.revenue),
});

const calculateMetricsForMonth = (
  groups,
  year,
  month,
  budget = false,
  closingPeriod = null,
) => {
  const key = monthKey(year, month);

  const val = (node) =>
    budget ? getBudgetValue(node, key) : getActualValue(node, key);

  const sum = (list) => list.reduce((total, node) => total + val(node), 0);

  /*
   * Revenue is returned by the API as a credit / negative value.
   * Convert it to positive revenue for the dashboard.
   */
  // const REVENUE_SIGN = -1;

  // const revenue = round2(REVENUE_SIGN * val(groups.revenueNode));

  const closingYear = closingPeriod?.year;
  const closingMonth = closingPeriod?.month;

  const isBeforeOrAtClosingPeriod =
    closingYear != null &&
    closingMonth != null &&
    (Number(year) < Number(closingYear) ||
      (Number(year) === Number(closingYear) &&
        Number(month) <= Number(closingMonth)));

  const rawRevenue = val(groups.revenueNode);

  const revenue = round2(isBeforeOrAtClosingPeriod ? rawRevenue : rawRevenue);

  /*
   * Direct Costs
   *
   * Direct Labor
   * Direct Travel
   * Direct Materials
   * Subcontracts
   * Other Direct Costs
   */
  const directCost = round2(
    sum(groups.directNodes) + val(groups.directNonLaborNode),
  );

  /*
   * Excel:
   *
   * Gross Margin
   * = Revenue - Direct Costs
   */
  const grossProfit = round2(revenue - directCost);

  /*
   * COST OF OPERATIONS
   *
   * Fringe Benefits
   * Overhead
   * General & Administrative
   * Subcontract & Material Handling
   *
   * These are operating expenses.
   */
  const operatingExpenses = round2(sum(groups.indirectNodes));

  /*
   * Excel:
   *
   * Operating Income
   * / Gross Profit from Operations
   *
   * = Gross Margin - Cost of Operations
   */
  const operatingIncome = round2(grossProfit - operatingExpenses);

  /*
   * For now, Net Income remains based on the
   * operating result until the Other Income /
   * Other Expense rows are mapped separately.
   */
  const totalIndirectWithUnllaowableIncome = round2(
    sum(groups.indirectNodesWithunallowable),
  );
  const netIncome = round2(grossProfit - totalIndirectWithUnllaowableIncome);

  return buildMetricResult({
    revenue,
    directCost,
    grossProfit,
    operatingExpenses,
    operatingIncome,
    netIncome,
  });
};

/* ============================================================
   PERIOD
   ============================================================ */

const getPeriodMonths = (year, period, closing) => {
  const all = MONTHS.map((m) => m.number);

  switch (period) {
    case "Q1":
      return [1, 2, 3];
    case "Q2":
      return [1, 2, 3, 4, 5, 6];
    case "Q3":
      return [1, 2, 3, 4, 5, 6, 7, 8, 9];
    case "Q4":
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    case "YTD": {
      /* Months up to the closing period are actuals */
      if (!closing) return all;
      if (year < closing.year) return all;
      if (year > closing.year) return [];
      return all.filter((m) => m <= closing.month);
    }

    case "FULL_YEAR":
    default:
      return all;
  }
};

const calculatePeriodMetrics = (
  groups,
  year,
  months,
  budget = false,
  closing,
) => {
  const monthly = months.map((month) =>
    calculateMetricsForMonth(groups, year, month, budget, closing),
  );

  const total = (field) =>
    round2(monthly.reduce((sum, item) => sum + item[field], 0));

  return buildMetricResult({
    revenue: total("revenue"),
    directCost: total("directCost"),
    grossProfit: total("grossProfit"),
    operatingExpenses: total("operatingExpenses"),
    operatingIncome: total("operatingIncome"),
    netIncome: total("netIncome"),
  });
};

/* ============================================================
   FORMATTERS
   ============================================================ */

const formatMoney = (value, compact = false) => {
  const number = safeNumber(value);
  const sign = number < 0 ? "-" : "";
  const absolute = Math.abs(number);

  if (compact) {
    if (absolute >= 1_000_000_000) {
      return `${sign}$${(absolute / 1_000_000_000).toFixed(2)}B`;
    }
    if (absolute >= 1_000_000) {
      return `${sign}$${(absolute / 1_000_000).toFixed(2)}M`;
    }
    if (absolute >= 1_000) {
      return `${sign}$${(absolute / 1_000).toFixed(1)}K`;
    }
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

const formatPercent = (value) => `${safeNumber(value).toFixed(1)}%`;

const formatAxisValue = (value) => {
  const number = safeNumber(value);
  const absolute = Math.abs(number);

  if (absolute >= 1_000_000_000)
    return `$${(number / 1_000_000_000).toFixed(1)}B`;
  if (absolute >= 1_000_000) return `$${(number / 1_000_000).toFixed(1)}M`;
  if (absolute >= 1_000) return `$${(number / 1_000).toFixed(0)}K`;
  return `$${number.toFixed(0)}`;
};

/* ============================================================
   CUSTOM TOOLTIP
   ============================================================ */

const FinancialTooltip = ({ active, payload, label, percentage = false }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white border border-[#e3e7eb] rounded-[10px] py-[10px] px-3 shadow-[0_8px_24px_rgba(30,41,59,.12)] min-w-[170px]">
      <div className="text-[#303840] text-[11px] font-[750] mb-[7px]">
        {label}
      </div>

      {payload.map((entry, index) => (
        <div
          className="flex items-center justify-between gap-[14px] text-[#68737c] text-[11px] py-0.5"
          key={`${entry.dataKey}-${index}`}
        >
          <span>
            <span
              className="inline-block w-[7px] h-[7px] rounded-full mr-[6px]"
              style={{ background: entry.color }}
            />
            {entry.name}
          </span>

          <strong>
            {percentage ? formatPercent(entry.value) : formatMoney(entry.value)}
          </strong>
        </div>
      ))}
    </div>
  );
};
/* ============================================================
   KPI CARD
   ============================================================ */

const KpiCard = ({
  label,
  value,
  variance,
  variancePercent,
  isPercent = false,
  icon,
  positiveWhenHigher = true,
  delay = 0,
  showVariance = true,
  caption = "",
}) => {
  const numericVariance = safeNumber(variance);
  const isNeutral = Math.abs(numericVariance) < 0.005;
  const isNegativeValue = safeNumber(value) < 0;

  const favorable = positiveWhenHigher
    ? numericVariance > 0
    : numericVariance < 0;

  const varianceClass = isNeutral
    ? "neutral"
    : favorable
      ? "positive"
      : "negative";

  const Icon =
    numericVariance > 0
      ? FaArrowUp
      : numericVariance < 0
        ? FaArrowDown
        : FaMinus;

  return (
    <div
      className="
    relative overflow-hidden
    min-h-[135px]
    rounded-[14px]
    border border-[#e7e9ec]
    bg-white
    p-[17px]
    shadow-[0_5px_16px_rgba(30,41,59,0.045)]
    before:absolute
    before:left-0
    before:top-0
    before:h-[3px]
    before:w-full
    before:bg-gradient-to-r
    before:from-[#304f6d]
    before:to-[#f59e0b]
    before:opacity-90
    before:content-['']
  "
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold  tracking-[0.06em] text-[#8a939c]">
          {label}
        </div>

        <div className="flex h-[27px] w-[27px] items-center justify-center rounded-[8px] bg-[#f4f6f8] text-[11px] text-[#64788a]">
          {icon}
        </div>
      </div>

      <div
        className={`
      mt-[14px]
      text-[clamp(21px,2vw,29px)]
      font-bold
      leading-none
      tracking-[-0.035em]
      text-[#303840]
      ${isNegativeValue ? "text-[#b34b32]" : ""}
    `}
      >
        {isPercent ? formatPercent(value) : formatMoney(value, true)}
      </div>
      {/* </div> */}

      {showVariance ? (
        <div
          className={`flex items-center flex-wrap gap-1 mt-3 text-[10px] font-bold ${varianceClass === "positive" ? "text-[#628361]" : varianceClass === "negative" ? "text-[#b34b32]" : "text-[#89929c]"}`}
        >
          <span className="flex text-[8px]">
            <Icon />
          </span>
          <span>
            {isPercent
              ? `${Math.abs(numericVariance).toFixed(1)} pts`
              : formatMoney(Math.abs(numericVariance), true)}
          </span>
          {variancePercent !== undefined && (
            <span className="opacity-70 font-[550]">
              ({formatPercent(Math.abs(variancePercent))})
            </span>
          )}
          <span className="opacity-70 font-[550]">vs budget</span>
        </div>
      ) : (
        <div className="mt-3 text-[10px] font-[650] text-[#89929c]">
          {caption}
        </div>
      )}
    </div>
  );
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

const METRIC_KEYS = [
  "revenue",
  "directCost",
  "grossProfit",
  "grossMargin",
  "operatingExpenses",
  "operatingIncome",
  "netIncome",
];

const FinancialPerformanceDashboard = () => {
  const currentYear = new Date().getFullYear();

  const [rawData, setRawData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  const [performanceView, setPerformanceView] = useState("ACTUAL_VS_BUDGET");
  const [period, setPeriod] = useState("YTD");
  const [selectedProject, setSelectedProject] = useState("ALL");
  const [displayMode, setDisplayMode] = useState("AMOUNT");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [createdAt, setCreatedAt] = useState(null);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [closingPeriod, setClosingPeriod] = useState(null);

  const isCompare = performanceView === "ACTUAL_VS_BUDGET";
  const showActual = performanceView !== "BUDGET";
  const showBudget = performanceView !== "ACTUAL";

  /* ==========================================================
     FETCH
     ========================================================== */

  const fetchSummary = async (bypassCache = false) => {
    try {
      if (bypassCache) setRefreshing(true);
      else setLoading(true);

      setError("");

      const response = await fetch(
        `${backendUrl}${SUMMARY_API_PATH}?byPassCache=${bypassCache}`,
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load financial summary (${response.status})`,
        );
      }

      const parsed = await response.json();
      const responseData = Array.isArray(parsed) ? parsed : parsed?.data || [];

      setRawData(responseData);
      setCreatedAt(parsed?.createdAt || null);
      setFirstLoaded(true);
    } catch (err) {
      console.error("Financial dashboard error:", err);
      setError(err?.message || "Unable to load financial dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* Same config call as ReportingScreen (use the same project id there) */
  const fetchClosingPeriod = async () => {
    try {
      const res = await fetch(
        `${backendUrl}/api/Configuration/GetAllConfigValuesByProject/xxxxx`,
      );
      if (!res.ok) return;

      const configs = await res.json();
      const item = Array.isArray(configs)
        ? configs.find((c) => c.name === "closing_period")
        : null;

      if (item?.value) {
        const [y, m] = String(item.value).split("-").map(Number);
        if (y && m) setClosingPeriod({ year: y, month: m });
      }
    } catch (err) {
      console.error("Closing period error:", err);
    }
  };

  useEffect(() => {
    fetchSummary(false);
    fetchClosingPeriod();
  }, []);

  /* ==========================================================
     DATA MODEL
     ========================================================== */

  const statementTree = useMemo(() => buildStatementTree(rawData), [rawData]);

  const scopedNodes = useMemo(
    () =>
      selectedProject === "ALL" || !selectedProject
        ? statementTree
        : applyProjectFilter(statementTree, selectedProject),
    [statementTree, selectedProject],
  );

  const groups = useMemo(() => classifyNodes(scopedNodes), [scopedNodes]);

  const closing = useMemo(
    () =>
      closingPeriod || {
        year: currentYear,
        month: new Date().getMonth() + 1,
      },
    [closingPeriod, currentYear],
  );

  const yearNumber = Number(selectedYear);

  const periodMonths = useMemo(
    () => getPeriodMonths(yearNumber, period, closing),
    [yearNumber, period, closing],
  );

  /* ==========================================================
     AVAILABLE YEARS
     ========================================================== */

  const availableYears = useMemo(() => {
    const years = new Set();

    statementTree.forEach((node) => {
      [
        node.monthlyTotals,
        node.revenueTotals,
        node.budgetMonthlyTotals,
        node.budgetRevenueTotals,
      ].forEach((collection) => {
        Object.keys(collection || {}).forEach((key) => {
          const year = key.split("-")[0];
          if (/^\d{4}$/.test(year)) years.add(year);
        });
      });
    });

    years.add(String(selectedYear));

    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [statementTree, selectedYear]);

  /* ==========================================================
     PROJECT OPTIONS
     ========================================================== */

  const projectOptions = useMemo(
    () =>
      Array.from(collectProjectOptions(statementTree).values()).sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    [statementTree],
  );

  /* ==========================================================
     ACTUAL / BUDGET METRICS
     ========================================================== */

  const financialMetrics = useMemo(() => {
    const actual = calculatePeriodMetrics(
      groups,
      yearNumber,
      periodMonths,
      false,
      closing,
    );
    const budget = calculatePeriodMetrics(
      groups,
      yearNumber,
      periodMonths,
      true,
      closing,
    );

    const variance = {};
    const variancePercent = {};

    METRIC_KEYS.forEach((key) => {
      variance[key] = round2(actual[key] - budget[key]);
      variancePercent[key] =
        budget[key] !== 0
          ? round2((variance[key] / Math.abs(budget[key])) * 100)
          : 0;
    });

    return { actual, budget, variance, variancePercent };
  }, [groups, yearNumber, periodMonths]);

  /* ==========================================================
     KPIs
     ========================================================== */

  const kpis = useMemo(() => {
    const { actual, budget, variance, variancePercent } = financialMetrics;
    const primary = performanceView === "BUDGET" ? budget : actual;

    const defs = [
      {
        key: "revenue",
        label: "Gross Revenue",
        isPercent: false,
        icon: <FaDollarSign />,
      },
      {
        key: "grossProfit",
        label: "Gross Profit",
        isPercent: false,
        icon: <FaChartLine />,
      },
      {
        key: "grossMargin",
        label: "Gross Margin",
        isPercent: true,
        icon: <FaPercentage />,
      },
      {
        key: "operatingIncome",
        label: "Operating Income",
        isPercent: false,
        icon: <FaChartLine />,
      },
      {
        key: "netIncome",
        label: "Net Income",
        isPercent: false,
        icon: <FaDollarSign />,
      },
    ];

    return defs.map((d) => ({
      ...d,
      value: primary[d.key],
      variance: variance[d.key],
      variancePercent: d.isPercent ? undefined : variancePercent[d.key],
    }));
  }, [financialMetrics, performanceView]);

  /* ==========================================================
     CHART DATA
     ========================================================== */

  const performanceChartData = useMemo(() => {
    const { actual, budget } = financialMetrics;
    return [
      { metric: "Revenue", actual: actual.revenue, budget: budget.revenue },
      {
        metric: "Gross Profit",
        actual: actual.grossProfit,
        budget: budget.grossProfit,
      },
      {
        metric: "Operating Income",
        actual: actual.operatingIncome,
        budget: budget.operatingIncome,
      },
      {
        metric: "Net Income",
        actual: actual.netIncome,
        budget: budget.netIncome,
      },
    ];
  }, [financialMetrics]);

  const monthlySeries = useMemo(
    () =>
      periodMonths.map((month) => ({
        month: MONTHS.find((m) => m.number === month)?.short || month,
        actual: calculateMetricsForMonth(groups, yearNumber, month, false),
        budget: calculateMetricsForMonth(groups, yearNumber, month, true),
      })),
    [groups, yearNumber, periodMonths],
  );

  const monthlyTrendData = useMemo(
    () =>
      monthlySeries.map(({ month, actual, budget }) => ({
        month,
        revenue: actual.revenue,
        budgetRevenue: budget.revenue,
        grossProfit: actual.grossProfit,
        budgetGrossProfit: budget.grossProfit,
        operatingIncome: actual.operatingIncome,
        budgetOperatingIncome: budget.operatingIncome,
      })),
    [monthlySeries],
  );

  const marginTrendData = useMemo(
    () =>
      monthlySeries.map(({ month, actual, budget }) => ({
        month,
        actualGrossMargin: actual.grossMargin,
        budgetGrossMargin: budget.grossMargin,
        actualOperatingMargin: actual.operatingMargin,
        budgetOperatingMargin: budget.operatingMargin,
      })),
    [monthlySeries],
  );

  /* Direct cost mix for the selected period (top-level direct nodes) */
  const revenueComposition = useMemo(() => {
    const nodes = [
      ...groups.directNodes,
      ...(groups.directNonLaborNode ? [groups.directNonLaborNode] : []),
    ];
    const read = performanceView === "BUDGET" ? getBudgetValue : getActualValue;

    return nodes
      .map((node) => ({
        name: node.name,
        value: Math.abs(
          round2(
            periodMonths.reduce(
              (sum, month) => sum + read(node, monthKey(yearNumber, month)),
              0,
            ),
          ),
        ),
      }))
      .filter((item) => item.value > 0);
  }, [groups, yearNumber, periodMonths, performanceView]);

  /* ==========================================================
     VARIANCE DRIVERS
     ========================================================== */

  const varianceDrivers = useMemo(() => {
    const { actual, budget, variance } = financialMetrics;
    const compare = performanceView === "ACTUAL_VS_BUDGET";
    const source = performanceView === "BUDGET" ? budget : actual;

    const defs = [
      { label: "Revenue", key: "revenue", positiveIsGood: true },
      { label: "Direct Costs", key: "directCost", positiveIsGood: false },
      { label: "Gross Profit", key: "grossProfit", positiveIsGood: true },
      {
        label: "Operating Expenses",
        key: "operatingExpenses",
        positiveIsGood: false,
      },
      {
        label: "Operating Income",
        key: "operatingIncome",
        positiveIsGood: true,
      },
      { label: "Net Income", key: "netIncome", positiveIsGood: true },
    ];

    return defs
      .map((d) => {
        const amount = compare ? variance[d.key] : source[d.key];
        const favorable = d.positiveIsGood ? amount > 0 : amount < 0;
        const tone = compare
          ? favorable
            ? "positive"
            : "negative"
          : amount < 0
            ? "negative"
            : "neutral";

        return {
          label: d.label,
          variance: amount,
          favorable,
          tone,
          magnitude: Math.abs(amount),
        };
      })
      .filter((item) => item.magnitude > 0.01)
      .sort((a, b) => b.magnitude - a.magnitude)
      .slice(0, compare ? 5 : 6);
  }, [financialMetrics, performanceView]);

  const maxDriverMagnitude = useMemo(
    () => Math.max(...varianceDrivers.map((d) => d.magnitude), 1),
    [varianceDrivers],
  );

  /* ==========================================================
     HEADER LABELS
     ========================================================== */

  const periodLabel = useMemo(() => {
    const base =
      { Q1: "Q1", Q2: "Q2", Q3: "Q3", Q4: "Q4", FULL_YEAR: "Full Year" }[
        period
      ] || "YTD";

    /* Months after the closing period are forecast, so the figure is EAC */
    const hasForecast = periodMonths.some(
      (m) =>
        yearNumber > closing.year ||
        (yearNumber === closing.year && m > closing.month),
    );

    return hasForecast ? `${base} · EAC` : base;
  }, [period, periodMonths, yearNumber, closing]);

  const performanceLabel = useMemo(() => {
    switch (performanceView) {
      case "ACTUAL":
        return "Actual";
      case "BUDGET":
        return "Budget";
      default:
        return "Actual vs Budget";
    }
  }, [performanceView]);

  const viewMetrics =
    performanceView === "BUDGET"
      ? financialMetrics.budget
      : financialMetrics.actual;

  /* ==========================================================
     LOADING SCREEN
     ========================================================== */

  if (loading && !firstLoaded) {
    return (
      <>
        <div className="[&_*]:box-border w-full min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(176,122,50,0.07),_transparent_28%),_#f7f8fa] p-7 text-[#263238] font-[Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe_UI,sans-serif] flex items-center justify-center">
          <div className="w-[min(390px,90vw)] text-center">
            <div className="w-[58px] h-[58px] mx-auto mb-[18px] flex items-center justify-center rounded-[17px] bg-[#304f6d] text-white text-[22px] shadow-[0_12px_28px_rgba(48,79,109,.22)] animate-pulse">
              <FaChartLine />
            </div>
            <div className="text-[#303840] text-[18px] font-[720]">
              Preparing Financial Performance
            </div>
            <div className="mt-[6px] text-[#8a949d] text-[11px]">
              Loading financial data and calculating performance...
            </div>
            <div className="h-1 mt-5 rounded-full bg-[#e7eaed] overflow-hidden">
              <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-[#304f6d] to-[#f59e0b]" />
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ==========================================================
     ERROR
     ========================================================== */

  if (error && !firstLoaded) {
    return (
      <>
        <div className="[&_*]:box-border w-full min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(176,122,50,0.07),_transparent_28%),_#f7f8fa] p-7 text-[#263238] font-[Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe_UI,sans-serif]">
          <div className="w-[min(450px,100%)] mx-auto mt-[120px] p-[30px] text-center bg-white border border-[#e7e9ec] rounded-2xl shadow-[0_10px_35px_rgba(30,41,59,.07)]">
            <div className="w-[42px] h-[42px] mx-auto mb-3 flex items-center justify-center rounded-full bg-[#fcefeb] text-[#b34b32] text-[18px] font-extrabold">
              !
            </div>
            <h2 className="m-0 text-[#303840] text-[17px] tracking-[-.025em] font-[720]">
              Unable to load dashboard
            </h2>
            <p>{error}</p>
            <button
              className="h-[38px] border-0 rounded-lg bg-[#304f6d] text-white px-4 text-[11px] font-bold inline-flex items-center gap-[7px] cursor-pointer"
              onClick={() => fetchSummary(true)}
            >
              <FaSyncAlt />
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <>
      <div className="[&_*]:box-border w-full min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(176,122,50,0.07),_transparent_28%),_#f7f8fa] p-2 text-[#263238] font-[Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe_UI,sans-serif]">
        <div
          className={`w-full max-w-[1680px] mx-auto ${refreshing ? "opacity-[.78] transition-opacity duration-[250ms]" : ""}`}
        >
          {/* HEADER */}
          {/* <header className="flex items-end justify-between gap-[30px] mb-[22px] max-[850px]:items-start max-[850px]:flex-col max-[850px]:gap-[10px]">
            <div className="min-w-0"> */}
          {/* <div className="text-[#8b5a24] text-[11px] font-bold tracking-[.16em] mb-[7px]">
                FINANCIAL PERFORMANCE
              </div>
              <h1 className="m-0 text-[clamp(27px,3vw,39px)] leading-[1.08] tracking-[-.035em] font-[720] text-[#27313a]">
                Financial Performance
              </h1> */}
          {/* <p className="mt-2 mb-0 text-[#7a8590] text-[13px] font-medium">
                FY{selectedYear} · {periodLabel} · {performanceLabel}
              </p> */}
          {/* </div>

            <div className="text-right max-[850px]:text-left"> */}
          {/* <div className="inline-flex items-center gap-[7px] py-[7px] px-[11px] rounded-full bg-[rgba(98,131,97,.09)] text-[#557457] text-[11px] font-bold">
                <span className="w-[7px] h-[7px] rounded-full bg-[#628361] shadow-[0_0_0_4px_rgba(98,131,97,.10)]" />
                Financial Summary
              </div> */}

          {/* {createdAt && (
                <div className="mt-2 text-[#98a1aa] text-[10px]">
                  Updated {new Date(createdAt).toLocaleString()}
                </div>
              )}
            </div>
          </header> */}

          {/* FILTER BAR */}
          <section
            className="
    mb-5
    overflow-hidden
    rounded-[15px]
    border border-[#e7e9ec]
    bg-[rgba(255,255,255,0.92)]
    shadow-[0_5px_18px_rgba(30,41,59,0.045)]
  "
          >
            <div
              className="
      flex
      min-h-[74px]
      flex-wrap
      items-center
      gap-[11px]
      p-3.5
      max-[560px]:flex-col
      max-[560px]:items-stretch
    "
            >
              {/* =========================
        FISCAL YEAR
    ========================= */}
              <div
                className="
        min-w-[155px]
        flex-1
        max-[850px]:min-w-[140px]
        max-[560px]:w-full
      "
              >
                <div
                  className="
          mb-[5px]
          ml-0.5
          flex
          items-center
          gap-1.5
          text-[9px]
          font-bold
          
          tracking-[0.08em]
          text-[#89929c]
        "
                >
                  <FaCalendarAlt />
                  Fiscal Year
                </div>

                <div className="relative">
                  <select
                    className="
            h-[38px]
            w-full
            cursor-pointer
            appearance-none
            rounded-[9px]
            border
            border-[#e0e4e8]
            bg-[#fafbfc]
            py-0
            pl-[11px]
            pr-[31px]
            text-[12px]
            font-semibold
            text-[#34404a]
            outline-none
            transition-colors
            duration-150
            hover:bg-white
            focus:border-[#8da2b6]
            focus:bg-white
            focus:shadow-[0_0_0_3px_rgba(72,105,135,0.08)]
          "
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        FY{year}
                      </option>
                    ))}
                  </select>

                  <FaChevronDown
                    className="
            pointer-events-none
            absolute
            right-[11px]
            top-1/2
            -translate-y-1/2
            text-[11px]
            text-[#263238]
          "
                  />
                </div>
              </div>

              {/* =========================
        PERFORMANCE
    ========================= */}
              <div
                className="
        min-w-[155px]
        flex-1
        max-[850px]:min-w-[140px]
        max-[560px]:w-full
      "
              >
                <div
                  className="
          mb-[5px]
          ml-0.5
          flex
          items-center
          gap-1.5
          text-[9px]
          font-bold
          tracking-[0.08em]
          text-[#89929c]
        "
                >
                  <FaChartLine />
                  Performance
                </div>

                <div className="relative">
                  <select
                    className="
            h-[38px]
            w-full
            cursor-pointer
            appearance-none
            rounded-[9px]
            border
            border-[#e0e4e8]
            bg-[#fafbfc]
            py-0
            pl-[11px]
            pr-[31px]
            text-[12px]
            font-semibold
            text-[#34404a]
            outline-none
            transition-colors
            duration-150
            hover:bg-white
            focus:border-[#8da2b6]
            focus:bg-white
            focus:shadow-[0_0_0_3px_rgba(72,105,135,0.08)]
          "
                    value={performanceView}
                    onChange={(e) => setPerformanceView(e.target.value)}
                  >
                    <option value="ACTUAL_VS_BUDGET">Actual vs Budget</option>
                    <option value="ACTUAL">Actual</option>
                    <option value="BUDGET">Budget</option>
                  </select>

                  <FaChevronDown
                    className="
            pointer-events-none
            absolute
            right-[11px]
            top-1/2
            -translate-y-1/2
            text-[11px]
            text-[#263238]
          "
                  />
                </div>
              </div>

              {/* =========================
        PERIOD
    ========================= */}
              <div
                className="
        min-w-[155px]
        flex-1
        max-[850px]:min-w-[140px]
        max-[560px]:w-full
      "
              >
                <div
                  className="
          mb-[5px]
          ml-0.5
          flex
          items-center
          gap-1.5
          text-[9px]
          font-bold
          
          tracking-[0.08em]
          text-[#89929c]
        "
                >
                  <FaCalendarAlt />
                  Period
                </div>

                <div className="relative">
                  <select
                    className="
            h-[38px]
            w-full
            cursor-pointer
            appearance-none
            rounded-[9px]
            border
            border-[#e0e4e8]
            bg-[#fafbfc]
            py-0
            pl-[11px]
            pr-[31px]
            text-[12px]
            font-semibold
            text-[#34404a]
            outline-none
            transition-colors
            duration-150
            hover:bg-white
            focus:border-[#8da2b6]
            focus:bg-white
            focus:shadow-[0_0_0_3px_rgba(72,105,135,0.08)]
          "
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                  >
                    <option value="YTD">Till Close Period</option>
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                    {/* <option value="FULL_YEAR">Full Year</option> */}
                  </select>

                  <FaChevronDown
                    className="
            pointer-events-none
            absolute
            right-[11px]
            top-1/2
            -translate-y-1/2
            text-[11px]
            text-[#263238]
          "
                  />
                </div>
              </div>

              {/* =========================
        PROJECT
    ========================= */}
              {/* {projectOptions.length > 0 && (
                <div
                  className="
          min-w-[180px]
          flex-1
          max-[850px]:min-w-[140px]
          max-[560px]:w-full
        "
                >
                  <div
                    className="
            mb-[5px]
            ml-0.5
            flex
            items-center
            gap-1.5
            text-[9px]
            font-bold
            
            tracking-[0.08em]
            text-[#89929c]
          "
                  >
                    Project
                  </div>

                  <div className="relative">
                    <select
                      className="
              h-[38px]
              w-full
              cursor-pointer
              appearance-none
              rounded-[9px]
              border
              border-[#e0e4e8]
              bg-[#fafbfc]
              py-0
              pl-[11px]
              pr-[31px]
              text-[12px]
              font-semibold
              text-[#34404a]
              outline-none
              transition-colors
              duration-150
              hover:bg-white
              focus:border-[#8da2b6]
              focus:bg-white
              focus:shadow-[0_0_0_3px_rgba(72,105,135,0.08)]
            "
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                    >
                      <option value="ALL">All Projects</option>

                      {projectOptions.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>

                    <FaChevronDown
                      className="
              pointer-events-none
              absolute
              right-[11px]
              top-1/2
              -translate-y-1/2
              text-[11px]
              text-[#263238]
            "
                    />
                  </div>
                </div>
              )} */}

              {/* =========================
        REFRESH
    ========================= */}
              <button
                className="
        mt-4
        inline-flex
        h-[38px]
        min-w-[90px]
        cursor-pointer
        items-center
        justify-center
        gap-[7px]
        rounded-[9px]
        border
        border-[#304f6d]
        bg-[#304f6d]
        px-[13px]
        text-[11px]
        font-bold
        text-white
        transition-transform
        duration-150
        hover:-translate-y-px
        hover:bg-[#27445f]
        disabled:cursor-not-allowed
        disabled:opacity-65
        max-[560px]:mt-0
        max-[560px]:w-full
      "
                onClick={() => fetchSummary(true)}
                disabled={refreshing}
                title="Refresh financial data"
              >
                <FaSyncAlt className={refreshing ? "animate-spin" : ""} />

                <span>{refreshing ? "Refreshing" : "Refresh"}</span>
              </button>
            </div>

            {/* =========================
      MORE FILTERS
  ========================= */}
            {showMoreFilters && (
              <div
                className="
        flex
        items-center
        gap-[30px]
        border-t
        border-[#edf0f2]
        bg-[#fbfcfd]
        p-3.5
        px-4
        max-[850px]:flex-col
        max-[850px]:items-start
      "
              >
                <div>
                  <div
                    className="
            mb-[7px]
            text-[9px]
            font-bold
            
            tracking-[0.08em]
            text-[#89929c]
          "
                  >
                    Display
                  </div>

                  <div className="flex rounded-[9px] border border-[#e0e4e8] bg-white p-[3px]">
                    <button
                      className={`
              inline-flex
              items-center
              gap-1.5
              rounded-[7px]
              px-3
              py-1.5
              text-[11px]
              font-semibold
              ${
                displayMode === "AMOUNT"
                  ? "bg-[#304f6d] text-white"
                  : "text-[#53606b] hover:bg-[#f4f6f8]"
              }
            `}
                      onClick={() => setDisplayMode("AMOUNT")}
                    >
                      <FaDollarSign />
                      Amount
                    </button>

                    <button
                      className={`
              inline-flex
              items-center
              gap-1.5
              rounded-[7px]
              px-3
              py-1.5
              text-[11px]
              font-semibold
              ${
                displayMode === "PERCENT"
                  ? "bg-[#304f6d] text-white"
                  : "text-[#53606b] hover:bg-[#f4f6f8]"
              }
            `}
                      onClick={() => setDisplayMode("PERCENT")}
                    >
                      <FaPercentage />
                      Percentage
                    </button>
                  </div>
                </div>

                <div
                  className="
          flex
          flex-col
          gap-[3px]
          border-l
          border-[#e3e7eb]
          pl-5
          max-[850px]:border-l-0
          max-[850px]:border-t
          max-[850px]:pl-0
          max-[850px]:pt-3
        "
                >
                  <strong className="text-[12px] text-[#34404a]">
                    Dashboard view
                  </strong>

                  <span className="text-[11px] text-[#89929c]">
                    Numbers are calculated from the same summary structure used
                    by the Income Statement report.
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* KPI ROW */}
          <section className="grid grid-cols-5 gap-[13px] mb-[17px] max-[1250px]:grid-cols-3 max-[850px]:grid-cols-2 max-[560px]:grid-cols-1">
            {kpis.map((kpi, index) => (
              <KpiCard
                key={`${kpi.key}-${performanceView}`}
                label={kpi.label}
                value={kpi.value}
                variance={kpi.variance}
                variancePercent={kpi.variancePercent}
                isPercent={kpi.isPercent}
                icon={kpi.icon}
                positiveWhenHigher={true}
                delay={100 + index * 70}
                showVariance={isCompare}
                caption={`${performanceView === "BUDGET" ? "Budget" : "Actual"} · ${periodLabel}`}
              />
            ))}
          </section>

          {/* PRIMARY CHARTS */}
          <section className="grid grid-cols-[minmax(0,1.65fr)_minmax(320px,.85fr)] gap-[17px] mb-[17px] max-[1250px]:grid-cols-1">
            <div className="bg-white border border-[#e7e9ec] rounded-[15px] p-[18px] shadow-[0_5px_18px_rgba(30,41,59,.045)] min-w-0 min-h-[440px]">
              <div className="flex items-start justify-between gap-[15px] mb-[7px]">
                <div>
                  {/* <div className="text-[#a06b2e] text-[9px] font-extrabold tracking-[.12em] mb-1">
                    PERFORMANCE
                  </div> */}
                  <h2 className="m-0 text-[#303840] text-[17px] tracking-[-.025em] font-[720]">
                    {isCompare
                      ? "Budget vs Actual"
                      : showBudget
                        ? "Budget"
                        : "Actual"}{" "}
                    Performance
                  </h2>
                  {/* <p className="mt-1 mb-0 text-[#9099a2] text-[10px]">
                    Financial performance across the selected period
                  </p> */}
                </div>
                {/* <div className="border border-[#e3e7eb] bg-[#f8fafb] text-[#687580] rounded-full py-[5px] px-[9px] text-[9px] font-bold">
                  FY{selectedYear}
                </div> */}
              </div>

              <div className="w-full mt-3 h-[335px] max-[560px]:h-[290px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    key={performanceView}
                    data={performanceChartData}
                    margin={{ top: 15, right: 10, left: 0, bottom: 10 }}
                    barGap={8}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E8EBEF"
                    />
                    <XAxis
                      dataKey="metric"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#667085", fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#667085", fontSize: 11 }}
                      tickFormatter={formatAxisValue}
                    />
                    <Tooltip
                      content={<FinancialTooltip />}
                      cursor={{ fill: "rgba(48,79,109,0.04)" }}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      height={35}
                      iconType="circle"
                      wrapperStyle={{ fontSize: 11, color: "#667085" }}
                    />
                    {showBudget && (
                      <Bar
                        name="Budget"
                        dataKey="budget"
                        fill={COLORS.blue}
                        radius={[5, 5, 0, 0]}
                        animationBegin={150}
                        animationDuration={1100}
                      >
                        <LabelList
                          dataKey="budget"
                          position="top"
                          formatter={(value) => formatMoney(value, true)}
                          style={{
                            fill: "#486987",
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        />
                      </Bar>
                    )}

                    {showActual && (
                      <Bar
                        name="Actual"
                        dataKey="actual"
                        fill={COLORS.gold}
                        radius={[5, 5, 0, 0]}
                        animationBegin={250}
                        animationDuration={1200}
                      >
                        <LabelList
                          dataKey="actual"
                          position="top"
                          formatter={(value) => formatMoney(value, true)}
                          style={{
                            fill: "#a06b2e",
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        />
                      </Bar>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-[#e7e9ec] rounded-[15px] p-[18px] shadow-[0_5px_18px_rgba(30,41,59,.045)] min-w-0 min-h-[440px]">
              <div className="flex items-start justify-between gap-[15px] mb-[7px]">
                <div>
                  <div className="text-[#a06b2e] text-[9px] font-extrabold tracking-[.12em] mb-1">
                    {isCompare ? "VARIANCE" : "BREAKDOWN"}
                  </div>
                  <h2 className="m-0 text-[#303840] text-[17px] tracking-[-.025em] font-[720]">
                    {isCompare ? "Performance Drivers" : "Key Figures"}
                  </h2>
                  <p className="mt-1 mb-0 text-[#9099a2] text-[10px]">
                    {isCompare
                      ? "Largest movements vs budget"
                      : `${showBudget ? "Budget" : "Actual"} figures for the selected period`}
                  </p>
                </div>
              </div>

              <div className="mt-[22px]">
                {varianceDrivers.length === 0 ? (
                  <div className="min-h-[120px] h-full flex items-center justify-center text-[#a0a8af] text-[11px]">
                    No material variance detected.
                  </div>
                ) : (
                  varianceDrivers.map((driver, index) => (
                    <div
                      className="flex gap-3 py-[13px] border-b border-[#eef0f2] last:border-b-0"
                      key={driver.label}
                      style={{ animationDelay: `${250 + index * 80}ms` }}
                    >
                      <div className="w-[26px] h-[26px] shrink-0 flex items-center justify-center rounded-[7px] bg-[#f3f5f7] text-[#89939c] text-[9px] font-extrabold">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2 text-[11px] font-[650] text-[#4a555e]">
                          <span>{driver.label}</span>
                          {/* <strong
                            className={
                              driver.favorable ? "positive" : "negative"
                            }
                          >
                            {driver.variance > 0 ? "+" : "-"}
                            {formatMoney(Math.abs(driver.variance), true)}
                          </strong> */}
                          <strong
                            className={`text-[11px] ${driver.tone === "positive" ? "text-[#628361]" : driver.tone === "negative" ? "text-[#b34b32]" : "text-[#303840]"}`}
                          >
                            {isCompare
                              ? `${driver.variance > 0 ? "+" : "-"}${formatMoney(Math.abs(driver.variance), true)}`
                              : formatMoney(driver.variance, true)}
                          </strong>
                        </div>

                        <div className="w-full h-[5px] mt-[9px] rounded-full bg-[#f0f2f4] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${driver.tone === "positive" ? "bg-[#628361]" : driver.tone === "negative" ? "bg-[#b34b32]" : "bg-[#486987]"}`}
                            style={{
                              width: `${Math.min(100, Math.max(8, (driver.magnitude / maxDriverMagnitude) * 100))}%`,
                            }}
                          />
                        </div>

                        <div className="flex justify-between mt-[5px] text-[#a0a8af] text-[9px]">
                          <span>
                            {isCompare
                              ? driver.favorable
                                ? "Favorable"
                                : "Unfavorable"
                              : showBudget
                                ? "Budget"
                                : "Actual"}
                          </span>
                          <span>{isCompare ? "vs budget" : periodLabel}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* MONTHLY TREND */}
          {/* <section className="bg-white border border-[#e7e9ec] rounded-[15px] p-[18px] shadow-[0_5px_18px_rgba(30,41,59,.045)] min-w-0">
            <div className="flex items-start justify-between gap-[15px] mb-[7px]">
              <div>
                <div className="text-[#a06b2e] text-[9px] font-extrabold tracking-[.12em] mb-1">
                  TREND
                </div>
                <h2 className="m-0 text-[#303840] text-[17px] tracking-[-.025em] font-[720]">
                  Revenue & Profitability Trend
                </h2>
                <p className="mt-1 mb-0 text-[#9099a2] text-[10px]">
                  {isCompare
                    ? "Monthly actual performance compared with budget"
                    : `Monthly ${showBudget ? "budget" : "actual"} performance`}
                </p>
              </div>

              <div className="flex items-center gap-[13px] text-[#7c8790] text-[9px] font-[650]">
                {showActual && (
                  <span className="flex items-center gap-[5px]">
                    <i
                      className="w-[7px] h-[7px] rounded-full"
                      style={{ background: COLORS.gold }}
                    />
                    Actual
                  </span>
                )}
                {showBudget && (
                  <span className="flex items-center gap-[5px]">
                    <i
                      className="w-[7px] h-[7px] rounded-full"
                      style={{ background: COLORS.blue }}
                    />
                    Budget
                  </span>
                )}
              </div>
            </div>

            <div className="w-full mt-3 h-[335px] max-[560px]:h-[290px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={monthlyTrendData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={COLORS.gold}
                        stopOpacity={0.22}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.gold}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E8EBEF"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#667085", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#667085", fontSize: 11 }}
                    tickFormatter={formatAxisValue}
                  />
                  <Tooltip content={<FinancialTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    height={35}
                    iconType="circle"
                    wrapperStyle={{ fontSize: 11 }}
                  />

                  {showActual && (
                    <Area
                      type="monotone"
                      name="Actual Revenue"
                      dataKey="revenue"
                      stroke={COLORS.gold}
                      strokeWidth={3}
                      fill="url(#revenueGradient)"
                      dot={{ r: 3, strokeWidth: 2 }}
                      activeDot={{ r: 5 }}
                      animationBegin={200}
                      animationDuration={1300}
                    />
                  )}
                  {showBudget && (
                    <Line
                      type="monotone"
                      name="Budget Revenue"
                      dataKey="budgetRevenue"
                      stroke={COLORS.blue}
                      strokeWidth={showActual ? 2 : 3}
                      strokeDasharray={showActual ? "6 5" : undefined}
                      dot={showActual ? false : { r: 3 }}
                      animationBegin={350}
                      animationDuration={1400}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </section> */}

          {/* BOTTOM GRID */}
          {/* <section className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] gap-[17px] mt-[17px] max-[1250px]:grid-cols-1">
            <div className="bg-white border border-[#e7e9ec] rounded-[15px] p-[18px] shadow-[0_5px_18px_rgba(30,41,59,.045)] min-w-0">
              <div className="flex items-start justify-between gap-[15px] mb-[7px]">
                <div>
                  <div className="text-[#a06b2e] text-[9px] font-extrabold tracking-[.12em] mb-1">
                    PROFITABILITY
                  </div>
                  <h2 className="m-0 text-[#303840] text-[17px] tracking-[-.025em] font-[720]">
                    Margin Trend
                  </h2>
                  <p className="mt-1 mb-0 text-[#9099a2] text-[10px]">
                    Actual vs budget margin
                  </p>
                </div>
              </div>

              <div className="w-full mt-3 h-[280px] max-[560px]:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={marginTrendData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E8EBEF"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#667085", fontSize: 10 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#667085", fontSize: 10 }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip content={<FinancialTooltip percentage />} />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      height={30}
                      iconType="circle"
                      wrapperStyle={{ fontSize: 10 }}
                    />
                    {showActual && (
                      <Line
                        type="monotone"
                        name="Gross Margin"
                        dataKey="actualGrossMargin"
                        stroke={COLORS.green}
                        strokeWidth={3}
                        dot={{ r: 2 }}
                        animationBegin={200}
                        animationDuration={1100}
                      />
                    )}
                    {showBudget && (
                      <Line
                        type="monotone"
                        name="Budget Margin"
                        dataKey="budgetGrossMargin"
                        stroke={COLORS.blue}
                        strokeWidth={showActual ? 2 : 3}
                        strokeDasharray={showActual ? "5 4" : undefined}
                        dot={showActual ? false : { r: 2 }}
                        animationBegin={300}
                        animationDuration={1200}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-[#e7e9ec] rounded-[15px] p-[18px] shadow-[0_5px_18px_rgba(30,41,59,.045)] min-w-0">
              <div className="flex items-start justify-between gap-[15px] mb-[7px]">
                <div>
                  <div className="text-[#a06b2e] text-[9px] font-extrabold tracking-[.12em] mb-1">
                    MIX
                  </div>
                  <h2 className="m-0 text-[#303840] text-[17px] tracking-[-.025em] font-[720]">
                    Direct Cost Composition
                  </h2>
                  <p className="mt-1 mb-0 text-[#9099a2] text-[10px]">
                    Selected period direct cost mix
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[minmax(180px,.9fr)_minmax(180px,1.1fr)] gap-3 items-center min-h-[270px] max-[850px]:grid-cols-1">
                <div className="h-[250px] min-w-0 max-[850px]:h-[220px]">
                  {revenueComposition.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueComposition}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius="58%"
                          outerRadius="78%"
                          paddingAngle={2}
                          animationBegin={250}
                          animationDuration={1200}
                        >
                          {revenueComposition.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => formatMoney(value, true)}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="min-h-[120px] h-full flex items-center justify-center text-[#a0a8af] text-[11px]">
                      No composition data
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-[11px]">
                  {revenueComposition.map((item, index) => (
                    <div
                      className="flex items-center justify-between gap-3 text-[#68737c] text-[10px]"
                      key={item.name}
                    >
                      <span className="flex items-center gap-[7px]">
                        <i
                          className="w-[7px] h-[7px] rounded-[2px]"
                          style={{
                            background: PIE_COLORS[index % PIE_COLORS.length],
                          }}
                        />
                        {item.name}
                      </span>
                      <strong>{formatMoney(item.value, true)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section> */}

          {/* SUMMARY STRIP */}
          {/* <section className="grid grid-cols-5 bg-[#304f6d] rounded-[14px] overflow-hidden mt-[17px] mb-[10px] shadow-[0_8px_25px_rgba(48,79,109,.14)] max-[850px]:grid-cols-2 max-[560px]:grid-cols-1">
            {[
              {
                label: "Gross Margin",
                value: viewMetrics.grossMargin,
                pct: true,
              },
              {
                label: "Operating Margin",
                value: viewMetrics.operatingMargin,
                pct: true,
              },
              { label: "Direct Costs", value: viewMetrics.directCost },
              {
                label: "Operating Expenses",
                value: viewMetrics.operatingExpenses,
              },
              { label: "Net Margin", value: viewMetrics.netMargin, pct: true },
            ].map((item) => (
              <div
                key={item.label}
                className="py-4 px-[18px] border-r border-[rgba(255,255,255,.12)] last:border-r-0 max-[850px]:border-b max-[850px]:nth-[2]:border-r-0 max-[560px]:border-r-0"
              >
                <span className="block text-[rgba(255,255,255,.62)] text-[9px] font-[650]  tracking-[.06em] mb-[5px]">
                  {item.label}
                </span>
                <strong
                  className={`text-white text-[17px] font-bold ${item.value < 0 ? "text-[#ff9b85]" : ""}`}
                >
                  {item.pct
                    ? formatPercent(item.value)
                    : formatMoney(item.value, true)}
                </strong>
              </div>
            ))}
          </section> */}

          {error && (
            <div className="flex justify-between items-center mt-[10px] py-[9px] px-3 bg-[#fff8f5] border border-[#f2ddd5] rounded-lg text-[#a4543f] text-[10px]">
              <span>Latest refresh failed: {error}</span>
              <button onClick={() => fetchSummary(true)}>Retry</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FinancialPerformanceDashboard;
