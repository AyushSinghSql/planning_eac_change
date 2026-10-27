// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { backendUrl } from "./config";

// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   PieChart,
//   Pie,
//   Cell,
//   LabelList,
// } from "recharts";

// import {
//   Wallet,
//   Landmark,
//   Scale,
//   ArrowLeftRight,
//   TrendingUp,
//   TrendingDown,
//   RefreshCw,
//   AlertCircle,
//   CalendarDays,
// } from "lucide-react";

// const COLORS = {
//   navy: "#172554",
//   blue: "#2563EB",
//   gold: "#D97706",
//   green: "#059669",
//   red: "#DC2626",
//   purple: "#7C3AED",
//   teal: "#0D9488",
//   grid: "#E2E8F0",
//   text: "#64748B",
// };

// const CHART_COLORS = [
//   "#2563EB",
//   "#059669",
//   "#D97706",
//   "#7C3AED",
//   "#0D9488",
//   "#DC2626",
//   "#64748B",
// ];

// const numberValue = (value) => {
//   if (value === null || value === undefined || value === "") return 0;

//   if (typeof value === "number") {
//     return Number.isFinite(value) ? value : 0;
//   }

//   const parsed = Number(String(value).replace(/[$,\s]/g, ""));
//   return Number.isFinite(parsed) ? parsed : 0;
// };

// const formatMoney = (value, currency = "USD") => {
//   const amount = numberValue(value);

//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency,
//     maximumFractionDigits: 0,
//     minimumFractionDigits: 0,
//   }).format(amount);
// };

// const formatCompact = (value, currency = "USD") => {
//   const amount = numberValue(value);

//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency,
//     notation: "compact",
//     maximumFractionDigits: 1,
//   }).format(amount);
// };

// const formatPercent = (value) => {
//   if (!Number.isFinite(value)) return "—";
//   return `${value.toFixed(1)}%`;
// };

// const getAmount = (row, field) => numberValue(row?.[field]);

// const normalizeResponse = (response) => {
//   if (Array.isArray(response)) return response;

//   if (Array.isArray(response?.data)) return response.data;
//   if (Array.isArray(response?.items)) return response.items;
//   if (Array.isArray(response?.result)) return response.result;
//   if (Array.isArray(response?.data?.items)) return response.data.items;
//   if (Array.isArray(response?.data?.result)) return response.data.result;

//   return [];
// };

// const getTopLevel = (row) =>
//   row?.fsSort1Desc ||
//   row?.fsSort1 ||
//   row?.sort1Desc ||
//   row?.level1 ||
//   row?.category ||
//   row?.type ||
//   "Other";

// const getSubLevel = (row) =>
//   row?.fsSort2Desc ||
//   row?.fsSort2 ||
//   row?.sort2Desc ||
//   row?.level2 ||
//   row?.subcategory ||
//   "";

// const getRowLabel = (row) =>
//   row?.fsSort3Desc ||
//   row?.fsSort3 ||
//   row?.sort3Desc ||
//   row?.accountName ||
//   row?.description ||
//   row?.name ||
//   row?.account ||
//   getSubLevel(row) ||
//   getTopLevel(row);

// const normalizeLabel = (value) =>
//   String(value || "")
//     .toLowerCase()
//     .replace(/[_&-]/g, " ")
//     .replace(/\s+/g, " ")
//     .trim();

// const isAssetsRow = (row) => {
//   const label = normalizeLabel(
//     `${getTopLevel(row)} ${getSubLevel(row)} ${getRowLabel(row)}`,
//   );

//   return (
//     label.includes("asset") ||
//     label.includes("cash and cash equivalent") ||
//     label.includes("accounts receivable") ||
//     label.includes("inventory")
//   );
// };

// const isLiabilitiesRow = (row) => {
//   const label = normalizeLabel(
//     `${getTopLevel(row)} ${getSubLevel(row)} ${getRowLabel(row)}`,
//   );

//   return (
//     label.includes("liabilit") ||
//     label.includes("accounts payable") ||
//     label.includes("accrued expense") ||
//     label.includes("long term debt") ||
//     label.includes("current debt")
//   );
// };

// const isEquityRow = (row) => {
//   const label = normalizeLabel(
//     `${getTopLevel(row)} ${getSubLevel(row)} ${getRowLabel(row)}`,
//   );

//   return (
//     label.includes("equity") ||
//     label.includes("stockholder") ||
//     label.includes("shareholder") ||
//     label.includes("retained earning") ||
//     label.includes("capital stock")
//   );
// };

// const isCurrentAssetRow = (row) => {
//   const label = normalizeLabel(
//     `${getTopLevel(row)} ${getSubLevel(row)} ${getRowLabel(row)}`,
//   );

//   return (
//     isAssetsRow(row) &&
//     (label.includes("current asset") ||
//       label.includes("cash") ||
//       label.includes("receivable") ||
//       label.includes("inventory") ||
//       label.includes("prepaid"))
//   );
// };

// const isCurrentLiabilityRow = (row) => {
//   const label = normalizeLabel(
//     `${getTopLevel(row)} ${getSubLevel(row)} ${getRowLabel(row)}`,
//   );

//   return (
//     isLiabilitiesRow(row) &&
//     (label.includes("current liabilit") ||
//       label.includes("accounts payable") ||
//       label.includes("accrued") ||
//       label.includes("short term") ||
//       label.includes("current debt"))
//   );
// };

