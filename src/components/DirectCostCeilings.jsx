// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaSave, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { backendUrl } from "./config";

// const applyToRBAOptions = [
//   { value: "", label: "Select" },
//   { value: "R", label: "Revenue" },
//   { value: "B", label: "Billing" },
//   { value: "A", label: "All" },
//   { value: "N", label: "None" },
// ];

// // Accept any non-empty trimmed projectId
// const isValidProjectId = (id) => !!id;

// const DirectCostCeilings = ({
//   projectId,
//   isSearched,
//   updatedBy = "TEST",
//   isEditable,
// }) => {
//   const [accounts, setAccounts] = useState([]);
//   const [directCostCeilings, setDirectCostCeilings] = useState([]);
//   const [showNewRow, setShowNewRow] = useState(false);
//   const [newRow, setNewRow] = useState({
//     accountId: "",
//     accountName: "",
//     ceilingAmountFunc: "",
//     applyToRbaCode: "",
//   });
//   const [editIndex, setEditIndex] = useState(null);
//   const [editRow, setEditRow] = useState({});
//   const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");
//   const [hasSearched, setHasSearched] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Don't fetch until a real search and valid projectId.
//   // useEffect(() => {
//   //   let active = true;
//   //   const fetchAccounts = async () => {
//   //     if (!(isSearched && isValidProjectId(projectId))) {
//   //       setAccounts([]);
//   //       return;
//   //     }
//   //     try {
//   //       const res = await axios.get(
//   //         `${backendUrl}/Project/GetAllProjectByProjId/${projectId}`
//   //       );
//   //       const project = Array.isArray(res.data) ? res.data[0] : {};
//   //       const labor = Array.isArray(project?.laborAccounts)
//   //         ? project.laborAccounts.map((code) => ({
//   //             acctId: code,
//   //             acctName: code,
//   //           }))
//   //         : [];
//   //       const nonLabor = Array.isArray(project?.nonLaborAccounts)
//   //         ? project.nonLaborAccounts.map((code) => ({
//   //             acctId: code,
//   //             acctName: code,
//   //           }))
//   //         : [];
//   //       if (active) setAccounts([...labor, ...nonLabor]);
//   //     } catch (err) {
//   //       setAccounts([]);
//   //       // Don't toast for search errors!
//   //     }
//   //   };
//   //   fetchAccounts();
//   //   return () => {
//   //     active = false;
//   //   };
//   // }, [isSearched, projectId]);

//   // ✅ Fetch accounts for project based on searched projectId
//   useEffect(() => {
//     let active = true;

//     const fetchAccounts = async () => {
//       if (!(isSearched && isValidProjectId(projectId))) {
//         setAccounts([]);
//         return;
//       }

//       try {
//         const res = await axios.get(
//           `${backendUrl}/Project/GetAllProjectByProjId/${projectId}`,
//         );

//         const project = Array.isArray(res.data) ? res.data[0] : {};

//         // ✅ Collect accounts from Employee, Subcontractor, and Other Direct Cost NON-LABOR
//         const employeeNonLabor = Array.isArray(
//           project?.employeeNonLaborAccounts,
//         )
//           ? project.employeeNonLaborAccounts.map((acc) => ({
//               acctId: acc.accountId,
//               acctName: acc.acctName,
//             }))
//           : [];

//         const subcontractorNonLabor = Array.isArray(
//           project?.subContractorNonLaborAccounts,
//         )
//           ? project.subContractorNonLaborAccounts.map((acc) => ({
//               acctId: acc.accountId,
//               acctName: acc.acctName,
//             }))
//           : [];

//         const otherDirectCostNonLabor = Array.isArray(
//           project?.otherDirectCostNonLaborAccounts,
//         )
//           ? project.otherDirectCostNonLaborAccounts.map((acc) => ({
//               acctId: acc.accountId,
//               acctName: acc.acctName,
//             }))
//           : [];

//         // ✅ Merge all NON-LABOR account lists
//         const mergedAccounts = [
//           ...employeeNonLabor,
//           ...subcontractorNonLabor,
//           ...otherDirectCostNonLabor,
//         ];

//         if (active) setAccounts(mergedAccounts);
//       } catch (err) {
//         // console.error("Error fetching accounts:", err);
//         setAccounts([]);
//       }
//     };

//     fetchAccounts();

//     return () => {
//       active = false;
//     };
//   }, [isSearched, projectId]);

//   useEffect(() => {
//     let active = true;
//     const fetchDirectCostCeilings = async () => {
//       if (isSearched && isValidProjectId(projectId)) {
//         setIsLoading(true);
//         try {
//           const res = await axios.get(
//             `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${projectId}`,
//           );
//           if (active) {
//             setDirectCostCeilings(
//               Array.isArray(res.data?.data) ? res.data.data : [],
//             );
//             setLastSearchedProjectId(projectId);
//             setHasSearched(true);
//           }
//         } catch {
//           setDirectCostCeilings([]);
//           setLastSearchedProjectId(projectId);
//           setHasSearched(true);
//         } finally {
//           if (active) {
//             setIsLoading(false);
//             setShowNewRow(false);
//           }
//         }
//       } else if (active) {
//         setDirectCostCeilings([]);
//         setShowNewRow(false);
//         setLastSearchedProjectId("");
//         setHasSearched(false);
//         setIsLoading(false);
//       }
//     };
//     fetchDirectCostCeilings();
//     return () => {
//       active = false;
//     };
//   }, [isSearched, projectId]);

//   const shouldShowTable =
//     hasSearched && isValidProjectId(lastSearchedProjectId);

//   // Account input change for new row (typed suggestion)
//   const handleNewAccountInput = (value) => {
//     const selected = accounts.find((a) => a.acctId === value);
//     if (selected) {
//       setNewRow((prev) => ({
//         ...prev,
//         accountId: selected.acctId,
//         accountName: selected.acctName,
//       }));
//     } else {
//       setNewRow((prev) => ({
//         ...prev,
//         accountId: value,
//         accountName: "",
//       }));
//     }
//   };

