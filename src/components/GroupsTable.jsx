import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import * as XLSX from "xlsx";
import { CheckSquare } from "lucide-react";
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
  const displayTime = 3000;
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => document.body.removeChild(toast), 300);
  }, displayTime);
};

const groupColumns = [
  "Purchase Order",
  "Release Number",
  "PO Line Number",
  "Po Line Key",
  "Start date",
  "End date",
  "Resource ID",
  "Resource Name",
  "Resource Line No",
  "Resource Desc",
  "No of Resources",
  "Total Hours",
  "Lab Rate Amt",
  "PLC CD",
  "PLC Desc",
  "GlC CD",
  "GLC Desc",
  "Resource Email ID",
  "Project",
  "Project Name",
  "Role CD",
  "PM User_Id",
  "PM Name",
  "PM Email ID",
  "Org ID",
  "Org Name",
  "Acct ID",
  "Acct Name",
  "Vendor ID",
  "Vendor Name",
  "Resource Manager Emp ID",
  "Resource Manager Emp Name",
  "Resource Manager Emp Email ID",
  "Backup Supervisor",
  "Backup Supervisor Name",
  "Backup Supervisor Email ID",
  "Supervisor Id",
  // "Contact Name",
  "Supervisor Email ID",
  "Hourly Rate",
];

