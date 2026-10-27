// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useRef,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaEdit, FaTimes } from "react-icons/fa";
// import { v4 as uuidv4 } from "uuid";
// import { backendUrl } from "./config";

// // ---------------------------------------------------------------------------
// // Constants / helpers
// // ---------------------------------------------------------------------------
// const MIN_SEARCH_CHARS = 4;
// const FAR_FUTURE_END_DATE = "2078-12-31";
// // Rate type is not shown on this screen, but the API still needs it.
// // Existing rows keep their own value; new rows use this default.
// const DEFAULT_RATE_TYPE = "B";

// export const PROJECT_PLC_COLUMNS = [
//   { key: "projId", label: "Project ID" },
//   { key: "projName", label: "Project Name" },
//   { key: "plc", label: "PLC Code" },
//   { key: "plcDescription", label: "PLC Description" },
//   { key: "billRate", label: "Bill Rate" },
//   { key: "startDate", label: "Start Date" },
//   { key: "endDate", label: "End Date" },
// ];

// const formatWithCommas = (val) => {
//   if (val === null || val === undefined || val === "") return "";
//   const parts = val.toString().split(".");
//   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   return parts.join(".");
// };

// // Keep only digits and a single decimal point
// const cleanRateInput = (value) =>
//   String(value)
//     .replace(/[^0-9.]/g, "")
//     .replace(/(\..*?)\..*/g, "$1");

// const parseRate = (value) => parseFloat(String(value ?? "").replace(/,/g, ""));

// // "2025-12-01T00:00:00" -> "2025-12-01" (value for <input type="date">)
// const toDateInput = (iso) => (iso ? String(iso).split("T")[0] : "");

// // "2025-12-01" -> "12/01/2025"
// const formatDisplayDate = (dateStr) => {
//   if (!dateStr) return "";
//   const [y, m, d] = String(dateStr).split("T")[0].split("-");
//   return `${m}/${d}/${y}`;
// };

// const getErrorMessage = (err) => {
//   const apiError = err?.response?.data;
//   return (
//     apiError?.message ||
//     apiError?.title ||
//     (typeof apiError === "string" ? apiError : null) ||
//     err?.message ||
//     "Unknown error"
//   );
// };

// // Normalise whatever the project search API returns into {projId, projName}
// const normaliseProjects = (data) => {
//   const list = Array.isArray(data) ? data : data?.items || data?.data || [];
//   return list
//     .map((p) => ({
//       projId: p.projId ?? p.projectId ?? p.id ?? "",
//       projName: p.projName ?? p.projectName ?? p.name ?? "",
//     }))
//     .filter((p) => p.projId);
// };

// // Debounced project search - only fires when the term has 4+ characters
// function useProjectSearch(term) {
//   const [options, setOptions] = useState([]);
//   const [searching, setSearching] = useState(false);

//   useEffect(() => {
//     const trimmed = (term || "").trim();
//     if (trimmed.length < MIN_SEARCH_CHARS) {
//       setOptions([]);
//       setSearching(false);
//       return;
//     }

//     let cancelled = false;
//     const timeoutId = setTimeout(async () => {
//       setSearching(true);
//       try {
//         const { data } = await axios.get(
//           `${backendUrl}/api/ProjectMaster/search`,
//           {
//             params: { searchTerm: trimmed, take: 200 },
//           },
//         );
//         if (!cancelled) setOptions(normaliseProjects(data));
//       } catch (error) {
//         if (!cancelled) setOptions([]);
//       } finally {
//         if (!cancelled) setSearching(false);
//       }
//     }, 300);

//     return () => {
//       cancelled = true;
//       clearTimeout(timeoutId);
//     };
//   }, [term]);

//   return { options, searching };
// }

// // ---------------------------------------------------------------------------
// // Component
// // ---------------------------------------------------------------------------
// const ProjectPlcMapping = forwardRef(({ canEdit = true }, ref) => {
//   // Data
//   const [selectedProjects, setSelectedProjects] = useState([]); // [{projId, projName}]
//   const [rates, setRates] = useState([]);
//   const [plcs, setPlcs] = useState([]);

//   // UI state
//   const [loadingRates, setLoadingRates] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [edits, setEdits] = useState({}); // { [rowId]: { billRate, startDate, endDate } }
//   const [drafts, setDrafts] = useState([]); // new, unsaved rows
//   const [selectedRows, setSelectedRows] = useState({});

//   // Project search (top box) + project search used inside draft rows
//   const [searchText, setSearchText] = useState("");
//   const [showResults, setShowResults] = useState(false);
//   const [draftSearchTerm, setDraftSearchTerm] = useState("");
//   const { options: searchOptions, searching } = useProjectSearch(searchText);
//   const { options: draftProjectOptions } = useProjectSearch(draftSearchTerm);

//   const [filterProjId, setFilterProjId] = useState("");
//   const [filterPlc, setFilterPlc] = useState("");

//   const searchBoxRef = useRef(null);

//   // ---- unsaved changes ----------------------------------------------------
//   const hasUnsavedChanges = () =>
//     drafts.length > 0 || (isEditing && Object.keys(edits).length > 0);

//   useImperativeHandle(ref, () => ({ hasUnsavedChanges }));

//   useEffect(() => {
//     const handleBeforeUnload = (e) => {
//       if (hasUnsavedChanges()) {
//         e.preventDefault();
//         e.returnValue = "Unsaved changes will be lost.";
//         return e.returnValue;
//       }
//     };
//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => window.removeEventListener("beforeunload", handleBeforeUnload);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [drafts, edits, isEditing]);

//   // Close the search dropdown on outside click
//   useEffect(() => {
//     const onClick = (e) => {
//       if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
//         setShowResults(false);
//       }
//     };
//     document.addEventListener("mousedown", onClick);
//     return () => document.removeEventListener("mousedown", onClick);
//   }, []);

//   // ---- fetch PLC master list (once) ---------------------------------------
//   useEffect(() => {
//     const fetchPlcs = async () => {
//       try {
//         const { data } = await axios.get(`${backendUrl}/Project/GetAllPlcs/`);
//         setPlcs(
//           data.map((item) => ({
//             laborCategoryCode: item.laborCategoryCode,
//             description: item.description || "",
//           })),
//         );
//       } catch (error) {
//         setPlcs([]);
//       }
//     };
//     fetchPlcs();
//   }, []);

