// import React, { useEffect, useState } from "react";
// import { backendUrl } from "./config";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { formatDate } from "./utils";
// import ProjectDetail from "./ProjectDetail";
// import { Filter, MinusIcon, PlusIcon, Projector } from "lucide-react";

// const ProjectExpandableTable = () => {
//   const [data, setData] = useState([]);
//   const [isActionLoading, setIsActionLoading] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [selectedRows, setSelectedRows] = useState(new Set());
//   const [templates, setTemplates] = useState([]);
//   const [selectedPlan, setSelectedPlan] = useState({});
//   const [templateMap, setTemplateMap] = useState({});
//   const [hoursColumnTotalsFromHours, setHoursColumnTotalsFromHours] = useState(
//     {},
//   );
//   const [statusFilter, setStatusFilter] = useState("");
//   const [otherColumnTotalsFromAmounts, setOtherColumnTotalsFromAmounts] =
//     useState({});

//   const COLUMN_LABELS = {
//     selection: "",
//     projId: "Project ID",
//     projName: "Project Name",
//     plType: "BUD/EAC",
//     version: "Revision",
//     versionCode: "Version Type",
//     source: "Origin",
//     templateId: "Template ID",
//     status: "Status",
//     projectStartDate: "Start Date",
//     projectEndDate: "End Date",
//   };

//   const [expandedRows, setExpandedRows] = useState(new Set());
//   const [activeTabs, setActiveTabs] = useState({}); // 'hours' or 'amounts'

//   const toggleRow = (plan) => {
//     setExpandedRows((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(plan.plId)) {
//         newSet.delete(plan.plId);
//       } else {
//         newSet.add(plan.plId);
//       }
//       return newSet;
//     });

//     // Note: Since multiple rows are open, 'selectedPlan' might
//     // need to be handled locally within the map or as an object/map
//     // if ProjectDetail relies on a global 'selectedPlan' state.
//     setSelectedPlan(plan);
//   };

//   const closeRow = (plId) => {
//     setExpandedRows((prev) => {
//       const newSet = new Set(prev);
//       newSet.delete(plId);
//       return newSet;
//     });
//   };

//   const getTemplateName = (id) =>
//     templates.find((t) => t.id === id)?.templateCode || "";

//   useEffect(() => {
//     const fetchTemplates = async () => {
//       try {
//         const res = await axios.get(
//           `${backendUrl}/Orgnization/GetAllTemplates`,
//         );
//         const data = Array.isArray(res.data) ? res.data : [];
//         setTemplates(data);

//         const map = {};
//         data.forEach((t) => {
//           // choose what to display; here using templateCode - description
//           // map[t.id] = `${t.templateCode} - ${t.description}`;
//           map[t.id] = `${t.templateCode}`;
//         });
//         setTemplateMap(map);
//       } catch (err) {
//         // toast.error("Failed to load templates.");
//       }
//     };

//     fetchTemplates();
//   }, []);

//   // Derived state for the filtered list
//   const filteredData = statusFilter
//     ? data.filter((plan) => plan.status === statusFilter) // Matches the select value
//     : data;

//   // Reset handler
//   const handleReset = () => {
//     setStatusFilter("");
//   };

//   const toggleRowSelection = (plan) => {
//     setSelectedPlan(plan);
//     setSelectedRows((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(plan.plId)) {
//         newSet.delete(plan.plId);
//       } else {
//         newSet.add(plan.plId);
//       }
//       return newSet;
//     });

//     // Optional callback for your usage
//     if (typeof onPlanSelect === "function") {
//       onPlanSelect(selectedRows.has(plan.plId) ? null : plan);
//     }
//   };

//   const getCurrentUserContext = () => {
//     try {
//       const userString = localStorage.getItem("currentUser");
//       if (!userString) return { userId: "", role: "" };
//       const userObj = JSON.parse(userString);
//       return {
//         userId: userObj.userId ?? "",
//         role: userObj.role ?? "",
//       };
//     } catch {
//       return { userId: "", role: "" };
//     }
//   };

//   const { userId, role } = getCurrentUserContext();

//   const getAllData = async () => {
//     setIsActionLoading(true);
//     try {
//       const response = await axios.get(
//         `${backendUrl}/Project/MassUtilityGetAllPlans?UserId=${userId}&Role=${role}`,
//         {
//           params: { search: "", type: "", status: "", active: "" },
//         },
//       );

//       if (response.data) {
//         // 1. Transform the data as you were doing
//         const transformed = response.data.map((p) => ({
//           ...p,
//           plId: p.plId || p.id,
//           status: (p.status || "In Progress")
//             .replace("Working", "In Progress")
//             .replace("Completed", "Submitted"),
//         }));

//         // 2. Filter to keep only the highest version for each projId
//         const topVersionData = Object.values(
//           transformed.reduce((acc, current) => {
//             const existing = acc[current.projId];

//             // If this project ID hasn't been seen yet, OR
//             // if this current item has a higher version than what we stored, replace it.
//             if (!existing || current.version > existing.version) {
//               acc[current.projId] = current;
//             }

//             return acc;
//           }, {}),
//         );

//         console.log("Filtered Top Versions:", topVersionData);
//         setData(topVersionData);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load project plans.");
//     } finally {
//       setIsActionLoading(false);
//     }
//   };
//   useEffect(() => {
//     getAllData();
//   }, []);

//   // Each ID will look like: { "101": { labor: true, amount: false } }
//   const [rowViews, setRowViews] = useState({});

//   return (
//     <div className="w-full min-h-screen">
//       <div className="bg-white rounded shadow-sm border border-gray-200 mb-2 overflow-hidden">
//         <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
//           <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//             <Projector size={20} className="text-blue-600" /> Projects
//           </h2>
//           <div className="flex item-center gap-2">
//             <div className="flex items-center gap-1">
//               <span className="text-xs font-bold text-gray-500">Status</span>
//               <select
//                 className="border border-gray-300 rounded px-1 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100  "
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 disabled={data.length === 0}
//               >
//                 <option value="">All</option>
//                 <option value="In Progress">In Progress</option>
//                 <option value="Submitted">Submitted</option>
//                 <option value="Approved">Approved</option>
//                 <option value="Concluded">Concluded</option>
//               </select>
//             </div>
//             <button className="btn1 btn-blue" onClick={handleReset}>
//               Reset
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto max-h-[80vh]">
//           <table className="w-full table">
//             <thead className="h-7 thead z-[99] fixed">
//               <tr>
//                 <th className="th-thead w-10">
//                   {/* <input
//                         type="checkbox"
//                         className="th-thead"
//                         checked={isAllSelected}
//                         onChange={toggleSelectAll}
//                       /> */}
//                 </th>
//                 {Object.entries(COLUMN_LABELS).map(([key, label]) => {
//                   if (key === "selection") return null;

//                   // const isLeftCol = key === "projName" || key === "projId"

//                   return (
//                     <th
//                       key={key}
//                       className={"th-thead capitalize "}
//                       // style={{
//                       //   textAlign:
//                       //     key === "projId" || key === "projName"
//                       //       ? "left"
//                       //       : "center",
//                       // }}
//                     >
//                       {label}
//                     </th>
//                   );
//                 })}
//               </tr>
//             </thead>

//             <tbody className="tbody">
//               {/* Global processing state */}
//               {isActionLoading && (
//                 <tr>
//                   <td colSpan={11} className="py-8">
//                     <div className="flex items-center justify-center">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
//                       <span className="ml-2 text-sm text-gray-700">
//                         Processing...
//                       </span>
//                     </div>
//                   </td>
//                 </tr>
//               )}

//               {/* Loading state */}
//               {!isActionLoading && loading && (
//                 <tr>
//                   <td
//                     colSpan={11}
//                     className="text-center py-20 text-gray-400 animate-pulse"
//                   >
//                     Loading mass project data...
//                   </td>
//                 </tr>
//               )}

//               {/* Empty state */}
//               {!isActionLoading && !loading && data.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan={11}
//                     className="text-center py-20 text-gray-400 font-medium"
//                   >
//                     No projects found. Try adjusting your filters.
//                   </td>
//                 </tr>
//               )}

