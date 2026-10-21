// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "./datepicker.css";
// import InvoiceViewer from "./Invoice";
// import {
//   Clock,
//   MessageSquare,
//   Download,
//   Receipt,
//   Package,
//   Users,
// } from "lucide-react";
// import { backendUrl } from "./config";

// export default function ExportTable() {
//   const navigate = useNavigate();
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [userLoaded, setUserLoaded] = useState(false);
//   const [searchDate, setSearchDate] = useState("");
//   const [searchEmployeeId, setSearchEmployeeId] = useState("");
//   const [searchEmployeeName, setSearchEmployeeName] = useState("");
//   const [selectedRows, setSelectedRows] = useState(new Set());
//   const [selectAll, setSelectAll] = useState(false);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
//   const [searchPOID, setSearchPOID] = useState("");
//   const [searchVendID, setSearchVendID] = useState("");
//   const [searchPOReleaseNo, setSearchPOReleaseNo] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [batchId, setBatchId] = useState("");
//   const [dynamicColumns, setDynamicColumns] = useState([]); // Dynamic columns from API
//   const [columnFilters, setColumnFilters] = useState({}); // Filters for dynamic columns
//   const [invoiceModalVisible, setInvoiceModalVisible] = React.useState(false);
//   const [invoiceData, setInvoiceData] = React.useState(null);

//   const [showInvoice, setShowInvoice] = React.useState(false);
//   const [statusFilter, setStatusFilter] = useState({
//     approved: false,
//     invoiceGenerated: false,
//     exported: false,
//   });

//   const isAdmin = currentUser?.role === "admin" || currentUser?.role === "pm";

//   // Generate columns dynamically: Select + dynamic columns from API
//   const columns = ["Select", ...dynamicColumns];

//   const colWidth = 120;
//   const minTableWidth = columns.length * colWidth;

//   // Format date to MM/DD/YYYY with leading zeros
//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return dateString;
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const day = String(date.getDate()).padStart(2, "0");
//       const year = date.getFullYear();
//       return `${month}/${day}/${year}`;
//     } catch {
//       return dateString;
//     }
//   };

//   const toTitleCase = (str) => {
//     if (!str) return "";
//     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
//   };

//   // status badge base style and helper
//   const baseStyle =
//     "px-2.5 py-1 text-xs font-semibold rounded-full text-center inline-block";
//   const statusClass = (s) => {
//     const su = String(s || "").toUpperCase();
//     if (su === "PROCESSED") return `${baseStyle} bg-green-100 text-green-800`;
//     if (su === "INVOICED") return `${baseStyle} bg-yellow-100 text-yellow-800`;
//     if (su === "EXPORTED") return `${baseStyle} bg-blue-100 text-blue-800`;
//     if (su === "SUBMITTED") return `${baseStyle} bg-purple-100 text-purple-800`;
//     if (su === "REJECTED") return `${baseStyle} bg-red-100 text-red-800`;
//     if (su === "PENDING") return `${baseStyle} bg-yellow-100 text-yellow-800`;
//     return `${baseStyle} bg-gray-100 text-gray-700`;
//   };
//   // const baseStyle =
//   //   "px-2.5 py-1 text-xs font-semibold rounded-full text-center inline-block";

//   // const statusClass = (s) => {
//   //   const su = String(s || "").toUpperCase();

//   //   if (su === "OPEN") return `${baseStyle} bg-yellow-400 text-yellow-900`; // Bright yellow, dark text
//   //   if (su === "SUBMITTED") return `${baseStyle} bg-blue-100 text-blue-700`; // Light blue, medium blue
//   //   if (su === "REJECTED") return `${baseStyle} bg-red-600 text-red-100`; // intense red background, light text
//   //   if (su === "APPROVED") return `${baseStyle} bg-yellow-200 text-yellow-800`; // light beige/yellow, brownish text
//   //   if (
//   //     su === "INVOICED" ||
//   //     su === "INV_GEN" ||
//   //     su === "INVOICE GENERATED" ||
//   //     su === "INVOICE_GENERATED" ||
//   //     su === "INVOICEGENERATED"
//   //   )
//   //     return `${baseStyle} bg-pink-200 text-pink-700`; // light pink, medium pink text
//   //   if (su === "EXPORTED") return `${baseStyle} bg-green-600 text-green-900`; // medium green background, dark green text
//   //   if (su === "PENDING") return `${baseStyle} bg-yellow-300 text-yellow-800`; // yellow background with darker yellow text

//   //   return `${baseStyle} bg-gray-100 text-gray-700`; // default gray
//   // };

//   const formatHours = (hours) => {
//     if (!hours && hours !== 0) return "";
//     const numHours = parseFloat(hours);
//     if (isNaN(numHours)) return hours;
//     return numHours.toFixed(2);
//   };

//   useEffect(() => {
//     const today = new Date();
//     const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

//     // Calculate date for Monday (subtract days from today)
//     const monday = new Date(today);
//     monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

//     // Calculate date for Sunday (add days to today)
//     const sunday = new Date(monday);
//     sunday.setDate(monday.getDate() + 6);

//     // Format YYYY-MM-DD strings
//     const formatDate = (d) => {
//       const year = d.getFullYear();
//       const month = String(d.getMonth() + 1).padStart(2, "0");
//       const day = String(d.getDate()).padStart(2, "0");
//       return `${year}-${month}-${day}`;
//     };

//     setStartDate(formatDate(monday));
//     setEndDate(formatDate(sunday));
//   }, []); // Run once on mount

//   // Convert API field names to display names
//   //   const formatColumnName = (fieldName) => {
//   //     // Handle specific field mappings
//   //     const fieldMappings = {
//   //       timesheet_Date: "Timesheet Date",
//   //       resource_Id: "Employee ID",
//   //       displayedName: "Name",
//   //       employeeName: "Employee Name",
//   //       resource_Name: "Employee Name",
//   //       projId: "Project ID",
//   //       projectId: "Project ID",
//   //       plc: "PLC",
//   //       projectLaborCategory: "Project Labor Category",
//   //       payType: "Pay Type",
//   //       rlseNumber: "RLSE Number",
//   //       poNumber: "PO Number",
//   //       poLineNumber: "PO Line Number",
//   //       fiscalYear: "Fiscal Year",
//   //       timesheetTypeCode: "Timesheet Type Code",
//   //       sequenceNumber: "Seq No",
//   //       createdAt: "Created At",
//   //       updatedAt: "Updated At",
//   //       batchId: "Batch ID",
//   //       vend_Id: "Vendor ID",
//   //       vend_Name: "Vendor Name",
//   //       description: "Description",
//   //       glc: "GLC",
//   //       invoiceGenerated: "Invoice Generated",
//   //     };

//   //     if (fieldMappings[fieldName]) {
//   //       return fieldMappings[fieldName];
//   //     }

//   //     // Convert camelCase or snake_case to Title Case
//   //     return fieldName
//   //       .replace(/([A-Z])/g, " $1")
//   //       .replace(/[_-]/g, " ")
//   //       .replace(/\b\w/g, (l) => l.toUpperCase())
//   //       .trim();
//   //   };

//   //format date
//   // Add this useEffect to set the default search date

//   // Get sorted rows with arrow
//   const getSortedRows = (rowsToSort) => {
//     let sorted = [...rowsToSort];

//     if (sortConfig.key) {
//       sorted.sort((a, b) => {
//         let aVal, bVal;

//         // Handle different column types
//         if (
//           sortConfig.key === "Timesheet Date" ||
//           sortConfig.key.toLowerCase().includes("date")
//         ) {
//           aVal = new Date(a.originalDate || a[sortConfig.key]);
//           bVal = new Date(b.originalDate || b[sortConfig.key]);
//           if (isNaN(aVal.getTime())) aVal = new Date(0);
//           if (isNaN(bVal.getTime())) bVal = new Date(0);
//           return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
//         } else if (
//           sortConfig.key === "Hours" ||
//           sortConfig.key.toLowerCase().includes("hour")
//         ) {
//           aVal = parseFloat(a[sortConfig.key]) || 0;
//           bVal = parseFloat(b[sortConfig.key]) || 0;
//           return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
//         } else if (
//           sortConfig.key.toLowerCase().includes("id") ||
//           sortConfig.key.toLowerCase().includes("number") ||
//           sortConfig.key.toLowerCase().includes("seq")
//         ) {
//           // Numeric sorting for ID fields
//           aVal = parseInt(a[sortConfig.key]) || 0;
//           bVal = parseInt(b[sortConfig.key]) || 0;
//           if (aVal === bVal) {
//             // If numeric values are equal, fall back to string comparison
//             aVal = String(a[sortConfig.key] || "").toLowerCase();
//             bVal = String(b[sortConfig.key] || "").toLowerCase();
//             if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//             if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//             return 0;
//           }
//           return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
//         } else if (sortConfig.key === "Status") {
//           const getStatusPriority = (status) => {
//             const statusUpper = String(status || "PENDING").toUpperCase();
//             switch (statusUpper) {
//               case "OPEN":
//                 return 1;
//               case "PENDING":
//                 return 2;
//               case "PROCESSED":
//                 return 3;
//               case "REJECTED":
//                 return 4;
//               default:
//                 return 5;
//             }
//           };

//           aVal = getStatusPriority(a["Status"]);
//           bVal = getStatusPriority(b["Status"]);

//           return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
//         } else {
//           // String sorting for all other columns
//           aVal = String(a[sortConfig.key] || "").toLowerCase();
//           bVal = String(b[sortConfig.key] || "").toLowerCase();
//           if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//           if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//           return 0;
//         }
//       });
//     } else {
//       // Default sorting - Sort by date if available
//       sorted.sort((a, b) => {
//         let aDate = new Date(a.originalDate || a["Timesheet Date"]);
//         let bDate = new Date(b.originalDate || b["Timesheet Date"]);
//         if (isNaN(aDate.getTime())) aDate = new Date(0);
//         if (isNaN(bDate.getTime())) bDate = new Date(0);
//         if (aDate.getTime() !== bDate.getTime()) {
//           return bDate.getTime() - aDate.getTime();
//         }

//         // Secondary sort by Employee ID if available
//         const aEmpId = String(
//           a["Employee ID"] || a["Resource ID"] || "",
//         ).toLowerCase();
//         const bEmpId = String(
//           b["Employee ID"] || b["Resource ID"] || "",
//         ).toLowerCase();
//         return aEmpId.localeCompare(bEmpId);
//       });
//     }

//     return sorted;
//   };

//   const handleSort = (key) => {
//     if (key === "All") return; // Skip checkbox column

//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   const getSortIcon = (columnKey) => {
//     if (columnKey === "All") return null; // Skip checkbox column

//     if (sortConfig.key === columnKey) {
//       return sortConfig.direction === "asc" ? " ↑" : " ↓";
//     }
//     return " ⇅";
//   };

//   useEffect(() => {
//     const userInfo = localStorage.getItem("currentUser");
//     if (userInfo) {
//       try {
//         const parsedUser = JSON.parse(userInfo);
//         if (!parsedUser.username) {
//           parsedUser.username =
//             parsedUser.id === "john"
//               ? "john.doe"
//               : parsedUser.id === "jane"
//                 ? "jane.smith"
//                 : parsedUser.id;
//         }
//         setCurrentUser(parsedUser);
//         setUserLoaded(true);
//       } catch (error) {
//         showToast("Session expired. Please login again.", "error");
//         navigate("/");
//       }
//     } else {
//       navigate("/");
//     }
//   }, [navigate]);

//   useEffect(() => {
//     if (userLoaded && currentUser) {
//       fetchExportData();
//     }
//   }, [userLoaded, currentUser]);

//   const fetchExportData = async () => {
//     if (!userLoaded || !currentUser) return;
//     try {
//       setLoading(true);

//       const resourceId = currentUser.username;

//       if (!resourceId) {
//         showToast("User resource ID not found. Please login again.", "error");
//         navigate("/");
//         return;
//       }

//       const apiUrl = `${backendUrl}/api/SubkTimesheet/GetDetailedTimesheetsByStatus?status=PROCESSED&resourceId=${resourceId}`;

//       const response = await fetch(apiUrl, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!response.ok)
//         throw new Error(`HTTP error! status: ${response.status}`);
//       const apiData = await response.json();

//       if (Array.isArray(apiData) && apiData.length > 0) {
//         // **FIXED: Use predefined columns instead of dynamic columns**
//         const predefinedColumns = [
//           // "Status",
//           "Invoice Generated",
//           "Work Order",
//           "Employee ID",
//           "Employee Name",
//           "Description",
//           "PLC",
//           "Pay Type",
//           "Hours Date",
//           "Hours",
//           "Per Hour Rate",
//           "Amount",
//           "Vendor ID",
//           "Vendor Name",
//           "Project ID",
//           "GLC",
//           "PO Number",
//           "RLSE Number",
//           "PM User Id",
//           "PO Line Number",
//           "Rvsn Number",
//           "Timesheet Date",
//         ];

//         // Set fixed columns instead of dynamic ones
//         setDynamicColumns(predefinedColumns);

//         // **FIXED: Map data using predefined column structure**
//         const mappedData = apiData.map((item, index) => {
//           const mappedRow = {
//             id: item.timesheetId || item.id || `export-${index}`,
//             originalDate:
//               item.timesheet_Date || item.timesheetDate || item.createdAt,
//             originalItem: item,
//           };

//           // Map only the predefined columns with specific data mapping
//           mappedRow["Status"] = toTitleCase(item.status || "");
//           mappedRow["Invoice Generated"] =
//             item.invoiceGenerated || item.invoicegenerated || "";
//           mappedRow["Work Order"] = item.wa_code || item.wa_Code || "";
//           mappedRow["Employee ID"] = item.resource_Id || item.resourceId || "";
//           mappedRow["Employee Name"] =
//             item.resource_name || item.resource_Name || "";
//           mappedRow["Description"] = item.description || "";
//           mappedRow["PLC"] = item.plc || "";
//           mappedRow["Pay Type"] = item.paytype || item.payType || "";
//           mappedRow["Hours Date"] = formatDate(
//             item.hours_date_str || item.hoursDatestr || item.hours_Date_str,
//           );
//           mappedRow["Hours"] = formatHours(item.hours);
//           mappedRow["Per Hour Rate"] =
//             item.perhrrate || item.perHrRate || item.rate || "";
//           mappedRow["Amount"] = item.amt || item.amount || "";
//           mappedRow["Vendor ID"] =
//             item.vend_id || item.vend_Id || item.vendorId || "";
//           mappedRow["Vendor Name"] =
//             item.vend_name || item.vend_Name || item.vendorName || "";
//           mappedRow["Project ID"] = item.projId || item.projid || "";
//           mappedRow["GLC"] = item.glc || "";
//           mappedRow["PO Number"] = item.ponumber || item.poNumber || "";
//           mappedRow["RLSE Number"] = item.rlseNumber || item.rlsenumber || "";
//           mappedRow["PM User Id"] = item.pm_User_Id || item.pm_user_id || "";
//           mappedRow["PO Line Number"] =
//             item.poLineNumber || item.polinenumber || "";
//           // mappedRow["Rvsn Number"] =
//           //   item.rvsnNumber || item.rvsnNum || item.revisionNumber || "";
//           mappedRow["Rvsn Number"] = item.rvsnNumber;
//           mappedRow["Timesheet Date"] = formatDate(
//             item.timesheet_Date || item.timesheet_date || "",
//           );

//           return mappedRow;
//         });

//         setRows(mappedData);
//       } else {
//         // **FIXED: Set empty array for predefined columns**
//         setDynamicColumns([]);
//         setRows([]);
//       }

//       setSelectedRows(new Set());
//       setSelectAll(false);
//     } catch (error) {
//       console.error("Fetch error:", error);
//       showToast(
//         "Failed to load export data. Please check your connection.",
//         "error",
//       );
//       setRows([]);
//       // **FIXED: Clear with empty array instead of dynamic columns**
//       setDynamicColumns([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Updated fetch function to show default columns when no data
//   // const fetchExportData = async () => {
//   //   if (!userLoaded || !currentUser) return;
//   //   try {
//   //     setLoading(true);

//   //     const resourceId = currentUser.username;

//   //     if (!resourceId) {
//   //       showToast('User resource ID not found. Please login again.', "error");
//   //       navigate("/");
//   //       return;
//   //     }

//   //     const apiUrl = `${backendUrl}/api/SubkTimesheet/GetDetailedTimesheetsByStatus?status=Approved&resourceId=${resourceId}`;

//   //     const response = await fetch(apiUrl, {
//   //       method: 'GET',
//   //       headers: { 'Content-Type': 'application/json' }
//   //     });

//   //     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//   //     const apiData = await response.json();

//   //     // Define default columns to show when no data is available
//   //     const defaultColumns = [
//   //       'Status',
//   //       'Timesheet Date',
//   //       'Employee ID',
//   //       'Name',
//   //       'Hours',
//   //       'Project ID',
//   //       'PLC',
//   //       'Pay Type',
//   //       'PO Number',
//   //       'RLSE Number',
//   //       'Fiscal Year',
//   //       'Batch ID'
//   //     ];

//   //     if (Array.isArray(apiData) && apiData.length > 0) {
//   //       // Extract all unique keys from the first item to build dynamic columns
//   //       const firstItem = apiData[0];
//   //       const allKeys = Object.keys(firstItem);

//   //       // Filter out internal fields
//   //       const filteredKeys = allKeys
//   //         .filter(key =>
//   //           !['id', 'timesheetId', '_id', '__v', 'originalItem'].includes(key)
//   //         );

//   //       // Separate Status and other columns
//   //       const statusKey = filteredKeys.find(key =>
//   //         formatColumnName(key).toLowerCase() === 'status'
//   //       );
//   //       const otherKeys = filteredKeys.filter(key =>
//   //         formatColumnName(key).toLowerCase() !== 'status'
//   //       );

