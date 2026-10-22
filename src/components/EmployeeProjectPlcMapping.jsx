// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { backendUrl } from "./config";
// import { toast } from "react-toastify";
// import { AiOutlineFundProjectionScreen } from "react-icons/ai";
// import { useOutletContext } from "react-router-dom";
// import { debounce } from "lodash";
// import { Search, X } from "lucide-react";

// const EmployeeProjectPlcMapping = () => {
//   // Global lists & options
//   const [users, setUsers] = useState([]);
//   const [userOptions, setUserOptions] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
//   const [plcOptions, setPlcOptions] = useState([]);

//   // Mapping states
//   const [mappedProjectsForEmp, setMappedProjectsForEmp] = useState([]);
//   const [originalProjectsForEmp, setOriginalProjectsForEmp] = useState([]);
//   const [selectedProjectIds, setSelectedProjectIds] = useState([]);
//   const [projectPlcMap, setProjectPlcMap] = useState({}); // { [projId]: billLabCatCd }

//   // Search & Available Projects state
//   const [term, setTerm] = useState("");
//   const [availableProjects, setAvailableProjects] = useState([]);
//   const [selectedLevelFilter, setSelectedLevelFilter] = useState("ALL");

//   // UI / Loading states
//   const [userLoading, setUserLoading] = useState(false);
//   const [projectLoading, setProjectLoading] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const { canEdit } = useOutletContext
//     ? useOutletContext()
//     : { canEdit: () => true };
//   const isEditable = canEdit ? canEdit("projectOrgSecurity") : true;
//   const lookupTake = import.meta.env.VITE_GET_PROJECT_MASTER_LOOKUP || 500;

//   // --- Fetch Users and PLCs on Mount ---
//   useEffect(() => {
//     const fetchBaseData = async () => {
//       try {
//         setUserLoading(true);
//         // Fetch Users
//         const userRes = await axios.get(`${backendUrl}/api/User`);
//         const userData = userRes.data || [];
//         setUsers(userData);

//         const filteredUsers = userData.filter(
//           (u) => !u.role || u.role.toLowerCase() !== "admin",
//         );
//         setUserOptions(
//           filteredUsers.map((u) => ({
//             value: u.userId,
//             label: `${u.userId} - ${u.username || u.fullName || ""}`,
//           })),
//         );

//         // Fetch PLCs
//         const plcRes = await axios.get(`${backendUrl}/Project/GetAllPlcs/`);
//         const plcData = Array.isArray(plcRes.data) ? plcRes.data : [];
//         setPlcOptions(
//           plcData.map((plc) => ({
//             value: plc.laborCategoryCode,
//             label: `${plc.laborCategoryCode} - ${plc.description || ""}`,
//           })),
//         );
//       } catch (e) {
//         console.error("Base data fetch failed", e);
//         setError("Failed to load initial users or PLCs.");
//       } finally {
//         setUserLoading(false);
//       }
//     };
//     fetchBaseData();
//   }, []);

//   // --- Fetch Mapped Projects & PLCs for Selected Employee ---
//   useEffect(() => {
//     setTerm("");
//     setAvailableProjects([]);
//     setError(null);

//     if (!selectedEmployeeId) {
//       setMappedProjectsForEmp([]);
//       setOriginalProjectsForEmp([]);
//       setSelectedProjectIds([]);
//       setProjectPlcMap({});
//       return;
//     }

//     const fetchEmpMappings = async () => {
//       setProjectLoading(true);
//       try {
//         const res = await axios.get(
//           `${backendUrl}/api/ProjEmployeeLabcat/employee/${selectedEmployeeId}`,
//         );
//         const data = Array.isArray(res.data) ? res.data : [];

//         const normalized = data.map((item) => ({
//           projectId: item.projId,
//           name: item.projName || "",
//           billLabCatCd: item.billLabCatCd || "",
//         }));

//         setMappedProjectsForEmp(normalized);
//         setOriginalProjectsForEmp(normalized);
//         setSelectedProjectIds(normalized.map((p) => p.projectId));

//         // Build PLC lookup map
//         const plcMap = {};
//         normalized.forEach((p) => {
//           plcMap[p.projectId] = p.billLabCatCd;
//         });
//         setProjectPlcMap(plcMap);
//       } catch (e) {
//         console.error("Fetch employee project mappings failed", e);
//         setMappedProjectsForEmp([]);
//         setOriginalProjectsForEmp([]);
//         setSelectedProjectIds([]);
//         setProjectPlcMap({});
//       } finally {
//         setProjectLoading(false);
//       }
//     };

//     fetchEmpMappings();
//   }, [selectedEmployeeId]);

//   // --- Project Search Logic ---
//   const getCurrentUserContext = () => {
//     try {
//       const userString = localStorage.getItem("currentUser");
//       if (!userString) return { userId: "", role: "", fullName: "" };
//       const userObj = JSON.parse(userString);
//       return {
//         userId: userObj.userId ?? "",
//         role: userObj.role?.toLowerCase() ?? "",
//         fullName: userObj.fullName?.toLowerCase() ?? "",
//       };
//     } catch {
//       return { userId: "", role: "", fullName: "" };
//     }
//   };

//   const { userId, role } = getCurrentUserContext();

