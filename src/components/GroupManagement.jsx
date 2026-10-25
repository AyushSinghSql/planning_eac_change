// import React, { useState, useEffect, useMemo } from "react";
// import { backendUrl } from "./config";
// import { toast } from "react-toastify";

// export default function GroupManagement({ onClose }) {
//   const [groupId, setGroupId] = useState("");
//   const [groupName, setGroupName] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedUsers, setSelectedUsers] = useState(new Set());
//   const [approversList, setApproversList] = useState([]); // [{ userId, approvalLevel }]
//   const [activeGroup, setActiveGroup] = useState(null);

//   const [usersList, setUsersList] = useState([]);
//   const [groupsList, setGroupsList] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);

//   // Search/Filter states for users and approvers
//   const [userSearchTerm, setUserSearchTerm] = useState("");
//   const [approverSearchTerm, setApproverSearchTerm] = useState("");

//   const currentUserId = 53; // Default fallback for createdBy

//   // Fetch users and existing groups from API
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const [usersRes, groupsRes] = await Promise.all([
//           fetch(`${backendUrl}/api/User`),
//           fetch(`${backendUrl}/api/UserGroups`).catch(() => null),
//         ]);

//         if (usersRes.ok) {
//           const userData = await usersRes.json();
//           setUsersList(Array.isArray(userData) ? userData : []);
//         }

//         if (groupsRes && groupsRes.ok) {
//           const groupData = await groupsRes.json();
//           setGroupsList(Array.isArray(groupData) ? groupData : []);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error("Failed to load users or groups");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Filtered users for mapping based on search and roles (user, sub_user, emp_user)
//   const filteredUsersForMapping = useMemo(() => {
//     const allowedRoles = ["user", "sub_user"];
//     const roleFiltered = usersList.filter(
//       (u) => u.role && allowedRoles.includes(u.role.toLowerCase()),
//     );

//     if (!userSearchTerm.trim()) return usersList;
//     const term = userSearchTerm.toLowerCase();
//     return roleFiltered.filter(
//       (u) =>
//         (u.fullName && u.fullName.toLowerCase().includes(term)) ||
//         (u.username && u.username.toLowerCase().includes(term)) ||
//         (u.email && u.email.toLowerCase().includes(term)),
//     );
//   }, [userSearchTerm, usersList]);

//   // Filtered approvers for mapping based on search and roles (approver, supervisor, admin)
//   const filteredApproverCandidates = useMemo(() => {
//     const allowedRoles = ["approver", "supervisor", "admin", "project manager"];
//     const roleFiltered = usersList.filter(
//       (u) => u.role && allowedRoles.includes(u.role.toLowerCase()),
//     );

//     if (!approverSearchTerm.trim()) return usersList;
//     const term = approverSearchTerm.toLowerCase();
//     return roleFiltered.filter(
//       (u) =>
//         (u.fullName && u.fullName.toLowerCase().includes(term)) ||
//         (u.username && u.username.toLowerCase().includes(term)) ||
//         (u.email && u.email.toLowerCase().includes(term)),
//     );
//   }, [approverSearchTerm, usersList]);

//   const handleUserToggle = (userId) => {
//     const updated = new Set(selectedUsers);
//     if (updated.has(userId)) {
//       updated.delete(userId);
//     } else {
//       updated.add(userId);
//     }
//     setSelectedUsers(updated);
//   };

//   const handleSelectAllUsers = (e) => {
//     if (e.target.checked) {
//       const allIds = filteredUsersForMapping.map((u) => u.userId);
//       setSelectedUsers((prev) => new Set([...prev, ...allIds]));
//     } else {
//       const filteredIds = new Set(filteredUsersForMapping.map((u) => u.userId));
//       setSelectedUsers((prev) => {
//         const next = new Set(prev);
//         filteredIds.forEach((id) => next.delete(id));
//         return next;
//       });
//     }
//   };

//   const handleApproverToggle = (userId, checked) => {
//     if (checked) {
//       setApproversList((prev) => [...prev, { userId, approvalLevel: 1 }]);
//     } else {
//       setApproversList((prev) => prev.filter((app) => app.userId !== userId));
//     }
//   };

//   const handleApprovalLevelChange = (userId, level) => {
//     setApproversList((prev) =>
//       prev.map((app) =>
//         app.userId === userId
//           ? { ...app, approvalLevel: parseInt(level) || 1 }
//           : app,
//       ),
//     );
//   };

//   const handleSelectGroupRow = (group) => {
//     setActiveGroup(group);
//     setIsEditMode(true);
//     setGroupId(group.groupId || group.id || "");
//     setGroupName(group.groupName || "");
//     setDescription(group.description || "");

//     const memberIds = group.members
//       ? group.members.map((m) => m.userId)
//       : group.userIds || [];
//     setSelectedUsers(new Set(memberIds));

//     const formattedApprovers = group.approvers
//       ? group.approvers.map((a) => ({
//           userId: a.userId,
//           approvalLevel: a.approvalLevel || 1,
//         }))
//       : [];
//     setApproversList(formattedApprovers);
//   };

//   const handleResetForm = () => {
//     setIsEditMode(false);
//     setGroupId("");
//     setGroupName("");
//     setDescription("");
//     setSelectedUsers(new Set());
//     setApproversList([]);
//     setUserSearchTerm("");
//     setApproverSearchTerm("");
//     setActiveGroup(null);
//   };

//   const handleSaveGroup = async (e) => {
//     e.preventDefault();
//     if (!groupName.trim()) {
//       toast.info("Please enter a group name.");
//       return;
//     }
//     if (selectedUsers.size === 0) {
//       toast.info("Please select at least one user for this group.");
//       return;
//     }
//     if (approversList.length === 0) {
//       toast.info("Please select at least one approver with an approval level.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const payload = {
//         groupName: groupName.trim(),
//         description: description.trim(),
//         userIds: Array.from(selectedUsers).map(Number),
//         approvers: approversList.map((app) => ({
//           userId: Number(app.userId),
//           approvalLevel: Number(app.approvalLevel),
//         })),
//         createdBy: currentUserId,
//         modifiedBy: currentUserId,
//       };

//       const url = isEditMode
//         ? `${backendUrl}/api/UserGroups/${groupId}/configuration`
//         : `${backendUrl}/api/UserGroups`;
//       const method = isEditMode ? "PUT" : "POST";

//       const response = await fetch(url, {
//         method: method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error(
//           isEditMode ? "Failed to update group." : "Failed to create group.",
//         );
//       }

//       toast.success(
//         isEditMode
//           ? "Group updated successfully!"
//           : "Group created successfully!",
//       );

//       handleResetForm();

//       // Refresh groups list
//       const groupsRes = await fetch(`${backendUrl}/api/UserGroups`);
//       if (groupsRes.ok) {
//         const groupData = await groupsRes.json();
//         setGroupsList(Array.isArray(groupData) ? groupData : []);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const getGroupMembers = (members = []) => {
//     return members.map((m) => {
//       const found = usersList.find((u) => u.userId === m.userId);
//       return found || m;
//     });
//   };

//   const getGroupApprovers = (approvers = []) => {
//     return approvers.map((a) => {
//       const found = usersList.find((u) => u.userId === a.userId);
//       return { ...(found || a), approvalLevel: a.approvalLevel };
//     });
//   };

//   const areAllFilteredUsersSelected =
//     filteredUsersForMapping.length > 0 &&
//     filteredUsersForMapping.every((u) => selectedUsers.has(u.userId));

//   return (
//     <div className="bg-white shadow-sm border border-gray-100 p-2 w-full font-inter text-xs">
//       <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
//         <h2 className="text-sm font-bold text-gray-800">
//           {isEditMode
//             ? `Edit Group (ID: ${groupId})`
//             : "Group & Approver Management"}
//         </h2>
//         <div className="flex items-center gap-2">
//           {onClose && (
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700 font-medium cursor-pointer text-xs"
//             >
//               Close
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Existing Groups Table & Details */}
//       <div className="">
//         <h3 className="font-bold text-gray-800 mb-2 text-xs">
//           Existing Groups (Click row to edit/view details)
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="md:col-span-2 overflow-x-auto rounded border border-gray-300">
//             <table className="w-full text-xs border-collapse">
//               <thead>
//                 <tr className="bg-[#e5f3fb] text-black">
//                   <th className="px-2 py-1.5 border-b border-r border-gray-300 text-left font-semibold">
//                     Group Name
//                   </th>
//                   <th className="px-2 py-1.5 border-b border-r border-gray-300 text-left font-semibold">
//                     Group Description
//                   </th>
//                   <th className="px-2 py-1.5 border-b border-r border-gray-300 text-left font-semibold">
//                     Approvers Count
//                   </th>
//                   <th className="px-2 py-1.5 border-b border-gray-300 text-left font-semibold">
//                     Members Count
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {groupsList.length === 0 ? (
//                   <tr>
//                     <td colSpan="4" className="text-center py-3 text-gray-400">
//                       No groups found.
//                     </td>
//                   </tr>
//                 ) : (
//                   groupsList.map((g) => {
//                     const gId = g.groupId || g.id;
//                     const membersCount = g.members
//                       ? g.members.length
//                       : g.userIds?.length || 0;
//                     const approversCount = g.approvers ? g.approvers.length : 0;

//                     return (
//                       <tr
//                         key={gId}
//                         onClick={() => handleSelectGroupRow(g)}
//                         className={`cursor-pointer transition-colors ${String(groupId) === String(gId) ? "bg-sky-100" : "hover:bg-sky-50/50"}`}
//                       >
//                         <td className="px-2 py-1.5 border-b border-r border-gray-300 font-medium">
//                           {g.groupName}
//                         </td>
//                         <td className="px-2 py-1.5 border-b border-r border-gray-300">
//                           {g.description || "-"}
//                         </td>
//                         <td className="px-2 py-1.5 border-b border-r border-gray-300">
//                           {approversCount}
//                         </td>
//                         <td className="px-2 py-1.5 border-b border-gray-300">
//                           {membersCount}
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Group Details Panel (Approvers & Members) */}
//           <div className="border border-gray-300 rounded p-3 bg-gray-50 flex flex-col gap-3">
//             <h4 className="font-bold text-gray-800 border-b border-gray-200 pb-1">
//               {activeGroup
//                 ? `Details: ${activeGroup.groupName}`
//                 : "Group Details"}
//             </h4>
//             {activeGroup ? (
//               <>
//                 <div>
//                   <span className="font-semibold text-gray-700 block mb-1">
//                     Approvers
//                   </span>
//                   <div className="space-y-1 overflow-y-auto max-h-24">
//                     {getGroupApprovers(activeGroup.approvers).map(
//                       (app, idx) => (
//                         <div
//                           key={idx}
//                           className="bg-white p-1 rounded border border-gray-200 text-[10px] flex justify-between"
//                         >
//                           <span className="font-semibold text-black">
//                             {app.fullName ||
//                               app.username ||
//                               `User ID: ${app.userId}`}
//                           </span>
//                           <span className="text-blue-600 font-medium">
//                             Lvl {app.approvalLevel}
//                           </span>
//                         </div>
//                       ),
//                     )}
//                   </div>
//                 </div>

//                 <div>
//                   <span className="font-semibold text-gray-700 block mb-1">
//                     Members:
//                   </span>
//                   <div className="space-y-1 overflow-y-auto max-h-24">
//                     {getGroupMembers(activeGroup.members).map((member, idx) => (
//                       <div
//                         key={idx}
//                         className="bg-white p-1 rounded border border-gray-200 text-[10px]"
//                       >
//                         <span className="font-semibold text-black">
//                           {member.fullName ||
//                             member.username ||
//                             `User ID: ${member.userId}`}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="text-gray-400 text-center py-10">
//                 Select a group from the table to view or edit details.
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <form onSubmit={handleSaveGroup} className="space-y-4 mt-4">
//         <div className="flex justify-end gap-2">
//           {isEditMode && (
//             <button
//               type="button"
//               onClick={handleResetForm}
//               className="btn1 btn-blue"
//             >
//               Cancel Edit
//             </button>
//           )}
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="btn1 btn-blue"
//           >
//             {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Save"}
//           </button>
//         </div>

//         {/* Group ID & Group Name in Single Line */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="flex flex-col">
//             <label className="font-semibold text-gray-700 mb-1">
//               Group Name
//             </label>
//             <input
//               type="text"
//               value={groupName}
//               onChange={(e) => setGroupName(e.target.value)}
//               disabled={isEditMode}
//               placeholder="Enter group name"
//               className="bg-white px-2.5 py-1.5 border border-gray-300 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-black"
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="font-semibold text-gray-700 mb-1">
//               Description
//             </label>
//             <input
//               type="text"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Enter group description"
//               className="bg-white px-2.5 py-1.5 border border-gray-300 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-black"
//             />
//           </div>
//         </div>

//         {/* Description Field */}

//         {/* Step 1: Map Users to Group */}
//         <div className="flex flex-col">
//           <label className="font-semibold text-gray-700 mb-1">
//             Step 1: Map Users to Group ({selectedUsers.size} selected)
//           </label>
//           <div className="border border-gray-300 rounded p-2 bg-gray-50 flex flex-col gap-2">
//             <div className="flex gap-2 items-center">
//               <input
//                 type="text"
//                 placeholder="Search users to map..."
//                 value={userSearchTerm}
//                 onChange={(e) => setUserSearchTerm(e.target.value)}
//                 className="bg-white flex-1 px-2.5 py-1.5 border border-gray-300 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-black"
//               />
//               <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1.5 border border-gray-300 rounded hover:bg-sky-50 select-none">
//                 <input
//                   type="checkbox"
//                   checked={areAllFilteredUsersSelected}
//                   onChange={handleSelectAllUsers}
//                   className="rounded border-gray-300 cursor-pointer accent-blue-600"
//                 />
//                 <span className="font-medium text-gray-700">Select All</span>
//               </label>
//             </div>
//             <div className="max-h-36 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 bg-white p-2 rounded border border-gray-200">
//               {filteredUsersForMapping.length === 0 ? (
//                 <span className="text-gray-400 text-xs col-span-full text-center py-2">
//                   No users found
//                 </span>
//               ) : (
//                 filteredUsersForMapping.map((user) => (
//                   <label
//                     key={user.userId}
//                     className="flex items-center gap-2 cursor-pointer bg-gray-50 p-1.5 rounded border border-gray-200 hover:bg-sky-50"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedUsers.has(user.userId)}
//                       onChange={() => handleUserToggle(user.userId)}
//                       className="rounded border-gray-300 cursor-pointer accent-blue-600"
//                     />
//                     <div className="truncate flex flex-col">
//                       <span className="font-semibold text-black truncate">
//                         {user.fullName || user.username}
//                       </span>
//                       <span className="text-[10px] text-gray-500 truncate">
//                         {user.email}
//                       </span>
//                     </div>
//                   </label>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Step 2: Map Approvers & Set Approval Levels */}
//         <div className="flex flex-col">
//           <label className="font-semibold text-gray-700 mb-1">
//             Step 2: Map Approvers & Set Levels ({approversList.length} selected)
//           </label>
//           <div className="border border-gray-300 rounded p-2 bg-gray-50 flex flex-col gap-2">
//             <input
//               type="text"
//               placeholder="Search approvers to assign..."
//               value={approverSearchTerm}
//               onChange={(e) => setApproverSearchTerm(e.target.value)}
//               className="bg-white flex-1 px-2.5 py-1.5 border border-gray-300 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-black"
//             />
//             <div className="max-h-36 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-2 rounded border border-gray-200">
//               {filteredApproverCandidates.length === 0 ? (
//                 <span className="text-gray-400 text-xs col-span-full text-center py-2">
//                   No approvers found
//                 </span>
//               ) : (
//                 filteredApproverCandidates.map((user) => {
//                   const existingApproval = approversList.find(
//                     (a) => a.userId === user.userId,
//                   );
//                   const isChecked = Boolean(existingApproval);

//                   return (
//                     <div
//                       key={user.userId}
//                       className="flex items-center justify-between gap-2 bg-gray-50 p-1.5 rounded border border-gray-200"
//                     >
//                       <label className="flex items-center gap-2 cursor-pointer truncate flex-1">
//                         <input
//                           type="checkbox"
//                           checked={isChecked}
//                           onChange={(e) =>
//                             handleApproverToggle(user.userId, e.target.checked)
//                           }
//                           className="rounded border-gray-300 cursor-pointer accent-blue-600"
//                         />
//                         <div className="truncate flex flex-col">
//                           <span className="font-semibold text-black truncate">
//                             {user.fullName || user.username}
//                           </span>
//                           <span className="text-[10px] text-gray-500 truncate">
//                             {user.email}
//                           </span>
//                         </div>
//                       </label>
//                       {isChecked && (
//                         <div className="flex items-center gap-1">
//                           <span className="text-[10px] text-gray-600 font-medium">
//                             Lvl:
//                           </span>
//                           <input
//                             type="number"
//                             min="1"
//                             value={existingApproval.approvalLevel}
//                             onChange={(e) =>
//                               handleApprovalLevelChange(
//                                 user.userId,
//                                 e.target.value,
//                               )
//                             }
//                             className="w-12 bg-white px-1 py-0.5 border border-gray-300 rounded text-xs text-black text-center"
//                           />
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo } from "react";
import { backendUrl } from "./config";
import { toast } from "react-toastify";

export default function GroupManagement({ onClose }) {
  const [groupId, setGroupId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [approversList, setApproversList] = useState([]); // [{ userId, approvalLevel }]
  const [activeGroup, setActiveGroup] = useState(null);

  const [usersList, setUsersList] = useState([]);
  const [groupsList, setGroupsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Search/Filter states for tables
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [approverSearchTerm, setApproverSearchTerm] = useState("");

  const currentUserId = 53; // Default fallback for createdBy

  // Fetch users and existing groups from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [usersRes, groupsRes] = await Promise.all([
          fetch(`${backendUrl}/api/User`),
          fetch(`${backendUrl}/api/UserGroups`).catch(() => null),
        ]);

        if (usersRes.ok) {
          const userData = await usersRes.json();
          setUsersList(Array.isArray(userData) ? userData : []);
        }

        if (groupsRes && groupsRes.ok) {
          const groupData = await groupsRes.json();
          setGroupsList(Array.isArray(groupData) ? groupData : []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load users or groups");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // // Filtered users for mapping table based on search and roles
  // const filteredUsersForMapping = useMemo(() => {
  //   const allowedRoles = ["user", "sub_user"];
  //   const roleFiltered = usersList.filter(
  //     (u) => u.role && allowedRoles.includes(u.role.toLowerCase()),
  //   );
  //   const sourceList = roleFiltered.length > 0 ? roleFiltered : usersList;

  //   if (!userSearchTerm.trim()) return usersList;
  //   const term = userSearchTerm.toLowerCase();
  //   return usersList.filter(
  //     (u) =>
  //       (u.fullName && u.fullName.toLowerCase().includes(term)) ||
  //       (u.username && u.username.toLowerCase().includes(term)) ||
  //       (u.email && u.email.toLowerCase().includes(term)),
  //   );
  // }, [userSearchTerm, usersList]);

  // // Filtered approvers for mapping table based on search and roles
  // const filteredApproverCandidates = useMemo(() => {
  //   const allowedRoles = ["approver", "supervisor", "admin", "project manager"];
  //   const roleFiltered = usersList.filter(
  //     (u) => u.role && allowedRoles.includes(u.role.toLowerCase()),
  //   );
  //   const sourceList = roleFiltered.length > 0 ? roleFiltered : usersList;

  //   if (!approverSearchTerm.trim()) return usersList;
  //   const term = approverSearchTerm.toLowerCase();
  //   return usersList.filter(
  //     (u) =>
  //       (u.fullName && u.fullName.toLowerCase().includes(term)) ||
  //       (u.username && u.username.toLowerCase().includes(term)) ||
  //       (u.email && u.email.toLowerCase().includes(term)),
  //   );
  // }, [approverSearchTerm, usersList]);

  // Filtered and sorted users for mapping table (selected items shown on top)
  const filteredUsersForMapping = useMemo(() => {
    const allowedRoles = ["user", "sub_user"];
    const roleFiltered = usersList.filter(
      (u) => u.role && allowedRoles.includes(u.role.toLowerCase()),
    );
    const sourceList = roleFiltered.length > 0 ? roleFiltered : usersList;

    const filtered = !userSearchTerm.trim()
      ? usersList
      : usersList.filter(
          (u) =>
            (u.fullName &&
              u.fullName
                .toLowerCase()
                .includes(userSearchTerm.toLowerCase())) ||
            (u.username &&
              u.username
                .toLowerCase()
                .includes(userSearchTerm.toLowerCase())) ||
            (u.email &&
              u.email.toLowerCase().includes(userSearchTerm.toLowerCase())),
        );

    // Sort so selected items appear at the top
    return [...filtered].sort((a, b) => {
      const aSelected = selectedUsers.has(a.userId);
      const bSelected = selectedUsers.has(b.userId);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }, [userSearchTerm, usersList, selectedUsers]);

  // Filtered and sorted approvers for mapping table (selected items shown on top)
  const filteredApproverCandidates = useMemo(() => {
    const allowedRoles = ["approver", "supervisor", "admin", "project manager"];
    const roleFiltered = usersList.filter(
      (u) => u.role && allowedRoles.includes(u.role.toLowerCase()),
    );
    const sourceList = roleFiltered.length > 0 ? roleFiltered : usersList;

    const filtered = !approverSearchTerm.trim()
      ? usersList
      : usersList.filter(
          (u) =>
            (u.fullName &&
              u.fullName
                .toLowerCase()
                .includes(approverSearchTerm.toLowerCase())) ||
            (u.username &&
              u.username
                .toLowerCase()
                .includes(approverSearchTerm.toLowerCase())) ||
            (u.email &&
              u.email.toLowerCase().includes(approverSearchTerm.toLowerCase())),
        );

    // Sort so selected approvers appear at the top
    return [...filtered].sort((a, b) => {
      const aSelected = approversList.some((app) => app.userId === a.userId);
      const bSelected = approversList.some((app) => app.userId === b.userId);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }, [approverSearchTerm, usersList, approversList]);

  const handleUserToggle = (userId) => {
    if (approversList.some((app) => app.userId === userId)) {
      toast.info(
        "This user is already selected as an approver. A user cannot be both a member and an approver.",
      );
      return;
    }

    const updated = new Set(selectedUsers);
    if (updated.has(userId)) {
      updated.delete(userId);
    } else {
      updated.add(userId);
    }
    setSelectedUsers(updated);
  };

  const handleSelectAllUsers = (e) => {
    if (e.target.checked) {
      const validIds = filteredUsersForMapping
        .filter((u) => !approversList.some((app) => app.userId === u.userId))
        .map((u) => u.userId);
      setSelectedUsers((prev) => new Set([...prev, ...validIds]));
    } else {
      const filteredIds = new Set(filteredUsersForMapping.map((u) => u.userId));
      setSelectedUsers((prev) => {
        const next = new Set(prev);
        filteredIds.forEach((id) => next.delete(id));
        return next;
      });
    }
  };

  const handleApproverToggle = (userId, checked) => {
    if (checked) {
      if (selectedUsers.has(userId)) {
        toast.info(
          "This user is already selected as a member. A user cannot be both a member and an approver.",
        );
        return;
      }
      setApproversList((prev) => [...prev, { userId, approvalLevel: 1 }]);
    } else {
      setApproversList((prev) => prev.filter((app) => app.userId !== userId));
    }
  };

  const handleApprovalLevelChange = (userId, level) => {
    setApproversList((prev) =>
      prev.map((app) =>
        app.userId === userId
          ? { ...app, approvalLevel: parseInt(level) || 1 }
          : app,
      ),
    );
  };

  const handleSelectGroupRow = (group) => {
    setActiveGroup(group);
    setIsEditMode(true);
    setGroupId(group.groupId || group.id || "");
    setGroupName(group.groupName || "");
    setDescription(group.description || "");

    const memberIds = group.members
      ? group.members.map((m) => m.userId)
      : group.userIds || [];
    setSelectedUsers(new Set(memberIds));

    const formattedApprovers = group.approvers
      ? group.approvers.map((a) => ({
          userId: a.userId,
          approvalLevel: a.approvalLevel || 1,
        }))
      : [];
    setApproversList(formattedApprovers);
  };

  const handleResetForm = () => {
    setIsEditMode(false);
    setGroupId("");
    setGroupName("");
    setDescription("");
    setSelectedUsers(new Set());
    setApproversList([]);
    setUserSearchTerm("");
    setApproverSearchTerm("");
    setActiveGroup(null);
  };

  const handleSaveGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast.info("Please enter a group name.");
      return;
    }
    if (selectedUsers.size === 0) {
      toast.info("Please select at least one user for this group.");
      return;
    }
    if (approversList.length === 0) {
      toast.info("Please select at least one approver with an approval level.");
      return;
    }

    // Double check overlap validation before submit
    for (let userId of selectedUsers) {
      if (approversList.some((app) => app.userId === userId)) {
        toast.error(
          "Overlap detected: A user cannot be both a group member and an approver.",
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        groupName: groupName.trim(),
        description: description.trim(),
        userIds: Array.from(selectedUsers).map(Number),
        approvers: approversList.map((app) => ({
          userId: Number(app.userId),
          approvalLevel: Number(app.approvalLevel),
        })),
        createdBy: currentUserId,
        modifiedBy: currentUserId,
      };

      const url = isEditMode
        ? `${backendUrl}/api/UserGroups/${groupId}/configuration`
        : `${backendUrl}/api/UserGroups`;
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          isEditMode ? "Failed to update group." : "Failed to create group.",
        );
      }

      toast.success(
        isEditMode
          ? "Group updated successfully!"
          : "Group created successfully!",
      );

      handleResetForm();

      const groupsRes = await fetch(`${backendUrl}/api/UserGroups`);
      if (groupsRes.ok) {
        const groupData = await groupsRes.json();
        setGroupsList(Array.isArray(groupData) ? groupData : []);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGroupMembers = (members = []) => {
    return members.map((m) => {
      const found = usersList.find((u) => u.userId === m.userId);
      return found || m;
    });
  };

  const getGroupApprovers = (approvers = []) => {
    return approvers.map((a) => {
      const found = usersList.find((u) => u.userId === a.userId);
      return { ...(found || a), approvalLevel: a.approvalLevel };
    });
  };

  const areAllFilteredUsersSelected =
    filteredUsersForMapping.length > 0 &&
    filteredUsersForMapping
      .filter((u) => !approversList.some((app) => app.userId === u.userId))
      .every((u) => selectedUsers.has(u.userId));

  return (
    <div className="bg-white shadow-sm border border-gray-100 p-2 w-full font-inter text-xs">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
        <h2 className="text-sm font-bold text-gray-800">
          {isEditMode
            ? `Edit Group (ID: ${groupId})`
            : "Group & Approver Management"}
        </h2>
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 font-medium cursor-pointer text-xs"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Existing Groups Table & Details */}
      <div className="mb-4">
        <h3 className="font-bold text-gray-800 mb-2 text-xs">
          Existing Groups (Click row to edit/view details)
        </h3>
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> */}
        <div>
          <div className="md:col-span-2 overflow-x-auto rounded border border-gray-300">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#e5f3fb] text-black sticky top-0 z-10 shadow-sm">
                  <th className="px-2 py-1.5 border-b border-r border-gray-300 text-left font-semibold bg-[#e5f3fb]">
                    Group Name
                  </th>
                  <th className="px-2 py-1.5 border-b border-r border-gray-300 text-left font-semibold bg-[#e5f3fb]">
                    Group Description
                  </th>
                  <th className="px-2 py-1.5 border-b border-r border-gray-300 text-left font-semibold bg-[#e5f3fb]">
                    Approvers Count
                  </th>
                  <th className="px-2 py-1.5 border-b border-gray-300 text-left font-semibold bg-[#e5f3fb]">
                    Members Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {groupsList.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-3 text-gray-400">
                      No groups found.
                    </td>
                  </tr>
                ) : (
                  groupsList.map((g) => {
                    const gId = g.groupId || g.id;
                    const membersCount = g.members
                      ? g.members.length
                      : g.userIds?.length || 0;
                    const approversCount = g.approvers ? g.approvers.length : 0;

                    return (
                      <tr
                        key={gId}
                        onClick={() => handleSelectGroupRow(g)}
                        className={`cursor-pointer transition-colors ${String(groupId) === String(gId) ? "bg-sky-100" : "hover:bg-sky-50/50"}`}
                      >
                        <td className="px-2 py-1.5 border-b border-r border-gray-300 font-medium">
                          {g.groupName}
                        </td>
                        <td className="px-2 py-1.5 border-b border-r border-gray-300">
                          {g.description || "-"}
                        </td>
                        <td className="px-2 py-1.5 border-b border-r border-gray-300">
                          {approversCount}
                        </td>
                        <td className="px-2 py-1.5 border-b border-gray-300">
                          {membersCount}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Group Details Panel */}
          {/* <div className="border border-gray-300 rounded p-3 bg-gray-50 flex flex-col gap-3">
            <h4 className="font-bold text-gray-800 border-b border-gray-200 pb-1">
              {activeGroup
                ? `Details: ${activeGroup.groupName}`
                : "Group Details"}
            </h4>
            {activeGroup ? (
              <>
                <div>
                  <span className="font-semibold text-gray-700 block mb-1">
                    Approvers
                  </span>
                  <div className="space-y-1 overflow-y-auto max-h-24">
                    {getGroupApprovers(activeGroup.approvers).map(
                      (app, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-1 rounded border border-gray-200 text-[10px] flex justify-between"
                        >
                          <span className="font-semibold text-black">
                            {app.fullName ||
                              app.username ||
                              `User ID: ${app.userId}`}
                          </span>
                          <span className="text-blue-600 font-medium">
                            Lvl {app.approvalLevel}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-gray-700 block mb-1">
                    Members:
                  </span>
                  <div className="space-y-1 overflow-y-auto max-h-24">
                    {getGroupMembers(activeGroup.members).map((member, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-1 rounded border border-gray-200 text-[10px]"
                      >
                        <span className="font-semibold text-black">
                          {member.fullName ||
                            member.username ||
                            `User ID: ${member.userId}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-gray-400 text-center py-10">
                Select a group from the table to view or edit details.
              </div>
            )}
          </div> */}
        </div>
      </div>

      <form onSubmit={handleSaveGroup} className="space-y-4 mt-4">
        <div className="flex justify-end gap-2">
          {isEditMode && (
            <button
              type="button"
              onClick={handleResetForm}
              className="btn1 btn-blue"
            >
              Cancel Edit
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn1 btn-blue"
          >
            {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Save"}
          </button>
        </div>

        {/* Group Name & Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              disabled={isEditMode}
              placeholder="Enter group name"
              className="bg-white px-2.5 py-1.5 border border-gray-300 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter group description"
              className="bg-white px-2.5 py-1.5 border border-gray-300 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-black"
            />
          </div>
        </div>

        {/* Step 1 & Step 2 Side-by-Side Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Step 1: Map Users to Group (Table format) */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">
              Step 1: Map Users to Group ({selectedUsers.size} selected)
            </label>
            <div className="border border-gray-300 rounded p-2 bg-gray-50 flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Search users to map..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="bg-white flex-1 px-2.5 py-1.5 border border-gray-300 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-black"
                />
              </div>
              <div className="max-h-52 overflow-y-auto rounded border border-gray-300 bg-white">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#e5f3fb] text-black sticky top-0 z-10 shadow-sm">
                      <th className="w-10 px-2 py-1.5 border-b border-r border-gray-300 text-center font-semibold bg-[#e5f3fb]">
                        <input
                          type="checkbox"
                          checked={areAllFilteredUsersSelected}
                          onChange={handleSelectAllUsers}
                          className="rounded border-gray-300 cursor-pointer accent-blue-600"
                        />
                      </th>
                      <th className="px-2 py-1.5 border-b border-r border-gray-300 text-left font-semibold bg-[#e5f3fb]">
                        Username
                      </th>
                      <th className="px-2 py-1.5 border-b border-r border-gray-300 text-left font-semibold bg-[#e5f3fb]">
                        Full Name
                      </th>
                      <th className="px-2 py-1.5 border-b border-gray-300 text-left font-semibold bg-[#e5f3fb]">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsersForMapping.length === 0 ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="text-center py-3 text-gray-400"
                        >
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsersForMapping.map((user) => {
                        const isChecked = selectedUsers.has(user.userId);
                        const isApprover = approversList.some(
                          (app) => app.userId === user.userId,
                        );

                        return (
                          <tr
                            key={user.userId}
                            onClick={() =>
                              !isApprover && handleUserToggle(user.userId)
                            }
                            className={`transition-colors ${
                              isApprover
                                ? "bg-gray-100 opacity-60 cursor-not-allowed"
                                : isChecked
                                  ? "bg-sky-50 cursor-pointer"
                                  : "hover:bg-gray-50 cursor-pointer"
                            }`}
                          >
                            <td
                              className="w-10 px-2 py-1.5 border-b border-r border-gray-300 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={isApprover}
                                onChange={() => handleUserToggle(user.userId)}
                                className="rounded border-gray-300 cursor-pointer accent-blue-600 disabled:cursor-not-allowed"
                              />
                            </td>
                            <td className="px-2 py-1.5 border-b border-r border-gray-300 font-semibold text-black">
                              {user.username || user.userName}
                            </td>
                            <td className="px-2 py-1.5 border-b border-r border-gray-300 font-semibold text-black">
                              {user.fullName || user.username}
                              {isApprover && (
                                <span className="ml-1.5 text-[10px] text-amber-600 font-normal">
                                  (Already Approver)
                                </span>
                              )}
                            </td>
                            <td className="px-2 py-1.5 border-b border-gray-300 text-gray-500">
                              {user.email}
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

          {/* Step 2: Map Approvers & Set Approval Levels (Table format) */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">
              Step 2: Map Approvers to Group ({approversList.length} selected)
            </label>
            <div className="border border-gray-300 rounded p-2 bg-gray-50 flex flex-col gap-2">
              <input
                type="text"
                placeholder="Search approvers to assign..."
                value={approverSearchTerm}
                onChange={(e) => setApproverSearchTerm(e.target.value)}
                className="bg-white flex-1 px-2.5 py-1.5 border border-gray-300 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-black"
              />
              <div className="max-h-52 overflow-y-auto rounded border border-gray-300 bg-white">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#e5f3fb] text-black sticky top-0 z-10 shadow-sm">
                      <th className="w-10 px-2 py-1.5 border-b border-r border-gray-300 text-center font-semibold bg-[#e5f3fb]">
                        Select
                      </th>
                      <th className="px-2 py-1.5 border-b border-r border-gray-300 text-left font-semibold bg-[#e5f3fb]">
                        Username
                      </th>
                      <th className="px-2 py-1.5 border-b border-r border-gray-300 text-left font-semibold bg-[#e5f3fb]">
                        Approver Name
                      </th>
                      <th className="px-2 py-1.5 border-b border-r border-gray-300 text-left font-semibold bg-[#e5f3fb]">
                        Email
                      </th>
                      <th className="w-28 px-2 py-1.5 border-b border-gray-300 text-center font-semibold bg-[#e5f3fb]">
                        Approval Level
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApproverCandidates.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center py-3 text-gray-400"
                        >
                          No approvers found
                        </td>
                      </tr>
                    ) : (
                      filteredApproverCandidates.map((user) => {
                        const existingApproval = approversList.find(
                          (a) => a.userId === user.userId,
                        );
                        const isChecked = Boolean(existingApproval);
                        const isMember = selectedUsers.has(user.userId);

                        return (
                          <tr
                            key={user.userId}
                            onClick={() =>
                              !isMember &&
                              handleApproverToggle(user.userId, !isChecked)
                            }
                            className={`transition-colors ${
                              isMember
                                ? "bg-gray-100 opacity-60 cursor-not-allowed"
                                : isChecked
                                  ? "bg-sky-50 cursor-pointer"
                                  : "hover:bg-gray-50 cursor-pointer"
                            }`}
                          >
                            <td
                              className="w-10 px-2 py-1.5 border-b border-r border-gray-300 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={isMember}
                                onChange={(e) =>
                                  handleApproverToggle(
                                    user.userId,
                                    e.target.checked,
                                  )
                                }
                                className="rounded border-gray-300 cursor-pointer accent-blue-600 disabled:cursor-not-allowed"
                              />
                            </td>
                            <td className="px-2 py-1.5 border-b border-r border-gray-300 font-semibold text-black">
                              {user.username || user.userName}
                            </td>
                            <td className="px-2 py-1.5 border-b border-r border-gray-300 font-semibold text-black">
                              {user.fullName || user.username}
                              {isMember && (
                                <span className="ml-1.5 text-[10px] text-amber-600 font-normal">
                                  (Already Member)
                                </span>
                              )}
                            </td>
                            <td className="px-2 py-1.5 border-b border-r border-gray-300 text-gray-500">
                              {user.email}
                            </td>
                            <td
                              className="w-28 px-2 py-1.5 border-b border-gray-300 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {isChecked ? (
                                <div className="flex items-center justify-center gap-1">
                                  <span className="text-[10px] text-gray-600 font-medium">
                                    Lvl:
                                  </span>
                                  <input
                                    type="number"
                                    min="1"
                                    value={existingApproval.approvalLevel}
                                    onChange={(e) =>
                                      handleApprovalLevelChange(
                                        user.userId,
                                        e.target.value,
                                      )
                                    }
                                    className="w-12 bg-white px-1 py-0.5 border border-gray-300 rounded text-xs text-black text-center"
                                  />
                                </div>
                              ) : (
                                <span className="text-gray-400 text-[10px]">
                                  -
                                </span>
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
        </div>
      </form>
    </div>
  );
}