//   //       // Build display columns with Status first, then others
//   //       const displayColumns = [];
//   //       if (statusKey) {
//   //         displayColumns.push(formatColumnName(statusKey));
//   //       }
//   //       displayColumns.push(...otherKeys.map(key => formatColumnName(key)));

//   //       setDynamicColumns(displayColumns);

//   //       const mappedData = apiData.map((item, index) => {
//   //         const mappedRow = {
//   //           id: item.timesheetId || item.id || `export-${index}`,
//   //           originalDate: item.timesheet_Date || item.timesheetDate || item.createdAt,
//   //           originalItem: item,
//   //         };

//   //         // Map all fields from API response to display columns
//   //         allKeys.forEach(key => {
//   //           const displayKey = formatColumnName(key);
//   //           let value = item[key];

//   //           // Special formatting for different data types
//   //           if (key === 'timesheet_Date' || key.toLowerCase().includes('date')) {
//   //             value = formatDate(value);
//   //           } else if (key === 'hours' || key.toLowerCase().includes('hour')) {
//   //             value = formatHours(value);
//   //           } else if (value === null || value === undefined) {
//   //             value = '';
//   //           } else {
//   //             value = String(value);
//   //           }

//   //           mappedRow[displayKey] = value;
//   //         });

//   //         return mappedRow;
//   //       });

//   //       setRows(mappedData);
//   //     } else {
//   //       // When no data is available, show default columns instead of empty array
//   //       setDynamicColumns(defaultColumns);
//   //       setRows([]);
//   //     }

//   //     setSelectedRows(new Set());
//   //     setSelectAll(false);
//   //   } catch (error) {
//   //     console.error('Fetch error:', error);
//   //     showToast('Failed to load export data. Please check your connection.', "error");
//   //     setRows([]);
//   //     // Show default columns even on error
//   //     setDynamicColumns([
//   //       'Status',
//   //       'Timesheet Date',
//   //       'Employee ID',
//   //       'Name',
//   //       'Hours',
//   //       'Project ID',
//   //       'PLC',
//   //       'Pay Type',
//   //       'PO Number',
//   //       'RLSE Number',
//   //       'Fiscal Year',
//   //       'Batch ID'
//   //     ]);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const getFilteredRows = () => {
//     let filtered = rows;
//     if (!Array.isArray(filtered)) return [];

//     // Filter by single date (existing functionality)
//     if (searchDate) {
//       filtered = filtered.filter((row) => {
//         const rowDate = new Date(row.originalDate);
//         const selectedDate = new Date(searchDate + "T00:00:00");
//         return (
//           rowDate.getFullYear() === selectedDate.getFullYear() &&
//           rowDate.getMonth() === selectedDate.getMonth() &&
//           rowDate.getDate() === selectedDate.getDate()
//         );
//       });
//     }

//     // const statusCodes = [];
//     // if (statusFilter.approved) statusCodes.push("APPROVED");
//     // // if (statusFilter.invoiceGenerated) statusCodes.push("INVOICED");
//     // // if (statusFilter.exported) statusCodes.push("EXPORTED");

//     // if (statusCodes.length > 0) {
//     //   filtered = filtered.filter((row) =>
//     //     statusCodes.includes((row.Status || row.status || "").toUpperCase())
//     //   );
//     // }

//     // Updated status filter logic
//     if (statusFilter.approved) {
//       filtered = filtered.filter((row) => {
//         const isApproved =
//           (row.Status || row.status)?.toUpperCase() === "PROCESSED";
//         const invoiceNotGenerated = !(
//           row.originalItem?.invoiceGenerated === true ||
//           row["Invoice Generated"] === "Y" ||
//           row["Invoice Generated"] === true ||
//           row.invoiceGenerated === true
//         );
//         return isApproved && invoiceNotGenerated;
//       });
//     }

//     // Invoice Generated Filter - Separate from status filter
//     if (statusFilter.invoiceGenerated) {
//       filtered = filtered.filter((row) => {
//         // Check if the row has invoiceGenerated field set to true
//         return (
//           row.originalItem?.invoiceGenerated === true ||
//           row["Invoice Generated"] === true ||
//           row.invoiceGenerated === true
//         );
//       });
//     }

//     // Filter by date range (Start date and End date)
//     if (startDate || endDate) {
//       filtered = filtered.filter((row) => {
//         const rowDate = new Date(row["Hours Date"]);
//         let inRange = true;

//         if (startDate) {
//           const start = new Date(startDate + "T00:00:00");
//           inRange = inRange && rowDate >= start;
//         }

//         if (endDate) {
//           const end = new Date(endDate + "T23:59:59");
//           inRange = inRange && rowDate <= end;
//         }

//         return inRange;
//       });
//     }

//     // Employee ID filter
//     if (searchEmployeeId.trim()) {
//       filtered = filtered.filter((row) =>
//         (row["Employee ID"] || row["Resource ID"] || "")
//           .toLowerCase()
//           .includes(searchEmployeeId.trim().toLowerCase()),
//       );
//     }

//     // Employee Name filter
//     if (searchEmployeeName.trim()) {
//       filtered = filtered.filter((row) =>
//         (row["Name"] || row["Employee Name"] || row["Resource Name"] || "")
//           .toLowerCase()
//           .includes(searchEmployeeName.trim().toLowerCase()),
//       );
//     }

//     // PO ID filter
//     if (searchPOID.trim()) {
//       filtered = filtered.filter((row) =>
//         (row["PO Number"] || "")
//           .toLowerCase()
//           .includes(searchPOID.trim().toLowerCase()),
//       );
//     }

//     // VEND ID filter
//     if (searchVendID.trim()) {
//       filtered = filtered.filter((row) =>
//         (row["Vendor ID"] || "")
//           .toLowerCase()
//           .includes(searchVendID.trim().toLowerCase()),
//       );
//     }

//     // PO RELEASE NO filter
//     if (searchPOReleaseNo.trim()) {
//       filtered = filtered.filter((row) =>
//         (row["RLSE Number"] || "")
//           .toLowerCase()
//           .includes(searchPOReleaseNo.trim().toLowerCase()),
//       );
//     }

//     // Apply dynamic column filters
//     Object.keys(columnFilters).forEach((columnName) => {
//       const filterValue = columnFilters[columnName];
//       if (filterValue && filterValue.trim()) {
//         filtered = filtered.filter((row) =>
//           (row[columnName] || "")
//             .toLowerCase()
//             .includes(filterValue.trim().toLowerCase()),
//         );
//       }
//     });

//     return getSortedRows(filtered);
//   };

//   const filteredRows = getFilteredRows();

//   // Handle individual row selection
//   const handleRowSelect = (rowId) => {
//     const newSelectedRows = new Set(selectedRows);
//     if (newSelectedRows.has(rowId)) {
//       newSelectedRows.delete(rowId);
//     } else {
//       newSelectedRows.add(rowId);
//     }
//     setSelectedRows(newSelectedRows);
//     setSelectAll(
//       newSelectedRows.size === filteredRows.length && filteredRows.length > 0,
//     );
//   };

//   //Handle select all
//   // const handleSelectAll = () => {
//   //   if (selectAll) {
//   //     setSelectedRows(new Set());
//   //     setSelectAll(false);
//   //   } else {
//   //     const allRowIds = new Set(filteredRows.map((row) => row.id));
//   //     setSelectedRows(allRowIds);
//   //     setSelectAll(true);
//   //   }
//   // };

//   // Determine if any approved rows exist
//   // const hasApprovedRows = filteredRows.some(
//   //   (row) => (row.Status || row.status || "").toUpperCase() === "APPROVED"
//   // );
//   // const handleSelectAll = () => {
//   //   if (selectAll) {
//   //     setSelectedRows(new Set());
//   //     setSelectAll(false);
//   //   } else {
//   //     const approvedRowIds = filteredRows
//   //       .filter(
//   //         (row) => (row.Status || row.status || "").toUpperCase() === "APPROVED"
//   //       )
//   //       .map((row) => row.id);

//   //     setSelectedRows(new Set(approvedRowIds));
//   //     setSelectAll(true);
//   //   }
//   // };

//   // useEffect(() => {
//   //   const approvedRows = filteredRows.filter(
//   //     (row) => (row.Status || row.status || "").toUpperCase() === "APPROVED"
//   //   );
//   //   if (approvedRows.length > 0) {
//   //     const allSelected = approvedRows.every((row) => selectedRows.has(row.id));
//   //     setSelectAll(allSelected);
//   //   } else {
//   //     setSelectAll(false);
//   //   }
//   // }, [filteredRows, selectedRows]);

//   // Check for rows that are approved AND have invoiceGenerated as false (N)

//   const hasApprovedRows = filteredRows.some(
//     (row) =>
//       (row.Status || row.status || "").toUpperCase() === "PROCESSED" &&
//       !(
//         row.originalItem?.invoiceGenerated === true ||
//         row["Invoice Generated"] === "Y" ||
//         row["Invoice Generated"] === true ||
//         row.invoiceGenerated === true
//       ),
//   );

//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedRows(new Set());
//       setSelectAll(false);
//     } else {
//       const approvedRowIds = filteredRows
//         .filter(
//           (row) =>
//             (row.Status || row.status || "").toUpperCase() === "PROCESSED" &&
//             !(
//               row.originalItem?.invoiceGenerated === true ||
//               row["Invoice Generated"] === "Y" ||
//               row["Invoice Generated"] === true ||
//               row.invoiceGenerated === true
//             ),
//         )
//         .map((row) => row.id);

//       setSelectedRows(new Set(approvedRowIds));
//       setSelectAll(true);
//     }
//   };

//   useEffect(() => {
//     const approvedRows = filteredRows.filter(
//       (row) =>
//         (row.Status || row.status || "").toUpperCase() === "PROCESSED" &&
//         !(
//           row.originalItem?.invoiceGenerated === true ||
//           row["Invoice Generated"] === "Y" ||
//           row["Invoice Generated"] === true ||
//           row.invoiceGenerated === true
//         ),
//     );

//     if (approvedRows.length > 0) {
//       const allSelected = approvedRows.every((row) => selectedRows.has(row.id));
//       setSelectAll(allSelected);
//     } else {
//       setSelectAll(false);
//     }
//   }, [filteredRows, selectedRows]);

//   const handleLogout = () => {
//     localStorage.removeItem("currentUser");
//     setCurrentUser(null);
//     setUserLoaded(false);
//     showToast("Logged out successfully", "info");
//     navigate("/");
//   };

//   // Export selected rows with POST request containing selected data (unchanged)
//   // const handleExportClick = async (e) => {
//   //   e.preventDefault();
//   //   e.stopPropagation();
//   //   if (actionLoading) return;

//   //   if (selectedRows.size === 0) {
//   //     showToast('Please select at least one timesheet to export', 'warning');
//   //     return;
//   //   }

//   //   try {
//   //     setActionLoading(true);

//   //     // Get selected row data
//   //     const selectedData = filteredRows.filter(row => selectedRows.has(row.id));

//   //     if (selectedData.length === 0) {
//   //       showToast('No selected data to export', 'warning');
//   //       return;
//   //     }

//   //     // Prepare payload with selected row data
//   //     const payload = {
//   //       selectedTimesheets: selectedData.map(row => row.originalItem), // Send original API data
//   //       exportRequest: {
//   //         requestedBy: currentUser?.username || currentUser?.id || 'admin',
//   //         requestDate: new Date().toISOString(),
//   //         totalRecords: selectedData.length,
//   //         batchId: batchId || null,
//   //         filters: {
//   //           date: searchDate || null,
//   //           startDate: startDate || null,
//   //           endDate: endDate || null,
//   //           employeeId: searchEmployeeId || null,
//   //           employeeName: searchEmployeeName || null,
//   //         }
//   //       }
//   //     };

//   //     // Send POST request with selected data (keep original export API)
//   //     const response = await fetch('${backendUrl}/api/SubkTimesheet/export-csv', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify(payload.selectedTimesheets)
//   //     });

//   //     if (response.ok) {
//   //       const contentType = response.headers.get('content-type');
//   //       if (contentType && contentType.includes('text/csv')) {
//   //         const csvData = await response.text();
//   //         const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
//   //         const url = window.URL.createObjectURL(blob);
//   //         const a = document.createElement('a');
//   //         a.href = url;
//   //         a.download = `exported_selected_timesheets_${new Date().toISOString().split('T')[0]}.csv`;
//   //         document.body.appendChild(a);
//   //         a.click();
//   //         a.remove();
//   //         window.URL.revokeObjectURL(url);
//   //         showToast(`Exported ${selectedData.length} selected timesheets successfully`, 'success');
//   //       } else {
//   //         const csvHeaders = dynamicColumns.join(',');
//   //         const csvRows = selectedData.map(row =>
//   //           dynamicColumns.map(col => {
//   //             const value = row[col] || '';
//   //             return `"${String(value).replace(/"/g, '""')}"`;
//   //           }).join(',')
//   //         );
//   //         const csvContent = [csvHeaders, ...csvRows].join('\n');
//   //         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//   //         const url = window.URL.createObjectURL(blob);
//   //         const a = document.createElement('a');
//   //         a.href = url;
//   //         a.download = `exported_selected_timesheets_${new Date().toISOString().split('T')[0]}.csv`;
//   //         document.body.appendChild(a);
//   //         a.click();
//   //         a.remove();
//   //         window.URL.revokeObjectURL(url);
//   //         showToast(`Exported ${selectedData.length} selected timesheets successfully`, 'success');
//   //       }
//   //     } else {
//   //       throw new Error(`Export API failed with status: ${response.status}`);
//   //     }
//   //   } catch (error) {
//   //     console.error('Export error:', error);
//   //     showToast('Export failed. Please try again.', 'error');
//   //   } finally {
//   //     setActionLoading(false);
//   //   }
//   // };

//   // Add this function to ExportTable.jsx

//   const handleInvoiceSuccess = async (invoiceData) => {
//     try {
//       // Update local state immediately for better UX
//       const updatedRows = rows.map((row) => {
//         // Check if this row was part of the invoice
//         const wasInvoiced = invoiceData.lineItems?.some(
//           (lineItem) =>
//             lineItem.timesheetId === row.originalItem?.timesheetId ||
//             lineItem.employee === row["Employee ID"] ||
//             lineItem.line_No === row["Seq No"],
//         );

//         if (wasInvoiced) {
//           return {
//             ...row,
//             "Invoice Generated": "Y",
//             originalItem: {
//               ...row.originalItem,
//               invoiceGenerated: true,
//             },
//           };
//         }
//         return row;
//       });

//       setRows(updatedRows);

//       // Refresh from server to ensure consistency
//       setTimeout(() => {
//         fetchExportData();
//       }, 1000);
//     } catch (error) {
//       console.error("Error updating data after invoice:", error);
//       showToast("Invoice created but failed to refresh data", "warning");
//     }
//   };

//   // Export selected rows with POST request containing selected data
//   const handleExportClick = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (actionLoading) return;

//     if (selectedRows.size === 0) {
//       showToast("Please select at least one timesheet to export", "warning");
//       return;
//     }

//     try {
//       setActionLoading(true);

//       // Get selected row data
//       const selectedData = filteredRows.filter((row) =>
//         selectedRows.has(row.id),
//       );

//       if (selectedData.length === 0) {
//         showToast("No selected data to export", "warning");
//         return;
//       }

//       // Prepare payload with selected row data - ADD CREATEDBY FIELD
//       const payload = selectedData.map((row) => {
//         const originalItem = row.originalItem;

//         // Ensure CreatedBy field is included
//         return {
//           ...originalItem,
//           CreatedBy:
//             originalItem.CreatedBy ||
//             currentUser?.username ||
//             currentUser?.id ||
//             "admin",
//           // Add other potentially missing required fields
//           UpdatedBy:
//             originalItem.UpdatedBy ||
//             currentUser?.username ||
//             currentUser?.id ||
//             "admin",
//           CreatedAt: originalItem.CreatedAt || new Date().toISOString(),
//           UpdatedAt: originalItem.UpdatedAt || new Date().toISOString(),
//         };
//       });

//       console.log("Export payload:", payload); // Debug log to verify CreatedBy field

//       // Send POST request with selected data
//       const response = await fetch(
//         `${backendUrl}/api/SubkTimesheet/export-csv`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload), // Send the enhanced payload with CreatedBy
//         },
//       );

//       if (response.ok) {
//         const contentType = response.headers.get("content-type");
//         if (contentType && contentType.includes("text/csv")) {
//           const csvData = await response.text();
//           const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
//           const url = window.URL.createObjectURL(blob);
//           const a = document.createElement("a");
//           a.href = url;
//           a.download = `exported_selected_timesheets_${
//             new Date().toISOString().split("T")[0]
//           }.csv`;
//           document.body.appendChild(a);
//           a.click();
//           a.remove();
//           window.URL.revokeObjectURL(url);
//           showToast(
//             `Exported ${selectedData.length} selected timesheets successfully`,
//             "success",
//           );
//         } else {
//           // Fallback CSV generation
//           const csvHeaders = dynamicColumns.join(",");
//           const csvRows = selectedData.map((row) =>
//             dynamicColumns
//               .map((col) => {
//                 const value = row[col] || "";
//                 return `"${String(value).replace(/"/g, '""')}"`;
//               })
//               .join(","),
//           );
//           const csvContent = [csvHeaders, ...csvRows].join("\n");
//           const blob = new Blob([csvContent], {
//             type: "text/csv;charset=utf-8;",
//           });
//           const url = window.URL.createObjectURL(blob);
//           const a = document.createElement("a");
//           a.href = url;
//           a.download = `exported_selected_timesheets_${
//             new Date().toISOString().split("T")[0]
//           }.csv`;
//           document.body.appendChild(a);
//           a.click();
//           a.remove();
//           window.URL.revokeObjectURL(url);
//           showToast(
//             `Exported ${selectedData.length} selected timesheets successfully`,
//             "success",
//           );
//         }
//       } else {
//         // Enhanced error handling
//         let errorMessage = "Export failed. Please try again.";
//         try {
//           const contentType = response.headers.get("content-type");
//           if (contentType && contentType.includes("application/json")) {
//             const errorData = await response.json();
//             if (errorData.errors) {
//               // Handle validation errors
//               const validationErrors = Object.entries(errorData.errors)
//                 .map(
//                   ([field, messages]) =>
//                     `${field}: ${
//                       Array.isArray(messages) ? messages.join(", ") : messages
//                     }`,
//                 )
//                 .join("; ");
//               errorMessage = `Validation Error: ${validationErrors}`;
//             } else if (errorData.title) {
//               errorMessage = errorData.title;
//             } else if (errorData.message) {
//               errorMessage = errorData.message;
//             }
//           } else {
//             errorMessage = (await response.text()) || errorMessage;
//           }
//         } catch (parseError) {
//           console.error("Error parsing response:", parseError);
//           errorMessage = `HTTP ${response.status}: ${response.statusText}`;
//         }
//         throw new Error(errorMessage);
//       }
//     } catch (error) {
//       console.error("Export error:", error);
//       showToast(error.message || "Export failed. Please try again.", "error");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // const handleGenerateInvoice = async (e) => {
//   //   e.preventDefault();
//   //   e.stopPropagation();
//   //   if (actionLoading) return;

