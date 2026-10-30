// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { debounce } from "lodash";
// import { Search, X } from "lucide-react";
// import { AiOutlineFundProjectionScreen } from "react-icons/ai";
// import { toast } from "react-toastify";
// import { backendUrl } from "./config";

// const LeaveProjectMapping = () => {
//   // -------------------- State --------------------
//   const [leaveTypes, setLeaveTypes] = useState([]);
//   const [mappings, setMappings] = useState([]);
//   const [selectedLeaveType, setSelectedLeaveType] = useState(null);

//   const [availableProjects, setAvailableProjects] = useState([]);
//   const [selectedProjectIds, setSelectedProjectIds] = useState([]);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [leaveLoading, setLeaveLoading] = useState(false);
//   const [projectLoading, setProjectLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const lookupTake = Number(
//     import.meta.env.VITE_GET_PROJECT_MASTER_LOOKUP || 500
//   );

//   // -------------------- User Context --------------------
//   const getCurrentUserContext = () => {
//     try {
//       const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

//       return {
//         userId: user.userId ?? "",
//         role: String(user.role ?? "").toLowerCase(),
//       };
//     } catch {
//       return { userId: "", role: "" };
//     }
//   };

//   const { userId, role } = getCurrentUserContext();

//   const normalizeId = (value) => String(value ?? "").trim();

//   // -------------------- Load Leave Types --------------------
//   useEffect(() => {
//     const fetchLeaveTypes = async () => {
//       setLeaveLoading(true);

//       try {
//         const response = await axios.get(`${backendUrl}/api/LeaveType`);
//         const data = Array.isArray(response.data) ? response.data : [];

//         setLeaveTypes(data);
//       } catch (err) {
//         console.error("Failed to load leave types:", err);
//         toast.error("Failed to load leave types.");
//       } finally {
//         setLeaveLoading(false);
//       }
//     };

//     fetchLeaveTypes();
//   }, []);

//   // -------------------- Load All Existing Mappings --------------------
//   const fetchMappings = useCallback(async () => {
//     setLoading(true);

//     try {
//       const response = await axios.get(
//         `${backendUrl}/api/ProjectLeaveMapping`
//       );

//       setMappings(Array.isArray(response.data) ? response.data : []);
//     } catch (err) {
//       console.error("Failed to load project leave mappings:", err);
//       toast.error("Failed to load project mappings.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchMappings();
//   }, [fetchMappings]);

//   // -------------------- Leave Type Helpers --------------------
//   const getLeaveTypeCode = (leave) =>
//     String(leave?.leaveTypeCode ?? leave?.leaveType ?? "");

//   const getLeaveTypeName = (leave) =>
//     String(
//       leave?.leaveTypeName ??
//         leave?.description ??
//         leave?.name ??
//         ""
//     );

//   // -------------------- Current Leave Type Mappings --------------------
//   const mappedProjects = useMemo(() => {
//     if (!selectedLeaveType) return [];

//     return mappings
//       .filter(
//         (mapping) =>
//           normalizeId(mapping.leaveType).toLowerCase() ===
//           normalizeId(selectedLeaveType).toLowerCase()
//       )
//       .map((mapping) => ({
//         id: mapping.id,
//         projectId: normalizeId(mapping.projectId),
//       }));
//   }, [mappings, selectedLeaveType]);

//   // Reset project selection when the leave type changes.
//   useEffect(() => {
//     setSelectedProjectIds(
//       mappedProjects.map((project) => project.projectId)
//     );
//   }, [mappedProjects]);

//   // -------------------- Project Search API --------------------
// //   const fetchProjects = useCallback(
// //     async (query) => {
// //       const search = query.trim();

// //       if (search.length < 4) {
// //         setAvailableProjects([]);
// //         setProjectLoading(false);
// //         return;
// //       }

// //       setProjectLoading(true);
// //       setError("");

// //       try {
// //         const params = new URLSearchParams({
// //           UserId: String(userId),
// //           Role: String(role),
// //           type: "PROJECT",
// //           ProjId: search,
// //           take: String(lookupTake),
// //         });

// //         const response = await fetch(
// //           `${backendUrl}/api/Project/GetAllProjectsForSearchV3?${params}`
// //         );

// //         if (!response.ok) {
// //           throw new Error(`Request failed: ${response.status}`);
// //         }

// //         const data = await response.json();

