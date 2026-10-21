// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaSave, FaEdit, FaTrash, FaTimes, FaPlus } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { backendUrl } from "./config";

// const HoursCeilings = ({
//   projectId,
//   project,
//   isSearched,
//   updatedBy = "Kartikay",
//   isEditable,
// }) => {
//   const [hoursCeilings, setHoursCeilings] = useState([]);
//   const [laborCategories, setLaborCategories] = useState([]);

//   const [editIndex, setEditIndex] = useState(null);
//   const [editRow, setEditRow] = useState({});

//   const [showNewRow, setShowNewRow] = useState(false);

//   const [newRow, setNewRow] = useState({
//     laborCategory: "",
//     laborCategoryDescription: "",
//     hoursCeiling: "",
//   });

//   const [isLoading, setIsLoading] = useState(false);

//   const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");

//   const [hasSearched, setHasSearched] = useState(false);

//   const isValidProjectId = (id) => !!id;

//   // ---------------------------------------------------------
//   // Reset New Row
//   // ---------------------------------------------------------
//   const resetNewRow = () => {
//     setNewRow({
//       laborCategory: "",
//       laborCategoryDescription: "",
//       hoursCeiling: "",
//     });
//   };

//   // ---------------------------------------------------------
//   // Fetch Ceilings + Labor Categories
//   // ---------------------------------------------------------
//   useEffect(() => {
//     let isMounted = true;

//     // const fetchData = async () => {
//     //   if (isSearched && isValidProjectId(projectId)) {
//     //     setIsLoading(true);

//     //     try {
//     //       const projectType =
//     //         project.type === "NBBUD" ? "NBBUD" : "PROJECT";

//     //       const [ceilingsRes, projectRes] = await Promise.all([
//     //         axios.get(
//     //           `${backendUrl}/Project/GetAllCeilingHrForPLC?projId=${projectId}`
//     //         ),
//     //         axios.get(
//     //           `${backendUrl}/Project/GetAllProjectByProjId/${projectId}/${projectType}`
//     //         ),
//     //       ]);

//     //       if (isMounted) {
//     //         setHoursCeilings(ceilingsRes.data?.data || []);

//     //         const projectData = Array.isArray(projectRes.data)
//     //           ? projectRes.data[0]
//     //           : projectRes.data;

//     //         const plcList = projectData?.plc || [];

//     //         // NBBUD: include all PLCs
//     //         // Other project types: include only PLCs with source "N"
//     //         const filteredPlc =
//     //           project.type === "NBBUD"
//     //             ? plcList
//     //             : plcList.filter((plc) => plc.source === "N");

//     //         setLaborCategories(filteredPlc);

//     //         setLastSearchedProjectId(projectId);
//     //         setHasSearched(true);
//     //       }
//     //     } catch (error) {
//     //       if (isMounted) {
//     //         setHoursCeilings([]);
//     //         setLaborCategories([]);
//     //         setLastSearchedProjectId(projectId);
//     //         setHasSearched(true);

//     //         toast.error("Failed to fetch project details.");
//     //       }
//     //     } finally {
//     //       if (isMounted) {
//     //         setIsLoading(false);
//     //         setShowNewRow(false);
//     //         resetNewRow();
//     //       }
//     //     }
//     //   } else if (isMounted) {
//     //     setHoursCeilings([]);
//     //     setLaborCategories([]);
//     //     setIsLoading(false);
//     //     setShowNewRow(false);
//     //     resetNewRow();
//     //     setLastSearchedProjectId("");
//     //     setHasSearched(false);
//     //   }
//     // };

//     const fetchData = async () => {
//       if (isSearched && isValidProjectId(projectId)) {
//         setIsLoading(true);

//         try {
//           const projectType = project.type === "NBBUD" ? "NBBUD" : "PROJECT";

//           const [ceilingsRes, projectRes] = await Promise.all([
//             axios.get(
//               `${backendUrl}/Project/GetAllCeilingHrForPLC?projId=${projectId}`,
//             ),
//             axios.get(
//               `${backendUrl}/Project/GetAllProjectByProjId/${projectId}/${projectType}`,
//             ),
//           ]);

//           if (isMounted) {
//             setHoursCeilings(ceilingsRes.data?.data || []);

//             const projectData = Array.isArray(projectRes.data)
//               ? projectRes.data[0]
//               : projectRes.data;

//             const plcList = projectData?.plc || [];

//             console.log(projectRes);

//             console.log(plcList);

