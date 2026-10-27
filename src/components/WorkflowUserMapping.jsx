import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { useOutletContext } from "react-router-dom";
import { Search, X } from "lucide-react";

const WorkflowUserMapping = () => {
  // Global lists
  const [users, setUsers] = useState([]);
  const [workflows, setWorkflows] = useState([]);

  // Select options
  const [workflowOptions, setWorkflowOptions] = useState([]);

  // Selections & Mappings
  const [selectedWorkflowId, setSelectedWorkflowId] = useState("");
  const [originalUsersForWorkflow, setOriginalUsersForWorkflow] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // UI search & loading state
  const [searchTermUsers, setSearchTermUsers] = useState("");
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [workflowLoading, setWorkflowLoading] = useState(false);
  const [error, setError] = useState(null);

  const { canEdit } = useOutletContext
    ? useOutletContext()
    : { canEdit: () => true };
  const isEditable = true;

  // ---------- Fetch Base Data on Mount ----------
  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        setUserLoading(true);
        setWorkflowLoading(true);
        setError(null);

        // 1. Fetch Users
        const userRes = await axios.get(`${backendUrl}/api/User`);
        // const userData = userRes.data || [];
        const userData = (userRes.data || []).filter(
  (user) => user.username !== "Revolve"
);
        setUsers(userData);

        // 2. Fetch Approval Workflows
        const workflowRes = await axios.get(
          `${backendUrl}/api/ApprovalWorkflow`,
        );
        const workflowData = workflowRes.data || [];
        setWorkflows(workflowData);

        setWorkflowOptions(
          workflowData.map((w) => ({
            value: w.workflowId,
            label: `Level ${w.levelNo} (${w.approverRole})`,
          })),
        );
      } catch (e) {
        console.error("Base data fetch failed", e);
        setError("Failed to load workflows or users.");
      } finally {
        setUserLoading(false);
        setWorkflowLoading(false);
      }
    };

    fetchBaseData();
  }, []);

  // ---------- Fetch Mapped Users when Workflow changes ----------
  useEffect(() => {
    setSearchTermUsers("");
    setError(null);

    if (!selectedWorkflowId) {
      setOriginalUsersForWorkflow([]);
      setSelectedUserIds([]);
      return;
    }

    const fetchUsersForWorkflow = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${backendUrl}/api/ApprovalWorkflow/WorkflowUsers/${selectedWorkflowId}`,
        );
        const data = Array.isArray(res.data) ? res.data : [];

        const normalizedIds = data.map((u) => u.userId);

        setOriginalUsersForWorkflow(data);
        setSelectedUserIds(normalizedIds);
      } catch (e) {
        console.error("Fetch mapped users for workflow failed", e);
        setOriginalUsersForWorkflow([]);
        setSelectedUserIds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersForWorkflow();
  }, [selectedWorkflowId]);

  // ---------- Helper functions for Selection & Mapping ----------
  const normalizeUserId = (id) => Number(id ?? 0);

  const isUserSelected = (userId) => {
    const normId = normalizeUserId(userId);
    return selectedUserIds.some((id) => normalizeUserId(id) === normId);
  };

  const toggleUserSelection = (userId) => {
    const normId = normalizeUserId(userId);
    setSelectedUserIds((prev) => {
      const exists = prev.some((id) => normalizeUserId(id) === normId);
      return exists
        ? prev.filter((id) => normalizeUserId(id) !== normId)
        : [...prev, userId];
    });
  };

  const toggleSelectAllUsers = (list) => {
    if (!isEditable || !list.length) return;
    const listIds = list.map((u) => normalizeUserId(u.userId));
    const allSelected = listIds.every((id) => selectedUserIds.includes(id));

    setSelectedUserIds((prev) => {
      const prevNorm = prev.map((id) => normalizeUserId(id));
      if (allSelected) {
        return prev.filter((id) => !listIds.includes(normalizeUserId(id)));
      }
      const idsToAdd = list
        .filter((u) => !prevNorm.includes(normalizeUserId(u.userId)))
        .map((u) => u.userId);
      return [...prev, ...idsToAdd];
    });
  };

  // Filtered & Sorted users table list (Mapped/Selected users appear first)
  const filteredUsers = useMemo(() => {
    let result = users;

    if (searchTermUsers.trim()) {
      const term = searchTermUsers.trim().toLowerCase();
      result = users.filter(
        (u) =>
          String(u.userId).toLowerCase().includes(term) ||
          String(u.username || "")
            .toLowerCase()
            .includes(term) ||
          String(u.fullName || "")
            .toLowerCase()
            .includes(term) ||
          String(u.role || "")
            .toLowerCase()
            .includes(term),
      );
    }

    // Sort: Mapped / Selected users appear first
    return [...result].sort((a, b) => {
      const aIsSelected = isUserSelected(a.userId);
      const bIsSelected = isUserSelected(b.userId);

      if (aIsSelected === bIsSelected) return 0;
      return aIsSelected ? -1 : 1;
    });
  }, [users, searchTermUsers, selectedUserIds]);

  // ---------- Save Workflow ↔ Users Mapping ----------
  const saveWorkflowUsersMapping = async () => {
    if (!selectedWorkflowId) {
      toast.warn("Select a workflow first.");
      return;
    }

    try {
      setLoading(true);

      // Payload matching { workflowId: number, userIds: number[] }
      const payload = {
        workflowId: Number(selectedWorkflowId),
        userIds: selectedUserIds.map((id) => Number(id)),
      };

      await axios.put(
        `${backendUrl}/api/ApprovalWorkflow/replace-approvers`,
        payload,
      );

      toast.success("Workflow ↔ Users mapping updated successfully.");

      // Refresh snapshot
      const res = await axios.get(
        `${backendUrl}/api/ApprovalWorkflow/WorkflowUsers/${selectedWorkflowId}`,
      );
      const data = Array.isArray(res.data) ? res.data : [];
      setOriginalUsersForWorkflow(data);
      setSelectedUserIds(data.map((u) => u.userId));
    } catch (e) {
      console.error("Save workflow-users failed", e);
      const apiMessage =
        e?.response?.data?.message ||
        e?.response?.data?.title ||
        (typeof e?.response?.data === "string" ? e.response.data : null);
      toast.error(apiMessage || "Failed to update workflow-users mapping.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-900 flex w-full font-inter">
      <div className="w-full space-y-2">
        <div className="p-4 border-b w-full rounded-sm border-gray-100 flex items-center justify-between bg-white">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <AiOutlineFundProjectionScreen
              size={20}
              className="text-blue-500"
            />
            Workflow & User Mapping
          </h2>
        </div>

        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        <div className="bg-white p-4 w-full rounded shadow-sm border border-gray-100">
          {/* Workflow Selector */}
          <div className="p-2">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="flex items-center gap-2 w-full sm:w-[500px]">
                <label
                  htmlFor="workflowSelect"
                  className="input-label mb-1 block whitespace-nowrap font-medium text-xs"
                >
                  Approval Workflow <span className="text-red-500 ml-1">*</span>
                </label>
                <Select
                  inputId="workflowSelect"
                  options={workflowOptions}
                  isLoading={workflowLoading}
                  className="outline-none w-full text-xs"
                  value={
                    selectedWorkflowId
                      ? workflowOptions.find(
                          (o) => o.value === Number(selectedWorkflowId),
                        )
                      : null
                  }
                  onChange={(opt) =>
                    setSelectedWorkflowId(opt ? opt.value : "")
                  }
                  isSearchable
                  placeholder="Search & select approval workflow..."
                />
              </div>
            </div>

            {selectedWorkflowId && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label
                  htmlFor="userSearch"
                  className="input-label whitespace-nowrap text-xs font-medium"
                >
                  Search Users
                </label>
                <div className="relative w-full max-w-md">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                  />
                  <input
                    id="userSearch"
                    type="text"
                    className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-full !pl-9 !pr-9"
                    placeholder="Search by ID, Username, Name, Role..."
                    value={searchTermUsers}
                    onChange={(e) => setSearchTermUsers(e.target.value)}
                    autoComplete="off"
                  />
                  {searchTermUsers && (
                    <button
                      type="button"
                      onClick={() => setSearchTermUsers("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                      title="Clear"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Mapping Table Section */}
          <div className="rounded mt-4 px-2">
            <div className="flex items-center gap-x-4 mb-2">
              <h3 className="text-sm font-semibold text-gray-900">
                All Users & Workflow Assignment
              </h3>
              {selectedWorkflowId && (
                <div className="flex flex-1 justify-end">
                  {isEditable && (
                    <button
                      onClick={saveWorkflowUsersMapping}
                      disabled={!selectedWorkflowId || loading}
                      className="bg-[#17414d] btn1 btn-blue disabled:opacity-60 text-xs px-4 py-2 rounded text-white font-semibold cursor-pointer"
                    >
                      {loading ? "Saving..." : "Save Mappings"}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="border border-gray-300 rounded overflow-hidden">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-300 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900">
                  System Users
                </h4>
                <span className="text-[11px] text-gray-500">
                  {filteredUsers.length} users available (
                  {selectedUserIds.length} selected)
                </span>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm">
                  <thead className="thead">
                    <tr className="bg-white border-b border-gray-300">
                      <th className="th-thead w-10 text-center text-black text-xs">
                        <input
                          type="checkbox"
                          className="w-3 h-3 cursor-pointer"
                          checked={
                            filteredUsers.length > 0 &&
                            filteredUsers.every((u) => isUserSelected(u.userId))
                          }
                          onChange={() => toggleSelectAllUsers(filteredUsers)}
                          disabled={
                            !isEditable ||
                            filteredUsers.length === 0 ||
                            !selectedWorkflowId
                          }
                        />
                      </th>
                      {/* <th className="th-thead text-left text-black text-xs">
                        User ID
                      </th> */}
                      <th className="th-thead text-left text-black text-xs">
                        Username
                      </th>
                      <th className="th-thead text-left text-black text-xs">
                        Full Name
                      </th>
                      <th className="th-thead text-left text-black text-xs">
                        Email
                      </th>
                      <th className="th-thead text-left text-black text-xs">
                        Role
                      </th>
                      <th className="th-thead text-left text-black text-xs">
                        Mapping Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!selectedWorkflowId ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-3 py-8 text-center text-gray-500 text-xs"
                        >
                          Please select an approval workflow above to manage
                          user mappings.
                        </td>
                      </tr>
                    ) : userLoading ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-3 py-8 text-center text-gray-500 text-xs"
                        >
                          Loading users...
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-3 py-8 text-center text-gray-500 text-xs"
                        >
                          No users found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => {
                        const isSelected = isUserSelected(user.userId);
                        const wasOriginal = originalUsersForWorkflow.some(
                          (orig) =>
                            normalizeUserId(orig.userId) ===
                            normalizeUserId(user.userId),
                        );

                        const status =
                          wasOriginal && isSelected
                            ? "Mapped"
                            : wasOriginal && !isSelected
                              ? "Unmapping"
                              : isSelected
                                ? "New Mapping"
                                : "Not Mapped";

                        return (
                          <tr
                            key={user.userId}
                            className={`hover:bg-gray-50 ${isSelected ? "bg-blue-50/30" : ""}`}
                          >
                            <td className="tbody-td text-center">
                              <input
                                type="checkbox"
                                className="w-3 h-3 cursor-pointer"
                                checked={isSelected}
                                onChange={() =>
                                  toggleUserSelection(user.userId)
                                }
                                disabled={!isEditable}
                              />
                            </td>
                            {/* <td className="tbody-td font-medium text-xs">
                              {user.userId}
                            </td> */}
                            <td className="tbody-td text-xs">
                              {user.username || "-"}
                            </td>
                            <td className="tbody-td text-xs">
                              {user.fullName || "-"}
                            </td>
                            <td className="tbody-td text-xs">
                              {user.email || "-"}
                            </td>
                            <td className="tbody-td text-xs">
                              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                                {user.role || "USER"}
                              </span>
                            </td>
                            <td className="tbody-td">
                              <span
                                className={`text-[10px] font-medium rounded px-1.5 py-0.5 border ${
                                  status === "Mapped"
                                    ? "text-green-600 bg-green-50 border-green-200"
                                    : status === "Unmapping"
                                      ? "text-orange-600 bg-orange-50 border-orange-200"
                                      : status === "New Mapping"
                                        ? "text-blue-600 bg-blue-50 border-blue-200"
                                        : "text-gray-500 bg-gray-50 border-gray-200"
                                }`}
                              >
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowUserMapping;
