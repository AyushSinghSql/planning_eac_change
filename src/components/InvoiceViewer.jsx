// import React, { useRef, useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import logoImg from "../assets/CapComm_Logo_v2_nobk.png";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { backendUrl } from "./config";

// const InvoiceViewer = ({ data, setInvoiceModalVisible }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const invoiceRef = useRef();

//   if (!data || !Array.isArray(data) || data.length === 0) {
//     return <div>Loading...</div>;
//   }

//   const invoice = data[0];

//   // Group line items by PO Line for rendering with headers
//   const groupedByPoLine = invoice.lineItems.reduce((groups, item) => {
//     const key = item.poLine || "Other";
//     if (!groups[key]) groups[key] = [];
//     groups[key].push(item);
//     return groups;
//   }, {});

//   const handleDownloadPdf = async () => {
//     setIsLoading(true);

//     if (!invoiceRef.current || !invoice) {
//       console.warn("Invoice content or data is missing.");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Get current invoice data
//       const currentInvoice = invoice;

//       // Group and combine line items (same logic as downloadInvoices)
//       const groupAndCombineLineItems = (lineItems) => {
//         if (!lineItems || !Array.isArray(lineItems)) {
//           return [];
//         }

//         const groupedItems = {};

//         lineItems.forEach((item) => {
//           const plcKey = item.plc || "";
//           const vendorKey = item.vendor || "";
//           const employeeKey = item.employee || "";
//           const groupKey = `${plcKey}_${vendorKey}_${employeeKey}`;

//           if (groupedItems[groupKey]) {
//             const existingHours = parseFloat(groupedItems[groupKey].hours) || 0;
//             const newHours = parseFloat(item.hours) || 0;
//             groupedItems[groupKey].hours = existingHours + newHours;

//             const existingAmount =
//               parseFloat(groupedItems[groupKey].amount) || 0;
//             const newAmount = parseFloat(item.amount) || 0;
//             groupedItems[groupKey].amount = existingAmount + newAmount;
//           } else {
//             groupedItems[groupKey] = {
//               poLine: item.poLine || " ",
//               plc: item.plc || " ",
//               vendor: item.vendor || " ",
//               employee: item.employee || " ",
//               hours: parseFloat(item.hours) || 0,
//               rate: item.rate || 0,
//               amount: parseFloat(item.amount) || 0,
//               line_No: item.line_No || " ",
//             };
//           }
//         });

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
//         currentInvoice.lineItems || [],
//       );

//       // Recalculate total amount based on combined line items
//       const newTotalAmount = combinedLineItems.reduce((sum, item) => {
//         return sum + (parseFloat(item.amount) || 0);
//       }, 0);

//       // Transform data with combined line items (same structure as downloadInvoices)
//       const transformedData = [
//         {
//           invoiceId: currentInvoice.invoiceId || " ",
//           invoiceDate:
//             currentInvoice.period || currentInvoice.invoiceDate || " ",
//           currency: currentInvoice.currency || " ",
//           totalAmount: Number(newTotalAmount.toFixed(2)),
//           lineItems: combinedLineItems,
//           billTo: currentInvoice.billTo || " ",
//           buyer: currentInvoice.buyer || " ",
//           purchaseOrderId:
//             currentInvoice.po_Number || currentInvoice.purchaseOrderId || " ",
//           releaseNumber:
//             currentInvoice.po_rlse_Number ||
//             currentInvoice.releaseNumber ||
//             " ",
//           poStartEndDate:
//             currentInvoice.po_Start_End_Date ||
//             currentInvoice.poStartEndDate ||
//             " ",
//           terms: currentInvoice.terms || " ",
//           amountDue: Number(newTotalAmount.toFixed(2)),
//           period: currentInvoice.period || " ",
//           po_Number: currentInvoice.po_Number || " ",
//           po_rlse_Number: currentInvoice.po_rlse_Number || " ",
//           po_Start_End_Date: currentInvoice.po_Start_End_Date || " ",
//           venderName: currentInvoice.venderName || "",
//         },
//       ];

