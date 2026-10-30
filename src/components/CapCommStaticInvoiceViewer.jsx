// import React, { useRef, useState } from "react";
// import logoImg from "../assets/CapComm_Logo_v2_nobk.png";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// const CapCommStaticInvoiceViewer = () => {
//   const [downloading, setDownloading] = useState(false);
//   const invoiceRef = useRef(null);

//   // Static invoice sample data matching the CapComm layout
//   const staticInvoice = {
//     invoiceId: "1096",
//     venderName: "Capital Communications LLC.",
//     period: "10/25/2026",
//     dueDate: "11/24/2026",
//     terms: "Net 30",
//     po_Number: "1825575",
//     po_rlse_Number: "01",
//     buyer: "RJM",
//     currency: "USD",
//     totalAmount: 7687.5,
//     title: "Velociti:1002-Abilene (TX)",
//     billTo: `Velociti
// 4780 NW 41st St. STE 500
// Riverside, MO 64150
// United States`,
//     remitTo: `Velociti
// 4780 NW 41st St. STE 500
// Riverside, MO 64150
// United States`,
//     lineItems: [
//       {
//         plc: "Andres Rivas Hours",
//         description: "[October 19 - October 23] V-Andres Rivas (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//       {
//         plc: "Sandy Laya Hours",
//         description: "[October 19 - October 23] Sandy Laya (TX)",
//         hours: 51.25,
//         rate: 75.0,
//         amount: 3843.75,
//         vendor: "Velociti",
//       },
//     ],
//   };

//   const handleDownloadPdf = async () => {
//     if (!invoiceRef.current) return;
//     setDownloading(true);

//     try {
//       const element = invoiceRef.current;

//       // Temporarily expand element styling for clean snapshot capture
//       const originalStyles = {
//         width: element.style.width,
//         position: element.style.position,
//       };
//       element.style.width = "800px";
//       element.style.position = "relative";

//       const canvas = await html2canvas(element, {
//         scale: 2,
//         useCORS: true,
//         allowTaint: true,
//         backgroundColor: "#ffffff",
//       });

//       // Restore styles
//       element.style.width = originalStyles.width;
//       element.style.position = originalStyles.position;

//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = pdf.internal.pageSize.getHeight();

//       const imgData = canvas.toDataURL("image/png", 1.0);
//       const imgProps = pdf.getImageProperties(imgData);
//       const imgHeightMM = (imgProps.height * pdfWidth) / imgProps.width;

//       let heightLeft = imgHeightMM;
//       let position = 0;

//       pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeightMM);
//       heightLeft -= pdfHeight;

//       while (heightLeft >= 0) {
//         position = heightLeft - imgHeightMM;
//         pdf.addPage();
//         pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeightMM);
//         heightLeft -= pdfHeight;
//       }

//       pdf.save(`CapComm_Invoice_${staticInvoice.invoiceId}.pdf`);
//     } catch (error) {
//       console.error("PDF generation failed:", error);
//     } finally {
//       setDownloading(false);
//     }
//   };

//   const containerStyle = {
//     maxWidth: "800px",
//     margin: "20px auto",
//     padding: "32px",
//     border: "1px solid #e5e7eb",
//     borderRadius: "8px",
//     fontFamily: "Inter, sans-serif",
//     fontSize: "13px",
//     color: "#111827",
//     backgroundColor: "#fff",
//     boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
//   };

//   return (
//     <div
//       style={{
//         backgroundColor: "#f3f4f6",
//         padding: "20px",
//         minHeight: "100vh",
//       }}
//     >
//       {/* Top Action Bar */}
//       <div
//         style={{
//           maxWidth: "800px",
//           margin: "0 auto 16px auto",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <h3 style={{ margin: 0, fontSize: "16px", color: "#374151" }}>
//           CapComm Static Invoice Preview
//         </h3>
//         <button
//           onClick={handleDownloadPdf}
//           disabled={downloading}
//           style={{
//             padding: "8px 16px",
//             backgroundColor: downloading ? "#9ca3af" : "#2563eb",
//             color: "#fff",
//             fontWeight: "500",
//             borderRadius: "6px",
//             cursor: downloading ? "not-allowed" : "pointer",
//             border: "none",
//           }}
//         >
//           {downloading ? "Generating PDF..." : "Download PDF"}
//         </button>
//       </div>

