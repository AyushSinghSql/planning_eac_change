// "use client";
// import React, { useState, useMemo, useCallback, useEffect } from "react";
// import { backendUrl } from "./config";
// import pptxgen from "pptxgenjs";
// import { jsPDF } from "jspdf";
// import autoTable from "jspdf-autotable";
// import {
//   FaChevronDown,
//   FaChevronRight,
//   FaFileExcel,
//   FaFilePdf,
//   FaFilePowerpoint,
//   FaSync,
// } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import * as XLSXS from "xlsx-js-style";
// import { Download } from "lucide-react";
// import { getCacheAge } from "../utils/cachedDataTime";

// const formatRowForDisplay = (node, selectedYear) => {
//   if (!node) return null;
//   const monthlyAmts = {};

//   const rawTotalsSource =
//     node.monthlyTotals &&
//     Object.keys(node.monthlyTotals).some((k) => k.includes("-"))
//       ? node.monthlyTotals
//       : node.revenueTotals || node.monthlyTotals || {};

//   // Pre-populate all 12 buckets as '-' for the active year context view
//   for (let m = 1; m <= 12; m++) {
//     monthlyAmts[m] = "-";
//   }

//   Object.keys(rawTotalsSource).forEach((key) => {
//     const parts = key.split("-");
//     const yearStr = parts[0];

//     const monthStr = parts[1];

//     // Strict matching: Only pull numerical amounts if it belongs to the active filter year
//     if (yearStr === selectedYear) {
//       const month = parseInt(monthStr, 10);
//       if (!isNaN(month) && month >= 1 && month <= 12) {
//         let rawVal = rawTotalsSource[key];

//         // Check if value is truly meaningful, otherwise let it remain a dash
//         if (
//           rawVal !== undefined &&
//           rawVal !== null &&
//           Math.round((parseFloat(rawVal) + Number.EPSILON) * 100) / 100 !== 0
//         ) {
//           // Flip signs for Contract Revenue nodes and their children (negative to positive, positive to negative)
//           //           const nodeNameLower = (node.name || "").toLowerCase();
//           // const isContractRevenue = nodeNameLower.includes("contract revenue") || node.id?.startsWith("40");
//           // if (isContractRevenue) {
//           //   rawVal = -rawVal;
//           // }

//           if (monthlyAmts[month] === "-") {
//             monthlyAmts[month] = rawVal;
//           } else {
//             monthlyAmts[month] += rawVal;
//           }
//         }
//       }
//     }
//   });

//   return {
//     ...node,
//     acctId: node.id,
//     descp: node.name,
//     monthlyAmts: monthlyAmts,
//     children:
//       node.children && Array.isArray(node.children)
//         ? node.children.map((child) => formatRowForDisplay(child, selectedYear))
//         : [],
//     isFooter: node.type === "summary",
//   };
// };

// const FinancialRow = ({
//   item,
//   depth = 0,
//   formatCurrency,
//   expandedIds,
//   toggleRow,
//   rowIndex,
// }) => {
//   const hasChildren = item.children && item.children.length > 0;

//   const isLevel0 = depth === 0;
//   const isLevel1 = depth === 1;
//   const isSummaryRow = item.type === "summary";

//   // ---------------------------------------------------------
//   // Top-level rows should NOT use their account ID as the
//   // expansion key.
//   //
//   // Child rows continue using their existing ID.
//   // ---------------------------------------------------------
//   const currentId = isLevel0
//     ? `top-level-${rowIndex}`
//     : item.id;

//   const isExpanded = expandedIds.has(currentId);

//   let rowStyle =
//     "border-b border-slate-200 hover:bg-slate-50 transition-colors ";

//   let textStyle = "text-[12px] tracking-tight";
//   let inlineRowStyle = {};

//   if (isSummaryRow) {
//     rowStyle +=
//       " bg-slate-100/90 font-bold border-t-2 border-slate-300 text-slate-900 shadow-sm";

//     textStyle = "text-[12px] font-bold tracking-tight";
//   } else if (isLevel0) {
//     rowStyle += "bg-slate-50 font-semibold text-slate-900";
//     textStyle = "text-[12px] tracking-tight";
//   } else if (isLevel1) {
//     rowStyle += "bg-white text-slate-900 font-medium";
//     textStyle = "text-[11px]";
//   } else {
//     rowStyle += "bg-white text-slate-700";
//     textStyle = "text-[11px]";
//   }

//   let displayDescp = (
//     item?.name ||
//     item?.acctName ||
//     item?.fsLnDesc ||
//     ""
//   )
//     .replace("OI - ", "")
//     .replace("NIBT - ", "")
//     .replace("NI - ", "")
//     .replace("GM - ", "")
//     .replace(/Total$/i, "")
//     .trim();

//   const ytdTotal = Object.values(item.monthlyAmts || {}).reduce(
//     (acc, currentVal) =>
//       acc + (currentVal === "-" ? 0 : Number(currentVal) || 0),
//     0
//   );

//   return (
//     <>
//       <tr className={rowStyle} style={inlineRowStyle}>
//         <td
//           className={`py-2 px-4 flex items-center sticky left-0 z-30 border-r border-slate-200 bg-inherit ${
//             item.type === "summary" ? "bg-slate-100" : ""
//           }`}
//           style={{
//             paddingLeft: isSummaryRow
//               ? "16px"
//               : `${depth * 20 + 16}px`,
//             minWidth: "240px",
//             maxWidth: "240px",
//           }}
//         >
//           {/* -------------------------------------------------
//               Expand button

//               Top-level:
//                 uses generated row key, NOT item.id

//               Child:
//                 continues using item.id
//              ------------------------------------------------- */}
//           {hasChildren && toggleRow && !isSummaryRow ? (
//             <button
//               onClick={() => toggleRow(currentId)}
//               className="mr-2 text-slate-400 cursor-pointer flex items-center justify-center focus:outline-none"
//             >
//               <div
//                 className={`transition-transform duration-150 ${
//                   isExpanded ? "" : "-rotate-90"
//                 }`}
//               >
//                 <FaChevronDown size={10} />
//               </div>
//             </button>
//           ) : (
//             <span className="w-4 mr-2" />
//           )}

//           <div className="flex flex-col truncate">

//             {/* -------------------------------------------------
//                 ONLY CHILD ROWS SHOW THEIR ACCOUNT ID.
//                 Top-level rows do NOT show ID.
//                ------------------------------------------------- */}
//             {!isSummaryRow && !isLevel0 && (
//               <span className="text-[9px] text-slate-500 font-mono tracking-normal">
//                 {item.id}
//               </span>
//             )}

//             <span className={`truncate capitalize ${textStyle}`}>
//               {displayDescp}
//             </span>
//           </div>
//         </td>

//         {[...Array(12)].map((_, i) => {
//           const pd = i + 1;
//           const val = item.monthlyAmts?.[pd] ?? "-";

//           return (
//             <td
//               key={pd}
//               className={`text-right px-4 tabular-nums border-r border-slate-200/60 w-28 py-2 bg-inherit ${textStyle} ${
//                 val < 0 ? "text-red-600" : ""
//               }`}
//             >
//               {formatCurrency(val)}
//             </td>
//           );
//         })}

//         <td
//           className={`text-right px-6 tabular-nums border-l-2 border-b border-slate-200 bg-slate-50/50 font-bold w-32 ${textStyle} ${
//             ytdTotal < 0 ? "text-red-600" : ""
//           }`}
//         >
//           {ytdTotal === 0 &&
//           Object.values(item.monthlyAmts || {}).every(
//             (v) => v === "-"
//           )
//             ? "-"
//             : formatCurrency(ytdTotal)}
//         </td>
//       </tr>

//       {/* -------------------------------------------------------
//           Children
//           ------------------------------------------------------- */}
//       {isExpanded &&
//         hasChildren &&
//         !isSummaryRow &&
//         item.children.map((child, index) => (
//           <FinancialRow
//             key={child.id || `${currentId}-child-${index}`}
//             item={child}
//             depth={depth + 1}
//             rowIndex={index}
//             formatCurrency={formatCurrency}
//             expandedIds={expandedIds}
//             toggleRow={toggleRow}
//           />
//         ))}
//     </>
//   );
// };

// const IS_Report = () => {
//   const [rawData, setRawData] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState(10);

//   const [cachedAge, setCachedAge] = useState("");

//   const [selectedYear, setSelectedYear] = useState("2026");
//   const [availableYears, setAvailableYears] = useState([
//     "2026",
//     "2025",
//     "2024",
//     "2023",
//   ]);
//   const [loading, setLoading] = useState(false);
//   const [hasRun, setHasRun] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState([]);
//   const [expandedIds, setExpandedIds] = useState(new Set());

//   const expandToLevel = (level) => {
//   const newExpanded = new Set();

//   const addByLevel = (nodes, currentDepth) => {
//     if (!nodes || !Array.isArray(nodes)) return;

//     nodes.forEach((node, index) => {
//       if (currentDepth < level && node.children?.length > 0) {
//         const rowKey =
//           currentDepth === 0
//             ? `top-level-${index}`
//             : node.id;

//         if (rowKey) {
//           newExpanded.add(rowKey);
//         }

//         addByLevel(node.children, currentDepth + 1);
//       }
//     });
//   };

//   addByLevel(data, 0);
//   setExpandedIds(newExpanded);
// };

//   const toggleRow = (id) => {
//     setExpandedIds((prev) => {
//       const next = new Set(prev);

//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   };

//   const mergeEntriesByName = (data) => {
//     const mergedMap = new Map();

//     data.forEach((item) => {
//       if (mergedMap.has(item.name)) {
//         const existing = mergedMap.get(item.name);
//         existing.children.push(...item.children);

//         Object.keys(item.monthlyTotals || {}).forEach((key) => {
//           existing.monthlyTotals[key] =
//             (existing.monthlyTotals[key] || 0) + (item.monthlyTotals[key] || 0);
//         });

//         Object.keys(item.revenueTotals || {}).forEach((key) => {
//           existing.revenueTotals[key] =
//             (existing.revenueTotals[key] || 0) + (item.revenueTotals[key] || 0);
//         });
//       } else {
//         mergedMap.set(item.name, {
//           ...item,
//           children: [...item.children],
//           monthlyTotals: { ...item.monthlyTotals },
//           revenueTotals: { ...item.revenueTotals },
//         });
//       }
//     });

//     return Array.from(mergedMap.values());
//   };

//   const monthMap = {
//     "01": "Jan",
//     "02": "Feb",
//     "03": "Mar",
//     "04": "Apr",
//     "05": "May",
//     "06": "Jun",
//     "07": "Jul",
//     "08": "Aug",
//     "09": "Sep",
//     10: "Oct",
//     11: "Nov",
//     12: "Dec",
//   };

//   const columns = useMemo(() => {
//     const monthLabels = [
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
//     ];
//     return monthLabels.map((month) => ({ year: selectedYear, month }));
//   }, [selectedYear]);

//   const labelToNum = Object.fromEntries(
//     Object.entries(monthMap).map(([num, label]) => [label, num]),
//   );