//   const handleNewClick = () => {
//     setShowNewRow(true);
//     setNewRow({
//       accountId: "",
//       accountName: "",
//       ceilingAmountFunc: "",
//       applyToRbaCode: "",
//     });
//   };

//   const handleSave = async () => {
//     if (
//       !newRow.accountId ||
//       !newRow.ceilingAmountFunc ||
//       !newRow.applyToRbaCode
//     ) {
//       toast.warning("Please fill all required fields.");
//       return;
//     }
//     try {
//       const requestBody = {
//         projectId: lastSearchedProjectId,
//         accountId: newRow.accountId,
//         ceilingAmountFunc: parseFloat(newRow.ceilingAmountFunc) || 0,
//         ceilingAmountBilling: 0,
//         applyToRbaCode: newRow.applyToRbaCode,
//       };
//       await axios.post(
//         `${backendUrl}/Project/CreateCeilingAmtForDirectCost?updatedBy=${updatedBy}`,
//         requestBody,
//       );
//       toast.success("Saved successfully");
//       const res = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${lastSearchedProjectId}`,
//       );
//       setDirectCostCeilings(Array.isArray(res.data?.data) ? res.data.data : []);
//       setShowNewRow(false);
//       setNewRow({
//         accountId: "",
//         accountName: "",
//         ceilingAmountFunc: "",
//         applyToRbaCode: "",
//       });
//     } catch {
//       toast.error("Failed to save. Try again.");
//     }
//   };