//   const fetchAllProjects = useCallback(
//     async (searchTerm) => {
//       if (!searchTerm || searchTerm.length < 4) {
//         setAvailableProjects([]);
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       try {
//         const apiUrl =
//           `${backendUrl}/Project/GetAllProjectsForSearchV3` +
//           `?UserId=${userId}` +
//           `&Role=${role}` +
//           `&type=PROJECT` +
//           `&ProjId=${encodeURIComponent(searchTerm)}` +
//           `&take=${lookupTake}`;

//         const response = await fetch(apiUrl);
//         if (!response.ok)
//           throw new Error(`HTTP error! status: ${response.status}`);
//         const projects = await response.json();
//         setAvailableProjects(Array.isArray(projects) ? projects : []);
//       } catch (e) {
//         console.error("Failed to load projects:", e);
//         setError("Failed to load project list. Please try again.");
//         setAvailableProjects([]);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [userId, role, lookupTake],
//   );

//   const debouncedFetchProjects = useMemo(
//     () =>
//       debounce((query) => {
//         fetchAllProjects(query);
//       }, 500),
//     [fetchAllProjects],
//   );

//   useEffect(() => {
//     return () => {
//       debouncedFetchProjects.cancel();
//     };
//   }, [debouncedFetchProjects]);

//   useEffect(() => {
//     const searchTerm = term.trim();
//     if (searchTerm.length >= 4) {
//       setLoading(true);
//       debouncedFetchProjects(searchTerm);
//     } else {
//       debouncedFetchProjects.cancel();
//       setAvailableProjects([]);
//       setLoading(false);
//       setError(null);
//     }
//   }, [term, debouncedFetchProjects]);

//   const handleClearProjectSearch = () => {
//     debouncedFetchProjects.cancel();
//     setTerm("");
//     setAvailableProjects([]);
//     setError(null);
//   };

//   const normalizeProjectId = (id) => String(id ?? "").trim();

//   const isProjectSelected = (projectId) => {
//     const normalizedId = normalizeProjectId(projectId);
//     return selectedProjectIds.some(
//       (id) => normalizeProjectId(id) === normalizedId,
//     );
//   };

//   const isProjectAlreadyMapped = (projectId) => {
//     const normalizedId = normalizeProjectId(projectId);
//     return originalProjectsForEmp.some(
//       (project) => normalizeProjectId(project.projectId) === normalizedId,
//     );
//   };

//   const handleAddSearchProject = (projectId, name) => {
//     const normalizedId = normalizeProjectId(projectId);
//     if (!normalizedId || isProjectAlreadyMapped(normalizedId)) return;

//     setSelectedProjectIds((prev) => {
//       const exists = prev.some((id) => normalizeProjectId(id) === normalizedId);
//       return exists ? prev : [...prev, projectId];
//     });

//     setProjectPlcMap((prev) => ({
//       ...prev,
//       [projectId]: prev[projectId] || "",
//     }));
//   };

//   const toggleProjectSelection = (projectId) => {
//     const normalizedId = normalizeProjectId(projectId);
//     setSelectedProjectIds((prev) => {
//       const exists = prev.some((id) => normalizeProjectId(id) === normalizedId);
//       return exists
//         ? prev.filter((id) => normalizeProjectId(id) !== normalizedId)
//         : [...prev, projectId];
//     });
//   };

//   const handlePlcChange = (projectId, plcValue) => {
//     setProjectPlcMap((prev) => ({
//       ...prev,
//       [projectId]: plcValue,
//     }));
//   };

//   const getProjectLevel = (projectId = "") => {
//     if (!projectId) return 0;
//     return projectId.split(".").filter(Boolean).length;
//   };

//   const filteredAvailableProjects = useMemo(() => {
//     if (!term || term.trim().length < 4) return [];
//     const lowerTerm = term.trim().toLowerCase();

//     return availableProjects.filter((project) => {
//       const pId = String(project.projectId || "").toLowerCase();
//       const pName = String(project.name || "").toLowerCase();

//       const matchesSearch =
//         pId.includes(lowerTerm) || pName.includes(lowerTerm);
//       if (!matchesSearch) return false;

//       const level = getProjectLevel(project.projectId);
//       if (selectedLevelFilter === "L1") return level === 1;
//       if (selectedLevelFilter === "L2") return level === 2;
//       if (selectedLevelFilter === "L3") return level >= 3;

//       return true;
//     });
//   }, [availableProjects, term, selectedLevelFilter]);

//   const projectMappingRows = useMemo(() => {
//     const ids = Array.from(
//       new Set([
//         ...originalProjectsForEmp.map((p) => normalizeProjectId(p.projectId)),
//         ...selectedProjectIds.map((id) => normalizeProjectId(id)),
//       ]),
//     ).filter(Boolean);

//     const details = new Map();
//     [...originalProjectsForEmp, ...availableProjects].forEach((project) => {
//       const projectId =
//         project?.projectId ?? project?.projId ?? project?.id ?? "";
//       const id = normalizeProjectId(projectId);
//       if (id && !details.has(id)) {
//         details.set(id, {
//           projectId,
//           name: project?.name ?? project?.projName ?? "",
//         });
//       }
//     });

//     return ids.map((id) => details.get(id)).filter(Boolean);
//   }, [originalProjectsForEmp, selectedProjectIds, availableProjects]);

// const saveEmployeeMappings = async () => {
//   if (!selectedEmployeeId) {
//     toast.warn("Select an employee first.");
//     return;
//   }

//   try {
//     setLoading(true);

//     const nowIso = new Date().toISOString();
//     const items = selectedProjectIds.map((projId) => ({
//       projId: String(projId),
//       emplId: String(selectedEmployeeId),
//       billLabCatCd: String(projectPlcMap[projId] || ""),
//       dfltFl: "s",
//       companyId: "",
//       startDt: nowIso,
//       endDt: "2078-12-31T00:00:00.000Z",
//     }));

//     const payload = { items };

//     await axios.post(
//       `${backendUrl}/api/ProjEmployeeLabcat/bulk-upsert`,
//       payload,
//     );

//     toast.success("Employee Project & PLC mapping updated successfully.");

//     const res = await axios.get(
//       `${backendUrl}/api/ProjEmployeeLabcat/employee/${selectedEmployeeId}`,
//     );
//     const data = Array.isArray(res.data) ? res.data : [];
//     const normalized = data.map((item) => ({
//       projectId: item.projId,
//       name: item.projName || "",
//       billLabCatCd: item.billLabCatCd || "",
//     }));
//     setOriginalProjectsForEmp(normalized);
//     setSelectedProjectIds(normalized.map((p) => p.projectId));
//   } catch (e) {
//     console.error("Save employee labcat mapping failed", e);
//     const apiMessage =
//       e?.response?.data?.message ||
//       e?.response?.data?.title ||
//       (typeof e?.response?.data === "string" ? e.response.data : null);
//     toast.error(apiMessage || "Failed to update mappings.");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="min-h-screen text-gray-900 flex w-full font-inter">
//       <div className="w-full space-y-2">
//         <div className="p-2 border-b w-full rounded-sm border-gray-100 flex items-center justify-between bg-white">
//           <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//             <AiOutlineFundProjectionScreen
//               size={20}
//               className="text-blue-500"
//             />
//             Employee Project & PLC Mapping
//           </h2>
//         </div>

//         {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

//         <div className="bg-white p-4 w-full rounded shadow-sm border border-gray-100">
//           <div className="p-2">
//             <div className="flex flex-col sm:flex-row sm:items-end gap-3">
//               <div className="flex items-center gap-2 w-full sm:w-[450px]">
//                 <label
//                   htmlFor="employeeSelect"
//                   className="input-label mb-1 block whitespace-nowrap font-medium text-xs"
//                 >
//                   Employee <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <Select
//                   inputId="employeeSelect"
//                   options={userOptions}
//                   isLoading={userLoading}
//                   className="outline-none w-full text-xs"
//                   value={
//                     selectedEmployeeId
//                       ? userOptions.find((o) => o.value === selectedEmployeeId)
//                       : null
//                   }
//                   onChange={(opt) =>
//                     setSelectedEmployeeId(opt ? opt.value : "")
//                   }
//                   isSearchable
//                   placeholder="Search & select employee..."
//                 />
//               </div>
//             </div>

//             {selectedEmployeeId && (
//               <div className="mt-4 flex flex-wrap items-center gap-3">
//                 <label
//                   htmlFor="projectSearch"
//                   className="input-label whitespace-nowrap text-xs font-medium"
//                 >
//                   Search Projects
//                 </label>
//                 <div className="relative w-full max-w-md">
//                   <Search
//                     size={15}
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
//                   />
//                   <input
//                     id="projectSearch"
//                     type="text"
//                     className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-full !pl-9 !pr-9"
//                     placeholder="Search Project ID or Name..."
//                     value={term}
//                     onChange={(e) => setTerm(e.target.value)}
//                     autoComplete="off"
//                   />
//                   {term && !loading && (
//                     <button
//                       type="button"
//                       onClick={handleClearProjectSearch}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
//                       title="Clear"
//                     >
//                       <X size={15} />
//                     </button>
//                   )}
//                   {loading && (
//                     <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                       <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
//                   <label className="text-xs font-medium text-gray-600">
//                     Level Filter:
//                   </label>
//                   <select
//                     value={selectedLevelFilter}
//                     onChange={(e) => setSelectedLevelFilter(e.target.value)}
//                     className="border border-gray-300 rounded px-2 py-1.5 text-xs bg-white outline-none focus:border-blue-500"
//                   >
//                     <option value="ALL">All Levels</option>
//                     <option value="L1">Top Level</option>
//                     <option value="L2">Level 2</option>
//                     <option value="L3">Level 3+</option>
//                   </select>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="rounded mt-4 px-2">
//             <div className="flex items-center gap-x-4 mb-2">
//               <h3 className="text-sm font-semibold text-gray-900">
//                 Project & PLC Assignments
//               </h3>
//               {selectedEmployeeId && (
//                 <div className="flex flex-1 justify-end">
//                   {isEditable && (
//                     <button
//                       onClick={saveEmployeeMappings}
//                       disabled={!selectedEmployeeId || loading}
//                       className="btn1 btn-blue disabled:opacity-60 text-xs px-4 py-2 rounded text-white font-semibold cursor-pointer"
//                     >
//                       {loading ? "Saving..." : "Save"}
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//               {/* Available Projects Table */}
//               <div className="border border-gray-300 rounded overflow-hidden">
//                 <div className="px-3 py-2 bg-gray-50 border-b border-gray-300 flex items-center justify-between">
//                   <h4 className="text-sm font-semibold text-gray-900">
//                     Available Projects
//                   </h4>
//                   <span className="text-[11px] text-gray-500">
//                     {filteredAvailableProjects.length} found
//                   </span>
//                 </div>
//                 <div className="overflow-x-auto max-h-80">
//                   <table className="w-full text-sm">
//                     <thead className="thead">
//                       <tr className="bg-white border-b border-gray-300">
//                         <th className="th-thead w-10 text-center text-black text-xs">
//                           <input
//                             type="checkbox"
//                             className="w-3 h-3"
//                             checked={
//                               filteredAvailableProjects.length > 0 &&
//                               filteredAvailableProjects.every((p) =>
//                                 isProjectSelected(p.projectId),
//                               )
//                             }
//                             onChange={() => {
//                               const allSelected =
//                                 filteredAvailableProjects.every((p) =>
//                                   isProjectSelected(p.projectId),
//                                 );
//                               const newIds = allSelected
//                                 ? selectedProjectIds.filter(
//                                     (id) =>
//                                       !filteredAvailableProjects.some(
//                                         (p) => p.projectId === id,
//                                       ),
//                                   )
//                                 : [
//                                     ...new Set([
//                                       ...selectedProjectIds,
//                                       ...filteredAvailableProjects.map(
//                                         (p) => p.projectId,
//                                       ),
//                                     ]),
//                                   ];
//                               setSelectedProjectIds(newIds);
//                             }}
//                             disabled={
//                               !isEditable ||
//                               filteredAvailableProjects.length === 0
//                             }
//                           />
//                         </th>
//                         <th className="th-thead text-left text-black text-xs">
//                           Project ID
//                         </th>
//                         <th className="th-thead text-left text-black text-xs">
//                           Project Name
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {!selectedEmployeeId ? (
//                         <tr>
//                           <td
//                             colSpan={3}
//                             className="px-3 py-6 text-center text-gray-500 text-xs"
//                           >
//                             Select an employee first.
//                           </td>
//                         </tr>
//                       ) : loading ? (
//                         <tr>
//                           <td
//                             colSpan={3}
//                             className="px-3 py-6 text-center text-gray-500 text-xs"
//                           >
//                             Searching projects...
//                           </td>
//                         </tr>
//                       ) : term.trim().length < 4 ? (
//                         <tr>
//                           <td
//                             colSpan={3}
//                             className="px-3 py-6 text-center text-gray-500 text-xs"
//                           >
//                             Type at least 4 characters to search projects.
//                           </td>
//                         </tr>
//                       ) : filteredAvailableProjects.length === 0 ? (
//                         <tr>
//                           <td
//                             colSpan={3}
//                             className="px-3 py-6 text-center text-gray-500 text-xs"
//                           >
//                             No available projects found.
//                           </td>
//                         </tr>
//                       ) : (
//                         filteredAvailableProjects.map((project) => {
//                           const isSelected = isProjectSelected(
//                             project.projectId,
//                           );
//                           return (
//                             <tr
//                               key={project.projectId}
//                               className="hover:bg-gray-50"
//                             >
//                               <td className="tbody-td text-center">
//                                 <input
//                                   type="checkbox"
//                                   className="w-3 h-3 cursor-pointer"
//                                   checked={isSelected}
//                                   onChange={() =>
//                                     handleAddSearchProject(
//                                       project.projectId,
//                                       project.name,
//                                     )
//                                   }
//                                   disabled={!isEditable}
//                                 />
//                               </td>
//                               <td className="tbody-td font-medium text-xs">
//                                 {project.projectId}
//                               </td>
//                               <td className="tbody-td text-xs">
//                                 {project.name || "-"}
//                               </td>
//                             </tr>
//                           );
//                         })
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* Employee Mapped Projects & PLC Select Table */}
//               <div className="border border-gray-300 rounded overflow-hidden">
//                 <div className="px-3 py-2 bg-gray-50 border-b border-gray-300 flex items-center justify-between">
//                   <h4 className="text-sm font-semibold text-gray-900">
//                     Employee Mapped Projects & PLC
//                   </h4>
//                   <span className="text-[11px] text-gray-500">
//                     {projectMappingRows.length} mapped
//                   </span>
//                 </div>
//                 <div className="overflow-x-auto max-h-80">
//                   <table className="w-full text-sm">
//                     <thead className="thead">
//                       <tr className="bg-white border-b border-gray-300">
//                         <th className="th-thead w-10 text-center text-black text-xs">
//                           <input
//                             type="checkbox"
//                             className="w-3 h-3"
//                             checked={
//                               projectMappingRows.length > 0 &&
//                               projectMappingRows.every((p) =>
//                                 isProjectSelected(p.projectId),
//                               )
//                             }
//                             onChange={() => {
//                               const allSelected = projectMappingRows.every(
//                                 (p) => isProjectSelected(p.projectId),
//                               );
//                               setSelectedProjectIds(
//                                 allSelected
//                                   ? []
//                                   : projectMappingRows.map((p) => p.projectId),
//                               );
//                             }}
//                             disabled={
//                               !isEditable || projectMappingRows.length === 0
//                             }
//                           />
//                         </th>
//                         <th className="th-thead text-left text-black text-xs">
//                           Project ID
//                         </th>
//                         <th className="th-thead text-left text-black text-xs">
//                           Project Name
//                         </th>
//                         <th className="th-thead text-left text-black text-xs min-w-[160px]">
//                           Billing PLC Code
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {!selectedEmployeeId ? (
//                         <tr>
//                           <td
//                             colSpan={4}
//                             className="px-3 py-6 text-center text-gray-500 text-xs"
//                           >
//                             Select an employee to view mappings.
//                           </td>
//                         </tr>
//                       ) : projectLoading ? (
//                         <tr>
//                           <td
//                             colSpan={4}
//                             className="px-3 py-6 text-center text-gray-500 text-xs"
//                           >
//                             Loading mappings...
//                           </td>
//                         </tr>
//                       ) : projectMappingRows.length === 0 ? (
//                         <tr>
//                           <td
//                             colSpan={4}
//                             className="px-3 py-6 text-center text-gray-500 text-xs"
//                           >
//                             No projects mapped yet.
//                           </td>
//                         </tr>
//                       ) : (
//                         projectMappingRows.map((project) => {
//                           const projectId = project.projectId;
//                           const isSelected = isProjectSelected(projectId);

//                           return (
//                             <tr key={projectId} className="hover:bg-gray-50">
//                               <td className="tbody-td text-center">
//                                 <input
//                                   type="checkbox"
//                                   className="w-3 h-3 cursor-pointer"
//                                   checked={isSelected}
//                                   onChange={() =>
//                                     toggleProjectSelection(projectId)
//                                   }
//                                   disabled={!isEditable}
//                                 />
//                               </td>
//                               <td className="tbody-td font-medium text-xs">
//                                 {projectId}
//                               </td>
//                               <td className="tbody-td text-xs">
//                                 {project.name || "-"}
//                               </td>
//                               <td className="tbody-td">
//                                 <Select
//                                   options={plcOptions}
//                                   value={
//                                     projectPlcMap[projectId]
//                                       ? plcOptions.find(
//                                           (opt) =>
//                                             opt.value ===
//                                             projectPlcMap[projectId],
//                                         )
//                                       : null
//                                   }
//                                   onChange={(opt) =>
//                                     handlePlcChange(
//                                       projectId,
//                                       opt ? opt.value : "",
//                                     )
//                                   }
//                                   isDisabled={!isEditable || !isSelected}
//                                   placeholder="Select PLC..."
//                                   className="text-xs"
//                                   classNamePrefix="select"
//                                   isClearable
//                                 />
//                               </td>
//                             </tr>
//                           );
//                         })
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeProjectPlcMapping;

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { useOutletContext } from "react-router-dom";
import { debounce } from "lodash";
import { Search, X } from "lucide-react";

const EmployeeProjectPlcMapping = () => {
  // Global lists & options
  const [users, setUsers] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [plcOptions, setPlcOptions] = useState([]);

  // Mapping states
  const [mappedProjectsForEmp, setMappedProjectsForEmp] = useState([]);
  const [originalProjectsForEmp, setOriginalProjectsForEmp] = useState([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [projectPlcMap, setProjectPlcMap] = useState({}); // { [projId]: billLabCatCd }
  const [bulkSelectedProjectIds, setBulkSelectedProjectIds] = useState([]);
  const [bulkPlcValue, setBulkPlcValue] = useState(null);
  const [isGroupAssignOpen, setIsGroupAssignOpen] = useState(false);
  const [groupProjectSearch, setGroupProjectSearch] = useState("");

  // Search & Available Projects state
  const [term, setTerm] = useState("");
  const [availableProjects, setAvailableProjects] = useState([]);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState("ALL");

  // UI / Loading states
  const [userLoading, setUserLoading] = useState(false);
  const [projectLoading, setProjectLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { canEdit } = useOutletContext
    ? useOutletContext()
    : { canEdit: () => true };
  const isEditable = canEdit ? canEdit("projectOrgSecurity") : true;
  const lookupTake = import.meta.env.VITE_GET_PROJECT_MASTER_LOOKUP || 500;

  // --- Fetch Users and PLCs on Mount ---
  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        setUserLoading(true);
        // Fetch Users
        const userRes = await axios.get(`${backendUrl}/api/User`);
        const userData = userRes.data || [];
        setUsers(userData);

        const filteredUsers = userData.filter(
          (u) => !u.role || u.role.toLowerCase() !== "admin",
        );
        setUserOptions(
          filteredUsers.map((u) => ({
            value: u.userId,
            label: `${u.userId} - ${u.username || u.fullName || ""}`,
          })),
        );

        // Fetch PLCs
        const plcRes = await axios.get(`${backendUrl}/Project/GetAllPlcs/`);
        const plcData = Array.isArray(plcRes.data) ? plcRes.data : [];
        setPlcOptions(
          plcData.map((plc) => ({
            value: plc.laborCategoryCode,
            label: `${plc.laborCategoryCode} - ${plc.description || ""}`,
          })),
        );
      } catch (e) {
        console.error("Base data fetch failed", e);
        setError("Failed to load initial users or PLCs.");
      } finally {
        setUserLoading(false);
      }
    };
    fetchBaseData();
  }, []);

  // --- Fetch Mapped Projects & PLCs for Selected Employee ---
  useEffect(() => {
    setTerm("");
    setAvailableProjects([]);
    setBulkSelectedProjectIds([]);
    setBulkPlcValue(null);
    setIsGroupAssignOpen(false);
    setGroupProjectSearch("");
    setError(null);

    if (!selectedEmployeeId) {
      setMappedProjectsForEmp([]);
      setOriginalProjectsForEmp([]);
      setSelectedProjectIds([]);
      setProjectPlcMap({});
      return;
    }

    const fetchEmpMappings = async () => {
      setProjectLoading(true);
      try {
        const res = await axios.get(
          `${backendUrl}/api/ProjEmployeeLabcat/employee/${selectedEmployeeId}`,
        );
        const data = Array.isArray(res.data) ? res.data : [];

        const normalized = data.map((item) => ({
          projectId: item.projId,
          name: item.projName || "",
          billLabCatCd: item.billLabCatCd || "",
        }));

        setMappedProjectsForEmp(normalized);
        setOriginalProjectsForEmp(normalized);
        setSelectedProjectIds(normalized.map((p) => p.projectId));

        // Build PLC lookup map
        const plcMap = {};
        normalized.forEach((p) => {
          plcMap[p.projectId] = p.billLabCatCd;
        });
        setProjectPlcMap(plcMap);
      } catch (e) {
        console.error("Fetch employee project mappings failed", e);
        setMappedProjectsForEmp([]);
        setOriginalProjectsForEmp([]);
        setSelectedProjectIds([]);
        setProjectPlcMap({});
      } finally {
        setProjectLoading(false);
      }
    };

    fetchEmpMappings();
  }, [selectedEmployeeId]);

  // --- Project Search Logic ---
  const getCurrentUserContext = () => {
    try {
      const userString = localStorage.getItem("currentUser");
      if (!userString) return { userId: "", role: "", fullName: "" };
      const userObj = JSON.parse(userString);
      return {
        userId: userObj.userId ?? "",
        role: userObj.role?.toLowerCase() ?? "",
        fullName: userObj.fullName?.toLowerCase() ?? "",
      };
    } catch {
      return { userId: "", role: "", fullName: "" };
    }
  };

  const { userId: currentUserId, role } = getCurrentUserContext();

  const fetchAllProjects = useCallback(
    async (searchTerm) => {
      const trimmedSearchTerm = searchTerm?.trim() ?? "";

      if (trimmedSearchTerm.length < 4) {
        setAvailableProjects([]);
        setLoading(false);
        return;
      }

      // The endpoint requires UserId. Prefer the logged-in user's ID from
      // localStorage; if it is missing, fall back to the selected employee ID.
      const requestUserId = currentUserId || selectedEmployeeId;

      if (!requestUserId) {
        console.error(
          "Cannot search projects: UserId is empty. Check localStorage.currentUser and the selected employee.",
        );
        setAvailableProjects([]);
        setError("Unable to search projects because the user ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          UserId: String(requestUserId),
          Role: role || "",
          type: "PROJECT",
          ProjId: trimmedSearchTerm,
          take: String(lookupTake),
        });
        const apiUrl = `${backendUrl}/Project/GetAllProjectsForSearchV3?${params.toString()}`;

        console.log("Project search parameters:", {
          UserId: String(requestUserId),
          Role: role || "",
          ProjId: trimmedSearchTerm,
        });

        const response = await fetch(apiUrl);
        if (!response.ok) {
          const responseText = await response.text();
          throw new Error(
            `Project search failed (${response.status}): ${responseText}`,
          );
        }

        const projects = await response.json();
        const normalizedProjects = Array.isArray(projects)
          ? projects.map((project) => ({
              ...project,
              projectId:
                project.projectId ?? project.projId ?? project.id ?? "",
              name: project.name ?? project.projName ?? "",
            }))
          : [];

        setAvailableProjects(normalizedProjects);
      } catch (e) {
        console.error("Failed to load projects:", e);
        setError("Failed to load project list. Please try again.");
        setAvailableProjects([]);
      } finally {
        setLoading(false);
      }
    },
    [currentUserId, selectedEmployeeId, role, lookupTake],
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

  const handleClearProjectSearch = () => {
    debouncedFetchProjects.cancel();
    setTerm("");
    setAvailableProjects([]);
    setError(null);
  };

  const normalizeProjectId = (id) => String(id ?? "").trim();

  const isProjectSelected = (projectId) => {
    const normalizedId = normalizeProjectId(projectId);
    return selectedProjectIds.some(
      (id) => normalizeProjectId(id) === normalizedId,
    );
  };

  const isProjectAlreadyMapped = (projectId) => {
    const normalizedId = normalizeProjectId(projectId);
    return originalProjectsForEmp.some(
      (project) => normalizeProjectId(project.projectId) === normalizedId,
    );
  };

  const handleAddSearchProject = (projectId, name) => {
    const normalizedId = normalizeProjectId(projectId);
    if (!normalizedId || isProjectAlreadyMapped(normalizedId)) return;

    setSelectedProjectIds((prev) => {
      const exists = prev.some((id) => normalizeProjectId(id) === normalizedId);
      return exists ? prev : [...prev, projectId];
    });

    setProjectPlcMap((prev) => ({
      ...prev,
      [projectId]: prev[projectId] || "",
    }));
  };

  const toggleProjectSelection = (projectId) => {
    const normalizedId = normalizeProjectId(projectId);
    setSelectedProjectIds((prev) => {
      const exists = prev.some((id) => normalizeProjectId(id) === normalizedId);
      return exists
        ? prev.filter((id) => normalizeProjectId(id) !== normalizedId)
        : [...prev, projectId];
    });
  };

  const handlePlcChange = (projectId, plcValue) => {
    setProjectPlcMap((prev) => ({
      ...prev,
      [projectId]: plcValue,
    }));
  };

  const toggleBulkProjectSelection = (projectId) => {
    const normalizedId = normalizeProjectId(projectId);
    setBulkSelectedProjectIds((prev) =>
      prev.some((id) => normalizeProjectId(id) === normalizedId)
        ? prev.filter((id) => normalizeProjectId(id) !== normalizedId)
        : [...prev, projectId],
    );
  };

  const applyBulkPlc = () => {
    if (bulkSelectedProjectIds.length === 0) {
      toast.info("Select one or more projects for bulk PLC assignment.");
      return;
    }
    if (!bulkPlcValue) {
      toast.info("Choose a PLC code to apply.");
      return;
    }

    setProjectPlcMap((prev) => {
      const updated = { ...prev };
      bulkSelectedProjectIds.forEach((projectId) => {
        updated[projectId] = bulkPlcValue.value;
      });
      return updated;
    });
    toast.success(
      `PLC ${bulkPlcValue.label} applied to ${bulkSelectedProjectIds.length} selected project(s). Save Mappings to persist changes.`,
    );
    setBulkSelectedProjectIds([]);
    setBulkPlcValue(null);
    setIsGroupAssignOpen(false);
    setGroupProjectSearch("");
  };

  const getProjectLevel = (projectId = "") => {
    if (!projectId) return 0;
    return projectId.split(".").filter(Boolean).length;
  };

  const filteredAvailableProjects = useMemo(() => {
    if (!term || term.trim().length < 4) return [];
    const lowerTerm = term.trim().toLowerCase();

    return availableProjects.filter((project) => {
      const pId = String(project.projectId || "").toLowerCase();
      const pName = String(project.name || "").toLowerCase();

      const matchesSearch =
        pId.includes(lowerTerm) || pName.includes(lowerTerm);
      if (!matchesSearch) return false;

      const level = getProjectLevel(project.projectId);
      if (selectedLevelFilter === "L1") return level === 1;
      if (selectedLevelFilter === "L2") return level === 2;
      if (selectedLevelFilter === "L3") return level >= 3;

      return true;
    });
  }, [availableProjects, term, selectedLevelFilter]);

  const projectMappingRows = useMemo(() => {
    const ids = Array.from(
      new Set([
        ...originalProjectsForEmp.map((p) => normalizeProjectId(p.projectId)),
        ...selectedProjectIds.map((id) => normalizeProjectId(id)),
      ]),
    ).filter(Boolean);

    const details = new Map();
    [...originalProjectsForEmp, ...availableProjects].forEach((project) => {
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
  }, [originalProjectsForEmp, selectedProjectIds, availableProjects]);

  const saveEmployeeMappings = async () => {
    if (!selectedEmployeeId) {
      toast.warn("Select an employee first.");
      return;
    }

    try {
      setLoading(true);

      const nowIso = new Date().toISOString();
      const items = selectedProjectIds.map((projId) => ({
        projId: String(projId),
        emplId: String(selectedEmployeeId),
        billLabCatCd: String(projectPlcMap[projId] || ""),
        dfltFl: "Y",
        companyId: "",
        startDt: nowIso,
        endDt: "2078-12-31T00:00:00.000Z",
      }));

      const payload = { items };

      await axios.post(
        `${backendUrl}/api/ProjEmployeeLabcat/bulk-upsert`,
        payload,
      );

      toast.success("Employee Project & PLC mapping updated successfully.");

      const res = await axios.get(
        `${backendUrl}/api/ProjEmployeeLabcat/employee/${selectedEmployeeId}`,
      );
      const data = Array.isArray(res.data) ? res.data : [];
      const normalized = data.map((item) => ({
        projectId: item.projId,
        name: item.projName || "",
        billLabCatCd: item.billLabCatCd || "",
      }));
      setOriginalProjectsForEmp(normalized);
      setSelectedProjectIds(normalized.map((p) => p.projectId));
    } catch (e) {
      console.error("Save employee labcat mapping failed", e);
      const apiMessage =
        e?.response?.data?.message ||
        e?.response?.data?.title ||
        (typeof e?.response?.data === "string" ? e.response.data : null);
      toast.error(apiMessage || "Failed to update mappings.");
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
            Employee Project & PLC Mapping
          </h2>
        </div>

        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        <div className="bg-white p-4 w-full rounded shadow-sm border border-gray-100">
          <div className="p-2">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="flex items-center gap-2 w-full sm:w-[450px]">
                <label
                  htmlFor="employeeSelect"
                  className="input-label mb-1 block whitespace-nowrap font-medium text-xs"
                >
                  Employee <span className="text-red-500 ml-1">*</span>
                </label>
                <Select
                  inputId="employeeSelect"
                  options={userOptions}
                  isLoading={userLoading}
                  className="outline-none w-full text-xs"
                  value={
                    selectedEmployeeId
                      ? userOptions.find((o) => o.value === selectedEmployeeId)
                      : null
                  }
                  onChange={(opt) =>
                    setSelectedEmployeeId(opt ? opt.value : "")
                  }
                  isSearchable
                  placeholder="Search & select employee..."
                />
              </div>
            </div>

            {selectedEmployeeId && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label
                  htmlFor="projectSearch"
                  className="input-label whitespace-nowrap text-xs font-medium"
                >
                  Search Projects
                </label>
                <div className="relative w-full max-w-md">
                  {/* <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                  /> */}
                  <input
                    id="projectSearch"
                    type="text"
                    className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-full !pl-9 !pr-9"
                    placeholder="Search Project ID or Name..."
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    autoComplete="off"
                  />
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
                  {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                    </div>
                  )}
                </div>

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
              </div>
            )}
          </div>

          <div className="rounded mt-4 px-2">
            <div className="flex items-center gap-x-4 mb-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Project & PLC Assignments
              </h3>
              {selectedEmployeeId && (
                <div className="flex flex-1 justify-end">
                  {isEditable && (
                    <button
                      onClick={saveEmployeeMappings}
                      disabled={!selectedEmployeeId || loading}
                      className="bg-[#17414d] btn1 btn-blue disabled:opacity-60 text-xs px-4 py-2 rounded text-white font-semibold cursor-pointer"
                    >
                      {loading ? "Saving..." : "Save Mappings"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {selectedEmployeeId && isEditable && (
              <div className="mb-3 flex flex-col gap-2 rounded border border-blue-100 bg-blue-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-800">
                    Group projects and assign one PLC
                  </p>
                  <p className="mt-1 text-[11px] text-gray-600">
                    Select projects in one place, choose a PLC, and apply it to
                    the whole group.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGroupAssignOpen(true)}
                  disabled={
                    projectMappingRows.length === 0 || loading || projectLoading
                  }
                  className="shrink-0 rounded bg-[#17414d] px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Group Projects & Assign PLC
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Available Projects Table */}
              <div className="border border-gray-300 rounded overflow-hidden">
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-300 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Available Projects
                  </h4>
                  <span className="text-[11px] text-gray-500">
                    {filteredAvailableProjects.length} found
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
                              filteredAvailableProjects.length > 0 &&
                              filteredAvailableProjects.every((p) =>
                                isProjectSelected(p.projectId),
                              )
                            }
                            onChange={() => {
                              const allSelected =
                                filteredAvailableProjects.every((p) =>
                                  isProjectSelected(p.projectId),
                                );
                              const newIds = allSelected
                                ? selectedProjectIds.filter(
                                    (id) =>
                                      !filteredAvailableProjects.some(
                                        (p) => p.projectId === id,
                                      ),
                                  )
                                : [
                                    ...new Set([
                                      ...selectedProjectIds,
                                      ...filteredAvailableProjects.map(
                                        (p) => p.projectId,
                                      ),
                                    ]),
                                  ];
                              setSelectedProjectIds(newIds);
                            }}
                            disabled={
                              !isEditable ||
                              filteredAvailableProjects.length === 0
                            }
                          />
                        </th>
                        <th className="th-thead text-left text-black text-xs">
                          Project ID
                        </th>
                        <th className="th-thead text-left text-black text-xs">
                          Project Name
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {!selectedEmployeeId ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-3 py-6 text-center text-gray-500 text-xs"
                          >
                            Select an employee first.
                          </td>
                        </tr>
                      ) : loading ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-3 py-6 text-center text-gray-500 text-xs"
                          >
                            Searching projects...
                          </td>
                        </tr>
                      ) : term.trim().length < 4 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-3 py-6 text-center text-gray-500 text-xs"
                          >
                            Type at least 4 characters to search projects.
                          </td>
                        </tr>
                      ) : filteredAvailableProjects.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-3 py-6 text-center text-gray-500 text-xs"
                          >
                            No available projects found.
                          </td>
                        </tr>
                      ) : (
                        filteredAvailableProjects.map((project) => {
                          const isSelected = isProjectSelected(
                            project.projectId,
                          );
                          return (
                            <tr
                              key={project.projectId}
                              className="hover:bg-gray-50"
                            >
                              <td className="tbody-td text-center">
                                <input
                                  type="checkbox"
                                  className="w-3 h-3 cursor-pointer"
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
                              <td className="tbody-td font-medium text-xs">
                                {project.projectId}
                              </td>
                              <td className="tbody-td text-xs">
                                {project.name || "-"}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Employee Mapped Projects & PLC Select Table */}
              <div className="border border-gray-300 rounded overflow-hidden">
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-300 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Employee Mapped Projects & PLC
                  </h4>
                  <span className="text-[11px] text-gray-500">
                    {projectMappingRows.length} mapped
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
                              projectMappingRows.every((p) =>
                                isProjectSelected(p.projectId),
                              )
                            }
                            onChange={() => {
                              const allSelected = projectMappingRows.every(
                                (p) => isProjectSelected(p.projectId),
                              );
                              setSelectedProjectIds(
                                allSelected
                                  ? []
                                  : projectMappingRows.map((p) => p.projectId),
                              );
                            }}
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
                        <th className="th-thead text-left text-black text-xs min-w-[160px]">
                          Billing PLC Code
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {!selectedEmployeeId ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-3 py-6 text-center text-gray-500 text-xs"
                          >
                            Select an employee to view mappings.
                          </td>
                        </tr>
                      ) : projectLoading ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-3 py-6 text-center text-gray-500 text-xs"
                          >
                            Loading mappings...
                          </td>
                        </tr>
                      ) : projectMappingRows.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-3 py-6 text-center text-gray-500 text-xs"
                          >
                            No projects mapped yet.
                          </td>
                        </tr>
                      ) : (
                        projectMappingRows.map((project) => {
                          const projectId = project.projectId;
                          const isSelected = isProjectSelected(projectId);

                          return (
                            <tr key={projectId} className="hover:bg-gray-50">
                              <td className="tbody-td text-center">
                                <input
                                  type="checkbox"
                                  className="w-3 h-3 cursor-pointer"
                                  checked={isSelected}
                                  onChange={() =>
                                    toggleProjectSelection(projectId)
                                  }
                                  disabled={!isEditable}
                                />
                              </td>
                              <td className="tbody-td font-medium text-xs">
                                {projectId}
                              </td>
                              <td className="tbody-td text-xs">
                                {project.name || "-"}
                              </td>
                              <td className="tbody-td">
                                <Select
                                  options={plcOptions}
                                  value={
                                    projectPlcMap[projectId]
                                      ? plcOptions.find(
                                          (opt) =>
                                            opt.value ===
                                            projectPlcMap[projectId],
                                        )
                                      : null
                                  }
                                  onChange={(opt) =>
                                    handlePlcChange(
                                      projectId,
                                      opt ? opt.value : "",
                                    )
                                  }
                                  isDisabled={!isEditable || !isSelected}
                                  placeholder="Select PLC..."
                                  className="text-xs"
                                  classNamePrefix="select"
                                  isClearable
                                />
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

      {isGroupAssignOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="groupAssignTitle"
        >
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h3
                  id="groupAssignTitle"
                  className="text-base font-semibold text-gray-900"
                >
                  Group Projects & Assign PLC
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Choose the projects that should share the same PLC code.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsGroupAssignOpen(false)}
                className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto px-5 py-4">
              <div>
                <label
                  htmlFor="groupProjectSearch"
                  className="mb-1 block text-xs font-medium text-gray-700"
                >
                  Find projects in this list
                </label>
                <input
                  id="groupProjectSearch"
                  type="text"
                  value={groupProjectSearch}
                  onChange={(e) => setGroupProjectSearch(e.target.value)}
                  placeholder="Filter by project ID or name..."
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-gray-600">
                  {bulkSelectedProjectIds.length} project(s) selected
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const query = groupProjectSearch.trim().toLowerCase();
                    const visibleProjects = projectMappingRows.filter(
                      (project) => {
                        const id = String(
                          project.projectId ?? "",
                        ).toLowerCase();
                        const name = String(project.name ?? "").toLowerCase();
                        return (
                          !query || id.includes(query) || name.includes(query)
                        );
                      },
                    );
                    const allVisibleSelected =
                      visibleProjects.length > 0 &&
                      visibleProjects.every((project) =>
                        bulkSelectedProjectIds.some(
                          (id) =>
                            normalizeProjectId(id) ===
                            normalizeProjectId(project.projectId),
                        ),
                      );
                    setBulkSelectedProjectIds((previous) => {
                      if (allVisibleSelected) {
                        const visibleIds = new Set(
                          visibleProjects.map((project) =>
                            normalizeProjectId(project.projectId),
                          ),
                        );
                        return previous.filter(
                          (id) => !visibleIds.has(normalizeProjectId(id)),
                        );
                      }
                      return Array.from(
                        new Map(
                          [
                            ...previous,
                            ...visibleProjects.map(
                              (project) => project.projectId,
                            ),
                          ].map((id) => [normalizeProjectId(id), id]),
                        ).values(),
                      );
                    });
                  }}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900"
                >
                  Select All
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto rounded border border-gray-200">
                {projectMappingRows
                  .filter((project) => {
                    const query = groupProjectSearch.trim().toLowerCase();
                    return (
                      !query ||
                      String(project.projectId ?? "")
                        .toLowerCase()
                        .includes(query) ||
                      String(project.name ?? "")
                        .toLowerCase()
                        .includes(query)
                    );
                  })
                  .map((project) => {
                    const projectId = project.projectId;
                    const checked = bulkSelectedProjectIds.some(
                      (id) =>
                        normalizeProjectId(id) ===
                        normalizeProjectId(projectId),
                    );
                    return (
                      <label
                        key={projectId}
                        className="flex cursor-pointer items-center gap-2.5 border-b border-gray-100 px-3 py-2 last:border-b-0 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 shrink-0 cursor-pointer"
                          checked={checked}
                          onChange={() => toggleBulkProjectSelection(projectId)}
                        />
                        <span className="flex min-w-0 flex-1 items-baseline gap-2">
                          <span className="shrink-0 whitespace-nowrap text-[11px] font-medium text-gray-700">
                            {projectId}
                          </span>
                          <span className="truncate text-[11px] font-normal text-gray-500">
                            ({project.name || "Unnamed project"})
                          </span>
                        </span>
                        {checked && (
                          <span className="shrink-0 text-[10px] font-medium text-blue-700">
                            In group
                          </span>
                        )}
                      </label>
                    );
                  })}
                {projectMappingRows.filter((project) => {
                  const query = groupProjectSearch.trim().toLowerCase();
                  return (
                    !query ||
                    String(project.projectId ?? "")
                      .toLowerCase()
                      .includes(query) ||
                    String(project.name ?? "")
                      .toLowerCase()
                      .includes(query)
                  );
                }).length === 0 && (
                  <p className="px-3 py-6 text-center text-xs text-gray-500">
                    No projects match your filter.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">
                  PLC to apply to this group
                </label>
                <Select
                  options={plcOptions}
                  value={bulkPlcValue}
                  onChange={setBulkPlcValue}
                  placeholder="Choose PLC code..."
                  className="text-xs"
                  classNamePrefix="select"
                  isClearable
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : undefined
                  }
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </div>
              <p className="text-[11px] text-gray-500">
                This applies the PLC to the selected projects on this screen.
                Click Save Mappings afterward to save changes to the system.
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-3">
              <button
                type="button"
                onClick={() => setIsGroupAssignOpen(false)}
                className="rounded border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyBulkPlc}
                disabled={
                  bulkSelectedProjectIds.length === 0 ||
                  !bulkPlcValue ||
                  loading
                }
                className="rounded bg-[#17414d] px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apply PLC to {bulkSelectedProjectIds.length} project(s)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProjectPlcMapping;
