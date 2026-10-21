// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaTrash, FaSave, FaTimes, FaEdit } from "react-icons/fa";
// import { backendUrl } from "./config"; // replace with your backend URL

// const CostFeeOverrideDetails = ({
//   projectId,
//   isSearched,
//   updatedBy = "System",
//   isEditable,
// }) => {
//   const [overrides, setOverrides] = useState([]);
//   const [editIndex, setEditIndex] = useState(null);
//   const [editRow, setEditRow] = useState({});
//   const [showNewRow, setShowNewRow] = useState(false);
//   const [newRow, setNewRow] = useState({
//     costCeiling: "",
//     feeCeiling: "",
//     totalValueCeiling: "",
//     ceilingCode: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");
//   const [hasSearched, setHasSearched] = useState(false);

//   const applyToRBAOptions = [
//     { value: "", label: "Select" },
//     { value: "R", label: "Revenue" },
//     { value: "B", label: "Billing" },
//     { value: "A", label: "All" },
//     { value: "N", label: "None" },
//   ];

//   const isValidProjectId = (id) => !!id;

//   useEffect(() => {
//     let isMounted = true;

//     const fetchData = async () => {
//       if (isSearched && isValidProjectId(projectId)) {
//         setIsLoading(true);
//         try {
//           const response = await axios.get(
//             `${backendUrl}/Project/GetAllCeilingAmtForTotalProjectCost`,
//             { params: { projId: projectId } },
//           );
//           if (isMounted) {
//             setOverrides(response.data?.data || []);
//             setLastSearchedProjectId(projectId);
//             setHasSearched(true);
//           }
//         } catch (error) {
//           if (isMounted) {
//             setOverrides([]);
//             toast.error("Failed to fetch cost fee override details ");
//           }
//         } finally {
//           if (isMounted) {
//             setIsLoading(false);
//             setShowNewRow(false);
//           }
//         }
//       } else if (isMounted) {
//         setOverrides([]);
//         setIsLoading(false);
//         setShowNewRow(false);
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

//   const handleNewClick = () => {
//     if (!shouldShowTable) {
//       toast.warning("Please search for a valid project first.");
//       return;
//     }
//     setShowNewRow(true);
//     setNewRow({
//       costCeiling: "",
//       feeCeiling: "",
//       totalValueCeiling: "",
//       ceilingCode: "",
//     });
//   };

//   const handleSave = async () => {
//     if (!newRow.costCeiling || !newRow.feeCeiling) {
//       toast.warning("Please fill required fields.");
//       return;
//     }

//     try {
//       await axios.post(
//         `${backendUrl}/Project/CreateCeilingAmtForTotalProjectCost`,
//         { projectId, ...newRow },
//         { params: { updatedBy } },
//       );
//       toast.success("Saved successfully ");

//       const response = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingAmtForTotalProjectCost`,
//         { params: { projId: lastSearchedProjectId } },
//       );
//       setOverrides(response.data?.data || []);
//       setShowNewRow(false);
//     } catch (error) {
//       toast.error("Failed to save ");
//     }
//   };