//   const plcDescription = (code) =>
//     plcs.find((p) => p.laborCategoryCode === code)?.description || "";

//   // ---- fetch rates (supports optional project filtering) -------------------
//   const fetchRates = useCallback(
//     async (projects = null) => {
//       setLoadingRates(true);
//       try {
//         const response = await axios.get(`${backendUrl}/api/ProjectPlcRates`);
//         const responseData = response.data;
//         const list = Array.isArray(responseData)
//           ? responseData
//           : responseData?.items || responseData?.data || [];

//         // If projects filter is specified and non-empty, filter by them. Otherwise, show all.
//         const filterProjects = Array.isArray(projects)
//           ? projects
//           : selectedProjects;
//         const hasFilter = filterProjects.length > 0;

//         const nameById = new Map(
//           filterProjects.map((p) => [
//             String(p.projId ?? "")
//               .trim()
//               .toLowerCase(),
//             p.projName,
//           ]),
//         );

//         const rows = list
//           .filter((item) => {
//             if (!hasFilter) return true;
//             const itemProjId = String(item.projId ?? "")
//               .trim()
//               .toLowerCase();
//             return nameById.has(itemProjId);
//           })
//           .map((item, index) => {
//             const itemProjIdKey = String(item.projId ?? "")
//               .trim()
//               .toLowerCase();
//             return {
//               id: `plc-${uuidv4()}-${index}`,
//               originalId: item.id,
//               projId: item.projId,
//               projName: nameById.get(itemProjIdKey) || item.projId, // Fallback if name isn't mapped yet
//               plc: item.laborCategoryCode,
//               billRate: item.billingRate,
//               rateType: item.sBillRtTypeCd || DEFAULT_RATE_TYPE,
//               startDate: toDateInput(item.effectiveDate),
//               endDate: toDateInput(item.endDate),
//             };
//           });

//         setRates(rows);
//         setEdits({});
//         setSelectedRows({});
//       } catch (error) {
//         toast.error(`Failed to fetch billing rates: ${getErrorMessage(error)}`);
//       } finally {
//         setLoadingRates(false);
//       }
//     },
//     [selectedProjects],
//   );

//   // Fetch all rates initially on component mount
//   useEffect(() => {
//     fetchRates([]);
//   }, [fetchRates]);

//   // ---- project selection (top search) -------------------------------------
//   const addProject = (project) => {
//     setShowResults(false);
//     setSearchText("");
//     if (
//       selectedProjects.some(
//         (p) => p.projId.toLowerCase() === project.projId.toLowerCase(),
//       )
//     ) {
//       toast.info(`${project.projId} is already selected.`);
//       return;
//     }
//     const next = [...selectedProjects, project];
//     setSelectedProjects(next);
//     fetchRates(next);
//   };

//   const removeProject = (projId) => {
//     const next = selectedProjects.filter((p) => p.projId !== projId);
//     setSelectedProjects(next);
//     fetchRates(next);
//   };

//   // ---- existing row editing -----------------------------------------------
//   const handleEditChange = (id, field, value) => {
//     setEdits((prev) => ({
//       ...prev,
//       [id]: { ...prev[id], [field]: value },
//     }));
//   };

//   const cellValue = (row, field) => edits[row.id]?.[field] ?? row[field];

//   const cancelEditing = () => {
//     setIsEditing(false);
//     setEdits({});
//   };

//   // ---- draft (new) rows ---------------------------------------------------
//   const handleAddRow = () => {
//     setDrafts((prev) => [
//       ...prev,
//       {
//         _draftId: `draft-${uuidv4()}`,
//         projId: "",
//         projName: "",
//         plc: "",
//         billRate: "",
//         startDate: "",
//         endDate: "",
//       },
//     ]);
//   };

//   const removeDraft = (draftId) =>
//     setDrafts((prev) => prev.filter((d) => d._draftId !== draftId));

//   const handleDraftChange = (draftId, field, value) => {
//     setDrafts((prev) =>
//       prev.map((row) => {
//         if (row._draftId !== draftId) return row;

//         if (field === "billRate") {
//           return { ...row, billRate: cleanRateInput(value) };
//         }

//         if (field === "projId") {
//           const match =
//             draftProjectOptions.find(
//               (p) => p.projId.toLowerCase() === value.trim().toLowerCase(),
//             ) ||
//             selectedProjects.find(
//               (p) => p.projId.toLowerCase() === value.trim().toLowerCase(),
//             );
//           return {
//             ...row,
//             projId: match ? match.projId : value,
//             projName: match ? match.projName : "",
//           };
//         }

//         if (field === "startDate") {
//           const endDate =
//             row.endDate && value && row.endDate < value ? "" : row.endDate;
//           return { ...row, startDate: value, endDate };
//         }

//         return { ...row, [field]: value };
//       }),
//     );
//   };

//   // ---- save (new rows + edited rows) --------------------------------------
//   const buildUpdates = () => {
//     const updates = [];
//     for (const row of rates) {
//       const edit = edits[row.id];
//       if (!edit) continue;

//       const billRate = parseRate(edit.billRate ?? row.billRate);
//       const startDate = edit.startDate ?? row.startDate;
//       const endDate = edit.endDate ?? row.endDate;

//       const unchanged =
//         billRate === parseRate(row.billRate) &&
//         startDate === row.startDate &&
//         endDate === row.endDate;
//       if (unchanged) continue;

//       updates.push({
//         row,
//         billRate,
//         startDate,
//         endDate,
//         payload: {
//           id: row.originalId,
//           projId: row.projId,
//           laborCategoryCode: row.plc,
//           costRate: billRate * 0.65,
//           billingRate: billRate,
//           effectiveDate: startDate ? new Date(startDate).toISOString() : null,
//           endDate: endDate ? new Date(endDate).toISOString() : null,
//           sBillRtTypeCd: row.rateType,
//           isActive: true,
//           modifiedBy: "admin",
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         },
//       });
//     }
//     return updates;
//   };

