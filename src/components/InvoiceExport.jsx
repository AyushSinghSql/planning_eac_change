// import React, { useState, useEffect } from "react";
// import { Receipt, Filter, Download, X, Eye, FileDown } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import InvoiceViewer from "./InvoiceViewer";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// // import logoImg from "../assets/revolve_color_logo.png";
// import { backendUrl } from "./config";

// const showToast = (message, type = "info") => {
//   const bgColor =
//     type === "success"
//       ? "#4ade80"
//       : type === "error"
//         ? "#ef4444"
//         : type === "warning"
//           ? "#f59e0b"
//           : "#3b82f6";
//   const toast = document.createElement("div");
//   toast.textContent = message;
//   toast.style.cssText = `
//     position: fixed; top: 20px; right: 20px; z-index: 9999;
//     background: ${bgColor}; color: white; padding: 12px 16px;
//     border-radius: 6px; font-size: 14px; max-width: 300px;
//     box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.3s ease;
//     `;
//   document.body.appendChild(toast);
//   const displayTime = 3000;
//   setTimeout(() => {
//     toast.style.opacity = "0";
//     setTimeout(() => document.body.removeChild(toast), 300);
//   }, displayTime);
// };

// export default function InvoiceExport() {
//   const navigate = useNavigate();
//   const [invoices, setInvoices] = useState([]);
//   const [filteredInvoices, setFilteredInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filterInvoiceNumber, setFilterInvoiceNumber] = useState("");
//   const [selectedInvoices, setSelectedInvoices] = useState(new Set());
//   const [selectAll, setSelectAll] = useState(false);
//   const [previewModalVisible, setPreviewModalVisible] = useState(false);
//   const [previewData, setPreviewData] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [exportCount, setExportCount] = useState(0);
//   const [userLoaded, setUserLoaded] = useState(false);

//   // Table dimensions matching ExportTable
//   const colWidth = 120;
//   const minTableWidth = 2200; // Fixed width to force horizontal scroll

//   // Get user role from localStorage (set during login)
//   useEffect(() => {
//     const getUserRole = () => {
//       try {
//         // Try to get from loginResponse first
//         const loginResponse = localStorage.getItem("loginResponse");
//         if (loginResponse) {
//           const parsedResponse = JSON.parse(loginResponse);
//           setUserRole(parsedResponse.role?.toLowerCase() || "user");
//           return;
//         }
//         // Fallback: try userData
//         const userData = localStorage.getItem("userData");
//         if (userData) {
//           const parsedUserData = JSON.parse(userData);
//           setUserRole(parsedUserData.role?.toLowerCase() || "user");
//           return;
//         }
//         // Fallback: try individual userRole
//         const storedRole = localStorage.getItem("userRole");
//         if (storedRole) {
//           setUserRole(storedRole.toLowerCase());
//           return;
//         }
//         // Default fallback - temporarily set to admin for testing
//         setUserRole("admin"); // Change this back to 'user' for production
//       } catch (error) {
//         console.error("Error parsing user data:", error);
//         setUserRole("admin"); // Change this back to 'user' for production
//       }
//     };
//     getUserRole();
//   }, []);

//   // Fetch invoices from API
//   useEffect(() => {
//     const fetchInvoices = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${backendUrl}/api/Invoices`);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         setInvoices(data);
//         setFilteredInvoices(data);
//       } catch (err) {
//         console.error("Error fetching invoices:", err);
//         setError(err.message || "Failed to fetch invoices");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInvoices();
//   }, []);

//   // Filter invoices based on invoice number filter
//   useEffect(() => {
//     let filtered = invoices;
//     // Filter by invoice number
//     if (filterInvoiceNumber) {
//       filtered = filtered.filter(
//         (invoice) =>
//           invoice.invoiceNumber &&
//           invoice.invoiceNumber
//             .toLowerCase()
//             .includes(filterInvoiceNumber.toLowerCase()),
//       );
//     }
//     setFilteredInvoices(filtered);
//     // Reset selections when filter changes
//     setSelectedInvoices(new Set());
//     setSelectAll(false);
//   }, [invoices, filterInvoiceNumber]);

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
//       const month = String(date.getMonth() + 1).padStart(2, "0");
//       const day = String(date.getDate()).padStart(2, "0");
//       const year = date.getFullYear();
//       return `${month}-${day}-${year}`;
//     } catch {
//       return dateString;
//     }
//   };

//   // Format currency helper
//   const formatCurrency = (amount, currency = "USD") => {
//     if (!amount && amount !== 0) return "N/A";
//     try {
//       return new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: currency || "USD",
//       }).format(amount);
//     } catch {
//       return `${currency || "$"} ${amount}`;
//     }
//   };

//   // Calculate selectable invoices (only those that are not exported)
//   const selectableInvoices = filteredInvoices.filter(
//     (invoice) => !invoice.isExported,
//   );

//   // Handle select all checkbox
//   const handleSelectAll = (checked) => {
//     setSelectAll(checked);
//     if (checked) {
//       // Select ALL invoices (both exported and non-exported)
//       const allIds = new Set(
//         filteredInvoices.map(
//           (invoice, index) =>
//             invoice.invoiceId ||
//             invoice.id ||
//             filteredInvoices.indexOf(invoice),
//         ),
//       );
//       setSelectedInvoices(allIds);
//       // Update export count to only count non-exported ones
//       const nonExportedCount = filteredInvoices.filter(
//         (inv) => !inv.isExported,
//       ).length;
//       setExportCount(nonExportedCount);
//     } else {
//       setSelectedInvoices(new Set());
//       setExportCount(0);
//     }
//   };

//   // Handle individual checkbox
//   // const handleSelectInvoice = (invoiceId, checked, invoice) => {
//   //   // Prevent selection if invoice is exported
//   //   if (invoice && invoice.isExported) return;
//   //   setSelectedInvoices((prev) => {
//   //     const newSelected = new Set(prev);
//   //     if (checked) {
//   //       newSelected.add(invoiceId);
//   //     } else {
//   //       newSelected.delete(invoiceId);
//   //     }
//   //     // Update select all state - check if all selectable invoices are selected
//   //     const allSelectableSelected =
//   //       selectableInvoices.length > 0 &&
//   //       selectableInvoices.every((inv) => {
//   //         const id = inv.invoiceId || filteredInvoices.indexOf(inv);
//   //         return newSelected.has(id);
//   //       });
//   //     setSelectAll(allSelectableSelected);
//   //     return newSelected;
//   //   });
//   // };

//   // Handle individual checkbox - allow selection of all invoices
//   // but only count non-exported ones for the export button
//   const handleSelectInvoice = (invoiceId, checked, invoice) => {
//     setSelectedInvoices((prev) => {
//       const newSelected = new Set(prev);

//       if (checked) newSelected.add(invoiceId);
//       else newSelected.delete(invoiceId);

//       // Export count: only count non-exported invoices in the selection
//       const nonExportedCount = Array.from(newSelected).filter((id) => {
//         const inv = filteredInvoices.find((x) => (x.invoiceId || x.id) === id);
//         return inv && !inv.isExported;
//       }).length;

//       setExportCount(nonExportedCount);

//       // Check if all selectable (non-exported) invoices are selected
//       const allSelectableSelected =
//         selectableInvoices.length > 0 &&
//         selectableInvoices.every((inv) => {
//           const id = inv.invoiceId || inv.id || filteredInvoices.indexOf(inv);
//           return newSelected.has(id);
//         });
//       setSelectAll(allSelectableSelected);

//       return newSelected;
//     });
//   };

//   // Handle unexport (reopen) invoice - only for admin
//   const handleUnexport = async (invoice) => {
//     if (userRole !== "admin") {
//       alert("Access denied. Admin privileges required.");
//       return;
//     }
//     const confirmed = window.confirm(
//       `Are you sure you want to reopen invoice ${invoice.invoiceNumber}?`,
//     );
//     if (!confirmed) return;

//     try {
//       // Show loading state
//       const openButton = document.querySelector(
//         `[data-open-invoice="${invoice.invoiceId || invoice.id}"]`,
//       );
//       if (openButton) {
//         openButton.disabled = true;
//         openButton.textContent = "Opening...";
//       }

//       // Prepare the request body with the current invoice data
//       const requestBody = {
//         invoiceId: invoice.invoiceId || invoice.id || 0,
//         invoiceNumber: invoice.invoiceNumber || "string",
//         po_Number: invoice.po_Number || invoice.poNumber || "string",
//         invoiceDate: invoice.invoiceDate || new Date().toISOString(),
//         invoiceAmount: invoice.invoiceAmount || 0,
//         currency: invoice.currency || "USD",
//         createdAt: invoice.createdAt || new Date().toISOString(),
//         createdBy: invoice.createdBy || "string",
//         updatedAt: new Date().toISOString(),
//         updatedBy: "admin", // or get from current user context
//         billTo: invoice.billTo || "string",
//         remitTo: invoice.remitTo || "string",
//         isExported: false, // This is the key change - setting to false to reopen
//         invoiceTimesheetLines: invoice.invoiceTimesheetLines || [],
//       };

//       // API call to update the invoice using the correct endpoint
//       const response = await fetch(
//         `${backendUrl}/api/Invoices/${invoice.invoiceId || invoice.id}`,
//         {
//           method: "PUT", // Using PUT as per the API structure
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             ...invoice,
//             isExported: true,
//             updatedAt: new Date().toISOString(),
//             updatedBy: "admin",
//           }),
//         },
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `HTTP ${response.status}: ${errorText || response.statusText}`,
//         );
//       }

//       // Update the local state
//       setInvoices((prev) =>
//         prev.map((inv) =>
//           (inv.invoiceId || inv.id) === (invoice.invoiceId || invoice.id)
//             ? { ...inv, isExported: false }
//             : inv,
//         ),
//       );
//       setFilteredInvoices((prev) =>
//         prev.map((inv) =>
//           (inv.invoiceId || inv.id) === (invoice.invoiceId || invoice.id)
//             ? { ...inv, isExported: false }
//             : inv,
//         ),
//       );

