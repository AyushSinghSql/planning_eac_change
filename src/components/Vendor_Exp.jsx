import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Pencil,
  Search,
  LogOut,
  X,
  Save,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Settings2,
  RefreshCw,
  FileText,
  Download,
} from "lucide-react";
import * as XLSX from "xlsx";

// ==========================================
// STATIC DATA INJECTION
// ==========================================
const staticExpenses = [
  {
    id: "1",
    prime_key: "EXP.001",
    vendor_id: "V-101",
    vendor_name: "Tech Solutions Inc",
    contract_short_name: "ALPHA",
    charge_code: "ALPHA.001",
    status: "Approved",
    voucher_no: "VCH-1001",
    accounting: true,
    date_processed: "2026-10-05T00:00:00Z",
    pdf_file_path: "https://example.com/invoice1.pdf",
    notes: "Monthly server hosting",
    charge_amount: 1500.0,
  },
  {
    id: "2",
    prime_key: "EXP.002",
    vendor_id: "V-102",
    vendor_name: "Office Supplies Co",
    contract_short_name: "BETA",
    charge_code: "BETA.002",
    status: "Pending",
    voucher_no: "",
    accounting: false,
    date_processed: null,
    pdf_file_path: "C:/invoices/supplies.pdf",
    notes: "Desk chairs",
    charge_amount: 450.5,
  },
  {
    id: "3",
    prime_key: "EXP.002.1",
    vendor_id: "V-102",
    vendor_name: "Office Supplies Co",
    contract_short_name: "BETA",
    charge_code: "BETA.002",
    status: "Submitted",
    voucher_no: "",
    accounting: false,
    date_processed: null,
    pdf_file_path: "C:/invoices/supplies_update.pdf",
    notes: "Desk chairs - updated quantity",
    charge_amount: 480.0,
  },
  {
    id: "4",
    prime_key: "EXP.003",
    vendor_id: "V-103",
    vendor_name: "Consulting Group LLC",
    contract_short_name: "GAMMA",
    charge_code: "GAMMA",
    status: "Rejected",
    voucher_no: "VCH-1003",
    accounting: false,
    date_processed: "2026-10-08T00:00:00Z",
    pdf_file_path: "https://example.com/consulting.pdf",
    notes: "Missing receipt details",
    charge_amount: 3200.0,
  },
];

const staticVendors = [
  { vend_id: "V-101", vend_name: "Tech Solutions Inc" },
  { vend_id: "V-102", vend_name: "Office Supplies Co" },
  { vend_id: "V-103", vend_name: "Consulting Group LLC" },
  { vend_id: "V-104", vend_name: "Marketing Dynamics" },
];

const staticProjects = [
  { proj_id: "ALPHA.001", proj_name: "Alpha Project Dev" },
  { proj_id: "BETA.002", proj_name: "Beta Infrastructure" },
  { proj_id: "GAMMA", proj_name: "Gamma Internal" },
];
// ==========================================