//       // Create temporary container with same styling as downloadInvoices
//       const tempContainer = document.createElement("div");
//       tempContainer.style.position = "absolute";
//       tempContainer.style.left = "-9999px";
//       tempContainer.style.top = "0";
//       tempContainer.style.width = "210mm";
//       tempContainer.style.backgroundColor = "white";
//       tempContainer.style.padding = "14mm";
//       tempContainer.style.margin = "0";
//       tempContainer.style.boxSizing = "border-box";
//       tempContainer.style.fontFamily = "Arial, sans-serif";
//       tempContainer.style.fontSize = "12px";
//       tempContainer.style.lineHeight = "1.4";
//       tempContainer.style.color = "#000000";
//       document.body.appendChild(tempContainer);

//       // Create temporary React root and render InvoiceViewer
//       const ReactDOM = (await import("react-dom/client")).default;
//       const React = (await import("react")).default;
//       const { default: InvoiceViewer } = await import("./InvoiceViewer");

//       const root = ReactDOM.createRoot(tempContainer);

//       await new Promise((resolve) => {
//         root.render(
//           React.createElement(InvoiceViewer, {
//             data: transformedData,
//             setInvoiceModalVisible: () => {},
//           }),
//         );
//         setTimeout(resolve, 3000);
//       });

//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       const input =
//         tempContainer.querySelector(
//           'div[style*="max-width: 768px"], .invoice-content, .invoice-viewer',
//         ) ||
//         tempContainer.firstElementChild ||
//         tempContainer;

//       if (!input) {
//         throw new Error("Invoice content not found");
//       }

//       // Ensure content is visible
//       input.style.display = "block";
//       input.style.visibility = "visible";
//       input.style.opacity = "1";

//       // Initialize PDF with same settings as downloadInvoices
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = pdf.internal.pageSize.getHeight();
//       const margin = 10;
//       const bottomMargin = 31.5; // space for footer
//       const usableWidth = pdfWidth - 2 * margin;
//       // const usableHeight = pdfHeight - 2 * margin;
//       const usableHeight = pdfHeight - margin - bottomMargin;

//       // Capture full content first with same settings as downloadInvoices
//       const fullCanvas = await html2canvas(input, {
//         scale: 1.5,
//         useCORS: true,
//         allowTaint: true,
//         backgroundColor: "#ffffff",
//         scrollX: 0,
//         scrollY: 0,
//         width: input.scrollWidth || input.clientWidth,
//         height: input.scrollHeight || input.clientHeight,
//         windowWidth: 1200,
//         logging: false,
//       });

//       if (fullCanvas.width === 0 || fullCanvas.height === 0) {
//         throw new Error("Canvas has zero dimensions");
//       }

//       const fullImgData = fullCanvas.toDataURL("image/png", 0.98);

//       // Calculate scaling
//       const imgProps = pdf.getImageProperties(fullImgData);
//       const scale = usableWidth / imgProps.width;
//       const scaledHeight = imgProps.height * scale;

//       // Calculate pages needed
//       const pageHeight = usableHeight;

//       // Smart page breaking - detect table rows and avoid cutting them
//       let currentY = 0;
//       let pageNumber = 0;

//       // Detect table rows by looking for horizontal patterns in the content
//       const detectTableRows = () => {
//         const rows = [];
//         const tableElements = input.querySelectorAll(
//           'tr, .table-row, [class*="row"]',
//         );

//         if (tableElements.length > 0) {
//           tableElements.forEach((row) => {
//             const rect = row.getBoundingClientRect();
//             const inputRect = input.getBoundingClientRect();
//             const relativeTop = rect.top - inputRect.top + input.scrollTop;
//             const relativeBottom = relativeTop + rect.height;

//             rows.push({
//               top: relativeTop * scale,
//               bottom: relativeBottom * scale,
//               height: rect.height * scale,
//             });
//           });
//         }

//         return rows.sort((a, b) => a.top - b.top);
//       };

//       const tableRows = detectTableRows();

//       while (currentY < scaledHeight && pageNumber < 50) {
//         // Safety limit
//         if (pageNumber > 0) {
//           pdf.addPage();
//         }

//         // let nextY = currentY + pageHeight;
//         let nextY = currentY + usableHeight;

