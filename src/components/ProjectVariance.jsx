import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from "recharts";
import { backendUrl } from "./config";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const formatCurrency = (val) => {
  if (val === undefined || val === null) return "$0.00";
  if (Math.abs(val) >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
  if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(1)}K`;
  return `$${val.toFixed(2)}`;
};

const calculatePct = (baseline, current) => {
  if (!baseline) return "0.0%";
  const pct = ((current - baseline) / baseline) * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
};

export const ProjectVariance = () => {
  // --- STATE FOR DISCOVERED METADATA ---
  const [projectsList, setProjectsList] = useState([]);
  const [selectedProj, setSelectedProj] = useState(null);

  // --- SEARCH DROPDOWN STATE ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  // --- STATE FOR THE SELECTION FORM MODEL ---
  const [sourceType, setSourceType] = useState("");
  const [sourceVersion, setSourceVersion] = useState("");
  const [compareType, setCompareType] = useState("");
  const [compareVersion, setCompareVersion] = useState("");

  // --- STATE FOR REPORT METRICS SYSTEM ---
  const [apiData, setApiData] = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("Cost");
  const [fiscalYearsList, setFiscalYearsList] = useState([]);
  const [selectedFiscalYear, setSelectedFiscalYear] = useState("All");

  const getSortedPlans = (project) => {
    if (!project || !project.plans) return [];

    return [...project.plans].sort((a, b) => {
      // Define sorting priorities for plan types
      const typePriority = { BUD: 1, NBBUD: 2, EAC: 3 };

      const priorityA = typePriority[a.type] || 99;
      const priorityB = typePriority[b.type] || 99;

      // 1. Sort by plan type priority matrix
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // 2. If types match, sort by Version in descending order (e.g., v2 before v1)
      const verA = parseFloat(a.version) || 0;
      const verB = parseFloat(b.version) || 0;

      return verB - verA;
    });
  };

  const baselineOptions = selectedProj ? getSortedPlans(selectedProj) : [];
  const comparisonOptions = selectedProj ? getSortedPlans(selectedProj) : [];

  const getCurrentUserContext = () => {
    try {
      const userString = localStorage.getItem("currentUser");
      if (!userString) return { userId: "", role: "" };
      const userObj = JSON.parse(userString);
      return {
        userId: userObj.userId ?? "",
        role: userObj.role?.toLowerCase() ?? "",
      };
    } catch {
      return { userId: "", role: "" };
    }
  };

  const { userId, role } = getCurrentUserContext();

  useEffect(() => {
    if (sourceType === compareType && sourceVersion === compareVersion) {
      const fallback = comparisonOptions.find(
        (opt) => !(opt.type === sourceType && opt.version === sourceVersion),
      );

      if (fallback) {
        setCompareType(fallback.type);
        setCompareVersion(fallback.version);
      }
    }
  }, [
    sourceType,
    sourceVersion,
    compareType,
    compareVersion,
    comparisonOptions,
    selectedFiscalYear,
  ]);

  // STEP 1: Fetch the comprehensive Plan Matrix
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setMetaLoading(true);
        const res = await fetch(
          `${backendUrl}/Project/MassUtilityGetAllPlans?UserId=${userId}&Role=${role}`,
        );
        if (!res.ok)
          throw new Error("Could not pull master metadata repository config.");
        const dynamicArray = await res.json();

        const projectMap = {};
        const yearSet = new Set();

        dynamicArray.forEach((item) => {
          const startYearStr = item.projStartDt
            ? item.projStartDt.split("-")[0]
            : null;
          const endYearStr = item.projEndDt
            ? item.projEndDt.split("-")[0]
            : null;

          if (startYearStr && endYearStr) {
            const startYear = parseInt(startYearStr, 10);
            const endYear = parseInt(endYearStr, 10);

            if (
              !isNaN(startYear) &&
              !isNaN(endYear) &&
              startYear >= 2015 &&
              endYear >= 2015
            ) {
              for (let y = startYear; y <= endYear; y++) {
                yearSet.add(y);
              }
            }
          } else {
            if (startYearStr) {
              const startYear = parseInt(startYearStr, 10);
              if (!isNaN(startYear) && startYear >= 2015)
                yearSet.add(startYear);
            }
            if (endYearStr) {
              const endYear = parseInt(endYearStr, 10);
              if (!isNaN(endYear) && endYear >= 2015) yearSet.add(endYear);
            }
          }

          if (!projectMap[item.projId]) {
            projectMap[item.projId] = {
              id: item.projId,
              name: item.projName || item.projId,
              plans: [],
            };
          }
          projectMap[item.projId].plans.push({
            type: item.plType,
            name: item.projName,
            version: String(item.version),
            // label: `${item.projName} - ${item.plType} v${item.version} (${item.status})`,
            label: `${item.description ? `${item.description} -` : ``} ${item.plType} v${item.version} (${item.status})`,
          });
        });

        const sortedDescendingYears = Array.from(yearSet).sort((a, b) => b - a);
        setFiscalYearsList(sortedDescendingYears);

        if (sortedDescendingYears.length > 0) {
          const currentCalendarYear = new Date().getFullYear();
          if (sortedDescendingYears.includes(currentCalendarYear)) {
            setSelectedFiscalYear(String(currentCalendarYear));
          } else {
            setSelectedFiscalYear(String(sortedDescendingYears[0]));
          }
        }

        const formattedProjects = Object.values(projectMap);
        setProjectsList(formattedProjects);

        if (formattedProjects.length > 0) {
          const firstProj = formattedProjects[0];

          const budPlan = firstProj.plans.find(
            (p) => p.type === "BUD" || p.type === "NBBUD",
          );
          const eacPlan = firstProj.plans.find((p) => p.type === "EAC");

          if (budPlan) {
            setSourceType(budPlan.type);
            setSourceVersion(budPlan.version);
          }
          if (eacPlan) {
            setCompareType(eacPlan.type);
            setCompareVersion(eacPlan.version);
          } else if (firstProj.plans[1]) {
            setCompareType(firstProj.plans[1].type);
            setCompareVersion(firstProj.plans[1].version);
          }
        }
      } catch (err) {
        setError(`Metadata System Fault: ${err.message}`);
      } finally {
        setMetaLoading(false);
      }
    };

    fetchMetadata();
  }, [userId, role]);

  // Close search menu when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // STEP 2: Fetch the actual report data
  useEffect(() => {
    if (!selectedProj) return;

    const fetchVarianceReport = async () => {
      try {
        setDataLoading(true);
        setError(null);

        const fyParam = selectedFiscalYear === "All" ? "" : selectedFiscalYear;
        const queryParams = `${backendUrl}/Forecast/GenerateVarianceReportDataForUI/?projId=${selectedProj.id}&sourceType=${sourceType}&sourceVersion=${sourceVersion}&compareType=${compareType}&compareVersion=${compareVersion}&Year=${fyParam}`;
        const response = await fetch(queryParams, {
          method: "POST",
        });
        if (!response.ok) {
          throw new Error(
            `Server execution fault with status code: ${response.status}`,
          );
        }
        const data = await response.json();

        const projectKey = selectedProj.id;
        const projectPayload = data[projectKey] || Object.values(data)[0];

        if (!projectPayload) {
          throw new Error(
            "No data profile mapped for the targeted identity key.",
          );
        }

        const v1Key = `${sourceType}-${sourceVersion}`;
        const v2Key = `${compareType}-${compareVersion}`;

        const versionsNode = projectPayload.versions || {};
        const rawV1 = versionsNode[v1Key] || {};
        const rawV2 = versionsNode[v2Key] || {};

        const processedV1 = {
          revenue: rawV1.revenue || 0,
          labor: rawV1.labor || 0,
          nonLabor: rawV1.nonLabor || 0,
          indirect: rawV1.indirect || 0,
        };

        const processedV2 = {
          revenue: rawV2.revenue || 0,
          labor: rawV2.labor || 0,
          nonLabor: rawV2.nonLabor || 0,
          indirect: rawV2.indirect || 0,
        };

        const v1Monthly = rawV1.monthlyData || [];
        const v2Monthly = rawV2.monthlyData || [];

        const uniqueMonths = Array.from(
          new Set([
            ...v1Monthly.map((m) => m.month),
            ...v2Monthly.map((m) => m.month),
          ]),
        );

        // Map month data into flat structure with explicit sub-cost configurations
        const combinedMonthlyData = uniqueMonths.map((mName) => {
          const m1 = v1Monthly.find((x) => x.month === mName) || {};
          const m2 = v2Monthly.find((x) => x.month === mName) || {};

          return {
            month: mName,
            monthName: m1.monthName || m2.monthName || "",
            v1Cost:
              m1.cost !== undefined
                ? m1.cost
                : (m1.labor || 0) + (m1.nonLabor || 0) + (m1.indirect || 0),
            v2Cost:
              m2.cost !== undefined
                ? m2.cost
                : (m2.labor || 0) + (m2.nonLabor || 0) + (m2.indirect || 0),
            v1Rev: m1.revenue || 0,
            v2Rev: m2.revenue || 0,
            v1Hours: m1.laborHours || 0,
            v2Hours: m2.laborHours || 0,
            // Dynamic mappings requested for sub-breakdowns
            v1Labor: m1.cost || 0,
            v2Labor: m2.cost || 0,
            v1NonLabor: m1.nonLabor || 0,
            v2NonLabor: m2.nonLabor || 0,
            v1Indirect: m1.indirect || 0,
            v2Indirect: m2.indirect || 0,
          };
        });

        const monthOrder = [
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
        combinedMonthlyData.sort(
          (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month),
        );

        setApiData({
          v1: processedV1,
          v2: processedV2,
          monthlyData: combinedMonthlyData,
        });
      } catch (err) {
        console.error("Variance Engine Failure:", err);
        setError(`Data Delivery Engine Error: ${err.message}`);
      } finally {
        setDataLoading(false);
      }
    };

    fetchVarianceReport();
  }, [
    selectedProj,
    sourceType,
    sourceVersion,
    compareType,
    compareVersion,
    selectedFiscalYear,
  ]);

  const handleProjectSelect = (targetObj) => {
    setSelectedProj(targetObj);
    setIsDropdownOpen(false);
    setSearchQuery("");

    if (targetObj.plans.length > 0) {
      setSourceType(targetObj.plans[0].type);
      setSourceVersion(targetObj.plans[0].version);

      if (targetObj.plans[1]) {
        setCompareType(targetObj.plans[1].type);
        setCompareVersion(targetObj.plans[1].version);
      }
    }
  };

  const filteredProjects = projectsList.filter(
    (p) =>
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const v1 = apiData?.v1 || { revenue: 0, labor: 0, nonLabor: 0, indirect: 0 };
  const v2 = apiData?.v2 || { revenue: 0, labor: 0, nonLabor: 0, indirect: 0 };
  const monthlyData = apiData?.monthlyData || [];

  const totalCostV1 = v1.labor + v1.nonLabor + v1.indirect;
  const totalCostV2 = v2.labor + v2.nonLabor + v2.indirect;
  const costVariance = totalCostV2 - totalCostV1;
  const revenueVariance = v2.revenue - v1.revenue;

  const summaryBreakdownMetrics = [
    {
      name: "Revenue",
      key: "revenue",
      v1Val: v1.revenue,
      v2Val: v2.revenue,
      border: "border-blue-500",
    },
    {
      name: "Labor Cost",
      key: "labor",
      v1Val: v1.labor,
      v2Val: v2.labor,
      border: "border-indigo-500",
    },
    {
      name: "Non-Labor Cost",
      key: "nonLabor",
      v1Val: v1.nonLabor,
      v2Val: v2.nonLabor,
      border: "border-purple-500",
    },
    {
      name: "Indirect Cost",
      key: "indirect",
      v1Val: v1.indirect,
      v2Val: v2.indirect,
      border: "border-pink-500",
    },
  ];

  const comparativeMetricsData = [
    {
      metric: "Total Revenue",
      [`${sourceType} v${sourceVersion}`]: v1.revenue,
      [`${compareType} v${compareVersion}`]: v2.revenue,
    },
    {
      metric: "Labor Cost",
      [`${sourceType} v${sourceVersion}`]: v1.labor,
      [`${compareType} v${compareVersion}`]: v2.labor,
    },
    {
      metric: "Non-Labor Cost",
      [`${sourceType} v${sourceVersion}`]: v1.nonLabor,
      [`${compareType} v${compareVersion}`]: v2.nonLabor,
    },
    {
      metric: "Indirect Cost",
      [`${sourceType} v${sourceVersion}`]: v1.indirect,
      [`${compareType} v${compareVersion}`]: v2.indirect,
    },
  ];

  const monthlyTrendData = monthlyData.map((m) => ({
    name: m.month,
    monthName: m.monthName,
    Cost: m.v2Cost,
    Revenue: m.v2Rev,
  }));

  const getFallbackOption = (options, currentType, currentVer) => {
    return (
      options.find(
        (opt) => !(opt.type === currentType && opt.version === currentVer),
      ) || options[0]
    );
  };

  const hasOnlyOneVersion =
    selectedProj && selectedProj.plans && selectedProj.plans.length <= 1;

  if (metaLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-xs font-bold text-slate-500 mt-4 tracking-widest">
          Building Master Project Maps...
        </p>
      </div>
    );
  }

  const metricsConfig = [
    { label: "Revenue", v1Key: "v1Rev", v2Key: "v2Rev", isCost: false },
    { label: "Labor Cost", v1Key: "v1Labor", v2Key: "v2Labor", isCost: true },
    {
      label: "Non-Labor Cost",
      v1Key: "v1NonLabor",
      v2Key: "v2NonLabor",
      isCost: true,
    },
    {
      label: "Indirect Cost",
      v1Key: "v1Indirect",
      v2Key: "v2Indirect",
      isCost: true,
    },
  ];

  const handleExcelExport = ({
    monthlyData,
    metricsConfig,
    sourceType,
    sourceVersion,
    compareType,
    compareVersion,
    projectName,
    selectedFiscalYear, // Added fiscalYear parameter
  }) => {
    if (!monthlyData || monthlyData.length === 0) return;

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Monthly Variance");

    // Typography & Layout Configurations
    const fontMain = { name: "Arial", size: 10 };
    const fontBold = { name: "Arial", size: 10, bold: true };
    const borderThin = {
      top: { style: "thin", color: { argb: "FFE2E8F0" } },
      left: { style: "thin", color: { argb: "FFE2E8F0" } },
      bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
      right: { style: "thin", color: { argb: "FFE2E8F0" } },
    };

    const forceNum = (val) => Number(val) || 0;

    // 1. Report Metadata Headers
    ws.addRow([`Monthly Variance Report - ${projectName || ""}`]);
    ws.mergeCells("A1:M1");
    ws.getRow(1).getCell(1).font = {
      name: "Arial",
      size: 12,
      bold: true,
      color: { argb: "FF0F172A" },
    };

    // Sub-header 1: Version Comparison
    ws.addRow([
      `Comparing ${sourceType} v${sourceVersion} (From) vs ${compareType} v${compareVersion} (To)`,
    ]);
    ws.mergeCells("A2:M2");
    ws.getRow(2).getCell(1).font = {
      name: "Arial",
      size: 10,
      italic: true,
      color: { argb: "FF64748B" },
    };

    // Sub-header 2: Fiscal Year
    ws.addRow([`Fiscal Year: ${selectedFiscalYear || "N/A"}`]);
    ws.mergeCells("A3:M3");
    ws.getRow(3).getCell(1).font = {
      name: "Arial",
      size: 10,
      bold: true,
      color: { argb: "FF475569" },
    };

    ws.addRow([]); // Gap Spacer

    // 2. Build Structural Layout Arrays
    const topHeaderRow = ["Financial Metric"];
    const subHeaderRow = [""];

    monthlyData.forEach((m) => {
      // Month Name Header (Jan, Feb, etc.)
      topHeaderRow.push(m.monthName || m.month, "", "");
      subHeaderRow.push(
        `${sourceType} v${sourceVersion}`,
        `${compareType} v${compareVersion}`,
        "Variance",
      );
    });

    // Include YTD Totals Structure
    topHeaderRow.push("YTD Total", "", "");
    subHeaderRow.push(
      `${sourceType} v${sourceVersion}`,
      `${compareType} v${compareVersion}`,
      "Variance",
    );

    ws.addRow(topHeaderRow); // Now Row 5
    ws.addRow(subHeaderRow); // Now Row 6

    ws.getRow(5).height = 24;
    ws.getRow(6).height = 20;

    // Merge Level 1 Column Blocks (Months & YTD)
    let colIndex = 2;
    monthlyData.forEach(() => {
      ws.mergeCells(5, colIndex, 5, colIndex + 2);
      const cell = ws.getCell(5, colIndex);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF8FAFC" },
      };
      cell.font = fontBold;
      cell.alignment = { horizontal: "center", vertical: "middle" };
      colIndex += 3;
    });

    ws.mergeCells(5, colIndex, 5, colIndex + 2);
    const ytdHeadCell = ws.getCell(5, colIndex);
    ytdHeadCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF1F5F9" },
    };
    ytdHeadCell.font = fontBold;
    ytdHeadCell.alignment = { horizontal: "center", vertical: "middle" };

    // Primary Corner Header Label
    ws.mergeCells("A5:A6");
    const mainMetricCell = ws.getCell("A5");
    mainMetricCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF8FAFC" },
    };
    mainMetricCell.font = fontBold;
    mainMetricCell.alignment = { horizontal: "left", vertical: "middle" };

    // Style Level 2 Header Rows
    ws.getRow(6).eachCell((cell, colNum) => {
      if (colNum === 1) return;
      const isVariance = cell.value === "Variance";
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: isVariance ? "FFF1F5F9" : "FFF8FAFC" },
      };
      cell.font = isVariance ? fontBold : fontMain;
      cell.alignment = { horizontal: "right", vertical: "middle" };
    });

    for (let r = 5; r <= 6; r++) {
      ws.getRow(r).eachCell((cell) => {
        cell.border = borderThin;
      });
    }

    // 3. Render Metric Data Row Cycles
    metricsConfig.forEach((metric) => {
      let v1Total = 0;
      let v2Total = 0;
      const dataValues = [metric.label];

      monthlyData.forEach((m) => {
        const val1 = forceNum(m[metric.v1Key]);
        const val2 = forceNum(m[metric.v2Key]);
        const diff = val2 - val1;

        v1Total += val1;
        v2Total += val2;
        dataValues.push(val1, val2, diff);
      });

      const totalVariance = v2Total - v1Total;
      dataValues.push(v1Total, v2Total, totalVariance);

      const newRow = ws.addRow(dataValues);
      newRow.height = 20;

      newRow.eachCell((cell, colNum) => {
        cell.border = borderThin;

        if (colNum === 1) {
          cell.font = fontBold;
          cell.alignment = { horizontal: "left", vertical: "middle" };
          return;
        }

        cell.numFmt = '$#,##0.00;($#,##0.00);"$0.00"';
        cell.alignment = { horizontal: "right", vertical: "middle" };

        const totalCols = dataValues.length;
        const isVarianceColumn = colNum % 3 === 1 || colNum === totalCols;
        const isYTDColumn = colNum >= totalCols - 2;

        if (isVarianceColumn) {
          const diffValue = forceNum(cell.value);
          const isPositive = diffValue > 0;

          cell.font = isYTDColumn
            ? { ...fontBold }
            : { ...fontMain, bold: true };

          if (diffValue !== 0) {
            cell.font.color = { argb: isPositive ? "FF059669" : "FFE11D48" };
          } else {
            cell.font.color = { argb: "FF94A3B8" };
          }
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF8FAFC" },
          };
        } else if (isYTDColumn) {
          cell.font = fontBold;
        } else {
          cell.font = fontMain;
        }
      });
    });

    ws.columns.forEach((col, idx) => {
      col.width = idx === 0 ? 22 : 14;
    });

    const now = new Date();
    const timestamp =
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      now.getDate().toString().padStart(2, "0") +
      "_" +
      now.getHours().toString().padStart(2, "0") +
      now.getMinutes().toString().padStart(2, "0") +
      now.getSeconds().toString().padStart(2, "0");

    wb.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(
        blob,
        `Monthly_Variance_${projectName || "Report"}_${timestamp}.xlsx`,
      );
    });
  };

  return (
    <div className="mx-auto min-h-screen font-sans antialiased text-slate-800 pl-2">
      <header className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Executive Variance Analysis Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Active Project Profile:{" "}
            <span className="text-blue-600 font-semibold">
              {selectedProj?.name}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-black">
          <span className="font-medium whitespace-nowrap">Fiscal Year:</span>
          <select
            value={selectedFiscalYear}
            onChange={(e) => setSelectedFiscalYear(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:border-blue-500"
          >
            {fiscalYearsList.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1 relative w-64" ref={dropdownRef}>
            <label className="text-[10px] font-bold tracking-wider text-black">
              Search & Select Project
            </label>
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-slate-100 text-xs border border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-700 cursor-pointer flex justify-between items-center select-none"
            >
              <span className="truncate">
                {selectedProj
                  ? `${selectedProj.id} - ${selectedProj.name}`
                  : "Select a Project..."}
              </span>
              <span className="text-slate-400 text-[10px]">▼</span>
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-lg rounded-lg z-50 max-h-60 overflow-y-auto p-2">
                <input
                  type="text"
                  placeholder="Type ID or Name to Filter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full text-xs border border-slate-200 rounded-md p-2 mb-2 outline-none focus:border-blue-500 bg-slate-50 font-medium"
                  autoFocus
                />
                <div className="flex flex-col gap-0.5">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleProjectSelect(p)}
                        className={`text-xs p-2 rounded-md font-medium cursor-pointer transition-colors ${
                          selectedProj?.id === p.id
                            ? "bg-blue-600 text-white"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="font-bold">{p.id}</span> - {p.name}
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] text-slate-400 p-2 italic text-center">
                      No matching project found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold tracking-wider text-black">
              Compare From
            </label>
            <select
              value={`${sourceType}-${sourceVersion}`}
              onChange={(e) => {
                const [type, ver] = e.target.value.split("-");
                setSourceType(type);
                setSourceVersion(ver);

                if (type === compareType && ver === compareVersion) {
                  const fallback = getFallbackOption(
                    comparisonOptions,
                    type,
                    ver,
                  );
                  if (fallback) {
                    setCompareType(fallback.type);
                    setCompareVersion(fallback.version);
                  }
                }
              }}
              className="bg-slate-100 text-xs border border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-700 cursor-pointer outline-none focus:border-blue-500"
            >
              {baselineOptions.map((opt, i) => (
                <option key={i} value={`${opt.type}-${opt.version}`}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center self-end pb-1.5">
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold uppercase tracking-tight text-slate-400 shadow-sm">
              vs
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold tracking-wider text-black">
              To
            </label>
            <select
              value={`${compareType}-${compareVersion}`}
              onChange={(e) => {
                const [type, ver] = e.target.value.split("-");
                setCompareType(type);
                setCompareVersion(ver);

                if (type === sourceType && ver === sourceVersion) {
                  const fallback = getFallbackOption(
                    baselineOptions,
                    type,
                    ver,
                  );
                  if (fallback) {
                    setSourceType(fallback.type);
                    setSourceVersion(fallback.version);
                  }
                }
              }}
              className="bg-slate-100 text-xs border border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-700 cursor-pointer outline-none focus:border-blue-500"
            >
              {comparisonOptions.map((opt, i) => (
                <option
                  key={i}
                  value={`${opt.type}-${opt.version}`}
                  disabled={
                    opt.type === sourceType && opt.version === sourceVersion
                  }
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {!selectedProj ? (
        <div className="p-8 text-center border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm font-medium">
          ⚠️ Please select a project from the dropdown to initialize variance
          metrics.
        </div>
      ) : hasOnlyOneVersion ? (
        <div className="p-8 text-center border border-amber-300 rounded-lg bg-amber-50 text-amber-800 text-sm font-medium">
          🚫 This project has only one version. You can't compare this project.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs border-t-4 border-slate-600">
              <h3 className="text-[10px] font-bold text-slate-400 tracking-wider">
                Total Baseline Cost
              </h3>
              <p className="text-xl font-bold text-slate-800 mt-1 font-mono">
                {formatCurrency(totalCostV1)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs border-t-4 border-amber-500">
              <h3 className="text-[10px] font-bold text-slate-400 tracking-wider">
                Cost Variance Delta
              </h3>
              <p
                className={`text-xl font-bold mt-1 font-mono ${costVariance === 0 ? "text-slate-700" : costVariance > 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                {costVariance === 0
                  ? "$0.00"
                  : (costVariance > 0 ? "+" : "") +
                    formatCurrency(costVariance)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs border-t-4 border-emerald-600">
              <h3 className="text-[10px] font-bold text-slate-400 tracking-wider">
                Target Portfolio Revenue
              </h3>
              <p className="text-xl font-bold text-slate-800 mt-1 font-mono">
                {formatCurrency(v2.revenue)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs border-t-4 border-blue-600">
              <h3 className="text-[10px] font-bold text-slate-400 tracking-wider">
                Revenue Variance Delta
              </h3>
              <p
                className={`text-xl font-bold mt-1 font-mono ${revenueVariance === 0 ? "text-slate-700" : revenueVariance > 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                {revenueVariance === 0
                  ? "$0.00"
                  : (revenueVariance > 0 ? "+" : "") +
                    formatCurrency(revenueVariance)}
              </p>
            </div>
          </div>

          {monthlyData.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden mb-8">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Monthly Variance{" "}
                    <span className="text-xs font-normal text-slate-500">
                      ( Comparing{" "}
                      <span className="text-blue-600 font-semibold">
                        {sourceType} v{sourceVersion}
                      </span>{" "}
                      (From) vs{" "}
                      <span className="text-indigo-600 font-semibold">
                        {compareType} v{compareVersion}
                      </span>{" "}
                      (To) )
                    </span>
                  </h3>
                </div>
                {/* EXPORT DATA BUTTON ADDED HERE */}
                <button
                  onClick={() =>
                    handleExcelExport({
                      monthlyData,
                      metricsConfig,
                      sourceType,
                      sourceVersion,
                      compareType,
                      compareVersion,
                      projectName: selectedProj?.name,
                      selectedFiscalYear,
                    })
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export Excel
                </button>
              </div>

              <div className="p-5">
                <div className="border border-slate-200 rounded-xl overflow-auto shadow-xs max-h-[550px]">
                  <table className="w-full border-collapse text-left text-[11px] text-slate-700 min-w-[2400px]">
                    <thead className="relative z-20">
                      <tr className="bg-slate-50 text-slate-600 font-semibold whitespace-nowrap">
                        <th
                          className="p-3 border-r border-b border-slate-200 w-44 align-middle sticky left-0 top-0 z-30 bg-slate-50 shadow-[2px_2px_5px_-2px_rgba(0,0,0,0.05)]"
                          rowSpan={2}
                        >
                          Financial Metric
                        </th>
                        {monthlyData.map((m) => (
                          <th
                            key={m.month}
                            colSpan={3}
                            className="p-3 text-center border-r border-b border-slate-200 bg-slate-50 sticky top-0 z-10"
                          >
                            {m.monthName}
                          </th>
                        ))}
                        <th
                          colSpan={3}
                          className="p-3 text-center font-bold bg-slate-100 border-b border-slate-200 sticky top-0 z-10"
                        >
                          YTD Total
                        </th>
                      </tr>
                      <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold whitespace-nowrap">
                        <th className="hidden sticky left-0 z-35 bg-slate-50"></th>
                        {monthlyData.map((m) => (
                          <React.Fragment key={`${m.month}-sub-headers`}>
                            <th className="p-2 text-right border-r border-b border-slate-100 font-medium sticky top-[38px] z-10 bg-slate-50">
                              {sourceType} v{sourceVersion}
                            </th>
                            <th className="p-2 text-right border-r border-b border-slate-100 font-medium sticky top-[38px] z-10 bg-slate-50">
                              {compareType} v{compareVersion}
                            </th>
                            <th className="p-2 text-right border-r border-b border-slate-200 font-bold bg-slate-100/20 sticky top-[38px] z-10 bg-slate-50">
                              Variance
                            </th>
                          </React.Fragment>
                        ))}
                        <th className="p-2 text-right border-r border-b border-slate-100 font-medium sticky top-[38px] z-10 bg-slate-50">
                          {sourceType} v{sourceVersion}
                        </th>
                        <th className="p-2 text-right border-r border-b border-slate-100 font-medium sticky top-[38px] z-10 bg-slate-50">
                          {compareType} v{compareVersion}
                        </th>
                        <th className="p-2 text-right border-r border-b border-slate-200 font-bold bg-slate-100/20 sticky top-[38px] z-10 bg-slate-50">
                          Variance
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200">
                      {metricsConfig.map((metric, metricIdx) => {
                        const v1Total = monthlyData.reduce(
                          (sum, m) => sum + (m[metric.v1Key] || 0),
                          0,
                        );
                        const v2Total = monthlyData.reduce(
                          (sum, m) => sum + (m[metric.v2Key] || 0),
                          0,
                        );
                        const totalVariance = v2Total - v1Total;
                        // const isTotalFavorable = metric.isCost
                        const isTotalFavorable = totalVariance > 0;
                        // ? totalVariance < 0
                        // : totalVariance > 0;

                        return (
                          <tr
                            key={metric.label}
                            className={`border-b border-slate-200 transition-colors hover:bg-slate-50/40 ${
                              metricIdx % 2 === 0
                                ? "bg-white"
                                : "bg-slate-50/20"
                            }`}
                          >
                            <td
                              className={`p-3 font-semibold border-r whitespace-nowrap border-slate-200 text-slate-900 sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] ${
                                metricIdx % 2 === 0
                                  ? "bg-white"
                                  : "bg-slate-50/90"
                              }`}
                            >
                              {metric.label}
                            </td>

                            {monthlyData.map((m) => {
                              const val1 = m[metric.v1Key] || 0;
                              const val2 = m[metric.v2Key] || 0;
                              const diff = val2 - val1;
                              // const isFavorable = metric.isCost
                              //   ? diff < 0
                              //   : diff > 0;

                              const isFavorable = diff > 0;

                              return (
                                <React.Fragment
                                  key={`${m.month}-${metric.label}-cols`}
                                >
                                  <td className="p-2 text-right border-r border-slate-100 font-mono text-slate-500">
                                    {formatCurrency(val1)}
                                  </td>
                                  <td className="p-2 text-right border-r border-slate-100 font-mono text-slate-800">
                                    {formatCurrency(val2)}
                                  </td>
                                  <td
                                    className={`p-2 text-right border-r border-slate-200 font-mono font-bold bg-slate-100/10 ${
                                      diff === 0
                                        ? "text-slate-400"
                                        : isFavorable
                                          ? "text-emerald-600"
                                          : "text-red-600"
                                    }`}
                                  >
                                    {diff === 0
                                      ? "$0.00"
                                      : (diff > 0 ? "+" : "") +
                                        formatCurrency(diff)}
                                  </td>
                                </React.Fragment>
                              );
                            })}

                            <td className="p-2 text-right border-r border-slate-100 font-mono font-semibold bg-slate-100/30 text-slate-600">
                              {formatCurrency(v1Total)}
                            </td>
                            <td className="p-2 text-right border-r border-slate-100 font-mono font-bold bg-slate-100/30 text-slate-900">
                              {formatCurrency(v2Total)}
                            </td>
                            <td
                              className={`p-2 text-right font-mono font-extrabold bg-slate-100/40 ${
                                totalVariance === 0
                                  ? "text-slate-550"
                                  : isTotalFavorable
                                    ? "text-emerald-600"
                                    : "text-red-600"
                              }`}
                            >
                              {totalVariance === 0
                                ? "$0.00"
                                : (totalVariance > 0 ? "+" : "") +
                                  formatCurrency(totalVariance)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {summaryBreakdownMetrics.map((item) => {
                const delta = item.v2Val - item.v1Val;
                const percentage = calculatePct(item.v1Val, item.v2Val);
                const isNegative = delta < 0;
                const isZero = delta === 0;

                return (
                  <div
                    key={item.key}
                    className={`bg-white p-4 rounded-xl border-l-4 ${item.border} border-y border-r border-slate-200 shadow-sm flex flex-col justify-between`}
                  >
                    <div>
                      <span className="text-[10px] font-bold tracking-tight text-slate-400 block mb-1">
                        {item.name}
                      </span>
                      <div className="flex justify-between items-center text-xs text-slate-600 border-b pb-1.5 mb-1.5 border-slate-100">
                        <span>
                          {sourceType} v{sourceVersion}:
                        </span>
                        <span className="font-mono font-medium">
                          {formatCurrency(item.v1Val)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-700 font-semibold">
                        <span>
                          {compareType} v{compareVersion}:
                        </span>
                        <span className="font-mono text-slate-900">
                          {formatCurrency(item.v2Val)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-baseline">
                      <span
                        className={`text-xs font-mono font-bold ${isZero ? "text-slate-500" : "text-slate-800"}`}
                      >
                        {isZero
                          ? "$0.00"
                          : (delta > 0 ? "+" : "") + formatCurrency(delta)}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isZero
                            ? "bg-slate-100 text-slate-500"
                            : isNegative
                              ? "bg-red-50 text-red-700"
                              : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {percentage}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="mb-4">
                <h3 className="text-xs font-bold text-slate-500 tracking-wider">
                  Resource Allocation Outlays
                </h3>
                <div className="text-sm font-bold text-slate-800 mt-0.5">
                  Baseline vs Comparison Pool Analysis
                </div>
              </div>
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparativeMetricsData}
                    margin={{ top: 10, right: 5, left: 10, bottom: 5 }}
                    barGap={6}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="metric"
                      tickLine={false}
                      stroke="#94a3b8"
                      tick={{ fontSize: 11, fontWeight: 500 }}
                    />
                    <YAxis
                      tickLine={false}
                      stroke="#94a3b8"
                      tick={{ fontSize: 10, fontFamily: "monospace" }}
                      tickFormatter={formatCurrency}
                    />
                    <Tooltip
                      cursor={{ fill: "#f8fafc" }}
                      formatter={(value) => [
                        formatCurrency(value),
                        "Allocated",
                      ]}
                    />
                    <Legend
                      verticalAlign="top"
                      height={32}
                      iconSize={8}
                      iconType="circle"
                      wrapperStyle={{ fontSize: 11, fontWeight: 600 }}
                    />
                    <Bar
                      name={`${sourceType} v${sourceVersion}`}
                      dataKey={`${sourceType} v${sourceVersion}`}
                      fill="#1e3a8a"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                    <Bar
                      name={`${compareType} v${compareVersion}`}
                      dataKey={`${compareType} v${compareVersion}`}
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="mb-4">
                <h3 className="text-xs font-bold text-slate-500 tracking-wider">
                  Monthly Operational Performance
                </h3>
                <div className="text-sm font-bold text-slate-800 mt-0.5">
                  Cost Bars vs Revenue Target Trend ({compareType} v{" "}
                  {compareVersion})
                </div>
              </div>
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={monthlyTrendData}
                    margin={{ top: 10, right: 5, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      stroke="#94a3b8"
                      tick={{ fontSize: 11, fontWeight: 500 }}
                    />
                    <YAxis
                      tickLine={false}
                      stroke="#94a3b8"
                      tick={{ fontSize: 10, fontFamily: "monospace" }}
                      tickFormatter={formatCurrency}
                    />
                    <Tooltip formatter={(value) => [formatCurrency(value)]} />
                    <Legend
                      verticalAlign="top"
                      height={32}
                      iconSize={10}
                      wrapperStyle={{ fontSize: 11, fontWeight: 600 }}
                    />
                    <Bar
                      name="Actual / Forecast Cost"
                      dataKey="Cost"
                      fill="#cbd5e1"
                      opacity={0.8}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={45}
                    />
                    <Line
                      name="Revenue Pipeline"
                      type="monotone"
                      dataKey="Revenue"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {monthlyData.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden mb-8">
              <div className="p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold text-black tracking-wider">
                    Granular Monthly Variance Ledger Breakdown
                  </h3>
                  <p className="text-[11px] text-black mt-0.5">
                    Comparing{" "}
                    <span className="text-blue-400 font-semibold">
                      {sourceType} v{sourceVersion}
                    </span>{" "}
                    against{" "}
                    <span className="text-emerald-400 font-semibold">
                      {compareType} v{compareVersion}
                    </span>{" "}
                    month-by-month
                  </p>
                </div>

                <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                  {["Cost", "Labor Hours"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveSubTab(tab)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-md transition-all ${
                        activeSubTab === tab
                          ? "bg-white text-slate-900 shadow-xs border border-slate-200/50"
                          : "text-white hover:text-slate-900 hover:bg-slate-200/50"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-white h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      stroke="#94a3b8"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      tickLine={false}
                      stroke="#94a3b8"
                      tick={{ fontSize: 10, fontFamily: "monospace" }}
                      tickFormatter={(val) =>
                        activeSubTab === "Labor Hours"
                          ? val.toLocaleString()
                          : formatCurrency(val)
                      }
                    />
                    <Tooltip
                      formatter={(val, name) => [
                        activeSubTab === "Labor Hours"
                          ? val.toLocaleString() + " hrs"
                          : formatCurrency(val),
                        name,
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar
                      name={`${sourceType} v${sourceVersion} ${activeSubTab}`}
                      dataKey={
                        activeSubTab === "Revenue"
                          ? "v1Rev"
                          : activeSubTab === "Cost"
                            ? "v1Cost"
                            : "v1Hours"
                      }
                      fill="#64748b"
                      radius={[3, 3, 0, 0]}
                    />
                    <Bar
                      name={`${compareType} v${compareVersion} ${activeSubTab}`}
                      dataKey={
                        activeSubTab === "Revenue"
                          ? "v2Rev"
                          : activeSubTab === "Cost"
                            ? "v2Cost"
                            : "v2Hours"
                      }
                      fill="#2563eb"
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