//   const handleSave = async () => {
//     for (const row of drafts) {
//       if (!row.projId) {
//         toast.error(`Please provide a Project ID for every new row.`);
//         return;
//       }
//       if (!row.plc || !row.startDate || !row.billRate) {
//         toast.error(
//           "Please fill PLC, Bill Rate and Start Date for every new row.",
//         );
//         return;
//       }
//       const rate = parseRate(row.billRate);
//       if (isNaN(rate) || rate <= 0) {
//         toast.error("Bill Rate must be a valid number greater than 0.");
//         return;
//       }
//       if (row.endDate && row.endDate < row.startDate) {
//         toast.error("End Date cannot be before Start Date.");
//         return;
//       }
//     }

//     const updates = buildUpdates();
//     for (const u of updates) {
//       if (isNaN(u.billRate) || u.billRate <= 0) {
//         toast.error("Bill Rate must be a valid number greater than 0.");
//         return;
//       }
//       if (u.startDate && u.endDate && u.endDate < u.startDate) {
//         toast.error("End Date cannot be before Start Date.");
//         return;
//       }
//     }

//     if (drafts.length === 0 && updates.length === 0) {
//       toast.info("No changes to save.");
//       return;
//     }

//     setSaving(true);
//     try {
//       const postResults = await Promise.allSettled(
//         drafts.map((row) =>
//           axios.post(`${backendUrl}/api/ProjectPlcRates`, {
//             id: 0,
//             projId: row.projId,
//             laborCategoryCode: row.plc,
//             costRate: parseRate(row.billRate) * 0.65,
//             billingRate: parseRate(row.billRate),
//             effectiveDate: row.startDate,
//             endDate: row.endDate || FAR_FUTURE_END_DATE,
//             sBillRtTypeCd: DEFAULT_RATE_TYPE,
//             isActive: true,
//             modifiedBy: "admin",
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//           }),
//         ),
//       );

//       const failedDrafts = [];
//       const savedProjects = [];
//       postResults.forEach((result, i) => {
//         if (result.status === "fulfilled") {
//           savedProjects.push({
//             projId: drafts[i].projId,
//             projName: drafts[i].projName,
//           });
//         } else {
//           failedDrafts.push(drafts[i]);
//           toast.error(
//             `Failed to add ${drafts[i].projId} / ${drafts[i].plc}: ${getErrorMessage(result.reason)}`,
//           );
//         }
//       });

//       let updatesSaved = true;
//       if (updates.length > 0) {
//         try {
//           await axios.patch(
//             `${backendUrl}/api/ProjectPlcRates/bulk-billingrate`,
//             updates.map((u) => u.payload),
//           );
//         } catch (error) {
//           updatesSaved = false;
//           toast.error(
//             `Failed to update billing rates: ${getErrorMessage(error)}`,
//           );
//         }
//       }

//       const merged = [...selectedProjects];
//       savedProjects.forEach((p) => {
//         if (
//           !merged.some((m) => m.projId.toLowerCase() === p.projId.toLowerCase())
//         ) {
//           merged.push(p);
//         }
//       });
//       setSelectedProjects(merged);
//       setDrafts(failedDrafts);
//       if (updatesSaved) {
//         setEdits({});
//         setIsEditing(false);
//       }
//       await fetchRates(merged);

//       const savedCount =
//         savedProjects.length +
//         (updates.length > 0 && updatesSaved ? updates.length : 0);
//       if (savedCount > 0 && failedDrafts.length === 0 && updatesSaved) {
//         toast.success("All changes saved successfully!");
//       }
//     } catch (error) {
//       toast.error(`Save failed: ${getErrorMessage(error)}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ---- delete selected ----------------------------------------------------
//   const handleDeleteSelected = async () => {
//     const selectedIds = Object.keys(selectedRows).filter(
//       (id) => selectedRows[id],
//     );
//     if (selectedIds.length === 0) {
//       toast.warn("No rows selected for deletion.");
//       return;
//     }
//     if (
//       !window.confirm(
//         `Are you sure you want to delete ${selectedIds.length} selected billing rate(s)?`,
//       )
//     ) {
//       return;
//     }

//     const originalIds = selectedIds
//       .map((id) => rates.find((r) => r.id === id)?.originalId)
//       .filter((id) => id !== null && id !== undefined);

//     setSaving(true);
//     try {
//       await axios.delete(`${backendUrl}/api/ProjectPlcRates/bulk-delete`, {
//         data: originalIds,
//       });
//       setRates((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
//       setEdits((prev) => {
//         const next = { ...prev };
//         selectedIds.forEach((id) => delete next[id]);
//         return next;
//       });
//       setSelectedRows({});
//       toast.success("Selected billing rates deleted successfully!");
//     } catch (error) {
//       toast.error(`Failed to delete billing rates: ${getErrorMessage(error)}`);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleClear = () => {
//     setDrafts([]);
//     setEdits({});
//     setIsEditing(false);
//     setSelectedRows({});
//   };

//   // ---- derived ------------------------------------------------------------
//   const allSelected =
//     rates.length > 0 && rates.every((r) => selectedRows[r.id]);
//   const anySelected = Object.values(selectedRows).some(Boolean);
//   const totalColumns = PROJECT_PLC_COLUMNS.length + (canEdit ? 1 : 0);

//   const toggleSelectAll = () => {
//     if (allSelected) {
//       setSelectedRows({});
//     } else {
//       const all = {};
//       rates.forEach((r) => (all[r.id] = true));
//       setSelectedRows(all);
//     }
//   };

//   // ---- draft row renderer -------------------------------------------------
//   const inputCls = "w-full border border-gray-300 rounded px-1 py-0.5 text-xs";

//   const renderDraftRow = (row) => (
//     <tr key={row._draftId} className="bg-blue-50">
//       {canEdit && (
//         <td className="tbody-td-fun font-normal border-b border-r border-gray-300 text-center">
//           <button
//             type="button"
//             onClick={() => removeDraft(row._draftId)}
//             title="Remove row"
//             className="text-gray-500 hover:text-red-600"
//           >
//             <FaTimes className="text-xs" />
//           </button>
//         </td>
//       )}