//   const transformToIncomeStatementFormat = (rawPayload, targetYear) => {
//     try {
//       const result = mergeEntriesByName(rawPayload);
//       const sortOrder = [
//         "Contracts Revenue",
//         "Direct Labor",
//         "Direct Travel",
//         "Direct Materials",
//         "Subcontracts",
//         "Other Direct Costs",
//         "Gross Profit / (Loss)",
//         "Fringe Benefits",
//         "Overhead",
//         "Cost of Goods Sold",
//         "General & Administrative",
//         "Subcontract & Matl Handling",
//         "Misc Income/(Expenses)",
//         "Interest Expense",
//         "B&P",
//         "Business Development",
//         "Other Unallowable Expense",
//         "Allocations",
//         "Income Taxes",
//         "Net Profit / (Loss)",
//       ];

//       const getTotals = (item) => {
//         return item.monthlyTotals || {};
//       };

//       const mapNodes = (nodes) => {
//         if (!nodes) return [];
//         const nodesArray = Array.isArray(nodes) ? nodes : Object.values(nodes);
//         return nodesArray
//           .map((item) => ({
//             id: (item.id || item.code || "").toString().trim(),
//             name: (item.name || item.description || "").toString().trim(),
//             type: item.type,
//             monthlyTotals: getTotals(item) || {},
//             revenueTotals: item.revenueTotals || {},
//             children: mapNodes(item.children),
//           }))
//           .sort((a, b) =>
//             a.id.localeCompare(b.id, undefined, {
//               numeric: true,
//               sensitivity: "base",
//             }),
//           );
//       };

//       const dataToMap = Array.isArray(result) ? result : Object.values(result);

//       let allMappedNodes = dataToMap.map((item) => ({
//         id: item.id || item.code,
//         name: (item.name || item.description || "").trim(),
//         type: item.type,
//         monthlyTotals: structuredClone(getTotals(item) || {}),
//         revenueTotals: structuredClone(item.revenueTotals || {}),
//         children: mapNodes(item.children),
//       }));

//       const invertNodeValues = (node) => {
//         if (node.monthlyTotals) {
//           Object.keys(node.monthlyTotals).forEach((k) => {
//             const val = node.monthlyTotals[k];
//             if (val !== "-" && val !== undefined && val !== null) {
//               node.monthlyTotals[k] = -parseFloat(val);
//             }
//           });
//         }
//         if (node.children && Array.isArray(node.children)) {
//           node.children.forEach(invertNodeValues);
//         }
//       };

//       // Find Contracts Revenue, set its ID to "40", and invert values for it and all its descendants
//       allMappedNodes.forEach((n) => {
//         const nameLower = (n.name || "").toLowerCase();
//         const idStr = (n.id || "").toString();
//         if (
//           nameLower.includes("contract revenue") ||
//           idStr === "40" ||
//           idStr.startsWith("40")
//         ) {
//           n.id = "40";
//           invertNodeValues(n);
//         }
//       });
//       let nonOperatingNode = allMappedNodes.find((n) => n.id === "95");
//       let otherIncomeNode = null;

//       if (nonOperatingNode && nonOperatingNode.children) {
//         const oiIndex = nonOperatingNode.children.findIndex(
//           (child) =>
//             child.id === "95.01.03" ||
//             child.name.toLowerCase().includes("other income"),
//         );
//         if (oiIndex !== -1) {
//           otherIncomeNode = nonOperatingNode.children[oiIndex];
//           otherIncomeNode.name = "Other Income";
//           otherIncomeNode.children = [];
//           nonOperatingNode.children.splice(oiIndex, 1);
//         }
//       }

//       if (otherIncomeNode) {
//         allMappedNodes.push(otherIncomeNode);
//       }

//       let unallowableNode = allMappedNodes.find((n) => n.id === "90");
//       const nodeToMoveIndex = allMappedNodes.findIndex(
//         (n) => n.id === "50.32.02",
//       );

//       if (unallowableNode && nodeToMoveIndex !== -1) {
//         const nodeToMove = allMappedNodes[nodeToMoveIndex];
//         if (!unallowableNode.children) unallowableNode.children = [];
//         if (nodeToMove.children && nodeToMove.children.length > 0) {
//           unallowableNode.children.push(...nodeToMove.children);
//         } else {
//           unallowableNode.children.push(nodeToMove);
//         }
//         allMappedNodes.splice(nodeToMoveIndex, 1);
//       }

//       const directLaborNode = allMappedNodes.find((n) =>
//         n.name.includes("Direct Labor"),
//       );
//       const directNonLaborNode = allMappedNodes.find((n) =>
//         n.name.includes("Direct Non Labor"),
//       );

//       const profitNode = {
//         id: "PL-Summary",
//         name: "Gross Profit / (Loss)",
//         type: "summary",
//         monthlyTotals: {},
//         children: [],
//       };
//       const totalOperatingExpensesNode = {
//         id: "OPEX-TOTAL",
//         name: "Total Operating Expenses",
//         type: "summary",
//         monthlyTotals: {},
//         children: [],
//       };
//       const netProfitNode = {
//         id: "Net PL-Summary",
//         name: "Net Profit / (Loss)",
//         type: "summary",
//         monthlyTotals: {},
//         children: [],
//       };

//       const indirectNames = [
//         "Fringe Benefits",
//         "Overhead",
//         "Cost of Goods Sold",
//         "General & Administrative",
//         "Subcontract & Matl Handling",
//         "Misc Income/(Expenses)",
//         "Interest Expense",
//         "B&P",
//         "Business Development",
//         "Other Unallowable Expense",
//         "Allocations",
//         "Income Taxes",
//       ];

//       const directNames = [
//         "Direct Labor",
//         "Direct Travel",
//         "Direct Materials",
//         "Subcontracts",
//         "Other Direct Costs",
//       ];

//       const indirectNodes = allMappedNodes.filter((n) => {
//         if (!n.name) return false;
//         const nodeNameLower = n.name.toLowerCase().trim();
//         return indirectNames.some((indirectName) =>
//           nodeNameLower.includes(indirectName.toLowerCase().trim()),
//         );
//       });

//       const directNodes = allMappedNodes.filter((n) => {
//         if (!n?.name) return false;
//         const nodeNameLower = n.name.toLowerCase().trim();
//         return directNames.some((name) =>
//           nodeNameLower.includes(name.toLowerCase().trim()),
//         );
//       });

//       const getImmutableVal = (node, key) => {
//         if (!node) return 0;
//         const sourceTotals = node.monthlyTotals || {};
//         let val = sourceTotals[key];
//         if (val === undefined || val === null || val === "-") return 0;
//         let parsed = parseFloat(val);

//         // Remove the secondary sign-flip here since invertNodeValues already handled it
//         return Math.round((parsed + Number.EPSILON) * 100) / 100;
//       };

//       const getArraySum = (node, key) => {
//         if (!Array.isArray(node)) return 0;
//         return node.reduce((sum, n) => sum + getImmutableVal(n, key), 0);
//       };

//       columns.forEach((col) => {
//         const monthNum = labelToNum[col.month];
//         const combinedKey = `${col.year}-${monthNum}`;

//         if (nonOperatingNode) {
//           const remainingChildTotal = (nonOperatingNode.children || []).reduce(
//             (sum, child) => sum + getImmutableVal(child, combinedKey),
//             0,
//           );
//           nonOperatingNode.monthlyTotals[combinedKey] =
//             Math.round((remainingChildTotal + Number.EPSILON) * 100) / 100;
//         }

//         if (unallowableNode) {
//           const childTotal = (unallowableNode.children || []).reduce(
//             (sum, child) => sum + getImmutableVal(child, combinedKey),
//             0,
//           );
//           unallowableNode.monthlyTotals[combinedKey] =
//             Math.round((childTotal + Number.EPSILON) * 100) / 100;
//         }

//         // Find all contract revenue nodes to aggregate total revenue for profit calculations
//         // Find all contract revenue nodes to aggregate total revenue for profit calculations using the 40 series
//         const revNodes = allMappedNodes.filter((n) => {
//           const nLower = (n.name || "").toLowerCase();
//           const idStr = (n.id || "").toString();
//           return (
//             nLower.includes("contract revenue") ||
//             idStr === "40" ||
//             idStr.startsWith("40")
//           );
//         });

//         let totalRevVal = revNodes.reduce(
//           (sum, rNode) => sum + getImmutableVal(rNode, combinedKey),
//           0,
//         );

//         const nonLaborVal = getImmutableVal(directNonLaborNode, combinedKey);
//         // const laborVal = getImmutableVal(directLaborNode, combinedKey);
//         const laborVal = getArraySum(directNodes, combinedKey);

//         const grossProfit =
//           Math.round(
//             (totalRevVal - (laborVal + nonLaborVal) + Number.EPSILON) * 100,
//           ) / 100;
//         profitNode.monthlyTotals[combinedKey] = grossProfit;

//         const totalIndirect = indirectNodes.reduce(
//           (sum, node) => sum + getImmutableVal(node, combinedKey),
//           0,
//         );
//         totalOperatingExpensesNode.monthlyTotals[combinedKey] =
//           Math.round((totalIndirect + Number.EPSILON) * 100) / 100;

//         netProfitNode.monthlyTotals[combinedKey] =
//           Math.round((grossProfit - totalIndirect + Number.EPSILON) * 100) /
//           100;
//       });

//       const combinedList = [
//         ...allMappedNodes,
//         profitNode,
//         totalOperatingExpensesNode,
//         netProfitNode,
//       ];

//       const getSortIndex = (nodeName) => {
//         if (!nodeName) return -1;
//         const cleanName = nodeName.toString().trim().toLowerCase();
//         return sortOrder.findIndex((orderName) => {
//           const cleanOrderName = orderName.trim().toLowerCase();
//           if (cleanOrderName === "contracts revenue")
//             return (
//               cleanName.includes("contracts revenue") ||
//               cleanName.includes("contract revenue")
//             );
//           if (cleanOrderName === "total operating expenses")
//             return (
//               cleanName === "total operating expenses" ||
//               cleanName.includes("opex-total")
//             );
//           if (cleanOrderName === "gross profit / (loss)")
//             return cleanName.includes("gross profit");
//           if (cleanOrderName === "net profit / (loss)")
//             return cleanName.includes("net profit");
//           return cleanName.includes(cleanOrderName);
//         });
//       };

//       const finalDataList = combinedList.filter(
//         (node) => getSortIndex(node.name) !== -1,
//       );
//       finalDataList.sort((a, b) => getSortIndex(a.name) - getSortIndex(b.name));

//       return finalDataList;
//     } catch (error) {
//       console.error("Error transforming forecast data structure:", error);
//       return [];
//     }
//   };

//   const handleRunReport = async (byPassCache = false) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(
//         `${backendUrl}/Forecast/GetSummaryV4?byPassCache=${byPassCache}`,
//       );
//       if (!response.ok) throw new Error("Failed to fetch forecast summary");

//       const parsedJson = await response.json();
//       const summaryDataAge = getCacheAge(parsedJson.createdAt);

//       setCachedAge(summaryDataAge);

//       setRawData(parsedJson.data);

//       const processedList = transformToIncomeStatementFormat(
//         parsedJson.data,
//         selectedYear,
//       );
//       setData(processedList);
//       setHasRun(true);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (rawData.length > 0) {
//       const filtered = transformToIncomeStatementFormat(rawData, selectedYear);
//       setData(filtered);
//     } else {
//       handleRunReport();
//     }
//   }, [selectedYear]);

