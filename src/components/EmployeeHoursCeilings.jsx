// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaEdit, FaTrash, FaSave, FaPlus, FaTimes } from "react-icons/fa";
// import { backendUrl } from "./config";

// const EmployeeHoursCeilings = ({
//   projectId,
//   project,
//   isSearched,
//   updatedBy = "user",
//   isEditable,
// }) => {
//   const [employees, setEmployees] = useState([]);
//   const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
//   const [laborCategories, setLaborCategories] = useState([]);

//   const [editIndex, setEditIndex] = useState(null);
//   const [editRow, setEditRow] = useState({});

//   const [showNewRow, setShowNewRow] = useState(false);

//   const [newRow, setNewRow] = useState({
//     empId: "",
//     employeeName: "",
//     laborCategoryId: "",
//     laborCategoryDesc: "",
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
//       empId: "",
//       employeeName: "",
//       laborCategoryId: "",
//       laborCategoryDesc: "",
//       hoursCeiling: "",
//     });
//   };

//   // ---------------------------------------------------------
//   // Fetch Project Data
//   // ---------------------------------------------------------
//   useEffect(() => {
//     let isMounted = true;

//     const fetchData = async () => {
//       if (isSearched && isValidProjectId(projectId)) {
//         setIsLoading(true);

//         try {
//           const [empResponse, ceilingResponse, laborResponse] =
//             await Promise.all([
//               axios.get(
//                 `${backendUrl}/Project/GetEmployeesByProject/${projectId}?type=hours`,
//               ),
//               axios.get(
//                 `${backendUrl}/Project/GetAllCeilingHrForEmp?projId=${projectId}`,
//               ),
//               axios.get(`${backendUrl}/Project/GetAllPlcs/`),
//             ]);

//           if (isMounted) {
//             const laborData = laborResponse.data || [];
//             const filteredLaborData =
//               project?.type === "NBBUD"
//                 ? laborData
//                 : laborData.filter((labor) => labor.source !== "N");

//             setLaborCategories(filteredLaborData);
//             setEmployeeSuggestions(empResponse.data || []);

//             // Map ceiling data and look up missing descriptions from filteredLaborData
//             const rawCeilings = Array.isArray(ceilingResponse.data?.data)
//               ? ceilingResponse.data.data
//               : [];

//             const mappedEmployees = rawCeilings.map((emp) => {
//               const matchedLabor = filteredLaborData.find(
//                 (cat) => cat.laborCategoryCode === emp.laborCategoryId,
//               );

//               return {
//                 projectId: emp.projectId || "",
//                 empId: emp.employeeId?.trim() || "",
//                 employeeName: emp.employeeName || "",
//                 laborCategoryId: emp.laborCategoryId || "",
//                 laborCategoryDesc:
//                   emp.laborCategoryDesc || matchedLabor?.description || "",
//                 hoursCeiling: emp.hoursCeiling ?? 0,
//                 applyToRbaCode: emp.applyToRbaCode || "",
//               };
//             });

//             setEmployees(mappedEmployees);
//             setLastSearchedProjectId(projectId);
//             setHasSearched(true);
//           }

//           // if (isMounted) {
//           //   setEmployeeSuggestions(empResponse.data || []);

//           //   setEmployees(
//           //     Array.isArray(ceilingResponse.data?.data)
//           //       ? ceilingResponse.data.data.map((emp) => ({
//           //           projectId: emp.projectId || "",
//           //           empId: emp.employeeId?.trim() || "",
//           //           employeeName: emp.employeeName || "",
//           //           laborCategoryId: emp.laborCategoryId || "",
//           //           laborCategoryDesc: emp.laborCategoryDesc || "",
//           //           hoursCeiling: emp.hoursCeiling ?? 0,
//           //           applyToRbaCode: emp.applyToRbaCode || "",
//           //         }))
//           //       : [],
//           //   );

//           //   const laborData = laborResponse.data || [];

//           //   const filteredLaborData =
//           //     project.type === "NBBUD"
//           //       ? laborData
//           //       : laborData.filter((labor) => labor.source !== "N");

//           //   setLaborCategories(filteredLaborData);
//           //   setLastSearchedProjectId(projectId);
//           //   setHasSearched(true);
//           // }
//         } catch (error) {
//           if (isMounted) {
//             setEmployees([]);
//             setEmployeeSuggestions([]);
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
//         setEmployees([]);
//         setEmployeeSuggestions([]);
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
//   }, [projectId, isSearched]);

//   const shouldShowTable =
//     hasSearched && isValidProjectId(lastSearchedProjectId);

//   // ---------------------------------------------------------
//   // New Row
//   // ---------------------------------------------------------
//   const handleNewClick = () => {
//     if (!shouldShowTable) {
//       toast.warning("Please search for a valid project first.");
//       return;
//     }

//     // Prevent opening another new row
//     if (showNewRow) return;

//     setShowNewRow(true);

//     resetNewRow();

//     // Close any active edit
//     setEditIndex(null);
//     setEditRow({});
//   };

