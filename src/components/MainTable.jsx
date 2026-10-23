// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "./datepicker.css";
// import TimesheetLine from "./TimesheetLine.jsx";
// import TimesheetDetailModal from "./TimesheetDetailModal.jsx";
// import { backendUrl } from "./config.jsx";

// const showToast = (message, type = "info") => {
//   const bgColor =
//     type === "success"
//       ? "#4ade80"
//       : type === "error"
//       ? "#ef4444"
//       : type === "warning"
//       ? "#f59e0b"
//       : "#3b82f6";
//   const toast = document.createElement("div");
//   toast.textContent = message;
//   toast.style.cssText = `
//     position: fixed; top: 20px; right: 20px; z-index: 9999;
//     background: ${bgColor}; color: white; padding: 12px 16px;
//     border-radius: 6px; font-size: 14px; max-width: 300px;
//     box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.3s ease;
//   `;
//   document.body.appendChild(toast);
//   const displayTime = message.includes("import") ? 4000 : 2000;
//   setTimeout(() => {
//     toast.style.opacity = "0";
//     setTimeout(() => document.body.removeChild(toast), 300);
//   }, displayTime);
// };

// const formatDate = (dateInput) => {
//   if (!dateInput) return "";
//   let date;
//   if (dateInput instanceof Date) {
//     date = dateInput;
//   } else {
//     const dateOnlyString = String(dateInput).split("T")[0];
//     const parts = dateOnlyString.split("-");
//     if (parts.length !== 3) return dateInput;
//     const year = parseInt(parts[0], 10);
//     const month = parseInt(parts[1], 10) - 1;
//     const day = parseInt(parts[2], 10);
//     date = new Date(Date.UTC(year, month, day));
//   }
//   if (isNaN(date.getTime())) return "";
//   return new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(date);
// };

// export default function MainTable() {
//   const navigate = useNavigate();
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [userLoaded, setUserLoaded] = useState(false);
//   const [searchDate, setSearchDate] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [timesheetToEdit, setTimesheetToEdit] = useState(null);
//   const [sortConfig, setSortConfig] = useState({
//     key: "Timesheet End Date",
//     direction: "asc",
//   });
//   const [selectedTimesheetData, setSelectedTimesheetData] = useState(null);
//   const [currentSelectedRowId, setCurrentSelectedRowId] = useState(null);
//   const [hoveredRowId, setHoveredRowId] = useState(null);
//   const [isNotifying, setIsNotifying] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [showSubmitDisclaimer, setShowSubmitDisclaimer] = useState(false);
//   const [userDetailsMap, setUserDetailsMap] = useState({});

//   const userRole = currentUser?.role?.toLowerCase();
//   const canNotify = !!currentUser;

//   const dateToYyyyMmDd = (date) => {
//     if (!date || !(date instanceof Date)) return "";
//     const year = date.getUTCFullYear();
//     const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
//     const day = date.getUTCDate().toString().padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const handleDateChange = (e) => {
//     const dateString = e.target.value;
//     if (dateString) {
//       const [year, month, day] = dateString.split("-").map(Number);
//       setSearchDate(new Date(Date.UTC(year, month - 1, day)));
//     } else {
//       setSearchDate(null);
//     }
//   };

//   const columns = [
//     "Status",
//     "Timesheet End Date",
//     "Hours",
//     "Approver",
//     "Approved Date",
//   ];

//   const formatHours = (hours) => {
//     const num = parseFloat(hours);
//     return isNaN(num) ? "0.00" : num.toFixed(2);
//   };

//   const getStatusStyle = (status) => {
//     const baseStyle =
//       "px-2.5 py-1 text-xs font-semibold rounded-full text-center inline-block";
//     const s = status;
//     if (s === "Open") return `${baseStyle} bg-blue-100 text-blue-800`;
//     if (s === "APPROVED") return `${baseStyle} bg-green-100 text-green-800`;
//     if (s?.toLowerCase() === "rejected")
//       return `${baseStyle} bg-red-100 text-red-800`;
//     if (s === "Pending") return `${baseStyle} bg-yellow-100 text-yellow-800`;
//     if (s === "Submitted") return `${baseStyle} bg-purple-100 text-purple-800`;
//     if (s === "INVOICED") return `${baseStyle} bg-yellow-100 text-yellow-800`;
//     if (s === "EXPORTED") return `${baseStyle} bg-blue-100 text-blue-800`;
//     return `${baseStyle} bg-gray-100 text-gray-800`;
//   };

//   useEffect(() => {
//     const userInfo = localStorage.getItem("currentUser");
//     if (userInfo) {
//       try {
//         setCurrentUser(JSON.parse(userInfo));
//       } catch {
//         navigate("/");
//       }
//     } else {
//       navigate("/");
//     }
//     setUserLoaded(true);
//   }, [navigate]);

//   useEffect(() => {
//     const today = new Date();
//     const dayOfWeek = today.getDay();
//     const daysToAdd = (7 - dayOfWeek) % 7;
//     const targetSunday = new Date(today);
//     targetSunday.setDate(today.getDate() + daysToAdd);
//     const searchDateUTC = new Date(
//       Date.UTC(
//         targetSunday.getFullYear(),
//         targetSunday.getMonth(),
//         targetSunday.getDate()
//       )
//     );
//     setSearchDate(searchDateUTC);
//   }, []);

//   useEffect(() => {
//     if (userLoaded && currentUser) {
//       fetchData();
//     }
//   }, [userLoaded, currentUser]);

//   const fetchData = async () => {
//     if (!currentUser) return;
//     setLoading(true);
//     try {
//       const apiUrl = `${backendUrl}/api/SubkTimesheet/ByResource/${currentUser.name}`;
//       const response = await fetch(apiUrl);
//       if (!response.ok)
//         throw new Error("Network response failed while fetching timesheets.");

//       const apiData = await response.json();
//       if (!Array.isArray(apiData) || apiData.length === 0) {
//         setRows([]);
//         return;
//       }

//       const uniqueResourceIds = [
//         ...new Set(apiData.map((item) => item.resource_Id).filter((id) => id)),
//       ];
//       const nameMap = new Map();

//       if (uniqueResourceIds.length > 0) {
//         const namePromises = uniqueResourceIds.map((id) =>
//           fetch(`${backendUrl}/api/PurchaseOrders/ByResourceDetails/${id}`)
//             .then((res) => (res.ok ? res.json() : Promise.resolve(null)))
//             .catch(() => null)
//         );
//         const results = await Promise.all(namePromises);
//         results.forEach((poData, index) => {
//           if (poData && poData.length > 0 && poData[0].resourceName) {
//             const resourceId = uniqueResourceIds[index];
//             nameMap.set(resourceId, poData[0].resourceName);
//           }
//         });
//       }