//         // Check if we would cut through a table row
//         if (tableRows.length > 0) {
//           for (const row of tableRows) {
//             // If a row would be cut by the page break
//             if (row.top < nextY && row.bottom > nextY) {
//               // If the row can fit on current page, adjust nextY to include it
//               if (row.bottom - currentY <= pageHeight) {
//                 nextY = row.bottom;
//               } else {
//                 // If row is too big for current page, move it to next page
//                 nextY = row.top;
//               }
//               break;
//             }
//           }
//         }

//         // Ensure we don't go beyond content
//         const actualHeight = Math.min(
//           nextY - currentY,
//           scaledHeight - currentY,
//         );

//         if (actualHeight > 0) {
//           // Create canvas for this page section
//           const pageCanvas = document.createElement("canvas");
//           const pageCtx = pageCanvas.getContext("2d");

//           const sourceY = currentY / scale;
//           const sourceHeight = actualHeight / scale;

//           pageCanvas.width = fullCanvas.width;
//           pageCanvas.height = sourceHeight;

//           // Draw the section
//           pageCtx.drawImage(
//             fullCanvas,
//             0,
//             sourceY,
//             fullCanvas.width,
//             sourceHeight,
//             0,
//             0,
//             fullCanvas.width,
//             sourceHeight,
//           );

//           const pageImgData = pageCanvas.toDataURL("image/png", 0.98);

//           // Add to PDF
//           pdf.addImage(
//             pageImgData,
//             "PNG",
//             margin,
//             margin,
//             usableWidth,
//             actualHeight,
//           );
//         }

//         currentY = nextY;
//         pageNumber++;
//       }

//       // Fallback: if no pages were created, add the full image
//       if (pageNumber === 0) {
//         pdf.addImage(
//           fullImgData,
//           "PNG",
//           margin,
//           margin,
//           usableWidth,
//           Math.min(scaledHeight, pageHeight),
//         );
//       }

//       // Clean up
//       root.unmount();
//       document.body.removeChild(tempContainer);

//       // Save PDF with invoice number as filename
//       const filename = `${
//         currentInvoice.invoiceId || currentInvoice.invoiceNumber || "invoice"
//       }.pdf`;
//       pdf.save(filename);

//       setIsLoading(false);
//       setInvoiceModalVisible(false);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       alert(`Failed to generate PDF: ${error.message}`);
//       setIsLoading(false);
//     }
//   };

//   // catch (error) {
//   //   console.error("Error creating invoice or generating PDF:", error);
//   // }

//   const containerStyle = {
//     maxWidth: "768px",
//     margin: "auto",
//     padding: "20px",
//     border: "2px solid #d1d5db",
//     fontFamily: "monospace",
//     fontSize: "15px",
//     color: "#1a202c",
//     backgroundColor: "#fff",
//   };
//   const titleStyle = {
//     textAlign: "center",
//     marginBottom: "20px",
//     fontSize: "18px",
//     fontWeight: "600",
//   };
//   const infoStyle = {
//     marginBottom: "20px",
//     fontFamily: "monospace",
//     fontSize: "15px",
//     whiteSpace: "pre-line",
//   };
//   const boldTextStyle = {
//     fontWeight: 700,
//     fontSize: "12px",
//     // Ensure consistent font size for bold text
//   };
//   const flexBetweenStyle = {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     fontFamily: "monospace",
//     fontSize: "12px", // Reduced from 15px
//     whiteSpace: "nowrap",
//     paddingBottom: "20px",
//   };

//   const columnStyle = {
//     width: "49%",
//     whiteSpace: "pre-line",
//     fontSize: "12px", // Added explicit font size
//     lineHeight: "1.3", // Tighter line spacing
//   };

//   const addressBlockStyle = { marginBottom: "16px" };
//   const tableStyle = {
//     width: "100%",
//     borderCollapse: "collapse",
//     marginBottom: "20px",
//     fontSize: "10px", // Reduced from 12px to match the reference
//     fontFamily: "monospace",
//   };
//   const thStyle = {
//     border: "1px solid #d1d5db",
//     padding: "4px",
//     textAlign: "left",
//     backgroundColor: "#f3f4f6",
//   };
//   const thRightStyle = { ...thStyle, textAlign: "right" };
//   const tdStyle = {
//     border: "1px solid #d1d5db",
//     padding: "2px",
//     whiteSpace: "pre-line",
//   };

