import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  ChevronDown,
  ChevronRight,
  Download,
  MessageSquare,
  RefreshCw,
  X,
} from "lucide-react";
import { backendUrl } from "./config";

/* ----------------------------- helpers ----------------------------- */

const showToast = (message, type = "info") => {
  const colors = {
    success: "#16a34a",
    error: "#dc2626",
    warning: "#d97706",
    info: "#2563eb",
  };
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; top: 16px; right: 16px; z-index: 99999;
    background: ${colors[type] || colors.info}; color: white;
    padding: 8px 12px; border-radius: 6px; font-size: 12px;
    max-width: 340px; box-shadow: 0 6px 18px rgba(0,0,0,.15);
    transition: opacity .25s;
  `;
  document.body.appendChild(toast);
  window.setTimeout(() => {
    toast.style.opacity = "0";
    window.setTimeout(() => toast.remove(), 250);
  }, 3000);
};

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    return null;
  }
};

const dateOnly = (value) =>
  value ? String(value).split("T")[0].slice(0, 10) : "";

const formatDate = (value) => {
  const date = dateOnly(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return value || "";
  const [year, month, day] = date.split("-");
  return `${Number(month)}/${Number(day)}/${year}`;
};

const numberValue = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const display = (value) =>
  value === null || value === undefined ? "" : String(value);

// "resource_Name" / "payTypeName" -> "Resource Name" / "Pay Type Name"
const humanize = (key) =>
  key
    .replace(/_/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());

// Format any raw value for the details view.
const formatAny = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  if (/^\d{4}-\d{2}-\d{2}(T|$)/.test(String(value))) return formatDate(value);
  return String(value);
};

const getStatus = (item) => item.approvalStatus || item.status || "PROCESSED";

/* ----------------------------- styles ----------------------------- */

const inputCls =
  "h-8 w-full rounded border border-gray-300 bg-white px-2 text-xs outline-none focus:border-[#17414d]";
const btnCls =
  "inline-flex h-8 items-center gap-1.5 rounded px-3 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50";

/* ----------------------------- component ----------------------------- */

export default function SubkTimesheetExport() {
  const [currentUser] = useState(readUser);
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  const perdiemValue = import.meta.env.VITE_PER_DIEM;

  const approverId =
    currentUser?.employeeId || currentUser?.name || currentUser?.userId || "";

  const fetchTimesheets = useCallback(async () => {
    if (!approverId) {
      showToast(
        "User information was not found. Please sign in again.",
        "error",
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/SubkTimesheet/GetByApprover?status=PROCESSED&isExported=false`,
      );
      const data = Array.isArray(response.data) ? response.data : [];

      // Stable unique key per row (falls back so rows never collide).
      setTimesheets(
        data.map((item, i) => ({
          ...item,
          // requestId can be 0 for every row; use the actual timesheet identity.
          _key: String(
            item.lineNo ??
              item.timesheetId ??
              `${item.resource_Id || item.resourceId || "resource"}-${dateOnly(item.timesheet_Date || item.timesheetDate)}-${item.projId || item.projectId || "project"}-${i}`,
          ),
        })),
      );
      setSelectedIds([]);
      setExpandedIds([]);
    } catch (error) {
      console.error("Failed to load export timesheets:", error);
      showToast(
        error?.response?.data?.message || "Failed to load timesheets.",
        "error",
      );
      setTimesheets([]);
    } finally {
      setLoading(false);
    }
  }, [approverId]);

  useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets]);

  const filteredTimesheets = useMemo(() => {
    const emp = employeeFilter.trim().toLowerCase();
    const name = nameFilter.trim().toLowerCase();
    const proj = projectFilter.trim().toLowerCase();

    return timesheets.filter((item) => {
      const rawDate = dateOnly(item.timesheet_Date || item.timesheetDate);
      if (fromDate && (!rawDate || rawDate < fromDate)) return false;
      if (toDate && (!rawDate || rawDate > toDate)) return false;

      if (
        emp &&
        !display(item.resource_Id || item.resourceId)
          .toLowerCase()
          .includes(emp)
      )
        return false;
      if (
        name &&
        !display(item.resource_Name || item.resourceName || item.displayedName)
          .toLowerCase()
          .includes(name)
      )
        return false;
      if (
        proj &&
        !display(item.projId || item.projectId)
          .toLowerCase()
          .includes(proj)
      )
        return false;
      return true;
    });
  }, [timesheets, fromDate, toDate, employeeFilter, nameFilter, projectFilter]);

  const filteredKeys = useMemo(
    () => filteredTimesheets.map((t) => t._key),
    [filteredTimesheets],
  );
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allFilteredSelected =
    filteredKeys.length > 0 && filteredKeys.every((k) => selectedSet.has(k));

  const selectedTimesheets = useMemo(
    () => filteredTimesheets.filter((t) => selectedSet.has(t._key)),
    [filteredTimesheets, selectedSet],
  );

  const toggleSelect = (key, checked) =>
    setSelectedIds((prev) =>
      checked ? [...new Set([...prev, key])] : prev.filter((id) => id !== key),
    );

  const toggleAllFiltered = (checked) =>
    setSelectedIds((prev) =>
      checked
        ? [...new Set([...prev, ...filteredKeys])]
        : prev.filter((id) => !filteredKeys.includes(id)),
    );

  const toggleExpanded = (key) =>
    setExpandedIds((prev) =>
      prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key],
    );

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setEmployeeFilter("");
    setNameFilter("");
    setProjectFilter("");
  };

  const hasFilters =
    fromDate || toDate || employeeFilter || nameFilter || projectFilter;

  /* ----------------------------- export ----------------------------- */

  const handleExport = async () => {
    if (!selectedTimesheets.length) {
      showToast("Select at least one timesheet to export.", "warning");
      return;
    }

    const headers = [
      "TxnDate",
      "Name (Employee Name)",
      "Time",
      "StartTime",
      "EndTime",
      "Description",
      "BillableStatus",
      "Customer",
      "ServiceItem (PLC)",
      "HourlyRate",
      "Taxable",
      "Class",
      "Location",
      "Superivor",
      "Cost Rate",
      "OT Bill Rate",
      "Per Diem",
    ];

    const exportRows = [];
    selectedTimesheets.forEach((timesheet) => {
        console.log(timesheet)
      const dailyHours = Array.isArray(timesheet.timesheetHours)
        ? timesheet.timesheetHours.filter(
            (entry) => entry && typeof entry === "object",
          )
        : [];

      dailyHours.forEach((dailyEntry) => {
        exportRows.push({
          TxnDate: formatDate(dailyEntry.ts_Date || dailyEntry.tsDate),
          "Name (Employee Name)":
            timesheet.resource_Name ||
            timesheet.resourceName ||
            timesheet.displayedName ||
            timesheet.resource_Id ||
            "",
          Time: numberValue(dailyEntry.hours).toFixed(2),
          StartTime: "",
          EndTime: "",
          Description: timesheet.description || timesheet.resource_Id || "",
          BillableStatus: "Billable",
          Customer: timesheet.customerId || "",
          "ServiceItem (PLC)": timesheet.plcDesc
            ? `${timesheet.plc || ""} - ${timesheet.plcDesc}`
            : timesheet.plc || "",
          HourlyRate: timesheet.costRate != null ? `$${Number(timesheet.costRate).toFixed(2)}` : "",
          Taxable: false,
          Class: timesheet.empl_class ?? "",
          Location: "",
          Superivor: timesheet.pm_User_Id || timesheet.pmUserId || "",
          "Cost Rate": timesheet.costRate != null ? `$${Number(timesheet.costRate).toFixed(2)}` : "",
          "OT Bill Rate": timesheet.otCostRate != null ? `$${Number(timesheet.otCostRate).toFixed(2)}` : "",
          "Per Diem": perdiemValue ? `$${Number(perdiemValue).toFixed(2)}` : "",
          // "Per Diem": timesheet.perDiem ?? "",
        });
      });
    });

    if (!exportRows.length) {
      showToast(
        "The selected timesheets have no daily hours to export.",
        "warning",
      );
      return;
    }

    setExporting(true);
    const today = new Date().toISOString().slice(0, 10);
    const fileName = `Subk_Timesheets_${today}.xlsx`;

    try {
      const worksheet = XLSX.utils.json_to_sheet(exportRows, {
        header: headers,
      });
      worksheet["!cols"] = [
        14, 28, 10, 12, 12, 30, 16, 32, 28, 12, 10, 14, 16, 24, 12, 14, 12,
      ].map((wch) => ({ wch }));
      worksheet["!autofilter"] = { ref: worksheet["!ref"] };

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Subk Timesheets");
      XLSX.writeFile(workbook, fileName);

      console.log(selectedTimesheets)
      const requestIds = selectedTimesheets
        .map((item) => Number(item.lineNo))
        .filter((id) => Number.isInteger(id) && id > 0);

      if (requestIds.length !== selectedTimesheets.length) {
        // showToast(
        //   "Excel was generated, but some records have no valid requestId. Export status was not updated.",
        //   "warning",
        // );
        return;
      }

      const timesheetIds = selectedTimesheets
        .map((item) => Number(item.lineNo ?? item.timesheetId ?? item.timesheet_Id))
        .filter((id) => Number.isInteger(id) && id > 0);

        if (timesheetIds.length !== selectedTimesheets.length) {
            console.log("Hello")
        showToast("Some timesheets have an invalid ID.", "warning");
        return;
        }

        await axios.post(
        `${backendUrl}/api/SubkTimesheet/SetTimesheetExported?fileName=${encodeURIComponent(fileName)}`,
        timesheetIds
        );

      showToast(
        `Exported ${selectedTimesheets.length} timesheets (${exportRows.length} rows).`,
        "success",
      );
      await fetchTimesheets();
    } catch (error) {
      console.error("Timesheet export failed:", error);
      showToast(
        error?.response?.data?.message ||
          "Export tracking failed. Refresh and verify export status before trying again.",
        "error",
      );
    } finally {
      setExporting(false);
    }
  };

  /* ----------------------------- table config ----------------------------- */

  const columns = [
    // "Status",
    "Date",
    // "Line",
    "Emp ID",
    "Name",
    "Project",
    "PLC",
    // "Pay Type",
    "Hours",
    "Customer",
    "Approver",
  ];
  const colCount = columns.length + 2;

  /* ----------------------------- render ----------------------------- */

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 text-gray-800">
      <div className="mx-auto space-y-3">
        {/* Header */}
          <div className="w-full flex justify-between items-center mb-3 px-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    {/* Left Side: Icon and Title */}
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-6 w-6 text-blue-600" />
                      <div>
                        <h1 className="text-lg font-bold text-gray-800">
                          Timesheet export
                        </h1>
                      </div>
                    </div>
                  </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={fromDate}
            max={toDate || undefined}
            onChange={(e) => setFromDate(e.target.value)}
            aria-label="From date"
            className={`${inputCls} !w-36`}
          />
          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(e) => setToDate(e.target.value)}
            aria-label="To date"
            className={`${inputCls} !w-36`}
          />
          <input
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            placeholder="Employee ID"
            className={`${inputCls} !w-32`}
          />
          {/* <input
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            placeholder="Name"
            className={`${inputCls} !w-40`}
          /> */}
          <input
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            placeholder="Project"
            className={`${inputCls} !w-32`}
          />
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-8 items-center gap-1 rounded px-2 text-xs text-gray-500 hover:bg-gray-200 hover:text-gray-800"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
          </div>

         
            <div className="flex gap-2">
            <button
              type="button"
              onClick={fetchTimesheets}
              disabled={loading || exporting}
              className={`${btnCls} border border-gray-300 bg-white text-gray-700 hover:bg-gray-100`}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={exporting || loading || selectedTimesheets.length === 0}
              className={`${btnCls} bg-[#17414d] text-white hover:bg-[#10333d]`}
            >
              <Download className="h-3.5 w-3.5" />
              {exporting
                ? "Exporting…"
                : `Export (${selectedTimesheets.length})`}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="max-h-[75vh] overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full min-w-[980px] border-collapse text-left text-xs">
            <thead className="sticky top-0 z-10 bg-gray-100 text-gray-600">
              <tr>
                <th className="w-8 px-2 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={(e) => toggleAllFiltered(e.target.checked)}
                    disabled={
                      !filteredTimesheets.length || loading || exporting
                    }
                    aria-label="Select all filtered timesheets"
                    className="cursor-pointer accent-[#17414d]"
                  />
                </th>
                <th className="w-6 py-2" />
                {columns.map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-2 py-2 font-medium"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={colCount}
                    className="p-8 text-center text-gray-400"
                  >
                    Loading…
                  </td>
                </tr>
              ) : filteredTimesheets.length === 0 ? (
                <tr>
                  <td
                    colSpan={colCount}
                    className="p-8 text-center text-gray-400"
                  >
                    No timesheets match your filters.
                  </td>
                </tr>
              ) : (
                filteredTimesheets.map((item) => (
                  <TimesheetRow
                    key={item._key}
                    item={item}
                    colCount={colCount}
                    isSelected={selectedSet.has(item._key)}
                    isExpanded={expandedIds.includes(item._key)}
                    disabled={exporting}
                    onSelect={toggleSelect}
                    onExpand={toggleExpanded}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* <p className="text-[11px] text-gray-400">
          Checked rows are exported together with all their daily hours.
        </p> */}
      </div>
    </div>
  );
}