//       // Build user details map from API data
//       const userMap = {};
//       apiData.forEach((item) => {
//         if (item.pm_User_Id) {
//           userMap[item.pm_User_Id] = item.pm_User_Id; // Store PM User ID
//         }
//       });
//       setUserDetailsMap(userMap);

//       const timesheetMap = new Map();
//       apiData.forEach((item) => {
//         const date = formatDate(item.timesheet_Date);
//         if (timesheetMap.has(date)) {
//           const existing = timesheetMap.get(date);
//           existing.Hours += item.hours;
//           existing.allTimesheets.push(item);
//         } else {
//           timesheetMap.set(date, {
//             ...item,
//             id: item.timesheetId || item.lineNo,
//             Date: date,
//             "Employee ID": item.resource_Id || "",
//             Name:
//               nameMap.get(item.resource_Id) ||
//               item.displayedName ||
//               `Employee ${item.resource_Id}`,
//             Hours: item.hours,
//             "Project ID": item.projId || "",
//             Status: item.status || "OPEN",
//             Approver: item.pm_User_Id || "N/A",
//             "Approver Date": item.approvedDate
//               ? formatDate(item.approvedDate)
//               : "N/A",
//             allTimesheets: [item],
//           });
//         }
//       });

//       setRows(Array.from(timesheetMap.values()));
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//       // showToast('No Timesheet Found', "error");
//       setRows([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNotifyClick = () => {
//     setShowSubmitDisclaimer(true);
//   };

//   const handleNotify = async () => {
//     if (!selectedTimesheetData) {
//       showToast("Please select a timesheet to submit.", "warning");
//       setShowSubmitDisclaimer(false);
//       return;
//     }
//     const allowedStatuses = ["OPEN", "REJECTED"];
//     if (
//       !allowedStatuses.includes(selectedTimesheetData.Status?.toUpperCase())
//     ) {
//       // showToast('Only timesheets with "OPEN", "REJECTED", or "SUBMITTED" status can be submitted.', 'warning');
//       showToast(

//         'Only timesheets with "OPEN" or "REJECTED" status can be submitted.',
//         "warning"
//       );

//       setShowSubmitDisclaimer(false);
//       return;
//     }

//     setIsNotifying(true);
//     try {
//       const requesterId = currentUser.approvalUserId;
//       if (!requesterId) {
//         throw new Error("Your user profile is missing an Approval User ID.");
//       }

//       const payload = selectedTimesheetData.allTimesheets.map((ts) => ({
//         requestType: "TIMESHEET",
//         requesterId: Number(requesterId),
//         timesheetId: Number(ts.lineNo) || Number(ts.timesheetId) || 0,
//         requestData: `Approval requested for week ending ${selectedTimesheetData.Date}.`,
//         projectId: String(ts.projId || ""),
//       }));

//       const notifyUrl = `${backendUrl}/api/Approval/BulkNotify`;
//       const notifyResponse = await fetch(notifyUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!notifyResponse.ok) {
//         const responseClone = notifyResponse.clone();
//         let errorData = "Failed to submit timesheet for notification.";
//         try {
//           const contentType = notifyResponse.headers.get("content-type");
//           if (contentType && contentType.includes("application/json")) {
//             const errorJson = await notifyResponse.json();
//             if (errorJson && errorJson.errors) {
//               errorData = Object.values(errorJson.errors).flat().join(" ");
//             } else if (errorJson.title) {
//               errorData = errorJson.title;
//             } else if (errorJson.message) {
//               errorData = errorJson.message;
//             }
//           } else {
//             errorData = (await responseClone.text()) || errorData;
//           }
//         } catch (parseError) {
//           console.error("Error parsing response:", parseError);
//           errorData = `HTTP ${notifyResponse.status}: ${notifyResponse.statusText}`;
//         }
//         throw new Error(errorData);
//       }

//       setRows((currentRows) =>
//         currentRows.map((row) =>
//           row.id === selectedTimesheetData.id
//             ? { ...row, Status: "Submitted" }
//             : row
//         )
//       );
//       setSelectedTimesheetData(null);
//       setCurrentSelectedRowId(null);
//       showToast(`Successfully submitted timesheet.`, "success");
//       setShowSubmitDisclaimer(false);
//     } catch (error) {
//       console.error("Failed to notify timesheet:", error);
//       showToast(error.message, "error");
//     } finally {
//       setIsNotifying(false);
//     }
//   };

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc")
//       direction = "desc";
//     setSortConfig({ key, direction });
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return " ⇅";
//     return sortConfig.direction === "asc" ? " ↑" : " ↓";
//   };

//   const handleRowClick = (rowData) => {
//     // Close the create modal if it's open
//     setIsModalOpen(false);
//     setTimesheetToEdit(null);

//     setSelectedTimesheetData(rowData);
//     setCurrentSelectedRowId(rowData.id);
//   };

//   const sortedAndFilteredRows = [...rows]
//     .filter((row) => {
//       return !searchDate || row.Date === formatDate(searchDate);
//     })
//     .sort((a, b) => {
//       if (!sortConfig.key) return 0;
//       const key =
//         sortConfig.key === "Timesheet End Date" ? "Date" : sortConfig.key;
//       const aVal = a[key];
//       const bVal = b[key];

//       if (key === "Date") {
//         const dateA = new Date(aVal);
//         const dateB = new Date(bVal);
//         if (dateA < dateB) return sortConfig.direction === "asc" ? -1 : 1;
//         if (dateA > dateB) return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       }

//       if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
//       return 0;
//     });

//   const handleCloseDetail = () => {
//     setSelectedTimesheetData(null);
//     setCurrentSelectedRowId(null);
//   };

//   const handleSaveDetails = async (updatedLines) => {
//     if (!updatedLines || updatedLines.length === 0) {
//       showToast("No data to save.", "error");
//       return;
//     }
//     setIsSaving(true);
//     try {
//       const savePromises = updatedLines.map((line) => {
//         if (typeof line.id === "string" && line.id.startsWith("temp-")) {
//           // POST for new lines could be added here
//         } else {
//           // existing line -> PUT
//           return fetch(`${backendUrl}/api/SubkTimesheet/${line.id}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(line),
//           });
//         }
//       });

