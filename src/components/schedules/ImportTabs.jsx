import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  Download,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { backendUrl } from "../config";

export default function ImportTabs({ onNavigate, year }) {
  const [selectedYear, setSelectedYear] = useState(year);
  const [activeImportTab, setActiveImportTab] = useState("sched_k");
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const fileInputRef = useRef(null);

  // Configuration for the 3 Import Types
  const IMPORT_CONFIG = {
    sched_k: {
      title: "Schedule K Import",
      description:
        "Import labor rate and hours data associated with project tasks.",
      targetTabId: "sched_k_import",
      importEndpoint: `${backendUrl}/api/TrialBalance/ScheduleK/import?year=${selectedYear}`,
      exportType: "sched_k",
    },
    trial_balance: {
      title: "Trial Balance Import",
      description:
        "Import account balances, prior period YTD activity, and current period totals.",
      targetTabId: "trial_balance",
      importEndpoint: `${backendUrl}/api/TrialBalance/import?year=${selectedYear}`,
      exportType: "json_tb",
    },
    job_cost: {
      title: "Job Cost Ledger Import",
      description:
        "Import detailed job cost transactions, prime contracts, and subcontracts.",
      targetTabId: "job_cost_ledger",
      importEndpoint: `${backendUrl}/api/JobCostLedger/import?year=${selectedYear}`,
      exportType: "json_jc",
    },
  };

  const currentConfig = IMPORT_CONFIG[activeImportTab];

  // Helper for status toasts
  const showToast = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage({ type: "", text: "" });
    }, 6000);
  };

  // Trigger hidden file picker
  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Perform File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    showToast("info", `Uploading file for ${currentConfig.title}...`);

    try {
      const response = await fetch(currentConfig.importEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Import failed with status: ${response.status}`);
      }

      showToast("success", `${currentConfig.title} imported successfully!`);
    } catch (err) {
      console.error("Import error:", err);
      showToast("error", `Import failed: ${err.message}`);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  // Export Excel Handlers based on tab type
  const handleExportExcel = async () => {
    setExportLoading(true);
    try {
      if (currentConfig.exportType === "sched_k") {
        // Schedule K API Binary Export
        const response = await fetch(
          `${backendUrl}/api/TrialBalance/ScheduleK/export`,
          {
            method: "GET",
            headers: {
              Accept:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Export failed with status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Schedule_K_${selectedYear}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else if (currentConfig.exportType === "json_tb") {
        // Trial Balance JSON Export
        const response = await fetch(
          `${backendUrl}/api/TrialBalance?year=${selectedYear}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (!data || data.length === 0) {
          showToast("info", "No Trial Balance data found to export.");
          return;
        }

        const exportData = data.map((item) => ({
          "Account ID": item.acctId,
          "Account Name": item.acctName?.trim() || "",
          "Org ID": item.orgId,
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
          `Trial_Balance_${selectedYear}_${new Date().toISOString().slice(0, 10)}.xlsx`,
        );
      } else if (currentConfig.exportType === "json_jc") {
        // Job Cost Ledger JSON Export
        const response = await fetch(
          `${backendUrl}/api/JobCostLedger?year=${selectedYear}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        const data = Array.isArray(json) ? json : [];

        if (!data || data.length === 0) {
          showToast("info", "No Job Cost Ledger data found to export.");
          return;
        }

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
      }
    } catch (err) {
      console.error("Export error:", err);
      showToast("error", `Export failed: ${err.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 my-4">
      {/* Top Header & Year Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Data Import & Export Center
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Import and export Excel or CSV data files directly for your ICE
            schedule components.
          </p>
        </div>

        {/* Global Fiscal Year Picker */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setSelectedYear((prev) => prev - 1)}
            className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-700 font-semibold text-xs hover:bg-slate-100 transition"
          >
            &larr;
          </button>
          <span className="font-bold text-xs text-slate-700">Fiscal Year:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border border-slate-300 rounded px-2 py-0.5 font-bold text-xs bg-white text-slate-800 shadow-sm"
          >
            {Array.from({ length: 11 }, (_, i) => 2020 + i).map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setSelectedYear((prev) => prev + 1)}
            className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-700 font-semibold text-xs hover:bg-slate-100 transition"
          >
            &rarr;
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 mt-4">
        <button
          type="button"
          onClick={() => setActiveImportTab("sched_k")}
          className={`py-2.5 px-4 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
            activeImportTab === "sched_k"
              ? "border-emerald-700 text-emerald-800 bg-emerald-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          Schedule K
        </button>

        <button
          type="button"
          onClick={() => setActiveImportTab("trial_balance")}
          className={`py-2.5 px-4 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
            activeImportTab === "trial_balance"
              ? "border-emerald-700 text-emerald-800 bg-emerald-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          Trial Balance
        </button>

        <button
          type="button"
          onClick={() => setActiveImportTab("job_cost")}
          className={`py-2.5 px-4 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
            activeImportTab === "job_cost"
              ? "border-emerald-700 text-emerald-800 bg-emerald-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          Job Cost Ledger
        </button>
      </div>

      {/* Toast Notification Banner */}
      {statusMessage.text && (
        <div
          className={`mt-4 p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
            statusMessage.type === "success"
              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
              : statusMessage.type === "error"
                ? "bg-rose-100 text-rose-800 border border-rose-200"
                : "bg-amber-100 text-amber-800 border border-amber-200"
          }`}
        >
          {statusMessage.type === "success" && (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
          )}
          {statusMessage.type === "error" && (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" />
          )}
          {statusMessage.type === "info" && (
            <RefreshCw className="w-4 h-4 shrink-0 animate-spin text-amber-700" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Active Tab Panel Content */}
      <div className="py-6">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {currentConfig.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {currentConfig.description}
              </p>
            </div>

            {/* Quick Navigation Link to Schedule Data */}
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate(currentConfig.targetTabId)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100/50 rounded-md transition"
              >
                <span>View </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upload Box */}
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:border-emerald-600 transition">
              <Upload className="w-8 h-8 text-emerald-700 mb-2" />
              <p className="text-xs font-semibold text-slate-800 mb-1">
                Upload File for FY {selectedYear}
              </p>
              <p className="text-[11px] text-slate-400 mb-4 text-center">
                Supports .xlsx, .xls, and .csv formats
              </p>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".csv, .xlsx, .xls"
              />

              <button
                type="button"
                onClick={handleSelectFile}
                disabled={loading}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded text-xs transition shadow-sm disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Select & Import File"}
              </button>
            </div>

            {/* Download/Export Box */}
            <div className="border border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center bg-white">
              <Download className="w-8 h-8 text-indigo-600 mb-2" />
              <p className="text-xs font-semibold text-slate-800 mb-1">
                Export {currentConfig.title.replace(" Import", "")} Data
              </p>
              <p className="text-[11px] text-slate-400 mb-4 text-center">
                Export current FY {selectedYear} data or template structure to
                Excel
              </p>

              <button
                type="button"
                onClick={handleExportExcel}
                disabled={exportLoading}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded text-xs transition shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {exportLoading && (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-500" />
                )}
                <span>
                  {exportLoading ? "Exporting..." : "Export Excel File"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