//   //   if (selectedRows.size === 0) {
//   //     showToast("Please select at least one timesheet to generate", "warning");
//   //     return;
//   //   }

//   //   try {
//   //     setActionLoading(true);
//   //     const selectedData = filteredRows.filter((row) =>
//   //       selectedRows.has(row.id)
//   //     );
//   //     const payload = selectedData.map((row) => {
//   //       const originalItem = row.originalItem;
//   //       return {
//   //         ...originalItem,
//   //         CreatedBy:
//   //           originalItem.CreatedBy ||
//   //           currentUser?.username ||
//   //           currentUser?.id ||
//   //           "admin",
//   //         UpdatedBy:
//   //           originalItem.UpdatedBy ||
//   //           currentUser?.username ||
//   //           currentUser?.id ||
//   //           "admin",
//   //         CreatedAt: originalItem.CreatedAt || new Date().toISOString(),
//   //         UpdatedAt: originalItem.UpdatedAt || new Date().toISOString(),
//   //       };
//   //     });

//   //     const response = await fetch(
//   //       "${backendUrl}/api/SubkTimesheet/GenerateInvoice",
//   //       {
//   //         method: "POST",
//   //         headers: { "Content-Type": "application/json" },
//   //         body: JSON.stringify(payload),
//   //       }
//   //     );

//   //     if (!response.ok) {
//   //       throw new Error("Failed to generate invoice");
//   //     }
//   //     const invoiceResponse = await response.json();

//   //     setInvoiceData(invoiceData);
//   //     setInvoiceModalVisible(true);
//   //   } catch (err) {
//   //     showToast("Invoice generation failed: " + (err.message || ""), "error");
//   //   } finally {
//   //     setActionLoading(false);
//   //   }
//   // };

//   //   const downloadInvoices = async () => {
//   //     const invoicesToDownload = filteredInvoices.filter((invoice, index) =>
//   //       selectedInvoices.has(invoice.invoiceId || index)
//   //     );

//   //     if (invoicesToDownload.length === 0) {
//   //       alert("Please select invoices to download");
//   //       return;
//   //     }

//   //     try {
//   //       setIsDownloading(true);

//   //       for (let i = 0; i < invoicesToDownload.length; i++) {
//   //         const invoice = invoicesToDownload[i];
//   //         const invoiceId = invoice.invoiceId || invoice.invoiceNumber;

//   //         if (!invoiceId) {
//   //           console.warn(
//   //             `Skipping invoice without ID: ${JSON.stringify(invoice)}`
//   //           );
//   //           continue;
//   //         }

//   //         try {
//   //           // First fetch invoice preview data (same as preview functionality)
//   //           const previewResponse = await fetch(
//   //             `${backendUrl}/api/SubkTimesheet/PreviewInvoice?Invoice_Number=${encodeURIComponent(
//   //               invoice.invoiceNumber
//   //             )}`
//   //           );

//   //           if (!previewResponse.ok) {
//   //             throw new Error(
//   //               `Failed to fetch invoice preview: ${previewResponse.status}`
//   //             );
//   //           }

//   //           const apiData = await previewResponse.json();

//   //           // Transform data exactly like in handlePreview
//   //           const transformedData = [
//   //             {
//   //               invoiceId: apiData.invoiceId || " ",
//   //               invoiceDate: apiData.period || " ",
//   //               currency: apiData.currency || " ",
//   //               totalAmount: apiData.totalAmount || 0,

//   //               lineItems: (apiData.lineItems || []).map((item, index) => ({
//   //                 poLine: item.poLine || " ",
//   //                 plc: item.plc || " ",
//   //                 vendor: item.vendor || " ",
//   //                 employee: item.employee || " ",
//   //                 hours: item.hours || 0,
//   //                 rate: item.rate || 0,
//   //                 amount: item.amount || 0,
//   //                 line_No: item.line_No || " ",
//   //               })),

//   //               billTo: apiData.billTo || " ",
//   //               buyer: apiData.buyer || " ",
//   //               purchaseOrderId: apiData.po_Number || " ",
//   //               releaseNumber: apiData.po_rlse_Number || " ",
//   //               poStartEndDate: apiData.po_Start_End_Date || " ",
//   //               terms: apiData.terms || " ",
//   //               amountDue: apiData.totalAmount || 0,
//   //               period: apiData.period || " ",
//   //               po_Number: apiData.po_Number || " ",
//   //               po_rlse_Number: apiData.po_rlse_Number || " ",
//   //               po_Start_End_Date: apiData.po_Start_End_Date || " ",
//   //             },
//   //           ];

//   //           // Create temporary container to render InvoiceViewer component
//   //           const tempContainer = document.createElement("div");
//   //           tempContainer.style.position = "absolute";
//   //           tempContainer.style.left = "-9999px";
//   //           tempContainer.style.width = "800px";
//   //           tempContainer.style.backgroundColor = "white";
//   //           document.body.appendChild(tempContainer);

//   //           // Create temporary React root and render InvoiceViewer
//   //           const ReactDOM = (await import("react-dom/client")).default;
//   //           const React = (await import("react")).default;

//   //           // Import InvoiceViewer component
//   //           const { default: InvoiceViewer } = await import("./InvoiceViewer");

//   //           const root = ReactDOM.createRoot(tempContainer);

//   //           // Render InvoiceViewer component
//   //           await new Promise((resolve) => {
//   //             root.render(
//   //               React.createElement(InvoiceViewer, {
//   //                 data: transformedData,
//   //                 setInvoiceModalVisible: () => {},
//   //               })
//   //             );

//   //             // Wait for component to render
//   //             setTimeout(resolve, 500);
//   //           });

//   //           // Find the invoice content div (the one with ref)
//   //           const input = tempContainer.querySelector(
//   //             'div[style*="max-width: 768px"]'
//   //           );

//   //           if (!input) {
//   //             throw new Error("Invoice content not found");
//   //           }

//   //           // Use exact same PDF generation logic as handleDownloadPdf
//   //           const pdf = new jsPDF("p", "mm", "a4");
//   //           const padding = 10;
//   //           const canvas = await html2canvas(input, { scale: 2, useCORS: true });
//   //           const imgData = canvas.toDataURL("image/png");

//   //           const pdfWidth = pdf.internal.pageSize.getWidth();
//   //           const pdfHeight = pdf.internal.pageSize.getHeight();

//   //           const usableWidth = pdfWidth - 2 * padding;
//   //           const usableHeight = pdfHeight - 2 * padding;

//   //           const imgProps = pdf.getImageProperties(imgData);
//   //           const pdfImgHeight = (imgProps.height * usableWidth) / imgProps.width;

//   //           let heightLeft = pdfImgHeight;
//   //           let position = padding;

//   //           pdf.addImage(
//   //             imgData,
//   //             "PNG",
//   //             padding,
//   //             position,
//   //             usableWidth,
//   //             pdfImgHeight
//   //           );
//   //           heightLeft -= usableHeight;

//   //           while (heightLeft > 0) {
//   //             pdf.addPage();
//   //             position = padding - heightLeft;
//   //             pdf.addImage(
//   //               imgData,
//   //               "PNG",
//   //               padding,
//   //               position,
//   //               usableWidth,
//   //               pdfImgHeight
//   //             );
//   //             heightLeft -= usableHeight;
//   //           }

//   //           // Clean up
//   //           root.unmount();
//   //           document.body.removeChild(tempContainer);

//   //           // Save PDF with invoice number as filename
//   //           const filename = `${
//   //             invoice.invoiceNumber || `invoice_${invoiceId}`
//   //           }.pdf`;
//   //           pdf.save(filename);

//   //           // Add delay between downloads
//   //           if (i < invoicesToDownload.length - 1) {
//   //             await new Promise((resolve) => setTimeout(resolve, 1000));
//   //           }
//   //         } catch (invoiceError) {
//   //           console.error(
//   //             `Error downloading invoice ${invoiceId}:`,
//   //             invoiceError
//   //           );
//   //           alert(
//   //             `Failed to download invoice ${invoiceId}: ${invoiceError.message}`
//   //           );
//   //         }
//   //       }

//   //       const successMessage =
//   //         invoicesToDownload.length === 1
//   //           ? "Invoice downloaded successfully!"
//   //           : `${invoicesToDownload.length} invoices downloaded successfully!`;

//   //       alert(successMessage);
//   //     } catch (error) {
//   //       console.error("Error during download process:", error);
//   //       alert(`Download failed: ${error.message}`);
//   //     } finally {
//   //       setIsDownloading(false);
//   //     }
//   //   };

//   const groupInvoiceData = (invoiceData) => {
//     if (!invoiceData || !Array.isArray(invoiceData)) {
//       return invoiceData;
//     }

//     // Group items by plc, vendor, and employee
//     const grouped = invoiceData.reduce((acc, item) => {
//       const key = `${item.plc || "N/A"}-${item.vendor || "N/A"}-${
//         item.employee || "N/A"
//       }`;

//       if (!acc[key]) {
//         // First occurrence - create new group
//         acc[key] = {
//           ...item,
//           hours: parseFloat(item.hours) || 0,
//           amount: parseFloat(item.amount) || 0,
//           groupedItems: [item], // Keep track of original items for reference
//         };
//       } else {
//         // Duplicate found - sum the values
//         acc[key].hours += parseFloat(item.hours) || 0;
//         acc[key].amount += parseFloat(item.amount) || 0;
//         acc[key].groupedItems.push(item);
//       }

//       return acc;
//     }, {});

//     // Convert back to array format
//     return Object.values(grouped).map((group) => ({
//       ...group,
//       hours: parseFloat(group.hours.toFixed(2)), // Round to 2 decimal places
//       amount: parseFloat(group.amount.toFixed(2)), // Round to 2 decimal places
//     }));
//   };

//   // const handleGenerateInvoice = async (e) => {
//   //   e.preventDefault();
//   //   e.stopPropagation();
//   //   if (actionLoading) return;

//   //   if (selectedRows.size === 0) {
//   //     showToast("Please select at least one timesheet to export", "warning");
//   //     return;
//   //   }

//   //   try {
//   //     setActionLoading(true);

//   //     const selectedData = filteredRows.filter((row) =>
//   //       selectedRows.has(row.id)
//   //     );

//   //     if (selectedData.length === 0) {
//   //       showToast("No selected data to export", "warning");
//   //       setActionLoading(false);
//   //       return;
//   //     }

//   //     const payload = selectedData.map((row) => {
//   //       const originalItem = row.originalItem;
//   //       return {
//   //         ...originalItem,
//   //         CreatedBy:
//   //           originalItem.CreatedBy ||
//   //           currentUser?.username ||
//   //           currentUser?.id ||
//   //           "admin",
//   //         UpdatedBy:
//   //           originalItem.UpdatedBy ||
//   //           currentUser?.username ||
//   //           currentUser?.id ||
//   //           "admin",
//   //         CreatedAt: originalItem.CreatedAt || new Date().toISOString(),
//   //         UpdatedAt: originalItem.UpdatedAt || new Date().toISOString(),
//   //       };
//   //     });

//   //     const response = await fetch(
//   //       "${backendUrl}/api/SubkTimesheet/GenerateInvoice",
//   //       {
//   //         method: "POST",
//   //         headers: { "Content-Type": "application/json" },
//   //         body: JSON.stringify(payload),
//   //       }
//   //     );

//   //     if (!response.ok) {
//   //       throw new Error(`HTTP error! status: ${response.status}`);
//   //     }

//   //     const invoiceData = await response.json();

//   //     // Debug log the original invoice data received from API
//   //     console.log("Original invoice data received:", invoiceData);

//   //     // Process and group invoice data by combining same PLC+Vendor+Employee
//   //     const processInvoiceData = (data) => {
//   //       if (!data) return data;

//   //       // If data is an array of invoices
//   //       if (Array.isArray(data)) {
//   //         return data.map(invoice => processInvoiceData(invoice));
//   //       }

//   //       // If data is a single invoice object with lineItems
//   //       if (data && Array.isArray(data.lineItems)) {
//   //         // Group line items by PLC + Vendor + Employee combination
//   //         const groupedItems = {};

//   //         data.lineItems.forEach(item => {
//   //           // Create a unique key for grouping - using exact field names from API
//   //           const plcKey = item.plc || item.PLC || '';
//   //           const vendorKey = item.vendor || item.vendorName || item.vendName || '';
//   //           const employeeKey = item.employee || item.employeeName || item.resourceName || '';

//   //           const groupKey = `${plcKey}_${vendorKey}_${employeeKey}`;

//   //           if (groupedItems[groupKey]) {
//   //             // Combine with existing group - sum hours and amounts
//   //             const existingHours = parseFloat(groupedItems[groupKey].hours) || 0;
//   //             const newHours = parseFloat(item.hours) || 0;
//   //             groupedItems[groupKey].hours = existingHours + newHours;

//   //             const existingAmount = parseFloat(groupedItems[groupKey].amount) || 0;
//   //             const newAmount = parseFloat(item.amount) || 0;
//   //             groupedItems[groupKey].amount = existingAmount + newAmount;

//   //             // Keep track of combined count for reference
//   //             groupedItems[groupKey].combinedCount = (groupedItems[groupKey].combinedCount || 1) + 1;

//   //           } else {
//   //             // First occurrence of this combination
//   //             groupedItems[groupKey] = {
//   //               ...item,
//   //               hours: parseFloat(item.hours) || 0,
//   //               amount: parseFloat(item.amount) || 0,
//   //               combinedCount: 1
//   //             };
//   //           }
//   //         });

//   //         // Convert grouped items back to array with formatted values
//   //         const combinedLineItems = Object.values(groupedItems).map(item => ({
//   //           ...item,
//   //           hours: Number(item.hours.toFixed(2)),
//   //           amount: Number(item.amount.toFixed(2))
//   //         }));

//   //         // Recalculate total amounts
//   //         const newTotalAmount = combinedLineItems.reduce((sum, item) => {
//   //           return sum + (parseFloat(item.amount) || 0);
//   //         }, 0);

//   //         return {
//   //           ...data,
//   //           lineItems: combinedLineItems,
//   //           totalAmount: Number(newTotalAmount.toFixed(2)),
//   //           amountDue: Number(newTotalAmount.toFixed(2))
//   //         };
//   //       }

//   //       // Return data as-is if it doesn't have lineItems structure
//   //       return data;
//   //     };

//   //     // Process the invoice data to combine similar items
//   //     const processedInvoiceData = processInvoiceData(invoiceData);

//   //     // Debug log the processed invoice data
//   //     console.log("Processed invoice data with combined items:", processedInvoiceData);

//   //     // Set the processed data to state for InvoiceViewer
//   //     setShowInvoice(processedInvoiceData);

//   //     showToast(
//   //       `Invoice preview for ${selectedData.length} timesheets`,
//   //       "success"
//   //     );
//   //     setInvoiceModalVisible(true);
//   //   } catch (error) {
//   //     console.error("Generate Invoice error:", error);
//   //     showToast(error.message || "Invoice generation failed", "error");
//   //   } finally {
//   //     setActionLoading(false);
//   //   }
//   // };

//   const handleGenerateInvoice = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (actionLoading) return;

//     if (selectedRows.size === 0) {
//       showToast("Please select at least one timesheet to export", "warning");
//       return;
//     }

//     try {
//       setActionLoading(true);

//       const selectedData = filteredRows.filter((row) =>
//         selectedRows.has(row.id),
//       );

//       if (selectedData.length === 0) {
//         showToast("No selected data to export", "warning");
//         setActionLoading(false);
//         return;
//       }

//       const payload = selectedData.map((row) => {
//         const originalItem = row.originalItem;
//         return {
//           ...originalItem,
//           CreatedBy:
//             originalItem.CreatedBy ||
//             currentUser?.username ||
//             currentUser?.id ||
//             "admin",
//           UpdatedBy:
//             originalItem.UpdatedBy ||
//             currentUser?.username ||
//             currentUser?.id ||
//             "admin",
//           CreatedAt: originalItem.CreatedAt || new Date().toISOString(),
//           UpdatedAt: originalItem.UpdatedAt || new Date().toISOString(),
//         };
//       });

//       const response = await fetch(
//         `${backendUrl}/api/SubkTimesheet/GenerateInvoice`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const invoiceData = await response.json();

//       // Process and group invoice data for DISPLAY ONLY
//       const processInvoiceData = (data) => {
//         if (!data) return data;

//         if (Array.isArray(data)) {
//           return data.map((invoice) => processInvoiceData(invoice));
//         }

//         if (data && Array.isArray(data.lineItems)) {
//           // Store original line items before grouping for API calls later
//           const originalLineItems = [...data.lineItems];