//   const handleEditClick = (index) => {
//     setEditIndex(index);
//     setEditRow({ ...overrides[index] });
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditRow((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdate = async (index) => {
//     try {
//       await axios.put(
//         `${backendUrl}/Project/UpdateCeilingAmtForTotalProjectCost`,
//         { ...editRow, projectId: lastSearchedProjectId },
//         { params: { updatedBy } },
//       );
//       toast.success("Updated successfully ");

//       const response = await axios.get(
//         `${backendUrl}/Project/GetAllCeilingAmtForTotalProjectCost`,
//         { params: { projId: lastSearchedProjectId } },
//       );
//       setOverrides(response.data?.data || []);
//       setEditIndex(null);
//       setEditRow({});
//     } catch (error) {
//       toast.error("Error updating record ");
//     }
//   };

//   const handleDelete = async (index) => {
//     const row = overrides[index];
//     if (!row) return;

//     try {
//       await axios.delete(
//         `${backendUrl}/Project/DeleteCeilingAmtForTotalProjectCostAsync/${row.projectId}`,
//       );
//       setOverrides((prev) => prev.filter((_, i) => i !== index));
//       toast.success("Deleted successfully 🗑️");
//     } catch (error) {
//       toast.error("Error deleting record ");
//     }
//   };

//   const handleCancelNewRow = () => {
//     setShowNewRow(false);
//     setNewRow({
//       costCeiling: "",
//       feeCeiling: "",
//       totalValueCeiling: "",
//       ceilingCode: "",
//     });
//     toast.info("New row canceled.");
//   };

//   if (!shouldShowTable) {
//     return (
//       <div className="text-gray-600">
//         Please search for a project to view details.
//       </div>
//     );
//   }

//   return (
//     <div className="animate-fade-in">
//       <ToastContainer />
//       <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
//         <div className="mb-4">
//           <h2 className="text-sm font-bold text-gray-900 mb-1">
//             Cost Fee Overrides
//           </h2>
//           <div className="flex items-center mb-2">
//             <label className="text-xs font-medium text-gray-700 mr-1">
//               Project:
//             </label>
//             <span className="text-xs text-gray-900">
//               {lastSearchedProjectId}
//             </span>
//           </div>
//           {isEditable && (
//             <button className="btn1 btn-blue" onClick={handleNewClick}>
//               New
//             </button>
//           )}
//         </div>

//         {isLoading ? (
//           <p className="text-gray-600">Loading...</p>
//         ) : overrides.length === 0 && !showNewRow ? (
//           <p className="text-gray-600">
//             No data available for this project ID.
//           </p>
//         ) : (
//           <div className="overflow-x-auto border-line">
//             <table className="w-full table">
//               <thead className="thead">
//                 <tr>
//                   {/* <th className="th-thead">
//                     Project ID
//                   </th> */}
//                   <th className="th-thead">Cost Ceiling</th>
//                   <th className="th-thead">Fee Ceiling</th>
//                   <th className="th-thead">Total Value Ceiling</th>
//                   <th className="th-thead">Ceiling Code</th>
//                   <th className="th-thead">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="tbody">
//                 {showNewRow && (
//                   <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
//                     {/* <td className="px-2 py-1 text-xs">
//                       {lastSearchedProjectId}
//                     </td> */}
//                     <td className="tbody-td">
//                       <input
//                         type="number"
//                         value={newRow.costCeiling}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             costCeiling: e.target.value,
//                           }))
//                         }
//                         className="table-input"
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <input
//                         type="number"
//                         value={newRow.feeCeiling}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             feeCeiling: e.target.value,
//                           }))
//                         }
//                         className="table-input"
//                       />
//                     </td>
//                     <td className="tbody-td">
//                       <input
//                         type="number"
//                         value={newRow.totalValueCeiling}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             totalValueCeiling: e.target.value,
//                           }))
//                         }
//                         className="table-input"
//                       />
//                     </td>
//                     <td className="tbody-td ">
//                       <select
//                         name="ceilingCode"
//                         value={newRow.ceilingCode}
//                         onChange={(e) =>
//                           setNewRow((prev) => ({
//                             ...prev,
//                             ceilingCode: e.target.value,
//                           }))
//                         }
//                         className="table-input text-center"
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
//                         style={{ background: "none", border: "none" }}
//                       >
//                         <FaSave size={15} />
//                       </button>
//                       <button
//                         onClick={handleCancelNewRow}
//                         className="text-gray-500 hover:text-gray-700"
//                         style={{ background: "none", border: "none" }}
//                       >
//                         <FaTimes size={15} />
//                       </button>
//                     </td>
//                   </tr>
//                 )}

//                 {overrides.map((row, index) => (
//                   <tr
//                     key={index}
//                     className="bg-white border-b border-gray-200 hover:bg-gray-50"
//                   >
//                     {/* <td className="px-2 py-1 text-xs">{row.projectId}</td> */}
//                     <td className="tbody-td">
//                       {editIndex === index ? (
//                         <input
//                           type="number"
//                           name="costCeiling"
//                           value={editRow.costCeiling}
//                           onChange={handleEditChange}
//                           className="table-input"
//                         />
//                       ) : (
//                         row.costCeiling
//                       )}
//                     </td>
//                     <td className="tbody-td ">
//                       {editIndex === index ? (
//                         <input
//                           type="number"
//                           name="feeCeiling"
//                           value={editRow.feeCeiling}
//                           onChange={handleEditChange}
//                           className="table-input"
//                         />
//                       ) : (
//                         row.feeCeiling
//                       )}
//                     </td>
//                     <td className="tbody-td">
//                       {editIndex === index ? (
//                         <input
//                           type="number"
//                           name="totalValueCeiling"
//                           value={editRow.totalValueCeiling}
//                           onChange={handleEditChange}
//                           className="table-input"
//                         />
//                       ) : (
//                         row.totalValueCeiling
//                       )}
//                     </td>
//                     <td className="tbody-td">
//                       {editIndex === index ? (
//                         <select
//                           name="ceilingCode"
//                           value={editRow.ceilingCode}
//                           onChange={handleEditChange}
//                           className="table-input text-center"
//                         >
//                           {applyToRBAOptions.map((opt) => (
//                             <option key={opt.value} value={opt.value}>
//                               {opt.label}
//                             </option>
//                           ))}
//                         </select>
//                       ) : (
//                         row.ceilingCode
//                       )}
//                     </td>
//                     <td className="tbody-td ">
//                       {editIndex === index ? (
//                         <>
//                           <button
//                             onClick={() => handleUpdate(index)}
//                             className="text-green-700 hover:text-green-800"
//                             style={{ background: "none", border: "none" }}
//                           >
//                             <FaSave size={15} />
//                           </button>
//                           <button
//                             onClick={() => setEditIndex(null)}
//                             className="text-gray-500 hover:text-gray-700"
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
//                             style={{ background: "none", border: "none" }}
//                           >
//                             <FaEdit size={15} />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(index)}
//                             className="text-gray-400 hover:text-gray-800"
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

// export default CostFeeOverrideDetails;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaSave, FaTimes, FaEdit, FaPlus } from "react-icons/fa";
import { backendUrl } from "./config";

const CostFeeOverrideDetails = ({
  projectId,
  isSearched,
  updatedBy = "System",
  isEditable,
}) => {
  const [overrides, setOverrides] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editRow, setEditRow] = useState({});
  const [showNewRow, setShowNewRow] = useState(false);

  const [newRow, setNewRow] = useState({
    costCeiling: "",
    feeCeiling: "",
    totalValueCeiling: "",
    ceilingCode: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const applyToRBAOptions = [
    { value: "", label: "Select" },
    { value: "R", label: "Revenue" },
    { value: "B", label: "Billing" },
    { value: "A", label: "All" },
    { value: "N", label: "None" },
  ];

  const isValidProjectId = (id) => !!id;

  const resetNewRow = () => {
    setNewRow({
      costCeiling: "",
      feeCeiling: "",
      totalValueCeiling: "",
      ceilingCode: "",
    });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isSearched && isValidProjectId(projectId)) {
        setIsLoading(true);

        try {
          const response = await axios.get(
            `${backendUrl}/Project/GetAllCeilingAmtForTotalProjectCost`,
            {
              params: { projId: projectId },
            },
          );

          if (isMounted) {
            setOverrides(response.data?.data || []);
            setLastSearchedProjectId(projectId);
            setHasSearched(true);
          }
        } catch (error) {
          if (isMounted) {
            setOverrides([]);
            toast.error("Failed to fetch cost fee override details.");
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
            setShowNewRow(false);
            resetNewRow();
          }
        }
      } else if (isMounted) {
        setOverrides([]);
        setIsLoading(false);
        setShowNewRow(false);
        resetNewRow();
        setLastSearchedProjectId("");
        setHasSearched(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [isSearched, projectId]);

  const shouldShowTable =
    hasSearched && isValidProjectId(lastSearchedProjectId);

  const handleNewClick = () => {
    if (!shouldShowTable) {
      toast.warning("Please search for a valid project first.");
      return;
    }

    setEditIndex(null);
    setEditRow({});
    resetNewRow();
    setShowNewRow(true);
  };

  const handleSave = async () => {
    if (!newRow.costCeiling || !newRow.feeCeiling) {
      toast.warning("Please fill required fields.");
      return;
    }

    try {
      await axios.post(
        `${backendUrl}/Project/CreateCeilingAmtForTotalProjectCost`,
        {
          projectId,
          ...newRow,
        },
        {
          params: { updatedBy },
        },
      );

      toast.success("Saved successfully.");

      const response = await axios.get(
        `${backendUrl}/Project/GetAllCeilingAmtForTotalProjectCost`,
        {
          params: {
            projId: lastSearchedProjectId,
          },
        },
      );

      setOverrides(response.data?.data || []);
      setShowNewRow(false);
      resetNewRow();
    } catch (error) {
      toast.error("Failed to save.");
    }
  };

  const handleCancelNewRow = () => {
    setShowNewRow(false);
    resetNewRow();
    toast.info("New row canceled.");
  };

  const handleEditClick = (index) => {
    setShowNewRow(false);
    setEditIndex(index);
    setEditRow({
      ...overrides[index],
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditRow((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (index) => {
    try {
      await axios.put(
        `${backendUrl}/Project/UpdateCeilingAmtForTotalProjectCost`,
        {
          ...editRow,
          projectId: lastSearchedProjectId,
        },
        {
          params: { updatedBy },
        },
      );

      toast.success("Updated successfully.");

      const response = await axios.get(
        `${backendUrl}/Project/GetAllCeilingAmtForTotalProjectCost`,
        {
          params: {
            projId: lastSearchedProjectId,
          },
        },
      );

      setOverrides(response.data?.data || []);
      setEditIndex(null);
      setEditRow({});
    } catch (error) {
      toast.error("Error updating record.");
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditRow({});
  };

  const handleDelete = async (index) => {
    const row = overrides[index];

    if (!row) return;

    try {
      await axios.delete(
        `${backendUrl}/Project/DeleteCeilingAmtForTotalProjectCostAsync/${row.projectId}`,
      );

      setOverrides((prev) => prev.filter((_, i) => i !== index));

      toast.success("Deleted successfully.");
    } catch (error) {
      toast.error("Error deleting record.");
    }
  };

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
      <ToastContainer />

      <div className="border border-gray-300 rounded-lg p-4 bg-white">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-1">
                Cost Fee Overrides
              </h2>

              <div className="flex items-center">
                <label className="text-xs font-medium text-gray-700 mr-1">
                  Project:
                </label>

                <span className="text-xs text-gray-900">
                  {lastSearchedProjectId}
                </span>
              </div>
            </div>

            {/* Top-right actions */}
            {isEditable && (
              <div className="flex items-center gap-2">
                {!showNewRow ? (
                  <button
                    type="button"
                    className="btn1 btn-blue flex items-center gap-2"
                    onClick={handleNewClick}
                  >
                    <FaPlus size={11} />
                    New
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="btn1 btn-blue flex items-center gap-2"
                    >
                      <FaSave size={12} />
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelNewRow}
                      className="btn1 flex items-center gap-2 border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    >
                      <FaTimes size={12} />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-8 text-center text-gray-600 text-sm">
            Loading...
          </div>
        ) : overrides.length === 0 && !showNewRow ? (
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
                  <th className="th-thead">Cost Ceiling</th>
                  <th className="th-thead">Fee Ceiling</th>
                  <th className="th-thead">Total Value Ceiling</th>
                  <th className="th-thead">Ceiling Code</th>
                  <th className="th-thead">Actions</th>
                </tr>
              </thead>

              <tbody className="tbody">
                {/* New Row */}
                {showNewRow && (
                  <tr className="bg-white border-b border-gray-200 hover:bg-gray-50">
                    <td className="tbody-td">
                      <input
                        type="number"
                        value={newRow.costCeiling}
                        onChange={(e) =>
                          setNewRow((prev) => ({
                            ...prev,
                            costCeiling: e.target.value,
                          }))
                        }
                        className="table-input"
                        placeholder="0"
                      />
                    </td>

                    <td className="tbody-td">
                      <input
                        type="number"
                        value={newRow.feeCeiling}
                        onChange={(e) =>
                          setNewRow((prev) => ({
                            ...prev,
                            feeCeiling: e.target.value,
                          }))
                        }
                        className="table-input"
                        placeholder="0"
                      />
                    </td>

                    <td className="tbody-td">
                      <input
                        type="number"
                        value={newRow.totalValueCeiling}
                        onChange={(e) =>
                          setNewRow((prev) => ({
                            ...prev,
                            totalValueCeiling: e.target.value,
                          }))
                        }
                        className="table-input"
                        placeholder="0"
                      />
                    </td>

                    <td className="tbody-td">
                      <select
                        name="ceilingCode"
                        value={newRow.ceilingCode}
                        onChange={(e) =>
                          setNewRow((prev) => ({
                            ...prev,
                            ceilingCode: e.target.value,
                          }))
                        }
                        className="table-input text-center"
                      >
                        {applyToRBAOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* No Save/Cancel here */}
                    {/* <td className="tbody-td text-gray-400 text-xs">
                      New record
                    </td> */}
                  </tr>
                )}

                {/* Existing Rows */}
                {overrides.map((row, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b border-gray-200 hover:bg-gray-50"
                  >
                    {/* Cost Ceiling */}
                    <td className="tbody-td">
                      {editIndex === index ? (
                        <input
                          type="number"
                          name="costCeiling"
                          value={editRow.costCeiling ?? ""}
                          onChange={handleEditChange}
                          className="table-input"
                        />
                      ) : (
                        row.costCeiling
                      )}
                    </td>

                    {/* Fee Ceiling */}
                    <td className="tbody-td">
                      {editIndex === index ? (
                        <input
                          type="number"
                          name="feeCeiling"
                          value={editRow.feeCeiling ?? ""}
                          onChange={handleEditChange}
                          className="table-input"
                        />
                      ) : (
                        row.feeCeiling
                      )}
                    </td>

                    {/* Total Value Ceiling */}
                    <td className="tbody-td">
                      {editIndex === index ? (
                        <input
                          type="number"
                          name="totalValueCeiling"
                          value={editRow.totalValueCeiling ?? ""}
                          onChange={handleEditChange}
                          className="table-input"
                        />
                      ) : (
                        row.totalValueCeiling
                      )}
                    </td>

                    {/* Ceiling Code */}
                    <td className="tbody-td">
                      {editIndex === index ? (
                        <select
                          name="ceilingCode"
                          value={editRow.ceilingCode ?? ""}
                          onChange={handleEditChange}
                          className="table-input text-center"
                        >
                          {applyToRBAOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        row.ceilingCode
                      )}
                    </td>

                    {/* Existing Row Actions */}
                    <td className="tbody-td">
                      {editIndex === index ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleUpdate(index)}
                            className="text-green-700 hover:text-green-800"
                            style={{
                              background: "none",
                              border: "none",
                            }}
                            title="Save"
                          >
                            <FaSave size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="text-gray-500 hover:text-gray-700"
                            style={{
                              background: "none",
                              border: "none",
                            }}
                            title="Cancel"
                          >
                            <FaTimes size={15} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleEditClick(index)}
                            className="text-blue-400 hover:text-blue-700"
                            style={{
                              background: "none",
                              border: "none",
                            }}
                            title="Edit"
                          >
                            <FaEdit size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(index)}
                            className="text-gray-400 hover:text-gray-800"
                            style={{
                              background: "none",
                              border: "none",
                            }}
                            title="Delete"
                          >
                            <FaTrash size={15} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CostFeeOverrideDetails;