//             // NBBUD: include all PLCs
//             // Other project types: include only PLCs with source "N"
//             const filteredPlc =
//               project.type === "NBBUD"
//                 ? plcList
//                 : plcList.filter((plc) => plc.source !== "N");

//             setLaborCategories(filteredPlc);

//             setLastSearchedProjectId(projectId);
//             setHasSearched(true);
//           }
//         } catch (error) {
//           if (isMounted) {
//             setHoursCeilings([]);
//             setLaborCategories([]);
//             setLastSearchedProjectId(projectId);
//             setHasSearched(true);

//             toast.error("Failed to fetch project details.");
//           }
//         } finally {
//           if (isMounted) {
//             setIsLoading(false);
//             setShowNewRow(false);
//             resetNewRow();
//           }
//         }
//       } else if (isMounted) {
//         setHoursCeilings([]);
//         setLaborCategories([]);
//         setIsLoading(false);
//         setShowNewRow(false);
//         resetNewRow();
//         setLastSearchedProjectId("");
//         setHasSearched(false);
//       }
//     };

//     fetchData();

//     return () => {
//       isMounted = false;
//     };
//   }, [isSearched, projectId]);

//   const shouldShowTable =
//     hasSearched && isValidProjectId(lastSearchedProjectId);

//   // ---------------------------------------------------------
//   // New
//   // ---------------------------------------------------------
//   const handleNewClick = () => {
//     if (!shouldShowTable) {
//       toast.warning("Please search for a valid project first.");
//       return;
//     }

//     setShowNewRow(true);

//     resetNewRow();

//     // Close edit mode
//     setEditIndex(null);
//     setEditRow({});
//   };

//   // ---------------------------------------------------------
//   // Labor Category Change
//   // ---------------------------------------------------------
//   const handleLaborCategoryChange = (value) => {
//     setNewRow((prev) => ({
//       ...prev,
//       laborCategory: value,
//       laborCategoryDescription: "",
//     }));
//   };

//   // ---------------------------------------------------------
//   // Labor Category Selection
//   // ---------------------------------------------------------
//   const handleSuggestionSelect = (selectedCode) => {
//     const selected = laborCategories.find(
//       (cat) => cat.laborCategoryCode === selectedCode,
//     );

//     if (selected) {
//       setNewRow((prev) => ({
//         ...prev,
//         laborCategory: selected.laborCategoryCode,
//         laborCategoryDescription: selected.description,
//       }));
//     }
//   };

//   // ---------------------------------------------------------
//   // Save New Row
//   // ---------------------------------------------------------
//   const handleSave = async () => {
//     if (!newRow.laborCategory || !newRow.hoursCeiling) {
//       toast.warning("Please fill all fields.");
//       return;
//     }

//     const requestBody = {
//       projectId,
//       laborCategoryId: newRow.laborCategory,
//       laborCategoryDesc: newRow.laborCategoryDescription || "",
//       hoursCeiling: parseFloat(newRow.hoursCeiling) || 0,
//       applyToRbaCode: "R",
//     };

//     try {
//       await axios.post(
//         `${backendUrl}/Project/CreateCeilingHrForPLC?updatedBy=${updatedBy}`,
//         requestBody,
//       );

//       toast.success("Saved successfully.");

//       const response = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingHrForPLC?projId=${lastSearchedProjectId}`,
//       );

//       setHoursCeilings(response.data?.data || []);

//       setShowNewRow(false);
//       resetNewRow();
//     } catch (error) {
//       toast.error("Failed to save. Please check your input and try again.");
//     }
//   };

//   // ---------------------------------------------------------
//   // Cancel New Row
//   // ---------------------------------------------------------
//   const handleCancelNewRow = () => {
//     setShowNewRow(false);
//     resetNewRow();
//   };

//   // ---------------------------------------------------------
//   // Edit
//   // ---------------------------------------------------------
//   const handleEditClick = (index) => {
//     setEditIndex(index);

//     setEditRow({
//       hoursCeiling: hoursCeilings[index].hoursCeiling,
//     });

//     // Close new mode
//     setShowNewRow(false);
//     resetNewRow();
//   };

//   // ---------------------------------------------------------
//   // Edit Change
//   // ---------------------------------------------------------
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;

//     setEditRow((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // ---------------------------------------------------------
//   // Update
//   // ---------------------------------------------------------
//   const handleUpdate = async (index) => {
//     const row = hoursCeilings[index];

//     if (!row) return;

