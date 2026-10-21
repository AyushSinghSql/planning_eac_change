import React, { useState, useEffect, useRef } from "react";
import { backendUrl } from "../config";
import * as XLSX from "xlsx";

export default function SchedKImport({
  year = 2025,
  companyName = "Company Name",
  companyAddress = "Company Address",
}) {
  const [selectedYear, setSelectedYear] = useState(year);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const fileInputRef = useRef(null);

  // Fetch Schedule K data from API
  const fetchScheduleKData = async (year) => {
    // if (year !== 2025) {
    //   setLoading(false);
    //   setData([]);
    //   return;
    // }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${backendUrl}/api/TrialBalance/ScheduleK?year=${year}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error("Failed to fetch Schedule K data:", err);
      setError(err.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleKData(selectedYear);
  }, [selectedYear]);

  // Toast status notification helper
  const triggerStatusToast = (message) => {
    setUploadStatus(message);
    setTimeout(() => {
      setUploadStatus("");
    }, 5000);
  };

  // Year Navigation Handlers
  const handlePrevYear = () => setSelectedYear((prev) => prev - 1);
  const handleNextYear = () => setSelectedYear((prev) => prev + 1);
  const handleYearChange = (e) => setSelectedYear(Number(e.target.value));

  // Export current table data to Excel
  const handleExportExcel = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${backendUrl}/api/TrialBalance/ScheduleK/export`,
        {
          method: "GET",
          headers: {
            // Expect an Excel binary file back from the API
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Export failed with status: ${response.status}`);
      }

      // Convert the API response into a Blob
      const blob = await response.blob();

      // Create a temporary object URL to trigger the file download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Schedule_K_${selectedYear}.xlsx`);

      document.body.appendChild(link);
      link.click();

      // Clean up DOM and URL object
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export Excel file:", err);
      alert(`Export failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Import handler
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setUploadStatus("Uploading...");
    try {
      const response = await fetch(
        `${backendUrl}/api/TrialBalance/ScheduleK/import?year=${selectedYear}`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Import failed with status: ${response.status}`);
      }

      triggerStatusToast("Import successful!");
      fetchScheduleKData(selectedYear);
    } catch (err) {
      console.error("Failed to import file:", err);
      triggerStatusToast(`Import failed: ${err.message}`);
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const formatCurrency = (val) => {
    if (val === null || val === undefined) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val);
  };

  const formatNumber = (val) => {
    if (val === null || val === undefined) return "0.00";
    return Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-4">
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
            onChange={handleImportFile}
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
            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded text-xs transition"
          >
            Export
          </button>

          <button
            onClick={() => fetchScheduleKData(selectedYear)}
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
            Loading Schedule K data...
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto h-[calc(100vh-180px)]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-100 shadow-sm">
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-600 tracking-wider">
                  <th className="py-3 px-4 bg-slate-100">Year</th>
                  <th className="py-3 px-4 bg-slate-100">Invoice Proj ID</th>
                  <th className="py-3 px-4 bg-slate-100">Task ID</th>
                  <th className="py-3 px-4 bg-slate-100">PLC Description</th>
                  <th className="py-3 px-4 text-right bg-slate-100">Rate</th>
                  <th className="py-3 px-4 text-right bg-slate-100">Hours</th>
                  <th className="py-3 px-4 text-right bg-slate-100">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm text-slate-700 font-mono">
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-8 text-center text-slate-400 font-sans"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  data.map((item, idx) => (
                    <tr
                      key={item.id || idx}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {item?.year}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {item.invcProjId}
                      </td>
                      <td className="py-3 px-4 font-sans">{item.taskId}</td>
                      <td className="py-3 px-4 font-sans">{item.plcDesc}</td>
                      <td className="py-3 px-4 text-right">
                        {formatCurrency(item.rate)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {formatNumber(item.hours)}
                      </td>
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