//       {/* Invoice Template Document */}
//       <div ref={invoiceRef} style={containerStyle}>
//         {/* Header */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-start",
//             marginBottom: "24px",
//             borderBottom: "1px solid #e5e7eb",
//             paddingBottom: "20px",
//           }}
//         >
//           <div>
//             <h2
//               style={{
//                 color: "#0047ab",
//                 fontSize: "22px",
//                 fontWeight: "700",
//                 margin: "0 0 4px 0",
//               }}
//             >
//               INVOICE
//             </h2>
//             <div style={{ fontWeight: "600", color: "#374151" }}>
//               {staticInvoice.venderName}
//             </div>
//             <div
//               style={{ color: "#6b7280", fontSize: "12px", marginTop: "2px" }}
//             >
//               14600 Flint Lee Rd Unit E<br />
//               CHANTILLY, VA 20151
//             </div>
//             <div
//               style={{ color: "#4b5563", fontSize: "12px", marginTop: "8px" }}
//             >
//               <div>apalma@capcomm.tech</div>
//               <div>+1 (703) 309-3832</div>
//               <div>https://www.capcomm.tech</div>
//             </div>
//           </div>

//           <div style={{ textAlign: "right" }}>
//             <img
//               src={logoImg}
//               alt="CapComm Logo"
//               style={{
//                 height: "50px",
//                 objectFit: "contain",
//                 marginBottom: "8px",
//               }}
//             />
//           </div>
//         </div>

//         {/* Address & Meta Info Box */}
//         <div
//           style={{
//             backgroundColor: "#f4f8fb",
//             border: "1px solid #e2e8f0",
//             borderRadius: "6px",
//             padding: "16px 20px",
//             marginBottom: "24px",
//           }}
//         >
//           <div
//             style={{
//               color: "#0047ab",
//               fontWeight: "600",
//               fontSize: "14px",
//               marginBottom: "16px",
//             }}
//           >
//             {staticInvoice.title}
//           </div>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "20px",
//               marginBottom: "20px",
//             }}
//           >
//             <div>
//               <div
//                 style={{
//                   fontWeight: "700",
//                   color: "#374151",
//                   marginBottom: "4px",
//                 }}
//               >
//                 Bill to
//               </div>
//               <div
//                 style={{
//                   color: "#4b5563",
//                   whiteSpace: "pre-line",
//                   lineHeight: "1.4",
//                 }}
//               >
//                 {staticInvoice.billTo}
//               </div>
//             </div>
//             <div>
//               <div
//                 style={{
//                   fontWeight: "700",
//                   color: "#374151",
//                   marginBottom: "4px",
//                 }}
//               >
//                 Ship to
//               </div>
//               <div
//                 style={{
//                   color: "#4b5563",
//                   whiteSpace: "pre-line",
//                   lineHeight: "1.4",
//                 }}
//               >
//                 {staticInvoice.remitTo}
//               </div>
//             </div>
//           </div>

//           <div
//             style={{
//               borderTop: "1px dashed #cbd5e1",
//               paddingTop: "12px",
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "20px",
//               fontSize: "12px",
//             }}
//           >
//             <div>
//               <div style={{ marginBottom: "4px" }}>
//                 <strong>Invoice details</strong>
//               </div>
//               <div style={{ color: "#4b5563" }}>
//                 <div>Invoice no.: {staticInvoice.invoiceId}</div>
//                 <div>Terms: {staticInvoice.terms}</div>
//                 <div>Invoice date: {staticInvoice.period}</div>
//                 <div>Due date: {staticInvoice.dueDate}</div>
//               </div>
//             </div>
//             <div>
//               <div style={{ marginBottom: "4px" }}>
//                 <strong>PO & Sales Info</strong>
//               </div>
//               <div style={{ color: "#4b5563" }}>
//                 <div>PO Number: {staticInvoice.po_Number}</div>
//                 <div>Sales Person: {staticInvoice.buyer}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Products & Services Table */}
//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//             marginBottom: "20px",
//             fontSize: "12px",
//           }}
//         >
//           <thead>
//             <tr
//               style={{
//                 backgroundColor: "#f9fafb",
//                 borderBottom: "2px solid #e5e7eb",
//               }}
//             >
//               <th style={{ padding: "8px", textAlign: "left", width: "40px" }}>
//                 #
//               </th>
//               <th style={{ padding: "8px", textAlign: "left" }}>
//                 Product or service
//               </th>
//               <th style={{ padding: "8px", textAlign: "left" }}>Description</th>
//               <th style={{ padding: "8px", textAlign: "right" }}>Qty</th>
//               <th style={{ padding: "8px", textAlign: "right" }}>Rate</th>
//               <th style={{ padding: "8px", textAlign: "right" }}>Amount</th>
//             </tr>
//           </thead>
//           <tbody>
//             {staticInvoice.lineItems.map((item, idx) => (
//               <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
//                 <td
//                   style={{
//                     padding: "10px 8px",
//                     color: "#6b7280",
//                     verticalAlign: "top",
//                   }}
//                 >
//                   {idx + 1}.
//                 </td>
//                 <td
//                   style={{
//                     padding: "10px 8px",
//                     fontWeight: "600",
//                     verticalAlign: "top",
//                   }}
//                 >
//                   {item.plc}
//                 </td>
//                 <td
//                   style={{
//                     padding: "10px 8px",
//                     color: "#4b5563",
//                     verticalAlign: "top",
//                   }}
//                 >
//                   {item.description}
//                 </td>
//                 <td
//                   style={{
//                     padding: "10px 8px",
//                     textAlign: "right",
//                     verticalAlign: "top",
//                   }}
//                 >
//                   {item.hours.toFixed(2)}
//                 </td>
//                 <td
//                   style={{
//                     padding: "10px 8px",
//                     textAlign: "right",
//                     verticalAlign: "top",
//                   }}
//                 >
//                   ${item.rate.toFixed(2)}
//                 </td>
//                 <td
//                   style={{
//                     padding: "10px 8px",
//                     textAlign: "right",
//                     fontWeight: "600",
//                     verticalAlign: "top",
//                   }}
//                 >
//                   ${item.amount.toFixed(2)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Total Summary */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "flex-end",
//             marginTop: "16px",
//           }}
//         >
//           <div style={{ textAlign: "right", minWidth: "220px" }}>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 marginBottom: "8px",
//                 fontSize: "14px",
//                 fontWeight: "700",
//                 borderTop: "1px solid #e5e7eb",
//                 paddingTop: "8px",
//               }}
//             >
//               <span>Total Amount Due:</span>
//               <span style={{ color: "#0047ab" }}>
//                 ${staticInvoice.totalAmount.toFixed(2)}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CapCommStaticInvoiceViewer;

