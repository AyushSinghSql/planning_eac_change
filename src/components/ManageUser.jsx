import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import ConfigureField from "./ConfigureField";

const ManageUser = () => {
  const { canEdit } = useOutletContext();
  const isEditable = canEdit("manageUser");

  // ------------------------------------------------------------
  // USERS / ROLES
  // ------------------------------------------------------------
  // Keep an unsaved New User draft outside the API response. This is
  // important because the users API can refresh while the user is being
  // created (including during React StrictMode / component remounts).
  const NEW_USER_DRAFT_KEY = "manageUser_unsaved_new_user";

  const loadNewUserDraft = () => {
    try {
      if (typeof window === "undefined") return null;

      const raw = window.sessionStorage.getItem(NEW_USER_DRAFT_KEY);
      if (!raw) return null;

      const draft = JSON.parse(raw);
      if (!draft?.userId || !String(draft.userId).startsWith("new-")) {
        window.sessionStorage.removeItem(NEW_USER_DRAFT_KEY);
        return null;
      }

      return {
        userId: draft.userId,
        username: draft.username || "",
        fullName: draft.fullName || "",
        email: draft.email || "",
        role: draft.role || "",
        isActive: draft.isActive !== false,
        isNew: true,
      };
    } catch (e) {
      console.error("Failed to restore New User draft", e);
      return null;
    }
  };

  // IMPORTANT: the unsaved New User is kept in its own state.
  // It is never part of the API users array, so an API refresh can never
  // replace/remove it while the user is typing.
  const [newUserDraft, setNewUserDraft] = useState(() => loadNewUserDraft());

  const [users, setUsers] = useState([]);
  const initialUsersRef = useRef(null);
  const [roles, setRoles] = useState([]);
  const [editedUserIds, setEditedUserIds] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [userFormLoading, setUserFormLoading] = useState(false);
  const [error, setError] = useState(null);

  // ------------------------------------------------------------
  // TABLE UI
  // ------------------------------------------------------------
  const [searchTermManageUsers, setSearchTermManageUsers] = useState("");

  // Selected rows
  const [selectedUserIdsForDelete, setSelectedUserIdsForDelete] = useState([]);

  // The user whose configuration is displayed underneath the table
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Cell currently being edited
  const [editingCell, setEditingCell] = useState(null);

  // ------------------------------------------------------------
  // NEW / EDITED ROW DATA
  // ------------------------------------------------------------
  const [newUserRowId, setNewUserRowId] = useState(
    () => loadNewUserDraft()?.userId || null,
  );
  const newUserRowRef = useRef(newUserRowId);

  /*
   * Passwords are stored separately per user.
   *
   * Example:
   * {
   *   11: {
   *     password: "abc",
   *     confirmPassword: "abc"
   *   }
   * }
   */
  const [passwords, setPasswords] = useState({});

  // ------------------------------------------------------------
  // USER GROUPS
  // ------------------------------------------------------------
  const [groups, setGroups] = useState([]);
  const [groupSelections, setGroupSelections] = useState({});
  const initialGroupSelectionsRef = useRef(null);
  const [openGroupDropdown, setOpenGroupDropdown] = useState(null);
  const [editedGroupUserIds, setEditedGroupUserIds] = useState([]);

  // ------------------------------------------------------------
  // RESET PASSWORD
  // ------------------------------------------------------------
  const [resetPasswordUserId, setResetPasswordUserId] = useState(null);
  const [resetPasswordValues, setResetPasswordValues] = useState({
    password: "",
    confirmPassword: "",
  });

  // ------------------------------------------------------------
  // DELETE CONFIRMATION
  // ------------------------------------------------------------
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ------------------------------------------------------------
  // FETCH USERS
  // ------------------------------------------------------------
  const applyUserSorting = (userData) => {
    return [...(userData || [])].sort(
      (a, b) => (b.userId ?? 0) - (a.userId ?? 0),
    );
  };

  const fetchUsers = async () => {
    try {
      setInitialLoading(true);

      const userRes = await axios.get(`${backendUrl}/api/User`);
      const userData = applyUserSorting(userRes.data);

      // The API only owns saved users. The unsaved New User is stored
      // separately in newUserDraft and is therefore untouched by refreshes.
      setUsers(userData);
      if (initialUsersRef.current === null) {
        initialUsersRef.current = structuredClone(userData);
      }
      await fetchUserGroupMappings(userData);
    } catch (e) {
      console.error("Fetch users failed", e);
      setError("Failed to load users.");
    } finally {
      setInitialLoading(false);
    }
  };

  // ------------------------------------------------------------
  // FETCH ROLES
  // ------------------------------------------------------------
  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${backendUrl}/Orgnization/Roles`);

      setRoles(res.data || []);
    } catch (e) {
      console.error("Fetch roles failed", e);
    }
  };

  // ------------------------------------------------------------
  // FETCH GROUPS / USER-GROUP MAPPINGS
  // ------------------------------------------------------------
  const fetchGroups = async () => {
    try {
      const groupsRes = await axios.get(
        `${backendUrl}/api/user-projects/GetGroups`,
      );

      setGroups(groupsRes.data || []);
    } catch (e) {
      console.error("Fetch groups failed", e);
      toast.error("Failed to load groups.");
    }
  };

  const fetchUserGroupMappings = async (userData = users) => {
    const existingUsers = (userData || []).filter(
      (user) => !String(user.userId).startsWith("new-"),
    );

    if (existingUsers.length === 0) {
      return;
    }

    try {
      const results = await Promise.all(
        existingUsers.map(async (user) => {
          try {
            const res = await axios.get(
              `${backendUrl}/api/user-projects/Groups/${user.userId}`,
            );

            const mappedGroups = res.data || [];

            const mappedIds = Array.isArray(mappedGroups)
              ? mappedGroups
                  .map((group) =>
                    typeof group === "object" ? group.orgGroupId : group,
                  )
                  .filter((id) => id !== null && id !== undefined)
              : [];

            return [user.userId, mappedIds];
          } catch (e) {
            console.error(`Fetch groups for user ${user.userId} failed`, e);
            return [user.userId, []];
          }
        }),
      );

      setGroupSelections((prev) => {
        const next = { ...(prev || {}), ...Object.fromEntries(results) };
        if (initialGroupSelectionsRef.current === null) {
          initialGroupSelectionsRef.current = structuredClone(next);
        }
        return next;
      });
    } catch (e) {
      console.error("Fetch user-group mappings failed", e);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([fetchUsers(), fetchRoles(), fetchGroups()]);
    };

    loadInitialData();
  }, []);

  // ------------------------------------------------------------
  // ROLE HELPERS
  // ------------------------------------------------------------
  const getRoleName = (role) => {
    if (!role) return "";

    if (typeof role === "string") {
      const roleMatch = roles.find(
        (r) => String(r.roleName).toLowerCase() === String(role).toLowerCase(),
      );

      return roleMatch?.roleName || role;
    }

    const roleMatch = roles.find((r) => Number(r.roleId) === Number(role));

    return roleMatch?.roleName || "";
  };

  const getRoleId = (role) => {
    if (!role) return "";

    const roleMatch = roles.find(
      (r) => String(r.roleName).toLowerCase() === String(role).toLowerCase(),
    );

    return roleMatch?.roleId ?? role;
  };

  // ------------------------------------------------------------
  // ROW SELECTION
  // ------------------------------------------------------------
  const selectUserRow = (userId) => {
    setSelectedUserId(userId);
    setSelectedUserIdsForDelete([userId]);
    setOpenGroupDropdown(null);
  };

  const toggleSelectedUserForDelete = (userId) => {
    setSelectedUserIdsForDelete((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      }

      return [...prev, userId];
    });

    // Clicking checkbox should also select the row
    setSelectedUserId(userId);
  };

  const areAllUsersSelected = (list) =>
    list.length > 0 &&
    list.every((u) => selectedUserIdsForDelete.includes(u.userId));

  const toggleSelectAllUsers = (list) => {
    if (areAllUsersSelected(list)) {
      setSelectedUserIdsForDelete([]);
      return;
    }

    setSelectedUserIdsForDelete(list.map((u) => u.userId));

    if (list.length > 0) {
      setSelectedUserId(list[0].userId);
    }
  };

  // ------------------------------------------------------------
  // INLINE CELL EDITING
  // ------------------------------------------------------------
  const startCellEdit = (userId, field) => {
    if (!isEditable) return;

    setEditingCell({
      userId,
      field,
    });
  };

  const finishCellEdit = () => {
    setEditingCell(null);
  };

  const updateUserField = (userId, field, value) => {
    if (String(userId).startsWith("new-")) {
      setNewUserDraft((prev) => {
        const next = {
          ...(prev || {
            userId,
            username: "",
            fullName: "",
            email: "",
            role: "",
            isActive: true,
            isNew: true,
          }),
          [field]: value,
        };

        try {
          window.sessionStorage.setItem(
            NEW_USER_DRAFT_KEY,
            JSON.stringify(next),
          );
        } catch (e) {
          console.error("Failed to persist New User draft", e);
        }

        return next;
      });
      return;
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.userId === userId ? { ...user, [field]: value } : user,
      ),
    );

    setEditedUserIds((prev) =>
      prev.includes(userId) ? prev : [...prev, userId],
    );
  };

  // ------------------------------------------------------------
  // GROUP HANDLING
  // ------------------------------------------------------------
  const getGroupOptions = () =>
    groups.map((group) => ({
      value: group.orgGroupId,
      label: `${group.orgGroupCode || group.orgGroupId} - ${
        group.orgGroupName || ""
      }`,
    }));

  const getSelectedGroupIds = (userId) => groupSelections[userId] || [];

  const getSelectedGroupLabels = (userId) => {
    const selectedIds = getSelectedGroupIds(userId);

    return selectedIds
      .map((id) => {
        const group = groups.find(
          (item) => String(item.orgGroupId) === String(id),
        );

        return group
          ? group.orgGroupName || group.orgGroupCode || group.orgGroupId
          : id;
      })
      .join(", ");
  };

  const toggleGroupForUser = (userId, groupId) => {
    if (!isEditable) return;

    setGroupSelections((prev) => {
      const current = prev[userId] || [];
      const exists = current.some((id) => String(id) === String(groupId));

      return {
        ...prev,
        [userId]: exists
          ? current.filter((id) => String(id) !== String(groupId))
          : [...current, groupId],
      };
    });

    if (!String(userId).startsWith("new-")) {
      setEditedGroupUserIds((prev) =>
        prev.includes(userId) ? prev : [...prev, userId],
      );
    }
  };

  const saveUserGroups = async (userId) => {
    if (String(userId).startsWith("new-")) {
      return true;
    }

    await axios.post(`${backendUrl}/api/user-projects/BulkSyncUsersGroups`, {
      userId,
      groupIds: getSelectedGroupIds(userId),
    });

    return true;
  };

  useEffect(() => {
    const closeGroupDropdown = () => setOpenGroupDropdown(null);
    document.addEventListener("mousedown", closeGroupDropdown);
    return () => document.removeEventListener("mousedown", closeGroupDropdown);
  }, []);

  const renderGroupsCell = (user) => {
    const selectedIds = getSelectedGroupIds(user.userId);
    const isOpen = openGroupDropdown === user.userId;
    const options = getGroupOptions();

    return (
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          disabled={!isEditable}
          onClick={() =>
            isEditable && setOpenGroupDropdown(isOpen ? null : user.userId)
          }
          className="w-full min-h-[24px] border border-gray-300 rounded px-1 py-0.5 text-xs text-left bg-white disabled:bg-gray-50 disabled:text-gray-500"
        >
          <span className="block truncate">
            {getSelectedGroupLabels(user.userId) || "Select groups"}
          </span>
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full mt-1 z-50 w-64 max-h-56 overflow-y-auto rounded border border-gray-300 bg-white shadow-lg">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-xs text-gray-500">
                No groups available.
              </div>
            ) : (
              options.map((option) => {
                const checked = selectedIds.some(
                  (id) => String(id) === String(option.value),
                );

                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-3 h-3"
                      checked={checked}
                      onChange={() =>
                        toggleGroupForUser(user.userId, option.value)
                      }
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })
            )}
          </div>
        )}
      </div>
    );
  };

  // ------------------------------------------------------------
  // PASSWORD HANDLING
  // ------------------------------------------------------------
  const getPasswordValues = (userId) => {
    return (
      passwords[userId] || {
        password: "",
        confirmPassword: "",
      }
    );
  };

  const updatePassword = (userId, field, value) => {
    setPasswords((prev) => ({
      ...prev,
      [userId]: {
        ...(prev[userId] || {
          password: "",
          confirmPassword: "",
        }),
        [field]: value,
      },
    }));
  };

  const validatePassword = (userId, showToast = false) => {
    const user = String(userId).startsWith("new-")
      ? newUserDraft
      : users.find((u) => u.userId === userId);
    const values = getPasswordValues(userId);

    if (!user) {
      return false;
    }

    // New user: both password fields are required
    if (user.isNew) {
      if (!values.password || !values.confirmPassword) {
        toast.error("Password and Confirm Password are required.");
        return false;
      }

      if (values.password !== values.confirmPassword) {
        toast.error("Passwords do not match.");
        return false;
      }

      return true;
    }

    // Existing user: both blank means no password change
    if (!values.password && !values.confirmPassword) {
      return true;
    }

    // Existing user: one field entered but not the other
    if (!values.password || !values.confirmPassword) {
      toast.error("Password and Confirm Password are required.");
      return false;
    }

    // Existing user: password change
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    return true;
  };

  // ------------------------------------------------------------
  // NEW USER
  // ------------------------------------------------------------
  const handleNewUser = () => {
    const temporaryId = `new-${Date.now()}`;
    newUserRowRef.current = temporaryId;

    const newUser = {
      userId: temporaryId,
      username: "",
      fullName: "",
      email: "",
      role: "",
      isActive: true,
      isNew: true,
    };

    try {
      window.sessionStorage.setItem(
        NEW_USER_DRAFT_KEY,
        JSON.stringify(newUser),
      );
    } catch (e) {
      console.error("Failed to persist New User draft", e);
    }

    setNewUserDraft(newUser);

    setNewUserRowId(temporaryId);
    setSelectedUserId(temporaryId);

    setPasswords((prev) => ({
      ...prev,
      [temporaryId]: {
        password: "",
        confirmPassword: "",
      },
    }));

    setGroupSelections((prev) => ({
      ...prev,
      [temporaryId]: [],
    }));

    // Start editing username immediately
    setEditingCell({
      userId: temporaryId,
      field: "username",
    });
  };

  // ------------------------------------------------------------
  // SAVE ONE USER
  // ------------------------------------------------------------
  const saveUser = async (user) => {
    if (!validatePassword(user.userId, true)) {
      return false;
    }

    if (!user.username?.trim() || !user.fullName?.trim()) {
      toast.warn("Username and full name are required.");
      return false;
    }

    const passwordValues = getPasswordValues(user.userId);

    try {
      const roleId = getRoleId(user.role);

      const payload = {
        username: user.username.trim(),
        fullName: user.fullName.trim(),
        email: user.email?.trim() || "",
        role: String(roleId || ""),
        roleId: Number(roleId || 0),
        isActive: Boolean(user.isActive),
      };

      // --------------------------------------------------------
      // CREATE
      // --------------------------------------------------------
      if (user.isNew) {
        if (!passwordValues.password) {
          toast.warn("Password is required for a new user.");
          return false;
        }

        const passwordRegex =
          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

        if (!passwordRegex.test(passwordValues.password)) {
          toast.error(
            "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.",
          );
          return false;
        }

        await axios.post(`${backendUrl}/api/User`, {
          ...payload,
          password: passwordValues.password,
        });

        toast.success("User created successfully.");
      }

      // --------------------------------------------------------
      // UPDATE
      // --------------------------------------------------------
      else {
        if (passwordValues.password) {
          payload.password = passwordValues.password;
        }

        await axios.put(`${backendUrl}/api/User/${user.userId}`, {
          ...payload,
          userId: user.userId,
        });

        toast.success("User updated successfully.");
      }

      return true;
    } catch (e) {
      console.error("Save user failed", e);

      const apiMessage =
        e?.response?.data?.message ||
        e?.response?.data?.title ||
        (typeof e?.response?.data === "string" ? e.response.data : null);

      toast.error(apiMessage || "Failed to save user.");

      return false;
    }
  };

  // ------------------------------------------------------------
  // SAVE BUTTON
  // ------------------------------------------------------------
  const handleSaveUsers = async () => {
    if (userFormLoading) return;

    setUserFormLoading(true);

    try {
      const newUsers = newUserDraft ? [newUserDraft] : [];

      const usersToValidate = users.filter((u) => {
        const values = getPasswordValues(u.userId);

        // Always validate new users
        if (u.isNew) {
          return true;
        }

        // Existing users only need validation if
        // they are attempting to change their password
        return values.password || values.confirmPassword;
      });
      /*
       * Validate every row that has password values.
       */
      for (const user of usersToValidate) {
        if (!validatePassword(user.userId, true)) {
          return;
        }
      }

      /*
       * Save new users.
       */
      for (const user of newUsers) {
        const saved = await saveUser(user);

        if (!saved) {
          return;
        }
      }

      /*
       * Save existing users that were changed through inline editing.
       */
      const existingUsersToSave = users.filter(
        (u) =>
          editedUserIds.includes(u.userId) &&
          !String(u.userId).startsWith("new-"),
      );

      for (const user of existingUsersToSave) {
        const saved = await saveUser(user);

        if (!saved) {
          return;
        }
      }

      /*
       * Save group mappings separately because the User API does not
       * own the User ↔ Groups relationship.
       */
      for (const userId of editedGroupUserIds) {
        if (
          !String(userId).startsWith("new-") &&
          !existingUsersToSave.some((user) => user.userId === userId)
        ) {
          await saveUserGroups(userId);
        }
      }

      newUserRowRef.current = null;
      setNewUserDraft(null);
      try {
        window.sessionStorage.removeItem(NEW_USER_DRAFT_KEY);
      } catch (e) {
        console.error("Failed to clear New User draft", e);
      }
      await fetchUsers();

      setPasswords({});
      setGroupSelections({});
      setEditedGroupUserIds([]);
      setEditedUserIds([]);
      setNewUserRowId(null);
      setEditingCell(null);
    } finally {
      setUserFormLoading(false);
    }
  };

  // ------------------------------------------------------------
  // RESET PASSWORD
  // ------------------------------------------------------------
  const openResetPassword = (userId) => {
    if (!isEditable) return;

    setResetPasswordUserId(userId);
    setResetPasswordValues({
      password: "",
      confirmPassword: "",
    });
  };

  const closeResetPassword = () => {
    setResetPasswordUserId(null);
    setResetPasswordValues({
      password: "",
      confirmPassword: "",
    });
  };

  const handleResetPassword = async () => {
    if (!resetPasswordUserId || userFormLoading) return;

    const { password, confirmPassword } = resetPasswordValues;

    if (!password || !confirmPassword) {
      toast.error("Password and Confirm Password are required.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.",
      );
      return;
    }

    const user = users.find((u) => u.userId === resetPasswordUserId);

    if (!user) return;

    try {
      setUserFormLoading(true);

      const roleId = getRoleId(user.role);

      await axios.put(`${backendUrl}/api/User/${user.userId}`, {
        userId: user.userId,
        username: user.username?.trim() || "",
        fullName: user.fullName?.trim() || "",
        email: user.email?.trim() || "",
        role: String(roleId || ""),
        roleId: Number(roleId || 0),
        isActive: Boolean(user.isActive),
        password,
      });

      toast.success("Password reset successfully.");
      closeResetPassword();
    } catch (e) {
      console.error("Reset password failed", e);

      const apiMessage =
        e?.response?.data?.message ||
        e?.response?.data?.title ||
        (typeof e?.response?.data === "string" ? e.response.data : null);

      toast.error(apiMessage || "Failed to reset password.");
    } finally {
      setUserFormLoading(false);
    }
  };

  // ------------------------------------------------------------
  // DELETE
  // ------------------------------------------------------------
  const handleDeleteClick = () => {
    if (selectedUserIdsForDelete.length === 0) {
      toast.warn("Select at least one user to delete.");
      return;
    }

    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUserIdsForDelete.length === 0) {
      setShowDeleteConfirm(false);
      return;
    }

    try {
      setUserFormLoading(true);

      /*
       * Only real API IDs are sent.
       * Temporary new rows do not exist in the database.
       */
      const realUserIds = selectedUserIdsForDelete.filter(
        (id) => !String(id).startsWith("new-"),
      );

      const temporaryIds = selectedUserIdsForDelete.filter((id) =>
        String(id).startsWith("new-"),
      );

      if (realUserIds.length > 0) {
        await axios.post(`${backendUrl}/api/User/BulkDelete`, realUserIds);
      }

      /*
       * Remove temporary rows locally.
       */
      if (temporaryIds.length > 0) {
        setNewUserDraft(null);
        try {
          window.sessionStorage.removeItem(NEW_USER_DRAFT_KEY);
        } catch (e) {
          console.error("Failed to clear New User draft", e);
        }
      }

      toast.success("Selected users deleted.");

      setSelectedUserIdsForDelete([]);
      setSelectedUserId(null);
      setShowDeleteConfirm(false);
      setPasswords({});
      setGroupSelections({});
      setEditedGroupUserIds([]);
      setEditedUserIds([]);
      setResetPasswordUserId(null);

      newUserRowRef.current = null;
      try {
        window.sessionStorage.removeItem(NEW_USER_DRAFT_KEY);
      } catch (e) {
        console.error("Failed to clear New User draft", e);
      }
      await fetchUsers();
    } catch (e) {
      console.error("Bulk delete users failed", e);
      toast.error("Failed to delete selected users.");
    } finally {
      setUserFormLoading(false);
    }
  };

  // ------------------------------------------------------------
  // CLEAR
  // ------------------------------------------------------------
  const handleClear = () => {
    // Clear only unsaved changes and restore the values loaded from the API.
    if (initialUsersRef.current !== null) {
      setUsers(structuredClone(initialUsersRef.current));
    }
    if (initialGroupSelectionsRef.current !== null) {
      setGroupSelections(structuredClone(initialGroupSelectionsRef.current));
    }

    setSearchTermManageUsers("");
    setSelectedUserIdsForDelete([]);
    setSelectedUserId(null);
    setEditingCell(null);
    setPasswords({});
    setEditedGroupUserIds([]);
    setEditedUserIds([]);
    setOpenGroupDropdown(null);
    newUserRowRef.current = null;
    setNewUserRowId(null);
    setNewUserDraft(null);

    try {
      window.sessionStorage.removeItem(NEW_USER_DRAFT_KEY);
    } catch (e) {
      console.error("Failed to clear New User draft", e);
    }
  };

  // ------------------------------------------------------------
  // RENDER EDITABLE CELL
  // ------------------------------------------------------------
  const renderTextCell = (user, field) => {
    const isUsername = field === "username";
    const isEditing =
      editingCell?.userId === user.userId && editingCell?.field === field;
    const isFieldEditable = !isUsername || user.isNew;

    const value = user[field] || "";

    // if (isEditable && user.isNew) {
    if (isEditable && isFieldEditable && (user.isNew || isEditing)) {
      return (
        <input
          autoFocus
          type={field === "email" ? "email" : "text"}
          value={value}
          onChange={(e) => updateUserField(user.userId, field, e.target.value)}
          onBlur={finishCellEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              finishCellEdit();
            }

            if (e.key === "Escape") {
              finishCellEdit();
            }
          }}
          className="w-full h-[24px] border border-gray-300 rounded px-1 py-0.5 text-xs bg-white outline-none focus:border-blue-400"
          onClick={(e) => e.stopPropagation()}
        />
      );
    }

    // Keep the existing double-click editing behavior, but make the
    // editable value look like the compact input fields used by the
    // other spreadsheet-style tables in the application.
    return (
      <div
        className={`w-full min-h-[24px] flex items-center border border-gray-300 rounded px-1 py-0.5 text-xs ${isUsername ? "bg-gray-100" : "bg-white"} truncate ${
          isEditable ? "cursor-text" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedUserId(user.userId);
          setSelectedUserIdsForDelete([user.userId]);
          // if (!isUsername) startCellEdit(user.userId, field);
          if (isFieldEditable) {
            startCellEdit(user.userId, field);
          }
        }}
      >
        {value}
      </div>
    );
  };

  // ------------------------------------------------------------
  // ROLE CELL
  // ------------------------------------------------------------
  const renderRoleCell = (user) => {
    const isEditing =
      editingCell?.userId === user.userId && editingCell?.field === "role";

    const roleName = getRoleName(user.role);

    if (isEditing && isEditable) {
      return (
        <select
          autoFocus
          value={getRoleId(user.role) || ""}
          onChange={(e) => {
            const selectedRole = roles.find(
              (r) => String(r.roleId) === String(e.target.value),
            );

            updateUserField(user.userId, "role", selectedRole?.roleName || "");

            setEditingCell(null);
          }}
          onBlur={finishCellEdit}
          className="w-full h-[24px] border border-gray-300 rounded px-1 py-0.5 text-xs bg-white outline-none focus:border-blue-400"
          onClick={(e) => e.stopPropagation()}
        >
          <option value="">Select role</option>

          {roles.map((role) => (
            <option key={role.roleId} value={role.roleId}>
              {role.roleName}
            </option>
          ))}
        </select>
      );
    }

    return (
      <div
        className={`w-full min-h-[24px] flex items-center border border-gray-300 rounded px-1 py-0.5 text-xs bg-white ${
          isEditable ? "cursor-pointer" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedUserId(user.userId);
          setSelectedUserIdsForDelete([user.userId]);
          startCellEdit(user.userId, "role");
        }}
      >
        {roleName || "Select role"}
      </div>
    );
  };

  // ------------------------------------------------------------
  // STATUS CELL
  // ------------------------------------------------------------
  const renderStatusCell = (user) => {
    const isEditing =
      editingCell?.userId === user.userId && editingCell?.field === "isActive";

    if (isEditing && isEditable) {
      return (
        <select
          autoFocus
          value={user.isActive ? "true" : "false"}
          onChange={(e) => {
            updateUserField(user.userId, "isActive", e.target.value === "true");

            setEditingCell(null);
          }}
          onBlur={finishCellEdit}
          className="w-full h-[24px] border border-gray-300 rounded px-1 py-0.5 text-xs bg-white outline-none focus:border-blue-400"
          onClick={(e) => e.stopPropagation()}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      );
    }

    return (
      <div
        className={`w-full min-h-[24px] flex items-center border border-gray-300 rounded px-1 py-0.5 text-xs bg-white ${
          isEditable ? "cursor-pointer" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedUserId(user.userId);
          setSelectedUserIdsForDelete([user.userId]);
          startCellEdit(user.userId, "isActive");
        }}
      >
        {user.isActive ? "Active" : "Inactive"}
      </div>
    );
  };

  // ------------------------------------------------------------
  // PASSWORD CELL
  // ------------------------------------------------------------
  const renderPasswordCell = (user, field) => {
    const values = getPasswordValues(user.userId);

    return (
      <input
        type="password"
        value={values[field]}
        onChange={(e) => updatePassword(user.userId, field, e.target.value)}
        // onBlur={() => {
        //   if (values.password || values.confirmPassword) {
        //     validatePassword(user.userId);
        //   }
        // }}
        className="w-full border border-gray-300 rounded px-1 py-0.5 text-xs outline-none focus:border-blue-400 bg-white"
        placeholder=""
        disabled={!isEditable}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedUserId(user.userId);
        }}
      />
    );
  };

  // ------------------------------------------------------------
  // MAIN TABLE
  // ------------------------------------------------------------
  const renderManageUsersTab = () => {
    // Always render the unsaved draft separately from API users.
    // This is what prevents the New User row from disappearing on input.
    const displayUsers = newUserDraft ? [newUserDraft, ...users] : users;

    const filteredUsers = displayUsers.filter((u) =>
      `${u.userId} ${u.username || ""} ${u.fullName || ""} ${
        u.email || ""
      } ${getRoleName(u.role)} ${
        u.isActive ? "Active" : "Inactive"
      } ${getSelectedGroupLabels(u.userId)}`
        .toLowerCase()
        .includes(searchTermManageUsers.toLowerCase()),
    );

    const allSelected = areAllUsersSelected(filteredUsers);

    return (
      <>
        <div className="manage-user-first-screen bg-white rounded shadow p-3">
          {/* ======================================================
            EXISTING USERS TOOLBAR
        ====================================================== */}
          <div className="flex flex-wrap gap-2 justify-between items-center mb-3">
            <div className="flex gap-2 items-center">
              <h3 className="input-label whitespace-nowrap">Existing Users</h3>

              <textarea
                rows={1}
                name="user-list-filter"
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                spellCheck={false}
                placeholder="Search by id, username, name, email..."
                value={searchTermManageUsers}
                onChange={(e) => setSearchTermManageUsers(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm w-64 resize-none overflow-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              {isEditable && (
                <>
                  <button
                    type="button"
                    onClick={handleNewUser}
                    className="btn1 btn-blue whitespace-nowrap"
                    disabled={userFormLoading}
                  >
                    New User
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="btn1 btn-red whitespace-nowrap"
                    disabled={userFormLoading}
                  >
                    Delete
                  </button>

                  <button
                    type="button"
                    onClick={handleClear}
                    className="btn1 btn-blue whitespace-nowrap"
                    disabled={userFormLoading}
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveUsers}
                    className="btn1 btn-blue whitespace-nowrap"
                    disabled={userFormLoading}
                  >
                    {userFormLoading ? "Saving..." : "Save"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ======================================================
            USERS TABLE
        ====================================================== */}
          <div className="rounded border border-gray-200 overflow-hidden">
            <div className="max-h-[320px] overflow-auto">
              <table className="w-full text-sm table-fixed">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-white border-b border-gray-300">
                    <th className="th-thead !px-1 !py-1 text-left text-black bg-[#e5f3fb] text-xs w-10">
                      <input
                        type="checkbox"
                        className="w-3 h-3"
                        checked={allSelected}
                        onChange={() => toggleSelectAllUsers(filteredUsers)}
                      />
                    </th>

                    <th className="th-thead !px-1 !py-1 text-left bg-[#e5f3fb] text-black text-xs">
                      Username
                    </th>

                    <th className="th-thead !px-1 !py-1 text-left bg-[#e5f3fb] text-black text-xs">
                      Full Name
                    </th>

                    <th className="th-thead !px-1 !py-1 text-left bg-[#e5f3fb] text-black text-xs">
                      Role
                    </th>

                    <th className="th-thead !px-1 !py-1 text-left bg-[#e5f3fb] text-black text-xs">
                      Email
                    </th>

                    <th className="th-thead !px-1 !py-1 text-left bg-[#e5f3fb] text-black text-xs">
                      Status
                    </th>

                    <th className="th-thead !px-1 !py-1 text-left bg-[#e5f3fb] text-black text-xs">
                      Groups
                    </th>

                    {newUserRowId && (
                      <>
                        <th className="th-thead !px-1 !py-1 text-left bg-[#e5f3fb] text-black text-xs">
                          Password
                        </th>

                        <th className="th-thead !px-1 !py-1 text-left bg-[#e5f3fb] text-black text-xs">
                          Confirm Password
                        </th>
                      </>
                    )}

                    <th className="th-thead !px-1 !py-1 text-left bg-[#e5f3fb] text-black text-xs">
                      Reset Password
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {initialLoading &&
                  users.length === 0 &&
                  !newUserDraft &&
                  !newUserRowId ? (
                    <tr>
                      <td
                        colSpan={newUserRowId ? 10 : 8}
                        className="px-3 py-12 text-center"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>

                          <p className="text-gray-500 font-medium">
                            Fetching users...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={newUserRowId ? 10 : 8}
                        className="px-3 py-6 text-center text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const selected = selectedUserId === user.userId;

                      const checked = selectedUserIdsForDelete.includes(
                        user.userId,
                      );

                      return (
                        <tr
                          key={user.userId}
                          onClick={() => {
                            setOpenGroupDropdown(null);
                            selectUserRow(user.userId);
                          }}
                          className={`border-b border-gray-300 transition-colors ${
                            selected ? "bg-blue-50" : "hover:bg-gray-50"
                          }`}
                        >
                          {/* CHECKBOX */}
                          <td className="tbody-td !px-1 !py-0.5">
                            <input
                              type="checkbox"
                              className="w-3 h-3"
                              checked={checked}
                              onChange={(e) => {
                                e.stopPropagation();

                                toggleSelectedUserForDelete(user.userId);
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>

                          {/* USERNAME */}
                          <td className="tbody-td !px-1 !py-0.5">
                            {renderTextCell(user, "username")}
                          </td>

                          {/* FULL NAME */}
                          <td className="tbody-td !px-1 !py-0.5">
                            {renderTextCell(user, "fullName")}
                          </td>

                          {/* ROLE */}
                          <td className="tbody-td !px-1 !py-0.5">
                            {renderRoleCell(user)}
                          </td>

                          {/* EMAIL */}
                          <td className="tbody-td !px-1 !py-0.5">
                            {renderTextCell(user, "email")}
                          </td>

                          {/* STATUS */}
                          <td className="tbody-td !px-1 !py-0.5">
                            {renderStatusCell(user)}
                          </td>

                          {/* GROUPS */}
                          <td className="tbody-td !px-1 !py-0.5">
                            {renderGroupsCell(user)}
                          </td>

                          {/* PASSWORD / CONFIRM PASSWORD - NEW USERS ONLY */}
                          {newUserRowId && (
                            <>
                              <td className="tbody-td !px-1 !py-0.5">
                                {user.isNew
                                  ? renderPasswordCell(user, "password")
                                  : null}
                              </td>

                              <td className="tbody-td !px-1 !py-0.5">
                                {user.isNew
                                  ? renderPasswordCell(user, "confirmPassword")
                                  : null}
                              </td>
                            </>
                          )}

                          {/* RESET PASSWORD - EXISTING USERS ONLY */}
                          <td className="tbody-td !px-1 !py-0.5">
                            {!user.isNew && (
                              <button
                                type="button"
                                disabled={!isEditable || userFormLoading}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openResetPassword(user.userId);
                                }}
                                className="px-2 py-0.5 rounded border border-blue-300 text-blue-700 text-xs hover:bg-blue-50 disabled:opacity-50"
                              >
                                Reset Password
                              </button>
                            )}
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

        {/* ======================================================
            SECOND SCREEN: USER ACCESS CONFIGURATION
        ====================================================== */}
        {selectedUserId && (
          <div className="manage-user-second-screen bg-[#e5f3fb] rounded-sm py-2 mt-3">
            <div className="manage-user-access-wrapper w-full">
              <style>{`
                .manage-user-access-wrapper > div {
                  width: 100% !important;
                  min-height: 0 !important;
                }

                .manage-user-access-wrapper > div > div {
                  width: 100% !important;
                }

                /* Keep the normal separation between the heading and user details,
                   but remove the extra blue gap immediately above Screens / Fields. */
                .manage-user-access-wrapper > div > div:nth-child(3) {
                  margin-top: 0 !important;
                }
              `}</style>
              <ConfigureField
                key={selectedUserId}
                userOnly
                selectedUser={
                  newUserDraft && newUserDraft.userId === selectedUserId
                    ? newUserDraft
                    : users.find((u) => u.userId === selectedUserId)
                }
              />
            </div>
          </div>
        )}
      </>
    );
  };

  // ------------------------------------------------------------
  // DELETE CONFIRMATION MODAL
  // ------------------------------------------------------------
  const renderDeleteConfirmation = () => {
    if (!showDeleteConfirm) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setShowDeleteConfirm(false)}
        />

        <div className="relative bg-white rounded shadow-xl w-full max-w-sm p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Confirm Delete
          </h3>

          <p className="text-sm text-gray-600 mb-5">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {selectedUserIdsForDelete.length}
            </span>{" "}
            selected user
            {selectedUserIdsForDelete.length !== 1 ? "s" : ""}?
          </p>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn1 btn-blue"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={userFormLoading}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn1 btn-red"
              onClick={handleConfirmDelete}
              disabled={userFormLoading}
            >
              {userFormLoading ? "Deleting..." : "Yes"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ------------------------------------------------------------
  // RESET PASSWORD MODAL
  // ------------------------------------------------------------
  const renderResetPasswordModal = () => {
    if (!resetPasswordUserId) return null;

    const user = users.find((u) => u.userId === resetPasswordUserId);

    if (!user) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={closeResetPassword}
        />

        <div className="relative bg-white rounded shadow-xl w-full max-w-sm p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">
            Reset Password
          </h3>

          <p className="text-xs text-gray-500 mb-4">
            Reset the password for{" "}
            <span className="font-semibold">{user.username}</span>.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={resetPasswordValues.password}
                onChange={(e) =>
                  setResetPasswordValues((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-400"
                disabled={userFormLoading}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={resetPasswordValues.confirmPassword}
                onChange={(e) =>
                  setResetPasswordValues((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-400"
                disabled={userFormLoading}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-5">
            <button
              type="button"
              className="btn1 btn-blue"
              onClick={closeResetPassword}
              disabled={userFormLoading}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn1 btn-blue"
              onClick={handleResetPassword}
              disabled={userFormLoading}
            >
              {userFormLoading ? "Saving..." : "Reset Password"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ------------------------------------------------------------
  // MAIN RETURN
  // ------------------------------------------------------------
  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 rounded-sm flex items-center justify-between bg-white">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <FaUser size={20} className="text-blue-600" />
          Manage User
        </h2>
      </div>

      <div className="w-full mx-auto bg-[#e5f3fb] rounded-sm">
        {error && <p className="text-sm text-red-600 mb-2 px-3">{error}</p>}

        {renderManageUsersTab()}
      </div>

      {renderDeleteConfirmation()}
      {renderResetPasswordModal()}
    </div>
  );
};

export default ManageUser;