//   const handleEditClick = (index) => {
//     setEditIndex(index);
//     const row = directCostCeilings[index];
//     setEditRow({
//       ceilingAmountFunc: row.ceilingAmountFunc,
//       applyToRbaCode: row.applyToRbaCode || "",
//     });
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditRow((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async (index) => {
//     const row = directCostCeilings[index];
//     try {
//       const requestBody = {
//         projectId: row.projectId,
//         accountId: row.accountId,
//         ceilingAmountFunc: parseFloat(editRow.ceilingAmountFunc) || 0,
//         ceilingAmountBilling: 0,
//         applyToRbaCode: editRow.applyToRbaCode,
//       };
//       await axios.put(
//         `${backendUrl}/Project/UpdateCeilingAmtForDirectCost?updatedBy=${updatedBy}`,
//         requestBody,
//       );
//       toast.success("Updated successfully");
//       const res = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${lastSearchedProjectId}`,
//       );
//       setDirectCostCeilings(Array.isArray(res.data?.data) ? res.data.data : []);
//       setEditIndex(null);
//       setEditRow({});
//     } catch {
//       toast.error("Failed to update");
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditIndex(null);
//     setEditRow({});
//     toast.info("Edit canceled");
//   };

//   // const handleDeleteUI = (index) => {
//   //   setDirectCostCeilings((prev) => prev.filter((_, i) => i !== index));
//   //   toast.info("Row removed (UI only)");
//   // };

// const handleDelete = async (index) => {
//   const ceiling = directCostCeilings[index];
//   if (!ceiling) return;

//   try {
//     const response = await fetch(
//       `${backendUrl}/Project/DeleteCeilingAmtForDirectCost/${ceiling.projectId}/${ceiling.accountId}`,
//       { method: "DELETE" },
//     );

//     if (!response.ok) {
//       throw new Error("Failed to delete direct cost ceiling");
//     }

//     // ✅ Update UI after successful API call
//     setDirectCostCeilings((prev) => prev.filter((_, i) => i !== index));

//     // ✅ Toast success
//     toast.success("Direct cost ceiling deleted successfully!");
//   } catch (error) {
//     // console.error("Delete error:", error);
//     toast.error("Could not delete direct cost ceiling. Please try again.");
//   }
// };

//   const handleCancelNewRow = () => {
//     setShowNewRow(false);
//     setNewRow({
//       accountId: "",
//       accountName: "",
//       ceilingAmountFunc: "",
//       applyToRbaCode: "",
//     });
//     toast.info("Canceled");
//   };

//   // Messages for unsearched/invalid
//   if (!isSearched) {
//     return (
//       <div className="text-gray-600">
//         Please search for a project to view details.
//       </div>
//     );
//   }

//   if (isSearched && !isValidProjectId(projectId)) {
//     return <div className="text-red-600 font-medium">Invalid project ID.</div>;
//   }

//   if (!shouldShowTable) {
//     return (
//       <div className="text-gray-600">
//         Please search for a project to view details.
//       </div>
//     );
//   }

//   return (
//     <div className="animate-fade-in">
//       <ToastContainer position="top-right" autoClose={1600} />
//       <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
//         <div className="mb-4">
//           <h2 className="text-sm font-bold text-gray-900 mb-1">
//             Direct Cost Ceilings
//           </h2>
//           <div className="flex items-center mb-2">
//             <label className="text-xs font-medium text-gray-700 mr-1">
//               Project:
//             </label>
//             <span className="text-xs text-gray-900">
//               {lastSearchedProjectId}
//             </span>
//             <span className="ml-4 text-xs text-gray-900">Org ID: 1.02</span>
//           </div>
//           {isEditable && (
//             <button className="btn1 btn-blue" onClick={handleNewClick}>
//               New
//             </button>
//           )}
//         </div>

//         {isLoading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : directCostCeilings.length === 0 && !showNewRow ? (
//           <p className="text-gray-600">No data available.</p>
//         ) : (
//           <div className="overflow-x-auto border-line">
//             <table className="w-full table">
//               <thead className="thead">
//                 <tr>
//                   <th className="th-thead">Account</th>
//                   <th className="th-thead">Account Name</th>
//                   <th className="th-thead ">
//                     Functional Currency Ceiling Amount
//                   </th>
//                   <th className="th-thead  ">Apply to R/B/A</th>
//                   <th className="th-thead  ">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="tbody">
//                 {showNewRow && (
//                   <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
//                     <td className="tbody-td">
//                       {/* <input
//                         list="dc-account-suggestions"
//                         value={newRow.accountId}
//                         onChange={(e) => handleNewAccountInput(e.target.value)}
//                         className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
//                         placeholder="Search account"
//                       />
//                       <datalist id="dc-account-suggestions">
//                         {accounts.map((a) => (
//                           <option key={a.acctId} value={a.acctId}>
//                             {a.acctId}
//                           </option>
//                         ))}
//                       </datalist> */}
//                       <input
//                         list="dc-account-suggestions"
//                         value={newRow.accountId}
//                         onChange={(e) => handleNewAccountInput(e.target.value)}
//                         className="table-input"
//                         placeholder="Search account"
//                       />
//                       <datalist id="dc-account-suggestions">
//                         {accounts.map((a) => (
//                           <option key={a.acctId} value={a.acctId}>
//                             {a.acctId} - {a.acctName}{" "}
//                             {/* 👈 Show both ID + Name in dropdown */}
//                           </option>
//                         ))}
//                       </datalist>
//                     </td>
//                     <td className="tbody-td">{newRow.accountName}</td>
//                     <td className="tbody-td">
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={newRow.ceilingAmountFunc}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             ceilingAmountFunc: e.target.value,
//                           }))
//                         }
//                         className="table-input"
//                         placeholder="0"
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <select
//                         value={newRow.applyToRbaCode}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             applyToRbaCode: e.target.value,
//                           }))
//                         }
//                         className="table-input"
//                       >
//                         {applyToRBAOptions.map((opt) => (
//                           <option key={opt.value} value={opt.value}>
//                             {opt.label}
//                           </option>
//                         ))}
//                       </select>
//                     </td>
//                     <td className="tbody-td">
//                       <button
//                         onClick={handleSave}
//                         className="text-green-700 hover:text-green-800"
//                         title="Save"
//                         style={{ background: "none", border: "none" }}
//                       >
//                         <FaSave size={15} />
//                       </button>
//                       <button
//                         onClick={handleCancelNewRow}
//                         className="text-gray-500 hover:text-gray-700"
//                         title="Cancel"
//                         style={{ background: "none", border: "none" }}
//                       >
//                         <FaTimes size={15} />
//                       </button>
//                     </td>
//                   </tr>
//                 )}

//                 {directCostCeilings.map((ceiling, index) => (
//                   <tr
//                     key={`${ceiling.accountId}-${
//                       ceiling.projectId || "proj"
//                     }-${index}`}
//                     className="bg-white border-b border-gray-200 hover:bg-gray-50"
//                   >
//                     <td className="tbody-td">{ceiling.accountId}</td>
//                     <td className="tbody-td">
//                       {accounts.find((a) => a.acctId === ceiling.accountId)
//                         ?.acctName || "N/A"}
//                     </td>
//                     <td className="tbody-td">
//                       {editIndex === index ? (
//                         <input
//                           type="number"
//                           step="0.01"
//                           name="ceilingAmountFunc"
//                           value={editRow.ceilingAmountFunc}
//                           onChange={handleEditChange}
//                           className="table-input"
//                         />
//                       ) : (
//                         ceiling.ceilingAmountFunc
//                       )}
//                     </td>
//                     <td className="tbody-td  ">
//                       {editIndex === index ? (
//                         <select
//                           name="applyToRbaCode"
//                           value={editRow.applyToRbaCode}
//                           onChange={handleEditChange}
//                           className="table-input"
//                         >
//                           {applyToRBAOptions.map((opt) => (
//                             <option key={opt.value} value={opt.value}>
//                               {opt.label}
//                             </option>
//                           ))}
//                         </select>
//                       ) : (
//                         ceiling.applyToRbaCode || ""
//                       )}
//                     </td>
//                     <td className="tbody-td">
//                       {editIndex === index ? (
//                         <>
//                           <button
//                             onClick={() => handleUpdate(index)}
//                             className="text-green-700 hover:text-green-800"
//                             title="Save"
//                             style={{ background: "none", border: "none" }}
//                           >
//                             <FaSave size={15} />
//                           </button>
//                           <button
//                             onClick={handleCancelEdit}
//                             className="text-gray-500 hover:text-gray-700"
//                             title="Cancel"
//                             style={{ background: "none", border: "none" }}
//                           >
//                             <FaTimes size={15} />
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => handleEditClick(index)}
//                             className="text-blue-400 hover:text-blue-700"
//                             title="Edit"
//                             style={{ background: "none", border: "none" }}
//                           >
//                             <FaEdit size={15} />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(index)}
//                             className="text-gray-400 hover:text-gray-800"
//                             title="Delete"
//                             style={{ background: "none", border: "none" }}
//                           >
//                             <FaTrash size={15} />
//                           </button>
//                         </>
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

// export default DirectCostCeilings;

import React, { useState, useEffect } from "react";
import axios from "axios";
// import { FaSave, FaEdit, FaTrash, FaTimes, FaPlus } from "react-icons/fa";
import { FaSave, FaUndo, FaPlus, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "./config";

const applyToRBAOptions = [
  { value: "", label: "Select" },
  { value: "R", label: "Revenue" },
  { value: "B", label: "Billing" },
  { value: "A", label: "All" },
  { value: "N", label: "None" },
];

const isValidProjectId = (id) => !!id;

// const DirectCostCeilings = ({
//   projectId,
//   projectDirect,
//   isSearched,
//   updatedBy = "TEST",
//   isEditable,
// }) => {
//   const [accounts, setAccounts] = useState([]);
//   const [directCostCeilings, setDirectCostCeilings] = useState([]);

//   const [showNewRow, setShowNewRow] = useState(false);

//   const [newRow, setNewRow] = useState({
//     accountId: "",
//     accountName: "",
//     ceilingAmountFunc: "",
//     applyToRbaCode: "",
//   });

//   const [editIndex, setEditIndex] = useState(null);
//   const [editRow, setEditRow] = useState({});

//   const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");
//   const [hasSearched, setHasSearched] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // ---------------------------------------------------------
//   // Reset New Row
//   // ---------------------------------------------------------
//   const resetNewRow = () => {
//     setNewRow({
//       accountId: "",
//       accountName: "",
//       ceilingAmountFunc: "",
//       applyToRbaCode: "",
//     });
//   };

//   // ---------------------------------------------------------
//   // Fetch Accounts
//   // ---------------------------------------------------------
//   useEffect(() => {
//     let active = true;

//     const fetchAccounts = async () => {
//       if (!(isSearched && isValidProjectId(projectId))) {
//         setAccounts([]);
//         return;
//       }

//       try {
//         const res = await axios.get(
//           `${backendUrl}/Project/GetAllProjectByProjId/${projectId}/${projectDirect.type === "NBBUD" ? "NBBUD" : "PROJECT"}`,
//         );

//         const project = Array.isArray(res.data) ? res.data[0] : {};

//         const employeeNonLabor = Array.isArray(
//           project?.employeeNonLaborAccounts,
//         )
//           ? project.employeeNonLaborAccounts.map((acc) => ({
//               acctId: acc.accountId,
//               acctName: acc.acctName,
//             }))
//           : [];

//         const subcontractorNonLabor = Array.isArray(
//           project?.subContractorNonLaborAccounts,
//         )
//           ? project.subContractorNonLaborAccounts.map((acc) => ({
//               acctId: acc.accountId,
//               acctName: acc.acctName,
//             }))
//           : [];

//         const otherDirectCostNonLabor = Array.isArray(
//           project?.otherDirectCostNonLaborAccounts,
//         )
//           ? project.otherDirectCostNonLaborAccounts.map((acc) => ({
//               acctId: acc.accountId,
//               acctName: acc.acctName,
//             }))
//           : [];

//         const mergedAccounts = [
//           ...employeeNonLabor,
//           ...subcontractorNonLabor,
//           ...otherDirectCostNonLabor,
//         ];

//         if (active) {
//           setAccounts(mergedAccounts);
//         }
//       } catch (err) {
//         setAccounts([]);
//       }
//     };

//     fetchAccounts();

//     return () => {
//       active = false;
//     };
//   }, [isSearched, projectId]);

//   // ---------------------------------------------------------
//   // Fetch Direct Cost Ceilings
//   // ---------------------------------------------------------
//   useEffect(() => {
//     let active = true;

//     const fetchDirectCostCeilings = async () => {
//       if (isSearched && isValidProjectId(projectId)) {
//         setIsLoading(true);

//         try {
//           const res = await axios.get(
//             `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${projectId}`,
//           );

//           if (active) {
//             setDirectCostCeilings(
//               Array.isArray(res.data?.data) ? res.data.data : [],
//             );

//             setLastSearchedProjectId(projectId);
//             setHasSearched(true);
//           }
//         } catch {
//           if (active) {
//             setDirectCostCeilings([]);
//             setLastSearchedProjectId(projectId);
//             setHasSearched(true);
//           }
//         } finally {
//           if (active) {
//             setIsLoading(false);
//             setShowNewRow(false);
//             resetNewRow();
//           }
//         }
//       } else if (active) {
//         setDirectCostCeilings([]);
//         setShowNewRow(false);
//         resetNewRow();
//         setLastSearchedProjectId("");
//         setHasSearched(false);
//         setIsLoading(false);
//       }
//     };

//     fetchDirectCostCeilings();

//     return () => {
//       active = false;
//     };
//   }, [isSearched, projectId]);

//   const shouldShowTable =
//     hasSearched && isValidProjectId(lastSearchedProjectId);

//   // ---------------------------------------------------------
//   // New Account Input
//   // ---------------------------------------------------------
//   const handleNewAccountInput = (value) => {
//     const selected = accounts.find((a) => a.acctId === value);

//     if (selected) {
//       setNewRow((prev) => ({
//         ...prev,
//         accountId: selected.acctId,
//         accountName: selected.acctName,
//       }));
//     } else {
//       setNewRow((prev) => ({
//         ...prev,
//         accountId: value,
//         accountName: "",
//       }));
//     }
//   };

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

//     // Close edit mode if active
//     setEditIndex(null);
//     setEditRow({});
//   };

//   // ---------------------------------------------------------
//   // Save New Row
//   // ---------------------------------------------------------
//   const handleSave = async () => {
//     if (
//       !newRow.accountId ||
//       !newRow.ceilingAmountFunc ||
//       !newRow.applyToRbaCode
//     ) {
//       toast.warning("Please fill all required fields.");
//       return;
//     }

//     try {
//       const requestBody = {
//         projectId: lastSearchedProjectId,
//         accountId: newRow.accountId,
//         ceilingAmountFunc: parseFloat(newRow.ceilingAmountFunc) || 0,
//         ceilingAmountBilling: 0,
//         applyToRbaCode: newRow.applyToRbaCode,
//       };

//       await axios.post(
//         `${backendUrl}/Project/CreateCeilingAmtForDirectCost?updatedBy=${updatedBy}`,
//         requestBody,
//       );

//       toast.success("Saved successfully");

//       const res = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${lastSearchedProjectId}`,
//       );

//       setDirectCostCeilings(Array.isArray(res.data?.data) ? res.data.data : []);

//       setShowNewRow(false);
//       resetNewRow();
//     } catch {
//       toast.error("Failed to save. Try again.");
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

//     const row = directCostCeilings[index];

//     setEditRow({
//       ceilingAmountFunc: row.ceilingAmountFunc,
//       applyToRbaCode: row.applyToRbaCode || "",
//     });

//     // Close new mode if active
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
//     const row = directCostCeilings[index];

//     try {
//       const requestBody = {
//         projectId: row.projectId,
//         accountId: row.accountId,
//         ceilingAmountFunc: parseFloat(editRow.ceilingAmountFunc) || 0,
//         ceilingAmountBilling: 0,
//         applyToRbaCode: editRow.applyToRbaCode,
//       };

//       await axios.put(
//         `${backendUrl}/Project/UpdateCeilingAmtForDirectCost?updatedBy=${updatedBy}`,
//         requestBody,
//       );

//       toast.success("Updated successfully");

//       const res = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${lastSearchedProjectId}`,
//       );

//       setDirectCostCeilings(Array.isArray(res.data?.data) ? res.data.data : []);

//       setEditIndex(null);
//       setEditRow({});
//     } catch {
//       toast.error("Failed to update");
//     }
//   };

//   // ---------------------------------------------------------
//   // Cancel Edit
//   // ---------------------------------------------------------
//   const handleCancelEdit = () => {
//     setEditIndex(null);
//     setEditRow({});
//     toast.info("Edit canceled");
//   };

//   // ---------------------------------------------------------
//   // Delete
//   // ---------------------------------------------------------
//   const handleDelete = async (index) => {
//     const ceiling = directCostCeilings[index];

//     if (!ceiling) return;

//     try {
//       const response = await fetch(
//         `${backendUrl}/Project/DeleteCeilingAmtForDirectCost/${ceiling.projectId}/${ceiling.accountId}`,
//         {
//           method: "DELETE",
//         },
//       );

//       if (!response.ok) {
//         throw new Error("Failed to delete direct cost ceiling");
//       }

//       setDirectCostCeilings((prev) => prev.filter((_, i) => i !== index));

//       toast.success("Direct cost ceiling deleted successfully!");
//     } catch (error) {
//       toast.error("Could not delete direct cost ceiling. Please try again.");
//     }
//   };

//   // ---------------------------------------------------------
//   // Messages
//   // ---------------------------------------------------------
//   // if (!isSearched) {
//   //   return (
//   //     <div className="text-gray-600 text-sm">
//   //       Please search for a project to view details.
//   //     </div>
//   //   );
//   // }

//   if (isSearched && !isValidProjectId(projectId)) {
//     return (
//       <div className="text-red-600 font-medium text-sm">
//         Invalid project ID.
//       </div>
//     );
//   }

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

//       {/* NO SHADOW */}
//       <div className="border border-gray-300 rounded-lg p-4 bg-white">
//         {/* =====================================================
//             HEADER
//         ===================================================== */}
//         <div className="mb-4">
//           <div className="flex items-center justify-between gap-4">
//             {/* Left Side */}
//             <div>
//               <h2 className="text-sm font-bold text-gray-900">
//                 Direct Cost Ceilings
//               </h2>

//               <div className="flex items-center mt-1">
//                 <span className="text-xs font-medium text-gray-700">
//                   Project:
//                 </span>

//                 <span className="text-xs text-gray-900 ml-2 font-medium">
//                   {lastSearchedProjectId}
//                 </span>

//                 <span className="ml-5 text-xs font-medium text-gray-700">
//                   Org ID:
//                 </span>

//                 <span className="ml-1 text-xs text-gray-900 font-medium">
//                   1.02
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
//                     <span className="text-xs">+</span>
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
//         ) : directCostCeilings.length === 0 && !showNewRow ? (
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
//                   <th className="th-thead whitespace-nowrap">Account</th>

//                   <th className="th-thead whitespace-nowrap">Account Name</th>

//                   <th className="th-thead whitespace-nowrap">
//                     Functional Currency Ceiling Amount
//                   </th>

//                   <th className="th-thead whitespace-nowrap">Apply to R/B/A</th>

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
//                     {/* Account */}
//                     <td className="tbody-td">
//                       <input
//                         list="dc-account-suggestions"
//                         value={newRow.accountId}
//                         onChange={(e) => handleNewAccountInput(e.target.value)}
//                         className="table-input"
//                         placeholder="Search account"
//                       />

//                       <datalist id="dc-account-suggestions">
//                         {accounts.map((a) => (
//                           <option key={a.acctId} value={a.acctId}>
//                             {a.acctId} - {a.acctName}
//                           </option>
//                         ))}
//                       </datalist>
//                     </td>

//                     {/* Account Name */}
//                     <td className="tbody-td">
//                       <span className="text-gray-700">
//                         {newRow.accountName || "-"}
//                       </span>
//                     </td>

//                     {/* Functional Currency */}
//                     <td className="tbody-td">
//                       <input
//                         type="number"
//                         step="0.01"
//                         value={newRow.ceilingAmountFunc}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             ceilingAmountFunc: e.target.value,
//                           }))
//                         }
//                         className="table-input"
//                         placeholder="0.00"
//                       />
//                     </td>

//                     {/* Apply R/B/A */}
//                     <td className="tbody-td">
//                       <select
//                         value={newRow.applyToRbaCode}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             applyToRbaCode: e.target.value,
//                           }))
//                         }
//                         className="table-input"
//                       >
//                         {applyToRBAOptions.map((opt) => (
//                           <option key={opt.value} value={opt.value}>
//                             {opt.label}
//                           </option>
//                         ))}
//                       </select>
//                     </td>

//                     {/* Top buttons are used now */}
//                     {/* <td className="tbody-td text-center text-xs text-gray-400">
//                       New record
//                     </td> */}
//                   </tr>
//                 )}

//                 {/* =================================================
//                     EXISTING ROWS
//                 ================================================= */}
//                 {directCostCeilings.map((ceiling, index) => (
//                   <tr
//                     key={`${ceiling.accountId}-${
//                       ceiling.projectId || "proj"
//                     }-${index}`}
//                     className="bg-white border-b border-gray-200 hover:bg-gray-50"
//                   >
//                     {/* Account */}
//                     <td className="tbody-td">{ceiling.accountId}</td>

//                     {/* Account Name */}
//                     <td className="tbody-td">
//                       {accounts.find((a) => a.acctId === ceiling.accountId)
//                         ?.acctName || "N/A"}
//                     </td>

//                     {/* Ceiling Amount */}
//                     <td className="tbody-td">
//                       {editIndex === index ? (
//                         <input
//                           type="number"
//                           step="0.01"
//                           name="ceilingAmountFunc"
//                           value={editRow.ceilingAmountFunc ?? ""}
//                           onChange={handleEditChange}
//                           className="table-input"
//                         />
//                       ) : (
//                         ceiling.ceilingAmountFunc
//                       )}
//                     </td>

//                     {/* Apply R/B/A */}
//                     <td className="tbody-td">
//                       {editIndex === index ? (
//                         <select
//                           name="applyToRbaCode"
//                           value={editRow.applyToRbaCode || ""}
//                           onChange={handleEditChange}
//                           className="table-input"
//                         >
//                           {applyToRBAOptions.map((opt) => (
//                             <option key={opt.value} value={opt.value}>
//                               {opt.label}
//                             </option>
//                           ))}
//                         </select>
//                       ) : (
//                         // ceiling.applyToRbaCode || ""
//                         applyToRBAOptions.find(
//                           (opt) => opt.value === ceiling.applyToRbaCode,
//                         )?.label || ceiling.applyToRbaCode
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
//                             title="Save"
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

const DirectCostCeilings = ({
  projectId,
  projectDirect,
  isSearched,
  updatedBy = "TEST",
  isEditable,
}) => {
  const [accounts, setAccounts] = useState([]);

  // Data State: stores original response & modified local working copy
  const [originalCeilings, setOriginalCeilings] = useState([]);
  const [directCostCeilings, setDirectCostCeilings] = useState([]);

  const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Track key tracking state for pending changes
  const hasChanges =
    JSON.stringify(originalCeilings) !==
    JSON.stringify(directCostCeilings.map(({ isSelected, ...rest }) => rest));

  const selectedRowsCount = directCostCeilings.filter(
    (row) => row.isSelected,
  ).length;

  // ---------------------------------------------------------
  // Fetch Accounts
  // ---------------------------------------------------------
  useEffect(() => {
    let active = true;

    const fetchAccounts = async () => {
      if (!(isSearched && isValidProjectId(projectId))) {
        setAccounts([]);
        return;
      }

      try {
        const res = await axios.get(
          `${backendUrl}/Project/GetAllProjectByProjId/${projectId}/${projectDirect?.type === "NBBUD" ? "NBBUD" : "PROJECT"}`,
        );

        const project = Array.isArray(res.data) ? res.data[0] : {};

        const employeeNonLabor = Array.isArray(
          project?.employeeNonLaborAccounts,
        )
          ? project.employeeNonLaborAccounts.map((acc) => ({
              acctId: acc.accountId,
              acctName: acc.acctName,
            }))
          : [];

        const subcontractorNonLabor = Array.isArray(
          project?.subContractorNonLaborAccounts,
        )
          ? project.subContractorNonLaborAccounts.map((acc) => ({
              acctId: acc.accountId,
              acctName: acc.acctName,
            }))
          : [];

        const otherDirectCostNonLabor = Array.isArray(
          project?.otherDirectCostNonLaborAccounts,
        )
          ? project.otherDirectCostNonLaborAccounts.map((acc) => ({
              acctId: acc.accountId,
              acctName: acc.acctName,
            }))
          : [];

        const mergedAccounts = [
          ...employeeNonLabor,
          ...subcontractorNonLabor,
          ...otherDirectCostNonLabor,
        ];

        if (active) {
          setAccounts(mergedAccounts);
        }
      } catch (err) {
        if (active) setAccounts([]);
      }
    };

    fetchAccounts();

    return () => {
      active = false;
    };
  }, [isSearched, projectId, projectDirect]);

  // ---------------------------------------------------------
  // Fetch Direct Cost Ceilings
  // ---------------------------------------------------------
  useEffect(() => {
    let active = true;

    const fetchDirectCostCeilings = async () => {
      if (isSearched && isValidProjectId(projectId)) {
        setIsLoading(true);

        try {
          const res = await axios.get(
            `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${projectId}`,
          );

          if (active) {
            const data = Array.isArray(res.data?.data) ? res.data.data : [];
            const formattedData = data.map((item) => ({
              ...item,
              isSelected: false,
            }));
            setOriginalCeilings(JSON.parse(JSON.stringify(data)));
            setDirectCostCeilings(formattedData);
            setLastSearchedProjectId(projectId);
            setHasSearched(true);
          }
        } catch {
          if (active) {
            setOriginalCeilings([]);
            setDirectCostCeilings([]);
            setLastSearchedProjectId(projectId);
            setHasSearched(true);
          }
        } finally {
          if (active) setIsLoading(false);
        }
      } else if (active) {
        setOriginalCeilings([]);
        setDirectCostCeilings([]);
        setLastSearchedProjectId("");
        setHasSearched(false);
        setIsLoading(false);
      }
    };

    fetchDirectCostCeilings();

    return () => {
      active = false;
    };
  }, [isSearched, projectId]);

  const shouldShowTable =
    hasSearched && isValidProjectId(lastSearchedProjectId);

  // ---------------------------------------------------------
  // Local Change Handlers
  // ---------------------------------------------------------
  const handleCellChange = (index, field, value) => {
    setDirectCostCeilings((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAccountSelect = (index, accountId) => {
    setDirectCostCeilings((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], accountId: accountId };
      return updated;
    });
  };

  const handleToggleSelectRow = (index) => {
    setDirectCostCeilings((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        isSelected: !updated[index].isSelected,
      };
      return updated;
    });
  };

  const handleToggleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setDirectCostCeilings((prev) =>
      prev.map((item) => ({ ...item, isSelected: isChecked })),
    );
  };

  const handleAddRow = () => {
    if (!shouldShowTable) {
      toast.warning("Please search for a valid project first.");
      return;
    }

    const newRow = {
      isNew: true,
      isSelected: false,
      projectId: lastSearchedProjectId,
      accountId: "",
      ceilingAmountFunc: "",
      applyToRbaCode: applyToRBAOptions[0]?.value || "",
    };

    setDirectCostCeilings((prev) => [newRow, ...prev]);
  };

  const handleDeleteSelected = async () => {
    const selectedRows = directCostCeilings.filter((row) => row.isSelected);
    if (selectedRows.length === 0) return;

    // Separate unsaved new rows from existing database rows
    const newRows = selectedRows.filter((row) => row.isNew);
    const existingRows = selectedRows.filter((row) => !row.isNew);

    try {
      // 1. Execute DELETE API calls only for existing database rows
      if (existingRows.length > 0) {
        const deletePromises = existingRows.map((ceiling) =>
          fetch(
            `${backendUrl}/Project/DeleteCeilingAmtForDirectCost/${ceiling.projectId || lastSearchedProjectId}/${ceiling.accountId}`,
            { method: "DELETE" },
          ).then((res) => {
            if (!res.ok)
              throw new Error(`Failed to delete account ${ceiling.accountId}`);
            return res;
          }),
        );

        await Promise.all(deletePromises);
      }

      // 2. Remove selected rows (both new and existing) from UI state
      setDirectCostCeilings((prev) => prev.filter((row) => !row.isSelected));

      // 3. Update snapshot so Save button state remains accurate
      setOriginalCeilings((prev) =>
        prev.filter(
          (orig) =>
            !existingRows.some((row) => row.accountId === orig.accountId),
        ),
      );

      toast.success(`${selectedRows.length} item(s) deleted successfully!`);
    } catch (error) {
      toast.error("Could not delete selected items. Please try again.");
    }
  };

  const handleReset = () => {
    const resetData = JSON.parse(JSON.stringify(originalCeilings)).map(
      (item) => ({
        ...item,
        isSelected: false,
      }),
    );
    setDirectCostCeilings(resetData);
    toast.info("Changes reset.");
  };

  // ---------------------------------------------------------
  // Batch Save Handler (Selective Add, Edit & Delete)
  // ---------------------------------------------------------
  const handleBatchSave = async () => {
    if (!hasChanges) return;

    // Validate empty required fields
    const hasInvalidRow = directCostCeilings.some(
      (item) =>
        !item.accountId ||
        item.ceilingAmountFunc === "" ||
        !item.applyToRbaCode,
    );

    if (hasInvalidRow) {
      toast.warning("Please complete all fields before saving.");
      return;
    }

    // 2. Validate that each entered accountId exists in the suggestions list
    const validAccountIds = new Set(accounts.map((a) => String(a.acctId)));
    const invalidAccount = directCostCeilings.find(
      (item) => !validAccountIds.has(String(item.accountId)),
    );

    if (invalidAccount) {
      toast.warning(
        `"${invalidAccount.accountId}" is not a valid account. Please select from the suggestions list.`,
      );
      return;
    }

    // 1. Check for duplicates among the newly added rows (or within the table itself)
    const duplicatesInTable = directCostCeilings
      .map((item) => item.accountId)
      .filter((id, index, arr) => id && arr.indexOf(id) !== index);

    // 2. Check for newly added rows that already exist in the database (originalCeilings)
    const existingAccountIds = new Set(
      originalCeilings.map((item) => item.accountId),
    );
    const conflictingNewAccountIds = directCostCeilings
      .filter((item) => item.isNew && existingAccountIds.has(item.accountId))
      .map((item) => item.accountId);

    // Combine all duplicate IDs and remove repeat references
    const allDuplicateIds = Array.from(
      new Set([...duplicatesInTable, ...conflictingNewAccountIds]),
    );

    if (allDuplicateIds.length > 0) {
      const formattedIds = allDuplicateIds.map((id) => `"${id}"`).join(", ");
      toast.info(
        `Account ID(s) ${formattedIds} already exist for this project.`,
      );
      return;
    }

    setIsSaving(true);

    try {
      // 1. Identify deleted items by comparing current table accounts against original list
      const currentKeys = new Set(
        directCostCeilings.filter((d) => !d.isNew).map((d) => d.accountId),
      );
      const deletedItems = originalCeilings.filter(
        (orig) => !currentKeys.has(orig.accountId),
      );

      const deletePromises = deletedItems.map((item) =>
        fetch(
          `${backendUrl}/Project/DeleteCeilingAmtForDirectCost/${item.projectId}/${item.accountId}`,
          { method: "DELETE" },
        ),
      );

      // 2. Identify ONLY modified existing rows or newly added rows
      const modifiedOrNewItems = directCostCeilings.filter((item) => {
        if (item.isNew) return true; // New items always included

        const original = originalCeilings.find(
          (orig) => orig.accountId === item.accountId,
        );
        if (!original) return true;

        // Check if any fields changed
        const isChanged =
          String(original.ceilingAmountFunc) !==
            String(item.ceilingAmountFunc) ||
          String(original.applyToRbaCode) !== String(item.applyToRbaCode);

        return isChanged;
      });

      // 3. Construct API POST/PUT calls
      const savePromises = modifiedOrNewItems.map((item) => {
        const payload = {
          projectId: item.projectId || lastSearchedProjectId,
          accountId: item.accountId,
          ceilingAmountFunc: parseFloat(item.ceilingAmountFunc) || 0,
          ceilingAmountBilling: 0,
          applyToRbaCode: item.applyToRbaCode,
        };

        if (item.isNew) {
          return axios.post(
            `${backendUrl}/Project/CreateCeilingAmtForDirectCost?updatedBy=${updatedBy}`,
            payload,
          );
        } else {
          return axios.put(
            `${backendUrl}/Project/UpdateCeilingAmtForDirectCost?updatedBy=${updatedBy}`,
            payload,
          );
        }
      });

      // Execute all pending deletes, posts, and puts concurrently
      await Promise.all([...deletePromises, ...savePromises]);

      toast.success("Changes saved successfully!");

      // Refresh data to reset snapshot state
      const res = await axios.get(
        `${backendUrl}/Project/GetAllCeilingAmtForDirectCost?projId=${lastSearchedProjectId}`,
      );
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      const formattedData = data.map((item) => ({
        ...item,
        isSelected: false,
      }));

      setOriginalCeilings(JSON.parse(JSON.stringify(data)));
      setDirectCostCeilings(formattedData);
    } catch (error) {
      toast.error("Failed to save changes. Please review and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isSearched && !isValidProjectId(projectId)) {
    return (
      <div className="text-red-600 font-medium text-sm">
        Invalid project ID.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-8 text-center">
        <p className="text-sm font-medium text-gray-600">
          Loading Direct Cost Ceilings...
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

  return (
    <div className="animate-fade-in">
      <ToastContainer position="top-right" autoClose={1600} />

      <div className="border border-gray-300 rounded-lg p-4 bg-white">
        {/* HEADER & TOP ACTIONS */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Direct Cost Ceilings
            </h2>
            <div className="flex items-center mt-1">
              <span className="text-xs font-medium text-gray-700">
                Project:
              </span>
              <span className="text-xs text-gray-900 ml-2 font-medium">
                {lastSearchedProjectId}
              </span>
            </div>
          </div>

          {/* TOP BATCH ACTIONS */}
          {isEditable && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="btn1 btn-blue flex items-center gap-2"
                onClick={handleAddRow}
              >
                {/* <FaPlus size={12} /> */}
                New
              </button>

              <button
                type="button"
                className="btn1 btn-blue flex items-center gap-2 disabled:opacity-50"
                onClick={handleDeleteSelected}
                disabled={selectedRowsCount === 0 || isSaving}
              >
                {/* <FaTrash size={12} /> */}
                Delete ({selectedRowsCount})
              </button>

              <button
                type="button"
                className="btn1 btn-blue flex items-center gap-2 disabled:opacity-50"
                onClick={handleBatchSave}
                disabled={!hasChanges || isSaving}
              >
                {/* <FaSave size={12} /> */}
                {isSaving ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                className="btn1 btn-blue flex items-center gap-2 disabled:opacity-50"
                onClick={handleReset}
                disabled={!hasChanges || isSaving}
              >
                {/* <FaUndo size={12} /> */}
                Clear
              </button>
            </div>
          )}
        </div>

        {/* CONTENT TABLE */}
        {isLoading ? (
          <div className="py-8 text-center text-sm text-gray-500">
            Loading...
          </div>
        ) : directCostCeilings.length === 0 ? (
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
                    <th className="th-thead w-10 text-center">
                      <input
                        type="checkbox"
                        onChange={handleToggleSelectAll}
                        checked={
                          directCostCeilings.length > 0 &&
                          directCostCeilings.every((row) => row.isSelected)
                        }
                      />
                    </th>
                  )}
                  <th className="th-thead whitespace-nowrap">Account</th>
                  <th className="th-thead whitespace-nowrap">Account Name</th>
                  <th className="th-thead whitespace-nowrap">
                    Functional Currency Ceiling Amount
                  </th>
                  <th className="th-thead whitespace-nowrap">Apply to R/B/A</th>
                </tr>
              </thead>

              <tbody className="tbody">
                {directCostCeilings.map((ceiling, index) => {
                  const accountName =
                    accounts.find((a) => a.acctId === ceiling.accountId)
                      ?.acctName || "-";

                  return (
                    <tr
                      key={index}
                      className={`border-b border-gray-200 hover:bg-gray-50 ${
                        ceiling.isSelected ? "bg-blue-50" : "bg-white"
                      }`}
                    >
                      {/* Checkbox Column */}
                      {isEditable && (
                        <td className="tbody-td text-center">
                          <input
                            type="checkbox"
                            checked={!!ceiling.isSelected}
                            disabled={ceiling.isNew}
                            onChange={() => handleToggleSelectRow(index)}
                          />
                        </td>
                      )}

                      {/* Account Code */}
                      <td className="tbody-td">
                        {isEditable && ceiling.isNew ? (
                          <>
                            <input
                              list={`dc-account-suggestions-${index}`}
                              value={ceiling.accountId}
                              onChange={(e) =>
                                handleAccountSelect(index, e.target.value)
                              }
                              className="table-input"
                              placeholder="Search account"
                            />
                            <datalist id={`dc-account-suggestions-${index}`}>
                              {accounts.map((a) => (
                                <option key={a.acctId} value={a.acctId}>
                                  {a.acctId} - {a.acctName}
                                </option>
                              ))}
                            </datalist>
                          </>
                        ) : (
                          <span>{ceiling.accountId}</span>
                        )}
                      </td>

                      {/* Account Name */}
                      <td className="tbody-td">
                        <span className="text-gray-700">{accountName}</span>
                      </td>

                      {/* Functional Currency Ceiling */}
                      <td className="tbody-td">
                        {isEditable ? (
                          <input
                            type="number"
                            step="0.01"
                            value={ceiling.ceilingAmountFunc ?? ""}
                            onChange={(e) =>
                              handleCellChange(
                                index,
                                "ceilingAmountFunc",
                                e.target.value,
                              )
                            }
                            className="table-input"
                            placeholder="0.00"
                          />
                        ) : (
                          ceiling.ceilingAmountFunc
                        )}
                      </td>

                      {/* Apply to R/B/A */}
                      <td className="tbody-td">
                        {isEditable ? (
                          <select
                            value={ceiling.applyToRbaCode || ""}
                            onChange={(e) =>
                              handleCellChange(
                                index,
                                "applyToRbaCode",
                                e.target.value,
                              )
                            }
                            className="table-input"
                          >
                            {applyToRBAOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          applyToRBAOptions.find(
                            (opt) => opt.value === ceiling.applyToRbaCode,
                          )?.label || ceiling.applyToRbaCode
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

export default DirectCostCeilings;

// export default DirectCostCeilings;