//       alert(`Invoice ${invoice.invoiceNumber} has been reopened successfully!`);
//     } catch (error) {
//       console.error("Error reopening invoice:", error);
//       alert(`Failed to reopen invoice: ${error.message}`);
//     } finally {
//       // Reset button state
//       const openButton = document.querySelector(
//         `[data-open-invoice="${invoice.invoiceId || invoice.id}"]`,
//       );
//       if (openButton) {
//         openButton.disabled = false;
//         openButton.textContent = "OPEN";
//       }
//     }
//   };

//   const handlePreview = async (invoice) => {
//     try {
//       setPreviewModalVisible(true);
//       setPreviewData(null);

//       const response = await fetch(
//         `${backendUrl}/api/SubkTimesheet/PreviewInvoice?Invoice_Number=${encodeURIComponent(
//           invoice.invoiceNumber,
//         )}`,
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch invoice preview: ${response.status}`);
//       }

//       const apiData = await response.json();

//       // Function to group and combine line items with same PLC, Vendor, and Employee
//       const groupAndCombineLineItems = (lineItems) => {
//         if (!lineItems || !Array.isArray(lineItems)) {
//           return [];
//         }

//         const groupedItems = {};

//         lineItems.forEach((item, index) => {
//           // Create a unique key for grouping based on PLC, Vendor, and Employee
//           const plcKey = item.plc || "";
//           const vendorKey = item.vendor || "";
//           const employeeKey = item.employee || "";

//           const groupKey = `${plcKey}_${vendorKey}_${employeeKey}`;

//           if (groupedItems[groupKey]) {
//             // Combine with existing group - sum hours and amounts
//             const existingHours = parseFloat(groupedItems[groupKey].hours) || 0;
//             const newHours = parseFloat(item.hours) || 0;
//             groupedItems[groupKey].hours = existingHours + newHours;

//             const existingAmount =
//               parseFloat(groupedItems[groupKey].amount) || 0;
//             const newAmount = parseFloat(item.amount) || 0;
//             groupedItems[groupKey].amount = existingAmount + newAmount;

//             // Keep track of combined count for reference
//             groupedItems[groupKey].combinedCount =
//               (groupedItems[groupKey].combinedCount || 1) + 1;
//           } else {
//             // First occurrence of this combination
//             groupedItems[groupKey] = {
//               poLine: item.poLine || " ",
//               plc: item.plc || " ",
//               vendor: item.vendor || " ",
//               employee: item.employee || " ",
//               hours: parseFloat(item.hours) || 0,
//               rate: item.rate || 0,
//               amount: parseFloat(item.amount) || 0,
//               line_No: item.line_No || " ",
//               combinedCount: 1,
//             };
//           }
//         });

//         // Convert grouped items back to array with formatted values
//         return Object.values(groupedItems).map((item) => ({
//           poLine: item.poLine,
//           plc: item.plc,
//           vendor: item.vendor,
//           employee: item.employee,
//           hours: Number(item.hours.toFixed(2)),
//           rate: item.rate,
//           amount: Number(item.amount.toFixed(2)),
//           line_No: item.line_No,
//         }));
//       };

//       // Group and combine line items
//       const combinedLineItems = groupAndCombineLineItems(
//         apiData.lineItems || [],
//       );

//       // Recalculate total amount based on combined line items
//       const newTotalAmount = combinedLineItems.reduce((sum, item) => {
//         return sum + (parseFloat(item.amount) || 0);
//       }, 0);

//       const transformedData = [
//         {
//           invoiceId: apiData.invoiceId || " ",
//           venderName: apiData.venderName,
//           invoiceDate: formatDate(apiData.invoiceDate) || " ",
//           period: apiData.period || " ",
//           currency: apiData.currency || " ",
//           totalAmount: Number(newTotalAmount.toFixed(2)),

//           lineItems: combinedLineItems,

//           billTo: apiData.billTo || " ",
//           buyer: apiData.buyer || " ",
//           po_Number: apiData.po_Number || " ",
//           po_rlse_Number: apiData.po_rlse_Number || " ",
//           po_Start_End_Date: apiData.po_Start_End_Date || " ",
//           terms: apiData.terms || " ",
//           amountDue: Number(newTotalAmount.toFixed(2)),
//         },
//       ];

//       console.log("Original API data:", apiData);
//       console.log("Combined line items:", combinedLineItems);
//       console.log("Transformed preview data:", transformedData);

//       setPreviewData(transformedData);
//     } catch (error) {
//       console.error("Error fetching invoice preview:", error);
//       alert(`Failed to load invoice preview: ${error.message}`);
//     }
//   };

//   const downloadInvoices = async () => {
//     const invoicesToDownload = filteredInvoices.filter((invoice, index) =>
//       selectedInvoices.has(invoice.invoiceId || index),
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
//             `Skipping invoice without ID: ${JSON.stringify(invoice)}`,
//           );
//           continue;
//         }

//         try {
//           // First fetch invoice preview data
//           const previewResponse = await fetch(
//             `${backendUrl}/api/SubkTimesheet/PreviewInvoice?Invoice_Number=${encodeURIComponent(
//               invoice.invoiceNumber,
//             )}`,
//           );

//           if (!previewResponse.ok) {
//             throw new Error(
//               `Failed to fetch invoice preview: ${previewResponse.status}`,
//             );
//           }

//           const apiData = await previewResponse.json();

//           // Function to group and combine line items with same PLC, Vendor, and Employee
//           const groupAndCombineLineItems = (lineItems) => {
//             if (!lineItems || !Array.isArray(lineItems)) {
//               return [];
//             }

//             const groupedItems = {};

//             lineItems.forEach((item, index) => {
//               // Create a unique key for grouping based on PLC, Vendor, and Employee
//               const plcKey = item.plc || "";
//               const vendorKey = item.vendor || "";
//               const employeeKey = item.employee || "";

//               const groupKey = `${plcKey}_${vendorKey}_${employeeKey}`;

//               if (groupedItems[groupKey]) {
//                 // Combine with existing group - sum hours and amounts
//                 const existingHours =
//                   parseFloat(groupedItems[groupKey].hours) || 0;
//                 const newHours = parseFloat(item.hours) || 0;
//                 groupedItems[groupKey].hours = existingHours + newHours;

//                 const existingAmount =
//                   parseFloat(groupedItems[groupKey].amount) || 0;
//                 const newAmount = parseFloat(item.amount) || 0;
//                 groupedItems[groupKey].amount = existingAmount + newAmount;

//                 // Keep track of combined count for reference
//                 groupedItems[groupKey].combinedCount =
//                   (groupedItems[groupKey].combinedCount || 1) + 1;
//               } else {
//                 // First occurrence of this combination
//                 groupedItems[groupKey] = {
//                   poLine: item.poLine || " ",
//                   plc: item.plc || " ",
//                   vendor: item.vendor || " ",
//                   employee: item.employee || " ",
//                   hours: parseFloat(item.hours) || 0,
//                   rate: item.rate || 0,
//                   amount: parseFloat(item.amount) || 0,
//                   line_No: item.line_No || " ",
//                   combinedCount: 1,
//                 };
//               }
//             });

//             // Convert grouped items back to array with formatted values
//             return Object.values(groupedItems).map((item) => ({
//               poLine: item.poLine,
//               plc: item.plc,
//               vendor: item.vendor,
//               employee: item.employee,
//               hours: Number(item.hours.toFixed(2)),
//               rate: item.rate,
//               amount: Number(item.amount.toFixed(2)),
//               line_No: item.line_No,
//             }));
//           };

//           // Group and combine line items
//           const combinedLineItems = groupAndCombineLineItems(
//             apiData.lineItems || [],
//           );

//           // Recalculate total amount based on combined line items
//           const newTotalAmount = combinedLineItems.reduce((sum, item) => {
//             return sum + (parseFloat(item.amount) || 0);
//           }, 0);

//           // Transform data with combined line items
//           const transformedData = [
//             {
//               invoiceId: apiData.invoiceId || " ",
//               venderName: apiData.venderName || "",
//               invoiceDate: apiData.period || " ",
//               currency: apiData.currency || " ",
//               totalAmount: Number(newTotalAmount.toFixed(2)),

//               lineItems: combinedLineItems,

//               billTo: apiData.billTo || " ",
//               buyer: apiData.buyer || " ",
//               purchaseOrderId: apiData.po_Number || " ",
//               releaseNumber: apiData.po_rlse_Number || " ",
//               poStartEndDate: apiData.po_Start_End_Date || " ",
//               terms: apiData.terms || " ",
//               amountDue: Number(newTotalAmount.toFixed(2)),
//               period: apiData.period || " ",
//               po_Number: apiData.po_Number || " ",
//               po_rlse_Number: apiData.po_rlse_Number || " ",
//               po_Start_End_Date: apiData.po_Start_End_Date || " ",
//             },
//           ];

//           console.log("Original API data for download:", apiData);
//           console.log("Combined line items for download:", combinedLineItems);
//           console.log("Transformed download data:", transformedData);

//           const tempContainer = document.createElement("div");
//           tempContainer.style.position = "absolute";
//           tempContainer.style.left = "-9999px";
//           tempContainer.style.top = "0";
//           tempContainer.style.width = "210mm";
//           tempContainer.style.backgroundColor = "white";
//           tempContainer.style.padding = "14mm";
//           tempContainer.style.margin = "0";
//           tempContainer.style.boxSizing = "border-box";
//           tempContainer.style.fontFamily = "Arial, sans-serif";
//           tempContainer.style.fontSize = "12px";
//           tempContainer.style.lineHeight = "1.4";
//           tempContainer.style.color = "#000000";
//           document.body.appendChild(tempContainer);

//           const ReactDOM = (await import("react-dom/client")).default;
//           const React = (await import("react")).default;
//           const { default: InvoiceViewer } = await import("./InvoiceViewer");

//           const root = ReactDOM.createRoot(tempContainer);

//           await new Promise((resolve) => {
//             root.render(
//               React.createElement(InvoiceViewer, {
//                 data: transformedData,
//                 setInvoiceModalVisible: () => {},
//               }),
//             );
//             setTimeout(resolve, 3000);
//           });

//           await new Promise((resolve) => setTimeout(resolve, 1000));

//           const input =
//             tempContainer.querySelector(
//               'div[style*="max-width: 768px"], .invoice-content, .invoice-viewer',
//             ) ||
//             tempContainer.firstElementChild ||
//             tempContainer;

//           if (!input) {
//             throw new Error("Invoice content not found");
//           }

//           input.style.display = "block";
//           input.style.visibility = "visible";
//           input.style.opacity = "1";

//           // Initialize PDF with same settings as downloadInvoices

//           const pdf = new jsPDF("p", "mm", "a4");
//           const pdfWidth = pdf.internal.pageSize.getWidth();
//           const pdfHeight = pdf.internal.pageSize.getHeight();
//           const margin = 10;
//           const bottomMargin = 31.5;
//           const usableWidth = pdfWidth - 2 * margin;
//           // const usableHeight = pdfHeight - 2 * margin;
//           const usableHeight = pdfHeight - margin - bottomMargin;

//           // Capture full content first with same settings as downloadInvoices
//           const fullCanvas = await html2canvas(input, {
//             scale: 1.5,
//             useCORS: true,
//             allowTaint: true,
//             backgroundColor: "#ffffff",
//             scrollX: 0,
//             scrollY: 0,
//             width: input.scrollWidth || input.clientWidth,
//             height: input.scrollHeight || input.clientHeight,
//             windowWidth: 1200,
//             logging: false,
//           });

//           if (fullCanvas.width === 0 || fullCanvas.height === 0) {
//             throw new Error("Canvas has zero dimensions");
//           }

//           const fullImgData = fullCanvas.toDataURL("image/png", 0.98);

//           // Calculate scaling
//           const imgProps = pdf.getImageProperties(fullImgData);
//           const scale = usableWidth / imgProps.width;
//           const scaledHeight = imgProps.height * scale;

//           // Calculate pages needed
//           const pageHeight = usableHeight;

//           // Smart page breaking - detect table rows and avoid cutting them
//           let currentY = 0;
//           let pageNumber = 0;

//           // Detect table rows by looking for horizontal patterns in the content
//           const detectTableRows = () => {
//             const rows = [];
//             const tableElements = input.querySelectorAll(
//               'tr, .table-row, [class*="row"]',
//             );

//             if (tableElements.length > 0) {
//               tableElements.forEach((row) => {
//                 const rect = row.getBoundingClientRect();
//                 const inputRect = input.getBoundingClientRect();
//                 const relativeTop = rect.top - inputRect.top + input.scrollTop;
//                 const relativeBottom = relativeTop + rect.height;

//                 rows.push({
//                   top: relativeTop * scale,
//                   bottom: relativeBottom * scale,
//                   height: rect.height * scale,
//                 });
//               });
//             }

//             return rows.sort((a, b) => a.top - b.top);
//           };

//           const tableRows = detectTableRows();

//           while (currentY < scaledHeight && pageNumber < 50) {
//             // Safety limit
//             if (pageNumber > 0) {
//               pdf.addPage();
//             }

//             let nextY = currentY + usableHeight;

//             // Check if we would cut through a table row
//             if (tableRows.length > 0) {
//               for (const row of tableRows) {
//                 // If a row would be cut by the page break
//                 if (row.top < nextY && row.bottom > nextY) {
//                   // If the row can fit on current page, adjust nextY to include it
//                   if (row.bottom - currentY <= pageHeight) {
//                     nextY = row.bottom;
//                   } else {
//                     // If row is too big for current page, move it to next page
//                     nextY = row.top;
//                   }
//                   break;
//                 }
//               }
//             }

//             // Ensure we don't go beyond content
//             const actualHeight = Math.min(
//               nextY - currentY,
//               scaledHeight - currentY,
//             );

//             if (actualHeight > 0) {
//               // Create canvas for this page section
//               const pageCanvas = document.createElement("canvas");
//               const pageCtx = pageCanvas.getContext("2d");

//               const sourceY = currentY / scale;
//               const sourceHeight = actualHeight / scale;

//               pageCanvas.width = fullCanvas.width;
//               pageCanvas.height = sourceHeight;

//               // Draw the section
//               pageCtx.drawImage(
//                 fullCanvas,
//                 0,
//                 sourceY,
//                 fullCanvas.width,
//                 sourceHeight,
//                 0,
//                 0,
//                 fullCanvas.width,
//                 sourceHeight,
//               );

//               const pageImgData = pageCanvas.toDataURL("image/png", 0.98);

//               // Add to PDF
//               pdf.addImage(
//                 pageImgData,
//                 "PNG",
//                 margin,
//                 margin,
//                 usableWidth,
//                 actualHeight,
//               );
//             }

//             currentY = nextY;
//             pageNumber++;
//           }

//           // Fallback: if no pages were created, add the full image
//           if (pageNumber === 0) {
//             pdf.addImage(
//               fullImgData,
//               "PNG",
//               margin,
//               margin,
//               usableWidth,
//               Math.min(scaledHeight, pageHeight),
//             );
//           }

//           // Clean up
//           root.unmount();
//           document.body.removeChild(tempContainer);

//           // Save PDF
//           const filename = `${
//             invoice.invoiceNumber || `invoice_${invoiceId}`
//           }.pdf`;
//           pdf.save(filename);

//           if (i < invoicesToDownload.length - 1) {
//             await new Promise((resolve) => setTimeout(resolve, 2000));
//           }
//         } catch (invoiceError) {
//           console.error(
//             `Error downloading invoice ${invoiceId}:`,
//             invoiceError,
//           );
//           alert(
//             `Failed to download invoice ${invoiceId}: ${invoiceError.message}`,
//           );
//         }
//       }

//       const successMessage =
//         invoicesToDownload.length === 1
//           ? "Invoice downloaded successfully!"
//           : `${invoicesToDownload.length} invoices downloaded successfully!`;

//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       alert(successMessage);
//     } catch (error) {
//       console.error("Error during download process:", error);
//       alert(`Download failed: ${error.message}`);
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   const exportToCSV = async () => {
//     const invoicesToExport = filteredInvoices.filter((invoice, index) =>
//       selectedInvoices.has(invoice.invoiceId || index),
//     );

//     if (invoicesToExport.length === 0) {
//       alert("Please select invoices to export");
//       return;
//     }

//     try {
//       setIsExporting(true);
//       // Track successfully exported invoices for state update
//       const successfullyExportedIds = [];

//       // Collect all invoice IDs for bulk export
//       const invoiceIds = invoicesToExport
//         .map((invoice) => invoice.invoiceId || invoice.invoiceNumber)
//         .filter((id) => id) // Remove any null/undefined values
//         .map((id) => parseInt(id, 10)) // Ensure they are integers
//         .filter((id) => !isNaN(id)); // Remove any NaN values

//       if (invoiceIds.length === 0) {
//         alert("No valid invoice IDs found for export");
//         return;
//       }

//       console.log("Invoice IDs to export:", invoiceIds); // Debug log

//       try {
//         // Send the array directly as the request body (not wrapped in an object)
//         const response = await fetch(
//           `${backendUrl}/api/SubkTimesheet/export-invoices`,
//           {
//             method: "POST",
//             headers: {
//               Accept:
//                 "text/csv, application/csv, application/octet-stream, */*",
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(invoiceIds), // Send array directly, not wrapped in object
//           },
//         );

//         console.log("Request body:", JSON.stringify(invoiceIds)); // Debug log

//         if (!response.ok) {
//           let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
//           try {
//             const errorData = await response.text();
//             if (errorData) {
//               errorMessage += ` - ${errorData}`;
//             }
//           } catch (e) {
//             // Ignore if can't parse error
//           }
//           throw new Error(errorMessage);
//         }

//         const blob = await response.blob();

//         // Check if response is actually a file, not JSON error
//         if (blob.type && blob.type.includes("application/json")) {
//           const text = await blob.text();
//           console.error("Received JSON instead of file:", text);
//           throw new Error("Server returned an error instead of a file");
//         }

//         // Generate filename for bulk export
//         let filename = `bulk_invoice_export_${
//           new Date().toISOString().split("T")[0]
//         }.csv`;
//         const contentDisposition = response.headers.get("Content-Disposition");
//         if (contentDisposition) {
//           const filenameMatch = contentDisposition.match(
//             /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
//           );
//           if (filenameMatch && filenameMatch[1]) {
//             filename = filenameMatch[1].replace(/['"]/g, "");
//           }
//         }

//         // Download the file
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = filename;
//         link.style.display = "none";
//         document.body.appendChild(link);
//         link.click();

//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(link);

//         // Mark all invoices as successfully exported
//         successfullyExportedIds.push(...invoiceIds);

//         // Update invoice export status in database for each invoice
//         for (const invoice of invoicesToExport) {
//           try {
//             const updateResponse = await fetch(
//               `${backendUrl}/api/Invoices/${invoice.invoiceId}`,
//               {
//                 method: "PUT",
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                   ...invoice,
//                   isExported: true,
//                   updatedAt: new Date().toISOString(),
//                   updatedBy: "admin",
//                 }),
//               },
//             );

//             if (!updateResponse.ok) {
//               console.warn(
//                 `Failed to update export status for invoice ${invoice.invoiceId}`,
//               );
//             }
//           } catch (updateError) {
//             console.warn(
//               `Error updating export status for invoice ${invoice.invoiceId}:`,
//               updateError,
//             );
//           }
//         }
//       } catch (exportError) {
//         console.error("Error during bulk export:", exportError);
//         alert(`Failed to export invoices: ${exportError.message}`);
//         return;
//       }

//       // Update local state for successfully exported invoices
//       if (successfullyExportedIds.length > 0) {
//         setInvoices((prev) =>
//           prev.map((inv) =>
//             successfullyExportedIds.includes(inv.invoiceId)
//               ? {
//                   ...inv,
//                   isExported: true,
//                   updatedAt: new Date().toISOString(),
//                   updatedBy: "admin",
//                 }
//               : inv,
//           ),
//         );

//         setFilteredInvoices((prev) =>
//           prev.map((inv) =>
//             successfullyExportedIds.includes(inv.invoiceId)
//               ? {
//                   ...inv,
//                   isExported: true,
//                   updatedAt: new Date().toISOString(),
//                   updatedBy: "admin",
//                 }
//               : inv,
//           ),
//         );

//         // Clear selections for exported invoices
//         setSelectedInvoices((prev) => {
//           const newSelected = new Set(prev);
//           successfullyExportedIds.forEach((id) => newSelected.delete(id));
//           return newSelected;
//         });

//         setSelectAll(false);
//       }

//       const successMessage =
//         invoicesToExport.length === 1
//           ? "Invoice exported successfully!"
//           : `${invoicesToExport.length} invoices exported successfully!`;

//       alert(successMessage);
//     } catch (error) {
//       console.error("Error during export process:", error);
//       alert(`Export failed: ${error.message}`);
//     } finally {
//       setIsExporting(false); // ADD THIS LINE HERE
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("currentUser");
//     setCurrentUser(null);
//     setUserLoaded(false);
//     showToast("Logged out successfully", "info");
//     navigate("/");
//   };

//   // if (loading) {
//   //   return (
//   //     <div className="min-h-screen bg-f9fafd flex items-center justify-center pl-44 pr-4">
//   //       <div className="text-center">
//   //         <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
//   //         <p className="text-lg text-gray-600">Loading invoices...</p>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-f9fafd flex items-center justify-center pl-44 pr-4">
//         <div className="text-center text-gray-600">
//           <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
//           <p className="text-lg font-medium">No Invoices</p>
//           {/* <p className="text-sm">{error}</p> */}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Main container matching ExportTable layout */}
//       <div className="space-y-2 text-sm sm:text-base text-gray-800 font-inter">
//         {/* Header Section */}
//         {/* <div
//           className="w-full flex justify-between items-center mb-4 mt-5"
//           style={{
//             marginLeft: 24,
//             marginRight: 24,
//             width: "calc(100vw - 220px)",
//           }}
//         >
//           <div className="flex items-center">
//             <Receipt className="h-8 w-8 text-green-600 mr-3" />
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 Invoice Export
//               </h1>
//               <p className="text-gray-600">Manage and export invoice data</p>
//               <button
//                 onClick={handleLogout}
//                 className="absolute top-6 right-8 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm font-normal shadow transition"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div> */}
//         <div className="flex flex-col gap-2 w-full ">
//           <div className="flex items-center justify-between gap-2 bg-white rounded-sm p-4">
//             <div className="flex items-center gap-2">
//               <Receipt size={20} className="text-blue-600" />
//               <h1 className="text-lg font-bold text-gray-800">
//                 Invoice Export
//               </h1>
//             </div>
//           </div>
//         </div>

//         <div className=" flex items-center justify-between">
//           <div className="flex flex-col sm:flex-row px-2 items-start sm:items-center gap-2 relative w-full sm:w-auto">
//             <label className="input-label">Invoice Number:</label>
//             <div className="relative w-full sm:w-64">
//               <input
//                 type="text"
//                 className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-full"
//                 value={filterInvoiceNumber}
//                 onChange={(e) => setFilterInvoiceNumber(e.target.value)}
//                 autoComplete="off"
//               />
//             </div>
//             <button
//               onClick={() => setFilterInvoiceNumber("")}
//               className="btn1 btn-blue cursor-pointer"
//             >
//               Clear
//             </button>
//           </div>

//           <div className="flex items-center justify-center gap-2">
//             <button
//               onClick={downloadInvoices}
//               disabled={selectedInvoices.size === 0 || isDownloading}
//               className={` flex items-center gap-2 justify-center btn1 btn-blue cursor-pointer ${
//                 selectedInvoices.size === 0 || isDownloading
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : ""
//               }`}
//             >
//               <Download className="h-4 w-4 mr-2" />
//               {isDownloading
//                 ? "Downloading..."
//                 : `Download (${selectedInvoices.size})`}
//             </button>

//             {/* Export Button */}
//             <button
//               onClick={exportToCSV}
//               disabled={exportCount === 0 || isExporting}
//               data-export-button
//               className={`flex items-center gap-2 justify-center btn1 btn-blue cursor-pointer ${
//                 exportCount === 0 || isExporting
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : ""
//               }`}
//               title={
//                 exportCount === 0
//                   ? "Select invoices to export (exported invoices can only be downloaded)"
//                   : ""
//               }
//             >
//               <FileDown className="h-4 w-4 mr-2" />
//               {isExporting ? "Exporting..." : `Export (${exportCount})`}
//             </button>
//           </div>
//         </div>

//         {/* Table Container - Matching ExportTable style */}
//         {/* {filteredInvoices.length === 0 ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="text-center text-gray-500">
//               <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
//               <p className="text-lg font-medium">No invoices found</p>
//               <p className="text-sm">Try adjusting your filter criteria</p>
//             </div>
//           </div>
//         ) : ( */}
//         <div className="space-y-4 sm:p-4 rounded p-2 bg-white mb-1">
//           {/* Action Buttons Section */}
//           <div
//             className="flex justify-between items-center mb-2 w-full"
//             style={{ flexShrink: 0 }}
//           >
//             <div className="flex gap-2">
//               <span className="text-sm text-gray-600">
//                 Selected: {selectedInvoices.size} of {selectableInvoices.length}
//               </span>
//             </div>
//             <div className="text-xs text-gray-500">
//               Showing {filteredInvoices.length} invoices
//             </div>
//           </div>

//           {/* Scrollable Table Container - Matching ExportTable exactly */}
//           <div
//             style={{
//               overflowX: "auto",
//               overflowY: "auto",
//               maxHeight: "calc(100vh - 180px)",
//               minHeight: "200px",
//               width: "100%",
//               flex: 1,
//               border: "1px solid #e5e7eb",
//               borderRadius: "4px",
//             }}
//           >
//             {loading ? (
//               // Loading state just for table area
//               <div className="flex items-center justify-center py-10">
//                 <div className="text-center">
//                   <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
//                   <p className="text-lg text-gray-600">Loading invoices...</p>
//                 </div>
//               </div>
//             ) : filteredInvoices.length === 0 ? (
//               // Empty / error state for table area
//               <div className="flex items-center justify-center py-10">
//                 <div className="text-center text-gray-600">
//                   <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                   <p className="text-lg font-medium">No Invoices</p>
//                   {/* <p className="text-sm">{error}</p> */}
//                 </div>
//               </div>
//             ) : (
//               <table className="min-w-full table-auto divide-gray-200">
//                 <thead className="bg-gray-200 sticky top-0 z-10">
//                   <tr>
//                     <th className="th-thead w-10">
//                       <input
//                         type="checkbox"
//                         checked={selectAll}
//                         onChange={(e) => handleSelectAll(e.target.checked)}
//                         disabled={filteredInvoices.length === 0}
//                         className="cursor-pointer"
//                       />
//                     </th>
//                     <th className="th-thead text-xs font-bold text-gray-600 text-center">
//                       Invoice Number
//                     </th>
//                     <th className="th-thead text-xs font-bold text-gray-600 text-center">
//                       Work Order
//                     </th>
//                     <th className="th-thead text-xs font-bold text-gray-600 text-center">
//                       Vendor
//                     </th>
//                     <th className="th-thead text-xs font-bold text-gray-600 text-center">
//                       Invoice Date
//                     </th>
//                     <th className="th-thead text-xs font-bold text-gray-600 text-center">
//                       Amount
//                     </th>
//                     <th className="th-thead text-xs font-bold text-gray-600 text-center">
//                       Currency
//                     </th>
//                     <th className="th-thead text-xs font-bold text-gray-600 text-center">
//                       Created At
//                     </th>
//                     <th className="th-thead text-xs font-bold text-gray-600 text-center">
//                       Action
//                     </th>
//                     {userRole === "admin" && (
//                       <th className="th-thead text-xs font-bold text-gray-600 text-center">
//                         Correction
//                       </th>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-100">
//                   {filteredInvoices.map((invoice, index) => {
//                     const invoiceId = invoice.invoiceId || invoice.id || index;
//                     return (
//                       <tr
//                         key={invoiceId}
//                         style={{
//                           backgroundColor:
//                             index % 2 === 0 ? "#f9fafb" : "white",
//                           cursor: "pointer",
//                         }}
//                         onMouseEnter={(e) => {
//                           if (!selectedInvoices.has(invoiceId)) {
//                             e.target.closest("tr").style.backgroundColor =
//                               "#f3f4f6";
//                           }
//                         }}
//                         onMouseLeave={(e) => {
//                           if (!selectedInvoices.has(invoiceId)) {
//                             e.target.closest("tr").style.backgroundColor =
//                               index % 2 === 0 ? "#f9fafb" : "white";
//                           }
//                         }}
//                       >
//                         <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
//                           <input
//                             type="checkbox"
//                             checked={selectedInvoices.has(invoiceId)}
//                             onChange={(e) =>
//                               handleSelectInvoice(
//                                 invoiceId,
//                                 e.target.checked,
//                                 invoice,
//                               )
//                             }
//                             // className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900"
//                             title={
//                               invoice.isExported
//                                 ? "This invoice is exported. Downloads only."
//                                 : ""
//                             }
//                           />
//                         </td>
//                         <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900">
//                           <div
//                             style={{
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                             }}
//                           >
//                             {invoice.invoiceNumber || "N/A"}
//                           </div>
//                         </td>
//                         <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900">
//                           <div
//                             style={{
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                             }}
//                           >
//                             {invoice.workOrder || "N/A"}
//                           </div>
//                         </td>
//                         <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900">
//                           <div
//                             style={{
//                               overflow: "hidden",
//                               textOverflow: "ellipsis",
//                             }}
//                           >
//                             {invoice.invoiceTimesheetLines?.[0]?.vendor ||
//                               "N/A"}
//                           </div>
//                         </td>
//                         <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900">
//                           {formatDate(invoice.invoiceDate)}
//                         </td>
//                         <td className="px-2 py-1 text-xs border-r border-b font-normal text-right whitespace-nowrap border-gray-300 text-gray-900">
//                           {formatCurrency(
//                             invoice.invoiceAmount,
//                             invoice.currency,
//                           )}
//                         </td>
//                         <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900">
//                           {invoice.currency || "USD"}
//                         </td>
//                         <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900">
//                           {formatDate(invoice.createdAt)}
//                         </td>
//                         <td className="px-2 py-1 text-xs border-r border-b flex items-center justify-center font-normal border-gray-300 text-gray-900">
//                           <button
//                             onClick={() => handlePreview(invoice)}
//                             style={{
//                               backgroundColor: "#dbeafe",
//                               color: "#1e40af",
//                               padding: "4px 12px",
//                               borderRadius: "6px",
//                               border: "none",
//                               fontSize: "10px",
//                               cursor: "pointer",
//                               display: "inline-flex",
//                               alignItems: "center",
//                               gap: "4px",
//                             }}
//                           >
//                             <Eye style={{ width: "14px", height: "14px" }} />
//                             Preview
//                           </button>
//                         </td>
//                         {/* Conditional correction column */}
//                         {userRole === "admin" && (
//                           <td className="px-2 py-1 text-xs border-r border-b text-center font-normal border-gray-300 text-gray-900">
//                             {invoice.isExported && (
//                               <button
//                                 onClick={() => handleUnexport(invoice)}
//                                 data-open-invoice={
//                                   invoice.invoiceId || invoice.id
//                                 }
//                                 style={{
//                                   backgroundColor: "#fed7aa",
//                                   color: "#c2410c",
//                                   padding: "4px 12px",
//                                   borderRadius: "6px",
//                                   border: "none",
//                                   fontSize: "10px",
//                                   fontWeight: "500",
//                                   cursor: "pointer",
//                                 }}
//                               >
//                                 OPEN
//                               </button>
//                             )}
//                           </td>
//                         )}
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Preview Modal */}
//       {previewModalVisible && (
//         <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//               <h2 className="text-xl font-semibold text-gray-900">
//                 Invoice Preview
//               </h2>
//               <button
//                 onClick={() => setPreviewModalVisible(false)}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <X className="h-6 w-6" />
//               </button>
//             </div>
//             <div className="p-6">
//               <InvoiceViewer
//                 data={previewData}
//                 setInvoiceModalVisible={setPreviewModalVisible}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//       <ToastContainer position="top-right" autoClose={3000} />
//     </>
//   );
// }




