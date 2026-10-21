// import React, { useState, useEffect, useRef } from "react";
// import * as XLSX from "xlsx";
// import { backendUrl } from "../config";

// export default function JobCostLedger() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState("");
//   const fileInputRef = useRef(null);

//   // Fetch Job Cost Ledger data from API
//   const fetchJobCostLedger = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${backendUrl}/api/JobCostLedger`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const json = await response.json();
//       setData(json);
//     } catch (err) {
//       setError(err.message || "Failed to fetch Job Cost Ledger data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchJobCostLedger();
//   }, []);

//   const triggerStatusToast = (message) => {
//     setUploadStatus(message);
//     setTimeout(() => {
//       setUploadStatus("");
//     }, 5000);
//   };

//   // Trigger hidden file picker
//   const handleImportClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   // Handle file upload and post to import endpoint
//   const handleFileChange = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     setUploadStatus("Uploading...");
//     try {
//       const response = await fetch(`${backendUrl}/api/JobCostLedger/import`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`Import failed with status: ${response.status}`);
//       }

//       triggerStatusToast("Import successful!");
//       // Refresh list after successful upload
//       fetchJobCostLedger();
//     } catch (err) {
//       setUploadStatus(`Import failed: ${err.message}`);
//     } finally {
//       event.target.value = "";
//     }
//   };

//   // Export current table data to Excel
//   const handleExportExcel = () => {
//     if (!data || data.length === 0) return;

//     // Map data to clean column headers matching Job Cost Ledger schema
//     const exportData = data.map((item) => ({
//       Year: item.year,
//       "Project ID": item.projId,
//       "Project Name": item.projName?.trim() || "",
//       "Account ID": item.acctId,
//       "Org ID": item.orgId,
//       "Billing Level": item.billingLvl,
//       "Report Level": item.reportLvl,
//       "Project Type": item.projType,
//       "Prime Contract ID": item.primeCntrId || "",
//       "Subcontract ID": item.subctrId || "",
//       Amount: item.amount ?? 0,
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Job Cost Ledger");

//     XLSX.writeFile(
//       workbook,
//       `Job_Cost_Ledger_${new Date().toISOString().slice(0, 10)}.xlsx`,
//     );
//   };

//   // Helper for currency formatting
//   const formatCurrency = (val) => {
//     if (val === null || val === undefined) return "$0.00";
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 2,
//     }).format(val);
//   };

//   return (
//     <div className="bg-slate-50 min-h-screen">
//       {/* Header & Controls */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
//         <div>
//           {/* <h1 className="text-xl font-bold text-slate-800">Job Cost Ledger</h1> */}
//         </div>

//         <div className="flex items-center space-x-2">
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             className="hidden"
//             accept=".csv, .xlsx, .xls"
//           />
//           {/* Import Button  */}
//           <button
//             onClick={handleImportClick}
//             className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded text-xs transition"
//           >
//             {/* <svg
//               className="w-4 h-4"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLi
//                 necap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
//               />
//             </svg> */}
//             Import
//           </button>
//           {/* Export Button */}
//           <button
//             onClick={handleExportExcel}
//             disabled={data.length === 0}
//             className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded text-xs transition"
//           >
//             {/* <svg
//               className="w-4 h-4"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//               />
//             </svg> */}
//             Export
//           </button>
//           {/* Refresh Button */}
//           <button
//             onClick={fetchJobCostLedger}
//             className="px-3 py-1 bg-white border border-slate-300 text-slate-700 font-medium rounded text-xs hover:bg-slate-50 shadow-sm transition-colors"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Upload Notification Banner */}
//       {uploadStatus && (
//         <div
//           className={`mb-4 p-3 rounded-lg text-sm font-medium ${
//             uploadStatus.includes("successful")
//               ? "bg-emerald-100 text-emerald-800"
//               : "bg-amber-100 text-amber-800"
//           }`}
//         >
//           {uploadStatus}
//         </div>
//       )}

