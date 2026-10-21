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

// --- MOCK DATA ---
const MOCK_CREDIT_CARDS = [
  { id: 1, name: "Amex - 1001 (Corporate)" },
  { id: 2, name: "Visa - 4055 (Marketing)" },
  { id: 3, name: "Mastercard - 9090 (Operations)" },
];

const MOCK_VENDORS = [
  { vend_id: "V-001", vend_name: "Amazon Web Services" },
  { vend_id: "V-002", vend_name: "GitHub Inc." },
  { vend_id: "V-003", vend_name: "Adobe Systems" },
  { vend_id: "V-004", vend_name: "Delta Airlines" },
  { vend_id: "V-005", vend_name: "Hilton Hotels" },
];

const MOCK_PROJECTS = [
  { proj_id: "ALPHA.001", proj_name: "Alpha Phase 1 Development" },
  { proj_id: "ALPHA.002", proj_name: "Alpha Phase 2 Testing" },
  { proj_id: "BETA.001", proj_name: "Beta Cloud Migration" },
  { proj_id: "MAINTENANCE", proj_name: "General Internal Maintenance" },
];

const MOCK_PLCS = [
  { plc_code: "ENG-SR" },
  { plc_code: "ENG-JR" },
  { plc_code: "PM" },
  { plc_code: "QA" },
];

const MOCK_EXPENSES = [
  {
    id: "exp-1",
    prime_key: "1042.1",
    credit_card: "Amex - 1001 (Corporate)",
    vendor_id: "V-001",
    vendor_name: "Amazon Web Services",
    contract_short_name: "ALPHA",
    charge_code: "ALPHA.001",
    status: "Approved",
    charge_amount: 1450.5,
    voucher_no: "VN-8832",
    accounting: true,
    date_processed: "2026-10-01",
    pdf_file_path: "https://example.com/receipts/aws-oct.pdf",
    notes: "Monthly cloud hosting infrastructure",
  },
  {
    id: "exp-2",
    prime_key: "1043.1",
    credit_card: "Visa - 4055 (Marketing)",
    vendor_id: "V-003",
    vendor_name: "Adobe Systems",
    contract_short_name: "MAINTENANCE",
    charge_code: "MAINTENANCE",
    status: "Submitted",
    charge_amount: 54.99,
    voucher_no: "",
    accounting: false,
    date_processed: "",
    pdf_file_path: "C:/Users/Downloads/adobe_invoice.pdf",
    notes: "Creative Cloud Subscription",
  },
  {
    id: "exp-3",
    prime_key: "1044.1",
    credit_card: "Mastercard - 9090 (Operations)",
    vendor_id: "V-004",
    vendor_name: "Delta Airlines",
    contract_short_name: "BETA",
    charge_code: "BETA.001",
    status: "Rejected",
    charge_amount: 450.0,
    voucher_no: "",
    accounting: false,
    date_processed: "",
    pdf_file_path: "ticket-delta-404.pdf",
    notes: "Flight to client site (Exceeded budget allowance)",
  },
];
// -----------------