import React, { useRef, useState, useMemo, useEffect } from "react";
import logoImg from "../assets/CapComm_Logo_v2_nobk.png";
import jsPDF from "jspdf";
import axios from "axios";
import { Download, Receipt } from "lucide-react";
import { backendUrl } from "./config";
import { toast } from "react-toastify";

// Reusable Searchable Dropdown Component
const SearchableDropdown = ({
  label,
  items,
  selectedValues,
  onChange,
  isMulti = false,
  displayKey = "name",
  idKey = "id",
  disabled = false,
  placeholder = "Select...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const text =
        typeof item === "string" ? item : item[displayKey] || item.label || "";
      return text.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [items, searchTerm, displayKey]);

  const handleSelect = (item) => {
    const val = typeof item === "string" ? item : item[idKey] || item.label;
    if (isMulti) {
      if (selectedValues.includes(val)) {
        onChange(selectedValues.filter((v) => v !== val));
      } else {
        onChange([...selectedValues, val]);
      }
    } else {
      onChange(item);
      setIsOpen(false);
    }
  };

  const handleSelectAll = () => {
    if (!isMulti) return;
    const allVals = filteredItems.map((item) =>
      typeof item === "string" ? item : item[idKey] || item.label,
    );
    if (selectedValues.length === allVals.length) {
      onChange([]);
    } else {
      onChange(allVals);
    }
  };

  const getButtonText = () => {
    if (isMulti) {
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.length === items.length)
        return `All ${label}s Selected (${items.length})`;
      return `${selectedValues.length} ${label}(s) Selected`;
    } else {
      if (!selectedValues) return placeholder;
      return typeof selectedValues === "string"
        ? selectedValues
        : selectedValues[displayKey] || selectedValues.label;
    }
  };

  return (
    <div className="relative space-y-1.5" ref={dropdownRef}>
      <label className="block text-xs font-bold text-slate-600  tracking-wider">
        {label}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium border rounded-lg shadow-sm transition ${
          disabled
            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        }`}
      >
        <span className="truncate">{getButtonText()}</span>
        {!disabled && (
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2 border-b border-slate-200 bg-slate-50">
            <input
              type="text"
              placeholder="Type ID or Name to Filter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          {isMulti && filteredItems.length > 0 && (
            <div className="px-3 py-1.5 bg-slate-100 border-b border-slate-200 flex justify-between items-center text-[11px]">
              <span className="font-semibold text-slate-600">
                Showing {filteredItems.length} items
              </span>
              <button
                type="button"
                onClick={handleSelectAll}
                className="font-bold text-blue-600 hover:underline"
              >
                {selectedValues.length === filteredItems.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
          )}

          <div className="max-h-56 overflow-y-auto p-1 divide-y divide-slate-100">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, idx) => {
                const val =
                  typeof item === "string" ? item : item[idKey] || item.label;
                const displayText =
                  typeof item === "string"
                    ? item
                    : item[displayKey] || item.label;
                const isSelected = isMulti
                  ? selectedValues.includes(val)
                  : selectedValues === item || selectedValues?.[idKey] === val;

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelect(item)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs cursor-pointer rounded transition ${
                      isSelected
                        ? "bg-blue-50 text-blue-900 font-semibold"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    {isMulti && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 pointer-events-none"
                      />
                    )}
                    <span className="truncate">{displayText}</span>
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-xs text-slate-400 italic">
                No matches found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CapCommInteractiveInvoiceBuilder = () => {
  const invoiceRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  // --- API State ---
  const [customersList, setCustomersList] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [periodsList, setPeriodsList] = useState([]);
  const [loadingPeriods, setLoadingPeriods] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  const [projectsList, setProjectsList] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);

  // Subcontractor Timesheet API data
  const [rawSubkLines, setRawSubkLines] = useState([]);
  const [selectedLineIds, setSelectedLineIds] = useState([]);
  const [loadingSubk, setLoadingSubk] = useState(false);
  const [linesFetched, setLinesFetched] = useState(false);

  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [activeLineItems, setActiveLineItems] = useState([]);

  // --- 1. Fetch Customers ---
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoadingCustomers(true);
      try {
        const response = await axios.get(
          `${backendUrl}/api/Customer/GetAllWithAddress`,
        );
        if (response.data && Array.isArray(response.data)) {
          const mappedCustomers = response.data.map((c) => ({
            id: c.custId || c.id,
            name: c.custName || c.name || c.custId,
            defaultRateType: "Bill Rate",
            defaultTerms: "Net 30",
            billTo:
              c.billToAddress || c.address || `${c.custId}\nUnited States`,
            shipTo:
              c.shipToAddress || c.address || `${c.custId}\nUnited States`,
          }));
          setCustomersList(mappedCustomers);
          if (mappedCustomers.length > 0)
            setSelectedCustomer(mappedCustomers[0]);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

  // --- 2. Fetch Timesheet Periods ---
  useEffect(() => {
    const fetchTimesheetPeriods = async () => {
      setLoadingPeriods(true);
      const today = new Date();
      const currentYear = today.getFullYear();
      const todayStr = today.toISOString().split("T")[0];

      try {
        const response = await axios.get(
          `${backendUrl}/api/TimesheetSchedule/id/1?year=${currentYear}`,
        );

        if (response.data && response.data.periods) {
          const mappedPeriods = response.data.periods.map((p) => ({
            periodId: p.periodId,
            periodNumber: p.periodNumber,
            startDate: p.periodStartDate,
            endDate: p.periodEndDate,
            isOpen: p.isOpen,
            label: `${p.periodStartDate} to ${p.periodEndDate} (Period ${p.periodNumber}${p.isOpen ? " - Active" : ""})`,
          }));

          const allOption = {
            periodId: "",
            periodNumber: null,
            startDate: "",
            endDate: "",
            isOpen: false,
            label: "All Periods", // Or just "All"
          };

          // setPeriodsList(mappedPeriods);
          // setSelectedPeriod(null);
          setPeriodsList([allOption, ...mappedPeriods]);
          setSelectedPeriod(allOption);
          // const currentPeriod = mappedPeriods.find(
          //   (p) => todayStr >= p.startDate && todayStr <= p.endDate,
          // );

          // if (currentPeriod) {
          //   setSelectedPeriod(currenulltPeriod);
          // } else if (mappedPeriods.length > 0) {
          //   setSelectedPeriod(
          //     mappedPeriods.find((p) => p.isOpen) || mappedPeriods[0],
          //   );
          // }
        }
      } catch (error) {
        console.error("Error fetching schedule periods:", error);
      } finally {
        setLoadingPeriods(false);
      }
    };
    fetchTimesheetPeriods();
  }, []);

  // --- 3. Fetch Projects by Customer ID ---
  useEffect(() => {
    if (!selectedCustomer || !selectedCustomer.id) return;

    const fetchProjectsByCustomer = async () => {
      setLoadingProjects(true);
      try {
        const encodedCustId = encodeURIComponent(selectedCustomer.id);
        const response = await axios.get(
          `${backendUrl}/api/Customer/GetProjectById?CustId=${encodedCustId}`,
        );
        if (response.data && Array.isArray(response.data)) {
          const mappedProjects = response.data.map((p) => ({
            id: p.projId,
            name: p.projName || p.projId,
            projectType: p.projTypeDc || "T&M",
          }));
          setProjectsList(mappedProjects);
          if (mappedProjects.length > 0) {
            setSelectedProjects([mappedProjects[0].id]);
          } else {
            setSelectedProjects([]);
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjectsByCustomer();
  }, [selectedCustomer]);

  // --- 4. Fetch Subcontractor Timesheet API ---
  const handleFetchTimesheetLines = async () => {
    // if (!selectedPeriod || !selectedPeriod.endDate) return;
    setLoadingSubk(true);
    try {
      const period = selectedPeriod?.endDate || "";
      const response = await axios.get(
        `${backendUrl}/api/SubkTimesheet/GetByApprover?status=PROCESSED&timesheetDate=${period}&isExported=true&isInvoiced=false`,
      );
      if (response.data && Array.isArray(response.data)) {
        setRawSubkLines(response.data);
        setSelectedLineIds(response.data.map((item) => item.lineNo));
      } else {
        setRawSubkLines([]);
        setSelectedLineIds([]);
      }
      setLinesFetched(true);
    } catch (error) {
      console.error("Error fetching subcontractor timesheets:", error);
      setRawSubkLines([]);
    } finally {
      setLoadingSubk(false);
    }
  };

  const handleToggleLineSelection = (lineNo) => {
    if (selectedLineIds.includes(lineNo)) {
      setSelectedLineIds(selectedLineIds.filter((id) => id !== lineNo));
    } else {
      setSelectedLineIds([...selectedLineIds, lineNo]);
    }
  };

  const handleToggleSelectAllLines = () => {
    if (selectedLineIds.length === rawSubkLines.length) {
      setSelectedLineIds([]);
    } else {
      setSelectedLineIds(rawSubkLines.map((item) => item.lineNo));
    }
  };

  // --- Computed Totals for Checked Rows in Table ---
  const tableSummary = useMemo(() => {
    const checkedRows = rawSubkLines.filter((item) =>
      selectedLineIds.includes(item.lineNo),
    );
    const totalHours = checkedRows.reduce(
      (acc, item) => acc + (item.hours || 0),
      0,
    );
    const totalAmt = checkedRows.reduce((acc, item) => {
      const hrs = item.hours || 0;
      const rate = item.payTypeAdjustedRate || 75.0;
      return acc + (item.billAmt || hrs * rate);
    }, 0);
    return { totalHours, totalAmt, count: checkedRows.length };
  }, [rawSubkLines, selectedLineIds]);

  // --- Unique Invoice No. & Due Date ---
  // --- Unique Invoice No. & Due Date ---
  const generatedInvoiceNo = useMemo(() => {
    if (!selectedCustomer) return `INV-${Date.now().toString().slice(-6)}`;

    const custCode = selectedCustomer.id.split(":")[0] || "CUST";

    // Handle "All Periods" or empty period gracefully
    const periodCode =
      selectedPeriod && selectedPeriod.periodNumber
        ? `P${selectedPeriod.periodNumber}`
        : selectedPeriod && selectedPeriod.periodId
          ? `P${selectedPeriod.periodId}`
          : "ALL";

    const projCode =
      selectedProjects.length > 0
        ? selectedProjects[0].split(":")[1]?.split("-")[0] || "GEN"
        : "GEN";

    // Append a short timestamp suffix (e.g., last 4 digits of current time) to ensure uniqueness
    const uniqueSuffix = Date.now().toString().slice(-4);

    return `${custCode}-${periodCode}-${projCode}-${uniqueSuffix}`;
  }, [selectedCustomer, selectedPeriod, selectedProjects]);

  const dueDate = useMemo(() => {
    if (!selectedCustomer) return invoiceDate;
    const date = new Date(invoiceDate);
    if (isNaN(date.getTime())) return invoiceDate;

    let daysToAdd = 30;
    const termsVal = selectedCustomer.defaultTerms;
    if (termsVal === "Due on receipt") daysToAdd = 0;
    else if (termsVal === "Net 15") daysToAdd = 15;
    else if (termsVal === "Net 30") daysToAdd = 30;
    else if (termsVal === "Net 60") daysToAdd = 60;

    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split("T")[0];
  }, [invoiceDate, selectedCustomer]);

  // --- Preview Invoice Action ---
  const handlePreviewInvoice = () => {
    const checkedRows = rawSubkLines.filter((item) =>
      selectedLineIds.includes(item.lineNo),
    );

    if (checkedRows.length > 0) {
      const mappedItems = checkedRows.map((item) => {
        // Sapulen ti umno a period iti periodsList a mangsakup iti timesheet_Date ti linia
        const matchingPeriod = periodsList.find(
          (p) =>
            p.startDate &&
            p.endDate &&
            item.timesheet_Date >= p.startDate &&
            item.timesheet_Date <= p.endDate,
        );

        const startDate = matchingPeriod
          ? matchingPeriod.startDate
          : selectedPeriod?.startDate || item.timesheet_Date || "";
        const endDate = matchingPeriod
          ? matchingPeriod.endDate
          : selectedPeriod?.endDate || item.timesheet_Date || "";

        return {
          id: item.lineNo,
          plc: item.plc || "Professional Services",
          description: `[${startDate} to ${endDate}] ${item.resource_Id || ""} (${item.payTypeName || "SR"})`,
          hours: item.hours || 0,
          rate: item.payTypeAdjustedRate || 75.0,
          amount:
            item.billAmt ||
            (item.hours || 0) * (item.payTypeAdjustedRate || 75.0),
        };
      });
      setActiveLineItems(mappedItems);
    } else {
      setActiveLineItems([]);
    }

    setIsPreviewVisible(true);
  };

  const totalAmount = useMemo(() => {
    return activeLineItems.reduce((acc, item) => acc + item.amount, 0);
  }, [activeLineItems]);

  const activeProjectNames = useMemo(() => {
    return (
      projectsList
        .filter((p) => selectedProjects.includes(p.id))
        .map((p) => p.name)
        .join(", ") || "No Project Selected"
    );
  }, [selectedProjects, projectsList]);

  // --- PDF Generator ---
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
        } catch (e) {
          console.log("error", e);
        }

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
        doc.text(item.hours.toFixed(2), 138, currentY + 4, { align: "right" });
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

  const handleConfirmInvoices = async () => {
    setIsLoading(true);

    try {
      const checkedRows = rawSubkLines.filter((item) =>
        selectedLineIds.includes(item.lineNo),
      );

      if (checkedRows.length === 0) {
        toast.warning("Please select at least one timesheet line to confirm.");
        setIsLoading(false);
        return;
      }

      const invoicePayload = {
        invoiceNumber: generatedInvoiceNo,
        invoiceDate: new Date(invoiceDate).toISOString(),
        invoiceAmount: totalAmount,
        venderName: checkedRows[0]?.createdBy || "Test Vendor",
        createdBy: "Test",
        updatedBy: "Test",
        billTo: selectedCustomer?.billTo || "",
        remitTo: selectedCustomer?.billTo || "",
        po_Number: checkedRows[0]?.poNumber || "1825575",
        po_rlse_Number: checkedRows[0]?.rlseNumber || "0",
        po_Start_End_Date: selectedPeriod
          ? `${selectedPeriod.startDate} to ${selectedPeriod.endDate}`
          : "",
        buyer: checkedRows[0]?.pm_User_Id || "RJM",
        terms: selectedCustomer?.defaultTerms || "Net 30",
        currency: "USD",
        invoiceTimesheetLines: activeLineItems.map((line) => ({
          poLineNumber: line.poLine,
          timesheetLineNo: line.line_No,
          mappedHours: line.hours,
          mappedAmount: line.amount,
          rate: line.rate,
          employee: line.employee,
          vendor: line.vendor,
          plc: line.plc,
          hours_Date: line.hours_Date,
          createdBy: "Test",
          updatedBy: "Test",
        })),
      };

      console.log("Submitting Invoice Payload:", invoicePayload);

      const response = await fetch(`${backendUrl}/api/Invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoicePayload),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to create invoice ${generatedInvoiceNo}: ${response.status}`,
        );
      }

      const responseData = await response.json();
      console.log("Invoice created successfully:", responseData);
      toast.success(`Invoice (${generatedInvoiceNo}) created successfully!`);

      setIsPreviewVisible(false);
      // if (onInvoiceSuccess) {
      //   onInvoiceSuccess([invoicePayload]);
      // }
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error(`Failed to create invoice: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

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

          {/* Configuration & Selection Panel */}
          <div className="w-full mx-auto bg-white p-2 rounded-xl shadow-md mb-2 border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
              <SearchableDropdown
                label={loadingCustomers ? "Customer (Loading...)" : "Customer"}
                items={customersList}
                selectedValues={selectedCustomer}
                onChange={setSelectedCustomer}
                isMulti={false}
                displayKey="name"
                idKey="id"
                disabled={loadingCustomers}
              />

              <SearchableDropdown
                label={
                  loadingPeriods
                    ? "Timesheet Period (Loading...)"
                    : "Timesheet Period"
                }
                items={periodsList}
                selectedValues={selectedPeriod}
                onChange={setSelectedPeriod}
                isMulti={false}
                displayKey="label"
                idKey="periodId"
                disabled={loadingPeriods}
              />

              <SearchableDropdown
                label={loadingProjects ? "Project (Loading...)" : "Project"}
                items={projectsList}
                selectedValues={selectedProjects}
                onChange={setSelectedProjects}
                isMulti={true}
                displayKey="name"
                idKey="id"
                disabled={loadingProjects || projectsList.length === 0}
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 tracking-wider">
                    Invoice No.
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={generatedInvoiceNo}
                    className="w-full px-3 py-2 text-xs font-semibold text-blue-800 bg-slate-50 border border-slate-300 rounded-lg shadow-inner cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 tracking-wider">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
                  />
                </div>
              </div>

              {/* Empty spacer div to align button on the right column */}
              <div className="hidden md:block"></div>

              {/* Fetch Button aligned to bottom right */}
              <div className="flex justify-end">
                <button
                  onClick={handleFetchTimesheetLines}
                  className="btn1 btn-blue"
                >
                  {loadingSubk ? "Fetching..." : "Fetch Timesheet Lines"}
                </button>
              </div>
            </div>
          </div>

          {/* Timesheet Lines Selection Table */}
          {linesFetched && (
            <div className="w-full mx-auto bg-white p-2 rounded-xl shadow-md mb-8 border border-slate-200">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-800">
                  Select Timesheet Lines to Preview ({selectedLineIds.length} of{" "}
                  {rawSubkLines.length} selected)
                </h3>
                <button
                  onClick={handlePreviewInvoice}
                  disabled={selectedLineIds.length === 0}
                  className={`btn1  ${
                    selectedLineIds.length === 0
                      ? "bg-slate-400 cursor-not-allowed"
                      : "btn-blue cursor-pointer"
                  }`}
                >
                  Preview Invoice
                </button>
              </div>

              <div className="overflow-x-auto max-h-80 overflow-y-auto border border-slate-200 rounded-lg mb-3">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-700 z-10">
                    <tr>
                      <th className="p-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            rawSubkLines.length > 0 &&
                            selectedLineIds.length === rawSubkLines.length
                          }
                          onChange={handleToggleSelectAllLines}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      {/* <th className="p-3 font-bold">Period Start to End</th>
                  <th className="p-3 font-bold">Proj ID</th>
                  <th className="p-3 font-bold">Emp ID</th>
                  <th className="p-3 font-bold">Customer</th> */}
                      <th className="p-3 font-bold">PLC</th>
                      <th className="p-3 font-bold">Pay Type</th>
                      <th className="p-3 font-bold text-right">Quantity</th>
                      <th className="p-3 font-bold text-right">Hour Rate</th>
                      <th className="p-3 font-bold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {rawSubkLines.length > 0 ? (
                      rawSubkLines.map((item) => {
                        const isChecked = selectedLineIds.includes(item.lineNo);
                        const qty = item.hours || 0;
                        const rate = item.payTypeAdjustedRate || 75.0;
                        const amt = item.billAmt || qty * rate;

                        return (
                          <tr
                            key={item.lineNo}
                            onClick={() =>
                              handleToggleLineSelection(item.lineNo)
                            }
                            className={`cursor-pointer transition hover:bg-blue-50/50 ${isChecked ? "bg-blue-50/30" : ""}`}
                          >
                            <td
                              className="p-3 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() =>
                                  handleToggleLineSelection(item.lineNo)
                                }
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                            </td>
                            {/* <td className="p-3 font-medium text-slate-600">
                          {selectedPeriod
                            ? `${selectedPeriod.startDate} to ${selectedPeriod.endDate}`
                            : "-"}
                        </td>
                        <td className="p-3 font-medium">{item.projId}</td>
                        <td className="p-3 font-mono">
                          {item.resource_Id || "V-Emp"}
                        </td>
                        <td className="p-3">
                          {item.customerId || selectedCustomer?.name}
                        </td> */}
                            <td className="p-3 font-semibold text-slate-800">
                              {item.plc}
                            </td>
                            <td className="p-3 font-semibold text-slate-800">
                              {item.payTypeDescription || item?.payTypeDesc}
                            </td>
                            <td className="p-3 text-right font-bold">
                              {qty.toFixed(2)}
                            </td>
                            <td className="p-3 text-right">
                              ${rate.toFixed(2)}
                            </td>
                            <td className="p-3 text-right font-bold text-blue-700">
                              ${amt.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
                          className="text-center py-6 text-slate-400 italic"
                        >
                          No timesheet lines found for this period date. Click
                          "Fetch Timesheet Lines".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Totals */}
              {rawSubkLines.length > 0 && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>Selected Summary ({tableSummary.count} lines):</span>
                  <div className="flex gap-6">
                    <span>
                      Total Quantity (Hours):{" "}
                      <span className="text-blue-700">
                        {tableSummary.totalHours.toFixed(2)}
                      </span>
                    </span>
                    <span>
                      Total Amount:{" "}
                      <span className="text-emerald-700">
                        ${tableSummary.totalAmt.toFixed(2)}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Invoice Template Document Popup Modal */}
          {isPreviewVisible && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 pt-20 overflow-y-auto animate-fadeIn">
              <div
                ref={invoiceRef}
                className="relative w-full max-w-[800px] max-h-[90vh] overflow-y-auto p-8 border border-slate-200 rounded-2xl font-sans text-xs text-slate-900 bg-white shadow-2xl"
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsPreviewVisible(false)}
                  className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold text-sm transition cursor-pointer"
                  title="Close Preview"
                >
                  ✕
                </button>

                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                  <div>
                    <h1 className="text-[#0047ab] text-2xl font-bold m-0 mb-1 tracking-tight">
                      Invoice Preview
                    </h1>
                    {/* <div className="text-slate-500 text-[11px]">
                  Ready for export
                </div> */}
                  </div>
                  <div>
                    <button
                      onClick={handleDownloadPdf}
                      disabled={downloading}
                      className={`px-4 py-2 text-white font-semibold text-xs rounded-lg transition shadow-sm ${
                        downloading
                          ? "bg-slate-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      }`}
                    >
                      {downloading ? "Generating PDF..." : "Download PDF"}
                    </button>{" "}
                    <button
                      onClick={handleConfirmInvoices}
                      disabled={isLoading}
                      className={`px-4 py-2 text-white font-semibold text-xs rounded-lg transition shadow-sm ${
                        isLoading
                          ? "bg-slate-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      }`}
                    >
                      {isLoading ? "Confirming..." : "Confirm Invoice"}
                    </button>
                  </div>
                </div>

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
                  </div>
                </div>

                <div className="bg-[#f4f8fb] border border-slate-200 rounded-lg p-5 mb-6">
                  <div className="text-[#0047ab] font-bold text-sm mb-3">
                    {activeProjectNames}
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="font-bold text-slate-700 mb-1 text-[11px]  tracking-wider">
                        Bill to
                      </div>
                      <div className="text-slate-600 whitespace-pre-line leading-relaxed text-[11px]">
                        {selectedCustomer?.billTo}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-700 mb-1 text-[11px]  tracking-wider">
                        Ship to
                      </div>
                      <div className="text-slate-600 whitespace-pre-line leading-relaxed text-[11px]">
                        {selectedCustomer?.shipTo}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-slate-300 pt-3 grid grid-cols-2 gap-6 text-[11px]">
                    <div>
                      <div className="mb-1 font-bold text-slate-700  tracking-wider">
                        Invoice details
                      </div>
                      <div className="text-slate-600 space-y-0.5">
                        <div>Invoice no.: {generatedInvoiceNo}</div>
                        <div className="font-semibold text-blue-700">
                          Terms: {selectedCustomer?.defaultTerms || "Net 30"}
                        </div>
                        <div>Invoice date: {invoiceDate}</div>
                        <div>Due date: {dueDate}</div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 font-bold text-slate-700  tracking-wider">
                        PO & Sales Info
                      </div>
                      <div className="text-slate-600 space-y-0.5">
                        <div>PO Number: 1825575</div>
                        <div>Sales Person: RJM</div>
                        <div>
                          Rate Mode:{" "}
                          {selectedCustomer?.defaultRateType || "Bill Rate"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <table className="w-full border-collapse mb-6 text-xs table-fixed">
                  <thead>
                    <tr className="bg-slate-50 border-b-2 border-slate-200 text-slate-700">
                      <th className="py-2.5 px-3 text-left w-[6%]">#</th>
                      <th className="py-2.5 px-3 text-left w-[24%]">
                        Product or service
                      </th>
                      <th className="py-2.5 px-3 text-left w-[36%]">
                        Description
                      </th>
                      <th className="py-2.5 px-3 text-right w-[11%]">Qty</th>
                      <th className="py-2.5 px-3 text-right w-[11%]">Rate</th>
                      <th className="py-2.5 px-3 text-right w-[12%]">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeLineItems.length > 0 ? (
                      activeLineItems.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-200">
                          <td className="py-3 px-3 text-slate-400 align-top">
                            {idx + 1}.
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-800 align-top break-words">
                            {item.plc}
                          </td>
                          <td className="py-3 px-3 text-slate-600 align-top break-words">
                            {item.description}
                          </td>
                          <td className="py-3 px-3 text-right align-top font-medium">
                            {item.hours.toFixed(2)}
                          </td>
                          <td className="py-3 px-3 text-right align-top">
                            ${item.rate.toFixed(2)}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900 align-top">
                            ${item.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-6 text-slate-400 italic"
                        >
                          No items selected for preview.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="flex justify-end mt-4">
                  <div className="text-right min-w-[240px] bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="flex justify-between text-xs font-bold text-slate-900">
                      <span>Total Amount Due:</span>
                      <span className="text-[#0047ab] text-sm">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CapCommInteractiveInvoiceBuilder;
