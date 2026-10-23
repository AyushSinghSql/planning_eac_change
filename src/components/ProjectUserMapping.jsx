// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import axios from "axios";
// import Select from "react-select";
// import { backendUrl } from "./config";
// import { toast } from "react-toastify";
// import { AiOutlineFundProjectionScreen } from "react-icons/ai";
// import { useOutletContext } from "react-router-dom";

// export default function ProjectUserMapping({ onClose }) {
//   // Global lists & options
//   const [employeesList, setEmployeesList] = useState([]);
//   const [projectOptions, setProjectOptions] = useState([]);
//   const [selectedProjectId, setSelectedProjectId] = useState("");
//   const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);

//   // Mapping states
//   const [mappedEmployeesForProj, setMappedEmployeesForProj] = useState([]);
//   const [originalEmployeesForProj, setOriginalEmployeesForProj] = useState([]);
//   const [selectedEmployeeIds, setSelectedEmployeeIds] = useState(new Set());

//   // Search & Available Employees state
//   const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
//   const [inputValue, setInputValue] = useState("");

//   // UI / Loading states
//   const [projectLoading, setProjectLoading] = useState(false);
//   const [employeeLoading, setEmployeeLoading] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const { canEdit } = useOutletContext
//     ? useOutletContext()
//     : { canEdit: () => true };
//   const isEditable = canEdit ? canEdit("projectOrgSecurity") : true;
//   const lookupTake = import.meta.env.VITE_GET_PROJECT_MASTER_LOOKUP || 500;

//   // --- Fetch Employees on Mount ---
//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         setEmployeeLoading(true);
//         const empRes = await axios.get(`${backendUrl}/api/EmployeeMaster`);
//         const empData = Array.isArray(empRes.data) ? empRes.data : [];
//         setEmployeesList(empData);
//       } catch (e) {
//         console.error("Employee fetch failed", e);
//         setError("Failed to load initial employees.");
//       } finally {
//         setEmployeeLoading(false);
//       }
//     };
//     fetchEmployees();
//   }, []);

//   // --- Fetch Projects via Async Select ---
//   const fetchProjects = useCallback(
//     async (searchText) => {
//       const trimmedTerm =
//         typeof searchText === "string" ? searchText.trim() : "";
//       if (trimmedTerm.length < 4) {
//         return [];
//       }

//       try {
//         const res = await axios.get(`${backendUrl}/api/ProjectMaster/search`, {
//           params: { searchTerm: trimmedTerm, take: lookupTake },
//         });
//         const projData = Array.isArray(res.data) ? res.data : [];

//         return projData.map((p) => ({
//           value: p.projectId,
//           label: `${p.projectId} - ${p.projectName || ""} (PM: ${p.projectManagerName || "None"})`,
//           raw: p,
//         }));
//       } catch (e) {
//         console.error("Failed to load projects:", e);
//         setError("Failed to load project list. Please try again.");
//         return [];
//       }
//     },
//     [lookupTake],
//   );

//   const [asyncProjectOptions, setAsyncProjectOptions] = useState([]);

//   //   const handleProjectInputChange = async (newInput, { action }) => {
//   //     if (action === "input-change") {
//   //       const val = typeof newInput === "string" ? newInput : "";
//   //       setInputValue(val);
//   //       if (val.trim().length >= 4) {
//   //         setProjectLoading(true);
//   //         const results = await fetchProjects(val);
//   //         setAsyncProjectOptions(results);
//   //         setProjectLoading(false);
//   //       } else {
//   //         setAsyncProjectOptions([]);
//   //       }
//   //     }
//   //     return newInput;
//   //   };
//   const handleProjectInputChange = (newInput, { action }) => {
//     if (action === "input-change") {
//       const val = typeof newInput === "string" ? newInput : "";
//       setInputValue(val);
//       if (val.trim().length >= 4) {
//         setProjectLoading(true);
//         fetchProjects(val).then((results) => {
//           setAsyncProjectOptions(results);
//           setProjectLoading(false);
//         });
//       } else {
//         setAsyncProjectOptions([]);
//       }
//     }
//     return newInput;
//   };