//   // ---------------------------------------------------------
//   // New Employee Change
//   // ---------------------------------------------------------
//   const handleNewEmployeeIdChange = (value) => {
//     const selected = employeeSuggestions.find((sug) => sug.empId === value);

//     setNewRow((prev) => ({
//       ...prev,
//       empId: value,
//       employeeName: selected ? selected.employeeName : "",
//     }));
//   };

//   // ---------------------------------------------------------
//   // New Labor Category Change
//   // ---------------------------------------------------------
//   const handleNewLaborCategoryChange = (value) => {
//     const selected = laborCategories.find(
//       (cat) => cat.laborCategoryCode === value,
//     );

//     setNewRow((prev) => ({
//       ...prev,
//       laborCategoryId: value,
//       laborCategoryDesc: selected ? selected.description : "",
//     }));
//   };

//   // ---------------------------------------------------------
//   // Save New Employee
//   // ---------------------------------------------------------
//   const handleSave = async () => {
//     if (!newRow.empId || !newRow.laborCategoryId || !newRow.hoursCeiling) {
//       toast.error("Please fill all fields.");
//       return;
//     }

//     const requestBody = {
//       projectId,
//       employeeId: newRow.empId,
//       laborCategoryId: newRow.laborCategoryId,
//       hoursCeiling: Number(newRow.hoursCeiling) || 0,
//       applyToRbaCode: "R",
//       employeeName: newRow.employeeName || "",
//       laborCategoryDesc: newRow.laborCategoryDesc || "",
//     };

//     try {
//       await axios.post(
//         `${backendUrl}/Project/CreateCeilingHrForEmp?updatedBy=${updatedBy}`,
//         requestBody,
//       );

//       toast.success("Saved successfully.");

//       const response = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingHrForEmp?projId=${lastSearchedProjectId}`,
//       );

//       setEmployees(
//         Array.isArray(response.data?.data)
//           ? response.data.data.map((emp) => ({
//               projectId: emp.projectId || "",
//               empId: emp.employeeId?.trim() || "",
//               employeeName: emp.employeeName || "",
//               laborCategoryId: emp.laborCategoryId || "",
//               laborCategoryDesc: emp.laborCategoryDesc || "",
//               hoursCeiling: emp.hoursCeiling ?? 0,
//               applyToRbaCode: emp.applyToRbaCode || "",
//             }))
//           : [],
//       );

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
//     setEditRow({ ...employees[index] });

//     // Close new row if open
//     setShowNewRow(false);
//     resetNewRow();
//   };

//   const handleEditChange = (field, value) => {
//     setEditRow((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // ---------------------------------------------------------
//   // Employee ID Change - Edit
//   // ---------------------------------------------------------
//   const handleEmployeeIdChange = (index, value) => {
//     const selected = employeeSuggestions.find((sug) => sug.empId === value);

//     setEditRow((prev) => ({
//       ...prev,
//       empId: value,
//       employeeName: selected ? selected.employeeName : "",
//     }));
//   };

//   // ---------------------------------------------------------
//   // Labor Category Change - Edit
//   // ---------------------------------------------------------
//   const handleLaborCategoryChange = (index, value) => {
//     const selected = laborCategories.find(
//       (cat) => cat.laborCategoryCode === value,
//     );

//     setEditRow((prev) => ({
//       ...prev,
//       laborCategoryId: value,
//       laborCategoryDesc: selected ? selected.description : "",
//     }));
//   };

//   // ---------------------------------------------------------
//   // Update Existing Employee
//   // ---------------------------------------------------------
//   const handleUpdate = async (index) => {
//     const updatedEmp = editRow;

//     if (
//       !updatedEmp.empId ||
//       !updatedEmp.laborCategoryId ||
//       !updatedEmp.hoursCeiling
//     ) {
//       toast.error("Please fill all fields.");
//       return;
//     }

//     const requestBody = {
//       projectId,
//       employeeId: updatedEmp.empId,
//       laborCategoryId: updatedEmp.laborCategoryId,
//       hoursCeiling: Number(updatedEmp.hoursCeiling) || 0,
//       applyToRbaCode: updatedEmp.applyToRbaCode || "R",
//       employeeName: updatedEmp.employeeName || "",
//       laborCategoryDesc: updatedEmp.laborCategoryDesc || "",
//     };

//     try {
//       await axios.put(
//         `${backendUrl}/Project/UpdateCeilingHrForEmp?updatedBy=${updatedBy}`,
//         requestBody,
//       );

//       setEmployees((prev) =>
//         prev.map((emp, i) =>
//           i === index
//             ? {
//                 ...emp,
//                 ...requestBody,
//               }
//             : emp,
//         ),
//       );

//       toast.success("Update successful.");

//       setEditIndex(null);
//       setEditRow({});
//     } catch (error) {
//       toast.error("Failed to update.");
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
//     const employee = employees[index];

//     if (!employee) return;

//     try {
//       await axios.delete(
//         `${backendUrl}/Project/DeleteCeilingHrForEmp/${employee.projectId}/${employee.empId}/${employee.laborCategoryId}`,
//       );