//   const formatCurrency = (val) => {
//     if (
//       val === undefined ||
//       val === null ||
//       val === "-" ||
//       Math.round((parseFloat(val) + Number.EPSILON) * 100) / 100 === 0
//     ) {
//       return "-";
//     }
//     const formatted = new Intl.NumberFormat("en-US", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     }).format(Math.abs(val));
//     return val < 0 ? `-${formatted}` : formatted;
//   };

//   const exportToExcel = () => {
//     if (!data || data.length === 0) return;

//     const wb = XLSX.utils.book_new();
//     const rows = [];

//     rows.push([import.meta.env.VITE_CLIENT_NAME || "Client Name"]);
//     rows.push(["Income Statement"]);
//     rows.push([`Fiscal Year: ${selectedYear}`]);
//     rows.push([]);

//     const headerRow = ["Account - Description"];
//     columns.forEach((col) => {
//       headerRow.push(`${col.year}-${labelToNum[col.month]}`);
//     });
//     headerRow.push("Total YTD");
//     rows.push(headerRow);

//     const appendExcelRows = (nodes, depth = 0) => {
//       nodes.forEach((node) => {
//         const displayNode = formatRowForDisplay(node, selectedYear);
//         let displayDescp = (displayNode?.name || displayNode?.acctName || "")
//           .replace("OI - ", "")
//           .replace("NIBT - ", "")
//           .replace("NI - ", "")
//           .replace("GM - ", "")
//           .replace(/Total$/i, "")
//           .trim();

//         const indentLabel =
//           displayNode.type === "summary"
//             ? displayDescp
//             : " ".repeat(depth * 4) + displayDescp;
//         const fileRow = [indentLabel];

//         let ytdTotal = 0;
//         [...Array(12)].map((_, i) => {
//           const pd = i + 1;
//           const val = displayNode.monthlyAmts?.[pd] || 0;
//           fileRow.push(val === "-" ? 0 : val);
//           ytdTotal += val === "-" ? 0 : val;
//         });

//         fileRow.push(ytdTotal);
//         rows.push(fileRow);

//         const isExpanded = expandedIds.has(node.id);
//         if (
//           isExpanded &&
//           node.children &&
//           node.children.length > 0 &&
//           node.type !== "summary"
//         ) {
//           appendExcelRows(node.children, depth + 1);
//         }
//       });
//     };

//     appendExcelRows(data, 0);

//     const ws = XLSX.utils.aoa_to_sheet(rows);

//     const styles = {
//       title: {
//         font: { name: "Arial", size: 14, bold: true },
//         alignment: { horizontal: "left" },
//       },
//       subtitle: { font: { name: "Arial", size: 11, italic: true } },
//       header: {
//         font: {
//           name: "Arial",
//           size: 10,
//           bold: true,
//           color: { rgb: "FFFFFF" },
//         },
//         fill: { fgColor: { rgb: "1E3A8A" } },
//         alignment: { horizontal: "center" },
//       },
//       summary: {
//         font: { name: "Arial", size: 10, bold: true },
//         fill: { fgColor: { rgb: "E2E8F0" } },
//         border: {
//           top: { style: "thin", color: { rgb: "94A3B8" } },
//           bottom: { style: "double", color: { rgb: "000000" } },
//         },
//       },
//       level0: {
//         font: { name: "Arial", size: 10, bold: true },
//         fill: { fgColor: { rgb: "F8FAFC" } },
//       },
//       level1: { font: { name: "Arial", size: 9, bold: false } },
//       currency: { numFmt: '$#,##0.00;($#,##0.00);"-"' },
//     };

//     Object.keys(ws).forEach((cell) => {
//       if (cell[0] === "!") return;
//       const parsedCell = XLSX.utils.decode_cell(cell);
//       const rowIdx = parsedCell.r;
//       const colIdx = parsedCell.c;

//       if (rowIdx === 0) ws[cell].s = styles.title;
//       else if (rowIdx === 1 || rowIdx === 2) ws[cell].s = styles.subtitle;
//       else if (rowIdx === 4) {
//         ws[cell].s = styles.header;
//       } else if (rowIdx > 4) {
//         const dataOffsetRow = rowIdx - 5;
//         let counter = 0;
//         let targetNode = null;

//         const findNodeByExcelIndex = (nodes, targetIndex) => {
//           for (let n of nodes) {
//             if (counter === targetIndex) {
//               targetNode = n;
//               return true;
//             }
//             counter++;
//             const isExpanded = expandedIds.has(n.id);
//             if (
//               isExpanded &&
//               n.children &&
//               n.children.length > 0 &&
//               n.type !== "summary"
//             ) {
//               if (findNodeByExcelIndex(n.children, targetIndex)) return true;
//             }
//           }
//           return false;
//         };

//         findNodeByExcelIndex(data, dataOffsetRow);

//         let cellStyle = {};
//         if (targetNode?.type === "summary") {
//           cellStyle = { ...styles.summary };
//         } else if (targetNode?.id?.split(".").length === 1) {
//           cellStyle = { ...styles.level0 };
//         } else {
//           cellStyle = { ...styles.level1 };
//         }

//         if (colIdx > 0) {
//           cellStyle.numFmt = styles.currency.numFmt;
//           cellStyle.alignment = { horizontal: "right" };
//         } else {
//           cellStyle.alignment = { horizontal: "left" };
//         }

//         ws[cell].s = cellStyle;
//       }
//     });

//     ws["!cols"] = [
//       { wch: 32 },
//       ...[...Array(12)].map(() => ({ wch: 14 })),
//       { wch: 16 },
//     ];

//     XLSX.utils.book_append_sheet(wb, ws, "Income Statement");
//     XLSXS.writeFile(
//       wb,
//       `${import.meta.env.VITE_CLIENT_NAME || "Client"}_Income_Statement_FY${selectedYear}.xlsx`,
//     );
//   };

//   const exportToPDF = () => {
//     if (!data || data.length === 0) return;

//     const doc = new jsPDF({
//       orientation: "landscape",
//       unit: "mm",
//       format: "a4",
//     });

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(20);
//     doc.text(import.meta.env.VITE_CLIENT_NAME || "Client Name", 14, 15);

//     doc.setFontSize(14);
//     doc.setFont("helvetica", "normal");
//     doc.text("Income Statement", 14, 22);
//     doc.setFontSize(10);
//     doc.text(`Fiscal Year: ${selectedYear}`, 14, 28);

//     const tableHeaders = ["Account - Description"];
//     columns.forEach((col) => {
//       tableHeaders.push(`${col.year}-${labelToNum[col.month]}`);
//     });
//     tableHeaders.push("Total YTD");

//     const tableRows = [];
//     const rowMetaData = [];

//     const buildPdfRowsList = (nodes, depth = 0) => {
//       nodes.forEach((node) => {
//         const displayNode = formatRowForDisplay(node, selectedYear);
//         let displayDescp = (displayNode?.name || displayNode?.acctName || "")
//           .replace("OI - ", "")
//           .replace("NIBT - ", "")
//           .replace("NI - ", "")
//           .replace("GM - ", "")
//           .replace(/Total$/i, "")
//           .trim();

//         const indentLabel =
//           displayNode.type === "summary"
//             ? displayDescp
//             : " ".repeat(depth * 3) + displayDescp;
//         const pdfRow = [indentLabel];

//         let ytdTotal = 0;
//         [...Array(12)].map((_, i) => {
//           const pd = i + 1;
//           const val = displayNode.monthlyAmts?.[pd] || 0;
//           pdfRow.push(formatCurrency(val));
//           ytdTotal += val === "-" ? 0 : val;
//         });

//         pdfRow.push(formatCurrency(ytdTotal));
//         tableRows.push(pdfRow);
//         rowMetaData.push({ depth, type: displayNode.type });

//         const isExpanded = expandedIds.has(node.id);
//         if (
//           isExpanded &&
//           node.children &&
//           node.children.length > 0 &&
//           node.type !== "summary"
//         ) {
//           buildPdfRowsList(node.children, depth + 1);
//         }
//       });
//     };

//     buildPdfRowsList(data, 0);

//     const pageWidth = doc.internal.pageSize.getWidth();
//     const marginLeft = 14;
//     const marginRight = 14;

//     const availableWidth = pageWidth - marginLeft - marginRight;

//     // Keep description and total slightly wider
//     const accountWidth = 44;
//     const totalYtdWidth = 16;

//     // Remaining width divided equally across 12 months
//     const monthWidth = (availableWidth - accountWidth - totalYtdWidth) / 12;

//     autoTable(doc, {
//       startY: 34,

//       head: [tableHeaders],
//       body: tableRows,

//       theme: "plain",

//       margin: {
//         left: marginLeft,
//         right: marginRight,
//       },

//       tableWidth: availableWidth,

//       styles: {
//         font: "helvetica",
//         fontSize: 6.5,
//         cellPadding: 1.1,
//         overflow: "hidden",
//         valign: "middle",
//         lineWidth: 0,
//       },

//       headStyles: {
//         fillColor: [30, 58, 138],
//         textColor: [255, 255, 255],
//         fontStyle: "bold",
//         fontSize: 6.5,
//         halign: "center",
//         valign: "middle",
//       },

//       columnStyles: {
//         // Account - Description
//         0: {
//           cellWidth: accountWidth,
//           halign: "left",
//           fontSize: 6.5,
//         },

//         // 12 months
//         ...Object.fromEntries(
//           [...Array(12)].map((_, i) => [
//             i + 1,
//             {
//               cellWidth: monthWidth,
//               halign: "right",
//               fontSize: 6.5,
//               overflow: "hidden",
//             },
//           ]),
//         ),

//         // Total YTD
//         13: {
//           cellWidth: totalYtdWidth,
//           halign: "right",
//           fontStyle: "bold",
//           fontSize: 6.5,
//           overflow: "hidden",
//         },
//       },

//       didParseCell: (dataCell) => {
//         if (dataCell.section === "body") {
//           const meta = rowMetaData[dataCell.row.index];

//           if (meta) {
//             if (meta.type === "summary") {
//               dataCell.cell.styles.fontStyle = "bold";
//               dataCell.cell.styles.fillColor = [226, 232, 240];
//             } else if (meta.depth === 0) {
//               dataCell.cell.styles.fontStyle = "bold";
//               dataCell.cell.styles.fillColor = [248, 250, 252];
//             }
//           }
//         }
//       },
//     });

//     doc.save(
//       `${import.meta.env.VITE_CLIENT_NAME || "Client"}_Income_Statement_FY${selectedYear}.pdf`,
//     );
//   };

//   return (
//     <div className="w-full overflow-hidden p-2 space-y-6 min-h-screen text-slate-800">
//       <style jsx global>{`
//         @media print {
//           body * {
//             visibility: hidden !important;
//           }
//           #report-print-area,
//           #report-print-area * {
//             visibility: visible !important;
//           }
//           #report-print-area {
//             position: absolute !important;
//             left: 0 !important;
//             top: 0 !important;
//             width: 100% !important;
//             margin: 0 !important;
//             padding: 10px !important;
//             box-shadow: none !important;
//             border: none !important;
//           }
//           .no-print {
//             display: none !important;
//           }
//         }
//         .tabular-nums {
//           font-variant-numeric: tabular-nums;
//         }
//         .btn-action {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 0.75rem 1rem;
//           border-radius: 0.75rem;
//           font-weight: 500;
//           font-size: 0.75rem;
//           transition: all 0.2s;
//         }
//       `}</style>

