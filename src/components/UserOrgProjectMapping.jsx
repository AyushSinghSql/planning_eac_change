// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { backendUrl } from "./config";
// import { toast } from "react-toastify";
// import { AiOutlineFundProjectionScreen } from "react-icons/ai";
// import { useOutletContext } from "react-router-dom";
// import { debounce } from "lodash";
// import { Search, X } from "lucide-react";

// const UserOrgProjectMapping = () => {
//   // Global lists
//   const [users, setUsers] = useState([]);
//   const [orgs, setOrgs] = useState([]);
//   const [groups, setGroups] = useState([]);
//   const [projects, setProjects] = useState([]);

//   // Select options
//   // const [projectOptions, setProjectOptions] = useState([]);
//   const [userOptions, setUserOptions] = useState([]);
//   const [groupOptions, setGroupOptions] = useState([]);

//   // Selections per mode
//   const [selectedProjectId, setSelectedProjectId] = useState("");
//   const [selectedUsersForProject, setSelectedUsersForProject] = useState([]);

//   const [selectedUserIdForGroups, setSelectedUserIdForGroups] = useState("");
//   const [selectedGroupsForUser, setSelectedGroupsForUser] = useState([]);

//   const [selectedGroupIdForOrgs, setSelectedGroupIdForOrgs] = useState("");
//   const [selectedOrgsForGroup, setSelectedOrgsForGroup] = useState([]);

//   const [selectedUserIdForOrgs, setSelectedUserIdForOrgs] = useState("");
//   const [selectedOrgsForUser, setSelectedOrgsForUser] = useState([]);

//   // UI state
//   const [activeMainTab, setActiveMainTab] = useState("projectUsers");
//   // "projectUsers" | "userGroups" | "groupOrgs" | "userOrgs" | "manageGroups" | "manageUsers"

//   const [searchTermUsers, setSearchTermUsers] = useState("");
//   const [searchTermGroups, setSearchTermGroups] = useState("");
//   const [searchTermOrgs, setSearchTermOrgs] = useState("");
//   const [searchTermUserOrgs, setSearchTermUserOrgs] = useState("");

//   // Manage Groups form state
//   const [editingGroupId, setEditingGroupId] = useState(null);
//   const [groupCodeInput, setGroupCodeInput] = useState("");
//   const [groupNameInput, setGroupNameInput] = useState("");
//   const [groupDescription, setGroupDescription] = useState("");
//   const [groupFormLoading, setGroupFormLoading] = useState(false);

//   // Manage Users form state
//   const [editingUserId, setEditingUserId] = useState(null);
//   const [userNameInput, setUserNameInput] = useState("");
//   const [userFullNameInput, setUserFullNameInput] = useState("");
//   const [userEmailInput, setUserEmailInput] = useState("");
//   const [userFormLoading, setUserFormLoading] = useState(false);
//   const [searchTermManageUsers, setSearchTermManageUsers] = useState("");
//   const [selectedUserIdsForDelete, setSelectedUserIdsForDelete] = useState([]);
//   const [userPasswordInput, setUserPasswordInput] = useState("");
//   const [userRoleInput, setUserRoleInput] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [userLoading, setUserLoading] = useState(false);
//   const [groupLoading, setGroupLoading] = useState(false);
//   const [orgLoading, setOrgLoading] = useState(false);
//   const [projectLoading, setProjectLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [term, setTerm] = useState("");
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [availableProjects, setAvailableProjects] = useState([])

//   const { visibility, canView, canEdit } = useOutletContext();

//   const isEditable = canEdit("projectOrgSecurity");

//     const lookupTake = import.meta.env.VITE_GET_PROJECT_MASTER_LOOKUP || 500;

//   // ------------Manage Users------------
//   const applyUserSorting = (userData) => {
//     // newest (highest userId) first; adjust if you have createdAt
//     return [...(userData || [])].sort(
//       (a, b) => (b.userId ?? 0) - (a.userId ?? 0),
//     );
//   };

//   const resetUserForm = () => {
//     setEditingUserId(null);
//     setUserNameInput("");
//     setUserFullNameInput("");
//     setUserEmailInput("");
//     setUserPasswordInput("");
//     setUserRoleInput("");
//   };

//   const startEditUser = (u) => {
//     setEditingUserId(u.userId);
//     setUserNameInput(u.username || "");
//     setUserFullNameInput(u.fullName || "");
//     setUserEmailInput(u.email || "");
//     setUserPasswordInput(""); // typically not loaded back
//     setUserRoleInput(u.role || "");
//   };

//   const toggleSelectedUserForDelete = (id) => {
//     setSelectedUserIdsForDelete((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
//     );
//   };

//   const areAllUsersSelected = (list) =>
//     list.length > 0 &&
//     list.every((u) => selectedUserIdsForDelete.includes(u.userId));

//   const toggleSelectAllUsers = (list) => {
//     if (areAllUsersSelected(list)) {
//       setSelectedUserIdsForDelete([]);
//     } else {
//       setSelectedUserIdsForDelete(list.map((u) => u.userId));
//     }
//   };

//   const handleCreateOrUpdateUser = async () => {
//     if (!userNameInput.trim() || !userFullNameInput.trim()) {
//       toast.warn("Username and full name are required.");
//       return;
//     }

//     try {
//       setUserFormLoading(true);

//       if (editingUserId == null) {
//         // CREATE
//         await axios.post(`${backendUrl}/api/User`, {
//           username: userNameInput.trim(),
//           fullName: userFullNameInput.trim(),
//           email: userEmailInput.trim(),
//           password: userPasswordInput.trim(),
//           role: userRoleInput.trim(),
//         });
//         toast.success("User created.");
//       } else {
//         // UPDATE
//         await axios.put(`${backendUrl}/api/User/${editingUserId}`, {
//           userId: editingUserId,
//           username: userNameInput.trim(),
//           fullName: userFullNameInput.trim(),
//           email: userEmailInput.trim(),
//           // optional: only send password if user entered something
//           password: userPasswordInput.trim() || undefined,
//           role: userRoleInput.trim(),
//         });
//         toast.success("User updated.");
//       }

//       const userRes = await axios.get(`${backendUrl}/api/User`);
//       const userData = applyUserSorting(userRes.data);
//       setUsers(userData);
//       setUserOptions(
//         userData.map((u) => ({
//           value: u.userId,
//           label: `${u.userId} - ${u.username || u.fullName || ""}`,
//         })),
//       );

//       resetUserForm();
//     } catch (e) {
//       console.error("Save user failed", e);
//       const apiMessage =
//         e?.response?.data?.message ||
//         e?.response?.data?.title ||
//         (typeof e?.response?.data === "string" ? e.response.data : null);
//       toast.error(apiMessage || "Failed to save user.");
//     } finally {
//       setUserFormLoading(false);
//     }
//   };

//   const handleBulkDeleteUsers = async () => {
//     if (selectedUserIdsForDelete.length === 0) {
//       toast.warn("Select at least one user to delete.");
//       return;
//     }
//     if (!window.confirm(`Delete ${selectedUserIdsForDelete.length} users?`)) {
//       return;
//     }

//     try {
//       setUserFormLoading(true);

//       // bulk delete: body [1,2,...]
//       await axios.post(
//         `${backendUrl}/api/User/BulkDelete`,
//         selectedUserIdsForDelete,
//       );
//       toast.success("Selected users deleted.");

//       const userRes = await axios.get(`${backendUrl}/api/User`);
//       const userData = applyUserSorting(userRes.data);
//       setUsers(userData);
//       setUserOptions(
//         userData.map((u) => ({
//           value: u.userId,
//           label: `${u.userId} - ${u.username || u.fullName || ""}`,
//         })),
//       );
//       setSelectedUserIdsForDelete([]);

//       if (editingUserId && !userData.some((u) => u.userId === editingUserId)) {
//         resetUserForm();
//       }
//     } catch (e) {
//       console.error("Bulk delete users failed", e);
//       const apiMessage =
//         e?.response?.data?.message ||
//         e?.response?.data?.title ||
//         (typeof e?.response?.data === "string" ? e.response.data : null);
//       if (apiMessage) {
//         toast.error(apiMessage);
//       } else {
//         toast.error("Failed to delete selected users.");
//       }
//     } finally {
//       setUserFormLoading(false);
//     }
//   };

//   // -----------------Manage Groups-----------

//   const [selectedGroupIdsForDelete, setSelectedGroupIdsForDelete] = useState(
//     [],
//   );

//   const toggleSelectedGroupForDelete = (id) => {
//     setSelectedGroupIdsForDelete((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
//     );
//   };

//   const areAllGroupsSelected = (list) =>
//     list.length > 0 &&
//     list.every((g) => selectedGroupIdsForDelete.includes(g.orgGroupId));

//   const toggleSelectAllGroups = (list) => {
//     if (areAllGroupsSelected(list)) {
//       setSelectedGroupIdsForDelete([]);
//     } else {
//       setSelectedGroupIdsForDelete(list.map((g) => g.orgGroupId));
//     }
//   };

//   const resetGroupForm = () => {
//     setEditingGroupId(null);
//     setGroupCodeInput("");
//     setGroupNameInput("");
//     setGroupDescription("");
//   };

//   const startEditGroup = (g) => {
//     setEditingGroupId(g.orgGroupId);
//     setGroupCodeInput(g.orgGroupCode || "");
//     setGroupNameInput(g.orgGroupName || "");
//     setGroupDescription(g.description || "");
//   };

//   const handleCreateOrUpdateGroup = async () => {
//     if (!groupCodeInput.trim() || !groupNameInput.trim()) {
//       toast.warn("Group code and name are required.");
//       return;
//     }

//     try {
//       setGroupFormLoading(true);

//       if (editingGroupId == null) {
//         // CREATE
//         await axios.post(`${backendUrl}/api/user-projects/OrgGroups`, {
//           orgGroupCode: groupCodeInput.trim(),
//           orgGroupName: groupNameInput.trim(),
//           description: groupDescription.trim(),
//           isActive: true,
//         });
//         toast.success("Group created.");
//       } else {
//         // UPDATE
//         await axios.put(
//           `${backendUrl}/api/user-projects/OrgGroups/${editingGroupId}`,
//           {
//             orgGroupId: editingGroupId,
//             orgGroupCode: groupCodeInput.trim(),
//             orgGroupName: groupNameInput.trim(),
//             description: groupDescription.trim(),
//             isActive: true,
//           },
//         );
//         toast.success("Group updated.");
//       }

//       // Refresh list
//       const groupsRes = await axios.get(
//         `${backendUrl}/api/user-projects/GetGroups`,
//       );
//       const groupData = applyGroupSorting(groupsRes.data);
//       setGroups(groupData);
//       setGroupOptions(
//         groupData.map((g) => ({
//           value: g.orgGroupId,
//           label: `${g.orgGroupCode} - ${g.orgGroupName || ""}`,
//         })),
//       );

//       resetGroupForm();
//     } catch (e) {
//       console.error("Save group failed", e);
//       // toast.error("Failed to save group.");
//       const apiMessage =
//         e?.response?.data?.message ||
//         e?.response?.data?.title || // common for ASP.NET
//         (typeof e?.response?.data === "string" ? e.response.data : null);

//       if (apiMessage) {
//         toast.error(apiMessage); // e.g. "OrgGroupCode already exists."
//       } else {
//         toast.error("Failed to save group.");
//       }
//     } finally {
//       setGroupFormLoading(false);
//     }
//   };

//   const handleBulkDeleteGroups = async () => {
//     if (selectedGroupIdsForDelete.length === 0) {
//       toast.warn("Select at least one group to delete.");
//       return;
//     }
//     if (!window.confirm(`Delete ${selectedGroupIdsForDelete.length} groups?`)) {
//       return;
//     }

//     try {
//       setGroupFormLoading(true);

//       // ✅ single bulk call with array [1,2,...]
//       await axios.post(
//         `${backendUrl}/api/user-projects/OrgGroups/BulkDelete`,
//         selectedGroupIdsForDelete,
//       );
//       // if your API expects { ids: [...] } then:
//       // await axios.post(`${backendUrl}/api/user-projects/OrgGroups/BulkDelete`, {
//       //   ids: selectedGroupIdsForDelete,
//       // });

//       toast.success("Selected groups deleted.");

//       const groupsRes = await axios.get(
//         `${backendUrl}/api/user-projects/GetGroups`,
//       );
//       const groupData = applyGroupSorting(groupsRes.data);
//       setGroups(groupData);
//       setGroupOptions(
//         groupData.map((x) => ({
//           value: x.orgGroupId,
//           label: `${x.orgGroupCode} - ${x.orgGroupName || ""}`,
//         })),
//       );
//       setSelectedGroupIdsForDelete([]);

//       if (
//         editingGroupId &&
//         !groupData.some((g) => g.orgGroupId === editingGroupId)
//       ) {
//         resetGroupForm();
//       }
//     } catch (e) {
//       console.error("Bulk delete groups failed", e);
//       toast.error("Failed to delete selected groups.");
//     } finally {
//       setGroupFormLoading(false);
//     }
//   };

//   //Sort new created at the top
//   const applyGroupSorting = (groupData) => {
//     // assuming orgGroupId is incremental; use createdAt if you prefer
//     return [...(groupData || [])].sort(
//       (a, b) => (b.orgGroupId ?? 0) - (a.orgGroupId ?? 0),
//       // or: (new Date(b.createdAt)) - (new Date(a.createdAt))
//     );
//   };

//   const handleProjectSelect = (project) => {
//   const projectId = project?.projectId ?? project?.value ?? "";

//   setSelectedProjectId(projectId);
//   setTerm(project?.name
//     ? `${projectId} - ${project.name}`
//     : projectId
//   );

//   setShowSuggestions(false);
// };

// const getCurrentUserContext = () => {
//     try {
//       const userString = localStorage.getItem("currentUser");

//       if (!userString) {
//         return {
//           userId: "",
//           role: "",
//           fullName: "",
//         };
//       }

//       const userObj = JSON.parse(userString);

//       return {
//         userId: userObj.userId ?? "",
//         role: userObj.role?.toLowerCase() ?? "",
//         fullName: userObj.fullName?.toLowerCase() ?? "",
//       };
//     } catch {
//       return {
//         userId: "",
//         role: "",
//         fullName: "",
//       };
//     }
//   };

//   const { userId, role } = getCurrentUserContext();

//    const fetchAllProjects = useCallback(
//       async (searchTerm) => {
//         if (!searchTerm || searchTerm.length < 4) {
//           setAvailableProjects([]);
//           setLoading(false);
//           return;
//         }

//         setLoading(true);
//         setError(null);

//         try {
//           const apiUrl =
//             `${backendUrl}/Project/GetAllProjectsForSearchV3` +
//             `?UserId=${userId}` +
//             `&Role=${role}` +
//             `&type=PROJECT` +
//             `&ProjId=${encodeURIComponent(searchTerm)}` +
//             `&take=${lookupTake}`;

//           const response = await fetch(apiUrl);

//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }

//           const projects = await response.json();

//           setAvailableProjects(Array.isArray(projects) ? projects : []);
//         } catch (e) {
//           console.error("Failed to load projects:", e);

//           setError("Failed to load project list. Please try again.");