//               {/* Data rows */}
//               {!isActionLoading &&
//                 !loading &&
//                 filteredData.length > 0 &&
//                 filteredData.map((plan) => (
//                   <React.Fragment key={plan.plId}>
//                     <tr
//                       className={`cursor-pointer transition-colors ${
//                         expandedRows.has(plan.plId) // Changed from ===
//                           ? "bg-blue-50/50"
//                           : "hover:bg-gray-50"
//                       }`}
//                       onClick={() => toggleRow(plan)}
//                     >
//                       <td
//                         className="tbody-td"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             toggleRow(plan);
//                           }}
//                           className="p-1 hover:bg-gray-200 rounded-full transition-all duration-300 ease-in-out cursor-pointer"
//                         >
//                           <div
//                             className={`transition-transform duration-300 ${
//                               expandedRows.has(plan.plId)
//                                 ? "rotate-180"
//                                 : "rotate-0"
//                             }`}
//                           >
//                             {expandedRows.has(plan.plId) ? (
//                               <MinusIcon size={16} className="text-[#17414d]" />
//                             ) : (
//                               <PlusIcon size={16} className="text-[#17414d]" />
//                             )}
//                           </div>
//                         </button>
//                       </td>
//                       <td className="px-2 py-1 text-xs border-r border-b border-gray-300 text-black ">
//                         {plan.projId}
//                       </td>
//                       <td className="px-2 py-1 text-xs border-r border-b border-gray-300 text-black ">
//                         {plan.projName}
//                       </td>
//                       <td className="tbody-td text-center">{plan.plType}</td>
//                       <td className="tbody-td text-center">{plan.version}</td>
//                       <td className="tbody-td text-center">
//                         {plan.versionCode}
//                       </td>
//                       <td className="tbody-td text-center">{plan.source}</td>
//                       <td className="tbody-td text-center">
//                         {getTemplateName(plan.templateId || 0)}
//                       </td>
//                       <td className="px-2 py-2 text-xs border-r border-gray-300 text-black text-center whitespace-nowrap">
//                         <span
//                           className={`px-3 py-1 rounded-full text-[12px] capitalize tracking-tighter
//                       ${
//                         plan.status === "Approved"
//                           ? "bg-green-100 text-black"
//                           : plan.status === "In Progress"
//                             ? "bg-red-100 text-black"
//                             : plan.status === "Concluded"
//                               ? "bg-blue-200 text-black"
//                               : plan.status === "Submitted"
//                                 ? "bg-yellow-100 text-black"
//                                 : "bg-amber-50 text-amber-700 border-amber-200"
//                       }`}
//                         >
//                           {plan.status}
//                         </span>
//                       </td>
//                       <td className="tbody-td text-center">
//                         {formatDate(plan.projStartDt)}
//                       </td>
//                       <td className="tbody-td text-center">
//                         {formatDate(plan.projEndDt)}
//                       </td>
//                     </tr>

//                     {expandedRows.has(plan.plId) && (
//                       <tr>
//                         <td
//                           colSpan={11}
//                           className="bg-gray-50 p-4 border-b border-gray-300"
//                         >
//                           <div className="flex gap-4 min-h-[400px]">
//                             {/* LEFT SIDE: Vertical Navigation "Rows" */}
//                             {/* LEFT SIDE: Vertical Navigation */}
//                             <div className="flex flex-col gap-2 w-20 shrink-0">
//                               {/* Labor Button */}
//                               <button
//                                 onClick={() => {
//                                   setRowViews((prev) => ({
//                                     ...prev,
//                                     [plan.plId]: {
//                                       ...prev[plan.plId],
//                                       labor: !prev[plan.plId]?.labor,
//                                     },
//                                   }));
//                                 }}
//                                 className={`flex items-center justify-between px-1 py-1 text-[10px] font-bold rounded-l-md border-l-4 transition-all ${
//                                   rowViews[plan.plId]?.labor
//                                     ? "bg-white text-[#17414d] border-[#17414d] shadow-sm"
//                                     : "bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200"
//                                 }`}
//                               >
//                                 <span>Labor</span>
//                                 {rowViews[plan.plId]?.labor && <span>→</span>}
//                               </button>

//                               {/* Direct Cost Button */}
//                               <button
//                                 onClick={() => {
//                                   setRowViews((prev) => ({
//                                     ...prev,
//                                     [plan.plId]: {
//                                       ...prev[plan.plId],
//                                       amount: !prev[plan.plId]?.amount,
//                                     },
//                                   }));
//                                 }}
//                                 className={`flex items-center justify-between px-1 py-1 text-[10px] font-bold rounded-l-md border-l-4 transition-all ${
//                                   rowViews[plan.plId]?.amount
//                                     ? "bg-white text-[#17414d] border-[#17414d] shadow-sm"
//                                     : "bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200"
//                                 }`}
//                               >
//                                 <span>Direct Cost</span>
//                                 {rowViews[plan.plId]?.amount && <span>→</span>}
//                               </button>
//                             </div>

//                             {/* RIGHT SIDE: Content Area */}
//                             {/* RIGHT SIDE: Content Area */}
//                             <div className="flex-1 bg-white p-2 rounded-r-md rounded-b-md">
//                               {/* Check if at least one button is active for this row */}
//                               {rowViews[plan.plId]?.labor ||
//                               rowViews[plan.plId]?.amount ? (
//                                 <div className="animate-in fade-in slide-in-from-left-2 duration-300">
//                                   <ProjectDetail
//                                     selectedPlan={plan} // Row-specific data
//                                     fiscalYear={2026}
//                                     // Dynamic Props:
//                                     // If 'labor' button is clicked, hours becomes true.
//                                     // If 'amount' button is clicked, amount becomes true.
//                                     hours={!!rowViews[plan.plId]?.labor}
//                                     amount={!!rowViews[plan.plId]?.amount}
//                                     indirect={false}
//                                     hoursColumnTotals={
//                                       hoursColumnTotalsFromHours
//                                     }
//                                     otherColumnTotals={
//                                       otherColumnTotalsFromAmounts
//                                     }
//                                     onColumnTotalsChange={
//                                       setHoursColumnTotalsFromHours
//                                     }
//                                     onColumnAmtTotalsChange={
//                                       setOtherColumnTotalsFromAmounts
//                                     }
//                                     setRefreshPool={false}
//                                     refreshKey={false}
//                                     setRefreshKey={false}
//                                     refreshPool={false}
//                                   />
//                                 </div>
//                               ) : (
//                                 /* Empty State: Shown when no buttons are selected */
//                                 <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
//                                   Select Labor or Direct Cost to view details.
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectExpandableTable;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { backendUrl } from "./config";
import axios from "axios";
import { toast } from "react-toastify";
import { formatDate } from "./utils";
import ProjectDetail from "./ProjectDetail";
import {
  Filter,
  FolderGit2,
  MinusIcon,
  PlusIcon,
  Projector,
} from "lucide-react";