//       {/* Control Bar */}
//       <div className="mx-auto mb-8 flex justify-between items-center no-print bg-white p-2 rounded-lg border">
//         {/* <div className="flex flex-row items-end gap-8 px-2">
//           <div className="flex flex-col">
//             <div className="flex items-center gap-2">
//             <span className="text-[14px] font-semibold mb-1">Fiscal Year</span>
//             <select
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(e.target.value)}
//               className="w-full p-4 bg-slate-100 border-none rounded-lg text-[14px] font-semibold cursor-pointer border border-gray-200 outline-none"
//               >
//               {availableYears.map((year) => (
//                 <option key={year} value={year}>
//                   FY {year}
//                 </option>
//               ))}
//             </select>
//               </div>

//                         {cachedAge && (
//   <span className="text-[11px] text-slate-400 font-medium self-center">
//     Last Refreshed: {cachedAge}
//   </span>
// )}
//           </div>
//         </div> */}

//         <div className="flex flex-col ">
//           <div className="flex items-center gap-1.5">
//             <label className="text-[14px] font-semibold whitespace-nowrap">
//               Fiscal Year
//             </label>
//             <select
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(e.target.value)}
//               className="w-full p-2 bg-slate-100 rounded-lg text-[14px] font-semibold cursor-pointer border border-gray-200 outline-none"
//             >
//               {availableYears.map((year) => (
//                 <option key={year} value={year}>
//                   FY {year}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {cachedAge && (
//             <span className="text-xs text-slate-400 font-medium pt-1">
//               Last Refreshed: {cachedAge}
//             </span>
//           )}
//         </div>

//         <div className="flex flex-row items-center gap-4 self-end">
//           <button
//             onClick={exportToExcel}
//             className="btn-action bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
//           >
//             <FaFileExcel size={14} /> Export Excel
//           </button>

//           <button
//             onClick={exportToPDF}
//             className="btn-action bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
//           >
//             <FaFilePdf size={14} /> Export PDF
//           </button>

//           <button
//             onClick={() => handleRunReport(true)}
//             className="btn-action bg-blue-600 text-white hover:bg-blue-700"
//           >
//             <FaSync className={loading ? "animate-spin" : ""} /> Refresh
//           </button>

//           {expandedIds.size === 0 ? (
//             <button
//               onClick={() => expandToLevel(1)}
//               className="px-4 py-2 bg-blue-600 text-white text-[13px] font-bold rounded-lg hover:bg-blue-700 transition-all active:scale-95 whitespace-nowrap shadow-sm"
//             >
//               Expand All
//             </button>
//           ) : (
//             <button
//               onClick={() => expandToLevel(0)}
//               className="px-4 py-2 bg-gray-100 text-gray-600 text-[13px] font-bold rounded-lg hover:bg-gray-200 transition-all active:scale-95 whitespace-nowrap"
//             >
//               Collapse All
//             </button>
//           )}

//           <div className="flex items-center gap-2 min-w-[200px]">
//             <span className="text-[14px] font-semibold whitespace-nowrap">
//               View Level:
//             </span>
//             <select
//               className="w-full p-2 bg-slate-100 rounded-lg text-[14px] font-semibold cursor-pointer border border-gray-200 outline-none"
//               onChange={(e) => expandToLevel(parseInt(e.target.value))}
//             >
//               <option value="0">Top Level</option>
//               <option value="1">FS Level</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       <div
//         id="report-print-area"
//         className="mx-auto bg-white rounded-lg md:p-3 border min-h-[90vh]"
//       >
//         <div
//           id="report-print-area"
//           className="mx-auto bg-white rounded-lg min-h-[90vh]"
//         >
//           <header className="text-center mb-1">
//             <div>
//               <h1 className="text-[26px] font-bold tracking-tight text-slate-800">
//                 {import.meta.env.VITE_CLIENT_NAME}
//               </h1>
//               <div className="w-24 h-1 bg-blue-600 mx-auto mb-1"></div>
//             </div>
//             <div className="inline-block px-8 py-2 mt-1 rounded-lg border border-blue-200">
//               <h2 className="text-[16px] font-bold text-slate-900">
//                 Income Statement
//               </h2>
//             </div>
//           </header>