//     const requestBody = {
//       projectId: lastSearchedProjectId,
//       laborCategoryId: row.laborCategoryId,
//       laborCategoryDesc: row.laborCategoryDesc,
//       hoursCeiling: Number(editRow.hoursCeiling) || 0,
//       applyToRbaCode: "R",
//     };

//     try {
//       await axios.put(
//         `${backendUrl}/Project/UpdateCeilingHrForPLC`,
//         requestBody,
//         {
//           params: {
//             updatedBy,
//           },
//         },
//       );

//       toast.success("Hours ceiling updated successfully");

//       const response = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingHrForPLC`,
//         {
//           params: {
//             projId: lastSearchedProjectId,
//           },
//         },
//       );

//       setHoursCeilings(response.data?.data || []);

//       setEditIndex(null);
//       setEditRow({});
//     } catch (error) {
//       toast.error("Error updating hours ceiling");
//     }
//   };

//   // ---------------------------------------------------------
//   // Cancel Edit
//   // ---------------------------------------------------------
//   const handleCancelEdit = () => {
//     setEditIndex(null);
//     setEditRow({});
//   };

//   // ---------------------------------------------------------
//   // Delete
//   // ---------------------------------------------------------
//   const handleDelete = async (index) => {
//     const row = hoursCeilings[index];

//     if (!row) return;

//     try {
//       await axios.delete(
//         `${backendUrl}/Project/DeleteCeilingHrForPLC/${row.projectId}/${row.laborCategoryId}`,
//       );

//       setHoursCeilings((prev) => prev.filter((_, i) => i !== index));

//       toast.success("Hours ceiling deleted successfully");
//     } catch (error) {
//       toast.error("Error deleting hours ceiling");
//     }
//   };

//   // ---------------------------------------------------------
//   // Description Helper
//   // ---------------------------------------------------------
//   const getDescription = (laborCategory) => {
//     const cat = laborCategories.find(
//       (c) => c.laborCategoryCode === laborCategory,
//     );

//     return cat ? cat.description : "Consulting Services";
//   };

//   // ---------------------------------------------------------
//   // Initial State
//   // ---------------------------------------------------------
//   if (!shouldShowTable) {
//     return (
//       <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-8 text-center">
//         <p className="text-sm font-medium text-gray-600">
//           Please search for a project to view details.
//         </p>

//         <p className="mt-1 text-xs text-gray-400">
//           Select a project from the search above to continue.
//         </p>
//       </div>
//     );
//   }

//   // ---------------------------------------------------------
//   // UI
//   // ---------------------------------------------------------
//   return (
//     <div className="animate-fade-in">
//       <ToastContainer position="top-right" autoClose={1600} />

//       {/* No shadow */}
//       <div className="border border-gray-300 rounded-lg p-4 bg-white">
//         {/* =====================================================
//             HEADER
//         ===================================================== */}
//         <div className="mb-4">
//           <div className="flex items-center justify-between gap-4">
//             {/* Left */}
//             <div>
//               <h2 className="text-sm font-bold text-gray-900">
//                 Hours Ceilings
//               </h2>

//               <div className="flex items-center mt-1">
//                 <span className="text-xs font-medium text-gray-700">
//                   Project:
//                 </span>

//                 <span className="ml-2 text-xs text-gray-900 font-medium">
//                   {lastSearchedProjectId}
//                 </span>
//               </div>
//             </div>

//             {/* =================================================
//                 TOP ACTIONS
//             ================================================= */}
//             {isEditable && (
//               <div className="flex items-center gap-2">
//                 {!showNewRow ? (
//                   <button
//                     type="button"
//                     className="btn1 btn-blue flex items-center gap-2"
//                     onClick={handleNewClick}
//                   >
//                     <FaPlus size={11} />
//                     New
//                   </button>
//                 ) : (
//                   <>
//                     <button
//                       type="button"
//                       onClick={handleSave}
//                       className="btn1 btn-blue flex items-center gap-2"
//                     >
//                       <FaSave size={12} />
//                       Save
//                     </button>

//                     <button
//                       type="button"
//                       onClick={handleCancelNewRow}
//                       className="btn1 flex items-center gap-2 border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
//                     >
//                       <FaTimes size={12} />
//                       Cancel
//                     </button>
//                   </>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* =====================================================
//             CONTENT
//         ===================================================== */}
//         {isLoading ? (
//           <div className="py-8 text-center text-sm text-gray-500">
//             Loading...
//           </div>
//         ) : hoursCeilings.length === 0 && !showNewRow ? (
//           <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center">
//             <p className="text-sm font-semibold text-gray-600">
//               No data available
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto border-line">
//             <table className="w-full table">
//               <thead className="thead">
//                 <tr>
//                   <th className="th-thead whitespace-nowrap">Labor Category</th>