const ProjectExpandableTable = () => {
  const [data, setData] = useState([]);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [templates, setTemplates] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [templateMap, setTemplateMap] = useState({});
  const [hoursColumnTotalsFromHours, setHoursColumnTotalsFromHours] = useState(
    {},
  );
  const [refreshPool, setRefreshPool] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [durations, setDurations] = useState([]);
  const [fiscalYear, setFiscalYear] = useState("");
  const [fiscalYearOptions, setFiscalYearOptions] = useState([]);

  const [plans, setPlans] = useState([]);

  const [allMonthlyData, setAllMonthlyData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [otherColumnTotalsFromAmounts, setOtherColumnTotalsFromAmounts] =
    useState({});

  const [refreshData, setRefreshData] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);

  // This stores what the user selected (e.g., "2026")
  const [fiscalYearMap, setFiscalYearMap] = useState({});

  const [typeFilter, setTypeFilter] = useState("");

  // This stores the dropdown list (e.g., ["All", "2024", "2025", "2026"])
  const [fiscalYearOptionsMap, setFiscalYearOptionsMap] = useState({});
  const [inputValue, setInputValue] = useState(""); // What the user types
  const [committedSearch, setCommittedSearch] = useState(""); // Used for filtering after button click

  const [searchQuery, setSearchQuery] = useState(""); // Holds what the user is typing
  const [activeFilter, setActiveFilter] = useState(""); // Only updates on button click/Enter

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      // Trim to avoid accidental space issues
      setActiveFilter(searchQuery.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const COLUMN_LABELS = {
    selection: "",
    projId: "Project ID",
    projName: "Project Name",
    plType: "BUD/EAC",
    version: "Revision",
    isCompleted: "Submitted",
    isApproved: "Approved",
    finalVersion: "Concluded",
    status: "Status",
    projectStartDate: "Start Date",
    projectEndDate: "End Date",
  };

  const [expandedRows, setExpandedRows] = useState(new Set());
  const [activeTabs, setActiveTabs] = useState({}); // 'hours' or 'amounts'

  const [expandedTasks, setExpandedTasks] = useState(new Set());

  const prevRefreshPool = useRef(refreshPool);

  // const getUniqueKey = (item) =>
  //   `${item.projId}_${item.version}_${item.status}`;
  const getUniqueKey = (item) =>
    `${item.projId}_${item.plType}_${item.version}_${item.Status}`;

  const toggleTask = (task) => {
    const taskKey = getUniqueKey(task);

    setExpandedTasks((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(taskKey)) {
        newSet.delete(taskKey);
      } else {
        newSet.add(taskKey);
      }

      return newSet;
    });
  };

  const getYear = (dateStr) => {
    if (!dateStr) return null;

    // MM/DD/YYYY
    if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      return Number(parts[2]);
    }

    // YYYY-MM-DD or ISO
    return Number(dateStr.substring(0, 4));
  };

  const normalizedFiscalYear =
    fiscalYear === "All" || !fiscalYear ? "All" : String(fiscalYear).trim();

  const fetchAndSetLaborCost = async () => {
    if (!selectedPlan?.plId) return; // Don't fetch if no plan is selected
    const projId = selectedPlan.projId;

    const isDirtyEvent = refreshPool !== prevRefreshPool.current;
    prevRefreshPool.current = refreshPool;

    // Only skip if data exists AND the refreshPool hasn't been toggled
    if (allMonthlyData[projId]?.length > 0 && !isDirtyEvent) {
      return;
    }
    try {
      const planType = selectedPlan?.plType || "";
      const planId = selectedPlan?.plId;
      const projId = selectedPlan?.projId;
      const apiPlanType = planType === "NBBUD" ? "BUD" : planType;

      const response = await axios.get(
        `${backendUrl}/Forecast/GetMonthlyDataV1?planID=${planId}&planType=${apiPlanType}`,
      );

      const data = response?.data;

      // Ensure we have an array to work with
      const validData = Array.isArray(data) ? data : [];

      // Update state by keying it to the planId
      setAllMonthlyData((prev) => ({
        ...prev,
        [projId]: validData, // Store the array under the specific Project ID
      }));
    } catch (error) {
      console.error("Failed to fetch labor cost data", error);
      // Optional: don't clear everything on error, just this plan's entry
      setAllMonthlyData((prev) => ({
        ...prev,
        [selectedPlan.projId]: [],
      }));
    }
  };
  useEffect(() => {
    fetchAndSetLaborCost();
  }, [selectedPlan, refreshPool]);

  const toggleRow = (plan) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(plan.projId)) {
        // 1. If clicking the same parent, just collapse it
        newSet.delete(plan.projId);
        // Optional: If you want tasks to collapse when the parent collapses:
        setExpandedTasks(new Set());
      } else {
        // 2. Clear everything to ensure "only one parent at a time"
        newSet.clear();

        // 3. CRITICAL: Clear the task expansion state so old tasks from
        // the previous parent don't stay "open" in the background
        setExpandedTasks(new Set());

        // 4. Add the new parent
        newSet.add(plan.projId);
      }

      // Reset selected plan
      setSelectedPlan(null);

      return newSet;
    });
  };

  const closeRow = (plId) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      newSet.delete(plId);
      return newSet;
    });
  };

  const getTemplateName = (id) =>
    templates.find((t) => t.id === id)?.templateCode || "";

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/Orgnization/GetAllTemplates`,
        );
        const data = Array.isArray(res.data) ? res.data : [];
        setTemplates(data);

        const map = {};
        data.forEach((t) => {
          // choose what to display; here using templateCode - description
          // map[t.id] = `${t.templateCode} - ${t.description}`;
          map[t.id] = `${t.templateCode}`;
        });
        setTemplateMap(map);
      } catch (err) {
        // toast.error("Failed to load templates.");
      }
    };

    fetchTemplates();
  }, []);

  // Derived state for the filtered list
  // const filteredData = statusFilter
  // ? data
  //     .map((parent) => {
  //       // 1. Filter the tasks inside this parent based on status
  //       const filteredTasks = parent.tasks.filter(
  //         (task) => task.status === statusFilter,
  //       );

  //       // 2. Check if the parent itself matches the status
  //       const parentMatches = parent.status === statusFilter;

  //       // 3. Return a copy of the parent with only the matching tasks
  //       if (parentMatches || filteredTasks.length > 0) {
  //         return {
  //           ...parent,
  //           tasks: filteredTasks,
  //         };
  //       }
  //       return null; // Exclude this parent group entirely
  //     })
  //     .filter((item) => item !== null) // Remove the null entries
  // : data;

  // const filteredData =
  //   statusFilter || typeFilter
  //     ? data
  //         .map((parent) => {
  //           // 1. Helper function to check if a plan matches the Type Filter
  //           const matchesType = (item) => {
  //             if (!typeFilter) return true; // No filter applied
  //             if (typeFilter === "BUD/EAC") {
  //               return item.plType === "BUD" || item.plType === "EAC";
  //             }
  //             return item.plType === typeFilter;
  //           };

  //           // 2. Helper function to check if a plan matches the Status Filter
  //           const matchesStatus = (item) => {
  //             if (!statusFilter) return true;
  //             return item.status === statusFilter;
  //           };

  //           // 3. Combined Filter for Tasks
  //           const filteredTasks = parent.tasks.filter(
  //             (task) => matchesStatus(task) && matchesType(task),
  //           );

  //           // 4. Check if the parent itself matches both filters
  //           const parentMatches = matchesStatus(parent) && matchesType(parent);

  //           // 5. Return parent only if it matches or has matching children
  //           if (parentMatches || filteredTasks.length > 0) {
  //             return {
  //               ...parent,
  //               tasks: filteredTasks,
  //             };
  //           }
  //           return null;
  //         })
  //         .filter((item) => item !== null)
  //     : data;

  const filteredData =
    statusFilter || typeFilter || searchQuery
      ? data
          .map((parent) => {
            // Use the LIVE searchQuery state here
            const lowerFilter = searchQuery.toLowerCase().trim();

            // 1. Does the parent match? (Always true if search is empty)
            const parentMatchesSearch =
              !lowerFilter || parent.projId.toLowerCase().includes(lowerFilter);

            const matchesType = (item) => {
              if (!typeFilter) return true;
              if (typeFilter === "BUD/EAC")
                return item.plType === "BUD" || item.plType === "EAC";
              return item.plType === typeFilter;
            };

            const matchesStatus = (item) => {
              if (!statusFilter) return true;
              return item.status === statusFilter;
            };

            // 2. Filter tasks based on search + other filters
            const filteredTasks = parent.tasks.filter((task) => {
              const taskMatchesSearch =
                !lowerFilter || task.projId.toLowerCase().includes(lowerFilter);

              return (
                matchesStatus(task) &&
                matchesType(task) &&
                (parentMatchesSearch || taskMatchesSearch)
              );
            });

            // 3. Parent matches all criteria
            const parentMatchesAll =
              matchesStatus(parent) &&
              matchesType(parent) &&
              parentMatchesSearch;

            // 4. Show group if parent matches or has matching tasks
            if (parentMatchesAll || filteredTasks.length > 0) {
              return {
                ...parent,
                tasks: filteredTasks,
              };
            }
            return null;
          })
          .filter((item) => item !== null)
      : data;

  // Reset handler
  const handleReset = () => {
    setStatusFilter("");
  };

  const getCurrentUserContext = () => {
    try {
      const userString = localStorage.getItem("currentUser");
      if (!userString) return { userId: "", role: "" };
      const userObj = JSON.parse(userString);
      return {
        userId: userObj.userId ?? "",
        role: userObj.role?.toLowerCase() ?? "",
      };
    } catch {
      return { userId: "", role: "" };
    }
  };

  const sortPlansByProjIdPlTypeVersion = (plansArray) => {
    // 1. Define the specific order for the bottom items
    const specialOrder = {
      FRINGE: 1,
      OH: 2,
      OVERHEAD: 2, // Handling both possible naming conventions
      "G&A": 3,
    };

    return [...plansArray].sort((a, b) => {
      const aWeight = specialOrder[a.projId] || 0;
      const bWeight = specialOrder[b.projId] || 0;

      // 2. Logic: If both items are standard projects, sort alphabetically/by version
      if (aWeight === 0 && bWeight === 0) {
        if (a.projId < b.projId) return -1;
        if (a.projId > b.projId) return 1;

        // Secondary sort by Version (descending to help your deduplication Map)
        return (Number(a.version) || 0) - (Number(b.version) || 0);
      }

      // 3. Logic: If one is standard and one is special, standard comes first (weight 0)
      if (aWeight === 0) return -1;
      if (bWeight === 0) return 1;

      // 4. Logic: If both are special, sort by the defined weight
      return aWeight - bWeight;
    });
  };

  const { userId, role, fullName } = getCurrentUserContext();

  // const getAllPlans = async () => {
  //   setLoading(true);
  //   try {
  //     const term = "";
  //     // Note: userId, role, and status should be defined in your component's scope
  //     const response = await axios.get(
  //       `${backendUrl}/Project/GetProjectPlansV1/${userId}/${role}/${term}?status=${status}&type=PROJECT`,
  //     );

  //     // 1. Transform the raw API data into your local state format
  //     const transformedPlans = response.data.map((plan) => ({
  //       plId: plan.plId || plan.id || 0,
  //       projId:
  //         plan.fullProjectId ||
  //         plan.projId ||
  //         plan.project_id ||
  //         plan.projectId ||
  //         "",
  //       projName: plan.projName || plan.description || plan.desc || "",
  //       plType:
  //         plan.plType === "Budget"
  //           ? "BUD"
  //           : plan.plType === "EAC"
  //             ? "EAC"
  //             : plan.plType || "",
  //       source: plan.source || "",
  //       version: plan.version || 0,
  //       versionCode: plan.versionCode || "",
  //       finalVersion: !!plan.finalVersion,
  //       isCompleted: !!plan.isCompleted,
  //       isApproved: !!plan.isApproved,
  //       status:
  //         plan.plType && plan.version
  //           ? (plan.status || "In Progress")
  //               .replace("Working", "In Progress")
  //               .replace("Completed", "Submitted")
  //           : "",
  //       closedPeriod: plan.closedPeriod || "",
  //       templateId: plan.templateId || "",
  //       createdAt: plan.createdAt || "",
  //       updatedAt: plan.updatedAt || "",
  //       modifiedBy: plan.modifiedBy || "",
  //       approvedBy: plan.approvedBy || "",
  //       createdBy: plan.createdBy || "",
  //       projStartDt: plan.projStartDt || "",
  //       projEndDt: plan.projEndDt || "",
  //       orgId: plan.orgId || "",
  //       fundedCost: plan.proj_f_cst_amt || "",
  //       fundedFee: plan.proj_f_fee_amt || "",
  //       fundedRev: plan.proj_f_tot_amt || "",
  //       revenueAccount: plan.revenueAccount || "",
  //       Rev: plan.revenue || plan.Rev || "",
  //       revenue: plan.revenue !== undefined ? Number(plan.revenue) : 0,
  //       acctGrpCd: plan.acctGrpCd || "",
  //     }));

  //     // 2. Sort by ID and then Version (ascending)
  //     const sortedPlans = sortPlansByProjIdPlTypeVersion(transformedPlans);

  //     // 3. DEDUPLICATION: Key by both Project ID AND Plan Type
  //     const uniqueProjectMap = new Map();

  //     sortedPlans.forEach((plan) => {
  //       const existing = uniqueProjectMap.get(plan.projId);

  //       if (!existing) {
  //         // If no entry exists for this ID, add it
  //         uniqueProjectMap.set(plan.projId, plan);
  //       } else {
  //         // If an entry exists, decide if we should overwrite it
  //         const isNewerVersion =
  //           (Number(plan.version) || 0) >= (Number(existing.version) || 0);
  //         const isEACPriority =
  //           plan.plType === "EAC" && existing.plType === "BUD";

  //         // OVERWRITE IF:
  //         // 1. It's a higher (or same) version of the same type
  //         // 2. OR it's an EAC version (which trumps BUD regardless of version in most business cases)
  //         if (
  //           isEACPriority ||
  //           (plan.plType === existing.plType && isNewerVersion)
  //         ) {
  //           uniqueProjectMap.set(plan.projId, plan);
  //         }
  //       }
  //     });

  //     const latestVersionPlans = Array.from(uniqueProjectMap.values());

  //     // Update global plans state
  //     setPlans(latestVersionPlans);

  //     // 4. STRUCTURE DATA (Now simplified because projId is unique)
  //     const topLevelProjects = latestVersionPlans.filter(
  //       (p) => !p.projId.includes("."),
  //     );
  //     const allSubTasks = latestVersionPlans.filter((p) =>
  //       p.projId.includes("."),
  //     );

  //     const structuredData = topLevelProjects
  //       .map((parent) => {
  //         // Find children that belong to this specific parent ID
  //         const children = allSubTasks.filter((task) =>
  //           task.projId.startsWith(parent.projId + "."),
  //         );

  //         // Combine parent and children into the tasks list
  //         // (Filtering out empty plType if necessary)
  //         const combinedTasks = [parent, ...children].filter(
  //           (task) => task.plType !== "",
  //         );

  //         return {
  //           ...parent,
  //           tasks: combinedTasks,
  //         };
  //       })
  //       .filter((parentGroup) => parentGroup.tasks.length > 0);

  //     setData(structuredData);
  //     return latestVersionPlans;
  //   } catch (error) {
  //     console.error("Error refreshing all plans:", error);
  //     return [];
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getAllPlans = async () => {
    setLoading(true);
    try {
      const term = "";
      // Note: userId, role, and status should be defined in your component's scope
      const response = await axios.get(
        `${backendUrl}/Project/GetProjectPlans/${userId}/${role}/?fetchNewBussiness=Y`,
      );

      // 1. Transform the raw API data into your local state format
      const transformedPlans = response.data.map((plan) => ({
        plId: plan.plId || plan.id || 0,
        projId:
          plan.fullProjectId ||
          plan.projId ||
          plan.project_id ||
          plan.projectId ||
          "",
        projName: plan.projName || plan.description || plan.desc || "",
        plType:
          plan.plType === "Budget"
            ? "BUD"
            : plan.plType === "EAC"
              ? "EAC"
              : plan.plType || "",
        source: plan.source || "",
        version: plan.version || 0,
        versionCode: plan.versionCode || "",
        finalVersion: !!plan.finalVersion,
        isCompleted: !!plan.isCompleted,
        isApproved: !!plan.isApproved,
        status:
          plan.plType && plan.version
            ? (plan.status || "In Progress")
                .replace("Working", "In Progress")
                .replace("Completed", "Submitted")
            : "",
        closedPeriod: plan.closedPeriod || "",
        templateId: plan.templateId || "",
        createdAt: plan.createdAt || "",
        updatedAt: plan.updatedAt || "",
        modifiedBy: plan.modifiedBy || "",
        approvedBy: plan.approvedBy || "",
        createdBy: plan.createdBy || "",
        projStartDt: plan.projStartDt || "",
        projEndDt: plan.projEndDt || "",
        orgId: plan.orgId || "",
        fundedCost: plan.proj_f_cst_amt || "",
        fundedFee: plan.proj_f_fee_amt || "",
        fundedRev: plan.proj_f_tot_amt || "",
        revenueAccount: plan.revenueAccount || "",
        Rev: plan.revenue || plan.Rev || "",
        revenue: plan.revenue !== undefined ? Number(plan.revenue) : 0,
        acctGrpCd: plan.acctGrpCd || "",
      }));

      // 2. Sort by ID and then Version (ascending)
      const sortedPlans = sortPlansByProjIdPlTypeVersion(transformedPlans);

      const specialOrder = {
        FRINGE: 1,
        OH: 2,
        OVERHEAD: 3,
        "G&A": 4,
      };

      // FIX: Extract root keys and sort them putting special categories at the bottom
      const uniqueParentIds = Array.from(
        new Set(
          sortedPlans
            .map((p) => String(p.projId || "").split(".")[0])
            .filter(Boolean),
        ),
      ).sort((a, b) => {
        const aWeight = specialOrder[a.toUpperCase()] || 0;
        const bWeight = specialOrder[b.toUpperCase()] || 0;

        // Both are normal standard numeric projects (e.g. "10" vs "2") -> Sort numerically
        if (aWeight === 0 && bWeight === 0) {
          return a.localeCompare(b, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        }

        // Standard numeric projects must always come first
        if (aWeight === 0) return -1;
        if (bWeight === 0) return 1;

        // Both are special, sort by defined strict priority weight order (FRINGE -> OH -> G&A)
        return aWeight - bWeight;
      });

      const latestVersionPlans = []; // Flat tracking list array for setPlans()

      const structuredData = uniqueParentIds
        .map((rootId) => {
          // Find ALL rows (parents, subtasks, BUD, EAC, any version) belonging to this root group
          const allItemsForThisRoot = sortedPlans.filter((p) => {
            return p.projId.split(".")[0] === rootId;
          });

          if (allItemsForThisRoot.length === 0) return null;

          // --- SLOT 1: CHOOSE THE SINGLE LATEST ACTIVE ROW ---
          // Rule: Prioritize ANY EAC plan over BUD plans across the entire group
          const eacPlans = allItemsForThisRoot.filter(
            (p) => p.plType === "EAC",
          );
          const budPlans = allItemsForThisRoot.filter(
            (p) => p.plType === "BUD",
          );

          let latestActiveRow = null;
          if (eacPlans.length > 0) {
            latestActiveRow = eacPlans.reduce(
              (max, p) => (p.version > max.version ? p : max),
              eacPlans[0],
            );
          } else if (budPlans.length > 0) {
            latestActiveRow = budPlans.reduce(
              (max, p) => (p.version > max.version ? p : max),
              budPlans[0],
            );
          }

          // --- SLOT 2: CHOOSE THE LATEST HISTORICAL CONCLUDED ROW ---
          // Filter out the current active plan so we are strictly evaluating true historical entries
          const historicalPool = allItemsForThisRoot.filter((p) => {
            const isConcludedStatus =
              p.status === "Submitted" ||
              p.isCompleted ||
              p.isApproved ||
              p.finalVersion;
            return isConcludedStatus && p.plId !== latestActiveRow?.plId;
          });

          let latestConcludedRow = null;
          if (historicalPool.length > 0) {
            const concludedEAC = historicalPool.filter(
              (p) => p.plType === "EAC",
            );
            const concludedBUD = historicalPool.filter(
              (p) => p.plType === "BUD",
            );

            // Prioritize tracking historical EAC, otherwise fall back to historical BUD
            if (concludedEAC.length > 0) {
              latestConcludedRow = concludedEAC.reduce(
                (max, p) => (p.version > max.version ? p : max),
                concludedEAC[0],
              );
            } else if (concludedBUD.length > 0) {
              latestConcludedRow = concludedBUD.reduce(
                (max, p) => (p.version > max.version ? p : max),
                concludedBUD[0],
              );
            }
          }

          // --- ASSEMBLE EXPANDABLE CHILD TASKS FOR THIS HIERARCHY ---
          const combinedTasks = [];
          if (latestActiveRow) combinedTasks.push(latestActiveRow);
          if (latestConcludedRow) combinedTasks.push(latestConcludedRow);

          // Accumulate into our flat reference tracking list
          combinedTasks.forEach((item) => latestVersionPlans.push(item));

          // Pick the highest version row among our selections to serve as the visual parent row header template
          const primaryParent = combinedTasks.reduce(
            (max, p) => (p.version > max.version ? p : max),
            combinedTasks[0] || allItemsForThisRoot[0],
          );

          // Keep specialized layout accounts (FRINGE, G&A, OH) sorted at the absolute bottom
          combinedTasks.sort((a, b) => {
            const nameA = (a.acctGrpCd || a.projName || "").toUpperCase();
            const nameB = (b.acctGrpCd || b.projName || "").toUpperCase();

            const keys = ["FRINGE", "G&A", "OH", "OVERHEAD"];
            const isA_Fringe = keys.some((k) => nameA.includes(k));
            const isB_Fringe = keys.some((k) => nameB.includes(k));

            if (isA_Fringe && !isB_Fringe) return 1;
            if (!isA_Fringe && isB_Fringe) return -1;

            return a.projId.localeCompare(b.projId, undefined, {
              numeric: true,
            });
          });

          return {
            ...primaryParent,
            projId: rootId,
            tasks: combinedTasks,
          };
        })
        .filter((group) => group !== null && group.tasks.length > 0);

      // Update global states
      setPlans(latestVersionPlans);

      if (selectedPlan) {
        const freshSelectedPlan = latestVersionPlans.find(
          (p) => p.plId === selectedPlan.plId,
        );
        if (freshSelectedPlan) {
          setRefreshPool((prev) => !prev);
          setSelectedPlan(freshSelectedPlan);
        }
      }

      setData(structuredData);
      return latestVersionPlans;
    } catch (error) {
      console.error("Error refreshing all plans:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };
  // Update your useEffect to use this new function
  useEffect(() => {
    getAllPlans();
  }, [refreshData]);

  // Each ID will look like: { "101": { labor: true, amount: false } }
  const [rowViews, setRowViews] = useState({});

  useEffect(() => {
    if (selectedPlan) {
      const project = selectedPlan;
      const startDate = project.startDate || project.projStartDt;
      const endDate = project.endDate || project.projEndDt;

      const startYear = getYear(startDate);
      const endYear = getYear(endDate);
      const currentYear = new Date().getFullYear();

      if (
        startYear &&
        endYear &&
        !isNaN(startYear) &&
        !isNaN(endYear) &&
        startYear <= endYear
      ) {
        const years = [];
        for (let year = startYear; year <= endYear; year++) {
          years.push(year.toString());
        }

        setFiscalYearOptions(["All", ...years]);

        if (years.includes(currentYear.toString())) {
          setFiscalYear(currentYear.toString());
        } else {
          // setFiscalYear("All");
          setFiscalYear("");
        }
      } else {
        setFiscalYearOptions(["All"]);
        // setFiscalYear("All");
        setFiscalYear("");
      }
    } else {
      setFiscalYearOptions(["All"]);
      // setFiscalYear("All");
      setFiscalYear("");
    }
  }, [selectedPlan]);

  useEffect(() => {
    if (!selectedPlan?.projId) return;

    const projId = selectedPlan.projId;
    const currentYearStr = new Date().getFullYear().toString(); // "2026"

    let targetOptions = [];

    // 1. Check if Options are already cached
    if (fiscalYearOptionsMap[projId]) {
      targetOptions = fiscalYearOptionsMap[projId];
    } else {
      // 2. Calculate if NOT in cache
      const startDate = selectedPlan.startDate || selectedPlan.projStartDt;
      const endDate = selectedPlan.endDate || selectedPlan.projEndDt;
      const startYear = getYear(startDate);
      const endYear = getYear(endDate);

      let years = [];
      if (startYear && endYear && startYear <= endYear) {
        for (let y = startYear; y <= endYear; y++) {
          years.push(y.toString());
        }
      }
      targetOptions = ["All", ...years];

      // Store options in cache for next time
      setFiscalYearOptionsMap((prev) => ({ ...prev, [projId]: targetOptions }));
    }

    // 3. Always set the normal fiscalYear state to the current year (if exists) or latest
    // We do this every time the project changes
    const yearsOnly = targetOptions.filter((opt) => opt !== "All");
    const defaultSelection = yearsOnly.includes(currentYearStr)
      ? currentYearStr
      : yearsOnly.length > 0
        ? yearsOnly[yearsOnly.length - 1]
        : "All";

    setFiscalYear(defaultSelection);
  }, [selectedPlan]);

  useEffect(() => {
    const fetchDurations = async () => {
      if (!selectedPlan) return;

      const startDate = selectedPlan?.projStartDt;
      const endDate = selectedPlan?.projEndDt;
      if (!startDate || !endDate) {
        setDurations([]);
        // setIsDurationLoading(false);
        // setIsDataLoading(false);
        return;
      }
      //   setIsDurationLoading(true);
      //   setIsDataLoading(true);
      //   setError(null);
      try {
        let startingDate;
        let endingDate;

        const startStr = startDate.slice(0, 10);
        const endStr = endDate.slice(0, 10);

        if (!fiscalYear || fiscalYear === "All") {
          startingDate = startStr;
          endingDate = endStr;
        } else {
          const year = Number(fiscalYear);
          const fiscalStart = `${year}-01-01`;
          const fiscalEnd = `${year}-12-31`;

          // Take the later of originalStart and fiscalStart
          startingDate = startStr > fiscalStart ? startStr : fiscalStart;

          // Take the earlier of originalEnd and fiscalEnd
          endingDate = endStr < fiscalEnd ? endStr : fiscalEnd;
        }

        const durationResponse = await axios.get(
          `${backendUrl}/Orgnization/GetWorkingDaysForDuration/${startingDate}/${endingDate}`,
        );
        if (!Array.isArray(durationResponse.data)) {
          throw new Error("Invalid duration response format");
        }
        setDurations(durationResponse.data);
      } catch (err) {
        // setError("Failed to load duration data. Please try again.");
        toast.error(
          "Failed to load duration data: " +
            (err.response?.data?.message || err.message),
          {
            toastId: "duration-error",
            autoClose: 3000,
          },
        );
      } finally {
        // setIsDurationLoading(false);
        // setIsDataLoading(false);
      }
    };
    fetchDurations();
    // projectHoursRef.current?.fetchEmployees()
  }, [selectedPlan, fiscalYear]);

  const sortedDurations = useMemo(() => {
    return [...durations]
      .filter((d) => {
        if (normalizedFiscalYear === "All") return true;
        return d.year === parseInt(normalizedFiscalYear);
      })
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.monthNo - b.monthNo;
      });
  }, [durations, normalizedFiscalYear]);

  const isUser = role === "user";

  const getCheckboxProps = (plan, col, idx) => {
    // Basic validation: requires type and version to be interactive
    if (!plan.plType || !plan.version) {
      return { checked: false, disabled: true };
    }

    // Lock everything if the status is already "Transferred"
    if (plan.status?.toLowerCase() === "transferred") {
      return { checked: !!plan[col], disabled: true };
    }

    // 1. Submitted (isCompleted): Disabled if already Approved
    if (col === "isCompleted") {
      return { checked: plan.isCompleted, disabled: !!plan.isApproved };
    }

    // 2. Approved (isApproved): Disabled if Not Submitted, or already Concluded, or if user lacks permission
    if (col === "isApproved") {
      return {
        checked: plan.isApproved,
        disabled: !plan.isCompleted || !!plan.finalVersion || isUser,
      };
    }

    // 3. Concluded (finalVersion): Only one row per Project/Type can be Concluded
    if (col === "finalVersion") {
      const anotherFinalVersion = plans.find(
        (p) =>
          p.plId !== plan.plId &&
          p.plType === plan.plType &&
          p.projId === plan.projId &&
          p.finalVersion,
      );

      return {
        checked: plan.finalVersion,
        disabled:
          !!anotherFinalVersion ||
          !plan.isCompleted ||
          !plan.isApproved ||
          isUser,
      };
    }

    return { checked: !!plan[col], disabled: false };
  };

  const handleCheckboxChange = async (idx, field) => {
    const prevPlans = [...plans];
    const planToUpdate = plans[idx]; // Use the main plans array index
    const planId = planToUpdate.plId;

    console.log(planToUpdate);

    // Validation Guard Clauses
    if (!planToUpdate.plType || !planToUpdate.version) {
      toast.error("Plan Type and Version are required.");
      return;
    }

    // Logical dependencies for Toast errors
    if (field === "isApproved" && !planToUpdate.isCompleted) {
      toast.error("Cannot approve until 'Submitted' is checked.");
      return;
    }
    if (field === "finalVersion" && !planToUpdate.isApproved) {
      toast.error("Cannot conclude until 'Approved' is checked.");
      return;
    }

    // Calculate new state and handle cascades
    let updated = { ...planToUpdate, [field]: !planToUpdate[field] };

    if (field === "isCompleted") {
      updated.status = updated.isCompleted ? "Submitted" : "In Progress";
      if (!updated.isCompleted) {
        updated.isApproved = false;
        updated.finalVersion = false;
      }
    } else if (field === "isApproved") {
      updated.status = updated.isApproved ? "Approved" : "Submitted";
      if (!updated.isApproved) updated.finalVersion = false;
    } else if (field === "finalVersion") {
      updated.status = updated.finalVersion ? "Concluded" : "Approved";
    }

    // Update local state (Optimistic Update)
    const newPlans = plans.map((p) => {
      if (p.plId === planId) return updated;

      // Rule: Ensure only one "Concluded" version exists per Project/Type
      if (field === "finalVersion" && updated.finalVersion) {
        if (p.plType === updated.plType && p.projId === updated.projId) {
          return { ...p, finalVersion: false };
        }
      }
      return p;
    });

    setPlans(newPlans);
    if (typeof onPlanSelect === "function") onPlanSelect(updated);

    setIsUpdating(true);

    // Backend Persistence
    if (planId && Number(planId) > 0) {
      try {
        const payload = {
          plId: updated.plId,
          projId: updated.projId,
          plType: updated.plType,
          version: updated.version,
          finalVersion: updated.finalVersion,
          isCompleted: updated.isCompleted,
          isApproved: updated.isApproved,
          status: updated.status,
          templateId: updated.templateId,
          approvedBy: updated.approvedBy,
          versionCode: updated.versionCode,
          modifiedBy: `${fullName}`,
        };

        await axios.put(`${backendUrl}/Project/UpdateProjectPlan`, payload);
        await getAllPlans(payload.projId); // Sync with database
        toast.success("Status updated successfully.");
      } catch (err) {
        setPlans(prevPlans); // Rollback on failure
        console.log(err);
        toast.error(err.response?.data || err.message);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="bg-white p-2 rounded shadow-sm border border-gray-200 mb-2 overflow-hidden">
        <div className="p-2 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FolderGit2 size={20} className="text-blue-600" /> Quick Budget
          </h2>
        </div>
        <div className="p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
          <div className="flex items-center gap-2">
            <label className="font-semibold text-xs sm:text-sm whitespace-nowrap">
              Project ID:
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 sm:w-64 bg-white shadow-inner"
              placeholder="Type to filter..."
              value={searchQuery} // Live state
              onChange={(e) => setSearchQuery(e.target.value)} // Updates on every letter
              autoComplete="off"
            />
          </div>

          <div className="flex item-center gap-2">
            <div className="flex items-center gap-2 ml-auto pr-2">
              <label className="text-xs font-bold text-gray-500">
                Fiscal Year:
              </label>
              {/* <select
                value={fiscalYear}
                disabled={!selectedPlan}
                onChange={(e) => setFiscalYear(e.target.value)}
                className="border border-gray-300 rounded px-1 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100  "
              >
                {fiscalYearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select> */}
              <select
                // Get selected year from our map
                value={fiscalYear || ""}
                disabled={!selectedPlan}
                onChange={(e) => setFiscalYear(e.target.value)}
                className={`border border-gray-300 rounded px-1 py-1 text-xs ${!selectedPlan ? "bg-gray-200 cursor-not-allowed" : "bg-white cursor-pointer"}`}
              >
                {/* Pull the specific options for THIS project from the map */}
                {(fiscalYearOptionsMap[selectedPlan?.projId] || ["All"]).map(
                  (year) => {
                    console.log(year);
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  },
                )}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-gray-500">Status</span>
              <select
                className="border border-gray-300 rounded px-1 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100  "
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                disabled={data.length === 0}
              >
                <option value="">All</option>
                <option value="In Progress">In Progress</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Concluded">Concluded</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap ">
                Plan Type
              </span>
              <select
                className="border border-gray-300 rounded px-1 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 "
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                // disabled={filteredData.length === 0}
              >
                <option value="">All</option>
                {/* <option value="BUD/EAC">BUD/E AC</option> */}
                <option value="BUD">BUD</option>
                <option value="EAC">EAC</option>
                {/* <option value="NBBUD">NBBUD</option> */}
              </select>
            </div>
            {/* <button className="btn1 btn-blue" onClick={handleReset}>
              Reset
            </button> */}
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto h-[calc(100vh-200px)]">
          <table className="w-full table">
            <thead className="h-5 thead z-[99] fixed">
              <tr>
                <th className="th-thead w-10">
                  {/* <input
                        type="checkbox"
                        className="th-thead"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                      /> */}
                </th>
                {Object.entries(COLUMN_LABELS).map(([key, label]) => {
                  if (key === "selection") return null;

                  // const isLeftCol = key === "projName" || key === "projId"

                  return (
                    <th
                      key={key}
                      className={"th-thead capitalize "}
                      // style={{
                      //   textAlign:
                      //     key === "projId" || key === "projName"
                      //       ? "left"
                      //       : "center",
                      // }}
                    >
                      {label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="tbody">
              {isActionLoading && (
                <tr>
                  <td colSpan={11} className="py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                      <span className="ml-2 text-sm text-gray-700">
                        Processing...
                      </span>
                    </div>
                  </td>
                </tr>
              )}

              {/* Loading state */}
              {!isActionLoading && loading && (
                <tr>
                  <td colSpan={11} className="py-10">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 mt-4 text-sm text-gray-500 font-medium">
                        Loading...
                      </span>
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty state */}
              {!isActionLoading && !loading && data.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="text-center py-20 text-gray-400 font-medium"
                  >
                    No projects found. Try adjusting your filters.
                  </td>
                </tr>
              )}
              {/* ... (Keep your Loading/Empty states here) ... */}

              {!isActionLoading &&
                !loading &&
                filteredData.length > 0 &&
                filteredData.map((parent) => {
                  const isParentExpanded = expandedRows.has(parent.projId);

                  return (
                    <React.Fragment key={parent.projId}>
                      {/* LEVEL 1: TOP-LEVEL PARENT ROW */}
                      <tr
                        className={`cursor-pointer border-b border-gray-300  hover:bg-gray-50 transition-colors`}
                        onClick={() => toggleRow(parent)}
                      >
                        <td className="px-2 py-1 text-xs border-r border-b border-gray-300 text-black text-center">
                          <div className="flex items-center justify-center">
                            {isParentExpanded ? (
                              <MinusIcon size={14} />
                            ) : (
                              <PlusIcon size={14} />
                            )}
                          </div>
                        </td>
                        <td className=" px-2 py-1 text-xs border-r border-b border-gray-300 text-black text-left ">
                          {parent.projId}
                        </td>
                        <td className=" px-2 py-1 text-xs border-r border-b border-gray-300 text-black text-left ">
                          {parent.projName}
                        </td>
                        <td className="tbody-td text-center">
                          {parent.plType}
                        </td>
                        <td className="tbody-td text-center">
                          {parent.version}
                        </td>
                        <td className="tbody-td text-center">
                          {/* {parent.versionCode} */}
                        </td>

                        <td className="tbody-td text-center">
                          {/* {parent.source} */}
                        </td>
                        <td className="tbody-td text-center">
                          {/* {getTemplateName(parent.templateId || 0)} */}
                        </td>
                        <td className="px-2 py-2 text-xs border-r border-gray-300 text-black text-center whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-[12px] capitalize tracking-tighter
                  ${
                    parent.status === "Approved"
                      ? "bg-green-100 text-black"
                      : parent.status === "In Progress"
                        ? "bg-red-100 text-black"
                        : parent.status === "Concluded"
                          ? "bg-blue-200 text-black"
                          : parent.status === "Submitted"
                            ? "bg-yellow-100 text-black"
                            : " text-amber-700 border-amber-200"
                  }`}
                          >
                            {parent.status}
                          </span>
                        </td>
                        <td className="tbody-td text-center">
                          {formatDate(parent.projStartDt)}
                        </td>
                        <td className="tbody-td text-center">
                          {formatDate(parent.projEndDt)}
                        </td>
                      </tr>

                      {/* LEVEL 2: SUB-TASKS (Rendered only if Parent is expanded) */}
                      {isParentExpanded &&
                        parent.tasks &&
                        parent.tasks.map((task) => {
                          const isTaskExpanded = expandedTasks.has(
                            getUniqueKey(task),
                          );
                          const showLaborDetail =
                            !!rowViews[task.projId]?.labor;
                          const showAmountDetail =
                            !!rowViews[task.projId]?.amount;
                          const projectMonthlyData =
                            allMonthlyData[task.projId] || [];
                          const mainIdx = plans?.findIndex(
                            (p) => getUniqueKey(p) === getUniqueKey(task),
                          );

                          return (
                            <React.Fragment key={getUniqueKey(task)}>
                              {/* TASK ROW */}
                              <tr
                                className={`cursor-pointer transition-colors bg-blue-100 border-b border-gray-400 }`}
                                onClick={() => {
                                  toggleTask(task);
                                  setSelectedPlan(task); // Updates durations/monthly data for this task
                                }}
                              >
                                {/* <td className="tbody-td text-center pl-4 bg-blue-200"> */}
                                {/* {isTaskExpanded ? ( */}
                                <td className="text-center border border-gray-300 bg-[#d7ebf3]  z-10 px-2 py-1 text-[13px]">
                                  {isTaskExpanded ? "▼" : "▶"}{" "}
                                </td>

                                <td className=" px-2 py-1 text-xs border-r border-b border-gray-300 text-black text-left">
                                  {task.projId}
                                </td>
                                <td className=" px-2 py-1 text-xs border-r border-b border-gray-300 text-black text-left">
                                  {task.projName}
                                </td>
                                <td className="tbody-td text-center">
                                  {task.plType}
                                </td>
                                <td className="tbody-td text-center">
                                  {task.version}
                                </td>
                                {[
                                  "isCompleted",
                                  "isApproved",
                                  "finalVersion",
                                ].map((col) => {
                                  const props = getCheckboxProps(
                                    task,
                                    col,
                                    mainIdx,
                                  );
                                  return (
                                    <td
                                      key={col}
                                      className="tbody-td text-center border-r border-gray-300"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={props.checked}
                                        // disabled={props.disabled}
                                        disabled={
                                          getCheckboxProps(task, col, mainIdx)
                                            .disabled ||
                                          isUpdating ||
                                          !(
                                            (role === "admin" &&
                                              col === "finalVersion") ||
                                            ((role === "user" ||
                                              role === "admin") &&
                                              col === "isCompleted") ||
                                            ((role === "approver" ||
                                              role === "admin") &&
                                              col === "isApproved")
                                          )
                                        }
                                        className={`w-3 h-3 mt-1 accent-blue-600 ${
                                          isUpdating
                                            ? "cursor-not-allowed opacity-50"
                                            : "cursor-pointer"
                                        }`}
                                        onClick={(e) => e.stopPropagation()} // Prevent row from expanding when clicking checkbox
                                        onChange={(e) => {
                                          e.stopPropagation();
                                          handleCheckboxChange(mainIdx, col);
                                        }}
                                      />
                                    </td>
                                  );
                                })}
                                <td className="px-2 py-2 text-xs border-r border-gray-300 text-black text-center whitespace-nowrap">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[11px] capitalize tracking-tighter
                  ${
                    task.status === "Approved"
                      ? "bg-green-100 text-black"
                      : task.status === "In Progress"
                        ? "bg-red-100 text-black"
                        : task.status === "Concluded"
                          ? "bg-blue-200 text-black"
                          : task.status === "Submitted"
                            ? "bg-yellow-100 text-black"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                                  >
                                    {task.status}
                                  </span>
                                  {/* <span 
                                    className={`px-2 py-0.5 rounded-full text-[11px] capitaalize tracking-tighter 
                                    ${}}
                                      `}
                                  >
                                    {task.status}
                                  </span> */}
                                </td>
                                <td className="tbody-td text-center">
                                  {formatDate(task.projStartDt)}
                                </td>
                                <td className="tbody-td text-center">
                                  {formatDate(task.projEndDt)}
                                </td>
                              </tr>

                              {/* LEVEL 3 & 4: NESTED SUMMARY & PROJECTDETAIL */}
                              {isTaskExpanded && (
                                <tr>
                                  <td
                                    colSpan={11}
                                    className="p-2 bg-gray-50/50 border-b border-gray-300"
                                  >
                                    <div className="relative w-0 min-w-full">
                                      <div className="rounded-lg border border-gray-300 shadow-sm bg-white overflow-hidden">
                                        <div
                                          className="max-h-[600px] overflow-auto 
  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
  [&::-webkit-scrollbar]:w-1.5
  [&::-webkit-scrollbar]:h-1.5
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-track]:bg-transparent"
                                        >
                                          <table className="w-max text-xs border-collapse table-fixed">
                                            <thead>
                                              <tr className="bg-gray-100 border-b border-gray-300">
                                                {/* <th className="sticky left-0 bg-gray-100 z-10 px-4 py-2  text-gray-600 text-left border-r border-gray-300  w-[150px]"> */}
                                                {/* <th className="th-thead capitalize w-[150px]"> */}
                                                <th className="th-thead min-w-[150px] sticky left-0 bg-white z-10 border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                                  Timeline Detail
                                                </th>
                                                {sortedDurations.map(
                                                  (duration) => (
                                                    <th
                                                      key={`${duration.monthNo}-${duration.year}`}
                                                      // className="text-center  border-r border-gray-200 bg-gray-50 min-w-[80px]"
                                                      className="th-thead capitalize"
                                                    >
                                                      {new Date(
                                                        duration.year,
                                                        duration.monthNo - 1,
                                                      ).toLocaleString(
                                                        "default",
                                                        {
                                                          month: "short",
                                                        },
                                                      )}{" "}
                                                      {duration.year}
                                                    </th>
                                                  ),
                                                )}
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {/* SUBTOTAL LABOR ROW (LEVEL 3) */}
                                              <tr
                                                // className="bg-[#d7ebf3] hover:bg-[#c5e1ec] cursor-pointer font-semibold  border-b border-gray-300"
                                                className="bg-white cursor-pointer font-semibold  border-b border-gray-300"
                                                // onClick={() =>
                                                //   setRowViews((prev) => ({
                                                //     ...prev,
                                                //     [task.projId]: {
                                                //       ...prev[task.projId],
                                                //       labor: !showLaborDetail,
                                                //     },
                                                //   }))
                                                // }
                                                onClick={() =>
                                                  setRowViews((prev) => ({
                                                    ...prev,
                                                    [task.projId]: {
                                                      // By NOT spreading ...prev[task.projId] here,
                                                      // or by explicitly setting others to false, we close them.
                                                      labor: !showLaborDetail,
                                                      amount: false, // Force close Non-Labor
                                                      indirect: false, // Force close Indirect
                                                    },
                                                  }))
                                                }
                                              >
                                                {/* <td className="sticky left-0 bg-[#d7ebf3] z-10 px-4 py-2 border-r border-gray-300 min-w-[150px] "> */}
                                                {/* <td className="sticky left-0 bg-white z-10 px-4 py-2 border-r border-gray-300 min-w-[150px] "> */}
                                                {/* <td className="tbody-td min-w-[150px] "> */}
                                                <td className="tbody-td min-w-[150px] sticky left-0 bg-[#e5f3fb] z-10 border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                                  <div className="flex item-center justify-between">
                                                    {/* Main Labor Toggle Row */}
                                                    <div className="flex items-center gap-1 ">
                                                      <span>
                                                        {showLaborDetail
                                                          ? "▼"
                                                          : "▶"}{" "}
                                                        Labor
                                                      </span>
                                                    </div>

                                                    {/* Sub-labels aligned to match the data structure */}
                                                    <div className="flex flex-col text-[10px] text-gray-800 font-normal mt-1 ml-4 leading-tight">
                                                      <span>(Hrs)</span>
                                                      <div className="border-t border-gray-400 w-full my-1"></div>
                                                      <span>(Cost)</span>
                                                    </div>
                                                  </div>
                                                </td>
                                                {sortedDurations.map((d) => {
                                                  const m =
                                                    projectMonthlyData.find(
                                                      (dm) =>
                                                        dm.month ===
                                                          d.monthNo &&
                                                        dm.year === d.year,
                                                    );
                                                  return (
                                                    <td
                                                      key={`${d.year}-${d.monthNo}`} // Using year + month for a safer unique key
                                                      className="text-center px-2 py-1 text-xs border-r border-b border-gray-300 text-black "
                                                    >
                                                      <div className="flex flex-col items-center justify-center min-w-[80px]">
                                                        {/* Hours - Bold or Primary */}
                                                        <span className="">
                                                          {m?.hours?.toFixed(
                                                            2,
                                                          ) || "0.00"}
                                                        </span>

                                                        {/* Labor Cost - Smaller or Secondary with Currency Symbol */}
                                                        <span className="border-t border-gray-300 w-full mt-1 pt-1">
                                                          $
                                                          {m?.laborCost?.toLocaleString(
                                                            undefined,
                                                            {
                                                              minimumFractionDigits: 2,
                                                              maximumFractionDigits: 2,
                                                            },
                                                          ) || "0.00"}
                                                        </span>
                                                      </div>
                                                    </td>
                                                  );
                                                })}
                                              </tr>

                                              {/* LEVEL 4: PROJECT DETAIL (LABOR) */}
                                              {showLaborDetail && (
                                                <tr>
                                                  <td
                                                    colSpan={100}
                                                    className="p-0 border-b border-gray-300 relative"
                                                  >
                                                    <div className="sticky left-0 grid min-w-0 w-[calc(100vw-170px)]">
                                                      <div className="overflow-hidden">
                                                        <ProjectDetail
                                                          plans={plans}
                                                          selectedPlan={task} // Row-specific data
                                                          fiscalYear={
                                                            fiscalYear
                                                          }
                                                          // Dynamic Props:
                                                          // If 'labor' button is clicked, hours becomes true.
                                                          // If 'amount' button is clicked, amount becomes true.
                                                          hours={
                                                            !!rowViews[
                                                              task.projId
                                                            ]?.labor
                                                          }
                                                          amount={false}
                                                          indirect={false}
                                                          hoursColumnTotals={
                                                            hoursColumnTotalsFromHours
                                                          }
                                                          otherColumnTotals={
                                                            otherColumnTotalsFromAmounts
                                                          }
                                                          onColumnTotalsChange={
                                                            setHoursColumnTotalsFromHours
                                                          }
                                                          onColumnAmtTotalsChange={
                                                            setOtherColumnTotalsFromAmounts
                                                          }
                                                          setRefreshData={
                                                            setRefreshData
                                                          }
                                                          setRefreshPool={
                                                            setRefreshPool
                                                          }
                                                          refreshKey={
                                                            refreshKey
                                                          }
                                                          refreshPool={
                                                            refreshPool
                                                          }
                                                          setRefreshKey={
                                                            setRefreshKey
                                                          }
                                                          buttonDisable={false}
                                                        />
                                                      </div>
                                                    </div>
                                                  </td>
                                                </tr>
                                              )}

                                              {/* SUBTOTAL DIRECT COST ROW (LEVEL 3) */}
                                              <tr
                                                // className="bg-[#f0f9ff] hover:bg-[#e0f2fe] cursor-pointer  font-semibold border-b border-gray-300"
                                                className="bg-white cursor-pointer  font-semibold border-b border-gray-300"
                                                // onClick={() =>
                                                //   setRowViews((prev) => ({
                                                //     ...prev,
                                                //     [task.projId]: {
                                                //       ...prev[task.projId],
                                                //       amount: !showAmountDetail,
                                                //     },
                                                //   }))
                                                // }
                                                onClick={() =>
                                                  setRowViews((prev) => ({
                                                    ...prev,
                                                    [task.projId]: {
                                                      amount: !showAmountDetail,
                                                      labor: false, // Force close Labor
                                                      indirect: false, // Force close Indirect
                                                    },
                                                  }))
                                                }
                                              >
                                                {/* <td className="sticky left-0 bg-[#f0f9ff] z-10 px-4 py-2 border-r border-gray-300"> */}
                                                {/* <td className="sticky left-0 bg-white z-10 px-4 py-2 border-r border-gray-300"> */}
                                                <td className="px-2 py-1 text-xs border-b border-gray-300 text-black min-w-[150px] bg-[#e5f3fb] sticky left-0 z-10 border-r text-left shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                                  {showAmountDetail ? "▼" : "▶"}{" "}
                                                  Non-Labor
                                                </td>
                                                {sortedDurations.map(
                                                  (d, index) => {
                                                    const m =
                                                      projectMonthlyData.find(
                                                        (dm) =>
                                                          dm.month ===
                                                            d.monthNo &&
                                                          dm.year === d.year,
                                                      );

                                                    // Force a consistent 2-decimal format
                                                    const displayValue =
                                                      m?.nonLaborCost !==
                                                        undefined &&
                                                      m?.nonLaborCost !== null
                                                        ? Number(
                                                            m.nonLaborCost,
                                                          ).toLocaleString(
                                                            undefined,
                                                            {
                                                              minimumFractionDigits: 2,
                                                              maximumFractionDigits: 2,
                                                            },
                                                          )
                                                        : "0.00";

                                                    return (
                                                      <td
                                                        key={`${d.year}-${d.monthNo}-${index}`} // Using a more unique key to prevent render glitches
                                                        className="px-2 py-1 text-xs border-r border-b border-gray-300 text-black text-center"
                                                      >
                                                        {displayValue}
                                                      </td>
                                                    );
                                                  },
                                                )}
                                              </tr>

                                              {/* LEVEL 4: PROJECT DETAIL (AMOUNT) */}
                                              {showAmountDetail && (
                                                <tr>
                                                  <td
                                                    colSpan={100}
                                                    className="p-0 border-b border-gray-300 relative"
                                                  >
                                                    <div className="sticky left-0 grid min-w-0 w-[calc(100vw-170px)]">
                                                      <div className="overflow-hidden">
                                                        <ProjectDetail
                                                          plans={plans}
                                                          selectedPlan={task} // Row-specific data
                                                          fiscalYear={
                                                            fiscalYear
                                                          }
                                                          // Dynamic Props:
                                                          // If 'labor' button is clicked, hours becomes true.
                                                          // If 'amount' button is clicked, amount becomes true.
                                                          hours={false}
                                                          amount={
                                                            !!rowViews[
                                                              task.projId
                                                            ]?.amount
                                                          }
                                                          indirect={false}
                                                          hoursColumnTotals={
                                                            hoursColumnTotalsFromHours
                                                          }
                                                          otherColumnTotals={
                                                            otherColumnTotalsFromAmounts
                                                          }
                                                          onColumnTotalsChange={
                                                            setHoursColumnTotalsFromHours
                                                          }
                                                          onColumnAmtTotalsChange={
                                                            setOtherColumnTotalsFromAmounts
                                                          }
                                                          setRefreshData={
                                                            setRefreshData
                                                          }
                                                          setRefreshPool={
                                                            setRefreshPool
                                                          }
                                                          refreshKey={
                                                            refreshKey
                                                          }
                                                          refreshPool={
                                                            refreshPool
                                                          }
                                                          setRefreshKey={
                                                            setRefreshKey
                                                          }
                                                          buttonDisable={false}
                                                        />
                                                      </div>
                                                    </div>
                                                  </td>
                                                </tr>
                                              )}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectExpandableTable;
