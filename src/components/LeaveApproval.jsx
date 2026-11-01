import React, { useState, useEffect } from "react";
import { MessageSquare, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import { backendUrl } from "./config";

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
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
};

const columnsLeave = [
  "All",
  "Status",
  "Leave Code",
  "Fiscal Year",
  "Transaction Date",
  "Hours",
  "Employee ID",
];

export default function LeaveApproval() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  // Filters
  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(
    String(now.getMonth() + 1).padStart(2, "0"),
  );
  const [filterYear, setFilterYear] = useState(String(now.getFullYear()));
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [searchStatus, setSearchStatus] = useState([]);

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Action Loaders
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const colWidth = 150;

  useEffect(() => {
    const userInfo = localStorage.getItem("currentUser");
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setCurrentUser(parsedUser);
        setUserLoaded(true);
      } catch (error) {
        showToast("Session expired.", "error");
      }
    } else {
      // Fallback for standalone preview if needed
      setCurrentUser({ name: "Nelson.Galindez" });
      setUserLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (userLoaded && currentUser?.name) {
      fetchLeaveData();
    }
  }, [userLoaded, currentUser]);

  const convertDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  console.log(currentUser);
  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const username = currentUser.employeeId || "";
      const apiUrl = `${backendUrl}/api/EmployeeLeaveTransactions/PendingApprovalByUser/${username}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const apiData = await response.json();

      if (Array.isArray(apiData)) {
        const formattedData = apiData.map((item) => ({
          id: item.transactionId,
          transactionId: item.transactionId,
          selected: false,
          status: (item.transactionType || "Pending").toLowerCase(),
          Status: item.transactionType || "Pending",
          "Leave Code": item.leaveCode || "",
          "Fiscal Year": item.fiscalYear || "",
          "Transaction Date": convertDate(item.transactionDate),
          Hours: item.hours ? item.hours.toFixed(2) : "0.00",
          "Employee ID": item.emplId || "",
          originalDate: item.transactionDate,
        }));
        setRows(formattedData);
      } else {
        setRows([]);
      }
      setSelectedRows([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error fetching leave approvals:", error);
      showToast(`Error loading leave requests: ${error.message}`, "error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
      case "LEAVETAKEN":
        return {
          backgroundColor: "#dcfce7",
          color: "#16a34a",
          fontWeight: "600",
          padding: "4px 8px",
          fontSize: "11px",
          borderRadius: "9999px",
        };
      case "REJECTED":
      case "REJECT":
        return {
          backgroundColor: "#fce7f3",
          color: "#ec4899",
          fontWeight: "600",
          padding: "4px 8px",
          fontSize: "11px",
          borderRadius: "9999px",
        };
      case "PENDING":
        return {
          backgroundColor: "#fef9c3",
          color: "#ca8a04",
          fontWeight: "600",
          padding: "4px 8px",
          fontSize: "11px",
          borderRadius: "9999px",
        };
      default:
        return {
          backgroundColor: "#f3f4f6",
          color: "#6b7280",
          fontWeight: "500",
          padding: "4px 8px",
          fontSize: "11px",
          borderRadius: "9999px",
        };
    }
  };

  const isRowActionable = (row) => {
    const st = row.status?.toLowerCase();
    return st === "pending";
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

  const getSortedRows = (rowsToSort) => {
    let sorted = [...rowsToSort];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aVal = a[sortConfig.key] || "";
        let bVal = b[sortConfig.key] || "";
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  };

  const getFilteredRows = () => {
    let filtered = rows;
    if (searchEmployeeId.trim()) {
      filtered = filtered.filter((row) =>
        String(row["Employee ID"] || "")
          .toLowerCase()
          .includes(searchEmployeeId.trim().toLowerCase()),
      );
    }
    if (searchStatus.length > 0) {
      filtered = filtered.filter((row) =>
        searchStatus.includes(row.status?.toLowerCase()),
      );
    }
    return getSortedRows(filtered);
  };

  const filteredRows = getFilteredRows();

  const handleSelectAll = (isSelected) => {
    setSelectAll(isSelected);
    const updatedRows = rows.map((row) => {
      if (isRowActionable(row)) {
        return { ...row, selected: isSelected };
      }
      return row;
    });
    setRows(updatedRows);
    setSelectedRows(
      isSelected ? updatedRows.filter((r) => isRowActionable(r)) : [],
    );
  };

  const handleRowSelect = (rowId, isSelected) => {
    const updatedRows = rows.map((r) =>
      r.id === rowId ? { ...r, selected: isSelected } : r,
    );
    setRows(updatedRows);

    const selected = updatedRows.filter((r) => r.selected);
    setSelectedRows(selected);
    setSelectAll(
      selected.length > 0 &&
        selected.length === rows.filter((r) => isRowActionable(r)).length,
    );
  };

  const handleStatusCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSearchStatus((prev) => [...prev, value]);
    } else {
      setSearchStatus((prev) => prev.filter((s) => s !== value));
    }
  };

  const handleClearFilters = () => {
    setSearchEmployeeId("");
    setSearchStatus([]);
    setFilterMonth(String(now.getMonth() + 1).padStart(2, "0"));
    setFilterYear(String(now.getFullYear()));
  };

  const handleBulkApproveClick = async () => {
    if (selectedRows.length === 0) {
      showToast(
        "Please select at least one leave request to approve.",
        "warning",
      );
      return;
    }
    await performAction("LeaveTaken");
  };

  const handleBulkRejectClick = async () => {
    if (selectedRows.length === 0) {
      showToast(
        "Please select at least one leave request to reject.",
        "warning",
      );
      return;
    }
    await performAction("Reject");
  };

  const performAction = async (statusAction) => {
    if (statusAction === "LeaveTaken") setApproveLoading(true);
    else setRejectLoading(true);

    try {
      const userId = currentUser?.name || "Nelson.Galindez";
      // Payload is simply an array of selected transaction IDs, e.g., [2, 3]
      const payload = selectedRows.map((row) => row.transactionId);

      const response = await fetch(
        `${backendUrl}/api/EmployeeLeaveTransactions/ApproveLeaves/${userId}/${statusAction}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        showToast(
          `Successfully processed ${selectedRows.length} leave request(s).`,
          "success",
        );
        fetchLeaveData();
      } else {
        const errorText = await response.text();
        showToast(errorText || `Failed to update leave requests.`, "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error executing action.", "error");
    } finally {
      setApproveLoading(false);
      setRejectLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafd] flex flex-col overflow-auto font-inter">
      <div className="flex-1 flex flex-col items-center justify-start">
        <div className="w-full flex flex-col items-center">
          {/* Header Bar */}
          <div className="w-full flex justify-between items-center mb-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <h1 className="text-lg font-bold text-gray-800">
                Leave Approvals
              </h1>
            </div>
          </div>

          {/* Filters Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-3 w-full">
            <div className="text-xs font-bold text-gray-700 tracking-wide mb-2 flex items-center gap-1.5">
              <span>Filters</span>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="font-semibold text-xs sm:text-sm whitespace-nowrap text-gray-700">
                  Month/Year:
                </label>
                <DatePicker
                  selected={
                    filterMonth && filterYear
                      ? new Date(`${filterYear}-${filterMonth}-01T00:00:00`)
                      : null
                  }
                  onChange={(date) => {
                    if (date) {
                      setFilterMonth(
                        String(date.getMonth() + 1).padStart(2, "0"),
                      );
                      setFilterYear(String(date.getFullYear()));
                    } else {
                      setFilterMonth("");
                      setFilterYear("");
                    }
                  }}
                  showMonthYearPicker
                  dateFormat="MM/yyyy"
                  placeholderText="MM/YYYY"
                  className="border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-inner min-w-[120px]"
                  autoComplete="off"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="font-semibold text-xs sm:text-sm whitespace-nowrap text-gray-700">
                  Employee ID:
                </label>
                <input
                  type="text"
                  value={searchEmployeeId}
                  onChange={(e) => setSearchEmployeeId(e.target.value)}
                  placeholder="Employee ID"
                  className="border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-inner min-w-[120px]"
                />
              </div>

              {/* <div className="flex items-center gap-2">
                <label className="font-semibold text-xs sm:text-sm whitespace-nowrap text-gray-700">
                  Status:
                </label>
                <div className="flex flex-wrap gap-3 items-center">
                  {["pending", "leavetaken", "reject"].map((st) => (
                    <label
                      key={st}
                      className="flex items-center gap-1 text-xs font-semibold text-gray-700 cursor-pointer capitalize"
                    >
                      <input
                        type="checkbox"
                        checked={searchStatus.includes(st)}
                        value={st}
                        onChange={handleStatusCheckboxChange}
                        className="cursor-pointer accent-blue-600"
                      />
                      {st}
                    </label>
                  ))}
                </div>
              </div> */}

              <button
                onClick={handleClearFilters}
                className="btn1 btn-blue cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Action & Table Card */}
          <div className="border border-gray-100 rounded-lg bg-white shadow-sm w-full p-3 mb-2 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-2.5 w-full flex-shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={handleBulkApproveClick}
                  disabled={approveLoading || selectedRows.length === 0}
                  className="btn1 btn-blue cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {approveLoading
                    ? "Processing..."
                    : `Approve (${selectedRows.length})`}
                </button>
                <button
                  onClick={handleBulkRejectClick}
                  disabled={rejectLoading || selectedRows.length === 0}
                  className="btn1 btn-blue cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {rejectLoading
                    ? "Processing..."
                    : `Reject (${selectedRows.length})`}
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-auto max-h-[calc(100vh-220px)] w-full flex-1 border border-gray-300 rounded-lg scrollbar-thin scroll-smooth">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <MessageSquare className="h-10 w-10 mx-auto mb-3 text-blue-500 animate-pulse" />
                    <p className="text-sm font-medium text-gray-600">
                      Loading leave data...
                    </p>
                  </div>
                </div>
              ) : (
                <table className="w-full text-xs border-collapse table-auto">
                  <thead className="sticky top-0 z-20">
                    <tr>
                      {columnsLeave.map((col) => (
                        <th
                          key={col}
                          className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center select-none last:border-r-0"
                          style={{
                            minWidth:
                              col === "All"
                                ? "80px"
                                : col === "Status"
                                  ? "130px"
                                  : `${colWidth}px`,
                            cursor: col !== "All" ? "pointer" : "default",
                          }}
                          onClick={() => col !== "All" && handleSort(col)}
                        >
                          {col === "All" ? (
                            <div className="flex items-center gap-1.5 justify-center">
                              <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={(e) =>
                                  handleSelectAll(e.target.checked)
                                }
                                className="cursor-pointer accent-blue-600"
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
                        const isSelected = row.selected;
                        const rowBg = isSelected
                          ? "bg-sky-50"
                          : rdx % 2 === 0
                            ? "bg-white"
                            : "bg-gray-50/50";

                        return (
                          <tr
                            key={row.id}
                            className={`${rowBg} transition-colors hover:bg-sky-50`}
                          >
                            {columnsLeave.map((col) => (
                              <td
                                key={col}
                                className="px-2 py-1.5 text-center whitespace-nowrap border-r border-b border-gray-300 text-xs text-black last:border-r-0"
                              >
                                {col === "All" ? (
                                  <input
                                    type="checkbox"
                                    checked={row.selected || false}
                                    onChange={(e) =>
                                      handleRowSelect(row.id, e.target.checked)
                                    }
                                    disabled={!isRowActionable(row)}
                                    className="cursor-pointer accent-blue-600 disabled:opacity-40"
                                  />
                                ) : col === "Status" ? (
                                  <div className="flex items-center justify-center gap-1.5">
                                    <span style={getStatusStyle(row[col])}>
                                      {row[col]}
                                    </span>
                                  </div>
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
                          colSpan={columnsLeave.length}
                          className="text-center p-8 italic text-gray-500 bg-white"
                        >
                          No pending leave approval requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