// const sumField = (rows, field) =>
//   rows.reduce((sum, row) => sum + getAmount(row, field), 0);

// const getChangePercent = (current, previous) => {
//   if (previous === 0) {
//     if (current === 0) return 0;
//     return null;
//   }

//   return ((current - previous) / Math.abs(previous)) * 100;
// };

// const getChangeLabel = (current, previous) => {
//   const change = current - previous;

//   if (change > 0) return "Increase";
//   if (change < 0) return "Decrease";
//   return "No change";
// };

// const CustomTooltip = ({ active, payload, label, currency = "USD" }) => {
//   if (!active || !payload?.length) return null;

//   return (
//     <div className="min-w-[180px] rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
//       {label && (
//         <p className="mb-2 text-xs font-bold text-slate-700">{label}</p>
//       )}

//       {payload.map((item, index) => (
//         <div
//           key={`${item.dataKey || item.name}-${index}`}
//           className="mb-1 flex items-center justify-between gap-4 text-xs"
//         >
//           <span className="flex items-center gap-2 text-slate-500">
//             <span
//               className="h-2.5 w-2.5 rounded-sm"
//               style={{ backgroundColor: item.color || item.fill }}
//             />
//             {item.name}
//           </span>

//           <span className="font-bold text-slate-800">
//             {formatMoney(item.value, currency)}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// const KpiCard = ({
//   title,
//   value,
//   previousValue,
//   change,
//   icon: Icon,
//   iconColor,
//   currency,
//   subtitle,
// }) => {
//   const positive = numberValue(change) >= 0;
//   const isUnavailable = change === null || change === undefined;

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
//       <div className="flex items-start justify-between gap-3">
//         <div className="min-w-0">
//           <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
//             {title}
//           </p>

//           <p className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-900">
//             {formatCompact(value, currency)}
//           </p>

//           <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
//         </div>

//         <div
//           className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
//           style={{ backgroundColor: `${iconColor}15`, color: iconColor }}
//         >
//           <Icon size={20} />
//         </div>
//       </div>

//       <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
//         <span className="text-xs text-slate-500">
//           Prior: {formatCompact(previousValue, currency)}
//         </span>

//         <span
//           className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
//             isUnavailable
//               ? "bg-slate-100 text-slate-500"
//               : positive
//                 ? "bg-emerald-50 text-emerald-700"
//                 : "bg-red-50 text-red-700"
//           }`}
//         >
//           {!isUnavailable &&
//             (positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />)}
//           {isUnavailable ? "N/A" : formatPercent(change)}
//         </span>
//       </div>
//     </div>
//   );
// };

// const ChartCard = ({ title, subtitle, children, action }) => (
//   <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//     <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
//       <div>
//         <h3 className="text-sm font-bold text-slate-800">{title}</h3>
//         {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
//       </div>
//       {action}
//     </div>

//     {children}
//   </div>
// );

// export default function BalanceSheetDashboard({
//   currentYear = new Date().getFullYear(),
//   currency = "USD",
// }) {
//   const [selectedYear, setSelectedYear] = useState(Number(currentYear));
//   const [apiData, setApiData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const priorYear = selectedYear - 1;

//   const availableYears = useMemo(() => {
//     const thisYear = Number(currentYear);

//     return Array.from({ length: 4 }, (_, index) => thisYear - index);
//   }, [currentYear]);

//   // API updates whenever the selected fiscal year changes.
//   useEffect(() => {
//     let isMounted = true;

//     const fetchBalanceSheet = async () => {
//       setLoading(true);
//       setError("");

//       try {
//         const apiUrl =
//           `${backendUrl}/api/ForecastReport/GetBalanceSheet` +
//           `?fyCd=${encodeURIComponent(selectedYear)}`;

//         const response = await axios.get(apiUrl);

//         if (!isMounted) return;

//         const normalizedData = normalizeResponse(response.data);
//         setApiData(normalizedData);

//         if (!normalizedData.length) {
//           setError(
//             `No balance sheet data was returned for fiscal year ${selectedYear}.`,
//           );
//         }
//       } catch (err) {
//         if (!isMounted) return;

//         console.error("Failed to fetch balance sheet:", err);
//         setApiData([]);

//         setError(
//           err?.response?.data?.message ||
//             err?.response?.data?.title ||
//             `Unable to load balance sheet data for fiscal year ${selectedYear}.`,
//         );
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchBalanceSheet();

//     return () => {
//       isMounted = false;
//     };
//   }, [selectedYear]);

//   /*
//    * API assumption:
//    *   amount   = selected fiscal year's value
//    *   pyAmount = previous fiscal year's value
//    *
//    * The dashboard compares these two fields for the selected year.
//    */
//   const metrics = useMemo(() => {
//     const rows = apiData;

//     const assetsRows = rows.filter(isAssetsRow);
//     const liabilitiesRows = rows.filter(isLiabilitiesRow);
//     const equityRows = rows.filter(isEquityRow);

//     const totalAssets = sumField(assetsRows, "amount");
//     const priorAssets = sumField(assetsRows, "pyAmount");

//     const totalLiabilities = sumField(liabilitiesRows, "amount");
//     const priorLiabilities = sumField(liabilitiesRows, "pyAmount");

//     const totalEquity = sumField(equityRows, "amount");
//     const priorEquity = sumField(equityRows, "pyAmount");