// //         const normalized = (Array.isArray(data) ? data : [])
// //           .map((project) => ({
// //             projectId: normalizeId(
// //               project?.projectId ?? project?.projId ?? project?.id
// //             ),
// //             name: String(
// //               project?.name ?? project?.projName ?? project?.projectName ?? ""
// //             ),
// //           }))
// //           .filter((project) => project.projectId);

// //         setAvailableProjects(normalized);
// //       } catch (err) {
// //         console.error("Failed to search projects:", err);
// //         setAvailableProjects([]);
// //         setError("Failed to load projects. Please try again.");
// //       } finally {
// //         setProjectLoading(false);
// //       }
// //     },
// //     [userId, role, lookupTake]
// //   );

// const fetchProjects = useCallback(
//   async (query) => {
//     const search = String(query ?? "").trim();

//     if (search.length < 4) {
//       setAvailableProjects([]);
//       setProjectLoading(false);
//       setError("");
//       return;
//     }

//     setProjectLoading(true);
//     setError("");

//     try {

//       const apiUrl =
//         `${backendUrl}/Project/GetAllLeaveProject`;

//       const response = await fetch(apiUrl, {
//         credentials: "include",
//       });

//       if (!response.ok) {
//         throw new Error(`Request failed: ${response.status}`);
//       }

//       const data = await response.json();

//       const projects = Array.isArray(data)
//         ? data
//         : Array.isArray(data?.data)
//           ? data.data
//           : Array.isArray(data?.projects)
//             ? data.projects
//             : [];

//       const normalized = projects
//         .map((project) => ({
//           projectId: normalizeId(
//             project?.projectId ??
//               project?.projId ??
//               project?.projID ??
//               project?.PROJ_ID ??
//               project?.id
//           ),
//           name: String(
//             project?.name ??
//               project?.projName ??
//               project?.projectName ??
//               project?.projDesc ??
//               project?.description ??
//               ""
//           ),
//         }))
//         .filter((project) => project.projectId);

//       setAvailableProjects(normalized);
//     } catch (err) {
//       console.error("Failed to search projects:", err);
//       setAvailableProjects([]);
//       setError("Failed to load projects. Please try again.");
//     } finally {
//       setProjectLoading(false);
//     }
//   },
//   [userId, role, lookupTake]
// );

//   const debouncedFetchProjects = useMemo(
//     () => debounce((query) => fetchProjects(query), 500),
//     [fetchProjects]
//   );

//   useEffect(() => {
//     return () => debouncedFetchProjects.cancel();
//   }, [debouncedFetchProjects]);

//   useEffect(() => {
//     const query = searchTerm.trim();

//     if (query.length >= 4) {
//       setProjectLoading(true);
//       debouncedFetchProjects(query);
//     } else {
//       debouncedFetchProjects.cancel();
//       setAvailableProjects([]);
//       setProjectLoading(false);
//       setError("");
//     }
//   }, [searchTerm, debouncedFetchProjects]);

//   const clearSearch = () => {
//     debouncedFetchProjects.cancel();
//     setSearchTerm("");
//     setAvailableProjects([]);
//     setProjectLoading(false);
//     setError("");
//   };

//   // -------------------- Project Selection --------------------
//   const isProjectSelected = (projectId) =>
//     selectedProjectIds.some(
//       (id) => normalizeId(id) === normalizeId(projectId)
//     );

//   const toggleProject = (projectId) => {
//     const id = normalizeId(projectId);

//     setSelectedProjectIds((previous) =>
//       previous.some((item) => normalizeId(item) === id)
//         ? previous.filter((item) => normalizeId(item) !== id)
//         : [...previous, id]
//     );
//   };

//   const toggleSelectAll = (projects) => {
//     const ids = projects
//       .map((project) => normalizeId(project.projectId))
//       .filter(Boolean);

//     const allSelected =
//       ids.length > 0 && ids.every((id) => isProjectSelected(id));

//     setSelectedProjectIds((previous) =>
//       allSelected
//         ? previous.filter(
//             (id) => !ids.includes(normalizeId(id))
//           )
//         : [
//             ...previous,
//             ...ids.filter(
//               (id) =>
//                 !previous.some(
//                   (existing) => normalizeId(existing) === id
//                 )
//             ),
//           ]
//     );
//   };

//   // -------------------- Project Table Rows --------------------
//   const projectRows = useMemo(() => {
//     const details = new Map();

//     // Existing mappings remain visible even when unchecked.
//     mappedProjects.forEach((project) => {
//       details.set(project.projectId, {
//         projectId: project.projectId,
//         name: "",
//         wasMapped: true,
//       });
//     });

