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

const ActiveReport = ({
  onShowVariance,
  summaryData,
  summaryLoading,
  cachedAge,
  fetchSummaryData,
  closingPeriod,
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

  // Helper function to build hierarchical expansion key
  const buildHierarchicalKey = (parentKey, nodeId) => {
    return parentKey ? `${parentKey}-${nodeId}` : nodeId;
  };

  // --- Export Filter Dialog States ---
  // --- Export Filter Dialog States (Updated to Month + Year) ---
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  const [exportStartMonthYear, setExportStartMonthYear] = useState(
    `${currentYear}-${currentMonth}`,
  );
  const [exportEndMonthYear, setExportEndMonthYear] = useState(
    `${currentYear}-${currentMonth}`,
  );
  const [exportAllDataFlag, setExportAllDataFlag] = useState(false);

  // Project Selection States
  const [availableProjects, setAvailableProjects] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set()); // composite keys, not raw plId
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Composite identity: guards against duplicate/undefined plId values
  const getProjectKey = (p) =>
    `${p.projId ?? ""}||${p.plType ?? ""}||${p.version ?? ""}||${p.plId ?? ""}`;

  const fetchExportProjectsList = async () => {
    try {
      setIsLoadingProjects(true);
      const response = await axios.get(`${backendUrl}/Project/GetAllPlans`);
      const rawProjects = response.data || [];

      const projects = rawProjects.filter((p) => {
        const validPlTypes = ["BUD", "NBBUD", "EAC"];
        if (!validPlTypes.includes(p.plType?.toUpperCase())) return false;

        const validStatuses = [
          "Concluded",
          "Approved",
          "Submitted",
          "InProgress",
        ];
        return validStatuses.includes(p.status);
      });

      projects.sort((a, b) => {
        const nameA = (a.projName || a.projId || "").toString();
        const nameB = (b.projName || b.projId || "").toString();
        return nameA.localeCompare(nameB, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      });

      setAvailableProjects(projects);

      // Default: select all rows by composite key
      setSelectedKeys(new Set(projects.map(getProjectKey)));
    } catch (error) {
      console.error("Failed to load project filter list:", error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (isExportModalOpen) {
      fetchExportProjectsList();
    }
  }, [isExportModalOpen]);

  const handleToggleSingleProject = (project) => {
    const key = getProjectKey(project);
    const updated = new Set(selectedKeys);
    if (updated.has(key)) {
      updated.delete(key);
    } else {
      updated.add(key);
    }
    setSelectedKeys(updated);
  };

  const [projectSearchTerm, setProjectSearchTerm] = useState("");
  const [selectedVersionFilter, setSelectedVersionFilter] = useState("ALL");
  const [selectedPlTypeFilter, setSelectedPlTypeFilter] = useState("ALL");

  const uniqueVersions = [
    ...new Set(availableProjects.map((p) => p.version)),
  ].sort((a, b) => Number(a) - Number(b));
  const uniquePlTypes = [
    ...new Set(availableProjects.map((p) => p.plType)),
  ].filter(Boolean);

  const filteredProjects = availableProjects.filter((p) => {
    const search = projectSearchTerm.toLowerCase().trim();

    const matchesSearch =
      !search || (p.projId && p.projId.toLowerCase().startsWith(search));

    const matchesVersion =
      selectedVersionFilter === "ALL" ||
      String(p.version) === String(selectedVersionFilter);

    const currentPlType = (p.plType || "").toString().trim().toUpperCase();
    const targetPlType = (selectedPlTypeFilter || "")
      .toString()
      .trim()
      .toUpperCase();

    const matchesPlType =
      targetPlType === "ALL" || currentPlType === targetPlType;

    return matchesSearch && matchesVersion && matchesPlType;
  });
  const areAllFilteredSelected =
    filteredProjects.length > 0 &&
    filteredProjects.every((p) => selectedKeys.has(getProjectKey(p)));

  const handleToggleSelectAllProjects = (e) => {
    const checked = e.target.checked;
    const updated = new Set(selectedKeys);

    filteredProjects.forEach((p) => {
      const key = getProjectKey(p);
      if (checked) {
        updated.add(key);
      } else {
        updated.delete(key);
      }
    });

    setSelectedKeys(updated);
  };

  // Resolve composite keys back to real plIds for the export payload
  const getSelectedPlIds = () => {
    const selectedProjects = filteredProjects.filter((p) =>
      selectedKeys.has(getProjectKey(p)),
    );
    return [...new Set(selectedProjects.map((p) => p.plId))];
  };

  const exportUnifiedPlanDetails = async (options = {}) => {
    const { plIds, startYear, startMonth, endYear, endMonth, exportAll } =
      options;
    try {
      setIsExporting(true);

      const params = new URLSearchParams();
      if (exportAll) {
        params.append("exportAllData", "true");
      } else if (startYear && startMonth && endYear && endMonth) {
        params.append("startYear", startYear);
        params.append("startMonth", startMonth);
        params.append("endYear", endYear);
        params.append("endMonth", endMonth);
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";

      // Send selected project IDs array in body payload
      const response = await axios.post(
        `${backendUrl}/Forecast/ExportUnifiedPlanDetailsV2${queryString}`,
        plIds || [],
        {
          headers: { "Content-Type": "application/json" },
          responseType: "arraybuffer",
        },
      );

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(response.data);
      const worksheet = workbook.getWorksheet(1) || workbook.worksheets[0];

      worksheet.views = [{ showGridLines: true }];

      const row1 = worksheet.getRow(1);
      const row2 = worksheet.getRow(2);

      row1.height = 26;
      row2.height = 22;

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
            fgColor: { argb: "1E293B" },
          };
          cell.alignment = { vertical: "middle", horizontal: "center" };
        }
      });

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
          fgColor: { argb: "334155" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });

      for (let colIdx = 1; colIdx <= 27; colIdx++) {
        const topCell = row1.getCell(colIdx);
        const subCell = row2.getCell(colIdx);

        if (!topCell.value && subCell.value) {
          topCell.value = subCell.value;
          worksheet.mergeCells(1, colIdx, 2, colIdx);

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

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber <= 2) return;
        row.height = 20;

        row.eachCell((cell, colNumber) => {
          cell.font = cell.font || { name: "Arial", size: 10 };
          if (colNumber > 25) {
            cell.alignment = { vertical: "middle", horizontal: "right" };
            if (typeof cell.value === "number") {
              cell.numFmt = cell.numFmt || '#,##0.00;(#,##0.00);"-"';
            }
          } else {
            cell.alignment = { vertical: "middle", horizontal: "left" };
          }
        });
      });

      worksheet.columns.forEach((col) => {
        let maxLen = 12;
        col.eachCell({ includeEmpty: false }, (cell) => {
          const valStr = cell.value ? cell.value.toString() : "";
          if (valStr.length > maxLen) maxLen = valStr.length;
        });
        col.width = Math.min(Math.max(maxLen + 3, 11), 45);
      });

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
      // const isRevenue =
      //   node.name?.toLowerCase().includes("revenue") || node.id === "REV-TOTAL";
      // if (level === "account" && isRevenue) {
      //   return;
      // }

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
      //     ? await fetch(`${backendUrl}/Forecast/GetSummaryV3`)
      //     : await fetch(
      //         `${backendUrl}/Forecast/GetSummaryByUser?UserId=${userId}`,
      //       );
      // // const result = await response.json();
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

      const getTotals = (item) => {
        const isRevenue = item.name
          ?.toLowerCase()
          .includes("contracts revenue");
        return isRevenue ? item.monthlyTotals || {} : item.monthlyTotals || {};
      };

      const mapNodes = (nodes) => {
        if (!nodes) return [];
        const nodesArray = Array.isArray(nodes) ? nodes : Object.values(nodes);
        return nodesArray
          .map((item) => ({
            id: (item.id || item.code || "").toString().trim(),
            name: (item.name || item.description || "").toString().trim(),
            type: item.type,
            // monthlyTotals: getTotals(item) || {},
            monthlyTotals: item.monthlyTotals || {},
            revenueTotals: item.revenueTotals || {},
            children: mapNodes(item.children),
          }))
          .sort((a, b) => {
            return a.id.localeCompare(b.id, undefined, {
              numeric: true,
              sensitivity: "base",
            });
          });
      };

      const dataToMap = Array.isArray(result) ? result : Object.values(result);

      let allMappedNodes = dataToMap.map((item) => ({
        id: item.id || item.code,
        name: (item.name || item.description || "").trim(),
        type: item.type,
        monthlyTotals: getTotals(item),
        children: mapNodes(item.children),
      }));

      // const invertNodeValues = (node) => {
      //   if (node.monthlyTotals) {
      //     Object.keys(node.monthlyTotals).forEach((k) => {
      //       const val = node.monthlyTotals[k];
      //       if (val !== "-" && val !== undefined && val !== null) {
      //         node.monthlyTotals[k] = -parseFloat(val);
      //       }
      //     });
      //   }
      //   if (node.children && Array.isArray(node.children)) {
      //     node.children.forEach(invertNodeValues);
      //   }
      // };
      const invertNodeValues = (node) => {
        if (node.monthlyTotals) {
          Object.keys(node.monthlyTotals).forEach((k) => {
            const val = node.monthlyTotals[k];
            if (val !== "-" && val !== undefined && val !== null) {
              // Parse month key (e.g., "2026-08" or "2026-8")
              const parts = k.split("-");
              const kYear = parseInt(parts[0], 10);
              const kMonth = parseInt(parts[1], 10);

              // Check if key is AFTER closingPeriod
              let isAfterClosingPeriod = false;
              if (closingPeriod && closingPeriod.year && closingPeriod.month) {
                if (
                  kYear > closingPeriod.year ||
                  (kYear === closingPeriod.year && kMonth > closingPeriod.month)
                ) {
                  isAfterClosingPeriod = true;
                }
              }

              // Do NOT invert if the period is after closingPeriod
              if (!isAfterClosingPeriod) {
                node.monthlyTotals[k] = -parseFloat(val);
              }
            }
          });
        }
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach(invertNodeValues);
        }
      };

      allMappedNodes.forEach((n) => {
        const nameLower = (n.name || "").toLowerCase();
        const idStr = (n.id || "").toString();
        if (
          nameLower.includes("contracts revenue") ||
          idStr === "40" ||
          idStr.startsWith("40")
        ) {
          n.id = "40";
          invertNodeValues(n);
        }
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

      const revenueTotalNode = {
        id: "REV-TOTAL",
        name: "Revenue Total",
        type: "summary",
        monthlyTotals: {},
        children: [],
      };

      const profitNode = {
        id: "PL-Summary",
        name: "Gross Profit / (Loss)",
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

        const getVal = (node) => {
          if (!node) return 0;
          const val = node.monthlyTotals?.[combinedKey] || 0;
          return Math.round((parseFloat(val) + Number.EPSILON) * 100) / 100;
        };

        const getArraySum = (nodesArray) => {
          if (!Array.isArray(nodesArray)) return 0;
          return nodesArray.reduce((sum, node) => sum + getVal(node), 0);
        };

        if (unallowableNode) {
          const childTotal = (unallowableNode.children || []).reduce(
            (sum, child) => sum + getVal(child),
            0,
          );
          unallowableNode.monthlyTotals[combinedKey] =
            Math.round((childTotal + Number.EPSILON) * 100) / 100;
        }

        const rawRevenue = getVal(revenueNode);
        const adjustment = getVal(revenueAdjNode);
        // const laborVal = getVal(directNodes);
        const laborVal = getArraySum(directNodes);
        const nonLaborVal = getVal(directNonLaborNode);

        const baseRevenue =
          Math.round((rawRevenue - adjustment + Number.EPSILON) * 100) / 100;
        if (revenueNode) {
          revenueNode.monthlyTotals[combinedKey] = baseRevenue;
        }

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
        const revTotal = round2(baseRevenue + adjustment);
        if (revenueTotalNode) {
          revenueTotalNode.monthlyTotals[combinedKey] = revTotal;
        }

        // Calculate Gross Profit: Revenue - (Direct Labor + Direct Non-Labor)
        const grossProfit = round2(revTotal - (laborVal + nonLaborVal));
        profitNode.monthlyTotals[combinedKey] = grossProfit;

        // Calculate Net Profit: Gross Profit - Total Indirect Costs
        const totalIndirect = round2(getArraySum(indirectNodes));
        const netProfit = round2(grossProfit - totalIndirect);
        netProfitNode.monthlyTotals[combinedKey] = netProfit;

        console.log(`[${combinedKey}] P&L Summary Breakdown:`, {
          RevenueTotal: revTotal,
          DirectCosts: {
            laborVal,
            nonLaborVal,
            totalDirect: laborVal + nonLaborVal,
          },
          GrossProfit: grossProfit,
          TotalIndirectCosts: totalIndirect,
          NetProfit: netProfit,
        });
      });

      // Combine all elements together
      const combinedList = [
        ...allMappedNodes,
        revenueTotalNode,
        profitNode,
        netProfitNode,
      ];

      // Helper utility to safely map node names cleanly to custom ordering index
      const getSortIndex = (nodeName) => {
        if (!nodeName) return -1;

        // Trim spaces and normalize casing to prevent subtle string mismatch bugs
        const cleanName = nodeName.toString().trim().toLowerCase();

        // Find match based on exact equality or deliberate full string match
        return sortOrder.findIndex((orderName) => {
          const cleanOrderName = orderName.trim().toLowerCase();

          // Handle explicit layout names strictly to prevent "Revenue Adjustment" matching "Revenue"
          if (cleanOrderName === "contracts revenue") {
            return cleanName === "contracts revenue";
          }
          if (cleanOrderName === "revenue adjustment") {
            return cleanName.includes("adjustment");
          }
          if (cleanOrderName === "revenue total") {
            return (
              cleanName.includes("rev-total") || cleanName === "revenue total"
            );
          }

          // Fallback for everything else (Labor, Fringe, Overhead, etc.)
          return cleanName.includes(cleanOrderName);
        });
      };

      // Filter: Only keep rows matching an entry in the sortOrder array
      const finalDataList = combinedList.filter(
        (node) => getSortIndex(node.name) !== -1,
      );

      // Sort: Line rows up exactly to the array order index
      finalDataList.sort((a, b) => getSortIndex(a.name) - getSortIndex(b.name));
      console.log(
        "FINAL REPORT DATA:",
        finalDataList.map((x) => ({
          id: x.id,
          name: x.name,
          values: x.monthlyTotals,
        })),
      );
      setData(finalDataList);
    } catch (error) {
      console.error("Error fetching forecast:", error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchForecast = async () => {
  //   try {
  //     setLoading(true);
  //     const response =
  //       role === "admin"
  //         ? await fetch(`${backendUrl}/Forecast/GetSummaryV1`)
  //         : await fetch(
  //             `${backendUrl}/Forecast/GetSummaryByUser?UserId=${userId}`,
  //           );
  //     const result = await response.json();

  //     const sortOrder = [
  //       "Revenue",
  //       "Revenue Adjustment",
  //       "Revenue Total",
  //       "Direct Labor",
  //       "Direct Non Labor",
  //       "Gross Profit / (Loss)",
  //       "Fringe",
  //       "Overhead",
  //       "Facility Expenses",
  //       "General",
  //       "B&P: Costs",
  //       "IR&D",
  //       "Unallowable Expenses",
  //       "Non Operating Expenses",
  //       "Net Profit / (Loss)",
  //     ];

  //     const getTotals = (item) => {
  //       const isRevenue = item.name?.toLowerCase().includes("revenue");
  //       return isRevenue ? item.revenueTotals || {} : item.monthlyTotals || {};
  //     };

  //     const mapNodes = (nodes) => {
  //       if (!nodes) return [];
  //       const nodesArray = Array.isArray(nodes) ? nodes : Object.values(nodes);
  //       return nodesArray
  //         .map((item) => ({
  //           id: (item.id || item.code || "").toString().trim(),
  //           name: (item.name || item.description || "").toString().trim(),
  //           type: item.type,
  //           monthlyTotals: getTotals(item) || {},
  //           revenueTotals: item.revenueTotals || {},
  //           children: mapNodes(item.children),
  //         }))
  //         .sort((a, b) => {
  //           // Alphanumeric sorting ensures IDs like "50.01.01" or string names sort correctly
  //           // { numeric: true } guarantees "2" comes before "10"
  //           return a.id.localeCompare(b.id, undefined, {
  //             numeric: true,
  //             sensitivity: "base",
  //           });
  //         });
  //     };

  //     const dataToMap = Array.isArray(result) ? result : Object.values(result);

  //     let allMappedNodes = dataToMap
  //       .filter((item) => !item.name?.includes("Other"))
  //       .map((item) => ({
  //         id: item.id || item.code,
  //         name: (item.name || item.description || "").trim(),
  //         type: item.type,
  //         monthlyTotals: getTotals(item),
  //         children: mapNodes(item.children),
  //       }));

  //     let unallowableNode = allMappedNodes.find((n) => n.id === "90");
  //     const nodeToMoveIndex = allMappedNodes.findIndex(
  //       (n) => n.id === "50.32.02",
  //     );

  //     if (unallowableNode && nodeToMoveIndex !== -1) {
  //       const nodeToMove = allMappedNodes[nodeToMoveIndex];
  //       if (!unallowableNode.children) unallowableNode.children = [];
  //       if (nodeToMove.children && nodeToMove.children.length > 0) {
  //         unallowableNode.children.push(...nodeToMove.children);
  //       } else {
  //         unallowableNode.children.push(nodeToMove);
  //       }
  //       allMappedNodes.splice(nodeToMoveIndex, 1);
  //     }

  //     const revenueNode = allMappedNodes.find((n) => n.name === "Revenue");
  //     const revenueAdjNode = allMappedNodes.find((n) =>
  //       n.name.toLowerCase().includes("adjustment"),
  //     );

  //     const directLaborNode = allMappedNodes.find((n) =>
  //       n.name.includes("Direct Labor"),
  //     );
  //     const directNonLaborNode = allMappedNodes.find((n) =>
  //       n.name.includes("Direct Non Labor"),
  //     );

  //     const revenueTotalNode = {
  //       id: "REV-TOTAL",
  //       name: "Revenue Total",
  //       type: "summary",
  //       monthlyTotals: {},
  //       children: [],
  //     };

  //     const profitNode = {
  //       id: "PL-Summary",
  //       name: "Gross Profit / (Loss)",
  //       type: "summary",
  //       monthlyTotals: {},
  //       children: [],
  //     };

  //     const netProfitNode = {
  //       id: "Net PL-Summary",
  //       name: "Net Profit / (Loss)",
  //       type: "summary",
  //       monthlyTotals: {},
  //       children: [],
  //     };

  //     const indirectNodes = allMappedNodes.filter(
  //       (n) =>
  //         n.name !== "Revenue" &&
  //         !n.name.toLowerCase().includes("adjustment") &&
  //         !n.name.includes("Direct Labor") &&
  //         !n.name.includes("Direct Non Labor"),
  //     );

  //     columns.forEach((col) => {
  //       const monthNum = labelToNum[col.month];
  //       const combinedKey = `${col.year}-${monthNum}`;

  //       const getVal = (node) => {
  //         if (!node) return 0;
  //         const val = node.monthlyTotals?.[combinedKey] || 0;
  //         return Math.round((parseFloat(val) + Number.EPSILON) * 100) / 100;
  //       };

  //       if (unallowableNode) {
  //         const childTotal = (unallowableNode.children || []).reduce(
  //           (sum, child) => sum + getVal(child),
  //           0,
  //         );
  //         unallowableNode.monthlyTotals[combinedKey] =
  //           Math.round((childTotal + Number.EPSILON) * 100) / 100;
  //       }

  //       const rawRevenue = getVal(revenueNode);
  //       const adjustment = getVal(revenueAdjNode);
  //       const laborVal = getVal(directLaborNode);
  //       const nonLaborVal = getVal(directNonLaborNode);

  //       const baseRevenue =
  //         Math.round((rawRevenue - adjustment + Number.EPSILON) * 100) / 100;
  //       if (revenueNode) {
  //         revenueNode.monthlyTotals[combinedKey] = baseRevenue;
  //       }

  //       const revTotal =
  //         Math.round((baseRevenue + adjustment + Number.EPSILON) * 100) / 100;
  //       revenueTotalNode.monthlyTotals[combinedKey] = revTotal;

  //       const grossProfit =
  //         Math.round(
  //           (revTotal - (laborVal + nonLaborVal) + Number.EPSILON) * 100,
  //         ) / 100;
  //       profitNode.monthlyTotals[combinedKey] = grossProfit;

  //       const totalIndirect = indirectNodes.reduce(
  //         (sum, node) => sum + getVal(node),
  //         0,
  //       );
  //       netProfitNode.monthlyTotals[combinedKey] =
  //         Math.round((grossProfit - totalIndirect + Number.EPSILON) * 100) /
  //         100;
  //     });

  //     const finalDataList = [...allMappedNodes];
  //     finalDataList.push(revenueTotalNode, profitNode, netProfitNode);

  //     finalDataList.sort((a, b) => {
  //       const indexA = sortOrder.findIndex((name) => a.name.includes(name));
  //       const indexB = sortOrder.findIndex((name) => b.name.includes(name));
  //       return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  //     });

  //     setData(finalDataList);
  //   } catch (error) {
  //     console.error("Error fetching forecast:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchForecastByUser = async () => {

  // }

  useEffect(() => {
    if (summaryLoading) {
      return;
    }
    fetchForecast();
  }, [summaryLoading]);

  const exportToExcel = async () => {
    setIsExporting(true);

    try {
      // 1. Initialize an ExcelJS Workbook & Worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Financial Report");

      // Set up base grid properties
      worksheet.views = [{ showGridLines: true }];

      // 2. Define Columns Configuration (Sizing & Keys)
      const dynamicCols = columns.map((col, idx) => ({
        header: `${col.year}-${col.month}`,
        key: `col_${idx}`,
        width: 14,
        // style: { numFmt: '"$"#,##0.00;("(" \x22$\x22#,##0.00")";"-"' }, // Clean accounting format
        style: { numFmt: '$#,##0.00;($#,##0.00);"-"' },
      }));

      worksheet.columns = [
        { header: "ID", key: "id", width: 16 },
        { header: "Description", key: "description", width: 45 },
        ...dynamicCols,
      ];

      // 3. Style the Header Row (Row 1)
      const headerRow = worksheet.getRow(1);
      headerRow.height = 28;
      headerRow.eachCell((cell) => {
        cell.font = {
          name: "Arial",
          size: 11,
          bold: true,
          color: { argb: "FFFFFF" },
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "1E293B" }, // Slate-800 Theme to match web styling
        };
        cell.alignment = {
          vertical: "middle",
          horizontal: cell.border ? "right" : "left",
        };
      });
      // Right align header text for numeric value columns
      for (let i = 3; i <= worksheet.columns.length; i++) {
        headerRow.getCell(i).alignment = {
          vertical: "middle",
          horizontal: "right",
        };
      }

      // 4. Resolve Target Level Depths
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

      // 5. Flatten & Construct Nested Data Rows
      const flattenData = (nodes, currentDepth = 0) => {
        nodes.forEach((node) => {
          const isRevenueNode =
            node.name?.toLowerCase().includes("revenue") ||
            node.id === "REV-TOTAL";
          // Visual text indentation mapping for nested hierarchies
          const indentSpace = "    ".repeat(currentDepth);
          const rowData = {
            // id: node.id,
            ...(currentDepth === 0 ? {} : { id: node.id }),
            description: indentSpace + node.name,
          };

          // Populate metrics across chronological buckets
          columns.forEach((col, idx) => {
            const monthNum = labelToNum[col.month];
            const combinedKey = `${col.year}-${monthNum}`;
            const val = getCellValue(
              node,
              col.year,
              col.month,
              monthNum,
              combinedKey,
            );

            let cleanValue =
              typeof val === "string"
                ? parseFloat(val.replace(/,/g, ""))
                : parseFloat(val);

            if (isNaN(cleanValue)) {
              cleanValue = 0;
            }

            // if (isRevenueNode) {
            //   cleanValue = -cleanValue;
            // }

            rowData[`col_${idx}`] = isNaN(cleanValue) ? 0 : cleanValue;
          });

          const newRow = worksheet.addRow(rowData);
          newRow.height = 22;

          // 6. Contextual Node Styling Rules (Bold weights and background tints)
          const isSummaryBlock =
            node.id === "REV-TOTAL" ||
            node.id === "PL-Summary" ||
            node.id === "Net PL-Summary";

          if (currentDepth === 0 || isSummaryBlock) {
            // Style Main Level Sections & Sum Blocks
            newRow.eachCell((cell, colNumber) => {
              cell.font = { name: "Arial", size: 10, bold: true };

              if (isSummaryBlock) {
                // Double underline accounting border for bottom lines
                cell.border = {
                  top: { style: "thin", color: { argb: "94A3B8" } },
                  bottom: { style: "double", color: { argb: "334155" } },
                };
                // Light green highlight tint for summary lines
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "F0FDF4" },
                };
              } else {
                // Default subtle layout separator fill
                cell.fill = {
                  type: "pattern",
                  pattern: "solid",
                  fgColor: { argb: "F8FAFC" },
                };
              }
            });
          } else {
            // Child indentations style configurations
            newRow.eachCell((cell) => {
              cell.font = { name: "Arial", size: 10, bold: false };
            });
          }

          // Ensure basic layout text alignments
          newRow.getCell(1).alignment = {
            vertical: "middle",
            horizontal: "left",
          };
          newRow.getCell(2).alignment = {
            vertical: "middle",
            horizontal: "left",
          };

          // 7. Core Filtering Conditions Fix
          const isRevenue =
            node.name?.toLowerCase().includes("revenue") ||
            node.id === "REV-TOTAL";

          // Halt parsing downstream if configuration restricts revenue accounts
          // if (selectedLevel === "account" && isRevenue) {
          //   return;
          // }

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

      // 8. Generate File Payload Blob and Trigger Client Download
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
            className={`border-b border-gray-200 transition-colors ${depth === 0 ? "bg-slate-50 font-bold" : "bg-white"} ${isProfitRow ? "bg-green-50/50" : ""} hover:bg-gray-100`}
          >
            <td
              className={`sticky left-0 z-20 bg-inherit border-r border-gray-300 px-4 py-3 min-w-[280px] max-w-[280px] ${isProfitRow ? "text-green-800 font-black" : ""}`}
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
                  {/* <span className="text-[10px] text-gray-500 font-mono leading-none">
                    {node.id}
                  </span> */}
                  {depth > 0 && (
                    <span className="text-[10px] text-gray-500 font-mono leading-none">
                      {node.id}
                    </span>
                  )}
                  <span className="text-sm text-slate-800 font-semibold truncate">
                    {node.name}
                  </span>
                </div>
              </div>
            </td>

            {columns.map((col, idx) => {
              const yearKey = col.year;
              const monthLabel = col.month;
              const monthNum = labelToNum[monthLabel];
              const combinedKey = `${yearKey}-${monthNum}`;

              const displayValue = getCellValue(
                node,
                yearKey,
                monthLabel,
                monthNum,
                combinedKey,
              );
              const cleanValue = parseFloat(displayValue);
              let finalValue = isNaN(cleanValue) ? 0 : cleanValue;

              // Check if the current row node is revenue
              const isRevenueNode =
                node.name?.toLowerCase().includes("revenue") ||
                node.id === "REV-TOTAL";

              // Invert sign ONLY for revenue nodes (positive -> negative, negative -> positive)
              // if (isRevenueNode) {
              //   finalValue = -finalValue;
              // }

              // Find the top-level revenue node from the main dataset to evaluate current month revenue
              const mainRevenueNode = data.find(
                (n) =>
                  n.name?.toLowerCase().includes("revenue") ||
                  n.id === "REV-TOTAL",
              );

              const currentMonthRevenue = isRevenueNode
                ? parseFloat(
                    getCellValue(
                      node,
                      yearKey,
                      monthLabel,
                      monthNum,
                      combinedKey,
                    ),
                  ) || 0
                : 0;

              const formattedValue = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(finalValue);

              const isNegative = finalValue < 0;
              const isPositive = finalValue > 0;

              return (
                <td
                  key={idx}
                  className={`text-right border-r border-gray-100 min-w-[100px] py-2 px-2 text-xs font-mono text-gray-600 ${
                    isProfitRow
                      ? isNegative
                        ? "text-red-500 "
                        : isPositive
                          ? "text-green-500"
                          : "text-gray-600"
                      : "text-gray-600"
                  }`}
                >
                  {/* {isProfitRow && currentMonthRevenue === 0 ? (
                    <span className="text-gray-400">-</span>
                  ) :  */}
                  {finalValue === 0 ? "-" : formattedValue}
                </td>
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
          {/* 👇 ADDED: Show Variance Navigation Button */}
          <button
            onClick={onShowVariance}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-all duration-150 whitespace-nowrap shrink-0"
          >
            Show Variance
          </button>
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
          <button
            onClick={exportToExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-all shadow-sm whitespace-nowrap shrink-0"
            disabled={isExporting}
          >
            <Download size={14} /> Export Excel
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-all shadow-sm whitespace-nowrap shrink-0 ${loading ? "bg-slate-200 cursor-not-allowed" : "bg-slate-100"}`}
            disabled={isExporting || loading}
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
          <thead className="sticky top-0 z-40">
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
          </thead>
          <tbody className="tbody">
            {loading || summaryLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-10">
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

      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 border border-gray-200 flex flex-col max-h-[70vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileSpreadsheet size={20} className="text-blue-600" /> Export
                Plan Details Options
              </h3>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 flex-1 overflow-hidden">
              {/* LEFT SIDE: Date Range Options */}
              <div className="space-y-4 flex flex-col justify-between pr-2 border-r border-gray-100">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    1. Select Timeframe
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Start Month & Year
                    </label>
                    <input
                      type="month"
                      disabled={exportAllDataFlag}
                      value={exportStartMonthYear}
                      onChange={(e) => setExportStartMonthYear(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      End Month & Year
                    </label>
                    <input
                      type="month"
                      disabled={exportAllDataFlag}
                      value={exportEndMonthYear}
                      onChange={(e) => setExportEndMonthYear(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <input
                      type="checkbox"
                      id="exportAllFlag"
                      checked={exportAllDataFlag}
                      onChange={(e) => setExportAllDataFlag(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="exportAllFlag"
                      className="text-xs font-semibold text-gray-700 select-none cursor-pointer"
                    >
                      Export All Available Data (Ignore specific month limits)
                    </label>
                  </div>
                </div>

                <div className="text-[11px] text-gray-400 italic">
                  Note: Reports include labor, non-labor, and calculated
                  indirect pools for chosen configurations.
                </div>
              </div>

              {/* RIGHT SIDE: Filterable Project List with Dropdowns */}
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    2. Select Projects ({filteredProjects.length}/
                    {availableProjects.length})
                  </h4>
                </div>

                {/* Search and Dropdown Filters Bar */}
                <div className="space-y-2 mb-2">
                  <input
                    type="text"
                    placeholder="Search by Project ID or Name..."
                    value={projectSearchTerm}
                    onChange={(e) => setProjectSearchTerm(e.target.value)}
                    className="w-full border border-gray-200 rounded px-3 py-1.5 text-xs bg-slate-50 focus:bg-white transition-colors"
                  />

                  {/* <div className="grid grid-cols-2 gap-2"> */}
                  {/* Version Dropdown */}
                  {/* <select
                      value={selectedVersionFilter}
                      onChange={(e) => setSelectedVersionFilter(e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs bg-slate-50 text-slate-700 cursor-pointer"
                    >
                      <option value="ALL">All Versions</option>
                      {uniqueVersions.map((v) => (
                        <option key={v} value={v}>
                          Version {v}
                        </option>
                      ))}
                    </select> */}

                  {/* Plan Type Dropdown */}
                  {/* <select
                      value={selectedPlTypeFilter}
                      onChange={(e) => setSelectedPlTypeFilter(e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs bg-slate-50 text-slate-700 cursor-pointer"
                    >
                      <option value="ALL">All Plan Types</option>
                      {uniquePlTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select> */}
                  {/* </div> */}
                </div>

                {/* Select All Checkbox Header */}
                <div className="flex items-center justify-between py-1.5 px-2 bg-slate-100 rounded text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={areAllFilteredSelected}
                      onChange={handleToggleSelectAllProjects}
                      className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 cursor-pointer"
                    />
                    <span>
                      Select All (Filtered: {filteredProjects.length})
                    </span>
                  </div>
                </div>

                {/* Scrollable Project Items */}
                <div className="flex-1 overflow-y-auto border border-gray-200 rounded mt-1 divide-y divide-gray-100">
                  {isLoadingProjects ? (
                    <div className="p-4 text-center text-xs text-gray-400">
                      Loading projects...
                    </div>
                  ) : filteredProjects.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-400">
                      No matching projects found.
                    </div>
                  ) : (
                    filteredProjects.map((p) => {
                      const rowKey = getProjectKey(p);
                      const isSelected = selectedKeys.has(rowKey);

                      return (
                        <div
                          key={rowKey}
                          onClick={() => handleToggleSingleProject(p)}
                          className="flex items-center justify-between p-2 hover:bg-slate-50 cursor-pointer text-xs"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 pointer-events-none"
                            />
                            <div className="truncate">
                              <span className="font-semibold text-slate-800">
                                {p.projId}
                              </span>
                              <span className="text-gray-500 ml-1.5 truncate">
                                {p.projName}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-500">
                              v{p.version}
                            </span>
                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-medium">
                              {p.plType}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsExportModalOpen(false);
                  const [startYear, startMonth] =
                    exportStartMonthYear.split("-");
                  const [endYear, endMonth] = exportEndMonthYear.split("-");

                  exportUnifiedPlanDetails({
                    plIds: getSelectedPlIds(),
                    startYear,
                    startMonth,
                    endYear,
                    endMonth,
                    exportAll: exportAllDataFlag,
                  });
                }}
                disabled={selectedKeys.size === 0 && !exportAllDataFlag}
                className="btn1 btn-blue"
              >
                Download Report ({filteredProjects.length} Selected)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveReport;