//       {/* Error Banner */}
//       {error && (
//         <div className="mb-4 p-4 rounded-lg bg-rose-100 text-rose-800 border border-rose-200 text-sm">
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       {/* Table Container with Dynamic Viewport Height & Sticky Header */}
//       <div className="bg-white shadow border border-slate-200 overflow-hidden rounded-lg">
//         {loading ? (
//           <div className="p-8 text-center text-slate-500 font-medium">
//             Loading Job Cost Ledger data...
//           </div>
//         ) : (
//           <div className="overflow-x-auto overflow-y-auto h-[calc(100vh-180px)]">
//             <table className="w-full text-left border-collapse">
//               <thead className="sticky top-0 z-10 bg-slate-100 shadow-sm">
//                 <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600 tracking-wider">
//                   <th className="py-3 px-4 bg-slate-100 text-center">Year</th>
//                   <th className="py-3 px-4 bg-slate-100">Project ID</th>
//                   <th className="py-3 px-4 bg-slate-100">Project Name</th>
//                   <th className="py-3 px-4 bg-slate-100 whitespace-nowrap">
//                     Account ID
//                   </th>
//                   <th className="py-3 px-4 text-center bg-slate-100 whitespace-nowrap">
//                     Org ID
//                   </th>
//                   <th className="py-3 px-4 text-center bg-slate-100">Type</th>
//                   <th className="py-3 px-4 bg-slate-100">Prime Cntr</th>
//                   <th className="py-3 px-4 bg-slate-100">Sub Cntr</th>
//                   <th className="py-3 px-4 text-right bg-slate-100">Amount</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-200 text-sm text-slate-700 font-mono">
//                 {data.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan="9"
//                       className="py-8 text-center text-slate-400 font-sans"
//                     >
//                       No records found.
//                     </td>
//                   </tr>
//                 ) : (
//                   data.map((item, idx) => (
//                     <tr
//                       key={item.id || item.projId || idx}
//                       className="hover:bg-slate-50 transition-colors"
//                     >
//                       <td className="py-3 px-4 text-center font-sans">
//                         {item.year}
//                       </td>
//                       <td className="py-3 px-4 font-semibold text-slate-900">
//                         {item.projId}
//                       </td>
//                       <td className="py-3 px-4 font-sans">
//                         {item.projName?.trim()}
//                       </td>
//                       <td className="py-3 px-4">{item.acctId}</td>
//                       <td className="py-3 px-4 text-center font-sans">
//                         {item.orgId}
//                       </td>
//                       <td className="py-3 px-4 text-center font-sans">
//                         {item.projType}
//                       </td>
//                       <td className="py-3 px-4">{item.primeCntrId || "-"}</td>
//                       <td className="py-3 px-4">{item.subctrId || "-"}</td>
//                       <td className="py-3 px-4 text-right font-semibold text-indigo-900">
//                         {formatCurrency(item.amount)}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { backendUrl } from "../config";