//   // --- Fetch Mapped Employees for Selected Project ---
//   useEffect(() => {
//     setEmployeeSearchTerm("");
//     setError(null);

//     if (!selectedProjectId) {
//       setMappedEmployeesForProj([]);
//       setOriginalEmployeesForProj([]);
//       setSelectedEmployeeIds(new Set());
//       setSelectedProjectDetails(null);
//       return;
//     }

//     const matchedOpt = asyncProjectOptions.find(
//       (o) => o.value === selectedProjectId,
//     );
//     if (matchedOpt && matchedOpt.raw) {
//       setSelectedProjectDetails(matchedOpt.raw);
//     }

//     const fetchProjMappings = async () => {
//       setLoading(true);
//       try {
//         const res = await axios
//           .get(
//             `${backendUrl}/api/ProjEmployeeLabcat/project/${selectedProjectId}`,
//           )
//           .catch(() => ({ data: [] }));
//         const data = Array.isArray(res.data) ? res.data : [];

//         const normalized = data.map((item) => {
//           const matchedEmp = employeesList.find(
//             (emp) =>
//               String(emp.employeeId) === String(item.emplId || item.employeeId),
//           );
//           return {
//             employeeId: item.emplId || item.employeeId,
//             displayedName:
//               matchedEmp?.displayedName || item.displayedName || "",
//             lastName: matchedEmp?.lastName || item.lastName || "",
//             firstName: matchedEmp?.firstName || item.firstName || "",
//             status: matchedEmp?.status || item.status || "",
//           };
//         });

//         setMappedEmployeesForProj(normalized);
//         setOriginalEmployeesForProj(normalized);
//         setSelectedEmployeeIds(new Set(normalized.map((e) => e.employeeId)));
//       } catch (e) {
//         console.error("Fetch project employee mappings failed", e);
//         setMappedEmployeesForProj([]);
//         setOriginalEmployeesForProj([]);
//         setSelectedEmployeeIds(new Set());
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjMappings();
//   }, [selectedProjectId, employeesList, asyncProjectOptions]);

//   // Filtered employees for mapping table based on search
//   const filteredEmployeesForMapping = useMemo(() => {
//     if (!employeeSearchTerm.trim()) return employeesList;
//     const term = employeeSearchTerm.toLowerCase();
//     return employeesList.filter(
//       (emp) =>
//         (emp.displayedName && emp.displayedName.toLowerCase().includes(term)) ||
//         (emp.lastName && emp.lastName.toLowerCase().includes(term)) ||
//         (emp.firstName && emp.firstName.toLowerCase().includes(term)) ||
//         String(emp.employeeId).toLowerCase().includes(term),
//     );
//   }, [employeeSearchTerm, employeesList]);

//   const handleEmployeeToggle = (employeeId) => {
//     const updated = new Set(selectedEmployeeIds);
//     if (updated.has(employeeId)) {
//       updated.delete(employeeId);
//     } else {
//       updated.add(employeeId);
//     }
//     setSelectedEmployeeIds(updated);
//   };

//   const handleSelectAllEmployees = (e) => {
//     if (e.target.checked) {
//       const allIds = filteredEmployeesForMapping.map((emp) => emp.employeeId);
//       setSelectedEmployeeIds((prev) => new Set([...prev, ...allIds]));
//     } else {
//       const filteredIds = new Set(
//         filteredEmployeesForMapping.map((emp) => emp.employeeId),
//       );
//       setSelectedEmployeeIds((prev) => {
//         const next = new Set(prev);
//         filteredIds.forEach((id) => next.delete(id));
//         return next;
//       });
//     }
//   };

//   const areAllFilteredEmployeesSelected =
//     filteredEmployeesForMapping.length > 0 &&
//     filteredEmployeesForMapping.every((emp) =>
//       selectedEmployeeIds.has(emp.employeeId),
//     );

//   const saveProjectMappings = async () => {
//     if (!selectedProjectId) {
//       toast.warn("Select a project first.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const nowIso = new Date().toISOString();
//       const items = Array.from(selectedEmployeeIds).map((employeeId) => ({
//         projId: String(selectedProjectId),
//         emplId: String(employeeId),
//         billLabCatCd: "",
//         dfltFl: "s",
//         companyId: "",
//         startDt: nowIso,
//         endDt: "2078-12-31T00:00:00.000Z",
//       }));

