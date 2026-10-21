import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaEnvelope,
  FaKey,
  FaShieldAlt,
  FaTimes,
  FaUserCircle,
  FaUserPlus,
  FaSearch,
  FaPlay, // ← ADD THIS
  FaPause, // ← ADD THIS
  FaSpinner,
  FaTrash,
} from "react-icons/fa";
import { User, Users } from "lucide-react";
import { Save, LogOut, Delete } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { showToast } from "./Toast";
import { backendUrl } from "./config";

// -- toast
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
  const displayTime = message.includes("import") ? 4000 : 2000;
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => document.body.removeChild(toast), 300);
  }, displayTime);
};

// --- Create User Modal Component (with Enhanced Error Handling) ---
const CreateUserModal = ({ onClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    role: "",
    workflowId: 0,
    firstLogin: true,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({}); // To hold validation errors for each field
  const [serverError, setServerError] = useState(""); // For errors from the API
  const [activationLoading, setActivationLoading] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [rows, setRows] = useState([]);
  // --- Validation Logic ---
  const validate = (fieldValues = formData, confirmPass = confirmPassword) => {
    let tempErrors = { ...errors };

    if ("username" in fieldValues) {
      tempErrors.username = fieldValues.username ? "" : "Username is required.";
      if (fieldValues.username && fieldValues.username.length < 3) {
        tempErrors.username = "Username must be at least 3 characters long.";
      }
    }
    if ("fullName" in fieldValues) {
      tempErrors.fullName = fieldValues.fullName
        ? ""
        : "Full Name is required.";
    }
    if ("email" in fieldValues) {
      tempErrors.email = fieldValues.email ? "" : "Email is required.";
      if (fieldValues.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldValues.email)) {
          tempErrors.email = "Email is not valid.";
        }
      }
    }

    if ("password" in fieldValues) {
      tempErrors.password = fieldValues.password ? "" : "Password is required.";
      if (fieldValues.password && fieldValues.password.length < 5) {
        tempErrors.password = "Password must be at least 5 characters long.";
      }
    }

    if ("confirmPassword" in fieldValues) {
      // Make sure confirmPass is defined and both password and confirmPass match
      if (!fieldValues.confirmPassword) {
        tempErrors.confirmPassword = "Please confirm your password.";
      } else if (fieldValues.password !== fieldValues.confirmPassword) {
        tempErrors.confirmPassword = "Passwords do not match.";
      } else if (fieldValues.password === fieldValues.confirmPassword) {
        tempErrors.confirmPassword = "";
      } else {
        tempErrors.confirmPassword = "";
      }
    }

    setErrors(tempErrors);

    return Object.values(tempErrors).every((x) => x === "");
  };

  useEffect(() => {
    fetch(`${backendUrl}/api/ApprovalWorkflow`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((item) => ({
          workflowId: item.workflowId,
          level: item.levelNo,
          name: item.approverRole,
          isMandetory: item.isMandetory,
          requestType: item.requestType,
        }));
        setRows(mapped);
      })
      .catch((err) => {
        console.error("Failed to load workflow data", err);
        setRows([]);
      });
  }, []);

  useEffect(() => {
    if (rows.length > 0 && !formData.workflowId) {
      const matchByLevel = rows.find((row) => row.level === user.levelNo);
      if (matchByLevel) {
        setFormData((prev) => ({
          ...prev,
          workflowId: matchByLevel.workflowId,
        }));
      } else if (user.workflowId) {
        setFormData((prev) => ({
          ...prev,
          workflowId: users.workflowId,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  //   validate({ [name]: value });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "workflowId" ? Number(value) : value,
    });
    validate({ [name]: value });
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    validate({ password: formData.password, confirmPassword: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate(formData, confirmPassword)) {
      setIsLoading(true);
      setServerError("");
      try {
        const response = await fetch(`${backendUrl}/api/User`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || "Failed to create user.");
        }

        showToast("User created successfully!", "success");
        onUserCreated();
        onClose();
      } catch (err) {
        if (err.message.includes("Failed to fetch")) {
          setServerError(
            "Username or email may already be in use. Please try different ones.",
          );
        } else {
          setServerError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create New User</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full mt-1 px-3 py-2 border rounded-lg ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full mt-1 px-3 py-2 border rounded-lg ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full mt-1 px-3 py-2 border rounded-lg ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full mt-1 px-3 py-2 border rounded-lg ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`w-full mt-1 px-3 py-2 border rounded-lg ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg bg-white border-gray-300"
            >
              <option value="">----Select Level----</option>
              <option value="user">User</option>
              <option value="supervisor"> Supervisor</option>
              {/* <option value="pm">PM</option> */}
              <option value="project_manager">Project Manager</option>
              <option value="backup_supervisor">Backup Supervisor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {formData.role !== "user" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Level No
              </label>
              <select
                name="workflowId"
                value={formData.workflowId}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-white"
              >
                <option value="">----Select Level----</option>
                {rows.map(({ workflowId, level, name }) => (
                  <option key={workflowId} value={workflowId}>
                    {`${level} - ${name}`}
                  </option>
                ))}
              </select>
            </div>
          )}
          {serverError && (
            <p className="text-sm text-red-600 text-center">{serverError}</p>
          )}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg w-full disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -- Edit User modal
const EditUserModal = ({ user, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    userId: user.userId,
    fullName: user.fullName || "",
    email: user.email || "",
    role: user.role || "User",
    isActive: user.isActive,
    workflowId: user.workflowId || 0, // selected workflowId here
  });
  const [rows, setRows] = useState([]); // API data mapped here
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${backendUrl}/api/ApprovalWorkflow`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((item) => ({
          workflowId: item.workflowId,
          level: item.levelNo,
          name: item.approverRole,
          isMandetory: item.isMandetory,
          requestType: item.requestType,
        }));
        setRows(mapped);
      })
      .catch((err) => {
        console.error("Failed to load workflow data", err);
        setRows([]);
      });
  }, []);

  useEffect(() => {
    if (formData.role === "user") {
      setFormData((prev) => ({ ...prev, workflowId: "0" }));
    }
  }, [formData.role]);

  // After loading rows, update formData.workflowId if necessary
  useEffect(() => {
    if (rows.length > 0 && !formData.workflowId) {
      const matchByLevel = rows.find((row) => row.level === user.levelNo);
      if (matchByLevel) {
        setFormData((prev) => ({
          ...prev,
          workflowId: matchByLevel.workflowId,
        }));
      } else if (user.workflowId) {
        setFormData((prev) => ({
          ...prev,
          workflowId: user.workflowId,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);
  // Only depend on `rows` to run once when they load

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "select-one" && name === "isActive" ? value === "true" : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${backendUrl}/api/User/${user.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update user.");
      }

      showToast("User updated successfully!", "success");
      onUserUpdated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit User: {user.username}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name, Email, Role, Status code omitted for brevity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-white"
              >
                <option value="user">User</option>
                <option value="supervisor"> Supervisor</option>
                {/* <option value="pm">PM</option> */}
                <option value="project_manager">Project Manager</option>
                <option value="backup_supervisor">Backup Supervisor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="isActive"
                value={formData.isActive}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border rounded-lg bg-white"
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>

            {user.role !== "user" || formData.role !== "user" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Level
                  </label>
                  <select
                    name="workflowId"
                    value={formData.workflowId}
                    onChange={handleChange}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="0">Select Level</option>
                    {rows.map(({ workflowId, level, name }) => (
                      <option key={workflowId} value={workflowId}>
                        {`${level} - ${name}`}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : null}
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg w-full disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Password Modal Component ---
const PasswordModal = ({ user, type, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 5) {
      setError("Password must be at least 5 characters long.");
      return;
    }

    setIsLoading(true);
    setError("");

    const isReset = type === "reset";
    const url = `${backendUrl}/api/User/${user.userId}/${
      isReset ? "reset-password" : "update-password"
    }`;
    const body = isReset
      ? { newPassword }
      : { currentPassword: oldPassword, newPassword };

    try {
      const response = await fetch(url, {
        method: isReset ? "PUT" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        showToast("Password updated successfully!", "success");
        onClose();
        return;
      }

      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `Request failed with status ${response.status}`,
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {type === "reset"
              ? `Reset Password for ${user.username}`
              : "Update Your Password"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "update" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg w-full disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Skeleton Loader for Profile Card ---
const ProfileCardSkeleton = () => (
  <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 ml-4">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
        <div className="p-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full ring-4 ring-gray-200"></div>
            <div className="w-full sm:w-auto">
              <div className="h-9 bg-gray-200 rounded w-3/4 sm:w-64 mx-auto sm:mx-0"></div>
            </div>
          </div>
        </div>
        <hr />
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="w-full space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-8 bg-gray-50 border-t">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-48"></div>
        </div>
      </div>
    </div>
  </div>
);

// --- Main UserTable Component ---
export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activationLoading, setActivationLoading] = useState({});
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("currentUser");
    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setCurrentUser(parsedUser);
        if (parsedUser.role && parsedUser.role.toLowerCase() === "admin") {
          setIsAdmin(true);
        }
      } catch (e) {
        console.error("Failed to parse user info", e);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) return;

      const baseApiUrl = `${backendUrl}/api/User`;
      let apiUrl;

      if (isAdmin) {
        apiUrl = baseApiUrl;
      } else {
        const userIdToFetch = currentUser.userId || currentUser.approvalUserId;

        if (userIdToFetch) {
          apiUrl = `${baseApiUrl}/${userIdToFetch}`;
        } else {
          setError("Your user ID could not be found.");
          setLoading(false);
          return;
        }
      }

      try {
        setLoading(true);
        const response = await fetch(apiUrl);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : [data]);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser, isAdmin, refreshTrigger]);

  const openPasswordModal = (user, type) => {
    setSelectedUser(user);
    setModalType(type);
    setIsPasswordModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // const getInitials = (name = "") => {
  //   const names = name.split(" ");
  //   if (names.length > 1 && names[0] && names[names.length - 1]) {
  //     return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  //   }
  //   return name.substring(0, 2).toUpperCase();
  // };
  const getInitials = (name) => {
    // Defensive: cover null, undefined, and non-string values
    if (typeof name !== "string" || !name) return "";
    const names = name.trim().split(" ");
    if (names.length > 1 && names[0] && names[names.length - 1]) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleActivateUser = async (user) => {
    try {
      setActivationLoading((prev) => ({ ...prev, [user.userId]: true }));

      const requestBody = {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: true, // Set to true for activation
        workflowId: user.workFlowId,
        firstLogin: true,
      };

      const response = await fetch(`${backendUrl}/api/User/${user.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to activate user");
      }

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.userId === user.userId ? { ...u, isActive: true } : u,
        ),
      );

      showToast(`User ${user.fullName} activated successfully!`, "success");
    } catch (error) {
      showToast(`Failed to activate user: ${error.message}`, "error");
    } finally {
      setActivationLoading((prev) => ({ ...prev, [user.userId]: false }));
    }
  };

  const handleDeactivateUser = async (user) => {
    try {
      setActivationLoading((prev) => ({ ...prev, [user.userId]: true }));

      const requestBody = {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: false, // Set to false for deactivation
        workflowId: user.workFlowId,
        firstLogin: false,
      };

      const response = await fetch(`${backendUrl}/api/User/${user.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to deactivate user");
      }

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.userId === user.userId ? { ...u, isActive: false } : u,
        ),
      );

      showToast(`User ${user.fullName} deactivated successfully!`, "success");
    } catch (error) {
      showToast(`Failed to deactivate user: ${error.message}`, "error");
    } finally {
      setActivationLoading((prev) => ({ ...prev, [user.userId]: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setUserLoaded(false);
    showToast("Logged out successfully", "info");
    navigate("/");
  };

  // async function deleteUser(userId) {
  //   try {
  //     const response = await fetch(`${backendUrl}/api/User/${userId}`, {
  //       method: "DELETE",
  //     });
  //     // if (!response.ok) throw new Error("Failed to delete user");
  //     showToast("User deleted successfully");
  //     setRefreshTrigger((t) => t + 1);
  //   } catch (error) {
  //     showToast("Failed to delete user");
  //     console.error(error);
  //   }
  // }

  //   const handleDeleteUser = async (userId) => {
  //   const confirmed = window.confirm("Are you sure you want to delete this user?");
  //   if (!confirmed) return; // user clicked "Cancel" (No), do nothing

  //   try {
  //     await fetch(`${backendUrl}/api/User/${userId}`, {
  //       method: "DELETE",
  //     });
  //     // refresh list or remove from state
  //     showToast("User deleted successfully");
  //     // setUsers((prev) => prev.filter((u) => u.id !== userId));
  //     setRefreshTrigger((t) => t + 1);
  //   } catch (err) {
  //     // console.error("Failed to delete user:", err);
  //     showToast("Failed to delete user");
  //   }
  // };
  const handleDeleteUser = async (userId) => {
    // Block deleting the logged-in user (compare numeric ids)
    if (currentUser && currentUser.userId === userId) {
      showToast("You cannot delete your own user.", "error");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );
    if (!confirmed) return;

    try {
      await fetch(`${backendUrl}/api/User/${userId}`, {
        method: "DELETE",
      });
      showToast("User deleted successfully", "success");
      setRefreshTrigger((t) => t + 1);
    } catch (err) {
      showToast("Failed to delete user", "error");
    }
  };
  // --- Admin View ---
  if (isAdmin) {
    // More robust filtering logic
    const filteredUsers = users.filter((user) => {
      const query = searchQuery.toLowerCase();
      const statusString = user.isActive === true ? "active" : "inactive";
      return (
        (user.fullName && user.fullName.toLowerCase().includes(query)) ||
        (user.username && user.username.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query)) ||
        (user.role && user.role.toLowerCase().includes(query)) ||
        (user.levelNo &&
          user.levelName &&
          `${user.levelNo} - ${user.levelName}`
            .toLowerCase()
            .includes(query)) ||
        statusString.includes(query)
      );
    });

    return (
      <>
        {isPasswordModalOpen && (
          <PasswordModal
            user={selectedUser}
            type={modalType}
            onClose={() => setIsPasswordModalOpen(false)}
          />
        )}
        {isCreateModalOpen && (
          <CreateUserModal
            onClose={() => setIsCreateModalOpen(false)}
            onUserCreated={() => setRefreshTrigger((t) => t + 1)}
          />
        )}
        {isEditModalOpen && (
          <EditUserModal
            user={selectedUser}
            onClose={() => setIsEditModalOpen(false)}
            onUserUpdated={() => setRefreshTrigger((t) => t + 1)}
          />
        )}

        <div className="space-y-2 text-sm sm:text-base text-gray-800 font-inter">
          <div className="flex flex-col gap-2 ">
            <div className="flex items-center gap-2 bg-white rounded-sm p-4">
              <User size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-800">Users</h2>
            </div>
            {/* <div className="flex-1 flex flex-col pt-6 pb-6">
            <div className="flex justify-between items-center mb-6 px-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Users Management
                </h1>
              </div>

              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm font-normal shadow transition"
              >
                Logout
              </button>
            </div> */}

            <div className="w-full bg-white rounded-lg shadow border border-gray-200 mb-1 flex items-center justify-end gap-3">
              <div className="flex items-center gap-4">
                {/* <h1 className="text-4xl font-bold text-gray-800">
              User Management
            </h1> */}
                <div className="flex items-center gap-4 mr-3 ">
                  <div className="relative">
                    <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, username, email, or role..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-80 pl-8 pr-1 py-1 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-green-500 text-white font-bold py-1 px-5 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 shadow-lg hover:shadow-green-500/50"
                  >
                    <FaUserPlus /> Create User
                  </button>
                </div>
              </div>
            </div>

            {/* <div className="min-h-screen bg-slate-50 flex flex-col ml-4 pr-8 py-8">
              <div className="flex-1 flex flex-col">
                <div className="border border-gray-300 rounded-2xl bg-white shadow-md p-2 w-full max-w-[calc(100vw-220px)] mx-auto"> */}
            {/* <div className="border border-gray-300 bg-white w-full mx-auto"> */}
            <div className={`overflow-x-auto max-h-[70vh] min-h-[70vh]`}>
              <table className="min-w-full table-auto divide-gray-200">
                <thead className="bg-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      User Id
                    </th>
                    <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Name
                    </th>
                    <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Email
                    </th>

                    <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Role
                    </th>
                    <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Approval Level
                    </th>
                    <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Status
                    </th>
                    <th className="th-thead text-xs font-bold text-gray-600 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="tbody">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="bg-blue-50 border-b-2 border-blue-300"
                      >
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                          <span className="ml-2 text-sm text-gray-700">
                            Loading...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-10 text-red-500"
                      >
                        Error: {error}
                      </td>
                    </tr>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.userId}
                        className={`transition-colors duration-150 hover:bg-gray-50/80`}
                      >
                        <td className="tbody-td text-center">
                          {user.username}
                        </td>
                        <td className="tbody-td text-center">
                          {user.fullName}
                        </td>
                        <td className="tbody-td text-center">{user.email}</td>
                        <td className="tbody-td text-center">
                          <span
                            className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                              user.role?.toLowerCase() === "admin"
                                ? "bg-indigo-100 text-indigo-800"
                                : user.role?.toLowerCase() === "pm"
                                  ? "bg-sky-100 text-sky-800"
                                  : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="tbody-td text-center">
                          {user.levelNo} - {user.levelName}
                        </td>
                        <td className="tbody-td text-center">
                          <span
                            className={`px-3 py-1 text-xs leading-5 font-bold rounded-full ${
                              user.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-sm font-semibold align-middle">
                          <div className="flex justify-center items-center gap-4 h-full">
                            {currentUser?.role?.toLowerCase() === "admin" && (
                              <>
                                {!user.isActive ? (
                                  <button
                                    onClick={() => handleActivateUser(user)}
                                    disabled={activationLoading[user.userId]}
                                    // className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed rounded-md transition-colors"
                                    title="Activate User"
                                  >
                                    {activationLoading[user.userId] ? (
                                      <>
                                        <FaSpinner
                                          className="animate-spin mr-1"
                                          size={10}
                                          title="Activate"
                                        />
                                        {/* <span>Activating...</span> */}
                                      </>
                                    ) : (
                                      <>
                                        {/* <FaPlay size={10} /> */}
                                        {/* <span>Activate</span> */}
                                        <span className="text-sm">✔</span>
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleDeactivateUser(user)}
                                    disabled={activationLoading[user.userId]}
                                    // className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed rounded-md transition-colors"
                                    title="Deactivate User"
                                  >
                                    {activationLoading[user.userId] ? (
                                      <>
                                        <FaSpinner
                                          className="animate-spin mr-1"
                                          size={10}
                                          title="Deactivate"
                                        />
                                        {/* <span>Deactivating...</span> */}
                                      </>
                                    ) : (
                                      <>
                                        {/* <FaPause size={10} /> */}
                                        {/* <span>Deactivate</span> */}
                                        <span className="text-sm">❌</span>
                                      </>
                                    )}
                                  </button>
                                )}
                              </>
                            )}
                            <button
                              onClick={() => openEditModal(user)}
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors"
                              title="Edit"
                            >
                              <FaEdit size={15} />
                            </button>
                            <button
                              onClick={() => openPasswordModal(user, "reset")}
                              className="text-yellow-500 hover:text-yellow-700 flex items-center gap-1.5 transition-colors"
                              title="Reset Password"
                            >
                              <FaKey size={12} />
                            </button>
                            {currentUser?.role?.toLowerCase() === "admin" && (
                              <button
                                onClick={() => handleDeleteUser(user.userId)}
                                className="text-red-500 hover:text-red-700 flex items-center gap-1.5 transition-colors"
                                title="Delete"
                              >
                                <FaTrash size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-10 text-gray-500"
                      >
                        No users found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* </div> */}
        </div>
        {/* </div>
          </div>
        </div> */}
      </>
    );
  }

  // --- Non-Admin (User & PM) View ---
  if (loading) return <ProfileCardSkeleton />;
  if (error)
    return (
      <div className="min-h-screen bg-slate-50 ml-4 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  if (users.length === 0)
    return (
      <div className="min-h-screen bg-slate-50 ml-4 flex items-center justify-center">
        <p>Could not find user profile.</p>
      </div>
    );

  const user = users[0];
  return (
    <>
      {isPasswordModalOpen && (
        <PasswordModal
          user={selectedUser}
          type={modalType}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      )}
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 ml-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center ring-4 ring-blue-200">
                  <span className="text-4xl font-bold text-blue-600">
                    {getInitials(user.fullName)}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center sm:text-left">
                    {user.fullName}
                  </h1>
                </div>
              </div>
            </div>

            <hr />

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center space-x-3">
                <FaUserCircle className="h-6 w-6 text-gray-400" />
                <div>
                  <label className="text-sm font-semibold text-gray-500">
                    Username
                  </label>
                  <p className="text-lg text-gray-800">{user.username}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="h-6 w-6 text-gray-400" />
                <div>
                  <label className="text-sm font-semibold text-gray-500">
                    Email Address
                  </label>
                  <p className="text-lg text-gray-800">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaShieldAlt className="h-6 w-6 text-gray-400" />
                <div>
                  <label className="text-sm font-semibold text-gray-500">
                    Role
                  </label>
                  <p className="text-lg text-gray-800 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500 mb-2 block">
                  Status
                </label>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    user.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Account Actions
              </h3>
              <button
                onClick={() => openPasswordModal(user, "update")}
                className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaKey size={14} />
                <span>Update Password</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
