// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaSave, FaEdit, FaTrash, FaTimes, FaPlus } from "react-icons/fa";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { backendUrl } from "./config";

// const FISCAL_YEAR_START = 2020;
// const FISCAL_YEAR_END = 2035;

// const ceilingMethods = [
//   { value: "C", label: "Ceiling" },
//   { value: "O", label: "Override" },
//   { value: "F", label: "Fixed" },
// ];

// const applyToRBAOptions = [
//   { value: "R", label: "Revenue" },
//   { value: "B", label: "Billing" },
//   { value: "A", label: "All" },
//   { value: "N", label: "None" },
// ];

// const isValidProjectId = (id) => !!id;

// const BurdenCostCeilingDetails = ({
//   projectId,
//   project,
//   isSearched,
//   updatedBy = "user",
//   isEditable,
// }) => {
//   const [accounts, setAccounts] = useState([]);
//   const [pools, setPools] = useState([]);
//   const [burdenCeilings, setBurdenCeilings] = useState([]);

//   const [fiscalYear, setFiscalYear] = useState(
//     new Date().getFullYear().toString(),
//   );

//   const [showNewRow, setShowNewRow] = useState(false);

//   const [newRow, setNewRow] = useState({
//     accountId: "",
//     accountName: "",
//     poolCode: "",
//     rateCeiling: "",
//     ceilingMethodCode: "",
//     applyToRbaCode: "",
//     fiscalYear: new Date().getFullYear().toString(),
//   });

//   const [editIndex, setEditIndex] = useState(null);
//   const [editRow, setEditRow] = useState({});

//   const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");
//   const [hasSearched, setHasSearched] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const shouldShowTable =
//     isSearched && isValidProjectId(projectId) && hasSearched;

//   // ---------------------------------------------------------
//   // Fiscal Year Options
//   // ---------------------------------------------------------

//   const fiscalYearOptions = [];

//   for (let year = FISCAL_YEAR_START; year <= FISCAL_YEAR_END; year++) {
//     fiscalYearOptions.push(year.toString());
//   }

//   // ---------------------------------------------------------
//   // Reset New Row
//   // ---------------------------------------------------------

//   const resetNewRow = () => {
//     setNewRow({
//       accountId: "",
//       accountName: "",
//       poolCode: "",
//       rateCeiling: "",
//       ceilingMethodCode: "",
//       applyToRbaCode: "",
//       fiscalYear,
//     });
//   };

//   // ---------------------------------------------------------
//   // Fetch Accounts
//   // ---------------------------------------------------------

//   useEffect(() => {
//     let active = true;

//     if (!(isSearched && isValidProjectId(projectId))) {
//       setAccounts([]);
//       return;
//     }
//     console.log(project);

//     axios
//       .get(
//         `${backendUrl}/Project/GetAllProjectByProjId/${projectId}/${project.type === "NBBUD" ? "NBBUD" : "PROJECT"}`,
//       )
//       .then((res) => {
//         const project = res.data?.[0] || {};

//         const getAccounts = (arr, type) =>
//           Array.isArray(arr)
//             ? arr.map((account) => ({
//                 acctId: account.accountId,
//                 acctName: account.acctName,
//                 type,
//               }))
//             : [];

//         const labor = [
//           ...getAccounts(project.employeeLaborAccounts, "labor"),
//           ...getAccounts(project.otherDirectCostLaborAccounts, "labor"),
//           ...getAccounts(project.sunContractorLaborAccounts, "labor"),
//         ];

//         const nonLabor = [
//           ...getAccounts(project.employeeNonLaborAccounts, "nonLabor"),
//           ...getAccounts(project.otherDirectCostNonLaborAccounts, "nonLabor"),
//           ...getAccounts(project.subContractorNonLaborAccounts, "nonLabor"),
//         ];

//         if (active) {
//           setAccounts([...labor, ...nonLabor]);
//         }
//       })
//       .catch(() => {
//         if (active) {
//           setAccounts([]);
//         }
//       });

//     return () => {
//       active = false;
//     };
//   }, [isSearched, projectId]);

//   // ---------------------------------------------------------
//   // Fetch Burden Ceilings
//   // ---------------------------------------------------------

//   useEffect(() => {
//     let active = true;

//     if (isSearched && isValidProjectId(projectId)) {
//       setIsLoading(true);

//       axios
//         .get(
//           `${backendUrl}/Project/GetAllBurdenCeilingForProject?projId=${projectId}`,
//         )
//         .then((res) => {
//           if (active) {
//             setBurdenCeilings(
//               Array.isArray(res.data?.data) ? res.data.data : [],
//             );

//             setLastSearchedProjectId(projectId);
//             setHasSearched(true);
//           }
//         })
//         .catch(() => {
//           if (active) {
//             setBurdenCeilings([]);
//             setLastSearchedProjectId(projectId);
//             setHasSearched(true);
//           }
//         })
//         .finally(() => {
//           if (active) {
//             setIsLoading(false);
//             setShowNewRow(false);
//             resetNewRow();
//           }
//         });
//     } else {
//       setBurdenCeilings([]);
//       setShowNewRow(false);
//       setPools([]);
//       setLastSearchedProjectId("");
//       setHasSearched(false);
//       setIsLoading(false);
//     }

//     return () => {
//       active = false;
//     };
//   }, [isSearched, projectId]);

//   // ---------------------------------------------------------
//   // Account Change
//   // ---------------------------------------------------------

//   const handleNewAccountChange = (value) => {
//     const selected = accounts.find((account) => account.acctId === value);

//     if (selected) {
//       setNewRow((prev) => ({
//         ...prev,
//         accountId: selected.acctId,
//         accountName: selected.acctName,
//         poolCode: "",
//       }));
//     } else {
//       setNewRow((prev) => ({
//         ...prev,
//         accountId: value,
//         accountName: "",
//         poolCode: "",
//       }));
//     }
//   };

//   // ---------------------------------------------------------
//   // New Row
//   // ---------------------------------------------------------

//   const handleNewClick = () => {
//     if (!isSearched || !isValidProjectId(projectId)) {
//       toast.info("Please enter a valid project ID (e.g., PROJ123) and search.");
//       return;
//     }

//     setEditIndex(null);
//     setEditRow({});
//     resetNewRow();
//     setShowNewRow(true);
//   };

//   // ---------------------------------------------------------
//   // Save New Row
//   // ---------------------------------------------------------

//   const handleSave = async () => {
//     if (
//       !newRow.accountId ||
//       !newRow.poolCode ||
//       !newRow.rateCeiling ||
//       !newRow.ceilingMethodCode ||
//       !newRow.applyToRbaCode ||
//       !newRow.fiscalYear
//     ) {
//       toast.info("Please fill all fields.");
//       return;
//     }