//   const tdRightStyle = { ...tdStyle, textAlign: "right" };
//   const totalAmountStyle = {
//     textAlign: "right",
//     fontWeight: "600",
//     fontSize: "16px",
//     marginBottom: "24px",
//   };
//   const buttonStyle = {
//     display: "block",
//     margin: "20px auto 0",
//     padding: "10px 20px",
//     backgroundColor: "#2563eb",
//     color: "#fff",
//     fontWeight: "500",
//     borderRadius: "4px",
//     cursor: "pointer",
//     border: "none",
//   };

//   const buttonContainerStyle = {
//     display: "flex",
//     justifyContent: "center",
//     gap: "10px", // space between buttons
//     marginTop: "20px",
//   };

//   const confirm = {
//     padding: "10px 20px",
//     backgroundColor: "#2563eb",
//     color: "#fff",
//     fontWeight: "500",
//     borderRadius: "4px",
//     cursor: "pointer",
//     border: "none",
//   };

//   const cancel = {
//     padding: "10px 20px",
//     backgroundColor: "#eb370fff",
//     color: "#fff",
//     fontWeight: "500",
//     borderRadius: "4px",
//     cursor: "pointer",
//     border: "none",
//   };

//   // const enhancedTitleStyle = {
//   //   color: "#1e40af",
//   //   fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
//   //   fontSize: "1.5rem",
//   //   fontWeight: "700",
//   //   letterSpacing: "0.05em",
//   //   textAlign: "center",
//   //   textShadow: "0 2px 4px rgba(30, 64, 175, 0.1)",
//   // };

//   const headerContainerStyle = {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between", // Changed from flex-start
//     marginBottom: "20px",
//     position: "relative",
//   };

//   const logoStyle = {
//     height: "60px",
//     objectFit: "contain",
//     flex: "0 0 auto", // Don't grow or shrink
//   };

//   const companyTitleStyle = {
//     color: "#0f20e0ff",
//     fontFamily: '"Times New Roman", Times, serif', // Changed to Times New Roman with fallbacks
//     fontSize: "14px",
//     fontWeight: "700",
//     letterSpacing: "0.02em",
//     margin: "0",
//     textAlign: "center",
//     position: "absolute",
//     left: "50%",
//     transform: "translateX(-50%)",
//     width: "100%",
//   };

//   // Add an invisible spacer to balance the logo
//   const spacerStyle = {
//     width: "60px", // Same width as logo
//     height: "60px",
//   };

//   const formatAddress = (addressString) => {
//     if (!addressString) return "";

//     // Split on comma or 2+ consecutive spaces using regex
//     const parts = addressString.split(/[,]|\s{2,}/);

//     // Clean up each part (remove extra whitespace) and filter out empty parts
//     const formattedLines = parts
//       .map((part) => part.trim())
//       .filter((part) => part.length > 0);

//     // Join with newlines
//     return formattedLines.join("\n");
//   };

//   return (
//     <>
//       <div ref={invoiceRef} style={containerStyle}>
//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//         />

//         <div style={headerContainerStyle}>
//           <img src={logoImg} alt="Company Logo" style={logoStyle} />

//           <h1 style={companyTitleStyle}>{invoice.venderName || ""}</h1>
//           <div style={spacerStyle}></div>
//         </div>
//         {/* <h1 style={titleStyle} className="font-bold">REVOLVE</h1> */}

//         {/* Two-column information block */}

//         <div style={flexBetweenStyle}>
//           <div style={columnStyle}>
//             <div>
//               <span style={boldTextStyle}>Invoice Number: </span>
//               {invoice.invoiceId || ""}
//             </div>
//             <div style={{ ...addressBlockStyle, marginTop: "16px" }}>
//               <span style={boldTextStyle}>Bill To: {"\n"}</span>
//               {invoice.billT ||
//                 `FedAxis

//               Ashburn, VA 20147 `}
//             </div>
//             <div>
//               <span style={boldTextStyle}>Buyer: </span>
//               {invoice.buyer || " "}
//             </div>
//             <div style={{ marginTop: "16px" }}>
//               <span style={boldTextStyle}>Purchase Order ID: </span>
//               {invoice.po_Number || ""} Release Number{" "}
//               {invoice.po_rlse_Number || ""}
//             </div>
//             <div style={{ marginTop: "16px" }}>
//               <span style={boldTextStyle}> PO Start and End Date: </span>
//               {invoice.po_Start_End_Date || " "}
//             </div>
//           </div>