const CreditCardExpenses = ({
  dataEntries = MOCK_EXPENSES,
  isLoading = false,
  userName = "Admin User",
  userAvatar,
  handleLogout = () => alert("Logged out!"),
  currentUserRole = "admin",
  currentUserId = "user-123",
  onDataChanged,
  creditCardOptions = MOCK_CREDIT_CARDS,
}) => {
  const [projectOptions, setProjectOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
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

  const [formData, setFormData] = useState({
    creditCard: "",
    vendorId: "",
    vendorName: "",
    contractShortName: "",
    chargeDate: "",
    chargeAmount: "",
    pmEmail: "",
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
  const [vendorSearch, setVendorSearch] = useState("");
  const [contractSearch, setContractSearch] = useState("");
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [showContractDropdown, setShowContractDropdown] = useState(false);
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  const [advancedFilters, setAdvancedFilters] = useState({
    creditCard: "",
    vendorId: "",
    contractShortName: "",
    status: "",
  });
  const [findValue, setFindValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");

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

  const searchableColumns = [
    { key: "all", name: "All Fields" },
    { key: "creditCard", name: "Credit Card" },
    { key: "vendorId", name: "Vendor ID" },
    { key: "vendorName", name: "Vendor Name" },
    { key: "contractShortName", name: "Contract" },
  ];

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
    const contractKey = formData.contractShortName.trim().toLowerCase();
    const subLevels = projectOptions
      .filter(
        (p) =>
          p.proj_id &&
          p.proj_id.trim().toLowerCase().startsWith(`${contractKey}.`),
      )
      .map((p, i) => ({
        id: `cc-${i}`,
        value: p.proj_id,
        label: `${p.proj_id} - ${p.proj_name}`,
      }));

    if (subLevels.length > 0) return subLevels;

    const exactMatch = projectOptions.find(
      (p) => p.proj_id && p.proj_id.trim().toLowerCase() === contractKey,
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
    return [];
  }, [formData.contractShortName, projectOptions]);

  // Replaced API fetches with Mock Data assignments
  useEffect(() => {
    if (!formData.chargeCode) {
      setPlcOptions([]);
      return;
    }
    setPlcOptions(MOCK_PLCS);
  }, [formData.chargeCode]);

  useEffect(() => {
    setLocalEntries(dataEntries || []);
  }, [dataEntries]);

  useEffect(() => {
    setVendorOptions(MOCK_VENDORS);
  }, []);

  useEffect(() => {
    setProjectOptions(MOCK_PROJECTS);
  }, []);

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
      alert("Permission Denied: Only Admins can Approve or Reject.");
      return;
    }
    setFormData((prev) => ({ ...prev, status: newStatus }));
  };

  const resetForm = () => {
    setFormData({
      creditCard: "",
      vendorId: "",
      vendorName: "",
      contractShortName: "",
      chargeDate: "",
      chargeAmount: "",
      pmEmail: "",
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
        creditCard: entry.credit_card || entry.creditCard || "",
        vendorId: entry.vendor_id || entry.vendorId || "",
        vendorName: entry.vendor_name || entry.vendorName || "",
        contractShortName:
          entry.contract_short_name || entry.contractShortName || "",
        chargeDate:
          (entry.charge_date || entry.chargeDate)?.split("T")[0] || "",
        chargeAmount: entry.charge_amount || entry.chargeAmount || "",
        pmEmail: entry.pm_email || entry.pmEmail || "",
        chargeCode: entry.charge_code || entry.chargeCode || "",
        status: entry.status || "Submitted",
        notes: entry.notes || "",
        pdfFilePath: entry.pdf_file_path || entry.pdfFilePath || "",
        plc: entry.plc || "",
        voucherNo: entry.voucher_no || entry.voucherNo || "",
        accounting: entry.accounting === true || entry.accounting === "true",
        dateProcessed:
          (entry.date_processed || entry.dateProcessed)?.split("T")[0] || "",
      });
      setVendorSearch(entry.vendor_name || entry.vendorName || "");
      setContractSearch(
        entry.contract_short_name || entry.contractShortName || "",
      );
    }
  };

  // Replaced API save with local state mutation
  const handleSave = async (e, shouldNotify = false) => {
    if (e) e.preventDefault();
    try {
      const newEntry = {
        id: editingEntry ? editingEntry.id : `exp-new-${Date.now()}`,
        prime_key: editingEntry
          ? editingEntry.prime_key
          : `${Math.floor(Math.random() * 1000) + 1000}.1`,
        credit_card: formData.creditCard,
        vendor_id: formData.vendorId,
        vendor_name: formData.vendorName,
        contract_short_name: formData.contractShortName,
        charge_code: formData.chargeCode,
        charge_amount: formData.chargeAmount,
        status: formData.status,
        notes: formData.notes,
        pdf_file_path: formData.pdfFilePath,
        voucher_no: formData.voucherNo,
        accounting: formData.accounting,
        date_processed: formData.dateProcessed,
      };

      if (editingEntry) {
        setLocalEntries((prev) =>
          prev.map((item) => (item.id === editingEntry.id ? newEntry : item)),
        );
      } else {
        setLocalEntries((prev) => [newEntry, ...prev]);
      }

      alert(
        `Record ${editingEntry ? "updated" : "added"} successfully (Mock Data)!`,
      );

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
    const groups = localEntries.reduce((acc, entry) => {
      const baseKey = String(entry.prime_key || entry.primeKey || "").split(
        ".",
      )[0];
      if (!baseKey) return acc;
      if (!acc[baseKey]) acc[baseKey] = [];
      acc[baseKey].push(entry);
      return acc;
    }, {});

    for (const key in groups) {
      groups[key].sort(
        (a, b) =>
          parseFloat(b.prime_key || b.primeKey || 0) -
          parseFloat(a.prime_key || a.primeKey || 0),
      );
    }

    let filteredGroups = Object.values(groups);
    filteredGroups = filteredGroups.filter((group) =>
      group.some((e) => {
        const matchesBasic =
          searchValue === "" ||
          (searchColumn === "all"
            ? Object.values(e).some((v) =>
                String(v).toLowerCase().includes(searchValue.toLowerCase()),
              )
            : String(e[searchColumn] || "")
                .toLowerCase()
                .includes(searchValue.toLowerCase()));
        const matchesAdvCard =
          !advancedFilters.creditCard ||
          String(e.credit_card || e.creditCard).includes(
            advancedFilters.creditCard,
          );
        const matchesAdvVendor =
          !advancedFilters.vendorId ||
          String(e.vendor_id || e.vendorId).includes(advancedFilters.vendorId);
        const matchesAdvContract =
          !advancedFilters.contractShortName ||
          String(e.contract_short_name || e.contractShortName).includes(
            advancedFilters.contractShortName,
          );
        const matchesAdvStatus =
          !advancedFilters.status || e.status === advancedFilters.status;
        return (
          matchesBasic &&
          matchesAdvCard &&
          matchesAdvVendor &&
          matchesAdvContract &&
          matchesAdvStatus
        );
      }),
    );

    filteredGroups.sort((groupA, groupB) => {
      const entryA = groupA[0];
      const entryB = groupB[0];

      const statusA = (entryA.status || "").toLowerCase();
      const statusB = (entryB.status || "").toLowerCase();

      const isPendingA =
        statusA !== "approved" && statusA !== "rejected" && statusA !== "paid";
      const isPendingB =
        statusB !== "approved" && statusB !== "rejected" && statusB !== "paid";

      if (isPendingA && !isPendingB) return -1;
      if (!isPendingA && isPendingB) return 1;

      const numA =
        parseInt(
          String(entryA.prime_key || entryA.primeKey || "").split(".")[0],
          10,
        ) || 0;
      const numB =
        parseInt(
          String(entryB.prime_key || entryB.primeKey || "").split(".")[0],
          10,
        ) || 0;

      return numB - numA;
    });

    return showOnlyLatest ? filteredGroups.map((g) => [g[0]]) : filteredGroups;
  }, [
    localEntries,
    searchColumn,
    searchValue,
    showOnlyLatest,
    advancedFilters,
  ]);

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
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-blue-800 tracking-tighter">
            Credit Card Expenses
          </h1>
          {/* <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-2 rounded-lg flex items-center gap-2 border">
              <img src={userAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"} alt="Avatar" className="w-8 h-8 rounded-full" />
              <span className="text-sm font-bold">{userName}</span>
            </div>
            <button onClick={handleLogout} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"><LogOut/></button>
          </div> */}
        </div>

        {/* Input Form Setup */}
        {(isAdding || editingEntry) && (
          <div className="mb-8 p-6 border-2 border-blue-200 rounded-xl bg-blue-50 relative z-30 shadow-xl">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Credit Card */}
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Credit Card *
                  </label>
                  <select
                    id="creditCard"
                    className="w-full p-2 border rounded bg-white"
                    value={formData.creditCard}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Card</option>
                    {creditCardOptions.map((opt) => (
                      <option key={opt.id} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vendor Name */}
                <div className="relative">
                  <label className="block text-xs font-bold mb-1">
                    Vendor Name *
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded bg-white"
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
                          key={vendor.id || vendor.vend_id}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b last:border-none"
                          onClick={() => {
                            handleVendorSelect(vendor);
                            setVendorSearch(vendor.vend_name);
                            setShowVendorDropdown(false);
                          }}
                        >
                          <span className="font-medium">
                            {vendor.vend_name}
                          </span>{" "}
                          <span className="text-gray-400 text-xs">
                            ({vendor.vend_id})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Vendor ID */}
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Vendor ID
                  </label>
                  <input
                    id="vendorId"
                    type="text"
                    className="w-full p-2 border rounded bg-white font-mono"
                    placeholder="Enter Vendor ID"
                    value={formData.vendorId}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Contract */}
                <div className="relative">
                  <label className="block text-xs font-bold mb-1">
                    Contract *
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded bg-white disabled:bg-gray-100"
                    placeholder="Search Contract..."
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
                <div>
                  <label className="block text-xs font-bold mb-1 ">
                    Amount *
                  </label>
                  <input
                    id="chargeAmount"
                    type="number"
                    step="0.01"
                    className="w-full p-2 border rounded bg-white"
                    value={formData.chargeAmount}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold mb-1 ">
                    Date *
                  </label>
                  <input
                    id="chargeDate"
                    type="date"
                    className="w-full p-2 border rounded bg-white"
                    value={formData.chargeDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Charge Code */}
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Charge Code *
                  </label>
                  <select
                    id="chargeCode"
                    className="w-full p-2 border rounded bg-white"
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
                {/* Voucher No */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-gray-700">
                    Voucher No
                  </label>
                  <input
                    id="voucherNo"
                    type="text"
                    placeholder={
                      currentUserRole === "admin"
                        ? "Enter tracking number..."
                        : "—"
                    }
                    className="w-full p-2 border rounded bg-white disabled:bg-gray-100 disabled:text-gray-400 font-mono"
                    value={formData.voucherNo}
                    onChange={handleInputChange}
                    disabled={currentUserRole !== "admin"}
                  />
                </div>

                {/* Accounting */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-gray-700">
                    Accounting Status
                  </label>
                  <select
                    id="accounting"
                    className="w-full p-2 border rounded bg-white disabled:bg-gray-100 disabled:text-gray-400 font-medium"
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

                {/* Date Processed */}
                <div>
                  <label className="block text-xs font-bold mb-1 text-gray-700">
                    Date Processed
                  </label>
                  <input
                    id="dateProcessed"
                    type="date"
                    className="w-full p-2 border rounded bg-white disabled:bg-gray-100 disabled:text-gray-400"
                    value={formData.dateProcessed}
                    onChange={handleInputChange}
                    disabled={currentUserRole !== "admin"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* File Path */}
                <div>
                  <label className="block text-xs font-bold mb-1">
                    File Path *
                  </label>
                  <input
                    id="pdfFilePath"
                    type="text"
                    className="w-full p-2 border rounded bg-white"
                    value={formData.pdfFilePath}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold mb-1 text-gray-500">
                    Notes / Reason
                  </label>
                  <textarea
                    id="notes"
                    rows="1"
                    className={`w-full p-2 border rounded bg-white ${userName === "Revolve" && formData.status === "Rejected" ? "border-red-500" : ""}`}
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="p-4 bg-white border-2 border-dashed rounded-lg flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus("Submitted")}
                    className={`px-4 py-2 rounded font-bold text-xs transition-all ${formData.status === "Submitted" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}
                  >
                    Submitted
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("Approved")}
                    className={`px-4 py-2 rounded font-bold text-xs transition-all ${formData.status === "Approved" ? "bg-green-600 text-white shadow-md" : "bg-gray-100 text-gray-400"} ${currentUserRole !== "admin" ? "opacity-30" : ""}`}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("Rejected")}
                    className={`px-4 py-2 rounded font-bold text-xs transition-all ${formData.status === "Rejected" ? "bg-red-600 text-white shadow-md" : "bg-gray-100 text-gray-400"} ${currentUserRole !== "admin" ? "opacity-30" : ""}`}
                  >
                    Reject
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 bg-gray-200 rounded font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-2 rounded font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <Save size={18} /> Save Record
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
          <div className="flex flex-wrap gap-3">
            {!isAdding && !editingEntry && (
              <button
                onClick={() => {
                  resetForm();
                  setIsAdding(true);
                }}
                className="bg-yellow-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-md hover:bg-yellow-600 transition"
              >
                <Plus size={20} /> Add
              </button>
            )}
            <button
              disabled={selectedRows.size !== 1}
              onClick={startEdit}
              className="bg-gray-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 font-bold transition"
            >
              <Pencil size={20} /> Edit
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
              className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg flex items-center gap-2 text-xs font-bold shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <FileText size={16} className="text-gray-500" /> View Record
            </button>
            <button
              type="button"
              onClick={handleExportToExcel}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-xs font-bold shadow-md hover:bg-emerald-700 transition-all"
            >
              <Download size={16} />
              {selectedRows.size > 0
                ? `Export Selected (${selectedRows.size})`
                : "Export All to Excel"}
            </button>
          </div>

          <div className="flex flex-grow items-center gap-3 w-full xl:w-auto">
            <div className="flex items-center border rounded-lg bg-white flex-grow shadow-sm">
              <select
                value={searchColumn}
                onChange={(e) => setSearchColumn(e.target.value)}
                className="p-2 bg-transparent border-r text-sm font-medium outline-none"
              >
                {searchableColumns.map((col) => (
                  <option key={col.key} value={col.key}>
                    {col.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search entries..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full p-2 text-sm outline-none"
              />
              <Search size={18} className="text-gray-400 mx-2" />
            </div>
            <label className="flex items-center cursor-pointer gap-2 text-sm font-bold bg-white p-2 rounded-lg border shadow-sm">
              Latest Only
              <input
                type="checkbox"
                checked={showOnlyLatest}
                onChange={(e) => setShowOnlyLatest(e.target.checked)}
                className="w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto whitespace-nowrap">
          <table className="min-w-full border-collapse text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-600">
              <tr>
                <th className="p-4 w-12 text-center"></th>
                <th className="px-6 py-3">Record</th>
                <th className="px-6 py-3">Reference / Code</th>
                <th className="px-6 py-3">Vendor Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Voucher No</th>
                <th className="px-6 py-3">Accounting</th>
                <th className="px-6 py-3">Date Processed</th>
                <th className="p-3 text-left border-b font-bold text-gray-700">
                  PDF Path
                </th>
                <th className="p-3 text-left border-b font-bold text-gray-700">
                  Notes
                </th>
                <th className="px-6 py-3 text-right pr-8">Amount</th>
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
                      <td className="px-6 py-3 font-mono text-gray-600">
                        {parent.credit_card ||
                          parent.creditCard ||
                          parent.contract_short_name ||
                          parent.contractShortName ||
                          "—"}
                      </td>
                      <td className="px-6 py-3 text-gray-900 font-medium">
                        {parent.vendor_name || parent.vendorName}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${parent.status === "Approved" ? "bg-green-100 text-green-700" : parent.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                        >
                          {parent.status || "Submitted"}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-mono text-gray-700 font-medium">
                        {parent.voucher_no || parent.voucherNo || "—"}
                      </td>
                      <td className="px-6 py-3">
                        {parent.accounting === true ||
                        parent.accounting === "true" ? (
                          <span className="text-green-600 font-semibold">
                            ✅ Cleared
                          </span>
                        ) : (
                          <span className="text-gray-400">⏳ Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-gray-500">
                        {parent.date_processed || parent.dateProcessed
                          ? new Date(
                              parent.date_processed || parent.dateProcessed,
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-6 py-3 truncate max-w-[200px]">
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
                            className="text-blue-600 font-medium hover:underline flex items-center gap-1 text-xs"
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

                      <td className="px-6 py-3 text-gray-600 truncate max-w-[200px]">
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
                          className="bg-gray-50 italic text-gray-400 border-l-4 border-yellow-400"
                        >
                          <td className="p-4"></td>
                          <td className="px-6 py-2 pl-12 font-bold">
                            {hEntry.prime_key || hEntry.primeKey}
                          </td>
                          <td className="px-6 py-2 font-mono">
                            {hEntry.credit_card ||
                              hEntry.creditCard ||
                              hEntry.contract_short_name ||
                              hEntry.contractShortName ||
                              "—"}
                          </td>
                          <td className="px-6 py-2">
                            {hEntry.vendor_name || hEntry.vendorName}
                          </td>
                          <td className="px-6 py-2 text-xs">
                            {hEntry.status || "Submitted"}
                          </td>
                          <td className="px-6 py-2 font-mono">
                            {hEntry.voucher_no || hEntry.voucherNo || "—"}
                          </td>
                          <td className="px-6 py-2">
                            {hEntry.accounting === true ||
                            hEntry.accounting === "true"
                              ? "Cleared"
                              : "Pending"}
                          </td>
                          <td className="px-6 py-2">
                            {hEntry.date_processed || hEntry.dateProcessed
                              ? new Date(
                                  hEntry.date_processed || hEntry.dateProcessed,
                                ).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="px-6 py-2 truncate max-w-[200px]">
                            {hEntry.pdf_file_path || hEntry.pdfFilePath ? (
                              <a
                                href={
                                  (
                                    hEntry.pdf_file_path || hEntry.pdfFilePath
                                  ).startsWith("http")
                                    ? hEntry.pdf_file_path || hEntry.pdfFilePath
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
                          <td className="px-6 py-2 text-gray-600 truncate max-w-[200px]">
                            {hEntry.notes || "-"}
                          </td>
                          <td className="px-6 py-2 text-right pr-8">
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

        {/* Record Viewing Modal */}
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
                    <p className="font-bold text-gray-400 mb-1">
                      PDF File Path
                    </p>
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
    </div>
  );
};

export default CreditCardExpenses;
