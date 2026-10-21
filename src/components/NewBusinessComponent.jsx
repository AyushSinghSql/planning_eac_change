// // import axios from "axios";
// // import React, { useEffect, useState } from "react";
// // import { backendUrl } from "./config";
// // import NewBusiness from "./NewBusiness";
// // import { toast } from "react-toastify";
// // import { BriefcaseBusiness } from "lucide-react";
// // import { useOutletContext } from "react-router-dom";

// // const NewBusinessComponent = ({ title }) => {
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [showNewBusinessPopup, setShowNewBusinessPopup] = useState(false);
// //   const [editNewBusinessPopup, setEditNewBusinessPopup] = useState(false);
// //   const [data, setData] = useState([]);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [isDeleting, setIsDeleting] = useState(false);
// //   const [dataItem, setDataItem] = useState([]);

// //   const [selectedBusiness, setSelectedBusiness] = useState(null);
// //   const [selectedRows, setSelectedRows] = useState(new Set());

// //   const { canEdit } = useOutletContext();
// //   const isEditable = canEdit("manageNewBusiness");

// //   // 1. Added calculated column identifiers into your state array
// //   const [columns] = useState([
// //     "businessBudgetId",
// //     "description",
// //     "stage",
// //     "contractValue",
// //     "contractTypes",
// //     "pwinValue",
// //     "revenue", // ⭐ Added
// //     "orgId",
// //     // "accountGroup",
// //     "customer",
// //     "onsiteLaborPercent",
// //     "subcontractorAmt", // ⭐ Added
// //     "offSiteLaborPercent",
// //     "directLaborAmt", // ⭐ Added
// //     "nonLaborPercent",
// //     "odcAmt", // ⭐ Added
// //     // "isActive",
// //     // "version",
// //     // "versionCode",
// //     "startDate",
// //     "endDate",
// //     "status",
// //   ]);

// //   const isAllSelected = data.length > 0 && selectedRows.size === data.length;
// //   const selectedCount = selectedRows.size;
// //   const showEdit = selectedCount === 1;
// //   const showDelete = selectedCount >= 1;

// //   useEffect(() => {
// //     if (searchTerm) handleSearch();
// //   }, [searchTerm]);

// //   // 2. Map labels for your new columns
// //   const COLUMN_LABELS = {
// //     businessBudgetId: "ID",
// //     description: "Description",
// //     stage: "Stage",

// //     contractValue: "Contract Value",
// //     contractTypes: "Contract Types",
// //     pwinValue: "Pwin Value",
// //     revenue: "Revenue", // ⭐ Added label

// //     // isActive: "Active",
// //     // version: "Version",
// //     // versionCode: "Version Code",
// //     startDate: "Start Date",
// //     endDate: "End Date",
// //     orgId: "Org ID",
// //     // accountGroup: "Account Group",
// //     customer: "Customer",
// //     onsiteLaborPercent: "Subcontractor(%)",
// //     subcontractorAmt: "Subcontractor($)", // ⭐ Added label
// //     offSiteLaborPercent: "Direct Labor(%)",
// //     directLaborAmt: "Direct Labor($)", // ⭐ Added label
// //     nonLaborPercent: "ODCs(%)",
// //     odcAmt: "ODCs($)", // ⭐ Added label
// //     status: "Status",
// //   };

// //   const formatWithCommas = (val) => {
// //     if (val === null || val === undefined || val === "") return "";
// //     const parts = val.toString().split(".");
// //     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// //     return parts.join(".");
// //   };

// //   const handleKeyPress = (e) => {
// //     if (e.key === "Enter") handleSearch();
// //   };

// //   const handleSearch = async () => {
// //     const term = searchTerm.trim();
// //     try {
// //       setShowNewBusinessPopup(false);
// //       setEditNewBusinessPopup(false);
// //       setIsLoading(true);

// //       const res = term
// //         ? await axios.get(`${backendUrl}/GetAllNewBusinessById/${term}`)
// //         : await axios.get(`${backendUrl}/GetAllNewBusiness`);

// //       setData(res.data || []);
// //       setSelectedRows(new Set());
// //       setSelectedBusiness(null);
// //     } catch (error) {
// //       console.log(error);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const toggleRow = (item) => {
// //     setSelectedRows((prev) => {
// //       const newSet = new Set(prev);
// //       if (newSet.has(item.businessBudgetId)) {
// //         newSet.delete(item.businessBudgetId);
// //       } else {
// //         newSet.add(item.businessBudgetId);
// //       }

// //       if (newSet.size === 1) {
// //         const id = [...newSet][0];
// //         setSelectedBusiness(
// //           data.find((d) => d.businessBudgetId === id) || null,
// //         );
// //       } else {
// //         setSelectedBusiness(null);
// //       }
// //       return newSet;
// //     });
// //   };

// //   const toggleSelectAll = () => {
// //     if (isAllSelected) {
// //       setSelectedRows(new Set());
// //       setSelectedBusiness(null);
// //     } else {
// //       const allIds = new Set(data.map((d) => d.businessBudgetId));
// //       setSelectedRows(allIds);
// //       setSelectedBusiness(null);
// //     }
// //   };

// //   const handleDelete = async () => {
// //     setIsDeleting(true);
// //     try {
// //       const selectedRowsToDelete = [...selectedRows];
// //       await axios.post(
// //         `${backendUrl}/BulkDeleteNewBusiness`, // Make sure this endpoint matches your server route
// //         selectedRowsToDelete,
// //       );
// //       toast.success("Business Deleted Successfully!");
// //       handleSearch();
// //     } catch (error) {
// //       console.error("Delete Error:", error);

// //       // Extract message from API response (e.g., 404 / 400 error payloads)
// //       const errorMessage =
// //         error.response?.data?.message ||
// //         (typeof error.response?.data === "string"
// //           ? error.response.data
// //           : null) ||
// //         "Project plans exist. Please delete them first.";

// //       toast.error(errorMessage);
// //     } finally {
// //       setIsDeleting(false);
// //     }
// //   };

// //   const handleEdit = (item) => {
// //     setSelectedBusiness(item);
// //     setEditNewBusinessPopup(true);
// //   };

// //   const handleNewBusinessSave = async () => {
// //     handleSearch();
// //     setShowNewBusinessPopup(false);
// //     setEditNewBusinessPopup(false);
// //   };

// //   return (
// //     <div className="p-1 sm:p-2 space-y-2 text-sm sm:text-base text-gray-800 font-inter">
// //       <div className="flex flex-col gap-2 ">
// //         <div className="flex items-center gap-2 bg-white rounded-sm p-4">
// //           <BriefcaseBusiness size={20} className="text-blue-600" />
// //           <h2 className="text-lg font-bold text-gray-800">
// //             {title || "Manage New Business"}
// //           </h2>
// //         </div>

// //         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 relative w-full sm:w-auto">
// //           <label className="input-label">Busniess ID:</label>
// //           <div className="relative w-full sm:w-64">
// //             <input
// //               type="text"
// //               className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-full"
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               onKeyDown={handleKeyPress}
// //               autoComplete="off"
// //             />
// //           </div>
// //           <button
// //             onClick={handleSearch}
// //             className="btn1 btn-blue cursor-pointer"
// //           >
// //             Search
// //           </button>
// //         </div>
// //       </div>

// //       <div className="space-y-4 sm:p-4 rounded p-2 bg-white mb-1">
// //         <div className="flex items-center mb-2 gap-1 w-full flex-nowrap">
// //           {!editNewBusinessPopup && isEditable && (
// //             <button
// //               onClick={() => setShowNewBusinessPopup(true)}
// //               className="btn1 btn-blue shrink-0"
// //             >
// //               New Business
// //             </button>
// //           )}
// //           <div
// //             className={`flex gap-1 w-full items-center ${showDelete ? "inline" : "hidden"}`}
// //           >
// //             {dataItem.length < 2 && isEditable && (
// //               <button
// //                 className="btn1 btn-blue mr-2"
// //                 title="Edit"
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   handleEdit(dataItem[0]);
// //                 }}
// //                 disabled={!showEdit || showNewBusinessPopup}
// //               >
// //                 Edit
// //               </button>
// //             )}
// //             {isEditable && (
// //               <button
// //                 onClick={handleDelete}
// //                 className="btn1 px-4 py-1.5 btn-red"
// //                 title="Delete"
// //                 disabled={
// //                   editNewBusinessPopup || showNewBusinessPopup || isDeleting
// //                 }
// //               >
// //                 {isDeleting ? "Deleting..." : `Delete (${selectedRows.size})`}
// //               </button>
// //             )}
// //           </div>
// //         </div>