//           <div style={columnStyle}>
//             <div>
//               <span style={boldTextStyle}>Invoice Date: </span>
//               {invoice.period || " "}
//             </div>
//             <div>
//               <span style={boldTextStyle}>Billing Currency: </span>

//               {invoice.currency || "USD"}
//             </div>
//             <div style={{ ...addressBlockStyle, marginTop: "16px" }}>
//               <span style={boldTextStyle}>Remit To: {"\n"}</span>
//               {formatAddress(invoice.billTo) || ``}
//             </div>
//             <div>
//               <span style={boldTextStyle}>Terms: </span>
//               {invoice.terms || "PAYNPD"}
//             </div>
//             <div>
//               <span style={boldTextStyle}>Amount Due </span>$
//               {invoice.totalAmount?.toFixed(2) || "0.00"}
//             </div>
//           </div>
//         </div>

//         <table style={tableStyle}>
//           <thead>
//             <tr>
//               <th style={thStyle}>PO LINE</th>
//               <th
//                 style={{
//                   border: "1px solid #d1d5db",
//                   padding: "4px",
//                   textAlign: "left",
//                   backgroundColor: "#f3f4f6",
//                   borderRight: "none",
//                 }}
//               >
//                 PLC
//               </th>
//               <th style={thStyle}>Vendor Employee</th>
//               <th style={thRightStyle}>Current Hrs/Qty</th>
//               <th style={thRightStyle}>Rate</th>
//               <th style={thRightStyle}>Additional Amount</th>
//               <th style={thRightStyle}>Current Amount</th>
//               <th style={thRightStyle}>Cumulative Hrs/Qty</th>
//               <th style={thRightStyle}>Cumulative Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.entries(groupedByPoLine).map(([poLine, items]) => (
//               <React.Fragment key={poLine}>
//                 {items.map((item, index) => (
//                   <tr key={index}>
//                     {/* <td style={tdStyle}>{item.plc || ""}</td>
//                       <td style={tdStyle}>
//                         {[item.vendor, item.employee].filter(Boolean).join("\n")}
//                       </td> */}
//                     <td
//                       // colSpan={8}
//                       style={{
//                         border: "1px solid #d1d5db",
//                         padding: "4px",
//                         fontWeight: 700,
//                         fontSize: "12px",
//                         paddingBottom: "10px",
//                       }}
//                     >
//                       {poLine}
//                     </td>{" "}
//                     <td
//                       style={{
//                         border: "1px solid #d1d5db",
//                         padding: "4px",
//                         fontFamily: "monospace",
//                         fontSize: "12px",
//                         whiteSpace: "normal",
//                         wordBreak: "break-word",
//                         verticalAlign: "top",
//                       }}
//                       colSpan={2} // span across the two previous separate columns
//                     >
//                       <div>{item.plc}</div>
//                       <div
//                         style={{
//                           paddingLeft: "20px",
//                           marginTop: "2px",
//                         }}
//                       >
//                         <div>{item.employee}</div>
//                         {/* <div>{item.vendor}</div> */}
//                       </div>
//                     </td>
//                     <td style={tdRightStyle}>{item.hours.toFixed(2)}</td>
//                     <td style={tdRightStyle}>${item.rate.toFixed(2)}</td>
//                     <td style={tdRightStyle}>$0.00</td>
//                     <td style={tdRightStyle}>${item.amount.toFixed(2)}</td>
//                     <td style={tdRightStyle}>{item.hours.toFixed(2)}</td>
//                     <td style={tdRightStyle}>${item.amount.toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//         <div style={totalAmountStyle}>
//           Total Amount Due: ${invoice.totalAmount.toFixed(2)}
//         </div>
//       </div>

//       <div style={buttonContainerStyle}>
//         {/* {isLoading && <div>Loading, please wait...</div>} */}

//         <button
//           onClick={handleDownloadPdf}
//           style={confirm}
//           disabled={isLoading}
//         >
//           {isLoading ? "Downloading..." : "Download Invoice"}
//         </button>

