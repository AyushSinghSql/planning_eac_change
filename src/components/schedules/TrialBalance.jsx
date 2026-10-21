// import React, { useState, useEffect, useRef } from "react";
// import * as XLSX from "xlsx";
// import { backendUrl } from "../config";

// export default function TrialBalance({ year = 2025 }) {
//   const [selectedYear, setSelectedYear] = useState(year);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState("");
//   const fileInputRef = useRef(null);

//   // Fetch Trial Balance data from API
//   const fetchTrialBalance = async (year) => {
//     // if (year !== 2025) {
//     //   setLoading(false);
//     //   setData([]);
//     //   return;
//     // }
//     setLoading(true);
//     setError(null);
//     try {
//       const targetYear = year || selectedYear;

//       const response = await fetch(
//         `${backendUrl}/api/TrialBalance?fyCd=${targetYear}`,
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const json = await response.json();
//       setData(json);
//     } catch (err) {
//       setError(err.message || "Failed to fetch trial balance data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTrialBalance(selectedYear);
//   }, [selectedYear]);

//   const triggerStatusToast = (message) => {
//     setUploadStatus(message);
//     setTimeout(() => {
//       setUploadStatus("");
//     }, 5000); // Automatically clears after 5 seconds
//   };

//   const handlePrevYear = () => setSelectedYear((prev) => prev - 1);
//   const handleNextYear = () => setSelectedYear((prev) => prev + 1);
//   const handleYearChange = (e) => setSelectedYear(Number(e.target.value));
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
//       const response = await fetch(`${backendUrl}/api/TrialBalance/import`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`Import failed with status: ${response.status}`);
//       }

//       triggerStatusToast("Import successful!");
//       // Refresh list after successful upload
//       fetchTrialBalance(selectedYear);
//     } catch (err) {
//       setUploadStatus(`Import failed: ${err.message}`);
//     } finally {
//       // Clear input value so same file can be selected again if needed
//       event.target.value = "";
//     }
//   };

//   // Export current table data to Excel
//   const handleExportExcel = () => {
//     if (!data || data.length === 0) return;

//     // Map data to clean column headers for the export file
//     const exportData = data.map((item) => ({
//       "Account ID": item.acctId,
//       "Account Name": item.acctName?.trim() || "",
//       "Org ID": item.orgId,
//       "Beginning Balance": item.beginningBalance ?? 0,
//       "Prior Pd YTD Activity": item.priorPeriodYtdActivity ?? 0,
//       "Current Pd Activity": item.currentPdActivity ?? 0,
//       "Ending Balance": item.endingBalance ?? 0,
//       Adjustments: item.adjustments ?? 0,
//       "Adjusted Balance": item.adjustedBalance ?? 0,
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Trial Balance");

//     // Download the Excel file
//     XLSX.writeFile(
//       workbook,
//       `Trial_Balance_${new Date().toISOString().slice(0, 10)}.xlsx`,
//     );
//   };

//   // Helper for currency / numeric formatting
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
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={handlePrevYear}
//             className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 font-semibold text-xs transition"
//           >
//             &larr; Prev
//           </button>
//           <span className="font-bold text-xs text-slate-700">FY:</span>
//           <select
//             value={selectedYear}
//             onChange={handleYearChange}
//             className="border border-slate-300 rounded px-2 py-1 font-bold text-xs bg-white text-slate-800 shadow-sm"
//           >
//             {Array.from({ length: 11 }, (_, i) => 2020 + i).map((yr) => (
//               <option key={yr} value={yr}>
//                 {yr}
//               </option>
//             ))}
//           </select>
//           <button
//             onClick={handleNextYear}
//             className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 font-semibold text-xs transition"
//           >
//             Next &rarr;
//           </button>
//         </div>

//         <div className="flex items-center gap-2">
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             className="hidden"
//             accept=".csv, .xlsx, .xls"
//           />