//           setAvailableProjects([]);
//         } finally {
//           setLoading(false);
//         }
//       },
//       [userId, role, lookupTake],
//     );

//      const debouncedFetchProjects = useMemo(
//         () =>
//           debounce((query) => {
//             fetchAllProjects(query);
//           }, 500),
//         [fetchAllProjects],
//       );

//       useEffect(() => {
//         return () => {
//           debouncedFetchProjects.cancel();
//         };
//       }, [debouncedFetchProjects]);

//       useEffect(() => {
//         const searchTerm = term.trim();

//         if (searchTerm.length >= 4) {
//           setLoading(true);
//           debouncedFetchProjects(searchTerm);
//         } else {
//           debouncedFetchProjects.cancel();

//           setAvailableProjects([]);
//           setLoading(false);
//           setError(null);
//         }
//       }, [term, debouncedFetchProjects]);

//       // ---------------------------------------------------------
//       // Project Options
//       // ---------------------------------------------------------

//       const projectOptions = useMemo(() => {
//         return availableProjects
//           .map((project) => ({
//             value: project?.projectId ?? "",
//             label: project?.name
//               ? `${project.projectId} - ${project.name}`
//               : String(project?.projectId ?? ""),
//           }))
//           .sort((a, b) =>
//             (a.label ?? "").localeCompare(b.label ?? "", undefined, {
//               numeric: true,
//               sensitivity: "base",
//             }),
//           );
//       }, [availableProjects]);

//   // ---------- Fetch base lists on mount ----------
//   useEffect(() => {
//     const fetchBaseData = async () => {
//       try {
//         setProjectLoading(true);
//         setUserLoading(true);
//         setGroupLoading(true);
//         setOrgLoading(true);

//         // Projects
//         // const projRes = await fetch(`${backendUrl}/Project/GetAllProjects`);
//         // if (!projRes.ok) throw new Error("Project fetch failed");
//         // const projData = await projRes.json();
//         // setProjects(projData);
//         // setProjectOptions(
//         //   (projData || [])
//         //     .map((p) => ({
//         //       value: p.projectId || p.id || "",
//         //       label: ` ${
//         //         p.projectId || p.id || ""
//         //       } - ${p.name || p.projectName || "Unnamed"}`,
//         //     }))
//         //     .sort((a, b) =>
//         //       a.label.localeCompare(b.label, undefined, {
//         //         numeric: true,
//         //         sensitivity: "base",
//         //       }),
//         //     ),
//         // );

//         // Users
//         const userRes = await axios.get(`${backendUrl}/api/User`);
//         const userData = userRes.data || [];
//         setUsers(userData);
//         setUserOptions(
//           userData.map((u) => ({
//             value: u.userId,
//             label: `${u.userId} - ${u.username || u.fullName || ""}`,
//           })),
//         );

//         // Groups
//         const groupsRes = await axios.get(
//           `${backendUrl}/api/user-projects/GetGroups`,
//         );
//         const groupData = groupsRes.data || [];
//         setGroups(groupData);
//         setGroupOptions(
//           groupData.map((g) => ({
//             value: g.orgGroupId,
//             label: `${g.orgGroupCode} - ${g.orgGroupName || ""}`,
//           })),
//         );

//         // Orgs
//         const orgRes = await axios.get(`${backendUrl}/Orgnization/GetAllOrgs`);
//         const orgData = orgRes.data || [];
//         setOrgs(orgData);
//       } catch (e) {
//         console.error("Base data fetch failed", e);
//         setError("Failed to load initial data.");
//       } finally {
//         setProjectLoading(false);
//         setUserLoading(false);
//         setGroupLoading(false);
//         setOrgLoading(false);
//       }
//     };

//     fetchBaseData();
//   }, []);

//     const handleClearProject = () => {
//     debouncedFetchProjects.cancel();

//     setSelectedProjectId("");
//     setTerm("");
//     setAvailableProjects([]);
//     setShowSuggestions(false);
//     setError(null);
//   };

//   // ---------- Mode 1: Project ↔ Users ----------
//   useEffect(() => {
//     if (!selectedProjectId) {
//       setSelectedUsersForProject([]);
//       return;
//     }

//     const fetchUsersForProject = async () => {
//       setUserLoading(true);
//       try {
//         const mappedRes = await axios.get(
//           `${backendUrl}/api/user-projects/users/${selectedProjectId}`,
//         );
//         const mappedUsers = mappedRes.data || [];
//         const mappedIds = Array.isArray(mappedUsers)
//           ? mappedUsers.map((u) => (typeof u === "object" ? u.userId : u))
//           : [];
//         setSelectedUsersForProject(mappedIds);
//       } catch (e) {
//         console.error("Fetch mapped users for project failed", e);
//         setSelectedUsersForProject([]);
//       } finally {
//         setUserLoading(false);
//       }
//     };

//     fetchUsersForProject();
//   }, [selectedProjectId]);

//   const filteredUsersForProject = users.filter((u) =>
//     `${u.userId} ${u.username || ""} ${u.fullName || ""}`
//       .toLowerCase()
//       .includes(searchTermUsers.toLowerCase()),
//   );
//   const sortedUsersForProject = [...filteredUsersForProject].sort((a, b) => {
//     const aSel = selectedUsersForProject.includes(a.userId);
//     const bSel = selectedUsersForProject.includes(b.userId);
//     if (aSel === bSel) return 0;
//     return aSel ? -1 : 1;
//   });

//   const toggleUserForProject = (userId) => {
//     setSelectedUsersForProject((prev) =>
//       prev.includes(userId)
//         ? prev.filter((id) => id !== userId)
//         : [...prev, userId],
//     );
//   };

//   const saveProjectUsers = async () => {
//     if (!selectedProjectId) {
//       toast.warn("Select a project first.");
//       return;
//     }
//     try {
//       setLoading(true);
//       await axios.post(`${backendUrl}/api/user-projects/bulk-sync`, {
//         projId: selectedProjectId,
//         userIds: selectedUsersForProject,
//       });
//       toast.success("Project ↔ Users mapping updated.");

//       const mappedRes = await axios.get(
//         `${backendUrl}/api/user-projects/users/${selectedProjectId}`,
//       );
//       const mappedUsers = mappedRes.data || [];
//       const mappedIds = Array.isArray(mappedUsers)
//         ? mappedUsers.map((u) => (typeof u === "object" ? u.userId : u))
//         : [];
//       setSelectedUsersForProject(mappedIds);
//     } catch (e) {
//       console.error("Save project-users failed", e);
//       toast.error("Failed to update project-users mapping.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------- Mode 2: User ↔ Groups ----------
//   useEffect(() => {
//     if (!selectedUserIdForGroups) {
//       setSelectedGroupsForUser([]);
//       return;
//     }

//     const fetchGroupsForUser = async () => {
//       setGroupLoading(true);
//       try {
//         const res = await axios.get(
//           `${backendUrl}/api/user-projects/Groups/${selectedUserIdForGroups}`,
//         );
//         const mappedGroups = res.data || [];
//         const mappedIds = Array.isArray(mappedGroups)
//           ? mappedGroups.map((g) => (typeof g === "object" ? g.orgGroupId : g))
//           : [];
//         setSelectedGroupsForUser(mappedIds);
//       } catch (e) {
//         console.error("Fetch groups for user failed", e);
//         setSelectedGroupsForUser([]);
//       } finally {
//         setGroupLoading(false);
//       }
//     };

//     fetchGroupsForUser();
//   }, [selectedUserIdForGroups]);

//   const filteredGroupsForUser = groups.filter((g) =>
//     `${g.orgGroupId} ${g.orgGroupName || ""}`
//       .toLowerCase()
//       .includes(searchTermGroups.toLowerCase()),
//   );
//   const sortedGroupsForUser = [...filteredGroupsForUser].sort((a, b) => {
//     const aSel = selectedGroupsForUser.includes(a.orgGroupId);
//     const bSel = selectedGroupsForUser.includes(b.orgGroupId);
//     if (aSel === bSel) return 0;
//     return aSel ? -1 : 1;
//   });

//   const toggleGroupForUser = (orgGroupId) => {
//     setSelectedGroupsForUser((prev) =>
//       prev.includes(orgGroupId)
//         ? prev.filter((id) => id !== orgGroupId)
//         : [...prev, orgGroupId],
//     );
//   };

//   const saveUserGroups = async () => {
//     if (!selectedUserIdForGroups) {
//       toast.warn("Select a user first.");
//       return;
//     }
//     try {
//       setLoading(true);
//       await axios.post(`${backendUrl}/api/user-projects/BulkSyncUsersGroups`, {
//         userId: selectedUserIdForGroups,
//         groupIds: selectedGroupsForUser,
//       });
//       toast.success("User ↔ Groups mapping updated.");

//       const res = await axios.get(
//         `${backendUrl}/api/user-projects/Groups/${selectedUserIdForGroups}`,
//       );
//       const mappedGroups = res.data || [];
//       const mappedIds = Array.isArray(mappedGroups)
//         ? mappedGroups.map((g) => (typeof g === "object" ? g.orgGroupId : g))
//         : [];
//       setSelectedGroupsForUser(mappedIds);
//     } catch (e) {
//       console.error("Save user-groups failed", e);
//       toast.error("Failed to update user-groups mapping.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------- Mode 3: Group ↔ Orgs ----------
//   useEffect(() => {
//     if (!selectedGroupIdForOrgs) {
//       setSelectedOrgsForGroup([]);
//       return;
//     }

//     const fetchOrgsForGroup = async () => {
//       setOrgLoading(true);
//       try {
//         const res = await axios.get(
//           `${backendUrl}/api/user-projects/Orgs/${selectedGroupIdForOrgs}`,
//         );
//         const mappedOrgs = res.data || [];
//         const mappedIds = Array.isArray(mappedOrgs)
//           ? mappedOrgs.map((o) => (typeof o === "object" ? o.orgId : o))
//           : [];
//         setSelectedOrgsForGroup(mappedIds);
//       } catch (e) {
//         console.error("Fetch orgs for group failed", e);
//         setSelectedOrgsForGroup([]);
//       } finally {
//         setOrgLoading(false);
//       }
//     };

//     fetchOrgsForGroup();
//   }, [selectedGroupIdForOrgs]);

//   const filteredOrgsForGroup = orgs.filter((o) =>
//     `${o.orgId} ${o.orgName || ""}`
//       .toLowerCase()
//       .includes(searchTermOrgs.toLowerCase()),
//   );
//   const sortedOrgsForGroup = [...filteredOrgsForGroup].sort((a, b) => {
//     const aSel = selectedOrgsForGroup.includes(a.orgId);
//     const bSel = selectedOrgsForGroup.includes(b.orgId);
//     if (aSel === bSel) return 0;
//     return aSel ? -1 : 1;
//   });

//   const toggleOrgForGroup = (orgId) => {
//     setSelectedOrgsForGroup((prev) =>
//       prev.includes(orgId)
//         ? prev.filter((id) => id !== orgId)
//         : [...prev, orgId],
//     );
//   };

//   const saveGroupOrgs = async () => {
//     if (!selectedGroupIdForOrgs) {
//       toast.warn("Select a group first.");
//       return;
//     }
//     try {
//       setLoading(true);
//       await axios.post(`${backendUrl}/api/user-projects/BulkSyncGroupOrgs`, {
//         groupId: selectedGroupIdForOrgs,
//         orgIds: selectedOrgsForGroup,
//       });
//       toast.success("Group ↔ Orgs mapping updated.");

//       const res = await axios.get(
//         `${backendUrl}/api/user-projects/Orgs/${selectedGroupIdForOrgs}`,
//       );
//       const mappedOrgs = res.data || [];
//       const mappedIds = Array.isArray(mappedOrgs)
//         ? mappedOrgs.map((o) => (typeof o === "object" ? o.orgId : o))
//         : [];
//       setSelectedOrgsForGroup(mappedIds);
//     } catch (e) {
//       console.error("Save group-orgs failed", e);
//       toast.error("Failed to update group-orgs mapping.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------- Mode 4: User ↔ Orgs ----------
//   useEffect(() => {
//     if (!selectedUserIdForOrgs) {
//       setSelectedOrgsForUser([]);
//       return;
//     }

//     const fetchOrgsForUser = async () => {
//       setOrgLoading(true);
//       try {
//         const res = await axios.get(
//           `${backendUrl}/api/user-projects/Orgs/${selectedUserIdForOrgs}`,
//         );
//         const mappedOrgs = res.data || [];
//         const mappedIds = Array.isArray(mappedOrgs)
//           ? mappedOrgs.map((o) => (typeof o === "object" ? o.orgId : o))
//           : [];
//         setSelectedOrgsForUser(mappedIds);
//       } catch (e) {
//         console.error("Fetch orgs for user failed", e);
//         setSelectedOrgsForUser([]);
//       } finally {
//         setOrgLoading(false);
//       }
//     };

//     fetchOrgsForUser();
//   }, [selectedUserIdForOrgs]);

//   const filteredOrgsForUser = orgs.filter((o) =>
//     `${o.orgId} ${o.orgName || ""}`
//       .toLowerCase()
//       .includes(searchTermUserOrgs.toLowerCase()),
//   );
//   const sortedOrgsForUser = [...filteredOrgsForUser].sort((a, b) => {
//     const aSel = selectedOrgsForUser.includes(a.orgId);
//     const bSel = selectedOrgsForUser.includes(b.orgId);
//     if (aSel === bSel) return 0;
//     return aSel ? -1 : 1;
//   });

//   const toggleOrgForUser = (orgId) => {
//     setSelectedOrgsForUser((prev) =>
//       prev.includes(orgId)
//         ? prev.filter((id) => id !== orgId)
//         : [...prev, orgId],
//     );
//   };

//   const saveUserOrgs = async () => {
//     if (!selectedUserIdForOrgs) {
//       toast.warn("Select a user first.");
//       return;
//     }
//     try {
//       setLoading(true);
//       await axios.post(`${backendUrl}/api/user-projects/BulkSyncUsersOrgs`, {
//         userId: selectedUserIdForOrgs,
//         orgIds: selectedOrgsForUser,
//       });
//       toast.success("User ↔ Orgs mapping updated.");

//       const res = await axios.get(
//         `${backendUrl}/api/user-projects/Orgs/${selectedUserIdForOrgs}`,
//       );
//       const mappedOrgs = res.data || [];
//       const mappedIds = Array.isArray(mappedOrgs)
//         ? mappedOrgs.map((o) => (typeof o === "object" ? o.orgId : o))
//         : [];
//       setSelectedOrgsForUser(mappedIds);
//     } catch (e) {
//       console.error("Save user-orgs failed", e);
//       toast.error("Failed to update user-orgs mapping.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------Manage Groups------------
//   const renderManageGroupsTab = () => {
//     const filteredGroups = groups.filter((g) =>
//       `${g.orgGroupId} ${g.orgGroupCode || ""} ${g.orgGroupName || ""}`
//         .toLowerCase()
//         .includes(searchTermGroups.toLowerCase()),
//     );

//     const allSelected = areAllGroupsSelected(filteredGroups);

//     return (
//       <>
//         <div className="mb-6 bg-gray-50 p-4 rounded-xl border">
//           <h3 className="text-lg font-semibold text-gray-900 mb-3">
//             {editingGroupId ? "Edit Group" : "Create Group"}
//           </h3>