//     if (!updatedBy) {
//       toast.info("updatedBy is required. Please provide a user name.");
//       return;
//     }

//     if (!isSearched || !isValidProjectId(projectId)) {
//       toast.info("Please enter a valid project ID and search.");
//       return;
//     }

//     const requestBody = {
//       projectId: lastSearchedProjectId,
//       fiscalYear: newRow.fiscalYear,
//       accountId: newRow.accountId,
//       accountDesc: newRow.accountName || "",
//       poolCode: newRow.poolCode,
//       rateCeiling: parseFloat(newRow.rateCeiling) || 0,
//       rateFormat: "%",
//       comCeiling: 0,
//       comFormat: "",
//       ceilingMethodCode: newRow.ceilingMethodCode,
//       applyToRbaCode: newRow.applyToRbaCode,
//     };

//     try {
//       await axios.post(
//         `${backendUrl}/Project/CreateBurdenCeilingForProject?updatedBy=${updatedBy}`,
//         requestBody,
//       );

//       const res = await axios.get(
//         `${backendUrl}/Project/GetAllBurdenCeilingForProject?projId=${lastSearchedProjectId}`,
//       );

//       setBurdenCeilings(Array.isArray(res.data?.data) ? res.data.data : []);

//       setShowNewRow(false);
//       resetNewRow();

//       toast.success("Record saved successfully.");
//     } catch (err) {
//       toast.error("Failed to save. Please check your input and try again.");
//     }
//   };

//   // ---------------------------------------------------------
//   // Cancel New Row
//   // ---------------------------------------------------------

//   const handleCancelNewRow = () => {
//     setShowNewRow(false);
//     resetNewRow();
//     setPools([]);
//   };

//   // ---------------------------------------------------------
//   // Edit
//   // ---------------------------------------------------------

//   const handleEditClick = (index) => {
//     setShowNewRow(false);

//     setEditIndex(index);

//     setEditRow({
//       rateCeiling: burdenCeilings[index].rateCeiling,
//       applyToRbaCode: burdenCeilings[index].applyToRbaCode,
//     });
//   };

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
//     const row = burdenCeilings[index];

//     if (!isSearched || !isValidProjectId(projectId)) {
//       toast.info("Please enter a valid project ID and search.");
//       return;
//     }

//     const requestBody = {
//       projectId: row.projectId,
//       fiscalYear: row.fiscalYear,
//       accountId: row.accountId,
//       accountDesc: newRow.accountName || "",
//       poolCode: row.poolCode,
//       rateCeiling: parseFloat(editRow.rateCeiling) || 0,
//       rateFormat: row.rateFormat,
//       comCeiling: row.comCeiling,
//       comFormat: row.comFormat,
//       ceilingMethodCode: row.ceilingMethodCode,
//       applyToRbaCode: editRow.applyToRbaCode,
//     };

//     try {
//       await axios.put(
//         `${backendUrl}/Project/UpdateBurdenCeilingForProject?updatedBy=${updatedBy}`,
//         requestBody,
//       );

//       const res = await axios.get(
//         `${backendUrl}/Project/GetAllBurdenCeilingForProject?projId=${lastSearchedProjectId}`,
//       );

//       setBurdenCeilings(Array.isArray(res.data?.data) ? res.data.data : []);

//       setEditIndex(null);
//       setEditRow({});

//       toast.success("Record updated successfully.");
//     } catch {
//       toast.error("Failed to update. Please check your input and try again.");
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
//     const ceiling = burdenCeilings[index];

//     if (!ceiling) return;

//     try {
//       const response = await fetch(
//         `${backendUrl}/Project/DeleteBurdenCeilingForProject/${ceiling.projectId}/${ceiling.fiscalYear}/${ceiling.accountId}/${ceiling.poolCode}`,
//         {
//           method: "DELETE",
//         },
//       );

//       if (!response.ok) {
//         throw new Error("Failed to delete burden ceiling");
//       }

//       setBurdenCeilings((prev) => prev.filter((_, i) => i !== index));

//       toast.success("Record deleted successfully.");
//     } catch (error) {
//       toast.error("Could not delete burden ceiling. Please try again.");
//     }
//   };

//   // ---------------------------------------------------------
//   // Fetch Pools
//   // ---------------------------------------------------------

//   useEffect(() => {
//     let active = true;

//     const fetchPools = async () => {
//       try {
//         const res = await axios.get(`${backendUrl}/Orgnization/GetAllPools`);

//         if (active) {
//           let poolData = [];

//           if (Array.isArray(res.data)) {
//             poolData = res.data;
//           } else if (res.data && Array.isArray(res.data.data)) {
//             poolData = res.data.data;
//           } else if (
//             res.data &&
//             res.data.pools &&
//             Array.isArray(res.data.pools)
//           ) {
//             poolData = res.data.pools;
//           }

//           const allowedCodes = [
//             "NFRNG",
//             "INTG40",
//             "OVH30",
//             "OVH31",
//             "AEROFR",
//             "SMH50",
//           ];

//           const filteredPools = poolData.filter((pool) =>
//             allowedCodes.includes(pool?.code?.toUpperCase()),
//           );

//           setPools(filteredPools);
//         }
//       } catch (err) {
//         if (active) {
//           setPools([]);
//         }
//       }
//     };

//     if (isSearched && isValidProjectId(projectId) && hasSearched) {
//       fetchPools();
//     } else {
//       setPools([]);
//     }

//     return () => {
//       active = false;
//     };
//   }, [isSearched, projectId, hasSearched, backendUrl]);

//   // ---------------------------------------------------------
//   // Fiscal Year Filter
//   // ---------------------------------------------------------

//   const filteredCeilings = burdenCeilings.filter(
//     (ceiling) => ceiling.fiscalYear === fiscalYear,
//   );

//   // ---------------------------------------------------------
//   // Message States
//   // ---------------------------------------------------------

//   if (isSearched && !isValidProjectId(projectId)) {
//     return (
//       <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
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
//       <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
//         {/* Header */}

//         <div className="border-b border-gray-200 px-4 py-3">
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             {/* Title / Project Info */}

//             <div>
//               <h2 className="text-sm font-bold text-gray-800">
//                 Burden Cost Ceilings
//               </h2>

//               <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
//                 <div className="flex items-center gap-1.5">
//                   <span className="font-medium text-gray-500">Project</span>