const Vendor_Expenses = ({
  dataEntries = staticExpenses, // Default to static expenses if none passed
  isLoading,
  userName = "User",
  userAvatar,
  handleLogout,
  currentUserRole = "admin", // Default to admin for testing
  currentUserId = "U-001",
  onDataChanged,
}) => {
  // Initialize with static data as fallback
  const [vendorOptions, setVendorOptions] = useState(staticVendors);
  const [projectOptions, setProjectOptions] = useState(staticProjects);
  const [plcOptions, setPlcOptions] = useState([]);

  const [searchColumn, setSearchColumn] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [showOnlyLatest, setShowOnlyLatest] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [localEntries, setLocalEntries] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);

  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [showContractDropdown, setShowContractDropdown] = useState(false);

  const [vendorSearch, setVendorSearch] = useState("");
  const [contractSearch, setContractSearch] = useState("");

  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    vendorId: "",
    contractShortName: "",
    status: "",
  });
  const [findValue, setFindValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");

  const searchableColumns = [
    { key: "all", name: "All Fields" },
    { key: "vendorId", name: "Vendor ID" },
    { key: "contractShortName", name: "Contract" },
    { key: "vendorName", name: "Vendor" },
  ];

  const handleExportToExcel = () => {
    const allRecords = groupedEntries.flatMap((group) => group);
    const recordsToExport =
      selectedRows.size > 0
        ? allRecords.filter((entry) => selectedRows.has(entry.id))
        : allRecords;

    if (recordsToExport.length === 0) {
      alert("No records available to export.");
      return;
    }

    const formattedData = recordsToExport.map((entry) => ({
      "Record No": entry.prime_key || entry.primeKey || "—",
      "Vendor ID": entry.vendor_id || entry.vendorId || "—",
      "Vendor Name": entry.vendor_name || entry.vendorName || "—",
      "Contract / CC":
        entry.credit_card ||
        entry.creditCard ||
        entry.contract_short_name ||
        entry.contractShortName ||
        "—",
      "Charge Code": entry.charge_code || entry.chargeCode || "—",
      Status: entry.status || "Submitted",
      "Voucher No": entry.voucher_no || entry.voucherNo || "—",
      Accounting:
        entry.accounting === true || entry.accounting === "true"
          ? "Cleared"
          : "Pending",
      "Date Processed":
        entry.date_processed || entry.dateProcessed
          ? new Date(
              entry.date_processed || entry.dateProcessed,
            ).toLocaleDateString()
          : "—",
      Notes: entry.notes || "—",
      Amount: `$${parseFloat(entry.charge_amount || entry.chargeAmount || entry.amount || 0).toFixed(2)}`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    const maxCols = Object.keys(formattedData[0]).map((key) => ({
      wch:
        Math.max(
          key.length,
          ...formattedData.map((row) => String(row[key] || "").length),
        ) + 3,
    }));
    worksheet["!cols"] = maxCols;

    const fileName =
      selectedRows.size > 0
        ? `Selected_Expenses_Export_${new Date().toISOString().split("T")[0]}.xlsx`
        : `All_Expenses_Export_${new Date().toISOString().split("T")[0]}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  const [formData, setFormData] = useState({
    vendorId: "",
    contractShortName: "",
    vendorName: "",
    chargeDate: "",
    chargeAmount: "",
    chargeCode: "",
    status: "Submitted",
    notes: "",
    pdfFilePath: "",
    plc: "",
    voucherNo: "",
    accounting: false,
    dateProcessed: "",
  });

  const [viewingRecord, setViewingRecord] = useState(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const derivedContractOptions = useMemo(() => {
    if (!projectOptions.length) return [];

    const uniquePrefixesMap = new Map();
    projectOptions.forEach((p) => {
      if (!p.proj_id) return;
      const rawPrefix = p.proj_id.split(".")[0].trim();
      const normalizedKey = rawPrefix.toUpperCase();

      if (!uniquePrefixesMap.has(normalizedKey)) {
        uniquePrefixesMap.set(normalizedKey, rawPrefix);
      }
    });

    return Array.from(uniquePrefixesMap.values()).map((pfx, i) => ({
      id: `contract-${i}`,
      name: pfx,
    }));
  }, [projectOptions]);

  const derivedChargeCodeOptions = useMemo(() => {
    if (!formData.contractShortName || !projectOptions.length) return [];

    const subLevels = projectOptions
      .filter(
        (p) =>
          p.proj_id && p.proj_id.startsWith(formData.contractShortName + "."),
      )
      .map((p, i) => ({
        id: `cc-${i}`,
        value: p.proj_id,
        label: `${p.proj_id} - ${p.proj_name}`,
      }));

    if (subLevels.length === 0) {
      const exactMatch = projectOptions.find(
        (p) => p.proj_id === formData.contractShortName,
      );
      if (exactMatch) {
        return [
          {
            id: `cc-standalone`,
            value: exactMatch.proj_id,
            label: `${exactMatch.proj_id} - ${exactMatch.proj_name}`,
          },
        ];
      }
    }
    return subLevels;
  }, [formData.contractShortName, projectOptions]);

  useEffect(() => {
    if (!formData.chargeCode) {
      setPlcOptions([]);
      return;
    }
    // Try to fetch PLCs, fall back silently if it fails
    if (import.meta.env.VITE_API_BASE_URL) {
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/dd/plc-options?projId=${formData.chargeCode}`,
      )
        .then((res) => res.json())
        .then((data) => setPlcOptions(data || []))
        .catch((err) =>
          console.warn("Using empty master PLCs due to fetch error"),
        );
    }
  }, [formData.chargeCode]);

  useEffect(() => {
    setLocalEntries(
      dataEntries && dataEntries.length > 0 ? dataEntries : staticExpenses,
    );
  }, [dataEntries]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        if (!import.meta.env.VITE_API_BASE_URL) throw new Error("No API URL");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/dd/vendors?userId=${currentUserId}&role=${currentUserRole}`,
        );
        const data = await res.json();
        if (data && data.length > 0) setVendorOptions(data);
      } catch (err) {
        console.warn("Falling back to static vendors");
        setVendorOptions(staticVendors);
      }
    };
    fetchVendors();
  }, [currentUserId, currentUserRole]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!import.meta.env.VITE_API_BASE_URL) throw new Error("No API URL");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/dd/projects?userId=${currentUserId}&role=${currentUserRole}`,
        );
        const data = await res.json();
        if (data && data.length > 0) setProjectOptions(data);
      } catch (err) {
        console.warn("Falling back to static projects");
        setProjectOptions(staticProjects);
      }
    };
    fetchProjects();
  }, [currentUserId, currentUserRole]);

  const handleVendorSelect = (vendor) => {
    setFormData((prev) => ({
      ...prev,
      vendorId: vendor.vend_id,
      vendorName: vendor.vend_name,
      contractShortName: "",
      chargeCode: "",
      plc: "",
    }));
    setVendorSearch(vendor.vend_name);
  };

  const handleContractChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      contractShortName: e.target.value,
      chargeCode: "",
      plc: "",
    }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const toggleRowSelection = (id) => {
    const next = new Set(selectedRows);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedRows(next);
  };

  const setStatus = (newStatus) => {
    if (currentUserRole !== "admin") {
      alert("Permission Denied: Only Admins can Approve or Reject records.");
      return;
    }
    setFormData((prev) => ({ ...prev, status: newStatus }));
  };

  const resetForm = () => {
    setFormData({
      vendorId: "",
      contractShortName: "",
      vendorName: "",
      chargeDate: "",
      chargeAmount: "",
      chargeCode: "",
      status: "Submitted",
      notes: "",
      pdfFilePath: "",
      plc: "",
      voucherNo: "",
      accounting: false,
      dateProcessed: "",
    });
    setVendorSearch("");
    setContractSearch("");
    setIsAdding(false);
    setEditingEntry(null);
    setSelectedRows(new Set());
  };

  const startEdit = () => {
    const entryId = Array.from(selectedRows)[0];
    const entry = localEntries.find((e) => e.id === entryId);
    if (entry) {
      setEditingEntry(entry);
      setIsAdding(false);
      setFormData({
        vendorId: entry.vendor_id || entry.vendorId || "",
        contractShortName:
          entry.contract_short_name || entry.contractShortName || "",
        vendorName: entry.vendor_name || entry.vendorName || "",
        chargeDate:
          (entry.charge_date || entry.chargeDate)?.split("T")[0] || "",
        chargeAmount: entry.charge_amount || entry.chargeAmount || "",
        chargeCode: entry.charge_code || entry.chargeCode || "",
        status: entry.status || "Submitted",
        notes: entry.notes || "",
        pdfFilePath: entry.pdf_file_path || entry.pdfFilePath || "",
        plc: entry.plc || "",
        voucherNo: entry.voucher_no || entry.voucherNo || "",
        accounting: entry.accounting === true || entry.accounting === "true",
        dateProcessed: (entry.date_processed || entry.dateProcessed)?.split(
          "T",
        )[0],
      });
      setVendorSearch(entry.vendor_name || entry.vendorName || "");
      setContractSearch(
        entry.contract_short_name || entry.contractShortName || "",
      );
    }
  };

  const handleSave = async (e, shouldNotify = false) => {
    if (e) e.preventDefault();
    try {
      if (!import.meta.env.VITE_API_BASE_URL) {
        alert(
          "Saved locally (Static Demo Mode). Record changes are not persisted to a database.",
        );
        resetForm();
        return;
      }
      const url = editingEntry
        ? `${import.meta.env.VITE_API_BASE_URL}/vendor-expenses/${editingEntry.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/vendor-expenses/new`;

      const recordOwnerId = editingEntry
        ? editingEntry.user_id || editingEntry.userId || currentUserId
        : currentUserId;

      await fetch(url, {
        method: editingEntry ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          vendorId: formData.vendorId || formData.vendorName,
          userId: recordOwnerId,
          updatedByAdmin: currentUserId,
          shouldNotify,
        }),
      });

      if (onDataChanged) {
        await onDataChanged();
      }
      resetForm();
    } catch (err) {
      alert("Save error");
      console.error(err);
    }
  };

  const handleFindReplace = () => {
    if (!findValue) return alert("Enter a value to find.");
    const updatedFormData = { ...formData };
    let changed = false;
    Object.keys(updatedFormData).forEach((key) => {
      if (
        typeof updatedFormData[key] === "string" &&
        updatedFormData[key].includes(findValue)
      ) {
        updatedFormData[key] = updatedFormData[key].replaceAll(
          findValue,
          replaceValue,
        );
        changed = true;
      }
    });
    if (changed) {
      setFormData(updatedFormData);
      alert("Values replaced.");
    }
  };

  const groupedEntries = useMemo(() => {
    const source = Array.isArray(localEntries) ? localEntries : [];
    const validEntries = source.filter(
      (entry) =>
        entry &&
        (entry.prime_key || entry.primeKey) &&
        (entry.vendor_id || entry.vendorId),
    );

    // Apply optional Search Filter
    const filteredSource = validEntries.filter((entry) => {
      if (!searchValue) return true;
      const lowerVal = searchValue.toLowerCase();
      if (searchColumn === "all") {
        return Object.values(entry).some((v) =>
          String(v).toLowerCase().includes(lowerVal),
        );
      }
      return String(entry[searchColumn] || "")
        .toLowerCase()
        .includes(lowerVal);
    });

    // Keep the first record as the parent row and place all remaining
    // matching records beneath it. The existing expand/collapse control
    // determines whether those child rows are visible.
    return filteredSource.length > 0 ? [filteredSource] : [];
  }, [localEntries, searchColumn, searchValue]);

  if (!hasMounted)
    return <div className="p-6 text-white">Loading interface...</div>;

  const filteredVendors = vendorOptions.filter((v) =>
    (v.vend_name || "").toLowerCase().includes(vendorSearch.toLowerCase()),
  );
  const filteredContracts = derivedContractOptions.filter((c) =>
    (c.name || "").toLowerCase().includes(contractSearch.toLowerCase()),
  );

  return (
    <div className="min-h-screen text-gray-800 p-2">
      <div className="w-full">
        {/* Header */}
        <div className="p-4 w-full flex items-center rounded-sm bg-white">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            Vendor Expenses
          </h2>
          {/* <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-2 rounded-lg flex items-center gap-2">
              <img
                src={
                  userAvatar || "https://ui-avatars.com/api/?name=" + userName
                }
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-bold">{userName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
            >
              <LogOut />
            </button>
          </div> */}
        </div>

        {/* Input Form Setup */}
        {(isAdding || editingEntry) && (
          <div className="mb-8 p-6 border-2 border-blue-200 rounded-xl bg-blue-50 relative z-30 shadow-xl">
            <form onSubmit={(e) => handleSave(e, false)} className="space-y-6">
              {/* Row 1 & 2 Inputs: Now 4 grid boxes per row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <label className="input-label w-24">Vendor Name *</label>
                  <input
                    type="text"
                    className="input-style"
                    placeholder="Search or enter vendor name..."
                    value={vendorSearch || formData.vendorName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setVendorSearch(val);
                      setShowVendorDropdown(true);
                      setFormData((prev) => ({ ...prev, vendorName: val }));
                    }}
                    onFocus={() => setShowVendorDropdown(true)}
                  />
                  {showVendorDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {filteredVendors.map((vendor) => (
                        <div
                          key={vendor.vend_id}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b last:border-none flex justify-between"
                          onClick={() => {
                            handleVendorSelect(vendor);
                            setVendorSearch(vendor.vend_name);
                            setShowVendorDropdown(false);
                          }}
                        >
                          <span className="font-medium">
                            {vendor.vend_name}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {vendor.vend_id}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vendor ID (Editable Open Text Field) */}
                <div className="flex items-center gap-2">
                  <label className="input-label w-24">Vendor ID</label>
                  <input
                    id="vendorId"
                    type="text"
                    className="input-style"
                    placeholder="Enter Vendor ID"
                    value={formData.vendorId}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Contract */}
                <div className="flex items-center gap-2">
                  <label className="input-label w-24">Contract *</label>
                  <input
                    type="text"
                    className="input-style"
                    placeholder="Type to filter contracts..."
                    value={contractSearch}
                    disabled={!formData.vendorName && !formData.vendorId}
                    onChange={(e) => {
                      setContractSearch(e.target.value);
                      setShowContractDropdown(true);
                    }}
                    onFocus={() => setShowContractDropdown(true)}
                  />
                  {showContractDropdown &&
                    (formData.vendorName || formData.vendorId) && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredContracts.map((opt) => (
                          <div
                            key={opt.id}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b last:border-none"
                            onClick={() => {
                              handleContractChange({
                                target: { value: opt.name },
                              });
                              setContractSearch(opt.name);
                              setShowContractDropdown(false);
                            }}
                          >
                            {opt.name}
                          </div>
                        ))}
                      </div>
                    )}
                </div>

                {/* Amount */}
                <div className="flex items-center gap-2">
                  <label className="input-label w-24">Amount *</label>
                  <input
                    id="chargeAmount"
                    type="number"
                    step="0.01"
                    className="input-style"
                    value={formData.chargeAmount}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Date */}
                <div className="flex items-center gap-2">
                  <label className="input-label w-24">Date *</label>
                  <input
                    id="chargeDate"
                    type="date"
                    className="input-style"
                    value={formData.chargeDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Charge Code */}
                <div className="flex items-center gap-2">
                  <label className="input-label w-24">Charge Code *</label>
                  <select
                    id="chargeCode"
                    className="input-style"
                    value={formData.chargeCode}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.contractShortName}
                  >
                    <option value="">Select Code</option>
                    {derivedChargeCodeOptions.map((code) => (
                      <option key={code.id} value={code.value}>
                        {code.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                {/* Voucher No Element */}
                <div className="flex items-center gap-2">
                  <label className="input-label w-24">Voucher No</label>
                  <input
                    id="voucherNo"
                    type="text"
                    placeholder={
                      currentUserRole === "admin"
                        ? "Enter tracking number..."
                        : "—"
                    }
                    className="input-style"
                    value={formData.voucherNo}
                    onChange={handleInputChange}
                    disabled={currentUserRole !== "admin"}
                  />
                </div>

                {/* Accounting Status Toggle */}
                <div className="flex items-center gap-2">
                  <label className="input-label w-24 mr-12">
                    Accounting Status
                  </label>
                  <select
                    id="accounting"
                    className="input-style"
                    value={formData.accounting ? "true" : "false"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        accounting: e.target.value === "true",
                      }))
                    }
                    disabled={currentUserRole !== "admin"}
                  >
                    <option value="false">⏳ Pending Review</option>
                    <option value="true">✅ Cleared / Processed</option>
                  </select>
                </div>

                {/* Date Processed Datepicker */}
                <div className="flex items-center gap-2">
                  <label className="input-label w-24 mr-11">
                    Date Processed
                  </label>
                  <input
                    id="dateProcessed"
                    type="date"
                    className="input-style"
                    value={formData.dateProcessed}
                    onChange={handleInputChange}
                    disabled={currentUserRole !== "admin"}
                  />
                </div>
              </div>

              {/* File Path and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <label className="input-label w-24">File Path *</label>
                  <input
                    id="pdfFilePath"
                    type="text"
                    className="input-style"
                    value={formData.pdfFilePath}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="input-label w-24 mr-26">
                    Notes / Rejection Reason
                  </label>
                  <textarea
                    id="notes"
                    rows="1"
                    className="input-style"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Status controls */}
              <div className="p-4 bg-white border-2 border-dashed rounded-lg flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {[
                    { label: "Submitted", value: "Submitted" },
                    { label: "Approved", value: "Approved" },
                    { label: "Rejected", value: "Rejected" },
                  ].map((status) => (
                    <label
                      key={status.value}
                      className="flex items-center gap-2 cursor-pointer text-sm font-medium"
                    >
                      <input
                        type="radio"
                        name="expenseStatus"
                        value={status.value}
                        checked={formData.status === status.value}
                        onChange={() => setStatus(status.value)}
                        className="h-4 w-4 accent-blue-600"
                      />
                      {status.label}
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn1  bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1"
                    // className="px-4 py-2 text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn1 btn-blue flex items-center gap-1"
                  >
                    {/* <Save size={11} />  */}
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Combined Action Row */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3 mb-4 bg-gray-100 p-3 rounded-lg shadow-sm mt-3">
          <div className="flex gap-2">
            {!isAdding && !editingEntry && (
              <button
                onClick={() => {
                  resetForm();
                  setIsAdding(true);
                }}
                className="btn1 btn-blue flex items-center gap-1 text-xs"
              >
                {/* <Plus size={15} />  */}
                Add
              </button>
            )}
            <button
              disabled={selectedRows.size !== 1}
              onClick={startEdit}
              className="btn1 btn-blue flex items-center gap-1 text-xs"
            >
              {/* <Pencil size={15} /> */}
              Edit
            </button>
            <button
              type="button"
              disabled={selectedRows.size !== 1}
              onClick={() => {
                const selectedId = Array.from(selectedRows)[0];
                const targetEntry = localEntries.find(
                  (e) => e.id === selectedId,
                );
                if (targetEntry) setViewingRecord(targetEntry);
              }}
              className="btn1 btn-blue flex items-center gap-1"
            >
              {/* <FileText size={12} className="text-gray-500" />  */}
              View Record
            </button>
            <button
              type="button"
              onClick={handleExportToExcel}
              className="btn1 btn-blue flex items-center gap-1"
            >
              {/* <Download size={12} /> */}
              {selectedRows.size > 0
                ? `Export Selected (${selectedRows.size})`
                : "Export"}
            </button>
          </div>

          <div className="flex flex-grow items-center gap-3 w-full xl:w-auto">
            <div className="flex items-center border rounded-lg bg-white flex-grow shadow-sm h-9">
              <select
                value={searchColumn}
                onChange={(e) => setSearchColumn(e.target.value)}
                className="px-2 py-1.5 bg-transparent border-r text-xs font-medium outline-none"
              >
                {searchableColumns.map((col) => (
                  <option key={col.key} value={col.key}>
                    {col.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Quick search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full px-2 py-1.5 text-xs outline-none"
              />
              <Search size={12} className="text-gray-400 mx-2" />
            </div>
            <label className="flex items-center cursor-pointer gap-1.5 text-xs font-bold bg-white px-2 py-1.5 rounded-lg border shadow-sm">
              Latest Only
              <input
                type="checkbox"
                checked={showOnlyLatest}
                onChange={(e) => setShowOnlyLatest(e.target.checked)}
                className="w-4 h-3"
              />
            </label>
          </div>
        </div>

        {/* Data Table */}
        <div className="border-line">
          <div className="synchronized-tables-container flex w-full">
            <table className="min-w-full border-collapse text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-600">
                <tr>
                  <th className="p-4 w-12 text-center"></th>
                  <th className="text-center px-6 py-3">Record</th>
                  <th className="text-center px-6 py-3">Charge Code</th>
                  <th className="text-center px-6 py-3">Vendor Name</th>
                  <th className="text-center px-6 py-3">Status</th>
                  <th className="text-center px-6 py-3">Voucher No</th>
                  <th className="text-center px-6 py-3">Accounting</th>
                  <th className="text-center px-6 py-3">Date Processed</th>
                  <th className="p-3 text-center font-bold text-gray-700">
                    PDF Path
                  </th>
                  <th className="p-3 text-center font-bold text-gray-700">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-center pr-8">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {groupedEntries.map((group) => {
                  const baseKey = String(
                    group[0].prime_key || group[0].primeKey || "",
                  ).split(".")[0];
                  const hasHistory = group.length > 1;
                  const parent = group[0];

                  return (
                    <React.Fragment key={parent.id}>
                      <tr
                        onClick={() => toggleRowSelection(parent.id)}
                        className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${selectedRows.has(parent.id) ? "bg-blue-50/50" : ""}`}
                      >
                        <td
                          className="p-4 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selectedRows.has(parent.id)}
                            onChange={() => toggleRowSelection(parent.id)}
                          />
                        </td>
                        <td className="px-6 py-3 font-bold">
                          {hasHistory && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const next = new Set(expandedRows);
                                next.has(baseKey)
                                  ? next.delete(baseKey)
                                  : next.add(baseKey);
                                setExpandedRows(next);
                              }}
                              className="mr-2 text-gray-400 hover:text-indigo-600"
                            >
                              {expandedRows.has(baseKey) ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronRight size={14} />
                              )}
                            </button>
                          )}
                          {parent.prime_key || parent.primeKey}
                        </td>
                        <td className="px-6 py-3 font-mono text-gray-600 text-center">
                          {parent.credit_card ||
                            parent.creditCard ||
                            parent.contract_short_name ||
                            parent.contractShortName ||
                            "—"}
                        </td>
                        <td className="px-6 py-3 text-gray-900 font-medium text-center">
                          {parent.vendor_name || parent.vendorName}
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                              (parent.status || "Submitted") === "Approved"
                                ? "bg-green-100 text-green-800"
                                : (parent.status || "Submitted") === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : (parent.status || "Submitted") ===
                                      "Rejected"
                                    ? "bg-red-100 text-red-700"
                                    : (parent.status || "Submitted") ===
                                        "Submitted"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {parent.status || "Submitted"}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-mono text-gray-700 font-medium text-center">
                          {parent.voucher_no || parent.voucherNo || "—"}
                        </td>
                        <td className="px-6 py-3 text-center">
                          {parent.accounting === true ||
                          parent.accounting === "true" ? (
                            <span className="text-black font-semibold">
                              Cleared
                            </span>
                          ) : (
                            <span className="text-gray-400">⏳ Pending</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-gray-500 text-center">
                          {parent.date_processed || parent.dateProcessed
                            ? new Date(
                                parent.date_processed || parent.dateProcessed,
                              ).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-6 py-3 truncate max-w-[200px] text-center">
                          {parent.pdf_file_path || parent.pdfFilePath ? (
                            <a
                              href={
                                (
                                  parent.pdf_file_path || parent.pdfFilePath
                                ).startsWith("http")
                                  ? parent.pdf_file_path || parent.pdfFilePath
                                  : `file:///${parent.pdf_file_path || parent.pdfFilePath}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 font-medium hover:underline flex items-center justify-center gap-1 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FileText
                                size={14}
                                className="shrink-0 text-blue-600"
                              />
                              <span className="truncate">
                                {parent.pdf_file_path || parent.pdfFilePath}
                              </span>
                            </a>
                          ) : (
                            <span className="text-gray-400 italic text-xs">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-gray-600 truncate max-w-[200px] text-center">
                          {parent.notes || "-"}
                        </td>
                        <td className="px-6 py-3 text-right font-black pr-8">
                          $
                          {parseFloat(
                            parent.charge_amount ||
                              parent.chargeAmount ||
                              parent.amount ||
                              0,
                          ).toFixed(2)}
                        </td>
                      </tr>

                      {expandedRows.has(baseKey) &&
                        group.slice(1).map((hEntry) => (
                          <tr
                            key={hEntry.id}
                            className="hover:bg-blue-50/40 transition-colors"
                          >
                            <td className="p-4"></td>
                            <td className="px-6 py-3 pl-12 font-bold text-left">
                              {hEntry.prime_key || hEntry.primeKey}
                            </td>
                            <td className="px-6 py-3 font-mono text-gray-600 text-center">
                              {hEntry.credit_card ||
                                hEntry.creditCard ||
                                hEntry.contract_short_name ||
                                hEntry.contractShortName ||
                                "—"}
                            </td>
                            <td className="px-6 py-3 text-center">
                              {hEntry.vendor_name || hEntry.vendorName}
                            </td>
                            {/* ```jsx */}
                            <td className="px-6 py-3 text-center">
                              <span
                                className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                                  (hEntry.status || "Submitted") === "Approved"
                                    ? "bg-green-100 text-green-800"
                                    : (hEntry.status || "Submitted") ===
                                        "Pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : (hEntry.status || "Submitted") ===
                                          "Rejected"
                                        ? "bg-red-100 text-red-700"
                                        : (hEntry.status || "Submitted") ===
                                            "Submitted"
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {hEntry.status || "Submitted"}
                              </span>
                            </td>
                            <td className="px-6 py-3 font-mono text-gray-600 text-center">
                              {hEntry.voucher_no || hEntry.voucherNo || "—"}
                            </td>
                            <td className="px-6 py-3 text-center">
                              {hEntry.accounting === true ||
                              hEntry.accounting === "true"
                                ? "Cleared"
                                : "Pending"}
                            </td>
                            <td className="px-6 py-3 text-center">
                              {hEntry.date_processed || hEntry.dateProcessed
                                ? new Date(
                                    hEntry.date_processed ||
                                      hEntry.dateProcessed,
                                  ).toLocaleDateString()
                                : "—"}
                            </td>
                            <td className="px-6 py-3 truncate max-w-[200px] text-center">
                              {hEntry.pdf_file_path || hEntry.pdfFilePath ? (
                                <a
                                  href={
                                    (
                                      hEntry.pdf_file_path || hEntry.pdfFilePath
                                    ).startsWith("http")
                                      ? hEntry.pdf_file_path ||
                                        hEntry.pdfFilePath
                                      : `file:///${hEntry.pdf_file_path || hEntry.pdfFilePath}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 font-medium hover:underline flex items-center gap-1 text-xs"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <FileText
                                    size={14}
                                    className="shrink-0 text-blue-600"
                                  />
                                  <span className="truncate">
                                    {hEntry.pdf_file_path || hEntry.pdfFilePath}
                                  </span>
                                </a>
                              ) : (
                                <span className="text-gray-400 italic text-xs">
                                  —
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-3 text-gray-600 truncate max-w-[200px text-center">
                              {hEntry.notes || "-"}
                            </td>
                            <td className="px-6 py-3 text-right font-black pr-8">
                              $
                              {parseFloat(
                                hEntry.charge_amount ||
                                  hEntry.chargeAmount ||
                                  hEntry.amount ||
                                  0,
                              ).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-Over Overlay Audit Panel Component */}
      {viewingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs text-xs animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setViewingRecord(null)}
          />
          <div className="h-full w-full max-w-md bg-white p-6 shadow-2xl border-l border-gray-200 flex flex-col justify-between relative z-10 animate-in slide-in-from-right duration-200">
            <div>
              <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-3">
                <h2 className="text-sm font-bold text-gray-900">
                  Record No :{" "}
                  <span className="font-mono text-indigo-600">
                    {viewingRecord.prime_key || viewingRecord.primeKey}
                  </span>
                </h2>
                <button
                  onClick={() => setViewingRecord(null)}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-gray-50 rounded border">
                    <p className="font-bold text-gray-400 mb-0.5">
                      Total Value
                    </p>
                    <p className="text-gray-900 font-bold">
                      $
                      {parseFloat(
                        viewingRecord.charge_amount ||
                          viewingRecord.chargeAmount ||
                          viewingRecord.amount ||
                          0,
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 border-y py-3 border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vendor Name :</span>
                    <span className="text-gray-900 font-medium">
                      {viewingRecord.vendor_name || viewingRecord.vendorName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status :</span>
                    <span className="text-gray-900 font-medium">
                      {viewingRecord.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Voucher No :</span>
                    <span className="text-indigo-700 font-mono font-bold">
                      {viewingRecord.voucher_no ||
                        viewingRecord.voucherNo ||
                        "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Accounting :</span>
                    <span className="text-gray-900 font-medium">
                      {viewingRecord.accounting === true ||
                      viewingRecord.accounting === "true"
                        ? "✅ Cleared"
                        : "⏳ Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date Processed :</span>
                    <span className="text-gray-900 font-medium">
                      {viewingRecord.date_processed ||
                      viewingRecord.dateProcessed
                        ? new Date(
                            viewingRecord.date_processed ||
                              viewingRecord.dateProcessed,
                          ).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-gray-400 mb-1">Charge Code</p>
                  <p className="font-mono text-gray-800 bg-gray-50 p-2 rounded border border-gray-200">
                    {viewingRecord.charge_code ||
                      viewingRecord.chargeCode ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-gray-400 mb-1">PDF File Path</p>
                  <div className="bg-gray-50 p-2 rounded border border-gray-200 break-all">
                    {viewingRecord.pdf_file_path ||
                    viewingRecord.pdfFilePath ? (
                      <a
                        href={
                          (
                            viewingRecord.pdf_file_path ||
                            viewingRecord.pdfFilePath
                          ).startsWith("http")
                            ? viewingRecord.pdf_file_path ||
                              viewingRecord.pdfFilePath
                            : `file:///${viewingRecord.pdf_file_path || viewingRecord.pdfFilePath}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-medium hover:underline flex items-center gap-1 text-xs"
                      >
                        <FileText
                          size={14}
                          className="shrink-0 text-blue-600"
                        />
                        {viewingRecord.pdf_file_path ||
                          viewingRecord.pdfFilePath}
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">—</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="font-bold text-gray-400 mb-1">Notes</p>
                  <p className="text-gray-600 italic bg-gray-50 p-2 rounded border border-gray-200">
                    {viewingRecord.notes || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-6">
              <button
                onClick={() => setViewingRecord(null)}
                className="w-full rounded-lg bg-gray-900 py-2.5 text-center font-bold text-white hover:bg-gray-800 transition-colors"
              >
                Dismiss View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendor_Expenses;
