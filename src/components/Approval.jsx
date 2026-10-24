import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  MessageSquare,
  Download,
  Receipt,
  Package,
  Users,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import TimesheetApprovalModal from "./TimesheetApprovalModal";
import { backendUrl } from "./config";
import TimesheetHistoryTable from "./TimesheetHistoryTable";
import TimesheetRevisionTable from "./TimesheetRevisionTable";

const showToast = (message, type = "info") => {
  const bgColor =
    type === "success"
      ? "#4ade80"
      : type === "error"
        ? "#ef4444"
        : type === "warning"
          ? "#f59e0b"
          : "#3b82f6";
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 9999;
    background: ${bgColor}; color: white; padding: 12px 16px;
    border-radius: 6px; font-size: 14px; max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.3s ease;
  `;
  document.body.appendChild(toast);
  const displayTime =
    message.includes("import") || message.includes("Import") ? 4000 : 1000;
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => document.body.removeChild(toast), 300);
  }, displayTime);
};

const getUserIPAddress = async () => {
  try {
    const endpoints = [
      "https://api.ipify.org?format=json",
      "https://ipapi.co/json/",
      "https://httpbin.org/ip",
    ];
    for (const url of endpoints) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          return data.ip || data.origin || "";
        }
      } catch {}
    }
    return "";
  } catch {
    return "";
  }
};

// Updated columns with Work Order after Name
const columnsAdmin = [
  "All",
  "Status",
  "Timesheet Date",
  "Employee ID",
  "Name",
  // "Work Order",
  "Hours",
  "Approver ID",
  "Approver Name",
];

const ReasonModal = ({
  isOpen,
  action,
  selectedCount,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState("");
  useEffect(() => {
    if (isOpen) setReason("");
  }, [isOpen]);
  if (!isOpen) return null;
  const handleConfirm = () =>
    reason.trim()
      ? onConfirm(reason.trim())
      : showToast("Please provide a reason.", "warning");
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) handleConfirm();
    else if (e.key === "Escape") onCancel();
  };

  const getActionLabel = (a) => {
    if (!a) return "";
    const upper = a.toUpperCase();

    if (upper === "CORRECTED" || upper === "CORRECTION") return "Correct";
    if (upper === "REJECTED" || upper === "REJECT") return "Reject";
    if (upper === "APPROVED" || upper === "APPROVE") return "Approve";

    // fallback: generic capitalize
    return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase();
  };

  const label = getActionLabel(action);

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl p-6 w-96 max-w-[90vw] shadow-2xl border border-gray-100 animate-premium-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-900 mb-1">
            {label} Timesheets
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            You are about to {action} {selectedCount} timesheet
            {selectedCount > 1 ? "s" : ""}. Please provide a reason:
          </p>
        </div>
        <div className="mb-4">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Enter reason for ${label.toLowerCase()} these timesheets...`}
            className="w-full h-24 p-2.5 border border-gray-300 rounded-md text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-inner"
            maxLength={500}
            autoFocus
          />
          <div className="text-[11px] text-gray-500 mt-1">
            {reason.length}/500 characters • Press Ctrl+Enter to confirm • Esc
            to cancel
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="btn1 btn-inactive cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="btn1 btn-blue cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {label}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Approval() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedNotifyRows, setSelectedNotifyRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [notifySelectAll, setNotifySelectAll] = useState(false);
  const [unifiedSelectAll, setUnifiedSelectAll] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [searchEmployeeName, setSearchEmployeeName] = useState("");
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [selectedResourceType, setSelectedResourceType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const timesheetDetailsRef = useRef(null);
  const [currentSelectedRowId, setCurrentSelectedRowId] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [userIpAddress, setUserIpAddress] = useState("");
  const [selectedTimesheetDate, setSelectedTimesheetDate] = useState(null);
  const [selectedTimesheetLines, setSelectedTimesheetLines] = useState([]);
  // const [searchStatus, setSearchStatus] = useState("");
  const [searchStatus, setSearchStatus] = useState([]);
  const [correctionLoading, setCorrectionLoading] = useState(false);
  const [processedLoading, setProcessedLoading] = useState(false);
  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
  const currentYear = String(now.getFullYear());
  const [filterMonth, setFilterMonth] = useState(currentMonth);
  const [filterYear, setFilterYear] = useState(currentYear);
  const [statusHoverRow, setStatusHoverRow] = useState(null);
  const [approvalPanelRow, setApprovalPanelRow] = useState(null);

  const [showHistory, setShowHistory] = useState(false);
  const [showRevision, setShowRevision] = useState(false);
  const [selectedTimesheetRows, setSelectedTimesheetRows] = useState([]);
  const [dateToLineNos, setDateToLineNos] = useState({});

  useEffect(() => {
    const today = new Date();
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth();
    const day = today.getUTCDate();
    const dayOfWeek = today.getUTCDay();
    const todayUTC = new Date(Date.UTC(year, month, day));
    const daysToAdd = (7 - dayOfWeek) % 7;
    todayUTC.setUTCDate(todayUTC.getUTCDate() + daysToAdd);
    const finalYear = todayUTC.getUTCFullYear();
    const finalMonth = String(todayUTC.getUTCMonth() + 1).padStart(2, "0");
    const finalDay = String(todayUTC.getUTCDate()).padStart(2, "0");
    const formattedDateForState = `${finalYear}-${finalMonth}-${finalDay}`;
  }, []);

  function convertDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
  }

  console.log(currentUser);
  const isAdmin = currentUser?.role.toUpperCase() === "ADMIN";
  const isUser = currentUser?.role === "user" || currentUser?.role === "User";
  const isPM = currentUser?.role === "pm";
  const columns = columnsAdmin;
  const colWidth = 150;
  const minTableWidth = columns.length * colWidth;

  const userId = currentUser?.name || "";

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch {
      return dateString;
    }
  };

  const formatHours = (hours) => {
    if (!hours && hours !== 0) return "";
    const numHours = parseFloat(hours);
    if (isNaN(numHours)) return hours;
    return numHours.toFixed(2);
  };

  const formatDateForDateInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const formatDateFromInput = (inputDate) => {
    if (!inputDate) return "";
    try {
      const date = new Date(inputDate + "T00:00:00");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    } catch {
      return "";
    }
  };

  const getSortedRows = (rowsToSort) => {
    let sorted = [...rowsToSort];

    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aVal, bVal;

        if (sortConfig.key === "Timesheet Date") {
          aVal = new Date(a.originalDate || a["Timesheet Date"]);
          bVal = new Date(b.originalDate || b["Timesheet Date"]);
          if (isNaN(aVal.getTime())) aVal = new Date(0);
          if (isNaN(bVal.getTime())) bVal = new Date(0);
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        } else if (sortConfig.key === "Hours") {
          aVal = parseFloat(a["Hours"]) || 0;
          bVal = parseFloat(b["Hours"]) || 0;
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        } else if (
          [
            "Employee ID",
            "Project ID",
            "PO Number",
            "PO Line Number",
            "RLSE Number",
          ].includes(sortConfig.key)
        ) {
          aVal = parseInt(a[sortConfig.key]) || 0;
          bVal = parseInt(b[sortConfig.key]) || 0;
          if (aVal === bVal) {
            aVal = String(a[sortConfig.key] || "").toLowerCase();
            bVal = String(b[sortConfig.key] || "").toLowerCase();
            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
          }
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        } else if (sortConfig.key === "Status") {
          const getStatusPriority = (status) => {
            const statusUpper = String(status || "PENDING").toUpperCase();
            switch (statusUpper) {
              case "OPEN":
                return 1;
              case "PENDING":
                return 2;
              case "APPROVED":
                return 3;
              case "REJECTED":
                return 4;
              default:
                return 5;
            }
          };

          aVal = getStatusPriority(a["Status"]);
          bVal = getStatusPriority(b["Status"]);

          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        } else {
          aVal = String(a[sortConfig.key] || "").toLowerCase();
          bVal = String(b[sortConfig.key] || "").toLowerCase();
          if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        }
      });
    } else {
      sorted.sort((a, b) => {
        const aLineNo = parseInt(a.lineNo) || 0;
        const bLineNo = parseInt(b.lineNo) || 0;
        if (aLineNo !== bLineNo) {
          return aLineNo - bLineNo;
        }

        let aDate = new Date(a.originalDate || a[" Timesheet Date"]);
        let bDate = new Date(b.originalDate || b[" Timesheet Date"]);
        if (isNaN(aDate.getTime())) aDate = new Date(0);
        if (isNaN(bDate.getTime())) bDate = new Date(0);
        if (aDate.getTime() !== bDate.getTime()) {
          return bDate.getTime() - aDate.getTime();
        }

        const aEmpId = String(a["Employee ID"] || "").toLowerCase();
        const bEmpId = String(b["Employee ID"] || "").toLowerCase();
        return aEmpId.localeCompare(bEmpId);
      });
    }

    return sorted;
  };

  const handleSort = (key) => {
    if (key === "All") return;
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (columnKey === "All") return null;

    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "asc" ? " ↑" : " ↓";
    }
    return " ⇅";
  };

  const getStatusStyle = (status) => {
    const statusProper =
      status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase() ||
      "Pending";

    switch (status?.toUpperCase()) {
      case "OPEN":
        return {
          backgroundColor: "#dbeafe",
          color: "#2563eb",
          fontWeight: "600",
          padding: "4px 8px",
          fontSize: "11px",
          display: "inline-block",
          borderRadius: "9999px",
        };
      case "APPROVED":
        return {
          backgroundColor: "#dcfce7",
          color: "#16a34a",
          fontWeight: "600",
          padding: "4px 8px",
          fontSize: "11px",
          display: "inline-block",
          borderRadius: "9999px",
        };
      case "REJECTED":
        return {
          backgroundColor: "#fce7f3",
          color: "#ec4899",
          fontWeight: "600",
          padding: "4px 8px",
          fontSize: "11px",
          display: "inline-block",
          borderRadius: "9999px",
        };
      case "PENDING":
        return {
          backgroundColor: "#fef9c3",
          color: "#ca8a04",
          fontWeight: "600",
          padding: "4px 8px",
          fontSize: "11px",
          display: "inline-block",
          borderRadius: "9999px",
        };
      case "SUBMITTED":
        return {
          backgroundColor: "#e0e7ff",
          color: "#4338ca",
          fontWeight: "600",
          padding: "4px 8px",
          fontSize: "11px",
          display: "inline-block",
          borderRadius: "9999px",
        };
      case "PROCESSED":
        return {
          backgroundColor: "#dacbf8ff",
          color: "rgba(153, 110, 192, 1)",
          fontWeight: "600",
          padding: "4px 8px",
          fontSize: "11px",
          display: "inline-block",
          borderRadius: "9999px",
        };
      case "NOTIFIED":
        return {
          backgroundColor: "#dbeafe",
          color: "#2563eb",
          fontWeight: "600",
          padding: "4px 8px",
          fontSize: "11px",
          display: "inline-block",
          borderRadius: "9999px",
        };
      case "UN-NOTIFIED":
      case "UNNOTIFIED":
        return {
          backgroundColor: "#dcfce7",
          color: "#16a34a",
          fontWeight: "600",
          padding: "4px 8px",
          fontSize: "11px",
          display: "inline-block",
          borderRadius: "9999px",
        };
      case "CORRECTION":
        return {
          backgroundColor: "#FFE0B2", // soft light orange
          color: "#784421", // dark orange/brown
          fontWeight: "600",
          padding: "4px 8px",
          fontSize: "11px",
          display: "inline-block",
          borderRadius: "9999px",
        };
      default:
        return {
          backgroundColor: "#f3f4f6",
          color: "#6b7280",
          fontWeight: "500",
          padding: "4px 8px",
          fontSize: "11px",
          display: "inline-block",
          borderRadius: "9999px",
        };
    }
  };

  const isRowActionable = (row) => {
    const status = row.status?.toLowerCase();
    return (
      (status === "pending" ||
        status === "open" ||
        status === "un-notified" ||
        status === "submitted" ||
        status === "approved" ||
        status === "processed") &&
      !row.isRejected &&
      status !== "rejected"
    );
  };

  // Create a separate function for approved rows that can only be rejected
  const isApprovedRowRejectableOnly = (row) => {
    const status = row.status?.toLowerCase();
    return status === "approved" && !row.isRejected;
  };

  const scrollToTimesheetDetail = () => {
    setTimeout(() => {
      const timesheetDetailElement = document.querySelector(
        "[data-timesheet-detail]",
      );
      if (timesheetDetailElement) {
        timesheetDetailElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  // const handleRowClick = (rowData, event) => {
  //   if (event?.target?.type === "checkbox") return;

  //   setSelectedResourceId(rowData["Employee ID"]);
  //   setSelectedTimesheetDate(rowData.timesheetDateRaw);

  //    // collect ALL line numbers for this timesheet date
  // const clickedDate = rowData.timesheetDateRaw; // ensure same format as in rows
  // const linesForDate = rows
  //   .filter(r => r.timesheetDateRaw === clickedDate)
  //   .map(r => r.lineNo);

  // console.log("Row click -> date:", clickedDate, "lines:", linesForDate);

  // setSelectedTimesheetLines(linesForDate);   // [1,2,3,...] for that date
  // setCurrentSelectedRowId(rowData.id);

  //   setTimeout(() => {
  //     if (timesheetDetailsRef.current) {
  //       timesheetDetailsRef.current.scrollIntoView({
  //         behavior: "smooth",
  //         block: "start",
  //         inline: "nearest",
  //       });
  //     }
  //   }, 100);
  // };

  // const handleRowClick = (rowData, event) => {
  //   if (event?.target?.type === "checkbox") return;

  //   const clickedDate =
  //     rowData.timesheetDateRaw || rowData.timesheet_Date; // e.g. "2025-11-02"

  //   setSelectedResourceId(rowData["Employee ID"]);
  //   setSelectedTimesheetDate(clickedDate);

  //   const linesForDate = dateToLineNos[clickedDate] || [];

  //   console.log("Row click -> date:", clickedDate, "lines:", linesForDate);

  //   setSelectedTimesheetLines(linesForDate);
  //   setCurrentSelectedRowId(rowData.id);

  //   setTimeout(() => {
  //     if (timesheetDetailsRef.current) {
  //       timesheetDetailsRef.current.scrollIntoView({
  //         behavior: "smooth",
  //         block: "start",
  //         inline: "nearest",
  //       });
  //     }
  //   }, 100);
  // };

  const handleRowClick = (rowData, event) => {
    if (event?.target?.type === "checkbox") return;

    const clickedDate = rowData.timesheetDateRaw || rowData.timesheet_Date; // e.g. "2025-11-02"

    const employeeId = String(rowData["Employee ID"]).trim();
    const approverId = String(rowData["Approver ID"]).trim();

    // Composite key must match the one used when building dateToLineNos
    const key = `${employeeId}|${approverId}|${clickedDate}`;

    const linesForKey = dateToLineNos[key] || [];

    console.log(
      "Row click -> key:",
      key,
      "date:",
      clickedDate,
      "lines:",
      linesForKey,
    );

    setSelectedResourceId(employeeId);
    setSelectedTimesheetDate(clickedDate);
    setSelectedTimesheetLines(linesForKey);
    setSelectedResourceType(rowData.resource_Type || "");
    setCurrentSelectedRowId(rowData.id);

    setTimeout(() => {
      if (timesheetDetailsRef.current) {
        timesheetDetailsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }, 100);
  };

  const handleCloseDetails = () => {
    setSelectedResourceId(null);
    setSelectedResourceType(null);
  };

  useEffect(() => {
    getUserIPAddress().then((ip) => setUserIpAddress(ip || ""));
  }, []);

  useEffect(() => {
    const userInfo = localStorage.getItem("currentUser");
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        if (!parsedUser.name) {
          parsedUser.name =
            parsedUser.id === "john"
              ? "john.doe"
              : parsedUser.id === "jane"
                ? "jane.smith"
                : parsedUser.id;
        }
        setCurrentUser(parsedUser);
        setUserLoaded(true);
      } catch (error) {
        showToast("Session expired. Please login again.", "error");
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    setSelectedRows([]);
    setSelectedNotifyRows([]);
    setSelectAll(false);
    setNotifySelectAll(false);
    setUnifiedSelectAll(false);
    setSearchStatus(""); // Reset status filter
    setSelectedResourceType(null);
  }, []);

  // useEffect(() => {
  //   if (userLoaded && currentUser && currentUser.name) fetchData();
  // }, [userLoaded, currentUser]);

  useEffect(() => {
    if (userLoaded && currentUser && currentUser.name) {
      fetchData();
    }
  }, [userLoaded, currentUser, filterMonth, filterYear]);

  useEffect(() => {
    if (!searchDate) return;
    const [y, m] = searchDate.split("-");
    setFilterYear(y);
    setFilterMonth(m);
  }, [searchDate]);

  const groupDuplicateTimesheets = (timesheets) => {
    console.log("Input timesheets for grouping:", timesheets);

    if (!Array.isArray(timesheets) || timesheets.length === 0) {
      return [];
    }

    // Create a map to group by Employee ID + Timesheet Date
    const groupMap = new Map();

    timesheets.forEach((timesheet, index) => {
      const employeeId = String(timesheet["Employee ID"] || "").trim();
      const timesheetDate =
        timesheet.originalDate || timesheet["Timesheet Date"];
      const key = `${employeeId}|${timesheetDate}`;

      console.log(`Processing row ${index}:`, {
        employeeId,
        timesheetDate,
        key,
        hours: timesheet.Hours,
      });

      if (groupMap.has(key)) {
        // Group exists - sum the hours
        const existingEntry = groupMap.get(key);
        const currentHours = parseFloat(timesheet.Hours) || 0;
        const existingHours = parseFloat(existingEntry.Hours) || 0;
        const summedHours = existingHours + currentHours;

        console.log(
          `Combining hours: ${existingHours} + ${currentHours} = ${summedHours}`,
        );

        existingEntry.Hours = formatHours
          ? formatHours(summedHours)
          : summedHours.toFixed(2);

        // Combine metadata for bulk operations
        existingEntry.combinedIds = existingEntry.combinedIds || [
          existingEntry.id,
        ];
        existingEntry.combinedIds.push(timesheet.id);

        existingEntry.combinedRequestIds = existingEntry.combinedRequestIds || [
          existingEntry.requestId,
        ];
        if (
          timesheet.requestId &&
          !existingEntry.combinedRequestIds.includes(timesheet.requestId)
        ) {
          existingEntry.combinedRequestIds.push(timesheet.requestId);
        }

        existingEntry.combinedLineNos = existingEntry.combinedLineNos || [
          existingEntry.lineNo,
        ];
        if (
          timesheet.lineNo &&
          !existingEntry.combinedLineNos.includes(timesheet.lineNo)
        ) {
          existingEntry.combinedLineNos.push(timesheet.lineNo);
        }

        if (!existingEntry.resource_Type && timesheet.resource_Type) {
          existingEntry.resource_Type = timesheet.resource_Type;
        }
      } else {
        // First entry for this key
        const groupedEntry = { ...timesheet };
        groupedEntry.combinedIds = [timesheet.id];
        groupedEntry.combinedRequestIds = [timesheet.requestId];
        groupedEntry.combinedLineNos = [timesheet.lineNo];
        groupMap.set(key, groupedEntry);

        console.log(`Created new group for key: ${key}`, groupedEntry);
      }
    });

    const result = Array.from(groupMap.values());
    console.log("Final grouped result:", result);
    return result;
  };

  const fetchData = async () => {
    if (!userLoaded || !currentUser || !currentUser.name) return;

    try {
      setLoading(true);

      const resourceId = currentUser.name;
      const role = currentUser.role.toUpperCase();
      // &month=${filterMonth}&year=${filterYear}
      const apiUrl = `${backendUrl}/api/SubkTimesheet/pending-approvalsByUser?Username=${resourceId}&status=ALL&month=${filterMonth}&year=${filterYear}`;
      console.log("Fetching from:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // const apiData = await response.json();
      // console.log("Raw API Response:", apiData);

      // // Transform the nested structure into flat rows
      // const flattenedData = [];
      const apiData = await response.json();
      console.log("Raw API Response:", apiData);

      // -----------------------------
      // Build date -> lineNos lookup
      // -----------------------------
      // const dateToLineNos = {};

      // if (Array.isArray(apiData)) {
      //   apiData.forEach((ts) => {
      //     const date = ts.timesheet_Date;
      //     if (!date) return;

      //     const hoursArray = Array.isArray(ts.timesheetHours)
      //       ? ts.timesheetHours
      //       : [];

      //     const lineNosForEntry = hoursArray
      //       .map((h) => Number(h.lineNo))
      //       .filter((n) => !Number.isNaN(n));

      //     if (!dateToLineNos[date]) dateToLineNos[date] = [];
      //     dateToLineNos[date].push(...lineNosForEntry);
      //   });
      // }

      // // dedupe line numbers per date
      // Object.keys(dateToLineNos).forEach((d) => {
      //   dateToLineNos[d] = [...new Set(dateToLineNos[d])];
      // });

      // setDateToLineNos(dateToLineNos);
      const dateToLineNos = {};

      if (Array.isArray(apiData)) {
        apiData.forEach((ts) => {
          const date = ts.timesheet_Date;
          const employeeId = ts.resource_Id || ts.resourceId;
          const approverId = ts.pm_User_Id || ts.pmUserId || ts.approverUserId;

          // const resourceType = "user";

          if (!date || !employeeId || !approverId) {
            console.log("Skipping entry - missing required fields:", {
              date,
              employeeId,
              approverId,
            });
            return;
          }

          const hoursArray = Array.isArray(ts.timesheetHours)
            ? ts.timesheetHours
            : [];

          const lineNosForEntry = hoursArray
            .map((h) => Number(h.lineNo))
            .filter((n) => !Number.isNaN(n));

          const key = `${employeeId}|${approverId}|${date}`;

          if (!dateToLineNos[key]) dateToLineNos[key] = [];
          dateToLineNos[key].push(...lineNosForEntry);

          // Debug log INSIDE the loop - variables are in scope here
          console.log("Processing ts:", {
            date,
            employeeId,
            approverId,
            lineNosForEntry,
            key,
          });
        });
      }

      // Deduplicate line numbers per composite key
      Object.keys(dateToLineNos).forEach((key) => {
        dateToLineNos[key] = [...new Set(dateToLineNos[key])];
      });

      console.log("Final dateToLineNos:", dateToLineNos);

      setDateToLineNos(dateToLineNos);

      // -----------------------------
      // Transform the nested structure into flat rows (existing logic)
      // -----------------------------
      const flattenedData = [];

      if (Array.isArray(apiData)) {
        apiData.forEach((timesheetEntry, entryIndex) => {
          console.log(
            `Processing timesheet entry ${entryIndex}:`,
            timesheetEntry,
          );

          // Calculate total hours from all daily hours for this timesheet entry
          let totalHours = 0;
          if (
            timesheetEntry.timesheetHours &&
            Array.isArray(timesheetEntry.timesheetHours)
          ) {
            totalHours = timesheetEntry.timesheetHours.reduce(
              (sum, dailyHour) => sum + (parseFloat(dailyHour.hours) || 0),
              0,
            );
          }

          // Create a single row per timesheet entry (not per daily hour)
          const row = {
            id: timesheetEntry.lineNo, // Use lineNo as the unique identifier
            requestId: timesheetEntry.requestId,
            levelNo: timesheetEntry.levelNo || 1,
            lineNo: timesheetEntry.lineNo,
            selected: false,
            notifySelected: false,
            isApproved:
              timesheetEntry.approvalStatus?.toLowerCase() === "approved",
            isRejected:
              timesheetEntry.approvalStatus?.toLowerCase() === "rejected",
            isNotified:
              timesheetEntry.approvalStatus?.toLowerCase() === "notified",
            approvalActions: timesheetEntry.approvalActions || [],
            // Display fields
            status: timesheetEntry.approvalStatus?.toLowerCase(),
            Status: timesheetEntry.approvalStatus,
            "Timesheet Date": convertDate(timesheetEntry.timesheet_Date),
            "Employee ID": timesheetEntry.resource_Id,
            Name: timesheetEntry.resource_Name || timesheetEntry.displayedName,
            "Work Order":
              timesheetEntry.workOrder || timesheetEntry.work_Order || "",
            Hours: formatHours(totalHours), // Use calculated total hours
            "Approver ID": timesheetEntry.pm_User_Id || "",
            "Approver Name":
              timesheetEntry.pm_Name || timesheetEntry.pmName || "",
            timesheetDateRaw: timesheetEntry.timesheet_Date,
            // Additional fields for operations
            originalDate: timesheetEntry.timesheet_Date,
            approverUserId: timesheetEntry.approverUserId,
            Comment: timesheetEntry.comment || "",

            // Store the raw hours array for grouping operations
            rawHoursData: timesheetEntry.timesheetHours || [],
            resource_Type:
              timesheetEntry.resource_Type || timesheetEntry.type || "",
          };

          flattenedData.push(row);
          console.log(
            `Added flattened row with total hours ${totalHours}:`,
            row,
          );
        });
      }

      console.log("All flattened data before grouping:", flattenedData);

      // Apply grouping to combine duplicate Employee ID + Date entries
      const groupedData = groupDuplicateTimesheets(flattenedData);
      console.log("Final grouped data:", groupedData);

      setRows(groupedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast(`Error fetching data: ${error.message}`, "error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Sync searchDate as first day of filter month/year
    if (filterMonth && filterYear) {
      setSearchDate(`${filterYear}-${filterMonth}-01`);
    }
  }, [filterMonth, filterYear]);

  const getFilteredRows = () => {
    let filtered = rows;
    if (!Array.isArray(filtered)) return [];

    // if (searchDate) {
    //   const searchDateFormatted = formatDateFromInput(searchDate);
    //   filtered = filtered.filter((row) => {
    //     const rowDate = row["Timesheet Date"];
    //     return rowDate === searchDateFormatted;
    //   });
    // }

    if (searchDate) {
      // Here you might want to filter by month/year only, not exact date
      const filterYear = searchDate.split("-")[0];
      const filterMonth = searchDate.split("-")[1];
      filtered = filtered.filter((row) => {
        const rowDate = new Date(row.originalDate || row["Timesheet Date"]);
        return (
          rowDate.getFullYear() === Number(filterYear) &&
          rowDate.getMonth() + 1 === Number(filterMonth)
        );
      });
    }

    if (searchEmployeeId.trim()) {
      filtered = filtered.filter((row) =>
        (row["Employee ID"] || "")
          .toLowerCase()
          .includes(searchEmployeeId.trim().toLowerCase()),
      );
    }

    if (searchEmployeeName.trim()) {
      filtered = filtered.filter((row) =>
        (row["Name"] || "")
          .toLowerCase()
          .includes(searchEmployeeName.trim().toLowerCase()),
      );
    }

    // Add case-insensitive status filtering
    // if (searchStatus.trim()) {
    //   filtered = filtered.filter((row) => {
    //     const rowStatus = (row["Status"] || row.status || "").toLowerCase();
    //     return rowStatus.includes(searchStatus.trim().toLowerCase());
    //   });
    // }
    if (searchStatus && searchStatus.length > 0) {
      filtered = filtered.filter((row) =>
        searchStatus.includes(row.status?.toLowerCase()),
      );
    }

    return getSortedRows(filtered);
  };

  const filteredRows = getFilteredRows();

  useEffect(() => {
    const actionableRows = filteredRows.filter((row) => isRowActionable(row));
    const notifiableRows = filteredRows.filter(
      (row) =>
        !row.isNotified &&
        row.status !== "notified" &&
        row["Status"] !== "NOTIFIED",
    );

    const allActionableSelected =
      actionableRows.length > 0 && actionableRows.every((row) => row.selected);
    const allNotifiableSelected =
      notifiableRows.length > 0 &&
      notifiableRows.every((row) => row.notifySelected);

    setUnifiedSelectAll(
      allActionableSelected &&
        allNotifiableSelected &&
        (actionableRows.length > 0 || notifiableRows.length > 0),
    );
  }, [selectedRows, selectedNotifyRows, filteredRows]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setUserLoaded(false);
    showToast("Logged out successfully", "info");
    navigate("/");
  };

  useEffect(() => {
    const actionableRows = filteredRows.filter(
      (row) =>
        (isRowActionable(row) || isApprovedRowRejectableOnly(row)) &&
        row.status?.toLowerCase() !== "rejected",
    );
    // true if at least one eligible row and all eligible are selected
    const allActionableSelected =
      actionableRows.length > 0 && actionableRows.every((row) => row.selected);

    setUnifiedSelectAll(allActionableSelected);
  }, [selectedRows, filteredRows]);

  // Updated handleUnifiedSelectAll function
  const handleUnifiedSelectAll = (isSelected) => {
    setUnifiedSelectAll(isSelected);
    const updatedRows = [...rows];

    const actionableRows = filteredRows.filter(
      (row) =>
        (isRowActionable(row) || isApprovedRowRejectableOnly(row)) &&
        row.status?.toLowerCase() !== "rejected",
    );

    const notifiableRows = filteredRows.filter(
      (row) =>
        !row.isNotified &&
        row.status !== "notified" &&
        row["Status"]?.toLowerCase() !== "notified" &&
        row.status?.toLowerCase() !== "rejected",
    );

    actionableRows.forEach((filteredRow) => {
      const actualRowIndex = rows.findIndex((row) => row.id === filteredRow.id);
      if (actualRowIndex !== -1) {
        updatedRows[actualRowIndex].selected = isSelected;
      }
    });

    notifiableRows.forEach((filteredRow) => {
      const actualRowIndex = rows.findIndex((row) => row.id === filteredRow.id);
      if (actualRowIndex !== -1) {
        updatedRows[actualRowIndex].notifySelected = isSelected;
      }
    });

    setRows(updatedRows);
    setSelectedRows(isSelected ? [...actionableRows] : []);
    setSelectedNotifyRows(isSelected ? [...notifiableRows] : []);
    setSelectAll(isSelected);
    setNotifySelectAll(isSelected);
  };

  const handleUnifiedRowSelect = (rowIndex, isSelected) => {
    const rowData = filteredRows[rowIndex];
    const updatedRows = [...rows];
    const actualRowIndex = rows.findIndex(
      (row) => row.id === filteredRows[rowIndex].id,
    );

    if (isRowActionable(rowData) || isApprovedRowRejectableOnly(rowData)) {
      updatedRows[actualRowIndex].selected = isSelected;
      handleRowSelectUpdate(rowData, isSelected);
    }

    if (
      !rowData.isNotified &&
      rowData.status !== "notified" &&
      rowData["Status"] !== "NOTIFIED"
    ) {
      updatedRows[actualRowIndex].notifySelected = isSelected;
      handleNotifyRowSelectUpdate(rowData, isSelected);
    }

    setRows(updatedRows);
  };

  const handleRowSelectUpdate = (rowData, isSelected) => {
    if (isSelected) {
      setSelectedRows((prev) => [...prev, rowData]);
    } else {
      setSelectedRows((prev) => prev.filter((item) => item.id !== rowData.id));
      setSelectAll(false);
    }
  };

  const handleNotifyRowSelectUpdate = (rowData, isSelected) => {
    if (isSelected) {
      setSelectedNotifyRows((prev) => [...prev, rowData]);
    } else {
      setSelectedNotifyRows((prev) =>
        prev.filter((item) => item.id !== rowData.id),
      );
      setNotifySelectAll(false);
    }
  };

  const handleNotifyClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (actionLoading) return;

    if (selectedNotifyRows.length === 0) {
      showToast("Please select at least one timesheet to notify.", "warning");
      return;
    }
    try {
      const requestBody = selectedNotifyRows.map((row) => ({
        requestType: "TIMESHEET",
        requesterId: 1,
        timesheetId: row.id,
        ProjectId: row["Project ID"],
        requestData: `Notification for timesheet ${row.id}`,
      }));
      const response = await fetch(`${backendUrl}/api/Approval/BulkNotify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        showToast(
          `Notifications sent for ${selectedNotifyRows.length} timesheets successfully!`,
          "success",
        );
        const notifiedIds = selectedNotifyRows.map((row) => row.id);
        setRows((prevRows) =>
          prevRows.map((row) =>
            notifiedIds.includes(row.id)
              ? {
                  ...row,
                  status: "notified",
                  Status: "NOTIFIED",
                  isNotified: true,
                  notifySelected: false,
                }
              : row,
          ),
        );
        setSelectedNotifyRows([]);
        setNotifySelectAll(false);

        setTimeout(() => {
          fetchData();
        }, 2000);
      } else {
        showToast("Failed to send notifications. Please try again.", "error");
      }
    } catch (error) {
      showToast("Failed to send notifications. Please try again.", "error");
    } finally {
    }
  };

  const buildBulkRequestBody = (selectedRows, action, reason, ipAddress) => {
    const allRequestsData = [];

    selectedRows.forEach((row) => {
      // If this row has combined data from grouping, process all of them
      if (row.combinedRequestIds && row.combinedRequestIds.length > 0) {
        // Process each individual request that was grouped
        row.combinedRequestIds.forEach((requestId, index) => {
          allRequestsData.push({
            requestId: requestId,
            // action: `${action === "approve" ? "Approved" : "Rejected"}`,
            action: `${action.charAt(0).toUpperCase() + action.slice(1)}`,
            levelNo: row.levelNo || 1,
            approverUserId: currentUser.userId || row.approverUserId,
            comment: `${action.charAt(0).toUpperCase() + action.slice(1)} by ${
              currentUser.name
            }: ${reason}`,
            ipAddress: ipAddress,
            // Include original line numbers if available
            lineNo: row.combinedLineNos
              ? row.combinedLineNos[index]
              : row.lineNo,
            // Include original timesheet IDs if available
            timesheetId: row.combinedIds ? row.combinedIds[index] : row.id,
          });
        });
      } else {
        // Handle single (non-grouped) entries
        allRequestsData.push({
          requestId: row.requestId || row.id,
          levelNo: row.levelNo || 1,
          approverUserId: currentUser.approvalUserId || row.approverUserId,
          comment: `${action === "approve" ? "Approved" : "Rejected"} by ${
            currentUser.name
          }: ${reason}`,
          ipAddress: ipAddress,
          lineNo: row.lineNo,
          timesheetId: row.id,
        });
      }
    });

    console.log(
      `Sending ${action} request for ${allRequestsData.length} individual timesheet entries:`,
      allRequestsData,
    );
    return allRequestsData;
  };

  // Correction Handler
  const handleBulkCorrectionClick = () => {
    if (selectedRows.length === 0) {
      showToast(
        "Please select at least one timesheet for correction.",
        "warning",
      );
      return;
    }

    const correctionEligibleCount = selectedRows.filter(
      (row) => row.status?.toLowerCase() === "processed",
    ).length;

    if (correctionEligibleCount === 0) {
      showToast("No eligible timesheets selected for correction.", "warning");
      return;
    }

    // Show reason modal (like Reject does)
    setPendingAction("correction");
    setShowReasonModal(true);
  };

  // Proccessed Handler
  const handleBulkProcessedClick = async () => {
    setProcessedLoading(true);

    const approvedRows = selectedRows.filter(
      (row) => row.status?.toLowerCase() === "approved",
    );
    const requestBody = buildBulkRequestBody(
      selectedRows,
      "processed",
      "Processed Requested",
      userIpAddress,
    );

    try {
      const response = await fetch(
        `${backendUrl}/api/Approval/BulkApproveRequestsAsync`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        },
      );

      if (response.ok) {
        showToast("Correction requested for selected timesheets.", "success");
        setRows((prevRows) =>
          prevRows.map((row) =>
            approvedRows.some((ar) => ar.requestId === row.requestId)
              ? {
                  ...row,
                  status: "processed",
                  Status: "PROCESSED",
                  selected: false,
                }
              : row,
          ),
        );
        setSelectedRows([]);
        setSelectAll(false);
      } else {
        showToast("Correction request failed.", "error");
      }
    } catch (error) {
      showToast("An error occurred during correction.", "error");
    } finally {
      setProcessedLoading(false);
    }
  };

  // Updated handleBulkApproveClick to check for approved rows
  const handleBulkApproveClick = () => {
    if (selectedRows.length === 0) {
      showToast("Please select at least one timesheet to approve.", "warning");
      return;
    }

    // Check if any selected rows are already approved
    const hasApprovedRows = selectedRows.some(
      (row) => (row["Status"] || "").toLowerCase() === "approved",
    );

    // if (hasApprovedRows) {
    //   showToast("Cannot approve already approved timesheets.", "warning");
    //   return;
    // }

    performBulkApprove("Bulk approved");
  };

  const correctionEligibleCount = selectedRows.filter(
    (row) => row.status?.toLowerCase() === "processed",
  ).length;

  const processedEligibleCount = selectedRows.filter(
    (row) =>
      row.status?.toLowerCase() === "approved" ||
      row.status?.toLowerCase() === "submitted",
  ).length;

  const handleBulkRejectClick = () => {
    if (selectedRows.length === 0) {
      showToast("Please select at least one timesheet to reject.", "warning");
      return;
    }

    // Allow rejection of approved status
    const hasNonRejectableRows = selectedRows.some(
      (row) => row["Status"]?.toLowerCase() === "rejected",
    );

    if (hasNonRejectableRows) {
      showToast("Cannot reject already rejected timesheets.", "warning");
      return;
    }

    setPendingAction("rejected");
    setShowReasonModal(true);
  };

  const handleReasonConfirm = (reason) => {
    setShowReasonModal(false);
    if (pendingAction === "approved") {
      performBulkApprove(reason);
    } else if (pendingAction === "rejected") {
      performBulkReject(reason);
    } else if (pendingAction === "correction") {
      performBulkCorrection(reason); // New function needed
    }
    setPendingAction(null);
  };

  const handleReasonCancel = () => {
    setShowReasonModal(false);
    setPendingAction(null);
  };

  const performBulkCorrection = async (reason) => {
    setCorrectionLoading(true);
    const approvedRows = selectedRows.filter(
      (row) => row.status?.toLowerCase() === "processed",
    );

    try {
      const requestBody = buildBulkRequestBody(
        selectedRows,
        "correction",
        reason, // Now properly passed from modal
        userIpAddress,
      );

      const response = await fetch(
        `${backendUrl}/api/Approval/BulkApproveRequestsAsync`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        },
      );

      if (response.ok) {
        showToast("Correction requested for selected timesheets.", "success");
        setRows((prevRows) =>
          prevRows.map((row) =>
            approvedRows.some((ar) => ar.requestId === row.requestId)
              ? {
                  ...row,
                  status: "correction",
                  Status: "CORRECTION",
                  selected: false,
                }
              : row,
          ),
        );
        setSelectedRows([]);
        setSelectAll(false);
      } else {
        showToast("Correction request failed.", "error");
      }
    } catch (error) {
      console.error("Correction error:", error);
      showToast("An error occurred during correction.", "error");
    } finally {
      setCorrectionLoading(false);
    }
  };

  const performBulkApprove = async (reason) => {
    setApproveLoading(true); // Use specific loading state
    try {
      const requestBody = buildBulkRequestBody(
        selectedRows,
        "approved",
        reason,
        userIpAddress,
      );

      console.log("Bulk Approve Payload:", requestBody);

      const response = await fetch(
        `${backendUrl}/api/Approval/BulkApproveRequestsAsync`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        },
      );

      if (response.ok) {
        const totalProcessed = requestBody.length;
        showToast(
          `Successfully approved ${totalProcessed} timesheet entries with reason: "${reason}"`,
          "success",
        );

        // Update all grouped entries in the state
        const approvedIds = selectedRows.flatMap((row) =>
          row.combinedIds && row.combinedIds.length > 0
            ? row.combinedIds
            : [row.id],
        );

        setRows((prevRows) =>
          prevRows.map((row) =>
            approvedIds.includes(row.id) ||
            (row.combinedIds &&
              row.combinedIds.some((id) => approvedIds.includes(id)))
              ? {
                  ...row,
                  isApproved: true,
                  status: "approved",
                  selected: false,
                  Status: "APPROVED",
                }
              : row,
          ),
        );

        setSelectedRows([]);
        setSelectAll(false);
      } else {
        const errorData = await response.text();
        console.error("Approval failed:", errorData);
        showToast(
          "Failed to approve some timesheets. Please try again.",
          "error",
        );
      }
    } catch (error) {
      console.error("Approval error:", error);
      showToast(
        "Failed to approve timesheets. Please check your connection.",
        "error",
      );
    } finally {
      setApproveLoading(false);
    }
  };

  const performBulkReject = async (reason) => {
    setRejectLoading(true); // Use specific loading state
    try {
      const requestBody = buildBulkRequestBody(
        selectedRows,
        "rejected",
        reason,
        userIpAddress,
      );

      console.log("Bulk Reject Payload:", requestBody);

      const response = await fetch(
        `${backendUrl}/api/Approval/BulkApproveRequestsAsync`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        },
      );

      if (response.ok) {
        const totalProcessed = requestBody.length;
        showToast(
          `Successfully rejected ${totalProcessed} timesheet entries with reason: "${reason}"`,
          "success",
        );

        // Update all grouped entries in the state
        const rejectedIds = selectedRows.flatMap((row) =>
          row.combinedIds && row.combinedIds.length > 0
            ? row.combinedIds
            : [row.id],
        );

        setRows((prevRows) =>
          prevRows.map((row) =>
            rejectedIds.includes(row.id) ||
            (row.combinedIds &&
              row.combinedIds.some((id) => rejectedIds.includes(id)))
              ? {
                  ...row,
                  isRejected: true,
                  status: "rejected",
                  selected: false,
                  Status: "REJECTED",
                }
              : row,
          ),
        );

        setSelectedRows([]);
        setSelectAll(false);
      } else {
        const errorData = await response.text();
        console.error("Rejection failed:", errorData);
        showToast(
          "Failed to reject some timesheets. Please try again.",
          "error",
        );
      }
    } catch (error) {
      console.error("Rejection error:", error);
      showToast(
        "Failed to reject timesheets. Please check your connection.",
        "error",
      );
    } finally {
      setRejectLoading(false);
    }
  };

  const hasPendingRows = Array.isArray(filteredRows)
    ? filteredRows.some((row) => isRowActionable(row))
    : false;

  // if (!loading && userLoaded && currentUser && !isAdmin) {
  //   navigate("/dashboard");
  //   return null;
  // }

  //status checkbox
  const handleStatusCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedStatus = [...searchStatus];
    if (checked) {
      updatedStatus.push(value);
    } else {
      updatedStatus = updatedStatus.filter((status) => status !== value);
    }
    setSearchStatus(updatedStatus);
  };

  // clear all fiters
  const handleClearAllFilters = () => {
    setSearchDate("");
    setSearchEmployeeId("");
    setSearchEmployeeName("");
    setSearchStatus("");
    setFilterMonth("");
    setFilterYear("");
    // Optional: reset other filter states if used
  };

  if (!userLoaded || !currentUser) {
    return (
      <div className="min-h-screen bg-[#f9fafd] flex flex-col ">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading user session...</span>
          </div>
        </div>
      </div>
    );
  }

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-f9fafd flex items-center justify-center ">
  //       <div className="text-center">
  //         <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
  //         <p className="text-lg text-gray-600">Loading data.....</p>
  //       </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-[#f9fafd] flex flex-col overflow-auto font-inter">
      <ReasonModal
        isOpen={showReasonModal}
        action={pendingAction}
        selectedCount={selectedRows.length}
        onConfirm={handleReasonConfirm}
        onCancel={handleReasonCancel}
      />

      <div className="flex-1 flex flex-col items-center justify-start">
        <div className="w-full flex flex-col items-center">
          {/* Header Bar */}
          <div
            className="w-full flex justify-between items-center mb-3 px-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100"
            // style={{
            //   marginLeft: 24,
            //   marginRight: 24,
            //   width: "calc(100vw - 220px)",
            // }}
          >
            {/* Left Side: Icon and Title */}
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-800">
                  Enquiry / Approvals
                </h1>
              </div>
            </div>
          </div>

          {/* Filters Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-3 w-full">
            <div className="text-xs font-bold text-gray-700  tracking-wide mb-2 flex items-center gap-1.5">
              <span>Filters</span>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="filterMonthYear"
                  className="font-semibold text-xs sm:text-sm whitespace-nowrap text-gray-700"
                >
                  Month/Year:
                </label>
                <DatePicker
                  id="filterMonthYear"
                  selected={
                    filterMonth && filterYear
                      ? new Date(`${filterYear}-${filterMonth}-01T00:00:00`)
                      : null
                  }
                  onChange={(date) => {
                    if (date) {
                      const newMonth = String(date.getMonth() + 1).padStart(
                        2,
                        "0",
                      );
                      const newYear = String(date.getFullYear());
                      setFilterMonth(newMonth);
                      setFilterYear(newYear);
                    } else {
                      setFilterMonth("");
                      setFilterYear("");
                    }
                  }}
                  showMonthYearPicker
                  dateFormat="MM/yyyy"
                  placeholderText="MM/YYYY"
                  className="border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-inner min-w-[120px]"
                  showPopperArrow={false}
                  autoComplete="off"
                />
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="filterEmpId"
                  className="font-semibold text-xs sm:text-sm whitespace-nowrap text-gray-700"
                >
                  Employee ID:
                </label>
                <input
                  id="filterEmpId"
                  type="text"
                  value={searchEmployeeId}
                  onChange={(e) => setSearchEmployeeId(e.target.value)}
                  placeholder="Employee ID"
                  className="border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-inner min-w-[120px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="filterEmpName"
                  className="font-semibold text-xs sm:text-sm whitespace-nowrap text-gray-700"
                >
                  Employee Name:
                </label>
                <input
                  id="filterEmpName"
                  type="text"
                  value={searchEmployeeName}
                  onChange={(e) => setSearchEmployeeName(e.target.value)}
                  placeholder="Employee Name"
                  className="border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-inner min-w-[140px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="filterStatus"
                  className="font-semibold text-xs sm:text-sm whitespace-nowrap text-gray-700"
                >
                  Status:
                </label>
                <div className="flex flex-wrap gap-3 items-center">
                  <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={searchStatus.includes("approved")}
                      value="approved"
                      onChange={handleStatusCheckboxChange}
                      className="cursor-pointer accent-blue-600"
                    />
                    Approved
                  </label>
                  <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={searchStatus.includes("rejected")}
                      value="rejected"
                      onChange={handleStatusCheckboxChange}
                      className="cursor-pointer accent-blue-600"
                    />
                    Rejected
                  </label>
                  <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={searchStatus.includes("submitted")}
                      value="submitted"
                      onChange={handleStatusCheckboxChange}
                      className="cursor-pointer accent-blue-600"
                    />
                    Submitted
                  </label>
                  {isAdmin && (
                    <label className="flex items-center gap-1 text-xs font-semibold text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={searchStatus.includes("processed")}
                        value="processed"
                        onChange={handleStatusCheckboxChange}
                        className="cursor-pointer accent-blue-600"
                      />
                      Processed
                    </label>
                  )}
                </div>
              </div>
              <button
                onClick={handleClearAllFilters}
                className="btn1 btn-blue cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>

          <div
            className="border border-gray-100 rounded-lg bg-white shadow-sm w-full p-3 mb-2 flex flex-col"
            style={{
              // marginLeft: 24,
              // marginRight: 24,
              // width: "calc(100vw - 220px)",
              overflow: "hidden",
            }}
          >
            <div className="flex justify-between items-center mb-2.5 w-full flex-shrink-0">
              <div className="flex gap-2">
                {!isUser && (
                  <>
                    {(() => {
                      const approveEligibleCount = selectedRows.filter(
                        (row) =>
                          row["Status"]?.toLowerCase() !== "approved" &&
                          row["Status"]?.toLowerCase() !== "rejected" &&
                          row["Status"]?.toLowerCase() !== "processed",
                      ).length;

                      const rejectEligibleCount = selectedRows.filter(
                        (row) =>
                          row["Status"]?.toLowerCase() !== "rejected" &&
                          row["Status"]?.toLowerCase() !== "processed",
                      ).length;

                      const hasProcessedSelected = selectedRows.some(
                        (row) => row["Status"]?.toLowerCase() === "processed",
                      );

                      const allProcessedSelected =
                        selectedRows.length > 0 &&
                        selectedRows.every(
                          (row) => row["Status"]?.toLowerCase() === "processed",
                        );

                      const hasApprovedSelected = selectedRows.some(
                        (row) => row["Status"]?.toLowerCase() === "approved",
                      );

                      return (
                        <>
                          {/* Approve button */}
                          {/* <button
                            onClick={handleBulkApproveClick}
                            disabled={
                              approveLoading ||
                              approveEligibleCount === 0 ||
                              hasApprovedSelected ||
                              hasProcessedSelected || 
                              allProcessedSelected
                            }
                            className="btn1 btn-blue cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {approveLoading
                              ? "Processing..."
                              : `Approve (${approveEligibleCount})`}
                          </button> */}

                          {/* Reject button */}
                          <button
                            onClick={handleBulkRejectClick}
                            disabled={
                              rejectLoading ||
                              rejectEligibleCount === 0 ||
                              hasProcessedSelected ||
                              allProcessedSelected
                            }
                            className="btn1 btn-blue cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {rejectLoading
                              ? "Processing..."
                              : `Reject (${rejectEligibleCount})`}
                          </button>
                          {isAdmin && (
                            <>
                              {/* Processed button */}
                              <button
                                onClick={handleBulkProcessedClick}
                                disabled={
                                  processedLoading ||
                                  processedEligibleCount === 0
                                }
                                className="btn1 btn-blue cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                {processedLoading
                                  ? "Processing..."
                                  : "Processed"}{" "}
                                ({processedEligibleCount})
                              </button>

                              {/* Correction button */}
                              <button
                                onClick={handleBulkCorrectionClick}
                                disabled={
                                  correctionLoading ||
                                  correctionEligibleCount === 0
                                }
                                className="btn1 btn-blue cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                {correctionLoading
                                  ? "Processing..."
                                  : "Correct"}{" "}
                                ({correctionEligibleCount})
                              </button>
                            </>
                          )}
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>

            <div className="overflow-auto max-h-[calc(100vh-220px)] w-full flex-1 border border-gray-300 rounded-lg scrollbar-thin scroll-smooth">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <MessageSquare className="h-10 w-10 mx-auto mb-3 text-blue-500 animate-pulse" />
                    <p className="text-sm font-medium text-gray-600">
                      Loading data...
                    </p>
                  </div>
                </div>
              ) : (
                <table className="w-full text-xs border-collapse table-auto">
                  <thead className="sticky top-0 z-20">
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col}
                          className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center cursor-pointer select-none last:border-r-0"
                          style={{
                            minWidth:
                              col === "All"
                                ? "80px"
                                : col === "Status"
                                  ? "150px"
                                  : `${colWidth}px`,
                            cursor: col !== "All" ? "pointer" : "default",
                          }}
                          onClick={() => col !== "All" && handleSort(col)}
                        >
                          {col === "All" ? (
                            <div className="flex items-center gap-1.5 justify-center">
                              <input
                                type="checkbox"
                                checked={unifiedSelectAll}
                                onChange={(e) =>
                                  handleUnifiedSelectAll(e.target.checked)
                                }
                                className="cursor-pointer accent-blue-600"
                                disabled={!hasPendingRows}
                              />
                              <span className="text-xs font-semibold">All</span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              {col}
                              {getSortIcon(col)}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredRows.length > 0 ? (
                      filteredRows.map((row, rdx) => {
                        const isCurrent = currentSelectedRowId === row.id;
                        const isSelected = row.selected || row.notifySelected;
                        let rowBg = isCurrent
                          ? "bg-[#e9f6fb]"
                          : isSelected
                            ? "bg-sky-50"
                            : rdx % 2 === 0
                              ? "bg-white"
                              : "bg-gray-50/50";
                        const isApprovedOrRejected =
                          (row["Status"] || "").toLowerCase() === "approved" ||
                          (row["Status"] || "").toLowerCase() === "rejected";

                        return (
                          <tr
                            key={`${row.requestId || row.id || rdx}-${row["Employee ID"] || ""}-${rdx}`}
                            className={`${rowBg} cursor-pointer transition-colors hover:bg-sky-50 ${isApprovedOrRejected ? "opacity-75" : ""}`}
                            onClick={() => handleRowClick(row)}
                          >
                            {columns.map((col) => (
                              <td
                                key={col}
                                className="px-2 py-1.5 text-center whitespace-nowrap border-r border-b border-gray-300 text-xs text-black last:border-r-0 relative"
                                style={{
                                  minWidth:
                                    col === "All"
                                      ? "80px"
                                      : col === "Status"
                                        ? "150px"
                                        : `${colWidth}px`,
                                }}
                              >
                                {col === "Status" ? (
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      className="relative inline-flex items-center justify-center cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setApprovalPanelRow(row);
                                      }}
                                    >
                                      <span
                                        className={getStatusStyle(
                                          row[col] || "PENDING",
                                        )}
                                      >
                                        {(row[col] || "Pending")
                                          .charAt(0)
                                          .toUpperCase() +
                                          (row[col] || "Pending")
                                            .slice(1)
                                            .toLowerCase()}
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      className="p-1 hover:bg-gray-200 rounded-full transition-colors cursor-pointer text-gray-500 hover:text-blue-600"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setApprovalPanelRow(row);
                                      }}
                                      title="View Audit Trail"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line
                                          x1="12"
                                          y1="16"
                                          x2="12"
                                          y2="12"
                                        ></line>
                                        <line
                                          x1="12"
                                          y1="8"
                                          x2="12.01"
                                          y2="8"
                                        ></line>
                                      </svg>
                                    </button>
                                  </div>
                                ) : col === "All" ? (
                                  <input
                                    type="checkbox"
                                    checked={
                                      row.selected ||
                                      false ||
                                      row.notifySelected ||
                                      false
                                    }
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleUnifiedRowSelect(
                                        rdx,
                                        e.target.checked,
                                      );
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="cursor-pointer accent-blue-600"
                                    disabled={
                                      !(
                                        isRowActionable(row) ||
                                        isApprovedRowRejectableOnly(row)
                                      ) ||
                                      row.isNotified ||
                                      row.status?.toLowerCase() ===
                                        "notified" ||
                                      row.status?.toLowerCase() === "rejected"
                                    }
                                  />
                                ) : (
                                  row[col] || ""
                                )}
                              </td>
                            ))}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-center p-8 italic text-gray-500 bg-white"
                        >
                          No approval data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex justify-between items-center mt-2.5 w-full flex-shrink-0">
              <div className="flex-1" />
              <div className="flex gap-2 ml-auto">
                {isAdmin && (
                  <>
                    {/* Approval History Panel */}
                    <button
                      onClick={() => setShowHistory(true)}
                      disabled={!selectedTimesheetDate}
                      className="
                        text-sm font-medium
                        text-blue-600
                        underline underline-offset-2
                        bg-transparent
                        px-2 py-2
                        hover:text-blue-800
                        disabled:text-gray-400 
                        disabled:underline
                        disabled:cursor-not-allowed
                      "
                    >
                      Status
                    </button>

                    {/* Revision Audit */}
                    <button
                      onClick={() => setShowRevision(true)}
                      disabled={!selectedTimesheetDate}
                      className="
                        text-sm font-medium
                        text-blue-600
                        underline underline-offset-2
                        bg-transparent
                        px-2 py-2
                        hover:text-blue-800
                        disabled:text-gray-400
                        disabled:underline
                        disabled:cursor-not-allowed
                      "
                    >
                      Revision
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {approvalPanelRow && approvalPanelRow.approvalActions?.length > 0 && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
              {/* backdrop click to close */}
              <div
                className="absolute inset-0"
                onClick={() => setApprovalPanelRow(null)}
              />

              <div className="relative w-full max-w-xl rounded-lg border border-gray-300 bg-white shadow-2xl font-inter overflow-hidden">
                {/* header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 bg-[#e5f3fb]">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                    <span role="img" aria-label="history">
                      📋
                    </span>
                    <span>Approval History</span>
                    <span className="text-xs text-gray-600 font-medium">
                      ({approvalPanelRow["Employee ID"]} ·{" "}
                      {approvalPanelRow["Timesheet Date"]})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setApprovalPanelRow(null)}
                    className="btn1 btn-blue !py-1 !px-3 text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {/* body */}
                <div className="max-h-[60vh] overflow-y-auto px-4 py-3 space-y-2.5 text-xs text-black bg-white scrollbar-thin">
                  {approvalPanelRow.approvalActions.map((action, idx) => (
                    <div
                      key={idx}
                      className="pb-2.5 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-[#e5f3fb] text-[#17414d] rounded font-semibold text-xs border border-blue-200">
                          Level {action.levelNo}
                        </span>
                        <span className="font-bold text-[#17414d] text-xs uppercase">
                          {action.actionStatus}
                        </span>
                        {action.actionDate && (
                          <span className="text-gray-500 text-xs">
                            {new Date(action.actionDate).toLocaleString()}
                          </span>
                        )}
                      </div>

                      {action.actionComment && (
                        <div className="mt-1 px-3 py-2 bg-gray-50 rounded border-l-4 border-[#17414d] whitespace-pre-wrap text-xs text-gray-800 border border-gray-200">
                          {action.actionComment}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showHistory && (
            <TimesheetHistoryTable
              timesheetDate={selectedTimesheetDate}
              lines={selectedTimesheetLines}
              resourceType={selectedResourceType}
              onClose={() => setShowHistory(false)}
            />
          )}

          {showRevision && (
            <TimesheetRevisionTable
              timesheetDate={selectedTimesheetDate}
              lines={selectedTimesheetLines}
              resourceType={selectedResourceType}
              onClose={() => setShowRevision(false)}
            />
          )}

          {selectedResourceId && (
            <div
              ref={timesheetDetailsRef}
              style={{
                marginLeft: 24,
                marginRight: 24,
                width: "calc(100vw - 220px)",
                minWidth: "800px",
              }}
            >
              <TimesheetApprovalModal
                resourceId={selectedResourceId}
                timesheetDate={selectedTimesheetDate}
                resourceType={selectedResourceType}
                userId={userId}
                onClose={() => {
                  setSelectedResourceId(null);
                  setCurrentSelectedRowId(null);
                  setSelectedTimesheetDate(null);
                  setSelectedResourceType(null);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