//           const groupedItems = {};

//           data.lineItems.forEach((item) => {
//             const plcKey = item.plc || item.PLC || "";
//             const vendorKey =
//               item.vendor || item.vendorName || item.vendName || "";
//             const employeeKey =
//               item.employee || item.employeeName || item.resourceName || "";

//             const groupKey = `${plcKey}_${vendorKey}_${employeeKey}`;

//             if (groupedItems[groupKey]) {
//               // Combine with existing group - sum hours and amounts
//               const existingHours =
//                 parseFloat(groupedItems[groupKey].hours) || 0;
//               const newHours = parseFloat(item.hours) || 0;
//               groupedItems[groupKey].hours = existingHours + newHours;

//               const existingAmount =
//                 parseFloat(groupedItems[groupKey].amount) || 0;
//               const newAmount = parseFloat(item.amount) || 0;
//               groupedItems[groupKey].amount = existingAmount + newAmount;

//               // Keep track of combined count for reference
//               groupedItems[groupKey].combinedCount =
//                 (groupedItems[groupKey].combinedCount || 1) + 1;
//             } else {
//               // First occurrence of this combination
//               groupedItems[groupKey] = {
//                 ...item,
//                 hours: parseFloat(item.hours) || 0,
//                 amount: parseFloat(item.amount) || 0,
//                 combinedCount: 1,
//               };
//             }
//           });

//           // Convert grouped items back to array with formatted values
//           const combinedLineItems = Object.values(groupedItems).map((item) => ({
//             ...item,
//             hours: Number(item.hours.toFixed(2)),
//             amount: Number(item.amount.toFixed(2)),
//           }));

//           // Recalculate total amounts from grouped data
//           const newTotalAmount = combinedLineItems.reduce((sum, item) => {
//             return sum + (parseFloat(item.amount) || 0);
//           }, 0);

//           return {
//             ...data,
//             lineItems: combinedLineItems, // Grouped data for display
//             originalLineItems: originalLineItems, // Original ungrouped data for API calls
//             originalPayload: payload, // Store original payload for API calls
//             totalAmount: Number(newTotalAmount.toFixed(2)),
//             amountDue: Number(newTotalAmount.toFixed(2)),
//           };
//         }

//         return data;
//       };

//       // Process the invoice data to combine similar items for display
//       const processedInvoiceData = processInvoiceData(invoiceData);

//       console.log(
//         "Processed invoice data with combined items:",
//         processedInvoiceData,
//       );

//       setShowInvoice(processedInvoiceData);

//       showToast(
//         `Invoice preview for ${selectedData.length} timesheets`,
//         "success",
//       );
//       setInvoiceModalVisible(true);
//     } catch (error) {
//       console.error("Generate Invoice error:", error);
//       showToast(error.message || "Invoice generation failed", "error");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   //   const handleGenerateInvoice = async (e) => {
//   //     e.preventDefault();
//   //     e.stopPropagation();
//   //     if (actionLoading) return;

//   //     if (selectedRows.size === 0) {
//   //       showToast("Please select at least one timesheet to export", "warning");
//   //       return;
//   //     }

//   //     try {
//   //       setActionLoading(true);

//   //       const selectedData = filteredRows.filter((row) =>
//   //         selectedRows.has(row.id)
//   //       );

//   //       if (selectedData.length === 0) {
//   //         showToast("No selected data to export", "warning");
//   //         setActionLoading(false);
//   //         return;
//   //       }

//   //       const payload = selectedData.map((row) => {
//   //         const originalItem = row.originalItem;
//   //         return {
//   //           ...originalItem,
//   //           CreatedBy:
//   //             originalItem.CreatedBy ||
//   //             currentUser?.username ||
//   //             currentUser?.id ||
//   //             "admin",
//   //           UpdatedBy:
//   //             originalItem.UpdatedBy ||
//   //             currentUser?.username ||
//   //             currentUser?.id ||
//   //             "admin",
//   //           CreatedAt: originalItem.CreatedAt || new Date().toISOString(),
//   //           UpdatedAt: originalItem.UpdatedAt || new Date().toISOString(),
//   //         };
//   //       });

//   //       const response = await fetch(
//   //         "${backendUrl}/api/SubkTimesheet/GenerateInvoice",
//   //         {
//   //           method: "POST",
//   //           headers: { "Content-Type": "application/json" },
//   //           body: JSON.stringify(payload),
//   //         }
//   //       );

//   //       if (!response.ok) {
//   //         throw new Error(`HTTP error! status: ${response.status}`);
//   //       }

//   //       const invoiceData = await response.json();

//   //       // Group duplicate items with same plc, vendor, employee
//   // const groupedInvoiceData = groupInvoiceData(invoiceData);
//   // console.log("Grouped invoice data:", groupedInvoiceData);

//   //       // Debug log the invoice data received from API
//   //       console.log("Invoice data received:", invoiceData);

//   //       // Set to state for InvoiceViewer
//   //       setShowInvoice(invoiceData);

//   //       showToast(
//   //         `Invoice preview for ${selectedData.length} timesheets`,
//   //         "success"
//   //       );
//   //       setInvoiceModalVisible(true);
//   //     } catch (error) {
//   //       console.error("Generate Invoice error:", error);
//   //       showToast(error.message || "Invoice generation failed", "error");
//   //     } finally {
//   //       setActionLoading(false);
//   //     }
//   //   };

//   // const handleGenrateInvoice = async (e) => {
//   //   e.preventDefault();
//   //   e.stopPropagation();
//   //   if (actionLoading) return;

//   //   if (selectedRows.size === 0) {
//   //     showToast("Please select at least one timesheet to export", "warning");
//   //     return;
//   //   }

//   //   try {
//   //     setActionLoading(true);

//   //     // Get selected row data
//   //     const selectedData = filteredRows.filter((row) =>
//   //       selectedRows.has(row.id)
//   //     );

//   //     if (selectedData.length === 0) {
//   //       showToast("No selected data to export", "warning");
//   //       return;
//   //     }

//   //     // Prepare payload with selected row data - ADD CREATEDBY FIELD
//   //     const payload = selectedData.map((row) => {
//   //       const originalItem = row.originalItem;

//   //       // Ensure CreatedBy field is included
//   //       return {
//   //         ...originalItem,
//   //         CreatedBy:
//   //           originalItem.CreatedBy ||
//   //           currentUser?.username ||
//   //           currentUser?.id ||
//   //           "admin",
//   //         // Add other potentially missing required fields
//   //         UpdatedBy:
//   //           originalItem.UpdatedBy ||
//   //           currentUser?.username ||
//   //           currentUser?.id ||
//   //           "admin",
//   //         CreatedAt: originalItem.CreatedAt || new Date().toISOString(),
//   //         UpdatedAt: originalItem.UpdatedAt || new Date().toISOString(),
//   //       };
//   //     });

//   //     console.log("Export payload:", payload); // Debug log to verify CreatedBy field

//   //     // Send POST request with selected data
//   //     const response = await fetch(
//   //       "${backendUrl}/api/SubkTimesheet/GenerateInvoice",
//   //       {
//   //         method: "PUT",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify(payload), // Send the enhanced payload with CreatedBy
//   //       }
//   //     );

//   //     if (response.ok) {
//   //       const contentType = response.headers.get("content-type");
//   //       if (contentType && contentType.includes("text/csv")) {
//   //         const csvData = await response.text();
//   //         const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
//   //         const url = window.URL.createObjectURL(blob);
//   //         const a = document.createElement("a");
//   //         a.href = url;
//   //         a.download = `exported_selected_timesheets_${
//   //           new Date().toISOString().split("T")[0]
//   //         }.csv`;
//   //         document.body.appendChild(a);
//   //         a.click();
//   //         a.remove();
//   //         window.URL.revokeObjectURL(url);
//   //         showToast(
//   //           `Exported ${selectedData.length} selected timesheets successfully`,
//   //           "success"
//   //         );
//   //       } else {
//   //         // Fallback CSV generation
//   //         const csvHeaders = dynamicColumns.join(",");
//   //         const csvRows = selectedData.map((row) =>
//   //           dynamicColumns
//   //             .map((col) => {
//   //               const value = row[col] || "";
//   //               return `"${String(value).replace(/"/g, '""')}"`;
//   //             })
//   //             .join(",")
//   //         );
//   //         const csvContent = [csvHeaders, ...csvRows].join("\n");
//   //         const blob = new Blob([csvContent], {
//   //           type: "text/csv;charset=utf-8;",
//   //         });
//   //         const url = window.URL.createObjectURL(blob);
//   //         const a = document.createElement("a");
//   //         a.href = url;
//   //         a.download = `exported_selected_timesheets_${
//   //           new Date().toISOString().split("T")[0]
//   //         }.csv`;
//   //         document.body.appendChild(a);
//   //         a.click();
//   //         a.remove();
//   //         window.URL.revokeObjectURL(url);
//   //         showToast(
//   //           `Exported ${selectedData.length} selected timesheets successfully`,
//   //           "success"
//   //         );
//   //       }
//   //     } else {
//   //       // Enhanced error handling
//   //       let errorMessage = "Export failed. Please try again.";
//   //       try {
//   //         const contentType = response.headers.get("content-type");
//   //         if (contentType && contentType.includes("application/json")) {
//   //           const errorData = await response.json();
//   //           if (errorData.errors) {
//   //             // Handle validation errors
//   //             const validationErrors = Object.entries(errorData.errors)
//   //               .map(
//   //                 ([field, messages]) =>
//   //                   `${field}: ${
//   //                     Array.isArray(messages) ? messages.join(", ") : messages
//   //                   }`
//   //               )
//   //               .join("; ");
//   //             errorMessage = `Validation Error: ${validationErrors}`;
//   //           } else if (errorData.title) {
//   //             errorMessage = errorData.title;
//   //           } else if (errorData.message) {
//   //             errorMessage = errorData.message;
//   //           }
//   //         } else {
//   //           errorMessage = (await response.text()) || errorMessage;
//   //         }
//   //       } catch (parseError) {
//   //         console.error("Error parsing response:", parseError);
//   //         errorMessage = `HTTP ${response.status}: ${response.statusText}`;
//   //       }
//   //       throw new Error(errorMessage);
//   //     }
//   //   } catch (error) {
//   //     console.error("Export error:", error);
//   //     showToast(error.message || "Export failed. Please try again.", "error");
//   //   } finally {
//   //     setActionLoading(false);
//   //   }
//   // };

//   if (!userLoaded || !currentUser) {
//     return (
//       <div className="min-h-screen bg-[#f9fafd] flex flex-col pr-4">
//         <div className="flex-1 flex items-center justify-center">
//           <div className="flex items-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             <span className="ml-2">Loading user session...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // if (!isAdmin) {
//   //   return (
//   //     <div className="min-h-screen bg-[#f9fafd] flex flex-col  pr-4">
//   //       <div className="flex-1 flex items-center justify-center">
//   //         <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-8 py-6">
//   //           <div className="text-center">
//   //             <h1 className="text-2xl font-bold text-gray-800 mb-2">
//   //               Access Denied
//   //             </h1>
//   //             <p className="text-gray-600">
//   //               Export functionality is only available for Admin accounts.
//   //             </p>
//   //           </div>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   // if (loading) {
//   //   return (
//   //     <div className="min-h-screen bg-[#f9fafd] flex flex-col pl-44 pr-4">
//   //       <div className="flex-1 flex items-center justify-center">
//   //         <div className="flex items-center">
//   //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//   //           <span className="ml-2">Loading export data...</span>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   // Add this before your return statement

//   // if (loading) {
//   //   return (
//   //     <div className="min-h-screen bg-f9fafd flex items-center justify-center pr-4">
//   //       <div className="text-center">
//   //         <Download className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
//   //         <p className="text-lg text-gray-600">Loading export data...</p>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   const anyInvoiceGenerated = rows.some(
//     (row) =>
//       row["Invoice Generated"] === true ||
//       row["Invoice Generated"] === "true" ||
//       (row["Invoice Generated"] || "").toString().toLowerCase() === "true",
//   );

//   return (
//     <div className="min-h-screen bg-[#f9fafd] flex flex-col  pr-4 overflow-auto">
//       <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-8">
//         <div className="w-full flex flex-col items-center">
//           <div
//             className="w-full flex justify-between items-center mb-4"
//             style={{
//               marginLeft: 24,
//               marginRight: 24,
//               width: "calc(100vw - 220px)",
//             }}
//           >
//             {/* Left side: Download icon + Generate Invoice text */}
//             <div className="flex items-center">
//               <Download className="h-8 w-8 text-green-600 mr-3" />
//               <h1 className="text-2xl font-bold text-gray-900">
//                 Generate Invoice
//               </h1>
//             </div>

//             {/* Right side: Logout button */}
//             <button
//               onClick={handleLogout}
//               className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm font-normal shadow transition"
//             >
//               Logout
//             </button>
//           </div>

//           {/* Basic Filters */}
//           <div
//             className="flex flex-wrap gap-3 mb-3 items-center"
//             style={{
//               marginLeft: 24,
//               marginRight: 24,
//               width: "calc(100vw - 220px)",
//             }}
//           >
//             <div className="flex flex-wrap gap-2">
//               {/* Start Date Filter */}
//               <DatePicker
//                 selected={startDate ? new Date(startDate + "T00:00:00") : null}
//                 onChange={(date) => {
//                   if (date) {
//                     const localDate = new Date(
//                       date.getTime() - date.getTimezoneOffset() * 60000,
//                     );
//                     const isoString = localDate.toISOString().split("T")[0];
//                     setStartDate(isoString);
//                   } else {
//                     setStartDate("");
//                   }
//                 }}
//                 dateFormat="MM/dd/yyyy"
//                 placeholderText="Start Date"
//                 className="border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                 showPopperArrow={false}
//                 autoComplete="off"
//               />

//               {/* End Date Filter */}
//               <DatePicker
//                 selected={endDate ? new Date(endDate + "T00:00:00") : null}
//                 onChange={(date) => {
//                   if (date) {
//                     const localDate = new Date(
//                       date.getTime() - date.getTimezoneOffset() * 60000,
//                     );
//                     const isoString = localDate.toISOString().split("T")[0];
//                     setEndDate(isoString);
//                   } else {
//                     setEndDate("");
//                   }
//                 }}
//                 dateFormat="MM/dd/yyyy"
//                 placeholderText="End Date"
//                 className="border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                 showPopperArrow={false}
//                 autoComplete="off"
//               />

//               {/* Employee ID Filter */}
//               {/* <input
//                 type="text"
//                 value={searchEmployeeId}
//                 onChange={(e) => setSearchEmployeeId(e.target.value)}
//                 placeholder="Employee ID"
//                 className="border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//               /> */}

//               {/* Employee Name Filter */}
//               {/* <input
//                 type="text"
//                 value={searchEmployeeName}
//                 onChange={(e) => setSearchEmployeeName(e.target.value)}
//                 placeholder="Employee Name"
//                 className="border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//               /> */}

//               {/* PO ID Filter */}
//               <input
//                 type="text"
//                 value={searchPOID}
//                 onChange={(e) => setSearchPOID(e.target.value)}
//                 placeholder="PO Number"
//                 className="border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />

//               {/* VEND ID Filter */}
//               <input
//                 type="text"
//                 value={searchVendID}
//                 onChange={(e) => setSearchVendID(e.target.value)}
//                 placeholder="Vendor Id"
//                 className="border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />

//               {/* PO RELEASE NO Filter */}
//               {/* <input
//                 type="text"
//                 value={searchPOReleaseNo}
//                 onChange={(e) => setSearchPOReleaseNo(e.target.value)}
//                 placeholder="PO Release Number"
//                 className="border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//               /> */}

//               {/* Status Filter */}
//               <div className="flex items-center gap-3 mb-2">
//                 {/* <label className="flex items-center gap-1 text-xs">
//                   <input
//                     type="checkbox"
//                     checked={statusFilter.approved}
//                     onChange={() =>
//                       setStatusFilter((f) => ({ ...f, approved: !f.approved }))
//                     }
//                   />
//                   Approved
//                 </label> */}
//                 <label className="flex items-center gap-1 text-xs">
//                   <input
//                     type="checkbox"
//                     checked={statusFilter.invoiceGenerated}
//                     onChange={() =>
//                       setStatusFilter((f) => ({
//                         ...f,
//                         invoiceGenerated: !f.invoiceGenerated,
//                       }))
//                     }
//                   />
//                   Invoiced
//                 </label>
//                 {/* <label className="flex items-center gap-1 text-xs">
//                   <input
//                     type="checkbox"
//                     checked={statusFilter.exported}
//                     onChange={() =>
//                       setStatusFilter((f) => ({ ...f, exported: !f.exported }))
//                     }
//                   />
//                   Exported
//                 </label> */}
//               </div>
//               {/* Clear Filters Button */}
//               <button
//                 onClick={() => {
//                   setSearchDate("");
//                   setStartDate("");
//                   setEndDate("");
//                   setSearchEmployeeId("");
//                   setSearchEmployeeName("");
//                   setSearchPOID("");
//                   setSearchVendID("");
//                   setSearchPOReleaseNo("");
//                   setColumnFilters({});
//                   setStatusFilter({
//                     approved: false,
//                     invoiceGenerated: false,
//                     exported: false,
//                   });
//                 }}
//                 className="bg-gray-500 text-white px-3 py-1.5 rounded text-xs hover:bg-gray-600 transition-colors"
//               >
//                 Clear All
//               </button>
//             </div>
//           </div>

//           {/* Batch ID Input - Added after filters, separate row */}
//           {/* <div
//                 className="flex items-center gap-3 mb-3"
//                 style={{
//                   marginLeft: 24,
//                   marginRight: 24,
//                   width: "calc(100vw - 220px)",
//                 }}
//               >
//                 <div className="flex items-center gap-2">
//                   <label className="text-sm font-medium text-gray-700">
//                     Batch ID:
//                   </label>
//                   <input
//                     type="text"
//                     value={batchId}
//                     onChange={(e) => setBatchId(e.target.value)}
//                     placeholder="Enter Batch ID"
//                     className="border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
//                   />