//       setEmployees((prev) => prev.filter((_, i) => i !== index));

//       toast.success("Employee record deleted successfully!");
//     } catch (error) {
//       toast.error("Could not delete employee. Please try again.");
//     }
//   };

//   // ---------------------------------------------------------
//   // Empty State
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
//       <ToastContainer />

//       <div className="border border-gray-300 rounded-lg p-4 bg-white">
//         {/* =====================================================
//             HEADER
//         ===================================================== */}
//         <div className="mb-4">
//           <div className="flex items-center justify-between gap-4">
//             <div>
//               <h2 className="text-sm font-bold text-gray-900">
//                 Employee Hours Ceilings
//               </h2>

//               <div className="flex items-center mt-1">
//                 <span className="text-xs font-medium text-gray-700">
//                   Project:
//                 </span>

//                 <span className="text-xs text-gray-900 ml-2 font-medium">
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
//         ) : employees.length === 0 && !showNewRow ? (
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
//                   <th className="th-thead">Empl ID</th>
//                   <th className="th-thead">Employee Name</th>
//                   <th className="th-thead">Labor Category</th>
//                   <th className="th-thead">Labor Desc</th>
//                   <th className="th-thead">Hours Ceiling</th>
//                   <th className="th-thead">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="tbody">
//                 {/* =================================================
//                     NEW ROW
//                 ================================================= */}
//                 {showNewRow && (
//                   <tr className="bg-white border-b border-gray-200">
//                     <td className="tbody-td">
//                       <input
//                         list="emp-suggestions"
//                         value={newRow.empId}
//                         onChange={(e) =>
//                           handleNewEmployeeIdChange(e.target.value)
//                         }
//                         className="table-input"
//                         placeholder="Search Empl ID"
//                       />

//                       <datalist id="emp-suggestions">
//                         {employeeSuggestions.map((sug) => (
//                           <option key={sug.empId} value={sug.empId}>
//                             {sug.empId} - {sug.employeeName}
//                           </option>
//                         ))}
//                       </datalist>
//                     </td>

//                     <td className="tbody-td">
//                       <span className="text-gray-700">
//                         {newRow.employeeName || "-"}
//                       </span>
//                     </td>

//                     <td className="tbody-td">
//                       <input
//                         list="labor-suggestions"
//                         value={newRow.laborCategoryId}
//                         onChange={(e) =>
//                           handleNewLaborCategoryChange(e.target.value)
//                         }
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

//                     <td className="tbody-td">
//                       <span className="text-gray-700">
//                         {newRow.laborCategoryDesc || "-"}
//                       </span>
//                     </td>

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

//                     {/* No Save / Cancel here anymore */}
//                     {/* <td className="tbody-td text-gray-400 text-xs">
//                       New record
//                     </td> */}
//                   </tr>
//                 )}

//                 {/* =================================================
//                     EXISTING EMPLOYEES
//                 ================================================= */}
//                 {employees.map((emp, index) => (
//                   <tr
//                     key={`${emp.projectId}-${emp.empId}-${index}`}
//                     className="bg-white border-b border-gray-200 hover:bg-gray-50"
//                   >
//                     {/* Employee ID */}
//                     <td className="tbody-td">
//                       {editIndex === index ? (
//                         <>
//                           <input
//                             list={`empSuggestions-${index}`}
//                             value={editRow.empId || ""}
//                             onChange={(e) =>
//                               handleEmployeeIdChange(index, e.target.value)
//                             }
//                             disabled={true}
//                             className="table-input"
//                             placeholder="Search Empl ID"
//                           />

//                           <datalist id={`empSuggestions-${index}`}>
//                             {employeeSuggestions.map((sug) => (
//                               <option key={sug.empId} value={sug.empId}>
//                                 {sug.empId} - {sug.employeeName}
//                               </option>
//                             ))}
//                           </datalist>
//                         </>
//                       ) : (
//                         emp.empId
//                       )}
//                     </td>

//                     {/* Employee Name */}
//                     <td className="tbody-td">
//                       {editIndex === index ? (
//                         <input
//                           type="text"
//                           value={editRow.employeeName || ""}
//                           disabled
//                           className="table-input bg-gray-50"
//                         />
//                       ) : (
//                         emp.employeeName
//                       )}
//                     </td>

//                     {/* Labor Category */}
//                     <td className="tbody-td">
//                       {editIndex === index ? (
//                         <>
//                           <input
//                             list={`laborSuggestions-${index}`}
//                             value={editRow.laborCategoryId || ""}
//                             onChange={(e) =>
//                               handleLaborCategoryChange(index, e.target.value)
//                             }
//                             disabled={true}
//                             className="table-input"
//                             placeholder="Search Labor Category"
//                           />

//                           <datalist id={`laborSuggestions-${index}`}>
//                             {laborCategories.map((cat) => (
//                               <option
//                                 key={cat.laborCategoryCode}
//                                 value={cat.laborCategoryCode}
//                               >
//                                 {cat.laborCategoryCode} - {cat.description}
//                               </option>
//                             ))}
//                           </datalist>
//                         </>
//                       ) : (
//                         emp.laborCategoryId
//                       )}
//                     </td>

