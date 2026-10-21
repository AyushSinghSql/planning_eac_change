import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import { Shield } from "lucide-react"; // Matching iconography rule
import { useOutletContext } from "react-router-dom";
import ConfigureField from "./ConfigureField";

const ManageRole = () => {
  // Global lists
  const [roles, setRoles] = useState([]);

  // UI state
  const [activeMainTab, setActiveMainTab] = useState("manageRoles");
  const [initialLoading, setInitialLoading] = useState(true);

  // Manage Roles form state
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [roleNameInput, setRoleNameInput] = useState("");
  const [roleDescriptionInput, setRoleDescriptionInput] = useState("");
  const [roleIsActive, setRoleIsActive] = useState(true);
  const [roleFormLoading, setRoleFormLoading] = useState(false);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [searchTermManageRoles, setSearchTermManageRoles] = useState("");
  const [selectedRoleIdsForDelete, setSelectedRoleIdsForDelete] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRoleForAccess, setSelectedRoleForAccess] = useState(null);

  // Inline table editing / assigned users
  const [editingCell, setEditingCell] = useState(null);
  const [draftCellValue, setDraftCellValue] = useState("");
  const [assignedUsersByRole, setAssignedUsersByRole] = useState({});
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showAssignUsersForm, setShowAssignUsersForm] = useState(false);
  const [selectedUserIdsForAssignment, setSelectedUserIdsForAssignment] =
    useState([]);
  const [assignUsersLoading, setAssignUsersLoading] = useState(false);
  const [assignUserSearch, setAssignUserSearch] = useState("");

  // New user form
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUserUsername, setNewUserUsername] = useState("");
  const [newUserFullName, setNewUserFullName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserConfirmPassword, setNewUserConfirmPassword] = useState("");
  const [newUserRoleId, setNewUserRoleId] = useState("");
  const [newUserGroupIds, setNewUserGroupIds] = useState([]);
  const [newUserGroupDropdownOpen, setNewUserGroupDropdownOpen] =
    useState(false);
  const newUserGroupDropdownRef = useRef(null);
  const [groups, setGroups] = useState([]);
  const [newUserIsActive, setNewUserIsActive] = useState(true);
  const [newUserFormLoading, setNewUserFormLoading] = useState(false);

  const filteredAssignUsers = users.filter((user) => {
    const search = assignUserSearch.trim().toLowerCase();

    if (!search) return true;

    return (
      String(user.username || "")
        .toLowerCase()
        .includes(search) ||
      String(user.fullName || "")
        .toLowerCase()
        .includes(search)
    );
  });

  const singleClickTimeoutRef = useRef(null);

  const { canEdit } = useOutletContext();
  const isEditable = canEdit("manageRole"); // Adjust string key mapping if necessary

  // --- FETCH ROLES ON START ---
  const fetchRoles = async () => {
    try {
      setInitialLoading(true);
      const res = await axios.get(`${backendUrl}/api/Role`);
      const roleData = applyRoleSorting(res.data);
      setRoles(roleData);
    } catch (e) {
      console.error("Fetch roles failed", e);
      setError("Failed to load roles.");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    const handleOutsideGroupDropdownClick = (event) => {
      if (
        newUserGroupDropdownRef.current &&
        !newUserGroupDropdownRef.current.contains(event.target)
      ) {
        setNewUserGroupDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideGroupDropdownClick);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutsideGroupDropdownClick,
      );
  }, []);

  const applyRoleSorting = (roleData) => {
    // Newest roles (highest roleId) first
    return [...(roleData || [])].sort(
      (a, b) => (b.roleId ?? 0) - (a.roleId ?? 0),
    );
  };

  const resetRoleForm = () => {
    setEditingCell(null);
    setDraftCellValue("");
    setEditingRoleId(null);
    setRoleNameInput("");
    setRoleDescriptionInput("");
    setRoleIsActive(true);
    setIsCreatingRole(false);
  };

  const startEditRole = (r) => {
    setIsCreatingRole(false);
    setSelectedRoleForAccess(r);
    setEditingRoleId(r.roleId);
    setRoleNameInput(r.roleName || "");
    setRoleDescriptionInput(r.roleDescription || r.description || "");
    setRoleIsActive(r.isActive !== undefined ? r.isActive : true);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const res = await axios.get(`${backendUrl}/api/User`);
        if (Array.isArray(res.data)) {
          // Keep every user returned by the API available for role assignment.
          // This intentionally includes the current user and users who currently
          // have another role, so any user can be reassigned from this dropdown.
          setUsers(res.data);
        }
      } catch (e) {
        console.error("Fetch users failed", e);
        toast.error("Failed to load users.");
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!users.length || !roles.length) return;
    setAssignedUsersByRole((prev) => {
      const next = { ...prev };
      roles.forEach((role) => {
        if (!Array.isArray(next[role.roleId])) next[role.roleId] = [];
      });
      users.forEach((user) => {
        const explicitRoleId = user.roleId ?? user.roleID;
        const matchingRoleId =
          explicitRoleId != null && Number(explicitRoleId) > 0
            ? explicitRoleId
            : roles.find(
                (role) =>
                  String(role.roleName || "").toLowerCase() ===
                  String(user.role || user.roleName || "").toLowerCase(),
              )?.roleId;
        if (matchingRoleId != null) {
          const current = next[matchingRoleId] || [];
          if (!current.some((id) => String(id) === String(user.userId))) {
            next[matchingRoleId] = [...current, user.userId];
          }
        }
      });
      return next;
    });
  }, [users, roles]);

  const selectRoleAndShowConfigure = (r) => {
    setSelectedRoleForAccess(r);
  };

  const beginCellEdit = (r, field) => {
    if (!isEditable) return;

    // Cancel the delayed single-click action when a double-click occurs.
    if (singleClickTimeoutRef.current) {
      clearTimeout(singleClickTimeoutRef.current);
      singleClickTimeoutRef.current = null;
    }

    // Keep the Role Details form in sync with the row being edited.
    setSelectedRoleForAccess(r);
    setEditingRoleId(r.roleId);
    setRoleNameInput(r.roleName || "");
    setRoleDescriptionInput(r.roleDescription || r.description || "");
    setRoleIsActive(r.isActive !== undefined ? r.isActive : true);

    let value = "";
    if (field === "roleName") value = r.roleName || "";
    else if (field === "description")
      value = r.roleDescription || r.description || "";
    else if (field === "status") value = r.isActive ? "true" : "false";
    setEditingCell({ roleId: r.roleId, field });
    setDraftCellValue(value);
  };

  const handleRoleCellClick = (r) => {
    // Wait briefly so a double-click can be treated as an edit instead.
    if (singleClickTimeoutRef.current) {
      clearTimeout(singleClickTimeoutRef.current);
    }

    singleClickTimeoutRef.current = setTimeout(() => {
      setSelectedRoleIdsForDelete([r.roleId]);
      selectRoleAndShowConfigure(r);
      singleClickTimeoutRef.current = null;
    }, 250);
  };

  const handleRoleCellDoubleClick = (e, r, field) => {
    e.stopPropagation();
    if (singleClickTimeoutRef.current) {
      clearTimeout(singleClickTimeoutRef.current);
      singleClickTimeoutRef.current = null;
    }
    beginCellEdit(r, field);
  };

  const cancelCellEdit = () => {
    setEditingCell(null);
    setDraftCellValue("");
  };

  const commitCellEdit = async () => {
    if (!editingCell) return;
    const { roleId, field } = editingCell;
    const role = roles.find((r) => r.roleId === roleId);
    if (!role) {
      cancelCellEdit();
      return;
    }
    const value =
      typeof draftCellValue === "string"
        ? draftCellValue.trim()
        : draftCellValue;

    const updatedRole = {
      ...role,
      roleName: field === "roleName" ? value : role.roleName,
      roleDescription:
        field === "description"
          ? value
          : role.roleDescription || role.description || "",
      isActive: field === "status" ? draftCellValue === "true" : role.isActive,
    };
    try {
      setRoleFormLoading(true);
      await axios.put(`${backendUrl}/api/Role`, {
        roleId,
        roleName: updatedRole.roleName,
        roleDescription: updatedRole.roleDescription,
        isActive: updatedRole.isActive,
      });
      setRoles((prev) =>
        prev.map((item) =>
          item.roleId === roleId
            ? {
                ...item,
                roleName: updatedRole.roleName,
                roleDescription: updatedRole.roleDescription,
                isActive: updatedRole.isActive,
              }
            : item,
        ),
      );
      setSelectedRoleForAccess((prev) =>
        prev?.roleId === roleId
          ? {
              ...prev,
              roleName: updatedRole.roleName,
              roleDescription: updatedRole.roleDescription,
              isActive: updatedRole.isActive,
            }
          : prev,
      );
      setEditingRoleId(roleId);
      setRoleNameInput(updatedRole.roleName || "");
      setRoleDescriptionInput(updatedRole.roleDescription || "");
      setRoleIsActive(Boolean(updatedRole.isActive));
      toast.success("Role updated successfully.");
    } catch (e) {
      console.error("Inline role update failed", e);
      toast.error(e?.response?.data?.message || "Failed to update role.");
    } finally {
      setRoleFormLoading(false);
      cancelCellEdit();
    }
  };

  const handleCellKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitCellEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelCellEdit();
    }
  };

  const renderTextCell = (r, field) => {
    const isEditing =
      editingCell?.roleId === r.roleId && editingCell?.field === field;
    const value =
      field === "roleName"
        ? r.roleName || ""
        : r.roleDescription || r.description || "";
    if (isEditing) {
      return (
        <input
          autoFocus
          type="text"
          value={draftCellValue}
          onChange={(e) => setDraftCellValue(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          onKeyDown={handleCellKeyDown}
          className="w-full h-[24px] border border-blue-400 rounded px-1 py-0.5 text-xs bg-white outline-none"
        />
      );
    }
    const isRoleName = field === "roleName";

    return (
      <div
        className={`w-full min-h-[24px] flex items-center border border-gray-300 rounded px-1 py-0.5 text-xs truncate ${
          isRoleName ? "bg-gray-50 font-semibold" : "bg-white"
        } ${!isRoleName && isEditable ? "cursor-text" : ""}`}
        onClick={(e) => {
          if (isRoleName) return;
          e.stopPropagation();
          beginCellEdit(r, field);
        }}
      >
        {value || "—"}
      </div>
    );
  };

  const renderStatusCell = (r) => {
    const isEditing =
      editingCell?.roleId === r.roleId && editingCell?.field === "status";
    if (isEditing) {
      return (
        <select
          autoFocus
          value={draftCellValue}
          onChange={(e) => {
            setDraftCellValue(e.target.value);
          }}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
          onKeyDown={handleCellKeyDown}
          className="w-full h-[24px] border border-blue-400 rounded px-1 py-0.5 text-xs bg-white outline-none"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      );
    }
    return (
      <div
        className={`w-full min-h-[24px] flex items-center border border-gray-300 rounded px-1 py-0.5 text-xs bg-white ${
          isEditable ? "cursor-text" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          beginCellEdit(r, "status");
        }}
      >
        {r.isActive ? "Active" : "Inactive"}
      </div>
    );
  };

  const openAssignUsersForm = () => {
    if (!isEditable || !selectedRoleForAccess) {
      toast.warn("Select a role first.");
      return;
    }

    const roleId = selectedRoleForAccess.roleId;
    const assignedIds = users
      .filter((user) => {
        const explicitRoleId = user.roleId ?? user.roleID;
        if (explicitRoleId != null && Number(explicitRoleId) > 0) {
          return String(explicitRoleId) === String(roleId);
        }
        return (
          (user.role || user.roleName || "").toLowerCase() ===
          (selectedRoleForAccess.roleName || "").toLowerCase()
        );
      })
      .map((user) => user.userId);

    setSelectedUserIdsForAssignment(assignedIds);
    setAssignUserSearch("");
    setShowAssignUsersForm(true);
    setShowNewUserForm(false);
  };

  const toggleUserForAssignment = (userId) => {
    setSelectedUserIdsForAssignment((prev) =>
      prev.some((id) => String(id) === String(userId))
        ? prev.filter((id) => String(id) !== String(userId))
        : [...prev, userId],
    );
  };

  const closeAssignUsersForm = () => {
    setShowAssignUsersForm(false);
    setSelectedUserIdsForAssignment([]);
    setAssignUserSearch("");
  };

  const handleAssignUsers = async () => {
    if (!selectedRoleForAccess) {
      toast.warn("Select a role first.");
      return;
    }

    if (selectedUserIdsForAssignment.length === 0) {
      toast.warn("Select at least one user to assign.");
      return;
    }

    try {
      setAssignUsersLoading(true);
      const roleId = Number(selectedRoleForAccess.roleId);

      // Assign the selected users to this role. Users that were not selected
      // are left unchanged. This keeps this action focused on assignment.
      const usersToAssign = users.filter((user) =>
        selectedUserIdsForAssignment.some(
          (id) => String(id) === String(user.userId),
        ),
      );

      await Promise.all(
        usersToAssign.map((user) =>
          axios.put(`${backendUrl}/api/User/${user.userId}`, {
            userId: user.userId,
            username: user.username || "",
            fullName: user.fullName || "",
            email: user.email || "",
            role: String(roleId),
            roleId,
            isActive: user.isActive !== undefined ? user.isActive : true,
          }),
        ),
      );

      const userRes = await axios.get(`${backendUrl}/api/User`);
      if (Array.isArray(userRes.data)) {
        setUsers(userRes.data);
      }

      toast.success("Users assigned successfully.");
      closeAssignUsersForm();
    } catch (e) {
      console.error("Assign users failed", e);
      const apiMessage =
        e?.response?.data?.message ||
        e?.response?.data?.title ||
        (typeof e?.response?.data === "string" ? e.response.data : null);
      toast.error(apiMessage || "Failed to assign users.");
    } finally {
      setAssignUsersLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/user-projects/GetGroups`);
      setGroups(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Fetch groups failed", e);
      toast.error("Failed to load groups.");
    }
  };

  const openNewUserForm = () => {
    if (!isEditable) return;

    setNewUserUsername("");
    setNewUserFullName("");
    setNewUserEmail("");
    setNewUserPassword("");
    setNewUserConfirmPassword("");
    setNewUserRoleId(
      selectedRoleForAccess?.roleId ? String(selectedRoleForAccess.roleId) : "",
    );
    setNewUserGroupIds([]);
    setNewUserGroupDropdownOpen(false);
    fetchGroups();
    setNewUserIsActive(true);
    setShowNewUserForm(true);
  };

  const closeNewUserForm = () => {
    setShowNewUserForm(false);
    setNewUserUsername("");
    setNewUserFullName("");
    setNewUserEmail("");
    setNewUserPassword("");
    setNewUserConfirmPassword("");
    setNewUserRoleId("");
    setNewUserGroupIds([]);
    setNewUserGroupDropdownOpen(false);
    setNewUserIsActive(true);
  };

  const handleCreateNewUser = async () => {
    if (!newUserUsername.trim() || !newUserFullName.trim()) {
      toast.warn("Username and full name are required.");
      return;
    }

    if (!newUserPassword.trim()) {
      toast.warn("Password is required for a new user.");
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!passwordRegex.test(newUserPassword)) {
      toast.error(
        "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.",
      );
      return;
    }

    if (newUserPassword !== newUserConfirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!newUserRoleId) {
      toast.warn("Please select a role.");
      return;
    }

    try {
      setNewUserFormLoading(true);

      const createdUserRes = await axios.post(`${backendUrl}/api/User`, {
        username: newUserUsername.trim(),
        fullName: newUserFullName.trim(),
        email: newUserEmail.trim(),
        role: String(newUserRoleId),
        roleId: Number(newUserRoleId),
        isActive: newUserIsActive,
        password: newUserPassword.trim(),
      });

      const createdUserId =
        createdUserRes?.data?.userId ?? createdUserRes?.data?.id;
      if (createdUserId && newUserGroupIds.length) {
        await axios.post(
          `${backendUrl}/api/user-projects/BulkSyncUsersGroups`,
          {
            userId: createdUserId,
            groupIds: newUserGroupIds,
          },
        );
      }

      toast.success("User created successfully.");

      const userRes = await axios.get(`${backendUrl}/api/User`);
      if (Array.isArray(userRes.data)) {
        setUsers(userRes.data);
      }

      closeNewUserForm();
    } catch (e) {
      console.error("Create user failed", e);
      const apiMessage =
        e?.response?.data?.message ||
        e?.response?.data?.title ||
        (typeof e?.response?.data === "string" ? e.response.data : null);
      toast.error(apiMessage || "Failed to create user.");
    } finally {
      setNewUserFormLoading(false);
    }
  };

  const toggleSelectedRoleForDelete = (id) => {
    setSelectedRoleIdsForDelete((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const areAllRolesSelected = (list) =>
    list.length > 0 &&
    list.every((r) => selectedRoleIdsForDelete.includes(r.roleId));

  const toggleSelectAllRoles = (list) => {
    if (areAllRolesSelected(list)) {
      setSelectedRoleIdsForDelete([]);
    } else {
      setSelectedRoleIdsForDelete(list.map((r) => r.roleId));
    }
  };

  const handleCreateRole = () => {
    if (!isEditable || roleFormLoading) return;

    // Create mode only prepares a blank row. The actual API call happens
    // when the user enters the details and clicks Save.
    setIsCreatingRole(true);
    setEditingCell(null);
    setDraftCellValue("");
    setEditingRoleId(null);
    setRoleNameInput("");
    setRoleDescriptionInput("");
    setRoleIsActive(true);
    setSelectedRoleForAccess(null);
  };

  const handleSaveRole = async () => {
    if (isCreatingRole) {
      if (!roleNameInput.trim()) {
        toast.warn("Role name is required.");
        return;
      }

      try {
        setRoleFormLoading(true);
        await axios.post(`${backendUrl}/api/Role`, {
          roleName: roleNameInput.trim(),
          roleDescription: roleDescriptionInput.trim(),
          isActive: roleIsActive,
        });
        toast.success("Role created successfully.");

        const res = await axios.get(`${backendUrl}/api/Role`);
        const roleData = applyRoleSorting(res.data);
        setRoles(roleData);
        resetRoleForm();
      } catch (e) {
        console.error("Create role failed", e);
        const apiMessage =
          e?.response?.data?.message || "Failed to create role.";
        toast.error(apiMessage);
      } finally {
        setRoleFormLoading(false);
      }
      return;
    }

    if (editingRoleId == null) {
      toast.warn("Select or double-click an existing role before saving.");
      return;
    }

    if (!roleNameInput.trim()) {
      toast.warn("Role name is required.");
      return;
    }

    try {
      setRoleFormLoading(true);
      await axios.put(`${backendUrl}/api/Role`, {
        roleId: editingRoleId,
        roleName: roleNameInput.trim(),
        roleDescription: roleDescriptionInput.trim(),
        isActive: roleIsActive,
      });
      toast.success("Role saved successfully.");

      const res = await axios.get(`${backendUrl}/api/Role`);
      const roleData = applyRoleSorting(res.data);
      setRoles(roleData);

      const savedRole = roleData.find((role) => role.roleId === editingRoleId);
      if (savedRole) {
        setSelectedRoleForAccess(savedRole);
      }
    } catch (e) {
      console.error("Save role failed", e);
      const apiMessage = e?.response?.data?.message || "Failed to save role.";
      toast.error(apiMessage);
    } finally {
      setRoleFormLoading(false);
    }
  };

  // const handleBulkDeleteRoles = async () => {
  //   if (selectedRoleIdsForDelete.length === 0) {
  //     toast.warn("Select at least one role to delete.");
  //     return;
  //   }
  //   if (!window.confirm(`Delete ${selectedRoleIdsForDelete.length} roles?`))
  //     return;

  //   try {
  //     setRoleFormLoading(true);

  //     // Adjust the bulk delete route endpoint if required by your backend schema
  //     await axios.post(
  //       `${backendUrl}/api/Role/BulkDelete`,
  //       selectedRoleIdsForDelete,
  //     );
  //     toast.success("Selected roles deleted.");

  //     setSelectedRoleIdsForDelete([]);

  //     // Refresh list
  //     const res = await axios.get(`${backendUrl}/api/Role`);
  //     const roleData = applyRoleSorting(res.data);
  //     setRoles(roleData);

  //     if (editingRoleId && !roleData.some((r) => r.roleId === editingRoleId)) {
  //       resetRoleForm();
  //     }
  //   } catch (e) {
  //     console.error("Bulk delete roles failed", e);
  //     toast.error("Failed to delete selected roles.");
  //   } finally {
  //     setRoleFormLoading(false);
  //   }
  // };

  const handleBulkDeleteRoles = async () => {
    if (selectedRoleIdsForDelete.length === 0) {
      toast.warn("Select at least one role to delete.");
      return;
    }

    if (!window.confirm(`Delete ${selectedRoleIdsForDelete.length} roles?`)) {
      return;
    }

    try {
      setRoleFormLoading(true);

      // Execute API DELETE requests concurrently for all selected IDs
      await Promise.all(
        selectedRoleIdsForDelete.map((roleId) =>
          axios.delete(`${backendUrl}/api/Role/${roleId}`),
        ),
      );

      toast.success("Selected roles deleted successfully.");
      setSelectedRoleIdsForDelete([]);

      // Refresh list from endpoint
      const res = await axios.get(`${backendUrl}/api/Role`);
      const roleData = applyRoleSorting(res.data);
      setRoles(roleData);

      if (editingRoleId && !roleData.some((r) => r.roleId === editingRoleId)) {
        resetRoleForm();
      }
    } catch (e) {
      console.error("Bulk delete roles failed", e);
      toast.error("Failed to delete selected roles.");
    } finally {
      setRoleFormLoading(false);
    }
  };

  const renderManageRolesTab = () => {
    const filteredRoles = roles.filter((r) =>
      `${r.roleId} ${r.roleName || ""} ${r.roleDescription || r.description || ""}`
        .toLowerCase()
        .includes(searchTermManageRoles.toLowerCase()),
    );

    const allSelected = areAllRolesSelected(filteredRoles);

    return (
      <>
        <div>
          <div className="flex justify-between items-center mb-3 mt-5">
            <div className="flex gap-2 items-center">
              <h3 className="input-label">Existing Roles</h3>
              <input
                type="text"
                placeholder="Search by id, name, description..."
                value={searchTermManageRoles}
                onChange={(e) => setSearchTermManageRoles(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm w-64"
              />
            </div>
            <div className="flex items-center gap-x-2">
              {isEditable && (
                <>
                  <button
                    type="button"
                    onClick={handleCreateRole}
                    className="btn1 btn-blue disabled:opacity-60"
                    disabled={roleFormLoading}
                  >
                    Create Role
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveRole}
                    className="btn1 btn-blue disabled:opacity-50"
                    disabled={roleFormLoading}
                    title="Save role changes"
                  >
                    {roleFormLoading ? "Saving..." : "Save"}
                  </button>
                </>
              )}
              {(editingRoleId != null || isCreatingRole) && (
                <button
                  type="button"
                  onClick={resetRoleForm}
                  className="btn1 btn-blue"
                  disabled={roleFormLoading}
                >
                  Cancel
                </button>
              )}
              {isEditable && (
                <button
                  type="button"
                  onClick={handleBulkDeleteRoles}
                  className={`btn1 btn-red disabled:opacity-50 ${roleFormLoading || selectedRoleIdsForDelete.length === 0 ? "hidden" : ""}`}
                  disabled={
                    roleFormLoading || selectedRoleIdsForDelete.length === 0
                  }
                >
                  Delete ({selectedRoleIdsForDelete.length})
                </button>
              )}
            </div>
          </div>

          <div className="rounded border border-gray-200 overflow-hidden relative">
            <div className="overflow-x-auto max-h-80 border border-gray-300 rounded">
              <table className="w-full table-fixed text-sm">
                <thead className="thead">
                  <tr className="bg-white border-b border-gray-300">
                    <th className="th-thead text-left text-black bg-[#e5f3fb] text-sm w-10">
                      <input
                        type="checkbox"
                        className="w-3 h-3"
                        checked={allSelected}
                        onChange={() => toggleSelectAllRoles(filteredRoles)}
                      />
                    </th>
                    <th className="th-thead text-left bg-[#e5f3fb] text-black text-xs">
                      Role Name
                    </th>
                    <th className="th-thead text-left bg-[#e5f3fb] text-black text-xs">
                      Description
                    </th>
                    <th className="th-thead text-left bg-[#e5f3fb] text-black text-xs">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {initialLoading ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-gray-500 font-medium">
                            Fetching roles...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : roleFormLoading ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-10 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-gray-500 font-medium">
                            Loading roles...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : !isCreatingRole && filteredRoles.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-6 text-center text-gray-500"
                      >
                        No roles found.
                      </td>
                    </tr>
                  ) : (
                    <>
                      {isCreatingRole && (
                        <tr className="bg-white border-b border-blue-300">
                          <td className="tbody-td">
                            <input
                              type="checkbox"
                              className="w-3 h-3"
                              disabled
                            />
                          </td>
                          <td className="tbody-td">
                            <input
                              autoFocus
                              type="text"
                              value={roleNameInput}
                              onChange={(e) => setRoleNameInput(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full h-[24px] border border-blue-400 rounded px-1 py-0.5 text-xs bg-white outline-none"
                              placeholder="Enter role name"
                              disabled={roleFormLoading}
                            />
                          </td>
                          <td className="tbody-td">
                            <input
                              type="text"
                              value={roleDescriptionInput}
                              onChange={(e) =>
                                setRoleDescriptionInput(e.target.value)
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="w-full h-[24px] border border-blue-400 rounded px-1 py-0.5 text-xs bg-white outline-none"
                              placeholder="Enter description"
                              disabled={roleFormLoading}
                            />
                          </td>
                          <td className="tbody-td">
                            <select
                              value={roleIsActive ? "true" : "false"}
                              onChange={(e) =>
                                setRoleIsActive(e.target.value === "true")
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="w-full h-[24px] border border-blue-400 rounded px-1 py-0.5 text-xs bg-white outline-none"
                              disabled={roleFormLoading}
                            >
                              <option value="true">Active</option>
                              <option value="false">Inactive</option>
                            </select>
                          </td>
                        </tr>
                      )}
                      {filteredRoles.map((r) => {
                        const selected = selectedRoleIdsForDelete.includes(
                          r.roleId,
                        );
                        return (
                          <tr
                            key={r.roleId}
                            className="hover:bg-gray-50 border-b border-gray-300"
                          >
                            <td className="tbody-td">
                              <input
                                type="checkbox"
                                className="w-3 h-3"
                                checked={selected}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  toggleSelectedRoleForDelete(r.roleId);
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </td>
                            <td
                              className="tbody-td font-semibold"
                              onClick={() => handleRoleCellClick(r)}
                              title="Click to configure role"
                            >
                              {renderTextCell(r, "roleName")}
                            </td>
                            <td
                              className="tbody-td"
                              onClick={() => handleRoleCellClick(r)}
                              title="Click to edit Description"
                            >
                              {renderTextCell(r, "description")}
                            </td>
                            <td
                              className="tbody-td"
                              onClick={() => handleRoleCellClick(r)}
                              title="Click to edit Status"
                            >
                              {renderStatusCell(r)}
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 rounded border border-gray-300 bg-white overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-[#e5f3fb] border-b border-gray-300">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Assigned Users
                </h3>
                <p className="text-xs text-gray-600">
                  {selectedRoleForAccess
                    ? `Users assigned to ${selectedRoleForAccess.roleName || "this role"}`
                    : "Select a role to view its assigned users."}
                </p>
              </div>

              {isEditable && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="btn1 btn-blue"
                    onClick={openAssignUsersForm}
                    disabled={!selectedRoleForAccess || assignUsersLoading}
                  >
                    Assign Users
                  </button>
                  <button
                    type="button"
                    className="btn1 btn-blue"
                    onClick={openNewUserForm}
                    disabled={!selectedRoleForAccess}
                  >
                    Create New User
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              {!selectedRoleForAccess ? (
                <div className="px-3 py-5 text-sm text-gray-500 text-center">
                  Select a role from the table to view assigned users.
                </div>
              ) : (
                (() => {
                  const assignedUsers = users.filter((user) => {
                    const explicitRoleId = user.roleId ?? user.roleID;
                    if (explicitRoleId != null && Number(explicitRoleId) > 0) {
                      return (
                        String(explicitRoleId) ===
                        String(selectedRoleForAccess.roleId)
                      );
                    }

                    return (
                      String(user.role || user.roleName || "").toLowerCase() ===
                      String(selectedRoleForAccess.roleName || "").toLowerCase()
                    );
                  });

                  return assignedUsers.length === 0 ? (
                    <div className="px-3 py-5 text-sm text-gray-500 text-center">
                      No users are currently assigned to this role.
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-white border-b border-gray-300">
                          <th className="th-thead text-left bg-[#e5f3fb] text-black text-xs">
                            Username
                          </th>
                          <th className="th-thead text-left bg-[#e5f3fb] text-black text-xs">
                            Full Name
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignedUsers.map((user) => (
                          <tr
                            key={user.userId}
                            className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                          >
                            <td className="tbody-td">{user.username || "—"}</td>
                            <td className="tbody-td">{user.fullName || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()
              )}
            </div>
          </div>

          {showAssignUsersForm && selectedRoleForAccess && (
            <div className="mt-3 rounded border border-gray-300 bg-white overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-[#e5f3fb] border-b border-gray-300">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Assign Users
                  </h3>
                  <p className="text-xs text-gray-600">
                    Select the users who should be assigned to{" "}
                    <strong>{selectedRoleForAccess.roleName}</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3">
                {usersLoading ? (
                  <div className="py-4 text-center text-sm text-gray-500">
                    Loading users...
                  </div>
                ) : users.length === 0 ? (
                  <div className="py-4 text-center text-sm text-gray-500">
                    No users available.
                  </div>
                ) : (
                  <>
                    <div className="mb-2">
                      <input
                        type="text"
                        value={assignUserSearch}
                        onChange={(e) => setAssignUserSearch(e.target.value)}
                        placeholder="Search by username or full name..."
                        className="border border-gray-300 rounded px-3 py-1.5 text-sm w-full outline-none focus:border-blue-400"
                        disabled={assignUsersLoading}
                      />
                    </div>

                    {filteredAssignUsers.length === 0 ? (
                      <div className="border border-gray-300 rounded py-4 text-center text-sm text-gray-500">
                        No users match your search.
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded max-h-56 overflow-y-auto">
                        {filteredAssignUsers.map((user) => {
                          const checked = selectedUserIdsForAssignment.some(
                            (id) => String(id) === String(user.userId),
                          );
                          return (
                            <label
                              key={user.userId}
                              className="flex items-center gap-3 px-3 py-2 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                className="w-3 h-3"
                                checked={checked}
                                onChange={() =>
                                  toggleUserForAssignment(user.userId)
                                }
                                disabled={assignUsersLoading}
                              />
                              <span className="text-xs text-gray-800 min-w-[160px]">
                                {user.username || "—"}
                              </span>
                              <span className="text-xs text-gray-600">
                                {user.fullName || "—"}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex justify-end gap-2 px-3 pb-3">
                <button
                  type="button"
                  className="btn1 btn-blue"
                  onClick={closeAssignUsersForm}
                  disabled={assignUsersLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn1 btn-blue disabled:opacity-60"
                  onClick={handleAssignUsers}
                  disabled={assignUsersLoading || usersLoading}
                >
                  {assignUsersLoading ? "Saving..." : "Save Assignments"}
                </button>
              </div>
            </div>
          )}

          {showNewUserForm && (
            <div className="mt-3 rounded border border-gray-300 bg-white overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-[#e5f3fb] border-b border-gray-300">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Create New User
                  </h3>
                  <p className="text-xs text-gray-600">
                    Create a user and assign a role.
                  </p>
                </div>
              </div>

              <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <label className="input-label whitespace-nowrap">
                    Username
                  </label>
                  <input
                    type="text"
                    value={newUserUsername}
                    onChange={(e) => setNewUserUsername(e.target.value)}
                    className="input-style w-full"
                    placeholder="Username"
                    disabled={newUserFormLoading}
                    autoFocus
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="input-label whitespace-nowrap">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newUserFullName}
                    onChange={(e) => setNewUserFullName(e.target.value)}
                    className="input-style w-full"
                    placeholder="Full name"
                    disabled={newUserFormLoading}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="input-label whitespace-nowrap">Email</label>
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="input-style w-full"
                    placeholder="Email"
                    disabled={newUserFormLoading}
                  />
                </div>

                <div className="flex items-start gap-2">
                  <label className="input-label whitespace-nowrap mt-2">
                    Password
                  </label>
                  <div className="flex flex-col flex-1">
                    <input
                      type="password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="input-style w-full"
                      placeholder="Password"
                      disabled={newUserFormLoading}
                    />
                    <p className="text-[10px] text-red-400 mt-1">
                      Min 8 chars. Include uppercase, number and special
                      character.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="input-label whitespace-nowrap">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={newUserConfirmPassword}
                    onChange={(e) => setNewUserConfirmPassword(e.target.value)}
                    className="input-style w-full"
                    placeholder="Confirm password"
                    disabled={newUserFormLoading}
                  />
                </div>

                <div
                  className="flex items-center gap-2"
                  ref={newUserGroupDropdownRef}
                >
                  <label className="input-label whitespace-nowrap">Group</label>
                  <div className="relative w-full">
                    <button
                      type="button"
                      className="input-style w-full text-left flex items-center justify-between gap-2"
                      onClick={() =>
                        setNewUserGroupDropdownOpen((prev) => !prev)
                      }
                      disabled={newUserFormLoading}
                    >
                      <span
                        className={
                          newUserGroupIds.length
                            ? "text-gray-800 truncate"
                            : "text-gray-400 truncate"
                        }
                      >
                        {newUserGroupIds.length
                          ? `${newUserGroupIds.length} group${newUserGroupIds.length > 1 ? "s" : ""} selected`
                          : "Select group"}
                      </span>
                      <span className="text-gray-500 text-xs">▾</span>
                    </button>

                    {newUserGroupDropdownOpen && (
                      <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-scroll rounded border border-gray-300 bg-white shadow-lg">
                        {groups.length === 0 ? (
                          <div className="px-3 py-2 text-xs text-gray-500">
                            No groups available.
                          </div>
                        ) : (
                          groups.map((group) => {
                            const groupId = String(group.orgGroupId);
                            const checked = newUserGroupIds
                              .map(String)
                              .includes(groupId);
                            return (
                              <label
                                key={group.orgGroupId}
                                className="flex items-center gap-2 px-3 py-2 text-xs text-gray-800 cursor-pointer hover:bg-gray-50"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() =>
                                    setNewUserGroupIds((prev) =>
                                      prev.map(String).includes(groupId)
                                        ? prev.filter(
                                            (id) => String(id) !== groupId,
                                          )
                                        : [...prev, group.orgGroupId],
                                    )
                                  }
                                  disabled={newUserFormLoading}
                                />
                                <span>{`${group.orgGroupCode || group.orgGroupId} - ${group.orgGroupName || ""}`}</span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="input-label whitespace-nowrap">Role</label>
                  <select
                    value={newUserRoleId}
                    onChange={(e) => setNewUserRoleId(e.target.value)}
                    className="input-style w-full"
                    disabled={newUserFormLoading}
                  >
                    <option value="">Select role</option>
                    {roles.map((role) => (
                      <option key={role.roleId} value={role.roleId}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="input-label whitespace-nowrap">
                    Status
                  </label>
                  <select
                    value={newUserIsActive ? "true" : "false"}
                    onChange={(e) =>
                      setNewUserIsActive(e.target.value === "true")
                    }
                    className="input-style w-full"
                    disabled={newUserFormLoading}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 px-3 pb-3">
                <button
                  type="button"
                  className="btn1 btn-blue"
                  onClick={closeNewUserForm}
                  disabled={newUserFormLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn1 btn-blue disabled:opacity-60"
                  onClick={handleCreateNewUser}
                  disabled={newUserFormLoading}
                >
                  {newUserFormLoading ? "Creating..." : "Create User"}
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="p-4 rounded-sm flex items-center justify-between bg-white">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Shield size={20} className="text-blue-600" />
          Manage Role
        </h2>
      </div>
      <div className="p-3 w-full mx-auto bg-white rounded shadow">
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        {activeMainTab === "manageRoles" && renderManageRolesTab()}
      </div>

      <div className="bg-[#e5f3fb] rounded-sm p-2 space-y-2">
        <ConfigureField
          key={selectedRoleForAccess?.roleId || "no-role-selected"}
          initialConfigMode="role"
          initialSelectedRoleId={String(selectedRoleForAccess?.roleId || "")}
          roleOnly
        />

        {/* <div className="bg-white rounded-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Role Details</h3>
            {editingRoleId && (
              <button type="button" onClick={resetRoleForm} className="btn1 btn-blue">
                Cancel
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="flex flex-col gap-1 text-sm font-medium">
              Role Name
              <input value={roleNameInput} onChange={(e) => setRoleNameInput(e.target.value)} className="border border-gray-300 rounded px-3 py-2" placeholder="Role name" />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Description
              <input value={roleDescriptionInput} onChange={(e) => setRoleDescriptionInput(e.target.value)} className="border border-gray-300 rounded px-3 py-2" placeholder="Role description" />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Status
              <select value={roleIsActive ? "active" : "inactive"} onChange={(e) => setRoleIsActive(e.target.value === "active")} className="border border-gray-300 rounded px-3 py-2">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>
          {isEditable && (
            <div className="mt-4">
              <button type="button" onClick={handleCreateOrUpdateRole} className="btn1 btn-blue" disabled={roleFormLoading}>
                {roleFormLoading ? "Saving..." : editingRoleId ? "Update Role" : "Create Role"}
              </button>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default ManageRole;