//       const payload = { items };

//       await axios.post(
//         `${backendUrl}/api/ProjEmployeeLabcat/bulk-upsert`,
//         payload,
//       );
//       toast.success("Project & Employee mapping updated successfully.");

//       const res = await axios
//         .get(
//           `${backendUrl}/api/ProjEmployeeLabcat/project/${selectedProjectId}`,
//         )
//         .catch(() => ({ data: [] }));
//       const data = Array.isArray(res.data) ? res.data : [];
//       const normalized = data.map((item) => {
//         const matchedEmp = employeesList.find(
//           (emp) =>
//             String(emp.employeeId) === String(item.emplId || item.employeeId),
//         );
//         return {
//           employeeId: item.emplId || item.employeeId,
//           displayedName: matchedEmp?.displayedName || item.displayedName || "",
//           lastName: matchedEmp?.lastName || item.lastName || "",
//           firstName: matchedEmp?.firstName || item.firstName || "",
//           status: matchedEmp?.status || item.status || "",
//         };
//       });
//       setOriginalEmployeesForProj(normalized);
//       setSelectedEmployeeIds(new Set(normalized.map((e) => e.employeeId)));
//     } catch (e) {
//       console.error("Save project mapping failed", e);
//       toast.error("Failed to update project mappings.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white shadow-sm border border-gray-100 p-4 w-full font-inter text-xs">
//       <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
//         <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
//           <AiOutlineFundProjectionScreen size={18} className="text-blue-500" />
//           Project & Employee Mapping
//         </h2>
//         {onClose && (
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 font-medium cursor-pointer text-xs"
//           >
//             Close
//           </button>
//         )}
//       </div>

//       {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

//       <div className="space-y-4">
//         {/* Project Search & Selection Single Input Section */}
//         <div className="flex flex-col gap-2 bg-gray-50 p-3.5 rounded border border-gray-200 shadow-sm">
//           <div className="flex justify-between items-center">
//             <label className="font-semibold text-gray-700">
//               Select Project <span className="text-red-500">*</span>
//             </label>
//             <span className="text-[11px] text-gray-500">
//               Type at least 4 characters to search
//             </span>
//           </div>
//           <div>
//             <Select
//               options={asyncProjectOptions}
//               isLoading={projectLoading}
//               value={
//                 asyncProjectOptions.find(
//                   (o) => o.value === selectedProjectId,
//                 ) || null
//               }
//               onChange={(opt) => setSelectedProjectId(opt ? opt.value : "")}
//               onInputChange={handleProjectInputChange}
//               placeholder="Type at least 4 characters to search Project ID or Name..."
//               className="text-xs"
//               classNamePrefix="select"
//               isClearable
//               isSearchable
//               noOptionsMessage={() =>
//                 (inputValue || "").trim().length < 4
//                   ? "Please enter at least 4 characters..."
//                   : "No projects found"
//               }
//             />
//           </div>

//           {/* Project Details Card */}
//           {selectedProjectDetails && (
//             <div className="mt-2 p-3 bg-white border border-blue-200 rounded flex flex-wrap items-center justify-between gap-4 text-xs">
//               <div>
//                 <span className="text-gray-500 font-medium">Project ID:</span>{" "}
//                 <span className="font-bold text-black">
//                   {selectedProjectDetails.projectId}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-gray-500 font-medium">Name:</span>{" "}
//                 <span className="font-semibold text-black">
//                   {selectedProjectDetails.projectName}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-gray-500 font-medium">Type:</span>{" "}
//                 <span className="font-semibold text-black">
//                   {selectedProjectDetails.projectType || "-"}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-gray-500 font-medium">
//                   Project Manager:
//                 </span>{" "}
//                 <span className="font-bold text-blue-600">
//                   {selectedProjectDetails.projectManagerName || "Unassigned"}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Employee Mapping Table Section */}
//         {selectedProjectId ? (
//           <div className="flex flex-col gap-2">
//             <div className="flex justify-between items-center">
//               <label className="font-semibold text-gray-700">
//                 Map Employees to Project ({selectedEmployeeIds.size} selected)
//               </label>
//               {isEditable && (
//                 <button
//                   onClick={saveProjectMappings}
//                   disabled={loading}
//                   className="bg-[#17414d] text-white px-4 py-1.5 rounded font-semibold text-xs cursor-pointer disabled:opacity-50 shadow hover:bg-[#12333d] transition-colors"
//                 >
//                   {loading ? "Saving..." : "Save Mappings"}
//                 </button>
//               )}
//             </div>