//           <div className="w-full border border-slate-200 rounded-lg overflow-hidden flex flex-col bg-white">
//             <div className="overflow-auto max-h-[80vh] min-h-[350px] custom-scrollbar">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr className="sticky top-0 z-50 text-[12px] border-b-2 border-slate-200 bg-slate-100 tracking-wider text-slate-700 shadow-sm">
//                     <th className="py-1 px-2 text-left bg-slate-100 sticky left-0 z-60">
//                       Account - Description
//                     </th>
//                     {[...Array(12)].map((_, i) => (
//                       <th
//                         key={i + 1}
//                         className="py-1 px-2 text-right w-28 border-l border-slate-200 bg-slate-50 font-semibold"
//                       >
//                         {selectedYear}-{(i + 1).toString().padStart(2, "0")}
//                       </th>
//                     ))}
//                     <th className="py-1 px-2 text-right w-32 border-l-2 border-slate-300 bg-slate-200 font-bold">
//                       Total YTD
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {loading ? (
//                     <tr>
//                       <td colSpan={14} className="py-20">
//                         <div className="flex flex-col items-center justify-center space-y-3">
//                           <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
//                           <p className="text-slate-500 font-medium animate-pulse">
//                             Generating Report...
//                           </p>
//                         </div>
//                       </td>
//                     </tr>
//                   ) : (
//                    data.map((node, index) => {
//   const formattedNode = formatRowForDisplay(
//     node,
//     selectedYear
//   );

//   return (
//     <FinancialRow
//       key={formattedNode.id || `top-level-${index}`}
//       depth={0}
//       rowIndex={index}
//       item={formattedNode}
//       formatCurrency={formatCurrency}
//       expandedIds={expandedIds}
//       toggleRow={toggleRow}
//     />
//   );
// })
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IS_Report;

"use client";

import React, { useState, useMemo, useEffect } from "react";

import { backendUrl } from "./config";

import pptxgen from "pptxgenjs";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import {
  FaChevronDown,
  FaChevronRight,
  FaFileExcel,
  FaFilePdf,
  FaFilePowerpoint,
  FaSync,
} from "react-icons/fa";

import * as XLSX from "xlsx";
import * as XLSXS from "xlsx-js-style";

import { Download } from "lucide-react";

import { getCacheAge } from "../utils/cachedDataTime";

/* ============================================================
   FORMAT ROW FOR DISPLAY
   ============================================================ */

const formatRowForDisplay = (node, selectedYear) => {
  if (!node) return null;

  const monthlyAmts = {};

  const rawTotalsSource =
    node.monthlyTotals &&
    Object.keys(node.monthlyTotals).some((k) => k.includes("-"))
      ? node.monthlyTotals
      : node.revenueTotals || node.monthlyTotals || {};

  // Pre-populate all 12 buckets
  for (let m = 1; m <= 12; m++) {
    monthlyAmts[m] = "-";
  }

  Object.keys(rawTotalsSource).forEach((key) => {
    const parts = key.split("-");
    const yearStr = parts[0];
    const monthStr = parts[1];

    // Only use selected fiscal year
    if (yearStr === selectedYear) {
      const month = parseInt(monthStr, 10);

      if (!isNaN(month) && month >= 1 && month <= 12) {
        let rawVal = rawTotalsSource[key];

        if (
          rawVal !== undefined &&
          rawVal !== null &&
          Math.round((parseFloat(rawVal) + Number.EPSILON) * 100) / 100 !== 0
        ) {
          /*
              Contract Revenue sign inversion
              is already handled in
              transformToIncomeStatementFormat.
            */

          if (monthlyAmts[month] === "-") {
            monthlyAmts[month] = rawVal;
          } else {
            monthlyAmts[month] += rawVal;
          }
        }
      }
    }
  });

  return {
    ...node,

    acctId: node.id,

    descp: node.name,

    monthlyAmts,

    children:
      node.children && Array.isArray(node.children)
        ? node.children.map((child) => formatRowForDisplay(child, selectedYear))
        : [],

    isFooter: node.type === "summary",
  };
};

/* ============================================================
   FINANCIAL ROW

   IMPORTANT:
   Expansion uses rowKey instead of item.id.

   Examples:

   Top level:
     0
     1
     2

   Account:
     0.0
     0.1
     1.0

   Project:
     0.0.0
     0.0.1

   Detail:
     0.0.0.0
     0.0.0.1
   ============================================================ */

const FinancialRow = ({
  item,
  depth = 0,
  rowKey,
  formatCurrency,
  expandedIds,
  toggleRow,
}) => {
  const hasChildren = item.children && item.children.length > 0;

  const isExpanded = expandedIds.has(rowKey);

  const isLevel0 = depth === 0;

  const isLevel1 = depth === 1;

  const isLevel2 = depth === 2;

  const isLevel3 = depth === 3;

  const isSummaryRow = item.type === "summary";

  let rowStyle =
    "border-b border-slate-200 hover:bg-slate-50 transition-colors ";

  let textStyle = "text-[12px] tracking-tight";

  let inlineRowStyle = {};

  /* ==========================================================
     ROW STYLING
     ========================================================== */

  if (isSummaryRow) {
    rowStyle +=
      " bg-slate-100/90 font-bold border-t-2 border-slate-300 text-slate-900 shadow-sm";

    textStyle = "text-[12px] font-bold tracking-tight";
  } else if (isLevel0) {
    rowStyle += "bg-slate-50 font-semibold text-slate-900";

    textStyle = "text-[12px] tracking-tight";
  } else if (isLevel1) {
    rowStyle += "bg-white text-slate-900 font-medium";

    textStyle = "text-[11px]";
  } else if (isLevel2) {
    rowStyle += "bg-white text-slate-800";

    textStyle = "text-[11px]";
  } else if (isLevel3) {
    rowStyle += "bg-white text-slate-700";

    textStyle = "text-[11px]";
  } else {
    rowStyle += "bg-white text-slate-700";

    textStyle = "text-[11px]";
  }

  /* ==========================================================
     DESCRIPTION
     ========================================================== */

  let displayDescp = (item?.name || item?.acctName || item?.fsLnDesc || "")
    .replace("OI - ", "")
    .replace("NIBT - ", "")
    .replace("NI - ", "")
    .replace("GM - ", "")
    .replace(/Total$/i, "")
    .trim();

  /* ==========================================================
     YTD
     ========================================================== */

  const ytdTotal = Object.values(item.monthlyAmts || {}).reduce(
    (acc, currentVal) => {
      if (
        currentVal === "-" ||
        currentVal === null ||
        currentVal === undefined
      ) {
        return acc;
      }

      return acc + (Number(currentVal) || 0);
    },
    0,
  );

  return (
    <>
      {/* ======================================================
          CURRENT ROW
         ====================================================== */}

      <tr className={rowStyle} style={inlineRowStyle}>
        <td
          className={`py-2 px-4 flex items-center sticky left-0 z-30 border-r border-slate-200 bg-inherit ${
            isSummaryRow ? "bg-slate-100" : ""
          }`}
          style={{
            paddingLeft: isSummaryRow ? "16px" : `${depth * 28 + 16}px`,

            minWidth: "240px",
            maxWidth: "240px",
          }}
        >
          {/* ==================================================
              EXPAND BUTTON

              Uses rowKey, NOT item.id
             ================================================== */}

          {hasChildren && !isSummaryRow ? (
            <button
              type="button"
              onClick={() => toggleRow(rowKey)}
              className="mr-2 text-slate-400 cursor-pointer flex items-center justify-center focus:outline-none"
            >
              <div
                className={`transition-transform duration-150 ${
                  isExpanded ? "" : "-rotate-90"
                }`}
              >
                <FaChevronDown size={10} />
              </div>
            </button>
          ) : (
            <span className="w-4 mr-2" />
          )}

          <div className="flex flex-col truncate">
            {/* =================================================
                TOP LEVEL:

                DO NOT SHOW ID

                LEVEL 1+:

                SHOW ID
               ================================================= */}

            {!isSummaryRow && !isLevel0 && (
              <span className="text-[9px] text-slate-500 font-mono tracking-normal">
                {item.id}
              </span>
            )}

            <span className={`truncate capitalize ${textStyle}`}>
              {displayDescp}
            </span>
          </div>
        </td>

        {/* ====================================================
            MONTHS
           ==================================================== */}

        {[...Array(12)].map((_, i) => {
          const pd = i + 1;

          const val = item.monthlyAmts?.[pd] ?? "-";

          const numericVal = val === "-" ? 0 : Number(val) || 0;

          return (
            <td
              key={pd}
              className={`text-right px-4 tabular-nums border-r border-slate-200/60 w-28 py-2 bg-inherit ${textStyle} ${
                numericVal < 0 ? "text-red-600" : ""
              }`}
            >
              {formatCurrency(val)}
            </td>
          );
        })}

        {/* ====================================================
            TOTAL YTD
           ==================================================== */}

        <td
          className={`text-right px-6 tabular-nums border-l-2 border-b border-slate-200 bg-slate-50/50 font-bold w-32 ${textStyle} ${
            ytdTotal < 0 ? "text-red-600" : ""
          }`}
        >
          {ytdTotal === 0 &&
          Object.values(item.monthlyAmts || {}).every((v) => v === "-")
            ? "-"
            : formatCurrency(ytdTotal)}
        </td>
      </tr>

      {/* ======================================================
          CHILDREN

          IMPORTANT:
          Every child gets a hierarchical rowKey.

          Example:

          Parent:
            0

          Children:
            0.0
            0.1

          Grandchildren:
            0.0.0
            0.0.1
         ====================================================== */}

      {isExpanded &&
        hasChildren &&
        !isSummaryRow &&
        item.children.map((child, index) => {
          const childRowKey = `${rowKey}.${index}`;

          return (
            <FinancialRow
              key={childRowKey}
              item={child}
              depth={depth + 1}
              rowKey={childRowKey}
              formatCurrency={formatCurrency}
              expandedIds={expandedIds}
              toggleRow={toggleRow}
            />
          );
        })}
    </>
  );
};

/* ============================================================
   MAIN REPORT
   ============================================================ */

const IS_Report = () => {
  const [rawData, setRawData] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(10);
  const [closingPeriodDate, setClosingPeriodDate] = useState(null);

  const [cachedAge, setCachedAge] = useState("");

  const [selectedYear, setSelectedYear] = useState("2026");

  const [availableYears, setAvailableYears] = useState([
    "2026",
    "2025",
    "2024",
    "2023",
  ]);

  const [loading, setLoading] = useState(false);

  const [hasRun, setHasRun] = useState(false);

  const [error, setError] = useState(null);

  const [data, setData] = useState([]);

  const closingMonth = closingPeriodDate ? closingPeriodDate.getMonth() + 1 : 0;

  const closingYear = closingPeriodDate ? closingPeriodDate.getFullYear() : 0;

  /*
    ==========================================================
    VIEW LEVEL

    0 = Top Level
    1 = Account Level
    2 = Project Level
    3 = Detail Level
    ==========================================================
  */

  const [viewLevel, setViewLevel] = useState(0);

  /*
    ==========================================================
    EXPANSION STATE

    Uses hierarchical row keys instead of account IDs.

    Examples:

      0
      0.0
      0.0.0
      0.0.0.0
    ==========================================================
  */

  const [expandedIds, setExpandedIds] = useState(new Set());

  /* ==========================================================
     EXPAND TO LEVEL
     ========================================================== */

  const expandToLevel = (level) => {
    const newExpanded = new Set();

    const addByLevel = (nodes, currentDepth = 0, parentKey = "") => {
      if (!nodes || !Array.isArray(nodes)) {
        return;
      }

      nodes.forEach((node, index) => {
        /*
            Build hierarchical row key.

            Root:
              0
              1
              2

            Child:
              0.0
              0.1

            Grandchild:
              0.0.0
          */

        const rowKey = parentKey ? `${parentKey}.${index}` : `${index}`;

        /*
            Level behavior:

            level 0:
              nothing expanded

            level 1:
              expand top-level rows

            level 2:
              expand top-level + account rows

            level 3:
              expand top-level + account + project rows
          */

        if (
          currentDepth < level &&
          node.children &&
          node.children.length > 0 &&
          node.type !== "summary"
        ) {
          newExpanded.add(rowKey);

          addByLevel(node.children, currentDepth + 1, rowKey);
        }
      });
    };

    addByLevel(data, 0, "");

    setExpandedIds(newExpanded);

    setViewLevel(level);
  };

  /* ==========================================================
     TOGGLE SINGLE ROW
     ========================================================== */

  const toggleRow = (rowKey) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);

      if (next.has(rowKey)) {
        next.delete(rowKey);
      } else {
        next.add(rowKey);
      }

      return next;
    });
  };

  /* ==========================================================
     MERGE ENTRIES
     ========================================================== */

  const mergeEntriesByName = (data) => {
    const mergedMap = new Map();

    data.forEach((item) => {
      if (mergedMap.has(item.name)) {
        const existing = mergedMap.get(item.name);

        existing.children.push(...item.children);

        Object.keys(item.monthlyTotals || {}).forEach((key) => {
          existing.monthlyTotals[key] =
            (existing.monthlyTotals[key] || 0) + (item.monthlyTotals[key] || 0);
        });

        Object.keys(item.revenueTotals || {}).forEach((key) => {
          existing.revenueTotals[key] =
            (existing.revenueTotals[key] || 0) + (item.revenueTotals[key] || 0);
        });
      } else {
        mergedMap.set(item.name, {
          ...item,

          children: [...item.children],

          monthlyTotals: {
            ...item.monthlyTotals,
          },

          revenueTotals: {
            ...item.revenueTotals,
          },
        });
      }
    });

    return Array.from(mergedMap.values());
  };

  /* ==========================================================
     MONTH MAP
     ========================================================== */

  const monthMap = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };

  /* ==========================================================
     COLUMNS
     ========================================================== */

  const columns = useMemo(() => {
    const monthLabels = [
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

    return monthLabels.map((month) => ({
      year: selectedYear,
      month,
    }));
  }, [selectedYear]);

  const labelToNum = Object.fromEntries(
    Object.entries(monthMap).map(([num, label]) => [label, num]),
  );

  /* ==========================================================
     TRANSFORM DATA
     ========================================================== */

  const transformToIncomeStatementFormat = (
    rawPayload,
    targetYear,
    closingPeriod,
  ) => {
    try {
      const result = mergeEntriesByName(rawPayload);

      const closingMonth = Number(closingPeriod?.month);
      const closingYear = Number(closingPeriod?.year);

      // const sortOrder = [
      //   "Contracts Revenue",
      //   "Direct Labor",
      //   "Direct Travel",
      //   "Direct Materials",
      //   "Subcontracts",
      //   "Other Direct Costs",
      //   "Gross Profit / (Loss)",
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
      //   "Net Profit / (Loss)",
      // ];

      const sortOrder = [
        "Revenue",
        "Revenue Adjustment",
        "Revenue Total",
        "Direct Labor",
        "Consultation",
        "Materials",
        "Material Handling",
        "Subcontractors",
        "Travel",
        "Other Direct Cost",
        "Equipments",
        "Equipment",
        "Unallowable Direct - ODCs",
        "Direct Cost Total",
        "Gross Profit / (Loss)",
        "Gross Profit / (Loss) %",
        "Fringe Benefits",
        "Overhead",
        "General & Administration Exp",
        "HR/Payroll Allocation",
        "IT/Facilities",
        "Project Specific Overhead",
        "Subcont, Material & Equipment",
        "Unallowables",
        "Cost of Operations",
        "Gross Margin",
        "Interest Income",
        "Other Income",
        "Net Income Before Tax",
        "Net Profit / (Loss)",
        "Net Profit / (Loss) %",
      ];

      const getTotals = (item) => {
        return item.monthlyTotals || {};
      };

      /* ====================================================
           MAP CHILD NODES
           ==================================================== */

      const mapNodes = (nodes) => {
        if (!nodes) return [];

        const nodesArray = Array.isArray(nodes) ? nodes : Object.values(nodes);

        return nodesArray
          .map((item) => ({
            id: (item.id || item.code || "").toString().trim(),

            name: (item.name || item.description || "").toString().trim(),

            type: item.type,

            monthlyTotals: getTotals(item) || {},

            revenueTotals: item.revenueTotals || {},

            children: mapNodes(item.children),
          }))
          .sort((a, b) =>
            a.id.localeCompare(b.id, undefined, {
              numeric: true,
              sensitivity: "base",
            }),
          );
      };

      const dataToMap = Array.isArray(result) ? result : Object.values(result);

      let allMappedNodes = dataToMap.map((item) => ({
        id: item.id || item.code,

        name: (item.name || item.description || "").trim(),

        type: item.type,

        monthlyTotals: structuredClone(getTotals(item) || {}),

        revenueTotals: structuredClone(item.revenueTotals || {}),

        children: mapNodes(item.children),
      }));

      /* ====================================================
           INVERT NODE VALUES
           ==================================================== */

      const invertNodeValues = (node) => {
        const nodeId = String(node.id ?? "");
        const hasChildren =
          Array.isArray(node.children) && node.children.length > 0;

        Object.keys(node.monthlyTotals).forEach((key) => {
          const val = node.monthlyTotals[key];
          const [year, month] = key.split("-").map(Number);

          if (Number(year) === Number(closingYear) && month <= closingMonth) {
            node.monthlyTotals[key] = -parseFloat(val);
          }
        });

        if (node.children && Array.isArray(node.children)) {
          node.children.forEach(invertNodeValues);
        }
      };

      /* ====================================================
           CONTRACT REVENUE
           ==================================================== */

      allMappedNodes.forEach((n) => {
        const nameLower = (n.name || "").toLowerCase();

        const idStr = (n.id || "").toString();

        if (
          nameLower.includes("contract revenue") ||
          idStr === "40" ||
          idStr.startsWith("40")
        ) {
          n.id = "40";

          invertNodeValues(n);
        }
      });

      /* ====================================================
           OTHER INCOME
           ==================================================== */

      let nonOperatingNode = allMappedNodes.find((n) => n.id === "95");

      let otherIncomeNode = null;

      if (nonOperatingNode && nonOperatingNode.children) {
        const oiIndex = nonOperatingNode.children.findIndex(
          (child) =>
            child.id === "95.01.03" ||
            child.name.toLowerCase().includes("other income"),
        );

        if (oiIndex !== -1) {
          otherIncomeNode = nonOperatingNode.children[oiIndex];

          otherIncomeNode.name = "Other Income";

          otherIncomeNode.children = [];

          nonOperatingNode.children.splice(oiIndex, 1);
        }
      }

      if (otherIncomeNode) {
        allMappedNodes.push(otherIncomeNode);
      }

      /* ====================================================
           UNALLOWABLE EXPENSE
           ==================================================== */

      let unallowableNode = allMappedNodes.find((n) => n.id === "90");

      const nodeToMoveIndex = allMappedNodes.findIndex(
        (n) => n.id === "50.32.02",
      );

      if (unallowableNode && nodeToMoveIndex !== -1) {
        const nodeToMove = allMappedNodes[nodeToMoveIndex];

        if (!unallowableNode.children) {
          unallowableNode.children = [];
        }

        if (nodeToMove.children && nodeToMove.children.length > 0) {
          unallowableNode.children.push(...nodeToMove.children);
        } else {
          unallowableNode.children.push(nodeToMove);
        }

        allMappedNodes.splice(nodeToMoveIndex, 1);
      }

      /* ====================================================
           DIRECT LABOR / NON LABOR
           ==================================================== */

      const directLaborNode = allMappedNodes.find((n) =>
        n.name.includes("Direct Labor"),
      );

      const directNonLaborNode = allMappedNodes.find((n) =>
        n.name.includes("Direct Non Labor"),
      );

      /* ====================================================
           SUMMARY NODES
           ==================================================== */

      const profitNode = {
        id: "PL-Summary",

        name: "Gross Profit / (Loss)",

        type: "summary",

        monthlyTotals: {},

        children: [],
      };

      const totalOperatingExpensesNode = {
        id: "OPEX-TOTAL",

        name: "Total Operating Expenses",

        type: "summary",

        monthlyTotals: {},

        children: [],
      };

      const netProfitNode = {
        id: "Net PL-Summary",

        name: "Net Profit / (Loss)",

        type: "summary",

        monthlyTotals: {},

        children: [],
      };

      /* ====================================================
           INDIRECT NAMES
           ==================================================== */

      const indirectNames = [
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
      ];

      const directNames = [
        "Direct Labor",
        "Direct Travel",
        "Direct Materials",
        "Subcontracts",
        "Other Direct Costs",
      ];

      /* ====================================================
           INDIRECT NODES
           ==================================================== */

      const indirectNodes = allMappedNodes.filter((n) => {
        if (!n.name) return false;

        const nodeNameLower = n.name.toLowerCase().trim();

        return indirectNames.some((indirectName) =>
          nodeNameLower.includes(indirectName.toLowerCase().trim()),
        );
      });

      /* ====================================================
           DIRECT NODES
           ==================================================== */

      const directNodes = allMappedNodes.filter((n) => {
        if (!n?.name) return false;

        const nodeNameLower = n.name.toLowerCase().trim();

        return directNames.some((name) =>
          nodeNameLower.includes(name.toLowerCase().trim()),
        );
      });

      /* ====================================================
           GET IMMUTABLE VALUE
           ==================================================== */

      const getImmutableVal = (node, key) => {
        if (!node) return 0;

        const sourceTotals = node.monthlyTotals || {};

        let val = sourceTotals[key];

        if (val === undefined || val === null || val === "-") {
          return 0;
        }

        let parsed = parseFloat(val);

        return Math.round((parsed + Number.EPSILON) * 100) / 100;
      };

      /* ====================================================
           GET ARRAY SUM
           ==================================================== */

      const getArraySum = (node, key) => {
        if (!Array.isArray(node)) {
          return 0;
        }

        return node.reduce((sum, n) => sum + getImmutableVal(n, key), 0);
      };

      /* ====================================================
           CALCULATE SUMMARY VALUES
           ==================================================== */

      columns.forEach((col) => {
        const monthNum = labelToNum[col.month];

        const combinedKey = `${col.year}-${monthNum}`;

        /* ================================================
               NON OPERATING TOTAL
               ================================================ */

        if (nonOperatingNode) {
          const remainingChildTotal = (nonOperatingNode.children || []).reduce(
            (sum, child) => sum + getImmutableVal(child, combinedKey),
            0,
          );

          nonOperatingNode.monthlyTotals[combinedKey] =
            Math.round((remainingChildTotal + Number.EPSILON) * 100) / 100;
        }

        /* ================================================
               UNALLOWABLE TOTAL
               ================================================ */

        if (unallowableNode) {
          const childTotal = (unallowableNode.children || []).reduce(
            (sum, child) => sum + getImmutableVal(child, combinedKey),
            0,
          );

          unallowableNode.monthlyTotals[combinedKey] =
            Math.round((childTotal + Number.EPSILON) * 100) / 100;
        }

        /* ================================================
               REVENUE
               ================================================ */

        const revNodes = allMappedNodes.filter((n) => {
          const nLower = (n.name || "").toLowerCase();

          const idStr = (n.id || "").toString();

          return nLower.includes("contracts revenue");
          // idStr === "40"
          // idStr.startsWith("40")
        });

        console.log(revNodes);

        let totalRevVal = revNodes.reduce(
          (sum, rNode) => sum + getImmutableVal(rNode, combinedKey),
          0,
        );

        const nonLaborVal = getImmutableVal(directNonLaborNode, combinedKey);

        const laborVal = getArraySum(directNodes, combinedKey);

        /* ================================================
               GROSS PROFIT
               ================================================ */

        console.log(totalRevVal, laborVal, nonLaborVal);

        const grossProfit =
          Math.round(
            (totalRevVal - (laborVal + nonLaborVal) + Number.EPSILON) * 100,
          ) / 100;

        console.log(totalRevVal - (laborVal + nonLaborVal));

        profitNode.monthlyTotals[combinedKey] = grossProfit;

        /* ================================================
               TOTAL INDIRECT
               ================================================ */

        const totalIndirect = indirectNodes.reduce(
          (sum, node) => sum + getImmutableVal(node, combinedKey),
          0,
        );

        totalOperatingExpensesNode.monthlyTotals[combinedKey] =
          Math.round((totalIndirect + Number.EPSILON) * 100) / 100;

        /* ================================================
               NET PROFIT
               ================================================ */

        netProfitNode.monthlyTotals[combinedKey] =
          Math.round((grossProfit - totalIndirect + Number.EPSILON) * 100) /
          100;
      });

      /* ====================================================
           COMBINED LIST
           ==================================================== */

      const combinedList = [
        ...allMappedNodes,

        profitNode,

        totalOperatingExpensesNode,

        netProfitNode,
      ];

      console.log(netProfitNode);

      /* ====================================================
           SORT INDEX
           ==================================================== */

      const getSortIndex = (nodeName) => {
        if (!nodeName) return -1;

        const cleanName = nodeName.toString().trim().toLowerCase();

        return sortOrder.findIndex((orderName) => {
          const cleanOrderName = orderName.trim().toLowerCase();

          if (cleanOrderName === "contracts revenue") {
            return (
              cleanName.includes("contracts revenue") ||
              cleanName.includes("contract revenue")
            );
          }

          if (cleanOrderName === "total operating expenses") {
            return (
              cleanName === "total operating expenses" ||
              cleanName.includes("opex-total")
            );
          }

          if (cleanOrderName === "gross profit / (loss)") {
            return cleanName.includes("gross profit");
          }

          if (cleanOrderName === "net profit / (loss)") {
            return cleanName.includes("net profit");
          }

          return cleanName.includes(cleanOrderName);
        });
      };

      /* ====================================================
           FINAL LIST
           ==================================================== */

      const finalDataList = combinedList.filter(
        (node) => getSortIndex(node.name) !== -1,
      );

      finalDataList.sort((a, b) => getSortIndex(a.name) - getSortIndex(b.name));

      return finalDataList;
    } catch (error) {
      console.error("Error transforming forecast data structure:", error);

      return [];
    }
  };

  /* ==========================================================
     RUN REPORT
     ========================================================== */

  const handleRunReport = async (byPassCache = false) => {
    setLoading(true);
    setError(null);

    try {
      const [summaryRes, configRes] = await Promise.all([
        fetch(`${backendUrl}/Forecast/GetSummaryV4?byPassCache=${byPassCache}`),
        fetch(
          `${backendUrl}/api/Configuration/GetAllConfigValuesByProject/xxxxx`,
        ),
      ]);

      if (!summaryRes.ok) {
        throw new Error("Failed to fetch forecast summary");
      }

      if (!configRes.ok) {
        throw new Error("Failed to fetch configuration");
      }

      const parsedJson = await summaryRes.json();
      const configData = await configRes.json();

      console.log(configData);

      // Read closing period from configuration API
      const closingConfig = Array.isArray(configData)
        ? configData.find((item) => item.name === "closing_period")
        : null;

      if (!closingConfig?.value) {
        throw new Error("Closing period configuration was not found");
      }

      const [year, month, day] = closingConfig.value.split("-").map(Number);

      const parsedClosingDate = new Date(year, month - 1, day);
      console.log(parsedClosingDate);
      setClosingPeriodDate(parsedClosingDate);

      setCachedAge(getCacheAge(parsedJson.createdAt));
      setRawData(parsedJson.data);

      const processedList = transformToIncomeStatementFormat(
        parsedJson.data,
        selectedYear,
        {
          year,
          month,
        },
      );

      setData(processedList);
      setExpandedIds(new Set());
      setViewLevel(0);
      setHasRun(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     YEAR CHANGE
     ========================================================== */

  useEffect(() => {
    if (rawData.length > 0) {
      const filtered = transformToIncomeStatementFormat(rawData, selectedYear, {
        year: closingYear,
        month: closingMonth,
      });

      setData(filtered);
      setExpandedIds(new Set());
      setViewLevel(0);
    } else {
      handleRunReport();
    }
  }, [selectedYear]);

  /* ==========================================================
     FORMAT CURRENCY
     ========================================================== */

  const formatCurrency = (val) => {
    if (
      val === undefined ||
      val === null ||
      val === "-" ||
      Math.round((parseFloat(val) + Number.EPSILON) * 100) / 100 === 0
    ) {
      return "-";
    }

    const formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(val));

    return val < 0 ? `-${formatted}` : formatted;
  };

  /* ==========================================================
     EXCEL EXPORT
     
     IMPORTANT:
     Uses EXACT SAME hierarchical row keys as UI.
     ========================================================== */

  const exportToExcel = () => {
    if (!data || data.length === 0) {
      return;
    }

    const wb = XLSX.utils.book_new();

    const rows = [];
    const excelRowMeta = [];

    /* ======================================================
     HEADER
     ====================================================== */

    rows.push([import.meta.env.VITE_CLIENT_NAME || "Client Name"]);

    rows.push(["Income Statement"]);

    rows.push([`Fiscal Year: ${selectedYear}`]);

    rows.push([]);

    const headerRow = ["Account - Description"];

    columns.forEach((col) => {
      headerRow.push(`${col.year}-${labelToNum[col.month]}`);
    });

    headerRow.push("Total YTD");

    rows.push(headerRow);

    /* ======================================================
     BUILD DISPLAY LABEL

     TOP LEVEL:
       Contracts Revenue

     LEVEL 1:
       40-10-01 - Revenue - Government

     LEVEL 2:
       C1387.001 - C1387.001

     LEVEL 3:
       NO-EMP - NO-EMP

     IMPORTANT:
     If description already starts with ID,
     do NOT add ID again.
     ====================================================== */

    const buildDisplayLabel = (displayNode, depth) => {
      let displayDescp = (displayNode?.name || displayNode?.acctName || "")
        .replace("OI - ", "")
        .replace("NIBT - ", "")
        .replace("NI - ", "")
        .replace("GM - ", "")
        .replace(/Total$/i, "")
        .trim();

      const nodeId = String(displayNode?.id ?? "").trim();

      /* ----------------------------------------------
       TOP LEVEL

       Never show ID for first/top-level row.
       ---------------------------------------------- */

      if (displayNode?.type === "summary" || depth === 0) {
        return displayDescp;
      }

      /* ----------------------------------------------
       NO ID
       ---------------------------------------------- */

      if (!nodeId) {
        return `${" ".repeat(depth * 4)}${displayDescp}`;
      }

      /* ----------------------------------------------
       CHECK IF DESCRIPTION ALREADY CONTAINS ID

       Example:

       id:
       40-10-01

       description:
       40-10-01 - Revenue - Government

       Result:
       40-10-01 - Revenue - Government

       NOT:
       40-10-01 - 40-10-01 - Revenue - Government
       ---------------------------------------------- */

      const normalizedId = nodeId.toLowerCase().trim();

      const normalizedDescription = displayDescp.toLowerCase().trim();

      const alreadyContainsId =
        normalizedDescription === normalizedId ||
        normalizedDescription.startsWith(`${normalizedId} -`) ||
        normalizedDescription.startsWith(`${normalizedId}-`);

      let label;

      if (alreadyContainsId) {
        label = displayDescp;
      } else {
        label = `${nodeId} - ${displayDescp}`;
      }

      /* ----------------------------------------------
       INDENTATION
       ---------------------------------------------- */

      return `${" ".repeat(depth * 4)}${label}`;
    };

    /* ======================================================
     APPEND EXCEL ROWS
     ====================================================== */

    const appendExcelRows = (nodes, depth = 0, parentKey = "") => {
      if (!nodes || !Array.isArray(nodes)) {
        return;
      }

      nodes.forEach((node, index) => {
        /* ----------------------------------------------
         UNIQUE HIERARCHICAL KEY

         Top level:
         0
         1
         2

         Child:
         0.0
         0.1
         0.0.0
         0.0.1
         ---------------------------------------------- */

        const rowKey = parentKey ? `${parentKey}.${index}` : `${index}`;

        const displayNode = formatRowForDisplay(node, selectedYear);

        /* ----------------------------------------------
         LABEL
         ---------------------------------------------- */

        const indentLabel = buildDisplayLabel(displayNode, depth);

        const fileRow = [indentLabel];

        /* ----------------------------------------------
         MONTHLY VALUES
         ---------------------------------------------- */

        let ytdTotal = 0;

        [...Array(12)].forEach((_, i) => {
          const pd = i + 1;

          const val = displayNode?.monthlyAmts?.[pd] ?? 0;

          const numericVal = val === "-" ? 0 : Number(val) || 0;

          fileRow.push(numericVal);

          ytdTotal += numericVal;
        });

        /* ----------------------------------------------
         TOTAL YTD
         ---------------------------------------------- */

        fileRow.push(ytdTotal);

        rows.push(fileRow);

        /* ----------------------------------------------
         METADATA
         ---------------------------------------------- */

        excelRowMeta.push({
          rowKey,
          depth,
          type: displayNode.type,
        });

        /* ----------------------------------------------
         EXPANSION

         IMPORTANT:

         Do NOT use node.id for expansion.

         The same ID can exist at different
         hierarchy positions.

         Use the hierarchical rowKey instead.
         ---------------------------------------------- */

        const isExpanded = expandedIds.has(rowKey);

        if (
          isExpanded &&
          node.children &&
          node.children.length > 0 &&
          node.type !== "summary"
        ) {
          appendExcelRows(node.children, depth + 1, rowKey);
        }
      });
    };

    /* ======================================================
     START FROM TOP LEVEL
     ====================================================== */

    appendExcelRows(data, 0, "");

    /* ======================================================
     CREATE WORKSHEET
     ====================================================== */

    const ws = XLSX.utils.aoa_to_sheet(rows);

    /* ======================================================
     EXCEL STYLES
     ====================================================== */

    const styles = {
      title: {
        font: {
          name: "Arial",
          size: 14,
          bold: true,
        },

        alignment: {
          horizontal: "left",
        },
      },

      subtitle: {
        font: {
          name: "Arial",
          size: 11,
          italic: true,
        },
      },

      header: {
        font: {
          name: "Arial",
          size: 10,
          bold: true,

          color: {
            rgb: "FFFFFF",
          },
        },

        fill: {
          fgColor: {
            rgb: "1E3A8A",
          },
        },

        alignment: {
          horizontal: "center",
        },
      },

      summary: {
        font: {
          name: "Arial",
          size: 10,
          bold: true,
        },

        fill: {
          fgColor: {
            rgb: "E2E8F0",
          },
        },

        border: {
          top: {
            style: "thin",

            color: {
              rgb: "94A3B8",
            },
          },

          bottom: {
            style: "double",

            color: {
              rgb: "000000",
            },
          },
        },
      },

      level0: {
        font: {
          name: "Arial",
          size: 10,
          bold: true,
        },

        fill: {
          fgColor: {
            rgb: "F8FAFC",
          },
        },
      },

      level1: {
        font: {
          name: "Arial",
          size: 9,
          bold: true,
        },
      },

      level2: {
        font: {
          name: "Arial",
          size: 9,
          bold: false,
        },
      },

      level3: {
        font: {
          name: "Arial",
          size: 9,
          bold: false,
        },
      },

      currency: {
        numFmt: '$#,##0.00;($#,##0.00);"-"',
      },
    };

    /* ======================================================
     APPLY EXCEL STYLES
     ====================================================== */

    Object.keys(ws).forEach((cell) => {
      if (cell[0] === "!") {
        return;
      }

      const parsedCell = XLSX.utils.decode_cell(cell);

      const rowIdx = parsedCell.r;

      const colIdx = parsedCell.c;

      /* ----------------------------------------------
       TITLE
       ---------------------------------------------- */

      if (rowIdx === 0) {
        ws[cell].s = styles.title;
        return;
      }

      /* ----------------------------------------------
       SUBTITLE
       ---------------------------------------------- */

      if (rowIdx === 1 || rowIdx === 2) {
        ws[cell].s = styles.subtitle;
        return;
      }

      /* ----------------------------------------------
       HEADER
       ---------------------------------------------- */

      if (rowIdx === 4) {
        ws[cell].s = styles.header;
        return;
      }

      /* ----------------------------------------------
       DATA
       ---------------------------------------------- */

      if (rowIdx > 4) {
        const dataOffsetRow = rowIdx - 5;

        const meta = excelRowMeta[dataOffsetRow];

        if (!meta) {
          return;
        }

        let cellStyle = {};

        /* SUMMARY */

        if (meta.type === "summary") {
          cellStyle = {
            ...styles.summary,
          };
        } else if (meta.depth === 0) {
          /* TOP LEVEL */
          cellStyle = {
            ...styles.level0,
          };
        } else if (meta.depth === 1) {
          /* ACCOUNT LEVEL */
          cellStyle = {
            ...styles.level1,
          };
        } else if (meta.depth === 2) {
          /* PROJECT LEVEL */
          cellStyle = {
            ...styles.level2,
          };
        } else {
          /* DETAIL LEVEL */
          cellStyle = {
            ...styles.level3,
          };
        }

        /* ----------------------------------------------
         NUMERIC COLUMNS
         ---------------------------------------------- */

        if (colIdx > 0) {
          cellStyle.numFmt = styles.currency.numFmt;

          cellStyle.alignment = {
            horizontal: "right",
          };
        } else {
          cellStyle.alignment = {
            horizontal: "left",
          };
        }

        ws[cell].s = cellStyle;
      }
    });

    /* ======================================================
     COLUMN WIDTHS
     ====================================================== */

    ws["!cols"] = [
      {
        wch: 42,
      },

      ...[...Array(12)].map(() => ({
        wch: 14,
      })),

      {
        wch: 16,
      },
    ];

    /* ======================================================
     APPEND SHEET
     ====================================================== */

    XLSX.utils.book_append_sheet(wb, ws, "Income Statement");

    /* ======================================================
     DOWNLOAD
     ====================================================== */

    XLSXS.writeFile(
      wb,
      `${
        import.meta.env.VITE_CLIENT_NAME || "Client"
      }_Income_Statement_FY${selectedYear}.xlsx`,
    );
  };

  const exportToPDF = () => {
    if (!data || data.length === 0) {
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    /* ========================================================
     PDF HEADER
     ======================================================== */

    doc.setFont("helvetica", "bold");

    doc.setFontSize(20);

    doc.text(import.meta.env.VITE_CLIENT_NAME || "Client Name", 14, 15);

    doc.setFontSize(14);

    doc.setFont("helvetica", "normal");

    doc.text("Income Statement", 14, 22);

    doc.setFontSize(10);

    doc.text(`Fiscal Year: ${selectedYear}`, 14, 28);

    /* ========================================================
     HEADERS
     ======================================================== */

    const tableHeaders = ["Account - Description"];

    columns.forEach((col) => {
      tableHeaders.push(`${col.year}-${labelToNum[col.month]}`);
    });

    tableHeaders.push("Total YTD");

    const tableRows = [];
    const rowMetaData = [];

    /* ========================================================
     SAME LABEL LOGIC AS EXCEL/UI
     ======================================================== */

    const buildDisplayLabel = (displayNode, depth) => {
      let displayDescp = (displayNode?.name || displayNode?.acctName || "")
        .replace("OI - ", "")
        .replace("NIBT - ", "")
        .replace("NI - ", "")
        .replace("GM - ", "")
        .replace(/Total$/i, "")
        .trim();

      const nodeId = String(displayNode?.id ?? "").trim();

      /* ----------------------------------------------
       TOP LEVEL

       NO ID
       ---------------------------------------------- */

      if (displayNode?.type === "summary" || depth === 0) {
        return displayDescp;
      }

      /* ----------------------------------------------
       NO ID
       ---------------------------------------------- */

      if (!nodeId) {
        return `${" ".repeat(depth * 3)}${displayDescp}`;
      }

      /* ----------------------------------------------
       PREVENT DUPLICATE ID
       ---------------------------------------------- */

      const normalizedId = nodeId.toLowerCase().trim();

      const normalizedDescription = displayDescp.toLowerCase().trim();

      const alreadyContainsId =
        normalizedDescription === normalizedId ||
        normalizedDescription.startsWith(`${normalizedId} -`) ||
        normalizedDescription.startsWith(`${normalizedId}-`);

      let label;

      if (alreadyContainsId) {
        label = displayDescp;
      } else {
        label = `${nodeId} - ${displayDescp}`;
      }

      /* ----------------------------------------------
       INDENT
       ---------------------------------------------- */

      return `${" ".repeat(depth * 3)}${label}`;
    };

    /* ========================================================
     BUILD PDF ROWS
     ======================================================== */

    const buildPdfRowsList = (nodes, depth = 0, parentKey = "") => {
      if (!nodes || !Array.isArray(nodes)) {
        return;
      }

      nodes.forEach((node, index) => {
        /* ----------------------------------------------
         HIERARCHICAL KEY

         0
         0.0
         0.0.0
         0.0.0.0
         ---------------------------------------------- */

        const rowKey = parentKey ? `${parentKey}.${index}` : `${index}`;

        const displayNode = formatRowForDisplay(node, selectedYear);

        /* ----------------------------------------------
         LABEL
         ---------------------------------------------- */

        const indentLabel = buildDisplayLabel(displayNode, depth);

        const pdfRow = [indentLabel];

        /* ----------------------------------------------
         MONTHLY VALUES
         ---------------------------------------------- */

        let ytdTotal = 0;

        [...Array(12)].forEach((_, i) => {
          const pd = i + 1;

          const val = displayNode?.monthlyAmts?.[pd] ?? 0;

          const numericVal = val === "-" ? 0 : Number(val) || 0;

          pdfRow.push(formatCurrency(numericVal));

          ytdTotal += numericVal;
        });

        /* ----------------------------------------------
         YTD
         ---------------------------------------------- */

        pdfRow.push(formatCurrency(ytdTotal));

        tableRows.push(pdfRow);

        rowMetaData.push({
          depth,
          type: displayNode.type,
          rowKey,
        });

        /* ----------------------------------------------
         EXPANSION

         Use hierarchical rowKey.

         This allows all 4 levels to expand:
         
         Level 0
           ↓
         Level 1
           ↓
         Level 2
           ↓
         Level 3
         ---------------------------------------------- */

        const isExpanded = expandedIds.has(rowKey);

        if (
          isExpanded &&
          node.children &&
          node.children.length > 0 &&
          node.type !== "summary"
        ) {
          buildPdfRowsList(node.children, depth + 1, rowKey);
        }
      });
    };

    /* ========================================================
     BUILD
     ======================================================== */

    buildPdfRowsList(data, 0, "");

    /* ========================================================
     PDF TABLE WIDTH
     ======================================================== */

    const pageWidth = doc.internal.pageSize.getWidth();

    const marginLeft = 14;
    const marginRight = 14;

    const availableWidth = pageWidth - marginLeft - marginRight;

    const accountWidth = 44;
    const totalYtdWidth = 16;

    const monthWidth = (availableWidth - accountWidth - totalYtdWidth) / 12;

    /* ========================================================
     PDF TABLE
     ======================================================== */

    autoTable(doc, {
      startY: 34,

      head: [tableHeaders],

      body: tableRows,

      theme: "plain",

      margin: {
        left: marginLeft,
        right: marginRight,
      },

      tableWidth: availableWidth,

      styles: {
        font: "helvetica",

        fontSize: 6.5,

        cellPadding: 1.1,

        overflow: "hidden",

        valign: "middle",

        lineWidth: 0,
      },

      headStyles: {
        fillColor: [30, 58, 138],

        textColor: [255, 255, 255],

        fontStyle: "bold",

        fontSize: 6.5,

        halign: "center",

        valign: "middle",
      },

      columnStyles: {
        /* ACCOUNT */

        0: {
          cellWidth: accountWidth,

          halign: "left",

          fontSize: 6.5,
        },

        /* MONTHS */

        ...Object.fromEntries(
          [...Array(12)].map((_, i) => [
            i + 1,
            {
              cellWidth: monthWidth,

              halign: "right",

              fontSize: 6.5,

              overflow: "hidden",
            },
          ]),
        ),

        /* TOTAL */

        13: {
          cellWidth: totalYtdWidth,

          halign: "right",

          fontStyle: "bold",

          fontSize: 6.5,

          overflow: "hidden",
        },
      },

      /* ====================================================
       ROW STYLING
       ==================================================== */

      didParseCell: (dataCell) => {
        if (dataCell.section !== "body") {
          return;
        }

        const meta = rowMetaData[dataCell.row.index];

        if (!meta) {
          return;
        }

        /* SUMMARY */

        if (meta.type === "summary") {
          dataCell.cell.styles.fontStyle = "bold";

          dataCell.cell.styles.fillColor = [226, 232, 240];

          return;
        }

        /* TOP LEVEL */

        if (meta.depth === 0) {
          dataCell.cell.styles.fontStyle = "bold";

          dataCell.cell.styles.fillColor = [248, 250, 252];

          return;
        }

        /* ACCOUNT LEVEL */

        if (meta.depth === 1) {
          dataCell.cell.styles.fontStyle = "bold";

          return;
        }

        /* PROJECT LEVEL */

        if (meta.depth === 2) {
          dataCell.cell.styles.fontStyle = "normal";

          return;
        }

        /* DETAIL LEVEL */

        if (meta.depth >= 3) {
          dataCell.cell.styles.fontStyle = "normal";
        }
      },
    });

    /* ========================================================
     SAVE
     ======================================================== */

    doc.save(
      `${
        import.meta.env.VITE_CLIENT_NAME || "Client"
      }_Income_Statement_FY${selectedYear}.pdf`,
    );
  };

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <div className="w-full overflow-hidden p-2 space-y-6 min-h-screen text-slate-800">
      {/* ======================================================
          GLOBAL STYLES
         ====================================================== */}

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          #report-print-area,
          #report-print-area * {
            visibility: visible !important;
          }

          #report-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10px !important;
            box-shadow: none !important;
            border: none !important;
          }

          .no-print {
            display: none !important;
          }
        }

        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }

        .btn-action {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          font-weight: 500;
          font-size: 0.75rem;
          transition: all 0.2s;
        }
      `}</style>

      {/* ======================================================
          CONTROL BAR
         ====================================================== */}

      <div className="mx-auto mb-8 flex justify-between items-center no-print bg-white p-2 rounded-lg border">
        {/* ====================================================
            FISCAL YEAR
           ==================================================== */}

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <label className="text-[14px] font-semibold whitespace-nowrap">
              Fiscal Year
            </label>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 bg-slate-100 rounded-lg text-[14px] font-semibold cursor-pointer border border-gray-200 outline-none"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  FY {year}
                </option>
              ))}
            </select>
          </div>

          {cachedAge && (
            <span className="text-xs text-slate-400 font-medium pt-1">
              Last Refreshed: {cachedAge}
            </span>
          )}
        </div>

        {/* ====================================================
            ACTIONS
           ==================================================== */}

        <div className="flex flex-row items-center gap-4 self-end">
          {/* ==================================================
              EXCEL
             ================================================== */}

          <button
            onClick={exportToExcel}
            className="btn-action bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
          >
            <FaFileExcel size={14} />
            Export Excel
          </button>

          {/* ==================================================
              PDF
             ================================================== */}

          <button
            onClick={exportToPDF}
            className="btn-action bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
          >
            <FaFilePdf size={14} />
            Export PDF
          </button>

          {/* ==================================================
              REFRESH
             ================================================== */}

          <button
            onClick={() => handleRunReport(true)}
            className="btn-action bg-blue-600 text-white hover:bg-blue-700"
          >
            <FaSync className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          {/* ==================================================
              EXPAND / COLLAPSE ALL
             ================================================== */}

          {viewLevel === 0 ? (
            <button
              onClick={() => expandToLevel(3)}
              className="px-4 py-2 bg-blue-600 text-white text-[13px] font-bold rounded-lg hover:bg-blue-700 transition-all active:scale-95 whitespace-nowrap shadow-sm"
            >
              Expand All
            </button>
          ) : (
            <button
              onClick={() => expandToLevel(0)}
              className="px-4 py-2 bg-gray-100 text-gray-600 text-[13px] font-bold rounded-lg hover:bg-gray-200 transition-all active:scale-95 whitespace-nowrap"
            >
              Collapse All
            </button>
          )}

          {/* ==================================================
              VIEW LEVEL
             ================================================== */}

          <div className="flex items-center gap-2 min-w-[240px]">
            <span className="text-[14px] font-semibold whitespace-nowrap">
              View Level:
            </span>

            <select
              value={viewLevel}
              className="w-full p-2 bg-slate-100 rounded-lg text-[14px] font-semibold cursor-pointer border border-gray-200 outline-none"
              onChange={(e) => {
                const level = Number(e.target.value);

                expandToLevel(level);
              }}
            >
              <option value={0}>Top Level</option>

              <option value={1}>Account Level</option>

              <option value={2}>Project Level</option>

              <option value={3}>Detail Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* ======================================================
          REPORT AREA
         ====================================================== */}

      <div
        id="report-print-area"
        className="mx-auto bg-white rounded-lg md:p-3 border min-h-[90vh]"
      >
        <div className="mx-auto bg-white rounded-lg min-h-[90vh]">
          {/* ==================================================
              REPORT HEADER
             ================================================== */}

          <header className="text-center mb-1">
            <div>
              <h1 className="text-[26px] font-bold tracking-tight text-slate-800">
                {import.meta.env.VITE_CLIENT_NAME}
              </h1>

              <div className="w-24 h-1 bg-blue-600 mx-auto mb-1"></div>
            </div>

            <div className="inline-block px-8 py-2 mt-1 rounded-lg border border-blue-200">
              <h2 className="text-[16px] font-bold text-slate-900">
                Income Statement
              </h2>
            </div>
          </header>

          {/* ==================================================
              TABLE
             ================================================== */}

          <div className="w-full border border-slate-200 rounded-lg overflow-hidden flex flex-col bg-white">
            <div className="overflow-auto max-h-[80vh] min-h-[350px] custom-scrollbar">
              <table className="w-full border-collapse">
                {/* ==========================================
                    TABLE HEADER
                   ========================================== */}

                <thead>
                  <tr className="sticky top-0 z-50 text-[12px] border-b-2 border-slate-200 bg-slate-100 tracking-wider text-slate-700 shadow-sm">
                    <th className="py-1 px-2 text-left bg-slate-100 sticky left-0 z-60">
                      Account - Description
                    </th>

                    {[...Array(12)].map((_, i) => (
                      <th
                        key={i + 1}
                        className="py-1 px-2 text-right w-28 border-l border-slate-200 bg-slate-50 font-semibold"
                      >
                        {selectedYear}-{(i + 1).toString().padStart(2, "0")}
                      </th>
                    ))}

                    <th className="py-1 px-2 text-right w-32 border-l-2 border-slate-300 bg-slate-200 font-bold">
                      Total YTD
                    </th>
                  </tr>
                </thead>

                {/* ==========================================
                    TABLE BODY
                   ========================================== */}

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={14} className="py-20">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>

                          <p className="text-slate-500 font-medium animate-pulse">
                            Generating Report...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((node, index) => {
                      const formattedNode = formatRowForDisplay(
                        node,
                        selectedYear,
                      );

                      /*
                          Root row key.

                          IMPORTANT:
                          This is NOT node.id.

                          Therefore:

                          Contracts Revenue
                          may have id = 40

                          but its expansion
                          key is:

                          0
                        */

                      const rowKey = `${index}`;

                      return (
                        <FinancialRow
                          key={rowKey}
                          rowKey={rowKey}
                          depth={0}
                          item={formattedNode}
                          formatCurrency={formatCurrency}
                          expandedIds={expandedIds}
                          toggleRow={toggleRow}
                        />
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

export default IS_Report;