//                   <span className="rounded bg-gray-100 px-2 py-0.5 font-semibold text-gray-700">
//                     {lastSearchedProjectId}
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-1.5">
//                   <span className="font-medium text-gray-500">Org ID</span>

//                   <span className="font-semibold text-gray-700">1.02</span>
//                 </div>

//                 <div className="flex items-center gap-1.5">
//                   <label
//                     htmlFor="burden-fiscal-year"
//                     className="font-medium text-gray-500"
//                   >
//                     Fiscal Year
//                   </label>

//                   <select
//                     id="burden-fiscal-year"
//                     value={fiscalYear}
//                     onChange={(e) => setFiscalYear(e.target.value)}
//                     className="h-8 rounded-md border border-gray-300 bg-white px-2 text-xs font-medium text-gray-700 outline-none transition focus:border-[#17414d] focus:ring-1 focus:ring-[#17414d]/20"
//                   >
//                     {fiscalYearOptions.map((year) => (
//                       <option key={year} value={year}>
//                         {year}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Top-right Actions */}

//             {isEditable && (
//               <div className="flex items-center gap-2">
//                 {!showNewRow ? (
//                   <button
//                     type="button"
//                     onClick={handleNewClick}
//                     className="btn1 btn-blue flex items-center gap-2"
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

//         {/* Content */}

//         <div className="p-4">
//           {isLoading ? (
//             <div className="flex min-h-[180px] items-center justify-center">
//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#17414d]" />
//                 Loading burden ceilings...
//               </div>
//             </div>
//           ) : filteredCeilings.length === 0 && !showNewRow ? (
//             <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center">
//               <p className="text-sm font-semibold text-gray-600">
//                 No data available
//               </p>

//               <p className="mt-1 text-xs text-gray-400">
//                 No burden cost ceiling records were found for fiscal year{" "}
//                 {fiscalYear}.
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-hidden rounded-lg border border-gray-200">
//               <div className="overflow-x-auto">
//                 <table className="w-full min-w-[1000px] table">
//                   <thead className="thead">
//                     <tr>
//                       <th className="th-thead">Account</th>

//                       <th className="th-thead">Account Name</th>

//                       <th className="th-thead">Pool</th>

//                       <th className="th-thead text-center">Rate Ceiling</th>

//                       <th className="th-thead text-center">Ceiling Method</th>

//                       <th className="th-thead text-center">Apply to R/B/A</th>

//                       <th className="th-thead text-center">Actions</th>
//                     </tr>
//                   </thead>

//                   <tbody className="tbody">
//                     {/* New Row */}

//                     {showNewRow && (
//                       <tr className="border-b border-gray-200 bg-gray-50">
//                         <td className="tbody-td">
//                           <input
//                             list="accountSuggestions"
//                             value={newRow.accountId}
//                             onChange={(e) =>
//                               handleNewAccountChange(e.target.value)
//                             }
//                             className="table-input min-w-[130px]"
//                             placeholder="Search Account"
//                           />

//                           <datalist id="accountSuggestions">
//                             {accounts.map((account) => (
//                               <option
//                                 key={account.acctId}
//                                 value={account.acctId}
//                               >
//                                 {account.acctName}
//                               </option>
//                             ))}
//                           </datalist>
//                         </td>

//                         <td className="tbody-td text-gray-600">
//                           {newRow.accountName || (
//                             <span className="text-gray-400">—</span>
//                           )}
//                         </td>

//                         <td className="tbody-td">
//                           <select
//                             value={newRow.poolCode}
//                             onChange={(e) =>
//                               setNewRow((prev) => ({
//                                 ...prev,
//                                 poolCode: e.target.value,
//                               }))
//                             }
//                             className="table-input min-w-[140px]"
//                           >
//                             <option value="">-- Select Pool --</option>

//                             {pools.map((pool, index) => {
//                               const poolCode =
//                                 pool.code ||
//                                 pool.poolCode ||
//                                 pool.poolId ||
//                                 pool;

//                               const poolDisplay =
//                                 pool.name || pool.poolName || poolCode;

//                               return (
//                                 <option
//                                   key={pool.id || poolCode || index}
//                                   value={poolCode}
//                                 >
//                                   {poolDisplay}
//                                 </option>
//                               );
//                             })}
//                           </select>
//                         </td>

//                         <td className="tbody-td">
//                           <input
//                             type="text"
//                             value={newRow.rateCeiling}
//                             onChange={(e) =>
//                               setNewRow((prev) => ({
//                                 ...prev,
//                                 rateCeiling: e.target.value,
//                               }))
//                             }
//                             className="table-input w-full min-w-[100px] text-center"
//                             placeholder="0"
//                           />
//                         </td>

//                         <td className="tbody-td">
//                           <select
//                             value={newRow.ceilingMethodCode}
//                             onChange={(e) =>
//                               setNewRow((prev) => ({
//                                 ...prev,
//                                 ceilingMethodCode: e.target.value,
//                               }))
//                             }
//                             className="table-input min-w-[120px] text-center"
//                           >
//                             <option value="">-- Select --</option>

//                             {ceilingMethods.map((method) => (
//                               <option key={method.value} value={method.value}>
//                                 {method.label}
//                               </option>
//                             ))}
//                           </select>
//                         </td>

//                         <td className="tbody-td">
//                           <select
//                             value={newRow.applyToRbaCode}
//                             onChange={(e) =>
//                               setNewRow((prev) => ({
//                                 ...prev,
//                                 applyToRbaCode: e.target.value,
//                               }))
//                             }
//                             className="table-input min-w-[120px] text-center"
//                           >
//                             <option value="">-- Select --</option>

//                             {applyToRBAOptions.map((option) => (
//                               <option key={option.value} value={option.value}>
//                                 {option.label}
//                               </option>
//                             ))}
//                           </select>
//                         </td>

//                         {/* No Save / Cancel here */}

//                         {/* <td className="tbody-td text-center">
//                           <span className="text-xs text-gray-400">
//                             New record
//                           </span>
//                         </td> */}
//                       </tr>
//                     )}

//                     {/* Existing Rows */}

//                     {filteredCeilings.map((ceiling, index) => {
//                       const account = accounts.find(
//                         (account) => account.acctId === ceiling.accountId,
//                       );

//                       const pool = pools.find(
//                         (pool) =>
//                           pool.code === ceiling.poolCode ||
//                           pool.poolCode === ceiling.poolCode ||
//                           pool.poolId === ceiling.poolCode,
//                       );

//                       const poolName =
//                         pool?.name || pool?.poolName || ceiling.poolCode;

//                       const isEditing = editIndex === index;