//             <div className="border border-gray-300 rounded p-2.5 bg-gray-50 flex flex-col gap-2 shadow-sm">
//               <div className="flex gap-2 items-center">
//                 <input
//                   type="text"
//                   placeholder="Search employees to map..."
//                   value={employeeSearchTerm}
//                   onChange={(e) => setEmployeeSearchTerm(e.target.value)}
//                   className="bg-white flex-1 px-3 py-1.5 border border-gray-300 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-black"
//                 />
//               </div>

//               <div className="max-h-72 overflow-y-auto rounded border border-gray-300 bg-white">
//                 <table className="w-full text-xs border-collapse">
//                   <thead>
//                     <tr className="bg-[#e5f3fb] text-black sticky top-0 z-10 shadow-sm">
//                       <th className="w-10 px-2.5 py-2 border-b border-r border-gray-300 text-center font-semibold bg-[#e5f3fb]">
//                         <input
//                           type="checkbox"
//                           checked={areAllFilteredEmployeesSelected}
//                           onChange={handleSelectAllEmployees}
//                           className="rounded border-gray-300 cursor-pointer accent-blue-600"
//                         />
//                       </th>
//                       <th className="px-3 py-2 border-b border-r border-gray-300 text-left font-semibold bg-[#e5f3fb]">
//                         Employee ID
//                       </th>
//                       <th className="px-3 py-2 border-b border-r border-gray-300 text-left font-semibold bg-[#e5f3fb]">
//                         Displayed Name
//                       </th>
//                       <th className="px-3 py-2 border-b border-r border-gray-300 text-left font-semibold bg-[#e5f3fb]">
//                         Status
//                       </th>
//                       {/* <th className="px-3 py-2 border-b border-gray-300 text-left font-semibold bg-[#e5f3fb]">
//                         Supervisor
//                       </th> */}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredEmployeesForMapping.length === 0 ? (
//                       <tr>
//                         <td
//                           colSpan="5"
//                           className="text-center py-6 text-gray-400"
//                         >
//                           No employees found
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredEmployeesForMapping.map((emp) => {
//                         const isChecked = selectedEmployeeIds.has(
//                           emp.employeeId,
//                         );
//                         return (
//                           <tr
//                             key={emp.employeeId}
//                             onClick={() => handleEmployeeToggle(emp.employeeId)}
//                             className={`cursor-pointer transition-colors ${
//                               isChecked ? "bg-sky-50" : "hover:bg-gray-50"
//                             }`}
//                           >
//                             <td
//                               className="w-10 px-2.5 py-2 border-b border-r border-gray-300 text-center"
//                               onClick={(e) => e.stopPropagation()}
//                             >
//                               <input
//                                 type="checkbox"
//                                 checked={isChecked}
//                                 onChange={() =>
//                                   handleEmployeeToggle(emp.employeeId)
//                                 }
//                                 className="rounded border-gray-300 cursor-pointer accent-blue-600"
//                               />
//                             </td>
//                             <td className="px-3 py-2 border-b border-r border-gray-300 font-medium text-black">
//                               {emp.employeeId}
//                             </td>
//                             <td className="px-3 py-2 border-b border-r border-gray-300 font-semibold text-black">
//                               {emp.displayedName ||
//                                 `${emp.lastName}, ${emp.firstName}`}
//                             </td>
//                             <td className="px-3 py-2 border-b border-r border-gray-300 text-gray-600">
//                               {emp.status || "-"}
//                             </td>
//                             {/* <td className="px-3 py-2 border-b border-gray-300 text-gray-600">
//                               {emp.supervisorName || emp.supervisor || "-"}
//                             </td> */}
//                           </tr>
//                         );
//                       })
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="text-gray-400 text-center py-12 border border-dashed border-gray-300 rounded bg-gray-50">
//             Please select a project from the dropdown above to view and map
//             employees.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import Select from "react-select";
import { backendUrl } from "./config";
import { toast } from "react-toastify";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { useOutletContext } from "react-router-dom";

export default function ProjectUserMapping({ onClose }) {
  // Global lists & options
  const [employeesList, setEmployeesList] = useState([]);
  const [plcOptions, setPlcOptions] = useState([]);
  const [asyncProjectOptions, setAsyncProjectOptions] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);

  // Mapping states
  const [mappedEmployeesForProj, setMappedEmployeesForProj] = useState([]);
  const [originalEmployeesForProj, setOriginalEmployeesForProj] = useState([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState(new Set());
  const [employeePlcMap, setProjectPlcMap] = useState({}); // { [employeeId]: billLabCatCd }

  // Search & Available Employees state
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");

  // UI / Loading states
  const [projectLoading, setProjectLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { canEdit } = useOutletContext
    ? useOutletContext()
    : { canEdit: () => true };
  const isEditable = true;
  const lookupTake = import.meta.env.VITE_GET_PROJECT_MASTER_LOOKUP || 500;

  // --- Fetch Employees and PLCs on Mount ---
  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        setEmployeeLoading(true);
        const [empRes, plcRes] = await Promise.all([
          axios.get(`${backendUrl}/api/EmployeeMaster`),
          axios
            .get(`${backendUrl}/Project/GetAllPlcs/`)
            .catch(() => ({ data: [] })),
        ]);

        const empData = Array.isArray(empRes.data) ? empRes.data : [];
        setEmployeesList(empData);

        const plcData = Array.isArray(plcRes.data) ? plcRes.data : [];
        setPlcOptions(
          plcData.map((plc) => ({
            value: plc.laborCategoryCode,
            label: `${plc.laborCategoryCode} - ${plc.description || ""}`,
          })),
        );
      } catch (e) {
        console.error("Base data fetch failed", e);
        setError("Failed to load initial employees or PLCs.");
      } finally {
        setEmployeeLoading(false);
      }
    };
    fetchBaseData();
  }, []);

  // --- Fetch Projects via Async Select ---
  const fetchProjects = useCallback(
    async (searchText) => {
      const trimmedTerm =
        typeof searchText === "string" ? searchText.trim() : "";
      if (trimmedTerm.length < 4) {
        return [];
      }

      try {
        const res = await axios.get(`${backendUrl}/api/ProjectMaster/search`, {
          params: { searchTerm: trimmedTerm, take: lookupTake },
        });
        const projData = Array.isArray(res.data) ? res.data : [];

        return projData.map((p) => ({
          value: p.projectId,
          label: `${p.projectId} - ${p.projectName || ""} (PM: ${p.projectManagerName || "None"})`,
          raw: p,
        }));
      } catch (e) {
        console.error("Failed to load projects:", e);
        setError("Failed to load project list. Please try again.");
        return [];
      }
    },
    [lookupTake],
  );

  const handleProjectInputChange = (newInput, { action }) => {
    if (action === "input-change") {
      const val = typeof newInput === "string" ? newInput : "";
      setInputValue(val);
      if (val.trim().length >= 4) {
        setProjectLoading(true);
        fetchProjects(val).then((results) => {
          setAsyncProjectOptions(results);
          setProjectLoading(false);
        });
      } else {
        setAsyncProjectOptions([]);
      }
    }
    return newInput;
  };

  // --- Fetch Mapped Employees & PLC Codes for Selected Project ---
  useEffect(() => {
    setEmployeeSearchTerm("");
    setError(null);

    if (!selectedProjectId) {
      setMappedEmployeesForProj([]);
      setOriginalEmployeesForProj([]);
      setSelectedEmployeeIds(new Set());
      setProjectPlcMap({});
      setSelectedProjectDetails(null);
      return;
    }

    const matchedOpt = asyncProjectOptions.find(
      (o) => o.value === selectedProjectId,
    );
    if (matchedOpt && matchedOpt.raw) {
      setSelectedProjectDetails(matchedOpt.raw);
    }

    const fetchProjMappings = async () => {
      setLoading(true);
      try {
        const res = await axios
          .get(
            `${backendUrl}/api/ProjEmployeeLabcat/project/${selectedProjectId}`,
          )
          .catch(() => ({ data: [] }));
        const data = Array.isArray(res.data) ? res.data : [];

        const normalized = data.map((item) => {
          const matchedEmp = employeesList.find(
            (emp) =>
              String(emp.employeeId) === String(item.emplId || item.employeeId),
          );
          return {
            employeeId: item.emplId || item.employeeId,
            displayedName:
              matchedEmp?.displayedName || item.displayedName || "",
            lastName: matchedEmp?.lastName || item.lastName || "",
            firstName: matchedEmp?.firstName || item.firstName || "",
            status: matchedEmp?.status || item.status || "",
            billLabCatCd: item.billLabCatCd || "",
          };
        });

        setMappedEmployeesForProj(normalized);
        setOriginalEmployeesForProj(normalized);
        setSelectedEmployeeIds(new Set(normalized.map((e) => e.employeeId)));

        // Build PLC lookup map per employee
        const plcMap = {};
        normalized.forEach((e) => {
          plcMap[e.employeeId] = e.billLabCatCd;
        });
        setProjectPlcMap(plcMap);
      } catch (e) {
        console.error("Fetch project employee mappings failed", e);
        setMappedEmployeesForProj([]);
        setOriginalEmployeesForProj([]);
        setSelectedEmployeeIds(new Set());
        setProjectPlcMap({});
      } finally {
        setLoading(false);
      }
    };

    fetchProjMappings();
  }, [selectedProjectId, employeesList, asyncProjectOptions]);

  // Filter and sort employees: Mapped/Selected employees appear on top
  const filteredEmployeesForMapping = useMemo(() => {
    let result = employeesList;
    if (employeeSearchTerm.trim()) {
      const term = employeeSearchTerm.toLowerCase();
      result = employeesList.filter(
        (emp) =>
          (emp.displayedName &&
            emp.displayedName.toLowerCase().includes(term)) ||
          (emp.lastName && emp.lastName.toLowerCase().includes(term)) ||
          (emp.firstName && emp.firstName.toLowerCase().includes(term)) ||
          String(emp.employeeId).toLowerCase().includes(term),
      );
    }

    // Sort so that currently checked/selected employees appear at the top of the table
    return [...result].sort((a, b) => {
      const aSelected = selectedEmployeeIds.has(a.employeeId);
      const bSelected = selectedEmployeeIds.has(b.employeeId);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }, [employeeSearchTerm, employeesList, selectedEmployeeIds]);

  const handleEmployeeToggle = (employeeId) => {
    const updated = new Set(selectedEmployeeIds);
    if (updated.has(employeeId)) {
      updated.delete(employeeId);
    } else {
      updated.add(employeeId);
      // Initialize default empty PLC if not present
      if (!employeePlcMap[employeeId]) {
        setProjectPlcMap((prev) => ({ ...prev, [employeeId]: "" }));
      }
    }
    setSelectedEmployeeIds(updated);
  };

  const handleSelectAllEmployees = (e) => {
    if (e.target.checked) {
      const allIds = filteredEmployeesForMapping.map((emp) => emp.employeeId);
      setSelectedEmployeeIds((prev) => new Set([...prev, ...allIds]));

      setProjectPlcMap((prev) => {
        const next = { ...prev };
        allIds.forEach((id) => {
          if (!next[id]) next[id] = "";
        });
        return next;
      });
    } else {
      const filteredIds = new Set(
        filteredEmployeesForMapping.map((emp) => emp.employeeId),
      );
      setSelectedEmployeeIds((prev) => {
        const next = new Set(prev);
        filteredIds.forEach((id) => next.delete(id));
        return next;
      });
    }
  };

  const handlePlcChange = (employeeId, plcValue) => {
    setProjectPlcMap((prev) => ({
      ...prev,
      [employeeId]: plcValue,
    }));
  };

  const areAllFilteredEmployeesSelected =
    filteredEmployeesForMapping.length > 0 &&
    filteredEmployeesForMapping.every((emp) =>
      selectedEmployeeIds.has(emp.employeeId),
    );

  const saveProjectMappings = async () => {
    if (!selectedProjectId) {
      toast.warn("Select a project first.");
      return;
    }

    try {
      setLoading(true);
      const nowIso = new Date().toISOString();
      const items = Array.from(selectedEmployeeIds).map((employeeId) => ({
        projId: String(selectedProjectId),
        emplId: String(employeeId),
        billLabCatCd: String(employeePlcMap[employeeId] || ""),
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
      toast.success("Project, Employee & PLC mapping updated successfully.");

      const res = await axios
        .get(
          `${backendUrl}/api/ProjEmployeeLabcat/project/${selectedProjectId}`,
        )
        .catch(() => ({ data: [] }));
      const data = Array.isArray(res.data) ? res.data : [];
      const normalized = data.map((item) => {
        const matchedEmp = employeesList.find(
          (emp) =>
            String(emp.employeeId) === String(item.emplId || item.employeeId),
        );
        return {
          employeeId: item.emplId || item.employeeId,
          displayedName: matchedEmp?.displayedName || item.displayedName || "",
          lastName: matchedEmp?.lastName || item.lastName || "",
          firstName: matchedEmp?.firstName || item.firstName || "",
          status: matchedEmp?.status || item.status || "",
          billLabCatCd: item.billLabCatCd || "",
        };
      });
      setOriginalEmployeesForProj(normalized);
      setSelectedEmployeeIds(new Set(normalized.map((e) => e.employeeId)));

      const plcMap = {};
      normalized.forEach((e) => {
        plcMap[e.employeeId] = e.billLabCatCd;
      });
      setProjectPlcMap(plcMap);
    } catch (e) {
      console.error("Save project mapping failed", e);
      toast.error("Failed to update project mappings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-100 p-4 w-full font-inter text-xs">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <AiOutlineFundProjectionScreen size={18} className="text-blue-500" />
          Project, Employee & PLC Mapping
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-medium cursor-pointer text-xs"
          >
            Close
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

      <div className="space-y-4">
        {/* Project Search & Selection Single Input Section */}
        <div className="flex flex-col gap-2 bg-gray-50 p-3.5 rounded border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-gray-700">
              Select Project <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-gray-500">
              Type at least 4 characters to search
            </span>
          </div>
          <div>
            <Select
              options={asyncProjectOptions}
              isLoading={projectLoading}
              value={
                asyncProjectOptions.find(
                  (o) => o.value === selectedProjectId,
                ) || null
              }
              onChange={(opt) => setSelectedProjectId(opt ? opt.value : "")}
              onInputChange={handleProjectInputChange}
              placeholder="Type at least 4 characters to search Project ID or Name..."
              className="text-xs"
              classNamePrefix="select"
              isClearable
              isSearchable
              noOptionsMessage={() =>
                (inputValue || "").trim().length < 4
                  ? "Please enter at least 4 characters..."
                  : "No projects found"
              }
            />
          </div>

          {/* Project Details Card */}
          {selectedProjectDetails && (
            <div className="mt-2 p-3 bg-white border border-blue-200 rounded flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-gray-500 font-medium">Project ID:</span>{" "}
                <span className="font-bold text-black">
                  {selectedProjectDetails.projectId}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Name:</span>{" "}
                <span className="font-semibold text-black">
                  {selectedProjectDetails.projectName}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Type:</span>{" "}
                <span className="font-semibold text-black">
                  {selectedProjectDetails.projectType || "-"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-medium">
                  Project Manager:
                </span>{" "}
                <span className="font-bold text-blue-600">
                  {selectedProjectDetails.projectManagerName || "Unassigned"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Employee Mapping & PLC Table Section */}
        {selectedProjectId ? (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-gray-700">
                Map Employees & Billing PLC Codes ({selectedEmployeeIds.size}{" "}
                selected)
              </label>
              {isEditable && (
                <button
                  onClick={saveProjectMappings}
                  disabled={loading}
                  className="bg-[#17414d] text-white px-4 py-1.5 rounded font-semibold text-xs cursor-pointer disabled:opacity-50 shadow hover:bg-[#12333d] transition-colors"
                >
                  {loading ? "Saving..." : "Save Mappings"}
                </button>
              )}
            </div>

            <div className="border border-gray-300 rounded p-2.5 bg-gray-50 flex flex-col gap-2 shadow-sm">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Search employees to map..."
                  value={employeeSearchTerm}
                  onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                  className="bg-white flex-1 px-3 py-1.5 border border-gray-300 rounded shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs text-black"
                />
              </div>

              <div className="max-h-72 overflow-y-auto rounded border border-gray-300 bg-white">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#e5f3fb] text-black sticky top-0 z-10 shadow-sm">
                      <th className="w-10 px-2.5 py-2 border-b border-r border-gray-300 text-center font-semibold bg-[#e5f3fb]">
                        <input
                          type="checkbox"
                          checked={areAllFilteredEmployeesSelected}
                          onChange={handleSelectAllEmployees}
                          className="rounded border-gray-300 cursor-pointer accent-blue-600"
                        />
                      </th>
                      <th className="px-3 py-2 border-b border-r border-gray-300 text-left font-semibold bg-[#e5f3fb]">
                        Employee ID
                      </th>
                      <th className="px-3 py-2 border-b border-r border-gray-300 text-left font-semibold bg-[#e5f3fb]">
                        Displayed Name
                      </th>
                      <th className="px-3 py-2 border-b border-r border-gray-300 text-left font-semibold bg-[#e5f3fb]">
                        Status
                      </th>
                      <th className="px-3 py-2 border-b border-gray-300 text-left font-semibold bg-[#e5f3fb] min-w-[180px]">
                        Billing PLC Code
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployeesForMapping.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-6 text-gray-400"
                        >
                          No employees found
                        </td>
                      </tr>
                    ) : (
                      filteredEmployeesForMapping.map((emp) => {
                        const isChecked = selectedEmployeeIds.has(
                          emp.employeeId,
                        );
                        return (
                          <tr
                            key={emp.employeeId}
                            onClick={() => handleEmployeeToggle(emp.employeeId)}
                            className={`cursor-pointer transition-colors ${
                              isChecked ? "bg-sky-50" : "hover:bg-gray-50"
                            }`}
                          >
                            <td
                              className="w-10 px-2.5 py-2 border-b border-r border-gray-300 text-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() =>
                                  handleEmployeeToggle(emp.employeeId)
                                }
                                className="rounded border-gray-300 cursor-pointer accent-blue-600"
                              />
                            </td>
                            <td className="px-3 py-2 border-b border-r border-gray-300 font-medium text-black">
                              {emp.employeeId}
                            </td>
                            <td className="px-3 py-2 border-b border-r border-gray-300 font-semibold text-black">
                              {emp.displayedName ||
                                `${emp.lastName}, ${emp.firstName}`}
                            </td>
                            <td className="px-3 py-2 border-b border-r border-gray-300 text-gray-600">
                              {emp.status || "-"}
                            </td>
                            <td
                              className="px-3 py-2 border-b border-gray-300"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Select
                                options={plcOptions}
                                value={
                                  employeePlcMap[emp.employeeId]
                                    ? plcOptions.find(
                                        (opt) =>
                                          opt.value ===
                                          employeePlcMap[emp.employeeId],
                                      )
                                    : null
                                }
                                onChange={(opt) =>
                                  handlePlcChange(
                                    emp.employeeId,
                                    opt ? opt.value : "",
                                  )
                                }
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
        ) : (
          <div className="text-gray-400 text-center py-12 border border-dashed border-gray-300 rounded bg-gray-50">
            Please select a project from the dropdown above to view and map
            employees and their Billing PLCs.
          </div>
        )}
      </div>
    </div>
  );
}