//                     {/* Labor Description */}
//                     <td className="tbody-td">
//                       {editIndex === index ? (
//                         <input
//                           type="text"
//                           value={editRow.laborCategoryDesc || ""}
//                           disabled
//                           className="table-input bg-gray-50"
//                         />
//                       ) : (
//                         emp.laborCategoryDesc
//                       )}
//                     </td>

//                     {/* Hours Ceiling */}
//                     <td className="tbody-td">
//                       {editIndex === index ? (
//                         <input
//                           type="number"
//                           value={editRow.hoursCeiling ?? ""}
//                           onChange={(e) =>
//                             handleEditChange("hoursCeiling", e.target.value)
//                           }
//                           className="table-input"
//                           placeholder="0"
//                         />
//                       ) : (
//                         emp.hoursCeiling
//                       )}
//                     </td>

//                     {/* Actions */}
//                     <td className="tbody-td">
//                       {editIndex === index ? (
//                         <div className="flex items-center gap-2">
//                           <button
//                             type="button"
//                             onClick={() => handleUpdate(index)}
//                             className="text-green-700 hover:text-green-800 transition-colors"
//                             title="Save changes"
//                           >
//                             <FaSave size={15} />
//                           </button>

//                           <button
//                             type="button"
//                             onClick={handleCancelEdit}
//                             className="text-gray-500 hover:text-gray-800 transition-colors"
//                             title="Cancel"
//                           >
//                             <FaTimes size={15} />
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="flex items-center gap-2">
//                           {isEditable && (
//                             <>
//                               <button
//                                 type="button"
//                                 onClick={() => handleEditClick(index)}
//                                 className="text-blue-500 hover:text-blue-700 transition-colors"
//                                 title="Edit"
//                               >
//                                 <FaEdit size={15} />
//                               </button>

//                               <button
//                                 type="button"
//                                 onClick={() => handleDelete(index)}
//                                 className="text-gray-400 hover:text-red-600 transition-colors"
//                                 title="Delete"
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

// export default EmployeeHoursCeilings;

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "./config";

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------

const isValidProjectId = (id) => !!id;

const normalizeValue = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const getRowKey = (row) =>
  `${row.projectId ?? ""}__${row.empId ?? ""}__${row.laborCategoryId ?? ""}`;

const createEmptyRow = (projectId) => ({
  _rowId: crypto.randomUUID(),
  projectId,
  empId: "",
  employeeName: "",
  laborCategoryId: "",
  laborCategoryDesc: "",
  hoursCeiling: "",
  applyToRbaCode: "R",
  isNew: true,
  isSelected: false,
});

// ---------------------------------------------------------
// Component
// ---------------------------------------------------------