//       const responses = await Promise.all(savePromises.filter((p) => p));
//       let allOk = true;
//       for (const response of responses) {
//         if (!response.ok) {
//           allOk = false;
//           const errorText = await response.text();
//           showToast(`Failed to save a line: ${errorText}`, "error");
//           break;
//         }
//       }
//       if (allOk) {
//         showToast("Timesheet updated successfully!", "success");
//         handleCloseDetail();
//         fetchData();
//       }
//     } catch (error) {
//       console.error("Save error:", error);
//       showToast(error.message, "error");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("currentUser");
//     setCurrentUser(null);
//     setUserLoaded(false);
//     navigate("/");
//   };

//   const handleCreateClick = () => {
//     // Close any open detail modal first
//     setSelectedTimesheetData(null);
//     setCurrentSelectedRowId(null);

//     setTimesheetToEdit(null);
//     setIsModalOpen(true);
//   };

//   // const renderTableCell = (row, col) => {
//   //   const key = col === "Timesheet End Date" ? "Date" : col;
//   //   if (key === "Status") {
//   //     const status = row[key] || "";
//   //     const formattedStatus =
//   //       status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
//   //     return <span className={getStatusStyle(status)}>{formattedStatus}</span>;
//   //   }
//   //   if (key === "Hours") {
//   //     return formatHours(row[key]);
//   //   }
//   //   if (key === "Approver") {
//   //     return row[key] || "N/A";
//   //   }
//   //   if (key === "Approver Date") {
//   //     return row[key] || "N/A";
//   //   }
//   //   return row[key];
//   // };

//   const renderTableCell = (row, col) => {
//   const key = col === "Timesheet End Date" ? "Date" :
//              col === "Approved Date" ? "Approver Date" : col;
//   if (key === "Status") {
//     const status = row[key] || "";
//     const formattedStatus =
//       status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
//     return <span className={getStatusStyle(status)}>{formattedStatus}</span>;
//   }
//   if (key === "Hours") {
//     return formatHours(row[key]);
//   }
//   if (key === "Approver") {
//     return row[key] || "N/A";
//   }
//   if (key === "Approver Date") {
//     return row[key] || "N/A";
//   }
//   return row[key];
// };

//   const existingDatesForUser = new Set(rows.map((row) => row.Date));

//   return (
//     <div className="min-h-screen bg-[#f9fafd] flex flex-col pr-4 overflow-auto">
//       <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-8">
//         <div className="w-full flex flex-col items-center">
//           <div className="w-full flex justify-between items-center mb-4 max-w-[calc(100vw-220px)] mx-auto relative">
//             <h1 className="text-lg font-semibold text-gray-700">
//               Welcome, {currentUser?.name}
//             </h1>
//             <button
//               onClick={handleLogout}
//               className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm font-normal shadow transition"
//             >
//               Logout
//             </button>
//           </div>

//           {/* Filters */}
//           <fieldset className="border border-gray-300 rounded-md p-4 mb-4 w-full max-w-[calc(100vw-220px)] mx-auto">
//             <legend className="text-sm font-semibold text-gray-600 px-2">
//               Filters
//             </legend>
//             <div className="flex items-center gap-6 flex-wrap">
//               <div className="flex items-center">
//                 <label
//                   htmlFor="filterDate"
//                   className="mr-2 text-xs font-semibold text-gray-600"
//                 >
//                   Date
//                 </label>
//                 <input
//                   type="date"
//                   id="filterDate"
//                   value={dateToYyyyMmDd(searchDate)}
//                   onChange={handleDateChange}
//                   className="border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                 />
//               </div>
//               <div className="flex items-center">
//                 <label
//                   htmlFor="employeeId"
//                   className="mr-2 text-xs font-semibold text-gray-600"
//                 >
//                   Employee ID
//                 </label>
//                 <input
//                   id="employeeId"
//                   type="text"
//                   value={currentUser?.name || ""}
//                   className="border border-gray-300 rounded px-3 py-1.5 text-xs bg-gray-100 cursor-not-allowed"
//                   disabled
//                 />
//               </div>
//             </div>
//           </fieldset>

//           <div className="border border-gray-300 rounded bg-white shadow-md p-2 w-full max-w-[calc(100vw-220px)] mx-auto">
//             <div className="flex justify-end items-center mb-2">
//               {canNotify && (
//                 <div className="flex gap-2">
//                   <button
//                     onClick={handleCreateClick}
//                     className="bg-green-600 text-white px-4 py-1.5 rounded text-xs"
//                   >
//                     Create
//                   </button>
//                   <button
//                     onClick={handleNotifyClick}
//                     className="bg-orange-600 text-white px-4 py-1.5 rounded text-xs disabled:bg-gray-400"
//                     disabled={
//                       !selectedTimesheetData ||
//                       !["OPEN", "REJECTED"].includes(
//                         selectedTimesheetData.Status?.toUpperCase()
//                       ) ||
//                       isNotifying
//                     }
//                   >
//                     {isNotifying ? "Submitting..." : `Submit`}
//                   </button>
//                 </div>
//               )}
//             </div>
//             <div className="overflow-auto max-h-60">
//               <table className="w-full text-xs border-collapse">
//                 <thead className="sticky top-0 bg-gray-100 z-10">
//                   <tr>
//                     {columns.map((col) => (
//                       <th
//                         key={col}
//                         className="border p-2 font-bold text-blue-800 text-center whitespace-nowrap bg-gray-200 cursor-pointer select-none"
//                         onClick={() => handleSort(col)}
//                       >
//                         <span>
//                           {col}
//                           {getSortIcon(col)}
//                         </span>
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loading ? (
//                     <tr>
//                       <td
//                         colSpan={columns.length}
//                         className="text-center p-5 italic text-gray-500"
//                       >
//                         Loading...
//                       </td>
//                     </tr>
//                   ) : sortedAndFilteredRows.length > 0 ? (
//                     sortedAndFilteredRows.map((row) => {
//                       const isCurrent = currentSelectedRowId === row.id;
//                       const isHovered = hoveredRowId === row.id;
//                       let bgColorClass = "bg-white";
//                       if (isCurrent) bgColorClass = "bg-sky-100";
//                       else if (isHovered) bgColorClass = "bg-gray-50";
//                       return (
//                         <tr
//                           key={row.id}
//                           className={`${bgColorClass} cursor-pointer`}
//                           onClick={() => handleRowClick(row)}
//                           onMouseEnter={() => setHoveredRowId(row.id)}
//                           onMouseLeave={() => setHoveredRowId(null)}
//                         >
//                           {columns.map((col) => (
//                             <td
//                               key={`${row.id}-${col}`}
//                               className="border p-2 text-center whitespace-nowrap"
//                             >
//                               {renderTableCell(row, col)}
//                             </td>
//                           ))}
//                         </tr>
//                       );
//                     })
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan={columns.length}
//                         className="text-center p-5 italic text-gray-500"
//                       >
//                         No data available
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Inline TimesheetLine - Renders below the main table */}
//         {isModalOpen && (
//           <div className="w-full max-w-[calc(100vw-220px)] mx-auto mt-6">
//             <TimesheetLine
//               currentUser={currentUser}
//               onClose={() => {
//                 setIsModalOpen(false);
//                 setTimesheetToEdit(null);
//                 fetchData();
//               }}
//               resourceId={currentUser?.name}
//               existingTimesheetDates={[...existingDatesForUser]}
//               timesheetToEdit={timesheetToEdit}
//             />
//           </div>
//         )}