/* ----------------------------- row ----------------------------- */

const TimesheetRow = React.memo(function TimesheetRow({
  item,
  colCount,
  isSelected,
  isExpanded,
  disabled,
  onSelect,
  onExpand,
}) {
  const key = item._key;
  const hours = Array.isArray(item.timesheetHours) ? item.timesheetHours : [];
  const totalHours = hours.reduce(
    (sum, day) => sum + numberValue(day?.hours),
    0,
  );

  const plc = item.plcDesc ? `${item.plc || ""} - ${item.plcDesc}` : item.plc;
  const payType = item.payTypeName
    ? `${item.payTypeName}${item.payTypeDescription ? ` - ${item.payTypeDescription}` : ""}`
    : item.payType;

  const cell = "px-2 py-1.5";

  return (
    <>
      <tr
        className={`border-t border-gray-100 ${
          isSelected ? "bg-blue-50/60" : "hover:bg-gray-50"
        }`}
      >
        <td className="px-2 py-1.5 text-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(key, e.target.checked)}
            disabled={disabled}
            aria-label={`Select timesheet ${key}`}
            className="cursor-pointer accent-[#17414d]"
          />
        </td>
        <td className="py-1.5">
          <button
            type="button"
            onClick={() => onExpand(key)}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
            className="rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-[#17414d]"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </td>
        {/* <td className={cell}>
          <span className="rounded bg-violet-50 px-1.5 py-0.5 text-[11px] font-medium text-violet-700">
            {display(getStatus(item))}
          </span>
        </td> */}
        <td className={`${cell} whitespace-nowrap`}>
          {formatDate(item.timesheet_Date || item.timesheetDate)}
        </td>
        {/* <td className={cell}>{display(item.lineNo ?? item.timesheetId)}</td> */}
        <td className={cell}>{display(item.resource_Id || item.resourceId)}</td>
        <td className={cell}>{display(item.plc || item.plcName)}</td>
        <td className={cell}>{display(item.projId || item.projectId)}</td>
        <td className={cell}>{display(plc)}</td>
        {/* <td className={cell}>{display(payType)}</td> */}
        <td className={`${cell} font-medium tabular-nums`}>
          {totalHours.toFixed(2)}
        </td>
        <td className={cell}>{display(item.customerId)}</td>
        <td className={cell}>{display(item.pm_User_Id || item.pmUserId)}</td>
      </tr>

      {isExpanded && (
        <tr className="border-t border-gray-100 bg-gray-50">
          <td colSpan={colCount} className="px-4 py-3">
            <Details item={item} hours={hours} totalHours={totalHours} />
          </td>
        </tr>
      )}
    </>
  );
});