//       {/* Project ID - search as you type (min 4 chars) */}
//       <td className="tbody-td-l min-w-[120px] font-normal border-b border-r border-gray-300">
//         <input
//           type="text"
//           value={row.projId}
//           placeholder={`Type ${MIN_SEARCH_CHARS}+ chars`}
//           onChange={(e) => {
//             setDraftSearchTerm(e.target.value);
//             handleDraftChange(row._draftId, "projId", e.target.value);
//           }}
//           className={inputCls}
//           list={`project-list-${row._draftId}`}
//         />
//         <datalist id={`project-list-${row._draftId}`}>
//           {draftProjectOptions.map((p, i) => (
//             <option key={`${p.projId}-${i}`} value={p.projId}>
//               {p.projName}
//             </option>
//           ))}
//         </datalist>
//       </td>

//       {/* Project Name (auto-filled) */}
//       <td className="tbody-td-l min-w-[160px] font-normal border-b border-r border-gray-300 text-gray-900">
//         {row.projName}
//       </td>

//       {/* PLC */}
//       <td className="tbody-td-l min-w-[100px] font-normal border-b border-r border-gray-300">
//         <input
//           type="text"
//           value={row.plc}
//           onChange={(e) =>
//             handleDraftChange(row._draftId, "plc", e.target.value)
//           }
//           className={inputCls}
//           list={`plc-list-${row._draftId}`}
//         />
//         <datalist id={`plc-list-${row._draftId}`}>
//           {plcs.map((p, i) => (
//             <option
//               key={`${p.laborCategoryCode}-${i}`}
//               value={p.laborCategoryCode}
//             >
//               {p.description}
//             </option>
//           ))}
//         </datalist>
//       </td>

//       {/* PLC Description (auto-filled) */}
//       <td className="tbody-td-l min-w-[160px] font-normal border-b border-r border-gray-300 text-gray-500">
//         {plcDescription(row.plc)}
//       </td>

//       {/* Bill Rate */}
//       <td className="tbody-td-fun min-w-[100px] font-normal border-b border-r border-gray-300">
//         <input
//           type="text"
//           value={formatWithCommas(row.billRate)}
//           onChange={(e) =>
//             handleDraftChange(row._draftId, "billRate", e.target.value)
//           }
//           onBlur={() => {
//             const num = parseRate(row.billRate);
//             if (!isNaN(num)) {
//               handleDraftChange(row._draftId, "billRate", num.toFixed(2));
//             }
//           }}
//           className={inputCls}
//         />
//       </td>

//       {/* Start Date */}
//       <td className="tbody-td-fun min-w-[120px] font-normal border-b border-r border-gray-300">
//         <input
//           type="date"
//           value={row.startDate}
//           onChange={(e) =>
//             handleDraftChange(row._draftId, "startDate", e.target.value)
//           }
//           className={inputCls}
//         />
//       </td>

//       {/* End Date */}
//       <td className="tbody-td-fun min-w-[120px] font-normal border-b border-r border-gray-300">
//         <input
//           type="date"
//           value={row.endDate}
//           min={row.startDate || ""}
//           disabled={!row.startDate}
//           onChange={(e) =>
//             handleDraftChange(row._draftId, "endDate", e.target.value)
//           }
//           className={inputCls}
//         />
//       </td>
//     </tr>
//   );

//   // ---- render -------------------------------------------------------------
//   return (
//     <div className="rounded-xl bg-white border m-2 border-gray-200 p-3 min-h-[150px] text-xs">
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* Header: title + actions */}
//       <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
//         <h3 className="text-sm font-semibold">Project PLC Billing Rates</h3>

//         {canEdit && (
//           <div className="flex items-center gap-2">
//             <button
//               onClick={handleAddRow}
//               className="btn1 btn-blue cursor-pointer"
//               disabled={saving}
//             >
//               Add
//             </button>
//             <button
//               onClick={() => (isEditing ? cancelEditing() : setIsEditing(true))}
//               className="btn1 btn-blue cursor-pointer"
//               disabled={saving || rates.length === 0}
//               title={isEditing ? "Cancel editing" : "Edit rows"}
//             >
//               {isEditing ? (
//                 <FaTimes className="text-sm" />
//               ) : (
//                 <FaEdit className="text-sm" />
//               )}
//             </button>
//             <button
//               onClick={handleClear}
//               className="btn1 btn-blue"
//               disabled={saving}
//             >
//               Clear
//             </button>
//             <button
//               onClick={handleSave}
//               disabled={saving}
//               className={`btn1 btn-blue ${saving ? "cursor-not-allowed" : ""}`}
//             >
//               {saving ? "Saving....." : "Save"}
//             </button>
//             <button
//               onClick={handleDeleteSelected}
//               disabled={saving || !anySelected}
//               className="btn1 btn-blue bg-red-600"
//             >
//               Delete
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Project filter*/}
//       <div className="mb-3 flex flex-wrap items-start gap-3"></div>

//       {/* The table */}
//       <div className="overflow-x-auto overflow-y-auto max-h-[28rem] rounded-sm border border-gray-200">
//         <table className="w-full border-collapse">
//           <thead className="sticky top-0 z-10 bg-gray-200">
//             <tr>
//               {canEdit && (
//                 <th className="th-thead border-r border-gray-300 w-10 text-left">
//                   <input
//                     type="checkbox"
//                     className="w-3 h-3"
//                     checked={allSelected}
//                     onChange={toggleSelectAll}
//                     disabled={rates.length === 0}
//                   />
//                 </th>
//               )}
//               {PROJECT_PLC_COLUMNS.map((col) => (
//                 <th key={col.key} className="th-thead border-r border-gray-300">
//                   {col.label}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {drafts.map(renderDraftRow)}

//             {loadingRates ? (
//               <tr>
//                 <td colSpan={totalColumns}>
//                   <div className="flex items-center justify-center py-4">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                     <span className="ml-2">Loading...</span>
//                   </div>
//                 </td>
//               </tr>
//             ) : rates.length === 0 && drafts.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={totalColumns}
//                   className="tbody-td-fun font-normal px-3 py-4 text-center text-gray-500"
//                 >
//                   No data available
//                 </td>
//               </tr>
//             ) : (
//               rates.map((item, idx) => (
//                 <tr
//                   key={item.id}
//                   className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                 >
//                   {canEdit && (
//                     <td className="tbody-td-fun font-normal border-b border-r border-gray-300">
//                       <input
//                         type="checkbox"
//                         className="w-3 h-3"
//                         checked={!!selectedRows[item.id]}
//                         onChange={() =>
//                           setSelectedRows((prev) => ({
//                             ...prev,
//                             [item.id]: !prev[item.id],
//                           }))
//                         }
//                       />
//                     </td>
//                   )}