//         <button onClick={() => setInvoiceModalVisible(false)} style={cancel}>
//           Close
//         </button>
//       </div>
//     </>
//   );
// };

// export default InvoiceViewer;

import React, { useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoImg from "../assets/image.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { backendUrl } from "./config";

const InvoiceViewer = ({ data, setInvoiceModalVisible, onInvoiceSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [downloadingIndex, setDownloadingIndex] = useState(null);
  const [invoicesCreated, setInvoicesCreated] = useState(new Set());
  const invoiceRefs = useRef([]);

  // Store original ungrouped data for API calls
  const originalInvoiceData = useRef(data);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        No invoice data available
      </div>
    );
  }

  // Helper function to generate PDF from DOM element
  const generatePdfForElement = async (element, filename) => {
    const originalStyles = {
      height: element.style.height,
      maxHeight: element.style.maxHeight,
      overflow: element.style.overflow,
      position: element.style.position,
      transform: element.style.transform,
      width: element.style.width,
      minHeight: element.style.minHeight,
    };

    element.style.height = "auto";
    element.style.maxHeight = "none";
    element.style.minHeight = "auto";
    element.style.overflow = "visible";
    element.style.position = "relative";
    element.style.transform = "none";
    element.style.width = "800px";

    const allChildren = element.querySelectorAll("*");
    const childrenOriginalStyles = [];

    allChildren.forEach((child, index) => {
      childrenOriginalStyles[index] = {
        height: child.style.height,
        maxHeight: child.style.maxHeight,
        overflow: child.style.overflow,
        minHeight: child.style.minHeight,
        width: child.style.width,
        maxWidth: child.style.maxWidth,
      };

      child.style.height = "auto";
      child.style.maxHeight = "none";
      child.style.minHeight = "auto";
      child.style.overflow = "visible";
    });

    const logoElements = element.querySelectorAll(
      'img, .logo, [class*="logo"], [id*="logo"]',
    );
    logoElements.forEach((logo) => {
      if (logo.tagName === "IMG") {
        logo.style.width = "120px";
        logo.style.height = "auto";
        logo.style.maxWidth = "120px";
        logo.style.maxHeight = "60px";
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 500));
    element.offsetHeight;

    const actualHeight = Math.max(
      element.scrollHeight,
      element.offsetHeight,
      element.clientHeight,
      element.getBoundingClientRect().height,
    );
    const actualWidth = Math.max(element.scrollWidth, element.offsetWidth, 800);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: actualWidth,
      height: actualHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: actualWidth,
      windowHeight: actualHeight,
      removeContainer: false,
      imageTimeout: 0,
    });

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const usableWidth = pdfWidth - 2 * margin;
    const usableHeight = pdfHeight - 2 * margin;

    const imgData = canvas.toDataURL("image/png", 1.0);
    const imgProps = pdf.getImageProperties(imgData);

    const imgWidthMM = (imgProps.width * 25.4) / (96 * 2);
    const imgHeightMM = (imgProps.height * 25.4) / (96 * 2);

    const scale = usableWidth / imgWidthMM;
    const scaledWidth = usableWidth;
    const scaledHeight = imgHeightMM * scale;

    let yOffset = 0;
    let pageCount = 0;

    while (yOffset < scaledHeight) {
      if (pageCount > 0) {
        pdf.addPage();
      }

      const remainingHeight = scaledHeight - yOffset;
      const heightForThisPage = Math.min(usableHeight, remainingHeight);

      const sourceY = ((yOffset / scale) * (96 * 2)) / 25.4;
      const sourceHeight = ((heightForThisPage / scale) * (96 * 2)) / 25.4;

      const pageCanvas = document.createElement("canvas");
      const pageCtx = pageCanvas.getContext("2d");
      pageCanvas.width = imgProps.width;
      pageCanvas.height = sourceHeight;

      pageCtx.drawImage(
        canvas,
        0,
        sourceY,
        imgProps.width,
        sourceHeight,
        0,
        0,
        imgProps.width,
        sourceHeight,
      );

      const pageImgData = pageCanvas.toDataURL("image/png", 1.0);
      pdf.addImage(
        pageImgData,
        "PNG",
        margin,
        margin,
        scaledWidth,
        heightForThisPage,
      );

      yOffset += heightForThisPage;
      pageCount++;

      if (pageCount > 50) break;
    }

    Object.assign(element.style, originalStyles);
    allChildren.forEach((child, index) => {
      if (childrenOriginalStyles[index]) {
        Object.assign(child.style, childrenOriginalStyles[index]);
      }
    });

    pdf.save(filename);
  };

  // Render individual invoice component matching CapComm style
  const renderSingleInvoice = (invoice, index) => {
    const isCreated = invoicesCreated.has(index);

    // Calculate due date based on terms or invoice date (+30 days default)
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
        return "";
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

    const dueDate = calculateDueDate(invoice.period, invoice.terms);

    return (
      <div
        key={`invoice-${index}`}
        className="max-w-[800px] mx-auto p-8 mb-8 border border-slate-200 rounded-xl font-sans text-xs text-slate-900 bg-white shadow-lg"
      >
        <div ref={(el) => (invoiceRefs.current[index] = el)}>
          {/* Header section with company info and logo */}
          <div className="flex justify-between items-start mb-6 border-b border-slate-200 pb-6">
            <div>
              <div className="font-bold text-slate-700">
                Capital Communications LLC.
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                14600 Flint Lee Rd Unit E<br />
                CHANTILLY, VA 20151
              </div>
              <div className="text-slate-600 text-[11px] mt-2 space-y-0.5">
                <div>apalma@capcomm.tech</div>
                <div>+1 (703) 309-3832</div>
              </div>
            </div>

            <div className="text-right">
              <img
                src={logoImg}
                alt="CapComm Logo"
                className="h-12 object-contain mb-2 ml-auto"
              />
              <div className="text-[11px] text-slate-500 font-medium">
                Invoice #{index + 1} of {data.length}
              </div>
            </div>
          </div>

          {/* Blue background metadata card */}
          <div className="bg-[#f4f8fb] border border-slate-200 rounded-lg p-5 mb-6">
            <div className="text-[#0047ab] font-bold text-sm mb-3">
              {invoice.billTo
                ? invoice.billTo.split("\n")[0]
                : "Project Details"}
            </div>

            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <div className="font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wider">
                  Bill to
                </div>
                <div className="text-slate-600 whitespace-pre-line leading-relaxed text-[11px]">
                  {invoice.billTo || "FedAxis\nAshburn, VA 20147"}
                </div>
              </div>
              <div>
                <div className="font-bold text-slate-700 mb-1 text-[11px] uppercase tracking-wider">
                  Ship to
                </div>
                <div className="text-slate-600 whitespace-pre-line leading-relaxed text-[11px]">
                  {invoice.billTo || "FedAxis\nAshburn, VA 20147"}
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-300 pt-3 grid grid-cols-2 gap-6 text-[11px]">
              <div>
                <div className="mb-1 font-bold text-slate-700 uppercase tracking-wider">
                  Invoice details
                </div>
                <div className="text-slate-600 space-y-0.5">
                  <div>Invoice no.: {invoice.invoiceId || "N/A"}</div>
                  <div className="font-semibold text-blue-700">
                    Terms: {invoice.terms || "Net 30"}
                  </div>
                  <div>Invoice date: {invoice.period || ""}</div>
                  <div>Due date: {dueDate}</div>
                </div>
              </div>
              <div>
                <div className="mb-1 font-bold text-slate-700 uppercase tracking-wider">
                  PO & Sales Info
                </div>
                <div className="text-slate-600 space-y-0.5">
                  <div>
                    PO Number: {invoice.po_Number || "0000"} (Rlse:{" "}
                    {invoice.po_rlse_Number || "0"})
                  </div>
                  <div>Sales Person: {invoice.buyer || "RJM"}</div>
                  <div>Rate Mode: Bill Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Table with Fixed Layout */}
          <table className="w-full border-collapse mb-6 text-xs table-fixed">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200 text-slate-700">
                <th className="py-2.5 px-3 text-left w-[6%]">#</th>
                <th className="py-2.5 px-3 text-left w-[26%]">
                  Product or service
                </th>
                <th className="py-2.5 px-3 text-left w-[36%]">Description</th>
                <th className="py-2.5 px-3 text-right w-[10%]">Qty</th>
                <th className="py-2.5 px-3 text-right w-[10%]">Rate</th>
                <th className="py-2.5 px-3 text-right w-[12%]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems && invoice.lineItems.length > 0 ? (
                invoice.lineItems.map((item, idx) => {
                  const descriptionText = `[${invoice.po_Start_End_Date || ""}] V-${invoice.venderName || ""} (${item.plc?.includes("75") ? "SR" : "SO"})`;
                  return (
                    <tr key={idx} className="border-b border-slate-200">
                      <td className="py-3 px-3 text-slate-400 align-top">
                        {idx + 1}.
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800 align-top break-words">
                        {item.plc}
                      </td>
                      <td className="py-3 px-3 text-slate-600 align-top break-words">
                        {descriptionText}
                      </td>
                      <td className="py-3 px-3 text-right align-top font-medium">
                        {item.hours?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-3 text-right align-top">
                        ${item.rate?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 align-top">
                        ${item.amount?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-6 text-slate-400 italic"
                  >
                    No line items available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Total Amount Due Box */}
          <div className="flex justify-end mt-4">
            <div className="text-right min-w-[240px] bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between text-xs font-bold text-slate-900">
                <span>Total Amount Due:</span>
                <span className="text-[#0047ab] text-sm">
                  ${invoice.totalAmount?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Download Button (Enabled after confirm) */}
        {/* <div className="text-center mt-6 pt-4 border-t border-slate-200">
          <button
            onClick={() => handleDownloadSinglePdf(invoice, index)}
            disabled={downloadingIndex === index || !isCreated}
            className={`px-4 py-2 font-semibold text-xs rounded-lg transition shadow-sm cursor-pointer ${
              downloadingIndex === index
                ? "bg-slate-400 text-white cursor-not-allowed"
                : !isCreated
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {downloadingIndex === index
              ? "Downloading PDF..."
              : !isCreated
                ? "Confirm Invoice First to Download"
                : `Download PDF for Invoice #${index + 1}`}
          </button>
        </div> */}
      </div>
    );
  };

  const handleDownloadSinglePdf = async (invoice, index) => {
    if (!invoicesCreated.has(index)) {
      toast.warning(
        `Please create Invoice ${index + 1} first by clicking "Confirm"`,
      );
      return;
    }

    setDownloadingIndex(index);
    if (!invoiceRefs.current[index]) {
      toast.error("Invoice content not found");
      setDownloadingIndex(null);
      return;
    }

    try {
      const element = invoiceRefs.current[index];
      await generatePdfForElement(
        element,
        `CapComm_Invoice_${invoice.invoiceId || index + 1}.pdf`,
      );
      toast.success(`Invoice #${index + 1} downloaded successfully`);
    } catch (error) {
      console.error(`Error downloading invoice ${index + 1}:`, error);
      toast.error(`Error downloading invoice ${index + 1}`);
    } finally {
      setDownloadingIndex(null);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div
        className="overflow-y-auto p-4 scrollbar-thin font-sans bg-slate-100"
        style={{ maxHeight: "75vh" }}
      >
        {/* Header summary banner */}
        <div className="max-w-[800px] mx-auto text-center font-bold text-xs mb-6 text-blue-900 bg-[#e5f3fb] border border-blue-200 p-3 rounded-lg shadow-sm">
          Invoice Preview - {data.length} Invoice{data.length > 1 ? "s" : ""}{" "}
          Found
        </div>

        {/* Render each invoice */}
        {data.map((invoice, index) => renderSingleInvoice(invoice, index))}
      </div>

      {/* Action Buttons Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white font-sans">
        <button
          onClick={() => setInvoiceModalVisible(false)}
          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg transition cursor-pointer"
        >
          Close
        </button>

        {/* <button
          onClick={handleConfirmInvoices}
          disabled={isLoading}
          className={`px-5 py-2 text-white font-semibold text-xs rounded-lg transition shadow-sm ${
            isLoading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
          }`}
        >
          {isLoading ? "Creating Invoices..." : "Confirm All Invoices"}
        </button> */}
      </div>
    </>
  );
};

export default InvoiceViewer;