//                   <th className="th-thead whitespace-nowrap">
//                     Labor Category Description
//                   </th>

//                   <th className="th-thead whitespace-nowrap">Hours Ceiling</th>

//                   <th className="th-thead whitespace-nowrap text-center">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="tbody">
//                 {/* =================================================
//                     NEW ROW
//                 ================================================= */}
//                 {showNewRow && (
//                   <tr className="bg-white border-b border-gray-200">
//                     {/* Labor Category */}
//                     <td className="tbody-td">
//                       <input
//                         list="labor-suggestions"
//                         value={newRow.laborCategory}
//                         onChange={(e) =>
//                           handleLaborCategoryChange(e.target.value)
//                         }
//                         onBlur={(e) => handleSuggestionSelect(e.target.value)}
//                         className="table-input"
//                         placeholder="Search Labor Category"
//                       />

//                       <datalist id="labor-suggestions">
//                         {laborCategories.map((cat) => (
//                           <option
//                             key={cat.laborCategoryCode}
//                             value={cat.laborCategoryCode}
//                           >
//                             {cat.laborCategoryCode} - {cat.description}
//                           </option>
//                         ))}
//                       </datalist>
//                     </td>

//                     {/* Description */}
//                     <td className="tbody-td">
//                       <span className="text-gray-700">
//                         {laborCategories.find(
//                           (cat) =>
//                             cat.laborCategoryCode === newRow.laborCategory,
//                         )?.description ||
//                           newRow.laborCategoryDescription ||
//                           "-"}
//                       </span>
//                     </td>

//                     {/* Hours */}
//                     <td className="tbody-td">
//                       <input
//                         type="number"
//                         value={newRow.hoursCeiling}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             hoursCeiling: e.target.value,
//                           }))
//                         }
//                         className="table-input"
//                         placeholder="0"
//                       />
//                     </td>

//                     {/* Top Save / Cancel are used */}
//                     {/* <td className="tbody-td text-center text-xs text-gray-400">
//                       New record
//                     </td> */}
//                   </tr>
//                 )}

//                 {/* =================================================
//                     EXISTING ROWS
//                 ================================================= */}
//                 {hoursCeilings.map((ceiling, index) => (
//                   <tr
//                     key={`${ceiling.projectId || "project"}-${ceiling.laborCategoryId || index}`}
//                     className="bg-white border-b border-gray-200 hover:bg-gray-50"
//                   >
//                     {/* Labor Category */}
//                     <td className="tbody-td">{ceiling.laborCategoryId}</td>

//                     {/* Description */}
//                     <td className="tbody-td">{ceiling.laborCategoryDesc}</td>

//                     {/* Hours Ceiling */}
//                     <td className="tbody-td">
//                       {editIndex === index ? (
//                         <input
//                           type="number"
//                           name="hoursCeiling"
//                           value={editRow.hoursCeiling ?? ""}
//                           onChange={handleEditChange}
//                           className="table-input"
//                         />
//                       ) : (
//                         <span className="font-normal">
//                           {ceiling.hoursCeiling}
//                         </span>
//                       )}
//                     </td>

//                     {/* Actions */}
//                     <td className="tbody-td text-center">
//                       {editIndex === index ? (
//                         <div className="inline-flex items-center gap-2">
//                           <button
//                             type="button"
//                             onClick={() => handleUpdate(index)}
//                             className="text-green-700 hover:text-green-800 transition-colors"
//                             title="Save changes"
//                             aria-label="Save changes"
//                           >
//                             <FaSave size={15} />
//                           </button>

//                           <button
//                             type="button"
//                             onClick={handleCancelEdit}
//                             className="text-gray-500 hover:text-gray-700 transition-colors"
//                             title="Cancel"
//                             aria-label="Cancel edit"
//                           >
//                             <FaTimes size={15} />
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="inline-flex items-center gap-2">
//                           {isEditable && (
//                             <>
//                               <button
//                                 type="button"
//                                 onClick={() => handleEditClick(index)}
//                                 className="text-blue-500 hover:text-blue-700 transition-colors"
//                                 title="Edit"
//                                 aria-label="Edit"
//                               >
//                                 <FaEdit size={15} />
//                               </button>

