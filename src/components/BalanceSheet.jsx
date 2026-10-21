import React, { useEffect, useState } from "react";
import {
  Wallet,
  Landmark,
  PieChart,
  FileText,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  ChevronsDownUp,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSXS from "xlsx-js-style";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import { backendUrl } from "./config";

const DEFAULT_YEARS = [2026, 2025, 2024];

const BalanceSheet = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasRun, setHasRun] = useState(false);
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expandedSections, setExpandedSections] = useState(new Set());

  const priorYear = selectedYear - 1;

  const getData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${backendUrl}/api/ForecastReport/GetBalanceSheet?fyCd=${encodeURIComponent(
          selectedYear,
        )}`,
      );

      const responseData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

      setData(responseData);
      setExpandedSections(new Set());
      setHasRun(true);
    } catch (err) {
      console.error("Error fetching balance sheet:", err);
      setData([]);
      setError(
        err?.response?.data?.message ||
          "Unable to load the balance sheet. Please try again.",
      );
      setHasRun(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [selectedYear]);

  const availableYears = Array.from(
    new Set([
      ...DEFAULT_YEARS,
      new Date().getFullYear(),
      ...data.map((item) => Number(item.fyCd)).filter(Number.isFinite),
    ]),
  ).sort((a, b) => b - a);

  const numberValue = (value) => {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : 0;
    }

    if (value === null || value === undefined || value === "") {
      return 0;
    }

    const parsed = Number(String(value).replace(/[$,\s]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatCurr = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numberValue(value));

  const formatPercent = (current, prior) => {
    const curr = numberValue(current);
    const py = numberValue(prior);

    if (py === 0) {
      if (curr === 0) return "0.0%";
      return "N/M";
    }

    const change = ((curr - py) / Math.abs(py)) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  const formatChange = (value) => {
    const amount = numberValue(value);
    return `${amount > 0 ? "+" : ""}${formatCurr(amount)}`;
  };

  const getAccountId = (item) => String(item.accountId ?? item.acctId ?? "");

  const getAccountName = (item) =>
    item.fsSort3Desc ||
    item.acctName ||
    item.accountName ||
    getAccountId(item) ||
    "Unnamed account";

  const getCategoryName = (item) => item.fsSort2Desc || "Other Accounts";

  const getRootName = (item) => item.fsSort1Desc || "Other";

  const groupedRoots = Object.values(
    data.reduce((acc, item) => {
      const title = getRootName(item);
      const key = String(item.fsSort1 ?? title);

      if (!acc[key]) {
        acc[key] = {
          key,
          title,
          sort: numberValue(item.fsSort1),
          items: [],
        };
      }

      acc[key].items.push(item);
      return acc;
    }, {}),
  ).sort((a, b) => a.sort - b.sort);

  const getCategoryGroups = (items) =>
    Object.values(
      items.reduce((acc, item) => {
        const category = getCategoryName(item);

        if (!acc[category]) {
          acc[category] = {
            name: category,
            rows: [],
            sort: numberValue(item.fsSort2),
          };
        }

        acc[category].rows.push(item);
        return acc;
      }, {}),
    ).sort((a, b) => a.sort - b.sort);

  const getTotals = (items) =>
    items.reduce(
      (totals, item) => {
        totals.current += numberValue(item.amount);
        totals.prior += numberValue(item.pyAmount);
        return totals;
      },
      { current: 0, prior: 0 },
    );

  const handleExpandAll = () => {
    const next = new Set();

    groupedRoots.forEach((group) => {
      getCategoryGroups(group.items).forEach((category) => {
        next.add(`${group.key}::${category.name}`);
      });
    });

    setExpandedSections(next);
  };

  const handleCollapseAll = () => {
    setExpandedSections(new Set());
  };

  const allExpanded =
    groupedRoots.length > 0 &&
    groupedRoots.every((group) =>
      getCategoryGroups(group.items).every((category) =>
        expandedSections.has(`${group.key}::${category.name}`),
      ),
    );

  const toggleCategory = (key) => {
    setExpandedSections((previous) => {
      const next = new Set(previous);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  };

  const handleExportExcel = () => {
    if (!hasRun || loading || groupedRoots.length === 0) return;

    const rows = [
      [`Balance Sheet - FY ${selectedYear}`],
      [`Prior Year: FY ${priorYear}`, `Current Year: FY ${selectedYear}`],
      [],
      [
        "Category / Account",
        `FY ${priorYear}`,
        `FY ${selectedYear}`,
        "YoY Change",
        "YoY Change %",
      ],
    ];

    groupedRoots.forEach((group) => {
      const groupTotals = getTotals(group.items);

      rows.push([
        group.title.toUpperCase(),
        groupTotals.prior,
        groupTotals.current,
        groupTotals.current - groupTotals.prior,
        formatPercent(groupTotals.current, groupTotals.prior),
      ]);

      getCategoryGroups(group.items).forEach((category) => {
        const totals = getTotals(category.rows);

        rows.push([
          `  ${category.name}`,
          totals.prior,
          totals.current,
          totals.current - totals.prior,
          formatPercent(totals.current, totals.prior),
        ]);

        category.rows.forEach((item) => {
          const current = numberValue(item.amount);
          const prior = numberValue(item.pyAmount);

          rows.push([
            `      ${getAccountId(item)} - ${getAccountName(item)}`,
            prior,
            current,
            current - prior,
            formatPercent(current, prior),
          ]);
        });
      });

      rows.push([
        `Total ${group.title}`,
        groupTotals.prior,
        groupTotals.current,
        groupTotals.current - groupTotals.prior,
        formatPercent(groupTotals.current, groupTotals.prior),
      ]);

      rows.push([]);
    });

    const worksheet = XLSXS.utils.aoa_to_sheet(rows);
    const workbook = XLSXS.utils.book_new();

    worksheet["!cols"] = [
      { wch: 48 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 16 },
    ];

    const range = XLSXS.utils.decode_range(worksheet["!ref"]);

    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const address = XLSXS.utils.encode_cell({ r: row, c: col });
        const cell = worksheet[address];

        if (!cell) continue;

        cell.s = {
          font: {
            name: "Arial",
            sz: 10,
            color: { rgb: "334155" },
            bold: row === 0 || row === 3,
          },
          alignment: {
            vertical: "center",
            horizontal: col === 0 ? "left" : "right",
          },
        };

        if (row === 0) {
          cell.s.font = {
            name: "Arial",
            sz: 15,
            bold: true,
            color: { rgb: "1D4ED8" },
          };
        } else if (row === 3) {
          cell.s.fill = { fgColor: { rgb: "E8EFF9" } };
          cell.s.font = {
            name: "Arial",
            sz: 10,
            bold: true,
            color: { rgb: "1E3A5F" },
          };
        }

        if (col >= 1 && col <= 3 && typeof cell.v === "number") {
          cell.z = "$#,##0.00;[Red]-$#,##0.00;–";

          if (cell.v < 0) {
            cell.s.font.color = { rgb: "DC2626" };
          }
        }
      }
    }

    XLSXS.utils.book_append_sheet(workbook, worksheet, "Balance Sheet");
    XLSXS.writeFile(workbook, `Balance_Sheet_FY_${selectedYear}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!hasRun || loading || groupedRoots.length === 0) return;

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const rows = [];

    groupedRoots.forEach((group) => {
      const totals = getTotals(group.items);

      rows.push([
        {
          content: group.title.toUpperCase(),
          colSpan: 5,
          styles: {
            fontStyle: "bold",
            fillColor: [232, 239, 249],
            textColor: [30, 58, 95],
          },
        },
      ]);

      getCategoryGroups(group.items).forEach((category) => {
        const categoryTotals = getTotals(category.rows);

        rows.push([
          {
            content: category.name,
            styles: { fontStyle: "bold", textColor: [51, 65, 85] },
          },
          formatCurr(categoryTotals.prior),
          formatCurr(categoryTotals.current),
          formatChange(categoryTotals.current - categoryTotals.prior),
          formatPercent(categoryTotals.current, categoryTotals.prior),
        ]);

        category.rows.forEach((item) => {
          const current = numberValue(item.amount);
          const prior = numberValue(item.pyAmount);

          rows.push([
            `    ${getAccountId(item)} - ${getAccountName(item)}`,
            formatCurr(prior),
            formatCurr(current),
            formatChange(current - prior),
            formatPercent(current, prior),
          ]);
        });
      });

      rows.push([
        {
          content: `Total ${group.title}`,
          styles: {
            fontStyle: "bold",
            fillColor: [248, 250, 252],
          },
        },
        {
          content: formatCurr(totals.prior),
          styles: { fontStyle: "bold" },
        },
        {
          content: formatCurr(totals.current),
          styles: { fontStyle: "bold" },
        },
        {
          content: formatChange(totals.current - totals.prior),
          styles: { fontStyle: "bold" },
        },
        {
          content: formatPercent(totals.current, totals.prior),
          styles: { fontStyle: "bold" },
        },
      ]);
    });

    autoTable(pdf, {
      startY: 28,
      head: [
        [
          "Category / Account",
          `Prior Year (${priorYear})`,
          `Current Year (${selectedYear})`,
          "YoY Change",
          "YoY Change %",
        ],
      ],
      body: rows,
      theme: "grid",
      margin: { left: 10, right: 10, bottom: 12 },
      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 2,
        textColor: [51, 65, 85],
        lineColor: [226, 232, 240],
        lineWidth: 0.15,
      },
      headStyles: {
        fillColor: [37, 76, 112],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 112 },
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
        4: { halign: "right" },
      },
      didDrawPage: () => {
        pdf.setFontSize(15);
        pdf.setTextColor(30, 58, 95);
        pdf.setFont("helvetica", "bold");
        pdf.text("Balance Sheet", 10, 13);

        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100, 116, 139);
        pdf.text(`Comparing FY ${priorYear} with FY ${selectedYear}`, 10, 19);
      },
    });

    pdf.save(`Balance_Sheet_FY_${selectedYear}.pdf`);
  };

  return (
    <div className="w-full mx-auto p-3 space-y-4 bg-slate-50/70 min-h-full">
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
              <Landmark size={22} />
            </div>

            <div>
              <h3 className="text-lg font-bold tracking-tight text-slate-800">
                Balance Sheet
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Financial position · FY {selectedYear}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Comparing FY {priorYear} with FY {selectedYear}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label
              htmlFor="balance-sheet-year"
              className="text-xs font-medium text-slate-600"
            >
              Fiscal Year
            </label>

            <select
              id="balance-sheet-year"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  FY {year}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={getData}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              type="button"
              onClick={allExpanded ? handleCollapseAll : handleExpandAll}
              disabled={loading || groupedRoots.length === 0}
              className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
            >
              {allExpanded ? (
                <ChevronsDownUp size={14} />
              ) : (
                <ChevronsUpDown size={14} />
              )}
              {allExpanded ? "Collapse All" : "Expand All"}
            </button>

            <button
              type="button"
              onClick={handleExportPDF}
              disabled={!hasRun || loading || groupedRoots.length === 0}
              className="flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaFilePdf size={13} />
              PDF
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={!hasRun || loading || groupedRoots.length === 0}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaFileExcel size={13} />
              Excel
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
          <button
            type="button"
            onClick={getData}
            className="ml-2 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        {loading ? (
          [0, 1, 2].map((index) => <LoadingCard key={index} />)
        ) : groupedRoots.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <FileText size={22} />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              No balance sheet data found
            </p>
            <p className="mt-1 text-xs text-slate-500">
              No data is available for FY {selectedYear}.
            </p>
          </div>
        ) : (
          groupedRoots.map((group, index) => (
            <AccountCard
              key={group.key}
              groupKey={group.key}
              title={group.title}
              items={group.items}
              index={index}
              format={formatCurr}
              formatPercent={formatPercent}
              expandedSections={expandedSections}
              toggleCategory={toggleCategory}
            />
          ))
        )}
      </div>

      {!loading && groupedRoots.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-700">
                Balance Sheet Summary
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                FY {priorYear} compared with FY {selectedYear}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {groupedRoots.map((group) => {
                const totals = getTotals(group.items);
                const change = totals.current - totals.prior;

                return (
                  <div key={group.key} className="text-right">
                    <p className="text-[10px] font-medium text-slate-500">
                      {group.title}
                    </p>
                    <p className="text-xs font-bold text-slate-800">
                      {formatCurr(totals.current)}
                    </p>
                    <p
                      className={`text-[10px] font-medium ${
                        change >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {formatPercent(totals.current, totals.prior)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LoadingCard = () => (
  <div className="min-w-0 animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white">
    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-slate-200" />
        <div className="space-y-2">
          <div className="h-3 w-28 rounded bg-slate-200" />
          <div className="h-2 w-20 rounded bg-slate-100" />
        </div>
      </div>
      <div className="h-4 w-24 rounded bg-slate-200" />
    </div>
    <div className="space-y-3 p-4">
      <div className="h-5 rounded bg-slate-100" />
      <div className="h-5 rounded bg-slate-100" />
      <div className="h-5 rounded bg-slate-100" />
      <div className="h-5 w-4/5 rounded bg-slate-100" />
    </div>
  </div>
);

const AccountCard = ({
  groupKey,
  title,
  items,
  index,
  format,
  formatPercent,
  expandedSections,
  toggleCategory,
}) => {
  const categoryGroups = Object.values(
    items.reduce((acc, item) => {
      const category = item.fsSort2Desc || "Other Accounts";

      if (!acc[category]) {
        acc[category] = {
          name: category,
          rows: [],
          sort: Number(item.fsSort2) || 0,
        };
      }

      acc[category].rows.push(item);
      return acc;
    }, {}),
  ).sort((a, b) => a.sort - b.sort);

  const totals = items.reduce(
    (result, item) => {
      result.current += Number(item.amount) || 0;
      result.prior += Number(item.pyAmount) || 0;
      return result;
    },
    { current: 0, prior: 0 },
  );

  const totalChange = totals.current - totals.prior;

  const visuals = [
    {
      icon: <Landmark size={17} />,
      iconClass: "bg-blue-50 text-blue-700 border-blue-100",
      accentClass: "bg-blue-500",
    },
    {
      icon: <Wallet size={17} />,
      iconClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
      accentClass: "bg-emerald-500",
    },
    {
      icon: <PieChart size={17} />,
      iconClass: "bg-violet-50 text-violet-700 border-violet-100",
      accentClass: "bg-violet-500",
    },
  ];

  const visual = visuals[index % visuals.length];

  return (
    <section className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${visual.iconClass}`}
          >
            {visual.icon}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-800">
              {title}
            </h3>
            <p className="mt-0.5 text-[10px] text-slate-400">
              {categoryGroups.length} account categories
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          {/* <p className="text-[10px] font-medium text-slate-500">
            Current Year
          </p> */}
          <p className="text-sm font-bold tracking-tight text-slate-800">
            {format(totals.current)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[540px]">
          <div className="grid grid-cols-[minmax(0,2fr)_minmax(95px,1fr)_minmax(105px,1.1fr)_minmax(76px,.8fr)] gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">
            <div>Account</div>
            <div className="text-right">Prior Year</div>
            <div className="text-right">Current Year</div>
            <div className="text-right">YoY Change</div>
          </div>

          {/* Scrollable Category Rows */}
          <div className="max-h-[280px] overflow-y-auto overscroll-contain divide-y divide-slate-100">
            {categoryGroups.map((category) => {
              const categoryKey = `${groupKey}::${category.name}`;
              const isExpanded = expandedSections.has(categoryKey);

              const categoryTotals = category.rows.reduce(
                (result, item) => {
                  result.current += Number(item.amount) || 0;
                  result.prior += Number(item.pyAmount) || 0;
                  return result;
                },
                { current: 0, prior: 0 },
              );

              const change = categoryTotals.current - categoryTotals.prior;

              return (
                <div key={categoryKey}>
                  <button
                    type="button"
                    onClick={() => toggleCategory(categoryKey)}
                    aria-expanded={isExpanded}
                    className="grid w-full grid-cols-[minmax(0,2fr)_minmax(95px,1fr)_minmax(105px,1.1fr)_minmax(76px,.8fr)] items-center gap-2 px-3 py-1.5 text-left transition-colors hover:bg-blue-50/60"
                  >
                    <div className="flex min-w-0 items-center gap-1.5">
                      {isExpanded ? (
                        <ChevronDown
                          size={13}
                          className="shrink-0 text-blue-600"
                        />
                      ) : (
                        <ChevronRight
                          size={13}
                          className="shrink-0 text-slate-400"
                        />
                      )}

                      <span
                        className="truncate text-[11px] font-semibold text-slate-700"
                        title={category.name}
                      >
                        {category.name}
                      </span>
                    </div>

                    <div className="text-right font-mono text-[10px] text-slate-500">
                      {format(categoryTotals.prior)}
                    </div>

                    <div className="text-right font-mono text-[10px] font-semibold text-slate-800">
                      {format(categoryTotals.current)}
                    </div>

                    <div
                      className={`text-right font-mono text-[10px] font-semibold ${
                        change >= 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                      title={`Change: ${format(change)}`}
                    >
                      {formatPercent(
                        categoryTotals.current,
                        categoryTotals.prior,
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/50">
                      {category.rows.map((item, itemIndex) => {
                        const current = Number(item.amount) || 0;
                        const prior = Number(item.pyAmount) || 0;
                        const change = current - prior;
                        const accountId =
                          item.accountId ?? item.acctId ?? itemIndex;
                        const accountName =
                          item.fsSort3Desc ||
                          item.acctName ||
                          item.accountName ||
                          accountId;

                        return (
                          <div
                            key={`${accountId}-${itemIndex}`}
                            className="grid grid-cols-[minmax(0,2fr)_minmax(95px,1fr)_minmax(105px,1.1fr)_minmax(76px,.8fr)] items-center gap-2 border-b border-slate-100/80 px-3 py-1 pl-7 last:border-b-0 hover:bg-blue-50/40"
                          >
                            <div
                              className="min-w-0 truncate text-[10px] text-slate-600"
                              title={`${accountId} - ${accountName}`}
                            >
                              <span className="mr-1 font-mono text-[9px] text-slate-400">
                                {accountId}
                              </span>
                              <span>{accountName}</span>
                            </div>

                            <div className="text-right font-mono text-[10px] text-slate-500">
                              {format(prior)}
                            </div>

                            <div className="text-right font-mono text-[10px] font-medium text-slate-700">
                              {format(current)}
                            </div>

                            <div
                              className={`text-right font-mono text-[10px] ${
                                change >= 0
                                  ? "text-emerald-600"
                                  : "text-rose-600"
                              }`}
                              title={`Change: ${format(change)}`}
                            >
                              {formatPercent(current, prior)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-slate-200 bg-slate-50 px-3 py-2.5">
        <div className="grid grid-cols-4 items-center gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate-700">
              Total {title}
            </p>
          </div>

          <div className="min-w-0 text-right">
            <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500">
              Priod
            </p>
            <p className="truncate text-xs font-bold text-slate-800">
              {format(totals.prior)}
            </p>
          </div>
          <div className="min-w-0 text-right">
            <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500">
              Current
            </p>
            <p className="truncate text-xs font-bold text-slate-800">
              {format(totals.current)}
            </p>
          </div>

          <div className="min-w-0 text-right">
            <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500">
              YoY Change
            </p>
            <p
              className={`truncate text-xs font-bold ${
                totalChange >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {formatPercent(totals.current, totals.prior)}
            </p>
            <p className="truncate text-[10px] text-slate-500">
              {format(totalChange)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BalanceSheet;