import React, { useState, useEffect } from "react";
import { Receipt, Filter, Download, X, Eye, FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InvoiceViewer from "./InvoiceViewer";
import logoImg from "../assets/CapComm_Logo_v2_nobk.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// import logoImg from "../assets/revolve_color_logo.png";
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

export default function InvoiceExport() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterInvoiceNumber, setFilterInvoiceNumber] = useState("");
  const [selectedInvoices, setSelectedInvoices] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [exportCount, setExportCount] = useState(0);
  const [userLoaded, setUserLoaded] = useState(false);

  // Table dimensions matching ExportTable
  const colWidth = 120;
  const minTableWidth = 2200; // Fixed width to force horizontal scroll

  // Get user role from localStorage (set during login)
  useEffect(() => {
    const getUserRole = () => {
      try {
        // Try to get from loginResponse first
        const loginResponse = localStorage.getItem("loginResponse");
        if (loginResponse) {
          const parsedResponse = JSON.parse(loginResponse);
          setUserRole(parsedResponse.role?.toLowerCase() || "user");
          return;
        }
        // Fallback: try userData
        const userData = localStorage.getItem("userData");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUserRole(parsedUserData.role?.toLowerCase() || "user");
          return;
        }
        // Fallback: try individual userRole
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
          setUserRole(storedRole.toLowerCase());
          return;
        }
        // Default fallback - temporarily set to admin for testing
        setUserRole("admin"); // Change this back to 'user' for production
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUserRole("admin"); // Change this back to 'user' for production
      }
    };
    getUserRole();
  }, []);

  // Fetch invoices from API
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/api/Invoices`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setInvoices(data);
        setFilteredInvoices(data);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError(err.message || "Failed to fetch invoices");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // Filter invoices based on invoice number filter
  useEffect(() => {
    let filtered = invoices;
    // Filter by invoice number
    if (filterInvoiceNumber) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoiceNumber &&
          invoice.invoiceNumber
            .toLowerCase()
            .includes(filterInvoiceNumber.toLowerCase()),
      );
    }
    setFilteredInvoices(filtered);
    // Reset selections when filter changes
    setSelectedInvoices(new Set());
    setSelectAll(false);
  }, [invoices, filterInvoiceNumber]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const year = date.getFullYear();
      return `${month}-${day}-${year}`;
    } catch {
      return dateString;
    }
  };

  // Format currency helper
  const formatCurrency = (amount, currency = "USD") => {
    if (!amount && amount !== 0) return "N/A";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
      }).format(amount);
    } catch {
      return `${currency || "$"} ${amount}`;
    }
  };

  // Calculate selectable invoices (only those that are not exported)
  const selectableInvoices = filteredInvoices.filter(
    (invoice) => !invoice.isExported,
  );

  // Handle select all checkbox
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      // Select ALL invoices (both exported and non-exported)
      const allIds = new Set(
        filteredInvoices.map(
          (invoice, index) =>
            invoice.invoiceId ||
            invoice.id ||
            filteredInvoices.indexOf(invoice),
        ),
      );
      setSelectedInvoices(allIds);
      // Update export count to only count non-exported ones
      const nonExportedCount = filteredInvoices.filter(
        (inv) => !inv.isExported,
      ).length;
      setExportCount(nonExportedCount);
    } else {
      setSelectedInvoices(new Set());
      setExportCount(0);
    }
  };

  // Handle individual checkbox
  // const handleSelectInvoice = (invoiceId, checked, invoice) => {
  //   // Prevent selection if invoice is exported
  //   if (invoice && invoice.isExported) return;
  //   setSelectedInvoices((prev) => {
  //     const newSelected = new Set(prev);
  //     if (checked) {
  //       newSelected.add(invoiceId);
  //     } else {
  //       newSelected.delete(invoiceId);
  //     }
  //     // Update select all state - check if all selectable invoices are selected
  //     const allSelectableSelected =
  //       selectableInvoices.length > 0 &&
  //       selectableInvoices.every((inv) => {
  //         const id = inv.invoiceId || filteredInvoices.indexOf(inv);
  //         return newSelected.has(id);
  //       });
  //     setSelectAll(allSelectableSelected);
  //     return newSelected;
  //   });
  // };

  // Handle individual checkbox - allow selection of all invoices
  // but only count non-exported ones for the export button
  const handleSelectInvoice = (invoiceId, checked, invoice) => {
    setSelectedInvoices((prev) => {
      const newSelected = new Set(prev);

      if (checked) newSelected.add(invoiceId);
      else newSelected.delete(invoiceId);

      // Export count: only count non-exported invoices in the selection
      const nonExportedCount = Array.from(newSelected).filter((id) => {
        const inv = filteredInvoices.find((x) => (x.invoiceId || x.id) === id);
        return inv && !inv.isExported;
      }).length;

      setExportCount(nonExportedCount);

      // Check if all selectable (non-exported) invoices are selected
      const allSelectableSelected =
        selectableInvoices.length > 0 &&
        selectableInvoices.every((inv) => {
          const id = inv.invoiceId || inv.id || filteredInvoices.indexOf(inv);
          return newSelected.has(id);
        });
      setSelectAll(allSelectableSelected);

      return newSelected;
    });
  };

  // Handle unexport (reopen) invoice - only for admin
  const handleUnexport = async (invoice) => {
    if (userRole !== "admin") {
      alert("Access denied. Admin privileges required.");
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to reopen invoice ${invoice.invoiceNumber}?`,
    );
    if (!confirmed) return;

    try {
      // Show loading state
      const openButton = document.querySelector(
        `[data-open-invoice="${invoice.invoiceId || invoice.id}"]`,
      );
      if (openButton) {
        openButton.disabled = true;
        openButton.textContent = "Opening...";
      }

      // Prepare the request body with the current invoice data
      const requestBody = {
        invoiceId: invoice.invoiceId || invoice.id || 0,
        invoiceNumber: invoice.invoiceNumber || "string",
        po_Number: invoice.po_Number || invoice.poNumber || "string",
        invoiceDate: invoice.invoiceDate || new Date().toISOString(),
        invoiceAmount: invoice.invoiceAmount || 0,
        currency: invoice.currency || "USD",
        createdAt: invoice.createdAt || new Date().toISOString(),
        createdBy: invoice.createdBy || "string",
        updatedAt: new Date().toISOString(),
        updatedBy: "admin", // or get from current user context
        billTo: invoice.billTo || "string",
        remitTo: invoice.remitTo || "string",
        isExported: false, // This is the key change - setting to false to reopen
        invoiceTimesheetLines: invoice.invoiceTimesheetLines || [],
      };

      // API call to update the invoice using the correct endpoint
      const response = await fetch(
        `${backendUrl}/api/Invoices/${invoice.invoiceId || invoice.id}`,
        {
          method: "PUT", // Using PUT as per the API structure
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...invoice,
            isExported: true,
            updatedAt: new Date().toISOString(),
            updatedBy: "admin",
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${errorText || response.statusText}`,
        );
      }

      // Update the local state
      setInvoices((prev) =>
        prev.map((inv) =>
          (inv.invoiceId || inv.id) === (invoice.invoiceId || invoice.id)
            ? { ...inv, isExported: false }
            : inv,
        ),
      );
      setFilteredInvoices((prev) =>
        prev.map((inv) =>
          (inv.invoiceId || inv.id) === (invoice.invoiceId || invoice.id)
            ? { ...inv, isExported: false }
            : inv,
        ),
      );

      alert(`Invoice ${invoice.invoiceNumber} has been reopened successfully!`);
    } catch (error) {
      console.error("Error reopening invoice:", error);
      alert(`Failed to reopen invoice: ${error.message}`);
    } finally {
      // Reset button state
      const openButton = document.querySelector(
        `[data-open-invoice="${invoice.invoiceId || invoice.id}"]`,
      );
      if (openButton) {
        openButton.disabled = false;
        openButton.textContent = "OPEN";
      }
    }
  };

  const handlePreview = async (invoice) => {
    try {
      setPreviewModalVisible(true);
      setPreviewData(null);

      const response = await fetch(
        `${backendUrl}/api/SubkTimesheet/PreviewInvoice?Invoice_Number=${encodeURIComponent(
          invoice.invoiceNumber,
        )}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch invoice preview: ${response.status}`);
      }

      const apiData = await response.json();

      // Function to group and combine line items with same PLC, Vendor, and Employee
      const groupAndCombineLineItems = (lineItems) => {
        if (!lineItems || !Array.isArray(lineItems)) {
          return [];
        }

        const groupedItems = {};

        lineItems.forEach((item, index) => {
          // Create a unique key for grouping based on PLC, Vendor, and Employee
          const plcKey = item.plc || "";
          const vendorKey = item.vendor || "";
          const employeeKey = item.employee || "";
          const employeeRate = item.rate || "";

          const groupKey = `${plcKey}_${vendorKey}_${employeeKey}_${employeeRate}`;

          if (groupedItems[groupKey]) {
            // Combine with existing group - sum hours and amounts
            const existingHours = parseFloat(groupedItems[groupKey].hours) || 0;
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
              poLine: item.poLine || " ",
              plc: item.plc || " ",
              vendor: item.vendor || " ",
              employee: item.employee || " ",
              hours: parseFloat(item.hours) || 0,
              rate: item.rate || 0,
              amount: parseFloat(item.amount) || 0,
              line_No: item.line_No || " ",
              combinedCount: 1,
            };
          }
        });

        // Convert grouped items back to array with formatted values
        return Object.values(groupedItems).map((item) => ({
          poLine: item.poLine,
          plc: item.plc,
          vendor: item.vendor,
          employee: item.employee,
          hours: Number(item.hours.toFixed(2)),
          rate: item.rate,
          amount: Number(item.amount.toFixed(2)),
          line_No: item.line_No,
        }));
      };

      // Group and combine line items
      const combinedLineItems = groupAndCombineLineItems(
        apiData.lineItems || [],
      );

      // Recalculate total amount based on combined line items
      const newTotalAmount = combinedLineItems.reduce((sum, item) => {
        return sum + (parseFloat(item.amount) || 0);
      }, 0);

      const transformedData = [
        {
          invoiceId: apiData.invoiceId || " ",
          venderName: apiData.venderName,
          invoiceDate: formatDate(apiData.invoiceDate) || " ",
          period: apiData.period || " ",
          currency: apiData.currency || " ",
          totalAmount: Number(newTotalAmount.toFixed(2)),

          lineItems: combinedLineItems,

          billTo: apiData.billTo || " ",
          buyer: apiData.buyer || " ",
          po_Number: apiData.po_Number || " ",
          po_rlse_Number: apiData.po_rlse_Number || " ",
          po_Start_End_Date: apiData.po_Start_End_Date || " ",
          terms: apiData.terms || " ",
          amountDue: Number(newTotalAmount.toFixed(2)),
        },
      ];

      console.log("Original API data:", apiData);
      console.log("Combined line items:", combinedLineItems);
      console.log("Transformed preview data:", transformedData);

      setPreviewData(transformedData);
    } catch (error) {
      console.error("Error fetching invoice preview:", error);
      alert(`Failed to load invoice preview: ${error.message}`);
    }
  };

  const handleDownloadPdf = () => {
    setDownloading(true);
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const drawHeader = () => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(0, 71, 171);
        doc.text("INVOICE", 14, 20);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text("Capital Communications LLC.", 14, 27);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text("14600 Flint Lee Rd Unit E\nCHANTILLY, VA 20151", 14, 32);
        doc.text("apalma@capcomm.tech | +1 (703) 309-3832", 14, 44);

        try {
          doc.addImage(logoImg, "PNG", pageWidth - 45, 15, 30, 12);
        } catch (e) {}

        doc.setFillColor(244, 248, 251);
        doc.roundedRect(14, 50, pageWidth - 28, 62, 2, 2, "F");
        doc.setDrawColor(210, 220, 230);
        doc.roundedRect(14, 50, pageWidth - 28, 62, 2, 2, "S");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(0, 71, 171);
        doc.text(activeProjectNames, 18, 57);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);
        doc.text("BILL TO:", 18, 64);
        doc.text("SHIP TO:", 110, 64);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(selectedCustomer?.billTo || "", 18, 69);
        doc.text(selectedCustomer?.shipTo || "", 110, 69);

        doc.setDrawColor(200, 205, 215);
        doc.line(18, 88, pageWidth - 18, 88);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);
        doc.text("INVOICE DETAILS:", 18, 94);
        doc.text("PO & SALES INFO:", 110, 94);

        doc.setFont("helvetica", "normal");
        doc.text(`Invoice No: ${generatedInvoiceNo}`, 18, 99);
        doc.text(
          `Terms: ${selectedCustomer?.defaultTerms || "Net 30"}`,
          18,
          103,
        );
        doc.text(`Invoice Date: ${invoiceDate}`, 18, 107);
        doc.text(`Due Date: ${dueDate}`, 18, 111);

        doc.text("PO Number: 1825575", 110, 99);
        doc.text("Sales Person: RJM", 110, 103);
        doc.text(
          `Rate Mode: ${selectedCustomer?.defaultRateType || "Bill Rate"}`,
          110,
          107,
        );
      };

      drawHeader();

      let currentY = 124;

      const drawTableHeader = (y) => {
        doc.setFillColor(240, 244, 248);
        doc.rect(14, y, pageWidth - 28, 8, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(70, 70, 70);
        doc.text("#", 17, y + 5.5);
        doc.text("Product or service", 27, y + 5.5);
        doc.text("Description", 75, y + 5.5);
        doc.text("Qty", 138, y + 5.5, { align: "right" });
        doc.text("Rate", 162, y + 5.5, { align: "right" });
        doc.text("Amount", pageWidth - 17, y + 5.5, { align: "right" });
      };

      drawTableHeader(currentY);
      currentY += 10;

      activeLineItems.forEach((item, index) => {
        // Define strict column widths for text wrapping
        const colWidthPlc = 45;
        const colWidthDesc = 40;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        const wrappedPlc = doc.splitTextToSize(item.plc || "", colWidthPlc);

        doc.setFont("helvetica", "normal");
        const wrappedDesc = doc.splitTextToSize(
          item.description || "",
          colWidthDesc,
        );

        // Calculate required row height dynamically based on wrapped text lines
        const maxLines = Math.max(wrappedPlc.length, wrappedDesc.length);
        const rowHeight = Math.max(8, maxLines * 4 + 4);

        if (currentY + rowHeight > pageHeight - 25) {
          doc.addPage();
          drawHeader();
          currentY = 124;
          drawTableHeader(currentY);
          currentY += 10;
        }

        // Render Row Data with proper bounding X coordinates
        doc.setFont("helvetica", "normal");
        doc.setTextColor(90, 90, 90);
        doc.text(`${index + 1}.`, 17, currentY + 4);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 40, 40);
        doc.text(wrappedPlc, 27, currentY + 4);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(wrappedDesc, 75, currentY + 4);

        doc.setTextColor(70, 70, 70);
        doc.text(item.hours.toFixed(2), 138, currentY + 4, {
          align: "right",
        });
        doc.text(`$${item.rate.toFixed(2)}`, 162, currentY + 4, {
          align: "right",
        });
        doc.text(`$${item.amount.toFixed(2)}`, pageWidth - 17, currentY + 4, {
          align: "right",
        });

        currentY += rowHeight;
        doc.setDrawColor(230, 235, 240);
        doc.line(14, currentY, pageWidth - 14, currentY);
        currentY += 3;
      });

      if (currentY > pageHeight - 25) {
        doc.addPage();
        currentY = 20;
      }

      currentY += 5;
      doc.setFillColor(244, 248, 251);
      doc.roundedRect(pageWidth - 85, currentY, 71, 14, 2, 2, "F");
      doc.setDrawColor(210, 220, 230);
      doc.roundedRect(pageWidth - 85, currentY, 71, 14, 2, 2, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);
      doc.text("Total Amount Due:", pageWidth - 80, currentY + 9);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(0, 71, 171);
      doc.text(`$${totalAmount.toFixed(2)}`, pageWidth - 20, currentY + 9, {
        align: "right",
      });

      doc.save(`CapComm_Invoice_${generatedInvoiceNo}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  const downloadInvoices = async () => {
    const invoicesToDownload = filteredInvoices.filter((invoice, index) =>
      selectedInvoices.has(invoice.invoiceId || index),
    );

    if (invoicesToDownload.length === 0) {
      alert("Please select invoices to download");
      return;
    }

    try {
      setIsDownloading(true);

      for (let i = 0; i < invoicesToDownload.length; i++) {
        const invoice = invoicesToDownload[i];
        const invoiceId = invoice.invoiceId || invoice.invoiceNumber;

        if (!invoiceId) {
          console.warn(
            `Skipping invoice without ID: ${JSON.stringify(invoice)}`,
          );
          continue;
        }

        try {
          // 1. Fetch preview invoice data from API
          const previewResponse = await fetch(
            `${backendUrl}/api/SubkTimesheet/PreviewInvoice?Invoice_Number=${encodeURIComponent(
              invoice.invoiceNumber || invoiceId,
            )}`,
          );

          if (!previewResponse.ok) {
            throw new Error(
              `Failed to fetch invoice preview: ${previewResponse.status}`,
            );
          }

          const apiData = await previewResponse.json();

          // 2. Group and combine line items with same PLC, Vendor, and Employee
          const groupAndCombineLineItems = (lineItems) => {
            if (!lineItems || !Array.isArray(lineItems)) {
              return [];
            }

            const groupedItems = {};

            lineItems.forEach((item) => {
              const plcKey = item.plc || "";
              const vendorKey = item.vendor || "";
              const employeeKey = item.employee || "";
              const employeeRateKey = item.rate || "";
              const groupKey = `${plcKey}_${vendorKey}_${employeeKey}_${employeeRateKey}`;

              if (groupedItems[groupKey]) {
                const existingHours =
                  parseFloat(groupedItems[groupKey].hours) || 0;
                const newHours = parseFloat(item.hours) || 0;
                groupedItems[groupKey].hours = existingHours + newHours;

                const existingAmount =
                  parseFloat(groupedItems[groupKey].amount) || 0;
                const newAmount = parseFloat(item.amount) || 0;
                groupedItems[groupKey].amount = existingAmount + newAmount;

                groupedItems[groupKey].combinedCount =
                  (groupedItems[groupKey].combinedCount || 1) + 1;
              } else {
                groupedItems[groupKey] = {
                  poLine: item.poLine || " ",
                  plc: item.plc || " ",
                  vendor: item.vendor || " ",
                  employee: item.employee || " ",
                  hours: parseFloat(item.hours) || 0,
                  rate: item.rate || 0,
                  amount: parseFloat(item.amount) || 0,
                  line_No: item.line_No || " ",
                  combinedCount: 1,
                };
              }
            });

            return Object.values(groupedItems).map((item) => ({
              poLine: item.poLine,
              plc: item.plc,
              vendor: item.vendor,
              employee: item.employee,
              hours: Number(item.hours.toFixed(2)),
              rate: item.rate,
              amount: Number(item.amount.toFixed(2)),
              line_No: item.line_No,
            }));
          };

          const combinedLineItems = groupAndCombineLineItems(
            apiData.lineItems || [],
          );

          const newTotalAmount = combinedLineItems.reduce((sum, item) => {
            return sum + (parseFloat(item.amount) || 0);
          }, 0);

          // Calculate Due Date based on Terms (+30 days default)
          const calculateDueDate = (periodStr, termsStr) => {
            try {
              const date = new Date(periodStr || Date.now());
              if (isNaN(date.getTime())) return periodStr || "";
              let days = 30;
              if (termsStr === "Due on receipt") days = 0;
              else if (termsStr?.includes("15")) days = 15;
              else if (termsStr?.includes("60")) days = 60;
              date.setDate(date.getDate() + days);
              return date.toISOString().split("T")[0];
            } catch (e) {
              return periodStr || "";
            }
          };

          const invoiceDate =
            apiData.period || new Date().toISOString().split("T")[0];
          const dueDate = calculateDueDate(invoiceDate, apiData.terms);
          const activeProjectNames = apiData.billTo
            ? apiData.billTo.split("\n")[0]
            : "Project Details";

          // 3. Generate PDF directly using jsPDF (matching CapComm layout style)
          const doc = new jsPDF("p", "mm", "a4");
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();

          const drawHeader = () => {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.setTextColor(0, 71, 171);
            doc.text("INVOICE", 14, 20);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(50, 50, 50);
            doc.text("Capital Communications LLC.", 14, 27);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.text("14600 Flint Lee Rd Unit E\nCHANTILLY, VA 20151", 14, 32);
            doc.text("apalma@capcomm.tech | +1 (703) 309-3832", 14, 44);

            try {
              doc.addImage(logoImg, "PNG", pageWidth - 45, 15, 30, 12);
            } catch (e) {}

            doc.setFillColor(244, 248, 251);
            doc.roundedRect(14, 50, pageWidth - 28, 62, 2, 2, "F");
            doc.setDrawColor(210, 220, 230);
            doc.roundedRect(14, 50, pageWidth - 28, 62, 2, 2, "S");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(0, 71, 171);
            doc.text(activeProjectNames, 18, 57);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(80, 80, 80);
            doc.text("BILL TO:", 18, 64);
            doc.text("SHIP TO:", 110, 64);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(apiData.billTo || "", 18, 69);
            doc.text(apiData.billTo || "", 110, 69);

            doc.setDrawColor(200, 205, 215);
            doc.line(18, 88, pageWidth - 18, 88);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(80, 80, 80);
            doc.text("INVOICE DETAILS:", 18, 94);
            doc.text("PO & SALES INFO:", 110, 94);

            doc.setFont("helvetica", "normal");
            doc.text(`Invoice No: ${apiData.invoiceId || invoiceId}`, 18, 99);
            doc.text(`Terms: ${apiData.terms || "Net 30"}`, 18, 103);
            doc.text(`Invoice Date: ${invoiceDate}`, 18, 107);
            doc.text(`Due Date: ${dueDate}`, 18, 111);

            doc.text(`PO Number: ${apiData.po_Number || "0000"}`, 110, 99);
            doc.text(`Sales Person: ${apiData.buyer || "RJM"}`, 110, 103);
            doc.text(`Rate Mode: Bill Rate`, 110, 107);
          };

          drawHeader();

          let currentY = 124;

          const drawTableHeader = (y) => {
            doc.setFillColor(240, 244, 248);
            doc.rect(14, y, pageWidth - 28, 8, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(70, 70, 70);
            doc.text("#", 17, y + 5.5);
            doc.text("Product or service", 27, y + 5.5);
            doc.text("Description", 75, y + 5.5);
            doc.text("Qty", 138, y + 5.5, { align: "right" });
            doc.text("Rate", 162, y + 5.5, { align: "right" });
            doc.text("Amount", pageWidth - 17, y + 5.5, { align: "right" });
          };

          drawTableHeader(currentY);
          currentY += 10;

          combinedLineItems.forEach((item, index) => {
            const colWidthPlc = 45;
            const colWidthDesc = 40;

            const descriptionText = `[${apiData.po_Start_End_Date || ""}] V-${apiData.venderName || ""} (${item.plc?.includes("75") ? "SR" : "SO"})`;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            const wrappedPlc = doc.splitTextToSize(item.plc || "", colWidthPlc);

            doc.setFont("helvetica", "normal");
            const wrappedDesc = doc.splitTextToSize(
              descriptionText,
              colWidthDesc,
            );

            const maxLines = Math.max(wrappedPlc.length, wrappedDesc.length);
            const rowHeight = Math.max(8, maxLines * 4 + 4);

            if (currentY + rowHeight > pageHeight - 25) {
              doc.addPage();
              drawHeader();
              currentY = 124;
              drawTableHeader(currentY);
              currentY += 10;
            }

            doc.setFont("helvetica", "normal");
            doc.setTextColor(90, 90, 90);
            doc.text(`${index + 1}.`, 17, currentY + 4);

            doc.setFont("helvetica", "bold");
            doc.setTextColor(40, 40, 40);
            doc.text(wrappedPlc, 27, currentY + 4);

            doc.setFont("helvetica", "normal");
            doc.setTextColor(100, 100, 100);
            doc.text(wrappedDesc, 75, currentY + 4);

            doc.setTextColor(70, 70, 70);
            doc.text(item.hours.toFixed(2), 138, currentY + 4, {
              align: "right",
            });
            doc.text(`$${item.rate.toFixed(2)}`, 162, currentY + 4, {
              align: "right",
            });
            doc.text(
              `$${item.amount.toFixed(2)}`,
              pageWidth - 17,
              currentY + 4,
              {
                align: "right",
              },
            );

            currentY += rowHeight;
            doc.setDrawColor(230, 235, 240);
            doc.line(14, currentY, pageWidth - 14, currentY);
            currentY += 3;
          });

          if (currentY > pageHeight - 25) {
            doc.addPage();
            currentY = 20;
          }

          currentY += 5;
          doc.setFillColor(244, 248, 251);
          doc.roundedRect(pageWidth - 85, currentY, 71, 14, 2, 2, "F");
          doc.setDrawColor(210, 220, 230);
          doc.roundedRect(pageWidth - 85, currentY, 71, 14, 2, 2, "S");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(50, 50, 50);
          doc.text("Total Amount Due:", pageWidth - 80, currentY + 9);

          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(0, 71, 171);
          doc.text(
            `$${newTotalAmount.toFixed(2)}`,
            pageWidth - 20,
            currentY + 9,
            {
              align: "right",
            },
          );

          // Save the PDF with matching filename format
          const filename = `CapComm_Invoice_${apiData.invoiceId || invoiceId}.pdf`;
          doc.save(filename);

          if (i < invoicesToDownload.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } catch (invoiceError) {
          console.error(
            `Error downloading invoice ${invoiceId}:`,
            invoiceError,
          );
          alert(
            `Failed to download invoice ${invoiceId}: ${invoiceError.message}`,
          );
        }
      }

      const successMessage =
        invoicesToDownload.length === 1
          ? "Invoice downloaded successfully!"
          : `${invoicesToDownload.length} invoices downloaded successfully!`;

      alert(successMessage);
    } catch (error) {
      console.error("Error during download process:", error);
      alert(`Download failed: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };
  const exportToCSV = async () => {
    const invoicesToExport = filteredInvoices.filter((invoice, index) =>
      selectedInvoices.has(invoice.invoiceId || index),
    );

    if (invoicesToExport.length === 0) {
      alert("Please select invoices to export");
      return;
    }

    try {
      setIsExporting(true);
      // Track successfully exported invoices for state update
      const successfullyExportedIds = [];

      // Collect all invoice IDs for bulk export
      const invoiceIds = invoicesToExport
        .map((invoice) => invoice.invoiceId || invoice.invoiceNumber)
        .filter((id) => id) // Remove any null/undefined values
        .map((id) => parseInt(id, 10)) // Ensure they are integers
        .filter((id) => !isNaN(id)); // Remove any NaN values

      if (invoiceIds.length === 0) {
        alert("No valid invoice IDs found for export");
        return;
      }

      console.log("Invoice IDs to export:", invoiceIds); // Debug log

      try {
        // Send the array directly as the request body (not wrapped in an object)
        const response = await fetch(
          `${backendUrl}/api/SubkTimesheet/export-invoices`,
          {
            method: "POST",
            headers: {
              Accept:
                "text/csv, application/csv, application/octet-stream, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(invoiceIds), // Send array directly, not wrapped in object
          },
        );

        console.log("Request body:", JSON.stringify(invoiceIds)); // Debug log

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          try {
            const errorData = await response.text();
            if (errorData) {
              errorMessage += ` - ${errorData}`;
            }
          } catch (e) {
            // Ignore if can't parse error
          }
          throw new Error(errorMessage);
        }

        const blob = await response.blob();

        // Check if response is actually a file, not JSON error
        if (blob.type && blob.type.includes("application/json")) {
          const text = await blob.text();
          console.error("Received JSON instead of file:", text);
          throw new Error("Server returned an error instead of a file");
        }

        // Generate filename for bulk export
        let filename = `bulk_invoice_export_${
          new Date().toISOString().split("T")[0]
        }.csv`;
        const contentDisposition = response.headers.get("Content-Disposition");
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
          );
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, "");
          }
        }

        // Download the file
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

        // Mark all invoices as successfully exported
        successfullyExportedIds.push(...invoiceIds);

        // Update invoice export status in database for each invoice
        for (const invoice of invoicesToExport) {
          try {
            const updateResponse = await fetch(
              `${backendUrl}/api/Invoices/${invoice.invoiceId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...invoice,
                  isExported: true,
                  updatedAt: new Date().toISOString(),
                  updatedBy: "admin",
                }),
              },
            );

            if (!updateResponse.ok) {
              console.warn(
                `Failed to update export status for invoice ${invoice.invoiceId}`,
              );
            }
          } catch (updateError) {
            console.warn(
              `Error updating export status for invoice ${invoice.invoiceId}:`,
              updateError,
            );
          }
        }
      } catch (exportError) {
        console.error("Error during bulk export:", exportError);
        alert(`Failed to export invoices: ${exportError.message}`);
        return;
      }

      // Update local state for successfully exported invoices
      if (successfullyExportedIds.length > 0) {
        setInvoices((prev) =>
          prev.map((inv) =>
            successfullyExportedIds.includes(inv.invoiceId)
              ? {
                  ...inv,
                  isExported: true,
                  updatedAt: new Date().toISOString(),
                  updatedBy: "admin",
                }
              : inv,
          ),
        );

        setFilteredInvoices((prev) =>
          prev.map((inv) =>
            successfullyExportedIds.includes(inv.invoiceId)
              ? {
                  ...inv,
                  isExported: true,
                  updatedAt: new Date().toISOString(),
                  updatedBy: "admin",
                }
              : inv,
          ),
        );

        // Clear selections for exported invoices
        setSelectedInvoices((prev) => {
          const newSelected = new Set(prev);
          successfullyExportedIds.forEach((id) => newSelected.delete(id));
          return newSelected;
        });

        setSelectAll(false);
      }

      const successMessage =
        invoicesToExport.length === 1
          ? "Invoice exported successfully!"
          : `${invoicesToExport.length} invoices exported successfully!`;

      alert(successMessage);
    } catch (error) {
      console.error("Error during export process:", error);
      alert(`Export failed: ${error.message}`);
    } finally {
      setIsExporting(false); // ADD THIS LINE HERE
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setUserLoaded(false);
    showToast("Logged out successfully", "info");
    navigate("/");
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-f9fafd flex items-center justify-center pl-44 pr-4">
  //       <div className="text-center">
  //         <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
  //         <p className="text-lg text-gray-600">Loading invoices...</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="min-h-screen bg-f9fafd flex items-center justify-center pl-44 pr-4">
        <div className="text-center text-gray-600">
          <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No Invoices</p>
          {/* <p className="text-sm">{error}</p> */}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main container matching ExportTable layout */}
      <div className="space-y-2 text-sm sm:text-base text-gray-800 font-inter">
        {/* Header Section */}
        {/* <div
          className="w-full flex justify-between items-center mb-4 mt-5"
          style={{
            marginLeft: 24,
            marginRight: 24,
            width: "calc(100vw - 220px)",
          }}
        >
          <div className="flex items-center">
            <Receipt className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Invoice Export
              </h1>
              <p className="text-gray-600">Manage and export invoice data</p>
              <button
                onClick={handleLogout}
                className="absolute top-6 right-8 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm font-normal shadow transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div> */}
        <div className="flex flex-col gap-2 w-full ">
          <div className="flex items-center justify-between gap-2 bg-white rounded-sm p-4">
            <div className="flex items-center gap-2">
              <Receipt size={20} className="text-blue-600" />
              <h1 className="text-lg font-bold text-gray-800">
                Invoice Export
              </h1>
            </div>
          </div>
        </div>

        <div className=" flex items-center justify-between">
          <div className="flex flex-col sm:flex-row px-2 items-start sm:items-center gap-2 relative w-full sm:w-auto">
            <label className="input-label">Invoice Number:</label>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-full"
                value={filterInvoiceNumber}
                onChange={(e) => setFilterInvoiceNumber(e.target.value)}
                autoComplete="off"
              />
            </div>
            <button
              onClick={() => setFilterInvoiceNumber("")}
              className="btn1 btn-blue cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={downloadInvoices}
              disabled={selectedInvoices.size === 0 || isDownloading}
              className={` flex items-center gap-2 justify-center btn1 btn-blue cursor-pointer ${
                selectedInvoices.size === 0 || isDownloading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : ""
              }`}
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading
                ? "Downloading..."
                : `Download (${selectedInvoices.size})`}
            </button>

            {/* Export Button */}
            {/* <button
              onClick={exportToCSV}
              disabled={exportCount === 0 || isExporting}
              data-export-button
              className={`flex items-center gap-2 justify-center btn1 btn-blue cursor-pointer ${
                exportCount === 0 || isExporting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : ""
              }`}
              title={
                exportCount === 0
                  ? "Select invoices to export (exported invoices can only be downloaded)"
                  : ""
              }
            >
              <FileDown className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : `Export (${exportCount})`}
            </button> */}
          </div>
        </div>

        {/* Table Container - Matching ExportTable style */}
        {/* {filteredInvoices.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center text-gray-500">
              <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No invoices found</p>
              <p className="text-sm">Try adjusting your filter criteria</p>
            </div>
          </div>
        ) : ( */}
        <div className="space-y-4 sm:p-4 rounded p-2 bg-white mb-1">
          {/* Action Buttons Section */}
          <div
            className="flex justify-between items-center mb-2 w-full"
            style={{ flexShrink: 0 }}
          >
            <div className="flex gap-2">
              <span className="text-sm text-gray-600">
                Selected: {selectedInvoices.size} of {selectableInvoices.length}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Showing {filteredInvoices.length} invoices
            </div>
          </div>

          {/* Scrollable Table Container - Matching ExportTable exactly */}
          <div
            style={{
              overflowX: "auto",
              overflowY: "auto",
              maxHeight: "calc(100vh - 180px)",
              minHeight: "200px",
              width: "100%",
              flex: 1,
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
            }}
          >
            {loading ? (
              // Loading state just for table area
              <div className="flex items-center justify-center py-10">
                <div className="text-center">
                  <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
                  <p className="text-lg text-gray-600">Loading invoices...</p>
                </div>
              </div>
            ) : filteredInvoices.length === 0 ? (
              // Empty / error state for table area
              <div className="flex items-center justify-center py-10">
                <div className="text-center text-gray-600">
                  <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No Invoices</p>
                  {/* <p className="text-sm">{error}</p> */}
                </div>
              </div>
            ) : (
              <table className="min-w-full table-auto divide-gray-200">
                <thead className="bg-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="th-thead w-10">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        disabled={filteredInvoices.length === 0}
                        className="cursor-pointer"
                      />
                    </th>
                    <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Invoice Number
                    </th>
                    {/* <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Work Order
                    </th>
                    <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Vendor
                    </th> */}
                    <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Invoice Date
                    </th>
                    <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Amount
                    </th>
                    <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Currency
                    </th>
                    <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Created At
                    </th>
                    <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Action
                    </th>
                    {/* {userRole === "admin" && (
                      <th className="th-thead text-xs font-bold text-gray-600 text-center">
                        Correction
                      </th>
                    )} */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredInvoices.map((invoice, index) => {
                    const invoiceId = invoice.invoiceId || invoice.id || index;
                    return (
                      <tr
                        key={invoiceId}
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#f9fafb" : "white",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          if (!selectedInvoices.has(invoiceId)) {
                            e.target.closest("tr").style.backgroundColor =
                              "#f3f4f6";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selectedInvoices.has(invoiceId)) {
                            e.target.closest("tr").style.backgroundColor =
                              index % 2 === 0 ? "#f9fafb" : "white";
                          }
                        }}
                      >
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 text-center">
                          <input
                            type="checkbox"
                            checked={selectedInvoices.has(invoiceId)}
                            onChange={(e) =>
                              handleSelectInvoice(
                                invoiceId,
                                e.target.checked,
                                invoice,
                              )
                            }
                            // className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900"
                            title={
                              invoice.isExported
                                ? "This invoice is exported. Downloads only."
                                : ""
                            }
                          />
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900">
                          <div
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {invoice.invoiceNumber || "N/A"}
                          </div>
                        </td>
                        {/* <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900">
                          <div
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {invoice.workOrder || "N/A"}
                          </div>
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900">
                          <div
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {invoice.invoiceTimesheetLines?.[0]?.vendor ||
                              "N/A"}
                          </div>
                        </td> */}
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900">
                          {formatDate(invoice.invoiceDate)}
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal text-right whitespace-nowrap border-gray-300 text-gray-900">
                          {formatCurrency(
                            invoice.invoiceAmount,
                            invoice.currency,
                          )}
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900">
                          {invoice.currency || "USD"}
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900">
                          {formatDate(invoice.createdAt)}
                        </td>
                        <td className="px-2 py-1 text-xs border-r border-b flex items-center justify-center font-normal border-gray-300 text-gray-900">
                          <button
                            onClick={() => handlePreview(invoice)}
                            style={{
                              backgroundColor: "#dbeafe",
                              color: "#1e40af",
                              padding: "4px 12px",
                              borderRadius: "6px",
                              border: "none",
                              fontSize: "10px",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Eye style={{ width: "14px", height: "14px" }} />
                            Preview
                          </button>
                        </td>
                        {/* Conditional correction column */}
                        {/* {userRole === "admin" && (
                          <td className="px-2 py-1 text-xs border-r border-b text-center font-normal border-gray-300 text-gray-900">
                            {invoice.isExported && (
                              <button
                                onClick={() => handleUnexport(invoice)}
                                data-open-invoice={
                                  invoice.invoiceId || invoice.id
                                }
                                style={{
                                  backgroundColor: "#fed7aa",
                                  color: "#c2410c",
                                  padding: "4px 12px",
                                  borderRadius: "6px",
                                  border: "none",
                                  fontSize: "10px",
                                  fontWeight: "500",
                                  cursor: "pointer",
                                }}
                              >
                                OPEN
                              </button>
                            )}
                          </td>
                        )} */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewModalVisible && (
        <div className="fixed inset-0 pt-15 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Invoice Preview
              </h2>
              <button
                onClick={() => setPreviewModalVisible(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <InvoiceViewer
                data={previewData}
                setInvoiceModalVisible={setPreviewModalVisible}
              />
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