//                       return (
//                         <tr
//                           key={`${ceiling.accountId}-${ceiling.fiscalYear}-${ceiling.poolCode}-${index}`}
//                           className="border-b border-gray-100 bg-white transition hover:bg-gray-50"
//                         >
//                           <td className="tbody-td font-medium text-gray-700">
//                             {ceiling.accountId}
//                           </td>

//                           <td className="tbody-td text-gray-600">
//                             {account?.acctName || (
//                               <span className="text-gray-400">N/A</span>
//                             )}
//                           </td>

//                           <td className="tbody-td text-gray-700">{poolName}</td>

//                           <td className="tbody-td text-center">
//                             {isEditing ? (
//                               <input
//                                 type="text"
//                                 name="rateCeiling"
//                                 value={editRow.rateCeiling ?? ""}
//                                 onChange={handleEditChange}
//                                 className="table-input mx-auto w-full max-w-[110px] text-center"
//                               />
//                             ) : (
//                               <span className="font-medium text-gray-700">
//                                 {ceiling.rateCeiling}
//                               </span>
//                             )}
//                           </td>

//                           <td className="tbody-td text-center">
//                             <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
//                               {/* {ceiling.ceilingMethodCode} */}
//                               {ceilingMethods.find(
//                                 (opt) =>
//                                   opt.value === ceiling.ceilingMethodCode,
//                               )?.label || ceiling.ceilingMethodCode}
//                             </span>
//                           </td>

//                           <td className="tbody-td text-center">
//                             {isEditing ? (
//                               <select
//                                 name="applyToRbaCode"
//                                 value={editRow.applyToRbaCode ?? ""}
//                                 onChange={handleEditChange}
//                                 className="table-input mx-auto w-full max-w-[130px] text-center"
//                               >
//                                 {applyToRBAOptions.map((option) => (
//                                   <option
//                                     key={option.value}
//                                     value={option.value}
//                                   >
//                                     {option.label}
//                                   </option>
//                                 ))}
//                               </select>
//                             ) : (
//                               <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
//                                 {/* {ceiling.applyToRbaCode} */}
//                                 {applyToRBAOptions.find(
//                                   (opt) => opt.value === ceiling.applyToRbaCode,
//                                 )?.label || ceiling.applyToRbaCode}
//                               </span>
//                             )}
//                           </td>

//                           {/* Existing Row Actions */}

//                           <td className="tbody-td">
//                             <div className="flex items-center justify-center gap-1">
//                               {isEditing ? (
//                                 <>
//                                   <button
//                                     type="button"
//                                     onClick={() => handleUpdate(index)}
//                                     className="inline-flex h-7 w-7 items-center justify-center rounded-md text-green-600 transition hover:bg-green-50 hover:text-green-700"
//                                     title="Save changes"
//                                   >
//                                     <FaSave size={14} />
//                                   </button>

//                                   <button
//                                     type="button"
//                                     onClick={handleCancelEdit}
//                                     className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//                                     title="Cancel"
//                                   >
//                                     <FaTimes size={14} />
//                                   </button>
//                                 </>
//                               ) : (
//                                 <>
//                                   {isEditable && (
//                                     <button
//                                       type="button"
//                                       onClick={() => handleEditClick(index)}
//                                       className="inline-flex h-7 w-7 items-center justify-center rounded-md text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
//                                       title="Edit"
//                                     >
//                                       <FaEdit size={13} />
//                                     </button>
//                                   )}

//                                   {isEditable && (
//                                     <button
//                                       type="button"
//                                       onClick={() => handleDelete(index)}
//                                       className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50 hover:text-red-600"
//                                       title="Delete"
//                                     >
//                                       <FaTrash size={13} />
//                                     </button>
//                                   )}
//                                 </>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BurdenCostCeilingDetails;

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "./config";

const FISCAL_YEAR_START = 2020;
const FISCAL_YEAR_END = 2035;

const ceilingMethods = [
  { value: "C", label: "Ceiling" },
  { value: "O", label: "Override" },
  { value: "F", label: "Fixed" },
];

const applyToRBAOptions = [
  { value: "R", label: "Revenue" },
  { value: "B", label: "Billing" },
  { value: "A", label: "All" },
  { value: "N", label: "None" },
];

const isValidProjectId = (id) => !!id;

const normalizeValue = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const getRowKey = (row) =>
  `${row.projectId ?? ""}__${row.fiscalYear ?? ""}__${row.accountId ?? ""}__${row.poolCode ?? ""}`;

const createEmptyRow = (projectId, fiscalYear) => ({
  _rowId: crypto.randomUUID(),
  projectId,
  fiscalYear: String(fiscalYear),
  accountId: "",
  accountName: "",
  accountDesc: "",
  poolCode: "",
  rateCeiling: "",
  rateFormat: "%",
  comCeiling: 0,
  comFormat: "",
  ceilingMethodCode: "",
  applyToRbaCode: "",
  isNew: true,
  isSelected: false,
});