// //         <div className="rounded border border-gray-200 overflow-hidden relative">
// //           {showNewBusinessPopup && isEditable && (
// //             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
// //               <div className="absolute inset-0 bg-black/40"></div>
// //               <div className="relative top-8 bg-white w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col animate-premium-popup shadow-2xl rounded">
// //                 <div className="overflow-y-auto p-4 custom-scrollbar">
// //                   <NewBusiness
// //                     mode={"business"}
// //                     onClose={() => setShowNewBusinessPopup(false)}
// //                     selectedBusiness={null}
// //                     setDataItem={setDataItem}
// //                     onSaveSuccess={handleNewBusinessSave}
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {editNewBusinessPopup && isEditable && (
// //             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
// //               <div className="absolute inset-0 bg-black/40"></div>
// //               <div className="relative top-8 bg-white w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col animate-premium-popup shadow-2xl rounded">
// //                 <div className="overflow-y-auto p-4 custom-scrollbar">
// //                   <NewBusiness
// //                     mode={"business"}
// //                     onClose={() => setEditNewBusinessPopup(false)}
// //                     selectedBusiness={selectedBusiness}
// //                     setDataItem={setDataItem}
// //                     onSaveSuccess={handleNewBusinessSave}
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           <div
// //             className={`overflow-x-auto max-h-[70vh] min-h-[70vh] ${showNewBusinessPopup ? "pointer-events-none" : ""}`}
// //           >
// //             <table className="min-w-full table-auto divide-gray-200">
// //               <thead className="bg-gray-200 sticky top-0">
// //                 <tr>
// //                   {isEditable && (
// //                     <th className="th-thead w-10">
// //                       <input
// //                         type="checkbox"
// //                         checked={isAllSelected}
// //                         onChange={toggleSelectAll}
// //                       />
// //                     </th>
// //                   )}
// //                   {columns.map((col) => (
// //                     <th
// //                       key={col}
// //                       className="th-thead text-xs font-bold text-gray-600 text-center"
// //                     >
// //                       {COLUMN_LABELS[col] || col}
// //                     </th>
// //                   ))}
// //                 </tr>
// //               </thead>

// //               <tbody className="bg-white divide-y divide-gray-100">
// //                 {isLoading ? (
// //                   <tr>
// //                     <td colSpan={columns.length}>
// //                       <div className="flex items-center justify-center py-2">
// //                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// //                         <span className="ml-2 mt-4">
// //                           Loading project plans...
// //                         </span>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ) : isDeleting ? (
// //                   <tr>
// //                     <td colSpan={columns.length}>
// //                       <div className="flex items-center justify-center py-2">
// //                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// //                         <span className="ml-2 mt-4">Deleting.....</span>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ) : data.length === 0 && searchTerm.trim() === "" ? (
// //                   <tr>
// //                     <td colSpan={columns.length + 1}>
// //                       <div className="p-8 text-center text-gray-500 text-lg">
// //                         Search and select a valid Project to view details
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   data.map((item) => {
// //                     // 3. Pre-calculate calculations row by row safely
// //                     const contractValue = Number(item.contractValue) || 0;
// //                     const pwinPercent = Number(item.pwinValue) || 0;
// //                     const revenueAmt = contractValue * (pwinPercent / 100);

// //                     const subPercent = Number(item.onsiteLaborPercent) || 0;
// //                     const directLaborPercent =
// //                       Number(item.offSiteLaborPercent) || 0;
// //                     const odcPercent = Number(item.nonLaborPercent) || 0;

// //                     const subcontractorAmt = revenueAmt * (subPercent / 100);
// //                     const directLaborAmt =
// //                       revenueAmt * (directLaborPercent / 100);
// //                     const odcAmt = revenueAmt * (odcPercent / 100);

// //                     return (
// //                       <tr
// //                         key={item.businessBudgetId}
// //                         onDoubleClick={() => handleEdit(item)}
// //                         className={`cursor-pointer hover:bg-blue-50 ${
// //                           selectedRows.has(item.businessBudgetId)
// //                             ? "bg-blue-200"
// //                             : "bg-white"
// //                         }`}
// //                       >
// //                         {isEditable && (
// //                           <td className="tbody-td-fun">
// //                             <input
// //                               type="checkbox"
// //                               checked={selectedRows.has(item.businessBudgetId)}
// //                               onChange={(e) => {
// //                                 e.stopPropagation();
// //                                 const isChecked = e.target.checked;
// //                                 toggleRow(item);
// //                                 setDataItem((prev) =>
// //                                   isChecked
// //                                     ? [...prev, item]
// //                                     : prev.filter(
// //                                         (i) =>
// //                                           i.businessBudgetId !==
// //                                           item.businessBudgetId,
// //                                       ),
// //                                 );
// //                               }}
// //                             />
// //                           </td>
// //                         )}

// //                         {columns.map((col, idx) => {
// //                           // Determine Alignment for styling
// //                           const isNumericField = [
// //                             "contractValue",
// //                             "revenue",
// //                             "subcontractorAmt",
// //                             "directLaborAmt",
// //                             "odcAmt",
// //                           ].includes(col);

// //                           return (
// //                             <td
// //                               key={idx}
// //                               className={`px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 ${
// //                                 col === "description"
// //                                   ? "text-left min-w-[300px] break-words"
// //                                   : isNumericField
// //                                     ? "text-right whitespace-nowrap"
// //                                     : "text-center"
// //                               } ${
// //                                 [
// //                                   "startDate",
// //                                   "endDate",
// //                                   "trf_ProjId",
// //                                   "businessBudgetId",
// //                                   "stage",
// //                                 ].includes(col)
// //                                   ? "whitespace-nowrap"
// //                                   : ""
// //                               }`}
// //                             >
// //                               {col === "startDate" || col === "endDate" ? (
// //                                 item[col]?.split("T")[0]
// //                               ) : col === "contractValue" ? (
// //                                 formatWithCommas(item[col])
// //                               ) : col === "pwinValue" ? (
// //                                 `${(item[col] ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%`
// //                               ) : col === "revenue" ? (
// //                                 formatWithCommas(revenueAmt.toFixed(2))
// //                               ) : col === "subcontractorAmt" ? (
// //                                 formatWithCommas(subcontractorAmt.toFixed(2))
// //                               ) : col === "directLaborAmt" ? (
// //                                 formatWithCommas(directLaborAmt.toFixed(2))
// //                               ) : col === "odcAmt" ? (
// //                                 formatWithCommas(odcAmt.toFixed(2))
// //                               ) : col === "onsiteLaborPercent" ||
// //                                 col === "offSiteLaborPercent" ||
// //                                 col === "nonLaborPercent" ? (
// //                                 item[col] !== null &&
// //                                 item[col] !== undefined &&
// //                                 item[col] !== "" ? (
// //                                   `${item[col]}%`
// //                                 ) : (
// //                                   ""
// //                                 )
// //                               ) : col === "isActive" ? (
// //                                 <input
// //                                   type="checkbox"
// //                                   checked={!!item[col]}
// //                                   readOnly
// //                                   className="h-3 w-3 accent-blue-600 cursor-default"
// //                                 />
// //                               ) : (
// //                                 item[col]
// //                               )}
// //                             </td>
// //                           );
// //                         })}
// //                       </tr>
// //                     );
// //                   })
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default NewBusinessComponent;

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { backendUrl } from "./config";
// import NewBusiness from "./NewBusiness";
// import { toast } from "react-toastify";
// import { BriefcaseBusiness, Plus, Copy, Save, X } from "lucide-react";
// import { useOutletContext } from "react-router-dom";

// const NewBusinessComponent = ({ title }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showNewBusinessPopup, setShowNewBusinessPopup] = useState(false);
//   const [editNewBusinessPopup, setEditNewBusinessPopup] = useState(false);
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [dataItem, setDataItem] = useState([]);

//   const [selectedBusiness, setSelectedBusiness] = useState(null);
//   const [selectedRows, setSelectedRows] = useState(new Set());

//   // Multi-row inline editing state (Array of rows to support bulk paste & copy)
//   const [inlineRows, setInlineRows] = useState([]);
//   const [orgOptions, setOrgOptions] = useState([]);
//   const [accountGroupOptions, setAccountGroupOptions] = useState([]);
//   const [revFormulaOptions, setRevFormulaOptions] = useState([]);

//   const { canEdit } = useOutletContext();
//   const isEditable = canEdit("manageNewBusiness");

//   const [columns] = useState([
//     "businessBudgetId",
//     "description",
//     "stage",
//     "contractValue",
//     "contractTypes",
//     "pwinValue",
//     "revenue",
//     "orgId",
//     "customer",
//     "onsiteLaborPercent",
//     "subcontractorAmt",
//     "offSiteLaborPercent",
//     "directLaborAmt",
//     "nonLaborPercent",
//     "odcAmt",
//     "startDate",
//     "endDate",
//     "status",
//   ]);

//   const isAllSelected = data.length > 0 && selectedRows.size === data.length;
//   const selectedCount = selectedRows.size;
//   const showEdit = selectedCount === 1;
//   const showDelete = selectedCount >= 1;

//   useEffect(() => {
//     if (searchTerm) handleSearch();
//   }, [searchTerm]);

//   useEffect(() => {
//     const fetchLookupData = async () => {
//       try {
//         const [orgRes, accRes, revFormulaRes] = await Promise.all([
//           axios.get(`${backendUrl}/Orgnization/GetAllOrgs`),
//           axios.get(`${backendUrl}/Project/GetAccountGroupCodes`),
//           axios.get(`${backendUrl}/RevFormula`),
//         ]);
//         setOrgOptions(orgRes.data || []);
//         setAccountGroupOptions(accRes.data || []);
//         if (revFormulaRes.data && Array.isArray(revFormulaRes.data)) {
//           setRevFormulaOptions(
//             revFormulaRes.data.map((item) => ({
//               label: `${item.formulaDesc} (${item.formulaCd})`,
//               value: item.formulaCd,
//             })),
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching dropdown options", error);
//       }
//     };
//     fetchLookupData();
//   }, []);

//   const COLUMN_LABELS = {
//     businessBudgetId: "ID",
//     description: "Description",
//     stage: "Stage",
//     contractValue: "Contract Value",
//     contractTypes: "Contract Types",
//     pwinValue: "Pwin Value",
//     revenue: "Revenue",
//     startDate: "Start Date",
//     endDate: "End Date",
//     orgId: "Org ID",
//     customer: "Customer",
//     onsiteLaborPercent: "Subcontractor(%)",
//     subcontractorAmt: "Subcontractor($)",
//     offSiteLaborPercent: "Direct Labor(%)",
//     directLaborAmt: "Direct Labor($)",
//     nonLaborPercent: "ODCs(%)",
//     odcAmt: "ODCs($)",
//     status: "Status",
//   };

//   const stageOptions = [
//     { label: "01 - Planning", value: "PLANNING" },
//     { label: "02 - Positioning", value: "POSTIONING" },
//     { label: "03 - Pursuing", value: "PURUING" },
//     { label: "04 - Proposal", value: "PROPOSAL" },
//     { label: "05 - Post Submit", value: "POSTSUBMIT" },
//     { label: "06 - Won", value: "WIN" },
//     { label: "07 - Lost", value: "LOSS" },
//     { label: "08 - Canceled", value: "CANCELED" },
//     { label: "09 - No Bid", value: "NOBID9" },
//     { label: "10 - Postponed", value: "POSTPON10" },
//     { label: "Lead", value: "LEAD" },
//     { label: "Qualified", value: "QUAL" },
//     { label: "Capture", value: "CAPTURE" },
//     { label: "Proposal Prep", value: "PROPPREP" },
//     { label: "Proposal Submitted", value: "PROPSUB" },
//     { label: "Negotiation", value: "NEGOTIATE" },
//     { label: "Identification", value: "IDENT" },
//     { label: "Won", value: "WON" },
//     { label: "Lost", value: "LOST" },
//     { label: "Cancel", value: "CANCEL" },
//     { label: "No Bid", value: "NOBID" },
//     { label: "Postponed", value: "POSTPONED" },
//     { label: "Review", value: "REVIEW" },
//     { label: "In Protest", value: "PROTEST" },
//   ];

//   const formatWithCommas = (val) => {
//     if (val === null || val === undefined || val === "") return "";
//     const parts = val.toString().split(".");
//     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     return parts.join(".");
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") handleSearch();
//   };

//   const handleSearch = async () => {
//     const term = searchTerm.trim();
//     try {
//       setShowNewBusinessPopup(false);
//       setEditNewBusinessPopup(false);
//       setIsLoading(true);

//       const res = term
//         ? await axios.get(`${backendUrl}/GetAllNewBusinessById/${term}`)
//         : await axios.get(`${backendUrl}/GetAllNewBusiness`);

//       setData(res.data || []);
//       setSelectedRows(new Set());
//       setSelectedBusiness(null);
//       setInlineRows([]);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleRow = (item) => {
//     setSelectedRows((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(item.businessBudgetId)) {
//         newSet.delete(item.businessBudgetId);
//       } else {
//         newSet.add(item.businessBudgetId);
//       }

//       if (newSet.size === 1) {
//         const id = [...newSet][0];
//         setSelectedBusiness(
//           data.find((d) => d.businessBudgetId === id) || null,
//         );
//       } else {
//         setSelectedBusiness(null);
//       }
//       return newSet;
//     });
//   };

//   const toggleSelectAll = () => {
//     if (isAllSelected) {
//       setSelectedRows(new Set());
//       setSelectedBusiness(null);
//     } else {
//       const allIds = new Set(data.map((d) => d.businessBudgetId));
//       setSelectedRows(allIds);
//       setSelectedBusiness(null);
//     }
//   };

//   const handleDelete = async () => {
//     setIsDeleting(true);
//     try {
//       const selectedRowsToDelete = [...selectedRows];
//       await axios.post(
//         `${backendUrl}/BulkDeleteNewBusiness`,
//         selectedRowsToDelete,
//       );
//       toast.success("Business Deleted Successfully!");
//       handleSearch();
//     } catch (error) {
//       console.error("Delete Error:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         (typeof error.response?.data === "string"
//           ? error.response.data
//           : null) ||
//         "Project plans exist. Please delete them first.";
//       toast.error(errorMessage);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleEdit = (item) => {
//     setSelectedBusiness(item);
//     setEditNewBusinessPopup(true);
//   };

//   const handleNewBusinessSave = async () => {
//     handleSearch();
//     setShowNewBusinessPopup(false);
//     setEditNewBusinessPopup(false);
//   };

//   // --- Inline Dynamic Handlers ---
//   const createBlankRow = () => ({
//     tempId: Date.now() + Math.random(),
//     businessBudgetId: "",
//     description: "",
//     stage: "PLANNING",
//     contractValue: 0,
//     contractTypes: revFormulaOptions[0]?.value || "",
//     pwinValue: 100,
//     orgId: orgOptions[0]?.orgId || "",
//     customer: "",
//     onsiteLaborPercent: 40,
//     offSiteLaborPercent: 40,
//     nonLaborPercent: 20,
//     startDate: new Date().toISOString().split("T")[0],
//     endDate: new Date().toISOString().split("T")[0],
//     status: "In Progress",
//     accountGroup: accountGroupOptions[0] || "DIR",
//     burdenTemplateId: 2,
//     ourRole: "prime",
//     level: 1,
//     version: 1,
//     versionCode: "V1",
//     escalationRate: 0,
//   });

//   const handleAddNewRow = () => {
//     setInlineRows((prev) => [createBlankRow(), ...prev]);
//   };

//   // Copy checked rows directly into inline creation rows
//   const handleCopySelectedRows = () => {
//     if (selectedRows.size === 0) {
//       toast.info("Please select at least one row using checkboxes to copy.");
//       return;
//     }

//     const copiedRows = data
//       .filter((d) => selectedRows.has(d.businessBudgetId))
//       .map((sourceObj) => ({
//         tempId: Date.now() + Math.random(),
//         businessBudgetId: "", // Empty so user inputs new unique ID
//         description: sourceObj.description
//           ? `${sourceObj.description} (Copy)`
//           : "",
//         stage: sourceObj.stage || "PLANNING",
//         contractValue: sourceObj.contractValue || 0,
//         contractTypes:
//           sourceObj.contractTypes || revFormulaOptions[0]?.value || "",
//         pwinValue: sourceObj.pwinValue || 100,
//         orgId: sourceObj.orgId || orgOptions[0]?.orgId || "",
//         customer: sourceObj.customer || "",
//         onsiteLaborPercent: sourceObj.onsiteLaborPercent || 40,
//         offSiteLaborPercent: sourceObj.offSiteLaborPercent || 40,
//         nonLaborPercent: sourceObj.nonLaborPercent || 20,
//         startDate: sourceObj.startDate
//           ? sourceObj.startDate.split("T")[0]
//           : new Date().toISOString().split("T")[0],
//         endDate: sourceObj.endDate
//           ? sourceObj.endDate.split("T")[0]
//           : new Date().toISOString().split("T")[0],
//         status: sourceObj.status || "In Progress",
//         accountGroup: sourceObj.accountGroup || accountGroupOptions[0] || "DIR",
//         burdenTemplateId: sourceObj.burdenTemplateId || 2,
//         ourRole: sourceObj.ourRole || "prime",
//         level: sourceObj.level || 1,
//         version: sourceObj.version || 1,
//         versionCode: sourceObj.versionCode || "V1",
//         escalationRate: sourceObj.escalationRate || 0,
//       }));

//     setInlineRows((prev) => [...copiedRows, ...prev]);
//     toast.info(
//       `Copied ${copiedRows.length} row(s). Enter unique IDs and click 'Save All New Rows'.`,
//     );
//   };

//   const handleInlineInputChange = (tempId, field, value) => {
//     setInlineRows((prev) =>
//       prev.map((row) =>
//         row.tempId === tempId ? { ...row, [field]: value } : row,
//       ),
//     );
//   };

//   const handleRemoveInlineRow = (tempId) => {
//     setInlineRows((prev) => prev.filter((r) => r.tempId !== tempId));
//   };

//   // --- Loop through all dynamic inline rows and save sequentially ---
//   const handleSaveAllInlineRows = async () => {
//     if (inlineRows.length === 0) return;

//     // Validation Check
//     for (let i = 0; i < inlineRows.length; i++) {
//       const row = inlineRows[i];
//       if (
//         !row.businessBudgetId ||
//         !row.description ||
//         !row.startDate ||
//         !row.endDate ||
//         !row.orgId ||
//         !row.contractTypes
//       ) {
//         toast.error(`Please fill all required fields for row #${i + 1}.`);
//         return;
//       }

//       // Ensure Unique ID within database
//       if (data.some((d) => d.businessBudgetId === row.businessBudgetId)) {
//         toast.error(
//           `Business ID '${row.businessBudgetId}' already exists. Please use unique IDs.`,
//         );
//         return;
//       }
//     }

//     // Check unique ID among inline items themselves
//     const idSet = new Set(inlineRows.map((r) => r.businessBudgetId));
//     if (idSet.size !== inlineRows.length) {
//       toast.error(
//         "Duplicate Business Budget IDs found in new rows. Each ID must be unique.",
//       );
//       return;
//     }

//     setIsSaving(true);
//     const shortDate = new Date().toISOString().split("T")[0];
//     let savedCount = 0;

//     try {
//       // Loop execution over every added row
//       for (const row of inlineRows) {
//         const contractValue = Number(row.contractValue) || 0;
//         const pwinPercent = Number(row.pwinValue) || 0;
//         const calculatedRevenue = contractValue * (pwinPercent / 100);

//         const businessPayload = {
//           businessBudgetId: row.businessBudgetId,
//           description: row.description,
//           level: parseInt(row.level) || 1,
//           isActive: true,
//           version: parseInt(row.version) || 1,
//           versionCode: row.versionCode || "V1",
//           winningProbability: parseFloat(row.pwinValue) || 100,
//           contractValue: parseFloat(row.contractValue) || 0,
//           contractTypes: String(row.contractTypes || ""),
//           startDate: row.startDate
//             ? `${row.startDate.split("T")[0]}T00:00:00`
//             : "0001-01-01T00:00:00",
//           endDate: row.endDate
//             ? `${row.endDate.split("T")[0]}T00:00:00`
//             : "0001-01-01T00:00:00",
//           escalationRate: parseFloat(row.escalationRate) || 0,
//           orgId: row.orgId || "",
//           accountGroup: row.accountGroup || "DIR",
//           burdenTemplateId: parseInt(row.burdenTemplateId) || 2,
//           modifiedBy: "admin",
//           pgoCalculation: 0,
//           pwinValue: parseFloat(row.pwinValue) || 100,
//           type: "NBBUD",
//           ourRole: row.ourRole || "prime",
//           workshare: 100,
//           trf_ProjId: row.businessBudgetId,
//           status: row.status || "In Progress",
//           nbType: "NBBUD",
//           revenue: calculatedRevenue,
//           sector: "",
//           businessUnit: "",
//           customer: row.customer || "",
//           stage: row.stage || "",
//           transitionPeriod: 0,
//           forecastCategory: "pipeline",
//           offSiteLaborPercent: parseFloat(row.offSiteLaborPercent) || 0,
//           onsiteLaborPercent: parseFloat(row.onsiteLaborPercent) || 0,
//           nonLaborPercent: parseFloat(row.nonLaborPercent) || 0,
//           spreadDuration: 0,
//         };

//         const projectPayload = {
//           projId: row.businessBudgetId,
//           plId: 0,
//           plType: "NBBUD",
//           source: "",
//           type: "A",
//           version: parseInt(row.version) || 1,
//           versionCode: row.versionCode || "V1",
//           finalVersion: false,
//           isCompleted: false,
//           isApproved: false,
//           status: "In Progress",
//           createdBy: "User",
//           modifiedBy: "User",
//           approvedBy: "",
//           templateId: parseInt(row.burdenTemplateId) || 2,
//           projStartDt: row.startDate ? row.startDate.split("T")[0] : shortDate,
//           projEndDt: row.endDate ? row.endDate.split("T")[0] : "2078-01-01",
//           revenue: calculatedRevenue,
//           sector: "",
//           businessUnit: "",
//           stage: row.stage || "",
//           forecastCategory: "pipeline",
//           revenueFormula: String(row.contractTypes || ""),
//         };

//         await axios.post(`${backendUrl}/AddNewBusiness`, businessPayload, {
//           headers: { "Content-Type": "application/json" },
//         });
//         await axios.post(
//           `${backendUrl}/Project/AddProjectPlan`,
//           projectPayload,
//           {
//             headers: { "Content-Type": "application/json" },
//           },
//         );

//         savedCount++;
//       }

//       toast.success(`Successfully added ${savedCount} business record(s)!`);
//       setInlineRows([]);
//       handleSearch();
//     } catch (error) {
//       console.error("Error saving inline loop rows:", error);
//       toast.error(
//         `Saved ${savedCount} row(s) before encountered error. Please check remaining rows.`,
//       );
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // --- Support Pasting Multiple Rows (e.g. 2 or more Excel rows) ---
//   const handlePasteExcel = (e) => {
//     const clipboardData = e.clipboardData.getData("text");
//     if (!clipboardData) return;

//     const lines = clipboardData.trim().split(/\r\n|\n/);
//     if (lines.length > 0 && lines[0].includes("\t")) {
//       e.preventDefault();

//       const newParsedRows = lines.map((line) => {
//         const cells = line.split("\t");
//         return {
//           tempId: Date.now() + Math.random(),
//           businessBudgetId: cells[0] ? cells[0].trim() : "",
//           description: cells[1] ? cells[1].trim() : "",
//           stage: cells[2] ? cells[2].trim() : "PLANNING",
//           contractValue: cells[3]
//             ? parseFloat(cells[3].replace(/,/g, "")) || 0
//             : 0,
//           contractTypes: cells[4]
//             ? cells[4].trim()
//             : revFormulaOptions[0]?.value || "",
//           pwinValue: cells[5] ? parseFloat(cells[5]) || 100 : 100,
//           orgId: cells[6] ? cells[6].trim() : orgOptions[0]?.orgId || "",
//           customer: cells[7] ? cells[7].trim() : "",
//           onsiteLaborPercent: cells[8] ? parseFloat(cells[8]) || 0 : 40,
//           offSiteLaborPercent: cells[9] ? parseFloat(cells[9]) || 0 : 40,
//           nonLaborPercent: cells[10] ? parseFloat(cells[10]) || 0 : 20,
//           startDate: cells[11]
//             ? cells[11].trim()
//             : new Date().toISOString().split("T")[0],
//           endDate: cells[12]
//             ? cells[12].trim()
//             : new Date().toISOString().split("T")[0],
//           status: "In Progress",
//           accountGroup: accountGroupOptions[0] || "DIR",
//           burdenTemplateId: 2,
//           ourRole: "prime",
//           level: 1,
//           version: 1,
//           versionCode: "V1",
//           escalationRate: 0,
//         };
//       });

//       setInlineRows((prev) => [...newParsedRows, ...prev]);
//       toast.success(
//         `Pasted ${newParsedRows.length} row(s) into editable top area!`,
//       );
//     }
//   };

//   return (
//     <div
//       className="p-1 sm:p-2 space-y-2 text-sm sm:text-base text-gray-800 font-inter"
//       onPaste={handlePasteExcel}
//     >
//       <div className="flex flex-col gap-2 ">
//         <div className="flex items-center gap-2 bg-white rounded-sm p-4">
//           <BriefcaseBusiness size={20} className="text-blue-600" />
//           <h2 className="text-lg font-bold text-gray-800">
//             {title || "Manage New Business"}
//           </h2>
//         </div>

//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 relative w-full sm:w-auto">
//           <label className="input-label">Business ID:</label>
//           <div className="relative w-full sm:w-64">
//             <input
//               type="text"
//               className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-full"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               onKeyDown={handleKeyPress}
//               autoComplete="off"
//             />
//           </div>
//           <button
//             onClick={handleSearch}
//             className="btn1 btn-blue cursor-pointer"
//           >
//             Search
//           </button>
//         </div>
//       </div>

//       <div className="space-y-4 sm:p-4 rounded p-2 bg-white mb-1">
//         <div className="flex items-center mb-2 gap-2 w-full flex-wrap">
//           {isEditable && (
//             <>
//               <button
//                 onClick={handleAddNewRow}
//                 className="btn1 btn-blue shrink-0 flex items-center gap-1"
//               >
//                 <Plus size={16} /> New Row
//               </button>

//               <button
//                 onClick={handleCopySelectedRows}
//                 disabled={selectedRows.size === 0}
//                 className="btn1 btn-blue shrink-0 flex items-center gap-1 disabled:opacity-50"
//                 title="Copy Checked Rows"
//               >
//                 <Copy size={16} /> Copy Selected ({selectedRows.size})
//               </button>

//               {inlineRows.length > 0 && (
//                 <button
//                   onClick={handleSaveAllInlineRows}
//                   disabled={isSaving}
//                   className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-green-700 flex items-center gap-1"
//                 >
//                   <Save size={16} />{" "}
//                   {isSaving
//                     ? "Saving Loop..."
//                     : `Save All New Rows (${inlineRows.length})`}
//                 </button>
//               )}
//             </>
//           )}

//           <div
//             className={`flex gap-1 items-center ${showDelete ? "inline" : "hidden"}`}
//           >
//             {dataItem.length < 2 && isEditable && (
//               <button
//                 className="btn1 btn-blue mr-2"
//                 title="Edit"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleEdit(dataItem[0]);
//                 }}
//                 disabled={!showEdit || showNewBusinessPopup}
//               >
//                 Edit
//               </button>
//             )}
//             {isEditable && (
//               <button
//                 onClick={handleDelete}
//                 className="btn1 px-4 py-1.5 btn-red"
//                 title="Delete"
//                 disabled={
//                   editNewBusinessPopup || showNewBusinessPopup || isDeleting
//                 }
//               >
//                 {isDeleting ? "Deleting..." : `Delete (${selectedRows.size})`}
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="rounded border border-gray-200 overflow-hidden relative">
//           {showNewBusinessPopup && isEditable && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <div className="absolute inset-0 bg-black/40"></div>
//               <div className="relative top-8 bg-white w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col animate-premium-popup shadow-2xl rounded">
//                 <div className="overflow-y-auto p-4 custom-scrollbar">
//                   <NewBusiness
//                     mode={"business"}
//                     onClose={() => setShowNewBusinessPopup(false)}
//                     selectedBusiness={null}
//                     setDataItem={setDataItem}
//                     onSaveSuccess={handleNewBusinessSave}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {editNewBusinessPopup && isEditable && (
//             <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <div className="absolute inset-0 bg-black/40"></div>
//               <div className="relative top-8 bg-white w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col animate-premium-popup shadow-2xl rounded">
//                 <div className="overflow-y-auto p-4 custom-scrollbar">
//                   <NewBusiness
//                     mode={"business"}
//                     onClose={() => setEditNewBusinessPopup(false)}
//                     selectedBusiness={selectedBusiness}
//                     setDataItem={setDataItem}
//                     onSaveSuccess={handleNewBusinessSave}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           <div
//             className={`overflow-x-auto max-h-[70vh] min-h-[70vh] ${showNewBusinessPopup ? "pointer-events-none" : ""}`}
//           >
//             <table className="min-w-full table-auto divide-gray-200">
//               <thead className="bg-gray-200 sticky top-0 z-10">
//                 <tr>
//                   {isEditable && (
//                     <th className="th-thead w-10">
//                       <input
//                         type="checkbox"
//                         checked={isAllSelected}
//                         onChange={toggleSelectAll}
//                       />
//                     </th>
//                   )}
//                   {columns.map((col) => (
//                     <th
//                       key={col}
//                       className="th-thead text-xs font-bold text-gray-600 text-center"
//                     >
//                       {COLUMN_LABELS[col] || col}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody className="bg-white divide-y divide-gray-100">
//                 {/* Loop Rendering of all dynamic inline addition/copied rows on top */}
//                 {inlineRows.map((inlineRow) => {
//                   const inlineContractVal =
//                     Number(inlineRow.contractValue) || 0;
//                   const inlinePwin = Number(inlineRow.pwinValue) || 0;
//                   const inlineRevenue = inlineContractVal * (inlinePwin / 100);
//                   const inlineSubAmt =
//                     inlineRevenue *
//                     ((Number(inlineRow.onsiteLaborPercent) || 0) / 100);
//                   const inlineDirectAmt =
//                     inlineRevenue *
//                     ((Number(inlineRow.offSiteLaborPercent) || 0) / 100);
//                   const inlineOdcAmt =
//                     inlineRevenue *
//                     ((Number(inlineRow.nonLaborPercent) || 0) / 100);

//                   return (
//                     <tr
//                       key={inlineRow.tempId}
//                       className="bg-blue-50 border-b-2 border-blue-300"
//                     >
//                       {isEditable && (
//                         <td className="p-1 text-center">
//                           <button
//                             onClick={() =>
//                               handleRemoveInlineRow(inlineRow.tempId)
//                             }
//                             className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
//                             title="Discard Row"
//                           >
//                             <X size={12} />
//                           </button>
//                         </td>
//                       )}
//                       {/* Business ID */}
//                       <td className="p-1">
//                         <input
//                           type="text"
//                           placeholder="New ID *"
//                           className="w-24 border border-blue-400 rounded px-1.5 py-1 text-xs outline-none bg-white font-semibold"
//                           value={inlineRow.businessBudgetId}
//                           onChange={(e) =>
//                             handleInlineInputChange(
//                               inlineRow.tempId,
//                               "businessBudgetId",
//                               e.target.value,
//                             )
//                           }
//                         />
//                       </td>
//                       {/* Description */}
//                       <td className="p-1">
//                         <input
//                           type="text"
//                           placeholder="Description *"
//                           className="w-64 border rounded px-1.5 py-1 text-xs outline-none bg-white"
//                           value={inlineRow.description}
//                           onChange={(e) =>
//                             handleInlineInputChange(
//                               inlineRow.tempId,
//                               "description",
//                               e.target.value,
//                             )
//                           }
//                         />
//                       </td>
//                       {/* Stage */}
//                       <td className="p-1">
//                         <select
//                           className="w-32 border rounded px-1 py-1 text-xs outline-none bg-white"
//                           value={inlineRow.stage}
//                           onChange={(e) =>
//                             handleInlineInputChange(
//                               inlineRow.tempId,
//                               "stage",
//                               e.target.value,
//                             )
//                           }
//                         >
//                           {stageOptions.map((st) => (
//                             <option key={st.value} value={st.value}>
//                               {st.label}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                       {/* Contract Value */}
//                       <td className="p-1">
//                         <input
//                           type="number"
//                           className="w-28 border rounded px-1.5 py-1 text-xs text-right outline-none bg-white"
//                           value={inlineRow.contractValue}
//                           onChange={(e) =>
//                             handleInlineInputChange(
//                               inlineRow.tempId,
//                               "contractValue",
//                               e.target.value,
//                             )
//                           }
//                         />
//                       </td>
//                       {/* Contract Types */}
//                       <td className="p-1">
//                         <select
//                           className="w-36 border rounded px-1 py-1 text-xs outline-none bg-white"
//                           value={inlineRow.contractTypes}
//                           onChange={(e) =>
//                             handleInlineInputChange(
//                               inlineRow.tempId,
//                               "contractTypes",
//                               e.target.value,
//                             )
//                           }
//                         >
//                           {revFormulaOptions.map((rf) => (
//                             <option key={rf.value} value={rf.value}>
//                               {rf.label}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                       {/* Pwin Value */}
//                       <td className="p-1">
//                         <input
//                           type="number"
//                           className="w-16 border rounded px-1.5 py-1 text-xs text-right outline-none bg-white"
//                           value={inlineRow.pwinValue}
//                           onChange={(e) =>
//                             handleInlineInputChange(
//                               inlineRow.tempId,
//                               "pwinValue",
//                               e.target.value,
//                             )
//                           }
//                         />
//                       </td>
//                       {/* Revenue */}
//                       <td className="p-1 text-right text-xs font-semibold px-2">
//                         {formatWithCommas(inlineRevenue.toFixed(2))}
//                       </td>
//                       {/* Org ID */}
//                       <td className="p-1">
//                         <select
//                           className="w-36 border rounded px-1 py-1 text-xs outline-none bg-white"
//                           value={inlineRow.orgId}
//                           onChange={(e) =>
//                             handleInlineInputChange(
//                               inlineRow.tempId,
//                               "orgId",
//                               e.target.value,
//                             )
//                           }
//                         >
//                           {orgOptions.map((org) => (
//                             <option key={org.orgId} value={org.orgId}>
//                               {org.orgId} - {org.orgName}
//                             </option>
//                           ))}
//                         </select>
//                       </td>
//                       {/* Customer */}
//                       <td className="p-1">
//                         <input
//                           type="text"
//                           placeholder="Customer"
//                           className="w-28 border rounded px-1.5 py-1 text-xs outline-none bg-white"
//                           value={inlineRow.customer}
//                           onChange={(e) =>
//                             handleInlineInputChange(
//                               inlineRow.tempId,
//                               "customer",
//                               e.target.value,
//                             )
//                           }
//                         />
//                       </td>
//                       {/* Subcontractor (%) */}
//                       <td className="p-1">
//                         <input
//                           type="number"
//                           className="w-16 border rounded px-1.5 py-1 text-xs text-right outline-none bg-white"
//                           value={inlineRow.onsiteLaborPercent}
//                           onChange={(e) =>
//                             handleInlineInputChange(
//                               inlineRow.tempId,
//                               "onsiteLaborPercent",
//                               e.target.value,
//                             )
//                           }
//                         />
//                       </td>
//                       {/* Subcontractor ($) */}
//                       <td className="p-1 text-right text-xs font-semibold px-2">
//                         {formatWithCommas(inlineSubAmt.toFixed(2))}
//                       </td>
//                       {/* Direct Labor (%) */}
//                       <td className="p-1">
//                         <input
//                           type="number"
//                           className="w-16 border rounded px-1.5 py-1 text-xs text-right outline-none bg-white"
//                           value={inlineRow.offSiteLaborPercent}
//                           onChange={(e) =>
//                             handleInlineInputChange(
//                               inlineRow.tempId,
//                               "offSiteLaborPercent",
//                               e.target.value,
//                             )
//                           }
//                         />
//                       </td>
//                       {/* Direct Labor ($) */}
//                       <td className="p-1 text-right text-xs font-semibold px-2">
//                         {formatWithCommas(inlineDirectAmt.toFixed(2))}
//                       </td>
//                       {/* ODCs (%) */}
//                       <td className="p-1">
//                         <input
//                           type="number"
//                           className="w-16 border rounded px-1.5 py-1 text-xs text-right outline-none bg-white"
//                           value={inlineRow.nonLaborPercent}
//                           onChange={(e) =>
//                             handleInlineInputChange(
//                               inlineRow.tempId,
//                               "nonLaborPercent",
//                               e.target.value,
//                             )
//                           }
//                         />
//                       </td>
//                       {/* ODCs ($) */}
//                       <td className="p-1 text-right text-xs font-semibold px-2">
//                         {formatWithCommas(inlineOdcAmt.toFixed(2))}
//                       </td>
//                       {/* Start Date */}
//                       <td className="p-1">
//                         <input
//                           type="date"
//                           className="w-28 border rounded px-1 py-1 text-xs outline-none bg-white"
//                           value={inlineRow.startDate}
//                           onChange={(e) =>
//                             handleInlineInputChange(
//                               inlineRow.tempId,
//                               "startDate",
//                               e.target.value,
//                             )
//                           }
//                         />
//                       </td>
//                       {/* End Date */}
//                       <td className="p-1">
//                         <input
//                           type="date"
//                           className="w-28 border rounded px-1 py-1 text-xs outline-none bg-white"
//                           value={inlineRow.endDate}
//                           onChange={(e) =>
//                             handleInlineInputChange(
//                               inlineRow.tempId,
//                               "endDate",
//                               e.target.value,
//                             )
//                           }
//                         />
//                       </td>
//                       {/* Status */}
//                       <td className="p-1">
//                         <input
//                           type="text"
//                           className="w-20 border rounded px-1.5 py-1 text-xs outline-none bg-white"
//                           value={inlineRow.status}
//                           onChange={(e) =>
//                             handleInlineInputChange(
//                               inlineRow.tempId,
//                               "status",
//                               e.target.value,
//                             )
//                           }
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })}

//                 {isLoading ? (
//                   <tr>
//                     <td colSpan={columns.length + 1}>
//                       <div className="flex items-center justify-center py-2">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                         <span className="ml-2 mt-4">
//                           Loading project plans...
//                         </span>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : isDeleting ? (
//                   <tr>
//                     <td colSpan={columns.length + 1}>
//                       <div className="flex items-center justify-center py-2">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                         <span className="ml-2 mt-4">Deleting.....</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : data.length === 0 &&
//                   inlineRows.length === 0 &&
//                   searchTerm.trim() === "" ? (
//                   <tr>
//                     <td colSpan={columns.length + 1}>
//                       <div className="p-8 text-center text-gray-500 text-lg">
//                         Search and select a valid Project to view details
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   data.map((item) => {
//                     const contractValue = Number(item.contractValue) || 0;
//                     const pwinPercent = Number(item.pwinValue) || 0;
//                     const revenueAmt = contractValue * (pwinPercent / 100);

//                     const subPercent = Number(item.onsiteLaborPercent) || 0;
//                     const directLaborPercent =
//                       Number(item.offSiteLaborPercent) || 0;
//                     const odcPercent = Number(item.nonLaborPercent) || 0;

//                     const subcontractorAmt = revenueAmt * (subPercent / 100);
//                     const directLaborAmt =
//                       revenueAmt * (directLaborPercent / 100);
//                     const odcAmt = revenueAmt * (odcPercent / 100);

//                     return (
//                       <tr
//                         key={item.businessBudgetId}
//                         onDoubleClick={() => handleEdit(item)}
//                         className={`cursor-pointer hover:bg-blue-50 ${
//                           selectedRows.has(item.businessBudgetId)
//                             ? "bg-blue-200"
//                             : "bg-white"
//                         }`}
//                       >
//                         {isEditable && (
//                           <td className="tbody-td-fun">
//                             <input
//                               type="checkbox"
//                               checked={selectedRows.has(item.businessBudgetId)}
//                               onChange={(e) => {
//                                 e.stopPropagation();
//                                 const isChecked = e.target.checked;
//                                 toggleRow(item);
//                                 setDataItem((prev) =>
//                                   isChecked
//                                     ? [...prev, item]
//                                     : prev.filter(
//                                         (i) =>
//                                           i.businessBudgetId !==
//                                           item.businessBudgetId,
//                                       ),
//                                 );
//                               }}
//                             />
//                           </td>
//                         )}

//                         {columns.map((col, idx) => {
//                           const isNumericField = [
//                             "contractValue",
//                             "revenue",
//                             "subcontractorAmt",
//                             "directLaborAmt",
//                             "odcAmt",
//                           ].includes(col);

//                           return (
//                             <td
//                               key={idx}
//                               className={`px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 ${
//                                 col === "description"
//                                   ? "text-left min-w-[300px] break-words"
//                                   : isNumericField
//                                     ? "text-right whitespace-nowrap"
//                                     : "text-center"
//                               } ${
//                                 [
//                                   "startDate",
//                                   "endDate",
//                                   "trf_ProjId",
//                                   "businessBudgetId",
//                                   "stage",
//                                 ].includes(col)
//                                   ? "whitespace-nowrap"
//                                   : ""
//                               }`}
//                             >
//                               {col === "startDate" || col === "endDate" ? (
//                                 item[col]?.split("T")[0]
//                               ) : col === "contractValue" ? (
//                                 formatWithCommas(item[col])
//                               ) : col === "pwinValue" ? (
//                                 `${(item[col] ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%`
//                               ) : col === "revenue" ? (
//                                 formatWithCommas(revenueAmt.toFixed(2))
//                               ) : col === "subcontractorAmt" ? (
//                                 formatWithCommas(subcontractorAmt.toFixed(2))
//                               ) : col === "directLaborAmt" ? (
//                                 formatWithCommas(directLaborAmt.toFixed(2))
//                               ) : col === "odcAmt" ? (
//                                 formatWithCommas(odcAmt.toFixed(2))
//                               ) : col === "onsiteLaborPercent" ||
//                                 col === "offSiteLaborPercent" ||
//                                 col === "nonLaborPercent" ? (
//                                 item[col] !== null &&
//                                 item[col] !== undefined &&
//                                 item[col] !== "" ? (
//                                   `${item[col]}%`
//                                 ) : (
//                                   ""
//                                 )
//                               ) : col === "isActive" ? (
//                                 <input
//                                   type="checkbox"
//                                   checked={!!item[col]}
//                                   readOnly
//                                   className="h-3 w-3 accent-blue-600 cursor-default"
//                                 />
//                               ) : (
//                                 item[col]
//                               )}
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewBusinessComponent;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl } from "./config";
import NewBusiness from "./NewBusiness";
import { toast } from "react-toastify";
import { BriefcaseBusiness, Plus, Copy, Save, X } from "lucide-react";
import { useOutletContext } from "react-router-dom";

const NewBusinessComponent = ({ title, isForPricing }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewBusinessPopup, setShowNewBusinessPopup] = useState(false);
  const [editNewBusinessPopup, setEditNewBusinessPopup] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataItem, setDataItem] = useState([]);

  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Multi-row inline editing state
  const [inlineRows, setInlineRows] = useState([]);
  const [orgOptions, setOrgOptions] = useState([]);
  const [accountGroupOptions, setAccountGroupOptions] = useState([]);
  const [revFormulaOptions, setRevFormulaOptions] = useState([]);

  const { canEdit } = useOutletContext();
  const isEditable = canEdit("manageNewBusiness");

  const [columns] = useState([
    "businessBudgetId",
    "description",
    "stage",
    "contractValue",
    "contractTypes",
    "pwinValue",
    "revenue",
    "orgId",
    "accountGroup",
    "customer",
    "onsiteLaborPercent",
    "subcontractorAmt",
    "offSiteLaborPercent",
    "directLaborAmt",
    "nonLaborPercent",
    "odcAmt",
    "startDate",
    "endDate",
    "status",
  ]);

  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const selectedCount = selectedRows.size;
  const showEdit = selectedCount === 1;
  const showDelete = selectedCount >= 1;

  const ACCT_MAP = {
    offSiteLabor: "50-00-98", // Replace with your actual labor account string/ID
    nonLabor: "50-30-01", // Replace with your actual non-billable labor ID
    onsiteLabor: "50-00-01", // Replace with your actual travel/non-labor ID
  };

  useEffect(() => {
    if (searchTerm) handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const [orgRes, accRes, revFormulaRes] = await Promise.all([
          axios.get(`${backendUrl}/Orgnization/GetAllOrgs`),
          axios.get(`${backendUrl}/Project/GetAccountGroupCodes`),
          axios.get(`${backendUrl}/RevFormula`),
        ]);
        setOrgOptions(orgRes.data || []);
        setAccountGroupOptions(accRes.data || []);
        if (revFormulaRes.data && Array.isArray(revFormulaRes.data)) {
          setRevFormulaOptions(
            revFormulaRes.data.map((item) => ({
              label: `${item.formulaDesc} (${item.formulaCd})`,
              value: item.formulaCd,
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching dropdown options", error);
      }
    };
    fetchLookupData();
  }, []);

  const COLUMN_LABELS = {
    businessBudgetId: "ID",
    description: "Description",
    stage: "Stage",
    contractValue: "Contract Value",
    contractTypes: "Contract Types",
    pwinValue: "Pwin Value",
    revenue: "Revenue",
    startDate: "Start Date",
    endDate: "End Date",
    orgId: "Org ID",
    accountGroup: "Account Group",
    customer: "Customer",
    onsiteLaborPercent: "Subcontractor(%)",
    subcontractorAmt: "Subcontractor($)",
    offSiteLaborPercent: "Direct Labor(%)",
    directLaborAmt: "Direct Labor($)",
    nonLaborPercent: "ODCs(%)",
    odcAmt: "ODCs($)",
    status: "Status",
  };

  const stageOptions = [
    { label: "01 - Planning", value: "PLANNING" },
    { label: "02 - Positioning", value: "POSTIONING" },
    { label: "03 - Pursuing", value: "PURUING" },
    { label: "04 - Proposal", value: "PROPOSAL" },
    { label: "05 - Post Submit", value: "POSTSUBMIT" },
    { label: "06 - Won", value: "WIN" },
    { label: "07 - Lost", value: "LOSS" },
    { label: "08 - Canceled", value: "CANCELED" },
    { label: "09 - No Bid", value: "NOBID9" },
    { label: "10 - Postponed", value: "POSTPON10" },
    { label: "Lead", value: "LEAD" },
    { label: "Qualified", value: "QUAL" },
    { label: "Capture", value: "CAPTURE" },
    { label: "Proposal Prep", value: "PROPPREP" },
    { label: "Proposal Submitted", value: "PROPSUB" },
    { label: "Negotiation", value: "NEGOTIATE" },
    { label: "Identification", value: "IDENT" },
    { label: "Won", value: "WON" },
    { label: "Lost", value: "LOST" },
    { label: "Cancel", value: "CANCEL" },
    { label: "No Bid", value: "NOBID" },
    { label: "Postponed", value: "POSTPONED" },
    { label: "Review", value: "REVIEW" },
    { label: "In Protest", value: "PROTEST" },
  ];

  const formatWithCommas = (val) => {
    if (val === null || val === undefined || val === "") return "";
    const parts = val.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSearch = async () => {
    const term = searchTerm.trim();
    try {
      setShowNewBusinessPopup(false);
      setEditNewBusinessPopup(false);
      setIsLoading(true);

      // const res = term
      //   ? await axios.get(`${backendUrl}/GetAllNewBusinessById/${term}`)
      //   : await axios.get(`${backendUrl}/GetAllNewBusiness`);
      const res = term
        ? await axios.get(`${backendUrl}/GetAllNewBusinessById/${term}`)
        : await axios.get(`${backendUrl}/GetAllNewBusiness`);

      const rawData = Array.isArray(res.data)
        ? res.data
        : res.data
          ? [res.data]
          : [];

      // Natural Alphanumeric Sort using businessBudgetId
      const sortedData = [...rawData].sort((a, b) => {
        const idA = a.businessBudgetId || a.id || a.projId || "";
        const idB = b.businessBudgetId || b.id || b.projId || "";

        // Ascending (A-Z, 01-99)
        return idA.localeCompare(idB, undefined, {
          numeric: true,
          sensitivity: "base",
        });

        // Descending (Z-A, 99-01) -> Swap idA and idB:
        // return idB.localeCompare(idA, undefined, { numeric: true, sensitivity: "base" });
      });

      // setData(res.data || []);
      setData(sortedData);
      setSelectedRows(new Set());
      setSelectedBusiness(null);
      setInlineRows([]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRow = (item) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(item.businessBudgetId)) {
        newSet.delete(item.businessBudgetId);
      } else {
        newSet.add(item.businessBudgetId);
      }

      if (newSet.size === 1) {
        const id = [...newSet][0];
        setSelectedBusiness(
          data.find((d) => d.businessBudgetId === id) || null,
        );
      } else {
        setSelectedBusiness(null);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows(new Set());
      setSelectedBusiness(null);
    } else {
      const allIds = new Set(data.map((d) => d.businessBudgetId));
      setSelectedRows(allIds);
      setSelectedBusiness(null);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const selectedRowsToDelete = [...selectedRows];
      await axios.post(
        `${backendUrl}/BulkDeleteNewBusiness`,
        selectedRowsToDelete,
      );
      toast.success("Business Deleted Successfully!");
      handleSearch();
    } catch (error) {
      console.error("Delete Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        "Project plans exist. Please delete them first.";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (item) => {
    setSelectedBusiness(item);
    setEditNewBusinessPopup(true);
  };

  const handleNewBusinessSave = async () => {
    handleSearch();
    setShowNewBusinessPopup(false);
    setEditNewBusinessPopup(false);
  };

  const getRawLaborCost = (burdenedCost, rates = {}) => {
    const { fringe = 0, overhead = 0, gna = 0, hr = 0, mnh = 0 } = rates;
    const multiplier =
      (1 + fringe / 100) *
      (1 + overhead / 100) *
      (1 + gna / 100) *
      (1 + hr / 100) *
      (1 + mnh / 100);
    if (isNaN(multiplier) || multiplier <= 0) return burdenedCost;
    return Number((burdenedCost / multiplier).toFixed(2));
  };

  const calculateCostByAccountType = (
    accountKey,
    burdenedCost,
    ratesData,
    rateToggles = {
      fringe: true,
      overhead: true,
      gna: true,
      hr: true,
      mnh: true,
    },
  ) => {
    const accountId = ACCT_MAP[accountKey];
    const rateInfo = Array.isArray(ratesData)
      ? ratesData.find(
          (item) => item.accountId === accountId || item.acctId === accountId,
        )
      : ratesData?.[accountId];

    if (!rateInfo) return burdenedCost;

    const fringe = rateToggles.fringe ? rateInfo.fringeRate || 0 : 0;
    const overhead = rateToggles.overhead ? rateInfo.overheadRate || 0 : 0;
    const gna = rateToggles.gna ? rateInfo.gnaRate || 0 : 0;
    const hr = rateToggles.hr ? rateInfo.hrRate || 0 : 0;
    const mnh = rateToggles.mnh ? rateInfo.mnhRate || 0 : 0;

    return getRawLaborCost(burdenedCost, { fringe, overhead, gna, hr, mnh });
  };

  const executeAutomatedSplitsAndSync = async (plId, projId, row) => {
    try {
      const totalContractValue = parseFloat(row.contractValue) || 0;
      if (totalContractValue === 0) return;

      const pwinPercent = parseFloat(row.pwinValue) || 100;
      const adjustedValue = totalContractValue * (pwinPercent / 100);

      if (!row.startDate || !row.endDate) return;

      const startStr = row.startDate.split("T")[0];
      const endStr = row.endDate.split("T")[0];

      let workingHoursMap = {};
      let escMonth = "1";
      let escPercent = 0;

      try {
        const [hoursResponse, configResponse] = await Promise.all([
          axios.get(
            `${backendUrl}/Orgnization/GetWorkingDaysForDuration/${startStr}/${endStr}`,
          ),
          axios.get(
            `${backendUrl}/api/Configuration/GetAllConfigValuesByProject/xxxxx`,
          ),
        ]);

        if (hoursResponse.data && Array.isArray(hoursResponse.data)) {
          hoursResponse.data.forEach((item) => {
            const key = `${item.year}-${item.monthNo}`;
            workingHoursMap[key] = parseFloat(item.workingHours) || 168;
          });
        }

        if (configResponse.data && Array.isArray(configResponse.data)) {
          const monthConfig = configResponse.data.find(
            (c) => c.name === "escallation_month",
          );
          const percentConfig = configResponse.data.find(
            (c) => c.name === "escallation_percent",
          );
          if (monthConfig) escMonth = monthConfig.value;
          if (percentConfig) escPercent = parseFloat(percentConfig.value) || 0;
        }
      } catch (apiErr) {
        console.warn(
          "External configuration APIs failed. Using fallback defaults.",
          apiErr,
        );
      }

      let ratesData = {};
      try {
        const ratesRes = await axios.post(
          `${backendUrl}/GetAverageIndirectRates`,
          {
            accountIds: Object.values(ACCT_MAP),
            orgId: row.orgId,
            startDate: startStr,
            endDate: endStr,
          },
        );
        ratesData = ratesRes.data || {};
      } catch (rErr) {
        console.warn("Could not fetch indirect rates for row", rErr);
      }

      const [startYear, startMonth] = row.startDate.split("-").map(Number);
      const [endYear, endMonth] = row.endDate.split("-").map(Number);

      const activeMonthsList = [];
      let currentIterDate = new Date(startYear, startMonth - 1, 1);
      const limitDate = new Date(endYear, endMonth - 1, 1);

      while (currentIterDate <= limitDate) {
        activeMonthsList.push({
          month: currentIterDate.getMonth() + 1,
          year: currentIterDate.getFullYear(),
        });
        currentIterDate.setMonth(currentIterDate.getMonth() + 1);
      }

      const totalMonthsCount = activeMonthsList.length;
      if (totalMonthsCount === 0) return;

      let grandTotalHours = 0;
      activeMonthsList.forEach(({ month, year }) => {
        const hoursKey = `${year}-${month}`;
        grandTotalHours += workingHoursMap[hoursKey] || 168;
      });

      const monthlyAllocatedAmount = adjustedValue / totalMonthsCount;
      const offSitePct = parseFloat(row.offSiteLaborPercent) || 0;
      const onSitePct = parseFloat(row.onsiteLaborPercent) || 0;
      const nonLaborPct = parseFloat(row.nonLaborPercent) || 0;

      const shortDate = new Date().toISOString().split("T")[0];
      const templateId = parseInt(row.burdenTemplateId) || 2;
      const orgIdString = row.orgId || "LUMINA_CORP";
      const defaultHourlyRate = 60;

      const escalationRate = parseFloat(row.escalationRate) || escPercent || 0;
      const rawOffSiteMonthly = monthlyAllocatedAmount * (offSitePct / 100);
      const rawOnSiteMonthly = monthlyAllocatedAmount * (onSitePct / 100);
      const rawNonLaborMonthly = monthlyAllocatedAmount * (nonLaborPct / 100);

      const splitsPerMonth = {
        offSiteLabor: rawOffSiteMonthly * (1 - escalationRate / 100),
        onsiteLabor: rawOnSiteMonthly * (1 - escalationRate / 100),
        nonLabor: rawNonLaborMonthly * (1 - escalationRate / 100),
      };

      const overallTotals = {
        offSiteLaborBurdened: splitsPerMonth.offSiteLabor * totalMonthsCount,
        onsiteLaborBurdened: splitsPerMonth.onsiteLabor * totalMonthsCount,
        nonLaborBurdened: splitsPerMonth.nonLabor * totalMonthsCount,
        offSiteLabor: calculateCostByAccountType(
          "offSiteLabor",
          splitsPerMonth.offSiteLabor * totalMonthsCount,
          ratesData,
        ),
        onsiteLabor: calculateCostByAccountType(
          "onsiteLabor",
          splitsPerMonth.onsiteLabor * totalMonthsCount,
          ratesData,
        ),
        nonLabor: calculateCostByAccountType(
          "nonLabor",
          splitsPerMonth.nonLabor * totalMonthsCount,
          ratesData,
        ),
      };

      const overallRates = {
        offSiteLabor:
          grandTotalHours > 0
            ? overallTotals.offSiteLabor / grandTotalHours
            : 0,
        onsiteLabor:
          grandTotalHours > 0 ? overallTotals.onsiteLabor / grandTotalHours : 0,
      };

      const laborResourceTracks = {};
      const nonLaborPayloadMap = {};

      const ensureSingleLaborResourceExists = (splitType, acctId) => {
        if (!laborResourceTracks[splitType]) {
          const paddedEscMonth = String(escMonth).padStart(2, "0");
          const finalFlatRate = overallRates[splitType] || defaultHourlyRate;

          laborResourceTracks[splitType] = {
            emplId: "TBD",
            firstName:
              splitType === "offSiteLabor"
                ? "Direct Labor Baseline"
                : "Subcontractor Labor Baseline",
            lastName: "",
            type: "Other",
            isRev: true,
            isBrd: true,
            plcGlcCode: "E15",
            perHourRate: parseFloat(finalFlatRate.toFixed(4)),
            status: "Act",
            accId: acctId,
            orgId: orgIdString,
            plId: plId,
            plForecasts: [],
            escllationDate: `${startYear + 1}-${paddedEscMonth}-01`,
            esc_Percent: row.escalationRate || escPercent,
          };
        }
        return laborResourceTracks[splitType];
      };

      Object.keys(ACCT_MAP).forEach((splitType) => {
        const acctId = ACCT_MAP[splitType];
        if (splitType !== "offSiteLabor" && splitType !== "onsiteLabor") {
          nonLaborPayloadMap[acctId] = {
            dctId: 0,
            plId: plId,
            acctId: acctId,
            orgId: orgIdString,
            category: "A",
            id: "TBD",
            type: "Other",
            isRev: true,
            isBrd: true,
            plcGlc: "",
            status: "Act",
            createdBy: "System",
            lastModifiedBy: "System",
            plForecasts: [],
          };
        }
      });

      activeMonthsList.forEach(({ month, year }) => {
        const hoursKey = `${year}-${month}`;
        const maxWorkingHours = workingHoursMap[hoursKey] || 168;

        Object.keys(ACCT_MAP).forEach((splitType) => {
          const acctId = ACCT_MAP[splitType];
          const allocationAmount = splitsPerMonth[splitType] || 0;
          const isLabor =
            splitType === "offSiteLabor" || splitType === "onsiteLabor";

          if (isLabor) {
            const currentResource = ensureSingleLaborResourceExists(
              splitType,
              acctId,
            );
            const flatHourlyRate = overallRates[splitType];
            const hoursToAssign = maxWorkingHours;
            let calculatedCost = hoursToAssign * flatHourlyRate;

            const isLastMonth =
              month === activeMonthsList[activeMonthsList.length - 1].month &&
              year === activeMonthsList[activeMonthsList.length - 1].year;

            if (isLastMonth) {
              const existingTotal = currentResource.plForecasts.reduce(
                (sum, x) => sum + x.cost,
                0,
              );
              calculatedCost = overallTotals[splitType] - existingTotal;
            }

            calculatedCost = parseFloat(calculatedCost.toFixed(2));

            currentResource.plForecasts.push({
              forecastedhours: parseFloat(hoursToAssign.toFixed(2)),
              cost: calculatedCost,
              projId: projId,
              plId: plId,
              emplId: currentResource.emplId,
              month: month,
              year: year,
              acctId: acctId,
              orgId: orgIdString,
              plc: "E15",
              hrlyRate: parseFloat(flatHourlyRate.toFixed(4)),
            });
          } else {
            nonLaborPayloadMap[acctId].plForecasts.push({
              forecastedamt: parseFloat(allocationAmount.toFixed(2)),
              forecastid: 0,
              projId: projId,
              plId: plId,
              emplId: "TBD",
              dctId: 0,
              month: month,
              year: year,
              updatedat: shortDate,
              acctId: acctId,
              orgId: orgIdString,
              hrlyRate: 0,
              plc: " ",
              effectDt: null,
            });
          }
        });
      });

      const laborPayloads = [];
      Object.keys(laborResourceTracks).forEach((splitType) => {
        const resourceGroup = laborResourceTracks[splitType];
        resourceGroup.plForecasts.sort(
          (a, b) => a.year - b.year || a.month - b.month,
        );
        if (resourceGroup.plForecasts.some((f) => f.cost > 0)) {
          laborPayloads.push(resourceGroup);
        }
      });

      const nonLaborPayloads = Object.values(nonLaborPayloadMap).filter((g) =>
        g.plForecasts.some((f) => f.forecastedamt > 0),
      );

      if (laborPayloads.length > 0) {
        await axios.post(
          `${backendUrl}/Employee/AddNewEmployees?plid=${plId}&templateid=${templateId}`,
          laborPayloads,
          { headers: { "Content-Type": "application/json" } },
        );
      }

      if (nonLaborPayloads.length > 0) {
        await axios.post(
          `${backendUrl}/DirectCost/AddNewDirectCosts?plid=${plId}&templateid=${templateId}`,
          nonLaborPayloads,
          { headers: { "Content-Type": "application/json" } },
        );
      }

      const revPayload = activeMonthsList.map(({ month, year }) => ({
        fy_Cd: year,
        period: month,
        revAmt: monthlyAllocatedAmount,
      }));

      await axios.post(
        `${backendUrl}/ProjRevWrkPd/AddRevenueForNB?pl_id=${plId}&proj_id=${projId}`,
        revPayload,
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (err) {
      console.error("Auto-split error:", err);
    }
  };

  const createBlankRow = () => ({
    tempId: Date.now() + Math.random(),
    businessBudgetId: "",
    description: "",
    stage: "PLANNING",
    contractValue: 0,
    contractTypes: revFormulaOptions[0]?.value || "",
    pwinValue: 100,
    orgId: orgOptions[0]?.orgId || "",
    customer: "",
    onsiteLaborPercent: 40,
    offSiteLaborPercent: 40,
    nonLaborPercent: 20,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    status: "In Progress",
    accountGroup: "DIR",
    burdenTemplateId: 2,
    ourRole: "prime",
    level: 1,
    version: 1,
    versionCode: "V1",
    escalationRate: 0,
  });

  const handleAddNewRow = () => {
    setInlineRows((prev) => [createBlankRow(), ...prev]);
  };

  // const handleCopySelectedRows = () => {
  //   if (selectedRows.size === 0) {
  //     toast.info("Please select at least one row using checkboxes to copy.");
  //     return;
  //   }

  //   const copiedRows = data
  //     .filter((d) => selectedRows.has(d.businessBudgetId))
  //     .map((sourceObj) => ({
  //       tempId: Date.now() + Math.random(),
  //       businessBudgetId: "",
  //       description: sourceObj.description
  //         ? `${sourceObj.description} (Copy)`
  //         : "",
  //       stage: sourceObj.stage || "PLANNING",
  //       contractValue: sourceObj.contractValue || 0,
  //       contractTypes:
  //         sourceObj.contractTypes || revFormulaOptions[0]?.value || "",
  //       pwinValue: sourceObj.pwinValue || 100,
  //       orgId: sourceObj.orgId || orgOptions[0]?.orgId || "",
  //       customer: sourceObj.customer || "",
  //       onsiteLaborPercent: sourceObj.onsiteLaborPercent || 40,
  //       offSiteLaborPercent: sourceObj.offSiteLaborPercent || 40,
  //       nonLaborPercent: sourceObj.nonLaborPercent || 20,
  //       startDate: sourceObj.startDate
  //         ? sourceObj.startDate.split("T")[0]
  //         : new Date().toISOString().split("T")[0],
  //       endDate: sourceObj.endDate
  //         ? sourceObj.endDate.split("T")[0]
  //         : new Date().toISOString().split("T")[0],
  //       status: sourceObj.status || "In Progress",
  //       accountGroup: sourceObj.accountGroup || accountGroupOptions[0] || "DIR",
  //       burdenTemplateId: sourceObj.burdenTemplateId || 2,
  //       ourRole: sourceObj.ourRole || "prime",
  //       level: sourceObj.level || 1,
  //       version: sourceObj.version || 1,
  //       versionCode: sourceObj.versionCode || "V1",
  //       escalationRate: sourceObj.escalationRate || 0,
  //     }));

  //   setInlineRows((prev) => [...copiedRows, ...prev]);
  //   toast.info(
  //     `Copied ${copiedRows.length} row(s). Enter unique IDs and click 'Save All New Rows'.`,
  //   );
  // };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return new Date().toISOString().split("T")[0];
    const cleaned = dateStr.trim();

    // If already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
      return cleaned;
    }

    // Handle MM/DD/YY or MM/DD/YYYY formats from Excel
    if (cleaned.includes("/")) {
      const parts = cleaned.split("/");
      if (parts.length === 3) {
        let month = parts[0].padStart(2, "0");
        let day = parts[1].padStart(2, "0");
        let year = parts[2];

        // Convert 2-digit year (e.g., "26") to 4-digit year ("2026")
        if (year.length === 2) {
          year = `20${year}`;
        }

        return `${year}-${month}-${day}`;
      }
    }

    // Fallback if parsing as standard JavaScript Date works
    const parsedDate = new Date(cleaned);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().split("T")[0];
    }

    return new Date().toISOString().split("T")[0];
  };

  // Copy selected rows to system Clipboard & state
  const handleCopySelectedRows = async () => {
    if (selectedRows.size === 0) {
      toast.info("Please select at least one row using checkboxes to copy.");
      return;
    }

    const copiedRowsData = data
      .filter((d) => selectedRows.has(d.businessBudgetId))
      .map((sourceObj) => ({
        tempId: Date.now() + Math.random(),
        businessBudgetId: "", // Cleared so user inputs a new ID
        description: sourceObj.description
          ? `${sourceObj.description} (Copy)`
          : "",
        stage: sourceObj.stage || "PLANNING",
        contractValue: sourceObj.contractValue || 0,
        contractTypes:
          sourceObj.contractTypes || revFormulaOptions[0]?.value || "",
        pwinValue: sourceObj.pwinValue || 100,
        orgId: sourceObj.orgId || orgOptions[0]?.orgId || "",
        customer: sourceObj.customer || "",
        onsiteLaborPercent: sourceObj.onsiteLaborPercent || 40,
        offSiteLaborPercent: sourceObj.offSiteLaborPercent || 40,
        nonLaborPercent: sourceObj.nonLaborPercent || 20,
        startDate: formatDateForInput(sourceObj.startDate),
        endDate: formatDateForInput(sourceObj.endDate),
        status: sourceObj.status || "In Progress",
        accountGroup: sourceObj.accountGroup || "DIR",
        burdenTemplateId: sourceObj.burdenTemplateId || 2,
        ourRole: sourceObj.ourRole || "prime",
        level: sourceObj.level || 1,
        version: sourceObj.version || 1,
        versionCode: sourceObj.versionCode || "V1",
        escalationRate: sourceObj.escalationRate || 0,
      }));

    toast.success(
      `Copied ${copiedRowsData.length} row(s) to clipboard! Click 'Paste' to insert.`,
    );

    // Create TSV String for Clipboard (compatible with Excel)
    const tsvHeader =
      "Business ID\tDescription\tStage\tContract Value\tContract Types\tPwin Value\tOrg ID\tAccount Group\tCustomer\tSubcontractor(%)\tDirect Labor(%)\tODCs(%)\tStart Date\tEnd Date";
    const tsvBody = copiedRowsData
      .map((r) =>
        [
          r.businessBudgetId,
          r.description,
          r.stage,
          r.contractValue,
          r.contractTypes,
          r.pwinValue,
          r.orgId,
          r.accountGroup,
          r.customer,
          r.onsiteLaborPercent,
          r.offSiteLaborPercent,
          r.nonLaborPercent,
          r.startDate,
          r.endDate,
        ].join("\t"),
      )
      .join("\n");

    try {
      await navigator.clipboard.writeText(`${tsvHeader}\n${tsvBody}`);
      setClipboardRows(copiedRowsData);
      toast.success(
        `Copied ${copiedRowsData.length} row(s) to clipboard! Click 'Paste' to insert.`,
      );
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      // Fallback to state if system clipboard access fails
      setClipboardRows(copiedRowsData);
      toast.info(
        `Copied ${copiedRowsData.length} row(s). Click 'Paste' to insert.`,
      );
    }
  };

  // Paste action: Triggered ONLY when the Paste button is clicked
  // const handlePasteFromClipboard = async () => {
  //   try {
  //     let pastedText = "";

  //     // 1. Try reading from System Clipboard first (supports Excel copies)
  //     try {
  //       pastedText = await navigator.clipboard.readText();
  //     } catch (readErr) {
  //       console.warn(
  //         "System clipboard read restricted, falling back to state.",
  //       );
  //     }

  //     if (pastedText && pastedText.includes("\t")) {
  //       const lines = pastedText.trim().split(/\r\n|\n/);
  //       const startIndex = lines[0].toLowerCase().includes("business id")
  //         ? 1
  //         : 0;
  //       const dataLines = lines.slice(startIndex);

  //       if (dataLines.length > 0) {
  //         const parsedExcelRows = dataLines.map((line) => {
  //           const cells = line.split("\t");
  //           return {
  //             tempId: Date.now() + Math.random(),
  //             businessBudgetId: cells[0] ? cells[0].trim() : "",
  //             description: cells[1] ? cells[1].trim() : "",
  //             stage: cells[2] ? cells[2].trim() : "PLANNING",
  //             contractValue: cells[3]
  //               ? parseFloat(cells[3].replace(/,/g, "")) || 0
  //               : 0,
  //             contractTypes: cells[4]
  //               ? cells[4].trim()
  //               : revFormulaOptions[0]?.value || "",
  //             pwinValue: cells[5] ? parseFloat(cells[5]) || 100 : 100,
  //             orgId: cells[6] ? cells[6].trim() : orgOptions[0]?.orgId || "",
  //             customer: cells[7] ? cells[7].trim() : "",
  //             onsiteLaborPercent: cells[8] ? parseFloat(cells[8]) || 0 : 40,
  //             offSiteLaborPercent: cells[9] ? parseFloat(cells[9]) || 0 : 40,
  //             nonLaborPercent: cells[10] ? parseFloat(cells[10]) || 0 : 20,
  //             startDate: formatDateForInput(cells[11]),
  //             endDate: formatDateForInput(cells[12]),
  //             status: "In Progress",
  //             accountGroup: "DIR",
  //             burdenTemplateId: 2,
  //             ourRole: "prime",
  //             level: 1,
  //             version: 1,
  //             versionCode: "V1",
  //             escalationRate: 0,
  //           };
  //         });

  //         setInlineRows((prev) => [...parsedExcelRows, ...prev]);
  //         toast.success(
  //           `Pasted ${parsedExcelRows.length} new row(s) into editable area!`,
  //         );
  //         return;
  //       }
  //     }

  //     // 2. Fallback to internally copied state
  //     if (clipboardRows.length > 0) {
  //       const freshRows = clipboardRows.map((row) => ({
  //         ...row,
  //         tempId: Date.now() + Math.random(),
  //       }));
  //       setInlineRows((prev) => [...freshRows, ...prev]);
  //       toast.success(`Pasted ${freshRows.length} row(s) into editable area!`);
  //     } else {
  //       toast.warn("No rows found in clipboard. Copy rows first.");
  //     }
  //   } catch (err) {
  //     console.error("Paste error:", err);
  //     toast.info("Clipboard is Empty or Invalid format");
  //   }
  // };

  const handleInlineInputChange = (tempId, field, value) => {
    setInlineRows((prev) =>
      prev.map((row) =>
        row.tempId === tempId ? { ...row, [field]: value } : row,
      ),
    );
  };

  const handleRemoveInlineRow = (tempId) => {
    setInlineRows((prev) => prev.filter((r) => r.tempId !== tempId));
  };

  const handleSaveAllInlineRows = async () => {
    if (inlineRows.length === 0) return;

    for (let i = 0; i < inlineRows.length; i++) {
      const row = inlineRows[i];
      if (
        !row.businessBudgetId ||
        !row.description ||
        !row.startDate ||
        !row.endDate ||
        !row.orgId ||
        !row.contractTypes
      ) {
        toast.error(`Please fill all required fields for row #${i + 1}.`);
        return;
      }

      const offSite = parseFloat(row.offSiteLaborPercent) || 0;
      const onSite = parseFloat(row.onsiteLaborPercent) || 0;
      const nonLabor = parseFloat(row.nonLaborPercent) || 0;
      if (offSite + onSite + nonLabor !== 100) {
        toast.error(`Row #${i + 1}: Allocations must total exactly 100%.`);
        return;
      }

      if (data.some((d) => d.businessBudgetId === row.businessBudgetId)) {
        toast.error(
          `Business ID '${row.businessBudgetId}' already exists. Please use unique IDs.`,
        );
        return;
      }
    }

    const idSet = new Set(inlineRows.map((r) => r.businessBudgetId));
    if (idSet.size !== inlineRows.length) {
      toast.error(
        "Duplicate Business Budget IDs found in new rows. Each ID must be unique.",
      );
      return;
    }

    setIsSaving(true);
    const shortDate = new Date().toISOString().split("T")[0];
    let savedCount = 0;

    try {
      for (const row of inlineRows) {
        const contractValue = Number(row.contractValue) || 0;
        const pwinPercent = Number(row.pwinValue) || 0;
        const calculatedRevenue = contractValue * (pwinPercent / 100);

        const businessPayload = {
          businessBudgetId: row.businessBudgetId,
          description: row.description,
          level: parseInt(row.level) || 1,
          isActive: true,
          version: parseInt(row.version) || 1,
          versionCode: row.versionCode || "V1",
          winningProbability: parseFloat(row.pwinValue) || 100,
          contractValue: parseFloat(row.contractValue) || 0,
          contractTypes: String(row.contractTypes || ""),
          startDate: row.startDate
            ? `${row.startDate.split("T")[0]}T00:00:00`
            : "0001-01-01T00:00:00",
          endDate: row.endDate
            ? `${row.endDate.split("T")[0]}T00:00:00`
            : "0001-01-01T00:00:00",
          escalationRate: parseFloat(row.escalationRate) || 0,
          orgId: row.orgId || "",
          accountGroup: row.accountGroup || "DIR",
          burdenTemplateId: parseInt(row.burdenTemplateId) || 2,
          modifiedBy: "admin",
          pgoCalculation: 0,
          pwinValue: parseFloat(row.pwinValue) || 100,
          type: "NBBUD",
          ourRole: row.ourRole || "prime",
          workshare: 100,
          trf_ProjId: row.businessBudgetId,
          status: row.status || "In Progress",
          nbType: "NBBUD",
          revenue: calculatedRevenue,
          sector: "",
          businessUnit: "",
          customer: row.customer || "",
          stage: row.stage || "",
          transitionPeriod: 0,
          forecastCategory: "pipeline",
          offSiteLaborPercent: parseFloat(row.offSiteLaborPercent) || 0,
          onsiteLaborPercent: parseFloat(row.onsiteLaborPercent) || 0,
          nonLaborPercent: parseFloat(row.nonLaborPercent) || 0,
          spreadDuration: 0,
        };

        const projectPayload = {
          projId: row.businessBudgetId,
          plId: 0,
          plType: "NBBUD",
          source: "",
          type: "A",
          version: parseInt(row.version) || 1,
          versionCode: row.versionCode || "V1",
          finalVersion: false,
          isCompleted: false,
          isApproved: false,
          status: "In Progress",
          createdBy: "User",
          modifiedBy: "User",
          approvedBy: "",
          templateId: parseInt(row.burdenTemplateId) || 2,
          projStartDt: row.startDate ? row.startDate.split("T")[0] : shortDate,
          projEndDt: row.endDate ? row.endDate.split("T")[0] : "2078-01-01",
          revenue: calculatedRevenue,
          sector: "",
          businessUnit: "",
          stage: row.stage || "",
          forecastCategory: "pipeline",
          revenueFormula: String(row.contractTypes || ""),
        };

        await axios.post(`${backendUrl}/AddNewBusiness`, businessPayload, {
          headers: { "Content-Type": "application/json" },
        });

        const projRes = await axios.post(
          `${backendUrl}/Project/AddProjectPlan`,
          projectPayload,
          {
            headers: { "Content-Type": "application/json" },
          },
        );

        const generatedPlId = projRes.data?.plId;
        if (generatedPlId && isForPricing === false) {
          await executeAutomatedSplitsAndSync(
            generatedPlId,
            row.businessBudgetId,
            row,
          );
        }

        savedCount++;
      }

      toast.success(`Successfully added ${savedCount} business record(s)!`);
      setInlineRows([]);
      handleSearch();
    } catch (error) {
      console.error("Error saving inline loop rows:", error);
      toast.error(
        `Saved ${savedCount} row(s) before encountered error. Please check remaining rows.`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  // const handlePasteExcel = (e) => {
  //   const clipboardData = e.clipboardData.getData("text");
  //   if (!clipboardData) return;

  //   const lines = clipboardData.trim().split(/\r\n|\n/);
  //   if (lines.length > 0 && lines[0].includes("\t")) {
  //     e.preventDefault();

  //     const newParsedRows = lines.map((line) => {
  //       const cells = line.split("\t");
  //       return {
  //         tempId: Date.now() + Math.random(),
  //         businessBudgetId: cells[0] ? cells[0].trim() : "",
  //         description: cells[1] ? cells[1].trim() : "",
  //         stage: cells[2] ? cells[2].trim() : "PLANNING",
  //         contractValue: cells[3]
  //           ? parseFloat(cells[3].replace(/,/g, "")) || 0
  //           : 0,
  //         contractTypes: cells[4]
  //           ? cells[4].trim()
  //           : revFormulaOptions[0]?.value || "",
  //         pwinValue: cells[5] ? parseFloat(cells[5]) || 100 : 100,
  //         orgId: cells[6] ? cells[6].trim() : orgOptions[0]?.orgId || "",
  //         customer: cells[7] ? cells[7].trim() : "",
  //         onsiteLaborPercent: cells[8] ? parseFloat(cells[8]) || 0 : 40,
  //         offSiteLaborPercent: cells[9] ? parseFloat(cells[9]) || 0 : 40,
  //         nonLaborPercent: cells[10] ? parseFloat(cells[10]) || 0 : 20,
  //         startDate: cells[11]
  //           ? cells[11].trim()
  //           : new Date().toISOString().split("T")[0],
  //         endDate: cells[12]
  //           ? cells[12].trim()
  //           : new Date().toISOString().split("T")[0],
  //         status: "In Progress",
  //         accountGroup: "DIR",
  //         burdenTemplateId: 2,
  //         ourRole: "prime",
  //         level: 1,
  //         version: 1,
  //         versionCode: "V1",
  //         escalationRate: 0,
  //       };
  //     });

  //     setInlineRows((prev) => [...newParsedRows, ...prev]);
  //     toast.success(
  //       `Pasted ${newParsedRows.length} row(s) into editable top area!`,
  //     );
  //   }
  // };

  // 1. Updated handlePasteFromClipboard
  const handlePasteFromClipboard = async () => {
    try {
      let pastedText = "";

      // Try reading from System Clipboard first (supports Excel copies)
      try {
        pastedText = await navigator.clipboard.readText();
      } catch (readErr) {
        console.warn(
          "System clipboard read restricted, falling back to state.",
        );
      }

      if (pastedText && pastedText.includes("\t")) {
        const lines = pastedText.trim().split(/\r\n|\n/);
        const startIndex = lines[0].toLowerCase().includes("business id")
          ? 1
          : 0;
        const dataLines = lines.slice(startIndex);

        if (dataLines.length > 0) {
          const parsedExcelRows = dataLines.map((line) => {
            const cells = line.split("\t");
            return {
              tempId: Date.now() + Math.random(),
              businessBudgetId: cells[0] ? cells[0].trim() : "",
              description: cells[1] ? cells[1].trim() : "",
              stage: cells[2] ? cells[2].trim() : "PLANNING",
              contractValue: cells[3]
                ? parseFloat(cells[3].replace(/,/g, "")) || 0
                : 0,
              contractTypes: cells[4]
                ? cells[4].trim()
                : revFormulaOptions[0]?.value || "",
              pwinValue: cells[5] ? parseFloat(cells[5]) || 100 : 100,
              orgId: cells[6] ? cells[6].trim() : orgOptions[0]?.orgId || "",
              accountGroup: cells[7] ? cells[7].trim() : "DIR", // Fixed index
              customer: cells[8] ? cells[8].trim() : "", // Fixed index
              onsiteLaborPercent: cells[9] ? parseFloat(cells[9]) || 0 : 40, // Fixed index
              offSiteLaborPercent: cells[10] ? parseFloat(cells[10]) || 0 : 40, // Fixed index
              nonLaborPercent: cells[11] ? parseFloat(cells[11]) || 0 : 20, // Fixed index
              startDate: formatDateForInput(cells[12]), // Fixed index
              endDate: formatDateForInput(cells[13]), // Fixed index
              status: "In Progress",
              burdenTemplateId: 2,
              ourRole: "prime",
              level: 1,
              version: 1,
              versionCode: "V1",
              escalationRate: 0,
            };
          });

          setInlineRows((prev) => [...parsedExcelRows, ...prev]);
          toast.success(
            `Pasted ${parsedExcelRows.length} new row(s) into editable area!`,
          );
          return;
        }
      }

      // Fallback to internally copied state
      if (clipboardRows.length > 0) {
        const freshRows = clipboardRows.map((row) => ({
          ...row,
          tempId: Date.now() + Math.random(),
        }));
        setInlineRows((prev) => [...freshRows, ...prev]);
        toast.success(`Pasted ${freshRows.length} row(s) into editable area!`);
      } else {
        toast.warn("No rows found in clipboard. Copy rows first.");
      }
    } catch (err) {
      console.error("Paste error:", err);
      toast.info("Clipboard is Empty or Invalid format");
    }
  };

  // 2. Updated handlePasteExcel
  const handlePasteExcel = (e) => {
    const clipboardData = e.clipboardData.getData("text");
    if (!clipboardData) return;

    const lines = clipboardData.trim().split(/\r\n|\n/);
    if (lines.length > 0 && lines[0].includes("\t")) {
      e.preventDefault();

      const newParsedRows = lines.map((line) => {
        const cells = line.split("\t");
        return {
          tempId: Date.now() + Math.random(),
          businessBudgetId: cells[0] ? cells[0].trim() : "",
          description: cells[1] ? cells[1].trim() : "",
          stage: cells[2] ? cells[2].trim() : "PLANNING",
          contractValue: cells[3]
            ? parseFloat(cells[3].replace(/,/g, "")) || 0
            : 0,
          contractTypes: cells[4]
            ? cells[4].trim()
            : revFormulaOptions[0]?.value || "",
          pwinValue: cells[5] ? parseFloat(cells[5]) || 100 : 100,
          orgId: cells[6] ? cells[6].trim() : orgOptions[0]?.orgId || "",
          accountGroup: cells[7] ? cells[7].trim() : "DIR", // Fixed index
          customer: cells[8] ? cells[8].trim() : "", // Fixed index
          onsiteLaborPercent: cells[9] ? parseFloat(cells[9]) || 0 : 40, // Fixed index
          offSiteLaborPercent: cells[10] ? parseFloat(cells[10]) || 0 : 40, // Fixed index
          nonLaborPercent: cells[11] ? parseFloat(cells[11]) || 0 : 20, // Fixed index
          startDate: cells[12]
            ? cells[12].trim()
            : new Date().toISOString().split("T")[0], // Fixed index
          endDate: cells[13]
            ? cells[13].trim()
            : new Date().toISOString().split("T")[0], // Fixed index
          status: "In Progress",
          burdenTemplateId: 2,
          ourRole: "prime",
          level: 1,
          version: 1,
          versionCode: "V1",
          escalationRate: 0,
        };
      });

      setInlineRows((prev) => [...newParsedRows, ...prev]);
      toast.success(
        `Pasted ${newParsedRows.length} row(s) into editable top area!`,
      );
    }
  };

  const handleClearInlineRows = () => {
    if (inlineRows.length === 0) {
      toast.info("No unsaved rows to clear.");
      return;
    }

    setInlineRows([]);
    toast.info("Cleared all unsaved rows.");
  };

  return (
    <div
      className="p-1 sm:p-2 space-y-2 text-sm sm:text-base text-gray-800 font-inter"
      onPaste={handlePasteExcel}
    >
      <div className="flex flex-col gap-2 ">
        <div className="flex items-center gap-2 bg-white rounded-sm p-4">
          <BriefcaseBusiness size={20} className="text-blue-600" />
          <h2 className="text-lg font-bold text-gray-800">
            {title || "Manage New Business"}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 relative w-full sm:w-auto">
          <label className="input-label">Business ID:</label>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              className="border outline-none border-gray-300 rounded px-2 py-1.5 text-xs sm:text-sm bg-white shadow-inner w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
              autoComplete="off"
            />
          </div>
          <button
            onClick={handleSearch}
            className="btn1 btn-blue cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      <div className="space-y-4 sm:p-4 rounded p-2 bg-white mb-1">
        <div className="flex items-center mb-2 gap-2 w-full flex-wrap">
          {isEditable && (
            <>
              <button
                onClick={handleAddNewRow}
                className="btn1 btn-blue shrink-0 flex items-center gap-1"
              >
                {/* <Plus size={16} /> */}
                New
              </button>

              <button
                onClick={handleCopySelectedRows}
                disabled={selectedRows.size === 0}
                className="btn1 btn-blue shrink-0 flex items-center gap-1 disabled:opacity-50"
                title="Copy Checked Rows"
              >
                {/* <Copy size={16} /> */}
                Copy ({selectedRows.size})
              </button>

              <button
                onClick={handlePasteFromClipboard}
                className="btn1 btn-blue shrink-0 flex items-center gap-1"
                title="Paste Rows from Clipboard"
              >
                Paste
              </button>
              {/* Clear Button */}
              <button
                onClick={handleClearInlineRows}
                disabled={inlineRows.length === 0}
                className="btn1 btn-blue shrink-0 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Clear all newly added draft rows"
              >
                Clear
              </button>

              {inlineRows.length > 0 && (
                <button
                  onClick={handleSaveAllInlineRows}
                  disabled={isSaving}
                  className="btn1 btn-blue shrink-0 flex items-center gap-1"
                >
                  {/* <Save size={16} />{" "} */}
                  {isSaving ? "Saving" : `Save (${inlineRows.length})`}
                </button>
              )}
            </>
          )}

          <div
            className={`flex gap-1 items-center ${showDelete ? "inline" : "hidden"}`}
          >
            {dataItem.length < 2 && isEditable && (
              <button
                className="btn1 btn-blue mr-2"
                title="Edit"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(dataItem[0]);
                }}
                disabled={!showEdit || showNewBusinessPopup}
              >
                Edit
              </button>
            )}
            {isEditable && (
              <button
                onClick={handleDelete}
                className="btn1 px-4 py-1.5 btn-red"
                title="Delete"
                disabled={
                  editNewBusinessPopup || showNewBusinessPopup || isDeleting
                }
              >
                {isDeleting ? "Deleting..." : `Delete (${selectedRows.size})`}
              </button>
            )}
          </div>
        </div>

        <div className="rounded border border-gray-200 overflow-hidden relative">
          {showNewBusinessPopup && isEditable && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative top-8 bg-white w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col animate-premium-popup shadow-2xl rounded">
                <div className="overflow-y-auto p-4 custom-scrollbar">
                  <NewBusiness
                    mode={"business"}
                    onClose={() => setShowNewBusinessPopup(false)}
                    selectedBusiness={null}
                    setDataItem={setDataItem}
                    onSaveSuccess={handleNewBusinessSave}
                  />
                </div>
              </div>
            </div>
          )}

          {editNewBusinessPopup && isEditable && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative top-8 bg-white w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col animate-premium-popup shadow-2xl rounded">
                <div className="overflow-y-auto p-4 custom-scrollbar">
                  <NewBusiness
                    mode={"business"}
                    onClose={() => setEditNewBusinessPopup(false)}
                    selectedBusiness={selectedBusiness}
                    setDataItem={setDataItem}
                    onSaveSuccess={handleNewBusinessSave}
                  />
                </div>
              </div>
            </div>
          )}

          <div
            className={`overflow-x-auto max-h-[70vh] min-h-[70vh] ${showNewBusinessPopup ? "pointer-events-none" : ""}`}
          >
            <table className="min-w-full table-auto divide-gray-200">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  {isEditable && (
                    <th className="th-thead w-10">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                      />
                    </th>
                  )}
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="th-thead text-xs font-bold text-gray-600 text-center"
                    >
                      {COLUMN_LABELS[col] || col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {inlineRows.map((inlineRow) => {
                  const inlineContractVal =
                    Number(inlineRow.contractValue) || 0;
                  const inlinePwin = Number(inlineRow.pwinValue) || 0;
                  const inlineRevenue = inlineContractVal * (inlinePwin / 100);
                  const inlineSubAmt =
                    inlineRevenue *
                    ((Number(inlineRow.onsiteLaborPercent) || 0) / 100);
                  const inlineDirectAmt =
                    inlineRevenue *
                    ((Number(inlineRow.offSiteLaborPercent) || 0) / 100);
                  const inlineOdcAmt =
                    inlineRevenue *
                    ((Number(inlineRow.nonLaborPercent) || 0) / 100);

                  return (
                    <tr
                      key={inlineRow.tempId}
                      className="bg-blue-50 border-b-2 border-blue-300"
                    >
                      {isEditable && (
                        <td className="p-1 text-center">
                          <button
                            onClick={() =>
                              handleRemoveInlineRow(inlineRow.tempId)
                            }
                            className="text-gray-900 p-1"
                            title="Discard Row"
                          >
                            <X size={12} />
                          </button>
                        </td>
                      )}
                      <td className="p-1">
                        <input
                          type="text"
                          placeholder="New ID *"
                          className="w-24 border border-blue-400 rounded px-1.5 py-1 text-xs outline-none bg-white font-semibold"
                          value={inlineRow.businessBudgetId}
                          onChange={(e) =>
                            handleInlineInputChange(
                              inlineRow.tempId,
                              "businessBudgetId",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          placeholder="Description *"
                          className="w-64 border rounded px-1.5 py-1 text-xs outline-none bg-white"
                          value={inlineRow.description}
                          onChange={(e) =>
                            handleInlineInputChange(
                              inlineRow.tempId,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="p-1">
                        <select
                          className="w-32 border rounded px-1 py-1 text-xs outline-none bg-white"
                          value={inlineRow.stage}
                          onChange={(e) =>
                            handleInlineInputChange(
                              inlineRow.tempId,
                              "stage",
                              e.target.value,
                            )
                          }
                        >
                          {stageOptions.map((st) => (
                            <option key={st.value} value={st.value}>
                              {st.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          className="w-28 border rounded px-1.5 py-1 text-xs text-right outline-none bg-white"
                          value={inlineRow.contractValue}
                          onChange={(e) =>
                            handleInlineInputChange(
                              inlineRow.tempId,
                              "contractValue",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="p-1">
                        <select
                          className="w-36 border rounded px-1 py-1 text-xs outline-none bg-white"
                          value={inlineRow.contractTypes}
                          onChange={(e) =>
                            handleInlineInputChange(
                              inlineRow.tempId,
                              "contractTypes",
                              e.target.value,
                            )
                          }
                        >
                          {revFormulaOptions.map((rf) => (
                            <option key={rf.value} value={rf.value}>
                              {rf.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          className="w-16 border rounded px-1.5 py-1 text-xs text-right outline-none bg-white"
                          value={inlineRow.pwinValue}
                          onChange={(e) =>
                            handleInlineInputChange(
                              inlineRow.tempId,
                              "pwinValue",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="p-1 text-right text-xs font-semibold px-2">
                        {formatWithCommas(inlineRevenue.toFixed(2))}
                      </td>
                      <td className="p-1">
                        <select
                          className="w-36 border rounded px-1 py-1 text-xs outline-none bg-white"
                          value={inlineRow.orgId}
                          onChange={(e) =>
                            handleInlineInputChange(
                              inlineRow.tempId,
                              "orgId",
                              e.target.value,
                            )
                          }
                        >
                          {orgOptions.map((org) => (
                            <option key={org.orgId} value={org.orgId}>
                              {org.orgId} - {org.orgName}
                            </option>
                          ))}
                        </select>
                      </td>
                      {/* ⭐ ADDED: Account Group Dropdown Field */}
                      <td className="p-1">
                        <select
                          className="w-28 border rounded px-1 py-1 text-xs outline-none bg-white"
                          value={inlineRow.accountGroup}
                          onChange={(e) =>
                            handleInlineInputChange(
                              inlineRow.tempId,
                              "accountGroup",
                              e.target.value,
                            )
                          }
                        >
                          {accountGroupOptions.map((accGroup, idx) => (
                            <option key={idx} value={accGroup}>
                              {accGroup}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          placeholder="Customer"
                          className="w-28 border rounded px-1.5 py-1 text-xs outline-none bg-white"
                          value={inlineRow.customer}
                          onChange={(e) =>
                            handleInlineInputChange(
                              inlineRow.tempId,
                              "customer",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          className="w-16 border rounded px-1.5 py-1 text-xs text-right outline-none bg-white"
                          value={inlineRow.onsiteLaborPercent}
                          onChange={(e) =>
                            handleInlineInputChange(
                              inlineRow.tempId,
                              "onsiteLaborPercent",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="p-1 text-right text-xs font-semibold px-2">
                        {formatWithCommas(inlineSubAmt.toFixed(2))}
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          className="w-16 border rounded px-1.5 py-1 text-xs text-right outline-none bg-white"
                          value={inlineRow.offSiteLaborPercent}
                          onChange={(e) =>
                            handleInlineInputChange(
                              inlineRow.tempId,
                              "offSiteLaborPercent",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="p-1 text-right text-xs font-semibold px-2">
                        {formatWithCommas(inlineDirectAmt.toFixed(2))}
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          className="w-16 border rounded px-1.5 py-1 text-xs text-right outline-none bg-white"
                          value={inlineRow.nonLaborPercent}
                          onChange={(e) =>
                            handleInlineInputChange(
                              inlineRow.tempId,
                              "nonLaborPercent",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="p-1 text-right text-xs font-semibold px-2">
                        {formatWithCommas(inlineOdcAmt.toFixed(2))}
                      </td>
                      <td className="p-1">
                        <input
                          type="date"
                          className="w-28 border rounded px-1 py-1 text-xs outline-none bg-white"
                          value={inlineRow.startDate}
                          onChange={(e) =>
                            handleInlineInputChange(
                              inlineRow.tempId,
                              "startDate",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="date"
                          className="w-28 border rounded px-1 py-1 text-xs outline-none bg-white"
                          value={inlineRow.endDate}
                          onChange={(e) =>
                            handleInlineInputChange(
                              inlineRow.tempId,
                              "endDate",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          className="w-20 px-1.5 py-1 text-xs outline-none whitespace-nowrap"
                          disabled
                          value={inlineRow.status}
                          onChange={(e) =>
                            handleInlineInputChange(
                              inlineRow.tempId,
                              "status",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                    </tr>
                  );
                })}

                {isLoading ? (
                  <tr>
                    <td colSpan={columns.length + 1}>
                      <div className="flex items-center justify-center py-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 mt-4">
                          Loading project plans...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : isDeleting ? (
                  <tr>
                    <td colSpan={columns.length + 1}>
                      <div className="flex items-center justify-center py-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 mt-4">Deleting.....</span>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 &&
                  inlineRows.length === 0 &&
                  searchTerm.trim() === "" ? (
                  <tr>
                    <td colSpan={columns.length + 1}>
                      <div className="p-8 text-center text-gray-500 text-lg">
                        Search and select a valid Project to view details
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((item) => {
                    const contractValue = Number(item.contractValue) || 0;
                    const pwinPercent = Number(item.pwinValue) || 0;
                    const revenueAmt = contractValue * (pwinPercent / 100);

                    const subPercent = Number(item.onsiteLaborPercent) || 0;
                    const directLaborPercent =
                      Number(item.offSiteLaborPercent) || 0;
                    const odcPercent = Number(item.nonLaborPercent) || 0;

                    const subcontractorAmt = revenueAmt * (subPercent / 100);
                    const directLaborAmt =
                      revenueAmt * (directLaborPercent / 100);
                    const odcAmt = revenueAmt * (odcPercent / 100);

                    return (
                      <tr
                        key={item.businessBudgetId}
                        onDoubleClick={() => handleEdit(item)}
                        className={`cursor-pointer hover:bg-blue-50 ${
                          selectedRows.has(item.businessBudgetId)
                            ? "bg-blue-200"
                            : "bg-white"
                        }`}
                      >
                        {isEditable && (
                          <td className="tbody-td-fun">
                            <input
                              type="checkbox"
                              checked={selectedRows.has(item.businessBudgetId)}
                              onChange={(e) => {
                                e.stopPropagation();
                                const isChecked = e.target.checked;
                                toggleRow(item);
                                setDataItem((prev) =>
                                  isChecked
                                    ? [...prev, item]
                                    : prev.filter(
                                        (i) =>
                                          i.businessBudgetId !==
                                          item.businessBudgetId,
                                      ),
                                );
                              }}
                            />
                          </td>
                        )}

                        {columns.map((col, idx) => {
                          const isNumericField = [
                            "contractValue",
                            "revenue",
                            "subcontractorAmt",
                            "directLaborAmt",
                            "odcAmt",
                          ].includes(col);

                          return (
                            <td
                              key={idx}
                              className={`px-2 py-1 text-xs border-r border-b font-normal border-gray-300 text-gray-900 ${
                                col === "description"
                                  ? "text-left min-w-[300px] break-words"
                                  : isNumericField
                                    ? "text-right whitespace-nowrap"
                                    : "text-center"
                              } ${
                                [
                                  "startDate",
                                  "endDate",
                                  "trf_ProjId",
                                  "businessBudgetId",
                                  "stage",
                                  "status",
                                ].includes(col)
                                  ? "whitespace-nowrap"
                                  : ""
                              }`}
                            >
                              {col === "startDate" || col === "endDate" ? (
                                item[col] ? (
                                  (() => {
                                    const [year, month, day] = item[col]
                                      .split("T")[0]
                                      .split("-");
                                    return `${month}/${day}/${year}`;
                                  })()
                                ) : (
                                  ""
                                )
                              ) : col === "contractValue" ? (
                                formatWithCommas(item[col])
                              ) : col === "pwinValue" ? (
                                `${(item[col] ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}%`
                              ) : col === "revenue" ? (
                                formatWithCommas(revenueAmt.toFixed(2))
                              ) : col === "subcontractorAmt" ? (
                                formatWithCommas(subcontractorAmt.toFixed(2))
                              ) : col === "directLaborAmt" ? (
                                formatWithCommas(directLaborAmt.toFixed(2))
                              ) : col === "odcAmt" ? (
                                formatWithCommas(odcAmt.toFixed(2))
                              ) : col === "onsiteLaborPercent" ||
                                col === "offSiteLaborPercent" ||
                                col === "nonLaborPercent" ? (
                                item[col] !== null &&
                                item[col] !== undefined &&
                                item[col] !== "" ? (
                                  `${item[col]}%`
                                ) : (
                                  ""
                                )
                              ) : col === "isActive" ? (
                                <input
                                  type="checkbox"
                                  checked={!!item[col]}
                                  readOnly
                                  className="h-3 w-3 accent-blue-600 cursor-default"
                                />
                              ) : (
                                item[col]
                              )}
                            </td>
                          );
                        })}
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
  );
};

export default NewBusinessComponent;