const formatDate = (dateInput) => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(date);
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function GroupsTable() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  const [searchPO, setSearchPO] = useState("");
  const [searchResourceId, setSearchResourceId] = useState("");
  const [searchResourceName, setSearchResourceName] = useState("");

  //import
  const [selectedFile, setSelectedFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [selectedUserFile, setSelectedUserFile] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const poInfoFileInputRef = useRef(null);
  const vendorMasterFileInputRef = useRef(null);

  const API_URL = `${backendUrl}/api/PurchaseOrders`;

  useEffect(() => {
    const userInfo = localStorage.getItem("currentUser");
    if (userInfo) {
      try {
        setCurrentUser(JSON.parse(userInfo));
      } catch {
        navigate("/");
      }
    } else {
      navigate("/");
    }
    setUserLoaded(true);
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Network response failed");
      const apiData = await response.json();

      const mappedData = Array.isArray(apiData)
        ? apiData.map((item) => ({
            id: item.id,
            "Purchase Order": item.purchaseOrderNumber || "",
            "Release Number": item.purchaseOrderRelease || "",
            "PO Line Number": item.poLineNumber || "",
            "Po Line Key": item.poLnKey || "",
            "Start date": formatDate(item.poLnStartDate),
            "End date": formatDate(item.poLnEndDate),

            "Resource ID": item.resourceId || "",
            "Resource Name": item.resourceName || "",
            "Resource Line No": item.resourceLine || "",
            "Resource Desc": item.resourceDesc || "",
            "No of Resources": item.noOfResources ?? "",
            "Total Hours": item.totalHours ?? "",
            "Lab Rate Amt": item.extendedCost ?? "",

            "Hourly Rate": formatCurrency(item.hourlyRate),
            "PLC CD": item.plcCd || "",
            "PLC Desc": item.plcDesc || "",
            "GlC CD": item.glcCd || "",
            "GLC Desc": item.glcDesc || "",

            "Email ID": item.emailId || "",
            "Resource Email ID": item.emailId || "",

            Project: item.project || "",
            "Project Name": item.projectDesc || "",

            "Role CD": item.roleCd || "",
            "PM User_Id": item.pmUserId || "",
            "PM Name": item.pmName || "",
            "PM Email ID": item.pmEmailId || "",

            "Org ID": item.organization || "",
            "Org Name": item.organizationName || "",
            "Acct ID": item.accountId || "",
            "Acct Name": item.accountName || "",

            "Vendor ID": item.vendorId || "",
            "Vendor Name": item.vendorName || "",

            "Resource Manager Emp ID": item.managerIdVendor || "",
            "Resource Manager Emp Name": item.managerNameVendor || "",
            "Resource Manager Emp Email ID": item.managerEmailId || "",

            "Backup Supervisor": item.backupSupervisor || "",
            "Backup Supervisor Name": item.backupSupervisorFName || "",
            "Backup Supervisor Last Name": item.backupSupervisorLName || "",
            "Backup Supervisor Email ID": item.backupSupervisorEmail || "",

            "Supervisor Id": item.supervisorId || "",
            "Supervisor FName": item.supervisorFName || "",
            "Supervisor LName": item.supervisorLName || "",
            "Supervisor Email ID": item.supervisorEmail || "",
            "Contact Name": item.vendorName || "",
          }))
        : [];

      setRows(mappedData);
    } catch (error) {
      console.error("Failed to fetch group data:", error);
      showToast("Failed to load group data.", "error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setUserLoaded(false);
    navigate("/");
  };

  const handleExportExcel = () => {
    if (!processedRows.length) {
      showToast("No data to export", "warning");
      return;
    }

    const headers = groupColumns;

    // Create worksheet data with headers
    const wsData = [
      headers,
      ...processedRows.map((row) => headers.map((header) => row[header] ?? "")),
    ];

    // Create workbook and worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Groups");

    // Set column widths for better readability
    ws["!cols"] = headers.map(() => ({ wch: 20 }));

    // Download the file
    const filename = `groups_${Date.now()}.xlsx`;
    XLSX.writeFile(wb, filename);

    showToast("Excel file exported successfully", "success");
  };

  const handleImportPOInfo = async (e) => {
    e.preventDefault();

    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      showToast("No file selected", "error");
      return;
    }

    // Validate file extension
    const allowedExtensions = [".csv", ".xls", ".xlsx", ".xlsm", ".xlsb"];
    const fileName = selectedFile.name.toLowerCase();

    if (!allowedExtensions.some((ext) => fileName.endsWith(ext))) {
      showToast("Please select a CSV or Excel file", "error");
      return;
    }

    setImportLoading(true);

    try {
      // Fetch presigned URL for upload
      const presignResp = await fetch(
        `${backendUrl}/api/PurchaseOrders/GetPresignedUrl/${encodeURIComponent(
          selectedFile.name,
        )}`,
      );

      if (!presignResp.ok) {
        throw new Error(
          `Failed to get presigned URL (status: ${presignResp.status})`,
        );
      }

      const presignedUrl = await presignResp.text();

      // Upload file via PUT to presigned S3 URL
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type || "application/octet-stream",
        },
        body: selectedFile,
      });

      if (!uploadResponse.ok) {
        throw new Error(
          `Upload to S3 failed: ${uploadResponse.status} ${uploadResponse.statusText}`,
        );
      }

      // Call backend import API that processes the uploaded file
      setLoading(true);
      try {
        const importResponse = await fetch(
          `${backendUrl}/api/PurchaseOrders/import-excel-s3?filename=${encodeURIComponent(
            selectedFile.name,
          )}&Username=${encodeURIComponent(currentUser?.username || "")}`,
          { method: "POST" },
        );

        if (!importResponse.ok) {
          throw new Error(
            `Import API call failed: ${importResponse.status} ${importResponse.statusText}`,
          );
        }

        // if (!importResponse.ok) {
        //   let backendError =
        //     "Import API call failed: " + refreshedResp.statusText;
        //   try {
        //     const errJson = await refreshedResp.json();
        //     // Show message if present, otherwise error stringified
        //     backendError =
        //       errJson.message ||
        //       errJson.error ||
        //       JSON.stringify(errJson) ||
        //       backendError;
        //   } catch {
        //     // fallback: try to get plain text error if not json
        //     backendError = await refreshedResp.text().catch(() => backendError);
        //   }
        //   throw new Error(backendError);
        // }

        const contentType = importResponse.headers.get("content-type") || "";

        if (
          contentType.includes("text/csv") ||
          contentType.includes("text/plain")
        ) {
          const csvText = await importResponse.text();
          const downloadedFileName = `imported_${selectedFile.name.replace(
            /\.(csv|xls|xlsx|xlsm|xlsb)$/i,
            "",
          )}_${Date.now()}.csv`;
          downloadCSV(csvText, downloadedFileName);
          showToast("Import skipped with CSV output", "error");
        } else {
          showToast("Import successful", "success");
        }
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Upload/import error:", error);
      showToast("Upload or import failed: " + error.message, "error");
    } finally {
      setImportLoading(false);
      setSelectedFile(null);
      if (poInfoFileInputRef.current) poInfoFileInputRef.current.value = "";
    }
  };

  const handleImportVendorMaster = async (e) => {
    e.preventDefault();

    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      showToast("No file selected", "error");
      return;
    }

    // Validate file extension
    const allowedExtensions = [".csv", ".xls", ".xlsx", ".xlsm", ".xlsb"];
    const fileName = selectedFile.name.toLowerCase();

    if (!allowedExtensions.some((ext) => fileName.endsWith(ext))) {
      showToast("Please select a CSV or Excel file", "error");
      return;
    }

    setUserLoading(true);

    try {
      // Fetch presigned URL for upload
      const presignResp = await fetch(
        `${backendUrl}/api/PurchaseOrders/GetPresignedUrl/${encodeURIComponent(
          selectedFile.name,
        )}`,
      );

      if (!presignResp.ok) {
        throw new Error(
          `Failed to get presigned URL (status: ${presignResp.status})`,
        );
      }

      const presignedUrl = await presignResp.text();

      // Upload file via PUT to presigned S3 URL
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type || "application/octet-stream",
        },
        body: selectedFile,
      });

      if (!uploadResponse.ok) {
        throw new Error(
          `Upload to S3 failed: ${uploadResponse.status} ${uploadResponse.statusText}`,
        );
      }

      // Call backend import API that processes the uploaded file
      setLoading(true);
      try {
        const importResponse = await fetch(
          `${backendUrl}/api/PurchaseOrders/import-venor-master-s3?filename=${encodeURIComponent(
            selectedFile.name,
          )}&Username=${encodeURIComponent(currentUser?.username || "")}`,
          { method: "POST" },
        );

        if (!importResponse.ok) {
          throw new Error(
            `Import API call failed: ${importResponse.status} ${importResponse.statusText}`,
          );
        }

        // if (!importResponse.ok) {
        //   let backendError =
        //     "Import API call failed: " + refreshedResp.statusText;
        //   try {
        //     const errJson = await refreshedResp.json();
        //     // Show message if present, otherwise error stringified
        //     backendError =
        //       errJson.message ||
        //       errJson.error ||
        //       JSON.stringify(errJson) ||
        //       backendError;
        //   } catch {
        //     // fallback: try to get plain text error if not json
        //     backendError = await refreshedResp.text().catch(() => backendError);
        //   }
        //   throw new Error(backendError);
        // }

        const contentType = importResponse.headers.get("content-type") || "";

        if (
          contentType.includes("text/csv") ||
          contentType.includes("text/plain")
        ) {
          const csvText = await importResponse.text();
          const downloadedFileName = `imported_${selectedFile.name.replace(
            /\.(csv|xls|xlsx|xlsm|xlsb)$/i,
            "",
          )}_${Date.now()}.csv`;
          downloadCSV(csvText, downloadedFileName);
          showToast("Import skipped with CSV output", "error");
        } else {
          showToast("Import successful", "success");
        }
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Upload/import error:", error);
      showToast("Upload or import failed: " + error.message, "error");
    } finally {
      setUserLoading(false);
      setSelectedFile(null);
      if (vendorMasterFileInputRef.current)
        vendorMasterFileInputRef.current.value = "";
    }
  };

  function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // 1) keep your processedRows as-is
  const processedRows = rows.filter((row) => {
    return (
      (row["Purchase Order"] || "")
        .toLowerCase()
        .includes(searchPO.trim().toLowerCase()) &&
      (row["Resource ID"] || "")
        .toLowerCase()
        .includes(searchResourceId.trim().toLowerCase()) &&
      (row["Resource Name"] || "")
        .toLowerCase()
        .includes(searchResourceName.trim().toLowerCase())
    );
  });

  const getSortIcon = (columnKey) => {
    if (columnKey === "Select") return null;
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "asc" ? " ↑" : " ↓";
    }
    return " ⇅";
  };

  // 2) new getSortedRows – NO getFilteredRows reference
  const getSortedRows = () => {
    const filtered = [...processedRows]; // clone

    if (sortConfig.key && sortConfig.key !== "Select") {
      filtered.sort((a, b) => {
        const aRaw = a[sortConfig.key];
        const bRaw = b[sortConfig.key];

        // numeric first (for Hourly Rate etc.)
        const aNum = parseFloat(String(aRaw).replace(/[^0-9.-]/g, ""));
        const bNum = parseFloat(String(bRaw).replace(/[^0-9.-]/g, ""));
        const bothNumeric = !isNaN(aNum) && !isNaN(bNum);

        let cmp;
        if (bothNumeric) {
          cmp = aNum === bNum ? 0 : aNum < bNum ? -1 : 1;
        } else {
          const aVal = String(aRaw ?? "").toLowerCase();
          const bVal = String(bRaw ?? "").toLowerCase();
          cmp = aVal === bVal ? 0 : aVal < bVal ? -1 : 1;
        }

        return sortConfig.direction === "asc" ? cmp : -cmp;
      });
    }

    return filtered;
  };

  // 3) keep handleSort like this
  const handleSort = (key) => {
    if (key === "Select") return;
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // 4) use in render
  const sortedRows = getSortedRows();

  return (
    <div className="min-h-screen bg-[#e7f2f5] text-gray-800 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start">
        <div className="w-full flex flex-col items-center">
          <div className="w-full px-[8px] pt-[4px] pb-[8px]">
            <div className="mb-[5px] flex min-h-[44px] items-center justify-between rounded-[4px] bg-white px-[10px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <h1 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                <CheckSquare className="h-[17px] w-[17px] text-[#287cf0]" />
                Purchase Orders Information
              </h1>
            </div>
            {/* <button
              onClick={handleLogout}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm font-normal shadow transition"
            >
              Logout
            </button> */}
          </div>

          <div className="flex gap-3 mb-3 items-center flex-wrap px-1 w-full ml-3">
            <input
              type="text"
              value={searchPO}
              onChange={(e) => setSearchPO(e.target.value)}
              placeholder="Purchase Order"
              className="border border-gray-300 rounded px-3 py-1.5 text-xs"
            />
            <input
              type="text"
              value={searchResourceId}
              onChange={(e) => setSearchResourceId(e.target.value)}
              placeholder="Resource ID"
              className="border border-gray-300 rounded px-3 py-1.5 text-xs"
            />
            <input
              type="text"
              value={searchResourceName}
              onChange={(e) => setSearchResourceName(e.target.value)}
              placeholder="Resource Name"
              className="border border-gray-300 rounded px-3 py-1.5 text-xs"
            />
          </div>

          <div className="border border-gray-300 rounded bg-white shadow-md w-full p-2 mx-auto">
            {/* Import Buttons with Dynamic Count */}
            <div className="flex justify-end items-center gap-2 mb-2">
              <input
                type="file"
                ref={poInfoFileInputRef}
                onChange={handleImportPOInfo}
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                disabled={importLoading}
              />
              <button
                onClick={() => poInfoFileInputRef.current.click()}
                disabled={importLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-normal shadow transition"
              >
                {importLoading ? "Processing..." : "Import-PO-Info"}
              </button>

              <input
                type="file"
                ref={vendorMasterFileInputRef}
                onChange={handleImportVendorMaster}
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                disabled={userLoading}
              />
              <button
                onClick={() => vendorMasterFileInputRef.current.click()}
                disabled={userLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-xs font-normal shadow transition"
              >
                {userLoading ? "Processing..." : "Import-Vendor-Master"}
              </button>

              {/* export button */}
              <button
                type="button"
                onClick={handleExportExcel}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Export Excel
              </button>
            </div>

            <div className="flex-1 overflow-hidden px-4 pb-4">
              <div className="border border-gray-200 rounded bg-white shadow-sm overflow-auto h-[calc(100vh-300px)]">
                <table className="w-max min-w-full text-left border-collapse table-fixed">
                  <thead className="thead sticky top-0 z-10">
                    <tr className="text-[10px] capitalize text-gray-500 border-b">
                      {groupColumns.map((col) => (
                        <th
                          key={col}
                          className="th-thead cursor-pointer select-none whitespace-nowrap text-center px-4"
                          onClick={() => handleSort(col)}
                        >
                          {col} {getSortIcon(col)}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="tbody">
                    {loading ? (
                      <tr className="border-b border-gray-200">
                        <td
                          colSpan={groupColumns.length}
                          className="p-5 text-left italic text-gray-500 text-xs"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : sortedRows.length > 0 ? (
                      sortedRows.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-gray-200 transition-colors duration-500 text-xs text-gray-800 hover:bg-gray-50"
                        >
                          {groupColumns.map((col) => (
                            <td
                              key={col}
                              className="p-2 px-4 border-r border-gray-200 text-center whitespace-nowrap"
                            >
                              {row[col]}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b border-gray-200">
                        <td
                          colSpan={groupColumns.length}
                          className="p-5 text-center italic text-gray-500 text-xs"
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