//                   <td className="tbody-td-l min-w-[100px] font-normal border-b border-r border-gray-300 text-gray-900">
//                     {item.projId}
//                   </td>
//                   <td className="tbody-td-l min-w-[160px] font-normal border-b border-r border-gray-300 text-gray-900">
//                     {item.projName}
//                   </td>
//                   <td className="tbody-td-l min-w-[100px] font-normal border-b border-r border-gray-300 text-gray-900">
//                     {item.plc}
//                   </td>
//                   <td className="tbody-td-l min-w-[160px] font-normal border-b border-r border-gray-300 text-gray-500">
//                     {plcDescription(item.plc)}
//                   </td>

//                   {/* Bill Rate */}
//                   <td className="tbody-td-fun min-w-[100px] font-normal border-b border-r border-gray-300">
//                     {isEditing ? (
//                       <input
//                         type="text"
//                         value={formatWithCommas(cellValue(item, "billRate"))}
//                         onChange={(e) =>
//                           handleEditChange(
//                             item.id,
//                             "billRate",
//                             cleanRateInput(e.target.value),
//                           )
//                         }
//                         onBlur={() => {
//                           const num = parseRate(cellValue(item, "billRate"));
//                           if (!isNaN(num)) {
//                             handleEditChange(
//                               item.id,
//                               "billRate",
//                               num.toFixed(2),
//                             );
//                           }
//                         }}
//                         className={inputCls}
//                       />
//                     ) : (
//                       <span>{formatWithCommas(item.billRate)}</span>
//                     )}
//                   </td>

//                   {/* Start Date */}
//                   <td className="tbody-td-fun min-w-[110px] font-normal border-b border-r border-gray-300">
//                     {isEditing ? (
//                       <input
//                         type="date"
//                         value={cellValue(item, "startDate") || ""}
//                         onChange={(e) =>
//                           handleEditChange(item.id, "startDate", e.target.value)
//                         }
//                         className={inputCls}
//                       />
//                     ) : (
//                       formatDisplayDate(item.startDate)
//                     )}
//                   </td>

//                   {/* End Date */}
//                   <td className="tbody-td-fun min-w-[110px] font-normal border-b border-r border-gray-300">
//                     {isEditing ? (
//                       <input
//                         type="date"
//                         value={cellValue(item, "endDate") || ""}
//                         min={cellValue(item, "startDate") || ""}
//                         onChange={(e) =>
//                           handleEditChange(item.id, "endDate", e.target.value)
//                         }
//                         className={inputCls}
//                       />
//                     ) : (
//                       formatDisplayDate(item.endDate)
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// });

// export default ProjectPlcMapping;

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTimes } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { backendUrl } from "./config";

// ---------------------------------------------------------------------------
// Constants / helpers
// ---------------------------------------------------------------------------
const MIN_SEARCH_CHARS = 4;
const FAR_FUTURE_END_DATE = "2078-12-31";
const DEFAULT_RATE_TYPE = "B";