//     const currentAssetsRows = rows.filter(isCurrentAssetRow);
//     const currentLiabilitiesRows = rows.filter(isCurrentLiabilityRow);

//     const currentAssets = sumField(currentAssetsRows, "amount");
//     const priorCurrentAssets = sumField(currentAssetsRows, "pyAmount");

//     const currentLiabilities = sumField(currentLiabilitiesRows, "amount");
//     const priorCurrentLiabilities = sumField(
//       currentLiabilitiesRows,
//       "pyAmount",
//     );

//     return {
//       totalAssets,
//       priorAssets,
//       totalLiabilities,
//       priorLiabilities,
//       totalEquity,
//       priorEquity,
//       workingCapital: currentAssets - currentLiabilities,
//       priorWorkingCapital: priorCurrentAssets - priorCurrentLiabilities,
//     };
//   }, [apiData]);

//   const kpis = useMemo(
//     () => [
//       {
//         title: "Total Assets",
//         value: metrics.totalAssets,
//         previousValue: metrics.priorAssets,
//         change: getChangePercent(metrics.totalAssets, metrics.priorAssets),
//         icon: Wallet,
//         iconColor: COLORS.blue,
//         subtitle: `${priorYear} vs. ${selectedYear}`,
//       },
//       {
//         title: "Total Liabilities",
//         value: metrics.totalLiabilities,
//         previousValue: metrics.priorLiabilities,
//         change: getChangePercent(
//           metrics.totalLiabilities,
//           metrics.priorLiabilities,
//         ),
//         icon: Landmark,
//         iconColor: COLORS.red,
//         subtitle: `${priorYear} vs. ${selectedYear}`,
//       },
//       {
//         title: "Total Equity",
//         value: metrics.totalEquity,
//         previousValue: metrics.priorEquity,
//         change: getChangePercent(metrics.totalEquity, metrics.priorEquity),
//         icon: Scale,
//         iconColor: COLORS.purple,
//         subtitle: `${priorYear} vs. ${selectedYear}`,
//       },
//       {
//         title: "Working Capital",
//         value: metrics.workingCapital,
//         previousValue: metrics.priorWorkingCapital,
//         change: getChangePercent(
//           metrics.workingCapital,
//           metrics.priorWorkingCapital,
//         ),
//         icon: ArrowLeftRight,
//         iconColor: COLORS.teal,
//         subtitle: "Current assets − current liabilities",
//       },
//     ],
//     [metrics, priorYear, selectedYear],
//   );

//   // Aggregate the top-level balance sheet categories for comparison.
//   const categoryData = useMemo(() => {
//     const grouped = new Map();

//     apiData.forEach((row) => {
//       const category = String(getTopLevel(row)).trim() || "Other";

//       if (!grouped.has(category)) {
//         grouped.set(category, {
//           category,
//           current: 0,
//           previous: 0,
//         });
//       }

//       const item = grouped.get(category);
//       item.current += getAmount(row, "amount");
//       item.previous += getAmount(row, "pyAmount");
//     });

//     return Array.from(grouped.values())
//       .filter((item) => item.current !== 0 || item.previous !== 0)
//       .sort(
//         (a, b) =>
//           Math.max(Math.abs(b.current), Math.abs(b.previous)) -
//           Math.max(Math.abs(a.current), Math.abs(a.previous)),
//       )
//       .slice(0, 10);
//   }, [apiData]);

//   // Composition chart uses selected-year balances.
//   const compositionData = useMemo(() => {
//     const items = [
//       { name: "Assets", value: Math.abs(metrics.totalAssets) },
//       { name: "Liabilities", value: Math.abs(metrics.totalLiabilities) },
//       { name: "Equity", value: Math.abs(metrics.totalEquity) },
//     ];

//     return items.filter((item) => item.value > 0);
//   }, [metrics]);

//   const handleYearChange = (event) => {
//     const year = Number(event.target.value);

//     if (Number.isFinite(year)) {
//       setSelectedYear(year);
//     }
//   };

//   const handleRefresh = () => {
//     // Trigger a fresh request even if the selected year stays the same.
//     setSelectedYear((year) => year + 0.0001);
//     setTimeout(() => {
//       setSelectedYear((year) => Math.round(year));
//     }, 0);
//   };

//   return (
//     <div className="h-full min-h-0 w-full overflow-y-auto bg-slate-50 p-4 text-slate-700 md:p-6">
//       {/* Header and year filter */}
//       <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
//         <div>
//           <div className="flex items-center gap-2">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
//               <Landmark size={21} />
//             </div>

//             <div>
//               <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
//                 Balance Sheet Dashboard
//               </h1>
//               <p className="mt-1 text-xs text-slate-500 md:text-sm">
//                 Financial position and year-over-year comparison
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-wrap items-end gap-3">
//           <div className="min-w-[150px]">
//             <label
//               htmlFor="balance-sheet-year"
//               className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600"
//             >
//               <CalendarDays size={14} />
//               Fiscal Year
//             </label>

//             <select
//               id="balance-sheet-year"
//               value={selectedYear}
//               onChange={handleYearChange}
//               className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//             >
//               {availableYears.map((year) => (
//                 <option key={year} value={year}>
//                   FY {year}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600">
//             <span>FY {priorYear}</span>
//             <ArrowLeftRight size={14} className="text-slate-400" />
//             <span className="text-blue-700">FY {selectedYear}</span>
//           </div>