//           <div className="grid md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-xs font-medium text-gray-600 mb-1">
//                 Group Code
//               </label>
//               <input
//                 type="text"
//                 value={groupCodeInput}
//                 onChange={(e) => setGroupCodeInput(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                 placeholder="Group code"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-600 mb-1">
//                 Group Name
//               </label>
//               <input
//                 type="text"
//                 value={groupNameInput}
//                 onChange={(e) => setGroupNameInput(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                 placeholder="Group name"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-600 mb-1">
//                 Description
//               </label>
//               <input
//                 type="text"
//                 value={groupDescription}
//                 onChange={(e) => setGroupDescription(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                 placeholder="Description"
//               />
//             </div>
//           </div>

//           <div className="flex gap-3 justify-end mt-4">
//             {editingGroupId && (
//               <button
//                 type="button"
//                 onClick={resetGroupForm}
//                 className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 bg-white"
//                 disabled={groupFormLoading}
//               >
//                 Cancel
//               </button>
//             )}
//             <button
//               type="button"
//               onClick={handleCreateOrUpdateGroup}
//               className="px-5 py-2 text-sm rounded bg-[#17414d] text-white group-hover:text-gray font-semibold disabled:opacity-60"
//               disabled={groupFormLoading}
//             >
//               {groupFormLoading
//                 ? "Saving..."
//                 : editingGroupId
//                   ? "Update Group"
//                   : "Create Group"}
//             </button>
//           </div>
//         </div>

//         <div className="bg-gray-50 rounded-xl p-4 border">
//           <div className="flex justify-between items-center mb-3">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Existing Groups
//             </h3>
//             <div className="flex items-center gap-3">
//               <input
//                 type="text"
//                 placeholder="Search by id, code, name..."
//                 value={searchTermGroups}
//                 onChange={(e) => setSearchTermGroups(e.target.value)}
//                 className="border border-gray-300 rounded px-3 py-1 text-sm w-64"
//               />
//               <button
//                 type="button"
//                 onClick={handleBulkDeleteGroups}
//                 className="px-4 py-2 text-xs rounded  disabled:opacity-50 bg-red-600 text-white"
//                 disabled={
//                   groupFormLoading || selectedGroupIdsForDelete.length === 0
//                 }
//               >
//                 Delete({selectedGroupIdsForDelete.length})
//               </button>
//             </div>
//           </div>