function Details({ item, hours, totalHours }) {
  // Ignore null daily entries returned by the API.
  const validHours = hours.filter((day) => day && typeof day === "object");

  return (
    <div className="space-y-2">
      {/* <div className="text-[11px] font-medium text-gray-600">
        Daily entries · {validHours.length} record(s) · {totalHours.toFixed(2)} hrs
      </div> */}

      {validHours.length ? (
        <div className="relative max-h-60 w-full min-w-0 overflow-auto rounded border border-gray-200 bg-white">
          {" "}
            <table className="w-max min-w-full text-left text-xs">
                <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="whitespace-nowrap px-3 py-2 font-medium">
                  Date
                </th>
                <th className="whitespace-nowrap px-3 py-2 font-medium">
                  Hours
                </th>
                {/* <th className="whitespace-nowrap px-3 py-2 font-medium">
                  Comment
                </th> */}
                <th className="whitespace-nowrap px-3 py-2 font-medium">
                  Created At
                </th>
                <th className="whitespace-nowrap px-3 py-2 font-medium">
                  Updated At
                </th>
              </tr>
            </thead>
            <tbody>
              {validHours.map((day, index) => (
                <tr
                  key={day.id ?? `${item._key}-day-${index}`}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-3 py-2">
                    {formatDate(day.ts_Date || day.tsDate)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 tabular-nums">
                    {numberValue(day.hours).toFixed(2)}
                  </td>
                  {/* <td className="px-3 py-2">{display(day.comment)}</td> */}
                  <td className="whitespace-nowrap px-3 py-2">
                    {formatAny(day.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {formatAny(day.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded border border-dashed border-gray-300 bg-white p-3 text-center text-xs text-gray-400">
          No daily hours for this timesheet.
        </div>
      )}
    </div>
  );
}