//     // Add search results to the same table.
//     availableProjects.forEach((project) => {
//       const id = normalizeId(project.projectId);
//       const existing = details.get(id);

//       details.set(id, {
//         projectId: id,
//         name: project.name || existing?.name || "",
//         wasMapped: existing?.wasMapped ?? false,
//       });
//     });

//     return [...details.values()].sort((a, b) =>
//       a.projectId.localeCompare(b.projectId, undefined, {
//         numeric: true,
//         sensitivity: "base",
//       })
//     );
//   }, [mappedProjects, availableProjects]);

//   const filteredProjectRows = useMemo(() => {
//     const query = searchTerm.trim().toLowerCase();

//     // When the query is under 4 characters, only existing mappings are shown.
//     return projectRows.filter((project) => {
//       if (project.wasMapped) return true;
//       if (query.length < 4) return false;

//       return (
//         project.projectId.toLowerCase().includes(query) ||
//         project.name.toLowerCase().includes(query)
//       );
//     });
//   }, [projectRows, searchTerm]);

//   // -------------------- Save / Update Mapping --------------------
//   const saveMappings = async () => {
//     if (!selectedLeaveType) {
//       toast.warn("Select a leave type first.");
//       return;
//     }

//     if (saving) return;

//     const selectedIds = new Set(
//       selectedProjectIds.map((id) => normalizeId(id))
//     );

//     const currentIds = new Set(
//       mappedProjects.map((project) => normalizeId(project.projectId))
//     );

//     const projectsToAdd = [...selectedIds].filter(
//       (id) => id && !currentIds.has(id)
//     );

//     const mappingsToDelete = mappedProjects.filter(
//       (project) => !selectedIds.has(normalizeId(project.projectId))
//     );

//     if (projectsToAdd.length === 0 && mappingsToDelete.length === 0) {
//       toast.info("No changes to save.");
//       return;
//     }

//     setSaving(true);

//     try {
//       // Create new mappings first.
//       if (projectsToAdd.length > 0) {
//         await axios.post(
//           `${backendUrl}/api/ProjectLeaveMapping`,
//           projectsToAdd.map((projectId) => ({
//             leaveType: selectedLeaveType,
//             projectId,
//           }))
//         );
//       }

//       // Remove mappings that were unchecked.
//       if (mappingsToDelete.length > 0) {
//         await axios.delete(
//           `${backendUrl}/api/ProjectLeaveMapping/bulk`,
//           {
//             data: mappingsToDelete.map((mapping) => mapping.id),
//           }
//         );
//       }

//       await fetchMappings();

//       toast.success("Leave type ↔ Project mapping updated.");
//     } catch (err) {
//       console.error("Failed to save project mappings:", err);

//       const message =
//         err?.response?.data?.message ||
//         err?.response?.data?.title ||
//         (typeof err?.response?.data === "string"
//           ? err.response.data
//           : null);

//       toast.error(
//         message || "Failed to update leave type ↔ Project mapping."
//       );

//       // Refresh the actual database state after a partial failure.
//       await fetchMappings();
//     } finally {
//       setSaving(false);
//     }
//   };

//   // -------------------- UI --------------------
//   return (
//     <div className="min-h-screen text-gray-900 flex w-full">
//       <div className="w-full p-2 mt-10 space-y-2">
//         {/* Header */}
//         <div className="p-4 border-b w-full rounded-sm border-gray-100 flex items-center justify-between bg-white">
//           <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//             <AiOutlineFundProjectionScreen
//               size={20}
//               className="text-blue-500"
//             />
//             Leave Type ↔ Project Mapping
//           </h2>
//         </div>

//         <div className="bg-white p-2 w-full rounded">
//           <div className="flex items-center gap-x-4 mb-3 px-2">
//             <h3 className="text-sm font-semibold text-gray-900">
//               Mapping Configuration
//             </h3>

//             <div className="flex flex-1 justify-end">
//               <button
//                 type="button"
//                 onClick={saveMappings}
//                 disabled={!selectedLeaveType || saving || loading}
//                 className="bg-[#17414d] btn1 btn-blue disabled:opacity-60"
//               >
//                 {saving ? "Saving..." : "Save / Update"}
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-2 pb-4">
//             {/* LEFT TABLE: LEAVE TYPES */}
//             <div className="border border-gray-300 rounded overflow-hidden">
//               <div className="px-3 py-2 bg-gray-50 border-b border-gray-300 flex items-center justify-between">
//                 <h4 className="text-sm font-semibold text-gray-900">
//                   Leave Types
//                 </h4>