//           <button
//             type="button"
//             onClick={() => {
//               setError("");
//               setSelectedYear((year) => year + 0.0001);
//               setTimeout(() => {
//                 setSelectedYear((year) => Math.round(year));
//               }, 0);
//             }}
//             disabled={loading}
//             className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Error state */}
//       {error && !loading && (
//         <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
//           <AlertCircle size={19} className="mt-0.5 shrink-0 text-red-600" />

//           <div>
//             <p className="text-sm font-semibold text-red-800">
//               Unable to display balance sheet
//             </p>
//             <p className="mt-1 text-xs text-red-700">{error}</p>
//           </div>
//         </div>
//       )}

//       {/* Loading state */}
//       {/* {loading && (
//         <div className="mb-5 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
//           <RefreshCw size={18} className="animate-spin text-blue-600" />
//           <div>
//             <p className="text-sm font-semibold text-blue-800">
//               Loading FY {selectedYear}...
//             </p>
//             <p className="mt-1 text-xs text-blue-700">
//               Fetching balance sheet data for the selected year.
//             </p>
//           </div>
//         </div>
//       )} */}

//       {/* KPI cards */}
//       <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         {kpis.map((kpi) => (
//           <KpiCard key={kpi.title} {...kpi} currency={currency} />
//         ))}
//       </div>

