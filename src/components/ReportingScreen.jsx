import React, { useState, useMemo, useEffect } from "react";
import {
  MinusSquare,
  PlusSquare,
  User,
  Calendar,
  ChevronsDown,
  ChevronsUp,
  BarChart3,
  Download,
  FileSpreadsheet,
  RefreshCcw,
} from "lucide-react";
import { backendUrl } from "./config";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import axios from "axios";

const ReportingScreen = ({
  onHideVariance,
  summaryData,
  summaryLoading,
  cachedAge,
  fetchSummaryData,
}) => {
  const currentYearStr = new Date().getFullYear().toString();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const availableYears = useMemo(() => {
    const year = new Date().getFullYear();
    return Array.from({ length: 11 }, (_, i) => (year - 5 + i).toString());
  }, []);

  const [selectedYear, setSelectedYear] = useState(currentYearStr);
  const [selectedLevel, setSelectedLevel] = useState("top");
  const [expandedRows, setExpandedRows] = useState({});

  const [closingPeriodDate, setClosingPeriodDate] = useState(null);
  const [viewMode, setViewMode] = useState("EAC");

  // Helper function to build hierarchical expansion key
  const buildHierarchicalKey = (parentKey, nodeId) => {
    return parentKey ? `${parentKey}-${nodeId}` : nodeId;
  };

  const exportUnifiedPlanDetails = async () => {
    try {
      setIsExporting(true);

      // 1. Fetch raw binary spreadsheet buffer from the API
      const response = await axios.post(
        `${backendUrl}/Forecast/ExportUnifiedPlanDetailsV1`,
        [], // Empty payload tells backend to "Export All"
        {
          headers: { "Content-Type": "application/json" },
          responseType: "arraybuffer", // Load as arraybuffer so ExcelJS can read it directly
        },
      );

      // 2. Load the binary array buffer into ExcelJS workbook structures
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(response.data);
      const worksheet = workbook.getWorksheet(1) || workbook.worksheets[0];

      // Force gridlines visibility
      worksheet.views = [{ showGridLines: true }];

      // 3. Format Multi-Level Headers (Row 1: Month Groups, Row 2: Columns/Subheaders)
      const row1 = worksheet.getRow(1);
      const row2 = worksheet.getRow(2);

      row1.height = 26;
      row2.height = 22;

      // Apply clean styling to Row 1 (Top Level Month headers e.g., "Jan-26")
      row1.eachCell((cell) => {
        if (cell.value) {
          cell.font = {
            name: "Arial",
            size: 10,
            bold: true,
            color: { argb: "FFFFFF" },
          };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "1E293B" }, // Slate 800 (Dark Navy/Slate)
          };
          cell.alignment = { vertical: "middle", horizontal: "center" };
        }
      });

      // Apply clean styling to Row 2 (Subheaders e.g., Project ID, Cost, Fringe, etc.)
      row2.eachCell((cell) => {
        cell.font = {
          name: "Arial",
          size: 10,
          bold: true,
          color: { argb: "FFFFFF" },
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "334155" }, // Slate 700 (Lighter Slate Header)
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });

      // 4. Clean up merged spans for Description & Project Metadata Columns (Cols A to AA)
      // Merges A1:A2, B1:B2 up to AA1:AA2 dynamically so they don't leave empty holes in Row 1
      for (let colIdx = 1; colIdx <= 27; colIdx++) {
        const topCell = row1.getCell(colIdx);
        const subCell = row2.getCell(colIdx);

        if (!topCell.value && subCell.value) {
          topCell.value = subCell.value; // Shift description header up to row 1
          worksheet.mergeCells(1, colIdx, 2, colIdx); // Merge top & bottom slots

          // Match base formatting
          topCell.font = {
            name: "Arial",
            size: 10,
            bold: true,
            color: { argb: "FFFFFF" },
          };
          topCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "1E293B" },
          };
          topCell.alignment = { vertical: "middle", horizontal: "center" };
        }
      }

      // 5. Contextual Rows Formatting & Alignments Loop
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber <= 2) return; // Skip headers

        row.height = 20;

        // Scan items to auto-format numeric cell metrics vs descriptors
        row.eachCell((cell, colNumber) => {
          // Apply text baseline font sizing
          cell.font = cell.font || { name: "Arial", size: 10 };

          if (colNumber > 25) {
            // Align right metrics grids (Hours, Cost, Overhead, Fringe, etc.)
            cell.alignment = { vertical: "middle", horizontal: "right" };

            // Format metrics values safely if numeric
            if (typeof cell.value === "number") {
              cell.numFmt = cell.numFmt || '#,##0.00;(#,##0.00);"-"';
            }
          } else {
            // Left-align text column definitions (Project ID, Name, Account, Status)
            cell.alignment = { vertical: "middle", horizontal: "left" };
          }
        });
      });

      // Auto-adjust column widths cleanly based on longest entry values
      worksheet.columns.forEach((col) => {
        let maxLen = 12;
        col.eachCell({ includeEmpty: false }, (cell) => {
          const valStr = cell.value ? cell.value.toString() : "";
          if (valStr.length > maxLen) maxLen = valStr.length;
        });
        col.width = Math.min(Math.max(maxLen + 3, 11), 45); // Limit column width thresholds bounds
      });

      // 6. Write Workbook out to client browser payload container
      const buffer = await workbook.xlsx.writeBuffer();
      const fileName = `UnifiedSequentialForecastReport_${new Date().toISOString().split("T")[0]}.xlsx`;

      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        fileName,
      );
    } catch (error) {
      console.error(
        "Error formatting and exporting plan details spreadsheet:",
        error,
      );
      alert("Failed to export report. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // const exportUnifiedPlanDetails = async () => {
  //   // Convert the Set to an Array so it serializes properly into the JSON body
  //   const payload = [];

  //   // NOTE: Early exit guard removed. An empty array now tells the backend to "Export All".

  //   try {
  //     // Start loading state
  //     setIsExporting(true);

  //     const response = await axios.post(
  //       `${backendUrl}/Forecast/ExportUnifiedPlanDetailsV1`,
  //       payload,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         responseType: "blob", // Crucial for binary file downloads
  //       },
  //     );

  //     // Create a temporary link to download the blob
  //     const blob = new Blob([response.data], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });

  //     const downloadUrl = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = downloadUrl;

  //     // Fallback name if the server header doesn't explicitly force one
  //     link.setAttribute("download", "UnifiedSequentialForecastReport.xlsx");

  //     document.body.appendChild(link);
  //     link.click();

  //     // Cleanup
  //     link.remove();
  //     window.URL.revokeObjectURL(downloadUrl);
  //   } catch (error) {
  //     console.error("Error exporting plan details spreadsheet:", error);
  //     alert("Failed to export report. Please try again.");
  //     throw error;
  //   } finally {
  //     // Stop loading state whether the request succeeded or failed
  //     setIsExporting(false);
  //   }
  // };

  // Helper function to get hierarchical keys up to a certain depth with conditional checking

  const getIdsByLevel = (
    nodes,
    targetDepth,
    currentDepth = 0,
    parentKey = "",
    level = "top",
  ) => {
    let ids = [];
    nodes.forEach((node) => {
      const hierarchicalKey = buildHierarchicalKey(parentKey, node.id);

      // REQUIREMENT 1: If level is account and it is Revenue node, don't expand
      const isRevenue =
        node.name?.toLowerCase().includes("revenue") || node.id === "REV-TOTAL";
      if (level === "account" && isRevenue) {
        return;
      }

      // If we haven't reached the target depth, add this key and recurse
      if (
        currentDepth < targetDepth &&
        node.children &&
        node.children.length > 0
      ) {
        ids.push(hierarchicalKey);
        ids = [
          ...ids,
          ...getIdsByLevel(
            node.children,
            targetDepth,
            currentDepth + 1,
            hierarchicalKey,
            level,
          ),
        ];
      }
    });
    return ids;
  };

  // Function to handle dropdown change
  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    let newExpanded = {};
    let targetDepth = 0;

    switch (level) {
      case "account":
        targetDepth = 1; // Expands Level 0 (Labor etc.) to show Accounts
        break;
      case "project":
        targetDepth = 2; // Expands Level 1 to show Projects (including Revenue)
        break;
      case "detail":
        targetDepth = 3; // Expands Level 2 to show Employees
        break;
      case "top":
      default:
        targetDepth = 0; // Collapses everything
    }

    if (targetDepth > 0) {
      // Pass the level context to apply customized logic
      const idsToExpand = getIdsByLevel(data, targetDepth, 0, "", level);
      idsToExpand.forEach((id) => (newExpanded[id] = true));
    }

    setExpandedRows(newExpanded);
  };

  // FIXED: Standardized keys as strings
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

  const labelToNum = Object.fromEntries(
    Object.entries(monthMap).map(([num, label]) => [label, num]),
  );

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

    if (selectedYear === "All") {
      return availableYears.flatMap((year) =>
        monthLabels.map((month) => ({ year, month })),
      );
    }
    return monthLabels.map((month) => ({ year: selectedYear, month }));
  }, [selectedYear, availableYears]);

  const getCurrentUserContext = () => {
    try {
      const userString = localStorage.getItem("currentUser");
      if (!userString) return { userId: "", role: "" };
      const userObj = JSON.parse(userString);
      return {
        userId: userObj.userId ?? "",
        role: userObj.role?.toLowerCase() ?? "",
        // roleName: user
      };
    } catch {
      return { userId: "", role: "" };
    }
  };

  const { userId, role } = getCurrentUserContext();

  const mergeEntriesByName = (data) => {
    const mergedMap = new Map();

    data.forEach((item) => {
      if (mergedMap.has(item.name)) {
        const existing = mergedMap.get(item.name);

        // 1. Merge Children
        existing.children.push(...item.children);

        // 2. Aggregate monthlyTotals (assuming you want to sum values)
        Object.keys(item.monthlyTotals).forEach((key) => {
          existing.monthlyTotals[key] =
            (existing.monthlyTotals[key] || 0) + (item.monthlyTotals[key] || 0);
        });

        // 3. Aggregate revenueTotals (same logic as above)
        Object.keys(item.revenueTotals).forEach((key) => {
          existing.revenueTotals[key] =
            (existing.revenueTotals[key] || 0) + (item.revenueTotals[key] || 0);
        });
      } else {
        // Clone the item to avoid mutating the original API response directly
        mergedMap.set(item.name, { ...item, children: [...item.children] });
      }
    });

    return Array.from(mergedMap.values());
  };

  const fetchForecast = async () => {
    try {
      setLoading(true);
      // const response =
      //   role === "admin"
      //     ? await fetch(`${backendUrl}/Forecast/GetSummaryV2`)
      //     : await fetch(
      //         `${backendUrl}/Forecast/GetSummaryByUser?UserId=${userId}`,
      //       );

      // const data = await response.json();
      const result = mergeEntriesByName(summaryData);

      // const sortOrder = [
      //   "Contracts Revenue",
      //   "Revenue Adjustment",
      //   "Revenue Total",
      //   "Direct Labor",
      //   "Direct Travel",
      //   "Direct Materials",
      //   "Subcontracts",
      //   "Other Direct Costs",
      //   // "Direct Non Labor",
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

      // 1️⃣ Map standard AND budgeted fields down the tree nodes recursively
      const mapNodes = (nodes, isRevenueContext = false) => {
        if (!nodes) return [];
        const nodesArray = Array.isArray(nodes) ? nodes : Object.values(nodes);
        return nodesArray
          .filter((item) => {
            const nodeId = (item.id || item.code || "").toString().trim();
            return !nodeId.includes("-BUDGET");
          })
          .map((item) => {
            const name = (item.name || item.description || "")
              .toString()
              .trim();
            const currentIsRevenue =
              isRevenueContext ||
              name.toLowerCase() === "revenue" ||
              name.toLowerCase().includes("revenue adjustment");

            return {
              id: (item.id || item.code || "").toString().trim(),
              name: name,
              type: item.type,
              isRevenue: currentIsRevenue, // 👈 Store the state flag explicitly here
              monthlyTotals: currentIsRevenue
                ? item.revenueTotals &&
                  Object.keys(item.revenueTotals).length > 0
                  ? item.revenueTotals
                  : item.monthlyTotals || {}
                : item.monthlyTotals || {},
              revenueTotals: item.revenueTotals || {},
              budgetMonthlyTotals: item.budgetMonthlyTotals || {},
              budgetRevenueTotals: item.budgetRevenueTotals || {},
              children: mapNodes(item.children, currentIsRevenue),
              lookup: item.lookup || {},
            };
          });
      };

      // And do the same when mapping the top-level items:
      let allMappedNodes = result.map((item) => {
        const name = (item.name || item.description || "").trim();
        const isRevenue =
          name.toLowerCase() === "revenue" ||
          name.toLowerCase().includes("revenue adjustment");

        return {
          id: item.id || item.code,
          name: name,
          type: item.type,
          isRevenue: isRevenue, // 👈 Store the state flag explicitly here too
          monthlyTotals: isRevenue
            ? item.revenueTotals && Object.keys(item.revenueTotals).length > 0
              ? item.revenueTotals
              : item.monthlyTotals || {}
            : item.monthlyTotals || {},
          revenueTotals: item.revenueTotals || {},
          budgetMonthlyTotals: item.budgetMonthlyTotals || {},
          budgetRevenueTotals: item.budgetRevenueTotals || {},
          children: mapNodes(item.children, isRevenue),
        };
      });

      let unallowableNode = allMappedNodes.find((n) => n.id === "90");
      const nodeToMoveIndex = allMappedNodes.findIndex(
        (n) => n.id === "50.32.02",
      );

      if (unallowableNode && nodeToMoveIndex !== -1) {
        const nodeToMove = allMappedNodes[nodeToMoveIndex];
        if (!unallowableNode.children) unallowableNode.children = [];
        if (nodeToMove.children && nodeToMove.children.length > 0) {
          unallowableNode.children.push(...nodeToMove.children);
        } else {
          unallowableNode.children.push(nodeToMove);
        }
        allMappedNodes.splice(nodeToMoveIndex, 1);
      }

      console.log(allMappedNodes);

      const revenueNode = allMappedNodes.find(
        (n) => n.name === "Contracts Revenue",
      );
      const revenueAdjNode = allMappedNodes.find((n) =>
        n.name.toLowerCase().includes("adjustment"),
      );

      // const directLaborNode = allMappedNodes.find((n) =>
      //   n.name.includes("Direct Labor"),
      // );
      const directNonLaborNode = allMappedNodes.find((n) =>
        n.name.includes("Direct Non Labor"),
      );

      const round2 = (num) =>
        Math.round((Number(num) + Number.EPSILON) * 100) / 100;

      // 3️⃣ Initialize Budget tracking dictionaries inside dynamic summary nodes
      const revenueTotalNode = {
        id: "REV-TOTAL",
        name: "Revenue Total",
        type: "summary",
        monthlyTotals: {},
        budgetMonthlyTotals: {},
        children: [],
      };

      const profitNode = {
        id: "PL-Summary",
        name: "Gross Profit / (Loss)",
        type: "summary",
        monthlyTotals: {},
        budgetMonthlyTotals: {},
        children: [],
      };

      const netProfitNode = {
        id: "Net PL-Summary",
        name: "Net Profit / (Loss)",
        type: "summary",
        monthlyTotals: {},
        budgetMonthlyTotals: {},
        children: [],
      };

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

      const indirectNodes = allMappedNodes.filter((n) => {
        if (!n.name) return false;
        const nodeNameLower = n.name.toLowerCase().trim();

        return indirectNames.some((indirectName) =>
          nodeNameLower.includes(indirectName.toLowerCase().trim()),
        );
      });

      const directNodes = allMappedNodes.filter((n) => {
        if (!n?.name) return false;
        const nodeNameLower = n.name.toLowerCase().trim();
        return directNames.some((name) =>
          nodeNameLower.includes(name.toLowerCase().trim()),
        );
      });

      columns.forEach((col) => {
        const monthNum = labelToNum[col.month];
        const combinedKey = `${col.year}-${monthNum}`;

        // Helper helper to parse standard values
        const getVal = (node) => {
          if (!node) return 0;
          const val = node.monthlyTotals?.[combinedKey] || 0;
          return Math.round((parseFloat(val) + Number.EPSILON) * 100) / 100;
        };

        const getArraySum = (nodesArray) => {
          if (!Array.isArray(nodesArray)) return 0;
          return nodesArray.reduce((sum, node) => sum + getVal(node), 0);
        };

        const getBudVal = (node) => {
          if (!node) return 0;

          if (node.name?.toLowerCase().includes("adjustment")) {
            return 0;
          }

          // 1. Corrected case-sensitivity to "revenue" (lowercase)
          // 2. Added a check to see if the node matches the root revenueNode itself
          const isRev =
            node.name?.toLowerCase() === "revenue" ||
            node.id === revenueNode?.id ||
            (revenueNode && revenueNode.children.some((c) => c.id === node.id));

          // 3. Fall back to budgetMonthlyTotals for ALL non-revenue/expense nodes!
          const val = isRev
            ? node.budgetRevenueTotals?.[combinedKey] ||
              node.budgetMonthlyTotals?.[combinedKey] ||
              0
            : node.budgetMonthlyTotals?.[combinedKey] || 0;

          return Math.round((parseFloat(val) + Number.EPSILON) * 100) / 100;
        };

        const getBudArraySum = (nodesArray) => {
          if (!Array.isArray(nodesArray)) return 0;
          return nodesArray.reduce((sum, node) => sum + getBudVal(node), 0);
        };

        // 💡 Updated to fallback safely to budgetRevenueTotals if tracking a revenue child
        // const getBudVal = (node) => {
        //   if (!node) return 0;
        //   const isRev =
        //     node.name?.toLowerCase() === "Revenue" &&
        //     // Check if its parent configuration maps it into the revenue list framework
        //     revenueNode &&
        //     revenueNode.children.some((c) => c.id === node.id);

        //   const val = isRev
        //     ? node.budgetRevenueTotals?.[combinedKey] ||
        //       node.budgetMonthlyTotals?.[combinedKey] ||
        //       0
        //     : node.revenueTotals?.[combinedKey] || 0;
        //   return Math.round((parseFloat(val) + Number.EPSILON) * 100) / 100;
        // };

        // Recalculating totals for Unallowable expenses
        if (unallowableNode) {
          const childTotal = (unallowableNode.children || []).reduce(
            (sum, child) => sum + getVal(child),
            0,
          );
          unallowableNode.monthlyTotals[combinedKey] =
            Math.round((childTotal + Number.EPSILON) * 100) / 100;

          // Budget calculation path:
          const childBudTotal = (unallowableNode.children || []).reduce(
            (sum, child) => sum + getBudVal(child),
            0,
          );
          unallowableNode.budgetMonthlyTotals[combinedKey] =
            Math.round((childBudTotal + Number.EPSILON) * 100) / 100;
        }

        // Extract Standard Node values
        const rawRevenue = getVal(revenueNode);
        const adjustment = getVal(revenueAdjNode);
        // const laborVal = getVal(directLaborNode);
        const laborVal = getArraySum(directNodes);
        const nonLaborVal = getVal(directNonLaborNode);

        // Extract Budget Node values
        const rawRevenueBud = getBudVal(revenueNode);
        const adjustmentBud = getBudVal(revenueAdjNode);
        // const laborValBud = getBudVal(directLaborNode);
        const laborValBud = getBudArraySum(directNodes);
        const nonLaborValBud = getBudVal(directNonLaborNode);

        // --- STANDARD LINE SUMMARY CALCULATION ---
        // const baseRevenue =
        //   Math.round((rawRevenue - adjustment + Number.EPSILON) * 100) / 100;
        // if (revenueNode) revenueNode.monthlyTotals[combinedKey] = baseRevenue;

        // const revTotal =
        //   Math.round((baseRevenue + adjustment + Number.EPSILON) * 100) / 100;
        // revenueTotalNode.monthlyTotals[combinedKey] = revTotal;

        // const grossProfit =
        //   Math.round(
        //     (revTotal - (laborVal + nonLaborVal) + Number.EPSILON) * 100,
        //   ) / 100;
        // profitNode.monthlyTotals[combinedKey] = grossProfit;

        // const totalIndirect = indirectNodes.reduce(
        //   (sum, node) => sum + getVal(node),
        //   0,
        // );
        // netProfitNode.monthlyTotals[combinedKey] =
        //   Math.round((grossProfit - totalIndirect + Number.EPSILON) * 100) /
        //   100;

        // // --- BUDGET LINE SUMMARY CALCULATION ---
        // const baseRevenueBud =
        //   Math.round((rawRevenueBud - adjustmentBud + Number.EPSILON) * 100) /
        //   100;
        // if (revenueNode)
        //   revenueNode.budgetMonthlyTotals[combinedKey] = baseRevenueBud;

        // const revTotalBud =
        //   Math.round((baseRevenueBud + adjustmentBud + Number.EPSILON) * 100) /
        //   100;
        // revenueTotalNode.budgetMonthlyTotals[combinedKey] = revTotalBud;

        // const grossProfitBud =
        //   Math.round(
        //     (revTotalBud - (laborValBud + nonLaborValBud) + Number.EPSILON) *
        //       100,
        //   ) / 100;
        // profitNode.budgetMonthlyTotals[combinedKey] = grossProfitBud;

        // const totalIndirectBud = indirectNodes.reduce(
        //   (sum, node) => sum + getBudVal(node),
        //   0,
        // );
        // netProfitNode.budgetMonthlyTotals[combinedKey] =
        //   Math.round(
        //     (grossProfitBud - totalIndirectBud + Number.EPSILON) * 100,
        //   ) / 100;

        // --- STANDARD LINE SUMMARY CALCULATION ---
        const baseRevenue = round2(rawRevenue - adjustment);
        if (revenueNode) revenueNode.monthlyTotals[combinedKey] = baseRevenue;

        const revTotal = round2(baseRevenue + adjustment);
        revenueTotalNode.monthlyTotals[combinedKey] = revTotal;

        // FIXED: Corrected Math.round parenthesis to prevent rounding bugs
        const grossProfit = round2(revTotal - (laborVal + nonLaborVal));
        profitNode.monthlyTotals[combinedKey] = grossProfit;

        const totalIndirect = round2(getArraySum(indirectNodes));
        netProfitNode.monthlyTotals[combinedKey] = round2(
          grossProfit - totalIndirect,
        );

        // --- BUDGET LINE SUMMARY CALCULATION ---
        const baseRevenueBud = round2(rawRevenueBud - adjustmentBud);
        if (revenueNode)
          revenueNode.budgetMonthlyTotals[combinedKey] = baseRevenueBud;

        const revTotalBud = round2(baseRevenueBud + adjustmentBud);
        revenueTotalNode.budgetMonthlyTotals[combinedKey] = revTotalBud;

        // FIXED: Corrected Math.round parenthesis for budget calculation
        const grossProfitBud = round2(
          revTotalBud - (laborValBud + nonLaborValBud),
        );
        profitNode.budgetMonthlyTotals[combinedKey] = grossProfitBud;

        const totalIndirectBud = round2(getBudArraySum(indirectNodes));
        netProfitNode.budgetMonthlyTotals[combinedKey] = round2(
          grossProfitBud - totalIndirectBud,
        );
      });

      const combinedList = [
        ...allMappedNodes,
        revenueTotalNode,
        profitNode,
        netProfitNode,
      ];

      const getSortIndex = (nodeName) => {
        if (!nodeName) return -1;
        const cleanName = nodeName.toString().trim().toLowerCase();
        return sortOrder.findIndex((orderName) => {
          const cleanOrderName = orderName.trim().toLowerCase();
          if (cleanOrderName === "revenue") return cleanName === "revenue";
          if (cleanOrderName === "revenue adjustment")
            return cleanName.includes("adjustment");
          if (cleanOrderName === "revenue total")
            return (
              cleanName.includes("rev-total") || cleanName === "revenue total"
            );
          return cleanName.includes(cleanOrderName);
        });
      };

      const finalDataList = combinedList.filter(
        (node) => getSortIndex(node.name) !== -1,
      );
      finalDataList.sort((a, b) => getSortIndex(a.name) - getSortIndex(b.name));

      setData(finalDataList);
    } catch (error) {
      console.error("Error fetching forecast:", error);
    } finally {
      setIsExporting(false);
      setLoading(false);
    }
  };

  const fetchProjConfig = async () => {
    const configRes = await axios.get(
      `${backendUrl}/api/Configuration/GetAllConfigValuesByProject/xxxxx`,
    );
    if (Array.isArray(configRes.data)) {
      const item = configRes.data.find((c) => c.name === "closing_period");
      if (item?.value) {
        const [y, mo, d] = item.value.split("-").map(Number);
        setClosingPeriodDate(new Date(y, mo - 1, d));
      }
    }
  };

  useEffect(() => {
    if (summaryLoading) {
      return;
    }
    fetchForecast();
    fetchProjConfig();
  }, [summaryLoading]);

  // const exportToExcel = async () => {
  //   setIsExporting(true);

  //   try {
  //     // 1. Initialize an ExcelJS Workbook & Worksheet
  //     const workbook = new ExcelJS.Workbook();
  //     const worksheet = workbook.addWorksheet("Financial Report");

  //     // Set up base grid properties
  //     worksheet.views = [{ showGridLines: true }];

  //     // 2. Define Columns Configuration (Triple-Column Strategy)
  //     const dynamicCols = [];
  //     columns.forEach((col, idx) => {
  //       dynamicCols.push(
  //         {
  //           header: `${col.year}-${col.month} Budget`,
  //           key: `col_${idx}_budget`,
  //           width: 14,
  //           style: { numFmt: '$#,##0.00;($#,##0.00);"-"' },
  //         },
  //         {
  //           header: `${col.year}-${col.month} Actual`,
  //           key: `col_${idx}_actual`,
  //           width: 14,
  //           style: { numFmt: '$#,##0.00;($#,##0.00);"-"' },
  //         },
  //         {
  //           header: `${col.year}-${col.month} Variance`,
  //           key: `col_${idx}_variance`,
  //           width: 14,
  //           style: { numFmt: '$#,##0.00;($#,##0.00);"-"' },
  //         },
  //       );
  //     });

  //     worksheet.columns = [
  //       { header: "ID", key: "id", width: 16 },
  //       { header: "Description", key: "description", width: 45 },
  //       ...dynamicCols,
  //     ];

  //     // 3. Construct and Style Structured Dynamic Multi-Level Headers
  //     // Insert standard rows for months subheaders
  //     worksheet.spliceRows(1, 0, [], []);

  //     const row1 = worksheet.getRow(1);
  //     const row2 = worksheet.getRow(2);

  //     row1.height = 24;
  //     row2.height = 20;

  //     row1.getCell(1).value = "Description / Resource";
  //     worksheet.mergeCells(1, 1, 2, 2); // Merge Description over ID and Description areas

  //     columns.forEach((col, idx) => {
  //       const startColIdx = 3 + idx * 3;

  //       // Month group header
  //       worksheet.mergeCells(1, startColIdx, 1, startColIdx + 2);
  //       const monthCell = row1.getCell(startColIdx);
  //       monthCell.value = `${col.year} - ${col.month}`;
  //       monthCell.alignment = { horizontal: "center", vertical: "middle" };

  //       // Subheaders definition
  //       row2.getCell(startColIdx).value = "Budget";
  //       row2.getCell(startColIdx + 1).value = "Actual";
  //       row2.getCell(startColIdx + 2).value = "Variance";
  //     });

  //     // Style Header Rows (1 & 2)
  //     [row1, row2].forEach((row, rIdx) => {
  //       row.eachCell((cell) => {
  //         cell.font = {
  //           name: "Arial",
  //           size: 10,
  //           bold: true,
  //           color: { argb: "FFFFFF" },
  //         };
  //         cell.fill = {
  //           type: "pattern",
  //           pattern: "solid",
  //           fgColor: { argb: rIdx === 0 ? "1E293B" : "334155" },
  //         };
  //         cell.alignment = cell.alignment || {
  //           vertical: "middle",
  //           horizontal: "center",
  //         };
  //       });
  //     });

  //     // 4. Resolve Target Level Depths
  //     let targetDepth = 0;
  //     switch (selectedLevel) {
  //       case "account":
  //         targetDepth = 1;
  //         break;
  //       case "project":
  //         targetDepth = 2;
  //         break;
  //       case "detail":
  //         targetDepth = 3;
  //         break;
  //       case "top":
  //         targetDepth = 0;
  //         break;
  //       default:
  //         targetDepth = 0;
  //     }

  //     // 5. Flatten & Construct Nested Data Rows
  //     const flattenData = (nodes, currentDepth = 0) => {
  //       nodes.forEach((node) => {
  //         const indentSpace = "    ".repeat(currentDepth);
  //         const rowData = {
  //           id: node.id,
  //           description: indentSpace + node.name,
  //         };

  //         const isRevenueNode = node.isRevenue === true;

  //         // Populate metrics matching UI data lookup mapping loops
  //         columns.forEach((col, idx) => {
  //           const monthNum = labelToNum[col.month];
  //           const combinedKey = `${col.year}-${monthNum}`;

  //           // 1. Budget Values Lookup
  //           let budgetVal = 0;
  //           if (
  //             isRevenueNode &&
  //             node.budgetRevenueTotals?.[combinedKey] !== undefined
  //           ) {
  //             budgetVal = parseFloat(node.budgetRevenueTotals[combinedKey]);
  //           } else if (node.budgetMonthlyTotals?.[combinedKey] !== undefined) {
  //             budgetVal = parseFloat(node.budgetMonthlyTotals[combinedKey]);
  //           }
  //           const finalBudgetValue = isNaN(budgetVal) ? 0 : budgetVal;

  //           // 2. Live/Actual Values Lookup
  //           let liveVal = 0;
  //           if (
  //             isRevenueNode &&
  //             node.revenueTotals?.[combinedKey] !== undefined
  //           ) {
  //             liveVal = parseFloat(node.revenueTotals[combinedKey]);
  //           } else if (node.monthlyTotals?.[combinedKey] !== undefined) {
  //             liveVal = parseFloat(node.monthlyTotals[combinedKey]);
  //           }
  //           const finalLiveValue = isNaN(liveVal) ? 0 : liveVal;

  //           // 3. Variance Calculation
  //           const varianceValue = finalBudgetValue - finalLiveValue;

  //           // Assign values back to custom keys mapping structure
  //           rowData[`col_${idx}_budget`] = finalBudgetValue;
  //           rowData[`col_${idx}_actual`] = finalLiveValue;
  //           rowData[`col_${idx}_variance`] = varianceValue;
  //         });

  //         const newRow = worksheet.addRow(rowData);
  //         newRow.height = 22;

  //         // 6. Contextual Node Styling Rules (Bold weights and background tints)
  //         const isSummaryBlock =
  //           node.id === "REV-TOTAL" ||
  //           node.id === "PL-Summary" ||
  //           node.id === "Net PL-Summary";

  //         newRow.eachCell((cell, colNumber) => {
  //           if (currentDepth === 0 || isSummaryBlock) {
  //             cell.font = { name: "Arial", size: 10, bold: true };
  //             if (isSummaryBlock) {
  //               cell.border = {
  //                 top: { style: "thin", color: { argb: "94A3B8" } },
  //                 bottom: { style: "double", color: { argb: "334155" } },
  //               };
  //               cell.fill = {
  //                 type: "pattern",
  //                 pattern: "solid",
  //                 fgColor: { argb: "F0FDF4" },
  //               }; // Light Green summary
  //             } else {
  //               cell.fill = {
  //                 type: "pattern",
  //                 pattern: "solid",
  //                 fgColor: { argb: "F8FAFC" },
  //               };
  //             }
  //           } else {
  //             cell.font = { name: "Arial", size: 10, bold: false };
  //           }

  //           // Right-align all data value metrics columns
  //           if (colNumber > 2) {
  //             cell.alignment = { vertical: "middle", horizontal: "right" };
  //           } else {
  //             cell.alignment = { vertical: "middle", horizontal: "left" };
  //           }
  //         });

  //         // 7. Core Filtering Conditions Fix
  //         const isRevenue =
  //           node.name?.toLowerCase().includes("revenue") ||
  //           node.id === "REV-TOTAL";

  //         if (selectedLevel === "account" && isRevenue) {
  //           return;
  //         }

  //         if (
  //           currentDepth < targetDepth &&
  //           node.children &&
  //           node.children.length > 0
  //         ) {
  //           flattenData(node.children, currentDepth + 1);
  //         }
  //       });
  //     };

  //     flattenData(data);

  //     // 8. Generate File Payload Blob and Trigger Client Download
  //     const buffer = await workbook.xlsx.writeBuffer();
  //     const fileName = `Financial_Report_${selectedLevel}_${selectedYear}_${new Date().toISOString().split("T")[0]}.xlsx`;

  //     saveAs(
  //       new Blob([buffer], {
  //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //       }),
  //       fileName,
  //     );
  //   } catch (error) {
  //     console.error("Export operation failed:", error);
  //   } finally {
  //     setIsExporting(false);
  //   }
  // };

  const exportToExcel = async () => {
    setIsExporting(true);

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Financial Report");

      worksheet.views = [{ showGridLines: true }];

      // 1. Generate standard flat keys configuration first
      const dynamicCols = [];
      columns.forEach((col, idx) => {
        dynamicCols.push(
          {
            header: `${col.year}-${col.month} Budget`,
            key: `col_${idx}_budget`,
            width: 14,
            style: { numFmt: '$#,##0.00;($#,##0.00);"-"' },
          },
          {
            header: `${col.year}-${col.month} Actual`,
            key: `col_${idx}_actual`,
            width: 14,
            style: { numFmt: '$#,##0.00;($#,##0.00);"-"' },
          },
          {
            header: `${col.year}-${col.month} Variance`,
            key: `col_${idx}_variance`,
            width: 14,
            style: { numFmt: '$#,##0.00;($#,##0.00);"-"' },
          },
        );
      });

      worksheet.columns = [
        { header: "ID", key: "id", width: 16 },
        { header: "Description", key: "description", width: 45 },
        ...dynamicCols,
      ];

      // 2. Resolve Target Level Depths
      let targetDepth = 0;
      switch (selectedLevel) {
        case "account":
          targetDepth = 1;
          break;
        case "project":
          targetDepth = 2;
          break;
        case "detail":
          targetDepth = 3;
          break;
        case "top":
          targetDepth = 0;
          break;
        default:
          targetDepth = 0;
      }

      // 3. Flatten & Populate Data Rows directly
      const flattenData = (nodes, currentDepth = 0) => {
        nodes.forEach((node) => {
          const indentSpace = "    ".repeat(currentDepth);
          const rowData = {
            id: node.id,
            description: indentSpace + node.name,
          };

          const isRevenueNode = node.isRevenue === true;

          columns.forEach((col, idx) => {
            const monthNum = labelToNum[col.month];
            const combinedKey = `${col.year}-${monthNum}`;

            // Budget Values Lookup
            let budgetVal = 0;
            if (
              isRevenueNode &&
              node.budgetRevenueTotals?.[combinedKey] !== undefined
            ) {
              budgetVal = parseFloat(node.budgetRevenueTotals[combinedKey]);
            } else if (node.budgetMonthlyTotals?.[combinedKey] !== undefined) {
              budgetVal = parseFloat(node.budgetMonthlyTotals[combinedKey]);
            }
            const finalBudgetValue = isNaN(budgetVal) ? 0 : budgetVal;

            // Live/Actual Values Lookup
            let liveVal = 0;
            if (
              isRevenueNode &&
              node.revenueTotals?.[combinedKey] !== undefined
            ) {
              liveVal = parseFloat(node.revenueTotals[combinedKey]);
            } else if (node.monthlyTotals?.[combinedKey] !== undefined) {
              liveVal = parseFloat(node.monthlyTotals[combinedKey]);
            }
            const finalLiveValue = isNaN(liveVal) ? 0 : liveVal;

            // Variance Calculation
            const varianceValue = finalBudgetValue - finalLiveValue;

            rowData[`col_${idx}_budget`] = finalBudgetValue;
            rowData[`col_${idx}_actual`] = finalLiveValue;
            rowData[`col_${idx}_variance`] = varianceValue;
          });

          const newRow = worksheet.addRow(rowData);
          newRow.height = 22;

          const isSummaryBlock =
            node.id === "REV-TOTAL" ||
            node.id === "PL-Summary" ||
            node.id === "Net PL-Summary";

          newRow.eachCell((cell, colNumber) => {
            if (currentDepth === 0 || isSummaryBlock) {
              cell.font = { name: "Arial", size: 10, bold: true };
              if (isSummaryBlock) {
                cell.border = {
                  top: { style: "thin", color: { argb: "94A3B8" } },
                  bottom: { style: "double", color: { argb: "334155" } },
                };
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "F0FDF4" },
                };
              } else {
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "F8FAFC" },
                };
              }
            } else {
              cell.font = { name: "Arial", size: 10, bold: false };
            }

            if (colNumber > 2) {
              cell.alignment = { vertical: "middle", horizontal: "right" };
            } else {
              cell.alignment = { vertical: "middle", horizontal: "left" };
            }
          });

          const isRevenue =
            node.name?.toLowerCase().includes("revenue") ||
            node.id === "REV-TOTAL";

          if (selectedLevel === "account" && isRevenue) {
            return;
          }

          if (
            currentDepth < targetDepth &&
            node.children &&
            node.children.length > 0
          ) {
            flattenData(node.children, currentDepth + 1);
          }
        });
      };

      flattenData(data);

      // 4. Overwrite and reconstruct Row 1 & 2 for Multi-level Headers explicitly
      worksheet.insertRow(1, []);
      worksheet.insertRow(2, []);

      const row1 = worksheet.getRow(1);
      const row2 = worksheet.getRow(2);

      row1.height = 24;
      row2.height = 20;

      // Merge ID & Description areas nicely
      worksheet.mergeCells("A1:B2");
      row1.getCell(1).value = "Description / Resource";

      // Set Up Month Headers & Subheaders
      columns.forEach((col, idx) => {
        const startColIdx = 3 + idx * 3;

        // Group Months
        worksheet.mergeCells(1, startColIdx, 1, startColIdx + 2);
        const monthCell = row1.getCell(startColIdx);
        monthCell.value = `${col.year} - ${col.month}`;

        // Labels allocation
        row2.getCell(startColIdx).value = "Budget";
        row2.getCell(startColIdx + 1).value = "Actual";
        row2.getCell(startColIdx + 2).value = "Variance";
      });

      // Style both custom top header rows
      [row1, row2].forEach((row, rIdx) => {
        row.eachCell((cell) => {
          cell.font = {
            name: "Arial",
            size: 10,
            bold: true,
            color: { argb: "FFFFFF" },
          };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: rIdx === 0 ? "1E293B" : "334155" },
          };
          cell.alignment = { vertical: "middle", horizontal: "center" };
        });
      });

      // REMOVE THE AUTO-GENERATED UNSTYLLED COLS ROW (Row 3 now)
      // worksheet.getRow(3).remove();
      worksheet.spliceRows(3, 1);
      // 5. Generate and Download
      const buffer = await workbook.xlsx.writeBuffer();
      const fileName = `Financial_Report_${selectedLevel}_${selectedYear}_${new Date().toISOString().split("T")[0]}.xlsx`;

      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        fileName,
      );
    } catch (error) {
      console.error("Export operation failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const getCellValue = (node, yearKey, monthLabel, monthNum, combinedKey) => {
    if (!node) return 0;
    const yearData = node?.data?.[yearKey];
    if (yearData) {
      if (yearData[monthNum] !== undefined) return yearData[monthNum];
      if (yearData[monthLabel] !== undefined) return yearData[monthLabel];
      if (yearData[combinedKey] !== undefined) return yearData[combinedKey];
    }

    if (node.data && typeof node.data === "object") {
      if (node.data[combinedKey] !== undefined) return node.data[combinedKey];
      if (node.data[`${yearKey}-${monthLabel}`] !== undefined)
        return node.data[`${yearKey}-${monthLabel}`];
    }

    if (node.monthlyTotals) {
      if (node.monthlyTotals[combinedKey] !== undefined)
        return node.monthlyTotals[combinedKey];
      if (node.monthlyTotals[`${yearKey}-${monthLabel}`] !== undefined)
        return node.monthlyTotals[`${yearKey}-${monthLabel}`];
    }

    if (node.revenueTotals) {
      if (node.revenueTotals[combinedKey] !== undefined)
        return node.revenueTotals[combinedKey];
      if (node.revenueTotals[`${yearKey}-${monthLabel}`] !== undefined)
        return node.revenueTotals[`${yearKey}-${monthLabel}`];
    }

    return undefined;
  };

  const getAllIds = (nodes, parentKey = "") => {
    let ids = [];
    nodes.forEach((node) => {
      const hierarchicalKey = buildHierarchicalKey(parentKey, node.id);
      if (node.children && node.children.length > 0) {
        ids.push(hierarchicalKey);
        ids = [...ids, ...getAllIds(node.children, hierarchicalKey)];
      }
    });
    return ids;
  };

  const toggleAll = (shouldExpand) => {
    if (shouldExpand) {
      const allIds = getAllIds(data);
      const newExpanded = {};
      allIds.forEach((id) => (newExpanded[id] = true));
      setExpandedRows(newExpanded);
    } else {
      setExpandedRows({});
    }
  };

  const isAnyExpanded = Object.values(expandedRows).some((val) => val === true);
  const toggleRow = (id) =>
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));

  const renderRows = (nodes, depth = 0, parentKey = "") => {
    return nodes.map((node) => {
      const hierarchicalKey = buildHierarchicalKey(parentKey, node.id);
      const isExpanded = expandedRows[hierarchicalKey];
      const hasChildren = node.children && node.children.length > 0;
      const isProfitRow =
        node.id === "PL-Summary" || node.id === "Net PL-Summary";

      return (
        <React.Fragment key={hierarchicalKey}>
          <tr
            className={`border-b border-gray-200 transition-colors ${
              depth === 0 ? "bg-slate-50 font-bold" : "bg-white"
            } ${isProfitRow ? "bg-green-50/50" : ""} hover:bg-gray-100`}
          >
            {/* STICKY DESCRIPTION COLUMN */}
            <td
              className={`sticky left-0 z-20 bg-inherit border-r border-gray-300 px-4 py-3 min-w-[280px] max-w-[280px] ${
                isProfitRow ? "text-green-800 font-black" : ""
              }`}
              style={{ paddingLeft: `${depth * 20 + 16}px` }}
            >
              <div className="flex items-center gap-2">
                {hasChildren ? (
                  <button onClick={() => toggleRow(hierarchicalKey)}>
                    {isExpanded ? (
                      <MinusSquare size={16} className="text-blue-600" />
                    ) : (
                      <PlusSquare size={16} className="text-gray-400" />
                    )}
                  </button>
                ) : (
                  <div className="w-4" />
                )}
                <div className="flex flex-col truncate">
                  <span className="text-[10px] text-gray-500 font-mono leading-none">
                    {node.id}
                  </span>
                  <span className="text-sm text-slate-800 font-semibold truncate">
                    {node.name}
                  </span>
                </div>
              </div>
            </td>

            {/* TRIPLE DATA CELLS GENERATION */}
            {columns.map((col, idx) => {
              const isPastClosingPeriod =
                idx >= (closingPeriodDate?.month || 5);

              // 💡 If View Mode is set to "Actual", hide the visual data cell entirely for forecast periods
              if (viewMode === "Actual" && isPastClosingPeriod) {
                return null;
              }
              const yearKey = col.year;
              const monthLabel = col.month;
              const monthNum = labelToNum[monthLabel];
              const combinedKey = `${yearKey}-${monthNum}`;

              const isRevenueNode = node.isRevenue === true;

              console.log(isRevenueNode);

              // 2️⃣ BASELINE BUDGET VALUE RETRIEVAL
              let budgetVal = 0;

              const isAdjustmentNode = node.name
                ?.toLowerCase()
                .includes("adjustment");

              if (isAdjustmentNode) {
                budgetVal = 0;
              } else if (
                node.budgetMonthlyTotals?.[combinedKey] !== undefined
              ) {
                budgetVal = parseFloat(node.budgetMonthlyTotals[combinedKey]);
              } else if (
                isRevenueNode &&
                node.budgetRevenueTotals?.[combinedKey] !== undefined
              ) {
                budgetVal = parseFloat(node.budgetRevenueTotals[combinedKey]);
              }
              const finalBudgetValue = isNaN(budgetVal) ? 0 : budgetVal;

              // 3️⃣ ACTUAL / FORECAST LIVE VALUE RETRIEVAL
              let liveVal = 0;
              if (node.monthlyTotals?.[combinedKey] !== undefined) {
                liveVal = parseFloat(node.monthlyTotals[combinedKey]);
              } else if (
                isRevenueNode &&
                node.revenueTotals?.[combinedKey] !== undefined
              ) {
                liveVal = parseFloat(node.revenueTotals[combinedKey]);
              }
              const finalLiveValue = isNaN(liveVal) ? 0 : liveVal;

              // 4️⃣ VARIANCE CALCULATION (Budget - Actuals)
              const varianceValue = finalBudgetValue - finalLiveValue;

              // Revenue evaluation check for empty rows filtering
              const revenueNode = data.find(
                (n) => n.name?.toLowerCase() === "revenue",
              );
              const currentMonthRevenue = revenueNode
                ? parseFloat(revenueNode.monthlyTotals?.[combinedKey]) || 0
                : 0;

              // Standard Currency Formatting Helper
              const formatCell = (val) => {
                // if (isProfitRow && currentMonthRevenue === 0)
                //   return <span className="text-gray-400">-</span>;
                if (val === 0) return "-";
                return new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(val);
              };

              // Dynamic Styling Logic for Profit row targets
              const getProfitClass = (val) => {
                if (!isProfitRow) return "text-gray-600";
                if (val < 0) return "text-red-500 font-bold";
                if (val > 0) return "text-green-500 font-bold";
                return "text-gray-600";
              };

              // Dynamic Styling Logic for Variance
              const getVarianceClass = (val) => {
                if (val < 0) return "text-red-500 font-medium bg-red-50/10";
                if (val > 0) return "text-green-600 font-medium bg-green-50/10";
                return "text-gray-400";
              };

              return (
                <React.Fragment key={`cells-${combinedKey}-${idx}`}>
                  {/* SUB-COLUMN 1: BUDGET CELLS */}
                  <td className="text-right border-r border-gray-100 min-w-[100px] py-2 px-2 text-xs font-mono text-amber-900/70 bg-amber-50/5">
                    {formatCell(finalBudgetValue)}
                  </td>

                  {/* SUB-COLUMN 2: ACTUAL / FORECAST CELLS */}
                  <td
                    className={`text-right border-r border-gray-100 min-w-[100px] py-2 px-2 text-xs font-mono ${getProfitClass(
                      finalLiveValue,
                    )}`}
                  >
                    {formatCell(finalLiveValue)}
                  </td>

                  {/* ${getVarianceClass(
                      varianceValue,
                    )} */}

                  {/* SUB-COLUMN 3: VARIANCE CELLS (Budget - Actuals) */}
                  <td
                    className={`text-right border-r border-gray-200 min-w-[100px] py-2 px-2 text-xs font-mono
                      text-amber-900/70 bg-amber-50/5
                    `}
                  >
                    {formatCell(varianceValue)}
                  </td>
                </React.Fragment>
              );
            })}
          </tr>
          {isExpanded &&
            hasChildren &&
            renderRows(node.children, depth + 1, hierarchicalKey)}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="w-full">
      <div className="p-4 w-full flex flex-wrap lg:flex-nowrap items-center justify-between rounded-sm bg-white shadow-sm overflow-x-auto">
        <div className="flex items-center gap-3 shrink-0">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 whitespace-nowrap">
            <BarChart3 size={20} className="text-blue-500" /> Active Reports
          </h2>
          {cachedAge && (
            <span className="text-xs text-slate-400 font-medium pt-1 whitespace-nowrap">
              Last Refreshed: {cachedAge}
            </span>
          )}

          <button
            onClick={() => fetchSummaryData(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={summaryLoading}
          >
            <RefreshCcw
              size={12}
              className={summaryLoading ? "animate-spin text-blue-600" : ""}
            />
          </button>
        </div>
        <div className="pl-2 flex items-center gap-3 flex-wrap sm:flex-nowrap shrink-0">
          <button
            onClick={onHideVariance}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-600 hover:bg-slate-700 rounded shadow-sm transition-all duration-150 whitespace-nowrap shrink-0"
          >
            Hide Variance
          </button>
          <label
            htmlFor="view-mode-select"
            className="text-sm font-semibold text-slate-700 whitspace-nowrap shrink-0"
          >
            View Mode:
          </label>
          <select
            id="view-mode-select"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 whitespace-nowrap shrink-0"
          >
            <option value="EAC">EAC (Actual + Forecast)</option>
            <option value="Actual">Actual Only</option>
          </select>
          <button
            onClick={() => toggleAll(!isAnyExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-all shadow-sm whitespace-nowrap shrink-0"
          >
            {isAnyExpanded ? (
              <>
                <ChevronsUp size={14} /> Collapse All
              </>
            ) : (
              <>
                <ChevronsDown size={14} /> Expand All
              </>
            )}
          </button>
          {/* <button
            onClick={() => fetchSummaryData(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={summaryLoading}
          >
            <RefreshCcw
              size={14}
              className={summaryLoading ? "animate-spin text-blue-600" : ""}
            />
            {summaryLoading ? "Refreshing..." : "Refresh"}
          </button> */}
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-all shadow-sm whitespace-nowrap shrink-0"
            disabled={isExporting}
          >
            <Download size={14} /> Export Excel
          </button>
          <button
            onClick={exportUnifiedPlanDetails}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-all shadow-sm whitespace-nowrap shrink-0"
            disabled={isExporting}
          >
            <FileSpreadsheet size={14} />{" "}
            {isExporting ? "Exporting..." : "Full Data Export"}
          </button>
          <div className="flex items-center gap-2 border rounded-md px-3 py-1 bg-gray-50 border-gray-300">
            <Calendar size={14} className="text-blue-500" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-sm font-medium outline-none cursor-pointer whitespace-nowrap"
            >
              <option value="All">All Years</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 border rounded-md px-2 py-1 bg-gray-50 border-gray-300 shrink-0">
            <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
              View:
            </span>
            <select
              value={selectedLevel}
              onChange={(e) => handleLevelChange(e.target.value)}
              className="bg-transparent text-xs outline-none cursor-pointer whitespace-nowrap"
            >
              <option value="top">Top Level</option>
              <option value="account">Account Level</option>
              <option value="project">Project Level</option>
              <option value="detail">Detail Level</option>
            </select>
          </div>
        </div>
      </div>
      <div className="mt-2 overflow-x-auto overflow-y-auto max-h-[calc(100vh-140px)]">
        <table className="table-auto w-full border-collapse">
          {/* <thead className="sticky top-0 z-40">
            <tr className="bg-slate-100">
              <th className="sticky left-0 top-0 z-50 bg-slate-100 border-r border-b border-gray-300 px-4 py-4 text-left text-xs font-bold text-slate-700 min-w-[400px]">
                Description / Resource
              </th>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="border-r border-b border-gray-200 px-2 py-2 min-w-[85px] bg-slate-50"
                >
                  <div className="text-[10px] text-gray-500 font-normal">
                    {col.year}
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    {col.month}
                  </div>
                </th>
              ))}
            </tr>
          </thead> */}

          <thead className="sticky top-0 z-40">
            {/* TOP LEVEL HEADER: Months with ColSpan=2 */}
            <tr className="bg-slate-100">
              <th
                rowSpan={2}
                className="sticky left-0 top-0 z-50 bg-slate-100 border-r border-b border-gray-300 px-4 py-4 text-left text-xs font-bold text-slate-700 min-w-[400px]"
              >
                Description / Resource
              </th>
              {columns.map((col, idx) => {
                const isPastClosingPeriod =
                  idx >= (closingPeriodDate?.month || 5);

                // 💡 IF viewMode is "Actual" AND this month is in the future/forecast period, don't show the header
                if (viewMode === "Actual" && isPastClosingPeriod) {
                  return null;
                }
                return (
                  <th
                    key={`month-${idx}`}
                    colSpan={3}
                    className="border-r border-b border-gray-200 px-2 py-2 min-w-[170px] bg-slate-50 text-center"
                  >
                    <div className="text-[10px] text-gray-500 font-normal">
                      {col.year}
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      {col.month}
                    </div>
                  </th>
                );
              })}
            </tr>

            {/* SUB HEADER: Budgeted vs Actual/Forecast Split */}
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-600">
              {columns.map((col, idx) => {
                // 💡 Check if the loop's current column index is beyond the closing period month threshold
                // (Replace `closingPeriodMonthIndex` with your actual state or variable tracking the closed month index)
                const isPastClosingPeriod =
                  idx >= (closingPeriodDate?.month || 5);

                // 💡 If viewMode is "Actual" and we are past the closed period, skip rendering subheaders
                if (viewMode === "Actual" && isPastClosingPeriod) {
                  return null;
                }

                return (
                  <React.Fragment key={`sub-${idx}`}>
                    <th className="border-r border-b border-gray-200 px-1 py-1 text-center bg-amber-50/40 text-amber-800">
                      Budget
                    </th>
                    <th
                      className={`border-r border-b border-gray-200 px-1 py-1 text-center ${isPastClosingPeriod ? "bg-indigo-50/40 text-indigo-800" : "bg-emerald-50/40 text-emerald-800"}`}
                    >
                      {isPastClosingPeriod ? "Forecast" : "Actual"}
                    </th>
                    <th className="border-r border-b border-gray-200 px-1 py-1 text-center text-gray-800">
                      Variance
                    </th>
                  </React.Fragment>
                );
              })}
            </tr>
          </thead>
          <tbody className="tbody">
            {loading || summaryLoading ? (
              <tr>
                {/* <td colSpan={columns.length + 1} className="py-10"> */}
                <td
                  // colSpan={columns.length + columns.length + columns.length + 1}
                  colSpan={
                    // Dynamic colspan helper to match our header length changes
                    columns.filter((_, idx) => {
                      const isPastClosing =
                        idx >= (closingPeriodDate?.month || 5);
                      return !(viewMode === "Actual" && isPastClosing);
                    }).length *
                      3 +
                    1
                  }
                  className="py-10"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 mt-4 text-sm text-gray-500 font-medium">
                      Loading...
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              renderRows(data)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportingScreen;