//           {/* Import Button */}
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
//                 strokeLinecap="round"
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
//             onClick={() => fetchTrialBalance(selectedYear)}
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
//             Loading Trial Balance data...
//           </div>
//         ) : (
//           <div className="overflow-x-auto overflow-y-auto h-[calc(100vh-180px)]">
//             <table className="w-full text-left border-collapse">
//               <thead className="sticky top-0 z-10 bg-slate-100 shadow-sm">
//                 <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600 tracking-wider">
//                   <th className="py-3 px-4 bg-slate-100">Year</th>
//                   <th className="py-3 px-4 bg-slate-100">Account ID</th>
//                   <th className="py-3 px-4 bg-slate-100">Account Name</th>
//                   <th className="py-3 px-4 text-center bg-slate-100">Org ID</th>
//                   <th className="py-3 px-4 text-right bg-slate-100">
//                     Beginning Balance
//                   </th>
//                   <th className="py-3 px-4 text-right bg-slate-100">
//                     Prior Pd YTD Activity
//                   </th>
//                   <th className="py-3 px-4 text-right bg-slate-100">
//                     Current Pd Activity
//                   </th>
//                   <th className="py-3 px-4 text-right bg-slate-100">
//                     Ending Balance
//                   </th>
//                   <th className="py-3 px-4 text-right bg-slate-100">
//                     Adjustments
//                   </th>
//                   <th className="py-3 px-4 text-right bg-slate-100">
//                     Adjusted Balance
//                   </th>
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
//                   data.map((item) => (
//                     <tr
//                       key={item.id}
//                       className="hover:bg-slate-50 transition-colors"
//                     >
//                       <td className="py-3 px-4 font-semibold text-slate-900">
//                         {item?.year}
//                       </td>
//                       <td className="py-3 px-4 font-semibold text-slate-900">
//                         {item.acctId}
//                       </td>
//                       <td className="py-3 px-4 font-sans">
//                         {item.acctName?.trim()}
//                       </td>
//                       <td className="py-3 px-4 text-center font-sans">
//                         {item.orgId}
//                       </td>
//                       <td className="py-3 px-4 text-right">
//                         {formatCurrency(item.beginningBalance)}
//                       </td>
//                       <td className="py-3 px-4 text-right">
//                         {formatCurrency(item.priorPeriodYtdActivity)}
//                       </td>
//                       <td className="py-3 px-4 text-right">
//                         {formatCurrency(item.currentPdActivity)}
//                       </td>
//                       <td className="py-3 px-4 text-right font-semibold">
//                         {formatCurrency(item.endingBalance)}
//                       </td>
//                       <td className="py-3 px-4 text-right">
//                         {formatCurrency(item.adjustments)}
//                       </td>
//                       <td className="py-3 px-4 text-right font-semibold text-indigo-900">
//                         {formatCurrency(item.adjustedBalance)}
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

import React, { useState, useEffect, useRef, useMemo } from "react";
import * as XLSX from "xlsx";
import { backendUrl } from "../config";