export default function JobCostLedger({ year = 2025 }) {
  const [selectedYear, setSelectedYear] = useState(year);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const fileInputRef = useRef(null);

  // Fetch Job Cost Ledger data from API with year parameter
  const fetchJobCostLedger = async (year) => {
    setLoading(true);
    setError(null);
    try {
      const targetYear = year || selectedYear;
      const response = await fetch(
        `${backendUrl}/api/JobCostLedger?fyCd=${targetYear}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      setError(err.message || "Failed to fetch Job Cost Ledger data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobCostLedger(selectedYear);
  }, [selectedYear]);

  // Year Navigation Handlers
  const handlePrevYear = () => setSelectedYear((prev) => prev - 1);
  const handleNextYear = () => setSelectedYear((prev) => prev + 1);
  const handleYearChange = (e) => setSelectedYear(Number(e.target.value));

  const triggerStatusToast = (message) => {
    setUploadStatus(message);
    setTimeout(() => {
      setUploadStatus("");
    }, 5000);
  };

  // Trigger hidden file picker
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file upload and post to import endpoint
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadStatus("Uploading...");
    try {
      const response = await fetch(
        `${backendUrl}/api/JobCostLedger/import?year=${selectedYear}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Import failed with status: ${response.status}`);
      }

      triggerStatusToast("Import successful!");
      // Refresh list after successful upload
      fetchJobCostLedger(selectedYear);
    } catch (err) {
      setUploadStatus(`Import failed: ${err.message}`);
    } finally {
      event.target.value = "";
    }
  };

  // Export current table data to Excel
  const handleExportExcel = () => {
    if (!data || data.length === 0) return;

    // Map data to clean column headers matching Job Cost Ledger schema
    const exportData = data.map((item) => ({
      Year: item.year,
      "Project ID": item.projId,
      "Project Name": item.projName?.trim() || "",
      "Account ID": item.acctId,
      "Org ID": item.orgId,
      "Billing Level": item.billingLvl,
      "Report Level": item.reportLvl,
      "Project Type": item.projType,
      "Prime Contract ID": item.primeCntrId || "",
      "Subcontract ID": item.subctrId || "",
      Amount: item.amount ?? 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Job Cost Ledger");

    XLSX.writeFile(
      workbook,
      `Job_Cost_Ledger_${selectedYear}_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  // Helper for currency formatting
  const formatCurrency = (val) => {
    if (val === null || val === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
        {/* Year Filter Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevYear}
            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 font-semibold text-xs transition"
          >
            &larr; Prev
          </button>
          <span className="font-bold text-xs text-slate-700">FY:</span>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="border border-slate-300 rounded px-2 py-1 font-bold text-xs bg-white text-slate-800 shadow-sm"
          >
            {Array.from({ length: 11 }, (_, i) => 2020 + i).map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
          <button
            onClick={handleNextYear}
            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 font-semibold text-xs transition"
          >
            Next &rarr;
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".csv, .xlsx, .xls"
          />
          {/* Import Button */}
          <button
            onClick={handleImportClick}
            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded text-xs transition"
          >
            Import
          </button>
          {/* Export Button */}
          <button
            onClick={handleExportExcel}
            disabled={data.length === 0}
            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded text-xs transition"
          >
            Export
          </button>
          {/* Refresh Button */}
          <button
            onClick={() => fetchJobCostLedger(selectedYear)}
            className="px-3 py-1 bg-white border border-slate-300 text-slate-700 font-medium rounded text-xs hover:bg-slate-50 shadow-sm transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Upload Notification Banner */}
      {uploadStatus && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            uploadStatus.includes("successful")
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {uploadStatus}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-rose-100 text-rose-800 border border-rose-200 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Table Container with Dynamic Viewport Height & Sticky Header */}
      <div className="bg-white shadow border border-slate-200 overflow-hidden rounded-lg">
        {loading ? (
          <div className="p-8 text-center text-slate-500 font-medium">
            Loading Job Cost Ledger data for FY {selectedYear}...
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto h-[calc(100vh-180px)]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-100 shadow-sm">
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600 tracking-wider">
                  <th className="py-3 px-4 bg-slate-100 text-center">Year</th>
                  <th className="py-3 px-4 bg-slate-100">Project ID</th>
                  <th className="py-3 px-4 bg-slate-100">Project Name</th>
                  <th className="py-3 px-4 bg-slate-100 whitespace-nowrap">
                    Account ID
                  </th>
                  <th className="py-3 px-4 text-center bg-slate-100 whitespace-nowrap">
                    Org ID
                  </th>
                  <th className="py-3 px-4 text-center bg-slate-100">Type</th>
                  <th className="py-3 px-4 bg-slate-100">Prime Cntr</th>
                  <th className="py-3 px-4 bg-slate-100">Sub Cntr</th>
                  <th className="py-3 px-4 text-right bg-slate-100">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700 font-mono">
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="py-8 text-center text-slate-400 font-sans"
                    >
                      No records found for FY {selectedYear}.
                    </td>
                  </tr>
                ) : (
                  data.map((item, idx) => (
                    <tr
                      key={item.id || item.projId || idx}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-sans">
                        {item.year || selectedYear}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {item.projId}
                      </td>
                      <td className="py-3 px-4 font-sans">
                        {item.projName?.trim()}
                      </td>
                      <td className="py-3 px-4">{item.acctId}</td>
                      <td className="py-3 px-4 text-center font-sans">
                        {item.orgId}
                      </td>
                      <td className="py-3 px-4 text-center font-sans">
                        {item.projType}
                      </td>
                      <td className="py-3 px-4">{item.primeCntrId || "-"}</td>
                      <td className="py-3 px-4">{item.subctrId || "-"}</td>
                      <td className="py-3 px-4 text-right font-semibold text-indigo-900">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