//                               <button
//                                 type="button"
//                                 onClick={() => handleDelete(index)}
//                                 className="text-gray-400 hover:text-red-600 transition-colors"
//                                 title="Delete"
//                                 aria-label="Delete"
//                               >
//                                 <FaTrash size={15} />
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HoursCeilings;

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "./config";

const HoursCeilings = ({
  projectId,
  project,
  isSearched,
  updatedBy = "Kartikay",
  isEditable,
}) => {
  const [hoursCeilings, setHoursCeilings] = useState([]);
  const [originalHoursCeilings, setOriginalHoursCeilings] = useState([]);
  const [laborCategories, setLaborCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const isValidProjectId = (id) => !!id;

  const shouldShowTable =
    hasSearched && isValidProjectId(lastSearchedProjectId);

  // ---------------------------------------------------------
  // Get Unique Row Key
  // ---------------------------------------------------------
  const getRowKey = (row) =>
    `${row.projectId || lastSearchedProjectId}__${row.laborCategoryId || ""}`;

  // ---------------------------------------------------------
  // Normalize API Row
  // ---------------------------------------------------------
  const normalizeRow = (row) => ({
    _rowId: crypto.randomUUID(),
    projectId: row.projectId || lastSearchedProjectId || projectId,
    laborCategoryId: row.laborCategoryId || "",
    laborCategoryDesc: row.laborCategoryDesc || "",
    hoursCeiling: row.hoursCeiling ?? 0,
    applyToRbaCode: row.applyToRbaCode || "R",
    isSelected: false,
    isNew: false,
  });

  // ---------------------------------------------------------
  // Fetch Hours Ceilings
  // ---------------------------------------------------------
  const fetchHoursCeilings = async (searchedProjectId) => {
    const response = await axios.get(
      `${backendUrl}/Project/GetAllCeilingHrForPLC`,
      {
        params: {
          projId: searchedProjectId,
        },
      },
    );

    return Array.isArray(response.data?.data) ? response.data.data : [];
  };

  // ---------------------------------------------------------
  // Refresh Table
  // ---------------------------------------------------------
  const refreshHoursCeilings = async () => {
    const refreshedRows = await fetchHoursCeilings(
      lastSearchedProjectId || projectId,
    );

    const normalizedRows = refreshedRows.map((row) => ({
      ...normalizeRow(row),
      isSelected: false,
      isNew: false,
    }));

    setOriginalHoursCeilings(normalizedRows);
    setHoursCeilings(normalizedRows);
  };

  // ---------------------------------------------------------
  // Fetch Ceilings + Labor Categories
  // ---------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isSearched && isValidProjectId(projectId)) {
        setIsLoading(true);

        try {
          const projectType = project?.type === "NBBUD" ? "NBBUD" : "PROJECT";

          const [ceilingsRes, projectRes] = await Promise.all([
            axios.get(`${backendUrl}/Project/GetAllCeilingHrForPLC`, {
              params: {
                projId: projectId,
              },
            }),
            axios.get(
              `${backendUrl}/Project/GetAllProjectByProjId/${projectId}/${projectType}`,
            ),
          ]);

          if (!isMounted) return;

          const fetchedRows = Array.isArray(ceilingsRes.data?.data)
            ? ceilingsRes.data.data
            : [];

          const projectData = Array.isArray(projectRes.data)
            ? projectRes.data[0]
            : projectRes.data;

          const plcList = projectData?.plc || [];

          const filteredPlc =
            project?.type === "NBBUD"
              ? plcList
              : plcList.filter((plc) => plc.source !== "N");

          const normalizedRows = fetchedRows.map((row) => ({
            _rowId: crypto.randomUUID(),
            projectId: row.projectId || projectId,
            laborCategoryId: row.laborCategoryId || "",
            laborCategoryDesc: row.laborCategoryDesc || "",
            hoursCeiling: row.hoursCeiling ?? 0,
            applyToRbaCode: row.applyToRbaCode || "R",
            isSelected: false,
            isNew: false,
          }));

          setHoursCeilings(normalizedRows);
          setOriginalHoursCeilings(normalizedRows);
          setLaborCategories(filteredPlc);
          setLastSearchedProjectId(projectId);
          setHasSearched(true);
        } catch (error) {
          console.error("Error fetching hours ceilings:", error);

          if (isMounted) {
            setHoursCeilings([]);
            setOriginalHoursCeilings([]);
            setLaborCategories([]);
            setLastSearchedProjectId(projectId);
            setHasSearched(true);

            toast.error("Failed to fetch project details.");
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else if (isMounted) {
        setHoursCeilings([]);
        setOriginalHoursCeilings([]);
        setLaborCategories([]);
        setIsLoading(false);
        setLastSearchedProjectId("");
        setHasSearched(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [isSearched, projectId, project?.type]);

  // ---------------------------------------------------------
  // Create Empty Row
  // ---------------------------------------------------------
  const createEmptyRow = () => ({
    _rowId: crypto.randomUUID(),
    projectId: lastSearchedProjectId || projectId,
    laborCategoryId: "",
    laborCategoryDesc: "",
    hoursCeiling: "",
    applyToRbaCode: "R",
    isSelected: false,
    isNew: true,
  });

  // ---------------------------------------------------------
  // New
  // ---------------------------------------------------------
  const handleNewClick = () => {
    if (!shouldShowTable) {
      toast.warning("Please search for a valid project first.");
      return;
    }

    setHoursCeilings((prev) => [createEmptyRow(), ...prev]);
  };

  // ---------------------------------------------------------
  // Labor Category Change
  // ---------------------------------------------------------
  const handleLaborCategoryChange = (index, value) => {
    const selected = laborCategories.find(
      (category) => String(category.laborCategoryCode) === String(value),
    );

    setHoursCeilings((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              laborCategoryId: value,
              laborCategoryDesc: selected?.description || "",
            }
          : row,
      ),
    );
  };

  // ---------------------------------------------------------
  // Existing Row Change
  // ---------------------------------------------------------
  const handleExistingRowChange = (index, value) => {
    setHoursCeilings((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              hoursCeiling: value,
            }
          : row,
      ),
    );
  };

  // ---------------------------------------------------------
  // Select One Row
  // ---------------------------------------------------------
  const handleSelectRow = (index, checked) => {
    setHoursCeilings((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index && !row.isNew
          ? {
              ...row,
              isSelected: checked,
            }
          : row,
      ),
    );
  };

  // ---------------------------------------------------------
  // Select All Rows
  // ---------------------------------------------------------
  const handleSelectAll = (checked) => {
    setHoursCeilings((prev) =>
      prev.map((row) => ({
        ...row,
        isSelected: row.isNew ? false : checked,
      })),
    );
  };

  const existingRows = hoursCeilings.filter((row) => !row.isNew);

  const selectedRowsCount = existingRows.filter((row) => row.isSelected).length;

  const allRowsSelected =
    existingRows.length > 0 && existingRows.every((row) => row.isSelected);

  // ---------------------------------------------------------
  // Build Payload
  // ---------------------------------------------------------
  const buildPayload = (row) => ({
    projectId: row.projectId || lastSearchedProjectId || projectId,
    laborCategoryId: row.laborCategoryId,
    laborCategoryDesc: row.laborCategoryDesc || "",
    hoursCeiling:
      row.hoursCeiling === "" || row.hoursCeiling === null
        ? 0
        : Number(row.hoursCeiling),
    applyToRbaCode: row.applyToRbaCode || "R",
  });

  // ---------------------------------------------------------
  // Validate Rows
  // ---------------------------------------------------------
  const validateRows = () => {
    const invalidRow = hoursCeilings.find(
      (row) =>
        !String(row.laborCategoryId || "").trim() ||
        row.hoursCeiling === "" ||
        row.hoursCeiling === null ||
        Number.isNaN(Number(row.hoursCeiling)) ||
        Number(row.hoursCeiling) < 0,
    );

    if (invalidRow) {
      toast.warning(
        "Please fill Labor Category and enter a valid Hours Ceiling.",
      );
      return false;
    }

    // 2. Suggestion List Validation
    for (const row of hoursCeilings) {
      const categoryCode = String(row.laborCategoryId || "").trim();

      const isValidCategory = laborCategories.some(
        (cat) =>
          String(cat.laborCategoryCode).toLowerCase() ===
          categoryCode.toLowerCase(),
      );

      if (!isValidCategory) {
        toast.warning(
          `Labor Category "${row.laborCategoryId}" is invalid. Please select from the suggestion list.`,
        );
        return false;
      }
    }

    const seen = new Set();

    for (const row of hoursCeilings) {
      const key = String(row.laborCategoryId || "")
        .trim()
        .toLowerCase();

      if (seen.has(key)) {
        toast.error(`Labor Category "${row.laborCategoryId}" is duplicated.`);
        return false;
      }

      seen.add(key);
    }

    return true;
  };

  // ---------------------------------------------------------
  // Save New + Updated Rows
  // ---------------------------------------------------------
  const handleSave = async () => {
    if (!isEditable) return;

    if (hoursCeilings.length === 0) {
      toast.info("There are no changes to save.");
      return;
    }

    if (!validateRows()) return;

    const originalMap = new Map(
      originalHoursCeilings.map((row) => [getRowKey(row), row]),
    );

    const currentMap = new Map(
      hoursCeilings
        .filter((row) => !row.isNew)
        .map((row) => [getRowKey(row), row]),
    );

    const rowsToCreate = hoursCeilings.filter((row) => row.isNew);

    const rowsToUpdate = hoursCeilings.filter((row) => {
      if (row.isNew) return false;

      const original = originalMap.get(getRowKey(row));

      if (!original) return false;

      return (
        String(original.hoursCeiling ?? "") !==
          String(row.hoursCeiling ?? "") ||
        String(original.applyToRbaCode || "R") !==
          String(row.applyToRbaCode || "R")
      );
    });

    const rowsToDelete = originalHoursCeilings.filter(
      (original) => !currentMap.has(getRowKey(original)),
    );

    if (
      rowsToCreate.length === 0 &&
      rowsToUpdate.length === 0 &&
      rowsToDelete.length === 0
    ) {
      toast.info("There are no changes to save.");
      return;
    }

    setIsSaving(true);

    try {
      await Promise.all([
        ...rowsToCreate.map((row) =>
          axios.post(
            `${backendUrl}/Project/CreateCeilingHrForPLC?updatedBy=${encodeURIComponent(
              updatedBy,
            )}`,
            buildPayload(row),
          ),
        ),

        ...rowsToUpdate.map((row) =>
          axios.put(
            `${backendUrl}/Project/UpdateCeilingHrForPLC`,
            buildPayload(row),
            {
              params: {
                updatedBy,
              },
            },
          ),
        ),

        ...rowsToDelete.map((row) =>
          axios.delete(
            `${backendUrl}/Project/DeleteCeilingHrForPLC/${
              row.projectId || lastSearchedProjectId || projectId
            }/${encodeURIComponent(row.laborCategoryId)}`,
          ),
        ),
      ]);

      await refreshHoursCeilings();

      toast.success("Changes saved successfully.");
    } catch (error) {
      console.error("Error saving hours ceilings:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to save changes. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------------
  // Delete Selected Rows
  // ---------------------------------------------------------
  const handleDelete = async () => {
    const rowsToDelete = hoursCeilings.filter(
      (row) => !row.isNew && row.isSelected,
    );

    if (rowsToDelete.length === 0) {
      toast.warning("Please select at least one row to delete.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${rowsToDelete.length} selected row(s)?`,
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const deleteResults = await Promise.allSettled(
        rowsToDelete.map((row) =>
          axios.delete(
            `${backendUrl}/Project/DeleteCeilingHrForPLC/${
              row.projectId || lastSearchedProjectId || projectId
            }/${encodeURIComponent(row.laborCategoryId)}`,
          ),
        ),
      );

      const failedDeletes = deleteResults.filter(
        (result) => result.status === "rejected",
      );

      if (failedDeletes.length > 0) {
        toast.error(`${failedDeletes.length} row(s) could not be deleted.`);
      } else {
        toast.success("Selected rows deleted successfully.");
      }

      await refreshHoursCeilings();
    } catch (error) {
      console.error("Error deleting hours ceilings:", error);
      toast.error("Error deleting selected rows.");
    } finally {
      setIsDeleting(false);
    }
  };

  // ---------------------------------------------------------
  // Clear Unsaved Changes
  // ---------------------------------------------------------
  const handleClear = () => {
    const hasChanges =
      JSON.stringify(
        hoursCeilings.map(({ isSelected, isNew, ...row }) => row),
      ) !==
      JSON.stringify(
        originalHoursCeilings.map(({ isSelected, isNew, ...row }) => row),
      );

    if (!hasChanges) {
      toast.info("There are no unsaved changes to clear.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to clear all unsaved changes?",
    );

    if (!confirmed) return;

    setHoursCeilings(
      originalHoursCeilings.map((row) => ({
        ...row,
        isSelected: false,
        isNew: false,
      })),
    );

    toast.success("Unsaved changes cleared.");
  };

  const hasUnsavedChanges = useMemo(() => {
    const cleanRows = (rows) =>
      rows.map(({ isSelected, isNew, ...row }) => row);

    return (
      JSON.stringify(cleanRows(hoursCeilings)) !==
      JSON.stringify(cleanRows(originalHoursCeilings))
    );
  }, [hoursCeilings, originalHoursCeilings]);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-8 text-center">
        <p className="text-sm font-medium text-gray-600">
          Loading Hour ceilings...
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------
  // Initial State
  // ---------------------------------------------------------
  if (!shouldShowTable) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-8 text-center">
        <p className="text-sm font-medium text-gray-600">
          Please search for a project to view details.
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Select a project from the search above to continue.
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
  return (
    <div className="animate-fade-in">
      <ToastContainer position="top-right" autoClose={1600} />

      <div className="border border-gray-300 rounded-lg p-4 bg-white">
        <div className="mb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Hours Ceilings
              </h2>

              <div className="flex items-center mt-1">
                <span className="text-xs font-medium text-gray-700">
                  Project:
                </span>

                <span className="ml-2 text-xs text-gray-900 font-medium">
                  {lastSearchedProjectId}
                </span>
              </div>
            </div>

            {isEditable && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn1 btn-blue disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleNewClick}
                  disabled={isSaving || isDeleting}
                >
                  New
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSaving || isDeleting || selectedRowsCount === 0}
                  className="btn1 btn-blue disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : `Delete (${selectedRowsCount})`}
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || isDeleting || !hasUnsavedChanges}
                  className="btn1 btn-blue disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isSaving || isDeleting || !hasUnsavedChanges}
                  className="btn1 btn-blue disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-sm text-gray-500">
            Loading...
          </div>
        ) : hoursCeilings.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center">
            <p className="text-sm font-semibold text-gray-600">
              No data available
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border-line">
            <table className="w-full table">
              <thead className="thead">
                <tr>
                  {isEditable && (
                    <th className="th-thead whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={allRowsSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        disabled={existingRows.length === 0}
                        className="h-3 w-3 cursor-pointer"
                      />
                    </th>
                  )}

                  <th className="th-thead whitespace-nowrap">Labor Category</th>

                  <th className="th-thead whitespace-nowrap">
                    Labor Category Description
                  </th>

                  <th className="th-thead whitespace-nowrap">Hours Ceiling</th>
                </tr>
              </thead>

              <tbody className="tbody">
                {hoursCeilings.map((ceiling, index) => {
                  const originalRow = originalHoursCeilings.find(
                    (row) => getRowKey(row) === getRowKey(ceiling),
                  );

                  const isModified =
                    ceiling.isNew ||
                    (originalRow &&
                      String(originalRow.hoursCeiling ?? "") !==
                        String(ceiling.hoursCeiling ?? ""));

                  return (
                    <tr
                      key={ceiling._rowId}
                      className={`border-b border-gray-100 transition ${
                        ceiling.isNew
                          ? "bg-gray-50"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {isEditable && (
                        <td className="tbody-td text-center">
                          <input
                            type="checkbox"
                            checked={
                              ceiling.isNew
                                ? false
                                : Boolean(ceiling.isSelected)
                            }
                            disabled={ceiling.isNew}
                            onChange={(e) =>
                              handleSelectRow(index, e.target.checked)
                            }
                            className="h-3 w-3 cursor-pointer disabled:cursor-not-allowed"
                          />
                        </td>
                      )}

                      <td className="tbody-td">
                        {ceiling.isNew ? (
                          <>
                            <input
                              list="labor-suggestions"
                              value={ceiling.laborCategoryId}
                              onChange={(e) =>
                                handleLaborCategoryChange(index, e.target.value)
                              }
                              className="table-input"
                              placeholder="Search Labor Category"
                            />

                            <datalist id="labor-suggestions">
                              {laborCategories.map((category) => (
                                <option
                                  key={category.laborCategoryCode}
                                  value={category.laborCategoryCode}
                                >
                                  {category.laborCategoryCode} -{" "}
                                  {category.description}
                                </option>
                              ))}
                            </datalist>
                          </>
                        ) : (
                          ceiling.laborCategoryId
                        )}
                      </td>

                      <td className="tbody-td">
                        {ceiling.isNew
                          ? ceiling.laborCategoryDesc || "-"
                          : ceiling.laborCategoryDesc}
                      </td>

                      <td className="tbody-td">
                        {isEditable ? (
                          <input
                            type="number"
                            min="0"
                            value={ceiling.hoursCeiling ?? ""}
                            onChange={(e) =>
                              handleExistingRowChange(index, e.target.value)
                            }
                            className="table-input"
                          />
                        ) : (
                          <span className="font-normal">
                            {ceiling.hoursCeiling}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HoursCeilings;