export const PROJECT_PLC_COLUMNS = [
  { key: "projId", label: "Project ID" },
  { key: "projName", label: "Project Name" },
  { key: "plc", label: "PLC Code" },
  { key: "plcDescription", label: "PLC Description" },
  { key: "billRate", label: "Bill Rate" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
];

const formatWithCommas = (val) => {
  if (val === null || val === undefined || val === "") return "";
  const parts = val.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

const cleanRateInput = (value) =>
  String(value)
    .replace(/[^0-9.]/g, "")
    .replace(/(\..*?)\..*/g, "$1");

const parseRate = (value) => parseFloat(String(value ?? "").replace(/,/g, ""));

const toDateInput = (iso) => (iso ? String(iso).split("T")[0] : "");

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = String(dateStr).split("T")[0].split("-");
  return `${m}/${d}/${y}`;
};

const getErrorMessage = (err) => {
  const apiError = err?.response?.data;
  return (
    apiError?.message ||
    apiError?.title ||
    (typeof apiError === "string" ? apiError : null) ||
    err?.message ||
    "Unknown error"
  );
};

const normaliseProjects = (data) => {
  const list = Array.isArray(data) ? data : data?.items || data?.data || [];
  return list
    .map((p) => ({
      projId: p.projId ?? p.projectId ?? p.id ?? "",
      projName: p.projName ?? p.projectName ?? p.name ?? "",
    }))
    .filter((p) => p.projId);
};

function useProjectSearch(term) {
  const [options, setOptions] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const trimmed = (term || "").trim();
    if (trimmed.length < MIN_SEARCH_CHARS) {
      setOptions([]);
      setSearching(false);
      return;
    }

    let cancelled = false;
    const timeoutId = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/ProjectMaster/search`,
          {
            params: { searchTerm: trimmed, take: 200 },
          },
        );
        if (!cancelled) setOptions(normaliseProjects(data));
      } catch (error) {
        if (!cancelled) setOptions([]);
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [term]);

  return { options, searching };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const ProjectPlcMapping = forwardRef(({ canEdit = true }, ref) => {
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [rates, setRates] = useState([]);
  const [plcs, setPlcs] = useState([]);

  // UI state
  const [loadingRates, setLoadingRates] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [edits, setEdits] = useState({});
  const [drafts, setDrafts] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});

  // Filter states
  const [filterProjId, setFilterProjId] = useState("");
  const [filterPlc, setFilterPlc] = useState("");

  const [searchText, setSearchText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [draftSearchTerm, setDraftSearchTerm] = useState("");
  const { options: searchOptions, searching } = useProjectSearch(searchText);
  const { options: draftProjectOptions } = useProjectSearch(draftSearchTerm);

  const searchBoxRef = useRef(null);

  const hasUnsavedChanges = () =>
    drafts.length > 0 || (isEditing && Object.keys(edits).length > 0);

  useImperativeHandle(ref, () => ({ hasUnsavedChanges }));

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = "Unsaved changes will be lost.";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [drafts, edits, isEditing]);

  useEffect(() => {
    const onClick = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const fetchPlcs = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/Project/GetAllPlcs/`);
        setPlcs(
          data.map((item) => ({
            laborCategoryCode: item.laborCategoryCode,
            description: item.description || "",
          })),
        );
      } catch (error) {
        setPlcs([]);
      }
    };
    fetchPlcs();
  }, []);

  const plcDescription = (code) =>
    plcs.find((p) => p.laborCategoryCode === code)?.description || "";

  const fetchRates = useCallback(
    async (projects = null) => {
      setLoadingRates(true);
      try {
        const response = await axios.get(`${backendUrl}/api/ProjectPlcRates`);
        const responseData = response.data;
        const list = Array.isArray(responseData)
          ? responseData
          : responseData?.items || responseData?.data || [];

        const filterProjects = Array.isArray(projects)
          ? projects
          : selectedProjects;
        const hasFilter = filterProjects.length > 0;

        const nameById = new Map(
          filterProjects.map((p) => [
            String(p.projId ?? "")
              .trim()
              .toLowerCase(),
            p.projName,
          ]),
        );

        const rows = list
          .filter((item) => {
            if (!hasFilter) return true;
            const itemProjId = String(item.projId ?? "")
              .trim()
              .toLowerCase();
            return nameById.has(itemProjId);
          })
          .map((item, index) => {
            const itemProjIdKey = String(item.projId ?? "")
              .trim()
              .toLowerCase();
            return {
              id: `plc-${uuidv4()}-${index}`,
              originalId: item.id,
              projId: item.projId,
              projName: nameById.get(itemProjIdKey) || item.projId,
              plc: item.laborCategoryCode,
              billRate: item.billingRate,
              rateType: item.sBillRtTypeCd || DEFAULT_RATE_TYPE,
              startDate: toDateInput(item.effectiveDate),
              endDate: toDateInput(item.endDate),
            };
          });

        setRates(rows);
        setEdits({});
        setSelectedRows({});
      } catch (error) {
        toast.error(`Failed to fetch billing rates: ${getErrorMessage(error)}`);
      } finally {
        setLoadingRates(false);
      }
    },
    [selectedProjects],
  );

  useEffect(() => {
    fetchRates([]);
  }, [fetchRates]);

  // Extract unique options for filter dropdowns based on fetched rates
  const uniqueProjectIds = [...new Set(rates.map((r) => r.projId))].filter(
    Boolean,
  );
  const uniquePlcCodes = [...new Set(rates.map((r) => r.plc))].filter(Boolean);

  // Filtered rows for the table
  const filteredRates = rates.filter((item) => {
    const matchesProjId = filterProjId ? item.projId === filterProjId : true;
    const matchesPlc = filterPlc ? item.plc === filterPlc : true;
    return matchesProjId && matchesPlc;
  });

  const handleEditChange = (id, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const cellValue = (row, field) => edits[row.id]?.[field] ?? row[field];

  const cancelEditing = () => {
    setIsEditing(false);
    setEdits({});
  };

  const handleAddRow = () => {
    setDrafts((prev) => [
      ...prev,
      {
        _draftId: `draft-${uuidv4()}`,
        projId: "",
        projName: "",
        plc: "",
        billRate: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const removeDraft = (draftId) =>
    setDrafts((prev) => prev.filter((d) => d._draftId !== draftId));

  const handleDraftChange = (draftId, field, value) => {
    setDrafts((prev) =>
      prev.map((row) => {
        if (row._draftId !== draftId) return row;

        if (field === "billRate") {
          return { ...row, billRate: cleanRateInput(value) };
        }

        if (field === "projId") {
          const match =
            draftProjectOptions.find(
              (p) => p.projId.toLowerCase() === value.trim().toLowerCase(),
            ) ||
            selectedProjects.find(
              (p) => p.projId.toLowerCase() === value.trim().toLowerCase(),
            );
          return {
            ...row,
            projId: match ? match.projId : value,
            projName: match ? match.projName : "",
          };
        }

        if (field === "startDate") {
          const endDate =
            row.endDate && value && row.endDate < value ? "" : row.endDate;
          return { ...row, startDate: value, endDate };
        }

        return { ...row, [field]: value };
      }),
    );
  };

  const buildUpdates = () => {
    const updates = [];
    for (const row of rates) {
      const edit = edits[row.id];
      if (!edit) continue;

      const billRate = parseRate(edit.billRate ?? row.billRate);
      const startDate = edit.startDate ?? row.startDate;
      const endDate = edit.endDate ?? row.endDate;

      const unchanged =
        billRate === parseRate(row.billRate) &&
        startDate === row.startDate &&
        endDate === row.endDate;
      if (unchanged) continue;

      updates.push({
        row,
        billRate,
        startDate,
        endDate,
        payload: {
          id: row.originalId,
          projId: row.projId,
          laborCategoryCode: row.plc,
          costRate: billRate * 0.65,
          billingRate: billRate,
          effectiveDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: endDate ? new Date(endDate).toISOString() : null,
          sBillRtTypeCd: row.rateType,
          isActive: true,
          modifiedBy: "admin",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }
    return updates;
  };

  const handleSave = async () => {
    for (const row of drafts) {
      if (!row.projId) {
        toast.error(`Please provide a Project ID for every new row.`);
        return;
      }
      if (!row.plc || !row.startDate || !row.billRate) {
        toast.error(
          "Please fill PLC, Bill Rate and Start Date for every new row.",
        );
        return;
      }
      const rate = parseRate(row.billRate);
      if (isNaN(rate) || rate <= 0) {
        toast.error("Bill Rate must be a valid number greater than 0.");
        return;
      }
      if (row.endDate && row.endDate < row.startDate) {
        toast.error("End Date cannot be before Start Date.");
        return;
      }
    }

    const updates = buildUpdates();
    for (const u of updates) {
      if (isNaN(u.billRate) || u.billRate <= 0) {
        toast.error("Bill Rate must be a valid number greater than 0.");
        return;
      }
      if (u.startDate && u.endDate && u.endDate < u.startDate) {
        toast.error("End Date cannot be before Start Date.");
        return;
      }
    }

    if (drafts.length === 0 && updates.length === 0) {
      toast.info("No changes to save.");
      return;
    }

    setSaving(true);
    try {
      const postResults = await Promise.allSettled(
        drafts.map((row) =>
          axios.post(`${backendUrl}/api/ProjectPlcRates`, {
            id: 0,
            projId: row.projId,
            laborCategoryCode: row.plc,
            costRate: parseRate(row.billRate) * 0.65,
            billingRate: parseRate(row.billRate),
            effectiveDate: row.startDate,
            endDate: row.endDate || FAR_FUTURE_END_DATE,
            sBillRtTypeCd: DEFAULT_RATE_TYPE,
            isActive: true,
            modifiedBy: "admin",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        ),
      );

      const failedDrafts = [];
      const savedProjects = [];
      postResults.forEach((result, i) => {
        if (result.status === "fulfilled") {
          savedProjects.push({
            projId: drafts[i].projId,
            projName: drafts[i].projName,
          });
        } else {
          failedDrafts.push(drafts[i]);
          toast.error(
            `Failed to add ${drafts[i].projId} / ${drafts[i].plc}: ${getErrorMessage(result.reason)}`,
          );
        }
      });

      let updatesSaved = true;
      if (updates.length > 0) {
        try {
          await axios.patch(
            `${backendUrl}/api/ProjectPlcRates/bulk-billingrate`,
            updates.map((u) => u.payload),
          );
        } catch (error) {
          updatesSaved = false;
          toast.error(
            `Failed to update billing rates: ${getErrorMessage(error)}`,
          );
        }
      }

      const merged = [...selectedProjects];
      savedProjects.forEach((p) => {
        if (
          !merged.some((m) => m.projId.toLowerCase() === p.projId.toLowerCase())
        ) {
          merged.push(p);
        }
      });
      setSelectedProjects(merged);
      setDrafts(failedDrafts);
      if (updatesSaved) {
        setEdits({});
        setIsEditing(false);
      }
      await fetchRates(merged);

      const savedCount =
        savedProjects.length +
        (updates.length > 0 && updatesSaved ? updates.length : 0);
      if (savedCount > 0 && failedDrafts.length === 0 && updatesSaved) {
        toast.success("All changes saved successfully!");
      }
    } catch (error) {
      toast.error(`Save failed: ${getErrorMessage(error)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSelected = async () => {
    const selectedIds = Object.keys(selectedRows).filter(
      (id) => selectedRows[id],
    );
    if (selectedIds.length === 0) {
      toast.warn("No rows selected for deletion.");
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected billing rate(s)?`,
      )
    ) {
      return;
    }

    const originalIds = selectedIds
      .map((id) => rates.find((r) => r.id === id)?.originalId)
      .filter((id) => id !== null && id !== undefined);

    setSaving(true);
    try {
      await axios.delete(`${backendUrl}/api/ProjectPlcRates/bulk-delete`, {
        data: originalIds,
      });
      setRates((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
      setEdits((prev) => {
        const next = { ...prev };
        selectedIds.forEach((id) => delete next[id]);
        return next;
      });
      setSelectedRows({});
      toast.success("Selected billing rates deleted successfully!");
    } catch (error) {
      toast.error(`Failed to delete billing rates: ${getErrorMessage(error)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    setDrafts([]);
    setEdits({});
    setIsEditing(false);
    setSelectedRows({});
    setFilterProjId("");
    setFilterPlc("");
  };

  const allSelected =
    filteredRates.length > 0 && filteredRates.every((r) => selectedRows[r.id]);
  const anySelected = Object.values(selectedRows).some(Boolean);
  const totalColumns = PROJECT_PLC_COLUMNS.length + (canEdit ? 1 : 0);

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows({});
    } else {
      const all = {};
      filteredRates.forEach((r) => (all[r.id] = true));
      setSelectedRows(all);
    }
  };

  const inputCls = "w-full border border-gray-300 rounded px-1 py-0.5 text-xs";

  const renderDraftRow = (row) => (
    <tr key={row._draftId} className="bg-blue-50">
      {canEdit && (
        <td className="tbody-td-fun font-normal border-b border-r border-gray-300 text-center">
          <button
            type="button"
            onClick={() => removeDraft(row._draftId)}
            title="Remove row"
            className="text-gray-500 hover:text-red-600"
          >
            <FaTimes className="text-xs" />
          </button>
        </td>
      )}

      <td className="tbody-td-l min-w-[120px] font-normal border-b border-r border-gray-300">
        <input
          type="text"
          value={row.projId}
          placeholder={`Type ${MIN_SEARCH_CHARS}+ chars`}
          onChange={(e) => {
            setDraftSearchTerm(e.target.value);
            handleDraftChange(row._draftId, "projId", e.target.value);
          }}
          className={inputCls}
          list={`project-list-${row._draftId}`}
        />
        <datalist id={`project-list-${row._draftId}`}>
          {draftProjectOptions.map((p, i) => (
            <option key={`${p.projId}-${i}`} value={p.projId}>
              {p.projName}
            </option>
          ))}
        </datalist>
      </td>

      <td className="tbody-td-l min-w-[160px] font-normal border-b border-r border-gray-300 text-gray-900">
        {row.projName}
      </td>

      <td className="tbody-td-l min-w-[100px] font-normal border-b border-r border-gray-300">
        <input
          type="text"
          value={row.plc}
          onChange={(e) =>
            handleDraftChange(row._draftId, "plc", e.target.value)
          }
          className={inputCls}
          list={`plc-list-${row._draftId}`}
        />
        <datalist id={`plc-list-${row._draftId}`}>
          {plcs.map((p, i) => (
            <option
              key={`${p.laborCategoryCode}-${i}`}
              value={p.laborCategoryCode}
            >
              {p.description}
            </option>
          ))}
        </datalist>
      </td>

      <td className="tbody-td-l min-w-[160px] font-normal border-b border-r border-gray-300 text-gray-500">
        {plcDescription(row.plc)}
      </td>

      <td className="tbody-td-fun min-w-[100px] font-normal border-b border-r border-gray-300">
        <input
          type="text"
          value={formatWithCommas(row.billRate)}
          onChange={(e) =>
            handleDraftChange(row._draftId, "billRate", e.target.value)
          }
          onBlur={() => {
            const num = parseRate(row.billRate);
            if (!isNaN(num)) {
              handleDraftChange(row._draftId, "billRate", num.toFixed(2));
            }
          }}
          className={inputCls}
        />
      </td>

      <td className="tbody-td-fun min-w-[120px] font-normal border-b border-r border-gray-300">
        <input
          type="date"
          value={row.startDate}
          onChange={(e) =>
            handleDraftChange(row._draftId, "startDate", e.target.value)
          }
          className={inputCls}
        />
      </td>

      <td className="tbody-td-fun min-w-[120px] font-normal border-b border-r border-gray-300">
        <input
          type="date"
          value={row.endDate}
          min={row.startDate || ""}
          disabled={!row.startDate}
          onChange={(e) =>
            handleDraftChange(row._draftId, "endDate", e.target.value)
          }
          className={inputCls}
        />
      </td>
    </tr>
  );

  return (
    <div className="rounded-xl bg-white border m-2 border-gray-200 p-3 min-h-[150px] text-xs">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold">Project PLC Billing Rates</h3>

        {canEdit && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddRow}
              className="btn1 btn-blue cursor-pointer"
              disabled={saving}
            >
              Add
            </button>
            <button
              onClick={() => (isEditing ? cancelEditing() : setIsEditing(true))}
              className="btn1 btn-blue cursor-pointer"
              disabled={saving || rates.length === 0}
              title={isEditing ? "Cancel editing" : "Edit rows"}
            >
              {isEditing ? (
                <FaTimes className="text-sm" />
              ) : (
                <FaEdit className="text-sm" />
              )}
            </button>
            <button
              onClick={handleClear}
              className="btn1 btn-blue"
              disabled={saving}
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`btn1 btn-blue ${saving ? "cursor-not-allowed" : ""}`}
            >
              {saving ? "Saving....." : "Save"}
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={saving || !anySelected}
              className="btn1 btn-blue bg-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Filters by Project ID and PLC Code */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-auto">
          <select
            value={filterProjId}
            onChange={(e) => setFilterProjId(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-xs bg-white"
          >
            <option value="">All Project IDs</option>
            {uniqueProjectIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={filterPlc}
            onChange={(e) => setFilterPlc(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-xs bg-white"
          >
            <option value="">All PLC Codes</option>
            {uniquePlcCodes.map((plc) => (
              <option key={plc} value={plc}>
                {plc}
              </option>
            ))}
          </select>
        </div>

        {(filterProjId || filterPlc) && (
          <button
            onClick={() => {
              setFilterProjId("");
              setFilterPlc("");
            }}
            className="text-xs text-blue-600 underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[28rem] rounded-sm border border-gray-200">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-200">
            <tr>
              {canEdit && (
                <th className="th-thead border-r border-gray-300 w-10 text-left">
                  <input
                    type="checkbox"
                    className="w-3 h-3"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    disabled={filteredRates.length === 0}
                  />
                </th>
              )}
              {PROJECT_PLC_COLUMNS.map((col) => (
                <th key={col.key} className="th-thead border-r border-gray-300">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {drafts.map(renderDraftRow)}

            {loadingRates ? (
              <tr>
                <td colSpan={totalColumns}>
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : filteredRates.length === 0 && drafts.length === 0 ? (
              <tr>
                <td
                  colSpan={totalColumns}
                  className="tbody-td-fun font-normal px-3 py-4 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              filteredRates.map((item, idx) => (
                <tr
                  key={item.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {canEdit && (
                    <td className="tbody-td-fun font-normal border-b border-r border-gray-300">
                      <input
                        type="checkbox"
                        className="w-3 h-3"
                        checked={!!selectedRows[item.id]}
                        onChange={() =>
                          setSelectedRows((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id],
                          }))
                        }
                      />
                    </td>
                  )}

                  <td className="tbody-td-l min-w-[100px] font-normal border-b border-r border-gray-300 text-gray-900">
                    {item.projId}
                  </td>
                  <td className="tbody-td-l min-w-[160px] font-normal border-b border-r border-gray-300 text-gray-900">
                    {item.projName}
                  </td>
                  <td className="tbody-td-l min-w-[100px] font-normal border-b border-r border-gray-300 text-gray-900">
                    {item.plc}
                  </td>
                  <td className="tbody-td-l min-w-[160px] font-normal border-b border-r border-gray-300 text-gray-500">
                    {plcDescription(item.plc)}
                  </td>

                  <td className="tbody-td-fun min-w-[100px] font-normal border-b border-r border-gray-300">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formatWithCommas(cellValue(item, "billRate"))}
                        onChange={(e) =>
                          handleEditChange(
                            item.id,
                            "billRate",
                            cleanRateInput(e.target.value),
                          )
                        }
                        onBlur={() => {
                          const num = parseRate(cellValue(item, "billRate"));
                          if (!isNaN(num)) {
                            handleEditChange(
                              item.id,
                              "billRate",
                              num.toFixed(2),
                            );
                          }
                        }}
                        className={inputCls}
                      />
                    ) : (
                      <span>{formatWithCommas(item.billRate)}</span>
                    )}
                  </td>

                  <td className="tbody-td-fun min-w-[110px] font-normal border-b border-r border-gray-300">
                    {isEditing ? (
                      <input
                        type="date"
                        value={cellValue(item, "startDate") || ""}
                        onChange={(e) =>
                          handleEditChange(item.id, "startDate", e.target.value)
                        }
                        className={inputCls}
                      />
                    ) : (
                      formatDisplayDate(item.startDate)
                    )}
                  </td>

                  <td className="tbody-td-fun min-w-[110px] font-normal border-b border-r border-gray-300">
                    {isEditing ? (
                      <input
                        type="date"
                        value={cellValue(item, "endDate") || ""}
                        min={cellValue(item, "startDate") || ""}
                        onChange={(e) =>
                          handleEditChange(item.id, "endDate", e.target.value)
                        }
                        className={inputCls}
                      />
                    ) : (
                      formatDisplayDate(item.endDate)
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default ProjectPlcMapping;
