import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Smartphone,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Power,
  ShieldCheck,
  Key,
  Copy,
  Check,
  X,
  AlertTriangle,
  Eye,
  Wand2,
  Clock,
} from "lucide-react";
import { backendUrl } from "./config";

const geistSansStyle = { fontFamily: "'Geist', 'Geist Fallback', sans-serif" };

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    JSON.parse(localStorage.getItem("currentUser") || "{}")?.token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

// Helper: Generate a valid client UUID v4
const generateUUID = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Helper: Generate a short placeholder Public Key
const generateMockPublicKey = (deviceName) => {
  const randomHex = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `PUB_KEY_${randomHex}`;
};

const AuthorizedDevice = () => {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "inactive"

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [viewKeyDevice, setViewKeyDevice] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Current user info for auto-filling registeredBy
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const currentUserName =
    currentUser?.name || currentUser?.username || currentUser?.email || "";

  // Form State
  const initialFormState = {
    deviceName: "",
    macAddress: "",
    publicKey: "",
    deviceId: "",
    registeredBy: currentUserName,
    isActive: true,
  };
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch devices (GET api/AuthorizedDevice)
  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (statusFilter === "active") params.isActive = true;
      if (statusFilter === "inactive") params.isActive = false;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await axios.get(`${backendUrl}/api/AuthorizedDevice`, {
        params,
        headers: getAuthHeaders(),
        withCredentials: false,
      });
      setDevices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (err.message?.includes("Network Error")
          ? `Network/CORS error. Please ensure the backend is running at ${backendUrl}/api/AuthorizedDevice`
          : "Failed to load authorized devices.");
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.deviceName.trim()) {
      errors.deviceName = "Device name is required.";
    }
    if (!formData.macAddress.trim()) {
      errors.macAddress = "MAC address is required.";
    } else {
      const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
      if (!macRegex.test(formData.macAddress.trim())) {
        errors.macAddress =
          "Format must be like 00:1B:44:11:3A:B7 or 00-1B-44-11-3A-B7";
      }
    }
    if (!formData.publicKey.trim()) {
      errors.publicKey =
        "Public key is required for device cryptographic authorization.";
    }
    if (formData.deviceId.trim()) {
      const guidRegex =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
      if (!guidRegex.test(formData.deviceId.trim())) {
        errors.deviceId =
          "Device ID must be a valid UUID format (e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6).";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add Device (POST api/AuthorizedDevice)
  const handleAddDevice = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const cleanMac = formData.macAddress.trim().toUpperCase();
      const payload = {
        deviceName: formData.deviceName.trim(),
        macAddress: cleanMac,
        publicKey: formData.publicKey.trim(),
        isActive: formData.isActive,
        registeredBy: formData.registeredBy?.trim() || null,
      };

      if (formData.deviceId?.trim()) {
        payload.deviceId = formData.deviceId.trim();
      }

      await axios.post(`${backendUrl}/api/AuthorizedDevice`, payload, {
        headers: getAuthHeaders(),
        withCredentials: false,
      });

      toast.success("Device authorized successfully!");
      setIsAddModalOpen(false);
      setFormData({
        ...initialFormState,
        registeredBy: currentUserName,
      });
      setFormErrors({});
      fetchDevices();
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to authorize device.";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Active Status (PATCH api/AuthorizedDevice/{id}/status?isActive=...)
  const handleToggleStatus = async (device) => {
    const nextStatus = !device.isActive;
    try {
      await axios.patch(
        `${backendUrl}/api/AuthorizedDevice/${device.id}/status?isActive=${nextStatus}`,
        {},
        { headers: getAuthHeaders(), withCredentials: false },
      );
      toast.success(
        `Device ${nextStatus ? "activated" : "deactivated"} successfully!`,
      );
      setDevices((prev) =>
        prev.map((d) =>
          d.id === device.id ? { ...d, isActive: nextStatus } : d,
        ),
      );
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to update device status.";
      toast.error(errMsg);
    }
  };

  // Delete Device (DELETE api/AuthorizedDevice/{id})
  const confirmDelete = async () => {
    if (!deviceToDelete) return;
    try {
      await axios.delete(
        `${backendUrl}/api/AuthorizedDevice/${deviceToDelete.id}`,
        {
          headers: getAuthHeaders(),
          withCredentials: false,
        },
      );
      toast.success("Device deleted successfully!");
      setDevices((prev) => prev.filter((d) => d.id !== deviceToDelete.id));
      setIsDeleteModalOpen(false);
      setDeviceToDelete(null);
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to delete device.";
      toast.error(errMsg);
    }
  };

  const copyToClipboard = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.info("Copied to clipboard!");
  };

  // Stats
  const totalCount = devices.length;
  const activeCount = devices.filter((d) => d.isActive).length;
  const inactiveCount = totalCount - activeCount;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen" style={geistSansStyle}>
      {/* Top Header Card */}
      <div className="bg-white rounded-lg shadow-xs border border-gray-200 p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#17414d]/10 text-[#17414d]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                Authorized Devices
              </h1>
              <p className="text-xs text-gray-500">
                Enterprise device authorization & hardware whitelisting
                management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchDevices}
              className="p-1.5 rounded border border-gray-300 hover:bg-gray-100 text-gray-600 transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...initialFormState,
                  registeredBy: currentUserName,
                });
                setFormErrors({});
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-white shadow-xs hover:opacity-90 transition cursor-pointer"
              style={{ backgroundColor: "#17414d" }}
            >
              <Plus size={15} />
              Add Device
            </button>
          </div>
        </div>

        {/* Stats and Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between p-2.5 rounded bg-gray-50 border border-gray-200">
            <span className="text-xs font-medium text-gray-600">
              Total Devices
            </span>
            <span className="text-base font-bold text-gray-900">
              {totalCount}
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded bg-green-50/50 border border-green-200">
            <span className="text-xs font-medium text-green-700 flex items-center gap-1.5">
              <CheckCircle2 size={13} /> Active
            </span>
            <span className="text-base font-bold text-green-700">
              {activeCount}
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded bg-red-50/50 border border-red-200">
            <span className="text-xs font-medium text-red-700 flex items-center gap-1.5">
              <XCircle size={13} /> Inactive
            </span>
            <span className="text-base font-bold text-red-700">
              {inactiveCount}
            </span>
          </div>
        </div>
      </div>

      {/* Main Table Card (Styled matching ProjectHoursDetails / ERP table) */}
      <div className="bg-white rounded-lg shadow-xs border border-gray-200 overflow-hidden">
        {/* Search & Filter Toolbar */}
        <div className="p-3 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by device name, MAC, UUID, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17414d] focus:border-[#17414d]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
              Status:
            </span>
            <div className="flex bg-gray-100 p-0.5 rounded border border-gray-200 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-2.5 py-0.5 rounded transition text-xs font-medium cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("active")}
                className={`px-2.5 py-0.5 rounded transition text-xs font-medium cursor-pointer ${
                  statusFilter === "active"
                    ? "bg-white text-green-700 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("inactive")}
                className={`px-2.5 py-0.5 rounded transition text-xs font-medium cursor-pointer ${
                  statusFilter === "inactive"
                    ? "bg-white text-red-700 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Table - Complete Industry-Standard Fields */}
        <div className="overflow-x-auto">
          <table className="table min-w-full border-collapse border border-gray-300">
            <thead className="thead sticky top-0 z-10">
              <tr className="bg-[#e5f3fb]">
                <th className="th-thead px-3 py-2 text-left pl-3 font-semibold text-xs text-black border-r border-b border-gray-300">
                  Device Name
                </th>
                <th className="th-thead px-3 py-2 text-center font-semibold text-xs text-black border-r border-b border-gray-300">
                  MAC Address
                </th>
                <th className="th-thead px-3 py-2 text-center font-semibold text-xs text-black border-r border-b border-gray-300">
                  Device ID (UUID)
                </th>
                <th className="th-thead px-3 py-2 text-center font-semibold text-xs text-black border-r border-b border-gray-300">
                  Public Key
                </th>
                <th className="th-thead px-3 py-2 text-center font-semibold text-xs text-black border-r border-b border-gray-300">
                  Status
                </th>
                <th className="th-thead px-3 py-2 text-center font-semibold text-xs text-black border-r border-b border-gray-300">
                  Registered By
                </th>
                <th className="th-thead px-3 py-2 text-center font-semibold text-xs text-black border-r border-b border-gray-300">
                  Last Seen
                </th>
                <th className="th-thead px-3 py-2 text-center font-semibold text-xs text-black border-r border-b border-gray-300">
                  Created At
                </th>
                <th className="th-thead px-3 py-2 text-center font-semibold text-xs text-black border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="tbody bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="tbody-td py-10 text-center text-gray-500 border-b border-gray-300"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#17414d]" />
                      <span className="text-xs">
                        Loading authorized devices...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : devices.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="tbody-td py-10 text-center text-gray-500 border-b border-gray-300"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Smartphone className="w-7 h-7 text-gray-300" />
                      <p className="font-medium text-gray-700 text-xs">
                        No authorized devices found
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Click "Add Device" to register a new physical device.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                devices.map((device) => (
                  <tr
                    key={device.id}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    {/* Device Name */}
                    <td className="tbody-td-l px-3 py-2 text-xs border-r border-b border-gray-300 text-black text-left pl-3 font-medium">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-3.5 h-3.5 text-[#17414d] shrink-0" />
                        <span className="text-gray-900 font-semibold">
                          {device.deviceName}
                        </span>
                      </div>
                    </td>

                    {/* MAC Address */}
                    <td className="tbody-td px-3 py-2 text-xs font-mono border-r border-b border-gray-300 text-black text-center font-medium">
                      <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200 text-[11px] text-gray-800">
                        {device.macAddress}
                      </span>
                    </td>

                    {/* Device ID (UUID) */}
                    <td className="tbody-td px-3 py-2 text-xs font-mono border-r border-b border-gray-300 text-gray-600 text-center">
                      <div className="inline-flex items-center gap-1.5 justify-center">
                        <span
                          className="truncate max-w-[110px]"
                          title={device.deviceId}
                        >
                          {device.deviceId}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              device.deviceId,
                              `uuid-${device.id}`,
                            )
                          }
                          className="text-gray-400 hover:text-gray-700 transition cursor-pointer"
                          title="Copy UUID"
                        >
                          {copiedId === `uuid-${device.id}` ? (
                            <Check size={12} className="text-green-600" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Public Key */}
                    <td className="tbody-td px-3 py-2 text-xs font-mono border-r border-b border-gray-300 text-center">
                      <button
                        type="button"
                        onClick={() => setViewKeyDevice(device)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100 transition cursor-pointer"
                        title="View full Public Key"
                      >
                        <Key size={11} className="text-sky-600" />
                        <span>View Key</span>
                      </button>
                    </td>

                    {/* Status Toggle Badge */}
                    <td className="tbody-td px-3 py-2 text-xs border-r border-b border-gray-300 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(device)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                          device.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                        title="Click to toggle status"
                      >
                        <Power size={11} />
                        {device.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Registered By */}
                    <td className="tbody-td px-3 py-2 text-xs border-r border-b border-gray-300 text-black text-center">
                      {device.registeredBy || (
                        <span className="text-gray-400 italic">System</span>
                      )}
                    </td>

                    {/* Last Seen */}
                    <td className="tbody-td px-3 py-2 text-xs border-r border-b border-gray-300 text-gray-500 text-center whitespace-nowrap">
                      {device.lastSeenAt ? (
                        <span className="flex items-center justify-center gap-1">
                          <Clock size={11} className="text-gray-400" />
                          {formatDate(device.lastSeenAt)}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Never</span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="tbody-td px-3 py-2 text-xs border-r border-b border-gray-300 text-black text-center whitespace-nowrap">
                      {formatDate(device.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="tbody-td px-3 py-2 text-xs border-b border-gray-300 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setDeviceToDelete(device);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1 rounded text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
                        title="Delete Device"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD DEVICE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-lg w-full overflow-hidden animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-[#e5f3fb]/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#17414d]" />
                <h2 className="text-xs font-bold text-gray-900">
                  Authorize New Hardware Device
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddDevice} className="p-4 space-y-3">
              {/* Device Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Device Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Warehouse-Scanner-01, Dispatch-Tablet"
                  value={formData.deviceName}
                  onChange={(e) =>
                    setFormData({ ...formData, deviceName: e.target.value })
                  }
                  className={`w-full px-2.5 py-1.5 text-xs border rounded focus:outline-none focus:ring-1 ${
                    formErrors.deviceName
                      ? "border-red-400 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#17414d]"
                  }`}
                />
                {formErrors.deviceName && (
                  <p className="text-[11px] text-red-500 mt-0.5">
                    {formErrors.deviceName}
                  </p>
                )}
              </div>

              {/* MAC Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  MAC Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 00:1B:44:11:3A:B7 or 00-1B-44-11-3A-B7"
                  value={formData.macAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      macAddress: e.target.value.toUpperCase(),
                    })
                  }
                  className={`w-full px-2.5 py-1.5 text-xs font-mono border rounded focus:outline-none focus:ring-1 ${
                    formErrors.macAddress
                      ? "border-red-400 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#17414d]"
                  }`}
                />
                {formErrors.macAddress && (
                  <p className="text-[11px] text-red-500 mt-0.5">
                    {formErrors.macAddress}
                  </p>
                )}
              </div>

              {/* Device ID (UUID) with Auto-Generate Helper */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Device ID (UUID){" "}
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, deviceId: generateUUID() })
                    }
                    className="inline-flex items-center gap-1 text-[11px] text-[#17414d] hover:underline cursor-pointer font-medium"
                  >
                    <Wand2 size={11} /> Generate UUID
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Auto-generated by server if left blank (or click Generate)"
                  value={formData.deviceId}
                  onChange={(e) =>
                    setFormData({ ...formData, deviceId: e.target.value })
                  }
                  className={`w-full px-2.5 py-1.5 text-xs font-mono border rounded focus:outline-none focus:ring-1 ${
                    formErrors.deviceId
                      ? "border-red-400 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#17414d]"
                  }`}
                />
                {formErrors.deviceId && (
                  <p className="text-[11px] text-red-500 mt-0.5">
                    {formErrors.deviceId}
                  </p>
                )}
              </div>

              {/* Public Key with Auto-Generate Helper */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Public Key <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        publicKey: generateMockPublicKey(
                          formData.deviceName || "Device",
                        ),
                      })
                    }
                    className="inline-flex items-center gap-1 text-[11px] text-[#17414d] hover:underline cursor-pointer font-medium"
                  >
                    <Wand2 size={11} /> Generate Key
                  </button>
                </div>
                <textarea
                  rows="3"
                  placeholder="Paste device public key or click Generate Key above..."
                  value={formData.publicKey}
                  onChange={(e) =>
                    setFormData({ ...formData, publicKey: e.target.value })
                  }
                  className={`w-full px-2.5 py-1.5 text-xs font-mono border rounded focus:outline-none focus:ring-1 ${
                    formErrors.publicKey
                      ? "border-red-400 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#17414d]"
                  }`}
                />
                {formErrors.publicKey && (
                  <p className="text-[11px] text-red-500 mt-0.5">
                    {formErrors.publicKey}
                  </p>
                )}
              </div>

              {/* Registered By */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Registered By{" "}
                  <span className="text-gray-400 font-normal">
                    (Admin / User)
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. AdminUser"
                  value={formData.registeredBy}
                  onChange={(e) =>
                    setFormData({ ...formData, registeredBy: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#17414d]"
                />
              </div>

              {/* Status Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-3.5 h-3.5 rounded text-[#17414d] focus:ring-[#17414d] border-gray-300 cursor-pointer"
                />
                <label
                  htmlFor="isActiveToggle"
                  className="text-xs font-medium text-gray-700 cursor-pointer select-none"
                >
                  Activate device immediately upon registration
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded shadow-xs hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                  style={{ backgroundColor: "#17414d" }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Authorize Device"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PUBLIC KEY MODAL */}
      {viewKeyDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-lg w-full overflow-hidden animate-in fade-in duration-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-[#e5f3fb]/60">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#17414d]" />
                <h3 className="text-xs font-bold text-gray-900">
                  Public Key: {viewKeyDevice.deviceName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewKeyDevice(null)}
                className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  MAC:{" "}
                  <strong className="font-mono text-gray-800">
                    {viewKeyDevice.macAddress}
                  </strong>
                </span>
                <span>
                  ID:{" "}
                  <strong className="font-mono text-gray-800">
                    {viewKeyDevice.id}
                  </strong>
                </span>
              </div>
              <div className="relative">
                <textarea
                  readOnly
                  rows="8"
                  value={viewKeyDevice.publicKey}
                  className="w-full p-2.5 bg-gray-50 text-[11px] font-mono border border-gray-200 rounded text-gray-800 select-all focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(viewKeyDevice.publicKey, "modal-key")
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition cursor-pointer"
                >
                  {copiedId === "modal-key" ? (
                    <>
                      <Check size={13} className="text-green-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy Key</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setViewKeyDevice(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-white rounded shadow-xs hover:opacity-90 transition cursor-pointer"
                  style={{ backgroundColor: "#17414d" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && deviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 max-w-sm w-full p-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5 mb-2.5 text-red-600">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle size={16} />
              </div>
              <h3 className="text-xs font-bold text-gray-900">
                Delete Authorized Device
              </h3>
            </div>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900">
                {deviceToDelete.deviceName}
              </strong>{" "}
              (
              <span className="font-mono text-gray-800">
                {deviceToDelete.macAddress}
              </span>
              )? This device will immediately lose authorization.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeviceToDelete(null);
                }}
                className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-2.5 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded transition cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorizedDevice;