//           <div className="overflow-x-auto max-h-80">
//             <table className="w-full text-sm">
//               <thead className="thead">
//                 <tr className="bg-white border-b">
//                   <th className="px-3 py-2 text-left text-gray-500 text-xs w-10">
//                     <input
//                       type="checkbox"
//                       className="w-4 h-4"
//                       checked={allSelected}
//                       onChange={() => toggleSelectAllGroups(filteredGroups)}
//                     />
//                   </th>
//                   {/* <th className="px-3 py-2 text-left text-gray-500 text-xs">
//                   ID
//                 </th> */}
//                   <th className="px-3 py-2 text-left text-gray-500 text-xs">
//                     Code
//                   </th>
//                   <th className="px-3 py-2 text-left text-gray-500 text-xs">
//                     Name
//                   </th>
//                   <th className="px-3 py-2 text-left text-gray-500 text-xs">
//                     Description
//                   </th>
//                   <th className="px-3 py-2 text-right text-gray-500 text-xs">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredGroups.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={6}
//                       className="px-3 py-6 text-center text-gray-500"
//                     >
//                       No groups found.
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredGroups.map((g) => {
//                     const selected = selectedGroupIdsForDelete.includes(
//                       g.orgGroupId,
//                     );
//                     return (
//                       <tr key={g.orgGroupId} className="hover:bg-gray-50">
//                         <td className="px-3 py-2">
//                           <input
//                             type="checkbox"
//                             className="w-4 h-4"
//                             checked={selected}
//                             onChange={() =>
//                               toggleSelectedGroupForDelete(g.orgGroupId)
//                             }
//                           />
//                         </td>
//                         {/* <td className="px-3 py-2">{g.orgGroupId}</td> */}
//                         <td className="px-3 py-2">{g.orgGroupCode}</td>
//                         <td className="px-3 py-2">{g.orgGroupName}</td>
//                         <td className="px-3 py-2">{g.description}</td>
//                         <td className="px-3 py-2 text-right space-x-2">
//                           <button
//                             type="button"
//                             onClick={() => startEditGroup(g)}
//                             className="text-xs px-3 py-1 rounded border border-blue-500 text-blue-600"
//                           >
//                             Edit
//                           </button>
//                           {/* <button
//                           type="button"
//                           onClick={() => handleDeleteGroup(g)}
//                           className="text-xs px-3 py-1 rounded border border-red-500 text-red-600"
//                         >
//                           Delete
//                         </button> */}
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </>
//     );
//   };

//   // ----- user tabs--------
//   const renderManageUsersTab = () => {
//     const filteredUsers = users.filter((u) =>
//       `${u.userId} ${u.username || ""} ${u.fullName || ""} ${u.email || ""}`
//         .toLowerCase()
//         .includes(searchTermManageUsers.toLowerCase()),
//     );

//     const allSelected = areAllUsersSelected(filteredUsers);

//     return (
//       <>
//         <div className="mb-6 bg-gray-50 p-4 rounded-xl border">
//           <h3 className="text-lg font-semibold text-gray-900 mb-3 ">
//             {editingUserId ? "Edit User" : "Create User"}
//           </h3>

//           <div className="grid md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-xs font-medium text-gray-600 mb-1">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 value={userNameInput}
//                 onChange={(e) => setUserNameInput(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                 placeholder="Username"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-600 mb-1">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 value={userFullNameInput}
//                 onChange={(e) => setUserFullNameInput(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                 placeholder="Full name"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-600 mb-1">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 value={userEmailInput}
//                 onChange={(e) => setUserEmailInput(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                 placeholder="Email"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-600 mb-1">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 value={userPasswordInput}
//                 onChange={(e) => setUserPasswordInput(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                 placeholder="Password"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-gray-600 mb-1">
//                 Role
//               </label>
//               <select
//                 value={userRoleInput}
//                 onChange={(e) => setUserRoleInput(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
//               >
//                 <option value="">Select role</option>
//                 <option value="admin">Admin</option>
//                 {/* <option value="manager">Manager</option> */}
//                 <option value="user">User</option>
//               </select>
//             </div>
//           </div>

//           <div className="flex gap-3 justify-end mt-4">
//             {editingUserId && (
//               <button
//                 type="button"
//                 onClick={resetUserForm}
//                 className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 bg-white"
//                 disabled={userFormLoading}
//               >
//                 Cancel
//               </button>
//             )}
//             <button
//               type="button"
//               onClick={handleCreateOrUpdateUser}
//               className="px-5 py-2 text-sm rounded bg-[#17414d] text-white group-hover:text-gray  font-semibold disabled:opacity-60"
//               disabled={userFormLoading}
//             >
//               {userFormLoading
//                 ? "Saving..."
//                 : editingUserId
//                   ? "Update User"
//                   : "Create User"}
//             </button>
//           </div>
//         </div>

//         <div className="bg-gray-50 rounded-xl p-4 border">
//           <div className="flex justify-between items-center mb-3">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Existing Users
//             </h3>
//             <div className="flex items-center gap-3">
//               <input
//                 type="text"
//                 placeholder="Search by id, username, name, email..."
//                 value={searchTermManageUsers}
//                 onChange={(e) => setSearchTermManageUsers(e.target.value)}
//                 className="border border-gray-300 rounded px-3 py-1 text-sm w-64"
//               />
//               <button
//                 type="button"
//                 onClick={handleBulkDeleteUsers}
//                 className="px-4 py-2 text-xs rounded border border-red-500 text-red-600 disabled:opacity-50"
//                 disabled={
//                   userFormLoading || selectedUserIdsForDelete.length === 0
//                 }
//               >
//                 Delete Selected ({selectedUserIdsForDelete.length})
//               </button>
//             </div>
//           </div>

//           <div className="overflow-x-auto max-h-80">
//             <table className="w-full text-sm">
//               <thead className="thead">
//                 <tr className="bg-white border-b">
//                   <th className="px-3 py-2 text-left text-gray-500 text-xs w-10">
//                     <input
//                       type="checkbox"
//                       className="w-4 h-4"
//                       checked={allSelected}
//                       onChange={() => toggleSelectAllUsers(filteredUsers)}
//                     />
//                   </th>
//                   <th className="px-3 py-2 text-left text-gray-500 text-xs">
//                     ID
//                   </th>
//                   <th className="px-3 py-2 text-left text-gray-500 text-xs">
//                     Username
//                   </th>
//                   <th className="px-3 py-2 text-left text-gray-500 text-xs">
//                     Full Name
//                   </th>
//                   <th className="px-3 py-2 text-left text-gray-500 text-xs">
//                     Email
//                   </th>
//                   <th className="px-3 py-2 text-right text-gray-500 text-xs">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={6}
//                       className="px-3 py-6 text-center text-gray-500"
//                     >
//                       No users found.
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredUsers.map((u) => {
//                     const selected = selectedUserIdsForDelete.includes(
//                       u.userId,
//                     );
//                     return (
//                       <tr key={u.userId} className="hover:bg-gray-50">
//                         <td className="px-3 py-2">
//                           <input
//                             type="checkbox"
//                             className="w-4 h-4"
//                             checked={selected}
//                             onChange={() =>
//                               toggleSelectedUserForDelete(u.userId)
//                             }
//                           />
//                         </td>
//                         <td className="px-3 py-2">{u.userId}</td>
//                         <td className="px-3 py-2">{u.username}</td>
//                         <td className="px-3 py-2">{u.fullName}</td>
//                         <td className="px-3 py-2">{u.email}</td>
//                         <td className="px-3 py-2 text-right space-x-2">
//                           <button
//                             type="button"
//                             onClick={() => startEditUser(u)}
//                             className="text-xs px-3 py-1 rounded border border-blue-500 text-blue-600"
//                           >
//                             Edit
//                           </button>
//                           {/* <button
//                           type="button"
//                           onClick={() => handleBulkDeleteUsers([u.userId])}
//                           className="text-xs px-3 py-1 rounded border border-red-500 text-red-600"
//                         >
//                           Delete
//                         </button> */}
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </>
//     );
//   };

//   // ---------- Render helpers ----------
//   const renderProjectUsersTab = () => (
//     <>

//        <div className="p-4">
//           <div className="flex flex-col sm:flex-row sm:items-end gap-3 ">
//             {/* Project ID */}

//             <div className=" flex items-center gap-2 w-full sm:w-[420px] ">
//               <label htmlFor="projectId" className="input-label mb-1 block">
//                 Project ID
//                 <span className="text-red-500 ml-1">*</span>
//               </label>

//               <div className="relative w-full max-w-md">
//                 <Search
//                   size={15}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
//                 />

//                 <input
//                   id="projectId"
//                   type="text"
//                   className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-full !pl-9 !pr-9 w-full"
//                   placeholder="Search Project ID or Name..."
//                   value={term}
//                   onChange={(e) => {
//                     setTerm(e.target.value);
//                     setSelectedProjectId("");
//                     setShowSuggestions(true);
//                   }}
//                   onFocus={() => {
//                     if (term.trim().length >= 4) {
//                       setShowSuggestions(true);
//                     }
//                   }}
//                   autoComplete="off"
//                 />

//                 {/* Clear */}

//                 {term && !loading && (
//                   <button
//                     type="button"
//                     onClick={handleClearProject}
//                     className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
//                     title="Clear"
//                   >
//                     <X size={15} />
//                   </button>
//                 )}

//                 {/* Loading */}

//                 {loading && (
//                   <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                     <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
//                   </div>
//                 )}

//                 {/* Suggestions */}

//                 {showSuggestions &&
//                   term.trim().length >= 4 &&
//                   !loading &&
//                   projectOptions.length > 0 && (
//                     <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
//                       {projectOptions.map((project, index) => (
//                         <li
//                           key={project.value || index}
//                           onMouseDown={(e) => {
//                             e.preventDefault();
//                             handleProjectSelect(project);
//                           }}
//                           className="px-3 py-2 text-xs hover:bg-blue-50 cursor-pointer border-b last:border-none"
//                         >
//                           <div className="font-bold text-blue-900">
//                             {project.value}
//                           </div>

//                           {project.label !== project.value && (
//                             <div className="text-gray-600 truncate">
//                               {project.label.replace(`${project.value} - `, "")}
//                             </div>
//                           )}
//                         </li>
//                       ))}
//                     </ul>
//                   )}

//                 {/* No Results */}

//                 {showSuggestions &&
//                   term.trim().length >= 4 &&
//                   !loading &&
//                   projectOptions.length === 0 &&
//                   !error && (
//                     <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-3 text-xs text-gray-500 shadow-lg">
//                       No projects found.
//                     </div>
//                   )}
//               </div>

//               {/* Helper Text */}

//               {error && (
//                 <p className="mt-1 text-[11px] text-red-500">{error}</p>
//               )}
//               {/* : (
//             !selectedProjectId && (
//               <p className="mt-1 text-[11px] text-gray-400">
//                 Enter at least 4 characters to search for a project.
//               </p>
//             )
//           )} */}
//             </div>

//             {/* Selected Project */}

//             {/* {selectedProjectId && (

//           <div className="flex items-center gap-2 pb-1">

//             <span className="text-[11px] text-gray-500">
//               Selected Project:
//             </span>

//             <span className="rounded bg-blue-50 border border-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
//               {selectedProjectId}
//             </span>

//           </div>

//         )} */}
//           </div>
//         </div>

//       <div className="rounded mb-4 ">
//         <div className="flex items-center gap-x-4  mb-2">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="text-sm font-semibold text-gray-900">
//               Users for project
//             </h3>
//             <span className="text-sm text-blue-600">
//               {/* {selectedUsersForProject.length} selected */}
//             </span>
//           </div>

//           {selectedProjectId && (
//             <>
//               {/* <div className=" "> */}
//               <div className="flex items-center">
//                 <input
//                   type="text"
//                   placeholder="Search users by ID, name..."
//                   value={searchTermUsers}
//                   onChange={(e) => setSearchTermUsers(e.target.value)}
//                   className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner  "
//                 />
//                 {/* <button
//               onClick={() => fetchEmployees()} // Calls the API with current searchTerm
//               className="px-2 py-1.5 bg-[#17414D] text-white rounded-r hover:bg-[#17414D] transition-colors border border-[#17414D] flex items-center justify-center"
//             >
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//             </button> */}
//               </div>
//               <div className="flex flex-1 justify-end">
//                 {isEditable && (
//                   <button
//                     onClick={saveProjectUsers}
//                     disabled={!selectedProjectId || loading}
//                     className="bg-[#17414d] btn1 btn-blue disabled:opacity-60"
//                   >
//                     {loading ? "Saving..." : "Update Project ↔ Users"}
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>

//         <div className="overflow-x-auto max-h-80 border border-gray-300 rounded">
//           <table className="w-full text-sm">
//             <thead className="thead">
//               <tr className="bg-white border-b border-gray-300">
//                 <th className="th-thead w-10 text-left text-black text-xs">
//                   Select
//                 </th>
//                 {/* <th className="th-thead text-left text-black text-xs">
//                   User ID
//                 </th> */}
//                 <th className="th-thead text-left text-black text-xs">Name</th>
//                 <th className="th-thead text-left text-black text-xs">Role</th>
//               </tr>
//             </thead>
//             <tbody>
//               {!selectedProjectId ? (
//                 <tr>
//                   <td
//                     colSpan={4}
//                     className="px-3 py-6 text-center text-gray-500"
//                   >
//                     Select a project to view users.
//                   </td>
//                 </tr>
//               ) : userLoading ? (
//                 <tr>
//                   <td
//                     colSpan={4}
//                     className="px-3 py-6 text-center text-gray-500"
//                   >
//                     Loading users...
//                   </td>
//                 </tr>
//               ) : sortedUsersForProject.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={4}
//                     className="px-3 py-6 text-center text-gray-500"
//                   >
//                     No users found.
//                   </td>
//                 </tr>
//               ) : (
//                 // sortedUsersForProject.map((u) => {

//                 //   const selected = selectedUsersForProject.includes(u.userId);
//                 sortedUsersForProject
//                   .filter((u) => !u.role || u.role.toLowerCase() !== "admin")
//                   .map((u) => {
//                     const selected = selectedUsersForProject.includes(u.userId);
//                     return (
//                       <tr key={u.userId} className="hover:bg-gray-50">
//                         <td className="tbody-td">
//                           <input
//                             type="checkbox"
//                             className="w-3 h-3"
//                             checked={selected}
//                             onChange={() => toggleUserForProject(u.userId)}
//                           />
//                         </td>
//                         {/* <td className="tbody-td">{u.userId}</td> */}
//                         <td className="tbody-td">
//                           {u.username || u.fullName || "-"}
//                         </td>
//                         <td className="tbody-td capitalize">{u.role || "-"}</td>
//                       </tr>
//                     );
//                   })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* <div className="flex justify-end">
//         <button
//           onClick={saveProjectUsers}
//           disabled={!selectedProjectId || loading}
//           className="bg-[#17414d] btn1 btn-blue disabled:opacity-60"
//         >
//           {loading ? "Saving..." : "Update Project ↔ Users"}
//         </button>
//       </div> */}
//     </>
//   );

//   useEffect(() => {
//     if (users && users.length > 0) {
//       // Filter out roles that are classified as "admin"
//       const filteredUsers = users.filter(
//         (u) => !u.role || u.role.toLowerCase() !== "admin",
//       );

//       const options = filteredUsers.map((u) => ({
//         value: u.userId,
//         label: `${u.username || ""} (${u.fullName})`,
//       }));
//       setUserOptions(options);
//     } else {
//       setUserOptions([]);
//     }
//   }, [users]);

//   const renderUserGroupsTab = () => (
//     <>
//       {/* User select row (match Project design) */}
//       <div className="mb-2 rounded flex items-center gap-x-4 w-full">
//         <label className="input-label">
//           User <span className="text-red-500">*</span>
//         </label>
//         <Select
//           options={userOptions}
//           isLoading={userLoading}
//           className="outline-none w-[40%]"
//           value={
//             selectedUserIdForGroups
//               ? userOptions.find((o) => o.value === selectedUserIdForGroups)
//               : null
//           }
//           onChange={(opt) => setSelectedUserIdForGroups(opt ? opt.value : "")}
//           isSearchable
//           placeholder="Search & select a user"
//         />
//       </div>

//       {/* Groups section */}
//       <div className="rounded mb-4">
//         <div className="flex items-center gap-x-4 mb-2">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="text-sm font-semibold text-gray-900">
//               Groups for user
//             </h3>
//             {/* <span className="text-sm text-blue-600">
//               {selectedGroupsForUser.length} selected
//             </span> */}
//           </div>

//           {selectedUserIdForGroups && (
//             <>
//               {/* <div> */}
//               <div className="flex items-center">
//                 <input
//                   type="text"
//                   placeholder="Search groups..."
//                   value={searchTermGroups}
//                   onChange={(e) => setSearchTermGroups(e.target.value)}
//                   className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner"
//                 />
//               </div>
//               <div className="flex flex-1 justify-end">
//                 {isEditable && (
//                   <button
//                     onClick={saveUserGroups}
//                     disabled={!selectedUserIdForGroups || loading}
//                     className="bg-[#17414d] btn1 btn-blue disabled:opacity-60"
//                   >
//                     {loading ? "Saving..." : "Update User ↔ Groups"}
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>

//         <div className="overflow-x-auto max-h-80 border border-gray-300 rounded">
//           <table className="w-full text-sm">
//             <thead className="thead">
//               <tr className="bg-white border-b border-gray-300">
//                 <th className="th-thead w-10 text-left text-black text-xs">
//                   Select
//                 </th>
//                 <th className="th-thead text-left text-black text-xs">
//                   Group ID
//                 </th>
//                 <th className="th-thead text-left text-black text-xs">
//                   Group Name
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {!selectedUserIdForGroups ? (
//                 <tr>
//                   <td
//                     colSpan={3}
//                     className="px-3 py-6 text-center text-gray-500"
//                   >
//                     Select a user to view groups.
//                   </td>
//                 </tr>
//               ) : groupLoading ? (
//                 <tr>
//                   <td
//                     colSpan={3}
//                     className="px-3 py-6 text-center text-gray-500"
//                   >
//                     Loading groups...
//                   </td>
//                 </tr>
//               ) : sortedGroupsForUser.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={3}
//                     className="px-3 py-6 text-center text-gray-500"
//                   >
//                     No groups found.
//                   </td>
//                 </tr>
//               ) : (
//                 sortedGroupsForUser.map((g) => {
//                   const selected = selectedGroupsForUser.includes(g.orgGroupId);
//                   return (
//                     <tr key={g.orgGroupId} className="hover:bg-gray-50">
//                       <td className="tbody-td">
//                         <input
//                           type="checkbox"
//                           className="w-3 h-3"
//                           checked={selected}
//                           onChange={() => toggleGroupForUser(g.orgGroupId)}
//                         />
//                       </td>
//                       <td className="tbody-td">{g.orgGroupId}</td>
//                       <td className="tbody-td">{g.orgGroupName || "-"}</td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* <div className="flex justify-end">
//         <button
//           onClick={saveUserGroups}
//           disabled={!selectedUserIdForGroups || loading}
//           className="bg-[#17414d] btn1 btn-blue disabled:opacity-60"
//         >
//           {loading ? "Saving..." : "Update User ↔ Groups"}
//         </button>
//       </div> */}
//     </>
//   );

//   const renderGroupOrgsTab = () => (
//     <>
//       {/* Group select row (match Project design) */}
//       <div className="mb-2 rounded flex items-center gap-x-4 w-full">
//         <label className="input-label">
//           Group <span className="text-red-500">*</span>
//         </label>
//         <Select
//           options={groupOptions}
//           isLoading={groupLoading}
//           className="outline-none w-[40%]"
//           value={
//             selectedGroupIdForOrgs
//               ? groupOptions.find((o) => o.value === selectedGroupIdForOrgs)
//               : null
//           }
//           onChange={(opt) => setSelectedGroupIdForOrgs(opt ? opt.value : "")}
//           isSearchable
//           placeholder="Search & select a group"
//         />
//       </div>

//       {/* Orgs section */}
//       <div className="rounded mb-4">
//         <div className="flex items-center gap-x-4 mb-2">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="text-sm font-semibold text-gray-900">
//               Organizations for group
//             </h3>
//             {/* <span className="text-sm text-blue-600">
//             {selectedOrgsForGroup.length} selected
//           </span> */}
//           </div>

//           {selectedGroupIdForOrgs && (
//             <>
//               {/* // <div> */}
//               <div className="flex items-center">
//                 <input
//                   type="text"
//                   placeholder="Search organizations..."
//                   value={searchTermOrgs}
//                   onChange={(e) => setSearchTermOrgs(e.target.value)}
//                   className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner"
//                 />
//               </div>
//               <div className="flex flex-1 justify-end">
//                 {isEditable && (
//                   <button
//                     onClick={saveGroupOrgs}
//                     disabled={!selectedGroupIdForOrgs || loading}
//                     className="bg-[#17414d] btn1 btn-blue disabled:opacity-60"
//                   >
//                     {loading ? "Saving..." : "Update Group ↔ Orgs"}
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>

//         <div className="overflow-x-auto max-h-80 border border-gray-300 rounded">
//           <table className="w-full text-sm">
//             <thead className="thead">
//               <tr className="bg-white border-b border-gray-300">
//                 <th className="th-thead w-10 text-left text-black text-xs">
//                   Select
//                 </th>
//                 <th className="th-thead text-left text-black text-xs">
//                   Org ID
//                 </th>
//                 <th className="th-thead text-left text-black text-xs">
//                   Org Name
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {!selectedGroupIdForOrgs ? (
//                 <tr>
//                   <td
//                     colSpan={3}
//                     className="px-3 py-6 text-center text-gray-500"
//                   >
//                     Select a group to view organizations.
//                   </td>
//                 </tr>
//               ) : orgLoading ? (
//                 <tr>
//                   <td
//                     colSpan={3}
//                     className="px-3 py-6 text-center text-gray-500"
//                   >
//                     Loading organizations...
//                   </td>
//                 </tr>
//               ) : sortedOrgsForGroup.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={3}
//                     className="px-3 py-6 text-center text-gray-500"
//                   >
//                     No organizations found.
//                   </td>
//                 </tr>
//               ) : (
//                 sortedOrgsForGroup.map((o) => {
//                   const selected = selectedOrgsForGroup.includes(o.orgId);
//                   return (
//                     <tr key={o.orgId} className="hover:bg-gray-50">
//                       <td className="tbody-td">
//                         <input
//                           type="checkbox"
//                           className="w-3 h-3"
//                           checked={selected}
//                           onChange={() => toggleOrgForGroup(o.orgId)}
//                         />
//                       </td>
//                       <td className="tbody-td">{o.orgId}</td>
//                       <td className="tbody-td">{o.orgName || "-"}</td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* <div className="flex justify-end">
//       <button
//         onClick={saveGroupOrgs}
//         disabled={!selectedGroupIdForOrgs || loading}
//         className="bg-[#17414d] btn1 btn-blue disabled:opacity-60"
//       >
//         {loading ? "Saving..." : "Update Group ↔ Orgs"}
//       </button>
//     </div> */}
//     </>
//   );

//   const renderUserOrgsTab = () => (
//     <>
//       <div className="mb-6 bg-gray-50 p-4 rounded-xl border">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           User <span className="text-red-500">*</span>
//         </label>
//         <Select
//           options={userOptions}
//           isLoading={userLoading}
//           value={
//             selectedUserIdForOrgs
//               ? userOptions.find((o) => o.value === selectedUserIdForOrgs)
//               : null
//           }
//           onChange={(opt) => setSelectedUserIdForOrgs(opt ? opt.value : "")}
//           isSearchable
//           placeholder="Search & select a user"
//         />
//         {selectedUserIdForOrgs && (
//           <p className="mt-2 text-xs text-green-600">
//             Selected user: <strong>{selectedUserIdForOrgs}</strong>
//           </p>
//         )}
//       </div>

//       <div className="bg-gray-50 rounded-xl p-4 border mb-4">
//         <div className="flex justify-between items-center mb-3">
//           <h3 className="text-lg font-semibold text-gray-900">
//             Organizations for user
//           </h3>
//           <span className="text-sm text-blue-600">
//             {selectedOrgsForUser.length} selected
//           </span>
//         </div>

//         {selectedUserIdForOrgs && (
//           <div className="mb-3">
//             <input
//               type="text"
//               placeholder="Search organizations..."
//               value={searchTermUserOrgs}
//               onChange={(e) => setSearchTermUserOrgs(e.target.value)}
//               className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
//             />
//           </div>
//         )}

//         <div className="overflow-x-auto max-h-80">
//           <table className="w-full text-sm">
//             <thead className="thead">
//               <tr className="bg-white border-b">
//                 <th className="px-3 py-2 w-10 text-left text-gray-500 text-xs">
//                   Select
//                 </th>
//                 <th className="px-3 py-2 text-left text-gray-500 text-xs">
//                   Org ID
//                 </th>
//                 <th className="px-3 py-2 text-left text-gray-500 text-xs">
//                   Org Name
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {!selectedUserIdForOrgs ? (
//                 <tr>
//                   <td
//                     colSpan={3}
//                     className="px-3 py-6 text-center text-gray-500"
//                   >
//                     Select a user to view organizations.
//                   </td>
//                 </tr>
//               ) : orgLoading ? (
//                 <tr>
//                   <td
//                     colSpan={3}
//                     className="px-3 py-6 text-center text-gray-500"
//                   >
//                     Loading organizations...
//                   </td>
//                 </tr>
//               ) : sortedOrgsForUser.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={3}
//                     className="px-3 py-6 text-center text-gray-500"
//                   >
//                     No organizations found.
//                   </td>
//                 </tr>
//               ) : (
//                 sortedOrgsForUser.map((o) => {
//                   const selected = selectedOrgsForUser.includes(o.orgId);
//                   return (
//                     <tr key={o.orgId} className="hover:bg-gray-50">
//                       <td className="px-3 py-2">
//                         <input
//                           type="checkbox"
//                           className="w-4 h-4"
//                           checked={selected}
//                           onChange={() => toggleOrgForUser(o.orgId)}
//                         />
//                       </td>
//                       <td className="px-3 py-2">{o.orgId}</td>
//                       <td className="px-3 py-2">{o.orgName || "-"}</td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="flex justify-end">
//         <button
//           onClick={saveUserOrgs}
//           disabled={!selectedUserIdForOrgs || loading}
//           className="bg-[#17414d] btn1 btn-blue disabled:opacity-60"
//         >
//           {loading ? "Saving..." : "Update User ↔ Orgs"}
//         </button>
//       </div>
//     </>
//   );

//   return (
//     <div className="min-h-screen text-gray-900 flex w-full">
//       {/* <h2 className="text-2xl font-bold mb-2">
//         User, Group & Org Mapping
//       </h2> */}
//       <div className="w-full  p-2 mt-10 space-y-2">
//         <div className="p-4 border-b w-full rounded-sm border-gray-100 flex items-center justify-between bg-white">
//           <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//             <AiOutlineFundProjectionScreen
//               size={20}
//               className="text-blue-500"
//             />
//             Access Mapping
//           </h2>
//         </div>
//         {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

//         <div className="bg-white p-4 w-full rounded">
//           <div className="flex justify-between items-center rounded  mb-4">
//             <div className="flex gap-x-2">
//               <button
//                 className={`rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors
//           ${
//             activeMainTab === "projectUsers"
//               ? "border-b-2 bg-[#17414d] text-white group-hover:text-gray"
//               : "text-gray-600 hover:text-gray-800 bg-gray-100"
//           }`}
//                 onClick={() => setActiveMainTab("projectUsers")}
//               >
//                 Project ↔ Users
//               </button>

//               <button
//                 className={`rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors
//           ${
//             activeMainTab === "userGroups"
//               ? "border-b-2 bg-[#17414d] text-white group-hover:text-gray"
//               : "text-gray-600 hover:text-gray-800 bg-gray-100"
//           }`}
//                 onClick={() => setActiveMainTab("userGroups")}
//               >
//                 User ↔ Groups
//               </button>

//               <button
//                 className={`rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors
//           ${
//             activeMainTab === "groupOrgs"
//               ? "border-b-2 bg-[#17414d] text-white group-hover:text-gray"
//               : "text-gray-600 hover:text-gray-800 bg-gray-100"
//           }`}
//                 onClick={() => setActiveMainTab("groupOrgs")}
//               >
//                 Group ↔ Orgs
//               </button>
//             </div>
//           </div>

//           {activeMainTab === "projectUsers" && renderProjectUsersTab()}
//           {activeMainTab === "userGroups" && renderUserGroupsTab()}
//           {activeMainTab === "groupOrgs" && renderGroupOrgsTab()}
//           {activeMainTab === "userOrgs" && renderUserOrgsTab()}
//           {/* {activeMainTab === "manageGroups" && renderManageGroupsTab()}
//       {activeMainTab === "manageUsers" && renderManageUsersTab()} */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserOrgProjectMapping;

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { useOutletContext } from "react-router-dom";
import { debounce } from "lodash";
import { Search, X } from "lucide-react";

const UserOrgProjectMapping = () => {
  // Global lists
  const [users, setUsers] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [groups, setGroups] = useState([]);
  const [projects, setProjects] = useState([]);

  // Select options
  // const [projectOptions, setProjectOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);

  // Selections per mode

  // ---- Mode 1: User -> Projects (single user, multiple projects) ----
  const [selectedUserIdForProjects, setSelectedUserIdForProjects] =
    useState("");
  // Rows currently shown in the table: mapped projects + any newly searched/added ones
  // ---------- Mode 1: User -> Projects ----------

  // Projects already mapped to the selected user from the database
  const [mappedProjectsForUser, setMappedProjectsForUser] = useState([]);

  // Snapshot of mappings that existed when the selected user was loaded.
  const [originalProjectsForUser, setOriginalProjectsForUser] = useState([]);

  // Projects selected in the current UI session.
  // This represents the final mapping that will be sent to the API.
  const [selectedProjectIdsForUser, setSelectedProjectIdsForUser] = useState(
    [],
  );

  const [pendingProjectIdsForUser, setPendingProjectIdsForUser] = useState([]);

  const [selectedUserIdForGroups, setSelectedUserIdForGroups] = useState("");
  const [selectedGroupsForUser, setSelectedGroupsForUser] = useState([]);

  const [selectedGroupIdForOrgs, setSelectedGroupIdForOrgs] = useState("");
  const [selectedOrgsForGroup, setSelectedOrgsForGroup] = useState([]);

  const [selectedUserIdForOrgs, setSelectedUserIdForOrgs] = useState("");
  const [selectedOrgsForUser, setSelectedOrgsForUser] = useState([]);

  // UI state
  const [activeMainTab, setActiveMainTab] = useState("projectUsers");
  // "projectUsers" | "userGroups" | "groupOrgs" | "userOrgs" | "manageGroups" | "manageUsers"

  const [searchTermGroups, setSearchTermGroups] = useState("");
  const [searchTermOrgs, setSearchTermOrgs] = useState("");
  const [searchTermUserOrgs, setSearchTermUserOrgs] = useState("");

  // Manage Groups form state
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [groupCodeInput, setGroupCodeInput] = useState("");
  const [groupNameInput, setGroupNameInput] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupFormLoading, setGroupFormLoading] = useState(false);

  // Manage Users form state
  const [editingUserId, setEditingUserId] = useState(null);
  const [userNameInput, setUserNameInput] = useState("");
  const [userFullNameInput, setUserFullNameInput] = useState("");
  const [userEmailInput, setUserEmailInput] = useState("");
  const [userFormLoading, setUserFormLoading] = useState(false);
  const [searchTermManageUsers, setSearchTermManageUsers] = useState("");
  const [selectedUserIdsForDelete, setSelectedUserIdsForDelete] = useState([]);
  const [userPasswordInput, setUserPasswordInput] = useState("");
  const [userRoleInput, setUserRoleInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [groupLoading, setGroupLoading] = useState(false);
  const [orgLoading, setOrgLoading] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingProjectDetailsForUser, setPendingProjectDetailsForUser] =
    useState([]);

  const [term, setTerm] = useState("");
  const [availableProjects, setAvailableProjects] = useState([]);

  const { visibility, canView, canEdit } = useOutletContext();

  const isEditable = canEdit("projectOrgSecurity");

  const lookupTake = import.meta.env.VITE_GET_PROJECT_MASTER_LOOKUP || 500;

  // ------------Manage Users------------
  const applyUserSorting = (userData) => {
    // newest (highest userId) first; adjust if you have createdAt
    return [...(userData || [])].sort(
      (a, b) => (b.userId ?? 0) - (a.userId ?? 0),
    );
  };

  const resetUserForm = () => {
    setEditingUserId(null);
    setUserNameInput("");
    setUserFullNameInput("");
    setUserEmailInput("");
    setUserPasswordInput("");
    setUserRoleInput("");
  };

  const startEditUser = (u) => {
    setEditingUserId(u.userId);
    setUserNameInput(u.username || "");
    setUserFullNameInput(u.fullName || "");
    setUserEmailInput(u.email || "");
    setUserPasswordInput(""); // typically not loaded back
    setUserRoleInput(u.role || "");
  };

  const toggleSelectedUserForDelete = (id) => {
    setSelectedUserIdsForDelete((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const areAllUsersSelected = (list) =>
    list.length > 0 &&
    list.every((u) => selectedUserIdsForDelete.includes(u.userId));

  const toggleSelectAllUsers = (list) => {
    if (areAllUsersSelected(list)) {
      setSelectedUserIdsForDelete([]);
    } else {
      setSelectedUserIdsForDelete(list.map((u) => u.userId));
    }
  };

  const handleCreateOrUpdateUser = async () => {
    if (!userNameInput.trim() || !userFullNameInput.trim()) {
      toast.warn("Username and full name are required.");
      return;
    }

    try {
      setUserFormLoading(true);

      if (editingUserId == null) {
        // CREATE
        await axios.post(`${backendUrl}/api/User`, {
          username: userNameInput.trim(),
          fullName: userFullNameInput.trim(),
          email: userEmailInput.trim(),
          password: userPasswordInput.trim(),
          role: userRoleInput.trim(),
        });
        toast.success("User created.");
      } else {
        // UPDATE
        await axios.put(`${backendUrl}/api/User/${editingUserId}`, {
          userId: editingUserId,
          username: userNameInput.trim(),
          fullName: userFullNameInput.trim(),
          email: userEmailInput.trim(),
          // optional: only send password if user entered something
          password: userPasswordInput.trim() || undefined,
          role: userRoleInput.trim(),
        });
        toast.success("User updated.");
      }

      const userRes = await axios.get(`${backendUrl}/api/User`);
      const userData = applyUserSorting(userRes.data);
      setUsers(userData);
      setUserOptions(
        userData.map((u) => ({
          value: u.userId,
          label: `${u.userId} - ${u.username || u.fullName || ""}`,
        })),
      );

      resetUserForm();
    } catch (e) {
      console.error("Save user failed", e);
      const apiMessage =
        e?.response?.data?.message ||
        e?.response?.data?.title ||
        (typeof e?.response?.data === "string" ? e.response.data : null);
      toast.error(apiMessage || "Failed to save user.");
    } finally {
      setUserFormLoading(false);
    }
  };

  const handleBulkDeleteUsers = async () => {
    if (selectedUserIdsForDelete.length === 0) {
      toast.warn("Select at least one user to delete.");
      return;
    }
    if (!window.confirm(`Delete ${selectedUserIdsForDelete.length} users?`)) {
      return;
    }

    try {
      setUserFormLoading(true);

      // bulk delete: body [1,2,...]
      await axios.post(
        `${backendUrl}/api/User/BulkDelete`,
        selectedUserIdsForDelete,
      );
      toast.success("Selected users deleted.");

      const userRes = await axios.get(`${backendUrl}/api/User`);
      const userData = applyUserSorting(userRes.data);
      setUsers(userData);
      setUserOptions(
        userData.map((u) => ({
          value: u.userId,
          label: `${u.userId} - ${u.username || u.fullName || ""}`,
        })),
      );
      setSelectedUserIdsForDelete([]);

      if (editingUserId && !userData.some((u) => u.userId === editingUserId)) {
        resetUserForm();
      }
    } catch (e) {
      console.error("Bulk delete users failed", e);
      const apiMessage =
        e?.response?.data?.message ||
        e?.response?.data?.title ||
        (typeof e?.response?.data === "string" ? e.response.data : null);
      if (apiMessage) {
        toast.error(apiMessage);
      } else {
        toast.error("Failed to delete selected users.");
      }
    } finally {
      setUserFormLoading(false);
    }
  };

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
          label: `${g.orgGroupCode} - ${g.orgGroupName || ""}`,
        })),
      );

      resetGroupForm();
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

  // ---------------------------------------------------------
  // Mode 1: User -> Projects — single search box
  // (same debounce / 4-char-minimum behaviour as before, since the
  // project list can be ~40k rows and can't be loaded eagerly).
  // Instead of a floating suggestions dropdown, matching projects are
  // rendered directly as extra rows at the bottom of the same table.
  // Checking one of those rows "confirms" it into the mapped list.
  // ---------------------------------------------------------

  // Checking a live-search row adds it to the persistent table + marks it selected
  // ---------- Project Mapping Helpers ----------

  const normalizeProjectId = (id) => String(id ?? "").trim();

  const isProjectSelected = (projectId) => {
    const normalizedId = normalizeProjectId(projectId);
    return selectedProjectIdsForUser.some(
      (id) => normalizeProjectId(id) === normalizedId,
    );
  };

  const isProjectAlreadyMapped = (projectId) => {
    const normalizedId = normalizeProjectId(projectId);
    return originalProjectsForUser.some(
      (project) => normalizeProjectId(project.projectId) === normalizedId,
    );
  };

  // Add a project from the search results to the current desired mapping.
  // Like ManageGroups, this changes the selected ID array; it does not
  // physically remove or move an original mapping row.
  const handleAddSearchProject = (projectId, name) => {
    const normalizedId = normalizeProjectId(projectId);
    if (!normalizedId || isProjectAlreadyMapped(normalizedId)) return;

    setSelectedProjectIdsForUser((prev) => {
      const exists = prev.some((id) => normalizeProjectId(id) === normalizedId);
      return exists ? prev : [...prev, projectId];
    });

    setPendingProjectIdsForUser((prev) => {
      const exists = prev.some((id) => normalizeProjectId(id) === normalizedId);
      return exists ? prev : [...prev, projectId];
    });

    setPendingProjectDetailsForUser((prev) => {
      const exists = prev.some(
        (project) => normalizeProjectId(project.projectId) === normalizedId,
      );
      return exists ? prev : [...prev, { projectId, name: name || "" }];
    });
  };

  const toggleProjectForUser = (projectId) => {
    const normalizedId = normalizeProjectId(projectId);

    setSelectedProjectIdsForUser((prev) => {
      const exists = prev.some((id) => normalizeProjectId(id) === normalizedId);

      return exists
        ? prev.filter((id) => normalizeProjectId(id) !== normalizedId)
        : [...prev, projectId];
    });
  };

  // Remove a newly searched project that has not been saved yet.
  const removePendingProject = (projectId) => {
    const normalizedId = normalizeProjectId(projectId);

    setPendingProjectIdsForUser((prev) =>
      prev.filter((id) => normalizeProjectId(id) !== normalizedId),
    );
    setPendingProjectDetailsForUser((prev) =>
      prev.filter(
        (project) => normalizeProjectId(project.projectId) !== normalizedId,
      ),
    );
    setSelectedProjectIdsForUser((prev) =>
      prev.filter((id) => normalizeProjectId(id) !== normalizedId),
    );
  };

  // Same array-based select-all logic used by ManageGroups.
  const toggleSelectAllAvailableProjects = (list) => {
    if (!isEditable || !list.length) return;

    const listIds = list.map((project) =>
      normalizeProjectId(project.projectId),
    );

    setSelectedProjectIdsForUser((prev) => {
      const prevIds = prev.map((id) => normalizeProjectId(id));
      const allSelected =
        listIds.length > 0 && listIds.every((id) => prevIds.includes(id));

      if (allSelected) {
        return prev.filter((id) => !listIds.includes(normalizeProjectId(id)));
      }

      const idsToAdd = list
        .filter((project) => {
          const id = normalizeProjectId(project.projectId);
          return id && !prevIds.includes(id);
        })
        .map((project) => project.projectId);

      return [...prev, ...idsToAdd];
    });

    setPendingProjectDetailsForUser((prev) => {
      const existingIds = new Set(
        prev.map((project) => normalizeProjectId(project.projectId)),
      );
      const originalIds = new Set(
        originalProjectsForUser.map((project) =>
          normalizeProjectId(project.projectId),
        ),
      );

      const additions = list
        .filter((project) => {
          const id = normalizeProjectId(project.projectId);
          return id && !originalIds.has(id) && !existingIds.has(id);
        })
        .map((project) => ({
          projectId: project.projectId,
          name: project.name || "",
        }));

      return [...prev, ...additions];
    });
  };

  // Original mappings remain in the right table when unchecked. The only
  // thing that changes is selectedProjectIdsForUser, exactly like ManageGroups.
  const toggleSelectAllMappedProjects = (list) => {
    if (!isEditable || !list.length) return;

    const listIds = list
      .map((project) => normalizeProjectId(project.projectId))
      .filter(Boolean);

    setSelectedProjectIdsForUser((prev) => {
      const prevIds = prev.map((id) => normalizeProjectId(id));
      const allSelected = listIds.every((id) => prevIds.includes(id));

      // IMPORTANT: only change the selected ID array.
      // Do NOT remove rows from mappedProjectsForUser/originalProjectsForUser.
      // That is what keeps an unchecked original row visible as "Unmapping",
      // exactly like ManageGroups.
      if (allSelected) {
        return prev.filter((id) => !listIds.includes(normalizeProjectId(id)));
      }

      const idsToAdd = list
        .filter(
          (project) => !prevIds.includes(normalizeProjectId(project.projectId)),
        )
        .map((project) => project.projectId);

      return [...prev, ...idsToAdd];
    });
  };

  const getCurrentUserContext = () => {
    try {
      const userString = localStorage.getItem("currentUser");

      if (!userString) {
        return {
          userId: "",
          role: "",
          fullName: "",
        };
      }

      const userObj = JSON.parse(userString);

      return {
        userId: userObj.userId ?? "",
        role: userObj.role?.toLowerCase() ?? "",
        fullName: userObj.fullName?.toLowerCase() ?? "",
      };
    } catch {
      return {
        userId: "",
        role: "",
        fullName: "",
      };
    }
  };

  const { userId, role } = getCurrentUserContext();

  const fetchAllProjects = useCallback(
    async (searchTerm) => {
      if (!searchTerm || searchTerm.length < 4) {
        setAvailableProjects([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const apiUrl =
          `${backendUrl}/Project/GetAllProjectsForSearchV3` +
          `?UserId=${userId}` +
          `&Role=${role}` +
          `&type=PROJECT` +
          `&ProjId=${encodeURIComponent(searchTerm)}` +
          `&take=${lookupTake}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const projects = await response.json();

        setAvailableProjects(Array.isArray(projects) ? projects : []);
      } catch (e) {
        console.error("Failed to load projects:", e);

        setError("Failed to load project list. Please try again.");

        setAvailableProjects([]);
      } finally {
        setLoading(false);
      }
    },
    [userId, role, lookupTake],
  );

  const debouncedFetchProjects = useMemo(
    () =>
      debounce((query) => {
        fetchAllProjects(query);
      }, 500),
    [fetchAllProjects],
  );

  useEffect(() => {
    return () => {
      debouncedFetchProjects.cancel();
    };
  }, [debouncedFetchProjects]);

  useEffect(() => {
    const searchTerm = term.trim();

    if (searchTerm.length >= 4) {
      setLoading(true);
      debouncedFetchProjects(searchTerm);
    } else {
      debouncedFetchProjects.cancel();

      setAvailableProjects([]);
      setLoading(false);
      setError(null);
    }
  }, [term, debouncedFetchProjects]);

  // ---------------------------------------------------------
  // Project Options (search suggestions to ADD to the table)
  // ---------------------------------------------------------

  const projectOptions = useMemo(() => {
    return availableProjects
      .map((project) => ({
        value: project?.projectId ?? "",
        label: project?.name
          ? `${project.projectId} - ${project.name}`
          : String(project?.projectId ?? ""),
      }))
      .sort((a, b) =>
        (a.label ?? "").localeCompare(b.label ?? "", undefined, {
          numeric: true,
          sensitivity: "base",
        }),
      );
  }, [availableProjects]);

  // ---------- Fetch base lists on mount ----------
  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        setProjectLoading(true);
        setUserLoading(true);
        setGroupLoading(true);
        setOrgLoading(true);

        // Projects
        // const projRes = await fetch(`${backendUrl}/Project/GetAllProjects`);
        // if (!projRes.ok) throw new Error("Project fetch failed");
        // const projData = await projRes.json();
        // setProjects(projData);
        // setProjectOptions(
        //   (projData || [])
        //     .map((p) => ({
        //       value: p.projectId || p.id || "",
        //       label: ` ${
        //         p.projectId || p.id || ""
        //       } - ${p.name || p.projectName || "Unnamed"}`,
        //     }))
        //     .sort((a, b) =>
        //       a.label.localeCompare(b.label, undefined, {
        //         numeric: true,
        //         sensitivity: "base",
        //       }),
        //     ),
        // );

        // Users
        const userRes = await axios.get(`${backendUrl}/api/User`);
        const userData = userRes.data || [];
        setUsers(userData);
        setUserOptions(
          userData.map((u) => ({
            value: u.userId,
            label: `${u.userId} - ${u.username || u.fullName || ""}`,
          })),
        );

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

        // Orgs
        const orgRes = await axios.get(`${backendUrl}/Orgnization/GetAllOrgs`);
        const orgData = orgRes.data || [];
        setOrgs(orgData);
      } catch (e) {
        console.error("Base data fetch failed", e);
        setError("Failed to load initial data.");
      } finally {
        setProjectLoading(false);
        setUserLoading(false);
        setGroupLoading(false);
        setOrgLoading(false);
      }
    };

    fetchBaseData();
  }, []);

  // Clears the search box (does not touch the selected user)
  const handleClearProjectSearch = () => {
    debouncedFetchProjects.cancel();

    setTerm("");
    setAvailableProjects([]);
    setError(null);
  };

  // ---------- Mode 1: User ↔ Projects ----------

  // Helper to normalize whatever shape the mapped-projects API returns
  const normalizeMappedProjects = (data) => {
    const list = Array.isArray(data) ? data : [];
    return list.map((p) =>
      typeof p === "object" && p !== null
        ? {
            projectId: p.projectId ?? p.projId ?? p.id ?? "",
            name: p.name ?? p.projName ?? "",
          }
        : { projectId: p, name: "" },
    );
  };

  useEffect(() => {
    // Reset search and pending state whenever the target user changes
    setTerm("");
    setAvailableProjects([]);
    setError(null);
    setPendingProjectIdsForUser([]);
    setPendingProjectDetailsForUser([]);

    if (!selectedUserIdForProjects) {
      setMappedProjectsForUser([]);
      setOriginalProjectsForUser([]);
      setSelectedProjectIdsForUser([]);
      return;
    }

    const fetchProjectsForUser = async () => {
      setProjectLoading(true);

      try {
        const res = await axios.get(
          `${backendUrl}/api/user-projects/projects/${selectedUserIdForProjects}`,
        );

        const normalized = normalizeMappedProjects(res.data);

        setMappedProjectsForUser(normalized);
        setOriginalProjectsForUser(normalized);

        // Initially, all database mappings are selected.
        setSelectedProjectIdsForUser(
          normalized.map((project) => project.projectId),
        );
      } catch (e) {
        console.error("Fetch mapped projects for user failed", e);

        setMappedProjectsForUser([]);
        setSelectedProjectIdsForUser([]);
      } finally {
        setProjectLoading(false);
      }
    };

    fetchProjectsForUser();
  }, [selectedUserIdForProjects]);

  const saveUserProjects = async () => {
    if (!selectedUserIdForProjects) {
      toast.warn("Select a user first.");
      return;
    }

    try {
      setLoading(true);

      // Capture the mappings that existed before Update. Any original project
      // that is no longer selected is the project being unmapped.
      const selectedIds = new Set(
        selectedProjectIdsForUser.map((id) => normalizeProjectId(id)),
      );
      const removedProjects = originalProjectsForUser.filter(
        (project) => !selectedIds.has(normalizeProjectId(project.projectId)),
      );

      // Keep the API contract EXACTLY as requested. An unchecked project is
      // therefore omitted from projIds and will be unmapped by bulk-sync.
      await axios.post(`${backendUrl}/api/user-projects/bulk-sync`, {
        projIds: selectedProjectIdsForUser,
        userIds: [selectedUserIdForProjects],
      });

      // IMPORTANT: do not immediately GET the mapped projects here.
      // The UI must commit the user's selectedProjectIdsForUser state first.
      // Otherwise an API that returns the previous mapping can put an
      // unchecked project straight back into the right table as "Mapped".
      // After a successful bulk-sync, the selected IDs ARE the new mapping.
      const savedProjects = projectMappingRows.filter((project) =>
        selectedIds.has(normalizeProjectId(project.projectId)),
      );

      setMappedProjectsForUser(savedProjects);
      setOriginalProjectsForUser(savedProjects);
      setSelectedProjectIdsForUser(
        savedProjects.map((project) => project.projectId),
      );

      // Anything that was originally mapped but was unchecked is now
      // unmapped. Move those rows to Available Projects immediately after
      // Update so they no longer appear on the right.
      if (removedProjects.length > 0) {
        setAvailableProjects((prev) => {
          const merged = [...prev, ...removedProjects];
          const seen = new Set();

          return merged.filter((project) => {
            const id = normalizeProjectId(
              project?.projectId ?? project?.projId ?? project?.id,
            );
            if (!id || seen.has(id)) return false;
            seen.add(id);
            return true;
          });
        });
      }

      setPendingProjectIdsForUser([]);
      setPendingProjectDetailsForUser([]);

      toast.success("User ↔ Projects mapping updated.");
    } catch (e) {
      console.error("Save user-projects failed", e);
      const apiMessage =
        e?.response?.data?.message ||
        e?.response?.data?.title ||
        (typeof e?.response?.data === "string" ? e.response.data : null);
      toast.error(apiMessage || "Failed to update user-projects mapping.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Mode 2: User ↔ Groups ----------
  useEffect(() => {
    if (!selectedUserIdForGroups) {
      setSelectedGroupsForUser([]);
      return;
    }

    const fetchGroupsForUser = async () => {
      setGroupLoading(true);
      try {
        const res = await axios.get(
          `${backendUrl}/api/user-projects/Groups/${selectedUserIdForGroups}`,
        );
        const mappedGroups = res.data || [];
        const mappedIds = Array.isArray(mappedGroups)
          ? mappedGroups.map((g) => (typeof g === "object" ? g.orgGroupId : g))
          : [];
        setSelectedGroupsForUser(mappedIds);
      } catch (e) {
        console.error("Fetch groups for user failed", e);
        setSelectedGroupsForUser([]);
      } finally {
        setGroupLoading(false);
      }
    };

    fetchGroupsForUser();
  }, [selectedUserIdForGroups]);

  const filteredGroupsForUser = groups.filter((g) =>
    `${g.orgGroupId} ${g.orgGroupName || ""}`
      .toLowerCase()
      .includes(searchTermGroups.toLowerCase()),
  );
  const sortedGroupsForUser = [...filteredGroupsForUser].sort((a, b) => {
    const aSel = selectedGroupsForUser.includes(a.orgGroupId);
    const bSel = selectedGroupsForUser.includes(b.orgGroupId);
    if (aSel === bSel) return 0;
    return aSel ? -1 : 1;
  });

  const toggleGroupForUser = (orgGroupId) => {
    setSelectedGroupsForUser((prev) =>
      prev.includes(orgGroupId)
        ? prev.filter((id) => id !== orgGroupId)
        : [...prev, orgGroupId],
    );
  };

  const saveUserGroups = async () => {
    if (!selectedUserIdForGroups) {
      toast.warn("Select a user first.");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${backendUrl}/api/user-projects/BulkSyncUsersGroups`, {
        userId: selectedUserIdForGroups,
        groupIds: selectedGroupsForUser,
      });
      toast.success("User ↔ Groups mapping updated.");

      const res = await axios.get(
        `${backendUrl}/api/user-projects/Groups/${selectedUserIdForGroups}`,
      );
      const mappedGroups = res.data || [];
      const mappedIds = Array.isArray(mappedGroups)
        ? mappedGroups.map((g) => (typeof g === "object" ? g.orgGroupId : g))
        : [];
      setSelectedGroupsForUser(mappedIds);
    } catch (e) {
      console.error("Save user-groups failed", e);
      toast.error("Failed to update user-groups mapping.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Mode 3: Group ↔ Orgs ----------
  useEffect(() => {
    if (!selectedGroupIdForOrgs) {
      setSelectedOrgsForGroup([]);
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
      } catch (e) {
        console.error("Fetch orgs for group failed", e);
        setSelectedOrgsForGroup([]);
      } finally {
        setOrgLoading(false);
      }
    };

    fetchOrgsForGroup();
  }, [selectedGroupIdForOrgs]);

  const filteredOrgsForGroup = orgs.filter((o) =>
    `${o.orgId} ${o.orgName || ""}`
      .toLowerCase()
      .includes(searchTermOrgs.toLowerCase()),
  );
  const sortedOrgsForGroup = [...filteredOrgsForGroup].sort((a, b) => {
    const aSel = selectedOrgsForGroup.includes(a.orgId);
    const bSel = selectedOrgsForGroup.includes(b.orgId);
    if (aSel === bSel) return 0;
    return aSel ? -1 : 1;
  });

  const toggleOrgForGroup = (orgId) => {
    setSelectedOrgsForGroup((prev) =>
      prev.includes(orgId)
        ? prev.filter((id) => id !== orgId)
        : [...prev, orgId],
    );
  };

  const toggleSelectAllOrgsForGroup = (list) => {
    const ids = list.map((o) => o.orgId);
    const allSelected =
      ids.length > 0 && ids.every((id) => selectedOrgsForGroup.includes(id));

    setSelectedOrgsForGroup((prev) =>
      allSelected
        ? prev.filter((id) => !ids.includes(id))
        : [...new Set([...prev, ...ids])],
    );
  };

  const saveGroupOrgs = async () => {
    if (!selectedGroupIdForOrgs) {
      toast.warn("Select a group first.");
      return;
    }
    try {
      setLoading(true);
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
    } catch (e) {
      console.error("Save group-orgs failed", e);
      toast.error("Failed to update group-orgs mapping.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Mode 4: User ↔ Orgs ----------
  useEffect(() => {
    if (!selectedUserIdForOrgs) {
      setSelectedOrgsForUser([]);
      return;
    }

    const fetchOrgsForUser = async () => {
      setOrgLoading(true);
      try {
        const res = await axios.get(
          `${backendUrl}/api/user-projects/Orgs/${selectedUserIdForOrgs}`,
        );
        const mappedOrgs = res.data || [];
        const mappedIds = Array.isArray(mappedOrgs)
          ? mappedOrgs.map((o) => (typeof o === "object" ? o.orgId : o))
          : [];
        setSelectedOrgsForUser(mappedIds);
      } catch (e) {
        console.error("Fetch orgs for user failed", e);
        setSelectedOrgsForUser([]);
      } finally {
        setOrgLoading(false);
      }
    };

    fetchOrgsForUser();
  }, [selectedUserIdForOrgs]);

  const filteredOrgsForUser = orgs.filter((o) =>
    `${o.orgId} ${o.orgName || ""}`
      .toLowerCase()
      .includes(searchTermUserOrgs.toLowerCase()),
  );
  const sortedOrgsForUser = [...filteredOrgsForUser].sort((a, b) => {
    const aSel = selectedOrgsForUser.includes(a.orgId);
    const bSel = selectedOrgsForUser.includes(b.orgId);
    if (aSel === bSel) return 0;
    return aSel ? -1 : 1;
  });

  const toggleOrgForUser = (orgId) => {
    setSelectedOrgsForUser((prev) =>
      prev.includes(orgId)
        ? prev.filter((id) => id !== orgId)
        : [...prev, orgId],
    );
  };

  const saveUserOrgs = async () => {
    if (!selectedUserIdForOrgs) {
      toast.warn("Select a user first.");
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${backendUrl}/api/user-projects/BulkSyncUsersOrgs`, {
        userId: selectedUserIdForOrgs,
        orgIds: selectedOrgsForUser,
      });
      toast.success("User ↔ Orgs mapping updated.");

      const res = await axios.get(
        `${backendUrl}/api/user-projects/Orgs/${selectedUserIdForOrgs}`,
      );
      const mappedOrgs = res.data || [];
      const mappedIds = Array.isArray(mappedOrgs)
        ? mappedOrgs.map((o) => (typeof o === "object" ? o.orgId : o))
        : [];
      setSelectedOrgsForUser(mappedIds);
    } catch (e) {
      console.error("Save user-orgs failed", e);
      toast.error("Failed to update user-orgs mapping.");
    } finally {
      setLoading(false);
    }
  };

  const getProjectLevel = (projectId = "") => {
    if (!projectId) return 0;
    const parts = projectId.split(".").filter(Boolean);
    return parts.length;
  };

  // Optional: Helper function to get the parent prefix (e.g., 'CA.01' -> 'CA')
  const getParentProjectId = (projectId = "") => {
    if (!projectId) return "";
    const parts = projectId.split(".").filter(Boolean);
    if (parts.length <= 1) return "";
    return parts.slice(0, -1).join(".");
  };

  // ---------Manage Groups------------
  const renderManageGroupsTab = () => {
    const filteredGroups = groups.filter((g) =>
      `${g.orgGroupId} ${g.orgGroupCode || ""} ${g.orgGroupName || ""}`
        .toLowerCase()
        .includes(searchTermGroups.toLowerCase()),
    );

    const allSelected = areAllGroupsSelected(filteredGroups);

    return (
      <>
        <div className="mb-6 bg-gray-50 p-4 rounded-xl border">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {editingGroupId ? "Edit Group" : "Create Group"}
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Group Code
              </label>
              <input
                type="text"
                value={groupCodeInput}
                onChange={(e) => setGroupCodeInput(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="Group code"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Group Name
              </label>
              <input
                type="text"
                value={groupNameInput}
                onChange={(e) => setGroupNameInput(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="Group name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Description
              </label>
              <input
                type="text"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="Description"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-4">
            {editingGroupId && (
              <button
                type="button"
                onClick={resetGroupForm}
                className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 bg-white"
                disabled={groupFormLoading}
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleCreateOrUpdateGroup}
              className="px-5 py-2 text-sm rounded bg-[#17414d] text-white group-hover:text-gray font-semibold disabled:opacity-60"
              disabled={groupFormLoading}
            >
              {groupFormLoading
                ? "Saving..."
                : editingGroupId
                  ? "Update Group"
                  : "Create Group"}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Existing Groups
            </h3>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search by id, code, name..."
                value={searchTermGroups}
                onChange={(e) => setSearchTermGroups(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm w-64"
              />
              <button
                type="button"
                onClick={handleBulkDeleteGroups}
                className="px-4 py-2 text-xs rounded  disabled:opacity-50 bg-red-600 text-white"
                disabled={
                  groupFormLoading || selectedGroupIdsForDelete.length === 0
                }
              >
                Delete({selectedGroupIdsForDelete.length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-80">
            <table className="w-full text-sm">
              <thead className="thead">
                <tr className="bg-white border-b">
                  <th className="px-3 py-2 text-left text-gray-500 text-xs w-10">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={allSelected}
                      onChange={() => toggleSelectAllGroups(filteredGroups)}
                    />
                  </th>
                  {/* <th className="px-3 py-2 text-left text-gray-500 text-xs">
                  ID
                </th> */}
                  <th className="px-3 py-2 text-left text-gray-500 text-xs">
                    Code
                  </th>
                  <th className="px-3 py-2 text-left text-gray-500 text-xs">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left text-gray-500 text-xs">
                    Description
                  </th>
                  <th className="px-3 py-2 text-right text-gray-500 text-xs">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredGroups.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
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
                      <tr key={g.orgGroupId} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={selected}
                            onChange={() =>
                              toggleSelectedGroupForDelete(g.orgGroupId)
                            }
                          />
                        </td>
                        {/* <td className="px-3 py-2">{g.orgGroupId}</td> */}
                        <td className="px-3 py-2">{g.orgGroupCode}</td>
                        <td className="px-3 py-2">{g.orgGroupName}</td>
                        <td className="px-3 py-2">{g.description}</td>
                        <td className="px-3 py-2 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => startEditGroup(g)}
                            className="text-xs px-3 py-1 rounded border border-blue-500 text-blue-600"
                          >
                            Edit
                          </button>
                          {/* <button
                          type="button"
                          onClick={() => handleDeleteGroup(g)}
                          className="text-xs px-3 py-1 rounded border border-red-500 text-red-600"
                        >
                          Delete
                        </button> */}
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

  // ----- user tabs--------
  const renderManageUsersTab = () => {
    const filteredUsers = users.filter((u) =>
      `${u.userId} ${u.username || ""} ${u.fullName || ""} ${u.email || ""}`
        .toLowerCase()
        .includes(searchTermManageUsers.toLowerCase()),
    );

    const allSelected = areAllUsersSelected(filteredUsers);

    return (
      <>
        <div className="mb-6 bg-gray-50 p-4 rounded-xl border">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 ">
            {editingUserId ? "Edit User" : "Create User"}
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Username
              </label>
              <input
                type="text"
                value={userNameInput}
                onChange={(e) => setUserNameInput(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={userFullNameInput}
                onChange={(e) => setUserFullNameInput(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                value={userEmailInput}
                onChange={(e) => setUserEmailInput(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                value={userPasswordInput}
                onChange={(e) => setUserPasswordInput(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Role
              </label>
              <select
                value={userRoleInput}
                onChange={(e) => setUserRoleInput(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                {/* <option value="manager">Manager</option> */}
                <option value="user">User</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-4">
            {editingUserId && (
              <button
                type="button"
                onClick={resetUserForm}
                className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 bg-white"
                disabled={userFormLoading}
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleCreateOrUpdateUser}
              className="px-5 py-2 text-sm rounded bg-[#17414d] text-white group-hover:text-gray  font-semibold disabled:opacity-60"
              disabled={userFormLoading}
            >
              {userFormLoading
                ? "Saving..."
                : editingUserId
                  ? "Update User"
                  : "Create User"}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Existing Users
            </h3>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search by id, username, name, email..."
                value={searchTermManageUsers}
                onChange={(e) => setSearchTermManageUsers(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm w-64"
              />
              <button
                type="button"
                onClick={handleBulkDeleteUsers}
                className="px-4 py-2 text-xs rounded border border-red-500 text-red-600 disabled:opacity-50"
                disabled={
                  userFormLoading || selectedUserIdsForDelete.length === 0
                }
              >
                Delete Selected ({selectedUserIdsForDelete.length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-80">
            <table className="w-full text-sm">
              <thead className="thead">
                <tr className="bg-white border-b">
                  <th className="px-3 py-2 text-left text-gray-500 text-xs w-10">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={allSelected}
                      onChange={() => toggleSelectAllUsers(filteredUsers)}
                    />
                  </th>
                  <th className="px-3 py-2 text-left text-gray-500 text-xs">
                    ID
                  </th>
                  <th className="px-3 py-2 text-left text-gray-500 text-xs">
                    Username
                  </th>
                  <th className="px-3 py-2 text-left text-gray-500 text-xs">
                    Full Name
                  </th>
                  <th className="px-3 py-2 text-left text-gray-500 text-xs">
                    Email
                  </th>
                  <th className="px-3 py-2 text-right text-gray-500 text-xs">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-6 text-center text-gray-500"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const selected = selectedUserIdsForDelete.includes(
                      u.userId,
                    );
                    return (
                      <tr key={u.userId} className="hover:bg-gray-50">
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={selected}
                            onChange={() =>
                              toggleSelectedUserForDelete(u.userId)
                            }
                          />
                        </td>
                        <td className="px-3 py-2">{u.userId}</td>
                        <td className="px-3 py-2">{u.username}</td>
                        <td className="px-3 py-2">{u.fullName}</td>
                        <td className="px-3 py-2">{u.email}</td>
                        <td className="px-3 py-2 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => startEditUser(u)}
                            className="text-xs px-3 py-1 rounded border border-blue-500 text-blue-600"
                          >
                            Edit
                          </button>
                          {/* <button
                          type="button"
                          onClick={() => handleBulkDeleteUsers([u.userId])}
                          className="text-xs px-3 py-1 rounded border border-red-500 text-red-600"
                        >
                          Delete
                        </button> */}
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

  // ---------- Render helpers ----------

  const searchProjectRows = useMemo(() => {
    const originalIds = new Set(
      originalProjectsForUser.map((project) =>
        normalizeProjectId(project.projectId),
      ),
    );
    const selectedIds = new Set(
      selectedProjectIdsForUser.map((id) => normalizeProjectId(id)),
    );

    return availableProjects
      .map((project) => ({
        projectId: project?.projectId ?? project?.projId ?? project?.id ?? "",
        name: project?.name ?? project?.projName ?? "",
      }))
      .filter((project) => {
        const id = normalizeProjectId(project.projectId);
        return id && !originalIds.has(id) && !selectedIds.has(id);
      })
      .sort((a, b) =>
        `${a.projectId} ${a.name}`.localeCompare(
          `${b.projectId} ${b.name}`,
          undefined,
          { numeric: true, sensitivity: "base" },
        ),
      );
  }, [availableProjects, originalProjectsForUser, selectedProjectIdsForUser]);

  const projectMappingRows = useMemo(() => {
    // EXACT ManageGroups-style model:
    // keep every project that was originally mapped OR is currently selected
    // in the right table. Unchecking an original mapping therefore changes
    // only its status to "Unmapping"; it does not remove the row.
    const ids = Array.from(
      new Set([
        ...originalProjectsForUser.map((project) =>
          normalizeProjectId(project.projectId),
        ),
        ...selectedProjectIdsForUser.map((id) => normalizeProjectId(id)),
      ]),
    ).filter(Boolean);

    const details = new Map();

    // Existing mappings have priority.
    [
      ...originalProjectsForUser,
      ...pendingProjectDetailsForUser,
      ...availableProjects,
    ].forEach((project) => {
      const projectId =
        project?.projectId ?? project?.projId ?? project?.id ?? "";
      const id = normalizeProjectId(projectId);
      if (id && !details.has(id)) {
        details.set(id, {
          projectId,
          name: project?.name ?? project?.projName ?? "",
        });
      }
    });

    return ids.map((id) => details.get(id)).filter(Boolean);
  }, [
    originalProjectsForUser,
    selectedProjectIdsForUser,
    pendingProjectDetailsForUser,
    availableProjects,
  ]);

  // ---------- Mode 1: User ↔ Projects ----------

  const renderProjectUsersTab = () => {
    // --- Level Filter State (All, Level 1 / Parent, Level 2 / Child, etc.) ---
    const [selectedLevelFilter, setSelectedLevelFilter] = useState("ALL"); // 'ALL' | 'L1' | 'L2' | 'L3+'

    // --- Filtered Search Results (Left Table) ---
    const filteredAvailableProjects = useMemo(() => {
      if (!term || term.trim().length < 4) return [];

      const lowerTerm = term.trim().toLowerCase();

      return availableProjects.filter((project) => {
        const pId = String(project.projectId || "").toLowerCase();
        const pName = String(project.name || "").toLowerCase();

        // 1. Term Search Matching (Project ID or Name)
        const matchesSearch =
          pId.includes(lowerTerm) || pName.includes(lowerTerm);
        if (!matchesSearch) return false;

        // 2. Level Filter Matching
        const level = getProjectLevel(project.projectId);
        if (selectedLevelFilter === "L1") return level === 1; // e.g. "CA"
        if (selectedLevelFilter === "L2") return level === 2; // e.g. "CA.01"
        if (selectedLevelFilter === "L3") return level >= 3; // e.g. "CA.01.001"

        return true; // 'ALL'
      });
    }, [availableProjects, term, selectedLevelFilter]);

    // Assign to searchProjectRows used in table
    const searchProjectRows = filteredAvailableProjects;

    return (
      <>
        {/* User Selection + Search */}
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            {/* User Select */}
            <div className="flex items-center gap-2 w-full sm:w-[420px]">
              <label
                htmlFor="userForProjects"
                className="input-label mb-1 block"
              >
                User <span className="text-red-500 ml-1">*</span>
              </label>

              <Select
                inputId="userForProjects"
                options={userOptions}
                isLoading={userLoading}
                className="outline-none w-full"
                value={
                  selectedUserIdForProjects
                    ? userOptions.find(
                        (o) => o.value === selectedUserIdForProjects,
                      )
                    : null
                }
                onChange={(opt) =>
                  setSelectedUserIdForProjects(opt ? opt.value : "")
                }
                isSearchable
                placeholder="Search & select a user"
              />
            </div>
          </div>

          {/* Project Search + Level Filter Bar */}
          {selectedUserIdForProjects && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label
                htmlFor="projectSearch"
                className="input-label whitespace-nowrap"
              >
                Search Projects
              </label>

              <div className="relative w-full max-w-md">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                />

                <input
                  id="projectSearch"
                  type="text"
                  className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-full !pl-9 !pr-9"
                  placeholder="Search Project ID or Name..."
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  autoComplete="off"
                />

                {/* Clear */}
                {term && !loading && (
                  <button
                    type="button"
                    onClick={handleClearProjectSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                    title="Clear"
                  >
                    <X size={15} />
                  </button>
                )}

                {/* Loading */}
                {loading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                  </div>
                )}
              </div>

              {/* LEVEL HIERARCHY FILTER DROPDOWN */}
              <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                <label className="text-xs font-medium text-gray-600">
                  Level Filter:
                </label>
                <select
                  value={selectedLevelFilter}
                  onChange={(e) => setSelectedLevelFilter(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1.5 text-xs bg-white outline-none focus:border-blue-500"
                >
                  <option value="ALL">All Levels</option>
                  <option value="L1">Top Level</option>
                  <option value="L2">Level 2</option>
                  <option value="L3">Level 3+</option>
                </select>
              </div>

              {error && (
                <p className="mt-1 w-full text-[11px] text-red-500">{error}</p>
              )}
            </div>
          )}
        </div>

        {/* Two Project Tables */}
        <div className="rounded mb-4 px-4">
          <div className="flex items-center gap-x-4 mb-2">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Project Mapping
              </h3>
            </div>

            {selectedUserIdForProjects && (
              <div className="flex flex-1 justify-end">
                {isEditable && (
                  <button
                    onClick={saveUserProjects}
                    disabled={!selectedUserIdForProjects || loading}
                    className="bg-[#17414d] btn1 btn-blue disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* LEFT TABLE - SEARCH RESULTS */}
            <div className="border border-gray-300 rounded overflow-hidden">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-300 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900">
                  Available Projects
                </h4>

                <span className="text-[11px] text-gray-500">
                  {searchProjectRows.length} found
                </span>
              </div>

              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-sm">
                  <thead className="thead">
                    <tr className="bg-white border-b border-gray-300">
                      <th className="th-thead w-10 text-center text-black text-xs">
                        <input
                          type="checkbox"
                          className="w-3 h-3"
                          checked={
                            searchProjectRows.length > 0 &&
                            searchProjectRows.every((project) =>
                              isProjectSelected(project.projectId),
                            )
                          }
                          onChange={() =>
                            toggleSelectAllAvailableProjects(searchProjectRows)
                          }
                          disabled={
                            !isEditable || searchProjectRows.length === 0
                          }
                        />
                      </th>

                      <th className="th-thead text-left text-black text-xs">
                        Project ID
                      </th>

                      <th className="th-thead text-left text-black text-xs">
                        Project Name
                      </th>

                      {/* <th className="th-thead text-center text-black text-xs">
                        Level
                      </th> */}
                    </tr>
                  </thead>

                  <tbody>
                    {!selectedUserIdForProjects ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-6 text-center text-gray-500"
                        >
                          Select a user to search projects.
                        </td>
                      </tr>
                    ) : loading ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-6 text-center text-gray-500"
                        >
                          Searching projects...
                        </td>
                      </tr>
                    ) : term.trim().length < 4 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-6 text-center text-gray-500"
                        >
                          Type at least 4 characters to search.
                        </td>
                      </tr>
                    ) : searchProjectRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-6 text-center text-gray-500"
                        >
                          No available projects found matching filter.
                        </td>
                      </tr>
                    ) : (
                      searchProjectRows.map((project) => {
                        const level = getProjectLevel(project.projectId);
                        const isSelected = isProjectSelected(project.projectId);

                        return (
                          <tr
                            key={project.projectId}
                            className="hover:bg-gray-50"
                          >
                            <td className="tbody-td text-center">
                              <input
                                type="checkbox"
                                className="w-3 h-3"
                                checked={isSelected}
                                onChange={() =>
                                  handleAddSearchProject(
                                    project.projectId,
                                    project.name,
                                  )
                                }
                                disabled={!isEditable}
                              />
                            </td>

                            <td className="tbody-td font-medium">
                              {project.projectId}
                            </td>

                            <td className="tbody-td">{project.name || "-"}</td>

                            {/* <td className="tbody-td text-center">
                              <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                                L{level}
                              </span>
                            </td> */}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT TABLE - CURRENT MAPPING */}
            <div className="border border-gray-300 rounded overflow-hidden">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-300 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900">
                  User's Project Mapping
                </h4>

                <span className="text-[11px] text-gray-500">
                  {projectMappingRows.length} projects
                </span>
              </div>

              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-sm">
                  <thead className="thead">
                    <tr className="bg-white border-b border-gray-300">
                      <th className="th-thead w-10 text-center text-black text-xs">
                        <input
                          type="checkbox"
                          className="w-3 h-3"
                          checked={
                            projectMappingRows.length > 0 &&
                            projectMappingRows.every((project) =>
                              isProjectSelected(project.projectId),
                            )
                          }
                          onChange={() =>
                            toggleSelectAllMappedProjects(projectMappingRows)
                          }
                          disabled={
                            !isEditable || projectMappingRows.length === 0
                          }
                        />
                      </th>

                      <th className="th-thead text-left text-black text-xs">
                        Project ID
                      </th>

                      <th className="th-thead text-left text-black text-xs">
                        Project Name
                      </th>

                      <th className="th-thead text-left text-black text-xs">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {!selectedUserIdForProjects ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-6 text-center text-gray-500"
                        >
                          Select a user to view project mappings.
                        </td>
                      </tr>
                    ) : projectLoading ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-6 text-center text-gray-500"
                        >
                          Loading mapped projects...
                        </td>
                      </tr>
                    ) : projectMappingRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-6 text-center text-gray-500"
                        >
                          No projects mapped yet.
                        </td>
                      </tr>
                    ) : (
                      projectMappingRows.map((project) => {
                        const projectId = project.projectId;
                        const normalizedId = normalizeProjectId(projectId);
                        const wasMapped = originalProjectsForUser.some(
                          (original) =>
                            normalizeProjectId(original.projectId) ===
                            normalizedId,
                        );
                        const isSelected = isProjectSelected(projectId);
                        const status =
                          wasMapped && isSelected
                            ? "Mapped"
                            : wasMapped && !isSelected
                              ? "Unmapping"
                              : "New Mapping";

                        return (
                          <tr key={projectId} className="hover:bg-gray-50">
                            <td className="tbody-td text-center">
                              <input
                                type="checkbox"
                                className="w-3 h-3"
                                checked={isSelected}
                                onChange={() => toggleProjectForUser(projectId)}
                                disabled={!isEditable}
                              />
                            </td>

                            <td className="tbody-td font-medium">
                              {projectId}
                            </td>

                            <td className="tbody-td">{project.name || "-"}</td>

                            <td className="tbody-td">
                              <span
                                className={`text-[10px] font-medium rounded px-1.5 py-0.5 border ${
                                  status === "Mapped"
                                    ? "text-green-600 bg-green-50 border-green-200"
                                    : status === "Unmapping"
                                      ? "text-orange-600 bg-orange-50 border-orange-200"
                                      : "text-blue-600 bg-blue-50 border-blue-200"
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
      </>
    );
  };
  useEffect(() => {
    if (users && users.length > 0) {
      // Filter out roles that are classified as "admin"
      const filteredUsers = users.filter(
        (u) => !u.role || u.role.toLowerCase() !== "admin",
      );

      const options = filteredUsers.map((u) => ({
        value: u.userId,
        label: `${u.username || ""} (${u.fullName})`,
      }));
      setUserOptions(options);
    } else {
      setUserOptions([]);
    }
  }, [users]);

  const renderUserGroupsTab = () => (
    <>
      {/* User select row (match Project design) */}
      <div className="mb-2 rounded flex items-center gap-x-4 w-full">
        <label className="input-label">
          User <span className="text-red-500">*</span>
        </label>
        <Select
          options={userOptions}
          isLoading={userLoading}
          className="outline-none w-[40%]"
          value={
            selectedUserIdForGroups
              ? userOptions.find((o) => o.value === selectedUserIdForGroups)
              : null
          }
          onChange={(opt) => setSelectedUserIdForGroups(opt ? opt.value : "")}
          isSearchable
          placeholder="Search & select a user"
        />
      </div>

      {/* Groups section */}
      <div className="rounded mb-4">
        <div className="flex items-center gap-x-4 mb-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Groups for user
            </h3>
            {/* <span className="text-sm text-blue-600">
              {selectedGroupsForUser.length} selected
            </span> */}
          </div>

          {selectedUserIdForGroups && (
            <>
              {/* <div> */}
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={searchTermGroups}
                  onChange={(e) => setSearchTermGroups(e.target.value)}
                  className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner"
                />
              </div>
              <div className="flex flex-1 justify-end">
                {isEditable && (
                  <button
                    onClick={saveUserGroups}
                    disabled={!selectedUserIdForGroups || loading}
                    className="bg-[#17414d] btn1 btn-blue disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <div className="overflow-x-auto max-h-80 border border-gray-300 rounded">
          <table className="w-full text-sm">
            <thead className="thead">
              <tr className="bg-white border-b border-gray-300">
                <th className="th-thead w-10 text-left text-black text-xs">
                  Select
                </th>
                <th className="th-thead text-left text-black text-xs">
                  Group ID
                </th>
                <th className="th-thead text-left text-black text-xs">
                  Group Name
                </th>
              </tr>
            </thead>
            <tbody>
              {!selectedUserIdForGroups ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    Select a user to view groups.
                  </td>
                </tr>
              ) : groupLoading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    Loading groups...
                  </td>
                </tr>
              ) : sortedGroupsForUser.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    No groups found.
                  </td>
                </tr>
              ) : (
                sortedGroupsForUser.map((g) => {
                  const selected = selectedGroupsForUser.includes(g.orgGroupId);
                  return (
                    <tr key={g.orgGroupId} className="hover:bg-gray-50">
                      <td className="tbody-td">
                        <input
                          type="checkbox"
                          className="w-3 h-3"
                          checked={selected}
                          onChange={() => toggleGroupForUser(g.orgGroupId)}
                        />
                      </td>
                      <td className="tbody-td">{g.orgGroupId}</td>
                      <td className="tbody-td">{g.orgGroupName || "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* <div className="flex justify-end">
        <button
          onClick={saveUserGroups}
          disabled={!selectedUserIdForGroups || loading}
          className="bg-[#17414d] btn1 btn-blue disabled:opacity-60"
        >
          {loading ? "Saving..." : "Update User ↔ Groups"}
        </button>
      </div> */}
    </>
  );

  const renderGroupOrgsTab = () => (
    <>
      {/* Group select row (match Project design) */}
      <div className="mb-2 rounded flex items-center gap-x-4 w-full">
        <label className="input-label">
          Group <span className="text-red-500">*</span>
        </label>
        <Select
          options={groupOptions}
          isLoading={groupLoading}
          className="outline-none w-[40%]"
          value={
            selectedGroupIdForOrgs
              ? groupOptions.find((o) => o.value === selectedGroupIdForOrgs)
              : null
          }
          onChange={(opt) => setSelectedGroupIdForOrgs(opt ? opt.value : "")}
          isSearchable
          placeholder="Search & select a group"
        />
      </div>

      {/* Orgs section */}
      <div className="rounded mb-4">
        <div className="flex items-center gap-x-4 mb-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Organizations for group
            </h3>
            {/* <span className="text-sm text-blue-600">
            {selectedOrgsForGroup.length} selected
          </span> */}
          </div>

          {selectedGroupIdForOrgs && (
            <>
              <div className="flex items-center gap-x-3">
                <label className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                  Search Organizations
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search organizations..."
                    value={searchTermOrgs}
                    onChange={(e) => setSearchTermOrgs(e.target.value)}
                    className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner"
                  />
                </div>
              </div>
              <div className="flex flex-1 justify-end">
                {isEditable && (
                  <button
                    onClick={saveGroupOrgs}
                    disabled={!selectedGroupIdForOrgs || loading}
                    className="bg-[#17414d] btn1 btn-blue disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Update Group ↔ Orgs"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <div className="overflow-x-auto max-h-80 border border-gray-300 rounded">
          <table className="w-full text-sm">
            <thead className="thead">
              <tr className="bg-white border-b border-gray-300">
                <th className="th-thead w-10 text-center text-black text-xs">
                  <input
                    type="checkbox"
                    className="w-3 h-3"
                    checked={
                      sortedOrgsForGroup.length > 0 &&
                      sortedOrgsForGroup.every((o) =>
                        selectedOrgsForGroup.includes(o.orgId),
                      )
                    }
                    onChange={() =>
                      toggleSelectAllOrgsForGroup(sortedOrgsForGroup)
                    }
                  />
                </th>
                <th className="th-thead text-left text-black text-xs">
                  Org ID
                </th>
                <th className="th-thead text-left text-black text-xs">
                  Org Name
                </th>
                {/* <th className="th-thead w-10 text-right text-black text-xs">
                  Remove
                </th> */}
              </tr>
            </thead>
            <tbody>
              {!selectedGroupIdForOrgs ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    Select a group to view organizations.
                  </td>
                </tr>
              ) : orgLoading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    Loading organizations...
                  </td>
                </tr>
              ) : sortedOrgsForGroup.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    No organizations found.
                  </td>
                </tr>
              ) : (
                sortedOrgsForGroup.map((o) => {
                  const selected = selectedOrgsForGroup.includes(o.orgId);
                  return (
                    <tr key={o.orgId} className="hover:bg-gray-50">
                      <td className="tbody-td">
                        <input
                          type="checkbox"
                          className="w-3 h-3"
                          checked={selected}
                          onChange={() => toggleOrgForGroup(o.orgId)}
                        />
                      </td>
                      <td className="tbody-td">{o.orgId}</td>
                      <td className="tbody-td">{o.orgName || "-"}</td>
                      {/* <td className="tbody-td text-right">
                        <button type="button">Remove</button>
                      </td> */}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* <div className="flex justify-end">
      <button
        onClick={saveGroupOrgs}
        disabled={!selectedGroupIdForOrgs || loading}
        className="bg-[#17414d] btn1 btn-blue disabled:opacity-60"
      >
        {loading ? "Saving..." : "Update Group ↔ Orgs"}
      </button>
    </div> */}
    </>
  );

  const renderUserOrgsTab = () => (
    <>
      <div className="mb-6 bg-gray-50 p-4 rounded-xl border">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          User <span className="text-red-500">*</span>
        </label>
        <Select
          options={userOptions}
          isLoading={userLoading}
          value={
            selectedUserIdForOrgs
              ? userOptions.find((o) => o.value === selectedUserIdForOrgs)
              : null
          }
          onChange={(opt) => setSelectedUserIdForOrgs(opt ? opt.value : "")}
          isSearchable
          placeholder="Search & select a user"
        />
        {selectedUserIdForOrgs && (
          <p className="mt-2 text-xs text-green-600">
            Selected user: <strong>{selectedUserIdForOrgs}</strong>
          </p>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Organizations for user
          </h3>
          <span className="text-sm text-blue-600">
            {selectedOrgsForUser.length} selected
          </span>
        </div>

        {selectedUserIdForOrgs && (
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTermUserOrgs}
              onChange={(e) => setSearchTermUserOrgs(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
            />
          </div>
        )}

        <div className="overflow-x-auto max-h-80">
          <table className="w-full text-sm">
            <thead className="thead">
              <tr className="bg-white border-b">
                <th className="px-3 py-2 w-10 text-left text-gray-500 text-xs">
                  Select
                </th>
                <th className="px-3 py-2 text-left text-gray-500 text-xs">
                  Org ID
                </th>
                <th className="px-3 py-2 text-left text-gray-500 text-xs">
                  Org Name
                </th>
              </tr>
            </thead>
            <tbody>
              {!selectedUserIdForOrgs ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    Select a user to view organizations.
                  </td>
                </tr>
              ) : orgLoading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    Loading organizations...
                  </td>
                </tr>
              ) : sortedOrgsForUser.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-6 text-center text-gray-500"
                  >
                    No organizations found.
                  </td>
                </tr>
              ) : (
                sortedOrgsForUser.map((o) => {
                  const selected = selectedOrgsForUser.includes(o.orgId);
                  return (
                    <tr key={o.orgId} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selected}
                          onChange={() => toggleOrgForUser(o.orgId)}
                        />
                      </td>
                      <td className="px-3 py-2">{o.orgId}</td>
                      <td className="px-3 py-2">{o.orgName || "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveUserOrgs}
          disabled={!selectedUserIdForOrgs || loading}
          className="bg-[#17414d] btn1 btn-blue disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen text-gray-900 flex w-full">
      {/* <h2 className="text-2xl font-bold mb-2">
        User, Group & Org Mapping
      </h2> */}
      <div className="w-full  p-2 mt-10 space-y-2">
        <div className="p-4 border-b w-full rounded-sm border-gray-100 flex items-center justify-between bg-white">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <AiOutlineFundProjectionScreen
              size={20}
              className="text-blue-500"
            />
            Access Mapping
          </h2>
        </div>
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        <div className="bg-white p-2 w-full rounded">
          <div className="flex justify-between items-center rounded">
            <div className="flex gap-x-2">
              <button
                className={`rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors
          ${
            activeMainTab === "projectUsers"
              ? "border-b-2 bg-[#17414d] text-white group-hover:text-gray"
              : "text-gray-600 hover:text-gray-800 bg-gray-100"
          }`}
                onClick={() => setActiveMainTab("projectUsers")}
              >
                User ↔ Projects
              </button>

              {/* <button
                className={`rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors
          ${
            activeMainTab === "userGroups"
              ? "border-b-2 bg-[#17414d] text-white group-hover:text-gray"
              : "text-gray-600 hover:text-gray-800 bg-gray-100"
          }`}
                onClick={() => setActiveMainTab("userGroups")}
              >
                User ↔ Groups
              </button> */}

              {/* <button
                className={`rounded-lg px-3 py-2 text-xs font-semibold cursor-pointer disabled:opacity-40 transition-colors
          ${
            activeMainTab === "groupOrgs"
              ? "border-b-2 bg-[#17414d] text-white group-hover:text-gray"
              : "text-gray-600 hover:text-gray-800 bg-gray-100"
          }`}
                onClick={() => setActiveMainTab("groupOrgs")}
              >
                Group ↔ Orgs
              </button> */}
            </div>
          </div>

          {activeMainTab === "projectUsers" && renderProjectUsersTab()}
          {activeMainTab === "userGroups" && renderUserGroupsTab()}
          {activeMainTab === "groupOrgs" && renderGroupOrgsTab()}
          {activeMainTab === "userOrgs" && renderUserOrgsTab()}
          {/* {activeMainTab === "manageGroups" && renderManageGroupsTab()}
      {activeMainTab === "manageUsers" && renderManageUsersTab()} */}
        </div>
      </div>
    </div>
  );
};

export default UserOrgProjectMapping;
