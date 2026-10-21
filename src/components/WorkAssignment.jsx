import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  MessageSquare,
  Download,
  Receipt,
  Package,
  Users,
} from "lucide-react";
import { backendUrl } from "./config";

// Toast notification utility
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
  }, 1000);
};

const WorkAssignment = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approveLoading, setApproveLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [approvedRows, setApprovedRows] = useState(new Set());

  // Filter states - Added PO Line Key filter
  const [filterPurchaseOrder, setFilterPurchaseOrder] = useState("");
  const [filterPurchaseOrderRelease, setFilterPurchaseOrderRelease] =
    useState("");
  const [filterWACode, setFilterWACode] = useState("");
  const [filterPOLineKey, setFilterPOLineKey] = useState("");

  // Updated column configuration with W0 Code
  const columns = [
    "Select",
    "WO Code",
    "Purchase Order",
    "Purchase Order Release",
    // "PO Line Key",
  ];

  const colWidth = 120;

  // Changed only the Select column width
  const selectColWidth = 30;

  useEffect(() => {
    const userInfo = localStorage.getItem("currentUser");

    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setCurrentUser(parsedUser);
        setUserLoaded(true);
      } catch (error) {
        console.error("Error parsing user info:", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (userLoaded && currentUser) {
      fetchWorkAssignments();
    }
  }, [userLoaded, currentUser]);

  // Fetch data from API
  const fetchWorkAssignments = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${backendUrl}/api/PurchaseOrders/GetAllWorkAssignments`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const apiData = await response.json();

      const mappedData = Array.isArray(apiData)
        ? apiData.map((item, index) => ({
            id: item.id || `work-${index}`,
            waId: item.waId || 0,
            "WO Code": item.wa_Code || "",
            "Purchase Order": item.purchaseOrder || "",
            "Purchase Order Release": item.purchaseOrderRelease || "",
            "PO Line Key": item.poLnKey || "",
            originalItem: item,
            hasWACode: Boolean(item.wa_Code),
          }))
        : [];

      setRows(mappedData);
      setSelectedRows(new Set());
      setSelectAll(false);
    } catch (error) {
      console.error("Fetch error:", error);

      showToast(
        "Failed to load work order. Please check your connection.",
        "error",
      );

      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // Get filtered rows based on filter criteria - Added PO Line Key filter
  const getFilteredRows = () => {
    let filtered = rows;

    if (filterPurchaseOrder.trim()) {
      filtered = filtered.filter((row) =>
        (row["Purchase Order"] || "")
          .toLowerCase()
          .includes(filterPurchaseOrder.toLowerCase()),
      );
    }

    if (filterPurchaseOrderRelease.trim()) {
      filtered = filtered.filter((row) =>
        (row["Purchase Order Release"] || "")
          .toLowerCase()
          .includes(filterPurchaseOrderRelease.toLowerCase()),
      );
    }

    if (filterWACode.trim()) {
      filtered = filtered.filter((row) =>
        (row["WO Code"] || "")
          .toLowerCase()
          .includes(filterWACode.toLowerCase()),
      );
    }

    if (filterPOLineKey.trim()) {
      filtered = filtered.filter((row) =>
        (row["PO Line Key"] || "")
          .toLowerCase()
          .includes(filterPOLineKey.toLowerCase()),
      );
    }

    return filtered;
  };

  // Handle individual row selection - exclude approved rows and rows with wa_Code
  const handleRowSelect = (rowId) => {
    const row = rows.find((r) => r.id === rowId);

    if (approvedRows.has(rowId) || row?.hasWACode) return;

    const newSelectedRows = new Set(selectedRows);

    if (newSelectedRows.has(rowId)) {
      newSelectedRows.delete(rowId);
    } else {
      newSelectedRows.add(rowId);
    }

    setSelectedRows(newSelectedRows);

    const availableRows = getFilteredRows().filter(
      (row) => !approvedRows.has(row.id) && !row.hasWACode,
    );

    setSelectAll(
      newSelectedRows.size === availableRows.length && availableRows.length > 0,
    );
  };

  // Handle select all - exclude approved rows and rows with wa_Code
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      const availableRowIds = new Set(
        getFilteredRows()
          .filter((row) => !approvedRows.has(row.id) && !row.hasWACode)
          .map((row) => row.id),
      );

      setSelectedRows(availableRowIds);
      setSelectAll(true);
    }
  };

  // Update select all when rows change - Added PO Line Key dependency
  useEffect(() => {
    const availableRows = getFilteredRows().filter(
      (row) => !approvedRows.has(row.id) && !row.hasWACode,
    );

    if (availableRows.length > 0) {
      const allSelected = availableRows.every((row) =>
        selectedRows.has(row.id),
      );

      setSelectAll(allSelected);
    } else {
      setSelectAll(false);
    }
  }, [
    rows,
    selectedRows,
    approvedRows,
    filterPurchaseOrder,
    filterPurchaseOrderRelease,
    filterWACode,
    filterPOLineKey,
  ]);

  // Handle sorting
  const handleSort = (key) => {
    if (key === "Select") return;

    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (columnKey) => {
    if (columnKey === "Select") return null;

    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "asc" ? " ↑" : " ↓";
    }

    return " ⇅";
  };

  // Get sorted and filtered rows
  const getSortedRows = () => {
    let filtered = getFilteredRows();

    if (sortConfig.key && sortConfig.key !== "Select") {
      filtered.sort((a, b) => {
        const aVal = String(a[sortConfig.key] || "").toLowerCase();

        const bVal = String(b[sortConfig.key] || "").toLowerCase();

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;

        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;

        return 0;
      });
    }

    return filtered;
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setUserLoaded(false);
    navigate("/");
  };

  // Handle approve action - Added API refresh after successful approval
  const handleApprove = async () => {
    if (selectedRows.size === 0) {
      showToast(
        "Please select at least one work assignment to approve",
        "warning",
      );
      return;
    }

    try {
      setApproveLoading(true);

      const selectedData = rows.filter((row) => selectedRows.has(row.id));

      const approvePromises = selectedData.map(async (row) => {
        const requestBody = {
          waId: row.waId,
          purchaseOrder: row["Purchase Order"],
          purchaseOrderRelease: row["Purchase Order Release"],
          poLnKey: row["PO Line Key"],
        };

        const response = await fetch(`${backendUrl}/api/WorkAssignments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to approve work assignment ${row.id}: ${response.status}`,
          );
        }

        return response.json();
      });

      await Promise.all(approvePromises);

      showToast(
        `Successfully approved ${selectedRows.size} work order`,
        "success",
      );

      // Clear selections first
      setSelectedRows(new Set());
      setSelectAll(false);
      setApprovedRows(new Set());

      // Refresh data from API after successful approval
      await fetchWorkAssignments();
    } catch (error) {
      console.error("Approve error:", error);

      showToast(
        "Failed to approve some work order. Please try again.",
        "error",
      );
    } finally {
      setApproveLoading(false);
    }
  };

  if (!userLoaded || !currentUser) {
    return (
      <div className="min-h-screen bg-[#f9fafd] flex flex-col pr-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading user session...</span>
          </div>
        </div>
      </div>
    );
  }

  const sortedRows = getSortedRows();

  const availableRowsCount = sortedRows.filter(
    (row) => !approvedRows.has(row.id) && !row.hasWACode,
  ).length;

  return (
    <div className="min-h-screen bg-[#e7f2f5] text-gray-800 flex flex-col">
      <div className="w-full">
        {/* Heading */}
        <div className="mb-[5px] flex min-h-[44px] items-center rounded-[4px] bg-white px-[10px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <Package size={17} className="text-[#287cf0]" />
            Work Order
          </h2>
        </div>

        {/* Filters */}
        <div className="mb-[5px] rounded-[4px] bg-white px-[8px] py-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              value={filterWACode}
              onChange={(e) => setFilterWACode(e.target.value)}
              placeholder="Filter WO Code"
              className="h-[28px] w-[190px] rounded-[3px] border border-[#cfd6dc] bg-white px-2 text-[12px] text-[#172b3a] outline-none transition focus:border-[#174f5b] focus:ring-1 focus:ring-[#174f5b]/20"
            />

            <input
              type="text"
              value={filterPurchaseOrder}
              onChange={(e) => setFilterPurchaseOrder(e.target.value)}
              placeholder="Filter Purchase Order"
              className="h-[28px] w-[190px] rounded-[3px] border border-[#cfd6dc] bg-white px-2 text-[12px] text-[#172b3a] outline-none transition focus:border-[#174f5b] focus:ring-1 focus:ring-[#174f5b]/20"
            />

            <input
              type="text"
              value={filterPurchaseOrderRelease}
              onChange={(e) => setFilterPurchaseOrderRelease(e.target.value)}
              placeholder="Filter Purchase Order Release"
              className="h-[28px] w-[190px] rounded-[3px] border border-[#cfd6dc] bg-white px-2 text-[12px] text-[#172b3a] outline-none transition focus:border-[#174f5b] focus:ring-1 focus:ring-[#174f5b]/20"
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="w-full rounded-[4px] bg-white p-[5px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          {/* Action Button */}
          <div className="flex items-center justify-end gap-2 mb-[5px]">
            <button
              onClick={handleApprove}
              disabled={selectedRows.size === 0 || approveLoading}
              className="rounded-[3px] bg-[#287cf0] px-3 py-1.5 text-[12px] font-medium text-white shadow-sm transition hover:bg-[#1769d5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {approveLoading
                ? "Processing..."
                : `Create Work Order (${selectedRows.size})`}
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto overflow-y-auto max-h-[68vh]">
            {loading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <div className="text-center">
                  <Package className="mx-auto mb-4 h-12 w-12 animate-pulse text-gray-400" />
                  <p className="text-lg text-gray-600">
                    Loading work orders...
                  </p>
                </div>
              </div>
            ) : (
              <table className="w-full text-left border border-gray-300 border-collapse table-fixed">
                <thead className="thead sticky top-0 z-10">
                  <tr className="text-[10px] capitalize text-gray-500 border-b">
                    {columns.map((col) => (
                      <th
                        key={col}
                        className={`th-thead cursor-pointer select-none whitespace-nowrap text-center ${
                          col === "Select" ? "px-1" : "px-4"
                        }`}
                        onClick={() => col !== "Select" && handleSort(col)}
                        style={{
                          width:
                            col === "Select"
                              ? `${selectColWidth}px`
                              : `${colWidth}px`,
                          minWidth:
                            col === "Select"
                              ? `${selectColWidth}px`
                              : `${colWidth}px`,
                        }}
                      >
                        {col === "Select" ? (
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={handleSelectAll}
                              className="cursor-pointer"
                              title="Select All"
                              disabled={availableRowsCount === 0}
                            />

                            <span className="text-[10px] text-gray-500 font-medium">
                              All
                            </span>
                          </div>
                        ) : (
                          <>
                            {col} {getSortIcon(col)}
                          </>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {sortedRows.length > 0 ? (
                    sortedRows.map((row, rdx) => {
                      const isApproved = approvedRows.has(row.id);
                      const hasWACode = row.hasWACode;
                      const isDisabled = isApproved || hasWACode;

                      return (
                        <tr
                          key={`${row.id}-${rdx}`}
                          className="hover:bg-gray-50"
                        >
                          {columns.map((col) => (
                            <td
                              key={col}
                              className={`p-2 border-r border-gray-200 text-center text-xs whitespace-nowrap ${
                                col === "Select" ? "px-1" : "px-4"
                              }`}
                              style={{
                                width:
                                  col === "Select"
                                    ? `${selectColWidth}px`
                                    : `${colWidth}px`,
                                minWidth:
                                  col === "Select"
                                    ? `${selectColWidth}px`
                                    : `${colWidth}px`,
                              }}
                            >
                              {col === "Select" ? (
                                <input
                                  type="checkbox"
                                  checked={selectedRows.has(row.id)}
                                  onChange={() => handleRowSelect(row.id)}
                                  className="cursor-pointer"
                                  disabled={isDisabled}
                                  title={
                                    isApproved
                                      ? "Already approved"
                                      : hasWACode
                                        ? "Has WO Code - cannot approve"
                                        : ""
                                  }
                                />
                              ) : (
                                <span title={row[col] || ""}>
                                  {row[col] || ""}
                                </span>
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
                        className="p-8 text-center text-gray-500 italic"
                      >
                        No work order available
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
  );
};

export default WorkAssignment;