//         {/* TimesheetDetailModal - Still renders below when a row is selected */}
//         {selectedTimesheetData && (
//           <div className="w-full mt-6" data-timesheet-detail>
//             <TimesheetDetailModal
//               timesheetData={selectedTimesheetData}
//               onClose={handleCloseDetail}
//               onSave={handleSaveDetails}
//               isSaving={isSaving}
//             />
//           </div>
//         )}
//       </div>

//       {/* Submit Disclaimer Modal */}
//       {showSubmitDisclaimer && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
//           <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm mx-4">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Confirm Submission
//             </h3>
//             <p className="text-gray-600 text-sm mb-6">
//               {/* Are you sure you want to submit this timesheet for approval? Once submitted, you may not be able to make further changes without approval. */}
//               By signing this timesheet, I confirm that the recorded hours are
//               accurate and comply with company policies.
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowSubmitDisclaimer(false)}
//                 className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md text-sm font-medium transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleNotify}
//                 className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium transition-colors"
//               >
//                 Confirm Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import { backendUrl } from "./config";
import TimesheetLine from "./TimesheetLine";
import { BriefcaseBusiness } from "lucide-react";
import TimesheetDetailModal from "./TimesheetDetailModal";

const showToast = (message, type = "info") => {
  const bgColor =
    type === "success"
      ? "#4ade80"
      : type === "error"
        ? "#ef4444"
        : type === "warning"
          ? "#f59e0b"
          : "#3b82f6";
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 9999;
    background: ${bgColor}; color: white; padding: 12px 16px;
    border-radius: 6px; font-size: 14px; max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.3s ease;
  `;
  document.body.appendChild(toast);
  const displayTime = message.includes("import") ? 4000 : 2000;
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => document.body.removeChild(toast), 300);
  }, displayTime);
};

const formatDate = (dateInput) => {
  if (!dateInput) return "";
  let date;
  if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    const dateOnlyString = String(dateInput).split("T")[0];
    const parts = dateOnlyString.split("-");
    if (parts.length !== 3) return dateInput;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    date = new Date(Date.UTC(year, month, day));
  }
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }).format(date);
};

export default function MainTable() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [searchDate, setSearchDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timesheetToEdit, setTimesheetToEdit] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "Timesheet End Date",
    direction: "asc",
  });
  const [selectedTimesheetData, setSelectedTimesheetData] = useState(null);
  const [currentSelectedRowId, setCurrentSelectedRowId] = useState(null);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [isNotifying, setIsNotifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSubmitDisclaimer, setShowSubmitDisclaimer] = useState(false);
  const [userDetailsMap, setUserDetailsMap] = useState({});

  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
  const currentYear = String(now.getFullYear());
  const [filterMonth, setFilterMonth] = useState(currentMonth);
  const [filterYear, setFilterYear] = useState(currentYear);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveData, setLeaveData] = useState([]);
  const [leaveLoading, setLeaveLoading] = useState(false);

  const userRole = currentUser?.role?.toLowerCase();
  const canNotify = !!currentUser;

  const dateToYyyyMmDd = (date) => {
    if (!date || !(date instanceof Date)) return "";
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e) => {
    const dateString = e.target.value;
    if (dateString) {
      const [year, month, day] = dateString.split("-").map(Number);
      setSearchDate(new Date(Date.UTC(year, month - 1, day)));
    } else {
      setSearchDate(null);
    }
  };

  const columns = [
    "Status",
    "Timesheet End Date",
    "Hours",
    "Approver",
    "Approved Date",
    "Comment",
    "Created Date",
  ];

  const formatHours = (hours) => {
    const num = parseFloat(hours);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  // const getStatusStyle = (status) => {
  //   const baseStyle =
  //     "px-2.5 py-1 text-xs font-semibold rounded-full text-center inline-block";
  //   const s = status;
  //   if (s === "Open") return `${baseStyle} bg-blue-100 text-blue-800`;
  //   if (s === "APPROVED") return `${baseStyle} bg-green-100 text-green-800`;
  //   if (s?.toLowerCase() === "rejected")
  //     return `${baseStyle} bg-red-100 text-red-800`;
  //   if (s === "Pending") return `${baseStyle} bg-yellow-100 text-yellow-800`;
  //   if (s === "Submitted") return `${baseStyle} bg-purple-100 text-purple-800`;
  //   if (s === "INVOICED") return `${baseStyle} bg-yellow-100 text-yellow-800`;
  //   if (s === "EXPORTED") return `${baseStyle} bg-blue-100 text-blue-800`;
  //   if(s === "Processed") return `${baseStyle} bg-indigo-100 text-indigo-800`;
  //   if(s === "CORRECTION") return `${baseStyle} bg-orange-100 text-orange-800`;
  //   return `${baseStyle} bg-gray-100 text-gray-800`;
  // };

  const getStatusStyle = (status) => {
    const baseStyle =
      "px-2.5 py-1 text-xs font-semibold rounded-full text-center inline-block";

    if (!status) return `${baseStyle} bg-gray-100 text-gray-800`;

    const s = status.toString().toUpperCase().trim();

    switch (s) {
      case "OPEN":
        return `${baseStyle} bg-blue-100 text-blue-800`;
      case "APPROVED":
        return `${baseStyle} bg-green-100 text-green-800`;
      case "REJECTED":
        return `${baseStyle} bg-pink-100 text-pink-700`;
      case "PENDING":
        return `${baseStyle} bg-yellow-100 text-yellow-800`;
      case "SUBMITTED":
        return `${baseStyle} bg-indigo-100 text-indigo-800`;
      case "PROCESSED":
        return `${baseStyle} bg-violet-100 text-violet-800`;
      case "NOTIFIED":
        return `${baseStyle} bg-blue-100 text-blue-800`;
      case "UN-NOTIFIED":
      case "UNNOTIFIED":
        return `${baseStyle} bg-green-100 text-green-800`;
      case "CORRECTION":
        return `${baseStyle} bg-orange-100 text-orange-800`;
      case "INVOICED":
        return `${baseStyle} bg-amber-100 text-amber-800`;
      case "EXPORTED":
        return `${baseStyle} bg-sky-100 text-sky-800`;
      default:
        return `${baseStyle} bg-gray-100 text-gray-800`;
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("currentUser");
    if (userInfo) {
      try {
        setCurrentUser(JSON.parse(userInfo));
      } catch {
        navigate("/");
      }
    } else {
      navigate("/");
    }
    setUserLoaded(true);
  }, [navigate]);
  console.log(currentUser);

  // useEffect(() => {
  //   const today = new Date();
  //   const dayOfWeek = today.getDay();
  //   const daysToAdd = (7 - dayOfWeek) % 7;
  //   const targetSunday = new Date(today);
  //   targetSunday.setDate(today.getDate() + daysToAdd);
  //   const searchDateUTC = new Date(
  //     Date.UTC(
  //       targetSunday.getFullYear(),
  //       targetSunday.getMonth(),
  //       targetSunday.getDate()
  //     )
  //   );
  //   setSearchDate(searchDateUTC);
  // }, []);

  // useEffect(() => {
  //   if (userLoaded && currentUser) {
  //     fetchData();
  //   }
  // }, [userLoaded, currentUser]);
  useEffect(() => {
    if (userLoaded && currentUser && currentUser.name) {
      fetchData();
    }
  }, [userLoaded, currentUser, filterMonth, filterYear]);

  useEffect(() => {
    if (!searchDate) return;
    const [y, m] = searchDate.split("-");
    setFilterYear(y);
    setFilterMonth(m);
  }, [searchDate]);

  useEffect(() => {
    if (currentSelectedRowId) {
      const timer = setTimeout(() => {
        const rowElement = document.getElementById(
          `timesheet-row-${currentSelectedRowId}`,
        );

        if (rowElement) {
          rowElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentSelectedRowId, rows]);

  const fetchData = async () => {
    if (!currentUser) return [];
    setLoading(true);
    try {
      const apiUrl = `${backendUrl}/api/SubkTimesheet/ByResourceV1/${currentUser.name}?month=${filterMonth}&year=${filterYear}`;
      const response = await fetch(apiUrl);
      if (!response.ok)
        throw new Error("Network response failed while fetching timesheets.");

      const apiData = await response.json();
      if (!Array.isArray(apiData) || apiData.length === 0) {
        setRows([]);
        return [];
      }

      const uniqueResourceIds = [
        ...new Set(apiData.map((item) => item.resource_Id).filter((id) => id)),
      ];
      const nameMap = new Map();

      if (uniqueResourceIds.length > 0) {
        const namePromises = uniqueResourceIds.map((id) =>
          fetch(`${backendUrl}/api/PurchaseOrders/ByResourceDetails/${id}`)
            .then((res) => (res.ok ? res.json() : Promise.resolve(null)))
            .catch(() => null),
        );
        const results = await Promise.all(namePromises);
        results.forEach((poData, index) => {
          if (poData && poData.length > 0 && poData[0].resourceName) {
            const resourceId = uniqueResourceIds[index];
            nameMap.set(resourceId, poData[0].resourceName);
          }
        });
      }

      // Build user details map from API data
      const userMap = {};
      apiData.forEach((item) => {
        if (item.pm_User_Id) {
          userMap[item.pm_User_Id] = item.pm_User_Id; // Store PM User ID
        }
      });
      setUserDetailsMap(userMap);

      const timesheetMap = new Map();
      apiData.forEach((item) => {
        const date = formatDate(item.timesheet_Date);
        if (timesheetMap.has(date)) {
          const existing = timesheetMap.get(date);
          existing.Hours += item.hours;
          existing.allTimesheets.push(item);
        } else {
          timesheetMap.set(date, {
            ...item,
            id: item.timesheetId || item.lineNo,
            Date: date,
            "Employee ID": item.resource_Id || "",
            Name:
              nameMap.get(item.resource_Id) ||
              item.displayedName ||
              `Employee ${item.resource_Id}`,
            Hours: item.hours,
            "Project ID": item.projId || "",
            Status: item.status || "OPEN",
            Approver: item.pm_User_Id || "N/A",
            "Approved Date": item.approvedDate
              ? formatDate(item.approvedDate)
              : " ",
            Comment: item.comment || "",
            "Created Date": item.createdAt ? formatDate(item.createdAt) : " ",
            allTimesheets: [item],
          });
        }
      });

      // setRows(Array.from(timesheetMap.values()));
      const finalRows = Array.from(timesheetMap.values());
      setRows(finalRows);

      return finalRows;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      // showToast('No Timesheet Found', "error");
      setRows([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleNotifyClick = () => {
    setShowSubmitDisclaimer(true);
  };

  const handleNotify = async () => {
    if (!selectedTimesheetData) {
      showToast("Please select a timesheet to submit.", "warning");
      setShowSubmitDisclaimer(false);
      return;
    }
    const allowedStatuses = ["OPEN", "REJECTED", "CORRECTION"];
    if (
      !allowedStatuses.includes(selectedTimesheetData.Status?.toUpperCase())
    ) {
      // showToast('Only timesheets with "OPEN", "REJECTED", or "SUBMITTED" status can be submitted.', 'warning');
      showToast(
        'Only timesheets with "OPEN", "REJECTED" or "CORRECTION" status can be submitted.',
        "warning",
      );

      setShowSubmitDisclaimer(false);
      return;
    }

    setIsNotifying(true);
    try {
      // const requesterId = currentUser.approvalUserId;
      const requesterId = currentUser.userId;
      if (!requesterId) {
        throw new Error("Your user profile is missing an Approval User ID.");
      }

      const payload = selectedTimesheetData.allTimesheets.map((ts) => ({
        requestType: "TIMESHEET",
        requesterId: Number(requesterId),
        timesheetId: Number(ts.lineNo) || Number(ts.timesheetId) || 0,
        requestData: `Approval requested for week ending ${selectedTimesheetData.Date}.`,
        projectId: String(ts.projId || ""),
      }));

      const notifyUrl = `${backendUrl}/api/Approval/BulkNotify`;
      const notifyResponse = await fetch(notifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!notifyResponse.ok) {
        const responseClone = notifyResponse.clone();
        let errorData = "Failed to submit timesheet for notification.";
        try {
          const contentType = notifyResponse.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorJson = await notifyResponse.json();
            if (errorJson && errorJson.errors) {
              errorData = Object.values(errorJson.errors).flat().join(" ");
            } else if (errorJson.title) {
              errorData = errorJson.title;
            } else if (errorJson.message) {
              errorData = errorJson.message;
            }
          } else {
            errorData = (await responseClone.text()) || errorData;
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          errorData = `HTTP ${notifyResponse.status}: ${notifyResponse.statusText}`;
        }
        throw new Error(errorData);
      }

      setRows((currentRows) =>
        currentRows.map((row) =>
          row.id === selectedTimesheetData.id
            ? { ...row, Status: "Submitted" }
            : row,
        ),
      );
      setSelectedTimesheetData(null);
      setCurrentSelectedRowId(null);
      showToast(`Successfully submitted timesheet.`, "success");
      setShowSubmitDisclaimer(false);
    } catch (error) {
      console.error("Failed to notify timesheet:", error);
      showToast(error.message, "error");
    } finally {
      setIsNotifying(false);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  function parseMonthYear(dateStr) {
    if (!dateStr) return [null, null];
    // MM/DD/YYYY format
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
      const [mm, , yyyy] = dateStr.split("/");
      return [Number(mm), Number(yyyy)];
    }
    // YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [yyyy, mm] = dateStr.split("-");
      return [Number(mm), Number(yyyy)];
    }
    // Fallback: try Date object
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return [null, null];
    return [d.getMonth() + 1, d.getFullYear()];
  }

  useEffect(() => {
    if (filterMonth && filterYear) {
      setSearchDate(`${filterYear}-${filterMonth}-01`);
    }
  }, [filterMonth, filterYear]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return " ⇅";
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

  const handleRowClick = (rowData) => {
    // Close the create modal if it's open
    setIsModalOpen(false);
    setTimesheetToEdit(null);

    setSelectedTimesheetData(rowData);
    setCurrentSelectedRowId(rowData.id);
  };

  // const sortedAndFilteredRows = [...rows]
  //   .filter((row) => {
  //     // return !searchDate || row.Date === formatDate(searchDate);
  //     if (!searchDate) return true;

  //     const filterYear = new Date(searchDate).getFullYear();
  //     const filterMonth = new Date(searchDate).getMonth(); // zero-based

  //     const rowDate = new Date(row.Date);
  //     return (
  //       rowDate.getFullYear() === filterYear &&
  //       rowDate.getMonth() === filterMonth
  //     );
  //   })
  //   .sort((a, b) => {
  //     if (!sortConfig.key) return 0;
  //     const key =
  //       sortConfig.key === "Timesheet End Date" ? "Date" : sortConfig.key;
  //     const aVal = a[key];
  //     const bVal = b[key];

  //     if (key === "Date") {
  //       const dateA = new Date(aVal);
  //       const dateB = new Date(bVal);
  //       if (dateA < dateB) return sortConfig.direction === "asc" ? -1 : 1;
  //       if (dateA > dateB) return sortConfig.direction === "asc" ? 1 : -1;
  //       return 0;
  //     }

  //     if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
  //     if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
  //     return 0;
  //   });

  console.log("Rows from API:", rows);

  const sortedAndFilteredRows = [...rows]
    .filter((row) => {
      if (!filterMonth || !filterYear) return true; // Show all if no filter selected

      const [rowMonth, rowYear] = parseMonthYear(row.Date);
      const filterMonthNum = Number(filterMonth);
      const filterYearNum = Number(filterYear);

      return rowMonth === filterMonthNum && rowYear === filterYearNum;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const key =
        sortConfig.key === "Timesheet End Date" ? "Date" : sortConfig.key;
      const aVal = a[key];
      const bVal = b[key];
      if (key === "Date") {
        const dateA = new Date(aVal),
          dateB = new Date(bVal);
        if (dateA < dateB) return sortConfig.direction === "asc" ? -1 : 1;
        if (dateA > dateB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  // const sortedAndFilteredRows = [...rows]
  //   .filter((row) => {
  //     if (!searchDate) return true;

  //     // Parse year and month from searchDate
  //     const filterYear = new Date(searchDate).getFullYear();
  //     const filterMonth = new Date(searchDate).getMonth(); // zero-based

  //     const rowDate = new Date(
  //       row.Date || row["Timesheet Date"] || row.originalDate
  //     );

  //     // Defensive check for invalid date
  //     if (isNaN(rowDate.getTime())) return false;

  //     return (
  //       rowDate.getFullYear() === filterYear &&
  //       rowDate.getMonth() === filterMonth
  //     );
  //   })
  //   .sort((a, b) => {
  //     if (!sortConfig.key) return 0;
  //     const key =
  //       sortConfig.key === "Timesheet End Date" ? "Date" : sortConfig.key;
  //     const aVal = a[key];
  //     const bVal = b[key];

  //     if (key === "Date") {
  //       const dateA = new Date(aVal);
  //       const dateB = new Date(bVal);
  //       if (dateA < dateB) return sortConfig.direction === "asc" ? -1 : 1;
  //       if (dateA > dateB) return sortConfig.direction === "asc" ? 1 : -1;
  //       return 0;
  //     }

  //     if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
  //     if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;

  //     return 0;
  //   });

  const handleCloseDetail = () => {
    setSelectedTimesheetData(null);
    setCurrentSelectedRowId(null);
  };

  // const handleSaveDetails = async (updatedLines) => {
  //   if (!updatedLines || updatedLines.length === 0) {
  //     showToast("No data to save.", "error");
  //     return;
  //   }
  //   setIsSaving(true);
  //   try {
  //     const savePromises = updatedLines.map((line) => {
  //       if (typeof line.id === "string" && line.id.startsWith("temp-")) {
  //         // POST for new lines could be added here
  //       } else {
  //         // existing line -> PUT
  //         return fetch(`${backendUrl}/api/SubkTimesheet/${line.id}`, {
  //           method: "PUT",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify(line),
  //         });
  //       }
  //     });

  //     const responses = await Promise.all(savePromises.filter((p) => p));
  //     let allOk = true;
  //     for (const response of responses) {
  //       if (!response.ok) {
  //         allOk = false;
  //         const errorText = await response.text();
  //         showToast(`Failed to save a line: ${errorText}`, "error");
  //         break;
  //       }
  //     }
  //     if (allOk) {
  //       showToast("Timesheet updated successfully!", "success");
  //       handleCloseDetail();
  //       fetchData();
  //     }
  //   } catch (error) {
  //     console.error("Save error:", error);
  //     showToast(error.message, "error");
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  const handleSaveDetails = async () => {
    const currentId = currentSelectedRowId;

    const newRows = await fetchData();

    if (currentId && newRows && newRows.length > 0) {
      const updatedRow = newRows.find((row) => row.id === currentId);

      if (updatedRow) {
        setSelectedTimesheetData(updatedRow);
      } else {
        handleCloseDetail();
      }
    } else {
      handleCloseDetail();
    }

    setIsSaving(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setUserLoaded(false);
    navigate("/");
  };

  const handleLeaveBalance = async () => {
    if (!currentUser || !currentUser.name) {
      showToast("User session not found.", "error");
      return;
    }

    const currentYear = new Date().getFullYear();
    setShowLeaveModal(true);
    setLeaveLoading(true);

    try {
      const response = await fetch(
        `${backendUrl}/api/EmployeeLeaveBeginningBalance/GetByEmployeeLeaves/${currentUser.name}?leaveYear=${currentYear}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLeaveData(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast(`Error fetching leave balance: ${error.message}`, "error");
      setLeaveData([]);
    } finally {
      setLeaveLoading(false);
    }
  };

  const handleCreateClick = () => {
    // Close any open detail modal first
    setSelectedTimesheetData(null);
    setCurrentSelectedRowId(null);

    setTimesheetToEdit(null);
    setIsModalOpen(true);
  };

  function formatDateToMMDDYYYY(dateInput) {
    if (!dateInput) return "";

    let dateObj;

    if (dateInput instanceof Date) {
      dateObj = dateInput;
    } else if (typeof dateInput === "string") {
      // Try parsing string formats like "7/8/2025", "2025-07-08"
      // First attempt Date constructor; fallback to manual parsing if needed
      dateObj = new Date(dateInput);
      if (isNaN(dateObj.getTime())) {
        // Manual parse for formats "M/D/YYYY" or "MM/DD/YYYY"
        const parts = dateInput.split(/[\/\-]/);
        if (parts.length === 3) {
          let month = parseInt(parts[0], 10);
          let day = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);
          if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
            dateObj = new Date(year, month - 1, day);
          } else {
            return dateInput; // fallback plain string if invalid
          }
        } else {
          return dateInput; // fallback plain string if invalid
        }
      }
    } else {
      return "";
    }

    // Format padded MM/DD/YYYY
    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(dateObj.getMonth() + 1)}/${pad(
      dateObj.getDate(),
    )}/${dateObj.getFullYear()}`;
  }

  const renderTableCell = (row, col) => {
    const key = col === "Timesheet End Date" ? "Date" : col;
    if (key === "Status") {
      const status = row[key] || "";
      const formattedStatus =
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
      return <span className={getStatusStyle(status)}>{formattedStatus}</span>;
    }
    if (key === "Hours") {
      return formatHours(row[key]);
    }
    if (key === "Approver") {
      return row[key] || "N/A";
    }
    if (key === "Approved Date") {
      return row[key] || "N/A";
    }
    if (key === "Created Date") {
      return row[key] || "N/A";
    }
    if (
      key === "Approved Date" ||
      key === "Created Date" ||
      key === "Date" // Include "Date" if you want uniform formatting on timesheet date
    ) {
      return row[key] ? formatDateToMMDDYYYY(row[key]) : "N/A";
    }
    return row[key];
  };

  const existingDatesForUser = new Set(rows.map((row) => row.Date));

  return (
    <div className="space-y-2 text-sm sm:text-base text-gray-800">
      <div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-white rounded-sm p-4">
            <BriefcaseBusiness size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">
              Create Timesheet
            </h2>
          </div>

          {/* Filters Card */}
          {/* max-w-[calc(100vw-220px)] */}
          <div className="bg-white py-2 rounded mt-2">
            <div className="px-4 pb-2">
              <fieldset className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
                <legend className="text-xs font-semibold text-gray-600 px-2">
                  Filters
                </legend>

                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="filterMonthYear"
                      className="font-semibold text-xs sm:text-sm whitespace-nowrap text-gray-700"
                    >
                      Month/Year:
                    </label>
                    <DatePicker
                      id="filterMonthYear"
                      selected={
                        filterMonth && filterYear
                          ? new Date(`${filterYear}-${filterMonth}-01T00:00:00`)
                          : null
                      }
                      onChange={(date) => {
                        if (date) {
                          const newMonth = String(date.getMonth() + 1).padStart(
                            2,
                            "0",
                          );
                          const newYear = String(date.getFullYear());
                          setFilterMonth(newMonth);
                          setFilterYear(newYear);
                        } else {
                          setFilterMonth("");
                          setFilterYear("");
                        }
                      }}
                      showMonthYearPicker
                      dateFormat="MM/yyyy"
                      placeholderText="MM/YYYY"
                      className="border border-gray-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-inner min-w-[120px]"
                      showPopperArrow={false}
                      autoComplete="off"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="employeeId"
                      className="font-semibold text-xs sm:text-sm whitespace-nowrap text-gray-700"
                    >
                      Employee ID:
                    </label>
                    <input
                      id="employeeId"
                      type="text"
                      value={currentUser?.name || ""}
                      className="border border-gray-300 rounded px-2.5 py-1.5 text-xs bg-gray-100 text-gray-700 cursor-not-allowed shadow-inner min-w-[120px]"
                      disabled
                    />
                  </div>
                </div>
              </fieldset>
            </div>

            {/* Table Container Card */}
            <div className="border border-gray-200 rounded-sm bg-white p-3 w-full mx-auto">
              <div className="flex justify-end items-center mb-2.5">
                {canNotify && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleLeaveBalance}
                      className="btn1 btn-blue cursor-pointer"
                    >
                      Leave
                    </button>
                    <button
                      onClick={handleCreateClick}
                      className="btn1 btn-blue cursor-pointer"
                    >
                      Create
                    </button>
                    <button
                      onClick={handleNotifyClick}
                      className="btn1 btn-blue cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      disabled={
                        !selectedTimesheetData ||
                        !["OPEN", "REJECTED", "CORRECTION"].includes(
                          selectedTimesheetData.Status?.toUpperCase(),
                        ) ||
                        isNotifying
                      }
                    >
                      {isNotifying ? "Submitting..." : `Submit`}
                    </button>
                  </div>
                )}
              </div>
              <div className="overflow-auto max-h-72 border border-gray-300 rounded-lg scrollbar-thin">
                <table className="w-full text-xs border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col}
                          className="px-2 py-1.5 whitespace-nowrap border-r border-b border-gray-300 text-xs font-semibold bg-[#e5f3fb] text-black text-center cursor-pointer select-none last:border-r-0"
                          onClick={() => handleSort(col)}
                        >
                          <span className="inline-flex items-center gap-1">
                            {col}
                            {getSortIcon(col)}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-center p-8 italic text-gray-500 bg-white"
                        >
                          Loading...
                        </td>
                      </tr>
                    ) : sortedAndFilteredRows.length > 0 ? (
                      sortedAndFilteredRows.map((row) => {
                        const isCurrent = currentSelectedRowId === row.id;
                        const isHovered = hoveredRowId === row.id;
                        let bgColorClass = "bg-white";
                        if (isCurrent) bgColorClass = "bg-[#e9f6fb]";
                        else if (isHovered) bgColorClass = "bg-gray-50";
                        return (
                          <tr
                            id={`timesheet-row-${row.id}`}
                            key={row.id}
                            className={`${bgColorClass} cursor-pointer transition-colors`}
                            onClick={() => handleRowClick(row)}
                            onMouseEnter={() => setHoveredRowId(row.id)}
                            onMouseLeave={() => setHoveredRowId(null)}
                          >
                            {columns.map((col) => (
                              <td
                                key={`${row.id}-${col}`}
                                className="px-2 py-1.5 text-center whitespace-nowrap border-r border-b border-gray-300 text-xs text-black last:border-r-0"
                              >
                                {renderTableCell(row, col)}
                              </td>
                            ))}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="text-center p-8 italic text-gray-500 bg-white"
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Leave Balance Modal */}
          {showLeaveModal && (
            <div
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
              onClick={() => setShowLeaveModal(false)}
            >
              <div
                className="bg-white rounded-xl p-6 w-full max-w-4xl shadow-2xl border border-gray-100 font-inter"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                  <h3 className="text-base font-bold text-gray-900">
                    Employee Leave Balances ({new Date().getFullYear()})
                  </h3>
                  <button
                    onClick={() => setShowLeaveModal(false)}
                    className="btn1 btn-blue !py-1 !px-3 text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <div className="overflow-auto max-h-[60vh] border border-gray-300 rounded-lg">
                  {leaveLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-xs font-medium text-gray-600">
                        Loading leave data...
                      </span>
                    </div>
                  ) : (
                    <table className="w-full text-xs border-collapse">
                      <thead className="sticky top-0 bg-[#e5f3fb] z-10">
                        <tr>
                          <th className="px-3 py-2 border-r border-b border-gray-300 font-semibold text-black text-center">
                            Leave Code
                          </th>
                          <th className="px-3 py-2 border-r border-b border-gray-300 font-semibold text-black text-left">
                            Leave Type Name
                          </th>
                          <th className="px-3 py-2 border-r border-b border-gray-300 font-semibold text-black text-center">
                            Beginning Balance
                          </th>
                          <th className="px-3 py-2 border-r border-b border-gray-300 font-semibold text-black text-center">
                            Carried Forward
                          </th>
                          <th className="px-3 py-2 border-r border-b border-gray-300 font-semibold text-black text-center">
                            Adjustments
                          </th>
                          <th className="px-3 py-2 border-r border-b border-gray-300 font-semibold text-black text-center">
                            Accrued Hours
                          </th>
                          <th className="px-3 py-2 border-r border-b border-gray-300 font-semibold text-black text-center">
                            Leave Taken
                          </th>
                          <th className="px-3 py-2 border-b border-gray-300 font-semibold text-black text-center">
                            Available Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {leaveData.length > 0 ? (
                          leaveData.map((item, idx) => (
                            <tr
                              key={idx}
                              className={
                                idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                              }
                            >
                              <td className="px-3 py-2 text-center border-r border-b border-gray-300 font-bold text-blue-700">
                                {item.leaveTypeCode}
                              </td>
                              <td className="px-3 py-2 text-left border-r border-b border-gray-300 font-medium text-gray-800">
                                {item.leaveTypeName}
                              </td>
                              <td className="px-3 py-2 text-center border-r border-b border-gray-300">
                                {item.beginningBalance}
                              </td>
                              <td className="px-3 py-2 text-center border-r border-b border-gray-300">
                                {item.carriedForward}
                              </td>
                              <td className="px-3 py-2 text-center border-r border-b border-gray-300">
                                {item.beginningAdjustments}
                              </td>
                              <td className="px-3 py-2 text-center border-r border-b border-gray-300">
                                {item.accruedHours}
                              </td>
                              <td className="px-3 py-2 text-center border-r border-b border-gray-300">
                                {item.leaveTakenHours}
                              </td>
                              <td className="px-3 py-2 text-center border-b border-gray-300 font-bold text-green-600 bg-green-50/40">
                                {item.availableBalance}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="8"
                              className="text-center p-8 italic text-gray-500"
                            >
                              No leave balance records found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Inline TimesheetLine - Renders below the main table */}
          {isModalOpen && (
            <div className="w-full mx-auto mt-4">
              <TimesheetLine
                currentUser={currentUser}
                onClose={async (createdDateISO) => {
                  setIsModalOpen(false);
                  setTimesheetToEdit(null);

                  const newRows = await fetchData();

                  if (createdDateISO && newRows && newRows.length > 0) {
                    const targetDate = formatDate(createdDateISO);

                    const newRow = newRows.find((r) => r.Date === targetDate);

                    if (newRow) {
                      setSelectedTimesheetData(newRow);

                      setCurrentSelectedRowId(newRow.id);
                    }
                  }
                }}
                resourceId={currentUser?.name}
                userId={currentUser?.userId}
                existingTimesheetDates={[...existingDatesForUser]}
                timesheetToEdit={timesheetToEdit}
                isAdmin={userRole === "admin"}
              />
            </div>
          )}

          {/* TimesheetDetailModal - Still renders below when a row is selected */}
          {selectedTimesheetData && (
            <div className="w-full mt-4" data-timesheet-detail>
              <TimesheetDetailModal
                timesheetData={selectedTimesheetData}
                onClose={handleCloseDetail}
                onSave={handleSaveDetails}
                currentUser={currentUser}
                isSaving={isSaving}
              />
            </div>
          )}
        </div>

        {/* Submit Disclaimer Modal */}
        {showSubmitDisclaimer && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[10000] p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full border border-gray-100 animate-premium-popup">
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Confirm Submission
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-6 leading-relaxed">
                By signing this timesheet, I confirm that the recorded hours are
                accurate and comply with company policies.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowSubmitDisclaimer(false)}
                  className="btn1 btn-blue cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNotify}
                  className="btn1 btn-blue cursor-pointer"
                >
                  Confirm Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