//                 </div>
//               </div> */}

//           <div
//             className="border border-gray-300 rounded bg-white shadow"
//             style={{
//               marginLeft: 24,
//               marginRight: 24,
//               width: "calc(100vw - 220px)",
//               maxWidth: "none",
//               minWidth: 300,
//               padding: "0.5rem",
//               overflow: "hidden",
//               marginBottom: "20px",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <div
//               className="flex justify-end items-center mb-2 w-full"
//               style={{ flexShrink: 0 }}
//             >
//               <div className="flex gap-2">
//                 {/* <button
//                       onClick={handleExportClick}
//                       type="button"
//                       disabled={actionLoading || selectedRows.size === 0}
//                       className="bg-green-700 text-white px-4 py-1.5 rounded shadow-sm hover:bg-green-800 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {actionLoading
//                         ? "Processing..."
//                         : `Export Selected (${selectedRows.size})`}
//                     </button> */}
//                 {/* <button
//                       onClick={handleGenerateInvoice}
//                       type="button"
//                       disabled={actionLoading || selectedRows.size === 0}
//                       className="bg-green-700 text-white px-4 py-1.5 rounded shadow-sm hover:bg-green-800 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {actionLoading
//                         ? "Processing..."
//                         : `Generate Invoice (${selectedRows.size})`}
//                     </button>
//                     {showInvoice && <InvoiceViewer data={showInvoice} />} */}
//                 <button
//                   onClick={handleGenerateInvoice}
//                   type="button"
//                   disabled={actionLoading || selectedRows.size === 0}
//                   className="bg-green-700 text-white px-4 py-1.5 rounded shadow-sm hover:bg-green-800 transition-colors text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {actionLoading
//                     ? "Processing..."
//                     : `Preview Invoice (${selectedRows.size})`}
//                 </button>

//                 {invoiceModalVisible && (
//                   <div
//                     style={{
//                       position: "fixed",
//                       top: 0,
//                       left: 0,
//                       right: 0,
//                       bottom: 0,
//                       background: "rgba(0,0,0,0.4)",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       zIndex: 9999,
//                     }}
//                     onClick={() => setInvoiceModalVisible(false)} // close modal on background click
//                   >
//                     <div
//                       onClick={(e) => e.stopPropagation()} // prevent close on clicking inside modal
//                       style={{
//                         background: "#fff",
//                         borderRadius: "8px",
//                         maxHeight: "90vh",
//                         overflowY: "auto",
//                         width: "90vw",
//                         maxWidth: "900px",
//                         padding: "20px",
//                         position: "relative",
//                       }}
//                     >
//                       <button
//                         onClick={() => setInvoiceModalVisible(false)}
//                         style={{
//                           position: "absolute",
//                           right: 12,
//                           top: 12,
//                           fontSize: 24,
//                           background: "none",
//                           border: "none",
//                           cursor: "pointer",
//                         }}
//                         aria-label="Close"
//                       >
//                         &times;
//                       </button>
//                       <InvoiceViewer
//                         data={showInvoice}
//                         setInvoiceModalVisible={setInvoiceModalVisible}
//                         onInvoiceSuccess={handleInvoiceSuccess}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div
//               style={{
//                 overflowX: "auto",
//                 overflowY: "auto",
//                 width: "100%",
//                 maxHeight: "500px",
//                 flex: 1,
//                 border: "1px solid #e5e7eb",
//                 borderRadius: "4px",
//               }}
//             >
//               {loading ? (
//                 <div className="text-center">
//                   <Download className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
//                   <p className="text-lg text-gray-600">
//                     Loading export data...
//                   </p>
//                 </div>
//               ) : (
//                 <table
//                   style={{
//                     borderCollapse: "collapse",
//                     fontSize: "11px",
//                     minWidth: `${minTableWidth}px`,
//                     width: "max-content",
//                   }}
//                 >
//                   <thead
//                     style={{
//                       position: "sticky",
//                       top: 0,
//                       backgroundColor: "#f8fafc",
//                       zIndex: 10,
//                       borderBottom: "2px solid #e2e8f0",
//                     }}
//                   >
//                     <tr>
//                       {columns.map((col, index) => (
//                         <th
//                           key={col}
//                           style={{
//                             border: "1px solid #d1d5db",
//                             padding: "8px",
//                             fontSize: "12px",
//                             minWidth: index === 0 ? "80px" : `${colWidth}px`,
//                             fontWeight: "bold",
//                             color: "#1e40af",
//                             textAlign: "center",
//                             whiteSpace: "nowrap",
//                             backgroundColor: "#f1f5f9",
//                             cursor: col === "Select" ? "default" : "pointer",
//                             userSelect: "none",
//                           }}
//                           onClick={() => col !== "Select" && handleSort(col)}
//                         >
//                           {col === "Select" ? (
//                             <div className="flex items-center justify-center gap-1">
//                               <input
//                                 type="checkbox"
//                                 checked={selectAll}
//                                 onChange={handleSelectAll}
//                                 disabled={!hasApprovedRows}
//                                 className="cursor-pointer"
//                                 title="Select All"
//                               />
//                               <span style={{ fontSize: "11px" }}>All</span>
//                             </div>
//                           ) : (
//                             <span>
//                               {col}
//                               {getSortIcon(col)}
//                             </span>
//                           )}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {filteredRows.length > 0 ? (
//                       filteredRows.map((row, rdx) => (
//                         <tr
//                           key={`${row.id || rdx}-${
//                             row["Employee ID"] || ""
//                           }-${rdx}`}
//                           style={{
//                             backgroundColor:
//                               rdx % 2 === 0 ? "#f9fafb" : "white",
//                           }}
//                           onMouseEnter={(e) =>
//                             (e.target.closest("tr").style.backgroundColor =
//                               "#f3f4f6")
//                           }
//                           onMouseLeave={(e) =>
//                             (e.target.closest("tr").style.backgroundColor =
//                               rdx % 2 === 0 ? "#f9fafb" : "white")
//                           }
//                         >
//                           {columns.map((col, colIndex) => (
//                             <td
//                               key={col}
//                               style={{
//                                 border: "1px solid #e5e7eb",
//                                 padding: "8px",
//                                 fontSize: "11px",
//                                 minWidth:
//                                   colIndex === 0 ? "60px" : `${colWidth}px`,
//                                 whiteSpace: "nowrap",
//                                 textAlign: "center",
//                               }}
//                             >
//                               {col === "Select" ? (
//                                 <input
//                                   type="checkbox"
//                                   checked={selectedRows.has(row.id)}
//                                   onChange={() => handleRowSelect(row.id)}
//                                   className="cursor-pointer"
//                                   disabled={
//                                     (
//                                       row.Status ||
//                                       row.status ||
//                                       ""
//                                     ).toUpperCase() !== "PROCESSED" ||
//                                     (
//                                       row.Status ||
//                                       row.status ||
//                                       ""
//                                     ).toUpperCase() === "REJECTED" ||
//                                     row["Invoice Generated"] === true ||
//                                     row["Invoice Generated"] === "true"
//                                   }
//                                 />
//                               ) : col === "Status" ? (
//                                 // render status as colored badge
//                                 <span
//                                   className={statusClass(
//                                     row[col] || row.Status || row.status,
//                                   )}
//                                 >
//                                   {row[col] || row.Status || row.status || ""}
//                                 </span>
//                               ) : col === "Invoice Generated" ? (
//                                 <div
//                                   style={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                   }}
//                                 >
//                                   {row[col] === true || row[col] === "true"
//                                     ? "Y"
//                                     : "N"}
//                                 </div>
//                               ) : // row[col] || ""
//                               row[col] !== null && row[col] !== undefined ? (
//                                 String(row[col])
//                               ) : (
//                                 ""
//                               )}
//                             </td>
//                           ))}
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan={columns.length}
//                           style={{
//                             textAlign: "center",
//                             padding: "20px",
//                             fontStyle: "italic",
//                             color: "#666",
//                           }}
//                         >
//                           No approved data available for export
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import InvoiceViewer from "./Invoice";
import {
  Clock,
  MessageSquare,
  Download,
  Receipt,
  Package,
  Users,
} from "lucide-react";
import { backendUrl } from "./config";

// Add these icon components after your imports
const CrossIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="red"
    strokeWidth={2}
    width="16"
    height="16"
  >
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </svg>
);

const CheckedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="green"
    strokeWidth={2}
    width="16"
    height="16"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Toast notification utility (keep your implementation)
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

const predefinedColumns = [
  // "Status",
  "Invoice Generated",
  "Work Order",
  "Employee ID",
  "Employee Name",
  "Description",
  "PLC",
  "Pay Type",
  "Hours Date",
  "Hours",
  "Per Hour Rate",
  "Amount",
  "Vendor ID",
  "Vendor Name",
  "Project ID",
  "GLC",
  "PO Number",
  "RLSE Number",
  "PM User Id",
  "PO Line Number",
  "Rvsn Number",
  "Timesheet Date",
];

