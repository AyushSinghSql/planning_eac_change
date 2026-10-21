import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import { MdGroups2 } from "react-icons/md";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { useOutletContext } from "react-router-dom";

const ManageGroups = () => {
  // Global lists

  const [groups, setGroups] = useState([]);

  // Select options

  const [groupOptions, setGroupOptions] = useState([]);

  const { visibility, canView, canEdit } = useOutletContext();
  const isEditable = canEdit("manageGroups");

  // UI state
  const [activeMainTab, setActiveMainTab] = useState("manageGroups");
  const [showGroupOrgsScreen, setShowGroupOrgsScreen] = useState(false);
  const [selectedGroupIdForOrgs, setSelectedGroupIdForOrgs] = useState("");
  const [orgs, setOrgs] = useState([]);
  const [selectedOrgsForGroup, setSelectedOrgsForGroup] = useState([]);
  const [originalOrgsForGroup, setOriginalOrgsForGroup] = useState([]);
  const [searchTermOrgs, setSearchTermOrgs] = useState("");
  const [showOrgSuggestions, setShowOrgSuggestions] = useState(false);
  const [orgLoading, setOrgLoading] = useState(false);
  const [mappingLoading, setMappingLoading] = useState(false);
  // const groupOrgsSectionRef = useRef(null);
  // "projectUsers" | "userGroups" | "groupOrgs" | "userOrgs" | "manageGroups" | "manageUsers"

  const [searchTermGroups, setSearchTermGroups] = useState("");

  // Manage Groups form state
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [groupCodeInput, setGroupCodeInput] = useState("");
  const [groupNameInput, setGroupNameInput] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupFormLoading, setGroupFormLoading] = useState(false);
  const [groupLoading, setGroupLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showGroupForm, setShowGroupForm] = useState(false);

  // Inline table editing / single-click Group ↔ Orgs navigation
  const [editingCell, setEditingCell] = useState(null);
  const [draftCellValue, setDraftCellValue] = useState("");
  const singleClickTimeoutRef = useRef(null);

  // -----------------Manage Groups-----------

  const [selectedGroupIdsForDelete, setSelectedGroupIdsForDelete] = useState(
    [],
  );

  const toggleSelectedGroupForDelete = (id) => {
    setSelectedGroupIdsForDelete((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const areAllGroupsSelected = (list) =>
    list.length > 0 &&
    list.every((g) => selectedGroupIdsForDelete.includes(g.orgGroupId));

  const toggleSelectAllGroups = (list) => {
    if (areAllGroupsSelected(list)) {
      setSelectedGroupIdsForDelete([]);
    } else {
      setSelectedGroupIdsForDelete(list.map((g) => g.orgGroupId));
    }
  };

  const resetGroupForm = () => {
    setEditingGroupId(null);
    setGroupCodeInput("");
    setGroupNameInput("");
    setGroupDescription("");
  };

  const startEditGroup = (g) => {
    setEditingGroupId(g.orgGroupId);
    setGroupCodeInput(g.orgGroupCode || "");
    setGroupNameInput(g.orgGroupName || "");
    setGroupDescription(g.description || "");
  };

  const selectGroupAndShowOrgs = (group) => {
    openGroupOrgsScreen(group);
  };

  const cancelCellEdit = () => {
    setEditingCell(null);
    setDraftCellValue("");
  };

  const beginCellEdit = (group, field) => {
    if (!isEditable) return;

    if (singleClickTimeoutRef.current) {
      clearTimeout(singleClickTimeoutRef.current);
      singleClickTimeoutRef.current = null;
    }

    const value =
      field === "orgGroupCode"
        ? group.orgGroupCode || ""
        : field === "orgGroupName"
          ? group.orgGroupName || ""
          : group.description || "";

    setEditingCell({ groupId: group.orgGroupId, field });
    setDraftCellValue(value);
  };

  const handleGroupCellClick = (group) => {
    if (singleClickTimeoutRef.current) {
      clearTimeout(singleClickTimeoutRef.current);
    }

    singleClickTimeoutRef.current = setTimeout(() => {
      // Selecting a row also selects its checkbox. Only one row is
      // automatically selected at a time when navigating to the second screen.
      setSelectedGroupIdsForDelete([group.orgGroupId]);
      selectGroupAndShowOrgs(group);
      singleClickTimeoutRef.current = null;
    }, 250);
  };

  const handleGroupCellDoubleClick = (e, group, field) => {
    e.stopPropagation();
    if (singleClickTimeoutRef.current) {
      clearTimeout(singleClickTimeoutRef.current);
      singleClickTimeoutRef.current = null;
    }
    beginCellEdit(group, field);
  };

  const commitCellEdit = async () => {
    if (!editingCell) return;

    const { groupId, field } = editingCell;
    const group = groups.find((g) => String(g.orgGroupId) === String(groupId));
    if (!group) {
      cancelCellEdit();
      return;
    }

    const value =
      typeof draftCellValue === "string"
        ? draftCellValue.trim()
        : draftCellValue;
    if (field !== "description" && !value) {
      toast.warn(
        field === "orgGroupCode"
          ? "Group code is required."
          : "Group name is required.",
      );
      return;
    }

    const updatedGroup = {
      orgGroupId: group.orgGroupId,
      orgGroupCode: field === "orgGroupCode" ? value : group.orgGroupCode || "",
      orgGroupName: field === "orgGroupName" ? value : group.orgGroupName || "",
      description: field === "description" ? value : group.description || "",
      isActive: group.isActive !== undefined ? group.isActive : true,
    };

    try {
      setGroupFormLoading(true);
      await axios.put(
        `${backendUrl}/api/user-projects/OrgGroups/${groupId}`,
        updatedGroup,
      );

      setGroups((prev) =>
        prev.map((item) =>
          String(item.orgGroupId) === String(groupId)
            ? { ...item, ...updatedGroup }
            : item,
        ),
      );

      setGroupOptions((prev) =>
        prev.map((option) =>
          String(option.value) === String(groupId)
            ? {
                ...option,
                label: `${updatedGroup.orgGroupCode} - ${updatedGroup.orgGroupName}`,
              }
            : option,
        ),
      );

      toast.success("Group updated successfully.");
    } catch (e) {
      console.error("Inline group update failed", e);
      toast.error(e?.response?.data?.message || "Failed to update group.");
    } finally {
      setGroupFormLoading(false);
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

  const renderGroupTextCell = (group, field) => {
    const isEditing =
      editingCell?.groupId === group.orgGroupId && editingCell?.field === field;

    const value =
      field === "orgGroupCode"
        ? group.orgGroupCode || ""
        : field === "orgGroupName"
          ? group.orgGroupName || ""
          : group.description || "";

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

    const isGroupCode = field === "orgGroupCode";

    return (
      <div
        className={`w-full min-h-[24px] flex items-center border border-gray-300 rounded px-1 py-0.5 text-xs truncate ${
          isGroupCode ? "bg-gray-50" : "bg-white"
        } ${!isGroupCode && isEditable ? "cursor-text" : ""}`}
        onClick={(e) => {
          if (isGroupCode) return;
          e.stopPropagation();
          beginCellEdit(group, field);
        }}
      >
        {value || "—"}
      </div>
    );
  };

  const handleCreateOrUpdateGroup = async () => {
    if (!groupCodeInput.trim() || !groupNameInput.trim()) {
      toast.warn("Group code and name are required.");
      return;
    }

    try {
      setGroupFormLoading(true);

      if (editingGroupId == null) {
        // CREATE
        await axios.post(`${backendUrl}/api/user-projects/OrgGroups`, {
          orgGroupCode: groupCodeInput.trim(),
          orgGroupName: groupNameInput.trim(),
          description: groupDescription.trim(),
          isActive: true,
        });
        toast.success("Group created.");
      } else {
        // UPDATE
        await axios.put(
          `${backendUrl}/api/user-projects/OrgGroups/${editingGroupId}`,
          {
            orgGroupId: editingGroupId,
            orgGroupCode: groupCodeInput.trim(),
            orgGroupName: groupNameInput.trim(),
            description: groupDescription.trim(),
            isActive: true,
          },
        );
        toast.success("Group updated.");
      }

      // Refresh list
      const groupsRes = await axios.get(
        `${backendUrl}/api/user-projects/GetGroups`,
      );
      const groupData = applyGroupSorting(groupsRes.data);
      setGroups(groupData);
      setGroupOptions(
        groupData.map((g) => ({
          value: g.orgGroupId,
          label: `${g.orgGroupId} - ${g.orgGroupName || ""}`,
        })),
      );

      resetGroupForm();
      setShowGroupForm(false);
    } catch (e) {
      console.error("Save group failed", e);
      // toast.error("Failed to save group.");
      const apiMessage =
        e?.response?.data?.message ||
        e?.response?.data?.title || // common for ASP.NET
        (typeof e?.response?.data === "string" ? e.response.data : null);

      if (apiMessage) {
        toast.error(apiMessage); // e.g. "OrgGroupCode already exists."
      } else {
        toast.error("Failed to save group.");
      }
    } finally {
      setGroupFormLoading(false);
    }
  };

  const handleBulkDeleteGroups = async () => {
    if (selectedGroupIdsForDelete.length === 0) {
      toast.warn("Select at least one group to delete.");
      return;
    }
    if (!window.confirm(`Delete ${selectedGroupIdsForDelete.length} groups?`)) {
      return;
    }

    try {
      setGroupFormLoading(true);

      // ✅ single bulk call with array [1,2,...]
      await axios.post(
        `${backendUrl}/api/user-projects/OrgGroups/BulkDelete`,
        selectedGroupIdsForDelete,
      );
      // if your API expects { ids: [...] } then:
      // await axios.post(`${backendUrl}/api/user-projects/OrgGroups/BulkDelete`, {
      //   ids: selectedGroupIdsForDelete,
      // });

      toast.success("Selected groups deleted.");

      const groupsRes = await axios.get(
        `${backendUrl}/api/user-projects/GetGroups`,
      );
      const groupData = applyGroupSorting(groupsRes.data);
      setGroups(groupData);
      setGroupOptions(
        groupData.map((x) => ({
          value: x.orgGroupId,
          label: `${x.orgGroupCode} - ${x.orgGroupName || ""}`,
        })),
      );
      setSelectedGroupIdsForDelete([]);

      if (
        editingGroupId &&
        !groupData.some((g) => g.orgGroupId === editingGroupId)
      ) {
        resetGroupForm();
      }
    } catch (e) {
      console.error("Bulk delete groups failed", e);
      toast.error("Failed to delete selected groups.");
    } finally {
      setGroupFormLoading(false);
    }
  };

  //Sort new created at the top
  const applyGroupSorting = (groupData) => {
    // assuming orgGroupId is incremental; use createdAt if you prefer
    return [...(groupData || [])].sort(
      (a, b) => (b.orgGroupId ?? 0) - (a.orgGroupId ?? 0),
      // or: (new Date(b.createdAt)) - (new Date(a.createdAt))
    );
  };

  // ---------- Fetch base lists on mount ----------
  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        setGroupLoading(true);

        // Groups
        const groupsRes = await axios.get(
          `${backendUrl}/api/user-projects/GetGroups`,
        );
        const groupData = groupsRes.data || [];
        setGroups(groupData);
        setGroupOptions(
          groupData.map((g) => ({
            value: g.orgGroupId,
            label: `${g.orgGroupCode} - ${g.orgGroupName || ""}`,
          })),
        );

        // Organizations used by the Group ↔ Orgs mapping screen
        const orgRes = await axios.get(`${backendUrl}/Orgnization/GetAllOrgs`);
        setOrgs(orgRes.data || []);
      } catch (e) {
        console.error("Base data fetch failed", e);
        setError("Failed to load initial data.");
      } finally {
        setGroupLoading(false);
      }
    };

    fetchBaseData();
  }, []);

  // ---------- Group ↔ Orgs mapping ----------
  const openGroupOrgsScreen = (group) => {
    setSelectedGroupIdForOrgs(group?.orgGroupId ?? "");
    setSearchTermOrgs("");
    setShowGroupOrgsScreen(true);
  };

  useEffect(() => {
    if (!showGroupOrgsScreen || !selectedGroupIdForOrgs) {
      setSelectedOrgsForGroup([]);
      setOriginalOrgsForGroup([]);
      return;
    }

    const fetchOrgsForGroup = async () => {
      setOrgLoading(true);
      try {
        const res = await axios.get(
          `${backendUrl}/api/user-projects/Orgs/${selectedGroupIdForOrgs}`,
        );
        const mappedOrgs = res.data || [];
        const mappedIds = Array.isArray(mappedOrgs)
          ? mappedOrgs.map((o) => (typeof o === "object" ? o.orgId : o))
          : [];
        setSelectedOrgsForGroup(mappedIds);
        setOriginalOrgsForGroup(mappedIds);
      } catch (e) {
        console.error("Fetch orgs for group failed", e);
        setSelectedOrgsForGroup([]);
        setOriginalOrgsForGroup([]);
        toast.error("Failed to load organizations for this group.");
      } finally {
        setOrgLoading(false);
      }
    };

    fetchOrgsForGroup();
  }, [showGroupOrgsScreen, selectedGroupIdForOrgs]);

  const toggleOrgForGroup = (orgId) => {
    setSelectedOrgsForGroup((prev) =>
      prev.some((id) => String(id) === String(orgId))
        ? prev.filter((id) => String(id) !== String(orgId))
        : [...prev, orgId],
    );
  };

  const toggleSelectAllAvailableOrgs = (list) => {
    const listIds = list.map((org) => String(org.orgId));
    setSelectedOrgsForGroup((prev) => {
      const prevIds = prev.map((id) => String(id));
      const allSelected =
        listIds.length > 0 && listIds.every((id) => prevIds.includes(id));

      if (allSelected) {
        return prev.filter((id) => !listIds.includes(String(id)));
      }

      const idsToAdd = list
        .filter((org) => !prevIds.includes(String(org.orgId)))
        .map((org) => org.orgId);
      return [...prev, ...idsToAdd];
    });
  };

  const toggleSelectAllMappedOrgs = (list) => {
    const listIds = list.map((org) => String(org.orgId));
    setSelectedOrgsForGroup((prev) => {
      const prevIds = prev.map((id) => String(id));
      const allSelected =
        listIds.length > 0 && listIds.every((id) => prevIds.includes(id));

      if (allSelected) {
        return prev.filter((id) => !listIds.includes(String(id)));
      }

      const idsToAdd = list
        .filter((org) => !prevIds.includes(String(org.orgId)))
        .map((org) => org.orgId);
      return [...prev, ...idsToAdd];
    });
  };

  const saveGroupOrgs = async () => {
    if (!selectedGroupIdForOrgs) {
      toast.warn("Select a group first.");
      return;
    }

    try {
      setMappingLoading(true);
      await axios.post(`${backendUrl}/api/user-projects/BulkSyncGroupOrgs`, {
        groupId: selectedGroupIdForOrgs,
        orgIds: selectedOrgsForGroup,
      });
      toast.success("Group ↔ Orgs mapping updated.");

      const res = await axios.get(
        `${backendUrl}/api/user-projects/Orgs/${selectedGroupIdForOrgs}`,
      );
      const mappedOrgs = res.data || [];
      const mappedIds = Array.isArray(mappedOrgs)
        ? mappedOrgs.map((o) => (typeof o === "object" ? o.orgId : o))
        : [];
      setSelectedOrgsForGroup(mappedIds);
      setOriginalOrgsForGroup(mappedIds);
    } catch (e) {
      console.error("Save group-orgs failed", e);
      toast.error("Failed to update group-orgs mapping.");
    } finally {
      setMappingLoading(false);
    }
  };

  const renderGroupOrgsScreen = () => {
    const selectedIds = selectedOrgsForGroup.map((id) => String(id));
    const originalIds = originalOrgsForGroup.map((id) => String(id));

    const organizationQuery = searchTermOrgs
      .replace(/\s+-\s+.*$/, "")
      .trim()
      .toLowerCase();

    const filteredOrgs = orgs.filter((o) => {
      const orgId = String(o.orgId ?? "").toLowerCase();
      const orgName = String(o.orgName ?? "").toLowerCase();
      const searchableText = `${orgId} ${orgName}`;
      return !organizationQuery || searchableText.includes(organizationQuery);
    });

    const orgSuggestions = organizationQuery ? filteredOrgs.slice(0, 8) : [];

    // Keep the right table as the complete mapping work area. This lets us
    // show Mapped / Unmapping / New Mapping before the user saves.
    const mappingIds = Array.from(new Set([...originalIds, ...selectedIds]));
    const mappedOrgs = mappingIds
      .map((id) => orgs.find((org) => String(org.orgId) === id))
      .filter(Boolean);

    const availableOrgs = filteredOrgs.filter(
      (org) =>
        !originalIds.includes(String(org.orgId)) &&
        !selectedIds.includes(String(org.orgId)),
    );

    const selectedGroupOption = selectedGroupIdForOrgs
      ? groupOptions.find(
          (option) => String(option.value) === String(selectedGroupIdForOrgs),
        )
      : null;

    const groupLabel = selectedGroupOption?.label || "";

    return (
      <div
        // ref={groupOrgsSectionRef}
        className="mt-4 bg-[#e5f3fb] rounded-sm p-1.5"
      >
        <div className="p-2 rounded-sm flex items-center bg-white">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1">
            <AiOutlineFundProjectionScreen
              size={16}
              className="text-blue-600"
            />
            Group Org Mapping
          </h2>
        </div>

        <div className="bg-white p-4 w-full rounded mt-2">
          <div className="mb-4 flex items-center gap-x-3">
            <label className="text-sm text-gray-700 font-medium">
              Selected Group:
            </label>
            <span className="text-sm text-black font-medium">
              {groupLabel || "Selected Group"}
            </span>
          </div>

          <div className="mb-5">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                Search Organizations
              </label>
              <div className="relative w-[490px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  ⌕
                </span>
                <input
                  type="text"
                  placeholder="Search organizations..."
                  value={searchTermOrgs}
                  onChange={(e) => {
                    setSearchTermOrgs(e.target.value);
                    setShowOrgSuggestions(true);
                  }}
                  onFocus={() => setShowOrgSuggestions(true)}
                  className="w-full h-9 border border-gray-300 rounded px-9 pr-8 text-sm bg-white outline-none focus:border-blue-500"
                />
                {showOrgSuggestions && orgSuggestions.length > 0 && (
                  <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-56 overflow-auto">
                    {orgSuggestions.map((org) => (
                      <button
                        key={org.orgId}
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSearchTermOrgs(
                            `${org.orgId} - ${org.orgName || ""}`,
                          );
                          setShowOrgSuggestions(false);
                        }}
                      >
                        {org.orgId} - {org.orgName || ""}
                      </button>
                    ))}
                  </div>
                )}
                {searchTermOrgs && (
                  <button
                    type="button"
                    onClick={() => setSearchTermOrgs("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Organization Mapping
            </h3>
            {isEditable && (
              <button
                type="button"
                onClick={saveGroupOrgs}
                disabled={!selectedGroupIdForOrgs || mappingLoading}
                className="bg-[#17414d] text-white rounded-full px-4 py-2 text-xs font-semibold disabled:opacity-60"
              >
                {mappingLoading ? "Saving..." : "Update Group ↔ Orgs"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border border-gray-300 rounded overflow-hidden">
              <div className="h-10 px-3 flex items-center justify-between bg-gray-50 border-b border-gray-300">
                <span className="text-sm font-semibold text-gray-900">
                  Available Organizations
                </span>
                <span className="text-xs text-gray-500">
                  {availableOrgs.length} found
                </span>
              </div>
              <div className="overflow-auto max-h-[390px]">
                <table className="w-full text-sm border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[#e5f3fb] border-b border-gray-300">
                      <th className="px-2 py-1.5 text-center text-xs font-semibold w-12 border-r border-gray-300">
                        <input
                          type="checkbox"
                          className="w-3 h-3 accent-blue-600"
                          checked={
                            availableOrgs.length > 0 &&
                            availableOrgs.every((org) =>
                              selectedIds.includes(String(org.orgId)),
                            )
                          }
                          onChange={() =>
                            toggleSelectAllAvailableOrgs(availableOrgs)
                          }
                        />
                      </th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold border-r border-gray-300">
                        Org ID
                      </th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold">
                        Org Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!selectedGroupIdForOrgs ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-3 py-8 text-center text-gray-500"
                        >
                          Select a group to view organizations.
                        </td>
                      </tr>
                    ) : orgLoading ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-3 py-8 text-center text-gray-500"
                        >
                          Loading organizations...
                        </td>
                      </tr>
                    ) : availableOrgs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-3 py-8 text-center text-gray-500"
                        >
                          No available organizations found.
                        </td>
                      </tr>
                    ) : (
                      availableOrgs.map((org) => (
                        <tr
                          key={org.orgId}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-2 py-1.5 text-center border-r border-gray-200">
                            <input
                              type="checkbox"
                              className="w-3 h-3 accent-blue-600"
                              checked={selectedIds.includes(String(org.orgId))}
                              onChange={() => toggleOrgForGroup(org.orgId)}
                            />
                          </td>
                          <td className="px-2 py-1.5 text-center border-r border-gray-200 text-xs">
                            {org.orgId}
                          </td>
                          <td className="px-2 py-1.5 text-center text-xs">
                            {org.orgName || "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border border-gray-300 rounded overflow-hidden">
              <div className="h-10 px-3 flex items-center justify-between bg-gray-50 border-b border-gray-300">
                <span className="text-sm font-semibold text-gray-900">
                  {groupLabel
                    ? `${groupLabel}'s Organization Mapping`
                    : "Group's Organization Mapping"}
                </span>
                <span className="text-xs text-gray-500">
                  {mappedOrgs.length} organizations
                </span>
              </div>

              <div className="overflow-auto max-h-[390px]">
                <table className="w-full text-sm border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[#e5f3fb] border-b border-gray-300">
                      <th className="px-2 py-1.5 text-center text-xs font-semibold w-14 border-r border-gray-300">
                        <input
                          type="checkbox"
                          className="w-3 h-3 accent-blue-600"
                          checked={
                            mappedOrgs.length > 0 &&
                            mappedOrgs.every((org) =>
                              selectedIds.includes(String(org.orgId)),
                            )
                          }
                          onChange={() => toggleSelectAllMappedOrgs(mappedOrgs)}
                        />
                      </th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold border-r border-gray-300">
                        Org ID
                      </th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold border-r border-gray-300">
                        Org Name
                      </th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold border-r border-gray-300">
                        Status
                      </th>
                      {/* <th className="px-2 py-1.5 text-center text-xs font-semibold w-16">Remove</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {!selectedGroupIdForOrgs ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-8 text-center text-gray-500"
                        >
                          Select a group to view its organization mapping.
                        </td>
                      </tr>
                    ) : orgLoading ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-8 text-center text-gray-500"
                        >
                          Loading organizations...
                        </td>
                      </tr>
                    ) : mappedOrgs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-8 text-center text-gray-500"
                        >
                          No organizations mapped to this group.
                        </td>
                      </tr>
                    ) : (
                      mappedOrgs.map((org) => {
                        const id = String(org.orgId);
                        const wasMapped = originalIds.includes(id);
                        const isSelected = selectedIds.includes(id);
                        const status =
                          wasMapped && isSelected
                            ? "Mapped"
                            : wasMapped && !isSelected
                              ? "Unmapping"
                              : "New Mapping";

                        return (
                          <tr
                            key={org.orgId}
                            className="border-b border-gray-200 hover:bg-gray-50"
                          >
                            <td className="px-2 py-1.5 text-center border-r border-gray-200">
                              <input
                                type="checkbox"
                                className="w-3 h-3 accent-blue-600"
                                checked={isSelected}
                                onChange={() => toggleOrgForGroup(org.orgId)}
                              />
                            </td>
                            <td className="px-2 py-1.5 text-center border-r border-gray-200 text-xs">
                              {org.orgId}
                            </td>
                            <td className="px-2 py-1.5 text-center border-r border-gray-200 text-xs">
                              {org.orgName || "-"}
                            </td>
                            <td className="px-2 py-1.5 text-center border-r border-gray-200">
                              <span
                                className={`inline-flex items-center justify-center px-2 py-1 rounded border text-xs ${
                                  status === "Mapped"
                                    ? "border-green-300 bg-green-50 text-green-600"
                                    : status === "Unmapping"
                                      ? "border-orange-300 bg-orange-50 text-orange-600"
                                      : "border-blue-300 bg-blue-50 text-blue-600"
                                }`}
                              >
                                {status}
                              </span>
                            </td>
                            {/*
                            <td className="px-2 py-1.5 text-center">
                              {status === "New Mapping" && (
                                <button
                                  type="button"
                                  onClick={() => toggleOrgForGroup(org.orgId)}
                                  className="text-gray-400 hover:text-gray-700 text-lg leading-none"
                                  title="Remove organization"
                                  aria-label="Remove organization"
                                >
                                  ×
                                </button>
                              )}
                            </td>
                            */}
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
    );
  };

  const handleSaveChanges = async () => {
    if (editingCell) {
      await commitCellEdit();
      return;
    }

    if (
      showGroupForm ||
      groupCodeInput.trim() ||
      groupNameInput.trim() ||
      groupDescription.trim()
    ) {
      await handleCreateOrUpdateGroup();
      return;
    }

    toast.info("There are no changes to save.");
  };

  const renderManageGroupsTab = () => {
    const filteredGroups = groups.filter((g) =>
      `${g.orgGroupId} ${g.orgGroupCode || ""} ${g.orgGroupName || ""} ${g.description || ""}`
        .toLowerCase()
        .includes(searchTermGroups.toLowerCase()),
    );

    const allSelected = areAllGroupsSelected(filteredGroups);

    return (
      <>
        <div className="flex justify-between items-center mb-3 mt-1">
          <div className="flex gap-2 items-center">
            <h3 className="input-label">Existing Groups</h3>
            <input
              type="text"
              placeholder="Search by id, code, name, description..."
              value={searchTermGroups}
              onChange={(e) => setSearchTermGroups(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm w-64 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                resetGroupForm();
                setShowGroupForm(true);
              }}
              className="bg-[#17414d] text-white rounded-full px-4 py-2 text-xs font-semibold hover:bg-[#123641] transition-colors disabled:opacity-50"
              disabled={groupFormLoading}
            >
              Create New Group
            </button>

            <button
              type="button"
              onClick={handleSaveChanges}
              className="bg-[#17414d] text-white rounded-full px-4 py-2 text-xs font-semibold hover:bg-[#123641] transition-colors disabled:opacity-50"
              disabled={groupFormLoading}
            >
              {groupFormLoading ? "Saving..." : "Save"}
            </button>

            {isEditable && selectedGroupIdsForDelete.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDeleteGroups}
                className="bg-red-600 text-white rounded-full px-4 py-2 text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={groupFormLoading}
              >
                Delete ({selectedGroupIdsForDelete.length})
              </button>
            )}
          </div>
        </div>

        {showGroupForm && isEditable && (
          <div className="mb-3 p-3 border border-gray-200 rounded bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Group Code *"
                value={groupCodeInput}
                onChange={(e) => setGroupCodeInput(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm outline-none"
              />
              <input
                type="text"
                placeholder="Group Name *"
                value={groupNameInput}
                onChange={(e) => setGroupNameInput(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm outline-none"
              />
              <input
                type="text"
                placeholder="Description"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>
        )}

        <div className="rounded border border-gray-200 overflow-hidden relative">
          <div className="overflow-x-auto max-h-80 border border-gray-300 rounded">
            <table className="w-full text-sm table-fixed">
              <thead className="thead">
                <tr className="bg-white border-b border-gray-300">
                  <th className="th-thead text-left text-black bg-[#e5f3fb] text-sm w-10">
                    <input
                      type="checkbox"
                      className="w-3 h-3"
                      checked={allSelected}
                      onChange={() => toggleSelectAllGroups(filteredGroups)}
                    />
                  </th>
                  <th className="th-thead text-left bg-[#e5f3fb] text-black text-xs">
                    Group Code
                  </th>
                  <th className="th-thead text-left bg-[#e5f3fb] text-black text-xs">
                    Group Name
                  </th>
                  <th className="th-thead text-left bg-[#e5f3fb] text-black text-xs">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupLoading ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-500 font-medium">
                          Fetching group(s)...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : groupFormLoading ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-10 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-500 font-medium">
                          Saving group...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredGroups.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-3 py-6 text-center text-gray-500"
                    >
                      No groups found.
                    </td>
                  </tr>
                ) : (
                  filteredGroups.map((g) => {
                    const selected = selectedGroupIdsForDelete.includes(
                      g.orgGroupId,
                    );
                    return (
                      <tr
                        key={g.orgGroupId}
                        className="hover:bg-gray-50 border-b border-gray-300 cursor-pointer"
                        onClick={() => handleGroupCellClick(g)}
                      >
                        <td className="tbody-td">
                          <input
                            type="checkbox"
                            className="w-3 h-3"
                            checked={selected}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleSelectedGroupForDelete(g.orgGroupId);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td
                          className="tbody-td font-semibold"
                          // onClick={() => handleGroupCellClick(g)}
                          title="Click to configure Group ↔ Orgs"
                        >
                          {renderGroupTextCell(g, "orgGroupCode")}
                        </td>
                        <td
                          className="tbody-td"
                          // onClick={(e) => {
                          //   e.stopPropagation();
                          //   beginCellEdit(g, "orgGroupName");
                          // }}
                          title="Click to edit Group Name"
                        >
                          {renderGroupTextCell(g, "orgGroupName")}
                        </td>
                        <td
                          className="tbody-td"
                          onClick={(e) => {
                            e.stopPropagation();
                            beginCellEdit(g, "description");
                          }}
                          title="Click to edit Description"
                        >
                          {renderGroupTextCell(g, "description")}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="p-4 rounded-sm flex items-center justify-between bg-white">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <MdGroups2 size={20} className="text-blue-600" />
          Manage Groups
        </h2>
      </div>

      <div className="p-3 w-full mx-auto bg-white rounded shadow">
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        {activeMainTab === "manageGroups" && renderManageGroupsTab()}
      </div>

      {showGroupOrgsScreen && renderGroupOrgsScreen()}
    </div>
  );
};

export default ManageGroups;