//                 <span className="text-[11px] text-gray-500">
//                   {leaveTypes.length} available
//                 </span>
//               </div>

//               <div className="overflow-auto max-h-[420px]">
//                 <table className="w-full text-sm">
//                   <thead className="thead sticky top-0 z-10">
//                     <tr className="bg-white border-b border-gray-300">
//                       <th className="th-thead text-left text-black text-xs">
//                         Leave Type Code
//                       </th>
//                       <th className="th-thead text-left text-black text-xs">
//                         Leave Type Name
//                       </th>
//                       <th className="th-thead text-center text-black text-xs">
//                         Mapped Projects
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {leaveLoading ? (
//                       <tr>
//                         <td colSpan={3} className="px-3 py-6 text-center text-gray-500">
//                           Loading leave types...
//                         </td>
//                       </tr>
//                     ) : leaveTypes.length === 0 ? (
//                       <tr>
//                         <td colSpan={3} className="px-3 py-6 text-center text-gray-500">
//                           No leave types found.
//                         </td>
//                       </tr>
//                     ) : (
//                       leaveTypes.map((leave) => {
//                         const code = getLeaveTypeCode(leave);
//                         const selected =
//                           normalizeId(selectedLeaveType).toLowerCase() ===
//                           normalizeId(code).toLowerCase();

//                         const count = mappings.filter(
//                           (mapping) =>
//                             normalizeId(mapping.leaveType).toLowerCase() ===
//                             normalizeId(code).toLowerCase()
//                         ).length;

//                         return (
//                           <tr
//                             key={code}
//                             onClick={() => setSelectedLeaveType(code)}
//                             className={`cursor-pointer border-b border-gray-100 ${
//                               selected
//                                 ? "bg-[#eaf1f3]"
//                                 : "hover:bg-gray-50"
//                             }`}
//                           >
//                             <td className="tbody-td font-medium">
//                               <div className="flex items-center gap-2">
//                                 <input
//                                   type="radio"
//                                   name="selectedLeaveType"
//                                   checked={selected}
//                                   onChange={() => setSelectedLeaveType(code)}
//                                   className="w-3 h-3 accent-[#17414d]"
//                                 />
//                                 {code}
//                               </div>
//                             </td>

//                             <td className="tbody-td">
//                               {getLeaveTypeName(leave) || "-"}
//                             </td>

//                             <td className="tbody-td text-center">
//                               {count}
//                             </td>
//                           </tr>
//                         );
//                       })
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* RIGHT TABLE: PROJECT MAPPINGS */}
//             <div className="border border-gray-300 rounded overflow-hidden">
//               <div className="px-3 py-2 bg-gray-50 border-b border-gray-300 flex items-center justify-between">
//                 <h4 className="text-sm font-semibold text-gray-900">
//                   {selectedLeaveType
//                     ? `Projects for ${selectedLeaveType}`
//                     : "Mapped Projects"}
//                 </h4>

//                 <span className="text-[11px] text-gray-500">
//                   {selectedProjectIds.length} selected
//                 </span>
//               </div>

//               {/* Project Search */}
//               <div className="p-3 border-b border-gray-200">
//                 <label
//                   htmlFor="leaveProjectSearch"
//                   className="input-label block mb-1"
//                 >
//                   Search Projects
//                 </label>

//                 <div className="relative w-full">
//                   <Search
//                     size={15}
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
//                   />

//                   <input
//                     id="leaveProjectSearch"
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     placeholder="Search by Project ID or Name (min. 4 characters)"
//                     autoComplete="off"
//                     disabled={!selectedLeaveType}
//                     className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-full !pl-9 !pr-9 disabled:bg-gray-100"
//                   />

//                   {searchTerm && (
//                     <button
//                       type="button"
//                       onClick={clearSearch}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
//                       title="Clear search"
//                     >
//                       <X size={15} />
//                     </button>
//                   )}
//                 </div>

//                 <p className="text-[11px] text-gray-500 mt-1">
//                   Enter at least 4 characters to search for additional projects.
//                 </p>

//                 {error && (
//                   <p className="mt-1 text-[11px] text-red-500">{error}</p>
//                 )}
//               </div>

//               <div className="overflow-auto max-h-[340px]">
//                 <table className="w-full text-sm">
//                   <thead className="thead sticky top-0 z-10">
//                     <tr className="bg-white border-b border-gray-300">
//                       <th className="th-thead w-10 text-center text-black text-xs">
//                         <input
//                           type="checkbox"
//                           className="w-3 h-3"
//                           checked={
//                             filteredProjectRows.length > 0 &&
//                             filteredProjectRows.every((project) =>
//                               isProjectSelected(project.projectId)
//                             )
//                           }
//                           onChange={() => toggleSelectAll(filteredProjectRows)}
//                           disabled={
//                             !selectedLeaveType ||
//                             filteredProjectRows.length === 0 ||
//                             saving
//                           }
//                         />
//                       </th>

//                       <th className="th-thead text-left text-black text-xs">
//                         Project ID
//                       </th>

//                       <th className="th-thead text-left text-black text-xs">
//                         Project Name
//                       </th>

//                       <th className="th-thead text-left text-black text-xs">
//                         Status
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {!selectedLeaveType ? (
//                       <tr>
//                         <td colSpan={4} className="px-3 py-6 text-center text-gray-500">
//                           Select a leave type to view its projects.
//                         </td>
//                       </tr>
//                     ) : loading ? (
//                       <tr>
//                         <td colSpan={4} className="px-3 py-6 text-center text-gray-500">
//                           Loading mappings...
//                         </td>
//                       </tr>
//                     ) : projectLoading ? (
//                       <>
//                         {mappedProjects.map((project) => (
//                           <tr key={project.projectId} className="border-b border-gray-100">
//                             <td className="tbody-td text-center">
//                               <input
//                                 type="checkbox"
//                                 className="w-3 h-3"
//                                 checked={isProjectSelected(project.projectId)}
//                                 onChange={() => toggleProject(project.projectId)}
//                                 disabled={saving}
//                               />
//                             </td>
//                             <td className="tbody-td font-medium">{project.projectId}</td>
//                             <td className="tbody-td">-</td>
//                             <td className="tbody-td">
//                               <span className="text-[10px] font-medium rounded px-1.5 py-0.5 border text-green-600 bg-green-50 border-green-200">
//                                 {isProjectSelected(project.projectId) ? "Mapped" : "Unmapping"}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                         <tr>
//                           <td colSpan={4} className="px-3 py-3 text-center text-gray-500">
//                             Searching projects...
//                           </td>
//                         </tr>
//                       </>
//                     ) : filteredProjectRows.length === 0 ? (
//                       <tr>
//                         <td colSpan={4} className="px-3 py-6 text-center text-gray-500">
//                           {searchTerm.trim().length < 4
//                             ? mappedProjects.length > 0
//                               ? "Only existing mappings are shown. Search using at least 4 characters to add projects."
//                               : "No projects mapped. Search using at least 4 characters to add projects."
//                             : "No projects found."}
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredProjectRows.map((project) => {
//                         const selected = isProjectSelected(project.projectId);

//                         const status = project.wasMapped
//                           ? selected
//                             ? "Mapped"
//                             : "Unmapping"
//                           : selected
//                             ? "New Mapping"
//                             : "Available";

//                         return (
//                           <tr
//                             key={project.projectId}
//                             className="hover:bg-gray-50 border-b border-gray-100"
//                           >
//                             <td className="tbody-td text-center">
//                               <input
//                                 type="checkbox"
//                                 className="w-3 h-3"
//                                 checked={selected}
//                                 onChange={() => toggleProject(project.projectId)}
//                                 disabled={saving}
//                               />
//                             </td>

//                             <td className="tbody-td font-medium">
//                               {project.projectId}
//                             </td>

//                             <td className="tbody-td">
//                               {project.name || "-"}
//                             </td>

//                             <td className="tbody-td">
//                               <span
//                                 className={`text-[10px] font-medium rounded px-1.5 py-0.5 border ${
//                                   status === "Mapped"
//                                     ? "text-green-600 bg-green-50 border-green-200"
//                                     : status === "Unmapping"
//                                       ? "text-orange-600 bg-orange-50 border-orange-200"
//                                       : status === "New Mapping"
//                                         ? "text-blue-600 bg-blue-50 border-blue-200"
//                                         : "text-gray-600 bg-gray-50 border-gray-200"
//                                 }`}
//                               >
//                                 {status}
//                               </span>
//                             </td>
//                           </tr>
//                         );
//                       })
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeaveProjectMapping;

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, X } from "lucide-react";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { toast } from "react-toastify";
import { backendUrl } from "./config";

const LeaveProjectMapping = () => {
  // -------------------- State --------------------
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);

  const [allProjects, setAllProjects] = useState([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const normalizeId = (value) => String(value ?? "").trim();

  // -------------------- Load Leave Types --------------------
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      setLeaveLoading(true);

      try {
        const response = await axios.get(`${backendUrl}/api/LeaveType`);
        const data = Array.isArray(response.data) ? response.data : [];

        setLeaveTypes(data);
      } catch (err) {
        console.error("Failed to load leave types:", err);
        toast.error("Failed to load leave types.");
      } finally {
        setLeaveLoading(false);
      }
    };

    fetchLeaveTypes();
  }, []);

  // -------------------- Load All Existing Mappings --------------------
  const fetchMappings = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${backendUrl}/api/ProjectLeaveMapping`);

      setMappings(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to load project leave mappings:", err);
      toast.error("Failed to load project mappings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMappings();
  }, [fetchMappings]);

  // -------------------- Load ALL Leave Projects (once) --------------------
  // The API returns every leave project; searching is done on the UI only.
  useEffect(() => {
    const fetchAllLeaveProjects = async () => {
      setProjectLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${backendUrl}/api/ProjectMaster`,
          { credentials: "include" },
        );

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();

        const projects = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.projects)
              ? data.projects
              : [];

        const normalized = projects
          .map((project) => ({
            projectId: normalizeId(
              project?.projectId ??
                project?.projId ??
                project?.projID ??
                project?.PROJ_ID ??
                project?.id,
            ),
            name: String(
              project?.name ??
                project?.projName ??
                project?.projectName ??
                project?.projDesc ??
                project?.description ??
                "",
            ),
          }))
          .filter((project) => project.projectId);

        setAllProjects(normalized);
      } catch (err) {
        console.error("Failed to load leave projects:", err);
        setAllProjects([]);
        setError("Failed to load projects. Please try again.");
      } finally {
        setProjectLoading(false);
      }
    };

    fetchAllLeaveProjects();
  }, []);

  // -------------------- Leave Type Helpers --------------------
  const getLeaveTypeCode = (leave) =>
    String(leave?.leaveTypeCode ?? leave?.leaveType ?? "");

  const getLeaveTypeName = (leave) =>
    String(leave?.leaveTypeName ?? leave?.description ?? leave?.name ?? "");

  // -------------------- Current Leave Type Mappings --------------------
  const mappedProjects = useMemo(() => {
    if (!selectedLeaveType) return [];

    return mappings
      .filter(
        (mapping) =>
          normalizeId(mapping.leaveType).toLowerCase() ===
          normalizeId(selectedLeaveType).toLowerCase(),
      )
      .map((mapping) => ({
        id: mapping.id,
        projectId: normalizeId(mapping.projectId),
      }));
  }, [mappings, selectedLeaveType]);

  // Reset project selection when the leave type (or its mappings) change.
  useEffect(() => {
    setSelectedProjectIds(mappedProjects.map((project) => project.projectId));
  }, [mappedProjects]);

  // -------------------- Search (UI only) --------------------
  const clearSearch = () => setSearchTerm("");

  // -------------------- Project Selection --------------------
  const isProjectSelected = (projectId) =>
    selectedProjectIds.some((id) => normalizeId(id) === normalizeId(projectId));

  const toggleProject = (projectId) => {
    const id = normalizeId(projectId);

    setSelectedProjectIds((previous) =>
      previous.some((item) => normalizeId(item) === id)
        ? previous.filter((item) => normalizeId(item) !== id)
        : [...previous, id],
    );
  };

  const toggleSelectAll = (projects) => {
    const ids = projects
      .map((project) => normalizeId(project.projectId))
      .filter(Boolean);

    const allSelected =
      ids.length > 0 && ids.every((id) => isProjectSelected(id));

    setSelectedProjectIds((previous) =>
      allSelected
        ? previous.filter((id) => !ids.includes(normalizeId(id)))
        : [
            ...previous,
            ...ids.filter(
              (id) =>
                !previous.some((existing) => normalizeId(existing) === id),
            ),
          ],
    );
  };

  // -------------------- Project Table Rows --------------------
  const projectRows = useMemo(() => {
    const details = new Map();

    allProjects.forEach((project) => {
      details.set(project.projectId, {
        projectId: project.projectId,
        name: project.name || "",
        wasMapped: false,
      });
    });

    // Mapped projects always exist in the table, even if missing from the list.
    mappedProjects.forEach((project) => {
      const existing = details.get(project.projectId);

      details.set(project.projectId, {
        projectId: project.projectId,
        name: existing?.name || "",
        wasMapped: true,
      });
    });

    // Mapped projects first, then by project ID.
    return [...details.values()].sort((a, b) => {
      if (a.wasMapped !== b.wasMapped) return a.wasMapped ? -1 : 1;

      return a.projectId.localeCompare(b.projectId, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
  }, [allProjects, mappedProjects]);

  const filteredProjectRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return projectRows;

    return projectRows.filter(
      (project) =>
        project.projectId.toLowerCase().includes(query) ||
        project.name.toLowerCase().includes(query),
    );
  }, [projectRows, searchTerm]);

  // -------------------- Save / Update Mapping --------------------
  const saveMappings = async () => {
    if (!selectedLeaveType) {
      toast.warn("Select a leave type first.");
      return;
    }

    if (saving) return;

    const selectedIds = new Set(
      selectedProjectIds.map((id) => normalizeId(id)),
    );

    const currentIds = new Set(
      mappedProjects.map((project) => normalizeId(project.projectId)),
    );

    const projectsToAdd = [...selectedIds].filter(
      (id) => id && !currentIds.has(id),
    );

    const mappingsToDelete = mappedProjects.filter(
      (project) => !selectedIds.has(normalizeId(project.projectId)),
    );

    if (projectsToAdd.length === 0 && mappingsToDelete.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    setSaving(true);

    try {
      // Create new mappings first.
      if (projectsToAdd.length > 0) {
        await axios.post(
          `${backendUrl}/api/ProjectLeaveMapping`,
          projectsToAdd.map((projectId) => ({
            leaveType: selectedLeaveType,
            projectId,
          })),
        );
      }

      // Remove mappings that were unchecked.
      if (mappingsToDelete.length > 0) {
        await axios.delete(`${backendUrl}/api/ProjectLeaveMapping/bulk`, {
          data: mappingsToDelete.map((mapping) => mapping.id),
        });
      }

      toast.success("Leave type ↔ Project mapping updated.");
    } catch (err) {
      console.error("Failed to save project mappings:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        (typeof err?.response?.data === "string" ? err.response.data : null);

      toast.error(message || "Failed to update leave type ↔ Project mapping.");

      // Refresh the actual database state after a partial failure.
      await fetchMappings();
    } finally {
        setSelectedProjectIds([])
      await fetchMappings();
      setSaving(false);
    }
  };

  // -------------------- Status Helper --------------------
  const getStatus = (project) => {
    const selected = isProjectSelected(project.projectId);

    if (project.wasMapped) return selected ? "Mapped" : "Unmapping";
    return selected ? "New Mapping" : "Available";
  };

  const statusClass = (status) =>
    status === "Mapped"
      ? "text-green-600 bg-green-50 border-green-200"
      : status === "Unmapping"
        ? "text-orange-600 bg-orange-50 border-orange-200"
        : status === "New Mapping"
          ? "text-blue-600 bg-blue-50 border-blue-200"
          : "text-gray-600 bg-gray-50 border-gray-200";

  // -------------------- UI --------------------
  return (
    <div className="min-h-screen text-gray-900 flex w-full">
      <div className="w-full p-2 space-y-2">
        {/* Page Header */}
        <div className="p-4 border-b w-full rounded-sm border-gray-100 flex items-center justify-between bg-white">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <AiOutlineFundProjectionScreen
              size={20}
              className="text-blue-500"
            />
            Leave ↔ Project Mapping
          </h2>
        </div>

        <div className="bg-white p-2 w-full rounded">
          <div className="flex items-center gap-x-4 mb-3 px-2">
            <h3 className="text-sm font-semibold text-gray-900">
              Mapping Configuration
            </h3>

            <div className="flex flex-1 justify-end">
              <button
                type="button"
                onClick={saveMappings}
                disabled={!selectedLeaveType || saving || loading}
                className="bg-[#17414d] btn1 btn-blue disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save / Update"}
              </button>
            </div>
          </div>

          {/* Tables stacked vertically */}
          <div className="flex flex-col gap-4 px-2 pb-4">
            {/* TOP TABLE: LEAVE TYPES */}
            <div className="border border-gray-300 rounded overflow-hidden">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-300 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900">
                  Leave Types
                </h4>

                <span className="text-[11px] text-gray-500">
                  {leaveTypes.length} available
                </span>
              </div>

              <div className="overflow-auto max-h-[300px]">
                <table className="w-full text-sm">
                  <thead className="thead sticky top-0 z-10">
                    <tr className="bg-white border-b border-gray-300">
                      <th className="th-thead text-left text-black text-xs">
                        Leave Type Code
                      </th>
                      <th className="th-thead text-left text-black text-xs">
                        Leave Type Name
                      </th>
                      <th className="th-thead text-center text-black text-xs">
                        Mapped Projects
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {leaveLoading ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-3 py-6 text-center text-gray-500"
                        >
                          Loading leave types...
                        </td>
                      </tr>
                    ) : leaveTypes.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-3 py-6 text-center text-gray-500"
                        >
                          No leave types found.
                        </td>
                      </tr>
                    ) : (
                      leaveTypes.map((leave) => {
                        const code = getLeaveTypeCode(leave);
                        const selected =
                          normalizeId(selectedLeaveType).toLowerCase() ===
                          normalizeId(code).toLowerCase();

                        const count = mappings.filter(
                          (mapping) =>
                            normalizeId(mapping.leaveType).toLowerCase() ===
                            normalizeId(code).toLowerCase(),
                        ).length;

                        return (
                          <tr
                            key={code}
                            onClick={() => setSelectedLeaveType(code)}
                            className={`cursor-pointer border-b border-gray-100 ${
                              selected ? "bg-[#eaf1f3]" : "hover:bg-gray-50"
                            }`}
                          >
                            <td className="tbody-td font-medium">
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="selectedLeaveType"
                                  checked={selected}
                                  onChange={() => setSelectedLeaveType(code)}
                                  className="w-3 h-3 accent-[#17414d]"
                                />
                                {code}
                              </div>
                            </td>

                            <td className="tbody-td">
                              {getLeaveTypeName(leave) || "-"}
                            </td>

                            <td className="tbody-td text-center">{count}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* BOTTOM TABLE: PROJECT MAPPINGS */}
            <div className="border border-gray-300 rounded overflow-hidden">
              {/* Header with search */}
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-300 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {selectedLeaveType
                      ? `Projects for ${selectedLeaveType}`
                      : "Mapped Projects"}
                  </h4>

                  <span className="text-[11px] text-gray-500">
                    {selectedProjectIds.length} selected
                    {searchTerm.trim() &&
                      ` • ${filteredProjectRows.length} shown`}
                  </span>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                  />

                  <input
                    id="leaveProjectSearch"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Project ID or Name"
                    autoComplete="off"
                    disabled={!selectedLeaveType}
                    className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-full !pl-9 !pr-9 disabled:bg-gray-100"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
                      title="Clear search"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <p className="px-3 py-1 text-[11px] text-red-500 border-b border-gray-200">
                  {error}
                </p>
              )}

              <div className="overflow-auto max-h-[420px]">
                <table className="w-full text-sm">
                  <thead className="thead sticky top-0 z-10">
                    <tr className="bg-white border-b border-gray-300">
                      <th className="th-thead w-10 text-center text-black text-xs">
                        <input
                          type="checkbox"
                          className="w-3 h-3"
                          checked={
                            filteredProjectRows.length > 0 &&
                            filteredProjectRows.every((project) =>
                              isProjectSelected(project.projectId),
                            )
                          }
                          onChange={() => toggleSelectAll(filteredProjectRows)}
                          disabled={
                            !selectedLeaveType ||
                            filteredProjectRows.length === 0 ||
                            saving
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
                    {!selectedLeaveType ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-6 text-center text-gray-500"
                        >
                          Select a leave type to view its projects.
                        </td>
                      </tr>
                    ) : loading || projectLoading ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-6 text-center text-gray-500"
                        >
                          Loading projects...
                        </td>
                      </tr>
                    ) : filteredProjectRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-6 text-center text-gray-500"
                        >
                          {searchTerm.trim()
                            ? "No projects match your search."
                            : "No projects found."}
                        </td>
                      </tr>
                    ) : (
                      filteredProjectRows.map((project) => {
                        const selected = isProjectSelected(project.projectId);
                        const status = getStatus(project);

                        return (
                          <tr
                            key={project.projectId}
                            className="hover:bg-gray-50 border-b border-gray-100"
                          >
                            <td className="tbody-td text-center">
                              <input
                                type="checkbox"
                                className="w-3 h-3"
                                checked={selected}
                                onChange={() =>
                                  toggleProject(project.projectId)
                                }
                                disabled={saving}
                              />
                            </td>

                            <td className="tbody-td font-medium">
                              {project.projectId}
                            </td>

                            <td className="tbody-td">{project.name || "-"}</td>

                            <td className="tbody-td">
                              <span
                                className={`text-[10px] font-medium rounded px-1.5 py-0.5 border ${statusClass(
                                  status,
                                )}`}
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

export default LeaveProjectMapping;