const EmployeeHoursCeilings = ({
  projectId,
  project,
  isSearched,
  updatedBy = "user",
  isEditable,
}) => {
  const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
  const [laborCategories, setLaborCategories] = useState([]);

  // Original API snapshot
  const [originalEmployees, setOriginalEmployees] = useState([]);

  // Working rows, including new and edited rows
  const [employees, setEmployees] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const shouldShowTable =
    isSearched && isValidProjectId(lastSearchedProjectId) && hasSearched;

  // ---------------------------------------------------------
  // Normalize API Rows
  // ---------------------------------------------------------

  const normalizeApiRows = (rows, targetProjectId = projectId) =>
    rows.map((employee) => {
      const matchedLabor = laborCategories.find(
        (category) =>
          String(category.laborCategoryCode) ===
          String(employee.laborCategoryId),
      );

      return {
        projectId: employee.projectId || targetProjectId,
        empId: employee.employeeId?.trim() || "",
        employeeName: employee.employeeName || "",
        laborCategoryId: employee.laborCategoryId || "",
        laborCategoryDesc:
          employee.laborCategoryDesc || matchedLabor?.description || "",
        hoursCeiling: employee.hoursCeiling ?? 0,
        applyToRbaCode: employee.applyToRbaCode || "R",
        isNew: false,
        isSelected: false,
      };
    });

  // ---------------------------------------------------------
  // Fetch Project Data
  // ---------------------------------------------------------

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!(isSearched && isValidProjectId(projectId))) {
        setEmployees([]);
        setOriginalEmployees([]);
        setEmployeeSuggestions([]);
        setLaborCategories([]);
        setLastSearchedProjectId("");
        setHasSearched(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const [empResponse, ceilingResponse, laborResponse] = await Promise.all(
          [
            axios.get(
              `${backendUrl}/Project/GetEmployeesByProject/${projectId}?type=hours`,
            ),
            axios.get(
              `${backendUrl}/Project/GetAllCeilingHrForEmp?projId=${projectId}`,
            ),
            axios.get(`${backendUrl}/Project/GetAllPlcs/`),
          ],
        );

        if (!isMounted) return;

        const laborData = Array.isArray(laborResponse.data)
          ? laborResponse.data
          : [];

        const filteredLaborData =
          project?.type === "NBBUD"
            ? laborData
            : laborData.filter((labor) => labor.source !== "N");

        const employeeData = Array.isArray(empResponse.data)
          ? empResponse.data
          : [];

        const rawCeilings = Array.isArray(ceilingResponse.data?.data)
          ? ceilingResponse.data.data
          : [];

        const mappedEmployees = rawCeilings.map((employee) => {
          const matchedLabor = filteredLaborData.find(
            (category) =>
              String(category.laborCategoryCode) ===
              String(employee.laborCategoryId),
          );

          return {
            _rowId: crypto.randomUUID(),
            projectId: employee.projectId || projectId,
            empId: employee.employeeId?.trim() || "",
            employeeName: employee.employeeName || "",
            laborCategoryId: employee.laborCategoryId || "",
            laborCategoryDesc:
              employee.laborCategoryDesc || matchedLabor?.description || "",
            hoursCeiling: employee.hoursCeiling ?? 0,
            applyToRbaCode: employee.applyToRbaCode || "R",
            isNew: false,
            isSelected: false,
          };
        });

        setLaborCategories(filteredLaborData);
        setEmployeeSuggestions(employeeData);

        setOriginalEmployees(mappedEmployees);
        setEmployees(mappedEmployees);

        setLastSearchedProjectId(projectId);
        setHasSearched(true);
      } catch (error) {
        console.error("Fetch employee hours ceiling error:", error);

        if (isMounted) {
          setEmployees([]);
          setOriginalEmployees([]);
          setEmployeeSuggestions([]);
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
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [projectId, isSearched, project?.type]);

  // ---------------------------------------------------------
  // Change Detection
  // ---------------------------------------------------------

  const getComparableRows = (rows) =>
    rows.map((row) => {
      const { isSelected, isNew, ...comparableRow } = row;

      return comparableRow;
    });

  const hasChanges = useMemo(() => {
    return (
      JSON.stringify(getComparableRows(originalEmployees)) !==
      JSON.stringify(getComparableRows(employees))
    );
  }, [originalEmployees, employees]);

  const selectedExistingRows = useMemo(
    () =>
      employees.filter((employee) => employee.isSelected && !employee.isNew),
    [employees],
  );

  const selectedRowsCount = selectedExistingRows.length;

  // ---------------------------------------------------------
  // New Row
  // ---------------------------------------------------------

  const handleNewClick = () => {
    if (!shouldShowTable) {
      toast.warning("Please search for a valid project first.");
      return;
    }

    setEmployees((prev) => [
      createEmptyRow(lastSearchedProjectId || projectId),
      ...prev,
    ]);
  };

  // ---------------------------------------------------------
  // New Employee Change
  // ---------------------------------------------------------

  const handleNewEmployeeIdChange = (index, value) => {
    const selected = employeeSuggestions.find(
      (suggestion) => String(suggestion.empId).trim() === String(value).trim(),
    );

    setEmployees((prev) =>
      prev.map((employee, rowIndex) => {
        if (rowIndex !== index) return employee;

        return {
          ...employee,
          empId: value,
          employeeName: selected?.employeeName || "",
        };
      }),
    );
  };

  // ---------------------------------------------------------
  // New Labor Category Change
  // ---------------------------------------------------------

  const handleNewLaborCategoryChange = (index, value) => {
    const selected = laborCategories.find(
      (category) => String(category.laborCategoryCode) === String(value),
    );

    setEmployees((prev) =>
      prev.map((employee, rowIndex) => {
        if (rowIndex !== index) return employee;

        return {
          ...employee,
          laborCategoryId: value,
          laborCategoryDesc: selected?.description || "",
        };
      }),
    );
  };

  // ---------------------------------------------------------
  // Cell Change
  // ---------------------------------------------------------

  const handleCellChange = (index, field, value) => {
    setEmployees((prev) =>
      prev.map((employee, rowIndex) =>
        rowIndex === index
          ? {
              ...employee,
              [field]: value,
            }
          : employee,
      ),
    );
  };

  // ---------------------------------------------------------
  // Checkbox Selection
  // ---------------------------------------------------------

  const handleToggleRow = (index, checked) => {
    setEmployees((prev) =>
      prev.map((employee, rowIndex) =>
        rowIndex === index && !employee.isNew
          ? {
              ...employee,
              isSelected: checked,
            }
          : employee,
      ),
    );
  };

  const allRowsSelected =
    employees.filter((employee) => !employee.isNew).length > 0 &&
    employees
      .filter((employee) => !employee.isNew)
      .every((employee) => employee.isSelected);

  const someRowsSelected =
    employees.some((employee) => !employee.isNew && employee.isSelected) &&
    !allRowsSelected;

  const handleSelectAll = (checked) => {
    setEmployees((prev) =>
      prev.map((employee) => {
        if (employee.isNew) {
          return employee;
        }

        return {
          ...employee,
          isSelected: checked,
        };
      }),
    );
  };

  // ---------------------------------------------------------
  // Validation
  // ---------------------------------------------------------

  const validateHoursCeiling = (value) => {
    if (value === "" || value === null || value === undefined) {
      return "Hours Ceiling is required.";
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return "Hours Ceiling must be a valid number.";
    }

    if (numericValue < 0) {
      return "Hours Ceiling cannot be negative.";
    }

    return null;
  };

  const validateRows = () => {
    for (const employee of employees) {
      if (!employee.empId || !String(employee.empId).trim()) {
        return "Employee ID is required for every row.";
      }

      if (
        !employee.laborCategoryId ||
        !String(employee.laborCategoryId).trim()
      ) {
        return `Labor Category is required for Employee ${employee.empId}.`;
      }

      // 3. Labor Category valid suggestion check
      const isValidCategory = laborCategories.some(
        (category) =>
          String(category.laborCategoryCode).toLowerCase() ===
          String(employee.laborCategoryId).trim().toLowerCase(),
      );

      if (!isValidCategory) {
        return `Invalid Labor Category "${employee.laborCategoryId}" for Employee ${employee.empId}. Please select from the suggestion list.`;
      }

      const hoursError = validateHoursCeiling(employee.hoursCeiling);

      if (hoursError) {
        return `Employee ${employee.empId}: ${hoursError}`;
      }
    }

    const duplicateMap = new Map();

    for (const employee of employees) {
      const duplicateKey = [
        normalizeValue(employee.empId),
        normalizeValue(employee.laborCategoryId),
      ].join("__");

      if (!duplicateMap.has(duplicateKey)) {
        duplicateMap.set(duplicateKey, []);
      }

      duplicateMap.get(duplicateKey).push(employee);
    }

    const duplicateRows = [...duplicateMap.values()].filter(
      (rows) => rows.length > 1,
    );

    if (duplicateRows.length > 0) {
      const duplicateText = duplicateRows
        .map((rows) => `${rows[0].empId} / ${rows[0].laborCategoryId}`)
        .join(", ");

      return `Duplicate record(s) found: ${duplicateText}.`;
    }

    return null;
  };

  // ---------------------------------------------------------
  // Payload Builders
  // ---------------------------------------------------------

  const buildCreatePayload = (employee) => ({
    projectId: employee.projectId || lastSearchedProjectId,
    employeeId: employee.empId,
    laborCategoryId: employee.laborCategoryId,
    hoursCeiling: Number(employee.hoursCeiling),
    applyToRbaCode: employee.applyToRbaCode || "R",
    employeeName: employee.employeeName || "",
    laborCategoryDesc: employee.laborCategoryDesc || "",
  });

  const buildUpdatePayload = (employee) => ({
    projectId: employee.projectId || lastSearchedProjectId,
    employeeId: employee.empId,
    laborCategoryId: employee.laborCategoryId,
    hoursCeiling: Number(employee.hoursCeiling),
    applyToRbaCode: employee.applyToRbaCode || "R",
    employeeName: employee.employeeName || "",
    laborCategoryDesc: employee.laborCategoryDesc || "",
  });

  // ---------------------------------------------------------
  // Refresh Data
  // ---------------------------------------------------------

  const refreshEmployees = async () => {
    const response = await axios.get(
      `${backendUrl}/Project/GetAllCeilingHrForEmp?projId=${
        lastSearchedProjectId || projectId
      }`,
    );

    const rawEmployees = Array.isArray(response.data?.data)
      ? response.data.data
      : [];

    const mappedEmployees = rawEmployees.map((employee) => {
      const matchedLabor = laborCategories.find(
        (category) =>
          String(category.laborCategoryCode) ===
          String(employee.laborCategoryId),
      );

      return {
        _rowId: crypto.randomUUID(),
        projectId: employee.projectId || lastSearchedProjectId || projectId,
        empId: employee.employeeId?.trim() || "",
        employeeName: employee.employeeName || "",
        laborCategoryId: employee.laborCategoryId || "",
        laborCategoryDesc:
          employee.laborCategoryDesc || matchedLabor?.description || "",
        hoursCeiling: employee.hoursCeiling ?? 0,
        applyToRbaCode: employee.applyToRbaCode || "R",
        isNew: false,
        isSelected: false,
      };
    });

    setOriginalEmployees(mappedEmployees);
    setEmployees(mappedEmployees);
  };

  // ---------------------------------------------------------
  // Batch Save
  // ---------------------------------------------------------

  const handleSave = async () => {
    if (!isEditable) return;

    if (!shouldShowTable) {
      toast.info("Please search for a valid project first.");
      return;
    }

    if (!updatedBy) {
      toast.info("updatedBy is required.");
      return;
    }

    if (!hasChanges) {
      toast.info("No changes to save.");
      return;
    }

    const validationError = validateRows();

    if (validationError) {
      toast.warning(validationError);
      return;
    }

    const originalMap = new Map(
      originalEmployees.map((employee) => [getRowKey(employee), employee]),
    );

    const workingExistingMap = new Map(
      employees
        .filter((employee) => !employee.isNew)
        .map((employee) => [getRowKey(employee), employee]),
    );

    // Existing rows removed from the working state
    const deletedRows = originalEmployees.filter(
      (employee) => !workingExistingMap.has(getRowKey(employee)),
    );

    // New rows
    const newRows = employees.filter((employee) => employee.isNew);

    // Existing rows that have changed
    const updatedRows = employees.filter((employee) => {
      if (employee.isNew) return false;

      const original = originalMap.get(getRowKey(employee));

      if (!original) return false;

      return (
        String(original.hoursCeiling ?? "") !==
          String(employee.hoursCeiling ?? "") ||
        String(original.applyToRbaCode ?? "") !==
          String(employee.applyToRbaCode ?? "")
      );
    });

    setIsSaving(true);

    try {
      const deleteRequests = deletedRows.map((employee) =>
        axios.delete(
          `${backendUrl}/Project/DeleteCeilingHrForEmp/${encodeURIComponent(
            employee.projectId || lastSearchedProjectId,
          )}/${encodeURIComponent(employee.empId)}/${encodeURIComponent(
            employee.laborCategoryId,
          )}`,
        ),
      );

      const updateRequests = updatedRows.map((employee) =>
        axios.put(
          `${backendUrl}/Project/UpdateCeilingHrForEmp?updatedBy=${encodeURIComponent(
            updatedBy,
          )}`,
          buildUpdatePayload(employee),
        ),
      );

      const createRequests = newRows.map((employee) =>
        axios.post(
          `${backendUrl}/Project/CreateCeilingHrForEmp?updatedBy=${encodeURIComponent(
            updatedBy,
          )}`,
          buildCreatePayload(employee),
        ),
      );

      const results = await Promise.allSettled([
        ...deleteRequests,
        ...updateRequests,
        ...createRequests,
      ]);

      const failedRequests = results.filter(
        (result) => result.status === "rejected",
      );

      if (failedRequests.length > 0) {
        toast.warning(
          `${failedRequests.length} operation(s) failed. Please check and try again.`,
        );
      }

      await refreshEmployees();

      const successMessages = [];

      if (newRows.length > 0) {
        successMessages.push(`${newRows.length} row(s) created`);
      }

      if (updatedRows.length > 0) {
        successMessages.push(`${updatedRows.length} row(s) updated`);
      }

      if (deletedRows.length > 0) {
        successMessages.push(`${deletedRows.length} row(s) deleted`);
      }

      if (failedRequests.length === 0 && successMessages.length > 0) {
        toast.success(`${successMessages.join(", ")} successfully.`);
      }
    } catch (error) {
      console.error("Save employee hours ceiling error:", error);

      toast.error(
        "Some changes could not be saved. Please check your input and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------------
  // Clear Unsaved Changes
  // ---------------------------------------------------------

  const handleClear = () => {
    if (!hasChanges) {
      toast.info("There are no unsaved changes to clear.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to clear all unsaved changes?",
    );

    if (!confirmed) return;

    const restoredRows = originalEmployees.map((employee) => ({
      ...employee,
      isSelected: false,
      isNew: false,
    }));

    setEmployees(restoredRows);

    toast.success("Unsaved changes cleared.");
  };

  const handleDelete = async () => {
    if (!isEditable) {
      toast.warning("You do not have permission to delete records.");
      return;
    }

    const rowsToDelete = employees.filter(
      (employee) => !employee.isNew && employee.isSelected,
    );

    if (rowsToDelete.length === 0) {
      toast.info("Please select at least one record to delete.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${rowsToDelete.length} selected record(s)?`,
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      await Promise.all(
        rowsToDelete.map((employee) =>
          axios.delete(
            `${backendUrl}/Project/DeleteCeilingHrForEmp/${
              employee.projectId || projectId
            }/${encodeURIComponent(employee.empId)}/${encodeURIComponent(
              employee.laborCategoryId,
            )}`,
          ),
        ),
      );

      toast.success(`${rowsToDelete.length} record(s) deleted successfully.`);

      setEmployees((prev) =>
        prev.filter(
          (employee) =>
            !rowsToDelete.some(
              (deletedEmployee) =>
                getRowKey(deletedEmployee) === getRowKey(employee),
            ),
        ),
      );

      setOriginalEmployees((prev) =>
        prev.filter(
          (employee) =>
            !rowsToDelete.some(
              (deletedEmployee) =>
                getRowKey(deletedEmployee) === getRowKey(employee),
            ),
        ),
      );
    } catch (error) {
      console.error("Error deleting employee hours ceilings:", error);

      toast.error(
        error.response?.data?.message || "Failed to delete selected record(s).",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const hasUnsavedChanges = useMemo(() => {
    const cleanRows = (rows) =>
      rows.map(({ isSelected, isNew, ...row }) => row);

    return (
      JSON.stringify(cleanRows(employees)) !==
      JSON.stringify(cleanRows(originalEmployees))
    );
  }, [employees, originalEmployees]);

  // ---------------------------------------------------------
  // Empty State
  // ---------------------------------------------------------

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-8 text-center">
        <p className="text-sm font-medium text-gray-600">
          Loading Employee Hours Ceilings...
        </p>
      </div>
    );
  }

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
      <ToastContainer />

      <div className="rounded-lg border border-gray-300 bg-white p-4">
        {/* Header */}

        <div className="mb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Employee Hours Ceilings
              </h2>

              <div className="mt-1 flex items-center">
                <span className="text-xs font-medium text-gray-700">
                  Project:
                </span>

                <span className="ml-2 text-xs font-medium text-gray-900">
                  {lastSearchedProjectId}
                </span>
              </div>
            </div>

            {/* Top Actions */}

            {isEditable && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleNewClick}
                  disabled={isSaving || isDeleting}
                  className="btn1 btn-blue disabled:cursor-not-allowed disabled:opacity-50"
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

        {/* Content */}

        {isLoading ? (
          <div className="py-8 text-center text-sm text-gray-500">
            Loading...
          </div>
        ) : employees.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center">
            <p className="text-sm font-semibold text-gray-600">
              No data available
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <datalist id="employee-suggestions">
                {employeeSuggestions.map((suggestion) => (
                  <option
                    key={suggestion.empId}
                    value={suggestion.empId}
                    label={suggestion.employeeName}
                  />
                ))}
              </datalist>

              <datalist id="labor-category-suggestions">
                {laborCategories.map((category) => (
                  <option
                    key={category.laborCategoryCode}
                    value={category.laborCategoryCode}
                    label={category.description}
                  />
                ))}
              </datalist>
              <table className="w-full min-w-[950px] table">
                <thead className="thead">
                  <tr>
                    {isEditable && (
                      <th className="th-thead w-[45px] text-center">
                        <input
                          type="checkbox"
                          checked={allRowsSelected}
                          ref={(element) => {
                            if (element) {
                              element.indeterminate = someRowsSelected;
                            }
                          }}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="h-3 w-3 cursor-pointer"
                          title="Select all existing rows"
                        />
                      </th>
                    )}

                    <th className="th-thead">Empl ID</th>
                    <th className="th-thead">Employee Name</th>
                    <th className="th-thead">Labor Category</th>
                    <th className="th-thead">Labor Desc</th>
                    <th className="th-thead text-center">Hours Ceiling</th>
                  </tr>
                </thead>

                <tbody className="tbody">
                  {employees.map((employee, index) => (
                    <tr
                      key={`${employee._rowId}`}
                      className={`border-b border-gray-100 transition ${
                        employee.isNew
                          ? "bg-gray-50"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {/* Checkbox */}

                      {isEditable && (
                        <td className="tbody-td text-center">
                          <input
                            type="checkbox"
                            checked={
                              employee.isNew
                                ? false
                                : Boolean(employee.isSelected)
                            }
                            disabled={employee.isNew}
                            onChange={(e) =>
                              handleToggleRow(index, e.target.checked)
                            }
                            className="h-3 w-3 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                            title={
                              employee.isNew
                                ? "New rows cannot be selected for deletion"
                                : "Select row"
                            }
                          />
                        </td>
                      )}

                      {/* Employee ID */}

                      <td className="tbody-td">
                        {employee.isNew ? (
                          <>
                            <input
                              list="employee-suggestions"
                              value={employee.empId}
                              onChange={(e) =>
                                handleNewEmployeeIdChange(index, e.target.value)
                              }
                              className="table-input min-w-[130px]"
                              placeholder="Search Empl ID"
                            />

                            <datalist id="employee-suggestions">
                              {employeeSuggestions.map((suggestion) => (
                                <option
                                  key={suggestion.empId}
                                  value={suggestion.empId}
                                >
                                  {suggestion.empId} - {suggestion.employeeName}
                                </option>
                              ))}
                            </datalist>
                          </>
                        ) : (
                          <span className="font-medium text-gray-700">
                            {employee.empId}
                          </span>
                        )}
                      </td>

                      {/* Employee Name */}

                      <td className="tbody-td text-gray-600">
                        {employee.employeeName || (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>

                      {/* Labor Category */}

                      <td className="tbody-td">
                        {employee.isNew ? (
                          <>
                            <input
                              list="labor-category-suggestions"
                              value={employee.laborCategoryId}
                              onChange={(e) =>
                                handleNewLaborCategoryChange(
                                  index,
                                  e.target.value,
                                )
                              }
                              className="table-input min-w-[150px]"
                              placeholder="Search Labor Category"
                            />

                            <datalist id="labor-category-suggestions">
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
                          <span className="text-gray-700">
                            {employee.laborCategoryId}
                          </span>
                        )}
                      </td>

                      {/* Labor Description */}

                      <td className="tbody-td text-gray-600">
                        {employee.laborCategoryDesc || (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>

                      {/* Hours Ceiling */}

                      <td className="tbody-td text-center">
                        {isEditable ? (
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={employee.hoursCeiling}
                            onChange={(e) =>
                              handleCellChange(
                                index,
                                "hoursCeiling",
                                e.target.value,
                              )
                            }
                            className="table-input mx-auto w-full max-w-[130px] text-center"
                          />
                        ) : (
                          <span className="font-medium text-gray-700">
                            {employee.hoursCeiling}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeHoursCeilings;