export default function TrialBalance({ year = 2025, masterTabs = [] }) {
  const [selectedYear, setSelectedYear] = useState(year);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const fileInputRef = useRef(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // Filters & Selections
  const [accountFilter, setAccountFilter] = useState("");
  const [selectedAcctIds, setSelectedAcctIds] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState([]); // Array of Tab IDs
  const [saving, setSaving] = useState(false);

  const [orgFilter, setOrgFilter] = useState("");
  const [scheduleFilter, setScheduleFilter] = useState("");

  // Multi-Select Dropdown UI State
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Available Schedules Filter Logic
  const availableSchedules = useMemo(() => {
    if (!masterTabs || masterTabs.length === 0) {
      return [
        { id: "sched_fringe", label: "Fringe" },
        { id: "sched_b", label: "Overhead" },
        { id: "sched_c1", label: "G&A" },
        { id: "sched_d1", label: "Direct Labor" },
        { id: "sched_e", label: "Material" },
      ];
    }

    const excludedIds = [
      "ice_setup",
      "sched_a",
      "sched_d3",
      "sched_d4",
      "sched_d5",
      "sched_d6",
      "sched_e",
      "sched_g",
      "sched_g1",
      "sched_summaryh",
      "sched_h",
      "sched_hcont",
      "sched_i",
      "sched_j",
      "sched_k",
      "sched_l",
      "sched_m",
      "sched_n",
      "sched_o",
      "suppl_a1",
      "suppl_a2",
      "suppl_a3",
      "suppl_a4",
      "suppl_b",
      "suppl_c",
      "suppl_o",
      "trial_balance",
      "job_cost_ledger",
      "import_center",
      "file_manager",
      "sched_k_import",
    ];

    return masterTabs.filter((tab) => !excludedIds.includes(tab.id));
  }, [masterTabs]);

  // Lookup map to quickly convert ID -> Label (including fallback defaults)
  const scheduleIdToLabel = useMemo(() => {
    const map = {
      sched_fringe: "Fringe",
      sched_b: "Overhead",
      sched_c1: "G&A",
      sched_d1: "Direct Labor",
      sched_e: "Material",
    };

    if (masterTabs && masterTabs.length > 0) {
      masterTabs.forEach((tab) => {
        if (tab.id && tab.label) map[tab.id] = tab.label;
      });
    }
    return map;
  }, [masterTabs]);

  const uniqueOrgIds = useMemo(() => {
    return Array.from(
      new Set(data.map((item) => item.orgId).filter(Boolean)),
    ).sort();
  }, [data]);

  const uniqueSchedules = useMemo(() => {
    const schedules = new Set();
    data.forEach((item) => {
      if (item.schedulecode) {
        item.schedulecode
          .split(",")
          .forEach((code) => schedules.add(code.trim()));
      }
    });
    return Array.from(schedules).sort();
  }, [data]);

  // Search filter for dropdown items
  const filteredAvailableSchedules = useMemo(() => {
    return availableSchedules.filter((sched) => {
      const label = typeof sched === "object" ? sched.label : sched;
      return label.toLowerCase().includes(dropdownSearch.toLowerCase());
    });
  }, [availableSchedules, dropdownSearch]);

  // Fetch Trial Balance data
  const fetchTrialBalance = async (year) => {
    setLoading(true);
    setError(null);
    try {
      const targetYear = year || selectedYear;
      const response = await fetch(
        `${backendUrl}/api/TrialBalance?fyCd=${targetYear}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      const formattedData = json.map((item) => ({
        ...item,
        schedulecode: item.schedulecode || item.scheduleMapping || "",
      }));
      setData(formattedData);
      setSelectedAcctIds([]);
      setSelectedRowKeys([]);
    } catch (err) {
      setError(err.message || "Failed to fetch trial balance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrialBalance(selectedYear);
  }, [selectedYear]);

  const triggerStatusToast = (message) => {
    setUploadStatus(message);
    setTimeout(() => {
      setUploadStatus("");
    }, 5000);
  };

  const handlePrevYear = () => setSelectedYear((prev) => prev - 1);
  const handleNextYear = () => setSelectedYear((prev) => prev + 1);
  const handleYearChange = (e) => setSelectedYear(Number(e.target.value));

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadStatus("Uploading...");
    try {
      const response = await fetch(`${backendUrl}/api/TrialBalance/import`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Import failed with status: ${response.status}`);
      }

      triggerStatusToast("Import successful!");
      fetchTrialBalance(selectedYear);
    } catch (err) {
      setUploadStatus(`Import failed: ${err.message}`);
    } finally {
      event.target.value = "";
    }
  };

  // const filteredData = data.filter((item) =>
  //   item.acctId?.toLowerCase().startsWith(accountFilter.trim().toLowerCase()),
  // );

  // Comprehensive Multi-Field Filtering Logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesAccount =
        !accountFilter ||
        item.acctId?.toLowerCase().includes(accountFilter.trim().toLowerCase());

      const matchesOrg =
        !orgFilter ||
        item.orgId?.toLowerCase().includes(orgFilter.trim().toLowerCase());

      const matchesSchedule =
        !scheduleFilter ||
        (item.schedulecode &&
          item.schedulecode
            .toLowerCase()
            .split(",")
            .map((s) => s.trim())
            .includes(scheduleFilter.toLowerCase()));

      return matchesAccount && matchesOrg && matchesSchedule;
    });
  }, [data, accountFilter, orgFilter, scheduleFilter]);

  const handleExportExcel = () => {
    if (!data || data.length === 0) return;

    const exportData = filteredData.map((item) => ({
      Year: item.year,
      "Account ID": item.acctId,
      "Account Name": item.acctName?.trim() || "",
      "Org ID": item.orgId,
      "Schedule Code": item.schedulecode || "",
      "Beginning Balance": item.beginningBalance ?? 0,
      "Prior Pd YTD Activity": item.priorPeriodYtdActivity ?? 0,
      "Current Pd Activity": item.currentPdActivity ?? 0,
      "Ending Balance": item.endingBalance ?? 0,
      Adjustments: item.adjustments ?? 0,
      "Adjusted Balance": item.adjustedBalance ?? 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trial Balance");

    XLSX.writeFile(
      workbook,
      `Trial_Balance_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  const formatCurrency = (val) => {
    if (val === null || val === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val);
  };

  const handleSelectAccount = (acctId) => {
    setSelectedAcctIds((prev) =>
      prev.includes(acctId)
        ? prev.filter((id) => id !== acctId)
        : [...prev, acctId],
    );
  };

  // const handleSelectAll = (e) => {
  //   if (e.target.checked) {
  //     setSelectedAcctIds(filteredData.map((item) => item.acctId));
  //   } else {
  //     setSelectedAcctIds([]);
  //   }
  // };

  const handleScheduleToggle = (schedId) => {
    setSelectedSchedules((prev) =>
      prev.includes(schedId)
        ? prev.filter((id) => id !== schedId)
        : [...prev, schedId],
    );
  };

  const handleApplySchedulesToSelected = () => {
    if (selectedRowKeys.length === 0) return;
    const scheduleCodeValue = selectedSchedules.join(", ");

    setData((prevData) =>
      prevData.map((item) =>
        selectedRowKeys.includes(getRowKey(item.acctId, item.orgId))
          ? { ...item, schedulecode: scheduleCodeValue }
          : item,
      ),
    );
  };

  // 6. Clear Schedules for Selected Rows
  const handleClearSchedulesForSelected = () => {
    if (selectedRowKeys.length === 0) return;

    setData((prevData) =>
      prevData.map((item) =>
        selectedRowKeys.includes(getRowKey(item.acctId, item.orgId))
          ? { ...item, schedulecode: "" }
          : item,
      ),
    );
  };

  const handleSaveSchedules = async () => {
    if (selectedRowKeys.length === 0) {
      alert("Please select at least one account to save.");
      return;
    }

    const payload = selectedRowKeys.map((key) => {
      const row = data.find((d) => getRowKey(d.acctId, d.orgId) === key);
      return {
        year: String(row?.year || selectedYear),
        acctId: row?.acctId || "",
        orgId: row?.orgId || "",
        schedulecode: row?.schedulecode || "",
      };
    });

    setSaving(true);
    try {
      const response = await fetch(
        `${backendUrl}/api/TrialBalance/AddScheduleMapping`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to save schedules. Status: ${response.status}`);
      }

      triggerStatusToast("Schedules saved successfully!");
      fetchTrialBalance(selectedYear);
    } catch (err) {
      setError(err.message || "Failed to save schedules");
    } finally {
      setSaving(false);
    }
  };

  // Helper to resolve ID string (single or comma-separated) into Labels
  const renderScheduleLabel = (codeValue) => {
    if (!codeValue) {
      return <span className="text-slate-400 font-normal">-</span>;
    }

    const labels = codeValue
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
      .map((id) => scheduleIdToLabel[id] || id);

    return (
      <div className="flex flex-wrap gap-1">
        {labels.map((lbl, idx) => (
          <span
            key={idx}
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200"
          >
            {lbl}
          </span>
        ))}
      </div>
    );
  };

  const getRowKey = (acctId, orgId) => `${acctId}_${orgId}`;

  // 2. Toggle Single Row Selection
  const handleSelectRow = (acctId, orgId) => {
    const key = getRowKey(acctId, orgId);
    setSelectedRowKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  // 3. Select / Deselect All Filtered Rows
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowKeys(
        filteredData.map((item) => getRowKey(item.acctId, item.orgId)),
      );
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleResetFilters = () => {
    setAccountFilter("");
    setOrgFilter("");
    setScheduleFilter("");
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
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

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".csv, .xlsx, .xls"
          />

          <button
            onClick={handleImportClick}
            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded text-xs transition"
          >
            Import
          </button>

          <button
            onClick={handleExportExcel}
            disabled={data.length === 0}
            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded text-xs transition disabled:opacity-50"
          >
            Export
          </button>

          <button
            onClick={() => fetchTrialBalance(selectedYear)}
            className="px-3 py-1 bg-white border border-slate-300 text-slate-700 font-medium rounded text-xs hover:bg-slate-50 shadow-sm transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Account Filter & Schedule Multi-Select Control Bar */}
      <div className="bg-white p-4 rounded-lg shadow border border-slate-200 mb-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        {/* <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs font-semibold text-slate-600">
            Account ID:
          </label>
          <input
            type="text"
            placeholder="Search Account ID..."
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 text-xs bg-white text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div> */}

        {/* Table Search Filters (Account, Org ID, Schedule Mapping) */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <span className="text-xs font-bold text-slate-700">Filters:</span>

          <div className="flex items-center gap-1.5">
            <label className="text-xs font-medium text-slate-600">
              Account ID:
            </label>
            <input
              type="text"
              placeholder="Search Account..."
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 text-xs bg-white text-slate-800 shadow-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 w-32"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs font-medium text-slate-600">
              Org ID:
            </label>
            <input
              type="text"
              placeholder="Search Org..."
              value={orgFilter}
              onChange={(e) => setOrgFilter(e.target.value)}
              list="org-id-options"
              className="border border-slate-300 rounded px-2 py-1 text-xs bg-white text-slate-800 shadow-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 w-28"
            />
            <datalist id="org-id-options">
              {uniqueOrgIds.map((org) => (
                <option key={org} value={org} />
              ))}
            </datalist>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs font-medium text-slate-600">
              Sched Mapping:
            </label>
            <select
              value={scheduleFilter}
              onChange={(e) => setScheduleFilter(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 text-xs bg-white text-slate-800 shadow-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[140px]"
            >
              <option value="">All Schedules</option>
              {uniqueSchedules.map((sched) => (
                <option key={sched} value={sched}>
                  {scheduleIdToLabel[sched] || sched}
                </option>
              ))}
            </select>
          </div>

          {/* {(accountFilter || orgFilter || scheduleFilter) && ( */}
          <button
            onClick={handleResetFilters}
            disabled={!accountFilter && !orgFilter && !scheduleFilter}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded text-xs transition disabled:opacity-50 shadow-xs"
          >
            Reset
          </button>
          {/* )} */}
        </div>

        {/* Schedule Selector Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-600">
            Select Schedule(s):
          </span>

          {/* Multi-Select Dropdown Component */}
          <div className="relative w-64" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-full flex justify-between items-center bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <span className="truncate font-medium">
                {selectedSchedules.length === 0
                  ? "Select schedules..."
                  : `${selectedSchedules.length} selected (${selectedSchedules
                      .map((id) => scheduleIdToLabel[id] || id)
                      .join(", ")})`}
              </span>
              <svg
                className="w-4 h-4 ml-1 text-slate-400 shrink-0"
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
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg z-50 p-2">
                <input
                  type="text"
                  placeholder="Search schedules..."
                  value={dropdownSearch}
                  onChange={(e) => setDropdownSearch(e.target.value)}
                  className="w-full border border-slate-200 rounded px-2 py-1 text-xs mb-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />

                <div className="flex justify-between text-[10px] text-indigo-600 font-semibold mb-1 px-1">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedSchedules(
                        availableSchedules.map((s) => s.id || s),
                      )
                    }
                    className="hover:underline"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSchedules([])}
                    className="hover:underline text-slate-500"
                  >
                    Clear All
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                  {filteredAvailableSchedules.length === 0 ? (
                    <div className="text-xs text-slate-400 p-2 text-center">
                      No schedules match.
                    </div>
                  ) : (
                    filteredAvailableSchedules.map((sched) => {
                      const label =
                        typeof sched === "object"
                          ? sched.label || sched.id
                          : sched;
                      const idVal =
                        typeof sched === "object" ? sched.id : sched;

                      return (
                        <label
                          key={idVal}
                          className="flex items-center space-x-2 py-1.5 px-1 hover:bg-slate-50 cursor-pointer rounded text-xs text-slate-700"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSchedules.includes(idVal)}
                            onChange={() => handleScheduleToggle(idVal)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                          />
                          <span>{label}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApplySchedulesToSelected}
              disabled={selectedRowKeys.length === 0}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded text-xs transition disabled:opacity-50 shadow-xs"
            >
              Apply
            </button>
            <button
              onClick={handleClearSchedulesForSelected}
              disabled={selectedRowKeys.length === 0}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded text-xs transition disabled:opacity-50 shadow-xs"
            >
              Remove
            </button>
            <button
              onClick={handleSaveSchedules}
              disabled={selectedRowKeys.length === 0 || saving}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-xs transition disabled:opacity-50 shadow-xs"
            >
              {saving ? "Saving..." : "Save "}
            </button>
          </div>
        </div>
      </div>

      {/* Status Toasts & Error Displays */}
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

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-rose-100 text-rose-800 border border-rose-200 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white shadow border border-slate-200 overflow-hidden rounded-lg">
        {loading ? (
          <div className="p-8 text-center text-slate-500 font-medium">
            Loading Trial Balance data...
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto h-[calc(100vh-250px)]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-100 shadow-sm">
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600 tracking-wider">
                  <th className="py-3 px-4 bg-slate-100 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        filteredData.length > 0 &&
                        selectedRowKeys.length === filteredData.length
                      }
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                  </th>
                  <th className="py-3 px-4 bg-slate-100">Year</th>
                  <th className="py-3 px-4 bg-slate-100">Account ID</th>
                  <th className="py-3 px-4 bg-slate-100">Account Name</th>
                  <th className="py-3 px-4 text-center bg-slate-100">Org ID</th>
                  <th className="py-3 px-4 bg-slate-100">Schedule Code</th>
                  <th className="py-3 px-4 text-right bg-slate-100">
                    Beginning Balance
                  </th>
                  <th className="py-3 px-4 text-right bg-slate-100">
                    Prior Pd YTD Activity
                  </th>
                  <th className="py-3 px-4 text-right bg-slate-100">
                    Current Pd Activity
                  </th>
                  <th className="py-3 px-4 text-right bg-slate-100">
                    Ending Balance
                  </th>
                  <th className="py-3 px-4 text-right bg-slate-100">
                    Adjustments
                  </th>
                  <th className="py-3 px-4 text-right bg-slate-100">
                    Adjusted Balance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700 font-mono">
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="12"
                      className="py-8 text-center text-slate-400 font-sans"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => {
                    const rowKey = `${item.acctId}_${item.orgId}`;
                    const isSelected = selectedRowKeys.includes(rowKey);

                    return (
                      <tr
                        key={rowKey}
                        className={`transition-colors ${
                          isSelected ? "bg-indigo-50" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              handleSelectRow(item.acctId, item.orgId)
                            }
                            className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                          />
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {item?.year}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {item.acctId}
                        </td>
                        <td className="py-3 px-4 font-sans">
                          {item.acctName?.trim()}
                        </td>
                        <td className="py-3 px-4 text-center font-sans">
                          {item.orgId}
                        </td>
                        <td className="py-3 px-4 font-sans">
                          {renderScheduleLabel(item.schedulecode)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(item.beginningBalance)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(item.priorPeriodYtdActivity)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(item.currentPdActivity)}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          {formatCurrency(item.endingBalance)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(item.adjustments)}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-indigo-900">
                          {formatCurrency(item.adjustedBalance)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