export default function ExportTable() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [searchEmployeeName, setSearchEmployeeName] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchPOID, setSearchPOID] = useState("");
  const [searchVendID, setSearchVendID] = useState("");
  const [searchPOReleaseNo, setSearchPOReleaseNo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [batchId, setBatchId] = useState("");
  const [dynamicColumns, setDynamicColumns] = useState(predefinedColumns); // Dynamic columns from API
  const [columnFilters, setColumnFilters] = useState({}); // Filters for dynamic columns
  const [invoiceModalVisible, setInvoiceModalVisible] = React.useState(false);
  const [invoiceData, setInvoiceData] = React.useState(null);

  const [showInvoice, setShowInvoice] = React.useState(false);
  const [statusFilter, setStatusFilter] = useState({
    approved: false,
    invoiceGenerated: false,
    exported: false,
  });

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "pm";

  // Generate columns dynamically: Select + dynamic columns from API
  const columns = ["Select", ...dynamicColumns];

  const colWidth = 120;
  const minTableWidth = columns.length * colWidth;

  // Format date to MM/DD/YYYY with leading zeros
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

  const toTitleCase = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // status badge base style and helper
  const baseStyle =
    "px-2.5 py-1 text-xs font-semibold rounded-full text-center inline-block";
  const statusClass = (s) => {
    const su = String(s || "").toUpperCase();
    if (su === "PROCESSED") return `${baseStyle} bg-green-100 text-green-800`;
    if (su === "INVOICED") return `${baseStyle} bg-yellow-100 text-yellow-800`;
    if (su === "EXPORTED") return `${baseStyle} bg-blue-100 text-blue-800`;
    if (su === "SUBMITTED") return `${baseStyle} bg-purple-100 text-purple-800`;
    if (su === "REJECTED") return `${baseStyle} bg-red-100 text-red-800`;
    if (su === "PENDING") return `${baseStyle} bg-yellow-100 text-yellow-800`;
    return `${baseStyle} bg-gray-100 text-gray-700`;
  };
  // const baseStyle =
  //   "px-2.5 py-1 text-xs font-semibold rounded-full text-center inline-block";

  // const statusClass = (s) => {
  //   const su = String(s || "").toUpperCase();

  //   if (su === "OPEN") return `${baseStyle} bg-yellow-400 text-yellow-900`; // Bright yellow, dark text
  //   if (su === "SUBMITTED") return `${baseStyle} bg-blue-100 text-blue-700`; // Light blue, medium blue
  //   if (su === "REJECTED") return `${baseStyle} bg-red-600 text-red-100`; // intense red background, light text
  //   if (su === "APPROVED") return `${baseStyle} bg-yellow-200 text-yellow-800`; // light beige/yellow, brownish text
  //   if (
  //     su === "INVOICED" ||
  //     su === "INV_GEN" ||
  //     su === "INVOICE GENERATED" ||
  //     su === "INVOICE_GENERATED" ||
  //     su === "INVOICEGENERATED"
  //   )
  //     return `${baseStyle} bg-pink-200 text-pink-700`; // light pink, medium pink text
  //   if (su === "EXPORTED") return `${baseStyle} bg-green-600 text-green-900`; // medium green background, dark green text
  //   if (su === "PENDING") return `${baseStyle} bg-yellow-300 text-yellow-800`; // yellow background with darker yellow text

  //   return `${baseStyle} bg-gray-100 text-gray-700`; // default gray
  // };

  const formatHours = (hours) => {
    if (!hours && hours !== 0) return "";
    const numHours = parseFloat(hours);
    if (isNaN(numHours)) return hours;
    return numHours.toFixed(2);
  };

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Calculate date for Monday (subtract days from today)
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

    // Calculate date for Sunday (add days to today)
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // Format YYYY-MM-DD strings
    const formatDate = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    setStartDate(formatDate(monday));
    setEndDate(formatDate(sunday));
  }, []); // Run once on mount

  // Convert API field names to display names
  //   const formatColumnName = (fieldName) => {
  //     // Handle specific field mappings
  //     const fieldMappings = {
  //       timesheet_Date: "Timesheet Date",
  //       resource_Id: "Employee ID",
  //       displayedName: "Name",
  //       employeeName: "Employee Name",
  //       resource_Name: "Employee Name",
  //       projId: "Project ID",
  //       projectId: "Project ID",
  //       plc: "PLC",
  //       projectLaborCategory: "Project Labor Category",
  //       payType: "Pay Type",
  //       rlseNumber: "RLSE Number",
  //       poNumber: "PO Number",
  //       poLineNumber: "PO Line Number",
  //       fiscalYear: "Fiscal Year",
  //       timesheetTypeCode: "Timesheet Type Code",
  //       sequenceNumber: "Seq No",
  //       createdAt: "Created At",
  //       updatedAt: "Updated At",
  //       batchId: "Batch ID",
  //       vend_Id: "Vendor ID",
  //       vend_Name: "Vendor Name",
  //       description: "Description",
  //       glc: "GLC",
  //       invoiceGenerated: "Invoice Generated",
  //     };

  //     if (fieldMappings[fieldName]) {
  //       return fieldMappings[fieldName];
  //     }

  //     // Convert camelCase or snake_case to Title Case
  //     return fieldName
  //       .replace(/([A-Z])/g, " $1")
  //       .replace(/[_-]/g, " ")
  //       .replace(/\b\w/g, (l) => l.toUpperCase())
  //       .trim();
  //   };

  //format date
  // Add this useEffect to set the default search date

  // Get sorted rows with arrow
  const getSortedRows = (rowsToSort) => {
    let sorted = [...rowsToSort];

    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let aVal, bVal;

        // Handle different column types
        if (
          sortConfig.key === "Timesheet Date" ||
          sortConfig.key.toLowerCase().includes("date")
        ) {
          aVal = new Date(a.originalDate || a[sortConfig.key]);
          bVal = new Date(b.originalDate || b[sortConfig.key]);
          if (isNaN(aVal.getTime())) aVal = new Date(0);
          if (isNaN(bVal.getTime())) bVal = new Date(0);
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        } else if (
          sortConfig.key === "Hours" ||
          sortConfig.key.toLowerCase().includes("hour")
        ) {
          aVal = parseFloat(a[sortConfig.key]) || 0;
          bVal = parseFloat(b[sortConfig.key]) || 0;
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        } else if (
          sortConfig.key.toLowerCase().includes("id") ||
          sortConfig.key.toLowerCase().includes("number") ||
          sortConfig.key.toLowerCase().includes("seq")
        ) {
          // Numeric sorting for ID fields
          aVal = parseInt(a[sortConfig.key]) || 0;
          bVal = parseInt(b[sortConfig.key]) || 0;
          if (aVal === bVal) {
            // If numeric values are equal, fall back to string comparison
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
              case "PROCESSED":
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
          // String sorting for all other columns
          aVal = String(a[sortConfig.key] || "").toLowerCase();
          bVal = String(b[sortConfig.key] || "").toLowerCase();
          if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        }
      });
    } else {
      // Default sorting - Sort by date if available
      sorted.sort((a, b) => {
        let aDate = new Date(a.originalDate || a["Timesheet Date"]);
        let bDate = new Date(b.originalDate || b["Timesheet Date"]);
        if (isNaN(aDate.getTime())) aDate = new Date(0);
        if (isNaN(bDate.getTime())) bDate = new Date(0);
        if (aDate.getTime() !== bDate.getTime()) {
          return bDate.getTime() - aDate.getTime();
        }

        // Secondary sort by Employee ID if available
        const aEmpId = String(
          a["Employee ID"] || a["Resource ID"] || "",
        ).toLowerCase();
        const bEmpId = String(
          b["Employee ID"] || b["Resource ID"] || "",
        ).toLowerCase();
        return aEmpId.localeCompare(bEmpId);
      });
    }

    return sorted;
  };

  const handleSort = (key) => {
    if (key === "All") return; // Skip checkbox column

    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (columnKey === "All") return null; // Skip checkbox column

    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "asc" ? " ↑" : " ↓";
    }
    return " ⇅";
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("currentUser");
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        if (!parsedUser.username) {
          parsedUser.username =
            parsedUser.fullName ||
            parsedUser.name ||
            (parsedUser.id === "john"
              ? "john.doe"
              : parsedUser.id === "jane"
                ? "jane.smith"
                : parsedUser.id) ||
            "admin";
        }
        setCurrentUser(parsedUser);
        setUserLoaded(true);
      } catch (error) {
        console.error("Error parsing user info:", error);
        setUserLoaded(true);
      }
    } else {
      setUserLoaded(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (userLoaded && currentUser) {
      fetchExportData();
    }
  }, [userLoaded, currentUser]);

  const fetchExportData = async () => {
    if (!userLoaded) return;
    try {
      setLoading(true);

      const resourceId =
        currentUser?.fullName ||
        currentUser?.name ||
        currentUser?.username ||
        "admin";

      const apiUrl = `${backendUrl}/api/SubkTimesheet/GetDetailedTimesheetsByStatus?status=PROCESSED&resourceId=${encodeURIComponent(resourceId)}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const apiData = await response.json();

      if (Array.isArray(apiData) && apiData.length > 0) {
        // Set fixed columns
        setDynamicColumns(predefinedColumns);

        // **FIXED: Map data using predefined column structure**
        const mappedData = apiData.map((item, index) => {
          const mappedRow = {
            id: item.timesheetId || item.id || `export-${index}`,
            originalDate:
              item.timesheet_Date || item.timesheetDate || item.createdAt,
            originalItem: item,
          };

          // Map only the predefined columns with specific data mapping
          mappedRow["Status"] = toTitleCase(item.status || "");
          mappedRow["Invoice Generated"] =
            item.invoiceGenerated || item.invoicegenerated || "";
          mappedRow["Work Order"] = item.wa_code || item.wa_Code || "";
          mappedRow["Employee ID"] = item.resource_Id || item.resourceId || "";
          mappedRow["Employee Name"] =
            item.resource_name || item.resource_Name || "";
          mappedRow["Description"] = item.description || "";
          mappedRow["PLC"] = item.plc || "";
          mappedRow["Pay Type"] = item.paytype || item.payType || "";
          mappedRow["Hours Date"] = formatDate(
            item.hours_date_str || item.hoursDatestr || item.hours_Date_str,
          );
          mappedRow["Hours"] = formatHours(item.hours);
          mappedRow["Per Hour Rate"] =
            item.perhrrate || item.perHrRate || item.rate || "";
          mappedRow["Amount"] = item.amt || item.amount || "";
          mappedRow["Vendor ID"] =
            item.vend_id || item.vend_Id || item.vendorId || "";
          mappedRow["Vendor Name"] =
            item.vend_name || item.vend_Name || item.vendorName || "";
          mappedRow["Project ID"] = item.projId || item.projid || "";
          mappedRow["GLC"] = item.glc || "";
          mappedRow["PO Number"] = item.ponumber || item.poNumber || "";
          mappedRow["RLSE Number"] = item.rlseNumber || item.rlsenumber || "";
          mappedRow["PM User Id"] = item.pm_User_Id || item.pm_user_id || "";
          mappedRow["PO Line Number"] =
            item.poLineNumber || item.polinenumber || "";
          // mappedRow["Rvsn Number"] =
          //   item.rvsnNumber || item.rvsnNum || item.revisionNumber || "";
          mappedRow["Rvsn Number"] = item.rvsnNumber;
          mappedRow["Timesheet Date"] = formatDate(
            item.timesheet_Date || item.timesheet_date || "",
          );

          return mappedRow;
        });

        setRows(mappedData);
      } else {
        setDynamicColumns(predefinedColumns);
        setRows([]);
      }

      setSelectedRows(new Set());
      setSelectAll(false);
    } catch (error) {
      console.error("Fetch error:", error);
      showToast(
        "Failed to load export data. Please check your connection.",
        "error",
      );
      setRows([]);
      setDynamicColumns(predefinedColumns);
    } finally {
      setLoading(false);
    }
  };

  // Updated fetch function to show default columns when no data
  // const fetchExportData = async () => {
  //   if (!userLoaded || !currentUser) return;
  //   try {
  //     setLoading(true);

  //     const resourceId = currentUser.username;

  //     if (!resourceId) {
  //       showToast('User resource ID not found. Please login again.', "error");
  //       navigate("/");
  //       return;
  //     }

  //     const apiUrl = `${backendUrl}/api/SubkTimesheet/GetDetailedTimesheetsByStatus?status=Approved&resourceId=${resourceId}`;

  //     const response = await fetch(apiUrl, {
  //       method: 'GET',
  //       headers: { 'Content-Type': 'application/json' }
  //     });

  //     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  //     const apiData = await response.json();

  //     // Define default columns to show when no data is available
  //     const defaultColumns = [
  //       'Status',
  //       'Timesheet Date',
  //       'Employee ID',
  //       'Name',
  //       'Hours',
  //       'Project ID',
  //       'PLC',
  //       'Pay Type',
  //       'PO Number',
  //       'RLSE Number',
  //       'Fiscal Year',
  //       'Batch ID'
  //     ];

  //     if (Array.isArray(apiData) && apiData.length > 0) {
  //       // Extract all unique keys from the first item to build dynamic columns
  //       const firstItem = apiData[0];
  //       const allKeys = Object.keys(firstItem);

  //       // Filter out internal fields
  //       const filteredKeys = allKeys
  //         .filter(key =>
  //           !['id', 'timesheetId', '_id', '__v', 'originalItem'].includes(key)
  //         );

  //       // Separate Status and other columns
  //       const statusKey = filteredKeys.find(key =>
  //         formatColumnName(key).toLowerCase() === 'status'
  //       );
  //       const otherKeys = filteredKeys.filter(key =>
  //         formatColumnName(key).toLowerCase() !== 'status'
  //       );

  //       // Build display columns with Status first, then others
  //       const displayColumns = [];
  //       if (statusKey) {
  //         displayColumns.push(formatColumnName(statusKey));
  //       }
  //       displayColumns.push(...otherKeys.map(key => formatColumnName(key)));

  //       setDynamicColumns(displayColumns);

  //       const mappedData = apiData.map((item, index) => {
  //         const mappedRow = {
  //           id: item.timesheetId || item.id || `export-${index}`,
  //           originalDate: item.timesheet_Date || item.timesheetDate || item.createdAt,
  //           originalItem: item,
  //         };

  //         // Map all fields from API response to display columns
  //         allKeys.forEach(key => {
  //           const displayKey = formatColumnName(key);
  //           let value = item[key];

  //           // Special formatting for different data types
  //           if (key === 'timesheet_Date' || key.toLowerCase().includes('date')) {
  //             value = formatDate(value);
  //           } else if (key === 'hours' || key.toLowerCase().includes('hour')) {
  //             value = formatHours(value);
  //           } else if (value === null || value === undefined) {
  //             value = '';
  //           } else {
  //             value = String(value);
  //           }

  //           mappedRow[displayKey] = value;
  //         });

  //         return mappedRow;
  //       });

  //       setRows(mappedData);
  //     } else {
  //       // When no data is available, show default columns instead of empty array
  //       setDynamicColumns(defaultColumns);
  //       setRows([]);
  //     }

  //     setSelectedRows(new Set());
  //     setSelectAll(false);
  //   } catch (error) {
  //     console.error('Fetch error:', error);
  //     showToast('Failed to load export data. Please check your connection.', "error");
  //     setRows([]);
  //     // Show default columns even on error
  //     setDynamicColumns([
  //       'Status',
  //       'Timesheet Date',
  //       'Employee ID',
  //       'Name',
  //       'Hours',
  //       'Project ID',
  //       'PLC',
  //       'Pay Type',
  //       'PO Number',
  //       'RLSE Number',
  //       'Fiscal Year',
  //       'Batch ID'
  //     ]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getFilteredRows = () => {
    let filtered = rows;
    if (!Array.isArray(filtered)) return [];

    // Filter by single date (existing functionality)
    if (searchDate) {
      filtered = filtered.filter((row) => {
        const rowDate = new Date(row.originalDate);
        const selectedDate = new Date(searchDate + "T00:00:00");
        return (
          rowDate.getFullYear() === selectedDate.getFullYear() &&
          rowDate.getMonth() === selectedDate.getMonth() &&
          rowDate.getDate() === selectedDate.getDate()
        );
      });
    }

    // const statusCodes = [];
    // if (statusFilter.approved) statusCodes.push("APPROVED");
    // // if (statusFilter.invoiceGenerated) statusCodes.push("INVOICED");
    // // if (statusFilter.exported) statusCodes.push("EXPORTED");

    // if (statusCodes.length > 0) {
    //   filtered = filtered.filter((row) =>
    //     statusCodes.includes((row.Status || row.status || "").toUpperCase())
    //   );
    // }

    // Updated status filter logic
    if (statusFilter.approved) {
      filtered = filtered.filter((row) => {
        const isApproved =
          (row.Status || row.status)?.toUpperCase() === "PROCESSED";
        const invoiceNotGenerated = !(
          row.originalItem?.invoiceGenerated === true ||
          row["Invoice Generated"] === "Y" ||
          row["Invoice Generated"] === true ||
          row.invoiceGenerated === true
        );
        return isApproved && invoiceNotGenerated;
      });
    }

    // Invoice Generated Filter - Separate from status filter
    if (statusFilter.invoiceGenerated) {
      filtered = filtered.filter((row) => {
        // Check if the row has invoiceGenerated field set to true
        return (
          row.originalItem?.invoiceGenerated === true ||
          row["Invoice Generated"] === true ||
          row.invoiceGenerated === true
        );
      });
    }

    // Filter by date range (Start date and End date)
    if (startDate || endDate) {
      filtered = filtered.filter((row) => {
        const rowDate = new Date(row["Hours Date"]);
        let inRange = true;

        if (startDate) {
          const start = new Date(startDate + "T00:00:00");
          inRange = inRange && rowDate >= start;
        }

        if (endDate) {
          const end = new Date(endDate + "T23:59:59");
          inRange = inRange && rowDate <= end;
        }

        return inRange;
      });
    }

    // Employee ID filter
    if (searchEmployeeId.trim()) {
      filtered = filtered.filter((row) =>
        (row["Employee ID"] || row["Resource ID"] || "")
          .toLowerCase()
          .includes(searchEmployeeId.trim().toLowerCase()),
      );
    }

    // Employee Name filter
    if (searchEmployeeName.trim()) {
      filtered = filtered.filter((row) =>
        (row["Name"] || row["Employee Name"] || row["Resource Name"] || "")
          .toLowerCase()
          .includes(searchEmployeeName.trim().toLowerCase()),
      );
    }

    // PO ID filter
    if (searchPOID.trim()) {
      filtered = filtered.filter((row) =>
        (row["PO Number"] || "")
          .toLowerCase()
          .includes(searchPOID.trim().toLowerCase()),
      );
    }

    // VEND ID filter
    if (searchVendID.trim()) {
      filtered = filtered.filter((row) =>
        (row["Vendor ID"] || "")
          .toLowerCase()
          .includes(searchVendID.trim().toLowerCase()),
      );
    }

    // PO RELEASE NO filter
    if (searchPOReleaseNo.trim()) {
      filtered = filtered.filter((row) =>
        (row["RLSE Number"] || "")
          .toLowerCase()
          .includes(searchPOReleaseNo.trim().toLowerCase()),
      );
    }

    // Apply dynamic column filters
    Object.keys(columnFilters).forEach((columnName) => {
      const filterValue = columnFilters[columnName];
      if (filterValue && filterValue.trim()) {
        filtered = filtered.filter((row) =>
          (row[columnName] || "")
            .toLowerCase()
            .includes(filterValue.trim().toLowerCase()),
        );
      }
    });

    return getSortedRows(filtered);
  };

  const filteredRows = getFilteredRows();

  // Handle individual row selection
  const handleRowSelect = (rowId) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(rowId)) {
      newSelectedRows.delete(rowId);
    } else {
      newSelectedRows.add(rowId);
    }
    setSelectedRows(newSelectedRows);
    setSelectAll(
      newSelectedRows.size === filteredRows.length && filteredRows.length > 0,
    );
  };

  //Handle select all
  // const handleSelectAll = () => {
  //   if (selectAll) {
  //     setSelectedRows(new Set());
  //     setSelectAll(false);
  //   } else {
  //     const allRowIds = new Set(filteredRows.map((row) => row.id));
  //     setSelectedRows(allRowIds);
  //     setSelectAll(true);
  //   }
  // };

  // Determine if any approved rows exist
  // const hasApprovedRows = filteredRows.some(
  //   (row) => (row.Status || row.status || "").toUpperCase() === "APPROVED"
  // );
  // const handleSelectAll = () => {
  //   if (selectAll) {
  //     setSelectedRows(new Set());
  //     setSelectAll(false);
  //   } else {
  //     const approvedRowIds = filteredRows
  //       .filter(
  //         (row) => (row.Status || row.status || "").toUpperCase() === "APPROVED"
  //       )
  //       .map((row) => row.id);

  //     setSelectedRows(new Set(approvedRowIds));
  //     setSelectAll(true);
  //   }
  // };

  // useEffect(() => {
  //   const approvedRows = filteredRows.filter(
  //     (row) => (row.Status || row.status || "").toUpperCase() === "APPROVED"
  //   );
  //   if (approvedRows.length > 0) {
  //     const allSelected = approvedRows.every((row) => selectedRows.has(row.id));
  //     setSelectAll(allSelected);
  //   } else {
  //     setSelectAll(false);
  //   }
  // }, [filteredRows, selectedRows]);

  // Check for rows that are approved AND have invoiceGenerated as false (N)

  const hasApprovedRows = filteredRows.some(
    (row) =>
      (row.Status || row.status || "").toUpperCase() === "PROCESSED" &&
      !(
        row.originalItem?.invoiceGenerated === true ||
        row["Invoice Generated"] === "Y" ||
        row["Invoice Generated"] === true ||
        row.invoiceGenerated === true
      ),
  );

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      const approvedRowIds = filteredRows
        .filter(
          (row) =>
            (row.Status || row.status || "").toUpperCase() === "PROCESSED" &&
            !(
              row.originalItem?.invoiceGenerated === true ||
              row["Invoice Generated"] === "Y" ||
              row["Invoice Generated"] === true ||
              row.invoiceGenerated === true
            ),
        )
        .map((row) => row.id);

      setSelectedRows(new Set(approvedRowIds));
      setSelectAll(true);
    }
  };

  useEffect(() => {
    const approvedRows = filteredRows.filter(
      (row) =>
        (row.Status || row.status || "").toUpperCase() === "PROCESSED" &&
        !(
          row.originalItem?.invoiceGenerated === true ||
          row["Invoice Generated"] === "Y" ||
          row["Invoice Generated"] === true ||
          row.invoiceGenerated === true
        ),
    );

    if (approvedRows.length > 0) {
      const allSelected = approvedRows.every((row) => selectedRows.has(row.id));
      setSelectAll(allSelected);
    } else {
      setSelectAll(false);
    }
  }, [filteredRows, selectedRows]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setUserLoaded(false);
    showToast("Logged out successfully", "info");
    navigate("/");
  };

  // Export selected rows with POST request containing selected data (unchanged)
  // const handleExportClick = async (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (actionLoading) return;

  //   if (selectedRows.size === 0) {
  //     showToast('Please select at least one timesheet to export', 'warning');
  //     return;
  //   }

  //   try {
  //     setActionLoading(true);

  //     // Get selected row data
  //     const selectedData = filteredRows.filter(row => selectedRows.has(row.id));

  //     if (selectedData.length === 0) {
  //       showToast('No selected data to export', 'warning');
  //       return;
  //     }

  //     // Prepare payload with selected row data
  //     const payload = {
  //       selectedTimesheets: selectedData.map(row => row.originalItem), // Send original API data
  //       exportRequest: {
  //         requestedBy: currentUser?.username || currentUser?.id || 'admin',
  //         requestDate: new Date().toISOString(),
  //         totalRecords: selectedData.length,
  //         batchId: batchId || null,
  //         filters: {
  //           date: searchDate || null,
  //           startDate: startDate || null,
  //           endDate: endDate || null,
  //           employeeId: searchEmployeeId || null,
  //           employeeName: searchEmployeeName || null,
  //         }
  //       }
  //     };

  //     // Send POST request with selected data (keep original export API)
  //     const response = await fetch('${backendUrl}/api/SubkTimesheet/export-csv', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(payload.selectedTimesheets)
  //     });

  //     if (response.ok) {
  //       const contentType = response.headers.get('content-type');
  //       if (contentType && contentType.includes('text/csv')) {
  //         const csvData = await response.text();
  //         const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  //         const url = window.URL.createObjectURL(blob);
  //         const a = document.createElement('a');
  //         a.href = url;
  //         a.download = `exported_selected_timesheets_${new Date().toISOString().split('T')[0]}.csv`;
  //         document.body.appendChild(a);
  //         a.click();
  //         a.remove();
  //         window.URL.revokeObjectURL(url);
  //         showToast(`Exported ${selectedData.length} selected timesheets successfully`, 'success');
  //       } else {
  //         const csvHeaders = dynamicColumns.join(',');
  //         const csvRows = selectedData.map(row =>
  //           dynamicColumns.map(col => {
  //             const value = row[col] || '';
  //             return `"${String(value).replace(/"/g, '""')}"`;
  //           }).join(',')
  //         );
  //         const csvContent = [csvHeaders, ...csvRows].join('\n');
  //         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  //         const url = window.URL.createObjectURL(blob);
  //         const a = document.createElement('a');
  //         a.href = url;
  //         a.download = `exported_selected_timesheets_${new Date().toISOString().split('T')[0]}.csv`;
  //         document.body.appendChild(a);
  //         a.click();
  //         a.remove();
  //         window.URL.revokeObjectURL(url);
  //         showToast(`Exported ${selectedData.length} selected timesheets successfully`, 'success');
  //       }
  //     } else {
  //       throw new Error(`Export API failed with status: ${response.status}`);
  //     }
  //   } catch (error) {
  //     console.error('Export error:', error);
  //     showToast('Export failed. Please try again.', 'error');
  //   } finally {
  //     setActionLoading(false);
  //   }
  // };

  // Add this function to ExportTable.jsx

  const handleInvoiceSuccess = async (invoiceData) => {
    try {
      // Update local state immediately for better UX
      const updatedRows = rows.map((row) => {
        // Check if this row was part of the invoice
        const wasInvoiced = invoiceData.lineItems?.some(
          (lineItem) =>
            lineItem.timesheetId === row.originalItem?.timesheetId ||
            lineItem.employee === row["Employee ID"] ||
            lineItem.line_No === row["Seq No"],
        );

        if (wasInvoiced) {
          return {
            ...row,
            "Invoice Generated": "Y",
            originalItem: {
              ...row.originalItem,
              invoiceGenerated: true,
            },
          };
        }
        return row;
      });

      setRows(updatedRows);

      // Refresh from server to ensure consistency
      setTimeout(() => {
        fetchExportData();
      }, 1000);
    } catch (error) {
      console.error("Error updating data after invoice:", error);
      showToast("Invoice created but failed to refresh data", "warning");
    }
  };

  // Export selected rows with POST request containing selected data
  const handleExportClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (actionLoading) return;

    if (selectedRows.size === 0) {
      showToast("Please select at least one timesheet to export", "warning");
      return;
    }

    try {
      setActionLoading(true);

      // Get selected row data
      const selectedData = filteredRows.filter((row) =>
        selectedRows.has(row.id),
      );

      if (selectedData.length === 0) {
        showToast("No selected data to export", "warning");
        return;
      }

      // Prepare payload with selected row data - ADD CREATEDBY FIELD
      const payload = selectedData.map((row) => {
        const originalItem = row.originalItem;

        // Ensure CreatedBy field is included
        return {
          ...originalItem,
          CreatedBy:
            originalItem.CreatedBy ||
            currentUser?.username ||
            currentUser?.id ||
            "admin",
          // Add other potentially missing required fields
          UpdatedBy:
            originalItem.UpdatedBy ||
            currentUser?.username ||
            currentUser?.id ||
            "admin",
          CreatedAt: originalItem.CreatedAt || new Date().toISOString(),
          UpdatedAt: originalItem.UpdatedAt || new Date().toISOString(),
        };
      });

      console.log("Export payload:", payload); // Debug log to verify CreatedBy field

      // Send POST request with selected data
      const response = await fetch(
        `${backendUrl}/api/SubkTimesheet/export-csv`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload), // Send the enhanced payload with CreatedBy
        },
      );

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/csv")) {
          const csvData = await response.text();
          const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `exported_selected_timesheets_${
            new Date().toISOString().split("T")[0]
          }.csv`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
          showToast(
            `Exported ${selectedData.length} selected timesheets successfully`,
            "success",
          );
        } else {
          // Fallback CSV generation
          const csvHeaders = dynamicColumns.join(",");
          const csvRows = selectedData.map((row) =>
            dynamicColumns
              .map((col) => {
                const value = row[col] || "";
                return `"${String(value).replace(/"/g, '""')}"`;
              })
              .join(","),
          );
          const csvContent = [csvHeaders, ...csvRows].join("\n");
          const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `exported_selected_timesheets_${
            new Date().toISOString().split("T")[0]
          }.csv`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
          showToast(
            `Exported ${selectedData.length} selected timesheets successfully`,
            "success",
          );
        }
      } else {
        // Enhanced error handling
        let errorMessage = "Export failed. Please try again.";
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            if (errorData.errors) {
              // Handle validation errors
              const validationErrors = Object.entries(errorData.errors)
                .map(
                  ([field, messages]) =>
                    `${field}: ${
                      Array.isArray(messages) ? messages.join(", ") : messages
                    }`,
                )
                .join("; ");
              errorMessage = `Validation Error: ${validationErrors}`;
            } else if (errorData.title) {
              errorMessage = errorData.title;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            }
          } else {
            errorMessage = (await response.text()) || errorMessage;
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Export error:", error);
      showToast(error.message || "Export failed. Please try again.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // const handleGenerateInvoice = async (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (actionLoading) return;

  //   if (selectedRows.size === 0) {
  //     showToast("Please select at least one timesheet to generate", "warning");
  //     return;
  //   }

  //   try {
  //     setActionLoading(true);
  //     const selectedData = filteredRows.filter((row) =>
  //       selectedRows.has(row.id)
  //     );
  //     const payload = selectedData.map((row) => {
  //       const originalItem = row.originalItem;
  //       return {
  //         ...originalItem,
  //         CreatedBy:
  //           originalItem.CreatedBy ||
  //           currentUser?.username ||
  //           currentUser?.id ||
  //           "admin",
  //         UpdatedBy:
  //           originalItem.UpdatedBy ||
  //           currentUser?.username ||
  //           currentUser?.id ||
  //           "admin",
  //         CreatedAt: originalItem.CreatedAt || new Date().toISOString(),
  //         UpdatedAt: originalItem.UpdatedAt || new Date().toISOString(),
  //       };
  //     });

  //     const response = await fetch(
  //       "${backendUrl}/api/SubkTimesheet/GenerateInvoice",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to generate invoice");
  //     }
  //     const invoiceResponse = await response.json();

  //     setInvoiceData(invoiceData);
  //     setInvoiceModalVisible(true);
  //   } catch (err) {
  //     showToast("Invoice generation failed: " + (err.message || ""), "error");
  //   } finally {
  //     setActionLoading(false);
  //   }
  // };

  //   const downloadInvoices = async () => {
  //     const invoicesToDownload = filteredInvoices.filter((invoice, index) =>
  //       selectedInvoices.has(invoice.invoiceId || index)
  //     );

  //     if (invoicesToDownload.length === 0) {
  //       alert("Please select invoices to download");
  //       return;
  //     }

  //     try {
  //       setIsDownloading(true);

  //       for (let i = 0; i < invoicesToDownload.length; i++) {
  //         const invoice = invoicesToDownload[i];
  //         const invoiceId = invoice.invoiceId || invoice.invoiceNumber;

  //         if (!invoiceId) {
  //           console.warn(
  //             `Skipping invoice without ID: ${JSON.stringify(invoice)}`
  //           );
  //           continue;
  //         }

  //         try {
  //           // First fetch invoice preview data (same as preview functionality)
  //           const previewResponse = await fetch(
  //             `${backendUrl}/api/SubkTimesheet/PreviewInvoice?Invoice_Number=${encodeURIComponent(
  //               invoice.invoiceNumber
  //             )}`
  //           );

  //           if (!previewResponse.ok) {
  //             throw new Error(
  //               `Failed to fetch invoice preview: ${previewResponse.status}`
  //             );
  //           }

  //           const apiData = await previewResponse.json();

  //           // Transform data exactly like in handlePreview
  //           const transformedData = [
  //             {
  //               invoiceId: apiData.invoiceId || " ",
  //               invoiceDate: apiData.period || " ",
  //               currency: apiData.currency || " ",
  //               totalAmount: apiData.totalAmount || 0,

  //               lineItems: (apiData.lineItems || []).map((item, index) => ({
  //                 poLine: item.poLine || " ",
  //                 plc: item.plc || " ",
  //                 vendor: item.vendor || " ",
  //                 employee: item.employee || " ",
  //                 hours: item.hours || 0,
  //                 rate: item.rate || 0,
  //                 amount: item.amount || 0,
  //                 line_No: item.line_No || " ",
  //               })),

  //               billTo: apiData.billTo || " ",
  //               buyer: apiData.buyer || " ",
  //               purchaseOrderId: apiData.po_Number || " ",
  //               releaseNumber: apiData.po_rlse_Number || " ",
  //               poStartEndDate: apiData.po_Start_End_Date || " ",
  //               terms: apiData.terms || " ",
  //               amountDue: apiData.totalAmount || 0,
  //               period: apiData.period || " ",
  //               po_Number: apiData.po_Number || " ",
  //               po_rlse_Number: apiData.po_rlse_Number || " ",
  //               po_Start_End_Date: apiData.po_Start_End_Date || " ",
  //             },
  //           ];

  //           // Create temporary container to render InvoiceViewer component
  //           const tempContainer = document.createElement("div");
  //           tempContainer.style.position = "absolute";
  //           tempContainer.style.left = "-9999px";
  //           tempContainer.style.width = "800px";
  //           tempContainer.style.backgroundColor = "white";
  //           document.body.appendChild(tempContainer);

  //           // Create temporary React root and render InvoiceViewer
  //           const ReactDOM = (await import("react-dom/client")).default;
  //           const React = (await import("react")).default;

  //           // Import InvoiceViewer component
  //           const { default: InvoiceViewer } = await import("./InvoiceViewer");

  //           const root = ReactDOM.createRoot(tempContainer);

  //           // Render InvoiceViewer component
  //           await new Promise((resolve) => {
  //             root.render(
  //               React.createElement(InvoiceViewer, {
  //                 data: transformedData,
  //                 setInvoiceModalVisible: () => {},
  //               })
  //             );

  //             // Wait for component to render
  //             setTimeout(resolve, 500);
  //           });

  //           // Find the invoice content div (the one with ref)
  //           const input = tempContainer.querySelector(
  //             'div[style*="max-width: 768px"]'
  //           );

  //           if (!input) {
  //             throw new Error("Invoice content not found");
  //           }

  //           // Use exact same PDF generation logic as handleDownloadPdf
  //           const pdf = new jsPDF("p", "mm", "a4");
  //           const padding = 10;
  //           const canvas = await html2canvas(input, { scale: 2, useCORS: true });
  //           const imgData = canvas.toDataURL("image/png");

  //           const pdfWidth = pdf.internal.pageSize.getWidth();
  //           const pdfHeight = pdf.internal.pageSize.getHeight();

  //           const usableWidth = pdfWidth - 2 * padding;
  //           const usableHeight = pdfHeight - 2 * padding;

  //           const imgProps = pdf.getImageProperties(imgData);
  //           const pdfImgHeight = (imgProps.height * usableWidth) / imgProps.width;

  //           let heightLeft = pdfImgHeight;
  //           let position = padding;

  //           pdf.addImage(
  //             imgData,
  //             "PNG",
  //             padding,
  //             position,
  //             usableWidth,
  //             pdfImgHeight
  //           );
  //           heightLeft -= usableHeight;

  //           while (heightLeft > 0) {
  //             pdf.addPage();
  //             position = padding - heightLeft;
  //             pdf.addImage(
  //               imgData,
  //               "PNG",
  //               padding,
  //               position,
  //               usableWidth,
  //               pdfImgHeight
  //             );
  //             heightLeft -= usableHeight;
  //           }

  //           // Clean up
  //           root.unmount();
  //           document.body.removeChild(tempContainer);

  //           // Save PDF with invoice number as filename
  //           const filename = `${
  //             invoice.invoiceNumber || `invoice_${invoiceId}`
  //           }.pdf`;
  //           pdf.save(filename);

  //           // Add delay between downloads
  //           if (i < invoicesToDownload.length - 1) {
  //             await new Promise((resolve) => setTimeout(resolve, 1000));
  //           }
  //         } catch (invoiceError) {
  //           console.error(
  //             `Error downloading invoice ${invoiceId}:`,
  //             invoiceError
  //           );
  //           alert(
  //             `Failed to download invoice ${invoiceId}: ${invoiceError.message}`
  //           );
  //         }
  //       }

  //       const successMessage =
  //         invoicesToDownload.length === 1
  //           ? "Invoice downloaded successfully!"
  //           : `${invoicesToDownload.length} invoices downloaded successfully!`;

  //       alert(successMessage);
  //     } catch (error) {
  //       console.error("Error during download process:", error);
  //       alert(`Download failed: ${error.message}`);
  //     } finally {
  //       setIsDownloading(false);
  //     }
  //   };

  const groupInvoiceData = (invoiceData) => {
    if (!invoiceData || !Array.isArray(invoiceData)) {
      return invoiceData;
    }

    // Group items by plc, vendor, and employee
    const grouped = invoiceData.reduce((acc, item) => {
      const key = `${item.plc || "N/A"}-${item.vendor || "N/A"}-${
        item.employee || "N/A"
      }`;

      if (!acc[key]) {
        // First occurrence - create new group
        acc[key] = {
          ...item,
          hours: parseFloat(item.hours) || 0,
          amount: parseFloat(item.amount) || 0,
          groupedItems: [item], // Keep track of original items for reference
        };
      } else {
        // Duplicate found - sum the values
        acc[key].hours += parseFloat(item.hours) || 0;
        acc[key].amount += parseFloat(item.amount) || 0;
        acc[key].groupedItems.push(item);
      }

      return acc;
    }, {});

    // Convert back to array format
    return Object.values(grouped).map((group) => ({
      ...group,
      hours: parseFloat(group.hours.toFixed(2)), // Round to 2 decimal places
      amount: parseFloat(group.amount.toFixed(2)), // Round to 2 decimal places
    }));
  };

  // const handleGenerateInvoice = async (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (actionLoading) return;

  //   if (selectedRows.size === 0) {
  //     showToast("Please select at least one timesheet to export", "warning");
  //     return;
  //   }

  //   try {
  //     setActionLoading(true);

  //     const selectedData = filteredRows.filter((row) =>
  //       selectedRows.has(row.id)
  //     );

  //     if (selectedData.length === 0) {
  //       showToast("No selected data to export", "warning");
  //       setActionLoading(false);
  //       return;
  //     }

  //     const payload = selectedData.map((row) => {
  //       const originalItem = row.originalItem;
  //       return {
  //         ...originalItem,
  //         CreatedBy:
  //           originalItem.CreatedBy ||
  //           currentUser?.username ||
  //           currentUser?.id ||
  //           "admin",
  //         UpdatedBy:
  //           originalItem.UpdatedBy ||
  //           currentUser?.username ||
  //           currentUser?.id ||
  //           "admin",
  //         CreatedAt: originalItem.CreatedAt || new Date().toISOString(),
  //         UpdatedAt: originalItem.UpdatedAt || new Date().toISOString(),
  //       };
  //     });

  //     const response = await fetch(
  //       "${backendUrl}/api/SubkTimesheet/GenerateInvoice",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const invoiceData = await response.json();

  //     // Debug log the original invoice data received from API
  //     console.log("Original invoice data received:", invoiceData);

  //     // Process and group invoice data by combining same PLC+Vendor+Employee
  //     const processInvoiceData = (data) => {
  //       if (!data) return data;

  //       // If data is an array of invoices
  //       if (Array.isArray(data)) {
  //         return data.map(invoice => processInvoiceData(invoice));
  //       }

  //       // If data is a single invoice object with lineItems
  //       if (data && Array.isArray(data.lineItems)) {
  //         // Group line items by PLC + Vendor + Employee combination
  //         const groupedItems = {};

  //         data.lineItems.forEach(item => {
  //           // Create a unique key for grouping - using exact field names from API
  //           const plcKey = item.plc || item.PLC || '';
  //           const vendorKey = item.vendor || item.vendorName || item.vendName || '';
  //           const employeeKey = item.employee || item.employeeName || item.resourceName || '';

  //           const groupKey = `${plcKey}_${vendorKey}_${employeeKey}`;

  //           if (groupedItems[groupKey]) {
  //             // Combine with existing group - sum hours and amounts
  //             const existingHours = parseFloat(groupedItems[groupKey].hours) || 0;
  //             const newHours = parseFloat(item.hours) || 0;
  //             groupedItems[groupKey].hours = existingHours + newHours;

  //             const existingAmount = parseFloat(groupedItems[groupKey].amount) || 0;
  //             const newAmount = parseFloat(item.amount) || 0;
  //             groupedItems[groupKey].amount = existingAmount + newAmount;

  //             // Keep track of combined count for reference
  //             groupedItems[groupKey].combinedCount = (groupedItems[groupKey].combinedCount || 1) + 1;

  //           } else {
  //             // First occurrence of this combination
  //             groupedItems[groupKey] = {
  //               ...item,
  //               hours: parseFloat(item.hours) || 0,
  //               amount: parseFloat(item.amount) || 0,
  //               combinedCount: 1
  //             };
  //           }
  //         });

  //         // Convert grouped items back to array with formatted values
  //         const combinedLineItems = Object.values(groupedItems).map(item => ({
  //           ...item,
  //           hours: Number(item.hours.toFixed(2)),
  //           amount: Number(item.amount.toFixed(2))
  //         }));

  //         // Recalculate total amounts
  //         const newTotalAmount = combinedLineItems.reduce((sum, item) => {
  //           return sum + (parseFloat(item.amount) || 0);
  //         }, 0);

  //         return {
  //           ...data,
  //           lineItems: combinedLineItems,
  //           totalAmount: Number(newTotalAmount.toFixed(2)),
  //           amountDue: Number(newTotalAmount.toFixed(2))
  //         };
  //       }

  //       // Return data as-is if it doesn't have lineItems structure
  //       return data;
  //     };

  //     // Process the invoice data to combine similar items
  //     const processedInvoiceData = processInvoiceData(invoiceData);

  //     // Debug log the processed invoice data
  //     console.log("Processed invoice data with combined items:", processedInvoiceData);

  //     // Set the processed data to state for InvoiceViewer
  //     setShowInvoice(processedInvoiceData);

  //     showToast(
  //       `Invoice preview for ${selectedData.length} timesheets`,
  //       "success"
  //     );
  //     setInvoiceModalVisible(true);
  //   } catch (error) {
  //     console.error("Generate Invoice error:", error);
  //     showToast(error.message || "Invoice generation failed", "error");
  //   } finally {
  //     setActionLoading(false);
  //   }
  // };

  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (actionLoading) return;

    if (selectedRows.size === 0) {
      showToast("Please select at least one timesheet to export", "warning");
      return;
    }

    try {
      setActionLoading(true);

      const selectedData = filteredRows.filter((row) =>
        selectedRows.has(row.id),
      );

      if (selectedData.length === 0) {
        showToast("No selected data to export", "warning");
        setActionLoading(false);
        return;
      }

      const payload = selectedData.map((row) => {
        const originalItem = row.originalItem;
        return {
          ...originalItem,
          CreatedBy:
            originalItem.CreatedBy ||
            currentUser?.username ||
            currentUser?.id ||
            "admin",
          UpdatedBy:
            originalItem.UpdatedBy ||
            currentUser?.username ||
            currentUser?.id ||
            "admin",
          CreatedAt: originalItem.CreatedAt || new Date().toISOString(),
          UpdatedAt: originalItem.UpdatedAt || new Date().toISOString(),
        };
      });

      const response = await fetch(
        `${backendUrl}/api/SubkTimesheet/GenerateInvoice`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const invoiceData = await response.json();

      // Process and group invoice data for DISPLAY ONLY
      const processInvoiceData = (data) => {
        if (!data) return data;

        if (Array.isArray(data)) {
          return data.map((invoice) => processInvoiceData(invoice));
        }

        if (data && Array.isArray(data.lineItems)) {
          // Store original line items before grouping for API calls later
          const originalLineItems = [...data.lineItems];

          const groupedItems = {};

          data.lineItems.forEach((item) => {
            const plcKey = item.plc || item.PLC || "";
            const vendorKey =
              item.vendor || item.vendorName || item.vendName || "";
            const employeeKey =
              item.employee || item.employeeName || item.resourceName || "";

            const groupKey = `${plcKey}_${vendorKey}_${employeeKey}`;

            if (groupedItems[groupKey]) {
              // Combine with existing group - sum hours and amounts
              const existingHours =
                parseFloat(groupedItems[groupKey].hours) || 0;
              const newHours = parseFloat(item.hours) || 0;
              groupedItems[groupKey].hours = existingHours + newHours;

              const existingAmount =
                parseFloat(groupedItems[groupKey].amount) || 0;
              const newAmount = parseFloat(item.amount) || 0;
              groupedItems[groupKey].amount = existingAmount + newAmount;

              // Keep track of combined count for reference
              groupedItems[groupKey].combinedCount =
                (groupedItems[groupKey].combinedCount || 1) + 1;
            } else {
              // First occurrence of this combination
              groupedItems[groupKey] = {
                ...item,
                hours: parseFloat(item.hours) || 0,
                amount: parseFloat(item.amount) || 0,
                combinedCount: 1,
              };
            }
          });

          // Convert grouped items back to array with formatted values
          const combinedLineItems = Object.values(groupedItems).map((item) => ({
            ...item,
            hours: Number(item.hours.toFixed(2)),
            amount: Number(item.amount.toFixed(2)),
          }));

          // Recalculate total amounts from grouped data
          const newTotalAmount = combinedLineItems.reduce((sum, item) => {
            return sum + (parseFloat(item.amount) || 0);
          }, 0);

          return {
            ...data,
            lineItems: combinedLineItems, // Grouped data for display
            originalLineItems: originalLineItems, // Original ungrouped data for API calls
            originalPayload: payload, // Store original payload for API calls
            totalAmount: Number(newTotalAmount.toFixed(2)),
            amountDue: Number(newTotalAmount.toFixed(2)),
          };
        }

        return data;
      };

      // Process the invoice data to combine similar items for display
      const processedInvoiceData = processInvoiceData(invoiceData);

      console.log(
        "Processed invoice data with combined items:",
        processedInvoiceData,
      );

      setShowInvoice(processedInvoiceData);

      showToast(
        `Invoice preview for ${selectedData.length} timesheets`,
        "success",
      );
      setInvoiceModalVisible(true);
    } catch (error) {
      console.error("Generate Invoice error:", error);
      showToast(error.message || "Invoice generation failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  //   const handleGenerateInvoice = async (e) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     if (actionLoading) return;

  //     if (selectedRows.size === 0) {
  //       showToast("Please select at least one timesheet to export", "warning");
  //       return;
  //     }

  //     try {
  //       setActionLoading(true);

  //       const selectedData = filteredRows.filter((row) =>
  //         selectedRows.has(row.id)
  //       );

  //       if (selectedData.length === 0) {
  //         showToast("No selected data to export", "warning");
  //         setActionLoading(false);
  //         return;
  //       }

  //       const payload = selectedData.map((row) => {
  //         const originalItem = row.originalItem;
  //         return {
  //           ...originalItem,
  //           CreatedBy:
  //             originalItem.CreatedBy ||
  //             currentUser?.username ||
  //             currentUser?.id ||
  //             "admin",
  //           UpdatedBy:
  //             originalItem.UpdatedBy ||
  //             currentUser?.username ||
  //             currentUser?.id ||
  //             "admin",
  //           CreatedAt: originalItem.CreatedAt || new Date().toISOString(),
  //           UpdatedAt: originalItem.UpdatedAt || new Date().toISOString(),
  //         };
  //       });

  //       const response = await fetch(
  //         "${backendUrl}/api/SubkTimesheet/GenerateInvoice",
  //         {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(payload),
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const invoiceData = await response.json();

  //       // Group duplicate items with same plc, vendor, employee
  // const groupedInvoiceData = groupInvoiceData(invoiceData);
  // console.log("Grouped invoice data:", groupedInvoiceData);

  //       // Debug log the invoice data received from API
  //       console.log("Invoice data received:", invoiceData);

  //       // Set to state for InvoiceViewer
  //       setShowInvoice(invoiceData);

  //       showToast(
  //         `Invoice preview for ${selectedData.length} timesheets`,
  //         "success"
  //       );
  //       setInvoiceModalVisible(true);
  //     } catch (error) {
  //       console.error("Generate Invoice error:", error);
  //       showToast(error.message || "Invoice generation failed", "error");
  //     } finally {
  //       setActionLoading(false);
  //     }
  //   };

  // const handleGenrateInvoice = async (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (actionLoading) return;

  //   if (selectedRows.size === 0) {
  //     showToast("Please select at least one timesheet to export", "warning");
  //     return;
  //   }

  //   try {
  //     setActionLoading(true);

  //     // Get selected row data
  //     const selectedData = filteredRows.filter((row) =>
  //       selectedRows.has(row.id)
  //     );

  //     if (selectedData.length === 0) {
  //       showToast("No selected data to export", "warning");
  //       return;
  //     }

  //     // Prepare payload with selected row data - ADD CREATEDBY FIELD
  //     const payload = selectedData.map((row) => {
  //       const originalItem = row.originalItem;

  //       // Ensure CreatedBy field is included
  //       return {
  //         ...originalItem,
  //         CreatedBy:
  //           originalItem.CreatedBy ||
  //           currentUser?.username ||
  //           currentUser?.id ||
  //           "admin",
  //         // Add other potentially missing required fields
  //         UpdatedBy:
  //           originalItem.UpdatedBy ||
  //           currentUser?.username ||
  //           currentUser?.id ||
  //           "admin",
  //         CreatedAt: originalItem.CreatedAt || new Date().toISOString(),
  //         UpdatedAt: originalItem.UpdatedAt || new Date().toISOString(),
  //       };
  //     });

  //     console.log("Export payload:", payload); // Debug log to verify CreatedBy field

  //     // Send POST request with selected data
  //     const response = await fetch(
  //       "${backendUrl}/api/SubkTimesheet/GenerateInvoice",
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload), // Send the enhanced payload with CreatedBy
  //       }
  //     );

  //     if (response.ok) {
  //       const contentType = response.headers.get("content-type");
  //       if (contentType && contentType.includes("text/csv")) {
  //         const csvData = await response.text();
  //         const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  //         const url = window.URL.createObjectURL(blob);
  //         const a = document.createElement("a");
  //         a.href = url;
  //         a.download = `exported_selected_timesheets_${
  //           new Date().toISOString().split("T")[0]
  //         }.csv`;
  //         document.body.appendChild(a);
  //         a.click();
  //         a.remove();
  //         window.URL.revokeObjectURL(url);
  //         showToast(
  //           `Exported ${selectedData.length} selected timesheets successfully`,
  //           "success"
  //         );
  //       } else {
  //         // Fallback CSV generation
  //         const csvHeaders = dynamicColumns.join(",");
  //         const csvRows = selectedData.map((row) =>
  //           dynamicColumns
  //             .map((col) => {
  //               const value = row[col] || "";
  //               return `"${String(value).replace(/"/g, '""')}"`;
  //             })
  //             .join(",")
  //         );
  //         const csvContent = [csvHeaders, ...csvRows].join("\n");
  //         const blob = new Blob([csvContent], {
  //           type: "text/csv;charset=utf-8;",
  //         });
  //         const url = window.URL.createObjectURL(blob);
  //         const a = document.createElement("a");
  //         a.href = url;
  //         a.download = `exported_selected_timesheets_${
  //           new Date().toISOString().split("T")[0]
  //         }.csv`;
  //         document.body.appendChild(a);
  //         a.click();
  //         a.remove();
  //         window.URL.revokeObjectURL(url);
  //         showToast(
  //           `Exported ${selectedData.length} selected timesheets successfully`,
  //           "success"
  //         );
  //       }
  //     } else {
  //       // Enhanced error handling
  //       let errorMessage = "Export failed. Please try again.";
  //       try {
  //         const contentType = response.headers.get("content-type");
  //         if (contentType && contentType.includes("application/json")) {
  //           const errorData = await response.json();
  //           if (errorData.errors) {
  //             // Handle validation errors
  //             const validationErrors = Object.entries(errorData.errors)
  //               .map(
  //                 ([field, messages]) =>
  //                   `${field}: ${
  //                     Array.isArray(messages) ? messages.join(", ") : messages
  //                   }`
  //               )
  //               .join("; ");
  //             errorMessage = `Validation Error: ${validationErrors}`;
  //           } else if (errorData.title) {
  //             errorMessage = errorData.title;
  //           } else if (errorData.message) {
  //             errorMessage = errorData.message;
  //           }
  //         } else {
  //           errorMessage = (await response.text()) || errorMessage;
  //         }
  //       } catch (parseError) {
  //         console.error("Error parsing response:", parseError);
  //         errorMessage = `HTTP ${response.status}: ${response.statusText}`;
  //       }
  //       throw new Error(errorMessage);
  //     }
  //   } catch (error) {
  //     console.error("Export error:", error);
  //     showToast(error.message || "Export failed. Please try again.", "error");
  //   } finally {
  //     setActionLoading(false);
  //   }
  // };

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

  // if (!isAdmin) {
  //   return (
  //     <div className="min-h-screen bg-[#f9fafd] flex flex-col  pr-4">
  //       <div className="flex-1 flex items-center justify-center">
  //         <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-8 py-6">
  //           <div className="text-center">
  //             <h1 className="text-2xl font-bold text-gray-800 mb-2">
  //               Access Denied
  //             </h1>
  //             <p className="text-gray-600">
  //               Export functionality is only available for Admin accounts.
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-[#f9fafd] flex flex-col pl-44 pr-4">
  //       <div className="flex-1 flex items-center justify-center">
  //         <div className="flex items-center">
  //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  //           <span className="ml-2">Loading export data...</span>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // Add this before your return statement

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-f9fafd flex items-center justify-center pr-4">
  //       <div className="text-center">
  //         <Download className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
  //         <p className="text-lg text-gray-600">Loading export data...</p>
  //       </div>
  //     </div>
  //   );
  // }

  const anyInvoiceGenerated = rows.some(
    (row) =>
      row["Invoice Generated"] === true ||
      row["Invoice Generated"] === "true" ||
      (row["Invoice Generated"] || "").toString().toLowerCase() === "true",
  );

  return (
    <div className="min-h-screen bg-[#f9fafd] flex flex-col overflow-auto font-inter pr-2">
      <div className="flex-1 flex flex-col items-center justify-start">
        <div className="w-full flex flex-col items-center">
          {/* Header Bar */}
          <div className="w-full flex justify-between items-center mb-3 px-4 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            {/* Left side: Download icon + Generate Invoice text */}
            <div className="flex items-center gap-2">
              <Download size={20} className="text-blue-600" />
              <h1 className="text-lg font-bold text-gray-800">
                Generate Invoice
              </h1>
            </div>
          </div>

          {/* Basic Filters Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-3 w-full">
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <span>FILTERS</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Start Date Filter */}
              <div className="w-36 flex-shrink-0">
                <DatePicker
                  selected={
                    startDate ? new Date(startDate + "T00:00:00") : null
                  }
                  onChange={(date) => {
                    if (date) {
                      const localDate = new Date(
                        date.getTime() - date.getTimezoneOffset() * 60000,
                      );
                      const isoString = localDate.toISOString().split("T")[0];
                      setStartDate(isoString);
                    } else {
                      setStartDate("");
                    }
                  }}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Start Date"
                  className="border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                  popperPlacement="bottom-start"
                  showPopperArrow={false}
                  autoComplete="off"
                />
              </div>

              {/* End Date Filter */}
              <div className="w-36 flex-shrink-0">
                <DatePicker
                  selected={endDate ? new Date(endDate + "T00:00:00") : null}
                  onChange={(date) => {
                    if (date) {
                      const localDate = new Date(
                        date.getTime() - date.getTimezoneOffset() * 60000,
                      );
                      const isoString = localDate.toISOString().split("T")[0];
                      setEndDate(isoString);
                    } else {
                      setEndDate("");
                    }
                  }}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="End Date"
                  className="border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                  popperPlacement="bottom-start"
                  showPopperArrow={false}
                  autoComplete="off"
                />
              </div>

              {/* PO ID Filter */}
              <input
                type="text"
                value={searchPOID}
                onChange={(e) => setSearchPOID(e.target.value)}
                placeholder="PO Number"
                className="border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-36 flex-shrink-0"
              />

              {/* VEND ID Filter */}
              <input
                type="text"
                value={searchVendID}
                onChange={(e) => setSearchVendID(e.target.value)}
                placeholder="Vendor Id"
                className="border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-36 flex-shrink-0"
              />

              {/* Status Filter */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={statusFilter.invoiceGenerated}
                    onChange={() =>
                      setStatusFilter((f) => ({
                        ...f,
                        invoiceGenerated: !f.invoiceGenerated,
                      }))
                    }
                  />
                  Invoiced
                </label>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={() => {
                  setSearchDate("");
                  setStartDate("");
                  setEndDate("");
                  setSearchEmployeeId("");
                  setSearchEmployeeName("");
                  setSearchPOID("");
                  setSearchVendID("");
                  setSearchPOReleaseNo("");
                  setColumnFilters({});
                  setStatusFilter({
                    approved: false,
                    invoiceGenerated: false,
                    exported: false,
                  });
                }}
                className="btn1 btn-blue cursor-pointer"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Table Container Card */}
          <div
            className="border border-gray-100 rounded-lg bg-white shadow-sm w-full p-3 mb-2 flex flex-col"
            style={{
              overflow: "hidden",
            }}
          >
            <div className="flex justify-end items-center mb-2.5 w-full">
              <div className="flex gap-2">
                <button
                  onClick={handleGenerateInvoice}
                  type="button"
                  disabled={actionLoading || selectedRows.size === 0}
                  className="btn1 btn-blue cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {actionLoading
                    ? "Processing..."
                    : `Preview Invoice (${selectedRows.size})`}
                </button>

                {invoiceModalVisible && (
                  <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] p-4 font-inter"
                    onClick={() => setInvoiceModalVisible(false)}
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative border border-gray-100 animate-premium-popup"
                    >
                      <button
                        onClick={() => setInvoiceModalVisible(false)}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold z-20 cursor-pointer transition-colors"
                        aria-label="Close"
                      >
                        &times;
                      </button>
                      <div className="p-6 overflow-y-auto flex-1 scrollbar-thin">
                        <InvoiceViewer
                          data={showInvoice}
                          setInvoiceModalVisible={setInvoiceModalVisible}
                          onInvoiceSuccess={handleInvoiceSuccess}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[500px] border border-gray-300 rounded-lg scrollbar-thin">
              {loading ? (
                <div className="text-center p-8 italic text-gray-500 bg-white">
                  <Download className="h-8 w-8 mx-auto mb-2 text-gray-400 animate-pulse" />
                  <p className="text-xs text-gray-500">
                    Loading export data...
                  </p>
                </div>
              ) : (
                <table className="w-full text-xs border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col}
                          className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center cursor-pointer select-none last:border-r-0"
                          onClick={() => col !== "Select" && handleSort(col)}
                        >
                          {col === "Select" ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                                disabled={!hasApprovedRows}
                                className="rounded border-gray-300 accent-blue-600 cursor-pointer"
                                title="Select All"
                              />
                              <span className="text-xs">All</span>
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
                      filteredRows.map((row, rdx) => (
                        <tr
                          key={`${row.id || rdx}-${
                            row["Employee ID"] || ""
                          }-${rdx}`}
                          className="hover:bg-[#e9f6fb] transition-colors"
                        >
                          {columns.map((col) => (
                            <td
                              key={col}
                              className="px-2 py-1.5 text-center whitespace-nowrap border-r border-b border-gray-300 text-xs text-black last:border-r-0"
                            >
                              {col === "Select" ? (
                                <input
                                  type="checkbox"
                                  checked={selectedRows.has(row.id)}
                                  onChange={() => handleRowSelect(row.id)}
                                  className="rounded border-gray-300 accent-blue-600 cursor-pointer"
                                  disabled={
                                    (
                                      row.Status ||
                                      row.status ||
                                      ""
                                    ).toUpperCase() !== "PROCESSED" ||
                                    (
                                      row.Status ||
                                      row.status ||
                                      ""
                                    ).toUpperCase() === "REJECTED" ||
                                    row["Invoice Generated"] === true ||
                                    row["Invoice Generated"] === "true"
                                  }
                                />
                              ) : col === "Status" ? (
                                <span
                                  className={statusClass(
                                    row[col] || row.Status || row.status,
                                  )}
                                >
                                  {row[col] || row.Status || row.status || ""}
                                </span>
                              ) : col === "Invoice Generated" ? (
                                <div className="flex items-center justify-center">
                                  {row[col] === true || row[col] === "true"
                                    ? "Y"
                                    : "N"}
                                </div>
                              ) : row[col] !== null &&
                                row[col] !== undefined ? (
                                String(row[col])
                              ) : (
                                ""
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-center p-8 italic text-gray-500 bg-white"
                        >
                          No approved data available for export
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