const BurdenCostCeilingDetails = ({
  projectId,
  project,
  isSearched,
  updatedBy = "user",
  isEditable,
}) => {
  const [accounts, setAccounts] = useState([]);
  const [pools, setPools] = useState([]);

  // Original API snapshot
  const [originalCeilings, setOriginalCeilings] = useState([]);

  // Working rows, including new and edited rows
  const [burdenCeilings, setBurdenCeilings] = useState([]);

  const [fiscalYear, setFiscalYear] = useState(
    new Date().getFullYear().toString(),
  );

  const [lastSearchedProjectId, setLastSearchedProjectId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const shouldShowTable =
    isSearched && isValidProjectId(projectId) && hasSearched;

  const fiscalYearOptions = [];

  for (let year = FISCAL_YEAR_START; year <= FISCAL_YEAR_END; year++) {
    fiscalYearOptions.push(year.toString());
  }

  // ---------------------------------------------------------
  // Normalize API Rows
  // ---------------------------------------------------------

  const normalizeApiRows = (rows) =>
    rows.map((row) => ({
      _rowId: crypto.randomUUID(),
      ...row,
      projectId: row.projectId ?? projectId,
      fiscalYear: String(row.fiscalYear ?? fiscalYear),
      accountId: row.accountId ?? "",
      accountName: row.accountName ?? "",
      accountDesc: row.accountDesc ?? "",
      poolCode: row.poolCode ?? "",
      rateCeiling: row.rateCeiling ?? "",
      rateFormat: row.rateFormat ?? "%",
      comCeiling: row.comCeiling ?? 0,
      comFormat: row.comFormat ?? "",
      ceilingMethodCode: row.ceilingMethodCode ?? "",
      applyToRbaCode: row.applyToRbaCode ?? "",
      isNew: false,
      isSelected: false,
    }));

  // ---------------------------------------------------------
  // Fetch Accounts
  // ---------------------------------------------------------

  useEffect(() => {
    let active = true;

    if (!(isSearched && isValidProjectId(projectId))) {
      setAccounts([]);
      return;
    }

    axios
      .get(
        `${backendUrl}/Project/GetAllProjectByProjId/${
          projectId
        }/${project?.type === "NBBUD" ? "NBBUD" : "PROJECT"}`,
      )
      .then((res) => {
        const projectData = res.data?.[0] || {};

        const getAccounts = (arr, type) =>
          Array.isArray(arr)
            ? arr.map((account) => ({
                acctId: account.accountId,
                acctName: account.acctName,
                type,
              }))
            : [];

        const labor = [
          ...getAccounts(projectData.employeeLaborAccounts, "labor"),
          ...getAccounts(projectData.otherDirectCostLaborAccounts, "labor"),
          ...getAccounts(projectData.sunContractorLaborAccounts, "labor"),
        ];

        const nonLabor = [
          ...getAccounts(projectData.employeeNonLaborAccounts, "nonLabor"),
          ...getAccounts(
            projectData.otherDirectCostNonLaborAccounts,
            "nonLabor",
          ),
          ...getAccounts(projectData.subContractorNonLaborAccounts, "nonLabor"),
        ];

        if (active) {
          setAccounts([...labor, ...nonLabor]);
        }
      })
      .catch(() => {
        if (active) {
          setAccounts([]);
        }
      });

    return () => {
      active = false;
    };
  }, [isSearched, projectId, project?.type]);

  // ---------------------------------------------------------
  // Fetch Burden Ceilings
  // ---------------------------------------------------------

  const fetchBurdenCeilings = async (targetProjectId = projectId) => {
    const res = await axios.get(
      `${backendUrl}/Project/GetAllBurdenCeilingForProject?projId=${targetProjectId}`,
    );

    const apiRows = Array.isArray(res.data?.data) ? res.data.data : [];
    const normalizedRows = normalizeApiRows(apiRows);

    setOriginalCeilings(normalizedRows);
    setBurdenCeilings(normalizedRows);
  };

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      if (!(isSearched && isValidProjectId(projectId))) {
        setOriginalCeilings([]);
        setBurdenCeilings([]);
        setPools([]);
        setLastSearchedProjectId("");
        setHasSearched(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const res = await axios.get(
          `${backendUrl}/Project/GetAllBurdenCeilingForProject?projId=${projectId}`,
        );

        if (!active) return;

        const apiRows = Array.isArray(res.data?.data) ? res.data.data : [];
        const normalizedRows = normalizeApiRows(apiRows);

        setOriginalCeilings(normalizedRows);
        setBurdenCeilings(normalizedRows);
        setLastSearchedProjectId(projectId);
        setHasSearched(true);
      } catch (error) {
        console.error("Fetch burden ceilings error:", error);

        if (active) {
          setOriginalCeilings([]);
          setBurdenCeilings([]);
          setLastSearchedProjectId(projectId);
          setHasSearched(true);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [isSearched, projectId]);

  // ---------------------------------------------------------
  // Fetch Pools
  // ---------------------------------------------------------

  useEffect(() => {
    let active = true;

    const fetchPools = async () => {
      try {
        const res = await axios.get(`${backendUrl}/Orgnization/GetAllPools`);

        if (!active) return;

        let poolData = [];

        if (Array.isArray(res.data)) {
          poolData = res.data;
        } else if (Array.isArray(res.data?.data)) {
          poolData = res.data.data;
        } else if (Array.isArray(res.data?.pools)) {
          poolData = res.data.pools;
        }

        const allowedCodes = [
          "NFRNG",
          "INTG40",
          "OVH30",
          "OVH31",
          "AEROFR",
          "SMH50",
        ];

        const filteredPools = poolData.filter((pool) =>
          allowedCodes.includes(
            String(pool?.code || pool?.poolCode || "").toUpperCase(),
          ),
        );

        setPools(filteredPools);
      } catch (error) {
        console.error("Fetch pools error:", error);

        if (active) {
          setPools([]);
        }
      }
    };

    if (isSearched && isValidProjectId(projectId) && hasSearched) {
      fetchPools();
    } else {
      setPools([]);
    }

    return () => {
      active = false;
    };
  }, [isSearched, projectId, hasSearched]);

  // ---------------------------------------------------------
  // Change Detection
  // ---------------------------------------------------------

  const comparableRows = (rows) =>
    rows.map((row) => {
      const { isSelected, isNew, ...rest } = row;

      return rest;
    });

  const hasChanges = useMemo(() => {
    return (
      JSON.stringify(comparableRows(originalCeilings)) !==
      JSON.stringify(comparableRows(burdenCeilings))
    );
  }, [originalCeilings, burdenCeilings]);

  const selectedRows = useMemo(
    () => burdenCeilings.filter((row) => row.isSelected && !row.isNew),
    [burdenCeilings],
  );

  const selectedRowsCount = selectedRows.length;

  // ---------------------------------------------------------
  // New Row
  // ---------------------------------------------------------

  const handleNewClick = () => {
    if (!isSearched || !isValidProjectId(projectId)) {
      toast.info("Please enter a valid project ID and search.");
      return;
    }

    setBurdenCeilings((prev) => [
      createEmptyRow(lastSearchedProjectId || projectId, fiscalYear),
      ...prev,
    ]);
  };

  // ---------------------------------------------------------
  // Account Change
  // ---------------------------------------------------------

  const handleAccountChange = (index, value) => {
    const selectedAccount = accounts.find(
      (account) => String(account.acctId) === String(value),
    );

    setBurdenCeilings((prev) =>
      prev.map((row, rowIndex) => {
        if (rowIndex !== index) return row;

        return {
          ...row,
          accountId: value,
          accountName: selectedAccount?.acctName || "",
          accountDesc: selectedAccount?.acctName || "",
          poolCode: "",
        };
      }),
    );
  };

  // ---------------------------------------------------------
  // Cell Change
  // ---------------------------------------------------------

  const handleCellChange = (index, field, value) => {
    setBurdenCeilings((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    );
  };

  // ---------------------------------------------------------
  // Checkbox Selection
  // ---------------------------------------------------------

  const handleToggleRow = (index, checked) => {
    setBurdenCeilings((prev) =>
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

  const visibleRows = useMemo(
    () =>
      burdenCeilings.filter(
        (row) => String(row.fiscalYear) === String(fiscalYear),
      ),
    [burdenCeilings, fiscalYear],
  );

  const existingVisibleRows = visibleRows.filter((row) => !row.isNew);

  const allVisibleSelected =
    existingVisibleRows.length > 0 &&
    existingVisibleRows.every((row) => row.isSelected);

  const someVisibleSelected =
    existingVisibleRows.some((row) => row.isSelected) && !allVisibleSelected;

  const handleToggleSelectAll = (checked) => {
    setBurdenCeilings((prev) =>
      prev.map((row) => {
        if (String(row.fiscalYear) !== String(fiscalYear) || row.isNew) {
          return row;
        }

        return {
          ...row,
          isSelected: checked,
        };
      }),
    );
  };

  // ---------------------------------------------------------
  // Delete Selected Rows
  // ---------------------------------------------------------

  const handleDelete = async () => {
    if (!isEditable) return;

    const rowsToDelete = burdenCeilings.filter(
      (row) => row.isSelected && !row.isNew,
    );

    const newRowsToRemove = burdenCeilings.filter(
      (row) => row.isSelected && row.isNew,
    );

    if (rowsToDelete.length === 0 && newRowsToRemove.length === 0) {
      toast.info("Please select at least one row to delete.");
      return;
    }

    const totalRows = rowsToDelete.length + newRowsToRemove.length;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${totalRows} selected row(s)?`,
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const deleteRequests = rowsToDelete.map((row) =>
        axios.delete(
          `${backendUrl}/Project/DeleteBurdenCeilingForProject/${encodeURIComponent(
            row.projectId,
          )}/${encodeURIComponent(row.fiscalYear)}/${encodeURIComponent(
            row.accountId,
          )}/${encodeURIComponent(row.poolCode)}`,
        ),
      );

      const deleteResults = await Promise.allSettled(deleteRequests);

      const failedDeletes = deleteResults.filter(
        (result) => result.status === "rejected",
      );

      if (failedDeletes.length > 0) {
        toast.warning(
          `${rowsToDelete.length - failedDeletes.length} existing row(s) deleted, ${failedDeletes.length} failed.`,
        );
      }

      const failedKeys = new Set();

      deleteResults.forEach((result, index) => {
        if (result.status === "rejected") {
          failedKeys.add(getRowKey(rowsToDelete[index]));
        }
      });

      setBurdenCeilings((prev) =>
        prev.filter((row) => {
          if (row.isNew && row.isSelected) {
            return false;
          }

          if (!row.isNew && row.isSelected) {
            return failedKeys.has(getRowKey(row));
          }

          return true;
        }),
      );

      setOriginalCeilings((prev) =>
        prev.filter((row) => {
          if (!row.isSelected) return true;

          return failedKeys.has(getRowKey(row));
        }),
      );

      if (failedDeletes.length === 0) {
        toast.success(`${totalRows} row(s) deleted successfully.`);
      }

      await fetchBurdenCeilings(lastSearchedProjectId || projectId);
    } catch (error) {
      console.error("Delete burden ceiling error:", error);
      toast.error("Could not delete the selected rows.");
    } finally {
      setIsDeleting(false);
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

    const restoredRows = originalCeilings.map((row) => ({
      ...row,
      isSelected: false,
      isNew: false,
    }));

    setBurdenCeilings(restoredRows);

    toast.success("Unsaved changes cleared.");
  };

  // ---------------------------------------------------------
  // Validation
  // ---------------------------------------------------------

  const validateRateCeiling = (value) => {
    if (value === "" || value === null || value === undefined) {
      return "Rate Ceiling is required.";
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return "Rate Ceiling must be a valid number.";
    }

    if (numericValue < 0) {
      return "Rate Ceiling cannot be negative.";
    }

    return null;
  };

  // const validateRows = () => {
  //   const validAccountIds = new Set(
  //     (accounts || []).map((acc) => String(acc.acctId).trim()),
  //   );
  //   for (const row of burdenCeilings) {
  //     if (!row.accountId) {
  //       return "Account is required for every row.";
  //     }

  //     if (!row.poolCode) {
  //       return `Pool is required for Account ${row.accountId}.`;
  //     }

  //     if (!row.fiscalYear) {
  //       return `Fiscal Year is required for Account ${row.accountId}.`;
  //     }

  //     const rateError = validateRateCeiling(row.rateCeiling);

  //     if (rateError) {
  //       return `Account ${row.accountId}: ${rateError}`;
  //     }

  //     if (!row.ceilingMethodCode) {
  //       return `Ceiling Method is required for Account ${row.accountId}.`;
  //     }

  //     if (!row.applyToRbaCode) {
  //       return `Apply to R/B/A is required for Account ${row.accountId}.`;
  //     }
  //   }

  //   const duplicateMap = new Map();

  //   for (const row of burdenCeilings) {
  //     const duplicateKey = [
  //       normalizeValue(row.accountId),
  //       normalizeValue(row.poolCode),
  //       normalizeValue(row.fiscalYear),
  //     ].join("__");

  //     if (!duplicateMap.has(duplicateKey)) {
  //       duplicateMap.set(duplicateKey, []);
  //     }

  //     duplicateMap.get(duplicateKey).push(row);
  //   }

  //   const duplicateRows = [...duplicateMap.values()].filter(
  //     (rows) => rows.length > 1,
  //   );

  //   if (duplicateRows.length > 0) {
  //     const duplicateText = duplicateRows
  //       .map(
  //         (rows) =>
  //           `${rows[0].accountId} / ${rows[0].poolCode} / ${rows[0].fiscalYear}`,
  //       )
  //       .join(", ");

  //     return `Duplicate record(s) found: ${duplicateText}.`;
  //   }

  //   return null;
  // };

  // ---------------------------------------------------------
  // Payload Builders
  // ---------------------------------------------------------

  const validateRows = () => {
    // Extract all valid account IDs into a Set for quick O(1) lookup
    const validAccountIds = new Set(
      (accounts || []).map((acc) => String(acc.acctId).trim()),
    );

    for (const row of burdenCeilings) {
      if (!row.accountId) {
        return {
          message: "Account is required for every row.",
          type: "warning",
        };
      }

      // Check if entered accountId exists in the suggestions list
      if (!validAccountIds.has(String(row.accountId).trim())) {
        return {
          message: `Account "${row.accountId}" is invalid or not in the suggestion list.`,
          type: "info",
        };
      }

      if (!row.poolCode) {
        return {
          message: `Pool is required for Account ${row.accountId}.`,
          type: "warning",
        };
      }

      if (!row.fiscalYear) {
        return {
          message: `Fiscal Year is required for Account ${row.accountId}.`,
          type: "warning",
        };
      }

      const rateError = validateRateCeiling(row.rateCeiling);
      if (rateError) {
        return {
          message: `Account ${row.accountId}: ${rateError}`,
          type: "warning",
        };
      }

      if (!row.ceilingMethodCode) {
        return {
          message: `Ceiling Method is required for Account ${row.accountId}.`,
          type: "warning",
        };
      }

      if (!row.applyToRbaCode) {
        return {
          message: `Apply to R/B/A is required for Account ${row.accountId}.`,
          type: "warning",
        };
      }
    }

    // Duplicate Check
    const duplicateMap = new Map();

    for (const row of burdenCeilings) {
      const duplicateKey = [
        normalizeValue(row.accountId),
        normalizeValue(row.poolCode),
        normalizeValue(row.fiscalYear),
      ].join("__");

      if (!duplicateMap.has(duplicateKey)) {
        duplicateMap.set(duplicateKey, []);
      }

      duplicateMap.get(duplicateKey).push(row);
    }

    const duplicateRows = [...duplicateMap.values()].filter(
      (rows) => rows.length > 1,
    );

    if (duplicateRows.length > 0) {
      const duplicateText = duplicateRows
        .map(
          (rows) =>
            `${rows[0].accountId} / ${rows[0].poolCode} / ${rows[0].fiscalYear}`,
        )
        .join(", ");

      return {
        message: `Duplicate record(s) found: ${duplicateText}.`,
        type: "warning",
      };
    }

    return null;
  };

  const buildCreatePayload = (row) => ({
    projectId: row.projectId || lastSearchedProjectId,
    fiscalYear: row.fiscalYear,
    accountId: row.accountId,
    accountDesc: row.accountDesc || row.accountName || "",
    poolCode: row.poolCode,
    rateCeiling: Number(row.rateCeiling),
    rateFormat: row.rateFormat || "%",
    comCeiling: Number(row.comCeiling || 0),
    comFormat: row.comFormat || "",
    ceilingMethodCode: row.ceilingMethodCode,
    applyToRbaCode: row.applyToRbaCode,
  });

  const buildUpdatePayload = (row) => ({
    projectId: row.projectId || lastSearchedProjectId,
    fiscalYear: row.fiscalYear,
    accountId: row.accountId,
    accountDesc: row.accountDesc || row.accountName || "",
    poolCode: row.poolCode,
    rateCeiling: Number(row.rateCeiling),
    rateFormat: row.rateFormat || "%",
    comCeiling: Number(row.comCeiling || 0),
    comFormat: row.comFormat || "",
    ceilingMethodCode: row.ceilingMethodCode,
    applyToRbaCode: row.applyToRbaCode,
  });

  const hasUnsavedChanges = useMemo(() => {
    const cleanRows = (rows) =>
      rows.map(({ isSelected, isNew, ...row }) => row);

    return (
      JSON.stringify(cleanRows(burdenCeilings)) !==
      JSON.stringify(cleanRows(originalCeilings))
    );
  }, [burdenCeilings, originalCeilings]);

  // ---------------------------------------------------------
  // Batch Save
  // ---------------------------------------------------------

  const handleSave = async () => {
    if (!isEditable) return;

    if (!isSearched || !isValidProjectId(projectId)) {
      toast.info("Please enter a valid project ID and search.");
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

    // const validationError = validateRows();
    const validation = validateRows();

    if (validation) {
      if (validation.type === "info") {
        toast.info(validation.message);
      } else {
        toast.warning(validation.message);
      }
      return;
    }

    const originalMap = new Map(
      originalCeilings.map((row) => [getRowKey(row), row]),
    );

    const workingMap = new Map(
      burdenCeilings
        .filter((row) => !row.isNew)
        .map((row) => [getRowKey(row), row]),
    );

    // Existing rows removed from the working state
    const deletedRows = originalCeilings.filter(
      (row) => !workingMap.has(getRowKey(row)),
    );

    // New rows
    const newRows = burdenCeilings.filter((row) => row.isNew);

    // Existing rows that have changed
    const updatedRows = burdenCeilings.filter((row) => {
      if (row.isNew) return false;

      const original = originalMap.get(getRowKey(row));

      if (!original) return false;

      return (
        String(original.rateCeiling ?? "") !== String(row.rateCeiling ?? "") ||
        String(original.applyToRbaCode ?? "") !==
          String(row.applyToRbaCode ?? "") ||
        String(original.ceilingMethodCode ?? "") !==
          String(row.ceilingMethodCode ?? "") ||
        String(original.rateFormat ?? "") !== String(row.rateFormat ?? "") ||
        String(original.comCeiling ?? "") !== String(row.comCeiling ?? "") ||
        String(original.comFormat ?? "") !== String(row.comFormat ?? "")
      );
    });

    setIsSaving(true);

    try {
      const deleteRequests = deletedRows.map((row) =>
        axios.delete(
          `${backendUrl}/Project/DeleteBurdenCeilingForProject/${encodeURIComponent(
            row.projectId,
          )}/${encodeURIComponent(row.fiscalYear)}/${encodeURIComponent(
            row.accountId,
          )}/${encodeURIComponent(row.poolCode)}`,
        ),
      );

      const updateRequests = updatedRows.map((row) =>
        axios.put(
          `${backendUrl}/Project/UpdateBurdenCeilingForProject?updatedBy=${encodeURIComponent(
            updatedBy,
          )}`,
          buildUpdatePayload(row),
        ),
      );

      const createRequests = newRows.map((row) =>
        axios.post(
          `${backendUrl}/Project/CreateBurdenCeilingForProject?updatedBy=${encodeURIComponent(
            updatedBy,
          )}`,
          buildCreatePayload(row),
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

      await fetchBurdenCeilings(lastSearchedProjectId || projectId);

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
      console.error("Save burden ceiling error:", error);
      toast.error(
        "Some changes could not be saved. Please check your input and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------------------------------------------------
  // Message States
  // ---------------------------------------------------------

  if (isSearched && !isValidProjectId(projectId)) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        Invalid project ID.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-8 text-center">
        <p className="text-sm font-medium text-gray-600">
          Loading Burden Cost Ceilings...
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
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* Header */}

        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-gray-800">
                Burden Cost Ceilings
              </h2>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-gray-500">Project</span>

                  <span className="rounded bg-gray-100 px-2 py-0.5 font-semibold text-gray-700">
                    {lastSearchedProjectId}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-gray-500">Org ID</span>

                  <span className="font-semibold text-gray-700">1.02</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="burden-fiscal-year"
                    className="font-medium text-gray-500"
                  >
                    Fiscal Year
                  </label>

                  <select
                    id="burden-fiscal-year"
                    value={fiscalYear}
                    onChange={(e) => setFiscalYear(e.target.value)}
                    className="h-8 rounded-md border border-gray-300 bg-white px-2 text-xs font-medium text-gray-700 outline-none transition focus:border-[#17414d] focus:ring-1 focus:ring-[#17414d]/20"
                  >
                    {fiscalYearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Top-right Actions */}

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

        <div className="p-4">
          {isLoading ? (
            <div className="flex min-h-[180px] items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#17414d]" />
                Loading burden ceilings...
              </div>
            </div>
          ) : visibleRows.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center">
              <p className="text-sm font-semibold text-gray-600">
                No data available
              </p>

              <p className="mt-1 text-xs text-gray-400">
                No burden cost ceiling records were found for fiscal year{" "}
                {fiscalYear}.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] table">
                  <thead className="thead">
                    <tr>
                      {isEditable && (
                        <th className="th-thead w-[45px] text-center">
                          <input
                            type="checkbox"
                            checked={allVisibleSelected}
                            ref={(element) => {
                              if (element) {
                                element.indeterminate = someVisibleSelected;
                              }
                            }}
                            onChange={(e) =>
                              handleToggleSelectAll(e.target.checked)
                            }
                            className="h-3 w-3 cursor-pointer"
                            title="Select all existing rows"
                          />
                        </th>
                      )}

                      <th className="th-thead">Account</th>
                      <th className="th-thead">Account Name</th>
                      <th className="th-thead">Pool</th>
                      <th className="th-thead text-center">Rate Ceiling</th>
                      <th className="th-thead text-center">Ceiling Method</th>
                      <th className="th-thead text-center">Apply to R/B/A</th>
                    </tr>
                  </thead>

                  <tbody className="tbody">
                    {visibleRows.map((ceiling) => {
                      const actualIndex = burdenCeilings.findIndex(
                        (row) => row === ceiling,
                      );

                      const account = accounts.find(
                        (accountItem) =>
                          String(accountItem.acctId) ===
                          String(ceiling.accountId),
                      );

                      const pool = pools.find(
                        (poolItem) =>
                          String(
                            poolItem.code ||
                              poolItem.poolCode ||
                              poolItem.poolId,
                          ) === String(ceiling.poolCode),
                      );

                      const poolName =
                        pool?.name || pool?.poolName || ceiling.poolCode || "";
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
                                  handleToggleRow(actualIndex, e.target.checked)
                                }
                                className="h-3 w-3 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                title={
                                  ceiling.isNew
                                    ? "New rows cannot be deleted before saving"
                                    : "Select row"
                                }
                              />
                            </td>
                          )}

                          <td className="tbody-td">
                            {ceiling.isNew ? (
                              <>
                                <input
                                  list="burden-account-suggestions"
                                  value={ceiling.accountId}
                                  onChange={(e) =>
                                    handleAccountChange(
                                      actualIndex,
                                      e.target.value,
                                    )
                                  }
                                  className="table-input min-w-[130px]"
                                  placeholder="Search Account"
                                />

                                <datalist id="burden-account-suggestions">
                                  {accounts.map((accountItem) => (
                                    <option
                                      key={accountItem.acctId}
                                      value={accountItem.acctId}
                                    >
                                      {accountItem.acctName}
                                    </option>
                                  ))}
                                </datalist>
                              </>
                            ) : (
                              <span className="font-medium text-gray-700">
                                {ceiling.accountId}
                              </span>
                            )}
                          </td>

                          <td className="tbody-td text-gray-600">
                            {account?.acctName ||
                              ceiling.accountDesc ||
                              ceiling.accountName || (
                                <span className="text-gray-400">N/A</span>
                              )}
                          </td>

                          <td className="tbody-td">
                            {ceiling.isNew ? (
                              <select
                                value={ceiling.poolCode}
                                onChange={(e) =>
                                  handleCellChange(
                                    actualIndex,
                                    "poolCode",
                                    e.target.value,
                                  )
                                }
                                className="table-input min-w-[140px]"
                              >
                                <option value="">-- Select Pool --</option>

                                {pools.map((pool, index) => {
                                  const poolCode =
                                    pool.code ||
                                    pool.poolCode ||
                                    pool.poolId ||
                                    pool;

                                  const poolDisplay =
                                    pool.name || pool.poolName || poolCode;

                                  return (
                                    <option
                                      key={pool.id || poolCode || index}
                                      value={poolCode}
                                    >
                                      {poolDisplay}
                                    </option>
                                  );
                                })}
                              </select>
                            ) : (
                              <span className="text-gray-700">{poolName}</span>
                            )}
                          </td>

                          <td className="tbody-td text-center">
                            {isEditable ? (
                              <input
                                type="number"
                                min="0"
                                step="any"
                                value={ceiling.rateCeiling}
                                onChange={(e) =>
                                  handleCellChange(
                                    actualIndex,
                                    "rateCeiling",
                                    e.target.value,
                                  )
                                }
                                className="table-input mx-auto w-full max-w-[110px] text-center"
                              />
                            ) : (
                              <span className="font-medium text-gray-700">
                                {ceiling.rateCeiling}
                              </span>
                            )}
                          </td>

                          <td className="tbody-td text-center">
                            {ceiling.isNew ? (
                              <select
                                value={ceiling.ceilingMethodCode}
                                onChange={(e) =>
                                  handleCellChange(
                                    actualIndex,
                                    "ceilingMethodCode",
                                    e.target.value,
                                  )
                                }
                                className="table-input min-w-[120px] text-center"
                              >
                                <option value="">-- Select --</option>

                                {ceilingMethods.map((method) => (
                                  <option
                                    key={method.value}
                                    value={method.value}
                                  >
                                    {method.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                                {ceilingMethods.find(
                                  (method) =>
                                    method.value === ceiling.ceilingMethodCode,
                                )?.label || ceiling.ceilingMethodCode}
                              </span>
                            )}
                          </td>

                          <td className="tbody-td text-center">
                            {isEditable ? (
                              <select
                                value={ceiling.applyToRbaCode}
                                onChange={(e) =>
                                  handleCellChange(
                                    actualIndex,
                                    "applyToRbaCode",
                                    e.target.value,
                                  )
                                }
                                className="table-input mx-auto w-full max-w-[130px] text-center"
                              >
                                <option value="">-- Select --</option>

                                {applyToRBAOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                                {applyToRBAOptions.find(
                                  (option) =>
                                    option.value === ceiling.applyToRbaCode,
                                )?.label || ceiling.applyToRbaCode}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BurdenCostCeilingDetails;