//       {/* Charts */}
//       <div className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
//         {/* First chart: takes 2 columns */}
//         <div className="min-w-0 xl:col-span-2">
//           <ChartCard
//             title="Balance Sheet Comparison"
//             subtitle={`Prior fiscal year ${priorYear} vs. selected fiscal year ${selectedYear}`}
//             action={
//               <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
//                 Year over year
//               </span>
//             }
//           >
//             <div className="h-[320px] w-full">
//               {categoryData.length ? (
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={[
//                       {
//                         name: "Assets",
//                         [String(priorYear)]: metrics.priorAssets,
//                         [String(selectedYear)]: metrics.totalAssets,
//                       },
//                       {
//                         name: "Liabilities",
//                         [String(priorYear)]: metrics.priorLiabilities,
//                         [String(selectedYear)]: metrics.totalLiabilities,
//                       },
//                       {
//                         name: "Equity",
//                         [String(priorYear)]: metrics.priorEquity,
//                         [String(selectedYear)]: metrics.totalEquity,
//                       },
//                     ]}
//                     margin={{ top: 20, right: 12, left: 8, bottom: 4 }}
//                     barGap={8}
//                   >
//                     <CartesianGrid
//                       strokeDasharray="3 3"
//                       vertical={false}
//                       stroke={COLORS.grid}
//                     />

//                     <XAxis
//                       dataKey="name"
//                       tick={{ fontSize: 11, fill: COLORS.text }}
//                       axisLine={false}
//                       tickLine={false}
//                     />

//                     <YAxis
//                       tickFormatter={(value) => formatCompact(value, currency)}
//                       tick={{ fontSize: 10, fill: COLORS.text }}
//                       axisLine={false}
//                       tickLine={false}
//                       width={85}
//                     />

//                     <Tooltip content={<CustomTooltip currency={currency} />} />

//                     <Legend wrapperStyle={{ fontSize: 11, paddingTop: 12 }} />

//                     <Bar
//                       dataKey={String(priorYear)}
//                       name={`FY ${priorYear}`}
//                       fill="#94A3B8"
//                       radius={[5, 5, 0, 0]}
//                       maxBarSize={42}
//                     />

//                     <Bar
//                       dataKey={String(selectedYear)}
//                       name={`FY ${selectedYear}`}
//                       fill={COLORS.blue}
//                       radius={[5, 5, 0, 0]}
//                       maxBarSize={42}
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <div className="flex h-full items-center justify-center text-sm text-slate-400">
//                   {loading
//                     ? "Loading chart..."
//                     : "No comparison data available"}
//                 </div>
//               )}
//             </div>
//           </ChartCard>
//         </div>

//         <div className="min-w-0">
//           <ChartCard
//             title={`Balance Sheet Composition — FY ${selectedYear}`}
//             subtitle="Relative size of assets, liabilities, and equity"
//           >
//             <div className="h-[320px] w-full">
//               {compositionData.length ? (
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={compositionData}
//                       dataKey="value"
//                       nameKey="name"
//                       cx="50%"
//                       cy="45%"
//                       innerRadius={60}
//                       outerRadius={95}
//                       paddingAngle={3}
//                       labelLine
//                       label={({ name, percent }) =>
//                         `${name} ${(percent * 100).toFixed(0)}%`
//                       }
//                     >
//                       {compositionData.map((item, index) => (
//                         <Cell
//                           key={item.name}
//                           fill={CHART_COLORS[index % CHART_COLORS.length]}
//                         />
//                       ))}
//                     </Pie>

//                     <Tooltip content={<CustomTooltip currency={currency} />} />

//                     <Legend
//                       verticalAlign="bottom"
//                       wrapperStyle={{ fontSize: 11 }}
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <div className="flex h-full items-center justify-center text-sm text-slate-400">
//                   {loading
//                     ? "Loading chart..."
//                     : "No composition data available"}
//                 </div>
//               )}
//             </div>
//           </ChartCard>
//         </div>
//       </div>

//       {/* Composition and summary */}
//       {/* <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
//         <ChartCard
//           title="Category Comparison"
//           subtitle={`Top-level balances: FY ${priorYear} vs. FY ${selectedYear}`}
//         >
//           <div className="h-[320px] w-full">
//             {categoryData.length ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={categoryData}
//                   layout="vertical"
//                   margin={{ top: 4, right: 20, left: 16, bottom: 4 }}
//                   barGap={4}
//                 >
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     horizontal={false}
//                     stroke={COLORS.grid}
//                   />

//                   <XAxis
//                     type="number"
//                     tickFormatter={(value) => formatCompact(value, currency)}
//                     tick={{ fontSize: 10, fill: COLORS.text }}
//                     axisLine={false}
//                     tickLine={false}
//                   />

//                   <YAxis
//                     type="category"
//                     dataKey="category"
//                     width={115}
//                     tick={{ fontSize: 10, fill: COLORS.text }}
//                     axisLine={false}
//                     tickLine={false}
//                   />

//                   <Tooltip
//                     content={<CustomTooltip currency={currency} />}
//                   />

//                   <Legend
//                     wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
//                   />

//                   <Bar
//                     dataKey="previous"
//                     name={`FY ${priorYear}`}
//                     fill="#94A3B8"
//                     radius={[0, 4, 4, 0]}
//                     maxBarSize={18}
//                   />

//                   <Bar
//                     dataKey="current"
//                     name={`FY ${selectedYear}`}
//                     fill={COLORS.teal}
//                     radius={[0, 4, 4, 0]}
//                     maxBarSize={18}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="flex h-full items-center justify-center text-sm text-slate-400">
//                 {loading ? "Loading chart..." : "No category data available"}
//               </div>
//             )}
//           </div>
//         </ChartCard>

//         <div className="xl:col-span-2">
//           <ChartCard
//             title="Year-over-Year Summary"
//             subtitle={`Key changes from FY ${priorYear} to FY ${selectedYear}`}
//           >
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[500px] border-collapse text-left text-sm">
//                 <thead>
//                   <tr className="border-b border-slate-200 bg-slate-50">
//                     <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Metric
//                     </th>
//                     <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       FY {priorYear}
//                     </th>
//                     <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       FY {selectedYear}
//                     </th>
//                     <th className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Change
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {[
//                     {
//                       name: "Total Assets",
//                       current: metrics.totalAssets,
//                       previous: metrics.priorAssets,
//                     },
//                     {
//                       name: "Total Liabilities",
//                       current: metrics.totalLiabilities,
//                       previous: metrics.priorLiabilities,
//                     },
//                     {
//                       name: "Total Equity",
//                       current: metrics.totalEquity,
//                       previous: metrics.priorEquity,
//                     },
//                     {
//                       name: "Working Capital",
//                       current: metrics.workingCapital,
//                       previous: metrics.priorWorkingCapital,
//                     },
//                   ].map((item) => {
//                     const difference = item.current - item.previous;
//                     const percent = getChangePercent(
//                       item.current,
//                       item.previous
//                     );

//                     return (
//                       <tr
//                         key={item.name}
//                         className="border-b border-slate-100 transition hover:bg-slate-50"
//                       >
//                         <td className="px-3 py-3 font-semibold text-slate-700">
//                           {item.name}
//                         </td>

//                         <td className="px-3 py-3 text-right text-slate-500">
//                           {formatMoney(item.previous, currency)}
//                         </td>

//                         <td className="px-3 py-3 text-right font-semibold text-slate-800">
//                           {formatMoney(item.current, currency)}
//                         </td>

//                         <td className="px-3 py-3 text-right">
//                           <div
//                             className={`font-semibold ${
//                               difference > 0
//                                 ? "text-emerald-700"
//                                 : difference < 0
//                                   ? "text-red-700"
//                                   : "text-slate-500"
//                             }`}
//                           >
//                             {difference > 0 ? "+" : ""}
//                             {formatMoney(difference, currency)}
//                           </div>

//                           <div className="mt-0.5 text-xs text-slate-400">
//                             {percent === null
//                               ? "N/A"
//                               : `${percent > 0 ? "+" : ""}${formatPercent(percent)}`}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
//               <div className="rounded-xl bg-blue-50 p-3">
//                 <p className="text-xs font-semibold text-blue-700">
//                   Assets less Liabilities
//                 </p>
//                 <p className="mt-1 text-lg font-bold text-blue-900">
//                   {formatMoney(
//                     metrics.totalAssets - metrics.totalLiabilities,
//                     currency
//                   )}
//                 </p>
//                 <p className="mt-1 text-xs text-blue-700">
//                   FY {selectedYear}
//                 </p>
//               </div>

//               <div className="rounded-xl bg-purple-50 p-3">
//                 <p className="text-xs font-semibold text-purple-700">
//                   Liabilities-to-Assets
//                 </p>
//                 <p className="mt-1 text-lg font-bold text-purple-900">
//                   {metrics.totalAssets !== 0
//                     ? formatPercent(
//                         (metrics.totalLiabilities / metrics.totalAssets) * 100
//                       )
//                     : "—"}
//                 </p>
//                 <p className="mt-1 text-xs text-purple-700">
//                   Liabilities as a share of assets
//                 </p>
//               </div>
//             </div>
//           </ChartCard>
//         </div>
//       </div> */}

//       {/* Footer */}
//       <div className="mt-5 flex flex-wrap items-center justify-between gap-2 pb-2 text-xs text-slate-400">
//         <span>Balance Sheet Dashboard</span>
//         <span>
//           Comparing FY {priorYear} with FY {selectedYear}
//         </span>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { backendUrl } from "./config";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";

import {
  Wallet,
  Landmark,
  Scale,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

const COLORS = {
  navy: "#172554",
  blue: "#2563EB",
  gold: "#D97706",
  green: "#059669",
  red: "#DC2626",
  purple: "#7C3AED",
  teal: "#0D9488",
  grid: "#E2E8F0",
  text: "#64748B",
};

const CHART_COLORS = [
  "#2563EB",
  "#059669",
  "#D97706",
  "#7C3AED",
  "#0D9488",
  "#DC2626",
  "#64748B",
];

const numberValue = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const parsed = Number(String(value).replace(/[$,\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatMoney = (value, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(numberValue(value));

const formatCompact = (value, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(numberValue(value));

const formatPercent = (value) =>
  Number.isFinite(value) ? `${value.toFixed(1)}%` : "—";

const getAmount = (row, field) => numberValue(row?.[field]);

const normalizeResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.result)) return response.result;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.data?.result)) return response.data.result;
  return [];
};

const getTopLevel = (row) =>
  row?.fsSort1Desc ||
  row?.fsSort1 ||
  row?.sort1Desc ||
  row?.level1 ||
  row?.category ||
  row?.type ||
  "Other";

const getSubLevel = (row) =>
  row?.fsSort2Desc ||
  row?.fsSort2 ||
  row?.sort2Desc ||
  row?.level2 ||
  row?.subcategory ||
  "";

const getRowLabel = (row) =>
  row?.fsSort3Desc ||
  row?.fsSort3 ||
  row?.sort3Desc ||
  row?.accountName ||
  row?.description ||
  row?.name ||
  row?.account ||
  getSubLevel(row) ||
  getTopLevel(row);

const normalizeLabel = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[_&-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getCombinedLabel = (row) =>
  normalizeLabel(`${getTopLevel(row)} ${getSubLevel(row)} ${getRowLabel(row)}`);

const isAssetsRow = (row) => {
  const label = getCombinedLabel(row);

  return (
    label.includes("asset") ||
    label.includes("cash and cash equivalent") ||
    label.includes("accounts receivable") ||
    label.includes("inventory")
  );
};

const isLiabilitiesRow = (row) => {
  const label = getCombinedLabel(row);

  return (
    label.includes("liabilit") ||
    label.includes("accounts payable") ||
    label.includes("accrued expense") ||
    label.includes("long term debt") ||
    label.includes("current debt")
  );
};

const isEquityRow = (row) => {
  const label = getCombinedLabel(row);

  return (
    label.includes("equity") ||
    label.includes("stockholder") ||
    label.includes("shareholder") ||
    label.includes("retained earning") ||
    label.includes("capital stock")
  );
};

const isCurrentAssetRow = (row) => {
  const label = getCombinedLabel(row);

  return (
    isAssetsRow(row) &&
    (label.includes("current asset") ||
      label.includes("cash") ||
      label.includes("receivable") ||
      label.includes("inventory") ||
      label.includes("prepaid"))
  );
};

const isCurrentLiabilityRow = (row) => {
  const label = getCombinedLabel(row);

  return (
    isLiabilitiesRow(row) &&
    (label.includes("current liabilit") ||
      label.includes("accounts payable") ||
      label.includes("accrued") ||
      label.includes("short term") ||
      label.includes("current debt"))
  );
};

const sumField = (rows, field) =>
  rows.reduce((sum, row) => sum + getAmount(row, field), 0);

const getChangePercent = (current, previous) => {
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
};

const CustomTooltip = ({ active, payload, label, currency = "USD" }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-[180px] rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
      {label && (
        <p className="mb-2 text-xs font-bold text-slate-700">{label}</p>
      )}

      {payload.map((item, index) => (
        <div
          key={`${item.dataKey || item.name}-${index}`}
          className="mb-1 flex items-center justify-between gap-4 text-xs"
        >
          <span className="flex items-center gap-2 text-slate-500">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: item.color || item.fill }}
            />
            {item.name}
          </span>

          <span className="font-bold text-slate-800">
            {formatMoney(item.value, currency)}
          </span>
        </div>
      ))}
    </div>
  );
};

const KpiCard = ({
  title,
  value,
  previousValue,
  change,
  icon: Icon,
  iconColor,
  currency,
  subtitle,
}) => {
  const positive = numberValue(change) >= 0;
  const unavailable = change === null || change === undefined;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div
        className="absolute left-0 top-0 h-1 w-full"
        style={{
          background: `linear-gradient(to right, ${COLORS.navy}, ${COLORS.gold})`,
        }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-wide text-slate-500">
            {title}
          </p>

          <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
            {formatCompact(value, currency)}
          </p>

          <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `${iconColor}12`,
            color: iconColor,
          }}
        >
          <Icon size={19} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-500">
          Prior: {formatCompact(previousValue, currency)}
        </span>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
            unavailable
              ? "bg-slate-100 text-slate-500"
              : positive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
          }`}
        >
          {!unavailable &&
            (positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />)}

          {unavailable ? "N/A" : formatPercent(change)}
        </span>
      </div>
    </div>
  );
};

const ChartCard = ({ title, subtitle, children, action }) => (
  <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-bold tracking-tight text-slate-800">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1.5 text-xs text-slate-500">{subtitle}</p>
        )}
      </div>

      {action}
    </div>

    {children}
  </div>
);

export default function BalanceSheetDashboard({
  currentYear = new Date().getFullYear(),
  currency = "USD",
}) {
  const [selectedYear, setSelectedYear] = useState(Number(currentYear));
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const priorYear = selectedYear - 1;

  const availableYears = useMemo(() => {
    const baseYear = Number(currentYear);
    return Array.from({ length: 4 }, (_, index) => baseYear - index);
  }, [currentYear]);

  // Fetch the selected fiscal year from the API.
  useEffect(() => {
    const controller = new AbortController();

    const fetchBalanceSheet = async () => {
      setLoading(true);
      setError("");

      try {
        const apiUrl =
          `${backendUrl}/api/ForecastReport/GetBalanceSheet` +
          `?fyCd=${encodeURIComponent(selectedYear)}`;

        const response = await axios.get(apiUrl, {
          signal: controller.signal,
        });

        const rows = normalizeResponse(response.data);

        setApiData(rows);

        if (!rows.length) {
          setError(
            `No balance sheet data was returned for fiscal year ${selectedYear}.`,
          );
        }
      } catch (err) {
        if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError") {
          return;
        }

        console.error("Failed to fetch balance sheet:", err);
        setApiData([]);

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.title ||
            `Unable to load balance sheet data for fiscal year ${selectedYear}.`,
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchBalanceSheet();

    return () => controller.abort();
  }, [selectedYear, refreshKey]);

  // amount = selected year, pyAmount = previous year.
  const metrics = useMemo(() => {
    const assetsRows = apiData.filter(isAssetsRow);
    const liabilitiesRows = apiData.filter(isLiabilitiesRow);
    const equityRows = apiData.filter(isEquityRow);

    const currentAssetsRows = apiData.filter(isCurrentAssetRow);
    const currentLiabilitiesRows = apiData.filter(isCurrentLiabilityRow);

    const totalAssets = sumField(assetsRows, "amount");
    const priorAssets = sumField(assetsRows, "pyAmount");

    const totalLiabilities = sumField(liabilitiesRows, "amount");
    const priorLiabilities = sumField(liabilitiesRows, "pyAmount");

    const totalEquity = sumField(equityRows, "amount");
    const priorEquity = sumField(equityRows, "pyAmount");

    const currentAssets = sumField(currentAssetsRows, "amount");
    const priorCurrentAssets = sumField(currentAssetsRows, "pyAmount");

    const currentLiabilities = sumField(currentLiabilitiesRows, "amount");
    const priorCurrentLiabilities = sumField(
      currentLiabilitiesRows,
      "pyAmount",
    );

    return {
      totalAssets,
      priorAssets,
      totalLiabilities,
      priorLiabilities,
      totalEquity,
      priorEquity,
      workingCapital: currentAssets - currentLiabilities,
      priorWorkingCapital: priorCurrentAssets - priorCurrentLiabilities,
    };
  }, [apiData]);

  const kpis = useMemo(
    () => [
      {
        title: "Total Assets",
        value: metrics.totalAssets,
        previousValue: metrics.priorAssets,
        change: getChangePercent(metrics.totalAssets, metrics.priorAssets),
        icon: Wallet,
        iconColor: COLORS.blue,
        subtitle: `FY ${priorYear} vs. FY ${selectedYear}`,
      },
      {
        title: "Total Liabilities",
        value: metrics.totalLiabilities,
        previousValue: metrics.priorLiabilities,
        change: getChangePercent(
          metrics.totalLiabilities,
          metrics.priorLiabilities,
        ),
        icon: Landmark,
        iconColor: COLORS.red,
        subtitle: `FY ${priorYear} vs. FY ${selectedYear}`,
      },
      {
        title: "Total Equity",
        value: metrics.totalEquity,
        previousValue: metrics.priorEquity,
        change: getChangePercent(metrics.totalEquity, metrics.priorEquity),
        icon: Scale,
        iconColor: COLORS.purple,
        subtitle: `FY ${priorYear} vs. FY ${selectedYear}`,
      },
      {
        title: "Working Capital",
        value: metrics.workingCapital,
        previousValue: metrics.priorWorkingCapital,
        change: getChangePercent(
          metrics.workingCapital,
          metrics.priorWorkingCapital,
        ),
        icon: ArrowLeftRight,
        iconColor: COLORS.teal,
        subtitle: "Current assets − current liabilities",
      },
    ],
    [metrics, priorYear, selectedYear],
  );

  const categoryData = useMemo(() => {
    const grouped = new Map();

    apiData.forEach((row) => {
      const category = String(getTopLevel(row)).trim() || "Other";

      if (!grouped.has(category)) {
        grouped.set(category, {
          category,
          current: 0,
          previous: 0,
        });
      }

      const item = grouped.get(category);
      item.current += getAmount(row, "amount");
      item.previous += getAmount(row, "pyAmount");
    });

    return Array.from(grouped.values())
      .filter((item) => item.current !== 0 || item.previous !== 0)
      .sort(
        (a, b) =>
          Math.max(Math.abs(b.current), Math.abs(b.previous)) -
          Math.max(Math.abs(a.current), Math.abs(a.previous)),
      )
      .slice(0, 10);
  }, [apiData]);

  const comparisonData = useMemo(
    () => [
      {
        name: "Assets",
        [String(priorYear)]: metrics.priorAssets,
        [String(selectedYear)]: metrics.totalAssets,
      },
      {
        name: "Liabilities",
        [String(priorYear)]: metrics.priorLiabilities,
        [String(selectedYear)]: metrics.totalLiabilities,
      },
      {
        name: "Equity",
        [String(priorYear)]: metrics.priorEquity,
        [String(selectedYear)]: metrics.totalEquity,
      },
    ],
    [metrics, priorYear, selectedYear],
  );

  const compositionData = useMemo(
    () =>
      [
        { name: "Assets", value: Math.abs(metrics.totalAssets) },
        { name: "Liabilities", value: Math.abs(metrics.totalLiabilities) },
        { name: "Equity", value: Math.abs(metrics.totalEquity) },
      ].filter((item) => item.value > 0),
    [metrics],
  );

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
  };

  const handleRefresh = () => {
    setRefreshKey((key) => key + 1);
  };

  const renderBarValue = (value) =>
    value === null || value === undefined || !Number.isFinite(Number(value))
      ? ""
      : formatCompact(value, currency);

  return (
    <div className="min-h-full w-full overflow-y-auto bg-slate-50 p-4 text-slate-700 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Landmark size={22} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 md:text-2xl">
              Balance Sheet Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Financial position and year-over-year comparison
            </p>
          </div>
        </div>

        {/* Fiscal year filter */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[150px]">
            <label
              htmlFor="balance-sheet-year"
              className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500"
            >
              <CalendarDays size={14} />
              Fiscal Year
            </label>

            <select
              id="balance-sheet-year"
              value={selectedYear}
              onChange={handleYearChange}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  FY{year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600">
            <span>FY {priorYear}</span>
            <ArrowLeftRight size={14} className="text-slate-400" />
            <span className="text-blue-700">FY {selectedYear}</span>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
          <RefreshCw size={17} className="animate-spin text-blue-700" />
          <p className="text-sm font-medium text-blue-800">
            Loading balance sheet for FY {selectedYear}...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle size={19} className="mt-0.5 shrink-0 text-red-600" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              Unable to display balance sheet
            </p>
            <p className="mt-1 text-xs text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} currency={currency} />
        ))}
      </div>

      {/* Main charts: comparison spans 2 columns, composition spans 1 */}
      <div className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <ChartCard
            title="Balance Sheet Comparison"
            subtitle={`Prior fiscal year ${priorYear} vs. selected fiscal year ${selectedYear}`}
            action={
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                Year over year
              </span>
            }
          >
            <div className="h-[350px] w-full">
              {categoryData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparisonData}
                    margin={{ top: 28, right: 12, left: 8, bottom: 4 }}
                    barGap={8}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke={COLORS.grid}
                    />

                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: COLORS.text }}
                      axisLine={false}
                      tickLine={false}
                      tickMargin={10}
                    />

                    <YAxis
                      tickFormatter={(value) => formatCompact(value, currency)}
                      tick={{ fontSize: 10, fill: COLORS.text }}
                      axisLine={false}
                      tickLine={false}
                      width={82}
                    />

                    <Tooltip content={<CustomTooltip currency={currency} />} />

                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: 11,
                        paddingBottom: 20,
                      }}
                    />

                    <Bar
                      dataKey={String(priorYear)}
                      name={`FY ${priorYear}`}
                      fill="#94A3B8"
                      radius={[5, 5, 0, 0]}
                      maxBarSize={44}
                      isAnimationActive={false}
                    >
                      <LabelList
                        dataKey={String(priorYear)}
                        position="top"
                        formatter={renderBarValue}
                        style={{
                          fill: "#64748B",
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      />
                    </Bar>

                    <Bar
                      dataKey={String(selectedYear)}
                      name={`FY ${selectedYear}`}
                      fill={COLORS.blue}
                      radius={[5, 5, 0, 0]}
                      maxBarSize={44}
                      isAnimationActive={false}
                    >
                      <LabelList
                        dataKey={String(selectedYear)}
                        position="top"
                        formatter={renderBarValue}
                        style={{
                          fill: COLORS.blue,
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  {loading
                    ? "Loading chart..."
                    : "No comparison data available"}
                </div>
              )}
            </div>
          </ChartCard>
        </div>

        <div className="min-w-0">
          <ChartCard
            title={`Balance Sheet Composition — FY ${selectedYear}`}
            subtitle="Relative size of assets, liabilities, and equity"
          >
            <div className="h-[350px] w-full">
              {compositionData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={compositionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      innerRadius={58}
                      outerRadius={92}
                      paddingAngle={3}
                      labelLine
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {compositionData.map((item, index) => (
                        <Cell
                          key={item.name}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip content={<CustomTooltip currency={currency} />} />

                    <Legend
                      verticalAlign="bottom"
                      wrapperStyle={{
                        fontSize: 11,
                        paddingTop: 10,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  {loading
                    ? "Loading chart..."
                    : "No composition data available"}
                </div>
              )}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 pb-2 text-xs text-slate-400">
        <span>Balance Sheet Dashboard</span>
        <span>
          Comparing FY {priorYear} with FY {selectedYear}
        </span>
      </div>
    </div>
  );
}
